import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import {
  getUserEventContext,
  hasEventPermission,
} from "@/lib/event-permissions";

// POST /api/events/[id]/stripe/onboarding-link — generate onboarding link
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

    const event = await prisma.event.findUnique({ where: { id: eventId } });
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

    if (!event.stripeAccountId) {
      return NextResponse.json(
        {
          error:
            "No Stripe account found. Create one first via POST /stripe/connect",
        },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const accountLink = await stripe.accountLinks.create({
      account: event.stripeAccountId,
      refresh_url: `${baseUrl}/events/${event.slug}/manage?tab=payments`,
      return_url: `${baseUrl}/events/${event.slug}/manage?tab=payments&stripe=success`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error("Error creating onboarding link for event:", error);
    return NextResponse.json(
      { error: "Failed to create onboarding link" },
      { status: 500 }
    );
  }
}
