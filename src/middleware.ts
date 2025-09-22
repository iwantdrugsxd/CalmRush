import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow access to login page and public routes
  if (pathname === '/login' || pathname === '/' || pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  // Check for userId cookie for protected routes
  const userId = request.cookies.get('userId')?.value;
  
  // Protect /playground and /history routes
  if (pathname.startsWith('/playground') || pathname.startsWith('/history')) {
    if (!userId) {
      const redirectUrl = new URL('/', request.url);
      redirectUrl.searchParams.set('login', 'required');
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/playground/:path*', '/history/:path*'],
};