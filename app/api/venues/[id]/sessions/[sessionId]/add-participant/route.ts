import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageSessions } from "@/lib/venues/authorization";

// POST - Add participant to session (owner/admin/coach only)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; sessionId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId, sessionId } = await params;
    const currentUserId = session.user.id;

    // Check if user can manage sessions in this venue (owner, admin, coach, or app admin)
    const authorization = await canManageSessions(currentUserId, venueId);

    if (!authorization.authorized) {
      return NextResponse.json(
        { error: "Not authorized to manage this session" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, guestName, guestEmail } = body;

    // Validate: must provide either userId or guestName
    if (!userId && !guestName) {
      return NextResponse.json(
        { error: "Must provide either userId or guestName" },
        { status: 400 }
      );
    }

    // Verify session exists and belongs to this venue
    const venueSession = await prisma.venueSession.findFirst({
      where: {
        id: sessionId,
        venueId,
      },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });

    if (!venueSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Check capacity
    if (
      venueSession.capacity &&
      venueSession._count.bookings >= venueSession.capacity
    ) {
      return NextResponse.json(
        { error: "Session is full", reason: "SESSION_FULL" },
        { status: 400 }
      );
    }

    // If userId provided, verify user exists and check for existing booking
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Check for existing booking
      const existingBooking = await prisma.venueBooking.findFirst({
        where: {
          sessionId,
          userId,
        },
      });

      if (existingBooking) {
        if (existingBooking.status === "BOOKED") {
          return NextResponse.json(
            { error: "User already booked", reason: "ALREADY_BOOKED" },
            { status: 400 }
          );
        }

        // Reactivate cancelled booking
        const booking = await prisma.venueBooking.update({
          where: { id: existingBooking.id },
          data: {
            status: "BOOKED",
            addedByStaff: true,
            addedByUserId: currentUserId,
          },
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
          },
        });

        return NextResponse.json(booking);
      }

      // Create new booking for existing user
      const booking = await prisma.venueBooking.create({
        data: {
          venueId,
          sessionId,
          userId,
          status: "BOOKED",
          addedByStaff: true,
          addedByUserId: currentUserId,
        },
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
      });

      return NextResponse.json(booking);
    }

    // Guest booking (no user account)
    const booking = await prisma.venueBooking.create({
      data: {
        venueId,
        sessionId,
        status: "BOOKED",
        guestName,
        guestEmail: guestEmail || null,
        addedByStaff: true,
        addedByUserId: currentUserId,
      },
    });

    return NextResponse.json({
      ...booking,
      user: {
        id: null,
        name: guestName,
        image: null,
      },
    });
  } catch (error) {
    console.error("Error adding participant:", error);
    return NextResponse.json(
      { error: "Failed to add participant" },
      { status: 500 }
    );
  }
}
