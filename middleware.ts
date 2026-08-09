import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  if (pathname.startsWith('/admin/login') && session) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
