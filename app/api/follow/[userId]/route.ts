import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// DELETE /api/follow/[userId] - Unfollow a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await params;

    // Find the follow relationship where current user is the follower
    const follow = await prisma.friendship.findFirst({
      where: {
        senderId: user.id,
        receiverId: userId,
      },
    });

    if (!follow) {
      return NextResponse.json(
        { error: "Not following this user" },
        { status: 404 }
      );
    }

    await prisma.friendship.delete({
      where: { id: follow.id },
    });

    return NextResponse.json({ success: true, following: false });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return NextResponse.json(
      { error: "Failed to unfollow user" },
      { status: 500 }
    );
  }
}

// GET /api/follow/[userId] - Check if current user follows a specific user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await params;

    const follow = await prisma.friendship.findFirst({
      where: {
        senderId: user.id,
        receiverId: userId,
        status: "ACCEPTED",
      },
    });

    return NextResponse.json({
      following: !!follow,
      followId: follow?.id ?? null,
    });
  } catch (error) {
    console.error("Error checking follow status:", error);
    return NextResponse.json(
      { error: "Failed to check follow status" },
      { status: 500 }
    );
  }
}
