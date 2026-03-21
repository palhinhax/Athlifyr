/**
 * Seed: Sunset Srª dos Chãos Trail 2026 – 3ª Edição
 *
 * Event: Trail running event in Valongo
 * Location: Capela da Srª dos Chãos, Valongo
 * Date: May 2, 2026
 * Organizer: TOG – Associação Running Team
 * Sport: Trail
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏔️ Seeding Sunset Srª dos Chãos Trail 2026 – 3ª Edição...");

  // ──────────────────────────────────────────────
  // 1. Upsert Event (no nested creates)
  // ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: "sunset-sra-dos-chaos-trail-2026" },
    update: {
      title: "Sunset Srª dos Chãos Trail 2026 – 3ª Edição",
      description:
        "Sunset Srª dos Chãos Trail 2026 – 3ª Edição - Trail running em Valongo",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-05-02T16:00:00Z"),
      endDate: new Date("2026-05-02T23:00:00Z"),
      registrationDeadline: new Date("2026-04-26T23:59:59Z"),
      externalUrl: "https://www.portimer.pt",
      imageUrl: "",
      city: "Valongo",
      country: "Portugal",
      latitude: 41.187374,
      longitude: -8.513307,
      googleMapsUrl: "",
      isFeatured: false,
      cancelled: false,
    },
    create: {
      title: "Sunset Srª dos Chãos Trail 2026 – 3ª Edição",
      slug: "sunset-sra-dos-chaos-trail-2026",
      description:
        "Sunset Srª dos Chãos Trail 2026 – 3ª Edição - Trail running em Valongo",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-05-02T16:00:00Z"),
      endDate: new Date("2026-05-02T23:00:00Z"),
      registrationDeadline: new Date("2026-04-26T23:59:59Z"),
      externalUrl: "https://www.portimer.pt",
      imageUrl: "",
      city: "Valongo",
      country: "Portugal",
      latitude: 41.187374,
      longitude: -8.513307,
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
      title: "Sunset Srª dos Chãos Trail 2026 – 3ª Edição",
      description: `# 🏔️ Sunset Srª dos Chãos Trail 2026 – 3ª Edição

**O Sunset Srª dos Chãos Trail regressa a Valongo no dia 2 de maio de 2026, para a sua 3ª edição!** Organizado pela TOG – Associação Running Team, com partida e chegada na envolvente da Capela da Srª dos Chãos. Percursos por trilhos e caminhos nas Serras de Valongo. Tempo limite de 6 horas.

---

## 🏃 Provas

- **Trail Longo** – ~23 km · Partida 16h00
- **Trail** – ~13 km · Partida 16h30
- **Mini-Trail** – ~10 km · Partida 16h45
- **Caminhada** – ~10 km · Partida 16h45 · Não competitiva

---

🏔️ **Vem viver o pôr do sol nas Serras de Valongo!** 🌅`,
      city: "Valongo",
      metaTitle:
        "Sunset Srª dos Chãos Trail 2026 – 3ª Edição | Valongo | 2 Maio",
      metaDescription:
        "Sunset Srª dos Chãos Trail 2026 – 3ª edição a 2 de maio em Valongo. Trail Longo 23 km, Trail 13 km, Mini-Trail 10 km e Caminhada 10 km. Organização TOG. 900 vagas.",
    },
    en: {
      title: "Sunset Srª dos Chãos Trail 2026 – 3rd Edition",
      description: `# 🏔️ Sunset Srª dos Chãos Trail 2026 – 3rd Edition

**The Sunset Srª dos Chãos Trail returns to Valongo on May 2, 2026, for its 3rd edition!** Organized by TOG – Associação Running Team, starting and finishing at the Chapel of Srª dos Chãos. Routes through trails and paths in the Valongo Mountains. 6-hour time limit.

---

## 🏃 Races

- **Trail Longo** – ~23 km · Start 4:00 PM
- **Trail** – ~13 km · Start 4:30 PM
- **Mini-Trail** – ~10 km · Start 4:45 PM
- **Walk** – ~10 km · Start 4:45 PM · Non-competitive

---

🏔️ **Come experience the sunset in the Valongo Mountains!** 🌅`,
      city: "Valongo",
      metaTitle:
        "Sunset Srª dos Chãos Trail 2026 – 3rd Edition | Valongo | May 2",
      metaDescription:
        "Sunset Srª dos Chãos Trail 2026 – 3rd edition on May 2 in Valongo. Trail Longo 23 km, Trail 13 km, Mini-Trail 10 km and Walk 10 km. Organized by TOG. 900 spots.",
    },
    es: {
      title: "Sunset Srª dos Chãos Trail 2026 – 3ª Edición",
      description: `# 🏔️ Sunset Srª dos Chãos Trail 2026 – 3ª Edición

**El Sunset Srª dos Chãos Trail regresa a Valongo el 2 de mayo de 2026, ¡en su 3ª edición!** Organizado por TOG – Associação Running Team, con salida y meta en los alrededores de la Capilla de Srª dos Chãos. Recorridos por senderos y caminos en las Sierras de Valongo. Tiempo límite de 6 horas.

---

## 🏃 Pruebas

- **Trail Longo** – ~23 km · Salida 16:00
- **Trail** – ~13 km · Salida 16:30
- **Mini-Trail** – ~10 km · Salida 16:45
- **Caminata** – ~10 km · Salida 16:45 · No competitiva

---

🏔️ **¡Ven a vivir el atardecer en las Sierras de Valongo!** 🌅`,
      city: "Valongo",
      metaTitle:
        "Sunset Srª dos Chãos Trail 2026 – 3ª Edición | Valongo | 2 Mayo",
      metaDescription:
        "Sunset Srª dos Chãos Trail 2026 – 3ª edición el 2 de mayo en Valongo. Trail Longo 23 km, Trail 13 km, Mini-Trail 10 km y Caminata 10 km. Organización TOG. 900 plazas.",
    },
    fr: {
      title: "Sunset Srª dos Chãos Trail 2026 – 3e Édition",
      description: `# 🏔️ Sunset Srª dos Chãos Trail 2026 – 3e Édition

**Le Sunset Srª dos Chãos Trail revient à Valongo le 2 mai 2026, pour sa 3e édition !** Organisé par TOG – Associação Running Team, départ et arrivée aux abords de la Chapelle de Srª dos Chãos. Parcours sur sentiers et chemins dans les Montagnes de Valongo. Temps limite de 6 heures.

---

## 🏃 Épreuves

- **Trail Longo** – ~23 km · Départ 16h00
- **Trail** – ~13 km · Départ 16h30
- **Mini-Trail** – ~10 km · Départ 16h45
- **Randonnée** – ~10 km · Départ 16h45 · Non compétitive

---

🏔️ **Venez vivre le coucher de soleil dans les Montagnes de Valongo !** 🌅`,
      city: "Valongo",
      metaTitle:
        "Sunset Srª dos Chãos Trail 2026 – 3e Édition | Valongo | 2 Mai",
      metaDescription:
        "Sunset Srª dos Chãos Trail 2026 – 3e édition le 2 mai à Valongo. Trail Longo 23 km, Trail 13 km, Mini-Trail 10 km et Randonnée 10 km. Organisation TOG. 900 places.",
    },
    de: {
      title: "Sunset Srª dos Chãos Trail 2026 – 3. Ausgabe",
      description: `# 🏔️ Sunset Srª dos Chãos Trail 2026 – 3. Ausgabe

**Der Sunset Srª dos Chãos Trail kehrt am 2. Mai 2026 nach Valongo zurück – zur 3. Ausgabe!** Organisiert von TOG – Associação Running Team, Start und Ziel bei der Kapelle Srª dos Chãos. Strecken über Pfade und Wege in den Bergen von Valongo. Zeitlimit: 6 Stunden.

---

## 🏃 Rennen

- **Trail Longo** – ~23 km · Start 16:00
- **Trail** – ~13 km · Start 16:30
- **Mini-Trail** – ~10 km · Start 16:45
- **Wanderung** – ~10 km · Start 16:45 · Nicht wettbewerblich

---

🏔️ **Erlebe den Sonnenuntergang in den Bergen von Valongo!** 🌅`,
      city: "Valongo",
      metaTitle:
        "Sunset Srª dos Chãos Trail 2026 – 3. Ausgabe | Valongo | 2. Mai",
      metaDescription:
        "Sunset Srª dos Chãos Trail 2026 – 3. Ausgabe am 2. Mai in Valongo. Trail Longo 23 km, Trail 13 km, Mini-Trail 10 km und Wanderung 10 km. Organisation TOG. 900 Plätze.",
    },
    it: {
      title: "Sunset Srª dos Chãos Trail 2026 – 3ª Edizione",
      description: `# 🏔️ Sunset Srª dos Chãos Trail 2026 – 3ª Edizione

**Il Sunset Srª dos Chãos Trail torna a Valongo il 2 maggio 2026, per la sua 3ª edizione!** Organizzato da TOG – Associação Running Team, partenza e arrivo nei pressi della Cappella di Srª dos Chãos. Percorsi su sentieri e cammini nelle Montagne di Valongo. Tempo limite di 6 ore.

---

## 🏃 Gare

- **Trail Longo** – ~23 km · Partenza 16:00
- **Trail** – ~13 km · Partenza 16:30
- **Mini-Trail** – ~10 km · Partenza 16:45
- **Camminata** – ~10 km · Partenza 16:45 · Non competitiva

---

🏔️ **Vieni a vivere il tramonto nelle Montagne di Valongo!** 🌅`,
      city: "Valongo",
      metaTitle:
        "Sunset Srª dos Chãos Trail 2026 – 3ª Edizione | Valongo | 2 Maggio",
      metaDescription:
        "Sunset Srª dos Chãos Trail 2026 – 3ª edizione il 2 maggio a Valongo. Trail Longo 23 km, Trail 13 km, Mini-Trail 10 km e Camminata 10 km. Organizzazione TOG. 900 posti.",
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

  // ── Variant: Trail Longo (~23 km) ──
  const trailLongo = await findOrCreateVariant({
    name: "Trail Longo",
    distanceKm: 23,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-05-02T16:00:00Z"),
    startTime: "16:00",
    cutoffTimeHours: 6,
    price: 14,
    currency: Currency.EUR,
    maxParticipants: 250,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Trail Longo · ~23 km · Partida 16h00 · Tempo limite 6h · Idade mínima 16 anos",
  });
  console.log(`✅ Variant: ${trailLongo.name}`);

  // ── Variant: Trail (~13 km) ──
  const trail = await findOrCreateVariant({
    name: "Trail",
    distanceKm: 13,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-05-02T16:30:00Z"),
    startTime: "16:30",
    cutoffTimeHours: 6,
    price: 10,
    currency: Currency.EUR,
    maxParticipants: 350,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Trail · ~13 km · Partida 16h30 · Tempo limite 6h · Idade mínima 16 anos",
  });
  console.log(`✅ Variant: ${trail.name}`);

  // ── Variant: Mini-Trail (~10 km) ──
  const miniTrail = await findOrCreateVariant({
    name: "Mini-Trail",
    distanceKm: 10,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-05-02T16:45:00Z"),
    startTime: "16:45",
    cutoffTimeHours: 6,
    price: 8,
    currency: Currency.EUR,
    maxParticipants: 150,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Mini-Trail · ~10 km · Partida 16h45 · Tempo limite 6h · Idade mínima 16 anos",
  });
  console.log(`✅ Variant: ${miniTrail.name}`);

  // ── Variant: Caminhada (~10 km) ──
  const caminhada = await findOrCreateVariant({
    name: "Caminhada",
    distanceKm: 10,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-05-02T16:45:00Z"),
    startTime: "16:45",
    cutoffTimeHours: null,
    price: 7,
    currency: Currency.EUR,
    maxParticipants: 150,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Caminhada · ~10 km · Partida 16h45 · Não competitiva · Aberta a menores acompanhados",
  });
  console.log(`✅ Variant: ${caminhada.name}`);

  // ──────────────────────────────────────────────
  // 4. Pricing Phases
  // ──────────────────────────────────────────────
  const variantPhases = [
    { name: "Trail Longo", p1: 14, p2: 17 },
    { name: "Trail", p1: 10, p2: 12 },
    { name: "Mini-Trail", p1: 8, p2: 10 },
    { name: "Caminhada", p1: 7, p2: 9 },
  ];

  for (const v of variantPhases) {
    // Phase 1: Jan 10 – Apr 5
    await findOrCreatePricingPhase(`${v.name} - 1ª Fase`, {
      startDate: new Date("2026-01-10T00:00:00Z"),
      endDate: new Date("2026-04-05T23:59:59Z"),
      price: v.p1,
      currency: Currency.EUR,
      note: "Inclui dorsal, seguro de acidentes pessoais e abastecimento",
    });

    // Phase 2: Apr 6 – Apr 26
    await findOrCreatePricingPhase(`${v.name} - 2ª Fase`, {
      startDate: new Date("2026-04-06T00:00:00Z"),
      endDate: new Date("2026-04-26T23:59:59Z"),
      price: v.p2,
      currency: Currency.EUR,
      note: "Inclui dorsal, seguro de acidentes pessoais e abastecimento",
    });

    console.log(`   - 2 pricing phases for ${v.name}`);
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
    "Qual é o programa e horário do evento?",
    "Dia 1 de maio: secretariado aberto das 18h às 23h. Dia 2 de maio: secretariado das 10h às 15h45. Partida Trail Longo às 16h00, Trail às 16h30, Mini-Trail e Caminhada às 16h45. Chegada prevista dos primeiros classificados às 18h20. Sunset e momento de contemplação às 20h/21h. Entrega de prémios às 20h30. Encerramento às 23h."
  );

  const faq0Translations = {
    pt: {
      question: "Qual é o programa e horário do evento?",
      answer:
        "Dia 1 de maio: secretariado aberto das 18h às 23h. Dia 2 de maio: secretariado das 10h às 15h45. Partida Trail Longo às 16h00, Trail às 16h30, Mini-Trail e Caminhada às 16h45. Chegada prevista dos primeiros classificados às 18h20. Sunset e momento de contemplação às 20h/21h. Entrega de prémios às 20h30. Encerramento às 23h.",
    },
    en: {
      question: "What is the event schedule?",
      answer:
        "May 1: registration desk open 6:00 PM – 11:00 PM. May 2: registration desk 10:00 AM – 3:45 PM. Trail Longo start at 4:00 PM, Trail at 4:30 PM, Mini-Trail and Walk at 4:45 PM. Expected arrival of first finishers at 6:20 PM. Sunset contemplation at 8:00/9:00 PM. Prize ceremony at 8:30 PM. Closure at 11:00 PM.",
    },
    es: {
      question: "¿Cuál es el programa y horario del evento?",
      answer:
        "1 de mayo: secretaría abierta de 18:00 a 23:00. 2 de mayo: secretaría de 10:00 a 15:45. Salida Trail Longo a las 16:00, Trail a las 16:30, Mini-Trail y Caminata a las 16:45. Llegada prevista de los primeros clasificados a las 18:20. Sunset y momento de contemplación a las 20:00/21:00. Entrega de premios a las 20:30. Cierre a las 23:00.",
    },
    fr: {
      question: "Quel est le programme et l'horaire de l'événement ?",
      answer:
        "1er mai : secrétariat ouvert de 18h à 23h. 2 mai : secrétariat de 10h à 15h45. Départ Trail Longo à 16h00, Trail à 16h30, Mini-Trail et Randonnée à 16h45. Arrivée prévue des premiers classés à 18h20. Coucher de soleil et moment de contemplation à 20h/21h. Remise des prix à 20h30. Clôture à 23h.",
    },
    de: {
      question: "Wie ist das Programm und der Zeitplan des Events?",
      answer:
        "1. Mai: Sekretariat geöffnet von 18:00 bis 23:00. 2. Mai: Sekretariat von 10:00 bis 15:45. Start Trail Longo um 16:00, Trail um 16:30, Mini-Trail und Wanderung um 16:45. Voraussichtliche Ankunft der Erstplatzierten um 18:20. Sonnenuntergang und Kontemplation um 20:00/21:00. Preisverleihung um 20:30. Veranstaltungsende um 23:00.",
    },
    it: {
      question: "Qual è il programma e l'orario dell'evento?",
      answer:
        "1 maggio: segreteria aperta dalle 18:00 alle 23:00. 2 maggio: segreteria dalle 10:00 alle 15:45. Partenza Trail Longo alle 16:00, Trail alle 16:30, Mini-Trail e Camminata alle 16:45. Arrivo previsto dei primi classificati alle 18:20. Tramonto e momento di contemplazione alle 20:00/21:00. Premiazione alle 20:30. Chiusura alle 23:00.",
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
    "Como me inscrevo e quais os preços?",
    "Inscrições em www.portimer.pt. Pagamento em 48h ou a inscrição é anulada. 1ª fase (10 jan – 5 abr): Mini-Trail €8, Trail €10, Trail Longo €14, Caminhada €7. 2ª fase (6 – 26 abr): Mini-Trail €10, Trail €12, Trail Longo €17, Caminhada €9. Inscrições de última hora (se disponíveis): +€2,50. Total: 900 vagas (250 Trail Longo, 350 Trail, 150 Mini-Trail, 150 Caminhada)."
  );

  const faq1Translations = {
    pt: {
      question: "Como me inscrevo e quais os preços?",
      answer:
        "Inscrições em www.portimer.pt. Pagamento em 48h ou a inscrição é anulada. 1ª fase (10 jan – 5 abr): Mini-Trail €8, Trail €10, Trail Longo €14, Caminhada €7. 2ª fase (6 – 26 abr): Mini-Trail €10, Trail €12, Trail Longo €17, Caminhada €9. Inscrições de última hora (se disponíveis): +€2,50. Total: 900 vagas (250 Trail Longo, 350 Trail, 150 Mini-Trail, 150 Caminhada).",
    },
    en: {
      question: "How do I register and what are the prices?",
      answer:
        "Registration at www.portimer.pt. Payment within 48h or the registration is cancelled. Phase 1 (Jan 10 – Apr 5): Mini-Trail €8, Trail €10, Trail Longo €14, Walk €7. Phase 2 (Apr 6 – 26): Mini-Trail €10, Trail €12, Trail Longo €17, Walk €9. Last-minute entries (if available): +€2.50. Total: 900 spots (250 Trail Longo, 350 Trail, 150 Mini-Trail, 150 Walk).",
    },
    es: {
      question: "¿Cómo me inscribo y cuáles son los precios?",
      answer:
        "Inscripciones en www.portimer.pt. Pago en 48h o la inscripción se anula. 1ª fase (10 ene – 5 abr): Mini-Trail 8 €, Trail 10 €, Trail Longo 14 €, Caminata 7 €. 2ª fase (6 – 26 abr): Mini-Trail 10 €, Trail 12 €, Trail Longo 17 €, Caminata 9 €. Inscripciones de última hora (si disponibles): +2,50 €. Total: 900 plazas (250 Trail Longo, 350 Trail, 150 Mini-Trail, 150 Caminata).",
    },
    fr: {
      question: "Comment m'inscrire et quels sont les prix ?",
      answer:
        "Inscriptions sur www.portimer.pt. Paiement sous 48h ou l'inscription est annulée. 1ère phase (10 jan – 5 avr) : Mini-Trail 8 €, Trail 10 €, Trail Longo 14 €, Randonnée 7 €. 2e phase (6 – 26 avr) : Mini-Trail 10 €, Trail 12 €, Trail Longo 17 €, Randonnée 9 €. Inscriptions de dernière minute (si disponibles) : +2,50 €. Total : 900 places (250 Trail Longo, 350 Trail, 150 Mini-Trail, 150 Randonnée).",
    },
    de: {
      question: "Wie melde ich mich an und was sind die Preise?",
      answer:
        "Anmeldung über www.portimer.pt. Zahlung innerhalb von 48h, sonst wird die Anmeldung storniert. 1. Phase (10. Jan – 5. Apr): Mini-Trail 8 €, Trail 10 €, Trail Longo 14 €, Wanderung 7 €. 2. Phase (6. – 26. Apr): Mini-Trail 10 €, Trail 12 €, Trail Longo 17 €, Wanderung 9 €. Last-Minute-Anmeldung (falls verfügbar): +2,50 €. Gesamt: 900 Plätze (250 Trail Longo, 350 Trail, 150 Mini-Trail, 150 Wanderung).",
    },
    it: {
      question: "Come mi iscrivo e quali sono i prezzi?",
      answer:
        "Iscrizioni su www.portimer.pt. Pagamento entro 48h o l'iscrizione viene annullata. 1ª fase (10 gen – 5 apr): Mini-Trail 8 €, Trail 10 €, Trail Longo 14 €, Camminata 7 €. 2ª fase (6 – 26 apr): Mini-Trail 10 €, Trail 12 €, Trail Longo 17 €, Camminata 9 €. Iscrizioni last-minute (se disponibili): +2,50 €. Totale: 900 posti (250 Trail Longo, 350 Trail, 150 Mini-Trail, 150 Camminata).",
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

  // FAQ 2: Mandatory equipment
  const faq2 = await findOrCreateFAQ(
    event.id,
    2,
    "Qual é o material obrigatório?",
    "Trail e Caminhada: telemóvel operacional, apito, manta térmica, depósito de água e lanterna. A organização não fornece copos nos abastecimentos — cada participante deve trazer o seu. Recomenda-se corta-vento e chapéu/gorro. Falta de material obrigatório resulta em desclassificação."
  );

  const faq2Translations = {
    pt: {
      question: "Qual é o material obrigatório?",
      answer:
        "Trail e Caminhada: telemóvel operacional, apito, manta térmica, depósito de água e lanterna. A organização não fornece copos nos abastecimentos — cada participante deve trazer o seu. Recomenda-se corta-vento e chapéu/gorro. Falta de material obrigatório resulta em desclassificação.",
    },
    en: {
      question: "What mandatory equipment is required?",
      answer:
        "Trail and Walk: operational mobile phone, whistle, thermal blanket, water container and headlamp. The organization does not provide cups at aid stations — each participant must bring their own. Windbreaker and hat are recommended. Missing mandatory equipment results in disqualification.",
    },
    es: {
      question: "¿Cuál es el material obligatorio?",
      answer:
        "Trail y Caminata: teléfono móvil operativo, silbato, manta térmica, depósito de agua y linterna. La organización no proporciona vasos en los avituallamientos — cada participante debe traer el suyo. Se recomienda cortavientos y gorro. La falta de material obligatorio resulta en descalificación.",
    },
    fr: {
      question: "Quel est le matériel obligatoire ?",
      answer:
        "Trail et Randonnée : téléphone portable opérationnel, sifflet, couverture de survie, réserve d'eau et lampe frontale. L'organisation ne fournit pas de gobelets aux ravitaillements — chaque participant doit apporter le sien. Coupe-vent et chapeau recommandés. L'absence de matériel obligatoire entraîne la disqualification.",
    },
    de: {
      question: "Welche Pflichtausrüstung ist erforderlich?",
      answer:
        "Trail und Wanderung: funktionsfähiges Mobiltelefon, Pfeife, Rettungsdecke, Wasserbehälter und Stirnlampe. Die Organisation stellt keine Becher an den Verpflegungspunkten — jeder Teilnehmer muss seinen eigenen mitbringen. Windjacke und Mütze empfohlen. Fehlende Pflichtausrüstung führt zur Disqualifikation.",
    },
    it: {
      question: "Qual è l'equipaggiamento obbligatorio?",
      answer:
        "Trail e Camminata: telefono cellulare operativo, fischietto, coperta termica, contenitore d'acqua e torcia frontale. L'organizzazione non fornisce bicchieri ai ristori — ogni partecipante deve portare il proprio. Si raccomanda giacca antivento e cappello. La mancanza di equipaggiamento obbligatorio comporta la squalifica.",
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
  console.log("✅ FAQ 2: Mandatory equipment");

  // FAQ 3: Categories and prizes
  const faq3 = await findOrCreateFAQ(
    event.id,
    3,
    "Quais são as categorias e prémios?",
    "Categorias (Trail): Sub-23 (16-22 anos), Seniores (23-39), M40 (40-44), M45 (45-49), M50 (50-54), M55 (55-59), M60+ — masculino e feminino. Os 3 primeiros de cada escalão recebem troféu. Prémio por equipas: conjunto dos 3 primeiros elementos (M ou F). Prémio para a equipa mais numerosa no conjunto das provas (Trail e Caminhada). A Caminhada é não competitiva."
  );

  const faq3Translations = {
    pt: {
      question: "Quais são as categorias e prémios?",
      answer:
        "Categorias (Trail): Sub-23 (16-22 anos), Seniores (23-39), M40 (40-44), M45 (45-49), M50 (50-54), M55 (55-59), M60+ — masculino e feminino. Os 3 primeiros de cada escalão recebem troféu. Prémio por equipas: conjunto dos 3 primeiros elementos (M ou F). Prémio para a equipa mais numerosa no conjunto das provas (Trail e Caminhada). A Caminhada é não competitiva.",
    },
    en: {
      question: "What are the categories and prizes?",
      answer:
        "Categories (Trail): Sub-23 (16-22 years), Seniors (23-39), M40 (40-44), M45 (45-49), M50 (50-54), M55 (55-59), M60+ — male and female. Top 3 in each category receive a trophy. Team prize: top 3 members from same team (M or F). Prize for the largest team across all races (Trail and Walk). The Walk is non-competitive.",
    },
    es: {
      question: "¿Cuáles son las categorías y premios?",
      answer:
        "Categorías (Trail): Sub-23 (16-22 años), Seniores (23-39), M40 (40-44), M45 (45-49), M50 (50-54), M55 (55-59), M60+ — masculino y femenino. Los 3 primeros de cada categoría reciben trofeo. Premio por equipos: conjunto de los 3 primeros elementos (M o F). Premio para el equipo más numeroso en las pruebas (Trail y Caminata). La Caminata es no competitiva.",
    },
    fr: {
      question: "Quelles sont les catégories et les prix ?",
      answer:
        "Catégories (Trail) : Sub-23 (16-22 ans), Seniors (23-39), M40 (40-44), M45 (45-49), M50 (50-54), M55 (55-59), M60+ — hommes et femmes. Les 3 premiers de chaque catégorie reçoivent un trophée. Prix par équipe : ensemble des 3 premiers éléments (M ou F). Prix pour l'équipe la plus nombreuse dans les épreuves (Trail et Randonnée). La Randonnée est non compétitive.",
    },
    de: {
      question: "Welche Kategorien und Preise gibt es?",
      answer:
        "Kategorien (Trail): Sub-23 (16-22 Jahre), Senioren (23-39), M40 (40-44), M45 (45-49), M50 (50-54), M55 (55-59), M60+ — Männer und Frauen. Die Top 3 jeder Kategorie erhalten einen Pokal. Mannschaftspreis: die 3 besten Mitglieder eines Teams (M oder W). Preis für das größte Team über alle Rennen (Trail und Wanderung). Die Wanderung ist nicht wettbewerblich.",
    },
    it: {
      question: "Quali sono le categorie e i premi?",
      answer:
        "Categorie (Trail): Sub-23 (16-22 anni), Seniores (23-39), M40 (40-44), M45 (45-49), M50 (50-54), M55 (55-59), M60+ — maschile e femminile. I primi 3 di ogni categoria ricevono un trofeo. Premio a squadre: insieme dei 3 primi elementi (M o F). Premio per la squadra più numerosa nelle gare (Trail e Camminata). La Camminata è non competitiva.",
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
  console.log("✅ FAQ 3: Categories and prizes");

  // FAQ 4: Rules and penalties
  const faq4 = await findOrCreateFAQ(
    event.id,
    4,
    "Quais são as principais regras e penalizações?",
    "Dorsal obrigatório, visível à frente (penalização de 15 min por infração). Passagem obrigatória nos postos de controlo, sob pena de desclassificação. Proibido receber ajuda externa fora dos abastecimentos. Responsabilidade ambiental obrigatória — todos os resíduos devem ser transportados pelo atleta. Prova em open road: precaução nos troços rodoviários. Tempo limite: 6 horas."
  );

  const faq4Translations = {
    pt: {
      question: "Quais são as principais regras e penalizações?",
      answer:
        "Dorsal obrigatório, visível à frente (penalização de 15 min por infração). Passagem obrigatória nos postos de controlo, sob pena de desclassificação. Proibido receber ajuda externa fora dos abastecimentos. Responsabilidade ambiental obrigatória — todos os resíduos devem ser transportados pelo atleta. Prova em open road: precaução nos troços rodoviários. Tempo limite: 6 horas.",
    },
    en: {
      question: "What are the main rules and penalties?",
      answer:
        "Bib number mandatory, visible on the front (15-min penalty per infraction). Mandatory passage through checkpoints, under penalty of disqualification. External help outside aid stations is forbidden. Environmental responsibility mandatory — all waste must be carried by the athlete. Open road race: caution on road sections. Time limit: 6 hours.",
    },
    es: {
      question: "¿Cuáles son las principales reglas y penalizaciones?",
      answer:
        "Dorsal obligatorio, visible por delante (penalización de 15 min por infracción). Paso obligatorio por los puestos de control, bajo pena de descalificación. Prohibido recibir ayuda externa fuera de los avituallamientos. Responsabilidad ambiental obligatoria — todos los residuos deben ser transportados por el atleta. Prueba en open road: precaución en los tramos de carretera. Tiempo límite: 6 horas.",
    },
    fr: {
      question: "Quelles sont les principales règles et pénalités ?",
      answer:
        "Dossard obligatoire, visible à l'avant (pénalité de 15 min par infraction). Passage obligatoire aux postes de contrôle, sous peine de disqualification. Aide extérieure interdite en dehors des ravitaillements. Responsabilité environnementale obligatoire — tous les déchets doivent être transportés par l'athlète. Course en open road : prudence sur les tronçons routiers. Temps limite : 6 heures.",
    },
    de: {
      question: "Was sind die wichtigsten Regeln und Strafen?",
      answer:
        "Startnummer Pflicht, sichtbar auf der Vorderseite (15-Min-Strafe pro Verstoß). Pflichtdurchgang an den Kontrollposten, bei Nichtbeachtung Disqualifikation. Externe Hilfe außerhalb der Verpflegungspunkte verboten. Umweltverantwortung Pflicht — alle Abfälle müssen vom Athleten transportiert werden. Open-Road-Rennen: Vorsicht auf Straßenabschnitten. Zeitlimit: 6 Stunden.",
    },
    it: {
      question: "Quali sono le principali regole e penalità?",
      answer:
        "Pettorale obbligatorio, visibile davanti (penalità di 15 min per infrazione). Passaggio obbligatorio ai posti di controllo, pena la squalifica. Aiuto esterno vietato al di fuori dei ristori. Responsabilità ambientale obbligatoria — tutti i rifiuti devono essere trasportati dall'atleta. Gara in open road: prudenza nei tratti stradali. Tempo limite: 6 ore.",
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
  console.log("✅ FAQ 4: Rules and penalties");

  // ──────────────────────────────────────────────
  // Summary
  // ──────────────────────────────────────────────
  console.log(`
✅ Seed completed successfully!

📊 Summary:
- Event: Sunset Srª dos Chãos Trail 2026 – 3ª Edição
- Slug: sunset-sra-dos-chaos-trail-2026
- Variants: 4 (Trail Longo 23 km, Trail 13 km, Mini-Trail 10 km, Caminhada 10 km)
- Languages: 6 (pt, en, es, fr, de, it)
- Pricing Phases: 8 (2 per variant × 4 variants)
- FAQs: 5 (with translations in all 6 languages)
- Date: May 2, 2026
- Location: Capela da Srª dos Chãos, Valongo
- Coordinates: 41.187374, -8.513307
- Organization: TOG – Associação Running Team
- Type: Trail running (competitive) + Caminhada (non-competitive)
- Total capacity: 900 (250 + 350 + 150 + 150)
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
