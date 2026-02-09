/**
 * Seed: Anta Trail de Pavia 2026
 */

import { PrismaClient, SportType, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Anta Trail de Pavia 2026...");

  const eventSlug = "anta-trail-pavia-2026";

  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "Anta Trail de Pavia",
      description:
        "1ª Edição do Anta Trail de Pavia. Trail running em Pavia, Terra de Poetas e Pintores. Percursos pelos trilhos do Neolítico: Caminhada 11km, Mini Trail 12km, Sprint 18km e Longo 30km. Organizado pelo Grupo Desportivo de Pavia.",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-03-01T09:00:00.000Z"),
      endDate: null,
      city: "Pavia",
      country: "Portugal",
      latitude: 38.8947,
      longitude: -8.0172,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=38.8947,-8.0172",
      externalUrl: "https://acorrer.pt/eventos/4065/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-02-22T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "Anta Trail de Pavia",
      description:
        "1ª Edição do Anta Trail de Pavia. Trail running em Pavia, Terra de Poetas e Pintores. Percursos pelos trilhos do Neolítico: Caminhada 11km, Mini Trail 12km, Sprint 18km e Longo 30km. Organizado pelo Grupo Desportivo de Pavia.",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-03-01T09:00:00.000Z"),
      endDate: null,
      city: "Pavia",
      country: "Portugal",
      latitude: 38.8947,
      longitude: -8.0172,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=38.8947,-8.0172",
      externalUrl: "https://acorrer.pt/eventos/4065/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-02-22T23:59:59.000Z"),
    },
  });

  const translations = [
    {
      language: "pt" as const,
      title: "Anta Trail de Pavia",
      city: "Pavia",
      metaTitle: "Anta Trail de Pavia 2026 | Évora | 1 Março",
      metaDescription:
        "Anta Trail de Pavia 2026 - 1 março em Pavia, Évora. 1ª Edição. Trail 30km, Sprint 18km, Mini 12km e Caminhada 11km. Trilhos do Neolítico. Cronometragem electrónica. Inscrições: 7-18€.",
      description: `# 🏃 Anta Trail de Pavia 2026
## 1ª Edição - Terra de Poetas e Pintores

O **Anta Trail de Pavia** é uma prova de **Trail Running** que se realiza em **Pavia**, Terra de Poetas e Pintores, percorrendo os **trilhos do Neolítico** e as exigentes margens da **Ribeira de Tera**.

## 🏛️ Património Neolítico

Evento com **três distâncias de trail** e uma **caminhada** em terrenos rurais, cujo objetivo é dar a conhecer aos participantes alguns dos mais **emblemáticos trilhos e monumentos do Neolítico** existentes na região.

Organizado pelo **Grupo Desportivo de Pavia** com apoio da **Câmara Municipal de Mora**, **Junta de Freguesia de Pavia** e cronometragem **Acorrer**.

## 📅 Data e Programa

**Data:** Domingo, 1 de março de 2026

**Sexta-feira (28 Fevereiro):**
- 15:00-18:00 - Secretariado (Museu de Pavia)

**Domingo (1 Março):**
- 07:00-08:30 - Secretariado (Museu de Pavia)
- 08:50 - Briefing Trail Longo
- 09:00 - **Partida Trail Longo 30km**
- 09:10 - Briefing Trail Sprint
- 09:20 - **Partida Trail Sprint 18km**
- 09:30 - Briefing Mini Trail
- 09:40 - **Partida Mini Trail 12km**
- 09:50 - **Partida Caminhada 11km**
- 13:00 - Cerimónia de entrega de prémios
- 15:00 - Fecho do evento

## 🏃 Percursos

### Trail Longo 30 km
**Tempo limite:** 5 horas (2h ao checkpoint 12km)
**Idade mínima:** 18 anos
**Desnível positivo:** ~1200m

### Trail Sprint 18 km
**Tempo limite:** 3 horas
**Idade mínima:** 18 anos
**Desnível positivo:** ~700m

### Mini Trail 12 km
**Tempo limite:** 2h40min
**Idade mínima:** 16 anos (com autorização parental)
**Desnível positivo:** ~450m

### Caminhada 11 km
**Tempo limite:** 2h45min
**Sem restrição de idade**
**Desnível positivo:** ~400m

**Partida:** Perto da Anta de Pavia
**Chegada:** Coreto de Pavia (Largo da Junta de Freguesia)

**Terreno:** Trilhos do Neolítico, margens da Ribeira de Tera, com **travessias aquáticas** e zonas técnicas.

## 💰 Preços

**Trail Longo 30 km:**
- **1ª Fase (até 31 Dezembro 2025):** 14€
- **2ª Fase (até 31 Janeiro 2026):** 16€
- **3ª Fase (até 22 Fevereiro 2026):** 18€
- **Vagas:** 200

**Trail Sprint 18 km:**
- **1ª Fase:** 12€
- **2ª Fase:** 14€
- **3ª Fase:** 16€
- **Vagas:** 400

**Mini Trail 12 km:**
- **1ª Fase:** 10€
- **2ª Fase:** 12€
- **3ª Fase:** 14€
- **Vagas:** 300

**Caminhada 11 km:**
- **1ª Fase:** 7€
- **2ª Fase:** 8€
- **3ª Fase:** 9€
- **Vagas:** 1000

**Opcionais:**
- **Almoço:** 5€
- **Acompanhantes:** 7€

## 🎁 Inscrição Inclui

- ✅ Peitoral personalizado com chip (excepto caminhada)
- ✅ **Abastecimentos sólidos e líquidos** durante e no final
- ✅ **Cronometragem electrónica** com resultados online
- ✅ Seguro desportivo
- ✅ **Banhos quentes** no final (11h00-15h00)
- ✅ **Prémio Finisher**

## 🏆 Prémios

**Trail Longo e Sprint:**
- Prémios para classificação geral M/F
- Prémios por escalão M/F
- Prémios para as 3 primeiras equipas M/F

**Mini Trail:**
- Prémios apenas para os 3 primeiros M/F

## 🏅 Escalões

**Mini Trail:**
- Sub 23 M/F: 16-22 anos
- Seniores M/F: 23-39 anos
- Masters M/F: 40-49, 50-59, 60-99 anos

**Trail Sprint e Longo:**
- Sub 23 M/F: 18-22 anos
- Seniores M/F: 23-39 anos
- Masters M/F: 40-49, 50-59, 60-99 anos

Data de referência: 30/09/2026

## ⚙️ Material Obrigatório

Para **TODAS** as distâncias (incluindo caminhada):
- ✅ **Manta térmica**
- ✅ **Apito**
- ✅ **Documento de identificação**
- ✅ **Recipiente mínimo 500ml**
- ✅ **Telemóvel com bateria**
- ✅ **Dorsal visível**
- ⚠️ Vestuário apropriado (aconselhado)

**Importante:** A não utilização do material obrigatório leva à **desqualificação direta**.

## 🚰 Abastecimentos

**Trail Longo 30km:** 5 postos (~6km, ~12km, ~18km, ~24km, ~30km)
**Trail Sprint 18km:** 3 postos (~6km, ~12km, ~18km)
**Mini Trail 12km:** 2 postos (~6km, ~12km)
**Caminhada 11km:** 2 postos (~5.5km, ~11km)

## 👥 Participação

- **Total vagas:** 1900 participantes
- **Idade mínima Trail:** 18 anos
- **Idade mínima Mini:** 16 anos (com autorização)
- **Caminhada:** Todas as idades

## ⏱️ Cancelamento de Inscrição

- **Até 22/02/2026:** Devolução de 70% do valor
- **Após fecho:** Sem devolução nem transmissão de inscrições
- **Cancelamento por organização:** Transferência para nova data ou devolução de 70%

## 📍 Localização

**Partida:** Anta de Pavia
**Chegada:** Coreto de Pavia
**Secretariado:** Museu de Pavia

**Largo Manuel José Casimiro**
7490-424 Pavia
**Coordenadas:** 38°53'41"N 8°01'02"W

## 📞 Contactos

- **Direção Técnica:** 933 338 409
- **Presidência GD Pavia:** 914 821 625
- **Email:** antatrailpavia@gmail.com
- **Instagram:** @antatrailpavia

## 🌿 Responsabilidade Ambiental

O atleta é o **único responsável** pelo transporte de todos os invólucros e resíduos. Deverá depositar os resíduos no abastecimento mais próximo ou transportá-los até à meta.

## 🏛️ Descobre Pavia

Pavia, **Terra de Poetas e Pintores**, convida-te a descobrir os seus trilhos históricos do Neolítico, passando por **antas** e monumentos megalíticos, numa experiência única que combina desporto, natureza e cultura milenar.`,
    },
    {
      language: "en" as const,
      title: "Anta Trail de Pavia",
      city: "Pavia",
      metaTitle: "Anta Trail de Pavia 2026 | Évora | March 1",
      metaDescription:
        "Anta Trail de Pavia 2026 - March 1 in Pavia, Évora. 1st Edition. Trail 30km, Sprint 18km, Mini 12km and Walk 11km. Neolithic trails. Electronic timing. Entry: €7-18.",
      description: `# 🏃 Anta Trail de Pavia 2026
## 1st Edition - Land of Poets and Painters

**Anta Trail de Pavia** is a **Trail Running** event in **Pavia**, Land of Poets and Painters, following **Neolithic trails** and the challenging banks of **Ribeira de Tera**.

## 🏛️ Neolithic Heritage

Event with **three trail distances** and one **walk** through rural terrain, aiming to showcase participants some of the most **emblematic Neolithic trails and monuments** in the region.

Organized by **Grupo Desportivo de Pavia** with support from **Mora City Council**, **Pavia Parish Council** and timing by **Acorrer**.

## 🏃 Routes

**Long Trail 30 km:** Time limit 5 hours (2h at 12km checkpoint). Min age: 18 years. ~1200m elevation

**Sprint Trail 18 km:** Time limit 3 hours. Min age: 18 years. ~700m elevation

**Mini Trail 12 km:** Time limit 2h40min. Min age: 16 years (with parental authorization). ~450m elevation

**Walk 11 km:** Time limit 2h45min. No age restriction. ~400m elevation

**Start:** Near Anta de Pavia
**Finish:** Coreto de Pavia (Parish Square)

**Terrain:** Neolithic trails, Ribeira de Tera banks, with **water crossings** and technical sections.

## 💰 Prices

**Long Trail 30 km:**
- Phase 1 (until Dec 31, 2025): €14
- Phase 2 (until Jan 31, 2026): €16
- Phase 3 (until Feb 22, 2026): €18
- Slots: 200

**Sprint Trail 18 km:**
- Phase 1: €12
- Phase 2: €14
- Phase 3: €16
- Slots: 400

**Mini Trail 12 km:**
- Phase 1: €10
- Phase 2: €12
- Phase 3: €14
- Slots: 300

**Walk 11 km:**
- Phase 1: €7
- Phase 2: €8
- Phase 3: €9
- Slots: 1000

**Optional:**
- Lunch: €5
- Companions: €7

## 🎁 Entry Includes

- Personalized race bib with chip (except walk)
- **Solid and liquid refreshments** during and at finish
- **Electronic timing** with online results
- Sports insurance
- **Hot showers** at finish (11am-3pm)
- **Finisher prize**

## ⚙️ Mandatory Equipment

For **ALL** distances (including walk):
- ✅ **Thermal blanket**
- ✅ **Whistle**
- ✅ **ID document**
- ✅ **500ml minimum container**
- ✅ **Mobile phone with battery**
- ✅ **Visible race bib**
- ⚠️ Appropriate clothing (recommended)

**Important:** Not using mandatory equipment leads to **direct disqualification**.

## 👥 Participation

- **Total slots:** 1900 participants
- **Minimum age Trail:** 18 years
- **Minimum age Mini:** 16 years (with authorization)
- **Walk:** All ages

## 📍 Location

**Start:** Anta de Pavia
**Finish:** Coreto de Pavia
**Registration:** Museu de Pavia

Largo Manuel José Casimiro
7490-424 Pavia, Portugal
**Coordinates:** 38°53'41"N 8°01'02"W

## 📞 Contacts

- **Technical Direction:** +351 933 338 409
- **GD Pavia President:** +351 914 821 625
- **Email:** antatrailpavia@gmail.com
- **Instagram:** @antatrailpavia

## 🏛️ Discover Pavia

Pavia, **Land of Poets and Painters**, invites you to discover its historic Neolithic trails, passing by **dolmens** and megalithic monuments, in a unique experience combining sport, nature and millenary culture.`,
    },
    {
      language: "es" as const,
      title: "Anta Trail de Pavia",
      city: "Pavia",
      metaTitle: "Anta Trail de Pavia 2026 | Évora | 1 Marzo",
      metaDescription:
        "Anta Trail de Pavia 2026 - 1 marzo en Pavia, Évora. 1ª Edición. Trail 30km, Sprint 18km, Mini 12km y Caminata 11km. Senderos neolíticos. Cronometraje electrónico. Inscripciones: 7-18€.",
      description: `# 🏃 Anta Trail de Pavia 2026

## 📞 Contactos

- **Dirección Técnica:** +351 933 338 409
- **Presidencia GD Pavia:** +351 914 821 625
- **Email:** antatrailpavia@gmail.com
- **Instagram:** @antatrailpavia`,
    },
    {
      language: "fr" as const,
      title: "Anta Trail de Pavia",
      city: "Pavia",
      metaTitle: "Anta Trail de Pavia 2026 | Évora | 1 Mars",
      metaDescription:
        "Anta Trail de Pavia 2026 - 1 mars à Pavia, Évora. 1ère Édition. Trail 30km, Sprint 18km, Mini 12km et Marche 11km. Sentiers néolithiques. Chronométrage électronique. Inscription: 7-18€.",
      description: `# 🏃 Anta Trail de Pavia 2026

## 📞 Contacts

- **Direction Technique:** +351 933 338 409
- **Présidence GD Pavia:** +351 914 821 625
- **Email:** antatrailpavia@gmail.com
- **Instagram:** @antatrailpavia`,
    },
    {
      language: "de" as const,
      title: "Anta Trail de Pavia",
      city: "Pavia",
      metaTitle: "Anta Trail de Pavia 2026 | Évora | 1. März",
      metaDescription:
        "Anta Trail de Pavia 2026 - 1. März in Pavia, Évora. 1. Ausgabe. Trail 30km, Sprint 18km, Mini 12km und Wanderung 11km. Jungsteinzeitliche Pfade. Elektronische Zeitmessung. Anmeldung: 7-18€.",
      description: `# 🏃 Anta Trail de Pavia 2026

## 📞 Kontakte

- **Technische Leitung:** +351 933 338 409
- **GD Pavia Präsident:** +351 914 821 625
- **Email:** antatrailpavia@gmail.com
- **Instagram:** @antatrailpavia`,
    },
    {
      language: "it" as const,
      title: "Anta Trail de Pavia",
      city: "Pavia",
      metaTitle: "Anta Trail de Pavia 2026 | Évora | 1 Marzo",
      metaDescription:
        "Anta Trail de Pavia 2026 - 1 marzo a Pavia, Évora. 1ª Edizione. Trail 30km, Sprint 18km, Mini 12km e Camminata 11km. Sentieri neolitici. Cronometraggio elettronico. Iscrizione: 7-18€.",
      description: `# 🏃 Anta Trail de Pavia 2026

## 📞 Contatti

- **Direzione Tecnica:** +351 933 338 409
- **Presidente GD Pavia:** +351 914 821 625
- **Email:** antatrailpavia@gmail.com
- **Instagram:** @antatrailpavia`,
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

  const variantLongo30 = await findOrCreateVariant({
    name: "Trail Longo 30 km",
    distanceKm: 30,
    elevationGainM: 1200,
    startTime: "09:00",
    maxParticipants: 200,
    price: 14.0,
    currency: Currency.EUR,
  });

  const variantSprint18 = await findOrCreateVariant({
    name: "Trail Sprint 18 km",
    distanceKm: 18,
    elevationGainM: 700,
    startTime: "09:20",
    maxParticipants: 400,
    price: 12.0,
    currency: Currency.EUR,
  });

  const variantMini12 = await findOrCreateVariant({
    name: "Mini Trail 12 km",
    distanceKm: 12,
    elevationGainM: 450,
    startTime: "09:40",
    maxParticipants: 300,
    price: 10.0,
    currency: Currency.EUR,
  });

  const variantCaminhada11 = await findOrCreateVariant({
    name: "Caminhada 11 km",
    distanceKm: 11,
    elevationGainM: 400,
    startTime: "09:50",
    maxParticipants: 1000,
    price: 7.0,
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

  // Trail Longo 30 km pricing phases
  await findOrCreatePricingPhase(variantLongo30.id, {
    name: "1ª Fase",
    price: 14.0,
    startDate: new Date("2025-11-01T00:00:00.000Z"),
    endDate: new Date("2025-12-31T23:59:59.000Z"),
    currency: Currency.EUR,
  });

  await findOrCreatePricingPhase(variantLongo30.id, {
    name: "2ª Fase",
    price: 16.0,
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    endDate: new Date("2026-01-31T23:59:59.000Z"),
    currency: Currency.EUR,
  });

  await findOrCreatePricingPhase(variantLongo30.id, {
    name: "3ª Fase",
    price: 18.0,
    startDate: new Date("2026-02-01T00:00:00.000Z"),
    endDate: new Date("2026-02-22T23:59:59.000Z"),
    currency: Currency.EUR,
  });

  // Trail Sprint 18 km pricing phases
  await findOrCreatePricingPhase(variantSprint18.id, {
    name: "1ª Fase",
    price: 12.0,
    startDate: new Date("2025-11-01T00:00:00.000Z"),
    endDate: new Date("2025-12-31T23:59:59.000Z"),
    currency: Currency.EUR,
  });

  await findOrCreatePricingPhase(variantSprint18.id, {
    name: "2ª Fase",
    price: 14.0,
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    endDate: new Date("2026-01-31T23:59:59.000Z"),
    currency: Currency.EUR,
  });

  await findOrCreatePricingPhase(variantSprint18.id, {
    name: "3ª Fase",
    price: 16.0,
    startDate: new Date("2026-02-01T00:00:00.000Z"),
    endDate: new Date("2026-02-22T23:59:59.000Z"),
    currency: Currency.EUR,
  });

  // Mini Trail 12 km pricing phases
  await findOrCreatePricingPhase(variantMini12.id, {
    name: "1ª Fase",
    price: 10.0,
    startDate: new Date("2025-11-01T00:00:00.000Z"),
    endDate: new Date("2025-12-31T23:59:59.000Z"),
    currency: Currency.EUR,
  });

  await findOrCreatePricingPhase(variantMini12.id, {
    name: "2ª Fase",
    price: 12.0,
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    endDate: new Date("2026-01-31T23:59:59.000Z"),
    currency: Currency.EUR,
  });

  await findOrCreatePricingPhase(variantMini12.id, {
    name: "3ª Fase",
    price: 14.0,
    startDate: new Date("2026-02-01T00:00:00.000Z"),
    endDate: new Date("2026-02-22T23:59:59.000Z"),
    currency: Currency.EUR,
  });

  // Caminhada 11 km pricing phases
  await findOrCreatePricingPhase(variantCaminhada11.id, {
    name: "1ª Fase",
    price: 7.0,
    startDate: new Date("2025-11-01T00:00:00.000Z"),
    endDate: new Date("2025-12-31T23:59:59.000Z"),
    currency: Currency.EUR,
  });

  await findOrCreatePricingPhase(variantCaminhada11.id, {
    name: "2ª Fase",
    price: 8.0,
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    endDate: new Date("2026-01-31T23:59:59.000Z"),
    currency: Currency.EUR,
  });

  await findOrCreatePricingPhase(variantCaminhada11.id, {
    name: "3ª Fase",
    price: 9.0,
    startDate: new Date("2026-02-01T00:00:00.000Z"),
    endDate: new Date("2026-02-22T23:59:59.000Z"),
    currency: Currency.EUR,
  });

  console.log("✅ Anta Trail de Pavia 2026 seeded!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
