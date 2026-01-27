import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST - Mark conversation as seen (update lastSeenAt)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: conversationId } = await params;

    // Update lastSeenAt for this participant
    const participant = await prisma.conversationParticipant.updateMany({
      where: {
        conversationId,
        userId: session.user.id,
      },
      data: {
        lastSeenAt: new Date(),
      },
    });

    if (participant.count === 0) {
      return NextResponse.json(
        { error: "Conversation not found or you are not a participant" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking conversation as seen:", error);
    return NextResponse.json(
      { error: "Failed to mark conversation as seen" },
      { status: 500 }
    );
  }
}
