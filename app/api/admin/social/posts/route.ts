import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { SocialPostStatus, SocialPostType, Prisma } from "@prisma/client";

const VALID_STATUSES: SocialPostStatus[] = [
  "DRAFT",
  "SCHEDULED",
  "PUBLISHING",
  "PUBLISHED",
  "FAILED",
  "CANCELLED",
];
const VALID_TYPES: SocialPostType[] = [
  "EVENT",
  "WEEKLY_ROUNDUP",
  "LAST_CALL",
  "RESULTS",
  "CUSTOM",
];

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
    const offset = Math.max(Number(searchParams.get("offset")) || 0, 0);

    const where: Prisma.SocialPostWhereInput = {};
    if (status && VALID_STATUSES.includes(status as SocialPostStatus)) {
      where.status = status as SocialPostStatus;
    }
    if (type && VALID_TYPES.includes(type as SocialPostType)) {
      where.type = type as SocialPostType;
    }

    const [posts, total] = await Promise.all([
      prisma.socialPost.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
        include: {
          createdBy: { select: { id: true, name: true, image: true } },
          _count: { select: { logs: true } },
        },
      }),
      prisma.socialPost.count({ where }),
    ]);

    return NextResponse.json({ posts, total, limit, offset });
  } catch (error) {
    console.error("Error fetching social posts:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch posts",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      type: SocialPostType;
      title: string;
      caption: string;
      hashtags?: string[];
      callToAction?: string;
      imageUrl?: string;
    };

    if (!body.type || !VALID_TYPES.includes(body.type)) {
      return NextResponse.json({ error: "Invalid post type" }, { status: 400 });
    }
    if (!body.title || !body.caption) {
      return NextResponse.json(
        { error: "Title and caption are required" },
        { status: 400 }
      );
    }

    const post = await prisma.socialPost.create({
      data: {
        type: body.type,
        title: body.title,
        caption: body.caption,
        hashtags: body.hashtags ?? [],
        callToAction: body.callToAction,
        imageUrl: body.imageUrl,
        createdById: session.user.id,
      },
    });

    await prisma.socialPostLog.create({
      data: {
        postId: post.id,
        action: "created",
        details: { source: "manual" },
        userId: session.user.id,
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Error creating social post:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create post",
      },
      { status: 500 }
    );
  }
}
