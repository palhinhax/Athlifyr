import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GiveawayStatus } from "@prisma/client";
import { randomBytes, createHash } from "crypto";
import { notifyGiveawayWinners } from "@/lib/notifications";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Pick winning ticket numbers in a verifiable way.
 *
 * If the giveaway has a secretRevealed set by the admin, derive winning
 * tickets deterministically from SHA-256(secretRevealed + "|" + rank).
 * This allows anyone to verify the outcome.
 *
 * Otherwise fall back to cryptographically strong random selection.
 */
function pickWinningTickets(
  totalTickets: number,
  prizeCount: number,
  secretRevealed: string | null
): number[] {
  const count = Math.min(prizeCount, totalTickets);
  const winners: number[] = [];
  const used = new Set<number>();

  for (let rank = 1; rank <= count; rank++) {
    let ticket: number;
    if (secretRevealed) {
      // Deterministic: SHA-256(secret + "|" + rank) % N + 1
      let attempt = 0;
      do {
        const hash = createHash("sha256")
          .update(`${secretRevealed}|${rank}|${attempt}`)
          .digest("hex");
        ticket = Number(BigInt("0x" + hash) % BigInt(totalTickets)) + 1;
        attempt++;
      } while (used.has(ticket));
    } else {
      // Random fallback
      do {
        const bytes = randomBytes(4);
        const rand = bytes.readUInt32BE(0);
        ticket = (rand % totalTickets) + 1;
      } while (used.has(ticket));
    }
    used.add(ticket);
    winners.push(ticket);
  }
  return winners;
}

// POST - Manually trigger draw for a giveaway (admin override)
export async function POST(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    return await performDraw(id);
  } catch (error) {
    console.error("Error in manual draw:", error);
    return NextResponse.json(
      { error: "Failed to perform draw" },
      { status: 500 }
    );
  }
}

export async function performDraw(giveawayId: string) {
  const giveaway = await prisma.giveaway.findUnique({
    where: { id: giveawayId },
    include: {
      _count: { select: { winners: true } },
      event: { select: { id: true, slug: true, title: true } },
    },
  });

  if (!giveaway) {
    return NextResponse.json({ error: "Giveaway not found" }, { status: 404 });
  }

  if (giveaway.status === GiveawayStatus.DRAWN) {
    return NextResponse.json(
      { error: "Giveaway has already been drawn" },
      { status: 400 }
    );
  }

  if (giveaway.status === GiveawayStatus.CANCELLED) {
    return NextResponse.json(
      { error: "Giveaway is cancelled" },
      { status: 400 }
    );
  }

  // Idempotency: if winners already exist, skip
  if (giveaway._count.winners > 0) {
    return NextResponse.json(
      { error: "Winners already exist for this giveaway" },
      { status: 400 }
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    // Lock by setting status to DRAWING
    await tx.giveaway.update({
      where: { id: giveawayId },
      data: { status: GiveawayStatus.DRAWING },
    });

    // Fetch all participants ordered by ticketNumber
    const participations = await tx.giveawayParticipation.findMany({
      where: { giveawayId },
      select: { userId: true, ticketNumber: true },
      orderBy: { ticketNumber: "asc" },
    });

    const participantsCount = participations.length;
    const drawnAt = new Date();
    let winnersCount = 0;
    let winningTicketNumbers: number[] = [];

    // Build ticket→userId map
    const ticketMap = new Map<number, string>(
      participations.map((p) => [p.ticketNumber, p.userId])
    );

    if (participantsCount > 0) {
      // Pick winning ticket numbers using the auto-generated secret
      const winningTickets = pickWinningTickets(
        participantsCount,
        giveaway.prizeCount,
        giveaway.secret
      );

      winningTicketNumbers = winningTickets;

      // Insert GiveawayWinner rows by ticket number rank
      await tx.giveawayWinner.createMany({
        data: winningTickets.map((ticket, index) => ({
          giveawayId,
          userId: ticketMap.get(ticket)!,
          rank: index + 1,
        })),
      });

      winnersCount = winningTickets.length;
    }

    // Set status to DRAWN, snapshot proof fields, and auto-reveal the secret
    await tx.giveaway.update({
      where: { id: giveawayId },
      data: {
        status: GiveawayStatus.DRAWN,
        drawnAt,
        finalParticipantsCount: participantsCount,
        winningTicketNumbers,
        secretRevealed: giveaway.secret,
      },
    });

    console.log(
      `✅ Draw complete for giveaway ${giveawayId}: ${participantsCount} participants, ${winnersCount} winners, winning tickets: ${winningTicketNumbers.map((t) => `#${t}`).join(", ")}`
    );

    return {
      participantsCount,
      winnersCount,
      winningTicketNumbers,
      winnerDetails: winningTicketNumbers.map((ticket) => ({
        userId: ticketMap.get(ticket)!,
        ticketNumber: ticket,
      })),
    };
  });

  // Send notifications to winners (after transaction commits)
  if (result.winnerDetails.length > 0) {
    notifyGiveawayWinners({
      giveawayId,
      eventId: giveaway.event.id,
      eventSlug: giveaway.event.slug,
      eventTitle: giveaway.event.title,
      winners: result.winnerDetails,
    }).catch((err) =>
      console.error("Failed to send giveaway winner notifications:", err)
    );
  }

  return NextResponse.json({
    success: true,
    participantsCount: result.participantsCount,
    winnersCount: result.winnersCount,
    winningTicketNumbers: result.winningTicketNumbers,
  });
}
