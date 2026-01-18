import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageVenue } from "@/lib/venues/authorization";

// POST - Mark subscription as paid (EXTERNAL payments - owner/admin only)
export async function POST(
  request: Request,
  { params }: { params: { id: string; subscriptionId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId, subscriptionId } = params;

    // Check authorization - must be owner or admin
    const authResult = await canManageVenue(session.user.id, venueId);
    if (!authResult.authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get subscription
    const subscription = await prisma.venueSubscription.findFirst({
      where: {
        id: subscriptionId,
        venueId: venueId,
      },
      include: {
        plan: true,
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    // Check if plan is EXTERNAL
    if (subscription.plan.paymentProvider !== "EXTERNAL") {
      return NextResponse.json(
        { error: "This subscription does not use external payment" },
        { status: 400 }
      );
    }

    // Check if already paid
    if (subscription.paymentStatus === "PAID") {
      return NextResponse.json(
        { error: "Subscription already marked as paid" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { amount, method, note, paidAt } = body;

    // Update subscription
    const updatedSubscription = await prisma.venueSubscription.update({
      where: { id: subscriptionId },
      data: {
        status: "ACTIVE",
        paymentStatus: "PAID",
        activatedByUserId: session.user.id,
        activatedAt: new Date(),
        paymentAmount: amount || subscription.plan.price,
        paymentMethod: method || "Manual",
        paymentNote: note || null,
        paymentConfirmedAt: paidAt ? new Date(paidAt) : new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        plan: true,
      },
    });

    return NextResponse.json(updatedSubscription);
  } catch (error) {
    console.error("Error marking subscription as paid:", error);
    return NextResponse.json(
      { error: "Failed to mark subscription as paid" },
      { status: 500 }
    );
  }
}
