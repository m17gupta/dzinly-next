import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/mongodb';
import { ensureIndexes } from '@/lib/db/indexes';

export async function GET() {
  try {
    await ensureIndexes();
    const db = await getDatabase();
    const collections = [
      'tenants','users','custom_roles',
      "category", "brrand", "segment", "attribute",
      'websites',
      'pages','posts','categories','blog_tags','media','media_folders',
      'products','product_categories','product_variants','carts','orders',
      'invoices','payments','subscriptions',
      'audit_logs','activities','invitations','password_reset_tokens',
      'plugin_registry','plugin_installations'
    ];
    const counts: Record<string, number> = {};
    for (const name of collections) {
      try {
        counts[name] = await db.collection(name).countDocuments();
      } catch {
        counts[name] = -1;
      }
    }
    return NextResponse.json({ ok: true, counts });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Internal Error';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
