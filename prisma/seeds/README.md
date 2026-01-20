# Event Seeds Directory

This directory contains idempotent seed files for individual events.

## Structure

Each seed file:

- **Name**: `<event-slug>.ts` (e.g., `porto-marathon-2026.ts`)
- **Location**: This directory (`/prisma/seeds/`)
- **Purpose**: Populate or update a single event with all its data

## Requirements

All seed files MUST be:

1. **Idempotent**: Safe to run multiple times without causing duplicates or errors
   - Use `upsert` for events
   - Use `upsert` for translations with composite unique keys
   - **NEVER** use nested `create` operations inside upserts
   - Never use `delete` operations

2. **Complete**: Include all required data
   - Event base data with `imageUrl: ""`
   - Translations in **ALL 6 languages** (pt, en, es, fr, de, it)
   - **European Portuguese (pt-PT)** only - never Brazilian Portuguese
   - Markdown formatting with emojis in descriptions
   - Location data: `latitude`, `longitude`, `googleMapsUrl`
   - Variants (if applicable)
   - Pricing phases (if applicable)

3. **Type-safe**: Use proper TypeScript types from `@prisma/client`

### Language Rules

**Portuguese (pt):**

- Use European Portuguese vocabulary ONLY
- Examples: "ecrã" not "tela", "telemóvel" not "celular"
- Use "tu" instead of "você"

### Content Formatting

**Descriptions must include:**

- Markdown headers (`##`, `###`)
- Bold text (`**text**`)
- Lists (`-`, `1.`)
- Emojis (🏃, 🏆, 🌟, 📅, 📍, 💧, etc.)

### Location Data

**Every event MUST have:**

```typescript
latitude: 38.7223,
longitude: -9.1393,
googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Lisboa+Portugal",
```

### Image URL

**Always set imageUrl to empty string:**

```typescript
imageUrl: "",
```

## Running a Seed

### Local Development

```bash
pnpm tsx prisma/seeds/<event-slug>.ts
```

### Production (GitHub Actions)

1. Update `.github/workflows/manual-seed.yml` with the seed filename as default:
   ```yaml
   seed_file:
     description: "Seed file to run (relative to prisma/seeds)"
     required: true
     default: "<event-slug>.ts" # Your seed filename here
   ```
2. Go to GitHub → Actions
3. Select "Manual Prisma Seed (Shared DB)"
4. Click "Run workflow" (filename is pre-filled)
5. Click "Run workflow" again to execute

## Creating New Seeds

Use the Event Seed Generator Agent:

```
@event-seed-generator Create a seed file for "[Event Name]"
happening on [date]. [Include event details...]
```

The agent will generate a complete seed file following all requirements.

## Notes

- Seed files in the parent `/prisma/` directory (root level) are legacy and should not be used as templates
- Always create new seeds in this `/prisma/seeds/` directory
- Each seed is independent and can be run without affecting other events
- The GitHub Actions workflow ensures safe execution against the shared database

## ✅ Verification Status

**Last Verified:** January 2026

**Total Seed Files:** 28  
**Compliance:** 28/28 (100%) ✅

All seed files in this directory have been verified for:

- ✅ Idempotent structure (separate upserts, no nested creates)
- ✅ All 6 language translations (pt, en, es, fr, de, it)
- ✅ European Portuguese (pt-PT) usage
- ✅ Markdown formatting with emojis
- ✅ Location data (latitude, longitude, googleMapsUrl)
- ✅ Empty imageUrl (`""`)

### Verification Checklist for New Seeds

Before committing a new seed file:

- [ ] File is in `/prisma/seeds/` directory
- [ ] File follows naming: `<event-slug>.ts`
- [ ] Uses idempotent pattern (separate upserts)
- [ ] Has translations in ALL 6 languages
- [ ] Uses European Portuguese (pt-PT)
- [ ] Includes markdown formatting
- [ ] Uses emojis for visual appeal
- [ ] Has latitude, longitude, googleMapsUrl
- [ ] Has `imageUrl: ""`
- [ ] TypeScript compiles: `npx tsc --noEmit prisma/seeds/<file>.ts`
- [ ] Formatted: `npx prettier --write prisma/seeds/<file>.ts`
