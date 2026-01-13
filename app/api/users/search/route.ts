import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/users/search - Search for users
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    // Search users by name or email
    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: session.user.id } }, // Exclude self
          {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
            ],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
      take: 10,
    });

    // Get friendship status for each user
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          {
            senderId: session.user.id,
            receiverId: { in: users.map((u) => u.id) },
          },
          {
            receiverId: session.user.id,
            senderId: { in: users.map((u) => u.id) },
          },
        ],
      },
    });

    const usersWithStatus = users.map((user) => {
      const friendship = friendships.find(
        (f) =>
          (f.senderId === session.user.id && f.receiverId === user.id) ||
          (f.receiverId === session.user.id && f.senderId === user.id)
      );

      let friendshipStatus: string | null = null;
      if (friendship) {
        if (friendship.status === "ACCEPTED") {
          friendshipStatus = "friends";
        } else if (friendship.status === "PENDING") {
          friendshipStatus =
            friendship.senderId === session.user.id
              ? "request_sent"
              : "request_received";
        }
      }

      return {
        ...user,
        friendshipStatus,
        friendshipId: friendship?.id,
      };
    });

    return NextResponse.json(usersWithStatus);
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
}
