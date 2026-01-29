/**
 * Seed: Inbox Cross Training - Gulpilhares
 * Box de CrossFit em Gulpilhares, Vila Nova de Gaia
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
  console.log("🏋️ Seeding Inbox Cross Training - Gulpilhares...\n");

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
    where: { slug: "inbox-cross-training-gulpilhares" },
  });

  if (existing) {
    console.log(`⏭️  Skipped (exists): Inbox Cross Training`);
    return;
  }

  // Create venue
  await prisma.venue.create({
    data: {
      slug: "inbox-cross-training-gulpilhares",
      name: "Inbox Cross Training",
      type: VenueType.CROSSFIT_BOX,
      sportTypes: [SportType.CROSSFIT],
      services: [
        VenueService.CROSSFIT,
        VenueService.FUNCTIONAL_FITNESS,
        VenueService.GROUP_CLASSES,
      ],
      address: "Tv. da Azenha 137, 4415-575 Gulpilhares",
      city: "Vila Nova de Gaia",
      country: "Portugal",
      latitude: 41.0823,
      longitude: -8.6412,
      phone: "+351 917 517 706",
      website: "https://inboxfit.pt",
      instagram: "inboxfit",
      createdByUserId: adminUser.id,
      isVerified: false,
      isActive: true,
      coverImage: GENERIC_CROSSFIT_COVER,
      logo: null,
      visibleTabs: ["about"],
    },
  });

  console.log(`✅ Created: Inbox Cross Training (Gulpilhares)`);
  console.log(`   📍 Tv. da Azenha 137, 4415-575 Gulpilhares`);
  console.log(`   📞 +351 917 517 706`);
  console.log(`   🌐 https://inboxfit.pt`);
  console.log(`   📸 @inboxfit`);
  console.log(`   ⭐ Rating: 5.0 (61 reviews)`);
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
