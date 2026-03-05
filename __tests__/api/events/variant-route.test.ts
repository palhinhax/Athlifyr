/**
 * @jest-environment node
 */

/**
 * Tests for GET/PUT/DELETE /api/events/[id]/variants/[variantId]/route
 *
 * Covers:
 * - GET: returns route or null
 * - GET: internal error (500)
 * - PUT: authentication required (401)
 * - PUT: event not found (404)
 * - PUT: forbidden for non-organizers (403)
 * - PUT: variant not found (404)
 * - PUT: upsert with GPX data
 * - PUT: upsert with manual route points
 * - PUT: upsert with checkpoints replacement
 * - DELETE: authentication required (401)
 * - DELETE: event not found (404)
 * - DELETE: forbidden for non-admins (403)
 * - DELETE: successful deletion
 */

import {
  GET,
  PUT,
  DELETE,
} from "@/app/api/events/[id]/variants/[variantId]/route/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth-helpers", () => ({
  getAuthenticatedUser: jest.fn(),
}));
import { getAuthenticatedUser } from "@/lib/auth-helpers";

jest.mock("@/lib/gpx-parser", () => ({
  parseGpx: jest.fn(),
}));
import { parseGpx } from "@/lib/gpx-parser";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    event: { findUnique: jest.fn() },
    eventVariant: { findFirst: jest.fn() },
    eventRoute: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    routeCheckpoint: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
  },
}));
import { prisma } from "@/lib/prisma";

// ── Helpers ───────────────────────────────────────────────────────────────────

const ADMIN_USER = { id: "user-admin", email: "admin@test.com", role: "ADMIN" };
const ORGANIZER_USER = { id: "user-org", email: "org@test.com", role: "USER" };
const REGULAR_USER = { id: "user-reg", email: "reg@test.com", role: "USER" };

function makeGetRequest(): Request {
  return new Request(
    "http://localhost/api/events/event-1/variants/variant-1/route"
  );
}

