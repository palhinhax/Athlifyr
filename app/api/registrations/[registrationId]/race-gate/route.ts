import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { validateRaceStartGating } from "@/lib/checkin-gating";

interface RouteParams {
  params: Promise<{ registrationId: string }>;
}

/**
 * GET /api/registrations/[registrationId]/race-gate
 *
 * Returns the gating readiness for starting a race for the authenticated user's
 * registration. All conditions must pass before the app allows "Start Race":
 *
 * 1. Registration status === CONFIRMED
 * 2. checkedInAt !== null
 * 3. Event liveStatus === LIVE
 *
 * GPS permission check is performed client-side (app only).
 *
 * Returns:
 * {
 *   allowed: boolean,
 *   reason?: string,           // if not allowed
 *   gates: {
 *     isConfirmed: boolean,
 *     isCheckedIn: boolean,
 *     isEventLive: boolean,
 *   }
 * }
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  const { registrationId } = await params;

  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
    select: {
      id: true,
      userId: true,
      guestEmail: true,
      status: true,
      checkedInAt: true,
      event: {
        select: {
          id: true,
          liveStatus: true,
          hasLiveRace: true,
          cancelled: true,
        },
      },
    },
  });

  if (!registration) {
    return NextResponse.json(
      { error: "Registration not found" },
      { status: 404 }
    );
  }

  const isOwner = registration.userId === user.id;
  const isGuest = registration.guestEmail === user.email;

  if (!isOwner && !isGuest) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!registration.event.hasLiveRace) {
    return NextResponse.json(
      { error: "This event does not have LiveRace enabled" },
      { status: 422 }
    );
  }

  if (registration.event.cancelled) {
    return NextResponse.json({ error: "Event is cancelled" }, { status: 422 });
  }

  const gatingResult = validateRaceStartGating({
    registrationStatus: registration.status,
    checkedInAt: registration.checkedInAt,
    eventLiveStatus: registration.event.liveStatus,
  });

  return NextResponse.json({
    allowed: gatingResult.allowed,
    reason: gatingResult.reason ?? null,
    gates: {
      isConfirmed: registration.status === "CONFIRMED",
      isCheckedIn: registration.checkedInAt !== null,
      isEventLive: registration.event.liveStatus === "LIVE",
    },
    registrationId: registration.id,
    eventId: registration.event.id,
  });
}
