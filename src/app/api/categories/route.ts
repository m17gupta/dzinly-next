import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { websiteCategoryService } from '@/modules/website/category-service';
import { z } from 'zod';

const createSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  parentId: z.string().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { cookies } = await import('next/headers');
  const jar = await cookies();
  const websiteId = jar.get('current_website_id')?.value;
  const items = await websiteCategoryService.list(session.user.tenantId as string, websiteId);
  return NextResponse.json({ items, meta: { total: items.length, limit: items.length, skip: 0, hasMore: false } });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const json = await req.json();
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload', issues: parsed.error.flatten() }, { status: 400 });
  const { cookies } = await import('next/headers');
  const jar = await cookies();
  const websiteId = jar.get('current_website_id')?.value;
  const created = await websiteCategoryService.create(session.user.tenantId as string, parsed.data, websiteId);
  return NextResponse.json(created, { status: 201 });
}
