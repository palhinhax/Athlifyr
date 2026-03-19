/**
 * @jest-environment node
 */

import { GET } from "@/app/api/workouts/logs/[id]/score/route";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { computeAndPersistWorkoutScore } from "@/lib/scoring/score-service";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth-utils", () => ({
  getAuthUser: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    workoutLog: { findUnique: jest.fn() },
    workoutScore: { findUnique: jest.fn() },
  },
}));

jest.mock("@/lib/scoring/score-service", () => ({
  computeAndPersistWorkoutScore: jest.fn(),
}));

const mockGetAuthUser = getAuthUser as jest.Mock;
const mockLogFindUnique = prisma.workoutLog.findUnique as jest.Mock;
const mockScoreFindUnique = prisma.workoutScore.findUnique as jest.Mock;
const mockComputeScore = computeAndPersistWorkoutScore as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

const makeRequest = () =>
  new Request("http://localhost/api/workouts/logs/log1/score", {
    method: "GET",
  });

const makeParams = (id = "log1") =>
  Promise.resolve({ id }) as Promise<{ id: string }>;

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("GET /api/workouts/logs/[id]/score", () => {
  it("returns 401 when unauthenticated", async () => {
    mockGetAuthUser.mockResolvedValue(null);

    const res = await GET(makeRequest(), { params: makeParams() });

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 404 when log not found or not owned by user", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockLogFindUnique.mockResolvedValue(null);

    const res = await GET(makeRequest(), { params: makeParams() });

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe("Workout log not found");
    expect(mockLogFindUnique).toHaveBeenCalledWith({
      where: { id: "log1", userId: "u1" },
      select: { id: true, userId: true },
    });
  });

  it("returns existing cached score without recomputing", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockLogFindUnique.mockResolvedValue({ id: "log1", userId: "u1" });
    const calculatedAt = new Date("2024-06-01T12:00:00Z");
    mockScoreFindUnique.mockResolvedValue({
      totalScore: 85,
      strengthScore: 30,
      enduranceScore: 25,
      engineScore: 20,
      volumeBonus: 5,
      prBonus: 5,
      highlights: ["Great workout"],
      scoreVersion: "1.0",
      calculatedAt,
    });

    const res = await GET(makeRequest(), { params: makeParams() });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.totalScore).toBe(85);
    expect(body.breakdown).toEqual({
      strength: 30,
      endurance: 25,
      engine: 20,
      volumeBonus: 5,
      prBonus: 5,
    });
    expect(body.highlights).toEqual(["Great workout"]);
    expect(body.scoreVersion).toBe("1.0");
    expect(body.calculatedAt).toBe(calculatedAt.toISOString());
    expect(mockComputeScore).not.toHaveBeenCalled();
  });

  it("computes score when not yet calculated", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockLogFindUnique.mockResolvedValue({ id: "log1", userId: "u1" });
    mockScoreFindUnique.mockResolvedValue(null);
    mockComputeScore.mockResolvedValue({
      totalScore: 72.8,
      breakdown: {
        strength: 28.2,
        endurance: 22.1,
        engine: 15.5,
        volumeBonus: 4.3,
        prBonus: 2.7,
      },
      highlights: ["First workout"],
      version: "1.0",
      calculatedAt: "2024-06-01T12:00:00.000Z",
    });

    const res = await GET(makeRequest(), { params: makeParams() });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.totalScore).toBe(73);
    expect(body.breakdown).toEqual({
      strength: 28,
      endurance: 22,
      engine: 16,
      volumeBonus: 4,
      prBonus: 3,
    });
    expect(body.highlights).toEqual(["First workout"]);
    expect(mockComputeScore).toHaveBeenCalledWith("log1", "u1");
  });

  it("returns 500 when computeAndPersistWorkoutScore returns null", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockLogFindUnique.mockResolvedValue({ id: "log1", userId: "u1" });
    mockScoreFindUnique.mockResolvedValue(null);
    mockComputeScore.mockResolvedValue(null);

    const res = await GET(makeRequest(), { params: makeParams() });

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Failed to compute score");
  });

  it("returns 500 on unexpected error", async () => {
    mockGetAuthUser.mockRejectedValue(new Error("DB crash"));

    const res = await GET(makeRequest(), { params: makeParams() });

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Internal server error");
  });
});
