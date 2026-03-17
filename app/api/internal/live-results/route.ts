// ============================================================================
// Internal API: POST /api/internal/live-results
//
// Called by the Live Service to persist final race results and checkpoint splits.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isLiveServer } from "@/lib/internal-auth";

interface AthleteResult {
  userId: string;
  variantId: string;
  rank: number;
  finishTimeMs: number; // total time in milliseconds
  status: "FINISHED" | "DNF" | "DSQ";
  checkpointSplits?: {
    checkpointId: string;
    checkpointName: string;
    reachedAt: string; // ISO timestamp
    splitTimeMs: number; // time from start in ms
  }[];
}

interface LiveResultsBody {
  eventId: string;
  results: AthleteResult[];
}

export async function POST(request: NextRequest) {
  if (!isLiveServer(request)) {
    return NextResponse.json(
      { error: "Forbidden — internal endpoint" },
      { status: 403 }
    );
  }

  try {
    const body = (await request.json()) as LiveResultsBody;
    const { eventId, results } = body;

    if (!eventId || !results?.length) {
      return NextResponse.json(
        { error: "Missing eventId or results" },
        { status: 400 }
      );
    }

    // Verify event exists and has LiveRace
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, hasLiveRace: true },
    });

    if (!event || !event.hasLiveRace) {
      return NextResponse.json(
        { error: "Event not found or LiveRace not enabled" },
        { status: 404 }
      );
    }

    // Persist results using upsert (idempotent)
    let persisted = 0;
    for (const result of results) {
      // Format finish time as HH:MM:SS
      const totalSecs = Math.floor(result.finishTimeMs / 1000);
      const hours = Math.floor(totalSecs / 3600);
      const minutes = Math.floor((totalSecs % 3600) / 60);
      const seconds = totalSecs % 60;
      const finishTimeStr = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

      await prisma.result.upsert({
        where: {
          userId_eventId_variantId: {
            userId: result.userId,
            eventId,
            variantId: result.variantId,
          },
        },
        update: {
          position: result.rank,
          time: finishTimeStr,
          timeSeconds: totalSecs,
          notes:
            result.status === "DNF"
              ? "DNF"
              : result.status === "DSQ"
                ? "DSQ"
                : null,
        },
        create: {
          userId: result.userId,
          eventId,
          variantId: result.variantId,
          position: result.rank,
          time: finishTimeStr,
          timeSeconds: totalSecs,
          notes:
            result.status === "DNF"
              ? "DNF"
              : result.status === "DSQ"
                ? "DSQ"
                : null,
        },
      });
      persisted++;
    }

    // Update event live status to FINISHED
    await prisma.event.update({
      where: { id: eventId },
      data: { liveStatus: "FINISHED" },
    });

    return NextResponse.json({
      success: true,
      persisted,
      eventId,
    });
  } catch (error) {
    console.error("[Internal] Error persisting live results:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
