import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Currency } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string; phaseId: string }>;
}

// PATCH - Update a pricing phase
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, phaseId } = await params;

    const isAdmin = user.role === "ADMIN";
    if (!isAdmin) {
      const organizer = await prisma.eventOrganizer.findFirst({
        where: { eventId: id, userId: user.id },
      });
      if (!organizer) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const phase = await prisma.pricingPhase.findFirst({
      where: { id: phaseId, eventId: id },
    });
    if (!phase) {
      return NextResponse.json(
        { error: "Pricing phase not found" },
        { status: 404 }
      );
    }

    const body = (await request.json()) as {
      name?: string;
      startDate?: string;
      endDate?: string;
      price?: number;
      currency?: Currency;
      discountPercent?: number | null;
      note?: string | null;
      variantId?: string | null;
    };

    const updated = await prisma.pricingPhase.update({
      where: { id: phaseId },
      data: {
        ...(body.name !== undefined && { name: body.name.trim() }),
        ...(body.startDate !== undefined && {
          startDate: new Date(body.startDate),
        }),
        ...(body.endDate !== undefined && { endDate: new Date(body.endDate) }),
        ...(body.price !== undefined && { price: Number(body.price) }),
        ...(body.currency !== undefined && { currency: body.currency }),
        ...(body.discountPercent !== undefined && {
          discountPercent: body.discountPercent,
        }),
        ...(body.note !== undefined && { note: body.note?.trim() ?? null }),
        ...(body.variantId !== undefined && {
          variantId: body.variantId ?? null,
        }),
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update pricing phase" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a pricing phase
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, phaseId } = await params;

    const isAdmin = user.role === "ADMIN";
    if (!isAdmin) {
      const organizer = await prisma.eventOrganizer.findFirst({
        where: { eventId: id, userId: user.id },
      });
      if (!organizer) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const phase = await prisma.pricingPhase.findFirst({
      where: { id: phaseId, eventId: id },
    });
    if (!phase) {
      return NextResponse.json(
        { error: "Pricing phase not found" },
        { status: 404 }
      );
    }

    await prisma.pricingPhase.delete({ where: { id: phaseId } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete pricing phase" },
      { status: 500 }
    );
  }
}
