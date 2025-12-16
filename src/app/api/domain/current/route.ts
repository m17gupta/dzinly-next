import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cookies } from 'next/headers';
import { websiteService } from '@/lib/websites/website-service';

export async function GET() {
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const wid = (await cookies()).get('current_website_id')?.value;
  if (!wid) return NextResponse.json({ error: 'No website selected' }, { status: 400 });
  const website = await websiteService.getByWebsiteId(wid);
  if (!website || String(website.tenantId) !== session.user.tenantId) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ website });
}
