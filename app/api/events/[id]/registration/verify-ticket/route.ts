import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import type { TicketPayload } from "../ticket/route";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function getTicketSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET or NEXTAUTH_SECRET is not defined");
  }
  return secret;
}

// POST /api/events/[id]/registration/verify-ticket — verify + check-in
export async function POST(req: NextRequest, { params }: RouteParams) {
  const { id: eventId } = await params;

  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only admin or organizers/staff can verify tickets
  const isAdmin = user.role === "ADMIN";
  const isOrganizer = await prisma.eventOrganizer.findUnique({
    where: { eventId_userId: { eventId, userId: user.id } },
  });
  const isStaff = await prisma.eventStaffMember.findFirst({
    where: { eventId, userId: user.id },
  });

  if (!isAdmin && !isOrganizer && !isStaff) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json()) as { token: string };
  if (!body.token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  // Verify the JWT token
  let payload: TicketPayload;
  try {
    const decoded = jwt.verify(body.token, getTicketSecret());
    payload = decoded as TicketPayload;
  } catch {
    return NextResponse.json(
      { valid: false, error: "Invalid or expired ticket" },
      { status: 400 }
    );
  }

  // Validate payload structure
  if (payload.type !== "event_ticket" || payload.eventId !== eventId) {
    return NextResponse.json(
      { valid: false, error: "Ticket does not match this event" },
      { status: 400 }
    );
  }

  // Find the registration
  const registration = await prisma.registration.findUnique({
    where: { id: payload.registrationId },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
      variant: {
        select: { id: true, name: true, distanceKm: true },
      },
    },
  });

  if (!registration) {
    return NextResponse.json(
      { valid: false, error: "Registration not found" },
      { status: 404 }
    );
  }

  if (registration.status !== "CONFIRMED") {
    return NextResponse.json({
      valid: false,
      error: "Registration is not confirmed",
      status: registration.status,
    });
  }

  // Verify the nonce — if the ticket was revoked, the nonce in the DB will
  // have been rotated and this check will fail, invalidating all old JWTs.
  if (registration.ticketNonce !== payload.nonce) {
    return NextResponse.json({
      valid: false,
      error: "Ticket has been revoked. Please request a new ticket.",
    });
  }

  // Check if already checked in
  const alreadyCheckedIn = !!registration.checkedInAt;

  // Perform check-in if not already done
  if (!alreadyCheckedIn) {
    await prisma.registration.update({
      where: { id: registration.id },
      data: { checkedInAt: new Date() },
    });
  }

  return NextResponse.json({
    valid: true,
    alreadyCheckedIn,
    checkedInAt: alreadyCheckedIn
      ? registration.checkedInAt?.toISOString()
      : new Date().toISOString(),
    registration: {
      id: registration.id,
      bibNumber: registration.bibNumber,
      status: registration.status,
      user: {
        name: registration.user.name,
        email: registration.user.email,
        image: registration.user.image,
      },
      variant: {
        name: registration.variant.name,
        distanceKm: registration.variant.distanceKm,
      },
    },
  });
}
