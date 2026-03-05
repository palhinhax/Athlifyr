/**
 * @jest-environment node
 */

/**
 * Tests for POST /api/internal/live-status
 *
 * Covers:
 * - Forbidden when not from Live Server (403)
 * - Missing eventId or status (400)
 * - Event not found or LiveRace not enabled (404)
 * - Invalid state transition (400)
 * - Successful status update
 * - Internal server error (500)
 */

import { NextRequest } from "next/server";
import { POST } from "@/app/api/internal/live-status/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => ({
  prisma: {
    event: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
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
  return new Request("http://localhost/api/internal/live-status", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

describe("POST /api/internal/live-status", () => {
  it("returns 403 when not from Live Server", async () => {
    const res = await POST(
      makeRequest({ eventId: "e1", status: "WARMUP" }, false)
    );
    expect(res.status).toBe(403);
  });

  it("returns 400 when eventId is missing", async () => {
    const res = await POST(makeRequest({ eventId: "", status: "WARMUP" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when status is missing", async () => {
    const res = await POST(makeRequest({ eventId: "e1", status: "" }));
    expect(res.status).toBe(400);
  });

  it("returns 404 when event not found", async () => {
    (prisma.event.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest({ eventId: "e1", status: "WARMUP" }));
    expect(res.status).toBe(404);
  });

  it("returns 404 when LiveRace not enabled", async () => {
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "e1",
      hasLiveRace: false,
      liveStatus: "SCHEDULED",
    });

    const res = await POST(makeRequest({ eventId: "e1", status: "WARMUP" }));
    expect(res.status).toBe(404);
  });

  it("returns 400 for invalid state transition", async () => {
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "e1",
      hasLiveRace: true,
      liveStatus: "FINISHED",
    });

    const res = await POST(makeRequest({ eventId: "e1", status: "LIVE" }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain("Invalid transition");
    expect(json.currentStatus).toBe("FINISHED");
    expect(json.allowedTransitions).toEqual([]);
  });

  it("updates status successfully for valid transition SCHEDULED → WARMUP", async () => {
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "e1",
      hasLiveRace: true,
      liveStatus: "SCHEDULED",
    });
    (prisma.event.update as jest.Mock).mockResolvedValue({
      id: "e1",
      liveStatus: "WARMUP",
    });

    const res = await POST(makeRequest({ eventId: "e1", status: "WARMUP" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.previousStatus).toBe("SCHEDULED");
    expect(json.currentStatus).toBe("WARMUP");
  });

  it("updates status for LIVE → FINISHED transition", async () => {
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "e1",
      hasLiveRace: true,
      liveStatus: "LIVE",
    });
    (prisma.event.update as jest.Mock).mockResolvedValue({
      id: "e1",
      liveStatus: "FINISHED",
    });

    const res = await POST(makeRequest({ eventId: "e1", status: "FINISHED" }));
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(json.previousStatus).toBe("LIVE");
    expect(json.currentStatus).toBe("FINISHED");
  });

  it("updates status for WARMUP → LIVE transition", async () => {
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "e1",
      hasLiveRace: true,
      liveStatus: "WARMUP",
    });
    (prisma.event.update as jest.Mock).mockResolvedValue({
      id: "e1",
      liveStatus: "LIVE",
    });

    const res = await POST(makeRequest({ eventId: "e1", status: "LIVE" }));
    const json = await res.json();

    expect(json.success).toBe(true);
  });

  it("returns 500 on internal error", async () => {
    (prisma.event.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await POST(makeRequest({ eventId: "e1", status: "WARMUP" }));
    expect(res.status).toBe(500);
  });
});
