/**
 * @jest-environment node
 */

/**
 * Tests for POST /api/auth/apple-mobile
 *
 * Covers:
 * - Validation (missing identityToken, invalid type)
 * - Invalid Apple token (no sub)
 * - Existing Apple account login
 * - Existing Apple account — banned user
 * - Existing Apple account — updates name if missing
 * - Email-based account linking
 * - Email-linked account — banned user
 * - New user creation
 * - New user with Apple Private Relay email
 * - Display name building from fullName
 * - Token expiry error handling
 * - Generic error handling
 */

import { NextRequest } from "next/server";

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockJwtVerify = jest.fn();
jest.mock("jose", () => ({
  jwtVerify: (...args: unknown[]) => mockJwtVerify(...args),
  createRemoteJWKSet: jest.fn().mockReturnValue("mock-jwks"),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    account: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    user: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/jwt", () => ({
  generateAccessToken: jest.fn().mockReturnValue("mock-access-token"),
  generateRefreshToken: jest.fn().mockReturnValue("mock-refresh-token"),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

function makePostRequest(body: Record<string, unknown>): NextRequest {
  return new Request("http://localhost/api/auth/apple-mobile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

const MOCK_APPLE_PAYLOAD = {
  sub: "apple-user-123",
  email: "test@example.com",
  email_verified: true,
  is_private_email: false,
};

const MOCK_USER = {
  id: "user-id-1",
  email: "test@example.com",
  name: "Test User",
  role: "USER",
  image: null,
  isBanned: false,
};

function setupSuccessfulVerification(
  payload: Record<string, unknown> = MOCK_APPLE_PAYLOAD
) {
  mockJwtVerify.mockResolvedValue({ payload });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

let POST: typeof import("@/app/api/auth/apple-mobile/route").POST;

beforeAll(async () => {
  process.env.APPLE_BUNDLE_ID = "com.athlifyr.app";
  const mod = await import("@/app/api/auth/apple-mobile/route");
  POST = mod.POST;
});

beforeEach(() => {
  jest.clearAllMocks();
});

// ── Validation ────────────────────────────────────────────────────────────────

describe("POST /api/auth/apple-mobile — validation", () => {
  it("returns 400 when identityToken is missing", async () => {
    const res = await POST(makePostRequest({}));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("identityToken is required");
  });

  it("returns 400 when identityToken is not a string", async () => {
    const res = await POST(makePostRequest({ identityToken: 123 }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("identityToken is required");
  });

  it("returns 401 when Apple token has no sub", async () => {
    setupSuccessfulVerification({ email: "test@example.com" });

    const res = await POST(makePostRequest({ identityToken: "valid-token" }));
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Invalid Apple token");
  });
});

// ── Existing Apple account ────────────────────────────────────────────────────

describe("POST /api/auth/apple-mobile — existing Apple account", () => {
  it("returns tokens for existing non-banned user", async () => {
    setupSuccessfulVerification();
    (prisma.account.findUnique as jest.Mock).mockResolvedValue({
      user: { ...MOCK_USER },
    });

    const res = await POST(makePostRequest({ identityToken: "valid-token" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.token).toBe("mock-access-token");
    expect(json.refreshToken).toBe("mock-refresh-token");
    expect(json.user.email).toBe("test@example.com");
  });

  it("returns 403 when user is banned", async () => {
    setupSuccessfulVerification();
    (prisma.account.findUnique as jest.Mock).mockResolvedValue({
      user: { ...MOCK_USER, isBanned: true },
    });

    const res = await POST(makePostRequest({ identityToken: "valid-token" }));
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.error).toBe("Account is banned");
  });

  it("updates name when user has no name and fullName is provided", async () => {
    setupSuccessfulVerification();
    (prisma.account.findUnique as jest.Mock).mockResolvedValue({
      user: { ...MOCK_USER, name: null },
    });

    const res = await POST(
      makePostRequest({
        identityToken: "valid-token",
        fullName: { givenName: "John", familyName: "Doe" },
      })
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-id-1" },
      data: { name: "John Doe" },
    });
    expect(json.user.name).toBe("John Doe");
  });

  it("does not update name when user already has a name", async () => {
    setupSuccessfulVerification();
    (prisma.account.findUnique as jest.Mock).mockResolvedValue({
      user: { ...MOCK_USER, name: "Existing Name" },
    });

    const res = await POST(
      makePostRequest({
        identityToken: "valid-token",
        fullName: { givenName: "John", familyName: "Doe" },
      })
    );

    expect(res.status).toBe(200);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });
});

// ── Email-based account linking ───────────────────────────────────────────────

describe("POST /api/auth/apple-mobile — email linking", () => {
  beforeEach(() => {
    // No existing Apple account
    (prisma.account.findUnique as jest.Mock).mockResolvedValue(null);
  });

  it("links Apple account to existing user with same email", async () => {
    setupSuccessfulVerification();
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({ ...MOCK_USER });

    const res = await POST(makePostRequest({ identityToken: "valid-token" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(prisma.account.create).toHaveBeenCalledWith({
      data: {
        userId: "user-id-1",
        type: "oauth",
        provider: "apple",
        providerAccountId: "apple-user-123",
      },
    });
    expect(json.token).toBe("mock-access-token");
  });

  it("returns 403 when linked user is banned", async () => {
    setupSuccessfulVerification();
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      ...MOCK_USER,
      isBanned: true,
    });

    const res = await POST(makePostRequest({ identityToken: "valid-token" }));
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.error).toBe("Account is banned");
  });
});

// ── New user creation ─────────────────────────────────────────────────────────

describe("POST /api/auth/apple-mobile — new user", () => {
  beforeEach(() => {
    (prisma.account.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
  });

  it("creates a new user with email and display name", async () => {
    setupSuccessfulVerification();
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: "new-user-id",
      email: "test@example.com",
      name: "John Doe",
      role: "USER",
      image: null,
    });

    const res = await POST(
      makePostRequest({
        identityToken: "valid-token",
        fullName: { givenName: "John", familyName: "Doe" },
      })
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.token).toBe("mock-access-token");
    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: "test@example.com",
          name: "John Doe",
          emailVerified: expect.any(Date),
          accounts: {
            create: {
              type: "oauth",
              provider: "apple",
              providerAccountId: "apple-user-123",
            },
          },
        }),
      })
    );
  });

  it("uses Private Relay email when Apple hides real email", async () => {
    setupSuccessfulVerification({
      sub: "apple-user-456",
      // No email provided
    });
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: "new-user-id",
      email: "apple-user-456@privaterelay.appleid.com",
      name: "apple-user-456",
      role: "USER",
      image: null,
    });

    const res = await POST(makePostRequest({ identityToken: "valid-token" }));

    expect(res.status).toBe(200);
    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: "apple-user-456@privaterelay.appleid.com",
          name: "apple-user-456",
        }),
      })
    );
  });

  it("uses givenName only when familyName is missing", async () => {
    setupSuccessfulVerification();
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: "new-user-id",
      email: "test@example.com",
      name: "John",
      role: "USER",
      image: null,
    });

    const res = await POST(
      makePostRequest({
        identityToken: "valid-token",
        fullName: { givenName: "John" },
      })
    );

    expect(res.status).toBe(200);
    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ name: "John" }),
      })
    );
  });
});

// ── Error handling ────────────────────────────────────────────────────────────

describe("POST /api/auth/apple-mobile — error handling", () => {
  it("returns 401 when token is expired", async () => {
    mockJwtVerify.mockRejectedValue(new Error("Token expired"));

    const res = await POST(makePostRequest({ identityToken: "expired-token" }));
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toContain("expired");
  });

  it("returns 500 on generic error", async () => {
    mockJwtVerify.mockRejectedValue(new Error("Network error"));

    const res = await POST(makePostRequest({ identityToken: "bad-token" }));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Authentication failed");
  });
});
