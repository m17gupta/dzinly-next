import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { productVariantService } from '@/modules/ecommerce/variant-service';
import { z } from 'zod';

const createSchema = z.object({
  productId: z.string().min(1),
  sku: z.string().optional(),
  name: z.string().min(1),
  options: z.record(z.string(), z.string()).default({}),
  pricing: z.object({ basePrice: z.number(), salePrice: z.number().optional() }),
  inventory: z.object({ stockQuantity: z.number().int(), lowStockThreshold: z.number().int().optional() }).optional(),
  images: z.array(z.string()).optional(),
  isDefault: z.boolean().default(false),
});

function toNumber(v: string | null, def: number, min = 0, max = 100) {
  const n = v ? parseInt(v, 10) : def;
  if (Number.isNaN(n)) return def;
  return Math.max(min, Math.min(max, n));
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId') || undefined;
  const skip = toNumber(searchParams.get('skip'), 0, 0, 10000);
  const limit = toNumber(searchParams.get('limit'), 20, 1, 100);
  const { cookies } = await import('next/headers');
  const jar = await cookies();
  const websiteId = jar.get('current_website_id')?.value;
  const items = await productVariantService.list(session.user.tenantId as string, productId, { skip, limit, websiteId });
  return NextResponse.json({ items, meta: { total: items.length, skip, limit, hasMore: items.length === limit } });
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
  const created = await productVariantService.create(session.user.tenantId as string, parsed.data, websiteId);
  return NextResponse.json(created, { status: 201 });
}
