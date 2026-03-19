import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { WeightUnit, DistanceUnit } from "@prisma/client";
import { computeStrengthScores } from "@/lib/performance/scoring";
import { computeAndPersistWorkoutScore } from "@/lib/scoring/score-service";

// ============================================================================
// Validation Schemas
// ============================================================================

const createSetSchema = z.object({
  setNumber: z.number().int().positive(),
  reps: z.number().int().positive(),
  weight: z.number().positive(),
  weightUnit: z.nativeEnum(WeightUnit),
  notes: z.string().optional(),
});

const createExerciseResultSchema = z.object({
  blockExerciseId: z.string().min(1),
  exerciseId: z.string().min(1),
  actualReps: z.number().int().positive().optional(),
  actualWeight: z.number().positive().optional(),
  actualWeightUnit: z.nativeEnum(WeightUnit).optional(),
  actualDistance: z.number().positive().optional(),
  actualDistanceUnit: z.nativeEnum(DistanceUnit).optional(),
  actualTime: z.number().int().positive().optional(),
  actualCalories: z.number().int().positive().optional(),
  notes: z.string().optional(),
  sets: z.array(createSetSchema).optional(),
});

const createBlockResultSchema = z.object({
  blockId: z.string().min(1),
  completedRounds: z.number().int().min(0).optional(),
  extraReps: z.number().int().min(0).optional(),
  completedTime: z.number().int().positive().optional(),
  completedInTime: z.boolean().optional(),
  notes: z.string().optional(),
  exerciseResults: z.array(createExerciseResultSchema),
});

const createLogSchema = z.object({
  workoutId: z.string().min(1),
  sessionId: z.string().optional(),
  existingLogId: z.string().optional(), // If updating, the ID of the log to replace
  performedAt: z.string().datetime().optional(),
  notes: z.string().optional(),
  feeling: z.number().int().min(1).max(5).optional(),
  perceivedEffort: z.number().int().min(1).max(10).optional(),
  blockResults: z.array(createBlockResultSchema),
});

// ============================================================================
// Helper: Convert weight to KG
// ============================================================================

function convertToKg(weight: number, unit: WeightUnit): number {
  if (unit === "KG") return weight;
  return weight / 2.20462; // LB to KG
}

