/**
 * Seed Tritour Deltebre 2026
 * Complete triathlon event with translations in all 6 languages
 * Includes triathlon segments (swim, bike, run) for each variant
 */

import {
  PrismaClient,
  SportType,
  TriathlonSegmentType,
  TriathlonTerrainType,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏊 Seeding Tritour Deltebre 2026...");

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: "tritour-deltebre-2026" },
    update: {
      title: "Tritour Deltebre 2026",
      description: `## 🏊 Tritour Deltebre 2026

Em abril, vai para **Deltebre**, uma cidade localizada entre Barcelona e Valência, para um triatlo quente 🔥. Atenção, momento cultural 👆: sabias que Deltebre decorre simplesmente da contração entre "Delta" e "Ebre"? Sim, é tão simples! 🤗 Esta parte da Catalunha é nada menos que o lugar mágico onde o Ebro, o rio mais longo de Espanha, deságua no Mar Mediterrâneo 🌊. E é aqui, neste cenário único de lagoas e arrozais embalado pelos sussurros dos flamingos, que o Tritour Deltebre espera por ti para escreveres a tua lenda desportiva 🏆.

Todos os anos, mais de 1.000 triatletas enfrentam este evento que transformou o TriTour Deltebre num verdadeiro berço do triatlo na Catalunha 💥. Porquê? Porque esta cidade garante um triatlo que estende o tapete vermelho para o teu relógio ⏱️: nadar com a corrente do Ebro a teu favor (obrigado pelo impulso! 🙏), um troço de ciclismo ultra-rápido em linhas retas apenas à espera que liberte alguma potência ⚡️ e um percurso plano oferecendo uma corrida dos sonhos 😎.

### 🏃 As Distâncias

Em termos de distâncias, há algo para todos os gostos e gémeos 🦵. Para uma dose pura de adrenalina, tens o **Sprint** com os seus 750 m de natação, 20 km de bike e 5 km de corrida 🤗. Para aqueles viciados no desporto, há o **Meio** com os seus 1,9 km de natação, 86 km de bike e 20 km de corrida 😮. Entre os dois, há o **Curto** 🤏 (950 m de natação, 57 km de bike e 10 km de corrida) e **Olímpico** 🏅 (1,5 km de natação, 38 km de bike e 10 km de corrida) permitindo que doses a intensidade como preferires.

Se correr não é a tua praia, podes até mesmo completar o Curto em **Aquabike**: nadas, pedalas... e vais direto para a paragem final de hidratação! 😋 O grande ponto positivo é que todas as corridas podem ser feitas em estafeta 🤝.

### 🌞 Experiência Completa

Então, seja tu um velocista, iniciante, nadador amante do Ebro ou um ciclista em busca do recorde, Deltebre oferece o seu cenário para um dia de desporto, superação e partilha 🌞. Honestamente, não importa o teu nível, experimenta! Na pior das hipóteses, transformarás Catalunha em "Cata", mas isso renderá uma ótima história 😜.

Se amas triatlo, amas doses triplas de dor... e prazer! 🙃 Convidamos-te a estenderes a tua estadia após a corrida porque realmente vale a pena 🙌. Vai até à Punta Del Fangar, um dos mais belos espaços naturais da Catalunha 😍, ou descobre os cantos escondidos do Ebro a bordo de uma canoa 🛶.`,
      sportTypes: [SportType.TRIATHLON],
      startDate: new Date("2026-04-11T08:00:00Z"),
      endDate: new Date("2026-04-12T14:00:00Z"),
      city: "Deltebre",
      country: "Espanha",
      latitude: 40.71944,
      longitude: 0.70835,
      googleMapsUrl: "https://maps.app.goo.gl/3EdGd",
      externalUrl: "https://www.tritourdeltebre.com",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-04-09T23:59:59Z"),
    },
    create: {
      title: "Tritour Deltebre 2026",
      slug: "tritour-deltebre-2026",
      description: `## 🏊 Tritour Deltebre 2026

Em abril, vai para **Deltebre**, uma cidade localizada entre Barcelona e Valência, para um triatlo quente 🔥. Atenção, momento cultural 👆: sabias que Deltebre decorre simplesmente da contração entre "Delta" e "Ebre"? Sim, é tão simples! 🤗 Esta parte da Catalunha é nada menos que o lugar mágico onde o Ebro, o rio mais longo de Espanha, deságua no Mar Mediterrâneo 🌊. E é aqui, neste cenário único de lagoas e arrozais embalado pelos sussurros dos flamingos, que o Tritour Deltebre espera por ti para escreveres a tua lenda desportiva 🏆.

Todos os anos, mais de 1.000 triatletas enfrentam este evento que transformou o TriTour Deltebre num verdadeiro berço do triatlo na Catalunha 💥. Porquê? Porque esta cidade garante um triatlo que estende o tapete vermelho para o teu relógio ⏱️: nadar com a corrente do Ebro a teu favor (obrigado pelo impulso! 🙏), um troço de ciclismo ultra-rápido em linhas retas apenas à espera que liberte alguma potência ⚡️ e um percurso plano oferecendo uma corrida dos sonhos 😎.

### 🏃 As Distâncias

Em termos de distâncias, há algo para todos os gostos e gémeos 🦵. Para uma dose pura de adrenalina, tens o **Sprint** com os seus 750 m de natação, 20 km de bike e 5 km de corrida 🤗. Para aqueles viciados no desporto, há o **Meio** com os seus 1,9 km de natação, 86 km de bike e 20 km de corrida 😮. Entre os dois, há o **Curto** 🤏 (950 m de natação, 57 km de bike e 10 km de corrida) e **Olímpico** 🏅 (1,5 km de natação, 38 km de bike e 10 km de corrida) permitindo que doses a intensidade como preferires.

Se correr não é a tua praia, podes até mesmo completar o Curto em **Aquabike**: nadas, pedalas... e vais direto para a paragem final de hidratação! 😋 O grande ponto positivo é que todas as corridas podem ser feitas em estafeta 🤝.

### 🌞 Experiência Completa

Então, seja tu um velocista, iniciante, nadador amante do Ebro ou um ciclista em busca do recorde, Deltebre oferece o seu cenário para um dia de desporto, superação e partilha 🌞. Honestamente, não importa o teu nível, experimenta! Na pior das hipóteses, transformarás Catalunha em "Cata", mas isso renderá uma ótima história 😜.

Se amas triatlo, amas doses triplas de dor... e prazer! 🙃 Convidamos-te a estenderes a tua estadia após a corrida porque realmente vale a pena 🙌. Vai até à Punta Del Fangar, um dos mais belos espaços naturais da Catalunha 😍, ou descobre os cantos escondidos do Ebro a bordo de uma canoa 🛶.`,
      sportTypes: [SportType.TRIATHLON],
      startDate: new Date("2026-04-11T08:00:00Z"),
      endDate: new Date("2026-04-12T14:00:00Z"),
      city: "Deltebre",
      country: "Espanha",
      latitude: 40.71944,
      longitude: 0.70835,
      googleMapsUrl: "https://maps.app.goo.gl/3EdGd",
      externalUrl: "https://www.tritourdeltebre.com",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-04-09T23:59:59Z"),
    },
  });

  console.log("✅ Event upserted with ID:", event.id);

  // Step 2: Upsert translations separately (ALL 6 LANGUAGES)
  const translations = {
    pt: {
      title: "Tritour Deltebre 2026",
      description: `## 🏊 Tritour Deltebre 2026

Em abril, vai para **Deltebre**, uma cidade localizada entre Barcelona e Valência, para um triatlo quente 🔥. Esta parte da Catalunha é o lugar mágico onde o Ebro, o rio mais longo de Espanha, deságua no Mar Mediterrâneo 🌊.

### 🏃 As Distâncias

Há algo para todos: **Sprint** (750m, 20km, 5km), **Meio** (1,9km, 86km, 20km), **Curto** (950m, 57km, 10km), **Olímpico** (1,5km, 38km, 10km) e **Aquabike** (950m natação + 57km bike).

Todas as corridas podem ser feitas em estafeta 🤝.`,
      city: "Deltebre",
      metaTitle: "Tritour Deltebre 2026 - Triatlo em Espanha | Athlifyr",
      metaDescription:
        "Participa no Tritour Deltebre 2026 em abril. Triatlo Sprint, Olímpico, Meio e Aquabike no Delta do Ebro, Catalunha. Inscreve-te já!",
    },
    en: {
      title: "Tritour Deltebre 2026",
      description: `## 🏊 Tritour Deltebre 2026

In April, head to **Deltebre**, a city located between Barcelona and Valencia, for a hot triathlon 🔥. This part of Catalonia is the magical place where the Ebro, Spain's longest river, flows into the Mediterranean Sea 🌊.

### 🏃 The Distances

There's something for everyone: **Sprint** (750m, 20km, 5km), **Middle** (1.9km, 86km, 20km), **Short** (950m, 57km, 10km), **Olympic** (1.5km, 38km, 10km) and **Aquabike** (950m swim + 57km bike).

All races can be done as relay 🤝.`,
      city: "Deltebre",
      metaTitle: "Tritour Deltebre 2026 - Triathlon in Spain | Athlifyr",
      metaDescription:
        "Join the Tritour Deltebre 2026 in April. Sprint, Olympic, Middle triathlon and Aquabike in the Ebro Delta, Catalonia. Register now!",
    },
    es: {
      title: "Tritour Deltebre 2026",
      description: `## 🏊 Tritour Deltebre 2026

En abril, dirígete a **Deltebre**, una ciudad ubicada entre Barcelona y Valencia, para un triatlón caliente 🔥. Esta parte de Cataluña es el lugar mágico donde el Ebro, el río más largo de España, desemboca en el Mar Mediterráneo 🌊.

### 🏃 Las Distancias

Hay algo para todos: **Sprint** (750m, 20km, 5km), **Medio** (1,9km, 86km, 20km), **Corto** (950m, 57km, 10km), **Olímpico** (1,5km, 38km, 10km) y **Aquabike** (950m natación + 57km bici).

Todas las carreras se pueden hacer en relevo 🤝.`,
      city: "Deltebre",
      metaTitle: "Tritour Deltebre 2026 - Triatlón en España | Athlifyr",
      metaDescription:
        "Únete al Tritour Deltebre 2026 en abril. Triatlón Sprint, Olímpico, Medio y Aquabike en el Delta del Ebro, Cataluña. ¡Regístrate ya!",
    },
    fr: {
      title: "Tritour Deltebre 2026",
      description: `## 🏊 Tritour Deltebre 2026

En avril, rendez-vous à **Deltebre**, une ville située entre Barcelone et Valence, pour un triathlon chaud 🔥. Cette partie de la Catalogne est l'endroit magique où l'Èbre, le plus long fleuve d'Espagne, se jette dans la Méditerranée 🌊.

### 🏃 Les Distances

Il y en a pour tous les goûts : **Sprint** (750m, 20km, 5km), **Moyen** (1,9km, 86km, 20km), **Court** (950m, 57km, 10km), **Olympique** (1,5km, 38km, 10km) et **Aquabike** (950m natation + 57km vélo).

Toutes les courses peuvent être faites en relais 🤝.`,
      city: "Deltebre",
      metaTitle: "Tritour Deltebre 2026 - Triathlon en Espagne | Athlifyr",
      metaDescription:
        "Participez au Tritour Deltebre 2026 en avril. Triathlon Sprint, Olympique, Moyen et Aquabike dans le Delta de l'Èbre, Catalogne. Inscrivez-vous !",
    },
    de: {
      title: "Tritour Deltebre 2026",
      description: `## 🏊 Tritour Deltebre 2026

Im April geht es nach **Deltebre**, eine Stadt zwischen Barcelona und Valencia, für einen heißen Triathlon 🔥. Dieser Teil Kataloniens ist der magische Ort, wo der Ebro, Spaniens längster Fluss, ins Mittelmeer mündet 🌊.

### 🏃 Die Distanzen

Für jeden etwas dabei: **Sprint** (750m, 20km, 5km), **Mittel** (1,9km, 86km, 20km), **Kurz** (950m, 57km, 10km), **Olympisch** (1,5km, 38km, 10km) und **Aquabike** (950m Schwimmen + 57km Rad).

Alle Rennen können als Staffel absolviert werden 🤝.`,
      city: "Deltebre",
      metaTitle: "Tritour Deltebre 2026 - Triathlon in Spanien | Athlifyr",
      metaDescription:
        "Nehmen Sie am Tritour Deltebre 2026 im April teil. Sprint, Olympisch, Mittel Triathlon und Aquabike im Ebro-Delta, Katalonien. Jetzt anmelden!",
    },
    it: {
      title: "Tritour Deltebre 2026",
      description: `## 🏊 Tritour Deltebre 2026

Ad aprile, dirigiti a **Deltebre**, una città situata tra Barcellona e Valencia, per un triathlon caldo 🔥. Questa parte della Catalogna è il luogo magico dove l'Ebro, il fiume più lungo della Spagna, sfocia nel Mediterraneo 🌊.

### 🏃 Le Distanze

C'è qualcosa per tutti: **Sprint** (750m, 20km, 5km), **Medio** (1,9km, 86km, 20km), **Corto** (950m, 57km, 10km), **Olimpico** (1,5km, 38km, 10km) e **Aquabike** (950m nuoto + 57km bici).

Tutte le gare possono essere fatte a staffetta 🤝.`,
      city: "Deltebre",
      metaTitle: "Tritour Deltebre 2026 - Triathlon in Spagna | Athlifyr",
      metaDescription:
        "Partecipa al Tritour Deltebre 2026 ad aprile. Triathlon Sprint, Olimpico, Medio e Aquabike nel Delta dell'Ebro, Catalogna. Iscriviti ora!",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: lang,
        },
      },
      update: translations[lang],
      create: {
        eventId: event.id,
        language: lang,
        ...translations[lang],
      },
    });
  }

  console.log("📝 Translations upserted for 6 languages");

  // Step 3: Create variants with triathlon segments

  // VARIANT 1: Meio Triatlo (Half)
  let meioVariant = await prisma.eventVariant.findFirst({
    where: {
      eventId: event.id,
      name: "Meio Triatlo",
    },
  });

  if (meioVariant) {
    meioVariant = await prisma.eventVariant.update({
      where: { id: meioVariant.id },
      data: {
        name: "Meio Triatlo",
        description:
          "Meio triatlo com 1,9 km de natação, 86 km de ciclismo e 20 km de corrida.",
        distanceKm: 108, // Total: 1.9 + 86 + 20
        startDate: new Date("2026-04-11T08:00:00Z"),
        startTime: "08:00",
        maxParticipants: null,
      },
    });
  } else {
    meioVariant = await prisma.eventVariant.create({
      data: {
        eventId: event.id,
        name: "Meio Triatlo",
        description:
          "Meio triatlo com 1,9 km de natação, 86 km de ciclismo e 20 km de corrida.",
        distanceKm: 108,
        startDate: new Date("2026-04-11T08:00:00Z"),
        startTime: "08:00",
        maxParticipants: null,
      },
    });
  }

  // Triathlon segments for Meio
  await prisma.triathlonSegment.upsert({
    where: {
      id: `${meioVariant.id}-swim`,
    },
    update: {
      segmentType: TriathlonSegmentType.SWIM,
      distanceKm: 1.9,
      terrainType: TriathlonTerrainType.OPEN_WATER,
      order: 1,
    },
    create: {
      id: `${meioVariant.id}-swim`,
      variantId: meioVariant.id,
      segmentType: TriathlonSegmentType.SWIM,
      distanceKm: 1.9,
      terrainType: TriathlonTerrainType.OPEN_WATER,
      order: 1,
    },
  });

  await prisma.triathlonSegment.upsert({
    where: {
      id: `${meioVariant.id}-bike`,
    },
    update: {
      segmentType: TriathlonSegmentType.BIKE,
      distanceKm: 86,
      terrainType: TriathlonTerrainType.ROAD,
      order: 2,
    },
    create: {
      id: `${meioVariant.id}-bike`,
      variantId: meioVariant.id,
      segmentType: TriathlonSegmentType.BIKE,
      distanceKm: 86,
      terrainType: TriathlonTerrainType.ROAD,
      order: 2,
    },
  });

  await prisma.triathlonSegment.upsert({
    where: {
      id: `${meioVariant.id}-run`,
    },
    update: {
      segmentType: TriathlonSegmentType.RUN,
      distanceKm: 20,
      terrainType: TriathlonTerrainType.ROAD,
      order: 3,
    },
    create: {
      id: `${meioVariant.id}-run`,
      variantId: meioVariant.id,
      segmentType: TriathlonSegmentType.RUN,
      distanceKm: 20,
      terrainType: TriathlonTerrainType.ROAD,
      order: 3,
    },
  });

  // Translations for Meio Triatlo
  const meioTranslations = {
    pt: {
      name: "Meio Triatlo",
      description:
        "Chapinhando 💦! Mergulhas nas águas suaves e acolhedoras do Ebro para 1,9 km de natação. Uma vez fora da água, segues para a transição onde a tua bicicleta espera 🚴. Daí, partes para 86 km de ciclismo na estrada. Última transição, trocas o capacete pelos ténis 👟 e partes para 20 km de corrida ao longo do Ebro!",
    },
    en: {
      name: "Half Triathlon",
      description:
        "Splashing 💦! You dive into the smooth and welcoming waters of the Ebro for 1.9 km of swimming. Once out of the water, head to transition where your bike awaits 🚴. From there, you set off for 86 km of road cycling. Final transition, swap your helmet for running shoes 👟 and head out for 20 km of running along the Ebro!",
    },
    es: {
      name: "Medio Triatlón",
      description:
        "¡Chapoteando 💦! Te sumerges en las aguas suaves y acogedoras del Ebro para 1,9 km de natación. Una vez fuera del agua, dirígete a la transición donde tu bicicleta te espera 🚴. Desde allí, partes para 86 km de ciclismo en carretera. Última transición, cambias el casco por zapatillas 👟 y sales para 20 km de carrera a lo largo del Ebro!",
    },
    fr: {
      name: "Moyen Triathlon",
      description:
        "Éclaboussant 💦! Vous plongez dans les eaux douces et accueillantes de l'Èbre pour 1,9 km de natation. Une fois sorti de l'eau, direction la zone de transition où votre vélo vous attend 🚴. De là, vous partez pour 86 km de cyclisme sur route. Dernière transition, vous échangez votre casque contre des chaussures de course 👟 et partez pour 20 km de course le long de l'Èbre!",
    },
    de: {
      name: "Mittel Triathlon",
      description:
        "Platschend 💦! Sie tauchen in die sanften und einladenden Gewässer des Ebro für 1,9 km Schwimmen. Sobald Sie aus dem Wasser sind, geht es zur Wechselzone, wo Ihr Fahrrad wartet 🚴. Von dort aus starten Sie zu 86 km Straßenradfahren. Letzte Transition, tauschen Sie Ihren Helm gegen Laufschuhe 👟 und machen sich auf zu 20 km Laufen entlang des Ebro!",
    },
    it: {
      name: "Medio Triathlon",
      description:
        "Schizzando 💦! Ti tuffi nelle acque dolci e accoglienti dell'Ebro per 1,9 km di nuoto. Una volta fuori dall'acqua, vai alla transizione dove la tua bici ti aspetta 🚴. Da lì, parti per 86 km di ciclismo su strada. Ultima transizione, scambi il casco con scarpe da corsa 👟 e parti per 20 km di corsa lungo l'Ebro!",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: meioVariant.id,
          language: lang,
        },
      },
      update: meioTranslations[lang],
      create: {
        variantId: meioVariant.id,
        language: lang,
        ...meioTranslations[lang],
      },
    });
  }

  console.log("✅ Meio Triatlo variant created with segments");

  // VARIANT 2: Triatlo Curto
  let curtoVariant = await prisma.eventVariant.findFirst({
    where: {
      eventId: event.id,
      name: "Triatlo Curto",
    },
  });

  if (curtoVariant) {
    curtoVariant = await prisma.eventVariant.update({
      where: { id: curtoVariant.id },
      data: {
        name: "Triatlo Curto",
        description:
          "Triatlo curto com 950 m de natação, 57 km de ciclismo e 10 km de corrida.",
        distanceKm: 68, // 0.95 + 57 + 10
        startDate: new Date("2026-04-11T09:00:00Z"),
        startTime: "09:00",
        maxParticipants: null,
      },
    });
  } else {
    curtoVariant = await prisma.eventVariant.create({
      data: {
        eventId: event.id,
        name: "Triatlo Curto",
        description:
          "Triatlo curto com 950 m de natação, 57 km de ciclismo e 10 km de corrida.",
        distanceKm: 68,
        startDate: new Date("2026-04-11T09:00:00Z"),
        startTime: "09:00",
        maxParticipants: null,
      },
    });
  }

  // Triathlon segments for Curto
  await prisma.triathlonSegment.upsert({
    where: {
      id: `${curtoVariant.id}-swim`,
    },
    update: {
      segmentType: TriathlonSegmentType.SWIM,
      distanceKm: 0.95,
      terrainType: TriathlonTerrainType.OPEN_WATER,
      order: 1,
    },
    create: {
      id: `${curtoVariant.id}-swim`,
      variantId: curtoVariant.id,
      segmentType: TriathlonSegmentType.SWIM,
      distanceKm: 0.95,
      terrainType: TriathlonTerrainType.OPEN_WATER,
      order: 1,
    },
  });

  await prisma.triathlonSegment.upsert({
    where: {
      id: `${curtoVariant.id}-bike`,
    },
    update: {
      segmentType: TriathlonSegmentType.BIKE,
      distanceKm: 57,
      terrainType: TriathlonTerrainType.ROAD,
      order: 2,
    },
    create: {
      id: `${curtoVariant.id}-bike`,
      variantId: curtoVariant.id,
      segmentType: TriathlonSegmentType.BIKE,
      distanceKm: 57,
      terrainType: TriathlonTerrainType.ROAD,
      order: 2,
    },
  });

  await prisma.triathlonSegment.upsert({
    where: {
      id: `${curtoVariant.id}-run`,
    },
    update: {
      segmentType: TriathlonSegmentType.RUN,
      distanceKm: 10,
      terrainType: TriathlonTerrainType.ROAD,
      order: 3,
    },
    create: {
      id: `${curtoVariant.id}-run`,
      variantId: curtoVariant.id,
      segmentType: TriathlonSegmentType.RUN,
      distanceKm: 10,
      terrainType: TriathlonTerrainType.ROAD,
      order: 3,
    },
  });

  // Translations for Triatlo Curto
  const curtoTranslations = {
    pt: {
      name: "Triatlo Curto",
      description:
        "Aqui estás no Ebro para 950 m de natação! 🏊 Passa rapidamente como uma onda sob o vento do delta. De volta à terra, sobes na tua bicicleta 🚴 para 57 km de ciclismo. Depois, terminas com estilo: 10 km de corrida ao longo do rio! 💥",
    },
    en: {
      name: "Short Triathlon",
      description:
        "Here you are in the Ebro for 950 m of swimming! 🏊 Passes quickly like a wave under the delta wind. Back on land, you get on your bike 🚴 for 57 km of cycling. Then, finish in style: 10 km of running along the river! 💥",
    },
    es: {
      name: "Triatlón Corto",
      description:
        "¡Aquí estás en el Ebro para 950 m de natación! 🏊 Pasa rápidamente como una ola bajo el viento del delta. De vuelta en tierra, subes a tu bicicleta 🚴 para 57 km de ciclismo. Luego, terminas con estilo: ¡10 km de carrera a lo largo del río! 💥",
    },
    fr: {
      name: "Triathlon Court",
      description:
        "Vous voilà dans l'Èbre pour 950 m de natation ! 🏊 Passe vite comme une vague sous le vent du delta. De retour sur terre, vous montez sur votre vélo 🚴 pour 57 km de cyclisme. Ensuite, terminez en beauté : 10 km de course le long de la rivière ! 💥",
    },
    de: {
      name: "Kurzer Triathlon",
      description:
        "Hier sind Sie im Ebro für 950 m Schwimmen! 🏊 Vergeht schnell wie eine Welle unter dem Deltawind. Zurück an Land steigen Sie auf Ihr Fahrrad 🚴 für 57 km Radfahren. Dann beenden Sie stilvoll: 10 km Laufen entlang des Flusses! 💥",
    },
    it: {
      name: "Triathlon Corto",
      description:
        "Eccoti nell'Ebro per 950 m di nuoto! 🏊 Passa velocemente come un'onda sotto il vento del delta. Tornato a terra, sali sulla tua bici 🚴 per 57 km di ciclismo. Poi, finisci con stile: 10 km di corsa lungo il fiume! 💥",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: curtoVariant.id,
          language: lang,
        },
      },
      update: curtoTranslations[lang],
      create: {
        variantId: curtoVariant.id,
        language: lang,
        ...curtoTranslations[lang],
      },
    });
  }

  console.log("✅ Triatlo Curto variant created with segments");

  // VARIANT 3: Aquabike (no run segment)
  let aquabikeVariant = await prisma.eventVariant.findFirst({
    where: {
      eventId: event.id,
      name: "Aquabike",
    },
  });

  if (aquabikeVariant) {
    aquabikeVariant = await prisma.eventVariant.update({
      where: { id: aquabikeVariant.id },
      data: {
        name: "Aquabike",
        description: "Aquabike com 950 m de natação e 57 km de ciclismo.",
        distanceKm: 58, // 0.95 + 57
        startDate: new Date("2026-04-11T09:00:00Z"),
        startTime: "09:00",
        maxParticipants: null,
      },
    });
  } else {
    aquabikeVariant = await prisma.eventVariant.create({
      data: {
        eventId: event.id,
        name: "Aquabike",
        description: "Aquabike com 950 m de natação e 57 km de ciclismo.",
        distanceKm: 58,
        startDate: new Date("2026-04-11T09:00:00Z"),
        startTime: "09:00",
        maxParticipants: null,
      },
    });
  }

  // Aquabike segments (no run)
  await prisma.triathlonSegment.upsert({
    where: {
      id: `${aquabikeVariant.id}-swim`,
    },
    update: {
      segmentType: TriathlonSegmentType.SWIM,
      distanceKm: 0.95,
      terrainType: TriathlonTerrainType.OPEN_WATER,
      order: 1,
    },
    create: {
      id: `${aquabikeVariant.id}-swim`,
      variantId: aquabikeVariant.id,
      segmentType: TriathlonSegmentType.SWIM,
      distanceKm: 0.95,
      terrainType: TriathlonTerrainType.OPEN_WATER,
      order: 1,
    },
  });

  await prisma.triathlonSegment.upsert({
    where: {
      id: `${aquabikeVariant.id}-bike`,
    },
    update: {
      segmentType: TriathlonSegmentType.BIKE,
      distanceKm: 57,
      terrainType: TriathlonTerrainType.ROAD,
      order: 2,
    },
    create: {
      id: `${aquabikeVariant.id}-bike`,
      variantId: aquabikeVariant.id,
      segmentType: TriathlonSegmentType.BIKE,
      distanceKm: 57,
      terrainType: TriathlonTerrainType.ROAD,
      order: 2,
    },
  });

  // Translations for Aquabike
  const aquabikeTranslations = {
    pt: {
      name: "Aquabike",
      description:
        "Aquabike perfeito se correr não é a tua praia! Nadas 950 m no Ebro, pedalas 57 km... e vais direto para a paragem final de hidratação! 😋",
    },
    en: {
      name: "Aquabike",
      description:
        "Perfect aquabike if running isn't your thing! Swim 950 m in the Ebro, cycle 57 km... and go straight to the final hydration stop! 😋",
    },
    es: {
      name: "Aquabike",
      description:
        "¡Aquabike perfecto si correr no es lo tuyo! Nadas 950 m en el Ebro, pedaleas 57 km... ¡y vas directamente a la parada final de hidratación! 😋",
    },
    fr: {
      name: "Aquabike",
      description:
        "Aquabike parfait si courir n'est pas votre truc ! Nagez 950 m dans l'Èbre, pédalez 57 km... et allez directement au dernier ravitaillement ! 😋",
    },
    de: {
      name: "Aquabike",
      description:
        "Perfektes Aquabike, wenn Laufen nicht dein Ding ist! Schwimmen Sie 950 m im Ebro, radeln Sie 57 km... und gehen Sie direkt zur letzten Verpflegungsstation! 😋",
    },
    it: {
      name: "Aquabike",
      description:
        "Aquabike perfetto se correre non fa per te! Nuota 950 m nell'Ebro, pedala 57 km... e vai direttamente all'ultimo punto ristoro! 😋",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: aquabikeVariant.id,
          language: lang,
        },
      },
      update: aquabikeTranslations[lang],
      create: {
        variantId: aquabikeVariant.id,
        language: lang,
        ...aquabikeTranslations[lang],
      },
    });
  }

  console.log("✅ Aquabike variant created with segments");

  // VARIANT 4: Triatlo Olímpico
  let olimpicoVariant = await prisma.eventVariant.findFirst({
    where: {
      eventId: event.id,
      name: "Triatlo Olímpico",
    },
  });

  if (olimpicoVariant) {
    olimpicoVariant = await prisma.eventVariant.update({
      where: { id: olimpicoVariant.id },
      data: {
        name: "Triatlo Olímpico",
        description:
          "Triatlo olímpico com 1,5 km de natação, 38 km de ciclismo e 10 km de corrida.",
        distanceKm: 50, // 1.5 + 38 + 10
        startDate: new Date("2026-04-12T09:00:00Z"),
        startTime: "09:00",
        maxParticipants: null,
      },
    });
  } else {
    olimpicoVariant = await prisma.eventVariant.create({
      data: {
        eventId: event.id,
        name: "Triatlo Olímpico",
        description:
          "Triatlo olímpico com 1,5 km de natação, 38 km de ciclismo e 10 km de corrida.",
        distanceKm: 50,
        startDate: new Date("2026-04-12T09:00:00Z"),
        startTime: "09:00",
        maxParticipants: null,
      },
    });
  }

  // Triathlon segments for Olímpico
  await prisma.triathlonSegment.upsert({
    where: {
      id: `${olimpicoVariant.id}-swim`,
    },
    update: {
      segmentType: TriathlonSegmentType.SWIM,
      distanceKm: 1.5,
      terrainType: TriathlonTerrainType.OPEN_WATER,
      order: 1,
    },
    create: {
      id: `${olimpicoVariant.id}-swim`,
      variantId: olimpicoVariant.id,
      segmentType: TriathlonSegmentType.SWIM,
      distanceKm: 1.5,
      terrainType: TriathlonTerrainType.OPEN_WATER,
      order: 1,
    },
  });

  await prisma.triathlonSegment.upsert({
    where: {
      id: `${olimpicoVariant.id}-bike`,
    },
    update: {
      segmentType: TriathlonSegmentType.BIKE,
      distanceKm: 38,
      terrainType: TriathlonTerrainType.ROAD,
      order: 2,
    },
    create: {
      id: `${olimpicoVariant.id}-bike`,
      variantId: olimpicoVariant.id,
      segmentType: TriathlonSegmentType.BIKE,
      distanceKm: 38,
      terrainType: TriathlonTerrainType.ROAD,
      order: 2,
    },
  });

  await prisma.triathlonSegment.upsert({
    where: {
      id: `${olimpicoVariant.id}-run`,
    },
    update: {
      segmentType: TriathlonSegmentType.RUN,
      distanceKm: 10,
      terrainType: TriathlonTerrainType.ROAD,
      order: 3,
    },
    create: {
      id: `${olimpicoVariant.id}-run`,
      variantId: olimpicoVariant.id,
      segmentType: TriathlonSegmentType.RUN,
      distanceKm: 10,
      terrainType: TriathlonTerrainType.ROAD,
      order: 3,
    },
  });

  // Translations for Triatlo Olímpico
  const olimpicoTranslations = {
    pt: {
      name: "Triatlo Olímpico",
      description:
        "Aqui vamos nós! Mergulhas para 1,5 km de natação no Ebro. Quando sais, vais para a transição para pegar a tua bicicleta 🚴. Enfrentas então 38 km de ciclismo. Finalmente, deixas a bicicleta e começas a correr 👟 por 10 km ao longo do rio! 🧐",
    },
    en: {
      name: "Olympic Triathlon",
      description:
        "Here we go! You dive for 1.5 km of swimming in the Ebro. When you exit, head to transition to grab your bike 🚴. You then tackle 38 km of cycling. Finally, leave the bike and start running 👟 for 10 km along the river! 🧐",
    },
    es: {
      name: "Triatlón Olímpico",
      description:
        "¡Aquí vamos! Te sumerges para 1,5 km de natación en el Ebro. Cuando sales, vas a la transición para coger tu bicicleta 🚴. Luego enfrentas 38 km de ciclismo. Finalmente, dejas la bicicleta y empiezas a correr 👟 por 10 km a lo largo del río! 🧐",
    },
    fr: {
      name: "Triathlon Olympique",
      description:
        "C'est parti ! Vous plongez pour 1,5 km de natation dans l'Èbre. À la sortie, direction la zone de transition pour récupérer votre vélo 🚴. Vous affrontez ensuite 38 km de cyclisme. Enfin, vous laissez le vélo et commencez à courir 👟 pendant 10 km le long de la rivière ! 🧐",
    },
    de: {
      name: "Olympischer Triathlon",
      description:
        "Los geht's! Sie tauchen für 1,5 km Schwimmen im Ebro. Beim Ausstieg geht es zur Wechselzone, um Ihr Fahrrad zu holen 🚴. Dann bewältigen Sie 38 km Radfahren. Schließlich lassen Sie das Fahrrad stehen und laufen 👟 10 km entlang des Flusses! 🧐",
    },
    it: {
      name: "Triathlon Olimpico",
      description:
        "Eccoci! Ti tuffi per 1,5 km di nuoto nell'Ebro. All'uscita, vai alla transizione per prendere la tua bici 🚴. Affronti quindi 38 km di ciclismo. Infine, lasci la bici e inizi a correre 👟 per 10 km lungo il fiume! 🧐",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: olimpicoVariant.id,
          language: lang,
        },
      },
      update: olimpicoTranslations[lang],
      create: {
        variantId: olimpicoVariant.id,
        language: lang,
        ...olimpicoTranslations[lang],
      },
    });
  }

  console.log("✅ Triatlo Olímpico variant created with segments");

  // VARIANT 5: Triatlo Sprint
  let sprintVariant = await prisma.eventVariant.findFirst({
    where: {
      eventId: event.id,
      name: "Triatlo Sprint",
    },
  });

  if (sprintVariant) {
    sprintVariant = await prisma.eventVariant.update({
      where: { id: sprintVariant.id },
      data: {
        name: "Triatlo Sprint",
        description:
          "Triatlo sprint com 750 m de natação, 20 km de ciclismo e 5 km de corrida.",
        distanceKm: 26, // 0.75 + 20 + 5
        startDate: new Date("2026-04-12T09:40:00Z"),
        startTime: "09:40",
        maxParticipants: null,
      },
    });
  } else {
    sprintVariant = await prisma.eventVariant.create({
      data: {
        eventId: event.id,
        name: "Triatlo Sprint",
        description:
          "Triatlo sprint com 750 m de natação, 20 km de ciclismo e 5 km de corrida.",
        distanceKm: 26,
        startDate: new Date("2026-04-12T09:40:00Z"),
        startTime: "09:40",
        maxParticipants: null,
      },
    });
  }

  // Triathlon segments for Sprint
  await prisma.triathlonSegment.upsert({
    where: {
      id: `${sprintVariant.id}-swim`,
    },
    update: {
      segmentType: TriathlonSegmentType.SWIM,
      distanceKm: 0.75,
      terrainType: TriathlonTerrainType.OPEN_WATER,
      order: 1,
    },
    create: {
      id: `${sprintVariant.id}-swim`,
      variantId: sprintVariant.id,
      segmentType: TriathlonSegmentType.SWIM,
      distanceKm: 0.75,
      terrainType: TriathlonTerrainType.OPEN_WATER,
      order: 1,
    },
  });

  await prisma.triathlonSegment.upsert({
    where: {
      id: `${sprintVariant.id}-bike`,
    },
    update: {
      segmentType: TriathlonSegmentType.BIKE,
      distanceKm: 20,
      terrainType: TriathlonTerrainType.ROAD,
      order: 2,
    },
    create: {
      id: `${sprintVariant.id}-bike`,
      variantId: sprintVariant.id,
      segmentType: TriathlonSegmentType.BIKE,
      distanceKm: 20,
      terrainType: TriathlonTerrainType.ROAD,
      order: 2,
    },
  });

  await prisma.triathlonSegment.upsert({
    where: {
      id: `${sprintVariant.id}-run`,
    },
    update: {
      segmentType: TriathlonSegmentType.RUN,
      distanceKm: 5,
      terrainType: TriathlonTerrainType.ROAD,
      order: 3,
    },
    create: {
      id: `${sprintVariant.id}-run`,
      variantId: sprintVariant.id,
      segmentType: TriathlonSegmentType.RUN,
      distanceKm: 5,
      terrainType: TriathlonTerrainType.ROAD,
      order: 3,
    },
  });

  // Translations for Triatlo Sprint
  const sprintTranslations = {
    pt: {
      name: "Triatlo Sprint",
      description:
        "Afunde 💦 e lá vais para 750 m de natação no Ebro, perfeito para quem não se sente totalmente como um peixe na água 🐟. De volta ao solo firme, sobes na bike 🚴 e partes para 20 km de ciclismo, veloz como um raio ⚡️. Retornas à transição para calçar os ténis e correr 5 km ao longo do rio, ideal para dares tudo! 😄",
    },
    en: {
      name: "Sprint Triathlon",
      description:
        "Splash 💦 and off you go for 750 m of swimming in the Ebro, perfect for those who don't feel quite like a fish in water 🐟. Back on solid ground, you jump on the bike 🚴 and head off for 20 km of cycling, fast as lightning ⚡️. You return to transition to lace up your running shoes and run 5 km along the river, ideal for giving it your all! 😄",
    },
    es: {
      name: "Triatlón Sprint",
      description:
        "¡Chapuzón 💦 y allá vas para 750 m de natación en el Ebro, perfecto para quienes no se sienten del todo como un pez en el agua 🐟! De vuelta a tierra firme, subes a la bici 🚴 y partes para 20 km de ciclismo, rápido como un rayo ⚡️. Regresas a la transición para calzarte las zapatillas y correr 5 km a lo largo del río, ¡ideal para darlo todo! 😄",
    },
    fr: {
      name: "Triathlon Sprint",
      description:
        "Plouf 💦 et c'est parti pour 750 m de natation dans l'Èbre, parfait pour ceux qui ne se sentent pas tout à fait comme un poisson dans l'eau 🐟. De retour sur la terre ferme, vous montez sur le vélo 🚴 et partez pour 20 km de cyclisme, rapide comme l'éclair ⚡️. Vous revenez à la zone de transition pour lacer vos chaussures de course et courir 5 km le long de la rivière, idéal pour tout donner ! 😄",
    },
    de: {
      name: "Sprint Triathlon",
      description:
        "Platsch 💦 und los geht's für 750 m Schwimmen im Ebro, perfekt für diejenigen, die sich nicht ganz wie ein Fisch im Wasser fühlen 🐟. Zurück auf festem Boden springen Sie auf das Fahrrad 🚴 und fahren 20 km Radfahren, schnell wie der Blitz ⚡️. Sie kehren zur Wechselzone zurück, um Ihre Laufschuhe zu schnüren und 5 km entlang des Flusses zu laufen, ideal um alles zu geben! 😄",
    },
    it: {
      name: "Triathlon Sprint",
      description:
        "Tuffo 💦 e via per 750 m di nuoto nell'Ebro, perfetto per chi non si sente proprio come un pesce nell'acqua 🐟. Tornato sulla terraferma, sali sulla bici 🚴 e parti per 20 km di ciclismo, veloce come un fulmine ⚡️. Torni alla transizione per allacciarti le scarpe da corsa e correre 5 km lungo il fiume, ideale per dare il massimo! 😄",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: sprintVariant.id,
          language: lang,
        },
      },
      update: sprintTranslations[lang],
      create: {
        variantId: sprintVariant.id,
        language: lang,
        ...sprintTranslations[lang],
      },
    });
  }

  console.log("✅ Triatlo Sprint variant created with segments");

  console.log("\n🎉 Tritour Deltebre 2026 seed completed successfully!");
  console.log(`📍 Event ID: ${event.id}`);
  console.log("🏊 5 variants created with triathlon segments");
  console.log("🌍 Translations for 6 languages");
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
