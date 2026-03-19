import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { computeAndPersistWorkoutScore } from "@/lib/scoring/score-service";

/**
 * GET /api/workouts/logs/[id]/score
 *
 * Retrieve the Workout Score for a specific workout log.
 * If the score hasn't been calculated yet, it computes and persists it.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify the log belongs to this user
    const log = await prisma.workoutLog.findUnique({
      where: { id, userId: user.id },
      select: { id: true, userId: true },
    });

    if (!log) {
      return NextResponse.json(
        { error: "Workout log not found" },
        { status: 404 }
      );
    }

    // Check if score already exists
    const existing = await prisma.workoutScore.findUnique({
      where: { workoutLogId: id },
    });

    if (existing) {
      return NextResponse.json({
        totalScore: existing.totalScore,
        breakdown: {
          strength: existing.strengthScore,
          endurance: existing.enduranceScore,
          engine: existing.engineScore,
          volumeBonus: existing.volumeBonus,
          prBonus: existing.prBonus,
        },
        highlights: existing.highlights,
        scoreVersion: existing.scoreVersion,
        calculatedAt: existing.calculatedAt.toISOString(),
      });
    }

    // Score not yet computed — calculate now
    const result = await computeAndPersistWorkoutScore(id, user.id);

    if (!result) {
      return NextResponse.json(
        { error: "Failed to compute score" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      totalScore: Math.round(result.totalScore),
      breakdown: {
        strength: Math.round(result.breakdown.strength),
        endurance: Math.round(result.breakdown.endurance),
        engine: Math.round(result.breakdown.engine),
        volumeBonus: Math.round(result.breakdown.volumeBonus),
        prBonus: Math.round(result.breakdown.prBonus),
      },
      highlights: result.highlights,
      scoreVersion: result.version,
      calculatedAt: result.calculatedAt,
    });
  } catch (error) {
    console.error("Error fetching workout score:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
