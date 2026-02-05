/**
 * Training Plan Workout Item API
 *
 * PATCH - Update workout assignment (day, notes)
 * DELETE - Remove workout from week
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/training-plans/[id]/weeks/[weekId]/workouts/[workoutId] - Update
export async function PATCH(
  request: Request,
  {
    params,
  }: { params: Promise<{ id: string; weekId: string; workoutId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, workoutId } = await params;
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

    const { dayOfWeek, orderIndex, notes } = body;

    const planWorkout = await prisma.trainingPlanWorkout.update({
      where: { id: workoutId },
      data: {
        ...(dayOfWeek !== undefined && { dayOfWeek }),
        ...(orderIndex !== undefined && { orderIndex }),
        ...(notes !== undefined && { notes: notes?.trim() || null }),
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

    return NextResponse.json({ planWorkout });
  } catch (error) {
    console.error("Error updating plan workout:", error);
    return NextResponse.json(
      { error: "Failed to update workout" },
      { status: 500 }
    );
  }
}

// DELETE /api/training-plans/[id]/weeks/[weekId]/workouts/[workoutId] - Remove
export async function DELETE(
  request: Request,
  {
    params,
  }: { params: Promise<{ id: string; weekId: string; workoutId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, workoutId } = await params;

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

    await prisma.trainingPlanWorkout.delete({
      where: { id: workoutId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing plan workout:", error);
    return NextResponse.json(
      { error: "Failed to remove workout" },
      { status: 500 }
    );
  }
}
