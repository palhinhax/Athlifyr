import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { BookingStatus, BookingType } from "@prisma/client";
import { notifyTrialRequest } from "@/lib/notifications";

// POST - Create a trial booking request
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId } = await params;
    const userId = authUser.id;
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // 1. Check if venue has enableTrialBooking enabled
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
      select: { enableTrialBooking: true, name: true },
    });

    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    if (!venue.enableTrialBooking) {
      return NextResponse.json(
        { error: "Trial bookings are not enabled for this venue" },
        { status: 403 }
      );
    }

    // 2. Check if user has any existing bookings at this venue (TRIAL or NORMAL)
    const existingBookings = await prisma.venueBooking.findFirst({
      where: {
        venueId,
        userId,
      },
    });

    if (existingBookings) {
      return NextResponse.json(
        {
          error: "User already has bookings at this venue",
          reason: "ALREADY_HAS_BOOKING",
        },
        { status: 403 }
      );
    }

    // 3. Verify session exists and has capacity
    const venueSession = await prisma.venueSession.findUnique({
      where: { id: sessionId },
      include: {
        bookings: {
          where: {
            status: {
              // Count both confirmed bookings and pending trial requests
              in: [
                BookingStatus.BOOKED,
                BookingStatus.ATTENDED,
                BookingStatus.PENDING,
              ],
            },
          },
        },
      },
    });

    if (!venueSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Check if session has already started
    if (venueSession.startsAt <= new Date()) {
      return NextResponse.json(
        { error: "Cannot book a session that has already started" },
        { status: 400 }
      );
    }

    // Check capacity (including pending trial bookings)
    if (
      venueSession.capacity !== null &&
      venueSession.bookings.length >= venueSession.capacity
    ) {
      return NextResponse.json({ error: "Session is full" }, { status: 400 });
    }

    // 4. Check if user already has a trial booking request for this session
    const existingTrialBooking = await prisma.venueBooking.findFirst({
      where: {
        sessionId,
        userId,
        bookingType: BookingType.TRIAL,
      },
    });

    if (existingTrialBooking) {
      return NextResponse.json(
        { error: "You already have a trial booking request for this session" },
        { status: 400 }
      );
    }

    // 5. Create the trial booking request with PENDING status
    const trialBooking = await prisma.venueBooking.create({
      data: {
        venueId,
        sessionId,
        userId,
        status: BookingStatus.PENDING,
        bookingType: BookingType.TRIAL,
      },
      include: {
        session: {
          select: {
            startsAt: true,
            endsAt: true,
            title: true,
          },
        },
        venue: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    // Get venue owner/admin user IDs to notify
    const venueAdmins = await prisma.venueMember.findMany({
      where: {
        venueId,
        status: "ACTIVE",
        role: { in: ["OWNER", "ADMIN"] },
      },
      select: { userId: true },
    });

    const adminUserIds = venueAdmins.map((m) => m.userId);

    // Get requester info for notification
    const requester = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, image: true },
    });

    // Notify venue owners/admins about the trial request
    if (adminUserIds.length > 0) {
      notifyTrialRequest({
        venueOwnerUserIds: adminUserIds,
        bookingId: trialBooking.id,
        requesterName: requester?.name || "Someone",
        requesterImage: requester?.image,
        venueName: trialBooking.venue.name,
        venueSlug: trialBooking.venue.slug,
        sessionTitle: trialBooking.session.title,
        sessionStartsAt: trialBooking.session.startsAt,
      }).catch((error) => {
        console.error("Error sending trial request notification:", error);
      });
    }

    return NextResponse.json(
      {
        message: "Trial booking request created successfully",
        booking: trialBooking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating trial booking:", error);
    return NextResponse.json(
      { error: "Failed to create trial booking request" },
      { status: 500 }
    );
  }
}

// GET - Get pending trial booking requests for venue owner
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId } = await params;
    const userId = authUser.id;

    // Check if user is owner or staff of the venue
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
      select: {
        createdByUserId: true,
        members: {
          where: {
            userId: userId,
            role: {
              in: ["OWNER", "ADMIN"],
            },
          },
        },
      },
    });

    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    const isOwnerOrAdmin =
      venue.createdByUserId === userId || venue.members.length > 0;

    if (!isOwnerOrAdmin) {
      return NextResponse.json(
        { error: "You do not have permission to view trial booking requests" },
        { status: 403 }
      );
    }

    // Get pending trial bookings
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "PENDING";

    const trialBookings = await prisma.venueBooking.findMany({
      where: {
        venueId,
        bookingType: BookingType.TRIAL,
        status: status as BookingStatus,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        session: {
          select: {
            id: true,
            title: true,
            startsAt: true,
            endsAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ trialBookings }, { status: 200 });
  } catch (error) {
    console.error("Error fetching trial bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch trial booking requests" },
      { status: 500 }
    );
  }
}
