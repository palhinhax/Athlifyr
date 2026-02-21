import { NextResponse, NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { GiveawayStatus } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST - Join a giveaway
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

    if (giveaway.drawAt && giveaway.drawAt <= new Date()) {
      return NextResponse.json(
        { error: "Giveaway draw time has already passed" },
        { status: 400 }
      );
    }

    // Upsert participation (idempotent)
    await prisma.giveawayParticipation.upsert({
      where: { giveawayId_userId: { giveawayId: id, userId: user.id } },
      update: {},
      create: { giveawayId: id, userId: user.id },
    });

    return NextResponse.json({ success: true, hasJoined: true });
  } catch (error) {
    console.error("Error joining giveaway:", error);
    return NextResponse.json(
      { error: "Failed to join giveaway" },
      { status: 500 }
    );
  }
}
