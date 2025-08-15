import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'no-referrer');
  res.headers.set('Permissions-Policy', 'camera=(self)');
  res.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data:; connect-src 'self' https://generativelanguage.googleapis.com https://api.deepseek.com https://api.stripe.com;"
  );
  if (req.nextUrl.pathname.startsWith('/api')) {
    res.headers.set('Cache-Control', 'no-store');
  }
  return res;
}

export const config = {
  matcher: '/:path*',
};
