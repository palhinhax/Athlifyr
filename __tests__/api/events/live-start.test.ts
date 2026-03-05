/**
 * @jest-environment node
 */

/**
 * Tests for POST /api/events/[id]/live-start
 *
 * Covers:
 * - Event not found (404)
 * - LiveRace not enabled (400)
 * - Race already finished/cancelled
 * - Race already active (LIVE/WARMUP)
 * - Too early to activate
 * - Successful trigger to Live Service
 * - Live Service returns error (502)
 * - Live Service unreachable (503)
 * - Internal server error (500)
 */

import { NextRequest } from "next/server";
import { POST } from "@/app/api/events/[id]/live-start/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => ({
  prisma: {
    event: { findUnique: jest.fn() },
  },
}));
import { prisma } from "@/lib/prisma";

const mockFetch = jest.fn();
globalThis.fetch = mockFetch as unknown as typeof fetch;

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeRequest(): NextRequest {
  return new Request("http://localhost/api/events/event-1/live-start", {
    method: "POST",
  }) as unknown as NextRequest;
}

function makeParams(id = "event-1") {
  return { params: Promise.resolve({ id }) };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

describe("POST /api/events/[id]/live-start", () => {
  it("returns 404 when event not found", async () => {
    (prisma.event.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest(), makeParams());
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Event not found" });
  });

  it("returns 400 when LiveRace not enabled", async () => {
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      hasLiveRace: false,
      liveStatus: "SCHEDULED",
      startDate: new Date(),
    });

    const res = await POST(makeRequest(), makeParams());
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "LiveRace not enabled" });
  });

  it("returns current status when race already FINISHED", async () => {
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      hasLiveRace: true,
      liveStatus: "FINISHED",
      startDate: new Date(),
    });

    const res = await POST(makeRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe("FINISHED");
    expect(json.message).toBe("Race already ended");
  });

  it("returns current status when race already CANCELLED", async () => {
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      hasLiveRace: true,
      liveStatus: "CANCELLED",
      startDate: new Date(),
    });

    const res = await POST(makeRequest(), makeParams());
    const json = await res.json();

    expect(json.status).toBe("CANCELLED");
    expect(json.message).toBe("Race already ended");
  });

  it("returns current status when race already LIVE", async () => {
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      hasLiveRace: true,
      liveStatus: "LIVE",
      startDate: new Date(),
    });

    const res = await POST(makeRequest(), makeParams());
    const json = await res.json();

    expect(json.status).toBe("LIVE");
    expect(json.message).toBe("Already active");
  });

  it("returns current status when race already WARMUP", async () => {
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      hasLiveRace: true,
      liveStatus: "WARMUP",
      startDate: new Date(),
    });

    const res = await POST(makeRequest(), makeParams());
    const json = await res.json();

    expect(json.status).toBe("WARMUP");
    expect(json.message).toBe("Already active");
  });

  it("returns 'too early' when more than 60 minutes before start", async () => {
    const futureDate = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      hasLiveRace: true,
      liveStatus: "SCHEDULED",
      startDate: futureDate,
    });

    const res = await POST(makeRequest(), makeParams());
    const json = await res.json();

    expect(json.status).toBe("SCHEDULED");
    expect(json.message).toBe("Too early to activate live race");
    expect(json.activatesAt).toBeDefined();
  });

  it("triggers Live Service successfully within 60-minute window", async () => {
    const soonDate = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      hasLiveRace: true,
      liveStatus: "SCHEDULED",
      startDate: soonDate,
    });
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ status: "WARMUP", message: "Room created" }),
    });

    const res = await POST(makeRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe("WARMUP");
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/live/start"),
      expect.objectContaining({ method: "POST" })
    );
  });

  it("returns 502 when Live Service returns error", async () => {
    const soonDate = new Date(Date.now() + 30 * 60 * 1000);
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      hasLiveRace: true,
      liveStatus: "SCHEDULED",
      startDate: soonDate,
    });
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Room limit exceeded" }),
    });

    const res = await POST(makeRequest(), makeParams());
    expect(res.status).toBe(502);
    const json = await res.json();
    expect(json.error).toBe("Failed to activate live race");
  });

  it("returns 503 when Live Service is unreachable", async () => {
    const soonDate = new Date(Date.now() + 30 * 60 * 1000);
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      hasLiveRace: true,
      liveStatus: "SCHEDULED",
      startDate: soonDate,
    });
    mockFetch.mockRejectedValue(new Error("ECONNREFUSED"));

    const res = await POST(makeRequest(), makeParams());
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "Live Service unavailable" });
  });

  it("returns 500 on internal error", async () => {
    (prisma.event.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await POST(makeRequest(), makeParams());
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Internal server error" });
  });
});
