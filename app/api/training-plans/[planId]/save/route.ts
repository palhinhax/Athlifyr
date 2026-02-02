/**
 * Save/Unsave Training Plan API
 *
 * POST - Save (bookmark) a training plan
 * DELETE - Unsave (remove bookmark) a training plan
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/training-plans/[planId]/save - Save a training plan
export async function POST(
  request: Request,
  { params }: { params: Promise<{ planId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId } = await params;

    // Check if plan exists and is public (or user is creator)
    const plan = await prisma.trainingPlan.findUnique({
      where: { id: planId },
      select: { id: true, isPublic: true, createdById: true },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Training plan not found" },
        { status: 404 }
      );
    }

    // Can't save your own plan
    if (plan.createdById === session.user.id) {
      return NextResponse.json(
        { error: "Cannot save your own training plan" },
        { status: 400 }
      );
    }

    // Must be public to save
    if (!plan.isPublic) {
      return NextResponse.json(
        { error: "Training plan is not public" },
        { status: 403 }
      );
    }

    // Create saved plan (upsert to avoid duplicates)
    const savedPlan = await prisma.savedTrainingPlan.upsert({
      where: {
        userId_planId: {
          userId: session.user.id,
          planId,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        planId,
      },
    });

    return NextResponse.json({ saved: savedPlan });
  } catch (error) {
    console.error("Error saving training plan:", error);
    return NextResponse.json(
      { error: "Failed to save training plan" },
      { status: 500 }
    );
  }
}

// DELETE /api/training-plans/[planId]/save - Unsave a training plan
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ planId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId } = await params;

    await prisma.savedTrainingPlan.deleteMany({
      where: {
        userId: session.user.id,
        planId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unsaving training plan:", error);
    return NextResponse.json(
      { error: "Failed to unsave training plan" },
      { status: 500 }
    );
  }
}
