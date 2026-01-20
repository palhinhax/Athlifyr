/**
 * Seed IV Trail Praia Mag8 2026
 * Complete with translations in all 6 languages
 * Follows idempotent seed pattern with separate upsert operations
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding IV Trail Praia Mag8 2026...");

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: "iv-trail-praia-mag8-2026" },
    update: {
      title: "IV Trail Praia Mag8",
      description: `## 🏔️ IV Trail Praia Mag8 2026

**A 4ª edição do Trail Praia Mag8**, um evento que alia o convívio, o contacto com a natureza, o espírito de aventura e a prática de exercício físico.

### 🏃 Os Percursos

Percursos circulares totalmente integrados no **Parque Natural Sintra-Cascais**, percorrendo trilhos e caminhos de terra batida junto da costa entre as praias de **Aguda, Magoito, Giribeto e Samarra**, incluindo trilhos integrantes da Grande Rota do Atlântico (GR11-E9).

**4ª prova do Circuito Trail das Freguesias (2ª edição)**`,
      sportTypes: ["TRAIL"],
      startDate: new Date("2026-05-24T09:00:00Z"),
      endDate: new Date("2026-05-24T13:30:00Z"),
      city: "Magoito, Sintra",
      country: "Portugal",
      latitude: 38.8633,
      longitude: -9.4683,
      googleMapsUrl: "https://maps.app.goo.gl/magoito-sintra",
      externalUrl: "https://acorrer.pt/trail-praia-mag8-2026",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-05-14T23:59:59Z"),
    },
    create: {
      slug: "iv-trail-praia-mag8-2026",
      title: "IV Trail Praia Mag8",
      description: `## 🏔️ IV Trail Praia Mag8 2026

**A 4ª edição do Trail Praia Mag8**, um evento que alia o convívio, o contacto com a natureza, o espírito de aventura e a prática de exercício físico.

### 🏃 Os Percursos

Percursos circulares totalmente integrados no **Parque Natural Sintra-Cascais**, percorrendo trilhos e caminhos de terra batida junto da costa entre as praias de **Aguda, Magoito, Giribeto e Samarra**, incluindo trilhos integrantes da Grande Rota do Atlântico (GR11-E9).

**4ª prova do Circuito Trail das Freguesias (2ª edição)**`,
      sportTypes: ["TRAIL"],
      startDate: new Date("2026-05-24T09:00:00Z"),
      endDate: new Date("2026-05-24T13:30:00Z"),
      city: "Magoito, Sintra",
      country: "Portugal",
      latitude: 38.8633,
      longitude: -9.4683,
      googleMapsUrl: "https://maps.app.goo.gl/magoito-sintra",
      externalUrl: "https://acorrer.pt/trail-praia-mag8-2026",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-05-14T23:59:59Z"),
    },
  });

  console.log("✅ Event upserted with ID:", event.id);

  // Step 2: Upsert translations separately (ALL 6 LANGUAGES)
  const translations: Array<{
    language: "pt" | "en" | "es" | "fr" | "de" | "it";
    title: string;
    description: string;
    city: string;
    metaTitle: string;
    metaDescription: string;
  }> = [
    {
      language: "pt",
      title: "IV Trail Praia Mag8",
      description: `## 🏔️ IV Trail Praia Mag8 2026

**A 4ª edição do Trail Praia Mag8**, um evento que alia o convívio, o contacto com a natureza, o espírito de aventura e a prática de exercício físico.

### 🏃 Os Percursos

Percursos circulares totalmente integrados no **Parque Natural Sintra-Cascais**, percorrendo trilhos e caminhos de terra batida junto da costa entre as praias de **Aguda, Magoito, Giribeto e Samarra**, incluindo trilhos integrantes da Grande Rota do Atlântico (GR11-E9).

**4ª prova do Circuito Trail das Freguesias (2ª edição)**`,
      city: "Magoito, Sintra",
      metaTitle: "IV Trail Praia Mag8 2026 - Trail Running em Sintra",
      metaDescription:
        "4ª edição do Trail Praia Mag8 no Parque Natural Sintra-Cascais. 3 distâncias: Sprint 19km, Trail 13km e Caminhada 11km. 24 de maio de 2026. Certificado ATRP.",
    },
    {
      language: "en",
      title: "IV Trail Praia Mag8",
      description: `## 🏔️ IV Trail Praia Mag8 2026

**The 4th edition of Trail Praia Mag8**, an event combining fellowship, contact with nature, adventure spirit and physical exercise.

### 🏃 The Routes

Circular routes fully integrated in **Sintra-Cascais Natural Park**, running along trails and dirt paths near the coast between **Aguda, Magoito, Giribeto and Samarra beaches**, including sections of the Atlantic Great Route (GR11-E9).

**4th race of the Trail das Freguesias Circuit (2nd edition)**`,
      city: "Magoito, Sintra",
      metaTitle: "IV Trail Praia Mag8 2026 - Sintra Trail Running",
      metaDescription:
        "4th edition of Trail Praia Mag8 in Sintra-Cascais Natural Park. 3 distances: Sprint 19km, Trail 13km, and Walk 11km. May 24, 2026. ATRP certified.",
    },
    {
      language: "es",
      title: "IV Trail Praia Mag8",
      description: `## 🏔️ IV Trail Praia Mag8 2026

**La 4ª edición del Trail Praia Mag8**, un evento que combina convivencia, contacto con la naturaleza, espíritu de aventura y ejercicio físico.

### 🏃 Los Recorridos

Recorridos circulares totalmente integrados en el **Parque Natural Sintra-Cascais**, recorriendo senderos y caminos de tierra junto a la costa entre las playas de **Aguda, Magoito, Giribeto y Samarra**, incluyendo tramos de la Gran Ruta del Atlántico (GR11-E9).

**4ª prueba del Circuito Trail das Freguesias (2ª edición)**`,
      city: "Magoito, Sintra",
      metaTitle: "IV Trail Praia Mag8 2026 - Trail Running Sintra",
      metaDescription:
        "4ª edición del Trail Praia Mag8 en el Parque Natural Sintra-Cascais. 3 distancias: Sprint 19km, Trail 13km y Caminata 11km. 24 mayo 2026. ATRP.",
    },
    {
      language: "fr",
      title: "IV Trail Praia Mag8",
      description: `## 🏔️ IV Trail Praia Mag8 2026

**La 4ème édition du Trail Praia Mag8**, un événement alliant convivialité, contact avec la nature, esprit d'aventure et exercice physique.

### 🏃 Les Parcours

Parcours circulaires entièrement intégrés dans le **Parc Naturel de Sintra-Cascais**, parcourant sentiers et chemins de terre le long de la côte entre les plages d'**Aguda, Magoito, Giribeto et Samarra**, incluant des tronçons de la Grande Route de l'Atlantique (GR11-E9).

**4ème course du Circuit Trail das Freguesias (2ème édition)**`,
      city: "Magoito, Sintra",
      metaTitle: "IV Trail Praia Mag8 2026 - Trail Running Sintra",
      metaDescription:
        "4ème édition du Trail Praia Mag8 au Parc Naturel Sintra-Cascais. 3 distances: Sprint 19km, Trail 13km et Randonnée 11km. 24 mai 2026. ATRP.",
    },
    {
      language: "de",
      title: "IV Trail Praia Mag8",
      description: `## 🏔️ IV Trail Praia Mag8 2026

**Die 4. Ausgabe des Trail Praia Mag8**, eine Veranstaltung, die Geselligkeit, Kontakt mit der Natur, Abenteuergeist und körperliche Bewegung vereint.

### 🏃 Die Strecken

Rundwege vollständig im **Naturpark Sintra-Cascais** integriert, entlang von Pfaden und Feldwegen an der Küste zwischen den Stränden **Aguda, Magoito, Giribeto und Samarra**, einschließlich Abschnitte der Großen Atlantikroute (GR11-E9).

**4. Rennen des Trail das Freguesias Circuit (2. Ausgabe)**`,
      city: "Magoito, Sintra",
      metaTitle: "IV Trail Praia Mag8 2026 - Trail Running Sintra",
      metaDescription:
        "4. Ausgabe Trail Praia Mag8 im Naturpark Sintra-Cascais. 3 Distanzen: Sprint 19km, Trail 13km, Wanderung 11km. 24. Mai 2026. ATRP.",
    },
    {
      language: "it",
      title: "IV Trail Praia Mag8",
      description: `## 🏔️ IV Trail Praia Mag8 2026

**La 4ª edizione del Trail Praia Mag8**, un evento che unisce convivialità, contatto con la natura, spirito d'avventura ed esercizio fisico.

### 🏃 I Percorsi

Percorsi circolari completamente integrati nel **Parco Naturale di Sintra-Cascais**, percorrendo sentieri e strade sterrate lungo la costa tra le spiagge di **Aguda, Magoito, Giribeto e Samarra**, inclusi tratti della Grande Rotta Atlantica (GR11-E9).

**4ª gara del Circuito Trail das Freguesias (2ª edizione)**`,
      city: "Magoito, Sintra",
      metaTitle: "IV Trail Praia Mag8 2026 - Trail Running Sintra",
      metaDescription:
        "4ª edizione Trail Praia Mag8 nel Parco Naturale Sintra-Cascais. 3 distanze: Sprint 19km, Trail 13km, Camminata 11km. 24 maggio 2026. ATRP.",
    },
  ];

  for (const translation of translations) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: translation.language,
        },
      },
      update: translation,
      create: {
        eventId: event.id,
        ...translation,
      },
    });
  }

  console.log(
    "📝 Translations upserted for 6 languages (pt, en, es, fr, de, it)"
  );

  // Step 3: Upsert variants separately
  // Note: EventVariant doesn't have a unique constraint or slug field, so we use findFirst + update/create by id
  const variantData = [
    {
      name: "TPMk19 - Trail Sprint K19",
      distanceKm: 19,
      startDate: new Date("2026-05-24T09:30:00Z"),
      startTime: "09:30",
      elevationGainM: 530,
      elevationLossM: 530,
      cutoffTimeHours: 4.0,
      maxParticipants: 500,
      atrpGrade: 1,
      description:
        "Percurso circular dirigido a atletas que pretendem passar das distâncias curtas para distâncias maiores. Partida da Praia do Magoito, seguindo para norte pelo passadiço, zonas de pinhal, praia do Giribeto, regresso pela arriba, cascata, trilhos junto às vinhas da encosta de Fontanelas e Gouveia, praia da Aguda, e trilhos do GR11-E9 com chegada vertiginosa pela arriba. Grau ATRP: 1.",
    },
    {
      name: "TPMk13 - Trail K13",
      distanceKm: 13,
      startDate: new Date("2026-05-24T09:45:00Z"),
      startTime: "09:45",
      elevationGainM: 400,
      elevationLossM: 400,
      cutoffTimeHours: 2.5,
      maxParticipants: 500,
      atrpGrade: 2,
      description:
        "Percurso circular dirigido a atletas iniciados na modalidade ou que pretendem corrida rápida. Partida da Praia do Magoito, seguindo para norte pelo passadiço, zonas de pinhal, praia do Giribeto, regresso pela arriba, cascata, pomares e vinhas em Fontanelas, trilhos a sul da praia do Magoito, GR11-E9 e chegada vertiginosa pela arriba. Grau ATRP: 2.",
    },
    {
      name: "Caminhada K11",
      distanceKm: 11,
      startDate: new Date("2026-05-24T10:00:00Z"),
      startTime: "10:00",
      elevationGainM: 300,
      elevationLossM: 300,
      cutoffTimeHours: null,
      maxParticipants: 120,
      atrpGrade: null,
      description:
        "Caminhada aberta a todas as idades, incluindo menores acompanhados. Percurso circular pela Praia do Magoito, passadiço para norte, zonas de pinhal, praia do Giribeto, regresso pela arriba, cascata, pomares e vinhas em Fontanelas, marco geodésico com vista sobre o Atlântico, e estradão de acesso à praia do Magoito.",
    },
  ];

  const variants = [];
  for (const data of variantData) {
    // Find existing variant by eventId + name
    const existing = await prisma.eventVariant.findFirst({
      where: {
        eventId: event.id,
        name: data.name,
      },
    });

    let variant;
    if (existing) {
      // Update existing variant
      variant = await prisma.eventVariant.update({
        where: { id: existing.id },
        data: data,
      });
    } else {
      // Create new variant
      variant = await prisma.eventVariant.create({
        data: {
          eventId: event.id,
          ...data,
        },
      });
    }
    variants.push(variant);
  }

  console.log("🏃 Variants upserted:", variants.length);

  // Step 4: Upsert variant translations separately (ALL 6 languages for each variant)
  const variantTranslations: Array<{
    variantId: string;
    language: "pt" | "en" | "es" | "fr" | "de" | "it";
    name: string;
    description: string;
  }> = [
    // TPMk19 translations
    {
      variantId: variants[0].id,
      language: "pt",
      name: "TPMk19 - Trail Sprint K19",
      description:
        "Percurso circular dirigido a atletas que pretendem passar das distâncias curtas para distâncias maiores. Grau ATRP: 1.",
    },
    {
      variantId: variants[0].id,
      language: "en",
      name: "TPMk19 - Trail Sprint K19",
      description:
        "Circular route for athletes looking to progress from short to longer distances. ATRP Grade: 1.",
    },
    {
      variantId: variants[0].id,
      language: "es",
      name: "TPMk19 - Trail Sprint K19",
      description:
        "Recorrido circular dirigido a atletas que quieren pasar de distancias cortas a mayores. Grado ATRP: 1.",
    },
    {
      variantId: variants[0].id,
      language: "fr",
      name: "TPMk19 - Trail Sprint K19",
      description:
        "Parcours circulaire pour athlètes souhaitant passer des courtes aux longues distances. Grade ATRP: 1.",
    },
    {
      variantId: variants[0].id,
      language: "de",
      name: "TPMk19 - Trail Sprint K19",
      description:
        "Rundweg für Athleten, die von kurzen zu längeren Distanzen übergehen möchten. ATRP-Grad: 1.",
    },
    {
      variantId: variants[0].id,
      language: "it",
      name: "TPMk19 - Trail Sprint K19",
      description:
        "Percorso circolare per atleti che vogliono passare da distanze brevi a maggiori. Grado ATRP: 1.",
    },
    // TPMk13 translations
    {
      variantId: variants[1].id,
      language: "pt",
      name: "TPMk13 - Trail K13",
      description:
        "Percurso circular dirigido a atletas iniciados na modalidade ou que pretendem corrida rápida. Grau ATRP: 2.",
    },
    {
      variantId: variants[1].id,
      language: "en",
      name: "TPMk13 - Trail K13",
      description:
        "Circular route for beginners or those seeking a fast race. ATRP Grade: 2.",
    },
    {
      variantId: variants[1].id,
      language: "es",
      name: "TPMk13 - Trail K13",
      description:
        "Recorrido circular para atletas iniciados o que buscan carrera rápida. Grado ATRP: 2.",
    },
    {
      variantId: variants[1].id,
      language: "fr",
      name: "TPMk13 - Trail K13",
      description:
        "Parcours circulaire pour débutants ou ceux cherchant une course rapide. Grade ATRP: 2.",
    },
    {
      variantId: variants[1].id,
      language: "de",
      name: "TPMk13 - Trail K13",
      description:
        "Rundweg für Anfänger oder jene, die ein schnelles Rennen suchen. ATRP-Grad: 2.",
    },
    {
      variantId: variants[1].id,
      language: "it",
      name: "TPMk13 - Trail K13",
      description:
        "Percorso circolare per principianti o chi cerca una corsa veloce. Grado ATRP: 2.",
    },
    // Caminhada K11 translations
    {
      variantId: variants[2].id,
      language: "pt",
      name: "Caminhada K11",
      description:
        "Caminhada aberta a todas as idades, incluindo menores acompanhados.",
    },
    {
      variantId: variants[2].id,
      language: "en",
      name: "Walk K11",
      description: "Walk open to all ages, including accompanied minors.",
    },
    {
      variantId: variants[2].id,
      language: "es",
      name: "Caminata K11",
      description:
        "Caminata abierta a todas las edades, incluyendo menores acompañados.",
    },
    {
      variantId: variants[2].id,
      language: "fr",
      name: "Randonnée K11",
      description:
        "Randonnée ouverte à tous les âges, y compris les mineurs accompagnés.",
    },
    {
      variantId: variants[2].id,
      language: "de",
      name: "Wanderung K11",
      description:
        "Wanderung für alle Altersgruppen, einschließlich begleiteter Minderjähriger.",
    },
    {
      variantId: variants[2].id,
      language: "it",
      name: "Camminata K11",
      description:
        "Camminata aperta a tutte le età, compresi i minori accompagnati.",
    },
  ];

  for (const translation of variantTranslations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: translation.variantId,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: translation,
    });
  }

  console.log("📝 Variant translations upserted for all variants");

  // Step 5: Upsert pricing phases separately
  // Note: PricingPhase doesn't have a unique constraint, so we use findFirst + upsert
  const pricingPhases: Array<{
    name: string;
    price: number;
    currency: "EUR";
    startDate: Date;
    endDate: Date;
    note: string;
  }> = [
    {
      name: "1ª Fase (Early Bird) - TPMk19",
      price: 15.0,
      currency: "EUR",
      startDate: new Date("2025-11-01T00:00:00Z"),
      endDate: new Date("2026-02-28T23:59:59Z"),
      note: "Inscrição antecipada até 28.02.2026 para TPMk19. Inclui gola.",
    },
    {
      name: "1ª Fase (Early Bird) - TPMk13",
      price: 13.0,
      currency: "EUR",
      startDate: new Date("2025-11-01T00:00:00Z"),
      endDate: new Date("2026-02-28T23:59:59Z"),
      note: "Inscrição antecipada até 28.02.2026 para TPMk13. Inclui gola.",
    },
    {
      name: "1ª Fase (Early Bird) - Caminhada",
      price: 11.0,
      currency: "EUR",
      startDate: new Date("2025-11-01T00:00:00Z"),
      endDate: new Date("2026-02-28T23:59:59Z"),
      note: "Inscrição antecipada até 28.02.2026 para Caminhada K11. Inclui gola.",
    },
    {
      name: "2ª Fase - TPMk19",
      price: 17.0,
      currency: "EUR",
      startDate: new Date("2026-03-01T00:00:00Z"),
      endDate: new Date("2026-05-14T23:59:59Z"),
      note: "Inscrição normal de 01.03 a 14.05.2026 para TPMk19.",
    },
    {
      name: "2ª Fase - TPMk13",
      price: 15.0,
      currency: "EUR",
      startDate: new Date("2026-03-01T00:00:00Z"),
      endDate: new Date("2026-05-14T23:59:59Z"),
      note: "Inscrição normal de 01.03 a 14.05.2026 para TPMk13.",
    },
    {
      name: "2ª Fase - Caminhada",
      price: 12.0,
      currency: "EUR",
      startDate: new Date("2026-03-01T00:00:00Z"),
      endDate: new Date("2026-05-14T23:59:59Z"),
      note: "Inscrição normal de 01.03 a 14.05.2026 para Caminhada K11.",
    },
    {
      name: "T-shirt Técnica (Opcional)",
      price: 3.5,
      currency: "EUR",
      startDate: new Date("2025-11-01T00:00:00Z"),
      endDate: new Date("2026-05-14T23:59:59Z"),
      note: "T-shirt técnica cor cinza alusiva ao evento (opcional para todas as variantes).",
    },
    {
      name: "Refeição - Bifana",
      price: 4.5,
      currency: "EUR",
      startDate: new Date("2025-11-01T00:00:00Z"),
      endDate: new Date("2026-05-14T23:59:59Z"),
      note: "Bifana no pão + bebida a copo (opcional para participantes).",
    },
    {
      name: "Refeição - Sandes Atum",
      price: 4.5,
      currency: "EUR",
      startDate: new Date("2025-11-01T00:00:00Z"),
      endDate: new Date("2026-05-14T23:59:59Z"),
      note: "Sandes pasta de atum + bebida a copo (opcional para participantes).",
    },
    {
      name: "Refeição Acompanhante",
      price: 4.5,
      currency: "EUR",
      startDate: new Date("2025-11-01T00:00:00Z"),
      endDate: new Date("2026-05-14T23:59:59Z"),
      note: "Refeição para acompanhantes (bifana ou sandes atum).",
    },
  ];

  for (const phase of pricingPhases) {
    // Find existing pricing phase by eventId + name
    const existing = await prisma.pricingPhase.findFirst({
      where: {
        eventId: event.id,
        name: phase.name,
      },
    });

    if (existing) {
      // Update existing pricing phase
      await prisma.pricingPhase.update({
        where: { id: existing.id },
        data: phase,
      });
    } else {
      // Create new pricing phase
      await prisma.pricingPhase.create({
        data: {
          eventId: event.id,
          ...phase,
        },
      });
    }
  }

  console.log("💰 Pricing phases upserted:", pricingPhases.length);
  console.log("\n✅ IV Trail Praia Mag8 2026 upserted successfully!");
  console.log(`   Event ID: ${event.id}`);
  console.log(`   Slug: ${event.slug}`);
  console.log(`   Date: ${event.startDate.toLocaleDateString("pt-PT")}`);
  console.log(`   Location: ${event.city}, ${event.country}`);
  console.log(
    `   Variants: ${variants.length} (Sprint 19km, Trail 13km, Caminhada 11km)`
  );
  console.log(`   Pricing phases: ${pricingPhases.length}`);
  console.log(`   Translations: 6 languages (pt, en, es, fr, de, it)`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding IV Trail Praia Mag8 2026:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
