/**
 * Seed: Hero Box - Venda do Pinheiro
 * Box de CrossFit/Treino Funcional em Venda do Pinheiro
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
  console.log("🏋️ Seeding Hero Box Venda do Pinheiro...\n");

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
    where: { slug: "hero-box-venda-pinheiro" },
  });

  if (existing) {
    console.log(`⏭️  Skipped (exists): Hero Box Venda do Pinheiro`);
    return;
  }

  // Create venue
  await prisma.venue.create({
    data: {
      slug: "hero-box-venda-pinheiro",
      name: "Hero Box",
      type: VenueType.CROSSTRAINING_BOX,
      sportTypes: [SportType.CROSSFIT],
      services: [
        VenueService.CROSSFIT,
        VenueService.FUNCTIONAL_FITNESS,
        VenueService.PERSONAL_TRAINING,
      ],
      address: "R. Fontaínhas do Arneiro 8, 2665-501 Venda do Pinheiro",
      city: "Venda do Pinheiro",
      country: "Portugal",
      latitude: 38.941353201872424,
      longitude: -9.226674275188719,
      instagram: "herobox.pt",
      createdByUserId: adminUser.id,
      isVerified: false,
      isActive: true,
      coverImage: GENERIC_CROSSFIT_COVER,
      logo: null,
      visibleTabs: ["about"],
    },
  });

  console.log(`✅ Created: Hero Box (Venda do Pinheiro)`);
  console.log(`   📍 R. Fontaínhas do Arneiro 8, 2665-501 Venda do Pinheiro`);
  console.log(`   📸 @herobox.pt`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding venue:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
