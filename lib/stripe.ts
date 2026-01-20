import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}

// Inicializar Stripe no servidor
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
});

// Helper para formatar valores monetários para Stripe (centavos)
export function toStripeAmount(amount: number): number {
  return Math.round(amount * 100);
}

// Helper para converter de centavos para euros
export function fromStripeAmount(amount: number): number {
  return amount / 100;
}
