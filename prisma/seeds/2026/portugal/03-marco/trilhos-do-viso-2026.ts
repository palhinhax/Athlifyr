/**
 * Seed: Trilhos do Viso 2026
 *
 * Event: Trail running in Fervença, Celorico de Basto
 * Location: Escola Básica da Mota, Fervença, Celorico de Basto
 * Date: March 22, 2026 (secretariat opens March 21)
 * Organizer: AMA – Associação Mondim Atletismo + Associação Motociclos Agilde
 * Sport: Trail
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏔️ Seeding Trilhos do Viso 2026...");

  // ──────────────────────────────────────────────
  // 1. Upsert Event (no nested creates)
  // ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: "trilhos-do-viso-2026" },
    update: {
      title: "Trilhos do Viso 2026",
      description:
        "Trilhos do Viso 2026 - Trail em Fervença, Celorico de Basto",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-03-22T07:30:00Z"),
      endDate: new Date("2026-03-22T15:00:00Z"),
      registrationDeadline: new Date("2026-03-10T23:59:59Z"),
      externalUrl: "",
      imageUrl: "",
      city: "Fervença",
      country: "Portugal",
      latitude: 41.371847,
      longitude: -8.092951,
      googleMapsUrl: "",
      isFeatured: false,
      cancelled: false,
    },
    create: {
      title: "Trilhos do Viso 2026",
      slug: "trilhos-do-viso-2026",
      description:
        "Trilhos do Viso 2026 - Trail em Fervença, Celorico de Basto",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-03-22T07:30:00Z"),
      endDate: new Date("2026-03-22T15:00:00Z"),
      registrationDeadline: new Date("2026-03-10T23:59:59Z"),
      externalUrl: "",
      imageUrl: "",
      city: "Fervença",
      country: "Portugal",
      latitude: 41.371847,
      longitude: -8.092951,
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
      title: "Trilhos do Viso 2026",
      description: `# 🏔️ Trilhos do Viso 2026

**Os Trilhos do Viso regressam a Fervença, Celorico de Basto, a 22 de março de 2026!** Organizado pela AMA – Associação Mondim Atletismo e Associação Motociclos Agilde, com o apoio do Município de Celorico de Basto. Percursos circulares por caminhos, trilhos, levadas, rios e estradas florestais. Regime semiautónomo.

---

## 🏔️ Provas

- **Trail Longo** – 25 km · D+ 1100 m · Competitivo
- **Trail Curto** – 18 km · D+ 800 m · Competitivo
- **Caminhada** – 10 km · D+ 400 m · Não competitiva

---

🏔️ **Vem trilhar connosco em Celorico de Basto!** 🏃`,
      city: "Fervença, Celorico de Basto",
      metaTitle:
        "Trilhos do Viso 2026 | Fervença, Celorico de Basto | 22 Março",
      metaDescription:
        "Trilhos do Viso 2026 - 22 de março em Fervença, Celorico de Basto. Provas: Trail Longo 25km (D+1100m), Trail Curto 18km (D+800m) e Caminhada 10km (D+400m). Regime semiautónomo.",
    },
    en: {
      title: "Trilhos do Viso 2026",
      description: `# 🏔️ Trilhos do Viso 2026

**Trilhos do Viso returns to Fervença, Celorico de Basto, on March 22, 2026!** Organized by AMA – Associação Mondim Atletismo and Associação Motociclos Agilde, with support from the Municipality of Celorico de Basto. Circular routes through paths, trails, water channels, rivers and forest roads. Semi-autonomous regime.

---

## 🏔️ Races

- **Long Trail** – 25 km · D+ 1,100 m · Competitive
- **Short Trail** – 18 km · D+ 800 m · Competitive
- **Walk** – 10 km · D+ 400 m · Non-competitive

---

🏔️ **Come trail with us in Celorico de Basto!** 🏃`,
      city: "Fervença, Celorico de Basto",
      metaTitle:
        "Trilhos do Viso 2026 | Fervença, Celorico de Basto | March 22",
      metaDescription:
        "Trilhos do Viso 2026 - March 22 in Fervença, Celorico de Basto. Races: Long Trail 25km (D+1100m), Short Trail 18km (D+800m) and Walk 10km (D+400m). Semi-autonomous regime.",
    },
    es: {
      title: "Trilhos do Viso 2026",
      description: `# 🏔️ Trilhos do Viso 2026

**Los Trilhos do Viso regresan a Fervença, Celorico de Basto, el 22 de marzo de 2026!** Organizado por AMA – Associação Mondim Atletismo y Associação Motociclos Agilde, con el apoyo del Municipio de Celorico de Basto. Recorridos circulares por caminos, senderos, acequias, ríos y pistas forestales. Régimen semiautónomo.

---

## 🏔️ Pruebas

- **Trail Largo** – 25 km · D+ 1100 m · Competitivo
- **Trail Corto** – 18 km · D+ 800 m · Competitivo
- **Caminata** – 10 km · D+ 400 m · No competitiva

---

🏔️ **¡Ven a correr con nosotros en Celorico de Basto!** 🏃`,
      city: "Fervença, Celorico de Basto",
      metaTitle:
        "Trilhos do Viso 2026 | Fervença, Celorico de Basto | 22 Marzo",
      metaDescription:
        "Trilhos do Viso 2026 - 22 de marzo en Fervença, Celorico de Basto. Pruebas: Trail Largo 25km (D+1100m), Trail Corto 18km (D+800m) y Caminata 10km (D+400m). Régimen semiautónomo.",
    },
    fr: {
      title: "Trilhos do Viso 2026",
      description: `# 🏔️ Trilhos do Viso 2026

**Les Trilhos do Viso reviennent à Fervença, Celorico de Basto, le 22 mars 2026 !** Organisé par AMA – Associação Mondim Atletismo et Associação Motociclos Agilde, avec le soutien de la Municipalité de Celorico de Basto. Parcours circulaires sur chemins, sentiers, levadas, rivières et pistes forestières. Régime semi-autonome.

---

## 🏔️ Épreuves

- **Trail Long** – 25 km · D+ 1100 m · Compétitif
- **Trail Court** – 18 km · D+ 800 m · Compétitif
- **Marche** – 10 km · D+ 400 m · Non compétitive

---

🏔️ **Venez courir avec nous à Celorico de Basto !** 🏃`,
      city: "Fervença, Celorico de Basto",
      metaTitle: "Trilhos do Viso 2026 | Fervença, Celorico de Basto | 22 Mars",
      metaDescription:
        "Trilhos do Viso 2026 - 22 mars à Fervença, Celorico de Basto. Épreuves : Trail Long 25km (D+1100m), Trail Court 18km (D+800m) et Marche 10km (D+400m). Régime semi-autonome.",
    },
    de: {
      title: "Trilhos do Viso 2026",
      description: `# 🏔️ Trilhos do Viso 2026

**Die Trilhos do Viso kehren am 22. März 2026 nach Fervença, Celorico de Basto, zurück!** Organisiert von AMA – Associação Mondim Atletismo und Associação Motociclos Agilde, mit Unterstützung der Gemeinde Celorico de Basto. Rundkurse über Wege, Trails, Wasserkanäle, Flüsse und Forstwege. Halbautonomer Modus.

---

## 🏔️ Läufe

- **Langer Trail** – 25 km · D+ 1100 m · Wettkampf
- **Kurzer Trail** – 18 km · D+ 800 m · Wettkampf
- **Wanderung** – 10 km · D+ 400 m · Ohne Wertung

---

🏔️ **Komm und lauf mit uns in Celorico de Basto!** 🏃`,
      city: "Fervença, Celorico de Basto",
      metaTitle:
        "Trilhos do Viso 2026 | Fervença, Celorico de Basto | 22. März",
      metaDescription:
        "Trilhos do Viso 2026 - 22. März in Fervença, Celorico de Basto. Läufe: Langer Trail 25km (D+1100m), Kurzer Trail 18km (D+800m) und Wanderung 10km (D+400m). Halbautonomer Modus.",
    },
    it: {
      title: "Trilhos do Viso 2026",
      description: `# 🏔️ Trilhos do Viso 2026

**I Trilhos do Viso tornano a Fervença, Celorico de Basto, il 22 marzo 2026!** Organizzato da AMA – Associação Mondim Atletismo e Associação Motociclos Agilde, con il supporto del Comune di Celorico de Basto. Percorsi circolari su sentieri, strade sterrate, canali d'acqua, fiumi e strade forestali. Regime semi-autonomo.

---

## 🏔️ Gare

- **Trail Lungo** – 25 km · D+ 1100 m · Competitivo
- **Trail Corto** – 18 km · D+ 800 m · Competitivo
- **Camminata** – 10 km · D+ 400 m · Non competitiva

---

🏔️ **Vieni a correre con noi a Celorico de Basto!** 🏃`,
      city: "Fervença, Celorico de Basto",
      metaTitle:
        "Trilhos do Viso 2026 | Fervença, Celorico de Basto | 22 Marzo",
      metaDescription:
        "Trilhos do Viso 2026 - 22 marzo a Fervença, Celorico de Basto. Gare: Trail Lungo 25km (D+1100m), Trail Corto 18km (D+800m) e Camminata 10km (D+400m). Regime semi-autonomo.",
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

  // ── Variant 1: Trail Longo 25 km ──
  const trailLongo = await findOrCreateVariant({
    name: "Trail Longo 25km",
    distanceKm: 25,
    elevationGainM: 1100,
    elevationLossM: 1100,
    startDate: new Date("2026-03-22T08:30:00Z"),
    startTime: "08:30",
    cutoffTimeHours: 5,
    price: 16.0,
    currency: Currency.EUR,
    maxParticipants: 300,
    atrpGrade: null,
    itraPoints: null,
    description: "Trail Longo 25km · D+ 1100m · Competitivo · Semiautónomo",
  });
  console.log(`✅ Variant: ${trailLongo.name}`);

  // ── Variant 2: Trail Curto 18 km ──
  const trailCurto = await findOrCreateVariant({
    name: "Trail Curto 18km",
    distanceKm: 18,
    elevationGainM: 800,
    elevationLossM: 800,
    startDate: new Date("2026-03-22T09:00:00Z"),
    startTime: "09:00",
    cutoffTimeHours: 4,
    price: 14.0,
    currency: Currency.EUR,
    maxParticipants: 500,
    atrpGrade: null,
    itraPoints: null,
    description: "Trail Curto 18km · D+ 800m · Competitivo · Semiautónomo",
  });
  console.log(`✅ Variant: ${trailCurto.name}`);

  // ── Variant 3: Caminhada 10 km ──
  const caminhada = await findOrCreateVariant({
    name: "Caminhada 10km",
    distanceKm: 10,
    elevationGainM: 400,
    elevationLossM: 400,
    startDate: new Date("2026-03-22T09:30:00Z"),
    startTime: "09:30",
    cutoffTimeHours: 2.5,
    price: 10.0,
    currency: Currency.EUR,
    maxParticipants: 200,
    atrpGrade: null,
    itraPoints: null,
    description: "Caminhada 10km · D+ 400m · Não competitiva",
  });
  console.log(`✅ Variant: ${caminhada.name}`);

  // ──────────────────────────────────────────────
  // 4. Pricing Phases (linked to eventId)
  // ──────────────────────────────────────────────

  await findOrCreatePricingPhase("Trail Longo 25km - Inscrição", {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-03-10T23:59:59Z"),
    price: 16.0,
    currency: Currency.EUR,
    note: null,
  });
  console.log("   - 1 pricing phase for Trail Longo 25km");

  await findOrCreatePricingPhase("Trail Curto 18km - Inscrição", {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-03-10T23:59:59Z"),
    price: 14.0,
    currency: Currency.EUR,
    note: null,
  });
  console.log("   - 1 pricing phase for Trail Curto 18km");

  await findOrCreatePricingPhase("Caminhada 10km - Inscrição", {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-03-10T23:59:59Z"),
    price: 10.0,
    currency: Currency.EUR,
    note: null,
  });
  console.log("   - 1 pricing phase for Caminhada 10km");

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
    "Qual é o programa do evento?",
    "Sábado 21/03: 15h00-18h00 secretariado. Domingo 22/03: 07h30 secretariado · 08h15 controlo de material · 08h30 partida Trail Longo · 09h00 partida Trail Curto · 09h30 partida Caminhada · 12h30 entrega de prémios · 15h00 encerramento."
  );

  const faq0Translations = {
    pt: {
      question: "Qual é o programa do evento?",
      answer:
        "Sábado 21/03: 15h00-18h00 secretariado. Domingo 22/03: 07h30 secretariado · 08h15 controlo de material · 08h30 partida Trail Longo · 09h00 partida Trail Curto · 09h30 partida Caminhada · 12h30 entrega de prémios · 15h00 encerramento.",
    },
    en: {
      question: "What is the event schedule?",
      answer:
        "Saturday 21/03: 3:00 PM-6:00 PM registration. Sunday 22/03: 7:30 AM registration · 8:15 AM gear check · 8:30 AM Long Trail start · 9:00 AM Short Trail start · 9:30 AM Walk start · 12:30 PM awards · 3:00 PM event closes.",
    },
    es: {
      question: "¿Cuál es el programa del evento?",
      answer:
        "Sábado 21/03: 15:00-18:00 secretaría. Domingo 22/03: 07:30 secretaría · 08:15 control de material · 08:30 salida Trail Largo · 09:00 salida Trail Corto · 09:30 salida Caminata · 12:30 entrega de premios · 15:00 cierre.",
    },
    fr: {
      question: "Quel est le programme de l'événement ?",
      answer:
        "Samedi 21/03 : 15h00-18h00 secrétariat. Dimanche 22/03 : 07h30 secrétariat · 08h15 contrôle du matériel · 08h30 départ Trail Long · 09h00 départ Trail Court · 09h30 départ Marche · 12h30 remise des prix · 15h00 clôture.",
    },
    de: {
      question: "Wie ist der Programmablauf?",
      answer:
        "Samstag 21.03: 15:00-18:00 Sekretariat. Sonntag 22.03: 07:30 Sekretariat · 08:15 Ausrüstungskontrolle · 08:30 Start Langer Trail · 09:00 Start Kurzer Trail · 09:30 Start Wanderung · 12:30 Siegerehrung · 15:00 Ende.",
    },
    it: {
      question: "Qual è il programma dell'evento?",
      answer:
        "Sabato 21/03: 15:00-18:00 segreteria. Domenica 22/03: 07:30 segreteria · 08:15 controllo materiale · 08:30 partenza Trail Lungo · 09:00 partenza Trail Corto · 09:30 partenza Camminata · 12:30 premiazioni · 15:00 chiusura.",
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

  // FAQ 1: What's included
  const faq1 = await findOrCreateFAQ(
    event.id,
    1,
    "O que está incluído na inscrição?",
    "Trail Longo e Trail Curto: t-shirt oficial, lembranças, dorsal personalizado, abastecimentos sólidos e líquidos, prémio finisher, banhos, seguro e transporte em caso de abandono. Caminhada: t-shirt oficial, abastecimentos, prémio finisher, banhos, seguro e transporte."
  );

  const faq1Translations = {
    pt: {
      question: "O que está incluído na inscrição?",
      answer:
        "Trail Longo e Trail Curto: t-shirt oficial, lembranças, dorsal personalizado, abastecimentos sólidos e líquidos, prémio finisher, banhos, seguro e transporte em caso de abandono. Caminhada: t-shirt oficial, abastecimentos, prémio finisher, banhos, seguro e transporte.",
    },
    en: {
      question: "What's included in the registration?",
      answer:
        "Long Trail and Short Trail: official t-shirt, souvenirs, personalized bib, food/drink at aid stations, finisher prize, showers, insurance and transport in case of withdrawal. Walk: official t-shirt, food/drink, finisher prize, showers, insurance and transport.",
    },
    es: {
      question: "¿Qué incluye la inscripción?",
      answer:
        "Trail Largo y Trail Corto: camiseta oficial, recuerdos, dorsal personalizado, avituallamiento sólido y líquido, premio finisher, duchas, seguro y transporte en caso de abandono. Caminata: camiseta oficial, avituallamiento, premio finisher, duchas, seguro y transporte.",
    },
    fr: {
      question: "Qu'est-ce qui est inclus dans l'inscription ?",
      answer:
        "Trail Long et Trail Court : t-shirt officiel, souvenirs, dossard personnalisé, ravitaillement solide et liquide, prix finisher, douches, assurance et transport en cas d'abandon. Marche : t-shirt officiel, ravitaillement, prix finisher, douches, assurance et transport.",
    },
    de: {
      question: "Was ist in der Anmeldung enthalten?",
      answer:
        "Langer Trail und Kurzer Trail: offizielles T-Shirt, Andenken, personalisierte Startnummer, Verpflegung, Finisher-Preis, Duschen, Versicherung und Transport bei Aufgabe. Wanderung: offizielles T-Shirt, Verpflegung, Finisher-Preis, Duschen, Versicherung und Transport.",
    },
    it: {
      question: "Cosa è incluso nell'iscrizione?",
      answer:
        "Trail Lungo e Trail Corto: t-shirt ufficiale, souvenir, pettorale personalizzato, ristoro solido e liquido, premio finisher, docce, assicurazione e trasporto in caso di ritiro. Camminata: t-shirt ufficiale, ristoro, premio finisher, docce, assicurazione e trasporto.",
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
  console.log("✅ FAQ 1: What's included");

  // FAQ 2: Group discount
  const faq2 = await findOrCreateFAQ(
    event.id,
    2,
    "Existe desconto para equipas?",
    "Sim! Por cada 5 inscrições válidas, a 6ª é oferecida. É necessário enviar email para geral.prosportevents@gmail.com a solicitar a oferta antes de efetuar o pagamento."
  );

  const faq2Translations = {
    pt: {
      question: "Existe desconto para equipas?",
      answer:
        "Sim! Por cada 5 inscrições válidas, a 6ª é oferecida. É necessário enviar email para geral.prosportevents@gmail.com a solicitar a oferta antes de efetuar o pagamento.",
    },
    en: {
      question: "Are there team discounts?",
      answer:
        "Yes! For every 5 valid registrations, the 6th is free. You must email geral.prosportevents@gmail.com to request the offer before making payment.",
    },
    es: {
      question: "¿Hay descuentos para equipos?",
      answer:
        "¡Sí! Por cada 5 inscripciones válidas, la 6ª es gratuita. Es necesario enviar un email a geral.prosportevents@gmail.com solicitando la oferta antes de realizar el pago.",
    },
    fr: {
      question: "Y a-t-il des réductions pour les équipes ?",
      answer:
        "Oui ! Pour chaque 5 inscriptions valides, la 6e est offerte. Il faut envoyer un email à geral.prosportevents@gmail.com pour demander l'offre avant d'effectuer le paiement.",
    },
    de: {
      question: "Gibt es Teamrabatte?",
      answer:
        "Ja! Für jeweils 5 gültige Anmeldungen ist die 6. kostenlos. Bitte per E-Mail an geral.prosportevents@gmail.com das Angebot anfordern, bevor die Zahlung erfolgt.",
    },
    it: {
      question: "Ci sono sconti per squadre?",
      answer:
        "Sì! Ogni 5 iscrizioni valide, la 6ª è gratuita. È necessario inviare un'email a geral.prosportevents@gmail.com per richiedere l'offerta prima di effettuare il pagamento.",
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
  console.log("✅ FAQ 2: Group discount");

  // FAQ 3: Mandatory equipment
  const faq3 = await findOrCreateFAQ(
    event.id,
    3,
    "Qual é o material obrigatório?",
    "As provas são em regime semiautónomo. Haverá controlo de material obrigatório às 08h15. Por cada item em falta, é aplicada uma penalização de 30 minutos ao tempo de prova. A organização não fornece copos nos abastecimentos. A lista detalhada será publicada nas redes sociais do evento."
  );

  const faq3Translations = {
    pt: {
      question: "Qual é o material obrigatório?",
      answer:
        "As provas são em regime semiautónomo. Haverá controlo de material obrigatório às 08h15. Por cada item em falta, é aplicada uma penalização de 30 minutos ao tempo de prova. A organização não fornece copos nos abastecimentos. A lista detalhada será publicada nas redes sociais do evento.",
    },
    en: {
      question: "What mandatory equipment is required?",
      answer:
        "Races operate in semi-autonomous mode. Mandatory gear check at 8:15 AM. A 30-minute penalty is applied for each missing item. The organization does not provide cups at aid stations. The detailed list will be published on the event's social media.",
    },
    es: {
      question: "¿Cuál es el material obligatorio?",
      answer:
        "Las pruebas son en régimen semiautónomo. Habrá control de material obligatorio a las 08:15. Por cada artículo faltante se aplica una penalización de 30 minutos. La organización no proporciona vasos en los avituallamientos. La lista detallada se publicará en las redes sociales del evento.",
    },
    fr: {
      question: "Quel est le matériel obligatoire ?",
      answer:
        "Les épreuves sont en régime semi-autonome. Contrôle du matériel obligatoire à 08h15. Une pénalité de 30 minutes est appliquée par article manquant. L'organisation ne fournit pas de gobelets aux ravitaillements. La liste détaillée sera publiée sur les réseaux sociaux de l'événement.",
    },
    de: {
      question: "Welche Pflichtausrüstung ist erforderlich?",
      answer:
        "Die Rennen laufen im halbautonomen Modus. Pflichtausrüstungskontrolle um 08:15 Uhr. Pro fehlendem Gegenstand werden 30 Minuten Strafe verhängt. Die Organisation stellt keine Becher an den Verpflegungsstationen bereit. Die detaillierte Liste wird in den sozialen Medien des Events veröffentlicht.",
    },
    it: {
      question: "Qual è il materiale obbligatorio?",
      answer:
        "Le gare sono in regime semi-autonomo. Controllo del materiale obbligatorio alle 08:15. Per ogni articolo mancante viene applicata una penalità di 30 minuti. L'organizzazione non fornisce bicchieri ai ristori. La lista dettagliata sarà pubblicata sui social media dell'evento.",
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
  console.log("✅ FAQ 3: Mandatory equipment");

  // FAQ 4: Categories and prizes
  const faq4 = await findOrCreateFAQ(
    event.id,
    4,
    "Quais são as categorias e prémios?",
    "Trail Longo e Trail Curto – M/F: Geral (top 3), SUB23 (18-22), SEN (23-34), M/F35 a M/F70 (escalões de 5 anos). Classificação coletiva: top 3 equipas (mínimo 3 elementos) por soma de lugares. Caminhada sem classificação competitiva."
  );

  const faq4Translations = {
    pt: {
      question: "Quais são as categorias e prémios?",
      answer:
        "Trail Longo e Trail Curto – M/F: Geral (top 3), SUB23 (18-22), SEN (23-34), M/F35 a M/F70 (escalões de 5 anos). Classificação coletiva: top 3 equipas (mínimo 3 elementos) por soma de lugares. Caminhada sem classificação competitiva.",
    },
    en: {
      question: "What are the categories and prizes?",
      answer:
        "Long Trail and Short Trail – M/F: Overall (top 3), U23 (18-22), SEN (23-34), M/F35 to M/F70 (5-year brackets). Team classification: top 3 teams (minimum 3 members) by sum of positions. Walk has no competitive ranking.",
    },
    es: {
      question: "¿Cuáles son las categorías y premios?",
      answer:
        "Trail Largo y Trail Corto – M/F: General (top 3), SUB23 (18-22), SEN (23-34), M/F35 a M/F70 (escalones de 5 años). Clasificación colectiva: top 3 equipos (mínimo 3 miembros) por suma de puestos. Caminata sin clasificación competitiva.",
    },
    fr: {
      question: "Quelles sont les catégories et les prix ?",
      answer:
        "Trail Long et Trail Court – H/F : Général (top 3), SUB23 (18-22), SEN (23-34), M/F35 à M/F70 (tranches de 5 ans). Classement collectif : top 3 équipes (minimum 3 membres) par somme des places. Marche sans classement compétitif.",
    },
    de: {
      question: "Welche Kategorien und Preise gibt es?",
      answer:
        "Langer Trail und Kurzer Trail – M/W: Gesamt (Top 3), U23 (18-22), SEN (23-34), M/W35 bis M/W70 (5-Jahres-Stufen). Teamwertung: Top 3 Teams (mindestens 3 Mitglieder) nach Platzsumme. Wanderung ohne Wettkampfwertung.",
    },
    it: {
      question: "Quali sono le categorie e i premi?",
      answer:
        "Trail Lungo e Trail Corto – M/F: Generale (top 3), SUB23 (18-22), SEN (23-34), M/F35 a M/F70 (fasce di 5 anni). Classifica a squadre: top 3 squadre (minimo 3 membri) per somma dei piazzamenti. Camminata senza classifica competitiva.",
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
  console.log("✅ FAQ 4: Categories and prizes");

  // FAQ 5: Cutoff times and penalties
  const faq5 = await findOrCreateFAQ(
    event.id,
    5,
    "Quais são os tempos limite e penalizações?",
    "Trail Longo: 5h · Trail Curto: 4h · Caminhada: 2h30. Penalizações: falha em 1 posto de controlo = 30min, 2 PC = 60min, 3+ PC = desclassificação. Por cada item de material obrigatório em falta: 30min de penalização."
  );

  const faq5Translations = {
    pt: {
      question: "Quais são os tempos limite e penalizações?",
      answer:
        "Trail Longo: 5h · Trail Curto: 4h · Caminhada: 2h30. Penalizações: falha em 1 posto de controlo = 30min, 2 PC = 60min, 3+ PC = desclassificação. Por cada item de material obrigatório em falta: 30min de penalização.",
    },
    en: {
      question: "What are the cutoff times and penalties?",
      answer:
        "Long Trail: 5h · Short Trail: 4h · Walk: 2h30. Penalties: missing 1 checkpoint = 30min, 2 CP = 60min, 3+ CP = disqualification. 30-minute penalty for each missing mandatory equipment item.",
    },
    es: {
      question: "¿Cuáles son los tiempos límite y penalizaciones?",
      answer:
        "Trail Largo: 5h · Trail Corto: 4h · Caminata: 2h30. Penalizaciones: falta en 1 puesto de control = 30min, 2 PC = 60min, 3+ PC = descalificación. 30 minutos de penalización por cada artículo de material obligatorio faltante.",
    },
    fr: {
      question: "Quels sont les temps limites et pénalités ?",
      answer:
        "Trail Long : 5h · Trail Court : 4h · Marche : 2h30. Pénalités : absence à 1 point de contrôle = 30min, 2 PC = 60min, 3+ PC = disqualification. 30 minutes de pénalité par article de matériel obligatoire manquant.",
    },
    de: {
      question: "Wie sind die Zeitlimits und Strafen?",
      answer:
        "Langer Trail: 5h · Kurzer Trail: 4h · Wanderung: 2h30. Strafen: 1 fehlender Kontrollpunkt = 30min, 2 KP = 60min, 3+ KP = Disqualifikation. 30 Minuten Strafe pro fehlendem Pflichtausrüstungsgegenstand.",
    },
    it: {
      question: "Quali sono i tempi limite e le penalità?",
      answer:
        "Trail Lungo: 5h · Trail Corto: 4h · Camminata: 2h30. Penalità: assenza a 1 punto di controllo = 30min, 2 PC = 60min, 3+ PC = squalifica. 30 minuti di penalità per ogni articolo di materiale obbligatorio mancante.",
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
  console.log("✅ FAQ 5: Cutoff times and penalties");

  // ──────────────────────────────────────────────
  // Summary
  // ──────────────────────────────────────────────
  console.log(`
✅ Seed completed successfully!

📊 Summary:
- Event: Trilhos do Viso 2026
- Slug: trilhos-do-viso-2026
- Variants: 3 (Trail Longo 25km, Trail Curto 18km, Caminhada 10km)
- Languages: 6 (pt, en, es, fr, de, it)
- Pricing Phases: 3 total
- FAQs: 6 (with translations in all 6 languages)
- Date: March 22, 2026
- Location: Escola Básica da Mota, Fervença, Celorico de Basto
- Coordinates: 41.371847, -8.092951
- Organization: AMA – Associação Mondim Atletismo + Associação Motociclos Agilde
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
