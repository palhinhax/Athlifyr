import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", {
  apiVersion: "2026-01-28.clover",
});

// GET /api/events/[id]/registration/status — check user's registration status
// If registration is PENDING, automatically verify with Stripe and confirm if paid.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ registration: null }, { status: 200 });
    }

    const { id: eventId } = await params;

    // Find any registration for this user + event (any variant)
    const registration = await prisma.registration.findFirst({
      where: {
        userId: user.id,
        eventId,
      },
      include: {
        variant: {
          select: {
            id: true,
            name: true,
            distanceKm: true,
            startDate: true,
            startTime: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!registration) {
      return NextResponse.json({ registration: null }, { status: 200 });
    }

    // If PENDING, try to auto-confirm by checking Stripe directly
    if (
      registration.status === "PENDING" &&
      registration.stripeCheckoutSessionId
    ) {
      try {
        const checkoutSession = await stripe.checkout.sessions.retrieve(
          registration.stripeCheckoutSessionId
        );

        if (checkoutSession.payment_status === "paid") {
          const paymentIntentId =
            typeof checkoutSession.payment_intent === "string"
              ? checkoutSession.payment_intent
              : (checkoutSession.payment_intent?.id ?? null);

          // Confirm registration
          const updated = await prisma.registration.update({
            where: { id: registration.id },
            data: {
              status: "CONFIRMED",
              stripePaymentIntentId: paymentIntentId,
              amountCents:
                checkoutSession.amount_total ?? registration.amountCents,
            },
            include: {
              variant: {
                select: {
                  id: true,
                  name: true,
                  distanceKm: true,
                  startDate: true,
                  startTime: true,
                },
              },
            },
          });

          console.log(
            `Auto-confirmed PENDING registration ${updated.id} via Stripe check`
          );

          return NextResponse.json(
            {
              registration: {
                id: updated.id,
                status: updated.status,
                variantId: updated.variantId,
                variant: updated.variant,
                amountCents: updated.amountCents,
                currency: updated.currency,
                createdAt: updated.createdAt,
              },
            },
            { status: 200 }
          );
        }

        // If the Stripe checkout session has expired or was cancelled,
        // delete the stale PENDING registration so the user can try again
        if (checkoutSession.status === "expired") {
          console.log(
            `Deleting stale PENDING registration ${registration.id} (Stripe session expired)`
          );
          await prisma.registration.delete({
            where: { id: registration.id },
          });
          return NextResponse.json({ registration: null }, { status: 200 });
        }

        // If the Stripe session is still open but the registration is older
        // than 2 minutes, auto-expire it to free the spot
        const PENDING_EXPIRY_MS = 2 * 60 * 1000; // 2 minutes
        const registrationAge =
          Date.now() - new Date(registration.createdAt).getTime();

        if (registrationAge > PENDING_EXPIRY_MS) {
          // Expire the Stripe session if still open
          if (checkoutSession.status === "open") {
            try {
              await stripe.checkout.sessions.expire(
                registration.stripeCheckoutSessionId
              );
            } catch {
              // Ignore — session may already be expired
            }
          }

          console.log(
            `Auto-expiring stale PENDING registration ${registration.id} (older than 2 minutes)`
          );
          await prisma.registration.delete({
            where: { id: registration.id },
          });
          return NextResponse.json({ registration: null }, { status: 200 });
        }
      } catch (stripeError) {
        console.error("Error checking Stripe session:", stripeError);
        // Fall through and return PENDING status
      }
    }

    return NextResponse.json(
      {
        registration: {
          id: registration.id,
          status: registration.status,
          variantId: registration.variantId,
          variant: registration.variant,
          amountCents: registration.amountCents,
          currency: registration.currency,
          createdAt: registration.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking registration status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
