# Translation Files Structure

## Overview

Translation files are organized in a **modular structure** for better maintainability and developer experience.

## Structure

```
messages/
  ├── backup/           # Old monolithic files (can be deleted after verification)
  ├── en/              # English translations
  │   ├── common.json       (1.42 KB) - common, upload, sports
  │   ├── navigation.json   (0.84 KB) - nav, footer
  │   ├── home.json         (1.57 KB) - home, promo, notFound
  │   ├── auth.json         (4.64 KB) - settings, profile
  │   ├── events.json       (6.10 KB) - events, eventsPage, map
  │   ├── venues.json       (4.81 KB) - venues
  │   ├── feed.json         (0.53 KB) - feed
  │   ├── admin.json        (4.57 KB) - admin
  │   └── legal.json        (7.95 KB) - legal (privacy, terms, cookies)
  ├── pt/              # Portuguese translations (same structure)
  ├── es/              # Spanish translations (same structure)
  ├── fr/              # French translations (same structure)
  ├── de/              # German translations (same structure)
  └── it/              # Italian translations (same structure)
```

## Module Breakdown

| Module              | Size Range | Contains                           | When to Edit                      |
| ------------------- | ---------- | ---------------------------------- | --------------------------------- |
| **common.json**     | ~1.5 KB    | Common UI elements, upload, sports | Adding new sports, common buttons |
| **navigation.json** | ~0.9 KB    | Navigation, footer                 | Changing nav items, footer links  |
| **home.json**       | ~1.7 KB    | Home page, promo, 404              | Home page content, promo messages |
| **auth.json**       | ~5 KB      | Settings, profile, account         | User settings, profile features   |
| **events.json**     | ~6.5 KB    | Events, filters, map               | Event-related features            |
| **venues.json**     | ~5 KB      | Venues, types, bookings            | Venue-related features            |
| **feed.json**       | ~0.6 KB    | Activity feed                      | Feed-related content              |
| **admin.json**      | ~4.8 KB    | Admin panel                        | Admin features                    |
| **legal.json**      | ~8.5 KB    | Privacy, terms, cookies            | Legal documents                   |

## Benefits

✅ **Smaller Files**: Each module is 0.5-9 KB instead of 33-37 KB monolithic files  
✅ **Better Organization**: Domain-driven structure makes finding translations easier  
✅ **Parallel Editing**: Multiple developers can work on different modules  
✅ **Better Git Diffs**: Changes are isolated to specific modules  
✅ **Faster Navigation**: Easier to find and edit specific translations

## Usage (No Changes Required!)

The component usage remains **exactly the same**:

```typescript
const t = useTranslations();

// Works exactly as before
t("events.title");
t("venues.filters.types");
t("common.loading");
```

All translations are automatically merged at runtime by `i18n/request.ts`.

## Adding New Translations

1. **Identify the module**: Determine which domain the translation belongs to
2. **Edit all 6 languages**: Update the same module in `en/`, `pt/`, `es/`, `fr/`, `de/`, `it/`
3. **Test locally**: Run `pnpm dev` and verify translations appear
4. **Verify build**: Run `pnpm build` to ensure no errors

### Example: Adding a new sport

Edit `common.json` in **all 6 languages**:

```json
{
  "sports": {
    "RUNNING": "Running",
    "TRAIL": "Trail",
    // ... existing sports
    "PADDLE": "Paddle" // ← Add new sport here
  }
}
```

### Example: Adding event filter

Edit `events.json` in **all 6 languages**:

```json
{
  "events": {
    "filters": {
      "title": "Filters",
      "newFilter": "New Filter" // ← Add new filter here
    }
  }
}
```

## Migration

The modular structure was created using `scripts/split-translations.ts`.

**Old Structure (Deprecated):**

```
messages/
  ├── en.json (33 KB)
  ├── pt.json (35 KB)
  └── ...
```

**New Structure (Current):**

```
messages/
  ├── en/
  │   ├── common.json
  │   ├── events.json
  │   └── ...
  └── ...
```

## Backwards Compatibility

The `i18n/request.ts` file supports **both structures**:

- If modular structure exists → load from modules
- If not → fallback to monolithic file

This ensures zero downtime during migration.

## Verification

After migration, all checks passed:

- ✅ TypeScript compilation: No errors
- ✅ Next.js build: Successful
- ✅ All translations loading: Verified
- ✅ No runtime errors: Confirmed

## Cleanup

Old monolithic files are in `messages/backup/`. After verifying everything works in production, you can safely delete the backup folder:

```bash
rm -rf messages/backup/
```

## Script Reference

- **Split translations**: `pnpm tsx scripts/split-translations.ts`
- **Verify build**: `pnpm build`
- **Type check**: `pnpm typecheck`

---

**Last Updated**: January 20, 2026  
**Migration Status**: ✅ Complete and verified
