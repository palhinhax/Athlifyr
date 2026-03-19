/**
 * @jest-environment node
 */

import { GET } from "@/app/api/profile/hybrid-score/route";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { computeAndPersistHybridScore } from "@/lib/scoring/score-service";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth-utils", () => ({
  getAuthUser: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    userHybridScore: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("@/lib/scoring/score-service", () => ({
  computeAndPersistHybridScore: jest.fn(),
}));

const mockGetAuthUser = getAuthUser as jest.Mock;
const mockFindUnique = prisma.userHybridScore.findUnique as jest.Mock;
const mockComputeHybrid = computeAndPersistHybridScore as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

const makeRequest = () =>
  new Request("http://localhost/api/profile/hybrid-score", { method: "GET" });

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("GET /api/profile/hybrid-score", () => {
  it("returns 401 when unauthenticated", async () => {
    mockGetAuthUser.mockResolvedValue(null);

    const res = await GET(makeRequest());

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("returns cached score when it is fresh (< 24h old)", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    const recentDate = new Date(Date.now() - 1000 * 60 * 60); // 1h ago
    mockFindUnique.mockResolvedValue({
      totalScore: 75,
      strengthScore: 30,
      enduranceScore: 25,
      engineScore: 20,
      confidence: 0.8,
      scoreVersion: "1.0",
      calculatedAt: recentDate,
    });

    const res = await GET(makeRequest());

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.totalScore).toBe(75);
    expect(body.breakdown).toEqual({
      strength: 30,
      endurance: 25,
      engine: 20,
    });
    expect(body.confidence).toBe(0.8);
    expect(body.scoreVersion).toBe("1.0");
    expect(body.calculatedAt).toBe(recentDate.toISOString());
    expect(mockComputeHybrid).not.toHaveBeenCalled();
  });

  it("recalculates when cached score is stale (> 24h old)", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    const staleDate = new Date(Date.now() - 25 * 60 * 60 * 1000); // 25h ago
    mockFindUnique.mockResolvedValue({
      totalScore: 60,
      strengthScore: 20,
      enduranceScore: 20,
      engineScore: 20,
      confidence: 0.7,
      scoreVersion: "1.0",
      calculatedAt: staleDate,
    });
    mockComputeHybrid.mockResolvedValue({
      totalScore: 80.6,
      breakdown: { strength: 33.2, endurance: 27.1, engine: 20.3 },
      confidence: 0.85,
      version: "1.1",
      calculatedAt: new Date().toISOString(),
    });

    const res = await GET(makeRequest());

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.totalScore).toBe(81);
    expect(body.breakdown).toEqual({ strength: 33, endurance: 27, engine: 20 });
    expect(body.confidence).toBe(0.85);
    expect(mockComputeHybrid).toHaveBeenCalledWith("u1");
  });

  it("calculates from scratch when no existing score", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockFindUnique.mockResolvedValue(null);
    mockComputeHybrid.mockResolvedValue({
      totalScore: 50.4,
      breakdown: { strength: 20.1, endurance: 15.9, engine: 14.4 },
      confidence: 0.5,
      version: "1.0",
      calculatedAt: "2024-01-01T00:00:00.000Z",
    });

    const res = await GET(makeRequest());

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.totalScore).toBe(50);
    expect(body.breakdown).toEqual({ strength: 20, endurance: 16, engine: 14 });
    expect(mockComputeHybrid).toHaveBeenCalledWith("u1");
  });

  it("returns 500 when an unexpected error occurs", async () => {
    mockGetAuthUser.mockRejectedValue(new Error("DB down"));

    const res = await GET(makeRequest());

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Internal server error");
  });
});
