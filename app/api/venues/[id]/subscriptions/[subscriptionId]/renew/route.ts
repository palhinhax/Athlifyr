import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addDays, addMonths, addYears } from "date-fns";

// POST - Renew subscription (owner/admin only)
export async function POST(
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

    // Get existing subscription
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

    // Calculate new end date based on plan duration
    const currentEndDate = existingSubscription.endsAt || new Date();
    let newEndDate = currentEndDate;

    // Extract duration from plan policy
    const policy = existingSubscription.plan.policy as {
      duration?: { value: number; unit: string };
    };

    if (policy?.duration) {
      const { value, unit } = policy.duration;

      switch (unit) {
        case "days":
          newEndDate = addDays(currentEndDate, value);
          break;
        case "months":
          newEndDate = addMonths(currentEndDate, value);
          break;
        case "years":
          newEndDate = addYears(currentEndDate, value);
          break;
        default:
          // Default to 1 month if no duration specified
          newEndDate = addMonths(currentEndDate, 1);
      }
    } else {
      // Default to 1 month if no duration specified
      newEndDate = addMonths(currentEndDate, 1);
    }

    // Update subscription with new end date
    const subscription = await prisma.venueSubscription.update({
      where: { id: subscriptionId },
      data: {
        endsAt: newEndDate,
        status: "ACTIVE",
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
    console.error("Error renewing subscription:", error);
    return NextResponse.json(
      { error: "Failed to renew subscription" },
      { status: 500 }
    );
  }
}
