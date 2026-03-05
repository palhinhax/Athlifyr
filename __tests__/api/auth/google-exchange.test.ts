/**
 * @jest-environment node
 */

/**
 * Tests for POST/OPTIONS /api/auth/google/exchange
 *
 * Covers the NEW code added in feat/liverace:
 * - OPTIONS: returns CORS preflight response (204)
 * - POST: missing mobile client env vars → 500
 * - POST: missing required fields → 400
 * - POST: invalid platform → 400
 * - POST: integrity check failure
 */

import { NextRequest, NextResponse } from "next/server";
import { POST, OPTIONS } from "@/app/api/auth/google/exchange/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/verify-integrity", () => ({
  requireIntegrity: jest.fn(),
}));
import { requireIntegrity } from "@/lib/verify-integrity";

jest.mock("google-auth-library", () => ({
  OAuth2Client: jest.fn().mockImplementation(() => ({
    getToken: jest.fn(),
    verifyIdToken: jest.fn(),
  })),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findFirst: jest.fn(), create: jest.fn(), update: jest.fn() },
    account: { findFirst: jest.fn(), create: jest.fn(), update: jest.fn() },
  },
}));

jest.mock("@/lib/jwt", () => ({
  generateAccessToken: jest.fn().mockReturnValue("mock-access-token"),
  generateRefreshToken: jest.fn().mockReturnValue("mock-refresh-token"),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

function makePostRequest(body: Record<string, unknown>): NextRequest {
  return new Request("http://localhost/api/auth/google/exchange", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  (requireIntegrity as jest.Mock).mockResolvedValue(null);
});

describe("OPTIONS /api/auth/google/exchange", () => {
  it("returns 204 with CORS headers", async () => {
    const res = await OPTIONS();

    expect(res.status).toBe(204);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(res.headers.get("Access-Control-Allow-Methods")).toBe(
      "POST, OPTIONS"
    );
    expect(res.headers.get("Access-Control-Allow-Headers")).toContain(
      "Content-Type"
    );
    expect(res.headers.get("Access-Control-Max-Age")).toBe("86400");
  });
});

describe("POST /api/auth/google/exchange", () => {
  it("returns integrity error when integrity check fails", async () => {
    const integrityResponse = NextResponse.json(
      { error: "Integrity check failed" },
      { status: 403 }
    );
    (requireIntegrity as jest.Mock).mockResolvedValue(integrityResponse);

    const res = await POST(
      makePostRequest({
        code: "auth-code",
        codeVerifier: "verifier",
        redirectUri: "http://localhost",
        platform: "android",
      })
    );

    expect(res.status).toBe(403);
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await POST(
      makePostRequest({ code: "", codeVerifier: "", redirectUri: "" })
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain("required");
  });

  it("returns 400 when platform is invalid", async () => {
    const res = await POST(
      makePostRequest({
        code: "auth-code",
        codeVerifier: "verifier",
        redirectUri: "http://localhost",
        platform: "windows",
      })
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain("platform");
  });

  it("returns 500 when mobile client env vars are missing", async () => {
    // Clear the env vars to trigger the new code path
    const originalMobileId = process.env.GOOGLE_MOBILE_WEB_CLIENT_ID;
    const originalMobileSecret = process.env.GOOGLE_MOBILE_WEB_CLIENT_SECRET;
    delete process.env.GOOGLE_MOBILE_WEB_CLIENT_ID;
    delete process.env.GOOGLE_MOBILE_WEB_CLIENT_SECRET;

    const res = await POST(
      makePostRequest({
        code: "auth-code",
        codeVerifier: "verifier",
        redirectUri: "http://localhost",
        platform: "android",
      })
    );
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Server OAuth configuration incomplete");

    // Restore
    process.env.GOOGLE_MOBILE_WEB_CLIENT_ID = originalMobileId;
    process.env.GOOGLE_MOBILE_WEB_CLIENT_SECRET = originalMobileSecret;
  });
});
