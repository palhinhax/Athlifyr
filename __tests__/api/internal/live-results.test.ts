/**
 * @jest-environment node
 */

/**
 * Tests for POST /api/internal/live-results
 *
 * Covers:
 * - Forbidden when not from Live Server (403)
 * - Missing eventId or results (400)
 * - Event not found or LiveRace not enabled (404)
 * - Persists results and updates event status to FINISHED
 * - Formats finish time as HH:MM:SS
 * - Handles DNF/DSQ notes
 * - Internal server error (500)
 */

import { NextRequest } from "next/server";
import { POST } from "@/app/api/internal/live-results/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => ({
  prisma: {
    event: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    result: { upsert: jest.fn() },
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
  return new Request("http://localhost/api/internal/live-results", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

describe("POST /api/internal/live-results", () => {
  it("returns 403 when not from Live Server", async () => {
    const res = await POST(
      makeRequest({ eventId: "e1", results: [{}] }, false)
    );
    expect(res.status).toBe(403);
  });

  it("returns 400 when eventId is missing", async () => {
    const res = await POST(makeRequest({ eventId: "", results: [] }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when results are empty", async () => {
    const res = await POST(makeRequest({ eventId: "e1", results: [] }));
    expect(res.status).toBe(400);
  });

  it("returns 404 when event not found", async () => {
    (prisma.event.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await POST(
      makeRequest({
        eventId: "e1",
        results: [
          {
            userId: "u1",
            variantId: "v1",
            rank: 1,
            finishTimeMs: 3600000,
            status: "FINISHED",
          },
        ],
      })
    );
    expect(res.status).toBe(404);
  });

  it("returns 404 when LiveRace not enabled", async () => {
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "e1",
      hasLiveRace: false,
    });

    const res = await POST(
      makeRequest({
        eventId: "e1",
        results: [
          {
            userId: "u1",
            variantId: "v1",
            rank: 1,
            finishTimeMs: 3600000,
            status: "FINISHED",
          },
        ],
      })
    );
    expect(res.status).toBe(404);
  });

  it("persists results and updates event to FINISHED", async () => {
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "e1",
      hasLiveRace: true,
    });
    (prisma.result.upsert as jest.Mock).mockResolvedValue({});
    (prisma.event.update as jest.Mock).mockResolvedValue({});

    const res = await POST(
      makeRequest({
        eventId: "e1",
        results: [
          {
            userId: "u1",
            variantId: "v1",
            rank: 1,
            finishTimeMs: 3661000, // 1h 1m 1s
            status: "FINISHED",
          },
        ],
      })
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.persisted).toBe(1);

    // Verify time formatting
    expect(prisma.result.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          time: "01:01:01",
          timeSeconds: 3661,
          notes: null,
        }),
      })
    );

    // Verify event status updated
    expect(prisma.event.update).toHaveBeenCalledWith({
      where: { id: "e1" },
      data: { liveStatus: "FINISHED" },
    });
  });

  it("handles DNF results", async () => {
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "e1",
      hasLiveRace: true,
    });
    (prisma.result.upsert as jest.Mock).mockResolvedValue({});
    (prisma.event.update as jest.Mock).mockResolvedValue({});

    await POST(
      makeRequest({
        eventId: "e1",
        results: [
          {
            userId: "u1",
            variantId: "v1",
            rank: 99,
            finishTimeMs: 7200000,
            status: "DNF",
          },
        ],
      })
    );

    expect(prisma.result.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ notes: "DNF" }),
      })
    );
  });

  it("handles DSQ results", async () => {
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "e1",
      hasLiveRace: true,
    });
    (prisma.result.upsert as jest.Mock).mockResolvedValue({});
    (prisma.event.update as jest.Mock).mockResolvedValue({});

    await POST(
      makeRequest({
        eventId: "e1",
        results: [
          {
            userId: "u1",
            variantId: "v1",
            rank: 99,
            finishTimeMs: 0,
            status: "DSQ",
          },
        ],
      })
    );

    expect(prisma.result.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ notes: "DSQ" }),
      })
    );
  });

  it("returns 500 on internal error", async () => {
    (prisma.event.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await POST(
      makeRequest({
        eventId: "e1",
        results: [
          {
            userId: "u1",
            variantId: "v1",
            rank: 1,
            finishTimeMs: 3600000,
            status: "FINISHED",
          },
        ],
      })
    );
    expect(res.status).toBe(500);
  });
});
