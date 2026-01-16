/**
 * Seed: Passeio de BTT - Terras de Oiá 2026
 * Complete with translations in all 6 languages
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding Passeio de BTT - Terras de Oiá 2026...");

  const eventSlug = "passeio-btt-terras-oia-2026";

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "Passeio de BTT - Terras de Oiá 2026",
      description: `Passeio de BTT na região de Oiã, Oliveira do Bairro. Dois percursos disponíveis: 30km e 40km.`,
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-07-25T09:00:00.000Z"),
      endDate: null,
      city: "Oiã",
      country: "Portugal",
      latitude: 40.5622,
      longitude: -8.5561,
      googleMapsUrl: null,
      externalUrl: "https://meutempo.pt/prova?btt-terras-oia-2026",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-04-30T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "Passeio de BTT - Terras de Oiá 2026",
      description: `Passeio de BTT na região de Oiã, Oliveira do Bairro. Dois percursos disponíveis: 30km e 40km.`,
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-07-25T09:00:00.000Z"),
      endDate: null,
      city: "Oiã",
      country: "Portugal",
      latitude: 40.5622,
      longitude: -8.5561,
      googleMapsUrl: null,
      externalUrl: "https://meutempo.pt/prova?btt-terras-oia-2026",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-04-30T23:59:59.000Z"),
    },
  });

  console.log(`✅ Event upserted: ${event.slug} (ID: ${event.id})`);

  // Step 2: Upsert translations separately (ALL 6 LANGUAGES)
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
      title: "Passeio de BTT - Terras de Oiá 2026",
      description: `# 🚵 Passeio de BTT - Terras de Oiá 2026

Bem-vindo ao **Passeio de BTT - Terras de Oiá 2026**, um evento de BTT na belíssima região de Oiã, Oliveira do Bairro!

## 📅 Data e Localização

- **Data**: 25 de Julho de 2026
- **Hora de Partida**: 09:00
- **Local**: Oiã, Oliveira do Bairro, Portugal

## 🚴 Percursos Disponíveis

Escolhe o teu desafio:

- **Passeio BTT 30km**: Percurso de 30 quilómetros para todos os níveis - 6,00€
- **Passeio BTT 40km**: Percurso de 40 quilómetros para ciclistas mais experientes - 7,00€
- **Almoço**: Opção de refeição após o passeio - 7,00€

## 💶 Inscrições e Preços

- **Inscrições Abertas**: 1 de Janeiro de 2026
- **Prazo de Inscrição**: 30 de Abril de 2026
- **Link de Inscrição**: [meutempo.pt](https://meutempo.pt/prova?btt-terras-oia-2026)

## 🏆 Organização

- **Organização**: Associação Jovem Oianense (Lesmas Bike)
- **Patrocinador Principal**: Município de Oliveira do Bairro
- **Apoio**: Junta de Freguesia de Oiã

Participa neste fantástico passeio pelas magníficas terras de Oiã! 🌳🚵‍♂️`,
      city: "Oiã",
      metaTitle: "Passeio de BTT - Terras de Oiá 2026 | BTT em Oiã",
      metaDescription:
        "Passeio de BTT em Oiã, Oliveira do Bairro. Percursos de 30km e 40km. Inscrições de 1 de Janeiro a 30 de Abril de 2026.",
    },
    {
      language: "en",
      title: "MTB Ride - Terras de Oiá 2026",
      description: `# 🚵 MTB Ride - Terras de Oiá 2026

Welcome to the **MTB Ride - Terras de Oiá 2026**, a mountain biking event in the beautiful region of Oiã, Oliveira do Bairro!

## 📅 Date and Location

- **Date**: July 25, 2026
- **Start Time**: 09:00
- **Location**: Oiã, Oliveira do Bairro, Portugal

## 🚴 Available Routes

Choose your challenge:

- **MTB Ride 30km**: 30-kilometer route for all levels - €6.00
- **MTB Ride 40km**: 40-kilometer route for more experienced cyclists - €7.00
- **Lunch**: Meal option after the ride - €7.00

## 💶 Registration and Prices

- **Registration Opens**: January 1, 2026
- **Registration Deadline**: April 30, 2026
- **Registration Link**: [meutempo.pt](https://meutempo.pt/prova?btt-terras-oia-2026)

## 🏆 Organization

- **Organized by**: Associação Jovem Oianense (Lesmas Bike)
- **Main Sponsor**: Municipality of Oliveira do Bairro
- **Support**: Parish Council of Oiã

Join us for this fantastic ride through the magnificent lands of Oiã! 🌳🚵‍♂️`,
      city: "Oiã",
      metaTitle: "MTB Ride - Terras de Oiá 2026 | Mountain Biking in Oiã",
      metaDescription:
        "MTB ride in Oiã, Oliveira do Bairro. Routes of 30km and 40km. Registration from January 1 to April 30, 2026.",
    },
    {
      language: "es",
      title: "Paseo en BTT - Terras de Oiá 2026",
      description: `# 🚵 Paseo en BTT - Terras de Oiá 2026

¡Bienvenido al **Paseo en BTT - Terras de Oiá 2026**, un evento de ciclismo de montaña en la hermosa región de Oiã, Oliveira do Bairro!

## 📅 Fecha y Ubicación

- **Fecha**: 25 de julio de 2026
- **Hora de Salida**: 09:00
- **Lugar**: Oiã, Oliveira do Bairro, Portugal

## 🚴 Rutas Disponibles

Elige tu desafío:

- **Paseo BTT 30km**: Ruta de 30 kilómetros para todos los niveles - 6,00€
- **Paseo BTT 40km**: Ruta de 40 kilómetros para ciclistas más experimentados - 7,00€
- **Almuerzo**: Opción de comida después del paseo - 7,00€

## 💶 Inscripciones y Precios

- **Apertura de Inscripciones**: 1 de enero de 2026
- **Fecha Límite de Inscripción**: 30 de abril de 2026
- **Enlace de Inscripción**: [meutempo.pt](https://meutempo.pt/prova?btt-terras-oia-2026)

## 🏆 Organización

- **Organización**: Associação Jovem Oianense (Lesmas Bike)
- **Patrocinador Principal**: Municipio de Oliveira do Bairro
- **Apoyo**: Junta de Freguesia de Oiã

¡Participa en este fantástico paseo por las magníficas tierras de Oiã! 🌳🚵‍♂️`,
      city: "Oiã",
      metaTitle: "Paseo en BTT - Terras de Oiá 2026 | BTT en Oiã",
      metaDescription:
        "Paseo en BTT en Oiã, Oliveira do Bairro. Rutas de 30km y 40km. Inscripciones del 1 de enero al 30 de abril de 2026.",
    },
    {
      language: "fr",
      title: "Randonnée VTT - Terras de Oiá 2026",
      description: `# 🚵 Randonnée VTT - Terras de Oiá 2026

Bienvenue à la **Randonnée VTT - Terras de Oiá 2026**, un événement de VTT dans la magnifique région d'Oiã, Oliveira do Bairro !

## 📅 Date et Lieu

- **Date** : 25 juillet 2026
- **Heure de Départ** : 09h00
- **Lieu** : Oiã, Oliveira do Bairro, Portugal

## 🚴 Parcours Disponibles

Choisissez votre défi :

- **Randonnée VTT 30km** : Parcours de 30 kilomètres pour tous les niveaux - 6,00€
- **Randonnée VTT 40km** : Parcours de 40 kilomètres pour cyclistes plus expérimentés - 7,00€
- **Déjeuner** : Option repas après la randonnée - 7,00€

## 💶 Inscriptions et Prix

- **Ouverture des Inscriptions** : 1er janvier 2026
- **Date Limite d'Inscription** : 30 avril 2026
- **Lien d'Inscription** : [meutempo.pt](https://meutempo.pt/prova?btt-terras-oia-2026)

## 🏆 Organisation

- **Organisé par** : Associação Jovem Oianense (Lesmas Bike)
- **Sponsor Principal** : Municipalité d'Oliveira do Bairro
- **Soutien** : Conseil Paroissial d'Oiã

Rejoignez-nous pour cette fantastique randonnée à travers les magnifiques terres d'Oiã ! 🌳🚵‍♂️`,
      city: "Oiã",
      metaTitle: "Randonnée VTT - Terras de Oiá 2026 | VTT à Oiã",
      metaDescription:
        "Randonnée VTT à Oiã, Oliveira do Bairro. Parcours de 30km et 40km. Inscriptions du 1er janvier au 30 avril 2026.",
    },
    {
      language: "de",
      title: "MTB-Tour - Terras de Oiá 2026",
      description: `# 🚵 MTB-Tour - Terras de Oiá 2026

Willkommen zur **MTB-Tour - Terras de Oiá 2026**, einer Mountainbike-Veranstaltung in der wunderschönen Region Oiã, Oliveira do Bairro!

## 📅 Datum und Ort

- **Datum**: 25. Juli 2026
- **Startzeit**: 09:00 Uhr
- **Ort**: Oiã, Oliveira do Bairro, Portugal

## 🚴 Verfügbare Strecken

Wählen Sie Ihre Herausforderung:

- **MTB-Tour 30km**: 30-Kilometer-Strecke für alle Niveaus - 6,00€
- **MTB-Tour 40km**: 40-Kilometer-Strecke für erfahrenere Radfahrer - 7,00€
- **Mittagessen**: Mahlzeitenoption nach der Tour - 7,00€

## 💶 Anmeldung und Preise

- **Anmeldung Öffnet**: 1. Januar 2026
- **Anmeldeschluss**: 30. April 2026
- **Anmeldelink**: [meutempo.pt](https://meutempo.pt/prova?btt-terras-oia-2026)

## 🏆 Organisation

- **Veranstalter**: Associação Jovem Oianense (Lesmas Bike)
- **Hauptsponsor**: Gemeinde Oliveira do Bairro
- **Unterstützung**: Gemeindeverwaltung von Oiã

Nehmen Sie an dieser fantastischen Tour durch die herrlichen Landschaften von Oiã teil! 🌳🚵‍♂️`,
      city: "Oiã",
      metaTitle: "MTB-Tour - Terras de Oiá 2026 | MTB in Oiã",
      metaDescription:
        "MTB-Tour in Oiã, Oliveira do Bairro. Strecken von 30km und 40km. Anmeldung vom 1. Januar bis 30. April 2026.",
    },
    {
      language: "it",
      title: "Escursione MTB - Terras de Oiá 2026",
      description: `# 🚵 Escursione MTB - Terras de Oiá 2026

Benvenuti all'**Escursione MTB - Terras de Oiá 2026**, un evento di mountain bike nella splendida regione di Oiã, Oliveira do Bairro!

## 📅 Data e Luogo

- **Data**: 25 luglio 2026
- **Orario di Partenza**: 09:00
- **Luogo**: Oiã, Oliveira do Bairro, Portogallo

## 🚴 Percorsi Disponibili

Scegli la tua sfida:

- **Escursione MTB 30km**: Percorso di 30 chilometri per tutti i livelli - 6,00€
- **Escursione MTB 40km**: Percorso di 40 chilometri per ciclisti più esperti - 7,00€
- **Pranzo**: Opzione pasto dopo l'escursione - 7,00€

## 💶 Iscrizioni e Prezzi

- **Apertura Iscrizioni**: 1 gennaio 2026
- **Scadenza Iscrizioni**: 30 aprile 2026
- **Link Iscrizione**: [meutempo.pt](https://meutempo.pt/prova?btt-terras-oia-2026)

## 🏆 Organizzazione

- **Organizzato da**: Associação Jovem Oianense (Lesmas Bike)
- **Sponsor Principale**: Comune di Oliveira do Bairro
- **Supporto**: Consiglio Parrocchiale di Oiã

Partecipa a questa fantastica escursione attraverso le magnifiche terre di Oiã! 🌳🚵‍♂️`,
      city: "Oiã",
      metaTitle: "Escursione MTB - Terras de Oiá 2026 | MTB a Oiã",
      metaDescription:
        "Escursione MTB a Oiã, Oliveira do Bairro. Percorsi di 30km e 40km. Iscrizioni dal 1 gennaio al 30 aprile 2026.",
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
    "✅ Event translations upserted for 6 languages (pt, en, es, fr, de, it)"
  );

  // Step 3: Find or create variants
  const variants = [
    {
      name: "Passeio BTT 30km",
      distanceKm: 30,
      price: 6.0,
      startTime: "09:00",
    },
    {
      name: "Passeio BTT 40km",
      distanceKm: 40,
      price: 7.0,
      startTime: "09:00",
    },
    {
      name: "Almoço",
      distanceKm: 0,
      price: 7.0,
      startTime: "09:00",
    },
  ];

  for (const variantData of variants) {
    const existing = await prisma.eventVariant.findFirst({
      where: {
        eventId: event.id,
        name: variantData.name,
      },
    });

    let variant;
    if (existing) {
      variant = await prisma.eventVariant.update({
        where: { id: existing.id },
        data: {
          distanceKm: variantData.distanceKm,
          price: variantData.price,
          startTime: variantData.startTime,
        },
      });
    } else {
      variant = await prisma.eventVariant.create({
        data: {
          eventId: event.id,
          name: variantData.name,
          distanceKm: variantData.distanceKm,
          price: variantData.price,
          startTime: variantData.startTime,
        },
      });
    }

    console.log(
      `✅ Variant ${existing ? "updated" : "created"}: ${variant.name}`
    );
  }

  console.log("");
  console.log("🎉 Passeio de BTT - Terras de Oiá 2026 seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
