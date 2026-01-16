/**
 * Seed VII Trilhos de Viana 2026
 * Complete with translations in all 6 languages
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding VII Trilhos de Viana 2026...");

  // Delete existing event if it exists
  const existingEvent = await prisma.event.findUnique({
    where: { slug: "vii-trilhos-viana-2026" },
  });

  if (existingEvent) {
    console.log("🗑️  Deleting existing event...");
    await prisma.event.delete({
      where: { slug: "vii-trilhos-viana-2026" },
    });
  }

  const event = await prisma.event.create({
    data: {
      title: "VII Trilhos de Viana 2026",
      slug: "vii-trilhos-viana-2026",
      description: `Os VII Trilhos de Viana são uma organização da Associação Trilhos de Viana, com o apoio da Câmara Municipal de Viana do Castelo. Realizam-se a 1 de Fevereiro de 2026, com partidas e chegadas no Estádio Municipal Manuela Machado.

O evento oferece quatro provas por trilhos, caminhos e linhas d'água da montanha de Santa Luzia, com o objetivo de promover a prática desportiva e o contacto com a natureza. As provas incluem Trail Longo (31,5km), Trail Curto (18km), Mini-Trail (12,5km) e Caminhada (8,5km).

O terreno está sujeito a alterações climatéricas repentinas, e os participantes devem estar preparados para condições meteorológicas variadas. A prova conta com postos de abastecimento ao longo dos percursos e apoio médico dos Bombeiros Voluntários de Viana do Castelo e GOBS - Grupo Operacional Busca e Salvamento.`,
      sportTypes: ["TRAIL"],
      startDate: new Date("2026-02-01T08:30:00Z"),
      endDate: new Date("2026-02-01T15:00:00Z"),
      city: "Viana do Castelo",
      country: "Portugal",
      latitude: 41.717,
      longitude: -8.818245,
      googleMapsUrl: "https://maps.app.goo.gl/VianaDoCastelo",
      externalUrl: "https://www.facebook.com/AssociacaoTrilhosdeViana",
      imageUrl: "/events/trilhos-viana.jpg",
      isFeatured: false,
      registrationDeadline: new Date("2026-01-29T23:59:59Z"),

      // Translations
      translations: {
        create: [
          // Portuguese (original)
          {
            language: "pt",
            title: "VII Trilhos de Viana 2026",
            description: `Os VII Trilhos de Viana são uma organização da Associação Trilhos de Viana, com o apoio da Câmara Municipal de Viana do Castelo. O evento realiza-se a 1 de Fevereiro de 2026 na montanha de Santa Luzia, oferecendo quatro provas diferentes.

As provas decorrem por trilhos, caminhos e linhas d'água da montanha de Santa Luzia, com partidas e chegadas no Estádio Municipal Manuela Machado. O evento promove a prática desportiva e o contacto com a natureza.

Material obrigatório para Trail Longo e Trail Curto: manta térmica, telemóvel, apito e depósito de água (mínimo 0,5 litros). A organização disponibiliza postos de abastecimento, marcação com fitas e bandeirolas laranjas, seguro de acidentes pessoais, medalha de finisher e reforço alimentar na meta.`,
            city: "Viana do Castelo",
            metaTitle:
              "VII Trilhos de Viana 2026 - Trail na Montanha de Santa Luzia",
            metaDescription:
              "Trail running em Viana do Castelo! 4 provas na montanha de Santa Luzia: 31,5km, 18km, 12,5km e 8,5km. Inscrições abertas até 29 de Janeiro.",
          },
          // English
          {
            language: "en",
            title: "VII Trilhos de Viana 2026",
            description: `The VII Trilhos de Viana is organized by Associação Trilhos de Viana with support from Viana do Castelo City Council. The event takes place on February 1st, 2026 at Santa Luzia mountain, offering four different races.

The races run through trails, paths and mountain streams of Santa Luzia mountain, with starts and finishes at Estádio Municipal Manuela Machado. The event promotes sports practice and contact with nature.

Mandatory equipment for Long Trail and Short Trail: thermal blanket, mobile phone, whistle and water container (minimum 0.5 liters). The organization provides aid stations, orange tape and flag markings, personal accident insurance, finisher medal and refreshments at the finish line.`,
            city: "Viana do Castelo",
            metaTitle:
              "VII Trilhos de Viana 2026 - Trail Running at Santa Luzia Mountain",
            metaDescription:
              "Trail running in Viana do Castelo! 4 races at Santa Luzia mountain: 31.5km, 18km, 12.5km and 8.5km. Registration open until January 29th.",
          },
          // Spanish
          {
            language: "es",
            title: "VII Trilhos de Viana 2026",
            description: `Los VII Trilhos de Viana son organizados por la Associação Trilhos de Viana con el apoyo del Ayuntamiento de Viana do Castelo. El evento tiene lugar el 1 de febrero de 2026 en la montaña de Santa Luzia, ofreciendo cuatro carreras diferentes.

Las carreras transcurren por senderos, caminos y arroyos de montaña de Santa Luzia, con salidas y llegadas en el Estadio Municipal Manuela Machado. El evento promueve la práctica deportiva y el contacto con la naturaleza.

Material obligatorio para Trail Largo y Trail Corto: manta térmica, teléfono móvil, silbato y recipiente de agua (mínimo 0,5 litros). La organización proporciona puestos de avituallamiento, marcaje con cintas y banderolas naranjas, seguro de accidentes personales, medalla de finisher y refrigerio en la meta.`,
            city: "Viana do Castelo",
            metaTitle:
              "VII Trilhos de Viana 2026 - Trail en la Montaña de Santa Luzia",
            metaDescription:
              "¡Trail running en Viana do Castelo! 4 carreras en la montaña de Santa Luzia: 31,5km, 18km, 12,5km y 8,5km. Inscripciones abiertas hasta el 29 de enero.",
          },
          // French
          {
            language: "fr",
            title: "VII Trilhos de Viana 2026",
            description: `Les VII Trilhos de Viana sont organisés par l'Associação Trilhos de Viana avec le soutien de la Mairie de Viana do Castelo. L'événement a lieu le 1er février 2026 dans la montagne de Santa Luzia, proposant quatre courses différentes.

Les courses se déroulent sur des sentiers, chemins et cours d'eau de montagne de Santa Luzia, avec départs et arrivées au Stade Municipal Manuela Machado. L'événement promeut la pratique sportive et le contact avec la nature.

Équipement obligatoire pour Trail Long et Trail Court : couverture thermique, téléphone portable, sifflet et contenant d'eau (minimum 0,5 litre). L'organisation fournit des postes de ravitaillement, balisage avec rubans et drapeaux orange, assurance accident personnelle, médaille de finisher et rafraîchissements à l'arrivée.`,
            city: "Viana do Castelo",
            metaTitle:
              "VII Trilhos de Viana 2026 - Trail dans la Montagne de Santa Luzia",
            metaDescription:
              "Trail running à Viana do Castelo ! 4 courses dans la montagne de Santa Luzia : 31,5km, 18km, 12,5km et 8,5km. Inscriptions ouvertes jusqu'au 29 janvier.",
          },
          // German
          {
            language: "de",
            title: "VII Trilhos de Viana 2026",
            description: `Die VII Trilhos de Viana werden von der Associação Trilhos de Viana mit Unterstützung der Stadtverwaltung Viana do Castelo organisiert. Die Veranstaltung findet am 1. Februar 2026 im Santa Luzia-Gebirge statt und bietet vier verschiedene Rennen.

Die Rennen führen über Pfade, Wege und Bergbäche des Santa Luzia-Gebirges, mit Start und Ziel am Estádio Municipal Manuela Machado. Die Veranstaltung fördert sportliche Betätigung und den Kontakt mit der Natur.

Pflichtausrüstung für Langen Trail und Kurzen Trail: Thermodecke, Mobiltelefon, Pfeife und Wasserbehälter (mindestens 0,5 Liter). Die Organisation stellt Verpflegungsstationen, orangefarbene Bänder und Flaggenmarkierungen, Unfallversicherung, Finisher-Medaille und Erfrischungen im Ziel bereit.`,
            city: "Viana do Castelo",
            metaTitle:
              "VII Trilhos de Viana 2026 - Trail im Santa Luzia-Gebirge",
            metaDescription:
              "Trail Running in Viana do Castelo! 4 Rennen im Santa Luzia-Gebirge: 31,5km, 18km, 12,5km und 8,5km. Anmeldung offen bis 29. Januar.",
          },
          // Italian
          {
            language: "it",
            title: "VII Trilhos de Viana 2026",
            description: `I VII Trilhos de Viana sono organizzati dall'Associação Trilhos de Viana con il supporto del Comune di Viana do Castelo. L'evento si svolge il 1° febbraio 2026 nella montagna di Santa Luzia, offrendo quattro gare diverse.

Le gare si svolgono su sentieri, percorsi e torrenti montani della montagna di Santa Luzia, con partenze e arrivi allo Stadio Municipale Manuela Machado. L'evento promuove la pratica sportiva e il contatto con la natura.

Attrezzatura obbligatoria per Trail Lungo e Trail Corto: coperta termica, telefono cellulare, fischietto e contenitore d'acqua (minimo 0,5 litri). L'organizzazione fornisce punti di ristoro, segnalazione con nastri e bandiere arancioni, assicurazione contro gli infortuni, medaglia di finisher e ristoro al traguardo.`,
            city: "Viana do Castelo",
            metaTitle:
              "VII Trilhos de Viana 2026 - Trail nella Montagna di Santa Luzia",
            metaDescription:
              "Trail running a Viana do Castelo! 4 gare nella montagna di Santa Luzia: 31,5km, 18km, 12,5km e 8,5km. Iscrizioni aperte fino al 29 gennaio.",
          },
        ],
      },

      // Variants
      variants: {
        create: [
          {
            name: "Trail Longo (31,5km)",
            distanceKm: 31.5,
            elevationGainM: 1500,
            elevationLossM: 1500,
            startDate: new Date("2026-02-01T08:30:00Z"),
            startTime: "08:30",
            maxParticipants: 200,
            cutoffTimeHours: 6,
            description:
              "Prova de trail de 31,5km com 1500m D+. Material obrigatório: manta térmica, telemóvel, apito e depósito de água (mínimo 0,5L). Idade mínima: 18 anos. Barreira horária aos 20km (Fonte da Louçã) com 4h de prova. Postos de abastecimento aos 11km, 20km e 26km.",
            translations: {
              create: [
                {
                  language: "pt",
                  name: "Trail Longo (31,5km)",
                  description:
                    "Percurso de 31,5km com 1500m D+ pela montanha de Santa Luzia. Material obrigatório: manta térmica, telemóvel, apito e depósito de água (mínimo 0,5L). Idade mínima: 18 anos.",
                },
                {
                  language: "en",
                  name: "Long Trail (31.5km)",
                  description:
                    "31.5km route with 1500m D+ through Santa Luzia mountain. Mandatory equipment: thermal blanket, mobile phone, whistle and water container (minimum 0.5L). Minimum age: 18 years.",
                },
                {
                  language: "es",
                  name: "Trail Largo (31,5km)",
                  description:
                    "Recorrido de 31,5km con 1500m D+ por la montaña de Santa Luzia. Material obligatorio: manta térmica, teléfono móvil, silbato y recipiente de agua (mínimo 0,5L). Edad mínima: 18 años.",
                },
                {
                  language: "fr",
                  name: "Trail Long (31,5km)",
                  description:
                    "Parcours de 31,5km avec 1500m D+ à travers la montagne de Santa Luzia. Équipement obligatoire : couverture thermique, téléphone portable, sifflet et contenant d'eau (minimum 0,5L). Âge minimum : 18 ans.",
                },
                {
                  language: "de",
                  name: "Langer Trail (31,5km)",
                  description:
                    "31,5km Strecke mit 1500m D+ durch das Santa Luzia-Gebirge. Pflichtausrüstung: Thermodecke, Mobiltelefon, Pfeife und Wasserbehälter (mindestens 0,5L). Mindestalter: 18 Jahre.",
                },
                {
                  language: "it",
                  name: "Trail Lungo (31,5km)",
                  description:
                    "Percorso di 31,5km con 1500m D+ attraverso la montagna di Santa Luzia. Attrezzatura obbligatoria: coperta termica, telefono cellulare, fischietto e contenitore d'acqua (minimo 0,5L). Età minima: 18 anni.",
                },
              ],
            },
          },
          {
            name: "Trail Curto (18km)",
            distanceKm: 18,
            elevationGainM: 850,
            elevationLossM: 850,
            startDate: new Date("2026-02-01T08:50:00Z"),
            startTime: "08:50",
            maxParticipants: 400,
            cutoffTimeHours: 4,
            description:
              "Prova de trail de 18km com 850m D+. Material obrigatório: manta térmica, telemóvel, apito e depósito de água (mínimo 0,5L). Idade mínima: 18 anos. Postos de abastecimento aos 7,5km e 12,8km.",
            translations: {
              create: [
                {
                  language: "pt",
                  name: "Trail Curto (18km)",
                  description:
                    "Percurso de 18km com 850m D+ pela montanha de Santa Luzia. Material obrigatório: manta térmica, telemóvel, apito e depósito de água (mínimo 0,5L). Idade mínima: 18 anos.",
                },
                {
                  language: "en",
                  name: "Short Trail (18km)",
                  description:
                    "18km route with 850m D+ through Santa Luzia mountain. Mandatory equipment: thermal blanket, mobile phone, whistle and water container (minimum 0.5L). Minimum age: 18 years.",
                },
                {
                  language: "es",
                  name: "Trail Corto (18km)",
                  description:
                    "Recorrido de 18km con 850m D+ por la montaña de Santa Luzia. Material obligatorio: manta térmica, teléfono móvil, silbato y recipiente de agua (mínimo 0,5L). Edad mínima: 18 años.",
                },
                {
                  language: "fr",
                  name: "Trail Court (18km)",
                  description:
                    "Parcours de 18km avec 850m D+ à travers la montagne de Santa Luzia. Équipement obligatoire : couverture thermique, téléphone portable, sifflet et contenant d'eau (minimum 0,5L). Âge minimum : 18 ans.",
                },
                {
                  language: "de",
                  name: "Kurzer Trail (18km)",
                  description:
                    "18km Strecke mit 850m D+ durch das Santa Luzia-Gebirge. Pflichtausrüstung: Thermodecke, Mobiltelefon, Pfeife und Wasserbehälter (mindestens 0,5L). Mindestalter: 18 Jahre.",
                },
                {
                  language: "it",
                  name: "Trail Corto (18km)",
                  description:
                    "Percorso di 18km con 850m D+ attraverso la montagna di Santa Luzia. Attrezzatura obbligatoria: coperta termica, telefono cellulare, fischietto e contenitore d'acqua (minimo 0,5L). Età minima: 18 anni.",
                },
              ],
            },
          },
          {
            name: "Mini-Trail (12,5km)",
            distanceKm: 12.5,
            elevationGainM: 640,
            elevationLossM: 640,
            startDate: new Date("2026-02-01T09:10:00Z"),
            startTime: "09:10",
            maxParticipants: 500,
            cutoffTimeHours: 3,
            description:
              "Prova de trail de 12,5km com 640m D+. Idade mínima: 12 anos. Posto de abastecimento aos 6,5km.",
            translations: {
              create: [
                {
                  language: "pt",
                  name: "Mini-Trail (12,5km)",
                  description:
                    "Percurso de 12,5km com 640m D+ pela montanha de Santa Luzia. Idade mínima: 12 anos. Ideal para iniciantes em trail running.",
                },
                {
                  language: "en",
                  name: "Mini-Trail (12.5km)",
                  description:
                    "12.5km route with 640m D+ through Santa Luzia mountain. Minimum age: 12 years. Ideal for trail running beginners.",
                },
                {
                  language: "es",
                  name: "Mini-Trail (12,5km)",
                  description:
                    "Recorrido de 12,5km con 640m D+ por la montaña de Santa Luzia. Edad mínima: 12 años. Ideal para principiantes en trail running.",
                },
                {
                  language: "fr",
                  name: "Mini-Trail (12,5km)",
                  description:
                    "Parcours de 12,5km avec 640m D+ à travers la montagne de Santa Luzia. Âge minimum : 12 ans. Idéal pour les débutants en trail running.",
                },
                {
                  language: "de",
                  name: "Mini-Trail (12,5km)",
                  description:
                    "12,5km Strecke mit 640m D+ durch das Santa Luzia-Gebirge. Mindestalter: 12 Jahre. Ideal für Trail Running-Anfänger.",
                },
                {
                  language: "it",
                  name: "Mini-Trail (12,5km)",
                  description:
                    "Percorso di 12,5km con 640m D+ attraverso la montagna di Santa Luzia. Età minima: 12 anni. Ideale per principianti nel trail running.",
                },
              ],
            },
          },
          {
            name: "Caminhada (8,5km)",
            distanceKm: 8.5,
            elevationGainM: 450,
            elevationLossM: 450,
            startDate: new Date("2026-02-01T09:10:00Z"),
            startTime: "09:10",
            maxParticipants: 250,
            cutoffTimeHours: 2.5,
            description:
              "Caminhada não competitiva de 8,5km com 450m D+. Idade mínima: 12 anos. Ponto de água aos 4km.",
            translations: {
              create: [
                {
                  language: "pt",
                  name: "Caminhada (8,5km)",
                  description:
                    "Caminhada não competitiva de 8,5km com 450m D+ pela montanha de Santa Luzia. Idade mínima: 12 anos. Ideal para famílias e grupos.",
                },
                {
                  language: "en",
                  name: "Walk (8.5km)",
                  description:
                    "Non-competitive 8.5km walk with 450m D+ through Santa Luzia mountain. Minimum age: 12 years. Ideal for families and groups.",
                },
                {
                  language: "es",
                  name: "Caminata (8,5km)",
                  description:
                    "Caminata no competitiva de 8,5km con 450m D+ por la montaña de Santa Luzia. Edad mínima: 12 años. Ideal para familias y grupos.",
                },
                {
                  language: "fr",
                  name: "Randonnée (8,5km)",
                  description:
                    "Randonnée non compétitive de 8,5km avec 450m D+ à travers la montagne de Santa Luzia. Âge minimum : 12 ans. Idéal pour les familles et les groupes.",
                },
                {
                  language: "de",
                  name: "Wanderung (8,5km)",
                  description:
                    "Nicht-wettbewerbsfähige 8,5km Wanderung mit 450m D+ durch das Santa Luzia-Gebirge. Mindestalter: 12 Jahre. Ideal für Familien und Gruppen.",
                },
                {
                  language: "it",
                  name: "Camminata (8,5km)",
                  description:
                    "Camminata non competitiva di 8,5km con 450m D+ attraverso la montagna di Santa Luzia. Età minima: 12 anni. Ideale per famiglie e gruppi.",
                },
              ],
            },
          },
        ],
      },

      // Pricing Phases
      pricingPhases: {
        create: [
          {
            name: "Fase Única - Trail Longo 31,5km",
            startDate: new Date("2025-11-15T00:00:00Z"),
            endDate: new Date("2026-01-29T23:59:59Z"),
            price: 17.0,
            discountPercent: null,
            note: "Inclui dorsal, seguro, banhos, medalha de finisher, reforço alimentar. T-shirt opcional: +3€",
          },
          {
            name: "Fase Única - Trail Curto 18km",
            startDate: new Date("2025-11-15T00:00:00Z"),
            endDate: new Date("2026-01-29T23:59:59Z"),
            price: 15.0,
            discountPercent: null,
            note: "Inclui dorsal, seguro, banhos, medalha de finisher, reforço alimentar. T-shirt opcional: +3€",
          },
          {
            name: "Fase Única - Mini-Trail 12,5km",
            startDate: new Date("2025-11-15T00:00:00Z"),
            endDate: new Date("2026-01-29T23:59:59Z"),
            price: 13.0,
            discountPercent: null,
            note: "Inclui dorsal, seguro, banhos, medalha de finisher, reforço alimentar. T-shirt opcional: +3€",
          },
          {
            name: "Fase Única - Caminhada 8,5km",
            startDate: new Date("2025-11-15T00:00:00Z"),
            endDate: new Date("2026-01-29T23:59:59Z"),
            price: 10.0,
            discountPercent: null,
            note: "Inclui dorsal, seguro, banhos, medalha de finisher, reforço alimentar. T-shirt opcional: +3€",
          },
          {
            name: "Desconto Equipas +10 elementos",
            startDate: new Date("2025-11-15T00:00:00Z"),
            endDate: new Date("2026-01-29T23:59:59Z"),
            price: 0.0,
            discountPercent: 10,
            note: "10% desconto para equipas com mais de 10 elementos. Solicitar VOUCHER.",
          },
          {
            name: "Desconto Equipas +20 elementos",
            startDate: new Date("2025-11-15T00:00:00Z"),
            endDate: new Date("2026-01-29T23:59:59Z"),
            price: 0.0,
            discountPercent: 20,
            note: "20% desconto para equipas com mais de 20 elementos. Solicitar VOUCHER.",
          },
        ],
      },
    },
  });

  console.log("✅ VII Trilhos de Viana 2026 created with ID:", event.id);
  console.log(
    "📝 Translations created for 6 languages (pt, en, es, fr, de, it)"
  );
  console.log(
    "🏃 4 variants created: Trail Longo (31.5km), Trail Curto (18km), Mini-Trail (12.5km), Caminhada (8.5km)"
  );
  console.log("💰 6 pricing phases including team discounts");
  console.log("📅 Event date: February 1, 2026");
  console.log(
    "📍 Location: Estádio Municipal Manuela Machado, Viana do Castelo"
  );
  console.log("🔗 Registration URL: https://www.cyclonessports.com/");
  console.log("📧 Contact: a.trilhosdeviana@gmail.com");
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
