import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Content Security Policy - carefully configured for Next.js compatibility
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://vercel.live https://*.vercel-scripts.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https: http:;
  font-src 'self' data: https://fonts.gstatic.com;
  connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://vercel.live https://*.vercel-scripts.com https://f003.backblazeb2.com https://*.backblazeb2.com wss://*.vercel.live;
  media-src 'self' blob: https://f003.backblazeb2.com https://*.backblazeb2.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  frame-src 'self' https://vercel.live;
  worker-src 'self' blob:;
  manifest-src 'self';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

// Security headers for all routes
const securityHeaders = [
  // Content Security Policy - prevents XSS attacks
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy,
  },
  // Strict Transport Security - forces HTTPS
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // Cross-Origin-Opener-Policy - isolates window from other documents
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
  // Cross-Origin-Embedder-Policy - controls cross-origin requests
  {
    key: 'Cross-Origin-Embedder-Policy',
    value: 'credentialless',
  },
  // X-Frame-Options - prevents clickjacking (legacy, CSP frame-ancestors is preferred)
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // X-Content-Type-Options - prevents MIME type sniffing
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // Referrer-Policy - controls what information is sent with requests
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // X-DNS-Prefetch-Control - controls DNS prefetching
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // Permissions-Policy - controls browser features
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
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
    qualities: [75, 90],
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
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default withSentryConfig(withNextIntl(nextConfig), {
  // Sentry organization and project (set in environment or CI)
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // Automatically instrument Next.js App Router routes and API routes
  autoInstrumentServerFunctions: true,
  autoInstrumentMiddleware: true,
  autoInstrumentAppDirectory: true,

  // Upload source maps during build for readable stack traces
  // Auth token should be set via SENTRY_AUTH_TOKEN env var (server-side only)
  sourcemaps: {
    disable: false,
  },

  // Hides the Sentry SDK from the client bundle name to reduce noise
  hideSourceMaps: true,

  // Disable Sentry telemetry (usage stats)
  telemetry: false,
});
