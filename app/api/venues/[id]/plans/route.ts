import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageVenue } from "@/lib/venues/authorization";
import { Currency } from "@prisma/client";

// GET - List plans for a venue
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: venueId } = params;

    const plans = await prisma.venuePlan.findMany({
      where: {
        venueId,
        isActive: true,
      },
      include: {
        _count: {
          select: {
            subscriptions: {
              where: {
                status: "ACTIVE",
              },
            },
          },
        },
      },
      orderBy: {
        price: "asc",
      },
    });

    return NextResponse.json({ plans });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}

// POST - Create new plan (owner/admin only)
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId } = params;

    // Check authorization
    const authResult = await canManageVenue(session.user.id, venueId);
    if (!authResult.authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, price, currency, policy } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Validate currency if provided
    if (currency && !Object.values(Currency).includes(currency)) {
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
    }

    // Create plan
    const plan = await prisma.venuePlan.create({
      data: {
        venueId,
        name,
        description: description || null,
        price: price || null,
        currency: currency || Currency.EUR,
        policy: policy || null,
      },
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("Error creating plan:", error);
    return NextResponse.json(
      { error: "Failed to create plan" },
      { status: 500 }
    );
  }
}
