import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema for creating/updating participation
const participationSchema = z.object({
  eventId: z.string().cuid(),
  variantId: z.string().cuid().optional(),
  status: z.enum(["going", "interested", "not_going"]).default("going"),
});

// POST /api/participations - Create or update participation
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = participationSchema.parse(body);

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: validatedData.eventId },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // If variantId provided, check if it exists and belongs to the event
    if (validatedData.variantId) {
      const variant = await prisma.eventVariant.findFirst({
        where: {
          id: validatedData.variantId,
          eventId: validatedData.eventId,
        },
      });

      if (!variant) {
        return NextResponse.json(
          { error: "Variant not found or doesn't belong to this event" },
          { status: 404 }
        );
      }
    }

    // Upsert participation (create or update)
    const participation = await prisma.participation.upsert({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: validatedData.eventId,
        },
      },
      create: {
        userId: session.user.id,
        eventId: validatedData.eventId,
        variantId: validatedData.variantId,
        status: validatedData.status,
      },
      update: {
        variantId: validatedData.variantId,
        status: validatedData.status,
      },
      include: {
        variant: true,
      },
    });

    return NextResponse.json(participation, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating participation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/participations?eventId=xxx - Get participations for an event
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const userId = searchParams.get("userId");

    if (!eventId && !userId) {
      return NextResponse.json(
        { error: "eventId or userId is required" },
        { status: 400 }
      );
    }

    const where: { eventId?: string; userId?: string } = {};
    if (eventId) where.eventId = eventId;
    if (userId) where.userId = userId;

    const participations = await prisma.participation.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        variant: {
          select: {
            id: true,
            name: true,
            distance: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Count participants by status
    const counts = {
      going: participations.filter((p) => p.status === "going").length,
      interested: participations.filter((p) => p.status === "interested")
        .length,
      total: participations.length,
    };

    return NextResponse.json(
      {
        participations,
        counts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching participations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/participations?eventId=xxx - Remove participation
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json(
        { error: "eventId is required" },
        { status: 400 }
      );
    }

    await prisma.participation.delete({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: eventId,
        },
      },
    });

    return NextResponse.json(
      { message: "Participation removed" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting participation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
