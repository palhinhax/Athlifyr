import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

// Common bot user agents that should NOT receive locale redirects
const BOT_USER_AGENTS = [
  "googlebot",
  "bingbot",
  "slurp",
  "duckduckbot",
  "baiduspider",
  "yandexbot",
  "facebookexternalhit",
  "twitterbot",
  "linkedinbot",
  "whatsapp",
  "telegrambot",
  "applebot",
  "petalbot",
  "semrushbot",
  "ahrefsbot",
  "mj12bot",
  "dotbot",
  "rogerbot",
  "screaming frog",
  "lighthouse",
  "chrome-lighthouse",
];

/**
 * Check if the request is from a known bot/crawler
 */
function isBot(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some((bot) => ua.includes(bot));
}

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hostname = request.headers.get("host") || "";
  const userAgent = request.headers.get("user-agent");

  // Skip middleware for service worker and web manifest
  if (
    pathname === "/sw.js" ||
    pathname === "/manifest.json" ||
    pathname === "/site.webmanifest"
  ) {
    return NextResponse.next();
  }

  // Skip middleware for static assets served from /public
  // Handle both /videos/... and /[locale]/videos/... paths
  const videoMatch = pathname.match(/^(?:\/[a-z]{2})?\/videos\//i);
  if (videoMatch || /\.(mp4|webm)$/i.test(pathname)) {
    // If locale prefix is present, rewrite to strip it
    const localeVideoMatch = pathname.match(/^\/[a-z]{2}(\/videos\/.+)$/i);
    if (localeVideoMatch) {
      const url = request.nextUrl.clone();
      url.pathname = localeVideoMatch[1];
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // Skip middleware for sitemap.xml, robots.txt, and webmanifest (root-level files)
  if (
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname === "/site.webmanifest"
  ) {
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
    request.nextUrl.pathname.startsWith("/videos") ||
    request.nextUrl.pathname.match(
      /\.(svg|png|jpg|jpeg|gif|ico|webp|woff|woff2|mp4|webm)$/i
    );

  // If maintenance mode is enabled and not accessing allowed pages
  if (
    isMaintenanceMode &&
    !isMaintenancePage &&
    !isPromoPage &&
    !isStaticAsset
  ) {
    // Use 302 temporary redirect for maintenance (NOT 301/308)
    return NextResponse.redirect(new URL("/maintenance", request.url), 302);
  }

  // If not in maintenance mode and trying to access maintenance page, redirect to home
  if (!isMaintenanceMode && isMaintenancePage) {
    return NextResponse.redirect(new URL("/pt", request.url), 302);
  }

  // Skip intl middleware for maintenance and promo pages
  if (isMaintenancePage || isPromoPage) {
    return NextResponse.next();
  }

  // ============================================================
  // SEO: Force www subdomain + locale prefix in ONE 301 redirect
  // Goal: Minimize redirect hops for better crawlability
  // ============================================================
  const supportedLocales = ["pt", "en", "es", "fr", "de", "it"];
  const defaultLocale = "pt";
  const isBotRequest = isBot(userAgent);

  // Check if hostname is missing www (e.g., athlifyr.com)
  const needsWww =
    hostname &&
    !hostname.startsWith("www.") &&
    !hostname.startsWith("localhost") &&
    !hostname.includes(":") && // Skip port numbers (dev server)
    !hostname.match(/^\d+\.\d+\.\d+\.\d+/); // Not IP address

  // Check if path is missing locale prefix
  const hasLocalePrefix = supportedLocales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  // For root path "/", we need to add locale
  // For paths without locale prefix, we need to add it
  const needsLocale = !hasLocalePrefix;

  // If we need to fix hostname OR locale, do it in ONE 301 redirect
  if (needsWww || needsLocale) {
    const url = request.nextUrl.clone();

    // Fix hostname first (www subdomain)
    if (needsWww) {
      url.hostname = `www.${hostname}`;
    }

    // Fix locale prefix
    // For bots: Always use default locale to avoid unnecessary redirects
    // For users: Use default locale (next-intl will handle locale detection)
    if (needsLocale) {
      // If it's the root path, redirect to default locale
      if (pathname === "/") {
        url.pathname = `/${defaultLocale}`;
      } else {
        // Add default locale prefix to the path
        url.pathname = `/${defaultLocale}${pathname}`;
      }
    }

    // CRITICAL: Use 301 Permanent Redirect (NOT 308)
    // 308 causes "Not crawled" issues in Google Search Console
    // 301 is better understood by all crawlers
    return NextResponse.redirect(url, 301);
  }

  // For bots with valid locale in URL, serve content directly without additional redirects
  if (isBotRequest && hasLocalePrefix) {
    // Let next-intl handle it but the URL is already correct
    return intlMiddleware(request);
  }

  // Continue with internationalization middleware for regular users
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except static files and API routes
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|site\\.webmanifest|videos|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|mp4|webm)).*)",
  ],
};
