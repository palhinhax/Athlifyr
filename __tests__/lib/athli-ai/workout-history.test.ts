/**
 * @jest-environment node
 */

import {
  getUserWorkoutHistory,
  formatDuration,
  formatMetricParts,
  formatExerciseDetail,
} from "@/lib/athli-ai/workout-history";
import type { ExerciseResultSummary } from "@/lib/athli-ai/workout-history";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    workoutLog: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

const mockCount = prisma.workoutLog.count as jest.Mock;
const mockFindMany = prisma.workoutLog.findMany as jest.Mock;

beforeEach(() => jest.clearAllMocks());

const userId = "u1";

// ── Pure function tests ───────────────────────────────────────────────────────

describe("formatDuration", () => {
  it("formats minutes and seconds", () => {
    expect(formatDuration(65)).toBe("1m5s");
  });

  it("formats only minutes", () => {
    expect(formatDuration(120)).toBe("2m");
  });

  it("formats only seconds", () => {
    expect(formatDuration(45)).toBe("45s");
  });
});

describe("formatMetricParts", () => {
  it("returns reps part", () => {
    const er = {
      actualReps: 10,
      actualWeight: null,
      actualDistance: null,
      actualTime: null,
      actualCalories: null,
    } as unknown as ExerciseResultSummary;

    expect(formatMetricParts(er)).toEqual(["10 reps"]);
  });

  it("returns weight part with unit", () => {
    const er = {
      actualReps: null,
      actualWeight: 100,
      actualWeightUnit: "KG",
      actualDistance: null,
      actualTime: null,
      actualCalories: null,
    } as unknown as ExerciseResultSummary;

    expect(formatMetricParts(er)).toEqual(["100KG"]);
  });

  it("defaults weight unit to KG", () => {
    const er = {
      actualReps: null,
      actualWeight: 80,
      actualWeightUnit: null,
      actualDistance: null,
      actualTime: null,
      actualCalories: null,
    } as unknown as ExerciseResultSummary;

    expect(formatMetricParts(er)).toEqual(["80KG"]);
  });

  it("returns distance part", () => {
    const er = {
      actualReps: null,
      actualWeight: null,
      actualDistance: 5,
      actualDistanceUnit: "KM",
      actualTime: null,
      actualCalories: null,
    } as unknown as ExerciseResultSummary;

    expect(formatMetricParts(er)).toEqual(["5KM"]);
  });

  it("returns time part", () => {
    const er = {
      actualReps: null,
      actualWeight: null,
      actualDistance: null,
      actualTime: 90,
      actualCalories: null,
    } as unknown as ExerciseResultSummary;

    expect(formatMetricParts(er)).toEqual(["1m30s"]);
  });

  it("returns calories part", () => {
    const er = {
      actualReps: null,
      actualWeight: null,
      actualDistance: null,
      actualTime: null,
      actualCalories: 200,
    } as unknown as ExerciseResultSummary;

    expect(formatMetricParts(er)).toEqual(["200 cal"]);
  });

  it("returns multiple parts", () => {
    const er = {
      actualReps: 10,
      actualWeight: 100,
      actualWeightUnit: "KG",
      actualDistance: null,
      actualTime: null,
      actualCalories: null,
    } as unknown as ExerciseResultSummary;

    expect(formatMetricParts(er)).toEqual(["10 reps", "100KG"]);
  });
});

describe("formatExerciseDetail", () => {
  it("formats exercise with sets", () => {
    const er: ExerciseResultSummary = {
      exercise: { name: "Back Squat" },
      sets: [
        { reps: 5, weight: 100, weightUnit: "KG", isPR: false },
        { reps: 5, weight: 100, weightUnit: "KG", isPR: false },
      ],
      actualReps: null,
      actualWeight: null,
      actualWeightUnit: null,
      actualDistance: null,
      actualDistanceUnit: null,
      actualTime: null,
      actualCalories: null,
      isPR: false,
    };

    const result = formatExerciseDetail(er);

    expect(result).toBe("Back Squat (5×100KG, 5×100KG)");
  });

  it("formats exercise with PR flag", () => {
    const er: ExerciseResultSummary = {
      exercise: { name: "Deadlift" },
      sets: [{ reps: 1, weight: 200, weightUnit: "KG", isPR: true }],
      actualReps: null,
      actualWeight: null,
      actualWeightUnit: null,
      actualDistance: null,
      actualDistanceUnit: null,
      actualTime: null,
      actualCalories: null,
      isPR: true,
    };

    const result = formatExerciseDetail(er);

    expect(result).toContain("🏆 PR!");
  });

  it("formats exercise with metric parts when no sets", () => {
    const er: ExerciseResultSummary = {
      exercise: { name: "Row" },
      sets: [],
      actualReps: null,
      actualWeight: null,
      actualWeightUnit: null,
      actualDistance: 2,
      actualDistanceUnit: "KM",
      actualTime: 480,
      actualCalories: null,
      isPR: false,
    };

    const result = formatExerciseDetail(er);

    expect(result).toBe("Row (2KM, 8m)");
  });

  it("formats exercise name alone when no data", () => {
    const er: ExerciseResultSummary = {
      exercise: { name: "Stretching" },
      sets: [],
      actualReps: null,
      actualWeight: null,
      actualWeightUnit: null,
      actualDistance: null,
      actualDistanceUnit: null,
      actualTime: null,
      actualCalories: null,
      isPR: false,
    };

    expect(formatExerciseDetail(er)).toBe("Stretching");
  });
});

// ── getUserWorkoutHistory ─────────────────────────────────────────────────────

