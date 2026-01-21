# Ragnar Trail Appalachians 2026 Seed

This seed file creates the **Ragnar Trail Appalachians Team Races 2026** event with complete multilingual support.

## Event Details

- **Event Name:** Ragnar Trail Appalachians Team Races
- **Date:** August 7-8, 2026 (2 days, 1 night)
- **Location:** Big Bear Camplands, Bruceton Mills, WV, USA
- **Sport Type:** Trail Running
- **Total Distance:** 117 miles (188 km)
- **Elevation Gain:** 427 feet (130 meters)
- **External URL:** https://www.runragnar.com/event-detail/trail/trail_appalachians

## Team Variants

### 1. Standard Team
- **Runners:** 8
- **Miles per Runner:** ~14.6 miles
- **Duration:** 2 days, 1 night
- **Pricing:**
  - Early Bird (Sep 1, 2025 - Dec 31, 2025): $1,345 (10% off)
  - Regular (Jan 1, 2026 - Jun 30, 2026): $1,495
  - Late Registration (Jul 1, 2026 - Aug 6, 2026): $1,645

### 2. Ultra Team
- **Runners:** 4
- **Miles per Runner:** ~29.25 miles
- **Duration:** 2 days, 1 night
- **Pricing:**
  - Early Bird (Sep 1, 2025 - Dec 31, 2025): $765 (10% off)
  - Regular (Jan 1, 2026 - Jun 30, 2026): $850
  - Late Registration (Jul 1, 2026 - Aug 6, 2026): $935

### 3. Black Loop
- **Runners:** 2
- **Miles per Runner:** ~58.5 miles
- **Duration:** 2 days, 1 night
- **Pricing:**
  - Early Bird (Sep 1, 2025 - Dec 31, 2025): $382.50 (10% off)
  - Regular (Jan 1, 2026 - Jun 30, 2026): $425
  - Late Registration (Jul 1, 2026 - Aug 6, 2026): $467.50

## Features Included

✅ **Multilingual Support:** All 6 languages (pt, en, es, fr, de, it)
✅ **SEO Metadata:** metaTitle and metaDescription for all languages
✅ **Markdown Content:** Rich descriptions with emojis and formatting
✅ **Idempotent:** Safe to run multiple times
✅ **Pricing Phases:** 9 total phases (3 per variant)
✅ **Variant Translations:** Complete translations for all team types

## What's Included in the Event

- Partner samples
- Captain's gift
- Team medals
- Team finisher shirts
- Ragnar Village activities
- Bonfires and s'mores
- Live music on Thursday night
- Glamping available
- Onsite showers
- Food trucks

## How to Run the Seed

### Option 1: Local Execution

```bash
pnpm tsx prisma/seeds/08-agosto/ragnar-trail-appalachians-2026.ts
```

### Option 2: GitHub Actions (Manual Workflow)

1. Go to the repository on GitHub
2. Navigate to **Actions** → **"Manual Prisma Seed (Shared DB)"**
3. Click **"Run workflow"**
4. Enter the seed file name: `08-agosto/ragnar-trail-appalachians-2026.ts`
5. Click **"Run workflow"** to execute

### Option 3: One-Click Execution (Optional)

To enable one-click execution in GitHub Actions:

1. Edit `.github/workflows/manual-seed.yml`
2. Update the `default` value in the `seed_file` input:
   ```yaml
   seed_file:
     description: "Seed file to run (relative to prisma/seeds)"
     required: true
     default: "08-agosto/ragnar-trail-appalachians-2026.ts"
   ```
3. After this change, the filename will be pre-filled in the Actions UI

## Technical Details

- **File Size:** 924 lines
- **Slug:** `ragnar-trail-appalachians-2026`
- **Event ID:** Generated automatically by the database
- **Pricing Linked To:** `eventId` (NOT `variantId`) for proper frontend display
- **Currency:** USD
- **Featured Event:** Yes

## Verification Checklist

After running the seed, verify:

- [ ] Event appears in the events list
- [ ] All 6 language translations are present
- [ ] SEO metadata is complete (metaTitle, metaDescription)
- [ ] All 3 variants are visible (Standard Team, Ultra Team, Black Loop)
- [ ] Pricing phases display correctly on the frontend
- [ ] Event coordinates show correct location on map
- [ ] External link works correctly

## Notes

- This seed follows the idempotent pattern and can be run multiple times safely
- Pricing phases are linked to `eventId` as required by the frontend
- All translations use European Portuguese (pt-PT), not Brazilian Portuguese
- The seed includes no actual image URLs (imageUrl is empty as per requirements)

## Contact

For questions or issues with this seed file, please contact the development team.
