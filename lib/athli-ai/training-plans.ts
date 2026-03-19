/**
 * Athli AI — Training plan creation and exercise resolution helpers
 */

import { prisma } from "@/lib/prisma";

export interface PlanExerciseInput {
  name: string;
  reps?: number;
  weight?: number;
  weightUnit?: string;
  distance?: number;
  distanceUnit?: string;
  time?: number; // seconds
  calories?: number;
  sets?: number;
  notes?: string;
}

export interface PlanBlockInput {
  type: string; // WARMUP, STRENGTH, AMRAP, EMOM, FOR_TIME, TABATA, CHIPPER, COOLDOWN, SKILL, REST
  name?: string;
  rounds?: number;
  timeCap?: number; // seconds
  workTime?: number; // seconds (for EMOM)
  notes?: string;
  exercises: PlanExerciseInput[];
}

interface PlanWorkoutInput {
  name: string;
  description?: string;
  dayOfWeek: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  estimatedTime?: number; // minutes
  blocks: PlanBlockInput[];
}

interface PlanWeekInput {
  weekNumber: number;
  name?: string;
  description?: string;
  workouts: PlanWorkoutInput[];
}

export interface SaveTrainingPlanParams {
  name: string;
  description: string;
  duration: number;
  difficulty: number;
  category: string;
  targetAudience: string;
  goals: string[];
  weeks: PlanWeekInput[];
}

/**
 * List available exercises from the database, optionally filtered by category.
 */
