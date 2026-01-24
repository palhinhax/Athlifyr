import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageSessions } from "@/lib/venues/authorization";
import { addWeeks, format } from "date-fns";

// PATCH - Update recurring session (pause/resume, edit details)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; recurringId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId, recurringId } = await params;

    // Check authorization
    const authResult = await canManageSessions(session.user.id, venueId);
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: "Forbidden", reason: authResult.reason },
        { status: 403 }
      );
    }

    // Verify recurring session exists and belongs to this venue
    const existingRecurring = await prisma.venueRecurringSession.findFirst({
      where: {
        id: recurringId,
        venueId,
      },
    });

    if (!existingRecurring) {
      return NextResponse.json(
        { error: "Recurring session not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { isActive, title, description, capacity, tags } = body;

    // Update the recurring template
    const updatedRecurring = await prisma.venueRecurringSession.update({
      where: { id: recurringId },
      data: {
        ...(isActive !== undefined && { isActive }),
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(capacity !== undefined && { capacity }),
        ...(tags !== undefined && { tags }),
      },
    });

    return NextResponse.json({ recurringSession: updatedRecurring });
  } catch (error) {
    console.error("Error updating recurring session:", error);
    return NextResponse.json(
      { error: "Failed to update recurring session" },
      { status: 500 }
    );
  }
}

// DELETE - Cancel recurring session and optionally future sessions
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; recurringId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId, recurringId } = await params;

    // Check authorization
    const authResult = await canManageSessions(session.user.id, venueId);
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: "Forbidden", reason: authResult.reason },
        { status: 403 }
      );
    }

    // Verify recurring session exists and belongs to this venue
    const existingRecurring = await prisma.venueRecurringSession.findFirst({
      where: {
        id: recurringId,
        venueId,
      },
    });

    if (!existingRecurring) {
      return NextResponse.json(
        { error: "Recurring session not found" },
        { status: 404 }
      );
    }

    // Check if we should delete future sessions too
    const url = new URL(request.url);
    const deleteFutureSessions =
      url.searchParams.get("deleteFutureSessions") === "true";

    if (deleteFutureSessions) {
      // Delete all future sessions that don't have bookings
      await prisma.venueSession.deleteMany({
        where: {
          recurringSessionId: recurringId,
          startsAt: {
            gte: new Date(),
          },
          bookings: {
            none: {},
          },
        },
      });

      // For sessions with bookings, unlink them from the recurring template
      await prisma.venueSession.updateMany({
        where: {
          recurringSessionId: recurringId,
          startsAt: {
            gte: new Date(),
          },
        },
        data: {
          recurringSessionId: null,
        },
      });
    }

    // Delete the recurring template
    await prisma.venueRecurringSession.delete({
      where: { id: recurringId },
    });

    return NextResponse.json({
      message: "Recurring session deleted",
      deletedFutureSessions: deleteFutureSessions,
    });
  } catch (error) {
    console.error("Error deleting recurring session:", error);
    return NextResponse.json(
      { error: "Failed to delete recurring session" },
      { status: 500 }
    );
  }
}

// POST - Manually generate more sessions for a recurring template
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; recurringId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId, recurringId } = await params;

    // Check authorization
    const authResult = await canManageSessions(session.user.id, venueId);
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: "Forbidden", reason: authResult.reason },
        { status: 403 }
      );
    }

    // Get the recurring template
    const recurring = await prisma.venueRecurringSession.findFirst({
      where: {
        id: recurringId,
        venueId,
        isActive: true,
      },
    });

    if (!recurring) {
      return NextResponse.json(
        { error: "Active recurring session not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const weeksToGenerate = Math.min(body.weeks || 12, 52); // Default 12 weeks, max 52

    // Calculate the start date for new sessions
    const startFrom = recurring.generatedUntil
      ? addWeeks(recurring.generatedUntil, 1)
      : new Date();

    // Find the first occurrence of the day of week from startFrom
    let currentDate = new Date(startFrom);
    while (currentDate.getDay() !== recurring.dayOfWeek) {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const generationLimit = addWeeks(currentDate, weeksToGenerate);
    const sessionsToCreate = [];

    while (currentDate <= generationLimit) {
      const [startHour, startMinute] = recurring.startTime
        .split(":")
        .map(Number);
      const [endHour, endMinute] = recurring.endTime.split(":").map(Number);

      const sessionStart = new Date(currentDate);
      sessionStart.setHours(startHour, startMinute, 0, 0);

      const sessionEnd = new Date(currentDate);
      sessionEnd.setHours(endHour, endMinute, 0, 0);

      sessionsToCreate.push({
        venueId,
        recurringSessionId: recurring.id,
        type: recurring.type,
        title: recurring.title,
        description: recurring.description,
        startsAt: sessionStart,
        endsAt: sessionEnd,
        capacity: recurring.capacity,
        coachId: recurring.coachId,
        serviceId: recurring.serviceId,
        tags: recurring.tags,
      });

      // Move to next week
      currentDate = addWeeks(currentDate, 1);
    }

    if (sessionsToCreate.length === 0) {
      return NextResponse.json({
        message: "No new sessions to generate",
        count: 0,
      });
    }

    // Batch create all sessions
    const result = await prisma.venueSession.createMany({
      data: sessionsToCreate,
    });

    // Update the template with how far we've generated
    await prisma.venueRecurringSession.update({
      where: { id: recurring.id },
      data: { generatedUntil: generationLimit },
    });

    return NextResponse.json({
      message: "Sessions generated",
      count: result.count,
      generatedUntil: format(generationLimit, "yyyy-MM-dd"),
    });
  } catch (error) {
    console.error("Error generating sessions:", error);
    return NextResponse.json(
      { error: "Failed to generate sessions" },
      { status: 500 }
    );
  }
}
