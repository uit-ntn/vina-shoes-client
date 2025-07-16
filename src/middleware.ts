import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require authentication
const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/',
  '/about',
  '/contact',
  '/shop',
  '/blog',
  '/faq',
  '/policy',
];

// Routes that require authentication
const protectedRoutes = [
  '/checkout',
  '/account',
  '/orders',
];

// Routes that require admin role
const adminRoutes = [
  '/admin',
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;
  
  // Allow access to public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check for protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.set({
        name: 'redirectTo',
        value: pathname,
        path: '/',
        maxAge: 60 * 5, // 5 minutes
      });
      return response;
    }
  }

  // Check for admin routes (if you have admin functionality)
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Add additional admin role check here if needed
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
