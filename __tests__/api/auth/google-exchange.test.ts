/**
 * @jest-environment node
 */

/**
 * Tests for POST/OPTIONS /api/auth/google/exchange
 *
 * Covers:
 * - OPTIONS: CORS preflight response (204)
 * - POST: validation (missing fields, invalid platform)
 * - POST: integrity check failure
 * - POST: platform-based client ID selection (android, ios, web)
 * - POST: missing env vars per platform → 500
 * - POST: web flow via OAuth2Client
 * - POST: native PKCE flow via fetch (android/ios)
 * - POST: native token exchange failure
 * - POST: missing ID token from Google
 * - POST: invalid Google token (verification fails)
 * - POST: existing user with existing Google account (token update)
 * - POST: existing user without Google account (account linking)
 * - POST: existing user with updated profile image
 * - POST: new user creation
 * - POST: error handling (invalid_grant, redirect_uri_mismatch, generic)
 */

import { NextRequest, NextResponse } from "next/server";
import { POST, OPTIONS } from "@/app/api/auth/google/exchange/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/verify-integrity", () => ({
  requireIntegrity: jest.fn(),
}));
import { requireIntegrity } from "@/lib/verify-integrity";

const mockGetToken = jest.fn();
const mockVerifyIdToken = jest.fn();
jest.mock("google-auth-library", () => ({
  OAuth2Client: jest.fn().mockImplementation(() => ({
    getToken: mockGetToken,
    verifyIdToken: mockVerifyIdToken,
  })),
}));
import { OAuth2Client } from "google-auth-library";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findFirst: jest.fn(), create: jest.fn(), update: jest.fn() },
    account: { findFirst: jest.fn(), create: jest.fn(), update: jest.fn() },
  },
}));
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/jwt", () => ({
  generateAccessToken: jest.fn().mockReturnValue("mock-access-token"),
  generateRefreshToken: jest.fn().mockReturnValue("mock-refresh-token"),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const VALID_BODY = {
  code: "auth-code",
  codeVerifier: "verifier",
  redirectUri: "http://localhost/callback",
  platform: "web" as const,
};

const MOCK_GOOGLE_PAYLOAD = {
  sub: "google-user-123",
  email: "test@example.com",
  email_verified: true,
  name: "Test User",
  picture: "https://lh3.googleusercontent.com/photo.jpg",
  given_name: "Test",
  family_name: "User",
};

const MOCK_USER = {
  id: "user-id-1",
  email: "test@example.com",
  name: "Test User",
  role: "USER",
  image: "https://old-image.jpg",
};

function makePostRequest(body: Record<string, unknown>): NextRequest {
  return new Request("http://localhost/api/auth/google/exchange", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

/** Save and restore env vars for a block */
function withEnv(
  overrides: Record<string, string | undefined>,
  fn: () => Promise<void>
) {
  return async () => {
    const saved: Record<string, string | undefined> = {};
    for (const key of Object.keys(overrides)) {
      saved[key] = process.env[key];
      if (overrides[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = overrides[key];
      }
    }
    try {
      await fn();
    } finally {
      for (const key of Object.keys(saved)) {
        if (saved[key] === undefined) {
          delete process.env[key];
        } else {
          process.env[key] = saved[key];
        }
      }
    }
  };
}

/** Set up env vars for a full successful flow */
function setupEnvVars() {
  process.env.GOOGLE_MOBILE_WEB_CLIENT_ID = "web-client-id";
  process.env.GOOGLE_MOBILE_WEB_CLIENT_SECRET = "web-client-secret";
  process.env.GOOGLE_ANDROID_CLIENT_ID = "android-client-id";
  process.env.GOOGLE_IOS_CLIENT_ID = "ios-client-id";
  process.env.GOOGLE_CLIENT_ID = "main-client-id";
}

/** Set up mocks for a successful web OAuth flow returning a new user */
function setupSuccessfulWebFlow() {
  setupEnvVars();

  mockGetToken.mockResolvedValue({
    tokens: {
      id_token: "mock-id-token",
      access_token: "mock-google-access",
      refresh_token: "mock-google-refresh",
      expiry_date: Date.now() + 3600000,
    },
  });

  mockVerifyIdToken.mockResolvedValue({
    getPayload: () => MOCK_GOOGLE_PAYLOAD,
  });
}

/** Set up mocks for a successful native PKCE flow */
function setupSuccessfulNativeFlow() {
  setupEnvVars();

  // Mock globalThis fetch for native token exchange
  globalThis.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () =>
      Promise.resolve({
        id_token: "mock-id-token",
        access_token: "mock-google-access",
        refresh_token: "mock-google-refresh",
        expires_in: 3600,
      }),
  });

  mockVerifyIdToken.mockResolvedValue({
    getPayload: () => MOCK_GOOGLE_PAYLOAD,
  });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  (requireIntegrity as jest.Mock).mockResolvedValue(null);
});

