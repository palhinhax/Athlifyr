import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageVenue } from "@/lib/venues/authorization";
import { PaymentMode } from "@prisma/client";

// PATCH - Update venue payment settings (owner/admin only)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Check authorization
    const authResult = await canManageVenue(session.user.id, id);
    if (!authResult.authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { paymentMode, externalPaymentInstructions } = body;

    // Validate payment mode if provided
    if (
      paymentMode &&
      !Object.values(PaymentMode).includes(paymentMode as PaymentMode)
    ) {
      return NextResponse.json(
        { error: "Invalid payment mode" },
        { status: 400 }
      );
    }

    // Update venue payment settings
    const venue = await prisma.venue.update({
      where: { id },
      data: {
        ...(paymentMode && { paymentMode }),
        ...(externalPaymentInstructions !== undefined && {
          externalPaymentInstructions,
        }),
      },
    });

    return NextResponse.json(venue);
  } catch (error) {
    console.error("Error updating venue payment settings:", error);
    return NextResponse.json(
      { error: "Failed to update payment settings" },
      { status: 500 }
    );
  }
}
