import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { notifyNewFollower } from "@/lib/notifications";
import { requireIntegrity } from "@/lib/verify-integrity";

// GET /api/follow - Get user's followers or following list
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "following";

    if (type === "followers") {
      // People who follow the current user (receiverId = me)
      const followers = await prisma.friendship.findMany({
        where: {
          receiverId: user.id,
          status: "ACCEPTED",
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

      return NextResponse.json(
        followers.map((f) => ({
          id: f.sender.id,
          name: f.sender.name,
          email: f.sender.email,
          image: f.sender.image,
          followId: f.id,
          since: f.createdAt,
        }))
      );
    }

    // People the current user follows (senderId = me)
    const following = await prisma.friendship.findMany({
      where: {
        senderId: user.id,
        status: "ACCEPTED",
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

    return NextResponse.json(
      following.map((f) => ({
        id: f.receiver.id,
        name: f.receiver.name,
        email: f.receiver.email,
        image: f.receiver.image,
        followId: f.id,
        since: f.createdAt,
      }))
    );
  } catch (error) {
    console.error("Error fetching follow list:", error);
    return NextResponse.json(
      { error: "Failed to fetch follow list" },
      { status: 500 }
    );
  }
}

// POST /api/follow - Follow a user (instant, no approval needed)
export async function POST(request: NextRequest) {
  try {
    const integrityError = await requireIntegrity(request);
    if (integrityError) return integrityError;

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
        { error: "Cannot follow yourself" },
        { status: 400 }
      );
    }

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already following (senderId = follower, receiverId = followed)
    const existing = await prisma.friendship.findFirst({
      where: {
        senderId: user.id,
        receiverId: userId,
      },
    });

    if (existing) {
      if (existing.status === "ACCEPTED") {
        return NextResponse.json(
          { error: "Already following" },
          { status: 400 }
        );
      }
      // Update existing record to ACCEPTED
      const updated = await prisma.friendship.update({
        where: { id: existing.id },
        data: { status: "ACCEPTED" },
      });
      return NextResponse.json({
        followId: updated.id,
        following: true,
      });
    }

    // Create new follow (immediately ACCEPTED)
    const follow = await prisma.friendship.create({
      data: {
        senderId: user.id,
        receiverId: userId,
        status: "ACCEPTED",
      },
    });

    // Send notification to the person being followed
    const sender = await prisma.user.findUnique({
      where: { id: user.id },
      select: { name: true, image: true },
    });

    notifyNewFollower({
      receiverUserId: userId,
      followerUserId: user.id,
      followerName: sender?.name || "Someone",
      followerImage: sender?.image,
    }).catch((error) => {
      console.error("Error sending new follower notification:", error);
    });

    return NextResponse.json({
      followId: follow.id,
      following: true,
    });
  } catch (error) {
    console.error("Error following user:", error);
    return NextResponse.json(
      { error: "Failed to follow user" },
      { status: 500 }
    );
  }
}
