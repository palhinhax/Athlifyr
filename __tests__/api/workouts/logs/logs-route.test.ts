/**
 * @jest-environment node
 */

import { GET, POST } from "@/app/api/workouts/logs/route";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { computeStrengthScores } from "@/lib/performance/scoring";
import { computeAndPersistWorkoutScore } from "@/lib/scoring/score-service";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth-utils", () => ({
  getAuthUser: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    workoutLog: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
    workout: { findUnique: jest.fn() },
    venueSession: { findUnique: jest.fn() },
    userPerformanceEntry: {
      findMany: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
    workoutExerciseSet: { update: jest.fn() },
    workoutExerciseResult: { update: jest.fn() },
  },
}));

jest.mock("@/lib/performance/scoring", () => ({
  computeStrengthScores: jest.fn(),
}));

jest.mock("@/lib/scoring/score-service", () => ({
  computeAndPersistWorkoutScore: jest.fn(),
}));

const mockGetAuthUser = getAuthUser as jest.Mock;
const mockLogFindMany = prisma.workoutLog.findMany as jest.Mock;
const mockLogFindFirst = prisma.workoutLog.findFirst as jest.Mock;
const mockLogCreate = prisma.workoutLog.create as jest.Mock;
const mockLogDelete = prisma.workoutLog.delete as jest.Mock;
const mockWorkoutFindUnique = prisma.workout.findUnique as jest.Mock;
const mockSessionFindUnique = prisma.venueSession.findUnique as jest.Mock;
const mockPerfFindMany = prisma.userPerformanceEntry.findMany as jest.Mock;
const mockPerfCreate = prisma.userPerformanceEntry.create as jest.Mock;
const mockPerfDeleteMany = prisma.userPerformanceEntry.deleteMany as jest.Mock;
const mockSetUpdate = prisma.workoutExerciseSet.update as jest.Mock;
const mockExResultUpdate = prisma.workoutExerciseResult.update as jest.Mock;
const mockComputeStrength = computeStrengthScores as jest.Mock;
const mockComputeScore = computeAndPersistWorkoutScore as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockComputeStrength.mockReturnValue({
    qualityScore: 80,
    predictionWeight: 0.5,
  });
  mockPerfCreate.mockResolvedValue({ id: "perf1" });
});

// ── Request helpers ───────────────────────────────────────────────────────────

const makeGetRequest = (params?: string) =>
  new Request(
    `http://localhost/api/workouts/logs${params ? `?${params}` : ""}`,
    { method: "GET" }
  );

const makePostRequest = (body: object) =>
  new Request("http://localhost/api/workouts/logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

const validBlockResult = {
  blockId: "b1",
  completedRounds: 3,
  exerciseResults: [
    {
      blockExerciseId: "be1",
      exerciseId: "ex1",
      actualReps: 10,
      actualWeight: 80,
      actualWeightUnit: "KG",
    },
  ],
};

const validPostBody = {
  workoutId: "w1",
  performedAt: "2024-06-01T10:00:00.000Z",
  notes: "Good session",
  feeling: 4,
  perceivedEffort: 7,
  blockResults: [validBlockResult],
};

// ── GET ───────────────────────────────────────────────────────────────────────

describe("GET /api/workouts/logs", () => {
  it("returns 401 when unauthenticated", async () => {
    mockGetAuthUser.mockResolvedValue(null);

    const res = await GET(makeGetRequest());

    expect(res.status).toBe(401);
  });

  it("returns paginated logs", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    const logs = Array.from({ length: 5 }, (_, i) => ({
      id: `log${i}`,
      performedAt: new Date(),
    }));
    mockLogFindMany.mockResolvedValue(logs);

    const res = await GET(makeGetRequest());

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.items).toHaveLength(5);
    expect(body.hasMore).toBe(false);
    expect(body.nextCursor).toBeNull();
  });

  it("returns hasMore=true when more items exist", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    // Return limit+1 items (default limit=20, so 21)
    const logs = Array.from({ length: 21 }, (_, i) => ({
      id: `log${i}`,
      performedAt: new Date(),
    }));
    mockLogFindMany.mockResolvedValue(logs);

    const res = await GET(makeGetRequest());

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.items).toHaveLength(20);
    expect(body.hasMore).toBe(true);
    expect(body.nextCursor).toBe("log19");
  });

  it("filters by workoutId", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockLogFindMany.mockResolvedValue([]);

    await GET(makeGetRequest("workoutId=w1"));

    expect(mockLogFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "u1", workoutId: "w1" },
      })
    );
  });

  it("supports cursor-based pagination", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockLogFindMany.mockResolvedValue([]);

    await GET(makeGetRequest("cursor=abc123"));

    expect(mockLogFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        cursor: { id: "abc123" },
        skip: 1,
      })
    );
  });

  it("limits to max 50 items", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockLogFindMany.mockResolvedValue([]);

    await GET(makeGetRequest("limit=100"));

    expect(mockLogFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 51, // 50 + 1 for hasMore check
      })
    );
  });

  it("returns 500 on unexpected error", async () => {
    mockGetAuthUser.mockRejectedValue(new Error("DB error"));

    const res = await GET(makeGetRequest());

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Internal server error");
  });
});

