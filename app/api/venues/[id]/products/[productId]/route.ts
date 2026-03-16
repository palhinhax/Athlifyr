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

function validateProductFields(fields: {
  price: unknown;
  currency: unknown;
  stock: unknown;
}): NextResponse | null {
  const { price, currency, stock } = fields;

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

  return null;
}

function buildProductUpdate(fields: {
  name: unknown;
  description: unknown;
  price: unknown;
  currency: unknown;
  stock: unknown;
  isActive: unknown;
}) {
  const data: Record<string, unknown> = {};
  if (fields.name !== undefined) data.name = fields.name;
  if (fields.description !== undefined) data.description = fields.description;
  if (fields.price !== undefined) data.price = fields.price;
  if (fields.currency !== undefined)
    data.currency = (fields.currency as string).toUpperCase();
  if (fields.stock !== undefined) data.stock = fields.stock;
  if (fields.isActive !== undefined) data.isActive = fields.isActive;
  return data;
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

    const validationError = validateProductFields({ price, currency, stock });
    if (validationError) return validationError;

    const updated = await prisma.venueProduct.update({
      where: { id: productId },
      data: buildProductUpdate({
        name,
        description,
        price,
        currency,
        stock,
        isActive,
      }),
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
