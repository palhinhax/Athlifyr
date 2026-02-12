/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Post-migration fixes for common TypeScript errors
 */

const fs = require("fs");
const path = require("path");

const files = [
  // Files with Request instead of NextRequest in params
  "app/api/events/[id]/route.ts",
  "app/api/events/[id]/translations/route.ts",
  "app/api/friends/[id]/route.ts",
  "app/api/photos/[id]/route.ts",
  "app/api/profile/performance/[id]/route.ts",

  // Files with session references
  "app/api/events/[id]/route.ts",
  "app/api/events/[id]/translations/route.ts",
  "app/api/events/route.ts",
  "app/api/notifications/route.ts",
  "app/api/notifications/trial-bookings/route.ts",

  // Files with duplicate user declarations
  "app/api/profile/performance/exercises/route.ts",
  "app/api/user/notifications/route.ts",

  // File with missing request parameter
  "app/api/user/locale/route.ts",
];

function fixFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(fullPath, "utf8");
  let modified = false;

  // Fix 1: Change Request to NextRequest in function params
  if (
    content.match(
      /export async function (GET|POST|PATCH|PUT|DELETE)\([^)]*request: Request[^)]*\)/
    )
  ) {
    content = content.replace(
      /(\{ params \}: \{ params: Promise<[^>]+> \}), context\?: any\)/g,
      "{ params }: { params: Promise<$1> }"
    );
    content = content.replace(
      /export async function (GET|POST|PATCH|PUT|DELETE)\(request: Request,/g,
      "export async function $1(request: NextRequest,"
    );
    modified = true;
  }

  // Fix 2: Remove leftover session checks
  if (content.includes("if (!session?.user)")) {
    content = content.replace(/if \(!session\?\.user\)/g, "if (!user)");
    modified = true;
  }

  // Fix 3: Fix null checks for user
  if (content.match(/if \(user\.role !== "ADMIN"\)/)) {
    content = content.replace(
      /if \(user\.role !== "ADMIN"\)/g,
      'if (user?.role !== "ADMIN")'
    );
    modified = true;
  }

  // Fix 4: Fix duplicate const user declarations
  if (
    content.match(
      /const user = await prisma\.user\.findUnique\(\{\s*where: \{ id: user\.id \}/s
    )
  ) {
    content = content.replace(
      /const user = await prisma\.user\.findUnique\(\{\s*where: \{ id: user\.id \}/gs,
      "const userDetails = await prisma.user.findUnique({\n      where: { id: user.id }"
    );
    modified = true;
  }

  // Fix 5: Fix missing import for getAuthenticatedUser
  if (
    content.includes("getAuthenticatedUser") &&
    !content.includes("import { getAuthenticatedUser }")
  ) {
    // Find where to add the import
    const lines = content.split("\n");
    let importLineIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("import { NextRequest")) {
        importLineIndex = i + 1;
        break;
      } else if (
        lines[i].includes("import") &&
        lines[i].includes('from "next/server"')
      ) {
        importLineIndex = i + 1;
        break;
      }
    }

    if (importLineIndex > 0) {
      lines.splice(
        importLineIndex,
        0,
        'import { getAuthenticatedUser } from "@/lib/auth-helpers";'
      );
      content = lines.join("\n");
      modified = true;
    }
  }

  // Fix 6: Add request parameter where missing
  if (filePath.includes("user/locale/route.ts")) {
    // This file has PATCH but no request parameter
    content = content.replace(
      /export async function PATCH\(\) \{/,
      "export async function PATCH(request: NextRequest) {"
    );
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(fullPath, content, "utf8");
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  }

  return false;
}

console.log("\n🔧 Applying post-migration fixes...\n");

const uniqueFiles = [...new Set(files)];
let fixedCount = 0;

for (const file of uniqueFiles) {
  try {
    if (fixFile(file)) {
      fixedCount++;
    }
  } catch (error) {
    console.error(`❌ Error fixing ${file}:`, error.message);
  }
}

console.log(`\n📊 Fixed ${fixedCount} files\n`);
console.log("Run typecheck again to verify fixes.\n");
