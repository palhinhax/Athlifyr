import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GiveawayStatus } from "@prisma/client";
import { randomBytes, createHash } from "crypto";

const GIVEAWAY_DRAW_SECRET = process.env.GIVEAWAY_DRAW_SECRET;

/**
 * Pick winning ticket numbers in a verifiable way.
 *
 * If the giveaway has a secretRevealed set by the admin, derive winning
 * tickets deterministically from SHA-256(secretRevealed + "|" + rank).
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
      let attempt = 0;
      do {
        const hash = createHash("sha256")
          .update(`${secretRevealed}|${rank}|${attempt}`)
          .digest("hex");
        ticket = Number(BigInt("0x" + hash) % BigInt(totalTickets)) + 1;
        attempt++;
      } while (used.has(ticket));
    } else {
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

/**
 * Daily auto draw endpoint — called by GitHub Actions
 * Draws all giveaways scheduled for today (Europe/Lisbon timezone)
 */
export async function POST(request: Request) {
  try {
    // Verify secret token
    const authHeader = request.headers.get("authorization");
    if (!authHeader || authHeader !== `Bearer ${GIVEAWAY_DRAW_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current time in Europe/Lisbon timezone
    const nowUtc = new Date();
    const lisbon = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Lisbon",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(nowUtc);

    // Today's date range in UTC aligned to Lisbon midnight
    const todayLisbonStart = new Date(`${lisbon}T00:00:00`);
    const todayLisbonEnd = new Date(`${lisbon}T23:59:59`);
    const lisbonOffsetMs =
      nowUtc.getTime() -
      new Date(
        new Intl.DateTimeFormat("en-CA", {
          timeZone: "Europe/Lisbon",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
          .format(nowUtc)
          .replace(
            /(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/,
            "$3-$1-$2T$4:$5:$6"
          )
      ).getTime();

    const startUtc = new Date(todayLisbonStart.getTime() + lisbonOffsetMs);
    const endUtc = new Date(todayLisbonEnd.getTime() + lisbonOffsetMs);

    console.log(
      `🎰 Auto draw job started at ${nowUtc.toISOString()} (Lisbon date: ${lisbon})`
    );

    const dueGiveaways = await prisma.giveaway.findMany({
      where: {
        status: GiveawayStatus.SCHEDULED,
        drawAt: { gte: startUtc, lte: endUtc },
      },
      select: {
        id: true,
        prizeCount: true,
        secretRevealed: true,
      },
    });

    console.log(`📋 Found ${dueGiveaways.length} giveaway(s) to draw`);

    const results: Array<{
      giveawayId: string;
      participantsCount: number;
      winnersCount: number;
      winningTicketNumber: number | null;
      error?: string;
    }> = [];

    for (const giveaway of dueGiveaways) {
      try {
        const existingWinners = await prisma.giveawayWinner.count({
          where: { giveawayId: giveaway.id },
        });

        if (existingWinners > 0) {
          console.log(
            `⏭️  Giveaway ${giveaway.id} already has winners, skipping`
          );
          results.push({
            giveawayId: giveaway.id,
            participantsCount: 0,
            winnersCount: existingWinners,
            winningTicketNumber: null,
          });
          continue;
        }

        const drawResult = await prisma.$transaction(async (tx) => {
          await tx.giveaway.update({
            where: { id: giveaway.id },
            data: { status: GiveawayStatus.DRAWING },
          });

          const participations = await tx.giveawayParticipation.findMany({
            where: { giveawayId: giveaway.id },
            select: { userId: true, ticketNumber: true },
            orderBy: { ticketNumber: "asc" },
          });

          const participantsCount = participations.length;
          const drawnAt = new Date();
          let winnersCount = 0;
          let winningTicketNumber: number | null = null;

          if (participantsCount > 0) {
            const ticketMap = new Map<number, string>(
              participations.map((p) => [p.ticketNumber, p.userId])
            );

            const winningTickets = pickWinningTickets(
              participantsCount,
              giveaway.prizeCount,
              giveaway.secretRevealed
            );

            winningTicketNumber = winningTickets[0] ?? null;

            await tx.giveawayWinner.createMany({
              data: winningTickets.map((ticket, index) => ({
                giveawayId: giveaway.id,
                userId: ticketMap.get(ticket)!,
                rank: index + 1,
              })),
            });

            winnersCount = winningTickets.length;
          }

          await tx.giveaway.update({
            where: { id: giveaway.id },
            data: {
              status: GiveawayStatus.DRAWN,
              drawnAt,
              finalParticipantsCount: participantsCount,
              winningTicketNumber,
            },
          });

          return { participantsCount, winnersCount, winningTicketNumber };
        });

        console.log(
          `✅ Giveaway ${giveaway.id}: ${drawResult.participantsCount} participants, ${drawResult.winnersCount} winners, winning ticket #${drawResult.winningTicketNumber}`
        );
        results.push({ giveawayId: giveaway.id, ...drawResult });
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.error(`❌ Failed to draw giveaway ${giveaway.id}:`, errMsg);
        results.push({
          giveawayId: giveaway.id,
          participantsCount: 0,
          winnersCount: 0,
          winningTicketNumber: null,
          error: errMsg,
        });
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error("Error in draw job:", error);
    return NextResponse.json({ error: "Draw job failed" }, { status: 500 });
  }
}
