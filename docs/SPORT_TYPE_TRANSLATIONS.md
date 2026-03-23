# Sport Type Translations

## ⚠️ IMPORTANT: Never Hardcode Sport Labels

Sport type labels **MUST** always use the i18n translation system. Never hardcode labels in Portuguese or any other language.

## ✅ Correct Usage

### In Server Components (with locale)

```typescript
import { getTranslations } from "next-intl/server";

async function MyComponent({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "common" });

  const sportLabel = t(`sports.${sportType}`); // e.g., t("sports.RUNNING")
}
```

### In Client Components (with useTranslations hook)

```typescript
"use client";
import { useTranslations } from "next-intl";

function MyComponent() {
  const t = useTranslations("common");

  const sportLabel = t(`sports.${sportType}`); // e.g., t("sports.RUNNING")
}
```

### In Utility Functions (use locale parameter)

```typescript
import { getTranslations } from "next-intl/server";

export async function getSportLabel(
  sportType: SportType,
  locale: string = "pt"
): Promise<string> {
  const t = await getTranslations({ locale, namespace: "common" });
  return t(`sports.${sportType}`);
}
```

## 📋 Available Sport Types

All sport types are defined in `messages/*/common.json` under the `sports` key:

| Sport Type  | PT             | EN             | ES             | FR             | DE             | IT             |
| ----------- | -------------- | -------------- | -------------- | -------------- | -------------- | -------------- |
| `RUNNING`   | Corrida        | Running        | Running        | Course         | Laufen         | Corsa          |
| `TRAIL`     | Trail          | Trail          | Trail          | Trail          | Trail          | Trail          |
| `WALKING`   | Caminhada      | Walking        | Caminata       | Marche         | Wandern        | Camminata      |
| `HYROX`     | HYROX          | HYROX          | HYROX          | HYROX          | HYROX          | HYROX          |
| `CROSSFIT`  | Cross Training | Cross Training | Cross Training | Cross Training | Cross Training | Cross Training |
| `OCR`       | OCR            | OCR            | OCR            | OCR            | OCR            | OCR            |
| `BTT`       | BTT            | Mountain Bike  | Mountain Bike  | VTT            | MTB            | Mountain Bike  |
| `CYCLING`   | Ciclismo       | Cycling        | Ciclismo       | Cyclisme       | Radfahren      | Ciclismo       |
| `SURF`      | Surf           | Surf           | Surf           | Surf           | Surfen         | Surf           |
| `TRIATHLON` | Triatlo        | Triathlon      | Triatlón       | Triathlon      | Triathlon      | Triathlon      |
| `DUATHLON`  | Duatlo         | Duathlon       | Duatlón        | Duathlon       | Duathlon       | Duathlon       |
| `AQUATHLON` | Aquatlo        | Aquathlon      | Acuatlón       | Aquathlon      | Aquathlon      | Aquathlon      |
| `SWIMMING`  | Natação        | Swimming       | Natación       | Natation       | Schwimmen      | Nuoto          |
| `OTHER`     | Outros         | Other          | Otro           | Autres         | Andere         | Altri          |

## 🚫 What NOT to Do

### ❌ Bad: Hardcoded Labels

```typescript
// DON'T DO THIS
export const sportTypeLabels: Record<SportType, string> = {
  RUNNING: "Corrida",
  TRAIL: "Trail",
  // ...
};
```

### ❌ Bad: Using Labels Without Locale

```typescript
// DON'T DO THIS
const label = sportTypeLabels[sportType]; // Always in Portuguese!
```

## ✅ What TO Do

### ✅ Good: Using i18n Translations

```typescript
// Client Component
"use client";
import { useTranslations } from "next-intl";

function EventCard({ sportType }: { sportType: SportType }) {
  const t = useTranslations("common");

  return <div>{t(`sports.${sportType}`)}</div>;
}
```

```typescript
// Server Component
import { getTranslations } from "next-intl/server";

async function EventCard({
  sportType,
  locale
}: {
  sportType: SportType;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "common" });

  return <div>{t(`sports.${sportType}`)}</div>;
}
```

## 🔧 Adding New Sport Types

When adding a new sport type:

1. **Update Prisma Schema** (`prisma/schema.prisma`):

   ```prisma
   enum SportType {
     RUNNING
     TRAIL
     NEW_SPORT // Add here
     // ...
   }
   ```

2. **Add Translations in ALL 6 Languages**:
   - `messages/pt/common.json`
   - `messages/en/common.json`
   - `messages/es/common.json`
   - `messages/fr/common.json`
   - `messages/de/common.json`
   - `messages/it/common.json`

   ```json
   {
     "sports": {
       "RUNNING": "...",
       "NEW_SPORT": "Translated Name"
     }
   }
   ```

3. **Add Icon** (if needed) in `event-utils.ts`:

   ```typescript
   export const sportTypeIcons: Record<SportType, string> = {
     RUNNING: "🏃",
     NEW_SPORT: "🎯", // Add emoji icon
     // ...
   };
   ```

4. **Run Database Migration**:
   ```bash
   npx prisma migrate dev --name add-new-sport-type
   ```

## 📝 Translation Files Location

```
messages/
├── pt/common.json    # Portuguese (Portugal)
├── en/common.json    # English
├── es/common.json    # Spanish
├── fr/common.json    # French
├── de/common.json    # German
└── it/common.json    # Italian
```

## 🌍 Supported Languages

This project supports **6 languages**:

1. **Portuguese (pt)** - pt-PT (European Portuguese)
2. **English (en)** - en-US
3. **Spanish (es)** - es-ES
4. **French (fr)** - fr-FR
5. **German (de)** - de-DE
6. **Italian (it)** - it-IT

**CRITICAL**: All user-facing text MUST be translated to ALL 6 languages.

## 🔍 Finding Usages

To find where sport types are used:

```bash
# Search for hardcoded sport labels
grep -r "sportTypeLabels" .

# Search for sport type translations
grep -r "sports\." . --include="*.tsx" --include="*.ts"
```

## ✅ Checklist Before Committing

- [ ] No hardcoded sport labels in code
- [ ] All sport types have translations in ALL 6 languages
- [ ] Components use `useTranslations` or `getTranslations`
- [ ] Sport icons are defined (if applicable)
- [ ] Database migrations completed (if schema changed)

---

**Remember**: Internationalization is a core requirement. Always use the translation system!
