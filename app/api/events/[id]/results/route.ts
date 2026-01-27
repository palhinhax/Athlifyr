import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SportType, PerformanceEntryType } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Determine performance entry type based on event sport types
function getPerformanceType(
  sportTypes: SportType[]
): PerformanceEntryType | null {
  // HYROX events go to HYROX tab
  if (sportTypes.includes(SportType.HYROX)) {
    return PerformanceEntryType.HYROX;
  }

  // Trail events go to TRAIL tab
  if (sportTypes.includes(SportType.TRAIL)) {
    return PerformanceEntryType.TRAIL;
  }

  // Road running events go to RUN tab
  if (
    sportTypes.includes(SportType.RUNNING) ||
    sportTypes.includes(SportType.WALKING)
  ) {
    return PerformanceEntryType.RUN;
  }

  // Triathlon - consider as RUN for now (mainly running focused)
  if (sportTypes.includes(SportType.TRIATHLON)) {
    return PerformanceEntryType.RUN;
  }

  return null;
}

// GET /api/events/[id]/results - Get user's results for an event
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId } = await params;

    // Get all results for this user and event
    const results = await prisma.result.findMany({
      where: {
        userId: session.user.id,
        eventId: eventId,
      },
      include: {
        variant: {
          select: {
            id: true,
            name: true,
            distanceKm: true,
          },
        },
        performanceEntry: {
          select: {
            id: true,
            type: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}

// POST /api/events/[id]/results - Create a new result
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId } = await params;
    const body = await request.json();
    const { variantId, time, position, categoryPosition, notes, isPublic } =
      body;

    // Validate time format (HH:MM:SS or MM:SS)
    if (!time || typeof time !== "string") {
      return NextResponse.json({ error: "Time is required" }, { status: 400 });
    }

    // Parse time to seconds
    const timeParts = time.split(":").map(Number);
    let timeSeconds: number;

    if (timeParts.length === 3) {
      // HH:MM:SS format
      timeSeconds = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
    } else if (timeParts.length === 2) {
      // MM:SS format
      timeSeconds = timeParts[0] * 60 + timeParts[1];
    } else {
      return NextResponse.json(
        { error: "Invalid time format. Use HH:MM:SS or MM:SS" },
        { status: 400 }
      );
    }

    // Get event details to determine performance type
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        sportTypes: true,
        startDate: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Get variant details if provided
    let variant = null;
    if (variantId) {
      variant = await prisma.eventVariant.findUnique({
        where: { id: variantId },
        select: {
          id: true,
          name: true,
          distanceKm: true,
          elevationGainM: true,
        },
      });
    }

    // Check if result already exists for this user, event, and variant
    const existingResult = await prisma.result.findFirst({
      where: {
        userId: session.user.id,
        eventId: eventId,
        variantId: variantId || null,
      },
    });

    if (existingResult) {
      return NextResponse.json(
        { error: "Result already exists for this event variant" },
        { status: 409 }
      );
    }

    // Determine performance entry type
    const performanceType = getPerformanceType(event.sportTypes);

    // Create result and optionally linked performance entry in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the Result
      const newResult = await tx.result.create({
        data: {
          userId: session.user.id,
          eventId: eventId,
          variantId: variantId || null,
          time: time,
          timeSeconds: timeSeconds,
          position: position || null,
          categoryPosition: categoryPosition || null,
          notes: notes || null,
          isPublic: isPublic ?? true,
        },
        include: {
          variant: {
            select: {
              id: true,
              name: true,
              distanceKm: true,
            },
          },
        },
      });

      // 2. Create linked UserPerformanceEntry if it's a trackable sport
      if (performanceType) {
        await tx.userPerformanceEntry.create({
          data: {
            userId: session.user.id,
            type: performanceType,
            performedAt: event.startDate,
            distanceKm: variant?.distanceKm || null,
            timeSeconds: timeSeconds,
            elevationGainM: variant?.elevationGainM || null,
            resultId: newResult.id,
            qualityScore: 0.8, // Higher quality for official event results
            predictionWeight: 0.9,
          },
        });
      }

      return newResult;
    });

    return NextResponse.json({ result }, { status: 201 });
  } catch (error) {
    console.error("Error creating result:", error);
    return NextResponse.json(
      { error: "Failed to create result" },
      { status: 500 }
    );
  }
}

// PUT /api/events/[id]/results - Update an existing result
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId } = await params;
    const body = await request.json();
    const { variantId, time, position, categoryPosition, notes, isPublic } =
      body;

    // Find existing result
    const existingResult = await prisma.result.findFirst({
      where: {
        userId: session.user.id,
        eventId: eventId,
        variantId: variantId || null,
      },
      include: {
        performanceEntry: true,
      },
    });

    if (!existingResult) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    // Parse time to seconds if time is provided
    let timeSeconds: number | undefined;
    if (time) {
      const timeParts = time.split(":").map(Number);
      if (timeParts.length === 3) {
        timeSeconds = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
      } else if (timeParts.length === 2) {
        timeSeconds = timeParts[0] * 60 + timeParts[1];
      }
    }

    // Update result and linked performance entry in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update the Result
      const updatedResult = await tx.result.update({
        where: { id: existingResult.id },
        data: {
          time: time || existingResult.time,
          timeSeconds: timeSeconds ?? existingResult.timeSeconds,
          position: position !== undefined ? position : existingResult.position,
          categoryPosition:
            categoryPosition !== undefined
              ? categoryPosition
              : existingResult.categoryPosition,
          notes: notes !== undefined ? notes : existingResult.notes,
          isPublic: isPublic !== undefined ? isPublic : existingResult.isPublic,
        },
        include: {
          variant: {
            select: {
              id: true,
              name: true,
              distanceKm: true,
            },
          },
        },
      });

      // 2. Update linked UserPerformanceEntry if it exists
      const linkedEntry = await tx.userPerformanceEntry.findFirst({
        where: { resultId: existingResult.id },
      });

      if (linkedEntry && timeSeconds) {
        await tx.userPerformanceEntry.update({
          where: { id: linkedEntry.id },
          data: {
            timeSeconds: timeSeconds,
          },
        });
      }

      return updatedResult;
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error updating result:", error);
    return NextResponse.json(
      { error: "Failed to update result" },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id]/results - Delete a result
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId } = await params;
    const { searchParams } = new URL(request.url);
    const variantId = searchParams.get("variantId");

    // Find existing result
    const existingResult = await prisma.result.findFirst({
      where: {
        userId: session.user.id,
        eventId: eventId,
        variantId: variantId || null,
      },
    });

    if (!existingResult) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    // Delete result and linked performance entry in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete linked performance entry first (if exists)
      await tx.userPerformanceEntry.deleteMany({
        where: { resultId: existingResult.id },
      });

      // Delete the result
      await tx.result.delete({
        where: { id: existingResult.id },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting result:", error);
    return NextResponse.json(
      { error: "Failed to delete result" },
      { status: 500 }
    );
  }
}
