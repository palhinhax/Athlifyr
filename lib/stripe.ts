import Stripe from "stripe";

// Re-export the Stripe namespace so route files can use Stripe.* types
// without a separate import (e.g. Stripe.Event, Stripe.Checkout.Session)
export type { Stripe };

let stripeInstance: Stripe | null = null;

/**
 * Server-side Stripe client — single shared instance (lazy-initialised).
 *
 * Usage:
 *   import { stripe } from "@/lib/stripe";          // instance
 *   import type { Stripe } from "@/lib/stripe";      // types
 */
function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error(
        "STRIPE_SECRET_KEY is not defined in environment variables"
      );
    }
    stripeInstance = new Stripe(secretKey, {
      apiVersion: "2025-12-15.clover",
      typescript: true,
    });
  }
  return stripeInstance;
}

// Lazy proxy so the module-level export works without top-level await
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return getStripe()[prop as keyof Stripe];
  },
});

// Helper para formatar valores monetários para Stripe (centavos)
export function toStripeAmount(amount: number): number {
  return Math.round(amount * 100);
}

// Helper para converter de centavos para euros
export function fromStripeAmount(amount: number): number {
  return amount / 100;
}
