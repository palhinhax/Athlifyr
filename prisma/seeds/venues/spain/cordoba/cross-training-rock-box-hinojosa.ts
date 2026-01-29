/**
 * Seed: Cross Training Rock Box - Hinojosa del Duque
 * Box de CrossFit em Hinojosa del Duque, Córdoba, Espanha
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
  console.log("🏋️ Seeding Cross Training Rock Box - Hinojosa del Duque...\n");

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
    where: { slug: "cross-training-rock-box-hinojosa" },
  });

  if (existing) {
    console.log(`⏭️  Skipped (exists): Cross Training Rock Box`);
    return;
  }

  // Create venue
  await prisma.venue.create({
    data: {
      slug: "cross-training-rock-box-hinojosa",
      name: "Cross Training Rock Box",
      type: VenueType.CROSSFIT_BOX,
      sportTypes: [SportType.CROSSFIT],
      services: [
        VenueService.CROSSFIT,
        VenueService.FUNCTIONAL_FITNESS,
        VenueService.GROUP_CLASSES,
      ],
      address: "C. el Viso, S/N, 14270 Hinojosa del Duque, Córdoba",
      city: "Hinojosa del Duque",
      country: "Spain",
      latitude: 38.5152,
      longitude: -5.0692,
      phone: "+34 633 43 65 21",
      website: "https://crosstrainingrockbox.com",
      instagram: null,
      createdByUserId: adminUser.id,
      isVerified: false,
      isActive: true,
      coverImage: GENERIC_CROSSFIT_COVER,
      logo: null,
      visibleTabs: ["about"],
    },
  });

  console.log(`✅ Created: Cross Training Rock Box (Hinojosa del Duque)`);
  console.log(`   📍 C. el Viso, S/N, 14270 Hinojosa del Duque, Córdoba`);
  console.log(`   📞 +34 633 43 65 21`);
  console.log(`   🌐 https://crosstrainingrockbox.com`);
  console.log(`   ⭐ Rating: 5.0 (62 reviews)`);
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
