import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { getCheckInWindowStatus } from "@/lib/checkin-gating";

interface RouteParams {
  params: Promise<{ id: string; registrationId: string }>;
}

/** Roles allowed to perform manual check-in from the dashboard. */
const CHECKIN_ALLOWED_ORGANIZER_ROLES = new Set(["OWNER", "ADMIN"]);

/** Returns a 422 response if the check-in window is not active, or null if OK */
function enforceCheckInWindow(event: {
  checkInOpensAt: Date | null;
  checkInClosesAt: Date | null;
}): NextResponse | null {
  const windowStatus = getCheckInWindowStatus(
    event.checkInOpensAt,
    event.checkInClosesAt
  );
  if (windowStatus === "NOT_OPEN_YET") {
    return NextResponse.json(
      { error: "Check-in window has not opened yet" },
      { status: 422 }
    );
  }
  if (windowStatus === "CLOSED") {
    return NextResponse.json(
      { error: "Check-in window is closed" },
      { status: 422 }
    );
  }
  return null;
}

// PATCH /api/events/[id]/registrations/[registrationId]/checkin
// Toggle check-in for a registration (set or unset checkedInAt).
// Body: { checkedIn: boolean }
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { id: eventId, registrationId } = await params;

  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      cancelled: true,
      checkInOpensAt: true,
      checkInClosesAt: true,
    },
  });
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  if (event.cancelled) {
    return NextResponse.json({ error: "Event is cancelled" }, { status: 422 });
  }

  // Authorisation: platform admin, organizer (OWNER/ADMIN), or any staff member
  const isPlatformAdmin = user.role === "ADMIN";
  const [organizer, staffMember] = await Promise.all([
    prisma.eventOrganizer.findUnique({
      where: { eventId_userId: { eventId, userId: user.id } },
      select: { role: true },
    }),
    prisma.eventStaffMember.findFirst({
      where: { eventId, userId: user.id },
      select: { id: true },
    }),
  ]);

  const isAllowedOrganizer =
    organizer && CHECKIN_ALLOWED_ORGANIZER_ROLES.has(organizer.role);

  if (!isPlatformAdmin && !isAllowedOrganizer && !staffMember) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Parse request body
  let body: { checkedIn: boolean };
  try {
    body = (await req.json()) as { checkedIn: boolean };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body.checkedIn !== "boolean") {
    return NextResponse.json(
      { error: "checkedIn must be a boolean" },
      { status: 400 }
    );
  }

  // Find the registration
  const registration = await prisma.registration.findFirst({
    where: { id: registrationId, eventId },
    select: { id: true, status: true, checkedInAt: true },
  });

  if (!registration) {
    return NextResponse.json(
      { error: "Registration not found" },
      { status: 404 }
    );
  }

  // Prevent check-in of non-confirmed registrations
  if (body.checkedIn && registration.status !== "CONFIRMED") {
    return NextResponse.json(
      { error: "Only confirmed registrations can be checked in" },
      { status: 422 }
    );
  }

  // Enforce the check-in window for non-admin users (staff must respect the window).
  // Platform admins and organizers (OWNER/ADMIN) can override the window.
  if (body.checkedIn && !isPlatformAdmin && !isAllowedOrganizer) {
    const windowError = enforceCheckInWindow(event);
    if (windowError) return windowError;
  }

  // Prevent double check-in (idempotent: return success if already in desired state)
  const alreadyCheckedIn = registration.checkedInAt !== null;
  if (body.checkedIn === alreadyCheckedIn) {
    return NextResponse.json({
      checkedInAt: registration.checkedInAt?.toISOString() ?? null,
    });
  }

  const updated = await prisma.registration.update({
    where: { id: registration.id },
    data: { checkedInAt: body.checkedIn ? new Date() : null },
    select: { checkedInAt: true },
  });

  console.log(
    `[AUDIT] Check-in toggle: user=${user.id} (${user.email}), event=${eventId}, ` +
      `registration=${registrationId}, checkedIn=${body.checkedIn}`
  );

  return NextResponse.json({
    checkedInAt: updated.checkedInAt?.toISOString() ?? null,
  });
}
