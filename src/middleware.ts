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
  '/images',
  '/_next',
  '/api/public',
];

// Routes that require authentication
const protectedRoutes = [
  '/checkout',
  '/account',
  '/orders',
  '/profile',
  '/api/protected',
];

// Routes that require admin role
const adminRoutes = [
  '/admin',
  '/api/admin',
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  const { pathname } = request.nextUrl;

  // Check if the request is for static files or public API routes
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/images') || 
      pathname.startsWith('/api/public')) {
    return NextResponse.next();
  }

  // Allow access to public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    // Redirect to home if user is already logged in and trying to access auth pages
    if (token && (pathname === '/login' || pathname === '/register')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Check for protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      // Store the original URL to redirect back after login
      response.cookies.set({
        name: 'redirectTo',
        value: pathname,
        path: '/',
        maxAge: 60 * 5, // 5 minutes
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      return response;
    }
  }

  // Check for admin routes
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Additional admin role check can be added here if needed
    // You would need to decode the JWT token and check the user role
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
