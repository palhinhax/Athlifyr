import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import {
  calculatePlanEndDate,
  type VenuePlanPolicy,
  DEFAULT_PLAN_POLICY,
} from "@/types/venue-plan";
import { PaymentStatus } from "@prisma/client";
// PaymentProvider removed - now using PaymentsProvider at venue level

// GET - Fetch all subscriptions for a venue (owner/admin only)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId } = await params;

    // Check if user is owner or admin of this venue
    const member = await prisma.venueMember.findUnique({
      where: {
        venueId_userId: {
          venueId,
          userId: authUser.id,
        },
      },
    });

    // Also check if user is app admin
    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: { role: true },
    });

    const isOwnerOrAdmin =
      member && (member.role === "OWNER" || member.role === "ADMIN");
    const isAppAdmin = user?.role === "ADMIN";

    if (!isOwnerOrAdmin && !isAppAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all subscriptions for this venue
    const subscriptions = await prisma.venueSubscription.findMany({
      where: {
        venueId,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function createManualSubscription(
  authUserId: string,
  venueId: string,
  planId: string | undefined,
  targetUserId: string | undefined,
  startsAt: string | undefined,
  endsAt: string | undefined,
  manualPaymentStatus: string | undefined
): Promise<NextResponse> {
  const member = await prisma.venueMember.findUnique({
    where: { venueId_userId: { venueId, userId: authUserId } },
  });
  const user = await prisma.user.findUnique({
    where: { id: authUserId },
    select: { role: true },
  });

  const isOwnerOrAdmin =
    member && (member.role === "OWNER" || member.role === "ADMIN");
  const isAppAdmin = user?.role === "ADMIN";

  if (!isOwnerOrAdmin && !isAppAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!planId || !targetUserId) {
    return NextResponse.json(
      { error: "Plan ID and User ID are required" },
      { status: 400 }
    );
  }

  const plan = await prisma.venuePlan.findUnique({ where: { id: planId } });
  if (!plan || plan.venueId !== venueId) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  let targetMember = await prisma.venueMember.findUnique({
    where: { venueId_userId: { venueId, userId: targetUserId } },
  });
  if (!targetMember) {
    targetMember = await prisma.venueMember.create({
      data: {
        venueId,
        userId: targetUserId,
        role: "CLIENT",
        status: "ACTIVE",
        joinedAt: new Date(),
      },
    });
  }

  const subscriptionStartsAt = startsAt ? new Date(startsAt) : new Date();
  let subscriptionEndsAt: Date | null = null;

  if (endsAt) {
    subscriptionEndsAt = new Date(endsAt);
  } else {
    const planPolicy = plan.policy as VenuePlanPolicy | null;
    const duration = planPolicy?.duration || DEFAULT_PLAN_POLICY.duration;
    const durationValue =
      planPolicy?.durationValue || DEFAULT_PLAN_POLICY.durationValue;
    subscriptionEndsAt = calculatePlanEndDate(
      subscriptionStartsAt,
      duration,
      durationValue
    );
  }

  const subscription = await prisma.venueSubscription.create({
    data: {
      venueId,
      userId: targetUserId,
      planId,
      status: "ACTIVE",
      paymentStatus: (manualPaymentStatus as PaymentStatus) || "PAID",
      paymentMethod: "Manual",
      activatedByUserId: authUserId,
      activatedAt: new Date(),
      startsAt: subscriptionStartsAt,
      endsAt: subscriptionEndsAt,
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
      plan: {
        select: { id: true, name: true, price: true, currency: true },
      },
    },
  });

  return NextResponse.json(subscription, { status: 201 });
}

async function handleExistingSubscription(
  existingSubscription: {
    id: string;
    status: string;
    createdAt: Date;
    endsAt: Date | null;
  },
  planId: string,
  userId: string,
  venueId: string
): Promise<NextResponse | null> {
  const existingPlan = await prisma.venuePlan.findUnique({
    where: { id: planId },
  });
  const existingPolicy =
    (existingPlan?.policy as unknown as VenuePlanPolicy) || {};

  if (
    existingPolicy.maxTotalBookings &&
    existingSubscription.status === "ACTIVE"
  ) {
    const includedVenueIds = await prisma.venuePlanVenue
      .findMany({ where: { planId }, select: { venueId: true } })
      .then((pv) => pv.map((p) => p.venueId));

    const totalBookingsUsed = await prisma.venueBooking.count({
      where: {
        userId,
        status: { in: ["BOOKED", "ATTENDED"] },
        createdAt: {
          gte: existingSubscription.createdAt,
          ...(existingSubscription.endsAt
            ? { lte: existingSubscription.endsAt }
            : {}),
        },
        OR: [{ venueId }, { venueId: { in: includedVenueIds } }],
      },
    });

    if (totalBookingsUsed >= existingPolicy.maxTotalBookings) {
      await prisma.venueSubscription.update({
        where: { id: existingSubscription.id },
        data: { status: "COMPLETED" },
      });
      return null; // Pack exhausted — allow re-subscription
    }
  }

  return NextResponse.json(
    { error: "Already have an active or pending subscription to this plan" },
    { status: 400 }
  );
}

// POST - Subscribe to a plan
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId } = await params;
    const body = await request.json();
    const {
      planId,
      userId: targetUserId,
      startsAt,
      endsAt,
      paymentStatus: manualPaymentStatus,
      manual,
    } = body;

    // Manual subscription creation (for venue owners/admins)
    if (manual) {
      return createManualSubscription(
        authUser.id,
        venueId,
        planId,
        targetUserId,
        startsAt,
        endsAt,
        manualPaymentStatus
      );
    }

    // Regular subscription flow
    if (!planId) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 }
      );
    }

    // Check if plan exists and is active
    const plan = await prisma.venuePlan.findUnique({
      where: { id: planId },
      include: {
        venue: true,
      },
    });

    if (!plan || !plan.isActive || plan.venueId !== venueId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Check if user is already a member
    let member = await prisma.venueMember.findUnique({
      where: {
        venueId_userId: {
          venueId,
          userId: authUser.id,
        },
      },
    });

    // If not a member, create member with CLIENT role
    if (!member) {
      member = await prisma.venueMember.create({
        data: {
          venueId,
          userId: authUser.id,
          role: "CLIENT",
          status: "ACTIVE",
          joinedAt: new Date(),
        },
      });
    } else if (member.status !== "ACTIVE") {
      // Reactivate member if suspended or left
      member = await prisma.venueMember.update({
        where: {
          venueId_userId: {
            venueId,
            userId: authUser.id,
          },
        },
        data: {
          status: "ACTIVE",
          joinedAt: new Date(),
        },
      });
    }

    // Check if user already has an active subscription to this plan
    const existingSubscription = await prisma.venueSubscription.findFirst({
      where: {
        venueId,
        userId: authUser.id,
        planId,
        status: {
          in: ["PENDING", "ACTIVE"],
        },
      },
    });

    if (existingSubscription) {
      const resubError = await handleExistingSubscription(
        existingSubscription,
        planId,
        authUser.id,
        venueId
      );
      if (resubError) return resubError;
    }

    // Determine payment status and subscription status based on venue's payment mode
    let subscriptionStatus = "PENDING";
    let paymentStatus: "PENDING_PAYMENT" | "PAID" | "NOT_REQUIRED" =
      "PENDING_PAYMENT";

    // Payment mode is now at venue level
    const venuePaymentMode = plan.venue.paymentMode;

    if (venuePaymentMode === "EXTERNAL") {
      // EXTERNAL payment - subscription stays pending until staff confirms
      subscriptionStatus = "PENDING";
      paymentStatus = "PENDING_PAYMENT";
    } else if (venuePaymentMode === "IN_APP" || venuePaymentMode === "MIXED") {
      // IN_APP or MIXED payment - subscription stays pending until payment is confirmed
      // User needs to create a payment intent and confirm it
      subscriptionStatus = "PENDING";
      paymentStatus = "PENDING_PAYMENT";
    }

    // Create subscription
    const subscription = await prisma.venueSubscription.create({
      data: {
        venueId,
        userId: authUser.id,
        planId,
        status: subscriptionStatus,
        paymentStatus,
      },
      include: {
        plan: true,
        venue: {
          select: {
            id: true,
            name: true,
            slug: true,
            paymentMode: true,
            externalPaymentInstructions: true,
          },
        },
      },
    });

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
