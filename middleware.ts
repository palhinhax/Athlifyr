import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
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

  // Continue with internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except static files and API routes
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)).*)",
  ],
};
