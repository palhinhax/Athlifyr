import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageVenue, isVenueOwner } from "@/lib/venues/authorization";
import { Currency } from "@prisma/client";

// GET - List plans for a venue
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: venueId } = await params;

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
        includedVenues: {
          include: {
            venue: {
              select: {
                id: true,
                name: true,
                slug: true,
                city: true,
                logo: true,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId } = await params;

    // Check authorization
    const authResult = await canManageVenue(session.user.id, venueId);
    if (!authResult.authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      description,
      price,
      currency,
      policy,
      paymentProvider,
      includedVenueIds,
    } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Validate currency if provided
    if (currency && !Object.values(Currency).includes(currency)) {
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
    }

    // Validate paymentProvider if provided
    const validProviders = ["IN_APP", "EXTERNAL", "BOTH"];
    if (paymentProvider && !validProviders.includes(paymentProvider)) {
      return NextResponse.json(
        { error: "Invalid payment provider" },
        { status: 400 }
      );
    }

    // Get venue to check paymentMode
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
    });

    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    // If includedVenueIds provided, verify user is OWNER of all included venues
    if (includedVenueIds && includedVenueIds.length > 0) {
      for (const includedVenueId of includedVenueIds) {
        const isOwner = await isVenueOwner(session.user.id, includedVenueId);
        if (!isOwner) {
          return NextResponse.json(
            {
              error:
                "You must be owner of all venues you want to include in this plan",
            },
            { status: 403 }
          );
        }
      }
    }

    // Payment mode is now managed at venue level - no need for plan-level validation

    // Create plan with included venues
    const plan = await prisma.venuePlan.create({
      data: {
        venueId,
        name,
        description: description || null,
        price: price || null,
        currency: currency || Currency.EUR,
        // paymentProvider removed - now managed at venue level
        policy: policy || null,
        ...(includedVenueIds &&
          includedVenueIds.length > 0 && {
            includedVenues: {
              create: includedVenueIds.map((vId: string) => ({
                venueId: vId,
              })),
            },
          }),
      },
      include: {
        includedVenues: {
          include: {
            venue: {
              select: {
                id: true,
                name: true,
                slug: true,
                city: true,
                logo: true,
              },
            },
          },
        },
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
