import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { auth } from "@/auth";
import { websiteService } from "@/lib/websites/website-service";

const bodySchema = z.object({ websiteId: z.string().min(1) });

export async function GET() {
  const session = await auth();
  if (!session?.user?.tenantId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const jar = await cookies();
  const websiteId = jar.get("current_website_id")?.value || null;
  return NextResponse.json({ websiteId });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  // Verify that website belongs to the same tenant
  const list = await websiteService.listByTenant(session.user.tenantId);

  const found = list.find((w) => String(w._id) === parsed.data.websiteId);
  if (!found) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const res = NextResponse.json({ ok: true, websiteId: found.websiteId });
  const thirtyDays = 30 * 24 * 60 * 60; // seconds
  res.cookies.set("current_website_id", String(found["_id"]), {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: thirtyDays,
  });
  return res;
}
