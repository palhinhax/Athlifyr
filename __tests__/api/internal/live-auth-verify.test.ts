/**
 * @jest-environment node
 */

/**
 * Tests for POST /api/internal/live-auth/verify
 *
 * Covers:
 * - Forbidden when not from Live Server (403)
 * - Missing userId or eventId (400)
 * - Returns verified=false when no registration/participation
 * - Returns verified=true with athlete data from registration
 * - Returns verified=true from participation fallback
 * - Internal server error (500)
 */

import { NextRequest } from "next/server";
import { POST } from "@/app/api/internal/live-auth/verify/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => ({
  prisma: {
    registration: { findFirst: jest.fn() },
    participation: { findFirst: jest.fn() },
  },
}));
import { prisma } from "@/lib/prisma";

// ── Helpers ───────────────────────────────────────────────────────────────────

const LIVE_SECRET = "test-secret";

beforeAll(() => {
  process.env.LIVE_INTERNAL_SECRET = LIVE_SECRET;
});

function makeRequest(
  body: Record<string, unknown>,
  isLiveServer = true
): NextRequest {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (isLiveServer) {
    headers["x-live-server"] = "true";
    headers["x-live-secret"] = LIVE_SECRET;
  }
  return new Request("http://localhost/api/internal/live-auth/verify", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

describe("POST /api/internal/live-auth/verify", () => {
  it("returns 403 when not from Live Server", async () => {
    const res = await POST(makeRequest({ userId: "u1", eventId: "e1" }, false));
    expect(res.status).toBe(403);
  });

  it("returns 403 when secret is wrong", async () => {
    const req = new Request("http://localhost/api/internal/live-auth/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-live-server": "true",
        "x-live-secret": "wrong-secret",
      },
      body: JSON.stringify({ userId: "u1", eventId: "e1" }),
    }) as unknown as NextRequest;

    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it("returns 400 when missing userId or eventId", async () => {
    const res = await POST(makeRequest({ userId: "", eventId: "" }));
    expect(res.status).toBe(400);
  });

  it("returns verified=false when no registration or participation", async () => {
    (prisma.registration.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.participation.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest({ userId: "u1", eventId: "e1" }));
    const json = await res.json();

    expect(json.verified).toBe(false);
    expect(json.reason).toBeDefined();
  });

  it("returns verified=true with athlete data from registration", async () => {
    (prisma.registration.findFirst as jest.Mock).mockResolvedValue({
      id: "reg-1",
      variantId: "v1",
      bibNumber: "42",
      variant: { id: "v1", name: "Trail 20km" },
      user: {
        id: "u1",
        name: "Runner A",
        image: "img.jpg",
        liveRaceVisibility: "PUBLIC",
      },
    });

    const res = await POST(makeRequest({ userId: "u1", eventId: "e1" }));
    const json = await res.json();

    expect(json.verified).toBe(true);
    expect(json.athlete.userId).toBe("u1");
    expect(json.athlete.bibNumber).toBe("42");
    expect(json.athlete.variantName).toBe("Trail 20km");
    expect(json.athlete.liveRaceVisibility).toBe("PUBLIC");
  });

  it("returns verified=true from participation fallback", async () => {
    (prisma.registration.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.participation.findFirst as jest.Mock).mockResolvedValue({
      id: "part-1",
      variantId: "v1",
      variant: { id: "v1", name: "Fun Run" },
      user: {
        id: "u1",
        name: "Runner B",
        image: null,
        liveRaceVisibility: "FRIENDS",
      },
    });

    const res = await POST(makeRequest({ userId: "u1", eventId: "e1" }));
    const json = await res.json();

    expect(json.verified).toBe(true);
    expect(json.athlete.userId).toBe("u1");
    expect(json.athlete.bibNumber).toBeNull();
    expect(json.athlete.liveRaceVisibility).toBe("FRIENDS");
  });

  it("returns 500 on internal error", async () => {
    (prisma.registration.findFirst as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await POST(makeRequest({ userId: "u1", eventId: "e1" }));
    expect(res.status).toBe(500);
  });
});
