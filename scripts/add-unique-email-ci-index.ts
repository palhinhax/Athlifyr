/**
 * Script to add a case-insensitive unique index on User.email
 * This prevents duplicate emails with different casing at the database level.
 *
 * Run with: npx tsx scripts/add-unique-email-ci-index.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Checking for duplicate emails (case-insensitive)...\n");

  // First, find any remaining duplicates
  const duplicates = await prisma.$queryRaw<
    Array<{ lower_email: string; count: bigint }>
  >`
    SELECT LOWER(email) as lower_email, COUNT(*) as count
    FROM "User"
    GROUP BY LOWER(email)
    HAVING COUNT(*) > 1
  `;

  if (duplicates.length > 0) {
    console.error("❌ Found duplicate emails that must be resolved first:\n");
    for (const dup of duplicates) {
      const users = await prisma.user.findMany({
        where: {
          email: {
            contains: dup.lower_email,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });
      console.log(`  📧 "${dup.lower_email}" (${dup.count} users):`);
      for (const u of users) {
        console.log(
          `     - ID: ${u.id} | Email: "${u.email}" | Name: "${u.name}" | Role: ${u.role} | Created: ${u.createdAt.toISOString()}`
        );
      }
    }
    console.error(
      "\n⚠️  Please resolve duplicates before creating the unique index."
    );
    console.error(
      "   Delete or merge duplicate accounts, then run this script again.\n"
    );
    process.exit(1);
  }

  console.log("✅ No duplicate emails found.\n");

  // Normalize all existing emails to lowercase
  console.log("📝 Normalizing all existing emails to lowercase...");
  const updated = await prisma.$executeRaw`
    UPDATE "User" SET email = LOWER(TRIM(email)) WHERE email != LOWER(TRIM(email))
  `;
  console.log(`   Updated ${updated} email(s).\n`);

  // Create unique index on LOWER(email)
  console.log("🔒 Creating case-insensitive unique index on User.email...");
  try {
    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "User_email_lower_unique" ON "User" (LOWER(email))
    `;
    console.log("✅ Index 'User_email_lower_unique' created successfully!\n");
  } catch (error) {
    if (error instanceof Error && error.message.includes("already exists")) {
      console.log("ℹ️  Index already exists, skipping.\n");
    } else {
      throw error;
    }
  }

  console.log(
    "🎉 Done! Duplicate emails are now impossible at the database level."
  );
}

main()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
