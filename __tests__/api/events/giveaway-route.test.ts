/**
 * @jest-environment node
 */

/**
 * Tests for GET /api/events/[id]/giveaway
 *
 * Covers:
 * - Returns giveaway with platform field
 * - Returns null when no active giveaway
 * - Translation fallback (lang → en → pt)
 * - User participation status
 * - Internal server error (500)
 */

import { GET } from "@/app/api/events/[id]/giveaway/route";
import { NextRequest } from "next/server";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth-helpers", () => ({
  getAuthenticatedUser: jest.fn(),
}));
import { getAuthenticatedUser } from "@/lib/auth-helpers";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    giveaway: { findFirst: jest.fn() },
    giveawayParticipation: { findUnique: jest.fn() },
  },
}));
import { prisma } from "@/lib/prisma";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeRequest(lang = "en"): NextRequest {
  return new NextRequest(
    `http://localhost/api/events/evt1/giveaway?lang=${lang}`
  );
}

function makeParams(id = "evt1") {
  return { params: Promise.resolve({ id }) };
}

function makeGiveawayResult(overrides: Record<string, unknown> = {}) {
  return {
    id: "g1",
    status: "SCHEDULED",
    platform: "ALL",
    drawAt: null,
    drawnAt: null,
    prizeCount: 1,
    secretHash: "abc123",
    secretRevealed: null,
    finalParticipantsCount: null,
    winningTicketNumbers: [],
    winningTicketAttempts: [],
    translations: [
      { lang: "en", title: "Win a prize", details: "Details here" },
      { lang: "pt", title: "Ganha um prémio", details: "Detalhes aqui" },
    ],
    winners: [],
    _count: { participations: 5 },
    ...overrides,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

describe("GET /api/events/[id]/giveaway", () => {
  it("returns giveaway with platform field", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);
    (prisma.giveaway.findFirst as jest.Mock).mockResolvedValue(
      makeGiveawayResult({ platform: "MOBILE" })
    );

    const res = await GET(makeRequest(), makeParams());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.giveaway.platform).toBe("MOBILE");
    expect(json.giveaway.id).toBe("g1");
  });

  it("returns platform ALL by default", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);
    (prisma.giveaway.findFirst as jest.Mock).mockResolvedValue(
      makeGiveawayResult()
    );

    const res = await GET(makeRequest(), makeParams());
    const json = await res.json();
    expect(json.giveaway.platform).toBe("ALL");
  });

  it("returns platform ANDROID", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);
    (prisma.giveaway.findFirst as jest.Mock).mockResolvedValue(
      makeGiveawayResult({ platform: "ANDROID" })
    );

    const res = await GET(makeRequest(), makeParams());
    const json = await res.json();
    expect(json.giveaway.platform).toBe("ANDROID");
  });

  it("returns platform IOS", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);
    (prisma.giveaway.findFirst as jest.Mock).mockResolvedValue(
      makeGiveawayResult({ platform: "IOS" })
    );

    const res = await GET(makeRequest(), makeParams());
    const json = await res.json();
    expect(json.giveaway.platform).toBe("IOS");
  });

  it("returns null when no active giveaway", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);
    (prisma.giveaway.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeRequest(), makeParams());
    const json = await res.json();
    expect(json.giveaway).toBeNull();
  });

  it("returns user participation status when authenticated", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ id: "u1" });
    (prisma.giveaway.findFirst as jest.Mock).mockResolvedValue(
      makeGiveawayResult()
    );
    (prisma.giveawayParticipation.findUnique as jest.Mock).mockResolvedValue({
      ticketNumber: 3,
    });

    const res = await GET(makeRequest(), makeParams());
    const json = await res.json();
    expect(json.giveaway.hasJoined).toBe(true);
    expect(json.giveaway.ticketNumber).toBe(3);
  });

  it("returns hasJoined false when user not joined", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue({ id: "u1" });
    (prisma.giveaway.findFirst as jest.Mock).mockResolvedValue(
      makeGiveawayResult()
    );
    (prisma.giveawayParticipation.findUnique as jest.Mock).mockResolvedValue(
      null
    );

    const res = await GET(makeRequest(), makeParams());
    const json = await res.json();
    expect(json.giveaway.hasJoined).toBe(false);
    expect(json.giveaway.ticketNumber).toBeNull();
  });

  it("uses translation fallback to en", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);
    (prisma.giveaway.findFirst as jest.Mock).mockResolvedValue(
      makeGiveawayResult({
        translations: [
          { lang: "en", title: "English title", details: "Details" },
        ],
      })
    );

    const res = await GET(makeRequest("de"), makeParams());
    const json = await res.json();
    expect(json.giveaway.translation.lang).toBe("en");
  });

  it("returns 500 on internal error", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);
    (prisma.giveaway.findFirst as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await GET(makeRequest(), makeParams());
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Failed to fetch giveaway" });
  });
});
