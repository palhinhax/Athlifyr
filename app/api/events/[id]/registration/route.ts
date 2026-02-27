import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/events/[id]/registration — fetch current user's confirmed registration for an event
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ registration: null });
  }

  const { id: eventId } = await params;

  try {
    const registration = await prisma.registration.findFirst({
      where: {
        userId: session.user.id,
        eventId,
        status: "CONFIRMED",
      },
      select: {
        id: true,
        bibNumber: true,
        status: true,
        amountCents: true,
        currency: true,
        createdAt: true,
        variant: {
          select: {
            name: true,
            distanceKm: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ registration });
  } catch (error) {
    console.error("Error fetching registration:", error);
    return NextResponse.json(
      { error: "Failed to fetch registration" },
      { status: 500 }
    );
  }
}
