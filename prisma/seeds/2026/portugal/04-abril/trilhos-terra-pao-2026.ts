/**
 * Seed: XII Passeio BTT Trilhos Terra de Pão 2026
 * Complete with translations in all 6 languages, FAQs and SEO
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding XII Passeio BTT Trilhos Terra de Pão 2026...");

  const eventSlug = "trilhos-terra-pao-2026";

  // Step 1: Upsert the event (NO delete operations)
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "XII Passeio BTT Trilhos Terra de Pão",
      description:
        "Passeio BTT tradicional com 12 edições em Salvada, Beja. Percursos de 45km e 70km pelos trilhos alentejanos. Incluído no circuito Maratonas CTT / Cerveja 2026.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-04-12T09:00:00.000Z"),
      endDate: null,
      city: "Salvada",
      country: "Portugal",
      latitude: 37.9517,
      longitude: -7.8693,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Salvada+Beja+Portugal",
      externalUrl: "https://apedalar.pt/eventos/4130/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-04-07T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "XII Passeio BTT Trilhos Terra de Pão",
      description:
        "Passeio BTT tradicional com 12 edições em Salvada, Beja. Percursos de 45km e 70km pelos trilhos alentejanos. Incluído no circuito Maratonas CTT / Cerveja 2026.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-04-12T09:00:00.000Z"),
      endDate: null,
      city: "Salvada",
      country: "Portugal",
      latitude: 37.9517,
      longitude: -7.8693,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Salvada+Beja+Portugal",
      externalUrl: "https://apedalar.pt/eventos/4130/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-04-07T23:59:59.000Z"),
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
      title: "XII Passeio BTT Trilhos Terra de Pão",
      city: "Salvada",
      metaTitle:
        "XII Passeio BTT Trilhos Terra de Pão 2026 | Salvada, Beja | 12 Abril",
      metaDescription:
        "XII Passeio BTT Trilhos Terra de Pão 2026 - 12 de abril em Salvada, Beja. Percursos de 45km e 70km pelos trilhos naturais do Alentejo. Limite de 300 participantes. Inscrições: 15€. Incluído no circuito Maratonas CTT 2026.",
      description: `# 🚴 XII Passeio BTT Trilhos Terra de Pão 2026

O **XII Passeio BTT Trilhos Terra de Pão** é um evento tradicional de mountain bike com **12 edições** de história em **Salvada, Beja**. Integrado no prestigiado circuito **Maratonas CTT / Cerveja 2026**.

## 📅 Data e Horários

- **Data:** Domingo, 12 de abril de 2026
- **Hora de Partida:** 09:00
- **Local:** Salvada, Beja
- **Distrito:** Beja

### Secretariado

**Sábado:**
- 18:00 às 19:00

**Domingo:**
- 07:30 (início)

## 🚴 Percursos Disponíveis

### BTT 45 km
Percurso intermédio pelos trilhos naturais de Salvada. Ideal para ciclistas que procuram um desafio equilibrado pelas paisagens alentejanas.

### BTT 70 km
Percurso completo e mais desafiante pelos trilhos da Terra de Pão. Para ciclistas experientes que querem explorar ao máximo a região.

## 🎁 O Que Está Incluído

- ✅ Seguro de acidentes pessoais
- ✅ Dorsal de participante
- ✅ Banhos após a prova
- ✅ Local para lavagem de bicicletas
- ✅ Brindes e lembranças do evento
- ✅ Abastecimentos ao longo do percurso
- ✅ Prémios para os 3 primeiros classificados de cada escalão

## 🏆 Prémios

**Troféus para os 3 primeiros classificados de cada escalão:**

### Masculinos
- Elites (<29 anos)
- Masters 30 (30-39 anos)
- Masters 40 (40-49 anos)
- Masters 50 (50-59 anos)
- Masters 60 (≥60 anos)

### Femininos
- Elites (<29 anos)
- Masters 30 (30-39 anos)
- Masters 40 (40-49 anos)
- Masters 50 (50-59 anos)

### E-Bikes
- Sem escalão - 3 primeiros classificados de 45km e 70km

## 🍽️ Almoço e Bebidas

- **Almoço:** 15€ (opcional)
- **Bebidas:** 10€ (opcional)

## 👥 Participação

- **Limite de participantes:** 300
- **Vagas disponíveis:** 291 (no momento da publicação)
- **Inscrições através de:** [apedalar.pt](https://apedalar.pt)

## 📞 Contactos

- **Email:** bttsalvada@gmail.com
- **Telemóvel:** 964 844 443

## 🏔️ Percurso

Trilhos naturais que destacam as magníficas paisagens da região de Salvada, conhecida como a "Terra de Pão". O percurso oferece:
- Trilhos técnicos pelos campos alentejanos
- Paisagens únicas da região de Beja
- Terreno variado e desafiante
- Zonas de abastecimento estratégicas

## 🎖️ Circuito

Este evento faz parte do prestigiado circuito **Maratonas CTT / Cerveja 2026**, reconhecido nacionalmente pela qualidade e organização dos seus eventos.

## ⚠️ Informações Importantes

- **Prazo de Inscrições:** Até 7 de abril de 2026 às 23:59
- **Tipo de Superfície:** Trilhos naturais
- **Partida/Chegada:** Salvada, Beja`,
    },
    {
      language: "en",
      title: "XII Bread Land Trails MTB Ride",
      city: "Salvada",
      metaTitle:
        "XII Bread Land Trails MTB Ride 2026 | Salvada, Beja | April 12",
      metaDescription:
        "XII Bread Land Trails MTB Ride 2026 - April 12 in Salvada, Beja. 45km and 70km routes through Alentejo natural trails. Limit of 300 participants. Registration: €15. Included in CTT Marathons 2026 circuit.",
      description: `# 🚴 XII Bread Land Trails MTB Ride 2026

The **XII Bread Land Trails MTB Ride** is a traditional mountain bike event with **12 editions** of history in **Salvada, Beja**. Integrated in the prestigious **CTT / Cerveja Marathons 2026** circuit.

## 📅 Date and Schedule

- **Date:** Sunday, April 12, 2026
- **Start Time:** 09:00
- **Location:** Salvada, Beja
- **District:** Beja

### Registration Desk

**Saturday:**
- 18:00 to 19:00

**Sunday:**
- 07:30 (start)

## 🚴 Available Routes

### MTB 45 km
Intermediate route through natural trails of Salvada. Ideal for cyclists seeking a balanced challenge through Alentejo landscapes.

### MTB 70 km
Complete and more challenging route through the Bread Land trails. For experienced cyclists who want to explore the region to the fullest.

## 🎁 What's Included

- ✅ Personal accident insurance
- ✅ Participant number plate
- ✅ Post-race showers
- ✅ Bike washing area
- ✅ Event gifts and souvenirs
- ✅ Refreshments along the route
- ✅ Prizes for top 3 finishers in each category

## 🏆 Prizes

**Trophies for top 3 finishers in each category:**

### Men's
- Elite (<29 years)
- Masters 30 (30-39 years)
- Masters 40 (40-49 years)
- Masters 50 (50-59 years)
- Masters 60 (≥60 years)

### Women's
- Elite (<29 years)
- Masters 30 (30-39 years)
- Masters 40 (40-49 years)
- Masters 50 (50-59 years)

### E-Bikes
- No category - Top 3 finishers in 45km and 70km

## 🍽️ Lunch and Drinks

- **Lunch:** €15 (optional)
- **Drinks:** €10 (optional)

## 👥 Participation

- **Participant limit:** 300
- **Available spots:** 291 (at time of publication)
- **Registration through:** [apedalar.pt](https://apedalar.pt)

## 📞 Contacts

- **Email:** bttsalvada@gmail.com
- **Phone:** +351 964 844 443

## 🏔️ Route

Natural trails showcasing the magnificent landscapes of the Salvada region, known as "Bread Land". The route offers:
- Technical trails through Alentejo fields
- Unique landscapes of the Beja region
- Varied and challenging terrain
- Strategic refreshment zones

## 🎖️ Circuit

This event is part of the prestigious **CTT / Cerveja Marathons 2026** circuit, nationally recognized for the quality and organization of its events.

## ⚠️ Important Information

- **Registration Deadline:** Until April 7, 2026 at 23:59
- **Surface Type:** Natural trails
- **Start/Finish:** Salvada, Beja`,
    },
    {
      language: "es",
      title: "XII Paseo BTT Senderos Tierra de Pan",
      city: "Salvada",
      metaTitle:
        "XII Paseo BTT Senderos Tierra de Pan 2026 | Salvada, Beja | 12 Abril",
      metaDescription:
        "XII Paseo BTT Senderos Tierra de Pan 2026 - 12 de abril en Salvada, Beja. Recorridos de 45km y 70km por senderos naturales del Alentejo. Límite de 300 participantes. Inscripciones: 15€. Incluido en circuito Maratones CTT 2026.",
      description: `# 🚴 XII Paseo BTT Senderos Tierra de Pan 2026

El **XII Paseo BTT Senderos Tierra de Pan** es un evento tradicional de mountain bike con **12 ediciones** de historia en **Salvada, Beja**. Integrado en el prestigioso circuito **Maratones CTT / Cerveja 2026**.

## 📅 Fecha y Horarios

- **Fecha:** Domingo, 12 de abril de 2026
- **Hora de Salida:** 09:00
- **Lugar:** Salvada, Beja
- **Distrito:** Beja

## 📞 Contactos

- **Email:** bttsalvada@gmail.com
- **Teléfono:** +351 964 844 443`,
    },
    {
      language: "fr",
      title: "XII Randonnée VTT Sentiers Terre de Pain",
      city: "Salvada",
      metaTitle:
        "XII Randonnée VTT Sentiers Terre de Pain 2026 | Salvada, Beja | 12 Avril",
      metaDescription:
        "XII Randonnée VTT Sentiers Terre de Pain 2026 - 12 avril à Salvada, Beja. Parcours de 45km et 70km à travers les sentiers naturels de l'Alentejo. Limite de 300 participants. Inscription: 15€. Inclus dans le circuit Marathons CTT 2026.",
      description: `# 🚴 XII Randonnée VTT Sentiers Terre de Pain 2026

La **XII Randonnée VTT Sentiers Terre de Pain** est un événement traditionnel de VTT avec **12 éditions** d'histoire à **Salvada, Beja**. Intégré dans le prestigieux circuit **Marathons CTT / Cerveja 2026**.

## 📞 Contacts

- **Email:** bttsalvada@gmail.com
- **Téléphone:** +351 964 844 443`,
    },
    {
      language: "de",
      title: "XII MTB-Fahrt Brotland-Trails",
      city: "Salvada",
      metaTitle:
        "XII MTB-Fahrt Brotland-Trails 2026 | Salvada, Beja | 12. April",
      metaDescription:
        "XII MTB-Fahrt Brotland-Trails 2026 - 12. April in Salvada, Beja. 45km und 70km Strecken durch natürliche Trails des Alentejo. Teilnehmerlimit: 300. Anmeldung: 15€. Im CTT Marathons 2026 Circuit.",
      description: `# 🚴 XII MTB-Fahrt Brotland-Trails 2026

Die **XII MTB-Fahrt Brotland-Trails** ist eine traditionelle Mountainbike-Veranstaltung mit **12 Ausgaben** Geschichte in **Salvada, Beja**. Integriert in den prestigeträchtigen **CTT / Cerveja Marathons 2026** Circuit.

## 📞 Kontakte

- **Email:** bttsalvada@gmail.com
- **Telefon:** +351 964 844 443`,
    },
    {
      language: "it",
      title: "XII Pedalata MTB Sentieri Terra del Pane",
      city: "Salvada",
      metaTitle:
        "XII Pedalata MTB Sentieri Terra del Pane 2026 | Salvada, Beja | 12 Aprile",
      metaDescription:
        "XII Pedalata MTB Sentieri Terra del Pane 2026 - 12 aprile a Salvada, Beja. Percorsi di 45km e 70km attraverso sentieri naturali dell'Alentejo. Limite di 300 partecipanti. Iscrizione: 15€. Incluso nel circuito Maratone CTT 2026.",
      description: `# 🚴 XII Pedalata MTB Sentieri Terra del Pane 2026

La **XII Pedalata MTB Sentieri Terra del Pane** è un evento tradizionale di mountain bike con **12 edizioni** di storia a **Salvada, Beja**. Integrato nel prestigioso circuito **Maratone CTT / Cerveja 2026**.

## 📞 Contatti

- **Email:** bttsalvada@gmail.com
- **Telefono:** +351 964 844 443`,
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

  const btt45 = await findOrCreateVariant({
    name: "BTT 45 km",
    distanceKm: 45,
    elevationGainM: 600,
    elevationLossM: 600,
    startTime: "09:00",
    maxParticipants: 150,
    price: 15.0,
    currency: Currency.EUR,
  });

  const btt45Translations = [
    {
      language: Language.pt,
      name: "BTT 45 km",
      description:
        "Percurso intermédio de 45km pelos trilhos naturais de Salvada. Ideal para ciclistas que procuram um desafio equilibrado pelas magníficas paisagens da Terra de Pão.",
    },
    {
      language: Language.en,
      name: "MTB 45 km",
      description:
        "Intermediate 45km route through natural trails of Salvada. Ideal for cyclists seeking a balanced challenge through the magnificent Bread Land landscapes.",
    },
    {
      language: Language.es,
      name: "BTT 45 km",
      description:
        "Recorrido intermedio de 45km por senderos naturales de Salvada. Ideal para ciclistas que buscan un desafío equilibrado por los magníficos paisajes de la Tierra de Pan.",
    },
    {
      language: Language.fr,
      name: "VTT 45 km",
      description:
        "Parcours intermédiaire de 45km à travers les sentiers naturels de Salvada. Idéal pour les cyclistes recherchant un défi équilibré à travers les magnifiques paysages de la Terre de Pain.",
    },
    {
      language: Language.de,
      name: "MTB 45 km",
      description:
        "Mittlere 45km Strecke durch natürliche Trails von Salvada. Ideal für Radfahrer, die eine ausgewogene Herausforderung durch die herrlichen Brotland-Landschaften suchen.",
    },
    {
      language: Language.it,
      name: "MTB 45 km",
      description:
        "Percorso intermedio di 45km attraverso sentieri naturali di Salvada. Ideale per ciclisti che cercano una sfida equilibrata attraverso i magnifici paesaggi della Terra del Pane.",
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

  const btt70 = await findOrCreateVariant({
    name: "BTT 70 km",
    distanceKm: 70,
    elevationGainM: 1000,
    elevationLossM: 1000,
    startTime: "09:00",
    maxParticipants: 150,
    price: 15.0,
    currency: Currency.EUR,
  });

  const btt70Translations = [
    {
      language: Language.pt,
      name: "BTT 70 km",
      description:
        "Percurso completo de 70km pelos trilhos da Terra de Pão. Mais desafiante e técnico, ideal para ciclistas experientes que querem explorar ao máximo a região de Salvada.",
    },
    {
      language: Language.en,
      name: "MTB 70 km",
      description:
        "Complete 70km route through Bread Land trails. More challenging and technical, ideal for experienced cyclists who want to explore the Salvada region to the fullest.",
    },
    {
      language: Language.es,
      name: "BTT 70 km",
      description:
        "Recorrido completo de 70km por los senderos de la Tierra de Pan. Más desafiante y técnico, ideal para ciclistas experimentados que quieren explorar al máximo la región de Salvada.",
    },
    {
      language: Language.fr,
      name: "VTT 70 km",
      description:
        "Parcours complet de 70km à travers les sentiers de la Terre de Pain. Plus difficile et technique, idéal pour les cyclistes expérimentés qui veulent explorer au maximum la région de Salvada.",
    },
    {
      language: Language.de,
      name: "MTB 70 km",
      description:
        "Vollständige 70km Strecke durch Brotland-Trails. Anspruchsvoller und technischer, ideal für erfahrene Radfahrer, die die Region Salvada voll erkunden möchten.",
    },
    {
      language: Language.it,
      name: "MTB 70 km",
      description:
        "Percorso completo di 70km attraverso i sentieri della Terra del Pane. Più impegnativo e tecnico, ideale per ciclisti esperti che vogliono esplorare al massimo la regione di Salvada.",
    },
  ];

  for (const translation of btt70Translations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: btt70.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: btt70.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  console.log("   ✅ BTT 70km variant created");

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
    endDate: new Date("2026-04-07T23:59:59.000Z"),
    price: 15.0,
    currency: Currency.EUR,
    note: "Preço único de inscrição para todos os percursos",
  });

  console.log("   ✅ Pricing phase created");

  console.log(`
🎉 XII Passeio BTT Trilhos Terra de Pão 2026 seeded successfully!
   📍 Event: XII Passeio BTT Trilhos Terra de Pão
   🔗 Slug: ${event.slug}
   📅 Date: 2026-04-12
   📍 Location: Salvada, Beja, Portugal
   🚴 Variants: BTT 45km, BTT 70km
   💰 Pricing: €15 (preço único)
   👥 Max Participants: 300
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
