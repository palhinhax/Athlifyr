/**
 * Seed: Vº Trilho Herdade dos Hospitais 2026
 */

import { PrismaClient, SportType, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Vº Trilho Herdade dos Hospitais 2026...");

  const eventSlug = "trilho-herdade-hospitais-2026";

  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "Vº Trilho Herdade dos Hospitais",
      description:
        "5ª Edição do Trilho Herdade dos Hospitais em Montemor-o-Novo. Organizado pela Equimor. Trilho 16km, Mini Trilho 10km e Caminhada 7km. Percursos combinam corrida com superação de obstáculos naturais e arquitectónicos. No dia após Raid Equestre Internacional.",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-03-08T09:15:00.000Z"),
      endDate: null,
      city: "Montemor-o-Novo",
      country: "Portugal",
      latitude: 38.65,
      longitude: -8.2167,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Herdade+dos+Hospitais+Montemor+o+Novo+Portugal",
      externalUrl: "https://acorrer.pt/eventos/4162/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-03-01T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "Vº Trilho Herdade dos Hospitais",
      description:
        "5ª Edição do Trilho Herdade dos Hospitais em Montemor-o-Novo. Organizado pela Equimor. Trilho 16km, Mini Trilho 10km e Caminhada 7km. Percursos combinam corrida com superação de obstáculos naturais e arquitectónicos. No dia após Raid Equestre Internacional.",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-03-08T09:15:00.000Z"),
      endDate: null,
      city: "Montemor-o-Novo",
      country: "Portugal",
      latitude: 38.65,
      longitude: -8.2167,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Herdade+dos+Hospitais+Montemor+o+Novo+Portugal",
      externalUrl: "https://acorrer.pt/eventos/4162/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-03-01T23:59:59.000Z"),
    },
  });

  const translations = [
    {
      language: "pt" as const,
      title: "Vº Trilho Herdade dos Hospitais",
      city: "Montemor-o-Novo",
      metaTitle:
        "Vº Trilho Herdade dos Hospitais 2026 | Montemor-o-Novo | 8 Março",
      metaDescription:
        "Vº Trilho Herdade dos Hospitais 2026 - 8 março em Montemor-o-Novo. 5ª Edição pela Equimor. Trilho 16km, Mini 10km e Caminhada 7km. Obstáculos naturais. Após Raid Equestre. Inscrições: 8-14€.",
      description: `# 🏃 Vº Trilho Herdade dos Hospitais 2026
## 5ª Edição - Sonhos e Troféus Equimor

O **5º Trilho Herdade dos Hospitais** é organizado pela **Sonhos e Troféus associação equestre - Equimor** e realiza-se em **Montemor-o-Novo**, na **Herdade dos Hospitais**.

## 🐴 Evento Especial

Esta prova realiza-se no **dia seguinte a um Raid Equestre Internacional**, no mesmo local, permitindo aos participantes experimentar percursos que **combinam corrida com superação de obstáculos naturais e arquitectónicos** dentro da histórica Herdade dos Hospitais.

## 📅 Data e Programa

**Data:** Domingo, 8 de março de 2026

**Sábado (7 Março):**
- 15:00-19:00 - Secretariado (Herdade dos Hospitais)

**Domingo (8 Março):**
- 07:30 - Abertura do secretariado
- 08:45 - **Aquecimento coletivo**
- 09:15 - **Partida Trilho 16km**
- 09:30 - **Partida Mini Trilho 10km**
- 09:45 - **Partida Caminhada 7km**
- 11:30 - Início da entrega de prémios

O programa pode sofrer alterações.

## 🏃 Percursos

### Trilho 16 km
**Idade mínima:** 16 anos
**Desnível positivo:** ~500m
Percurso com **obstáculos naturais e arquitectónicos**

### Mini Trilho 10 km
**Idade mínima:** 16 anos
**Desnível positivo:** ~300m
Percurso com **obstáculos naturais**

### Caminhada 7 km
**Sem restrição de idade**
**Cães permitidos** na caminhada
**Desnível positivo:** ~200m

**Partida/Chegada:** Herdade dos Hospitais, Montemor-o-Novo

**Terreno:** Percursos marcados com setas, fitas e indicações específicas de fácil identificação.

## 💰 Preços

**Trilho 16 km:**
- **1ª Fase (até 8 Fevereiro):** 12€
- **2ª Fase (até 1 Março):** 14€

**Mini Trilho 10 km:**
- **1ª Fase (até 8 Fevereiro):** 10€
- **2ª Fase (até 1 Março):** 12€

**Caminhada 7 km:**
- **1ª Fase (até 8 Fevereiro):** 8€
- **2ª Fase (até 1 Março):** 10€

**Opcionais:**
- **Almoço:** 5€
- **Acompanhantes:** 5€

## 🎁 Inscrição Inclui

- ✅ Dorsal com chip (Trilho e Mini Trilho)
- ✅ Dorsal sem chip (Caminhada)
- ✅ **T-shirt técnica**
- ✅ **Abastecimentos sólidos e líquidos** (zonas de assistência e final)
- ✅ Seguro desportivo
- ✅ Apoio técnico e logístico
- ✅ Primeiros socorros
- ✅ Outros brindes

## 🏆 Prémios

**Trilho 16km e Mini Trilho 10km:**
- Prémios para os **3 primeiros absolutos M/F**
- Prémios para os **3 primeiros de cada escalão M/F**
- Prémio para a **melhor equipa** (3 melhores resultados individuais)
- **Prémio especial** para o concorrente M/F **com mais idade**

**Caminhada:** Sem classificação

## 🏅 Escalões

**Trilho 16km e Mini Trilho 10km:**
- **Sub 23 M/F:** 16-22 anos
- **Sénior M/F:** 23-39 anos
- **Veteranos I M/F:** 40-49 anos
- **Veteranos II M/F:** 50-59 anos
- **Veteranos III M/F:** 60+ anos

## 👥 Participação

- **Trilho e Mini Trilho:** 16+ anos
- **Caminhada:** Todas as idades, cães permitidos

## 🏇 Responsabilidade do Atleta

**Ética Desportiva:** O evento é regido pelos princípios da ética desportiva.

**Obrigatório:** Prestação de auxílio em situações de perigo, informando elementos no ponto de controlo mais próximo.

**Proibido:**
- Destruir ou alterar elementos naturais (muros, plantações, sinalética)
- Comportamento inadequado ou linguagem ofensiva
- Deixar lixo nos locais de passagem

## 📍 Localização

**Local:**
Herdade dos Hospitais
Montemor-o-Novo
Évora

**Banhos:** Pavilhão Municipal

## 📞 Contactos

- **Telemóveis:** 919 244 050 | 919 293 239
- **Email:** geral@equimor.pt
- **Website:** www.acorrer.pt

## 🏛️ Herdade dos Hospitais

A **Herdade dos Hospitais** é uma propriedade histórica em Montemor-o-Novo, conhecida pelos seus eventos equestres internacionais. Os percursos do trilho aproveitam a beleza natural e as características únicas desta herdade alentejana.`,
    },
    {
      language: "en" as const,
      title: "Vº Herdade dos Hospitais Trail",
      city: "Montemor-o-Novo",
      metaTitle:
        "Vº Herdade dos Hospitais Trail 2026 | Montemor-o-Novo | March 8",
      metaDescription:
        "Vº Herdade dos Hospitais Trail 2026 - March 8 in Montemor-o-Novo. 5th Edition by Equimor. Trail 16km, Mini 10km and Walk 7km. Natural obstacles. After Equestrian Raid. Entry: €8-14.",
      description: `# 🏃 Vº Herdade dos Hospitais Trail 2026
## 5th Edition - Sonhos e Troféus Equimor

The **5th Herdade dos Hospitais Trail** is organized by **Sonhos e Troféus equestrian association - Equimor** and takes place in **Montemor-o-Novo**, at **Herdade dos Hospitais**.

## 🐴 Special Event

This race takes place the **day after an International Equestrian Raid**, at the same location, allowing participants to experience routes that **combine running with overcoming natural and architectural obstacles** within the historic Herdade dos Hospitais.

## 🏃 Routes

**Trail 16 km:** Min age 16 years. ~500m elevation. Route with **natural and architectural obstacles**

**Mini Trail 10 km:** Min age 16 years. ~300m elevation. Route with **natural obstacles**

**Walk 7 km:** No age restriction. **Dogs allowed** on walk. ~200m elevation

**Start/Finish:** Herdade dos Hospitais, Montemor-o-Novo

## 💰 Prices

**Trail 16 km:**
- Phase 1 (until Feb 8): €12
- Phase 2 (until Mar 1): €14

**Mini Trail 10 km:**
- Phase 1 (until Feb 8): €10
- Phase 2 (until Mar 1): €12

**Walk 7 km:**
- Phase 1 (until Feb 8): €8
- Phase 2 (until Mar 1): €10

**Optional:**
- Lunch: €5
- Companions: €5

## 🎁 Entry Includes

- Race bib with chip (Trail and Mini Trail)
- Race bib without chip (Walk)
- **Technical t-shirt**
- **Solid and liquid refreshments** (aid stations and finish)
- Sports insurance
- Technical and logistical support
- First aid
- Other gifts

## 🏆 Prizes

**Trail 16km and Mini Trail 10km:**
- Prizes for **top 3 overall M/F**
- Prizes for **top 3 in each category M/F**
- Prize for **best team** (3 best individual results)
- **Special prize** for **oldest M/F** participant

**Walk:** No classification

## 👥 Participation

- **Trail and Mini Trail:** 16+ years
- **Walk:** All ages, dogs allowed

## 📍 Location

**Venue:**
Herdade dos Hospitais
Montemor-o-Novo
Évora, Portugal

**Showers:** Municipal Pavilion

## 📞 Contacts

- **Phones:** +351 919 244 050 | +351 919 293 239
- **Email:** geral@equimor.pt
- **Website:** www.acorrer.pt

## 🏛️ Herdade dos Hospitais

**Herdade dos Hospitais** is a historic property in Montemor-o-Novo, known for its international equestrian events. The trail routes take advantage of the natural beauty and unique characteristics of this Alentejo estate.`,
    },
    {
      language: "es" as const,
      title: "Vº Sendero Herdade dos Hospitais",
      city: "Montemor-o-Novo",
      metaTitle:
        "Vº Sendero Herdade dos Hospitais 2026 | Montemor-o-Novo | 8 Marzo",
      metaDescription:
        "Vº Sendero Herdade dos Hospitais 2026 - 8 marzo en Montemor-o-Novo. 5ª Edición por Equimor. Sendero 16km, Mini 10km y Caminata 7km. Obstáculos naturales. Después de Raid Ecuestre. Inscripciones: 8-14€.",
      description: `# 🏃 Vº Sendero Herdade dos Hospitais 2026

## 📞 Contactos

- **Teléfonos:** +351 919 244 050 | +351 919 293 239
- **Email:** geral@equimor.pt`,
    },
    {
      language: "fr" as const,
      title: "Vº Sentier Herdade dos Hospitais",
      city: "Montemor-o-Novo",
      metaTitle:
        "Vº Sentier Herdade dos Hospitais 2026 | Montemor-o-Novo | 8 Mars",
      metaDescription:
        "Vº Sentier Herdade dos Hospitais 2026 - 8 mars à Montemor-o-Novo. 5ème Édition par Equimor. Sentier 16km, Mini 10km et Marche 7km. Obstacles naturels. Après Raid Équestre. Inscription: 8-14€.",
      description: `# 🏃 Vº Sentier Herdade dos Hospitais 2026

## 📞 Contacts

- **Téléphones:** +351 919 244 050 | +351 919 293 239
- **Email:** geral@equimor.pt`,
    },
    {
      language: "de" as const,
      title: "Vº Pfad Herdade dos Hospitais",
      city: "Montemor-o-Novo",
      metaTitle:
        "Vº Pfad Herdade dos Hospitais 2026 | Montemor-o-Novo | 8. März",
      metaDescription:
        "Vº Pfad Herdade dos Hospitais 2026 - 8. März in Montemor-o-Novo. 5. Ausgabe von Equimor. Pfad 16km, Mini 10km und Wanderung 7km. Natürliche Hindernisse. Nach Reiterlichen Raid. Anmeldung: 8-14€.",
      description: `# 🏃 Vº Pfad Herdade dos Hospitais 2026

## 📞 Kontakte

- **Telefone:** +351 919 244 050 | +351 919 293 239
- **Email:** geral@equimor.pt`,
    },
    {
      language: "it" as const,
      title: "Vº Sentiero Herdade dos Hospitais",
      city: "Montemor-o-Novo",
      metaTitle:
        "Vº Sentiero Herdade dos Hospitais 2026 | Montemor-o-Novo | 8 Marzo",
      metaDescription:
        "Vº Sentiero Herdade dos Hospitais 2026 - 8 marzo a Montemor-o-Novo. 5ª Edizione di Equimor. Sentiero 16km, Mini 10km e Camminata 7km. Ostacoli naturali. Dopo Raid Equestre. Iscrizione: 8-14€.",
      description: `# 🏃 Vº Sentiero Herdade dos Hospitais 2026

## 📞 Contatti

- **Telefoni:** +351 919 244 050 | +351 919 293 239
- **Email:** geral@equimor.pt`,
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

  const variantTrilho16 = await findOrCreateVariant({
    name: "Trilho 16 km",
    distanceKm: 16,
    elevationGainM: 500,
    startTime: "09:15",
    price: 12.0,
    currency: Currency.EUR,
  });

  const variantMiniTrilho10 = await findOrCreateVariant({
    name: "Mini Trilho 10 km",
    distanceKm: 10,
    elevationGainM: 300,
    startTime: "09:30",
    price: 10.0,
    currency: Currency.EUR,
  });

  const variantCaminhada7 = await findOrCreateVariant({
    name: "Caminhada 7 km",
    distanceKm: 7,
    elevationGainM: 200,
    startTime: "09:45",
    price: 8.0,
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

  // Trilho 16 km pricing phases
  await findOrCreatePricingPhase(variantTrilho16.id, {
    name: "1ª Fase",
    price: 12.0,
    startDate: new Date("2025-12-01T00:00:00.000Z"),
    endDate: new Date("2026-02-08T23:59:59.000Z"),
    currency: Currency.EUR,
  });

  await findOrCreatePricingPhase(variantTrilho16.id, {
    name: "2ª Fase",
    price: 14.0,
    startDate: new Date("2026-02-09T00:00:00.000Z"),
    endDate: new Date("2026-03-01T23:59:59.000Z"),
    currency: Currency.EUR,
  });

  // Mini Trilho 10 km pricing phases
  await findOrCreatePricingPhase(variantMiniTrilho10.id, {
    name: "1ª Fase",
    price: 10.0,
    startDate: new Date("2025-12-01T00:00:00.000Z"),
    endDate: new Date("2026-02-08T23:59:59.000Z"),
    currency: Currency.EUR,
  });

  await findOrCreatePricingPhase(variantMiniTrilho10.id, {
    name: "2ª Fase",
    price: 12.0,
    startDate: new Date("2026-02-09T00:00:00.000Z"),
    endDate: new Date("2026-03-01T23:59:59.000Z"),
    currency: Currency.EUR,
  });

  // Caminhada 7 km pricing phases
  await findOrCreatePricingPhase(variantCaminhada7.id, {
    name: "1ª Fase",
    price: 8.0,
    startDate: new Date("2025-12-01T00:00:00.000Z"),
    endDate: new Date("2026-02-08T23:59:59.000Z"),
    currency: Currency.EUR,
  });

  await findOrCreatePricingPhase(variantCaminhada7.id, {
    name: "2ª Fase",
    price: 10.0,
    startDate: new Date("2026-02-09T00:00:00.000Z"),
    endDate: new Date("2026-03-01T23:59:59.000Z"),
    currency: Currency.EUR,
  });

  console.log("✅ Vº Trilho Herdade dos Hospitais 2026 seeded!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
