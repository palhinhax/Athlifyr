/**
 * In-memory rate limiter for API endpoints.
 *
 * Uses a sliding-window approach backed by a simple Map.
 * For multi-instance deployments, replace with Redis-backed storage.
 */

interface RateLimitEntry {
  /** Timestamps of recent attempts within the active window. */
  timestamps: number[];
}

interface RateLimitConfig {
  /** Maximum number of requests allowed within the window. */
  maxAttempts: number;
  /** Window duration in milliseconds. */
  windowMs: number;
}

interface RateLimitResult {
  /** Whether the request is allowed. */
  allowed: boolean;
  /** Number of remaining attempts in the current window. */
  remaining: number;
  /** Timestamp (ms) when the earliest attempt expires. */
  resetAt: number;
}

const stores = new Map<string, Map<string, RateLimitEntry>>();

/**
 * Periodically purge stale entries every 5 minutes.
 * Runs once per store, keyed by namespace.
 */
const cleanupIntervals = new Set<string>();

function ensureCleanup(namespace: string, windowMs: number): void {
  if (cleanupIntervals.has(namespace)) return;
  cleanupIntervals.add(namespace);

  setInterval(
    () => {
      const store = stores.get(namespace);
      if (!store) return;
      const now = Date.now();
      for (const [key, entry] of store) {
        entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);
        if (entry.timestamps.length === 0) {
          store.delete(key);
        }
      }
    },
    5 * 60 * 1000
  ).unref();
}

/**
 * Create a rate limiter scoped to a namespace.
 *
 * @example
 * ```ts
 * const loginLimiter = createRateLimiter({
 *   maxAttempts: 5,
 *   windowMs: 15 * 60 * 1000, // 15 minutes
 * });
 *
 * const result = loginLimiter.check("user@example.com");
 * if (!result.allowed) {
 *   return NextResponse.json({ code: "RATE_LIMITED" }, { status: 429 });
 * }
 * ```
 */
export function createRateLimiter(
  namespace: string,
  config: RateLimitConfig
): { check: (key: string) => RateLimitResult } {
  if (!stores.has(namespace)) {
    stores.set(namespace, new Map());
  }

  ensureCleanup(namespace, config.windowMs);

  return {
    check(key: string): RateLimitResult {
      const store = stores.get(namespace)!;
      const now = Date.now();

      let entry = store.get(key);
      if (!entry) {
        entry = { timestamps: [] };
        store.set(key, entry);
      }

      // Remove timestamps outside the window
      entry.timestamps = entry.timestamps.filter(
        (t) => now - t < config.windowMs
      );

      if (entry.timestamps.length >= config.maxAttempts) {
        const oldestInWindow = entry.timestamps[0];
        return {
          allowed: false,
          remaining: 0,
          resetAt: oldestInWindow + config.windowMs,
        };
      }

      // Record this attempt
      entry.timestamps.push(now);

      return {
        allowed: true,
        remaining: config.maxAttempts - entry.timestamps.length,
        resetAt: entry.timestamps[0] + config.windowMs,
      };
    },
  };
}

// ─── Pre-configured limiters for auth endpoints ─────────────────────────────

/** Login: 7 attempts per 15 minutes per key (IP or email). */
export const loginLimiter = createRateLimiter("auth:login", {
  maxAttempts: 7,
  windowMs: 15 * 60 * 1000,
});

/** Registration: 3 attempts per 15 minutes per IP. */
export const registerLimiter = createRateLimiter("auth:register", {
  maxAttempts: 3,
  windowMs: 15 * 60 * 1000,
});

/** Forgot-password: 3 attempts per 15 minutes per IP. */
export const forgotPasswordLimiter = createRateLimiter("auth:forgot-password", {
  maxAttempts: 3,
  windowMs: 15 * 60 * 1000,
});

/** Reset-password: 5 attempts per 15 minutes per IP. */
export const resetPasswordLimiter = createRateLimiter("auth:reset-password", {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,
});
