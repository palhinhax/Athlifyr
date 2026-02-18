/**
 * Training Plans API
 *
 * GET - List all training plans (public + user's own)
 * POST - Create a new training plan
 */

import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

// GET /api/training-plans - List training plans
export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const targetAudience = searchParams.get("targetAudience");
    const isPublic = searchParams.get("public") === "true";
    const myPlans = searchParams.get("myPlans") === "true";
    const assignedToMe = searchParams.get("assignedToMe") === "true";
    const includeSaved = searchParams.get("includeSaved") !== "false"; // Default true

    // Get user's saved plan IDs
    const savedPlanIds =
      includeSaved && user?.id
        ? (
            await prisma.savedTrainingPlan.findMany({
              where: { userId: user.id },
              select: { planId: true },
            })
          ).map((s) => s.planId)
        : [];

    // Build where clause
    const where: Prisma.TrainingPlanWhereInput = {};

    if (isPublic) {
      where.isPublic = true;
    } else if (myPlans && user?.id) {
      where.createdById = user.id;
    } else if (!user?.id) {
      // Not logged in - only show public plans
      where.isPublic = true;
    } else {
      // Logged in - show public + own plans + saved plans
      where.OR = [
        { isPublic: true },
        { createdById: user.id },
        ...(savedPlanIds.length > 0 ? [{ id: { in: savedPlanIds } }] : []),
      ];
    }

    if (category) {
      where.category = category;
    }

    if (targetAudience) {
      where.targetAudience = targetAudience;
    }

    // If getting plans assigned to me
    if (assignedToMe && user?.id) {
      const userPlans = await prisma.userTrainingPlan.findMany({
        where: {
          userId: user.id,
        },
        include: {
          plan: {
            include: {
              createdBy: {
                select: { id: true, name: true, image: true },
              },
              venue: {
                select: { id: true, name: true, slug: true, logo: true },
              },
              weeks: {
                select: { id: true },
              },
            },
          },
          assignedBy: {
            select: { id: true, name: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ userPlans });
    }

    const plans = await prisma.trainingPlan.findMany({
      where,
      include: {
        createdBy: {
          select: { id: true, name: true, image: true },
        },
        venue: {
          select: { id: true, name: true, slug: true, logo: true },
        },
        weeks: {
          include: {
            workouts: {
              include: {
                workout: {
                  include: {
                    blocks: {
                      orderBy: { orderIndex: "asc" },
                    },
                  },
                },
              },
              orderBy: [{ dayOfWeek: "asc" }, { orderIndex: "asc" }],
            },
          },
          orderBy: { orderIndex: "asc" },
        },
        _count: {
          select: {
            assignedToUsers: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Add isSaved flag to each plan
    const plansWithSaved = plans.map((plan) => ({
      ...plan,
      isSaved: savedPlanIds.includes(plan.id),
    }));

    return NextResponse.json({ plans: plansWithSaved });
  } catch (error) {
    console.error("Error fetching training plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch training plans" },
      { status: 500 }
    );
  }
}

// POST /api/training-plans - Create a new training plan
export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

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
      venueId,
    } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Plan name is required" },
        { status: 400 }
      );
    }

    // If venueId is provided, verify user has access to venue
    if (venueId) {
      const venueMember = await prisma.venueMember.findFirst({
        where: {
          venueId,
          userId: user.id,
          role: { in: ["OWNER", "ADMIN", "COACH"] },
        },
      });

      if (!venueMember) {
        return NextResponse.json(
          { error: "No permission to create plans for this venue" },
          { status: 403 }
        );
      }
    }

    const plan = await prisma.trainingPlan.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        imageUrl: imageUrl || null,
        duration: duration || null,
        difficulty: difficulty || null,
        tags: tags || [],
        isTemplate: isTemplate || false,
        isPublic: isPublic || false,
        isPremium: isPremium || false,
        category: category || null,
        targetAudience: targetAudience || null,
        goals: goals || [],
        requirements: requirements || [],
        createdById: user.id,
        venueId: venueId || null,
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

    return NextResponse.json({ plan }, { status: 201 });
  } catch (error) {
    console.error("Error creating training plan:", error);
    return NextResponse.json(
      { error: "Failed to create training plan" },
      { status: 500 }
    );
  }
}
