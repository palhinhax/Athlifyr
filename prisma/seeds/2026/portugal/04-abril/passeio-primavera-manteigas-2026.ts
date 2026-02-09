/**
 * Seed: Passeio BTT Desfrutem a Primavera - Manteigas 2026
 */

import { PrismaClient, SportType, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding Passeio BTT Desfrutem a Primavera 2026...");

  const eventSlug = "passeio-primavera-manteigas-2026";

  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: 'Passeio BTT "Desfrutem a Primavera"',
      description:
        "Passeio BTT Rota do Mondego em Manteigas. 40km (1050m D+) pelos trilhos da Serra da Estrela. Organizado pelo Grupo BTT de Manteigas. Almoço incluído.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-04-26T09:00:00.000Z"),
      endDate: null,
      city: "Manteigas",
      country: "Portugal",
      latitude: 40.4,
      longitude: -7.5333,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Manteigas+Guarda+Portugal",
      externalUrl: "https://apedalar.pt/eventos/4181/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-04-21T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: 'Passeio BTT "Desfrutem a Primavera"',
      description:
        "Passeio BTT Rota do Mondego em Manteigas. 40km (1050m D+) pelos trilhos da Serra da Estrela. Organizado pelo Grupo BTT de Manteigas. Almoço incluído.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-04-26T09:00:00.000Z"),
      endDate: null,
      city: "Manteigas",
      country: "Portugal",
      latitude: 40.4,
      longitude: -7.5333,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Manteigas+Guarda+Portugal",
      externalUrl: "https://apedalar.pt/eventos/4181/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-04-21T23:59:59.000Z"),
    },
  });

  const translations = [
    {
      language: "pt" as const,
      title: 'Passeio BTT "Desfrutem a Primavera"',
      city: "Manteigas",
      metaTitle:
        'Passeio BTT "Desfrutem a Primavera" 2026 | Manteigas | 26 Abril',
      metaDescription:
        "Passeio BTT Rota do Mondego 2026 - 26 abril em Manteigas, Serra da Estrela. 40km, 1050m D+. Almoço incluído. Caminhada simultânea. Inscrição: 18€. Grupo BTT Manteigas.",
      description: `# 🚴 Passeio BTT "Desfrutem a Primavera" 2026

O **Passeio BTT da Primavera - Rota do Mondego** é organizado pelo **Grupo BTT de Manteigas** em parceria com a **Junta de Freguesia de Santa Maria**.

## 🏔️ Percurso

**Passeio BTT:** 40 km | 1050 m D+

Percurso pelos trilhos magníficos da **Serra da Estrela**, seguindo a **Rota do Mondego**.

## 💰 Preço

- **Passeio Lazer BTT:** 18€ (almoço incluído)
- **Acompanhantes:** 18€ (com almoço)

## 📞 Contactos

- **Email:** grupobttmanteigas@gmail.com`,
    },
    {
      language: "en" as const,
      title: 'MTB Ride "Enjoy Spring"',
      city: "Manteigas",
      metaTitle: 'MTB Ride "Enjoy Spring" 2026 | Manteigas | April 26',
      metaDescription:
        "Mondego Route MTB Ride 2026 - April 26 in Manteigas, Serra da Estrela. 40km, 1050m D+. Lunch included. Simultaneous walk. Entry: €18. Manteigas MTB Group.",
      description: `# 🚴 MTB Ride "Enjoy Spring" 2026

Organized by **Manteigas MTB Group** in partnership with **Santa Maria Parish Council**.

## 📞 Contacts

- **Email:** grupobttmanteigas@gmail.com`,
    },
    {
      language: "es" as const,
      title: 'Paseo BTT "Disfruten la Primavera"',
      city: "Manteigas",
      metaTitle:
        'Paseo BTT "Disfruten la Primavera" 2026 | Manteigas | 26 Abril',
      metaDescription:
        "Paseo BTT Ruta del Mondego 2026 - 26 abril en Manteigas, Serra da Estrela. 40km, 1050m D+. Almuerzo incluido. Caminata simultánea. Inscripción: 18€.",
      description: `# 🚴 Paseo BTT "Disfruten la Primavera" 2026

## 📞 Contactos

- **Email:** grupobttmanteigas@gmail.com`,
    },
    {
      language: "fr" as const,
      title: 'Randonnée VTT "Profitez du Printemps"',
      city: "Manteigas",
      metaTitle:
        'Randonnée VTT "Profitez du Printemps" 2026 | Manteigas | 26 Avril',
      metaDescription:
        "Randonnée VTT Route du Mondego 2026 - 26 avril à Manteigas, Serra da Estrela. 40km, 1050m D+. Déjeuner inclus. Marche simultanée. Inscription: 18€.",
      description: `# 🚴 Randonnée VTT "Profitez du Printemps" 2026

## 📞 Contacts

- **Email:** grupobttmanteigas@gmail.com`,
    },
    {
      language: "de" as const,
      title: 'MTB-Fahrt "Genießt den Frühling"',
      city: "Manteigas",
      metaTitle:
        'MTB-Fahrt "Genießt den Frühling" 2026 | Manteigas | 26. April',
      metaDescription:
        "Mondego-Route MTB-Fahrt 2026 - 26. April in Manteigas, Serra da Estrela. 40km, 1050m Hm. Mittagessen inklusive. Gleichzeitige Wanderung. Anmeldung: 18€.",
      description: `# 🚴 MTB-Fahrt "Genießt den Frühling" 2026

## 📞 Kontakte

- **Email:** grupobttmanteigas@gmail.com`,
    },
    {
      language: "it" as const,
      title: 'Pedalata MTB "Godetevi la Primavera"',
      city: "Manteigas",
      metaTitle:
        'Pedalata MTB "Godetevi la Primavera" 2026 | Manteigas | 26 Aprile',
      metaDescription:
        "Pedalata MTB Rotta del Mondego 2026 - 26 aprile a Manteigas, Serra da Estrela. 40km, 1050m D+. Pranzo incluso. Camminata simultanea. Iscrizione: 18€.",
      description: `# 🚴 Pedalata MTB "Godetevi la Primavera" 2026

## 📞 Contatti

- **Email:** grupobttmanteigas@gmail.com`,
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
    name: "Passeio Lazer 40 km",
    distanceKm: 40,
    elevationGainM: 1050,
    startTime: "09:00",
    price: 18.0,
    currency: Currency.EUR,
  });

  console.log("✅ Passeio BTT Desfrutem a Primavera 2026 seeded!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
