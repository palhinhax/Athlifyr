/**
 * Seed: III Caminhada / Mini Trail Solidário Bairros FC 2026
 *
 * Event: Mini Trail + Caminhada + Trail Kids in Bairros, Paço de Sousa
 * Location: Praceta Central de Bairros, Paço de Sousa, Penafiel
 * Date: March 15, 2026
 * Organizer: Bairros FC
 * Sport: Trail
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(
    "⚽ Seeding III Caminhada / Mini Trail Solidário Bairros FC 2026..."
  );

  // ──────────────────────────────────────────────
  // 1. Upsert Event (no nested creates)
  // ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: "caminhada-mini-trail-bairros-fc-2026" },
    update: {
      title: "III Caminhada / Mini Trail Solidário Bairros FC 2026",
      description:
        "III Caminhada / Mini Trail Solidário Bairros FC 2026 - Trail em Bairros, Paço de Sousa",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-03-15T08:00:00Z"),
      endDate: new Date("2026-03-15T13:00:00Z"),
      registrationDeadline: new Date("2026-03-07T23:59:59Z"),
      externalUrl: "http://events.portimer.pt/",
      imageUrl: "",
      city: "Bairros",
      country: "Portugal",
      latitude: 41.156143,
      longitude: -8.350444,
      googleMapsUrl: "",
      isFeatured: false,
      cancelled: false,
    },
    create: {
      title: "III Caminhada / Mini Trail Solidário Bairros FC 2026",
      slug: "caminhada-mini-trail-bairros-fc-2026",
      description:
        "III Caminhada / Mini Trail Solidário Bairros FC 2026 - Trail em Bairros, Paço de Sousa",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-03-15T08:00:00Z"),
      endDate: new Date("2026-03-15T13:00:00Z"),
      registrationDeadline: new Date("2026-03-07T23:59:59Z"),
      externalUrl: "http://events.portimer.pt/",
      imageUrl: "",
      city: "Bairros",
      country: "Portugal",
      latitude: 41.156143,
      longitude: -8.350444,
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
      title: "III Caminhada / Mini Trail Solidário Bairros FC 2026",
      description: `# ⚽ III Caminhada / Mini Trail Solidário Bairros FC 2026

**A 3ª edição da Caminhada / Mini Trail Solidário do Bairros FC realiza-se a 15 de março de 2026 em Bairros, Paço de Sousa (Penafiel).** Evento solidário com €1 de cada inscrição a reverter para os Bombeiros Voluntários de Paço de Sousa. Percursos circulares por caminhos e trilhos maioritariamente florestais.

---

## 🏔️ Provas

- **Mini Trail** – 12 km · D+ 500 m · Cronometragem por chip
- **Caminhada** – 7 km · D+ 200 m · Aberta a todos
- **Trail Kids** – ~1 km · D+ 50 m · Gratuito 🎉 (idades 4-13)

---

⚽ **Vem correr por uma boa causa em Bairros!** 🏃`,
      city: "Bairros, Paço de Sousa",
      metaTitle:
        "III Caminhada / Mini Trail Solidário Bairros FC 2026 | Paço de Sousa, Penafiel | 15 Março",
      metaDescription:
        "III Caminhada / Mini Trail Solidário Bairros FC 2026 - 15 de março em Bairros, Paço de Sousa. Provas: Mini Trail 12km, Caminhada 7km e Trail Kids. Evento solidário a favor dos Bombeiros de Paço de Sousa.",
    },
    en: {
      title: "III Solidarity Walk / Mini Trail Bairros FC 2026",
      description: `# ⚽ III Solidarity Walk / Mini Trail Bairros FC 2026

**The 3rd edition of the Bairros FC Solidarity Walk / Mini Trail takes place on March 15, 2026 in Bairros, Paço de Sousa (Penafiel).** A charity event with €1 from each registration going to the Paço de Sousa Volunteer Fire Brigade. Circular routes through mostly forest trails and paths.

---

## 🏔️ Races

- **Mini Trail** – 12 km · D+ 500 m · Chip timing
- **Walk** – 7 km · D+ 200 m · Open to all
- **Trail Kids** – ~1 km · D+ 50 m · Free 🎉 (ages 4-13)

---

⚽ **Come run for a good cause in Bairros!** 🏃`,
      city: "Bairros, Paço de Sousa",
      metaTitle:
        "III Solidarity Walk / Mini Trail Bairros FC 2026 | Paço de Sousa, Penafiel | March 15",
      metaDescription:
        "III Solidarity Walk / Mini Trail Bairros FC 2026 - March 15 in Bairros, Paço de Sousa. Races: Mini Trail 12km, Walk 7km and Trail Kids. Charity event supporting the Paço de Sousa Fire Brigade.",
    },
    es: {
      title: "III Caminata / Mini Trail Solidario Bairros FC 2026",
      description: `# ⚽ III Caminata / Mini Trail Solidario Bairros FC 2026

**La 3ª edición de la Caminata / Mini Trail Solidario del Bairros FC se celebra el 15 de marzo de 2026 en Bairros, Paço de Sousa (Penafiel).** Evento solidario con 1 € de cada inscripción destinado a los Bomberos Voluntarios de Paço de Sousa. Recorridos circulares por caminos y senderos mayoritariamente forestales.

---

## 🏔️ Pruebas

- **Mini Trail** – 12 km · D+ 500 m · Cronometraje con chip
- **Caminata** – 7 km · D+ 200 m · Abierta a todos
- **Trail Kids** – ~1 km · D+ 50 m · Gratis 🎉 (edades 4-13)

---

⚽ **¡Ven a correr por una buena causa en Bairros!** 🏃`,
      city: "Bairros, Paço de Sousa",
      metaTitle:
        "III Caminata / Mini Trail Solidario Bairros FC 2026 | Paço de Sousa, Penafiel | 15 Marzo",
      metaDescription:
        "III Caminata / Mini Trail Solidario Bairros FC 2026 - 15 de marzo en Bairros, Paço de Sousa. Pruebas: Mini Trail 12km, Caminata 7km y Trail Kids. Evento solidario a favor de los bomberos de Paço de Sousa.",
    },
    fr: {
      title: "III Marche / Mini Trail Solidaire Bairros FC 2026",
      description: `# ⚽ III Marche / Mini Trail Solidaire Bairros FC 2026

**La 3e édition de la Marche / Mini Trail Solidaire du Bairros FC se déroule le 15 mars 2026 à Bairros, Paço de Sousa (Penafiel).** Événement caritatif avec 1 € de chaque inscription reversé aux Pompiers Volontaires de Paço de Sousa. Parcours circulaires sur sentiers et chemins principalement forestiers.

---

## 🏔️ Épreuves

- **Mini Trail** – 12 km · D+ 500 m · Chronométrage par puce
- **Marche** – 7 km · D+ 200 m · Ouverte à tous
- **Trail Kids** – ~1 km · D+ 50 m · Gratuit 🎉 (4-13 ans)

---

⚽ **Venez courir pour une bonne cause à Bairros !** 🏃`,
      city: "Bairros, Paço de Sousa",
      metaTitle:
        "III Marche / Mini Trail Solidaire Bairros FC 2026 | Paço de Sousa, Penafiel | 15 Mars",
      metaDescription:
        "III Marche / Mini Trail Solidaire Bairros FC 2026 - 15 mars à Bairros, Paço de Sousa. Épreuves : Mini Trail 12km, Marche 7km et Trail Kids. Événement caritatif au profit des pompiers de Paço de Sousa.",
    },
    de: {
      title: "III Solidaritätswanderung / Mini Trail Bairros FC 2026",
      description: `# ⚽ III Solidaritätswanderung / Mini Trail Bairros FC 2026

**Die 3. Ausgabe der Solidaritätswanderung / Mini Trail des Bairros FC findet am 15. März 2026 in Bairros, Paço de Sousa (Penafiel) statt.** Wohltätigkeitsveranstaltung – 1 € jeder Anmeldung geht an die Freiwillige Feuerwehr Paço de Sousa. Rundkurse auf überwiegend Wald- und Feldwegen.

---

## 🏔️ Läufe

- **Mini Trail** – 12 km · D+ 500 m · Chip-Zeitmessung
- **Wanderung** – 7 km · D+ 200 m · Offen für alle
- **Trail Kids** – ~1 km · D+ 50 m · Kostenlos 🎉 (4-13 Jahre)

---

⚽ **Komm und lauf für einen guten Zweck in Bairros!** 🏃`,
      city: "Bairros, Paço de Sousa",
      metaTitle:
        "III Solidaritätswanderung / Mini Trail Bairros FC 2026 | Paço de Sousa, Penafiel | 15. März",
      metaDescription:
        "III Solidaritätswanderung / Mini Trail Bairros FC 2026 - 15. März in Bairros, Paço de Sousa. Läufe: Mini Trail 12km, Wanderung 7km und Trail Kids. Wohltätigkeitsveranstaltung zugunsten der Feuerwehr Paço de Sousa.",
    },
    it: {
      title: "III Camminata / Mini Trail Solidale Bairros FC 2026",
      description: `# ⚽ III Camminata / Mini Trail Solidale Bairros FC 2026

**La 3ª edizione della Camminata / Mini Trail Solidale del Bairros FC si svolge il 15 marzo 2026 a Bairros, Paço de Sousa (Penafiel).** Evento benefico con 1 € di ogni iscrizione devoluto ai Vigili del Fuoco Volontari di Paço de Sousa. Percorsi circolari su sentieri e strade prevalentemente forestali.

---

## 🏔️ Gare

- **Mini Trail** – 12 km · D+ 500 m · Cronometraggio con chip
- **Camminata** – 7 km · D+ 200 m · Aperta a tutti
- **Trail Kids** – ~1 km · D+ 50 m · Gratuito 🎉 (4-13 anni)

---

⚽ **Vieni a correre per una buona causa a Bairros!** 🏃`,
      city: "Bairros, Paço de Sousa",
      metaTitle:
        "III Camminata / Mini Trail Solidale Bairros FC 2026 | Paço de Sousa, Penafiel | 15 Marzo",
      metaDescription:
        "III Camminata / Mini Trail Solidale Bairros FC 2026 - 15 marzo a Bairros, Paço de Sousa. Gare: Mini Trail 12km, Camminata 7km e Trail Kids. Evento benefico a favore dei pompieri di Paço de Sousa.",
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

  // ── Variant 1: Mini Trail 12 km ──
  const miniTrail = await findOrCreateVariant({
    name: "Mini Trail 12km",
    distanceKm: 12,
    elevationGainM: 500,
    elevationLossM: 500,
    startDate: new Date("2026-03-15T09:30:00Z"),
    startTime: "09:30",
    cutoffTimeHours: 4,
    price: 10.0,
    currency: Currency.EUR,
    maxParticipants: 150,
    atrpGrade: null,
    itraPoints: null,
    description: "Mini Trail 12km · D+ 500m · Cronometragem por chip",
  });
  console.log(`✅ Variant: ${miniTrail.name}`);

  // ── Variant 2: Caminhada 7 km ──
  const caminhada = await findOrCreateVariant({
    name: "Caminhada 7km",
    distanceKm: 7,
    elevationGainM: 200,
    elevationLossM: 200,
    startDate: new Date("2026-03-15T09:35:00Z"),
    startTime: "09:35",
    cutoffTimeHours: 4,
    price: 8.0,
    currency: Currency.EUR,
    maxParticipants: 500,
    atrpGrade: null,
    itraPoints: null,
    description: "Caminhada 7km · D+ 200m · Aberta a todos",
  });
  console.log(`✅ Variant: ${caminhada.name}`);

  // ── Variant 3: Trail Kids ~1 km ──
  const trailKids = await findOrCreateVariant({
    name: "Trail Kids",
    distanceKm: 1,
    elevationGainM: 50,
    elevationLossM: 50,
    startDate: new Date("2026-03-15T11:30:00Z"),
    startTime: "11:30",
    cutoffTimeHours: null,
    price: 0,
    currency: Currency.EUR,
    maxParticipants: 50,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Trail Kids ~1km · Gratuito · Categorias: Benjamins (4-7), Infantis (8-11), Iniciados (12-14)",
  });
  console.log(`✅ Variant: ${trailKids.name}`);

  // ──────────────────────────────────────────────
  // 4. Pricing Phases (linked to eventId)
  // ──────────────────────────────────────────────

  // Mini Trail 12km
  await findOrCreatePricingPhase("Mini Trail 12km - Inscrição", {
    startDate: new Date("2026-01-21T00:00:00Z"),
    endDate: new Date("2026-03-07T23:59:59Z"),
    price: 10.0,
    currency: Currency.EUR,
    note: null,
  });

  // Mini Trail 12km - Bairros FC members
  await findOrCreatePricingPhase("Mini Trail 12km - Sócios Bairros FC", {
    startDate: new Date("2026-01-21T00:00:00Z"),
    endDate: new Date("2026-03-07T23:59:59Z"),
    price: 9.0,
    currency: Currency.EUR,
    note: "Desconto de €1 para sócios do Bairros FC (inscrição presencial)",
  });
  console.log("   - 2 pricing phases for Mini Trail 12km");

  // Caminhada 7km
  await findOrCreatePricingPhase("Caminhada 7km - Inscrição", {
    startDate: new Date("2026-01-21T00:00:00Z"),
    endDate: new Date("2026-03-07T23:59:59Z"),
    price: 8.0,
    currency: Currency.EUR,
    note: null,
  });

  // Caminhada 7km - Bairros FC members
  await findOrCreatePricingPhase("Caminhada 7km - Sócios Bairros FC", {
    startDate: new Date("2026-01-21T00:00:00Z"),
    endDate: new Date("2026-03-07T23:59:59Z"),
    price: 7.0,
    currency: Currency.EUR,
    note: "Desconto de €1 para sócios do Bairros FC (inscrição presencial)",
  });
  console.log("   - 2 pricing phases for Caminhada 7km");

  // Trail Kids - Free
  await findOrCreatePricingPhase("Trail Kids - Inscrição Gratuita", {
    startDate: new Date("2026-01-21T00:00:00Z"),
    endDate: new Date("2026-03-07T23:59:59Z"),
    price: 0,
    currency: Currency.EUR,
    note: "Inscrição gratuita mas obrigatória",
  });
  console.log("   - 1 pricing phase for Trail Kids (gratuito)");

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
    "08h00 – Abertura do secretariado · 09h10 – Aquecimento / Cerimónia de abertura · 09h30 – Partida Mini Trail · 09h35 – Partida Caminhada · 11h30 – Trail Kids · 12h30 – Cerimónia dos pódios · 13h00 – Encerramento."
  );

  const faq0Translations = {
    pt: {
      question: "Qual é o programa do evento?",
      answer:
        "08h00 – Abertura do secretariado · 09h10 – Aquecimento / Cerimónia de abertura · 09h30 – Partida Mini Trail · 09h35 – Partida Caminhada · 11h30 – Trail Kids · 12h30 – Cerimónia dos pódios · 13h00 – Encerramento.",
    },
    en: {
      question: "What is the event schedule?",
      answer:
        "8:00 AM – Registration opens · 9:10 AM – Warm-up / Opening ceremony · 9:30 AM – Mini Trail start · 9:35 AM – Walk start · 11:30 AM – Trail Kids · 12:30 PM – Awards ceremony · 1:00 PM – Event closes.",
    },
    es: {
      question: "¿Cuál es el programa del evento?",
      answer:
        "08:00 – Apertura de secretaría · 09:10 – Calentamiento / Ceremonia de apertura · 09:30 – Salida Mini Trail · 09:35 – Salida Caminata · 11:30 – Trail Kids · 12:30 – Ceremonia de premios · 13:00 – Cierre.",
    },
    fr: {
      question: "Quel est le programme de l'événement ?",
      answer:
        "08h00 – Ouverture du secrétariat · 09h10 – Échauffement / Cérémonie d'ouverture · 09h30 – Départ Mini Trail · 09h35 – Départ Marche · 11h30 – Trail Kids · 12h30 – Cérémonie des prix · 13h00 – Clôture.",
    },
    de: {
      question: "Wie ist der Programmablauf?",
      answer:
        "08:00 – Sekretariat öffnet · 09:10 – Aufwärmen / Eröffnungszeremonie · 09:30 – Start Mini Trail · 09:35 – Start Wanderung · 11:30 – Trail Kids · 12:30 – Siegerehrung · 13:00 – Ende.",
    },
    it: {
      question: "Qual è il programma dell'evento?",
      answer:
        "08:00 – Apertura segreteria · 09:10 – Riscaldamento / Cerimonia di apertura · 09:30 – Partenza Mini Trail · 09:35 – Partenza Camminata · 11:30 – Trail Kids · 12:30 – Cerimonia dei premi · 13:00 – Chiusura.",
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
    "T-shirt alusiva ao evento (garantida para inscrições até 1 de março), abastecimento intermédio (água e fruta), abastecimento final e eventuais brindes de patrocinadores. €1 de cada inscrição reverte para os Bombeiros Voluntários de Paço de Sousa."
  );

  const faq1Translations = {
    pt: {
      question: "O que está incluído na inscrição?",
      answer:
        "T-shirt alusiva ao evento (garantida para inscrições até 1 de março), abastecimento intermédio (água e fruta), abastecimento final e eventuais brindes de patrocinadores. €1 de cada inscrição reverte para os Bombeiros Voluntários de Paço de Sousa.",
    },
    en: {
      question: "What's included in the registration?",
      answer:
        "Event t-shirt (guaranteed for registrations before March 1), intermediate aid station (water and fruit), final aid station and potential sponsor gifts. €1 from each registration goes to the Paço de Sousa Volunteer Fire Brigade.",
    },
    es: {
      question: "¿Qué incluye la inscripción?",
      answer:
        "Camiseta del evento (garantizada para inscripciones hasta el 1 de marzo), avituallamiento intermedio (agua y fruta), avituallamiento final y posibles regalos de patrocinadores. 1 € de cada inscripción se destina a los Bomberos Voluntarios de Paço de Sousa.",
    },
    fr: {
      question: "Qu'est-ce qui est inclus dans l'inscription ?",
      answer:
        "T-shirt de l'événement (garanti pour les inscriptions avant le 1er mars), ravitaillement intermédiaire (eau et fruit), ravitaillement final et éventuels cadeaux de sponsors. 1 € de chaque inscription est reversé aux Pompiers Volontaires de Paço de Sousa.",
    },
    de: {
      question: "Was ist in der Anmeldung enthalten?",
      answer:
        "Event-T-Shirt (garantiert bei Anmeldung bis 1. März), Zwischenverpflegung (Wasser und Obst), Endverpflegung und mögliche Sponsorengeschenke. 1 € jeder Anmeldung geht an die Freiwillige Feuerwehr Paço de Sousa.",
    },
    it: {
      question: "Cosa è incluso nell'iscrizione?",
      answer:
        "T-shirt dell'evento (garantita per iscrizioni entro il 1° marzo), ristoro intermedio (acqua e frutta), ristoro finale ed eventuali omaggi degli sponsor. 1 € di ogni iscrizione va ai Vigili del Fuoco Volontari di Paço de Sousa.",
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

  // FAQ 2: Member discount
  const faq2 = await findOrCreateFAQ(
    event.id,
    2,
    "Existe desconto para sócios do Bairros FC?",
    "Sim! Os sócios do Bairros FC têm desconto de €1 na inscrição do Mini Trail e da Caminhada. A inscrição dos sócios deve ser realizada presencialmente junto da direção do Bairros FC."
  );

  const faq2Translations = {
    pt: {
      question: "Existe desconto para sócios do Bairros FC?",
      answer:
        "Sim! Os sócios do Bairros FC têm desconto de €1 na inscrição do Mini Trail e da Caminhada. A inscrição dos sócios deve ser realizada presencialmente junto da direção do Bairros FC.",
    },
    en: {
      question: "Is there a discount for Bairros FC members?",
      answer:
        "Yes! Bairros FC members get a €1 discount on Mini Trail and Walk registration. Member registration must be done in person at the Bairros FC management.",
    },
    es: {
      question: "¿Hay descuento para socios del Bairros FC?",
      answer:
        "¡Sí! Los socios del Bairros FC tienen un descuento de 1 € en la inscripción del Mini Trail y la Caminata. La inscripción de los socios debe realizarse presencialmente con la directiva del Bairros FC.",
    },
    fr: {
      question: "Y a-t-il une réduction pour les membres du Bairros FC ?",
      answer:
        "Oui ! Les membres du Bairros FC bénéficient d'une réduction de 1 € sur l'inscription au Mini Trail et à la Marche. L'inscription des membres doit se faire en personne auprès de la direction du Bairros FC.",
    },
    de: {
      question: "Gibt es einen Rabatt für Bairros FC-Mitglieder?",
      answer:
        "Ja! Bairros FC-Mitglieder erhalten 1 € Rabatt auf die Anmeldung zum Mini Trail und zur Wanderung. Die Mitgliederanmeldung muss persönlich bei der Vereinsleitung des Bairros FC erfolgen.",
    },
    it: {
      question: "C'è uno sconto per i soci del Bairros FC?",
      answer:
        "Sì! I soci del Bairros FC hanno uno sconto di 1 € sull'iscrizione al Mini Trail e alla Camminata. L'iscrizione dei soci deve essere effettuata di persona presso la direzione del Bairros FC.",
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
  console.log("✅ FAQ 2: Member discount");

  // FAQ 3: Trail Kids
  const faq3 = await findOrCreateFAQ(
    event.id,
    3,
    "Como funciona o Trail Kids?",
    "O Trail Kids realiza-se às 11h30 no dia do evento. É gratuito mas com inscrição obrigatória (máximo 50 participantes). Destinado a crianças dos 4 aos 13 anos, dividido em 3 categorias: Benjamins (4-7 anos), Infantis (8-11 anos) e Iniciados (12-14 anos). Menores de 18 anos precisam de autorização parental."
  );

  const faq3Translations = {
    pt: {
      question: "Como funciona o Trail Kids?",
      answer:
        "O Trail Kids realiza-se às 11h30 no dia do evento. É gratuito mas com inscrição obrigatória (máximo 50 participantes). Destinado a crianças dos 4 aos 13 anos, dividido em 3 categorias: Benjamins (4-7 anos), Infantis (8-11 anos) e Iniciados (12-14 anos). Menores de 18 anos precisam de autorização parental.",
    },
    en: {
      question: "How does Trail Kids work?",
      answer:
        "Trail Kids takes place at 11:30 AM on event day. It's free but registration is mandatory (maximum 50 participants). Open to children aged 4-13, divided into 3 categories: Benjamins (4-7 years), Infantis (8-11 years) and Iniciados (12-14 years). Under-18s need parental authorization.",
    },
    es: {
      question: "¿Cómo funciona el Trail Kids?",
      answer:
        "El Trail Kids se celebra a las 11:30 el día del evento. Es gratuito pero con inscripción obligatoria (máximo 50 participantes). Destinado a niños de 4 a 13 años, dividido en 3 categorías: Benjamins (4-7 años), Infantis (8-11 años) e Iniciados (12-14 años). Los menores de 18 años necesitan autorización parental.",
    },
    fr: {
      question: "Comment fonctionne le Trail Kids ?",
      answer:
        "Le Trail Kids a lieu à 11h30 le jour de l'événement. Il est gratuit mais l'inscription est obligatoire (maximum 50 participants). Destiné aux enfants de 4 à 13 ans, divisé en 3 catégories : Benjamins (4-7 ans), Infantis (8-11 ans) et Iniciados (12-14 ans). Les moins de 18 ans doivent avoir une autorisation parentale.",
    },
    de: {
      question: "Wie funktioniert Trail Kids?",
      answer:
        "Trail Kids findet um 11:30 Uhr am Veranstaltungstag statt. Es ist kostenlos, aber eine Anmeldung ist Pflicht (maximal 50 Teilnehmer). Für Kinder von 4-13 Jahren, aufgeteilt in 3 Kategorien: Benjamins (4-7 Jahre), Infantis (8-11 Jahre) und Iniciados (12-14 Jahre). Unter 18-Jährige brauchen eine elterliche Genehmigung.",
    },
    it: {
      question: "Come funziona il Trail Kids?",
      answer:
        "Il Trail Kids si svolge alle 11:30 il giorno dell'evento. È gratuito ma l'iscrizione è obbligatoria (massimo 50 partecipanti). Destinato ai bambini dai 4 ai 13 anni, diviso in 3 categorie: Benjamins (4-7 anni), Infantis (8-11 anni) e Iniciados (12-14 anni). I minori di 18 anni necessitano di autorizzazione dei genitori.",
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
  console.log("✅ FAQ 3: Trail Kids");

  // FAQ 4: Registration and refund policy
  const faq4 = await findOrCreateFAQ(
    event.id,
    4,
    "Como funcionam as inscrições e devoluções?",
    "Inscrições online em events.portimer.pt ou presencialmente nos Bombeiros Voluntários de Paço de Sousa ou Minimercado São João (Bairros). Pagamento em 48 horas ou a inscrição é anulada. Não há devolução em caso de desistência, apenas transferência para outro atleta até 15 dias antes do evento."
  );

  const faq4Translations = {
    pt: {
      question: "Como funcionam as inscrições e devoluções?",
      answer:
        "Inscrições online em events.portimer.pt ou presencialmente nos Bombeiros Voluntários de Paço de Sousa ou Minimercado São João (Bairros). Pagamento em 48 horas ou a inscrição é anulada. Não há devolução em caso de desistência, apenas transferência para outro atleta até 15 dias antes do evento.",
    },
    en: {
      question: "How do registrations and refunds work?",
      answer:
        "Online registration at events.portimer.pt or in person at the Paço de Sousa Volunteer Fire Brigade or Minimercado São João (Bairros). Payment within 48 hours or registration is cancelled. No refunds for withdrawals, only transfer to another athlete up to 15 days before the event.",
    },
    es: {
      question: "¿Cómo funcionan las inscripciones y devoluciones?",
      answer:
        "Inscripciones online en events.portimer.pt o presencialmente en los Bomberos Voluntarios de Paço de Sousa o Minimercado São João (Bairros). Pago en 48 horas o la inscripción se cancela. No hay devolución por desistimiento, solo transferencia a otro atleta hasta 15 días antes del evento.",
    },
    fr: {
      question: "Comment fonctionnent les inscriptions et remboursements ?",
      answer:
        "Inscriptions en ligne sur events.portimer.pt ou en personne aux Pompiers Volontaires de Paço de Sousa ou Minimercado São João (Bairros). Paiement sous 48 heures ou l'inscription est annulée. Pas de remboursement en cas de désistement, uniquement transfert à un autre athlète jusqu'à 15 jours avant l'événement.",
    },
    de: {
      question: "Wie funktionieren Anmeldung und Erstattung?",
      answer:
        "Online-Anmeldung auf events.portimer.pt oder persönlich bei der Freiwilligen Feuerwehr Paço de Sousa oder Minimercado São João (Bairros). Zahlung innerhalb von 48 Stunden, sonst wird die Anmeldung storniert. Keine Erstattung bei Rücktritt, nur Übertragung auf einen anderen Athleten bis 15 Tage vor der Veranstaltung.",
    },
    it: {
      question: "Come funzionano iscrizioni e rimborsi?",
      answer:
        "Iscrizioni online su events.portimer.pt o di persona presso i Vigili del Fuoco Volontari di Paço de Sousa o Minimercado São João (Bairros). Pagamento entro 48 ore o l'iscrizione viene annullata. Nessun rimborso in caso di rinuncia, solo trasferimento a un altro atleta fino a 15 giorni prima dell'evento.",
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
  console.log("✅ FAQ 4: Registration and refunds");

  // FAQ 5: Categories and prizes
  const faq5 = await findOrCreateFAQ(
    event.id,
    5,
    "Quais são as categorias e prémios?",
    "Mini Trail – Masculinos: Seniores (18-39), M40 (40-49), M50 (50+) · Femininos: Seniores (18-39), F40 (40-49), F50 (50+). Trail Kids: Benjamins (4-7), Infantis (8-11), Iniciados (12-14). Os 3 primeiros de cada escalão recebem prémio."
  );

  const faq5Translations = {
    pt: {
      question: "Quais são as categorias e prémios?",
      answer:
        "Mini Trail – Masculinos: Seniores (18-39), M40 (40-49), M50 (50+) · Femininos: Seniores (18-39), F40 (40-49), F50 (50+). Trail Kids: Benjamins (4-7), Infantis (8-11), Iniciados (12-14). Os 3 primeiros de cada escalão recebem prémio.",
    },
    en: {
      question: "What are the categories and prizes?",
      answer:
        "Mini Trail – Male: Seniors (18-39), M40 (40-49), M50 (50+) · Female: Seniors (18-39), F40 (40-49), F50 (50+). Trail Kids: Benjamins (4-7), Infantis (8-11), Iniciados (12-14). Top 3 in each category receive prizes.",
    },
    es: {
      question: "¿Cuáles son las categorías y premios?",
      answer:
        "Mini Trail – Masculinos: Seniores (18-39), M40 (40-49), M50 (50+) · Femeninos: Seniores (18-39), F40 (40-49), F50 (50+). Trail Kids: Benjamins (4-7), Infantis (8-11), Iniciados (12-14). Los 3 primeros de cada categoría reciben premio.",
    },
    fr: {
      question: "Quelles sont les catégories et les prix ?",
      answer:
        "Mini Trail – Hommes : Seniors (18-39), M40 (40-49), M50 (50+) · Femmes : Seniors (18-39), F40 (40-49), F50 (50+). Trail Kids : Benjamins (4-7), Infantis (8-11), Iniciados (12-14). Les 3 premiers de chaque catégorie reçoivent un prix.",
    },
    de: {
      question: "Welche Kategorien und Preise gibt es?",
      answer:
        "Mini Trail – Männer: Senioren (18-39), M40 (40-49), M50 (50+) · Frauen: Senioren (18-39), F40 (40-49), F50 (50+). Trail Kids: Benjamins (4-7), Infantis (8-11), Iniciados (12-14). Die Top 3 jeder Kategorie erhalten Preise.",
    },
    it: {
      question: "Quali sono le categorie e i premi?",
      answer:
        "Mini Trail – Maschile: Seniores (18-39), M40 (40-49), M50 (50+) · Femminile: Seniores (18-39), F40 (40-49), F50 (50+). Trail Kids: Benjamins (4-7), Infantis (8-11), Iniciados (12-14). I primi 3 di ogni categoria ricevono un premio.",
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
  console.log("✅ FAQ 5: Categories and prizes");

  // ──────────────────────────────────────────────
  // Summary
  // ──────────────────────────────────────────────
  console.log(`
✅ Seed completed successfully!

📊 Summary:
- Event: III Caminhada / Mini Trail Solidário Bairros FC 2026
- Slug: caminhada-mini-trail-bairros-fc-2026
- Variants: 3 (Mini Trail 12km, Caminhada 7km, Trail Kids)
- Languages: 6 (pt, en, es, fr, de, it)
- Pricing Phases: 5 total (2 × Mini Trail + 2 × Caminhada + 1 × Trail Kids)
- FAQs: 6 (with translations in all 6 languages)
- Date: March 15, 2026
- Location: Bairros, Paço de Sousa, Penafiel, Portugal
- Coordinates: 41.156143, -8.350444
- Organization: Bairros FC
- Solidarity: €1 per registration → Bombeiros Voluntários de Paço de Sousa
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