// ── POST ──────────────────────────────────────────────────────────────────────

describe("POST /api/workouts/logs", () => {
  const createdLog = {
    id: "newlog1",
    userId: "u1",
    workoutId: "w1",
    performedAt: new Date("2024-06-01T10:00:00.000Z"),
    workout: { id: "w1", name: "WOD" },
    blockResults: [
      {
        exerciseResults: [
          {
            id: "er1",
            exerciseId: "ex1",
            exercise: { id: "ex1", name: "Back Squat", hasWeight: true },
            actualWeight: 80,
            actualWeightUnit: "KG",
            actualReps: 10,
            sets: [],
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    mockWorkoutFindUnique.mockResolvedValue({ id: "w1" });
    mockLogCreate.mockResolvedValue(createdLog);
    mockPerfFindMany.mockResolvedValue([]);
    mockComputeScore.mockResolvedValue({ totalScore: 70 });
  });

  it("returns 401 when unauthenticated", async () => {
    mockGetAuthUser.mockResolvedValue(null);

    const res = await POST(makePostRequest(validPostBody));

    expect(res.status).toBe(401);
  });

  it("returns 400 on validation failure (missing workoutId)", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });

    const res = await POST(
      makePostRequest({ blockResults: [validBlockResult] })
    );

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Validation failed");
    expect(body.details).toBeDefined();
  });

  it("returns 400 on invalid data (missing required fields in exerciseResult)", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });

    const res = await POST(
      makePostRequest({
        workoutId: "w1",
        blockResults: [
          {
            blockId: "b1",
            exerciseResults: [{ blockExerciseId: "" }],
          },
        ],
      })
    );

    expect(res.status).toBe(400);
  });

  it("returns 404 when workout not found", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockWorkoutFindUnique.mockResolvedValue(null);

    const res = await POST(makePostRequest(validPostBody));

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe("Workout not found");
  });

  it("returns 404 when sessionId is provided but session not found", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockSessionFindUnique.mockResolvedValue(null);

    const res = await POST(
      makePostRequest({ ...validPostBody, sessionId: "s-invalid" })
    );

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe("Session not found");
  });

  it("creates log successfully and returns 201", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });

    const res = await POST(makePostRequest(validPostBody));

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.log).toBeDefined();
    expect(body.performanceEntriesCreated).toBeDefined();
    expect(body.prsDetected).toBeDefined();
    expect(body.workoutScore).toEqual({ totalScore: 70 });
  });

  it("deletes existing log when existingLogId is provided", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockLogFindFirst.mockResolvedValue({ id: "old-log" });

    const res = await POST(
      makePostRequest({ ...validPostBody, existingLogId: "old-log" })
    );

    expect(res.status).toBe(201);
    expect(mockLogFindFirst).toHaveBeenCalledWith({
      where: { id: "old-log", userId: "u1" },
    });
    expect(mockPerfDeleteMany).toHaveBeenCalled();
    expect(mockLogDelete).toHaveBeenCalledWith({ where: { id: "old-log" } });
  });

  it("skips deletion when existingLogId refers to non-existent log", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockLogFindFirst.mockResolvedValue(null);

    const res = await POST(
      makePostRequest({ ...validPostBody, existingLogId: "ghost" })
    );

    expect(res.status).toBe(201);
    expect(mockLogDelete).not.toHaveBeenCalled();
  });

  it("tracks strength performance with sets", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    const logWithSets = {
      ...createdLog,
      blockResults: [
        {
          exerciseResults: [
            {
              id: "er1",
              exerciseId: "ex1",
              exercise: { id: "ex1", name: "Deadlift", hasWeight: true },
              actualWeight: null,
              actualWeightUnit: null,
              actualReps: null,
              sets: [
                { id: "s1", weight: 100, weightUnit: "KG", reps: 5 },
                { id: "s2", weight: 110, weightUnit: "KG", reps: 3 },
              ],
            },
          ],
        },
      ],
    };
    mockLogCreate.mockResolvedValue(logWithSets);

    const res = await POST(makePostRequest(validPostBody));

    expect(res.status).toBe(201);
    // 2 sets → 2 performance entries
    expect(mockPerfCreate).toHaveBeenCalledTimes(2);
  });

  it("tracks strength performance via actualWeight/actualReps fallback", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });

    const res = await POST(makePostRequest(validPostBody));

    expect(res.status).toBe(201);
    expect(mockPerfCreate).toHaveBeenCalledTimes(1);
    expect(mockPerfCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "u1",
          type: "STRENGTH",
          exerciseId: "ex1",
          weightKg: 80,
          reps: 10,
        }),
      })
    );
  });

  it("detects PR and marks set as isPR", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    const logWithSets = {
      ...createdLog,
      blockResults: [
        {
          exerciseResults: [
            {
              id: "er1",
              exerciseId: "ex1",
              exercise: { id: "ex1", name: "Squat", hasWeight: true },
              actualWeight: null,
              actualWeightUnit: null,
              actualReps: null,
              sets: [{ id: "s1", weight: 120, weightUnit: "KG", reps: 5 }],
            },
          ],
        },
      ],
    };
    mockLogCreate.mockResolvedValue(logWithSets);
    // Previous history with lower e1RM
    mockPerfFindMany.mockResolvedValue([
      { weightKg: 100, reps: 5, performedAt: new Date("2024-05-01") },
    ]);

    const res = await POST(makePostRequest(validPostBody));

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.prsDetected.length).toBeGreaterThan(0);
    expect(mockSetUpdate).toHaveBeenCalledWith({
      where: { id: "s1" },
      data: { isPR: true },
    });
  });

  it("detects PR via actualWeight path and marks exerciseResult as isPR", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    // Previous history with lower e1RM
    mockPerfFindMany.mockResolvedValue([
      { weightKg: 60, reps: 10, performedAt: new Date("2024-05-01") },
    ]);

    const res = await POST(makePostRequest(validPostBody));

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.prsDetected.length).toBeGreaterThan(0);
    expect(mockExResultUpdate).toHaveBeenCalledWith({
      where: { id: "er1" },
      data: { isPR: true },
    });
  });

  it("skips performance tracking for non-weight exercises", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    const logNoWeight = {
      ...createdLog,
      blockResults: [
        {
          exerciseResults: [
            {
              id: "er1",
              exerciseId: "ex1",
              exercise: { id: "ex1", name: "Running", hasWeight: false },
              actualWeight: null,
              actualWeightUnit: null,
              actualReps: null,
              sets: [],
            },
          ],
        },
      ],
    };
    mockLogCreate.mockResolvedValue(logNoWeight);

    const res = await POST(makePostRequest(validPostBody));

    expect(res.status).toBe(201);
    expect(mockPerfCreate).not.toHaveBeenCalled();
  });

  it("converts LB to KG for performance tracking", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    const logWithLb = {
      ...createdLog,
      blockResults: [
        {
          exerciseResults: [
            {
              id: "er1",
              exerciseId: "ex1",
              exercise: { id: "ex1", name: "Press", hasWeight: true },
              actualWeight: 220,
              actualWeightUnit: "LB",
              actualReps: 5,
              sets: [],
            },
          ],
        },
      ],
    };
    mockLogCreate.mockResolvedValue(logWithLb);

    const res = await POST(makePostRequest(validPostBody));

    expect(res.status).toBe(201);
    expect(mockPerfCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          weightKg: expect.closeTo(220 / 2.20462, 2),
        }),
      })
    );
  });

  it("handles workoutScore computation failure gracefully", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockComputeScore.mockRejectedValue(new Error("Score engine broke"));

    const res = await POST(makePostRequest(validPostBody));

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.workoutScore).toBeNull();
  });

  it("handles computeAndPersistWorkoutScore returning null", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockComputeScore.mockResolvedValue(null);

    const res = await POST(makePostRequest(validPostBody));

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.workoutScore).toBeNull();
  });

  it("uses current date when performedAt is not provided", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });

    const bodyNoDate = { ...validPostBody };
    delete (bodyNoDate as Record<string, unknown>).performedAt;

    await POST(makePostRequest(bodyNoDate));

    expect(mockLogCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          performedAt: expect.any(Date),
        }),
      })
    );
  });

  it("passes sessionId when provided and session exists", async () => {
    mockGetAuthUser.mockResolvedValue({ id: "u1" });
    mockSessionFindUnique.mockResolvedValue({ id: "s1" });

    await POST(makePostRequest({ ...validPostBody, sessionId: "s1" }));

    expect(mockLogCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          sessionId: "s1",
        }),
      })
    );
  });

  it("returns 500 on unexpected error", async () => {
    mockGetAuthUser.mockRejectedValue(new Error("DB down"));

    const res = await POST(makePostRequest(validPostBody));

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Internal server error");
  });
});
