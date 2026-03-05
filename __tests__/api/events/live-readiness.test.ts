/**
 * @jest-environment node
 */

/**
 * Tests for GET /api/events/[id]/live-readiness
 *
 * Covers:
 * - Authentication required (401)
 * - Permission check: forbidden for non-organizers (403)
 * - Event not found (404)
 * - LiveRace not enabled → error LIVERACE_NOT_ENABLED
 * - No variants → error NO_VARIANTS
 * - Insufficient route points (< 10) → error INSUFFICIENT_ROUTE_POINTS
 * - Invalid coordinates → error INVALID_COORDINATES
 * - Missing startTime → error NO_START_TIME (not just a warning)
 * - Auto-derive start/finish from route endpoints
 * - Duplicate checkpoint orders → error CHECKPOINT_DUPLICATE_ORDER
 * - Finish checkpoint not last → error CHECKPOINT_FINISH_NOT_LAST
 * - Fully valid event → ready: true
 */

import { NextRequest } from "next/server";
import { GET } from "@/app/api/events/[id]/live-readiness/route";
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
    event: { findUnique: jest.fn() },
  },
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const ADMIN_USER = { id: "user-admin", email: "admin@test.com", role: "ADMIN" };
const REGULAR_USER = {
  id: "user-reg",
  email: "reg@test.com",
  role: "USER",
};

function makeRequest(): NextRequest {
  return new Request("http://localhost/api/events/event-1/live-readiness", {
    method: "GET",
  }) as unknown as NextRequest;
}

function makeParams(eventId = "event-1") {
  return { params: Promise.resolve({ id: eventId }) };
}

/** Generate N valid route points along a line. */
function generateRoutePoints(n: number): [number, number][] {
  return Array.from({ length: n }, (_, i) => [40 + i * 0.001, -8 + i * 0.001]);
}

/** A fully valid variant with START + FINISH checkpoints. */
function makeValidVariant(name = "Trail 30km") {
  return {
    id: `variant-${name}`,
    name,
    startTime: "09:00",
    route: {
      id: "route-1",
      routePoints: generateRoutePoints(100),
      checkpoints: [
        {
          id: "cp-start",
          type: "START",
          name: "Start",
          order: 0,
          latitude: 40.0,
          longitude: -8.0,
        },
        {
          id: "cp-mid",
          type: "INTERMEDIATE",
          name: "Midpoint",
          order: 1,
          latitude: 40.05,
          longitude: -7.95,
        },
        {
          id: "cp-finish",
          type: "FINISH",
          name: "Finish",
          order: 2,
          latitude: 40.099,
          longitude: -7.901,
        },
      ],
    },
  };
}

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