// ============================================================================
// GET /api/workouts/logs - List user's workout logs
// ============================================================================

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workoutId = searchParams.get("workoutId");
    const cursor = searchParams.get("cursor");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 50);

    const logs = await prisma.workoutLog.findMany({
      where: {
        userId: user.id,
        ...(workoutId && { workoutId }),
      },
      include: {
        workout: {
          select: {
            id: true,
            name: true,
          },
        },
        session: {
          select: {
            id: true,
            title: true,
          },
        },
        blockResults: {
          include: {
            block: {
              select: {
                id: true,
                type: true,
                name: true,
              },
            },
            exerciseResults: {
              include: {
                exercise: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                blockExercise: {
                  select: {
                    id: true,
                    prescribedReps: true,
                    prescribedWeight: true,
                    prescribedWeightUnit: true,
                  },
                },
                sets: {
                  orderBy: { setNumber: "asc" },
                },
              },
            },
          },
        },
      },
      orderBy: { performedAt: "desc" },
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    });

    const hasMore = logs.length > limit;
    const items = hasMore ? logs.slice(0, -1) : logs;
    const nextCursor = hasMore ? items[items.length - 1]?.id : null;

    return NextResponse.json({
      items,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error("Error listing workout logs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ============================================================================
// Helpers: Existing-log cleanup & performance tracking
// ============================================================================

async function deleteExistingLog(userId: string, logId: string): Promise<void> {
  const existingLog = await prisma.workoutLog.findFirst({
    where: { id: logId, userId },
  });
  if (!existingLog) return;

  await prisma.userPerformanceEntry.deleteMany({
    where: {
      userId,
      OR: [
        {
          workoutExerciseSet: {
            exerciseResult: { blockResult: { logId: existingLog.id } },
          },
        },
        {
          workoutExerciseResult: {
            blockResult: { logId: existingLog.id },
          },
        },
      ],
    },
  });

  await prisma.workoutLog.delete({ where: { id: existingLog.id } });
}

interface StrengthEntryResult {
  entryId: string;
  isPR: boolean;
}

async function processStrengthEntry(
  userId: string,
  exerciseId: string,
  weightKg: number,
  reps: number,
  performedAt: Date,
  setId?: string,
  exerciseResultId?: string
): Promise<StrengthEntryResult> {
  const history = await prisma.userPerformanceEntry.findMany({
    where: {
      userId,
      type: "STRENGTH",
      exerciseId,
      performedAt: {
        gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      },
    },
    select: { weightKg: true, reps: true, performedAt: true },
  });

  const scores = computeStrengthScores(
    { weightKg, reps, performedAt },
    history.map((h) => ({
      weightKg: h.weightKg ?? 0,
      reps: h.reps ?? 0,
      performedAt: h.performedAt,
    }))
  );

  const currentE1rm = weightKg * (1 + reps / 30);
  const bestHistoricalE1rm = history.reduce((best, h) => {
    if (!h.weightKg || !h.reps) return best;
    const e1rm = h.weightKg * (1 + h.reps / 30);
    return Math.max(best, e1rm);
  }, 0);

  const isPR = history.length > 0 && currentE1rm > bestHistoricalE1rm;

  const entry = await prisma.userPerformanceEntry.create({
    data: {
      userId,
      type: "STRENGTH",
      exerciseId,
      weightKg,
      reps,
      performedAt,
      qualityScore: scores.qualityScore,
      predictionWeight: scores.predictionWeight,
      ...(setId && { workoutExerciseSetId: setId }),
      ...(exerciseResultId && { workoutExerciseResultId: exerciseResultId }),
    },
  });

  return { entryId: entry.id, isPR };
}

interface PerformanceExercise {
  id: string;
  exerciseId: string;
  exercise: { name: string; hasWeight: boolean };
  actualWeight: number | null;
  actualWeightUnit: WeightUnit | null;
  actualReps: number | null;
  sets: Array<{
    id: string;
    weight: number;
    weightUnit: WeightUnit;
    reps: number;
  }>;
}

interface PerformanceTrackingResult {
  entries: string[];
  prs: Array<{ exerciseName: string; weight: number; reps: number }>;
}

async function processExercisePerformance(
  userId: string,
  er: PerformanceExercise,
  performedAt: Date
): Promise<PerformanceTrackingResult> {
  const entries: string[] = [];
  const prs: PerformanceTrackingResult["prs"] = [];

  if (!er.exercise.hasWeight) return { entries, prs };

  if (er.sets.length > 0) {
    for (const set of er.sets) {
      const weightKg = convertToKg(set.weight, set.weightUnit);
      const result = await processStrengthEntry(
        userId,
        er.exerciseId,
        weightKg,
        set.reps,
        performedAt,
        set.id
      );
      entries.push(result.entryId);
      if (result.isPR) {
        prs.push({
          exerciseName: er.exercise.name,
          weight: set.weight,
          reps: set.reps,
        });
        await prisma.workoutExerciseSet.update({
          where: { id: set.id },
          data: { isPR: true },
        });
      }
    }
  } else if (er.actualWeight && er.actualReps) {
    const weightKg = convertToKg(er.actualWeight, er.actualWeightUnit || "KG");
    const result = await processStrengthEntry(
      userId,
      er.exerciseId,
      weightKg,
      er.actualReps,
      performedAt,
      undefined,
      er.id
    );
    entries.push(result.entryId);
    if (result.isPR) {
      prs.push({
        exerciseName: er.exercise.name,
        weight: er.actualWeight,
        reps: er.actualReps,
      });
      await prisma.workoutExerciseResult.update({
        where: { id: er.id },
        data: { isPR: true },
      });
    }
  }

  return { entries, prs };
}

async function trackStrengthPerformance(
  userId: string,
  blockResults: Array<{ exerciseResults: PerformanceExercise[] }>,
  performedAt: Date
): Promise<PerformanceTrackingResult> {
  const entries: string[] = [];
  const prs: PerformanceTrackingResult["prs"] = [];

  for (const blockResult of blockResults) {
    for (const er of blockResult.exerciseResults) {
      const result = await processExercisePerformance(userId, er, performedAt);
      entries.push(...result.entries);
      prs.push(...result.prs);
    }
  }

  return { entries, prs };
}

// ============================================================================
// POST /api/workouts/logs - Create workout log with performance integration
// ============================================================================

export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = createLogSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const performedAt = data.performedAt
      ? new Date(data.performedAt)
      : new Date();

    // Verify workout exists
    const workout = await prisma.workout.findUnique({
      where: { id: data.workoutId },
    });

    if (!workout) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    // If sessionId provided, verify session exists
    if (data.sessionId) {
      const venueSession = await prisma.venueSession.findUnique({
        where: { id: data.sessionId },
      });

      if (!venueSession) {
        return NextResponse.json(
          { error: "Session not found" },
          { status: 404 }
        );
      }
    }

    // If updating an existing log, delete the old one first (cascade deletes related data)
    if (data.existingLogId) {
      await deleteExistingLog(user.id, data.existingLogId);
    }

    // Create workout log with all nested data
    const log = await prisma.workoutLog.create({
      data: {
        userId: user.id,
        workoutId: data.workoutId,
        sessionId: data.sessionId,
        performedAt,
        notes: data.notes,
        feeling: data.feeling,
        perceivedEffort: data.perceivedEffort,
        blockResults: {
          create: data.blockResults.map((blockResult) => ({
            blockId: blockResult.blockId,
            completedRounds: blockResult.completedRounds,
            extraReps: blockResult.extraReps,
            completedTime: blockResult.completedTime,
            completedInTime: blockResult.completedInTime,
            notes: blockResult.notes,
            exerciseResults: {
              create: blockResult.exerciseResults.map((exerciseResult) => ({
                blockExerciseId: exerciseResult.blockExerciseId,
                exerciseId: exerciseResult.exerciseId,
                actualReps: exerciseResult.actualReps,
                actualWeight: exerciseResult.actualWeight,
                actualWeightUnit: exerciseResult.actualWeightUnit,
                actualDistance: exerciseResult.actualDistance,
                actualDistanceUnit: exerciseResult.actualDistanceUnit,
                actualTime: exerciseResult.actualTime,
                actualCalories: exerciseResult.actualCalories,
                notes: exerciseResult.notes,
                sets: exerciseResult.sets
                  ? {
                      create: exerciseResult.sets.map((set) => ({
                        setNumber: set.setNumber,
                        reps: set.reps,
                        weight: set.weight,
                        weightUnit: set.weightUnit,
                        notes: set.notes,
                      })),
                    }
                  : undefined,
              })),
            },
          })),
        },
      },
      include: {
        workout: {
          select: {
            id: true,
            name: true,
          },
        },
        blockResults: {
          include: {
            block: {
              select: {
                id: true,
                type: true,
                name: true,
              },
            },
            exerciseResults: {
              include: {
                exercise: {
                  select: {
                    id: true,
                    name: true,
                    hasWeight: true,
                  },
                },
                sets: {
                  orderBy: { setNumber: "asc" },
                },
              },
            },
          },
        },
      },
    });

    // Performance tracking for strength exercises
    const { entries: performanceEntries, prs: prsDetected } =
      await trackStrengthPerformance(user.id, log.blockResults, performedAt);

    // Calculate and persist Workout Score (fire-and-forget; don't block response)
    let workoutScore: { totalScore: number } | null = null;
    try {
      const scoreResult = await computeAndPersistWorkoutScore(log.id, user.id);
      if (scoreResult) {
        workoutScore = { totalScore: Math.round(scoreResult.totalScore) };
      }
    } catch (scoreError) {
      console.error("Error computing workout score:", scoreError);
    }

    return NextResponse.json(
      {
        log,
        performanceEntriesCreated: performanceEntries.length,
        prsDetected,
        workoutScore,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating workout log:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
