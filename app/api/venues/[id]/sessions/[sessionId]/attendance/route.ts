import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { canManageSessions } from "@/lib/venues/authorization";

const ALLOWED_STATUSES = ["ATTENDED", "NO_SHOW", "BOOKED"] as const;
type AttendanceStatus = (typeof ALLOWED_STATUSES)[number];

// POST - Mark attendance for a booking (owner/admin/coach only)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; sessionId: string }> }
) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId, sessionId } = await params;
    const currentUserId = authUser.id;

    // Check if user can manage sessions in this venue (owner, admin, coach, or app admin)
    const authorization = await canManageSessions(currentUserId, venueId);

    if (!authorization.authorized && authUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Not authorized to manage this session" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { bookingId, status } = body as {
      bookingId?: string;
      status?: AttendanceStatus;
    };

    if (!bookingId) {
      return NextResponse.json(
        { error: "bookingId is required" },
        { status: 400 }
      );
    }

    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `status must be one of: ${ALLOWED_STATUSES.join(", ")}` },
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
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Cannot mark attendance for a cancelled booking" },
        { status: 400 }
      );
    }

    const updatedBooking = await prisma.venueBooking.update({
      where: { id: bookingId },
      data: {
        status,
      },
    });

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating attendance:", error);
    return NextResponse.json(
      { error: "Failed to update attendance" },
      { status: 500 }
    );
  }
}
