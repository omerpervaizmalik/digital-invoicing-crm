import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from './lib/session';

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  const session = await decrypt(sessionCookie);

  const { pathname } = request.nextUrl;

  const isPublicPath = pathname === '/login' || pathname === '/signup';

  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (session && pathname.startsWith('/admin')) {
    if (session.role !== 'ULTIMATE_ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  const isSettingsPath = pathname.startsWith('/settings');
  const isApiAuthPath = pathname.startsWith('/actions/auth') || pathname.startsWith('/api/auth');

  // If profile is not complete and it's a tenant, force redirect to settings
  if (
    session && 
    session.role === 'TENANT_ADMIN' && 
    session.isProfileComplete === false && 
    !isSettingsPath && 
    !isApiAuthPath
  ) {
    return NextResponse.redirect(new URL('/settings/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
