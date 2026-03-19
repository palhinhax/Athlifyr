/**
 * @jest-environment node
 */

/**
 * Tests for POST /api/auth/google-mobile
 *
 * Covers:
 * - Integrity check failure
 * - Missing idToken → 400
 * - Invalid/expired Google token → 401
 * - Token without email → 401
 * - Existing user with existing Google account (image update)
 * - Existing user without Google account (account linking)
 * - New user creation
 * - Token expiry error handling
 * - Generic error → 500
 */

import { NextRequest, NextResponse } from "next/server";
import { POST } from "@/app/api/auth/google-mobile/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/verify-integrity", () => ({
  requireIntegrity: jest.fn(),
}));
import { requireIntegrity } from "@/lib/verify-integrity";

const mockVerifyIdToken = jest.fn();
jest.mock("google-auth-library", () => {
  return {
    OAuth2Client: jest.fn().mockImplementation(() => ({
      verifyIdToken: (...args: unknown[]) => mockVerifyIdToken(...args),
    })),
  };
});

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findFirst: jest.fn(), create: jest.fn(), update: jest.fn() },
    account: { findFirst: jest.fn(), create: jest.fn() },
  },
}));
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/mobile-auth-response", () => ({
  buildAuthResponse: jest.fn(),
}));
import { buildAuthResponse } from "@/lib/mobile-auth-response";

// ── Helpers ───────────────────────────────────────────────────────────────────

const MOCK_GOOGLE_PAYLOAD = {
  sub: "google-user-123",
  email: "Test@Example.com",
  email_verified: true,
  name: "Test User",
  picture: "https://lh3.googleusercontent.com/photo.jpg",
  given_name: "Test",
  family_name: "User",
};

const MOCK_USER = {
  id: "user-1",
  email: "test@example.com",
  name: "Test User",
  role: "USER",
  image: null,
};

function makeRequest(body: Record<string, unknown> = {}): NextRequest {
  return new NextRequest("http://localhost/api/auth/google-mobile", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  (requireIntegrity as jest.Mock).mockResolvedValue(null);
  (buildAuthResponse as jest.Mock).mockImplementation(
    (user: Record<string, unknown>) =>
      NextResponse.json({
        user,
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
      })
  );
});

describe("POST /api/auth/google-mobile", () => {
  it("returns integrity error when check fails", async () => {
    const { NextResponse } = await import("next/server");
    (requireIntegrity as jest.Mock).mockResolvedValue(
      NextResponse.json({ error: "Integrity check failed" }, { status: 403 })
    );

    const res = await POST(makeRequest({ idToken: "token" }));
    expect(res.status).toBe(403);
  });

  it("returns 400 when idToken is missing", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error).toBe("idToken is required");
  });

  it("returns 401 when Google token is invalid (no payload)", async () => {
    mockVerifyIdToken.mockResolvedValue({ getPayload: () => undefined });

    const res = await POST(makeRequest({ idToken: "invalid-token" }));
    expect(res.status).toBe(401);

    const body = await res.json();
    expect(body.error).toBe("Invalid Google token");
  });

  it("returns 401 when payload has no email", async () => {
    mockVerifyIdToken.mockResolvedValue({
      getPayload: () => ({ sub: "123", email: null }),
    });

    const res = await POST(makeRequest({ idToken: "token" }));
    expect(res.status).toBe(401);
  });

  it("updates image and links Google account for existing user", async () => {
    mockVerifyIdToken.mockResolvedValue({
      getPayload: () => MOCK_GOOGLE_PAYLOAD,
    });
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      ...MOCK_USER,
      image: "old-image.jpg",
    });
    (prisma.user.update as jest.Mock).mockResolvedValue({});
    (prisma.account.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.account.create as jest.Mock).mockResolvedValue({});

    const res = await POST(makeRequest({ idToken: "valid-token" }));
    expect(res.status).toBe(200);

    // Should update image
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: { image: MOCK_GOOGLE_PAYLOAD.picture },
    });

    // Should create linked account
    expect(prisma.account.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "user-1",
        provider: "google",
        providerAccountId: "google-user-123",
      }),
    });

    expect(buildAuthResponse).toHaveBeenCalled();
  });

  it("skips account linking when already linked", async () => {
    mockVerifyIdToken.mockResolvedValue({
      getPayload: () => MOCK_GOOGLE_PAYLOAD,
    });
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(MOCK_USER);
    (prisma.account.findFirst as jest.Mock).mockResolvedValue({
      id: "acc-1",
      provider: "google",
    });

    const res = await POST(makeRequest({ idToken: "valid-token" }));
    expect(res.status).toBe(200);

    expect(prisma.account.create).not.toHaveBeenCalled();
  });

  it("skips image update when picture matches", async () => {
    mockVerifyIdToken.mockResolvedValue({
      getPayload: () => MOCK_GOOGLE_PAYLOAD,
    });
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      ...MOCK_USER,
      image: MOCK_GOOGLE_PAYLOAD.picture,
    });
    (prisma.account.findFirst as jest.Mock).mockResolvedValue({
      id: "acc-1",
    });

    const res = await POST(makeRequest({ idToken: "valid-token" }));
    expect(res.status).toBe(200);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("creates new user when not found", async () => {
    mockVerifyIdToken.mockResolvedValue({
      getPayload: () => MOCK_GOOGLE_PAYLOAD,
    });
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue(MOCK_USER);

    const res = await POST(makeRequest({ idToken: "valid-token" }));
    expect(res.status).toBe(200);

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: "test@example.com",
        name: "Test User",
        image: MOCK_GOOGLE_PAYLOAD.picture,
        emailVerified: expect.any(Date),
        accounts: {
          create: expect.objectContaining({
            provider: "google",
            providerAccountId: "google-user-123",
          }),
        },
      }),
      select: expect.any(Object),
    });
  });

  it("handles token expiry error", async () => {
    mockVerifyIdToken.mockRejectedValue(
      new Error("Token used too late, 1234567 > 1234566")
    );

    const res = await POST(makeRequest({ idToken: "expired-token" }));
    expect(res.status).toBe(401);

    const body = await res.json();
    expect(body.error).toBe("Token expired. Please try signing in again.");
  });

  it("returns 500 on generic error", async () => {
    mockVerifyIdToken.mockRejectedValue(new Error("Network failure"));

    const res = await POST(makeRequest({ idToken: "token" }));
    expect(res.status).toBe(500);

    const body = await res.json();
    expect(body.error).toBe("Authentication failed");
  });
});
