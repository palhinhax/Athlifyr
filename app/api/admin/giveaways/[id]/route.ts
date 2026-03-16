import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GiveawayStatus, GiveawayPlatform, Language } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

interface GiveawayPatchBody {
  drawAt?: string | null;
  prizeCount?: number;
  status?: GiveawayStatus;
  platform?: GiveawayPlatform;
  secretHash?: string | null;
  secretRevealed?: string | null;
  translations?: Array<{ lang: Language; title: string; details: string }>;
}

const VALID_TRANSITIONS: Record<GiveawayStatus, GiveawayStatus[]> = {
  DRAFT: [GiveawayStatus.SCHEDULED, GiveawayStatus.CANCELLED],
  SCHEDULED: [GiveawayStatus.DRAWING, GiveawayStatus.CANCELLED],
  DRAWING: [GiveawayStatus.DRAWN],
  DRAWN: [],
  CANCELLED: [],
};

function validateGiveawayPatch(
  existing: { status: GiveawayStatus },
  body: GiveawayPatchBody
): string | null {
  const { drawAt, prizeCount, status, platform, secretHash } = body;

  // Validate status transition
  if (status !== undefined && status !== existing.status) {
    const allowed = VALID_TRANSITIONS[existing.status] ?? [];
    if (!allowed.includes(status)) {
      return `Invalid status transition: ${existing.status} → ${status}`;
    }
  }

  // Only DRAFT giveaways can have core fields edited
  if (
    existing.status !== GiveawayStatus.DRAFT &&
    (drawAt !== undefined || prizeCount !== undefined || platform !== undefined)
  ) {
    return "Cannot edit core fields after the giveaway leaves DRAFT status";
  }

  // Terminal states
  if (existing.status === GiveawayStatus.CANCELLED) {
    return "Cannot modify a cancelled giveaway";
  }

  if (
    existing.status === GiveawayStatus.DRAWN &&
    (drawAt !== undefined ||
      prizeCount !== undefined ||
      secretHash !== undefined)
  ) {
    return "Cannot edit core fields after DRAWN";
  }

  if (prizeCount !== undefined && prizeCount < 1) {
    return "prizeCount must be at least 1";
  }

  return null;
}

function buildGiveawayUpdateData(body: GiveawayPatchBody) {
  const data: Record<string, unknown> = {};
  if (body.drawAt !== undefined)
    data.drawAt = body.drawAt ? new Date(body.drawAt) : null;
  if (body.prizeCount !== undefined) data.prizeCount = body.prizeCount;
  if (body.status !== undefined) data.status = body.status;
  if (body.platform !== undefined) data.platform = body.platform;
  if (body.secretHash !== undefined) data.secretHash = body.secretHash;
  if (body.secretRevealed !== undefined)
    data.secretRevealed = body.secretRevealed;
  return data;
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
    const body = (await request.json()) as GiveawayPatchBody;

    const existing = await prisma.giveaway.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Giveaway not found" },
        { status: 404 }
      );
    }

    const validationError = validateGiveawayPatch(existing, body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const giveaway = await prisma.giveaway.update({
      where: { id },
      data: buildGiveawayUpdateData(body),
      include: {
        translations: true,
        event: { select: { id: true, title: true, slug: true } },
        _count: { select: { participations: true, winners: true } },
      },
    });

    // Upsert translations if provided
    if (body.translations && body.translations.length > 0) {
      await Promise.all(
        body.translations.map((t) =>
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