afterEach(() => {
  // Restore fetch if overridden
  if (jest.isMockFunction(globalThis.fetch)) {
    (globalThis.fetch as jest.Mock).mockRestore?.();
  }
});

// ── OPTIONS ───────────────────────────────────────────────────────────────────

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

// ── POST: Validation ──────────────────────────────────────────────────────────

describe("POST /api/auth/google/exchange — validation", () => {
  it("returns integrity error when integrity check fails", async () => {
    const integrityResponse = NextResponse.json(
      { error: "Integrity check failed" },
      { status: 403 }
    );
    (requireIntegrity as jest.Mock).mockResolvedValue(integrityResponse);

    const res = await POST(
      makePostRequest({ ...VALID_BODY, platform: "android" })
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

  it("returns 400 when platform is missing", async () => {
    const res = await POST(
      makePostRequest({
        code: "auth-code",
        codeVerifier: "verifier",
        redirectUri: "http://localhost",
      })
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain("platform");
  });
});

// ── POST: Platform-specific env var validation ────────────────────────────────

describe("POST /api/auth/google/exchange — env var validation", () => {
  it(
    "returns 500 when GOOGLE_ANDROID_CLIENT_ID is missing for android",
    withEnv(
      {
        GOOGLE_ANDROID_CLIENT_ID: undefined,
        GOOGLE_IOS_CLIENT_ID: "ios-id",
        GOOGLE_MOBILE_WEB_CLIENT_ID: "web-id",
        GOOGLE_MOBILE_WEB_CLIENT_SECRET: "web-secret",
      },
      async () => {
        const res = await POST(
          makePostRequest({ ...VALID_BODY, platform: "android" })
        );
        const json = await res.json();
        expect(res.status).toBe(500);
        expect(json.error).toBe("Server OAuth configuration incomplete");
      }
    )
  );

  it(
    "returns 500 when GOOGLE_IOS_CLIENT_ID is missing for ios",
    withEnv(
      {
        GOOGLE_ANDROID_CLIENT_ID: "android-id",
        GOOGLE_IOS_CLIENT_ID: undefined,
        GOOGLE_MOBILE_WEB_CLIENT_ID: "web-id",
        GOOGLE_MOBILE_WEB_CLIENT_SECRET: "web-secret",
      },
      async () => {
        const res = await POST(
          makePostRequest({ ...VALID_BODY, platform: "ios" })
        );
        const json = await res.json();
        expect(res.status).toBe(500);
        expect(json.error).toBe("Server OAuth configuration incomplete");
      }
    )
  );

  it(
    "returns 500 when GOOGLE_MOBILE_WEB_CLIENT_ID is missing for web",
    withEnv(
      {
        GOOGLE_ANDROID_CLIENT_ID: "android-id",
        GOOGLE_IOS_CLIENT_ID: "ios-id",
        GOOGLE_MOBILE_WEB_CLIENT_ID: undefined,
        GOOGLE_MOBILE_WEB_CLIENT_SECRET: "web-secret",
      },
      async () => {
        const res = await POST(
          makePostRequest({ ...VALID_BODY, platform: "web" })
        );
        const json = await res.json();
        expect(res.status).toBe(500);
        expect(json.error).toBe("Server OAuth configuration incomplete");
      }
    )
  );

  it(
    "returns 500 when GOOGLE_MOBILE_WEB_CLIENT_SECRET is missing for web",
    withEnv(
      {
        GOOGLE_MOBILE_WEB_CLIENT_ID: "web-id",
        GOOGLE_MOBILE_WEB_CLIENT_SECRET: undefined,
      },
      async () => {
        const res = await POST(
          makePostRequest({ ...VALID_BODY, platform: "web" })
        );
        const json = await res.json();
        expect(res.status).toBe(500);
        expect(json.error).toBe("Server OAuth configuration incomplete");
      }
    )
  );
});

// ── POST: Web flow (OAuth2Client) ─────────────────────────────────────────────

describe("POST /api/auth/google/exchange — web flow", () => {
  it("exchanges code via OAuth2Client and creates new user", async () => {
    setupSuccessfulWebFlow();
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({
      ...MOCK_USER,
      id: "new-user-id",
    });

    const res = await POST(makePostRequest(VALID_BODY));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.token).toBe("mock-access-token");
    expect(json.refreshToken).toBe("mock-refresh-token");
    expect(json.user.email).toBe("test@example.com");
    expect(OAuth2Client).toHaveBeenCalledWith(
      "web-client-id",
      "web-client-secret",
      VALID_BODY.redirectUri
    );
    expect(mockGetToken).toHaveBeenCalledWith({
      code: VALID_BODY.code,
      codeVerifier: VALID_BODY.codeVerifier,
      redirect_uri: VALID_BODY.redirectUri,
    });
  });

  it("returns 400 when Google does not return an ID token (web)", async () => {
    setupEnvVars();
    mockGetToken.mockResolvedValue({
      tokens: { id_token: null, access_token: "at" },
    });

    const res = await POST(makePostRequest(VALID_BODY));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Google did not return an ID token");
  });

  it("returns 401 when Google token verification fails (invalid payload)", async () => {
    setupEnvVars();
    mockGetToken.mockResolvedValue({
      tokens: { id_token: "mock-id-token", access_token: "at" },
    });
    mockVerifyIdToken.mockResolvedValue({
      getPayload: () => undefined,
    });

    const res = await POST(makePostRequest(VALID_BODY));
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Invalid Google token");
  });

  it("returns 401 when Google token payload has no email", async () => {
    setupEnvVars();
    mockGetToken.mockResolvedValue({
      tokens: { id_token: "mock-id-token", access_token: "at" },
    });
    mockVerifyIdToken.mockResolvedValue({
      getPayload: () => ({ sub: "123", email: null }),
    });

    const res = await POST(makePostRequest(VALID_BODY));
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Invalid Google token");
  });
});

// ── POST: Native PKCE flow (Android/iOS) ──────────────────────────────────────

describe("POST /api/auth/google/exchange — native PKCE flow", () => {
  it("exchanges code via fetch for android platform", async () => {
    setupSuccessfulNativeFlow();
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue(MOCK_USER);

    const res = await POST(
      makePostRequest({ ...VALID_BODY, platform: "android" })
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.token).toBe("mock-access-token");
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://oauth2.googleapis.com/token",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
    );
    // Verify the fetch body contains the android client ID
    const fetchCall = (globalThis.fetch as jest.Mock).mock.calls[0];
    const body = fetchCall[1].body as string;
    expect(body).toContain("client_id=android-client-id");
    expect(body).toContain("grant_type=authorization_code");
  });

  it("exchanges code via fetch for ios platform", async () => {
    setupSuccessfulNativeFlow();
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue(MOCK_USER);

    const res = await POST(makePostRequest({ ...VALID_BODY, platform: "ios" }));
    await res.json();

    expect(res.status).toBe(200);
    const fetchCall = (globalThis.fetch as jest.Mock).mock.calls[0];
    const body = fetchCall[1].body as string;
    expect(body).toContain("client_id=ios-client-id");
  });

  it("returns 400 when native token exchange fails", async () => {
    setupEnvVars();
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: () =>
        Promise.resolve({
          error: "invalid_grant",
          error_description: "Code has expired",
        }),
    });

    const res = await POST(
      makePostRequest({ ...VALID_BODY, platform: "android" })
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Code has expired");
  });

  it("returns 400 with error field when error_description is missing", async () => {
    setupEnvVars();
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: "invalid_client" }),
    });

    const res = await POST(
      makePostRequest({ ...VALID_BODY, platform: "android" })
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("invalid_client");
  });

  it("returns 400 with fallback when error body parse fails", async () => {
    setupEnvVars();
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.reject(new Error("parse error")),
    });

    const res = await POST(
      makePostRequest({ ...VALID_BODY, platform: "android" })
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Token exchange failed");
  });

  it("returns 400 when native flow returns no ID token", async () => {
    setupEnvVars();
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          access_token: "at",
          refresh_token: "rt",
          expires_in: 3600,
        }),
    });

    const res = await POST(
      makePostRequest({ ...VALID_BODY, platform: "android" })
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Google did not return an ID token");
  });

  it("handles native token response without expires_in", async () => {
    setupEnvVars();
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          id_token: "mock-id-token",
          access_token: "at",
        }),
    });
    mockVerifyIdToken.mockResolvedValue({
      getPayload: () => MOCK_GOOGLE_PAYLOAD,
    });
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue(MOCK_USER);

    const res = await POST(makePostRequest({ ...VALID_BODY, platform: "ios" }));

    expect(res.status).toBe(200);
  });
});

