/**
 * @jest-environment node
 */

/**
 * Tests for GET /api/events/[id]/live-time
 *
 * Covers:
 * - Event not found (404)
 * - Returns server time + event start date + variant start times
 * - Variant with startDate + startTime
 * - Variant without startDate (falls back to event startDate)
 */

import { NextRequest } from "next/server";
import { GET } from "@/app/api/events/[id]/live-time/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => ({
  prisma: {
    event: { findUnique: jest.fn() },
  },
}));
import { prisma } from "@/lib/prisma";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeRequest(): NextRequest {
  return new Request(
    "http://localhost/api/events/event-1/live-time"
  ) as unknown as NextRequest;
}

function makeParams(id = "event-1") {
  return { params: Promise.resolve({ id }) };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

describe("GET /api/events/[id]/live-time", () => {
  it("returns 404 when event not found", async () => {
    (prisma.event.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeRequest(), makeParams());
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Event not found" });
  });

  it("returns server time and variant start times with startDate + startTime", async () => {
    const eventStartDate = new Date("2025-06-01T08:00:00Z");
    const variantStartDate = new Date("2025-06-01T00:00:00Z");

    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      liveStatus: "SCHEDULED",
      startDate: eventStartDate,
      variants: [
        {
          id: "v1",
          name: "Trail 20km",
          startDate: variantStartDate,
          startTime: "09:30",
        },
      ],
    });

    const res = await GET(makeRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.serverTime).toBeDefined();
    expect(json.liveStatus).toBe("SCHEDULED");
    expect(json.eventStartDate).toBe(eventStartDate.toISOString());
    // startDate 2025-06-01 + startTime 09:30 → UTC hours set
    expect(json.variantStartTimes.v1).toBeDefined();
    expect(json.variantStartTimes.v1).toContain("2025-06-01");
  });

  it("falls back to event startDate when variant has no startDate", async () => {
    const eventStartDate = new Date("2025-06-01T08:00:00Z");

    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      liveStatus: "LIVE",
      startDate: eventStartDate,
      variants: [
        {
          id: "v1",
          name: "Trail 10km",
          startDate: null,
          startTime: null,
        },
      ],
    });

    const res = await GET(makeRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.variantStartTimes.v1).toBe(eventStartDate.toISOString());
  });

  it("handles variant with startDate but no startTime", async () => {
    const variantStartDate = new Date("2025-06-01T00:00:00Z");

    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      liveStatus: "WARMUP",
      startDate: new Date("2025-06-01T08:00:00Z"),
      variants: [
        {
          id: "v1",
          name: "Sprint",
          startDate: variantStartDate,
          startTime: null,
        },
      ],
    });

    const res = await GET(makeRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.variantStartTimes.v1).toBe(variantStartDate.toISOString());
  });

  it("returns empty variantStartTimes when no variants", async () => {
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      liveStatus: "SCHEDULED",
      startDate: new Date("2025-06-01T08:00:00Z"),
      variants: [],
    });

    const res = await GET(makeRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.variantStartTimes).toEqual({});
  });
});
