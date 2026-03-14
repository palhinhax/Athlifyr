/**
 * Seed: GPS Rota do Romanico – Ases Pedais 2026
 *
 * Event: GPS cycling ride (leisure, non-competitive) in Gandra, Paredes
 * Location: Centro Cultural Recreativo Vilarinho de Baixo, Gandra, Paredes
 * Date: April 5, 2026
 * Organizer: Ases Pedais
 * Sport: BTT (Cycling)
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding GPS Rota do Romanico – Ases Pedais 2026...");

  // ──────────────────────────────────────────────
  // 1. Upsert Event (no nested creates)
  // ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: "gps-rota-do-romanico-ases-pedais-2026" },
    update: {
      title: "GPS Rota do Romanico – Ases Pedais 2026",
      description:
        "GPS Rota do Romanico – Ases Pedais 2026 - Passeio de BTT em Gandra, Paredes",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-04-05T08:00:00Z"),
      endDate: new Date("2026-04-05T17:00:00Z"),
      registrationDeadline: new Date("2026-04-04T23:59:59Z"),
      externalUrl: "https://www.portimer.pt",
      imageUrl: "",
      city: "Gandra",
      country: "Portugal",
      latitude: 41.183,
      longitude: -8.446,
      googleMapsUrl: "",
      isFeatured: false,
      cancelled: false,
    },
    create: {
      title: "GPS Rota do Romanico – Ases Pedais 2026",
      slug: "gps-rota-do-romanico-ases-pedais-2026",
      description:
        "GPS Rota do Romanico – Ases Pedais 2026 - Passeio de BTT em Gandra, Paredes",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-04-05T08:00:00Z"),
      endDate: new Date("2026-04-05T17:00:00Z"),
      registrationDeadline: new Date("2026-04-04T23:59:59Z"),
      externalUrl: "https://www.portimer.pt",
      imageUrl: "",
      city: "Gandra",
      country: "Portugal",
      latitude: 41.183,
      longitude: -8.446,
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
      title: "GPS Rota do Romanico – Ases Pedais 2026",
      description: `# 🚴 GPS Rota do Romanico – Ases Pedais 2026

**Passeio de BTT pela Rota do Românico a 5 de abril de 2026, com partida de Gandra, Paredes.** Organizado pelos Ases Pedais, evento de lazer sem competição, orientação por GPS e autonomia total. Percursos por caminhos florestais, rurais e estradas da região de Paredes. Qualquer tipo de bicicleta permitida (com ou sem motor). Limitado a 300 participantes.

---

## 🚴 Evento

- **Passeio GPS** – Lazer · Orientação por GPS · Autonomia total
- **Capacete obrigatório** · Idade mínima 14 anos (acompanhados por adulto)

---

🚴 **Vem pedalar pela Rota do Românico!** 🏔️`,
      city: "Gandra, Paredes",
      metaTitle:
        "GPS Rota do Romanico – Ases Pedais 2026 | Gandra, Paredes | 5 Abril",
      metaDescription:
        "GPS Rota do Romanico – Ases Pedais 2026 - 5 de abril em Gandra, Paredes. Passeio de BTT de lazer pela Rota do Românico. Orientação GPS, autonomia total. Limitado a 300 participantes.",
    },
    en: {
      title: "GPS Rota do Romanico – Ases Pedais 2026",
      description: `# 🚴 GPS Rota do Romanico – Ases Pedais 2026

**Mountain bike ride along the Romanesque Route on April 5, 2026, starting from Gandra, Paredes.** Organized by Ases Pedais, a leisure event with no competition, GPS navigation and full autonomy. Routes through forest paths, rural roads and streets in the Paredes region. Any type of bicycle allowed (with or without motor). Limited to 300 participants.

---

## 🚴 Event

- **GPS Ride** – Leisure · GPS navigation · Full autonomy
- **Helmet mandatory** · Minimum age 14 (accompanied by adult)

---

🚴 **Come ride the Romanesque Route!** 🏔️`,
      city: "Gandra, Paredes",
      metaTitle:
        "GPS Rota do Romanico – Ases Pedais 2026 | Gandra, Paredes | April 5",
      metaDescription:
        "GPS Rota do Romanico – Ases Pedais 2026 - April 5 in Gandra, Paredes. Leisure mountain bike ride along the Romanesque Route. GPS navigation, full autonomy. Limited to 300 participants.",
    },
    es: {
      title: "GPS Rota do Romanico – Ases Pedais 2026",
      description: `# 🚴 GPS Rota do Romanico – Ases Pedais 2026

**Paseo en BTT por la Ruta del Románico el 5 de abril de 2026, con salida desde Gandra, Paredes.** Organizado por Ases Pedais, evento de ocio sin competición, orientación por GPS y autonomía total. Recorridos por caminos forestales, rurales y carreteras de la región de Paredes. Cualquier tipo de bicicleta permitida (con o sin motor). Limitado a 300 participantes.

---

## 🚴 Evento

- **Paseo GPS** – Ocio · Orientación por GPS · Autonomía total
- **Casco obligatorio** · Edad mínima 14 años (acompañados por adulto)

---

🚴 **¡Ven a pedalear por la Ruta del Románico!** 🏔️`,
      city: "Gandra, Paredes",
      metaTitle:
        "GPS Rota do Romanico – Ases Pedais 2026 | Gandra, Paredes | 5 Abril",
      metaDescription:
        "GPS Rota do Romanico – Ases Pedais 2026 - 5 de abril en Gandra, Paredes. Paseo en BTT por la Ruta del Románico. Orientación GPS, autonomía total. Limitado a 300 participantes.",
    },
    fr: {
      title: "GPS Rota do Romanico – Ases Pedais 2026",
      description: `# 🚴 GPS Rota do Romanico – Ases Pedais 2026

**Balade VTT sur la Route du Roman le 5 avril 2026, au départ de Gandra, Paredes.** Organisé par Ases Pedais, événement de loisir sans compétition, orientation par GPS et autonomie totale. Parcours sur chemins forestiers, ruraux et routes de la région de Paredes. Tout type de vélo autorisé (avec ou sans moteur). Limité à 300 participants.

---

## 🚴 Événement

- **Balade GPS** – Loisir · Orientation par GPS · Autonomie totale
- **Casque obligatoire** · Âge minimum 14 ans (accompagnés par un adulte)

---

🚴 **Venez pédaler sur la Route du Roman !** 🏔️`,
      city: "Gandra, Paredes",
      metaTitle:
        "GPS Rota do Romanico – Ases Pedais 2026 | Gandra, Paredes | 5 Avril",
      metaDescription:
        "GPS Rota do Romanico – Ases Pedais 2026 - 5 avril à Gandra, Paredes. Balade VTT sur la Route du Roman. Orientation GPS, autonomie totale. Limité à 300 participants.",
    },
    de: {
      title: "GPS Rota do Romanico – Ases Pedais 2026",
      description: `# 🚴 GPS Rota do Romanico – Ases Pedais 2026

**Mountainbike-Tour auf der Romanik-Route am 5. April 2026, Start in Gandra, Paredes.** Organisiert von Ases Pedais, eine Freizeitveranstaltung ohne Wettkampf, GPS-Navigation und volle Autonomie. Strecken über Forstwege, ländliche Wege und Straßen der Region Paredes. Jeder Fahrradtyp erlaubt (mit oder ohne Motor). Begrenzt auf 300 Teilnehmer.

---

## 🚴 Event

- **GPS-Tour** – Freizeit · GPS-Navigation · Volle Autonomie
- **Helm Pflicht** · Mindestalter 14 Jahre (begleitet von Erwachsenem)

---

🚴 **Komm und radel auf der Romanik-Route!** 🏔️`,
      city: "Gandra, Paredes",
      metaTitle:
        "GPS Rota do Romanico – Ases Pedais 2026 | Gandra, Paredes | 5. April",
      metaDescription:
        "GPS Rota do Romanico – Ases Pedais 2026 - 5. April in Gandra, Paredes. Freizeit-Mountainbike-Tour auf der Romanik-Route. GPS-Navigation, volle Autonomie. Begrenzt auf 300 Teilnehmer.",
    },
    it: {
      title: "GPS Rota do Romanico – Ases Pedais 2026",
      description: `# 🚴 GPS Rota do Romanico – Ases Pedais 2026

**Giro in MTB sulla Rotta del Romanico il 5 aprile 2026, partenza da Gandra, Paredes.** Organizzato da Ases Pedais, evento ricreativo senza competizione, navigazione GPS e autonomia totale. Percorsi su strade forestali, rurali e strade della regione di Paredes. Qualsiasi tipo di bicicletta ammessa (con o senza motore). Limitato a 300 partecipanti.

---

## 🚴 Evento

- **Giro GPS** – Ricreativo · Navigazione GPS · Autonomia totale
- **Casco obbligatorio** · Età minima 14 anni (accompagnati da adulto)

---

🚴 **Vieni a pedalare sulla Rotta del Romanico!** 🏔️`,
      city: "Gandra, Paredes",
      metaTitle:
        "GPS Rota do Romanico – Ases Pedais 2026 | Gandra, Paredes | 5 Aprile",
      metaDescription:
        "GPS Rota do Romanico – Ases Pedais 2026 - 5 aprile a Gandra, Paredes. Giro ricreativo in MTB sulla Rotta del Romanico. Navigazione GPS, autonomia totale. Limitato a 300 partecipanti.",
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

  // ── Variant: Passeio GPS ──
  const passeioGPS = await findOrCreateVariant({
    name: "Passeio GPS",
    distanceKm: 0,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-05T08:00:00Z"),
    startTime: "08:00",
    cutoffTimeHours: 9,
    price: 10.0,
    currency: Currency.EUR,
    maxParticipants: 300,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Passeio GPS · Lazer · Orientação GPS · Autonomia total · Qualquer bicicleta",
  });
  console.log(`✅ Variant: ${passeioGPS.name}`);

  // ──────────────────────────────────────────────
  // 4. Pricing Phases (linked to eventId)
  // ──────────────────────────────────────────────

  await findOrCreatePricingPhase("Passeio GPS - Inscrição", {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-04-04T23:59:59Z"),
    price: 10.0,
    currency: Currency.EUR,
    note: "Inclui seguro de acidentes pessoais, frontal e tracks GPS",
  });
  console.log("   - 1 pricing phase for Passeio GPS");

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

  // FAQ 0: Schedule & secretariat
  const faq0 = await findOrCreateFAQ(
    event.id,
    0,
    "Qual é o horário do evento?",
    "Secretariado: 07h30-09h30 (entrega de frontal e registo de saída). Partida: 08h00-10h00. Hora limite de chegada: 17h00. Local: Centro Cultural Recreativo Vilarinho de Baixo, Gandra, Paredes."
  );

  const faq0Translations = {
    pt: {
      question: "Qual é o horário do evento?",
      answer:
        "Secretariado: 07h30-09h30 (entrega de frontal e registo de saída). Partida: 08h00-10h00. Hora limite de chegada: 17h00. Local: Centro Cultural Recreativo Vilarinho de Baixo, Gandra, Paredes.",
    },
    en: {
      question: "What is the event schedule?",
      answer:
        "Registration desk: 7:30 AM-9:30 AM (front plate pickup and departure check). Departure: 8:00 AM-10:00 AM. Arrival deadline: 5:00 PM. Location: Centro Cultural Recreativo Vilarinho de Baixo, Gandra, Paredes.",
    },
    es: {
      question: "¿Cuál es el horario del evento?",
      answer:
        "Secretaría: 07:30-09:30 (entrega de frontal y registro de salida). Salida: 08:00-10:00. Hora límite de llegada: 17:00. Lugar: Centro Cultural Recreativo Vilarinho de Baixo, Gandra, Paredes.",
    },
    fr: {
      question: "Quel est l'horaire de l'événement ?",
      answer:
        "Secrétariat : 07h30-09h30 (retrait de la plaque frontale et enregistrement de départ). Départ : 08h00-10h00. Heure limite d'arrivée : 17h00. Lieu : Centro Cultural Recreativo Vilarinho de Baixo, Gandra, Paredes.",
    },
    de: {
      question: "Wie ist der Zeitplan des Events?",
      answer:
        "Sekretariat: 07:30-09:30 (Ausgabe der Frontplatte und Startregistrierung). Abfahrt: 08:00-10:00. Ankunftsfrist: 17:00. Ort: Centro Cultural Recreativo Vilarinho de Baixo, Gandra, Paredes.",
    },
    it: {
      question: "Qual è l'orario dell'evento?",
      answer:
        "Segreteria: 07:30-09:30 (ritiro frontale e registrazione partenza). Partenza: 08:00-10:00. Ora limite arrivo: 17:00. Luogo: Centro Cultural Recreativo Vilarinho de Baixo, Gandra, Paredes.",
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
    "Seguro de acidentes pessoais, frontal identificativo e tracks GPS. A inscrição custa €10. Não há mecânico nem carro de apoio no percurso."
  );

  const faq1Translations = {
    pt: {
      question: "O que está incluído na inscrição?",
      answer:
        "Seguro de acidentes pessoais, frontal identificativo e tracks GPS. A inscrição custa €10. Não há mecânico nem carro de apoio no percurso.",
    },
    en: {
      question: "What's included in the registration?",
      answer:
        "Personal accident insurance, identification front plate and GPS tracks. Registration costs €10. No mechanic or support car on the route.",
    },
    es: {
      question: "¿Qué incluye la inscripción?",
      answer:
        "Seguro de accidentes personales, frontal identificativo y tracks GPS. La inscripción cuesta 10 €. No hay mecánico ni coche de apoyo en el recorrido.",
    },
    fr: {
      question: "Qu'est-ce qui est inclus dans l'inscription ?",
      answer:
        "Assurance accidents personnels, plaque frontale d'identification et traces GPS. L'inscription coûte 10 €. Pas de mécanicien ni de voiture d'assistance sur le parcours.",
    },
    de: {
      question: "Was ist in der Anmeldung enthalten?",
      answer:
        "Unfallversicherung, Identifikations-Frontplatte und GPS-Tracks. Anmeldung kostet 10 €. Kein Mechaniker oder Begleitfahrzeug auf der Strecke.",
    },
    it: {
      question: "Cosa è incluso nell'iscrizione?",
      answer:
        "Assicurazione infortuni, piastra frontale identificativa e tracce GPS. L'iscrizione costa 10 €. Nessun meccanico o auto di supporto sul percorso.",
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

  // FAQ 2: Bicycles and equipment
  const faq2 = await findOrCreateFAQ(
    event.id,
    2,
    "Que tipo de bicicleta posso usar? O que é obrigatório?",
    "Qualquer tipo de bicicleta (com ou sem motor). Capacete de ciclismo homologado é obrigatório. O frontal deve ser afixado no guiador em zona bem visível. Recomenda-se levar alimentos, líquidos, ferramentas e material de substituição."
  );

  const faq2Translations = {
    pt: {
      question: "Que tipo de bicicleta posso usar? O que é obrigatório?",
      answer:
        "Qualquer tipo de bicicleta (com ou sem motor). Capacete de ciclismo homologado é obrigatório. O frontal deve ser afixado no guiador em zona bem visível. Recomenda-se levar alimentos, líquidos, ferramentas e material de substituição.",
    },
    en: {
      question: "What type of bicycle can I use? What's mandatory?",
      answer:
        "Any type of bicycle (with or without motor). Certified cycling helmet is mandatory. The front plate must be fixed on the handlebar in a visible spot. It's recommended to bring food, drinks, tools and spare parts.",
    },
    es: {
      question: "¿Qué tipo de bicicleta puedo usar? ¿Qué es obligatorio?",
      answer:
        "Cualquier tipo de bicicleta (con o sin motor). Casco de ciclismo homologado es obligatorio. El frontal debe fijarse en el manillar en zona visible. Se recomienda llevar alimentos, líquidos, herramientas y material de repuesto.",
    },
    fr: {
      question:
        "Quel type de vélo puis-je utiliser ? Qu'est-ce qui est obligatoire ?",
      answer:
        "Tout type de vélo (avec ou sans moteur). Casque de cyclisme homologué obligatoire. La plaque frontale doit être fixée au guidon de manière bien visible. Il est recommandé d'emporter nourriture, boissons, outils et pièces de rechange.",
    },
    de: {
      question: "Welchen Fahrradtyp kann ich verwenden? Was ist Pflicht?",
      answer:
        "Jeder Fahrradtyp (mit oder ohne Motor). Zugelassener Fahrradhelm ist Pflicht. Die Frontplatte muss sichtbar am Lenker befestigt werden. Es wird empfohlen, Essen, Getränke, Werkzeug und Ersatzteile mitzubringen.",
    },
    it: {
      question: "Che tipo di bicicletta posso usare? Cosa è obbligatorio?",
      answer:
        "Qualsiasi tipo di bicicletta (con o senza motore). Casco da ciclismo omologato è obbligatorio. La piastra frontale deve essere fissata al manubrio in zona ben visibile. Si raccomanda di portare alimenti, liquidi, attrezzi e materiale di ricambio.",
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
  console.log("✅ FAQ 2: Bicycles and equipment");

  // FAQ 3: Age and registration
  const faq3 = await findOrCreateFAQ(
    event.id,
    3,
    "Qual a idade mínima e como me inscrevo?",
    "Idade mínima de 14 anos (menores devem ser acompanhados por adulto com autorização escrita). Inscrições em www.portimer.pt. Pagamento em 48 horas ou a inscrição é anulada. O valor (€10) não é reembolsável, apenas são permitidas substituições de inscrição."
  );

  const faq3Translations = {
    pt: {
      question: "Qual a idade mínima e como me inscrevo?",
      answer:
        "Idade mínima de 14 anos (menores devem ser acompanhados por adulto com autorização escrita). Inscrições em www.portimer.pt. Pagamento em 48 horas ou a inscrição é anulada. O valor (€10) não é reembolsável, apenas são permitidas substituições de inscrição.",
    },
    en: {
      question: "What's the minimum age and how do I register?",
      answer:
        "Minimum age 14 years (minors must be accompanied by an adult with written authorization). Registration at www.portimer.pt. Payment within 48 hours or registration is cancelled. The fee (€10) is non-refundable, only registration substitutions are allowed.",
    },
    es: {
      question: "¿Cuál es la edad mínima y cómo me inscribo?",
      answer:
        "Edad mínima de 14 años (menores deben ir acompañados por un adulto con autorización escrita). Inscripciones en www.portimer.pt. Pago en 48 horas o la inscripción se anula. El valor (10 €) no es reembolsable, solo se permiten sustituciones de inscripción.",
    },
    fr: {
      question: "Quel est l'âge minimum et comment m'inscrire ?",
      answer:
        "Âge minimum 14 ans (mineurs accompagnés par un adulte avec autorisation écrite). Inscriptions sur www.portimer.pt. Paiement sous 48 heures ou l'inscription est annulée. Le montant (10 €) n'est pas remboursable, seules les substitutions d'inscription sont autorisées.",
    },
    de: {
      question: "Was ist das Mindestalter und wie melde ich mich an?",
      answer:
        "Mindestalter 14 Jahre (Minderjährige müssen von einem Erwachsenen mit schriftlicher Genehmigung begleitet werden). Anmeldung auf www.portimer.pt. Zahlung innerhalb von 48 Stunden, sonst wird die Anmeldung storniert. Die Gebühr (10 €) wird nicht erstattet, nur Anmeldeübertragungen sind möglich.",
    },
    it: {
      question: "Qual è l'età minima e come mi iscrivo?",
      answer:
        "Età minima 14 anni (minori accompagnati da un adulto con autorizzazione scritta). Iscrizioni su www.portimer.pt. Pagamento entro 48 ore o l'iscrizione viene annullata. L'importo (10 €) non è rimborsabile, sono consentite solo sostituzioni di iscrizione.",
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
  console.log("✅ FAQ 3: Age and registration");

  // FAQ 4: Support and safety
  const faq4 = await findOrCreateFAQ(
    event.id,
    4,
    "Existe apoio mecânico ou carro de apoio?",
    "Não. Não existe mecânico nem carro de apoio no percurso. Em casos de necessidade extrema e sem comprometer a organização, poderá excecionalmente ser feito transporte do participante e bicicleta para o local de chegada. A organização desaconselha a participação a solo."
  );

  const faq4Translations = {
    pt: {
      question: "Existe apoio mecânico ou carro de apoio?",
      answer:
        "Não. Não existe mecânico nem carro de apoio no percurso. Em casos de necessidade extrema e sem comprometer a organização, poderá excecionalmente ser feito transporte do participante e bicicleta para o local de chegada. A organização desaconselha a participação a solo.",
    },
    en: {
      question: "Is there mechanical support or a support car?",
      answer:
        "No. There is no mechanic or support car on the route. In extreme cases and without compromising the organization, transport of the participant and bicycle to the finish may exceptionally be provided. The organization advises against solo participation.",
    },
    es: {
      question: "¿Hay apoyo mecánico o coche de apoyo?",
      answer:
        "No. No hay mecánico ni coche de apoyo en el recorrido. En casos de necesidad extrema y sin comprometer la organización, excepcionalmente se podrá transportar al participante y su bicicleta al lugar de llegada. La organización desaconseja la participación en solitario.",
    },
    fr: {
      question: "Y a-t-il un soutien mécanique ou une voiture d'assistance ?",
      answer:
        "Non. Il n'y a ni mécanicien ni voiture d'assistance sur le parcours. En cas de nécessité extrême et sans compromettre l'organisation, le transport du participant et de son vélo vers l'arrivée pourra exceptionnellement être assuré. L'organisation déconseille la participation en solo.",
    },
    de: {
      question: "Gibt es mechanische Unterstützung oder ein Begleitfahrzeug?",
      answer:
        "Nein. Es gibt keinen Mechaniker oder Begleitfahrzeug auf der Strecke. In extremen Notfällen und ohne die Organisation zu beeinträchtigen, kann ausnahmsweise der Transport des Teilnehmers und seines Fahrrads zum Ziel erfolgen. Die Organisation rät von Einzelteilnahme ab.",
    },
    it: {
      question: "C'è supporto meccanico o auto di supporto?",
      answer:
        "No. Non c'è meccanico né auto di supporto sul percorso. In casi di estrema necessità e senza compromettere l'organizzazione, eccezionalmente potrà essere effettuato il trasporto del partecipante e della bicicletta al luogo di arrivo. L'organizzazione sconsiglia la partecipazione in solitaria.",
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
  console.log("✅ FAQ 4: Support and safety");

  // ──────────────────────────────────────────────
  // Summary
  // ──────────────────────────────────────────────
  console.log(`
✅ Seed completed successfully!

📊 Summary:
- Event: GPS Rota do Romanico – Ases Pedais 2026
- Slug: gps-rota-do-romanico-ases-pedais-2026
- Variants: 1 (Passeio GPS)
- Languages: 6 (pt, en, es, fr, de, it)
- Pricing Phases: 1 (€10)
- FAQs: 5 (with translations in all 6 languages)
- Date: April 5, 2026
- Location: Centro Cultural Recreativo Vilarinho de Baixo, Gandra, Paredes
- Coordinates: 41.183, -8.446
- Organization: Ases Pedais
- Type: Leisure (non-competitive), GPS navigation, full autonomy
- Max participants: 300
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
