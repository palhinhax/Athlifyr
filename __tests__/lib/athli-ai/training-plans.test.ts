/**
 * @jest-environment node
 */

import {
  listAvailableExercises,
  findExercise,
  mapBlockType,
  resolveWeightUnit,
  resolveDistanceUnit,
  resolveAndCreateBlock,
  saveTrainingPlan,
} from "@/lib/athli-ai/training-plans";
import type { PlanBlockInput } from "@/lib/athli-ai/training-plans";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    exercise: { findMany: jest.fn(), findFirst: jest.fn() },
    workoutBlock: { create: jest.fn() },
    workoutBlockExercise: { create: jest.fn() },
    trainingPlan: { create: jest.fn() },
    trainingPlanWeek: { create: jest.fn() },
    workout: { create: jest.fn() },
    trainingPlanWorkout: { create: jest.fn() },
    userTrainingPlan: { create: jest.fn() },
  },
}));

const mockExerciseFindMany = prisma.exercise.findMany as jest.Mock;
const mockExerciseFindFirst = prisma.exercise.findFirst as jest.Mock;
const mockBlockCreate = prisma.workoutBlock.create as jest.Mock;
const mockBlockExCreate = prisma.workoutBlockExercise.create as jest.Mock;
const mockPlanCreate = prisma.trainingPlan.create as jest.Mock;
const mockWeekCreate = prisma.trainingPlanWeek.create as jest.Mock;
const mockWorkoutCreate = prisma.workout.create as jest.Mock;
const mockUserPlanCreate = prisma.userTrainingPlan.create as jest.Mock;

beforeEach(() => jest.clearAllMocks());

// ── listAvailableExercises ────────────────────────────────────────────────────

describe("listAvailableExercises", () => {
  it("returns all exercises", async () => {
    mockExerciseFindMany.mockResolvedValue([
      { id: "ex1", name: "Squat", category: "GYM" },
      { id: "ex2", name: "Pull Up", category: "BODYWEIGHT" },
    ]);

    const result = JSON.parse(await listAvailableExercises());

    expect(result.total).toBe(2);
    expect(result.exercises[0].name).toBe("Squat");
  });

  it("filters by category", async () => {
    mockExerciseFindMany.mockResolvedValue([]);

    await listAvailableExercises("crossfit");

    const where = mockExerciseFindMany.mock.calls[0][0].where;
    expect(where.category).toBe("CROSSFIT");
  });
});

// ── findExercise ──────────────────────────────────────────────────────────────

describe("findExercise", () => {
  it("finds exercise by exact match", async () => {
    mockExerciseFindFirst.mockResolvedValue({ id: "ex1" });

    const result = await findExercise("Back Squat");

    expect(result).toBe("ex1");
  });

  it("finds exercise by contains fallback (single match)", async () => {
    mockExerciseFindFirst.mockResolvedValue(null);
    (prisma.exercise as unknown as Record<string, jest.Mock>).findMany = jest
      .fn()
      .mockResolvedValue([{ id: "ex2" }]);

    const result = await findExercise("Squat");

    expect(result).toBe("ex2");
  });

  it("returns null when no match", async () => {
    mockExerciseFindFirst.mockResolvedValue(null);
    (prisma.exercise as unknown as Record<string, jest.Mock>).findMany = jest
      .fn()
      .mockResolvedValue([]);

    const result = await findExercise("FakeExercise");

    expect(result).toBeNull();
  });

  it("returns null when multiple contains matches (ambiguous)", async () => {
    mockExerciseFindFirst.mockResolvedValue(null);
    (prisma.exercise as unknown as Record<string, jest.Mock>).findMany = jest
      .fn()
      .mockResolvedValue([{ id: "ex1" }, { id: "ex2" }]);

    const result = await findExercise("Press");

    expect(result).toBeNull();
  });
});

// ── mapBlockType ──────────────────────────────────────────────────────────────

describe("mapBlockType", () => {
  it("maps valid types", () => {
    expect(mapBlockType("WARMUP")).toBe("WARMUP");
    expect(mapBlockType("AMRAP")).toBe("AMRAP");
    expect(mapBlockType("EMOM")).toBe("EMOM");
    expect(mapBlockType("COOLDOWN")).toBe("COOLDOWN");
    expect(mapBlockType("REST")).toBe("REST");
    expect(mapBlockType("SKILL")).toBe("SKILL");
    expect(mapBlockType("TABATA")).toBe("TABATA");
    expect(mapBlockType("CHIPPER")).toBe("CHIPPER");
  });

  it("is case-insensitive", () => {
    expect(mapBlockType("warmup")).toBe("WARMUP");
    expect(mapBlockType("amrap")).toBe("AMRAP");
  });

  it("defaults to FOR_TIME for unknown type", () => {
    expect(mapBlockType("UNKNOWN")).toBe("FOR_TIME");
  });
});

