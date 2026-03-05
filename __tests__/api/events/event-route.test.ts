/**
 * @jest-environment node
 */

/**
 * Tests for GET /api/events/[id]/route
 *
 * Covers:
 * - Returns route data for all variants with routes
 * - Filters out variants without routes
 * - Returns empty array when no variants have routes
 * - Internal server error (500)
 */

import { GET } from "@/app/api/events/[id]/route/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => ({
  prisma: {
    eventVariant: { findMany: jest.fn() },
  },
}));
import { prisma } from "@/lib/prisma";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeRequest(): Request {
  return new Request("http://localhost/api/events/event-1/route");
}

function makeParams(id = "event-1") {
  return { params: Promise.resolve({ id }) };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

describe("GET /api/events/[id]/route", () => {
  it("returns route data for variants with routes", async () => {
    (prisma.eventVariant.findMany as jest.Mock).mockResolvedValue([
      {
        id: "v1",
        name: "Trail 20km",
        route: {
          routePoints: [
            [38.5, -8.9],
            [38.6, -8.8],
          ],
          checkpoints: [
            {
              id: "cp1",
              name: "Start",
              type: "START",
              latitude: 38.5,
              longitude: -8.9,
              order: 0,
              radiusM: 50,
              cutoffMin: null,
            },
          ],
        },
      },
    ]);

    const res = await GET(makeRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.variants).toHaveLength(1);
    expect(json.variants[0].variantId).toBe("v1");
    expect(json.variants[0].variantName).toBe("Trail 20km");
    expect(json.variants[0].routePoints).toHaveLength(2);
    expect(json.variants[0].checkpoints).toHaveLength(1);
  });

  it("filters out variants without routes", async () => {
    (prisma.eventVariant.findMany as jest.Mock).mockResolvedValue([
      {
        id: "v1",
        name: "With Route",
        route: {
          routePoints: [[38.5, -8.9]],
          checkpoints: [],
        },
      },
      {
        id: "v2",
        name: "No Route",
        route: null,
      },
    ]);

    const res = await GET(makeRequest(), makeParams());
    const json = await res.json();

    expect(json.variants).toHaveLength(1);
    expect(json.variants[0].variantId).toBe("v1");
  });

  it("returns empty variants array when none have routes", async () => {
    (prisma.eventVariant.findMany as jest.Mock).mockResolvedValue([
      { id: "v1", name: "No Route", route: null },
    ]);

    const res = await GET(makeRequest(), makeParams());
    const json = await res.json();

    expect(json.variants).toEqual([]);
  });

  it("returns 500 on internal error", async () => {
    (prisma.eventVariant.findMany as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await GET(makeRequest(), makeParams());
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Internal server error" });
  });
});
