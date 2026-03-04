import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import type { EventLiveStatus } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/** Allowed organizer roles for live-status transitions. */
const ALLOWED_ORGANIZER_ROLES = new Set(["OWNER", "ADMIN"]);

/**
 * Valid state transitions for EventLiveStatus.
 * Key = current status, Value = set of allowed target statuses.
 */
const VALID_TRANSITIONS: Record<EventLiveStatus, Set<EventLiveStatus>> = {
  SCHEDULED: new Set(["LIVE", "CANCELLED"] as EventLiveStatus[]),
  LIVE: new Set(["PAUSED", "FINISHED", "CANCELLED"] as EventLiveStatus[]),
  PAUSED: new Set(["LIVE", "FINISHED", "CANCELLED"] as EventLiveStatus[]),
  FINISHED: new Set(["CANCELLED"] as EventLiveStatus[]),
  CANCELLED: new Set([] as EventLiveStatus[]),
};

// PATCH /api/events/[id]/live-status
// Transition liveStatus with state-machine validation.
// Body: { status: EventLiveStatus }
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { id: eventId } = await params;

  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Authorisation: platform admin or organizer (OWNER/ADMIN)
  const isPlatformAdmin = user.role === "ADMIN";
  let isAllowedOrganizer = false;

  if (!isPlatformAdmin) {
    const organizer = await prisma.eventOrganizer.findUnique({
      where: { eventId_userId: { eventId, userId: user.id } },
      select: { role: true },
    });
    isAllowedOrganizer = organizer
      ? ALLOWED_ORGANIZER_ROLES.has(organizer.role)
      : false;
  }

  if (!isPlatformAdmin && !isAllowedOrganizer) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Parse request body
  let body: { status: string };
  try {
    body = (await req.json()) as { status: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const targetStatus = body.status as EventLiveStatus;
  const allStatuses = Object.keys(VALID_TRANSITIONS);
  if (!allStatuses.includes(targetStatus)) {
    return NextResponse.json(
      {
        error: `Invalid status. Must be one of: ${allStatuses.join(", ")}`,
      },
      { status: 400 }
    );
  }

  // Fetch event current status
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { id: true, liveStatus: true },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // Validate the transition
  const allowed = VALID_TRANSITIONS[event.liveStatus];
  if (!allowed.has(targetStatus)) {
    return NextResponse.json(
      {
        error: `Cannot transition from ${event.liveStatus} to ${targetStatus}`,
        currentStatus: event.liveStatus,
      },
      { status: 422 }
    );
  }

  // Perform the transition
  const updated = await prisma.event.update({
    where: { id: eventId },
    data: { liveStatus: targetStatus },
    select: { liveStatus: true },
  });

  console.log(
    `[AUDIT] Live status transition: user=${user.id} (${user.email}), event=${eventId}, ` +
      `${event.liveStatus} → ${updated.liveStatus}`
  );

  return NextResponse.json({
    liveStatus: updated.liveStatus,
    previousStatus: event.liveStatus,
  });
}
