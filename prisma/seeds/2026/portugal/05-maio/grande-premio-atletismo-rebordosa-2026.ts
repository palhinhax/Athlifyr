/**
 * Seed: XVII Grande Prémio de Atletismo de Rebordosa 2026
 *
 * Event: Road running + walk (Dia da Mãe) in Rebordosa, Paredes
 * Location: Rua Cândido Barbosa (Centro Escolar de Rebordosa), Rebordosa, Paredes
 * Date: May 2, 2026
 * Organizer: Grupo Desportivo da Portela
 * Sport: Running
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(
    "🏃 Seeding XVII Grande Prémio de Atletismo de Rebordosa 2026..."
  );

  // ──────────────────────────────────────────────
  // 1. Upsert Event (no nested creates)
  // ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: "grande-premio-atletismo-rebordosa-2026" },
    update: {
      title:
        "XVII Grande Prémio de Atletismo de Rebordosa – Corrida/Caminhada Dia da Mãe 2026",
      description:
        "XVII Grande Prémio de Atletismo de Rebordosa – Corrida/Caminhada Dia da Mãe 2026 em Rebordosa, Paredes",
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-05-02T15:30:00Z"),
      endDate: new Date("2026-05-02T21:00:00Z"),
      registrationDeadline: new Date("2026-04-29T23:59:59Z"),
      externalUrl: "https://www.portimer.pt",
      imageUrl: "",
      city: "Rebordosa",
      country: "Portugal",
      latitude: 41.215,
      longitude: -8.405,
      googleMapsUrl: "",
      isFeatured: false,
      cancelled: false,
    },
    create: {
      title:
        "XVII Grande Prémio de Atletismo de Rebordosa – Corrida/Caminhada Dia da Mãe 2026",
      slug: "grande-premio-atletismo-rebordosa-2026",
      description:
        "XVII Grande Prémio de Atletismo de Rebordosa – Corrida/Caminhada Dia da Mãe 2026 em Rebordosa, Paredes",
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-05-02T15:30:00Z"),
      endDate: new Date("2026-05-02T21:00:00Z"),
      registrationDeadline: new Date("2026-04-29T23:59:59Z"),
      externalUrl: "https://www.portimer.pt",
      imageUrl: "",
      city: "Rebordosa",
      country: "Portugal",
      latitude: 41.215,
      longitude: -8.405,
      googleMapsUrl: "",
      isFeatured: false,
      cancelled: false,
    },
  });

  console.log(`✅ Created/updated event: ${event.slug}`);

  // ──────────────────────────────────────────────
  // 2. Translations (ALL 6 languages) — CONCISE
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
      title:
        "XVII Grande Prémio de Atletismo de Rebordosa – Corrida/Caminhada Dia da Mãe 2026",
      description: `# 🏃 XVII Grande Prémio de Atletismo de Rebordosa 2026

**O XVII Grande Prémio de Atletismo de Rebordosa – Corrida/Caminhada Dia da Mãe realiza-se a 2 de maio de 2026 em Rebordosa, Paredes.** Organizado pelo Grupo Desportivo da Portela, com o apoio da Câmara Municipal de Paredes e da Associação de Atletismo do Porto. Partida e chegada na Rua Cândido Barbosa (Centro Escolar de Rebordosa). Aberto a atletas federados e não federados.

---

## 🏃 Provas

- **Benjamins A** – 400 m · Gratuito
- **Benjamins B** – 800 m · Gratuito
- **Infantis** – 1 000 m · Gratuito
- **Iniciados** – 2 000 m · Gratuito
- **Juvenis** – 3 000 m · Gratuito
- **Juniores** – 10 km
- **Seniores** – 10 km
- **Veteranos M40/M45/M50/M55** – 10 km
- **Caminhada** – 6 km · Não competitiva · €2

---

🏃 **Celebra o Dia da Mãe a correr em Rebordosa!** 🌷`,
      city: "Rebordosa, Paredes",
      metaTitle:
        "XVII GP Atletismo de Rebordosa – Dia da Mãe 2026 | Paredes | 2 Maio",
      metaDescription:
        "XVII Grande Prémio de Atletismo de Rebordosa 2026 – Corrida/Caminhada Dia da Mãe a 2 de maio em Rebordosa, Paredes. Provas de 400 m a 10 km. Caminhada 6 km. Organização Grupo Desportivo da Portela.",
    },
    en: {
      title:
        "XVII Grand Prix of Athletics of Rebordosa – Mother's Day Run/Walk 2026",
      description: `# 🏃 XVII Grand Prix of Athletics of Rebordosa 2026

**The XVII Grand Prix of Athletics of Rebordosa – Mother's Day Run/Walk takes place on May 2, 2026 in Rebordosa, Paredes.** Organized by Grupo Desportivo da Portela, with support from Paredes Municipality and the Porto Athletics Association. Start and finish on Rua Cândido Barbosa (Centro Escolar de Rebordosa). Open to federated and non-federated athletes.

---

## 🏃 Races

- **Benjamins A** – 400 m · Free
- **Benjamins B** – 800 m · Free
- **Infantis** – 1,000 m · Free
- **Iniciados** – 2,000 m · Free
- **Juvenis** – 3,000 m · Free
- **Juniores** – 10 km
- **Seniores** – 10 km
- **Veteranos M40/M45/M50/M55** – 10 km
- **Walk** – 6 km · Non-competitive · €2

---

🏃 **Celebrate Mother's Day running in Rebordosa!** 🌷`,
      city: "Rebordosa, Paredes",
      metaTitle:
        "XVII GP Athletics Rebordosa – Mother's Day 2026 | Paredes | May 2",
      metaDescription:
        "XVII Grand Prix of Athletics of Rebordosa 2026 – Mother's Day Run/Walk on May 2 in Rebordosa, Paredes. Races from 400 m to 10 km. 6 km Walk. Organized by Grupo Desportivo da Portela.",
    },
    es: {
      title:
        "XVII Gran Premio de Atletismo de Rebordosa – Carrera/Caminata Día de la Madre 2026",
      description: `# 🏃 XVII Gran Premio de Atletismo de Rebordosa 2026

**El XVII Gran Premio de Atletismo de Rebordosa – Carrera/Caminata Día de la Madre se celebra el 2 de mayo de 2026 en Rebordosa, Paredes.** Organizado por el Grupo Desportivo da Portela, con el apoyo del Ayuntamiento de Paredes y la Asociación de Atletismo de Oporto. Salida y meta en la Rua Cândido Barbosa (Centro Escolar de Rebordosa). Abierto a atletas federados y no federados.

---

## 🏃 Pruebas

- **Benjamins A** – 400 m · Gratis
- **Benjamins B** – 800 m · Gratis
- **Infantis** – 1 000 m · Gratis
- **Iniciados** – 2 000 m · Gratis
- **Juvenis** – 3 000 m · Gratis
- **Juniores** – 10 km
- **Seniores** – 10 km
- **Veteranos M40/M45/M50/M55** – 10 km
- **Caminata** – 6 km · No competitiva · 2 €

---

🏃 **¡Celebra el Día de la Madre corriendo en Rebordosa!** 🌷`,
      city: "Rebordosa, Paredes",
      metaTitle:
        "XVII GP Atletismo Rebordosa – Día de la Madre 2026 | Paredes | 2 Mayo",
      metaDescription:
        "XVII Gran Premio de Atletismo de Rebordosa 2026 – Carrera/Caminata Día de la Madre el 2 de mayo en Rebordosa, Paredes. Pruebas de 400 m a 10 km. Caminata 6 km. Organización Grupo Desportivo da Portela.",
    },
    fr: {
      title:
        "XVII Grand Prix d'Athlétisme de Rebordosa – Course/Marche Fête des Mères 2026",
      description: `# 🏃 XVII Grand Prix d'Athlétisme de Rebordosa 2026

**Le XVII Grand Prix d'Athlétisme de Rebordosa – Course/Marche Fête des Mères a lieu le 2 mai 2026 à Rebordosa, Paredes.** Organisé par le Grupo Desportivo da Portela, avec le soutien de la Municipalité de Paredes et de l'Association d'Athlétisme de Porto. Départ et arrivée Rua Cândido Barbosa (Centro Escolar de Rebordosa). Ouvert aux athlètes fédérés et non fédérés.

---

## 🏃 Épreuves

- **Benjamins A** – 400 m · Gratuit
- **Benjamins B** – 800 m · Gratuit
- **Infantis** – 1 000 m · Gratuit
- **Iniciados** – 2 000 m · Gratuit
- **Juvenis** – 3 000 m · Gratuit
- **Juniores** – 10 km
- **Seniores** – 10 km
- **Veteranos M40/M45/M50/M55** – 10 km
- **Marche** – 6 km · Non compétitive · 2 €

---

🏃 **Célébrez la Fête des Mères en courant à Rebordosa !** 🌷`,
      city: "Rebordosa, Paredes",
      metaTitle:
        "XVII GP Athlétisme Rebordosa – Fête des Mères 2026 | Paredes | 2 Mai",
      metaDescription:
        "XVII Grand Prix d'Athlétisme de Rebordosa 2026 – Course/Marche Fête des Mères le 2 mai à Rebordosa, Paredes. Épreuves de 400 m à 10 km. Marche 6 km. Organisation Grupo Desportivo da Portela.",
    },
    de: {
      title:
        "XVII Großer Preis der Leichtathletik von Rebordosa – Lauf/Wanderung Muttertag 2026",
      description: `# 🏃 XVII Großer Preis der Leichtathletik von Rebordosa 2026

**Der XVII Große Preis der Leichtathletik von Rebordosa – Lauf/Wanderung Muttertag findet am 2. Mai 2026 in Rebordosa, Paredes statt.** Organisiert vom Grupo Desportivo da Portela, mit Unterstützung der Gemeinde Paredes und des Leichtathletikverbands Porto. Start und Ziel in der Rua Cândido Barbosa (Centro Escolar de Rebordosa). Offen für Vereins- und Freizeitsportler.

---

## 🏃 Rennen

- **Benjamins A** – 400 m · Kostenlos
- **Benjamins B** – 800 m · Kostenlos
- **Infantis** – 1 000 m · Kostenlos
- **Iniciados** – 2 000 m · Kostenlos
- **Juvenis** – 3 000 m · Kostenlos
- **Juniores** – 10 km
- **Seniores** – 10 km
- **Veteranos M40/M45/M50/M55** – 10 km
- **Wanderung** – 6 km · Nicht wettbewerblich · 2 €

---

🏃 **Feiere den Muttertag beim Lauf in Rebordosa!** 🌷`,
      city: "Rebordosa, Paredes",
      metaTitle:
        "XVII GP Leichtathletik Rebordosa – Muttertag 2026 | Paredes | 2. Mai",
      metaDescription:
        "XVII Großer Preis der Leichtathletik von Rebordosa 2026 – Lauf/Wanderung Muttertag am 2. Mai in Rebordosa, Paredes. Rennen von 400 m bis 10 km. Wanderung 6 km. Organisation Grupo Desportivo da Portela.",
    },
    it: {
      title:
        "XVII Gran Premio di Atletica di Rebordosa – Corsa/Camminata Festa della Mamma 2026",
      description: `# 🏃 XVII Gran Premio di Atletica di Rebordosa 2026

**Il XVII Gran Premio di Atletica di Rebordosa – Corsa/Camminata Festa della Mamma si svolge il 2 maggio 2026 a Rebordosa, Paredes.** Organizzato dal Grupo Desportivo da Portela, con il supporto del Comune di Paredes e dell'Associazione di Atletica di Porto. Partenza e arrivo in Rua Cândido Barbosa (Centro Escolar de Rebordosa). Aperto ad atleti tesserati e non tesserati.

---

## 🏃 Gare

- **Benjamins A** – 400 m · Gratuito
- **Benjamins B** – 800 m · Gratuito
- **Infantis** – 1 000 m · Gratuito
- **Iniciados** – 2 000 m · Gratuito
- **Juvenis** – 3 000 m · Gratuito
- **Juniores** – 10 km
- **Seniores** – 10 km
- **Veteranos M40/M45/M50/M55** – 10 km
- **Camminata** – 6 km · Non competitiva · 2 €

---

🏃 **Festeggia la Festa della Mamma correndo a Rebordosa!** 🌷`,
      city: "Rebordosa, Paredes",
      metaTitle:
        "XVII GP Atletica Rebordosa – Festa della Mamma 2026 | Paredes | 2 Maggio",
      metaDescription:
        "XVII Gran Premio di Atletica di Rebordosa 2026 – Corsa/Camminata Festa della Mamma il 2 maggio a Rebordosa, Paredes. Gare da 400 m a 10 km. Camminata 6 km. Organizzazione Grupo Desportivo da Portela.",
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

  // ── Variant: Benjamins A (400 m) ──
  const benjaminsA = await findOrCreateVariant({
    name: "Benjamins A",
    distanceKm: 0.4,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-05-02T15:30:00Z"),
    startTime: "16:30",
    cutoffTimeHours: null,
    price: 0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Benjamins A · 400 m · Nascidos 2017-2019 · Inscrição gratuita",
  });
  console.log(`✅ Variant: ${benjaminsA.name}`);

  // ── Variant: Benjamins B (800 m) ──
  const benjaminsB = await findOrCreateVariant({
    name: "Benjamins B",
    distanceKm: 0.8,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-05-02T15:45:00Z"),
    startTime: "16:45",
    cutoffTimeHours: null,
    price: 0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Benjamins B · 800 m · Nascidos 2015-2016 · Inscrição gratuita",
  });
  console.log(`✅ Variant: ${benjaminsB.name}`);

  // ── Variant: Infantis (1 000 m) ──
  const infantis = await findOrCreateVariant({
    name: "Infantis",
    distanceKm: 1,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-05-02T16:00:00Z"),
    startTime: "17:00",
    cutoffTimeHours: null,
    price: 0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Infantis · 1 000 m · Nascidos 2013-2014 · Inscrição gratuita",
  });
  console.log(`✅ Variant: ${infantis.name}`);

  // ── Variant: Iniciados (2 000 m) ──
  const iniciados = await findOrCreateVariant({
    name: "Iniciados",
    distanceKm: 2,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-05-02T16:15:00Z"),
    startTime: "17:15",
    cutoffTimeHours: null,
    price: 0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Iniciados · 2 000 m · Nascidos 2011-2012 · Inscrição gratuita",
  });
  console.log(`✅ Variant: ${iniciados.name}`);

  // ── Variant: Juvenis (3 000 m) ──
  const juvenis = await findOrCreateVariant({
    name: "Juvenis",
    distanceKm: 3,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-05-02T16:30:00Z"),
    startTime: "17:30",
    cutoffTimeHours: null,
    price: 0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Juvenis · 3 000 m · Nascidos 2009-2010 · Inscrição gratuita",
  });
  console.log(`✅ Variant: ${juvenis.name}`);

  // ── Variant: Juniores (10 km) ──
  const juniores = await findOrCreateVariant({
    name: "Juniores",
    distanceKm: 10,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-05-02T17:00:00Z"),
    startTime: "18:00",
    cutoffTimeHours: null,
    price: 5,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Juniores · 10 km · Nascidos 2007-2008",
  });
  console.log(`✅ Variant: ${juniores.name}`);

  // ── Variant: Seniores (10 km) ──
  const seniores = await findOrCreateVariant({
    name: "Seniores",
    distanceKm: 10,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-05-02T17:00:00Z"),
    startTime: "18:00",
    cutoffTimeHours: null,
    price: 5,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Seniores · 10 km · 20 a 39 anos · Classificação M/F",
  });
  console.log(`✅ Variant: ${seniores.name}`);

  // ── Variant: Veteranos M40 (10 km) ──
  const vetM40 = await findOrCreateVariant({
    name: "Veteranos M40",
    distanceKm: 10,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-05-02T17:00:00Z"),
    startTime: "18:00",
    cutoffTimeHours: null,
    price: 5,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Veteranos M40 · 10 km · 40-44 anos · Classificação M/F",
  });
  console.log(`✅ Variant: ${vetM40.name}`);

  // ── Variant: Veteranos M45 (10 km) ──
  const vetM45 = await findOrCreateVariant({
    name: "Veteranos M45",
    distanceKm: 10,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-05-02T17:00:00Z"),
    startTime: "18:00",
    cutoffTimeHours: null,
    price: 5,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Veteranos M45 · 10 km · 45-49 anos · Classificação M/F",
  });
  console.log(`✅ Variant: ${vetM45.name}`);

  // ── Variant: Veteranos M50 (10 km) ──
  const vetM50 = await findOrCreateVariant({
    name: "Veteranos M50",
    distanceKm: 10,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-05-02T17:00:00Z"),
    startTime: "18:00",
    cutoffTimeHours: null,
    price: 5,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Veteranos M50 · 10 km · 50-54 anos · Classificação M/F",
  });
  console.log(`✅ Variant: ${vetM50.name}`);

  // ── Variant: Veteranos M55 (10 km) ──
  const vetM55 = await findOrCreateVariant({
    name: "Veteranos M55",
    distanceKm: 10,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-05-02T17:00:00Z"),
    startTime: "18:00",
    cutoffTimeHours: null,
    price: 5,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Veteranos M55 · 10 km · 55+ anos · Classificação M/F",
  });
  console.log(`✅ Variant: ${vetM55.name}`);

  // ── Variant: Caminhada (6 km) ──
  const caminhada = await findOrCreateVariant({
    name: "Caminhada",
    distanceKm: 6,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-05-02T16:00:00Z"),
    startTime: "17:00",
    cutoffTimeHours: null,
    price: 2,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Caminhada · 6 km · Não competitiva · Aberta a todos · €2 (reverte para Bombeiros Voluntários de Rebordosa)",
  });
  console.log(`✅ Variant: ${caminhada.name}`);

  // ──────────────────────────────────────────────
  // 4. Pricing Phases (Juniores, Seniores & Veteranos)
  // ──────────────────────────────────────────────
  const paidVariants = [
    "Juniores",
    "Seniores",
    "Veteranos M40",
    "Veteranos M45",
    "Veteranos M50",
    "Veteranos M55",
  ];

  for (const vName of paidVariants) {
    // Phase 1: Until March 15 → €5
    await findOrCreatePricingPhase(`${vName} - 1ª Fase`, {
      startDate: new Date("2026-01-01T00:00:00Z"),
      endDate: new Date("2026-03-15T23:59:59Z"),
      price: 5.0,
      currency: Currency.EUR,
      note: "Inclui dorsal, seguro, abastecimentos, t-shirt e medalha finisher",
    });

    // Phase 2: March 16 – April 19 → €6
    await findOrCreatePricingPhase(`${vName} - 2ª Fase`, {
      startDate: new Date("2026-03-16T00:00:00Z"),
      endDate: new Date("2026-04-19T23:59:59Z"),
      price: 6.0,
      currency: Currency.EUR,
      note: "Inclui dorsal, seguro, abastecimentos, t-shirt e medalha finisher",
    });

    // Phase 3: April 20 – April 29 → €8
    await findOrCreatePricingPhase(`${vName} - 3ª Fase`, {
      startDate: new Date("2026-04-20T00:00:00Z"),
      endDate: new Date("2026-04-29T23:59:59Z"),
      price: 8.0,
      currency: Currency.EUR,
      note: "Inclui dorsal, seguro, abastecimentos, t-shirt e medalha finisher",
    });

    console.log(`   - 3 pricing phases for ${vName}`);
  }

  // Caminhada: €2 on race day
  await findOrCreatePricingPhase("Caminhada - Inscrição no dia", {
    startDate: new Date("2026-05-02T00:00:00Z"),
    endDate: new Date("2026-05-02T17:00:00Z"),
    price: 2.0,
    currency: Currency.EUR,
    note: "Inscrição no dia da prova. Valor reverte a favor dos Bombeiros Voluntários de Rebordosa",
  });
  console.log("   - 1 pricing phase for Caminhada");

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

  // FAQ 0: Schedule
  const faq0 = await findOrCreateFAQ(
    event.id,
    0,
    "Qual é o horário das provas?",
    "16h30 Benjamins A (400 m), 16h45 Benjamins B (800 m), 17h00 Infantis (1 000 m) e Caminhada (6 km), 17h15 Iniciados (2 000 m), 17h30 Juvenis (3 000 m), 18h00 Juniores/Seniores/Veteranos (10 km). Partida e chegada na Rua Cândido Barbosa, Centro Escolar de Rebordosa. Secretariado aberto a partir das 08h00 no dia da prova."
  );

  const faq0Translations = {
    pt: {
      question: "Qual é o horário das provas?",
      answer:
        "16h30 Benjamins A (400 m), 16h45 Benjamins B (800 m), 17h00 Infantis (1 000 m) e Caminhada (6 km), 17h15 Iniciados (2 000 m), 17h30 Juvenis (3 000 m), 18h00 Juniores/Seniores/Veteranos (10 km). Partida e chegada na Rua Cândido Barbosa, Centro Escolar de Rebordosa. Secretariado aberto a partir das 08h00 no dia da prova.",
    },
    en: {
      question: "What is the race schedule?",
      answer:
        "4:30 PM Benjamins A (400 m), 4:45 PM Benjamins B (800 m), 5:00 PM Infantis (1,000 m) and Walk (6 km), 5:15 PM Iniciados (2,000 m), 5:30 PM Juvenis (3,000 m), 6:00 PM Juniores/Seniores/Veteranos (10 km). Start and finish on Rua Cândido Barbosa, Centro Escolar de Rebordosa. Registration desk opens at 8:00 AM on race day.",
    },
    es: {
      question: "¿Cuál es el horario de las pruebas?",
      answer:
        "16:30 Benjamins A (400 m), 16:45 Benjamins B (800 m), 17:00 Infantis (1 000 m) y Caminata (6 km), 17:15 Iniciados (2 000 m), 17:30 Juvenis (3 000 m), 18:00 Juniores/Seniores/Veteranos (10 km). Salida y meta en Rua Cândido Barbosa, Centro Escolar de Rebordosa. Secretaría abierta desde las 08:00 el día de la prueba.",
    },
    fr: {
      question: "Quel est l'horaire des épreuves ?",
      answer:
        "16h30 Benjamins A (400 m), 16h45 Benjamins B (800 m), 17h00 Infantis (1 000 m) et Marche (6 km), 17h15 Iniciados (2 000 m), 17h30 Juvenis (3 000 m), 18h00 Juniores/Seniores/Veteranos (10 km). Départ et arrivée Rua Cândido Barbosa, Centro Escolar de Rebordosa. Secrétariat ouvert à partir de 08h00 le jour de la course.",
    },
    de: {
      question: "Wie ist der Zeitplan der Rennen?",
      answer:
        "16:30 Benjamins A (400 m), 16:45 Benjamins B (800 m), 17:00 Infantis (1 000 m) und Wanderung (6 km), 17:15 Iniciados (2 000 m), 17:30 Juvenis (3 000 m), 18:00 Juniores/Seniores/Veteranos (10 km). Start und Ziel Rua Cândido Barbosa, Centro Escolar de Rebordosa. Sekretariat ab 08:00 am Veranstaltungstag.",
    },
    it: {
      question: "Qual è l'orario delle gare?",
      answer:
        "16:30 Benjamins A (400 m), 16:45 Benjamins B (800 m), 17:00 Infantis (1 000 m) e Camminata (6 km), 17:15 Iniciados (2 000 m), 17:30 Juvenis (3 000 m), 18:00 Juniores/Seniores/Veteranos (10 km). Partenza e arrivo in Rua Cândido Barbosa, Centro Escolar de Rebordosa. Segreteria aperta dalle 08:00 il giorno della gara.",
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
  console.log("✅ FAQ 0: Schedule");

  // FAQ 1: Registration and pricing
  const faq1 = await findOrCreateFAQ(
    event.id,
    1,
    "Como funcionam as inscrições e quais os preços?",
    "Inscrições em www.portimer.pt. Pagamento em 48h ou a inscrição é anulada. Escalões jovens (Benjamins A/B, Infantis, Iniciados, Juvenis) são gratuitos. Juniores, Seniores e Veteranos: 1ª fase (até 15 março) €5, 2ª fase (16 março – 19 abril) €6, 3ª fase (20 – 29 abril) €8. Caminhada: €2 no dia da prova (reverte para Bombeiros Voluntários de Rebordosa)."
  );

  const faq1Translations = {
    pt: {
      question: "Como funcionam as inscrições e quais os preços?",
      answer:
        "Inscrições em www.portimer.pt. Pagamento em 48h ou a inscrição é anulada. Escalões jovens (Benjamins A/B, Infantis, Iniciados, Juvenis) são gratuitos. Juniores, Seniores e Veteranos: 1ª fase (até 15 março) €5, 2ª fase (16 março – 19 abril) €6, 3ª fase (20 – 29 abril) €8. Caminhada: €2 no dia da prova (reverte para Bombeiros Voluntários de Rebordosa).",
    },
    en: {
      question: "How does registration work and what are the prices?",
      answer:
        "Registration at www.portimer.pt. Payment within 48h or the registration is cancelled. Youth categories (Benjamins A/B, Infantis, Iniciados, Juvenis) are free. Juniores, Seniores and Veteranos: Phase 1 (until March 15) €5, Phase 2 (March 16 – April 19) €6, Phase 3 (April 20 – 29) €8. Walk: €2 on race day (donated to Rebordosa Volunteer Firefighters).",
    },
    es: {
      question: "¿Cómo funcionan las inscripciones y cuáles son los precios?",
      answer:
        "Inscripciones en www.portimer.pt. Pago en 48h o la inscripción se anula. Categorías jóvenes (Benjamins A/B, Infantis, Iniciados, Juvenis) son gratuitas. Juniores, Seniores y Veteranos: 1ª fase (hasta 15 marzo) 5 €, 2ª fase (16 marzo – 19 abril) 6 €, 3ª fase (20 – 29 abril) 8 €. Caminata: 2 € el día de la prueba (a favor de Bomberos Voluntarios de Rebordosa).",
    },
    fr: {
      question:
        "Comment fonctionnent les inscriptions et quels sont les prix ?",
      answer:
        "Inscriptions sur www.portimer.pt. Paiement sous 48h ou l'inscription est annulée. Catégories jeunes (Benjamins A/B, Infantis, Iniciados, Juvenis) sont gratuites. Juniores, Seniores et Veteranos : 1ère phase (jusqu'au 15 mars) 5 €, 2e phase (16 mars – 19 avril) 6 €, 3e phase (20 – 29 avril) 8 €. Marche : 2 € le jour de la course (reversé aux Pompiers Volontaires de Rebordosa).",
    },
    de: {
      question: "Wie funktioniert die Anmeldung und was sind die Preise?",
      answer:
        "Anmeldung über www.portimer.pt. Zahlung innerhalb von 48h, sonst wird die Anmeldung storniert. Jugendkategorien (Benjamins A/B, Infantis, Iniciados, Juvenis) sind kostenlos. Juniores, Seniores und Veteranos: 1. Phase (bis 15. März) 5 €, 2. Phase (16. März – 19. April) 6 €, 3. Phase (20. – 29. April) 8 €. Wanderung: 2 € am Veranstaltungstag (Spende an die Freiwillige Feuerwehr Rebordosa).",
    },
    it: {
      question: "Come funzionano le iscrizioni e quali sono i prezzi?",
      answer:
        "Iscrizioni su www.portimer.pt. Pagamento entro 48h o l'iscrizione viene annullata. Categorie giovanili (Benjamins A/B, Infantis, Iniciados, Juvenis) sono gratuite. Juniores, Seniores e Veteranos: 1ª fase (fino al 15 marzo) 5 €, 2ª fase (16 marzo – 19 aprile) 6 €, 3ª fase (20 – 29 aprile) 8 €. Camminata: 2 € il giorno della gara (devoluto ai Vigili del Fuoco Volontari di Rebordosa).",
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
  console.log("✅ FAQ 1: Registration and pricing");

  // FAQ 2: What's included
  const faq2 = await findOrCreateFAQ(
    event.id,
    2,
    "O que está incluído na inscrição?",
    "Dorsal, seguro de acidentes pessoais, abastecimentos sólidos e líquidos, t-shirt alusiva à prova, medalha de finisher e eventuais brindes de patrocinadores. Acompanhamento da Polícia Municipal e Bombeiros locais durante a prova."
  );

  const faq2Translations = {
    pt: {
      question: "O que está incluído na inscrição?",
      answer:
        "Dorsal, seguro de acidentes pessoais, abastecimentos sólidos e líquidos, t-shirt alusiva à prova, medalha de finisher e eventuais brindes de patrocinadores. Acompanhamento da Polícia Municipal e Bombeiros locais durante a prova.",
    },
    en: {
      question: "What's included in the registration?",
      answer:
        "Bib number, personal accident insurance, solid and liquid refreshments, event t-shirt, finisher medal and possible sponsor gifts. Municipal Police and local Firefighter support during the race.",
    },
    es: {
      question: "¿Qué incluye la inscripción?",
      answer:
        "Dorsal, seguro de accidentes personales, avituallamiento sólido y líquido, camiseta del evento, medalla de finisher y posibles regalos de patrocinadores. Acompañamiento de la Policía Municipal y Bomberos locales durante la prueba.",
    },
    fr: {
      question: "Qu'est-ce qui est inclus dans l'inscription ?",
      answer:
        "Dossard, assurance accidents personnels, ravitaillement solide et liquide, t-shirt de l'événement, médaille de finisher et éventuels cadeaux de sponsors. Accompagnement de la Police Municipale et des Pompiers locaux pendant la course.",
    },
    de: {
      question: "Was ist in der Anmeldung enthalten?",
      answer:
        "Startnummer, Unfallversicherung, feste und flüssige Verpflegung, Event-T-Shirt, Finisher-Medaille und mögliche Sponsor-Geschenke. Begleitung durch die städtische Polizei und lokale Feuerwehr während des Rennens.",
    },
    it: {
      question: "Cosa è incluso nell'iscrizione?",
      answer:
        "Pettorale, assicurazione infortuni, ristori solidi e liquidi, t-shirt dell'evento, medaglia finisher ed eventuali omaggi degli sponsor. Accompagnamento della Polizia Municipale e dei Vigili del Fuoco locali durante la gara.",
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
  console.log("✅ FAQ 2: What's included");

  // FAQ 3: Prizes
  const faq3 = await findOrCreateFAQ(
    event.id,
    3,
    "Quais são os prémios?",
    "Geral 10 km (M/F): 1º €200, 2º €100, 3º €75, 4º €30, 5º €20. Seniores e Veteranos M40/M45/M50/M55 (M/F): 1º €60, 2º €30, 3º €25. Todos os escalões jovens (Benjamins até Juvenis/Juniores): troféu para os 3 primeiros (M/F). Classificação coletiva jovens e coletiva 10 km: troféu para as 3 primeiras equipas. A Caminhada não tem caráter competitivo."
  );

  const faq3Translations = {
    pt: {
      question: "Quais são os prémios?",
      answer:
        "Geral 10 km (M/F): 1º €200, 2º €100, 3º €75, 4º €30, 5º €20. Seniores e Veteranos M40/M45/M50/M55 (M/F): 1º €60, 2º €30, 3º €25. Todos os escalões jovens (Benjamins até Juvenis/Juniores): troféu para os 3 primeiros (M/F). Classificação coletiva jovens e coletiva 10 km: troféu para as 3 primeiras equipas. A Caminhada não tem caráter competitivo.",
    },
    en: {
      question: "What are the prizes?",
      answer:
        "Overall 10 km (M/F): 1st €200, 2nd €100, 3rd €75, 4th €30, 5th €20. Seniores and Veteranos M40/M45/M50/M55 (M/F): 1st €60, 2nd €30, 3rd €25. All youth categories (Benjamins to Juvenis/Juniores): trophy for top 3 (M/F). Youth team and 10 km team classifications: trophy for top 3 teams. The Walk is non-competitive.",
    },
    es: {
      question: "¿Cuáles son los premios?",
      answer:
        "General 10 km (M/F): 1º 200 €, 2º 100 €, 3º 75 €, 4º 30 €, 5º 20 €. Seniores y Veteranos M40/M45/M50/M55 (M/F): 1º 60 €, 2º 30 €, 3º 25 €. Todas las categorías jóvenes (Benjamins hasta Juvenis/Juniores): trofeo para los 3 primeros (M/F). Clasificación colectiva jóvenes y colectiva 10 km: trofeo para los 3 primeros equipos. La Caminata no es competitiva.",
    },
    fr: {
      question: "Quels sont les prix ?",
      answer:
        "Général 10 km (M/F) : 1er 200 €, 2e 100 €, 3e 75 €, 4e 30 €, 5e 20 €. Seniores et Veteranos M40/M45/M50/M55 (M/F) : 1er 60 €, 2e 30 €, 3e 25 €. Toutes les catégories jeunes (Benjamins à Juvenis/Juniores) : trophée pour les 3 premiers (M/F). Classement collectif jeunes et collectif 10 km : trophée pour les 3 premières équipes. La Marche n'est pas compétitive.",
    },
    de: {
      question: "Welche Preise gibt es?",
      answer:
        "Gesamt 10 km (M/W): 1. 200 €, 2. 100 €, 3. 75 €, 4. 30 €, 5. 20 €. Senioren und Veteranos M40/M45/M50/M55 (M/W): 1. 60 €, 2. 30 €, 3. 25 €. Alle Jugendkategorien (Benjamins bis Juniores): Pokal für die Top 3 (M/W). Jugend-Mannschafts- und 10-km-Mannschaftswertung: Pokal für die Top 3 Teams. Wanderung ist nicht wettbewerblich.",
    },
    it: {
      question: "Quali sono i premi?",
      answer:
        "Generale 10 km (M/F): 1º 200 €, 2º 100 €, 3º 75 €, 4º 30 €, 5º 20 €. Seniores e Veteranos M40/M45/M50/M55 (M/F): 1º 60 €, 2º 30 €, 3º 25 €. Tutte le categorie giovanili (Benjamins a Juvenis/Juniores): trofeo per i primi 3 (M/F). Classifica collettiva giovani e collettiva 10 km: trofeo per le prime 3 squadre. La Camminata non è competitiva.",
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
  console.log("✅ FAQ 3: Prizes");

  // FAQ 4: Course (10 km)
  const faq4 = await findOrCreateFAQ(
    event.id,
    4,
    "Como é o percurso da prova de 10 km?",
    "Partida na Rua Cândido Barbosa, percurso urbano por Rebordosa com passagem por diversas ruas da freguesia, incluindo Av. Eng. Adelino Amaro da Costa, Av. Bombeiros Voluntários e o Parque Rio Ferreira. Chegada na Rua Cândido Barbosa. Percurso devidamente fiscalizado e sinalizado. Atletas que não respeitem o percurso serão desclassificados."
  );

  const faq4Translations = {
    pt: {
      question: "Como é o percurso da prova de 10 km?",
      answer:
        "Partida na Rua Cândido Barbosa, percurso urbano por Rebordosa com passagem por diversas ruas da freguesia, incluindo Av. Eng. Adelino Amaro da Costa, Av. Bombeiros Voluntários e o Parque Rio Ferreira. Chegada na Rua Cândido Barbosa. Percurso devidamente fiscalizado e sinalizado. Atletas que não respeitem o percurso serão desclassificados.",
    },
    en: {
      question: "What is the 10 km race course like?",
      answer:
        "Start on Rua Cândido Barbosa, urban route through Rebordosa passing various streets, including Av. Eng. Adelino Amaro da Costa, Av. Bombeiros Voluntários and Parque Rio Ferreira. Finish on Rua Cândido Barbosa. Course fully monitored and marked. Athletes who do not follow the route will be disqualified.",
    },
    es: {
      question: "¿Cómo es el recorrido de la prueba de 10 km?",
      answer:
        "Salida en Rua Cândido Barbosa, recorrido urbano por Rebordosa pasando por diversas calles, incluyendo Av. Eng. Adelino Amaro da Costa, Av. Bombeiros Voluntários y el Parque Rio Ferreira. Meta en Rua Cândido Barbosa. Recorrido debidamente fiscalizado y señalizado. Los atletas que no respeten el recorrido serán descalificados.",
    },
    fr: {
      question: "Comment est le parcours de l'épreuve de 10 km ?",
      answer:
        "Départ Rua Cândido Barbosa, parcours urbain à travers Rebordosa passant par diverses rues, dont Av. Eng. Adelino Amaro da Costa, Av. Bombeiros Voluntários et le Parque Rio Ferreira. Arrivée Rua Cândido Barbosa. Parcours dûment contrôlé et balisé. Les athlètes ne respectant pas le parcours seront disqualifiés.",
    },
    de: {
      question: "Wie sieht die 10-km-Strecke aus?",
      answer:
        "Start auf der Rua Cândido Barbosa, Stadtstrecke durch Rebordosa über verschiedene Straßen, darunter Av. Eng. Adelino Amaro da Costa, Av. Bombeiros Voluntários und den Parque Rio Ferreira. Ziel Rua Cândido Barbosa. Strecke vollständig überwacht und markiert. Athleten, die die Strecke nicht einhalten, werden disqualifiziert.",
    },
    it: {
      question: "Com'è il percorso della gara da 10 km?",
      answer:
        "Partenza in Rua Cândido Barbosa, percorso urbano per Rebordosa passando per diverse strade, tra cui Av. Eng. Adelino Amaro da Costa, Av. Bombeiros Voluntários e il Parque Rio Ferreira. Arrivo in Rua Cândido Barbosa. Percorso debitamente controllato e segnalato. Gli atleti che non rispettano il percorso verranno squalificati.",
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
  console.log("✅ FAQ 4: Course (10 km)");

  // ──────────────────────────────────────────────
  // Summary
  // ──────────────────────────────────────────────
  console.log(`
✅ Seed completed successfully!

📊 Summary:
- Event: XVII Grande Prémio de Atletismo de Rebordosa – Corrida/Caminhada Dia da Mãe 2026
- Slug: grande-premio-atletismo-rebordosa-2026
- Variants: 12 (Benjamins A/B, Infantis, Iniciados, Juvenis, Juniores, Seniores, Vet M40/M45/M50/M55, Caminhada)
- Languages: 6 (pt, en, es, fr, de, it)
- Pricing Phases: 19 (3 per paid variant × 6 + 1 Caminhada)
- FAQs: 5 (with translations in all 6 languages)
- Date: May 2, 2026
- Location: Rua Cândido Barbosa, Centro Escolar de Rebordosa, Paredes
- Coordinates: 41.215, -8.405
- Organization: Grupo Desportivo da Portela
- Type: Road running, open to federated and non-federated athletes
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
