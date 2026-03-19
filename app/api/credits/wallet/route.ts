import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { getWalletWithStats, getOrCreateWallet } from "@/lib/credits";

// GET - Get wallet balance and stats
export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wallet = await getWalletWithStats(user.id);

    return NextResponse.json({ wallet });
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet" },
      { status: 500 }
    );
  }
}

// POST - Initialize wallet (creates one if doesn't exist)
export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wallet = await getOrCreateWallet(user.id);

    return NextResponse.json({
      wallet: {
        balanceCents: wallet.balanceCents,
        totalTopUpCents: wallet.totalTopUpCents,
        totalSpentCents: wallet.totalSpentCents,
        totalRewardedCents: wallet.totalRewardedCents,
      },
    });
  } catch (error) {
    console.error("Error creating wallet:", error);
    return NextResponse.json(
      { error: "Failed to create wallet" },
      { status: 500 }
    );
  }
}
