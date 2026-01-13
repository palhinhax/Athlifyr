import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Athlifyr database...");

  const events = [
    // Running Events
    {
      title: "Maratona de Lisboa",
      slug: "maratona-de-lisboa-2026",
      description:
        "A Maratona de Lisboa é uma das provas mais emblemáticas de Portugal, reunindo milhares de atletas de todo o mundo. O percurso passa pelos principais monumentos da capital portuguesa.",
      sportType: SportType.RUNNING,
      startDate: new Date("2026-10-18"),
      city: "Lisboa",
      imageUrl:
        "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800",
      externalUrl: "https://maratonadelisboa.pt",
      isFeatured: true,
    },
    {
      title: "Meia Maratona de Lisboa",
      slug: "meia-maratona-de-lisboa-2026",
      description:
        "Uma das meias maratonas mais rápidas da Europa, com um percurso maioritariamente plano que passa pela Ponte 25 de Abril e pelas zonas ribeirinhas de Lisboa.",
      sportType: SportType.RUNNING,
      startDate: new Date("2026-03-15"),
      city: "Lisboa",
      imageUrl:
        "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800",
      externalUrl: "https://meiamaratonadelisboa.com",
      isFeatured: true,
    },
    {
      title: "Maratona do Porto",
      slug: "maratona-do-porto-2026",
      description:
        "Percorra as ruas históricas do Porto nesta maratona que combina desafio atlético com beleza paisagística, incluindo a famosa zona ribeirinha.",
      sportType: SportType.RUNNING,
      startDate: new Date("2026-11-07"),
      city: "Porto",
      imageUrl:
        "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800",
      externalUrl: "https://maratonadoporto.pt",
      isFeatured: false,
    },
    {
      title: "Corrida da Liberdade",
      slug: "corrida-da-liberdade-2026",
      description:
        "Corrida comemorativa do 25 de Abril, uma prova simbólica que celebra a liberdade e a democracia em Portugal.",
      sportType: SportType.RUNNING,
      startDate: new Date("2026-04-25"),
      city: "Lisboa",
      imageUrl:
        "https://images.unsplash.com/photo-1489516408517-0c0a15662682?w=800",
      externalUrl: "https://corridadaliberdade.pt",
      isFeatured: false,
    },

    // Trail Running Events
    {
      title: "Ultra Trail Serra da Estrela",
      slug: "ultra-trail-serra-da-estrela-2026",
      description:
        "O ultra trail mais desafiante de Portugal, com percursos pela Serra da Estrela, a montanha mais alta de Portugal Continental. Paisagens espetaculares e desafio extremo.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-07-11"),
      endDate: new Date("2026-07-12"),
      city: "Covilhã",
      imageUrl:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
      externalUrl: "https://ultratrailserradaestrela.com",
      isFeatured: true,
    },
    {
      title: "Trail do Mondego",
      slug: "trail-do-mondego-2026",
      description:
        "Percurso espetacular ao longo do Rio Mondego, combinando trail running com as paisagens únicas do centro de Portugal.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-05-16"),
      city: "Coimbra",
      imageUrl:
        "https://images.unsplash.com/photo-1472230578509-980a8e6f8f06?w=800",
      externalUrl: "https://traildomondego.pt",
      isFeatured: false,
    },
    {
      title: "Gerês Extreme Marathon",
      slug: "geres-extreme-marathon-2026",
      description:
        "Maratona de montanha no coração do Parque Nacional da Peneda-Gerês, um dos mais belos parques naturais de Portugal.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-06-20"),
      city: "Gerês",
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      externalUrl: "https://geresmarathon.com",
      isFeatured: false,
    },
    {
      title: "Madeira Island Ultra Trail",
      slug: "madeira-island-ultra-trail-2026",
      description:
        "Ultra trail pela ilha da Madeira, com vistas deslumbrantes sobre o oceano Atlântico e passagens pelas levadas tradicionais.",
      sportType: SportType.TRAIL,
      startDate: new Date("2026-04-24"),
      endDate: new Date("2026-04-26"),
      city: "Funchal",
      imageUrl:
        "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800",
      externalUrl: "https://madeiratrail.com",
      isFeatured: true,
    },

    // HYROX Events
    {
      title: "HYROX Lisboa",
      slug: "hyrox-lisboa-2026",
      description:
        "A competição de fitness mais desafiante do mundo chega a Lisboa. HYROX combina corrida com exercícios funcionais numa prova indoor intensa.",
      sportType: SportType.HYROX,
      startDate: new Date("2026-03-28"),
      city: "Lisboa",
      imageUrl:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
      externalUrl: "https://hyrox.com/lisboa",
      isFeatured: true,
    },
    {
      title: "HYROX Porto",
      slug: "hyrox-porto-2026",
      description:
        "HYROX chega ao Porto para desafiar os atletas mais completos. 8 estações de exercícios funcionais intercaladas com corrida.",
      sportType: SportType.HYROX,
      startDate: new Date("2026-10-10"),
      city: "Porto",
      imageUrl:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
      externalUrl: "https://hyrox.com/porto",
      isFeatured: false,
    },

    // CrossFit Events
    {
      title: "CrossFit Portuguese Championship",
      slug: "crossfit-portuguese-championship-2026",
      description:
        "Campeonato Nacional de CrossFit, reunindo os melhores atletas de Portugal numa competição intensa de três dias.",
      sportType: SportType.CROSSFIT,
      startDate: new Date("2026-05-22"),
      endDate: new Date("2026-05-24"),
      city: "Lisboa",
      imageUrl:
        "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800",
      externalUrl: "https://crossfitportugal.com/championship",
      isFeatured: true,
    },
    {
      title: "Battle of Boxes Porto",
      slug: "battle-of-boxes-porto-2026",
      description:
        "Competição entre boxes de CrossFit da região Norte. Equipas de 4 atletas competem em WODs desafiantes.",
      sportType: SportType.CROSSFIT,
      startDate: new Date("2026-09-12"),
      city: "Porto",
      imageUrl:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
      externalUrl: "https://battleofboxes.pt",
      isFeatured: false,
    },

    // OCR Events
    {
      title: "Spartan Race Lisboa",
      slug: "spartan-race-lisboa-2026",
      description:
        "A icónica Spartan Race chega a Lisboa com obstáculos desafiantes e muita lama. Sprint, Super e Beast disponíveis.",
      sportType: SportType.OCR,
      startDate: new Date("2026-06-06"),
      endDate: new Date("2026-06-07"),
      city: "Lisboa",
      imageUrl:
        "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800",
      externalUrl: "https://spartan.com/lisboa",
      isFeatured: true,
    },
    {
      title: "OCR Chaves Championship",
      slug: "ocr-chaves-championship-2026",
      description:
        "Campeonato Regional de OCR em Chaves, com obstáculos naturais e artificiais num percurso técnico e desafiante.",
      sportType: SportType.OCR,
      startDate: new Date("2026-07-18"),
      city: "Chaves",
      imageUrl:
        "https://images.unsplash.com/photo-1504016798967-764f21e39b9a?w=800",
      externalUrl: "https://ocrchaves.pt",
      isFeatured: false,
    },
    {
      title: "Tough Mudder Portugal",
      slug: "tough-mudder-portugal-2026",
      description:
        "20km de obstáculos, lama e trabalho de equipa. Tough Mudder é mais do que uma corrida, é uma experiência de superação.",
      sportType: SportType.OCR,
      startDate: new Date("2026-09-26"),
      city: "Coimbra",
      imageUrl:
        "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=800",
      externalUrl: "https://toughmudder.com/portugal",
      isFeatured: false,
    },

    // BTT / Mountain Bike Events
    {
      title: "BTT Monsanto Challenge",
      slug: "btt-monsanto-challenge-2026",
      description:
        "Desafio de BTT no Parque Florestal de Monsanto, Lisboa. Trilhos técnicos e diversão garantida no pulmão verde da capital.",
      sportType: SportType.BTT,
      startDate: new Date("2026-04-11"),
      city: "Lisboa",
      imageUrl:
        "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=800",
      externalUrl: "https://bttmonsanto.pt",
      isFeatured: false,
    },
    {
      title: "Sintra MTB Race",
      slug: "sintra-mtb-race-2026",
      description:
        "Corrida de BTT pela Serra de Sintra, Patrimônio Mundial da UNESCO. Trilhos desafiantes com vistas espetaculares.",
      sportType: SportType.BTT,
      startDate: new Date("2026-05-09"),
      city: "Sintra",
      imageUrl:
        "https://images.unsplash.com/photo-1475666675596-cca2035b3d79?w=800",
      externalUrl: "https://sintramtb.com",
      isFeatured: false,
    },
    {
      title: "Algarve Bike Challenge",
      slug: "algarve-bike-challenge-2026",
      description:
        "Três dias de BTT pelo Algarve, explorando praias, falésias e aldeias tradicionais. Para todos os níveis.",
      sportType: SportType.BTT,
      startDate: new Date("2026-10-15"),
      endDate: new Date("2026-10-17"),
      city: "Faro",
      imageUrl:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800",
      externalUrl: "https://algarvebikechallenge.com",
      isFeatured: true,
    },

    // Cycling Events
    {
      title: "Volta ao Algarve",
      slug: "volta-ao-algarve-2026",
      description:
        "A mais importante corrida ciclista portuguesa. Cinco etapas pelo Algarve com a presença das melhores equipas WorldTour.",
      sportType: SportType.CYCLING,
      startDate: new Date("2026-02-17"),
      endDate: new Date("2026-02-21"),
      city: "Faro",
      imageUrl:
        "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800",
      externalUrl: "https://voltaaoalgarve.com",
      isFeatured: true,
    },
    {
      title: "Granfondo Lisboa",
      slug: "granfondo-lisboa-2026",
      description:
        "Granfondo ciclista com partida e chegada em Lisboa. Percursos de 100km e 150km pela região de Lisboa.",
      sportType: SportType.CYCLING,
      startDate: new Date("2026-05-30"),
      city: "Lisboa",
      imageUrl:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      externalUrl: "https://granfondolisboa.pt",
      isFeatured: false,
    },
    {
      title: "Volta a Portugal",
      slug: "volta-a-portugal-2026",
      description:
        "A Volta a Portugal é a maior prova ciclista nacional, com 10 etapas que percorrem o país de norte a sul.",
      sportType: SportType.CYCLING,
      startDate: new Date("2026-08-05"),
      endDate: new Date("2026-08-15"),
      city: "Lisboa",
      imageUrl:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800",
      externalUrl: "https://voltaportugal.pt",
      isFeatured: true,
    },

    // Surf Events
    {
      title: "MEO Rip Curl Pro Portugal",
      slug: "meo-rip-curl-pro-portugal-2026",
      description:
        "Etapa do Championship Tour da World Surf League em Peniche. As melhores ondas e os melhores surfistas do mundo.",
      sportType: SportType.SURF,
      startDate: new Date("2026-10-18"),
      endDate: new Date("2026-10-29"),
      city: "Peniche",
      imageUrl:
        "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800",
      externalUrl: "https://www.worldsurfleague.com",
      isFeatured: true,
    },
    {
      title: "Nazaré Tow Surfing Challenge",
      slug: "nazare-tow-surfing-challenge-2026",
      description:
        "As maiores ondas do mundo na Nazaré. Challenge de tow-in surfing com as ondas gigantes da Praia do Norte.",
      sportType: SportType.SURF,
      startDate: new Date("2026-11-01"),
      endDate: new Date("2026-03-31"),
      city: "Nazaré",
      imageUrl:
        "https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800",
      externalUrl: "https://nazarechallenge.com",
      isFeatured: true,
    },
    {
      title: "Ericeira Surf Festival",
      slug: "ericeira-surf-festival-2026",
      description:
        "Festival de surf na World Surf Reserve de Ericeira. Competições, música e cultura surf.",
      sportType: SportType.SURF,
      startDate: new Date("2026-07-10"),
      endDate: new Date("2026-07-12"),
      city: "Ericeira",
      imageUrl:
        "https://images.unsplash.com/photo-1459821488703-8954da599db0?w=800",
      externalUrl: "https://ericeirasurffestival.com",
      isFeatured: false,
    },

    // Triathlon Events
    {
      title: "Ironman Portugal",
      slug: "ironman-portugal-2026",
      description:
        "O Ironman mais emblemático da Península Ibérica, em Cascais. 3.8km natação, 180km ciclismo, 42km corrida.",
      sportType: SportType.TRIATHLON,
      startDate: new Date("2026-05-23"),
      city: "Cascais",
      imageUrl:
        "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800",
      externalUrl: "https://ironman.com/portugal",
      isFeatured: true,
    },
    {
      title: "Triatlo de Lisboa",
      slug: "triatlo-de-lisboa-2026",
      description:
        "Triatlo olímpico no coração de Lisboa. Natação no Tejo, ciclismo e corrida pelas ruas da capital.",
      sportType: SportType.TRIATHLON,
      startDate: new Date("2026-06-13"),
      city: "Lisboa",
      imageUrl:
        "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800",
      externalUrl: "https://triatlolisboa.pt",
      isFeatured: false,
    },
    {
      title: "Challenge Lisboa",
      slug: "challenge-lisboa-2026",
      description:
        "Distância meio Ironman em Lisboa. Prova de triatlo com ambiente familiar e percursos espetaculares.",
      sportType: SportType.TRIATHLON,
      startDate: new Date("2026-09-19"),
      city: "Lisboa",
      imageUrl:
        "https://images.unsplash.com/photo-1511994477422-b69e44bd4ea9?w=800",
      externalUrl: "https://challenge-family.com/lisboa",
      isFeatured: false,
    },

    // Swimming Events
    {
      title: "Travessia do Tejo",
      slug: "travessia-do-tejo-2026",
      description:
        "Travessia a nado do Rio Tejo, de Cacilhas a Lisboa. Uma experiência única de natação em águas abertas.",
      sportType: SportType.SWIMMING,
      startDate: new Date("2026-07-25"),
      city: "Lisboa",
      imageUrl:
        "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800",
      externalUrl: "https://travessiadotejo.pt",
      isFeatured: false,
    },
    {
      title: "Swim Challenge Algarve",
      slug: "swim-challenge-algarve-2026",
      description:
        "Competição de natação em águas abertas nas praias do Algarve. Distâncias de 1km, 3km e 5km.",
      sportType: SportType.SWIMMING,
      startDate: new Date("2026-08-15"),
      city: "Albufeira",
      imageUrl:
        "https://images.unsplash.com/photo-1591027480183-5e34d5718980?w=800",
      externalUrl: "https://swimchallengealgarve.com",
      isFeatured: false,
    },

    // Other Sports
    {
      title: "Corrida das Empresas",
      slug: "corrida-das-empresas-2026",
      description:
        "A maior corrida empresarial de Portugal. Equipas de empresas competem numa corrida de 5km em Lisboa.",
      sportType: SportType.OTHER,
      startDate: new Date("2026-06-03"),
      city: "Lisboa",
      imageUrl:
        "https://images.unsplash.com/photo-1532444458054-01a7dd3e9fca?w=800",
      externalUrl: "https://corridadasempresas.pt",
      isFeatured: false,
    },
    {
      title: "Lisboa Night Run",
      slug: "lisboa-night-run-2026",
      description:
        "Corrida nocturna pelas ruas iluminadas de Lisboa. 10km de pura diversão com música e animação.",
      sportType: SportType.OTHER,
      startDate: new Date("2026-09-05"),
      city: "Lisboa",
      imageUrl:
        "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800",
      externalUrl: "https://lisboanightrun.pt",
      isFeatured: false,
    },
  ];

  console.log(`Creating ${events.length} events...`);

  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {},
      create: event,
    });
  }

  console.log("✅ Events created successfully!");
  console.log(`📊 Total events: ${events.length}`);
  console.log(
    "🏃 Running:",
    events.filter((e) => e.sportType === SportType.RUNNING).length
  );
  console.log(
    "⛰️  Trail:",
    events.filter((e) => e.sportType === SportType.TRAIL).length
  );
  console.log(
    "💪 HYROX:",
    events.filter((e) => e.sportType === SportType.HYROX).length
  );
  console.log(
    "🏋️  CrossFit:",
    events.filter((e) => e.sportType === SportType.CROSSFIT).length
  );
  console.log(
    "🧗 OCR:",
    events.filter((e) => e.sportType === SportType.OCR).length
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
