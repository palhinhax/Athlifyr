import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import type { CustomFieldType as PrismaFieldType } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ─── GET /api/events/[id]/custom-fields ──────────────────────────────────────
// Public: returns custom fields for an event (used in registration form)
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id: eventId } = await params;

    const fields = await prisma.eventCustomField.findMany({
      where: { eventId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(fields);
  } catch (error) {
    console.error("Error fetching custom fields:", error);
    return NextResponse.json(
      { error: "Failed to fetch custom fields" },
      { status: 500 }
    );
  }
}

// ─── POST /api/events/[id]/custom-fields ─────────────────────────────────────
// Organizer creates a new custom field
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId } = await params;

    // Check organizer permission
    const isAllowed = await canManageEvent(user.id, user.role, eventId);
    if (!isAllowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await request.json()) as {
      label: string;
      type: string;
      options?: string[];
      required?: boolean;
      priceCents?: number;
      currency?: string;
    };

    if (!body.label?.trim()) {
      return NextResponse.json({ error: "Label is required" }, { status: 400 });
    }

    // Get the next order value
    const maxOrder = await prisma.eventCustomField.aggregate({
      where: { eventId },
      _max: { order: true },
    });

    const field = await prisma.eventCustomField.create({
      data: {
        eventId,
        label: body.label.trim(),
        type: (body.type ?? "SELECT") as PrismaFieldType,
        options: body.options ?? [],
        required: body.required ?? false,
        priceCents: body.priceCents ?? 0,
        currency: (body.currency ?? "EUR") as "EUR" | "USD" | "GBP" | "CHF",
        order: (maxOrder._max.order ?? 0) + 1,
      },
    });

    return NextResponse.json(field, { status: 201 });
  } catch (error) {
    console.error("Error creating custom field:", error);
    return NextResponse.json(
      { error: "Failed to create custom field" },
      { status: 500 }
    );
  }
}

// ─── PATCH /api/events/[id]/custom-fields ────────────────────────────────────
// Bulk update custom fields (reorder, edit)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId } = await params;

    const isAllowed = await canManageEvent(user.id, user.role, eventId);
    if (!isAllowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await request.json()) as {
      id: string;
      label?: string;
      type?: string;
      options?: string[];
      required?: boolean;
      priceCents?: number;
      currency?: string;
      order?: number;
    };

    const field = await prisma.eventCustomField.update({
      where: { id: body.id, eventId },
      data: {
        ...(body.label !== undefined && { label: body.label.trim() }),
        ...(body.type !== undefined && {
          type: body.type as PrismaFieldType,
        }),
        ...(body.options !== undefined && { options: body.options }),
        ...(body.required !== undefined && { required: body.required }),
        ...(body.priceCents !== undefined && { priceCents: body.priceCents }),
        ...(body.currency !== undefined && {
          currency: body.currency as "EUR" | "USD" | "GBP" | "CHF",
        }),
        ...(body.order !== undefined && { order: body.order }),
      },
    });

    return NextResponse.json(field);
  } catch (error) {
    console.error("Error updating custom field:", error);
    return NextResponse.json(
      { error: "Failed to update custom field" },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/events/[id]/custom-fields?fieldId=xxx ───────────────────────
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId } = await params;

    const isAllowed = await canManageEvent(user.id, user.role, eventId);
    if (!isAllowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const fieldId = request.nextUrl.searchParams.get("fieldId");
    if (!fieldId) {
      return NextResponse.json(
        { error: "fieldId is required" },
        { status: 400 }
      );
    }

    await prisma.eventCustomField.delete({
      where: { id: fieldId, eventId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting custom field:", error);
    return NextResponse.json(
      { error: "Failed to delete custom field" },
      { status: 500 }
    );
  }
}

// ─── Helper: check organizer permission ──────────────────────────────────────
async function canManageEvent(
  userId: string,
  userRole: string,
  eventId: string
): Promise<boolean> {
  if (userRole === "ADMIN") return true;

  const organizer = await prisma.eventOrganizer.findFirst({
    where: {
      eventId,
      userId,
      role: { in: ["OWNER", "ADMIN"] },
    },
  });

  return !!organizer;
}
