/**
 * Seed: Box 520 Training Center - El Viso del Alcor
 * Box de CrossFit em El Viso del Alcor, Sevilla, Espanha
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
  console.log("🏋️ Seeding Box 520 Training Center - El Viso del Alcor...\n");

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
    where: { slug: "box-520-training-center-el-viso-del-alcor" },
  });

  if (existing) {
    console.log(`⏭️  Skipped (exists): Box 520 Training Center`);
    return;
  }

  // Create venue
  await prisma.venue.create({
    data: {
      slug: "box-520-training-center-el-viso-del-alcor",
      name: "Box 520 Training Center",
      type: VenueType.CROSSFIT_BOX,
      sportTypes: [SportType.CROSSFIT],
      services: [
        VenueService.CROSSFIT,
        VenueService.FUNCTIONAL_FITNESS,
        VenueService.GROUP_CLASSES,
        VenueService.PERSONAL_TRAINING,
      ],
      address: "C. Mecánicos, 34, 41520 El Viso del Alcor, Sevilla",
      city: "El Viso del Alcor",
      country: "Spain",
      latitude: 37.3893,
      longitude: -5.7191,
      phone: "+34 677 62 74 01",
      website: null,
      instagram: null,
      createdByUserId: adminUser.id,
      isVerified: false,
      isActive: true,
      coverImage: GENERIC_CROSSFIT_COVER,
      logo: null,
      visibleTabs: ["about"],
    },
  });

  console.log(`✅ Created: Box 520 Training Center (El Viso del Alcor)`);
  console.log(`   📍 C. Mecánicos, 34, 41520 El Viso del Alcor, Sevilla`);
  console.log(`   📞 +34 677 62 74 01`);
  console.log(`   ⭐ Rating: 5.0 (14 reviews)`);
  console.log(
    `   🏷️  Services: CrossFit, Functional Fitness, Group Classes, Personal Training`
  );
}

main()
  .catch((e) => {
    console.error("❌ Error seeding venue:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
