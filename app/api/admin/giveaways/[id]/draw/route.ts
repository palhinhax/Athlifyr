import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GiveawayStatus } from "@prisma/client";
import { randomBytes } from "crypto";

interface RouteParams {
  params: Promise<{ id: string }>;
}

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
    include: { _count: { select: { winners: true } } },
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

  // Perform draw in transaction
  const result = await prisma.$transaction(async (tx) => {
    // Lock by setting status to DRAWING
    await tx.giveaway.update({
      where: { id: giveawayId },
      data: { status: GiveawayStatus.DRAWING },
    });

    // Fetch all participants
    const participations = await tx.giveawayParticipation.findMany({
      where: { giveawayId },
      select: { userId: true },
    });

    const participantIds = participations.map((p) => p.userId);
    const participantsCount = participantIds.length;

    let winnersCount = 0;

    if (participantsCount > 0) {
      // Randomly select winners using secure randomness
      const shuffled = secureShuffle(participantIds);
      const winnerIds = shuffled.slice(
        0,
        Math.min(giveaway.prizeCount, participantsCount)
      );

      // Insert winners with rank
      await tx.giveawayWinner.createMany({
        data: winnerIds.map((userId, index) => ({
          giveawayId,
          userId,
          rank: index + 1,
        })),
      });

      winnersCount = winnerIds.length;
    }

    // Set status to DRAWN
    await tx.giveaway.update({
      where: { id: giveawayId },
      data: { status: GiveawayStatus.DRAWN },
    });

    console.log(
      `✅ Draw complete for giveaway ${giveawayId}: ${participantsCount} participants, ${winnersCount} winners`
    );

    return { participantsCount, winnersCount };
  });

  return NextResponse.json({ success: true, ...result });
}
