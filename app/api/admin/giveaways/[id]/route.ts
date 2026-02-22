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
      secretHash,
      secretRevealed,
    } = body as {
      drawAt?: string | null;
      prizeCount?: number;
      status?: GiveawayStatus;
      secretHash?: string | null;
      secretRevealed?: string | null;
      translations?: Array<{ lang: Language; title: string; details: string }>;
    };

    const existing = await prisma.giveaway.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Giveaway not found" },
        { status: 404 }
      );
    }

    // ── State transition validation ──
    // Valid transitions:
    //   DRAFT     → SCHEDULED, CANCELLED
    //   SCHEDULED → DRAWING, CANCELLED
    //   DRAWING   → DRAWN
    //   DRAWN     → (no status change allowed)
    //   CANCELLED → (terminal state)
    const VALID_TRANSITIONS: Record<GiveawayStatus, GiveawayStatus[]> = {
      DRAFT: [GiveawayStatus.SCHEDULED, GiveawayStatus.CANCELLED],
      SCHEDULED: [GiveawayStatus.DRAWING, GiveawayStatus.CANCELLED],
      DRAWING: [GiveawayStatus.DRAWN],
      DRAWN: [],
      CANCELLED: [],
    };

    if (status !== undefined && status !== existing.status) {
      const allowed = VALID_TRANSITIONS[existing.status] ?? [];
      if (!allowed.includes(status)) {
        return NextResponse.json(
          {
            error: `Invalid status transition: ${existing.status} → ${status}`,
          },
          { status: 400 }
        );
      }
    }

    // Only DRAFT giveaways can have core fields edited (event, prizeCount, drawAt)
    if (
      existing.status !== GiveawayStatus.DRAFT &&
      (drawAt !== undefined || prizeCount !== undefined)
    ) {
      return NextResponse.json(
        {
          error:
            "Cannot edit core fields after the giveaway leaves DRAFT status",
        },
        { status: 400 }
      );
    }

    // CANCELLED and DRAWN are terminal — only allow secretRevealed on DRAWN
    if (existing.status === GiveawayStatus.CANCELLED) {
      return NextResponse.json(
        { error: "Cannot modify a cancelled giveaway" },
        { status: 400 }
      );
    }

    if (existing.status === GiveawayStatus.DRAWN) {
      // Only allow revealing the secret and updating translations
      if (
        drawAt !== undefined ||
        prizeCount !== undefined ||
        secretHash !== undefined
      ) {
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
      secretHash?: string | null;
      secretRevealed?: string | null;
    } = {};
    if (drawAt !== undefined)
      updateData.drawAt = drawAt ? new Date(drawAt) : null;
    if (prizeCount !== undefined) updateData.prizeCount = prizeCount;
    if (status !== undefined) updateData.status = status;
    if (secretHash !== undefined) updateData.secretHash = secretHash;
    if (secretRevealed !== undefined)
      updateData.secretRevealed = secretRevealed;

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

// DELETE - Delete a giveaway (only DRAFT allowed)
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.giveaway.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Giveaway not found" },
        { status: 404 }
      );
    }

    if (existing.status !== GiveawayStatus.DRAFT) {
      return NextResponse.json(
        { error: "Only DRAFT giveaways can be deleted" },
        { status: 400 }
      );
    }

    // Delete related records first, then the giveaway
    await prisma.$transaction([
      prisma.giveawayTranslation.deleteMany({ where: { giveawayId: id } }),
      prisma.giveawayParticipation.deleteMany({ where: { giveawayId: id } }),
      prisma.giveawayWinner.deleteMany({ where: { giveawayId: id } }),
      prisma.giveaway.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting giveaway:", error);
    return NextResponse.json(
      { error: "Failed to delete giveaway" },
      { status: 500 }
    );
  }
}
