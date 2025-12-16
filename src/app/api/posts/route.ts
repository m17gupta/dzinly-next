import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { postService } from "@/modules/website/post-service";
import type { Post } from "@/modules/website/types";
import { z } from "zod";

function toNumber(v: string | null, def: number, min = 0, max = 100) {
  const n = v ? parseInt(v, 10) : def;
  if (Number.isNaN(n)) return def;
  return Math.max(min, Math.min(max, n));
}

const createSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().default(""),
  content: z.string().default(""),
  featuredImage: z.string().optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      ogImage: z.string().optional(),
    })
    .optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  publishedAt: z.coerce.date().optional(),
});

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const status = (searchParams.get("status") as 'draft' | 'published' | null) || undefined;
  const tag = searchParams.get("tag") || undefined;
  const skip = toNumber(searchParams.get("skip"), 0, 0, 10000);
  const limit = toNumber(searchParams.get("limit"), 20, 1, 100);
  const { cookies } = await import('next/headers');
  const jar = await cookies();
  const websiteId = jar.get('current_website_id')?.value;
  const items = await postService.list(session.user.tenantId as string, { status, tag, skip, limit, websiteId });
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
  const created = await postService.create(
    session.user.tenantId as string,
    {
      ...(parsed.data as Omit<Post, '_id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'author'>),
      author: {
        userId: String((session.user as { id?: string } | undefined)?.id ?? "admin"),
        name: String((session.user as { name?: string } | undefined)?.name ?? "Admin"),
      },
    },
    websiteId,
  );
  return NextResponse.json(created, { status: 201 });
}
