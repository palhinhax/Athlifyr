/**
 * Seed: 15ª Maratona "Rota do Casqueiro" 2026
 * Complete with translations in all 6 languages, FAQs and SEO
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding 15ª Maratona Rota do Casqueiro 2026...");

  const eventSlug = "maratona-rota-casqueiro-2026";

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
      title: '15ª Maratona "Rota do Casqueiro"',
      description:
        "Maratona BTT em homenagem ao tradicional pão de trigo alentejano. Percursos de 70km (GPS) e 40km pelos caminhos rurais e trilhos dos concelhos de Santiago do Cacém e Grândola.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-01T09:30:00.000Z"),
      endDate: null,
      city: "Vila Nova de Santo André",
      country: "Portugal",
      latitude: 38.0767,
      longitude: -8.7878,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Avenida+de+Santiago+Vila+Nova+de+Santo+Andr%C3%A9",
      externalUrl: "",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-02-24T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: '15ª Maratona "Rota do Casqueiro"',
      description:
        "Maratona BTT em homenagem ao tradicional pão de trigo alentejano. Percursos de 70km (GPS) e 40km pelos caminhos rurais e trilhos dos concelhos de Santiago do Cacém e Grândola.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-01T09:30:00.000Z"),
      endDate: null,
      city: "Vila Nova de Santo André",
      country: "Portugal",
      latitude: 38.0767,
      longitude: -8.7878,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Avenida+de+Santiago+Vila+Nova+de+Santo+Andr%C3%A9",
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
      title: '15ª Maratona "Rota do Casqueiro"',
      city: "Vila Nova de Santo André",
      metaTitle:
        '15ª Maratona BTT "Rota do Casqueiro" 2026 | Santo André, Setúbal | 1 Março',
      metaDescription:
        '15ª Maratona BTT "Rota do Casqueiro" 2026 - 1 de março em Vila Nova de Santo André. Maratona 70km (GPS) e Meia-Maratona 40km. Taça Regional XCM. Trilhos do Alentejo Litoral.',
      description: `# 🚴 15ª Maratona "Rota do Casqueiro" 2026

A **15ª Maratona BTT "Rota do Casqueiro"** é organizada pel'**Os Kotas**, em homenagem ao tradicional **pão de trigo alentejano - o Casqueiro**. Vem pedalar pelos caminhos rurais e trilhos dos concelhos de Santiago do Cacém e Grândola!

## 📅 Data e Local

- **Data:** 1 de março de 2026 (Domingo)
- **Partida:** 09:30 (E-Bikes box 1 | Maratona e Meia-Maratona box 2)
- **Local:** Avenida de Santiago, Vila Nova de Santo André
- **Distrito:** Setúbal

## 🚴 Percursos Disponíveis

| Percurso | Distância | Idade | Navegação |
|----------|-----------|-------|-----------|
| **Maratona** | ~70 km | ≥19 anos | Track GPS |
| **Meia-Maratona** | ~40 km | 14-75 anos | Marcado |

## 🏆 Categorias

**Masculinos:** Juniores (≤18, só Meia-Maratona), Elites (19-29), Veteranos A (30-39), B (40-49), C (50-59), D (60+)
**Femininos:** Juniores (≤18, só Meia-Maratona), Elites (19-29), Veteranas (30+)
**E-Bikes:** Classificação geral própria

## 📋 Programa

- **28/02** - 19:00-21:00 Secretariado (véspera)
- **01/03** - 07:30 Secretariado e pequeno-almoço
- **08:30** - Controlo "km 0"
- **09:15** - Briefing
- **09:30** - Partida
- **12:00** - Almoços
- **15:00** - Entrega de prémios

## 🎁 A Inscrição Inclui

- ✅ Seguro de acidentes pessoais e responsabilidade civil
- ✅ Lembranças
- ✅ Frontal (dorsal)
- ✅ Pequeno-almoço
- ✅ Abastecimentos líquidos e sólidos
- ✅ Banhos
- ✅ Apoio mecânico no percurso

## ⏱️ Tempo Máximo

- **Maratona:** 7 horas

## 📧 Contactos

- **Email:** kotasbiketeam@gmail.com
- **Telemóvel:** 924 437 822`,
    },
    {
      language: "en",
      title: '15th Marathon "Rota do Casqueiro"',
      city: "Vila Nova de Santo André",
      metaTitle:
        '15th BTT Marathon "Rota do Casqueiro" 2026 | Santo André, Setúbal | March 1',
      metaDescription:
        '15th BTT Marathon "Rota do Casqueiro" 2026 - March 1 in Vila Nova de Santo André. Marathon 70km (GPS) and Half-Marathon 40km. Regional XCM Cup. Alentejo coastal trails.',
      description: `# 🚴 15th Marathon "Rota do Casqueiro" 2026

The **15th BTT Marathon "Rota do Casqueiro"** is organized by **Os Kotas**, paying tribute to the traditional **Alentejo wheat bread - the Casqueiro**. Come pedal through the rural paths and trails of Santiago do Cacém and Grândola!

## 📅 Date and Location

- **Date:** March 1, 2026 (Sunday)
- **Start:** 09:30 (E-Bikes box 1 | Marathon and Half-Marathon box 2)
- **Location:** Avenida de Santiago, Vila Nova de Santo André
- **District:** Setúbal

## 🚴 Available Routes

| Route | Distance | Age | Navigation |
|-------|----------|-----|------------|
| **Marathon** | ~70 km | ≥19 years | GPS Track |
| **Half-Marathon** | ~40 km | 14-75 years | Marked |

## 🏆 Categories

**Male:** Juniors (≤18, Half-Marathon only), Elites (19-29), Veterans A (30-39), B (40-49), C (50-59), D (60+)
**Female:** Juniors (≤18, Half-Marathon only), Elites (19-29), Veterans (30+)
**E-Bikes:** Separate overall ranking

## 📋 Schedule

- **Feb 28** - 19:00-21:00 Registration (day before)
- **Mar 1** - 07:30 Registration and breakfast
- **08:30** - "km 0" control
- **09:15** - Briefing
- **09:30** - Start
- **12:00** - Lunch
- **15:00** - Prize giving

## 🎁 Registration Includes

- ✅ Personal accident and liability insurance
- ✅ Souvenirs
- ✅ Race number
- ✅ Breakfast
- ✅ Liquid and solid refreshments
- ✅ Showers
- ✅ Mechanical support on course

## ⏱️ Maximum Time

- **Marathon:** 7 hours

## 📧 Contacts

- **Email:** kotasbiketeam@gmail.com
- **Phone:** 924 437 822`,
    },
    {
      language: "es",
      title: '15ª Maratón "Rota do Casqueiro"',
      city: "Vila Nova de Santo André",
      metaTitle:
        '15ª Maratón BTT "Rota do Casqueiro" 2026 | Santo André, Setúbal | 1 Marzo',
      metaDescription:
        '15ª Maratón BTT "Rota do Casqueiro" 2026 - 1 de marzo en Vila Nova de Santo André. Maratón 70km (GPS) y Media Maratón 40km. Copa Regional XCM. Senderos del Alentejo Litoral.',
      description: `# 🚴 15ª Maratón "Rota do Casqueiro" 2026

La **15ª Maratón BTT "Rota do Casqueiro"** está organizada por **Os Kotas**, en homenaje al tradicional **pan de trigo alentejano - el Casqueiro**. ¡Ven a pedalear por los caminos rurales y senderos de Santiago do Cacém y Grândola!

## 📅 Fecha y Lugar

- **Fecha:** 1 de marzo de 2026 (Domingo)
- **Salida:** 09:30 (E-Bikes box 1 | Maratón y Media Maratón box 2)
- **Lugar:** Avenida de Santiago, Vila Nova de Santo André
- **Distrito:** Setúbal

## 🚴 Recorridos Disponibles

| Recorrido | Distancia | Edad | Navegación |
|-----------|-----------|------|------------|
| **Maratón** | ~70 km | ≥19 años | Track GPS |
| **Media Maratón** | ~40 km | 14-75 años | Señalizado |

## 🏆 Categorías

**Masculinos:** Júniors (≤18, solo Media Maratón), Elites (19-29), Veteranos A (30-39), B (40-49), C (50-59), D (60+)
**Femeninos:** Júniors (≤18, solo Media Maratón), Elites (19-29), Veteranas (30+)
**E-Bikes:** Clasificación general propia

## 📋 Programa

- **28/02** - 19:00-21:00 Secretaría (víspera)
- **01/03** - 07:30 Secretaría y desayuno
- **08:30** - Control "km 0"
- **09:15** - Briefing
- **09:30** - Salida
- **12:00** - Almuerzos
- **15:00** - Entrega de premios

## 🎁 La Inscripción Incluye

- ✅ Seguro de accidentes personales y responsabilidad civil
- ✅ Recuerdos
- ✅ Dorsal
- ✅ Desayuno
- ✅ Avituallamientos líquidos y sólidos
- ✅ Duchas
- ✅ Apoyo mecánico en el recorrido

## ⏱️ Tiempo Máximo

- **Maratón:** 7 horas

## 📧 Contactos

- **Email:** kotasbiketeam@gmail.com
- **Teléfono:** 924 437 822`,
    },
    {
      language: "fr",
      title: '15e Marathon "Rota do Casqueiro"',
      city: "Vila Nova de Santo André",
      metaTitle:
        '15e Marathon VTT "Rota do Casqueiro" 2026 | Santo André, Setúbal | 1er Mars',
      metaDescription:
        '15e Marathon VTT "Rota do Casqueiro" 2026 - 1er mars à Vila Nova de Santo André. Marathon 70km (GPS) et Semi-Marathon 40km. Coupe Régionale XCM. Sentiers de l\'Alentejo Littoral.',
      description: `# 🚴 15e Marathon "Rota do Casqueiro" 2026

Le **15e Marathon VTT "Rota do Casqueiro"** est organisé par **Os Kotas**, en hommage au traditionnel **pain de blé de l'Alentejo - le Casqueiro**. Venez pédaler sur les chemins ruraux et sentiers de Santiago do Cacém et Grândola !

## 📅 Date et Lieu

- **Date:** 1er mars 2026 (Dimanche)
- **Départ:** 09:30 (E-Bikes box 1 | Marathon et Semi-Marathon box 2)
- **Lieu:** Avenida de Santiago, Vila Nova de Santo André
- **District:** Setúbal

## 🚴 Parcours Disponibles

| Parcours | Distance | Âge | Navigation |
|----------|----------|-----|-----------|
| **Marathon** | ~70 km | ≥19 ans | Track GPS |
| **Semi-Marathon** | ~40 km | 14-75 ans | Balisé |

## 🏆 Catégories

**Hommes:** Juniors (≤18, Semi-Marathon uniquement), Élites (19-29), Vétérans A (30-39), B (40-49), C (50-59), D (60+)
**Femmes:** Juniors (≤18, Semi-Marathon uniquement), Élites (19-29), Vétéranes (30+)
**E-Bikes:** Classement général séparé

## 📋 Programme

- **28/02** - 19:00-21:00 Secrétariat (veille)
- **01/03** - 07:30 Secrétariat et petit-déjeuner
- **08:30** - Contrôle "km 0"
- **09:15** - Briefing
- **09:30** - Départ
- **12:00** - Déjeuners
- **15:00** - Remise des prix

## 🎁 L'Inscription Comprend

- ✅ Assurance accidents personnels et responsabilité civile
- ✅ Souvenirs
- ✅ Dossard
- ✅ Petit-déjeuner
- ✅ Ravitaillements liquides et solides
- ✅ Douches
- ✅ Assistance mécanique sur le parcours

## ⏱️ Temps Maximum

- **Marathon:** 7 heures

## 📧 Contacts

- **Email:** kotasbiketeam@gmail.com
- **Téléphone:** 924 437 822`,
    },
    {
      language: "de",
      title: '15. Marathon "Rota do Casqueiro"',
      city: "Vila Nova de Santo André",
      metaTitle:
        '15. MTB Marathon "Rota do Casqueiro" 2026 | Santo André, Setúbal | 1. März',
      metaDescription:
        '15. MTB Marathon "Rota do Casqueiro" 2026 - 1. März in Vila Nova de Santo André. Marathon 70km (GPS) und Halbmarathon 40km. Regionaler XCM Pokal. Trails der Alentejo-Küste.',
      description: `# 🚴 15. Marathon "Rota do Casqueiro" 2026

Der **15. MTB Marathon "Rota do Casqueiro"** wird von **Os Kotas** organisiert, als Hommage an das traditionelle **Weizenbrot aus dem Alentejo - den Casqueiro**. Komm und fahre durch die ländlichen Wege und Trails von Santiago do Cacém und Grândola!

## 📅 Datum und Ort

- **Datum:** 1. März 2026 (Sonntag)
- **Start:** 09:30 Uhr (E-Bikes Box 1 | Marathon und Halbmarathon Box 2)
- **Ort:** Avenida de Santiago, Vila Nova de Santo André
- **Bezirk:** Setúbal

## 🚴 Verfügbare Strecken

| Strecke | Distanz | Alter | Navigation |
|---------|---------|-------|------------|
| **Marathon** | ~70 km | ≥19 Jahre | GPS Track |
| **Halbmarathon** | ~40 km | 14-75 Jahre | Markiert |

## 🏆 Kategorien

**Männer:** Junioren (≤18, nur Halbmarathon), Elites (19-29), Veteranen A (30-39), B (40-49), C (50-59), D (60+)
**Frauen:** Juniorinnen (≤18, nur Halbmarathon), Elites (19-29), Veteraninnen (30+)
**E-Bikes:** Separate Gesamtwertung

## 📋 Programm

- **28.02** - 19:00-21:00 Sekretariat (Vortag)
- **01.03** - 07:30 Sekretariat und Frühstück
- **08:30** - Kontrolle "km 0"
- **09:15** - Briefing
- **09:30** - Start
- **12:00** - Mittagessen
- **15:00** - Preisverleihung

## 🎁 Die Anmeldung Beinhaltet

- ✅ Persönliche Unfallversicherung und Haftpflichtversicherung
- ✅ Erinnerungsgeschenke
- ✅ Startnummer
- ✅ Frühstück
- ✅ Flüssige und feste Verpflegung
- ✅ Duschen
- ✅ Mechanische Unterstützung auf der Strecke

## ⏱️ Maximale Zeit

- **Marathon:** 7 Stunden

## 📧 Kontakt

- **Email:** kotasbiketeam@gmail.com
- **Telefon:** 924 437 822`,
    },
    {
      language: "it",
      title: '15ª Maratona "Rota do Casqueiro"',
      city: "Vila Nova de Santo André",
      metaTitle:
        '15ª Maratona BTT "Rota do Casqueiro" 2026 | Santo André, Setúbal | 1 Marzo',
      metaDescription:
        '15ª Maratona BTT "Rota do Casqueiro" 2026 - 1 marzo a Vila Nova de Santo André. Maratona 70km (GPS) e Mezza Maratona 40km. Coppa Regionale XCM. Sentieri dell\'Alentejo Litorale.',
      description: `# 🚴 15ª Maratona "Rota do Casqueiro" 2026

La **15ª Maratona BTT "Rota do Casqueiro"** è organizzata da **Os Kotas**, in omaggio al tradizionale **pane di grano dell'Alentejo - il Casqueiro**. Vieni a pedalare per i sentieri rurali e i percorsi di Santiago do Cacém e Grândola!

## 📅 Data e Luogo

- **Data:** 1 marzo 2026 (Domenica)
- **Partenza:** 09:30 (E-Bikes box 1 | Maratona e Mezza Maratona box 2)
- **Luogo:** Avenida de Santiago, Vila Nova de Santo André
- **Distretto:** Setúbal

## 🚴 Percorsi Disponibili

| Percorso | Distanza | Età | Navigazione |
|----------|----------|-----|-------------|
| **Maratona** | ~70 km | ≥19 anni | Track GPS |
| **Mezza Maratona** | ~40 km | 14-75 anni | Segnalato |

## 🏆 Categorie

**Maschili:** Juniores (≤18, solo Mezza Maratona), Élites (19-29), Veterani A (30-39), B (40-49), C (50-59), D (60+)
**Femminili:** Juniores (≤18, solo Mezza Maratona), Élites (19-29), Veterane (30+)
**E-Bikes:** Classifica generale separata

## 📋 Programma

- **28/02** - 19:00-21:00 Segreteria (vigilia)
- **01/03** - 07:30 Segreteria e colazione
- **08:30** - Controllo "km 0"
- **09:15** - Briefing
- **09:30** - Partenza
- **12:00** - Pranzi
- **15:00** - Premiazioni

## 🎁 L'Iscrizione Include

- ✅ Assicurazione infortuni personali e responsabilità civile
- ✅ Ricordi
- ✅ Pettorale
- ✅ Colazione
- ✅ Ristori liquidi e solidi
- ✅ Docce
- ✅ Assistenza meccanica sul percorso

## ⏱️ Tempo Massimo

- **Maratona:** 7 ore

## 📧 Contatti

- **Email:** kotasbiketeam@gmail.com
- **Telefono:** 924 437 822`,
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

  // Variant 1: Maratona ~70km
  const maratona = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Maratona 70km",
      distanceKm: 70,
      startTime: "09:30",
      cutoffTimeHours: 7,
      price: 15.0,
      currency: "EUR",
    },
  });

  const maratonaTranslations = [
    {
      language: "pt" as const,
      name: "Maratona 70km",
      description:
        "Percurso de ~70km com Track GPS pelos caminhos rurais e trilhos de Santiago do Cacém e Grândola. Carácter competitivo. Pontuável para a Taça Regional XCM da ACD Setúbal. Idade mínima: 19 anos. Tempo máximo: 7h.",
    },
    {
      language: "en" as const,
      name: "Marathon 70km",
      description:
        "~70km GPS Track route through rural paths and trails of Santiago do Cacém and Grândola. Competitive character. Counts for the ACD Setúbal Regional XCM Cup. Minimum age: 19 years. Maximum time: 7h.",
    },
    {
      language: "es" as const,
      name: "Maratón 70km",
      description:
        "Recorrido de ~70km con Track GPS por caminos rurales y senderos de Santiago do Cacém y Grândola. Carácter competitivo. Puntuable para la Copa Regional XCM de ACD Setúbal. Edad mínima: 19 años. Tiempo máximo: 7h.",
    },
    {
      language: "fr" as const,
      name: "Marathon 70km",
      description:
        "Parcours de ~70km avec Track GPS sur chemins ruraux et sentiers de Santiago do Cacém et Grândola. Caractère compétitif. Comptant pour la Coupe Régionale XCM de l'ACD Setúbal. Âge minimum: 19 ans. Temps maximum: 7h.",
    },
    {
      language: "de" as const,
      name: "Marathon 70km",
      description:
        "~70km GPS-Track-Strecke durch ländliche Wege und Trails von Santiago do Cacém und Grândola. Wettkampfcharakter. Wertung für den Regionalen XCM Pokal der ACD Setúbal. Mindestalter: 19 Jahre. Maximale Zeit: 7h.",
    },
    {
      language: "it" as const,
      name: "Maratona 70km",
      description:
        "Percorso di ~70km con Track GPS per sentieri rurali e percorsi di Santiago do Cacém e Grândola. Carattere competitivo. Valido per la Coppa Regionale XCM dell'ACD Setúbal. Età minima: 19 anni. Tempo massimo: 7h.",
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

  console.log("   ✅ Maratona 70km created");

  // Variant 2: Meia-Maratona ~40km
  const meiaMaratona = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Meia-Maratona 40km",
      distanceKm: 40,
      startTime: "09:30",
      price: 15.0,
      currency: "EUR",
    },
  });

  const meiaMaratonaTranslations = [
    {
      language: "pt" as const,
      name: "Meia-Maratona 40km",
      description:
        "Percurso de ~40km marcado com placas e fitas pelos caminhos rurais e trilhos de Santiago do Cacém e Grândola. Prova mista de lazer e superação pessoal. Idade: 14 a 75 anos.",
    },
    {
      language: "en" as const,
      name: "Half-Marathon 40km",
      description:
        "~40km route marked with signs and ribbons through rural paths and trails of Santiago do Cacém and Grândola. Mixed leisure and personal challenge ride. Age: 14 to 75 years.",
    },
    {
      language: "es" as const,
      name: "Media Maratón 40km",
      description:
        "Recorrido de ~40km señalizado con placas y cintas por caminos rurales y senderos de Santiago do Cacém y Grândola. Prueba mixta de ocio y superación personal. Edad: 14 a 75 años.",
    },
    {
      language: "fr" as const,
      name: "Semi-Marathon 40km",
      description:
        "Parcours de ~40km balisé avec panneaux et rubans sur chemins ruraux et sentiers de Santiago do Cacém et Grândola. Épreuve mixte loisir et dépassement personnel. Âge: 14 à 75 ans.",
    },
    {
      language: "de" as const,
      name: "Halbmarathon 40km",
      description:
        "~40km markierte Strecke mit Schildern und Bändern durch ländliche Wege und Trails von Santiago do Cacém und Grândola. Mischung aus Freizeit und persönlicher Herausforderung. Alter: 14 bis 75 Jahre.",
    },
    {
      language: "it" as const,
      name: "Mezza Maratona 40km",
      description:
        "Percorso di ~40km segnalato con cartelli e nastri per sentieri rurali e percorsi di Santiago do Cacém e Grândola. Prova mista di svago e sfida personale. Età: da 14 a 75 anni.",
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

  console.log("   ✅ Meia-Maratona 40km created");

  // Variant 3: Almoço
  const almoco = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Almoço Atletas",
      price: 10.0,
      currency: "EUR",
    },
  });

  const almocoTranslations = [
    {
      language: "pt" as const,
      name: "Almoço Atletas",
      description: "Almoço para atletas. Início às 12:00.",
    },
    {
      language: "en" as const,
      name: "Athlete Lunch",
      description: "Lunch for athletes. Starts at 12:00.",
    },
    {
      language: "es" as const,
      name: "Almuerzo Atletas",
      description: "Almuerzo para atletas. Inicio a las 12:00.",
    },
    {
      language: "fr" as const,
      name: "Déjeuner Athlètes",
      description: "Déjeuner pour athlètes. Début à 12:00.",
    },
    {
      language: "de" as const,
      name: "Mittagessen Athleten",
      description: "Mittagessen für Athleten. Beginn um 12:00 Uhr.",
    },
    {
      language: "it" as const,
      name: "Pranzo Atleti",
      description: "Pranzo per atleti. Inizio alle 12:00.",
    },
  ];

  for (const translation of almocoTranslations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: almoco.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: almoco.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  console.log("   ✅ Almoço Atletas created");

  // Variant 4: Acompanhantes
  const acompanhantes = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Acompanhantes",
      price: 12.0,
      currency: "EUR",
    },
  });

  const acompanhantesTranslations = [
    {
      language: "pt" as const,
      name: "Acompanhantes",
      description: "Inscrição para acompanhantes. Inclui almoço.",
    },
    {
      language: "en" as const,
      name: "Companions",
      description: "Companion registration. Includes lunch.",
    },
    {
      language: "es" as const,
      name: "Acompañantes",
      description: "Inscripción para acompañantes. Incluye almuerzo.",
    },
    {
      language: "fr" as const,
      name: "Accompagnants",
      description: "Inscription pour accompagnants. Déjeuner inclus.",
    },
    {
      language: "de" as const,
      name: "Begleitpersonen",
      description: "Anmeldung für Begleitpersonen. Mittagessen inklusive.",
    },
    {
      language: "it" as const,
      name: "Accompagnatori",
      description: "Iscrizione per accompagnatori. Pranzo incluso.",
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
      name: "Inscrição - Maratona / Meia-Maratona",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-02-24T23:59:59.000Z"),
      price: 15.0,
      currency: "EUR" as const,
      note: "Inclui seguro, lembranças, frontal, pequeno-almoço, abastecimentos e banhos",
    },
    {
      name: "Almoço Atletas",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-02-24T23:59:59.000Z"),
      price: 10.0,
      currency: "EUR" as const,
      note: "Almoço para atletas inscritos",
    },
    {
      name: "Acompanhantes",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-02-24T23:59:59.000Z"),
      price: 12.0,
      currency: "EUR" as const,
      note: "Almoço para acompanhantes",
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
      question: "Posso participar com E-Bike?",
      answer:
        "Sim, E-Bikes são permitidas. Partem na box 1, antes da Maratona e Meia-Maratona (box 2). A classificação dos atletas com E-Bike não conta para a geral, existindo uma classificação geral exclusiva para E-Bikes com prémios para 1.º, 2.º e 3.º.",
      translations: {
        pt: {
          question: "Posso participar com E-Bike?",
          answer:
            "Sim, E-Bikes são permitidas. Partem na box 1, antes da Maratona e Meia-Maratona (box 2). A classificação dos atletas com E-Bike não conta para a geral, existindo uma classificação geral exclusiva para E-Bikes com prémios para 1.º, 2.º e 3.º.",
        },
        en: {
          question: "Can I participate with an E-Bike?",
          answer:
            "Yes, E-Bikes are allowed. They start from box 1, before the Marathon and Half-Marathon (box 2). E-Bike athlete rankings don't count for the overall classification - there's a separate E-Bike overall ranking with prizes for 1st, 2nd and 3rd.",
        },
        es: {
          question: "¿Puedo participar con E-Bike?",
          answer:
            "Sí, las E-Bikes están permitidas. Salen en la box 1, antes de la Maratón y Media Maratón (box 2). La clasificación de los atletas con E-Bike no cuenta para la general, existiendo una clasificación general exclusiva para E-Bikes con premios para 1.º, 2.º y 3.º.",
        },
        fr: {
          question: "Puis-je participer avec un E-Bike?",
          answer:
            "Oui, les E-Bikes sont autorisés. Ils partent de la box 1, avant le Marathon et le Semi-Marathon (box 2). Le classement des athlètes en E-Bike ne compte pas pour le classement général - il existe un classement général séparé pour les E-Bikes avec des prix pour les 1er, 2e et 3e.",
        },
        de: {
          question: "Kann ich mit einem E-Bike teilnehmen?",
          answer:
            "Ja, E-Bikes sind erlaubt. Sie starten aus Box 1, vor dem Marathon und Halbmarathon (Box 2). Die Wertung der E-Bike-Athleten zählt nicht für die Gesamtwertung - es gibt eine separate E-Bike-Gesamtwertung mit Preisen für den 1., 2. und 3. Platz.",
        },
        it: {
          question: "Posso partecipare con una E-Bike?",
          answer:
            "Sì, le E-Bikes sono consentite. Partono dal box 1, prima della Maratona e Mezza Maratona (box 2). La classifica degli atleti con E-Bike non conta per la generale - esiste una classifica generale separata per le E-Bikes con premi per 1°, 2° e 3°.",
        },
      },
    },
    {
      order: 2,
      question: "Qual é a idade mínima para participar?",
      answer:
        "Maratona (70km): idade mínima de 19 anos. Meia-Maratona (40km): dos 14 aos 75 anos. Menores de 18 anos devem enviar Termo de Responsabilidade assinado pelo encarregado de educação, com cópias do Cartão de Cidadão de ambos.",
      translations: {
        pt: {
          question: "Qual é a idade mínima para participar?",
          answer:
            "Maratona (70km): idade mínima de 19 anos. Meia-Maratona (40km): dos 14 aos 75 anos. Menores de 18 anos devem enviar Termo de Responsabilidade assinado pelo encarregado de educação, com cópias do Cartão de Cidadão de ambos.",
        },
        en: {
          question: "What is the minimum age to participate?",
          answer:
            "Marathon (70km): minimum age 19 years. Half-Marathon (40km): 14 to 75 years. Under-18s must submit a Responsibility Form signed by their parent/guardian, with copies of both IDs.",
        },
        es: {
          question: "¿Cuál es la edad mínima para participar?",
          answer:
            "Maratón (70km): edad mínima 19 años. Media Maratón (40km): de 14 a 75 años. Los menores de 18 años deben enviar un Formulario de Responsabilidad firmado por su tutor, con copias de los documentos de identidad de ambos.",
        },
        fr: {
          question: "Quel est l'âge minimum pour participer?",
          answer:
            "Marathon (70km): âge minimum 19 ans. Semi-Marathon (40km): de 14 à 75 ans. Les moins de 18 ans doivent envoyer un Formulaire de Responsabilité signé par leur tuteur, avec copies des pièces d'identité des deux.",
        },
        de: {
          question: "Was ist das Mindestalter für die Teilnahme?",
          answer:
            "Marathon (70km): Mindestalter 19 Jahre. Halbmarathon (40km): 14 bis 75 Jahre. Unter-18-Jährige müssen eine Einverständniserklärung unterschrieben vom Erziehungsberechtigten einreichen, mit Kopien beider Ausweise.",
        },
        it: {
          question: "Qual è l'età minima per partecipare?",
          answer:
            "Maratona (70km): età minima 19 anni. Mezza Maratona (40km): da 14 a 75 anni. I minori di 18 anni devono inviare un Modulo di Responsabilità firmato dal genitore/tutore, con copie dei documenti di identità di entrambi.",
        },
      },
    },
    {
      order: 3,
      question: "O que inclui a inscrição de 15€?",
      answer:
        "A inscrição de 15€ (válida para Maratona e Meia-Maratona) inclui: seguro de acidentes pessoais e responsabilidade civil, lembranças, frontal, pequeno-almoço, abastecimentos líquidos e sólidos no percurso, e acesso a banhos. O almoço não está incluído (10€ extra).",
      translations: {
        pt: {
          question: "O que inclui a inscrição de 15€?",
          answer:
            "A inscrição de 15€ (válida para Maratona e Meia-Maratona) inclui: seguro de acidentes pessoais e responsabilidade civil, lembranças, frontal, pequeno-almoço, abastecimentos líquidos e sólidos no percurso, e acesso a banhos. O almoço não está incluído (10€ extra).",
        },
        en: {
          question: "What does the €15 registration include?",
          answer:
            "The €15 registration (valid for Marathon and Half-Marathon) includes: personal accident and liability insurance, souvenirs, race number, breakfast, liquid and solid refreshments on course, and shower access. Lunch is not included (€10 extra).",
        },
        es: {
          question: "¿Qué incluye la inscripción de 15€?",
          answer:
            "La inscripción de 15€ (válida para Maratón y Media Maratón) incluye: seguro de accidentes y responsabilidad civil, recuerdos, dorsal, desayuno, avituallamientos líquidos y sólidos en el recorrido, y acceso a duchas. El almuerzo no está incluido (10€ extra).",
        },
        fr: {
          question: "Que comprend l'inscription à 15€?",
          answer:
            "L'inscription à 15€ (valable Marathon et Semi-Marathon) comprend: assurance accidents et responsabilité civile, souvenirs, dossard, petit-déjeuner, ravitaillements liquides et solides sur le parcours, et accès aux douches. Le déjeuner n'est pas inclus (10€ supplémentaires).",
        },
        de: {
          question: "Was beinhaltet die 15€ Anmeldung?",
          answer:
            "Die 15€ Anmeldung (gültig für Marathon und Halbmarathon) beinhaltet: Unfall- und Haftpflichtversicherung, Erinnerungsgeschenke, Startnummer, Frühstück, flüssige und feste Verpflegung auf der Strecke und Zugang zu Duschen. Das Mittagessen ist nicht enthalten (10€ extra).",
        },
        it: {
          question: "Cosa include l'iscrizione di 15€?",
          answer:
            "L'iscrizione di 15€ (valida per Maratona e Mezza Maratona) include: assicurazione infortuni e responsabilità civile, ricordi, pettorale, colazione, ristori liquidi e solidi sul percorso e accesso alle docce. Il pranzo non è incluso (10€ extra).",
        },
      },
    },
    {
      order: 4,
      question: "É obrigatório usar capacete e GPS?",
      answer:
        "Sim, o capacete é obrigatório durante todo o percurso, para ambas as distâncias. O GPS (Track fornecido pela organização) é obrigatório na Maratona (70km) após a divisória dos percursos. A Meia-Maratona (40km) está totalmente marcada com placas e fitas.",
      translations: {
        pt: {
          question: "É obrigatório usar capacete e GPS?",
          answer:
            "Sim, o capacete é obrigatório durante todo o percurso, para ambas as distâncias. O GPS (Track fornecido pela organização) é obrigatório na Maratona (70km) após a divisória dos percursos. A Meia-Maratona (40km) está totalmente marcada com placas e fitas.",
        },
        en: {
          question: "Are helmet and GPS mandatory?",
          answer:
            "Yes, the helmet is mandatory throughout the course for both distances. GPS (Track provided by the organization) is mandatory for the Marathon (70km) after the route split. The Half-Marathon (40km) is fully marked with signs and ribbons.",
        },
        es: {
          question: "¿Son obligatorios casco y GPS?",
          answer:
            "Sí, el casco es obligatorio durante todo el recorrido para ambas distancias. El GPS (Track proporcionado por la organización) es obligatorio en la Maratón (70km) después de la separación de recorridos. La Media Maratón (40km) está totalmente señalizada con placas y cintas.",
        },
        fr: {
          question: "Le casque et le GPS sont-ils obligatoires?",
          answer:
            "Oui, le casque est obligatoire pendant tout le parcours pour les deux distances. Le GPS (Track fourni par l'organisation) est obligatoire pour le Marathon (70km) après la séparation des parcours. Le Semi-Marathon (40km) est entièrement balisé avec panneaux et rubans.",
        },
        de: {
          question: "Sind Helm und GPS Pflicht?",
          answer:
            "Ja, der Helm ist auf der gesamten Strecke für beide Distanzen Pflicht. GPS (Track von der Organisation bereitgestellt) ist für den Marathon (70km) nach der Streckenteilung Pflicht. Der Halbmarathon (40km) ist vollständig mit Schildern und Bändern markiert.",
        },
        it: {
          question: "Casco e GPS sono obbligatori?",
          answer:
            "Sì, il casco è obbligatorio per l'intero percorso per entrambe le distanze. Il GPS (Track fornito dall'organizzazione) è obbligatorio per la Maratona (70km) dopo la divisione dei percorsi. La Mezza Maratona (40km) è completamente segnalata con cartelli e nastri.",
        },
      },
    },
    {
      order: 5,
      question: "Posso trocar a minha inscrição com outra pessoa?",
      answer:
        "Sim, são permitidas trocas de inscrição até ao dia 8 de fevereiro, sem custos adicionais, desde que o novo participante mantenha as opções iniciais da inscrição.",
      translations: {
        pt: {
          question: "Posso trocar a minha inscrição com outra pessoa?",
          answer:
            "Sim, são permitidas trocas de inscrição até ao dia 8 de fevereiro, sem custos adicionais, desde que o novo participante mantenha as opções iniciais da inscrição.",
        },
        en: {
          question: "Can I transfer my registration to someone else?",
          answer:
            "Yes, registration transfers are allowed until February 8, at no extra cost, as long as the new participant keeps the original registration options.",
        },
        es: {
          question: "¿Puedo transferir mi inscripción a otra persona?",
          answer:
            "Sí, se permiten transferencias de inscripción hasta el 8 de febrero, sin costes adicionales, siempre que el nuevo participante mantenga las opciones originales de la inscripción.",
        },
        fr: {
          question: "Puis-je transférer mon inscription à quelqu'un d'autre?",
          answer:
            "Oui, les transferts d'inscription sont autorisés jusqu'au 8 février, sans frais supplémentaires, à condition que le nouveau participant conserve les options initiales de l'inscription.",
        },
        de: {
          question: "Kann ich meine Anmeldung an jemand anderen übertragen?",
          answer:
            "Ja, Anmeldeübertragungen sind bis zum 8. Februar ohne zusätzliche Kosten möglich, sofern der neue Teilnehmer die ursprünglichen Anmeldeoptionen beibehält.",
        },
        it: {
          question: "Posso trasferire la mia iscrizione a qualcun altro?",
          answer:
            "Sì, i trasferimenti di iscrizione sono consentiti fino all'8 febbraio, senza costi aggiuntivi, a condizione che il nuovo partecipante mantenga le opzioni originali dell'iscrizione.",
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
🚴 15ª Maratona "Rota do Casqueiro" 2026 seeded successfully!
   📍 Event: 15ª Maratona "Rota do Casqueiro"
   🔗 Slug: ${event.slug}
   📅 Date: 2026-03-01
   📍 Location: Avenida de Santiago, Vila Nova de Santo André, Setúbal
   🚴 Variants: Maratona 70km, Meia-Maratona 40km, Almoço, Acompanhantes
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
