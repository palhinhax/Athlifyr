import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Athlifyr database...");

  // Clear existing data
  await prisma.eventVariant.deleteMany({});
  await prisma.event.deleteMany({});

  const eventsData = [
    // Janeiro 2026
    {
      event: {
        title: "Terra de Gigantes",
        slug: "terra-de-gigantes-2026",
        description:
          "Trail running na Serra da Estrela. Um desafio extremo nas montanhas mais altas de Portugal.",
        sportTypes: [SportType.TRAIL],
        startDate: new Date("2026-01-15"),
        endDate: new Date("2026-01-18"),
        city: "Seia",
        isFeatured: true,
      },
      variants: [{ name: "Ultra", distanceKm: 303 }],
    },
    {
      event: {
        title: "Trail Póvoa de Varzim",
        slug: "trail-povoa-de-varzim-2026",
        description: "Trail running na Póvoa de Varzim.",
        sportTypes: [SportType.TRAIL],
        startDate: new Date("2026-01-16"),
        city: "Póvoa de Varzim",
        isFeatured: false,
      },
      variants: [
        { name: "Trail Longo", distanceKm: 25 },
        { name: "Trail Curto", distanceKm: 16 },
        { name: "Caminhada", distanceKm: 8 },
      ],
    },
    {
      event: {
        title: "Maratona do Funchal",
        slug: "maratona-do-funchal-2026",
        description:
          "Maratona na belíssima cidade do Funchal, Madeira, com vistas espetaculares sobre o oceano.",
        sportTypes: [SportType.RUNNING],
        startDate: new Date("2026-01-17"),
        city: "Funchal",
        isFeatured: true,
      },
      variants: [
        { name: "Maratona", distanceKm: 42 },
        { name: "Meia Maratona", distanceKm: 21 },
        { name: "Mini Maratona", distanceKm: 5 },
      ],
    },
    {
      event: {
        title: "Linhas de Torres 100",
        slug: "linhas-de-torres-100-2026",
        description:
          "Ultra trail em Sobral de Monte Agraço. Provas a solo ou em estafetas.",
        sportTypes: [SportType.TRAIL],
        startDate: new Date("2026-01-30"),
        endDate: new Date("2026-01-31"),
        city: "Sobral de Monte Agraço",
        isFeatured: true,
      },
      variants: [
        { name: "Ultra 100", distanceKm: 100 },
        { name: "Trail 50", distanceKm: 50 },
        { name: "Trail 30", distanceKm: 30 },
        { name: "Trail 20", distanceKm: 20 },
        { name: "Trail 10", distanceKm: 10 },
        { name: "Kids", distanceKm: 2 },
      ],
    },

    // Fevereiro 2026
    {
      event: {
        title: "Zebra Ultra Trail",
        slug: "zebra-ultra-trail-2026",
        description: "Ultra trail em Cantanhede.",
        sportTypes: [SportType.TRAIL],
        startDate: new Date("2026-02-15"),
        city: "Cantanhede",
        isFeatured: true,
      },
      variants: [
        { name: "Ultra", distanceKm: 45 },
        { name: "Trail", distanceKm: 25 },
        { name: "Trail Curto", distanceKm: 15 },
        { name: "Caminhada", distanceKm: 10 },
      ],
    },
    {
      event: {
        title: "Foz Côa Douro Ultra Trail",
        slug: "foz-coa-douro-ultra-trail-2026",
        description:
          "Ultra trail em Foz Côa com 3 etapas em 3 dias. Paisagens do Douro.",
        sportTypes: [SportType.TRAIL],
        startDate: new Date("2026-02-20"),
        endDate: new Date("2026-02-22"),
        city: "Foz Côa",
        isFeatured: true,
      },
      variants: [
        { name: "Ultra", distanceKm: 46 },
        { name: "Trail", distanceKm: 31 },
        { name: "Trail Curto", distanceKm: 17 },
      ],
    },

    // Março 2026
    {
      event: {
        title: "Meia Maratona de Lisboa - Ponte 25 de Abril",
        slug: "meia-maratona-lisboa-ponte-25-abril-2026",
        description:
          "Uma das meias maratonas mais rápidas da Europa. Percurso passa pela icónica Ponte 25 de Abril.",
        sportTypes: [SportType.RUNNING],
        startDate: new Date("2026-03-08"),
        city: "Lisboa",
        isFeatured: true,
      },
      variants: [
        { name: "Meia Maratona", distanceKm: 21 },
        { name: "Corrida 10K", distanceKm: 10 },
      ],
    },
    {
      event: {
        title: "Louzantrail",
        slug: "louzantrail-2026",
        description: "Trail na Lousã.",
        sportTypes: [SportType.TRAIL],
        startDate: new Date("2026-03-07"),
        endDate: new Date("2026-03-08"),
        city: "Lousã",
        isFeatured: true,
      },
      variants: [
        { name: "Trail Longo", distanceKm: 32 },
        { name: "Trail Médio", distanceKm: 20 },
        { name: "Trail Curto", distanceKm: 13 },
        { name: "Estafeta", distanceKm: 52 },
      ],
    },

    // Abril 2026
    {
      event: {
        title: "Lisbon Eco Marathon",
        slug: "lisbon-eco-marathon-2026",
        description: `🌳 **Maratona Eco-Responsável em Lisboa**

A Lisbon Eco Marathon é um evento desportivo eco-responsável que promove a sustentabilidade e o respeito pelo ambiente. Com partida e chegada na **Alameda Cardeal Cerejeira, Parque Eduardo VII**, os percursos atravessam o Parque Florestal de Monsanto.

## 🌍 Compromisso Ambiental

♻️ **Sem lixo** - desqualificação imediata por atirar lixo
🥤 **Sem copos descartáveis** - traz o teu próprio recipiente reutilizável
🌿 **Preservação ambiental** obrigatória em todas as zonas de prova
👥 Limitado a **3.000 participantes** em todas as distâncias

## 🏃 Distâncias Disponíveis

### Maratona 42km
⏰ Partida: 08:30 | ⏱️ Tempo limite: 6 horas
📍 Postos: Km 4, 10, 16, 22, 28, 36 e Meta

### Meia Maratona 21km
⏰ Partida: 09:30 | ⏱️ Tempo limite: 6 horas
📍 Postos: Km 4, 10, 15 e Meta

### Mini Maratona 13km
⏰ Partida: 10:00 | ⏱️ Tempo limite: 6 horas
📍 Postos: Km 7 e Meta

### Caminhada 8km
⏰ Partida: 10:15 | 👨‍👩‍👧‍👦 Crianças acompanhadas permitidas
📍 Postos: Km 3.5 e Meta

## 💰 Preços de Inscrição

| Distância | 1ª Fase (Out) | 2ª Fase (Nov-Dez) | 3ª Fase (Jan-Mar) | 4ª Fase (Mar-Abr) |
|-----------|---------------|-------------------|-------------------|-------------------|
| **42km**  | 40€           | 45€               | 48€               | 50€               |
| **21km**  | 18€           | 22€               | 25€               | 30€               |
| **13km**  | 12€           | 15€               | 17€               | 20€               |
| **8km**   | 6€            | 7€                | 8€                | 12€               |

💎 **Pack Premium** (+28€): Inclui almoço e massagem desportiva

## 🎁 Kit de Participação

✅ T-shirt técnica do evento
✅ Dorsal com chip não destacável
✅ Pulseira para depósito de bagagem
🏅 Medalha de finisher
🛡️ Seguro de acidentes pessoais

📅 **Inscrições até:** 5 de abril 2026
🌐 **Website:** lisbonecomarathon.com`,
        sportTypes: [SportType.RUNNING],
        startDate: new Date("2026-04-12"),
        city: "Lisboa",
        isFeatured: true,
      },
      variants: [
        { name: "Maratona 42km", distanceKm: 42 },
        { name: "Meia Maratona 21km", distanceKm: 21 },
        { name: "Mini Maratona 13km", distanceKm: 13 },
        { name: "Caminhada 8km", distanceKm: 8 },
      ],
    },
    {
      event: {
        title: "Madeira Island Ultra Trail - MIUT",
        slug: "madeira-island-ultra-trail-2026",
        description:
          "Ultra trail pela ilha da Madeira com vistas deslumbrantes.",
        sportTypes: [SportType.TRAIL],
        startDate: new Date("2026-04-25"),
        endDate: new Date("2026-04-26"),
        city: "Porto Moniz",
        isFeatured: true,
      },
      variants: [
        { name: "MIUT 115", distanceKm: 115 },
        { name: "MIUT 85", distanceKm: 85 },
        { name: "MIUT 42", distanceKm: 42 },
        { name: "MIUT 16", distanceKm: 16 },
      ],
    },
    {
      event: {
        title: "Maratona da Europa",
        slug: "maratona-da-europa-2026",
        description:
          "Maratona em Aveiro. Uma das provas mais importantes do país.",
        sportTypes: [SportType.RUNNING],
        startDate: new Date("2026-04-26"),
        city: "Aveiro",
        isFeatured: true,
      },
      variants: [
        { name: "Maratona", distanceKm: 42 },
        { name: "Meia Maratona", distanceKm: 21 },
        { name: "Corrida 10K", distanceKm: 10 },
        { name: "Corrida 5K", distanceKm: 5 },
        { name: "Caminhada", distanceKm: 5 },
      ],
    },

    // Maio 2026
    {
      event: {
        title: "Estrela Grande Trail",
        slug: "estrela-grande-trail-2026",
        description: "Trail na Serra da Estrela.",
        sportTypes: [SportType.TRAIL],
        startDate: new Date("2026-05-08"),
        endDate: new Date("2026-05-10"),
        city: "Manteigas",
        isFeatured: true,
      },
      variants: [
        { name: "Ultra 105", distanceKm: 105 },
        { name: "Ultra 71", distanceKm: 71 },
        { name: "Trail 50", distanceKm: 50 },
        { name: "Trail 33", distanceKm: 33 },
        { name: "Trail 15", distanceKm: 15 },
        { name: "Trail 6", distanceKm: 6 },
      ],
    },
    {
      event: {
        title: "7 Cidades Ultimate Trail",
        slug: "7-cidades-ultimate-trail-2026",
        description:
          "Trail em São Miguel, Açores. Paisagens vulcânicas únicas.",
        sportTypes: [SportType.TRAIL],
        startDate: new Date("2026-05-23"),
        city: "São Miguel",
        isFeatured: true,
      },
      variants: [
        { name: "Ultra", distanceKm: 40 },
        { name: "Trail", distanceKm: 20 },
        { name: "Trail Curto", distanceKm: 10 },
        { name: "Caminhada", distanceKm: 10 },
        { name: "Kids", distanceKm: 2 },
      ],
    },

    // Junho - Setembro 2026
    {
      event: {
        title: "Ultra Trail Serra da Freita",
        slug: "ultra-trail-serra-da-freita-2026",
        description:
          "Trail em Arouca. Paisagens espetaculares da Serra da Freita.",
        sportTypes: [SportType.TRAIL],
        startDate: new Date("2026-06-27"),
        endDate: new Date("2026-06-28"),
        city: "Arouca",
        isFeatured: true,
      },
      variants: [
        { name: "Ultra 100", distanceKm: 100 },
        { name: "Trail 65", distanceKm: 65 },
        { name: "Trail 29", distanceKm: 29 },
        { name: "Trail 15", distanceKm: 15 },
      ],
    },
    {
      event: {
        title: "Meia Maratona do Porto",
        slug: "meia-maratona-do-porto-2026",
        description:
          "Meia Maratona na Invicta. Percurso pelas ruas históricas do Porto.",
        sportTypes: [SportType.RUNNING],
        startDate: new Date("2026-09-13"),
        city: "Porto",
        isFeatured: true,
      },
      variants: [
        { name: "Meia Maratona", distanceKm: 21 },
        { name: "Corrida 6K", distanceKm: 6 },
      ],
    },

    // Outubro 2026
    {
      event: {
        title: "Maratona de Lisboa",
        slug: "maratona-de-lisboa-2026",
        description:
          "A Maratona de Lisboa é uma das provas mais emblemáticas de Portugal.",
        sportTypes: [SportType.RUNNING],
        startDate: new Date("2026-10-10"),
        city: "Lisboa",
        isFeatured: true,
      },
      variants: [
        { name: "Maratona", distanceKm: 42 },
        { name: "Meia Maratona", distanceKm: 21 },
      ],
    },
    {
      event: {
        title: "Douro Ultra Trail",
        slug: "douro-ultra-trail-2026",
        description: "Ultra trail na Régua. Percurso pelo Vale do Douro.",
        sportTypes: [SportType.TRAIL],
        startDate: new Date("2026-10-09"),
        endDate: new Date("2026-10-10"),
        city: "Régua",
        isFeatured: true,
      },
      variants: [
        { name: "Ultra 100", distanceKm: 100 },
        { name: "Trail 50", distanceKm: 50 },
        { name: "Trail 25", distanceKm: 25 },
        { name: "Trail 15", distanceKm: 15 },
        { name: "Caminhada", distanceKm: 8 },
      ],
    },

    // Novembro 2026
    {
      event: {
        title: "Maratona do Porto",
        slug: "maratona-do-porto-2026",
        description:
          "Percorra as ruas históricas do Porto. Uma das maratonas mais importantes de Portugal.",
        sportTypes: [SportType.RUNNING],
        startDate: new Date("2026-11-08"),
        city: "Porto",
        isFeatured: true,
      },
      variants: [
        { name: "Maratona", distanceKm: 42 },
        { name: "Corrida 10K", distanceKm: 10 },
      ],
    },
    {
      event: {
        title: "Gerês Extreme Marathon",
        slug: "geres-extreme-marathon-2026",
        description:
          "Maratona extrema no Gerês. No Parque Nacional da Peneda-Gerês.",
        sportTypes: [SportType.TRAIL],
        startDate: new Date("2026-11-27"),
        endDate: new Date("2026-11-29"),
        city: "Gerês",
        isFeatured: true,
      },
      variants: [
        { name: "Ultra 90", distanceKm: 90 },
        { name: "Maratona", distanceKm: 42 },
        { name: "Meia Maratona", distanceKm: 21 },
        { name: "Trail", distanceKm: 13 },
      ],
    },
    {
      event: {
        title: "Trail Demónios do Lizandro",
        slug: "trail-demonios-do-lizandro-2026",
        description:
          "Trail em Sintra. Um dos trails mais desafiantes de Portugal.",
        sportTypes: [SportType.TRAIL],
        startDate: new Date("2026-11-06"),
        endDate: new Date("2026-11-07"),
        city: "Sintra",
        isFeatured: true,
      },
      variants: [
        { name: "Ultra 100", distanceKm: 100 },
        { name: "Trail 50", distanceKm: 50 },
        { name: "Trail 30", distanceKm: 30 },
        { name: "Trail 20", distanceKm: 20 },
        { name: "Trail 12", distanceKm: 12 },
        { name: "Caminhada", distanceKm: 12 },
      ],
    },

    // HYROX Events (sem distância, apenas descrição)
    {
      event: {
        title: "HYROX Lisboa",
        slug: "hyrox-lisboa-2026",
        description:
          "A competição de fitness mais desafiante do mundo chega a Lisboa. HYROX combina corrida com exercícios funcionais.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-03-28"),
        city: "Lisboa",
        isFeatured: true,
      },
      variants: [
        { name: "Single", description: "Individual" },
        { name: "Doubles", description: "Equipas de 2" },
        { name: "Single Pro", description: "Individual - Categoria Pro" },
        { name: "Doubles Pro", description: "Equipas de 2 - Categoria Pro" },
      ],
    },
    {
      event: {
        title: "HYROX Porto",
        slug: "hyrox-porto-2026",
        description:
          "HYROX chega ao Porto para desafiar os atletas mais completos.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-10-10"),
        city: "Porto",
        isFeatured: false,
      },
      variants: [
        { name: "Single", description: "Individual" },
        { name: "Doubles", description: "Equipas de 2" },
        { name: "Single Pro", description: "Individual - Categoria Pro" },
        { name: "Doubles Pro", description: "Equipas de 2 - Categoria Pro" },
      ],
    },
  ];

  console.log(`Creating ${eventsData.length} events with variants...`);

  for (const { event, variants } of eventsData) {
    await prisma.event.create({
      data: {
        ...event,
        variants: {
          create: variants,
        },
      },
    });
  }

  const totalEvents = await prisma.event.count();
  const totalVariants = await prisma.eventVariant.count();

  console.log("✅ Events and variants created successfully!");
  console.log(`📊 Total events: ${totalEvents}`);
  console.log(`🎯 Total variants: ${totalVariants}`);
  console.log(
    "🏃 Running:",
    eventsData.filter((e) =>
      e.event.sportTypes.some((st) => st === SportType.RUNNING)
    ).length
  );
  console.log(
    "⛰️  Trail:",
    eventsData.filter((e) =>
      e.event.sportTypes.some((st) => st === SportType.TRAIL)
    ).length
  );
  console.log(
    "💪 HYROX:",
    eventsData.filter((e) =>
      e.event.sportTypes.some((st) => st === SportType.HYROX)
    ).length
  );
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
