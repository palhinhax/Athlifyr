/**
 * Seed: VALHALLA BOX - Dos Hermanas
 * Box de CrossFit em Dos Hermanas, Sevilla, Espanha
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
  console.log("🏋️ Seeding VALHALLA BOX - Dos Hermanas...\n");

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
    where: { slug: "valhalla-box-dos-hermanas" },
  });

  if (existing) {
    console.log(`⏭️  Skipped (exists): VALHALLA BOX`);
    return;
  }

  // Create venue
  await prisma.venue.create({
    data: {
      slug: "valhalla-box-dos-hermanas",
      name: "VALHALLA BOX",
      type: VenueType.CROSSFIT_BOX,
      sportTypes: [SportType.CROSSFIT],
      services: [
        VenueService.CROSSFIT,
        VenueService.FUNCTIONAL_FITNESS,
        VenueService.GROUP_CLASSES,
      ],
      address: "C. Vía Apia, 2, 41089 Dos Hermanas, Sevilla",
      city: "Dos Hermanas",
      country: "Spain",
      latitude: 37.3493,
      longitude: -5.9203,
      phone: "+34 638 77 94 55",
      website: "https://valhallabox.es",
      instagram: null,
      createdByUserId: adminUser.id,
      isVerified: false,
      isActive: true,
      coverImage: GENERIC_CROSSFIT_COVER,
      logo: null,
      visibleTabs: ["about"],
    },
  });

  console.log(`✅ Created: VALHALLA BOX (Dos Hermanas)`);
  console.log(`   📍 C. Vía Apia, 2, 41089 Dos Hermanas, Sevilla`);
  console.log(`   📞 +34 638 77 94 55`);
  console.log(`   🌐 https://valhallabox.es`);
  console.log(`   ⭐ Rating: 4.9 (71 reviews)`);
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
