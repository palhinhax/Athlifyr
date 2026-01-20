import fs from "fs";
import path from "path";

const languages = ["en", "pt", "es", "fr", "de", "it"];

// Define which top-level keys go into which module
const modules: Record<string, string[]> = {
  common: ["common", "upload", "sports"],
  navigation: ["nav", "footer"],
  home: ["home", "promo", "notFound"],
  auth: ["settings", "profile"],
  events: ["events", "eventsPage", "map"],
  venues: ["venues"],
  feed: ["feed"],
  admin: ["admin"],
  legal: ["legal"],
};

console.log("🚀 Starting translation file split...\n");

for (const lang of languages) {
  const sourceFile = path.join("messages", `${lang}.json`);

  if (!fs.existsSync(sourceFile)) {
    console.log(`⚠️  Skipping ${lang} - file not found`);
    continue;
  }

  const source = JSON.parse(fs.readFileSync(sourceFile, "utf-8"));

  // Create lang directory
  const langDir = path.join("messages", lang);
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir, { recursive: true });
  }

  let totalKeys = 0;
  let totalSize = 0;

  // Split into modules
  for (const [moduleName, keys] of Object.entries(modules)) {
    const moduleData: Record<string, unknown> = {};

    for (const key of keys) {
      if (source[key]) {
        moduleData[key] = source[key];
        totalKeys++;
      }
    }

    const moduleContent = JSON.stringify(moduleData, null, 2);
    const modulePath = path.join(langDir, `${moduleName}.json`);

    fs.writeFileSync(modulePath, moduleContent, "utf-8");

    const fileSize = Buffer.byteLength(moduleContent, "utf-8");
    totalSize += fileSize;

    console.log(
      `  ✅ ${lang}/${moduleName}.json - ${Object.keys(moduleData).length} sections - ${(fileSize / 1024).toFixed(2)} KB`
    );
  }

  const originalSize = fs.statSync(sourceFile).size;
  console.log(
    `  📊 ${lang}: Split ${totalKeys} sections into ${Object.keys(modules).length} modules`
  );
  console.log(
    `  📦 Original: ${(originalSize / 1024).toFixed(2)} KB → Modular: ${(totalSize / 1024).toFixed(2)} KB`
  );
  console.log("");
}

console.log("\n✨ Split complete!");
console.log(
  "\n📝 Next steps:\n  1. Update i18n/request.ts to load modular files\n  2. Test with: pnpm build\n  3. If successful, backup/remove old .json files"
);
