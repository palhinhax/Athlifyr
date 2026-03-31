import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/users/[id] - Get public user profile
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getAuthUser(request);
    const { id } = await params;

    // Find the user with their public data
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        participations: {
          where: {
            status: "going",
          },
          include: {
            event: {
              select: {
                id: true,
                title: true,
                slug: true,
                startDate: true,
                city: true,
                country: true,
                sportTypes: true,
              },
            },
            variant: {
              select: {
                name: true,
                distanceKm: true,
                startDate: true,
                startTime: true,
              },
            },
          },
          orderBy: {
            event: {
              startDate: "asc",
            },
          },
        },
        results: {
          select: {
            id: true,
          },
        },
        sentFriendships: {
          where: { status: "ACCEPTED" },
          select: { id: true },
        },
        receivedFriendships: {
          where: { status: "ACCEPTED" },
          select: { id: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate stats
    const upcomingEvents = user.participations.filter(
      (p) => p.event.startDate > new Date()
    );
    const pastEvents = user.participations.filter(
      (p) => p.event.startDate <= new Date()
    );
    // sentFriendships = people this user follows, receivedFriendships = people following this user
    const followingCount = user.sentFriendships.length;
    const followersCount = user.receivedFriendships.length;

    // If logged in, check if current user follows this user
    let isFollowing = false;

    if (currentUser?.id && currentUser.id !== id) {
      const follow = await prisma.friendship.findFirst({
        where: {
          senderId: currentUser.id,
          receiverId: id,
          status: "ACCEPTED",
        },
      });
      isFollowing = !!follow;
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
      stats: {
        upcomingEvents: upcomingEvents.length,
        pastEvents: pastEvents.length,
        followersCount,
        followingCount,
      },
      participations: user.participations.map((p) => ({
        id: p.id,
        status: p.status,
        event: {
          id: p.event.id,
          title: p.event.title,
          slug: p.event.slug,
          startDate: p.event.startDate,
          city: p.event.city,
          country: p.event.country,
          sportTypes: p.event.sportTypes,
        },
        variant: p.variant
          ? {
              name: p.variant.name,
              distanceKm: p.variant.distanceKm,
            }
          : null,
      })),
      isFollowing,
      isOwnProfile: currentUser?.id === id,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
