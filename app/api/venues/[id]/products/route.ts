import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageVenue } from "@/lib/venues/authorization";

/**
 * GET  /api/venues/[id]/products — List active products (public)
 * POST /api/venues/[id]/products — Create product (owner/admin)
 */

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const venueId = (await params).id;
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get("all") === "true";

    // If requesting all products (including inactive), verify the caller can manage the venue
    if (includeAll) {
      const session = await auth();
      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const allowed = await canManageVenue(session.user.id, venueId);
      if (!allowed.authorized) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const products = await prisma.venueProduct.findMany({
      where: { venueId, ...(includeAll ? {} : { isActive: true }) },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching venue products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const venueId = (await params).id;

    const allowed = await canManageVenue(session.user.id, venueId);
    if (!allowed.authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, description, price, currency, stock } = await request.json();

    if (!name || typeof price !== "number" || price <= 0) {
      return NextResponse.json(
        { error: "Name and a valid price are required" },
        { status: 400 }
      );
    }

    const product = await prisma.venueProduct.create({
      data: {
        venueId,
        name,
        description: description || null,
        price,
        currency: currency || "EUR",
        stock: stock != null ? stock : null,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Error creating venue product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
