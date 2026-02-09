/**
 * Seed: Passeio da Espiga 2026
 */

import { PrismaClient, SportType, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding Passeio da Espiga 2026...");

  const eventSlug = "passeio-espiga-2026";

  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "Passeio da Espiga",
      description:
        "Passeio da Espiga em Mafra com percursos de BTT (20km e 40km) e Caminhada (13km). Evento não competitivo. Desconto de 50% para sócios. Inclui almoço convívio.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-05-10T09:00:00.000Z"),
      endDate: null,
      city: "Mafra",
      country: "Portugal",
      latitude: 38.9333,
      longitude: -9.3167,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Mafra+Lisboa+Portugal",
      externalUrl: "https://apedalar.pt/eventos/4189/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-05-06T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "Passeio da Espiga",
      description:
        "Passeio da Espiga em Mafra com percursos de BTT (20km e 40km) e Caminhada (13km). Evento não competitivo. Desconto de 50% para sócios. Inclui almoço convívio.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-05-10T09:00:00.000Z"),
      endDate: null,
      city: "Mafra",
      country: "Portugal",
      latitude: 38.9333,
      longitude: -9.3167,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Mafra+Lisboa+Portugal",
      externalUrl: "https://apedalar.pt/eventos/4189/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-05-06T23:59:59.000Z"),
    },
  });

  const translations = [
    {
      language: "pt" as const,
      title: "Passeio da Espiga",
      city: "Mafra",
      metaTitle: "Passeio da Espiga 2026 | Mafra | 10 Maio",
      metaDescription:
        "Passeio da Espiga 2026 - 10 maio em Mafra. BTT 20km (fácil) e 40km (difícil) + Caminhada 13km. Não competitivo. Almoço incluído. Desconto 50% sócios. Inscrições: 14-17€.",
      description: `# 🚴 Passeio da Espiga 2026

O **Passeio da Espiga** é um evento **não competitivo** organizado em Mafra, que celebra a tradição e o desporto ao ar livre.

## 📅 Data e Programa

**Data:** Sábado, 10 de maio de 2026

- 08:00-09:00 - Entrega de dorsais
- 09:00 - Partida BTT
- 09:30 - Partida Caminhada
- 13:00 - Almoço convívio

## 🚴 Percursos

### BTT Percurso Curto - 20 km
Dificuldade: **Fácil**

### BTT Percurso Longo - 40 km
Dificuldade: **Difícil**

### Caminhada - 13 km
Percurso pedestre para acompanhantes e famílias.

## 💰 Preços

**BTT:**
- **1ª Fase (até 15 Abril):** 14€
- **2ª Fase (16 Abril - 6 Maio):** 17€
- **Sócios:** 50% de desconto

**Caminhada:**
- **Inscrição:** 7€

## 🎁 Inscrição Inclui

- ✅ Seguro de Acidentes Pessoais
- ✅ Dorsal de participação
- ✅ Reabastecimentos durante o percurso
- ✅ **Almoço convívio** no final
- ✅ Brinde de participação
- ✅ Assistência técnica e médica
- ✅ Balneários disponíveis

## 👥 Participação

- **Idade mínima BTT:** 16 anos
- **Idade mínima Caminhada:** Todas as idades (menores acompanhados)
- **Equipamento obrigatório BTT:** Capacete homologado

## ⚙️ Regras Importantes

- Evento **não competitivo** de carácter recreativo
- Capacete obrigatório durante todo o percurso BTT
- Percursos sinalizados
- Respeito pela natureza e ambiente

## 📍 Localização

**Partida/Chegada:**
Mafra
Lisboa

## 🌾 Tradição da Espiga

O evento celebra a tradição da espiga de trigo, símbolo da cultura agrícola da região de Mafra.`,
    },
    {
      language: "en" as const,
      title: "Wheat Spike Ride",
      city: "Mafra",
      metaTitle: "Wheat Spike Ride 2026 | Mafra | May 10",
      metaDescription:
        "Wheat Spike Ride 2026 - May 10 in Mafra. MTB 20km (easy) and 40km (hard) + Walk 13km. Non-competitive. Lunch included. 50% member discount. Entry: €14-17.",
      description: `# 🚴 Wheat Spike Ride 2026

The **Wheat Spike Ride** is a **non-competitive** event organized in Mafra, celebrating tradition and outdoor sports.

## 🚴 Routes

**MTB Short Route:** 20 km (Easy)
**MTB Long Route:** 40 km (Difficult)
**Walk:** 13 km

## 💰 Prices

**MTB:**
- **Phase 1 (until April 15):** €14
- **Phase 2 (April 16 - May 6):** €17
- **Members:** 50% discount

**Walk:** €7

## 🎁 Entry Includes

- Insurance
- Race number
- Refreshments during route
- **Lunch** at the finish
- Participation gift
- Technical and medical assistance
- Showers available

## 👥 Participation

- **Minimum age MTB:** 16 years
- **Mandatory equipment:** Approved helmet

## 📍 Location

Mafra, Lisbon`,
    },
    {
      language: "es" as const,
      title: "Paseo de la Espiga",
      city: "Mafra",
      metaTitle: "Paseo de la Espiga 2026 | Mafra | 10 Mayo",
      metaDescription:
        "Paseo de la Espiga 2026 - 10 mayo en Mafra. BTT 20km (fácil) y 40km (difícil) + Caminata 13km. No competitivo. Almuerzo incluido. Descuento 50% socios. Inscripciones: 14-17€.",
      description: `# 🚴 Paseo de la Espiga 2026

## 📞 Contactos

- Mafra, Lisboa`,
    },
    {
      language: "fr" as const,
      title: "Randonnée de l'Épi",
      city: "Mafra",
      metaTitle: "Randonnée de l'Épi 2026 | Mafra | 10 Mai",
      metaDescription:
        "Randonnée de l'Épi 2026 - 10 mai à Mafra. VTT 20km (facile) et 40km (difficile) + Marche 13km. Non compétitif. Déjeuner inclus. Réduction 50% membres. Inscription: 14-17€.",
      description: `# 🚴 Randonnée de l'Épi 2026

## 📍 Localisation

Mafra, Lisbonne`,
    },
    {
      language: "de" as const,
      title: "Ähren-Fahrt",
      city: "Mafra",
      metaTitle: "Ähren-Fahrt 2026 | Mafra | 10. Mai",
      metaDescription:
        "Ähren-Fahrt 2026 - 10. Mai in Mafra. MTB 20km (leicht) und 40km (schwer) + Wanderung 13km. Nicht-wettbewerblich. Mittagessen inklusive. 50% Mitgliederrabatt. Anmeldung: 14-17€.",
      description: `# 🚴 Ähren-Fahrt 2026

## 📍 Standort

Mafra, Lissabon`,
    },
    {
      language: "it" as const,
      title: "Pedalata della Spiga",
      city: "Mafra",
      metaTitle: "Pedalata della Spiga 2026 | Mafra | 10 Maggio",
      metaDescription:
        "Pedalata della Spiga 2026 - 10 maggio a Mafra. MTB 20km (facile) e 40km (difficile) + Camminata 13km. Non competitivo. Pranzo incluso. Sconto 50% soci. Iscrizione: 14-17€.",
      description: `# 🚴 Pedalata della Spiga 2026

## 📍 Posizione

Mafra, Lisbona`,
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

  const variantBTTCurto = await findOrCreateVariant({
    name: "BTT 20 km",
    distanceKm: 20,
    elevationGainM: 300,
    startTime: "09:00",
    price: 14.0,
    currency: Currency.EUR,
  });

  const variantBTTLongo = await findOrCreateVariant({
    name: "BTT 40 km",
    distanceKm: 40,
    elevationGainM: 600,
    startTime: "09:00",
    price: 14.0,
    currency: Currency.EUR,
  });

  const findOrCreatePricingPhase = async (
    variantId: string,
    phaseData: {
      name: string;
      startDate: Date;
      endDate: Date;
      price: number;
      currency: Currency;
      note?: string;
    }
  ) => {
    const existing = await prisma.pricingPhase.findFirst({
      where: {
        variantId: variantId,
        name: phaseData.name,
      },
    });
    if (existing) {
      return await prisma.pricingPhase.update({
        where: { id: existing.id },
        data: phaseData,
      });
    }
    return await prisma.pricingPhase.create({
      data: { variantId: variantId, ...phaseData },
    });
  };

  await findOrCreatePricingPhase(variantBTTCurto.id, {
    name: "1ª Fase",
    price: 14.0,
    startDate: new Date("2026-02-15T00:00:00.000Z"),
    endDate: new Date("2026-04-15T23:59:59.000Z"),
    currency: Currency.EUR,
  });

  await findOrCreatePricingPhase(variantBTTCurto.id, {
    name: "2ª Fase",
    price: 17.0,
    startDate: new Date("2026-04-16T00:00:00.000Z"),
    endDate: new Date("2026-05-06T23:59:59.000Z"),
    currency: Currency.EUR,
  });

  await findOrCreatePricingPhase(variantBTTLongo.id, {
    name: "1ª Fase",
    price: 14.0,
    startDate: new Date("2026-02-15T00:00:00.000Z"),
    endDate: new Date("2026-04-15T23:59:59.000Z"),
    currency: Currency.EUR,
  });

  await findOrCreatePricingPhase(variantBTTLongo.id, {
    name: "2ª Fase",
    price: 17.0,
    startDate: new Date("2026-04-16T00:00:00.000Z"),
    endDate: new Date("2026-05-06T23:59:59.000Z"),
    currency: Currency.EUR,
  });

  console.log("✅ Passeio da Espiga 2026 seeded!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
