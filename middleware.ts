import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hostname = request.headers.get("host") || "";

  // Skip middleware for sitemap.xml and robots.txt (SEO files at root)
  if (pathname === "/sitemap.xml" || pathname === "/robots.txt") {
    return NextResponse.next();
  }

  // Check if maintenance mode is enabled
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";

  // Allow access to maintenance page, promo page, and static assets even in maintenance mode
  const isMaintenancePage = request.nextUrl.pathname === "/maintenance";
  const isPromoPage = request.nextUrl.pathname.startsWith("/promo");
  const isStaticAsset =
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/static") ||
    request.nextUrl.pathname.match(
      /\.(svg|png|jpg|jpeg|gif|ico|webp|woff|woff2)$/i
    );

  // If maintenance mode is enabled and not accessing allowed pages
  if (
    isMaintenanceMode &&
    !isMaintenancePage &&
    !isPromoPage &&
    !isStaticAsset
  ) {
    // Use redirect instead of rewrite to navigate to standalone maintenance page
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  // If not in maintenance mode and trying to access maintenance page, redirect to home
  if (!isMaintenanceMode && isMaintenancePage) {
    return NextResponse.redirect(new URL("/pt", request.url));
  }

  // Skip intl middleware for maintenance and promo pages
  if (isMaintenancePage || isPromoPage) {
    return NextResponse.next();
  }

  // ============================================================
  // SEO: Force www subdomain + locale prefix in ONE 301 redirect
  // ============================================================
  const supportedLocales = ["pt", "en", "es", "fr", "de", "it"];
  const defaultLocale = "pt";

  // Check if hostname is missing www (e.g., athlifyr.com)
  const needsWww =
    hostname &&
    !hostname.startsWith("www.") &&
    !hostname.startsWith("localhost") &&
    !hostname.match(/^\d+\.\d+\.\d+\.\d+/); // Not IP address

  // Check if path is missing locale prefix
  const hasLocalePrefix = supportedLocales.some((locale) =>
    pathname.startsWith(`/${locale}`)
  );
  const needsLocale = !hasLocalePrefix && pathname !== "/";

  // If we need to fix hostname OR locale, do it in ONE redirect
  if (needsWww || needsLocale) {
    const url = request.nextUrl.clone();

    // Fix hostname first
    if (needsWww) {
      url.hostname = `www.${hostname}`;
    }

    // Fix locale prefix
    if (needsLocale) {
      url.pathname = `/${defaultLocale}${pathname}`;
    }

    // Return 301 permanent redirect
    return NextResponse.redirect(url, 301);
  }

  // Continue with internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except static files and API routes
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)).*)",
  ],
};
