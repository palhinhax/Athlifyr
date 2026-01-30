# Exercise System - Athlifyr

## Overview

The exercise system in Athlifyr is used for **Performance Tracking** in user profiles. Exercises (`Exercise`) appear in the **"Força"** (Strength) tab of the Performance section.

## Architecture

### Database Models

#### Exercise

Main exercise model stored in the database:

- `id`: Unique identifier
- `name`: Exercise name in **English** (default language)
- `aliases`: Array of English aliases/alternative names
- `category`: Exercise category (CROSSFIT, GYM, WEIGHTLIFTING, BODYWEIGHT, CARDIO, OTHER)
- `isGlobal`: Boolean - true for exercises available to all users
- `createdById`: User who created the exercise (null for global exercises)
- `createdAt` / `updatedAt`: Timestamps

#### ExerciseTranslation (Optional)

Multi-language support for exercises:

- `id`: Unique identifier
- `exerciseId`: Reference to Exercise
- `language`: Language code (pt, en, es, fr, de, it)
- `name`: Translated exercise name
- `aliases`: Array of translated aliases
- `description`: Optional description in this language

### Translation System

**Default Language: English (en)**

Translations are **OPTIONAL**:

- If translation exists for user's locale → show translated name
- If translation doesn't exist → fallback to English name
- This allows flexibility: some exercises can be translated, others can stay in English

## Usage in Application

### Admin Area

Path: `/admin/exercises`

Features:

- ✅ Server-side search (across name, aliases, and translations)
- ✅ Pagination (20 exercises per page)
- ✅ Category filtering
- ✅ Loading states with debounced search (500ms)
- ✅ Multi-language display (shows translation if available, English fallback)

### Performance Tracking

Path: `/profile` → Performance tab → Força (Strength)

Users can:

- Log exercise performance (weight, reps, sets)
- Track progress over time
- View charts and statistics
- Use global exercises OR create custom exercises

## Seeding Exercises

### Run the Seed

```bash
pnpm db:seed:exercises
```

### Seed File Structure

Located at: `prisma/seeds/exercises-seed.ts`

**Categories:**

1. **Squat Variations** (8 exercises)
2. **Deadlift Variations** (5 exercises)
3. **Pressing Movements** (12 exercises)
4. **Olympic Weightlifting** (9 exercises)
5. **CrossFit Specific** (13 exercises)
6. **Pull Movements** (13 exercises)
7. **Core & Gymnastics** (10 exercises)
8. **Push-ups & Dips** (8 exercises)
9. **Lunges & Single Leg** (5 exercises)
10. **Carries & Loaded** (4 exercises)
11. **Cardio Movements** (5 exercises)
12. **Other Movements** (5 exercises)

**Total: ~97 exercises**

### Exercise Format

```typescript
{
  name: "Back Squat",              // English name (required)
  aliases: ["Squat", "BS"],        // English aliases (optional)
  category: "GYM",                 // Category enum
  isGlobal: true                   // Available to all users
}
```

## Adding Translations

### Option 1: Database Seed (Bulk)

Create a new seed file: `prisma/seeds/exercise-translations-pt.ts`

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const translations = [
  {
    exerciseName: "Back Squat",
    language: "pt",
    name: "Agachamento Traseiro",
    aliases: ["Agachamento", "Back Squat"],
  },
  // ... more translations
];

async function seedTranslations() {
  for (const trans of translations) {
    const exercise = await prisma.exercise.findFirst({
      where: { name: trans.exerciseName },
    });

    if (!exercise) continue;

    await prisma.exerciseTranslation.upsert({
      where: {
        exerciseId_language: {
          exerciseId: exercise.id,
          language: trans.language,
        },
      },
      update: {
        name: trans.name,
        aliases: trans.aliases,
      },
      create: {
        exerciseId: exercise.id,
        language: trans.language,
        name: trans.name,
        aliases: trans.aliases,
      },
    });
  }
}
```

### Option 2: Admin UI (Future)

A UI interface can be created for admins to add/edit translations directly in the browser.

## API Endpoints

### GET /api/exercises

**Query Parameters:**

- `search` (string): Search term (searches across name, aliases, translations)
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `category` (string): Filter by category
- `locale` (string): Language code for translations (default: en)

**Response:**

```json
{
  "exercises": [
    {
      "id": "...",
      "name": "Back Squat",
      "aliases": ["Squat", "BS"],
      "category": "GYM",
      "isGlobal": true,
      "translations": [
        {
          "id": "...",
          "language": "pt",
          "name": "Agachamento Traseiro",
          "aliases": ["Agachamento"]
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalCount": 97,
    "totalPages": 5
  }
}
```

## Frontend Components

### ExercisesPageClient

Location: `components/exercises-page-client.tsx`

**Features:**

- Search input with 500ms debounce
- Category filter buttons
- Pagination controls
- Loading states
- Locale-aware display (shows translation if available)

**Helper Functions:**

- `getExerciseName(exercise)`: Returns translated name or English fallback
- `getExerciseAliases(exercise)`: Returns translated aliases or English fallback

## Migration Required

To use the translation system, you need to create and run a Prisma migration:

```bash
pnpm db:migrate
```

This will create the `ExerciseTranslation` table with the proper foreign keys and indexes.

## Best Practices

1. **Always use English as default**: Ensures consistency and reduces translation dependencies
2. **Translations are optional**: Not all exercises need translations immediately
3. **Use aliases**: Helps with search and user convenience
4. **Keep categories consistent**: Use the defined ExerciseCategory enum
5. **Global exercises**: Mark common exercises as `isGlobal: true`
6. **Custom exercises**: Users can create their own exercises (isGlobal: false)

## Future Enhancements

- [ ] Admin UI for managing translations
- [ ] Bulk import/export of exercises
- [ ] Exercise images/videos
- [ ] Muscle group tagging
- [ ] Equipment requirements
- [ ] Difficulty levels
- [ ] Alternative exercises suggestions
