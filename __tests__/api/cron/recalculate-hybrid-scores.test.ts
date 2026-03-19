/**
 * @jest-environment node
 */

import { GET } from "@/app/api/cron/recalculate-hybrid-scores/route";
import { prisma } from "@/lib/prisma";
import { computeAndPersistHybridScore } from "@/lib/scoring/score-service";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => ({
  prisma: {
    workoutLog: { findMany: jest.fn() },
  },
}));

jest.mock("@/lib/scoring/score-service", () => ({
  computeAndPersistHybridScore: jest.fn(),
}));

const mockFindMany = prisma.workoutLog.findMany as jest.Mock;
const mockComputeHybrid = computeAndPersistHybridScore as jest.Mock;

const CRON_SECRET = "test-cron-secret";

beforeEach(() => {
  jest.clearAllMocks();
  process.env.CRON_SECRET = CRON_SECRET;
});

afterEach(() => {
  delete process.env.CRON_SECRET;
});

const makeRequest = (token?: string) =>
  new Request("http://localhost/api/cron/recalculate-hybrid-scores", {
    method: "GET",
    headers: token ? { authorization: token } : {},
  });

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("GET /api/cron/recalculate-hybrid-scores", () => {
  it("returns 401 when CRON_SECRET is not configured", async () => {
    delete process.env.CRON_SECRET;

    const res = await GET(makeRequest(`Bearer ${CRON_SECRET}`));

    expect(res.status).toBe(401);
  });

  it("returns 401 when authorization header is missing", async () => {
    const res = await GET(makeRequest());

    expect(res.status).toBe(401);
  });

  it("returns 401 when authorization header is invalid", async () => {
    const res = await GET(makeRequest("Bearer wrong-secret"));

    expect(res.status).toBe(401);
  });

  it("processes active users and returns summary", async () => {
    mockFindMany.mockResolvedValue([
      { userId: "u1" },
      { userId: "u2" },
      { userId: "u3" },
    ]);
    mockComputeHybrid.mockResolvedValue({});

    const res = await GET(makeRequest(`Bearer ${CRON_SECRET}`));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({
      message: "Hybrid score recalculation complete",
      usersProcessed: 3,
      updated: 3,
      failed: 0,
    });
    expect(mockComputeHybrid).toHaveBeenCalledTimes(3);
    expect(mockComputeHybrid).toHaveBeenCalledWith("u1");
    expect(mockComputeHybrid).toHaveBeenCalledWith("u2");
    expect(mockComputeHybrid).toHaveBeenCalledWith("u3");
  });

  it("returns zero counts when no active users exist", async () => {
    mockFindMany.mockResolvedValue([]);

    const res = await GET(makeRequest(`Bearer ${CRON_SECRET}`));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.usersProcessed).toBe(0);
    expect(body.updated).toBe(0);
    expect(body.failed).toBe(0);
  });

  it("counts failures without aborting the entire batch", async () => {
    mockFindMany.mockResolvedValue([
      { userId: "u1" },
      { userId: "u2" },
      { userId: "u3" },
    ]);
    mockComputeHybrid
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(new Error("score engine error"))
      .mockResolvedValueOnce({});

    const res = await GET(makeRequest(`Bearer ${CRON_SECRET}`));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.updated).toBe(2);
    expect(body.failed).toBe(1);
    expect(body.usersProcessed).toBe(3);
  });

  it("queries only users active in the last 90 days", async () => {
    mockFindMany.mockResolvedValue([]);

    await GET(makeRequest(`Bearer ${CRON_SECRET}`));

    expect(mockFindMany).toHaveBeenCalledWith({
      where: {
        performedAt: { gte: expect.any(Date) },
      },
      select: { userId: true },
      distinct: ["userId"],
    });
  });

  it("returns 500 on unexpected error", async () => {
    mockFindMany.mockRejectedValue(new Error("DB down"));

    const res = await GET(makeRequest(`Bearer ${CRON_SECRET}`));

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Internal server error");
  });
});
