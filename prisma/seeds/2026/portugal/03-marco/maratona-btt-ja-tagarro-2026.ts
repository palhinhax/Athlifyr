/**
 * Seed: 16.ª Maratona BTT Já T'Agarro 2026
 * Complete with translations in all 6 languages, FAQs and SEO
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding 16.ª Maratona BTT Já T'Agarro 2026...");

  const eventSlug = "maratona-btt-ja-tagarro-2026";

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
      title: "16.ª Maratona BTT Já T'Agarro",
      description:
        "Passeio/Maratona BTT com percursos de 70km e 40km pelos trilhos da Branca, Coruche. Evento turístico e cultural organizado pelo Clube de Ciclismo e BTT Já T'Agarro.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-01T09:00:00.000Z"),
      endDate: null,
      city: "Branca, Coruche",
      country: "Portugal",
      latitude: 38.89,
      longitude: -8.49,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Largo+da+Liberdade+Branca+Coruche",
      externalUrl: "",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-02-26T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "16.ª Maratona BTT Já T'Agarro",
      description:
        "Passeio/Maratona BTT com percursos de 70km e 40km pelos trilhos da Branca, Coruche. Evento turístico e cultural organizado pelo Clube de Ciclismo e BTT Já T'Agarro.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-01T09:00:00.000Z"),
      endDate: null,
      city: "Branca, Coruche",
      country: "Portugal",
      latitude: 38.89,
      longitude: -8.49,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Largo+da+Liberdade+Branca+Coruche",
      externalUrl: "",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-02-26T23:59:59.000Z"),
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
      title: "16.ª Maratona BTT Já T'Agarro",
      city: "Branca, Coruche",
      metaTitle:
        "16.ª Maratona BTT Já T'Agarro 2026 | Branca, Coruche | 1 Março",
      metaDescription:
        "16.ª Maratona BTT Já T'Agarro 2026 - 1 de março na Branca, Coruche. Maratona 70km e Meia-Maratona 40km pelos trilhos e herdades da freguesia da Branca.",
      description: `# 🚴 16.ª Maratona BTT Já T'Agarro 2026

A **16.ª Edição do Passeio/Maratona BTT "Já T'Agarro"** é organizada pelo **Clube de Ciclismo e BTT Já T'Agarro**. Vem pedalar pelos trilhos, estradões e herdades da Branca, no concelho de Coruche!

## 📅 Data e Local

- **Data:** 1 de março de 2026 (Domingo)
- **Hora de Partida:** 09:00 (Maratona) | 09:05 (Meia-Maratona)
- **Local:** Largo da Liberdade, Branca, Coruche
- **Distrito:** Santarém

## 🚴 Percursos Disponíveis

| Percurso | Distância | Idade Mínima |
|----------|-----------|--------------|
| **Maratona** | 70 km | 16 anos |
| **Meia-Maratona** | 40 km | 14 anos |

## 🏆 Categorias

- Sub-23, Elites, Masters A/B/C/D Masculinos
- Elites e Masters Femininas
- E-Bikes

## 🎁 A Inscrição Inclui

- ✅ Participação no passeio
- ✅ Dorsal com número de identificação
- ✅ Seguro de acidentes pessoais (FPCUB)
- ✅ Zonas de reabastecimento líquido e sólido
- ✅ Zona de lavagem de bicicletas
- ✅ Acesso a balneários
- ✅ Viatura de apoio e emergência
- ✅ Brinde alusivo ao evento

## ⚡ E-Bikes

- Permitidas em ambos os percursos
- Classificação na categoria própria (mínimo 10 inscritos)

## 🚶 Passeio Pedestre

- Percurso de ~8 km (sem inscrição prévia)
- Início às 09:15 no local de partida

## 📧 Contactos

- **Hélder Dimas:** 934 231 401
- **Manuel Cardoso:** 936 284 812`,
    },
    {
      language: "en",
      title: "16th BTT Marathon Já T'Agarro",
      city: "Branca, Coruche",
      metaTitle:
        "16th BTT Marathon Já T'Agarro 2026 | Branca, Coruche | March 1",
      metaDescription:
        "16th BTT Marathon Já T'Agarro 2026 - March 1 in Branca, Coruche. Marathon 70km and Half-Marathon 40km through the trails and estates of Branca parish.",
      description: `# 🚴 16th BTT Marathon Já T'Agarro 2026

The **16th Edition of the BTT Ride/Marathon "Já T'Agarro"** is organized by **Clube de Ciclismo e BTT Já T'Agarro**. Come pedal through the trails, dirt roads, and private estates of Branca, in the municipality of Coruche!

## 📅 Date and Location

- **Date:** March 1, 2026 (Sunday)
- **Start Time:** 09:00 (Marathon) | 09:05 (Half-Marathon)
- **Location:** Largo da Liberdade, Branca, Coruche
- **District:** Santarém

## 🚴 Available Routes

| Route | Distance | Minimum Age |
|-------|----------|-------------|
| **Marathon** | 70 km | 16 years |
| **Half-Marathon** | 40 km | 14 years |

## 🏆 Categories

- Sub-23, Elites, Masters A/B/C/D Male
- Elites and Masters Female
- E-Bikes

## 🎁 Registration Includes

- ✅ Ride participation
- ✅ Race number with identification
- ✅ Personal accident insurance (FPCUB)
- ✅ Liquid and solid refreshment zones
- ✅ Bike washing area
- ✅ Changing room access
- ✅ Support and emergency vehicles
- ✅ Event souvenir gift

## ⚡ E-Bikes

- Allowed on both routes
- Ranked in their own category (minimum 10 registered)

## 🚶 Walking Tour

- ~8 km route (no registration needed)
- Starts at 09:15 from the start area

## 📧 Contacts

- **Hélder Dimas:** 934 231 401
- **Manuel Cardoso:** 936 284 812`,
    },
    {
      language: "es",
      title: "16.ª Maratón BTT Já T'Agarro",
      city: "Branca, Coruche",
      metaTitle:
        "16.ª Maratón BTT Já T'Agarro 2026 | Branca, Coruche | 1 Marzo",
      metaDescription:
        "16.ª Maratón BTT Já T'Agarro 2026 - 1 de marzo en Branca, Coruche. Maratón 70km y Media Maratón 40km por los senderos y fincas de la parroquia de Branca.",
      description: `# 🚴 16.ª Maratón BTT Já T'Agarro 2026

La **16.ª Edición del Paseo/Maratón BTT "Já T'Agarro"** está organizada por el **Clube de Ciclismo e BTT Já T'Agarro**. ¡Ven a pedalear por los senderos, caminos y fincas de Branca, en el municipio de Coruche!

## 📅 Fecha y Lugar

- **Fecha:** 1 de marzo de 2026 (Domingo)
- **Hora de Salida:** 09:00 (Maratón) | 09:05 (Media Maratón)
- **Lugar:** Largo da Liberdade, Branca, Coruche
- **Distrito:** Santarém

## 🚴 Recorridos Disponibles

| Recorrido | Distancia | Edad Mínima |
|-----------|-----------|-------------|
| **Maratón** | 70 km | 16 años |
| **Media Maratón** | 40 km | 14 años |

## 🏆 Categorías

- Sub-23, Elites, Masters A/B/C/D Masculinos
- Elites y Masters Femeninas
- E-Bikes

## 🎁 La Inscripción Incluye

- ✅ Participación en el paseo
- ✅ Dorsal con número de identificación
- ✅ Seguro de accidentes personales (FPCUB)
- ✅ Zonas de avituallamiento líquido y sólido
- ✅ Zona de lavado de bicicletas
- ✅ Acceso a vestuarios
- ✅ Vehículo de apoyo y emergencia
- ✅ Regalo conmemorativo del evento

## ⚡ E-Bikes

- Permitidas en ambos recorridos
- Clasificación en categoría propia (mínimo 10 inscritos)

## 🚶 Paseo Peatonal

- Recorrido de ~8 km (sin inscripción previa)
- Inicio a las 09:15 desde la zona de salida

## 📧 Contactos

- **Hélder Dimas:** 934 231 401
- **Manuel Cardoso:** 936 284 812`,
    },
    {
      language: "fr",
      title: "16e Marathon VTT Já T'Agarro",
      city: "Branca, Coruche",
      metaTitle:
        "16e Marathon VTT Já T'Agarro 2026 | Branca, Coruche | 1er Mars",
      metaDescription:
        "16e Marathon VTT Já T'Agarro 2026 - 1er mars à Branca, Coruche. Marathon 70km et Semi-Marathon 40km à travers les sentiers et domaines de la paroisse de Branca.",
      description: `# 🚴 16e Marathon VTT Já T'Agarro 2026

La **16e Édition de la Balade/Marathon VTT "Já T'Agarro"** est organisée par le **Clube de Ciclismo e BTT Já T'Agarro**. Venez pédaler à travers les sentiers, chemins et domaines de Branca, dans la commune de Coruche !

## 📅 Date et Lieu

- **Date:** 1er mars 2026 (Dimanche)
- **Heure de Départ:** 09:00 (Marathon) | 09:05 (Semi-Marathon)
- **Lieu:** Largo da Liberdade, Branca, Coruche
- **District:** Santarém

## 🚴 Parcours Disponibles

| Parcours | Distance | Âge Minimum |
|----------|----------|-------------|
| **Marathon** | 70 km | 16 ans |
| **Semi-Marathon** | 40 km | 14 ans |

## 🏆 Catégories

- Sub-23, Élites, Masters A/B/C/D Hommes
- Élites et Masters Femmes
- E-Bikes

## 🎁 L'Inscription Comprend

- ✅ Participation à la balade
- ✅ Dossard avec numéro d'identification
- ✅ Assurance accidents personnels (FPCUB)
- ✅ Zones de ravitaillement liquide et solide
- ✅ Zone de lavage de vélos
- ✅ Accès aux vestiaires
- ✅ Véhicule d'assistance et d'urgence
- ✅ Cadeau souvenir de l'événement

## ⚡ E-Bikes

- Autorisés sur les deux parcours
- Classement dans leur propre catégorie (minimum 10 inscrits)

## 🚶 Randonnée Pédestre

- Parcours de ~8 km (sans inscription préalable)
- Départ à 09:15 depuis la zone de départ

## 📧 Contacts

- **Hélder Dimas:** 934 231 401
- **Manuel Cardoso:** 936 284 812`,
    },
    {
      language: "de",
      title: "16. BTT Marathon Já T'Agarro",
      city: "Branca, Coruche",
      metaTitle:
        "16. BTT Marathon Já T'Agarro 2026 | Branca, Coruche | 1. März",
      metaDescription:
        "16. BTT Marathon Já T'Agarro 2026 - 1. März in Branca, Coruche. Marathon 70km und Halbmarathon 40km durch die Wege und Güter der Gemeinde Branca.",
      description: `# 🚴 16. BTT Marathon Já T'Agarro 2026

Die **16. Ausgabe der BTT Ausfahrt/Marathon "Já T'Agarro"** wird vom **Clube de Ciclismo e BTT Já T'Agarro** organisiert. Komm und fahre durch die Trails, Feldwege und Landgüter von Branca in der Gemeinde Coruche!

## 📅 Datum und Ort

- **Datum:** 1. März 2026 (Sonntag)
- **Startzeit:** 09:00 Uhr (Marathon) | 09:05 Uhr (Halbmarathon)
- **Ort:** Largo da Liberdade, Branca, Coruche
- **Bezirk:** Santarém

## 🚴 Verfügbare Strecken

| Strecke | Distanz | Mindestalter |
|---------|---------|--------------|
| **Marathon** | 70 km | 16 Jahre |
| **Halbmarathon** | 40 km | 14 Jahre |

## 🏆 Kategorien

- Sub-23, Elites, Masters A/B/C/D Männer
- Elites und Masters Frauen
- E-Bikes

## 🎁 Die Anmeldung Beinhaltet

- ✅ Teilnahme an der Ausfahrt
- ✅ Startnummer mit Identifikation
- ✅ Persönliche Unfallversicherung (FPCUB)
- ✅ Flüssige und feste Verpflegungszonen
- ✅ Fahrradwaschbereich
- ✅ Zugang zu Umkleidekabinen
- ✅ Begleit- und Notfallfahrzeug
- ✅ Erinnerungsgeschenk des Events

## ⚡ E-Bikes

- Auf beiden Strecken erlaubt
- Wertung in eigener Kategorie (mindestens 10 Angemeldete)

## 🚶 Wanderung

- ~8 km Strecke (keine Voranmeldung nötig)
- Start um 09:15 Uhr vom Startbereich

## 📧 Kontakt

- **Hélder Dimas:** 934 231 401
- **Manuel Cardoso:** 936 284 812`,
    },
    {
      language: "it",
      title: "16ª Maratona BTT Já T'Agarro",
      city: "Branca, Coruche",
      metaTitle:
        "16ª Maratona BTT Já T'Agarro 2026 | Branca, Coruche | 1 Marzo",
      metaDescription:
        "16ª Maratona BTT Já T'Agarro 2026 - 1 marzo a Branca, Coruche. Maratona 70km e Mezza Maratona 40km attraverso i sentieri e le tenute della parrocchia di Branca.",
      description: `# 🚴 16ª Maratona BTT Já T'Agarro 2026

La **16ª Edizione della Passeggiata/Maratona BTT "Já T'Agarro"** è organizzata dal **Clube de Ciclismo e BTT Já T'Agarro**. Vieni a pedalare attraverso i sentieri, le strade sterrate e le tenute di Branca, nel comune di Coruche!

## 📅 Data e Luogo

- **Data:** 1 marzo 2026 (Domenica)
- **Orario di Partenza:** 09:00 (Maratona) | 09:05 (Mezza Maratona)
- **Luogo:** Largo da Liberdade, Branca, Coruche
- **Distretto:** Santarém

## 🚴 Percorsi Disponibili

| Percorso | Distanza | Età Minima |
|----------|----------|------------|
| **Maratona** | 70 km | 16 anni |
| **Mezza Maratona** | 40 km | 14 anni |

## 🏆 Categorie

- Sub-23, Elites, Masters A/B/C/D Maschili
- Elites e Masters Femminili
- E-Bikes

## 🎁 L'Iscrizione Include

- ✅ Partecipazione alla passeggiata
- ✅ Pettorale con numero identificativo
- ✅ Assicurazione infortuni personali (FPCUB)
- ✅ Zone di ristoro liquido e solido
- ✅ Area lavaggio biciclette
- ✅ Accesso agli spogliatoi
- ✅ Veicolo di assistenza e emergenza
- ✅ Regalo ricordo dell'evento

## ⚡ E-Bikes

- Consentite su entrambi i percorsi
- Classifica nella propria categoria (minimo 10 iscritti)

## 🚶 Passeggiata a Piedi

- Percorso di ~8 km (senza iscrizione)
- Partenza alle 09:15 dall'area di partenza

## 📧 Contatti

- **Hélder Dimas:** 934 231 401
- **Manuel Cardoso:** 936 284 812`,
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

  // Variant 1: Maratona 70km
  const maratona = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Maratona 70km",
      distanceKm: 70,
      startTime: "09:00",
      maxParticipants: 400,
      price: 15.0,
      currency: "EUR",
    },
  });

  const maratonaTranslations = [
    {
      language: "pt" as const,
      name: "Maratona 70km",
      description:
        "Percurso de 70km guiado por GPS pelos trilhos, estradões e herdades da freguesia da Branca. Idade mínima: 16 anos. Duas zonas de abastecimento. Obrigatório GPS.",
    },
    {
      language: "en" as const,
      name: "Marathon 70km",
      description:
        "70km GPS-guided route through trails, dirt roads and estates of Branca parish. Minimum age: 16 years. Two refreshment zones. GPS required.",
    },
    {
      language: "es" as const,
      name: "Maratón 70km",
      description:
        "Recorrido de 70km guiado por GPS por senderos, caminos y fincas de la parroquia de Branca. Edad mínima: 16 años. Dos zonas de avituallamiento. GPS obligatorio.",
    },
    {
      language: "fr" as const,
      name: "Marathon 70km",
      description:
        "Parcours de 70km guidé par GPS à travers sentiers, chemins et domaines de la paroisse de Branca. Âge minimum: 16 ans. Deux zones de ravitaillement. GPS obligatoire.",
    },
    {
      language: "de" as const,
      name: "Marathon 70km",
      description:
        "70km GPS-geführte Strecke durch Trails, Feldwege und Landgüter der Gemeinde Branca. Mindestalter: 16 Jahre. Zwei Verpflegungszonen. GPS erforderlich.",
    },
    {
      language: "it" as const,
      name: "Maratona 70km",
      description:
        "Percorso di 70km guidato da GPS attraverso sentieri, strade sterrate e tenute della parrocchia di Branca. Età minima: 16 anni. Due zone di ristoro. GPS obbligatorio.",
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

  // Variant 2: Meia-Maratona 40km
  const meiaMaratona = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Meia-Maratona 40km",
      distanceKm: 40,
      startTime: "09:05",
      maxParticipants: 400,
      price: 15.0,
      currency: "EUR",
    },
  });

  const meiaMaratonaTranslations = [
    {
      language: "pt" as const,
      name: "Meia-Maratona 40km",
      description:
        "Percurso de 40km marcado ao longo do trajeto por estradas municipais, estradões e trilhos da Branca. Idade mínima: 14 anos. Uma zona de abastecimento.",
    },
    {
      language: "en" as const,
      name: "Half-Marathon 40km",
      description:
        "40km marked route through municipal roads, dirt roads and trails of Branca. Minimum age: 14 years. One refreshment zone.",
    },
    {
      language: "es" as const,
      name: "Media Maratón 40km",
      description:
        "Recorrido de 40km señalizado por carreteras municipales, caminos y senderos de Branca. Edad mínima: 14 años. Una zona de avituallamiento.",
    },
    {
      language: "fr" as const,
      name: "Semi-Marathon 40km",
      description:
        "Parcours de 40km balisé sur routes municipales, chemins et sentiers de Branca. Âge minimum: 14 ans. Une zone de ravitaillement.",
    },
    {
      language: "de" as const,
      name: "Halbmarathon 40km",
      description:
        "40km markierte Strecke über Gemeindestraßen, Feldwege und Trails von Branca. Mindestalter: 14 Jahre. Eine Verpflegungszone.",
    },
    {
      language: "it" as const,
      name: "Mezza Maratona 40km",
      description:
        "Percorso di 40km segnalato su strade comunali, strade sterrate e sentieri di Branca. Età minima: 14 anni. Una zona di ristoro.",
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

  // Variant 3: Almoço (Lunch)
  const almoco = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Almoço",
      price: 10.0,
      currency: "EUR",
    },
  });

  const almocoTranslations = [
    {
      language: "pt" as const,
      name: "Almoço",
      description: "Almoço de confraternização às 13:00.",
    },
    {
      language: "en" as const,
      name: "Lunch",
      description: "Fellowship lunch at 13:00.",
    },
    {
      language: "es" as const,
      name: "Almuerzo",
      description: "Almuerzo de confraternización a las 13:00.",
    },
    {
      language: "fr" as const,
      name: "Déjeuner",
      description: "Déjeuner convivial à 13:00.",
    },
    {
      language: "de" as const,
      name: "Mittagessen",
      description: "Geselliges Mittagessen um 13:00 Uhr.",
    },
    {
      language: "it" as const,
      name: "Pranzo",
      description: "Pranzo conviviale alle 13:00.",
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

  // Variant 4: Acompanhantes (Companions)
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
      description: "Inscrição para acompanhantes. Inclui direito ao almoço.",
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
      name: "1.ª Fase - Inscrição BTT",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-02-01T23:59:59.000Z"),
      price: 14.0,
      currency: "EUR" as const,
      note: "Preço Early Bird",
    },
    {
      name: "2.ª Fase - Inscrição BTT",
      startDate: new Date("2026-02-02T00:00:00.000Z"),
      endDate: new Date("2026-02-15T23:59:59.000Z"),
      price: 15.0,
      currency: "EUR" as const,
      note: "Preço normal",
    },
    {
      name: "3.ª Fase - Inscrição BTT",
      startDate: new Date("2026-02-16T00:00:00.000Z"),
      endDate: new Date("2026-02-26T23:59:59.000Z"),
      price: 16.0,
      currency: "EUR" as const,
      note: "Última fase de inscrições online",
    },
    {
      name: "Dia do Evento - Inscrição BTT",
      startDate: new Date("2026-03-01T00:00:00.000Z"),
      endDate: new Date("2026-03-01T09:00:00.000Z"),
      price: 20.0,
      currency: "EUR" as const,
      note: "Inscrição no dia do evento (sem direito a lembrança se classificado nos 3 primeiros)",
    },
    {
      name: "Almoço",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-02-26T23:59:59.000Z"),
      price: 10.0,
      currency: "EUR" as const,
      note: "Almoço de confraternização",
    },
    {
      name: "Almoço - Dia do Evento",
      startDate: new Date("2026-03-01T00:00:00.000Z"),
      endDate: new Date("2026-03-01T09:00:00.000Z"),
      price: 12.0,
      currency: "EUR" as const,
      note: "Almoço no dia do evento",
    },
    {
      name: "Acompanhantes",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-02-26T23:59:59.000Z"),
      price: 10.0,
      currency: "EUR" as const,
      note: "Inclui almoço",
    },
    {
      name: "Acompanhantes - Dia do Evento",
      startDate: new Date("2026-03-01T00:00:00.000Z"),
      endDate: new Date("2026-03-01T09:00:00.000Z"),
      price: 12.0,
      currency: "EUR" as const,
      note: "Inscrição de acompanhantes no dia do evento",
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
        "Sim, E-Bikes são permitidas em ambos os percursos (70km e 40km). Os participantes com E-Bike são classificados na categoria própria (E-Bikes), desde que existam no mínimo 10 participantes inscritos e classificados nesta categoria.",
      translations: {
        pt: {
          question: "Posso participar com E-Bike?",
          answer:
            "Sim, E-Bikes são permitidas em ambos os percursos (70km e 40km). Os participantes com E-Bike são classificados na categoria própria (E-Bikes), desde que existam no mínimo 10 participantes inscritos e classificados nesta categoria.",
        },
        en: {
          question: "Can I participate with an E-Bike?",
          answer:
            "Yes, E-Bikes are allowed on both routes (70km and 40km). E-Bike participants are ranked in their own category, provided there are at least 10 registered and classified participants in this category.",
        },
        es: {
          question: "¿Puedo participar con E-Bike?",
          answer:
            "Sí, las E-Bikes están permitidas en ambos recorridos (70km y 40km). Los participantes con E-Bike se clasifican en su propia categoría, siempre que haya al menos 10 inscritos y clasificados en esta categoría.",
        },
        fr: {
          question: "Puis-je participer avec un E-Bike?",
          answer:
            "Oui, les E-Bikes sont autorisés sur les deux parcours (70km et 40km). Les participants en E-Bike sont classés dans leur propre catégorie, à condition qu'il y ait au moins 10 inscrits et classés dans cette catégorie.",
        },
        de: {
          question: "Kann ich mit einem E-Bike teilnehmen?",
          answer:
            "Ja, E-Bikes sind auf beiden Strecken (70km und 40km) erlaubt. E-Bike-Teilnehmer werden in ihrer eigenen Kategorie gewertet, sofern mindestens 10 Teilnehmer in dieser Kategorie registriert und klassifiziert sind.",
        },
        it: {
          question: "Posso partecipare con una E-Bike?",
          answer:
            "Sì, le E-Bikes sono consentite su entrambi i percorsi (70km e 40km). I partecipanti con E-Bike sono classificati nella propria categoria, a condizione che ci siano almeno 10 iscritti e classificati in questa categoria.",
        },
      },
    },
    {
      order: 2,
      question: "Qual é a idade mínima para participar?",
      answer:
        "A idade mínima depende da distância: Maratona (70km) - 16 anos; Meia-Maratona (40km) - 14 anos. Participantes menores de 18 anos devem apresentar no dia do evento o termo de responsabilidade assinado pelo Encarregado de Educação.",
      translations: {
        pt: {
          question: "Qual é a idade mínima para participar?",
          answer:
            "A idade mínima depende da distância: Maratona (70km) - 16 anos; Meia-Maratona (40km) - 14 anos. Participantes menores de 18 anos devem apresentar no dia do evento o termo de responsabilidade assinado pelo Encarregado de Educação.",
        },
        en: {
          question: "What is the minimum age to participate?",
          answer:
            "The minimum age depends on the distance: Marathon (70km) - 16 years; Half-Marathon (40km) - 14 years. Participants under 18 must present a responsibility form signed by their parent/guardian on event day.",
        },
        es: {
          question: "¿Cuál es la edad mínima para participar?",
          answer:
            "La edad mínima depende de la distancia: Maratón (70km) - 16 años; Media Maratón (40km) - 14 años. Los participantes menores de 18 años deben presentar el formulario de responsabilidad firmado por su tutor el día del evento.",
        },
        fr: {
          question: "Quel est l'âge minimum pour participer?",
          answer:
            "L'âge minimum dépend de la distance: Marathon (70km) - 16 ans; Semi-Marathon (40km) - 14 ans. Les participants de moins de 18 ans doivent présenter le formulaire de responsabilité signé par leur tuteur le jour de l'événement.",
        },
        de: {
          question: "Was ist das Mindestalter für die Teilnahme?",
          answer:
            "Das Mindestalter hängt von der Distanz ab: Marathon (70km) - 16 Jahre; Halbmarathon (40km) - 14 Jahre. Teilnehmer unter 18 Jahren müssen am Veranstaltungstag eine von den Eltern unterschriebene Einverständniserklärung vorlegen.",
        },
        it: {
          question: "Qual è l'età minima per partecipare?",
          answer:
            "L'età minima dipende dalla distanza: Maratona (70km) - 16 anni; Mezza Maratona (40km) - 14 anni. I partecipanti under 18 devono presentare il modulo di responsabilità firmato dal genitore/tutore il giorno dell'evento.",
        },
      },
    },
    {
      order: 3,
      question: "Qual é o programa do evento?",
      answer:
        "07:30-08:30 Abertura do secretariado e entrega de dorsais; 08:00 Abertura do controlo zero; 08:45 Briefing final; 09:00 Início da Maratona (70km); 09:05 Início da Meia-Maratona (40km); 09:15 Início do Passeio Pedestre (8km); 12:30 Entrega de lembranças; 13:00 Almoço.",
      translations: {
        pt: {
          question: "Qual é o programa do evento?",
          answer:
            "07:30-08:30 Abertura do secretariado e entrega de dorsais; 08:00 Abertura do controlo zero; 08:45 Briefing final; 09:00 Início da Maratona (70km); 09:05 Início da Meia-Maratona (40km); 09:15 Início do Passeio Pedestre (8km); 12:30 Entrega de lembranças; 13:00 Almoço.",
        },
        en: {
          question: "What is the event schedule?",
          answer:
            "07:30-08:30 Registration desk opens and number collection; 08:00 Zero control opens; 08:45 Final briefing; 09:00 Marathon start (70km); 09:05 Half-Marathon start (40km); 09:15 Walking tour start (8km); 12:30 Prize giving; 13:00 Lunch.",
        },
        es: {
          question: "¿Cuál es el programa del evento?",
          answer:
            "07:30-08:30 Apertura de secretaría y entrega de dorsales; 08:00 Apertura del control cero; 08:45 Briefing final; 09:00 Inicio Maratón (70km); 09:05 Inicio Media Maratón (40km); 09:15 Inicio Paseo Peatonal (8km); 12:30 Entrega de recuerdos; 13:00 Almuerzo.",
        },
        fr: {
          question: "Quel est le programme de l'événement?",
          answer:
            "07:30-08:30 Ouverture du secrétariat et retrait des dossards; 08:00 Ouverture du contrôle zéro; 08:45 Briefing final; 09:00 Départ Marathon (70km); 09:05 Départ Semi-Marathon (40km); 09:15 Départ Randonnée (8km); 12:30 Remise des prix; 13:00 Déjeuner.",
        },
        de: {
          question: "Wie sieht das Programm der Veranstaltung aus?",
          answer:
            "07:30-08:30 Eröffnung des Sekretariats und Startnummernausgabe; 08:00 Eröffnung der Nullkontrolle; 08:45 Abschlussbriefing; 09:00 Start Marathon (70km); 09:05 Start Halbmarathon (40km); 09:15 Start Wanderung (8km); 12:30 Preisverleihung; 13:00 Mittagessen.",
        },
        it: {
          question: "Qual è il programma dell'evento?",
          answer:
            "07:30-08:30 Apertura segreteria e ritiro pettorali; 08:00 Apertura controllo zero; 08:45 Briefing finale; 09:00 Partenza Maratona (70km); 09:05 Partenza Mezza Maratona (40km); 09:15 Partenza Passeggiata (8km); 12:30 Premiazioni; 13:00 Pranzo.",
        },
      },
    },
    {
      order: 4,
      question: "É obrigatório usar capacete?",
      answer:
        "Sim, é obrigatório usar capacete homologado para BTT ou Gravel, devidamente colocado durante todo o percurso. Sem capacete ou dorsal não é permitida a entrada na zona de partida. A organização pode obrigar a parar para corrigir a posição do capacete.",
      translations: {
        pt: {
          question: "É obrigatório usar capacete?",
          answer:
            "Sim, é obrigatório usar capacete homologado para BTT ou Gravel, devidamente colocado durante todo o percurso. Sem capacete ou dorsal não é permitida a entrada na zona de partida. A organização pode obrigar a parar para corrigir a posição do capacete.",
        },
        en: {
          question: "Is wearing a helmet mandatory?",
          answer:
            "Yes, wearing an approved BTT or Gravel helmet is mandatory, properly placed throughout the route. Entry to the start zone is not allowed without a helmet or race number. The organization may require you to stop to adjust your helmet.",
        },
        es: {
          question: "¿Es obligatorio usar casco?",
          answer:
            "Sí, es obligatorio usar casco homologado para BTT o Gravel, correctamente colocado durante todo el recorrido. Sin casco o dorsal no se permite la entrada a la zona de salida. La organización puede obligar a parar para corregir la posición del casco.",
        },
        fr: {
          question: "Le port du casque est-il obligatoire?",
          answer:
            "Oui, le port d'un casque homologué VTT ou Gravel est obligatoire, correctement placé pendant tout le parcours. L'entrée dans la zone de départ n'est pas autorisée sans casque ni dossard. L'organisation peut exiger l'arrêt pour ajuster le casque.",
        },
        de: {
          question: "Ist das Tragen eines Helms Pflicht?",
          answer:
            "Ja, das Tragen eines zugelassenen MTB- oder Gravel-Helms ist Pflicht, korrekt platziert während der gesamten Strecke. Ohne Helm oder Startnummer ist der Zutritt zum Startbereich nicht gestattet. Die Organisation kann zum Anhalten auffordern, um den Helm zu korrigieren.",
        },
        it: {
          question: "È obbligatorio indossare il casco?",
          answer:
            "Sì, è obbligatorio indossare un casco omologato per BTT o Gravel, correttamente posizionato per tutto il percorso. Senza casco o pettorale non è consentito l'accesso alla zona di partenza. L'organizzazione può richiedere la fermata per regolare il casco.",
        },
      },
    },
    {
      order: 5,
      question: "É obrigatório GPS na Maratona 70km?",
      answer:
        "Sim, os participantes inscritos na Maratona (70km) devem obrigatoriamente possuir um GPS que lhes permita seguir o percurso. Os tracks GPS serão disponibilizados no site oficial das inscrições. A Meia-Maratona (40km) estará marcada no terreno. No final, poderá ser verificado o percurso efetuado através dos dados do GPS.",
      translations: {
        pt: {
          question: "É obrigatório GPS na Maratona 70km?",
          answer:
            "Sim, os participantes inscritos na Maratona (70km) devem obrigatoriamente possuir um GPS que lhes permita seguir o percurso. Os tracks GPS serão disponibilizados no site oficial das inscrições. A Meia-Maratona (40km) estará marcada no terreno. No final, poderá ser verificado o percurso efetuado através dos dados do GPS.",
        },
        en: {
          question: "Is GPS mandatory for the 70km Marathon?",
          answer:
            "Yes, participants registered for the Marathon (70km) must have a GPS device to follow the route. GPS tracks will be available on the official registration website. The Half-Marathon (40km) will be marked on the ground. At the finish, the route taken may be verified via GPS data.",
        },
        es: {
          question: "¿Es obligatorio GPS en la Maratón de 70km?",
          answer:
            "Sí, los participantes inscritos en la Maratón (70km) deben tener obligatoriamente un GPS para seguir el recorrido. Los tracks GPS estarán disponibles en el sitio oficial de inscripciones. La Media Maratón (40km) estará señalizada en el terreno. Al final, se podrá verificar el recorrido realizado mediante los datos del GPS.",
        },
        fr: {
          question: "Le GPS est-il obligatoire pour le Marathon 70km?",
          answer:
            "Oui, les participants inscrits au Marathon (70km) doivent obligatoirement posséder un GPS pour suivre le parcours. Les traces GPS seront disponibles sur le site officiel des inscriptions. Le Semi-Marathon (40km) sera balisé sur le terrain. À l'arrivée, le parcours effectué pourra être vérifié via les données GPS.",
        },
        de: {
          question: "Ist GPS für den 70km Marathon Pflicht?",
          answer:
            "Ja, Teilnehmer des Marathons (70km) müssen zwingend ein GPS-Gerät besitzen, um der Strecke zu folgen. Die GPS-Tracks werden auf der offiziellen Anmeldeseite bereitgestellt. Der Halbmarathon (40km) wird am Boden markiert sein. Am Ende kann die gefahrene Strecke über GPS-Daten überprüft werden.",
        },
        it: {
          question: "Il GPS è obbligatorio per la Maratona 70km?",
          answer:
            "Sì, i partecipanti iscritti alla Maratona (70km) devono obbligatoriamente possedere un GPS per seguire il percorso. Le tracce GPS saranno disponibili sul sito ufficiale delle iscrizioni. La Mezza Maratona (40km) sarà segnalata sul terreno. Al termine, il percorso effettuato potrà essere verificato tramite i dati GPS.",
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
🎉 16.ª Maratona BTT Já T'Agarro 2026 seeded successfully!
   📍 Event: 16.ª Maratona BTT Já T'Agarro
   🔗 Slug: ${event.slug}
   📅 Date: 2026-03-01
   📍 Location: Largo da Liberdade, Branca, Coruche, Santarém
   🚴 Variants: Maratona 70km, Meia-Maratona 40km, Almoço, Acompanhantes
   💰 Pricing: 8 phases (3 inscrição + dia evento + almoço + acompanhantes)
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
