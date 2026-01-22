import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const LANGS = ["pt", "en", "es", "fr", "de", "it"] as const;

async function main() {
  const slug = "douro-montemuro-ultra-trilhos-2026";

  const eventStart = new Date("2026-06-06T14:00:00Z"); // 15:00 (Lisboa) - secretariado
  const eventEnd = new Date("2026-06-07T18:00:00Z"); // 19:00 (Lisboa) - encerramento
  const registrationDeadline = new Date("2026-05-24T22:59:00Z"); // 23:59 (Lisboa)

  const event = await prisma.event.upsert({
    where: { slug },
    update: {
      title: "Douro Montemuro Ultra Trilhos 2026",
      description: [
        "# 🏔️ Douro Montemuro Ultra Trilhos 2026",
        "",
        "📍 **Cinfães, Portugal**",
        "📅 **6–7 junho 2026**",
        "",
        "O **DMUT** é um evento de **trail running** no Douro e na Serra de Montemuro, com percursos circulares exigentes e paisagens brutais: **Rio Bestança**, aldeias históricas, **Fragas da Penavilheira**, **Capela de São Pedro (1136m)** e a “floresta mágica” do **Parque do Ladário**.",
        "",
        "## 🏃 Provas",
        "- **Trail Ultra** — 51 km · **2800 m D+** · partida **07:00**",
        "- **Trail Longo** — 33 km · **1750 m D+** · partida **08:00**",
        "- **Trail Curto** — 21 km · **1200 m D+** · partida **09:00**",
        "- **Mini Trail** — 12 km · **650 m D+** · partida **09:30**",
        "- **Caminhada** — 12 km · **650 m D+** · partida **09:35**",
        "",
        "## 🧾 Secretariado",
        "- **6 junho (15:00–19:00)** — Auditório Municipal de Cinfães",
        "- **7 junho (06:00–09:00)** — abertura do secretariado",
        "",
        "## 🗺️ Como chegar",
        "- **Auditório Municipal de Cinfães** (secretariado): **41.07315, -8.08949**",
        "- **Solo duro**: **41.07103, -8.08870**",
        "",
        "📩 Contacto: **geral@dmutcinfaes.com**",
      ].join("\n"),
      sportTypes: ["TRAIL"],
      startDate: eventStart,
      endDate: eventEnd,
      city: "Cinfães",
      country: "Portugal",
      latitude: 41.07315,
      longitude: -8.08949,
      googleMapsUrl: "https://maps.app.goo.gl/4eDHA4UNcTi99A1m6",
      externalUrl: "https://www.dmut.pt/",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline,
    },
    create: {
      title: "Douro Montemuro Ultra Trilhos 2026",
      slug,
      description: [
        "# 🏔️ Douro Montemuro Ultra Trilhos 2026",
        "",
        "📍 **Cinfães, Portugal**",
        "📅 **6–7 junho 2026**",
        "",
        "O **DMUT** é um evento de **trail running** no Douro e na Serra de Montemuro, com percursos circulares exigentes e paisagens brutais: **Rio Bestança**, aldeias históricas, **Fragas da Penavilheira**, **Capela de São Pedro (1136m)** e a “floresta mágica” do **Parque do Ladário**.",
        "",
        "## 🏃 Provas",
        "- **Trail Ultra** — 51 km · **2800 m D+** · partida **07:00**",
        "- **Trail Longo** — 33 km · **1750 m D+** · partida **08:00**",
        "- **Trail Curto** — 21 km · **1200 m D+** · partida **09:00**",
        "- **Mini Trail** — 12 km · **650 m D+** · partida **09:30**",
        "- **Caminhada** — 12 km · **650 m D+** · partida **09:35**",
        "",
        "## 🧾 Secretariado",
        "- **6 junho (15:00–19:00)** — Auditório Municipal de Cinfães",
        "- **7 junho (06:00–09:00)** — abertura do secretariado",
        "",
        "## 🗺️ Como chegar",
        "- **Auditório Municipal de Cinfães** (secretariado): **41.07315, -8.08949**",
        "- **Solo duro**: **41.07103, -8.08870**",
        "",
        "📩 Contacto: **geral@dmutcinfaes.com**",
      ].join("\n"),
      sportTypes: ["TRAIL"],
      startDate: eventStart,
      endDate: eventEnd,
      city: "Cinfães",
      country: "Portugal",
      latitude: 41.07315,
      longitude: -8.08949,
      googleMapsUrl: "https://maps.app.goo.gl/4eDHA4UNcTi99A1m6",
      externalUrl: "https://www.dmut.pt/",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline,
    },
  });

  const eventTranslations: Record<
    (typeof LANGS)[number],
    {
      title: string;
      description: string;
      city: string;
      metaTitle: string;
      metaDescription: string;
    }
  > = {
    pt: {
      title: "Douro Montemuro Ultra Trilhos 2026",
      city: "Cinfães",
      metaTitle: "Douro Montemuro Ultra Trilhos 2026 (DMUT) — Cinfães",
      metaDescription:
        "DMUT 2026 em Cinfães: Trail Ultra 51K, Longo 33K, Curto 21K, Mini 12K e Caminhada. Percursos no Rio Bestança e Serra de Montemuro. 6–7 junho 2026.",
      description: [
        "# 🏔️ Douro Montemuro Ultra Trilhos 2026",
        "",
        "📍 **Cinfães, Portugal** · 📅 **6–7 junho 2026**",
        "",
        "Trail no Douro e na Serra de Montemuro com percursos circulares exigentes e paisagens únicas: **Rio Bestança**, aldeias históricas, **Fragas da Penavilheira**, **Capela de São Pedro (1136m)** e o **Parque do Ladário**.",
        "",
        "## 🏃 Provas",
        "- **51 km** (2800 m D+) · **07:00**",
        "- **33 km** (1750 m D+) · **08:00**",
        "- **21 km** (1200 m D+) · **09:00**",
        "- **12 km Mini Trail** (650 m D+) · **09:30**",
        "- **12 km Caminhada** (650 m D+) · **09:35**",
        "",
        "📍 Secretariado: **Auditório Municipal de Cinfães** — 41.07315, -8.08949",
        "📩 **geral@dmutcinfaes.com**",
      ].join("\n"),
    },
    en: {
      title: "Douro Montemuro Ultra Trilhos 2026",
      city: "Cinfães",
      metaTitle: "Douro Montemuro Ultra Trilhos 2026 (DMUT) — Cinfães",
      metaDescription:
        "DMUT 2026 in Cinfães: 51K Ultra, 33K Long, 21K Short, 12K Mini Trail and 12K Hike. Bestança River & Montemuro Mountains. June 6–7, 2026.",
      description: [
        "# 🏔️ Douro Montemuro Ultra Trilhos 2026",
        "",
        "📍 **Cinfães, Portugal** · 📅 **June 6–7, 2026**",
        "",
        "A demanding circular trail event in the Douro region and the Montemuro Mountains. Highlights include the **Bestança River**, historic villages, **Fragas da Penavilheira**, **São Pedro Chapel (1136m)** and **Parque do Ladário**.",
        "",
        "## 🏃 Races",
        "- **51 km** (2800 m D+) · **07:00**",
        "- **33 km** (1750 m D+) · **08:00**",
        "- **21 km** (1200 m D+) · **09:00**",
        "- **12 km Mini Trail** (650 m D+) · **09:30**",
        "- **12 km Hike** (650 m D+) · **09:35**",
        "",
        "📍 Race office: **Auditório Municipal de Cinfães** — 41.07315, -8.08949",
        "📩 **geral@dmutcinfaes.com**",
      ].join("\n"),
    },
    es: {
      title: "Douro Montemuro Ultra Trilhos 2026",
      city: "Cinfães",
      metaTitle: "Douro Montemuro Ultra Trilhos 2026 (DMUT) — Cinfães",
      metaDescription:
        "DMUT 2026 en Cinfães: Ultra 51K, 33K, 21K, Mini 12K y Caminata 12K. Recorridos por el río Bestança y la Serra de Montemuro. 6–7 junio 2026.",
      description: [
        "# 🏔️ Douro Montemuro Ultra Trilhos 2026",
        "",
        "📍 **Cinfães, Portugal** · 📅 **6–7 de junio de 2026**",
        "",
        "Trail circular exigente en el Douro y la Serra de Montemuro. Pasa por el **río Bestança**, aldeas históricas, **Fragas da Penavilheira**, **Capela de São Pedro (1136m)** y el **Parque do Ladário**.",
        "",
        "## 🏃 Pruebas",
        "- **51 km** (2800 m D+) · **07:00**",
        "- **33 km** (1750 m D+) · **08:00**",
        "- **21 km** (1200 m D+) · **09:00**",
        "- **12 km Mini Trail** (650 m D+) · **09:30**",
        "- **12 km Caminata** (650 m D+) · **09:35**",
        "",
        "📍 Secretaría: **Auditório Municipal de Cinfães** — 41.07315, -8.08949",
        "📩 **geral@dmutcinfaes.com**",
      ].join("\n"),
    },
    fr: {
      title: "Douro Montemuro Ultra Trilhos 2026",
      city: "Cinfães",
      metaTitle: "Douro Montemuro Ultra Trilhos 2026 (DMUT) — Cinfães",
      metaDescription:
        "DMUT 2026 à Cinfães : Ultra 51 km, 33 km, 21 km, Mini 12 km et Randonnée 12 km. Bestança & Serra de Montemuro. 6–7 juin 2026.",
      description: [
        "# 🏔️ Douro Montemuro Ultra Trilhos 2026",
        "",
        "📍 **Cinfães, Portugal** · 📅 **6–7 juin 2026**",
        "",
        "Trail exigeant sur des boucles au Douro et dans la Serra de Montemuro. Points forts : **rivière Bestança**, villages historiques, **Fragas da Penavilheira**, **Chapelle de São Pedro (1136m)** et **Parque do Ladário**.",
        "",
        "## 🏃 Courses",
        "- **51 km** (2800 m D+) · **07:00**",
        "- **33 km** (1750 m D+) · **08:00**",
        "- **21 km** (1200 m D+) · **09:00**",
        "- **12 km Mini Trail** (650 m D+) · **09:30**",
        "- **12 km Randonnée** (650 m D+) · **09:35**",
        "",
        "📍 Secrétariat : **Auditório Municipal de Cinfães** — 41.07315, -8.08949",
        "📩 **geral@dmutcinfaes.com**",
      ].join("\n"),
    },
    de: {
      title: "Douro Montemuro Ultra Trilhos 2026",
      city: "Cinfães",
      metaTitle: "Douro Montemuro Ultra Trilhos 2026 (DMUT) — Cinfães",
      metaDescription:
        "DMUT 2026 in Cinfães: 51 km Ultra, 33 km, 21 km, 12 km Mini Trail und 12 km Wanderung. Bestança-Fluss & Serra de Montemuro. 6.–7. Juni 2026.",
      description: [
        "# 🏔️ Douro Montemuro Ultra Trilhos 2026",
        "",
        "📍 **Cinfães, Portugal** · 📅 **6.–7. Juni 2026**",
        "",
        "Anspruchsvolles Rundkurs-Trail-Event im Douro-Gebiet und in der Serra de Montemuro. Highlights: **Bestança-Fluss**, historische Dörfer, **Fragas da Penavilheira**, **São-Pedro-Kapelle (1136m)** und der **Parque do Ladário**.",
        "",
        "## 🏃 Distanzen",
        "- **51 km** (2800 m D+) · **07:00**",
        "- **33 km** (1750 m D+) · **08:00**",
        "- **21 km** (1200 m D+) · **09:00**",
        "- **12 km Mini Trail** (650 m D+) · **09:30**",
        "- **12 km Wanderung** (650 m D+) · **09:35**",
        "",
        "📍 Rennbüro: **Auditório Municipal de Cinfães** — 41.07315, -8.08949",
        "📩 **geral@dmutcinfaes.com**",
      ].join("\n"),
    },
    it: {
      title: "Douro Montemuro Ultra Trilhos 2026",
      city: "Cinfães",
      metaTitle: "Douro Montemuro Ultra Trilhos 2026 (DMUT) — Cinfães",
      metaDescription:
        "DMUT 2026 a Cinfães: Ultra 51 km, 33 km, 21 km, Mini Trail 12 km e Camminata 12 km. Fiume Bestança e Serra de Montemuro. 6–7 giugno 2026.",
      description: [
        "# 🏔️ Douro Montemuro Ultra Trilhos 2026",
        "",
        "📍 **Cinfães, Portogallo** · 📅 **6–7 giugno 2026**",
        "",
        "Trail ad anello impegnativo nel Douro e nella Serra de Montemuro. Punti iconici: **fiume Bestança**, villaggi storici, **Fragas da Penavilheira**, **Cappella di São Pedro (1136m)** e **Parque do Ladário**.",
        "",
        "## 🏃 Gare",
        "- **51 km** (2800 m D+) · **07:00**",
        "- **33 km** (1750 m D+) · **08:00**",
        "- **21 km** (1200 m D+) · **09:00**",
        "- **12 km Mini Trail** (650 m D+) · **09:30**",
        "- **12 km Camminata** (650 m D+) · **09:35**",
        "",
        "📍 Segreteria: **Auditório Municipal de Cinfães** — 41.07315, -8.08949",
        "📩 **geral@dmutcinfaes.com**",
      ].join("\n"),
    },
  };

  for (const lang of LANGS) {
    const t = eventTranslations[lang];
    await prisma.eventTranslation.upsert({
      where: { eventId_language: { eventId: event.id, language: lang } },
      update: {
        title: t.title,
        description: t.description,
        city: t.city,
        metaTitle: t.metaTitle,
        metaDescription: t.metaDescription,
      },
      create: {
        eventId: event.id,
        language: lang,
        title: t.title,
        description: t.description,
        city: t.city,
        metaTitle: t.metaTitle,
        metaDescription: t.metaDescription,
      },
    });
  }

  const variants = [
    {
      slug: "trail-ultra-51k",
      namePt: "DMUT Trail Ultra",
      distanceKm: 51,
      elevationGainM: 2800,
      elevationLossM: 2800,
      startTime: "07:00",
      startDate: new Date("2026-06-07T06:00:00Z"), // 07:00 Lisboa
      cutoffTimeHours: 12,
      maxParticipants: 250,
      descriptionPt: [
        "Percurso circular épico a partir de Cinfães, com subida à Serra de Montemuro, singletracks técnicos no vale do Bestança e passagem pela **Capela de São Pedro (1136m)**.",
        "Destaques: **Pias**, **Covelas**, **Fragas da Penavilheira**, **Observatório de Marcelim** e **Parque do Ladário**.",
      ].join("\n\n"),
      names: {
        pt: "DMUT Trail Ultra (51 km)",
        en: "DMUT Ultra Trail (51 km)",
        es: "DMUT Trail Ultra (51 km)",
        fr: "DMUT Trail Ultra (51 km)",
        de: "DMUT Ultra Trail (51 km)",
        it: "DMUT Trail Ultra (51 km)",
      },
      desc: {
        pt: "51 km circular em Montemuro com grande desnível e trilhos técnicos. Passagem pelo ponto mais alto junto à Capela de São Pedro (1136m).",
        en: "51 km circular route in Montemuro with big elevation and technical trails. Reaches the high point near São Pedro Chapel (1136m).",
        es: "Recorrido circular de 51 km en Montemuro con gran desnivel y senderos técnicos. Punto alto junto a la Capela de São Pedro (1136m).",
        fr: "Boucle de 51 km à Montemuro avec fort dénivelé et sentiers techniques. Point culminant près de la chapelle São Pedro (1136m).",
        de: "51-km-Rundkurs in Montemuro mit viel Höhenmetern und technischen Trails. Höchster Punkt nahe der São-Pedro-Kapelle (1136m).",
        it: "Anello di 51 km a Montemuro con grande dislivello e trail tecnici. Punto più alto vicino alla Cappella di São Pedro (1136m).",
      },
    },
    {
      slug: "trail-longo-33k",
      namePt: "DMUT Trail Longo",
      distanceKm: 33,
      elevationGainM: 1750,
      elevationLossM: 1750,
      startTime: "08:00",
      startDate: new Date("2026-06-07T07:00:00Z"), // 08:00 Lisboa
      cutoffTimeHours: 8,
      maxParticipants: 250,
      descriptionPt: [
        "33 km de trail circular com trilhos técnicos junto ao **Rio Bestança** e subida pela Serra de Montemuro.",
        "Destaques: **Pias**, **Covelas**, **Fragas da Penavilheira**, **Observatório de Marcelim** e **Parque do Ladário**.",
      ].join("\n\n"),
      names: {
        pt: "DMUT Trail Longo (33 km)",
        en: "DMUT Long Trail (33 km)",
        es: "DMUT Trail Largo (33 km)",
        fr: "DMUT Trail Long (33 km)",
        de: "DMUT Long Trail (33 km)",
        it: "DMUT Trail Lungo (33 km)",
      },
      desc: {
        pt: "33 km circular com 1750 m D+ em trilhos técnicos no vale do Bestança e vistas em Marcelim.",
        en: "33 km loop with 1750 m D+ featuring technical trails along Bestança valley and scenic viewpoints in Marcelim.",
        es: "Bucle de 33 km con 1750 m D+ por senderos técnicos en el valle del Bestança y miradores en Marcelim.",
        fr: "Boucle de 33 km avec 1750 m D+ sur sentiers techniques dans la vallée du Bestança et vues à Marcelim.",
        de: "33-km-Runde mit 1750 m D+ auf technischen Trails im Bestança-Tal und Aussichtspunkt Marcelim.",
        it: "Anello di 33 km con 1750 m D+ su trail tecnici nella valle del Bestança e viste a Marcelim.",
      },
    },
    {
      slug: "trail-curto-21k",
      namePt: "DMUT Trail Curto",
      distanceKm: 21,
      elevationGainM: 1200,
      elevationLossM: 1200,
      startTime: "09:00",
      startDate: new Date("2026-06-07T08:00:00Z"), // 09:00 Lisboa
      cutoffTimeHours: 6,
      maxParticipants: 400,
      descriptionPt: [
        "21 km intensos com trilhos técnicos e subidas exigentes, ideal para quem quer desafio “curto” mas a sério.",
        "Passa por **Pias** e vale do Bestança, seguindo depois para aldeias e o **Parque do Ladário** antes da meta.",
      ].join("\n\n"),
      names: {
        pt: "DMUT Trail Curto (21 km)",
        en: "DMUT Short Trail (21 km)",
        es: "DMUT Trail Corto (21 km)",
        fr: "DMUT Trail Court (21 km)",
        de: "DMUT Short Trail (21 km)",
        it: "DMUT Trail Corto (21 km)",
      },
      desc: {
        pt: "21 km circular com 1200 m D+ e secções técnicas. Final no Parque do Ladário antes da meta em Cinfães.",
        en: "21 km loop with 1200 m D+ and technical sections. Finishes through Parque do Ladário before the finish in Cinfães.",
        es: "Bucle de 21 km con 1200 m D+ y tramos técnicos. Final por el Parque do Ladário antes de meta en Cinfães.",
        fr: "Boucle de 21 km avec 1200 m D+ et sections techniques. Passage final par le Parque do Ladário avant l’arrivée à Cinfães.",
        de: "21-km-Rundkurs mit 1200 m D+ und technischen Passagen. Finale durch den Parque do Ladário vor dem Ziel in Cinfães.",
        it: "Anello di 21 km con 1200 m D+ e tratti tecnici. Finale nel Parque do Ladário prima dell’arrivo a Cinfães.",
      },
    },
    {
      slug: "mini-trail-12k",
      namePt: "DMUT Mini Trail",
      distanceKm: 12,
      elevationGainM: 650,
      elevationLossM: 650,
      startTime: "09:30",
      startDate: new Date("2026-06-07T08:30:00Z"), // 09:30 Lisboa
      cutoffTimeHours: 4,
      maxParticipants: 400,
      descriptionPt: [
        "12 km intensos com passagem junto ao **Rio Bestança** e travessia, seguido de subida até Travassos e regresso a Cinfães.",
        "Curto na distância, grande no esforço 💥",
      ].join("\n\n"),
      names: {
        pt: "DMUT Mini Trail (12 km)",
        en: "DMUT Mini Trail (12 km)",
        es: "DMUT Mini Trail (12 km)",
        fr: "DMUT Mini Trail (12 km)",
        de: "DMUT Mini Trail (12 km)",
        it: "DMUT Mini Trail (12 km)",
      },
      desc: {
        pt: "12 km circular com 650 m D+. Trilhos junto ao Bestança, travessia do rio e subida até Travassos.",
        en: "12 km loop with 650 m D+. Trails along Bestança, river crossing and a climb up to Travassos.",
        es: "Bucle de 12 km con 650 m D+. Senderos junto al Bestança, cruce del río y subida hasta Travassos.",
        fr: "Boucle de 12 km avec 650 m D+. Sentiers le long du Bestança, traversée du fleuve et montée vers Travassos.",
        de: "12-km-Runde mit 650 m D+. Trails entlang des Bestança, Flussquerung und Anstieg nach Travassos.",
        it: "Anello di 12 km con 650 m D+. Trail lungo il Bestança, attraversamento del fiume e salita fino a Travassos.",
      },
    },
    {
      slug: "caminhada-12k",
      namePt: "Caminhada DMUT",
      distanceKm: 12,
      elevationGainM: 650,
      elevationLossM: 650,
      startTime: "09:35",
      startDate: new Date("2026-06-07T08:35:00Z"), // 09:35 Lisboa
      cutoffTimeHours: 4,
      maxParticipants: 200,
      descriptionPt: [
        "Caminhada de 12 km em trilhos técnicos junto ao **Rio Bestança**, com travessia do rio e subida exigente até Travassos.",
        "Sem fins competitivos, mas com dificuldade elevada e paisagens brutais 🌿",
      ].join("\n\n"),
      names: {
        pt: "Caminhada DMUT (12 km)",
        en: "DMUT Hike (12 km)",
        es: "Caminata DMUT (12 km)",
        fr: "Randonnée DMUT (12 km)",
        de: "DMUT Wanderung (12 km)",
        it: "Camminata DMUT (12 km)",
      },
      desc: {
        pt: "12 km de caminhada com dificuldade elevada, trilhos junto ao Bestança, travessia do rio e subida até Travassos.",
        en: "A challenging 12 km hike: trails along Bestança, river crossing and a climb up to Travassos.",
        es: "Caminata exigente de 12 km: senderos junto al Bestança, cruce del río y subida hasta Travassos.",
        fr: "Randonnée exigeante de 12 km : sentiers le long du Bestança, traversée du fleuve et montée vers Travassos.",
        de: "Anspruchsvolle 12-km-Wanderung: Trails am Bestança, Flussquerung und Anstieg nach Travassos.",
        it: "Camminata impegnativa di 12 km: trail lungo il Bestança, attraversamento del fiume e salita fino a Travassos.",
      },
    },
  ];

  for (const v of variants) {
    // Try to find existing variant by name and eventId
    const existingVariant = await prisma.eventVariant.findFirst({
      where: {
        eventId: event.id,
        name: v.namePt,
      },
    });

    const variant = await prisma.eventVariant.upsert({
      where: { id: existingVariant?.id || "new-variant" },
      update: {
        name: v.namePt,
        description: v.descriptionPt,
        distanceKm: v.distanceKm,
        elevationGainM: v.elevationGainM,
        elevationLossM: v.elevationLossM,
        startDate: v.startDate,
        startTime: v.startTime,
        maxParticipants: v.maxParticipants,
        cutoffTimeHours: v.cutoffTimeHours,
        itraPoints: null,
        atrpGrade: null,
        mountainLevel: null,
      },
      create: {
        eventId: event.id,
        name: v.namePt,
        description: v.descriptionPt,
        distanceKm: v.distanceKm,
        elevationGainM: v.elevationGainM,
        elevationLossM: v.elevationLossM,
        startDate: v.startDate,
        startTime: v.startTime,
        maxParticipants: v.maxParticipants,
        cutoffTimeHours: v.cutoffTimeHours,
        itraPoints: null,
        atrpGrade: null,
        mountainLevel: null,
      },
    });

    for (const lang of LANGS) {
      await prisma.eventVariantTranslation.upsert({
        where: {
          variantId_language: { variantId: variant.id, language: lang },
        },
        update: {
          name: v.names[lang],
          description: v.desc[lang],
        },
        create: {
          variantId: variant.id,
          language: lang,
          name: v.names[lang],
          description: v.desc[lang],
        },
      });
    }
  }

  const pricing = [
    {
      name: "1ª Fase",
      startDate: new Date("2026-01-03T20:00:00Z"),
      endDate: new Date("2026-03-01T23:59:59Z"),
      price: 12,
      note: "Preços: Ultra 32€, Longo 25€, Curto 20€, Mini 16€, Caminhada 12€.",
    },
    {
      name: "2ª Fase",
      startDate: new Date("2026-03-02T00:00:00Z"),
      endDate: new Date("2026-05-03T23:59:59Z"),
      price: 14,
      note: "Preços: Ultra 37€, Longo 29€, Curto 24€, Mini 20€, Caminhada 14€.",
    },
    {
      name: "3ª Fase",
      startDate: new Date("2026-05-04T00:00:00Z"),
      endDate: new Date("2026-05-24T22:59:00Z"),
      price: 16,
      note: "Preços: Ultra 42€, Longo 33€, Curto 28€, Mini 24€, Caminhada 16€. Fim das inscrições: 24/05/2026 23:59 (Lisboa).",
    },
  ];

  for (const p of pricing) {
    // Try to find existing pricing phase by name and eventId
    const existingPhase = await prisma.pricingPhase.findFirst({
      where: {
        eventId: event.id,
        name: p.name,
      },
    });

    await prisma.pricingPhase.upsert({
      where: { id: existingPhase?.id || "new-phase" },
      update: {
        startDate: p.startDate,
        endDate: p.endDate,
        price: p.price,
        discountPercent: null,
        note: p.note,
      },
      create: {
        eventId: event.id,
        name: p.name,
        startDate: p.startDate,
        endDate: p.endDate,
        price: p.price,
        discountPercent: null,
        note: p.note,
      },
    });
  }

  console.log("✅ Seed concluído:", slug, "->", event.id);
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
