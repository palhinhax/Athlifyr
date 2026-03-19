import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

/**
 * Get or create a Stripe Customer for a user.
 * Stores stripeCustomerId on the User model for reuse.
 */
export async function getOrCreateStripeCustomer(
  userId: string
): Promise<string> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { id: true, stripeCustomerId: true, email: true, name: true },
  });

  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name || undefined,
    metadata: { userId: user.id },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}
