import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { WorkoutBlockType, WeightUnit, DistanceUnit } from "@prisma/client";
import {
  validateExercisesExist,
  deleteExistingBlocksAndResults,
  createWorkoutBlocks,
  workoutFullInclude,
} from "@/lib/workout-helpers";

// ============================================================================
// Validation Schema for Update
// ============================================================================

const updateSetPrescriptionSchema = z.object({
  setNumber: z.number().int().positive(),
  // Male/Rx
  reps: z.number().int().positive().optional(),
  weight: z.number().positive().optional(),
  weightUnit: z.nativeEnum(WeightUnit).optional(),
  weightPercent: z.number().min(0).max(200).optional(),
  time: z.number().int().positive().optional(),
  distance: z.number().positive().optional(),
  distanceUnit: z.nativeEnum(DistanceUnit).optional(),
  calories: z.number().int().positive().optional(),
  // Female (optional)
  repsFemale: z.number().int().positive().optional(),
  weightFemale: z.number().positive().optional(),
  weightUnitFemale: z.nativeEnum(WeightUnit).optional(),
  weightPercentFemale: z.number().min(0).max(200).optional(),
  timeFemale: z.number().int().positive().optional(),
  distanceFemale: z.number().positive().optional(),
  distanceUnitFemale: z.nativeEnum(DistanceUnit).optional(),
  caloriesFemale: z.number().int().positive().optional(),
  notes: z.string().optional(),
});

// Schema for exercises within a group (simpler - no set prescriptions)
const updateGroupExerciseSchema = z.object({
  id: z.string().optional(),
  exerciseId: z.string().min(1),
  orderIndex: z.number().int().min(0).optional(),
  prescribedReps: z.number().int().positive().optional().nullable(),
  prescribedWeight: z.number().positive().optional().nullable(),
  prescribedWeightUnit: z.nativeEnum(WeightUnit).optional().nullable(),
  prescribedWeightPercent: z.number().min(0).max(200).optional().nullable(),
  prescribedDistance: z.number().positive().optional().nullable(),
  prescribedDistanceUnit: z.nativeEnum(DistanceUnit).optional().nullable(),
  prescribedTime: z.number().int().positive().optional().nullable(),
  prescribedCalories: z.number().int().positive().optional().nullable(),
  prescribedSets: z.number().int().positive().optional().nullable(),
  // Female
  prescribedRepsFemale: z.number().int().positive().optional().nullable(),
  prescribedWeightFemale: z.number().positive().optional().nullable(),
  prescribedWeightUnitFemale: z.nativeEnum(WeightUnit).optional().nullable(),
  prescribedWeightPercentFemale: z
    .number()
    .min(0)
    .max(200)
    .optional()
    .nullable(),
  prescribedDistanceFemale: z.number().positive().optional().nullable(),
  prescribedDistanceUnitFemale: z
    .nativeEnum(DistanceUnit)
    .optional()
    .nullable(),
  prescribedTimeFemale: z.number().int().positive().optional().nullable(),
  prescribedCaloriesFemale: z.number().int().positive().optional().nullable(),
  prescribedSetsFemale: z.number().int().positive().optional().nullable(),
  notes: z.string().optional().nullable(),
});

// Schema for exercise groups within a block
const updateExerciseGroupSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  orderIndex: z.number().int().min(0),
  rounds: z.number().int().positive().default(1),
  restBetweenRounds: z.number().int().positive().optional().nullable(),
  notes: z.string().optional().nullable(),
  exercises: z.array(updateGroupExerciseSchema),
});

const updateExerciseSchema = z.object({
  id: z.string().optional(), // Existing exercise ID
  exerciseId: z.string().min(1),
  orderIndex: z.number().int().min(0),
  // Male/Rx
  prescribedReps: z.number().int().positive().optional().nullable(),
  prescribedWeight: z.number().positive().optional().nullable(),
  prescribedWeightUnit: z.nativeEnum(WeightUnit).optional().nullable(),
  prescribedWeightPercent: z.number().min(0).max(200).optional().nullable(),
  prescribedDistance: z.number().positive().optional().nullable(),
  prescribedDistanceUnit: z.nativeEnum(DistanceUnit).optional().nullable(),
  prescribedTime: z.number().int().positive().optional().nullable(),
  prescribedCalories: z.number().int().positive().optional().nullable(),
  prescribedSets: z.number().int().positive().optional().nullable(),
  // Female (optional)
  prescribedRepsFemale: z.number().int().positive().optional().nullable(),
  prescribedWeightFemale: z.number().positive().optional().nullable(),
  prescribedWeightUnitFemale: z.nativeEnum(WeightUnit).optional().nullable(),
  prescribedWeightPercentFemale: z
    .number()
    .min(0)
    .max(200)
    .optional()
    .nullable(),
  prescribedDistanceFemale: z.number().positive().optional().nullable(),
  prescribedDistanceUnitFemale: z
    .nativeEnum(DistanceUnit)
    .optional()
    .nullable(),
  prescribedTimeFemale: z.number().int().positive().optional().nullable(),
  prescribedCaloriesFemale: z.number().int().positive().optional().nullable(),
  prescribedSetsFemale: z.number().int().positive().optional().nullable(),
  notes: z.string().optional().nullable(),
  setPrescriptions: z.array(updateSetPrescriptionSchema).optional(),
});

