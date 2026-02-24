import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", {
  apiVersion: "2026-01-28.clover",
});

// POST - Generate Stripe Express Dashboard login link
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
        { error: "Only venue owner can access Stripe dashboard" },
        { status: 403 }
      );
    }

    if (!member.venue.stripeAccountId) {
      return NextResponse.json(
        { error: "No Stripe account found" },
        { status: 400 }
      );
    }

    // Create login link for Express Dashboard
    const loginLink = await stripe.accounts.createLoginLink(
      member.venue.stripeAccountId
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
