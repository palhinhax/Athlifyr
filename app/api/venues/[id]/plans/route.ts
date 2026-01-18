import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageVenue } from "@/lib/venues/authorization";
import { Currency, PaymentProvider } from "@prisma/client";

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
    const { name, description, price, currency, policy, paymentProvider } =
      body;

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Validate currency if provided
    if (currency && !Object.values(Currency).includes(currency)) {
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
    }

    // Validate paymentProvider if provided
    if (
      paymentProvider &&
      !Object.values(PaymentProvider).includes(paymentProvider)
    ) {
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

    // If venue is MIXED mode, paymentProvider is required
    if (venue.paymentMode === "MIXED" && !paymentProvider) {
      return NextResponse.json(
        {
          error:
            "Payment provider is required for venues with MIXED payment mode",
        },
        { status: 400 }
      );
    }

    // Determine payment provider based on venue mode if not explicitly provided
    let finalPaymentProvider = paymentProvider;
    if (!finalPaymentProvider) {
      if (venue.paymentMode === "IN_APP") {
        finalPaymentProvider = PaymentProvider.IN_APP;
      } else if (venue.paymentMode === "EXTERNAL") {
        finalPaymentProvider = PaymentProvider.EXTERNAL;
      } else {
        // MIXED - default to IN_APP if not specified
        finalPaymentProvider = PaymentProvider.IN_APP;
      }
    }

    // Create plan
    const plan = await prisma.venuePlan.create({
      data: {
        venueId,
        name,
        description: description || null,
        price: price || null,
        currency: currency || Currency.EUR,
        paymentProvider: finalPaymentProvider,
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
