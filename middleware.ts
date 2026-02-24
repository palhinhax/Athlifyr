import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

/**
 * Builds a nonce-based Content Security Policy header value.
 * Using 'strict-dynamic' with a nonce removes the need for 'unsafe-inline'
 * while still allowing legitimate inline scripts that carry the nonce.
 */
function buildCspHeader(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com https://www.google-analytics.com https://vercel.live https://*.vercel-scripts.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' blob: data: https: http:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://vercel.live https://*.vercel-scripts.com https://f003.backblazeb2.com https://*.backblazeb2.com wss://*.vercel.live",
    "media-src 'self' blob: https://f003.backblazeb2.com https://*.backblazeb2.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src 'self' https://vercel.live",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}

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
  // Generate a cryptographically-random nonce for this request.
  // btoa(randomUUID) gives a base64 string safe for use in CSP nonce values.
  const nonce = btoa(crypto.randomUUID());
  const cspHeader = buildCspHeader(nonce);

  // Clone the incoming request headers and attach the nonce so that:
  // 1. Next.js reads 'x-nonce' to stamp its own hydration scripts.
  // 2. Server-component layouts can read it via headers().get('x-nonce').
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  // Create a new NextRequest with the modified headers so that any
  // downstream middleware (e.g. next-intl) forwards the nonce to the page.
  const requestWithNonce = new NextRequest(request, { headers: requestHeaders });

  const pathname = requestWithNonce.nextUrl.pathname;
  const hostname = requestWithNonce.headers.get("host") || "";
  const userAgent = requestWithNonce.headers.get("user-agent");

  // CRITICAL: Skip middleware for ALL /api/auth/* routes to prevent OAuth breaks
  // OAuth flow must happen on the SAME host without redirects
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

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
      const url = requestWithNonce.nextUrl.clone();
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
  const isMaintenancePage = requestWithNonce.nextUrl.pathname === "/maintenance";
  const isPromoPage = requestWithNonce.nextUrl.pathname.startsWith("/promo");
  const isStaticAsset =
    requestWithNonce.nextUrl.pathname.startsWith("/_next") ||
    requestWithNonce.nextUrl.pathname.startsWith("/static") ||
    requestWithNonce.nextUrl.pathname.startsWith("/videos") ||
    requestWithNonce.nextUrl.pathname.match(
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
    return NextResponse.redirect(new URL("/maintenance", requestWithNonce.url), 302);
  }

  // If not in maintenance mode and trying to access maintenance page, redirect to home
  if (!isMaintenanceMode && isMaintenancePage) {
    return NextResponse.redirect(new URL("/pt", requestWithNonce.url), 302);
  }

  // Skip intl middleware for maintenance and promo pages
  if (isMaintenancePage || isPromoPage) {
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    response.headers.set("Content-Security-Policy", cspHeader);
    return response;
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
    const url = requestWithNonce.nextUrl.clone();

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
    const response = intlMiddleware(requestWithNonce);
    response.headers.set("Content-Security-Policy", cspHeader);
    return response;
  }

  // Continue with internationalization middleware for regular users
  const response = intlMiddleware(requestWithNonce);
  response.headers.set("Content-Security-Policy", cspHeader);
  return response;
}

export const config = {
  // Match all pathnames except static files and API routes
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|site\\.webmanifest|videos|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|mp4|webm)).*)",
  ],
};
