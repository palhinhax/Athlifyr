/**
 * Seed: Rota das Ovelhas 2026
 *
 * Event: Trail running and walking in Lajeosa do Dão, Viseu
 * Location: Jardim de Lajeosa do Dão, Lajeosa do Dão, Tondela, Viseu
 * Date: April 3, 2026
 * Organizer: Grupo Cultural Recreativo e Desportivo Mocidade Vinhalense (MV)
 *            in partnership with Junta de Freguesia de Lajeosa do Dão
 *            and Câmara Municipal de Tondela
 * Sports: Trail, Running, Walking
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🐑 Seeding Rota das Ovelhas 2026...");

  // ──────────────────────────────────────────────
  // 1. Upsert Event (no nested creates)
  // ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: "rota-das-ovelhas-2026" },
    update: {
      title: "Rota das Ovelhas 2026",
      description:
        "Rota das Ovelhas 2026 - Trail e caminhada em Lajeosa do Dão, Tondela, Viseu",
      sportTypes: [SportType.TRAIL, SportType.RUNNING, SportType.WALKING],
      startDate: new Date("2026-04-03T08:00:00Z"),
      endDate: new Date("2026-04-03T14:00:00Z"),
      registrationDeadline: new Date("2026-03-29T23:59:00Z"),
      externalUrl: "https://acorrer.pt",
      imageUrl: "",
      city: "Lajeosa do Dão",
      country: "Portugal",
      latitude: 40.52844144898465,
      longitude: -7.991858634201067,
      googleMapsUrl: "https://maps.app.goo.gl/R1tq7LanodTuuSnH9",
      isFeatured: false,
      cancelled: false,
    },
    create: {
      title: "Rota das Ovelhas 2026",
      slug: "rota-das-ovelhas-2026",
      description:
        "Rota das Ovelhas 2026 - Trail e caminhada em Lajeosa do Dão, Tondela, Viseu",
      sportTypes: [SportType.TRAIL, SportType.RUNNING, SportType.WALKING],
      startDate: new Date("2026-04-03T08:00:00Z"),
      endDate: new Date("2026-04-03T14:00:00Z"),
      registrationDeadline: new Date("2026-03-29T23:59:00Z"),
      externalUrl: "https://acorrer.pt",
      imageUrl: "",
      city: "Lajeosa do Dão",
      country: "Portugal",
      latitude: 40.52844144898465,
      longitude: -7.991858634201067,
      googleMapsUrl: "https://maps.app.goo.gl/R1tq7LanodTuuSnH9",
      isFeatured: false,
      cancelled: false,
    },
  });

  console.log(`✅ Created/updated event: ${event.slug}`);

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
      title: "Rota das Ovelhas 2026",
      description: `# 🐑 Rota das Ovelhas 2026

**A Rota das Ovelhas regressa a Lajeosa do Dão, Tondela, no dia 3 de abril de 2026!** Organizada pelo **Grupo Cultural Recreativo e Desportivo Mocidade Vinhalense (MV)**, em parceria com a Junta de Freguesia de Lajeosa do Dão e a Câmara Municipal de Tondela.

Percursos circulares por trilhos rurais, florestais e agrícolas entre os rios Dão e Pavia, com a Serra da Estrela e o Caramulo como pano de fundo. Uma vila vinhateira com história e natureza!

---

## 🏔️ Provas

- **Trail Running 25km** – 25,7 km · D+ 817m · Partida 08:00 · Cutoff 6h
- **Trail Sprint 13km** – 13,5 km · D+ 428m · Partida 08:10 · Cutoff 4h
- **Caminhada** – 13,5 km · D+ 428m · Partida 08:20 · Aberta a todos

---

## 📍 Local

**Jardim de Lajeosa do Dão**, Tondela, Viseu

---

🐑 **Vem descobrir a Rota das Ovelhas!** 🏔️`,
      city: "Lajeosa do Dão, Tondela",
      metaTitle: "Rota das Ovelhas 2026 | Lajeosa do Dão, Tondela | 3 Abril",
      metaDescription:
        "Rota das Ovelhas 2026 a 3 de abril em Lajeosa do Dão, Tondela. Provas: Trail Running 25km, Trail Sprint 13km e Caminhada 13,5km. Percursos rurais entre o Dão e o Caramulo.",
    },
    en: {
      title: "Rota das Ovelhas 2026",
      description: `# 🐑 Rota das Ovelhas 2026

**Rota das Ovelhas returns to Lajeosa do Dão, Tondela, on April 3, 2026!** Organized by **Grupo Cultural Recreativo e Desportivo Mocidade Vinhalense (MV)**, in partnership with Junta de Freguesia de Lajeosa do Dão and Câmara Municipal de Tondela.

Circular routes through rural, forest and agricultural trails between the Dão and Pavia rivers, with Serra da Estrela and Caramulo as a backdrop. A wine village full of history and nature!

---

## 🏔️ Races

- **Trail Running 25km** – 25.7 km · D+ 817m · Start 08:00 · Cutoff 6h
- **Trail Sprint 13km** – 13.5 km · D+ 428m · Start 08:10 · Cutoff 4h
- **Walk** – 13.5 km · D+ 428m · Start 08:20 · Open to all

---

## 📍 Location

**Jardim de Lajeosa do Dão**, Tondela, Viseu, Portugal

---

🐑 **Come discover the Rota das Ovelhas!** 🏔️`,
      city: "Lajeosa do Dão, Tondela",
      metaTitle: "Rota das Ovelhas 2026 | Lajeosa do Dão, Tondela | April 3",
      metaDescription:
        "Rota das Ovelhas 2026 on April 3 in Lajeosa do Dão, Tondela. Races: Trail Running 25km, Trail Sprint 13km and Walk 13.5km. Rural trails between the Dão and Caramulo.",
    },
    es: {
      title: "Rota das Ovelhas 2026",
      description: `# 🐑 Rota das Ovelhas 2026

**Rota das Ovelhas regresa a Lajeosa do Dão, Tondela, el 3 de abril de 2026.** Organizado por el **Grupo Cultural Recreativo e Desportivo Mocidade Vinhalense (MV)**, en colaboración con la Junta de Freguesia de Lajeosa do Dão y la Câmara Municipal de Tondela.

Recorridos circulares por senderos rurales, forestales y agrícolas entre los ríos Dão y Pavia, con la Serra da Estrela y Caramulo de fondo. ¡Un pueblo vinícola con historia y naturaleza!

---

## 🏔️ Pruebas

- **Trail Running 25km** – 25,7 km · D+ 817m · Salida 08:00 · Cutoff 6h
- **Trail Sprint 13km** – 13,5 km · D+ 428m · Salida 08:10 · Cutoff 4h
- **Caminata** – 13,5 km · D+ 428m · Salida 08:20 · Abierta a todos

---

## 📍 Ubicación

**Jardim de Lajeosa do Dão**, Tondela, Viseu, Portugal

---

🐑 **¡Ven a descubrir la Rota das Ovelhas!** 🏔️`,
      city: "Lajeosa do Dão, Tondela",
      metaTitle: "Rota das Ovelhas 2026 | Lajeosa do Dão, Tondela | 3 Abril",
      metaDescription:
        "Rota das Ovelhas 2026 el 3 de abril en Lajeosa do Dão, Tondela. Pruebas: Trail Running 25km, Trail Sprint 13km y Caminata 13,5km. Senderos rurales entre el Dão y el Caramulo.",
    },
    fr: {
      title: "Rota das Ovelhas 2026",
      description: `# 🐑 Rota das Ovelhas 2026

**La Rota das Ovelhas revient à Lajeosa do Dão, Tondela, le 3 avril 2026 !** Organisée par le **Grupo Cultural Recreativo e Desportivo Mocidade Vinhalense (MV)**, en partenariat avec la Junta de Freguesia de Lajeosa do Dão et la Câmara Municipal de Tondela.

Parcours circulaires à travers sentiers ruraux, forestiers et agricoles entre les rivières Dão et Pavia, avec la Serra da Estrela et le Caramulo en toile de fond. Un village viticole riche en histoire et en nature !

---

## 🏔️ Épreuves

- **Trail Running 25km** – 25,7 km · D+ 817m · Départ 08h00 · Cutoff 6h
- **Trail Sprint 13km** – 13,5 km · D+ 428m · Départ 08h10 · Cutoff 4h
- **Marche** – 13,5 km · D+ 428m · Départ 08h20 · Ouverte à tous

---

## 📍 Lieu

**Jardim de Lajeosa do Dão**, Tondela, Viseu, Portugal

---

🐑 **Venez découvrir la Rota das Ovelhas !** 🏔️`,
      city: "Lajeosa do Dão, Tondela",
      metaTitle: "Rota das Ovelhas 2026 | Lajeosa do Dão, Tondela | 3 Avril",
      metaDescription:
        "Rota das Ovelhas 2026 le 3 avril à Lajeosa do Dão, Tondela. Épreuves : Trail Running 25km, Trail Sprint 13km et Marche 13,5km. Sentiers ruraux entre le Dão et le Caramulo.",
    },
    de: {
      title: "Rota das Ovelhas 2026",
      description: `# 🐑 Rota das Ovelhas 2026

**Die Rota das Ovelhas kehrt am 3. April 2026 nach Lajeosa do Dão, Tondela, zurück!** Organisiert vom **Grupo Cultural Recreativo e Desportivo Mocidade Vinhalense (MV)**, in Zusammenarbeit mit der Junta de Freguesia de Lajeosa do Dão und der Câmara Municipal de Tondela.

Rundstrecken über ländliche, Wald- und Landwirtschaftswege zwischen den Flüssen Dão und Pavia, mit der Serra da Estrela und dem Caramulo im Hintergrund. Ein Weindorf voller Geschichte und Natur!

---

## 🏔️ Läufe

- **Trail Running 25km** – 25,7 km · D+ 817m · Start 08:00 · Cutoff 6h
- **Trail Sprint 13km** – 13,5 km · D+ 428m · Start 08:10 · Cutoff 4h
- **Wanderung** – 13,5 km · D+ 428m · Start 08:20 · Offen für alle

---

## 📍 Veranstaltungsort

**Jardim de Lajeosa do Dão**, Tondela, Viseu, Portugal

---

🐑 **Komm und entdecke die Rota das Ovelhas!** 🏔️`,
      city: "Lajeosa do Dão, Tondela",
      metaTitle: "Rota das Ovelhas 2026 | Lajeosa do Dão, Tondela | 3. April",
      metaDescription:
        "Rota das Ovelhas 2026 am 3. April in Lajeosa do Dão, Tondela. Läufe: Trail Running 25km, Trail Sprint 13km und Wanderung 13,5km. Ländliche Trails zwischen Dão und Caramulo.",
    },
    it: {
      title: "Rota das Ovelhas 2026",
      description: `# 🐑 Rota das Ovelhas 2026

**La Rota das Ovelhas torna a Lajeosa do Dão, Tondela, il 3 aprile 2026!** Organizzata dal **Grupo Cultural Recreativo e Desportivo Mocidade Vinhalense (MV)**, in collaborazione con la Junta de Freguesia de Lajeosa do Dão e la Câmara Municipal de Tondela.

Percorsi circolari su sentieri rurali, forestali e agricoli tra i fiumi Dão e Pavia, con la Serra da Estrela e il Caramulo sullo sfondo. Un villaggio vinicolo ricco di storia e natura!

---

## 🏔️ Gare

- **Trail Running 25km** – 25,7 km · D+ 817m · Partenza 08:00 · Cutoff 6h
- **Trail Sprint 13km** – 13,5 km · D+ 428m · Partenza 08:10 · Cutoff 4h
- **Camminata** – 13,5 km · D+ 428m · Partenza 08:20 · Aperta a tutti

---

## 📍 Luogo

**Jardim de Lajeosa do Dão**, Tondela, Viseu, Portogallo

---

🐑 **Vieni a scoprire la Rota das Ovelhas!** 🏔️`,
      city: "Lajeosa do Dão, Tondela",
      metaTitle: "Rota das Ovelhas 2026 | Lajeosa do Dão, Tondela | 3 Aprile",
      metaDescription:
        "Rota das Ovelhas 2026 il 3 aprile a Lajeosa do Dão, Tondela. Gare: Trail Running 25km, Trail Sprint 13km e Camminata 13,5km. Sentieri rurali tra il Dão e il Caramulo.",
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

  const findOrCreatePricingPhase = async (
    name: string,
    variantId: string | null,
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

  // ── Variant 1: Trail Running 25km ──
  const trailRunning = await findOrCreateVariant({
    name: "Trail Running 25km",
    distanceKm: 25.7,
    elevationGainM: 817,
    elevationLossM: null,
    startDate: new Date("2026-04-03T08:00:00Z"),
    startTime: "08:00",
    cutoffTimeHours: 6,
    price: 15.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Trail Running 25km · 25,7 km · D+ 817m · Cutoff 6h · Idade mín. 18 anos",
  });
  console.log(`✅ Variant: ${trailRunning.name}`);

  // ── Variant 2: Trail Sprint 13km ──
  const trailSprint = await findOrCreateVariant({
    name: "Trail Sprint 13km",
    distanceKm: 13.5,
    elevationGainM: 428,
    elevationLossM: null,
    startDate: new Date("2026-04-03T08:10:00Z"),
    startTime: "08:10",
    cutoffTimeHours: 4,
    price: 12.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Trail Sprint 13km · 13,5 km · D+ 428m · Cutoff 4h · Idade mín. 16 anos",
  });
  console.log(`✅ Variant: ${trailSprint.name}`);

  // ── Variant 3: Caminhada 13.5km ──
  const caminhada = await findOrCreateVariant({
    name: "Caminhada 13.5km",
    distanceKm: 13.5,
    elevationGainM: 428,
    elevationLossM: null,
    startDate: new Date("2026-04-03T08:20:00Z"),
    startTime: "08:20",
    cutoffTimeHours: null,
    price: 8.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Caminhada 13,5 km · D+ 428m · Idade mín. 12 anos (menores de 16 acompanhados por adulto)",
  });
  console.log(`✅ Variant: ${caminhada.name}`);

  // ── Variant Translations ──
  const variantTranslations: Record<
    string,
    Array<{
      variantId: string;
      name: string;
      description: string;
    }>
  > = {
    pt: [
      {
        variantId: trailRunning.id,
        name: "Trail Running 25km",
        description:
          "Trail Running 25km · 25,7 km · D+ 817m · Cutoff 6h · Idade mín. 18 anos",
      },
      {
        variantId: trailSprint.id,
        name: "Trail Sprint 13km",
        description:
          "Trail Sprint 13km · 13,5 km · D+ 428m · Cutoff 4h · Idade mín. 16 anos",
      },
      {
        variantId: caminhada.id,
        name: "Caminhada 13,5km",
        description:
          "Caminhada 13,5 km · D+ 428m · Idade mín. 12 anos (menores de 16 acompanhados por adulto)",
      },
    ],
    en: [
      {
        variantId: trailRunning.id,
        name: "Trail Running 25km",
        description:
          "Trail Running 25km · 25.7 km · D+ 817m · Cutoff 6h · Min age 18",
      },
      {
        variantId: trailSprint.id,
        name: "Trail Sprint 13km",
        description:
          "Trail Sprint 13km · 13.5 km · D+ 428m · Cutoff 4h · Min age 16",
      },
      {
        variantId: caminhada.id,
        name: "Walk 13.5km",
        description:
          "Walk 13.5 km · D+ 428m · Min age 12 (under 16 must be accompanied by an adult)",
      },
    ],
    es: [
      {
        variantId: trailRunning.id,
        name: "Trail Running 25km",
        description:
          "Trail Running 25km · 25,7 km · D+ 817m · Cutoff 6h · Edad mín. 18 años",
      },
      {
        variantId: trailSprint.id,
        name: "Trail Sprint 13km",
        description:
          "Trail Sprint 13km · 13,5 km · D+ 428m · Cutoff 4h · Edad mín. 16 años",
      },
      {
        variantId: caminhada.id,
        name: "Caminata 13,5km",
        description:
          "Caminata 13,5 km · D+ 428m · Edad mín. 12 años (menores de 16 acompañados por adulto)",
      },
    ],
    fr: [
      {
        variantId: trailRunning.id,
        name: "Trail Running 25km",
        description:
          "Trail Running 25km · 25,7 km · D+ 817m · Cutoff 6h · Âge min. 18 ans",
      },
      {
        variantId: trailSprint.id,
        name: "Trail Sprint 13km",
        description:
          "Trail Sprint 13km · 13,5 km · D+ 428m · Cutoff 4h · Âge min. 16 ans",
      },
      {
        variantId: caminhada.id,
        name: "Marche 13,5km",
        description:
          "Marche 13,5 km · D+ 428m · Âge min. 12 ans (moins de 16 ans accompagnés d'un adulte)",
      },
    ],
    de: [
      {
        variantId: trailRunning.id,
        name: "Trail Running 25km",
        description:
          "Trail Running 25km · 25,7 km · D+ 817m · Cutoff 6h · Mindestalter 18 Jahre",
      },
      {
        variantId: trailSprint.id,
        name: "Trail Sprint 13km",
        description:
          "Trail Sprint 13km · 13,5 km · D+ 428m · Cutoff 4h · Mindestalter 16 Jahre",
      },
      {
        variantId: caminhada.id,
        name: "Wanderung 13,5km",
        description:
          "Wanderung 13,5 km · D+ 428m · Mindestalter 12 Jahre (unter 16 in Begleitung eines Erwachsenen)",
      },
    ],
    it: [
      {
        variantId: trailRunning.id,
        name: "Trail Running 25km",
        description:
          "Trail Running 25km · 25,7 km · D+ 817m · Cutoff 6h · Età min. 18 anni",
      },
      {
        variantId: trailSprint.id,
        name: "Trail Sprint 13km",
        description:
          "Trail Sprint 13km · 13,5 km · D+ 428m · Cutoff 4h · Età min. 16 anni",
      },
      {
        variantId: caminhada.id,
        name: "Camminata 13,5km",
        description:
          "Camminata 13,5 km · D+ 428m · Età min. 12 anni (sotto i 16 accompagnati da un adulto)",
      },
    ],
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    for (const vt of variantTranslations[lang]) {
      await prisma.eventVariantTranslation.upsert({
        where: {
          variantId_language: {
            variantId: vt.variantId,
            language: Language[lang],
          },
        },
        update: { name: vt.name, description: vt.description },
        create: {
          variantId: vt.variantId,
          language: Language[lang],
          name: vt.name,
          description: vt.description,
        },
      });
    }
    console.log(`✅ Variant translations [${lang}] upserted`);
  }

  // ──────────────────────────────────────────────
  // 4. Pricing Phases (linked to eventId AND variantId)
  // ──────────────────────────────────────────────

  // Trail Running 25km
  await findOrCreatePricingPhase(
    "Trail Running 25km - Inscrição",
    trailRunning.id,
    {
      startDate: new Date("2026-01-01T00:00:00Z"),
      endDate: new Date("2026-03-29T23:59:00Z"),
      price: 15.0,
      currency: Currency.EUR,
      note: "Inscrições até 29 de março de 2026",
    }
  );
  console.log("   - 1 pricing phase for Trail Running 25km");

  // Trail Sprint 13km
  await findOrCreatePricingPhase(
    "Trail Sprint 13km - Inscrição",
    trailSprint.id,
    {
      startDate: new Date("2026-01-01T00:00:00Z"),
      endDate: new Date("2026-03-29T23:59:00Z"),
      price: 12.0,
      currency: Currency.EUR,
      note: "Inscrições até 29 de março de 2026",
    }
  );
  console.log("   - 1 pricing phase for Trail Sprint 13km");

  // Caminhada 13.5km
  await findOrCreatePricingPhase("Caminhada 13.5km - Inscrição", caminhada.id, {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-03-29T23:59:00Z"),
    price: 8.0,
    currency: Currency.EUR,
    note: "Inscrições até 29 de março de 2026",
  });
  console.log("   - 1 pricing phase for Caminhada 13.5km");

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

  // FAQ 0: When and where
  const faq0 = await findOrCreateFAQ(
    event.id,
    0,
    "Quando e onde se realiza a Rota das Ovelhas?",
    "A Rota das Ovelhas realiza-se a 3 de abril de 2026, sexta-feira, com partida do Jardim de Lajeosa do Dão, Tondela, distrito de Viseu."
  );

  const faq0Translations = {
    pt: {
      question: "Quando e onde se realiza a Rota das Ovelhas?",
      answer:
        "A Rota das Ovelhas realiza-se a 3 de abril de 2026, sexta-feira, com partida do Jardim de Lajeosa do Dão, Tondela, distrito de Viseu.",
    },
    en: {
      question: "When and where does Rota das Ovelhas take place?",
      answer:
        "Rota das Ovelhas takes place on Friday, April 3, 2026, starting from Jardim de Lajeosa do Dão, Tondela, Viseu district.",
    },
    es: {
      question: "¿Cuándo y dónde se celebra la Rota das Ovelhas?",
      answer:
        "La Rota das Ovelhas se celebra el viernes 3 de abril de 2026, con salida desde el Jardim de Lajeosa do Dão, Tondela, distrito de Viseu.",
    },
    fr: {
      question: "Quand et où se déroule la Rota das Ovelhas ?",
      answer:
        "La Rota das Ovelhas se déroule le vendredi 3 avril 2026, au départ du Jardim de Lajeosa do Dão, Tondela, district de Viseu.",
    },
    de: {
      question: "Wann und wo findet die Rota das Ovelhas statt?",
      answer:
        "Die Rota das Ovelhas findet am Freitag, 3. April 2026, mit Start am Jardim de Lajeosa do Dão, Tondela, Bezirk Viseu statt.",
    },
    it: {
      question: "Quando e dove si svolge la Rota das Ovelhas?",
      answer:
        "La Rota das Ovelhas si svolge venerdì 3 aprile 2026, con partenza dal Jardim de Lajeosa do Dão, Tondela, distretto di Viseu.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: {
        faqId_language: { faqId: faq0.id, language: Language[lang] },
      },
      update: faq0Translations[lang],
      create: {
        faqId: faq0.id,
        language: Language[lang],
        ...faq0Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 0: When and where");

  // FAQ 1: Available races
  const faq1 = await findOrCreateFAQ(
    event.id,
    1,
    "Que provas estão disponíveis?",
    "Estão disponíveis 3 provas: Trail Running 25km (25,7 km, D+ 817m, cutoff 6h), Trail Sprint 13km (13,5 km, D+ 428m, cutoff 4h) e Caminhada (13,5 km, D+ 428m). Todas com partida do Jardim de Lajeosa do Dão."
  );

  const faq1Translations = {
    pt: {
      question: "Que provas estão disponíveis?",
      answer:
        "Estão disponíveis 3 provas: Trail Running 25km (25,7 km, D+ 817m, cutoff 6h), Trail Sprint 13km (13,5 km, D+ 428m, cutoff 4h) e Caminhada (13,5 km, D+ 428m). Todas com partida do Jardim de Lajeosa do Dão.",
    },
    en: {
      question: "What races are available?",
      answer:
        "There are 3 races: Trail Running 25km (25.7 km, D+ 817m, cutoff 6h), Trail Sprint 13km (13.5 km, D+ 428m, cutoff 4h) and Walk (13.5 km, D+ 428m). All start from Jardim de Lajeosa do Dão.",
    },
    es: {
      question: "¿Qué pruebas están disponibles?",
      answer:
        "Hay 3 pruebas: Trail Running 25km (25,7 km, D+ 817m, cutoff 6h), Trail Sprint 13km (13,5 km, D+ 428m, cutoff 4h) y Caminata (13,5 km, D+ 428m). Todas salen del Jardim de Lajeosa do Dão.",
    },
    fr: {
      question: "Quelles épreuves sont disponibles ?",
      answer:
        "3 épreuves sont disponibles : Trail Running 25km (25,7 km, D+ 817m, cutoff 6h), Trail Sprint 13km (13,5 km, D+ 428m, cutoff 4h) et Marche (13,5 km, D+ 428m). Toutes partent du Jardim de Lajeosa do Dão.",
    },
    de: {
      question: "Welche Läufe sind verfügbar?",
      answer:
        "Es gibt 3 Läufe: Trail Running 25km (25,7 km, D+ 817m, Cutoff 6h), Trail Sprint 13km (13,5 km, D+ 428m, Cutoff 4h) und Wanderung (13,5 km, D+ 428m). Alle starten am Jardim de Lajeosa do Dão.",
    },
    it: {
      question: "Quali gare sono disponibili?",
      answer:
        "Ci sono 3 gare: Trail Running 25km (25,7 km, D+ 817m, cutoff 6h), Trail Sprint 13km (13,5 km, D+ 428m, cutoff 4h) e Camminata (13,5 km, D+ 428m). Tutte partono dal Jardim de Lajeosa do Dão.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: {
        faqId_language: { faqId: faq1.id, language: Language[lang] },
      },
      update: faq1Translations[lang],
      create: {
        faqId: faq1.id,
        language: Language[lang],
        ...faq1Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 1: Available races");

  // FAQ 2: Prices and registration
  const faq2 = await findOrCreateFAQ(
    event.id,
    2,
    "Quais são os preços de inscrição?",
    "Trail Running 25km: €15 · Trail Sprint 13km: €12 · Caminhada: €8. Inscrições até 29 de março de 2026 através da plataforma acorrer.pt."
  );

  const faq2Translations = {
    pt: {
      question: "Quais são os preços de inscrição?",
      answer:
        "Trail Running 25km: €15 · Trail Sprint 13km: €12 · Caminhada: €8. Inscrições até 29 de março de 2026 através da plataforma acorrer.pt.",
    },
    en: {
      question: "What are the registration prices?",
      answer:
        "Trail Running 25km: €15 · Trail Sprint 13km: €12 · Walk: €8. Registration until March 29, 2026 via the acorrer.pt platform.",
    },
    es: {
      question: "¿Cuáles son los precios de inscripción?",
      answer:
        "Trail Running 25km: €15 · Trail Sprint 13km: €12 · Caminata: €8. Inscripciones hasta el 29 de marzo de 2026 a través de la plataforma acorrer.pt.",
    },
    fr: {
      question: "Quels sont les tarifs d'inscription ?",
      answer:
        "Trail Running 25km : 15 € · Trail Sprint 13km : 12 € · Marche : 8 €. Inscriptions jusqu'au 29 mars 2026 via la plateforme acorrer.pt.",
    },
    de: {
      question: "Wie hoch sind die Anmeldegebühren?",
      answer:
        "Trail Running 25km: 15 € · Trail Sprint 13km: 12 € · Wanderung: 8 €. Anmeldung bis zum 29. März 2026 über die Plattform acorrer.pt.",
    },
    it: {
      question: "Quali sono i prezzi di iscrizione?",
      answer:
        "Trail Running 25km: €15 · Trail Sprint 13km: €12 · Camminata: €8. Iscrizioni fino al 29 marzo 2026 tramite la piattaforma acorrer.pt.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: {
        faqId_language: { faqId: faq2.id, language: Language[lang] },
      },
      update: faq2Translations[lang],
      create: {
        faqId: faq2.id,
        language: Language[lang],
        ...faq2Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 2: Prices and registration");

  // FAQ 3: What's included
  const faq3 = await findOrCreateFAQ(
    event.id,
    3,
    "O que está incluído na inscrição?",
    "A inscrição inclui: dorsal, t-shirt técnica, seguro de acidentes pessoais, medal de finisher (exceto Caminhada), abastecimentos nos percursos, balneários e assistência médica."
  );

  const faq3Translations = {
    pt: {
      question: "O que está incluído na inscrição?",
      answer:
        "A inscrição inclui: dorsal, t-shirt técnica, seguro de acidentes pessoais, medalha de finisher (exceto Caminhada), abastecimentos nos percursos, balneários e assistência médica.",
    },
    en: {
      question: "What's included in the registration?",
      answer:
        "Registration includes: bib number, technical t-shirt, accident insurance, finisher medal (except Walk), aid stations, showers and medical support.",
    },
    es: {
      question: "¿Qué incluye la inscripción?",
      answer:
        "La inscripción incluye: dorsal, camiseta técnica, seguro de accidentes, medalla de finisher (excepto Caminata), avituallamiento, duchas y asistencia médica.",
    },
    fr: {
      question: "Qu'est-ce qui est inclus dans l'inscription ?",
      answer:
        "L'inscription comprend : dossard, t-shirt technique, assurance accidents, médaille finisher (sauf Marche), ravitaillement, douches et assistance médicale.",
    },
    de: {
      question: "Was ist in der Anmeldung enthalten?",
      answer:
        "Die Anmeldung beinhaltet: Startnummer, technisches T-Shirt, Unfallversicherung, Finisher-Medaille (außer Wanderung), Verpflegungsstationen, Duschen und medizinische Betreuung.",
    },
    it: {
      question: "Cosa è incluso nell'iscrizione?",
      answer:
        "L'iscrizione include: pettorale, t-shirt tecnica, assicurazione infortuni, medaglia finisher (esclusa Camminata), punti ristoro, docce e assistenza medica.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: {
        faqId_language: { faqId: faq3.id, language: Language[lang] },
      },
      update: faq3Translations[lang],
      create: {
        faqId: faq3.id,
        language: Language[lang],
        ...faq3Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 3: What's included");

  // FAQ 4: Schedule
  const faq4 = await findOrCreateFAQ(
    event.id,
    4,
    "Qual é o programa do dia?",
    "06:30 – Abertura do secretariado · 07:45 – Encerramento do secretariado · 08:00 – Partida Trail Running · 08:10 – Partida Trail Sprint · 08:20 – Partida Caminhada · 10:45 – Chegada estimada Sprint Trail · 12:00 – Chegada estimada Trail Running · 12:20 – Chegada estimada Caminhada · 13:00 – Entrega de prémios."
  );

  const faq4Translations = {
    pt: {
      question: "Qual é o programa do dia?",
      answer:
        "06:30 – Abertura do secretariado · 07:45 – Encerramento do secretariado · 08:00 – Partida Trail Running · 08:10 – Partida Trail Sprint · 08:20 – Partida Caminhada · 10:45 – Chegada estimada Sprint Trail · 12:00 – Chegada estimada Trail Running · 12:20 – Chegada estimada Caminhada · 13:00 – Entrega de prémios.",
    },
    en: {
      question: "What is the schedule for the day?",
      answer:
        "06:30 – Registration opens · 07:45 – Registration closes · 08:00 – Trail Running start · 08:10 – Trail Sprint start · 08:20 – Walk start · 10:45 – Estimated Sprint Trail finish · 12:00 – Estimated Trail Running finish · 12:20 – Estimated Walk finish · 13:00 – Prize ceremony.",
    },
    es: {
      question: "¿Cuál es el programa del día?",
      answer:
        "06:30 – Apertura de secretaría · 07:45 – Cierre de secretaría · 08:00 – Salida Trail Running · 08:10 – Salida Trail Sprint · 08:20 – Salida Caminata · 10:45 – Llegada estimada Sprint Trail · 12:00 – Llegada estimada Trail Running · 12:20 – Llegada estimada Caminata · 13:00 – Entrega de premios.",
    },
    fr: {
      question: "Quel est le programme de la journée ?",
      answer:
        "06h30 – Ouverture du secrétariat · 07h45 – Fermeture du secrétariat · 08h00 – Départ Trail Running · 08h10 – Départ Trail Sprint · 08h20 – Départ Marche · 10h45 – Arrivée estimée Sprint Trail · 12h00 – Arrivée estimée Trail Running · 12h20 – Arrivée estimée Marche · 13h00 – Remise des prix.",
    },
    de: {
      question: "Wie sieht der Tagesablauf aus?",
      answer:
        "06:30 – Öffnung des Sekretariats · 07:45 – Schließung des Sekretariats · 08:00 – Start Trail Running · 08:10 – Start Trail Sprint · 08:20 – Start Wanderung · 10:45 – Geschätztes Ziel Sprint Trail · 12:00 – Geschätztes Ziel Trail Running · 12:20 – Geschätztes Ziel Wanderung · 13:00 – Siegerehrung.",
    },
    it: {
      question: "Qual è il programma della giornata?",
      answer:
        "06:30 – Apertura segreteria · 07:45 – Chiusura segreteria · 08:00 – Partenza Trail Running · 08:10 – Partenza Trail Sprint · 08:20 – Partenza Camminata · 10:45 – Arrivo stimato Sprint Trail · 12:00 – Arrivo stimato Trail Running · 12:20 – Arrivo stimato Camminata · 13:00 – Premiazione.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: {
        faqId_language: { faqId: faq4.id, language: Language[lang] },
      },
      update: faq4Translations[lang],
      create: {
        faqId: faq4.id,
        language: Language[lang],
        ...faq4Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 4: Schedule");

  // FAQ 5: Mandatory equipment
  const faq5 = await findOrCreateFAQ(
    event.id,
    5,
    "Qual é o equipamento obrigatório para as provas de trail?",
    "Equipamento obrigatório: dorsal visível, telemóvel com bateria, manta térmica, apito, saco para lixo e garrafa/copo para água."
  );

  const faq5Translations = {
    pt: {
      question: "Qual é o equipamento obrigatório para as provas de trail?",
      answer:
        "Equipamento obrigatório: dorsal visível, telemóvel com bateria, manta térmica, apito, saco para lixo e garrafa/copo para água.",
    },
    en: {
      question: "What is the mandatory equipment for trail races?",
      answer:
        "Mandatory equipment: visible bib number, mobile phone with battery, thermal blanket, whistle, waste bag and water bottle/cup.",
    },
    es: {
      question:
        "¿Cuál es el equipamiento obligatorio para las pruebas de trail?",
      answer:
        "Equipamiento obligatorio: dorsal visible, teléfono móvil con batería, manta térmica, silbato, bolsa para basura y botella/vaso para agua.",
    },
    fr: {
      question:
        "Quel est l'équipement obligatoire pour les épreuves de trail ?",
      answer:
        "Équipement obligatoire : dossard visible, téléphone portable avec batterie, couverture de survie, sifflet, sac poubelle et gourde/gobelet.",
    },
    de: {
      question: "Was ist die Pflichtausrüstung für die Trailläufe?",
      answer:
        "Pflichtausrüstung: sichtbare Startnummer, Mobiltelefon mit Akku, Rettungsdecke, Pfeife, Müllbeutel und Wasserflasche/Becher.",
    },
    it: {
      question: "Qual è l'equipaggiamento obbligatorio per le gare di trail?",
      answer:
        "Equipaggiamento obbligatorio: pettorale visibile, telefono cellulare con batteria, coperta termica, fischietto, sacchetto per rifiuti e borraccia/bicchiere.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: {
        faqId_language: { faqId: faq5.id, language: Language[lang] },
      },
      update: faq5Translations[lang],
      create: {
        faqId: faq5.id,
        language: Language[lang],
        ...faq5Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 5: Mandatory equipment");

  // FAQ 6: Lunch
  const faq6 = await findOrCreateFAQ(
    event.id,
    6,
    "Existe almoço disponível no evento?",
    "Sim! Almoço disponível por €6 (inclui bebida, sopa e bifana). Almoço para acompanhante: €6."
  );

  const faq6Translations = {
    pt: {
      question: "Existe almoço disponível no evento?",
      answer:
        "Sim! Almoço disponível por €6 (inclui bebida, sopa e bifana). Almoço para acompanhante: €6.",
    },
    en: {
      question: "Is lunch available at the event?",
      answer:
        "Yes! Lunch available for €6 (includes drink, soup and bifana bread). Companion lunch: €6.",
    },
    es: {
      question: "¿Hay almuerzo disponible en el evento?",
      answer:
        "¡Sí! Almuerzo disponible por €6 (incluye bebida, sopa y bocadillo de bifana). Almuerzo para acompañante: €6.",
    },
    fr: {
      question: "Y a-t-il un déjeuner disponible lors de l'événement ?",
      answer:
        "Oui ! Déjeuner disponible pour 6 € (inclut boisson, soupe et sandwich bifana). Déjeuner accompagnant : 6 €.",
    },
    de: {
      question: "Gibt es ein Mittagessen bei der Veranstaltung?",
      answer:
        "Ja! Mittagessen für 6 € erhältlich (beinhaltet Getränk, Suppe und Bifana-Sandwich). Begleiter-Mittagessen: 6 €.",
    },
    it: {
      question: "È disponibile il pranzo all'evento?",
      answer:
        "Sì! Pranzo disponibile a €6 (include bibita, zuppa e panino bifana). Pranzo per accompagnatore: €6.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: {
        faqId_language: { faqId: faq6.id, language: Language[lang] },
      },
      update: faq6Translations[lang],
      create: {
        faqId: faq6.id,
        language: Language[lang],
        ...faq6Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 6: Lunch");

  // FAQ 7: Aid stations
  const faq7 = await findOrCreateFAQ(
    event.id,
    7,
    "Onde estão os postos de abastecimento?",
    "Trail Running 25km: Praia Fluvial ~5km (líquidos), Penedo ~10km (sólidos+líquidos), Anta ~18km (sólidos+líquidos). Trail Sprint 13km: Anta ~6km (sólidos+líquidos), Sede da MV ~10km (líquidos)."
  );

  const faq7Translations = {
    pt: {
      question: "Onde estão os postos de abastecimento?",
      answer:
        "Trail Running 25km: Praia Fluvial ~5km (líquidos), Penedo ~10km (sólidos+líquidos), Anta ~18km (sólidos+líquidos). Trail Sprint 13km: Anta ~6km (sólidos+líquidos), Sede da MV ~10km (líquidos).",
    },
    en: {
      question: "Where are the aid stations?",
      answer:
        "Trail Running 25km: River Beach ~5km (liquids), Penedo ~10km (solids+liquids), Anta ~18km (solids+liquids). Trail Sprint 13km: Anta ~6km (solids+liquids), MV HQ ~10km (liquids).",
    },
    es: {
      question: "¿Dónde están los puestos de avituallamiento?",
      answer:
        "Trail Running 25km: Playa Fluvial ~5km (líquidos), Penedo ~10km (sólidos+líquidos), Anta ~18km (sólidos+líquidos). Trail Sprint 13km: Anta ~6km (sólidos+líquidos), Sede MV ~10km (líquidos).",
    },
    fr: {
      question: "Où se trouvent les postes de ravitaillement ?",
      answer:
        "Trail Running 25km : Plage Fluviale ~5km (liquides), Penedo ~10km (solides+liquides), Anta ~18km (solides+liquides). Trail Sprint 13km : Anta ~6km (solides+liquides), Siège MV ~10km (liquides).",
    },
    de: {
      question: "Wo befinden sich die Verpflegungsstationen?",
      answer:
        "Trail Running 25km: Flussstrand ~5km (Getränke), Penedo ~10km (Essen+Getränke), Anta ~18km (Essen+Getränke). Trail Sprint 13km: Anta ~6km (Essen+Getränke), MV-Vereinshaus ~10km (Getränke).",
    },
    it: {
      question: "Dove sono i punti di ristoro?",
      answer:
        "Trail Running 25km: Spiaggia Fluviale ~5km (liquidi), Penedo ~10km (solidi+liquidi), Anta ~18km (solidi+liquidi). Trail Sprint 13km: Anta ~6km (solidi+liquidi), Sede MV ~10km (liquidi).",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: {
        faqId_language: { faqId: faq7.id, language: Language[lang] },
      },
      update: faq7Translations[lang],
      create: {
        faqId: faq7.id,
        language: Language[lang],
        ...faq7Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 7: Aid stations");

  // ──────────────────────────────────────────────
  // Summary
  // ──────────────────────────────────────────────
  console.log(`
✅ Seed completed successfully!

📊 Summary:
- Event: Rota das Ovelhas 2026
- Slug: rota-das-ovelhas-2026
- Variants: 3 (Trail Running 25km, Trail Sprint 13km, Caminhada 13.5km)
- Languages: 6 (pt, en, es, fr, de, it)
- Pricing Phases: 3 (1 per variant)
- FAQs: 8 (with translations in all 6 languages)
- Date: April 3, 2026
- Location: Lajeosa do Dão, Tondela, Viseu, Portugal
- Coordinates: 40.52844, -7.99186
- Organizer: Mocidade Vinhalense (MV)
  `);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
