import { NextResponse } from 'next/server';
import { z } from 'zod';
import { tenantService } from '@/lib/tenant/tenant-service';
import { userService } from '@/lib/auth/user-service';
import { websiteService } from '@/lib/websites/website-service';

const schema = z.object({
  tenantSlug: z.string().min(3).max(40).regex(/^[a-z0-9-]+$/i, 'Use letters, numbers or dashes'),
  tenantName: z.string().min(3).max(80),
  adminEmail: z.string().email(),
  adminPassword: z.string().min(6).max(100),
  websiteName: z.string().min(2).max(80),
  serviceType: z.enum(['WEBSITE_ONLY', 'ECOMMERCE']).default('WEBSITE_ONLY'),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: 'Invalid payload', issues: parsed.error.flatten() }, { status: 400 });
    }

    const { tenantSlug, tenantName, adminEmail, adminPassword, websiteName, serviceType } = parsed.data;

    // Create tenant
    const tenant = await tenantService.createTenant({ slug: tenantSlug, name: tenantName, email: adminEmail, plan: 'trial' });

    // Create owner user
    await userService.createUser({ tenantId: tenant._id, email: adminEmail, password: adminPassword, name: tenantName + ' Owner', role: 'A' });

    // Create default website for tenant
    const website = await websiteService.create({ tenantId: tenant._id, tenantSlug: tenant.slug, name: websiteName, serviceType });

    // Do not auto sign-in here; return details to allow redirect to signin with tenant prefilled
    return NextResponse.json({ ok: true, tenantId: String(tenant._id), tenantSlug: tenant.slug, websiteId: website.websiteId, systemSubdomain: website.systemSubdomain });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Internal Error';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
