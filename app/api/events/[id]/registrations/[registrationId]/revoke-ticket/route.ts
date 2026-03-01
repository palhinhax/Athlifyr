import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string; registrationId: string }>;
}

const ALLOWED_ROLES = new Set(["OWNER", "ADMIN"]);

// PATCH /api/events/[id]/registrations/[registrationId]/revoke-ticket
// Rotates the ticketNonce, instantly invalidating all existing JWTs for this registration.
// The participant must open their ticket modal again to get a new QR code.
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { id: eventId, registrationId } = await params;

  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only platform admins and event owners/admins can revoke tickets
  const isAdmin = user.role === "ADMIN";
  const organizer = await prisma.eventOrganizer.findUnique({
    where: { eventId_userId: { eventId, userId: user.id } },
    select: { role: true },
  });

  if (!isAdmin && (!organizer || !ALLOWED_ROLES.has(organizer.role))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Find the registration and confirm it belongs to this event
  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
    select: { id: true, eventId: true, status: true },
  });

  if (!registration || registration.eventId !== eventId) {
    return NextResponse.json(
      { error: "Registration not found" },
      { status: 404 }
    );
  }

  if (registration.status !== "CONFIRMED") {
    return NextResponse.json(
      { error: "Only confirmed registrations can have their ticket revoked" },
      { status: 400 }
    );
  }

  // Rotate the nonce — all existing JWTs (QR codes) become invalid immediately
  const newNonce = crypto.randomUUID();
  await prisma.registration.update({
    where: { id: registrationId },
    data: { ticketNonce: newNonce },
  });

  return NextResponse.json({
    success: true,
    message:
      "Ticket revoked. All existing QR codes for this registration are now invalid. The participant must open their ticket again to get a new QR code.",
  });
}
