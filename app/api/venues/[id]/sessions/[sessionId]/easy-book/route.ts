import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";
import { z } from "zod";

const easyBookSchema = z.object({
  guestName: z.string().min(1, "Name is required").max(100),
  guestEmail: z.string().email("Invalid email address"),
  guestPhone: z.string().min(1, "Phone is required").max(50),
});

// POST - Create an easy booking (no authentication required for guest bookings)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; sessionId: string }> }
) {
  try {
    const { id: venueId, sessionId } = await params;

    // 1. Verify the venue exists
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
      select: {
        id: true,
        name: true,
        requiresPlanToBook: true,
        isActive: true,
      },
    });

    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    if (!venue.isActive) {
      return NextResponse.json(
        { error: "Venue is not active" },
        { status: 403 }
      );
    }

    // 2. If venue requires plan, don't allow guest bookings
    if (venue.requiresPlanToBook) {
      return NextResponse.json(
        {
          error: "This venue requires an account and active plan to book",
          reason: "PLAN_REQUIRED",
        },
        { status: 403 }
      );
    }

    // 2. Parse and validate the request body
    const body = await request.json();
    const validation = easyBookSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { guestName, guestEmail, guestPhone } = validation.data;

    // 3. Get session details
    const session = await prisma.venueSession.findUnique({
      where: { id: sessionId },
      include: {
        bookings: {
          where: {
            status: {
              in: [BookingStatus.BOOKED, BookingStatus.ATTENDED],
            },
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found", reason: "SESSION_NOT_FOUND" },
        { status: 404 }
      );
    }

    // 4. Verify session belongs to the venue
    if (session.venueId !== venueId) {
      return NextResponse.json(
        { error: "Session does not belong to this venue" },
        { status: 400 }
      );
    }

    // 5. Check if session is in the future
    if (session.startsAt < new Date()) {
      return NextResponse.json(
        { error: "Cannot book past sessions", reason: "SESSION_PAST" },
        { status: 400 }
      );
    }

    // 6. Check if session is full
    if (session.capacity && session.bookings.length >= session.capacity) {
      return NextResponse.json(
        { error: "Session is full", reason: "SESSION_FULL" },
        { status: 400 }
      );
    }

    // 7. Check for existing booking with same email
    const existingBooking = await prisma.venueBooking.findFirst({
      where: {
        sessionId,
        guestEmail: guestEmail.toLowerCase(),
        status: {
          in: [BookingStatus.BOOKED, BookingStatus.ATTENDED],
        },
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "Already booked", reason: "ALREADY_BOOKED" },
        { status: 400 }
      );
    }

    // 8. Create the booking
    const booking = await prisma.venueBooking.create({
      data: {
        venueId,
        sessionId,
        userId: null, // No user, guest booking
        status: BookingStatus.BOOKED,
        guestName,
        guestEmail: guestEmail.toLowerCase(),
        guestPhone,
        isEasyBooking: true,
      },
      include: {
        session: {
          select: {
            title: true,
            startsAt: true,
            endsAt: true,
          },
        },
        venue: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    // TODO: Send confirmation email to guest
    // await sendEasyBookConfirmationEmail({
    //   guestName,
    //   guestEmail,
    //   venueName: booking.venue.name,
    //   sessionTitle: booking.session.title,
    //   sessionDate: booking.session.startsAt,
    // });

    return NextResponse.json(
      {
        success: true,
        booking: {
          id: booking.id,
          guestName: booking.guestName,
          guestEmail: booking.guestEmail,
          session: booking.session,
          venue: booking.venue,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating easy booking:", error);

    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
