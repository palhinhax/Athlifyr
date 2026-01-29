/**
 * Seed: CrossfitMania - Córdoba
 * Box de CrossFit em Córdoba, Espanha
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
  console.log("🏋️ Seeding CrossfitMania - Córdoba...\n");

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
    where: { slug: "crossfitmania-cordoba" },
  });

  if (existing) {
    console.log(`⏭️  Skipped (exists): CrossfitMania`);
    return;
  }

  // Create venue
  await prisma.venue.create({
    data: {
      slug: "crossfitmania-cordoba",
      name: "CrossfitMania",
      type: VenueType.CROSSFIT_BOX,
      sportTypes: [SportType.CROSSFIT],
      services: [
        VenueService.CROSSFIT,
        VenueService.FUNCTIONAL_FITNESS,
        VenueService.GROUP_CLASSES,
      ],
      address: "Calle Ing. Juan de la Cierva, 1, 14013 Córdoba",
      city: "Córdoba",
      country: "Spain",
      latitude: 37.8754,
      longitude: -4.7575,
      phone: "+34 722 55 36 55",
      website: "https://crossfitmania.es",
      instagram: null,
      createdByUserId: adminUser.id,
      isVerified: false,
      isActive: true,
      coverImage: GENERIC_CROSSFIT_COVER,
      logo: null,
      visibleTabs: ["about"],
    },
  });

  console.log(`✅ Created: CrossfitMania (Córdoba)`);
  console.log(`   📍 Calle Ing. Juan de la Cierva, 1, 14013 Córdoba`);
  console.log(`   📞 +34 722 55 36 55`);
  console.log(`   🌐 https://crossfitmania.es`);
  console.log(`   ⭐ Rating: 4.7 (119 reviews)`);
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
