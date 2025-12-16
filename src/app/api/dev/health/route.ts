import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
  const now = new Date();
  const hdrs = await headers();
  const host = hdrs.get('host') || '';
  return NextResponse.json({
    ok: true,
    status: 'healthy',
    time: now.toISOString(),
    pid: process.pid,
    port: 55803,
    host,
    env: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NODE_ENV: process.env.NODE_ENV,
    },
    versions: process.versions,
    memory: process.memoryUsage(),
    uptime: process.uptime(),
  });
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}
