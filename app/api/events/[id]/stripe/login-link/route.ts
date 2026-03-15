import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import {
  getUserEventContext,
  hasEventPermission,
} from "@/lib/event-permissions";

// POST /api/events/[id]/stripe/login-link — generate Stripe Express Dashboard login link
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
          error:
            "Only the event OWNER or Platform Admin can access Stripe dashboard",
        },
        { status: 403 }
      );
    }

    if (!event.stripeAccountId) {
      return NextResponse.json(
        { error: "No Stripe account found" },
        { status: 400 }
      );
    }

    const loginLink = await stripe.accounts.createLoginLink(
      event.stripeAccountId
    );

    return NextResponse.json({ url: loginLink.url });
  } catch (error) {
    console.error("Error creating login link for event:", error);
    return NextResponse.json(
      { error: "Failed to create login link" },
      { status: 500 }
    );
  }
}
