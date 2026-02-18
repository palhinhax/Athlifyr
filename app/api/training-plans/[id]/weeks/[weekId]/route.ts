/**
 * Training Plan Week Detail API
 *
 * GET - Get week details
 * PATCH - Update week
 * DELETE - Delete week
 */

import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

// GET /api/training-plans/[id]/weeks/[weekId] - Get week details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; weekId: string }> }
) {
  try {
    const { weekId } = await params;

    const week = await prisma.trainingPlanWeek.findUnique({
      where: { id: weekId },
      include: {
        workouts: {
          orderBy: [{ dayOfWeek: "asc" }, { orderIndex: "asc" }],
          include: {
            workout: {
              include: {
                blocks: {
                  orderBy: { orderIndex: "asc" },
                },
              },
            },
          },
        },
      },
    });

    if (!week) {
      return NextResponse.json({ error: "Week not found" }, { status: 404 });
    }

    return NextResponse.json({ week });
  } catch (error) {
    console.error("Error fetching week:", error);
    return NextResponse.json(
      { error: "Failed to fetch week" },
      { status: 500 }
    );
  }
}

// PATCH /api/training-plans/[id]/weeks/[weekId] - Update week
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; weekId: string }> }
) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
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

    if (plan.createdById !== user.id) {
      return NextResponse.json(
        { error: "No permission to modify this plan" },
        { status: 403 }
      );
    }

    const { weekNumber, name, description, orderIndex } = body;

    const week = await prisma.trainingPlanWeek.update({
      where: { id: weekId },
      data: {
        ...(weekNumber !== undefined && { weekNumber }),
        ...(name !== undefined && { name: name?.trim() || null }),
        ...(description !== undefined && {
          description: description?.trim() || null,
        }),
        ...(orderIndex !== undefined && { orderIndex }),
      },
    });

    return NextResponse.json({ week });
  } catch (error) {
    console.error("Error updating week:", error);
    return NextResponse.json(
      { error: "Failed to update week" },
      { status: 500 }
    );
  }
}

// DELETE /api/training-plans/[id]/weeks/[weekId] - Delete week
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; weekId: string }> }
) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, weekId } = await params;

    // Check ownership
    const plan = await prisma.trainingPlan.findUnique({
      where: { id },
      select: { createdById: true },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    if (plan.createdById !== user.id) {
      return NextResponse.json(
        { error: "No permission to modify this plan" },
        { status: 403 }
      );
    }

    await prisma.trainingPlanWeek.delete({
      where: { id: weekId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting week:", error);
    return NextResponse.json(
      { error: "Failed to delete week" },
      { status: 500 }
    );
  }
}
