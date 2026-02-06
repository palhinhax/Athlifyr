/**
 * Seed: CrossBox Açor - Users
 * Utilizadores para a demo da CrossBox Açor (Seia e Arganil)
 *
 * Estrutura:
 * - 1 Admin da App (hello@athlifyr.com)
 * - 1 Owner das duas boxes
 * - 3 Coaches (1 só Seia, 1 só Arganil, 1 para ambas)
 * - Vários clientes
 *
 * Password padrão: Test123!
 *
 * Execução:
 *   npx ts-node prisma/seeds/venues/portugal/crossbox-acor-users.ts
 */

import { PrismaClient, UserRole, SportType } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = "Test123!";

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function main() {
  console.log("🌱 Seeding CrossBox Açor Users...\n");

  const hashedPassword = await hashPassword(DEFAULT_PASSWORD);

  // ============================================================================
  // 1. ADMIN ATHLIFYR (Owner da App)
  // ============================================================================
  console.log("👑 Creating Athlifyr Admin...");
  const athlifyrAdmin = await prisma.user.upsert({
    where: { email: "hello@athlifyr.com" },
    update: {
      name: "Athlifyr",
      role: UserRole.ADMIN,
      emailVerified: new Date(),
      emailNotifications: true,
      password: hashedPassword,
      locale: "pt",
    },
    create: {
      email: "hello@athlifyr.com",
      name: "Athlifyr",
      role: UserRole.ADMIN,
      emailVerified: new Date(),
      emailNotifications: true,
      password: hashedPassword,
      locale: "pt",
    },
  });
  console.log(`   ✅ Athlifyr Admin: ${athlifyrAdmin.email}`);

  // ============================================================================
  // 2. OWNER CROSSBOX AÇOR (Dono das duas boxes)
  // ============================================================================
  console.log("\n🏋️ Creating CrossBox Açor Owner...");
  const owner = await prisma.user.upsert({
    where: { email: "tiago@acor.pt" },
    update: {
      name: "Tiago Amaro",
      role: UserRole.USER,
      emailVerified: new Date(),
      emailNotifications: true,
      favoriteSports: [SportType.CROSSFIT, SportType.HYROX],
      password: hashedPassword,
      locale: "pt",
    },
    create: {
      email: "tiago@acor.pt",
      name: "Tiago Amaro",
      role: UserRole.USER,
      emailVerified: new Date(),
      emailNotifications: true,
      favoriteSports: [SportType.CROSSFIT, SportType.HYROX],
      password: hashedPassword,
      locale: "pt",
    },
  });
  console.log(`   ✅ Owner (ambas boxes): ${owner.email} - ${owner.name}`);

  // ============================================================================
  // 3. COACHES
  // ============================================================================
  console.log("\n💪 Creating Coaches...");

  // Coach para AMBAS as boxes
  const coachDuarte = await prisma.user.upsert({
    where: { email: "duarte@acor.pt" },
    update: {
      name: "Duarte Covas",
      role: UserRole.USER,
      emailVerified: new Date(),
      emailNotifications: true,
      favoriteSports: [SportType.CROSSFIT, SportType.HYROX],
      password: hashedPassword,
      locale: "pt",
    },
    create: {
      email: "duarte@acor.pt",
      name: "Duarte Covas",
      role: UserRole.USER,
      emailVerified: new Date(),
      emailNotifications: true,
      favoriteSports: [SportType.CROSSFIT, SportType.HYROX],
      password: hashedPassword,
      locale: "pt",
    },
  });
  console.log(
    `   ✅ Coach (ambas boxes): ${coachDuarte.email} - ${coachDuarte.name}`
  );

  // Coach só para SEIA
  const coachDiego = await prisma.user.upsert({
    where: { email: "diego@acor.pt" },
    update: {
      name: "Diego Cardoso",
      role: UserRole.USER,
      emailVerified: new Date(),
      emailNotifications: true,
      favoriteSports: [SportType.CROSSFIT, SportType.HYROX],
      password: hashedPassword,
      locale: "pt",
    },
    create: {
      email: "diego@acor.pt",
      name: "Diego Cardoso",
      role: UserRole.USER,
      emailVerified: new Date(),
      emailNotifications: true,
      favoriteSports: [SportType.CROSSFIT, SportType.HYROX],
      password: hashedPassword,
      locale: "pt",
    },
  });
  console.log(`   ✅ Coach (Seia): ${coachDiego.email} - ${coachDiego.name}`);

  // Coach só para ARGANIL
  const coachPedro = await prisma.user.upsert({
    where: { email: "pedro@acor.pt" },
    update: {
      name: "Pedro Gouveia",
      role: UserRole.USER,
      emailVerified: new Date(),
      emailNotifications: true,
      favoriteSports: [SportType.CROSSFIT, SportType.HYROX],
      password: hashedPassword,
      locale: "pt",
    },
    create: {
      email: "pedro@acor.pt",
      name: "Pedro Gouveia",
      role: UserRole.USER,
      emailVerified: new Date(),
      emailNotifications: true,
      favoriteSports: [SportType.CROSSFIT, SportType.HYROX],
      password: hashedPassword,
      locale: "pt",
    },
  });
  console.log(
    `   ✅ Coach (Arganil): ${coachPedro.email} - ${coachPedro.name}`
  );

  // ============================================================================
  // 4. CLIENTES / ATLETAS
  // ============================================================================
  console.log("\n🏃 Creating Athletes/Clients...");

  const athletes = [
    {
      email: "ana@acor.pt",
      name: "Ana Ferreira",
      sports: [SportType.CROSSFIT],
    },
    {
      email: "bruno@acor.pt",
      name: "Bruno Costa",
      sports: [SportType.CROSSFIT, SportType.HYROX],
    },
    { email: "carla@acor.pt", name: "Carla Mendes", sports: [SportType.HYROX] },
    {
      email: "daniel@acor.pt",
      name: "Daniel Rodrigues",
      sports: [SportType.CROSSFIT],
    },
    {
      email: "eva@acor.pt",
      name: "Eva Santos",
      sports: [SportType.CROSSFIT, SportType.HYROX],
    },
    {
      email: "filipe@acor.pt",
      name: "Filipe Martins",
      sports: [SportType.CROSSFIT],
    },
    {
      email: "gabriela@acor.pt",
      name: "Gabriela Oliveira",
      sports: [SportType.HYROX],
    },
    {
      email: "hugo@acor.pt",
      name: "Hugo Almeida",
      sports: [SportType.CROSSFIT, SportType.HYROX],
    },
    {
      email: "ines@acor.pt",
      name: "Inês Pereira",
      sports: [SportType.CROSSFIT],
    },
    {
      email: "joao@acor.pt",
      name: "João Nunes",
      sports: [SportType.CROSSFIT, SportType.HYROX],
    },
  ];

  for (const athlete of athletes) {
    const user = await prisma.user.upsert({
      where: { email: athlete.email },
      update: {
        name: athlete.name,
        role: UserRole.USER,
        emailVerified: new Date(),
        emailNotifications: true,
        favoriteSports: athlete.sports,
        password: hashedPassword,
        locale: "pt",
      },
      create: {
        email: athlete.email,
        name: athlete.name,
        role: UserRole.USER,
        emailVerified: new Date(),
        emailNotifications: true,
        favoriteSports: athlete.sports,
        password: hashedPassword,
        locale: "pt",
      },
    });
    console.log(`   ✅ Athlete: ${user.email} - ${user.name}`);
  }

  // ============================================================================
  // SUMMARY
  // ============================================================================
  console.log("\n" + "=".repeat(60));
  console.log("📊 SUMMARY - CrossBox Açor Users");
  console.log("=".repeat(60));
  console.log(`
🔐 Default Password: ${DEFAULT_PASSWORD}

👑 ADMIN ATHLIFYR:
   • hello@athlifyr.com (Athlifyr - App Owner)

🏋️ CROSSBOX AÇOR STAFF:
   
   Owner (ambas boxes):
   • tiago@acor.pt (Tiago Amaro)
   
   Coach (ambas boxes):
   • duarte@acor.pt (Duarte Covas)
   
   Coach (só Seia):
   • diego@acor.pt (Diego Cardoso)
   
   Coach (só Arganil):
   • pedro@acor.pt (Pedro Gouveia)

🏃 ATHLETES (10):
   • ana@acor.pt (Ana Ferreira)
   • bruno@acor.pt (Bruno Costa)
   • carla@acor.pt (Carla Mendes)
   • daniel@acor.pt (Daniel Rodrigues)
   • eva@acor.pt (Eva Santos)
   • filipe@acor.pt (Filipe Martins)
   • gabriela@acor.pt (Gabriela Oliveira)
   • hugo@acor.pt (Hugo Almeida)
   • ines@acor.pt (Inês Pereira)
   • joao@acor.pt (João Nunes)
  `);
  console.log("=".repeat(60));
  console.log("\n🎉 CrossBox Açor users seeded successfully!\n");

  // Return user IDs for use in venue seeds
  return {
    athlifyrAdmin,
    owner,
    coaches: {
      duarte: coachDuarte,
      diego: coachDiego,
      pedro: coachPedro,
    },
  };
}

main()
  .catch((e) => {
    console.error("❌ Error seeding users:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
