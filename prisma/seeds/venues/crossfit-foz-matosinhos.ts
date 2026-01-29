/**
 * Seed: CrossFit Foz - Matosinhos
 * Box de CrossFit em Matosinhos
 */

import { PrismaClient, VenueType, SportType } from "@prisma/client";

const prisma = new PrismaClient();

// Imagem genérica de cover para CrossFit boxes
const GENERIC_CROSSFIT_COVER =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=600&fit=crop&q=80";

async function main() {
  console.log("🏋️ Seeding CrossFit Foz Matosinhos...\n");

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
    where: { slug: "crossfit-foz-matosinhos" },
  });

  if (existing) {
    console.log(`⏭️  Skipped (exists): CrossFit Foz Matosinhos`);
    return;
  }

  // Create venue
  await prisma.venue.create({
    data: {
      slug: "crossfit-foz-matosinhos",
      name: "CrossFit Foz",
      type: VenueType.CROSSFIT_BOX,
      sportTypes: [SportType.CROSSFIT],
      address: "R. Dom João I 292, 4450-189 Matosinhos",
      city: "Matosinhos",
      country: "Portugal",
      latitude: 41.179370774706946,
      longitude: -8.687672273028204,
      website: "https://crossfitfoz.com",
      createdByUserId: adminUser.id,
      isVerified: false,
      isActive: true,
      coverImage: GENERIC_CROSSFIT_COVER,
      logo: null,
      visibleTabs: ["about"],
    },
  });

  console.log(`✅ Created: CrossFit Foz (Matosinhos)`);
  console.log(`   📍 R. Dom João I 292, 4450-189 Matosinhos`);
  console.log(`   🌐 crossfitfoz.com`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding venue:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
