import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { creditWallet } from "@/lib/credits";

/**
 * Resolve input to a userId — accepts a user ID, email, or name.
 */
async function resolveUserId(input: string): Promise<string | null> {
  // Try direct ID lookup first
  const byId = await prisma.user.findUnique({
    where: { id: input },
    select: { id: true },
  });
  if (byId) return byId.id;

  // Try by email
  const byEmail = await prisma.user.findUnique({
    where: { email: input },
    select: { id: true },
  });
  if (byEmail) return byEmail.id;

  // Try by name (case-insensitive, first match)
  const byName = await prisma.user.findFirst({
    where: { name: { equals: input, mode: "insensitive" } },
    select: { id: true },
  });
  if (byName) return byName.id;

  return null;
}

// GET - Get credits info for a specific user (admin)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId: input } = await params;
    const userId = await resolveUserId(input);
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, image: true },
    });

    const wallet = await prisma.creditWallet.findUnique({
      where: { userId },
    });

    const recentTransactions = await prisma.creditTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const topUps = await prisma.creditTopUp.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({
      user,
      wallet: wallet ?? {
        balanceCents: 0,
        totalTopUpCents: 0,
        totalSpentCents: 0,
        totalRewardedCents: 0,
      },
      recentTransactions,
      topUps,
    });
  } catch (error) {
    console.error("Error fetching admin credits:", error);
    return NextResponse.json(
      { error: "Failed to fetch credits info" },
      { status: 500 }
    );
  }
}

// POST - Admin action: adjust credits for a user
export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId: input } = await params;
    const userId = await resolveUserId(input);
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const body = await request.json();
    const { amountCents, note, source } = body;

    if (
      !amountCents ||
      typeof amountCents !== "number" ||
      !Number.isInteger(amountCents)
    ) {
      return NextResponse.json(
        { error: "amountCents must be a non-zero integer" },
        { status: 400 }
      );
    }

    if (amountCents === 0) {
      return NextResponse.json(
        { error: "amountCents cannot be zero" },
        { status: 400 }
      );
    }

    // userId already verified by resolveUserId above

    const validSources = ["ADMIN_BONUS", "MANUAL"] as const;
    const resolvedSource = validSources.includes(source) ? source : "MANUAL";

    if (amountCents > 0) {
      // Credit (add credits)
      const result = await creditWallet({
        userId,
        amountCents,
        type: "MANUAL_ADJUSTMENT",
        source: resolvedSource,
        description: note || "Admin adjustment",
        adminUserId: session.user.id,
        adminNote: note,
      });

      return NextResponse.json({
        success: true,
        transactionId: result.transactionId,
        newBalanceCents: result.newBalanceCents,
        action: "credit",
        amountCents,
      });
    } else {
      // Debit (remove credits) - use negative amount as positive for debit
      const absAmount = Math.abs(amountCents);

      // Check current balance
      const wallet = await prisma.creditWallet.findUnique({
        where: { userId },
        select: { balanceCents: true },
      });

      const currentBalance = wallet?.balanceCents ?? 0;
      if (currentBalance < absAmount) {
        return NextResponse.json(
          {
            error: "Insufficient balance for this deduction",
            currentBalanceCents: currentBalance,
          },
          { status: 400 }
        );
      }

      // Perform deduction via transaction
      const result = await prisma.$transaction(async (tx) => {
        const updatedWallet = await tx.creditWallet.update({
          where: { userId },
          data: { balanceCents: { decrement: absAmount } },
        });

        const transaction = await tx.creditTransaction.create({
          data: {
            userId,
            type: "MANUAL_ADJUSTMENT",
            source: "MANUAL",
            amountCents: -absAmount,
            balanceAfterCents: updatedWallet.balanceCents,
            description: note || "Admin deduction",
            adminUserId: session.user.id,
            adminNote: note,
          },
        });

        return {
          transactionId: transaction.id,
          newBalanceCents: updatedWallet.balanceCents,
        };
      });

      return NextResponse.json({
        success: true,
        transactionId: result.transactionId,
        newBalanceCents: result.newBalanceCents,
        action: "debit",
        amountCents: -absAmount,
      });
    }
  } catch (error) {
    console.error("Error adjusting credits:", error);
    return NextResponse.json(
      { error: "Failed to adjust credits" },
      { status: 500 }
    );
  }
}
