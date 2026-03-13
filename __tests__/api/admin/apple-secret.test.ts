/**
 * @jest-environment node
 */

/**
 * Tests for POST /api/admin/apple-secret
 *
 * Covers:
 * - Authorization (non-admin, no session)
 * - Validation (missing fields, invalid expiresInDays)
 * - Successful JWT generation
 * - Invalid private key error
 */

import { NextRequest } from "next/server";
import { POST } from "@/app/api/admin/apple-secret/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth", () => ({
  auth: jest.fn(),
}));
import { auth } from "@/lib/auth";

// Mock jose SignJWT chain
const mockSign = jest.fn().mockResolvedValue("mock-jwt-token");
const mockSetExpirationTime = jest.fn().mockReturnValue({ sign: mockSign });
const mockSetIssuedAt = jest
  .fn()
  .mockReturnValue({ setExpirationTime: mockSetExpirationTime });
const mockSetAudience = jest
  .fn()
  .mockReturnValue({ setIssuedAt: mockSetIssuedAt });
const mockSetSubject = jest
  .fn()
  .mockReturnValue({ setAudience: mockSetAudience });
const mockSetIssuer = jest.fn().mockReturnValue({ setSubject: mockSetSubject });
const mockSetProtectedHeader = jest
  .fn()
  .mockReturnValue({ setIssuer: mockSetIssuer });

jest.mock("jose", () => ({
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: mockSetProtectedHeader,
  })),
}));

// Mock crypto.createPrivateKey — just return a truthy value
jest.mock("crypto", () => ({
  ...jest.requireActual("crypto"),
  createPrivateKey: jest.fn().mockReturnValue("mock-private-key-object"),
}));
import crypto from "crypto";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makePostRequest(body: Record<string, unknown>): NextRequest {
  return new Request("http://localhost/api/admin/apple-secret", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

const VALID_BODY = {
  privateKey: "-----BEGIN PRIVATE KEY-----\nfake\n-----END PRIVATE KEY-----",
  keyId: "M2MVUK46V5",
  teamId: "DKK4H2SAU4",
  clientId: "com.athlifyr.web",
  expiresInDays: 180,
};

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ── Authorization ─────────────────────────────────────────────────────────────

describe("POST /api/admin/apple-secret — authorization", () => {
  it("returns 401 when no session", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const res = await POST(makePostRequest(VALID_BODY));
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized");
  });

  it("returns 401 when user is not admin", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { id: "user-1", role: "USER", email: "user@test.com" },
    });

    const res = await POST(makePostRequest(VALID_BODY));
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized");
  });
});

// ── Validation ────────────────────────────────────────────────────────────────

describe("POST /api/admin/apple-secret — validation", () => {
  beforeEach(() => {
    (auth as jest.Mock).mockResolvedValue({
      user: { id: "admin-1", role: "ADMIN", email: "admin@test.com" },
    });
  });

  it("returns 400 when privateKey is missing", async () => {
    const { privateKey, ...bodyWithoutKey } = VALID_BODY;
    void privateKey;
    const res = await POST(makePostRequest(bodyWithoutKey));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain("required");
  });

  it("returns 400 when keyId is missing", async () => {
    const { keyId, ...body } = VALID_BODY;
    void keyId;
    const res = await POST(makePostRequest(body));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain("required");
  });

  it("returns 400 when expiresInDays is less than 1", async () => {
    const res = await POST(
      makePostRequest({ ...VALID_BODY, expiresInDays: 0 })
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain("expiresInDays");
  });

  it("returns 400 when expiresInDays is greater than 180", async () => {
    const res = await POST(
      makePostRequest({ ...VALID_BODY, expiresInDays: 365 })
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain("expiresInDays");
  });

  it("returns 400 when expiresInDays is not a number", async () => {
    const res = await POST(
      makePostRequest({ ...VALID_BODY, expiresInDays: "abc" })
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain("expiresInDays");
  });
});

// ── Successful generation ─────────────────────────────────────────────────────

describe("POST /api/admin/apple-secret — success", () => {
  beforeEach(() => {
    (auth as jest.Mock).mockResolvedValue({
      user: { id: "admin-1", role: "ADMIN", email: "admin@test.com" },
    });
  });

  it("generates JWT with correct parameters", async () => {
    const res = await POST(makePostRequest(VALID_BODY));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.secret).toBe("mock-jwt-token");
    expect(json.expiresAt).toBeDefined();
    expect(crypto.createPrivateKey).toHaveBeenCalledWith(VALID_BODY.privateKey);
    expect(mockSetProtectedHeader).toHaveBeenCalledWith({
      alg: "ES256",
      kid: "M2MVUK46V5",
    });
    expect(mockSetIssuer).toHaveBeenCalledWith("DKK4H2SAU4");
    expect(mockSetSubject).toHaveBeenCalledWith("com.athlifyr.web");
    expect(mockSetAudience).toHaveBeenCalledWith("https://appleid.apple.com");
  });

  it("returns correct expiration date", async () => {
    const before = Date.now();
    const res = await POST(makePostRequest(VALID_BODY));
    const json = await res.json();

    const expiresAt = new Date(json.expiresAt).getTime();
    const expectedMs = 180 * 24 * 60 * 60 * 1000;

    // Expiry should be ~180 days from now (allow 5s tolerance)
    expect(expiresAt).toBeGreaterThanOrEqual(before + expectedMs - 5000);
    expect(expiresAt).toBeLessThanOrEqual(Date.now() + expectedMs + 5000);
  });
});

// ── Error handling ────────────────────────────────────────────────────────────

describe("POST /api/admin/apple-secret — error handling", () => {
  beforeEach(() => {
    (auth as jest.Mock).mockResolvedValue({
      user: { id: "admin-1", role: "ADMIN", email: "admin@test.com" },
    });
  });

  it("returns 400 with message when private key is invalid", async () => {
    (crypto.createPrivateKey as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid key format");
    });

    const res = await POST(makePostRequest(VALID_BODY));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain("Invalid key format");
  });

  it("returns 500 on non-Error exception", async () => {
    (crypto.createPrivateKey as jest.Mock).mockImplementation(() => {
      throw "unexpected";
    });

    const res = await POST(makePostRequest(VALID_BODY));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Failed to generate secret");
  });
});
