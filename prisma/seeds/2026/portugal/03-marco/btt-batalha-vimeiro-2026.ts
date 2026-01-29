/**
 * Seed: III BTT Batalha do Vimeiro 2026
 * Complete with translations in all 6 languages, FAQs and SEO
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding III BTT Batalha do Vimeiro 2026...");

  const eventSlug = "btt-batalha-vimeiro-2026";

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
      title: "III BTT Batalha do Vimeiro",
      description:
        "Etapa da Taça Oeste XCM BTT 2026 com Maratona 58km e Meia-Maratona 39km em Vimeiro, Lourinhã.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-08T09:00:00.000Z"),
      endDate: null,
      city: "Vimeiro, Lourinhã",
      country: "Portugal",
      latitude: 39.1833,
      longitude: -9.3167,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Vimeiro+Lourinh%C3%A3+Portugal",
      externalUrl: "https://apedalar.pt/eventos/4073/info",
      imageUrl:
        "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=1200&h=800&fit=crop",
      isFeatured: false,
      registrationDeadline: new Date("2026-03-03T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "III BTT Batalha do Vimeiro",
      description:
        "Etapa da Taça Oeste XCM BTT 2026 com Maratona 58km e Meia-Maratona 39km em Vimeiro, Lourinhã.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-08T09:00:00.000Z"),
      endDate: null,
      city: "Vimeiro, Lourinhã",
      country: "Portugal",
      latitude: 39.1833,
      longitude: -9.3167,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Vimeiro+Lourinh%C3%A3+Portugal",
      externalUrl: "https://apedalar.pt/eventos/4073/info",
      imageUrl:
        "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=1200&h=800&fit=crop",
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
      title: "III BTT Batalha do Vimeiro",
      city: "Vimeiro",
      metaTitle: "III BTT Batalha do Vimeiro 2026 | Lourinhã, Lisboa | 8 Março",
      metaDescription:
        "III BTT Batalha do Vimeiro 2026 - 8 de março em Vimeiro, Lourinhã. Maratona 58km (1200D+) e Meia-Maratona 39km (680D+). Etapa da Taça Oeste XCM BTT.",
      description: `# 🚴 III BTT Batalha do Vimeiro 2026

A **III BTT Batalha do Vimeiro** é uma etapa da **Taça Oeste XCM BTT 2026**, organizada pela **MR3eventus**. Vem pedalar pelos trilhos incríveis de Vimeiro, Lourinhã!

## 📅 Data e Local

- **Data:** 8 de março de 2026 (Domingo)
- **Hora de Partida:** 09:00
- **Local:** Vimeiro, Lourinhã
- **Distrito:** Lisboa

## 🚴 Percursos Disponíveis

| Percurso | Distância | Desnível |
|----------|-----------|----------|
| **Maratona** | 58 km | 1200 D+ |
| **Meia-Maratona** | 39 km | 680 D+ |

## 🎁 A Inscrição Inclui

- ✅ Seguro de Acidentes Pessoais
- ✅ Frontal e braçadeiras
- ✅ Brindes/Lembranças
- ✅ Banhos
- ✅ Abastecimentos líquidos e sólidos
- ✅ Abastecimento final
- ✅ Local para lavagem de bicicletas
- ✅ Fotos no Facebook oficial

## ⚡ E-Bikes

- Permitidas em ambos os percursos
- **Maratona:** Com classificação
- **Meia-Maratona:** Sem classificação

## 📧 Contacto

- **Email:** mr3eventus@gmail.com
- **Telemóvel:** 918 588 922`,
    },
    {
      language: "en",
      title: "III BTT Battle of Vimeiro",
      city: "Vimeiro",
      metaTitle: "III BTT Battle of Vimeiro 2026 | Lourinhã, Lisbon | March 8",
      metaDescription:
        "III BTT Battle of Vimeiro 2026 - March 8 in Vimeiro, Lourinhã. Marathon 58km (1200D+) and Half-Marathon 39km (680D+). West XCM BTT Cup stage.",
      description: `# 🚴 III BTT Battle of Vimeiro 2026

The **III BTT Battle of Vimeiro** is a stage of the **West XCM BTT Cup 2026**, organized by **MR3eventus**. Come pedal through the amazing trails of Vimeiro, Lourinhã!

## 📅 Date and Location

- **Date:** March 8, 2026 (Sunday)
- **Start Time:** 09:00
- **Location:** Vimeiro, Lourinhã
- **District:** Lisbon

## 🚴 Available Routes

| Route | Distance | Elevation |
|-------|----------|-----------|
| **Marathon** | 58 km | 1200 D+ |
| **Half-Marathon** | 39 km | 680 D+ |

## 🎁 Registration Includes

- ✅ Personal Accident Insurance
- ✅ Number plate and armbands
- ✅ Gifts/Souvenirs
- ✅ Showers
- ✅ Liquid and solid refreshments
- ✅ Final refreshment
- ✅ Bike washing area
- ✅ Photos on official Facebook

## ⚡ E-Bikes

- Allowed on both routes
- **Marathon:** With ranking
- **Half-Marathon:** Without ranking

## 📧 Contact

- **Email:** mr3eventus@gmail.com
- **Phone:** 918 588 922`,
    },
    {
      language: "es",
      title: "III BTT Batalla del Vimeiro",
      city: "Vimeiro",
      metaTitle:
        "III BTT Batalla del Vimeiro 2026 | Lourinhã, Lisboa | 8 Marzo",
      metaDescription:
        "III BTT Batalla del Vimeiro 2026 - 8 de marzo en Vimeiro, Lourinhã. Maratón 58km (1200D+) y Media Maratón 39km (680D+). Etapa de la Copa Oeste XCM BTT.",
      description: `# 🚴 III BTT Batalla del Vimeiro 2026

La **III BTT Batalla del Vimeiro** es una etapa de la **Copa Oeste XCM BTT 2026**, organizada por **MR3eventus**. ¡Ven a pedalear por los increíbles senderos de Vimeiro, Lourinhã!

## 📅 Fecha y Lugar

- **Fecha:** 8 de marzo de 2026 (Domingo)
- **Hora de Salida:** 09:00
- **Lugar:** Vimeiro, Lourinhã
- **Distrito:** Lisboa

## 🚴 Recorridos Disponibles

| Recorrido | Distancia | Desnivel |
|-----------|-----------|----------|
| **Maratón** | 58 km | 1200 D+ |
| **Media Maratón** | 39 km | 680 D+ |

## 🎁 La Inscripción Incluye

- ✅ Seguro de Accidentes Personales
- ✅ Dorsal y brazaletes
- ✅ Regalos/Recuerdos
- ✅ Duchas
- ✅ Avituallamientos líquidos y sólidos
- ✅ Avituallamiento final
- ✅ Zona de lavado de bicicletas
- ✅ Fotos en Facebook oficial

## ⚡ E-Bikes

- Permitidas en ambos recorridos
- **Maratón:** Con clasificación
- **Media Maratón:** Sin clasificación

## 📧 Contacto

- **Email:** mr3eventus@gmail.com
- **Teléfono:** 918 588 922`,
    },
    {
      language: "fr",
      title: "III BTT Bataille de Vimeiro",
      city: "Vimeiro",
      metaTitle:
        "III BTT Bataille de Vimeiro 2026 | Lourinhã, Lisbonne | 8 Mars",
      metaDescription:
        "III BTT Bataille de Vimeiro 2026 - 8 mars à Vimeiro, Lourinhã. Marathon 58km (1200D+) et Semi-Marathon 39km (680D+). Étape de la Coupe Ouest XCM BTT.",
      description: `# 🚴 III BTT Bataille de Vimeiro 2026

La **III BTT Bataille de Vimeiro** est une étape de la **Coupe Ouest XCM BTT 2026**, organisée par **MR3eventus**. Venez pédaler sur les sentiers incroyables de Vimeiro, Lourinhã!

## 📅 Date et Lieu

- **Date:** 8 mars 2026 (Dimanche)
- **Heure de Départ:** 09:00
- **Lieu:** Vimeiro, Lourinhã
- **District:** Lisbonne

## 🚴 Parcours Disponibles

| Parcours | Distance | Dénivelé |
|----------|----------|----------|
| **Marathon** | 58 km | 1200 D+ |
| **Semi-Marathon** | 39 km | 680 D+ |

## 🎁 L'Inscription Comprend

- ✅ Assurance Accidents Personnels
- ✅ Dossard et bracelets
- ✅ Cadeaux/Souvenirs
- ✅ Douches
- ✅ Ravitaillements liquides et solides
- ✅ Ravitaillement final
- ✅ Zone de lavage de vélos
- ✅ Photos sur Facebook officiel

## ⚡ E-Bikes

- Autorisés sur les deux parcours
- **Marathon:** Avec classement
- **Semi-Marathon:** Sans classement

## 📧 Contact

- **Email:** mr3eventus@gmail.com
- **Téléphone:** 918 588 922`,
    },
    {
      language: "de",
      title: "III BTT Schlacht von Vimeiro",
      city: "Vimeiro",
      metaTitle:
        "III BTT Schlacht von Vimeiro 2026 | Lourinhã, Lissabon | 8. März",
      metaDescription:
        "III BTT Schlacht von Vimeiro 2026 - 8. März in Vimeiro, Lourinhã. Marathon 58km (1200D+) und Halbmarathon 39km (680D+). West XCM BTT Pokal Etappe.",
      description: `# 🚴 III BTT Schlacht von Vimeiro 2026

Die **III BTT Schlacht von Vimeiro** ist eine Etappe des **West XCM BTT Pokals 2026**, organisiert von **MR3eventus**. Komm und fahre durch die unglaublichen Trails von Vimeiro, Lourinhã!

## 📅 Datum und Ort

- **Datum:** 8. März 2026 (Sonntag)
- **Startzeit:** 09:00 Uhr
- **Ort:** Vimeiro, Lourinhã
- **Bezirk:** Lissabon

## 🚴 Verfügbare Strecken

| Strecke | Distanz | Höhenunterschied |
|---------|---------|------------------|
| **Marathon** | 58 km | 1200 D+ |
| **Halbmarathon** | 39 km | 680 D+ |

## 🎁 Die Anmeldung Beinhaltet

- ✅ Persönliche Unfallversicherung
- ✅ Startnummer und Armbänder
- ✅ Geschenke/Andenken
- ✅ Duschen
- ✅ Flüssige und feste Verpflegung
- ✅ Endverpflegung
- ✅ Fahrradwaschbereich
- ✅ Fotos auf offiziellem Facebook

## ⚡ E-Bikes

- Auf beiden Strecken erlaubt
- **Marathon:** Mit Wertung
- **Halbmarathon:** Ohne Wertung

## 📧 Kontakt

- **Email:** mr3eventus@gmail.com
- **Telefon:** 918 588 922`,
    },
    {
      language: "it",
      title: "III BTT Battaglia di Vimeiro",
      city: "Vimeiro",
      metaTitle:
        "III BTT Battaglia di Vimeiro 2026 | Lourinhã, Lisbona | 8 Marzo",
      metaDescription:
        "III BTT Battaglia di Vimeiro 2026 - 8 marzo a Vimeiro, Lourinhã. Maratona 58km (1200D+) e Mezza Maratona 39km (680D+). Tappa della Coppa Ovest XCM BTT.",
      description: `# 🚴 III BTT Battaglia di Vimeiro 2026

La **III BTT Battaglia di Vimeiro** è una tappa della **Coppa Ovest XCM BTT 2026**, organizzata da **MR3eventus**. Vieni a pedalare sui sentieri incredibili di Vimeiro, Lourinhã!

## 📅 Data e Luogo

- **Data:** 8 marzo 2026 (Domenica)
- **Orario di Partenza:** 09:00
- **Luogo:** Vimeiro, Lourinhã
- **Distretto:** Lisbona

## 🚴 Percorsi Disponibili

| Percorso | Distanza | Dislivello |
|----------|----------|------------|
| **Maratona** | 58 km | 1200 D+ |
| **Mezza Maratona** | 39 km | 680 D+ |

## 🎁 L'Iscrizione Include

- ✅ Assicurazione Infortuni Personali
- ✅ Pettorale e braccialetti
- ✅ Regali/Ricordi
- ✅ Docce
- ✅ Ristori liquidi e solidi
- ✅ Ristoro finale
- ✅ Area lavaggio biciclette
- ✅ Foto su Facebook ufficiale

## ⚡ E-Bikes

- Consentite su entrambi i percorsi
- **Maratona:** Con classifica
- **Mezza Maratona:** Senza classifica

## 📧 Contatto

- **Email:** mr3eventus@gmail.com
- **Telefono:** 918 588 922`,
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

  // Variant 1: Maratona 58km
  const maratona = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Maratona 58km",
      distanceKm: 58,
      elevationGainM: 1200,
      elevationLossM: 1200,
      startTime: "09:00",
      price: 18.0,
      currency: "EUR",
    },
  });

  const maratonaTranslations = [
    {
      language: "pt" as const,
      name: "Maratona 58km",
      description:
        "Percurso de 58km com 1200m de desnível positivo. Percurso completo pelos trilhos de Vimeiro. E-Bikes permitidas com classificação.",
    },
    {
      language: "en" as const,
      name: "Marathon 58km",
      description:
        "58km route with 1200m positive elevation. Full route through Vimeiro trails. E-Bikes allowed with ranking.",
    },
    {
      language: "es" as const,
      name: "Maratón 58km",
      description:
        "Recorrido de 58km con 1200m de desnivel positivo. Recorrido completo por los senderos de Vimeiro. E-Bikes permitidas con clasificación.",
    },
    {
      language: "fr" as const,
      name: "Marathon 58km",
      description:
        "Parcours de 58km avec 1200m de dénivelé positif. Parcours complet à travers les sentiers de Vimeiro. E-Bikes autorisés avec classement.",
    },
    {
      language: "de" as const,
      name: "Marathon 58km",
      description:
        "58km Strecke mit 1200m positivem Höhenunterschied. Komplette Strecke durch die Trails von Vimeiro. E-Bikes erlaubt mit Wertung.",
    },
    {
      language: "it" as const,
      name: "Maratona 58km",
      description:
        "Percorso di 58km con 1200m di dislivello positivo. Percorso completo attraverso i sentieri di Vimeiro. E-Bikes consentite con classifica.",
    },
  ];

  for (const translation of maratonaTranslations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: maratona.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: maratona.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  console.log("   ✅ Maratona 58km created");

  // Variant 2: Meia-Maratona 39km
  const meiaMaratona = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Meia-Maratona 39km",
      distanceKm: 39,
      elevationGainM: 680,
      elevationLossM: 680,
      startTime: "09:00",
      price: 18.0,
      currency: "EUR",
    },
  });

  const meiaMaratonaTranslations = [
    {
      language: "pt" as const,
      name: "Meia-Maratona 39km",
      description:
        "Percurso de 39km com 680m de desnível positivo. Percurso intermédio ideal para quem quer um desafio equilibrado. E-Bikes permitidas sem classificação.",
    },
    {
      language: "en" as const,
      name: "Half-Marathon 39km",
      description:
        "39km route with 680m positive elevation. Intermediate route ideal for a balanced challenge. E-Bikes allowed without ranking.",
    },
    {
      language: "es" as const,
      name: "Media Maratón 39km",
      description:
        "Recorrido de 39km con 680m de desnivel positivo. Recorrido intermedio ideal para un desafío equilibrado. E-Bikes permitidas sin clasificación.",
    },
    {
      language: "fr" as const,
      name: "Semi-Marathon 39km",
      description:
        "Parcours de 39km avec 680m de dénivelé positif. Parcours intermédiaire idéal pour un défi équilibré. E-Bikes autorisés sans classement.",
    },
    {
      language: "de" as const,
      name: "Halbmarathon 39km",
      description:
        "39km Strecke mit 680m positivem Höhenunterschied. Mittlere Strecke ideal für eine ausgewogene Herausforderung. E-Bikes erlaubt ohne Wertung.",
    },
    {
      language: "it" as const,
      name: "Mezza Maratona 39km",
      description:
        "Percorso di 39km con 680m di dislivello positivo. Percorso intermedio ideale per una sfida equilibrata. E-Bikes consentite senza classifica.",
    },
  ];

  for (const translation of meiaMaratonaTranslations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: meiaMaratona.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: meiaMaratona.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  console.log("   ✅ Meia-Maratona 39km created");

  // Step 5: Create pricing phases (linked to eventId, NOT variantId)
  console.log("💰 Creating pricing phases...");

  const pricingPhases = [
    {
      name: "1ª Fase",
      startDate: new Date("2025-12-01T00:00:00.000Z"),
      endDate: new Date("2026-02-15T23:59:59.000Z"),
      price: 15.0,
      currency: "EUR" as const,
      note: "Preço promocional",
    },
    {
      name: "2ª Fase",
      startDate: new Date("2026-02-16T00:00:00.000Z"),
      endDate: new Date("2026-03-01T23:59:59.000Z"),
      price: 18.0,
      currency: "EUR" as const,
      note: "Preço normal",
    },
    {
      name: "Fora de Prazo",
      startDate: new Date("2026-03-02T00:00:00.000Z"),
      endDate: new Date("2026-03-03T23:59:59.000Z"),
      price: 20.0,
      currency: "EUR" as const,
      note: "Inscrições tardias",
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

  console.log("   ✅ Pricing phases created (3 phases)");

  // Step 6: Create FAQs with translations
  console.log("❓ Creating FAQs...");

  const faqs = [
    {
      order: 1,
      question: "Posso participar com E-Bike?",
      answer:
        "Sim, E-Bikes são permitidas em ambos os percursos. Na Maratona tens classificação, na Meia-Maratona participas sem classificação. Não é permitida a troca de baterias ou uso de baterias auxiliares.",
      translations: {
        pt: {
          question: "Posso participar com E-Bike?",
          answer:
            "Sim, E-Bikes são permitidas em ambos os percursos. Na Maratona tens classificação, na Meia-Maratona participas sem classificação. Não é permitida a troca de baterias ou uso de baterias auxiliares.",
        },
        en: {
          question: "Can I participate with an E-Bike?",
          answer:
            "Yes, E-Bikes are allowed on both routes. In the Marathon you have ranking, in the Half-Marathon you participate without ranking. Battery swapping or auxiliary batteries are not allowed.",
        },
        es: {
          question: "¿Puedo participar con E-Bike?",
          answer:
            "Sí, las E-Bikes están permitidas en ambos recorridos. En la Maratón tienes clasificación, en la Media Maratón participas sin clasificación. No se permite el cambio de baterías ni el uso de baterías auxiliares.",
        },
        fr: {
          question: "Puis-je participer avec un E-Bike?",
          answer:
            "Oui, les E-Bikes sont autorisés sur les deux parcours. Au Marathon vous avez un classement, au Semi-Marathon vous participez sans classement. Le changement de batteries ou les batteries auxiliaires ne sont pas autorisés.",
        },
        de: {
          question: "Kann ich mit einem E-Bike teilnehmen?",
          answer:
            "Ja, E-Bikes sind auf beiden Strecken erlaubt. Beim Marathon hast du eine Wertung, beim Halbmarathon nimmst du ohne Wertung teil. Batteriewechsel oder Zusatzbatterien sind nicht erlaubt.",
        },
        it: {
          question: "Posso partecipare con una E-Bike?",
          answer:
            "Sì, le E-Bikes sono consentite su entrambi i percorsi. Nella Maratona hai la classifica, nella Mezza Maratona partecipi senza classifica. Non è consentito lo scambio di batterie o l'uso di batterie ausiliarie.",
        },
      },
    },
    {
      order: 2,
      question: "Qual é a idade mínima para participar?",
      answer:
        "A idade mínima é 18 anos. Participantes menores de 18 anos podem participar mediante autorização escrita dos pais/encarregados de educação, enviada até 5 dias antes do evento.",
      translations: {
        pt: {
          question: "Qual é a idade mínima para participar?",
          answer:
            "A idade mínima é 18 anos. Participantes menores de 18 anos podem participar mediante autorização escrita dos pais/encarregados de educação, enviada até 5 dias antes do evento.",
        },
        en: {
          question: "What is the minimum age to participate?",
          answer:
            "The minimum age is 18 years. Participants under 18 can participate with written authorization from parents/guardians, sent up to 5 days before the event.",
        },
        es: {
          question: "¿Cuál es la edad mínima para participar?",
          answer:
            "La edad mínima es 18 años. Los participantes menores de 18 años pueden participar con autorización escrita de los padres/tutores, enviada hasta 5 días antes del evento.",
        },
        fr: {
          question: "Quel est l'âge minimum pour participer?",
          answer:
            "L'âge minimum est de 18 ans. Les participants de moins de 18 ans peuvent participer avec une autorisation écrite des parents/tuteurs, envoyée jusqu'à 5 jours avant l'événement.",
        },
        de: {
          question: "Was ist das Mindestalter für die Teilnahme?",
          answer:
            "Das Mindestalter beträgt 18 Jahre. Teilnehmer unter 18 Jahren können mit schriftlicher Genehmigung der Eltern/Erziehungsberechtigten teilnehmen, die bis zu 5 Tage vor der Veranstaltung eingereicht werden muss.",
        },
        it: {
          question: "Qual è l'età minima per partecipare?",
          answer:
            "L'età minima è 18 anni. I partecipanti under 18 possono partecipare con autorizzazione scritta dei genitori/tutori, inviata fino a 5 giorni prima dell'evento.",
        },
      },
    },
    {
      order: 3,
      question: "Quais são os horários do secretariado?",
      answer:
        "O secretariado funciona no dia anterior das 17h00 às 19h00, e no dia do evento das 07h30 às 09h30. As boxes abrem às 08h30 e fecham às 08h55. A prova inicia às 09h00.",
      translations: {
        pt: {
          question: "Quais são os horários do secretariado?",
          answer:
            "O secretariado funciona no dia anterior das 17h00 às 19h00, e no dia do evento das 07h30 às 09h30. As boxes abrem às 08h30 e fecham às 08h55. A prova inicia às 09h00.",
        },
        en: {
          question: "What are the registration desk hours?",
          answer:
            "The registration desk operates the day before from 17:00 to 19:00, and on event day from 07:30 to 09:30. Boxes open at 08:30 and close at 08:55. The race starts at 09:00.",
        },
        es: {
          question: "¿Cuáles son los horarios de secretaría?",
          answer:
            "La secretaría funciona el día anterior de 17:00 a 19:00, y el día del evento de 07:30 a 09:30. Los boxes abren a las 08:30 y cierran a las 08:55. La carrera empieza a las 09:00.",
        },
        fr: {
          question: "Quels sont les horaires du secrétariat?",
          answer:
            "Le secrétariat fonctionne la veille de 17h00 à 19h00, et le jour de l'événement de 07h30 à 09h30. Les boxes ouvrent à 08h30 et ferment à 08h55. La course commence à 09h00.",
        },
        de: {
          question: "Wann ist das Sekretariat geöffnet?",
          answer:
            "Das Sekretariat ist am Vortag von 17:00 bis 19:00 Uhr und am Veranstaltungstag von 07:30 bis 09:30 Uhr geöffnet. Die Boxen öffnen um 08:30 Uhr und schließen um 08:55 Uhr. Das Rennen startet um 09:00 Uhr.",
        },
        it: {
          question: "Quali sono gli orari della segreteria?",
          answer:
            "La segreteria funziona il giorno precedente dalle 17:00 alle 19:00, e il giorno dell'evento dalle 07:30 alle 09:30. I box aprono alle 08:30 e chiudono alle 08:55. La gara inizia alle 09:00.",
        },
      },
    },
    {
      order: 4,
      question: "É obrigatório usar capacete?",
      answer:
        "Sim, é obrigatório usar capacete homologado para ciclismo, corretamente colocado durante toda a prova. Participantes com capacete mal colocado podem ser parados pela organização.",
      translations: {
        pt: {
          question: "É obrigatório usar capacete?",
          answer:
            "Sim, é obrigatório usar capacete homologado para ciclismo, corretamente colocado durante toda a prova. Participantes com capacete mal colocado podem ser parados pela organização.",
        },
        en: {
          question: "Is wearing a helmet mandatory?",
          answer:
            "Yes, wearing a cycling-approved helmet is mandatory, correctly placed throughout the race. Participants with improperly placed helmets may be stopped by the organization.",
        },
        es: {
          question: "¿Es obligatorio usar casco?",
          answer:
            "Sí, es obligatorio usar casco homologado para ciclismo, correctamente colocado durante toda la prueba. Los participantes con casco mal colocado pueden ser detenidos por la organización.",
        },
        fr: {
          question: "Le port du casque est-il obligatoire?",
          answer:
            "Oui, le port d'un casque homologué pour le cyclisme est obligatoire, correctement placé pendant toute la course. Les participants avec un casque mal placé peuvent être arrêtés par l'organisation.",
        },
        de: {
          question: "Ist das Tragen eines Helms Pflicht?",
          answer:
            "Ja, das Tragen eines für Radfahren zugelassenen Helms ist Pflicht, korrekt platziert während des gesamten Rennens. Teilnehmer mit falsch platzierten Helmen können von der Organisation gestoppt werden.",
        },
        it: {
          question: "È obbligatorio indossare il casco?",
          answer:
            "Sì, è obbligatorio indossare un casco omologato per il ciclismo, correttamente posizionato durante tutta la gara. I partecipanti con casco mal posizionato possono essere fermati dall'organizzazione.",
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
🎉 III BTT Batalha do Vimeiro 2026 seeded successfully!
   📍 Event: III BTT Batalha do Vimeiro
   🔗 Slug: ${event.slug}
   📅 Date: 2026-03-08
   📍 Location: Vimeiro, Lourinhã, Portugal
   🚴 Variants: Maratona 58km, Meia-Maratona 39km
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
