import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function verify() {
  const event = await prisma.event.findUnique({
    where: { slug: "grande-premio-atletismo-rebordosa-2026" },
  });
  console.log("Event:", event?.id);

  if (!event) {
    console.log("Event not found!");
    return;
  }

  const variants = await prisma.eventVariant.count({
    where: { eventId: event.id },
  });
  console.log("Variants:", variants);

  const phases = await prisma.pricingPhase.count({
    where: { eventId: event.id },
  });
  console.log("Pricing Phases:", phases);

  const faqs = await prisma.eventFAQ.findMany({
    where: { eventId: event.id },
    orderBy: { order: "asc" },
  });
  console.log("FAQs:", faqs.length);

  for (const faq of faqs) {
    const trCount = await prisma.eventFAQTranslation.count({
      where: { faqId: faq.id },
    });
    console.log(`  FAQ ${faq.order}: ${trCount} translations`);
  }

  const translations = await prisma.eventTranslation.count({
    where: { eventId: event.id },
  });
  console.log("Event Translations:", translations);
}

verify()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
