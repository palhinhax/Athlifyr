import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updatePost, deletePost } from "@/lib/social/publisher";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { prisma } = await import("@/lib/prisma");
    const post = await prisma.socialPost.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true, image: true } },
        logs: { orderBy: { createdAt: "desc" }, take: 20 },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error fetching social post:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch post",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = (await request.json()) as {
      title?: string;
      caption?: string;
      hashtags?: string[];
      callToAction?: string;
      imageUrl?: string | null;
    };

    const result = await updatePost({
      postId: id,
      data: body,
      userId: session.user.id,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating social post:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update post",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const result = await deletePost({ postId: id, userId: session.user.id });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting social post:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to delete post",
      },
      { status: 500 }
    );
  }
}
