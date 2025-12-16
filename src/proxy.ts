import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip proxy for static files and API auth routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('/favicon.ico') ||
    pathname.startsWith('/images/')
  ) {
    return NextResponse.next();
  }

  // NOTE: Tenant resolution logic must be handled in API routes or server components (Node.js runtime)
  // You can set headers or perform lightweight logic here if needed

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all request paths except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
