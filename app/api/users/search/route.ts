import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

// GET /api/users/search - Search for users
export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const includeSelf = searchParams.get("includeSelf") === "true";

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    // Build where clause conditions
    const conditions: Prisma.UserWhereInput[] = [
      {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
    ];

    // Only exclude self if includeSelf is false
    if (!includeSelf) {
      conditions.push({ id: { not: user.id } });
    }

    // Search users by name or email
    const users = await prisma.user.findMany({
      where: {
        AND: conditions,
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
            senderId: user.id,
            receiverId: { in: users.map((u) => u.id) },
          },
          {
            receiverId: user.id,
            senderId: { in: users.map((u) => u.id) },
          },
        ],
      },
    });

    const usersWithStatus = users.map((foundUser) => {
      const friendship = friendships.find(
        (f) =>
          (f.senderId === user.id && f.receiverId === foundUser.id) ||
          (f.receiverId === user.id && f.senderId === foundUser.id)
      );

      let friendshipStatus: string | null = null;
      if (friendship) {
        if (friendship.status === "ACCEPTED") {
          friendshipStatus = "friends";
        } else if (friendship.status === "PENDING") {
          friendshipStatus =
            friendship.senderId === user.id
              ? "request_sent"
              : "request_received";
        }
      }

      return {
        ...foundUser,
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
