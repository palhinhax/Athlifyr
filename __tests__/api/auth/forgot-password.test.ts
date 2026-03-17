/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { POST } from "@/app/api/auth/forgot-password/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: jest.fn() },
    passwordResetToken: {
      deleteMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));
import { prisma } from "@/lib/prisma";

const mockSend = jest.fn();
jest.mock("resend", () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: mockSend },
  })),
}));

jest.mock("@/lib/email-templates", () => ({
  getPasswordResetEmailHtml: jest.fn().mockReturnValue("<html>reset</html>"),
  getPasswordResetEmailText: jest.fn().mockReturnValue("reset link"),
}));

const mockRateLimitCheck = jest.fn().mockReturnValue({
  allowed: true,
  remaining: 2,
  resetAt: Date.now() + 900000,
});

jest.mock("@/lib/rate-limit", () => ({
  forgotPasswordLimiter: {
    check: (...args: unknown[]) => mockRateLimitCheck(...args),
  },
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeRequest(body: Record<string, unknown>) {
  return new NextRequest("http://localhost/api/auth/forgot-password", {
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
  process.env.RESEND_API_KEY = "re_test_key";
  process.env.NEXTAUTH_URL = "http://localhost:3000";
});

describe("POST /api/auth/forgot-password", () => {
  it("returns 429 when rate limited", async () => {
    mockRateLimitCheck.mockReturnValue({
      allowed: false,
      remaining: 0,
      resetAt: Date.now() + 600000,
    });

    const res = await POST(makeRequest({ email: "test@test.com" }));

    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.code).toBe("RATE_LIMITED");
    expect(res.headers.get("Retry-After")).toBeDefined();
  });

  it("returns 400 when email is missing", async () => {
    const res = await POST(makeRequest({}));

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.code).toBe("EMAIL_REQUIRED");
  });

  it("returns success even when user does not exist (prevent enumeration)", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest({ email: "nobody@test.com" }));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toBeDefined();
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("sends reset email when user exists", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "u1",
      email: "user@test.com",
      name: "Test User",
    });
    (prisma.passwordResetToken.deleteMany as jest.Mock).mockResolvedValue({
      count: 0,
    });
    (prisma.passwordResetToken.create as jest.Mock).mockResolvedValue({
      id: "t1",
    });
    mockSend.mockResolvedValue({ id: "msg-1" });

    const res = await POST(makeRequest({ email: "User@test.com" }));

    expect(res.status).toBe(200);
    expect(prisma.passwordResetToken.deleteMany).toHaveBeenCalledWith({
      where: { email: "user@test.com" },
    });
    expect(prisma.passwordResetToken.create).toHaveBeenCalled();
    expect(mockSend).toHaveBeenCalled();
  });

  it("lowercases email for lookup", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await POST(makeRequest({ email: "TEST@Example.COM" }));

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });
  });

  it("returns 500 on unexpected error", async () => {
    (prisma.user.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB down")
    );

    const res = await POST(makeRequest({ email: "user@test.com" }));

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.code).toBe("INTERNAL_ERROR");
  });

  it("creates token with 1-hour expiry and sends email", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "u1",
      email: "user@test.com",
      name: null,
    });
    (prisma.passwordResetToken.deleteMany as jest.Mock).mockResolvedValue({
      count: 0,
    });
    (prisma.passwordResetToken.create as jest.Mock).mockResolvedValue({
      id: "t1",
    });
    mockSend.mockResolvedValue({ id: "msg-1" });

    const before = Date.now();
    const res = await POST(makeRequest({ email: "user@test.com" }));
    expect(res.status).toBe(200);

    // Verify token was created with a future expiry
    const createCall = (prisma.passwordResetToken.create as jest.Mock).mock
      .calls[0][0];
    const expires = new Date(createCall.data.expires).getTime();
    expect(expires).toBeGreaterThan(before);
    expect(mockSend).toHaveBeenCalled();
  });
});
