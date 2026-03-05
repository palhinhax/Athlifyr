// ============================================================================
// GET /api/events/[id]/live-time
//
// Returns server timestamp and event start times for countdown sync.
// Public endpoint — no auth required (spectators need this).
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await params;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      liveStatus: true,
      startDate: true,
      variants: {
        select: {
          id: true,
          name: true,
          startDate: true,
          startTime: true,
        },
      },
    },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // Build variant start times
  const variantStartTimes: Record<string, string | null> = {};
  for (const variant of event.variants) {
    if (variant.startDate) {
      const base = new Date(variant.startDate);
      if (variant.startTime) {
        const [hours, minutes] = variant.startTime.split(":").map(Number);
        if (!isNaN(hours) && !isNaN(minutes)) {
          base.setUTCHours(hours, minutes, 0, 0);
        }
      }
      variantStartTimes[variant.id] = base.toISOString();
    } else {
      variantStartTimes[variant.id] = event.startDate.toISOString();
    }
  }

  return NextResponse.json({
    serverTime: new Date().toISOString(),
    liveStatus: event.liveStatus,
    eventStartDate: event.startDate.toISOString(),
    variantStartTimes,
  });
}
