/**
 * User Training Plans API
 *
 * GET - Get user's active training plans with progress
 */

import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

// GET /api/training-plans/user - Get user's training plans
export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
            },
          },
        },
        assignedBy: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: [{ status: "asc" }, { startDate: "desc" }],
    });

    // Calculate progress for each plan
    const plansWithProgress = userPlans.map((userPlan) => {
      const totalWeeks = userPlan.plan.duration || userPlan.plan.weeks.length;
      const totalWorkouts = userPlan.plan.weeks.reduce(
        (sum, week) => sum + week.workouts.length,
        0
      );

      // Calculate completed workouts (would need logs, simplified for now)
      const completedWorkouts = 0; // TODO: Count from workout logs

      const completionPercentage =
        totalWeeks > 0
          ? Math.round((userPlan.currentWeek / totalWeeks) * 100)
          : 0;

      return {
        ...userPlan,
        progress: {
          currentWeek: userPlan.currentWeek,
          totalWeeks,
          totalWorkouts,
          completedWorkouts,
          completionPercentage: Math.min(completionPercentage, 100),
        },
      };
    });

    return NextResponse.json({ userPlans: plansWithProgress });
  } catch (error) {
    console.error("Error fetching user plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch user plans" },
      { status: 500 }
    );
  }
}
