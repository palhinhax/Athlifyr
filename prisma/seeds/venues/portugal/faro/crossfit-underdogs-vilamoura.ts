/**
 * Seed: CrossFit Underdogs Vilamoura
 * Box de CrossFit em Vilamoura, Quarteira
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
  console.log("🏋️ Seeding CrossFit Underdogs Vilamoura...\n");

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
    where: { slug: "crossfit-underdogs-vilamoura" },
  });

  if (existing) {
    console.log(`⏭️  Skipped (exists): CrossFit Underdogs Vilamoura`);
    return;
  }

  // Create venue
  await prisma.venue.create({
    data: {
      slug: "crossfit-underdogs-vilamoura",
      name: "CrossFit Underdogs Vilamoura",
      type: VenueType.CROSSFIT_BOX,
      sportTypes: [SportType.CROSSFIT],
      services: [
        VenueService.CROSSFIT,
        VenueService.FUNCTIONAL_FITNESS,
        VenueService.GROUP_CLASSES,
      ],
      address:
        "Zona Industrial de Vilamoura, R. dos Tanoeiros 1a 8125, Vilamoura, 8125-500 Quarteira",
      city: "Quarteira",
      country: "Portugal",
      latitude: 37.0889,
      longitude: -8.1186,
      website: "https://underdogscrossfit.com/",
      instagram: "crossfitunderdogsvilamoura",
      createdByUserId: adminUser.id,
      isVerified: false,
      isActive: true,
      coverImage: GENERIC_CROSSFIT_COVER,
      logo: null,
      visibleTabs: ["about"],
    },
  });

  console.log(`✅ Created: CrossFit Underdogs Vilamoura`);
  console.log(
    `   📍 Zona Industrial de Vilamoura, R. dos Tanoeiros 1a 8125, Vilamoura, 8125-500 Quarteira`
  );
  console.log(`   🌐 https://underdogscrossfit.com/`);
  console.log(`   ⭐ 5.0 (58 opiniões no Google)`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding venue:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
