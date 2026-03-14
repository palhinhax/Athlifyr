import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GiveawayStatus, GiveawayPlatform, Language } from "@prisma/client";
import crypto from "crypto";

/**
 * Generates a random secret and its SHA-256 hash for giveaway transparency.
 * The secret should be kept private until after the draw.
 * The hash is published before the draw to prove fairness.
 */
function generateSecretAndHash(): { secret: string; hash: string } {
  // Generate a cryptographically secure random secret (32 bytes = 256 bits)
  const secret = crypto.randomBytes(32).toString("hex");
  // Create SHA-256 hash of the secret
  const hash = crypto.createHash("sha256").update(secret).digest("hex");
  return { secret, hash };
}

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
    const { eventId, drawAt, prizeCount, status, platform, translations } =
      body as {
        eventId: string;
        drawAt?: string;
        prizeCount?: number;
        status?: GiveawayStatus;
        platform?: GiveawayPlatform;
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

    // Generate secret and hash automatically for transparency
    const { secret, hash } = generateSecretAndHash();
    console.log("🎲 Generated giveaway secret (KEEP PRIVATE):", secret);
    console.log("🔒 Generated hash (PUBLIC):", hash);

    const giveaway = await prisma.giveaway.create({
      data: {
        eventId,
        drawAt: drawAt ? new Date(drawAt) : undefined,
        prizeCount: prizeCount ?? 1,
        status: status ?? GiveawayStatus.DRAFT,
        platform: platform ?? GiveawayPlatform.ALL,
        secret, // Store the secret privately (used in draw algorithm)
        secretHash: hash, // Store the hash publicly (proves transparency)
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
