import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingType, BookingStatus } from "@prisma/client";

// GET - Get all pending notifications for the current user
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    // Run all queries in parallel
    const [
      trialBookingNotifications,
      trialResponseNotifications,
      friendRequestNotifications,
      venueInviteNotifications,
    ] = await Promise.all([
      // 1. Trial booking requests (for venue owners/admins)
      getTrialBookingNotifications(userId),
      // 2. Trial booking responses (for users who requested a trial)
      getTrialResponseNotifications(userId),
      // 3. Friend requests received
      getFriendRequestNotifications(userId),
      // 4. Venue staff invitations
      getVenueInviteNotifications(userId, userEmail),
    ]);

    const notifications = [
      ...trialBookingNotifications,
      ...trialResponseNotifications,
      ...friendRequestNotifications,
      ...venueInviteNotifications,
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // pendingCount only includes actionable items (not informational responses)
    const pendingCount = notifications.filter(
      (n) => n.type !== "TRIAL_RESPONSE"
    ).length;

    return NextResponse.json({ notifications, pendingCount });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Trial booking requests across all managed venues
async function getTrialBookingNotifications(userId: string) {
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
          enableTrialBooking: true,
        },
      },
    },
  });

  const venueIds = managedVenues
    .filter(
      (mv: { venue: { enableTrialBooking: boolean } }) =>
        mv.venue.enableTrialBooking
    )
    .map((mv: { venueId: string }) => mv.venueId);

  if (venueIds.length === 0) return [];

  const bookings = await prisma.venueBooking.findMany({
    where: {
      venueId: { in: venueIds },
      bookingType: BookingType.TRIAL,
      status: BookingStatus.PENDING,
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
      venue: {
        select: { id: true, name: true, slug: true, logo: true },
      },
      session: {
        select: { id: true, title: true, startsAt: true, endsAt: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return bookings.map((booking) => ({
    id: booking.id,
    type: "TRIAL_REQUEST" as const,
    userName: booking.user?.name ?? null,
    userImage: booking.user?.image ?? null,
    venueName: booking.venue.name,
    venueSlug: booking.venue.slug,
    sessionTitle: booking.session.title,
    sessionStartsAt: booking.session.startsAt,
    createdAt: booking.createdAt,
  }));
}

// Trial booking responses for users who requested a trial (accepted/rejected in the last 7 days)
async function getTrialResponseNotifications(userId: string) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const responses = await prisma.venueBooking.findMany({
    where: {
      userId,
      bookingType: BookingType.TRIAL,
      status: { in: [BookingStatus.BOOKED, BookingStatus.REJECTED] },
      updatedAt: { gte: sevenDaysAgo },
    },
    include: {
      venue: {
        select: { id: true, name: true, slug: true, logo: true },
      },
      session: {
        select: { id: true, title: true, startsAt: true, endsAt: true },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 20,
  });

  return responses.map((booking) => ({
    id: booking.id,
    type: "TRIAL_RESPONSE" as const,
    userName: null,
    userImage: booking.venue.logo,
    venueName: booking.venue.name,
    venueSlug: booking.venue.slug,
    responseStatus: booking.status as "BOOKED" | "REJECTED",
    sessionTitle: booking.session.title,
    sessionStartsAt: booking.session.startsAt,
    createdAt: booking.updatedAt,
  }));
}

// Pending friend requests received by the user
async function getFriendRequestNotifications(userId: string) {
  const friendRequests = await prisma.friendship.findMany({
    where: {
      receiverId: userId,
      status: "PENDING",
    },
    include: {
      sender: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return friendRequests.map((fr) => ({
    id: fr.id,
    type: "FRIEND_REQUEST" as const,
    userName: fr.sender.name,
    userImage: fr.sender.image,
    venueName: null,
    venueSlug: null,
    sessionTitle: null,
    sessionStartsAt: null,
    createdAt: fr.createdAt,
  }));
}

// Pending venue staff invitations for the user
async function getVenueInviteNotifications(
  userId: string,
  userEmail: string | null | undefined
) {
  const whereConditions = [];

  // Match by userId
  whereConditions.push({ invitedUserId: userId });

  // Match by email
  if (userEmail) {
    whereConditions.push({ invitedEmail: userEmail });
  }

  const invites = await prisma.venueInvite.findMany({
    where: {
      OR: whereConditions,
      status: "PENDING",
      expiresAt: { gt: new Date() },
    },
    include: {
      venue: {
        select: { id: true, name: true, slug: true, logo: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return invites.map((invite) => ({
    id: invite.id,
    type: "VENUE_INVITE" as const,
    userName: null,
    userImage: null,
    venueName: invite.venue.name,
    venueSlug: invite.venue.slug,
    role: invite.role,
    sessionTitle: null,
    sessionStartsAt: null,
    createdAt: invite.createdAt,
  }));
}
