// ============================================================================
// GET /api/events/[id]/live-status
//
// Returns current live status + connected count for organizer manage page.
// Proxies to the Live server when available; falls back to DB-only data.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import {
  getUserEventContext,
  hasEventPermission,
} from "@/lib/event-permissions";

const LIVE_SERVICE_URL =
  process.env.LIVE_SERVICE_URL ||
  process.env.NEXT_PUBLIC_LIVE_URL ||
  "http://localhost:4000";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await params;

  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ctx = await getUserEventContext(user.id, user.role, eventId);
  if (
    !hasEventPermission(ctx, "manage_event") &&
    !hasEventPermission(ctx, "manage_liverace")
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Always get DB status first
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { liveStatus: true },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // Try to get richer data from Live server
  try {
    const liveRes = await fetch(
      `${LIVE_SERVICE_URL}/internal/room-info/${eventId}`,
      {
        headers: {
          "x-live-secret": process.env.LIVE_INTERNAL_SECRET ?? "",
        },
        signal: AbortSignal.timeout(3000),
      }
    );

    if (liveRes.ok) {
      const liveData = (await liveRes.json()) as {
        connectedCount: number;
        participantCount: number;
        lastUpdate: string | null;
      };

      return NextResponse.json({
        liveStatus: event.liveStatus,
        connectedCount: liveData.connectedCount ?? 0,
        participantCount: liveData.participantCount ?? 0,
        lastUpdate: liveData.lastUpdate ?? null,
      });
    }
  } catch {
    // Live server not reachable — return DB data only
  }

  return NextResponse.json({
    liveStatus: event.liveStatus,
    connectedCount: 0,
    participantCount: 0,
    lastUpdate: null,
  });
}
