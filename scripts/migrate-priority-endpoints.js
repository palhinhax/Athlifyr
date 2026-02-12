/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Optimized script to migrate critical API routes to unified authentication
 * Focus on HIGH PRIORITY endpoints needed for mobile app
 */

const fs = require("fs");
const path = require("path");

// HIGH PRIORITY endpoints for mobile
const HIGH_PRIORITY_PATHS = [
  "app/api/user",
  "app/api/profile",
  "app/api/events",
  "app/api/participations",
  "app/api/friends",
  "app/api/notifications",
  "app/api/photos",
];

// Already migrated
const MIGRATED_FILES = new Set([
  "app/api/posts/route.ts",
  "app/api/posts/[id]/route.ts",
  "app/api/posts/[id]/like/route.ts",
  "app/api/posts/[id]/comments/route.ts",
  "app/api/profile/route.ts",
  "app/api/profile/favorite-sports/route.ts",
]);

function shouldMigrateFile(filePath) {
  const relativePath = path
    .relative(process.cwd(), filePath)
    .replace(/\\/g, "/");

  // Skip if already migrated
  if (MIGRATED_FILES.has(relativePath)) {
    return false;
  }

  // Skip auth routes
  if (relativePath.includes("app/api/auth/")) {
    return false;
  }

  // Only migrate high priority paths
  return HIGH_PRIORITY_PATHS.some((p) => relativePath.startsWith(p));
}

function migrateFile(filePath) {
  console.log(`📝 ${path.relative(process.cwd(), filePath)}`);

  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;

  // Step 1: Replace import (handle both Request and NextRequest)
  if (content.includes('import { auth } from "@/lib/auth"')) {
    // Check if NextRequest is already imported
    if (content.includes("import { NextRequest")) {
      // NextRequest already imported, just add getAuthenticatedUser
      content = content.replace(
        /import { auth } from "@\/lib\/auth";?/g,
        'import { getAuthenticatedUser } from "@/lib/auth-helpers";'
      );
    } else if (content.includes('import { NextResponse } from "next/server"')) {
      // Import NextResponse exists, add NextRequest
      content = content.replace(
        /import { NextResponse } from "next\/server";/g,
        'import { NextRequest, NextResponse } from "next/server";'
      );
      content = content.replace(
        /import { auth } from "@\/lib\/auth";?/g,
        'import { getAuthenticatedUser } from "@/lib/auth-helpers";'
      );
    }
    modified = true;
  }

  // Step 2: Update function signatures - Handle different patterns
  // Pattern: export async function GET()
  content = content.replace(
    /export async function (GET|POST|PATCH|PUT|DELETE)\(\s*\)\s*{/g,
    (match, method) => {
      modified = true;
      return `export async function ${method}(request: NextRequest) {`;
    }
  );

  // Pattern: export async function GET(request: Request)
  content = content.replace(
    /export async function (GET|POST|PATCH|PUT|DELETE)\(request: Request\)/g,
    (match, method) => {
      modified = true;
      return `export async function ${method}(request: NextRequest)`;
    }
  );

  // Step 3: Replace auth() calls
  content = content.replace(/const session = await auth\(\);/g, () => {
    modified = true;
    return "const user = await getAuthenticatedUser(request);";
  });

  // Step 4: Replace session checks
  content = content.replace(/if \(!session\?\.user\?\.id\)/g, () => {
    modified = true;
    return "if (!user?.id)";
  });

  content = content.replace(/if \(session\?\.user\?\.id\)/g, () => {
    modified = true;
    return "if (user?.id)";
  });

  // Step 5: Replace session.user usage
  content = content.replace(/session\.user\.id/g, "user.id");
  content = content.replace(/session\.user\.role/g, "user.role");
  content = content.replace(/session\.user\.email/g, "user.email");
  content = content.replace(/session\.user\.name/g, "user.name");

  // Step 6: Replace currentUserId pattern
  content = content.replace(
    /const currentUserId = session\?\.user\?\.id;/g,
    "const currentUserId = user?.id;"
  );

  if (modified) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`   ✅ Migrated\n`);
    return true;
  } else {
    console.log(`   ⚠️  Skipped (no changes)\n`);
    return false;
  }
}

function findRouteFiles(dirs) {
  const files = [];

  function walk(directory) {
    if (!fs.existsSync(directory)) return;

    const entries = fs.readdirSync(directory, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name === "route.ts") {
        const content = fs.readFileSync(fullPath, "utf8");
        if (content.includes('import { auth } from "@/lib/auth"')) {
          if (shouldMigrateFile(fullPath)) {
            files.push(fullPath);
          }
        }
      }
    }
  }

  dirs.forEach((dir) => walk(path.join(process.cwd(), dir)));
  return files;
}

// Main execution
console.log(`\n🚀 Migrating HIGH PRIORITY endpoints for mobile...\n`);

const filesToMigrate = findRouteFiles(HIGH_PRIORITY_PATHS);

console.log(`📋 Found ${filesToMigrate.length} files to migrate\n`);

if (filesToMigrate.length === 0) {
  console.log("✨ No files need migration!\n");
  process.exit(0);
}

let migratedCount = 0;

for (const file of filesToMigrate) {
  try {
    if (migrateFile(file)) {
      migratedCount++;
    }
  } catch (error) {
    console.error(`   ❌ Error:`, error.message, "\n");
  }
}

console.log(`\n📊 Summary:`);
console.log(`   ✅ Migrated: ${migratedCount}`);
console.log(`   ⏭️  Skipped: ${filesToMigrate.length - migratedCount}`);
console.log(`\n✨ Done! Run 'pnpm typecheck' to verify.\n`);
