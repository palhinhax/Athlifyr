import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Hide a conversation from the user's list
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

    // Check if user is a participant
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: session.user.id,
        },
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Hide the conversation for this user
    await prisma.conversationParticipant.update({
      where: {
        id: participant.id,
      },
      data: {
        hidden: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error hiding conversation:", error);
    return NextResponse.json(
      { error: "Failed to hide conversation" },
      { status: 500 }
    );
  }
}

// Unhide a conversation (restore it to the list)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: conversationId } = await params;

    // Check if user is a participant
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: session.user.id,
        },
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Unhide the conversation for this user
    await prisma.conversationParticipant.update({
      where: {
        id: participant.id,
      },
      data: {
        hidden: false,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unhiding conversation:", error);
    return NextResponse.json(
      { error: "Failed to unhide conversation" },
      { status: 500 }
    );
  }
}
