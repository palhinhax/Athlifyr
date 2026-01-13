import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/users/[id] - Get public user profile
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
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
                sportType: true,
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
        comments: {
          select: {
            id: true,
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
    const friendsCount =
      user.sentFriendships.length + user.receivedFriendships.length;

    // If logged in, check friendship status with this user
    let friendshipStatus: string | null = null;
    let friendshipId: string | undefined = undefined;

    if (session?.user?.id && session.user.id !== id) {
      const friendship = await prisma.friendship.findFirst({
        where: {
          OR: [
            { senderId: session.user.id, receiverId: id },
            { senderId: id, receiverId: session.user.id },
          ],
        },
      });

      if (friendship) {
        if (friendship.status === "ACCEPTED") {
          friendshipStatus = "friends";
        } else if (friendship.status === "PENDING") {
          friendshipStatus =
            friendship.senderId === session.user.id
              ? "request_sent"
              : "request_received";
        }
        friendshipId = friendship.id;
      }
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
        friendsCount,
        commentsCount: user.comments.length,
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
          sportType: p.event.sportType,
        },
        variant: p.variant
          ? {
              name: p.variant.name,
              distanceKm: p.variant.distanceKm,
            }
          : null,
      })),
      friendshipStatus,
      friendshipId,
      isOwnProfile: session?.user?.id === id,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
