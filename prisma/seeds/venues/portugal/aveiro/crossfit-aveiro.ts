/**
 * Seed: CrossFit Aveiro
 * Box de CrossFit em Aveiro
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
  console.log("🏋️ Seeding CrossFit Aveiro...\n");

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
    where: { slug: "crossfit-aveiro" },
  });

  if (existing) {
    console.log(`⏭️  Skipped (exists): CrossFit Aveiro`);
    return;
  }

  // Create venue
  await prisma.venue.create({
    data: {
      slug: "crossfit-aveiro",
      name: "CrossFit Aveiro",
      type: VenueType.CROSSFIT_BOX,
      sportTypes: [SportType.CROSSFIT],
      services: [
        VenueService.CROSSFIT,
        VenueService.FUNCTIONAL_FITNESS,
        VenueService.GROUP_CLASSES,
      ],
      address:
        "Zona Industrial da Taboeira, TABPARK Lote 27, Fracção A2, 3800-055 Aveiro",
      city: "Aveiro",
      country: "Portugal",
      latitude: 40.6479,
      longitude: -8.6053,
      phone: "+351 913 761 235",
      website: "https://crossfitaveiro.com/",
      instagram: "crossfitaveiro",
      createdByUserId: adminUser.id,
      isVerified: false,
      isActive: true,
      coverImage: GENERIC_CROSSFIT_COVER,
      logo: null,
      visibleTabs: ["about"],
    },
  });

  console.log(`✅ Created: CrossFit Aveiro`);
  console.log(
    `   📍 Zona Industrial da Taboeira, TABPARK Lote 27, Fracção A2, 3800-055 Aveiro`
  );
  console.log(`   📞 +351 913 761 235`);
  console.log(`   🌐 https://crossfitaveiro.com/`);
  console.log(`   ⭐ 4.8 (151 opiniões no Google)`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding venue:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
