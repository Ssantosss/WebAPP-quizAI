import { NextRequest, NextResponse } from 'next/server';

export function middleware(req:NextRequest){
  const res = NextResponse.next();
  res.headers.set('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self' https://generativelanguage.googleapis.com https://api.deepseek.com https://api.stripe.com;");
  res.headers.set('Permissions-Policy','camera=(self)');
  res.headers.set('Referrer-Policy','strict-origin-when-cross-origin');
  res.headers.set('X-Content-Type-Options','nosniff');
  res.headers.set('X-Frame-Options','DENY');
  res.headers.set('Cross-Origin-Opener-Policy','same-origin');
  res.headers.set('Cross-Origin-Resource-Policy','same-origin');
  if(req.nextUrl.pathname.startsWith('/api')) res.headers.set('Cache-Control','no-store');
  return res;
}

export const config = { matcher: '/:path*' };
