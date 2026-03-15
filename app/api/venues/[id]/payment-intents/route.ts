import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe, toStripeAmount } from "@/lib/stripe";
import {
  getVenuePaymentContext,
  calculateCommission,
} from "@/lib/venues/stripe-route-helpers";

// POST - Create payment intent for IN_APP payment with Stripe
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const venueId = (await params).id;
    const body = await request.json();
    const { planId } = body;

    if (!planId) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 }
      );
    }

    const ctx = await getVenuePaymentContext(venueId);
    if ("error" in ctx) return ctx.error;

    const { session, venue } = ctx;

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

    // Check if venue supports IN_APP payments (payment mode at venue level)
    // Debug log to help diagnose payment mode
    console.log("Payment Intent Debug:", {
      planId,
      planName: plan.name,
      venuePaymentMode: venue.paymentMode,
      venueId: venue.id,
    });

    // Calculate commission (application fee)
    const amountCents = toStripeAmount(plan.price);
    const commissionCents = calculateCommission(venue, amountCents);

    // Create Stripe Payment Intent with destination charge
    const stripePaymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: plan.currency.toLowerCase(),
      application_fee_amount: commissionCents > 0 ? commissionCents : undefined,
      transfer_data: {
        destination: venue.stripeAccountId!,
      },
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
