/**
 * Seed: Passeio BTT "Entre os Trilhos da Raia" 2026
 * Complete with translations in all 6 languages, FAQs and SEO
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding Passeio BTT Entre os Trilhos da Raia 2026...");

  const eventSlug = "btt-trilhos-raia-ficalho-2026";

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
      title: 'Passeio BTT "Entre os Trilhos da Raia"',
      description:
        "Passeio BTT não competitivo pelos trilhos da Raia, na região fronteiriça de Vila Verde de Ficalho. Passeio guiado de ~40km promovendo o desporto, o convívio e a descoberta da paisagem alentejana.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-08T09:00:00.000Z"),
      endDate: null,
      city: "Vila Verde de Ficalho",
      country: "Portugal",
      latitude: 37.98,
      longitude: -7.31,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Vila+Verde+de+Ficalho+Beja+Portugal",
      externalUrl: "",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-03-01T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: 'Passeio BTT "Entre os Trilhos da Raia"',
      description:
        "Passeio BTT não competitivo pelos trilhos da Raia, na região fronteiriça de Vila Verde de Ficalho. Passeio guiado de ~40km promovendo o desporto, o convívio e a descoberta da paisagem alentejana.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-08T09:00:00.000Z"),
      endDate: null,
      city: "Vila Verde de Ficalho",
      country: "Portugal",
      latitude: 37.98,
      longitude: -7.31,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Vila+Verde+de+Ficalho+Beja+Portugal",
      externalUrl: "",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-03-01T23:59:59.000Z"),
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
      title: 'Passeio BTT "Entre os Trilhos da Raia"',
      city: "Vila Verde de Ficalho",
      metaTitle:
        'Passeio BTT "Entre os Trilhos da Raia" 2026 | Vila Verde de Ficalho, Beja | 8 Março',
      metaDescription:
        'Passeio BTT "Entre os Trilhos da Raia" 2026 - 8 de março em Vila Verde de Ficalho. Passeio guiado de ~40km pela região da Raia alentejana. Inscrição 16€ inclui seguro, almoço e muito mais.',
      description: `# 🚴 Passeio BTT "Entre os Trilhos da Raia" 2026

O **Passeio BTT "Entre os Trilhos da Raia"** é organizado pelo **Ficalho DC - Clube dos Trilhos**, promovendo o desporto, o convívio e a descoberta da fantástica região fronteiriça de **Vila Verde de Ficalho**, no coração do **Alentejo**. A "Raia" é a zona de fronteira entre Portugal e Espanha, rica em paisagens naturais e tradição.

## 📅 Data e Local

- **Data:** 8 de março de 2026 (Domingo)
- **Partida:** 09:00
- **Local:** Praça Conde de Ficalho, Vila Verde de Ficalho
- **Distrito:** Beja

## 🚴 Percurso

| Percurso | Distância | Tipo | Participantes |
|----------|-----------|------|---------------|
| **Passeio BTT** | ~40 km | Guiado (não marcado) | Máx. 100 |

⚠️ **Atenção:** O passeio é **guiado** — não existem marcações no trilho. Todos os participantes devem acompanhar o grupo.

## 📋 Programa

- **08:00** — Secretariado no Salão Polivalente, Praça Conde de Ficalho
- **09:00** — Partida da Praça Conde de Ficalho
- **Após chegada** — Almoço convívio no Salão Polivalente

## 🎁 A Inscrição de 16€ Inclui

- ✅ Participação no evento
- ✅ Seguro de acidentes pessoais
- ✅ Abastecimentos durante o percurso
- ✅ Balneários / duches no final
- ✅ Almoço convívio
- ✅ Lembranças / brindes
- ✅ Lavagem de bikes

## ⚠️ Regras Importantes

- **Idade mínima:** 16 anos
- **Capacete obrigatório** durante todo o percurso
- **Máximo 100 participantes** — inscrições por ordem de chegada

## 📧 Contactos

- **Telemóvel:** 926 659 660 / 925 284 141
- **Email:** ficalhodc@gmail.com
- **Website:** ficalhodc.com
- **Organização:** Ficalho DC - Clube dos Trilhos`,
    },
    {
      language: "en",
      title: 'BTT Ride "Along the Border Trails"',
      city: "Vila Verde de Ficalho",
      metaTitle:
        'BTT Ride "Along the Border Trails" 2026 | Vila Verde de Ficalho, Beja | March 8',
      metaDescription:
        'BTT Ride "Along the Border Trails" 2026 - March 8 in Vila Verde de Ficalho. Guided ~40km ride through the Portuguese-Spanish border region of Alentejo. €16 includes insurance, lunch and more.',
      description: `# 🚴 BTT Ride "Along the Border Trails" 2026

The **BTT Ride "Along the Border Trails"** is organized by **Ficalho DC - Clube dos Trilhos**, promoting sport, fellowship and the discovery of the fantastic border region of **Vila Verde de Ficalho**, in the heart of **Alentejo**. The "Raia" is the border zone between Portugal and Spain, rich in natural landscapes and tradition.

## 📅 Date and Location

- **Date:** March 8, 2026 (Sunday)
- **Start:** 09:00
- **Location:** Praça Conde de Ficalho, Vila Verde de Ficalho
- **District:** Beja

## 🚴 Route

| Route | Distance | Type | Participants |
|-------|----------|------|--------------|
| **BTT Ride** | ~40 km | Guided (not marked) | Max. 100 |

⚠️ **Note:** The ride is **guided** — there are no trail markings. All participants must stay with the group.

## 📋 Schedule

- **08:00** — Registration at Salão Polivalente, Praça Conde de Ficalho
- **09:00** — Start from Praça Conde de Ficalho
- **After arrival** — Fellowship lunch at Salão Polivalente

## 🎁 The €16 Registration Includes

- ✅ Event participation
- ✅ Personal accident insurance
- ✅ Food refreshments during the route
- ✅ Showers at the end
- ✅ Fellowship lunch
- ✅ Souvenirs/gifts
- ✅ Bike washing

## ⚠️ Important Rules

- **Minimum age:** 16 years
- **Helmet mandatory** throughout the ride
- **Maximum 100 participants** — first come, first served

## 📧 Contacts

- **Phone:** 926 659 660 / 925 284 141
- **Email:** ficalhodc@gmail.com
- **Website:** ficalhodc.com
- **Organization:** Ficalho DC - Clube dos Trilhos`,
    },
    {
      language: "es",
      title: 'Paseo BTT "Por los Senderos de la Raya"',
      city: "Vila Verde de Ficalho",
      metaTitle:
        'Paseo BTT "Por los Senderos de la Raya" 2026 | Vila Verde de Ficalho, Beja | 8 Marzo',
      metaDescription:
        'Paseo BTT "Por los Senderos de la Raya" 2026 - 8 de marzo en Vila Verde de Ficalho. Paseo guiado de ~40km por la frontera luso-española en el Alentejo. 16€ incluye seguro, almuerzo y más.',
      description: `# 🚴 Paseo BTT "Por los Senderos de la Raya" 2026

El **Paseo BTT "Por los Senderos de la Raya"** está organizado por **Ficalho DC - Clube dos Trilhos**, promoviendo el deporte, la convivencia y el descubrimiento de la fantástica región fronteriza de **Vila Verde de Ficalho**, en el corazón del **Alentejo**. La "Raya" es la zona fronteriza entre Portugal y España, rica en paisajes naturales y tradición.

## 📅 Fecha y Lugar

- **Fecha:** 8 de marzo de 2026 (Domingo)
- **Salida:** 09:00
- **Lugar:** Praça Conde de Ficalho, Vila Verde de Ficalho
- **Distrito:** Beja

## 🚴 Recorrido

| Recorrido | Distancia | Tipo | Participantes |
|-----------|-----------|------|---------------|
| **Paseo BTT** | ~40 km | Guiado (no señalizado) | Máx. 100 |

⚠️ **Atención:** El paseo es **guiado** — no hay señalizaciones en los senderos. Todos los participantes deben acompañar al grupo.

## 📋 Programa

- **08:00** — Secretaría en el Salão Polivalente, Praça Conde de Ficalho
- **09:00** — Salida desde Praça Conde de Ficalho
- **Tras la llegada** — Almuerzo de convivencia en el Salão Polivalente

## 🎁 La Inscripción de 16€ Incluye

- ✅ Participación en el evento
- ✅ Seguro de accidentes personales
- ✅ Avituallamientos durante el recorrido
- ✅ Duchas al final
- ✅ Almuerzo de convivencia
- ✅ Recuerdos / regalos
- ✅ Lavado de bicicletas

## ⚠️ Reglas Importantes

- **Edad mínima:** 16 años
- **Casco obligatorio** durante todo el recorrido
- **Máximo 100 participantes** — por orden de inscripción

## 📧 Contactos

- **Teléfono:** 926 659 660 / 925 284 141
- **Email:** ficalhodc@gmail.com
- **Website:** ficalhodc.com
- **Organización:** Ficalho DC - Clube dos Trilhos`,
    },
    {
      language: "fr",
      title: 'Balade VTT "Sur les Sentiers de la Frontière"',
      city: "Vila Verde de Ficalho",
      metaTitle:
        'Balade VTT "Sur les Sentiers de la Frontière" 2026 | Vila Verde de Ficalho, Beja | 8 Mars',
      metaDescription:
        'Balade VTT "Sur les Sentiers de la Frontière" 2026 - 8 mars à Vila Verde de Ficalho. Balade guidée de ~40km dans la région frontalière luso-espagnole de l\'Alentejo. 16€ inclut assurance, déjeuner et plus.',
      description: `# 🚴 Balade VTT "Sur les Sentiers de la Frontière" 2026

La **Balade VTT "Sur les Sentiers de la Frontière"** est organisée par **Ficalho DC - Clube dos Trilhos**, promouvant le sport, la convivialité et la découverte de la fantastique région frontalière de **Vila Verde de Ficalho**, au cœur de l'**Alentejo**. La "Raia" est la zone frontière entre le Portugal et l'Espagne, riche en paysages naturels et en tradition.

## 📅 Date et Lieu

- **Date:** 8 mars 2026 (Dimanche)
- **Départ:** 09:00
- **Lieu:** Praça Conde de Ficalho, Vila Verde de Ficalho
- **District:** Beja

## 🚴 Parcours

| Parcours | Distance | Type | Participants |
|----------|----------|------|--------------|
| **Balade VTT** | ~40 km | Guidé (non balisé) | Max. 100 |

⚠️ **Attention:** La balade est **guidée** — il n'y a pas de balisage sur les sentiers. Tous les participants doivent rester avec le groupe.

## 📋 Programme

- **08:00** — Secrétariat au Salão Polivalente, Praça Conde de Ficalho
- **09:00** — Départ de la Praça Conde de Ficalho
- **Après l'arrivée** — Déjeuner convivial au Salão Polivalente

## 🎁 L'Inscription de 16€ Comprend

- ✅ Participation à l'événement
- ✅ Assurance accidents personnels
- ✅ Ravitaillements pendant le parcours
- ✅ Douches à l'arrivée
- ✅ Déjeuner convivial
- ✅ Souvenirs / cadeaux
- ✅ Lavage des vélos

## ⚠️ Règles Importantes

- **Âge minimum:** 16 ans
- **Casque obligatoire** pendant toute la balade
- **Maximum 100 participants** — premier arrivé, premier servi

## 📧 Contacts

- **Téléphone:** 926 659 660 / 925 284 141
- **Email:** ficalhodc@gmail.com
- **Website:** ficalhodc.com
- **Organisation:** Ficalho DC - Clube dos Trilhos`,
    },
    {
      language: "de",
      title: 'MTB Ausfahrt "Auf den Grenz-Trails"',
      city: "Vila Verde de Ficalho",
      metaTitle:
        'MTB Ausfahrt "Auf den Grenz-Trails" 2026 | Vila Verde de Ficalho, Beja | 8. März',
      metaDescription:
        'MTB Ausfahrt "Auf den Grenz-Trails" 2026 - 8. März in Vila Verde de Ficalho. Geführte ~40km Tour durch die portugiesisch-spanische Grenzregion im Alentejo. 16€ inkl. Versicherung, Mittagessen und mehr.',
      description: `# 🚴 MTB Ausfahrt "Auf den Grenz-Trails" 2026

Die **MTB Ausfahrt "Auf den Grenz-Trails"** wird vom **Ficalho DC - Clube dos Trilhos** organisiert und fördert Sport, Geselligkeit und die Entdeckung der fantastischen Grenzregion von **Vila Verde de Ficalho**, im Herzen des **Alentejo**. Die "Raia" ist die Grenzzone zwischen Portugal und Spanien, reich an natürlichen Landschaften und Tradition.

## 📅 Datum und Ort

- **Datum:** 8. März 2026 (Sonntag)
- **Start:** 09:00 Uhr
- **Ort:** Praça Conde de Ficalho, Vila Verde de Ficalho
- **Bezirk:** Beja

## 🚴 Strecke

| Strecke | Distanz | Typ | Teilnehmer |
|---------|---------|-----|------------|
| **MTB Ausfahrt** | ~40 km | Geführt (nicht markiert) | Max. 100 |

⚠️ **Hinweis:** Die Ausfahrt ist **geführt** — es gibt keine Streckenmarkierungen. Alle Teilnehmer müssen bei der Gruppe bleiben.

## 📋 Programm

- **08:00** — Anmeldung im Salão Polivalente, Praça Conde de Ficalho
- **09:00** — Start am Praça Conde de Ficalho
- **Nach Ankunft** — Geselliges Mittagessen im Salão Polivalente

## 🎁 Die 16€ Anmeldung Beinhaltet

- ✅ Veranstaltungsteilnahme
- ✅ Persönliche Unfallversicherung
- ✅ Verpflegung während der Strecke
- ✅ Duschen am Ende
- ✅ Geselliges Mittagessen
- ✅ Erinnerungsgeschenke
- ✅ Fahrradwäsche

## ⚠️ Wichtige Regeln

- **Mindestalter:** 16 Jahre
- **Helmpflicht** während der gesamten Ausfahrt
- **Maximal 100 Teilnehmer** — nach Reihenfolge der Anmeldung

## 📧 Kontakt

- **Telefon:** 926 659 660 / 925 284 141
- **Email:** ficalhodc@gmail.com
- **Website:** ficalhodc.com
- **Organisation:** Ficalho DC - Clube dos Trilhos`,
    },
    {
      language: "it",
      title: 'Passeggiata BTT "Sui Sentieri della Frontiera"',
      city: "Vila Verde de Ficalho",
      metaTitle:
        'Passeggiata BTT "Sui Sentieri della Frontiera" 2026 | Vila Verde de Ficalho, Beja | 8 Marzo',
      metaDescription:
        'Passeggiata BTT "Sui Sentieri della Frontiera" 2026 - 8 marzo a Vila Verde de Ficalho. Passeggiata guidata di ~40km nella regione di confine luso-spagnola dell\'Alentejo. 16€ include assicurazione, pranzo e altro.',
      description: `# 🚴 Passeggiata BTT "Sui Sentieri della Frontiera" 2026

La **Passeggiata BTT "Sui Sentieri della Frontiera"** è organizzata dal **Ficalho DC - Clube dos Trilhos**, promuovendo lo sport, la convivialità e la scoperta della fantastica regione di confine di **Vila Verde de Ficalho**, nel cuore dell'**Alentejo**. La "Raia" è la zona di confine tra Portogallo e Spagna, ricca di paesaggi naturali e tradizione.

## 📅 Data e Luogo

- **Data:** 8 marzo 2026 (Domenica)
- **Partenza:** 09:00
- **Luogo:** Praça Conde de Ficalho, Vila Verde de Ficalho
- **Distretto:** Beja

## 🚴 Percorso

| Percorso | Distanza | Tipo | Partecipanti |
|----------|----------|------|--------------|
| **Passeggiata BTT** | ~40 km | Guidato (non segnalato) | Max. 100 |

⚠️ **Attenzione:** La passeggiata è **guidata** — non ci sono segnalazioni sui sentieri. Tutti i partecipanti devono rimanere con il gruppo.

## 📋 Programma

- **08:00** — Segreteria al Salão Polivalente, Praça Conde de Ficalho
- **09:00** — Partenza dalla Praça Conde de Ficalho
- **Dopo l'arrivo** — Pranzo conviviale al Salão Polivalente

## 🎁 L'Iscrizione di 16€ Include

- ✅ Partecipazione all'evento
- ✅ Assicurazione infortuni personali
- ✅ Ristori durante il percorso
- ✅ Docce alla fine
- ✅ Pranzo conviviale
- ✅ Ricordi / gadget
- ✅ Lavaggio biciclette

## ⚠️ Regole Importanti

- **Età minima:** 16 anni
- **Casco obbligatorio** durante tutta la passeggiata
- **Massimo 100 partecipanti** — in ordine di iscrizione

## 📧 Contatti

- **Telefono:** 926 659 660 / 925 284 141
- **Email:** ficalhodc@gmail.com
- **Website:** ficalhodc.com
- **Organizzazione:** Ficalho DC - Clube dos Trilhos`,
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

  // Variant 1: Passeio BTT ~40km
  const passeioBtt = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Passeio BTT ~40km",
      distanceKm: 40,
      startTime: "09:00",
      maxParticipants: 100,
      price: 16.0,
      currency: "EUR",
    },
  });

  const passeioBttTranslations = [
    {
      language: "pt" as const,
      name: "Passeio BTT ~40km",
      description:
        "Passeio guiado de ~40km pelos trilhos da Raia, na região fronteiriça de Vila Verde de Ficalho. Percurso não marcado — passeio guiado em grupo.",
    },
    {
      language: "en" as const,
      name: "BTT Ride ~40km",
      description:
        "Guided ~40km ride through the border trails of Vila Verde de Ficalho. Not marked — guided group ride.",
    },
    {
      language: "es" as const,
      name: "Paseo BTT ~40km",
      description:
        "Paseo guiado de ~40km por los senderos de la Raya, en la región fronteriza de Vila Verde de Ficalho. Recorrido no señalizado — paseo guiado en grupo.",
    },
    {
      language: "fr" as const,
      name: "Balade VTT ~40km",
      description:
        "Balade guidée de ~40km sur les sentiers de la frontière, dans la région frontalière de Vila Verde de Ficalho. Parcours non balisé — balade guidée en groupe.",
    },
    {
      language: "de" as const,
      name: "MTB Ausfahrt ~40km",
      description:
        "Geführte ~40km Tour auf den Grenz-Trails von Vila Verde de Ficalho. Nicht markiert — geführte Gruppenausfahrt.",
    },
    {
      language: "it" as const,
      name: "Passeggiata BTT ~40km",
      description:
        "Passeggiata guidata di ~40km sui sentieri della frontiera, nella regione di confine di Vila Verde de Ficalho. Percorso non segnalato — passeggiata guidata in gruppo.",
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

  console.log("   ✅ Passeio BTT ~40km created");

  // Step 5: Create pricing phases (linked to eventId)
  console.log("💰 Creating pricing phases...");

  const pricingPhases = [
    {
      name: "Inscrição - Passeio BTT",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-03-01T23:59:59.000Z"),
      price: 16.0,
      currency: "EUR" as const,
      note: "Inclui seguro, almoço convívio, abastecimentos, balneários e lavagem de bikes",
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
      question: "O passeio é guiado ou marcado?",
      answer:
        "O passeio é guiado — não existem marcações no trilho. Todos os participantes devem acompanhar o grupo durante os ~40km do percurso. Não é permitido sair do grupo.",
      translations: {
        pt: {
          question: "O passeio é guiado ou marcado?",
          answer:
            "O passeio é guiado — não existem marcações no trilho. Todos os participantes devem acompanhar o grupo durante os ~40km do percurso. Não é permitido sair do grupo.",
        },
        en: {
          question: "Is the ride guided or marked?",
          answer:
            "The ride is guided — there are no trail markings. All participants must stay with the group throughout the ~40km route. It is not allowed to leave the group.",
        },
        es: {
          question: "¿El paseo es guiado o señalizado?",
          answer:
            "El paseo es guiado — no hay señalizaciones en los senderos. Todos los participantes deben acompañar al grupo durante los ~40km del recorrido. No está permitido salir del grupo.",
        },
        fr: {
          question: "La balade est-elle guidée ou balisée?",
          answer:
            "La balade est guidée — il n'y a pas de balisage sur les sentiers. Tous les participants doivent rester avec le groupe pendant les ~40km du parcours. Il n'est pas permis de quitter le groupe.",
        },
        de: {
          question: "Ist die Ausfahrt geführt oder markiert?",
          answer:
            "Die Ausfahrt ist geführt — es gibt keine Streckenmarkierungen. Alle Teilnehmer müssen während der ~40km bei der Gruppe bleiben. Es ist nicht erlaubt, die Gruppe zu verlassen.",
        },
        it: {
          question: "La passeggiata è guidata o segnalata?",
          answer:
            "La passeggiata è guidata — non ci sono segnalazioni sui sentieri. Tutti i partecipanti devono rimanere con il gruppo durante i ~40km del percorso. Non è permesso lasciare il gruppo.",
        },
      },
    },
    {
      order: 2,
      question: "O que está incluído nos 16€ da inscrição?",
      answer:
        "A inscrição de 16€ inclui tudo: seguro de acidentes pessoais, abastecimentos durante o percurso, balneários/duches, almoço convívio, lembranças/brindes e lavagem de bikes.",
      translations: {
        pt: {
          question: "O que está incluído nos 16€ da inscrição?",
          answer:
            "A inscrição de 16€ inclui tudo: seguro de acidentes pessoais, abastecimentos durante o percurso, balneários/duches, almoço convívio, lembranças/brindes e lavagem de bikes.",
        },
        en: {
          question: "What is included in the €16 registration?",
          answer:
            "The €16 registration includes everything: personal accident insurance, food refreshments during the route, showers, fellowship lunch, souvenirs/gifts and bike washing.",
        },
        es: {
          question: "¿Qué incluye la inscripción de 16€?",
          answer:
            "La inscripción de 16€ lo incluye todo: seguro de accidentes personales, avituallamientos durante el recorrido, duchas, almuerzo de convivencia, recuerdos/regalos y lavado de bicicletas.",
        },
        fr: {
          question: "Que comprend l'inscription de 16€?",
          answer:
            "L'inscription de 16€ comprend tout: assurance accidents personnels, ravitaillements pendant le parcours, douches, déjeuner convivial, souvenirs/cadeaux et lavage des vélos.",
        },
        de: {
          question: "Was beinhaltet die 16€ Anmeldung?",
          answer:
            "Die 16€ Anmeldung beinhaltet alles: persönliche Unfallversicherung, Verpflegung während der Strecke, Duschen, geselliges Mittagessen, Erinnerungsgeschenke und Fahrradwäsche.",
        },
        it: {
          question: "Cosa include l'iscrizione di 16€?",
          answer:
            "L'iscrizione di 16€ include tutto: assicurazione infortuni personali, ristori durante il percorso, docce, pranzo conviviale, ricordi/gadget e lavaggio biciclette.",
        },
      },
    },
    {
      order: 3,
      question: "Qual é a idade mínima para participar?",
      answer:
        "A idade mínima para participar é 16 anos. O uso de capacete é obrigatório durante todo o percurso, sem exceções.",
      translations: {
        pt: {
          question: "Qual é a idade mínima para participar?",
          answer:
            "A idade mínima para participar é 16 anos. O uso de capacete é obrigatório durante todo o percurso, sem exceções.",
        },
        en: {
          question: "What is the minimum age to participate?",
          answer:
            "The minimum age to participate is 16 years. Wearing a helmet is mandatory throughout the entire ride, no exceptions.",
        },
        es: {
          question: "¿Cuál es la edad mínima para participar?",
          answer:
            "La edad mínima para participar es de 16 años. El uso del casco es obligatorio durante todo el recorrido, sin excepciones.",
        },
        fr: {
          question: "Quel est l'âge minimum pour participer?",
          answer:
            "L'âge minimum pour participer est de 16 ans. Le port du casque est obligatoire pendant toute la balade, sans exception.",
        },
        de: {
          question: "Was ist das Mindestalter für die Teilnahme?",
          answer:
            "Das Mindestalter für die Teilnahme beträgt 16 Jahre. Das Tragen eines Helms ist während der gesamten Ausfahrt Pflicht, ohne Ausnahme.",
        },
        it: {
          question: "Qual è l'età minima per partecipare?",
          answer:
            "L'età minima per partecipare è di 16 anni. L'uso del casco è obbligatorio durante tutta la passeggiata, senza eccezioni.",
        },
      },
    },
    {
      order: 4,
      question: "Qual é o número máximo de participantes?",
      answer:
        "O passeio tem um máximo de 100 participantes. As inscrições são aceites por ordem de chegada até 1 de março de 2026 ou até esgotar as vagas.",
      translations: {
        pt: {
          question: "Qual é o número máximo de participantes?",
          answer:
            "O passeio tem um máximo de 100 participantes. As inscrições são aceites por ordem de chegada até 1 de março de 2026 ou até esgotar as vagas.",
        },
        en: {
          question: "What is the maximum number of participants?",
          answer:
            "The ride has a maximum of 100 participants. Registrations are accepted on a first come, first served basis until March 1, 2026 or until spots are filled.",
        },
        es: {
          question: "¿Cuál es el número máximo de participantes?",
          answer:
            "El paseo tiene un máximo de 100 participantes. Las inscripciones se aceptan por orden de llegada hasta el 1 de marzo de 2026 o hasta agotar las plazas.",
        },
        fr: {
          question: "Quel est le nombre maximum de participants?",
          answer:
            "La balade compte un maximum de 100 participants. Les inscriptions sont acceptées par ordre d'arrivée jusqu'au 1er mars 2026 ou jusqu'à épuisement des places.",
        },
        de: {
          question: "Wie viele Teilnehmer sind maximal zugelassen?",
          answer:
            "Die Ausfahrt hat maximal 100 Teilnehmer. Anmeldungen werden nach Reihenfolge des Eingangs bis zum 1. März 2026 oder bis zur Ausschöpfung der Plätze angenommen.",
        },
        it: {
          question: "Qual è il numero massimo di partecipanti?",
          answer:
            "La passeggiata ha un massimo di 100 partecipanti. Le iscrizioni sono accettate in ordine di arrivo fino al 1° marzo 2026 o fino ad esaurimento dei posti.",
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
🚴 Passeio BTT "Entre os Trilhos da Raia" 2026 seeded successfully!
   📍 Event: Passeio BTT "Entre os Trilhos da Raia"
   🔗 Slug: ${event.slug}
   📅 Date: 2026-03-08
   📍 Location: Praça Conde de Ficalho, Vila Verde de Ficalho, Beja
   🚴 Variants: Passeio BTT ~40km
   💰 Pricing: ${pricingPhases.length} phase
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
