import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateBooking } from "@/lib/venues/booking-validation";
import { trackServerEvent, ANALYTICS_EVENTS } from "@/lib/analytics";

// POST - Book a session
export async function POST(
  request: Request,
  { params }: { params: { id: string; sessionId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId, sessionId } = params;
    const userId = session.user.id;

    // Validate booking
    const validation = await validateBooking(userId, venueId, sessionId);

    if (!validation.allowed) {
      // Track booking failure
      await trackServerEvent(ANALYTICS_EVENTS.BOOKING_FAILED, {
        venueId,
        sessionId,
        userId,
        reason: validation.reason || "validation_failed",
      });

      return NextResponse.json(
        {
          error: "Booking not allowed",
          reason: validation.reason,
        },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await prisma.venueBooking.create({
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

    // Track successful booking
    await trackServerEvent(ANALYTICS_EVENTS.BOOKING_COMPLETED, {
      venueId,
      sessionId,
      userId,
      venueName: booking.session.venue.name,
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);

    // Handle unique constraint violation (already booked)
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          error: "Booking already exists",
          reason: "ALREADY_BOOKED",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