// ── POST: User management ─────────────────────────────────────────────────────

describe("POST /api/auth/google/exchange — user management", () => {
  beforeEach(() => {
    setupSuccessfulWebFlow();
  });

  it("updates profile image when it has changed for existing user", async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({ ...MOCK_USER });
    (prisma.account.findFirst as jest.Mock).mockResolvedValue({
      id: "account-1",
    });

    const res = await POST(makePostRequest(VALID_BODY));
    await res.json();

    expect(res.status).toBe(200);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: MOCK_USER.id },
      data: { image: MOCK_GOOGLE_PAYLOAD.picture },
    });
    // Account tokens should be updated
    expect(prisma.account.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "account-1" },
      })
    );
  });

  it("does not update image when it has not changed", async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      ...MOCK_USER,
      image: MOCK_GOOGLE_PAYLOAD.picture,
    });
    (prisma.account.findFirst as jest.Mock).mockResolvedValue({
      id: "account-1",
    });

    const res = await POST(makePostRequest(VALID_BODY));

    expect(res.status).toBe(200);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("links Google account when existing user has no Google account", async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      ...MOCK_USER,
      image: MOCK_GOOGLE_PAYLOAD.picture,
    });
    (prisma.account.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await POST(makePostRequest(VALID_BODY));
    await res.json();

    expect(res.status).toBe(200);
    expect(prisma.account.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: MOCK_USER.id,
        provider: "google",
        providerAccountId: MOCK_GOOGLE_PAYLOAD.sub,
        type: "oauth",
      }),
    });
  });

  it("creates a new user when no user exists with email", async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: "new-user-id",
      email: "test@example.com",
      name: "Test User",
      role: "USER",
      image: MOCK_GOOGLE_PAYLOAD.picture,
    });

    const res = await POST(makePostRequest(VALID_BODY));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: "test@example.com",
        name: "Test User",
        emailVerified: expect.any(Date),
        accounts: {
          create: expect.objectContaining({
            provider: "google",
            providerAccountId: MOCK_GOOGLE_PAYLOAD.sub,
          }),
        },
      }),
      select: expect.objectContaining({
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
      }),
    });
    expect(json.user.id).toBe("new-user-id");
  });

  it("uses email prefix as name when Google name is missing", async () => {
    setupEnvVars();
    mockGetToken.mockResolvedValue({
      tokens: {
        id_token: "mock-id-token",
        access_token: "at",
        refresh_token: "rt",
        expiry_date: Date.now() + 3600000,
      },
    });
    mockVerifyIdToken.mockResolvedValue({
      getPayload: () => ({
        ...MOCK_GOOGLE_PAYLOAD,
        name: undefined,
        picture: undefined,
      }),
    });
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({
      ...MOCK_USER,
      name: "test",
      image: null,
    });

    const res = await POST(makePostRequest(VALID_BODY));

    expect(res.status).toBe(200);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: "test",
        image: null,
      }),
      select: expect.any(Object),
    });
  });
});

