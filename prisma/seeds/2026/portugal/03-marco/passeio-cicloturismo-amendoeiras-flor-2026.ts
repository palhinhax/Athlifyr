/**
 * Seed: XXXVII Passeio de Cicloturismo das Amendoeiras em Flor 2026
 * Complete with translations in all 6 languages, FAQs and SEO
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(
    "🌸 Seeding XXXVII Passeio de Cicloturismo das Amendoeiras em Flor 2026..."
  );

  const eventSlug = "passeio-cicloturismo-amendoeiras-flor-2026";

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
      title: "XXXVII Passeio de Cicloturismo das Amendoeiras em Flor",
      description:
        "37.ª edição do Passeio de Cicloturismo das Amendoeiras em Flor, integrado nas Festas da Amendoeira em Flor de Vila Nova de Foz Côa. Percurso de 50km pela EN 222 até Almendra, no coração do Vale do Côa.",
      sportTypes: [SportType.CYCLING],
      startDate: new Date("2026-03-01T09:00:00.000Z"),
      endDate: null,
      city: "Vila Nova de Foz Côa",
      country: "Portugal",
      latitude: 41.0833,
      longitude: -7.1333,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Pra%C3%A7a+do+Munic%C3%ADpio+Vila+Nova+de+Foz+C%C3%B4a",
      externalUrl: "",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-02-24T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "XXXVII Passeio de Cicloturismo das Amendoeiras em Flor",
      description:
        "37.ª edição do Passeio de Cicloturismo das Amendoeiras em Flor, integrado nas Festas da Amendoeira em Flor de Vila Nova de Foz Côa. Percurso de 50km pela EN 222 até Almendra, no coração do Vale do Côa.",
      sportTypes: [SportType.CYCLING],
      startDate: new Date("2026-03-01T09:00:00.000Z"),
      endDate: null,
      city: "Vila Nova de Foz Côa",
      country: "Portugal",
      latitude: 41.0833,
      longitude: -7.1333,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Pra%C3%A7a+do+Munic%C3%ADpio+Vila+Nova+de+Foz+C%C3%B4a",
      externalUrl: "",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-02-24T23:59:59.000Z"),
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
      title: "XXXVII Passeio de Cicloturismo das Amendoeiras em Flor",
      city: "Vila Nova de Foz Côa",
      metaTitle:
        "XXXVII Passeio Cicloturismo Amendoeiras em Flor 2026 | Foz Côa | 1 Março",
      metaDescription:
        "37.ª edição do Passeio de Cicloturismo das Amendoeiras em Flor - 1 de março em Vila Nova de Foz Côa. Percurso de 50km pela EN 222 e Caminhada de 10km. Almoço incluído.",
      description: `# 🌸 XXXVII Passeio de Cicloturismo das Amendoeiras em Flor 2026

O **XXXVII Passeio de Cicloturismo das Amendoeiras em Flor** é organizado pela **Associação de Cicloturismo de Vila Nova de Foz Côa**, integrado nas **Festas da Amendoeira em Flor**, organizadas pelo Município de Vila Nova de Foz Côa. Uma tradição com 37 anos no coração do Vale do Côa!

## 📅 Data e Local

- **Data:** 1 de março de 2026 (Domingo)
- **Secretariado:** 08:00 na Escola Secundária (entrada pela R. das Escolas)
- **Partida Oficial:** 09:00 da Praça do Município
- **Local:** Vila Nova de Foz Côa
- **Distrito:** Guarda

## 🚴 Percurso

| Detalhes | Informação |
|----------|------------|
| **Distância** | ~50 km |
| **Itinerário** | Foz Côa → EN 222 → Almendra → EN 222 → Foz Côa |
| **Velocidade média** | 17 km/h |
| **Máx. participantes** | 150 |

## 📋 Programa

- **08:00** - Secretariado na Escola Secundária
- **08:45** - Saída para a Praça do Município
- **09:00** - Partida Oficial
- **10:30** - Reforço alimentar em Almendra
- **13:00** - Chegada a Foz Côa
- **13:30** - Almoço na cantina da Escola Secundária

## 🎁 A Inscrição Inclui

- ✅ Almoço na cantina da Escola Secundária
- ✅ Dorsal
- ✅ Seguro de acidentes pessoais e responsabilidade civil
- ✅ Lembranças alusivas ao evento
- ✅ Abastecimento em Almendra
- ✅ Ambulância e carro vassoura
- ✅ Acesso a balneários na Escola Secundária

## 🏆 Prémios de Reconhecimento

- 🧒 Participante mais novo
- 👴 Participante mais velho
- 👥 Equipa mais numerosa
- 🗺️ Equipa de mais longe

## 📧 Contacto

- **Telemóvel:** 910 358 970`,
    },
    {
      language: "en",
      title: "37th Almond Blossom Cycling Tour",
      city: "Vila Nova de Foz Côa",
      metaTitle:
        "37th Almond Blossom Cycling Tour 2026 | Foz Côa, Portugal | March 1",
      metaDescription:
        "37th Almond Blossom Cycling Tour - March 1 in Vila Nova de Foz Côa. 50km route along EN 222 and 10km Walking Tour. Lunch included. Part of the Almond Blossom Festival in the Côa Valley.",
      description: `# 🌸 37th Almond Blossom Cycling Tour 2026

The **37th Almond Blossom Cycling Tour** is organized by the **Cycling Tourism Association of Vila Nova de Foz Côa**, as part of the **Almond Blossom Festival**, organized by the Municipality of Vila Nova de Foz Côa. A 37-year tradition in the heart of the Côa Valley!

## 📅 Date and Location

- **Date:** March 1, 2026 (Sunday)
- **Registration:** 08:00 at the Secondary School (entrance via R. das Escolas)
- **Official Start:** 09:00 from Praça do Município
- **Location:** Vila Nova de Foz Côa
- **District:** Guarda

## 🚴 Route

| Details | Information |
|---------|-------------|
| **Distance** | ~50 km |
| **Itinerary** | Foz Côa → EN 222 → Almendra → EN 222 → Foz Côa |
| **Average speed** | 17 km/h |
| **Max. participants** | 150 |

## 📋 Schedule

- **08:00** - Registration at Secondary School
- **08:45** - Departure to Praça do Município
- **09:00** - Official Start
- **10:30** - Refreshment stop in Almendra
- **13:00** - Arrival at Foz Côa
- **13:30** - Lunch at the school canteen

## 🎁 Registration Includes

- ✅ Lunch at the school canteen
- ✅ Race number
- ✅ Personal accident and liability insurance
- ✅ Event souvenirs
- ✅ Refreshment in Almendra
- ✅ Ambulance and broom wagon
- ✅ Changing rooms at the school

## 🏆 Recognition Awards

- 🧒 Youngest participant
- 👴 Oldest participant
- 👥 Largest team
- 🗺️ Team from farthest away

## 📧 Contact

- **Phone:** 910 358 970`,
    },
    {
      language: "es",
      title: "XXXVII Paseo de Cicloturismo de los Almendros en Flor",
      city: "Vila Nova de Foz Côa",
      metaTitle:
        "XXXVII Paseo Cicloturismo Almendros en Flor 2026 | Foz Côa | 1 Marzo",
      metaDescription:
        "37.ª edición del Paseo de Cicloturismo de los Almendros en Flor - 1 de marzo en Vila Nova de Foz Côa. Recorrido de 50km por la EN 222 y Caminata de 10km. Almuerzo incluido.",
      description: `# 🌸 XXXVII Paseo de Cicloturismo de los Almendros en Flor 2026

El **XXXVII Paseo de Cicloturismo de los Almendros en Flor** está organizado por la **Asociación de Cicloturismo de Vila Nova de Foz Côa**, integrado en las **Fiestas del Almendro en Flor**, organizadas por el Municipio de Vila Nova de Foz Côa. ¡Una tradición de 37 años en el corazón del Valle del Côa!

## 📅 Fecha y Lugar

- **Fecha:** 1 de marzo de 2026 (Domingo)
- **Secretaría:** 08:00 en la Escuela Secundaria (entrada por R. das Escolas)
- **Salida Oficial:** 09:00 desde la Praça do Município
- **Lugar:** Vila Nova de Foz Côa
- **Distrito:** Guarda

## 🚴 Recorrido

| Detalles | Información |
|----------|-------------|
| **Distancia** | ~50 km |
| **Itinerario** | Foz Côa → EN 222 → Almendra → EN 222 → Foz Côa |
| **Velocidad media** | 17 km/h |
| **Máx. participantes** | 150 |

## 📋 Programa

- **08:00** - Secretaría en la Escuela Secundaria
- **08:45** - Salida hacia la Praça do Município
- **09:00** - Salida Oficial
- **10:30** - Avituallamiento en Almendra
- **13:00** - Llegada a Foz Côa
- **13:30** - Almuerzo en el comedor de la Escuela

## 🎁 La Inscripción Incluye

- ✅ Almuerzo en el comedor de la Escuela
- ✅ Dorsal
- ✅ Seguro de accidentes personales y responsabilidad civil
- ✅ Recuerdos del evento
- ✅ Avituallamiento en Almendra
- ✅ Ambulancia y coche escoba
- ✅ Acceso a vestuarios en la Escuela

## 🏆 Premios de Reconocimiento

- 🧒 Participante más joven
- 👴 Participante más mayor
- 👥 Equipo más numeroso
- 🗺️ Equipo de más lejos

## 📧 Contacto

- **Teléfono:** 910 358 970`,
    },
    {
      language: "fr",
      title: "XXXVIIe Tour Cyclotouriste des Amandiers en Fleur",
      city: "Vila Nova de Foz Côa",
      metaTitle:
        "XXXVIIe Tour Cyclotouriste Amandiers en Fleur 2026 | Foz Côa | 1er Mars",
      metaDescription:
        "37e édition du Tour Cyclotouriste des Amandiers en Fleur - 1er mars à Vila Nova de Foz Côa. Parcours de 50km sur la EN 222 et Randonnée de 10km. Déjeuner inclus.",
      description: `# 🌸 XXXVIIe Tour Cyclotouriste des Amandiers en Fleur 2026

Le **XXXVIIe Tour Cyclotouriste des Amandiers en Fleur** est organisé par l'**Association de Cyclotourisme de Vila Nova de Foz Côa**, dans le cadre de la **Fête des Amandiers en Fleur**, organisée par la Municipalité de Vila Nova de Foz Côa. Une tradition de 37 ans au cœur de la Vallée du Côa !

## 📅 Date et Lieu

- **Date:** 1er mars 2026 (Dimanche)
- **Secrétariat:** 08:00 à l'École Secondaire (entrée par R. das Escolas)
- **Départ Officiel:** 09:00 depuis la Praça do Município
- **Lieu:** Vila Nova de Foz Côa
- **District:** Guarda

## 🚴 Parcours

| Détails | Information |
|---------|-------------|
| **Distance** | ~50 km |
| **Itinéraire** | Foz Côa → EN 222 → Almendra → EN 222 → Foz Côa |
| **Vitesse moyenne** | 17 km/h |
| **Max. participants** | 150 |

## 📋 Programme

- **08:00** - Secrétariat à l'École Secondaire
- **08:45** - Départ vers la Praça do Município
- **09:00** - Départ Officiel
- **10:30** - Ravitaillement à Almendra
- **13:00** - Arrivée à Foz Côa
- **13:30** - Déjeuner à la cantine de l'École

## 🎁 L'Inscription Comprend

- ✅ Déjeuner à la cantine de l'École
- ✅ Dossard
- ✅ Assurance accidents personnels et responsabilité civile
- ✅ Souvenirs de l'événement
- ✅ Ravitaillement à Almendra
- ✅ Ambulance et voiture balai
- ✅ Accès aux vestiaires à l'École

## 🏆 Prix de Reconnaissance

- 🧒 Participant le plus jeune
- 👴 Participant le plus âgé
- 👥 Équipe la plus nombreuse
- 🗺️ Équipe la plus éloignée

## 📧 Contact

- **Téléphone:** 910 358 970`,
    },
    {
      language: "de",
      title: "XXXVII. Mandelblüten-Radtour",
      city: "Vila Nova de Foz Côa",
      metaTitle:
        "XXXVII. Mandelblüten-Radtour 2026 | Foz Côa, Portugal | 1. März",
      metaDescription:
        "37. Ausgabe der Mandelblüten-Radtour - 1. März in Vila Nova de Foz Côa. 50km Strecke auf der EN 222 und 10km Wanderung. Mittagessen inklusive.",
      description: `# 🌸 XXXVII. Mandelblüten-Radtour 2026

Die **XXXVII. Mandelblüten-Radtour** wird vom **Radtouristikverein Vila Nova de Foz Côa** organisiert, eingebettet in das **Mandelblütenfest**, veranstaltet von der Gemeinde Vila Nova de Foz Côa. Eine 37-jährige Tradition im Herzen des Côa-Tals!

## 📅 Datum und Ort

- **Datum:** 1. März 2026 (Sonntag)
- **Sekretariat:** 08:00 Uhr an der Sekundarschule (Eingang über R. das Escolas)
- **Offizieller Start:** 09:00 Uhr von der Praça do Município
- **Ort:** Vila Nova de Foz Côa
- **Bezirk:** Guarda

## 🚴 Strecke

| Details | Information |
|---------|-------------|
| **Distanz** | ~50 km |
| **Route** | Foz Côa → EN 222 → Almendra → EN 222 → Foz Côa |
| **Durchschnittsgeschwindigkeit** | 17 km/h |
| **Max. Teilnehmer** | 150 |

## 📋 Programm

- **08:00** - Sekretariat an der Sekundarschule
- **08:45** - Abfahrt zur Praça do Município
- **09:00** - Offizieller Start
- **10:30** - Verpflegung in Almendra
- **13:00** - Ankunft in Foz Côa
- **13:30** - Mittagessen in der Schulkantine

## 🎁 Die Anmeldung Beinhaltet

- ✅ Mittagessen in der Schulkantine
- ✅ Startnummer
- ✅ Persönliche Unfallversicherung und Haftpflichtversicherung
- ✅ Erinnerungsgeschenke
- ✅ Verpflegung in Almendra
- ✅ Krankenwagen und Besenfahrzeug
- ✅ Zugang zu Umkleidekabinen an der Schule

## 🏆 Anerkennungspreise

- 🧒 Jüngster Teilnehmer
- 👴 Ältester Teilnehmer
- 👥 Größtes Team
- 🗺️ Team von am weitesten entfernt

## 📧 Kontakt

- **Telefon:** 910 358 970`,
    },
    {
      language: "it",
      title: "XXXVII Tour Cicloturistico dei Mandorli in Fiore",
      city: "Vila Nova de Foz Côa",
      metaTitle:
        "XXXVII Tour Cicloturistico Mandorli in Fiore 2026 | Foz Côa | 1 Marzo",
      metaDescription:
        "37ª edizione del Tour Cicloturistico dei Mandorli in Fiore - 1 marzo a Vila Nova de Foz Côa. Percorso di 50km sulla EN 222 e Passeggiata di 10km. Pranzo incluso.",
      description: `# 🌸 XXXVII Tour Cicloturistico dei Mandorli in Fiore 2026

Il **XXXVII Tour Cicloturistico dei Mandorli in Fiore** è organizzato dall'**Associazione di Cicloturismo di Vila Nova de Foz Côa**, nell'ambito della **Festa dei Mandorli in Fiore**, organizzata dal Comune di Vila Nova de Foz Côa. Una tradizione di 37 anni nel cuore della Valle del Côa!

## 📅 Data e Luogo

- **Data:** 1 marzo 2026 (Domenica)
- **Segreteria:** 08:00 presso la Scuola Secondaria (ingresso da R. das Escolas)
- **Partenza Ufficiale:** 09:00 dalla Praça do Município
- **Luogo:** Vila Nova de Foz Côa
- **Distretto:** Guarda

## 🚴 Percorso

| Dettagli | Informazione |
|----------|--------------|
| **Distanza** | ~50 km |
| **Itinerario** | Foz Côa → EN 222 → Almendra → EN 222 → Foz Côa |
| **Velocità media** | 17 km/h |
| **Max. partecipanti** | 150 |

## 📋 Programma

- **08:00** - Segreteria alla Scuola Secondaria
- **08:45** - Partenza verso la Praça do Município
- **09:00** - Partenza Ufficiale
- **10:30** - Ristoro ad Almendra
- **13:00** - Arrivo a Foz Côa
- **13:30** - Pranzo nella mensa della Scuola

## 🎁 L'Iscrizione Include

- ✅ Pranzo nella mensa della Scuola
- ✅ Pettorale
- ✅ Assicurazione infortuni personali e responsabilità civile
- ✅ Ricordi dell'evento
- ✅ Ristoro ad Almendra
- ✅ Ambulanza e auto scopa
- ✅ Accesso agli spogliatoi della Scuola

## 🏆 Premi di Riconoscimento

- 🧒 Partecipante più giovane
- 👴 Partecipante più anziano
- 👥 Squadra più numerosa
- 🗺️ Squadra da più lontano

## 📧 Contatto

- **Telefono:** 910 358 970`,
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

  // Variant 1: Passeio de Cicloturismo ~50km
  const passeio = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Passeio de Cicloturismo",
      distanceKm: 50,
      startTime: "09:00",
      maxParticipants: 150,
      price: 17.0,
      currency: "EUR",
    },
  });

  const passeioTranslations = [
    {
      language: "pt" as const,
      name: "Passeio de Cicloturismo",
      description:
        "Percurso de ~50km pela EN 222, de Foz Côa a Almendra e regresso. Velocidade média de 17 km/h. Evento não competitivo. Capacete obrigatório. Almoço incluído na inscrição.",
    },
    {
      language: "en" as const,
      name: "Cycling Tour",
      description:
        "~50km route along EN 222, from Foz Côa to Almendra and back. Average speed 17 km/h. Non-competitive event. Helmet mandatory. Lunch included in registration.",
    },
    {
      language: "es" as const,
      name: "Paseo de Cicloturismo",
      description:
        "Recorrido de ~50km por la EN 222, de Foz Côa a Almendra y regreso. Velocidad media de 17 km/h. Evento no competitivo. Casco obligatorio. Almuerzo incluido.",
    },
    {
      language: "fr" as const,
      name: "Tour Cyclotouriste",
      description:
        "Parcours de ~50km sur la EN 222, de Foz Côa à Almendra aller-retour. Vitesse moyenne de 17 km/h. Événement non compétitif. Casque obligatoire. Déjeuner inclus.",
    },
    {
      language: "de" as const,
      name: "Radtour",
      description:
        "~50km Strecke auf der EN 222, von Foz Côa nach Almendra und zurück. Durchschnittsgeschwindigkeit 17 km/h. Nicht-kompetitives Event. Helm Pflicht. Mittagessen inklusive.",
    },
    {
      language: "it" as const,
      name: "Tour Cicloturistico",
      description:
        "Percorso di ~50km sulla EN 222, da Foz Côa ad Almendra andata e ritorno. Velocità media di 17 km/h. Evento non competitivo. Casco obbligatorio. Pranzo incluso.",
    },
  ];

  for (const translation of passeioTranslations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: passeio.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: passeio.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  console.log("   ✅ Passeio de Cicloturismo ~50km created");

  // Variant 2: Caminhada 10km
  const caminhada = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Caminhada 10km",
      distanceKm: 10,
      price: 10.0,
      currency: "EUR",
    },
  });

  const caminhadaTranslations = [
    {
      language: "pt" as const,
      name: "Caminhada 10km",
      description: "Caminhada de 10km. Almoço incluído na inscrição.",
    },
    {
      language: "en" as const,
      name: "Walking Tour 10km",
      description: "10km walking tour. Lunch included in registration.",
    },
    {
      language: "es" as const,
      name: "Caminata 10km",
      description: "Caminata de 10km. Almuerzo incluido en la inscripción.",
    },
    {
      language: "fr" as const,
      name: "Randonnée 10km",
      description: "Randonnée de 10km. Déjeuner inclus dans l'inscription.",
    },
    {
      language: "de" as const,
      name: "Wanderung 10km",
      description: "10km Wanderung. Mittagessen in der Anmeldung inklusive.",
    },
    {
      language: "it" as const,
      name: "Passeggiata 10km",
      description: "Passeggiata di 10km. Pranzo incluso nell'iscrizione.",
    },
  ];

  for (const translation of caminhadaTranslations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: caminhada.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: caminhada.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  console.log("   ✅ Caminhada 10km created");

  // Variant 3: Acompanhantes
  const acompanhantes = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Acompanhantes",
      price: 10.0,
      currency: "EUR",
    },
  });

  const acompanhantesTranslations = [
    {
      language: "pt" as const,
      name: "Acompanhantes",
      description:
        "Inscrição para acompanhantes (maiores de 10 anos). Inclui almoço e participação na caminhada.",
    },
    {
      language: "en" as const,
      name: "Companions",
      description:
        "Companion registration (over 10 years old). Includes lunch and walking tour participation.",
    },
    {
      language: "es" as const,
      name: "Acompañantes",
      description:
        "Inscripción para acompañantes (mayores de 10 años). Incluye almuerzo y participación en la caminata.",
    },
    {
      language: "fr" as const,
      name: "Accompagnants",
      description:
        "Inscription pour accompagnants (plus de 10 ans). Déjeuner inclus et participation à la randonnée.",
    },
    {
      language: "de" as const,
      name: "Begleitpersonen",
      description:
        "Anmeldung für Begleitpersonen (über 10 Jahre). Mittagessen und Wanderungsteilnahme inklusive.",
    },
    {
      language: "it" as const,
      name: "Accompagnatori",
      description:
        "Iscrizione per accompagnatori (maggiori di 10 anni). Pranzo incluso e partecipazione alla passeggiata.",
    },
  ];

  for (const translation of acompanhantesTranslations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: acompanhantes.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: acompanhantes.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  console.log("   ✅ Acompanhantes created");

  // Step 5: Create pricing phases (linked to eventId)
  console.log("💰 Creating pricing phases...");

  const pricingPhases = [
    {
      name: "Inscrição - Passeio de Cicloturismo",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-02-24T23:59:59.000Z"),
      price: 17.0,
      currency: "EUR" as const,
      note: "Inclui almoço e lembranças",
    },
    {
      name: "Inscrição - Sócios ACCôa",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-02-24T23:59:59.000Z"),
      price: 10.0,
      currency: "EUR" as const,
      note: "Sócios com quotas em dia e equipamento da Associação",
    },
    {
      name: "Caminhada 10km",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-02-24T23:59:59.000Z"),
      price: 10.0,
      currency: "EUR" as const,
      note: "Inclui almoço",
    },
    {
      name: "Acompanhantes",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-02-24T23:59:59.000Z"),
      price: 10.0,
      currency: "EUR" as const,
      note: "Maiores de 10 anos. Inclui almoço e participação na caminhada",
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
      question: "O almoço está incluído na inscrição?",
      answer:
        "Sim, o almoço está incluído na inscrição do passeio de cicloturismo (17€), da caminhada (10€) e dos acompanhantes (10€). O almoço será servido na cantina da Escola Secundária de Foz Côa, a partir das 13:30.",
      translations: {
        pt: {
          question: "O almoço está incluído na inscrição?",
          answer:
            "Sim, o almoço está incluído na inscrição do passeio de cicloturismo (17€), da caminhada (10€) e dos acompanhantes (10€). O almoço será servido na cantina da Escola Secundária de Foz Côa, a partir das 13:30.",
        },
        en: {
          question: "Is lunch included in the registration?",
          answer:
            "Yes, lunch is included in the cycling tour registration (€17), walking tour (€10) and companions (€10). Lunch will be served at the Foz Côa Secondary School canteen, from 13:30.",
        },
        es: {
          question: "¿El almuerzo está incluido en la inscripción?",
          answer:
            "Sí, el almuerzo está incluido en la inscripción del paseo de cicloturismo (17€), de la caminata (10€) y de los acompañantes (10€). El almuerzo se servirá en el comedor de la Escuela Secundaria de Foz Côa, a partir de las 13:30.",
        },
        fr: {
          question: "Le déjeuner est-il inclus dans l'inscription?",
          answer:
            "Oui, le déjeuner est inclus dans l'inscription du tour cyclotouriste (17€), de la randonnée (10€) et des accompagnants (10€). Le déjeuner sera servi à la cantine de l'École Secondaire de Foz Côa, à partir de 13:30.",
        },
        de: {
          question: "Ist das Mittagessen in der Anmeldung enthalten?",
          answer:
            "Ja, das Mittagessen ist in der Anmeldung der Radtour (17€), der Wanderung (10€) und der Begleitpersonen (10€) enthalten. Das Mittagessen wird in der Kantine der Sekundarschule Foz Côa ab 13:30 Uhr serviert.",
        },
        it: {
          question: "Il pranzo è incluso nell'iscrizione?",
          answer:
            "Sì, il pranzo è incluso nell'iscrizione del tour cicloturistico (17€), della passeggiata (10€) e degli accompagnatori (10€). Il pranzo sarà servito nella mensa della Scuola Secondaria di Foz Côa, dalle 13:30.",
        },
      },
    },
    {
      order: 2,
      question: "É obrigatório usar capacete?",
      answer:
        "Sim, o uso de capacete é obrigatório durante todo o passeio de cicloturismo. Não será permitida a participação sem capacete.",
      translations: {
        pt: {
          question: "É obrigatório usar capacete?",
          answer:
            "Sim, o uso de capacete é obrigatório durante todo o passeio de cicloturismo. Não será permitida a participação sem capacete.",
        },
        en: {
          question: "Is wearing a helmet mandatory?",
          answer:
            "Yes, wearing a helmet is mandatory throughout the cycling tour. Participation without a helmet will not be allowed.",
        },
        es: {
          question: "¿Es obligatorio usar casco?",
          answer:
            "Sí, el uso de casco es obligatorio durante todo el paseo de cicloturismo. No se permitirá la participación sin casco.",
        },
        fr: {
          question: "Le port du casque est-il obligatoire?",
          answer:
            "Oui, le port du casque est obligatoire pendant tout le tour cyclotouriste. La participation sans casque ne sera pas autorisée.",
        },
        de: {
          question: "Ist das Tragen eines Helms Pflicht?",
          answer:
            "Ja, das Tragen eines Helms ist während der gesamten Radtour Pflicht. Eine Teilnahme ohne Helm ist nicht gestattet.",
        },
        it: {
          question: "È obbligatorio indossare il casco?",
          answer:
            "Sì, l'uso del casco è obbligatorio durante tutto il tour cicloturistico. Non sarà consentita la partecipazione senza casco.",
        },
      },
    },
    {
      order: 3,
      question: "Qual é a velocidade do passeio?",
      answer:
        "A velocidade média do passeio é de 17 km/h. Este é um evento de cicloturismo, não uma corrida competitiva. A velocidade é irrelevante - o importante é chegar ao fim e desfrutar do convívio e da paisagem das amendoeiras em flor!",
      translations: {
        pt: {
          question: "Qual é a velocidade do passeio?",
          answer:
            "A velocidade média do passeio é de 17 km/h. Este é um evento de cicloturismo, não uma corrida competitiva. A velocidade é irrelevante - o importante é chegar ao fim e desfrutar do convívio e da paisagem das amendoeiras em flor!",
        },
        en: {
          question: "What is the ride speed?",
          answer:
            "The average speed of the ride is 17 km/h. This is a cycling tourism event, not a competitive race. Speed is irrelevant - what matters is reaching the end and enjoying the fellowship and the almond blossom landscape!",
        },
        es: {
          question: "¿Cuál es la velocidad del paseo?",
          answer:
            "La velocidad media del paseo es de 17 km/h. Este es un evento de cicloturismo, no una carrera competitiva. La velocidad es irrelevante - ¡lo importante es llegar al final y disfrutar de la convivencia y el paisaje de los almendros en flor!",
        },
        fr: {
          question: "Quelle est la vitesse du tour?",
          answer:
            "La vitesse moyenne du tour est de 17 km/h. C'est un événement de cyclotourisme, pas une course compétitive. La vitesse est sans importance - l'essentiel est d'arriver au bout et de profiter de la convivialité et du paysage des amandiers en fleur !",
        },
        de: {
          question: "Wie schnell ist die Radtour?",
          answer:
            "Die Durchschnittsgeschwindigkeit der Radtour beträgt 17 km/h. Dies ist ein Radtourismus-Event, kein Wettkampfrennen. Die Geschwindigkeit ist unwichtig - das Wichtigste ist, das Ziel zu erreichen und die Geselligkeit und die Mandelblütenlandschaft zu genießen!",
        },
        it: {
          question: "Qual è la velocità del tour?",
          answer:
            "La velocità media del tour è di 17 km/h. Questo è un evento di cicloturismo, non una gara competitiva. La velocità è irrilevante - l'importante è arrivare alla fine e godersi la convivialità e il paesaggio dei mandorli in fiore!",
        },
      },
    },
    {
      order: 4,
      question: "Os sócios da ACCôa têm desconto?",
      answer:
        "Sim, os associados da Associação de Cicloturismo do Côa que participem em representação da Associação pagam apenas 10€ (em vez de 17€), desde que reúnam os seguintes requisitos: quotas em dia e utilização do equipamento da Associação, se possuírem.",
      translations: {
        pt: {
          question: "Os sócios da ACCôa têm desconto?",
          answer:
            "Sim, os associados da Associação de Cicloturismo do Côa que participem em representação da Associação pagam apenas 10€ (em vez de 17€), desde que reúnam os seguintes requisitos: quotas em dia e utilização do equipamento da Associação, se possuírem.",
        },
        en: {
          question: "Do ACCôa members get a discount?",
          answer:
            "Yes, members of the Côa Cycling Tourism Association who participate representing the Association pay only €10 (instead of €17), provided they meet these requirements: membership fees up to date and wearing the Association's kit, if they have one.",
        },
        es: {
          question: "¿Los socios de la ACCôa tienen descuento?",
          answer:
            "Sí, los asociados de la Asociación de Cicloturismo del Côa que participen representando a la Asociación pagan solo 10€ (en vez de 17€), siempre que cumplan los requisitos: cuotas al día y uso del equipamiento de la Asociación, si lo poseen.",
        },
        fr: {
          question: "Les membres de l'ACCôa ont-ils une réduction?",
          answer:
            "Oui, les membres de l'Association de Cyclotourisme du Côa qui participent en représentant l'Association paient seulement 10€ (au lieu de 17€), à condition de remplir les conditions : cotisations à jour et port de l'équipement de l'Association, s'ils en possèdent.",
        },
        de: {
          question: "Erhalten ACCôa-Mitglieder einen Rabatt?",
          answer:
            "Ja, Mitglieder des Radtouristikvereins Côa, die den Verein vertreten, zahlen nur 10€ (statt 17€), sofern sie folgende Voraussetzungen erfüllen: aktuelle Mitgliedsbeiträge und Tragen der Vereinskleidung, sofern vorhanden.",
        },
        it: {
          question: "I soci dell'ACCôa hanno uno sconto?",
          answer:
            "Sì, i soci dell'Associazione di Cicloturismo del Côa che partecipano rappresentando l'Associazione pagano solo 10€ (invece di 17€), a condizione di soddisfare i requisiti: quote associative in regola e utilizzo dell'abbigliamento dell'Associazione, se ne possiedono.",
        },
      },
    },
    {
      order: 5,
      question: "Há banhos disponíveis após o passeio?",
      answer:
        "Sim, os balneários da Escola Secundária de Foz Côa estarão disponíveis para todos os participantes logo após a chegada.",
      translations: {
        pt: {
          question: "Há banhos disponíveis após o passeio?",
          answer:
            "Sim, os balneários da Escola Secundária de Foz Côa estarão disponíveis para todos os participantes logo após a chegada.",
        },
        en: {
          question: "Are showers available after the ride?",
          answer:
            "Yes, the changing rooms at the Foz Côa Secondary School will be available to all participants right after arrival.",
        },
        es: {
          question: "¿Hay duchas disponibles después del paseo?",
          answer:
            "Sí, los vestuarios de la Escuela Secundaria de Foz Côa estarán disponibles para todos los participantes justo después de la llegada.",
        },
        fr: {
          question: "Y a-t-il des douches après le tour?",
          answer:
            "Oui, les vestiaires de l'École Secondaire de Foz Côa seront disponibles pour tous les participants dès l'arrivée.",
        },
        de: {
          question: "Gibt es Duschen nach der Radtour?",
          answer:
            "Ja, die Umkleidekabinen der Sekundarschule Foz Côa stehen allen Teilnehmern direkt nach der Ankunft zur Verfügung.",
        },
        it: {
          question: "Ci sono docce disponibili dopo il tour?",
          answer:
            "Sì, gli spogliatoi della Scuola Secondaria di Foz Côa saranno disponibili per tutti i partecipanti subito dopo l'arrivo.",
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
🌸 XXXVII Passeio de Cicloturismo das Amendoeiras em Flor 2026 seeded successfully!
   📍 Event: XXXVII Passeio de Cicloturismo das Amendoeiras em Flor
   🔗 Slug: ${event.slug}
   📅 Date: 2026-03-01
   📍 Location: Vila Nova de Foz Côa, Guarda
   🚴 Variants: Passeio Cicloturismo ~50km, Caminhada 10km, Acompanhantes
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
