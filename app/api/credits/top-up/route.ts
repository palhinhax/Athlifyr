import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import {
  createTopUpPaymentIntent,
  getTopUpHistory,
  MIN_TOPUP_AMOUNT_CENTS,
  MAX_TOPUP_AMOUNT_CENTS,
  TOPUP_AMOUNTS_CENTS,
  calculateTopUpFee,
  calculateNetCredits,
} from "@/lib/credits";

// GET - Get top-up history and available amounts
export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor") || undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!, 10)
      : undefined;

    const history = await getTopUpHistory(user.id, { cursor, limit });

    // Also return available top-up options with fee calculations
    const topUpOptions = TOPUP_AMOUNTS_CENTS.map((amountCents) => ({
      amountCents,
      feeCents: calculateTopUpFee(amountCents),
      netCreditsCents: calculateNetCredits(amountCents),
    }));

    return NextResponse.json({
      ...history,
      topUpOptions,
      minAmountCents: MIN_TOPUP_AMOUNT_CENTS,
      maxAmountCents: MAX_TOPUP_AMOUNT_CENTS,
    });
  } catch (error) {
    console.error("Error fetching top-up info:", error);
    return NextResponse.json(
      { error: "Failed to fetch top-up info" },
      { status: 500 }
    );
  }
}

// POST - Create a new top-up payment intent
export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { amountCents } = body;

    if (!amountCents || typeof amountCents !== "number") {
      return NextResponse.json(
        { error: "amountCents is required and must be a number" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(amountCents) || amountCents <= 0) {
      return NextResponse.json(
        { error: "amountCents must be a positive integer" },
        { status: 400 }
      );
    }

    if (amountCents < MIN_TOPUP_AMOUNT_CENTS) {
      return NextResponse.json(
        {
          error: `Minimum top-up is ${MIN_TOPUP_AMOUNT_CENTS} cents (${(MIN_TOPUP_AMOUNT_CENTS / 100).toFixed(2)}€)`,
        },
        { status: 400 }
      );
    }

    if (amountCents > MAX_TOPUP_AMOUNT_CENTS) {
      return NextResponse.json(
        {
          error: `Maximum top-up is ${MAX_TOPUP_AMOUNT_CENTS} cents (${(MAX_TOPUP_AMOUNT_CENTS / 100).toFixed(2)}€)`,
        },
        { status: 400 }
      );
    }

    const result = await createTopUpPaymentIntent({
      userId: user.id,
      amountCents,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating top-up:", error);
    return NextResponse.json(
      { error: "Failed to create top-up" },
      { status: 500 }
    );
  }
}
