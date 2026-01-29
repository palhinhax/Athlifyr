/**
 * Seed: BollBox CrossFit López de Hoyos - Madrid
 * Box de CrossFit em Madrid, Espanha
 */

import {
  PrismaClient,
  VenueType,
  SportType,
  VenueService,
} from "@prisma/client";

const prisma = new PrismaClient();

// Imagem genérica de cover para CrossFit boxes
const GENERIC_CROSSFIT_COVER =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=600&fit=crop&q=80";

async function main() {
  console.log("🏋️ Seeding BollBox CrossFit López de Hoyos - Madrid...\n");

  // Get admin user
  const adminUser = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!adminUser) {
    console.error("❌ No admin user found. Please create an admin user first.");
    process.exit(1);
  }

  console.log(`👤 Using admin user: ${adminUser.email}\n`);

  // Check if venue already exists
  const existing = await prisma.venue.findUnique({
    where: { slug: "bollbox-crossfit-lopez-de-hoyos-madrid" },
  });

  if (existing) {
    console.log(`⏭️  Skipped (exists): BollBox CrossFit López de Hoyos`);
    return;
  }

  // Create venue
  await prisma.venue.create({
    data: {
      slug: "bollbox-crossfit-lopez-de-hoyos-madrid",
      name: "BollBox CrossFit López de Hoyos",
      type: VenueType.CROSSFIT_BOX,
      sportTypes: [SportType.CROSSFIT],
      services: [
        VenueService.CROSSFIT,
        VenueService.FUNCTIONAL_FITNESS,
        VenueService.GROUP_CLASSES,
      ],
      address: "C/ de Pantoja, 2, Chamartín, 28002 Madrid",
      city: "Madrid",
      country: "Spain",
      latitude: 40.4489,
      longitude: -3.6652,
      phone: "+34 635 59 09 96",
      website: "https://bollboxcrossfit.es",
      instagram: null,
      createdByUserId: adminUser.id,
      isVerified: false,
      isActive: true,
      coverImage: GENERIC_CROSSFIT_COVER,
      logo: null,
      visibleTabs: ["about"],
    },
  });

  console.log(`✅ Created: BollBox CrossFit López de Hoyos (Madrid)`);
  console.log(`   📍 C/ de Pantoja, 2, Chamartín, 28002 Madrid`);
  console.log(`   📞 +34 635 59 09 96`);
  console.log(`   🌐 https://bollboxcrossfit.es`);
  console.log(`   ⭐ Rating: 4.9 (220 reviews)`);
  console.log(`   🏷️  Services: CrossFit, Functional Fitness, Group Classes`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding venue:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
