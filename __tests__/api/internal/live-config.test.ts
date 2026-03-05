/**
 * @jest-environment node
 */

/**
 * Tests for GET /api/internal/live-config
 *
 * Covers:
 * - Forbidden when not from Live Server (403)
 * - Missing eventId parameter (400)
 * - Event not found (404)
 * - LiveRace not enabled (400)
 * - Returns full config with variant configs and settings
 * - Filters out variants without routes
 * - Internal server error (500)
 */

import { NextRequest } from "next/server";
import { GET } from "@/app/api/internal/live-config/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => ({
  prisma: {
    event: { findUnique: jest.fn() },
  },
}));
import { prisma } from "@/lib/prisma";

// ── Helpers ───────────────────────────────────────────────────────────────────

const LIVE_SECRET = "test-secret";

beforeAll(() => {
  process.env.LIVE_INTERNAL_SECRET = LIVE_SECRET;
});

function makeRequest(eventId?: string, isLiveServer = true): NextRequest {
  const url = eventId
    ? `http://localhost/api/internal/live-config?eventId=${eventId}`
    : "http://localhost/api/internal/live-config";

  const headers: Record<string, string> = {};
  if (isLiveServer) {
    headers["x-live-server"] = "true";
    headers["x-live-secret"] = LIVE_SECRET;
  }

  return new NextRequest(url, { headers });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

describe("GET /api/internal/live-config", () => {
  it("returns 403 when not from Live Server", async () => {
    const res = await GET(makeRequest("event-1", false));
    expect(res.status).toBe(403);
  });

  it("returns 400 when eventId is missing", async () => {
    const res = await GET(makeRequest(undefined, true));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Missing eventId parameter" });
  });

  it("returns 404 when event not found", async () => {
    (prisma.event.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeRequest("event-1"));
    expect(res.status).toBe(404);
  });

  it("returns 400 when LiveRace not enabled", async () => {
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      hasLiveRace: false,
    });

    const res = await GET(makeRequest("event-1"));
    expect(res.status).toBe(400);
  });

  it("returns full config with variant configs and settings", async () => {
    const startDate = new Date("2025-06-01T08:00:00Z");
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      title: "Trail Test",
      slug: "trail-test",
      startDate,
      endDate: new Date("2025-06-01T18:00:00Z"),
      hasLiveRace: true,
      liveStatus: "SCHEDULED",
      city: "Pombal",
      country: "PT",
      variants: [
        {
          id: "v1",
          name: "Trail 20km",
          distanceKm: 20,
          elevationGainM: 500,
          elevationLossM: 480,
          startDate: null,
          startTime: "09:00",
          cutoffTimeHours: 6,
          route: {
            id: "r1",
            variantId: "v1",
            routePoints: [[38.5, -8.9]],
            distanceKm: 21,
            elevationGainM: 520,
            elevationLossM: 500,
            checkpoints: [
              {
                id: "cp1",
                name: "Start",
                type: "START",
                order: 0,
                latitude: 38.5,
                longitude: -8.9,
                radiusM: 50,
                cutoffMin: null,
              },
            ],
          },
        },
      ],
    });

    const res = await GET(makeRequest("event-1"));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.eventId).toBe("event-1");
    expect(json.title).toBe("Trail Test");
    expect(json.settings).toBeDefined();
    expect(json.settings.deviationThresholdM).toBe(150);
    expect(json.variants).toHaveLength(1);
    expect(json.variants[0].variantId).toBe("v1");
    expect(json.variants[0].distanceKm).toBe(21); // route overrides variant
    expect(json.variants[0].checkpoints).toHaveLength(1);
  });

  it("filters out variants without routes", async () => {
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      title: "Test",
      slug: "test",
      startDate: new Date(),
      endDate: null,
      hasLiveRace: true,
      liveStatus: "SCHEDULED",
      city: "Test",
      country: "PT",
      variants: [
        {
          id: "v1",
          name: "With Route",
          distanceKm: 10,
          elevationGainM: null,
          elevationLossM: null,
          startDate: null,
          startTime: null,
          cutoffTimeHours: null,
          route: {
            id: "r1",
            variantId: "v1",
            routePoints: [[38.5, -8.9]],
            distanceKm: null,
            elevationGainM: null,
            elevationLossM: null,
            checkpoints: [],
          },
        },
        {
          id: "v2",
          name: "No Route",
          distanceKm: 5,
          elevationGainM: null,
          elevationLossM: null,
          startDate: null,
          startTime: null,
          cutoffTimeHours: null,
          route: null,
        },
      ],
    });

    const res = await GET(makeRequest("event-1"));
    const json = await res.json();

    expect(json.variants).toHaveLength(1);
    expect(json.variants[0].variantId).toBe("v1");
  });

  it("returns 500 on internal error", async () => {
    (prisma.event.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await GET(makeRequest("event-1"));
    expect(res.status).toBe(500);
  });
});
