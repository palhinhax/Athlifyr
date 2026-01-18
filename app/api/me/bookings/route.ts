import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Get user's bookings
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.venueBooking.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        session: {
          include: {
            venue: {
              select: {
                id: true,
                name: true,
                slug: true,
                city: true,
              },
            },
          },
        },
      },
      orderBy: {
        session: {
          startsAt: "desc",
        },
      },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
