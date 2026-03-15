import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import {
  authenticateVenueManager,
  requireStripeAccount,
} from "@/lib/venues/stripe-route-helpers";

// POST - Generate Stripe Connect onboarding link
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

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const accountLink = await stripe.accountLinks.create({
      account: ctx.venue.stripeAccountId!,
      refresh_url: `${baseUrl}/venues/${ctx.venue.slug}`,
      return_url: `${baseUrl}/venues/${ctx.venue.slug}`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error("Error creating onboarding link:", error);
    return NextResponse.json(
      { error: "Failed to create onboarding link" },
      { status: 500 }
    );
  }
}
