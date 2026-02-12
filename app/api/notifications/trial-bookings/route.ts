import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { BookingType, BookingStatus } from "@prisma/client";

// GET - Get all pending trial booking requests across all venues the user manages
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    // Find all venues where user is OWNER or ADMIN
    const managedVenues = await prisma.venueMember.findMany({
      where: {
        userId,
        status: "ACTIVE",
        role: { in: ["OWNER", "ADMIN"] },
      },
      select: {
        venueId: true,
        venue: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            enableTrialBooking: true,
          },
        },
      },
    });

    if (managedVenues.length === 0) {
      return NextResponse.json({
        notifications: [],
        pendingCount: 0,
      });
    }

    // Only check venues with trial booking enabled
    const venueIds = managedVenues
      .filter(
        (mv: { venue: { enableTrialBooking: boolean } }) =>
          mv.venue.enableTrialBooking
      )
      .map((mv: { venueId: string }) => mv.venueId);

    if (venueIds.length === 0) {
      return NextResponse.json({
        notifications: [],
        pendingCount: 0,
      });
    }

    // Get all pending trial bookings across managed venues
    const pendingTrialBookings = await prisma.venueBooking.findMany({
      where: {
        venueId: { in: venueIds },
        bookingType: BookingType.TRIAL,
        status: BookingStatus.PENDING,
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
        venue: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
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
      take: 20,
    });

    const notifications = pendingTrialBookings.map((booking) => ({
      id: booking.id,
      type: "TRIAL_REQUEST" as const,
      userId: booking.user?.id ?? "",
      userName: booking.user?.name ?? null,
      userEmail: booking.user?.email ?? null,
      userImage: booking.user?.image ?? null,
      venueId: booking.venue.id,
      venueName: booking.venue.name,
      venueSlug: booking.venue.slug,
      venueLogo: booking.venue.logo,
      sessionId: booking.session.id,
      sessionTitle: booking.session.title,
      sessionStartsAt: booking.session.startsAt,
      sessionEndsAt: booking.session.endsAt,
      createdAt: booking.createdAt,
    }));

    return NextResponse.json({
      notifications,
      pendingCount: pendingTrialBookings.length,
    });
  } catch (error) {
    console.error("Error fetching trial booking notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