// ── resolveWeightUnit ─────────────────────────────────────────────────────────

describe("resolveWeightUnit", () => {
  it("returns LB when specified", () => {
    expect(resolveWeightUnit({ name: "x", weightUnit: "LB" })).toBe("LB");
  });

  it("returns KG when weight is present", () => {
    expect(resolveWeightUnit({ name: "x", weight: 100 })).toBe("KG");
  });

  it("returns undefined when no weight", () => {
    expect(resolveWeightUnit({ name: "x" })).toBeUndefined();
  });
});

// ── resolveDistanceUnit ───────────────────────────────────────────────────────

describe("resolveDistanceUnit", () => {
  it("returns MI when specified", () => {
    expect(resolveDistanceUnit({ name: "x", distanceUnit: "MI" })).toBe("MI");
  });

  it("returns M when specified", () => {
    expect(resolveDistanceUnit({ name: "x", distanceUnit: "M" })).toBe("M");
  });

  it("returns KM when distance is present", () => {
    expect(resolveDistanceUnit({ name: "x", distance: 5 })).toBe("KM");
  });

  it("returns undefined when no distance", () => {
    expect(resolveDistanceUnit({ name: "x" })).toBeUndefined();
  });
});

// ── resolveAndCreateBlock ─────────────────────────────────────────────────────

describe("resolveAndCreateBlock", () => {
  it("creates block with resolved exercises", async () => {
    mockExerciseFindFirst.mockResolvedValue({ id: "ex1" });
    mockBlockCreate.mockResolvedValue({ id: "bl1" });

    const blockInput: PlanBlockInput = {
      type: "STRENGTH",
      name: "Main",
      exercises: [{ name: "Back Squat", reps: 5, weight: 100 }],
    };

    const result = await resolveAndCreateBlock("w1", blockInput, 0);

    expect(result.created).toBe(true);
    expect(result.exerciseCount).toBe(1);
    expect(mockBlockCreate).toHaveBeenCalled();
    expect(mockBlockExCreate).toHaveBeenCalled();
  });

  it("skips block when no exercises resolve", async () => {
    mockExerciseFindFirst.mockResolvedValue(null);
    (prisma.exercise as unknown as Record<string, jest.Mock>).findMany = jest
      .fn()
      .mockResolvedValue([]);

    const blockInput: PlanBlockInput = {
      type: "STRENGTH",
      exercises: [{ name: "FakeExercise" }],
    };

    const result = await resolveAndCreateBlock("w1", blockInput, 0);

    expect(result.created).toBe(false);
    expect(result.exerciseCount).toBe(0);
    expect(mockBlockCreate).not.toHaveBeenCalled();
  });

  it("creates REST block even with no exercises", async () => {
    mockBlockCreate.mockResolvedValue({ id: "bl-rest" });

    const blockInput: PlanBlockInput = {
      type: "REST",
      exercises: [],
    };

    const result = await resolveAndCreateBlock("w1", blockInput, 0);

    expect(result.created).toBe(true);
    expect(mockBlockCreate).toHaveBeenCalled();
  });
});

// ── saveTrainingPlan ──────────────────────────────────────────────────────────

describe("saveTrainingPlan", () => {
  it("creates plan with weeks and workouts", async () => {
    mockPlanCreate.mockResolvedValue({ id: "plan-1" });
    mockWeekCreate.mockResolvedValue({ id: "week-1" });
    mockWorkoutCreate.mockResolvedValue({ id: "wk-1" });
    mockExerciseFindFirst.mockResolvedValue({ id: "ex1" });
    mockBlockCreate.mockResolvedValue({ id: "bl1" });

    const result = JSON.parse(
      await saveTrainingPlan(
        {
          name: "Beginner Plan",
          description: "4-week plan",
          duration: 4,
          difficulty: 2,
          category: "Strength",
          targetAudience: "Beginner",
          goals: ["Build strength"],
          weeks: [
            {
              weekNumber: 1,
              workouts: [
                {
                  name: "Day 1 - Squat",
                  dayOfWeek: 1,
                  estimatedTime: 60,
                  blocks: [
                    {
                      type: "STRENGTH",
                      exercises: [{ name: "Back Squat", reps: 5, weight: 80 }],
                    },
                  ],
                },
              ],
            },
          ],
        },
        "u1"
      )
    );

    expect(result.id).toBe("plan-1");
    expect(result.totalWorkouts).toBe(1);
    expect(result.totalWeeks).toBe(1);
    expect(mockPlanCreate).toHaveBeenCalled();
    expect(mockWeekCreate).toHaveBeenCalled();
    expect(mockWorkoutCreate).toHaveBeenCalled();
    expect(mockUserPlanCreate).toHaveBeenCalled();
  });
});
