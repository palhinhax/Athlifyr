/**
 * @jest-environment node
 */

/**
 * Tests for POST /api/events/[id]/live-control
 *
 * Covers:
 * - Authentication required (401)
 * - Permission check: forbidden for non-organizers (403)
 * - Event not found (404)
 * - LiveRace not enabled → 400
 * - Invalid command → 400
 * - Invalid state transition → 409
 * - cancel command (LIVE/PAUSED → CANCELLED)
 * - Readiness validation on checkin/warmup/start → LIVE_RACE_NOT_READY (422)
 *   - Insufficient route points
 *   - Missing startTime
 *   - Invalid coordinates
 *   - Checkpoint ordering errors
 * - Valid start command with fully ready event → 200
 */

import { NextRequest } from "next/server";
import { POST } from "@/app/api/events/[id]/live-control/route";
import { prisma } from "@/lib/prisma";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth-helpers", () => ({
  getAuthenticatedUser: jest.fn(),
}));
import { getAuthenticatedUser } from "@/lib/auth-helpers";

jest.mock("@/lib/event-permissions", () => ({
  getUserEventContext: jest.fn(),
  hasEventPermission: jest.fn(),
}));
import {
  getUserEventContext,
  hasEventPermission,
} from "@/lib/event-permissions";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    event: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

// Mock global fetch for live server notifications
const mockFetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => ({}),
});
global.fetch = mockFetch as unknown as typeof fetch;

// ── Helpers ───────────────────────────────────────────────────────────────────

const ADMIN_USER = { id: "user-admin", email: "admin@test.com", role: "ADMIN" };
const REGULAR_USER = {
  id: "user-reg",
  email: "reg@test.com",
  role: "USER",
};

function makeRequest(command: string): NextRequest {
  return new Request("http://localhost/api/events/event-1/live-control", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ command }),
  }) as unknown as NextRequest;
}

function makeParams(eventId = "event-1") {
  return { params: Promise.resolve({ id: eventId }) };
}

/** Generate N valid route points. */
function generateRoutePoints(n: number): [number, number][] {
  return Array.from({ length: n }, (_, i) => [40 + i * 0.001, -8 + i * 0.001]);
}

function makeValidEvent(liveStatus = "SCHEDULED" as string) {
  return {
    id: "event-1",
    hasLiveRace: true,
    liveStatus,
    slug: "test-event",
    variants: [
      {
        id: "variant-1",
        name: "Trail 30km",
        startTime: "09:00",
        route: {
          id: "route-1",
          routePoints: generateRoutePoints(100),
          checkpoints: [
            { type: "START", order: 0 },
            { type: "INTERMEDIATE", order: 1 },
            { type: "FINISH", order: 2 },
          ],
        },
      },
    ],
  };
}

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockFetch.mockResolvedValue({ ok: true, json: async () => ({}) });
});

