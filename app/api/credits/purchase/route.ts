import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { purchaseWithCredits, InsufficientCreditsError } from "@/lib/credits";

// POST - Purchase a venue product with credits
export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { venueId, productId, quantity } = body;

    if (!venueId || !productId) {
      return NextResponse.json(
        { error: "venueId and productId are required" },
        { status: 400 }
      );
    }

    const parsedQuantity =
      typeof quantity === "number" && Number.isInteger(quantity) && quantity > 0
        ? quantity
        : 1;

    const result = await purchaseWithCredits({
      userId: user.id,
      venueId,
      productId,
      quantity: parsedQuantity,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof InsufficientCreditsError) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          currentBalanceCents: error.currentBalanceCents,
          requiredAmountCents: error.requiredAmountCents,
        },
        { status: 402 }
      );
    }

    console.error("Error processing credit purchase:", error);
    const message =
      error instanceof Error ? error.message : "Failed to process purchase";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
