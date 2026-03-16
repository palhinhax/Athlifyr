import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { refundCreditPurchase } from "@/lib/credits";

// POST - Admin: Refund a credit purchase
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { purchaseId, partialAmountCents, note } = body;

    if (!purchaseId) {
      return NextResponse.json(
        { error: "purchaseId is required" },
        { status: 400 }
      );
    }

    if (
      partialAmountCents !== undefined &&
      (typeof partialAmountCents !== "number" ||
        !Number.isInteger(partialAmountCents) ||
        partialAmountCents <= 0)
    ) {
      return NextResponse.json(
        { error: "partialAmountCents must be a positive integer" },
        { status: 400 }
      );
    }

    const result = await refundCreditPurchase({
      purchaseId,
      adminUserId: session.user.id,
      adminNote: note,
      partialAmountCents,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Error refunding credit purchase:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to refund credit purchase";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