function makePutRequest(body: Record<string, unknown>): Request {
  return new Request(
    "http://localhost/api/events/event-1/variants/variant-1/route",
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
}

function makeDeleteRequest(): Request {
  return new Request(
    "http://localhost/api/events/event-1/variants/variant-1/route",
    { method: "DELETE" }
  );
}

function makeParams(id = "event-1", variantId = "variant-1") {
  return { params: Promise.resolve({ id, variantId }) };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

// ── GET ───────────────────────────────────────────────────────────────────────

describe("GET /api/events/[id]/variants/[variantId]/route", () => {
  it("returns route when found", async () => {
    const mockRoute = {
      id: "route-1",
      variantId: "variant-1",
      routePoints: [[38.5, -8.9]],
      checkpoints: [{ id: "cp1", name: "Start", order: 0 }],
    };
    (prisma.eventRoute.findUnique as jest.Mock).mockResolvedValue(mockRoute);

    const res = await GET(makeGetRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.route).toEqual(mockRoute);
  });

  it("returns null route when not found", async () => {
    (prisma.eventRoute.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeGetRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.route).toBeNull();
  });

  it("returns 500 on internal error", async () => {
    (prisma.eventRoute.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await GET(makeGetRequest(), makeParams());
    expect(res.status).toBe(500);
  });
});

// ── PUT ───────────────────────────────────────────────────────────────────────

describe("PUT /api/events/[id]/variants/[variantId]/route", () => {
  it("returns 401 when not authenticated", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);

    const res = await PUT(makePutRequest({ routePoints: [] }), makeParams());
    expect(res.status).toBe(401);
  });

  it("returns 404 when event not found", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ORGANIZER_USER);
    (prisma.event.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await PUT(makePutRequest({ routePoints: [] }), makeParams());
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Event not found" });
  });

  it("returns 403 when user is not organizer or admin", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(REGULAR_USER);
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      organizers: [{ userId: "other-user" }],
    });

    const res = await PUT(makePutRequest({ routePoints: [] }), makeParams());
    expect(res.status).toBe(403);
  });

  it("returns 404 when variant not found", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ORGANIZER_USER);
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      organizers: [{ userId: ORGANIZER_USER.id }],
    });
    (prisma.eventVariant.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await PUT(makePutRequest({ routePoints: [] }), makeParams());
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Variant not found" });
  });

  it("upserts route with GPX data", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ORGANIZER_USER);
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      organizers: [{ userId: ORGANIZER_USER.id }],
    });
    (prisma.eventVariant.findFirst as jest.Mock).mockResolvedValue({
      id: "variant-1",
      eventId: "event-1",
    });
    (parseGpx as jest.Mock).mockReturnValue({
      routePoints: [[38.5, -8.9]],
      distanceKm: 20,
      elevationGainM: 500,
      elevationLossM: 480,
    });
    (prisma.eventRoute.upsert as jest.Mock).mockResolvedValue({
      id: "route-1",
    });
    (prisma.eventRoute.findUnique as jest.Mock).mockResolvedValue({
      id: "route-1",
      routePoints: [[38.5, -8.9]],
      checkpoints: [],
    });

    const res = await PUT(
      makePutRequest({ gpxData: "<gpx>...</gpx>" }),
      makeParams()
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.route).toBeDefined();
    expect(parseGpx).toHaveBeenCalledWith("<gpx>...</gpx>");
  });

  it("upserts route with manual route points", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      organizers: [],
    });
    (prisma.eventVariant.findFirst as jest.Mock).mockResolvedValue({
      id: "variant-1",
      eventId: "event-1",
    });
    (prisma.eventRoute.upsert as jest.Mock).mockResolvedValue({
      id: "route-1",
    });
    (prisma.eventRoute.findUnique as jest.Mock).mockResolvedValue({
      id: "route-1",
      routePoints: [[38.5, -8.9]],
      checkpoints: [],
    });

    const res = await PUT(
      makePutRequest({
        routePoints: [[38.5, -8.9]],
        distanceKm: 10,
      }),
      makeParams()
    );

    expect(res.status).toBe(200);
    expect(parseGpx).not.toHaveBeenCalled();
  });

  it("replaces checkpoints when provided", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ORGANIZER_USER);
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
      organizers: [{ userId: ORGANIZER_USER.id }],
    });
    (prisma.eventVariant.findFirst as jest.Mock).mockResolvedValue({
      id: "variant-1",
      eventId: "event-1",
    });
    (prisma.eventRoute.upsert as jest.Mock).mockResolvedValue({
      id: "route-1",
    });
    (prisma.routeCheckpoint.deleteMany as jest.Mock).mockResolvedValue({});
    (prisma.routeCheckpoint.createMany as jest.Mock).mockResolvedValue({
      count: 1,
    });
    (prisma.eventRoute.findUnique as jest.Mock).mockResolvedValue({
      id: "route-1",
      checkpoints: [{ id: "cp1", name: "Start" }],
    });

    const res = await PUT(
      makePutRequest({
        routePoints: [[38.5, -8.9]],
        checkpoints: [
          {
            name: "Start",
            type: "START",
            order: 0,
            latitude: 38.5,
            longitude: -8.9,
          },
        ],
      }),
      makeParams()
    );

    expect(res.status).toBe(200);
    expect(prisma.routeCheckpoint.deleteMany).toHaveBeenCalled();
    expect(prisma.routeCheckpoint.createMany).toHaveBeenCalled();
  });

  it("returns 500 on internal error", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await PUT(makePutRequest({ routePoints: [] }), makeParams());
    expect(res.status).toBe(500);
  });
});

// ── DELETE ─────────────────────────────────────────────────────────────────────

describe("DELETE /api/events/[id]/variants/[variantId]/route", () => {
  it("returns 401 when not authenticated", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);

    const res = await DELETE(makeDeleteRequest(), makeParams());
    expect(res.status).toBe(401);
  });

  it("returns 404 when event not found", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await DELETE(makeDeleteRequest(), makeParams());
    expect(res.status).toBe(404);
  });

  it("returns 403 for non-admin users", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(REGULAR_USER);
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
    });

    const res = await DELETE(makeDeleteRequest(), makeParams());
    expect(res.status).toBe(403);
  });

  it("deletes route successfully for admin", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock).mockResolvedValue({
      id: "event-1",
    });
    (prisma.eventRoute.delete as jest.Mock).mockResolvedValue({});

    const res = await DELETE(makeDeleteRequest(), makeParams());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
  });

  it("returns 500 on internal error", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(ADMIN_USER);
    (prisma.event.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await DELETE(makeDeleteRequest(), makeParams());
    expect(res.status).toBe(500);
  });
});
