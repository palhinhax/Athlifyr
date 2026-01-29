/**
 * Seed: Step By Step CrossFit - Olhão
 * Box de CrossFit em Olhão, Faro
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
  console.log("🏋️ Seeding Step By Step CrossFit - Olhão...\n");

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
    where: { slug: "step-by-step-crossfit-olhao" },
  });

  if (existing) {
    console.log(`⏭️  Skipped (exists): Step By Step CrossFit`);
    return;
  }

  // Create venue
  await prisma.venue.create({
    data: {
      slug: "step-by-step-crossfit-olhao",
      name: "Step By Step CrossFit",
      type: VenueType.CROSSFIT_BOX,
      sportTypes: [SportType.CROSSFIT],
      services: [
        VenueService.CROSSFIT,
        VenueService.FUNCTIONAL_FITNESS,
        VenueService.GROUP_CLASSES,
      ],
      address: "R. da Manageira 83, 8700-281 Olhão",
      city: "Olhão",
      country: "Portugal",
      latitude: 37.0256,
      longitude: -7.8408,
      phone: "+351 910 847 868",
      instagram: "stepbystep_crossfit",
      createdByUserId: adminUser.id,
      isVerified: false,
      isActive: true,
      coverImage: GENERIC_CROSSFIT_COVER,
      logo: null,
      visibleTabs: ["about"],
    },
  });

  console.log(`✅ Created: Step By Step CrossFit (Olhão)`);
  console.log(`   📍 R. da Manageira 83, 8700-281 Olhão`);
  console.log(`   📞 +351 910 847 868`);
  console.log(`   ⭐ 4.9 (80 opiniões no Google)`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding venue:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
