import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import {
  authenticateVenueManager,
  requireStripeAccount,
} from "@/lib/venues/stripe-route-helpers";

// POST - Generate Stripe Express Dashboard login link
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: venueId } = await params;

    const ctx = await authenticateVenueManager(venueId);
    if ("error" in ctx) return ctx.error;

    const stripeError = requireStripeAccount(ctx.venue);
    if (stripeError) return stripeError;

    const loginLink = await stripe.accounts.createLoginLink(
      ctx.venue.stripeAccountId!
    );

    return NextResponse.json({ url: loginLink.url });
  } catch (error) {
    console.error("Error creating login link:", error);
    return NextResponse.json(
      { error: "Failed to create login link" },
      { status: 500 }
    );
  }
}
