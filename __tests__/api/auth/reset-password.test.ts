/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { POST } from "@/app/api/auth/reset-password/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => ({
  prisma: {
    passwordResetToken: { findUnique: jest.fn(), delete: jest.fn() },
    user: { findUnique: jest.fn(), update: jest.fn() },
  },
}));
import { prisma } from "@/lib/prisma";

jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed-password"),
}));

const mockRateLimitCheck = jest.fn().mockReturnValue({
  allowed: true,
  remaining: 4,
  resetAt: Date.now() + 900000,
});

jest.mock("@/lib/rate-limit", () => ({
  resetPasswordLimiter: {
    check: (...args: unknown[]) => mockRateLimitCheck(...args),
  },
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeRequest(body: Record<string, unknown>) {
  return new NextRequest("http://localhost/api/auth/reset-password", {
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
    remaining: 4,
    resetAt: Date.now() + 900000,
  });
});

describe("POST /api/auth/reset-password", () => {
  it("returns 429 when rate limited", async () => {
    mockRateLimitCheck.mockReturnValue({
      allowed: false,
      remaining: 0,
      resetAt: Date.now() + 600000,
    });

    const res = await POST(makeRequest({ token: "abc", password: "newpass" }));

    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBeDefined();
  });

  it("returns 400 when token or password is missing", async () => {
    const res = await POST(makeRequest({}));

    expect(res.status).toBe(400);
  });

  it("returns 400 when password is too short", async () => {
    const res = await POST(makeRequest({ token: "abc", password: "12345" }));

    expect(res.status).toBe(400);
  });

  it("returns 400 when token is invalid", async () => {
    (prisma.passwordResetToken.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await POST(
      makeRequest({ token: "invalid", password: "pass123" })
    );

    expect(res.status).toBe(400);
  });

  it("returns 400 when token is expired", async () => {
    (prisma.passwordResetToken.findUnique as jest.Mock).mockResolvedValue({
      id: "t1",
      email: "user@test.com",
      token: "expired-token",
      expires: new Date(Date.now() - 60000), // expired 1 min ago
    });
    (prisma.passwordResetToken.delete as jest.Mock).mockResolvedValue({});

    const res = await POST(
      makeRequest({ token: "expired-token", password: "pass123" })
    );

    expect(res.status).toBe(400);
  });

  it("returns 404 when user not found", async () => {
    (prisma.passwordResetToken.findUnique as jest.Mock).mockResolvedValue({
      id: "t1",
      email: "gone@test.com",
      token: "valid-token",
      expires: new Date(Date.now() + 3600000),
    });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await POST(
      makeRequest({ token: "valid-token", password: "pass123" })
    );

    expect(res.status).toBe(404);
  });

  it("resets password successfully", async () => {
    (prisma.passwordResetToken.findUnique as jest.Mock).mockResolvedValue({
      id: "t1",
      email: "user@test.com",
      token: "valid-token",
      expires: new Date(Date.now() + 3600000),
    });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "u1",
      email: "user@test.com",
    });
    (prisma.user.update as jest.Mock).mockResolvedValue({});
    (prisma.passwordResetToken.delete as jest.Mock).mockResolvedValue({});

    const res = await POST(
      makeRequest({ token: "valid-token", password: "newpass123" })
    );

    expect(res.status).toBe(200);
    expect(prisma.user.update).toHaveBeenCalled();
    expect(prisma.passwordResetToken.delete).toHaveBeenCalled();
  });

  it("returns 500 on unexpected error", async () => {
    (prisma.passwordResetToken.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB down")
    );

    const res = await POST(makeRequest({ token: "abc", password: "pass123" }));

    expect(res.status).toBe(500);
  });
});
