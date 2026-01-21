import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculatePlanEndDate, type VenuePlanPolicy } from "@/types/venue-plan";
import { trackServerEvent, ANALYTICS_EVENTS } from "@/lib/analytics";

// POST - Confirm payment intent (MVP - simulated)
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const intentId = params.id;

    // Get payment intent with plan policy
    const intent = await prisma.paymentIntent.findUnique({
      where: { id: intentId },
      include: {
        venue: true,
        user: true,
        plan: {
          select: {
            id: true,
            name: true,
            policy: true,
          },
        },
      },
    });

    if (!intent) {
      return NextResponse.json(
        { error: "Payment intent not found" },
        { status: 404 }
      );
    }

    // Check ownership
    if (intent.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if already confirmed or failed
    if (intent.status === "CONFIRMED") {
      return NextResponse.json(
        { error: "Payment already confirmed" },
        { status: 400 }
      );
    }

    if (intent.status === "FAILED" || intent.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Payment intent cannot be confirmed" },
        { status: 400 }
      );
    }

    // Calculate end date based on plan policy
    const startDate = new Date();
    let endDate: Date | undefined;

    if (intent.plan?.policy) {
      const policy = intent.plan.policy as unknown as VenuePlanPolicy;
      endDate = calculatePlanEndDate(
        startDate,
        policy.duration,
        policy.durationValue
      );
    }

    // Update payment intent to CONFIRMED
    const updatedIntent = await prisma.paymentIntent.update({
      where: { id: intentId },
      data: {
        status: "CONFIRMED",
      },
    });

    // Activate or create subscription
    const existingSubscription = await prisma.venueSubscription.findFirst({
      where: {
        userId: intent.userId,
        venueId: intent.venueId,
        planId: intent.planId,
      },
    });

    let subscription;
    if (existingSubscription) {
      // Update existing subscription
      subscription = await prisma.venueSubscription.update({
        where: { id: existingSubscription.id },
        data: {
          status: "ACTIVE",
          paymentStatus: "PAID",
          paymentConfirmedAt: new Date(),
          startsAt: startDate,
          endsAt: endDate,
        },
      });
    } else {
      // Create new subscription
      subscription = await prisma.venueSubscription.create({
        data: {
          venueId: intent.venueId,
          userId: intent.userId,
          planId: intent.planId,
          status: "ACTIVE",
          paymentStatus: "PAID",
          paymentConfirmedAt: new Date(),
          startsAt: startDate,
          endsAt: endDate,
        },
      });
    }

    // Track successful purchase
    await trackServerEvent(
      ANALYTICS_EVENTS.PURCHASE_COMPLETED,
      {
        userId: intent.userId,
        venueId: intent.venueId,
        planId: intent.planId,
        planName: intent.plan?.name || "Unknown",
        amount: intent.amount,
        subscriptionId: subscription.id,
      },
      session.user.email
    );

    return NextResponse.json({
      paymentIntent: updatedIntent,
      subscription,
    });
  } catch (error) {
    console.error("Error confirming payment intent:", error);
    return NextResponse.json(
      { error: "Failed to confirm payment" },
      { status: 500 }
    );
  }
}
