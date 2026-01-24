import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH - Update subscription (owner/admin only)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; subscriptionId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId, subscriptionId } = await params;

    // Check if user is owner or admin of this venue
    const member = await prisma.venueMember.findUnique({
      where: {
        venueId_userId: {
          venueId,
          userId: session.user.id,
        },
      },
    });

    // Also check if user is app admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    const isOwnerOrAdmin =
      member && (member.role === "OWNER" || member.role === "ADMIN");
    const isAppAdmin = user?.role === "ADMIN";

    if (!isOwnerOrAdmin && !isAppAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { planId, startsAt, endsAt, status, paymentStatus } = body;

    // Verify subscription belongs to this venue
    const existingSubscription = await prisma.venueSubscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!existingSubscription || existingSubscription.venueId !== venueId) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    // Update subscription
    const subscription = await prisma.venueSubscription.update({
      where: { id: subscriptionId },
      data: {
        ...(planId && { planId }),
        ...(startsAt && { startsAt: new Date(startsAt) }),
        ...(endsAt !== undefined && {
          endsAt: endsAt ? new Date(endsAt) : null,
        }),
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        plan: {
          select: {
            id: true,
            name: true,
            price: true,
            currency: true,
          },
        },
      },
    });

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}
