import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageSessions } from "@/lib/venues/authorization";
import { SessionType } from "@prisma/client";
import { format, addWeeks } from "date-fns";

// How many weeks to generate sessions in advance for recurring templates
const RECURRING_GENERATION_WEEKS = 12; // 3 months ahead

// GET - List sessions for a venue
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: venueId } = await params;
    const searchParams = request.nextUrl.searchParams;

    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const type = searchParams.get("type") as SessionType | null;

    // Build where clause
    const where: {
      venueId: string;
      startsAt?: { gte?: Date; lte?: Date };
      type?: SessionType;
    } = {
      venueId,
    };

    // Date range filter
    if (from || to) {
      where.startsAt = {};
      if (from) {
        where.startsAt.gte = new Date(from);
      }
      if (to) {
        where.startsAt.lte = new Date(to);
      }
    } else {
      // Default: show future sessions only
      where.startsAt = {
        gte: new Date(),
      };
    }

    // Type filter
    if (type && Object.values(SessionType).includes(type)) {
      where.type = type;
    }

    // Fetch sessions
    const sessions = await prisma.venueSession.findMany({
      where,
      include: {
        recurringSession: {
          select: {
            id: true,
            isActive: true,
          },
        },
        sessionWorkouts: {
          select: {
            id: true,
            workout: {
              select: {
                id: true,
                name: true,
                description: true,
                estimatedTime: true,
                difficulty: true,
                blocks: {
                  orderBy: { orderIndex: "asc" },
                  select: {
                    id: true,
                    type: true,
                    name: true,
                    rounds: true,
                    timeCap: true,
                    notes: true,
                    exercises: {
                      orderBy: { orderIndex: "asc" },
                      select: {
                        id: true,
                        exerciseId: true,
                        exercise: {
                          select: {
                            name: true,
                          },
                        },
                        prescribedReps: true,
                        prescribedWeight: true,
                        prescribedWeightUnit: true,
                        prescribedDistance: true,
                        prescribedDistanceUnit: true,
                        prescribedTime: true,
                        prescribedCalories: true,
                        prescribedSets: true,
                        notes: true,
                      },
                    },
                  },
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
          select: {
            id: true,
            status: true,
            guestName: true,
            guestEmail: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
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
      },
      orderBy: {
        startsAt: "asc",
      },
    });

    // Fetch coaches for sessions that have a coachId
    // coachId in VenueSession stores the userId of the coach, not the venueMember id
    const coachUserIds = [
      ...new Set(
        sessions.filter((s) => s.coachId).map((s) => s.coachId as string)
      ),
    ];

    const coaches =
      coachUserIds.length > 0
        ? await prisma.venueMember.findMany({
            where: {
              venueId,
              userId: { in: coachUserIds },
            },
            select: {
              id: true,
              role: true,
              userId: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          })
        : [];

    // Create a map for quick lookup by userId (which matches coachId in sessions)
    const coachMap = new Map(coaches.map((c) => [c.userId, c]));

    // Add coach data and rename sessionWorkouts to workouts for response
    const sessionsWithCoach = sessions.map((session) => ({
      ...session,
      coach: session.coachId ? coachMap.get(session.coachId) || null : null,
      workouts: session.sessionWorkouts,
      sessionWorkouts: undefined, // Remove the original field from response
    }));

    return NextResponse.json({ sessions: sessionsWithCoach });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

// POST - Create new session (owner/admin/coach only)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId } = await params;

    // Check authorization
    const authResult = await canManageSessions(session.user.id, venueId);
    if (!authResult.authorized) {
      console.log(
        `[Sessions API] Authorization failed for user ${session.user.id} on venue ${venueId}:`,
        authResult.reason
      );
      return NextResponse.json(
        { error: "Forbidden", reason: authResult.reason },
        { status: 403 }
      );
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
      isRecurring,
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

    // Handle recurring sessions - create a template that lasts "forever"
    if (isRecurring) {
      const baseStartDate = new Date(startsAt);
      const baseEndDate = new Date(endsAt);
      const dayOfWeek = baseStartDate.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
      const startTime = format(baseStartDate, "HH:mm");
      const endTime = format(baseEndDate, "HH:mm");

      // Create the recurring template
      const recurringSession = await prisma.venueRecurringSession.create({
        data: {
          venueId,
          type,
          title,
          description: description || null,
          dayOfWeek,
          startTime,
          endTime,
          capacity: capacity || null,
          coachId: coachId || null,
          serviceId: serviceId || null,
          tags: tags || [],
          isActive: true,
          bookingAdvanceDays: bookingAdvanceDays ?? 4,
          cancellationDeadlineMinutes: cancellationDeadlineMinutes ?? 30,
        },
      });

      // Generate sessions for the next N weeks
      const sessionsToCreate = [];
      const generationLimit = addWeeks(new Date(), RECURRING_GENERATION_WEEKS);

      // Start from the first occurrence
      let currentDate = new Date(baseStartDate);

      while (currentDate <= generationLimit) {
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const [endHour, endMinute] = endTime.split(":").map(Number);

        const sessionStart = new Date(currentDate);
        sessionStart.setHours(startHour, startMinute, 0, 0);

        const sessionEnd = new Date(currentDate);
        sessionEnd.setHours(endHour, endMinute, 0, 0);

        sessionsToCreate.push({
          venueId,
          recurringSessionId: recurringSession.id,
          type,
          title,
          description: description || null,
          startsAt: sessionStart,
          endsAt: sessionEnd,
          capacity: capacity || null,
          coachId: coachId || null,
          serviceId: serviceId || null,
          tags: tags || [],
          bookingAdvanceDays: bookingAdvanceDays ?? 4,
          cancellationDeadlineMinutes: cancellationDeadlineMinutes ?? 30,
        });

        // Move to next week
        currentDate = addWeeks(currentDate, 1);
      }

      // Batch create all sessions
      const result = await prisma.venueSession.createMany({
        data: sessionsToCreate,
      });

      // Update the template with how far we've generated
      await prisma.venueRecurringSession.update({
        where: { id: recurringSession.id },
        data: { generatedUntil: generationLimit },
      });

      return NextResponse.json(
        {
          message: "Recurring session created",
          count: result.count,
          recurringSessionId: recurringSession.id,
        },
        { status: 201 }
      );
    }

    // Create single session
    const venueSession = await prisma.venueSession.create({
      data: {
        venueId,
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

    return NextResponse.json({ ...venueSession, count: 1 }, { status: 201 });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
