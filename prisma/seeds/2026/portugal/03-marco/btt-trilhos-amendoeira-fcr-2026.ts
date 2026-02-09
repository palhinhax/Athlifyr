/**
 * Seed: Passeio BTT "Nos Trilhos da Amendoeira em Flor" 2026
 * Complete with translations in all 6 languages, FAQs and SEO
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(
    "🚴 Seeding Passeio BTT Nos Trilhos da Amendoeira em Flor 2026..."
  );

  const eventSlug = "btt-trilhos-amendoeira-fcr-2026";

  // Step 1: Delete existing data to ensure clean state
  const existingEvent = await prisma.event.findUnique({
    where: { slug: eventSlug },
  });

  if (existingEvent) {
    console.log("   Cleaning existing event data...");
    await prisma.pricingPhase.deleteMany({
      where: { eventId: existingEvent.id },
    });
    await prisma.eventFAQ.deleteMany({
      where: { eventId: existingEvent.id },
    });
    await prisma.eventVariant.deleteMany({
      where: { eventId: existingEvent.id },
    });
    await prisma.eventTranslation.deleteMany({
      where: { eventId: existingEvent.id },
    });
  }

  // Step 2: Upsert the event
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: 'Passeio BTT "Nos Trilhos da Amendoeira em Flor"',
      description:
        "Passeio BTT de ~50km integrado nas Festas da Amendoeira em Flor, pelos trilhos e caminhos rurais do concelho de Figueira de Castelo Rodrigo. Percurso de dificuldade média/alta com sinalização e tracks GPS/KML.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-07T09:00:00.000Z"),
      endDate: null,
      city: "Figueira de Castelo Rodrigo",
      country: "Portugal",
      latitude: 40.895,
      longitude: -6.9617,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Pavilh%C3%A3o+dos+Desportos+Figueira+de+Castelo+Rodrigo",
      externalUrl: "",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-03-03T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: 'Passeio BTT "Nos Trilhos da Amendoeira em Flor"',
      description:
        "Passeio BTT de ~50km integrado nas Festas da Amendoeira em Flor, pelos trilhos e caminhos rurais do concelho de Figueira de Castelo Rodrigo. Percurso de dificuldade média/alta com sinalização e tracks GPS/KML.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-07T09:00:00.000Z"),
      endDate: null,
      city: "Figueira de Castelo Rodrigo",
      country: "Portugal",
      latitude: 40.895,
      longitude: -6.9617,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Pavilh%C3%A3o+dos+Desportos+Figueira+de+Castelo+Rodrigo",
      externalUrl: "",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-03-03T23:59:59.000Z"),
    },
  });

  console.log(`✅ Event upserted: ${event.slug} (ID: ${event.id})`);

  // Step 3: Create translations for ALL 6 LANGUAGES
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
      title: 'Passeio BTT "Nos Trilhos da Amendoeira em Flor"',
      city: "Figueira de Castelo Rodrigo",
      metaTitle:
        'Passeio BTT "Nos Trilhos da Amendoeira em Flor" 2026 | Figueira de Castelo Rodrigo, Guarda | 7 Março',
      metaDescription:
        'Passeio BTT "Nos Trilhos da Amendoeira em Flor" 2026 - 7 de março em Figueira de Castelo Rodrigo. Percurso de ~50km pelos trilhos da amendoeira em flor. Integrado nas Festas da Amendoeira em Flor.',
      description: `# 🚴 Passeio BTT "Nos Trilhos da Amendoeira em Flor" 2026

O **Passeio BTT "Nos Trilhos da Amendoeira em Flor"** é organizado pela **Câmara Municipal de Figueira de Castelo Rodrigo**, integrado nas tradicionais **Festas da Amendoeira em Flor** 🌸. Vem pedalar pelos trilhos, caminhos rurais e estradas municipais do concelho!

## 📅 Data e Local

- **Data:** 7 de março de 2026 (Sábado)
- **Partida:** 09:00
- **Local:** Pavilhão dos Desportos, Figueira de Castelo Rodrigo
- **Distrito:** Guarda

## 🚴 Percurso

| Percurso | Distância | Dificuldade | Navegação |
|----------|-----------|-------------|-----------|
| **Passeio BTT** | ~50 km | Média/Alta | Sinalizado + GPS/KML |

O percurso atravessa trilhos, caminhos rurais e estradas municipais, sinalizado com placas e fitas. Tracks em formato GPX e KML disponibilizados pela organização.

## 📋 Programa

- **08:00** - Inscrições no Pavilhão dos Desportos
- **09:00** - Partida
- **12:45** - Almoço

## 🎁 A Inscrição Inclui

- ✅ Seguro de acidentes pessoais
- ✅ Dorsal
- ✅ Abastecimentos no percurso
- ✅ Balneários no Pavilhão dos Desportos e Piscinas Municipais
- ✅ Zona de lavagem de bicicletas
- ✅ Lembranças

## ⚠️ Regras Importantes

- 🪖 Capacete obrigatório
- Idade mínima: 14 anos (menores de 18 necessitam autorização do encarregado de educação)
- Evento não competitivo (passeio com registo de ordem de chegada e tempo)

## 📧 Contactos

- **Telefone:** 271 319 000
- **Email:** cm-fcr@cm-fcr.pt
- **Organização:** Câmara Municipal de Figueira de Castelo Rodrigo`,
    },
    {
      language: "en",
      title: 'BTT Ride "On the Almond Blossom Trails"',
      city: "Figueira de Castelo Rodrigo",
      metaTitle:
        'BTT Ride "On the Almond Blossom Trails" 2026 | Figueira de Castelo Rodrigo, Guarda | March 7',
      metaDescription:
        'BTT Ride "On the Almond Blossom Trails" 2026 - March 7 in Figueira de Castelo Rodrigo. ~50km route through the almond blossom trails. Part of the Almond Blossom Festival.',
      description: `# 🚴 BTT Ride "On the Almond Blossom Trails" 2026

The **BTT Ride "On the Almond Blossom Trails"** is organized by the **Municipality of Figueira de Castelo Rodrigo**, as part of the traditional **Almond Blossom Festival** 🌸. Come ride through the trails, rural paths and municipal roads of the region!

## 📅 Date and Location

- **Date:** March 7, 2026 (Saturday)
- **Start:** 09:00
- **Location:** Pavilhão dos Desportos, Figueira de Castelo Rodrigo
- **District:** Guarda

## 🚴 Route

| Route | Distance | Difficulty | Navigation |
|-------|----------|------------|------------|
| **BTT Ride** | ~50 km | Medium/High | Signed + GPS/KML |

The route goes through trails, rural paths and municipal roads, marked with signs and ribbons. GPX and KML tracks provided by the organization.

## 📋 Schedule

- **08:00** - Registration at Pavilhão dos Desportos
- **09:00** - Start
- **12:45** - Lunch

## 🎁 Registration Includes

- ✅ Personal accident insurance
- ✅ Race number
- ✅ Refreshments on course
- ✅ Showers at Pavilhão dos Desportos and Municipal Swimming Pool
- ✅ Bike washing area
- ✅ Souvenirs

## ⚠️ Important Rules

- 🪖 Helmet mandatory
- Minimum age: 14 years (under 18 need parental authorization)
- Non-competitive event (ride with arrival order and time recording)

## 📧 Contacts

- **Phone:** 271 319 000
- **Email:** cm-fcr@cm-fcr.pt
- **Organization:** Municipality of Figueira de Castelo Rodrigo`,
    },
    {
      language: "es",
      title: 'Paseo BTT "Por los Senderos del Almendro en Flor"',
      city: "Figueira de Castelo Rodrigo",
      metaTitle:
        'Paseo BTT "Por los Senderos del Almendro en Flor" 2026 | Figueira de Castelo Rodrigo, Guarda | 7 Marzo',
      metaDescription:
        'Paseo BTT "Por los Senderos del Almendro en Flor" 2026 - 7 de marzo en Figueira de Castelo Rodrigo. Recorrido de ~50km por los senderos del almendro en flor. Integrado en las Fiestas del Almendro en Flor.',
      description: `# 🚴 Paseo BTT "Por los Senderos del Almendro en Flor" 2026

El **Paseo BTT "Por los Senderos del Almendro en Flor"** está organizado por el **Ayuntamiento de Figueira de Castelo Rodrigo**, integrado en las tradicionales **Fiestas del Almendro en Flor** 🌸. ¡Ven a pedalear por los senderos, caminos rurales y carreteras municipales de la comarca!

## 📅 Fecha y Lugar

- **Fecha:** 7 de marzo de 2026 (Sábado)
- **Salida:** 09:00
- **Lugar:** Pavilhão dos Desportos, Figueira de Castelo Rodrigo
- **Distrito:** Guarda

## 🚴 Recorrido

| Recorrido | Distancia | Dificultad | Navegación |
|-----------|-----------|------------|------------|
| **Paseo BTT** | ~50 km | Media/Alta | Señalizado + GPS/KML |

El recorrido atraviesa senderos, caminos rurales y carreteras municipales, señalizado con placas y cintas. Tracks en formato GPX y KML proporcionados por la organización.

## 📋 Programa

- **08:00** - Inscripciones en el Pavilhão dos Desportos
- **09:00** - Salida
- **12:45** - Almuerzo

## 🎁 La Inscripción Incluye

- ✅ Seguro de accidentes personales
- ✅ Dorsal
- ✅ Avituallamientos en el recorrido
- ✅ Duchas en el Pavilhão dos Desportos y Piscinas Municipales
- ✅ Zona de lavado de bicicletas
- ✅ Recuerdos

## ⚠️ Reglas Importantes

- 🪖 Casco obligatorio
- Edad mínima: 14 años (menores de 18 necesitan autorización del tutor)
- Evento no competitivo (paseo con registro de orden de llegada y tiempo)

## 📧 Contactos

- **Teléfono:** 271 319 000
- **Email:** cm-fcr@cm-fcr.pt
- **Organización:** Ayuntamiento de Figueira de Castelo Rodrigo`,
    },
    {
      language: "fr",
      title: 'Balade VTT "Sur les Sentiers de l\'Amandier en Fleur"',
      city: "Figueira de Castelo Rodrigo",
      metaTitle:
        'Balade VTT "Sur les Sentiers de l\'Amandier en Fleur" 2026 | Figueira de Castelo Rodrigo, Guarda | 7 Mars',
      metaDescription:
        "Balade VTT \"Sur les Sentiers de l'Amandier en Fleur\" 2026 - 7 mars à Figueira de Castelo Rodrigo. Parcours de ~50km sur les sentiers de l'amandier en fleur. Intégré aux Fêtes de l'Amandier en Fleur.",
      description: `# 🚴 Balade VTT "Sur les Sentiers de l'Amandier en Fleur" 2026

La **Balade VTT "Sur les Sentiers de l'Amandier en Fleur"** est organisée par la **Municipalité de Figueira de Castelo Rodrigo**, dans le cadre des traditionnelles **Fêtes de l'Amandier en Fleur** 🌸. Venez pédaler sur les sentiers, chemins ruraux et routes municipales de la région !

## 📅 Date et Lieu

- **Date:** 7 mars 2026 (Samedi)
- **Départ:** 09:00
- **Lieu:** Pavilhão dos Desportos, Figueira de Castelo Rodrigo
- **District:** Guarda

## 🚴 Parcours

| Parcours | Distance | Difficulté | Navigation |
|----------|----------|------------|-----------|
| **Balade VTT** | ~50 km | Moyenne/Haute | Balisé + GPS/KML |

Le parcours traverse sentiers, chemins ruraux et routes municipales, balisé avec panneaux et rubans. Tracks en format GPX et KML fournis par l'organisation.

## 📋 Programme

- **08:00** - Inscriptions au Pavilhão dos Desportos
- **09:00** - Départ
- **12:45** - Déjeuner

## 🎁 L'Inscription Comprend

- ✅ Assurance accidents personnels
- ✅ Dossard
- ✅ Ravitaillements sur le parcours
- ✅ Douches au Pavilhão dos Desportos et Piscines Municipales
- ✅ Zone de lavage des vélos
- ✅ Souvenirs

## ⚠️ Règles Importantes

- 🪖 Casque obligatoire
- Âge minimum: 14 ans (les moins de 18 ans nécessitent une autorisation parentale)
- Événement non compétitif (balade avec enregistrement de l'ordre d'arrivée et du temps)

## 📧 Contacts

- **Téléphone:** 271 319 000
- **Email:** cm-fcr@cm-fcr.pt
- **Organisation:** Municipalité de Figueira de Castelo Rodrigo`,
    },
    {
      language: "de",
      title: 'MTB Ausfahrt "Auf den Mandelblüten-Trails"',
      city: "Figueira de Castelo Rodrigo",
      metaTitle:
        'MTB Ausfahrt "Auf den Mandelblüten-Trails" 2026 | Figueira de Castelo Rodrigo, Guarda | 7. März',
      metaDescription:
        'MTB Ausfahrt "Auf den Mandelblüten-Trails" 2026 - 7. März in Figueira de Castelo Rodrigo. ~50km Strecke durch die Mandelblüten-Trails. Teil des Mandelblütenfestes.',
      description: `# 🚴 MTB Ausfahrt "Auf den Mandelblüten-Trails" 2026

Die **MTB Ausfahrt "Auf den Mandelblüten-Trails"** wird von der **Gemeinde Figueira de Castelo Rodrigo** organisiert, als Teil des traditionellen **Mandelblütenfestes** 🌸. Komm und fahre durch die Trails, ländlichen Wege und Gemeindestraßen der Region!

## 📅 Datum und Ort

- **Datum:** 7. März 2026 (Samstag)
- **Start:** 09:00 Uhr
- **Ort:** Pavilhão dos Desportos, Figueira de Castelo Rodrigo
- **Bezirk:** Guarda

## 🚴 Strecke

| Strecke | Distanz | Schwierigkeit | Navigation |
|---------|---------|---------------|------------|
| **MTB Ausfahrt** | ~50 km | Mittel/Hoch | Markiert + GPS/KML |

Die Strecke führt durch Trails, ländliche Wege und Gemeindestraßen, markiert mit Schildern und Bändern. GPX- und KML-Tracks von der Organisation bereitgestellt.

## 📋 Programm

- **08:00** - Anmeldung im Pavilhão dos Desportos
- **09:00** - Start
- **12:45** - Mittagessen

## 🎁 Die Anmeldung Beinhaltet

- ✅ Persönliche Unfallversicherung
- ✅ Startnummer
- ✅ Verpflegung auf der Strecke
- ✅ Duschen im Pavilhão dos Desportos und im Gemeinde-Schwimmbad
- ✅ Fahrrad-Waschbereich
- ✅ Erinnerungsgeschenke

## ⚠️ Wichtige Regeln

- 🪖 Helm Pflicht
- Mindestalter: 14 Jahre (unter 18 Jahre benötigen eine Einverständniserklärung der Eltern)
- Nicht-wettkampfmäßige Veranstaltung (Ausfahrt mit Erfassung der Ankunftsreihenfolge und Zeit)

## 📧 Kontakt

- **Telefon:** 271 319 000
- **Email:** cm-fcr@cm-fcr.pt
- **Organisation:** Gemeinde Figueira de Castelo Rodrigo`,
    },
    {
      language: "it",
      title: 'Passeggiata BTT "Sui Sentieri del Mandorlo in Fiore"',
      city: "Figueira de Castelo Rodrigo",
      metaTitle:
        'Passeggiata BTT "Sui Sentieri del Mandorlo in Fiore" 2026 | Figueira de Castelo Rodrigo, Guarda | 7 Marzo',
      metaDescription:
        'Passeggiata BTT "Sui Sentieri del Mandorlo in Fiore" 2026 - 7 marzo a Figueira de Castelo Rodrigo. Percorso di ~50km sui sentieri del mandorlo in fiore. Parte della Festa del Mandorlo in Fiore.',
      description: `# 🚴 Passeggiata BTT "Sui Sentieri del Mandorlo in Fiore" 2026

La **Passeggiata BTT "Sui Sentieri del Mandorlo in Fiore"** è organizzata dal **Comune di Figueira de Castelo Rodrigo**, nell'ambito della tradizionale **Festa del Mandorlo in Fiore** 🌸. Vieni a pedalare per i sentieri, le strade rurali e le strade comunali della regione!

## 📅 Data e Luogo

- **Data:** 7 marzo 2026 (Sabato)
- **Partenza:** 09:00
- **Luogo:** Pavilhão dos Desportos, Figueira de Castelo Rodrigo
- **Distretto:** Guarda

## 🚴 Percorso

| Percorso | Distanza | Difficoltà | Navigazione |
|----------|----------|------------|-------------|
| **Passeggiata BTT** | ~50 km | Media/Alta | Segnalato + GPS/KML |

Il percorso attraversa sentieri, strade rurali e strade comunali, segnalato con cartelli e nastri. Track in formato GPX e KML forniti dall'organizzazione.

## 📋 Programma

- **08:00** - Iscrizioni al Pavilhão dos Desportos
- **09:00** - Partenza
- **12:45** - Pranzo

## 🎁 L'Iscrizione Include

- ✅ Assicurazione infortuni personali
- ✅ Pettorale
- ✅ Ristori sul percorso
- ✅ Docce al Pavilhão dos Desportos e Piscine Comunali
- ✅ Area lavaggio biciclette
- ✅ Ricordi

## ⚠️ Regole Importanti

- 🪖 Casco obbligatorio
- Età minima: 14 anni (i minori di 18 anni necessitano dell'autorizzazione dei genitori)
- Evento non competitivo (passeggiata con registrazione dell'ordine di arrivo e del tempo)

## 📧 Contatti

- **Telefono:** 271 319 000
- **Email:** cm-fcr@cm-fcr.pt
- **Organizzazione:** Comune di Figueira de Castelo Rodrigo`,
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
      update: {
        title: translation.title,
        description: translation.description,
        city: translation.city,
        metaTitle: translation.metaTitle,
        metaDescription: translation.metaDescription,
      },
      create: {
        eventId: event.id,
        language: translation.language,
        title: translation.title,
        description: translation.description,
        city: translation.city,
        metaTitle: translation.metaTitle,
        metaDescription: translation.metaDescription,
      },
    });
  }

  console.log(
    "📝 Translations upserted for 6 languages (pt, en, es, fr, de, it)"
  );

  // Step 4: Create event variants
  console.log("🚴 Creating variants...");

  // Variant 1: Passeio BTT ~50km
  const passeioBtt = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Passeio BTT ~50km",
      distanceKm: 50,
      startTime: "09:00",
      price: 8.0,
      currency: "EUR",
    },
  });

  const passeioBttTranslations = [
    {
      language: "pt" as const,
      name: "Passeio BTT ~50km",
      description:
        "Passeio BTT de ~50km pelos trilhos, caminhos rurais e estradas municipais de Figueira de Castelo Rodrigo. Dificuldade média/alta. Sinalizado com placas e fitas + tracks GPX/KML. Idade mínima: 14 anos. Capacete obrigatório.",
    },
    {
      language: "en" as const,
      name: "BTT Ride ~50km",
      description:
        "~50km BTT ride through trails, rural paths and municipal roads of Figueira de Castelo Rodrigo. Medium/high difficulty. Marked with signs and ribbons + GPX/KML tracks. Minimum age: 14 years. Helmet mandatory.",
    },
    {
      language: "es" as const,
      name: "Paseo BTT ~50km",
      description:
        "Paseo BTT de ~50km por senderos, caminos rurales y carreteras municipales de Figueira de Castelo Rodrigo. Dificultad media/alta. Señalizado con placas y cintas + tracks GPX/KML. Edad mínima: 14 años. Casco obligatorio.",
    },
    {
      language: "fr" as const,
      name: "Balade VTT ~50km",
      description:
        "Balade VTT de ~50km sur sentiers, chemins ruraux et routes municipales de Figueira de Castelo Rodrigo. Difficulté moyenne/haute. Balisé avec panneaux et rubans + tracks GPX/KML. Âge minimum: 14 ans. Casque obligatoire.",
    },
    {
      language: "de" as const,
      name: "MTB Ausfahrt ~50km",
      description:
        "~50km MTB Ausfahrt durch Trails, ländliche Wege und Gemeindestraßen von Figueira de Castelo Rodrigo. Mittlere/hohe Schwierigkeit. Markiert mit Schildern und Bändern + GPX/KML-Tracks. Mindestalter: 14 Jahre. Helm Pflicht.",
    },
    {
      language: "it" as const,
      name: "Passeggiata BTT ~50km",
      description:
        "Passeggiata BTT di ~50km per sentieri, strade rurali e strade comunali di Figueira de Castelo Rodrigo. Difficoltà media/alta. Segnalato con cartelli e nastri + track GPX/KML. Età minima: 14 anni. Casco obbligatorio.",
    },
  ];

  for (const translation of passeioBttTranslations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: passeioBtt.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: passeioBtt.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  console.log("   ✅ Passeio BTT ~50km created");

  // Variant 2: Almoço Acompanhantes
  const almocoAcompanhantes = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Almoço Acompanhantes",
      price: 8.0,
      currency: "EUR",
    },
  });

  const almocoAcompanhantesTranslations = [
    {
      language: "pt" as const,
      name: "Almoço Acompanhantes",
      description:
        "Almoço para acompanhantes de participantes. Início às 12:45.",
    },
    {
      language: "en" as const,
      name: "Companion Lunch",
      description: "Lunch for participant companions. Starts at 12:45.",
    },
    {
      language: "es" as const,
      name: "Almuerzo Acompañantes",
      description:
        "Almuerzo para acompañantes de participantes. Inicio a las 12:45.",
    },
    {
      language: "fr" as const,
      name: "Déjeuner Accompagnants",
      description:
        "Déjeuner pour accompagnants de participants. Début à 12:45.",
    },
    {
      language: "de" as const,
      name: "Mittagessen Begleitpersonen",
      description:
        "Mittagessen für Begleitpersonen von Teilnehmern. Beginn um 12:45 Uhr.",
    },
    {
      language: "it" as const,
      name: "Pranzo Accompagnatori",
      description:
        "Pranzo per accompagnatori dei partecipanti. Inizio alle 12:45.",
    },
  ];

  for (const translation of almocoAcompanhantesTranslations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: almocoAcompanhantes.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: almocoAcompanhantes.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  console.log("   ✅ Almoço Acompanhantes created");

  // Step 5: Create pricing phases (linked to eventId)
  console.log("💰 Creating pricing phases...");

  const pricingPhases = [
    {
      name: "Inscrição - Passeio BTT",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-03-03T23:59:59.000Z"),
      price: 8.0,
      currency: "EUR" as const,
      note: "Inclui seguro, dorsal, abastecimentos e balneários",
    },
    {
      name: "Almoço Acompanhantes",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-03-03T23:59:59.000Z"),
      price: 8.0,
      currency: "EUR" as const,
      note: "Almoço para acompanhantes de participantes",
    },
  ];

  for (const phase of pricingPhases) {
    await prisma.pricingPhase.create({
      data: {
        eventId: event.id,
        name: phase.name,
        startDate: phase.startDate,
        endDate: phase.endDate,
        price: phase.price,
        currency: phase.currency,
        note: phase.note,
      },
    });
  }

  console.log(`   ✅ Pricing phases created (${pricingPhases.length} phases)`);

  // Step 6: Create FAQs with translations
  console.log("❓ Creating FAQs...");

  const faqs = [
    {
      order: 1,
      question: "Este evento é competitivo?",
      answer:
        "Não, este é um passeio BTT não competitivo. Embora seja feito o registo da ordem de chegada e do tempo, trata-se de um passeio de lazer integrado nas Festas da Amendoeira em Flor. Os participantes recebem lembranças, não prémios.",
      translations: {
        pt: {
          question: "Este evento é competitivo?",
          answer:
            "Não, este é um passeio BTT não competitivo. Embora seja feito o registo da ordem de chegada e do tempo, trata-se de um passeio de lazer integrado nas Festas da Amendoeira em Flor. Os participantes recebem lembranças, não prémios.",
        },
        en: {
          question: "Is this a competitive event?",
          answer:
            "No, this is a non-competitive BTT ride. Although arrival order and time are recorded, it is a leisure ride integrated into the Almond Blossom Festival. Participants receive souvenirs, not prizes.",
        },
        es: {
          question: "¿Este evento es competitivo?",
          answer:
            "No, este es un paseo BTT no competitivo. Aunque se registra el orden de llegada y el tiempo, se trata de un paseo de ocio integrado en las Fiestas del Almendro en Flor. Los participantes reciben recuerdos, no premios.",
        },
        fr: {
          question: "Cet événement est-il compétitif?",
          answer:
            "Non, il s'agit d'une balade VTT non compétitive. Bien que l'ordre d'arrivée et le temps soient enregistrés, il s'agit d'une balade de loisir intégrée aux Fêtes de l'Amandier en Fleur. Les participants reçoivent des souvenirs, pas des prix.",
        },
        de: {
          question: "Ist diese Veranstaltung ein Wettkampf?",
          answer:
            "Nein, dies ist eine nicht-wettkampfmäßige MTB-Ausfahrt. Obwohl die Ankunftsreihenfolge und die Zeit erfasst werden, handelt es sich um eine Freizeitfahrt im Rahmen des Mandelblütenfestes. Die Teilnehmer erhalten Erinnerungsgeschenke, keine Preise.",
        },
        it: {
          question: "Questo evento è competitivo?",
          answer:
            "No, questa è una passeggiata BTT non competitiva. Sebbene vengano registrati l'ordine di arrivo e il tempo, si tratta di una passeggiata ricreativa integrata nella Festa del Mandorlo in Fiore. I partecipanti ricevono ricordi, non premi.",
        },
      },
    },
    {
      order: 2,
      question: "Qual é a idade mínima para participar?",
      answer:
        "A idade mínima para participar é de 14 anos. Os menores de 18 anos devem apresentar uma autorização assinada pelo encarregado de educação para poderem participar no passeio.",
      translations: {
        pt: {
          question: "Qual é a idade mínima para participar?",
          answer:
            "A idade mínima para participar é de 14 anos. Os menores de 18 anos devem apresentar uma autorização assinada pelo encarregado de educação para poderem participar no passeio.",
        },
        en: {
          question: "What is the minimum age to participate?",
          answer:
            "The minimum age to participate is 14 years. Participants under 18 must present a signed parental authorization form to take part in the ride.",
        },
        es: {
          question: "¿Cuál es la edad mínima para participar?",
          answer:
            "La edad mínima para participar es de 14 años. Los menores de 18 años deben presentar una autorización firmada por su tutor para poder participar en el paseo.",
        },
        fr: {
          question: "Quel est l'âge minimum pour participer?",
          answer:
            "L'âge minimum pour participer est de 14 ans. Les participants de moins de 18 ans doivent présenter une autorisation parentale signée pour participer à la balade.",
        },
        de: {
          question: "Was ist das Mindestalter für die Teilnahme?",
          answer:
            "Das Mindestalter für die Teilnahme beträgt 14 Jahre. Teilnehmer unter 18 Jahren müssen eine unterschriebene Einverständniserklärung der Eltern vorlegen, um an der Ausfahrt teilnehmen zu können.",
        },
        it: {
          question: "Qual è l'età minima per partecipare?",
          answer:
            "L'età minima per partecipare è di 14 anni. I partecipanti minorenni (sotto i 18 anni) devono presentare un'autorizzazione firmata dai genitori per poter partecipare alla passeggiata.",
        },
      },
    },
    {
      order: 3,
      question: "O capacete é obrigatório?",
      answer:
        "Sim, o uso de capacete é obrigatório durante todo o percurso. Nenhum participante poderá tomar a partida sem capacete devidamente colocado.",
      translations: {
        pt: {
          question: "O capacete é obrigatório?",
          answer:
            "Sim, o uso de capacete é obrigatório durante todo o percurso. Nenhum participante poderá tomar a partida sem capacete devidamente colocado.",
        },
        en: {
          question: "Is the helmet mandatory?",
          answer:
            "Yes, wearing a helmet is mandatory throughout the entire course. No participant will be allowed to start without a properly fitted helmet.",
        },
        es: {
          question: "¿El casco es obligatorio?",
          answer:
            "Sí, el uso del casco es obligatorio durante todo el recorrido. Ningún participante podrá tomar la salida sin casco debidamente colocado.",
        },
        fr: {
          question: "Le casque est-il obligatoire?",
          answer:
            "Oui, le port du casque est obligatoire pendant tout le parcours. Aucun participant ne pourra prendre le départ sans casque correctement ajusté.",
        },
        de: {
          question: "Ist der Helm Pflicht?",
          answer:
            "Ja, das Tragen eines Helms ist auf der gesamten Strecke Pflicht. Kein Teilnehmer darf ohne ordnungsgemäß angelegten Helm starten.",
        },
        it: {
          question: "Il casco è obbligatorio?",
          answer:
            "Sì, l'uso del casco è obbligatorio durante tutto il percorso. Nessun partecipante potrà partire senza casco correttamente indossato.",
        },
      },
    },
    {
      order: 4,
      question: "O que inclui a inscrição de 8€?",
      answer:
        "A inscrição de 8€ no Passeio BTT inclui: seguro de acidentes pessoais, dorsal, abastecimentos no percurso, acesso a balneários (Pavilhão dos Desportos e Piscinas Municipais), zona de lavagem de bicicletas e lembranças.",
      translations: {
        pt: {
          question: "O que inclui a inscrição de 8€?",
          answer:
            "A inscrição de 8€ no Passeio BTT inclui: seguro de acidentes pessoais, dorsal, abastecimentos no percurso, acesso a balneários (Pavilhão dos Desportos e Piscinas Municipais), zona de lavagem de bicicletas e lembranças.",
        },
        en: {
          question: "What does the €8 registration include?",
          answer:
            "The €8 BTT Ride registration includes: personal accident insurance, race number, refreshments on course, shower access (Pavilhão dos Desportos and Municipal Swimming Pool), bike washing area and souvenirs.",
        },
        es: {
          question: "¿Qué incluye la inscripción de 8€?",
          answer:
            "La inscripción de 8€ en el Paseo BTT incluye: seguro de accidentes personales, dorsal, avituallamientos en el recorrido, acceso a duchas (Pavilhão dos Desportos y Piscinas Municipales), zona de lavado de bicicletas y recuerdos.",
        },
        fr: {
          question: "Que comprend l'inscription à 8€?",
          answer:
            "L'inscription à 8€ pour la Balade VTT comprend: assurance accidents personnels, dossard, ravitaillements sur le parcours, accès aux douches (Pavilhão dos Desportos et Piscines Municipales), zone de lavage des vélos et souvenirs.",
        },
        de: {
          question: "Was beinhaltet die 8€ Anmeldung?",
          answer:
            "Die 8€ Anmeldung für die MTB Ausfahrt beinhaltet: persönliche Unfallversicherung, Startnummer, Verpflegung auf der Strecke, Zugang zu Duschen (Pavilhão dos Desportos und Gemeinde-Schwimmbad), Fahrrad-Waschbereich und Erinnerungsgeschenke.",
        },
        it: {
          question: "Cosa include l'iscrizione di 8€?",
          answer:
            "L'iscrizione di 8€ alla Passeggiata BTT include: assicurazione infortuni personali, pettorale, ristori sul percorso, accesso alle docce (Pavilhão dos Desportos e Piscine Comunali), area lavaggio biciclette e ricordi.",
        },
      },
    },
    {
      order: 5,
      question: "Existem balneários e zona de lavagem de bicicletas?",
      answer:
        "Sim, os participantes têm acesso a balneários no Pavilhão dos Desportos (local de partida/chegada) e também nas Piscinas Municipais de Figueira de Castelo Rodrigo. Existe igualmente uma zona dedicada à lavagem de bicicletas.",
      translations: {
        pt: {
          question: "Existem balneários e zona de lavagem de bicicletas?",
          answer:
            "Sim, os participantes têm acesso a balneários no Pavilhão dos Desportos (local de partida/chegada) e também nas Piscinas Municipais de Figueira de Castelo Rodrigo. Existe igualmente uma zona dedicada à lavagem de bicicletas.",
        },
        en: {
          question: "Are there showers and a bike washing area?",
          answer:
            "Yes, participants have access to showers at the Pavilhão dos Desportos (start/finish location) and also at the Municipal Swimming Pool of Figueira de Castelo Rodrigo. There is also a dedicated bike washing area.",
        },
        es: {
          question: "¿Hay duchas y zona de lavado de bicicletas?",
          answer:
            "Sí, los participantes tienen acceso a duchas en el Pavilhão dos Desportos (lugar de salida/llegada) y también en las Piscinas Municipales de Figueira de Castelo Rodrigo. También existe una zona dedicada al lavado de bicicletas.",
        },
        fr: {
          question: "Y a-t-il des douches et une zone de lavage des vélos?",
          answer:
            "Oui, les participants ont accès aux douches au Pavilhão dos Desportos (lieu de départ/arrivée) et également aux Piscines Municipales de Figueira de Castelo Rodrigo. Il existe également une zone dédiée au lavage des vélos.",
        },
        de: {
          question: "Gibt es Duschen und einen Fahrrad-Waschbereich?",
          answer:
            "Ja, die Teilnehmer haben Zugang zu Duschen im Pavilhão dos Desportos (Start-/Zielort) und auch im Gemeinde-Schwimmbad von Figueira de Castelo Rodrigo. Es gibt auch einen eigenen Fahrrad-Waschbereich.",
        },
        it: {
          question: "Ci sono docce e un'area lavaggio biciclette?",
          answer:
            "Sì, i partecipanti hanno accesso alle docce al Pavilhão dos Desportos (luogo di partenza/arrivo) e anche alle Piscine Comunali di Figueira de Castelo Rodrigo. È disponibile anche un'area dedicata al lavaggio delle biciclette.",
        },
      },
    },
  ];

  for (const faq of faqs) {
    const createdFAQ = await prisma.eventFAQ.create({
      data: {
        eventId: event.id,
        order: faq.order,
        question: faq.question,
        answer: faq.answer,
      },
    });

    // Create FAQ translations for all 6 languages
    for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
      const translation = faq.translations[lang];
      await prisma.eventFAQTranslation.create({
        data: {
          faqId: createdFAQ.id,
          language: lang,
          question: translation.question,
          answer: translation.answer,
        },
      });
    }
  }

  console.log(`   ✅ Created ${faqs.length} FAQs with translations`);

  console.log(`
🚴 Passeio BTT "Nos Trilhos da Amendoeira em Flor" 2026 seeded successfully!
   📍 Event: Passeio BTT "Nos Trilhos da Amendoeira em Flor"
   🔗 Slug: ${event.slug}
   📅 Date: 2026-03-07
   📍 Location: Pavilhão dos Desportos, Figueira de Castelo Rodrigo, Guarda
   🚴 Variants: Passeio BTT ~50km, Almoço Acompanhantes
   💰 Pricing: ${pricingPhases.length} phases
   ❓ FAQs: ${faqs.length} questions with 6 language translations
  `);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding event:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
