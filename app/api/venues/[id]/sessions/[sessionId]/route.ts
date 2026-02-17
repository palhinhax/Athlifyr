import { NextResponse, NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { canManageSessions } from "@/lib/venues/authorization";
import { SessionType } from "@prisma/client";

interface RouteParams {
  params: Promise<{
    id: string;
    sessionId: string;
  }>;
}

// GET - Get a single session
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: venueId, sessionId } = await params;

    const session = await prisma.venueSession.findFirst({
      where: {
        id: sessionId,
        venueId,
      },
      include: {
        _count: {
          select: {
            bookings: {
              where: {
                status: {
                  in: ["BOOKED", "ATTENDED"],
                },
              },
            },
          },
        },
        bookings: {
          where: {
            status: {
              in: ["BOOKED", "ATTENDED"],
            },
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    );
  }
}

// PUT - Update a session (owner/admin/coach only)
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId, sessionId } = await params;

    // Check authorization
    const authResult = await canManageSessions(authUser.id, venueId);
    if (!authResult.authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if session exists
    const existingSession = await prisma.venueSession.findFirst({
      where: {
        id: sessionId,
        venueId,
      },
    });

    if (!existingSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      type,
      title,
      description,
      startsAt,
      endsAt,
      capacity,
      coachId,
      serviceId,
      tags,
      bookingAdvanceDays,
      cancellationDeadlineMinutes,
    } = body;

    // Validate required fields
    if (!type || !title || !startsAt || !endsAt) {
      return NextResponse.json(
        { error: "Type, title, startsAt, and endsAt are required" },
        { status: 400 }
      );
    }

    // Validate session type
    if (!Object.values(SessionType).includes(type)) {
      return NextResponse.json(
        { error: "Invalid session type" },
        { status: 400 }
      );
    }

    // Update session
    const updatedSession = await prisma.venueSession.update({
      where: {
        id: sessionId,
      },
      data: {
        type,
        title,
        description: description || null,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        capacity: capacity || null,
        coachId: coachId || null,
        serviceId: serviceId || null,
        tags: tags || [],
        bookingAdvanceDays: bookingAdvanceDays ?? 4,
        cancellationDeadlineMinutes: cancellationDeadlineMinutes ?? 30,
      },
    });

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a session (owner/admin/coach only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId, sessionId } = await params;

    // Check for query params
    const searchParams = request.nextUrl.searchParams;
    const deleteFuture = searchParams.get("deleteFuture") === "true";
    const deleteRecurring = searchParams.get("deleteRecurring") === "true";

    // Check authorization
    const authResult = await canManageSessions(authUser.id, venueId);
    if (!authResult.authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if session exists
    const existingSession = await prisma.venueSession.findFirst({
      where: {
        id: sessionId,
        venueId,
      },
      include: {
        _count: {
          select: {
            bookings: {
              where: {
                status: "BOOKED",
              },
            },
          },
        },
      },
    });

    if (!existingSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Check if session is in the past - cannot delete past sessions
    const now = new Date();
    if (new Date(existingSession.startsAt) < now) {
      return NextResponse.json(
        { error: "Cannot delete past sessions" },
        { status: 400 }
      );
    }

    // If deleteRecurring is true, delete the recurring template and all future sessions
    if (deleteRecurring && existingSession.recurringSessionId) {
      // Count active bookings in all future sessions of this recurring
      const futureBookingsCount = await prisma.venueBooking.count({
        where: {
          session: {
            recurringSessionId: existingSession.recurringSessionId,
            startsAt: { gte: existingSession.startsAt },
          },
          status: "BOOKED",
        },
      });

      if (futureBookingsCount > 0) {
        return NextResponse.json(
          {
            error: "Cannot delete recurring with active bookings",
            activeBookings: futureBookingsCount,
          },
          { status: 400 }
        );
      }

      // Delete all future sessions of this recurring (including this one)
      const deleted = await prisma.venueSession.deleteMany({
        where: {
          recurringSessionId: existingSession.recurringSessionId,
          startsAt: { gte: existingSession.startsAt },
        },
      });

      // Delete the recurring template itself
      await prisma.venueRecurringSession.delete({
        where: { id: existingSession.recurringSessionId },
      });

      return NextResponse.json({
        success: true,
        deletedRecurring: true,
        deletedCount: deleted.count,
      });
    }

    // If deleteFuture is true, delete this and all future sessions of the same recurring
    if (deleteFuture && existingSession.recurringSessionId) {
      // Count active bookings in all future sessions
      const futureBookingsCount = await prisma.venueBooking.count({
        where: {
          session: {
            recurringSessionId: existingSession.recurringSessionId,
            startsAt: { gte: existingSession.startsAt },
          },
          status: "BOOKED",
        },
      });

      if (futureBookingsCount > 0) {
        return NextResponse.json(
          {
            error: "Cannot delete sessions with active bookings",
            activeBookings: futureBookingsCount,
          },
          { status: 400 }
        );
      }

      // Delete all future sessions of this recurring (including this one)
      const deleted = await prisma.venueSession.deleteMany({
        where: {
          recurringSessionId: existingSession.recurringSessionId,
          startsAt: { gte: existingSession.startsAt },
        },
      });

      return NextResponse.json({
        success: true,
        deletedCount: deleted.count,
      });
    }

    // Single session delete - check if there are active bookings
    if (existingSession._count.bookings > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete session with active bookings",
          activeBookings: existingSession._count.bookings,
        },
        { status: 400 }
      );
    }

    // Delete single session
    await prisma.venueSession.delete({
      where: {
        id: sessionId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting session:", error);
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 }
    );
  }
}
