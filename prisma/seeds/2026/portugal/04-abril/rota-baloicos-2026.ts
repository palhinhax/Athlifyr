/**
 * Seed: Rota dos Baloiços 2026
 * Taça Oeste XCM BTT - 4ª Edição
 */

import { PrismaClient, SportType, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding Rota dos Baloiços 2026...");

  const eventSlug = "rota-baloicos-2026";

  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "Rota dos Baloiços",
      description:
        "Etapa da Taça Oeste XCM BTT 2026. Maratona 60km e Meia-Maratona 40km em Carvoeira, Torres Vedras. Organizado por MR3eventus.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-04-26T09:00:00.000Z"),
      endDate: null,
      city: "Carvoeira, Torres Vedras",
      country: "Portugal",
      latitude: 39.0833,
      longitude: -9.2833,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Carvoeira+Torres+Vedras+Portugal",
      externalUrl: "https://apedalar.pt/eventos/4074/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-03-20T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "Rota dos Baloiços",
      description:
        "Etapa da Taça Oeste XCM BTT 2026. Maratona 60km e Meia-Maratona 40km em Carvoeira, Torres Vedras. Organizado por MR3eventus.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-04-26T09:00:00.000Z"),
      endDate: null,
      city: "Carvoeira, Torres Vedras",
      country: "Portugal",
      latitude: 39.0833,
      longitude: -9.2833,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Carvoeira+Torres+Vedras+Portugal",
      externalUrl: "https://apedalar.pt/eventos/4074/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-03-20T23:59:59.000Z"),
    },
  });

  const translations = [
    {
      language: "pt" as const,
      title: "Rota dos Baloiços",
      city: "Carvoeira",
      metaTitle:
        "Rota dos Baloiços 2026 | Taça Oeste XCM | Torres Vedras | 26 Abril",
      metaDescription:
        "Rota dos Baloiços 2026 - Etapa da Taça Oeste XCM BTT. 26 abril em Carvoeira, Torres Vedras. Maratona 60km e Meia 40km. E-Bikes permitidas. Inscrições: 15-20€. Organização MR3eventus.",
      description: `# 🚴 Rota dos Baloiços 2026 - Taça Oeste XCM BTT

A **Rota dos Baloiços** é uma etapa da **4ª Edição da Taça Oeste XCM BTT**, organizada por **MR3eventus**.

## 💰 Preços

- **1ª Fase:** 15€
- **2ª Fase:** 18€
- **Fora de Prazo:** 20€
- **Almoço (opcional):** 6€
- **Acompanhantes:** 6€

## 🎁 Incluído

- Participação no evento
- Seguro de Acidentes Pessoais
- Frontal e braçadeiras
- Brindes/Lembranças
- Banhos
- Abastecimentos líquidos e sólidos
- Lavagem de bicicletas
- Fotos no Facebook oficial

## 📞 Contactos

- **Email:** mr3eventus@gmail.com
- **Telemóvel:** 918 588 922`,
    },
    {
      language: "en" as const,
      title: "Swings Route",
      city: "Carvoeira",
      metaTitle: "Swings Route 2026 | West XCM Cup | Torres Vedras | April 26",
      metaDescription:
        "Swings Route 2026 - West XCM MTB Cup stage. April 26 in Carvoeira, Torres Vedras. Marathon 60km and Half 40km. E-Bikes allowed. Entry: €15-20. MR3eventus organization.",
      description: `# 🚴 Swings Route 2026 - West XCM MTB Cup

The **Swings Route** is a stage of the **4th West XCM MTB Cup**, organized by **MR3eventus**.

## 📞 Contacts

- **Email:** mr3eventus@gmail.com
- **Phone:** +351 918 588 922`,
    },
    {
      language: "es" as const,
      title: "Ruta de los Columpios",
      city: "Carvoeira",
      metaTitle:
        "Ruta de los Columpios 2026 | Copa Oeste XCM | Torres Vedras | 26 Abril",
      metaDescription:
        "Ruta de los Columpios 2026 - Etapa Copa Oeste XCM BTT. 26 abril en Carvoeira, Torres Vedras. Maratón 60km y Media 40km. E-Bikes permitidas. Inscripciones: 15-20€.",
      description: `# 🚴 Ruta de los Columpios 2026 - Copa Oeste XCM BTT

## 📞 Contactos

- **Email:** mr3eventus@gmail.com
- **Teléfono:** +351 918 588 922`,
    },
    {
      language: "fr" as const,
      title: "Route des Balançoires",
      city: "Carvoeira",
      metaTitle:
        "Route des Balançoires 2026 | Coupe Ouest XCM | Torres Vedras | 26 Avril",
      metaDescription:
        "Route des Balançoires 2026 - Étape Coupe Ouest XCM VTT. 26 avril à Carvoeira, Torres Vedras. Marathon 60km et Semi 40km. E-Bikes autorisés. Inscription: 15-20€.",
      description: `# 🚴 Route des Balançoires 2026 - Coupe Ouest XCM VTT

## 📞 Contacts

- **Email:** mr3eventus@gmail.com
- **Téléphone:** +351 918 588 922`,
    },
    {
      language: "de" as const,
      title: "Schaukel-Route",
      city: "Carvoeira",
      metaTitle:
        "Schaukel-Route 2026 | West XCM Pokal | Torres Vedras | 26. April",
      metaDescription:
        "Schaukel-Route 2026 - West XCM MTB Pokal Etappe. 26. April in Carvoeira, Torres Vedras. Marathon 60km und Halb 40km. E-Bikes erlaubt. Anmeldung: 15-20€.",
      description: `# 🚴 Schaukel-Route 2026 - West XCM MTB Pokal

## 📞 Kontakte

- **Email:** mr3eventus@gmail.com
- **Telefon:** +351 918 588 922`,
    },
    {
      language: "it" as const,
      title: "Rotta delle Altalene",
      city: "Carvoeira",
      metaTitle:
        "Rotta delle Altalene 2026 | Coppa Ovest XCM | Torres Vedras | 26 Aprile",
      metaDescription:
        "Rotta delle Altalene 2026 - Tappa Coppa Ovest XCM MTB. 26 aprile a Carvoeira, Torres Vedras. Maratona 60km e Mezza 40km. E-Bikes consentite. Iscrizione: 15-20€.",
      description: `# 🚴 Rotta delle Altalene 2026 - Coppa Ovest XCM MTB

## 📞 Contatti

- **Email:** mr3eventus@gmail.com
- **Telefono:** +351 918 588 922`,
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

  const findOrCreateVariant = async (variantData: {
    name: string;
    distanceKm?: number;
    elevationGainM?: number;
    startTime?: string;
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
    }
    return await prisma.eventVariant.create({
      data: { eventId: event.id, ...variantData },
    });
  };

  await findOrCreateVariant({
    name: "Meia-Maratona 40 km",
    distanceKm: 40,
    elevationGainM: 600,
    startTime: "09:00",
    price: 15.0,
    currency: Currency.EUR,
  });

  await findOrCreateVariant({
    name: "Maratona 60 km",
    distanceKm: 60,
    elevationGainM: 1000,
    startTime: "09:00",
    price: 15.0,
    currency: Currency.EUR,
  });

  console.log("✅ Rota dos Baloiços 2026 seeded!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
