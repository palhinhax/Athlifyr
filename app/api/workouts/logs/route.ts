import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { WeightUnit, DistanceUnit } from "@prisma/client";
import { computeStrengthScores } from "@/lib/performance/scoring";

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
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workoutId = searchParams.get("workoutId");
    const cursor = searchParams.get("cursor");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 50);

    const logs = await prisma.workoutLog.findMany({
      where: {
        userId: session.user.id,
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
// POST /api/workouts/logs - Create workout log with performance integration
// ============================================================================

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
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

    // Create workout log with all nested data
    const log = await prisma.workoutLog.create({
      data: {
        userId: session.user.id,
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

    // ========================================================================
    // PERFORMANCE INTEGRATION: Create performance entries for strength exercises
    // Only exercises with hasWeight:true go to performance tracking
    // PRs are only set when beating historical bests (not lowering)
    // ========================================================================

    const performanceEntries: string[] = [];
    const prsDetected: Array<{
      exerciseName: string;
      weight: number;
      reps: number;
    }> = [];

    for (const blockResult of log.blockResults) {
      for (const exerciseResult of blockResult.exerciseResults) {
        // Skip exercises that don't track weight - they don't go to performance
        if (!exerciseResult.exercise.hasWeight) {
          continue;
        }

        // For exercises with individual sets
        if (exerciseResult.sets.length > 0) {
          for (const set of exerciseResult.sets) {
            const weightKg = convertToKg(set.weight, set.weightUnit);

            // Get historical data for scoring
            const history = await prisma.userPerformanceEntry.findMany({
              where: {
                userId: session.user.id,
                type: "STRENGTH",
                exerciseId: exerciseResult.exerciseId,
                performedAt: {
                  gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
                },
              },
              select: {
                weightKg: true,
                reps: true,
                performedAt: true,
              },
            });

            const scores = computeStrengthScores(
              { weightKg, reps: set.reps, performedAt },
              history.map((h) => ({
                weightKg: h.weightKg ?? 0,
                reps: h.reps ?? 0,
                performedAt: h.performedAt,
              }))
            );

            // Check if this is a PR (best e1RM)
            // PRs are only set when the current performance BEATS the historical best
            // Lower performances don't affect PR status (not every workout is max effort)
            const currentE1rm = weightKg * (1 + set.reps / 30);
            const bestHistoricalE1rm = history.reduce((best, h) => {
              if (!h.weightKg || !h.reps) return best;
              const e1rm = h.weightKg * (1 + h.reps / 30);
              return Math.max(best, e1rm);
            }, 0);

            // Only mark as PR if we beat the previous best (must have history to compare)
            const isPR = history.length > 0 && currentE1rm > bestHistoricalE1rm;

            if (isPR) {
              prsDetected.push({
                exerciseName: exerciseResult.exercise.name,
                weight: set.weight,
                reps: set.reps,
              });

              // Update set as PR
              await prisma.workoutExerciseSet.update({
                where: { id: set.id },
                data: { isPR: true },
              });
            }

            // Create performance entry
            const entry = await prisma.userPerformanceEntry.create({
              data: {
                userId: session.user.id,
                type: "STRENGTH",
                exerciseId: exerciseResult.exerciseId,
                weightKg,
                reps: set.reps,
                performedAt,
                workoutExerciseSetId: set.id,
                qualityScore: scores.qualityScore,
                predictionWeight: scores.predictionWeight,
              },
            });

            performanceEntries.push(entry.id);
          }
        }
        // For exercises without individual sets but with weight/reps
        // hasWeight is already checked above, so we know this exercise tracks weight
        else if (exerciseResult.actualWeight && exerciseResult.actualReps) {
          const weightKg = convertToKg(
            exerciseResult.actualWeight,
            exerciseResult.actualWeightUnit || "KG"
          );

          const history = await prisma.userPerformanceEntry.findMany({
            where: {
              userId: session.user.id,
              type: "STRENGTH",
              exerciseId: exerciseResult.exerciseId,
              performedAt: {
                gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
              },
            },
            select: {
              weightKg: true,
              reps: true,
              performedAt: true,
            },
          });

          const scores = computeStrengthScores(
            { weightKg, reps: exerciseResult.actualReps, performedAt },
            history.map((h) => ({
              weightKg: h.weightKg ?? 0,
              reps: h.reps ?? 0,
              performedAt: h.performedAt,
            }))
          );

          // Check PR - only mark when beating the best, not when lower
          // (not every workout is max effort)
          const currentE1rm = weightKg * (1 + exerciseResult.actualReps / 30);
          const bestHistoricalE1rm = history.reduce((best, h) => {
            if (!h.weightKg || !h.reps) return best;
            const e1rm = h.weightKg * (1 + h.reps / 30);
            return Math.max(best, e1rm);
          }, 0);

          // Only mark as PR if we beat the previous best (must have history to compare)
          const isPR = history.length > 0 && currentE1rm > bestHistoricalE1rm;

          if (isPR) {
            prsDetected.push({
              exerciseName: exerciseResult.exercise.name,
              weight: exerciseResult.actualWeight,
              reps: exerciseResult.actualReps,
            });

            await prisma.workoutExerciseResult.update({
              where: { id: exerciseResult.id },
              data: { isPR: true },
            });
          }

          const entry = await prisma.userPerformanceEntry.create({
            data: {
              userId: session.user.id,
              type: "STRENGTH",
              exerciseId: exerciseResult.exerciseId,
              weightKg,
              reps: exerciseResult.actualReps,
              performedAt,
              workoutExerciseResultId: exerciseResult.id,
              qualityScore: scores.qualityScore,
              predictionWeight: scores.predictionWeight,
            },
          });

          performanceEntries.push(entry.id);
        }
      }
    }

    return NextResponse.json(
      {
        log,
        performanceEntriesCreated: performanceEntries.length,
        prsDetected,
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
