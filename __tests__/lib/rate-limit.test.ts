/**
 * @jest-environment node
 */

/**
 * Tests for lib/rate-limit.ts
 *
 * Covers:
 * - Creating a rate limiter with custom config
 * - Allowing requests within the limit
 * - Blocking requests once the limit is exceeded
 * - Sliding window: old timestamps expire
 * - Multiple keys are independent
 * - Pre-configured auth limiters are exported with correct limits
 */

import { createRateLimiter } from "@/lib/rate-limit";

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("createRateLimiter", () => {
  it("allows requests within the limit", () => {
    const limiter = createRateLimiter("test:allow", {
      maxAttempts: 3,
      windowMs: 60_000,
    });

    const r1 = limiter.check("key1");
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = limiter.check("key1");
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(1);

    const r3 = limiter.check("key1");
    expect(r3.allowed).toBe(true);
    expect(r3.remaining).toBe(0);
  });

  it("blocks requests once the limit is exceeded", () => {
    const limiter = createRateLimiter("test:block", {
      maxAttempts: 2,
      windowMs: 60_000,
    });

    limiter.check("key1");
    limiter.check("key1");

    const blocked = limiter.check("key1");
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetAt).toBeGreaterThan(Date.now());
  });

  it("provides a valid resetAt timestamp", () => {
    const windowMs = 60_000;
    const limiter = createRateLimiter("test:reset", {
      maxAttempts: 1,
      windowMs,
    });

    const before = Date.now();
    const r1 = limiter.check("key1");
    expect(r1.allowed).toBe(true);
    expect(r1.resetAt).toBeGreaterThanOrEqual(before);
    expect(r1.resetAt).toBeLessThanOrEqual(before + windowMs + 100);

    const r2 = limiter.check("key1");
    expect(r2.allowed).toBe(false);
    expect(r2.resetAt).toBeGreaterThan(Date.now());
  });

  it("treats different keys as independent", () => {
    const limiter = createRateLimiter("test:keys", {
      maxAttempts: 1,
      windowMs: 60_000,
    });

    const r1 = limiter.check("keyA");
    expect(r1.allowed).toBe(true);

    // keyA is now exhausted
    const r1b = limiter.check("keyA");
    expect(r1b.allowed).toBe(false);

    // keyB should still be allowed
    const r2 = limiter.check("keyB");
    expect(r2.allowed).toBe(true);
  });

  it("allows requests again after the window expires (sliding window)", () => {
    const limiter = createRateLimiter("test:expire", {
      maxAttempts: 1,
      windowMs: 100, // 100ms window for fast testing
    });

    const r1 = limiter.check("key1");
    expect(r1.allowed).toBe(true);

    const r2 = limiter.check("key1");
    expect(r2.allowed).toBe(false);

    // Wait for the window to expire
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const r3 = limiter.check("key1");
        expect(r3.allowed).toBe(true);
        resolve();
      }, 150);
    });
  });

  it("uses separate namespaces for different limiters", () => {
    const limiterA = createRateLimiter("test:nsA", {
      maxAttempts: 1,
      windowMs: 60_000,
    });
    const limiterB = createRateLimiter("test:nsB", {
      maxAttempts: 1,
      windowMs: 60_000,
    });

    const rA = limiterA.check("shared-key");
    expect(rA.allowed).toBe(true);

    // limiterA exhausted for shared-key, but limiterB should be independent
    const rB = limiterB.check("shared-key");
    expect(rB.allowed).toBe(true);
  });
});

describe("pre-configured auth limiters", () => {
  it("exports loginLimiter with correct limits", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loginLimiter } = require("@/lib/rate-limit");
    expect(loginLimiter).toBeDefined();
    expect(typeof loginLimiter.check).toBe("function");

    // Login allows 7 attempts — verify by making 7 calls
    const key = `login-test-${Date.now()}`;
    for (let i = 0; i < 7; i++) {
      expect(loginLimiter.check(key).allowed).toBe(true);
    }
    expect(loginLimiter.check(key).allowed).toBe(false);
  });

  it("exports registerLimiter with correct limits", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { registerLimiter } = require("@/lib/rate-limit");
    expect(registerLimiter).toBeDefined();

    const key = `register-test-${Date.now()}`;
    for (let i = 0; i < 3; i++) {
      expect(registerLimiter.check(key).allowed).toBe(true);
    }
    expect(registerLimiter.check(key).allowed).toBe(false);
  });

  it("exports forgotPasswordLimiter with correct limits", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { forgotPasswordLimiter } = require("@/lib/rate-limit");
    expect(forgotPasswordLimiter).toBeDefined();

    const key = `forgot-test-${Date.now()}`;
    for (let i = 0; i < 3; i++) {
      expect(forgotPasswordLimiter.check(key).allowed).toBe(true);
    }
    expect(forgotPasswordLimiter.check(key).allowed).toBe(false);
  });

  it("exports resetPasswordLimiter with correct limits", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { resetPasswordLimiter } = require("@/lib/rate-limit");
    expect(resetPasswordLimiter).toBeDefined();

    const key = `reset-test-${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      expect(resetPasswordLimiter.check(key).allowed).toBe(true);
    }
    expect(resetPasswordLimiter.check(key).allowed).toBe(false);
  });
});
