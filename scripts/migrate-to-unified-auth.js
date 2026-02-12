/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
/**
 * Script to migrate all API routes from NextAuth-only to unified authentication
 * This allows both web (NextAuth) and mobile (JWT) authentication to work
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Files already migrated (skip these)
const MIGRATED_FILES = new Set([
  "app/api/posts/route.ts",
  "app/api/posts/[id]/route.ts",
  "app/api/posts/[id]/like/route.ts",
  "app/api/posts/[id]/comments/route.ts",
  "app/api/chat/conversations/route.ts",
  "app/api/chat/conversations/[id]/messages/route.ts",
  "app/api/chat/conversations/[id]/seen/route.ts",
  "app/api/chat/conversations/[id]/messages/poll/route.ts",
  "app/api/chat/conversations/[id]/hide/route.ts",
  "app/api/chat/notifications/read-all/route.ts",
  "app/api/chat/notifications/route.ts",
  "app/api/chat/notifications/[id]/read/route.ts",
]);

// Files to SKIP (these are auth routes or special cases)
const SKIP_FILES = new Set([
  "app/api/auth/login/route.ts",
  "app/api/auth/register/route.ts",
  "app/api/auth/refresh/route.ts",
  "app/api/auth/verify/route.ts",
  "app/api/auth/send-verification/route.ts",
  "app/api/auth/callback/route.ts",
]);

function findFilesWithAuth(dir) {
  const files = [];

  function walk(directory) {
    const entries = fs.readdirSync(directory, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name === "route.ts") {
        const content = fs.readFileSync(fullPath, "utf8");

        // Check if file uses old auth
        if (content.includes('import { auth } from "@/lib/auth"')) {
          const relativePath = path
            .relative(process.cwd(), fullPath)
            .replace(/\\/g, "/");

          // Skip if already migrated or in skip list
          if (
            !MIGRATED_FILES.has(relativePath) &&
            !SKIP_FILES.has(relativePath)
          ) {
            files.push(fullPath);
          }
        }
      }
    }
  }

  walk(dir);
  return files;
}

function migrateFile(filePath) {
  console.log(`📝 Migrating: ${path.relative(process.cwd(), filePath)}`);

  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;

  // Step 1: Replace import
  if (content.includes('import { auth } from "@/lib/auth"')) {
    content = content.replace(
      /import { auth } from "@\/lib\/auth";?/g,
      'import { getAuthenticatedUser } from "@/lib/auth-helpers";'
    );
    modified = true;
  }

  // Step 2: Replace auth() calls with getAuthenticatedUser(request)
  // Pattern: const session = await auth();
  if (content.includes("const session = await auth()")) {
    content = content.replace(
      /const session = await auth\(\);/g,
      "const user = await getAuthenticatedUser(request);"
    );
    modified = true;
  }

  // Step 3: Replace session?.user?.id checks
  if (content.includes("session?.user?.id")) {
    content = content.replace(
      /if \(!session\?\.user\?\.id\)/g,
      "if (!user?.id)"
    );
    content = content.replace(/if \(session\?\.user\?\.id\)/g, "if (user?.id)");
    modified = true;
  }

  // Step 4: Replace session.user.id usage
  content = content.replace(/session\.user\.id/g, "user.id");

  // Step 5: Replace session.user.role usage
  content = content.replace(/session\.user\.role/g, "user.role");

  // Step 6: Replace session.user.email usage
  content = content.replace(/session\.user\.email/g, "user.email");

  // Step 7: Replace session.user.name usage
  content = content.replace(/session\.user\.name/g, "user.name");

  // Step 8: Replace currentUserId = session?.user?.id
  content = content.replace(
    /const currentUserId = session\?\.user\?\.id;/g,
    "const currentUserId = user?.id;"
  );

  if (modified || content !== fs.readFileSync(filePath, "utf8")) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`   ✅ Migrated successfully`);
    return true;
  } else {
    console.log(`   ⚠️  No changes needed`);
    return false;
  }
}

// Main execution
const apiDir = path.join(process.cwd(), "app", "api");
const filesToMigrate = findFilesWithAuth(apiDir);

console.log(`\n🔍 Found ${filesToMigrate.length} files to migrate\n`);

if (filesToMigrate.length === 0) {
  console.log("✨ No files need migration!");
  process.exit(0);
}

let migratedCount = 0;

for (const file of filesToMigrate) {
  try {
    if (migrateFile(file)) {
      migratedCount++;
    }
  } catch (error) {
    console.error(`   ❌ Error migrating ${file}:`, error.message);
  }
}

console.log(`\n📊 Migration Summary:`);
console.log(`   Total files processed: ${filesToMigrate.length}`);
console.log(`   Successfully migrated: ${migratedCount}`);
console.log(
  `   Skipped (no changes): ${filesToMigrate.length - migratedCount}`
);

console.log(`\n🔧 Running TypeScript check...`);
try {
  execSync("pnpm typecheck", { stdio: "inherit" });
  console.log(`\n✅ TypeScript check passed!`);
} catch (error) {
  console.log(`\n⚠️  TypeScript check failed. Please review the errors above.`);
  process.exit(1);
}

console.log(`\n✨ Migration complete!`);
