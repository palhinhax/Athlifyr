/**
 * @jest-environment node
 */

/**
 * Tests for GET /api/events/[id]/giveaway
 *
 * Covers:
 * - Returns null when no active giveaway exists
 * - Returns giveaway with platform field
 * - Returns hasJoined/ticketNumber for authenticated user
 * - Returns hasJoined=false for unauthenticated user
 * - Applies lang parameter for translations
 * - Returns 500 on database error
 */

import { NextRequest } from "next/server";
import { GET } from "@/app/api/events/[id]/giveaway/route";

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

const USER = { id: "user-1", email: "user@test.com", role: "USER" };

function makeRequest(queryParams: Record<string, string> = {}): NextRequest {
  const url = new URL("http://localhost/api/events/e1/giveaway");
  Object.entries(queryParams).forEach(([k, v]) => url.searchParams.set(k, v));
  return new NextRequest(url.toString(), { method: "GET" });
}

function makeParams(id = "e1") {
  return { params: Promise.resolve({ id }) };
}

function makeGiveaway(overrides: Record<string, unknown> = {}) {
  return {
    id: "g1",
    status: "SCHEDULED",
    platform: "ALL",
    drawAt: "2026-12-31T00:00:00Z",
    drawnAt: null,
    prizeCount: 1,
    secretHash: "hash123",
    secretRevealed: null,
    finalParticipantsCount: null,
    winningTicketNumbers: null,
    winningTicketAttempts: null,
    translations: [
      { lang: "en", title: "Win a Prize", details: "Details" },
      { lang: "pt", title: "Ganha um Prémio", details: "Detalhes" },
    ],
    winners: [],
    _count: { participations: 10 },
    ...overrides,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

describe("GET /api/events/[id]/giveaway", () => {
  it("returns null when no active giveaway exists", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);
    (prisma.giveaway.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.giveaway).toBeNull();
  });

  it("returns giveaway with platform field", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);
    (prisma.giveaway.findFirst as jest.Mock).mockResolvedValue(
      makeGiveaway({ platform: "MOBILE" })
    );

    const res = await GET(makeRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.giveaway.platform).toBe("MOBILE");
    expect(json.giveaway.status).toBe("SCHEDULED");
  });

  it("returns hasJoined and ticketNumber for authenticated user", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(USER);
    (prisma.giveaway.findFirst as jest.Mock).mockResolvedValue(makeGiveaway());
    (prisma.giveawayParticipation.findUnique as jest.Mock).mockResolvedValue({
      ticketNumber: 42,
    });

    const res = await GET(makeRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.giveaway.hasJoined).toBe(true);
    expect(json.giveaway.ticketNumber).toBe(42);
  });

  it("returns hasJoined=false for unauthenticated user", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);
    (prisma.giveaway.findFirst as jest.Mock).mockResolvedValue(makeGiveaway());

    const res = await GET(makeRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.giveaway.hasJoined).toBe(false);
    expect(json.giveaway.ticketNumber).toBeNull();
  });

  it("applies lang parameter for translations", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);
    (prisma.giveaway.findFirst as jest.Mock).mockResolvedValue(makeGiveaway());

    const res = await GET(makeRequest({ lang: "pt" }), makeParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.giveaway.translation.lang).toBe("pt");
    expect(json.giveaway.translation.title).toBe("Ganha um Prémio");
  });

  it("falls back to en translation when requested lang not found", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);
    (prisma.giveaway.findFirst as jest.Mock).mockResolvedValue(makeGiveaway());

    const res = await GET(makeRequest({ lang: "de" }), makeParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.giveaway.translation.lang).toBe("en");
  });

  it("returns 500 on database error", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);
    (prisma.giveaway.findFirst as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await GET(makeRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Failed to fetch giveaway");
  });
});
