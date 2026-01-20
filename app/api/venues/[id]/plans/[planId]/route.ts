import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageVenue } from "@/lib/venues/authorization";
import { Currency } from "@prisma/client";

// PUT - Update plan
export async function PUT(
  request: Request,
  { params }: { params: { id: string; planId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId, planId } = params;

    // Check authorization
    const authResult = await canManageVenue(session.user.id, venueId);
    if (!authResult.authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if plan exists and belongs to venue
    const existingPlan = await prisma.venuePlan.findFirst({
      where: {
        id: planId,
        venueId,
      },
    });

    if (!existingPlan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const body = await request.json();
    const { name, description, price, currency, policy, paymentProvider } =
      body;

    // Validate currency if provided
    if (currency && !Object.values(Currency).includes(currency)) {
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
    }

    // Validate paymentProvider if provided
    if (paymentProvider) {
      const validProviders = ["IN_APP", "EXTERNAL", "BOTH"];
      if (!validProviders.includes(paymentProvider)) {
        return NextResponse.json(
          { error: "Invalid payment provider" },
          { status: 400 }
        );
      }
    }

    // Update plan
    const plan = await prisma.venuePlan.update({
      where: {
        id: planId,
      },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price }),
        ...(currency && { currency }),
        ...(paymentProvider && { paymentProvider }),
        ...(policy !== undefined && { policy }),
      },
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Error updating plan:", error);
    return NextResponse.json(
      { error: "Failed to update plan" },
      { status: 500 }
    );
  }
}

// DELETE - Delete plan (soft delete by setting isActive to false)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; planId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId, planId } = params;

    // Check authorization
    const authResult = await canManageVenue(session.user.id, venueId);
    if (!authResult.authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if plan exists and belongs to venue
    const existingPlan = await prisma.venuePlan.findFirst({
      where: {
        id: planId,
        venueId,
      },
      include: {
        _count: {
          select: {
            subscriptions: {
              where: {
                status: "ACTIVE",
              },
            },
          },
        },
      },
    });

    if (!existingPlan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Check if there are active subscriptions
    if (existingPlan._count.subscriptions > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete plan with active subscriptions. Deactivate it instead.",
        },
        { status: 400 }
      );
    }

    // Soft delete - set isActive to false
    const plan = await prisma.venuePlan.update({
      where: {
        id: planId,
      },
      data: {
        isActive: false,
      },
    });

    return NextResponse.json({ message: "Plan deleted successfully", plan });
  } catch (error) {
    console.error("Error deleting plan:", error);
    return NextResponse.json(
      { error: "Failed to delete plan" },
      { status: 500 }
    );
  }
}