describe("getUserWorkoutHistory", () => {
  const makeLog = (overrides = {}) => ({
    performedAt: new Date("2025-03-15"),
    feeling: 4,
    perceivedEffort: 7,
    notes: "Good session",
    workout: {
      id: "w1",
      name: "Morning WOD",
      estimatedTime: 60,
      difficulty: 3,
      tags: ["crossfit"],
    },
    session: { id: "s1", title: "WOD Morning" },
    blockResults: [
      {
        block: { id: "bl1", type: "FOR_TIME", name: "Main" },
        exerciseResults: [
          {
            exercise: { name: "Thruster", category: "CROSSFIT" },
            actualReps: 21,
            actualWeight: 43 as number | null,
            actualWeightUnit: "KG" as string | null,
            actualDistance: null as number | null,
            actualDistanceUnit: null as string | null,
            actualTime: null as number | null,
            actualCalories: null as number | null,
            isPR: false,
            sets: [] as Array<{
              reps: number;
              weight: number;
              weightUnit: string;
              isPR: boolean;
            }>,
          },
        ],
      },
    ],
    ...overrides,
  });

  it("returns workout history with stats", async () => {
    mockCount.mockResolvedValue(5);
    mockFindMany.mockResolvedValue([makeLog()]);

    const result = JSON.parse(
      await getUserWorkoutHistory(userId, { period: "week" })
    );

    expect(result.period).toBe("this week");
    expect(result.stats.totalWorkouts).toBe(5);
    expect(result.stats.avgFeeling).toBe(4);
    expect(result.stats.avgEffort).toBe(7);
    expect(result.logs).toHaveLength(1);
    expect(result.logs[0].workoutName).toBe("Morning WOD");
  });

  it("returns no logs message for empty history", async () => {
    mockCount.mockResolvedValue(0);
    mockFindMany.mockResolvedValue([]);

    const result = await getUserWorkoutHistory(userId, { period: "week" });

    expect(result).toContain("No workout logs found");
    expect(result).toContain("this week");
  });

  it("returns generic message when period is undefined", async () => {
    mockCount.mockResolvedValue(0);
    mockFindMany.mockResolvedValue([]);

    const result = await getUserWorkoutHistory(userId, {});

    expect(result).toContain("No workout logs found");
  });

  it("counts PRs from exercise results and sets", async () => {
    const log = makeLog();
    log.blockResults[0].exerciseResults[0].isPR = true;
    log.blockResults[0].exerciseResults[0].sets = [
      { reps: 1, weight: 100, weightUnit: "KG", isPR: true },
    ];
    mockCount.mockResolvedValue(1);
    mockFindMany.mockResolvedValue([log]);

    const result = JSON.parse(await getUserWorkoutHistory(userId, {}));

    expect(result.stats.prsAchieved).toBe(2);
  });

  it("handles last_week period", async () => {
    mockCount.mockResolvedValue(0);
    mockFindMany.mockResolvedValue([]);

    const result = await getUserWorkoutHistory(userId, {
      period: "last_week",
    });

    expect(result).toContain("last week");
  });

  it("handles month period", async () => {
    mockCount.mockResolvedValue(0);
    mockFindMany.mockResolvedValue([]);

    const result = await getUserWorkoutHistory(userId, {
      period: "month",
    });

    expect(result).toContain("this month");
  });

  it("handles last_month period", async () => {
    mockCount.mockResolvedValue(0);
    mockFindMany.mockResolvedValue([]);

    const result = await getUserWorkoutHistory(userId, {
      period: "last_month",
    });

    expect(result).toContain("last month");
  });

  it("handles year period with lower limit", async () => {
    mockCount.mockResolvedValue(100);
    mockFindMany.mockResolvedValue([makeLog()]);

    const result = JSON.parse(
      await getUserWorkoutHistory(userId, { period: "year" })
    );

    expect(result.stats.totalWorkouts).toBe(100);
    // year uses min(limit, 10), so take should be 10
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 10 })
    );
  });

  it("handles all period", async () => {
    mockCount.mockResolvedValue(50);
    mockFindMany.mockResolvedValue([makeLog()]);

    const result = JSON.parse(
      await getUserWorkoutHistory(userId, { period: "all" })
    );

    expect(result.period).toBe("all time");
  });

  it("handles log without session", async () => {
    mockCount.mockResolvedValue(1);
    mockFindMany.mockResolvedValue([makeLog({ session: null })]);

    const result = JSON.parse(await getUserWorkoutHistory(userId, {}));

    expect(result.logs[0].session).toBeNull();
  });

  it("computes unique exercises", async () => {
    const log = makeLog();
    log.blockResults[0].exerciseResults.push({
      exercise: { name: "Pull Up", category: "BODYWEIGHT" },
      actualReps: 15,
      actualWeight: null as number | null,
      actualWeightUnit: null as string | null,
      actualDistance: null,
      actualDistanceUnit: null,
      actualTime: null,
      actualCalories: null,
      isPR: false,
      sets: [],
    });
    mockCount.mockResolvedValue(1);
    mockFindMany.mockResolvedValue([log]);

    const result = JSON.parse(await getUserWorkoutHistory(userId, {}));

    expect(result.stats.uniqueExercises).toBe(2);
  });

  it("averages null feelings/efforts correctly", async () => {
    mockCount.mockResolvedValue(2);
    mockFindMany.mockResolvedValue([
      makeLog({ feeling: null, perceivedEffort: null }),
      makeLog({ feeling: 5, perceivedEffort: 8 }),
    ]);

    const result = JSON.parse(await getUserWorkoutHistory(userId, {}));

    expect(result.stats.avgFeeling).toBe(5);
    expect(result.stats.avgEffort).toBe(8);
  });
});
