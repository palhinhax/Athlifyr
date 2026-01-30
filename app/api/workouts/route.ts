import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { WorkoutBlockType, WeightUnit, DistanceUnit } from "@prisma/client";

// ============================================================================
// Validation Schemas
// ============================================================================

const setPrescriptionSchema = z.object({
  setNumber: z.number().int().positive(),
  reps: z.number().int().positive().optional(),
  weight: z.number().positive().optional(),
  weightUnit: z.nativeEnum(WeightUnit).optional(),
  weightPercent: z.number().min(0).max(200).optional(),
  time: z.number().int().positive().optional(),
  distance: z.number().positive().optional(),
  distanceUnit: z.nativeEnum(DistanceUnit).optional(),
  calories: z.number().int().positive().optional(),
  notes: z.string().optional(),
});

const createExerciseSchema = z.object({
  exerciseId: z.string().min(1),
  orderIndex: z.number().int().min(0),
  prescribedReps: z.number().int().positive().optional(),
  prescribedWeight: z.number().positive().optional(),
  prescribedWeightUnit: z.nativeEnum(WeightUnit).optional(),
  prescribedWeightPercent: z.number().min(0).max(200).optional(),
  prescribedDistance: z.number().positive().optional(),
  prescribedDistanceUnit: z.nativeEnum(DistanceUnit).optional(),
  prescribedTime: z.number().int().positive().optional(),
  prescribedCalories: z.number().int().positive().optional(),
  prescribedSets: z.number().int().positive().optional(),
  notes: z.string().optional(),
  setPrescriptions: z.array(setPrescriptionSchema).optional(),
});

const createBlockSchema = z.object({
  type: z.nativeEnum(WorkoutBlockType),
  name: z.string().optional(),
  orderIndex: z.number().int().min(0),
  timeCap: z.number().int().positive().optional(),
  workTime: z.number().int().positive().optional(),
  restTime: z.number().int().positive().optional(),
  rounds: z.number().int().positive().optional(),
  notes: z.string().optional(),
  exercises: z.array(createExerciseSchema).min(0),
});

const createWorkoutSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(200),
  description: z.string().max(2000).optional(),
  venueId: z.string().optional(),
  estimatedTime: z.number().int().positive().optional(),
  difficulty: z.number().int().min(1).max(5).optional(),
  tags: z.array(z.string()).optional(),
  isTemplate: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  blocks: z.array(createBlockSchema).min(1, "Pelo menos um bloco é necessário"),
});

// ============================================================================
// GET /api/workouts - List workouts
// ============================================================================

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const venueId = searchParams.get("venueId");
    const isTemplate = searchParams.get("isTemplate") === "true";
    const isPublic = searchParams.get("isPublic") === "true";
    const cursor = searchParams.get("cursor");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 50);

    // Build where clause
    const where = {
      OR: [
        { createdById: session.user.id },
        { isPublic: true },
        ...(venueId ? [{ venueId }] : []),
      ],
      ...(venueId && { venueId }),
      ...(isTemplate && { isTemplate: true }),
      ...(isPublic && { isPublic: true }),
    };

    const workouts = await prisma.workout.findMany({
      where,
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
        _count: {
          select: {
            logs: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    });

    const hasMore = workouts.length > limit;
    const items = hasMore ? workouts.slice(0, -1) : workouts;
    const nextCursor = hasMore ? items[items.length - 1]?.id : null;

    return NextResponse.json({
      items,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error("Error listing workouts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST /api/workouts - Create workout
// ============================================================================

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = createWorkoutSchema.safeParse(body);

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

    // If venueId provided, verify user has permission (owner/coach)
    if (data.venueId) {
      const membership = await prisma.venueMember.findUnique({
        where: {
          venueId_userId: {
            venueId: data.venueId,
            userId: session.user.id,
          },
        },
      });

      if (!membership || !["OWNER", "COACH"].includes(membership.role)) {
        return NextResponse.json(
          { error: "No permission to create workouts for this venue" },
          { status: 403 }
        );
      }
    }

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

    // Create workout with blocks and exercises
    const workout = await prisma.workout.create({
      data: {
        name: data.name,
        description: data.description,
        createdById: session.user.id,
        venueId: data.venueId,
        estimatedTime: data.estimatedTime,
        difficulty: data.difficulty,
        tags: data.tags || [],
        isTemplate: data.isTemplate || false,
        isPublic: data.isPublic || false,
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
                // Create set prescriptions if provided
                ...(exercise.setPrescriptions?.length && {
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
                      notes: sp.notes,
                    })),
                  },
                }),
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
                setPrescriptions: {
                  orderBy: { setNumber: "asc" },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(workout, { status: 201 });
  } catch (error) {
    console.error("Error creating workout:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
