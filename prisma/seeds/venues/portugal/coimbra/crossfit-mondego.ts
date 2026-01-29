/**
 * Seed: CrossFit Mondego - Coimbra
 * Box de CrossFit em Coimbra
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
  console.log("🏋️ Seeding CrossFit Mondego - Coimbra...\n");

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
    where: { slug: "crossfit-mondego-coimbra" },
  });

  if (existing) {
    console.log(`⏭️  Skipped (exists): CrossFit Mondego`);
    return;
  }

  // Create venue
  await prisma.venue.create({
    data: {
      slug: "crossfit-mondego-coimbra",
      name: "CrossFit Mondego",
      type: VenueType.CROSSFIT_BOX,
      sportTypes: [SportType.CROSSFIT, SportType.HYROX],
      services: [
        VenueService.CROSSFIT,
        VenueService.HYROX,
        VenueService.FUNCTIONAL_FITNESS,
        VenueService.PERSONAL_TRAINING,
        VenueService.GROUP_CLASSES,
      ],
      address: "Estr. Vale de Figueiras 25, Coselhas, 3000-404 Coimbra",
      city: "Coimbra",
      country: "Portugal",
      latitude: 40.2227,
      longitude: -8.4272,
      phone: "+351 915 904 499",
      website: "https://crossfitmondego.com/pt/",
      instagram: "crossfitmondego",
      createdByUserId: adminUser.id,
      isVerified: false,
      isActive: true,
      coverImage: GENERIC_CROSSFIT_COVER,
      logo: null,
      visibleTabs: ["about"],
    },
  });

  console.log(`✅ Created: CrossFit Mondego (Coimbra)`);
  console.log(`   📍 Estr. Vale de Figueiras 25, Coselhas, 3000-404 Coimbra`);
  console.log(`   📞 +351 915 904 499`);
  console.log(`   🌐 https://crossfitmondego.com/pt/`);
  console.log(`   📸 @crossfitmondego`);
  console.log(
    `   🏷️  Services: CrossFit, HYROX, Conditioning, Personal Training, Small Group Training`
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
