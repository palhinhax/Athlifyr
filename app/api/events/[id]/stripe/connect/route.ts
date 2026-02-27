import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import {
  getUserEventContext,
  hasEventPermission,
} from "@/lib/event-permissions";

// POST /api/events/[id]/stripe/connect — create Stripe Connect account for event
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId } = await params;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const ctx = await getUserEventContext(user.id, user.role, eventId);
    if (!hasEventPermission(ctx, "manage_stripe")) {
      return NextResponse.json(
        {
          error: "Only the event OWNER or Platform Admin can configure Stripe",
        },
        { status: 403 }
      );
    }

    // If already has a Stripe account, return it
    if (event.stripeAccountId) {
      return NextResponse.json({
        accountId: event.stripeAccountId,
        message: "Stripe account already exists",
      });
    }

    // Create new Stripe Connect Express account
    const account = await stripe.accounts.create({
      type: "express",
      country: "PT",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: "individual",
      metadata: {
        eventId: event.id,
        eventSlug: event.slug,
        eventTitle: event.title,
      },
    });

    await prisma.event.update({
      where: { id: eventId },
      data: {
        stripeAccountId: account.id,
        stripeOnboardingStatus: "PENDING",
      },
    });

    return NextResponse.json({
      accountId: account.id,
      message: "Stripe Connect account created successfully",
    });
  } catch (error) {
    console.error("Error creating Stripe Connect account for event:", error);
    return NextResponse.json(
      { error: "Failed to create Stripe Connect account" },
      { status: 500 }
    );
  }
}
