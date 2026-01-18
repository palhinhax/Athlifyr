import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST - Subscribe to a plan
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId } = params;
    const body = await request.json();
    const { planId } = body;

    if (!planId) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 }
      );
    }

    // Check if plan exists and is active
    const plan = await prisma.venuePlan.findUnique({
      where: { id: planId },
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

    // Check if user already has an active subscription to this venue
    const existingSubscription = await prisma.venueSubscription.findFirst({
      where: {
        venueId,
        userId: session.user.id,
        status: "ACTIVE",
      },
    });

    if (existingSubscription) {
      return NextResponse.json(
        { error: "Already have an active subscription" },
        { status: 400 }
      );
    }

    // Create subscription
    const subscription = await prisma.venueSubscription.create({
      data: {
        venueId,
        userId: session.user.id,
        planId,
        status: "ACTIVE",
      },
      include: {
        plan: true,
        venue: {
          select: {
            id: true,
            name: true,
            slug: true,
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
