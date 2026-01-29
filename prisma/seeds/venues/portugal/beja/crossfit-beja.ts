/**
 * Seed: CrossFit Beja
 * Box de CrossFit em Beja
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
  console.log("🏋️ Seeding CrossFit Beja...\n");

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
    where: { slug: "crossfit-beja" },
  });

  if (existing) {
    console.log(`⏭️  Skipped (exists): CrossFit Beja`);
    return;
  }

  // Create venue
  await prisma.venue.create({
    data: {
      slug: "crossfit-beja",
      name: "CrossFit Beja",
      type: VenueType.CROSSFIT_BOX,
      sportTypes: [SportType.CROSSFIT],
      services: [
        VenueService.CROSSFIT,
        VenueService.FUNCTIONAL_FITNESS,
        VenueService.GROUP_CLASSES,
      ],
      address: "R. da Construção, 7800-104 Beja",
      city: "Beja",
      country: "Portugal",
      latitude: 38.0154,
      longitude: -7.8631,
      phone: "+351 965 522 012",
      website: "https://crossfitbeja.com.pt/",
      instagram: "crossfitbeja",
      createdByUserId: adminUser.id,
      isVerified: false,
      isActive: true,
      coverImage: GENERIC_CROSSFIT_COVER,
      logo: null,
      visibleTabs: ["about"],
    },
  });

  console.log(`✅ Created: CrossFit Beja`);
  console.log(`   📍 R. da Construção, 7800-104 Beja`);
  console.log(`   📞 +351 965 522 012`);
  console.log(`   🌐 https://crossfitbeja.com.pt/`);
  console.log(`   ⭐ 4.9 (44 opiniões no Google)`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding venue:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
