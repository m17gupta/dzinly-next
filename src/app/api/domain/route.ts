import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { websiteService } from '@/lib/websites/website-service';
import { tenantService } from '@/lib/tenant/tenant-service';

const createSchema = z.object({
  name: z.string().min(1),
  serviceType: z.enum(['WEBSITE_ONLY', 'ECOMMERCE']),
  primaryDomain: z.array(z.string().url()).optional().nullable(),
  // Or if you want to ensure at least one domain when provided:
  // primaryDomain: z.array(z.string().url()).min(1).optional().nullable(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const items = await websiteService.listByTenant(session.user.tenantId);
  return NextResponse.json({ items });
}

// export async function POST(req: Request) {
//   const session = await auth();
//   if (!session?.user?.tenantId || !session.user.tenantSlug) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   const json = await req.json();
//   const parsed = createSchema.safeParse(json);
//   if (!parsed.success) return NextResponse.json({ error: 'Invalid payload', issues: parsed.error.flatten() }, { status: 400 });
//   const tenant = await tenantService.getTenantById(session.user.tenantId);
//   if (!tenant || tenant.status !== 'active') return NextResponse.json({ error: 'Tenant inactive' }, { status: 403 });
//   const created = await websiteService.create({
//     tenantId: session.user.tenantId,
//     tenantSlug: session.user.tenantSlug,
//     name: parsed.data.name,
//     serviceType: parsed.data.serviceType,
//     ...(parsed.data.primaryDomain ? { primaryDomain: parsed.data.primaryDomain } : {}),
//   });
//   return NextResponse.json(created, { status: 201 });
// }


export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId || !session.user.tenantSlug) 
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const json = await req.json();
  const parsed = createSchema.safeParse(json);
  
  if (!parsed.success) 
    return NextResponse.json({ error: 'Invalid payload', issues: parsed.error.flatten() }, { status: 400 });
  
  const tenant = await tenantService.getTenantById(session.user.tenantId);
  if (!tenant || tenant.status !== 'active') 
    return NextResponse.json({ error: 'Tenant inactive' }, { status: 403 });
  
  const created = await websiteService.create({
    tenantId: session.user.tenantId,
    tenantSlug: session.user.tenantSlug,
    name: parsed.data.name,
    serviceType: parsed.data.serviceType,
    // Handle array properly - check if it exists and has items
    ...(parsed.data.primaryDomain && parsed.data.primaryDomain.length > 0 
      ? { primaryDomain: parsed.data.primaryDomain } 
      : {}),
  });
  
  return NextResponse.json(created, { status: 201 });
}