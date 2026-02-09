import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingStatus, BookingType } from "@prisma/client";

// POST - Accept a trial booking request
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: bookingId } = await params;
    const userId = session.user.id;

    // 1. Get the booking and verify it exists and is a trial booking
    const booking = await prisma.venueBooking.findUnique({
      where: { id: bookingId },
      include: {
        venue: {
          select: {
            id: true,
            createdByUserId: true,
            members: {
              where: {
                userId: userId,
                role: {
                  in: ["OWNER", "ADMIN"],
                },
              },
            },
          },
        },
        session: {
          include: {
            bookings: {
              where: {
                status: {
                  in: [BookingStatus.BOOKED, BookingStatus.ATTENDED],
                },
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.bookingType !== BookingType.TRIAL) {
      return NextResponse.json(
        { error: "This is not a trial booking" },
        { status: 400 }
      );
    }

    if (booking.status !== BookingStatus.PENDING) {
      return NextResponse.json(
        { error: "This booking request has already been processed" },
        { status: 400 }
      );
    }

    // 2. Check if user is owner or admin
    const isOwnerOrAdmin =
      booking.venue.createdByUserId === userId ||
      booking.venue.members.length > 0;

    if (!isOwnerOrAdmin) {
      return NextResponse.json(
        { error: "You do not have permission to accept this booking" },
        { status: 403 }
      );
    }

    // 3. Check if session has already started
    if (booking.session.startsAt <= new Date()) {
      return NextResponse.json(
        {
          error: "Cannot accept booking for a session that has already started",
        },
        { status: 400 }
      );
    }

    // 4. Check capacity (exclude the current pending booking from count)
    const confirmedBookingsCount = booking.session.bookings.filter(
      (b) => b.id !== bookingId
    ).length;

    if (
      booking.session.capacity !== null &&
      confirmedBookingsCount >= booking.session.capacity
    ) {
      return NextResponse.json({ error: "Session is full" }, { status: 400 });
    }

    // 5. Accept the booking by changing status to BOOKED
    const updatedBooking = await prisma.venueBooking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.BOOKED,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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

    return NextResponse.json(
      {
        message: "Trial booking accepted successfully",
        booking: updatedBooking,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error accepting trial booking:", error);
    return NextResponse.json(
      { error: "Failed to accept trial booking" },
      { status: 500 }
    );
  }
}
