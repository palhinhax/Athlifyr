import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { WorkoutBlockType, WeightUnit, DistanceUnit } from "@prisma/client";

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
    const session = await auth();
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
      workout.createdById === session?.user?.id ||
      (workout.venueId &&
        session?.user?.id &&
        (await prisma.venueMember.findUnique({
          where: {
            venueId_userId: {
              venueId: workout.venueId,
              userId: session.user.id,
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
    const session = await auth();

    if (!session?.user?.id) {
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
    if (existingWorkout.createdById !== session.user.id) {
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
      // Verify all exercises exist
      const exerciseIds = data.blocks.flatMap((b) =>
        b.exercises.map((e) => e.exerciseId)
      );
      const uniqueExerciseIds = [...new Set(exerciseIds)];

      if (uniqueExerciseIds.length > 0) {
        const exercises = await prisma.exercise.findMany({
          where: { id: { in: uniqueExerciseIds } },
          select: { id: true },
        });

        const foundIds = new Set(exercises.map((e) => e.id));
        const missingIds = uniqueExerciseIds.filter((id) => !foundIds.has(id));

        if (missingIds.length > 0) {
          return NextResponse.json(
            { error: "Some exercises not found", missingIds },
            { status: 400 }
          );
        }
      }

      // Find all blocks and block exercises for this workout
      const blocks = await prisma.workoutBlock.findMany({
        where: { workoutId: id },
        select: {
          id: true,
          exercises: {
            select: { id: true },
          },
        },
      });
      const blockIds = blocks.map((b) => b.id);
      const blockExerciseIds = blocks.flatMap((b) =>
        b.exercises.map((e) => e.id)
      );

      // Delete related results to avoid FK violations
      if (blockExerciseIds.length > 0) {
        // Delete WorkoutExerciseResult (references blockExerciseId without cascade)
        await prisma.workoutExerciseResult.deleteMany({
          where: { blockExerciseId: { in: blockExerciseIds } },
        });
      }

      if (blockIds.length > 0) {
        // Delete WorkoutBlockResult (references blockId without cascade)
        await prisma.workoutBlockResult.deleteMany({
          where: { blockId: { in: blockIds } },
        });
      }

      // Delete existing blocks (cascade deletes exercises)
      await prisma.workoutBlock.deleteMany({
        where: { workoutId: id },
      });

      // Update workout metadata first
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

      // Create blocks with exercises and groups
      for (const blockData of data.blocks) {
        // Create the block
        const createdBlock = await prisma.workoutBlock.create({
          data: {
            workoutId: id,
            type: blockData.type,
            name: blockData.name,
            orderIndex: blockData.orderIndex,
            timeCap: blockData.timeCap,
            workTime: blockData.workTime,
            rounds: blockData.rounds,
            notes: blockData.notes,
          },
        });

        // Create standalone exercises (not in a group)
        for (const exercise of blockData.exercises) {
          await prisma.workoutBlockExercise.create({
            data: {
              blockId: createdBlock.id,
              exerciseId: exercise.exerciseId,
              orderIndex: exercise.orderIndex,
              // Male/Rx
              prescribedReps: exercise.prescribedReps,
              prescribedWeight: exercise.prescribedWeight,
              prescribedWeightUnit: exercise.prescribedWeightUnit,
              prescribedWeightPercent: exercise.prescribedWeightPercent,
              prescribedDistance: exercise.prescribedDistance,
              prescribedDistanceUnit: exercise.prescribedDistanceUnit,
              prescribedTime: exercise.prescribedTime,
              prescribedCalories: exercise.prescribedCalories,
              prescribedSets: exercise.prescribedSets,
              // Female (optional)
              prescribedRepsFemale: exercise.prescribedRepsFemale,
              prescribedWeightFemale: exercise.prescribedWeightFemale,
              prescribedWeightUnitFemale: exercise.prescribedWeightUnitFemale,
              prescribedWeightPercentFemale:
                exercise.prescribedWeightPercentFemale,
              prescribedDistanceFemale: exercise.prescribedDistanceFemale,
              prescribedDistanceUnitFemale:
                exercise.prescribedDistanceUnitFemale,
              prescribedTimeFemale: exercise.prescribedTimeFemale,
              prescribedCaloriesFemale: exercise.prescribedCaloriesFemale,
              prescribedSetsFemale: exercise.prescribedSetsFemale,
              notes: exercise.notes,
              // Set prescriptions
              ...(exercise.setPrescriptions &&
              exercise.setPrescriptions.length > 0
                ? {
                    setPrescriptions: {
                      create: exercise.setPrescriptions.map((sp) => ({
                        setNumber: sp.setNumber,
                        reps: sp.reps,
                        weight: sp.weight,
                        weightUnit: sp.weightUnit,
                        weightPercent: sp.weightPercent,
                        time: sp.time,
                        distance: sp.distance,
                        distanceUnit: sp.distanceUnit,
                        calories: sp.calories,
                        repsFemale: sp.repsFemale,
                        weightFemale: sp.weightFemale,
                        weightUnitFemale: sp.weightUnitFemale,
                        weightPercentFemale: sp.weightPercentFemale,
                        timeFemale: sp.timeFemale,
                        distanceFemale: sp.distanceFemale,
                        distanceUnitFemale: sp.distanceUnitFemale,
                        caloriesFemale: sp.caloriesFemale,
                        notes: sp.notes,
                      })),
                    },
                  }
                : {}),
            },
          });
        }

        // Create exercise groups (if any)
        if (blockData.exerciseGroups && blockData.exerciseGroups.length > 0) {
          for (const groupData of blockData.exerciseGroups) {
            // Create the group
            const createdGroup = await prisma.exerciseGroup.create({
              data: {
                blockId: createdBlock.id,
                name: groupData.name,
                orderIndex: groupData.orderIndex,
                rounds: groupData.rounds,
                restBetweenRounds: groupData.restBetweenRounds,
                notes: groupData.notes,
              },
            });

            // Create exercises within the group
            for (let idx = 0; idx < groupData.exercises.length; idx++) {
              const ex = groupData.exercises[idx];
              await prisma.workoutBlockExercise.create({
                data: {
                  blockId: createdBlock.id,
                  groupId: createdGroup.id,
                  exerciseId: ex.exerciseId,
                  orderIndex: ex.orderIndex ?? idx,
                  prescribedReps: ex.prescribedReps,
                  prescribedWeight: ex.prescribedWeight,
                  prescribedWeightUnit: ex.prescribedWeightUnit,
                  prescribedWeightPercent: ex.prescribedWeightPercent,
                  prescribedDistance: ex.prescribedDistance,
                  prescribedDistanceUnit: ex.prescribedDistanceUnit,
                  prescribedTime: ex.prescribedTime,
                  prescribedCalories: ex.prescribedCalories,
                  prescribedSets: ex.prescribedSets,
                  prescribedRepsFemale: ex.prescribedRepsFemale,
                  prescribedWeightFemale: ex.prescribedWeightFemale,
                  prescribedWeightUnitFemale: ex.prescribedWeightUnitFemale,
                  prescribedWeightPercentFemale:
                    ex.prescribedWeightPercentFemale,
                  prescribedDistanceFemale: ex.prescribedDistanceFemale,
                  prescribedDistanceUnitFemale: ex.prescribedDistanceUnitFemale,
                  prescribedTimeFemale: ex.prescribedTimeFemale,
                  prescribedCaloriesFemale: ex.prescribedCaloriesFemale,
                  prescribedSetsFemale: ex.prescribedSetsFemale,
                  notes: ex.notes,
                },
              });
            }
          }
        }
      }

      // Fetch the complete updated workout
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
    const session = await auth();

    if (!session?.user?.id) {
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

    if (workout.createdById !== session.user.id) {
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
