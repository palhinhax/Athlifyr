# Modular Translation Structure - Implementation Guide

## Problem

Translation files are becoming too large (33-37 KB each) and hard to maintain.

## Solution: Modular Translation Structure

### Proposed Structure

```
messages/
  ├── en/
  │   ├── common.json       (~3 KB) - common, upload, sports
  │   ├── navigation.json   (~2 KB) - nav, footer
  │   ├── home.json         (~2 KB) - home, promo, notFound
  │   ├── auth.json         (~8 KB) - settings, profile
  │   ├── events.json       (~10 KB) - events, eventsPage, map
  │   ├── venues.json       (~8 KB) - venues
  │   ├── feed.json         (~1 KB) - feed
  │   ├── admin.json        (~4 KB) - admin
  │   └── legal.json        (~6 KB) - legal (privacy, terms, cookies)
  ├── pt/
  │   └── ... (same structure)
  ├── es/
  │   └── ... (same structure)
  ├── fr/
  │   └── ... (same structure)
  ├── de/
  │   └── ... (same structure)
  └── it/
      └── ... (same structure)
```

## Implementation Steps

### Step 1: Update `i18n/request.ts`

Replace the current single file import with a dynamic module loader:

```typescript
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import fs from "fs";
import path from "path";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = routing.locales.includes(
    requested as (typeof routing.locales)[number]
  )
    ? (requested as string)
    : routing.defaultLocale;

  // Load all JSON files from the locale folder
  const messagesDir = path.join(process.cwd(), "messages", locale);
  const files = fs
    .readdirSync(messagesDir)
    .filter((file) => file.endsWith(".json"));

  const messages = {};
  for (const file of files) {
    const fileMessages = JSON.parse(
      fs.readFileSync(path.join(messagesDir, file), "utf-8")
    );
    Object.assign(messages, fileMessages);
  }

  return {
    locale,
    messages,
  };
});
```

### Step 2: Split Translation Files

For each language (en, pt, es, fr, de, it), create a folder and split the monolithic JSON into modules:

#### messages/en/common.json

```json
{
  "common": { ... },
  "upload": { ... },
  "sports": { ... }
}
```

#### messages/en/navigation.json

```json
{
  "nav": { ... },
  "footer": { ... }
}
```

... and so on for each module.

### Step 3: Migration Script

Create `scripts/split-translations.ts` to automate the split:

```typescript
import fs from "fs";
import path from "path";

const languages = ["en", "pt", "es", "fr", "de", "it"];

const modules = {
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

for (const lang of languages) {
  const sourceFile = path.join("messages", `${lang}.json`);
  const source = JSON.parse(fs.readFileSync(sourceFile, "utf-8"));

  // Create lang directory
  const langDir = path.join("messages", lang);
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir, { recursive: true });
  }

  // Split into modules
  for (const [moduleName, keys] of Object.entries(modules)) {
    const moduleData = {};
    for (const key of keys) {
      if (source[key]) {
        moduleData[key] = source[key];
      }
    }
    fs.writeFileSync(
      path.join(langDir, `${moduleName}.json`),
      JSON.stringify(moduleData, null, 2),
      "utf-8"
    );
  }

  console.log(`✅ Split ${lang} into ${Object.keys(modules).length} modules`);
}
```

Run with: `pnpm tsx scripts/split-translations.ts`

### Step 4: Verification

After migration:

1. Run `pnpm typecheck` - should pass
2. Run `pnpm build` - should build successfully
3. Test all pages - translations should work exactly as before

### Step 5: Cleanup

After verifying everything works:

```bash
# Backup old files
mkdir messages/backup
mv messages/*.json messages/backup/

# Or delete if confident
rm messages/*.json
```

## Benefits

✅ **Better Organization**: Each module is focused on a specific domain
✅ **Easier Maintenance**: Smaller files are easier to navigate and edit
✅ **Parallel Editing**: Multiple developers can work on different modules
✅ **Better Git Diffs**: Changes are isolated to specific modules
✅ **Faster Loading**: Next.js can potentially optimize module loading
✅ **Clearer Structure**: Domain-driven organization

## Usage (No Changes Required!)

The component usage remains **exactly the same**:

```typescript
const t = useTranslations();

// Works exactly as before
t("events.title");
t("venues.filters.types");
t("common.loading");
```

## Notes

- All translations are merged at runtime, so the API doesn't change
- The modular structure is purely for developer experience
- Existing code requires **zero changes**
- Can be implemented gradually (test with one language first)

## Next Steps

1. Create the migration script
2. Test with English first
3. Verify build and functionality
4. Apply to all languages
5. Delete monolithic files
6. Document in README.md

---

**Decision**: Implement this structure to improve maintainability as the project grows.