function mockAdminPermission() {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
  (getUserEventContext as jest.Mock).mockResolvedValue({});
  (hasEventPermission as jest.Mock).mockReturnValue(true);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("GET /api/events/[id]/live-readiness", () => {
  it("returns 401 when user is not authenticated", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeRequest(), makeParams());
    expect(res.status).toBe(401);
  });

  it("returns 403 when user lacks permissions", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(REGULAR_USER);
    (getUserEventContext as jest.Mock).mockResolvedValue({});
    (hasEventPermission as jest.Mock).mockReturnValue(false);

    const res = await GET(makeRequest(), makeParams());
    expect(res.status).toBe(403);
  });

  it("returns 404 when event not found", async () => {
    mockAdminPermission();
    (prisma.event.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeRequest(), makeParams());
    expect(res.status).toBe(404);
  });

  it("returns LIVERACE_NOT_ENABLED error when hasLiveRace is false", async () => {
    mockAdminPermission();
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      hasLiveRace: false,
      variants: [makeValidVariant()],
    });

    const res = await GET(makeRequest(), makeParams());
    const body = await res.json();
    expect(body.ready).toBe(false);
    expect(body.errors).toContain("LIVERACE_NOT_ENABLED");
  });

  it("returns NO_VARIANTS error when event has no variants", async () => {
    mockAdminPermission();
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      hasLiveRace: true,
      variants: [],
    });

    const res = await GET(makeRequest(), makeParams());
    const body = await res.json();
    expect(body.ready).toBe(false);
    expect(body.errors).toContain("NO_VARIANTS");
  });

  it("returns INSUFFICIENT_ROUTE_POINTS when route has fewer than 10 points", async () => {
    mockAdminPermission();
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      hasLiveRace: true,
      variants: [
        {
          id: "variant-1",
          name: "Short Trail",
          startTime: "09:00",
          route: {
            id: "route-1",
            routePoints: generateRoutePoints(5), // only 5 points
            checkpoints: [
              {
                id: "cp-1",
                type: "START",
                name: "Start",
                order: 0,
                latitude: 40.0,
                longitude: -8.0,
              },
              {
                id: "cp-2",
                type: "FINISH",
                name: "Finish",
                order: 1,
                latitude: 40.01,
                longitude: -7.99,
              },
            ],
          },
        },
      ],
    });

    const res = await GET(makeRequest(), makeParams());
    const body = await res.json();
    expect(body.ready).toBe(false);
    expect(body.errors).toContainEqual(
      expect.stringContaining("INSUFFICIENT_ROUTE_POINTS")
    );
  });

  it("returns INVALID_COORDINATES when route has out-of-bounds coordinates", async () => {
    mockAdminPermission();
    const points = generateRoutePoints(60);
    points[5] = [999, 999]; // invalid

    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      hasLiveRace: true,
      variants: [
        {
          id: "variant-1",
          name: "Bad Coords Trail",
          startTime: "09:00",
          route: {
            id: "route-1",
            routePoints: points,
            checkpoints: [
              {
                id: "cp-1",
                type: "START",
                name: "Start",
                order: 0,
                latitude: 40.0,
                longitude: -8.0,
              },
              {
                id: "cp-2",
                type: "FINISH",
                name: "Finish",
                order: 1,
                latitude: 40.06,
                longitude: -7.94,
              },
            ],
          },
        },
      ],
    });

    const res = await GET(makeRequest(), makeParams());
    const body = await res.json();
    expect(body.ready).toBe(false);
    expect(body.errors).toContainEqual(
      expect.stringContaining("INVALID_COORDINATES")
    );
  });

  it("returns NO_START_TIME as error (not warning) when startTime is missing", async () => {
    mockAdminPermission();
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      hasLiveRace: true,
      variants: [
        {
          ...makeValidVariant(),
          startTime: null, // missing
        },
      ],
    });

    const res = await GET(makeRequest(), makeParams());
    const body = await res.json();
    expect(body.ready).toBe(false);
    expect(body.errors).toContainEqual(
      expect.stringContaining("NO_START_TIME")
    );
    // Should NOT be in warnings
    expect(body.warnings).not.toContainEqual(
      expect.stringContaining("NO_START_TIME")
    );
  });

  it("auto-derives start/finish from route endpoints when no explicit checkpoints", async () => {
    mockAdminPermission();
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      hasLiveRace: true,
      variants: [
        {
          id: "variant-1",
          name: "Auto Trail",
          startTime: "09:00",
          route: {
            id: "route-1",
            routePoints: generateRoutePoints(100),
            checkpoints: [], // no explicit checkpoints
          },
        },
      ],
    });

    const res = await GET(makeRequest(), makeParams());
    const body = await res.json();
    // Should be ready (start/finish auto-derived from route)
    expect(body.ready).toBe(true);
    expect(body.variants[0].hasStartCheckpoint).toBe(true);
    expect(body.variants[0].hasFinishCheckpoint).toBe(true);
  });

  it("returns CHECKPOINT_DUPLICATE_ORDER when checkpoints have duplicate orders", async () => {
    mockAdminPermission();
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      hasLiveRace: true,
      variants: [
        {
          id: "variant-1",
          name: "Dup Orders Trail",
          startTime: "09:00",
          route: {
            id: "route-1",
            routePoints: generateRoutePoints(100),
            checkpoints: [
              {
                id: "cp-1",
                type: "START",
                name: "Start",
                order: 0,
                latitude: 40.0,
                longitude: -8.0,
              },
              {
                id: "cp-2",
                type: "INTERMEDIATE",
                name: "Mid A",
                order: 1,
                latitude: 40.02,
                longitude: -7.98,
              },
              {
                id: "cp-3",
                type: "INTERMEDIATE",
                name: "Mid B",
                order: 1, // DUPLICATE
                latitude: 40.04,
                longitude: -7.96,
              },
              {
                id: "cp-4",
                type: "FINISH",
                name: "Finish",
                order: 2,
                latitude: 40.099,
                longitude: -7.901,
              },
            ],
          },
        },
      ],
    });

    const res = await GET(makeRequest(), makeParams());
    const body = await res.json();
    expect(body.ready).toBe(false);
    expect(body.errors).toContainEqual(
      expect.stringContaining("CHECKPOINT_DUPLICATE_ORDER")
    );
  });

  it("returns CHECKPOINT_FINISH_NOT_LAST when FINISH is not the highest order", async () => {
    mockAdminPermission();
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      hasLiveRace: true,
      variants: [
        {
          id: "variant-1",
          name: "Bad Finish Trail",
          startTime: "09:00",
          route: {
            id: "route-1",
            routePoints: generateRoutePoints(100),
            checkpoints: [
              {
                id: "cp-1",
                type: "START",
                name: "Start",
                order: 0,
                latitude: 40.0,
                longitude: -8.0,
              },
              {
                id: "cp-2",
                type: "FINISH",
                name: "Finish",
                order: 1,
                latitude: 40.05,
                longitude: -7.95,
              },
              {
                id: "cp-3",
                type: "INTERMEDIATE",
                name: "After Finish",
                order: 2,
                latitude: 40.099,
                longitude: -7.901,
              },
            ],
          },
        },
      ],
    });

    const res = await GET(makeRequest(), makeParams());
    const body = await res.json();
    expect(body.ready).toBe(false);
    expect(body.errors).toContainEqual(
      expect.stringContaining("CHECKPOINT_FINISH_NOT_LAST")
    );
  });

  it("returns ready: true for a fully valid event", async () => {
    mockAdminPermission();
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      hasLiveRace: true,
      variants: [makeValidVariant()],
    });

    const res = await GET(makeRequest(), makeParams());
    const body = await res.json();
    expect(body.ready).toBe(true);
    expect(body.errors).toEqual([]);
    expect(body.variants).toHaveLength(1);
    expect(body.variants[0].hasRoute).toBe(true);
    expect(body.variants[0].hasStartCheckpoint).toBe(true);
    expect(body.variants[0].hasFinishCheckpoint).toBe(true);
    expect(body.variants[0].hasStartTime).toBe(true);
    expect(body.variants[0].hasValidCoordinates).toBe(true);
  });
});
