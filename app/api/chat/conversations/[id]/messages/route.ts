import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { sendChatMessageNotification } from "@/lib/push-notifications";

// GET - Get message history for a conversation
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: conversationId } = await params;

    // Verify user is participant
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId: user.id,
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Not authorized to view this conversation" },
        { status: 403 }
      );
    }

    // Get pagination params
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    // Build query
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      take: limit,
      ...(cursor
        ? {
            cursor: {
              id: cursor,
            },
            skip: 1, // Skip the cursor
          }
        : {}),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Get next cursor
    const nextCursor =
      messages.length === limit ? messages[messages.length - 1].id : null;

    return NextResponse.json({
      messages: messages.reverse(), // Reverse to show oldest first
      nextCursor,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST - Send a message to a conversation
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: conversationId } = await params;
    const { content } = await request.json();

    if (
      !content ||
      typeof content !== "string" ||
      content.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    // Verify user is participant
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId: user.id,
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Not authorized to send messages to this conversation" },
        { status: 403 }
      );
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: user.id,
        content: content.trim(),
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Update conversation's updatedAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    // Send push notifications to other participants (async, don't await)
    prisma.conversationParticipant
      .findMany({
        where: {
          conversationId,
          userId: { not: user.id }, // Exclude sender
        },
        include: {
          user: {
            select: {
              id: true,
              pushNotificationsEnabled: true,
            },
          },
        },
      })
      .then((participants) => {
        // Send notification to each participant
        participants.forEach((p) => {
          if (p.user.pushNotificationsEnabled) {
            sendChatMessageNotification({
              recipientUserId: p.userId,
              senderName: user.name || "Someone",
              messageContent: content.trim(),
              conversationId,
              messageId: message.id,
            }).catch((error) => {
              console.error(
                `Failed to send push notification to user ${p.userId}:`,
                error
              );
            });
          }
        });
      })
      .catch((error) => {
        console.error(
          "Failed to fetch participants for push notification:",
          error
        );
      });

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
