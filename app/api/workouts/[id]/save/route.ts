/**
 * Save/Unsave Workout API
 *
 * POST - Save (bookmark) a workout
 * DELETE - Unsave (remove bookmark) a workout
 */

import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

// POST /api/workouts/[id]/save - Save a workout
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: workoutId } = await params;

    // Check if workout exists and is public (or user is creator)
    const workout = await prisma.workout.findUnique({
      where: { id: workoutId },
      select: { id: true, isPublic: true, createdById: true },
    });

    if (!workout) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    // Can't save your own workout
    if (workout.createdById === user.id) {
      return NextResponse.json(
        { error: "Cannot save your own workout" },
        { status: 400 }
      );
    }

    // Must be public to save
    if (!workout.isPublic) {
      return NextResponse.json(
        { error: "Workout is not public" },
        { status: 403 }
      );
    }

    // Create saved workout (upsert to avoid duplicates)
    const savedWorkout = await prisma.savedWorkout.upsert({
      where: {
        userId_workoutId: {
          userId: user.id,
          workoutId,
        },
      },
      update: {},
      create: {
        userId: user.id,
        workoutId,
      },
    });

    return NextResponse.json({ saved: savedWorkout });
  } catch (error) {
    console.error("Error saving workout:", error);
    return NextResponse.json(
      { error: "Failed to save workout" },
      { status: 500 }
    );
  }
}

// DELETE /api/workouts/[id]/save - Unsave a workout
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: workoutId } = await params;

    await prisma.savedWorkout.deleteMany({
      where: {
        userId: user.id,
        workoutId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unsaving workout:", error);
    return NextResponse.json(
      { error: "Failed to unsave workout" },
      { status: 500 }
    );
  }
}
