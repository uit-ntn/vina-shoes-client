import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes configuration for future use
// const publicRoutes = [
//   '/login',
//   '/register',
//   '/forgot-password',
//   '/reset-password',
//   '/',
//   '/about',
//   '/contact',
//   '/shop',
//   '/blog',
//   '/faq',
//   '/policy',
//   '/images',
//   '/_next',
//   '/api/public',
// ];

// const protectedRoutes = [
//   '/checkout',
//   '/account',
//   '/orders',
//   '/profile',
//   '/api/protected',
// ];

// const adminRoutes = [
//   '/admin',
//   '/api/admin',
// ];

export function middleware(request: NextRequest) {
  // Thay vì sử dụng cookies, chúng ta sẽ cho phép tất cả các route
  // và để client-side xử lý việc kiểm tra xác thực
  const { pathname } = request.nextUrl;

  // Check if the request is for static files or public API routes
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/images') || 
      pathname.startsWith('/api/public')) {
    return NextResponse.next();
  }

  // Allow access to all routes - authentication will be handled client-side
  // We're disabling server-side auth check since we're using localStorage for tokens
  // and not cookies (which the middleware can access)
  return NextResponse.next();

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
