import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const p = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

try {
  // Find all pending top-ups
  const pendingTopUps = await p.creditTopUp.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });

  console.log(`Found ${pendingTopUps.length} pending top-ups\n`);

  for (const topUp of pendingTopUps) {
    console.log(
      `Processing top-up ${topUp.id} (PI: ${topUp.stripePaymentIntentId})`
    );

    // Check status on Stripe
    const pi = await stripe.paymentIntents.retrieve(
      topUp.stripePaymentIntentId
    );
    console.log(`  Stripe status: ${pi.status}`);

    if (pi.status === "succeeded" && topUp.status === "PENDING") {
      // Credit the wallet
      const wallet = await p.creditWallet.upsert({
        where: { userId: topUp.userId },
        update: {
          balanceCents: { increment: topUp.netCreditedCents },
          totalTopUpCents: { increment: topUp.grossAmountCents },
        },
        create: {
          userId: topUp.userId,
          balanceCents: topUp.netCreditedCents,
          totalTopUpCents: topUp.grossAmountCents,
        },
      });

      // Create transaction
      await p.creditTransaction.create({
        data: {
          userId: topUp.userId,
          type: "TOP_UP",
          source: "STRIPE_TOP_UP",
          amountCents: topUp.netCreditedCents,
          balanceAfterCents: wallet.balanceCents,
          description: `Top-up: ${(topUp.grossAmountCents / 100).toFixed(2)}€ → ${(topUp.netCreditedCents / 100).toFixed(2)} credits`,
          grossAmountCents: topUp.grossAmountCents,
          platformFeeCents: topUp.platformFeeCents,
          netCreditedCents: topUp.netCreditedCents,
          stripePaymentIntentId: topUp.stripePaymentIntentId,
          idempotencyKey: `topup_credit_${topUp.id}`,
        },
      });

      // Mark top-up as completed
      await p.creditTopUp.update({
        where: { id: topUp.id },
        data: { status: "COMPLETED", completedAt: new Date() },
      });

      console.log(`  ✅ Completed! Credited ${topUp.netCreditedCents} cents`);
    } else {
      console.log(`  ⏭️ Skipped (stripe: ${pi.status}, db: ${topUp.status})`);
    }
  }

  // Show final state
  const wallets = await p.creditWallet.findMany({ take: 5 });
  console.log("\nWallets after fix:", JSON.stringify(wallets, null, 2));
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await p.$disconnect();
}
