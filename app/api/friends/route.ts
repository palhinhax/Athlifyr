import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { notifyFriendRequest } from "@/lib/notifications";

// GET /api/friends - Get user's friends and pending requests
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all";

    if (type === "pending") {
      // Get pending friend requests received
      const pendingRequests = await prisma.friendship.findMany({
        where: {
          receiverId: user.id,
          status: "PENDING",
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(pendingRequests);
    }

    if (type === "sent") {
      // Get sent pending requests
      const sentRequests = await prisma.friendship.findMany({
        where: {
          senderId: user.id,
          status: "PENDING",
        },
        include: {
          receiver: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(sentRequests);
    }

    // Get all accepted friends
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { senderId: user.id, status: "ACCEPTED" },
          { receiverId: user.id, status: "ACCEPTED" },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Extract friend info (the other user)
    const friends = friendships.map((f) => {
      const friend = f.senderId === user.id ? f.receiver : f.sender;
      return {
        friendshipId: f.id,
        ...friend,
        since: f.updatedAt,
      };
    });

    return NextResponse.json(friends);
  } catch (error) {
    console.error("Error fetching friends:", error);
    return NextResponse.json(
      { error: "Failed to fetch friends" },
      { status: 500 }
    );
  }
}

// POST /api/friends - Send friend request
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (userId === user.id) {
      return NextResponse.json(
        { error: "Cannot send friend request to yourself" },
        { status: 400 }
      );
    }

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if friendship already exists (in either direction)
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId: user.id, receiverId: userId },
          { senderId: userId, receiverId: user.id },
        ],
      },
    });

    if (existingFriendship) {
      if (existingFriendship.status === "ACCEPTED") {
        return NextResponse.json({ error: "Already friends" }, { status: 400 });
      }
      if (existingFriendship.status === "PENDING") {
        return NextResponse.json(
          { error: "Friend request already pending" },
          { status: 400 }
        );
      }
      // If rejected, allow new request by updating
      const updated = await prisma.friendship.update({
        where: { id: existingFriendship.id },
        data: {
          senderId: user.id,
          receiverId: userId,
          status: "PENDING",
        },
      });
      return NextResponse.json(updated);
    }

    // Create new friend request
    const friendship = await prisma.friendship.create({
      data: {
        senderId: user.id,
        receiverId: userId,
        status: "PENDING",
      },
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // Get sender info for notification
    const sender = await prisma.user.findUnique({
      where: { id: user.id },
      select: { name: true, image: true },
    });

    // Send notification to receiver
    notifyFriendRequest({
      receiverUserId: userId,
      senderUserId: user.id,
      senderName: sender?.name || "Someone",
      senderImage: sender?.image,
    }).catch((error) => {
      console.error("Error sending friend request notification:", error);
    });

    return NextResponse.json(friendship);
  } catch (error) {
    console.error("Error sending friend request:", error);
    return NextResponse.json(
      { error: "Failed to send friend request" },
      { status: 500 }
    );
  }
}
