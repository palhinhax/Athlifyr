import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageVenue, isVenueOwner } from "@/lib/venues/authorization";
import { Currency } from "@prisma/client";

// PUT - Update plan
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; planId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId, planId } = await params;

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
    const {
      name,
      description,
      price,
      currency,
      policy,
      paymentProvider,
      includedVenueIds,
    } = body;

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

    // If includedVenueIds provided, verify user is OWNER of all included venues
    if (includedVenueIds !== undefined) {
      for (const includedVenueId of includedVenueIds || []) {
        const isOwner = await isVenueOwner(session.user.id, includedVenueId);
        if (!isOwner) {
          return NextResponse.json(
            {
              error:
                "You must be owner of all venues you want to include in this plan",
            },
            { status: 403 }
          );
        }
      }
    }

    // Update plan with transaction to handle included venues
    const plan = await prisma.$transaction(async (tx) => {
      // If includedVenueIds is provided, update the junction table
      if (includedVenueIds !== undefined) {
        // Delete existing included venues
        await tx.venuePlanVenue.deleteMany({
          where: { planId },
        });

        // Create new included venues
        if (includedVenueIds.length > 0) {
          await tx.venuePlanVenue.createMany({
            data: includedVenueIds.map((vId: string) => ({
              planId,
              venueId: vId,
            })),
          });
        }
      }

      // Update plan
      return tx.venuePlan.update({
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
          ...(body.isActive !== undefined && { isActive: body.isActive }),
        },
        include: {
          includedVenues: {
            include: {
              venue: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  city: true,
                  logo: true,
                },
              },
            },
          },
        },
      });
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
  { params }: { params: Promise<{ id: string; planId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: venueId, planId } = await params;

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

    // Soft delete - set isActive to false (even if there are active subscriptions)
    const plan = await prisma.venuePlan.update({
      where: {
        id: planId,
      },
      data: {
        isActive: false,
      },
    });

    return NextResponse.json({
      message: "Plan deactivated successfully",
      plan,
    });
  } catch (error) {
    console.error("Error deactivating plan:", error);
    return NextResponse.json(
      { error: "Failed to deactivate plan" },
      { status: 500 }
    );
  }
}
