/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { POST } from "@/app/api/auth/register/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/verify-integrity", () => ({
  requireIntegrity: jest.fn().mockResolvedValue(null),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findFirst: jest.fn(), create: jest.fn() },
  },
}));
import { prisma } from "@/lib/prisma";

jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed-pw"),
}));

jest.mock("@/lib/analytics", () => ({
  trackServerEvent: jest.fn().mockResolvedValue(undefined),
  ANALYTICS_EVENTS: { SIGNUP_COMPLETED: "signup_completed" },
}));

const mockRateLimitCheck = jest.fn().mockReturnValue({
  allowed: true,
  remaining: 2,
  resetAt: Date.now() + 900000,
});

jest.mock("@/lib/rate-limit", () => ({
  registerLimiter: {
    check: (...args: unknown[]) => mockRateLimitCheck(...args),
  },
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeRequest(body: Record<string, unknown>) {
  return new NextRequest("http://localhost/api/auth/register", {
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
    remaining: 2,
    resetAt: Date.now() + 900000,
  });
});

describe("POST /api/auth/register", () => {
  it("returns 429 when rate limited", async () => {
    mockRateLimitCheck.mockReturnValue({
      allowed: false,
      remaining: 0,
      resetAt: Date.now() + 600000,
    });

    const res = await POST(
      makeRequest({ name: "Test", email: "test@test.com", password: "pass123" })
    );

    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.code).toBe("RATE_LIMITED");
    expect(res.headers.get("Retry-After")).toBeDefined();
  });

  it("returns 400 on invalid input (short name)", async () => {
    const res = await POST(
      makeRequest({ name: "A", email: "test@test.com", password: "pass123" })
    );

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.code).toBe("NAME_TOO_SHORT");
  });

  it("returns 400 when email already in use", async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({ id: "u1" });

    const res = await POST(
      makeRequest({
        name: "Test User",
        email: "exists@test.com",
        password: "pass123",
      })
    );

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.code).toBe("EMAIL_ALREADY_IN_USE");
  });

  it("creates user successfully", async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: "u1",
      name: "New User",
      email: "new@test.com",
      role: "USER",
    });

    const res = await POST(
      makeRequest({
        name: "New User",
        email: "New@Test.COM",
        password: "pass123",
      })
    );

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.user.id).toBe("u1");
  });

  it("returns 500 on unexpected error", async () => {
    (prisma.user.findFirst as jest.Mock).mockRejectedValue(
      new Error("DB down")
    );

    const res = await POST(
      makeRequest({
        name: "Test User",
        email: "test@test.com",
        password: "pass123",
      })
    );

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.code).toBe("INTERNAL_ERROR");
  });
});
