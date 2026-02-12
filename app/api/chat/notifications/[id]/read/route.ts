import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

// POST - Mark a specific notification (message) as read
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: messageId } = await params;

    // Find the message and verify user has access
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      select: {
        conversationId: true,
        conversation: {
          select: {
            participants: {
              where: { userId: user.id },
            },
          },
        },
      },
    });

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    if (message.conversation.participants.length === 0) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // For now, we just acknowledge the read request
    // In the future, we could add lastReadAt field to track this
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { error: "Failed to mark notification as read" },
      { status: 500 }
    );
  }
}
