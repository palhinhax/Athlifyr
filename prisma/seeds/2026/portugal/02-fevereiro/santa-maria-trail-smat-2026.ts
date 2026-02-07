/**
 * Seed: Santa Maria Trail - SMAT 2026
 *
 * Event Details:
 * - Date: February 7, 2026
 * - Location: Vila do Porto, Santa Maria Island, Azores, Portugal
 * - Variants: Trail Longo (35km), Trail Curto (20km), Mini Trail (10km), Trail Kids (7km), Caminhada (10km)
 * - Organizer: Secção de Trail Running da Casa do Povo de São Pedro
 * - Website: https://stopandgo.pt
 *
 * ATRP Certified Event
 *
 * Instructions:
 * Run with: npx ts-node prisma/seeds/2026/portugal/02-fevereiro/santa-maria-trail-smat-2026.ts
 */

import { PrismaClient, SportType, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Santa Maria Trail - SMAT 2026...");

  const eventSlug = "santa-maria-trail-smat-2026";

  // Check if event already exists
  const existingEvent = await prisma.event.findUnique({
    where: { slug: eventSlug },
  });

  if (existingEvent) {
    console.log("⚠️ Event already exists, updating...");
    await prisma.event.delete({ where: { slug: eventSlug } });
  }

  // Translations for all 6 languages
  const translations = {
    pt: {
      title: "Santa Maria Trail - SMAT 2026",
      description: `O **Santa Maria Trail - SMAT 2026** é um evento de Trail Running certificado pela ATRP, organizado pela Secção de Trail Running da Casa do Povo de São Pedro, que percorre trilhos, caminhos agrícolas e florestais e linhas de água do concelho de Vila do Porto, na Ilha de Santa Maria, Açores.

## 🏝️ Uma Experiência Única nos Açores

A ilha de Santa Maria, a mais antiga e oriental do arquipélago dos Açores, oferece paisagens únicas com os seus trilhos que atravessam vales verdejantes, falésias impressionantes e praias de areia dourada.

## 🏃 Provas Disponíveis

- **SMAT35 - Trail Longo**: 35km com D+1820m - O desafio máximo pelos trilhos mais exigentes da ilha
- **SMAT20 - Trail Curto**: 20km com D+900m - Percurso técnico ideal para atletas experientes
- **SMAT10 - Mini Trail**: 10km com D+240m - Prova competitiva para quem se inicia na modalidade
- **Trail Kids**: 7km com D+100m - Para jovens atletas dos 8 aos 15 anos
- **Caminhada SMAT**: 10km - Passeio pedestre sem carácter competitivo

## ⏱️ Tempos Limite

- Trail Longo: 7 horas
- Trail Curto: 5 horas
- Mini Trail: 4 horas
- Caminhada: 5 horas

## 📍 Logística

- **Secretariado**: Igreja de Nossa Senhora da Vitória, Câmara Municipal de Vila do Porto
- **Briefing**: 6 de fevereiro às 20:30
- **Transferes**: Incluídos da Praça do Município para partidas e chegadas

## 🎁 Inclui

- Seguro de Acidentes Pessoais e Responsabilidade Civil
- Dorsal e chip de cronometragem
- T-shirt oficial do evento
- Abastecimentos sólidos e líquidos
- Lembrança finisher
- Refeição convívio

Vem descobrir os trilhos mágicos de Santa Maria! 🌊🏔️`,
      city: "Vila do Porto",
      metaTitle:
        "Santa Maria Trail - SMAT 2026 | Vila do Porto, Açores | 7 Fevereiro",
      metaDescription:
        "Santa Maria Trail - SMAT 2026 a 7 de fevereiro em Vila do Porto, Açores. Provas: Trail Longo 35km, Trail Curto 20km, Mini Trail 10km, Trail Kids 7km e Caminhada 10km. Evento certificado ATRP.",
    },
    en: {
      title: "Santa Maria Trail - SMAT 2026",
      description: `**Santa Maria Trail - SMAT 2026** is an ATRP-certified Trail Running event, organized by the Trail Running Section of Casa do Povo de São Pedro, traversing trails, agricultural and forest paths, and waterways in Vila do Porto municipality, on Santa Maria Island, Azores.

## 🏝️ A Unique Experience in the Azores

Santa Maria Island, the oldest and easternmost of the Azores archipelago, offers unique landscapes with its trails crossing verdant valleys, impressive cliffs, and golden sand beaches.

## 🏃 Available Races

- **SMAT35 - Long Trail**: 35km with D+1820m - The ultimate challenge through the island's most demanding trails
- **SMAT20 - Short Trail**: 20km with D+900m - Technical course ideal for experienced athletes
- **SMAT10 - Mini Trail**: 10km with D+240m - Competitive race for beginners in the sport
- **Trail Kids**: 7km with D+100m - For young athletes aged 8 to 15
- **SMAT Walk**: 10km - Non-competitive hiking experience

## ⏱️ Time Limits

- Long Trail: 7 hours
- Short Trail: 5 hours
- Mini Trail: 4 hours
- Walk: 5 hours

## 📍 Logistics

- **Registration**: Nossa Senhora da Vitória Church, Vila do Porto Town Hall
- **Briefing**: February 6 at 8:30 PM
- **Transfers**: Included from Municipality Square to start/finish areas

## 🎁 Included

- Personal Accident and Civil Liability Insurance
- Race bib and timing chip
- Official event t-shirt
- Solid and liquid refreshments
- Finisher memento
- Post-race meal

Come discover the magical trails of Santa Maria! 🌊🏔️`,
      city: "Vila do Porto",
      metaTitle:
        "Santa Maria Trail - SMAT 2026 | Vila do Porto, Azores | February 7",
      metaDescription:
        "Santa Maria Trail - SMAT 2026 on February 7 in Vila do Porto, Azores. Races: Long Trail 35km, Short Trail 20km, Mini Trail 10km, Trail Kids 7km and Walk 10km. ATRP certified event.",
    },
    es: {
      title: "Santa Maria Trail - SMAT 2026",
      description: `**Santa Maria Trail - SMAT 2026** es un evento de Trail Running certificado por la ATRP, organizado por la Sección de Trail Running de la Casa do Povo de São Pedro, que recorre senderos, caminos agrícolas y forestales y cursos de agua del municipio de Vila do Porto, en la Isla de Santa María, Azores.

## 🏝️ Una Experiencia Única en las Azores

La isla de Santa María, la más antigua y oriental del archipiélago de las Azores, ofrece paisajes únicos con sus senderos que atraviesan valles verdes, impresionantes acantilados y playas de arena dorada.

## 🏃 Pruebas Disponibles

- **SMAT35 - Trail Largo**: 35km con D+1820m - El desafío máximo por los senderos más exigentes de la isla
- **SMAT20 - Trail Corto**: 20km con D+900m - Recorrido técnico ideal para atletas experimentados
- **SMAT10 - Mini Trail**: 10km con D+240m - Prueba competitiva para quienes se inician en la modalidad
- **Trail Kids**: 7km con D+100m - Para jóvenes atletas de 8 a 15 años
- **Caminata SMAT**: 10km - Paseo a pie sin carácter competitivo

## ⏱️ Tiempos Límite

- Trail Largo: 7 horas
- Trail Corto: 5 horas
- Mini Trail: 4 horas
- Caminata: 5 horas

## 🎁 Incluye

- Seguro de Accidentes Personales y Responsabilidad Civil
- Dorsal y chip de cronometraje
- Camiseta oficial del evento
- Avituallamientos sólidos y líquidos
- Recuerdo finisher
- Comida de confraternización

¡Ven a descubrir los senderos mágicos de Santa María! 🌊🏔️`,
      city: "Vila do Porto",
      metaTitle:
        "Santa Maria Trail - SMAT 2026 | Vila do Porto, Azores | 7 Febrero",
      metaDescription:
        "Santa Maria Trail - SMAT 2026 el 7 de febrero en Vila do Porto, Azores. Pruebas: Trail Largo 35km, Trail Corto 20km, Mini Trail 10km, Trail Kids 7km y Caminata 10km. Evento certificado ATRP.",
    },
    fr: {
      title: "Santa Maria Trail - SMAT 2026",
      description: `**Santa Maria Trail - SMAT 2026** est un événement de Trail Running certifié par l'ATRP, organisé par la Section Trail Running de la Casa do Povo de São Pedro, parcourant sentiers, chemins agricoles et forestiers et cours d'eau de la commune de Vila do Porto, sur l'île de Santa Maria, Açores.

## 🏝️ Une Expérience Unique aux Açores

L'île de Santa Maria, la plus ancienne et la plus orientale de l'archipel des Açores, offre des paysages uniques avec ses sentiers traversant des vallées verdoyantes, des falaises impressionnantes et des plages de sable doré.

## 🏃 Épreuves Disponibles

- **SMAT35 - Trail Long**: 35km avec D+1820m - Le défi ultime sur les sentiers les plus exigeants de l'île
- **SMAT20 - Trail Court**: 20km avec D+900m - Parcours technique idéal pour les athlètes expérimentés
- **SMAT10 - Mini Trail**: 10km avec D+240m - Épreuve compétitive pour les débutants
- **Trail Kids**: 7km avec D+100m - Pour les jeunes athlètes de 8 à 15 ans
- **Randonnée SMAT**: 10km - Balade pédestre non compétitive

## ⏱️ Temps Limites

- Trail Long: 7 heures
- Trail Court: 5 heures
- Mini Trail: 4 heures
- Randonnée: 5 heures

## 🎁 Inclus

- Assurance Accidents Personnels et Responsabilité Civile
- Dossard et puce de chronométrage
- T-shirt officiel de l'événement
- Ravitaillements solides et liquides
- Souvenir finisher
- Repas de convivialité

Venez découvrir les sentiers magiques de Santa Maria! 🌊🏔️`,
      city: "Vila do Porto",
      metaTitle:
        "Santa Maria Trail - SMAT 2026 | Vila do Porto, Açores | 7 Février",
      metaDescription:
        "Santa Maria Trail - SMAT 2026 le 7 février à Vila do Porto, Açores. Épreuves: Trail Long 35km, Trail Court 20km, Mini Trail 10km, Trail Kids 7km et Randonnée 10km. Événement certifié ATRP.",
    },
    de: {
      title: "Santa Maria Trail - SMAT 2026",
      description: `**Santa Maria Trail - SMAT 2026** ist eine von der ATRP zertifizierte Trail-Running-Veranstaltung, organisiert von der Trail Running Sektion der Casa do Povo de São Pedro, die Pfade, landwirtschaftliche und forstwirtschaftliche Wege sowie Wasserläufe der Gemeinde Vila do Porto auf der Insel Santa Maria, Azoren, durchquert.

## 🏝️ Ein Einzigartiges Erlebnis auf den Azoren

Die Insel Santa Maria, die älteste und östlichste des Azoren-Archipels, bietet einzigartige Landschaften mit Pfaden durch grüne Täler, beeindruckende Klippen und goldene Sandstrände.

## 🏃 Verfügbare Rennen

- **SMAT35 - Langer Trail**: 35km mit D+1820m - Die ultimative Herausforderung auf den anspruchsvollsten Pfaden der Insel
- **SMAT20 - Kurzer Trail**: 20km mit D+900m - Technische Strecke ideal für erfahrene Athleten
- **SMAT10 - Mini Trail**: 10km mit D+240m - Wettkampfrennen für Einsteiger
- **Trail Kids**: 7km mit D+100m - Für junge Athleten von 8 bis 15 Jahren
- **SMAT Wanderung**: 10km - Nicht-kompetitive Wanderung

## ⏱️ Zeitlimits

- Langer Trail: 7 Stunden
- Kurzer Trail: 5 Stunden
- Mini Trail: 4 Stunden
- Wanderung: 5 Stunden

## 🎁 Inklusive

- Personen- und Haftpflichtversicherung
- Startnummer und Zeitchip
- Offizielles Event-T-Shirt
- Feste und flüssige Verpflegung
- Finisher-Andenken
- Gesellschaftsessen

Entdecken Sie die magischen Pfade von Santa Maria! 🌊🏔️`,
      city: "Vila do Porto",
      metaTitle:
        "Santa Maria Trail - SMAT 2026 | Vila do Porto, Azoren | 7. Februar",
      metaDescription:
        "Santa Maria Trail - SMAT 2026 am 7. Februar in Vila do Porto, Azoren. Rennen: Langer Trail 35km, Kurzer Trail 20km, Mini Trail 10km, Trail Kids 7km und Wanderung 10km. ATRP-zertifizierte Veranstaltung.",
    },
    it: {
      title: "Santa Maria Trail - SMAT 2026",
      description: `**Santa Maria Trail - SMAT 2026** è un evento di Trail Running certificato dall'ATRP, organizzato dalla Sezione Trail Running della Casa do Povo de São Pedro, che percorre sentieri, strade agricole e forestali e corsi d'acqua del comune di Vila do Porto, sull'Isola di Santa Maria, Azzorre.

## 🏝️ Un'Esperienza Unica nelle Azzorre

L'isola di Santa Maria, la più antica e orientale dell'arcipelago delle Azzorre, offre paesaggi unici con i suoi sentieri che attraversano valli verdeggianti, scogliere impressionanti e spiagge di sabbia dorata.

## 🏃 Gare Disponibili

- **SMAT35 - Trail Lungo**: 35km con D+1820m - La sfida massima sui sentieri più impegnativi dell'isola
- **SMAT20 - Trail Corto**: 20km con D+900m - Percorso tecnico ideale per atleti esperti
- **SMAT10 - Mini Trail**: 10km con D+240m - Gara competitiva per principianti
- **Trail Kids**: 7km con D+100m - Per giovani atleti dagli 8 ai 15 anni
- **Camminata SMAT**: 10km - Passeggiata non competitiva

## ⏱️ Tempi Limite

- Trail Lungo: 7 ore
- Trail Corto: 5 ore
- Mini Trail: 4 ore
- Camminata: 5 ore

## 🎁 Include

- Assicurazione Infortuni e Responsabilità Civile
- Pettorale e chip di cronometraggio
- T-shirt ufficiale dell'evento
- Ristori solidi e liquidi
- Ricordo finisher
- Pranzo conviviale

Vieni a scoprire i sentieri magici di Santa Maria! 🌊🏔️`,
      city: "Vila do Porto",
      metaTitle:
        "Santa Maria Trail - SMAT 2026 | Vila do Porto, Azzorre | 7 Febbraio",
      metaDescription:
        "Santa Maria Trail - SMAT 2026 il 7 febbraio a Vila do Porto, Azzorre. Gare: Trail Lungo 35km, Trail Corto 20km, Mini Trail 10km, Trail Kids 7km e Camminata 10km. Evento certificato ATRP.",
    },
  };

  // Create the event
  const event = await prisma.event.create({
    data: {
      slug: eventSlug,
      title: translations.pt.title,
      description: translations.pt.description,
      startDate: new Date("2026-02-07T08:00:00.000Z"),
      endDate: new Date("2026-02-07T20:00:00.000Z"),
      city: translations.pt.city,
      country: "Portugal",
      latitude: 36.953078,
      longitude: -25.143132,
      imageUrl:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=630&fit=crop",
      externalUrl: "https://stopandgo.pt",
      googleMapsUrl: "https://maps.app.goo.gl/76ut2vKt5V7omBoA8",
      isFeatured: false,
      sportTypes: [SportType.TRAIL, SportType.WALKING],
      registrationDeadline: new Date("2026-01-25T23:59:59.000Z"),
    },
  });

  console.log(`✅ Created event: ${event.title}`);

  // Create translations
  const languages = ["pt", "en", "es", "fr", "de", "it"] as const;
  for (const lang of languages) {
    await prisma.eventTranslation.upsert({
      where: { eventId_language: { eventId: event.id, language: lang } },
      update: {
        title: translations[lang].title,
        description: translations[lang].description,
        city: translations[lang].city,
        metaTitle: translations[lang].metaTitle,
        metaDescription: translations[lang].metaDescription,
      },
      create: {
        eventId: event.id,
        language: lang,
        title: translations[lang].title,
        description: translations[lang].description,
        city: translations[lang].city,
        metaTitle: translations[lang].metaTitle,
        metaDescription: translations[lang].metaDescription,
      },
    });
  }

  console.log("✅ Created translations for all 6 languages");

  // Create variants
  const variants = [
    {
      name: "SMAT35 - Trail Longo",
      description:
        "Trail Longo - Prova principal com 35km pelos trilhos mais exigentes de Santa Maria",
      distanceKm: 35,
      elevationGainM: 1820,
      elevationLossM: 1826,
      startDate: new Date("2026-02-07T08:00:00.000Z"),
      startTime: "08:00",
      cutoffTimeHours: 7,
      price: 45,
      currency: Currency.EUR,
      maxParticipants: 100,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-09-12T00:00:00.000Z"),
          endDate: new Date("2025-10-12T23:59:59.000Z"),
          price: 35,
          currency: Currency.EUR,
        },
        {
          name: "2ª Fase",
          startDate: new Date("2025-10-13T00:00:00.000Z"),
          endDate: new Date("2025-12-25T23:59:59.000Z"),
          price: 40,
          currency: Currency.EUR,
        },
        {
          name: "3ª Fase",
          startDate: new Date("2025-12-26T00:00:00.000Z"),
          endDate: new Date("2026-01-25T23:59:59.000Z"),
          price: 45,
          currency: Currency.EUR,
        },
      ],
    },
    {
      name: "SMAT20 - Trail Curto",
      description:
        "Trail Curto - Percurso técnico de 20km ideal para atletas experientes",
      distanceKm: 20,
      elevationGainM: 900,
      startDate: new Date("2026-02-07T09:00:00.000Z"),
      startTime: "09:00",
      cutoffTimeHours: 5,
      price: 35,
      currency: Currency.EUR,
      maxParticipants: 200,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-09-12T00:00:00.000Z"),
          endDate: new Date("2025-10-12T23:59:59.000Z"),
          price: 25,
          currency: Currency.EUR,
        },
        {
          name: "2ª Fase",
          startDate: new Date("2025-10-13T00:00:00.000Z"),
          endDate: new Date("2025-12-25T23:59:59.000Z"),
          price: 30,
          currency: Currency.EUR,
        },
        {
          name: "3ª Fase",
          startDate: new Date("2025-12-26T00:00:00.000Z"),
          endDate: new Date("2026-01-25T23:59:59.000Z"),
          price: 35,
          currency: Currency.EUR,
        },
      ],
    },
    {
      name: "SMAT10 - Mini Trail",
      description:
        "Mini Trail - Prova competitiva de 10km para quem se inicia na modalidade",
      distanceKm: 10,
      elevationGainM: 240,
      startDate: new Date("2026-02-07T10:00:00.000Z"),
      startTime: "10:00",
      cutoffTimeHours: 4,
      price: 25,
      currency: Currency.EUR,
      maxParticipants: 100,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-09-12T00:00:00.000Z"),
          endDate: new Date("2025-10-12T23:59:59.000Z"),
          price: 15,
          currency: Currency.EUR,
        },
        {
          name: "2ª Fase",
          startDate: new Date("2025-10-13T00:00:00.000Z"),
          endDate: new Date("2025-12-25T23:59:59.000Z"),
          price: 20,
          currency: Currency.EUR,
        },
        {
          name: "3ª Fase",
          startDate: new Date("2025-12-26T00:00:00.000Z"),
          endDate: new Date("2026-01-25T23:59:59.000Z"),
          price: 25,
          currency: Currency.EUR,
        },
      ],
    },
    {
      name: "Trail Kids",
      description: "Trail Kids - Prova para jovens atletas dos 8 aos 15 anos",
      distanceKm: 7,
      elevationGainM: 100,
      startDate: new Date("2026-02-07T11:00:00.000Z"),
      startTime: "11:00",
      price: 5,
      currency: Currency.EUR,
      pricingPhases: [
        {
          name: "Preço Único",
          startDate: new Date("2025-09-12T00:00:00.000Z"),
          endDate: new Date("2026-01-25T23:59:59.000Z"),
          price: 5,
          currency: Currency.EUR,
        },
      ],
    },
    {
      name: "Caminhada SMAT",
      description:
        "Caminhada - Passeio pedestre de 10km sem carácter competitivo",
      distanceKm: 10,
      elevationGainM: 240,
      startDate: new Date("2026-02-07T10:10:00.000Z"),
      startTime: "10:10",
      cutoffTimeHours: 5,
      price: 15,
      currency: Currency.EUR,
      maxParticipants: 100,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-09-12T00:00:00.000Z"),
          endDate: new Date("2025-10-12T23:59:59.000Z"),
          price: 10,
          currency: Currency.EUR,
        },
        {
          name: "2ª Fase",
          startDate: new Date("2025-10-13T00:00:00.000Z"),
          endDate: new Date("2025-12-25T23:59:59.000Z"),
          price: 12,
          currency: Currency.EUR,
        },
        {
          name: "3ª Fase",
          startDate: new Date("2025-12-26T00:00:00.000Z"),
          endDate: new Date("2026-01-25T23:59:59.000Z"),
          price: 15,
          currency: Currency.EUR,
        },
      ],
    },
  ];

  // Delete existing pricing phases for this event to avoid duplicates
  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

  console.log("💰 Creating variants and pricing phases...");

  for (const variantData of variants) {
    const { pricingPhases, ...variantInfo } = variantData;

    const variant = await prisma.eventVariant.create({
      data: {
        ...variantInfo,
        eventId: event.id,
      },
    });

    console.log(`✅ Created variant: ${variant.name}`);

    // Create pricing phases for this variant
    for (const phase of pricingPhases) {
      await prisma.pricingPhase.create({
        data: {
          eventId: event.id,
          name: `${variant.name} - ${phase.name}`,
          startDate: phase.startDate,
          endDate: phase.endDate,
          price: phase.price,
          currency: phase.currency,
        },
      });
    }

    console.log(`   - Created ${pricingPhases.length} pricing phases`);
  }

  console.log("\n🎉 Santa Maria Trail - SMAT 2026 seeded successfully!");
  console.log(`   📍 Location: Vila do Porto, Santa Maria, Açores`);
  console.log(`   📅 Date: February 7, 2026`);
  console.log(
    `   🏃 Variants: 5 (Trail Longo, Trail Curto, Mini Trail, Trail Kids, Caminhada)`
  );
  console.log(`   🌍 Translations: 6 languages (pt, en, es, fr, de, it)`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding Santa Maria Trail - SMAT 2026:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
