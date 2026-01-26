import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// POST - Mark all notifications as read
// Note: lastReadAt field doesn't exist in schema yet, so we just acknowledge the request
export async function POST() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For now, we just acknowledge the request
    // In the future, we could add lastReadAt field to ConversationParticipant
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json(
      { error: "Failed to mark notifications as read" },
      { status: 500 }
    );
  }
}
