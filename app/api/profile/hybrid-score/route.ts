import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { computeAndPersistHybridScore } from "@/lib/scoring/score-service";

/**
 * GET /api/profile/hybrid-score
 *
 * Retrieve the user's Hybrid Score.
 * If not yet calculated, or if stale, recalculates on-demand.
 */
export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if a recent hybrid score exists (recalculated within last 24h)
    const existing = await prisma.userHybridScore.findUnique({
      where: { userId: user.id },
    });

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    if (existing && existing.calculatedAt > oneDayAgo) {
      return NextResponse.json({
        totalScore: existing.totalScore,
        breakdown: {
          strength: existing.strengthScore,
          endurance: existing.enduranceScore,
          engine: existing.engineScore,
        },
        confidence: existing.confidence,
        scoreVersion: existing.scoreVersion,
        calculatedAt: existing.calculatedAt.toISOString(),
      });
    }

    // Recalculate
    const result = await computeAndPersistHybridScore(user.id);

    return NextResponse.json({
      totalScore: Math.round(result.totalScore),
      breakdown: {
        strength: Math.round(result.breakdown.strength),
        endurance: Math.round(result.breakdown.endurance),
        engine: Math.round(result.breakdown.engine),
      },
      confidence: result.confidence,
      scoreVersion: result.version,
      calculatedAt: result.calculatedAt,
    });
  } catch (error) {
    console.error("Error fetching hybrid score:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
