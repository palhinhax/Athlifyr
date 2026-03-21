/**
 * Seed: Zurich Rock 'n' Roll Running Series Madrid 2026
 * Complete with translations in all 6 languages, FAQs and SEO
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🎸 Seeding Zurich Rock 'n' Roll Running Series Madrid 2026...");

  const eventSlug = "rock-n-roll-madrid-2026";

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
      title: "Zurich Rock 'n' Roll Running Series Madrid 2026",
      description:
        "48ª edição da maior festa de running de Espanha com Maratona, Meia Maratona e 10K pelas ruas de Madrid.",
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-04-26T08:00:00.000Z"),
      endDate: null,
      city: "Madrid",
      country: "Spain",
      latitude: 40.4515,
      longitude: -3.6894,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Paseo+de+la+Castellana+Madrid+Spain",
      externalUrl: "https://rocknrollmadridrun.com/",
      imageUrl:
        "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=1200&h=800&fit=crop",
      isFeatured: true,
      registrationDeadline: new Date("2026-04-10T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "Zurich Rock 'n' Roll Running Series Madrid 2026",
      description:
        "48ª edição da maior festa de running de Espanha com Maratona, Meia Maratona e 10K pelas ruas de Madrid.",
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-04-26T08:00:00.000Z"),
      endDate: null,
      city: "Madrid",
      country: "Spain",
      latitude: 40.4515,
      longitude: -3.6894,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Paseo+de+la+Castellana+Madrid+Spain",
      externalUrl: "https://rocknrollmadridrun.com/",
      imageUrl:
        "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=1200&h=800&fit=crop",
      isFeatured: true,
      registrationDeadline: new Date("2026-04-10T23:59:59.000Z"),
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
      title: "Zurich Rock 'n' Roll Running Series Madrid 2026",
      city: "Madrid",
      metaTitle: "Rock 'n' Roll Madrid 2026 | Maratona, Meia e 10K | 26 Abril",
      metaDescription:
        "Zurich Rock 'n' Roll Running Series Madrid 2026 - 26 de abril. Maratona 42K, Meia Maratona 21K e 10K. A maior festa de running de Espanha com 47.000 participantes.",
      description: `# 🎸 Zurich Rock 'n' Roll Running Series Madrid 2026

A **48ª edição** da corrida mais icónica de Espanha! A **Zurich Rock 'n' Roll Running Series Madrid** combina desporto, música e festa numa experiência única pelas ruas mais bonitas de Madrid.

## 📅 Data e Local

- **Data:** 26 de abril de 2026 (Domingo)
- **Partida:** Paseo de la Castellana
- **Chegada:** Paseo de Recoletos
- **Cidade:** Madrid, Espanha

## 🏃 Distâncias

| Distância | Hora de Partida |
|-----------|-----------------|
| **10K** | 08:00 |
| **Maratona** | 08:45 |
| **Meia Maratona** | 08:45 |

## 🎵 Experiência Rock 'n' Roll

- **+30 palcos** de entretenimento ao longo do percurso
- **47.000 participantes** de 110 países
- Percurso por marcos icónicos: Santiago Bernabéu, Puerta del Sol, Palacio Real

## 📦 Runner's Expo (IFEMA)

- **Sexta 24 abril:** 10:00 - 20:00
- **Sábado 25 abril:** 10:00 - 20:00
- Levantamento obrigatório do dorsal antes da prova

## 🎁 A Inscrição Inclui

- ✅ T-shirt técnica Adidas
- ✅ Dorsal personalizado
- ✅ Saco do corredor
- ✅ Fuel Bag 226ERS (Maratona e Meia)
- ✅ Gear Check gratuito
- ✅ Medalha Finisher
- ✅ Abastecimentos no percurso

## 📧 Organização

**AD. MAPOMA** - Referência nacional em eventos desportivos`,
    },
    {
      language: "en",
      title: "Zurich Rock 'n' Roll Running Series Madrid 2026",
      city: "Madrid",
      metaTitle: "Rock 'n' Roll Madrid 2026 | Marathon, Half & 10K | April 26",
      metaDescription:
        "Zurich Rock 'n' Roll Running Series Madrid 2026 - April 26. Marathon 42K, Half Marathon 21K and 10K. Spain's biggest running party with 47,000 participants.",
      description: `# 🎸 Zurich Rock 'n' Roll Running Series Madrid 2026

The **48th edition** of Spain's most iconic race! The **Zurich Rock 'n' Roll Running Series Madrid** combines sport, music and party in a unique experience through Madrid's most beautiful streets.

## 📅 Date and Location

- **Date:** April 26, 2026 (Sunday)
- **Start:** Paseo de la Castellana
- **Finish:** Paseo de Recoletos
- **City:** Madrid, Spain

## 🏃 Distances

| Distance | Start Time |
|----------|------------|
| **10K** | 08:00 |
| **Marathon** | 08:45 |
| **Half Marathon** | 08:45 |

## 🎵 Rock 'n' Roll Experience

- **30+ entertainment stages** along the course
- **47,000 participants** from 110 countries
- Course through iconic landmarks: Santiago Bernabéu, Puerta del Sol, Royal Palace

## 📦 Runner's Expo (IFEMA)

- **Friday April 24:** 10:00 AM - 8:00 PM
- **Saturday April 25:** 10:00 AM - 8:00 PM
- Mandatory bib pick-up before race day

## 🎁 Registration Includes

- ✅ Adidas technical t-shirt
- ✅ Personalized bib number
- ✅ Runner's bag
- ✅ 226ERS Fuel Bag (Marathon and Half)
- ✅ Free Gear Check
- ✅ Finisher medal
- ✅ Aid stations on course

## 📧 Organization

**AD. MAPOMA** - National reference in sports events`,
    },
    {
      language: "es",
      title: "Zurich Rock 'n' Roll Running Series Madrid 2026",
      city: "Madrid",
      metaTitle: "Rock 'n' Roll Madrid 2026 | Maratón, Media y 10K | 26 Abril",
      metaDescription:
        "Zurich Rock 'n' Roll Running Series Madrid 2026 - 26 de abril. Maratón 42K, Media Maratón 21K y 10K. La mayor fiesta del running en España con 47.000 participantes.",
      description: `# 🎸 Zurich Rock 'n' Roll Running Series Madrid 2026

¡La **48ª edición** de la carrera más icónica de España! La **Zurich Rock 'n' Roll Running Series Madrid** combina deporte, música y fiesta en una experiencia única por las calles más bonitas de Madrid.

## 📅 Fecha y Lugar

- **Fecha:** 26 de abril de 2026 (Domingo)
- **Salida:** Paseo de la Castellana
- **Llegada:** Paseo de Recoletos
- **Ciudad:** Madrid, España

## 🏃 Distancias

| Distancia | Hora de Salida |
|-----------|----------------|
| **10K** | 08:00 |
| **Maratón** | 08:45 |
| **Media Maratón** | 08:45 |

## 🎵 Experiencia Rock 'n' Roll

- **+30 escenarios** de entretenimiento a lo largo del recorrido
- **47.000 participantes** de 110 países
- Recorrido por lugares emblemáticos: Santiago Bernabéu, Puerta del Sol, Palacio Real

## 📦 Runner's Expo (IFEMA)

- **Viernes 24 abril:** 10:00 - 20:00
- **Sábado 25 abril:** 10:00 - 20:00
- Recogida obligatoria del dorsal antes de la prueba

## 🎁 La Inscripción Incluye

- ✅ Camiseta técnica Adidas
- ✅ Dorsal personalizado
- ✅ Bolsa del corredor
- ✅ Fuel Bag 226ERS (Maratón y Media)
- ✅ Gear Check gratuito
- ✅ Medalla Finisher
- ✅ Avituallamientos en recorrido

## 📧 Organización

**AD. MAPOMA** - Referencia nacional en eventos deportivos`,
    },
    {
      language: "fr",
      title: "Zurich Rock 'n' Roll Running Series Madrid 2026",
      city: "Madrid",
      metaTitle: "Rock 'n' Roll Madrid 2026 | Marathon, Semi et 10K | 26 Avril",
      metaDescription:
        "Zurich Rock 'n' Roll Running Series Madrid 2026 - 26 avril. Marathon 42K, Semi-Marathon 21K et 10K. La plus grande fête du running en Espagne avec 47.000 participants.",
      description: `# 🎸 Zurich Rock 'n' Roll Running Series Madrid 2026

La **48ème édition** de la course la plus emblématique d'Espagne! La **Zurich Rock 'n' Roll Running Series Madrid** combine sport, musique et fête dans une expérience unique à travers les plus belles rues de Madrid.

## 📅 Date et Lieu

- **Date:** 26 avril 2026 (Dimanche)
- **Départ:** Paseo de la Castellana
- **Arrivée:** Paseo de Recoletos
- **Ville:** Madrid, Espagne

## 🏃 Distances

| Distance | Heure de Départ |
|----------|-----------------|
| **10K** | 08:00 |
| **Marathon** | 08:45 |
| **Semi-Marathon** | 08:45 |

## 🎵 Expérience Rock 'n' Roll

- **+30 scènes** de divertissement le long du parcours
- **47.000 participants** de 110 pays
- Parcours à travers des monuments emblématiques: Santiago Bernabéu, Puerta del Sol, Palais Royal

## 📦 Runner's Expo (IFEMA)

- **Vendredi 24 avril:** 10:00 - 20:00
- **Samedi 25 avril:** 10:00 - 20:00
- Retrait obligatoire du dossard avant la course

## 🎁 L'Inscription Comprend

- ✅ T-shirt technique Adidas
- ✅ Dossard personnalisé
- ✅ Sac du coureur
- ✅ Fuel Bag 226ERS (Marathon et Semi)
- ✅ Gear Check gratuit
- ✅ Médaille Finisher
- ✅ Ravitaillements sur le parcours

## 📧 Organisation

**AD. MAPOMA** - Référence nationale en événements sportifs`,
    },
    {
      language: "de",
      title: "Zurich Rock 'n' Roll Running Series Madrid 2026",
      city: "Madrid",
      metaTitle:
        "Rock 'n' Roll Madrid 2026 | Marathon, Halb und 10K | 26. April",
      metaDescription:
        "Zurich Rock 'n' Roll Running Series Madrid 2026 - 26. April. Marathon 42K, Halbmarathon 21K und 10K. Spaniens größte Laufparty mit 47.000 Teilnehmern.",
      description: `# 🎸 Zurich Rock 'n' Roll Running Series Madrid 2026

Die **48. Ausgabe** des ikonischsten Rennens Spaniens! Die **Zurich Rock 'n' Roll Running Series Madrid** verbindet Sport, Musik und Party zu einem einzigartigen Erlebnis durch die schönsten Straßen Madrids.

## 📅 Datum und Ort

- **Datum:** 26. April 2026 (Sonntag)
- **Start:** Paseo de la Castellana
- **Ziel:** Paseo de Recoletos
- **Stadt:** Madrid, Spanien

## 🏃 Distanzen

| Distanz | Startzeit |
|---------|-----------|
| **10K** | 08:00 |
| **Marathon** | 08:45 |
| **Halbmarathon** | 08:45 |

## 🎵 Rock 'n' Roll Erlebnis

- **30+ Unterhaltungsbühnen** entlang der Strecke
- **47.000 Teilnehmer** aus 110 Ländern
- Strecke durch ikonische Sehenswürdigkeiten: Santiago Bernabéu, Puerta del Sol, Königspalast

## 📦 Runner's Expo (IFEMA)

- **Freitag 24. April:** 10:00 - 20:00 Uhr
- **Samstag 25. April:** 10:00 - 20:00 Uhr
- Obligatorische Startnummernabholung vor dem Renntag

## 🎁 Die Anmeldung Beinhaltet

- ✅ Adidas technisches T-Shirt
- ✅ Personalisierte Startnummer
- ✅ Läufertasche
- ✅ 226ERS Fuel Bag (Marathon und Halb)
- ✅ Kostenloser Gear Check
- ✅ Finisher-Medaille
- ✅ Verpflegungsstationen auf der Strecke

## 📧 Organisation

**AD. MAPOMA** - Nationale Referenz für Sportveranstaltungen`,
    },
    {
      language: "it",
      title: "Zurich Rock 'n' Roll Running Series Madrid 2026",
      city: "Madrid",
      metaTitle:
        "Rock 'n' Roll Madrid 2026 | Maratona, Mezza e 10K | 26 Aprile",
      metaDescription:
        "Zurich Rock 'n' Roll Running Series Madrid 2026 - 26 aprile. Maratona 42K, Mezza Maratona 21K e 10K. La più grande festa del running in Spagna con 47.000 partecipanti.",
      description: `# 🎸 Zurich Rock 'n' Roll Running Series Madrid 2026

La **48ª edizione** della gara più iconica della Spagna! La **Zurich Rock 'n' Roll Running Series Madrid** combina sport, musica e festa in un'esperienza unica attraverso le strade più belle di Madrid.

## 📅 Data e Luogo

- **Data:** 26 aprile 2026 (Domenica)
- **Partenza:** Paseo de la Castellana
- **Arrivo:** Paseo de Recoletos
- **Città:** Madrid, Spagna

## 🏃 Distanze

| Distanza | Orario di Partenza |
|----------|-------------------|
| **10K** | 08:00 |
| **Maratona** | 08:45 |
| **Mezza Maratona** | 08:45 |

## 🎵 Esperienza Rock 'n' Roll

- **+30 palchi** di intrattenimento lungo il percorso
- **47.000 partecipanti** da 110 paesi
- Percorso attraverso luoghi iconici: Santiago Bernabéu, Puerta del Sol, Palazzo Reale

## 📦 Runner's Expo (IFEMA)

- **Venerdì 24 aprile:** 10:00 - 20:00
- **Sabato 25 aprile:** 10:00 - 20:00
- Ritiro obbligatorio del pettorale prima della gara

## 🎁 L'Iscrizione Include

- ✅ T-shirt tecnica Adidas
- ✅ Pettorale personalizzato
- ✅ Borsa del corridore
- ✅ Fuel Bag 226ERS (Maratona e Mezza)
- ✅ Gear Check gratuito
- ✅ Medaglia Finisher
- ✅ Ristori sul percorso

## 📧 Organizzazione

**AD. MAPOMA** - Riferimento nazionale in eventi sportivi`,
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
  console.log("🏃 Creating variants...");

  // Variant 1: Maratona 42K
  const maratona = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Maratona 42K",
      distanceKm: 42.195,
      startTime: "08:45",
      currency: "EUR",
    },
  });

  const maratonaTranslations = [
    {
      language: "pt" as const,
      name: "Maratona 42K",
      description:
        "A distância clássica de 42,195km pelas ruas de Madrid. Percurso por marcos icónicos como o Santiago Bernabéu, Puerta del Sol e Palacio Real. Inclui Fuel Bag 226ERS com 2 géis.",
    },
    {
      language: "en" as const,
      name: "Marathon 42K",
      description:
        "The classic 42.195km distance through the streets of Madrid. Course through iconic landmarks like Santiago Bernabéu, Puerta del Sol and Royal Palace. Includes 226ERS Fuel Bag with 2 gels.",
    },
    {
      language: "es" as const,
      name: "Maratón 42K",
      description:
        "La distancia clásica de 42,195km por las calles de Madrid. Recorrido por lugares emblemáticos como el Santiago Bernabéu, Puerta del Sol y Palacio Real. Incluye Fuel Bag 226ERS con 2 geles.",
    },
    {
      language: "fr" as const,
      name: "Marathon 42K",
      description:
        "La distance classique de 42,195km à travers les rues de Madrid. Parcours à travers des monuments emblématiques comme le Santiago Bernabéu, Puerta del Sol et Palais Royal. Inclut Fuel Bag 226ERS avec 2 gels.",
    },
    {
      language: "de" as const,
      name: "Marathon 42K",
      description:
        "Die klassische 42,195km Distanz durch die Straßen von Madrid. Strecke durch ikonische Sehenswürdigkeiten wie Santiago Bernabéu, Puerta del Sol und Königspalast. Inklusive 226ERS Fuel Bag mit 2 Gels.",
    },
    {
      language: "it" as const,
      name: "Maratona 42K",
      description:
        "La distanza classica di 42,195km attraverso le strade di Madrid. Percorso attraverso luoghi iconici come Santiago Bernabéu, Puerta del Sol e Palazzo Reale. Include Fuel Bag 226ERS con 2 gel.",
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

  console.log("   ✅ Maratona 42K created");

  // Variant 2: Meia Maratona 21K
  const meiaMaratona = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Meia Maratona 21K",
      distanceKm: 21.0975,
      startTime: "08:45",
      currency: "EUR",
    },
  });

  const meiaMaratonaTranslations = [
    {
      language: "pt" as const,
      name: "Meia Maratona 21K",
      description:
        "21,0975km pelo coração de Madrid. Percurso turístico com ambiente festivo e +30 palcos de música ao vivo. Inclui Fuel Bag 226ERS com 1 gel.",
    },
    {
      language: "en" as const,
      name: "Half Marathon 21K",
      description:
        "21.0975km through the heart of Madrid. Tourist course with festive atmosphere and 30+ live music stages. Includes 226ERS Fuel Bag with 1 gel.",
    },
    {
      language: "es" as const,
      name: "Media Maratón 21K",
      description:
        "21,0975km por el corazón de Madrid. Recorrido turístico con ambiente festivo y +30 escenarios de música en vivo. Incluye Fuel Bag 226ERS con 1 gel.",
    },
    {
      language: "fr" as const,
      name: "Semi-Marathon 21K",
      description:
        "21,0975km à travers le cœur de Madrid. Parcours touristique avec ambiance festive et +30 scènes de musique live. Inclut Fuel Bag 226ERS avec 1 gel.",
    },
    {
      language: "de" as const,
      name: "Halbmarathon 21K",
      description:
        "21,0975km durch das Herz von Madrid. Touristische Strecke mit festlicher Atmosphäre und 30+ Live-Musikbühnen. Inklusive 226ERS Fuel Bag mit 1 Gel.",
    },
    {
      language: "it" as const,
      name: "Mezza Maratona 21K",
      description:
        "21,0975km attraverso il cuore di Madrid. Percorso turistico con atmosfera festiva e +30 palchi di musica dal vivo. Include Fuel Bag 226ERS con 1 gel.",
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

  console.log("   ✅ Meia Maratona 21K created");

  // Variant 3: 10K
  const corrida10k = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "10K",
      distanceKm: 10,
      startTime: "08:00",
      currency: "EUR",
    },
  });

  const corrida10kTranslations = [
    {
      language: "pt" as const,
      name: "10K",
      description:
        "10km de pura festa! A distância perfeita para quem quer viver a experiência Rock 'n' Roll Madrid. Percurso rápido e festivo pelo centro da cidade.",
    },
    {
      language: "en" as const,
      name: "10K",
      description:
        "10km of pure party! The perfect distance for those who want to experience Rock 'n' Roll Madrid. Fast and festive course through the city center.",
    },
    {
      language: "es" as const,
      name: "10K",
      description:
        "¡10km de pura fiesta! La distancia perfecta para quienes quieren vivir la experiencia Rock 'n' Roll Madrid. Recorrido rápido y festivo por el centro de la ciudad.",
    },
    {
      language: "fr" as const,
      name: "10K",
      description:
        "10km de pure fête! La distance parfaite pour ceux qui veulent vivre l'expérience Rock 'n' Roll Madrid. Parcours rapide et festif à travers le centre-ville.",
    },
    {
      language: "de" as const,
      name: "10K",
      description:
        "10km pure Party! Die perfekte Distanz für alle, die das Rock 'n' Roll Madrid Erlebnis erleben möchten. Schnelle und festliche Strecke durch das Stadtzentrum.",
    },
    {
      language: "it" as const,
      name: "10K",
      description:
        "10km di pura festa! La distanza perfetta per chi vuole vivere l'esperienza Rock 'n' Roll Madrid. Percorso veloce e festivo attraverso il centro città.",
    },
  ];

  for (const translation of corrida10kTranslations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: corrida10k.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: corrida10k.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  console.log("   ✅ 10K created");

  // Step 5: Create FAQs with translations
  console.log("❓ Creating FAQs...");

  const faqs = [
    {
      order: 1,
      question: "Onde e quando posso levantar o meu dorsal?",
      answer:
        "O levantamento do dorsal é feito na Runner's Expo no IFEMA - Feria de Madrid. Sexta 24 de abril das 10h às 20h e Sábado 25 de abril das 10h às 20h. NÃO há levantamento no dia da prova. É necessário apresentar documento de identificação e o QR Code de inscrição.",
      translations: {
        pt: {
          question: "Onde e quando posso levantar o meu dorsal?",
          answer:
            "O levantamento do dorsal é feito na Runner's Expo no IFEMA - Feria de Madrid. Sexta 24 de abril das 10h às 20h e Sábado 25 de abril das 10h às 20h. NÃO há levantamento no dia da prova. É necessário apresentar documento de identificação e o QR Code de inscrição.",
        },
        en: {
          question: "Where and when can I pick up my bib?",
          answer:
            "Bib pick-up is at the Runner's Expo at IFEMA - Feria de Madrid. Friday April 24 from 10am to 8pm and Saturday April 25 from 10am to 8pm. There is NO race day pick-up. You must present ID and your registration QR Code.",
        },
        es: {
          question: "¿Dónde y cuándo puedo recoger mi dorsal?",
          answer:
            "La recogida del dorsal se realiza en la Runner's Expo en IFEMA - Feria de Madrid. Viernes 24 de abril de 10h a 20h y Sábado 25 de abril de 10h a 20h. NO hay recogida el día de la prueba. Es necesario presentar documento de identificación y el QR Code de inscripción.",
        },
        fr: {
          question: "Où et quand puis-je retirer mon dossard?",
          answer:
            "Le retrait du dossard se fait à la Runner's Expo à IFEMA - Feria de Madrid. Vendredi 24 avril de 10h à 20h et Samedi 25 avril de 10h à 20h. Il n'y a PAS de retrait le jour de la course. Vous devez présenter une pièce d'identité et votre QR Code d'inscription.",
        },
        de: {
          question: "Wo und wann kann ich meine Startnummer abholen?",
          answer:
            "Die Startnummernabholung erfolgt bei der Runner's Expo im IFEMA - Feria de Madrid. Freitag 24. April von 10 bis 20 Uhr und Samstag 25. April von 10 bis 20 Uhr. Es gibt KEINE Abholung am Renntag. Sie müssen einen Ausweis und Ihren Registrierungs-QR-Code vorlegen.",
        },
        it: {
          question: "Dove e quando posso ritirare il mio pettorale?",
          answer:
            "Il ritiro del pettorale avviene presso la Runner's Expo all'IFEMA - Feria de Madrid. Venerdì 24 aprile dalle 10 alle 20 e Sabato 25 aprile dalle 10 alle 20. NON c'è ritiro il giorno della gara. È necessario presentare documento d'identità e il QR Code di iscrizione.",
        },
      },
    },
    {
      order: 2,
      question: "Posso trocar de distância após a inscrição?",
      answer:
        "Sim, podes trocar de distância até 15 de março de 2026, desde que haja vagas disponíveis. Para uma distância maior, pagas a diferença. Para uma distância menor, não há reembolso. As alterações são feitas no Registration Manager.",
      translations: {
        pt: {
          question: "Posso trocar de distância após a inscrição?",
          answer:
            "Sim, podes trocar de distância até 15 de março de 2026, desde que haja vagas disponíveis. Para uma distância maior, pagas a diferença. Para uma distância menor, não há reembolso. As alterações são feitas no Registration Manager.",
        },
        en: {
          question: "Can I change distance after registration?",
          answer:
            "Yes, you can change distance until March 15, 2026, as long as there are available spots. For a longer distance, you pay the difference. For a shorter distance, there's no refund. Changes are made in the Registration Manager.",
        },
        es: {
          question: "¿Puedo cambiar de distancia después de inscribirme?",
          answer:
            "Sí, puedes cambiar de distancia hasta el 15 de marzo de 2026, siempre que haya plazas disponibles. Para una distancia mayor, pagas la diferencia. Para una distancia menor, no hay reembolso. Los cambios se realizan en el Registration Manager.",
        },
        fr: {
          question: "Puis-je changer de distance après l'inscription?",
          answer:
            "Oui, vous pouvez changer de distance jusqu'au 15 mars 2026, à condition qu'il y ait des places disponibles. Pour une distance plus longue, vous payez la différence. Pour une distance plus courte, il n'y a pas de remboursement. Les modifications se font dans le Registration Manager.",
        },
        de: {
          question: "Kann ich nach der Anmeldung die Distanz wechseln?",
          answer:
            "Ja, Sie können bis zum 15. März 2026 die Distanz wechseln, sofern Plätze verfügbar sind. Für eine längere Distanz zahlen Sie die Differenz. Für eine kürzere Distanz gibt es keine Rückerstattung. Änderungen werden im Registration Manager vorgenommen.",
        },
        it: {
          question: "Posso cambiare distanza dopo l'iscrizione?",
          answer:
            "Sì, puoi cambiare distanza fino al 15 marzo 2026, a condizione che ci siano posti disponibili. Per una distanza maggiore, paghi la differenza. Per una distanza minore, non c'è rimborso. Le modifiche si fanno nel Registration Manager.",
        },
      },
    },
    {
      order: 3,
      question: "Como funciona o serviço de Gear Check?",
      answer:
        "O Gear Check é gratuito e está localizado na zona de chegada no Paseo de Recoletos. Recebes um saco oficial e um autocolante numerado com o dorsal. O serviço funciona das 7h00 às 15h30. Não deixar objetos de valor - a organização não se responsabiliza por perdas ou danos.",
      translations: {
        pt: {
          question: "Como funciona o serviço de Gear Check?",
          answer:
            "O Gear Check é gratuito e está localizado na zona de chegada no Paseo de Recoletos. Recebes um saco oficial e um autocolante numerado com o dorsal. O serviço funciona das 7h00 às 15h30. Não deixar objetos de valor - a organização não se responsabiliza por perdas ou danos.",
        },
        en: {
          question: "How does the Gear Check service work?",
          answer:
            "Gear Check is free and located in the finish area on Paseo de Recoletos. You receive an official bag and a numbered sticker matching your bib. Service operates from 7:00am to 3:30pm. Don't leave valuables - the organization is not responsible for losses or damages.",
        },
        es: {
          question: "¿Cómo funciona el servicio de Gear Check?",
          answer:
            "El Gear Check es gratuito y está ubicado en la zona de meta en el Paseo de Recoletos. Recibes una bolsa oficial y una pegatina numerada con tu dorsal. El servicio funciona de 7:00 a 15:30. No dejar objetos de valor - la organización no se responsabiliza de pérdidas o daños.",
        },
        fr: {
          question: "Comment fonctionne le service Gear Check?",
          answer:
            "Le Gear Check est gratuit et situé dans la zone d'arrivée sur le Paseo de Recoletos. Vous recevez un sac officiel et un autocollant numéroté correspondant à votre dossard. Le service fonctionne de 7h00 à 15h30. Ne laissez pas d'objets de valeur - l'organisation n'est pas responsable des pertes ou dommages.",
        },
        de: {
          question: "Wie funktioniert der Gear Check Service?",
          answer:
            "Der Gear Check ist kostenlos und befindet sich im Zielbereich am Paseo de Recoletos. Sie erhalten eine offizielle Tasche und einen nummerierten Aufkleber passend zu Ihrer Startnummer. Der Service ist von 7:00 bis 15:30 Uhr geöffnet. Keine Wertsachen hinterlegen - die Organisation haftet nicht für Verluste oder Schäden.",
        },
        it: {
          question: "Come funziona il servizio di Gear Check?",
          answer:
            "Il Gear Check è gratuito e si trova nella zona di arrivo sul Paseo de Recoletos. Ricevi una borsa ufficiale e un adesivo numerato corrispondente al tuo pettorale. Il servizio è attivo dalle 7:00 alle 15:30. Non lasciare oggetti di valore - l'organizzazione non è responsabile per perdite o danni.",
        },
      },
    },
    {
      order: 4,
      question: "Posso transferir a minha inscrição para outra pessoa?",
      answer:
        "Sim, até 15 de março de 2026. A taxa de transferência é de 10€ para o titular original. O novo titular paga o preço atual da inscrição. Existe também um 'Marketplace' para quem não conhece ninguém para quem transferir - podes colocar o teu dorsal disponível para venda.",
      translations: {
        pt: {
          question: "Posso transferir a minha inscrição para outra pessoa?",
          answer:
            "Sim, até 15 de março de 2026. A taxa de transferência é de 10€ para o titular original. O novo titular paga o preço atual da inscrição. Existe também um 'Marketplace' para quem não conhece ninguém para quem transferir - podes colocar o teu dorsal disponível para venda.",
        },
        en: {
          question: "Can I transfer my registration to someone else?",
          answer:
            "Yes, until March 15, 2026. The transfer fee is €10 for the original holder. The new holder pays the current registration price. There's also a 'Marketplace' for those who don't know anyone to transfer to - you can put your bib up for sale.",
        },
        es: {
          question: "¿Puedo transferir mi inscripción a otra persona?",
          answer:
            "Sí, hasta el 15 de marzo de 2026. La tasa de transferencia es de 10€ para el titular original. El nuevo titular paga el precio actual de la inscripción. También existe un 'Marketplace' para quienes no conocen a nadie a quien transferir - puedes poner tu dorsal disponible para venta.",
        },
        fr: {
          question: "Puis-je transférer mon inscription à quelqu'un d'autre?",
          answer:
            "Oui, jusqu'au 15 mars 2026. Les frais de transfert sont de 10€ pour le titulaire original. Le nouveau titulaire paie le prix actuel de l'inscription. Il existe aussi un 'Marketplace' pour ceux qui ne connaissent personne à qui transférer - vous pouvez mettre votre dossard en vente.",
        },
        de: {
          question: "Kann ich meine Anmeldung auf jemand anderen übertragen?",
          answer:
            "Ja, bis zum 15. März 2026. Die Übertragungsgebühr beträgt 10€ für den ursprünglichen Inhaber. Der neue Inhaber zahlt den aktuellen Anmeldepreis. Es gibt auch einen 'Marketplace' für diejenigen, die niemanden kennen, an den sie übertragen können - Sie können Ihre Startnummer zum Verkauf anbieten.",
        },
        it: {
          question: "Posso trasferire la mia iscrizione a qualcun altro?",
          answer:
            "Sì, fino al 15 marzo 2026. La tassa di trasferimento è di 10€ per il titolare originale. Il nuovo titolare paga il prezzo attuale dell'iscrizione. Esiste anche un 'Marketplace' per chi non conosce nessuno a cui trasferire - puoi mettere il tuo pettorale in vendita.",
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
🎉 Zurich Rock 'n' Roll Running Series Madrid 2026 seeded successfully!
   📍 Event: Zurich Rock 'n' Roll Running Series Madrid 2026
   🔗 Slug: ${event.slug}
   📅 Date: 2026-04-26
   📍 Location: Madrid, Spain
   🏃 Variants: Maratona 42K, Meia Maratona 21K, 10K
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
