import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - List participants for a giveaway
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const skip = (page - 1) * pageSize;

    const giveaway = await prisma.giveaway.findUnique({ where: { id } });
    if (!giveaway) {
      return NextResponse.json(
        { error: "Giveaway not found" },
        { status: 404 }
      );
    }

    const [totalCount, participations] = await Promise.all([
      prisma.giveawayParticipation.count({ where: { giveawayId: id } }),
      prisma.giveawayParticipation.findMany({
        where: { giveawayId: id },
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
        orderBy: { createdAt: "asc" },
        skip,
        take: pageSize,
      }),
    ]);

    return NextResponse.json({
      participations,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        hasMore: skip + participations.length < totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching participants:", error);
    return NextResponse.json(
      { error: "Failed to fetch participants" },
      { status: 500 }
    );
  }
}
