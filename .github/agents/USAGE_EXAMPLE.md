# Event Seed Generator Agent - Usage Example

This document demonstrates how to use the Event Seed Generator Agent to create new event seed files.

## Quick Start

The Event Seed Generator Agent is a specialized GitHub Copilot agent that creates complete Prisma seed files for sports events with full multilingual support.

## Example: Creating a New Event

### Step 1: Provide Event Information

When you need to create a new event, provide the agent with as much information as possible:

```
@event-seed-generator Create a seed file for "Cascais Ocean Trail 2026"

Event Details:
- Name: Cascais Ocean Trail 2026
- Date: March 15, 2026, starting at 09:00
- Location: Cascais, Portugal (38.6979° N, 9.4215° W)
- Sport type: TRAIL
- Website: https://www.cascaistrail.com
- Featured event: Yes

Variants:
1. Long Trail - 50km
   - Elevation gain: 1200m
   - Start time: 09:00
   - Max participants: 500
   
2. Short Trail - 25km  
   - Elevation gain: 600m
   - Start time: 10:00
   - Max participants: 800

Pricing:
- Early Bird (Jan 1 - Feb 15): €45
- Normal (Feb 16 - Mar 10): €55
- Late (Mar 11 - Mar 14): €65

Description: A scenic coastal trail run along the beautiful Cascais 
coastline, featuring stunning ocean views and challenging terrain. 
The route combines coastal paths, forest trails, and historic sites.
```

### Step 2: Agent Generates the Seed File

The agent will create a complete TypeScript seed file at:
```
/prisma/seed-cascais-ocean-trail.ts
```

### Step 3: Review and Run

1. **Review the generated file** - check all translations and data
2. **Run the seed file**:
   ```bash
   npx tsx prisma/seed-cascais-ocean-trail.ts
   ```

## What the Agent Does

### ✅ Automatic Features

1. **Multi-language Support**
   - Generates translations in all 6 languages: pt, en, es, fr, de, it
   - Ensures Portuguese is European Portuguese (pt-PT)
   - Translates event title, description, city name, and meta tags

2. **Data Structure**
   - Creates event base data with all required fields
   - Generates variants with their own translations
   - Sets up pricing phases
   - Includes SEO meta tags

3. **Code Quality**
   - Proper TypeScript types
   - Error handling
   - Deletion logic for existing events
   - Console logging for feedback

4. **Validations**
   - Empty imageUrl (as required)
   - Valid SportType enum values
   - Proper date formatting (ISO 8601)
   - Unique slug generation

## Information Required

### Minimum Information

- Event name
- Event date
- Location (city, country)
- Sport type

### Recommended Additional Information

- Start time
- GPS coordinates
- Official website URL
- Event description
- Whether it's a featured event
- Registration deadline

### For Events with Variants

- Variant names and distances
- Elevation data (for trail running)
- Start times per variant
- Max participants per variant
- ITRA points (for trail events)

### For Events with Pricing

- Phase names and dates
- Prices per phase
- Any discount information

## Example Output Structure

The generated seed file will have this structure:

```typescript
/**
 * Seed Cascais Ocean Trail 2026
 * Complete with translations in all 6 languages
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Cascais Ocean Trail 2026...");

  // Delete existing event if it exists
  const existingEvent = await prisma.event.findUnique({
    where: { slug: "cascais-ocean-trail-2026" },
  });

  if (existingEvent) {
    console.log("🗑️  Deleting existing event...");
    await prisma.event.delete({
      where: { slug: "cascais-ocean-trail-2026" },
    });
  }

  const event = await prisma.event.create({
    data: {
      // Base event data
      title: "Cascais Ocean Trail 2026",
      slug: "cascais-ocean-trail-2026",
      description: `Markdown description in Portuguese...`,
      sportTypes: ["TRAIL"],
      startDate: new Date("2026-03-15T09:00:00Z"),
      endDate: null,
      city: "Cascais",
      country: "Portugal",
      latitude: 38.6979,
      longitude: -9.4215,
      googleMapsUrl: "https://maps.app.goo.gl/...",
      externalUrl: "https://www.cascaistrail.com",
      imageUrl: "", // Always empty
      isFeatured: true,

      // Translations for all 6 languages
      translations: {
        create: [
          // Portuguese, English, Spanish, French, German, Italian
          // Each with title, description, city, metaTitle, metaDescription
        ],
      },

      // Variants
      variants: {
        create: [
          // Long Trail (50km)
          // Short Trail (25km)
          // Each with translations in all 6 languages
        ],
      },

      // Pricing phases
      pricingPhases: {
        create: [
          // Early Bird, Normal, Late pricing
        ],
      },
    },
  });

  console.log("✅ Cascais Ocean Trail 2026 created with ID:", event.id);
  console.log("📝 Translations created for 6 languages");
  console.log("🏃 2 variants created: Long Trail (50km), Short Trail (25km)");
  console.log("💰 3 pricing phases");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

## Tips for Best Results

### 1. Be Specific
Provide as much detail as possible in your initial request.

### 2. Structured Format
Use a clear structure like:
```
Event Details:
- Field: Value
- Field: Value

Variants:
1. Name - details
2. Name - details

Pricing:
- Phase: dates and price
```

### 3. Check Coordinates
Ensure GPS coordinates are accurate for map display.

### 4. Verify Translations
While the agent generates translations, always review them for accuracy, especially technical terms and place names.

### 5. SportType Values
Use valid enum values:
- RUNNING, TRAIL, HYROX, CROSSFIT, OCR
- BTT, CYCLING, SURF, TRIATHLON, SWIMMING, OTHER

## Common Scenarios

### Simple Running Event
```
@event-seed-generator Create a seed for "5K City Run 2026" 
on April 20, 2026 in Porto. Simple 5km running race, no variants.
```

### Multi-Distance Event
```
@event-seed-generator Create seed for "Marathon Weekend 2026"
with three variants: Full Marathon (42km), Half Marathon (21km), 
and 10K run. Each starts at different times.
```

### Trail Event with Technical Data
```
@event-seed-generator Create trail race seed with ITRA points, 
elevation data, and mountain level classification.
```

## Validation Checklist

After the agent generates the file, verify:

- [ ] All 6 languages present (pt, en, es, fr, de, it)
- [ ] Portuguese is European Portuguese
- [ ] imageUrl is empty or null
- [ ] Dates in ISO 8601 format
- [ ] Slug is unique and lowercase with hyphens
- [ ] SportType values are valid enum values
- [ ] Coordinates are decimal degrees
- [ ] Each variant has translations in all 6 languages
- [ ] Console logs are informative
- [ ] Error handling is present

## Troubleshooting

### Agent asks for more information
Provide the requested details - the agent needs complete information to generate accurate seed files.

### Translations seem incorrect
You can ask the agent to revise specific translations:
```
@event-seed-generator The German translation needs adjustment. 
Please use "Strecke" instead of "Route" for the course description.
```

### Need to add more variants
Ask the agent to update the file:
```
@event-seed-generator Add a third variant "Ultra Trail 75km" 
with 2000m elevation gain to the existing seed file.
```

## Running the Seed File

Once you're satisfied with the generated seed file:

```bash
# Run individual seed file
npx tsx prisma/seed-cascais-ocean-trail.ts

# Or run all seeds (if configured in package.json)
npm run db:seed
```

## Additional Resources

- [Prisma Schema](../../prisma/schema.prisma) - Database schema reference
- [Existing Seeds](../../prisma/) - Examples of existing seed files
- [Agent Instructions](./event-seed-generator.md) - Full agent documentation

---

**Remember:** Always review generated code before committing to ensure accuracy and quality!
