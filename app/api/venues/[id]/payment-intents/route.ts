import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PaymentProvider } from "@prisma/client";

// POST - Create payment intent for IN_APP payment
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const venueId = params.id;
    const body = await request.json();
    const { planId } = body;

    if (!planId) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 }
      );
    }

    // Get venue and plan
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
    });

    if (!venue || !venue.isActive) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    const plan = await prisma.venuePlan.findFirst({
      where: {
        id: planId,
        venueId: venueId,
        isActive: true,
      },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Check if plan is IN_APP
    if (plan.paymentProvider !== PaymentProvider.IN_APP) {
      return NextResponse.json(
        { error: "Plan does not support IN_APP payments" },
        { status: 400 }
      );
    }

    // Check if venue allows IN_APP (if not EXTERNAL only)
    if (venue.paymentMode === "EXTERNAL") {
      return NextResponse.json(
        { error: "Venue only accepts external payments" },
        { status: 400 }
      );
    }

    // Create payment intent
    const paymentIntent = await prisma.paymentIntent.create({
      data: {
        venueId,
        userId: session.user.id,
        planId,
        amount: plan.price || 0,
        currency: plan.currency,
        status: "CREATED",
        provider: "INTERNAL_MVP",
      },
    });

    return NextResponse.json(paymentIntent, { status: 201 });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
