/**
 * @jest-environment node
 */

/**
 * Tests for POST /api/giveaways/[id]/join
 *
 * Covers:
 * - Returns 401 when not authenticated
 * - Returns 404 when giveaway not found
 * - Returns 400 when giveaway is not SCHEDULED
 * - Returns 403 when platform restriction blocks participation (MOBILE, ANDROID, IOS)
 * - Allows participation when platform is ALL
 * - Allows mobile user to join MOBILE-restricted giveaway
 * - Allows ios user to join IOS-restricted giveaway
 * - Allows android user to join ANDROID-restricted giveaway
 * - Returns 400 when deadline has passed
 * - Returns existing participation if user already joined
 * - Creates new participation with sequential ticket number
 * - Returns 500 on database error
 */

import { NextRequest } from "next/server";
import { POST } from "@/app/api/giveaways/[id]/join/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth-helpers", () => ({
  getAuthenticatedUser: jest.fn(),
}));
import { getAuthenticatedUser } from "@/lib/auth-helpers";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    giveaway: { findUnique: jest.fn() },
    giveawayParticipation: { findUnique: jest.fn(), count: jest.fn() },
    $transaction: jest.fn(),
  },
}));
import { prisma } from "@/lib/prisma";

// ── Helpers ───────────────────────────────────────────────────────────────────

const USER = { id: "user-1", email: "user@test.com", role: "USER" };

function makeRequest(headers: Record<string, string> = {}): NextRequest {
  return new NextRequest("http://localhost/api/giveaways/g1/join", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
  });
}

function makeParams(id = "g1") {
  return { params: Promise.resolve({ id }) };
}

const FUTURE_DATE = new Date(Date.now() + 86_400_000); // tomorrow
const PAST_DATE = new Date(Date.now() - 86_400_000); // yesterday

function makeGiveaway(overrides: Record<string, unknown> = {}) {
  return {
    id: "g1",
    status: "SCHEDULED",
    platform: "ALL",
    drawAt: FUTURE_DATE,
    ...overrides,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

describe("POST /api/giveaways/[id]/join", () => {
  it("returns 401 when not authenticated", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized");
  });

  it("returns 404 when giveaway not found", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(USER);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Giveaway not found");
  });

  it("returns 400 when giveaway is not SCHEDULED", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(USER);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ status: "DRAFT" })
    );

    const res = await POST(makeRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Giveaway is not open for participation");
  });

  // ── Platform restriction tests ──────────────────────────────────────────

  it("returns 403 when MOBILE giveaway accessed from web", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(USER);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ platform: "MOBILE" })
    );

    const res = await POST(makeRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.error).toBe(
      "This giveaway is only available on the mobile app"
    );
  });

  it("returns 403 when ANDROID giveaway accessed from ios", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(USER);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ platform: "ANDROID" })
    );

    const res = await POST(
      makeRequest({ "x-client-platform": "ios" }),
      makeParams()
    );
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.error).toBe("This giveaway is only available on Android");
  });

  it("returns 403 when IOS giveaway accessed from android", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(USER);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ platform: "IOS" })
    );

    const res = await POST(
      makeRequest({ "x-client-platform": "android" }),
      makeParams()
    );
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.error).toBe("This giveaway is only available on iOS");
  });

  it("allows mobile user to join MOBILE-restricted giveaway", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(USER);
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
      makeRequest({ "x-client-platform": "ios" }),
      makeParams()
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.ticketNumber).toBe(1);
  });

  it("allows android user to join ANDROID-restricted giveaway", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(USER);
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
      makeRequest({ "x-client-platform": "android" }),
      makeParams()
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
  });

  it("allows ios user to join IOS-restricted giveaway", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(USER);
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
      makeRequest({ "x-client-platform": "ios" }),
      makeParams()
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
  });

  it("allows participation when platform is ALL", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(USER);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ platform: "ALL" })
    );
    (prisma.giveawayParticipation.findUnique as jest.Mock).mockResolvedValue(
      null
    );
    (prisma.$transaction as jest.Mock).mockResolvedValue({
      created: { ticketNumber: 5 },
      currentParticipantsCount: 5,
    });

    const res = await POST(makeRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.ticketNumber).toBe(5);
    expect(json.currentParticipantsCount).toBe(5);
  });

  // ── Deadline and duplicate tests ────────────────────────────────────────

  it("returns 400 when deadline has passed", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(USER);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(
      makeGiveaway({ drawAt: PAST_DATE })
    );

    const res = await POST(makeRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Giveaway participation deadline has passed");
  });

  it("returns existing participation if user already joined", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(USER);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(makeGiveaway());
    (prisma.giveawayParticipation.findUnique as jest.Mock).mockResolvedValue({
      ticketNumber: 3,
    });
    (prisma.giveawayParticipation.count as jest.Mock).mockResolvedValue(10);

    const res = await POST(makeRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.hasJoined).toBe(true);
    expect(json.ticketNumber).toBe(3);
    expect(json.currentParticipantsCount).toBe(10);
  });

  it("creates new participation with sequential ticket", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(USER);
    (prisma.giveaway.findUnique as jest.Mock).mockResolvedValue(makeGiveaway());
    (prisma.giveawayParticipation.findUnique as jest.Mock).mockResolvedValue(
      null
    );
    (prisma.$transaction as jest.Mock).mockResolvedValue({
      created: { ticketNumber: 7 },
      currentParticipantsCount: 7,
    });

    const res = await POST(makeRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.hasJoined).toBe(true);
    expect(json.ticketNumber).toBe(7);
    expect(json.currentParticipantsCount).toBe(7);
  });

  it("returns 500 on database error", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(USER);
    (prisma.giveaway.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await POST(makeRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Failed to join giveaway");
  });
});
