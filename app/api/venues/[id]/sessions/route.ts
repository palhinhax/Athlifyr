import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageSessions } from "@/lib/venues/authorization";
import { SessionType } from "@prisma/client";

// GET - List sessions for a venue
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: venueId } = params;
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

    return NextResponse.json({ sessions });
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId } = params;

    // Check authorization
    const authResult = await canManageSessions(session.user.id, venueId);
    if (!authResult.authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

    // Create session
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
      },
    });

    return NextResponse.json(venueSession, { status: 201 });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
