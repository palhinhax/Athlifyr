import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { WorkoutBlockType, WeightUnit, DistanceUnit } from "@prisma/client";

// ============================================================================
// Validation Schema for Update
// ============================================================================

const updateExerciseSchema = z.object({
  id: z.string().optional(), // Existing exercise ID
  exerciseId: z.string().min(1),
  orderIndex: z.number().int().min(0),
  prescribedReps: z.number().int().positive().optional().nullable(),
  prescribedWeight: z.number().positive().optional().nullable(),
  prescribedWeightUnit: z.nativeEnum(WeightUnit).optional().nullable(),
  prescribedWeightPercent: z.number().min(0).max(200).optional().nullable(),
  prescribedDistance: z.number().positive().optional().nullable(),
  prescribedDistanceUnit: z.nativeEnum(DistanceUnit).optional().nullable(),
  prescribedTime: z.number().int().positive().optional().nullable(),
  prescribedCalories: z.number().int().positive().optional().nullable(),
  prescribedSets: z.number().int().positive().optional().nullable(),
  notes: z.string().optional().nullable(),
});

const updateBlockSchema = z.object({
  id: z.string().optional(), // Existing block ID
  type: z.nativeEnum(WorkoutBlockType),
  name: z.string().optional().nullable(),
  orderIndex: z.number().int().min(0),
  timeCap: z.number().int().positive().optional().nullable(),
  workTime: z.number().int().positive().optional().nullable(),
  restTime: z.number().int().positive().optional().nullable(),
  rounds: z.number().int().positive().optional().nullable(),
  notes: z.string().optional().nullable(),
  exercises: z.array(updateExerciseSchema),
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
        const exercises = await prisma.strengthExercise.findMany({
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

      // Delete existing blocks (cascade deletes exercises)
      await prisma.workoutBlock.deleteMany({
        where: { workoutId: id },
      });

      // Update workout with new blocks
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
          blocks: {
            create: data.blocks.map((block) => ({
              type: block.type,
              name: block.name,
              orderIndex: block.orderIndex,
              timeCap: block.timeCap,
              workTime: block.workTime,
              restTime: block.restTime,
              rounds: block.rounds,
              notes: block.notes,
              exercises: {
                create: block.exercises.map((exercise) => ({
                  exerciseId: exercise.exerciseId,
                  orderIndex: exercise.orderIndex,
                  prescribedReps: exercise.prescribedReps,
                  prescribedWeight: exercise.prescribedWeight,
                  prescribedWeightUnit: exercise.prescribedWeightUnit,
                  prescribedWeightPercent: exercise.prescribedWeightPercent,
                  prescribedDistance: exercise.prescribedDistance,
                  prescribedDistanceUnit: exercise.prescribedDistanceUnit,
                  prescribedTime: exercise.prescribedTime,
                  prescribedCalories: exercise.prescribedCalories,
                  prescribedSets: exercise.prescribedSets,
                  notes: exercise.notes,
                })),
              },
            })),
          },
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
