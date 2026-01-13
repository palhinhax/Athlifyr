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
        sportType: SportType.TRAIL,
        startDate: new Date("2026-01-15"),
        endDate: new Date("2026-01-18"),
        city: "Seia",
        imageUrl:
          "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
        externalUrl: "https://correrporprazer.com",
        isFeatured: true,
      },
      variants: [{ name: "Ultra", distance: "303 km" }],
    },
    {
      event: {
        title: "Trail Póvoa de Varzim",
        slug: "trail-povoa-de-varzim-2026",
        description: "Trail running na Póvoa de Varzim.",
        sportType: SportType.TRAIL,
        startDate: new Date("2026-01-16"),
        city: "Póvoa de Varzim",
        imageUrl:
          "https://images.unsplash.com/photo-1472230578509-980a8e6f8f06?w=800",
        externalUrl: "https://correrporprazer.com",
        isFeatured: false,
      },
      variants: [
        { name: "Trail Longo", distance: "25 km" },
        { name: "Trail Curto", distance: "16 km" },
        { name: "Caminhada", distance: "8 km" },
      ],
    },
    {
      event: {
        title: "Maratona do Funchal",
        slug: "maratona-do-funchal-2026",
        description:
          "Maratona na belíssima cidade do Funchal, Madeira, com vistas espetaculares sobre o oceano.",
        sportType: SportType.RUNNING,
        startDate: new Date("2026-01-17"),
        city: "Funchal",
        imageUrl:
          "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800",
        externalUrl: "https://correrporprazer.com",
        isFeatured: true,
      },
      variants: [
        { name: "Maratona", distance: "42 km" },
        { name: "Meia Maratona", distance: "21 km" },
        { name: "Mini Maratona", distance: "5 km" },
      ],
    },
    {
      event: {
        title: "Linhas de Torres 100",
        slug: "linhas-de-torres-100-2026",
        description:
          "Ultra trail em Sobral de Monte Agraço. Provas a solo ou em estafetas.",
        sportType: SportType.TRAIL,
        startDate: new Date("2026-01-30"),
        endDate: new Date("2026-01-31"),
        city: "Sobral de Monte Agraço",
        imageUrl:
          "https://images.unsplash.com/photo-1472230578509-980a8e6f8f06?w=800",
        externalUrl: "https://correrporprazer.com",
        isFeatured: true,
      },
      variants: [
        { name: "Ultra 100", distance: "100 km" },
        { name: "Trail 50", distance: "50 km" },
        { name: "Trail 30", distance: "30 km" },
        { name: "Trail 20", distance: "20 km" },
        { name: "Trail 10", distance: "10 km" },
        { name: "Kids", distance: "2 km" },
      ],
    },

    // Fevereiro 2026
    {
      event: {
        title: "Meia Maratona de Cascais",
        slug: "meia-maratona-cascais-2026",
        description:
          "Meia Maratona de Cascais. Percurso junto ao mar na bela vila de Cascais.",
        sportType: SportType.RUNNING,
        startDate: new Date("2026-01-31"),
        endDate: new Date("2026-02-01"),
        city: "Cascais",
        imageUrl:
          "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800",
        externalUrl: "https://correrporprazer.com",
        isFeatured: true,
      },
      variants: [
        { name: "Meia Maratona", distance: "21 km" },
        { name: "Corrida 10K", distance: "10 km" },
        { name: "Corrida 5K", distance: "5 km" },
      ],
    },
    {
      event: {
        title: "Zebra Ultra Trail",
        slug: "zebra-ultra-trail-2026",
        description: "Ultra trail em Cantanhede.",
        sportType: SportType.TRAIL,
        startDate: new Date("2026-02-15"),
        city: "Cantanhede",
        imageUrl:
          "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
        externalUrl: "https://correrporprazer.com",
        isFeatured: true,
      },
      variants: [
        { name: "Ultra", distance: "45 km" },
        { name: "Trail", distance: "25 km" },
        { name: "Trail Curto", distance: "15 km" },
        { name: "Caminhada", distance: "10 km" },
      ],
    },
    {
      event: {
        title: "Foz Côa Douro Ultra Trail",
        slug: "foz-coa-douro-ultra-trail-2026",
        description:
          "Ultra trail em Foz Côa com 3 etapas em 3 dias. Paisagens do Douro.",
        sportType: SportType.TRAIL,
        startDate: new Date("2026-02-20"),
        endDate: new Date("2026-02-22"),
        city: "Foz Côa",
        imageUrl:
          "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
        externalUrl: "https://correrporprazer.com",
        isFeatured: true,
      },
      variants: [
        { name: "Ultra", distance: "46 km" },
        { name: "Trail", distance: "31 km" },
        { name: "Trail Curto", distance: "17 km" },
      ],
    },

    // Março 2026
    {
      event: {
        title: "Meia Maratona de Lisboa - Ponte 25 de Abril",
        slug: "meia-maratona-lisboa-ponte-25-abril-2026",
        description:
          "Uma das meias maratonas mais rápidas da Europa. Percurso passa pela icónica Ponte 25 de Abril.",
        sportType: SportType.RUNNING,
        startDate: new Date("2026-03-08"),
        city: "Lisboa",
        imageUrl:
          "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800",
        externalUrl: "https://correrporprazer.com",
        isFeatured: true,
      },
      variants: [
        { name: "Meia Maratona", distance: "21 km" },
        { name: "Corrida 10K", distance: "10 km" },
      ],
    },
    {
      event: {
        title: "Louzantrail",
        slug: "louzantrail-2026",
        description: "Trail na Lousã.",
        sportType: SportType.TRAIL,
        startDate: new Date("2026-03-07"),
        endDate: new Date("2026-03-08"),
        city: "Lousã",
        imageUrl:
          "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
        externalUrl: "https://correrporprazer.com",
        isFeatured: true,
      },
      variants: [
        { name: "Trail Longo", distance: "32 km" },
        { name: "Trail Médio", distance: "20 km" },
        { name: "Trail Curto", distance: "13 km" },
        { name: "Estafeta", distance: "32 km + 20 km" },
      ],
    },

    // Abril 2026
    {
      event: {
        title: "Lisbon Eco Marathon",
        slug: "lisbon-eco-marathon-2026",
        description:
          "Maratona ecológica em Monsanto, Lisboa. No pulmão verde da capital.",
        sportType: SportType.RUNNING,
        startDate: new Date("2026-04-12"),
        city: "Lisboa",
        imageUrl:
          "https://images.unsplash.com/photo-1489516408517-0c0a15662682?w=800",
        externalUrl: "https://correrporprazer.com",
        isFeatured: true,
      },
      variants: [
        { name: "Maratona", distance: "42 km" },
        { name: "Meia Maratona", distance: "21 km" },
        { name: "Corrida 12K", distance: "12 km" },
        { name: "Caminhada", distance: "8 km" },
      ],
    },
    {
      event: {
        title: "Madeira Island Ultra Trail - MIUT",
        slug: "madeira-island-ultra-trail-2026",
        description:
          "Ultra trail pela ilha da Madeira com vistas deslumbrantes.",
        sportType: SportType.TRAIL,
        startDate: new Date("2026-04-25"),
        endDate: new Date("2026-04-26"),
        city: "Porto Moniz",
        imageUrl:
          "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
        externalUrl: "https://correrporprazer.com",
        isFeatured: true,
      },
      variants: [
        { name: "MIUT 115", distance: "115 km" },
        { name: "MIUT 85", distance: "85 km" },
        { name: "MIUT 42", distance: "42 km" },
        { name: "MIUT 16", distance: "16 km" },
      ],
    },
    {
      event: {
        title: "Maratona da Europa",
        slug: "maratona-da-europa-2026",
        description:
          "Maratona em Aveiro. Uma das provas mais importantes do país.",
        sportType: SportType.RUNNING,
        startDate: new Date("2026-04-26"),
        city: "Aveiro",
        imageUrl:
          "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800",
        externalUrl: "https://correrporprazer.com",
        isFeatured: true,
      },
      variants: [
        { name: "Maratona", distance: "42.195 km" },
        { name: "Meia Maratona", distance: "21.0975 km" },
        { name: "Corrida 10K", distance: "10 km" },
        { name: "Corrida 5K", distance: "5 km" },
        { name: "Caminhada", distance: "5 km" },
      ],
    },

    // Maio 2026
    {
      event: {
        title: "Estrela Grande Trail",
        slug: "estrela-grande-trail-2026",
        description: "Trail na Serra da Estrela.",
        sportType: SportType.TRAIL,
        startDate: new Date("2026-05-08"),
        endDate: new Date("2026-05-10"),
        city: "Manteigas",
        imageUrl:
          "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
        externalUrl: "https://correrporprazer.com",
        isFeatured: true,
      },
      variants: [
        { name: "Ultra 105", distance: "105 km" },
        { name: "Ultra 71", distance: "71 km (3 etapas)" },
        { name: "Trail 50", distance: "50 km" },
        { name: "Trail 33", distance: "33 km" },
        { name: "Trail 15", distance: "15 km" },
        { name: "Trail 6", distance: "6 km" },
      ],
    },
    {
      event: {
        title: "7 Cidades Ultimate Trail",
        slug: "7-cidades-ultimate-trail-2026",
        description:
          "Trail em São Miguel, Açores. Paisagens vulcânicas únicas.",
        sportType: SportType.TRAIL,
        startDate: new Date("2026-05-23"),
        city: "São Miguel",
        imageUrl:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        externalUrl: "https://correrporprazer.com",
        isFeatured: true,
      },
      variants: [
        { name: "Ultra", distance: "40 km" },
        { name: "Trail", distance: "20 km" },
        { name: "Trail Curto", distance: "10 km" },
        { name: "Caminhada", distance: "10 km" },
        { name: "Kids", distance: "2 km" },
      ],
    },

    // Junho - Setembro 2026
    {
      event: {
        title: "Ultra Trail Serra da Freita",
        slug: "ultra-trail-serra-da-freita-2026",
        description:
          "Trail em Arouca. Paisagens espetaculares da Serra da Freita.",
        sportType: SportType.TRAIL,
        startDate: new Date("2026-06-27"),
        endDate: new Date("2026-06-28"),
        city: "Arouca",
        imageUrl:
          "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
        externalUrl: "https://correrporprazer.com",
        isFeatured: true,
      },
      variants: [
        { name: "Ultra 100", distance: "100 km" },
        { name: "Trail 65", distance: "65 km" },
        { name: "Trail 29", distance: "29 km" },
        { name: "Trail 15", distance: "15 km" },
      ],
    },
    {
      event: {
        title: "Meia Maratona do Porto",
        slug: "meia-maratona-do-porto-2026",
        description:
          "Meia Maratona na Invicta. Percurso pelas ruas históricas do Porto.",
        sportType: SportType.RUNNING,
        startDate: new Date("2026-09-13"),
        city: "Porto",
        imageUrl:
          "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800",
        externalUrl: "https://correrporprazer.com",
        isFeatured: true,
      },
      variants: [
        { name: "Meia Maratona", distance: "21 km" },
        { name: "Corrida 6K", distance: "6 km" },
      ],
    },

    // Outubro 2026
    {
      event: {
        title: "Maratona de Lisboa",
        slug: "maratona-de-lisboa-2026",
        description:
          "A Maratona de Lisboa é uma das provas mais emblemáticas de Portugal.",
        sportType: SportType.RUNNING,
        startDate: new Date("2026-10-10"),
        city: "Lisboa",
        imageUrl:
          "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800",
        externalUrl: "https://correrporprazer.com",
        isFeatured: true,
      },
      variants: [
        { name: "Maratona", distance: "42 km" },
        { name: "Meia Maratona", distance: "21 km" },
      ],
    },
    {
      event: {
        title: "Douro Ultra Trail",
        slug: "douro-ultra-trail-2026",
        description: "Ultra trail na Régua. Percurso pelo Vale do Douro.",
        sportType: SportType.TRAIL,
        startDate: new Date("2026-10-09"),
        endDate: new Date("2026-10-10"),
        city: "Régua",
        imageUrl:
          "https://images.unsplash.com/photo-1472230578509-980a8e6f8f06?w=800",
        externalUrl: "https://correrporprazer.com",
        isFeatured: true,
      },
      variants: [
        { name: "Ultra 100", distance: "100 km" },
        { name: "Trail 50", distance: "50 km" },
        { name: "Trail 25", distance: "25 km" },
        { name: "Trail 15", distance: "15 km" },
        { name: "Caminhada", distance: "8 km" },
      ],
    },

    // Novembro 2026
    {
      event: {
        title: "Maratona do Porto",
        slug: "maratona-do-porto-2026",
        description:
          "Percorra as ruas históricas do Porto. Uma das maratonas mais importantes de Portugal.",
        sportType: SportType.RUNNING,
        startDate: new Date("2026-11-08"),
        city: "Porto",
        imageUrl:
          "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800",
        externalUrl: "https://correrporprazer.com",
        isFeatured: true,
      },
      variants: [
        { name: "Maratona", distance: "42 km" },
        { name: "Corrida 10K", distance: "10 km" },
      ],
    },
    {
      event: {
        title: "Gerês Extreme Marathon",
        slug: "geres-extreme-marathon-2026",
        description:
          "Maratona extrema no Gerês. No Parque Nacional da Peneda-Gerês.",
        sportType: SportType.TRAIL,
        startDate: new Date("2026-11-27"),
        endDate: new Date("2026-11-29"),
        city: "Gerês",
        imageUrl:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        externalUrl: "https://correrporprazer.com",
        isFeatured: true,
      },
      variants: [
        { name: "Ultra 90", distance: "90 km" },
        { name: "Maratona", distance: "42 km" },
        { name: "Meia Maratona", distance: "21 km" },
        { name: "Trail", distance: "13 km" },
      ],
    },
    {
      event: {
        title: "Trail Demónios do Lizandro",
        slug: "trail-demonios-do-lizandro-2026",
        description:
          "Trail em Sintra. Um dos trails mais desafiantes de Portugal.",
        sportType: SportType.TRAIL,
        startDate: new Date("2026-11-06"),
        endDate: new Date("2026-11-07"),
        city: "Sintra",
        imageUrl:
          "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
        externalUrl: "https://correrporprazer.com",
        isFeatured: true,
      },
      variants: [
        { name: "Ultra 100", distance: "100 km" },
        { name: "Trail 50", distance: "50 km" },
        { name: "Trail 30", distance: "30 km" },
        { name: "Trail 20", distance: "20 km" },
        { name: "Trail 12", distance: "12 km" },
        { name: "Caminhada", distance: "12 km" },
      ],
    },

    // HYROX Events
    {
      event: {
        title: "HYROX Lisboa",
        slug: "hyrox-lisboa-2026",
        description:
          "A competição de fitness mais desafiante do mundo chega a Lisboa. HYROX combina corrida com exercícios funcionais.",
        sportType: SportType.HYROX,
        startDate: new Date("2026-03-28"),
        city: "Lisboa",
        imageUrl:
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
        externalUrl: "https://hyrox.com/lisboa",
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
        sportType: SportType.HYROX,
        startDate: new Date("2026-10-10"),
        city: "Porto",
        imageUrl:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
        externalUrl: "https://hyrox.com/porto",
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
    eventsData.filter((e) => e.event.sportType === SportType.RUNNING).length
  );
  console.log(
    "⛰️  Trail:",
    eventsData.filter((e) => e.event.sportType === SportType.TRAIL).length
  );
  console.log(
    "💪 HYROX:",
    eventsData.filter((e) => e.event.sportType === SportType.HYROX).length
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