// ── POST: Error handling ──────────────────────────────────────────────────────

describe("POST /api/auth/google/exchange — error handling", () => {
  beforeEach(() => {
    setupEnvVars();
  });

  it("returns 400 for invalid_grant error", async () => {
    mockGetToken.mockRejectedValue(new Error("invalid_grant: Code expired"));

    const res = await POST(makePostRequest(VALID_BODY));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain("expired or already used");
  });

  it("returns 400 for redirect_uri_mismatch error", async () => {
    mockGetToken.mockRejectedValue(
      new Error("redirect_uri_mismatch: URI does not match")
    );

    const res = await POST(makePostRequest(VALID_BODY));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain("Redirect URI mismatch");
  });

  it("returns 500 for generic errors", async () => {
    mockGetToken.mockRejectedValue(new Error("Network failure"));

    const res = await POST(makePostRequest(VALID_BODY));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Authentication failed");
  });

  it("returns 500 for non-Error thrown values", async () => {
    mockGetToken.mockRejectedValue("unexpected string error");

    const res = await POST(makePostRequest(VALID_BODY));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Authentication failed");
  });
});

// ── POST: Response structure ──────────────────────────────────────────────────

describe("POST /api/auth/google/exchange — response structure", () => {
  it("returns correct token structure and user data", async () => {
    setupSuccessfulWebFlow();
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      ...MOCK_USER,
      image: MOCK_GOOGLE_PAYLOAD.picture,
    });
    (prisma.account.findFirst as jest.Mock).mockResolvedValue({
      id: "account-1",
    });

    const res = await POST(makePostRequest(VALID_BODY));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({
      token: "mock-access-token",
      refreshToken: "mock-refresh-token",
      expiresIn: 7 * 24 * 60 * 60,
      user: {
        id: MOCK_USER.id,
        email: MOCK_USER.email,
        name: MOCK_USER.name,
        role: MOCK_USER.role,
        image: MOCK_GOOGLE_PAYLOAD.picture,
      },
    });
  });
});
