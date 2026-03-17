/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { POST } from "@/app/api/auth/login/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/verify-integrity", () => ({
  requireIntegrity: jest.fn().mockResolvedValue(null),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findFirst: jest.fn() },
  },
}));
import { prisma } from "@/lib/prisma";

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));
import bcrypt from "bcryptjs";

jest.mock("@/lib/jwt", () => ({
  generateAccessToken: jest.fn().mockReturnValue("mock-access-token"),
  generateRefreshToken: jest.fn().mockReturnValue("mock-refresh-token"),
}));

const mockRateLimitCheck = jest.fn().mockReturnValue({
  allowed: true,
  remaining: 6,
  resetAt: Date.now() + 900000,
});

jest.mock("@/lib/rate-limit", () => ({
  loginLimiter: {
    check: (...args: unknown[]) => mockRateLimitCheck(...args),
  },
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeRequest(body: Record<string, unknown>) {
  return new NextRequest("http://localhost/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockRateLimitCheck.mockReturnValue({
    allowed: true,
    remaining: 6,
    resetAt: Date.now() + 900000,
  });
});

describe("POST /api/auth/login", () => {
  it("returns 429 when rate limited", async () => {
    mockRateLimitCheck.mockReturnValue({
      allowed: false,
      remaining: 0,
      resetAt: Date.now() + 600000,
    });

    const res = await POST(
      makeRequest({ email: "test@test.com", password: "pass123" })
    );

    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.code).toBe("RATE_LIMITED");
    expect(res.headers.get("Retry-After")).toBeDefined();
  });

  it("returns 400 when credentials are missing", async () => {
    const res = await POST(makeRequest({}));

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.code).toBe("MISSING_CREDENTIALS");
  });

  it("returns 401 when user not found", async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await POST(
      makeRequest({ email: "nobody@test.com", password: "pass123" })
    );

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.code).toBe("INVALID_CREDENTIALS");
  });

  it("returns 401 when password is wrong", async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      id: "u1",
      email: "user@test.com",
      name: "Test",
      password: "hashed",
      role: "USER",
      image: null,
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const res = await POST(
      makeRequest({ email: "user@test.com", password: "wrong" })
    );

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.code).toBe("INVALID_CREDENTIALS");
  });

  it("returns tokens and user on valid login", async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      id: "u1",
      email: "user@test.com",
      name: "Test User",
      password: "hashed",
      role: "USER",
      image: "avatar.jpg",
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const res = await POST(
      makeRequest({ email: "user@test.com", password: "correct" })
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.token).toBe("mock-access-token");
    expect(body.refreshToken).toBe("mock-refresh-token");
    expect(body.user.id).toBe("u1");
    expect(body.user.email).toBe("user@test.com");
  });

  it("normalizes email for rate limiting key", async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

    await POST(
      makeRequest({ email: "  TEST@Example.COM  ", password: "pass" })
    );

    expect(mockRateLimitCheck).toHaveBeenCalledWith(
      expect.stringContaining("test@example.com")
    );
  });

  it("returns 500 on unexpected error", async () => {
    (prisma.user.findFirst as jest.Mock).mockRejectedValue(
      new Error("DB down")
    );

    const res = await POST(
      makeRequest({ email: "user@test.com", password: "pass" })
    );

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.code).toBe("INTERNAL_ERROR");
  });
});
