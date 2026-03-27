import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { publishPost } from "@/lib/social/publisher";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const result = await publishPost({ postId: id, userId: session.user.id });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error publishing social post:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to publish post",
      },
      { status: 500 }
    );
  }
}
