import { NextResponse, NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { GiveawayStatus, Language } from "@prisma/client";

interface RouteParams {
  params: Promise<{ eventId: string }>;
}

// GET - Get active giveaway for an event (public + user join status)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { eventId } = await params;
    const user = await getAuthenticatedUser(request);

    // Fetch the most recent active giveaway for this event
    const giveaway = await prisma.giveaway.findFirst({
      where: {
        eventId,
        status: {
          in: [
            GiveawayStatus.SCHEDULED,
            GiveawayStatus.DRAWING,
            GiveawayStatus.DRAWN,
          ],
        },
      },
      include: {
        translations: true,
        winners: user
          ? {
              where: { userId: user.id },
              select: { rank: true },
            }
          : false,
        _count: { select: { participations: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!giveaway) {
      return NextResponse.json({ giveaway: null });
    }

    // Check if current user has joined and find their position
    let hasJoined = false;
    let userPosition: number | null = null;
    if (user) {
      const participation = await prisma.giveawayParticipation.findUnique({
        where: {
          giveawayId_userId: { giveawayId: giveaway.id, userId: user.id },
        },
      });
      hasJoined = !!participation;
      if (participation) {
        // Count how many participants joined before this user (1-based position)
        const participantPosition = await prisma.giveawayParticipation.count({
          where: {
            giveawayId: giveaway.id,
            createdAt: { lte: participation.createdAt },
          },
        });
        userPosition = participantPosition;
      }
    }

    // Get localized translation (fallback: en -> pt)
    const searchParams = request.nextUrl.searchParams;
    const lang = (searchParams.get("lang") as Language) || Language.en;

    const translation =
      giveaway.translations.find((t) => t.lang === lang) ||
      giveaway.translations.find((t) => t.lang === Language.en) ||
      giveaway.translations.find((t) => t.lang === Language.pt) ||
      giveaway.translations[0] ||
      null;

    return NextResponse.json({
      giveaway: {
        id: giveaway.id,
        status: giveaway.status,
        drawAt: giveaway.drawAt,
        prizeCount: giveaway.prizeCount,
        participantsCount: giveaway._count.participations,
        commitHash: giveaway.commitHash,
        revealedSecret: giveaway.revealedSecret,
        translation,
        hasJoined,
        userPosition,
      },
    });
  } catch (error) {
    console.error("Error fetching event giveaway:", error);
    return NextResponse.json(
      { error: "Failed to fetch giveaway" },
      { status: 500 }
    );
  }
}
