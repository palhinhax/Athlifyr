/**
 * Seed: Trilhos Termais 2026
 *
 * Event: Trail running and walk in Caldas de São Jorge, Santa Maria da Feira
 * Location: Parque das Termas de S. Jorge, Caldas de São Jorge, Santa Maria da Feira
 * Date: April 4, 2026 at 19:00
 * Organizer: Associação Obra do Frei Gil / CM Santa Maria da Feira
 * Sport: TRAIL, WALKING
 * Registration: https://www.trilhostermais.pt
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Trilhos Termais 2026...");

  // ──────────────────────────────────────────────
  // 1. Upsert Event
  // ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: "trilhos-termais-2026" },
    update: {
      title: "Trilhos Termais 2026",
      description:
        "Trilhos Termais 2026 - Trail running e caminhada em Caldas de São Jorge, Santa Maria da Feira",
      sportTypes: [SportType.TRAIL, SportType.WALKING],
      startDate: new Date("2026-04-04T19:00:00Z"),
      endDate: new Date("2026-04-04T23:59:00Z"),
      registrationDeadline: new Date("2026-04-01T23:59:00Z"),
      externalUrl: "https://www.trilhostermais.pt",
      imageUrl: "",
      city: "Santa Maria da Feira",
      country: "Portugal",
      latitude: 40.969,
      longitude: -8.4994,
      googleMapsUrl: "https://maps.app.goo.gl/TmQZxnZZkpE2qUhaA",
      isFeatured: false,
      cancelled: false,
    },
    create: {
      title: "Trilhos Termais 2026",
      slug: "trilhos-termais-2026",
      description:
        "Trilhos Termais 2026 - Trail running e caminhada em Caldas de São Jorge, Santa Maria da Feira",
      sportTypes: [SportType.TRAIL, SportType.WALKING],
      startDate: new Date("2026-04-04T19:00:00Z"),
      endDate: new Date("2026-04-04T23:59:00Z"),
      registrationDeadline: new Date("2026-04-01T23:59:00Z"),
      externalUrl: "https://www.trilhostermais.pt",
      imageUrl: "",
      city: "Santa Maria da Feira",
      country: "Portugal",
      latitude: 40.969,
      longitude: -8.4994,
      googleMapsUrl: "https://maps.app.goo.gl/TmQZxnZZkpE2qUhaA",
      isFeatured: false,
      cancelled: false,
    },
  });

  console.log(`✅ Event upserted: ${event.slug}`);

  // ──────────────────────────────────────────────
  // 2. Translations (ALL 6 languages)
  // ──────────────────────────────────────────────
  const translations: Record<
    string,
    {
      title: string;
      description: string;
      city: string;
      metaTitle: string;
      metaDescription: string;
    }
  > = {
    pt: {
      title: "Trilhos Termais 2026",
      description: `# 🏃 Trilhos Termais 2026

**Os Trilhos Termais realizam-se a 4 de abril de 2026 às 19h00 em Caldas de São Jorge, Santa Maria da Feira!** Organizado pela **Associação Obra do Frei Gil**, em parceria com a Câmara Municipal de Santa Maria da Feira e com o apoio da Run4Feira.

Uma celebração do desporto, da natureza e da comunidade! Os percursos percorrem trilhos deslumbrantes da vila termal, com passagens junto ao rio Uíma e por cascatas e paisagens naturais de rara beleza.

---

## 🏔️ Provas

- **Trail Longo** – 20 km · 19:00
- **Trail Curto** – 13 km · 19:30
- **Caminhada** – 6 km · 19:40

---

🏃 **Vem trilhar connosco em Caldas de São Jorge!** 🌿`,
      city: "Santa Maria da Feira",
      metaTitle: "Trilhos Termais 2026 | Santa Maria da Feira | 4 Abril",
      metaDescription:
        "Trilhos Termais a 4 de abril de 2026 em Caldas de São Jorge, Santa Maria da Feira. Trail Longo 20km, Trail Curto 13km e Caminhada 6km. Evento noturno às 19h00.",
    },
    en: {
      title: "Trilhos Termais 2026",
      description: `# 🏃 Trilhos Termais 2026

**Trilhos Termais takes place on April 4, 2026 at 7:00 PM in Caldas de São Jorge, Santa Maria da Feira!** Organized by the **Associação Obra do Frei Gil**, in partnership with the Municipality of Santa Maria da Feira and supported by Run4Feira.

A celebration of sport, nature and community! The courses run through stunning trails in the thermal village, passing along the Uíma river, waterfalls and breathtaking natural landscapes.

---

## 🏔️ Races

- **Long Trail** – 20 km · 7:00 PM
- **Short Trail** – 13 km · 7:30 PM
- **Walk** – 6 km · 7:40 PM

---

🏃 **Come trail with us in Caldas de São Jorge!** 🌿`,
      city: "Santa Maria da Feira",
      metaTitle: "Trilhos Termais 2026 | Santa Maria da Feira | April 4",
      metaDescription:
        "Trilhos Termais on April 4, 2026 in Caldas de São Jorge, Santa Maria da Feira. Long Trail 20km, Short Trail 13km and Walk 6km. Evening event at 7 PM.",
    },
    es: {
      title: "Trilhos Termais 2026",
      description: `# 🏃 Trilhos Termais 2026

**Los Trilhos Termais se celebran el 4 de abril de 2026 a las 19:00 en Caldas de São Jorge, Santa Maria da Feira.** Organizado por la **Associação Obra do Frei Gil**, en colaboración con el Ayuntamiento de Santa Maria da Feira y con el apoyo de Run4Feira.

¡Una celebración del deporte, la naturaleza y la comunidad! Los recorridos atraviesan senderos impresionantes de la villa termal, pasando junto al río Uíma, cascadas y paisajes naturales de rara belleza.

---

## 🏔️ Pruebas

- **Trail Largo** – 20 km · 19:00
- **Trail Corto** – 13 km · 19:30
- **Caminata** – 6 km · 19:40

---

🏃 **¡Ven a correr con nosotros en Caldas de São Jorge!** 🌿`,
      city: "Santa Maria da Feira",
      metaTitle: "Trilhos Termais 2026 | Santa Maria da Feira | 4 Abril",
      metaDescription:
        "Trilhos Termais el 4 de abril de 2026 en Caldas de São Jorge, Santa Maria da Feira. Trail Largo 20km, Trail Corto 13km y Caminata 6km. Evento nocturno a las 19h.",
    },
    fr: {
      title: "Trilhos Termais 2026",
      description: `# 🏃 Trilhos Termais 2026

**Les Trilhos Termais ont lieu le 4 avril 2026 à 19h00 à Caldas de São Jorge, Santa Maria da Feira !** Organisé par l'**Associação Obra do Frei Gil**, en partenariat avec la Municipalité de Santa Maria da Feira et avec le soutien de Run4Feira.

Une célébration du sport, de la nature et de la communauté ! Les parcours traversent des sentiers magnifiques du village thermal, longeant la rivière Uíma, des cascades et des paysages naturels d'une rare beauté.

---

## 🏔️ Épreuves

- **Trail Long** – 20 km · 19h00
- **Trail Court** – 13 km · 19h30
- **Randonnée** – 6 km · 19h40

---

🏃 **Venez courir avec nous à Caldas de São Jorge !** 🌿`,
      city: "Santa Maria da Feira",
      metaTitle: "Trilhos Termais 2026 | Santa Maria da Feira | 4 Avril",
      metaDescription:
        "Trilhos Termais le 4 avril 2026 à Caldas de São Jorge, Santa Maria da Feira. Trail Long 20km, Trail Court 13km et Randonnée 6km. Événement nocturne à 19h00.",
    },
    de: {
      title: "Trilhos Termais 2026",
      description: `# 🏃 Trilhos Termais 2026

**Die Trilhos Termais finden am 4. April 2026 um 19:00 Uhr in Caldas de São Jorge, Santa Maria da Feira statt!** Organisiert von der **Associação Obra do Frei Gil**, in Partnerschaft mit der Gemeinde Santa Maria da Feira und unterstützt von Run4Feira.

Ein Fest des Sports, der Natur und der Gemeinschaft! Die Strecken führen durch atemberaubende Trails des Thermaldorfes, entlang des Flusses Uíma, an Wasserfällen und Naturlandschaften von seltener Schönheit vorbei.

---

## 🏔️ Rennen

- **Langer Trail** – 20 km · 19:00
- **Kurzer Trail** – 13 km · 19:30
- **Wanderung** – 6 km · 19:40

---

🏃 **Komm und laufe mit uns in Caldas de São Jorge!** 🌿`,
      city: "Santa Maria da Feira",
      metaTitle: "Trilhos Termais 2026 | Santa Maria da Feira | 4. April",
      metaDescription:
        "Trilhos Termais am 4. April 2026 in Caldas de São Jorge, Santa Maria da Feira. Langer Trail 20km, Kurzer Trail 13km und Wanderung 6km. Abendevent um 19:00 Uhr.",
    },
    it: {
      title: "Trilhos Termais 2026",
      description: `# 🏃 Trilhos Termais 2026

**I Trilhos Termais si svolgono il 4 aprile 2026 alle 19:00 a Caldas de São Jorge, Santa Maria da Feira!** Organizzato dall'**Associação Obra do Frei Gil**, in collaborazione con il Comune di Santa Maria da Feira e con il supporto di Run4Feira.

Una celebrazione dello sport, della natura e della comunità! I percorsi attraversano sentieri mozzafiato del villaggio termale, costeggiando il fiume Uíma, cascate e paesaggi naturali di rara bellezza.

---

## 🏔️ Gare

- **Trail Lungo** – 20 km · 19:00
- **Trail Corto** – 13 km · 19:30
- **Camminata** – 6 km · 19:40

---

🏃 **Vieni a correre con noi a Caldas de São Jorge!** 🌿`,
      city: "Santa Maria da Feira",
      metaTitle: "Trilhos Termais 2026 | Santa Maria da Feira | 4 Aprile",
      metaDescription:
        "Trilhos Termais il 4 aprile 2026 a Caldas de São Jorge, Santa Maria da Feira. Trail Lungo 20km, Trail Corto 13km e Camminata 6km. Evento serale alle 19:00.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: { eventId: event.id, language: Language[lang] },
      },
      update: {
        title: translations[lang].title,
        description: translations[lang].description,
        city: translations[lang].city,
        metaTitle: translations[lang].metaTitle,
        metaDescription: translations[lang].metaDescription,
      },
      create: {
        eventId: event.id,
        language: Language[lang],
        title: translations[lang].title,
        description: translations[lang].description,
        city: translations[lang].city,
        metaTitle: translations[lang].metaTitle,
        metaDescription: translations[lang].metaDescription,
      },
    });
    console.log(`✅ Translation [${lang}] upserted`);
  }

  // ──────────────────────────────────────────────
  // 3. Variants (findOrCreate helper)
  // ──────────────────────────────────────────────
  const findOrCreateVariant = async (variantData: {
    name: string;
    distanceKm: number;
    elevationGainM: number | null;
    elevationLossM: number | null;
    startDate: Date;
    startTime: string;
    cutoffTimeHours: number | null;
    price: number;
    currency: Currency;
    maxParticipants: number | null;
    atrpGrade: number | null;
    itraPoints: number | null;
    description: string;
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

  // ── Variant 1: Trail Longo 20km ──
  const trailLongo = await findOrCreateVariant({
    name: "Trail Longo 20km",
    distanceKm: 20,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-04T19:00:00Z"),
    startTime: "19:00",
    cutoffTimeHours: null,
    price: 11.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Trail Longo 20 km · Parque das Termas de S. Jorge · 19:00",
  });
  console.log(`✅ Variant: ${trailLongo.name}`);

  // ── Variant 2: Trail Curto 13km ──
  const trailCurto = await findOrCreateVariant({
    name: "Trail Curto 13km",
    distanceKm: 13,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-04T19:30:00Z"),
    startTime: "19:30",
    cutoffTimeHours: null,
    price: 10.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Trail Curto 13 km · Parque das Termas de S. Jorge · 19:30",
  });
  console.log(`✅ Variant: ${trailCurto.name}`);

  // ── Variant 3: Caminhada 6km ──
  const caminhada = await findOrCreateVariant({
    name: "Caminhada 6km",
    distanceKm: 6,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-04T19:40:00Z"),
    startTime: "19:40",
    cutoffTimeHours: null,
    price: 8.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Caminhada 6 km · Parque das Termas de S. Jorge · 19:40",
  });
  console.log(`✅ Variant: ${caminhada.name}`);

  // ── Variant Translations (ALL 6 languages) ──
  const variantTranslations: Record<
    string,
    Record<string, { name: string; description: string | null }>
  > = {
    trailLongo: {
      pt: {
        name: "Trail Longo 20km",
        description:
          "Trail Longo 20 km · Parque das Termas de S. Jorge · 19:00",
      },
      en: {
        name: "Long Trail 20km",
        description:
          "Long Trail 20 km · Parque das Termas de S. Jorge · 7:00 PM",
      },
      es: {
        name: "Trail Largo 20km",
        description:
          "Trail Largo 20 km · Parque das Termas de S. Jorge · 19:00",
      },
      fr: {
        name: "Trail Long 20km",
        description: "Trail Long 20 km · Parque das Termas de S. Jorge · 19h00",
      },
      de: {
        name: "Langer Trail 20km",
        description:
          "Langer Trail 20 km · Parque das Termas de S. Jorge · 19:00",
      },
      it: {
        name: "Trail Lungo 20km",
        description:
          "Trail Lungo 20 km · Parque das Termas de S. Jorge · 19:00",
      },
    },
    trailCurto: {
      pt: {
        name: "Trail Curto 13km",
        description:
          "Trail Curto 13 km · Parque das Termas de S. Jorge · 19:30",
      },
      en: {
        name: "Short Trail 13km",
        description:
          "Short Trail 13 km · Parque das Termas de S. Jorge · 7:30 PM",
      },
      es: {
        name: "Trail Corto 13km",
        description:
          "Trail Corto 13 km · Parque das Termas de S. Jorge · 19:30",
      },
      fr: {
        name: "Trail Court 13km",
        description:
          "Trail Court 13 km · Parque das Termas de S. Jorge · 19h30",
      },
      de: {
        name: "Kurzer Trail 13km",
        description:
          "Kurzer Trail 13 km · Parque das Termas de S. Jorge · 19:30",
      },
      it: {
        name: "Trail Corto 13km",
        description:
          "Trail Corto 13 km · Parque das Termas de S. Jorge · 19:30",
      },
    },
    caminhada: {
      pt: {
        name: "Caminhada 6km",
        description: "Caminhada 6 km · Parque das Termas de S. Jorge · 19:40",
      },
      en: {
        name: "Walk 6km",
        description: "Walk 6 km · Parque das Termas de S. Jorge · 7:40 PM",
      },
      es: {
        name: "Caminata 6km",
        description: "Caminata 6 km · Parque das Termas de S. Jorge · 19:40",
      },
      fr: {
        name: "Randonnée 6km",
        description: "Randonnée 6 km · Parque das Termas de S. Jorge · 19h40",
      },
      de: {
        name: "Wanderung 6km",
        description: "Wanderung 6 km · Parque das Termas de S. Jorge · 19:40",
      },
      it: {
        name: "Camminata 6km",
        description: "Camminata 6 km · Parque das Termas de S. Jorge · 19:40",
      },
    },
  };

  const variantMap = [
    { variant: trailLongo, key: "trailLongo" },
    { variant: trailCurto, key: "trailCurto" },
    { variant: caminhada, key: "caminhada" },
  ];

  for (const { variant, key } of variantMap) {
    for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
      await prisma.eventVariantTranslation.upsert({
        where: {
          variantId_language: {
            variantId: variant.id,
            language: Language[lang],
          },
        },
        update: {
          name: variantTranslations[key][lang].name,
          description: variantTranslations[key][lang].description,
        },
        create: {
          variantId: variant.id,
          language: Language[lang],
          name: variantTranslations[key][lang].name,
          description: variantTranslations[key][lang].description,
        },
      });
    }
    console.log(`✅ Variant translations upserted: ${variant.name}`);
  }

  // ──────────────────────────────────────────────
  // 4. Pricing Phases (linked to eventId AND variantId)
  // ──────────────────────────────────────────────
  const findOrCreatePricingPhase = async (
    name: string,
    variantId: string,
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
        data: { ...data, variantId },
      });
    } else {
      return await prisma.pricingPhase.create({
        data: { eventId: event.id, variantId, name, ...data },
      });
    }
  };

  // ── Trail Longo Premium (fixed price) ──
  await findOrCreatePricingPhase("Trail Longo 20km - Premium", trailLongo.id, {
    startDate: new Date("2026-01-18T00:00:00Z"),
    endDate: new Date("2026-04-01T23:59:59Z"),
    price: 23.7,
    currency: Currency.EUR,
    note: "Camisola Oficial Premium + Inscrição + Kit Completo",
  });

  // ── Trail Longo - Fase 1 ──
  await findOrCreatePricingPhase("Trail Longo 20km - Fase 1", trailLongo.id, {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-01-18T23:59:59Z"),
    price: 11.0,
    currency: Currency.EUR,
    note: null,
  });

  // ── Trail Longo - Fase 2 ──
  await findOrCreatePricingPhase("Trail Longo 20km - Fase 2", trailLongo.id, {
    startDate: new Date("2026-01-19T00:00:00Z"),
    endDate: new Date("2026-02-08T23:59:59Z"),
    price: 12.0,
    currency: Currency.EUR,
    note: null,
  });

  // ── Trail Longo - Fase 3 ──
  await findOrCreatePricingPhase("Trail Longo 20km - Fase 3", trailLongo.id, {
    startDate: new Date("2026-02-09T00:00:00Z"),
    endDate: new Date("2026-03-01T23:59:59Z"),
    price: 13.0,
    currency: Currency.EUR,
    note: null,
  });

  // ── Trail Longo - Fase 4 ──
  await findOrCreatePricingPhase("Trail Longo 20km - Fase 4", trailLongo.id, {
    startDate: new Date("2026-03-02T00:00:00Z"),
    endDate: new Date("2026-03-22T23:59:59Z"),
    price: 14.0,
    currency: Currency.EUR,
    note: null,
  });

  // ── Trail Longo - Fase 5 ──
  await findOrCreatePricingPhase("Trail Longo 20km - Fase 5", trailLongo.id, {
    startDate: new Date("2026-03-23T00:00:00Z"),
    endDate: new Date("2026-04-01T23:59:59Z"),
    price: 16.0,
    currency: Currency.EUR,
    note: null,
  });

  console.log("✅ Pricing phases: Trail Longo");

  // ── Trail Curto Premium (fixed price) ──
  await findOrCreatePricingPhase("Trail Curto 13km - Premium", trailCurto.id, {
    startDate: new Date("2026-01-18T00:00:00Z"),
    endDate: new Date("2026-04-01T23:59:59Z"),
    price: 23.7,
    currency: Currency.EUR,
    note: "Camisola Oficial Premium + Inscrição + Kit Completo",
  });

  // ── Trail Curto - Fase 1 ──
  await findOrCreatePricingPhase("Trail Curto 13km - Fase 1", trailCurto.id, {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-01-18T23:59:59Z"),
    price: 10.0,
    currency: Currency.EUR,
    note: null,
  });

  // ── Trail Curto - Fase 2 ──
  await findOrCreatePricingPhase("Trail Curto 13km - Fase 2", trailCurto.id, {
    startDate: new Date("2026-01-19T00:00:00Z"),
    endDate: new Date("2026-02-08T23:59:59Z"),
    price: 11.0,
    currency: Currency.EUR,
    note: null,
  });

  // ── Trail Curto - Fase 3 ──
  await findOrCreatePricingPhase("Trail Curto 13km - Fase 3", trailCurto.id, {
    startDate: new Date("2026-02-09T00:00:00Z"),
    endDate: new Date("2026-03-01T23:59:59Z"),
    price: 12.0,
    currency: Currency.EUR,
    note: null,
  });

  // ── Trail Curto - Fase 4 ──
  await findOrCreatePricingPhase("Trail Curto 13km - Fase 4", trailCurto.id, {
    startDate: new Date("2026-03-02T00:00:00Z"),
    endDate: new Date("2026-03-22T23:59:59Z"),
    price: 13.0,
    currency: Currency.EUR,
    note: null,
  });

  // ── Trail Curto - Fase 5 ──
  await findOrCreatePricingPhase("Trail Curto 13km - Fase 5", trailCurto.id, {
    startDate: new Date("2026-03-23T00:00:00Z"),
    endDate: new Date("2026-04-01T23:59:59Z"),
    price: 15.0,
    currency: Currency.EUR,
    note: null,
  });

  console.log("✅ Pricing phases: Trail Curto");

  // ── Caminhada Premium (fixed price) ──
  await findOrCreatePricingPhase("Caminhada 6km - Premium", caminhada.id, {
    startDate: new Date("2026-01-18T00:00:00Z"),
    endDate: new Date("2026-04-01T23:59:59Z"),
    price: 23.7,
    currency: Currency.EUR,
    note: "Camisola Oficial Premium + Inscrição + Kit Completo",
  });

  // ── Caminhada - Fase 1 ──
  await findOrCreatePricingPhase("Caminhada 6km - Fase 1", caminhada.id, {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-01-18T23:59:59Z"),
    price: 8.0,
    currency: Currency.EUR,
    note: null,
  });

  // ── Caminhada - Fase 2 ──
  await findOrCreatePricingPhase("Caminhada 6km - Fase 2", caminhada.id, {
    startDate: new Date("2026-01-19T00:00:00Z"),
    endDate: new Date("2026-02-08T23:59:59Z"),
    price: 8.5,
    currency: Currency.EUR,
    note: null,
  });

  // ── Caminhada - Fase 3 ──
  await findOrCreatePricingPhase("Caminhada 6km - Fase 3", caminhada.id, {
    startDate: new Date("2026-02-09T00:00:00Z"),
    endDate: new Date("2026-03-01T23:59:59Z"),
    price: 9.0,
    currency: Currency.EUR,
    note: null,
  });

  // ── Caminhada - Fase 4 ──
  await findOrCreatePricingPhase("Caminhada 6km - Fase 4", caminhada.id, {
    startDate: new Date("2026-03-02T00:00:00Z"),
    endDate: new Date("2026-03-22T23:59:59Z"),
    price: 9.5,
    currency: Currency.EUR,
    note: null,
  });

  // ── Caminhada - Fase 5 ──
  await findOrCreatePricingPhase("Caminhada 6km - Fase 5", caminhada.id, {
    startDate: new Date("2026-03-23T00:00:00Z"),
    endDate: new Date("2026-04-01T23:59:59Z"),
    price: 10.0,
    currency: Currency.EUR,
    note: null,
  });

  console.log("✅ Pricing phases: Caminhada");

  // ──────────────────────────────────────────────
  // 5. FAQs with translations (ALL 6 languages)
  // ──────────────────────────────────────────────
  const findOrCreateFAQ = async (
    eventId: string,
    order: number,
    question: string,
    answer: string
  ) => {
    const existing = await prisma.eventFAQ.findFirst({
      where: { eventId, order },
    });
    if (existing)
      return await prisma.eventFAQ.update({
        where: { id: existing.id },
        data: { question, answer },
      });
    return await prisma.eventFAQ.create({
      data: { eventId, order, question, answer },
    });
  };

  // ── FAQ 0: Schedule ──
  const faq0 = await findOrCreateFAQ(
    event.id,
    0,
    "Qual é o horário das provas?",
    "19:00 — Trail Longo (20 km). 19:30 — Trail Curto (13 km). 19:40 — Caminhada (6 km). Partida e chegada no Parque das Termas de S. Jorge."
  );

  const faq0Translations = {
    pt: {
      question: "Qual é o horário das provas?",
      answer:
        "19:00 — Trail Longo (20 km). 19:30 — Trail Curto (13 km). 19:40 — Caminhada (6 km). Partida e chegada no Parque das Termas de S. Jorge.",
    },
    en: {
      question: "What is the race schedule?",
      answer:
        "7:00 PM — Long Trail (20 km). 7:30 PM — Short Trail (13 km). 7:40 PM — Walk (6 km). Start and finish at Parque das Termas de S. Jorge.",
    },
    es: {
      question: "¿Cuál es el horario de las pruebas?",
      answer:
        "19:00 — Trail Largo (20 km). 19:30 — Trail Corto (13 km). 19:40 — Caminata (6 km). Salida y llegada en el Parque das Termas de S. Jorge.",
    },
    fr: {
      question: "Quel est le programme des épreuves ?",
      answer:
        "19h00 — Trail Long (20 km). 19h30 — Trail Court (13 km). 19h40 — Randonnée (6 km). Départ et arrivée au Parque das Termas de S. Jorge.",
    },
    de: {
      question: "Wie ist der Zeitplan der Rennen?",
      answer:
        "19:00 — Langer Trail (20 km). 19:30 — Kurzer Trail (13 km). 19:40 — Wanderung (6 km). Start und Ziel im Parque das Termas de S. Jorge.",
    },
    it: {
      question: "Qual è il programma delle gare?",
      answer:
        "19:00 — Trail Lungo (20 km). 19:30 — Trail Corto (13 km). 19:40 — Camminata (6 km). Partenza e arrivo al Parque das Termas de S. Jorge.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq0.id, language: Language[lang] } },
      update: faq0Translations[lang],
      create: {
        faqId: faq0.id,
        language: Language[lang],
        ...faq0Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 0: Schedule");

  // ── FAQ 1: Kit ──
  const faq1 = await findOrCreateFAQ(
    event.id,
    1,
    "O que inclui o kit de participante?",
    "T-shirt Técnica de Running, Medalha Finisher, Kit Saúde Oral, Saco TNT, Seguro + Dorsal, Abastecimentos de Percurso, Garrafa de Água + Madalena + Peça de Fruta."
  );

  const faq1Translations = {
    pt: {
      question: "O que inclui o kit de participante?",
      answer:
        "T-shirt Técnica de Running, Medalha Finisher, Kit Saúde Oral, Saco TNT, Seguro + Dorsal, Abastecimentos de Percurso, Garrafa de Água + Madalena + Peça de Fruta.",
    },
    en: {
      question: "What does the participant kit include?",
      answer:
        "Technical Running T-shirt, Finisher Medal, Oral Health Kit, Non-woven Bag, Insurance + Bib Number, Course Aid Stations, Water Bottle + Cake + Fruit.",
    },
    es: {
      question: "¿Qué incluye el kit del participante?",
      answer:
        "Camiseta Técnica de Running, Medalla Finisher, Kit de Salud Oral, Bolsa TNT, Seguro + Dorsal, Avituallamientos de Recorrido, Botella de Agua + Magdalena + Fruta.",
    },
    fr: {
      question: "Que comprend le kit participant ?",
      answer:
        "T-shirt Technique de Running, Médaille Finisher, Kit Santé Bucco-Dentaire, Sac en TNT, Assurance + Dossard, Ravitaillements de Parcours, Bouteille d'Eau + Madeleine + Fruit.",
    },
    de: {
      question: "Was enthält das Teilnehmerpaket?",
      answer:
        "Technisches Lauf-T-Shirt, Finisher-Medaille, Mundgesundheits-Kit, Vliesbeutel, Versicherung + Startnummer, Verpflegungsstellen, Wasserflasche + Kuchen + Obst.",
    },
    it: {
      question: "Cosa include il kit del partecipante?",
      answer:
        "Maglietta Tecnica Running, Medaglia Finisher, Kit Salute Orale, Busta TNT, Assicurazione + Pettorale, Ristori di Percorso, Bottiglia d'Acqua + Dolce + Frutta.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq1.id, language: Language[lang] } },
      update: faq1Translations[lang],
      create: {
        faqId: faq1.id,
        language: Language[lang],
        ...faq1Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 1: Kit");

  // ── FAQ 2: Headlamp ──
  const faq2 = await findOrCreateFAQ(
    event.id,
    2,
    "É obrigatório o uso de frontal ou lanterna?",
    "Sim. Por motivos de segurança, é obrigatório o uso de frontal ou lanterna durante toda a duração do Trail Curto, Trail Longo e da Caminhada. Os participantes que não cumprirem esta norma poderão ser impedidos de iniciar a prova ou desclassificados."
  );

  const faq2Translations = {
    pt: {
      question: "É obrigatório o uso de frontal ou lanterna?",
      answer:
        "Sim. Por motivos de segurança, é obrigatório o uso de frontal ou lanterna durante toda a duração do Trail Curto, Trail Longo e da Caminhada. Os participantes que não cumprirem esta norma poderão ser impedidos de iniciar a prova ou desclassificados.",
    },
    en: {
      question: "Is a headlamp or flashlight mandatory?",
      answer:
        "Yes. For safety reasons, a headlamp or flashlight is mandatory throughout the entire duration of the Short Trail, Long Trail and Walk. Participants who do not comply may be prevented from starting or disqualified.",
    },
    es: {
      question: "¿Es obligatorio el uso de frontal o linterna?",
      answer:
        "Sí. Por motivos de seguridad, es obligatorio el uso de frontal o linterna durante toda la duración del Trail Corto, Trail Largo y la Caminata. Los participantes que no cumplan esta norma podrán ser impedidos de iniciar la prueba o descalificados.",
    },
    fr: {
      question: "La lampe frontale ou torche est-elle obligatoire ?",
      answer:
        "Oui. Pour des raisons de sécurité, une lampe frontale ou torche est obligatoire pendant toute la durée du Trail Court, Trail Long et de la Randonnée. Les participants ne respectant pas cette règle pourront être empêchés de prendre le départ ou disqualifiés.",
    },
    de: {
      question: "Ist eine Stirnlampe oder Taschenlampe Pflicht?",
      answer:
        "Ja. Aus Sicherheitsgründen ist eine Stirnlampe oder Taschenlampe während der gesamten Dauer des Kurzen Trails, Langen Trails und der Wanderung Pflicht. Teilnehmer, die sich nicht daran halten, können am Start gehindert oder disqualifiziert werden.",
    },
    it: {
      question: "È obbligatoria la lampada frontale o torcia?",
      answer:
        "Sì. Per motivi di sicurezza, è obbligatorio l'uso di una lampada frontale o torcia durante tutta la durata del Trail Corto, Trail Lungo e della Camminata. I partecipanti che non rispetteranno questa regola potranno essere impediti dalla partenza o squalificati.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq2.id, language: Language[lang] } },
      update: faq2Translations[lang],
      create: {
        faqId: faq2.id,
        language: Language[lang],
        ...faq2Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 2: Headlamp");

  // ── FAQ 3: Age requirements ──
  const faq3 = await findOrCreateFAQ(
    event.id,
    3,
    "Qual é a idade mínima para participar?",
    "No Trail Curto e Trail Longo a participação é aberta a todos com 18 anos ou mais. Na Caminhada, menores de 18 anos podem participar desde que acompanhados por um adulto."
  );

  const faq3Translations = {
    pt: {
      question: "Qual é a idade mínima para participar?",
      answer:
        "No Trail Curto e Trail Longo a participação é aberta a todos com 18 anos ou mais. Na Caminhada, menores de 18 anos podem participar desde que acompanhados por um adulto.",
    },
    en: {
      question: "What is the minimum age to participate?",
      answer:
        "The Short Trail and Long Trail are open to participants aged 18 and over. In the Walk, minors under 18 may participate if accompanied by an adult.",
    },
    es: {
      question: "¿Cuál es la edad mínima para participar?",
      answer:
        "En el Trail Corto y Trail Largo la participación está abierta a mayores de 18 años. En la Caminata, los menores de 18 años pueden participar si van acompañados por un adulto.",
    },
    fr: {
      question: "Quel est l'âge minimum pour participer ?",
      answer:
        "Le Trail Court et le Trail Long sont ouverts aux participants de 18 ans et plus. Pour la Randonnée, les mineurs de moins de 18 ans peuvent participer s'ils sont accompagnés d'un adulte.",
    },
    de: {
      question: "Welches Mindestalter ist für die Teilnahme erforderlich?",
      answer:
        "Der Kurze Trail und der Lange Trail sind für Teilnehmer ab 18 Jahren offen. Bei der Wanderung dürfen Minderjährige unter 18 Jahren teilnehmen, wenn sie von einem Erwachsenen begleitet werden.",
    },
    it: {
      question: "Qual è l'età minima per partecipare?",
      answer:
        "Il Trail Corto e il Trail Lungo sono aperti ai partecipanti dai 18 anni in su. Nella Camminata, i minori di 18 anni possono partecipare se accompagnati da un adulto.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq3.id, language: Language[lang] } },
      update: faq3Translations[lang],
      create: {
        faqId: faq3.id,
        language: Language[lang],
        ...faq3Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 3: Age requirements");

  // ── FAQ 4: Cancellation / Refund ──
  const faq4 = await findOrCreateFAQ(
    event.id,
    4,
    "Posso cancelar a minha inscrição e ter reembolso?",
    "Os pedidos de cancelamento não têm direito a reembolso. Em caso de lesão ou doença, a organização devolve 50% do custo da inscrição mediante envio de certificado médico para geral@trilhostermais.pt até 5 dias antes do evento. A cedência a terceiros é possível por email."
  );

  const faq4Translations = {
    pt: {
      question: "Posso cancelar a minha inscrição e ter reembolso?",
      answer:
        "Os pedidos de cancelamento não têm direito a reembolso. Em caso de lesão ou doença, a organização devolve 50% do custo da inscrição mediante envio de certificado médico para geral@trilhostermais.pt até 5 dias antes do evento. A cedência a terceiros é possível por email.",
    },
    en: {
      question: "Can I cancel my registration and get a refund?",
      answer:
        "Cancellation requests are not eligible for refunds. In case of injury or illness, the organization refunds 50% of the registration fee upon submission of a medical certificate to geral@trilhostermais.pt up to 5 days before the event. Transfer to a third party is possible via email.",
    },
    es: {
      question: "¿Puedo cancelar mi inscripción y obtener un reembolso?",
      answer:
        "Las solicitudes de cancelación no tienen derecho a reembolso. En caso de lesión o enfermedad, la organización devuelve el 50% del coste de la inscripción mediante envío de certificado médico a geral@trilhostermais.pt hasta 5 días antes del evento. La cesión a terceros es posible por email.",
    },
    fr: {
      question: "Puis-je annuler mon inscription et être remboursé ?",
      answer:
        "Les demandes d'annulation ne donnent pas droit à un remboursement. En cas de blessure ou maladie, l'organisation rembourse 50% du coût de l'inscription sur présentation d'un certificat médical envoyé à geral@trilhostermais.pt jusqu'à 5 jours avant l'événement. Le transfert à un tiers est possible par email.",
    },
    de: {
      question:
        "Kann ich meine Anmeldung stornieren und eine Rückerstattung erhalten?",
      answer:
        "Stornierungsanfragen haben keinen Anspruch auf Rückerstattung. Bei Verletzung oder Krankheit erstattet die Organisation 50% der Anmeldegebühr gegen Vorlage eines ärztlichen Attests an geral@trilhostermais.pt bis 5 Tage vor der Veranstaltung. Eine Übertragung an Dritte ist per E-Mail möglich.",
    },
    it: {
      question: "Posso cancellare la mia iscrizione e ottenere un rimborso?",
      answer:
        "Le richieste di cancellazione non danno diritto a rimborso. In caso di infortunio o malattia, l'organizzazione rimborsa il 50% del costo dell'iscrizione previa presentazione di certificato medico a geral@trilhostermais.pt fino a 5 giorni prima dell'evento. Il trasferimento a terzi è possibile via email.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq4.id, language: Language[lang] } },
      update: faq4Translations[lang],
      create: {
        faqId: faq4.id,
        language: Language[lang],
        ...faq4Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 4: Cancellation / Refund");

  // ── FAQ 5: Prizes ──
  const faq5 = await findOrCreateFAQ(
    event.id,
    5,
    "Existem prémios para os trails?",
    "Sim. No Trail Curto e Trail Longo, os 5 primeiros classificados (M/F) recebem troféu e prémios em cartão Pingo Doce (50€, 40€, 30€, 20€, 10€). Existem também prémios por escalão (J/S, 40+, 50+, 60+), por equipas e para equipas com maior número de inscritos."
  );

  const faq5Translations = {
    pt: {
      question: "Existem prémios para os trails?",
      answer:
        "Sim. No Trail Curto e Trail Longo, os 5 primeiros classificados (M/F) recebem troféu e prémios em cartão Pingo Doce (50€, 40€, 30€, 20€, 10€). Existem também prémios por escalão (J/S, 40+, 50+, 60+), por equipas e para equipas com maior número de inscritos.",
    },
    en: {
      question: "Are there prizes for the trails?",
      answer:
        "Yes. In the Short Trail and Long Trail, the top 5 finishers (M/F) receive a trophy and Pingo Doce gift card prizes (€50, €40, €30, €20, €10). There are also age group prizes (J/S, 40+, 50+, 60+), team prizes and awards for teams with the most participants.",
    },
    es: {
      question: "¿Hay premios para los trails?",
      answer:
        "Sí. En el Trail Corto y Trail Largo, los 5 primeros clasificados (M/F) reciben trofeo y premios en tarjeta Pingo Doce (50€, 40€, 30€, 20€, 10€). También hay premios por categoría de edad (J/S, 40+, 50+, 60+), por equipos y para equipos con más inscritos.",
    },
    fr: {
      question: "Y a-t-il des prix pour les trails ?",
      answer:
        "Oui. Au Trail Court et Trail Long, les 5 premiers classés (H/F) reçoivent un trophée et des prix en carte Pingo Doce (50€, 40€, 30€, 20€, 10€). Il y a aussi des prix par catégorie d'âge (J/S, 40+, 50+, 60+), par équipes et pour les équipes avec le plus de participants.",
    },
    de: {
      question: "Gibt es Preise für die Trails?",
      answer:
        "Ja. Beim Kurzen Trail und Langen Trail erhalten die 5 Erstplatzierten (M/W) eine Trophäe und Preise als Pingo Doce Gutscheinkarte (50€, 40€, 30€, 20€, 10€). Es gibt auch Altersklassenpreise (J/S, 40+, 50+, 60+), Teampreise und Auszeichnungen für Teams mit den meisten Teilnehmern.",
    },
    it: {
      question: "Ci sono premi per i trail?",
      answer:
        "Sì. Nel Trail Corto e Trail Lungo, i primi 5 classificati (M/F) ricevono un trofeo e premi in carta Pingo Doce (50€, 40€, 30€, 20€, 10€). Ci sono anche premi per fascia d'età (J/S, 40+, 50+, 60+), per squadre e per le squadre con il maggior numero di iscritti.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq5.id, language: Language[lang] } },
      update: faq5Translations[lang],
      create: {
        faqId: faq5.id,
        language: Language[lang],
        ...faq5Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 5: Prizes");

  console.log("\n🎉 Trilhos Termais 2026 seed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
