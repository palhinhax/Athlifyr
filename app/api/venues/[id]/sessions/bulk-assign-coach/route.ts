import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageSessions } from "@/lib/venues/authorization";
import { z } from "zod";

const bulkAssignCoachSchema = z.object({
  sessionIds: z.array(z.string()).min(1, "At least one session is required"),
  coachId: z.string().nullable(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId } = await params;

    // Check permissions
    const authResult = await canManageSessions(session.user.id, venueId);
    if (!authResult.authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validation = bulkAssignCoachSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { sessionIds, coachId } = validation.data;

    // Verify all sessions belong to this venue
    const sessionsCount = await prisma.venueSession.count({
      where: {
        id: { in: sessionIds },
        venueId,
      },
    });

    if (sessionsCount !== sessionIds.length) {
      return NextResponse.json(
        {
          error:
            "One or more sessions not found or do not belong to this venue",
        },
        { status: 400 }
      );
    }

    // If coachId is provided, verify the coach is a member of the venue
    if (coachId) {
      const member = await prisma.venueMember.findFirst({
        where: {
          venueId,
          userId: coachId,
          status: "ACTIVE",
        },
      });

      if (!member) {
        return NextResponse.json(
          { error: "Coach is not an active member of this venue" },
          { status: 400 }
        );
      }
    }

    // Update all sessions with the new coach
    const result = await prisma.venueSession.updateMany({
      where: {
        id: { in: sessionIds },
        venueId,
      },
      data: {
        coachId: coachId,
      },
    });

    return NextResponse.json({
      success: true,
      count: result.count,
    });
  } catch (error) {
    console.error("Error bulk assigning coach:", error);
    return NextResponse.json(
      { error: "Failed to assign coach to sessions" },
      { status: 500 }
    );
  }
}