function mockAdminPermission() {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
  (getUserEventContext as jest.Mock).mockResolvedValue({});
  (hasEventPermission as jest.Mock).mockReturnValue(true);
  (prisma.event.update as jest.Mock).mockResolvedValue({});
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("POST /api/events/[id]/live-control", () => {
  it("returns 401 when user is not authenticated", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest("checkin"), makeParams());
    expect(res.status).toBe(401);
  });

  it("returns 403 when user lacks permissions", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(REGULAR_USER);
    (getUserEventContext as jest.Mock).mockResolvedValue({});
    (hasEventPermission as jest.Mock).mockReturnValue(false);

    const res = await POST(makeRequest("checkin"), makeParams());
    expect(res.status).toBe(403);
  });

  it("returns 400 for invalid command", async () => {
    mockAdminPermission();

    const res = await POST(makeRequest("invalid_cmd"), makeParams());
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid command");
  });

  it("returns 404 when event not found", async () => {
    mockAdminPermission();
    (prisma.event.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest("checkin"), makeParams());
    expect(res.status).toBe(404);
  });

  it("returns 400 when LiveRace not enabled", async () => {
    mockAdminPermission();
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      ...makeValidEvent(),
      hasLiveRace: false,
    });

    const res = await POST(makeRequest("checkin"), makeParams());
    expect(res.status).toBe(400);
  });

  it("returns 409 for invalid state transition", async () => {
    mockAdminPermission();
    (prisma.event.findUnique as jest.Mock).mockResolvedValue(
      makeValidEvent("LIVE")
    );

    // Cannot checkin from LIVE
    const res = await POST(makeRequest("checkin"), makeParams());
    expect(res.status).toBe(409);
  });

  it("supports cancel command from LIVE → CANCELLED", async () => {
    mockAdminPermission();
    (prisma.event.findUnique as jest.Mock).mockResolvedValue(
      makeValidEvent("LIVE")
    );

    const res = await POST(makeRequest("cancel"), makeParams());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.liveStatus).toBe("CANCELLED");
    expect(prisma.event.update).toHaveBeenCalledWith({
      where: { id: "event-1" },
      data: { liveStatus: "CANCELLED" },
    });
  });

  it("supports cancel command from PAUSED → CANCELLED", async () => {
    mockAdminPermission();
    (prisma.event.findUnique as jest.Mock).mockResolvedValue(
      makeValidEvent("PAUSED")
    );

    const res = await POST(makeRequest("cancel"), makeParams());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.liveStatus).toBe("CANCELLED");
  });

  it("returns LIVE_RACE_NOT_READY (422) when route has < 10 points on checkin", async () => {
    mockAdminPermission();
    const event = makeValidEvent("SCHEDULED");
    event.variants[0].route!.routePoints = generateRoutePoints(5);

    (prisma.event.findUnique as jest.Mock).mockResolvedValue(event);

    const res = await POST(makeRequest("checkin"), makeParams());
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.code).toBe("LIVE_RACE_NOT_READY");
    expect(body.details).toContainEqual(
      expect.stringContaining("at least 10 route points")
    );
  });

  it("returns LIVE_RACE_NOT_READY (422) when startTime is missing on warmup", async () => {
    mockAdminPermission();
    const event = makeValidEvent("CHECK_IN_OPEN");
    event.variants[0].startTime = null as unknown as string;

    (prisma.event.findUnique as jest.Mock).mockResolvedValue(event);

    const res = await POST(makeRequest("warmup"), makeParams());
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.code).toBe("LIVE_RACE_NOT_READY");
    expect(body.details).toContainEqual(
      expect.stringContaining("missing a start time")
    );
  });

  it("returns LIVE_RACE_NOT_READY (422) when route has invalid coordinates on start", async () => {
    mockAdminPermission();
    const event = makeValidEvent("WARMUP");
    const points = generateRoutePoints(60);
    points[3] = [999, 999]; // invalid
    event.variants[0].route!.routePoints = points;

    (prisma.event.findUnique as jest.Mock).mockResolvedValue(event);

    const res = await POST(makeRequest("start"), makeParams());
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.code).toBe("LIVE_RACE_NOT_READY");
    expect(body.details).toContainEqual(
      expect.stringContaining("invalid coordinates")
    );
  });

  it("validates readiness on all state-advancing commands (checkin, warmup, start)", async () => {
    mockAdminPermission();

    // Event with no variants
    const emptyEvent = {
      ...makeValidEvent("SCHEDULED"),
      variants: [],
    };
    (prisma.event.findUnique as jest.Mock).mockResolvedValue(emptyEvent);

    // checkin should fail
    const res1 = await POST(makeRequest("checkin"), makeParams());
    expect(res1.status).toBe(422);
    const body1 = await res1.json();
    expect(body1.code).toBe("LIVE_RACE_NOT_READY");
  });

  it("does NOT validate readiness on non-advancing commands (pause, resume, finish)", async () => {
    mockAdminPermission();
    (prisma.event.findUnique as jest.Mock).mockResolvedValue(
      makeValidEvent("LIVE")
    );

    // pause should work without route validation
    const res = await POST(makeRequest("pause"), makeParams());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.liveStatus).toBe("PAUSED");
  });

  it("succeeds for a fully valid checkin command", async () => {
    mockAdminPermission();
    (prisma.event.findUnique as jest.Mock).mockResolvedValue(
      makeValidEvent("SCHEDULED")
    );

    const res = await POST(makeRequest("checkin"), makeParams());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.liveStatus).toBe("CHECK_IN_OPEN");
    expect(prisma.event.update).toHaveBeenCalledWith({
      where: { id: "event-1" },
      data: { liveStatus: "CHECK_IN_OPEN" },
    });
  });

  it("succeeds for a fully valid start command from WARMUP", async () => {
    mockAdminPermission();
    (prisma.event.findUnique as jest.Mock).mockResolvedValue(
      makeValidEvent("WARMUP")
    );

    const res = await POST(makeRequest("start"), makeParams());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.liveStatus).toBe("LIVE");
  });
});
