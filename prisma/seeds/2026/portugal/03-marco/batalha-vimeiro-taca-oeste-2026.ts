/**
 * Seed: IV BTT Batalha do Vimeiro - Taça Oeste XCM 2026
 * Complete with translations in all 6 languages, FAQs and SEO
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding IV BTT Batalha do Vimeiro - Taça Oeste XCM 2026...");

  const eventSlug = "batalha-vimeiro-taca-oeste-xcm-2026";

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
      title: "IV BTT Batalha do Vimeiro - Taça Oeste XCM",
      description:
        "4.ª edição da BTT Batalha do Vimeiro, etapa da Taça Oeste XCM BTT 2026. Passeio maratona amateur com Maratona ~60km e Meia-Maratona ~40km em Vimeiro, Lourinhã.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-08T09:00:00.000Z"),
      endDate: null,
      city: "Vimeiro, Lourinhã",
      country: "Portugal",
      latitude: 39.1833,
      longitude: -9.3167,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Vimeiro+Lourinh%C3%A3+Portugal",
      externalUrl: "",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-03-03T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "IV BTT Batalha do Vimeiro - Taça Oeste XCM",
      description:
        "4.ª edição da BTT Batalha do Vimeiro, etapa da Taça Oeste XCM BTT 2026. Passeio maratona amateur com Maratona ~60km e Meia-Maratona ~40km em Vimeiro, Lourinhã.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-08T09:00:00.000Z"),
      endDate: null,
      city: "Vimeiro, Lourinhã",
      country: "Portugal",
      latitude: 39.1833,
      longitude: -9.3167,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Vimeiro+Lourinh%C3%A3+Portugal",
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
      title: "IV BTT Batalha do Vimeiro - Taça Oeste XCM",
      city: "Vimeiro, Lourinhã",
      metaTitle:
        "IV BTT Batalha do Vimeiro - Taça Oeste XCM 2026 | Lourinhã, Lisboa | 8 Março",
      metaDescription:
        "IV BTT Batalha do Vimeiro - Taça Oeste XCM 2026 - 8 de março em Vimeiro, Lourinhã. Maratona ~60km e Meia-Maratona ~40km. Etapa da 4.ª edição da Taça Oeste XCM BTT.",
      description: `# 🚴 IV BTT Batalha do Vimeiro - Taça Oeste XCM 2026

A **IV BTT Batalha do Vimeiro** é uma etapa da **4.ª edição da Taça Oeste XCM BTT 2026** (4 etapas), organizada pela **MR3eventus**. Trata-se de um **passeio maratona amateur** (não competitivo), mas com registo de tempos e classificação. Vem pedalar pelos trilhos incríveis de Vimeiro, Lourinhã!

## 📅 Data e Local

- **Data:** 8 de março de 2026 (Domingo)
- **Hora de Partida:** 09:00
- **Local:** Vimeiro, Lourinhã
- **Distrito:** Lisboa

## 🚴 Percursos Disponíveis

| Percurso | Distância | E-Bikes | Marcação |
|----------|-----------|---------|----------|
| **Maratona** | ~60 km | ✅ Com classificação | Giz e setas vermelhas em branco + GPX |
| **Meia-Maratona** | ~40 km | ✅ Sem classificação | Giz, setas, placas + GPX |

## 🏆 Categorias

**Masculinos:**
- Sub-23 (≤23 anos)
- Elites (24-29 anos)
- Masters 30 (30-39 anos)
- Masters 40 (40-49 anos)
- Masters 50 (50-59 anos)
- Masters 60 (60+ anos, mínimo 5 participantes)

**Femininos Meia-Maratona:**
- Elites (≤39 anos, mínimo 3 participantes)
- Masters (40+ anos, mínimo 3 participantes)

**Femininos Maratona:**
- Geral

**E-Bikes:**
- Maratona: Com classificação
- Meia-Maratona: Sem classificação

## 📋 Programa

- **Véspera (07/03):** 17:00-19:00 Secretariado
- **Dia da Prova (08/03):**
  - 07:30 - Secretariado
  - 08:30 - Abertura das boxes
  - 08:55 - Fecho das boxes
  - 09:00 - Partida
- **Entrega de prémios** após chegada dos participantes

## 🎁 A Inscrição Inclui

- ✅ Seguro de acidentes pessoais
- ✅ Frontal (dorsal) e braçadeiras
- ✅ Brindes/Lembranças
- ✅ Banhos
- ✅ Abastecimentos líquidos e sólidos
- ✅ Abastecimento final
- ✅ Local para lavagem de bicicletas
- ✅ Fotos no Facebook oficial

## 📧 Contacto

- **Organização:** MR3eventus
- **Email:** mr3eventus@gmail.com
- **Telemóvel:** 918 588 922`,
    },
    {
      language: "en",
      title: "IV BTT Battle of Vimeiro - West XCM Cup",
      city: "Vimeiro, Lourinhã",
      metaTitle:
        "IV BTT Battle of Vimeiro - West XCM Cup 2026 | Lourinhã, Lisbon | March 8",
      metaDescription:
        "IV BTT Battle of Vimeiro - West XCM Cup 2026 - March 8 in Vimeiro, Lourinhã. Marathon ~60km and Half-Marathon ~40km. Stage of the 4th edition West XCM BTT Cup.",
      description: `# 🚴 IV BTT Battle of Vimeiro - West XCM Cup 2026

The **IV BTT Battle of Vimeiro** is a stage of the **4th edition West XCM BTT Cup 2026** (4 stages), organized by **MR3eventus**. This is a **non-competitive amateur marathon ride**, but with time recording and classification. Come pedal through the amazing trails of Vimeiro, Lourinhã!

## 📅 Date and Location

- **Date:** March 8, 2026 (Sunday)
- **Start Time:** 09:00
- **Location:** Vimeiro, Lourinhã
- **District:** Lisbon

## 🚴 Available Routes

| Route | Distance | E-Bikes | Marking |
|-------|----------|---------|---------|
| **Marathon** | ~60 km | ✅ With ranking | Chalk and red arrows on white + GPX |
| **Half-Marathon** | ~40 km | ✅ Without ranking | Chalk, arrows, signs + GPX |

## 🏆 Categories

**Males:**
- Sub-23 (≤23 years)
- Elites (24-29 years)
- Masters 30 (30-39 years)
- Masters 40 (40-49 years)
- Masters 50 (50-59 years)
- Masters 60 (60+ years, minimum 5 participants)

**Females Half-Marathon:**
- Elites (≤39 years, minimum 3 participants)
- Masters (40+ years, minimum 3 participants)

**Females Marathon:**
- Overall

**E-Bikes:**
- Marathon: With ranking
- Half-Marathon: Without ranking

## 📋 Schedule

- **Day Before (Mar 7):** 17:00-19:00 Registration
- **Event Day (Mar 8):**
  - 07:30 - Registration
  - 08:30 - Boxes open
  - 08:55 - Boxes close
  - 09:00 - Start
- **Prize ceremony** after participants finish

## 🎁 Registration Includes

- ✅ Personal accident insurance
- ✅ Race number and armbands
- ✅ Gifts/Souvenirs
- ✅ Showers
- ✅ Liquid and solid refreshments
- ✅ Final refreshment
- ✅ Bike washing area
- ✅ Photos on official Facebook

## 📧 Contact

- **Organization:** MR3eventus
- **Email:** mr3eventus@gmail.com
- **Phone:** 918 588 922`,
    },
    {
      language: "es",
      title: "IV BTT Batalla del Vimeiro - Copa Oeste XCM",
      city: "Vimeiro, Lourinhã",
      metaTitle:
        "IV BTT Batalla del Vimeiro - Copa Oeste XCM 2026 | Lourinhã, Lisboa | 8 Marzo",
      metaDescription:
        "IV BTT Batalla del Vimeiro - Copa Oeste XCM 2026 - 8 de marzo en Vimeiro, Lourinhã. Maratón ~60km y Media Maratón ~40km. Etapa de la 4.ª edición Copa Oeste XCM BTT.",
      description: `# 🚴 IV BTT Batalla del Vimeiro - Copa Oeste XCM 2026

La **IV BTT Batalla del Vimeiro** es una etapa de la **4.ª edición de la Copa Oeste XCM BTT 2026** (4 etapas), organizada por **MR3eventus**. Se trata de un **paseo maratón amateur** (no competitivo), pero con registro de tiempos y clasificación. ¡Ven a pedalear por los increíbles senderos de Vimeiro, Lourinhã!

## 📅 Fecha y Lugar

- **Fecha:** 8 de marzo de 2026 (Domingo)
- **Hora de Salida:** 09:00
- **Lugar:** Vimeiro, Lourinhã
- **Distrito:** Lisboa

## 🚴 Recorridos Disponibles

| Recorrido | Distancia | E-Bikes | Señalización |
|-----------|-----------|---------|--------------|
| **Maratón** | ~60 km | ✅ Con clasificación | Tiza y flechas rojas en blanco + GPX |
| **Media Maratón** | ~40 km | ✅ Sin clasificación | Tiza, flechas, señales + GPX |

## 🏆 Categorías

**Masculinos:**
- Sub-23 (≤23 años)
- Elites (24-29 años)
- Masters 30 (30-39 años)
- Masters 40 (40-49 años)
- Masters 50 (50-59 años)
- Masters 60 (60+ años, mínimo 5 participantes)

**Femeninos Media Maratón:**
- Elites (≤39 años, mínimo 3 participantes)
- Masters (40+ años, mínimo 3 participantes)

**Femeninos Maratón:**
- General

**E-Bikes:**
- Maratón: Con clasificación
- Media Maratón: Sin clasificación

## 📋 Programa

- **Víspera (07/03):** 17:00-19:00 Secretaría
- **Día del Evento (08/03):**
  - 07:30 - Secretaría
  - 08:30 - Apertura de boxes
  - 08:55 - Cierre de boxes
  - 09:00 - Salida
- **Entrega de premios** tras la llegada de los participantes

## 🎁 La Inscripción Incluye

- ✅ Seguro de accidentes personales
- ✅ Dorsal y brazaletes
- ✅ Regalos/Recuerdos
- ✅ Duchas
- ✅ Avituallamientos líquidos y sólidos
- ✅ Avituallamiento final
- ✅ Zona de lavado de bicicletas
- ✅ Fotos en Facebook oficial

## 📧 Contacto

- **Organización:** MR3eventus
- **Email:** mr3eventus@gmail.com
- **Teléfono:** 918 588 922`,
    },
    {
      language: "fr",
      title: "IV BTT Bataille de Vimeiro - Coupe Ouest XCM",
      city: "Vimeiro, Lourinhã",
      metaTitle:
        "IV BTT Bataille de Vimeiro - Coupe Ouest XCM 2026 | Lourinhã, Lisbonne | 8 Mars",
      metaDescription:
        "IV BTT Bataille de Vimeiro - Coupe Ouest XCM 2026 - 8 mars à Vimeiro, Lourinhã. Marathon ~60km et Semi-Marathon ~40km. Étape de la 4e édition Coupe Ouest XCM BTT.",
      description: `# 🚴 IV BTT Bataille de Vimeiro - Coupe Ouest XCM 2026

La **IV BTT Bataille de Vimeiro** est une étape de la **4e édition de la Coupe Ouest XCM BTT 2026** (4 étapes), organisée par **MR3eventus**. Il s'agit d'une **randonnée marathon amateur** (non compétitive), mais avec enregistrement des temps et classement. Venez pédaler sur les sentiers incroyables de Vimeiro, Lourinhã !

## 📅 Date et Lieu

- **Date:** 8 mars 2026 (Dimanche)
- **Heure de Départ:** 09:00
- **Lieu:** Vimeiro, Lourinhã
- **District:** Lisbonne

## 🚴 Parcours Disponibles

| Parcours | Distance | E-Bikes | Balisage |
|----------|----------|---------|----------|
| **Marathon** | ~60 km | ✅ Avec classement | Craie et flèches rouges sur blanc + GPX |
| **Semi-Marathon** | ~40 km | ✅ Sans classement | Craie, flèches, panneaux + GPX |

## 🏆 Catégories

**Hommes :**
- Sub-23 (≤23 ans)
- Élites (24-29 ans)
- Masters 30 (30-39 ans)
- Masters 40 (40-49 ans)
- Masters 50 (50-59 ans)
- Masters 60 (60+ ans, minimum 5 participants)

**Femmes Semi-Marathon :**
- Élites (≤39 ans, minimum 3 participantes)
- Masters (40+ ans, minimum 3 participantes)

**Femmes Marathon :**
- Général

**E-Bikes :**
- Marathon : Avec classement
- Semi-Marathon : Sans classement

## 📋 Programme

- **Veille (07/03) :** 17:00-19:00 Secrétariat
- **Jour de l'Événement (08/03) :**
  - 07:30 - Secrétariat
  - 08:30 - Ouverture des boxes
  - 08:55 - Fermeture des boxes
  - 09:00 - Départ
- **Remise des prix** après l'arrivée des participants

## 🎁 L'Inscription Comprend

- ✅ Assurance accidents personnels
- ✅ Dossard et bracelets
- ✅ Cadeaux/Souvenirs
- ✅ Douches
- ✅ Ravitaillements liquides et solides
- ✅ Ravitaillement final
- ✅ Zone de lavage de vélos
- ✅ Photos sur Facebook officiel

## 📧 Contact

- **Organisation :** MR3eventus
- **Email :** mr3eventus@gmail.com
- **Téléphone :** 918 588 922`,
    },
    {
      language: "de",
      title: "IV BTT Schlacht von Vimeiro - West XCM Pokal",
      city: "Vimeiro, Lourinhã",
      metaTitle:
        "IV BTT Schlacht von Vimeiro - West XCM Pokal 2026 | Lourinhã, Lissabon | 8. März",
      metaDescription:
        "IV BTT Schlacht von Vimeiro - West XCM Pokal 2026 - 8. März in Vimeiro, Lourinhã. Marathon ~60km und Halbmarathon ~40km. Etappe der 4. Ausgabe West XCM BTT Pokal.",
      description: `# 🚴 IV BTT Schlacht von Vimeiro - West XCM Pokal 2026

Die **IV BTT Schlacht von Vimeiro** ist eine Etappe des **4. West XCM BTT Pokals 2026** (4 Etappen), organisiert von **MR3eventus**. Es handelt sich um eine **nicht-kompetitive Amateur-Marathon-Fahrt**, aber mit Zeiterfassung und Wertung. Komm und fahre durch die unglaublichen Trails von Vimeiro, Lourinhã!

## 📅 Datum und Ort

- **Datum:** 8. März 2026 (Sonntag)
- **Startzeit:** 09:00 Uhr
- **Ort:** Vimeiro, Lourinhã
- **Bezirk:** Lissabon

## 🚴 Verfügbare Strecken

| Strecke | Distanz | E-Bikes | Markierung |
|---------|---------|---------|------------|
| **Marathon** | ~60 km | ✅ Mit Wertung | Kreide und rote Pfeile auf Weiß + GPX |
| **Halbmarathon** | ~40 km | ✅ Ohne Wertung | Kreide, Pfeile, Schilder + GPX |

## 🏆 Kategorien

**Männer:**
- Sub-23 (≤23 Jahre)
- Elites (24-29 Jahre)
- Masters 30 (30-39 Jahre)
- Masters 40 (40-49 Jahre)
- Masters 50 (50-59 Jahre)
- Masters 60 (60+ Jahre, mindestens 5 Teilnehmer)

**Frauen Halbmarathon:**
- Elites (≤39 Jahre, mindestens 3 Teilnehmerinnen)
- Masters (40+ Jahre, mindestens 3 Teilnehmerinnen)

**Frauen Marathon:**
- Gesamt

**E-Bikes:**
- Marathon: Mit Wertung
- Halbmarathon: Ohne Wertung

## 📋 Programm

- **Vortag (07.03):** 17:00-19:00 Sekretariat
- **Veranstaltungstag (08.03):**
  - 07:30 - Sekretariat
  - 08:30 - Boxen öffnen
  - 08:55 - Boxen schließen
  - 09:00 - Start
- **Preisverleihung** nach Ankunft der Teilnehmer

## 🎁 Die Anmeldung Beinhaltet

- ✅ Persönliche Unfallversicherung
- ✅ Startnummer und Armbänder
- ✅ Geschenke/Andenken
- ✅ Duschen
- ✅ Flüssige und feste Verpflegung
- ✅ Endverpflegung
- ✅ Fahrradwaschbereich
- ✅ Fotos auf offiziellem Facebook

## 📧 Kontakt

- **Organisation:** MR3eventus
- **Email:** mr3eventus@gmail.com
- **Telefon:** 918 588 922`,
    },
    {
      language: "it",
      title: "IV BTT Battaglia di Vimeiro - Coppa Ovest XCM",
      city: "Vimeiro, Lourinhã",
      metaTitle:
        "IV BTT Battaglia di Vimeiro - Coppa Ovest XCM 2026 | Lourinhã, Lisbona | 8 Marzo",
      metaDescription:
        "IV BTT Battaglia di Vimeiro - Coppa Ovest XCM 2026 - 8 marzo a Vimeiro, Lourinhã. Maratona ~60km e Mezza Maratona ~40km. Tappa della 4ª edizione Coppa Ovest XCM BTT.",
      description: `# 🚴 IV BTT Battaglia di Vimeiro - Coppa Ovest XCM 2026

La **IV BTT Battaglia di Vimeiro** è una tappa della **4ª edizione della Coppa Ovest XCM BTT 2026** (4 tappe), organizzata da **MR3eventus**. Si tratta di un **giro maratona amatoriale** (non competitivo), ma con registrazione dei tempi e classifica. Vieni a pedalare sui sentieri incredibili di Vimeiro, Lourinhã!

## 📅 Data e Luogo

- **Data:** 8 marzo 2026 (Domenica)
- **Orario di Partenza:** 09:00
- **Luogo:** Vimeiro, Lourinhã
- **Distretto:** Lisbona

## 🚴 Percorsi Disponibili

| Percorso | Distanza | E-Bikes | Segnalazione |
|----------|----------|---------|--------------|
| **Maratona** | ~60 km | ✅ Con classifica | Gesso e frecce rosse su bianco + GPX |
| **Mezza Maratona** | ~40 km | ✅ Senza classifica | Gesso, frecce, cartelli + GPX |

## 🏆 Categorie

**Maschili:**
- Sub-23 (≤23 anni)
- Élites (24-29 anni)
- Masters 30 (30-39 anni)
- Masters 40 (40-49 anni)
- Masters 50 (50-59 anni)
- Masters 60 (60+ anni, minimo 5 partecipanti)

**Femminili Mezza Maratona:**
- Élites (≤39 anni, minimo 3 partecipanti)
- Masters (40+ anni, minimo 3 partecipanti)

**Femminili Maratona:**
- Generale

**E-Bikes:**
- Maratona: Con classifica
- Mezza Maratona: Senza classifica

## 📋 Programma

- **Vigilia (07/03):** 17:00-19:00 Segreteria
- **Giorno dell'Evento (08/03):**
  - 07:30 - Segreteria
  - 08:30 - Apertura box
  - 08:55 - Chiusura box
  - 09:00 - Partenza
- **Premiazione** dopo l'arrivo dei partecipanti

## 🎁 L'Iscrizione Include

- ✅ Assicurazione infortuni personali
- ✅ Pettorale e braccialetti
- ✅ Regali/Ricordi
- ✅ Docce
- ✅ Ristori liquidi e solidi
- ✅ Ristoro finale
- ✅ Area lavaggio biciclette
- ✅ Foto su Facebook ufficiale

## 📧 Contatto

- **Organizzazione:** MR3eventus
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

  // Variant 1: Maratona ~60km
  const maratona = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Maratona ~60km",
      distanceKm: 60,
      startTime: "09:00",
      price: 18.0,
      currency: "EUR",
    },
  });

  const maratonaTranslations = [
    {
      language: "pt" as const,
      name: "Maratona ~60km",
      description:
        "Percurso de ~60km marcado com giz e setas vermelhas em branco + tracks GPX. E-Bikes permitidas com classificação. Passeio maratona amateur com registo de tempos. Idade mínima: 18 anos.",
    },
    {
      language: "en" as const,
      name: "Marathon ~60km",
      description:
        "~60km route marked with chalk and red arrows on white + GPX tracks. E-Bikes allowed with ranking. Amateur marathon ride with time recording. Minimum age: 18 years.",
    },
    {
      language: "es" as const,
      name: "Maratón ~60km",
      description:
        "Recorrido de ~60km señalizado con tiza y flechas rojas en blanco + tracks GPX. E-Bikes permitidas con clasificación. Paseo maratón amateur con registro de tiempos. Edad mínima: 18 años.",
    },
    {
      language: "fr" as const,
      name: "Marathon ~60km",
      description:
        "Parcours de ~60km balisé à la craie et flèches rouges sur blanc + traces GPX. E-Bikes autorisés avec classement. Randonnée marathon amateur avec enregistrement des temps. Âge minimum : 18 ans.",
    },
    {
      language: "de" as const,
      name: "Marathon ~60km",
      description:
        "~60km Strecke markiert mit Kreide und roten Pfeilen auf Weiß + GPX-Tracks. E-Bikes erlaubt mit Wertung. Amateur-Marathon-Fahrt mit Zeiterfassung. Mindestalter: 18 Jahre.",
    },
    {
      language: "it" as const,
      name: "Maratona ~60km",
      description:
        "Percorso di ~60km segnalato con gesso e frecce rosse su bianco + tracce GPX. E-Bikes consentite con classifica. Giro maratona amatoriale con registrazione dei tempi. Età minima: 18 anni.",
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

  console.log("   ✅ Maratona ~60km created");

  // Variant 2: Meia-Maratona ~40km
  const meiaMaratona = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Meia-Maratona ~40km",
      distanceKm: 40,
      startTime: "09:00",
      price: 18.0,
      currency: "EUR",
    },
  });

  const meiaMaratonaTranslations = [
    {
      language: "pt" as const,
      name: "Meia-Maratona ~40km",
      description:
        "Percurso de ~40km marcado com giz, setas, placas + tracks GPX. E-Bikes permitidas sem classificação. Passeio maratona amateur com registo de tempos. Idade mínima: 18 anos.",
    },
    {
      language: "en" as const,
      name: "Half-Marathon ~40km",
      description:
        "~40km route marked with chalk, arrows, signs + GPX tracks. E-Bikes allowed without ranking. Amateur marathon ride with time recording. Minimum age: 18 years.",
    },
    {
      language: "es" as const,
      name: "Media Maratón ~40km",
      description:
        "Recorrido de ~40km señalizado con tiza, flechas, señales + tracks GPX. E-Bikes permitidas sin clasificación. Paseo maratón amateur con registro de tiempos. Edad mínima: 18 años.",
    },
    {
      language: "fr" as const,
      name: "Semi-Marathon ~40km",
      description:
        "Parcours de ~40km balisé à la craie, flèches, panneaux + traces GPX. E-Bikes autorisés sans classement. Randonnée marathon amateur avec enregistrement des temps. Âge minimum : 18 ans.",
    },
    {
      language: "de" as const,
      name: "Halbmarathon ~40km",
      description:
        "~40km Strecke markiert mit Kreide, Pfeilen, Schildern + GPX-Tracks. E-Bikes erlaubt ohne Wertung. Amateur-Marathon-Fahrt mit Zeiterfassung. Mindestalter: 18 Jahre.",
    },
    {
      language: "it" as const,
      name: "Mezza Maratona ~40km",
      description:
        "Percorso di ~40km segnalato con gesso, frecce, cartelli + tracce GPX. E-Bikes consentite senza classifica. Giro maratona amatoriale con registrazione dei tempi. Età minima: 18 anni.",
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

  console.log("   ✅ Meia-Maratona ~40km created");

  // Variant 3: Almoço
  const almoco = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Almoço",
      price: 15.0,
      currency: "EUR",
    },
  });

  const almocoTranslations = [
    {
      language: "pt" as const,
      name: "Almoço",
      description: "Almoço para atletas e participantes.",
    },
    {
      language: "en" as const,
      name: "Lunch",
      description: "Lunch for athletes and participants.",
    },
    {
      language: "es" as const,
      name: "Almuerzo",
      description: "Almuerzo para atletas y participantes.",
    },
    {
      language: "fr" as const,
      name: "Déjeuner",
      description: "Déjeuner pour athlètes et participants.",
    },
    {
      language: "de" as const,
      name: "Mittagessen",
      description: "Mittagessen für Athleten und Teilnehmer.",
    },
    {
      language: "it" as const,
      name: "Pranzo",
      description: "Pranzo per atleti e partecipanti.",
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

  console.log("   ✅ Almoço created");

  // Variant 4: Acompanhantes
  const acompanhantes = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Acompanhantes",
      price: 15.0,
      currency: "EUR",
    },
  });

  const acompanhantesTranslations = [
    {
      language: "pt" as const,
      name: "Acompanhantes",
      description: "Inscrição para acompanhantes.",
    },
    {
      language: "en" as const,
      name: "Companions",
      description: "Companion registration.",
    },
    {
      language: "es" as const,
      name: "Acompañantes",
      description: "Inscripción para acompañantes.",
    },
    {
      language: "fr" as const,
      name: "Accompagnants",
      description: "Inscription pour accompagnants.",
    },
    {
      language: "de" as const,
      name: "Begleitpersonen",
      description: "Anmeldung für Begleitpersonen.",
    },
    {
      language: "it" as const,
      name: "Accompagnatori",
      description: "Iscrizione per accompagnatori.",
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
      name: "1.ª Fase",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-02-15T23:59:59.000Z"),
      price: 15.0,
      currency: "EUR" as const,
      note: "Preço early bird",
    },
    {
      name: "2.ª Fase",
      startDate: new Date("2026-02-16T00:00:00.000Z"),
      endDate: new Date("2026-03-03T23:59:59.000Z"),
      price: 18.0,
      currency: "EUR" as const,
      note: "Preço normal",
    },
    {
      name: "Fora de Prazo",
      startDate: new Date("2026-03-04T00:00:00.000Z"),
      endDate: new Date("2026-03-06T13:00:00.000Z"),
      price: 20.0,
      currency: "EUR" as const,
      note: "Inscrições fora de prazo (sem garantia de seguro)",
    },
    {
      name: "Almoço",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-03-03T23:59:59.000Z"),
      price: 15.0,
      currency: "EUR" as const,
      note: "Almoço para atletas e acompanhantes",
    },
    {
      name: "Acompanhantes",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-03-03T23:59:59.000Z"),
      price: 15.0,
      currency: "EUR" as const,
      note: "Inscrição para acompanhantes",
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
        "Sim, E-Bikes são permitidas em ambos os percursos. Na Maratona (~60km) tens classificação, na Meia-Maratona (~40km) participas sem classificação. Não é permitida a troca de baterias ou uso de baterias auxiliares.",
      translations: {
        pt: {
          question: "Posso participar com E-Bike?",
          answer:
            "Sim, E-Bikes são permitidas em ambos os percursos. Na Maratona (~60km) tens classificação, na Meia-Maratona (~40km) participas sem classificação. Não é permitida a troca de baterias ou uso de baterias auxiliares.",
        },
        en: {
          question: "Can I participate with an E-Bike?",
          answer:
            "Yes, E-Bikes are allowed on both routes. In the Marathon (~60km) you have ranking, in the Half-Marathon (~40km) you participate without ranking. Battery swapping or auxiliary batteries are not allowed.",
        },
        es: {
          question: "¿Puedo participar con E-Bike?",
          answer:
            "Sí, las E-Bikes están permitidas en ambos recorridos. En la Maratón (~60km) tienes clasificación, en la Media Maratón (~40km) participas sin clasificación. No se permite el cambio de baterías ni el uso de baterías auxiliares.",
        },
        fr: {
          question: "Puis-je participer avec un E-Bike?",
          answer:
            "Oui, les E-Bikes sont autorisés sur les deux parcours. Au Marathon (~60km) vous avez un classement, au Semi-Marathon (~40km) vous participez sans classement. Le changement de batteries ou les batteries auxiliaires ne sont pas autorisés.",
        },
        de: {
          question: "Kann ich mit einem E-Bike teilnehmen?",
          answer:
            "Ja, E-Bikes sind auf beiden Strecken erlaubt. Beim Marathon (~60km) hast du eine Wertung, beim Halbmarathon (~40km) nimmst du ohne Wertung teil. Batteriewechsel oder Zusatzbatterien sind nicht erlaubt.",
        },
        it: {
          question: "Posso partecipare con una E-Bike?",
          answer:
            "Sì, le E-Bikes sono consentite su entrambi i percorsi. Nella Maratona (~60km) hai la classifica, nella Mezza Maratona (~40km) partecipi senza classifica. Non è consentito lo scambio di batterie o l'uso di batterie ausiliarie.",
        },
      },
    },
    {
      order: 2,
      question: "Qual é a idade mínima para participar?",
      answer:
        "A idade mínima é 18 anos. Participantes menores de 18 anos podem participar mediante autorização escrita dos pais/encarregados de educação, enviada até 5 dias antes do evento para o email da organização.",
      translations: {
        pt: {
          question: "Qual é a idade mínima para participar?",
          answer:
            "A idade mínima é 18 anos. Participantes menores de 18 anos podem participar mediante autorização escrita dos pais/encarregados de educação, enviada até 5 dias antes do evento para o email da organização.",
        },
        en: {
          question: "What is the minimum age to participate?",
          answer:
            "The minimum age is 18 years. Participants under 18 can participate with written parental authorization, sent up to 5 days before the event to the organization's email.",
        },
        es: {
          question: "¿Cuál es la edad mínima para participar?",
          answer:
            "La edad mínima es 18 años. Los participantes menores de 18 años pueden participar con autorización escrita de los padres/tutores, enviada hasta 5 días antes del evento al email de la organización.",
        },
        fr: {
          question: "Quel est l'âge minimum pour participer?",
          answer:
            "L'âge minimum est de 18 ans. Les participants de moins de 18 ans peuvent participer avec une autorisation écrite des parents/tuteurs, envoyée jusqu'à 5 jours avant l'événement à l'email de l'organisation.",
        },
        de: {
          question: "Was ist das Mindestalter für die Teilnahme?",
          answer:
            "Das Mindestalter beträgt 18 Jahre. Teilnehmer unter 18 Jahren können mit schriftlicher Genehmigung der Eltern/Erziehungsberechtigten teilnehmen, die bis zu 5 Tage vor der Veranstaltung per E-Mail an die Organisation gesendet werden muss.",
        },
        it: {
          question: "Qual è l'età minima per partecipare?",
          answer:
            "L'età minima è 18 anni. I partecipanti under 18 possono partecipare con autorizzazione scritta dei genitori/tutori, inviata fino a 5 giorni prima dell'evento all'email dell'organizzazione.",
        },
      },
    },
    {
      order: 3,
      question: "Quais são os horários do secretariado e da partida?",
      answer:
        "Véspera (07/03): Secretariado das 17:00 às 19:00. Dia da prova (08/03): Secretariado às 07:30, abertura das boxes às 08:30, fecho das boxes às 08:55, partida às 09:00.",
      translations: {
        pt: {
          question: "Quais são os horários do secretariado e da partida?",
          answer:
            "Véspera (07/03): Secretariado das 17:00 às 19:00. Dia da prova (08/03): Secretariado às 07:30, abertura das boxes às 08:30, fecho das boxes às 08:55, partida às 09:00.",
        },
        en: {
          question: "What are the registration and start times?",
          answer:
            "Day before (Mar 7): Registration from 17:00 to 19:00. Event day (Mar 8): Registration at 07:30, boxes open at 08:30, boxes close at 08:55, start at 09:00.",
        },
        es: {
          question: "¿Cuáles son los horarios de secretaría y salida?",
          answer:
            "Víspera (07/03): Secretaría de 17:00 a 19:00. Día del evento (08/03): Secretaría a las 07:30, apertura de boxes a las 08:30, cierre de boxes a las 08:55, salida a las 09:00.",
        },
        fr: {
          question: "Quels sont les horaires du secrétariat et du départ?",
          answer:
            "Veille (07/03) : Secrétariat de 17:00 à 19:00. Jour de l'événement (08/03) : Secrétariat à 07:30, ouverture des boxes à 08:30, fermeture des boxes à 08:55, départ à 09:00.",
        },
        de: {
          question: "Wann ist das Sekretariat und der Start?",
          answer:
            "Vortag (07.03): Sekretariat von 17:00 bis 19:00 Uhr. Veranstaltungstag (08.03): Sekretariat um 07:30, Boxen öffnen um 08:30, Boxen schließen um 08:55, Start um 09:00 Uhr.",
        },
        it: {
          question: "Quali sono gli orari della segreteria e della partenza?",
          answer:
            "Vigilia (07/03): Segreteria dalle 17:00 alle 19:00. Giorno dell'evento (08/03): Segreteria alle 07:30, apertura box alle 08:30, chiusura box alle 08:55, partenza alle 09:00.",
        },
      },
    },
    {
      order: 4,
      question: "É obrigatório usar capacete?",
      answer:
        "Sim, é obrigatório usar capacete homologado para ciclismo, corretamente colocado durante toda a prova. Participantes sem capacete ou com capacete mal colocado não poderão participar.",
      translations: {
        pt: {
          question: "É obrigatório usar capacete?",
          answer:
            "Sim, é obrigatório usar capacete homologado para ciclismo, corretamente colocado durante toda a prova. Participantes sem capacete ou com capacete mal colocado não poderão participar.",
        },
        en: {
          question: "Is wearing a helmet mandatory?",
          answer:
            "Yes, wearing a cycling-approved helmet is mandatory, correctly placed throughout the race. Participants without a helmet or with an improperly placed helmet will not be allowed to participate.",
        },
        es: {
          question: "¿Es obligatorio usar casco?",
          answer:
            "Sí, es obligatorio usar casco homologado para ciclismo, correctamente colocado durante toda la prueba. Los participantes sin casco o con casco mal colocado no podrán participar.",
        },
        fr: {
          question: "Le port du casque est-il obligatoire?",
          answer:
            "Oui, le port d'un casque homologué pour le cyclisme est obligatoire, correctement placé pendant toute la course. Les participants sans casque ou avec un casque mal placé ne pourront pas participer.",
        },
        de: {
          question: "Ist das Tragen eines Helms Pflicht?",
          answer:
            "Ja, das Tragen eines für Radfahren zugelassenen Helms ist Pflicht, korrekt platziert während des gesamten Rennens. Teilnehmer ohne Helm oder mit falsch platziertem Helm dürfen nicht teilnehmen.",
        },
        it: {
          question: "È obbligatorio indossare il casco?",
          answer:
            "Sì, è obbligatorio indossare un casco omologato per il ciclismo, correttamente posizionato durante tutta la gara. I partecipanti senza casco o con casco mal posizionato non potranno partecipare.",
        },
      },
    },
    {
      order: 5,
      question: "Como funciona o sistema de pontos da Taça Oeste?",
      answer:
        "A Taça Oeste XCM BTT 2026 é composta por 4 etapas. Cada participante recebe 50 pontos por terminar a prova, mais pontos adicionais conforme a sua posição na classificação. A classificação final da Taça é apurada pela soma dos pontos das etapas.",
      translations: {
        pt: {
          question: "Como funciona o sistema de pontos da Taça Oeste?",
          answer:
            "A Taça Oeste XCM BTT 2026 é composta por 4 etapas. Cada participante recebe 50 pontos por terminar a prova, mais pontos adicionais conforme a sua posição na classificação. A classificação final da Taça é apurada pela soma dos pontos das etapas.",
        },
        en: {
          question: "How does the West Cup points system work?",
          answer:
            "The West XCM BTT Cup 2026 consists of 4 stages. Each participant receives 50 points for finishing the race, plus additional points based on their classification position. The final Cup ranking is determined by the sum of points across all stages.",
        },
        es: {
          question: "¿Cómo funciona el sistema de puntos de la Copa Oeste?",
          answer:
            "La Copa Oeste XCM BTT 2026 consta de 4 etapas. Cada participante recibe 50 puntos por terminar la carrera, más puntos adicionales según su posición en la clasificación. La clasificación final de la Copa se determina por la suma de puntos de todas las etapas.",
        },
        fr: {
          question:
            "Comment fonctionne le système de points de la Coupe Ouest?",
          answer:
            "La Coupe Ouest XCM BTT 2026 est composée de 4 étapes. Chaque participant reçoit 50 points pour avoir terminé la course, plus des points supplémentaires selon sa position au classement. Le classement final de la Coupe est déterminé par la somme des points de toutes les étapes.",
        },
        de: {
          question: "Wie funktioniert das Punktesystem des West Pokals?",
          answer:
            "Der West XCM BTT Pokal 2026 besteht aus 4 Etappen. Jeder Teilnehmer erhält 50 Punkte für das Beenden des Rennens, plus zusätzliche Punkte basierend auf seiner Platzierung. Die Endwertung des Pokals wird durch die Summe der Punkte aller Etappen bestimmt.",
        },
        it: {
          question: "Come funziona il sistema di punti della Coppa Ovest?",
          answer:
            "La Coppa Ovest XCM BTT 2026 è composta da 4 tappe. Ogni partecipante riceve 50 punti per aver terminato la gara, più punti aggiuntivi in base alla posizione in classifica. La classifica finale della Coppa è determinata dalla somma dei punti di tutte le tappe.",
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
🎉 IV BTT Batalha do Vimeiro - Taça Oeste XCM 2026 seeded successfully!
   📍 Event: IV BTT Batalha do Vimeiro - Taça Oeste XCM
   🔗 Slug: ${event.slug}
   📅 Date: 2026-03-08
   📍 Location: Vimeiro, Lourinhã, Lisboa, Portugal
   🚴 Variants: Maratona ~60km, Meia-Maratona ~40km, Almoço, Acompanhantes
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
