import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", {
  apiVersion: "2026-01-28.clover",
});

// POST - Generate Stripe Connect onboarding link
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

    // Check if user is owner of the venue
    const member = await prisma.venueMember.findUnique({
      where: {
        venueId_userId: {
          venueId,
          userId: session.user.id,
        },
      },
      include: {
        venue: true,
      },
    });

    if (!member || member.role !== "OWNER") {
      return NextResponse.json(
        { error: "Only venue owner can manage Stripe Connect" },
        { status: 403 }
      );
    }

    if (!member.venue.stripeAccountId) {
      return NextResponse.json(
        { error: "No Stripe account found. Create one first." },
        { status: 400 }
      );
    }

    // Get the base URL from the request
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: member.venue.stripeAccountId,
      refresh_url: `${baseUrl}/venues/${member.venue.slug}/settings?tab=payments`,
      return_url: `${baseUrl}/venues/${member.venue.slug}/settings?tab=payments&stripe=success`,
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
