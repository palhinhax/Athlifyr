import { NextResponse } from "next/server";
import { Currency } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageVenue } from "@/lib/venues/authorization";

const VALID_CURRENCIES = new Set<string>(Object.values(Currency));

/**
 * PATCH  /api/venues/[id]/products/[productId] — Update product (owner/admin)
 * DELETE /api/venues/[id]/products/[productId] — Soft-delete product (owner/admin)
 */

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; productId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId, productId } = await params;

    const allowed = await canManageVenue(session.user.id, venueId);
    if (!allowed.authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const product = await prisma.venueProduct.findFirst({
      where: { id: productId, venueId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const { name, description, price, currency, stock, isActive } =
      await request.json();

    if (
      price !== undefined &&
      (typeof price !== "number" || !Number.isFinite(price) || price <= 0)
    ) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    if (currency !== undefined) {
      const upper = typeof currency === "string" ? currency.toUpperCase() : "";
      if (!VALID_CURRENCIES.has(upper)) {
        return NextResponse.json(
          { error: "Unsupported currency" },
          { status: 400 }
        );
      }
    }

    if (
      stock !== undefined &&
      stock !== null &&
      (typeof stock !== "number" || !Number.isInteger(stock) || stock < 0)
    ) {
      return NextResponse.json({ error: "Invalid stock" }, { status: 400 });
    }

    const updated = await prisma.venueProduct.update({
      where: { id: productId },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(price !== undefined ? { price } : {}),
        ...(currency !== undefined
          ? { currency: (currency as string).toUpperCase() as Currency }
          : {}),
        ...(stock !== undefined ? { stock } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
      },
    });

    return NextResponse.json({ product: updated });
  } catch (error) {
    console.error("Error updating venue product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; productId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId, productId } = await params;

    const allowed = await canManageVenue(session.user.id, venueId);
    if (!allowed.authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const product = await prisma.venueProduct.findFirst({
      where: { id: productId, venueId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Soft delete: mark as inactive
    await prisma.venueProduct.update({
      where: { id: productId },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting venue product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
