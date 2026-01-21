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
      title: "4º Passeio de BTT - Terras de Oiã",
      description: `4º Passeio de BTT pela região de Oiã, Oliveira do Bairro. Dois percursos: 30km (240 D+) e 40km (520 D+), ambos com dificuldade média. Percursos pelas zonas ribeirinhas da Pateira de Fermentelos e Rota das Cegonhas.`,
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-07-25T09:00:00.000Z"),
      endDate: null,
      city: "Oiã",
      country: "Portugal",
      latitude: 40.5450891120532,
      longitude: -8.539921215760666,
      googleMapsUrl: "https://maps.app.goo.gl/PYkP9iefUdyLEGEu5",
      externalUrl: "https://meutempo.pt/prova?btt-terras-oia-2026",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-07-24T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "4º Passeio de BTT - Terras de Oiã",
      description: `4º Passeio de BTT pela região de Oiã, Oliveira do Bairro. Dois percursos: 30km (240 D+) e 40km (520 D+), ambos com dificuldade média. Percursos pelas zonas ribeirinhas da Pateira de Fermentelos e Rota das Cegonhas.`,
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-07-25T09:00:00.000Z"),
      endDate: null,
      city: "Oiã",
      country: "Portugal",
      latitude: 40.5450891120532,
      longitude: -8.539921215760666,
      googleMapsUrl: "https://maps.app.goo.gl/PYkP9iefUdyLEGEu5",
      externalUrl: "https://meutempo.pt/prova?btt-terras-oia-2026",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-07-24T23:59:59.000Z"),
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
      title: "4º Passeio de BTT - Terras de Oiã",
      description: `# 🚵 4º Passeio de BTT - Terras de Oiã

Bem-vindo ao **4º Passeio de BTT - Terras de Oiã**, que se realiza no dia **25 de julho de 2026**!

## 📅 Data e Localização

- **Data**: 25 de Julho de 2026
- **Hora de Partida**: 09:00
- **Local de Partida**: Parque Verde da Vila de Oiã (junto à Junta de Freguesia de Oiã)
- **Cidade**: Oiã, Oliveira do Bairro, Portugal

## 🚴 Percursos Disponíveis

Escolhe o teu desafio - ambos com **dificuldade média**:

### Percurso Longo (40 km)
- **Distância**: Aproximadamente 40 km
- **Desnível Acumulado**: 520 D+
- **Inscrição**: 7,00€

### Percurso Curto (30 km)
- **Distância**: Cerca de 30 km
- **Desnível Acumulado**: 240 D+
- **Inscrição**: 6,00€

### Almoço (Opcional)
- **Preço**: 7,00€

## 🗺️ Sobre o Percurso

O passeio desenvolve-se pelas **zonas ribeirinhas da Pateira de Fermentelos**, a **maior lagoa natural da Península Ibérica**, reconhecida a nível local, regional, nacional e internacional.

O percurso faz ainda ligação à **Rota das Cegonhas (PR1 OLB)**, que segue paralela ao Rio Cértima, proporcionando um belo trajeto por campos de arroz onde cegonhas e garças realizam voos rasantes.

### Características Técnicas:
- Percurso devidamente marcado com fitas
- Disponibilização em formato GPX
- Single tracks desafiantes
- Final com sucessivos sobe e desce para os mais resistentes

Este percurso pretende sensibilizar para a **importância da preservação dos habitats naturais**, especialmente para aves como cegonhas e garças.

## 💶 Inscrições

- **Prazo de Inscrição**: Até 24 de Julho de 2026
- **Link de Inscrição**: [meutempo.pt](https://meutempo.pt/prova?btt-terras-oia-2026)

## 🏆 Organização

- **Organização**: Associação Jovem Oianense (Lesmas Bike)
- **Patrocinador Principal**: Município de Oliveira do Bairro
- **Apoio**: Junta de Freguesia de Oiã

Participa neste fantástico passeio pelas magníficas terras de Oiã e pela maior lagoa natural da Península Ibérica! 🌳🚵‍♂️`,
      city: "Oiã",
      metaTitle: "4º Passeio de BTT - Terras de Oiã 2026 | BTT em Oiã",
      metaDescription:
        "4º Passeio de BTT em Oiã, Oliveira do Bairro. Percursos de 30km (240 D+) e 40km (520 D+) pela Pateira de Fermentelos e Rota das Cegonhas. 25 de Julho de 2026.",
    },
    {
      language: "en",
      title: "4th MTB Ride - Terras de Oiã",
      description: `# 🚵 4th MTB Ride - Terras de Oiã

Welcome to the **4th MTB Ride - Terras de Oiã**, taking place on **July 25, 2026**!

## 📅 Date and Location

- **Date**: July 25, 2026
- **Start Time**: 09:00
- **Start Location**: Parque Verde da Vila de Oiã (next to Oiã Parish Council)
- **City**: Oiã, Oliveira do Bairro, Portugal

## 🚴 Available Routes

Choose your challenge - both with **medium difficulty**:

### Long Route (40 km)
- **Distance**: Approximately 40 km
- **Elevation Gain**: 520 D+
- **Registration**: €7.00

### Short Route (30 km)
- **Distance**: Around 30 km
- **Elevation Gain**: 240 D+
- **Registration**: €6.00

### Lunch (Optional)
- **Price**: €7.00

## 🗺️ About the Route

The ride takes place through the **riverside areas of Pateira de Fermentelos**, the **largest natural lagoon in the Iberian Peninsula**, recognized locally, regionally, nationally, and internationally.

The route also connects to the **Storks Route (PR1 OLB)**, running parallel to the Cértima River, offering a beautiful path through rice fields where storks and herons perform low flights.

### Technical Features:
- Route properly marked with ribbons
- Available in GPX format
- Challenging single tracks
- Finish with successive ups and downs for the most resistant

This route aims to raise awareness about the **importance of preserving natural habitats**, especially for birds like storks and herons.

## 💶 Registration

- **Registration Deadline**: Until July 24, 2026
- **Registration Link**: [meutempo.pt](https://meutempo.pt/prova?btt-terras-oia-2026)

## 🏆 Organization

- **Organized by**: Associação Jovem Oianense (Lesmas Bike)
- **Main Sponsor**: Municipality of Oliveira do Bairro
- **Support**: Parish Council of Oiã

Join us for this fantastic ride through the magnificent lands of Oiã and the largest natural lagoon in the Iberian Peninsula! 🌳🚵‍♂️`,
      city: "Oiã",
      metaTitle: "4th MTB Ride - Terras de Oiã 2026 | Mountain Biking in Oiã",
      metaDescription:
        "4th MTB ride in Oiã, Oliveira do Bairro. Routes of 30km (240 D+) and 40km (520 D+) through Pateira de Fermentelos and Storks Route. July 25, 2026.",
    },
    {
      language: "es",
      title: "4º Paseo en BTT - Terras de Oiã",
      description: `# 🚵 4º Paseo en BTT - Terras de Oiã

¡Bienvenido al **4º Paseo en BTT - Terras de Oiã**, que se realiza el **25 de julio de 2026**!

## 📅 Fecha y Ubicación

- **Fecha**: 25 de julio de 2026
- **Hora de Salida**: 09:00
- **Lugar de Salida**: Parque Verde da Vila de Oiã (junto al Ayuntamiento de Oiã)
- **Ciudad**: Oiã, Oliveira do Bairro, Portugal

## 🚴 Rutas Disponibles

Elige tu desafío - ambos con **dificultad media**:

### Ruta Larga (40 km)
- **Distancia**: Aproximadamente 40 km
- **Desnivel Acumulado**: 520 D+
- **Inscripción**: 7,00€

### Ruta Corta (30 km)
- **Distancia**: Alrededor de 30 km
- **Desnivel Acumulado**: 240 D+
- **Inscripción**: 6,00€

### Almuerzo (Opcional)
- **Precio**: 7,00€

## 🗺️ Sobre la Ruta

El paseo se desarrolla por las **zonas ribereñas de Pateira de Fermentelos**, la **mayor laguna natural de la Península Ibérica**, reconocida a nivel local, regional, nacional e internacional.

La ruta también conecta con la **Ruta de las Cigüeñas (PR1 OLB)**, que discurre paralela al Río Cértima, ofreciendo un hermoso trayecto por campos de arroz donde cigüeñas y garzas realizan vuelos rasantes.

### Características Técnicas:
- Ruta debidamente señalizada con cintas
- Disponible en formato GPX
- Single tracks desafiantes
- Final con sucesivos sube y baja para los más resistentes

Esta ruta pretende concienciar sobre la **importancia de preservar los hábitats naturales**, especialmente para aves como cigüeñas y garzas.

## 💶 Inscripciones

- **Plazo de Inscripción**: Hasta el 24 de julio de 2026
- **Enlace de Inscripción**: [meutempo.pt](https://meutempo.pt/prova?btt-terras-oia-2026)

## 🏆 Organización

- **Organización**: Associação Jovem Oianense (Lesmas Bike)
- **Patrocinador Principal**: Municipio de Oliveira do Bairro
- **Apoyo**: Junta de Freguesia de Oiã

¡Participa en este fantástico paseo por las magníficas tierras de Oiã y la mayor laguna natural de la Península Ibérica! 🌳🚵‍♂️`,
      city: "Oiã",
      metaTitle: "4º Paseo en BTT - Terras de Oiã 2026 | BTT en Oiã",
      metaDescription:
        "4º Paseo en BTT en Oiã, Oliveira do Bairro. Rutas de 30km (240 D+) y 40km (520 D+) por Pateira de Fermentelos y Ruta de las Cigüeñas. 25 de julio de 2026.",
    },
    {
      language: "fr",
      title: "4ème Randonnée VTT - Terras de Oiã",
      description: `# 🚵 4ème Randonnée VTT - Terras de Oiã

Bienvenue à la **4ème Randonnée VTT - Terras de Oiã**, qui se déroule le **25 juillet 2026** !

## 📅 Date et Lieu

- **Date** : 25 juillet 2026
- **Heure de Départ** : 09h00
- **Lieu de Départ** : Parque Verde da Vila de Oiã (près du Conseil Paroissial d'Oiã)
- **Ville** : Oiã, Oliveira do Bairro, Portugal

## 🚴 Parcours Disponibles

Choisissez votre défi - tous deux avec **difficulté moyenne** :

### Parcours Long (40 km)
- **Distance** : Environ 40 km
- **Dénivelé Cumulé** : 520 D+
- **Inscription** : 7,00€

### Parcours Court (30 km)
- **Distance** : Environ 30 km
- **Dénivelé Cumulé** : 240 D+
- **Inscription** : 6,00€

### Déjeuner (Optionnel)
- **Prix** : 7,00€

## 🗺️ À Propos du Parcours

La randonnée se déroule dans les **zones riveraines de Pateira de Fermentelos**, le **plus grand lagon naturel de la Péninsule Ibérique**, reconnu localement, régionalement, nationalement et internationalement.

Le parcours fait également la liaison avec la **Route des Cigognes (PR1 OLB)**, qui suit parallèlement la rivière Cértima, offrant un magnifique trajet à travers des rizières où cigognes et hérons effectuent des vols rasants.

### Caractéristiques Techniques :
- Parcours bien balisé avec des rubans
- Disponible au format GPX
- Single tracks challengeants
- Fin avec montées et descentes successives pour les plus résistants

Ce parcours vise à sensibiliser à **l'importance de la préservation des habitats naturels**, en particulier pour les oiseaux comme les cigognes et les hérons.

## 💶 Inscriptions

- **Date Limite d'Inscription** : Jusqu'au 24 juillet 2026
- **Lien d'Inscription** : [meutempo.pt](https://meutempo.pt/prova?btt-terras-oia-2026)

## 🏆 Organisation

- **Organisé par** : Associação Jovem Oianense (Lesmas Bike)
- **Sponsor Principal** : Municipalité d'Oliveira do Bairro
- **Soutien** : Conseil Paroissial d'Oiã

Rejoignez-nous pour cette fantastique randonnée à travers les magnifiques terres d'Oiã et le plus grand lagon naturel de la Péninsule Ibérique ! 🌳🚵‍♂️`,
      city: "Oiã",
      metaTitle: "4ème Randonnée VTT - Terras de Oiã 2026 | VTT à Oiã",
      metaDescription:
        "4ème Randonnée VTT à Oiã, Oliveira do Bairro. Parcours de 30km (240 D+) et 40km (520 D+) par Pateira de Fermentelos et Route des Cigognes. 25 juillet 2026.",
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
