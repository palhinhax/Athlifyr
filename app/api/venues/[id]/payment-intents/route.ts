import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, toStripeAmount } from "@/lib/stripe";

// POST - Create payment intent for IN_APP payment with Stripe
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
      select: {
        id: true,
        name: true,
        isActive: true,
        paymentMode: true,
      },
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

    if (!plan.price || plan.price <= 0) {
      return NextResponse.json(
        { error: "Plan must have a valid price" },
        { status: 400 }
      );
    }

    // Debug log to help diagnose payment mode
    console.log("Payment Intent Debug:", {
      planId,
      planName: plan.name,
      venuePaymentMode: venue.paymentMode,
      venueId: venue.id,
    });

    // Check if venue supports IN_APP payments (payment mode at venue level)
    if (venue.paymentMode !== "IN_APP" && venue.paymentMode !== "MIXED") {
      console.error("Payment mode validation failed:", {
        planId,
        venuePaymentMode: venue.paymentMode,
        expected: "IN_APP or MIXED",
      });
      return NextResponse.json(
        { error: "Venue does not support IN_APP payments" },
        { status: 400 }
      );
    }

    // Create Stripe Payment Intent
    const stripePaymentIntent = await stripe.paymentIntents.create({
      amount: toStripeAmount(plan.price),
      currency: plan.currency.toLowerCase(),
      metadata: {
        venueId,
        venueName: venue.name,
        planId,
        planName: plan.name,
        userId: session.user.id,
        userEmail: session.user.email || "",
        userName: session.user.name || "",
      },
      description: `${venue.name} - ${plan.name}`,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Save payment intent to database
    const paymentIntent = await prisma.paymentIntent.create({
      data: {
        venueId,
        userId: session.user.id,
        planId,
        amount: plan.price,
        currency: plan.currency,
        status: "CREATED",
        provider: "STRIPE",
        stripePaymentIntentId: stripePaymentIntent.id,
      },
    });

    return NextResponse.json(
      {
        paymentIntent,
        clientSecret: stripePaymentIntent.client_secret,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
