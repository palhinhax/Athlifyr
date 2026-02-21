import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GiveawayStatus, Language } from "@prisma/client";

// GET - List all giveaways for admin
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const eventId = searchParams.get("eventId");
    const status = searchParams.get("status") as GiveawayStatus | null;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "12");

    const where = {
      ...(eventId ? { eventId } : {}),
      ...(status ? { status } : {}),
    };

    const skip = (page - 1) * pageSize;

    const [totalCount, giveaways] = await Promise.all([
      prisma.giveaway.count({ where }),
      prisma.giveaway.findMany({
        where,
        include: {
          event: { select: { id: true, title: true, slug: true } },
          translations: true,
          _count: { select: { participations: true, winners: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
    ]);

    return NextResponse.json({
      giveaways,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        hasMore: skip + giveaways.length < totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching giveaways:", error);
    return NextResponse.json(
      { error: "Failed to fetch giveaways" },
      { status: 500 }
    );
  }
}

// POST - Create a new giveaway
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { eventId, drawAt, prizeCount, status, translations, commitHash } =
      body as {
        eventId: string;
        drawAt?: string;
        prizeCount?: number;
        status?: GiveawayStatus;
        commitHash?: string;
        translations?: Array<{
          lang: Language;
          title: string;
          details: string;
        }>;
      };

    if (!eventId) {
      return NextResponse.json(
        { error: "eventId is required" },
        { status: 400 }
      );
    }

    if (prizeCount !== undefined && prizeCount < 1) {
      return NextResponse.json(
        { error: "prizeCount must be at least 1" },
        { status: 400 }
      );
    }

    const giveaway = await prisma.giveaway.create({
      data: {
        eventId,
        drawAt: drawAt ? new Date(drawAt) : undefined,
        prizeCount: prizeCount ?? 1,
        status: status ?? GiveawayStatus.DRAFT,
        commitHash: commitHash ?? undefined,
        translations: translations
          ? {
              createMany: {
                data: translations.map((t) => ({
                  lang: t.lang,
                  title: t.title,
                  details: t.details,
                })),
              },
            }
          : undefined,
      },
      include: {
        translations: true,
        event: { select: { id: true, title: true, slug: true } },
      },
    });

    return NextResponse.json({ giveaway }, { status: 201 });
  } catch (error) {
    console.error("Error creating giveaway:", error);
    return NextResponse.json(
      { error: "Failed to create giveaway" },
      { status: 500 }
    );
  }
}