export async function listAvailableExercises(
  category?: string
): Promise<string> {
  const where: Record<string, unknown> = {};
  if (category) {
    where.category = category.toUpperCase();
  }

  const exercises = await prisma.exercise.findMany({
    where,
    select: {
      id: true,
      name: true,
      category: true,
    },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return JSON.stringify({
    total: exercises.length,
    exercises: exercises.map((e) => ({
      id: e.id,
      name: e.name,
      category: e.category,
    })),
  });
}

/**
 * Find an exercise by name in the database.
 * Returns the exercise ID or null if not found.
 * NEVER creates new exercises - only uses existing ones from the database.
 */
export async function findExercise(name: string): Promise<string | null> {
  const normalizedName = name.trim().replaceAll(/\s+/g, " ");

  // 1. Exact match (case-insensitive) or alias match
  const exact = await prisma.exercise.findFirst({
    where: {
      OR: [
        { name: { equals: normalizedName, mode: "insensitive" } },
        { aliases: { has: normalizedName } },
      ],
    },
    select: { id: true },
  });

  if (exact) return exact.id;

  // 2. Contains fallback — only accept if exactly one match to avoid ambiguity
  const containsMatches = await prisma.exercise.findMany({
    where: {
      name: { contains: normalizedName, mode: "insensitive" },
    },
    select: { id: true },
    take: 2,
  });

  if (containsMatches.length === 1) return containsMatches[0].id;

  return null;
}

/**
 * Map block type string to WorkoutBlockType enum.
 */
export function mapBlockType(
  type: string
):
  | "WARMUP"
  | "STRENGTH"
  | "AMRAP"
  | "EMOM"
  | "FOR_TIME"
  | "TABATA"
  | "CHIPPER"
  | "REST"
  | "COOLDOWN"
  | "SKILL" {
  const mapping: Record<
    string,
    | "WARMUP"
    | "STRENGTH"
    | "AMRAP"
    | "EMOM"
    | "FOR_TIME"
    | "TABATA"
    | "CHIPPER"
    | "REST"
    | "COOLDOWN"
    | "SKILL"
  > = {
    WARMUP: "WARMUP",
    STRENGTH: "STRENGTH",
    AMRAP: "AMRAP",
    EMOM: "EMOM",
    FOR_TIME: "FOR_TIME",
    TABATA: "TABATA",
    CHIPPER: "CHIPPER",
    REST: "REST",
    COOLDOWN: "COOLDOWN",
    SKILL: "SKILL",
  };
  return mapping[type.toUpperCase()] || "FOR_TIME";
}

export function resolveWeightUnit(
  exInput: PlanExerciseInput
): "LB" | "KG" | undefined {
  if (exInput.weightUnit === "LB") return "LB";
  return exInput.weight ? "KG" : undefined;
}

export function resolveDistanceUnit(
  exInput: PlanExerciseInput
): "MI" | "M" | "KM" | undefined {
  if (exInput.distanceUnit === "MI") return "MI";
  if (exInput.distanceUnit === "M") return "M";
  return exInput.distance ? "KM" : undefined;
}

export async function resolveAndCreateBlock(
  workoutId: string,
  blockInput: PlanBlockInput,
  startOrderIndex: number
): Promise<{ created: boolean; exerciseCount: number }> {
  const resolvedExercises: Array<{
    input: PlanExerciseInput;
    exerciseId: string;
  }> = [];

  for (const exInput of blockInput.exercises) {
    const exerciseId = await findExercise(exInput.name);

    if (!exerciseId) {
      console.warn(
        `[Athli] Skipping unknown exercise: "${exInput.name}" — not found in database`
      );
      continue;
    }

    resolvedExercises.push({ input: exInput, exerciseId });
  }

  if (
    resolvedExercises.length === 0 &&
    blockInput.type.toUpperCase() !== "REST"
  ) {
    console.warn(
      `[Athli] Skipping empty block "${blockInput.name || blockInput.type}" — no exercises matched`
    );
    return { created: false, exerciseCount: 0 };
  }

  const block = await prisma.workoutBlock.create({
    data: {
      workoutId,
      type: mapBlockType(blockInput.type),
      name: blockInput.name,
      orderIndex: startOrderIndex,
      rounds: blockInput.rounds,
      timeCap: blockInput.timeCap,
      workTime: blockInput.workTime,
      notes: blockInput.notes,
    },
  });

  for (let ei = 0; ei < resolvedExercises.length; ei++) {
    const { input: exInput, exerciseId } = resolvedExercises[ei];

    await prisma.workoutBlockExercise.create({
      data: {
        blockId: block.id,
        exerciseId,
        orderIndex: ei,
        prescribedReps: exInput.reps,
        prescribedWeight: exInput.weight,
        prescribedWeightUnit: resolveWeightUnit(exInput),
        prescribedDistance: exInput.distance,
        prescribedDistanceUnit: resolveDistanceUnit(exInput),
        prescribedTime: exInput.time,
        prescribedCalories: exInput.calories,
        prescribedSets: exInput.sets,
        notes: exInput.notes,
      },
    });
  }

  return { created: true, exerciseCount: resolvedExercises.length };
}

export async function saveTrainingPlan(
  params: SaveTrainingPlanParams,
  userId: string
): Promise<string> {
  // 1. Create the TrainingPlan
  const plan = await prisma.trainingPlan.create({
    data: {
      name: params.name,
      description: params.description,
      duration: params.duration,
      difficulty: params.difficulty,
      category: params.category,
      targetAudience: params.targetAudience,
      goals: params.goals,
      isPublic: false,
      isTemplate: false,
      createdById: userId,
    },
  });

  let totalWorkouts = 0;

  // 2. Create weeks with workouts
  for (const weekInput of params.weeks) {
    const week = await prisma.trainingPlanWeek.create({
      data: {
        planId: plan.id,
        weekNumber: weekInput.weekNumber,
        name: weekInput.name || `Semana ${weekInput.weekNumber}`,
        description: weekInput.description,
        orderIndex: weekInput.weekNumber - 1,
      },
    });

    // 3. Create workouts for this week
    for (let wi = 0; wi < weekInput.workouts.length; wi++) {
      const workoutInput = weekInput.workouts[wi];

      // Create the Workout
      const workout = await prisma.workout.create({
        data: {
          name: workoutInput.name,
          description: workoutInput.description,
          createdById: userId,
          estimatedTime: workoutInput.estimatedTime,
          difficulty: params.difficulty,
          tags: [params.category.toLowerCase()],
          isTemplate: false,
          isPublic: false,
        },
      });

      // 4. Create blocks for this workout
      let blockOrderIndex = 0;
      for (const block of workoutInput.blocks) {
        const result = await resolveAndCreateBlock(
          workout.id,
          block,
          blockOrderIndex
        );
        if (result.created) {
          blockOrderIndex++;
        }
      }

      // 6. Link workout to week
      await prisma.trainingPlanWorkout.create({
        data: {
          weekId: week.id,
          workoutId: workout.id,
          dayOfWeek: workoutInput.dayOfWeek,
          orderIndex: wi,
        },
      });

      totalWorkouts++;
    }
  }

  // 7. Assign plan to user
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + params.duration * 7);

  await prisma.userTrainingPlan.create({
    data: {
      userId,
      planId: plan.id,
      startDate,
      endDate,
      status: "ACTIVE",
    },
  });

  return JSON.stringify({
    id: plan.id,
    name: plan.name,
    duration: params.duration,
    difficulty: params.difficulty,
    category: params.category,
    goals: params.goals,
    totalWeeks: params.weeks.length,
    totalWorkouts,
    url: `/workouts/plans/${plan.id}`,
  });
}
