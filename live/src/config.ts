// ============================================================================
// Athlifyr Live Server — Configuration
// ============================================================================

export const config = {
  // Server
  port: parseInt(process.env.LIVE_PORT || "4000", 10),
  host: process.env.LIVE_HOST || "0.0.0.0",
  env: (process.env.NODE_ENV || "development") as
    | "development"
    | "production"
    | "test",

  // CORS
  corsOrigins: process.env.LIVE_CORS_ORIGINS?.split(",") || [
    "http://localhost:3000",
    "http://localhost:4000",
  ],

  // Redis
  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
    keyPrefix: "athlifyr:",
  },

  // JWT (shared with Next.js app)
  jwtSecret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "",

  // Next.js API (all DB operations go through here)
  nextApiUrl: process.env.NEXT_API_URL || "http://localhost:3000",

  // Rate limiting
  rateLimit: {
    max: 100,
    timeWindow: "1 minute",
  },

  // Socket.io
  socket: {
    pingInterval: 25000,
    pingTimeout: 20000,
    maxHttpBufferSize: 1e6, // 1MB
  },
} as const;

export type Config = typeof config;
