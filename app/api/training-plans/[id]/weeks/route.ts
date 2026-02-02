/**
 * Training Plan Weeks API
 *
 * GET - List weeks of a plan
 * POST - Add a new week to the plan
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/training-plans/[id]/weeks - Get all weeks
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const weeks = await prisma.trainingPlanWeek.findMany({
      where: { planId: id },
      orderBy: { orderIndex: "asc" },
      include: {
        workouts: {
          orderBy: [{ dayOfWeek: "asc" }, { orderIndex: "asc" }],
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
        },
      },
    });

    return NextResponse.json({ weeks });
  } catch (error) {
    console.error("Error fetching weeks:", error);
    return NextResponse.json(
      { error: "Failed to fetch weeks" },
      { status: 500 }
    );
  }
}

// POST /api/training-plans/[id]/weeks - Add a week
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
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

    const { weekNumber, name, description } = body;

    // Get max order index
    const maxOrder = await prisma.trainingPlanWeek.aggregate({
      where: { planId: id },
      _max: { orderIndex: true },
    });

    // Get next week number if not provided
    let finalWeekNumber = weekNumber;
    if (!finalWeekNumber) {
      const maxWeek = await prisma.trainingPlanWeek.aggregate({
        where: { planId: id },
        _max: { weekNumber: true },
      });
      finalWeekNumber = (maxWeek._max.weekNumber || 0) + 1;
    }

    const week = await prisma.trainingPlanWeek.create({
      data: {
        planId: id,
        weekNumber: finalWeekNumber,
        name: name?.trim() || null,
        description: description?.trim() || null,
        orderIndex: (maxOrder._max.orderIndex ?? -1) + 1,
      },
    });

    return NextResponse.json({ week }, { status: 201 });
  } catch (error) {
    console.error("Error creating week:", error);
    return NextResponse.json(
      { error: "Failed to create week" },
      { status: 500 }
    );
  }
}
