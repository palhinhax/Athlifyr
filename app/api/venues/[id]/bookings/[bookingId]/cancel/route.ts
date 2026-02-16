import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";
import { validateCancellation } from "@/lib/venues/booking-validation";

// POST - Cancel booking
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; bookingId: string }> }
) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      console.error("[Cancellation] Unauthorized access attempt", {
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId, bookingId } = await params;
    const userId = user.id;

    console.log("[Cancellation] Request received", {
      venueId,
      bookingId,
      userId,
      userEmail: user.email,
      timestamp: new Date().toISOString(),
    });

    // Find booking to check venue ownership
    const booking = await prisma.venueBooking.findUnique({
      where: { id: bookingId },
      select: {
        venueId: true,
        userId: true,
        status: true,
        sessionId: true,
      },
    });

    if (!booking) {
      console.error("[Cancellation] Booking not found", {
        bookingId,
        venueId,
        userId,
      });
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    console.log("[Cancellation] Booking found", {
      bookingId,
      bookingVenueId: booking.venueId,
      requestVenueId: venueId,
      bookingUserId: booking.userId,
      requestUserId: userId,
      bookingStatus: booking.status,
      sessionId: booking.sessionId,
    });

    // Check if booking belongs to the venue
    if (booking.venueId !== venueId) {
      console.error("[Cancellation] Venue mismatch", {
        bookingId,
        bookingVenueId: booking.venueId,
        requestVenueId: venueId,
        userId,
      });
      return NextResponse.json({ error: "Invalid venue" }, { status: 400 });
    }

    // Validate cancellation using plan policy
    const validation = await validateCancellation(userId, bookingId);

    if (!validation.allowed) {
      console.warn("[Cancellation] Validation failed", {
        bookingId,
        venueId,
        userId,
        reason: validation.reason,
        minimumMinutes: validation.minimumMinutes,
        bookingStatus: booking.status,
      });

      // Map validation reasons to user-friendly error messages
      const errorMessages: Record<string, string> = {
        BOOKING_NOT_FOUND: "Booking not found",
        NOT_BOOKING_OWNER: "You can only cancel your own bookings",
        ALREADY_CANCELLED: "Booking is already cancelled",
        ALREADY_ATTENDED: "Cannot cancel attended session",
        SESSION_ALREADY_STARTED:
          "Cannot cancel session that has already started",
        CANCELLATION_NOT_ALLOWED: "Your plan does not allow cancellations",
        CANCELLATION_DEADLINE_PASSED: `Must cancel at least ${validation.minimumMinutes} minutes before the session`,
      };

      return NextResponse.json(
        {
          error:
            errorMessages[validation.reason || ""] || "Cannot cancel booking",
          reason: validation.reason,
          minimumMinutes: validation.minimumMinutes,
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

    console.log("[Cancellation] Success", {
      bookingId,
      venueId,
      userId,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(cancelledBooking);
  } catch (error) {
    console.error("[Cancellation] Error cancelling booking", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      bookingId: params.then((p) => p.bookingId).catch(() => "unknown"),
      venueId: params.then((p) => p.id).catch(() => "unknown"),
    });
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
