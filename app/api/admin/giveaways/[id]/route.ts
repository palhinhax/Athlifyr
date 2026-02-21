import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GiveawayStatus, Language } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get giveaway detail
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const giveaway = await prisma.giveaway.findUnique({
      where: { id },
      include: {
        event: { select: { id: true, title: true, slug: true } },
        translations: true,
        winners: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
          orderBy: { rank: "asc" },
        },
        _count: { select: { participations: true, winners: true } },
      },
    });

    if (!giveaway) {
      return NextResponse.json(
        { error: "Giveaway not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ giveaway });
  } catch (error) {
    console.error("Error fetching giveaway:", error);
    return NextResponse.json(
      { error: "Failed to fetch giveaway" },
      { status: 500 }
    );
  }
}

// PATCH - Update giveaway
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      drawAt,
      prizeCount,
      status,
      translations,
      commitHash,
      revealedSecret,
    } = body as {
      drawAt?: string | null;
      prizeCount?: number;
      status?: GiveawayStatus;
      commitHash?: string | null;
      revealedSecret?: string | null;
      translations?: Array<{ lang: Language; title: string; details: string }>;
    };

    const existing = await prisma.giveaway.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Giveaway not found" },
        { status: 404 }
      );
    }

    if (
      existing.status === GiveawayStatus.DRAWN &&
      status !== GiveawayStatus.CANCELLED
    ) {
      // Only allow cancellation on drawn giveaways (besides translation updates)
      if (drawAt !== undefined || prizeCount !== undefined) {
        return NextResponse.json(
          { error: "Cannot edit core fields after DRAWN" },
          { status: 400 }
        );
      }
    }

    if (prizeCount !== undefined && prizeCount < 1) {
      return NextResponse.json(
        { error: "prizeCount must be at least 1" },
        { status: 400 }
      );
    }

    // Update giveaway fields
    const updateData: {
      drawAt?: Date | null;
      prizeCount?: number;
      status?: GiveawayStatus;
      commitHash?: string | null;
      revealedSecret?: string | null;
    } = {};
    if (drawAt !== undefined)
      updateData.drawAt = drawAt ? new Date(drawAt) : null;
    if (prizeCount !== undefined) updateData.prizeCount = prizeCount;
    if (status !== undefined) updateData.status = status;
    if (commitHash !== undefined) updateData.commitHash = commitHash;
    if (revealedSecret !== undefined)
      updateData.revealedSecret = revealedSecret;

    const giveaway = await prisma.giveaway.update({
      where: { id },
      data: updateData,
      include: {
        translations: true,
        event: { select: { id: true, title: true, slug: true } },
        _count: { select: { participations: true, winners: true } },
      },
    });

    // Upsert translations if provided
    if (translations && translations.length > 0) {
      await Promise.all(
        translations.map((t) =>
          prisma.giveawayTranslation.upsert({
            where: { giveawayId_lang: { giveawayId: id, lang: t.lang } },
            update: { title: t.title, details: t.details },
            create: {
              giveawayId: id,
              lang: t.lang,
              title: t.title,
              details: t.details,
            },
          })
        )
      );
    }

    return NextResponse.json({ giveaway });
  } catch (error) {
    console.error("Error updating giveaway:", error);
    return NextResponse.json(
      { error: "Failed to update giveaway" },
      { status: 500 }
    );
  }
}
