import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Update public paths to include home page
  const publicPaths = ['/', '/pages/home', '/auth/login', '/auth/signup'];
  const isPublicPath = publicPaths.includes(path);

  const token = request.cookies.get('authToken')?.value;

  // Check if request is coming from Canvas
  const referer = request.headers.get('referer') || '';
  const isFromCanvas = referer.includes('canvas') || 
                      path.includes('/pages/chatInterface') && 
                      request.nextUrl.searchParams.has('source') && 
                      request.nextUrl.searchParams.get('source') === 'canvas';


  // 1. If user is authenticated
  if (token) {
    // Redirect from auth pages and root to stage page if logged in
    if (path === '/auth/login' || path === '/auth/signup' || path === '/') {
      return NextResponse.redirect(new URL('/pages/stage', request.url));
    }
  }

  // 2. If user is not authenticated
  if (!token && !isPublicPath) {
    const loginUrl = new URL('/auth/login', request.url);
    const fullPath = path + (request.nextUrl.search || '');
    loginUrl.searchParams.set('redirect', fullPath);
    if (isFromCanvas) {
      loginUrl.searchParams.set('returnFromCanvas', 'true');
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
};