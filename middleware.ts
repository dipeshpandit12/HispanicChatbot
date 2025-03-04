import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const publicPaths = ['/', '/pages/about', '/login', '/signup'];
  const isPublicPath = publicPaths.includes(path);

  // Get token and business data status from cookies
  const token = request.cookies.get('authToken')?.value;
  const hasBusinessData = request.cookies.get('hasBusinessData')?.value;

  // Paths that require business data completion
  const businessDataRequiredPaths = ['/chatInterface', '/socialMediaDiagnostic'];

  // 1. Redirect to login if not authenticated and trying to access protected route
  if (!isPublicPath && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  // 2. For authenticated users:
  if (token) {
    // Redirect from login/signup to home if already authenticated
    if (path === '/login' || path === '/signup') {
      return NextResponse.redirect(new URL('/home', request.url));
    }

    // Check business data requirement only for specific pages
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
