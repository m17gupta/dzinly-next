import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { orderService } from "@/modules/ecommerce/order-service";
import { z } from "zod";

function toNumber(v: string | null, def: number, min = 0, max = 100) {
  const n = v ? parseInt(v, 10) : def;
  if (Number.isNaN(n)) return def;
  return Math.max(min, Math.min(max, n));
}

const createSchema = z.object({
  orderNumber: z.string().min(1),
  customer: z.object({
    userId: z.string().optional(),
    email: z.string().email(),
    name: z.string().min(1),
    phone: z.string().optional(),
  }),
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string().optional(),
      name: z.string(),
      sku: z.string().optional(),
      quantity: z.number().int().min(1),
      price: z.number().nonnegative(),
      subtotal: z.number().nonnegative(),
      productType: z.enum(["physical", "digital", "service", "booking", "rental"]),
      typeData: z
        .object({
          bookingDate: z.coerce.date().optional(),
          bookingSlot: z.object({ startTime: z.string(), endTime: z.string() }).optional(),
          rentalPeriod: z.object({ startDate: z.coerce.date(), endDate: z.coerce.date(), duration: z.number().int() }).optional(),
          downloadUrl: z.string().optional(),
        })
        .optional(),
    })
  ),
  totals: z.object({ subtotal: z.number(), tax: z.number(), shipping: z.number(), discount: z.number(), total: z.number() }),
  shippingAddress: z
    .object({
      name: z.string(),
      addressLine1: z.string(),
      addressLine2: z.string().optional(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
      country: z.string(),
      phone: z.string().optional(),
    })
    .optional(),
  billingAddress: z
    .object({
      name: z.string(),
      addressLine1: z.string(),
      addressLine2: z.string().optional(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
      country: z.string(),
      phone: z.string().optional(),
    })
    .optional(),
  payment: z.object({ method: z.enum(["stripe", "razorpay", "cod", "bank_transfer"]), status: z.enum(["pending", "paid", "failed", "refunded"]), transactionId: z.string().optional(), paidAt: z.coerce.date().optional() }),
  fulfillment: z
    .object({
      status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending"),
      trackingNumber: z.string().optional(),
      carrier: z.string().optional(),
      shippedAt: z.coerce.date().optional(),
      deliveredAt: z.coerce.date().optional(),
    })
    .default({ status: "pending" }),
  notes: z.string().optional(),
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]).default("pending"),
});

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const status = (searchParams.get("status") as 'pending' | 'confirmed' | 'completed' | 'cancelled' | null) || undefined;
  const skip = toNumber(searchParams.get("skip"), 0, 0, 10000);
  const limit = toNumber(searchParams.get("limit"), 20, 1, 100);
  const items = await orderService.list(session.user.tenantId as string, { status, skip, limit });
  return NextResponse.json({ items, meta: { total: items.length, skip, limit, hasMore: items.length === limit } });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const json = await req.json();
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload", issues: parsed.error.flatten() }, { status: 400 });
  const created = await orderService.create(session.user.tenantId as string, parsed.data as import("@/modules/ecommerce/types").Order);
  return NextResponse.json(created, { status: 201 });
}
