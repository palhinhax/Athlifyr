import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Currency } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - List all pricing phases for an event
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const phases = await prisma.pricingPhase.findMany({
      where: { eventId: id },
      orderBy: { startDate: "asc" },
    });

    return NextResponse.json(phases);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch pricing phases" },
      { status: 500 }
    );
  }
}

// POST - Create a new pricing phase
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Must be platform admin or an event organizer
    const isAdmin = user.role === "ADMIN";
    if (!isAdmin) {
      const organizer = await prisma.eventOrganizer.findFirst({
        where: { eventId: id, userId: user.id },
      });
      if (!organizer) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const body = (await request.json()) as {
      name: string;
      startDate: string;
      endDate: string;
      price: number;
      currency?: Currency;
      discountPercent?: number | null;
      note?: string | null;
      variantId?: string | null;
    };

    const {
      name,
      startDate,
      endDate,
      price,
      currency,
      discountPercent,
      note,
      variantId,
    } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "O nome é obrigatório" },
        { status: 400 }
      );
    }
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "As datas de início e fim são obrigatórias" },
        { status: 400 }
      );
    }
    if (price === undefined || price === null || isNaN(Number(price))) {
      return NextResponse.json(
        { error: "O preço é obrigatório" },
        { status: 400 }
      );
    }

    const phase = await prisma.pricingPhase.create({
      data: {
        eventId: id,
        variantId: variantId ?? null,
        name: name.trim(),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        price: Number(price),
        currency: currency ?? Currency.EUR,
        discountPercent: discountPercent ?? null,
        note: note?.trim() ?? null,
      },
    });

    return NextResponse.json(phase, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create pricing phase" },
      { status: 500 }
    );
  }
}
