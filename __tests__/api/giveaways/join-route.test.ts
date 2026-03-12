/**
 * @jest-environment node
 */

/**
 * Tests for POST /api/giveaways/[id]/join
 *
 * Covers:
 * - Unauthorized request (no user)
 * - Giveaway not found
 * - Giveaway not SCHEDULED
 * - Deadline passed
 * - Platform restriction: MOBILE-only blocks web client
 * - Platform restriction: ANDROID-only blocks iOS client
 * - Platform restriction: IOS-only blocks Android client
 * - Platform restriction: MOBILE allows mobile client
 * - Platform restriction: ALL allows any client
 * - Already joined returns existing ticket
 * - Successful join assigns sequential ticket
 * - Internal server error (500)
 */

import { POST } from "@/app/api/giveaways/[id]/join/route";
import { NextRequest } from "next/server";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth-helpers", () => ({
  getAuthenticatedUser: jest.fn(),
}));
import { getAuthenticatedUser } from "@/lib/auth-helpers";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    giveaway: { findUnique: jest.fn() },
    giveawayParticipation: {
      findUnique: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));
import { prisma } from "@/lib/prisma";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeRequest(headers: Record<string, string> = {}): NextRequest {
  return new NextRequest("http://localhost/api/giveaways/g1/join", {
    method: "POST",
    headers,
  });
}

function makeParams(id = "g1") {
  return { params: Promise.resolve({ id }) };
}

const futureDate = new Date(Date.now() + 86400000); // tomorrow
const pastDate = new Date(Date.now() - 86400000); // yesterday

