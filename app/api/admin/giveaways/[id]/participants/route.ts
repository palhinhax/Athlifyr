import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session?.user?.role !== "ADMIN") {
    return null;
  }
  return session;
}

// GET - List participants for a giveaway
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    if (!(await requireAdmin())) {
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
        select: {
          id: true,
          ticketNumber: true,
          createdAt: true,
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

// POST - Add a participant to a giveaway (admin manually adds a user)
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { userId } = await request.json();

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const giveaway = await prisma.giveaway.findUnique({ where: { id } });
    if (!giveaway) {
      return NextResponse.json(
        { error: "Giveaway not found" },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existing = await prisma.giveawayParticipation.findUnique({
      where: { giveawayId_userId: { giveawayId: id, userId } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "User already participates" },
        { status: 409 }
      );
    }

    const participation = await prisma.$transaction(
      async (tx) => {
        const maxResult = await tx.giveawayParticipation.aggregate({
          where: { giveawayId: id },
          _max: { ticketNumber: true },
        });
        const nextTicket = (maxResult._max.ticketNumber ?? 0) + 1;

        return tx.giveawayParticipation.create({
          data: {
            giveawayId: id,
            userId,
            ticketNumber: nextTicket,
          },
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        });
      },
      { isolationLevel: "Serializable" }
    );

    return NextResponse.json({ participation }, { status: 201 });
  } catch (error) {
    console.error("Error adding participant:", error);
    return NextResponse.json(
      { error: "Failed to add participant" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a participant from a giveaway
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { userId } = await request.json();

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const participation = await prisma.giveawayParticipation.findUnique({
      where: { giveawayId_userId: { giveawayId: id, userId } },
    });

    if (!participation) {
      return NextResponse.json(
        { error: "Participation not found" },
        { status: 404 }
      );
    }

    await prisma.giveawayParticipation.delete({
      where: { id: participation.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing participant:", error);
    return NextResponse.json(
      { error: "Failed to remove participant" },
      { status: 500 }
    );
  }
}
