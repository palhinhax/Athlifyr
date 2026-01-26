import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Get chat notifications (recent messages from conversations)
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get recent messages from conversations where user is a participant
    // Only get messages not sent by the current user
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: session.user.id,
            hidden: false,
          },
        },
      },
      include: {
        messages: {
          where: {
            senderId: {
              not: session.user.id,
            },
            // Get recent messages as "notifications"
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5, // Last 5 messages per conversation
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // Transform messages into notifications
    const notifications = conversations.flatMap((conversation) =>
      conversation.messages.map((msg) => ({
        id: msg.id,
        conversationId: conversation.id,
        senderId: msg.sender.id,
        senderName: msg.sender.name,
        senderImage: msg.sender.image,
        content: msg.content,
        createdAt: msg.createdAt,
        read: false, // For now, all recent messages show as unread
      }))
    );

    // Sort by date descending
    notifications.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      notifications: notifications.slice(0, 20), // Max 20 notifications
      unreadCount: notifications.length,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
