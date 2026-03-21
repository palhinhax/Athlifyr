/**
 * Seed: Trail da Tapada Real de Mafra 2026
 *
 * Event: Trail running inside the Royal Estate of Mafra
 * Location: Tapada Nacional de Mafra, Mafra, Portugal
 * Date: April 19, 2026
 * Organizer: Trail4U & Tapada Nacional de Mafra
 * Sport: Trail, Running
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏔️ Seeding Trail da Tapada Real de Mafra 2026...");

  // ──────────────────────────────────────────────
  // 1. Upsert Event (NO nested creates)
  // ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: "trail-tapada-real-mafra-2026" },
    update: {
      title: "Trail da Tapada Real de Mafra 2026",
      description:
        "Trail da Tapada Real de Mafra 2026 - Corrida na Tapada Nacional de Mafra",
      sportTypes: [SportType.TRAIL, SportType.RUNNING],
      startDate: new Date("2026-04-19T09:00:00Z"),
      endDate: new Date("2026-04-19T14:00:00Z"),
      registrationDeadline: new Date("2026-04-12T23:59:00Z"),
      externalUrl:
        "https://www.trilhoperdido.com/evento/Trail-da-Tapada-Real-de-Mafra-2024",
      imageUrl: "",
      city: "Mafra",
      country: "Portugal",
      latitude: 38.9444,
      longitude: -9.3258,
      googleMapsUrl: "https://maps.google.com/?q=38.9444,-9.3258",
      isFeatured: false,
      cancelled: false,
    },
    create: {
      title: "Trail da Tapada Real de Mafra 2026",
      slug: "trail-tapada-real-mafra-2026",
      description:
        "Trail da Tapada Real de Mafra 2026 - Corrida na Tapada Nacional de Mafra",
      sportTypes: [SportType.TRAIL, SportType.RUNNING],
      startDate: new Date("2026-04-19T09:00:00Z"),
      endDate: new Date("2026-04-19T14:00:00Z"),
      registrationDeadline: new Date("2026-04-12T23:59:00Z"),
      externalUrl:
        "https://www.trilhoperdido.com/evento/Trail-da-Tapada-Real-de-Mafra-2024",
      imageUrl: "",
      city: "Mafra",
      country: "Portugal",
      latitude: 38.9444,
      longitude: -9.3258,
      googleMapsUrl: "https://maps.google.com/?q=38.9444,-9.3258",
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
      title: "Trail da Tapada Real de Mafra 2026",
      description: `# 🦌 Trail da Tapada Real de Mafra 2026

**O Trail da Tapada Real de Mafra realiza-se a 19 de abril de 2026 na Tapada Nacional de Mafra!** Organizado pela **Trail4U** em parceria com a **Tapada Nacional de Mafra**, todo o percurso decorre dentro da Tapada Real, criada há 280 anos para caçadas reais.

Corre entre veados, javalis, raposas e diversas espécies de aves num cenário natural único. Prova em regime de semi-autossuficiência — traz o teu recipiente para água.

---

## 🏔️ Provas

- **Trail Longo** – 20 km · Partida 09:00
- **Trail Curto** – 12 km · Partida 09:00
- **Caminhada** – 12 km · Partida 09:05 · Não competitiva

---

## 🏅 Circuitos

Mafra Trail Running Series · Merrell Trail Running Series

---

🦌 **Vem correr na Tapada Real de Mafra!** 🏔️`,
      city: "Mafra",
      metaTitle: "Trail da Tapada Real de Mafra 2026 | Mafra | 19 Abril",
      metaDescription:
        "Trail da Tapada Real de Mafra 2026 a 19 de abril. Trail Longo 20km, Trail Curto 12km e Caminhada 12km na Tapada Nacional de Mafra. Mafra Trail Running Series e Merrell Trail Running Series.",
    },
    en: {
      title: "Trail da Tapada Real de Mafra 2026",
      description: `# 🦌 Trail da Tapada Real de Mafra 2026

**The Trail da Tapada Real de Mafra takes place on April 19, 2026 at the Tapada Nacional de Mafra!** Organized by **Trail4U** in partnership with **Tapada Nacional de Mafra**, the entire course runs inside the Royal Estate, created 280 years ago for royal hunts.

Run among deer, wild boar, foxes, and diverse bird species in a unique natural setting. Semi self-sufficiency race — bring your own water container.

---

## 🏔️ Races

- **Trail Longo** – 20 km · Start 09:00
- **Trail Curto** – 12 km · Start 09:00
- **Caminhada (Walk)** – 12 km · Start 09:05 · Non-competitive

---

## 🏅 Circuits

Mafra Trail Running Series · Merrell Trail Running Series

---

🦌 **Come run in the Royal Estate of Mafra!** 🏔️`,
      city: "Mafra",
      metaTitle: "Trail da Tapada Real de Mafra 2026 | Mafra | April 19",
      metaDescription:
        "Trail da Tapada Real de Mafra 2026 on April 19. Trail Longo 20km, Trail Curto 12km and Walk 12km at Tapada Nacional de Mafra. Mafra Trail Running Series and Merrell Trail Running Series.",
    },
    es: {
      title: "Trail da Tapada Real de Mafra 2026",
      description: `# 🦌 Trail da Tapada Real de Mafra 2026

**El Trail da Tapada Real de Mafra se celebra el 19 de abril de 2026 en la Tapada Nacional de Mafra.** Organizado por **Trail4U** en colaboración con **Tapada Nacional de Mafra**, todo el recorrido transcurre dentro de la Finca Real, creada hace 280 años para cacerías reales.

Corre entre ciervos, jabalíes, zorros y diversas especies de aves en un entorno natural único. Prueba en régimen de semi-autosuficiencia — trae tu propio recipiente para agua.

---

## 🏔️ Pruebas

- **Trail Longo** – 20 km · Salida 09:00
- **Trail Curto** – 12 km · Salida 09:00
- **Caminata** – 12 km · Salida 09:05 · No competitiva

---

## 🏅 Circuitos

Mafra Trail Running Series · Merrell Trail Running Series

---

🦌 **¡Ven a correr en la Finca Real de Mafra!** 🏔️`,
      city: "Mafra",
      metaTitle: "Trail da Tapada Real de Mafra 2026 | Mafra | 19 Abril",
      metaDescription:
        "Trail da Tapada Real de Mafra 2026 el 19 de abril. Trail Longo 20km, Trail Curto 12km y Caminata 12km en la Tapada Nacional de Mafra. Mafra Trail Running Series y Merrell Trail Running Series.",
    },
    fr: {
      title: "Trail da Tapada Real de Mafra 2026",
      description: `# 🦌 Trail da Tapada Real de Mafra 2026

**Le Trail da Tapada Real de Mafra a lieu le 19 avril 2026 à la Tapada Nacional de Mafra !** Organisé par **Trail4U** en partenariat avec **Tapada Nacional de Mafra**, tout le parcours se déroule dans le Domaine Royal, créé il y a 280 ans pour les chasses royales.

Courez parmi les cerfs, sangliers, renards et de nombreuses espèces d'oiseaux dans un cadre naturel unique. Course en semi-autosuffisance — apportez votre propre récipient pour l'eau.

---

## 🏔️ Épreuves

- **Trail Longo** – 20 km · Départ 09h00
- **Trail Curto** – 12 km · Départ 09h00
- **Randonnée** – 12 km · Départ 09h05 · Non compétitive

---

## 🏅 Circuits

Mafra Trail Running Series · Merrell Trail Running Series

---

🦌 **Venez courir dans le Domaine Royal de Mafra !** 🏔️`,
      city: "Mafra",
      metaTitle: "Trail da Tapada Real de Mafra 2026 | Mafra | 19 Avril",
      metaDescription:
        "Trail da Tapada Real de Mafra 2026 le 19 avril. Trail Longo 20km, Trail Curto 12km et Randonnée 12km à la Tapada Nacional de Mafra. Mafra Trail Running Series et Merrell Trail Running Series.",
    },
    de: {
      title: "Trail da Tapada Real de Mafra 2026",
      description: `# 🦌 Trail da Tapada Real de Mafra 2026

**Der Trail da Tapada Real de Mafra findet am 19. April 2026 in der Tapada Nacional de Mafra statt!** Organisiert von **Trail4U** in Partnerschaft mit **Tapada Nacional de Mafra** — die gesamte Strecke verläuft innerhalb des Königlichen Guts, das vor 280 Jahren für königliche Jagden angelegt wurde.

Laufe zwischen Hirschen, Wildschweinen, Füchsen und zahlreichen Vogelarten in einer einzigartigen Naturkulisse. Halbautarkes Rennen — bring deinen eigenen Wasserbehälter mit.

---

## 🏔️ Rennen

- **Trail Longo** – 20 km · Start 09:00
- **Trail Curto** – 12 km · Start 09:00
- **Wanderung** – 12 km · Start 09:05 · Nicht kompetitiv

---

## 🏅 Serien

Mafra Trail Running Series · Merrell Trail Running Series

---

🦌 **Komm und laufe im Königlichen Gut von Mafra!** 🏔️`,
      city: "Mafra",
      metaTitle: "Trail da Tapada Real de Mafra 2026 | Mafra | 19. April",
      metaDescription:
        "Trail da Tapada Real de Mafra 2026 am 19. April. Trail Longo 20km, Trail Curto 12km und Wanderung 12km in der Tapada Nacional de Mafra. Mafra Trail Running Series und Merrell Trail Running Series.",
    },
    it: {
      title: "Trail da Tapada Real de Mafra 2026",
      description: `# 🦌 Trail da Tapada Real de Mafra 2026

**Il Trail da Tapada Real de Mafra si svolge il 19 aprile 2026 nella Tapada Nacional de Mafra!** Organizzato da **Trail4U** in collaborazione con **Tapada Nacional de Mafra**, l'intero percorso si snoda nella Tenuta Reale, creata 280 anni fa per le cacce reali.

Corri tra cervi, cinghiali, volpi e numerose specie di uccelli in uno scenario naturale unico. Gara in semi-autosufficienza — porta il tuo contenitore per l'acqua.

---

## 🏔️ Gare

- **Trail Longo** – 20 km · Partenza 09:00
- **Trail Curto** – 12 km · Partenza 09:00
- **Camminata** – 12 km · Partenza 09:05 · Non competitiva

---

## 🏅 Circuiti

Mafra Trail Running Series · Merrell Trail Running Series

---

🦌 **Vieni a correre nella Tenuta Reale di Mafra!** 🏔️`,
      city: "Mafra",
      metaTitle: "Trail da Tapada Real de Mafra 2026 | Mafra | 19 Aprile",
      metaDescription:
        "Trail da Tapada Real de Mafra 2026 il 19 aprile. Trail Longo 20km, Trail Curto 12km e Camminata 12km nella Tapada Nacional de Mafra. Mafra Trail Running Series e Merrell Trail Running Series.",
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

  // ── Variant 1: Trail Longo ──
  const trailLongo = await findOrCreateVariant({
    name: "Trail Longo",
    distanceKm: 20,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-19T09:00:00Z"),
    startTime: "09:00",
    cutoffTimeHours: 5,
    price: 22.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Trail Longo · 20 km · Idade mínima 16 anos · Cutoff 5h",
  });
  console.log(`✅ Variant: ${trailLongo.name}`);

  // ── Variant 2: Trail Curto ──
  const trailCurto = await findOrCreateVariant({
    name: "Trail Curto",
    distanceKm: 12,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-19T09:00:00Z"),
    startTime: "09:00",
    cutoffTimeHours: 5,
    price: 18.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Trail Curto · 12 km · Idade mínima 16 anos · Cutoff 5h",
  });
  console.log(`✅ Variant: ${trailCurto.name}`);

  // ── Variant 3: Caminhada ──
  const caminhada = await findOrCreateVariant({
    name: "Caminhada",
    distanceKm: 12,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-19T09:05:00Z"),
    startTime: "09:05",
    cutoffTimeHours: 5,
    price: 15.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Caminhada · 12 km · Não competitiva · Cutoff 5h",
  });
  console.log(`✅ Variant: ${caminhada.name}`);

  // ── Variant Translations (ALL 6 languages) ──
  const variantTranslations: Record<
    string,
    Record<string, { name: string; description: string | null }>
  > = {
    trailLongo: {
      pt: {
        name: "Trail Longo",
        description: "Trail Longo · 20 km · Idade mínima 16 anos · Cutoff 5h",
      },
      en: {
        name: "Long Trail",
        description: "Long Trail · 20 km · Minimum age 16 · Cutoff 5h",
      },
      es: {
        name: "Trail Largo",
        description: "Trail Largo · 20 km · Edad mínima 16 años · Cutoff 5h",
      },
      fr: {
        name: "Trail Long",
        description: "Trail Long · 20 km · Âge minimum 16 ans · Cutoff 5h",
      },
      de: {
        name: "Langer Trail",
        description: "Langer Trail · 20 km · Mindestalter 16 Jahre · Cutoff 5h",
      },
      it: {
        name: "Trail Lungo",
        description: "Trail Lungo · 20 km · Età minima 16 anni · Cutoff 5h",
      },
    },
    trailCurto: {
      pt: {
        name: "Trail Curto",
        description: "Trail Curto · 12 km · Idade mínima 16 anos · Cutoff 5h",
      },
      en: {
        name: "Short Trail",
        description: "Short Trail · 12 km · Minimum age 16 · Cutoff 5h",
      },
      es: {
        name: "Trail Corto",
        description: "Trail Corto · 12 km · Edad mínima 16 años · Cutoff 5h",
      },
      fr: {
        name: "Trail Court",
        description: "Trail Court · 12 km · Âge minimum 16 ans · Cutoff 5h",
      },
      de: {
        name: "Kurzer Trail",
        description: "Kurzer Trail · 12 km · Mindestalter 16 Jahre · Cutoff 5h",
      },
      it: {
        name: "Trail Corto",
        description: "Trail Corto · 12 km · Età minima 16 anni · Cutoff 5h",
      },
    },
    caminhada: {
      pt: {
        name: "Caminhada",
        description: "Caminhada · 12 km · Não competitiva",
      },
      en: { name: "Walk", description: "Walk · 12 km · Non-competitive" },
      es: {
        name: "Caminata",
        description: "Caminata · 12 km · No competitiva",
      },
      fr: {
        name: "Randonnée",
        description: "Randonnée · 12 km · Non compétitive",
      },
      de: {
        name: "Wanderung",
        description: "Wanderung · 12 km · Nicht kompetitiv",
      },
      it: {
        name: "Camminata",
        description: "Camminata · 12 km · Non competitiva",
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

  // Phase 1: Nov 20, 2025 → Jan 25, 2026
  await findOrCreatePricingPhase("Trail Longo - 1ª Fase", trailLongo.id, {
    startDate: new Date("2025-11-20T00:00:00Z"),
    endDate: new Date("2026-01-25T23:59:59Z"),
    price: 18.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Trail Curto - 1ª Fase", trailCurto.id, {
    startDate: new Date("2025-11-20T00:00:00Z"),
    endDate: new Date("2026-01-25T23:59:59Z"),
    price: 14.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Caminhada - 1ª Fase", caminhada.id, {
    startDate: new Date("2025-11-20T00:00:00Z"),
    endDate: new Date("2026-01-25T23:59:59Z"),
    price: 12.0,
    currency: Currency.EUR,
    note: null,
  });
  console.log("✅ Pricing Phase 1 created for all variants");

  // Phase 2: Jan 26, 2026 → Feb 28, 2026
  await findOrCreatePricingPhase("Trail Longo - 2ª Fase", trailLongo.id, {
    startDate: new Date("2026-01-26T00:00:00Z"),
    endDate: new Date("2026-02-28T23:59:59Z"),
    price: 20.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Trail Curto - 2ª Fase", trailCurto.id, {
    startDate: new Date("2026-01-26T00:00:00Z"),
    endDate: new Date("2026-02-28T23:59:59Z"),
    price: 16.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Caminhada - 2ª Fase", caminhada.id, {
    startDate: new Date("2026-01-26T00:00:00Z"),
    endDate: new Date("2026-02-28T23:59:59Z"),
    price: 14.0,
    currency: Currency.EUR,
    note: null,
  });
  console.log("✅ Pricing Phase 2 created for all variants");

  // Phase 3: Mar 1, 2026 → Apr 12, 2026
  await findOrCreatePricingPhase("Trail Longo - 3ª Fase", trailLongo.id, {
    startDate: new Date("2026-03-01T00:00:00Z"),
    endDate: new Date("2026-04-12T23:59:59Z"),
    price: 22.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Trail Curto - 3ª Fase", trailCurto.id, {
    startDate: new Date("2026-03-01T00:00:00Z"),
    endDate: new Date("2026-04-12T23:59:59Z"),
    price: 18.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Caminhada - 3ª Fase", caminhada.id, {
    startDate: new Date("2026-03-01T00:00:00Z"),
    endDate: new Date("2026-04-12T23:59:59Z"),
    price: 15.0,
    currency: Currency.EUR,
    note: null,
  });
  console.log("✅ Pricing Phase 3 created for all variants");

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
    "Qual é o horário do evento?",
    'Secretariado: a partir das 07:30. Partida Trail Longo e Trail Curto: 09:00. Partida Caminhada: 09:05. Entrega de prémios: prevista para as 13:00 (sujeita a alteração). Local de partida e chegada: Parque fronteiriço da "Casa do Salabredo", acesso pela Porta do Codeçal.'
  );

  const faq0Translations = {
    pt: {
      question: "Qual é o horário do evento?",
      answer:
        'Secretariado: a partir das 07:30. Partida Trail Longo e Trail Curto: 09:00. Partida Caminhada: 09:05. Entrega de prémios: prevista para as 13:00 (sujeita a alteração). Local de partida e chegada: Parque fronteiriço da "Casa do Salabredo", acesso pela Porta do Codeçal.',
    },
    en: {
      question: "What is the event schedule?",
      answer:
        'Registration desk: from 07:30. Start Trail Longo and Trail Curto: 09:00. Start Walk: 09:05. Prize ceremony: expected at 13:00 (subject to change). Start/finish location: "Casa do Salabredo" border park, access via Porta do Codeçal.',
    },
    es: {
      question: "¿Cuál es el horario del evento?",
      answer:
        'Secretaría: desde las 07:30. Salida Trail Longo y Trail Curto: 09:00. Salida Caminata: 09:05. Entrega de premios: prevista a las 13:00 (sujeta a cambios). Lugar de salida y meta: Parque fronterizo de la "Casa do Salabredo", acceso por la Porta do Codeçal.',
    },
    fr: {
      question: "Quel est le programme de l'événement ?",
      answer:
        "Secrétariat : à partir de 07h30. Départ Trail Longo et Trail Curto : 09h00. Départ Randonnée : 09h05. Remise des prix : prévue à 13h00 (sous réserve). Lieu de départ et d'arrivée : Parc frontalier de la « Casa do Salabredo », accès par la Porta do Codeçal.",
    },
    de: {
      question: "Wie ist der Zeitplan der Veranstaltung?",
      answer:
        'Sekretariat: ab 07:30. Start Trail Longo und Trail Curto: 09:00. Start Wanderung: 09:05. Preisverleihung: voraussichtlich 13:00 (Änderungen vorbehalten). Start-/Zielort: Grenzpark „Casa do Salabredo", Zugang über Porta do Codeçal.',
    },
    it: {
      question: "Qual è il programma dell'evento?",
      answer:
        'Segreteria: dalle 07:30. Partenza Trail Longo e Trail Curto: 09:00. Partenza Camminata: 09:05. Premiazione: prevista alle 13:00 (soggetta a variazioni). Luogo di partenza e arrivo: Parco di confine della "Casa do Salabredo", accesso dalla Porta do Codeçal.',
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

  // ── FAQ 1: What's included ──
  const faq1 = await findOrCreateFAQ(
    event.id,
    1,
    "O que está incluído na inscrição?",
    "Trail Longo e Trail Curto: pala de corrida, dorsal com chip, seguro desportivo, apoio logístico/técnico, primeiros socorros, abastecimentos sólidos e líquidos, possíveis ofertas de patrocinadores. Caminhada: dorsal, seguro, abastecimentos e apoio logístico."
  );

  const faq1Translations = {
    pt: {
      question: "O que está incluído na inscrição?",
      answer:
        "Trail Longo e Trail Curto: pala de corrida, dorsal com chip, seguro desportivo, apoio logístico/técnico, primeiros socorros, abastecimentos sólidos e líquidos, possíveis ofertas de patrocinadores. Caminhada: dorsal, seguro, abastecimentos e apoio logístico.",
    },
    en: {
      question: "What is included in the registration?",
      answer:
        "Trail Longo and Trail Curto: running visor, bib with chip, sports insurance, logistic/technical support, first aid, solid and liquid aid stations, potential sponsor gifts. Walk: bib, insurance, aid stations and logistic support.",
    },
    es: {
      question: "¿Qué incluye la inscripción?",
      answer:
        "Trail Longo y Trail Curto: visera de carrera, dorsal con chip, seguro deportivo, apoyo logístico/técnico, primeros auxilios, avituallamiento sólido y líquido, posibles regalos de patrocinadores. Caminata: dorsal, seguro, avituallamiento y apoyo logístico.",
    },
    fr: {
      question: "Que comprend l'inscription ?",
      answer:
        "Trail Longo et Trail Curto : visière de course, dossard avec puce, assurance sportive, soutien logistique/technique, premiers secours, ravitaillements solides et liquides, possibles cadeaux de sponsors. Randonnée : dossard, assurance, ravitaillements et soutien logistique.",
    },
    de: {
      question: "Was ist in der Anmeldung enthalten?",
      answer:
        "Trail Longo und Trail Curto: Laufkappe, Startnummer mit Chip, Sportversicherung, logistische/technische Unterstützung, Erste Hilfe, feste und flüssige Verpflegungsstationen, mögliche Sponsorengeschenke. Wanderung: Startnummer, Versicherung, Verpflegungsstationen und logistische Unterstützung.",
    },
    it: {
      question: "Cosa è incluso nell'iscrizione?",
      answer:
        "Trail Longo e Trail Curto: visiera da corsa, pettorale con chip, assicurazione sportiva, supporto logistico/tecnico, primo soccorso, rifornimenti solidi e liquidi, possibili omaggi degli sponsor. Camminata: pettorale, assicurazione, rifornimenti e supporto logistico.",
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
  console.log("✅ FAQ 1: What's included");

  // ── FAQ 2: Mandatory equipment ──
  const faq2 = await findOrCreateFAQ(
    event.id,
    2,
    "Qual é o material obrigatório?",
    "Dorsal visível, recipiente para água nos abastecimentos (não são distribuídos copos) e telemóvel com bateria."
  );

  const faq2Translations = {
    pt: {
      question: "Qual é o material obrigatório?",
      answer:
        "Dorsal visível, recipiente para água nos abastecimentos (não são distribuídos copos) e telemóvel com bateria.",
    },
    en: {
      question: "What mandatory equipment is required?",
      answer:
        "Visible bib, water container for aid stations (no cups distributed) and mobile phone with battery.",
    },
    es: {
      question: "¿Cuál es el equipamiento obligatorio?",
      answer:
        "Dorsal visible, recipiente para agua en los avituallamientos (no se distribuyen vasos) y teléfono móvil con batería.",
    },
    fr: {
      question: "Quel est l'équipement obligatoire ?",
      answer:
        "Dossard visible, récipient pour l'eau aux ravitaillements (pas de gobelets distribués) et téléphone portable avec batterie.",
    },
    de: {
      question: "Welche Pflichtausrüstung wird benötigt?",
      answer:
        "Sichtbare Startnummer, Wasserbehälter für Verpflegungsstationen (keine Becher verteilt) und Mobiltelefon mit Akku.",
    },
    it: {
      question: "Qual è l'equipaggiamento obbligatorio?",
      answer:
        "Pettorale visibile, contenitore per l'acqua ai rifornimenti (non vengono distribuiti bicchieri) e telefono cellulare con batteria.",
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
  console.log("✅ FAQ 2: Mandatory equipment");

  // ── FAQ 3: Aid stations / self-sufficiency ──
  const faq3 = await findOrCreateFAQ(
    event.id,
    3,
    "Como funcionam os abastecimentos?",
    "A prova é em regime de semi-autossuficiência. Existem postos de abastecimento sólido e líquido ao longo do percurso, mas não são distribuídos copos. Cada atleta deve trazer o seu próprio recipiente para água."
  );

  const faq3Translations = {
    pt: {
      question: "Como funcionam os abastecimentos?",
      answer:
        "A prova é em regime de semi-autossuficiência. Existem postos de abastecimento sólido e líquido ao longo do percurso, mas não são distribuídos copos. Cada atleta deve trazer o seu próprio recipiente para água.",
    },
    en: {
      question: "How do the aid stations work?",
      answer:
        "The race follows a semi self-sufficiency model. There are solid and liquid aid stations along the course, but no cups are distributed. Each athlete must bring their own water container.",
    },
    es: {
      question: "¿Cómo funcionan los avituallamientos?",
      answer:
        "La prueba es en régimen de semi-autosuficiencia. Hay puestos de avituallamiento sólido y líquido a lo largo del recorrido, pero no se distribuyen vasos. Cada atleta debe traer su propio recipiente para agua.",
    },
    fr: {
      question: "Comment fonctionnent les ravitaillements ?",
      answer:
        "La course se déroule en semi-autosuffisance. Des postes de ravitaillement solide et liquide sont répartis le long du parcours, mais aucun gobelet n'est distribué. Chaque athlète doit apporter son propre récipient pour l'eau.",
    },
    de: {
      question: "Wie funktionieren die Verpflegungsstationen?",
      answer:
        "Das Rennen folgt einem halbautarken Modell. Es gibt feste und flüssige Verpflegungsstationen entlang der Strecke, aber es werden keine Becher verteilt. Jeder Athlet muss seinen eigenen Wasserbehälter mitbringen.",
    },
    it: {
      question: "Come funzionano i rifornimenti?",
      answer:
        "La gara si svolge in regime di semi-autosufficienza. Sono presenti punti di rifornimento solido e liquido lungo il percorso, ma non vengono distribuiti bicchieri. Ogni atleta deve portare il proprio contenitore per l'acqua.",
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
  console.log("✅ FAQ 3: Aid stations");

  // ── FAQ 4: Prizes ──
  const faq4 = await findOrCreateFAQ(
    event.id,
    4,
    "Quais são os prémios?",
    "Trail Longo e Trail Curto: troféus para os 3 primeiros classificados gerais M/F, prémios por escalão etário e troféus para as 3 melhores equipas (3 melhores atletas independentemente do género). A Caminhada é não competitiva e não tem prémios."
  );

  const faq4Translations = {
    pt: {
      question: "Quais são os prémios?",
      answer:
        "Trail Longo e Trail Curto: troféus para os 3 primeiros classificados gerais M/F, prémios por escalão etário e troféus para as 3 melhores equipas (3 melhores atletas independentemente do género). A Caminhada é não competitiva e não tem prémios.",
    },
    en: {
      question: "What are the prizes?",
      answer:
        "Trail Longo and Trail Curto: trophies for top 3 overall M/F, age category prizes and trophies for top 3 teams (best 3 athletes regardless of gender). The Walk is non-competitive with no prizes.",
    },
    es: {
      question: "¿Cuáles son los premios?",
      answer:
        "Trail Longo y Trail Curto: trofeos para los 3 primeros clasificados generales M/F, premios por categoría de edad y trofeos para los 3 mejores equipos (3 mejores atletas sin importar el género). La Caminata es no competitiva y no tiene premios.",
    },
    fr: {
      question: "Quels sont les prix ?",
      answer:
        "Trail Longo et Trail Curto : trophées pour les 3 premiers au classement général H/F, prix par catégorie d'âge et trophées pour les 3 meilleures équipes (3 meilleurs athlètes indépendamment du genre). La Randonnée est non compétitive et sans prix.",
    },
    de: {
      question: "Welche Preise gibt es?",
      answer:
        "Trail Longo und Trail Curto: Pokale für die Top 3 der Gesamtwertung M/W, Preise nach Altersklasse und Pokale für die 3 besten Teams (3 beste Athleten unabhängig vom Geschlecht). Die Wanderung ist nicht kompetitiv und ohne Preise.",
    },
    it: {
      question: "Quali sono i premi?",
      answer:
        "Trail Longo e Trail Curto: trofei per i primi 3 classificati generali M/F, premi per categoria di età e trofei per i 3 migliori team (3 migliori atleti indipendentemente dal genere). La Camminata è non competitiva e senza premi.",
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
  console.log("✅ FAQ 4: Prizes");

  // ── FAQ 5: Payment methods ──
  const faq5 = await findOrCreateFAQ(
    event.id,
    5,
    "Quais são os métodos de pagamento?",
    "As inscrições são efetuadas através da plataforma Trilho Perdido (trilhoperdido.com). Os métodos de pagamento disponíveis dependem da plataforma de inscrição."
  );

  const faq5Translations = {
    pt: {
      question: "Quais são os métodos de pagamento?",
      answer:
        "As inscrições são efetuadas através da plataforma Trilho Perdido (trilhoperdido.com). Os métodos de pagamento disponíveis dependem da plataforma de inscrição.",
    },
    en: {
      question: "What are the payment methods?",
      answer:
        "Registrations are made through the Trilho Perdido platform (trilhoperdido.com). Available payment methods depend on the registration platform.",
    },
    es: {
      question: "¿Cuáles son los métodos de pago?",
      answer:
        "Las inscripciones se realizan a través de la plataforma Trilho Perdido (trilhoperdido.com). Los métodos de pago disponibles dependen de la plataforma de inscripción.",
    },
    fr: {
      question: "Quels sont les moyens de paiement ?",
      answer:
        "Les inscriptions se font via la plateforme Trilho Perdido (trilhoperdido.com). Les moyens de paiement disponibles dépendent de la plateforme d'inscription.",
    },
    de: {
      question: "Welche Zahlungsmethoden gibt es?",
      answer:
        "Die Anmeldung erfolgt über die Plattform Trilho Perdido (trilhoperdido.com). Die verfügbaren Zahlungsmethoden hängen von der Anmeldeplattform ab.",
    },
    it: {
      question: "Quali sono i metodi di pagamento?",
      answer:
        "Le iscrizioni si effettuano attraverso la piattaforma Trilho Perdido (trilhoperdido.com). I metodi di pagamento disponibili dipendono dalla piattaforma di iscrizione.",
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
  console.log("✅ FAQ 5: Payment methods");

  // ── FAQ 6: Contacts ──
  const faq6 = await findOrCreateFAQ(
    event.id,
    6,
    "Quais são os contactos da organização?",
    "Organização: trail4uevents@gmail.com · Telefone: 969 463 510. Inscrições: traildatapadareal@gmail.com / infotrilhoperdido@gmail.com."
  );

  const faq6Translations = {
    pt: {
      question: "Quais são os contactos da organização?",
      answer:
        "Organização: trail4uevents@gmail.com · Telefone: 969 463 510. Inscrições: traildatapadareal@gmail.com / infotrilhoperdido@gmail.com.",
    },
    en: {
      question: "What are the organization's contacts?",
      answer:
        "Organization: trail4uevents@gmail.com · Phone: 969 463 510. Registrations: traildatapadareal@gmail.com / infotrilhoperdido@gmail.com.",
    },
    es: {
      question: "¿Cuáles son los contactos de la organización?",
      answer:
        "Organización: trail4uevents@gmail.com · Teléfono: 969 463 510. Inscripciones: traildatapadareal@gmail.com / infotrilhoperdido@gmail.com.",
    },
    fr: {
      question: "Quels sont les contacts de l'organisation ?",
      answer:
        "Organisation : trail4uevents@gmail.com · Téléphone : 969 463 510. Inscriptions : traildatapadareal@gmail.com / infotrilhoperdido@gmail.com.",
    },
    de: {
      question: "Was sind die Kontaktdaten der Organisation?",
      answer:
        "Organisation: trail4uevents@gmail.com · Telefon: 969 463 510. Anmeldung: traildatapadareal@gmail.com / infotrilhoperdido@gmail.com.",
    },
    it: {
      question: "Quali sono i contatti dell'organizzazione?",
      answer:
        "Organizzazione: trail4uevents@gmail.com · Telefono: 969 463 510. Iscrizioni: traildatapadareal@gmail.com / infotrilhoperdido@gmail.com.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq6.id, language: Language[lang] } },
      update: faq6Translations[lang],
      create: {
        faqId: faq6.id,
        language: Language[lang],
        ...faq6Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 6: Contacts");

  // ──────────────────────────────────────────────
  // Done
  // ──────────────────────────────────────────────
  console.log(`
🏔️ Trail da Tapada Real de Mafra 2026 seed completed!
──────────────────────────────────────────────
- Slug: trail-tapada-real-mafra-2026
- Date: April 19, 2026
- Location: Tapada Nacional de Mafra, Mafra
- Variants: Trail Longo (20km), Trail Curto (12km), Caminhada (12km)
- Pricing Phases: 3 phases × 3 variants = 9 pricing phases
- FAQs: 7 with translations in 6 languages
- Circuits: Mafra Trail Running Series, Merrell Trail Running Series
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
