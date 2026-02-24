import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { trackServerEvent, ANALYTICS_EVENTS } from "@/lib/analytics";
import { logEventParticipation } from "@/lib/sentry-logger";

// Schema for creating/updating participation
const participationSchema = z.object({
  eventId: z.string().cuid(),
  variantId: z.string().cuid().optional(),
  status: z.enum(["going", "interested", "not_going", "went"]).default("going"),
  completionTime: z.number().int().positive().optional().nullable(),
});

// POST /api/participations - Create or update participation
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user?.id) {
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
          userId: user.id,
          eventId: validatedData.eventId,
        },
      },
      create: {
        userId: user.id,
        eventId: validatedData.eventId,
        variantId: validatedData.variantId,
        status: validatedData.status,
        completionTime: validatedData.completionTime,
      },
      update: {
        variantId: validatedData.variantId,
        status: validatedData.status,
        completionTime: validatedData.completionTime,
      },
      include: {
        variant: true,
      },
    });

    // Track event registration
    if (validatedData.status === "going") {
      await trackServerEvent(
        ANALYTICS_EVENTS.EVENT_REGISTER,
        {
          eventId: validatedData.eventId,
          userId: user.id,
          variantId: validatedData.variantId || null,
          eventTitle: event.title,
        },
        user.email
      );
    }

    logEventParticipation({
      userId: user.id,
      eventId: validatedData.eventId,
      status: validatedData.status,
      variantId: validatedData.variantId,
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
            distanceKm: true,
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
    const user = await getAuthenticatedUser(request);

    if (!user?.id) {
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
          userId: user.id,
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

// PATCH /api/participations - Update participation details (e.g., completion time)
export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { eventId, completionTime } = body;

    if (!eventId) {
      return NextResponse.json(
        { error: "eventId is required" },
        { status: 400 }
      );
    }

    // Update participation with new completion time
    const participation = await prisma.participation.update({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId: eventId,
        },
      },
      data: {
        completionTime: completionTime || null,
      },
      include: {
        variant: true,
      },
    });

    return NextResponse.json(participation, { status: 200 });
  } catch (error) {
    console.error("Error updating participation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
