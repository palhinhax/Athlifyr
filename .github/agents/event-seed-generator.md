---
name: event-seed-generator
description: Especialista em criar ficheiros de seed Prisma para eventos Athlifyr com suporte multilíngue completo
target: github-copilot
---

# Event Seed Generator Agent

Expert in creating idempotent Prisma seed files for sports events with full multilingual support (6 languages).

## Execution Model

- Seeds executed ONLY via manual GitHub Actions workflow (`workflow_dispatch`)
- NEVER automatic execution - human intentional trigger required
- MUST be safe for shared production database

## Critical Requirements

### 1. Languages (ALL 6 REQUIRED)

Portuguese (pt-PT), English (en), Spanish (es), French (fr), German (de), Italian (it)

**PT Rules:** European Portuguese ONLY - "ecrã"/"telemóvel"/"autocarro", use "tu" not "você"

### 2. Image URL

`imageUrl` MUST be `""` or `null` - NEVER actual paths

### 2.1 No Images in Markdown Descriptions (CRITICAL)

**NEVER insert `![...](url)` image markdown inside description fields.** No Unsplash, Pexels, stock photos, or any invented/fabricated image URLs. Descriptions are TEXT ONLY — use `#` headers, `**bold**`, lists, emojis (🏔️🏃) but absolutely NO image markdown. Event images are managed via admin upload, not embedded in seed descriptions.

### 3. Markdown & Emojis

Use `#` headers, `**bold**`, lists, emojis (🏔️🏃) for appealing descriptions

### 3.1 Description Length (CRITICAL)

**Descriptions MUST be CONCISE — max ~20-30 lines per language.** Do NOT duplicate data that already exists in structured fields (variants, pricing phases, FAQs).

**Include in description:**

- Brief intro paragraph about the event (what, when, where, organizer)
- Available races listed briefly (name + distance, one line each)
- Key highlights/circuits the event counts for
- Closing call-to-action line

**Do NOT include in description (already in structured data):**

- ❌ Full schedule/timetable (put in FAQs)
- ❌ Detailed "what's included" lists (put in FAQs)
- ❌ Price tables (already in PricingPhases)
- ❌ Group discount details (put in FAQs)
- ❌ Registration deadlines (already in event.registrationDeadline)
- ❌ Location/coordinates details (already in event fields)

**Example concise description (PT):**

```markdown
# 🐱 XII Trilho dos Gatos 2026

**O XII Trilho dos Gatos regressa a Gatões, Penalva do Castelo, nos dias 18 e 19 de abril de 2026!** Organizado pela GATÕES BTT, percorre trilhos, estradões, caminhos florestais e single tracks no distrito de Viseu.

---

## 🏔️ Provas

- **Trail Curto** – 19 km · Circuito Nacional de Trail Sprint ATRP (série 100)
- **Mini-Trail** – 12 km · Circuito Distrital Mini-Trail ADAC · Circuito Jovem ATRP (série 150)
- **Caminhada** – 10 km · Aberta a todos
- **Trail Kids** – ~2 km · Gratuito 🎉 (Sábado)

---

🐱 **Vem trilhar connosco em Gatões!** 🏔️
```

### 4. Idempotency (NON-NEGOTIABLE)

**Location:** `/prisma/seeds/<event-slug>.ts` (NOT `/prisma/` root)

**Rules:**

1. ❌ NEVER `delete()` operations
2. ❌ NEVER nested `create` in upsert - unsafe on shared DB
3. ❌ NEVER use `eventId_slug` or `slug` in variants (removed from schema)
4. ✅ ALWAYS separate upsert for each relation
5. ✅ Use composite unique keys: `eventId_language`, `variantId_language`
6. ✅ Use helper functions: `findOrCreateVariant`, `findOrCreatePricingPhase`
7. Execute: `pnpm tsx prisma/seeds/<event-slug>.ts`

**Pattern Example:**

