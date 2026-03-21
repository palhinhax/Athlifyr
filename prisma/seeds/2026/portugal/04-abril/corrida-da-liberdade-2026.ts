/**
 * Seed: Corrida da Liberdade 2026 – 37ª Edição
 *
 * Event: Road running race (athletics) in Cabeceiras de Basto
 * Location: Zona Adjacente do Mosteiro de S. Miguel, Praça da República, Cabeceiras de Basto
 * Date: April 25, 2026
 * Organizer: Associação Dinamizadora dos Interesses de Basto (ADIB)
 * Sport: Running
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Corrida da Liberdade 2026 – 37ª Edição...");

  // ──────────────────────────────────────────────
  // 1. Upsert Event (no nested creates)
  // ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: "corrida-da-liberdade-2026" },
    update: {
      title: "Corrida da Liberdade 2026 – 37ª Edição",
      description:
        "Corrida da Liberdade 2026 – 37ª Edição - Prova de atletismo em Cabeceiras de Basto",
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-04-25T08:30:00Z"),
      endDate: new Date("2026-04-25T17:00:00Z"),
      registrationDeadline: new Date("2026-04-22T23:59:59Z"),
      externalUrl: "https://www.portimer.pt",
      imageUrl: "",
      city: "Cabeceiras de Basto",
      country: "Portugal",
      latitude: 41.5139,
      longitude: -8.0042,
      googleMapsUrl: "",
      isFeatured: false,
      cancelled: false,
    },
    create: {
      title: "Corrida da Liberdade 2026 – 37ª Edição",
      slug: "corrida-da-liberdade-2026",
      description:
        "Corrida da Liberdade 2026 – 37ª Edição - Prova de atletismo em Cabeceiras de Basto",
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-04-25T08:30:00Z"),
      endDate: new Date("2026-04-25T17:00:00Z"),
      registrationDeadline: new Date("2026-04-22T23:59:59Z"),
      externalUrl: "https://www.portimer.pt",
      imageUrl: "",
      city: "Cabeceiras de Basto",
      country: "Portugal",
      latitude: 41.5139,
      longitude: -8.0042,
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
      title: "Corrida da Liberdade 2026 – 37ª Edição",
      description: `# 🏃 Corrida da Liberdade 2026 – 37ª Edição

**A Corrida da Liberdade celebra a sua 37ª edição no dia 25 de abril de 2026, em Cabeceiras de Basto.** Organizada pela Associação Dinamizadora dos Interesses de Basto (ADIB), com partida e chegada na Zona Adjacente do Mosteiro de S. Miguel, Praça da República. Aberta a atletas federados e não federados.

---

## 🏃 Provas

- **Benjamins A** – 250 m (nascidos de 2017 para cima) · Gratuito
- **Benjamins B** – 500 m (nascidos 2015-2016) · Gratuito
- **Infantis** – 1 000 m (nascidos 2013-2014) · Gratuito
- **Iniciados** – 2 000 m (nascidos 2011-2012) · Gratuito
- **Juvenis** – 3 000 m (nascidos 2009-2010) · Gratuito
- **Juniores** – 13 km (nascidos 2007-2008) · Gratuito
- **Seniores** – 13 km (nascidos 1992-2006)
- **Veteranos 35/40/45/50+** – 13 km

---

🏃 **Vem celebrar o 25 de Abril a correr em Cabeceiras de Basto!** 🏅`,
      city: "Cabeceiras de Basto",
      metaTitle:
        "Corrida da Liberdade 2026 – 37ª Edição | Cabeceiras de Basto | 25 Abril",
      metaDescription:
        "Corrida da Liberdade 2026 – 37ª edição a 25 de abril em Cabeceiras de Basto. Provas de 250 m a 13 km para todos os escalões. Organização ADIB. Limitado a 200 participantes.",
    },
    en: {
      title: "Corrida da Liberdade 2026 – 37th Edition",
      description: `# 🏃 Corrida da Liberdade 2026 – 37th Edition

**The Corrida da Liberdade celebrates its 37th edition on April 25, 2026, in Cabeceiras de Basto.** Organized by Associação Dinamizadora dos Interesses de Basto (ADIB), starting and finishing at the Mosteiro de S. Miguel area, Praça da República. Open to federated and non-federated athletes.

---

## 🏃 Races

- **Benjamins A** – 250 m (born 2017 or later) · Free
- **Benjamins B** – 500 m (born 2015-2016) · Free
- **Infantis** – 1,000 m (born 2013-2014) · Free
- **Iniciados** – 2,000 m (born 2011-2012) · Free
- **Juvenis** – 3,000 m (born 2009-2010) · Free
- **Juniores** – 13 km (born 2007-2008) · Free
- **Seniores** – 13 km (born 1992-2006)
- **Veteranos 35/40/45/50+** – 13 km

---

🏃 **Come celebrate April 25th running in Cabeceiras de Basto!** 🏅`,
      city: "Cabeceiras de Basto",
      metaTitle:
        "Corrida da Liberdade 2026 – 37th Edition | Cabeceiras de Basto | April 25",
      metaDescription:
        "Corrida da Liberdade 2026 – 37th edition on April 25 in Cabeceiras de Basto. Races from 250 m to 13 km for all age groups. Organized by ADIB. Limited to 200 participants.",
    },
    es: {
      title: "Corrida da Liberdade 2026 – 37ª Edición",
      description: `# 🏃 Corrida da Liberdade 2026 – 37ª Edición

**La Corrida da Liberdade celebra su 37ª edición el 25 de abril de 2026, en Cabeceiras de Basto.** Organizada por la Associação Dinamizadora dos Interesses de Basto (ADIB), con salida y meta en la Zona Adyacente al Mosteiro de S. Miguel, Praça da República. Abierta a atletas federados y no federados.

---

## 🏃 Pruebas

- **Benjamins A** – 250 m (nacidos de 2017 en adelante) · Gratis
- **Benjamins B** – 500 m (nacidos 2015-2016) · Gratis
- **Infantis** – 1 000 m (nacidos 2013-2014) · Gratis
- **Iniciados** – 2 000 m (nacidos 2011-2012) · Gratis
- **Juvenis** – 3 000 m (nacidos 2009-2010) · Gratis
- **Juniores** – 13 km (nacidos 2007-2008) · Gratis
- **Seniores** – 13 km (nacidos 1992-2006)
- **Veteranos 35/40/45/50+** – 13 km

---

🏃 **¡Ven a celebrar el 25 de Abril corriendo en Cabeceiras de Basto!** 🏅`,
      city: "Cabeceiras de Basto",
      metaTitle:
        "Corrida da Liberdade 2026 – 37ª Edición | Cabeceiras de Basto | 25 Abril",
      metaDescription:
        "Corrida da Liberdade 2026 – 37ª edición el 25 de abril en Cabeceiras de Basto. Pruebas de 250 m a 13 km para todos los escalones. Organización ADIB. Limitado a 200 participantes.",
    },
    fr: {
      title: "Corrida da Liberdade 2026 – 37e Édition",
      description: `# 🏃 Corrida da Liberdade 2026 – 37e Édition

**La Corrida da Liberdade célèbre sa 37e édition le 25 avril 2026, à Cabeceiras de Basto.** Organisée par l'Associação Dinamizadora dos Interesses de Basto (ADIB), départ et arrivée dans la Zone Adjacente au Mosteiro de S. Miguel, Praça da República. Ouverte aux athlètes fédérés et non fédérés.

---

## 🏃 Épreuves

- **Benjamins A** – 250 m (nés en 2017 ou après) · Gratuit
- **Benjamins B** – 500 m (nés 2015-2016) · Gratuit
- **Infantis** – 1 000 m (nés 2013-2014) · Gratuit
- **Iniciados** – 2 000 m (nés 2011-2012) · Gratuit
- **Juvenis** – 3 000 m (nés 2009-2010) · Gratuit
- **Juniores** – 13 km (nés 2007-2008) · Gratuit
- **Seniores** – 13 km (nés 1992-2006)
- **Veteranos 35/40/45/50+** – 13 km

---

🏃 **Venez célébrer le 25 Avril en courant à Cabeceiras de Basto !** 🏅`,
      city: "Cabeceiras de Basto",
      metaTitle:
        "Corrida da Liberdade 2026 – 37e Édition | Cabeceiras de Basto | 25 Avril",
      metaDescription:
        "Corrida da Liberdade 2026 – 37e édition le 25 avril à Cabeceiras de Basto. Épreuves de 250 m à 13 km pour toutes les catégories. Organisation ADIB. Limité à 200 participants.",
    },
    de: {
      title: "Corrida da Liberdade 2026 – 37. Ausgabe",
      description: `# 🏃 Corrida da Liberdade 2026 – 37. Ausgabe

**Der Corrida da Liberdade feiert seine 37. Ausgabe am 25. April 2026 in Cabeceiras de Basto.** Organisiert von der Associação Dinamizadora dos Interesses de Basto (ADIB), Start und Ziel im angrenzenden Bereich des Mosteiro de S. Miguel, Praça da República. Offen für Vereins- und Freizeitsportler.

---

## 🏃 Rennen

- **Benjamins A** – 250 m (geboren 2017 oder später) · Kostenlos
- **Benjamins B** – 500 m (geboren 2015-2016) · Kostenlos
- **Infantis** – 1 000 m (geboren 2013-2014) · Kostenlos
- **Iniciados** – 2 000 m (geboren 2011-2012) · Kostenlos
- **Juvenis** – 3 000 m (geboren 2009-2010) · Kostenlos
- **Juniores** – 13 km (geboren 2007-2008) · Kostenlos
- **Seniores** – 13 km (geboren 1992-2006)
- **Veteranos 35/40/45/50+** – 13 km

---

🏃 **Feiere den 25. April beim Lauf in Cabeceiras de Basto!** 🏅`,
      city: "Cabeceiras de Basto",
      metaTitle:
        "Corrida da Liberdade 2026 – 37. Ausgabe | Cabeceiras de Basto | 25. April",
      metaDescription:
        "Corrida da Liberdade 2026 – 37. Ausgabe am 25. April in Cabeceiras de Basto. Rennen von 250 m bis 13 km für alle Altersklassen. Organisation ADIB. Begrenzt auf 200 Teilnehmer.",
    },
    it: {
      title: "Corrida da Liberdade 2026 – 37ª Edizione",
      description: `# 🏃 Corrida da Liberdade 2026 – 37ª Edizione

**La Corrida da Liberdade celebra la sua 37ª edizione il 25 aprile 2026, a Cabeceiras de Basto.** Organizzata dall'Associação Dinamizadora dos Interesses de Basto (ADIB), partenza e arrivo nella Zona Adiacente al Mosteiro de S. Miguel, Praça da República. Aperta ad atleti tesserati e non tesserati.

---

## 🏃 Gare

- **Benjamins A** – 250 m (nati dal 2017 in poi) · Gratuito
- **Benjamins B** – 500 m (nati 2015-2016) · Gratuito
- **Infantis** – 1 000 m (nati 2013-2014) · Gratuito
- **Iniciados** – 2 000 m (nati 2011-2012) · Gratuito
- **Juvenis** – 3 000 m (nati 2009-2010) · Gratuito
- **Juniores** – 13 km (nati 2007-2008) · Gratuito
- **Seniores** – 13 km (nati 1992-2006)
- **Veteranos 35/40/45/50+** – 13 km

---

🏃 **Vieni a festeggiare il 25 Aprile correndo a Cabeceiras de Basto!** 🏅`,
      city: "Cabeceiras de Basto",
      metaTitle:
        "Corrida da Liberdade 2026 – 37ª Edizione | Cabeceiras de Basto | 25 Aprile",
      metaDescription:
        "Corrida da Liberdade 2026 – 37ª edizione il 25 aprile a Cabeceiras de Basto. Gare da 250 m a 13 km per tutte le categorie. Organizzazione ADIB. Limitato a 200 partecipanti.",
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

  // ── Variant: Benjamins A (250 m) ──
  const benjaminsA = await findOrCreateVariant({
    name: "Benjamins A",
    distanceKm: 0.25,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-25T08:30:00Z"),
    startTime: "09:30",
    cutoffTimeHours: null,
    price: 0,
    currency: Currency.EUR,
    maxParticipants: 200,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Benjamins A · 250 m · Nascidos de 2017 para cima · Inscrição gratuita",
  });
  console.log(`✅ Variant: ${benjaminsA.name}`);

  // ── Variant: Benjamins B (500 m) ──
  const benjaminsB = await findOrCreateVariant({
    name: "Benjamins B",
    distanceKm: 0.5,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-25T08:45:00Z"),
    startTime: "09:45",
    cutoffTimeHours: null,
    price: 0,
    currency: Currency.EUR,
    maxParticipants: 200,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Benjamins B · 500 m · Nascidos entre 2015 e 2016 · Inscrição gratuita",
  });
  console.log(`✅ Variant: ${benjaminsB.name}`);

  // ── Variant: Infantis (1 000 m) ──
  const infantis = await findOrCreateVariant({
    name: "Infantis",
    distanceKm: 1,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-25T09:00:00Z"),
    startTime: "10:00",
    cutoffTimeHours: null,
    price: 0,
    currency: Currency.EUR,
    maxParticipants: 200,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Infantis · 1 000 m · Nascidos entre 2013 e 2014 · Inscrição gratuita",
  });
  console.log(`✅ Variant: ${infantis.name}`);

  // ── Variant: Iniciados (2 000 m) ──
  const iniciados = await findOrCreateVariant({
    name: "Iniciados",
    distanceKm: 2,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-25T09:15:00Z"),
    startTime: "10:15",
    cutoffTimeHours: null,
    price: 0,
    currency: Currency.EUR,
    maxParticipants: 200,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Iniciados · 2 000 m · Nascidos entre 2011 e 2012 · Inscrição gratuita",
  });
  console.log(`✅ Variant: ${iniciados.name}`);

  // ── Variant: Juvenis (3 000 m) ──
  const juvenis = await findOrCreateVariant({
    name: "Juvenis",
    distanceKm: 3,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-25T09:30:00Z"),
    startTime: "10:30",
    cutoffTimeHours: null,
    price: 0,
    currency: Currency.EUR,
    maxParticipants: 200,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Juvenis · 3 000 m · Nascidos entre 2009 e 2010 · Inscrição gratuita",
  });
  console.log(`✅ Variant: ${juvenis.name}`);

  // ── Variant: Juniores (13 km) ──
  const juniores = await findOrCreateVariant({
    name: "Juniores",
    distanceKm: 13,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-25T10:00:00Z"),
    startTime: "11:00",
    cutoffTimeHours: null,
    price: 0,
    currency: Currency.EUR,
    maxParticipants: 200,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Juniores · 13 km · Nascidos entre 2007 e 2008 · Inscrição gratuita",
  });
  console.log(`✅ Variant: ${juniores.name}`);

  // ── Variant: Seniores (13 km) ──
  const seniores = await findOrCreateVariant({
    name: "Seniores",
    distanceKm: 13,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-25T10:00:00Z"),
    startTime: "11:00",
    cutoffTimeHours: null,
    price: 10,
    currency: Currency.EUR,
    maxParticipants: 200,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Seniores · 13 km · Nascidos entre 1992 e 2006 · Classificação individual M/F",
  });
  console.log(`✅ Variant: ${seniores.name}`);

  // ── Variant: Veteranos 35 (13 km) ──
  const vet35 = await findOrCreateVariant({
    name: "Veteranos 35",
    distanceKm: 13,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-25T10:00:00Z"),
    startTime: "11:00",
    cutoffTimeHours: null,
    price: 10,
    currency: Currency.EUR,
    maxParticipants: 200,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Veteranos 35 · 13 km · 35-39 anos · Classificação individual M/F",
  });
  console.log(`✅ Variant: ${vet35.name}`);

  // ── Variant: Veteranos 40 (13 km) ──
  const vet40 = await findOrCreateVariant({
    name: "Veteranos 40",
    distanceKm: 13,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-25T10:00:00Z"),
    startTime: "11:00",
    cutoffTimeHours: null,
    price: 10,
    currency: Currency.EUR,
    maxParticipants: 200,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Veteranos 40 · 13 km · 40-44 anos · Classificação individual M/F",
  });
  console.log(`✅ Variant: ${vet40.name}`);

  // ── Variant: Veteranos 45 (13 km) ──
  const vet45 = await findOrCreateVariant({
    name: "Veteranos 45",
    distanceKm: 13,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-25T10:00:00Z"),
    startTime: "11:00",
    cutoffTimeHours: null,
    price: 10,
    currency: Currency.EUR,
    maxParticipants: 200,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Veteranos 45 · 13 km · 45-49 anos · Classificação individual M/F",
  });
  console.log(`✅ Variant: ${vet45.name}`);

  // ── Variant: Veteranos 50+ (13 km) ──
  const vet50 = await findOrCreateVariant({
    name: "Veteranos 50+",
    distanceKm: 13,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-25T10:00:00Z"),
    startTime: "11:00",
    cutoffTimeHours: null,
    price: 10,
    currency: Currency.EUR,
    maxParticipants: 200,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Veteranos 50+ · 13 km · 50 anos ou mais · Classificação individual M/F",
  });
  console.log(`✅ Variant: ${vet50.name}`);

  // ──────────────────────────────────────────────
  // 4. Pricing Phases (Seniores & Veteranos only)
  // ──────────────────────────────────────────────
  const paidVariants = [
    { name: "Seniores", ref: seniores },
    { name: "Veteranos 35", ref: vet35 },
    { name: "Veteranos 40", ref: vet40 },
    { name: "Veteranos 45", ref: vet45 },
    { name: "Veteranos 50+", ref: vet50 },
  ];

  for (const v of paidVariants) {
    // Phase 1: March 6 – April 15 → €10
    await findOrCreatePricingPhase(`${v.name} - 1ª Fase`, {
      startDate: new Date("2026-03-06T00:00:00Z"),
      endDate: new Date("2026-04-15T23:59:59Z"),
      price: 10.0,
      currency: Currency.EUR,
      note: "Inclui seguro desportivo obrigatório e dorsal com chip",
    });

    // Phase 2: April 16 – April 22 → €12.50
    await findOrCreatePricingPhase(`${v.name} - 2ª Fase`, {
      startDate: new Date("2026-04-16T00:00:00Z"),
      endDate: new Date("2026-04-22T23:59:59Z"),
      price: 12.5,
      currency: Currency.EUR,
      note: "Inclui seguro desportivo obrigatório e dorsal com chip",
    });

    // Race day: April 25 → €15 (limited 10 per category)
    await findOrCreatePricingPhase(`${v.name} - Dia da Prova`, {
      startDate: new Date("2026-04-25T00:00:00Z"),
      endDate: new Date("2026-04-25T08:30:00Z"),
      price: 15.0,
      currency: Currency.EUR,
      note: "Inscrição no dia da prova, limitada a 10 dorsais por escalão",
    });

    console.log(`   - 3 pricing phases for ${v.name}`);
  }

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
    "09h30 Benjamins A (250 m), 09h45 Benjamins B (500 m), 10h00 Infantis (1 000 m), 10h15 Iniciados (2 000 m), 10h30 Juvenis (3 000 m), 11h00 Juniores/Seniores/Veteranos (13 km). Partida e chegada na Zona Adjacente do Mosteiro de S. Miguel, Praça da República, Cabeceiras de Basto."
  );

  const faq0Translations = {
    pt: {
      question: "Qual é o horário das provas?",
      answer:
        "09h30 Benjamins A (250 m), 09h45 Benjamins B (500 m), 10h00 Infantis (1 000 m), 10h15 Iniciados (2 000 m), 10h30 Juvenis (3 000 m), 11h00 Juniores/Seniores/Veteranos (13 km). Partida e chegada na Zona Adjacente do Mosteiro de S. Miguel, Praça da República, Cabeceiras de Basto.",
    },
    en: {
      question: "What is the race schedule?",
      answer:
        "9:30 AM Benjamins A (250 m), 9:45 AM Benjamins B (500 m), 10:00 AM Infantis (1,000 m), 10:15 AM Iniciados (2,000 m), 10:30 AM Juvenis (3,000 m), 11:00 AM Juniores/Seniores/Veteranos (13 km). Start and finish at the Mosteiro de S. Miguel area, Praça da República, Cabeceiras de Basto.",
    },
    es: {
      question: "¿Cuál es el horario de las pruebas?",
      answer:
        "09:30 Benjamins A (250 m), 09:45 Benjamins B (500 m), 10:00 Infantis (1 000 m), 10:15 Iniciados (2 000 m), 10:30 Juvenis (3 000 m), 11:00 Juniores/Seniores/Veteranos (13 km). Salida y meta en la Zona Adyacente al Mosteiro de S. Miguel, Praça da República, Cabeceiras de Basto.",
    },
    fr: {
      question: "Quel est l'horaire des épreuves ?",
      answer:
        "09h30 Benjamins A (250 m), 09h45 Benjamins B (500 m), 10h00 Infantis (1 000 m), 10h15 Iniciados (2 000 m), 10h30 Juvenis (3 000 m), 11h00 Juniores/Seniores/Veteranos (13 km). Départ et arrivée dans la Zone Adjacente au Mosteiro de S. Miguel, Praça da República, Cabeceiras de Basto.",
    },
    de: {
      question: "Wie ist der Zeitplan der Rennen?",
      answer:
        "09:30 Benjamins A (250 m), 09:45 Benjamins B (500 m), 10:00 Infantis (1 000 m), 10:15 Iniciados (2 000 m), 10:30 Juvenis (3 000 m), 11:00 Juniores/Seniores/Veteranos (13 km). Start und Ziel im angrenzenden Bereich des Mosteiro de S. Miguel, Praça da República, Cabeceiras de Basto.",
    },
    it: {
      question: "Qual è l'orario delle gare?",
      answer:
        "09:30 Benjamins A (250 m), 09:45 Benjamins B (500 m), 10:00 Infantis (1 000 m), 10:15 Iniciados (2 000 m), 10:30 Juvenis (3 000 m), 11:00 Juniores/Seniores/Veteranos (13 km). Partenza e arrivo nella Zona Adiacente al Mosteiro de S. Miguel, Praça da República, Cabeceiras de Basto.",
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
    "Escalões jovens (Benjamins A/B, Infantis, Iniciados, Juvenis, Juniores) são gratuitos mediante assinatura de Termo de Responsabilidade. Seniores e Veteranos: 1ª fase (6 março – 15 abril) €10, 2ª fase (16 – 22 abril) €12,50, dia da prova €15 (limitado a 10 dorsais por escalão). Inscrições em www.portimer.pt ou na sede da ADIB. Limite de 200 participantes por prova."
  );

  const faq1Translations = {
    pt: {
      question: "Como funcionam as inscrições e quais os preços?",
      answer:
        "Escalões jovens (Benjamins A/B, Infantis, Iniciados, Juvenis, Juniores) são gratuitos mediante assinatura de Termo de Responsabilidade. Seniores e Veteranos: 1ª fase (6 março – 15 abril) €10, 2ª fase (16 – 22 abril) €12,50, dia da prova €15 (limitado a 10 dorsais por escalão). Inscrições em www.portimer.pt ou na sede da ADIB. Limite de 200 participantes por prova.",
    },
    en: {
      question: "How does registration work and what are the prices?",
      answer:
        "Youth categories (Benjamins A/B, Infantis, Iniciados, Juvenis, Juniores) are free with a signed responsibility waiver. Seniors and Veterans: Phase 1 (March 6 – April 15) €10, Phase 2 (April 16 – 22) €12.50, race day €15 (limited to 10 bibs per category). Registration at www.portimer.pt or at the ADIB office. Limit of 200 participants per race.",
    },
    es: {
      question: "¿Cómo funcionan las inscripciones y cuáles son los precios?",
      answer:
        "Categorías juveniles (Benjamins A/B, Infantis, Iniciados, Juvenis, Juniores) son gratuitas con firma de Término de Responsabilidad. Seniores y Veteranos: 1ª fase (6 marzo – 15 abril) 10 €, 2ª fase (16 – 22 abril) 12,50 €, día de la prueba 15 € (limitado a 10 dorsales por categoría). Inscripciones en www.portimer.pt o en la sede de ADIB. Límite de 200 participantes por prueba.",
    },
    fr: {
      question:
        "Comment fonctionnent les inscriptions et quels sont les prix ?",
      answer:
        "Catégories jeunes (Benjamins A/B, Infantis, Iniciados, Juvenis, Juniores) sont gratuites avec signature d'une décharge de responsabilité. Seniors et Vétérans : 1ère phase (6 mars – 15 avril) 10 €, 2e phase (16 – 22 avril) 12,50 €, jour de la course 15 € (limité à 10 dossards par catégorie). Inscriptions sur www.portimer.pt ou au siège d'ADIB. Limite de 200 participants par épreuve.",
    },
    de: {
      question: "Wie funktioniert die Anmeldung und was sind die Preise?",
      answer:
        "Jugendkategorien (Benjamins A/B, Infantis, Iniciados, Juvenis, Juniores) sind kostenlos mit unterschriebener Verantwortungserklärung. Senioren und Veteranen: 1. Phase (6. März – 15. April) 10 €, 2. Phase (16. – 22. April) 12,50 €, Wettkampftag 15 € (begrenzt auf 10 Startnummern pro Kategorie). Anmeldung über www.portimer.pt oder beim ADIB-Büro. Begrenzt auf 200 Teilnehmer pro Rennen.",
    },
    it: {
      question: "Come funzionano le iscrizioni e quali sono i prezzi?",
      answer:
        "Categorie giovanili (Benjamins A/B, Infantis, Iniciados, Juvenis, Juniores) sono gratuite con firma di dichiarazione di responsabilità. Seniores e Veterani: 1ª fase (6 marzo – 15 aprile) 10 €, 2ª fase (16 – 22 aprile) 12,50 €, giorno della gara 15 € (limitato a 10 pettorali per categoria). Iscrizioni su www.portimer.pt o presso la sede ADIB. Limite di 200 partecipanti per gara.",
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

  // FAQ 2: Course and rules
  const faq2 = await findOrCreateFAQ(
    event.id,
    2,
    "Como é o percurso da prova de 13 km?",
    "Partida e chegada na Zona Adjacente ao Mosteiro S. Miguel de Refojos, com aproximadamente 13 km de distância. Percurso sinalizado. É obrigatório usar o dorsal na zona frontal de forma visível. O atleta que não complete o percurso ou ignore indicações da organização será desclassificado."
  );

  const faq2Translations = {
    pt: {
      question: "Como é o percurso da prova de 13 km?",
      answer:
        "Partida e chegada na Zona Adjacente ao Mosteiro S. Miguel de Refojos, com aproximadamente 13 km de distância. Percurso sinalizado. É obrigatório usar o dorsal na zona frontal de forma visível. O atleta que não complete o percurso ou ignore indicações da organização será desclassificado.",
    },
    en: {
      question: "What is the 13 km race course like?",
      answer:
        "Start and finish at the Mosteiro S. Miguel de Refojos area, approximately 13 km distance. Course is fully marked. The bib must be worn on the front and clearly visible. Athletes who do not complete the course or ignore organization instructions will be disqualified.",
    },
    es: {
      question: "¿Cómo es el recorrido de la prueba de 13 km?",
      answer:
        "Salida y meta en la Zona Adyacente al Mosteiro S. Miguel de Refojos, con aproximadamente 13 km de distancia. Recorrido señalizado. Es obligatorio llevar el dorsal en la zona frontal de forma visible. El atleta que no complete el recorrido o ignore las indicaciones de la organización será descalificado.",
    },
    fr: {
      question: "Comment est le parcours de l'épreuve de 13 km ?",
      answer:
        "Départ et arrivée dans la Zone Adjacente au Mosteiro S. Miguel de Refojos, environ 13 km de distance. Parcours balisé. Le dossard doit être porté sur la face avant de manière visible. Tout athlète qui ne termine pas le parcours ou ignore les consignes de l'organisation sera disqualifié.",
    },
    de: {
      question: "Wie sieht die 13-km-Strecke aus?",
      answer:
        "Start und Ziel im angrenzenden Bereich des Mosteiro S. Miguel de Refojos, ca. 13 km Distanz. Strecke ist vollständig markiert. Die Startnummer muss sichtbar auf der Vorderseite getragen werden. Athleten, die die Strecke nicht beenden oder Anweisungen der Organisation ignorieren, werden disqualifiziert.",
    },
    it: {
      question: "Com'è il percorso della gara da 13 km?",
      answer:
        "Partenza e arrivo nella Zona Adiacente al Mosteiro S. Miguel de Refojos, circa 13 km di distanza. Percorso segnalato. Il pettorale deve essere indossato nella zona frontale in modo visibile. L'atleta che non completa il percorso o ignora le indicazioni dell'organizzazione verrà squalificato.",
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
  console.log("✅ FAQ 2: Course and rules");

  // FAQ 3: Prizes
  const faq3 = await findOrCreateFAQ(
    event.id,
    3,
    "Quais são os prémios?",
    "Benjamins A/B, Infantis, Iniciados e Juvenis: Troféu (1º) e medalha (2º e 3º). Juniores: 1º €30, 2º €20, 3º €10 (M/F). Seniores: 1º €100, 2º €60, 3º €30 (M/F). Veteranos 35/40/45/50+: 1º €30, 2º €20, 3º €10 por escalão (M/F). Equipas: 1º €100, 2º €75, 3º €50."
  );

  const faq3Translations = {
    pt: {
      question: "Quais são os prémios?",
      answer:
        "Benjamins A/B, Infantis, Iniciados e Juvenis: Troféu (1º) e medalha (2º e 3º). Juniores: 1º €30, 2º €20, 3º €10 (M/F). Seniores: 1º €100, 2º €60, 3º €30 (M/F). Veteranos 35/40/45/50+: 1º €30, 2º €20, 3º €10 por escalão (M/F). Equipas: 1º €100, 2º €75, 3º €50.",
    },
    en: {
      question: "What are the prizes?",
      answer:
        "Benjamins A/B, Infantis, Iniciados and Juvenis: Trophy (1st) and medal (2nd and 3rd). Juniores: 1st €30, 2nd €20, 3rd €10 (M/F). Seniores: 1st €100, 2nd €60, 3rd €30 (M/F). Veteranos 35/40/45/50+: 1st €30, 2nd €20, 3rd €10 per category (M/F). Teams: 1st €100, 2nd €75, 3rd €50.",
    },
    es: {
      question: "¿Cuáles son los premios?",
      answer:
        "Benjamins A/B, Infantis, Iniciados y Juvenis: Trofeo (1º) y medalla (2º y 3º). Juniores: 1º 30 €, 2º 20 €, 3º 10 € (M/F). Seniores: 1º 100 €, 2º 60 €, 3º 30 € (M/F). Veteranos 35/40/45/50+: 1º 30 €, 2º 20 €, 3º 10 € por categoría (M/F). Equipos: 1º 100 €, 2º 75 €, 3º 50 €.",
    },
    fr: {
      question: "Quels sont les prix ?",
      answer:
        "Benjamins A/B, Infantis, Iniciados et Juvenis : Trophée (1er) et médaille (2e et 3e). Juniores : 1er 30 €, 2e 20 €, 3e 10 € (M/F). Seniores : 1er 100 €, 2e 60 €, 3e 30 € (M/F). Veteranos 35/40/45/50+ : 1er 30 €, 2e 20 €, 3e 10 € par catégorie (M/F). Équipes : 1er 100 €, 2e 75 €, 3e 50 €.",
    },
    de: {
      question: "Welche Preise gibt es?",
      answer:
        "Benjamins A/B, Infantis, Iniciados und Juvenis: Pokal (1.) und Medaille (2. und 3.). Juniores: 1. 30 €, 2. 20 €, 3. 10 € (M/W). Seniores: 1. 100 €, 2. 60 €, 3. 30 € (M/W). Veteranos 35/40/45/50+: 1. 30 €, 2. 20 €, 3. 10 € pro Kategorie (M/W). Mannschaften: 1. 100 €, 2. 75 €, 3. 50 €.",
    },
    it: {
      question: "Quali sono i premi?",
      answer:
        "Benjamins A/B, Infantis, Iniciados e Juvenis: Trofeo (1º) e medaglia (2º e 3º). Juniores: 1º 30 €, 2º 20 €, 3º 10 € (M/F). Seniores: 1º 100 €, 2º 60 €, 3º 30 € (M/F). Veteranos 35/40/45/50+: 1º 30 €, 2º 20 €, 3º 10 € per categoria (M/F). Squadre: 1º 100 €, 2º 75 €, 3º 50 €.",
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

  // FAQ 4: Safety and logistics
  const faq4 = await findOrCreateFAQ(
    event.id,
    4,
    "Que serviços e infraestruturas estão disponíveis?",
    "Abastecimento de água durante e após as provas, abastecimento sólido e líquido na meta. Assistência de ambulância dos Bombeiros Voluntários de Cabeceiras de Basto e Cruz Vermelha do Arco de Baúlhe. Balneários com duche no Pavilhão Gimnodesportivo de Cabeceiras de Basto. Dorsais entregues no dia da prova até 30 min antes de cada corrida."
  );

  const faq4Translations = {
    pt: {
      question: "Que serviços e infraestruturas estão disponíveis?",
      answer:
        "Abastecimento de água durante e após as provas, abastecimento sólido e líquido na meta. Assistência de ambulância dos Bombeiros Voluntários de Cabeceiras de Basto e Cruz Vermelha do Arco de Baúlhe. Balneários com duche no Pavilhão Gimnodesportivo de Cabeceiras de Basto. Dorsais entregues no dia da prova até 30 min antes de cada corrida.",
    },
    en: {
      question: "What services and facilities are available?",
      answer:
        "Water supply during and after races, solid and liquid refreshments at the finish. Ambulance assistance from Cabeceiras de Basto Volunteer Firefighters and Arco de Baúlhe Red Cross. Changing rooms with showers at Cabeceiras de Basto Sports Pavilion. Bibs handed out on race day up to 30 min before each race.",
    },
    es: {
      question: "¿Qué servicios e infraestructuras hay disponibles?",
      answer:
        "Avituallamiento de agua durante y después de las pruebas, avituallamiento sólido y líquido en meta. Asistencia de ambulancia de los Bomberos Voluntarios de Cabeceiras de Basto y Cruz Roja de Arco de Baúlhe. Vestuarios con ducha en el Pabellón Gimnodesportivo de Cabeceiras de Basto. Dorsales entregados el día de la prueba hasta 30 min antes de cada carrera.",
    },
    fr: {
      question: "Quels services et infrastructures sont disponibles ?",
      answer:
        "Ravitaillement en eau pendant et après les épreuves, ravitaillement solide et liquide à l'arrivée. Assistance ambulancière des Pompiers Volontaires de Cabeceiras de Basto et de la Croix-Rouge d'Arco de Baúlhe. Vestiaires avec douches au Pavillon Sportif de Cabeceiras de Basto. Dossards distribués le jour de la course jusqu'à 30 min avant chaque épreuve.",
    },
    de: {
      question: "Welche Dienste und Einrichtungen sind verfügbar?",
      answer:
        "Wasserversorgung während und nach den Rennen, feste und flüssige Verpflegung am Ziel. Krankenwagen-Hilfe der Freiwilligen Feuerwehr Cabeceiras de Basto und des Roten Kreuzes Arco de Baúlhe. Umkleiden mit Duschen in der Sporthalle Cabeceiras de Basto. Startnummern werden am Wettkampftag bis zu 30 Min. vor jedem Rennen verteilt.",
    },
    it: {
      question: "Quali servizi e infrastrutture sono disponibili?",
      answer:
        "Rifornimento d'acqua durante e dopo le gare, ristoro solido e liquido al traguardo. Assistenza ambulanza dei Vigili del Fuoco Volontari di Cabeceiras de Basto e della Croce Rossa di Arco de Baúlhe. Spogliatoi con docce presso il Padiglione Sportivo di Cabeceiras de Basto. Pettorali consegnati il giorno della gara fino a 30 min prima di ogni corsa.",
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
  console.log("✅ FAQ 4: Safety and logistics");

  // ──────────────────────────────────────────────
  // Summary
  // ──────────────────────────────────────────────
  console.log(`
✅ Seed completed successfully!

📊 Summary:
- Event: Corrida da Liberdade 2026 – 37ª Edição
- Slug: corrida-da-liberdade-2026
- Variants: 11 (Benjamins A/B, Infantis, Iniciados, Juvenis, Juniores, Seniores, Vet 35/40/45/50+)
- Languages: 6 (pt, en, es, fr, de, it)
- Pricing Phases: 15 (3 per paid variant × 5 paid variants)
- FAQs: 5 (with translations in all 6 languages)
- Date: April 25, 2026
- Location: Zona Adjacente do Mosteiro de S. Miguel, Praça da República, Cabeceiras de Basto
- Coordinates: 41.5139, -8.0042
- Organization: Associação Dinamizadora dos Interesses de Basto (ADIB)
- Type: Road running, open to federated and non-federated athletes
- Max participants: 200 per race
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
