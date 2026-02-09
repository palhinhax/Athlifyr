/**
 * Seed: 17.ª Maratona BTT LAZER ARCC 2026
 * Complete with translations in all 6 languages, FAQs and SEO
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding 17.ª Maratona BTT LAZER ARCC 2026...");

  const eventSlug = "maratona-btt-lazer-arcc-2026";

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
      title: "17.ª Maratona BTT LAZER ARCC",
      description:
        "Manifestação desportiva sem caráter competitivo organizada pela Secção de BTT LAZER da ARCC. Percursos de 45km e 25km pelos caminhos rurais e trilhos BTT do concelho de Oliveira do Hospital. Limite de 400 participantes.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-08T09:00:00.000Z"),
      endDate: null,
      city: "Oliveira do Hospital",
      country: "Portugal",
      latitude: 40.36,
      longitude: -7.86,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Oliveira+do+Hospital+Coimbra+Portugal",
      externalUrl: "",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-03-02T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "17.ª Maratona BTT LAZER ARCC",
      description:
        "Manifestação desportiva sem caráter competitivo organizada pela Secção de BTT LAZER da ARCC. Percursos de 45km e 25km pelos caminhos rurais e trilhos BTT do concelho de Oliveira do Hospital. Limite de 400 participantes.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-08T09:00:00.000Z"),
      endDate: null,
      city: "Oliveira do Hospital",
      country: "Portugal",
      latitude: 40.36,
      longitude: -7.86,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Oliveira+do+Hospital+Coimbra+Portugal",
      externalUrl: "",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-03-02T23:59:59.000Z"),
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
      title: "17.ª Maratona BTT LAZER ARCC",
      city: "Oliveira do Hospital",
      metaTitle:
        "17.ª Maratona BTT LAZER ARCC 2026 | Oliveira do Hospital, Coimbra | 8 Março",
      metaDescription:
        "17.ª Maratona BTT LAZER ARCC 2026 - 8 de março em Oliveira do Hospital. Maratona 45km e Meia-Maratona 25km. Manifestação desportiva sem caráter competitivo. Limite 400 participantes.",
      description: `# 🚴 17.ª Maratona BTT LAZER ARCC 2026

A **17.ª Maratona BTT LAZER ARCC** é organizada pela **Secção de BTT LAZER da ARCC** (Associação Recreativa e Cultural de Coja). Uma manifestação desportiva **sem caráter competitivo**, mas com registo estatístico de tempos. Vem pedalar pelos caminhos rurais e trilhos BTT do concelho de Oliveira do Hospital!

## 📅 Data e Local

- **Data:** 8 de março de 2026 (Domingo)
- **Partida:** 09:00
- **Local:** Oliveira do Hospital
- **Distrito:** Coimbra
- **Limite:** 400 participantes

## 🚴 Percursos Disponíveis

| Percurso | Distância | Partida |
|----------|-----------|---------|
| **Maratona** | 45 km | 09:00 |
| **Meia-Maratona** | 25 km | 09:00 |

## 🏆 Escalões

- **Masculino** — todas as idades
- **Feminino** — todas as idades
- **E-Bikes** — categoria única, apenas 45km, maiores de 18 anos, classificação separada

## 📋 Sinalização e Segurança

- ✅ Percurso marcado com fitas e placas
- ✅ Postos de controlo ao longo do percurso
- ✅ Aberto a todos (menores necessitam autorização parental)

## 🎁 A Inscrição Inclui (Modalidade D — base)

- ✅ Participação no percurso de 25km ou 45km
- ✅ Seguro de acidentes pessoais **SEM FRANQUIA**
- ✅ Abastecimentos sólidos e líquidos
- ✅ Banhos e zona de lavagem de bicicletas
- ✅ Lembranças

## 🏷️ Modalidades de Inscrição

| Modalidade | Período | Preço | Inclui |
|------------|---------|-------|--------|
| **A (Jersey + Almoço)** | 1-31 Jan | 25€ | Jersey, almoço, seguro s/ franquia, lembranças, abastecimentos |
| **B (Jersey, s/ Almoço)** | 1-31 Jan | 20€ | Jersey, seguro s/ franquia, lembranças, abastecimentos |
| **C (Almoço, s/ Jersey)** | 1-28 Fev | 20€ | Almoço, seguro s/ franquia, lembranças, abastecimentos |
| **D (s/ Almoço, s/ Jersey)** | 1 Fev - 2 Mar | 15€ | Seguro s/ franquia, lembranças, abastecimentos |
| **Inscrição no dia** | 8 Mar | 20€ | Sem garantia de lembrança |

## ⚡ E-Bikes — Regras

- Categoria única, apenas percurso de 45km, maiores de 18 anos
- Motores máx. 250W, assistência apenas ao pedalar, corte aos 25 km/h
- Marcas autorizadas: Bosch, Shimano, Panasonic, Brose, Yamaha
- Classificação separada, troféu para o 1.º classificado
- Sem carregamento de baterias pela organização

## 📧 Contactos

- **Organização:** Secção de BTT LAZER da ARCC
- **Telemóvel:** 962 588 979`,
    },
    {
      language: "en",
      title: "17th BTT LAZER ARCC Marathon",
      city: "Oliveira do Hospital",
      metaTitle:
        "17th BTT LAZER ARCC Marathon 2026 | Oliveira do Hospital, Coimbra | March 8",
      metaDescription:
        "17th BTT LAZER ARCC Marathon 2026 - March 8 in Oliveira do Hospital. Marathon 45km and Half-Marathon 25km. Non-competitive sports event. Limit 400 participants.",
      description: `# 🚴 17th BTT LAZER ARCC Marathon 2026

The **17th BTT LAZER ARCC Marathon** is organized by the **BTT LAZER Section of ARCC** (Associação Recreativa e Cultural de Coja). A **non-competitive sports event** with statistical time recording. Come pedal through the rural paths and MTB trails of Oliveira do Hospital municipality!

## 📅 Date and Location

- **Date:** March 8, 2026 (Sunday)
- **Start:** 09:00
- **Location:** Oliveira do Hospital
- **District:** Coimbra
- **Limit:** 400 participants

## 🚴 Available Routes

| Route | Distance | Start |
|-------|----------|-------|
| **Marathon** | 45 km | 09:00 |
| **Half-Marathon** | 25 km | 09:00 |

## 🏆 Categories

- **Male** — all ages
- **Female** — all ages
- **E-Bikes** — single category, 45km only, 18+, separate classification

## 📋 Signage and Safety

- ✅ Route marked with ribbons and signs
- ✅ Control points along the course
- ✅ Open to all (minors require parental authorization)

## 🎁 Registration Includes (Modality D — base)

- ✅ Participation in the 25km or 45km route
- ✅ Personal accident insurance **WITHOUT EXCESS/FRANCHISE**
- ✅ Solid and liquid refreshments
- ✅ Showers and bike washing area
- ✅ Souvenirs

## 🏷️ Registration Modalities

| Modality | Period | Price | Includes |
|----------|--------|-------|----------|
| **A (Jersey + Lunch)** | Jan 1-31 | €25 | Jersey, lunch, insurance w/o excess, souvenirs, refreshments |
| **B (Jersey, no Lunch)** | Jan 1-31 | €20 | Jersey, insurance w/o excess, souvenirs, refreshments |
| **C (Lunch, no Jersey)** | Feb 1-28 | €20 | Lunch, insurance w/o excess, souvenirs, refreshments |
| **D (no Lunch, no Jersey)** | Feb 1 - Mar 2 | €15 | Insurance w/o excess, souvenirs, refreshments |
| **On-the-day registration** | Mar 8 | €20 | No souvenir guarantee |

## ⚡ E-Bikes — Rules

- Single category, 45km route only, 18+ years old
- Motors max 250W, assist only when pedaling, cuts off at 25 km/h
- Authorized brands: Bosch, Shimano, Panasonic, Brose, Yamaha
- Separate classification, trophy for 1st place
- No battery charging by organization

## 📧 Contacts

- **Organization:** BTT LAZER Section of ARCC
- **Phone:** 962 588 979`,
    },
    {
      language: "es",
      title: "17.ª Maratón BTT LAZER ARCC",
      city: "Oliveira do Hospital",
      metaTitle:
        "17.ª Maratón BTT LAZER ARCC 2026 | Oliveira do Hospital, Coimbra | 8 Marzo",
      metaDescription:
        "17.ª Maratón BTT LAZER ARCC 2026 - 8 de marzo en Oliveira do Hospital. Maratón 45km y Media Maratón 25km. Evento deportivo no competitivo. Límite 400 participantes.",
      description: `# 🚴 17.ª Maratón BTT LAZER ARCC 2026

La **17.ª Maratón BTT LAZER ARCC** está organizada por la **Sección de BTT LAZER de la ARCC** (Associação Recreativa e Cultural de Coja). Un evento deportivo **sin carácter competitivo**, pero con registro estadístico de tiempos. ¡Ven a pedalear por los caminos rurales y senderos BTT del municipio de Oliveira do Hospital!

## 📅 Fecha y Lugar

- **Fecha:** 8 de marzo de 2026 (Domingo)
- **Salida:** 09:00
- **Lugar:** Oliveira do Hospital
- **Distrito:** Coimbra
- **Límite:** 400 participantes

## 🚴 Recorridos Disponibles

| Recorrido | Distancia | Salida |
|-----------|-----------|--------|
| **Maratón** | 45 km | 09:00 |
| **Media Maratón** | 25 km | 09:00 |

## 🏆 Categorías

- **Masculino** — todas las edades
- **Femenino** — todas las edades
- **E-Bikes** — categoría única, solo 45km, mayores de 18 años, clasificación separada

## 📋 Señalización y Seguridad

- ✅ Recorrido señalizado con cintas y placas
- ✅ Puestos de control a lo largo del recorrido
- ✅ Abierto a todos (menores necesitan autorización parental)

## 🎁 La Inscripción Incluye (Modalidad D — base)

- ✅ Participación en el recorrido de 25km o 45km
- ✅ Seguro de accidentes personales **SIN FRANQUICIA**
- ✅ Avituallamientos sólidos y líquidos
- ✅ Duchas y zona de lavado de bicicletas
- ✅ Recuerdos

## 🏷️ Modalidades de Inscripción

| Modalidad | Período | Precio | Incluye |
|-----------|---------|--------|---------|
| **A (Jersey + Almuerzo)** | 1-31 Ene | 25€ | Jersey, almuerzo, seguro s/ franquicia, recuerdos, avituallamientos |
| **B (Jersey, s/ Almuerzo)** | 1-31 Ene | 20€ | Jersey, seguro s/ franquicia, recuerdos, avituallamientos |
| **C (Almuerzo, s/ Jersey)** | 1-28 Feb | 20€ | Almuerzo, seguro s/ franquicia, recuerdos, avituallamientos |
| **D (s/ Almuerzo, s/ Jersey)** | 1 Feb - 2 Mar | 15€ | Seguro s/ franquicia, recuerdos, avituallamientos |
| **Inscripción en el día** | 8 Mar | 20€ | Sin garantía de recuerdo |

## ⚡ E-Bikes — Reglas

- Categoría única, solo recorrido de 45km, mayores de 18 años
- Motores máx. 250W, asistencia solo al pedalear, corte a 25 km/h
- Marcas autorizadas: Bosch, Shimano, Panasonic, Brose, Yamaha
- Clasificación separada, trofeo para el 1.º clasificado
- Sin carga de baterías por la organización

## 📧 Contactos

- **Organización:** Sección de BTT LAZER de la ARCC
- **Teléfono:** 962 588 979`,
    },
    {
      language: "fr",
      title: "17e Marathon VTT LAZER ARCC",
      city: "Oliveira do Hospital",
      metaTitle:
        "17e Marathon VTT LAZER ARCC 2026 | Oliveira do Hospital, Coimbra | 8 Mars",
      metaDescription:
        "17e Marathon VTT LAZER ARCC 2026 - 8 mars à Oliveira do Hospital. Marathon 45km et Semi-Marathon 25km. Événement sportif non compétitif. Limite 400 participants.",
      description: `# 🚴 17e Marathon VTT LAZER ARCC 2026

Le **17e Marathon VTT LAZER ARCC** est organisé par la **Section BTT LAZER de l'ARCC** (Associação Recreativa e Cultural de Coja). Un événement sportif **sans caractère compétitif**, mais avec enregistrement statistique des temps. Venez pédaler sur les chemins ruraux et sentiers VTT de la commune d'Oliveira do Hospital !

## 📅 Date et Lieu

- **Date:** 8 mars 2026 (Dimanche)
- **Départ:** 09:00
- **Lieu:** Oliveira do Hospital
- **District:** Coimbra
- **Limite:** 400 participants

## 🚴 Parcours Disponibles

| Parcours | Distance | Départ |
|----------|----------|--------|
| **Marathon** | 45 km | 09:00 |
| **Semi-Marathon** | 25 km | 09:00 |

## 🏆 Catégories

- **Masculin** — tous les âges
- **Féminin** — tous les âges
- **E-Bikes** — catégorie unique, 45km uniquement, 18+, classement séparé

## 📋 Signalisation et Sécurité

- ✅ Parcours balisé avec rubans et panneaux
- ✅ Postes de contrôle le long du parcours
- ✅ Ouvert à tous (mineurs nécessitent autorisation parentale)

## 🎁 L'Inscription Comprend (Modalité D — base)

- ✅ Participation au parcours de 25km ou 45km
- ✅ Assurance accidents personnels **SANS FRANCHISE**
- ✅ Ravitaillements solides et liquides
- ✅ Douches et zone de lavage de vélos
- ✅ Souvenirs

## 🏷️ Modalités d'Inscription

| Modalité | Période | Prix | Comprend |
|----------|---------|------|----------|
| **A (Maillot + Déjeuner)** | 1-31 Jan | 25€ | Maillot, déjeuner, assurance s/ franchise, souvenirs, ravitaillements |
| **B (Maillot, s/ Déjeuner)** | 1-31 Jan | 20€ | Maillot, assurance s/ franchise, souvenirs, ravitaillements |
| **C (Déjeuner, s/ Maillot)** | 1-28 Fév | 20€ | Déjeuner, assurance s/ franchise, souvenirs, ravitaillements |
| **D (s/ Déjeuner, s/ Maillot)** | 1 Fév - 2 Mar | 15€ | Assurance s/ franchise, souvenirs, ravitaillements |
| **Inscription le jour** | 8 Mar | 20€ | Sans garantie de souvenir |

## ⚡ E-Bikes — Règles

- Catégorie unique, parcours 45km uniquement, 18 ans et plus
- Moteurs max 250W, assistance uniquement en pédalant, coupure à 25 km/h
- Marques autorisées : Bosch, Shimano, Panasonic, Brose, Yamaha
- Classement séparé, trophée pour le 1er
- Pas de recharge de batteries par l'organisation

## 📧 Contacts

- **Organisation:** Section BTT LAZER de l'ARCC
- **Téléphone:** 962 588 979`,
    },
    {
      language: "de",
      title: "17. MTB LAZER ARCC Marathon",
      city: "Oliveira do Hospital",
      metaTitle:
        "17. MTB LAZER ARCC Marathon 2026 | Oliveira do Hospital, Coimbra | 8. März",
      metaDescription:
        "17. MTB LAZER ARCC Marathon 2026 - 8. März in Oliveira do Hospital. Marathon 45km und Halbmarathon 25km. Nicht-wettkampfmäßige Sportveranstaltung. Limit 400 Teilnehmer.",
      description: `# 🚴 17. MTB LAZER ARCC Marathon 2026

Der **17. MTB LAZER ARCC Marathon** wird von der **BTT LAZER Sektion der ARCC** (Associação Recreativa e Cultural de Coja) organisiert. Eine Sportveranstaltung **ohne Wettkampfcharakter**, aber mit statistischer Zeiterfassung. Komm und fahre durch die ländlichen Wege und MTB-Trails der Gemeinde Oliveira do Hospital!

## 📅 Datum und Ort

- **Datum:** 8. März 2026 (Sonntag)
- **Start:** 09:00 Uhr
- **Ort:** Oliveira do Hospital
- **Bezirk:** Coimbra
- **Limit:** 400 Teilnehmer

## 🚴 Verfügbare Strecken

| Strecke | Distanz | Start |
|---------|---------|-------|
| **Marathon** | 45 km | 09:00 |
| **Halbmarathon** | 25 km | 09:00 |

## 🏆 Kategorien

- **Männlich** — alle Altersgruppen
- **Weiblich** — alle Altersgruppen
- **E-Bikes** — Einzelkategorie, nur 45km, ab 18 Jahren, separate Wertung

## 📋 Markierung und Sicherheit

- ✅ Strecke mit Bändern und Schildern markiert
- ✅ Kontrollposten entlang der Strecke
- ✅ Offen für alle (Minderjährige benötigen elterliche Genehmigung)

## 🎁 Die Anmeldung Beinhaltet (Modalität D — Basis)

- ✅ Teilnahme an der 25km oder 45km Strecke
- ✅ Persönliche Unfallversicherung **OHNE SELBSTBETEILIGUNG**
- ✅ Feste und flüssige Verpflegung
- ✅ Duschen und Fahrradwaschbereich
- ✅ Erinnerungsgeschenke

## 🏷️ Anmeldeoptionen

| Option | Zeitraum | Preis | Beinhaltet |
|--------|----------|-------|------------|
| **A (Trikot + Mittagessen)** | 1.-31. Jan | 25€ | Trikot, Mittagessen, Versicherung o. Selbstbeteiligung, Geschenke, Verpflegung |
| **B (Trikot, o. Mittagessen)** | 1.-31. Jan | 20€ | Trikot, Versicherung o. Selbstbeteiligung, Geschenke, Verpflegung |
| **C (Mittagessen, o. Trikot)** | 1.-28. Feb | 20€ | Mittagessen, Versicherung o. Selbstbeteiligung, Geschenke, Verpflegung |
| **D (o. Mittagessen, o. Trikot)** | 1. Feb - 2. Mär | 15€ | Versicherung o. Selbstbeteiligung, Geschenke, Verpflegung |
| **Anmeldung am Tag** | 8. Mär | 20€ | Kein Geschenk garantiert |

## ⚡ E-Bikes — Regeln

- Einzelkategorie, nur 45km Strecke, ab 18 Jahren
- Motoren max. 250W, Unterstützung nur beim Treten, Abschaltung bei 25 km/h
- Zugelassene Marken: Bosch, Shimano, Panasonic, Brose, Yamaha
- Separate Wertung, Trophäe für den 1. Platz
- Kein Aufladen von Batterien durch die Organisation

## 📧 Kontakt

- **Organisation:** BTT LAZER Sektion der ARCC
- **Telefon:** 962 588 979`,
    },
    {
      language: "it",
      title: "17ª Maratona BTT LAZER ARCC",
      city: "Oliveira do Hospital",
      metaTitle:
        "17ª Maratona BTT LAZER ARCC 2026 | Oliveira do Hospital, Coimbra | 8 Marzo",
      metaDescription:
        "17ª Maratona BTT LAZER ARCC 2026 - 8 marzo a Oliveira do Hospital. Maratona 45km e Mezza Maratona 25km. Evento sportivo non competitivo. Limite 400 partecipanti.",
      description: `# 🚴 17ª Maratona BTT LAZER ARCC 2026

La **17ª Maratona BTT LAZER ARCC** è organizzata dalla **Sezione BTT LAZER dell'ARCC** (Associação Recreativa e Cultural de Coja). Un evento sportivo **senza carattere competitivo**, ma con registrazione statistica dei tempi. Vieni a pedalare per i sentieri rurali e i percorsi BTT del comune di Oliveira do Hospital!

## 📅 Data e Luogo

- **Data:** 8 marzo 2026 (Domenica)
- **Partenza:** 09:00
- **Luogo:** Oliveira do Hospital
- **Distretto:** Coimbra
- **Limite:** 400 partecipanti

## 🚴 Percorsi Disponibili

| Percorso | Distanza | Partenza |
|----------|----------|----------|
| **Maratona** | 45 km | 09:00 |
| **Mezza Maratona** | 25 km | 09:00 |

## 🏆 Categorie

- **Maschile** — tutte le età
- **Femminile** — tutte le età
- **E-Bikes** — categoria unica, solo 45km, 18+, classifica separata

## 📋 Segnaletica e Sicurezza

- ✅ Percorso segnalato con nastri e cartelli
- ✅ Punti di controllo lungo il percorso
- ✅ Aperto a tutti (i minori necessitano autorizzazione genitoriale)

## 🎁 L'Iscrizione Include (Modalità D — base)

- ✅ Partecipazione al percorso di 25km o 45km
- ✅ Assicurazione infortuni personali **SENZA FRANCHIGIA**
- ✅ Ristori solidi e liquidi
- ✅ Docce e area lavaggio biciclette
- ✅ Ricordi

## 🏷️ Modalità di Iscrizione

| Modalità | Periodo | Prezzo | Include |
|----------|---------|--------|---------|
| **A (Maglia + Pranzo)** | 1-31 Gen | 25€ | Maglia, pranzo, assicurazione s/ franchigia, ricordi, ristori |
| **B (Maglia, s/ Pranzo)** | 1-31 Gen | 20€ | Maglia, assicurazione s/ franchigia, ricordi, ristori |
| **C (Pranzo, s/ Maglia)** | 1-28 Feb | 20€ | Pranzo, assicurazione s/ franchigia, ricordi, ristori |
| **D (s/ Pranzo, s/ Maglia)** | 1 Feb - 2 Mar | 15€ | Assicurazione s/ franchigia, ricordi, ristori |
| **Iscrizione il giorno** | 8 Mar | 20€ | Senza garanzia di ricordo |

## ⚡ E-Bikes — Regole

- Categoria unica, solo percorso 45km, 18+ anni
- Motori max 250W, assistenza solo durante la pedalata, taglio a 25 km/h
- Marchi autorizzati: Bosch, Shimano, Panasonic, Brose, Yamaha
- Classifica separata, trofeo per il 1° classificato
- Nessuna ricarica batterie da parte dell'organizzazione

## 📧 Contatti

- **Organizzazione:** Sezione BTT LAZER dell'ARCC
- **Telefono:** 962 588 979`,
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

  // Variant 1: Maratona 45km
  const maratona = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Maratona 45km",
      distanceKm: 45,
      startTime: "09:00",
      maxParticipants: 400,
      price: 15.0,
      currency: "EUR",
    },
  });

  const maratonaTranslations = [
    {
      language: "pt" as const,
      name: "Maratona 45km",
      description:
        "Percurso de 45km pelos caminhos rurais e trilhos BTT do concelho de Oliveira do Hospital. Manifestação desportiva sem caráter competitivo, com registo estatístico de tempos. Percurso marcado com fitas e placas + postos de controlo.",
    },
    {
      language: "en" as const,
      name: "Marathon 45km",
      description:
        "45km route through rural paths and MTB trails of Oliveira do Hospital municipality. Non-competitive sports event with statistical time recording. Route marked with ribbons and signs + control points.",
    },
    {
      language: "es" as const,
      name: "Maratón 45km",
      description:
        "Recorrido de 45km por caminos rurales y senderos BTT del municipio de Oliveira do Hospital. Evento deportivo sin carácter competitivo, con registro estadístico de tiempos. Recorrido señalizado con cintas y placas + puestos de control.",
    },
    {
      language: "fr" as const,
      name: "Marathon 45km",
      description:
        "Parcours de 45km sur chemins ruraux et sentiers VTT de la commune d'Oliveira do Hospital. Événement sportif sans caractère compétitif, avec enregistrement statistique des temps. Parcours balisé avec rubans et panneaux + postes de contrôle.",
    },
    {
      language: "de" as const,
      name: "Marathon 45km",
      description:
        "45km Strecke durch ländliche Wege und MTB-Trails der Gemeinde Oliveira do Hospital. Nicht-wettkampfmäßige Sportveranstaltung mit statistischer Zeiterfassung. Strecke mit Bändern und Schildern markiert + Kontrollposten.",
    },
    {
      language: "it" as const,
      name: "Maratona 45km",
      description:
        "Percorso di 45km per sentieri rurali e percorsi BTT del comune di Oliveira do Hospital. Evento sportivo senza carattere competitivo, con registrazione statistica dei tempi. Percorso segnalato con nastri e cartelli + punti di controllo.",
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

  console.log("   ✅ Maratona 45km created");

  // Variant 2: Meia-Maratona 25km
  const meiaMaratona = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Meia-Maratona 25km",
      distanceKm: 25,
      startTime: "09:00",
      maxParticipants: 400,
      price: 15.0,
      currency: "EUR",
    },
  });

  const meiaMaratonaTranslations = [
    {
      language: "pt" as const,
      name: "Meia-Maratona 25km",
      description:
        "Percurso de 25km pelos caminhos rurais e trilhos BTT do concelho de Oliveira do Hospital. Manifestação desportiva sem caráter competitivo, com registo estatístico de tempos. Percurso marcado com fitas e placas + postos de controlo.",
    },
    {
      language: "en" as const,
      name: "Half-Marathon 25km",
      description:
        "25km route through rural paths and MTB trails of Oliveira do Hospital municipality. Non-competitive sports event with statistical time recording. Route marked with ribbons and signs + control points.",
    },
    {
      language: "es" as const,
      name: "Media Maratón 25km",
      description:
        "Recorrido de 25km por caminos rurales y senderos BTT del municipio de Oliveira do Hospital. Evento deportivo sin carácter competitivo, con registro estadístico de tiempos. Recorrido señalizado con cintas y placas + puestos de control.",
    },
    {
      language: "fr" as const,
      name: "Semi-Marathon 25km",
      description:
        "Parcours de 25km sur chemins ruraux et sentiers VTT de la commune d'Oliveira do Hospital. Événement sportif sans caractère compétitif, avec enregistrement statistique des temps. Parcours balisé avec rubans et panneaux + postes de contrôle.",
    },
    {
      language: "de" as const,
      name: "Halbmarathon 25km",
      description:
        "25km Strecke durch ländliche Wege und MTB-Trails der Gemeinde Oliveira do Hospital. Nicht-wettkampfmäßige Sportveranstaltung mit statistischer Zeiterfassung. Strecke mit Bändern und Schildern markiert + Kontrollposten.",
    },
    {
      language: "it" as const,
      name: "Mezza Maratona 25km",
      description:
        "Percorso di 25km per sentieri rurali e percorsi BTT del comune di Oliveira do Hospital. Evento sportivo senza carattere competitivo, con registrazione statistica dei tempi. Percorso segnalato con nastri e cartelli + punti di controllo.",
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

  console.log("   ✅ Meia-Maratona 25km created");

  // Variant 3: Almoço
  const almoco = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Almoço",
      price: 5.0,
      currency: "EUR",
    },
  });

  const almocoTranslations = [
    {
      language: "pt" as const,
      name: "Almoço",
      description:
        "Almoço para participantes e acompanhantes. Crianças até 12 anos grátis.",
    },
    {
      language: "en" as const,
      name: "Lunch",
      description:
        "Lunch for participants and companions. Children up to 12 years free.",
    },
    {
      language: "es" as const,
      name: "Almuerzo",
      description:
        "Almuerzo para participantes y acompañantes. Niños hasta 12 años gratis.",
    },
    {
      language: "fr" as const,
      name: "Déjeuner",
      description:
        "Déjeuner pour participants et accompagnants. Enfants jusqu'à 12 ans gratuit.",
    },
    {
      language: "de" as const,
      name: "Mittagessen",
      description:
        "Mittagessen für Teilnehmer und Begleitpersonen. Kinder bis 12 Jahre kostenlos.",
    },
    {
      language: "it" as const,
      name: "Pranzo",
      description:
        "Pranzo per partecipanti e accompagnatori. Bambini fino a 12 anni gratis.",
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
      price: 10.0,
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
      name: "Modalidade A (Jersey + Almoço)",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-01-31T23:59:59.000Z"),
      price: 25.0,
      currency: "EUR" as const,
      note: "Inclui jersey, almoço, seguro sem franquia, lembranças e abastecimentos",
    },
    {
      name: "Modalidade B (Jersey, sem Almoço)",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-01-31T23:59:59.000Z"),
      price: 20.0,
      currency: "EUR" as const,
      note: "Inclui jersey, seguro sem franquia, lembranças e abastecimentos",
    },
    {
      name: "Modalidade C (Almoço, sem Jersey)",
      startDate: new Date("2026-02-01T00:00:00.000Z"),
      endDate: new Date("2026-02-28T23:59:59.000Z"),
      price: 20.0,
      currency: "EUR" as const,
      note: "Inclui almoço, seguro sem franquia, lembranças e abastecimentos",
    },
    {
      name: "Modalidade D (sem Almoço, sem Jersey)",
      startDate: new Date("2026-02-01T00:00:00.000Z"),
      endDate: new Date("2026-03-02T23:59:59.000Z"),
      price: 15.0,
      currency: "EUR" as const,
      note: "Inclui seguro sem franquia, lembranças e abastecimentos",
    },
    {
      name: "Inscrição no dia",
      startDate: new Date("2026-03-08T00:00:00.000Z"),
      endDate: new Date("2026-03-08T23:59:59.000Z"),
      price: 20.0,
      currency: "EUR" as const,
      note: "Sem garantia de lembrança",
    },
    {
      name: "Almoço",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-03-02T23:59:59.000Z"),
      price: 5.0,
      currency: "EUR" as const,
      note: "Crianças até 12 anos grátis",
    },
    {
      name: "Acompanhantes",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-03-02T23:59:59.000Z"),
      price: 10.0,
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
      question: "Esta prova é competitiva?",
      answer:
        "Não. A 17.ª Maratona BTT LAZER ARCC é uma manifestação desportiva sem caráter competitivo. Os tempos são registados apenas para fins estatísticos. Não existem prémios monetários, apenas lembranças para todos os participantes que terminem o percurso.",
      translations: {
        pt: {
          question: "Esta prova é competitiva?",
          answer:
            "Não. A 17.ª Maratona BTT LAZER ARCC é uma manifestação desportiva sem caráter competitivo. Os tempos são registados apenas para fins estatísticos. Não existem prémios monetários, apenas lembranças para todos os participantes que terminem o percurso.",
        },
        en: {
          question: "Is this event competitive?",
          answer:
            "No. The 17th BTT LAZER ARCC Marathon is a non-competitive sports event. Times are recorded for statistical purposes only. There are no monetary prizes, only souvenirs for all participants who finish the route.",
        },
        es: {
          question: "¿Este evento es competitivo?",
          answer:
            "No. La 17.ª Maratón BTT LAZER ARCC es un evento deportivo sin carácter competitivo. Los tiempos se registran únicamente con fines estadísticos. No hay premios monetarios, solo recuerdos para todos los participantes que terminen el recorrido.",
        },
        fr: {
          question: "Cet événement est-il compétitif ?",
          answer:
            "Non. Le 17e Marathon VTT LAZER ARCC est un événement sportif sans caractère compétitif. Les temps sont enregistrés uniquement à des fins statistiques. Il n'y a pas de prix en argent, seulement des souvenirs pour tous les participants qui terminent le parcours.",
        },
        de: {
          question: "Ist diese Veranstaltung ein Wettkampf?",
          answer:
            "Nein. Der 17. MTB LAZER ARCC Marathon ist eine nicht-wettkampfmäßige Sportveranstaltung. Die Zeiten werden nur zu statistischen Zwecken erfasst. Es gibt keine Geldpreise, nur Erinnerungsgeschenke für alle Teilnehmer, die die Strecke beenden.",
        },
        it: {
          question: "Questo evento è competitivo?",
          answer:
            "No. La 17ª Maratona BTT LAZER ARCC è un evento sportivo senza carattere competitivo. I tempi vengono registrati solo a fini statistici. Non ci sono premi in denaro, solo ricordi per tutti i partecipanti che completano il percorso.",
        },
      },
    },
    {
      order: 2,
      question: "Quais são as modalidades de inscrição?",
      answer:
        "Existem 4 modalidades: A (25€, jersey + almoço, até 31 Jan), B (20€, jersey sem almoço, até 31 Jan), C (20€, almoço sem jersey, até 28 Fev), D (15€, sem jersey nem almoço, até 2 Mar). Inscrição no dia: 20€, sem garantia de lembrança. Todas incluem seguro sem franquia, lembranças e abastecimentos.",
      translations: {
        pt: {
          question: "Quais são as modalidades de inscrição?",
          answer:
            "Existem 4 modalidades: A (25€, jersey + almoço, até 31 Jan), B (20€, jersey sem almoço, até 31 Jan), C (20€, almoço sem jersey, até 28 Fev), D (15€, sem jersey nem almoço, até 2 Mar). Inscrição no dia: 20€, sem garantia de lembrança. Todas incluem seguro sem franquia, lembranças e abastecimentos.",
        },
        en: {
          question: "What are the registration modalities?",
          answer:
            "There are 4 modalities: A (€25, jersey + lunch, until Jan 31), B (€20, jersey without lunch, until Jan 31), C (€20, lunch without jersey, until Feb 28), D (€15, no jersey or lunch, until Mar 2). On-the-day registration: €20, no souvenir guarantee. All include insurance without excess, souvenirs and refreshments.",
        },
        es: {
          question: "¿Cuáles son las modalidades de inscripción?",
          answer:
            "Hay 4 modalidades: A (25€, jersey + almuerzo, hasta 31 Ene), B (20€, jersey sin almuerzo, hasta 31 Ene), C (20€, almuerzo sin jersey, hasta 28 Feb), D (15€, sin jersey ni almuerzo, hasta 2 Mar). Inscripción en el día: 20€, sin garantía de recuerdo. Todas incluyen seguro sin franquicia, recuerdos y avituallamientos.",
        },
        fr: {
          question: "Quelles sont les modalités d'inscription ?",
          answer:
            "Il y a 4 modalités : A (25€, maillot + déjeuner, jusqu'au 31 Jan), B (20€, maillot sans déjeuner, jusqu'au 31 Jan), C (20€, déjeuner sans maillot, jusqu'au 28 Fév), D (15€, sans maillot ni déjeuner, jusqu'au 2 Mar). Inscription le jour : 20€, sans garantie de souvenir. Toutes incluent assurance sans franchise, souvenirs et ravitaillements.",
        },
        de: {
          question: "Welche Anmeldeoptionen gibt es?",
          answer:
            "Es gibt 4 Optionen: A (25€, Trikot + Mittagessen, bis 31. Jan), B (20€, Trikot ohne Mittagessen, bis 31. Jan), C (20€, Mittagessen ohne Trikot, bis 28. Feb), D (15€, ohne Trikot und Mittagessen, bis 2. Mär). Anmeldung am Tag: 20€, kein Geschenk garantiert. Alle beinhalten Versicherung ohne Selbstbeteiligung, Geschenke und Verpflegung.",
        },
        it: {
          question: "Quali sono le modalità di iscrizione?",
          answer:
            "Ci sono 4 modalità: A (25€, maglia + pranzo, fino al 31 Gen), B (20€, maglia senza pranzo, fino al 31 Gen), C (20€, pranzo senza maglia, fino al 28 Feb), D (15€, senza maglia né pranzo, fino al 2 Mar). Iscrizione il giorno: 20€, senza garanzia di ricordo. Tutte includono assicurazione senza franchigia, ricordi e ristori.",
        },
      },
    },
    {
      order: 3,
      question: "Quais são as regras para E-Bikes?",
      answer:
        "E-Bikes participam numa categoria única, apenas no percurso de 45km, para maiores de 18 anos (masculino ou feminino). Motores máx. 250W, assistência apenas ao pedalar, corte aos 25 km/h. Marcas autorizadas: Bosch, Shimano, Panasonic, Brose, Yamaha. Classificação separada com troféu para o 1.º classificado. A organização não disponibiliza carregamento de baterias.",
      translations: {
        pt: {
          question: "Quais são as regras para E-Bikes?",
          answer:
            "E-Bikes participam numa categoria única, apenas no percurso de 45km, para maiores de 18 anos (masculino ou feminino). Motores máx. 250W, assistência apenas ao pedalar, corte aos 25 km/h. Marcas autorizadas: Bosch, Shimano, Panasonic, Brose, Yamaha. Classificação separada com troféu para o 1.º classificado. A organização não disponibiliza carregamento de baterias.",
        },
        en: {
          question: "What are the E-Bike rules?",
          answer:
            "E-Bikes participate in a single category, 45km route only, for riders 18+ (male or female). Motors max 250W, assist only when pedaling, cuts off at 25 km/h. Authorized brands: Bosch, Shimano, Panasonic, Brose, Yamaha. Separate classification with trophy for 1st place. The organization does not provide battery charging.",
        },
        es: {
          question: "¿Cuáles son las reglas para E-Bikes?",
          answer:
            "Las E-Bikes participan en una categoría única, solo en el recorrido de 45km, para mayores de 18 años (masculino o femenino). Motores máx. 250W, asistencia solo al pedalear, corte a 25 km/h. Marcas autorizadas: Bosch, Shimano, Panasonic, Brose, Yamaha. Clasificación separada con trofeo para el 1.º clasificado. La organización no proporciona carga de baterías.",
        },
        fr: {
          question: "Quelles sont les règles pour les E-Bikes ?",
          answer:
            "Les E-Bikes participent dans une catégorie unique, parcours 45km uniquement, pour les 18+ (masculin ou féminin). Moteurs max 250W, assistance uniquement en pédalant, coupure à 25 km/h. Marques autorisées : Bosch, Shimano, Panasonic, Brose, Yamaha. Classement séparé avec trophée pour le 1er. L'organisation ne fournit pas de recharge de batteries.",
        },
        de: {
          question: "Welche Regeln gelten für E-Bikes?",
          answer:
            "E-Bikes nehmen in einer Einzelkategorie teil, nur 45km Strecke, ab 18 Jahren (männlich oder weiblich). Motoren max. 250W, Unterstützung nur beim Treten, Abschaltung bei 25 km/h. Zugelassene Marken: Bosch, Shimano, Panasonic, Brose, Yamaha. Separate Wertung mit Trophäe für den 1. Platz. Die Organisation bietet kein Aufladen von Batterien an.",
        },
        it: {
          question: "Quali sono le regole per le E-Bikes?",
          answer:
            "Le E-Bikes partecipano in una categoria unica, solo percorso 45km, per i 18+ (maschile o femminile). Motori max 250W, assistenza solo durante la pedalata, taglio a 25 km/h. Marchi autorizzati: Bosch, Shimano, Panasonic, Brose, Yamaha. Classifica separata con trofeo per il 1° classificato. L'organizzazione non fornisce ricarica batterie.",
        },
      },
    },
    {
      order: 4,
      question: "O seguro inclui franquia?",
      answer:
        "Não! Este é um dos grandes diferenciadores desta prova. O seguro de acidentes pessoais incluído em todas as modalidades de inscrição é SEM FRANQUIA, ou seja, em caso de acidente, o participante não paga qualquer valor de excesso/franquia.",
      translations: {
        pt: {
          question: "O seguro inclui franquia?",
          answer:
            "Não! Este é um dos grandes diferenciadores desta prova. O seguro de acidentes pessoais incluído em todas as modalidades de inscrição é SEM FRANQUIA, ou seja, em caso de acidente, o participante não paga qualquer valor de excesso/franquia.",
        },
        en: {
          question: "Does the insurance include an excess/franchise?",
          answer:
            "No! This is one of the great differentiators of this event. The personal accident insurance included in all registration modalities is WITHOUT EXCESS/FRANCHISE, meaning in case of an accident, the participant does not pay any excess amount.",
        },
        es: {
          question: "¿El seguro incluye franquicia?",
          answer:
            "¡No! Este es uno de los grandes diferenciadores de este evento. El seguro de accidentes personales incluido en todas las modalidades de inscripción es SIN FRANQUICIA, es decir, en caso de accidente, el participante no paga ningún valor de exceso/franquicia.",
        },
        fr: {
          question: "L'assurance inclut-elle une franchise ?",
          answer:
            "Non ! C'est l'un des grands différenciateurs de cet événement. L'assurance accidents personnels incluse dans toutes les modalités d'inscription est SANS FRANCHISE, c'est-à-dire qu'en cas d'accident, le participant ne paie aucun montant de franchise.",
        },
        de: {
          question: "Beinhaltet die Versicherung eine Selbstbeteiligung?",
          answer:
            "Nein! Dies ist einer der großen Unterscheidungsmerkmale dieser Veranstaltung. Die in allen Anmeldeoptionen enthaltene Unfallversicherung ist OHNE SELBSTBETEILIGUNG, d.h. im Falle eines Unfalls zahlt der Teilnehmer keinen Selbstbeteiligungsbetrag.",
        },
        it: {
          question: "L'assicurazione include una franchigia?",
          answer:
            "No! Questo è uno dei grandi fattori distintivi di questo evento. L'assicurazione infortuni personali inclusa in tutte le modalità di iscrizione è SENZA FRANCHIGIA, ovvero in caso di incidente, il partecipante non paga alcun importo di franchigia.",
        },
      },
    },
    {
      order: 5,
      question: "Até quando posso garantir o jersey?",
      answer:
        "O jersey só está disponível nas Modalidades A e B, cujas inscrições encerram a 31 de janeiro de 2026. Após essa data, já não é possível garantir o jersey. Se pretende o jersey, inscreva-se até 31 de janeiro na Modalidade A (25€, com almoço) ou B (20€, sem almoço).",
      translations: {
        pt: {
          question: "Até quando posso garantir o jersey?",
          answer:
            "O jersey só está disponível nas Modalidades A e B, cujas inscrições encerram a 31 de janeiro de 2026. Após essa data, já não é possível garantir o jersey. Se pretende o jersey, inscreva-se até 31 de janeiro na Modalidade A (25€, com almoço) ou B (20€, sem almoço).",
        },
        en: {
          question: "Until when can I guarantee the jersey?",
          answer:
            "The jersey is only available in Modalities A and B, whose registrations close on January 31, 2026. After that date, it is no longer possible to guarantee the jersey. If you want the jersey, register by January 31 in Modality A (€25, with lunch) or B (€20, without lunch).",
        },
        es: {
          question: "¿Hasta cuándo puedo garantizar el jersey?",
          answer:
            "El jersey solo está disponible en las Modalidades A y B, cuyas inscripciones cierran el 31 de enero de 2026. Después de esa fecha, ya no es posible garantizar el jersey. Si desea el jersey, inscríbase hasta el 31 de enero en la Modalidad A (25€, con almuerzo) o B (20€, sin almuerzo).",
        },
        fr: {
          question: "Jusqu'à quand puis-je garantir le maillot ?",
          answer:
            "Le maillot n'est disponible que dans les Modalités A et B, dont les inscriptions ferment le 31 janvier 2026. Après cette date, il n'est plus possible de garantir le maillot. Si vous souhaitez le maillot, inscrivez-vous avant le 31 janvier en Modalité A (25€, avec déjeuner) ou B (20€, sans déjeuner).",
        },
        de: {
          question: "Bis wann kann ich das Trikot garantieren?",
          answer:
            "Das Trikot ist nur in den Optionen A und B verfügbar, deren Anmeldungen am 31. Januar 2026 enden. Nach diesem Datum ist es nicht mehr möglich, das Trikot zu garantieren. Wenn Sie das Trikot möchten, melden Sie sich bis zum 31. Januar in Option A (25€, mit Mittagessen) oder B (20€, ohne Mittagessen) an.",
        },
        it: {
          question: "Fino a quando posso garantire la maglia?",
          answer:
            "La maglia è disponibile solo nelle Modalità A e B, le cui iscrizioni chiudono il 31 gennaio 2026. Dopo tale data, non è più possibile garantire la maglia. Se desidera la maglia, si iscriva entro il 31 gennaio nella Modalità A (25€, con pranzo) o B (20€, senza pranzo).",
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
🚴 17.ª Maratona BTT LAZER ARCC 2026 seeded successfully!
   📍 Event: 17.ª Maratona BTT LAZER ARCC
   🔗 Slug: ${event.slug}
   📅 Date: 2026-03-08
   📍 Location: Oliveira do Hospital, Coimbra
   🚴 Variants: Maratona 45km, Meia-Maratona 25km, Almoço, Acompanhantes
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
