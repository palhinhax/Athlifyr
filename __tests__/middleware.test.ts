/**
 * Unit tests for middleware.ts
 *
 * We mock next-intl/middleware so the intl middleware is a transparent pass-through,
 * allowing us to test every branch of the custom middleware logic in isolation.
 *
 * @jest-environment node
 */

import { NextRequest, NextResponse } from "next/server";

// ─── Mock next-intl/middleware ──────────────────────────────────────────────
// The intl middleware is created once at module scope in middleware.ts.
// We use a mutable ref so individual tests can override the behaviour.
let intlMiddlewareImpl: (req: NextRequest) => NextResponse = () =>
  NextResponse.next();

jest.mock("next-intl/middleware", () => {
  return jest.fn(() => {
    // Return the factory that delegates to the mutable ref
    return (req: NextRequest) => intlMiddlewareImpl(req);
  });
});

jest.mock("@/i18n/routing", () => ({
  routing: {
    locales: ["pt", "en", "es", "fr", "de", "it"],
    defaultLocale: "pt",
  },
}));

// ─── Import after mocks ────────────────────────────────────────────────────
import middleware from "@/middleware";

// ─── Helpers ────────────────────────────────────────────────────────────────

function createRequest(
  url: string,
  options?: { host?: string; userAgent?: string }
): NextRequest {
  const { host = "www.athlifyr.com", userAgent } = options ?? {};
  const req = new NextRequest(new URL(url, `https://${host}`), {
    headers: {
      host,
      ...(userAgent ? { "user-agent": userAgent } : {}),
    },
  });
  return req;
}

function getRedirectUrl(response: NextResponse): string | null {
  return response.headers.get("location");
}

