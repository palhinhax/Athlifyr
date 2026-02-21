/**
 * Seed - Utilizador de Teste Simples
 *
 * Cria um utilizador de teste genérico para desenvolvimento rápido.
 *
 * Email:    test@athlifyr.com
 * Password: Test123!
 *
 * Execução:
 *   pnpm db:seed:test-user
 */

import { PrismaClient, UserRole } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const TEST_EMAIL = "test@athlifyr.com";
const TEST_PASSWORD = "Test123!";

async function main() {
  console.log("🌱 Criando utilizador de teste...\n");

  const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 12);

  const user = await prisma.user.upsert({
    where: { email: TEST_EMAIL },
    update: {
      name: "Test User",
      role: UserRole.USER,
      emailVerified: new Date(),
      emailNotifications: true,
      password: hashedPassword,
    },
    create: {
      email: TEST_EMAIL,
      name: "Test User",
      role: UserRole.USER,
      emailVerified: new Date(),
      emailNotifications: true,
      password: hashedPassword,
    },
  });

  console.log("✅ Utilizador de teste criado com sucesso!");
  console.log("─────────────────────────────────────");
  console.log(`   Email:    ${user.email}`);
  console.log(`   Password: ${TEST_PASSWORD}`);
  console.log(`   Role:     ${user.role}`);
  console.log(`   ID:       ${user.id}`);
  console.log("─────────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao criar utilizador de teste:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
