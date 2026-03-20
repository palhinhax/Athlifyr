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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isBot(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some((bot) => ua.includes(bot));
}

/**
 * Check if the middleware should be skipped entirely for this path.
 * Covers API auth routes, service worker, web manifest, sitemap, and robots.
 */
function shouldSkipMiddleware(pathname: string): boolean {
  if (pathname.startsWith("/api/auth")) return true;
  if (
    pathname === "/sw.js" ||
    pathname === "/manifest.json" ||
    pathname === "/site.webmanifest"
  )
    return true;
  if (pathname === "/sitemap.xml" || pathname === "/robots.txt") return true;
  return false;
}

/**
 * Handle video paths — skip middleware or rewrite to strip locale prefix.
 * Returns a response if handled, or null to continue.
 */
function handleVideoPath(
  pathname: string,
  request: NextRequest
): NextResponse | null {
  const videoMatch = pathname.match(/^(?:\/[a-z]{2})?\/videos\//i);
  if (!videoMatch && !/\.(mp4|webm)$/i.test(pathname)) return null;

  const localeVideoMatch = pathname.match(/^\/[a-z]{2}(\/videos\/.+)$/i);
  if (localeVideoMatch) {
    const url = request.nextUrl.clone();
    url.pathname = localeVideoMatch[1];
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

/**
 * Handle maintenance mode logic — redirects to/from maintenance page.
 * Returns a response if handled, or null to continue.
 */
function handleMaintenanceMode(request: NextRequest): NextResponse | null {
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";
  const pathname = request.nextUrl.pathname;
  const isMaintenancePage = pathname === "/maintenance";
  const isPromoPage = pathname.startsWith("/promo");
  const isStaticAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/videos") ||
    /\.(svg|png|jpg|jpeg|gif|ico|webp|woff|woff2|mp4|webm)$/i.test(pathname);

  if (
    isMaintenanceMode &&
    !isMaintenancePage &&
    !isPromoPage &&
    !isStaticAsset
  ) {
    return NextResponse.redirect(new URL("/maintenance", request.url), 302);
  }
  if (!isMaintenanceMode && isMaintenancePage) {
    return NextResponse.redirect(new URL("/pt", request.url), 302);
  }
  if (isMaintenancePage || isPromoPage) {
    return NextResponse.next();
  }
  return null;
}

/**
 * SEO: Force www subdomain + locale prefix in ONE 301 redirect.
 * Minimizes redirect hops for better crawlability.
 * Returns a redirect response if needed, or null to continue.
 */
function handleSeoRedirect(
  request: NextRequest,
  hostname: string,
  pathname: string
): NextResponse | null {
  const supportedLocales = ["pt", "en", "es", "fr", "de", "it"];
  const defaultLocale = "pt";

  const needsWww =
    hostname &&
    !hostname.startsWith("www.") &&
    !hostname.startsWith("localhost") &&
    !hostname.includes(":") &&
    !/^\d+\.\d+\.\d+\.\d+/.test(hostname);

  const hasLocalePrefix = supportedLocales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  const needsLocale = !hasLocalePrefix;

  if (!needsWww && !needsLocale) return null;

  const url = request.nextUrl.clone();
  if (needsWww) {
    url.hostname = `www.${hostname}`;
  }
  if (needsLocale) {
    url.pathname =
      pathname === "/" ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
  }
  // CRITICAL: Use 301 Permanent Redirect (NOT 308)
  // 308 causes "Not crawled" issues in Google Search Console
  return NextResponse.redirect(url, 301);
}

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hostname = request.headers.get("host") || "";

  if (shouldSkipMiddleware(pathname)) return NextResponse.next();

  const videoResponse = handleVideoPath(pathname, request);
  if (videoResponse) return videoResponse;

  const maintenanceResponse = handleMaintenanceMode(request);
  if (maintenanceResponse) return maintenanceResponse;

  const seoResponse = handleSeoRedirect(request, hostname, pathname);
  if (seoResponse) return seoResponse;

  return withPathnameHeader(request, intlMiddleware(request));
}

/**
 * Wraps an intl middleware response to add x-pathname request header
 * so that server components can identify the current request path via headers().
 *
 * - Redirect responses are returned as-is because the browser will follow the
 *   redirect and the new request will go through the middleware again.
 * - Response headers from the intl middleware (e.g. locale cookies) are
 *   preserved on the new response to maintain correct i18n behavior.
 * - The x-pathname header is consumed by app/[locale]/not-found.tsx to include
 *   the actual request path in Sentry 404 reports.
 */
function withPathnameHeader(
  request: NextRequest,
  response: NextResponse
): NextResponse {
  // Don't modify redirect responses — the browser will follow the redirect
  if (response.headers.get("location")) {
    return response;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  const newResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Preserve response headers from the intl middleware (cookies, locale, etc.)
  response.headers.forEach((value, key) => {
    newResponse.headers.set(key, value);
  });

  return newResponse;
}

export const config = {
  // Match all pathnames except static files, API routes, and Sentry tunnel
  matcher: [
    "/((?!api|monitoring|_next/static|_next/image|favicon.ico|site\\.webmanifest|videos|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|mp4|webm)).*)",
  ],
};
