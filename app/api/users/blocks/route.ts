import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const blockSchema = z.object({
  blockedId: z.string(),
  reason: z.string().optional(),
});

// GET - List blocked users for current user
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const blocks = await prisma.userBlock.findMany({
      where: { blockerId: session.user.id },
      include: {
        blocked: {
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

    return NextResponse.json({ blocks });
  } catch (error) {
    console.error("Error fetching blocks:", error);
    return NextResponse.json(
      { error: "Failed to fetch blocks" },
      { status: 500 }
    );
  }
}

// POST - Block a user
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = blockSchema.parse(body);

    // Can't block yourself
    if (validatedData.blockedId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot block yourself" },
        { status: 400 }
      );
    }

    // Check if user exists
    const blockedUser = await prisma.user.findUnique({
      where: { id: validatedData.blockedId },
    });

    if (!blockedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already blocked
    const existingBlock = await prisma.userBlock.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId: session.user.id,
          blockedId: validatedData.blockedId,
        },
      },
    });

    if (existingBlock) {
      return NextResponse.json(
        { error: "User already blocked" },
        { status: 400 }
      );
    }

    // Create block
    const block = await prisma.userBlock.create({
      data: {
        blockerId: session.user.id,
        blockedId: validatedData.blockedId,
        reason: validatedData.reason,
      },
      include: {
        blocked: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // Remove friendship if exists
    await prisma.friendship.deleteMany({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: validatedData.blockedId },
          { senderId: validatedData.blockedId, receiverId: session.user.id },
        ],
      },
    });

    // Hide conversations with blocked user
    await prisma.conversationParticipant.updateMany({
      where: {
        userId: session.user.id,
        conversation: {
          participants: {
            some: { userId: validatedData.blockedId },
          },
        },
      },
      data: { hidden: true },
    });

    return NextResponse.json({ success: true, block });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error blocking user:", error);
    return NextResponse.json(
      { error: "Failed to block user" },
      { status: 500 }
    );
  }
}

// DELETE - Unblock a user
export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const blockedId = searchParams.get("blockedId");

    if (!blockedId) {
      return NextResponse.json(
        { error: "blockedId is required" },
        { status: 400 }
      );
    }

    await prisma.userBlock.delete({
      where: {
        blockerId_blockedId: {
          blockerId: session.user.id,
          blockedId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unblocking user:", error);
    return NextResponse.json(
      { error: "Failed to unblock user" },
      { status: 500 }
    );
  }
}
