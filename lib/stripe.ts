import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

// Lazy initialization of Stripe client
export function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error(
        "STRIPE_SECRET_KEY is not defined in environment variables"
      );
    }
    stripeInstance = new Stripe(secretKey, {
      typescript: true,
    });
  }
  return stripeInstance;
}

// Deprecated: Use getStripe() instead
// Kept for backward compatibility during migration
export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
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