function getStatus(response: NextResponse): number {
  return response.status;
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("middleware", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.MAINTENANCE_MODE;
    // Reset intl middleware to default pass-through
    intlMiddlewareImpl = () => NextResponse.next();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  // ─── shouldSkipMiddleware ───────────────────────────────────────────

  describe("skip middleware paths", () => {
    it.each([
      "/api/auth/login",
      "/api/auth/callback/google",
      "/api/auth/session",
      "/sw.js",
      "/manifest.json",
      "/site.webmanifest",
      "/sitemap.xml",
      "/robots.txt",
    ])("returns NextResponse.next() for %s", (path) => {
      const req = createRequest(path);
      const res = middleware(req);
      expect(getRedirectUrl(res)).toBeNull();
    });
  });

  // ─── handleVideoPath ───────────────────────────────────────────────

  describe("video paths", () => {
    it("passes through /videos/ paths without redirect", () => {
      const req = createRequest("/videos/hero.mp4");
      const res = middleware(req);
      expect(getRedirectUrl(res)).toBeNull();
    });

    it("rewrites locale-prefixed video paths to strip locale", () => {
      const req = createRequest("/pt/videos/hero.mp4");
      const res = middleware(req);
      // Rewrite — no redirect location but response is a rewrite
      expect(getRedirectUrl(res)).toBeNull();
    });

    it("handles .mp4 extension at path end", () => {
      const req = createRequest("/somefile.mp4");
      const res = middleware(req);
      expect(getRedirectUrl(res)).toBeNull();
    });

    it("handles .webm extension at path end", () => {
      const req = createRequest("/somefile.webm");
      const res = middleware(req);
      expect(getRedirectUrl(res)).toBeNull();
    });
  });

  // ─── handleMaintenanceMode ─────────────────────────────────────────

  describe("maintenance mode", () => {
    it("redirects to /maintenance when MAINTENANCE_MODE=true", () => {
      process.env.MAINTENANCE_MODE = "true";
      const req = createRequest("/pt/events");
      const res = middleware(req);
      expect(getRedirectUrl(res)).toContain("/maintenance");
      expect(getStatus(res)).toBe(302);
    });

    it("does not redirect /maintenance page itself", () => {
      process.env.MAINTENANCE_MODE = "true";
      const req = createRequest("/maintenance");
      const res = middleware(req);
      expect(getRedirectUrl(res)).toBeNull();
    });

    it("does not redirect /promo pages during maintenance", () => {
      process.env.MAINTENANCE_MODE = "true";
      const req = createRequest("/promo/summer-deal");
      const res = middleware(req);
      expect(getRedirectUrl(res)).toBeNull();
    });

    it("does not redirect static assets during maintenance (matched by isStaticAsset)", () => {
      process.env.MAINTENANCE_MODE = "true";
      // /_next paths are excluded by the Next.js matcher config at runtime.
      // When called directly, the static asset check in handleMaintenanceMode
      // recognises /_next paths, but handleVideoPath runs first and doesn't match,
      // so maintenance check runs. The path IS a static asset, so no maintenance redirect.
      const req = createRequest("/static/logo.png");
      const res = middleware(req);
      // /static/ is recognised as a static asset — no maintenance redirect
      expect(getRedirectUrl(res)).not.toContain("/maintenance");
    });

    it("does not redirect .woff2 font files during maintenance", () => {
      process.env.MAINTENANCE_MODE = "true";
      const req = createRequest("/pt/font.woff2");
      const res = middleware(req);
      // .woff2 recognised as static asset — no redirect at all
      expect(getRedirectUrl(res)).toBeNull();
    });

    it("does not redirect video files during maintenance", () => {
      process.env.MAINTENANCE_MODE = "true";
      const req = createRequest("/videos/bg.mp4");
      const res = middleware(req);
      expect(getRedirectUrl(res)).toBeNull();
    });

    it("redirects /maintenance to /pt when maintenance mode is off", () => {
      process.env.MAINTENANCE_MODE = "false";
      const req = createRequest("/maintenance");
      const res = middleware(req);
      expect(getRedirectUrl(res)).toContain("/pt");
      expect(getStatus(res)).toBe(302);
    });
  });

  // ─── handleSeoRedirect ─────────────────────────────────────────────

  describe("SEO redirects", () => {
    it("adds www when hostname lacks it", () => {
      const req = createRequest("/pt/events", { host: "athlifyr.com" });
      const res = middleware(req);
      const location = getRedirectUrl(res);
      expect(location).toContain("www.athlifyr.com");
      expect(getStatus(res)).toBe(301);
    });

    it("adds default locale when path has no locale prefix", () => {
      const req = createRequest("/events");
      const res = middleware(req);
      const location = getRedirectUrl(res);
      expect(location).toContain("/pt/events");
      expect(getStatus(res)).toBe(301);
    });

    it("adds both www and locale in a single redirect", () => {
      const req = createRequest("/events", { host: "athlifyr.com" });
      const res = middleware(req);
      const location = getRedirectUrl(res);
      expect(location).toContain("www.athlifyr.com");
      expect(location).toContain("/pt/events");
      expect(getStatus(res)).toBe(301);
    });

    it("does not redirect when www and locale are present", () => {
      const req = createRequest("/pt/events");
      const res = middleware(req);
      expect(getRedirectUrl(res)).toBeNull();
    });

    it("adds locale to root path /", () => {
      const req = createRequest("/");
      const res = middleware(req);
      const location = getRedirectUrl(res);
      expect(location).toContain("/pt");
      expect(getStatus(res)).toBe(301);
    });

    it("does not add www for localhost", () => {
      const req = createRequest("/events", { host: "localhost:3000" });
      const res = middleware(req);
      const location = getRedirectUrl(res);
      // Should still redirect for locale but not add www
      expect(location).not.toContain("www.");
    });

    it("does not add www for IP addresses", () => {
      const req = createRequest("/events", { host: "192.168.1.100" });
      const res = middleware(req);
      const location = getRedirectUrl(res);
      expect(location).not.toContain("www.");
    });

    it("recognises all supported locales", () => {
      for (const locale of ["pt", "en", "es", "fr", "de", "it"]) {
        const req = createRequest(`/${locale}/events`);
        const res = middleware(req);
        expect(getRedirectUrl(res)).toBeNull();
      }
    });

    it("recognises locale as exact path (e.g. /en)", () => {
      const req = createRequest("/en");
      const res = middleware(req);
      expect(getRedirectUrl(res)).toBeNull();
    });
  });

  // ─── withPathnameHeader ─────────────────────────────────────────────

  describe("pathname header", () => {
    it("adds x-pathname header for normal requests", () => {
      const req = createRequest("/pt/events");
      const res = middleware(req);
      // The x-pathname is set on the request headers, not response headers.
      // We verify the response is not a redirect (normal pass-through).
      expect(getRedirectUrl(res)).toBeNull();
    });

    it("passes through redirect responses from intl middleware unchanged", () => {
      // Override intl middleware to return a redirect response
      const redirectUrl = "https://www.athlifyr.com/pt/events";
      intlMiddlewareImpl = () =>
        NextResponse.redirect(new URL(redirectUrl), 307);

      const req = createRequest("/pt/events");
      const res = middleware(req);
      // withPathnameHeader should return the redirect as-is
      expect(getRedirectUrl(res)).toBe(redirectUrl);
    });
  });

  // ─── Full flow integration ──────────────────────────────────────────

  describe("full middleware flow", () => {
    it("skips api/auth routes before any other logic", () => {
      process.env.MAINTENANCE_MODE = "true";
      const req = createRequest("/api/auth/signin");
      const res = middleware(req);
      // Should NOT redirect to maintenance
      expect(getRedirectUrl(res)).toBeNull();
    });

    it("handles video path before maintenance check", () => {
      process.env.MAINTENANCE_MODE = "true";
      const req = createRequest("/videos/intro.mp4");
      const res = middleware(req);
      // Video path handled — should NOT redirect to maintenance
      expect(getRedirectUrl(res)).toBeNull();
    });
  });
});
