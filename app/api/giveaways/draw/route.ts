import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GiveawayStatus } from "@prisma/client";
import { randomBytes } from "crypto";

const GIVEAWAY_DRAW_SECRET = process.env.GIVEAWAY_DRAW_SECRET;

/**
 * Cryptographically secure Fisher-Yates shuffle
 */
function secureShuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const bytes = randomBytes(4);
    const randomValue = bytes.readUInt32BE(0);
    const j = randomValue % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
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

    // Today's date range in UTC (from midnight Lisbon to end of day Lisbon)
    const todayLisbonStart = new Date(`${lisbon}T00:00:00`);
    const todayLisbonEnd = new Date(`${lisbon}T23:59:59`);
    // Convert Lisbon midnight to UTC (Lisbon is UTC+0 or UTC+1 depending on DST)
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

    // Find all giveaways due today that haven't been drawn yet
    const dueGiveaways = await prisma.giveaway.findMany({
      where: {
        status: GiveawayStatus.SCHEDULED,
        drawAt: {
          gte: startUtc,
          lte: endUtc,
        },
      },
      select: { id: true, prizeCount: true },
    });

    console.log(`📋 Found ${dueGiveaways.length} giveaway(s) to draw`);

    const results: Array<{
      giveawayId: string;
      participantsCount: number;
      winnersCount: number;
      error?: string;
    }> = [];

    for (const giveaway of dueGiveaways) {
      try {
        // Check idempotency: skip if winners already exist
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
          });
          continue;
        }

        const drawResult = await prisma.$transaction(async (tx) => {
          // Set status to DRAWING
          await tx.giveaway.update({
            where: { id: giveaway.id },
            data: { status: GiveawayStatus.DRAWING },
          });

          const participations = await tx.giveawayParticipation.findMany({
            where: { giveawayId: giveaway.id },
            select: { userId: true },
          });

          const participantIds = participations.map((p) => p.userId);
          const participantsCount = participantIds.length;
          let winnersCount = 0;

          if (participantsCount > 0) {
            const shuffled = secureShuffle(participantIds);
            const winnerIds = shuffled.slice(
              0,
              Math.min(giveaway.prizeCount, participantsCount)
            );

            await tx.giveawayWinner.createMany({
              data: winnerIds.map((userId, index) => ({
                giveawayId: giveaway.id,
                userId,
                rank: index + 1,
              })),
            });

            winnersCount = winnerIds.length;
          }

          await tx.giveaway.update({
            where: { id: giveaway.id },
            data: { status: GiveawayStatus.DRAWN },
          });

          return { participantsCount, winnersCount };
        });

        console.log(
          `✅ Giveaway ${giveaway.id}: ${drawResult.participantsCount} participants, ${drawResult.winnersCount} winners`
        );
        results.push({ giveawayId: giveaway.id, ...drawResult });
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.error(`❌ Failed to draw giveaway ${giveaway.id}:`, errMsg);
        results.push({
          giveawayId: giveaway.id,
          participantsCount: 0,
          winnersCount: 0,
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
