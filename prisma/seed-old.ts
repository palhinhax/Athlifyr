import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Athlifyr database...");

  const eventsData = [
    // Janeiro 2026
    {
      event: {
        title: "Terra de Gigantes",
        slug: "terra-de-gigantes-2026",
        description:
          "Trail running na Serra da Estrela com percurso épico. Um desafio extremo nas montanhas mais altas de Portugal.",
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
        title: "Trail Serra D'Aire",
        slug: "trail-serra-d-aire-2026",
        description: "Trail em Ourém. Percursos desafiantes pela Serra D'Aire.",
        sportType: SportType.TRAIL,
        startDate: new Date("2026-01-17"),
        city: "Ourém",
        imageUrl:
          "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
        externalUrl: "https://correrporprazer.com",
        isFeatured: false,
      },
      variants: [
        { name: "Trail Ultra", distance: "38 km" },
        { name: "Trail Médio", distance: "18 km" },
        { name: "Trail Curto", distance: "12 km" },
        { name: "Caminhada", distance: "12 km" },
      ],
    },
    {
      event: {
        title: "Trail da Filigrana",
        slug: "trail-da-filigrana-2026",
        description:
          "Trail running em Gondomar. Descubra os trilhos da Filigrana.",
        sportType: SportType.TRAIL,
        startDate: new Date("2026-01-17"),
        city: "Gondomar",
        imageUrl:
          "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
        externalUrl: "https://correrporprazer.com",
        isFeatured: false,
      },
      variants: [
        { name: "Trail Longo", distance: "22 km" },
        { name: "Trail Curto", distance: "12 km" },
        { name: "Caminhada", distance: "12 km" },
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
      title: "Lousa Mountain Trail",
      slug: "lousa-mountain-trail-2026",
      description:
        "Trail na Lousã com distâncias de 23 km, 12 km e 8 km de caminhada. Desfrute dos trilhos de montanha em Loures.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-01-18"),
      city: "Lousa",
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: false,
    },
    {
      title: "Trail Serras do Minho",
      slug: "trail-serras-do-minho-2026",
      description:
        "Trail em Dem/Caminha com 17 km e 10 km de caminhada. Donativo reverte para Bombeiros Voluntários de Caminha.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-01-18"),
      city: "Caminha",
      imageUrl:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: false,
    },
    {
      title: "Grande Prémio de Atletismo ACD Os Ilhavos",
      slug: "gp-atletismo-ilhavos-2026",
      description:
        "Grande Prémio de Atletismo em Ílhavo com várias distâncias disponíveis para todos os níveis.",
      sportType: SportType.RUNNING,
      startDate: new Date("2026-01-25"),
      city: "Ílhavo",
      imageUrl:
        "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: false,
    },
    {
      title: "Corrida Fim da Europa",
      slug: "corrida-fim-da-europa-2026",
      description:
        "Corrida de 17 km no Cabo da Roca, o ponto mais ocidental da Europa continental. Vista espetacular sobre o Atlântico.",
      sportType: SportType.RUNNING,
      startDate: new Date("2026-01-25"),
      city: "Sintra",
      imageUrl:
        "https://images.unsplash.com/photo-1489516408517-0c0a15662682?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: true,
    },
    {
      title: "Meia Maratona de Viana do Castelo Manuela Machado",
      slug: "meia-maratona-viana-castelo-2026",
      description:
        "Meia Maratona em Viana do Castelo com distâncias de 21.1 km e caminhada. Percurso plano junto à costa.",
      sportType: SportType.RUNNING,
      startDate: new Date("2026-01-25"),
      city: "Viana do Castelo",
      imageUrl:
        "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: false,
    },
    {
      title: "Linhas de Torres 100",
      slug: "linhas-de-torres-100-2026",
      description:
        "Ultra trail em Sobral de Monte Agraço. Distâncias: 100 km, 50 km, 30 km, 20 km, 10 km e kids. Provas a solo ou em estafetas.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-01-30"),
      endDate: new Date("2026-01-31"),
      city: "Sobral de Monte Agraço",
      imageUrl:
        "https://images.unsplash.com/photo-1472230578509-980a8e6f8f06?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: true,
    },

    // Fevereiro 2026
    {
      title: "Meia Maratona de Cascais",
      slug: "meia-maratona-cascais-2026",
      description:
        "Meia Maratona de Cascais com distâncias de 21 km, 10 km e 5 km. Percurso junto ao mar na bela vila de Cascais.",
      sportType: SportType.RUNNING,
      startDate: new Date("2026-01-31"),
      endDate: new Date("2026-02-01"),
      city: "Cascais",
      imageUrl:
        "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: true,
    },
    {
      title: "Trail do Rio Paiva",
      slug: "trail-rio-paiva-2026",
      description:
        "Trail em Cinfães ao longo do Rio Paiva. Distâncias: 35 km, 23 km, 15 km e 12 km de caminhada.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-02-01"),
      city: "Cinfães",
      imageUrl:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: false,
    },
    {
      title: "Cabanão Trail 2.0",
      slug: "cabanao-trail-2026",
      description:
        "Trail em Portomar/Mira com distâncias de 21 km, 14 km e caminhada.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-02-01"),
      city: "Mira",
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: false,
    },
    {
      title: "Trail de Santa Iria",
      slug: "trail-santa-iria-2026",
      description:
        "Trail em Branzelo, Melres (Gondomar) com distâncias de 23 km, 10 km e caminhada.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-02-01"),
      city: "Gondomar",
      imageUrl:
        "https://images.unsplash.com/photo-1472230578509-980a8e6f8f06?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: false,
    },
    {
      title: "Trilhos de Viana",
      slug: "trilhos-de-viana-2026",
      description:
        "Trail no Estádio Municipal Manuela Machado em Viana do Castelo. Distâncias: 32 km, 17 km, 11 km e caminhada.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-02-01"),
      city: "Viana do Castelo",
      imageUrl:
        "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: false,
    },
    {
      title: "Santa Maria Trail - SMAT",
      slug: "santa-maria-trail-2026",
      description:
        "Trail na Ilha de Santa Maria (Açores) com distâncias de 30 km, 20 km, 10 km e caminhada. Paisagens vulcânicas únicas.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-02-07"),
      city: "Ilha de Santa Maria",
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: true,
    },
    {
      title: "Trail Vilarinho de Cima",
      slug: "trail-vilarinho-de-cima-2026",
      description:
        "Trail em Gandra, Paredes, com distâncias de 21 km, 13 km e 8 km de caminhada.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-02-08"),
      city: "Paredes",
      imageUrl:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: false,
    },
    {
      title: "Trail de Terrugem",
      slug: "trail-de-terrugem-2026",
      description:
        "Trail em Terrugem/Sintra com distâncias de 24 km, 12 km e 10 km de caminhada.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-02-08"),
      city: "Sintra",
      imageUrl:
        "https://images.unsplash.com/photo-1472230578509-980a8e6f8f06?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: false,
    },
    {
      title: "Trail Cabeços de S. Miguel",
      slug: "trail-cabecos-s-miguel-2026",
      description:
        "Trail em São Miguel do Rio Torto/Abrantes. Distâncias: 32 km, 20 km, 14 km e 12 km de caminhada.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-02-08"),
      city: "Abrantes",
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: false,
    },
    {
      title: "Poiares Trail",
      slug: "poiares-trail-2026",
      description:
        "Trail em Vila Nova de Poiares. Distâncias: 35 km, estafetas, 22 km, 13 km, caminhada e kids.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-02-08"),
      city: "Vila Nova de Poiares",
      imageUrl:
        "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: false,
    },
    {
      title: "Portugal O Meeting",
      slug: "portugal-o-meeting-2026",
      description:
        "Competição de orientação em Mira. Desafio de navegação e corrida em terreno natural.",
      sportType: SportType.OTHER,
      startDate: new Date("2026-02-13"),
      endDate: new Date("2026-02-17"),
      city: "Mira",
      imageUrl:
        "https://images.unsplash.com/photo-1532444458054-01a7dd3e9fca?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: false,
    },
    {
      title: "Santo Thyrso Ultra Trilhos - STUT",
      slug: "santo-thyrso-ultra-trilhos-2026",
      description:
        "Ultra trail em Santo Tirso. Distâncias: Kids, Caminhada, 18 km, 32 km e 44 km.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-02-15"),
      city: "Santo Tirso",
      imageUrl:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: true,
    },
    {
      title: "Trail Montes Saloios",
      slug: "trail-montes-saloios-2026",
      description:
        "Trail em Covas de Ferro - Sintra. Distâncias: 29 km, 15 km, 10 km e caminhada.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-02-15"),
      city: "Sintra",
      imageUrl:
        "https://images.unsplash.com/photo-1472230578509-980a8e6f8f06?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: false,
    },
    {
      title: "FUN RUN 2025 - Guarda",
      slug: "fun-run-guarda-2026",
      description:
        "Prova de obstáculos na Guarda com percurso de 5.5 km. Diversão e desafio garantidos.",
      sportType: SportType.OCR,
      startDate: new Date("2026-02-15"),
      city: "Guarda",
      imageUrl:
        "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: false,
    },
    {
      title: "Cesar Trail",
      slug: "cesar-trail-2026",
      description:
        "Trail em Cesar, Oliveira de Azeméis. Distâncias: 20 km e 10 km de caminhada.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-02-15"),
      city: "Oliveira de Azeméis",
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: false,
    },
    {
      title: "Zebra Ultra Trail",
      slug: "zebra-ultra-trail-2026",
      description:
        "Ultra trail em Cantanhede. Distâncias: 45 km, 25 km, 15 km e 10 km de caminhada.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-02-15"),
      city: "Cantanhede",
      imageUrl:
        "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: true,
    },
    {
      title: "Corrida do Carnaval",
      slug: "corrida-carnaval-lousada-2026",
      description:
        "Corrida de Carnaval em Lousada com distâncias de 10 km e 6 km. Venha celebrar com muito atletismo.",
      sportType: SportType.RUNNING,
      startDate: new Date("2026-02-15"),
      city: "Lousada",
      imageUrl:
        "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: false,
    },
    {
      title: "Corrida dos Namorados",
      slug: "corrida-namorados-2026",
      description:
        "Corrida romântica em Vila Verde/Braga. Distâncias: 5 km e 5 km de caminhada.",
      sportType: SportType.RUNNING,
      startDate: new Date("2026-02-15"),
      city: "Vila Verde",
      imageUrl:
        "https://images.unsplash.com/photo-1489516408517-0c0a15662682?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: false,
    },
    {
      title: "Foz Côa Douro Ultra Trail",
      slug: "foz-coa-douro-ultra-trail-2026",
      description:
        "Ultra trail em Foz Côa com 3 etapas em 3 dias. Distâncias: 46 km, 31 km e 17 km. Paisagens do Douro.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-02-20"),
      endDate: new Date("2026-02-22"),
      city: "Foz Côa",
      imageUrl:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: true,
    },
    {
      title: "Trail de Conímbriga Terras de Sicó",
      slug: "trail-conimbriga-terras-de-sico-2026",
      description:
        "Trail épico em Condeixa. Distâncias: 111 milhas, 111 km, 60 km, 42 km, 30 km, 15 km e caminhada.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-02-20"),
      endDate: new Date("2026-02-22"),
      city: "Condeixa",
      imageUrl:
        "https://images.unsplash.com/photo-1472230578509-980a8e6f8f06?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: true,
    },

    {
      title: "ATLÀNTICAS – Asaltamontes Madeira Female 2026",
      slug: "asaltamontes-madeira-female-2026",
      description:
        "Trail feminino na Madeira. Distâncias: 15 km e caminhada. Evento exclusivo para mulheres em Machico.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-03-01"),
      city: "Machico",
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: true,
    },
    {
      title: "Meia Maratona de Lisboa - Ponte 25 de Abril",
      slug: "meia-maratona-lisboa-ponte-25-abril-2026",
      description:
        "Uma das meias maratonas mais rápidas da Europa. Percurso passa pela icónica Ponte 25 de Abril com distâncias de 21 km e 10 km.",
      sportType: SportType.RUNNING,
      startDate: new Date("2026-03-08"),
      city: "Lisboa",
      imageUrl:
        "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: true,
    },
    {
      title: "Louzantrail",
      slug: "louzantrail-2026",
      description:
        "Trail na Lousã com distâncias de 32 km, 20 km, 13 km e estafetas 32 km + 20 km.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-03-07"),
      endDate: new Date("2026-03-08"),
      city: "Lousã",
      imageUrl:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: true,
    },

    // Abril 2026
    {
      title: "Maratona da Europa",
      slug: "maratona-da-europa-2026",
      description:
        "Maratona em Aveiro com distâncias de 42.195 km, 21.0975 km, 10 km, caminhada e 5 km. Uma das provas mais importantes do país.",
      sportType: SportType.RUNNING,
      startDate: new Date("2026-04-26"),
      city: "Aveiro",
      imageUrl:
        "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: true,
    },
    {
      title: "Lisbon Eco Marathon",
      slug: "lisbon-eco-marathon-2026",
      description:
        "Maratona ecológica em Monsanto, Lisboa. Distâncias: 42 km, 21 km, 12 km e caminhada no pulmão verde da capital.",
      sportType: SportType.RUNNING,
      startDate: new Date("2026-04-12"),
      city: "Lisboa",
      imageUrl:
        "https://images.unsplash.com/photo-1489516408517-0c0a15662682?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: true,
    },
    {
      title: "Madeira Island Ultra Trail - MIUT",
      slug: "madeira-island-ultra-trail-2026",
      description:
        "Ultra trail pela ilha da Madeira com vistas deslumbrantes. Distâncias: 16 km, 42 km, 85 km e 115 km.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-04-25"),
      endDate: new Date("2026-04-26"),
      city: "Porto Moniz",
      imageUrl:
        "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: true,
    },

    // Maio 2026
    {
      title: "Estrela Grande Trail",
      slug: "estrela-grande-trail-2026",
      description:
        "Trail na Serra da Estrela. Distâncias: 6 km, 15 km, 33 km, 50 km, 71 km (3 etapas) e 105 km.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-05-08"),
      endDate: new Date("2026-05-10"),
      city: "Manteigas",
      imageUrl:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: true,
    },
    {
      title: "24 Horas a Correr Mem Martins",
      slug: "24-horas-correr-mem-martins-2026",
      description:
        "Corrida de resistência em Mem Martins. Distâncias: 3h, 6h, 12h, 24h e 42 km (maratona noturna).",
      sportType: SportType.RUNNING,
      startDate: new Date("2026-05-09"),
      endDate: new Date("2026-05-10"),
      city: "Sintra",
      imageUrl:
        "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: true,
    },
    {
      title: "7 Cidades Ultimate Trail",
      slug: "7-cidades-ultimate-trail-2026",
      description:
        "Trail em São Miguel, Açores. Distâncias: 40 km, 20 km, 10 km, caminhada e kids. Paisagens vulcânicas únicas.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-05-23"),
      city: "São Miguel",
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: true,
    },

    // Junho - Setembro 2026
    {
      title: "Meia Maratona do Porto",
      slug: "meia-maratona-do-porto-2026",
      description:
        "Meia Maratona na Invicta com distâncias de 6 km e 21 km. Percurso pelas ruas históricas do Porto.",
      sportType: SportType.RUNNING,
      startDate: new Date("2026-09-13"),
      city: "Porto",
      imageUrl:
        "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: true,
    },
    {
      title: "Ultra Trail Serra da Freita",
      slug: "ultra-trail-serra-da-freita-2026",
      description:
        "Trail em Arouca. Distâncias: 100 km, 65 km, 29 km e 15 km. Paisagens espetaculares da Serra da Freita.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-06-27"),
      endDate: new Date("2026-06-28"),
      city: "Arouca",
      imageUrl:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: true,
    },

    // Outubro 2026
    {
      title: "Maratona de Lisboa",
      slug: "maratona-de-lisboa-2026",
      description:
        "A Maratona de Lisboa é uma das provas mais emblemáticas de Portugal. Distâncias: 21 km e 42 km.",
      sportType: SportType.RUNNING,
      startDate: new Date("2026-10-10"),
      city: "Lisboa",
      imageUrl:
        "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: true,
    },
    {
      title: "Douro Ultra Trail",
      slug: "douro-ultra-trail-2026",
      description:
        "Ultra trail na Régua. Distâncias: 100 km, 50 km, 25 km, 15 km e 8 km de caminhada. Percurso pelo Vale do Douro.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-10-09"),
      endDate: new Date("2026-10-10"),
      city: "Régua",
      imageUrl:
        "https://images.unsplash.com/photo-1472230578509-980a8e6f8f06?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: true,
    },

    // Novembro 2026
    {
      title: "Maratona do Porto",
      slug: "maratona-do-porto-2026",
      description:
        "Percorra as ruas históricas do Porto. Distâncias: 42 km e 10 km. Uma das maratonas mais importantes de Portugal.",
      sportType: SportType.RUNNING,
      startDate: new Date("2026-11-08"),
      city: "Porto",
      imageUrl:
        "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: true,
    },
    {
      title: "Gerês Extreme Marathon",
      slug: "geres-extreme-marathon-2026",
      description:
        "Maratona extrema no Gerês. Distâncias: 13 km, 21 km, 42 km e 90 km no Parque Nacional.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-11-27"),
      endDate: new Date("2026-11-29"),
      city: "Gerês",
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: true,
    },
    {
      title: "Trail Demónios do Lizandro",
      slug: "trail-demonios-do-lizandro-2026",
      description:
        "Trail em Sintra. Distâncias: 100 km, 50 km, 30 km, 20 km, 12 km e caminhada. Um dos trails mais desafiantes.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-11-06"),
      endDate: new Date("2026-11-07"),
      city: "Sintra",
      imageUrl:
        "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      externalUrl: "https://correrporprazer.com",
      isFeatured: true,
    },
  ];

  console.log(`Creating ${eventsData.length} events with variants...`);

  for (const { event, variants } of eventsData) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {},
      create: {
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
  console.log(
    "🏋️  CrossFit:",
    eventsData.filter((e) => e.event.sportType === SportType.CROSSFIT).length
  );
  console.log(
    "🧗 OCR:",
    eventsData.filter((e) => e.event.sportType === SportType.OCR).length
  );
  console.log(
    "🚵 BTT:",
    events.filter((e) => e.sportType === SportType.BTT).length
  );
  console.log(
    "🚴 Cycling:",
    events.filter((e) => e.sportType === SportType.CYCLING).length
  );
  console.log(
    "🏄 Surf:",
    events.filter((e) => e.sportType === SportType.SURF).length
  );
  console.log(
    "🏊 Triathlon:",
    events.filter((e) => e.sportType === SportType.TRIATHLON).length
  );
  console.log(
    "🏊 Swimming:",
    events.filter((e) => e.sportType === SportType.SWIMMING).length
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
