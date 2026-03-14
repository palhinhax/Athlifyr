/**
 * Seed: VIII Meia Maratona de Vila Real 2026
 *
 * Event: Road running event in Vila Real
 * Location: Av. Carvalho Araújo, Vila Real
 * Date: April 12, 2026 at 09:30
 * Organizer: Associação de Atletismo de Vila Real + Câmara Municipal de Vila Real (EXCELLUS)
 * Sport: Running
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding VIII Meia Maratona de Vila Real 2026...");

  // ──────────────────────────────────────────────
  // 1. Upsert Event (no nested creates)
  // ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: "meia-maratona-vila-real-2026" },
    update: {
      title: "VIII Meia Maratona de Vila Real 2026",
      description:
        "VIII Meia Maratona de Vila Real 2026 - Corrida em Vila Real",
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-04-12T09:30:00Z"),
      endDate: new Date("2026-04-12T12:00:00Z"),
      registrationDeadline: new Date("2026-04-10T21:00:00Z"),
      externalUrl: "https://www.meiamaratonavr.pt",
      imageUrl: "",
      city: "Vila Real",
      country: "Portugal",
      latitude: 41.2958,
      longitude: -7.7467,
      googleMapsUrl: "",
      isFeatured: false,
      cancelled: false,
    },
    create: {
      title: "VIII Meia Maratona de Vila Real 2026",
      slug: "meia-maratona-vila-real-2026",
      description:
        "VIII Meia Maratona de Vila Real 2026 - Corrida em Vila Real",
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-04-12T09:30:00Z"),
      endDate: new Date("2026-04-12T12:00:00Z"),
      registrationDeadline: new Date("2026-04-10T21:00:00Z"),
      externalUrl: "https://www.meiamaratonavr.pt",
      imageUrl: "",
      city: "Vila Real",
      country: "Portugal",
      latitude: 41.2958,
      longitude: -7.7467,
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
      title: "VIII Meia Maratona de Vila Real 2026",
      description: `# 🏃 VIII Meia Maratona de Vila Real 2026

**A VIII Meia Maratona de Vila Real realiza-se a 12 de abril de 2026, com partida e chegada na Av. Carvalho Araújo.** Organizada pela Associação de Atletismo de Vila Real, em coorganização com a Câmara Municipal de Vila Real. Evento inclusivo com quatro provas para todos os níveis. Tempo máximo: 2h30.

---

## 🏃 Provas

- **Meia Maratona** – 21,097 km · Competitiva · 18+ anos
- **Mini Maratona** – 7 km · Competitiva · 18+ anos
- **Corrida da Mobilidade** – 12 km · Cadeira de rodas · Competitiva
- **Caminhada Inclusiva** – 5 km · Não competitiva · Todas as idades

---

🏃 **Vem correr em Vila Real!** 🏅`,
      city: "Vila Real",
      metaTitle: "VIII Meia Maratona de Vila Real 2026 - 8ª Edição | 12 Abril",
      metaDescription:
        "VIII Meia Maratona de Vila Real 2026 - 12 de abril. Provas: Meia Maratona 21km, Mini Maratona 7km, Corrida da Mobilidade 12km e Caminhada Inclusiva 5km. Partida na Av. Carvalho Araújo.",
    },
    en: {
      title: "VIII Vila Real Half Marathon 2026",
      description: `# 🏃 VIII Vila Real Half Marathon 2026

**The 8th Vila Real Half Marathon takes place on April 12, 2026, starting and finishing on Av. Carvalho Araújo.** Organized by the Vila Real Athletics Association, co-organized with the Vila Real Municipality. An inclusive event with four races for all levels. Maximum time: 2h30.

---

## 🏃 Races

- **Half Marathon** – 21.097 km · Competitive · 18+ years
- **Mini Marathon** – 7 km · Competitive · 18+ years
- **Mobility Race** – 12 km · Wheelchair · Competitive
- **Inclusive Walk** – 5 km · Non-competitive · All ages

---

🏃 **Come run in Vila Real!** 🏅`,
      city: "Vila Real",
      metaTitle: "VIII Vila Real Half Marathon 2026 - 8th Edition | April 12",
      metaDescription:
        "VIII Vila Real Half Marathon 2026 - April 12. Races: Half Marathon 21km, Mini Marathon 7km, Mobility Race 12km and Inclusive Walk 5km. Start at Av. Carvalho Araújo.",
    },
    es: {
      title: "VIII Media Maratón de Vila Real 2026",
      description: `# 🏃 VIII Media Maratón de Vila Real 2026

**La VIII Media Maratón de Vila Real se celebra el 12 de abril de 2026, con salida y llegada en la Av. Carvalho Araújo.** Organizada por la Asociación de Atletismo de Vila Real, en coorganización con el Ayuntamiento de Vila Real. Evento inclusivo con cuatro pruebas para todos los niveles. Tiempo máximo: 2h30.

---

## 🏃 Pruebas

- **Media Maratón** – 21,097 km · Competitiva · 18+ años
- **Mini Maratón** – 7 km · Competitiva · 18+ años
- **Carrera de Movilidad** – 12 km · Silla de ruedas · Competitiva
- **Caminata Inclusiva** – 5 km · No competitiva · Todas las edades

---

🏃 **¡Ven a correr en Vila Real!** 🏅`,
      city: "Vila Real",
      metaTitle: "VIII Media Maratón de Vila Real 2026 - 8ª Edición | 12 Abril",
      metaDescription:
        "VIII Media Maratón de Vila Real 2026 - 12 de abril. Pruebas: Media Maratón 21km, Mini Maratón 7km, Carrera de Movilidad 12km y Caminata Inclusiva 5km. Salida en Av. Carvalho Araújo.",
    },
    fr: {
      title: "VIII Semi-Marathon de Vila Real 2026",
      description: `# 🏃 VIII Semi-Marathon de Vila Real 2026

**Le VIIIe Semi-Marathon de Vila Real se déroule le 12 avril 2026, avec départ et arrivée sur l'Av. Carvalho Araújo.** Organisé par l'Association d'Athlétisme de Vila Real, en coorganisation avec la Municipalité de Vila Real. Événement inclusif avec quatre épreuves pour tous les niveaux. Temps maximum : 2h30.

---

## 🏃 Épreuves

- **Semi-Marathon** – 21,097 km · Compétitif · 18+ ans
- **Mini Marathon** – 7 km · Compétitif · 18+ ans
- **Course de la Mobilité** – 12 km · Fauteuil roulant · Compétitif
- **Marche Inclusive** – 5 km · Non compétitive · Tous âges

---

🏃 **Venez courir à Vila Real !** 🏅`,
      city: "Vila Real",
      metaTitle: "VIII Semi-Marathon de Vila Real 2026 - 8e Édition | 12 Avril",
      metaDescription:
        "VIII Semi-Marathon de Vila Real 2026 - 12 avril. Épreuves : Semi-Marathon 21km, Mini Marathon 7km, Course de la Mobilité 12km et Marche Inclusive 5km. Départ Av. Carvalho Araújo.",
    },
    de: {
      title: "VIII Halbmarathon Vila Real 2026",
      description: `# 🏃 VIII Halbmarathon Vila Real 2026

**Der VIII. Halbmarathon von Vila Real findet am 12. April 2026 statt, mit Start und Ziel auf der Av. Carvalho Araújo.** Organisiert vom Leichtathletikverband Vila Real, in Zusammenarbeit mit der Gemeinde Vila Real. Inklusives Event mit vier Rennen für alle Leistungsstufen. Höchstzeit: 2h30.

---

## 🏃 Läufe

- **Halbmarathon** – 21,097 km · Wettkampf · 18+ Jahre
- **Mini-Marathon** – 7 km · Wettkampf · 18+ Jahre
- **Mobilitätslauf** – 12 km · Rollstuhl · Wettkampf
- **Inklusiver Spaziergang** – 5 km · Ohne Wertung · Alle Altersklassen

---

🏃 **Komm und lauf in Vila Real!** 🏅`,
      city: "Vila Real",
      metaTitle: "VIII Halbmarathon Vila Real 2026 - 8. Ausgabe | 12. April",
      metaDescription:
        "VIII Halbmarathon Vila Real 2026 - 12. April. Läufe: Halbmarathon 21km, Mini-Marathon 7km, Mobilitätslauf 12km und Inklusiver Spaziergang 5km. Start auf Av. Carvalho Araújo.",
    },
    it: {
      title: "VIII Mezza Maratona di Vila Real 2026",
      description: `# 🏃 VIII Mezza Maratona di Vila Real 2026

**L'VIII Mezza Maratona di Vila Real si svolge il 12 aprile 2026, con partenza e arrivo sull'Av. Carvalho Araújo.** Organizzata dall'Associazione di Atletica di Vila Real, in co-organizzazione con il Comune di Vila Real. Evento inclusivo con quattro gare per tutti i livelli. Tempo massimo: 2h30.

---

## 🏃 Gare

- **Mezza Maratona** – 21,097 km · Competitiva · 18+ anni
- **Mini Maratona** – 7 km · Competitiva · 18+ anni
- **Corsa della Mobilità** – 12 km · Sedia a rotelle · Competitiva
- **Camminata Inclusiva** – 5 km · Non competitiva · Tutte le età

---

🏃 **Vieni a correre a Vila Real!** 🏅`,
      city: "Vila Real",
      metaTitle:
        "VIII Mezza Maratona di Vila Real 2026 - 8ª Edizione | 12 Aprile",
      metaDescription:
        "VIII Mezza Maratona di Vila Real 2026 - 12 aprile. Gare: Mezza Maratona 21km, Mini Maratona 7km, Corsa della Mobilità 12km e Camminata Inclusiva 5km. Partenza Av. Carvalho Araújo.",
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

  // ── Variant 1: Meia Maratona 21,097 km ──
  const meiaMaratona = await findOrCreateVariant({
    name: "Meia Maratona 21km",
    distanceKm: 21.097,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-12T09:30:00Z"),
    startTime: "09:30",
    cutoffTimeHours: 2.5,
    price: 13.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Meia Maratona 21,097km · Competitiva · 18+ anos · Medalha finisher",
  });
  console.log(`✅ Variant: ${meiaMaratona.name}`);

  // ── Variant 2: Mini Maratona 7 km ──
  const miniMaratona = await findOrCreateVariant({
    name: "Mini Maratona 7km",
    distanceKm: 7,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-12T09:30:00Z"),
    startTime: "09:30",
    cutoffTimeHours: 2.5,
    price: 13.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Mini Maratona 7km · Competitiva · 18+ anos · Medalha finisher",
  });
  console.log(`✅ Variant: ${miniMaratona.name}`);

  // ── Variant 3: Corrida da Mobilidade 12 km ──
  const corridaMobilidade = await findOrCreateVariant({
    name: "Corrida da Mobilidade 12km",
    distanceKm: 12,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-12T09:20:00Z"),
    startTime: "09:20",
    cutoffTimeHours: 2.5,
    price: 0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Corrida da Mobilidade 12km · Cadeira de rodas · Competitiva · Inscrição gratuita via voucher",
  });
  console.log(`✅ Variant: ${corridaMobilidade.name}`);

  // ── Variant 4: Caminhada Inclusiva 5 km ──
  const caminhada = await findOrCreateVariant({
    name: "Caminhada Inclusiva 5km",
    distanceKm: 5,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-12T09:30:00Z"),
    startTime: "09:30",
    cutoffTimeHours: 2.5,
    price: 7.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Caminhada Inclusiva 5km · Não competitiva · Todas as idades · Inclui t-shirt",
  });
  console.log(`✅ Variant: ${caminhada.name}`);

  // ──────────────────────────────────────────────
  // 4. Pricing Phases (linked to eventId AND variantId)
  // ──────────────────────────────────────────────

  // Meia Maratona / Mini Maratona share same pricing
  for (const variant of [meiaMaratona, miniMaratona]) {
    await findOrCreatePricingPhase(`${variant.name} - 1ª Fase`, variant.id, {
      startDate: new Date("2026-01-01T00:00:00Z"),
      endDate: new Date("2026-02-15T23:59:59Z"),
      price: 13.0,
      currency: Currency.EUR,
      note: "Inclui kit de participação com t-shirt técnica",
    });

    await findOrCreatePricingPhase(`${variant.name} - 2ª Fase`, variant.id, {
      startDate: new Date("2026-02-16T00:00:00Z"),
      endDate: new Date("2026-03-22T23:59:59Z"),
      price: 15.0,
      currency: Currency.EUR,
      note: "Inclui kit de participação com t-shirt técnica",
    });

    await findOrCreatePricingPhase(`${variant.name} - 3ª Fase`, variant.id, {
      startDate: new Date("2026-03-23T00:00:00Z"),
      endDate: new Date("2026-04-10T21:00:00Z"),
      price: 20.0,
      currency: Currency.EUR,
      note: "Kit de participação / t-shirt não garantido",
    });

    console.log(`   - 3 pricing phases for ${variant.name}`);
  }

  // Corrida da Mobilidade - gratuita
  await findOrCreatePricingPhase(
    "Corrida da Mobilidade 12km - Inscrição",
    corridaMobilidade.id,
    {
      startDate: new Date("2026-01-01T00:00:00Z"),
      endDate: new Date("2026-04-10T21:00:00Z"),
      price: 0,
      currency: Currency.EUR,
      note: "Gratuita - inscrição via voucher (geral@meiamaratonavr.pt)",
    }
  );
  console.log("   - 1 pricing phase for Corrida da Mobilidade 12km");

  // Caminhada Inclusiva
  await findOrCreatePricingPhase(
    "Caminhada Inclusiva 5km - 1ª Fase",
    caminhada.id,
    {
      startDate: new Date("2026-01-01T00:00:00Z"),
      endDate: new Date("2026-02-15T23:59:59Z"),
      price: 7.0,
      currency: Currency.EUR,
      note: "Inclui t-shirt",
    }
  );

  await findOrCreatePricingPhase(
    "Caminhada Inclusiva 5km - 2ª Fase",
    caminhada.id,
    {
      startDate: new Date("2026-02-16T00:00:00Z"),
      endDate: new Date("2026-03-22T23:59:59Z"),
      price: 8.0,
      currency: Currency.EUR,
      note: "Inclui t-shirt",
    }
  );

  await findOrCreatePricingPhase(
    "Caminhada Inclusiva 5km - 3ª Fase",
    caminhada.id,
    {
      startDate: new Date("2026-03-23T00:00:00Z"),
      endDate: new Date("2026-04-10T21:00:00Z"),
      price: 10.0,
      currency: Currency.EUR,
      note: "Kit de participação / t-shirt não garantido",
    }
  );
  console.log("   - 3 pricing phases for Caminhada Inclusiva 5km");

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

  // FAQ 0: Registration system (Meia + Mini shared)
  const faq0 = await findOrCreateFAQ(
    event.id,
    0,
    "Como funciona a inscrição na Meia e Mini Maratona?",
    "A inscrição é única para ambas as provas. No dia da prova, aos 7,5 km (passando na meta), o atleta decide se termina a Mini Maratona ou continua para a Meia Maratona. Inscrições em www.meiamaratonavr.pt. Pagamento obrigatório para confirmar. Inscrições terminam às 21h00 do dia 10 de abril."
  );

  const faq0Translations = {
    pt: {
      question: "Como funciona a inscrição na Meia e Mini Maratona?",
      answer:
        "A inscrição é única para ambas as provas. No dia da prova, aos 7,5 km (passando na meta), o atleta decide se termina a Mini Maratona ou continua para a Meia Maratona. Inscrições em www.meiamaratonavr.pt. Pagamento obrigatório para confirmar. Inscrições terminam às 21h00 do dia 10 de abril.",
    },
    en: {
      question: "How does registration for the Half and Mini Marathon work?",
      answer:
        "Registration is shared for both races. On race day, at the 7.5 km mark (passing the finish line), the athlete decides whether to finish the Mini Marathon or continue to the Half Marathon. Registration at www.meiamaratonavr.pt. Payment required to confirm. Registration closes at 9:00 PM on April 10.",
    },
    es: {
      question: "¿Cómo funciona la inscripción en la Media y Mini Maratón?",
      answer:
        "La inscripción es única para ambas pruebas. El día de la carrera, en el km 7,5 (pasando por meta), el atleta decide si termina la Mini Maratón o continúa hacia la Media Maratón. Inscripciones en www.meiamaratonavr.pt. Pago obligatorio para confirmar. Las inscripciones cierran a las 21:00 del 10 de abril.",
    },
    fr: {
      question: "Comment fonctionne l'inscription au Semi et Mini Marathon ?",
      answer:
        "L'inscription est unique pour les deux épreuves. Le jour de la course, au km 7,5 (en passant la ligne d'arrivée), l'athlète décide s'il termine le Mini Marathon ou continue vers le Semi-Marathon. Inscriptions sur www.meiamaratonavr.pt. Paiement obligatoire. Les inscriptions ferment à 21h00 le 10 avril.",
    },
    de: {
      question: "Wie funktioniert die Anmeldung für Halb- und Mini-Marathon?",
      answer:
        "Die Anmeldung gilt für beide Läufe. Am Wettkampftag entscheidet der Athlet bei km 7,5 (am Ziel vorbei), ob er den Mini-Marathon beendet oder zum Halbmarathon weiterläuft. Anmeldung auf www.meiamaratonavr.pt. Zahlung zur Bestätigung erforderlich. Anmeldeschluss: 21:00 Uhr am 10. April.",
    },
    it: {
      question: "Come funziona l'iscrizione alla Mezza e Mini Maratona?",
      answer:
        "L'iscrizione è unica per entrambe le gare. Il giorno della gara, al km 7,5 (passando al traguardo), l'atleta decide se terminare la Mini Maratona o continuare verso la Mezza Maratona. Iscrizioni su www.meiamaratonavr.pt. Pagamento obbligatorio. Le iscrizioni chiudono alle 21:00 del 10 aprile.",
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
  console.log("✅ FAQ 0: Registration system");

  // FAQ 1: Kit and bib pickup
  const faq1 = await findOrCreateFAQ(
    event.id,
    1,
    "Onde e quando levanto o meu kit?",
    "Entrega de kits na Praça do Município de Vila Real nos dias 11 e 12 de abril de 2026. Inscrições pagas até 31 de março garantem kit com t-shirt técnica. Após essa data, t-shirt não garantida. Necessário comprovativo de inscrição (n.º dorsal) e/ou documento de identificação."
  );

  const faq1Translations = {
    pt: {
      question: "Onde e quando levanto o meu kit?",
      answer:
        "Entrega de kits na Praça do Município de Vila Real nos dias 11 e 12 de abril de 2026. Inscrições pagas até 31 de março garantem kit com t-shirt técnica. Após essa data, t-shirt não garantida. Necessário comprovativo de inscrição (n.º dorsal) e/ou documento de identificação.",
    },
    en: {
      question: "Where and when do I pick up my kit?",
      answer:
        "Kit pickup at Praça do Município de Vila Real on April 11 and 12, 2026. Registrations paid by March 31 guarantee a kit with technical t-shirt. After that date, t-shirt is not guaranteed. You need proof of registration (bib number) and/or ID.",
    },
    es: {
      question: "¿Dónde y cuándo recojo mi kit?",
      answer:
        "Entrega de kits en la Praça do Município de Vila Real los días 11 y 12 de abril de 2026. Las inscripciones pagadas hasta el 31 de marzo garantizan kit con camiseta técnica. Después de esa fecha, camiseta no garantizada. Necesario comprobante de inscripción (n.º dorsal) y/o documento de identidad.",
    },
    fr: {
      question: "Où et quand récupérer mon kit ?",
      answer:
        "Retrait des kits à la Praça do Município de Vila Real les 11 et 12 avril 2026. Les inscriptions payées avant le 31 mars garantissent un kit avec t-shirt technique. Après cette date, le t-shirt n'est pas garanti. Justificatif d'inscription (n° dossard) et/ou pièce d'identité requis.",
    },
    de: {
      question: "Wo und wann hole ich mein Kit ab?",
      answer:
        "Kit-Ausgabe am Praça do Município de Vila Real am 11. und 12. April 2026. Bis 31. März bezahlte Anmeldungen garantieren Kit mit technischem T-Shirt. Danach kein T-Shirt garantiert. Anmeldebestätigung (Startnummer) und/oder Ausweis erforderlich.",
    },
    it: {
      question: "Dove e quando ritiro il mio kit?",
      answer:
        "Ritiro kit alla Praça do Município de Vila Real l'11 e 12 aprile 2026. Iscrizioni pagate entro il 31 marzo garantiscono kit con t-shirt tecnica. Dopo tale data, t-shirt non garantita. Necessaria prova di iscrizione (n. pettorale) e/o documento d'identità.",
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
  console.log("✅ FAQ 1: Kit pickup");

  // FAQ 2: Corrida da Mobilidade
  const faq2 = await findOrCreateFAQ(
    event.id,
    2,
    "Como funciona a Corrida da Mobilidade?",
    "Prova de 12 km em cadeira de rodas, com partida às 09h20 (antes da Meia Maratona). Escalão único. Obrigatório: capacete e equipa de assistência de 4 pessoas. Inscrição gratuita via voucher – enviar email para geral@meiamaratonavr.pt. Não são permitidas alterações mecânicas na cadeira."
  );

  const faq2Translations = {
    pt: {
      question: "Como funciona a Corrida da Mobilidade?",
      answer:
        "Prova de 12 km em cadeira de rodas, com partida às 09h20 (antes da Meia Maratona). Escalão único. Obrigatório: capacete e equipa de assistência de 4 pessoas. Inscrição gratuita via voucher – enviar email para geral@meiamaratonavr.pt. Não são permitidas alterações mecânicas na cadeira.",
    },
    en: {
      question: "How does the Mobility Race work?",
      answer:
        "12 km wheelchair race, starting at 9:20 AM (before the Half Marathon). Single category. Mandatory: helmet and 4-person assistance team. Free registration via voucher – email geral@meiamaratonavr.pt. No mechanical alterations to the wheelchair allowed.",
    },
    es: {
      question: "¿Cómo funciona la Carrera de Movilidad?",
      answer:
        "Prueba de 12 km en silla de ruedas, con salida a las 09:20 (antes de la Media Maratón). Escalón único. Obligatorio: casco y equipo de asistencia de 4 personas. Inscripción gratuita vía voucher – enviar email a geral@meiamaratonavr.pt. No se permiten alteraciones mecánicas en la silla.",
    },
    fr: {
      question: "Comment fonctionne la Course de la Mobilité ?",
      answer:
        "Épreuve de 12 km en fauteuil roulant, départ à 09h20 (avant le Semi-Marathon). Catégorie unique. Obligatoire : casque et équipe d'assistance de 4 personnes. Inscription gratuite via voucher – email à geral@meiamaratonavr.pt. Aucune modification mécanique du fauteuil autorisée.",
    },
    de: {
      question: "Wie funktioniert der Mobilitätslauf?",
      answer:
        "12 km Rollstuhlrennen, Start um 09:20 (vor dem Halbmarathon). Eine Kategorie. Pflicht: Helm und 4-Personen-Assistenzteam. Kostenlose Anmeldung per Voucher – E-Mail an geral@meiamaratonavr.pt. Keine mechanischen Änderungen am Rollstuhl erlaubt.",
    },
    it: {
      question: "Come funziona la Corsa della Mobilità?",
      answer:
        "Gara di 12 km in sedia a rotelle, partenza alle 09:20 (prima della Mezza Maratona). Categoria unica. Obbligatorio: casco e squadra di assistenza di 4 persone. Iscrizione gratuita via voucher – email a geral@meiamaratonavr.pt. Nessuna modifica meccanica alla sedia permessa.",
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
  console.log("✅ FAQ 2: Corrida da Mobilidade");

  // FAQ 3: Aid stations
  const faq3 = await findOrCreateFAQ(
    event.id,
    3,
    "Onde estão os pontos de abastecimento?",
    "Meia Maratona: água aos 5km, 9km, 12km, 15km, 18km e meta (6 pontos). Abastecimento sólido aos 12km e meta. Fruta na meta. Mini Maratona: água aos 5km e meta. Fruta na meta. Caminhada: água no início e final do percurso."
  );

  const faq3Translations = {
    pt: {
      question: "Onde estão os pontos de abastecimento?",
      answer:
        "Meia Maratona: água aos 5km, 9km, 12km, 15km, 18km e meta (6 pontos). Abastecimento sólido aos 12km e meta. Fruta na meta. Mini Maratona: água aos 5km e meta. Fruta na meta. Caminhada: água no início e final do percurso.",
    },
    en: {
      question: "Where are the aid stations?",
      answer:
        "Half Marathon: water at 5km, 9km, 12km, 15km, 18km and finish (6 stations). Solid food at 12km and finish. Fruit at finish. Mini Marathon: water at 5km and finish. Fruit at finish. Walk: water at start and end.",
    },
    es: {
      question: "¿Dónde están los puntos de avituallamiento?",
      answer:
        "Media Maratón: agua en los km 5, 9, 12, 15, 18 y meta (6 puntos). Avituallamiento sólido en km 12 y meta. Fruta en meta. Mini Maratón: agua en km 5 y meta. Fruta en meta. Caminata: agua al inicio y final.",
    },
    fr: {
      question: "Où sont les points de ravitaillement ?",
      answer:
        "Semi-Marathon : eau aux km 5, 9, 12, 15, 18 et arrivée (6 points). Ravitaillement solide aux km 12 et arrivée. Fruits à l'arrivée. Mini Marathon : eau aux km 5 et arrivée. Fruits à l'arrivée. Marche : eau au départ et à l'arrivée.",
    },
    de: {
      question: "Wo sind die Verpflegungsstationen?",
      answer:
        "Halbmarathon: Wasser bei km 5, 9, 12, 15, 18 und Ziel (6 Stationen). Feste Verpflegung bei km 12 und Ziel. Obst im Ziel. Mini-Marathon: Wasser bei km 5 und Ziel. Obst im Ziel. Wanderung: Wasser am Start und Ziel.",
    },
    it: {
      question: "Dove sono i punti di ristoro?",
      answer:
        "Mezza Maratona: acqua ai km 5, 9, 12, 15, 18 e traguardo (6 punti). Ristoro solido ai km 12 e traguardo. Frutta al traguardo. Mini Maratona: acqua ai km 5 e traguardo. Frutta al traguardo. Camminata: acqua alla partenza e arrivo.",
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
  console.log("✅ FAQ 3: Aid stations");

  // FAQ 4: Categories and prizes
  const faq4 = await findOrCreateFAQ(
    event.id,
    4,
    "Quais são os escalões e prémios?",
    "Meia Maratona – M/F: Geral (top 10, 500€ a 50€), Seniores, V35, V40, V45, V50, V55 (top 3: 100€, 50€, 25€). Mini Maratona – Geral M/F (top 3: 50€, 30€, 20€; 4º-10º: 10€). Corrida da Mobilidade – Geral (top 5: 175€ a 40€). Medalha finisher para Meia e Mini Maratona. Caminhada sem classificação."
  );

  const faq4Translations = {
    pt: {
      question: "Quais são os escalões e prémios?",
      answer:
        "Meia Maratona – M/F: Geral (top 10, 500€ a 50€), Seniores, V35, V40, V45, V50, V55 (top 3: 100€, 50€, 25€). Mini Maratona – Geral M/F (top 3: 50€, 30€, 20€; 4º-10º: 10€). Corrida da Mobilidade – Geral (top 5: 175€ a 40€). Medalha finisher para Meia e Mini Maratona. Caminhada sem classificação.",
    },
    en: {
      question: "What are the categories and prizes?",
      answer:
        "Half Marathon – M/F: Overall (top 10, €500 to €50), Seniors, V35, V40, V45, V50, V55 (top 3: €100, €50, €25). Mini Marathon – Overall M/F (top 3: €50, €30, €20; 4th-10th: €10). Mobility Race – Overall (top 5: €175 to €40). Finisher medal for Half and Mini Marathon. Walk has no ranking.",
    },
    es: {
      question: "¿Cuáles son las categorías y premios?",
      answer:
        "Media Maratón – M/F: General (top 10, 500€ a 50€), Seniores, V35, V40, V45, V50, V55 (top 3: 100€, 50€, 25€). Mini Maratón – General M/F (top 3: 50€, 30€, 20€; 4º-10º: 10€). Carrera de Movilidad – General (top 5: 175€ a 40€). Medalla finisher para Media y Mini Maratón. Caminata sin clasificación.",
    },
    fr: {
      question: "Quelles sont les catégories et les prix ?",
      answer:
        "Semi-Marathon – H/F : Général (top 10, 500€ à 50€), Seniors, V35, V40, V45, V50, V55 (top 3 : 100€, 50€, 25€). Mini Marathon – Général H/F (top 3 : 50€, 30€, 20€ ; 4e-10e : 10€). Course de la Mobilité – Général (top 5 : 175€ à 40€). Médaille finisher pour Semi et Mini Marathon. Marche sans classement.",
    },
    de: {
      question: "Welche Kategorien und Preise gibt es?",
      answer:
        "Halbmarathon – M/W: Gesamt (Top 10, 500€ bis 50€), Senioren, V35, V40, V45, V50, V55 (Top 3: 100€, 50€, 25€). Mini-Marathon – Gesamt M/W (Top 3: 50€, 30€, 20€; 4.-10.: 10€). Mobilitätslauf – Gesamt (Top 5: 175€ bis 40€). Finisher-Medaille für Halb- und Mini-Marathon. Wanderung ohne Wertung.",
    },
    it: {
      question: "Quali sono le categorie e i premi?",
      answer:
        "Mezza Maratona – M/F: Generale (top 10, 500€ a 50€), Seniores, V35, V40, V45, V50, V55 (top 3: 100€, 50€, 25€). Mini Maratona – Generale M/F (top 3: 50€, 30€, 20€; 4º-10º: 10€). Corsa della Mobilità – Generale (top 5: 175€ a 40€). Medaglia finisher per Mezza e Mini Maratona. Camminata senza classifica.",
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

  // FAQ 5: Refunds and cancellations
  const faq5 = await findOrCreateFAQ(
    event.id,
    5,
    "Posso cancelar a inscrição ou obter reembolso?",
    "O valor da inscrição não é reembolsável. Não são permitidos cancelamentos, apenas substituições de inscrição. As inscrições são intransmissíveis. Preços exclusivos para naturais/residentes em Portugal e Espanha. Menores de 12 anos participam gratuitamente na caminhada quando acompanhados por adulto."
  );

  const faq5Translations = {
    pt: {
      question: "Posso cancelar a inscrição ou obter reembolso?",
      answer:
        "O valor da inscrição não é reembolsável. Não são permitidos cancelamentos, apenas substituições de inscrição. As inscrições são intransmissíveis. Preços exclusivos para naturais/residentes em Portugal e Espanha. Menores de 12 anos participam gratuitamente na caminhada quando acompanhados por adulto.",
    },
    en: {
      question: "Can I cancel my registration or get a refund?",
      answer:
        "Registration fees are non-refundable. No cancellations allowed, only registration substitutions. Registrations are non-transferable. Prices exclusive for residents of Portugal and Spain. Children under 12 can participate free in the walk when accompanied by an adult.",
    },
    es: {
      question: "¿Puedo cancelar mi inscripción u obtener reembolso?",
      answer:
        "El valor de la inscripción no es reembolsable. No se permiten cancelaciones, solo sustituciones de inscripción. Las inscripciones son intransferibles. Precios exclusivos para naturales/residentes en Portugal y España. Menores de 12 años participan gratis en la caminata si van acompañados por un adulto.",
    },
    fr: {
      question: "Puis-je annuler mon inscription ou obtenir un remboursement ?",
      answer:
        "Les frais d'inscription ne sont pas remboursables. Aucune annulation permise, seules les substitutions d'inscription sont possibles. Les inscriptions sont incessibles. Prix exclusifs pour les résidents du Portugal et d'Espagne. Les moins de 12 ans participent gratuitement à la marche s'ils sont accompagnés d'un adulte.",
    },
    de: {
      question:
        "Kann ich meine Anmeldung stornieren oder eine Erstattung erhalten?",
      answer:
        "Die Anmeldegebühr wird nicht erstattet. Keine Stornierungen möglich, nur Anmeldeübertragungen. Anmeldungen sind nicht übertragbar. Preise exklusiv für Einwohner Portugals und Spaniens. Kinder unter 12 Jahren nehmen kostenlos an der Wanderung teil, wenn sie von einem Erwachsenen begleitet werden.",
    },
    it: {
      question: "Posso cancellare l'iscrizione o ottenere un rimborso?",
      answer:
        "La quota di iscrizione non è rimborsabile. Non sono ammesse cancellazioni, solo sostituzioni di iscrizione. Le iscrizioni sono non trasferibili. Prezzi esclusivi per residenti in Portogallo e Spagna. I minori di 12 anni partecipano gratuitamente alla camminata se accompagnati da un adulto.",
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
  console.log("✅ FAQ 5: Refunds and cancellations");

  // ──────────────────────────────────────────────
  // Summary
  // ──────────────────────────────────────────────
  console.log(`
✅ Seed completed successfully!

📊 Summary:
- Event: VIII Meia Maratona de Vila Real 2026
- Slug: meia-maratona-vila-real-2026
- Variants: 4 (Meia Maratona 21km, Mini Maratona 7km, Corrida da Mobilidade 12km, Caminhada Inclusiva 5km)
- Languages: 6 (pt, en, es, fr, de, it)
- Pricing Phases: 10 total (3×Meia + 3×Mini + 1×Mobilidade + 3×Caminhada)
- FAQs: 6 (with translations in all 6 languages)
- Date: April 12, 2026
- Location: Av. Carvalho Araújo, Vila Real
- Coordinates: 41.2958, -7.7467
- Organization: Associação de Atletismo de Vila Real + Câmara Municipal de Vila Real (EXCELLUS)
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
