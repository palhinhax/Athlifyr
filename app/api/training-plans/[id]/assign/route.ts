/**
 * Training Plan Assignment API
 *
 * POST - Assign plan to user or self
 */

import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

// POST /api/training-plans/[id]/assign - Assign plan to user
export async function POST(
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

    const { userId, startDate, notes } = body;

    // Get the plan
    const plan = await prisma.trainingPlan.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        duration: true,
        createdById: true,
        isPublic: true,
      },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Determine target user
    const targetUserId = userId || user.id;
    const isSelfAssign = targetUserId === user.id;

    // If assigning to someone else, check if current user is the plan owner
    if (!isSelfAssign && plan.createdById !== user.id) {
      return NextResponse.json(
        { error: "Only the plan owner can assign to other users" },
        { status: 403 }
      );
    }

    // If self-assigning, check if plan is public or user is the owner
    if (isSelfAssign && !plan.isPublic && plan.createdById !== user.id) {
      return NextResponse.json(
        { error: "This plan is not available" },
        { status: 403 }
      );
    }

    // Check if already assigned
    const existingAssignment = await prisma.userTrainingPlan.findFirst({
      where: {
        userId: targetUserId,
        planId: id,
        status: "ACTIVE",
      },
    });

    if (existingAssignment) {
      return NextResponse.json(
        { error: "Plan already assigned to this user" },
        { status: 400 }
      );
    }

    // Calculate end date
    const start = startDate ? new Date(startDate) : new Date();
    let endDate: Date | null = null;
    if (plan.duration) {
      endDate = new Date(start);
      endDate.setDate(endDate.getDate() + plan.duration * 7);
    }

    const userPlan = await prisma.userTrainingPlan.create({
      data: {
        userId: targetUserId,
        planId: id,
        assignedById: isSelfAssign ? null : user.id,
        startDate: start,
        endDate,
        currentWeek: 1,
        status: "ACTIVE",
        notes: notes?.trim() || null,
      },
      include: {
        plan: {
          select: { id: true, name: true, duration: true },
        },
        user: {
          select: { id: true, name: true, image: true },
        },
        assignedBy: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json({ userPlan }, { status: 201 });
  } catch (error) {
    console.error("Error assigning plan:", error);
    return NextResponse.json(
      { error: "Failed to assign plan" },
      { status: 500 }
    );
  }
}
