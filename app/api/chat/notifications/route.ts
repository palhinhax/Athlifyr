import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Get chat notifications (unread messages from conversations)
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get conversations where user is a participant
    const participations = await prisma.conversationParticipant.findMany({
      where: {
        userId: session.user.id,
        hidden: false,
      },
      select: {
        conversationId: true,
        lastSeenAt: true,
      },
    });

    if (participations.length === 0) {
      return NextResponse.json({
        notifications: [],
        unreadCount: 0,
      });
    }

    // Get unread messages (messages created after lastSeenAt)
    const unreadMessages = await Promise.all(
      participations.map(async (participation) => {
        const messages = await prisma.message.findMany({
          where: {
            conversationId: participation.conversationId,
            senderId: {
              not: session.user.id,
            },
            createdAt: {
              gt: participation.lastSeenAt,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
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

        return messages.map((msg) => ({
          id: msg.id,
          conversationId: participation.conversationId,
          senderId: msg.sender.id,
          senderName: msg.sender.name,
          senderImage: msg.sender.image,
          content: msg.content,
          createdAt: msg.createdAt,
          read: false,
        }));
      })
    );

    // Flatten and sort notifications
    const notifications = unreadMessages
      .flat()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 20);

    return NextResponse.json({
      notifications,
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
