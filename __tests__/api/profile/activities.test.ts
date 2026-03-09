/**
 * @jest-environment node
 */

/**
 * Tests for POST/GET /api/profile/activities
 *
 * Covers:
 * - POST: authentication required (401)
 * - POST: validation fails (400)
 * - POST: successful creation (201)
 * - POST: internal server error (500)
 * - GET: authentication required (401)
 * - GET: successful list with pagination
 * - GET: empty list
 * - GET: cursor-based pagination
 * - GET: internal server error (500)
 */

import { NextRequest } from "next/server";
import { POST, GET } from "@/app/api/profile/activities/route";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth-helpers", () => ({
  getAuthenticatedUser: jest.fn(),
}));
import { getAuthenticatedUser } from "@/lib/auth-helpers";

jest.mock("@/lib/performance/scoring", () => ({
  computeRunScores: jest.fn(),
}));
import { computeRunScores } from "@/lib/performance/scoring";

jest.mock("@/lib/prisma", () => {
  const txMock = {
    runActivity: { create: jest.fn() },
    userPerformanceEntry: { findMany: jest.fn(), create: jest.fn() },
  };
  return {
    prisma: {
      $transaction: jest.fn((cb: (tx: typeof txMock) => Promise<unknown>) =>
        cb(txMock)
      ),
      runActivity: { findMany: jest.fn() },
      _tx: txMock,
    },
  };
});
import { prisma } from "@/lib/prisma";

// ── Helpers ───────────────────────────────────────────────────────────────────

const AUTH_USER = { id: "user-1", email: "user@test.com", role: "USER" };

const VALID_TRACK = [
  { lat: 38.5, lng: -8.9, timestamp: 1000 },
  { lat: 38.501, lng: -8.901, timestamp: 2000 },
  { lat: 38.502, lng: -8.902, timestamp: 3000 },
];

const VALID_BODY = {
  startedAt: 1700000000000,
  finishedAt: 1700003600000,
  durationMs: 3600000,
  distanceM: 10000,
  avgPaceMinKm: 6.0,
  maxSpeedKmh: 12.5,
  elevationGainM: 200,
  elevationLossM: 180,
  track: VALID_TRACK,
};

function makePostRequest(body: unknown): NextRequest {
  return new Request("http://localhost/api/profile/activities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

function makeGetRequest(params?: Record<string, string>): NextRequest {
  const url = new URL("http://localhost/api/profile/activities");
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  return new Request(url.toString(), {
    method: "GET",
  }) as unknown as NextRequest;
}

// Access the internal transaction mock
const prismaInternal = prisma as unknown as Record<string, unknown>;
const txMock = prismaInternal._tx as {
  runActivity: { create: jest.MockedFunction<() => Promise<unknown>> };
  userPerformanceEntry: {
    findMany: jest.MockedFunction<() => Promise<unknown>>;
    create: jest.MockedFunction<() => Promise<unknown>>;
  };
};

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST /api/profile/activities", () => {
  it("returns 401 when not authenticated", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);

    const res = await POST(makePostRequest(VALID_BODY));
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized");
  });

  it("returns 400 for invalid body", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);

    const res = await POST(makePostRequest({ distanceM: -1 }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Validation failed");
    expect(json.details).toBeDefined();
  });

  it("returns 400 when track has fewer than 3 points", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);

    const res = await POST(
      makePostRequest({
        ...VALID_BODY,
        track: [
          { lat: 38.5, lng: -8.9, timestamp: 1000 },
          { lat: 38.6, lng: -8.8, timestamp: 2000 },
        ],
      })
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Validation failed");
  });

  it("returns 201 on successful creation", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);
    (computeRunScores as jest.Mock).mockReturnValue({
      qualityScore: 0.85,
      predictionWeight: 0.7,
    });

    txMock.runActivity.create.mockResolvedValue({
      id: "activity-1",
      userId: "user-1",
    });
    txMock.userPerformanceEntry.findMany.mockResolvedValue([]);
    txMock.userPerformanceEntry.create.mockResolvedValue({
      id: "perf-1",
      userId: "user-1",
    });

    const res = await POST(makePostRequest(VALID_BODY));
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.activityId).toBe("activity-1");
    expect(json.performanceEntryId).toBe("perf-1");
    expect(txMock.runActivity.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "user-1",
        distanceM: 10000,
        durationMs: 3600000,
      }),
    });
    expect(computeRunScores).toHaveBeenCalled();
  });

  it("returns 201 with nullable avgPaceMinKm", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);
    (computeRunScores as jest.Mock).mockReturnValue({
      qualityScore: 0.9,
      predictionWeight: 0.5,
    });

    txMock.runActivity.create.mockResolvedValue({
      id: "activity-2",
      userId: "user-1",
    });
    txMock.userPerformanceEntry.findMany.mockResolvedValue([]);
    txMock.userPerformanceEntry.create.mockResolvedValue({
      id: "perf-2",
      userId: "user-1",
    });

    const res = await POST(
      makePostRequest({ ...VALID_BODY, avgPaceMinKm: null })
    );
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.activityId).toBe("activity-2");
  });

  it("passes historical entries to computeRunScores", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);
    (computeRunScores as jest.Mock).mockReturnValue({
      qualityScore: 0.8,
      predictionWeight: 0.6,
    });

    const historyEntries = [
      {
        distanceKm: 5,
        timeSeconds: 1500,
        performedAt: new Date("2026-02-01"),
      },
      {
        distanceKm: 10,
        timeSeconds: 3200,
        performedAt: new Date("2026-02-15"),
      },
    ];

    txMock.runActivity.create.mockResolvedValue({
      id: "activity-3",
      userId: "user-1",
    });
    txMock.userPerformanceEntry.findMany.mockResolvedValue(historyEntries);
    txMock.userPerformanceEntry.create.mockResolvedValue({
      id: "perf-3",
      userId: "user-1",
    });

    await POST(makePostRequest(VALID_BODY));

    expect(computeRunScores).toHaveBeenCalledWith(
      expect.objectContaining({
        distanceKm: 10,
        timeSeconds: 3600,
        elevationGainM: 200,
      }),
      expect.arrayContaining([
        expect.objectContaining({ distanceKm: 5, timeSeconds: 1500 }),
        expect.objectContaining({ distanceKm: 10, timeSeconds: 3200 }),
      ])
    );
  });

  it("returns 500 on internal error", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);
    (prisma.$transaction as jest.Mock).mockRejectedValue(
      new Error("DB failure")
    );

    const res = await POST(makePostRequest(VALID_BODY));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Internal server error");
  });
});

