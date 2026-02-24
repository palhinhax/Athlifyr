import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/conversations
 * Get Athli AI conversations with server-side pagination and search
 */
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Build where clause for search
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        {
          user: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
        },
        {
          messages: {
            some: { content: { contains: search, mode: "insensitive" } },
          },
        },
      ];
    }

    // Get total count for pagination
    const totalCount = await prisma.athliConversation.count({ where });

    // Get paginated conversations (without full message content)
    const conversations = await prisma.athliConversation.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        _count: {
          select: { messages: true },
        },
      },
    });

    // Get global stats (cached separately from pagination)
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalConversations,
      totalMessages,
      uniqueUsersResult,
      today,
      thisWeek,
    ] = await Promise.all([
      prisma.athliConversation.count(),
      prisma.athliMessage.count(),
      prisma.athliConversation.groupBy({
        by: ["userId"],
      }),
      prisma.athliConversation.count({
        where: { createdAt: { gte: todayStart } },
      }),
      prisma.athliConversation.count({
        where: { createdAt: { gte: weekAgo } },
      }),
    ]);

    return NextResponse.json({
      conversations,
      stats: {
        totalConversations,
        totalMessages,
        uniqueUsers: uniqueUsersResult.length,
        today,
        thisWeek,
      },
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
