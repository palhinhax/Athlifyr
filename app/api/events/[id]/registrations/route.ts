import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET - Fetch the current user's registration for an event
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId } = await params;

    const registration = await prisma.registration.findFirst({
      where: {
        userId: session.user.id,
        eventId,
      },
      select: {
        id: true,
        status: true,
        variantId: true,
        amountCents: true,
        currency: true,
        createdAt: true,
        variant: {
          select: {
            id: true,
            name: true,
            distanceKm: true,
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
