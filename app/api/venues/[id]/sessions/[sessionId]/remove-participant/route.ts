import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageSessions } from "@/lib/venues/authorization";

// POST - Remove participant from session (owner/admin/coach only)
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

    if (!authorization.authorized && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Not authorized to manage this session" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json(
        { error: "bookingId is required" },
        { status: 400 }
      );
    }

    // Verify the booking exists and belongs to this session
    const booking = await prisma.venueBooking.findFirst({
      where: {
        id: bookingId,
        sessionId,
        session: {
          venueId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Update booking status to CANCELLED
    const updatedBooking = await prisma.venueBooking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED",
      },
    });

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      message: booking.user
        ? `${booking.user.name || booking.user.email} removed from session`
        : `Guest removed from session`,
    });
  } catch (error) {
    console.error("Error removing participant:", error);
    return NextResponse.json(
      { error: "Failed to remove participant" },
      { status: 500 }
    );
  }
}
