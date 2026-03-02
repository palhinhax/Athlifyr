import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { getCheckInWindowStatus } from "@/lib/checkin-gating";

interface RouteParams {
  params: Promise<{ registrationId: string }>;
}

/**
 * POST /api/registrations/[registrationId]/check-in
 *
 * Self-service athlete check-in endpoint.
 * The authenticated user checks in their own registration.
 *
 * Validations:
 * 1. Registration must belong to the authenticated user
 * 2. Registration status must be CONFIRMED
 * 3. Event must not be cancelled
 * 4. Must be within the check-in window (if one is set)
 * 5. Idempotent: returns success if already checked in
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  const { registrationId } = await params;

  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch registration with event data for window validation
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
          cancelled: true,
          checkInOpensAt: true,
          checkInClosesAt: true,
          liveStatus: true,
        },
      },
      variant: {
        select: {
          id: true,
          name: true,
          distanceKm: true,
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

  // Ensure the registration belongs to the authenticated user.
  // Guest registrations (teamRole = MEMBER) are linked by guestEmail.
  const isOwner = registration.userId === user.id;
  const isGuest = registration.guestEmail === user.email;

  if (!isOwner && !isGuest) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Validate registration status
  if (registration.status !== "CONFIRMED") {
    return NextResponse.json(
      {
        error: "Only confirmed registrations can be checked in",
        registrationStatus: registration.status,
      },
      { status: 422 }
    );
  }

  // Validate event is not cancelled
  if (registration.event.cancelled) {
    return NextResponse.json({ error: "Event is cancelled" }, { status: 422 });
  }

  // Validate check-in window
  const windowStatus = getCheckInWindowStatus(
    registration.event.checkInOpensAt,
    registration.event.checkInClosesAt
  );

  if (windowStatus === "NOT_OPEN_YET") {
    return NextResponse.json(
      {
        error: "Check-in window has not opened yet",
        checkInOpensAt:
          registration.event.checkInOpensAt?.toISOString() ?? null,
      },
      { status: 422 }
    );
  }

  if (windowStatus === "CLOSED") {
    return NextResponse.json(
      {
        error: "Check-in window is closed",
        checkInClosesAt:
          registration.event.checkInClosesAt?.toISOString() ?? null,
      },
      { status: 422 }
    );
  }

  // Idempotent: if already checked in, return the existing timestamp
  if (registration.checkedInAt) {
    return NextResponse.json({
      checkedIn: true,
      checkedInAt: registration.checkedInAt.toISOString(),
      alreadyCheckedIn: true,
    });
  }

  // Perform check-in
  const updated = await prisma.registration.update({
    where: { id: registration.id },
    data: { checkedInAt: new Date() },
    select: { checkedInAt: true },
  });

  console.log(
    `[AUDIT] Self-service check-in: user=${user.id} (${user.email}), ` +
      `registration=${registrationId}, event=${registration.event.id}`
  );

  return NextResponse.json(
    {
      checkedIn: true,
      checkedInAt: updated.checkedInAt!.toISOString(),
      alreadyCheckedIn: false,
    },
    { status: 200 }
  );
}
