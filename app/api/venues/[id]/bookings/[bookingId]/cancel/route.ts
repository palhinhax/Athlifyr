import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";
import { validateCancellation } from "@/lib/venues/booking-validation";

// POST - Cancel booking
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; bookingId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId, bookingId } = await params;

    // Find booking to check venue ownership
    const booking = await prisma.venueBooking.findUnique({
      where: { id: bookingId },
      select: {
        venueId: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check if booking belongs to the venue
    if (booking.venueId !== venueId) {
      return NextResponse.json({ error: "Invalid venue" }, { status: 400 });
    }

    // Validate cancellation using plan policy
    const validation = await validateCancellation(session.user.id, bookingId);

    if (!validation.allowed) {
      // Map validation reasons to user-friendly error messages
      const errorMessages: Record<string, string> = {
        BOOKING_NOT_FOUND: "Booking not found",
        NOT_BOOKING_OWNER: "You can only cancel your own bookings",
        ALREADY_CANCELLED: "Booking is already cancelled",
        ALREADY_ATTENDED: "Cannot cancel attended session",
        SESSION_ALREADY_STARTED:
          "Cannot cancel session that has already started",
        CANCELLATION_NOT_ALLOWED: "Your plan does not allow cancellations",
        CANCELLATION_DEADLINE_PASSED: `Must cancel at least ${validation.minimumHours} hours before the session`,
      };

      return NextResponse.json(
        {
          error:
            errorMessages[validation.reason || ""] || "Cannot cancel booking",
          reason: validation.reason,
          minimumHours: validation.minimumHours,
        },
        { status: 400 }
      );
    }

    // Cancel booking
    const cancelledBooking = await prisma.venueBooking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
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

    return NextResponse.json(cancelledBooking);
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
