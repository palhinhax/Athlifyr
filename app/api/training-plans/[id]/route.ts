/**
 * Training Plan Detail API
 *
 * GET - Get plan details with weeks and workouts
 * PATCH - Update plan details
 * DELETE - Delete plan
 */

import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

// GET /api/training-plans/[id] - Get plan details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    const { id } = await params;

    const plan = await prisma.trainingPlan.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, name: true, image: true },
        },
        venue: {
          select: { id: true, name: true, slug: true, logo: true },
        },
        weeks: {
          orderBy: { orderIndex: "asc" },
          include: {
            workouts: {
              orderBy: [{ dayOfWeek: "asc" }, { orderIndex: "asc" }],
              include: {
                workout: {
                  include: {
                    blocks: {
                      orderBy: { orderIndex: "asc" },
                      select: {
                        id: true,
                        type: true,
                        name: true,
                        timeCap: true,
                        workTime: true,
                        rounds: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            assignedToUsers: true,
          },
        },
      },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Check access
    const canAccess =
      plan.isPublic ||
      plan.createdById === user?.id ||
      (user?.id &&
        (await prisma.userTrainingPlan.findFirst({
          where: { userId: user.id, planId: id },
        })));

    if (!canAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Check if current user owns this plan
    const isOwner = plan.createdById === user?.id;

    return NextResponse.json({ plan, isOwner });
  } catch (error) {
    console.error("Error fetching training plan:", error);
    return NextResponse.json(
      { error: "Failed to fetch training plan" },
      { status: 500 }
    );
  }
}

// PATCH /api/training-plans/[id] - Update plan
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Check ownership
    const existingPlan = await prisma.trainingPlan.findUnique({
      where: { id },
      select: { createdById: true },
    });

    if (!existingPlan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    if (existingPlan.createdById !== user.id) {
      return NextResponse.json(
        { error: "No permission to edit this plan" },
        { status: 403 }
      );
    }

    const {
      name,
      description,
      imageUrl,
      duration,
      difficulty,
      tags,
      isTemplate,
      isPublic,
      isPremium,
      category,
      targetAudience,
      goals,
      requirements,
    } = body;

    const plan = await prisma.trainingPlan.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && {
          description: description?.trim() || null,
        }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
        ...(duration !== undefined && { duration: duration || null }),
        ...(difficulty !== undefined && { difficulty: difficulty || null }),
        ...(tags !== undefined && { tags }),
        ...(isTemplate !== undefined && { isTemplate }),
        ...(isPublic !== undefined && { isPublic }),
        ...(isPremium !== undefined && { isPremium }),
        ...(category !== undefined && { category: category || null }),
        ...(targetAudience !== undefined && {
          targetAudience: targetAudience || null,
        }),
        ...(goals !== undefined && { goals }),
        ...(requirements !== undefined && { requirements }),
      },
      include: {
        createdBy: {
          select: { id: true, name: true, image: true },
        },
        venue: {
          select: { id: true, name: true, slug: true, logo: true },
        },
      },
    });

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Error updating training plan:", error);
    return NextResponse.json(
      { error: "Failed to update training plan" },
      { status: 500 }
    );
  }
}

// DELETE /api/training-plans/[id] - Delete plan
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check ownership
    const existingPlan = await prisma.trainingPlan.findUnique({
      where: { id },
      select: { createdById: true },
    });

    if (!existingPlan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    if (existingPlan.createdById !== user.id) {
      return NextResponse.json(
        { error: "No permission to delete this plan" },
        { status: 403 }
      );
    }

    // Delete plan (cascades to weeks, workouts, assignments)
    await prisma.trainingPlan.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting training plan:", error);
    return NextResponse.json(
      { error: "Failed to delete training plan" },
      { status: 500 }
    );
  }
}
