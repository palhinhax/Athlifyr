/**
 * Seed: CrossFit Viana do Castelo
 * Box de CrossFit em Viana do Castelo
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
  console.log("🏋️ Seeding CrossFit Viana do Castelo...\n");

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
    where: { slug: "crossfit-viana-do-castelo" },
  });

  if (existing) {
    console.log(`⏭️  Skipped (exists): CrossFit Viana do Castelo`);
    return;
  }

  // Create venue
  await prisma.venue.create({
    data: {
      slug: "crossfit-viana-do-castelo",
      name: "CrossFit Viana do Castelo",
      type: VenueType.CROSSFIT_BOX,
      sportTypes: [SportType.CROSSFIT],
      services: [
        VenueService.CROSSFIT,
        VenueService.FUNCTIONAL_FITNESS,
        VenueService.GROUP_CLASSES,
      ],
      address: "Rua da Veiga nº832, 4900-858 Meadela",
      city: "Viana do Castelo",
      country: "Portugal",
      latitude: 41.6946,
      longitude: -8.8308,
      phone: "+351 913 984 161",
      website: "https://crossfitvianadocastelo.com/",
      instagram: "crossfitvianadocastelo",
      createdByUserId: adminUser.id,
      isVerified: false,
      isActive: true,
      coverImage: GENERIC_CROSSFIT_COVER,
      logo: null,
      visibleTabs: ["about"],
    },
  });

  console.log(`✅ Created: CrossFit Viana do Castelo`);
  console.log(`   📍 Rua da Veiga nº832, 4900-858 Meadela`);
  console.log(`   📞 +351 913 984 161`);
  console.log(`   🌐 https://crossfitvianadocastelo.com/`);
  console.log(`   ⭐ 4.9 (433 opiniões no Google)`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding venue:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
