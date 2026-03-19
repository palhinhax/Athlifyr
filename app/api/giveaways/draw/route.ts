import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GiveawayStatus } from "@prisma/client";
import { randomBytes, createHash } from "crypto";
import { notifyGiveawayWinners } from "@/lib/notifications";

const GIVEAWAY_DRAW_SECRET = process.env.GIVEAWAY_DRAW_SECRET;

/**
 * Pick winning ticket numbers in a verifiable way.
 *
 * If the giveaway has a secretRevealed set by the admin, derive winning
 * tickets deterministically from SHA-256(secretRevealed + "|" + rank).
 * Otherwise fall back to cryptographically strong random selection.
 */
interface DrawResult {
  tickets: number[];
  attempts: number[];
}

function pickWinningTickets(
  totalTickets: number,
  prizeCount: number,
  secretRevealed: string | null
): DrawResult {
  const count = Math.min(prizeCount, totalTickets);
  const tickets: number[] = [];
  const attempts: number[] = [];
  const used = new Set<number>();

  for (let rank = 1; rank <= count; rank++) {
    let ticket: number;
    let finalAttempt = 0;
    if (secretRevealed) {
      let attempt = 0;
      do {
        const hash = createHash("sha256")
          .update(`${secretRevealed}|${rank}|${attempt}`)
          .digest("hex");
        ticket = Number(BigInt("0x" + hash) % BigInt(totalTickets)) + 1;
        if (!used.has(ticket)) {
          finalAttempt = attempt;
          break;
        }
        attempt++;
      } while (true);
    } else {
      do {
        const bytes = randomBytes(4);
        const rand = bytes.readUInt32BE(0);
        ticket = (rand % totalTickets) + 1;
      } while (used.has(ticket));
    }
    used.add(ticket);
    tickets.push(ticket);
    attempts.push(finalAttempt);
  }
  return { tickets, attempts };
}

/**
 * Daily auto draw endpoint — called by GitHub Actions
 * Draws all giveaways scheduled for today (Europe/Lisbon timezone)
 */
export async function POST(request: Request) {
  try {
    // Verify secret token
    const authHeader = request.headers.get("authorization");
    if (
      !GIVEAWAY_DRAW_SECRET ||
      !authHeader ||
      authHeader !== `Bearer ${GIVEAWAY_DRAW_SECRET}`
    ) {
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

    console.log(
      `🎰 Auto draw job started at ${nowUtc.toISOString()} (Lisbon date: ${lisbon})`
    );

    // Find all SCHEDULED giveaways whose draw date has passed (drawAt <= now)
    const dueGiveaways = await prisma.giveaway.findMany({
      where: {
        status: GiveawayStatus.SCHEDULED,
        drawAt: { lte: nowUtc },
      },
      select: {
        id: true,
        prizeCount: true,
        secret: true,
        event: { select: { id: true, slug: true, title: true } },
      },
    });

    console.log(`📋 Found ${dueGiveaways.length} giveaway(s) to draw`);

    const results: Array<{
      giveawayId: string;
      participantsCount: number;
      winnersCount: number;
      winningTicketNumbers: number[];
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
            winningTicketNumbers: [],
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
          let winningTicketNumbers: number[] = [];
          let winningTicketAttempts: number[] = [];

          const ticketMap = new Map<number, string>(
            participations.map((p) => [p.ticketNumber, p.userId])
          );

          if (participantsCount > 0) {
            const drawResult = pickWinningTickets(
              participantsCount,
              giveaway.prizeCount,
              giveaway.secret
            );

            winningTicketNumbers = drawResult.tickets;
            winningTicketAttempts = drawResult.attempts;

            await tx.giveawayWinner.createMany({
              data: drawResult.tickets.map((ticket, index) => ({
                giveawayId: giveaway.id,
                userId: ticketMap.get(ticket)!,
                rank: index + 1,
              })),
            });

            winnersCount = drawResult.tickets.length;
          }

          await tx.giveaway.update({
            where: { id: giveaway.id },
            data: {
              status: GiveawayStatus.DRAWN,
              drawnAt,
              finalParticipantsCount: participantsCount,
              winningTicketNumbers,
              winningTicketAttempts,
              secretRevealed: giveaway.secret,
            },
          });

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

        console.log(
          `✅ Giveaway ${giveaway.id}: ${drawResult.participantsCount} participants, ${drawResult.winnersCount} winners, winning tickets: ${drawResult.winningTicketNumbers.map((t) => `#${t}`).join(", ")}`
        );

        // Send notifications to winners (fire and forget)
        if (drawResult.winnerDetails.length > 0) {
          notifyGiveawayWinners({
            giveawayId: giveaway.id,
            eventId: giveaway.event.id,
            eventSlug: giveaway.event.slug,
            eventTitle: giveaway.event.title,
            winners: drawResult.winnerDetails,
          }).catch((err) =>
            console.error(
              `Failed to send giveaway winner notifications for ${giveaway.id}:`,
              err
            )
          );
        }

        results.push({
          giveawayId: giveaway.id,
          participantsCount: drawResult.participantsCount,
          winnersCount: drawResult.winnersCount,
          winningTicketNumbers: drawResult.winningTicketNumbers,
        });
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.error(`❌ Failed to draw giveaway ${giveaway.id}:`, errMsg);
        results.push({
          giveawayId: giveaway.id,
          participantsCount: 0,
          winnersCount: 0,
          winningTicketNumbers: [],
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
