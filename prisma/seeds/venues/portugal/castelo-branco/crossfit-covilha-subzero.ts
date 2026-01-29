/**
 * Seed: CrossFit Covilhã SubZero
 * Box de CrossFit na Covilhã
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
  console.log("🏋️ Seeding CrossFit Covilhã SubZero...\n");

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
    where: { slug: "crossfit-covilha-subzero" },
  });

  if (existing) {
    console.log(`⏭️  Skipped (exists): CrossFit Covilhã SubZero`);
    return;
  }

  // Create venue
  await prisma.venue.create({
    data: {
      slug: "crossfit-covilha-subzero",
      name: "CrossFit Covilhã SubZero",
      type: VenueType.CROSSFIT_BOX,
      sportTypes: [SportType.CROSSFIT],
      services: [
        VenueService.CROSSFIT,
        VenueService.FUNCTIONAL_FITNESS,
        VenueService.PERSONAL_TRAINING,
        VenueService.GROUP_CLASSES,
      ],
      address: "R. Fernando Antunes 20, 6200-411 Covilhã",
      city: "Covilhã",
      country: "Portugal",
      latitude: 40.2781,
      longitude: -7.5039,
      phone: "+351 966 886 729",
      instagram: "crossfitcovilhasubzero",
      createdByUserId: adminUser.id,
      isVerified: false,
      isActive: true,
      coverImage: GENERIC_CROSSFIT_COVER,
      logo: null,
      visibleTabs: ["about"],
    },
  });

  console.log(`✅ Created: CrossFit Covilhã SubZero`);
  console.log(`   📍 R. Fernando Antunes 20, 6200-411 Covilhã`);
  console.log(`   📞 +351 966 886 729`);
  console.log(`   ⭐ 5.0 (41 opiniões no Google)`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding venue:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
