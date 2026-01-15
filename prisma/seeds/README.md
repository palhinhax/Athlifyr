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
   - Never use `delete` operations

2. **Complete**: Include all required data
   - Event base data
   - Translations in all 6 languages (pt, en, es, fr, de, it)
   - Variants (if applicable)
   - Pricing phases (if applicable)

3. **Type-safe**: Use proper TypeScript types from `@prisma/client`

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