function makeGiveaway(overrides: Record<string, unknown> = {}) {
  return {
    id: "g1",
    status: "SCHEDULED",
    platform: "ALL",
    drawAt: futureDate,
    ...overrides,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

describe("POST /api/giveaways/[id]/join", () => {
  it("returns 401 when user is not authenticated", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest(), makeParams());
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  it("returns 404 when giveaway not found", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ id: "u1" });
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest(), makeParams());
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Giveaway not found" });
  });

  it("returns 400 when giveaway is not SCHEDULED", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ id: "u1" });
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ status: "DRAWN" })
    );

    const res = await POST(makeRequest(), makeParams());
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: "Giveaway is not open for participation",
    });
  });

  it("returns 400 when participation deadline has passed", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ id: "u1" });
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ drawAt: pastDate })
    );

    const res = await POST(makeRequest(), makeParams());
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: "Giveaway participation deadline has passed",
    });
  });

  // ── Platform restriction tests ──

  it("returns 403 when MOBILE giveaway accessed from web", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ id: "u1" });
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ platform: "MOBILE" })
    );

    const res = await POST(
      makeRequest({ "user-agent": "Mozilla/5.0 Chrome" }),
      makeParams()
    );
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({
      error: "This giveaway is exclusive to the mobile app",
    });
  });

  it("returns 403 when ANDROID giveaway accessed from iOS client", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ id: "u1" });
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ platform: "ANDROID" })
    );

    const res = await POST(
      makeRequest({
        "user-agent": "Athlifyr/1.0",
        "x-client-platform": "ios",
      }),
      makeParams()
    );
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({
      error: "This giveaway is exclusive to Android",
    });
  });

  it("returns 403 when IOS giveaway accessed from Android client", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ id: "u1" });
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ platform: "IOS" })
    );

    const res = await POST(
      makeRequest({
        "user-agent": "Athlifyr/1.0",
        "x-client-platform": "android",
      }),
      makeParams()
    );
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({
      error: "This giveaway is exclusive to iOS",
    });
  });

  it("allows MOBILE giveaway from mobile client with Athlifyr user-agent", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ id: "u1" });
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ platform: "MOBILE" })
    );
    (prisma.giveawayParticipation.findUnique as jest.Mock).mockResolvedValue(
      null
    );
    (prisma.$transaction as jest.Mock).mockResolvedValue({
      created: { ticketNumber: 1 },
      currentParticipantsCount: 1,
    });

    const res = await POST(
      makeRequest({ "user-agent": "Athlifyr/1.0" }),
      makeParams()
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.ticketNumber).toBe(1);
  });

  it("allows MOBILE giveaway from client with x-client-platform android", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ id: "u1" });
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ platform: "MOBILE" })
    );
    (prisma.giveawayParticipation.findUnique as jest.Mock).mockResolvedValue(
      null
    );
    (prisma.$transaction as jest.Mock).mockResolvedValue({
      created: { ticketNumber: 1 },
      currentParticipantsCount: 1,
    });

    const res = await POST(
      makeRequest({ "x-client-platform": "android" }),
      makeParams()
    );
    expect(res.status).toBe(200);
  });

  it("allows ANDROID giveaway from Android client", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ id: "u1" });
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ platform: "ANDROID" })
    );
    (prisma.giveawayParticipation.findUnique as jest.Mock).mockResolvedValue(
      null
    );
    (prisma.$transaction as jest.Mock).mockResolvedValue({
      created: { ticketNumber: 1 },
      currentParticipantsCount: 1,
    });

    const res = await POST(
      makeRequest({
        "user-agent": "Athlifyr/1.0",
        "x-client-platform": "android",
      }),
      makeParams()
    );
    expect(res.status).toBe(200);
  });

  it("allows IOS giveaway from iOS client", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ id: "u1" });
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ platform: "IOS" })
    );
    (prisma.giveawayParticipation.findUnique as jest.Mock).mockResolvedValue(
      null
    );
    (prisma.$transaction as jest.Mock).mockResolvedValue({
      created: { ticketNumber: 1 },
      currentParticipantsCount: 1,
    });

    const res = await POST(
      makeRequest({
        "user-agent": "Athlifyr/1.0",
        "x-client-platform": "ios",
      }),
      makeParams()
    );
    expect(res.status).toBe(200);
  });

  it("allows ALL-platform giveaway from any client", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ id: "u1" });
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ platform: "ALL" })
    );
    (prisma.giveawayParticipation.findUnique as jest.Mock).mockResolvedValue(
      null
    );
    (prisma.$transaction as jest.Mock).mockResolvedValue({
      created: { ticketNumber: 3 },
      currentParticipantsCount: 3,
    });

    const res = await POST(
      makeRequest({ "user-agent": "Mozilla/5.0 Chrome" }),
      makeParams()
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  // ── Existing participation ──

  it("returns existing ticket when user already joined", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ id: "u1" });
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(makeGiveaway());
    (prisma.giveawayParticipation.findUnique as jest.Mock).mockResolvedValue({
      ticketNumber: 5,
    });
    (prisma.giveawayParticipation.count as jest.Mock).mockResolvedValue(10);

    const res = await POST(makeRequest(), makeParams());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.hasJoined).toBe(true);
    expect(json.ticketNumber).toBe(5);
    expect(json.currentParticipantsCount).toBe(10);
  });

  // ── Successful join ──

  it("creates new participation with sequential ticket", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ id: "u1" });
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(makeGiveaway());
    (prisma.giveawayParticipation.findUnique as jest.Mock).mockResolvedValue(
      null
    );
    (prisma.$transaction as jest.Mock).mockResolvedValue({
      created: { ticketNumber: 7 },
      currentParticipantsCount: 7,
    });

    const res = await POST(makeRequest(), makeParams());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.hasJoined).toBe(true);
    expect(json.ticketNumber).toBe(7);
    expect(json.currentParticipantsCount).toBe(7);
  });

  // ── Error handling ──

  it("returns 500 on internal error", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ id: "u1" });
    (prisma.giveaway.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await POST(makeRequest(), makeParams());
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Failed to join giveaway" });
  });

  // ── Edge case: drawAt is null (no deadline) ──

  it("allows join when drawAt is null", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ id: "u1" });
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ drawAt: null })
    );
    (prisma.giveawayParticipation.findUnique as jest.Mock).mockResolvedValue(
      null
    );
    (prisma.$transaction as jest.Mock).mockResolvedValue({
      created: { ticketNumber: 1 },
      currentParticipantsCount: 1,
    });

    const res = await POST(makeRequest(), makeParams());
    expect(res.status).toBe(200);
    expect((await res.json()).success).toBe(true);
  });
});
