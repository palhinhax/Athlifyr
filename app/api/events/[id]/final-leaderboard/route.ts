import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/events/[id]/final-leaderboard
 *
 * Returns persisted results for a FINISHED event, formatted as leaderboard entries.
 * Public endpoint — no auth required (results are public by default).
 * Only returns results where isPublic = true.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id: eventId } = await params;

    // Verify event exists and is finished
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, liveStatus: true, hasLiveRace: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (!event.hasLiveRace) {
      return NextResponse.json(
        { error: "LiveRace not enabled" },
        { status: 400 }
      );
    }

    // Fetch all public results ordered by position
    const results = await prisma.result.findMany({
      where: {
        eventId,
        isPublic: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        variant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [{ position: "asc" }, { timeSeconds: "asc" }],
    });

    // Map to LeaderboardEntry format (compatible with LiveLeaderboard component)
    const entries = results.map((result, index) => ({
      rank: result.position ?? index + 1,
      userId: result.userId,
      name: result.user.name,
      image: result.user.image,
      bibNumber: null,
      variantId: result.variantId ?? "",
      variantName: result.variant?.name ?? "",
      status: "FINISHED" as const,
      distanceAlongRouteM: 0,
      progressPercent: 100,
      lastCheckpointOrder: 0,
      lastCheckpointName: null,
      finishTimeMs: result.timeSeconds ? result.timeSeconds * 1000 : null,
      gap: null,
    }));

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Error fetching final leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
