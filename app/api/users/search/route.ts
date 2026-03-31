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

    // Get follow status for each user (current user follows them)
    const follows = await prisma.friendship.findMany({
      where: {
        senderId: user.id,
        receiverId: { in: users.map((u) => u.id) },
        status: "ACCEPTED",
      },
    });

    const followedIds = new Set(follows.map((f) => f.receiverId));

    const usersWithStatus = users.map((foundUser) => ({
      ...foundUser,
      isFollowing: followedIds.has(foundUser.id),
    }));

    return NextResponse.json(usersWithStatus);
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
}
