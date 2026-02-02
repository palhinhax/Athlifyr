/**
 * User Training Plan Progress API
 *
 * PATCH - Update progress (current week, status)
 * DELETE - Leave/cancel plan
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/training-plans/user/[userPlanId] - Update progress
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userPlanId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userPlanId } = await params;
    const body = await request.json();

    // Check ownership
    const existingPlan = await prisma.userTrainingPlan.findUnique({
      where: { id: userPlanId },
      select: { userId: true },
    });

    if (!existingPlan) {
      return NextResponse.json(
        { error: "User plan not found" },
        { status: 404 }
      );
    }

    if (existingPlan.userId !== session.user.id) {
      return NextResponse.json(
        { error: "No permission to modify this plan" },
        { status: 403 }
      );
    }

    const { currentWeek, status, notes } = body;

    const userPlan = await prisma.userTrainingPlan.update({
      where: { id: userPlanId },
      data: {
        ...(currentWeek !== undefined && { currentWeek }),
        ...(status !== undefined && { status }),
        ...(notes !== undefined && { notes: notes?.trim() || null }),
      },
      include: {
        plan: {
          select: { id: true, name: true, duration: true },
        },
      },
    });

    return NextResponse.json({ userPlan });
  } catch (error) {
    console.error("Error updating user plan:", error);
    return NextResponse.json(
      { error: "Failed to update user plan" },
      { status: 500 }
    );
  }
}

// DELETE /api/training-plans/user/[userPlanId] - Leave/cancel plan
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userPlanId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userPlanId } = await params;

    // Check ownership
    const existingPlan = await prisma.userTrainingPlan.findUnique({
      where: { id: userPlanId },
      select: { userId: true },
    });

    if (!existingPlan) {
      return NextResponse.json(
        { error: "User plan not found" },
        { status: 404 }
      );
    }

    if (existingPlan.userId !== session.user.id) {
      return NextResponse.json(
        { error: "No permission to modify this plan" },
        { status: 403 }
      );
    }

    await prisma.userTrainingPlan.delete({
      where: { id: userPlanId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error leaving plan:", error);
    return NextResponse.json(
      { error: "Failed to leave plan" },
      { status: 500 }
    );
  }
}
