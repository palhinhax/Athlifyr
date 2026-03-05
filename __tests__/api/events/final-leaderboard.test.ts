/**
 * @jest-environment node
 */

/**
 * Tests for GET /api/events/[id]/final-leaderboard
 *
 * Covers:
 * - Event not found (404)
 * - LiveRace not enabled (400)
 * - Returns formatted leaderboard entries
 * - Internal server error (500)
 */

import { NextRequest } from "next/server";
import { GET } from "@/app/api/events/[id]/final-leaderboard/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => ({
  prisma: {
    event: { findUnique: jest.fn() },
    result: { findMany: jest.fn() },
  },
}));
import { prisma } from "@/lib/prisma";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeRequest(): NextRequest {
  return new Request(
    "http://localhost/api/events/event-1/final-leaderboard"
  ) as unknown as NextRequest;
}

function makeParams(id = "event-1") {
  return { params: Promise.resolve({ id }) };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

describe("GET /api/events/[id]/final-leaderboard", () => {
  it("returns 404 when event not found", async () => {
    (prisma.event.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeRequest(), makeParams());
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Event not found" });
  });

  it("returns 400 when LiveRace not enabled", async () => {
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      liveStatus: "SCHEDULED",
      hasLiveRace: false,
    });

    const res = await GET(makeRequest(), makeParams());
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "LiveRace not enabled" });
  });

  it("returns formatted leaderboard entries", async () => {
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      liveStatus: "FINISHED",
      hasLiveRace: true,
    });
    (prisma.result.findMany as jest.Mock).mockResolvedValue([
      {
        position: 1,
        userId: "user-1",
        variantId: "variant-1",
        timeSeconds: 3600,
        user: { id: "user-1", name: "Runner A", image: "img-a.jpg" },
        variant: { id: "variant-1", name: "Trail 20km" },
      },
      {
        position: null,
        userId: "user-2",
        variantId: "variant-1",
        timeSeconds: null,
        user: { id: "user-2", name: "Runner B", image: null },
        variant: { id: "variant-1", name: "Trail 20km" },
      },
    ]);

    const res = await GET(makeRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.entries).toHaveLength(2);
    expect(json.entries[0]).toEqual(
      expect.objectContaining({
        rank: 1,
        userId: "user-1",
        name: "Runner A",
        finishTimeMs: 3600000,
        status: "FINISHED",
        progressPercent: 100,
      })
    );
    // null position → fallback index+1
    expect(json.entries[1].rank).toBe(2);
    expect(json.entries[1].finishTimeMs).toBeNull();
  });

  it("returns empty entries when no results", async () => {
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      liveStatus: "FINISHED",
      hasLiveRace: true,
    });
    (prisma.result.findMany as jest.Mock).mockResolvedValue([]);

    const res = await GET(makeRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.entries).toEqual([]);
  });

  it("handles null variant gracefully", async () => {
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      liveStatus: "FINISHED",
      hasLiveRace: true,
    });
    (prisma.result.findMany as jest.Mock).mockResolvedValue([
      {
        position: 1,
        userId: "user-1",
        variantId: null,
        timeSeconds: 1800,
        user: { id: "user-1", name: "Runner", image: null },
        variant: null,
      },
    ]);

    const res = await GET(makeRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.entries[0].variantId).toBe("");
    expect(json.entries[0].variantName).toBe("");
  });

  it("returns 500 on internal error", async () => {
    (prisma.event.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await GET(makeRequest(), makeParams());
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      error: "Failed to fetch leaderboard",
    });
  });
});
