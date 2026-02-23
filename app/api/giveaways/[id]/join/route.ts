import { NextResponse, NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { GiveawayStatus } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST - Join a giveaway (assigns a permanent sequential ticket number)
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const giveaway = await prisma.giveaway.findUnique({ where: { id } });
    if (!giveaway) {
      return NextResponse.json(
        { error: "Giveaway not found" },
        { status: 404 }
      );
    }

    if (giveaway.status !== GiveawayStatus.SCHEDULED) {
      return NextResponse.json(
        { error: "Giveaway is not open for participation" },
        { status: 400 }
      );
    }

    // Block participation after drawAt (deadline has passed)
    if (giveaway.drawAt && giveaway.drawAt <= new Date()) {
      return NextResponse.json(
        { error: "Giveaway participation deadline has passed" },
        { status: 400 }
      );
    }

    // Check if user already joined (fast path before transaction)
    const existing = await prisma.giveawayParticipation.findUnique({
      where: { giveawayId_userId: { giveawayId: id, userId: user.id } },
    });
    if (existing) {
      const currentCount = await prisma.giveawayParticipation.count({
        where: { giveawayId: id },
      });
      return NextResponse.json({
        success: true,
        hasJoined: true,
        ticketNumber: existing.ticketNumber,
        currentParticipantsCount: currentCount,
      });
    }

    // Atomically assign the next sequential ticket number using a transaction.
    // We use serializable isolation to guarantee no two users get the same ticket.
    const participation = await prisma.$transaction(
      async (tx) => {
        // Find the current max ticket number for this giveaway
        const maxResult = await tx.giveawayParticipation.aggregate({
          where: { giveawayId: id },
          _max: { ticketNumber: true },
        });
        const nextTicket = (maxResult._max.ticketNumber ?? 0) + 1;

        // Create participation with the new ticket number
        const created = await tx.giveawayParticipation.create({
          data: {
            giveawayId: id,
            userId: user.id,
            ticketNumber: nextTicket,
          },
        });
        // Count inside the transaction so the returned value is consistent
        const currentParticipantsCount = await tx.giveawayParticipation.count({
          where: { giveawayId: id },
        });
        return { created, currentParticipantsCount };
      },
      { isolationLevel: "Serializable" }
    );

    return NextResponse.json({
      success: true,
      hasJoined: true,
      ticketNumber: participation.created.ticketNumber,
      currentParticipantsCount: participation.currentParticipantsCount,
    });
  } catch (error) {
    console.error("Error joining giveaway:", error);
    return NextResponse.json(
      { error: "Failed to join giveaway" },
      { status: 500 }
    );
  }
}
