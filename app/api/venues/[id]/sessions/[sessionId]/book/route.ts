import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateBooking } from "@/lib/venues/booking-validation";

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
