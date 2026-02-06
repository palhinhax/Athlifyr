import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import {
  calculatePlanEndDate,
  type VenuePlanPolicy,
  DEFAULT_PLAN_POLICY,
} from "@/types/venue-plan";

// Desabilitar parsing do body para webhooks
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST - Webhook do Stripe
export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      console.error("Missing stripe-signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // Verificar assinatura do webhook
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Processar eventos do Stripe
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentFailed(paymentIntent);
        break;
      }

      case "payment_intent.canceled": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentCanceled(paymentIntent);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Handler para pagamento bem-sucedido
async function handlePaymentIntentSucceeded(
  stripePaymentIntent: Stripe.PaymentIntent
) {
  try {
    console.log(
      "Payment Intent succeeded:",
      stripePaymentIntent.id,
      stripePaymentIntent.metadata
    );

    // Encontrar o PaymentIntent no banco de dados
    const paymentIntent = await prisma.paymentIntent.findFirst({
      where: {
        stripePaymentIntentId: stripePaymentIntent.id,
      },
      include: {
        plan: true,
      },
    });

    if (!paymentIntent) {
      console.error(
        "Payment Intent not found in database:",
        stripePaymentIntent.id
      );
      return;
    }

    // Atualizar status do PaymentIntent
    await prisma.paymentIntent.update({
      where: { id: paymentIntent.id },
      data: {
        status: "CONFIRMED",
        confirmedAt: new Date(),
      },
    });

    // Verificar se já existe subscrição
    const existingSubscription = await prisma.venueSubscription.findFirst({
      where: {
        venueId: paymentIntent.venueId,
        userId: paymentIntent.userId,
        planId: paymentIntent.planId,
      },
    });

    if (existingSubscription) {
      // Atualizar subscrição existente
      await prisma.venueSubscription.update({
        where: { id: existingSubscription.id },
        data: {
          status: "ACTIVE",
          paymentStatus: "PAID",
          paymentConfirmedAt: new Date(),
          paymentAmount: paymentIntent.amount,
          paymentMethod: "Stripe",
        },
      });
    } else {
      // Calculate start and end dates based on plan policy
      const startDate = new Date();
      const planPolicy = paymentIntent.plan?.policy as VenuePlanPolicy | null;
      const duration = planPolicy?.duration || DEFAULT_PLAN_POLICY.duration;
      const durationValue =
        planPolicy?.durationValue || DEFAULT_PLAN_POLICY.durationValue;
      const endDate = calculatePlanEndDate(startDate, duration, durationValue);

      // Criar nova subscrição
      await prisma.venueSubscription.create({
        data: {
          venueId: paymentIntent.venueId,
          userId: paymentIntent.userId,
          planId: paymentIntent.planId,
          status: "ACTIVE",
          paymentStatus: "PAID",
          paymentConfirmedAt: new Date(),
          paymentAmount: paymentIntent.amount,
          paymentMethod: "Stripe",
          startsAt: startDate,
          endsAt: endDate,
        },
      });

      // Verificar se o utilizador já é membro
      const member = await prisma.venueMember.findUnique({
        where: {
          venueId_userId: {
            venueId: paymentIntent.venueId,
            userId: paymentIntent.userId,
          },
        },
      });

      // Se não for membro, criar com role CLIENT
      if (!member) {
        await prisma.venueMember.create({
          data: {
            venueId: paymentIntent.venueId,
            userId: paymentIntent.userId,
            role: "CLIENT",
            status: "ACTIVE",
            joinedAt: new Date(),
          },
        });
      } else if (member.status !== "ACTIVE") {
        // Reativar membro se estiver suspenso ou saiu
        await prisma.venueMember.update({
          where: {
            venueId_userId: {
              venueId: paymentIntent.venueId,
              userId: paymentIntent.userId,
            },
          },
          data: {
            status: "ACTIVE",
          },
        });
      }
    }

    console.log(
      "Subscription activated successfully for user:",
      paymentIntent.userId
    );
  } catch (error) {
    console.error("Error handling payment_intent.succeeded:", error);
    throw error;
  }
}

// Handler para pagamento falhado
async function handlePaymentIntentFailed(
  stripePaymentIntent: Stripe.PaymentIntent
) {
  try {
    console.log("Payment Intent failed:", stripePaymentIntent.id);

    const paymentIntent = await prisma.paymentIntent.findFirst({
      where: {
        stripePaymentIntentId: stripePaymentIntent.id,
      },
    });

    if (!paymentIntent) {
      console.error(
        "Payment Intent not found in database:",
        stripePaymentIntent.id
      );
      return;
    }

    // Atualizar status
    await prisma.paymentIntent.update({
      where: { id: paymentIntent.id },
      data: {
        status: "FAILED",
      },
    });

    console.log("Payment Intent marked as failed:", paymentIntent.id);
  } catch (error) {
    console.error("Error handling payment_intent.payment_failed:", error);
    throw error;
  }
}

// Handler para pagamento cancelado
async function handlePaymentIntentCanceled(
  stripePaymentIntent: Stripe.PaymentIntent
) {
  try {
    console.log("Payment Intent canceled:", stripePaymentIntent.id);

    const paymentIntent = await prisma.paymentIntent.findFirst({
      where: {
        stripePaymentIntentId: stripePaymentIntent.id,
      },
    });

    if (!paymentIntent) {
      console.error(
        "Payment Intent not found in database:",
        stripePaymentIntent.id
      );
      return;
    }

    // Atualizar status
    await prisma.paymentIntent.update({
      where: { id: paymentIntent.id },
      data: {
        status: "CANCELLED",
      },
    });

    console.log("Payment Intent marked as canceled:", paymentIntent.id);
  } catch (error) {
    console.error("Error handling payment_intent.canceled:", error);
    throw error;
  }
}
