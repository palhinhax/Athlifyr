import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateBooking } from "@/lib/venues/booking-validation";
import { trackServerEvent, ANALYTICS_EVENTS } from "@/lib/analytics";

// POST - Book a session
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; sessionId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId, sessionId } = await params;
    const userId = session.user.id;

    // Validate booking
    const validation = await validateBooking(userId, venueId, sessionId);

    if (!validation.allowed) {
      // Track booking failure
      await trackServerEvent(
        ANALYTICS_EVENTS.BOOKING_FAILED,
        {
          venueId,
          sessionId,
          userId,
          reason: validation.reason || "validation_failed",
        },
        session.user.email
      );

      return NextResponse.json(
        {
          error: "Booking not allowed",
          reason: validation.reason,
          minimumHours: validation.minimumHours,
        },
        { status: 400 }
      );
    }

    // Check if user already has a booking for this session
    const existingBooking = await prisma.venueBooking.findFirst({
      where: {
        sessionId,
        userId,
      },
    });

    let booking;
    if (existingBooking) {
      // Reactivate existing booking
      booking = await prisma.venueBooking.update({
        where: {
          id: existingBooking.id,
        },
        data: {
          status: "BOOKED",
        },
        include: {
          session: {
            include: {
              venue: {
                select: {
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      });
    } else {
      // Create new booking
      booking = await prisma.venueBooking.create({
        data: {
          venueId,
          sessionId,
          userId,
          status: "BOOKED",
        },
        include: {
          session: {
            include: {
              venue: {
                select: {
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      });
    }

    // Track successful booking
    await trackServerEvent(
      ANALYTICS_EVENTS.BOOKING_COMPLETED,
      {
        venueId,
        sessionId,
        userId,
        venueName: booking.session.venue.name,
      },
      session.user.email
    );

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);

    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

// DELETE - Cancel booking for a session
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; sessionId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId, sessionId } = await params;
    const userId = session.user.id;

    // Find the booking
    const booking = await prisma.venueBooking.findFirst({
      where: {
        venueId,
        sessionId,
        userId,
        status: {
          in: ["BOOKED"],
        },
      },
      include: {
        session: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check if session has already started
    if (booking.session.startsAt < new Date()) {
      return NextResponse.json(
        { error: "Cannot cancel session that has already started" },
        { status: 400 }
      );
    }

    // Cancel the booking
    await prisma.venueBooking.update({
      where: { id: booking.id },
      data: { status: "CANCELLED" },
    });

    // Track cancellation
    await trackServerEvent(
      ANALYTICS_EVENTS.BOOKING_CANCELLED,
      {
        venueId,
        sessionId,
        userId,
        bookingId: booking.id,
      },
      session.user.email
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
