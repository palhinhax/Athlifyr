import { PrismaClient, SportType, Language } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Trail Santa Iria 2026...");

  // Event data (used in both update and create)
  const eventData = {
    title: "Trail Santa Iria 2026",
    sportTypes: [SportType.TRAIL],
    startDate: new Date("2026-02-01T09:00:00.000Z"),
    registrationDeadline: new Date("2026-01-26T23:59:00.000Z"),
    city: "Gondomar",
    country: "Portugal",
    description: `# Trail Santa Iria 2026

**Trail Running Event in Gondomar, Portugal**

## 🏃 Sobre o Evento

O **Trail Santa Iria 2026** é uma prova de trail running organizada pela **StopAndGo** que terá lugar em Gondomar, Portugal, no dia 1 de fevereiro de 2026.

O evento oferece três distâncias diferentes para corredores de todos os níveis, desde atletas experientes até caminhantes que procuram desfrutar das paisagens naturais da região.

## 🏃 Provas Disponíveis

### 23KM Trail
- **Distância:** 23 km
- **Perfil:** Trail de média/longa distância
- **Nível:** Intermédio a avançado

### 13KM Trail
- **Distância:** 13 km
- **Perfil:** Trail de curta/média distância
- **Nível:** Iniciado a intermédio

### Caminhada 10KM
- **Distância:** 10 km
- **Perfil:** Caminhada não competitiva
- **Nível:** Todos os níveis

## 📍 Local

**Gondomar, Portugal**

A região de Gondomar oferece trilhos e caminhos ideais para a prática de trail running, com paisagens naturais e percursos variados.

## 📅 Quando

**Data:** 1 de fevereiro de 2026

## 📝 Inscrições

As inscrições decorrem em 3 fases com diferentes preços:

### 1ª Fase (19 Nov 2025 - 31 Dez 2025)
- 23KM: €19.00
- 13KM: €14.00
- Caminhada 10KM: €10.00

### 2ª Fase (1 Jan 2026 - 18 Jan 2026)
- 23KM: €21.00
- 13KM: €16.00
- Caminhada 10KM: €10.00

### 3ª Fase (19 Jan 2026 - 26 Jan 2026)
- 23KM: €25.00
- 13KM: €21.00
- Caminhada 10KM: €10.00

**Fim das Inscrições:** 26 de janeiro de 2026 às 23:59

## 🎽 Extras

- **T-Shirt** do evento (opcional)

## 👥 Organização

**Organizador Principal:**
- **StopAndGo** - Gestão de eventos desportivos

## 📞 Contactos

**Website e Inscrições:**
- [stopandgo.net](https://stopandgo.net/events/trail-santa-iria-2026/registrations/create)

## 📋 Informações Importantes

⚠️ **A inscrição implica total aceitação do regulamento da prova.**

Para mais informações, consulte o site oficial do evento ou contacte a organização.

---

**© 2026 StopAndGo. Todos os direitos reservados.**`,
    externalUrl:
      "https://stopandgo.net/events/trail-santa-iria-2026/registrations/create",
    imageUrl: "",
    latitude: 41.1435,
    longitude: -8.5378,
    googleMapsUrl: "https://maps.app.goo.gl/QSxvZYCVxHqJmhYX7",
  };

  // Step 1: Upsert the event (no nested relations)
  const event = await prisma.event.upsert({
    where: { slug: "trail-santa-iria-2026" },
    update: eventData,
    create: {
      ...eventData,
      slug: "trail-santa-iria-2026",
    },
  });

  console.log(`✅ Event upserted: ${event.title} (${event.id})`);

  // Step 2: Upsert translations for all 6 languages
  const translations = {
    pt: {
      title: "Trail Santa Iria 2026",
      description: `Prova de trail running em Gondomar com 3 distâncias: 23KM, 13KM e Caminhada 10KM. Organizada pela StopAndGo em 1 de fevereiro de 2026.`,
      city: "Gondomar",
      metaTitle: "Trail Santa Iria 2026 - Gondomar, Portugal",
      metaDescription:
        "Participe no Trail Santa Iria 2026 em Gondomar. 3 distâncias disponíveis: 23KM, 13KM e Caminhada 10KM. Inscrições abertas até 26 de janeiro de 2026.",
    },
    en: {
      title: "Trail Santa Iria 2026",
      description: `Trail running event in Gondomar with 3 distances: 23KM, 13KM and 10KM Walk. Organized by StopAndGo on February 1, 2026.`,
      city: "Gondomar",
      metaTitle: "Trail Santa Iria 2026 - Gondomar, Portugal",
      metaDescription:
        "Join the Trail Santa Iria 2026 in Gondomar. 3 distances available: 23KM, 13KM and 10KM Walk. Registration open until January 26, 2026.",
    },
    es: {
      title: "Trail Santa Iria 2026",
      description: `Carrera de trail running en Gondomar con 3 distancias: 23KM, 13KM y Caminata 10KM. Organizada por StopAndGo el 1 de febrero de 2026.`,
      city: "Gondomar",
      metaTitle: "Trail Santa Iria 2026 - Gondomar, Portugal",
      metaDescription:
        "Participa en el Trail Santa Iria 2026 en Gondomar. 3 distancias disponibles: 23KM, 13KM y Caminata 10KM. Inscripciones abiertas hasta el 26 de enero de 2026.",
    },
    fr: {
      title: "Trail Santa Iria 2026",
      description: `Course de trail running à Gondomar avec 3 distances : 23KM, 13KM et Marche 10KM. Organisée par StopAndGo le 1er février 2026.`,
      city: "Gondomar",
      metaTitle: "Trail Santa Iria 2026 - Gondomar, Portugal",
      metaDescription:
        "Participez au Trail Santa Iria 2026 à Gondomar. 3 distances disponibles : 23KM, 13KM et Marche 10KM. Inscriptions ouvertes jusqu'au 26 janvier 2026.",
    },
    de: {
      title: "Trail Santa Iria 2026",
      description: `Trail-Running-Veranstaltung in Gondomar mit 3 Distanzen: 23KM, 13KM und 10KM Wanderung. Organisiert von StopAndGo am 1. Februar 2026.`,
      city: "Gondomar",
      metaTitle: "Trail Santa Iria 2026 - Gondomar, Portugal",
      metaDescription:
        "Nehmen Sie am Trail Santa Iria 2026 in Gondomar teil. 3 Distanzen verfügbar: 23KM, 13KM und 10KM Wanderung. Anmeldung bis 26. Januar 2026 möglich.",
    },
    it: {
      title: "Trail Santa Iria 2026",
      description: `Gara di trail running a Gondomar con 3 distanze: 23KM, 13KM e Camminata 10KM. Organizzata da StopAndGo il 1° febbraio 2026.`,
      city: "Gondomar",
      metaTitle: "Trail Santa Iria 2026 - Gondomar, Portogallo",
      metaDescription:
        "Partecipa al Trail Santa Iria 2026 a Gondomar. 3 distanze disponibili: 23KM, 13KM e Camminata 10KM. Iscrizioni aperte fino al 26 gennaio 2026.",
    },
  };

  for (const [lang, content] of Object.entries(translations)) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: lang as Language,
        },
      },
      update: content,
      create: {
        eventId: event.id,
        language: lang as Language,
        ...content,
      },
    });
    console.log(`   ✅ Translation upserted: ${lang}`);
  }

  // Step 3: Upsert variants separately (no nested creates)
  const variants = [
    {
      name: "23KM Trail",
      distanceKm: 23,
      description: "Trail de média/longa distância - 23 km",
      startDate: new Date("2026-02-01T09:00:00.000Z"),
    },
    {
      name: "13KM Trail",
      distanceKm: 13,
      description: "Trail de curta/média distância - 13 km",
      startDate: new Date("2026-02-01T09:30:00.000Z"),
    },
    {
      name: "Caminhada 10KM",
      distanceKm: 10,
      description: "Caminhada não competitiva - 10 km",
      startDate: new Date("2026-02-01T10:00:00.000Z"),
    },
  ];

  const variantIds: { [key: string]: string } = {};

  for (const variantData of variants) {
    // Note: EventVariant doesn't have a slug field and no unique constraint on [eventId, name]
    // We'll use findFirst + create or update pattern
    const existingVariant = await prisma.eventVariant.findFirst({
      where: {
        eventId: event.id,
        name: variantData.name,
      },
    });

    let variant;
    if (existingVariant) {
      variant = await prisma.eventVariant.update({
        where: { id: existingVariant.id },
        data: variantData,
      });
    } else {
      variant = await prisma.eventVariant.create({
        data: {
          ...variantData,
          eventId: event.id,
        },
      });
    }

    variantIds[variantData.name] = variant.id;
    console.log(`   ✅ Variant upserted: ${variant.name} (${variant.id})`);
  }

  // Step 4: Upsert variant translations
  const variantTranslations = {
    "23KM Trail": {
      pt: {
        name: "23KM Trail",
        description: "Trail de média/longa distância - 23 km",
      },
      en: {
        name: "23KM Trail",
        description: "Medium/long distance trail - 23 km",
      },
      es: {
        name: "23KM Trail",
        description: "Trail de media/larga distancia - 23 km",
      },
      fr: {
        name: "23KM Trail",
        description: "Trail de moyenne/longue distance - 23 km",
      },
      de: {
        name: "23KM Trail",
        description: "Mittel-/Langstrecken-Trail - 23 km",
      },
      it: {
        name: "23KM Trail",
        description: "Trail di media/lunga distanza - 23 km",
      },
    },
    "13KM Trail": {
      pt: {
        name: "13KM Trail",
        description: "Trail de curta/média distância - 13 km",
      },
      en: {
        name: "13KM Trail",
        description: "Short/medium distance trail - 13 km",
      },
      es: {
        name: "13KM Trail",
        description: "Trail de corta/media distancia - 13 km",
      },
      fr: {
        name: "13KM Trail",
        description: "Trail de courte/moyenne distance - 13 km",
      },
      de: {
        name: "13KM Trail",
        description: "Kurz-/Mittelstrecken-Trail - 13 km",
      },
      it: {
        name: "13KM Trail",
        description: "Trail di breve/media distanza - 13 km",
      },
    },
    "Caminhada 10KM": {
      pt: {
        name: "Caminhada 10KM",
        description: "Caminhada não competitiva - 10 km",
      },
      en: { name: "10KM Walk", description: "Non-competitive walk - 10 km" },
      es: {
        name: "Caminata 10KM",
        description: "Caminata no competitiva - 10 km",
      },
      fr: {
        name: "Marche 10KM",
        description: "Marche non compétitive - 10 km",
      },
      de: {
        name: "10KM Wanderung",
        description: "Nicht-kompetitive Wanderung - 10 km",
      },
      it: {
        name: "Camminata 10KM",
        description: "Camminata non competitiva - 10 km",
      },
    },
  };

  for (const [variantName, translations] of Object.entries(
    variantTranslations
  )) {
    const variantId = variantIds[variantName];
    for (const [lang, content] of Object.entries(translations)) {
      await prisma.eventVariantTranslation.upsert({
        where: {
          variantId_language: {
            variantId: variantId,
            language: lang as Language,
          },
        },
        update: content,
        create: {
          variantId: variantId,
          language: lang as Language,
          ...content,
        },
      });
    }
    console.log(`      ✅ Translations upserted for: ${variantName}`);
  }

  // Step 5: Upsert pricing phases separately
  const pricingPhases = [
    // 23KM Trail phases
    {
      variantName: "23KM Trail",
      name: "1ª Fase",
      startDate: new Date("2025-11-19T00:00:00.000Z"),
      endDate: new Date("2025-12-31T23:59:59.999Z"),
      price: 19.0,
      note: "Preço promocional - 1ª Fase",
    },
    {
      variantName: "23KM Trail",
      name: "2ª Fase",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-01-18T23:59:59.999Z"),
      price: 21.0,
      note: "Preço normal - 2ª Fase",
    },
    {
      variantName: "23KM Trail",
      name: "3ª Fase",
      startDate: new Date("2026-01-19T00:00:00.000Z"),
      endDate: new Date("2026-01-26T23:59:00.000Z"),
      price: 25.0,
      note: "Preço final - 3ª Fase",
    },
    // 13KM Trail phases
    {
      variantName: "13KM Trail",
      name: "1ª Fase",
      startDate: new Date("2025-11-19T00:00:00.000Z"),
      endDate: new Date("2025-12-31T23:59:59.999Z"),
      price: 14.0,
      note: "Preço promocional - 1ª Fase",
    },
    {
      variantName: "13KM Trail",
      name: "2ª Fase",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-01-18T23:59:59.999Z"),
      price: 16.0,
      note: "Preço normal - 2ª Fase",
    },
    {
      variantName: "13KM Trail",
      name: "3ª Fase",
      startDate: new Date("2026-01-19T00:00:00.000Z"),
      endDate: new Date("2026-01-26T23:59:00.000Z"),
      price: 21.0,
      note: "Preço final - 3ª Fase",
    },
    // Caminhada 10KM phases
    {
      variantName: "Caminhada 10KM",
      name: "1ª Fase",
      startDate: new Date("2025-11-19T00:00:00.000Z"),
      endDate: new Date("2025-12-31T23:59:59.999Z"),
      price: 10.0,
      note: "Preço fixo - 1ª Fase",
    },
    {
      variantName: "Caminhada 10KM",
      name: "2ª Fase",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-01-18T23:59:59.999Z"),
      price: 10.0,
      note: "Preço fixo - 2ª Fase",
    },
    {
      variantName: "Caminhada 10KM",
      name: "3ª Fase",
      startDate: new Date("2026-01-19T00:00:00.000Z"),
      endDate: new Date("2026-01-26T23:59:00.000Z"),
      price: 10.0,
      note: "Preço fixo - 3ª Fase",
    },
  ];

  for (const phaseData of pricingPhases) {
    const variantId = variantIds[phaseData.variantName];
    const { variantName, ...phaseFields } = phaseData;

    // PricingPhase doesn't have a unique constraint, so we use findFirst + create/update
    const existingPhase = await prisma.pricingPhase.findFirst({
      where: {
        variantId: variantId,
        name: phaseData.name,
      },
    });

    if (existingPhase) {
      await prisma.pricingPhase.update({
        where: { id: existingPhase.id },
        data: phaseFields,
      });
    } else {
      await prisma.pricingPhase.create({
        data: {
          ...phaseFields,
          variantId: variantId,
        },
      });
    }
    console.log(
      `      ✅ Pricing phase upserted: ${variantName} - ${phaseData.name}`
    );
  }

  console.log("");
  console.log("🏃 Trail Santa Iria 2026 seeded successfully!");
  console.log("");
  console.log("📊 Summary:");
  console.log(`   - Event: ${event.title}`);
  console.log(`   - Translations: 6 languages (pt, en, es, fr, de, it)`);
  console.log(`   - Variants: 3 (23KM Trail, 13KM Trail, Caminhada 10KM)`);
  console.log(`   - Variant translations: 18 (3 variants × 6 languages)`);
  console.log(`   - Pricing phases: 9 (3 variants × 3 phases)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
