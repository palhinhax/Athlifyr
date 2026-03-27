import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { schedulePost } from "@/lib/social/publisher";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = (await request.json()) as { scheduledFor: string };

    if (!body.scheduledFor) {
      return NextResponse.json(
        { error: "scheduledFor is required" },
        { status: 400 }
      );
    }

    const scheduledFor = new Date(body.scheduledFor);
    if (isNaN(scheduledFor.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const result = await schedulePost({
      postId: id,
      scheduledFor,
      userId: session.user.id,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error scheduling social post:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to schedule post",
      },
      { status: 500 }
    );
  }
}
