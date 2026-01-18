import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";

// POST - Cancel booking
export async function POST(
  request: Request,
  { params }: { params: { id: string; bookingId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId, bookingId } = params;

    // Find booking
    const booking = await prisma.venueBooking.findUnique({
      where: { id: bookingId },
      include: {
        session: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check if booking belongs to the venue
    if (booking.venueId !== venueId) {
      return NextResponse.json({ error: "Invalid venue" }, { status: 400 });
    }

    // Check if user owns the booking
    if (booking.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if booking can be cancelled
    if (booking.status === BookingStatus.CANCELLED) {
      return NextResponse.json(
        { error: "Booking is already cancelled" },
        { status: 400 }
      );
    }

    if (booking.status === BookingStatus.ATTENDED) {
      return NextResponse.json(
        { error: "Cannot cancel attended session" },
        { status: 400 }
      );
    }

    // Check if session has already started
    if (booking.session.startsAt < new Date()) {
      return NextResponse.json(
        { error: "Cannot cancel session that has already started" },
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
