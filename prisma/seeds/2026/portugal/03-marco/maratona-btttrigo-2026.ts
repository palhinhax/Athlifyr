/**
 * Seed: 24ª Maratona BTTTrigo 2026
 * Complete with translations in all 6 languages, FAQs and SEO
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding 24ª Maratona BTTTrigo 2026...");

  const eventSlug = "maratona-btttrigo-2026";

  // Step 1: Upsert the event (NO delete operations)
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "24ª Maratona BTTTrigo",
      description:
        "Maratona de BTT com 24 edições de tradição em Monte do Trigo, Évora. Percursos de 65km e 45km pelas magníficas paisagens alentejanas.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-29T09:00:00.000Z"),
      endDate: null,
      city: "Monte do Trigo, Évora",
      country: "Portugal",
      latitude: 38.5, // Aproximação para Évora
      longitude: -7.9,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Monte+do+Trigo+%C3%89vora+Portugal",
      externalUrl: "https://apedalar.pt/eventos/4096/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-03-24T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "24ª Maratona BTTTrigo",
      description:
        "Maratona de BTT com 24 edições de tradição em Monte do Trigo, Évora. Percursos de 65km e 45km pelas magníficas paisagens alentejanas.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-29T09:00:00.000Z"),
      endDate: null,
      city: "Monte do Trigo, Évora",
      country: "Portugal",
      latitude: 38.5,
      longitude: -7.9,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Monte+do+Trigo+%C3%89vora+Portugal",
      externalUrl: "https://apedalar.pt/eventos/4096/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-03-24T23:59:59.000Z"),
    },
  });

  console.log(`✅ Event upserted: ${event.slug} (ID: ${event.id})`);

  // Step 2: Create translations for ALL 6 LANGUAGES
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
      title: "24ª Maratona BTTTrigo",
      city: "Monte do Trigo",
      metaTitle:
        "24ª Maratona BTTTrigo 2026 | Monte do Trigo, Évora | 29 Março",
      metaDescription:
        "24ª Maratona BTTTrigo 2026 - 29 de março em Monte do Trigo, Évora. Percursos de 65km e 45km pelas paisagens alentejanas. Inscrições: 15€. Categorias de Elites a Master 60+.",
      description: `# 🚴 24ª Maratona BTTTrigo 2026

A **24ª Maratona BTTTrigo** é um evento tradicional de mountain bike que se realiza em **Monte do Trigo, Évora**, com **24 edições** de história e tradição no ciclismo alentejano.

## 📅 Data e Horário

- **Data:** Domingo, 29 de março de 2026
- **Hora de Partida:** 09:00
- **Local:** Monte do Trigo, Évora
- **Distrito:** Évora

## 🚴 Percursos Disponíveis

### BTT 65 km
Maratona completa com terreno desafiante e envolvente pelas paisagens únicas de Évora. Ideal para ciclistas experientes que procuram um desafio completo.

### BTT 45 km
Meia maratona perfeita para ciclistas intermédios que querem desfrutar das paisagens alentejanas num percurso mais acessível mas igualmente apelativo.

## 🏆 Categorias Disponíveis

### Masculinos
- **Sem escalão** (0-15 anos)
- **Juniores M** (16-19 anos)
- **Elites M** (20-29 anos)
- **Master 30** (30-34 anos)
- **Master 35** (35-39 anos)
- **Master 40** (40-44 anos)
- **Master 45** (45-49 anos)
- **Master 50** (50-54 anos)
- **Master 55** (55-59 anos)
- **Master 60** (60+ anos)

### Femininos
- **Elites Femininos** (16-39 anos)
- **Master Femininos** (40+ anos)

### E-Bikes
- **E-Bikes Masculinos** (16+ anos)
- **E-Bikes Femininos** (16+ anos)

## 🎁 O Que Está Incluído

- ✅ Dorsal de participante
- ✅ Cronometragem eletrónica
- ✅ Resultados ao vivo por categoria
- ✅ Seguro de acidentes pessoais
- ✅ Abastecimentos ao longo do percurso
- ✅ Classificação por categorias
- ✅ Atmosfera festiva e comunitária

## 🍽️ Almoço Opcional

- **Almoço:** 10€ (opcional)
- **Acompanhantes:** 10€

## 📞 Contactos

- **Telemóvel:** 962 444 026

## 🏔️ Percurso

Terreno variado com trilhos de mountain bike que destacam as magníficas paisagens da região de Évora. O percurso oferece:
- Trilhos técnicos e desafiantes
- Paisagens únicas do Alentejo
- Terreno envolvente e competitivo
- Zonas de abastecimento estratégicas

## ⚠️ Informações Importantes

- **Prazo de Inscrições:** Até 24 de março de 2026 às 23:59
- **Tipo de Superfície:** Trilhos de mountain bike
- **Formato:** Percursos de maratona (65km) e meia maratona (45km)
- **Partida/Chegada:** Monte do Trigo, Évora`,
    },
    {
      language: "en",
      title: "24th BTTTrigo Marathon",
      city: "Monte do Trigo",
      metaTitle:
        "24th BTTTrigo Marathon 2026 | Monte do Trigo, Évora | March 29",
      metaDescription:
        "24th BTTTrigo Marathon 2026 - March 29 in Monte do Trigo, Évora. 65km and 45km routes through Alentejo landscapes. Registration: €15. Categories from Elite to Master 60+.",
      description: `# 🚴 24th BTTTrigo Marathon 2026

The **24th BTTTrigo Marathon** is a traditional mountain bike event held in **Monte do Trigo, Évora**, with **24 editions** of history and tradition in Alentejo cycling.

## 📅 Date and Schedule

- **Date:** Sunday, March 29, 2026
- **Start Time:** 09:00
- **Location:** Monte do Trigo, Évora
- **District:** Évora

## 🚴 Available Routes

### MTB 65 km
Full marathon with challenging and engaging terrain through the unique landscapes of Évora. Ideal for experienced cyclists seeking a complete challenge.

### MTB 45 km
Half marathon perfect for intermediate cyclists who want to enjoy the Alentejo landscapes on a more accessible yet equally appealing route.

## 🏆 Available Categories

### Men's
- **No category** (0-15 years)
- **Juniors M** (16-19 years)
- **Elite M** (20-29 years)
- **Master 30** (30-34 years)
- **Master 35** (35-39 years)
- **Master 40** (40-44 years)
- **Master 45** (45-49 years)
- **Master 50** (50-54 years)
- **Master 55** (55-59 years)
- **Master 60** (60+ years)

### Women's
- **Elite Women** (16-39 years)
- **Master Women** (40+ years)

### E-Bikes
- **E-Bikes Men** (16+ years)
- **E-Bikes Women** (16+ years)

## 🎁 What's Included

- ✅ Participant number plate
- ✅ Electronic timing
- ✅ Live results by category
- ✅ Personal accident insurance
- ✅ Refreshments along the route
- ✅ Category rankings
- ✅ Festive and community atmosphere

## 🍽️ Optional Lunch

- **Lunch:** €10 (optional)
- **Companions:** €10

## 📞 Contacts

- **Phone:** +351 962 444 026

## 🏔️ Route

Varied terrain with mountain bike trails highlighting the magnificent landscapes of the Évora region. The route offers:
- Technical and challenging trails
- Unique Alentejo landscapes
- Engaging and competitive terrain
- Strategic refreshment zones

## ⚠️ Important Information

- **Registration Deadline:** Until March 24, 2026 at 23:59
- **Surface Type:** Mountain bike trails
- **Format:** Marathon (65km) and half-marathon (45km) routes
- **Start/Finish:** Monte do Trigo, Évora`,
    },
    {
      language: "es",
      title: "24ª Maratón BTTTrigo",
      city: "Monte do Trigo",
      metaTitle: "24ª Maratón BTTTrigo 2026 | Monte do Trigo, Évora | 29 Marzo",
      metaDescription:
        "24ª Maratón BTTTrigo 2026 - 29 de marzo en Monte do Trigo, Évora. Recorridos de 65km y 45km por los paisajes del Alentejo. Inscripciones: 15€. Categorías de Elite a Master 60+.",
      description: `# 🚴 24ª Maratón BTTTrigo 2026

La **24ª Maratón BTTTrigo** es un evento tradicional de mountain bike que se realiza en **Monte do Trigo, Évora**, con **24 ediciones** de historia y tradición en el ciclismo del Alentejo.

## 📅 Fecha y Horario

- **Fecha:** Domingo, 29 de marzo de 2026
- **Hora de Salida:** 09:00
- **Lugar:** Monte do Trigo, Évora
- **Distrito:** Évora

## 🚴 Recorridos Disponibles

### BTT 65 km
Maratón completa con terreno desafiante y atractivo por los paisajes únicos de Évora. Ideal para ciclistas experimentados que buscan un desafío completo.

### BTT 45 km
Media maratón perfecta para ciclistas intermedios que quieren disfrutar de los paisajes del Alentejo en un recorrido más accesible pero igualmente atractivo.

## 🏆 Categorías Disponibles

### Masculinos
- **Sin categoría** (0-15 años)
- **Juniores M** (16-19 años)
- **Elites M** (20-29 años)
- **Master 30** (30-34 años)
- **Master 35** (35-39 años)
- **Master 40** (40-44 años)
- **Master 45** (45-49 años)
- **Master 50** (50-54 años)
- **Master 55** (55-59 años)
- **Master 60** (60+ años)

### Femeninos
- **Elites Femeninos** (16-39 años)
- **Master Femeninos** (40+ años)

### E-Bikes
- **E-Bikes Masculinos** (16+ años)
- **E-Bikes Femeninos** (16+ años)

## 🎁 Qué Está Incluido

- ✅ Dorsal de participante
- ✅ Cronometraje electrónico
- ✅ Resultados en vivo por categoría
- ✅ Seguro de accidentes personales
- ✅ Avituallamientos a lo largo del recorrido
- ✅ Clasificación por categorías
- ✅ Atmósfera festiva y comunitaria

## 🍽️ Almuerzo Opcional

- **Almuerzo:** 10€ (opcional)
- **Acompañantes:** 10€

## 📞 Contactos

- **Teléfono:** +351 962 444 026

## 🏔️ Recorrido

Terreno variado con senderos de mountain bike que destacan los magníficos paisajes de la región de Évora. El recorrido ofrece:
- Senderos técnicos y desafiantes
- Paisajes únicos del Alentejo
- Terreno atractivo y competitivo
- Zonas de avituallamiento estratégicas

## ⚠️ Información Importante

- **Plazo de Inscripciones:** Hasta el 24 de marzo de 2026 a las 23:59
- **Tipo de Superficie:** Senderos de mountain bike
- **Formato:** Recorridos de maratón (65km) y media maratón (45km)
- **Salida/Llegada:** Monte do Trigo, Évora`,
    },
    {
      language: "fr",
      title: "24ème Marathon BTTTrigo",
      city: "Monte do Trigo",
      metaTitle:
        "24ème Marathon BTTTrigo 2026 | Monte do Trigo, Évora | 29 Mars",
      metaDescription:
        "24ème Marathon BTTTrigo 2026 - 29 mars à Monte do Trigo, Évora. Parcours de 65km et 45km à travers les paysages de l'Alentejo. Inscriptions: 15€. Catégories d'Elite à Master 60+.",
      description: `# 🚴 24ème Marathon BTTTrigo 2026

Le **24ème Marathon BTTTrigo** est un événement traditionnel de VTT qui se déroule à **Monte do Trigo, Évora**, avec **24 éditions** d'histoire et de tradition dans le cyclisme de l'Alentejo.

## 📅 Date et Horaire

- **Date:** Dimanche, 29 mars 2026
- **Heure de Départ:** 09:00
- **Lieu:** Monte do Trigo, Évora
- **District:** Évora

## 🚴 Parcours Disponibles

### VTT 65 km
Marathon complet avec un terrain difficile et engageant à travers les paysages uniques d'Évora. Idéal pour les cyclistes expérimentés à la recherche d'un défi complet.

### VTT 45 km
Semi-marathon parfait pour les cyclistes intermédiaires qui veulent profiter des paysages de l'Alentejo sur un parcours plus accessible mais tout aussi attrayant.

## 🏆 Catégories Disponibles

### Hommes
- **Sans catégorie** (0-15 ans)
- **Juniors M** (16-19 ans)
- **Elites M** (20-29 ans)
- **Master 30** (30-34 ans)
- **Master 35** (35-39 ans)
- **Master 40** (40-44 ans)
- **Master 45** (45-49 ans)
- **Master 50** (50-54 ans)
- **Master 55** (55-59 ans)
- **Master 60** (60+ ans)

### Femmes
- **Elites Femmes** (16-39 ans)
- **Master Femmes** (40+ ans)

### E-Bikes
- **E-Bikes Hommes** (16+ ans)
- **E-Bikes Femmes** (16+ ans)

## 🎁 Ce Qui Est Inclus

- ✅ Dossard de participant
- ✅ Chronométrage électronique
- ✅ Résultats en direct par catégorie
- ✅ Assurance accidents personnels
- ✅ Ravitaillements le long du parcours
- ✅ Classement par catégories
- ✅ Atmosphère festive et communautaire

## 🍽️ Déjeuner Optionnel

- **Déjeuner:** 10€ (optionnel)
- **Accompagnants:** 10€

## 📞 Contacts

- **Téléphone:** +351 962 444 026

## 🏔️ Parcours

Terrain varié avec des sentiers de VTT mettant en valeur les magnifiques paysages de la région d'Évora. Le parcours offre:
- Sentiers techniques et difficiles
- Paysages uniques de l'Alentejo
- Terrain engageant et compétitif
- Zones de ravitaillement stratégiques

## ⚠️ Informations Importantes

- **Date Limite d'Inscription:** Jusqu'au 24 mars 2026 à 23:59
- **Type de Surface:** Sentiers de VTT
- **Format:** Parcours de marathon (65km) et semi-marathon (45km)
- **Départ/Arrivée:** Monte do Trigo, Évora`,
    },
    {
      language: "de",
      title: "24. BTTTrigo Marathon",
      city: "Monte do Trigo",
      metaTitle:
        "24. BTTTrigo Marathon 2026 | Monte do Trigo, Évora | 29. März",
      metaDescription:
        "24. BTTTrigo Marathon 2026 - 29. März in Monte do Trigo, Évora. 65km und 45km Strecken durch die Landschaften des Alentejo. Anmeldung: 15€. Kategorien von Elite bis Master 60+.",
      description: `# 🚴 24. BTTTrigo Marathon 2026

Der **24. BTTTrigo Marathon** ist eine traditionelle Mountainbike-Veranstaltung in **Monte do Trigo, Évora**, mit **24 Ausgaben** Geschichte und Tradition im Alentejo-Radsport.

## 📅 Datum und Zeitplan

- **Datum:** Sonntag, 29. März 2026
- **Startzeit:** 09:00 Uhr
- **Ort:** Monte do Trigo, Évora
- **Bezirk:** Évora

## 🚴 Verfügbare Strecken

### MTB 65 km
Vollständiger Marathon mit anspruchsvollem und fesselndem Gelände durch die einzigartigen Landschaften von Évora. Ideal für erfahrene Radfahrer, die eine komplette Herausforderung suchen.

### MTB 45 km
Halbmarathon perfekt für mittlere Radfahrer, die die Landschaften des Alentejo auf einer zugänglicheren, aber ebenso ansprechenden Strecke genießen möchten.

## 🏆 Verfügbare Kategorien

### Männer
- **Keine Kategorie** (0-15 Jahre)
- **Junioren M** (16-19 Jahre)
- **Elite M** (20-29 Jahre)
- **Master 30** (30-34 Jahre)
- **Master 35** (35-39 Jahre)
- **Master 40** (40-44 Jahre)
- **Master 45** (45-49 Jahre)
- **Master 50** (50-54 Jahre)
- **Master 55** (55-59 Jahre)
- **Master 60** (60+ Jahre)

### Frauen
- **Elite Frauen** (16-39 Jahre)
- **Master Frauen** (40+ Jahre)

### E-Bikes
- **E-Bikes Männer** (16+ Jahre)
- **E-Bikes Frauen** (16+ Jahre)

## 🎁 Was Enthalten Ist

- ✅ Teilnehmernummer
- ✅ Elektronische Zeitmessung
- ✅ Live-Ergebnisse nach Kategorie
- ✅ Persönliche Unfallversicherung
- ✅ Verpflegung entlang der Strecke
- ✅ Kategorie-Wertungen
- ✅ Festliche und gemeinschaftliche Atmosphäre

## 🍽️ Optionales Mittagessen

- **Mittagessen:** 10€ (optional)
- **Begleiter:** 10€

## 📞 Kontakte

- **Telefon:** +351 962 444 026

## 🏔️ Strecke

Abwechslungsreiches Gelände mit Mountainbike-Trails, die die herrlichen Landschaften der Region Évora hervorheben. Die Strecke bietet:
- Technische und anspruchsvolle Trails
- Einzigartige Alentejo-Landschaften
- Fesselndes und wettbewerbsfähiges Gelände
- Strategische Verpflegungszonen

## ⚠️ Wichtige Informationen

- **Anmeldefrist:** Bis 24. März 2026 um 23:59 Uhr
- **Oberflächentyp:** Mountainbike-Trails
- **Format:** Marathon (65km) und Halbmarathon (45km) Strecken
- **Start/Ziel:** Monte do Trigo, Évora`,
    },
    {
      language: "it",
      title: "24ª Maratona BTTTrigo",
      city: "Monte do Trigo",
      metaTitle:
        "24ª Maratona BTTTrigo 2026 | Monte do Trigo, Évora | 29 Marzo",
      metaDescription:
        "24ª Maratona BTTTrigo 2026 - 29 marzo a Monte do Trigo, Évora. Percorsi di 65km e 45km attraverso i paesaggi dell'Alentejo. Iscrizioni: 15€. Categorie da Elite a Master 60+.",
      description: `# 🚴 24ª Maratona BTTTrigo 2026

La **24ª Maratona BTTTrigo** è un evento tradizionale di mountain bike che si svolge a **Monte do Trigo, Évora**, con **24 edizioni** di storia e tradizione nel ciclismo dell'Alentejo.

## 📅 Data e Orario

- **Data:** Domenica, 29 marzo 2026
- **Orario di Partenza:** 09:00
- **Luogo:** Monte do Trigo, Évora
- **Distretto:** Évora

## 🚴 Percorsi Disponibili

### MTB 65 km
Maratona completa con terreno impegnativo e coinvolgente attraverso i paesaggi unici di Évora. Ideale per ciclisti esperti in cerca di una sfida completa.

### MTB 45 km
Mezza maratona perfetta per ciclisti intermedi che vogliono godersi i paesaggi dell'Alentejo su un percorso più accessibile ma altrettanto attraente.

## 🏆 Categorie Disponibili

### Maschili
- **Senza categoria** (0-15 anni)
- **Juniores M** (16-19 anni)
- **Elite M** (20-29 anni)
- **Master 30** (30-34 anni)
- **Master 35** (35-39 anni)
- **Master 40** (40-44 anni)
- **Master 45** (45-49 anni)
- **Master 50** (50-54 anni)
- **Master 55** (55-59 anni)
- **Master 60** (60+ anni)

### Femminili
- **Elite Femminili** (16-39 anni)
- **Master Femminili** (40+ anni)

### E-Bikes
- **E-Bikes Maschili** (16+ anni)
- **E-Bikes Femminili** (16+ anni)

## 🎁 Cosa È Incluso

- ✅ Pettorale partecipante
- ✅ Cronometraggio elettronico
- ✅ Risultati in diretta per categoria
- ✅ Assicurazione infortuni personali
- ✅ Ristori lungo il percorso
- ✅ Classifiche per categorie
- ✅ Atmosfera festiva e comunitaria

## 🍽️ Pranzo Opzionale

- **Pranzo:** 10€ (opzionale)
- **Accompagnatori:** 10€

## 📞 Contatti

- **Telefono:** +351 962 444 026

## 🏔️ Percorso

Terreno vario con sentieri di mountain bike che evidenziano i magnifici paesaggi della regione di Évora. Il percorso offre:
- Sentieri tecnici e impegnativi
- Paesaggi unici dell'Alentejo
- Terreno coinvolgente e competitivo
- Zone di ristoro strategiche

## ⚠️ Informazioni Importanti

- **Scadenza Iscrizioni:** Fino al 24 marzo 2026 alle 23:59
- **Tipo di Superficie:** Sentieri di mountain bike
- **Formato:** Percorsi di maratona (65km) e mezza maratona (45km)
- **Partenza/Arrivo:** Monte do Trigo, Évora`,
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

  // Step 3: Helper function to find or create variant
  const findOrCreateVariant = async (variantData: {
    name: string;
    distanceKm: number;
    elevationGainM?: number;
    elevationLossM?: number;
    startTime: string;
    maxParticipants?: number;
    price?: number;
    currency?: Currency;
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

  // Step 4: Create event variants
  console.log("🚴 Creating variants...");

  // Variant 1: BTT 65km
  const btt65 = await findOrCreateVariant({
    name: "BTT 65 km",
    distanceKm: 65,
    elevationGainM: 800,
    elevationLossM: 800,
    startTime: "09:00",
    price: 15.0,
    currency: Currency.EUR,
  });

  const btt65Translations = [
    {
      language: Language.pt,
      name: "BTT 65 km",
      description:
        "Maratona completa de 65km pelas magníficas paisagens alentejanas. Terreno desafiante e envolvente com trilhos técnicos. Inclui dorsal, cronometragem eletrónica, resultados ao vivo e seguro. Categorias desde Juniores a Master 60+.",
    },
    {
      language: Language.en,
      name: "MTB 65 km",
      description:
        "Full 65km marathon through the magnificent Alentejo landscapes. Challenging and engaging terrain with technical trails. Includes number plate, electronic timing, live results and insurance. Categories from Juniors to Master 60+.",
    },
    {
      language: Language.es,
      name: "BTT 65 km",
      description:
        "Maratón completa de 65km por los magníficos paisajes del Alentejo. Terreno desafiante y atractivo con senderos técnicos. Incluye dorsal, cronometraje electrónico, resultados en vivo y seguro. Categorías desde Juniores hasta Master 60+.",
    },
    {
      language: Language.fr,
      name: "VTT 65 km",
      description:
        "Marathon complet de 65km à travers les magnifiques paysages de l'Alentejo. Terrain difficile et engageant avec des sentiers techniques. Comprend dossard, chronométrage électronique, résultats en direct et assurance. Catégories de Juniors à Master 60+.",
    },
    {
      language: Language.de,
      name: "MTB 65 km",
      description:
        "Vollständiger 65km Marathon durch die herrlichen Landschaften des Alentejo. Anspruchsvolles und fesselndes Gelände mit technischen Trails. Enthält Startnummer, elektronische Zeitmessung, Live-Ergebnisse und Versicherung. Kategorien von Junioren bis Master 60+.",
    },
    {
      language: Language.it,
      name: "MTB 65 km",
      description:
        "Maratona completa di 65km attraverso i magnifici paesaggi dell'Alentejo. Terreno impegnativo e coinvolgente con sentieri tecnici. Include pettorale, cronometraggio elettronico, risultati in diretta e assicurazione. Categorie da Juniores a Master 60+.",
    },
  ];

  for (const translation of btt65Translations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: btt65.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: btt65.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  console.log("   ✅ BTT 65km variant created");

  // Variant 2: BTT 45km
  const btt45 = await findOrCreateVariant({
    name: "BTT 45 km",
    distanceKm: 45,
    elevationGainM: 550,
    elevationLossM: 550,
    startTime: "09:00",
    price: 15.0,
    currency: Currency.EUR,
  });

  const btt45Translations = [
    {
      language: Language.pt,
      name: "BTT 45 km",
      description:
        "Meia maratona de 45km ideal para ciclistas intermédios. Percurso mais acessível pelas paisagens alentejanas mas igualmente apelativo. Inclui dorsal, cronometragem eletrónica, resultados ao vivo e seguro. Categorias desde Juniores a Master 60+.",
    },
    {
      language: Language.en,
      name: "MTB 45 km",
      description:
        "45km half marathon ideal for intermediate cyclists. More accessible route through Alentejo landscapes but equally appealing. Includes number plate, electronic timing, live results and insurance. Categories from Juniors to Master 60+.",
    },
    {
      language: Language.es,
      name: "BTT 45 km",
      description:
        "Media maratón de 45km ideal para ciclistas intermedios. Recorrido más accesible por los paisajes del Alentejo pero igualmente atractivo. Incluye dorsal, cronometraje electrónico, resultados en vivo y seguro. Categorías desde Juniores hasta Master 60+.",
    },
    {
      language: Language.fr,
      name: "VTT 45 km",
      description:
        "Semi-marathon de 45km idéal pour les cyclistes intermédiaires. Parcours plus accessible à travers les paysages de l'Alentejo mais tout aussi attrayant. Comprend dossard, chronométrage électronique, résultats en direct et assurance. Catégories de Juniors à Master 60+.",
    },
    {
      language: Language.de,
      name: "MTB 45 km",
      description:
        "45km Halbmarathon ideal für mittlere Radfahrer. Zugänglichere Strecke durch die Landschaften des Alentejo, aber ebenso ansprechend. Enthält Startnummer, elektronische Zeitmessung, Live-Ergebnisse und Versicherung. Kategorien von Junioren bis Master 60+.",
    },
    {
      language: Language.it,
      name: "MTB 45 km",
      description:
        "Mezza maratona di 45km ideale per ciclisti intermedi. Percorso più accessibile attraverso i paesaggi dell'Alentejo ma altrettanto attraente. Include pettorale, cronometraggio elettronico, risultati in diretta e assicurazione. Categorie da Juniores a Master 60+.",
    },
  ];

  for (const translation of btt45Translations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: btt45.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: btt45.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  console.log("   ✅ BTT 45km variant created");

  // Step 5: Helper function for pricing phases
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

  // Step 6: Create pricing phase
  console.log("💰 Creating pricing phase...");

  await findOrCreatePricingPhase("Preço Único", {
    startDate: new Date("2025-12-01T00:00:00.000Z"),
    endDate: new Date("2026-03-24T23:59:59.000Z"),
    price: 15.0,
    currency: Currency.EUR,
    note: "Preço único de inscrição para todos os percursos",
  });

  console.log("   ✅ Pricing phase created");

  // Step 7: Helper function for FAQs
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

  // Step 8: Create FAQs with translations
  console.log("❓ Creating FAQs...");

  const faq1 = await findOrCreateFAQ(
    event.id,
    1,
    "Qual é a diferença entre os percursos de 65km e 45km?",
    "O percurso de 65km é a maratona completa, mais desafiante e técnico, ideal para ciclistas experientes. O percurso de 45km é a meia maratona, mais acessível mas igualmente apelativo, perfeito para ciclistas intermédios."
  );

  await prisma.eventFAQTranslation.upsert({
    where: { faqId_language: { faqId: faq1.id, language: Language.pt } },
    update: {
      question: "Qual é a diferença entre os percursos de 65km e 45km?",
      answer:
        "O percurso de 65km é a maratona completa, mais desafiante e técnico, ideal para ciclistas experientes. O percurso de 45km é a meia maratona, mais acessível mas igualmente apelativo, perfeito para ciclistas intermédios.",
    },
    create: {
      faqId: faq1.id,
      language: Language.pt,
      question: "Qual é a diferença entre os percursos de 65km e 45km?",
      answer:
        "O percurso de 65km é a maratona completa, mais desafiante e técnico, ideal para ciclistas experientes. O percurso de 45km é a meia maratona, mais acessível mas igualmente apelativo, perfeito para ciclistas intermédios.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: { faqId_language: { faqId: faq1.id, language: Language.en } },
    update: {
      question: "What is the difference between the 65km and 45km routes?",
      answer:
        "The 65km route is the full marathon, more challenging and technical, ideal for experienced cyclists. The 45km route is the half marathon, more accessible but equally appealing, perfect for intermediate cyclists.",
    },
    create: {
      faqId: faq1.id,
      language: Language.en,
      question: "What is the difference between the 65km and 45km routes?",
      answer:
        "The 65km route is the full marathon, more challenging and technical, ideal for experienced cyclists. The 45km route is the half marathon, more accessible but equally appealing, perfect for intermediate cyclists.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: { faqId_language: { faqId: faq1.id, language: Language.es } },
    update: {
      question: "¿Cuál es la diferencia entre los recorridos de 65km y 45km?",
      answer:
        "El recorrido de 65km es la maratón completa, más desafiante y técnico, ideal para ciclistas experimentados. El recorrido de 45km es la media maratón, más accesible pero igualmente atractivo, perfecto para ciclistas intermedios.",
    },
    create: {
      faqId: faq1.id,
      language: Language.es,
      question: "¿Cuál es la diferencia entre los recorridos de 65km y 45km?",
      answer:
        "El recorrido de 65km es la maratón completa, más desafiante y técnico, ideal para ciclistas experimentados. El recorrido de 45km es la media maratón, más accesible pero igualmente atractivo, perfecto para ciclistas intermedios.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: { faqId_language: { faqId: faq1.id, language: Language.fr } },
    update: {
      question: "Quelle est la différence entre les parcours de 65km et 45km?",
      answer:
        "Le parcours de 65km est le marathon complet, plus difficile et technique, idéal pour les cyclistes expérimentés. Le parcours de 45km est le semi-marathon, plus accessible mais tout aussi attrayant, parfait pour les cyclistes intermédiaires.",
    },
    create: {
      faqId: faq1.id,
      language: Language.fr,
      question: "Quelle est la différence entre les parcours de 65km et 45km?",
      answer:
        "Le parcours de 65km est le marathon complet, plus difficile et technique, idéal pour les cyclistes expérimentés. Le parcours de 45km est le semi-marathon, plus accessible mais tout aussi attrayant, parfait pour les cyclistes intermédiaires.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: { faqId_language: { faqId: faq1.id, language: Language.de } },
    update: {
      question: "Was ist der Unterschied zwischen den 65km und 45km Strecken?",
      answer:
        "Die 65km Strecke ist der vollständige Marathon, anspruchsvoller und technischer, ideal für erfahrene Radfahrer. Die 45km Strecke ist der Halbmarathon, zugänglicher aber ebenso ansprechend, perfekt für mittlere Radfahrer.",
    },
    create: {
      faqId: faq1.id,
      language: Language.de,
      question: "Was ist der Unterschied zwischen den 65km und 45km Strecken?",
      answer:
        "Die 65km Strecke ist der vollständige Marathon, anspruchsvoller und technischer, ideal für erfahrene Radfahrer. Die 45km Strecke ist der Halbmarathon, zugänglicher aber ebenso ansprechend, perfekt für mittlere Radfahrer.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: { faqId_language: { faqId: faq1.id, language: Language.it } },
    update: {
      question: "Qual è la differenza tra i percorsi di 65km e 45km?",
      answer:
        "Il percorso di 65km è la maratona completa, più impegnativo e tecnico, ideale per ciclisti esperti. Il percorso di 45km è la mezza maratona, più accessibile ma altrettanto attraente, perfetto per ciclisti intermedi.",
    },
    create: {
      faqId: faq1.id,
      language: Language.it,
      question: "Qual è la differenza tra i percorsi di 65km e 45km?",
      answer:
        "Il percorso di 65km è la maratona completa, più impegnativo e tecnico, ideale per ciclisti esperti. Il percorso di 45km è la mezza maratona, più accessibile ma altrettanto attraente, perfetto per ciclisti intermedi.",
    },
  });

  const faq2 = await findOrCreateFAQ(
    event.id,
    2,
    "Posso participar com E-Bike?",
    "Sim! Temos categorias específicas para E-Bikes tanto masculinas como femininas (16+ anos). Podes desfrutar do evento com assistência elétrica em qualquer um dos percursos."
  );

  await prisma.eventFAQTranslation.upsert({
    where: { faqId_language: { faqId: faq2.id, language: Language.pt } },
    update: {
      question: "Posso participar com E-Bike?",
      answer:
        "Sim! Temos categorias específicas para E-Bikes tanto masculinas como femininas (16+ anos). Podes desfrutar do evento com assistência elétrica em qualquer um dos percursos.",
    },
    create: {
      faqId: faq2.id,
      language: Language.pt,
      question: "Posso participar com E-Bike?",
      answer:
        "Sim! Temos categorias específicas para E-Bikes tanto masculinas como femininas (16+ anos). Podes desfrutar do evento com assistência elétrica em qualquer um dos percursos.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: { faqId_language: { faqId: faq2.id, language: Language.en } },
    update: {
      question: "Can I participate with an E-Bike?",
      answer:
        "Yes! We have specific categories for E-Bikes both men's and women's (16+ years). You can enjoy the event with electric assistance on any of the routes.",
    },
    create: {
      faqId: faq2.id,
      language: Language.en,
      question: "Can I participate with an E-Bike?",
      answer:
        "Yes! We have specific categories for E-Bikes both men's and women's (16+ years). You can enjoy the event with electric assistance on any of the routes.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: { faqId_language: { faqId: faq2.id, language: Language.es } },
    update: {
      question: "¿Puedo participar con E-Bike?",
      answer:
        "¡Sí! Tenemos categorías específicas para E-Bikes tanto masculinas como femeninas (16+ años). Puedes disfrutar del evento con asistencia eléctrica en cualquiera de los recorridos.",
    },
    create: {
      faqId: faq2.id,
      language: Language.es,
      question: "¿Puedo participar con E-Bike?",
      answer:
        "¡Sí! Tenemos categorías específicas para E-Bikes tanto masculinas como femeninas (16+ años). Puedes disfrutar del evento con asistencia eléctrica en cualquiera de los recorridos.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: { faqId_language: { faqId: faq2.id, language: Language.fr } },
    update: {
      question: "Puis-je participer avec un E-Bike?",
      answer:
        "Oui! Nous avons des catégories spécifiques pour les E-Bikes hommes et femmes (16+ ans). Vous pouvez profiter de l'événement avec assistance électrique sur n'importe quel parcours.",
    },
    create: {
      faqId: faq2.id,
      language: Language.fr,
      question: "Puis-je participer avec un E-Bike?",
      answer:
        "Oui! Nous avons des catégories spécifiques pour les E-Bikes hommes et femmes (16+ ans). Vous pouvez profiter de l'événement avec assistance électrique sur n'importe quel parcours.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: { faqId_language: { faqId: faq2.id, language: Language.de } },
    update: {
      question: "Kann ich mit einem E-Bike teilnehmen?",
      answer:
        "Ja! Wir haben spezifische Kategorien für E-Bikes sowohl für Männer als auch für Frauen (16+ Jahre). Sie können die Veranstaltung mit elektrischer Unterstützung auf jeder der Strecken genießen.",
    },
    create: {
      faqId: faq2.id,
      language: Language.de,
      question: "Kann ich mit einem E-Bike teilnehmen?",
      answer:
        "Ja! Wir haben spezifische Kategorien für E-Bikes sowohl für Männer als auch für Frauen (16+ Jahre). Sie können die Veranstaltung mit elektrischer Unterstützung auf jeder der Strecken genießen.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: { faqId_language: { faqId: faq2.id, language: Language.it } },
    update: {
      question: "Posso partecipare con una E-Bike?",
      answer:
        "Sì! Abbiamo categorie specifiche per E-Bikes sia maschili che femminili (16+ anni). Puoi goderti l'evento con assistenza elettrica su qualsiasi percorso.",
    },
    create: {
      faqId: faq2.id,
      language: Language.it,
      question: "Posso partecipare con una E-Bike?",
      answer:
        "Sì! Abbiamo categorie specifiche per E-Bikes sia maschili che femminili (16+ anni). Puoi goderti l'evento con assistenza elettrica su qualsiasi percorso.",
    },
  });

  console.log("   ✅ Created 2 FAQs with 6 language translations each");

  console.log(`
🎉 24ª Maratona BTTTrigo 2026 seeded successfully!
   📍 Event: 24ª Maratona BTTTrigo
   🔗 Slug: ${event.slug}
   📅 Date: 2026-03-29
   📍 Location: Monte do Trigo, Évora, Portugal
   🚴 Variants: BTT 65km, BTT 45km
   💰 Pricing: €15 (preço único)
   ❓ FAQs: 2 questions with 6 language translations
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
