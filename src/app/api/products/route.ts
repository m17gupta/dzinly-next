import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { productService } from "@/modules/ecommerce/product-service";
import type { Product } from "@/modules/ecommerce/types";
import { z } from "zod";

function toNumber(v: string | null, def: number, min = 0, max = 100) {
  const n = v ? parseInt(v, 10) : def;
  if (Number.isNaN(n)) return def;
  return Math.max(min, Math.min(max, n));
}

const createSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  sku: z.string().optional(),
  description: z.string().default(""),
  shortDescription: z.string().optional(),
  productType: z.enum(["physical", "digital", "service", "booking", "rental"]).default("physical"),
  images: z.array(z.string()).default([]),
  featuredImage: z.string().optional(),
  pricing: z.object({ basePrice: z.number(), salePrice: z.number().optional(), costPrice: z.number().optional() }),
  inventory: z
    .object({ trackStock: z.boolean(), stockQuantity: z.number().optional(), lowStockThreshold: z.number().optional(), allowBackorder: z.boolean() })
    .optional(),
  attributes: z.array(z.object({ name: z.string(), type: z.enum(["text", "select", "number", "boolean", "date"]), value: z.any(), options: z.array(z.string()).optional(), unit: z.string().optional() })).default([]),
  typeSpecific: z.any().optional(),
  categoryIds: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  seo: z.object({ metaTitle: z.string().optional(), metaDescription: z.string().optional(), keywords: z.array(z.string()).optional() }).optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  publishedAt: z.coerce.date().optional(),
});

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as 'draft' | 'published' | 'archived' | null;
  const categoryId = searchParams.get("categoryId");
  const productType = searchParams.get("productType") as 'physical' | 'digital' | 'service' | 'booking' | 'rental' | null;
  const skip = toNumber(searchParams.get("skip"), 0, 0, 10000);
  const limit = toNumber(searchParams.get("limit"), 20, 1, 100);
  const { cookies } = await import('next/headers');
  const jar = await cookies();
  const websiteId = jar.get('current_website_id')?.value;
  const items = await productService.listProducts(session.user.tenantId as string, { status: status ?? undefined, categoryId: categoryId || undefined, productType: productType ?? undefined, skip, limit, websiteId });
  return NextResponse.json({ items, meta: { total: items.length, skip, limit, hasMore: items.length === limit } });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const json = await req.json();
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload", issues: parsed.error.flatten() }, { status: 400 });
  const { cookies } = await import('next/headers');
  const jar = await cookies();
  const websiteId = jar.get('current_website_id')?.value;
  const created = await productService.createProduct(session.user.tenantId as string, parsed.data as Omit<Product, keyof import("@/types").BaseDocument>, websiteId);
  return NextResponse.json(created, { status: 201 });
}
