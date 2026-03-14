/**
 * @jest-environment node
 */

/**
 * Tests for GET /api/auth/live-token
 *
 * Covers:
 * - Unauthenticated request → 401
 * - User missing email → 401
 * - Authenticated user receives JWT token
 * - Default role to USER when not set
 */

import { NextRequest } from "next/server";
import { GET } from "@/app/api/auth/live-token/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth-helpers", () => ({
  getAuthenticatedUser: jest.fn(),
}));
import { getAuthenticatedUser } from "@/lib/auth-helpers";

jest.mock("@/lib/jwt", () => ({
  generateAccessToken: jest.fn().mockReturnValue("mock-live-token"),
}));
import { generateAccessToken } from "@/lib/jwt";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeRequest(): NextRequest {
  return new NextRequest("http://localhost/api/auth/live-token", {
    method: "GET",
  });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /api/auth/live-token", () => {
  it("returns 401 when user is not authenticated", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeRequest());
    expect(res.status).toBe(401);

    const body = await res.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 401 when user has no id", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({
      id: null,
      email: "test@example.com",
    });

    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
  });

  it("returns 401 when user has no email", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({
      id: "user-1",
      email: null,
    });

    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
  });

  it("returns a JWT token for authenticated user", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
      role: "ADMIN",
    });

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.token).toBe("mock-live-token");

    expect(generateAccessToken).toHaveBeenCalledWith({
      userId: "user-1",
      email: "test@example.com",
      role: "ADMIN",
    });
  });

  it("defaults role to USER when not set", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
      role: null,
    });

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);

    expect(generateAccessToken).toHaveBeenCalledWith({
      userId: "user-1",
      email: "test@example.com",
      role: "USER",
    });
  });
});
