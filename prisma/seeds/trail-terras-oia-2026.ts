/**
 * Seed: Trail Terras de Oiá 2026
 * Complete with translations in all 6 languages
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌲 Seeding Trail Terras de Oiá 2026...");

  const eventSlug = "trail-terras-oia-2026";

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "Trail Terras de Oiá 2026",
      description: `Trail running na região de Oiã, Oliveira do Bairro. Cinco percursos disponíveis: Trail Longo 24km, Trail Curto 16km, Mini Trail 8km, Kids Trail 1km (gratuito) e Caminhada 8km.`,
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-07-26T09:00:00.000Z"),
      endDate: null,
      city: "Oiã",
      country: "Portugal",
      latitude: 40.5450891120532,
      longitude: -8.539921215760666,
      googleMapsUrl: "https://maps.app.goo.gl/PYkP9iefUdyLEGEu5",
      externalUrl: "https://meutempo.pt/prova?trail-terras-oia-2026",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-03-31T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "Trail Terras de Oiá 2026",
      description: `Trail running na região de Oiã, Oliveira do Bairro. Cinco percursos disponíveis: Trail Longo 24km, Trail Curto 16km, Mini Trail 8km, Kids Trail 1km (gratuito) e Caminhada 8km.`,
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-07-26T09:00:00.000Z"),
      endDate: null,
      city: "Oiã",
      country: "Portugal",
      latitude: 40.5450891120532,
      longitude: -8.539921215760666,
      googleMapsUrl: "https://maps.app.goo.gl/PYkP9iefUdyLEGEu5",
      externalUrl: "https://meutempo.pt/prova?trail-terras-oia-2026",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-03-31T23:59:59.000Z"),
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
      title: "Trail Terras de Oiá 2026",
      description: `# 🌲 Trail Terras de Oiá 2026

Bem-vindos ao **Trail Terras de Oiá 2026**, um evento de trail running na deslumbrante região de Oiã, Oliveira do Bairro! Esta é uma oportunidade única para explorar os trilhos naturais desta bela zona enquanto desafias os teus limites.

## 📅 Data e Local

**Data:** 26 de Julho de 2026  
**Hora de Início:** 09:00  
**Local:** Oiã (Terras de Oiá), Oliveira do Bairro, Portugal

## 🏃 Variantes do Evento

O Trail Terras de Oiá oferece opções para todos os níveis:

- **Trail Longo 24km** - Para os mais experientes (09:00) - 8,00€
- **Trail Curto 16km** - Desafio intermédio (09:00) - 6,00€
- **Mini Trail 8km** - Perfeito para iniciantes (09:30) - 6,00€
- **Kids Trail 1km** - Para os mais pequenos (10:00) - **GRATUITO**
- **Caminhada 8km** - Passeio pedestre (09:30) - 6,00€

## 📝 Inscrições

**Período de Inscrição:** 1 de Janeiro a 31 de Março de 2026  
**Preços:** De 0€ (Kids Trail) a 8€ (Trail Longo)

Inscreve-te em: [meutempo.pt](https://meutempo.pt/prova?trail-terras-oia-2026)

## 🎁 Kit de Participação

Todos os participantes recebem:
- 🏅 Medalha de Finisher
- 🎽 Dorsal
- ⏱️ Chip de Cronometragem
- 🛡️ Seguro Desportivo
- 🚿 Balneários e Duches
- 💆 Massagens
- 🍎 Abastecimentos
- E muito mais!

## 🍽️ Opções de Refeição

**Opção 1:** T-shirt Técnica + Saco

**Opção 2:** Almoço Completo incluindo:
- Caldo Verde
- Feijoada de Porco
- Grelhado Misto
- Pizza
- Frango Grelhado
- Bifanas
- Fruta
- Bebidas
- E muito mais!

## 🏆 Prémios

- 🥇 Prémios para os melhores classificados do trail
- 👥 Prémios para as melhores equipas
- 📊 Prémios para as equipas com mais inscritos
- 🎉 Outros prémios da organização

## 👥 Organização

**Organizadores:** Associação Jovem Oianense, Lesmas Bike

**Patrocinadores Principais:**
- Município de Oliveira do Bairro
- Junta de Freguesia de Oiã
- IPDJ - Instituto Português do Desporto e Juventude, I.P.
- Região de Aveiro
- Associação Ciclismo da Beira Litoral
- UVP - Federação Portuguesa de Ciclismo

Vem desafiar-te nos trilhos de Oiã! 🌳🏃`,
      city: "Oiã",
      metaTitle: "Trail Terras de Oiá 2026 | Trail Running em Oiã",
      metaDescription:
        "Trail running em Oiã, Oliveira do Bairro. 5 percursos: Trail Longo 24km, Trail Curto 16km, Mini Trail 8km, Kids Trail 1km (grátis), Caminhada 8km. Inscrições de 1 Janeiro a 31 Março 2026.",
    },
    {
      language: "en",
      title: "Trail Terras de Oiá 2026",
      description: `# 🌲 Trail Terras de Oiá 2026

Welcome to **Trail Terras de Oiá 2026**, a trail running event in the stunning region of Oiã, Oliveira do Bairro! This is a unique opportunity to explore the natural trails of this beautiful area while challenging your limits.

## 📅 Date and Location

**Date:** July 26, 2026  
**Start Time:** 09:00  
**Location:** Oiã (Terras de Oiá), Oliveira do Bairro, Portugal

## 🏃 Event Variants

Trail Terras de Oiá offers options for all levels:

- **Long Trail 24km** - For the more experienced (09:00) - €8.00
- **Short Trail 16km** - Intermediate challenge (09:00) - €6.00
- **Mini Trail 8km** - Perfect for beginners (09:30) - €6.00
- **Kids Trail 1km** - For the little ones (10:00) - **FREE**
- **Walk 8km** - Hiking route (09:30) - €6.00

## 📝 Registration

**Registration Period:** January 1 to March 31, 2026  
**Prices:** From €0 (Kids Trail) to €8 (Long Trail)

Register at: [meutempo.pt](https://meutempo.pt/prova?trail-terras-oia-2026)

## 🎁 Participation Kit

All participants receive:
- 🏅 Finisher Medal
- 🎽 Race Bib
- ⏱️ Timing Chip
- 🛡️ Sports Insurance
- 🚿 Changing Rooms and Showers
- 💆 Massages
- 🍎 Aid Stations
- And much more!

## 🍽️ Meal Options

**Option 1:** Technical T-shirt + Bag

**Option 2:** Complete Lunch including:
- Green Broth
- Pork Feijoada
- Mixed Grill
- Pizza
- Grilled Chicken
- Bifanas
- Fruit
- Drinks
- And much more!

## 🏆 Prizes

- 🥇 Prizes for top trail finishers
- 👥 Prizes for best teams
- 📊 Prizes for teams with most registrations
- 🎉 Other prizes from the organization

## 👥 Organization

**Organizers:** Associação Jovem Oianense, Lesmas Bike

**Main Sponsors:**
- Municipality of Oliveira do Bairro
- Parish Council of Oiã
- IPDJ - Portuguese Institute of Sports and Youth, I.P.
- Aveiro Region
- Beira Litoral Cycling Association
- UVP - Portuguese Cycling Federation

Come challenge yourself on the trails of Oiã! 🌳🏃`,
      city: "Oiã",
      metaTitle: "Trail Terras de Oiá 2026 | Trail Running in Oiã",
      metaDescription:
        "Trail running in Oiã, Oliveira do Bairro. 5 routes: Long Trail 24km, Short Trail 16km, Mini Trail 8km, Kids Trail 1km (free), Walk 8km. Registration from January 1 to March 31, 2026.",
    },
    {
      language: "es",
      title: "Trail Terras de Oiá 2026",
      description: `# 🌲 Trail Terras de Oiá 2026

¡Bienvenidos al **Trail Terras de Oiá 2026**, un evento de trail running en la impresionante región de Oiã, Oliveira do Bairro! Esta es una oportunidad única para explorar los senderos naturales de esta hermosa zona mientras desafías tus límites.

## 📅 Fecha y Ubicación

**Fecha:** 26 de julio de 2026  
**Hora de Inicio:** 09:00  
**Ubicación:** Oiã (Terras de Oiá), Oliveira do Bairro, Portugal

## 🏃 Variantes del Evento

Trail Terras de Oiã ofrece opciones para todos los niveles:

- **Trail Largo 24km** - Para los más experimentados (09:00) - 8,00€
- **Trail Corto 16km** - Desafío intermedio (09:00) - 6,00€
- **Mini Trail 8km** - Perfecto para principiantes (09:30) - 6,00€
- **Kids Trail 1km** - Para los más pequeños (10:00) - **GRATUITO**
- **Caminata 8km** - Ruta a pie (09:30) - 6,00€

## 📝 Inscripciones

**Periodo de Inscripción:** 1 de enero a 31 de marzo de 2026  
**Precios:** Desde 0€ (Kids Trail) hasta 8€ (Trail Largo)

Inscríbete en: [meutempo.pt](https://meutempo.pt/prova?trail-terras-oia-2026)

## 🎁 Kit de Participación

Todos los participantes reciben:
- 🏅 Medalla de Finisher
- 🎽 Dorsal
- ⏱️ Chip de Cronometraje
- 🛡️ Seguro Deportivo
- 🚿 Vestuarios y Duchas
- 💆 Masajes
- 🍎 Avituallamientos
- ¡Y mucho más!

## 🍽️ Opciones de Comida

**Opción 1:** Camiseta Técnica + Bolsa

**Opción 2:** Almuerzo Completo incluyendo:
- Caldo Verde
- Feijoada de Cerdo
- Parrillada Mixta
- Pizza
- Pollo a la Parrilla
- Bifanas
- Fruta
- Bebidas
- ¡Y mucho más!

## 🏆 Premios

- 🥇 Premios para los mejores clasificados del trail
- 👥 Premios para los mejores equipos
- 📊 Premios para los equipos con más inscritos
- 🎉 Otros premios de la organización

## 👥 Organización

**Organizadores:** Associação Jovem Oianense, Lesmas Bike

**Patrocinadores Principales:**
- Municipio de Oliveira do Bairro
- Junta de Freguesia de Oiã
- IPDJ - Instituto Portugués del Deporte y la Juventud, I.P.
- Región de Aveiro
- Asociación de Ciclismo de Beira Litoral
- UVP - Federación Portuguesa de Ciclismo

¡Ven a desafiarte en los senderos de Oiã! 🌳🏃`,
      city: "Oiã",
      metaTitle: "Trail Terras de Oiá 2026 | Trail Running en Oiã",
      metaDescription:
        "Trail running en Oiã, Oliveira do Bairro. 5 rutas: Trail Largo 24km, Trail Corto 16km, Mini Trail 8km, Kids Trail 1km (gratis), Caminata 8km. Inscripciones del 1 de enero al 31 de marzo de 2026.",
    },
    {
      language: "fr",
      title: "Trail Terras de Oiá 2026",
      description: `# 🌲 Trail Terras de Oiá 2026

Bienvenue au **Trail Terras de Oiá 2026**, un événement de trail running dans la magnifique région d'Oiã, Oliveira do Bairro ! C'est une opportunité unique d'explorer les sentiers naturels de cette belle région tout en défiant vos limites.

## 📅 Date et Lieu

**Date :** 26 juillet 2026  
**Heure de Départ :** 09h00  
**Lieu :** Oiã (Terras de Oiá), Oliveira do Bairro, Portugal

## 🏃 Variantes de l'Événement

Trail Terras de Oiã offre des options pour tous les niveaux :

- **Trail Long 24km** - Pour les plus expérimentés (09h00) - 8,00€
- **Trail Court 16km** - Défi intermédiaire (09h00) - 6,00€
- **Mini Trail 8km** - Parfait pour les débutants (09h30) - 6,00€
- **Kids Trail 1km** - Pour les plus petits (10h00) - **GRATUIT**
- **Randonnée 8km** - Parcours pédestre (09h30) - 6,00€

## 📝 Inscriptions

**Période d'Inscription :** 1er janvier au 31 mars 2026  
**Prix :** De 0€ (Kids Trail) à 8€ (Trail Long)

Inscrivez-vous sur : [meutempo.pt](https://meutempo.pt/prova?trail-terras-oia-2026)

## 🎁 Kit de Participation

Tous les participants reçoivent :
- 🏅 Médaille de Finisher
- 🎽 Dossard
- ⏱️ Puce de Chronométrage
- 🛡️ Assurance Sportive
- 🚿 Vestiaires et Douches
- 💆 Massages
- 🍎 Ravitaillements
- Et bien plus encore !

## 🍽️ Options de Repas

**Option 1 :** T-shirt Technique + Sac

**Option 2 :** Déjeuner Complet comprenant :
- Caldo Verde
- Feijoada de Porc
- Grillade Mixte
- Pizza
- Poulet Grillé
- Bifanas
- Fruits
- Boissons
- Et bien plus encore !

## 🏆 Récompenses

- 🥇 Prix pour les meilleurs classés du trail
- 👥 Prix pour les meilleures équipes
- 📊 Prix pour les équipes avec le plus d'inscriptions
- 🎉 Autres prix de l'organisation

## 👥 Organisation

**Organisateurs :** Associação Jovem Oianense, Lesmas Bike

**Sponsors Principaux :**
- Municipalité d'Oliveira do Bairro
- Conseil Paroissial d'Oiã
- IPDJ - Institut Portugais du Sport et de la Jeunesse, I.P.
- Région d'Aveiro
- Association Cyclisme de Beira Litoral
- UVP - Fédération Portugaise de Cyclisme

Venez vous défier sur les sentiers d'Oiã ! 🌳🏃`,
      city: "Oiã",
      metaTitle: "Trail Terras de Oiá 2026 | Trail Running à Oiã",
      metaDescription:
        "Trail running à Oiã, Oliveira do Bairro. 5 parcours : Trail Long 24km, Trail Court 16km, Mini Trail 8km, Kids Trail 1km (gratuit), Randonnée 8km. Inscriptions du 1er janvier au 31 mars 2026.",
    },
    {
      language: "de",
      title: "Trail Terras de Oiá 2026",
      description: `# 🌲 Trail Terras de Oiá 2026

Willkommen zum **Trail Terras de Oiá 2026**, einer Trailrunning-Veranstaltung in der atemberaubenden Region Oiã, Oliveira do Bairro! Dies ist eine einzigartige Gelegenheit, die natürlichen Pfade dieser schönen Gegend zu erkunden und Ihre Grenzen herauszufordern.

## 📅 Datum und Ort

**Datum:** 26. Juli 2026  
**Startzeit:** 09:00 Uhr  
**Ort:** Oiã (Terras de Oiã), Oliveira do Bairro, Portugal

## 🏃 Event-Varianten

Trail Terras de Oiã bietet Optionen für alle Niveaus:

- **Langer Trail 24km** - Für die Erfahreneren (09:00) - 8,00€
- **Kurzer Trail 16km** - Mittlere Herausforderung (09:00) - 6,00€
- **Mini Trail 8km** - Perfekt für Anfänger (09:30) - 6,00€
- **Kids Trail 1km** - Für die Kleinsten (10:00) - **KOSTENLOS**
- **Wanderung 8km** - Wanderroute (09:30) - 6,00€

## 📝 Anmeldung

**Anmeldezeitraum:** 1. Januar bis 31. März 2026  
**Preise:** Von 0€ (Kids Trail) bis 8€ (Langer Trail)

Anmeldung unter: [meutempo.pt](https://meutempo.pt/prova?trail-terras-oia-2026)

## 🎁 Teilnahme-Kit

Alle Teilnehmer erhalten:
- 🏅 Finisher-Medaille
- 🎽 Startnummer
- ⏱️ Timing-Chip
- 🛡️ Sportversicherung
- 🚿 Umkleidekabinen und Duschen
- 💆 Massagen
- 🍎 Verpflegungsstationen
- Und vieles mehr!

## 🍽️ Essensoptionen

**Option 1:** Technisches T-Shirt + Tasche

**Option 2:** Vollständiges Mittagessen mit:
- Grüner Brühe
- Schweinefleisch-Feijoada
- Gemischter Grill
- Pizza
- Gegrilltes Hähnchen
- Bifanas
- Obst
- Getränke
- Und vieles mehr!

## 🏆 Preise

- 🥇 Preise für die besten Trail-Finisher
- 👥 Preise für die besten Teams
- 📊 Preise für Teams mit den meisten Anmeldungen
- 🎉 Weitere Preise der Organisation

## 👥 Organisation

**Veranstalter:** Associação Jovem Oianense, Lesmas Bike

**Hauptsponsoren:**
- Gemeinde Oliveira do Bairro
- Gemeindeverwaltung von Oiã
- IPDJ - Portugiesisches Institut für Sport und Jugend, I.P.
- Region Aveiro
- Beira Litoral Radsportverband
- UVP - Portugiesischer Radsportverband

Kommen Sie und fordern Sie sich auf den Pfaden von Oiã heraus! 🌳🏃`,
      city: "Oiã",
      metaTitle: "Trail Terras de Oiá 2026 | Trailrunning in Oiã",
      metaDescription:
        "Trailrunning in Oiã, Oliveira do Bairro. 5 Strecken: Langer Trail 24km, Kurzer Trail 16km, Mini Trail 8km, Kids Trail 1km (kostenlos), Wanderung 8km. Anmeldung vom 1. Januar bis 31. März 2026.",
    },
    {
      language: "it",
      title: "Trail Terras de Oiá 2026",
      description: `# 🌲 Trail Terras de Oiá 2026

Benvenuti al **Trail Terras de Oiá 2026**, un evento di trail running nella splendida regione di Oiã, Oliveira do Bairro! Questa è un'opportunità unica per esplorare i sentieri naturali di questa bellissima zona sfidando i propri limiti.

## 📅 Data e Luogo

**Data:** 26 luglio 2026  
**Orario di Partenza:** 09:00  
**Luogo:** Oiã (Terras de Oiã), Oliveira do Bairro, Portogallo

## 🏃 Varianti dell'Evento

Trail Terras de Oiã offre opzioni per tutti i livelli:

- **Trail Lungo 24km** - Per i più esperti (09:00) - 8,00€
- **Trail Corto 16km** - Sfida intermedia (09:00) - 6,00€
- **Mini Trail 8km** - Perfetto per principianti (09:30) - 6,00€
- **Kids Trail 1km** - Per i più piccoli (10:00) - **GRATUITO**
- **Camminata 8km** - Percorso a piedi (09:30) - 6,00€

## 📝 Iscrizioni

**Periodo di Iscrizione:** 1 gennaio - 31 marzo 2026  
**Prezzi:** Da 0€ (Kids Trail) a 8€ (Trail Lungo)

Iscriviti su: [meutempo.pt](https://meutempo.pt/prova?trail-terras-oia-2026)

## 🎁 Kit di Partecipazione

Tutti i partecipanti ricevono:
- 🏅 Medaglia del Finisher
- 🎽 Pettorale
- ⏱️ Chip di Cronometraggio
- 🛡️ Assicurazione Sportiva
- 🚿 Spogliatoi e Docce
- 💆 Massaggi
- 🍎 Rifornimenti
- E molto altro!

## 🍽️ Opzioni Pasto

**Opzione 1:** Maglietta Tecnica + Borsa

**Opzione 2:** Pranzo Completo che include:
- Brodo Verde
- Feijoada di Maiale
- Grigliata Mista
- Pizza
- Pollo alla Griglia
- Bifanas
- Frutta
- Bevande
- E molto altro!

## 🏆 Premi

- 🥇 Premi per i migliori classificati del trail
- 👥 Premi per le migliori squadre
- 📊 Premi per le squadre con più iscritti
- 🎉 Altri premi dell'organizzazione

## 👥 Organizzazione

**Organizzatori:** Associação Jovem Oianense, Lesmas Bike

**Sponsor Principali:**
- Comune di Oliveira do Bairro
- Consiglio Parrocchiale di Oiã
- IPDJ - Istituto Portoghese dello Sport e della Gioventù, I.P.
- Regione di Aveiro
- Associazione Ciclismo Beira Litoral
- UVP - Federazione Portoghese di Ciclismo

Vieni a metterti alla prova sui sentieri di Oiã! 🌳🏃`,
      city: "Oiã",
      metaTitle: "Trail Terras de Oiá 2026 | Trail Running a Oiã",
      metaDescription:
        "Trail running a Oiã, Oliveira do Bairro. 5 percorsi: Trail Lungo 24km, Trail Corto 16km, Mini Trail 8km, Kids Trail 1km (gratuito), Camminata 8km. Iscrizioni dal 1 gennaio al 31 marzo 2026.",
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
      name: "Trail Longo 24km",
      distanceKm: 24,
      price: 8.0,
      startTime: "09:00",
    },
    {
      name: "Trail Curto 16km",
      distanceKm: 16,
      price: 6.0,
      startTime: "09:00",
    },
    {
      name: "Mini Trail 8km",
      distanceKm: 8,
      price: 6.0,
      startTime: "09:30",
    },
    {
      name: "Kids Trail 1km",
      distanceKm: 1,
      price: 0.0,
      startTime: "10:00",
    },
    {
      name: "Caminhada 8km",
      distanceKm: 8,
      price: 6.0,
      startTime: "09:30",
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
  console.log("🎉 Trail Terras de Oiá 2026 seeded successfully!");
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
