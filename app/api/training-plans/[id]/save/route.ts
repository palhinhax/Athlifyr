/**
 * Save/Unsave Training Plan API
 *
 * POST - Save (bookmark) a training plan
 * DELETE - Unsave (remove bookmark) a training plan
 */

import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

// POST /api/training-plans/[id]/save - Save a training plan
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: planId } = await params;

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
    if (plan.createdById === user.id) {
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
          userId: user.id,
          planId,
        },
      },
      update: {},
      create: {
        userId: user.id,
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

// DELETE /api/training-plans/[id]/save - Unsave a training plan
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: planId } = await params;

    await prisma.savedTrainingPlan.deleteMany({
      where: {
        userId: user.id,
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
