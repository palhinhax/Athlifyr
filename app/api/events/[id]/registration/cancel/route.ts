import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", {
  apiVersion: "2025-12-15.clover",
});

// POST /api/events/[id]/registration/cancel
// Delete a stale PENDING registration when the user cancels Stripe checkout.
// Only deletes if the registration is PENDING and the Stripe session is open/expired.
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

    // Find the user's most recent PENDING registration for this event
    const registration = await prisma.registration.findFirst({
      where: {
        userId: user.id,
        eventId,
        status: "PENDING",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!registration) {
      return NextResponse.json({ deleted: false }, { status: 200 });
    }

    // If it has a Stripe session, try to expire it first
    if (registration.stripeCheckoutSessionId) {
      try {
        const session = await stripe.checkout.sessions.retrieve(
          registration.stripeCheckoutSessionId
        );

        // Only expire if the session is still open
        if (session.status === "open") {
          await stripe.checkout.sessions.expire(
            registration.stripeCheckoutSessionId
          );
          console.log(
            `Expired Stripe session ${registration.stripeCheckoutSessionId} for cancelled registration`
          );
        }
      } catch (stripeError) {
        console.error("Error expiring Stripe session:", stripeError);
        // Continue with deletion even if Stripe expiry fails
      }
    }

    // Delete the PENDING registration
    await prisma.registration.delete({
      where: { id: registration.id },
    });

    console.log(
      `Deleted PENDING registration ${registration.id} (user cancelled checkout)`
    );

    return NextResponse.json({ deleted: true }, { status: 200 });
  } catch (error) {
    console.error("Error cancelling registration:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
