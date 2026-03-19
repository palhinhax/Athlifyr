import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeAndPersistHybridScore } from "@/lib/scoring/score-service";

/**
 * Cron endpoint to recalculate Hybrid Scores for active users.
 * "Active" = users who logged a workout in the last 90 days.
 *
 * Vercel Cron config in vercel.json:
 * {
 *   "path": "/api/cron/recalculate-hybrid-scores",
 *   "schedule": "0 5 * * *"   // Daily at 5 AM UTC
 * }
 */
export async function GET(request: Request) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      console.error(
        "[Security] CRON_SECRET is not configured. Rejecting cron request."
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

    // Find users who logged workouts in the last 90 days
    const activeUsers = await prisma.workoutLog.findMany({
      where: {
        performedAt: { gte: ninetyDaysAgo },
      },
      select: { userId: true },
      distinct: ["userId"],
    });

    let updated = 0;
    let failed = 0;

    for (const { userId } of activeUsers) {
      try {
        await computeAndPersistHybridScore(userId);
        updated++;
      } catch (error) {
        console.error(
          `Failed to recalculate hybrid score for user ${userId}:`,
          error
        );
        failed++;
      }
    }

    return NextResponse.json({
      message: "Hybrid score recalculation complete",
      usersProcessed: activeUsers.length,
      updated,
      failed,
    });
  } catch (error) {
    console.error("Error in hybrid score recalculation cron:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
