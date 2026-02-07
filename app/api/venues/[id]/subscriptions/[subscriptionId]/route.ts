import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  calculatePlanEndDate,
  type VenuePlanPolicy,
  DEFAULT_PLAN_POLICY,
} from "@/types/venue-plan";

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
      include: {
        plan: true,
      },
    });

    if (!existingSubscription || existingSubscription.venueId !== venueId) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: Record<string, unknown> = {};

    if (planId) updateData.planId = planId;
    if (startsAt) updateData.startsAt = new Date(startsAt);
    if (endsAt !== undefined)
      updateData.endsAt = endsAt ? new Date(endsAt) : null;
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    // When activating a subscription (status changing to ACTIVE),
    // auto-set activation fields and compute endsAt from plan policy
    if (status === "ACTIVE" && existingSubscription.status !== "ACTIVE") {
      updateData.activatedByUserId = session.user.id;
      updateData.activatedAt = new Date();

      // Set startsAt to now if not explicitly provided and subscription hasn't started yet
      if (!startsAt && existingSubscription.startsAt > new Date()) {
        updateData.startsAt = new Date();
      }

      // Compute endsAt from plan policy if not explicitly provided
      if (endsAt === undefined && !existingSubscription.endsAt) {
        const planPolicy = existingSubscription.plan
          .policy as unknown as VenuePlanPolicy | null;
        const duration = planPolicy?.duration || DEFAULT_PLAN_POLICY.duration;
        const durationValue =
          planPolicy?.durationValue || DEFAULT_PLAN_POLICY.durationValue;
        const effectiveStartsAt =
          (updateData.startsAt as Date) || existingSubscription.startsAt;
        const computedEndsAt = calculatePlanEndDate(
          effectiveStartsAt,
          duration,
          durationValue
        );
        updateData.endsAt = computedEndsAt;
      }

      // Mark any other ACTIVE subscriptions for the same plan+user as COMPLETED
      // This handles the case where an exhausted pack wasn't properly completed
      await prisma.venueSubscription.updateMany({
        where: {
          userId: existingSubscription.userId,
          planId: existingSubscription.planId,
          status: "ACTIVE",
          id: { not: subscriptionId },
        },
        data: { status: "COMPLETED" },
      });
    }

    // Update subscription
    const subscription = await prisma.venueSubscription.update({
      where: { id: subscriptionId },
      data: updateData,
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

// DELETE - Delete subscription (owner/admin only)
export async function DELETE(
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

    // Delete subscription
    await prisma.venueSubscription.delete({
      where: { id: subscriptionId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return NextResponse.json(
      { error: "Failed to delete subscription" },
      { status: 500 }
    );
  }
}
