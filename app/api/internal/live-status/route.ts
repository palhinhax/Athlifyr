// ============================================================================
// Internal API: POST /api/internal/live-status
//
// Called by the Live Service to update event live status (WARMUP → LIVE → FINISHED).
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EventLiveStatus } from "@prisma/client";
import { isLiveServer } from "@/lib/internal-auth";

const VALID_TRANSITIONS: Record<EventLiveStatus, EventLiveStatus[]> = {
  SCHEDULED: ["CHECK_IN_OPEN", "WARMUP"],
  CHECK_IN_OPEN: ["WARMUP", "CANCELLED"],
  WARMUP: ["LIVE", "CANCELLED"],
  LIVE: ["PAUSED", "FINISHED", "CANCELLED"],
  PAUSED: ["LIVE", "FINISHED", "CANCELLED"],
  FINISHED: [],
  CANCELLED: [],
};

interface StatusUpdateBody {
  eventId: string;
  status: EventLiveStatus;
}

export async function POST(request: NextRequest) {
  if (!isLiveServer(request)) {
    return NextResponse.json(
      { error: "Forbidden — internal endpoint" },
      { status: 403 }
    );
  }

  try {
    const body = (await request.json()) as StatusUpdateBody;
    const { eventId, status } = body;

    if (!eventId || !status) {
      return NextResponse.json(
        { error: "Missing eventId or status" },
        { status: 400 }
      );
    }

    // Verify event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, hasLiveRace: true, liveStatus: true },
    });

    if (!event || !event.hasLiveRace) {
      return NextResponse.json(
        { error: "Event not found or LiveRace not enabled" },
        { status: 404 }
      );
    }

    // Validate state transition
    const allowedNext = VALID_TRANSITIONS[event.liveStatus];
    if (!allowedNext.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid transition: ${event.liveStatus} → ${status}`,
          currentStatus: event.liveStatus,
          allowedTransitions: allowedNext,
        },
        { status: 400 }
      );
    }

    // Update status
    const updated = await prisma.event.update({
      where: { id: eventId },
      data: { liveStatus: status },
      select: { id: true, liveStatus: true },
    });

    return NextResponse.json({
      success: true,
      eventId: updated.id,
      previousStatus: event.liveStatus,
      currentStatus: updated.liveStatus,
    });
  } catch (error) {
    console.error("[Internal] Error updating live status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
