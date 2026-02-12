import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

// GET - Poll for new messages after a specific message ID
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

    // Get the "after" param (message ID to fetch messages after)
    const { searchParams } = new URL(request.url);
    const afterMessageId = searchParams.get("after");

    // Build query for messages after the given ID
    interface MessageWithSender {
      id: string;
      conversationId: string;
      senderId: string;
      content: string;
      createdAt: Date;
      sender: {
        id: string;
        name: string | null;
        image: string | null;
      };
    }

    let messages: MessageWithSender[] = [];

    if (afterMessageId) {
      // Get the timestamp of the "after" message
      const afterMessage = await prisma.message.findUnique({
        where: { id: afterMessageId },
        select: { createdAt: true },
      });

      if (afterMessage) {
        // Get messages created after this one
        messages = await prisma.message.findMany({
          where: {
            conversationId,
            OR: [
              { createdAt: { gt: afterMessage.createdAt } },
              {
                createdAt: afterMessage.createdAt,
                id: { gt: afterMessageId },
              },
            ],
          },
          orderBy: [{ createdAt: "asc" }, { id: "asc" }],
          take: 100, // Limit to prevent huge responses
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
      } else {
        // Message not found, return empty
        messages = [];
      }
    } else {
      // No after ID, return empty (initial load uses the regular messages endpoint)
      messages = [];
    }

    return NextResponse.json({
      messages,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error polling messages:", error);
    return NextResponse.json(
      { error: "Failed to poll messages" },
      { status: 500 }
    );
  }
}
