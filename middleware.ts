import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { verifyTokenEdge } from '@/utils/edgeAuth';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const { searchParams } = request.nextUrl;

  // Check if request is coming from Canvas
  const isCanvasRequest = 
    path === '/pages/chatInterface' && 
    searchParams.get('source') === 'canvas';

  // Update public paths to include home page
  const publicPaths = ['/', '/pages/home', '/auth/login', '/auth/signup'];
  const isPublicPath = publicPaths.includes(path);

  const token = request.cookies.get('authToken')?.value;

  // Check if token is valid (not expired)
  const decoded = token ? await verifyTokenEdge(token) : null;
  const isValidToken = !!decoded;

  // 1. If user is authenticated
  if (isValidToken) {
    // Redirect from auth pages and root to stage page if logged in
    if (path === '/auth/login' || path === '/auth/signup' || path === '/') {
      return NextResponse.redirect(new URL('/pages/stage', request.url));
    }
    // User is authenticated, allow access to protected pages
    return NextResponse.next();
  }

   // 2. If user is not authenticated
   if (!isValidToken && !isPublicPath) {
    const loginUrl = new URL('/auth/login', request.url);
    const fullPath = path + (request.nextUrl.search || '');
    loginUrl.searchParams.set('redirect', fullPath);
    
    // Add a special parameter for Canvas returns so we can show appropriate messaging
    if (isCanvasRequest) {
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