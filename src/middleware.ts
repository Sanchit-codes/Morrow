import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const loggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  if (loggedIn && (pathname === '/enter' || pathname === '/join')) {
    return NextResponse.redirect(new URL('/home', req.url));
  }
});

export const config = {
  matcher: ['/enter', '/join'],
};
