import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

// Ensure this route is always dynamic (never cached by Next.js)
export const dynamic = "force-dynamic";

// GET - List user's bookings for a venue
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId } = await params;
    const userId = user.id;

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

    return NextResponse.json(
      { bookings },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
