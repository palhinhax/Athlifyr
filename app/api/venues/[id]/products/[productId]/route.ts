import { NextResponse } from "next/server";
import { Currency } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { authenticateVenueManager } from "@/lib/venues/stripe-route-helpers";

const VALID_CURRENCIES = new Set<string>(Object.values(Currency));

/**
 * PATCH  /api/venues/[id]/products/[productId] — Update product (owner/admin)
 * DELETE /api/venues/[id]/products/[productId] — Soft-delete product (owner/admin)
 */

async function getAuthorizedProduct(venueId: string, productId: string) {
  const ctx = await authenticateVenueManager(venueId);
  if ("error" in ctx) return { error: ctx.error } as const;

  const product = await prisma.venueProduct.findFirst({
    where: { id: productId, venueId },
  });

  if (!product) {
    return {
      error: NextResponse.json({ error: "Product not found" }, { status: 404 }),
    } as const;
  }

  return { product } as const;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; productId: string }> }
) {
  try {
    const { id: venueId, productId } = await params;

    const ctx = await getAuthorizedProduct(venueId, productId);
    if ("error" in ctx) return ctx.error;

    const { name, description, price, currency, stock, isActive } =
      await request.json();

    if (
      price !== undefined &&
      (typeof price !== "number" || !Number.isFinite(price) || price <= 0)
    ) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    if (
      currency !== undefined &&
      !VALID_CURRENCIES.has(
        typeof currency === "string" ? currency.toUpperCase() : ""
      )
    ) {
      return NextResponse.json(
        { error: "Unsupported currency" },
        { status: 400 }
      );
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
    const { id: venueId, productId } = await params;

    const ctx = await getAuthorizedProduct(venueId, productId);
    if ("error" in ctx) return ctx.error;

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
