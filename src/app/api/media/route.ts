import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { mediaService } from "@/modules/website/media-service";
import { z } from "zod";

function toNumber(v: string | null, def: number, min = 0, max = 100) {
  const n = v ? parseInt(v, 10) : def;
  if (Number.isNaN(n)) return def;
  return Math.max(min, Math.min(max, n));
}

const createSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  url: z.string().min(1),
  tags: z.string().min(1),
});

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const skip = toNumber(searchParams.get("skip"), 0, 0, 10000);
  const limit = toNumber(searchParams.get("limit"), 20, 1, 100);
  const { cookies } = await import("next/headers");
  const jar = await cookies();
  const websiteId = jar.get("current_website_id")?.value;
  console.log(websiteId);
  const items = await mediaService.list(session.user.tenantId, {
    skip,
    limit,
    websiteId,
  });
  return NextResponse.json({
    items,
    meta: { total: items.length, skip, limit, hasMore: items.length === limit },
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const json = await req.json();
  const parsed = createSchema.safeParse(json);

  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 400 }
    );
  const { cookies } = await import("next/headers");
  const jar = await cookies();
  const websiteId = jar.get("current_website_id")?.value;
  const created = await mediaService.create(
    session.user.tenantId,
    parsed.data as any,
    websiteId
  );

  return NextResponse.json(created, { status: 201 });
}
