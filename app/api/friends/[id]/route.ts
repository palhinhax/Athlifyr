import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { notifyFriendAccepted } from "@/lib/notifications";

// PATCH /api/friends/[id] - Accept or reject friend request
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { action } = await request.json();

    if (!action || !["accept", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Use 'accept' or 'reject'" },
        { status: 400 }
      );
    }

    // Find the friendship
    const friendship = await prisma.friendship.findUnique({
      where: { id },
    });

    if (!friendship) {
      return NextResponse.json(
        { error: "Friend request not found" },
        { status: 404 }
      );
    }

    // Only the receiver can accept/reject
    if (friendship.receiverId !== user.id) {
      return NextResponse.json(
        { error: "Only the receiver can respond to this request" },
        { status: 403 }
      );
    }

    if (friendship.status !== "PENDING") {
      return NextResponse.json(
        { error: "This request has already been processed" },
        { status: 400 }
      );
    }

    const updated = await prisma.friendship.update({
      where: { id },
      data: {
        status: action === "accept" ? "ACCEPTED" : "REJECTED",
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
    });

    // Send notification to original sender if accepted
    if (action === "accept") {
      const accepter = await prisma.user.findUnique({
        where: { id: user.id },
        select: { name: true, image: true },
      });

      notifyFriendAccepted({
        receiverUserId: friendship.senderId,
        accepterUserId: user.id,
        accepterName: accepter?.name || "Someone",
        accepterImage: accepter?.image,
      }).catch((error) => {
        console.error("Error sending friend accepted notification:", error);
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating friendship:", error);
    return NextResponse.json(
      { error: "Failed to update friend request" },
      { status: 500 }
    );
  }
}

// DELETE /api/friends/[id] - Remove friend or cancel request
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Find the friendship
    const friendship = await prisma.friendship.findUnique({
      where: { id },
    });

    if (!friendship) {
      return NextResponse.json(
        { error: "Friendship not found" },
        { status: 404 }
      );
    }

    // User must be part of the friendship
    if (friendship.senderId !== user.id && friendship.receiverId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.friendship.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting friendship:", error);
    return NextResponse.json(
      { error: "Failed to remove friend" },
      { status: 500 }
    );
  }
}
