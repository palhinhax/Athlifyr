import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({
    where: { email: "ana@acor.pt" },
    select: { id: true, name: true, email: true },
  });

  if (!user) {
    console.log("User not found");
    return;
  }

  console.log("User:", user);
  console.log("Current date:", new Date().toISOString());

  const subs = await prisma.venueSubscription.findMany({
    where: { userId: user.id },
    include: {
      plan: { select: { name: true } },
      venue: { select: { name: true } },
    },
    orderBy: { startsAt: "asc" },
  });

  console.log("\nSubscriptions:");
  subs.forEach((s) => {
    console.log("---");
    console.log("Plan:", s.plan.name);
    console.log("Venue:", s.venue.name);
    console.log("Status:", s.status);
    console.log("StartsAt:", s.startsAt?.toISOString());
    console.log("EndsAt:", s.endsAt?.toISOString());
    console.log("PaymentStatus:", s.paymentStatus);

    const now = new Date();
    const started = s.startsAt ? s.startsAt <= now : true;
    const notEnded = s.endsAt ? s.endsAt >= now : true;
    console.log(
      "Is currently active:",
      s.status === "ACTIVE" && started && notEnded
    );
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
