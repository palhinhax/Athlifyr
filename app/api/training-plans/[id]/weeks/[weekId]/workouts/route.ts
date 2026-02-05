/**
 * Training Plan Week Workouts API
 *
 * POST - Add a workout to a week (assign to a specific day)
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/training-plans/[id]/weeks/[weekId]/workouts - Add workout to week
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; weekId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, weekId } = await params;
    const body = await request.json();

    // Check ownership
    const plan = await prisma.trainingPlan.findUnique({
      where: { id },
      select: { createdById: true },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    if (plan.createdById !== session.user.id) {
      return NextResponse.json(
        { error: "No permission to modify this plan" },
        { status: 403 }
      );
    }

    const { workoutId, dayOfWeek, notes } = body;

    if (!workoutId) {
      return NextResponse.json(
        { error: "Workout ID is required" },
        { status: 400 }
      );
    }

    if (dayOfWeek === undefined || dayOfWeek < 0 || dayOfWeek > 6) {
      return NextResponse.json(
        { error: "Valid day of week (0-6) is required" },
        { status: 400 }
      );
    }

    // Verify workout exists
    const workout = await prisma.workout.findUnique({
      where: { id: workoutId },
      select: { id: true },
    });

    if (!workout) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    // Get max order index for this day
    const maxOrder = await prisma.trainingPlanWorkout.aggregate({
      where: { weekId, dayOfWeek },
      _max: { orderIndex: true },
    });

    const planWorkout = await prisma.trainingPlanWorkout.create({
      data: {
        weekId,
        workoutId,
        dayOfWeek,
        orderIndex: (maxOrder._max.orderIndex ?? -1) + 1,
        notes: notes?.trim() || null,
      },
      include: {
        workout: {
          select: {
            id: true,
            name: true,
            estimatedTime: true,
            difficulty: true,
          },
        },
      },
    });

    return NextResponse.json({ planWorkout }, { status: 201 });
  } catch (error) {
    console.error("Error adding workout to week:", error);
    return NextResponse.json(
      { error: "Failed to add workout" },
      { status: 500 }
    );
  }
}
