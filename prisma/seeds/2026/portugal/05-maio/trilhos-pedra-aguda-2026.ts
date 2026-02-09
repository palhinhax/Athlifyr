/**
 * Seed: II Passeio BTT "Por Trilhos da Pedra Aguda" 2026
 */

import { PrismaClient, SportType, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding II Passeio BTT Por Trilhos da Pedra Aguda 2026...");

  const eventSlug = "trilhos-pedra-aguda-2026";

  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: 'II Passeio BTT "Por Trilhos da Pedra Aguda"',
      description:
        "II Passeio BTT não competitivo em Peraboa, Covilhã. Percursos de 20km e 55km pela Serra da Estrela. Inclui medalha de finisher, t-shirt técnica e almoço. Limite 200 participantes.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-05-03T09:30:00.000Z"),
      endDate: null,
      city: "Peraboa, Covilhã",
      country: "Portugal",
      latitude: 40.2833,
      longitude: -7.5,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Peraboa+Covilhã+Portugal",
      externalUrl: "https://apedalar.pt/eventos/4183/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-04-29T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: 'II Passeio BTT "Por Trilhos da Pedra Aguda"',
      description:
        "II Passeio BTT não competitivo em Peraboa, Covilhã. Percursos de 20km e 55km pela Serra da Estrela. Inclui medalha de finisher, t-shirt técnica e almoço. Limite 200 participantes.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-05-03T09:30:00.000Z"),
      endDate: null,
      city: "Peraboa, Covilhã",
      country: "Portugal",
      latitude: 40.2833,
      longitude: -7.5,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Peraboa+Covilhã+Portugal",
      externalUrl: "https://apedalar.pt/eventos/4183/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-04-29T23:59:59.000Z"),
    },
  });

  const translations = [
    {
      language: "pt" as const,
      title: 'II Passeio BTT "Por Trilhos da Pedra Aguda"',
      city: "Peraboa",
      metaTitle:
        "II Passeio BTT Por Trilhos da Pedra Aguda 2026 | Covilhã | 3 Maio",
      metaDescription:
        "II Passeio BTT Por Trilhos da Pedra Aguda 2026 - 3 maio em Peraboa, Covilhã. Não competitivo. Percursos 20km e 55km. Medalha finisher, t-shirt técnica e almoço incluídos. Limite 200 participantes. Inscrição: 20€.",
      description: `# 🚴 II Passeio BTT "Por Trilhos da Pedra Aguda" 2026

O **II Passeio BTT "Por Trilhos da Pedra Aguda"** é um evento **não competitivo** organizado pelo **Clube de BTT Pedra Aguda** em parceria com a **Junta de Freguesia de Peraboa**.

## 📅 Data e Programa

**Data:** Sábado, 3 de maio de 2026

- 08:00-09:30 - Entrega de dorsais e levantamento de packs (Junta de Freguesia de Peraboa)
- 09:30 - Partida
- 13:30 - Almoço convívio

## 🚴 Percursos

### Percurso Curto - 20 km
Dificuldade: **Fácil**
Desnível positivo: ~300m

### Percurso Longo - 55 km
Dificuldade: **Médio/Alto**
Desnível positivo: ~1150m

**Importante:** Evento **não competitivo** mas com registo de tempos para controlo.

## 💰 Preço

- **Inscrição:** 20€

## 🎁 Inscrição Inclui

- ✅ Seguro de Acidentes Pessoais
- ✅ **Medalha de Finisher**
- ✅ **T-Shirt Técnica**
- ✅ Frontal e Porta-dorsal
- ✅ Reabastecimentos durante o percurso
- ✅ **Almoço** no final do passeio
- ✅ Assistência técnica e médica
- ✅ Brindes diversos

## 👥 Participação

- **Limite:** 200 participantes
- **Idade mínima:** 16 anos (nascidos até 2010)
- **Menores 16-18 anos:** Autorização dos pais obrigatória
- **Equipamento obrigatório:** Capacete homologado

## ⚙️ Regras Importantes

- Evento **não competitivo** de carácter recreativo e desportivo
- Haverá registo de tempos apenas para **controlo dos participantes**
- Capacete homologado obrigatório durante todo o percurso
- Percursos sinalizados com placas, setas e fitas
- Proibido circular em sentido contrário ao percurso

## 📍 Localização

**Partida/Chegada:**
Junta de Freguesia de Peraboa
Peraboa
6200 Covilhã

## 📞 Contactos

- **Email:** pedra.aguda.btt@gmail.com

## 🌍 Serra da Estrela

Desfrute dos magníficos trilhos da **Serra da Estrela** numa manhã de convívio desportivo em plena natureza.`,
    },
    {
      language: "en" as const,
      title: 'II MTB Ride "Through Pedra Aguda Trails"',
      city: "Peraboa",
      metaTitle:
        'II MTB Ride "Through Pedra Aguda Trails" 2026 | Covilhã | May 3',
      metaDescription:
        "II MTB Ride Through Pedra Aguda Trails 2026 - May 3 in Peraboa, Covilhã. Non-competitive. Routes 20km and 55km. Finisher medal, technical t-shirt and lunch included. Limit 200 participants. Entry: €20.",
      description: `# 🚴 II MTB Ride "Through Pedra Aguda Trails" 2026

The **II MTB Ride "Through Pedra Aguda Trails"** is a **non-competitive** event organized by **Pedra Aguda MTB Club** in partnership with **Peraboa Parish Council**.

## 🚴 Routes

**Short Route:** 20 km (Easy) - ~300m elevation
**Long Route:** 55 km (Medium/High) - ~1150m elevation

**Important:** Non-competitive event with time recording for control only.

## 💰 Price

- **Entry:** €20

## 🎁 Entry Includes

- Insurance
- **Finisher Medal**
- **Technical T-Shirt**
- Race number and holder
- Refreshments during route
- **Lunch** at the finish
- Technical and medical assistance
- Various gifts

## 👥 Participation

- **Limit:** 200 participants
- **Minimum age:** 16 years
- **Mandatory equipment:** Approved helmet

## 📞 Contacts

- **Email:** pedra.aguda.btt@gmail.com`,
    },
    {
      language: "es" as const,
      title: 'II Paseo BTT "Por Senderos de Pedra Aguda"',
      city: "Peraboa",
      metaTitle:
        'II Paseo BTT "Por Senderos de Pedra Aguda" 2026 | Covilhã | 3 Mayo',
      metaDescription:
        "II Paseo BTT Por Senderos de Pedra Aguda 2026 - 3 mayo en Peraboa, Covilhã. No competitivo. Recorridos 20km y 55km. Medalla finisher, camiseta técnica y almuerzo incluidos. Límite 200 participantes. Inscripción: 20€.",
      description: `# 🚴 II Paseo BTT "Por Senderos de Pedra Aguda" 2026

## 📞 Contactos

- **Email:** pedra.aguda.btt@gmail.com`,
    },
    {
      language: "fr" as const,
      title: 'II Randonnée VTT "Par les Sentiers de Pedra Aguda"',
      city: "Peraboa",
      metaTitle:
        'II Randonnée VTT "Par les Sentiers de Pedra Aguda" 2026 | Covilhã | 3 Mai',
      metaDescription:
        "II Randonnée VTT Par les Sentiers de Pedra Aguda 2026 - 3 mai à Peraboa, Covilhã. Non compétitif. Parcours 20km et 55km. Médaille finisher, t-shirt technique et déjeuner inclus. Limite 200 participants. Inscription: 20€.",
      description: `# 🚴 II Randonnée VTT "Par les Sentiers de Pedra Aguda" 2026

## 📞 Contacts

- **Email:** pedra.aguda.btt@gmail.com`,
    },
    {
      language: "de" as const,
      title: 'II MTB-Fahrt "Durch die Pfade von Pedra Aguda"',
      city: "Peraboa",
      metaTitle:
        'II MTB-Fahrt "Durch die Pfade von Pedra Aguda" 2026 | Covilhã | 3. Mai',
      metaDescription:
        "II MTB-Fahrt Durch die Pfade von Pedra Aguda 2026 - 3. Mai in Peraboa, Covilhã. Nicht-wettbewerblich. Strecken 20km und 55km. Finisher-Medaille, Funktionsshirt und Mittagessen inklusive. Limit 200 Teilnehmer. Anmeldung: 20€.",
      description: `# 🚴 II MTB-Fahrt "Durch die Pfade von Pedra Aguda" 2026

## 📞 Kontakte

- **Email:** pedra.aguda.btt@gmail.com`,
    },
    {
      language: "it" as const,
      title: 'II Pedalata MTB "Per i Sentieri di Pedra Aguda"',
      city: "Peraboa",
      metaTitle:
        'II Pedalata MTB "Per i Sentieri di Pedra Aguda" 2026 | Covilhã | 3 Maggio',
      metaDescription:
        "II Pedalata MTB Per i Sentieri di Pedra Aguda 2026 - 3 maggio a Peraboa, Covilhã. Non competitivo. Percorsi 20km e 55km. Medaglia finisher, maglietta tecnica e pranzo inclusi. Limite 200 partecipanti. Iscrizione: 20€.",
      description: `# 🚴 II Pedalata MTB "Per i Sentieri di Pedra Aguda" 2026

## 📞 Contatti

- **Email:** pedra.aguda.btt@gmail.com`,
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
    name: "Percurso Curto 20 km",
    distanceKm: 20,
    elevationGainM: 300,
    startTime: "09:30",
    maxParticipants: 100,
    price: 20.0,
    currency: Currency.EUR,
  });

  await findOrCreateVariant({
    name: "Percurso Longo 55 km",
    distanceKm: 55,
    elevationGainM: 1150,
    startTime: "09:30",
    maxParticipants: 100,
    price: 20.0,
    currency: Currency.EUR,
  });

  console.log("✅ II Passeio BTT Por Trilhos da Pedra Aguda 2026 seeded!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
