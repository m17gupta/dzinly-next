import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cookies } from 'next/headers';
import { websiteService } from '@/lib/websites/website-service';
import { z } from 'zod';

const schema = z.object({
  header: z.object({
    logoUrl: z.string().url().nullable().optional(),
    navLinks: z.array(z.object({ label: z.string(), href: z.string() })).default([])
  }).partial(),
  footer: z.object({
    text: z.string().nullable().optional(),
    links: z.array(z.object({ label: z.string(), href: z.string() })).default([])
  }).partial(),
}).partial();

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const wid = (await cookies()).get('current_website_id')?.value;
  if (!wid) return NextResponse.json({ error: 'No website selected' }, { status: 400 });
  const website = await websiteService.getByWebsiteId(wid);
  if (!website || String(website.tenantId) !== session.user.tenantId) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const json = await req.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload', issues: parsed.error.flatten() }, { status: 400 });

  const branding = { ...(website.branding || {}), ...parsed.data } as any;
  const ok = await websiteService.updateBranding(wid, branding);
  if (!ok) return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  return NextResponse.json({ ok: true, branding });
}
