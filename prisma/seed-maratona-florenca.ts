/**
 * Seed Estra Firenze Marathon 2026
 * Complete with translations in all 6 languages
 * Official data from firenzemarathon.it
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Estra Firenze Marathon 2026...");

  // Delete existing event if it exists
  const existingEvent = await prisma.event.findUnique({
    where: { slug: "estra-firenze-marathon-2026" },
  });

  if (existingEvent) {
    console.log("🗑️  Deleting existing event...");
    await prisma.event.delete({
      where: { slug: "estra-firenze-marathon-2026" },
    });
  }

  const event = await prisma.event.create({
    data: {
      title: "Estra Firenze Marathon 2026",
      slug: "estra-firenze-marathon-2026",
      description: `A Estra Firenze Marathon é uma das maratonas mais prestigiadas de Itália, realizada na deslumbrante cidade de Florença. Este evento combina desporto, arte e cultura numa experiência inesquecível através das ruas históricas da cidade renascentista.

A 42ª edição realizar-se-á no domingo 29 de novembro de 2026, com partida às 08:30 na icónica Piazza Duomo. Com um limite de 13.000 participantes, esta maratona oferece um percurso de 42,195 km que passa pelas mais belas pontes e vielas medievais de Florença, combinando a paixão pela corrida com a beleza intemporal da cidade.

O evento é regulamentado pela FIDAL e segue as normas da World Athletics. Os participantes dispõem de 6 horas para completar o percurso, com checkpoints intermédios aos 21,097 km (3 horas) e aos 30 km (4 horas e 15 minutos). A organização disponibiliza pacemakers para vários tempos objetivo, postos de hidratação e alimentação, assistência médica completa, e uma Marathon EXPO nos dias 27 e 28 de novembro na Stazione Leopolda.`,
      sportTypes: ["RUNNING"],
      startDate: new Date("2026-11-29T08:30:00Z"),
      endDate: new Date("2026-11-29T14:30:00Z"), // Start time + 6h cutoff time
      city: "Florença",
      country: "Itália",
      latitude: 43.7731,
      longitude: 11.256,
      googleMapsUrl: "https://maps.google.com/?q=43.7731,11.2560",
      externalUrl: "https://www.firenzemarathon.it",
      imageUrl: "/events/maratona-florenca.jpg",
      isFeatured: true,

      // Translations
      translations: {
        create: [
          // Portuguese (European)
          {
            language: "pt",
            title: "Estra Firenze Marathon 2026",
            description: `A Estra Firenze Marathon é uma das maratonas mais prestigiadas de Itália, realizada na deslumbrante cidade de Florença. Este evento combina desporto, arte e cultura numa experiência inesquecível através das ruas históricas da cidade renascentista.

A 42ª edição realizar-se-á no domingo 29 de novembro de 2026, com partida às 08:30 na icónica Piazza Duomo. Com um limite de 13.000 participantes, esta maratona oferece um percurso de 42,195 km que passa pelas mais belas pontes e vielas medievais de Florença, combinando a paixão pela corrida com a beleza intemporal da cidade.

O evento é regulamentado pela FIDAL e segue as normas da World Athletics. Os participantes dispõem de 6 horas para completar o percurso, com checkpoints intermédios aos 21,097 km (3 horas) e aos 30 km (4 horas e 15 minutos). A organização disponibiliza pacemakers para vários tempos objetivo, postos de hidratação e alimentação, assistência médica completa, e uma Marathon EXPO nos dias 27 e 28 de novembro na Stazione Leopolda.`,
            city: "Florença",
            metaTitle: "Estra Firenze Marathon 2026 - Inscrições Abertas",
            metaDescription:
              "Corre uma das maratonas mais bonitas do mundo! 42km pelas ruas históricas de Florença. Inscreve-te já na Estra Firenze Marathon 2026!",
          },
          // English
          {
            language: "en",
            title: "Estra Firenze Marathon 2026",
            description: `The Estra Firenze Marathon is one of Italy's most prestigious marathons, held in the stunning city of Florence. This event combines sport, art, and culture in an unforgettable experience through the historical streets of the Renaissance city.

The 42nd edition will take place on Sunday, November 29, 2026, starting at 08:30 at the iconic Piazza Duomo. With a limit of 13,000 participants, this marathon offers a 42.195 km course that passes through Florence's most beautiful bridges and medieval alleys, combining the passion for running with the timeless beauty of the city.

The event is regulated by FIDAL and follows World Athletics standards. Participants have 6 hours to complete the course, with intermediate checkpoints at 21.097 km (3 hours) and 30 km (4 hours and 15 minutes). The organization provides pacemakers for various target times, hydration and nutrition stations, complete medical assistance, and a Marathon EXPO on November 27-28 at Stazione Leopolda.`,
            city: "Florence",
            metaTitle: "Estra Firenze Marathon 2026 - Registration Open",
            metaDescription:
              "Run one of the most beautiful marathons in the world! 42km through Florence's historic streets. Register now for the Estra Firenze Marathon 2026!",
          },
          // Spanish
          {
            language: "es",
            title: "Estra Firenze Marathon 2026",
            description: `El Estra Firenze Marathon es uno de los maratones más prestigiosos de Italia, celebrado en la impresionante ciudad de Florencia. Este evento combina deporte, arte y cultura en una experiencia inolvidable a través de las calles históricas de la ciudad renacentista.

La 42ª edición se llevará a cabo el domingo 29 de noviembre de 2026, con salida a las 08:30 en la icónica Piazza Duomo. Con un límite de 13.000 participantes, este maratón ofrece un recorrido de 42,195 km que pasa por los puentes más bellos y callejones medievales de Florencia, combinando la pasión por correr con la belleza intemporal de la ciudad.

El evento está regulado por FIDAL y sigue las normas de World Athletics. Los participantes tienen 6 horas para completar el recorrido, con puntos de control intermedios en los 21,097 km (3 horas) y los 30 km (4 horas y 15 minutos). La organización proporciona pacemakers para varios tiempos objetivo, puestos de hidratación y alimentación, asistencia médica completa, y una Marathon EXPO los días 27 y 28 de noviembre en la Stazione Leopolda.`,
            city: "Florencia",
            metaTitle: "Estra Firenze Marathon 2026 - Inscripciones Abiertas",
            metaDescription:
              "¡Corre uno de los maratones más hermosos del mundo! 42km por las calles históricas de Florencia. ¡Inscríbete ya en el Estra Firenze Marathon 2026!",
          },
          // French
          {
            language: "fr",
            title: "Estra Firenze Marathon 2026",
            description: `Le Marathon Estra Firenze est l'un des marathons les plus prestigieux d'Italie, organisé dans la magnifique ville de Florence. Cet événement combine sport, art et culture dans une expérience inoubliable à travers les rues historiques de la cité de la Renaissance.

La 42e édition aura lieu le dimanche 29 novembre 2026, avec un départ à 08h30 sur l'emblématique Piazza Duomo. Avec une limite de 13 000 participants, ce marathon propose un parcours de 42,195 km qui traverse les plus beaux ponts et ruelles médiévales de Florence, alliant la passion de la course à la beauté intemporelle de la ville.

L'événement est réglementé par la FIDAL et suit les normes de World Athletics. Les participants ont 6 heures pour terminer le parcours, avec des points de contrôle intermédiaires à 21,097 km (3 heures) et 30 km (4 heures et 15 minutes). L'organisation fournit des pacemakers pour différents objectifs de temps, des postes d'hydratation et d'alimentation, une assistance médicale complète, et une Marathon EXPO les 27 et 28 novembre à la Stazione Leopolda.`,
            city: "Florence",
            metaTitle: "Estra Firenze Marathon 2026 - Inscriptions Ouvertes",
            metaDescription:
              "Courez l'un des plus beaux marathons du monde ! 42km à travers les rues historiques de Florence. Inscrivez-vous au Marathon Estra Firenze 2026 !",
          },
          // German
          {
            language: "de",
            title: "Estra Firenze Marathon 2026",
            description: `Der Estra Firenze Marathon ist einer der prestigeträchtigsten Marathons Italiens und findet in der atemberaubenden Stadt Florenz statt. Diese Veranstaltung kombiniert Sport, Kunst und Kultur zu einem unvergesslichen Erlebnis durch die historischen Straßen der Renaissance-Stadt.

Die 42. Ausgabe findet am Sonntag, 29. November 2026, statt, mit Start um 08:30 Uhr auf der ikonischen Piazza Duomo. Mit einer Begrenzung auf 13.000 Teilnehmer bietet dieser Marathon eine 42,195 km lange Strecke, die durch die schönsten Brücken und mittelalterlichen Gassen von Florenz führt und die Leidenschaft fürs Laufen mit der zeitlosen Schönheit der Stadt verbindet.

Die Veranstaltung wird von der FIDAL reguliert und folgt den Standards der World Athletics. Die Teilnehmer haben 6 Stunden Zeit, um die Strecke zu absolvieren, mit Zwischenkontrollpunkten bei 21,097 km (3 Stunden) und 30 km (4 Stunden und 15 Minuten). Die Organisation stellt Pacemakers für verschiedene Zielzeiten, Verpflegungs- und Hydratationsstationen, vollständige medizinische Betreuung und eine Marathon EXPO am 27. und 28. November in der Stazione Leopolda zur Verfügung.`,
            city: "Florenz",
            metaTitle: "Estra Firenze Marathon 2026 - Anmeldung Offen",
            metaDescription:
              "Laufen Sie einen der schönsten Marathons der Welt! 42km durch die historischen Straßen von Florenz. Jetzt für den Estra Firenze Marathon 2026 anmelden!",
          },
          // Italian
          {
            language: "it",
            title: "Estra Firenze Marathon 2026",
            description: `La Estra Firenze Marathon è una delle maratone più prestigiose d'Italia, che si svolge nella splendida città di Firenze. Questo evento combina sport, arte e cultura in un'esperienza indimenticabile attraverso le strade storiche della città rinascimentale.

La 42ª edizione si terrà domenica 29 novembre 2026, con partenza alle 08:30 nell'iconica Piazza Duomo. Con un limite di 13.000 partecipanti, questa maratona offre un percorso di 42,195 km che attraversa i ponti più belli e i vicoli medievali di Firenze, combinando la passione per la corsa con la bellezza senza tempo della città.

L'evento è regolamentato dalla FIDAL e segue gli standard della World Athletics. I partecipanti hanno 6 ore per completare il percorso, con checkpoint intermedi ai 21,097 km (3 ore) e ai 30 km (4 ore e 15 minuti). L'organizzazione fornisce pacemaker per vari tempi obiettivo, punti di idratazione e alimentazione, assistenza medica completa, e una Marathon EXPO nei giorni 27 e 28 novembre alla Stazione Leopolda.`,
            city: "Firenze",
            metaTitle: "Estra Firenze Marathon 2026 - Iscrizioni Aperte",
            metaDescription:
              "Corri una delle maratone più belle del mondo! 42km attraverso le strade storiche di Firenze. Iscriviti ora alla Estra Firenze Marathon 2026!",
          },
        ],
      },

      // Event Variants
      variants: {
        create: [
          // Marathon 42.195K
          {
            name: "Estra Firenze Marathon 42.195K",
            distanceKm: 42.195,
            elevationGainM: 200,
            startDate: new Date("2026-11-29T08:30:00Z"),
            startTime: "08:30",
            cutoffTimeHours: 6.0,
            maxParticipants: 13000,
            description: `Percurso completo de 42,195 km pelas ruas históricas de Florença. Partida na Piazza Duomo com chegada na mesma praça após percorrer as principais atracções da cidade.

**Requisitos de Participação**:
- Idade mínima: 20 anos (nascidos em 2006 ou anteriores - 2026 event requires age 20)
- Certificado médico de aptidão física para desporto competitivo específico para atletismo válido em 29 de novembro de 2026
- Filiação FIDAL, RUN CARD ou RUN CARD EPS válida

**Limite de Tempo**: 6 horas (tempo de pistola)
**Checkpoint aos 21,097 km**: 3 horas
**Checkpoint aos 30 km**: 4 horas e 15 minutos

**Pacemakers Disponíveis**: 2:55, 3:00, 3:15, 3:30, 3:45, 4:00, 4:15, 4:30, 4:45, 5:00, 5:15, 5:30

**Grupos de Partida por Tempo Pessoal**:
- AMARELO: Até 2:30
- VERMELHO: 2:31 a 3:00
- AZUL: 3:01 a 3:30
- CINZA: 3:31 a 4:00
- VERDE: 4:01 a 4:30
- FÚCSIA: Mais de 4:30

**Levantamento de Dorsais**:
- Sexta-feira, 27 de novembro: 10:30-19:30
- Sábado, 28 de novembro: 9:30-19:30
- Local: Marathon Expo - Stazione Leopolda, Viale Fratelli Rosselli 5, Porta a Prato (Florença)

**Cronometragem**: Chip cronométrico colocado no dorsal (não remover sob pena de exclusão)

**Classificação**: Resultados oficiais com tempos de pistola e parciais nos km 5, 10, 15, 21.097, 25, 30, 35, 40`,

            translations: {
              create: [
                {
                  language: "pt",
                  name: "Estra Firenze Marathon 42.195K",
                  description:
                    "Maratona completa de 42,195 km pelas ruas históricas de Florença, com limite de 6 horas e pacemakers disponíveis.",
                },
                {
                  language: "en",
                  name: "Estra Firenze Marathon 42.195K",
                  description:
                    "Full 42.195 km marathon through Florence's historic streets, with 6-hour time limit and pacemakers available.",
                },
                {
                  language: "es",
                  name: "Estra Firenze Marathon 42.195K",
                  description:
                    "Maratón completo de 42,195 km por las calles históricas de Florencia, con límite de 6 horas y pacemakers disponibles.",
                },
                {
                  language: "fr",
                  name: "Estra Firenze Marathon 42.195K",
                  description:
                    "Marathon complet de 42,195 km à travers les rues historiques de Florence, avec limite de 6 heures et pacemakers disponibles.",
                },
                {
                  language: "de",
                  name: "Estra Firenze Marathon 42.195K",
                  description:
                    "Vollständiger 42,195 km Marathon durch die historischen Straßen von Florenz, mit 6-Stunden-Limit und Pacemakers.",
                },
                {
                  language: "it",
                  name: "Estra Firenze Marathon 42.195K",
                  description:
                    "Maratona completa di 42,195 km attraverso le strade storiche di Firenze, con limite di 6 ore e pacemaker disponibili.",
                },
              ],
            },

            // Pricing Phases for Marathon
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase",
                  price: 69.0,
                  startDate: new Date("2026-01-07T00:00:00Z"),
                  endDate: new Date("2026-03-31T23:59:59Z"),
                  note: "Primeira fase de inscrições. Taxas administrativas não incluídas.",
                },
                {
                  name: "2ª Fase",
                  price: 79.0,
                  startDate: new Date("2026-04-01T00:00:00Z"),
                  endDate: new Date("2026-06-30T23:59:59Z"),
                  note: "Segunda fase de inscrições. Taxas administrativas não incluídas.",
                },
                {
                  name: "3ª Fase",
                  price: 89.0,
                  startDate: new Date("2026-07-01T00:00:00Z"),
                  endDate: new Date("2026-08-31T23:59:59Z"),
                  note: "Terceira fase de inscrições. Taxas administrativas não incluídas.",
                },
                {
                  name: "4ª Fase",
                  price: 99.0,
                  startDate: new Date("2026-09-01T00:00:00Z"),
                  endDate: new Date("2026-10-15T23:59:59Z"),
                  note: "Quarta fase de inscrições. Taxas administrativas não incluídas. Última fase para tarifas especiais de grupos desportivos.",
                },
                {
                  name: "5ª Fase",
                  price: 109.0,
                  startDate: new Date("2026-10-16T00:00:00Z"),
                  endDate: new Date("2026-11-20T23:59:59Z"),
                  note: "Última fase de inscrições. As inscrições encerram a 20 de novembro de 2026. Taxas administrativas não incluídas.",
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`✅ Estra Firenze Marathon 2026 created with ID: ${event.id}`);
  console.log(
    "📝 Translations created for 6 languages (pt, en, es, fr, de, it)"
  );
  console.log("🏃 1 variant created: Marathon 42.195K");
  console.log("💰 5 pricing phases configured (€69 to €109)");
  console.log("📅 Main event date: November 29, 2026");
  console.log("📍 Location: Piazza Duomo, Florence, Italy");
  console.log("🔗 Official website: https://www.firenzemarathon.it");
  console.log("");
  console.log("ℹ️  Additional info from official website:");
  console.log("   - Max participants: 13,000");
  console.log(
    "   - Marathon EXPO: 27-28 nov, Stazione Leopolda (Viale Fratelli Rosselli 5)"
  );
  console.log("   - Bib collection: Friday 10:30-19:30, Saturday 9:30-19:30");
  console.log(
    "   - Pacemakers: 2:55, 3:00, 3:15, 3:30, 3:45, 4:00, 4:15, 4:30, 4:45, 5:00, 5:15, 5:30"
  );
  console.log("   - Registration closes: November 20, 2026");
  console.log(
    "   - Starting corrals by personal best: YELLOW, RED, BLUE, GREY, GREEN, FUCHSIA"
  );
  console.log("   - Cutoff times: 21.097km (3h), 30km (4h15m), Finish (6h)");
  console.log(
    "   - Split times: km 5, 10, 15, 21.097, 25, 30, 35, 40 + additional intermediate checkpoints"
  );
  console.log("   - Disabled athletes rate: €30 (FISPESS and FSSI members)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
