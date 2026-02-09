import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingStatus, BookingType } from "@prisma/client";

// POST - Reject a trial booking request
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

    // Optional: Get rejection reason from body
    const body = await request.json().catch(() => ({}));
    const { reason } = body;

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
        { error: "You do not have permission to reject this booking" },
        { status: 403 }
      );
    }

    // 3. Reject the booking by changing status to REJECTED
    const updatedBooking = await prisma.venueBooking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.REJECTED,
        notes: reason ? `Rejected: ${reason}` : booking.notes,
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
        message: "Trial booking rejected successfully",
        booking: updatedBooking,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error rejecting trial booking:", error);
    return NextResponse.json(
      { error: "Failed to reject trial booking" },
      { status: 500 }
    );
  }
}
