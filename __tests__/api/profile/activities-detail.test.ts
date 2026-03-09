/**
 * @jest-environment node
 */

/**
 * Tests for GET/DELETE /api/profile/activities/[id]
 *
 * Covers:
 * - GET: authentication required (401)
 * - GET: activity not found (404)
 * - GET: forbidden - not owner (403)
 * - GET: returns activity with full track
 * - GET: internal server error (500)
 * - DELETE: authentication required (401)
 * - DELETE: activity not found (404)
 * - DELETE: forbidden - not owner (403)
 * - DELETE: successful deletion
 * - DELETE: internal server error (500)
 */

import { NextRequest } from "next/server";
import { GET, DELETE } from "@/app/api/profile/activities/[id]/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth-helpers", () => ({
  getAuthenticatedUser: jest.fn(),
}));
import { getAuthenticatedUser } from "@/lib/auth-helpers";

jest.mock("@/lib/prisma", () => {
  const txMock = {
    userPerformanceEntry: { updateMany: jest.fn() },
    runActivity: { delete: jest.fn() },
  };
  return {
    prisma: {
      runActivity: { findUnique: jest.fn() },
      $transaction: jest.fn((cb: (tx: typeof txMock) => Promise<unknown>) =>
        cb(txMock)
      ),
      _tx: txMock,
    },
  };
});
import { prisma } from "@/lib/prisma";

// ── Helpers ───────────────────────────────────────────────────────────────────

const AUTH_USER = { id: "user-1", email: "user@test.com", role: "USER" };
const OTHER_USER = { id: "user-2", email: "other@test.com", role: "USER" };

const ACTIVITY = {
  id: "activity-1",
  userId: "user-1",
  startedAt: new Date("2026-03-01T08:00:00Z"),
  finishedAt: new Date("2026-03-01T09:00:00Z"),
  durationMs: 3600000,
  distanceM: 10000,
  avgPaceMinKm: 6.0,
  maxSpeedKmh: 12.5,
  elevationGainM: 200,
  elevationLossM: 180,
  track: [
    { lat: 38.5, lng: -8.9, timestamp: 1000 },
    { lat: 38.6, lng: -8.8, timestamp: 2000 },
  ],
  performanceEntry: { id: "perf-1" },
};

function makeRequest(method: string, id = "activity-1"): NextRequest {
  return new Request(`http://localhost/api/profile/activities/${id}`, {
    method,
  }) as unknown as NextRequest;
}

function makeParams(id = "activity-1") {
  return Promise.resolve({ id });
}

// Access internal tx mock
const txMock = (prisma as unknown as { _tx: Record<string, unknown> })
  ._tx as unknown as {
  userPerformanceEntry: {
    updateMany: jest.MockedFunction<() => Promise<unknown>>;
  };
  runActivity: { delete: jest.MockedFunction<() => Promise<unknown>> };
};

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /api/profile/activities/[id]", () => {
  it("returns 401 when not authenticated", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeRequest("GET"), { params: makeParams() });
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized");
  });

  it("returns 404 when activity not found", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);
    (prisma.runActivity.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeRequest("GET"), { params: makeParams() });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Activity not found");
  });

  it("returns 403 when user does not own the activity", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(OTHER_USER);
    (prisma.runActivity.findUnique as jest.Mock).mockResolvedValue(ACTIVITY);

    const res = await GET(makeRequest("GET"), { params: makeParams() });
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.error).toBe("Forbidden");
  });

  it("returns activity with full data", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);
    (prisma.runActivity.findUnique as jest.Mock).mockResolvedValue(ACTIVITY);

    const res = await GET(makeRequest("GET"), { params: makeParams() });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.id).toBe("activity-1");
    expect(json.distanceM).toBe(10000);
    expect(json.track).toHaveLength(2);
    expect(json.performanceEntry).toEqual({ id: "perf-1" });
  });

  it("returns 500 on internal error", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);
    (prisma.runActivity.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB failure")
    );

    const res = await GET(makeRequest("GET"), { params: makeParams() });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Internal server error");
  });
});

describe("DELETE /api/profile/activities/[id]", () => {
  it("returns 401 when not authenticated", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);

    const res = await DELETE(makeRequest("DELETE"), { params: makeParams() });
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized");
  });

  it("returns 404 when activity not found", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);
    (prisma.runActivity.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await DELETE(makeRequest("DELETE"), { params: makeParams() });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Activity not found");
  });

  it("returns 403 when user does not own the activity", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(OTHER_USER);
    (prisma.runActivity.findUnique as jest.Mock).mockResolvedValue({
      userId: "user-1",
    });

    const res = await DELETE(makeRequest("DELETE"), { params: makeParams() });
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.error).toBe("Forbidden");
  });

  it("deletes activity and unlinks performance entry", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);
    (prisma.runActivity.findUnique as jest.Mock).mockResolvedValue({
      userId: "user-1",
    });
    txMock.userPerformanceEntry.updateMany.mockResolvedValue({ count: 1 });
    txMock.runActivity.delete.mockResolvedValue({});

    const res = await DELETE(makeRequest("DELETE"), { params: makeParams() });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(txMock.userPerformanceEntry.updateMany).toHaveBeenCalledWith({
      where: { runActivityId: "activity-1" },
      data: { runActivityId: null },
    });
    expect(txMock.runActivity.delete).toHaveBeenCalledWith({
      where: { id: "activity-1" },
    });
  });

  it("returns 500 on internal error", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);
    (prisma.runActivity.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB failure")
    );

    const res = await DELETE(makeRequest("DELETE"), { params: makeParams() });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Internal server error");
  });
});
