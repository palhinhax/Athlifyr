/**
 * Seed: Wezone CrossFit Plaza Castilla (CrossFit V8) - Madrid
 * Box de CrossFit em Madrid, Espanha
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
  console.log("🏋️ Seeding Wezone CrossFit Plaza Castilla - Madrid...\n");

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
    where: { slug: "wezone-crossfit-plaza-castilla-madrid" },
  });

  if (existing) {
    console.log(`⏭️  Skipped (exists): Wezone CrossFit Plaza Castilla`);
    return;
  }

  // Create venue
  await prisma.venue.create({
    data: {
      slug: "wezone-crossfit-plaza-castilla-madrid",
      name: "Wezone CrossFit Plaza Castilla",
      type: VenueType.CROSSFIT_BOX,
      sportTypes: [SportType.CROSSFIT],
      services: [
        VenueService.CROSSFIT,
        VenueService.FUNCTIONAL_FITNESS,
        VenueService.GROUP_CLASSES,
      ],
      address: "C. de Bravo Murillo, 309, Tetuán, 28020 Madrid",
      city: "Madrid",
      country: "Spain",
      latitude: 40.4635,
      longitude: -3.6906,
      phone: null,
      website: "https://wezone.es",
      instagram: null,
      createdByUserId: adminUser.id,
      isVerified: false,
      isActive: true,
      coverImage: GENERIC_CROSSFIT_COVER,
      logo: null,
      visibleTabs: ["about"],
    },
  });

  console.log(`✅ Created: Wezone CrossFit Plaza Castilla (Madrid)`);
  console.log(`   📍 C. de Bravo Murillo, 309, Tetuán, 28020 Madrid`);
  console.log(`   🌐 https://wezone.es`);
  console.log(`   ⭐ Rating: 4.7 (207 reviews)`);
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
