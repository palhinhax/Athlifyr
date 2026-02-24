import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Security headers for all routes (static headers; CSP is set dynamically in middleware)
const securityHeaders = [
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

export default withNextIntl(nextConfig);
