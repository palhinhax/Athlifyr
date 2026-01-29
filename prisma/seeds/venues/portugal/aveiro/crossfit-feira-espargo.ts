/**
 * Seed: Crossfit Feira - Espargo
 * Box de CrossFit em Espargo, Santa Maria da Feira
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
  console.log("🏋️ Seeding Crossfit Feira - Espargo...\n");

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
    where: { slug: "crossfit-feira-espargo" },
  });

  if (existing) {
    console.log(`⏭️  Skipped (exists): Crossfit Feira`);
    return;
  }

  // Create venue
  await prisma.venue.create({
    data: {
      slug: "crossfit-feira-espargo",
      name: "Crossfit Feira",
      type: VenueType.CROSSFIT_BOX,
      sportTypes: [SportType.CROSSFIT],
      services: [
        VenueService.CROSSFIT,
        VenueService.FUNCTIONAL_FITNESS,
        VenueService.GROUP_CLASSES,
      ],
      address: "R. 1º de Maio 477, 4520-115 Espargo",
      city: "Santa Maria da Feira",
      country: "Portugal",
      latitude: 40.9591,
      longitude: -8.5474,
      phone: null,
      website: null,
      instagram: null,
      createdByUserId: adminUser.id,
      isVerified: false,
      isActive: true,
      coverImage: GENERIC_CROSSFIT_COVER,
      logo: null,
      visibleTabs: ["about"],
    },
  });

  console.log(`✅ Created: Crossfit Feira (Espargo)`);
  console.log(`   📍 R. 1º de Maio 477, 4520-115 Espargo`);
  console.log(`   ⭐ Rating: 4.9 (64 reviews)`);
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
