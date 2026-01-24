import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - List user's bookings for a venue
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId } = await params;
    const userId = session.user.id;

    // Fetch user's bookings for this venue (only active bookings)
    const bookings = await prisma.venueBooking.findMany({
      where: {
        venueId,
        userId,
        status: {
          in: ["BOOKED", "ATTENDED"],
        },
      },
      include: {
        session: {
          select: {
            id: true,
            title: true,
            startsAt: true,
            endsAt: true,
            type: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
