import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Live server URL for CSP connect-src (HTTP + WebSocket)
const liveServerUrl =
  process.env.NEXT_PUBLIC_LIVE_URL || "http://localhost:4000";
const liveServerWs = liveServerUrl.replace(/^http/, "ws");
// Railway wildcard for live service (covers both HTTP and WS)
const railwayLive = "https://*.up.railway.app wss://*.up.railway.app";

// Content Security Policy - carefully configured for Next.js compatibility
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com https://www.google-analytics.com https://vercel.live https://*.vercel-scripts.com https://cdn.userway.org;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.userway.org;
  img-src 'self' blob: data: https: http:;
  font-src 'self' data: https://fonts.gstatic.com;
  connect-src 'self' ${liveServerUrl} ${liveServerWs} ${railwayLive} https://api.stripe.com https://hooks.stripe.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://www.googletagmanager.com https://vercel.live https://*.vercel-scripts.com https://f003.backblazeb2.com https://*.backblazeb2.com wss://*.vercel.live https://*.sentry.io https://*.ingest.de.sentry.io https://api.mapbox.com https://events.mapbox.com https://*.userway.org;
  media-src 'self' blob: https://f003.backblazeb2.com https://*.backblazeb2.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://vercel.live https://cdn.userway.org;
  worker-src 'self' blob:;
  manifest-src 'self';
  ${process.env.NODE_ENV === "production" ? "upgrade-insecure-requests;" : ""}
`
  .replaceAll(/\s{2,}/g, " ")
  .trim();

// Security headers for all routes
const securityHeaders = [
  // Content Security Policy - prevents XSS attacks
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy,
  },
  // Strict Transport Security - forces HTTPS
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Cross-Origin-Opener-Policy - isolates window from other documents
  // Use same-origin-allow-popups to allow Stripe 3D Secure popups
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin-allow-popups",
  },
  // Cross-Origin-Embedder-Policy - controls cross-origin requests
  // Set to unsafe-none because Stripe Elements iframes require cross-origin credentialed requests
  {
    key: "Cross-Origin-Embedder-Policy",
    value: "unsafe-none",
  },
  // X-Frame-Options - prevents clickjacking (legacy, CSP frame-ancestors is preferred)
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // X-Content-Type-Options - prevents MIME type sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Referrer-Policy - controls what information is sent with requests
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // X-DNS-Prefetch-Control - controls DNS prefetching
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // Permissions-Policy - controls browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // SEO: Disable trailing slashes for consistent URL structure
  // This prevents duplicate URLs like /events/ vs /events
  trailingSlash: false,
  // Allow large body uploads for video analysis APIs (up to 500MB)
  experimental: {
    serverActions: {
      bodySizeLimit: "500mb",
    },
  },
  // Keep native binaries out of the webpack bundle — they are resolved by Node at runtime
  serverExternalPackages: [
    "ffmpeg-static",
    "@ffprobe-installer/ffprobe",
    "sharp",
  ],
  images: {
    qualities: [30, 75, 90],
    // Cache optimized images for 30 days (TTL in seconds)
    minimumCacheTTL: 2592000,
    // Common device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Smaller sizes for thumbnails and avatars
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Prefer WebP/AVIF for best compression
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "f003.backblazeb2.com",
      },
      {
        protocol: "https",
        hostname: "*.backblazeb2.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "meiamaratonadecascais.pt",
      },
      {
        protocol: "https",
        hostname: "europemarathon.eu",
      },
      {
        protocol: "https",
        hostname: "www.cm-mafra.pt",
      },
      {
        protocol: "https",
        hostname: "www.aldeiasdoxisto.pt",
      },
      {
        protocol: "https",
        hostname: "radiosintonia.pt",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_B2_BUCKET_URL: process.env.NEXT_PUBLIC_B2_BUCKET_URL,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  },
  // Security headers for all routes
  async headers() {
    // CORS origin: use an explicit allowlist in production, fall back to * for development.
    // ALLOWED_ORIGINS accepts a comma-separated list of origins.
    const allowedOrigins =
      process.env.ALLOWED_ORIGINS ||
      (process.env.NEXT_PUBLIC_BASE_URL
        ? process.env.NEXT_PUBLIC_BASE_URL
        : "*");

    return [
      {
        // CORS headers for API routes — allows mobile app (Expo) to call Next.js APIs
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: allowedOrigins,
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Content-Type, Authorization, X-Requested-With, X-Internal-Secret, x-app-integrity, X-Client-Platform",
          },
          {
            key: "Access-Control-Max-Age",
            value: "86400",
          },
        ],
      },
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: [
          ...securityHeaders,
          // Enable browser JS profiling for Sentry
          {
            key: "Document-Policy",
            value: "js-profiling",
          },
        ],
      },
    ];
  },
};

export default withSentryConfig(withNextIntl(nextConfig), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "athlifyr",

  project: "athlifyr-web",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
