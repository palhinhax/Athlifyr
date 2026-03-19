import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addWeeks, isBefore } from "date-fns";

// How many weeks to generate sessions in advance
const GENERATION_WEEKS = 12; // 3 months ahead
// Regenerate when less than this many weeks remain
const REGENERATION_THRESHOLD_WEEKS = 4; // 1 month

/**
 * Calculate the first future occurrence of a given day-of-week,
 * starting from either the week after generatedUntil or now.
 */
function getSessionGenerationStart(
  generatedUntil: Date | null,
  dayOfWeek: number,
  now: Date
): Date {
  const startFrom = generatedUntil ? addWeeks(generatedUntil, 1) : now;
  const currentDate = new Date(startFrom);
  while (currentDate.getDay() !== dayOfWeek) {
    currentDate.setDate(currentDate.getDate() + 1);
  }
  if (isBefore(currentDate, now)) {
    return addWeeks(currentDate, 1);
  }
  return currentDate;
}

/**
 * Cron endpoint to automatically extend recurring sessions.
 * This should be called periodically (e.g., daily or weekly) by a cron service.
 *
 * Vercel Cron config in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/regenerate-sessions",
 *     "schedule": "0 3 * * 1"  // Every Monday at 3am
 *   }]
 * }
 */
export async function GET(request: Request) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      console.error(
        "[Security] CRON_SECRET is not configured. Rejecting cron request."
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const thresholdDate = addWeeks(now, REGENERATION_THRESHOLD_WEEKS);

    // Find all active recurring sessions that need regeneration
    const recurringSessionsToExtend =
      await prisma.venueRecurringSession.findMany({
        where: {
          isActive: true,
          OR: [
            // Never generated
            { generatedUntil: null },
            // Generated until is within threshold
            { generatedUntil: { lte: thresholdDate } },
          ],
        },
        include: {
          venue: {
            select: {
              id: true,
              name: true,
              isActive: true,
            },
          },
        },
      });

    // Filter out sessions for inactive venues
    const activeRecurringSessions = recurringSessionsToExtend.filter(
      (rs) => rs.venue.isActive
    );

    if (activeRecurringSessions.length === 0) {
      return NextResponse.json({
        message: "No recurring sessions need regeneration",
        processed: 0,
      });
    }

    let totalSessionsCreated = 0;
    const results: {
      recurringId: string;
      venueId: string;
      title: string;
      sessionsCreated: number;
    }[] = [];

    for (const recurring of activeRecurringSessions) {
      let currentDate = getSessionGenerationStart(
        recurring.generatedUntil,
        recurring.dayOfWeek,
        now
      );

      const generationLimit = addWeeks(now, GENERATION_WEEKS);
      const sessionsToCreate = [];

      while (
        isBefore(currentDate, generationLimit) ||
        currentDate.getTime() === generationLimit.getTime()
      ) {
        const [startHour, startMinute] = recurring.startTime
          .split(":")
          .map(Number);
        const [endHour, endMinute] = recurring.endTime.split(":").map(Number);

        const sessionStart = new Date(currentDate);
        sessionStart.setHours(startHour, startMinute, 0, 0);

        const sessionEnd = new Date(currentDate);
        sessionEnd.setHours(endHour, endMinute, 0, 0);

        sessionsToCreate.push({
          venueId: recurring.venueId,
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

      if (sessionsToCreate.length > 0) {
        // Batch create all sessions
        const result = await prisma.venueSession.createMany({
          data: sessionsToCreate,
        });

        // Update the template with how far we've generated
        await prisma.venueRecurringSession.update({
          where: { id: recurring.id },
          data: { generatedUntil: generationLimit },
        });

        totalSessionsCreated += result.count;
        results.push({
          recurringId: recurring.id,
          venueId: recurring.venueId,
          title: recurring.title,
          sessionsCreated: result.count,
        });
      }
    }

    return NextResponse.json({
      message: "Recurring sessions regenerated",
      processed: results.length,
      totalSessionsCreated,
      details: results,
    });
  } catch (error) {
    console.error("Error regenerating sessions:", error);
    return NextResponse.json(
      { error: "Failed to regenerate sessions" },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggering from admin panels
export async function POST(request: Request) {
  return GET(request);
}
