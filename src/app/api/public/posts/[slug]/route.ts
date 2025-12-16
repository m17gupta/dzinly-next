import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { postService } from '@/modules/website/post-service';
import { auth } from '@/auth';

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;

  const session = await auth();
  const websiteId = (await cookies()).get('current_website_id')?.value;
  const tenantId = (session?.user?.tenantId as string | undefined) || (await headers()).get('x-tenant-id') || '';
  if (!tenantId) return NextResponse.json({ error: 'Tenant unresolved' }, { status: 400 });
  const doc = await postService.getBySlugForWebsite(tenantId, resolvedParams.slug, websiteId);
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ item: doc });
}
