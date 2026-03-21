/**
 * Seed: 2ª Edição Trail Capital do Arinto 2026
 *
 * Event: Trail running in Bucelas, Capital do Arinto (wine region)
 * Location: Bucelas, Loures, Portugal
 * Date: April 12, 2026
 * Organizer: Associação Desportiva Trilhos do Costume / Junta de Freguesia de Bucelas
 * Sport: Trail, Running
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🍇 Seeding Trail Capital do Arinto - Bucelas 2026...");

  // ──────────────────────────────────────────────
  // 1. Upsert Event (NO nested creates)
  // ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: "trail-capital-arinto-bucelas-2026" },
    update: {
      title: "2ª Edição Trail Capital do Arinto 2026",
      description:
        "2ª Edição Trail Capital do Arinto 2026 - Trail em Bucelas, Capital do Arinto",
      sportTypes: [SportType.TRAIL, SportType.RUNNING],
      startDate: new Date("2026-04-12T08:00:00Z"),
      endDate: new Date("2026-04-12T17:00:00Z"),
      registrationDeadline: new Date("2026-04-05T23:59:00Z"),
      externalUrl:
        "https://www.trilhoperdido.com/evento/Trail-Capital-do-Arinto",
      imageUrl: "",
      city: "Bucelas",
      country: "Portugal",
      latitude: 38.8897,
      longitude: -9.1211,
      googleMapsUrl: "https://maps.google.com/?q=38.8897,-9.1211",
      isFeatured: false,
      cancelled: false,
    },
    create: {
      title: "2ª Edição Trail Capital do Arinto 2026",
      slug: "trail-capital-arinto-bucelas-2026",
      description:
        "2ª Edição Trail Capital do Arinto 2026 - Trail em Bucelas, Capital do Arinto",
      sportTypes: [SportType.TRAIL, SportType.RUNNING],
      startDate: new Date("2026-04-12T08:00:00Z"),
      endDate: new Date("2026-04-12T17:00:00Z"),
      registrationDeadline: new Date("2026-04-05T23:59:00Z"),
      externalUrl:
        "https://www.trilhoperdido.com/evento/Trail-Capital-do-Arinto",
      imageUrl: "",
      city: "Bucelas",
      country: "Portugal",
      latitude: 38.8897,
      longitude: -9.1211,
      googleMapsUrl: "https://maps.google.com/?q=38.8897,-9.1211",
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
      title: "2ª Edição Trail Capital do Arinto 2026",
      description: `# 🍇 2ª Edição Trail Capital do Arinto 2026

**A 2ª Edição do Trail Capital do Arinto realiza-se a 12 de abril de 2026 em Bucelas, Loures!** Organizado pela **Associação Desportiva Trilhos do Costume** com apoio institucional da **Junta de Freguesia de Bucelas**, os percursos atravessam zonas de grande beleza natural, património cultural e ambiental da região vinícola do Arinto, com DOC desde 1911.

Prova em regime de semi-autossuficiência — não são distribuídos copos nos abastecimentos. Traz o teu recipiente! Medalha de finisher para TODOS os participantes.

---

## 🏔️ Provas

- **Trail Ultra** – 46 km · Partida 08:00
- **Trail Longo** – 30 km · Partida 08:30
- **Trail Curto** – 17 km · Partida 09:00
- **Mini Trail** – 10 km · Partida 09:30
- **Caminhada** – 10 km · Partida 09:40 · Não competitiva

---

## 🏅 Circuitos

- Ultra: Circuito de Trail Ultra AAL + Circuito Nacional de Trail Ultra ATRP
- Trail Longo: Circuito de Trail Longo AAL + Circuito Nacional de Trail ATRP
- Trail Curto: Circuito Nacional de Trail Sprint ATRP

---

🍇 **Vem trilhar na Capital do Arinto!** 🏔️`,
      city: "Bucelas",
      metaTitle: "2ª Trail Capital do Arinto 2026 | Bucelas, Loures | 12 Abril",
      metaDescription:
        "2ª Edição Trail Capital do Arinto a 12 de abril de 2026 em Bucelas. Trail Ultra 46km, Trail Longo 30km, Trail Curto 17km, Mini Trail 10km e Caminhada 10km. Circuitos AAL e ATRP.",
    },
    en: {
      title: "2nd Edition Trail Capital do Arinto 2026",
      description: `# 🍇 2nd Edition Trail Capital do Arinto 2026

**The 2nd Edition of Trail Capital do Arinto takes place on April 12, 2026 in Bucelas, Loures!** Organized by **Associação Desportiva Trilhos do Costume** with institutional support from **Junta de Freguesia de Bucelas**, the courses run through areas of great natural beauty, cultural and environmental heritage of the Arinto wine region, with DOC since 1911.

Semi self-sufficiency race — no cups at aid stations. Bring your own container! Finisher medal for ALL participants.

---

## 🏔️ Races

- **Ultra Trail** – 46 km · Start 08:00
- **Long Trail** – 30 km · Start 08:30
- **Short Trail** – 17 km · Start 09:00
- **Mini Trail** – 10 km · Start 09:30
- **Walk** – 10 km · Start 09:40 · Non-competitive

---

## 🏅 Circuits

- Ultra: AAL Ultra Trail Circuit + ATRP National Ultra Trail Circuit
- Long Trail: AAL Long Trail Circuit + ATRP National Trail Circuit
- Short Trail: ATRP National Trail Sprint Circuit

---

🍇 **Come trail in the Capital of Arinto!** 🏔️`,
      city: "Bucelas",
      metaTitle:
        "2nd Trail Capital do Arinto 2026 | Bucelas, Loures | April 12",
      metaDescription:
        "2nd Edition Trail Capital do Arinto on April 12, 2026 in Bucelas. Ultra Trail 46km, Long Trail 30km, Short Trail 17km, Mini Trail 10km and Walk 10km. AAL and ATRP circuits.",
    },
    es: {
      title: "2ª Edición Trail Capital do Arinto 2026",
      description: `# 🍇 2ª Edición Trail Capital do Arinto 2026

**La 2ª Edición del Trail Capital do Arinto se celebra el 12 de abril de 2026 en Bucelas, Loures.** Organizado por la **Associação Desportiva Trilhos do Costume** con apoyo institucional de la **Junta de Freguesia de Bucelas**, los recorridos atraviesan zonas de gran belleza natural, patrimonio cultural y ambiental de la región vinícola del Arinto, con DOC desde 1911.

Prueba en régimen de semi-autosuficiencia — no se distribuyen vasos en los avituallamientos. ¡Trae tu recipiente! Medalla finisher para TODOS los participantes.

---

## 🏔️ Pruebas

- **Trail Ultra** – 46 km · Salida 08:00
- **Trail Largo** – 30 km · Salida 08:30
- **Trail Corto** – 17 km · Salida 09:00
- **Mini Trail** – 10 km · Salida 09:30
- **Caminata** – 10 km · Salida 09:40 · No competitiva

---

## 🏅 Circuitos

- Ultra: Circuito de Trail Ultra AAL + Circuito Nacional de Trail Ultra ATRP
- Trail Largo: Circuito de Trail Largo AAL + Circuito Nacional de Trail ATRP
- Trail Corto: Circuito Nacional de Trail Sprint ATRP

---

🍇 **¡Ven a correr por la Capital del Arinto!** 🏔️`,
      city: "Bucelas",
      metaTitle: "2ª Trail Capital do Arinto 2026 | Bucelas, Loures | 12 Abril",
      metaDescription:
        "2ª Edición Trail Capital do Arinto el 12 de abril de 2026 en Bucelas. Trail Ultra 46km, Trail Largo 30km, Trail Corto 17km, Mini Trail 10km y Caminata 10km. Circuitos AAL y ATRP.",
    },
    fr: {
      title: "2ème Édition Trail Capital do Arinto 2026",
      description: `# 🍇 2ème Édition Trail Capital do Arinto 2026

**La 2ème Édition du Trail Capital do Arinto a lieu le 12 avril 2026 à Bucelas, Loures !** Organisé par l'**Associação Desportiva Trilhos do Costume** avec le soutien institutionnel de la **Junta de Freguesia de Bucelas**, les parcours traversent des zones de grande beauté naturelle, patrimoine culturel et environnemental de la région viticole de l'Arinto, AOC depuis 1911.

Course en semi-autosuffisance — pas de gobelets aux ravitaillements. Apportez votre récipient ! Médaille finisher pour TOUS les participants.

---

## 🏔️ Épreuves

- **Trail Ultra** – 46 km · Départ 08h00
- **Trail Long** – 30 km · Départ 08h30
- **Trail Court** – 17 km · Départ 09h00
- **Mini Trail** – 10 km · Départ 09h30
- **Randonnée** – 10 km · Départ 09h40 · Non compétitive

---

## 🏅 Circuits

- Ultra : Circuit de Trail Ultra AAL + Circuit National de Trail Ultra ATRP
- Trail Long : Circuit de Trail Long AAL + Circuit National de Trail ATRP
- Trail Court : Circuit National de Trail Sprint ATRP

---

🍇 **Venez courir dans la Capitale de l'Arinto !** 🏔️`,
      city: "Bucelas",
      metaTitle:
        "2ème Trail Capital do Arinto 2026 | Bucelas, Loures | 12 Avril",
      metaDescription:
        "2ème Édition Trail Capital do Arinto le 12 avril 2026 à Bucelas. Trail Ultra 46km, Trail Long 30km, Trail Court 17km, Mini Trail 10km et Randonnée 10km. Circuits AAL et ATRP.",
    },
    de: {
      title: "2. Ausgabe Trail Capital do Arinto 2026",
      description: `# 🍇 2. Ausgabe Trail Capital do Arinto 2026

**Die 2. Ausgabe des Trail Capital do Arinto findet am 12. April 2026 in Bucelas, Loures statt!** Organisiert vom **Associação Desportiva Trilhos do Costume** mit institutioneller Unterstützung der **Junta de Freguesia de Bucelas** führen die Strecken durch Gebiete von großer natürlicher Schönheit, kulturellem und ökologischem Erbe der Arinto-Weinregion, mit DOC seit 1911.

Halbautarkes Rennen — keine Becher an Verpflegungsstationen. Bring deinen eigenen Behälter! Finisher-Medaille für ALLE Teilnehmer.

---

## 🏔️ Rennen

- **Trail Ultra** – 46 km · Start 08:00
- **Trail Lang** – 30 km · Start 08:30
- **Trail Kurz** – 17 km · Start 09:00
- **Mini Trail** – 10 km · Start 09:30
- **Wanderung** – 10 km · Start 09:40 · Nicht kompetitiv

---

## 🏅 Serien

- Ultra: AAL Ultra-Trail-Serie + ATRP Nationale Ultra-Trail-Serie
- Trail Lang: AAL Lang-Trail-Serie + ATRP Nationale Trail-Serie
- Trail Kurz: ATRP Nationale Trail-Sprint-Serie

---

🍇 **Komm und laufe in der Hauptstadt des Arinto!** 🏔️`,
      city: "Bucelas",
      metaTitle:
        "2. Trail Capital do Arinto 2026 | Bucelas, Loures | 12. April",
      metaDescription:
        "2. Ausgabe Trail Capital do Arinto am 12. April 2026 in Bucelas. Trail Ultra 46km, Trail Lang 30km, Trail Kurz 17km, Mini Trail 10km und Wanderung 10km. AAL- und ATRP-Serien.",
    },
    it: {
      title: "2ª Edizione Trail Capital do Arinto 2026",
      description: `# 🍇 2ª Edizione Trail Capital do Arinto 2026

**La 2ª Edizione del Trail Capital do Arinto si svolge il 12 aprile 2026 a Bucelas, Loures!** Organizzato dall'**Associação Desportiva Trilhos do Costume** con il supporto istituzionale della **Junta de Freguesia de Bucelas**, i percorsi attraversano zone di grande bellezza naturale, patrimonio culturale e ambientale della regione vinicola dell'Arinto, con DOC dal 1911.

Gara in semi-autosufficienza — niente bicchieri ai rifornimenti. Porta il tuo contenitore! Medaglia finisher per TUTTI i partecipanti.

---

## 🏔️ Gare

- **Trail Ultra** – 46 km · Partenza 08:00
- **Trail Lungo** – 30 km · Partenza 08:30
- **Trail Corto** – 17 km · Partenza 09:00
- **Mini Trail** – 10 km · Partenza 09:30
- **Camminata** – 10 km · Partenza 09:40 · Non competitiva

---

## 🏅 Circuiti

- Ultra: Circuito di Trail Ultra AAL + Circuito Nazionale di Trail Ultra ATRP
- Trail Lungo: Circuito di Trail Lungo AAL + Circuito Nazionale di Trail ATRP
- Trail Corto: Circuito Nazionale di Trail Sprint ATRP

---

🍇 **Vieni a correre nella Capitale dell'Arinto!** 🏔️`,
      city: "Bucelas",
      metaTitle:
        "2ª Trail Capital do Arinto 2026 | Bucelas, Loures | 12 Aprile",
      metaDescription:
        "2ª Edizione Trail Capital do Arinto il 12 aprile 2026 a Bucelas. Trail Ultra 46km, Trail Lungo 30km, Trail Corto 17km, Mini Trail 10km e Camminata 10km. Circuiti AAL e ATRP.",
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

  // ── Variant 1: Trail Ultra ──
  const trailUltra = await findOrCreateVariant({
    name: "Trail Ultra",
    distanceKm: 46,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-12T08:00:00Z"),
    startTime: "08:00",
    cutoffTimeHours: 8,
    price: 25.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Trail Ultra · 46 km · Idade mínima 18 anos · Cutoff 8h",
  });
  console.log(`✅ Variant: ${trailUltra.name}`);

  // ── Variant 2: Trail Longo ──
  const trailLongo = await findOrCreateVariant({
    name: "Trail Longo",
    distanceKm: 30,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-12T08:30:00Z"),
    startTime: "08:30",
    cutoffTimeHours: 8,
    price: 16.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Trail Longo · 30 km · Idade mínima 18 anos · Cutoff 8h",
  });
  console.log(`✅ Variant: ${trailLongo.name}`);

  // ── Variant 3: Trail Curto ──
  const trailCurto = await findOrCreateVariant({
    name: "Trail Curto",
    distanceKm: 17,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-12T09:00:00Z"),
    startTime: "09:00",
    cutoffTimeHours: 8,
    price: 14.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Trail Curto · 17 km · Idade mínima 18 anos · Cutoff 8h",
  });
  console.log(`✅ Variant: ${trailCurto.name}`);

  // ── Variant 4: Mini Trail ──
  const miniTrail = await findOrCreateVariant({
    name: "Mini Trail",
    distanceKm: 10,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-12T09:30:00Z"),
    startTime: "09:30",
    cutoffTimeHours: 8,
    price: 12.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Mini Trail · 10 km · Cutoff 8h",
  });
  console.log(`✅ Variant: ${miniTrail.name}`);

  // ── Variant 5: Caminhada ──
  const caminhada = await findOrCreateVariant({
    name: "Caminhada",
    distanceKm: 10,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-12T09:40:00Z"),
    startTime: "09:40",
    cutoffTimeHours: null,
    price: 10.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Caminhada · 10 km · Não competitiva",
  });
  console.log(`✅ Variant: ${caminhada.name}`);

  // ── Variant Translations (ALL 6 languages) ──
  const variantTranslations: Record<
    string,
    Record<string, { name: string; description: string | null }>
  > = {
    trailUltra: {
      pt: {
        name: "Trail Ultra",
        description: "Trail Ultra · 46 km · Idade mínima 18 anos · Cutoff 8h",
      },
      en: {
        name: "Ultra Trail",
        description: "Ultra Trail · 46 km · Minimum age 18 · Cutoff 8h",
      },
      es: {
        name: "Trail Ultra",
        description: "Trail Ultra · 46 km · Edad mínima 18 años · Cutoff 8h",
      },
      fr: {
        name: "Trail Ultra",
        description: "Trail Ultra · 46 km · Âge minimum 18 ans · Cutoff 8h",
      },
      de: {
        name: "Trail Ultra",
        description: "Trail Ultra · 46 km · Mindestalter 18 Jahre · Cutoff 8h",
      },
      it: {
        name: "Trail Ultra",
        description: "Trail Ultra · 46 km · Età minima 18 anni · Cutoff 8h",
      },
    },
    trailLongo: {
      pt: {
        name: "Trail Longo",
        description: "Trail Longo · 30 km · Idade mínima 18 anos · Cutoff 8h",
      },
      en: {
        name: "Long Trail",
        description: "Long Trail · 30 km · Minimum age 18 · Cutoff 8h",
      },
      es: {
        name: "Trail Largo",
        description: "Trail Largo · 30 km · Edad mínima 18 años · Cutoff 8h",
      },
      fr: {
        name: "Trail Long",
        description: "Trail Long · 30 km · Âge minimum 18 ans · Cutoff 8h",
      },
      de: {
        name: "Langer Trail",
        description: "Langer Trail · 30 km · Mindestalter 18 Jahre · Cutoff 8h",
      },
      it: {
        name: "Trail Lungo",
        description: "Trail Lungo · 30 km · Età minima 18 anni · Cutoff 8h",
      },
    },
    trailCurto: {
      pt: {
        name: "Trail Curto",
        description: "Trail Curto · 17 km · Idade mínima 18 anos · Cutoff 8h",
      },
      en: {
        name: "Short Trail",
        description: "Short Trail · 17 km · Minimum age 18 · Cutoff 8h",
      },
      es: {
        name: "Trail Corto",
        description: "Trail Corto · 17 km · Edad mínima 18 años · Cutoff 8h",
      },
      fr: {
        name: "Trail Court",
        description: "Trail Court · 17 km · Âge minimum 18 ans · Cutoff 8h",
      },
      de: {
        name: "Kurzer Trail",
        description: "Kurzer Trail · 17 km · Mindestalter 18 Jahre · Cutoff 8h",
      },
      it: {
        name: "Trail Corto",
        description: "Trail Corto · 17 km · Età minima 18 anni · Cutoff 8h",
      },
    },
    miniTrail: {
      pt: { name: "Mini Trail", description: "Mini Trail · 10 km · Cutoff 8h" },
      en: { name: "Mini Trail", description: "Mini Trail · 10 km · Cutoff 8h" },
      es: { name: "Mini Trail", description: "Mini Trail · 10 km · Cutoff 8h" },
      fr: { name: "Mini Trail", description: "Mini Trail · 10 km · Cutoff 8h" },
      de: { name: "Mini Trail", description: "Mini Trail · 10 km · Cutoff 8h" },
      it: { name: "Mini Trail", description: "Mini Trail · 10 km · Cutoff 8h" },
    },
    caminhada: {
      pt: {
        name: "Caminhada",
        description: "Caminhada · 10 km · Não competitiva",
      },
      en: { name: "Walk", description: "Walk · 10 km · Non-competitive" },
      es: {
        name: "Caminata",
        description: "Caminata · 10 km · No competitiva",
      },
      fr: {
        name: "Randonnée",
        description: "Randonnée · 10 km · Non compétitive",
      },
      de: {
        name: "Wanderung",
        description: "Wanderung · 10 km · Nicht kompetitiv",
      },
      it: {
        name: "Camminata",
        description: "Camminata · 10 km · Non competitiva",
      },
    },
  };

  const variantMap = [
    { variant: trailUltra, key: "trailUltra" },
    { variant: trailLongo, key: "trailLongo" },
    { variant: trailCurto, key: "trailCurto" },
    { variant: miniTrail, key: "miniTrail" },
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

  // Phase 1: Dec 8, 2025 → Dec 31, 2025
  await findOrCreatePricingPhase("Trail Ultra - 1ª Fase", trailUltra.id, {
    startDate: new Date("2025-12-08T00:00:00Z"),
    endDate: new Date("2025-12-31T23:59:59Z"),
    price: 25.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Trail Longo - 1ª Fase", trailLongo.id, {
    startDate: new Date("2025-12-08T00:00:00Z"),
    endDate: new Date("2025-12-31T23:59:59Z"),
    price: 16.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Trail Curto - 1ª Fase", trailCurto.id, {
    startDate: new Date("2025-12-08T00:00:00Z"),
    endDate: new Date("2025-12-31T23:59:59Z"),
    price: 14.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Mini Trail - 1ª Fase", miniTrail.id, {
    startDate: new Date("2025-12-08T00:00:00Z"),
    endDate: new Date("2025-12-31T23:59:59Z"),
    price: 12.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Caminhada - 1ª Fase", caminhada.id, {
    startDate: new Date("2025-12-08T00:00:00Z"),
    endDate: new Date("2025-12-31T23:59:59Z"),
    price: 10.0,
    currency: Currency.EUR,
    note: null,
  });
  console.log("✅ Pricing Phase 1 created for all variants");

  // Phase 2: Jan 1, 2026 → Feb 28, 2026
  await findOrCreatePricingPhase("Trail Ultra - 2ª Fase", trailUltra.id, {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-02-28T23:59:59Z"),
    price: 27.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Trail Longo - 2ª Fase", trailLongo.id, {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-02-28T23:59:59Z"),
    price: 18.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Trail Curto - 2ª Fase", trailCurto.id, {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-02-28T23:59:59Z"),
    price: 16.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Mini Trail - 2ª Fase", miniTrail.id, {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-02-28T23:59:59Z"),
    price: 14.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Caminhada - 2ª Fase", caminhada.id, {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-02-28T23:59:59Z"),
    price: 12.0,
    currency: Currency.EUR,
    note: null,
  });
  console.log("✅ Pricing Phase 2 created for all variants");

  // Phase 3: Mar 1, 2026 → Mar 29, 2026
  await findOrCreatePricingPhase("Trail Ultra - 3ª Fase", trailUltra.id, {
    startDate: new Date("2026-03-01T00:00:00Z"),
    endDate: new Date("2026-03-29T23:59:59Z"),
    price: 30.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Trail Longo - 3ª Fase", trailLongo.id, {
    startDate: new Date("2026-03-01T00:00:00Z"),
    endDate: new Date("2026-03-29T23:59:59Z"),
    price: 20.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Trail Curto - 3ª Fase", trailCurto.id, {
    startDate: new Date("2026-03-01T00:00:00Z"),
    endDate: new Date("2026-03-29T23:59:59Z"),
    price: 18.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Mini Trail - 3ª Fase", miniTrail.id, {
    startDate: new Date("2026-03-01T00:00:00Z"),
    endDate: new Date("2026-03-29T23:59:59Z"),
    price: 15.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Caminhada - 3ª Fase", caminhada.id, {
    startDate: new Date("2026-03-01T00:00:00Z"),
    endDate: new Date("2026-03-29T23:59:59Z"),
    price: 13.0,
    currency: Currency.EUR,
    note: null,
  });
  console.log("✅ Pricing Phase 3 created for all variants");

  // Phase 4: Mar 30, 2026 → Apr 5, 2026
  await findOrCreatePricingPhase("Trail Ultra - 4ª Fase", trailUltra.id, {
    startDate: new Date("2026-03-30T00:00:00Z"),
    endDate: new Date("2026-04-05T23:59:59Z"),
    price: 35.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Trail Longo - 4ª Fase", trailLongo.id, {
    startDate: new Date("2026-03-30T00:00:00Z"),
    endDate: new Date("2026-04-05T23:59:59Z"),
    price: 25.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Trail Curto - 4ª Fase", trailCurto.id, {
    startDate: new Date("2026-03-30T00:00:00Z"),
    endDate: new Date("2026-04-05T23:59:59Z"),
    price: 20.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Mini Trail - 4ª Fase", miniTrail.id, {
    startDate: new Date("2026-03-30T00:00:00Z"),
    endDate: new Date("2026-04-05T23:59:59Z"),
    price: 18.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Caminhada - 4ª Fase", caminhada.id, {
    startDate: new Date("2026-03-30T00:00:00Z"),
    endDate: new Date("2026-04-05T23:59:59Z"),
    price: 14.0,
    currency: Currency.EUR,
    note: null,
  });
  console.log("✅ Pricing Phase 4 created for all variants");

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
    "Sábado 11 de abril: Levantamento de dorsais das 15:00 às 19:00 no Largo Espírito Santo, Bucelas. Domingo 12 de abril: Secretariado a partir das 07:00. Trail Ultra: 08:00. Trail Longo: 08:30. Trail Curto: 09:00. Mini Trail: 09:30. Caminhada: 09:40. Partida e chegada no Largo Espírito Santo, Bucelas."
  );

  const faq0Translations = {
    pt: {
      question: "Qual é o horário do evento?",
      answer:
        "Sábado 11 de abril: Levantamento de dorsais das 15:00 às 19:00 no Largo Espírito Santo, Bucelas. Domingo 12 de abril: Secretariado a partir das 07:00. Trail Ultra: 08:00. Trail Longo: 08:30. Trail Curto: 09:00. Mini Trail: 09:30. Caminhada: 09:40. Partida e chegada no Largo Espírito Santo, Bucelas.",
    },
    en: {
      question: "What is the event schedule?",
      answer:
        "Saturday April 11: Bib collection from 15:00 to 19:00 at Largo Espírito Santo, Bucelas. Sunday April 12: Registration desk from 07:00. Ultra Trail: 08:00. Long Trail: 08:30. Short Trail: 09:00. Mini Trail: 09:30. Walk: 09:40. Start/finish at Largo Espírito Santo, Bucelas.",
    },
    es: {
      question: "¿Cuál es el horario del evento?",
      answer:
        "Sábado 11 de abril: Recogida de dorsales de 15:00 a 19:00 en Largo Espírito Santo, Bucelas. Domingo 12 de abril: Secretaría desde las 07:00. Trail Ultra: 08:00. Trail Largo: 08:30. Trail Corto: 09:00. Mini Trail: 09:30. Caminata: 09:40. Salida y meta en Largo Espírito Santo, Bucelas.",
    },
    fr: {
      question: "Quel est le programme de l'événement ?",
      answer:
        "Samedi 11 avril : Retrait des dossards de 15h00 à 19h00 au Largo Espírito Santo, Bucelas. Dimanche 12 avril : Secrétariat à partir de 07h00. Trail Ultra : 08h00. Trail Long : 08h30. Trail Court : 09h00. Mini Trail : 09h30. Randonnée : 09h40. Départ et arrivée au Largo Espírito Santo, Bucelas.",
    },
    de: {
      question: "Wie ist der Zeitplan der Veranstaltung?",
      answer:
        "Samstag 11. April: Startnummernausgabe von 15:00 bis 19:00 am Largo Espírito Santo, Bucelas. Sonntag 12. April: Sekretariat ab 07:00. Trail Ultra: 08:00. Langer Trail: 08:30. Kurzer Trail: 09:00. Mini Trail: 09:30. Wanderung: 09:40. Start/Ziel am Largo Espírito Santo, Bucelas.",
    },
    it: {
      question: "Qual è il programma dell'evento?",
      answer:
        "Sabato 11 aprile: Ritiro pettorali dalle 15:00 alle 19:00 al Largo Espírito Santo, Bucelas. Domenica 12 aprile: Segreteria dalle 07:00. Trail Ultra: 08:00. Trail Lungo: 08:30. Trail Corto: 09:00. Mini Trail: 09:30. Camminata: 09:40. Partenza e arrivo al Largo Espírito Santo, Bucelas.",
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
    "Provas competitivas (Ultra, Longo, Curto, Mini Trail): dorsal com chip, seguro desportivo, medalha de finisher e ofertas de patrocinadores. Caminhada: dorsal, seguro desportivo e medalha de finisher."
  );

  const faq1Translations = {
    pt: {
      question: "O que está incluído na inscrição?",
      answer:
        "Provas competitivas (Ultra, Longo, Curto, Mini Trail): dorsal com chip, seguro desportivo, medalha de finisher e ofertas de patrocinadores. Caminhada: dorsal, seguro desportivo e medalha de finisher.",
    },
    en: {
      question: "What is included in the registration?",
      answer:
        "Competitive races (Ultra, Long, Short, Mini Trail): bib with chip, sports insurance, finisher medal and sponsor gifts. Walk: bib, sports insurance and finisher medal.",
    },
    es: {
      question: "¿Qué incluye la inscripción?",
      answer:
        "Pruebas competitivas (Ultra, Largo, Corto, Mini Trail): dorsal con chip, seguro deportivo, medalla de finisher y regalos de patrocinadores. Caminata: dorsal, seguro deportivo y medalla de finisher.",
    },
    fr: {
      question: "Que comprend l'inscription ?",
      answer:
        "Courses compétitives (Ultra, Long, Court, Mini Trail) : dossard avec puce, assurance sportive, médaille de finisher et cadeaux de sponsors. Randonnée : dossard, assurance sportive et médaille de finisher.",
    },
    de: {
      question: "Was ist in der Anmeldung enthalten?",
      answer:
        "Wettkampfläufe (Ultra, Lang, Kurz, Mini Trail): Startnummer mit Chip, Sportversicherung, Finisher-Medaille und Sponsorengeschenke. Wanderung: Startnummer, Sportversicherung und Finisher-Medaille.",
    },
    it: {
      question: "Cosa è incluso nell'iscrizione?",
      answer:
        "Gare competitive (Ultra, Lungo, Corto, Mini Trail): pettorale con chip, assicurazione sportiva, medaglia finisher e omaggi degli sponsor. Camminata: pettorale, assicurazione sportiva e medaglia finisher.",
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
    "TODOS: dorsal visível e telemóvel com bateria. Trail Ultra e Trail Longo: reservatório de água (mín. 1L), apito e manta térmica. Trail Curto: apito e manta térmica. Mini Trail: apito. Caminhada: sem material extra obrigatório."
  );

  const faq2Translations = {
    pt: {
      question: "Qual é o material obrigatório?",
      answer:
        "TODOS: dorsal visível e telemóvel com bateria. Trail Ultra e Trail Longo: reservatório de água (mín. 1L), apito e manta térmica. Trail Curto: apito e manta térmica. Mini Trail: apito. Caminhada: sem material extra obrigatório.",
    },
    en: {
      question: "What mandatory equipment is required?",
      answer:
        "ALL: visible bib and working mobile phone. Ultra Trail and Long Trail: water reservoir (min. 1L), whistle and thermal blanket. Short Trail: whistle and thermal blanket. Mini Trail: whistle. Walk: no extra mandatory equipment.",
    },
    es: {
      question: "¿Cuál es el equipamiento obligatorio?",
      answer:
        "TODOS: dorsal visible y teléfono móvil con batería. Trail Ultra y Trail Largo: depósito de agua (mín. 1L), silbato y manta térmica. Trail Corto: silbato y manta térmica. Mini Trail: silbato. Caminata: sin equipamiento extra obligatorio.",
    },
    fr: {
      question: "Quel est l'équipement obligatoire ?",
      answer:
        "TOUS : dossard visible et téléphone portable avec batterie. Trail Ultra et Trail Long : réservoir d'eau (min. 1L), sifflet et couverture de survie. Trail Court : sifflet et couverture de survie. Mini Trail : sifflet. Randonnée : pas d'équipement supplémentaire obligatoire.",
    },
    de: {
      question: "Welche Pflichtausrüstung wird benötigt?",
      answer:
        "ALLE: sichtbare Startnummer und Mobiltelefon mit Akku. Trail Ultra und Langer Trail: Wasserbehälter (min. 1L), Pfeife und Rettungsdecke. Kurzer Trail: Pfeife und Rettungsdecke. Mini Trail: Pfeife. Wanderung: keine zusätzliche Pflichtausrüstung.",
    },
    it: {
      question: "Qual è l'equipaggiamento obbligatorio?",
      answer:
        "TUTTI: pettorale visibile e telefono cellulare con batteria. Trail Ultra e Trail Lungo: serbatoio d'acqua (min. 1L), fischietto e coperta termica. Trail Corto: fischietto e coperta termica. Mini Trail: fischietto. Camminata: nessun equipaggiamento extra obbligatorio.",
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
    "A prova é em regime de semi-autossuficiência. Existem 5 PAC (postos de abastecimento/controlo) ao longo dos percursos com abastecimento sólido e líquido, mas NÃO são distribuídos copos. Cada atleta deve trazer o seu próprio recipiente para água."
  );

  const faq3Translations = {
    pt: {
      question: "Como funcionam os abastecimentos?",
      answer:
        "A prova é em regime de semi-autossuficiência. Existem 5 PAC (postos de abastecimento/controlo) ao longo dos percursos com abastecimento sólido e líquido, mas NÃO são distribuídos copos. Cada atleta deve trazer o seu próprio recipiente para água.",
    },
    en: {
      question: "How do the aid stations work?",
      answer:
        "The race follows a semi self-sufficiency model. There are 5 aid/control posts along the courses with solid and liquid supplies, but NO cups are distributed. Each athlete must bring their own water container.",
    },
    es: {
      question: "¿Cómo funcionan los avituallamientos?",
      answer:
        "La prueba es en régimen de semi-autosuficiencia. Hay 5 puestos de avituallamiento/control a lo largo de los recorridos con suministro sólido y líquido, pero NO se distribuyen vasos. Cada atleta debe traer su propio recipiente para agua.",
    },
    fr: {
      question: "Comment fonctionnent les ravitaillements ?",
      answer:
        "La course se déroule en semi-autosuffisance. Il y a 5 postes de ravitaillement/contrôle le long des parcours avec ravitaillement solide et liquide, mais AUCUN gobelet n'est distribué. Chaque athlète doit apporter son propre récipient pour l'eau.",
    },
    de: {
      question: "Wie funktionieren die Verpflegungsstationen?",
      answer:
        "Das Rennen folgt einem halbautarken Modell. Es gibt 5 Verpflegungs-/Kontrollposten entlang der Strecken mit fester und flüssiger Verpflegung, aber es werden KEINE Becher verteilt. Jeder Athlet muss seinen eigenen Wasserbehälter mitbringen.",
    },
    it: {
      question: "Come funzionano i rifornimenti?",
      answer:
        "La gara si svolge in regime di semi-autosufficienza. Ci sono 5 punti di rifornimento/controllo lungo i percorsi con rifornimento solido e liquido, ma NON vengono distribuiti bicchieri. Ogni atleta deve portare il proprio contenitore per l'acqua.",
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
    "Provas competitivas (Ultra, Longo, Curto, Mini Trail): troféus para os 3 primeiros classificados gerais M/F, prémios para os 3 primeiros por escalão etário M/F e troféus para as 3 melhores equipas (3 melhores elementos independentemente do género). A Caminhada é não competitiva e não tem prémios."
  );

  const faq4Translations = {
    pt: {
      question: "Quais são os prémios?",
      answer:
        "Provas competitivas (Ultra, Longo, Curto, Mini Trail): troféus para os 3 primeiros classificados gerais M/F, prémios para os 3 primeiros por escalão etário M/F e troféus para as 3 melhores equipas (3 melhores elementos independentemente do género). A Caminhada é não competitiva e não tem prémios.",
    },
    en: {
      question: "What are the prizes?",
      answer:
        "Competitive races (Ultra, Long, Short, Mini Trail): trophies for top 3 overall M/F, prizes for top 3 per age category M/F and trophies for top 3 teams (best 3 members regardless of gender). The Walk is non-competitive with no prizes.",
    },
    es: {
      question: "¿Cuáles son los premios?",
      answer:
        "Pruebas competitivas (Ultra, Largo, Corto, Mini Trail): trofeos para los 3 primeros clasificados generales M/F, premios para los 3 primeros por categoría de edad M/F y trofeos para los 3 mejores equipos (3 mejores elementos sin importar el género). La Caminata es no competitiva y no tiene premios.",
    },
    fr: {
      question: "Quels sont les prix ?",
      answer:
        "Courses compétitives (Ultra, Long, Court, Mini Trail) : trophées pour les 3 premiers au classement général H/F, prix pour les 3 premiers par catégorie d'âge H/F et trophées pour les 3 meilleures équipes (3 meilleurs éléments indépendamment du genre). La Randonnée est non compétitive et sans prix.",
    },
    de: {
      question: "Welche Preise gibt es?",
      answer:
        "Wettkampfläufe (Ultra, Lang, Kurz, Mini Trail): Pokale für die Top 3 der Gesamtwertung M/W, Preise für die Top 3 nach Altersklasse M/W und Pokale für die 3 besten Teams (3 beste Mitglieder unabhängig vom Geschlecht). Die Wanderung ist nicht kompetitiv und ohne Preise.",
    },
    it: {
      question: "Quali sono i premi?",
      answer:
        "Gare competitive (Ultra, Lungo, Corto, Mini Trail): trofei per i primi 3 classificati generali M/F, premi per i primi 3 per categoria di età M/F e trofei per i 3 migliori team (3 migliori elementi indipendentemente dal genere). La Camminata è non competitiva e senza premi.",
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

  // ── FAQ 5: Optional extras ──
  const faq5 = await findOrCreateFAQ(
    event.id,
    5,
    "Existem extras opcionais?",
    "Sim! Almoço opcional por €7 (sopa + bifana + bebida + sobremesa). T-shirt opcional por €5. Ambos podem ser adquiridos no momento da inscrição."
  );

  const faq5Translations = {
    pt: {
      question: "Existem extras opcionais?",
      answer:
        "Sim! Almoço opcional por €7 (sopa + bifana + bebida + sobremesa). T-shirt opcional por €5. Ambos podem ser adquiridos no momento da inscrição.",
    },
    en: {
      question: "Are there optional extras?",
      answer:
        "Yes! Optional lunch for €7 (soup + bifana sandwich + drink + dessert). Optional T-shirt for €5. Both can be purchased at registration.",
    },
    es: {
      question: "¿Hay extras opcionales?",
      answer:
        "¡Sí! Almuerzo opcional por €7 (sopa + bocadillo bifana + bebida + postre). Camiseta opcional por €5. Ambos se pueden adquirir en el momento de la inscripción.",
    },
    fr: {
      question: "Y a-t-il des extras optionnels ?",
      answer:
        "Oui ! Déjeuner optionnel à 7 € (soupe + sandwich bifana + boisson + dessert). T-shirt optionnel à 5 €. Les deux peuvent être achetés lors de l'inscription.",
    },
    de: {
      question: "Gibt es optionale Extras?",
      answer:
        "Ja! Optionales Mittagessen für 7 € (Suppe + Bifana-Sandwich + Getränk + Dessert). Optionales T-Shirt für 5 €. Beides kann bei der Anmeldung erworben werden.",
    },
    it: {
      question: "Ci sono extra opzionali?",
      answer:
        "Sì! Pranzo opzionale a €7 (zuppa + panino bifana + bevanda + dessert). T-shirt opzionale a €5. Entrambi possono essere acquistati al momento dell'iscrizione.",
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
  console.log("✅ FAQ 5: Optional extras");

  // ── FAQ 6: Contacts ──
  const faq6 = await findOrCreateFAQ(
    event.id,
    6,
    "Quais são os contactos da organização?",
    "Organização: trilhosdocostume@gmail.com. Inscrições: trilhosdocostume@gmail.com / infotrilhoperdido@gmail.com."
  );

  const faq6Translations = {
    pt: {
      question: "Quais são os contactos da organização?",
      answer:
        "Organização: trilhosdocostume@gmail.com. Inscrições: trilhosdocostume@gmail.com / infotrilhoperdido@gmail.com.",
    },
    en: {
      question: "What are the organization's contacts?",
      answer:
        "Organization: trilhosdocostume@gmail.com. Registrations: trilhosdocostume@gmail.com / infotrilhoperdido@gmail.com.",
    },
    es: {
      question: "¿Cuáles son los contactos de la organización?",
      answer:
        "Organización: trilhosdocostume@gmail.com. Inscripciones: trilhosdocostume@gmail.com / infotrilhoperdido@gmail.com.",
    },
    fr: {
      question: "Quels sont les contacts de l'organisation ?",
      answer:
        "Organisation : trilhosdocostume@gmail.com. Inscriptions : trilhosdocostume@gmail.com / infotrilhoperdido@gmail.com.",
    },
    de: {
      question: "Was sind die Kontaktdaten der Organisation?",
      answer:
        "Organisation: trilhosdocostume@gmail.com. Anmeldung: trilhosdocostume@gmail.com / infotrilhoperdido@gmail.com.",
    },
    it: {
      question: "Quali sono i contatti dell'organizzazione?",
      answer:
        "Organizzazione: trilhosdocostume@gmail.com. Iscrizioni: trilhosdocostume@gmail.com / infotrilhoperdido@gmail.com.",
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
🍇 Trail Capital do Arinto - Bucelas 2026 seed completed!
──────────────────────────────────────────────
- Slug: trail-capital-arinto-bucelas-2026
- Date: April 12, 2026
- Location: Bucelas, Loures, Portugal
- Variants: Trail Ultra (46km), Trail Longo (30km), Trail Curto (17km), Mini Trail (10km), Caminhada (10km)
- Pricing Phases: 4 phases × 5 variants = 20 pricing phases
- FAQs: 7 with translations in 6 languages
- Circuits: AAL Ultra Trail, AAL Longo, ATRP Ultra, ATRP Nacional, ATRP Sprint
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
