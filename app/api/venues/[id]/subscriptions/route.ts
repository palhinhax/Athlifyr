import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
// PaymentProvider removed - now using PaymentsProvider at venue level

// GET - Fetch all subscriptions for a venue (owner/admin only)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId } = await params;

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

// POST - Subscribe to a plan
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
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
      // Check if user is owner or admin
      const member = await prisma.venueMember.findUnique({
        where: {
          venueId_userId: {
            venueId,
            userId: session.user.id,
          },
        },
      });

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

      if (!planId || !targetUserId) {
        return NextResponse.json(
          { error: "Plan ID and User ID are required" },
          { status: 400 }
        );
      }

      // Check if plan exists
      const plan = await prisma.venuePlan.findUnique({
        where: { id: planId },
      });

      if (!plan || plan.venueId !== venueId) {
        return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
      }

      // Ensure target user is a member (create if not)
      let targetMember = await prisma.venueMember.findUnique({
        where: {
          venueId_userId: {
            venueId,
            userId: targetUserId,
          },
        },
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

      // Create manual subscription
      const subscription = await prisma.venueSubscription.create({
        data: {
          venueId,
          userId: targetUserId,
          planId,
          status: "ACTIVE",
          paymentStatus: manualPaymentStatus || "PAID",
          paymentMethod: "Manual", // Use paymentMethod instead of paymentProvider
          activatedByUserId: session.user.id, // Track who activated it
          activatedAt: new Date(),
          startsAt: startsAt ? new Date(startsAt) : new Date(),
          endsAt: endsAt ? new Date(endsAt) : null,
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

      return NextResponse.json(subscription, { status: 201 });
    }

    // Regular subscription flow (existing code)
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
          userId: session.user.id,
        },
      },
    });

    // If not a member, create member with CLIENT role
    if (!member) {
      member = await prisma.venueMember.create({
        data: {
          venueId,
          userId: session.user.id,
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
            userId: session.user.id,
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
        userId: session.user.id,
        planId,
        status: {
          in: ["PENDING", "ACTIVE"],
        },
      },
    });

    if (existingSubscription) {
      return NextResponse.json(
        {
          error: "Already have an active or pending subscription to this plan",
        },
        { status: 400 }
      );
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
        userId: session.user.id,
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
