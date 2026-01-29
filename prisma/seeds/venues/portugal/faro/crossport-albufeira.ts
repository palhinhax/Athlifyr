/**
 * Seed: Crossport Albufeira
 * Box de CrossFit em Albufeira
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
  console.log("🏋️ Seeding Crossport Albufeira...\n");

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
    where: { slug: "crossport-albufeira" },
  });

  if (existing) {
    console.log(`⏭️  Skipped (exists): Crossport Albufeira`);
    return;
  }

  // Create venue
  await prisma.venue.create({
    data: {
      slug: "crossport-albufeira",
      name: "Crossport Albufeira",
      type: VenueType.CROSSFIT_BOX,
      sportTypes: [SportType.CROSSFIT],
      services: [
        VenueService.CROSSFIT,
        VenueService.FUNCTIONAL_FITNESS,
        VenueService.GROUP_CLASSES,
      ],
      address: "R. dos Bombeiros Voluntários 54D, 8200-918 Albufeira",
      city: "Albufeira",
      country: "Portugal",
      latitude: 37.0886,
      longitude: -8.2503,
      phone: "+351 918 631 865",
      website: "https://crossportalbufeira.com/",
      instagram: "crossportalbufeira",
      createdByUserId: adminUser.id,
      isVerified: false,
      isActive: true,
      coverImage: GENERIC_CROSSFIT_COVER,
      logo: null,
      visibleTabs: ["about"],
    },
  });

  console.log(`✅ Created: Crossport Albufeira`);
  console.log(`   📍 R. dos Bombeiros Voluntários 54D, 8200-918 Albufeira`);
  console.log(`   📞 +351 918 631 865`);
  console.log(`   🌐 https://crossportalbufeira.com/`);
  console.log(`   ⭐ 4.9 (134 opiniões no Google)`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding venue:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
