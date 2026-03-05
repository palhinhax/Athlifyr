/**
 * @jest-environment node
 */

/**
 * Unit tests for lib/athli-ai.ts
 * Covers: saveWorkout, saveTrainingPlan, and the internal findExercise helper
 * (tested indirectly via the exported functions).
 *
 * Key behaviours under test (from the fix/empty-blocks-in-plan changes):
 * - findExercise: name normalisation, exact match, alias match, contains
 *   fallback (unambiguous only), no-match returns null.
 * - saveWorkout: block skipping when all exercises are unknown,
 *   REST block preservation, workout cleanup when nothing resolved,
 *   correct blockOrderIndex assignment.
 * - saveTrainingPlan: same block / exercise resolution rules inside plan
 *   context.
 */

import { saveWorkout, saveTrainingPlan } from "@/lib/athli-ai";
import { prisma } from "@/lib/prisma";

// ── Prisma mock ───────────────────────────────────────────────────────────────

jest.mock("@/lib/prisma", () => ({
  prisma: {
    exercise: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    workout: {
      create: jest.fn(),
      delete: jest.fn(),
    },
    workoutBlock: {
      create: jest.fn(),
    },
    workoutBlockExercise: {
      create: jest.fn(),
    },
    savedWorkout: {
      create: jest.fn(),
    },
    trainingPlan: {
      create: jest.fn(),
    },
    trainingPlanWeek: {
      create: jest.fn(),
    },
    trainingPlanWorkout: {
      create: jest.fn(),
    },
    userTrainingPlan: {
      create: jest.fn(),
    },
  },
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const userId = "user-1";

/**
 * Configure exercise mock to simulate a specific lookup scenario.
 *
 * @param findFirstResult  Value returned for the exact / alias query
 * @param findManyResults  Values returned for the contains-fallback query
 */
function setupExerciseMock(
  findFirstResult: { id: string } | null,
  findManyResults: Array<{ id: string }> = []
) {
  (prisma.exercise.findFirst as jest.Mock).mockResolvedValue(findFirstResult);
  (prisma.exercise.findMany as jest.Mock).mockResolvedValue(findManyResults);
}

function setupWorkoutCreate(id = "workout-1") {
  (prisma.workout.create as jest.Mock).mockResolvedValue({
    id,
    name: "Test Workout",
    estimatedTime: 30,
    difficulty: 3,
  });
}

function setupBlockCreate(id = "block-1") {
  (prisma.workoutBlock.create as jest.Mock).mockResolvedValue({ id });
}

// ── saveWorkout ───────────────────────────────────────────────────────────────

describe("saveWorkout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupWorkoutCreate();
    setupBlockCreate();
    (prisma.workoutBlockExercise.create as jest.Mock).mockResolvedValue({});
    (prisma.savedWorkout.create as jest.Mock).mockResolvedValue({});
    (prisma.workout.delete as jest.Mock).mockResolvedValue({});
  });

  describe("happy path — all exercises resolve", () => {
    it("returns workout JSON with correct totalBlocks", async () => {
      setupExerciseMock({ id: "ex-1" });

      const result = await saveWorkout(
        {
          name: "Test Workout",
          blocks: [
            {
              type: "STRENGTH",
              exercises: [{ name: "Squat", reps: 10 }],
            },
            {
              type: "AMRAP",
              exercises: [{ name: "Pull-up", reps: 5 }],
            },
          ],
        },
        userId
      );

      const parsed = JSON.parse(result) as {
        totalBlocks: number;
        id: string;
        url: string;
      };
      expect(parsed.totalBlocks).toBe(2);
      expect(parsed.id).toBe("workout-1");
      expect(prisma.workoutBlock.create).toHaveBeenCalledTimes(2);
      expect(prisma.workoutBlockExercise.create).toHaveBeenCalledTimes(2);
    });

    it("saves workout to user's saved workouts", async () => {
      setupExerciseMock({ id: "ex-1" });

      await saveWorkout(
        {
          name: "Test",
          blocks: [{ type: "STRENGTH", exercises: [{ name: "Deadlift" }] }],
        },
        userId
      );

      expect(prisma.savedWorkout.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ userId }),
        })
      );
    });
  });

  describe("exercise name normalisation", () => {
    it("trims leading/trailing whitespace before querying prisma", async () => {
      setupExerciseMock({ id: "ex-1" });

      await saveWorkout(
        {
          name: "Test",
          blocks: [{ type: "STRENGTH", exercises: [{ name: "  Squat  " }] }],
        },
        userId
      );

      expect(prisma.exercise.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({
                name: expect.objectContaining({ equals: "Squat" }),
              }),
            ]),
          }),
        })
      );
    });

    it("collapses multiple internal spaces before querying prisma", async () => {
      setupExerciseMock({ id: "ex-1" });

      await saveWorkout(
        {
          name: "Test",
          blocks: [
            {
              type: "STRENGTH",
              exercises: [{ name: "Bench   Press" }],
            },
          ],
        },
        userId
      );

      expect(prisma.exercise.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({
                name: expect.objectContaining({ equals: "Bench Press" }),
              }),
            ]),
          }),
        })
      );
    });
  });

  describe("findExercise — contains fallback", () => {
    it("uses contains-fallback when exact match returns null and single result exists", async () => {
      // No exact match, one contains match
      setupExerciseMock(null, [{ id: "ex-fallback" }]);

      await saveWorkout(
        {
          name: "Test",
          blocks: [
            {
              type: "STRENGTH",
              exercises: [{ name: "squat" }],
            },
          ],
        },
        userId
      );

      expect(prisma.workoutBlockExercise.create).toHaveBeenCalledTimes(1);
    });

    it("skips exercise when contains-fallback returns multiple matches (ambiguous)", async () => {
      // No exact match, two contains matches → ambiguous → skip
      setupExerciseMock(null, [{ id: "ex-1" }, { id: "ex-2" }]);

      await saveWorkout(
        {
          name: "Test",
          blocks: [
            {
              type: "STRENGTH",
              exercises: [{ name: "press" }],
            },
          ],
        },
        userId
      );

      // Block gets skipped because no exercises resolved
      expect(prisma.workoutBlock.create).not.toHaveBeenCalled();
      expect(prisma.workoutBlockExercise.create).not.toHaveBeenCalled();
    });

    it("skips exercise when both exact and contains return nothing", async () => {
      setupExerciseMock(null, []);

      await saveWorkout(
        {
          name: "Test",
          blocks: [
            {
              type: "STRENGTH",
              exercises: [{ name: "UnknownExercise" }],
            },
          ],
        },
        userId
      );

      expect(prisma.workoutBlock.create).not.toHaveBeenCalled();
    });
  });

  describe("block skipping — no resolved exercises", () => {
    it("skips a non-REST block when all exercises are unknown", async () => {
      setupExerciseMock(null);

      const result = await saveWorkout(
        {
          name: "Test",
          blocks: [
            {
              type: "STRENGTH",
              name: "Main",
              exercises: [{ name: "UnknownA" }, { name: "UnknownB" }],
            },
          ],
        },
        userId
      );

      // Workout deleted because no blocks/exercises at all
      expect(prisma.workout.delete).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "workout-1" },
        })
      );

      const parsed = JSON.parse(result) as { error: boolean; message: string };
      expect(parsed.error).toBe(true);
      expect(parsed.message).toContain("No exercises could be matched");
    });

    it("preserves REST block even when exercises array is empty", async () => {
      // No exercises will resolve, but REST block has empty exercises
      setupExerciseMock(null);

      const result = await saveWorkout(
        {
          name: "Test",
          blocks: [
            {
              type: "REST",
              name: "Rest day",
              exercises: [],
            },
          ],
        },
        userId
      );

      expect(prisma.workoutBlock.create).toHaveBeenCalledTimes(1);
      expect(prisma.workout.delete).not.toHaveBeenCalled();

      const parsed = JSON.parse(result) as { totalBlocks: number };
      expect(parsed.totalBlocks).toBe(1);
    });

    it("preserves REST block when it has only unknown exercises", async () => {
      // REST block with unknown exercise — REST block still kept because type === REST
      setupExerciseMock(null);

      await saveWorkout(
        {
          name: "Test",
          blocks: [
            {
              type: "rest", // lowercase to test case-insensitive check
              exercises: [{ name: "Unknown" }],
            },
          ],
        },
        userId
      );

      expect(prisma.workoutBlock.create).toHaveBeenCalledTimes(1);
    });

    it("skips unknown exercises within a block but keeps resolved ones", async () => {
      (prisma.exercise.findFirst as jest.Mock)
        .mockResolvedValueOnce({ id: "ex-1" }) // first exercise found
        .mockResolvedValueOnce(null); // second exercise not found
      (prisma.exercise.findMany as jest.Mock).mockResolvedValue([]);

      await saveWorkout(
        {
          name: "Test",
          blocks: [
            {
              type: "STRENGTH",
              exercises: [{ name: "Squat" }, { name: "Unknown" }],
            },
          ],
        },
        userId
      );

      // Block is created (1 resolved), but only 1 exercise is saved
      expect(prisma.workoutBlock.create).toHaveBeenCalledTimes(1);
      expect(prisma.workoutBlockExercise.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("blockOrderIndex — continuous counter across skipped blocks", () => {
    it("assigns consecutive orderIndex values when a mid-block is skipped", async () => {
      (prisma.exercise.findFirst as jest.Mock)
        .mockResolvedValueOnce({ id: "ex-1" }) // block 0 exercise found
        .mockResolvedValueOnce(null) // block 1 exercise not found → skip block
        .mockResolvedValueOnce({ id: "ex-2" }); // block 2 exercise found
      (prisma.exercise.findMany as jest.Mock).mockResolvedValue([]);

      (prisma.workoutBlock.create as jest.Mock)
        .mockResolvedValueOnce({ id: "block-0" })
        .mockResolvedValueOnce({ id: "block-2" });

      const result = await saveWorkout(
        {
          name: "Test",
          blocks: [
            { type: "WARMUP", exercises: [{ name: "Jump rope" }] },
            { type: "STRENGTH", exercises: [{ name: "Unknown" }] },
            { type: "COOLDOWN", exercises: [{ name: "Stretch" }] },
          ],
        },
        userId
      );

      const calls = (prisma.workoutBlock.create as jest.Mock).mock.calls;
      expect(calls[0][0].data.orderIndex).toBe(0);
      expect(calls[1][0].data.orderIndex).toBe(1);

      const parsed = JSON.parse(result) as { totalBlocks: number };
      expect(parsed.totalBlocks).toBe(2);
    });
  });

  describe("workout cleanup on total failure", () => {
    it("deletes workout and returns error when no exercises match across all blocks", async () => {
      setupExerciseMock(null);

      const result = await saveWorkout(
        {
          name: "Broken Workout",
          blocks: [
            {
              type: "STRENGTH",
              exercises: [{ name: "ExA" }, { name: "ExB" }],
            },
            {
              type: "AMRAP",
              exercises: [{ name: "ExC" }],
            },
          ],
        },
        userId
      );

      expect(prisma.workout.delete).toHaveBeenCalledTimes(1);
      expect(prisma.savedWorkout.create).not.toHaveBeenCalled();

      const parsed = JSON.parse(result) as { error: boolean; message: string };
      expect(parsed.error).toBe(true);
    });

    it("does NOT delete workout when a REST block exists even with 0 exercises", async () => {
      setupExerciseMock(null);

      await saveWorkout(
        {
          name: "Rest Only",
          blocks: [
            { type: "REST", exercises: [] },
            // non-REST block with unknown exercise → skipped
            { type: "STRENGTH", exercises: [{ name: "Unknown" }] },
          ],
        },
        userId
      );

      // blockOrderIndex = 1 (REST block created), so cleanup is NOT triggered
      expect(prisma.workout.delete).not.toHaveBeenCalled();
    });
  });
});

// ── saveTrainingPlan ──────────────────────────────────────────────────────────

describe("saveTrainingPlan", () => {
  const planParams = {
    name: "Test Plan",
    description: "A test plan",
    duration: 4,
    difficulty: 3,
    category: "STRENGTH",
    targetAudience: "Intermediate",
    goals: ["Build muscle"],
    weeks: [
      {
        weekNumber: 1,
        workouts: [
          {
            name: "Day 1",
            dayOfWeek: 1,
            blocks: [
              {
                type: "STRENGTH",
                exercises: [{ name: "Squat", reps: 5 }],
              },
            ],
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (prisma.trainingPlan.create as jest.Mock).mockResolvedValue({
      id: "plan-1",
      name: "Test Plan",
    });
    (prisma.trainingPlanWeek.create as jest.Mock).mockResolvedValue({
      id: "week-1",
    });
    (prisma.workout.create as jest.Mock).mockResolvedValue({
      id: "workout-1",
      name: "Day 1",
    });
    (prisma.workoutBlock.create as jest.Mock).mockResolvedValue({
      id: "block-1",
    });
    (prisma.workoutBlockExercise.create as jest.Mock).mockResolvedValue({});
    (prisma.trainingPlanWorkout.create as jest.Mock).mockResolvedValue({});
    (prisma.userTrainingPlan.create as jest.Mock).mockResolvedValue({});
    (prisma.workout.delete as jest.Mock).mockResolvedValue({});
  });

  it("creates plan and returns JSON with plan id", async () => {
    setupExerciseMock({ id: "ex-1" });

    const result = await saveTrainingPlan(planParams, userId);

    const parsed = JSON.parse(result) as {
      id: string;
      totalWorkouts: number;
      totalWeeks: number;
    };
    expect(parsed.id).toBe("plan-1");
    expect(parsed.totalWeeks).toBe(1);
    expect(parsed.totalWorkouts).toBe(1);
  });

  it("skips non-REST block when all exercises are unknown", async () => {
    setupExerciseMock(null);

    await saveTrainingPlan(planParams, userId);

    expect(prisma.workoutBlock.create).not.toHaveBeenCalled();
    expect(prisma.workoutBlockExercise.create).not.toHaveBeenCalled();
    // Workout is still created (we don't delete plan workouts like saveWorkout does)
    expect(prisma.workout.create).toHaveBeenCalled();
  });

  it("preserves REST block in plan workouts even with no exercises", async () => {
    setupExerciseMock(null);

    const paramsWithRest = {
      ...planParams,
      weeks: [
        {
          weekNumber: 1,
          workouts: [
            {
              name: "Day 1",
              dayOfWeek: 1,
              blocks: [
                {
                  type: "REST",
                  exercises: [],
                },
              ],
            },
          ],
        },
      ],
    };

    await saveTrainingPlan(paramsWithRest, userId);

    expect(prisma.workoutBlock.create).toHaveBeenCalledTimes(1);
    expect(
      (prisma.workoutBlock.create as jest.Mock).mock.calls[0][0].data.type
    ).toBe("REST");
  });

  it("assigns consecutive orderIndex skipping empty blocks in plan", async () => {
    (prisma.exercise.findFirst as jest.Mock)
      .mockResolvedValueOnce({ id: "ex-1" }) // block 0 → found
      .mockResolvedValueOnce(null); // block 1 → not found → skip
    (prisma.exercise.findMany as jest.Mock).mockResolvedValue([]);

    const paramsWithTwoBlocks = {
      ...planParams,
      weeks: [
        {
          weekNumber: 1,
          workouts: [
            {
              name: "Day 1",
              dayOfWeek: 1,
              blocks: [
                { type: "WARMUP", exercises: [{ name: "Jog" }] },
                { type: "STRENGTH", exercises: [{ name: "Unknown" }] },
              ],
            },
          ],
        },
      ],
    };

    await saveTrainingPlan(paramsWithTwoBlocks, userId);

    const calls = (prisma.workoutBlock.create as jest.Mock).mock.calls;
    expect(calls).toHaveLength(1);
    expect(calls[0][0].data.orderIndex).toBe(0);
  });

  it("links plan to user via userTrainingPlan", async () => {
    setupExerciseMock({ id: "ex-1" });

    await saveTrainingPlan(planParams, userId);

    expect(prisma.userTrainingPlan.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ userId, planId: "plan-1" }),
      })
    );
  });
});
