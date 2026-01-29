/**
 * Seed: CrossFundão
 * Box de CrossFit no Fundão
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
  console.log("🏋️ Seeding CrossFundão...\n");

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
    where: { slug: "crossfundao" },
  });

  if (existing) {
    console.log(`⏭️  Skipped (exists): CrossFundão`);
    return;
  }

  // Create venue
  await prisma.venue.create({
    data: {
      slug: "crossfundao",
      name: "CrossFundão",
      type: VenueType.CROSSFIT_BOX,
      sportTypes: [SportType.CROSSFIT],
      services: [
        VenueService.CROSSFIT,
        VenueService.FUNCTIONAL_FITNESS,
        VenueService.PERSONAL_TRAINING,
        VenueService.GROUP_CLASSES,
      ],
      address: "Fundão",
      city: "Fundão",
      country: "Portugal",
      latitude: 40.1383,
      longitude: -7.5008,
      instagram: "crossfundao",
      createdByUserId: adminUser.id,
      isVerified: false,
      isActive: true,
      coverImage: GENERIC_CROSSFIT_COVER,
      logo: null,
      visibleTabs: ["about"],
    },
  });

  console.log(`✅ Created: CrossFundão`);
  console.log(`   📍 Fundão`);
  console.log(`   ⭐ 4.8 (63 opiniões no Google)`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding venue:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
