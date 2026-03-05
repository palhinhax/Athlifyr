/**
 * @jest-environment node
 */

/**
 * Tests for GET/PATCH /api/profile/privacy
 *
 * Covers:
 * - GET: authentication required (401)
 * - GET: user not found (404)
 * - GET: returns privacy settings
 * - PATCH: integrity check failure
 * - PATCH: authentication required (401)
 * - PATCH: invalid data (400 - Zod validation)
 * - PATCH: successful update
 * - PATCH: internal server error (500)
 */

import { NextRequest, NextResponse } from "next/server";
import { GET, PATCH } from "@/app/api/profile/privacy/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth-helpers", () => ({
  getAuthenticatedUser: jest.fn(),
}));
import { getAuthenticatedUser } from "@/lib/auth-helpers";

jest.mock("@/lib/verify-integrity", () => ({
  requireIntegrity: jest.fn(),
}));
import { requireIntegrity } from "@/lib/verify-integrity";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));
import { prisma } from "@/lib/prisma";

// ── Helpers ───────────────────────────────────────────────────────────────────

const AUTH_USER = { id: "user-1", email: "user@test.com", role: "USER" };

function makeGetRequest(): NextRequest {
  return new Request("http://localhost/api/profile/privacy", {
    method: "GET",
  }) as unknown as NextRequest;
}

function makePatchRequest(body: Record<string, unknown>): NextRequest {
  return new Request("http://localhost/api/profile/privacy", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  (requireIntegrity as jest.Mock).mockResolvedValue(null);
});

describe("GET /api/profile/privacy", () => {
  it("returns 401 when not authenticated", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeGetRequest());
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized");
  });

  it("returns 404 when user not found", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeGetRequest());
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("User not found");
  });

  it("returns privacy settings successfully", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      liveRaceVisibility: "FRIENDS",
    });

    const res = await GET(makeGetRequest());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.liveRaceVisibility).toBe("FRIENDS");
  });

  it("returns 500 on internal error", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);
    (prisma.user.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await GET(makeGetRequest());
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Failed to fetch privacy settings");
  });
});

describe("PATCH /api/profile/privacy", () => {
  it("returns integrity error when integrity check fails", async () => {
    const integrityResponse = NextResponse.json(
      { error: "Integrity failed" },
      { status: 403 }
    );
    (requireIntegrity as jest.Mock).mockResolvedValue(integrityResponse);

    const res = await PATCH(makePatchRequest({ liveRaceVisibility: "PUBLIC" }));
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.error).toBe("Integrity failed");
  });

  it("returns 401 when not authenticated", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);

    const res = await PATCH(makePatchRequest({ liveRaceVisibility: "PUBLIC" }));
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized");
  });

  it("returns 400 for invalid data", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);

    const res = await PATCH(
      makePatchRequest({ liveRaceVisibility: "INVALID_VALUE" })
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Invalid data");
    expect(json.details).toBeDefined();
  });

  it("updates privacy settings successfully", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);
    (prisma.user.update as jest.Mock).mockResolvedValue({
      liveRaceVisibility: "ORGANIZER_ONLY",
    });

    const res = await PATCH(
      makePatchRequest({ liveRaceVisibility: "ORGANIZER_ONLY" })
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.liveRaceVisibility).toBe("ORGANIZER_ONLY");
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: AUTH_USER.id },
      data: { liveRaceVisibility: "ORGANIZER_ONLY" },
      select: { liveRaceVisibility: true },
    });
  });

  it("returns 500 on internal error", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);
    (prisma.user.update as jest.Mock).mockRejectedValue(new Error("DB error"));

    const res = await PATCH(makePatchRequest({ liveRaceVisibility: "PUBLIC" }));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Failed to update privacy settings");
  });
});
