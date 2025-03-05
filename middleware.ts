import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Update public paths to include home page
  const publicPaths = ['/', '/pages/home', '/auth/login', '/auth/signup'];
  const isPublicPath = publicPaths.includes(path);

  const token = request.cookies.get('authToken')?.value;
  const hasBusinessData = request.cookies.get('hasBusinessData')?.value;

  const businessDataRequiredPaths = ['/chatInterface', '/socialMediaDiagnostic'];

  // 1. If user is authenticated
  if (token) {
    // Only redirect from auth pages if user is already logged in
    if (path === '/auth/login' || path === '/auth/signup') {
      return NextResponse.redirect(new URL('/pages/businessData', request.url));
    }

    // Check for business data requirement
    if (businessDataRequiredPaths.includes(path) && !hasBusinessData) {
      return NextResponse.redirect(new URL('/pages/businessData', request.url));
    }
  }

  // 2. If user is not authenticated
  if (!token && !isPublicPath) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
};