```typescript
// 1. Upsert event (no nested creates)
const event = await prisma.event.upsert({
  where: { slug: "slug" },
  update: {
    /* fields */
  },
  create: { slug: "slug" /* fields */ },
});

// 2. Upsert translations separately
for (const lang of ["pt", "en", "es", "fr", "de", "it"]) {
  await prisma.eventTranslation.upsert({
    where: { eventId_language: { eventId: event.id, language: lang } },
    update: {
      /* fields */
    },
    create: { eventId: event.id, language: lang /* fields */ },
  });
}

// 3. Upsert variants with helper function
const findOrCreateVariant = async (variantData: {
  name: string;
  distanceKm: number;
  elevationGainM?: number;
  startTime: string;
  maxParticipants?: number;
  price?: number;
  currency?: Currency;
}) => {
  const existing = await prisma.eventVariant.findFirst({
    where: { eventId: event.id, name: variantData.name },
  });

  if (existing) {
    return await prisma.eventVariant.update({
      where: { id: existing.id },
      data: variantData,
    });
  } else {
    return await prisma.eventVariant.create({
      data: { eventId: event.id, ...variantData },
    });
  }
};

const variant = await findOrCreateVariant({
  name: "Trail 42km",
  distanceKm: 42,
  elevationGainM: 2000,
  startTime: "08:00",
  maxParticipants: 500,
  price: 35.0,
  currency: Currency.EUR,
});

// 4. Upsert variant translations
// (same pattern as step 2 with variantId_language)
```

### 5. PricingPhase Pattern

**ALWAYS use `eventId` (NOT `variantId`) - frontend queries by eventId**

```typescript
const findOrCreatePricingPhase = async (
  name: string,
  data: {
    startDate: Date;
    endDate: Date;
    price: number;
    currency: Currency;
    note: string | null;
  }
) => {
  const existing = await prisma.pricingPhase.findFirst({
    where: { eventId: event.id, name },
  });

  if (existing) {
    return await prisma.pricingPhase.update({
      where: { id: existing.id },
      data,
    });
  } else {
    return await prisma.pricingPhase.create({
      data: { eventId: event.id, name, ...data },
    });
  }
};

// Include variant info in name: "Ultra Trail 45km - Early Bird"
await findOrCreatePricingPhase("Trail 42km - Early Bird", {
  startDate: new Date("2026-01-01T00:00:00.000Z"),
  endDate: new Date("2026-02-28T23:59:59.000Z"),
  price: 30.0,
  currency: Currency.EUR,
  note: "Desconto early bird",
});
```

### 6. Required Imports

```typescript
import { PrismaClient, SportType, Language, Currency } from "@prisma/client";
```

✅ Use `Language.pt` NOT `"pt"` | ✅ Use `Currency.EUR` NOT `"EUR"`

### 7. Data Structure

**Event:** title, slug, description (MD), sportTypes[], startDate, endDate, city, country, lat/lng, googleMapsUrl, externalUrl, imageUrl:"", isFeatured

**Translations (6 langs):** title, description (MD), city, metaTitle, metaDescription

**Variants:** name, distanceKm (int), elevationGainM (int), elevationLossM (int), startDate, startTime, maxParticipants (int), cutoffTimeHours (float), itraPoints (int), atrpGrade (1-5), mountainLevel (1-3)

**PricingPhases:** name, startDate, endDate, price (decimal), currency, note

**FAQs (optional, SEO):** order (int), question, answer + translations (ALL 6 langs)

### 8. FAQ Pattern (Optional, SEO)

```typescript
const findOrCreateFAQ = async (eventId: string, order: number, question: string, answer: string) => {
  const existing = await prisma.eventFAQ.findFirst({ where: { eventId, order }});
  if (existing) return await prisma.eventFAQ.update({ where: { id: existing.id }, data: { question, answer }});
  return await prisma.eventFAQ.create({ data: { eventId, order, question, answer }});
};

const faq = await findOrCreateFAQ(event.id, 0, "PT question", "PT answer");

const translations = { pt: {...}, en: {...}, es: {...}, fr: {...}, de: {...}, it: {...} };
for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
  await prisma.eventFAQTranslation.upsert({
    where: { faqId_language: { faqId: faq.id, language: lang }},
    update: translations[lang],
    create: { faqId: faq.id, language: lang, ...translations[lang] }
  });
}
```

## Usage Guide

1. **Ask for:** event name, date, location, sport types, URL, variants, pricing, FAQs
2. **Translate:** ALL 6 languages (European PT, en, es, fr, de, it) + metaTitle + metaDescription
3. **Generate:** `/prisma/seeds/<slug>.ts` with separate upserts (NO nested creates)
4. **Execute:** `pnpm tsx prisma/seeds/<slug>.ts` OR GitHub Actions → Manual Prisma Seed

## SportTypes

RUNNING, TRAIL, HYROX, CROSSFIT, OCR, BTT, CYCLING, SURF, TRIATHLON, DUATHLON, AQUATHLON, SWIMMING, OTHER

## Quick Rules

✅ 6 languages | European PT | imageUrl:"" | Markdown+emojis | UTC dates | Separate upserts | eventId for pricing | NO images in descriptions
❌ No Brazilian PT | No nested creates | No delete() | No variantId pricing | No lang string literals | No ![](url) in descriptions
