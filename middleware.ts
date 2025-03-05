import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Update public paths to match your actual route structure
  const publicPaths = ['/', '/pages/about', '/auth/login', '/auth/signup'];
  const isPublicPath = publicPaths.includes(path);

  // Get token and business data status from cookies
  const token = request.cookies.get('authToken')?.value;
  const hasBusinessData = request.cookies.get('hasBusinessData')?.value;

  const businessDataRequiredPaths = ['/chatInterface', '/socialMediaDiagnostic'];

  // 1. Redirect to login if not authenticated and trying to access protected route
  if (!isPublicPath && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  // 2. For authenticated users:
  if (token) {
    // Update these paths to match your route structure
    if (path === '/auth/login' || path === '/auth/signup') {
      return NextResponse.redirect(new URL('/home', request.url));
    }

    if (businessDataRequiredPaths.includes(path) && !hasBusinessData) {
      return NextResponse.redirect(new URL('/businessData', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
};