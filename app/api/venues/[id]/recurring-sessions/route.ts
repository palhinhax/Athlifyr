import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageSessions } from "@/lib/venues/authorization";

// GET - List recurring session templates for a venue
export async function GET(
  request: NextRequest,
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
      return NextResponse.json(
        { error: "Forbidden", reason: authResult.reason },
        { status: 403 }
      );
    }

    // Get active filter from query params
    const searchParams = request.nextUrl.searchParams;
    const activeOnly = searchParams.get("activeOnly") === "true";

    const where: { venueId: string; isActive?: boolean } = { venueId };
    if (activeOnly) {
      where.isActive = true;
    }

    const recurringSessions = await prisma.venueRecurringSession.findMany({
      where,
      include: {
        _count: {
          select: {
            sessions: true,
          },
        },
      },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });

    return NextResponse.json({ recurringSessions });
  } catch (error) {
    console.error("Error fetching recurring sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch recurring sessions" },
      { status: 500 }
    );
  }
}
