/**
 * Seed: Box 6000 - CrossFit Castelo Branco
 * Box de CrossFit em Castelo Branco
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
  console.log("🏋️ Seeding Box 6000 - CrossFit Castelo Branco...\n");

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
    where: { slug: "box-6000-crossfit-castelo-branco" },
  });

  if (existing) {
    console.log(`⏭️  Skipped (exists): Box 6000 - CrossFit Castelo Branco`);
    return;
  }

  // Create venue
  await prisma.venue.create({
    data: {
      slug: "box-6000-crossfit-castelo-branco",
      name: "Box 6000 - CrossFit Castelo Branco",
      type: VenueType.CROSSFIT_BOX,
      sportTypes: [SportType.CROSSFIT],
      services: [
        VenueService.CROSSFIT,
        VenueService.FUNCTIONAL_FITNESS,
        VenueService.GROUP_CLASSES,
      ],
      address: "Tv. do Terminal 1, 6000-310 Castelo Branco",
      city: "Castelo Branco",
      country: "Portugal",
      latitude: 39.8228,
      longitude: -7.4931,
      phone: "+351 965 078 787",
      website: "https://box6000.pt/",
      instagram: "box6000",
      createdByUserId: adminUser.id,
      isVerified: false,
      isActive: true,
      coverImage: GENERIC_CROSSFIT_COVER,
      logo: null,
      visibleTabs: ["about"],
    },
  });

  console.log(`✅ Created: Box 6000 - CrossFit Castelo Branco`);
  console.log(`   📍 Tv. do Terminal 1, 6000-310 Castelo Branco`);
  console.log(`   📞 +351 965 078 787`);
  console.log(`   🌐 https://box6000.pt/`);
  console.log(`   ⭐ 4.9 (35 opiniões no Google)`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding venue:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
