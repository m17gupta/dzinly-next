import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { subscriptionService } from '@/lib/billing/subscription-service';
import { z } from 'zod';

const updateSchema = z.object({
  plan: z.enum(['trial','basic','pro','enterprise']).optional(),
  status: z.enum(['active','past_due','canceled','incomplete']).optional(),
  currentPeriodEnd: z.string().datetime().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sub = await subscriptionService.get(session.user.tenantId);
  return NextResponse.json(sub ?? {});
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const json = await req.json();
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload', issues: parsed.error.flatten() }, { status: 400 });
  const updates: any = { ...parsed.data };
  if (updates.currentPeriodEnd) updates.currentPeriodEnd = new Date(updates.currentPeriodEnd);
  const result = await subscriptionService.upsert(session.user.tenantId, updates);
  return NextResponse.json(result);
}
