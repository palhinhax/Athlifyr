/**
 * Seed: II Silgueiros Trail 2026
 */

import { PrismaClient, SportType, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding II Silgueiros Trail 2026...");

  const eventSlug = "silgueiros-trail-2026";

  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "II Silgueiros Trail",
      description:
        "II Silgueiros Trail em Viseu com percursos de Trail 21km, Mini Trail 12km e Caminhada 12km. Organizado por Silgueiros Runners. Percursos por vinhedos e paisagens da região vitivinícola do Dão.",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-02-22T09:30:00.000Z"),
      endDate: null,
      city: "Silgueiros, Viseu",
      country: "Portugal",
      latitude: 40.5825,
      longitude: -7.9545,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Silgueiros+Viseu+Portugal",
      externalUrl: "https://acorrer.pt/eventos/4093/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-02-17T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "II Silgueiros Trail",
      description:
        "II Silgueiros Trail em Viseu com percursos de Trail 21km, Mini Trail 12km e Caminhada 12km. Organizado por Silgueiros Runners. Percursos por vinhedos e paisagens da região vitivinícola do Dão.",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-02-22T09:30:00.000Z"),
      endDate: null,
      city: "Silgueiros, Viseu",
      country: "Portugal",
      latitude: 40.5825,
      longitude: -7.9545,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Silgueiros+Viseu+Portugal",
      externalUrl: "https://acorrer.pt/eventos/4093/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-02-17T23:59:59.000Z"),
    },
  });

  const translations = [
    {
      language: "pt" as const,
      title: "II Silgueiros Trail",
      city: "Silgueiros",
      metaTitle: "II Silgueiros Trail 2026 | Viseu | 22 Fevereiro",
      metaDescription:
        "II Silgueiros Trail 2026 - 22 fevereiro em Silgueiros, Viseu. Trail 21km, Mini Trail 12km e Caminhada 12km. Percursos por vinhedos do Dão. T-shirt incluída. Limite 600 participantes. Inscrições: 10-20€.",
      description: `# 🏃 II Silgueiros Trail 2026

O **II Silgueiros Trail** é organizado pela equipa **Silgueiros Runners**, em coorganização com a **Associação Passilgueirense** e a **Junta de Freguesia de Silgueiros**.

## 🍇 Descobrir Silgueiros

A **Freguesia de Silgueiros** situa-se entre as **Serras da Estrela e Caramulo**, sendo atravessada pelos Rios Dão, Pavia e Asnes. Com muito do seu território marcado pelos **vinhedos**, a freguesia dá nome a uma das sub-regiões vitivinícolas do Dão.

A partida e chegada decorrem em **Passos de Silgueiros**, na Associação Passilgueirense.

## 📅 Data e Programa

**Data:** Domingo, 22 de fevereiro de 2026

**Sexta-feira (20 Fevereiro):**
- 19:00-23:00 - Secretariado (Associação Passilgueirense)

**Sábado (21 Fevereiro):**
- 15:00-18:00 - Secretariado

**Domingo (22 Fevereiro):**
- 07:30-09:00 - Secretariado
- 09:30 - Partida para todos os percursos (diferença 1 minuto entre cada)
- 10:30 - Chegada prevista 1º atleta
- 13:00 - Entrega de prémios

## 🏃 Percursos

### Trail 21 km
Percurso cronometrado com **tempo limite de 4 horas**.
**Idade mínima:** 18 anos

### Mini Trail 12 km
Percurso cronometrado com **tempo limite de 3 horas**.
**Idade mínima:** 18 anos

### Caminhada 12 km
Percurso não cronometrado com **tempo limite de 3 horas**.
**Sem restrição de idade** (menores com autorização parental).

**Terreno:** Maioritariamente caminhos, trilhos e estradas florestais não asfaltadas, com pequenas extensões de asfalto pontualmente.

## 💰 Preços

**Trail 21 km:**
- **1ª Fase (até 31 Janeiro):** 16€
- **2ª Fase (1-17 Fevereiro):** 20€

**Mini Trail 12 km:**
- **1ª Fase (até 31 Janeiro):** 12€
- **2ª Fase (1-17 Fevereiro):** 16€

**Caminhada 12 km:**
- **1ª Fase (até 31 Janeiro):** 10€
- **2ª Fase (1-17 Fevereiro):** 14€

**Opcionais:**
- **Almoço:** 4€ (limite 300 pessoas)
- **Acompanhantes:** 6€

## 🎁 Inscrição Inclui

- ✅ Dorsal com número (exceto caminhada)
- ✅ **T-shirt do evento**
- ✅ Seguro de Acidentes Pessoais
- ✅ Abastecimentos de sólidos e líquidos
- ✅ Abastecimento na chegada
- ✅ Transporte em caso de abandono
- ✅ Acesso a balneários
- ✅ Brindes e ofertas

## 🏆 Prémios

**Trail e Mini Trail:**
- **Vouchers** para os 3 primeiros classificados da geral M/F
- **Troféus** para os 3 primeiros de cada escalão M/F
- **Voucher** para a equipa mais numerosa

## 🏅 Escalões

- **Sub-23 M/F:** 18-22 anos
- **Elites M/F:** 23-39 anos
- **Sénior M/F:** 40-44 anos
- **Masters A M/F:** 45-49 anos
- **Masters B M/F:** 50-54 anos
- **Veteranos M/F:** 55+ anos

## 👥 Participação

- **Limite:** 600 participantes
- **Idade mínima Trail:** 18 anos
- **Caminhada:** Todas as idades (menores com autorização)

## ⚙️ Material Obrigatório

- **Dorsal/peitoral visível**
- **Telemóvel**
- **Copo de hidratação**

A organização pode exigir equipamento adicional conforme condições meteorológicas.

## ⏱️ Cancelamento de Inscrição

- **Até 01/02/2026:** Devolução de 50% do valor
- **Até 07/02/2026:** Devolução de 25% do valor
- **Após fecho:** Sem devolução

## 📍 Localização

**Partida/Chegada:**
Associação C. R. Passilgueirense
Passos de Silgueiros
Viseu

**Coordenadas:** 40.582534, -7.954528

## 📞 Contactos

- **Telemóvel:** 966 232 162
- **Email:** silgueiros.trail@gmail.com

## 🍷 Tradição Vitivinícola

Desfrute dos percursos que atravessam os vinhedos da região vitivinícola de Silgueiros, sub-região do Dão, com paisagens únicas entre as Serras da Estrela e Caramulo.`,
    },
    {
      language: "en" as const,
      title: "II Silgueiros Trail",
      city: "Silgueiros",
      metaTitle: "II Silgueiros Trail 2026 | Viseu | February 22",
      metaDescription:
        "II Silgueiros Trail 2026 - February 22 in Silgueiros, Viseu. Trail 21km, Mini Trail 12km and Walk 12km. Routes through Dão vineyards. T-shirt included. Limit 600 participants. Entry: €10-20.",
      description: `# 🏃 II Silgueiros Trail 2026

The **II Silgueiros Trail** is organized by **Silgueiros Runners**, in co-organization with **Associação Passilgueirense** and **Silgueiros Parish Council**.

## 🍇 Discover Silgueiros

**Silgueiros Parish** is located between the **Serra da Estrela and Caramulo mountains**, crossed by the Dão, Pavia and Asnes rivers. Much of its territory is marked by **vineyards**, and the parish gives its name to one of the Dão wine sub-regions.

## 🏃 Routes

**Trail 21 km:** Timed route with 4-hour time limit. Minimum age: 18 years

**Mini Trail 12 km:** Timed route with 3-hour time limit. Minimum age: 18 years

**Walk 12 km:** Non-timed route with 3-hour time limit. No age restriction (minors with parental authorization).

**Terrain:** Mainly paths, trails and unpaved forest roads, with occasional short paved sections.

## 💰 Prices

**Trail 21 km:**
- Phase 1 (until Jan 31): €16
- Phase 2 (Feb 1-17): €20

**Mini Trail 12 km:**
- Phase 1 (until Jan 31): €12
- Phase 2 (Feb 1-17): €16

**Walk 12 km:**
- Phase 1 (until Jan 31): €10
- Phase 2 (Feb 1-17): €14

**Optional:**
- Lunch: €4 (limit 300 people)
- Companions: €6

## 🎁 Entry Includes

- Race bib with number (except walk)
- **Event t-shirt**
- Personal Accident Insurance
- Solid and liquid refreshments
- Finish line refreshments
- Transport in case of abandonment
- Access to showers
- Gifts

## 🏆 Prizes

**Trail and Mini Trail:**
- **Vouchers** for top 3 overall M/F
- **Trophies** for top 3 in each category M/F
- **Voucher** for largest team

## 👥 Participation

- **Limit:** 600 participants
- **Minimum age Trail:** 18 years
- **Walk:** All ages (minors with authorization)

## 📍 Location

**Start/Finish:**
Associação C. R. Passilgueirense
Passos de Silgueiros
Viseu, Portugal

## 📞 Contacts

- **Phone:** +351 966 232 162
- **Email:** silgueiros.trail@gmail.com`,
    },
    {
      language: "es" as const,
      title: "II Silgueiros Trail",
      city: "Silgueiros",
      metaTitle: "II Silgueiros Trail 2026 | Viseu | 22 Febrero",
      metaDescription:
        "II Silgueiros Trail 2026 - 22 febrero en Silgueiros, Viseu. Trail 21km, Mini Trail 12km y Caminata 12km. Recorridos por viñedos del Dão. Camiseta incluida. Límite 600 participantes. Inscripciones: 10-20€.",
      description: `# 🏃 II Silgueiros Trail 2026

## 📞 Contactos

- **Teléfono:** +351 966 232 162
- **Email:** silgueiros.trail@gmail.com`,
    },
    {
      language: "fr" as const,
      title: "II Silgueiros Trail",
      city: "Silgueiros",
      metaTitle: "II Silgueiros Trail 2026 | Viseu | 22 Février",
      metaDescription:
        "II Silgueiros Trail 2026 - 22 février à Silgueiros, Viseu. Trail 21km, Mini Trail 12km et Marche 12km. Parcours à travers les vignobles du Dão. T-shirt inclus. Limite 600 participants. Inscription: 10-20€.",
      description: `# 🏃 II Silgueiros Trail 2026

## 📞 Contacts

- **Téléphone:** +351 966 232 162
- **Email:** silgueiros.trail@gmail.com`,
    },
    {
      language: "de" as const,
      title: "II Silgueiros Trail",
      city: "Silgueiros",
      metaTitle: "II Silgueiros Trail 2026 | Viseu | 22. Februar",
      metaDescription:
        "II Silgueiros Trail 2026 - 22. Februar in Silgueiros, Viseu. Trail 21km, Mini Trail 12km und Wanderung 12km. Strecken durch Dão-Weinberge. T-Shirt inklusive. Limit 600 Teilnehmer. Anmeldung: 10-20€.",
      description: `# 🏃 II Silgueiros Trail 2026

## 📞 Kontakte

- **Telefon:** +351 966 232 162
- **Email:** silgueiros.trail@gmail.com`,
    },
    {
      language: "it" as const,
      title: "II Silgueiros Trail",
      city: "Silgueiros",
      metaTitle: "II Silgueiros Trail 2026 | Viseu | 22 Febbraio",
      metaDescription:
        "II Silgueiros Trail 2026 - 22 febbraio a Silgueiros, Viseu. Trail 21km, Mini Trail 12km e Camminata 12km. Percorsi attraverso i vigneti del Dão. Maglietta inclusa. Limite 600 partecipanti. Iscrizione: 10-20€.",
      description: `# 🏃 II Silgueiros Trail 2026

## 📞 Contatti

- **Telefono:** +351 966 232 162
- **Email:** silgueiros.trail@gmail.com`,
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

  const variantTrail21 = await findOrCreateVariant({
    name: "Trail 21 km",
    distanceKm: 21,
    elevationGainM: 600,
    startTime: "09:30",
    maxParticipants: 200,
    price: 16.0,
    currency: Currency.EUR,
  });

  const variantMiniTrail12 = await findOrCreateVariant({
    name: "Mini Trail 12 km",
    distanceKm: 12,
    elevationGainM: 350,
    startTime: "09:31",
    maxParticipants: 200,
    price: 12.0,
    currency: Currency.EUR,
  });

  const variantCaminhada12 = await findOrCreateVariant({
    name: "Caminhada 12 km",
    distanceKm: 12,
    elevationGainM: 300,
    startTime: "09:32",
    maxParticipants: 200,
    price: 10.0,
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

  // Trail 21 km pricing phases
  await findOrCreatePricingPhase(variantTrail21.id, {
    name: "1ª Fase",
    price: 16.0,
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    endDate: new Date("2026-01-31T23:59:59.000Z"),
    currency: Currency.EUR,
  });

  await findOrCreatePricingPhase(variantTrail21.id, {
    name: "2ª Fase",
    price: 20.0,
    startDate: new Date("2026-02-01T00:00:00.000Z"),
    endDate: new Date("2026-02-17T23:59:59.000Z"),
    currency: Currency.EUR,
  });

  // Mini Trail 12 km pricing phases
  await findOrCreatePricingPhase(variantMiniTrail12.id, {
    name: "1ª Fase",
    price: 12.0,
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    endDate: new Date("2026-01-31T23:59:59.000Z"),
    currency: Currency.EUR,
  });

  await findOrCreatePricingPhase(variantMiniTrail12.id, {
    name: "2ª Fase",
    price: 16.0,
    startDate: new Date("2026-02-01T00:00:00.000Z"),
    endDate: new Date("2026-02-17T23:59:59.000Z"),
    currency: Currency.EUR,
  });

  // Caminhada 12 km pricing phases
  await findOrCreatePricingPhase(variantCaminhada12.id, {
    name: "1ª Fase",
    price: 10.0,
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    endDate: new Date("2026-01-31T23:59:59.000Z"),
    currency: Currency.EUR,
  });

  await findOrCreatePricingPhase(variantCaminhada12.id, {
    name: "2ª Fase",
    price: 14.0,
    startDate: new Date("2026-02-01T00:00:00.000Z"),
    endDate: new Date("2026-02-17T23:59:59.000Z"),
    currency: Currency.EUR,
  });

  console.log("✅ II Silgueiros Trail 2026 seeded!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
