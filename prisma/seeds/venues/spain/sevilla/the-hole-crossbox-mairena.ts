/**
 * Seed: The Hole CrossBox - Mairena del Aljarafe
 * Box de CrossFit em Mairena del Aljarafe, Sevilla, Espanha
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
  console.log("🏋️ Seeding The Hole CrossBox - Mairena del Aljarafe...\n");

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
    where: { slug: "the-hole-crossbox-mairena-del-aljarafe" },
  });

  if (existing) {
    console.log(`⏭️  Skipped (exists): The Hole CrossBox`);
    return;
  }

  // Create venue
  await prisma.venue.create({
    data: {
      slug: "the-hole-crossbox-mairena-del-aljarafe",
      name: "The Hole CrossBox",
      type: VenueType.CROSSFIT_BOX,
      sportTypes: [SportType.CROSSFIT],
      services: [
        VenueService.CROSSFIT,
        VenueService.FUNCTIONAL_FITNESS,
        VenueService.GROUP_CLASSES,
      ],
      address: "C. Hacienda, 7, 41927 Mairena del Aljarafe, Sevilla",
      city: "Mairena del Aljarafe",
      country: "Spain",
      latitude: 37.3566,
      longitude: -6.0375,
      phone: "+34 624 68 60 52",
      website: "https://theholecrossbox.wodbuster.com",
      instagram: null,
      createdByUserId: adminUser.id,
      isVerified: false,
      isActive: true,
      coverImage: GENERIC_CROSSFIT_COVER,
      logo: null,
      visibleTabs: ["about"],
    },
  });

  console.log(`✅ Created: The Hole CrossBox (Mairena del Aljarafe)`);
  console.log(`   📍 C. Hacienda, 7, 41927 Mairena del Aljarafe, Sevilla`);
  console.log(`   📞 +34 624 68 60 52`);
  console.log(`   🌐 https://theholecrossbox.wodbuster.com`);
  console.log(`   ⭐ Rating: 4.9 (15 reviews)`);
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