const updateBlockSchema = z.object({
  id: z.string().optional(), // Existing block ID
  type: z.nativeEnum(WorkoutBlockType),
  name: z.string().optional().nullable(),
  orderIndex: z.number().int().min(0),
  timeCap: z.number().int().positive().optional().nullable(),
  workTime: z.number().int().positive().optional().nullable(),
  rounds: z.number().int().positive().optional().nullable(),
  notes: z.string().optional().nullable(),
  exercises: z.array(updateExerciseSchema),
  exerciseGroups: z.array(updateExerciseGroupSchema).optional(),
});

const updateWorkoutSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  estimatedTime: z.number().int().positive().optional().nullable(),
  difficulty: z.number().int().min(1).max(5).optional().nullable(),
  tags: z.array(z.string()).optional(),
  isTemplate: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  blocks: z.array(updateBlockSchema).optional(),
});

// ============================================================================
// GET /api/workouts/[id] - Get single workout
// ============================================================================

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    const { id } = await params;

    const workout = await prisma.workout.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        venue: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        blocks: {
          orderBy: { orderIndex: "asc" },
          include: {
            exerciseGroups: {
              orderBy: { orderIndex: "asc" },
              include: {
                exercises: {
                  orderBy: { orderIndex: "asc" },
                  include: {
                    exercise: {
                      select: {
                        id: true,
                        name: true,
                        category: true,
                        hasReps: true,
                        hasWeight: true,
                        hasDistance: true,
                        hasTime: true,
                        hasCalories: true,
                        hasHeight: true,
                      },
                    },
                  },
                },
              },
            },
            exercises: {
              orderBy: { orderIndex: "asc" },
              include: {
                exercise: {
                  select: {
                    id: true,
                    name: true,
                    category: true,
                    hasReps: true,
                    hasWeight: true,
                    hasDistance: true,
                    hasTime: true,
                    hasCalories: true,
                    hasHeight: true,
                  },
                },
                setPrescriptions: {
                  orderBy: { setNumber: "asc" },
                },
              },
            },
          },
        },
        _count: {
          select: {
            logs: true,
          },
        },
      },
    });

    if (!workout) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    // Check access: owner, public, or venue member
    const canAccess =
      workout.isPublic ||
      workout.createdById === user?.id ||
      (workout.venueId &&
        user?.id &&
        (await prisma.venueMember.findUnique({
          where: {
            venueId_userId: {
              venueId: workout.venueId,
              userId: user.id,
            },
          },
        })));

    if (!canAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(workout);
  } catch (error) {
    console.error("Error fetching workout:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ============================================================================
// PATCH /api/workouts/[id] - Update workout
// ============================================================================

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get existing workout
    const existingWorkout = await prisma.workout.findUnique({
      where: { id },
      include: {
        blocks: {
          include: {
            exercises: true,
          },
        },
      },
    });

    if (!existingWorkout) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    // Check permission: only creator can edit
    if (existingWorkout.createdById !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validationResult = updateWorkoutSchema.safeParse(body);

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

    // If blocks are being updated, handle complex update
    if (data.blocks) {
      const missingIds = await validateExercisesExist(data.blocks);
      if (missingIds.length > 0) {
        return NextResponse.json(
          { error: "Some exercises not found", missingIds },
          { status: 400 }
        );
      }

      await deleteExistingBlocksAndResults(id);

      await prisma.workout.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          estimatedTime: data.estimatedTime,
          difficulty: data.difficulty,
          tags: data.tags,
          isTemplate: data.isTemplate,
          isPublic: data.isPublic,
        },
      });

      await createWorkoutBlocks(id, data.blocks);

      const workout = await prisma.workout.findUnique({
        where: { id },
        include: workoutFullInclude,
      });

      return NextResponse.json(workout);
    }

    // Simple update without blocks
    const workout = await prisma.workout.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        estimatedTime: data.estimatedTime,
        difficulty: data.difficulty,
        tags: data.tags,
        isTemplate: data.isTemplate,
        isPublic: data.isPublic,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        venue: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        blocks: {
          orderBy: { orderIndex: "asc" },
          include: {
            exercises: {
              orderBy: { orderIndex: "asc" },
              include: {
                exercise: {
                  select: {
                    id: true,
                    name: true,
                    category: true,
                  },
                },
                setPrescriptions: {
                  orderBy: { setNumber: "asc" },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(workout);
  } catch (error) {
    console.error("Error updating workout:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE /api/workouts/[id] - Delete workout
// ============================================================================

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const workout = await prisma.workout.findUnique({
      where: { id },
      select: { createdById: true },
    });

    if (!workout) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    if (workout.createdById !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.workout.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting workout:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
