/**
 * Seed: XVI Rota do Cabicanca 2026
 * Complete with translations in all 6 languages
 */

import { PrismaClient, SportType, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding XVI Rota do Cabicanca 2026...");

  const eventSlug = "rota-cabicanca-2026";

  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "XVI Rota do Cabicanca",
      description:
        "XVI Passeio de BTT em Aguiar da Beira com percursos de 25km e 40km. Organizado pela Câmara Municipal e AguiarBike Sports Club. Jersey oficial até 31 março.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-04-26T09:00:00.000Z"),
      endDate: null,
      city: "Aguiar da Beira",
      country: "Portugal",
      latitude: 40.8167,
      longitude: -7.5333,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Aguiar+da+Beira+Guarda+Portugal",
      externalUrl: "https://apedalar.pt/eventos/4146/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-03-31T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "XVI Rota do Cabicanca",
      description:
        "XVI Passeio de BTT em Aguiar da Beira com percursos de 25km e 40km. Organizado pela Câmara Municipal e AguiarBike Sports Club. Jersey oficial até 31 março.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-04-26T09:00:00.000Z"),
      endDate: null,
      city: "Aguiar da Beira",
      country: "Portugal",
      latitude: 40.8167,
      longitude: -7.5333,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Aguiar+da+Beira+Guarda+Portugal",
      externalUrl: "https://apedalar.pt/eventos/4146/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-03-31T23:59:59.000Z"),
    },
  });

  console.log(`✅ Event upserted: ${event.slug} (ID: ${event.id})`);

  const translations = [
    {
      language: "pt" as const,
      title: "XVI Rota do Cabicanca",
      city: "Aguiar da Beira",
      metaTitle: "XVI Rota do Cabicanca 2026 | Aguiar da Beira | 26 Abril",
      metaDescription:
        "XVI Rota do Cabicanca 2026 - 26 abril em Aguiar da Beira. BTT 25km e 40km + Caminhadas. Jersey oficial até 31 março. Almoço incluído. Inscrições: 12-23€. Limite 150 participantes.",
      description: `# 🚴 XVI Rota do Cabicanca 2026

A **XVI Rota do Cabicanca** é um passeio de BTT organizado pela **Câmara Municipal de Aguiar da Beira** e pelo **Clube BTT AguiarBike Sports Club**.

## 💰 Preços

**Período 1: Fevereiro a 31 Março**
- **BTT com Jersey:** 23€
- **BTT sem Jersey:** 12€
- **Caminhada KIDS (8-11 anos):** 8€
- **Caminhada (+12 anos):** 10€

**Período 2: 1 Abril a 16 Abril**
- **BTT (sem jersey disponível):** 18€

## 📞 Contactos

- **Email:** desporto@cm-aguiardabeira.pt
- **Telemóvel:** 963 059 715`,
    },
    {
      language: "en" as const,
      title: "XVI Cabicanca Route",
      city: "Aguiar da Beira",
      metaTitle: "XVI Cabicanca Route 2026 | Aguiar da Beira | April 26",
      metaDescription:
        "XVI Cabicanca Route 2026 - April 26 in Aguiar da Beira. MTB 25km & 40km + Walks. Official jersey until March 31. Lunch included. Entry: €12-23. Limit 150 participants.",
      description: `# 🚴 XVI Cabicanca Route 2026

The **XVI Cabicanca Route** is an MTB ride organized by **Aguiar da Beira City Council** and **AguiarBike Sports Club**.

## 📞 Contacts

- **Email:** desporto@cm-aguiardabeira.pt
- **Phone:** +351 963 059 715`,
    },
    {
      language: "es" as const,
      title: "XVI Ruta del Cabicanca",
      city: "Aguiar da Beira",
      metaTitle: "XVI Ruta del Cabicanca 2026 | Aguiar da Beira | 26 Abril",
      metaDescription:
        "XVI Ruta del Cabicanca 2026 - 26 abril en Aguiar da Beira. BTT 25km y 40km + Caminatas. Jersey oficial hasta 31 marzo. Almuerzo incluido. Inscripciones: 12-23€.",
      description: `# 🚴 XVI Ruta del Cabicanca 2026

## 📞 Contactos

- **Email:** desporto@cm-aguiardabeira.pt
- **Teléfono:** +351 963 059 715`,
    },
    {
      language: "fr" as const,
      title: "XVI Route du Cabicanca",
      city: "Aguiar da Beira",
      metaTitle: "XVI Route du Cabicanca 2026 | Aguiar da Beira | 26 Avril",
      metaDescription:
        "XVI Route du Cabicanca 2026 - 26 avril à Aguiar da Beira. VTT 25km et 40km + Randonnées. Maillot officiel jusqu'au 31 mars. Déjeuner inclus. Inscription: 12-23€.",
      description: `# 🚴 XVI Route du Cabicanca 2026

## 📞 Contacts

- **Email:** desporto@cm-aguiardabeira.pt
- **Téléphone:** +351 963 059 715`,
    },
    {
      language: "de" as const,
      title: "XVI Cabicanca-Route",
      city: "Aguiar da Beira",
      metaTitle: "XVI Cabicanca-Route 2026 | Aguiar da Beira | 26. April",
      metaDescription:
        "XVI Cabicanca-Route 2026 - 26. April in Aguiar da Beira. MTB 25km und 40km + Wanderungen. Offizielles Trikot bis 31. März. Mittagessen inklusive. Anmeldung: 12-23€.",
      description: `# 🚴 XVI Cabicanca-Route 2026

## 📞 Kontakte

- **Email:** desporto@cm-aguiardabeira.pt
- **Telefon:** +351 963 059 715`,
    },
    {
      language: "it" as const,
      title: "XVI Rotta del Cabicanca",
      city: "Aguiar da Beira",
      metaTitle: "XVI Rotta del Cabicanca 2026 | Aguiar da Beira | 26 Aprile",
      metaDescription:
        "XVI Rotta del Cabicanca 2026 - 26 aprile ad Aguiar da Beira. MTB 25km e 40km + Camminate. Maglia ufficiale fino al 31 marzo. Pranzo incluso. Iscrizione: 12-23€.",
      description: `# 🚴 XVI Rotta del Cabicanca 2026

## 📞 Contatti

- **Email:** desporto@cm-aguiardabeira.pt
- **Telefono:** +351 963 059 715`,
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
    name: "BTT 25 km",
    distanceKm: 25,
    elevationGainM: 400,
    startTime: "09:00",
    maxParticipants: 75,
    price: 12.0,
    currency: Currency.EUR,
  });

  await findOrCreateVariant({
    name: "BTT 40 km",
    distanceKm: 40,
    elevationGainM: 700,
    startTime: "09:00",
    maxParticipants: 75,
    price: 12.0,
    currency: Currency.EUR,
  });

  console.log("✅ XVI Rota do Cabicanca 2026 seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
