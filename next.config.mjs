import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // SEO: Disable trailing slashes for consistent URL structure
  // This prevents duplicate URLs like /events/ vs /events
  trailingSlash: false,
  // Allow large body uploads for video export API (up to 100MB)
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
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
};

export default withNextIntl(nextConfig);