describe("GET /api/profile/activities", () => {
  it("returns 401 when not authenticated", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeGetRequest());
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized");
  });

  it("returns activities list", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);
    const activities = [
      {
        id: "a1",
        startedAt: new Date(),
        finishedAt: new Date(),
        durationMs: 3600000,
        distanceM: 10000,
        avgPaceMinKm: 6.0,
        maxSpeedKmh: 12.0,
        elevationGainM: 200,
        elevationLossM: 180,
        createdAt: new Date(),
      },
    ];
    (prisma.runActivity.findMany as jest.Mock).mockResolvedValue(activities);

    const res = await GET(makeGetRequest());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.items).toHaveLength(1);
    expect(json.hasMore).toBe(false);
    expect(json.nextCursor).toBeNull();
  });

  it("returns empty list", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);
    (prisma.runActivity.findMany as jest.Mock).mockResolvedValue([]);

    const res = await GET(makeGetRequest());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.items).toHaveLength(0);
    expect(json.hasMore).toBe(false);
  });

  it("supports cursor-based pagination", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);

    // Return limit + 1 items to indicate hasMore
    const items = Array.from({ length: 6 }, (_, i) => ({
      id: `a${i}`,
      startedAt: new Date(),
      finishedAt: new Date(),
      durationMs: 3600000,
      distanceM: 10000,
      avgPaceMinKm: 6.0,
      maxSpeedKmh: 12.0,
      elevationGainM: 200,
      elevationLossM: 180,
      createdAt: new Date(),
    }));
    (prisma.runActivity.findMany as jest.Mock).mockResolvedValue(items);

    const res = await GET(makeGetRequest({ limit: "5" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.items).toHaveLength(5);
    expect(json.hasMore).toBe(true);
    expect(json.nextCursor).toBe("a4");
  });

  it("passes cursor to prisma query", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);
    (prisma.runActivity.findMany as jest.Mock).mockResolvedValue([]);

    await GET(makeGetRequest({ cursor: "cursor-abc", limit: "10" }));

    expect(prisma.runActivity.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        cursor: { id: "cursor-abc" },
        skip: 1,
      })
    );
  });

  it("caps limit at 50", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);
    (prisma.runActivity.findMany as jest.Mock).mockResolvedValue([]);

    await GET(makeGetRequest({ limit: "100" }));

    expect(prisma.runActivity.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 51, // 50 + 1
      })
    );
  });

  it("returns 500 on internal error", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(AUTH_USER);
    (prisma.runActivity.findMany as jest.Mock).mockRejectedValue(
      new Error("DB failure")
    );

    const res = await GET(makeGetRequest());
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Internal server error");
  });
});
