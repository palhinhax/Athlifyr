/**
 * Seed Zurich Maratona de Sevilha 2026
 * Complete with translations in all 6 languages
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Zurich Maratona de Sevilha 2026...");

  // Delete existing event if it exists
  const existingEvent = await prisma.event.findUnique({
    where: { slug: "zurich-maratona-sevilha-2026" },
  });

  if (existingEvent) {
    console.log("🗑️  Deleting existing event...");
    await prisma.event.delete({
      where: { slug: "zurich-maratona-sevilha-2026" },
    });
  }

  const event = await prisma.event.create({
    data: {
      title: "Zurich Maratona de Sevilha 2026",
      slug: "zurich-maratona-sevilha-2026",
      description: `A XLI Maratona de Zurique-Sevilha é um dos eventos desportivos mais emblemáticos de Espanha, reunindo milhares de corredores de todo o mundo na bela cidade de Sevilha. Com selo World Athletics e aprovação da RFEA, é uma das maratonas mais prestigiadas da Europa.

A prova realiza-se no domingo, 15 de fevereiro de 2026, às 8h30, com percurso totalmente certificado de 42,195 km. O circuito passa pelos locais mais icónicos de Sevilha, incluindo a Avenida María Luisa, Paseo de Cristóbal Colón, Plaza de España, e termina no Paseo de las Delicias.

Com limite de tempo de 6 horas, a prova conta com apoio completo de hidratação e alimentação ao longo do percurso, assistência médica, pacers, e um trajeto maioritariamente plano ideal para recordes pessoais. O evento inclui também a categoria de cadeirantes e atletas com deficiência.`,
      sportTypes: ["RUNNING"],
      startDate: new Date("2026-02-15T08:30:00Z"),
      endDate: new Date("2026-02-15T14:30:00Z"),
      city: "Sevilha",
      country: "Espanha",
      latitude: 37.37924,
      longitude: -5.9892,
      googleMapsUrl: "https://maps.app.goo.gl/2TVMdiGHX322a2YQ6",
      externalUrl:
        "https://in.njuko.com/zurich-maraton-de-sevilla-2026-by-slib?currentPage=select-competition",
      imageUrl: "/events/maratona-sevilha.jpg",
      isFeatured: true,
      registrationDeadline: new Date("2026-02-09T23:59:00Z"),
      stravaRouteEmbed: `<div class="strava-embed-placeholder" data-embed-type="route" data-embed-id="3446449712738703246" data-style="standard" data-map-hash="11.03/37.3878/-5.9849" data-from-embed="true"></div><script src="https://strava-embeds.com/embed.js"></script>`,

      // Translations
      translations: {
        create: [
          // Portuguese (original)
          {
            language: "pt",
            title: "Zurich Maratona de Sevilha 2026",
            description: `A XLI Maratona de Zurique-Sevilha realiza-se no domingo, 15 de fevereiro de 2026, às 8h30, com um percurso totalmente certificado de 42,195 metros. Este evento é organizado pelo Instituto Municipal de Desporto da Câmara Municipal de Sevilha em conjunto com a Sport Life Ibérica SA.

A prova está incluída no calendário da AIMS e é realizada de acordo com os regulamentos da World Athletics e da RFEA para corridas de rua. O percurso passa pelos locais mais emblemáticos de Sevilha, começando na Avenida María Luisa e terminando no Paseo de las Delicias, na Glorieta de Buenos Aires.

O limite de inscrições é de 12.000 corredores, com registo aberto desde 7 de abril de 2025 até 9 de fevereiro de 2026. O tempo máximo para completar a prova é de 6 horas, com a linha de chegada a fechar às 14h30. A prova inclui postos de abastecimento a cada 5km, assistência médica completa, e serviço de guarda-volumes.

Categorias disponíveis: Sub-20, Sub-23, Sénior, Master (de 35 a 85+ anos), Atletas em cadeira de rodas, e Atletas com deficiência física/intelectual. Prémios em dinheiro para as classificações geral, espanhola, andaluza e de atletas com deficiência.`,
            city: "Sevilha",
            metaTitle: "Zurich Maratona de Sevilha 2026 - Inscrições Abertas",
            metaDescription:
              "Maratona certificada de 42km em Sevilha! World Athletics Label. 15 de fevereiro de 2026. Percurso icónico pela cidade. Inscreve-te já!",
          },
          // English
          {
            language: "en",
            title: "Zurich Seville Marathon 2026",
            description: `The XLI Zurich Seville Marathon takes place on Sunday, February 15, 2026, at 8:30 AM, with a fully certified 42.195-meter course. This event is organized by the Municipal Sports Institute of Seville City Council in conjunction with Sport Life Ibérica SA.

The race is included in the AIMS calendar and is held in accordance with World Athletics and RFEA regulations for road races. The route passes through Seville's most emblematic locations, starting at Avenida María Luisa and finishing at Paseo de las Delicias, at Glorieta de Buenos Aires.

The registration limit is 12,000 runners, with registration open from April 7, 2025 until February 9, 2026. The maximum time to complete the race is 6 hours, with the finish line closing at 2:30 PM. The race includes supply stations every 5km, complete medical assistance, and baggage service.

Available categories: Under-20, Under-23, Senior, Master (35 to 85+ years), Wheelchair athletes, and Athletes with physical/intellectual disabilities. Cash prizes for general, Spanish, Andalusian, and disabled athletes classifications.`,
            city: "Seville",
            metaTitle: "Zurich Seville Marathon 2026 - Registration Open",
            metaDescription:
              "Certified 42km marathon in Seville! World Athletics Label. February 15, 2026. Iconic city route. Register now!",
          },
          // Spanish
          {
            language: "es",
            title: "Zurich Maratón de Sevilla 2026",
            description: `El XLI Maratón de Zúrich-Sevilla se celebra el domingo 15 de febrero de 2026 a las 8:30h, con un recorrido totalmente certificado de 42.195 metros. Este evento está organizado por el Instituto Municipal de Deportes del Ayuntamiento de Sevilla en colaboración con Sport Life Ibérica SA.

La carrera está incluida en el calendario AIMS y se celebra de acuerdo con los reglamentos de World Athletics y RFEA para carreras en ruta. El recorrido pasa por los lugares más emblemáticos de Sevilla, comenzando en la Avenida María Luisa y finalizando en el Paseo de las Delicias, en la Glorieta de Buenos Aires.

El límite de inscripciones es de 12.000 corredores, con inscripción abierta desde el 7 de abril de 2025 hasta el 9 de febrero de 2026. El tiempo máximo para completar la carrera es de 6 horas, cerrando la línea de meta a las 14:30h. La carrera incluye puestos de avituallamiento cada 5km, asistencia médica completa y servicio de guardarropa.

Categorías disponibles: Sub-20, Sub-23, Senior, Master (de 35 a 85+ años), Atletas en silla de ruedas y Atletas con discapacidad física/intelectual. Premios en metálico para las clasificaciones general, española, andaluza y de atletas con discapacidad.`,
            city: "Sevilla",
            metaTitle:
              "Zurich Maratón de Sevilla 2026 - Inscripciones Abiertas",
            metaDescription:
              "¡Maratón certificado de 42km en Sevilla! World Athletics Label. 15 de febrero de 2026. Recorrido icónico por la ciudad. ¡Inscríbete ya!",
          },
          // French
          {
            language: "fr",
            title: "Marathon Zurich de Séville 2026",
            description: `Le XLI Marathon Zurich-Séville a lieu le dimanche 15 février 2026 à 8h30, avec un parcours entièrement certifié de 42,195 mètres. Cet événement est organisé par l'Institut Municipal des Sports de la Mairie de Séville en collaboration avec Sport Life Ibérica SA.

La course est inscrite au calendrier AIMS et se déroule conformément aux règlements de World Athletics et de la RFEA pour les courses sur route. Le parcours traverse les lieux les plus emblématiques de Séville, commençant à l'Avenida María Luisa et se terminant au Paseo de las Delicias, à la Glorieta de Buenos Aires.

La limite d'inscriptions est de 12 000 coureurs, avec des inscriptions ouvertes du 7 avril 2025 au 9 février 2026. Le temps maximum pour terminer la course est de 6 heures, la ligne d'arrivée fermant à 14h30. La course comprend des postes de ravitaillement tous les 5 km, une assistance médicale complète et un service de consigne.

Catégories disponibles : Moins de 20 ans, Moins de 23 ans, Senior, Master (de 35 à 85+ ans), Athlètes en fauteuil roulant et Athlètes handicapés physiques/intellectuels. Prix en espèces pour les classements général, espagnol, andalou et des athlètes handicapés.`,
            city: "Séville",
            metaTitle:
              "Marathon Zurich de Séville 2026 - Inscriptions Ouvertes",
            metaDescription:
              "Marathon certifié de 42 km à Séville ! World Athletics Label. 15 février 2026. Parcours emblématique de la ville. Inscrivez-vous maintenant !",
          },
          // German
          {
            language: "de",
            title: "Zurich Marathon Sevilla 2026",
            description: `Der XLI Zurich-Marathon Sevilla findet am Sonntag, 15. Februar 2026 um 8:30 Uhr statt, mit einer vollständig zertifizierten Strecke von 42,195 Metern. Diese Veranstaltung wird vom Städtischen Sportinstitut des Stadtrats von Sevilla in Zusammenarbeit mit Sport Life Ibérica SA organisiert.

Das Rennen ist im AIMS-Kalender enthalten und wird gemäß den Vorschriften von World Athletics und RFEA für Straßenrennen durchgeführt. Die Strecke führt durch die emblematischsten Orte Sevillas, beginnend an der Avenida María Luisa und endend am Paseo de las Delicias an der Glorieta de Buenos Aires.

Das Anmeldelimit beträgt 12.000 Läufer, die Anmeldung ist vom 7. April 2025 bis 9. Februar 2026 geöffnet. Die maximale Zeit zum Abschließen des Rennens beträgt 6 Stunden, wobei die Ziellinie um 14:30 Uhr schließt. Das Rennen umfasst Versorgungsstationen alle 5 km, vollständige medizinische Betreuung und einen Gepäckservice.

Verfügbare Kategorien: U20, U23, Senior, Master (35 bis 85+ Jahre), Rollstuhlfahrer und Athleten mit körperlichen/geistigen Behinderungen. Geldpreise für die Gesamt-, Spanisch-, Andalusisch- und Behinderten-Klassifikationen.`,
            city: "Sevilla",
            metaTitle: "Zurich Marathon Sevilla 2026 - Anmeldung Offen",
            metaDescription:
              "Zertifizierter 42-km-Marathon in Sevilla! World Athletics Label. 15. Februar 2026. Ikonische Stadtstrecke. Jetzt anmelden!",
          },
          // Italian
          {
            language: "it",
            title: "Maratona Zurich di Siviglia 2026",
            description: `La XLI Maratona Zurigo-Siviglia si svolge domenica 15 febbraio 2026 alle 8:30, con un percorso completamente certificato di 42.195 metri. Questo evento è organizzato dall'Istituto Municipale dello Sport del Comune di Siviglia in collaborazione con Sport Life Ibérica SA.

La gara è inclusa nel calendario AIMS e si svolge secondo i regolamenti di World Athletics e RFEA per le gare su strada. Il percorso attraversa i luoghi più emblematici di Siviglia, iniziando in Avenida María Luisa e terminando al Paseo de las Delicias, alla Glorieta de Buenos Aires.

Il limite di iscrizioni è di 12.000 corridori, con iscrizioni aperte dal 7 aprile 2025 al 9 febbraio 2026. Il tempo massimo per completare la gara è di 6 ore, con la linea di arrivo che chiude alle 14:30. La gara include punti di rifornimento ogni 5 km, assistenza medica completa e servizio di custodia bagagli.

Categorie disponibili: Under-20, Under-23, Senior, Master (da 35 a 85+ anni), Atleti in sedia a rotelle e Atleti con disabilità fisiche/intellettuali. Premi in denaro per le classifiche generale, spagnola, andalusa e degli atleti con disabilità.`,
            city: "Siviglia",
            metaTitle: "Maratona Zurich di Siviglia 2026 - Iscrizioni Aperte",
            metaDescription:
              "Maratona certificata di 42 km a Siviglia! World Athletics Label. 15 febbraio 2026. Percorso iconico della città. Iscriviti ora!",
          },
        ],
      },

      // Variants
      variants: {
        create: [
          {
            name: "Maratona (42km)",
            distanceKm: 42,
            elevationGainM: 150,
            elevationLossM: 150,
            startDate: new Date("2026-02-15T08:30:00Z"),
            startTime: "08:30",
            maxParticipants: 12000,
            cutoffTimeHours: 6,
            description:
              "Percurso completo de 42,195 km pelas ruas icónicas de Sevilha. Início na Avenida María Luisa e chegada no Paseo de las Delicias. Limite de tempo: 6 horas. World Athletics Label.",
            translations: {
              create: [
                {
                  language: "pt",
                  name: "Maratona (42km)",
                  description:
                    "Percurso completo de 42,195 km pelas ruas icónicas de Sevilha. Início na Avenida María Luisa e chegada no Paseo de las Delicias. Limite de tempo: 6 horas.",
                },
                {
                  language: "en",
                  name: "Marathon (42km)",
                  description:
                    "Complete 42.195 km route through Seville's iconic streets. Start at Avenida María Luisa and finish at Paseo de las Delicias. Time limit: 6 hours.",
                },
                {
                  language: "es",
                  name: "Maratón (42km)",
                  description:
                    "Recorrido completo de 42,195 km por las calles icónicas de Sevilla. Salida en Avenida María Luisa y llegada en Paseo de las Delicias. Límite de tiempo: 6 horas.",
                },
                {
                  language: "fr",
                  name: "Marathon (42km)",
                  description:
                    "Parcours complet de 42,195 km à travers les rues emblématiques de Séville. Départ à Avenida María Luisa et arrivée au Paseo de las Delicias. Limite de temps : 6 heures.",
                },
                {
                  language: "de",
                  name: "Marathon (42km)",
                  description:
                    "Vollständige 42,195 km Strecke durch die ikonischen Straßen Sevillas. Start an der Avenida María Luisa und Ziel am Paseo de las Delicias. Zeitlimit: 6 Stunden.",
                },
                {
                  language: "it",
                  name: "Maratona (42km)",
                  description:
                    "Percorso completo di 42,195 km attraverso le strade iconiche di Siviglia. Partenza in Avenida María Luisa e arrivo al Paseo de las Delicias. Limite di tempo: 6 ore.",
                },
              ],
            },
          },
          {
            name: "Maratona Cadeira de Rodas (42km)",
            distanceKm: 42,
            elevationGainM: 150,
            elevationLossM: 150,
            startDate: new Date("2026-02-15T08:29:00Z"),
            startTime: "08:29",
            maxParticipants: 100,
            cutoffTimeHours: 6,
            description:
              "Categoria para atletas em cadeira de rodas. Largada 1 minuto antes da maratona principal. Percurso completo de 42,195 km. Uso obrigatório de capacete.",
            translations: {
              create: [
                {
                  language: "pt",
                  name: "Maratona Cadeira de Rodas (42km)",
                  description:
                    "Categoria para atletas em cadeira de rodas. Largada 1 minuto antes da maratona principal. Percurso completo de 42,195 km.",
                },
                {
                  language: "en",
                  name: "Wheelchair Marathon (42km)",
                  description:
                    "Category for wheelchair athletes. Start 1 minute before the main marathon. Complete 42.195 km route.",
                },
                {
                  language: "es",
                  name: "Maratón Silla de Ruedas (42km)",
                  description:
                    "Categoría para atletas en silla de ruedas. Salida 1 minuto antes del maratón principal. Recorrido completo de 42,195 km.",
                },
                {
                  language: "fr",
                  name: "Marathon Fauteuil Roulant (42km)",
                  description:
                    "Catégorie pour athlètes en fauteuil roulant. Départ 1 minute avant le marathon principal. Parcours complet de 42,195 km.",
                },
                {
                  language: "de",
                  name: "Rollstuhl-Marathon (42km)",
                  description:
                    "Kategorie für Rollstuhlfahrer. Start 1 Minute vor dem Hauptmarathon. Vollständige 42,195 km Strecke.",
                },
                {
                  language: "it",
                  name: "Maratona Sedia a Rotelle (42km)",
                  description:
                    "Categoria per atleti in sedia a rotelle. Partenza 1 minuto prima della maratona principale. Percorso completo di 42,195 km.",
                },
              ],
            },
          },
        ],
      },

      // Pricing Phases for Maratona (42km)
      pricingPhases: {
        create: [
          // Fase 1: Promoção Especial - Residentes Província Sevilha
          {
            name: "1ª Fase - Residentes Sevilha",
            startDate: new Date("2025-04-07T00:00:00Z"),
            endDate: new Date("2025-12-05T23:59:00Z"),
            price: 20.66,
            note: "Promoção especial para residentes em municípios da província de Sevilha. Requer certificado de residência. Taxa de licença diária RFEA (€5) adicional para não federados.",
          },
          {
            name: "2ª Fase - Residentes Sevilha",
            startDate: new Date("2025-12-06T00:00:00Z"),
            endDate: new Date("2026-01-31T23:59:00Z"),
            price: 41.36,
            note: "Preço para residentes em municípios da província de Sevilha. Requer certificado de residência. Taxa de licença diária RFEA (€5) adicional para não federados.",
          },
          {
            name: "3ª Fase - Residentes Sevilha",
            startDate: new Date("2026-02-01T00:00:00Z"),
            endDate: new Date("2026-02-09T23:59:00Z"),
            price: 62.05,
            note: "Preço final para residentes em municípios da província de Sevilha. Requer certificado de residência. Taxa de licença diária RFEA (€5) adicional para não federados.",
          },
          // Inscrição Geral
          {
            name: "Inscrição Geral",
            startDate: new Date("2025-04-07T00:00:00Z"),
            endDate: new Date("2026-02-09T23:59:00Z"),
            price: 71.46,
            note: "Preço geral para não residentes na província de Sevilha. Taxa de licença diária RFEA (€5) adicional para não federados. Desconto de 20% para clubes andaluzes (de 7 de abril a 25 de maio de 2025).",
          },
          // Pessoas com Deficiência (33%)
          {
            name: "1ª Fase - Residentes (Deficiência 33%)",
            startDate: new Date("2025-04-07T00:00:00Z"),
            endDate: new Date("2025-12-05T23:59:00Z"),
            price: 10.33,
            discountPercent: 50,
            note: "Preço especial para pessoas com deficiência (33%) residentes na província de Sevilha. Requer certificado de deficiência e residência.",
          },
          {
            name: "2ª Fase - Residentes (Deficiência 33%)",
            startDate: new Date("2025-12-06T00:00:00Z"),
            endDate: new Date("2026-01-31T23:59:00Z"),
            price: 20.68,
            discountPercent: 50,
            note: "Preço especial para pessoas com deficiência (33%) residentes na província de Sevilha. Requer certificado de deficiência e residência.",
          },
          {
            name: "Inscrição Geral (Deficiência 33%)",
            startDate: new Date("2025-04-07T00:00:00Z"),
            endDate: new Date("2026-02-09T23:59:00Z"),
            price: 35.73,
            discountPercent: 50,
            note: "Preço especial para pessoas com deficiência (33%). Requer certificado de deficiência.",
          },
        ],
      },
    },
  });

  console.log("✅ Event created:", event.title);
  console.log("📍 Location:", event.city, event.country);
  console.log("📅 Date:", event.startDate.toLocaleDateString("pt-PT"));
  console.log("🏃 Variants created:", 2);
  console.log("💰 Pricing phases created:", 7);
  console.log("🌍 Translations:", 6, "languages");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
