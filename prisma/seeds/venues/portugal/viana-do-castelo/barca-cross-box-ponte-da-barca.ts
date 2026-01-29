/**
 * Seed: Barca Cross Box - Ponte da Barca
 * Box de CrossFit em Ponte da Barca
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
  console.log("🏋️ Seeding Barca Cross Box - Ponte da Barca...\n");

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
    where: { slug: "barca-cross-box-ponte-da-barca" },
  });

  if (existing) {
    console.log(`⏭️  Skipped (exists): Barca Cross Box`);
    return;
  }

  // Create venue
  await prisma.venue.create({
    data: {
      slug: "barca-cross-box-ponte-da-barca",
      name: "Barca Cross Box",
      type: VenueType.CROSSFIT_BOX,
      sportTypes: [SportType.CROSSFIT],
      services: [
        VenueService.CROSSFIT,
        VenueService.FUNCTIONAL_FITNESS,
        VenueService.GROUP_CLASSES,
      ],
      address: "Av. Dr. Mário Soares 2a, 4980-641 Ponte da Barca",
      city: "Ponte da Barca",
      country: "Portugal",
      latitude: 41.8184,
      longitude: -8.4057,
      phone: "+351 963 436 336",
      website: null,
      instagram: "barcacrossbox",
      createdByUserId: adminUser.id,
      isVerified: false,
      isActive: true,
      coverImage: GENERIC_CROSSFIT_COVER,
      logo: null,
      visibleTabs: ["about"],
    },
  });

  console.log(`✅ Created: Barca Cross Box (Ponte da Barca)`);
  console.log(`   📍 Av. Dr. Mário Soares 2a, 4980-641 Ponte da Barca`);
  console.log(`   📞 +351 963 436 336`);
  console.log(`   📸 @barcacrossbox`);
  console.log(`   ⭐ Rating: 4.3 (6 reviews)`);
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
