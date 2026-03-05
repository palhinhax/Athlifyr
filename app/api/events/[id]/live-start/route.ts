// ============================================================================
// POST /api/events/[id]/live-start
//
// Called by the frontend when a spectator opens the event page within
// T-60 minutes of start. Triggers the Live Service to prepare the room.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const LIVE_SERVICE_URL =
  process.env.LIVE_SERVICE_URL ||
  process.env.NEXT_PUBLIC_LIVE_URL ||
  "http://localhost:4000";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;

    // Fetch event to validate conditions
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        hasLiveRace: true,
        liveStatus: true,
        startDate: true,
      },
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

    // Only trigger if within 60 minutes of start and not already running/finished
    const now = Date.now();
    const startTime = new Date(event.startDate).getTime();
    const windowMs = 60 * 60 * 1000; // 60 minutes

    if (event.liveStatus === "FINISHED" || event.liveStatus === "CANCELLED") {
      return NextResponse.json({
        status: event.liveStatus,
        message: "Race already ended",
      });
    }

    if (event.liveStatus === "LIVE" || event.liveStatus === "WARMUP") {
      // Already running/prepared — this is fine, return current status
      return NextResponse.json({
        status: event.liveStatus,
        message: "Already active",
      });
    }

    if (now < startTime - windowMs) {
      return NextResponse.json({
        status: event.liveStatus,
        message: "Too early to activate live race",
        activatesAt: new Date(startTime - windowMs).toISOString(),
      });
    }

    // Trigger the Live Service
    try {
      const liveRes = await fetch(`${LIVE_SERVICE_URL}/live/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      if (!liveRes.ok) {
        const errBody = await liveRes.json().catch(() => null);
        console.error("[live-start] Live Service error:", errBody);
        return NextResponse.json(
          {
            error: "Failed to activate live race",
            details: (errBody as { error?: string })?.error,
          },
          { status: 502 }
        );
      }

      const result = await liveRes.json();
      return NextResponse.json(result);
    } catch (fetchErr) {
      console.error("[live-start] Cannot reach Live Service:", fetchErr);
      return NextResponse.json(
        { error: "Live Service unavailable" },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("[live-start] Internal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
