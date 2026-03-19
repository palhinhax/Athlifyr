/**
 * Athli AI — Save single workout
 */

import { prisma } from "@/lib/prisma";
import type { PlanBlockInput } from "./training-plans";
import { resolveAndCreateBlock } from "./training-plans";

export type WorkoutBlockInput = PlanBlockInput;

export interface SaveWorkoutParams {
  name: string;
  description?: string;
  estimatedTime?: number;
  difficulty?: number;
  tags?: string[];
  blocks: WorkoutBlockInput[];
}

export async function saveWorkout(
  params: SaveWorkoutParams,
  userId: string
): Promise<string> {
  // 1. Create the Workout
  const workout = await prisma.workout.create({
    data: {
      name: params.name,
      description: params.description,
      createdById: userId,
      estimatedTime: params.estimatedTime,
      difficulty: params.difficulty,
      tags: params.tags || [],
      isTemplate: false,
      isPublic: false,
    },
  });

  // 2. Create blocks (skip blocks where no exercises could be resolved)
  let totalExercises = 0;
  let blockOrderIndex = 0;

  for (const block of params.blocks) {
    const result = await resolveAndCreateBlock(
      workout.id,
      block,
      blockOrderIndex
    );
    if (result.created) {
      blockOrderIndex++;
    }
    totalExercises += result.exerciseCount;
  }

  // If no exercises were added and no blocks were created, clean up and return error.
  // Both checks are needed: REST blocks increment blockOrderIndex without exercises.
  if (totalExercises === 0 && blockOrderIndex === 0) {
    await prisma.workout.delete({ where: { id: workout.id } });
    return JSON.stringify({
      error: true,
      message:
        "No exercises could be matched to the database. Please call list_available_exercises first and use exact exercise names.",
    });
  }

  // 4. Save to user's workouts
  await prisma.savedWorkout.create({
    data: {
      userId,
      workoutId: workout.id,
    },
  });

  return JSON.stringify({
    id: workout.id,
    name: workout.name,
    estimatedTime: workout.estimatedTime,
    difficulty: workout.difficulty,
    totalBlocks: blockOrderIndex,
    url: `/workouts/${workout.id}/run`,
  });
}
