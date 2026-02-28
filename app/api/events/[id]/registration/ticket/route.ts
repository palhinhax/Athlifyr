import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

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

export interface TicketPayload {
  registrationId: string;
  userId: string;
  eventId: string;
  variantId: string;
  nonce: string; // Rotated on revocation — old tokens become invalid immediately
  type: "event_ticket";
}

// GET /api/events/[id]/registration/ticket — generate signed ticket token
export async function GET(req: NextRequest, { params }: RouteParams) {
  const { id: eventId } = await params;

  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find confirmed registration for this user+event.
  // Two cases:
  //   1. Direct registration — userId matches (leader or individual)
  //   2. Guest registration  — user registered by someone else; their email is in guestEmail
  const registration = await prisma.registration.findFirst({
    where: {
      eventId,
      status: "CONFIRMED",
      OR: [{ userId: user.id }, { guestEmail: user.email, teamRole: "MEMBER" }],
    },
    include: {
      variant: {
        select: {
          id: true,
          name: true,
          distanceKm: true,
          startDate: true,
          startTime: true,
        },
      },
      event: {
        select: {
          id: true,
          title: true,
          slug: true,
          startDate: true,
          city: true,
          country: true,
          imageUrl: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  if (!registration) {
    return NextResponse.json(
      { error: "No confirmed registration found" },
      { status: 404 }
    );
  }

  // Generate a signed JWT token for the QR code.
  // No expiration — the ticket is valid as long as the registration exists.
  // Security is enforced at verify-time by checking the DB status in real-time.
  // IMPORTANT: noTimestamp: true ensures the token (and QR code) is always identical
  // for the same registration — without it, jwt.sign() adds an `iat` field with the
  // current timestamp, producing a different QR code on every request.
  const ticketToken = jwt.sign(
    {
      registrationId: registration.id,
      userId: user.id,
      eventId,
      variantId: registration.variantId,
      nonce: registration.ticketNonce,
      type: "event_ticket",
    } satisfies TicketPayload,
    getTicketSecret(),
    { noTimestamp: true }
  );

  // For guest registrations, use the guest's own name/email for display.
  // For direct registrations, use the account data.
  const isGuestRegistration =
    registration.teamRole === "MEMBER" &&
    registration.guestEmail === user.email;
  const displayName = isGuestRegistration
    ? (registration.guestName ?? user.name)
    : registration.user.name;
  const displayEmail = isGuestRegistration
    ? registration.guestEmail!
    : registration.user.email;
  const displayImage = isGuestRegistration
    ? user.image
    : registration.user.image;

  return NextResponse.json({
    ticket: {
      token: ticketToken,
      registrationId: registration.id,
      bibNumber: registration.bibNumber,
      checkedInAt: registration.checkedInAt?.toISOString() ?? null,
      amountCents: registration.amountCents,
      currency: registration.currency,
      status: registration.status,
      createdAt: registration.createdAt.toISOString(),
      user: {
        name: displayName,
        email: displayEmail,
        image: displayImage,
      },
      event: {
        title: registration.event.title,
        slug: registration.event.slug,
        startDate: registration.event.startDate?.toISOString() ?? null,
        city: registration.event.city,
        country: registration.event.country,
        imageUrl: registration.event.imageUrl,
      },
      variant: {
        name: registration.variant.name,
        distanceKm: registration.variant.distanceKm,
        startDate: registration.variant.startDate?.toISOString() ?? null,
        startTime: registration.variant.startTime,
      },
    },
  });
}
