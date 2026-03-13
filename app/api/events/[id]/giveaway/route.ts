import { NextResponse, NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { GiveawayStatus, Language } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get active giveaway for an event (public + user join status)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: eventId } = await params;
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

    // Check if current user has joined and get their permanent ticket number
    let hasJoined = false;
    let ticketNumber: number | null = null;
    if (user) {
      const participation = await prisma.giveawayParticipation.findUnique({
        where: {
          giveawayId_userId: { giveawayId: giveaway.id, userId: user.id },
        },
        select: { ticketNumber: true },
      });
      hasJoined = !!participation;
      ticketNumber = participation?.ticketNumber ?? null;
    }

    // Get localized translation (fallback: lang -> en -> pt)
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
        drawnAt: giveaway.drawnAt,
        prizeCount: giveaway.prizeCount,
        participantsCount: giveaway._count.participations,
        secretHash: giveaway.secretHash,
        secretRevealed: giveaway.secretRevealed,
        finalParticipantsCount: giveaway.finalParticipantsCount,
        winningTicketNumbers: giveaway.winningTicketNumbers,
        winningTicketAttempts: giveaway.winningTicketAttempts,
        isWinner:
          Array.isArray(giveaway.winners) && giveaway.winners.length > 0,
        translation,
        hasJoined,
        ticketNumber,
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
