import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { mediaService } from '@/modules/website/media-service';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { cookies } = await import('next/headers');
  const jar = await cookies();
  const websiteId = jar.get('current_website_id')?.value;
  const item = await mediaService.getById(session.user.tenantId, resolvedParams.id, websiteId);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const ok = await mediaService.remove(session.user.tenantId, resolvedParams.id);
  return NextResponse.json({ ok });
}
