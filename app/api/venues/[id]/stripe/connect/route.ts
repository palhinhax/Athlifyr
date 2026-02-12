import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", {
  apiVersion: "2026-01-28.clover",
});

// POST - Create or get Stripe Connect account for venue
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

    // If venue already has a Stripe account, return it
    if (member.venue.stripeAccountId) {
      return NextResponse.json({
        accountId: member.venue.stripeAccountId,
        message: "Stripe account already exists",
      });
    }

    // Create new Stripe Connect Express account
    const account = await stripe.accounts.create({
      type: "express",
      country: "PT", // Portugal
      email: member.venue.email || session.user.email || undefined,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: "individual", // or 'company' based on venue type
      metadata: {
        venueId: member.venue.id,
        venueName: member.venue.name,
      },
    });

    // Save account ID to venue
    await prisma.venue.update({
      where: { id: venueId },
      data: {
        stripeAccountId: account.id,
        paymentsProvider: "STRIPE",
        stripeOnboardingStatus: "PENDING",
      },
    });

    return NextResponse.json({
      accountId: account.id,
      message: "Stripe Connect account created successfully",
    });
  } catch (error) {
    console.error("Error creating Stripe Connect account:", error);
    return NextResponse.json(
      { error: "Failed to create Stripe Connect account" },
      { status: 500 }
    );
  }
}
