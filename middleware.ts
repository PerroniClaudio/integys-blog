import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['it', 'en']; // Lingue supportate: italiano e inglese
const defaultLocale = 'it';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verifica se il pathname già include un locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect alla versione italiana per la home o altri path senza locale
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Salta i file statici e le API routes
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
