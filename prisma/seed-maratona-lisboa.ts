/**
 * Seed EDP Maratona de Lisboa 2026
 * Complete with translations in all 6 languages
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding EDP Maratona de Lisboa 2026...");

  // Delete existing event if it exists
  const existingEvent = await prisma.event.findUnique({
    where: { slug: "edp-maratona-lisboa-2026" },
  });

  if (existingEvent) {
    console.log("🗑️  Deleting existing event...");
    await prisma.event.delete({
      where: { slug: "edp-maratona-lisboa-2026" },
    });
  }

  const event = await prisma.event.create({
    data: {
      title: "EDP Maratona de Lisboa 2026",
      slug: "edp-maratona-lisboa-2026",
      description: `A EDP Maratona de Lisboa é um dos eventos desportivos mais emblemáticos de Portugal, reunindo milhares de corredores de todo o mundo na capital portuguesa. Com selo World Athletics Elite Label, é uma das maratonas mais prestigiadas da Europa.

O evento decorrerá entre 8 e 11 de outubro de 2026, começando com a Sport Expo e levantamento de kits nos dias 8 e 9 de outubro. As provas incluem a Maratona (42km) no dia 10 de outubro às 08:00, e a Meia Maratona (21km) e EDP 8K no dia 11 de outubro às 09:20.

O percurso é reconhecido pela sua beleza cénica, passando por locais icónicos de Lisboa. Com um traçado maioritariamente plano e rápido, a Maratona de Lisboa oferece condições ideais para recordes pessoais. Os participantes têm 6 horas para completar o percurso, com apoio de pacers, assistência médica completa, e pontos de hidratação e alimentação ao longo do trajeto.`,
      sportTypes: ["RUNNING"],
      startDate: new Date("2026-10-10T08:00:00Z"),
      endDate: new Date("2026-10-11T15:30:00Z"),
      city: "Lisboa",
      country: "Portugal",
      latitude: 38.7223,
      longitude: -9.1393,
      googleMapsUrl: "https://maps.app.goo.gl/Lisboa",
      externalUrl: "https://www.maratonaclubedeportugal.com",
      imageUrl: "/events/maratona-lisboa.jpg",
      isFeatured: true,

      // Translations
      translations: {
        create: [
          // Portuguese (original)
          {
            language: "pt",
            title: "EDP Maratona de Lisboa 2026",
            description: `A EDP Maratona de Lisboa é considerada uma das corridas mais bonitas do mundo, aclamada pela Forbes Magazine, Huffington Post e American Express. A prova é 100% junto ao mar e rio, oferecendo vistas únicas aos corredores ao longo de todo o percurso.

Com início na Estrada N6-7 em Carcavelos e chegada à Praça do Comércio, a EDP Maratona de Lisboa é uma prova oficial do calendário da World Athletics (IAAF) com o selo "World Athletics Elite Label", atraindo atletas de elite e milhares de corredores de todo o mundo.

O percurso é reconhecido pela sua beleza cénica e por ser relativamente plano e rápido, ideal tanto para corredores experientes que procuram recordes pessoais como para iniciantes que querem completar a sua primeira maratona. O limite de tempo é de 6 horas e o evento inclui também a Hyundai Meia Maratona e a EDP 8K.`,
            city: "Lisboa",
            metaTitle: "EDP Maratona de Lisboa 2026 - Inscrições Abertas",
            metaDescription:
              "Uma das corridas mais bonitas do mundo! 42km junto ao mar e rio. World Athletics Elite Label. Inscreve-te já na EDP Maratona de Lisboa 2026!",
          },
          // English
          {
            language: "en",
            title: "EDP Lisbon Marathon 2026",
            description: `The EDP Lisbon Marathon is considered one of the most beautiful races in the world, acclaimed by Forbes Magazine, Huffington Post, and American Express. The race is 100% sea and river side, providing runners with unique views throughout the entire course.

Starting at Estrada N6-7 in Carcavelos and finishing at Praça do Comércio, the EDP Lisbon Marathon is an official race on the World Athletics (IAAF) calendar with the "World Athletics Elite Label" seal, attracting elite athletes and thousands of runners from all over the world.

The course is renowned for its scenic beauty and for being relatively flat and fast, ideal for both experienced runners seeking personal records and beginners wanting to complete their first marathon. The time limit is 6 hours.`,
            city: "Lisbon",
            metaTitle: "EDP Lisbon Marathon 2026 - Registration Open",
            metaDescription:
              "One of the most beautiful races in the world! 42km by the sea and river. World Athletics Elite Label. Register now for the EDP Lisbon Marathon 2026!",
          },
          // Spanish
          {
            language: "es",
            title: "EDP Maratón de Lisboa 2026",
            description: `El EDP Maratón de Lisboa está considerado como una de las carreras más bonitas del mundo, aclamada por Forbes Magazine, Huffington Post y American Express. La carrera es 100% junto al mar y río, ofreciendo vistas únicas a los corredores durante todo el recorrido.

Comenzando en Estrada N6-7 en Carcavelos y finalizando en Praça do Comércio, el EDP Maratón de Lisboa es una carrera oficial del calendario de World Athletics (IAAF) con el sello "World Athletics Elite Label", atrayendo atletas de élite y miles de corredores de todo el mundo.

El recorrido es reconocido por su belleza escénica y por ser relativamente llano y rápido, ideal tanto para corredores experimentados que buscan récords personales como para principiantes que quieren completar su primer maratón. El límite de tiempo es de 6 horas.`,
            city: "Lisboa",
            metaTitle: "EDP Maratón de Lisboa 2026 - Inscripciones Abiertas",
            metaDescription:
              "¡Una de las carreras más bonitas del mundo! 42km junto al mar y río. World Athletics Elite Label. ¡Inscríbete ya en el EDP Maratón de Lisboa 2026!",
          },
          // French
          {
            language: "fr",
            title: "EDP Marathon de Lisbonne 2026",
            description: `Le EDP Marathon de Lisbonne est considéré comme l'une des plus belles courses au monde, acclamée par Forbes Magazine, Huffington Post et American Express. La course est 100% au bord de la mer et du fleuve, offrant des vues uniques aux coureurs tout au long du parcours.

Commençant à Estrada N6-7 à Carcavelos et se terminant à Praça do Comércio, le EDP Marathon de Lisbonne est une course officielle du calendrier World Athletics (IAAF) avec le label "World Athletics Elite Label", attirant des athlètes d'élite et des milliers de coureurs du monde entier.

Le parcours est reconnu pour sa beauté scénique et pour être relativement plat et rapide, idéal tant pour les coureurs expérimentés à la recherche de records personnels que pour les débutants souhaitant terminer leur premier marathon. La limite de temps est de 6 heures.`,
            city: "Lisbonne",
            metaTitle: "EDP Marathon de Lisbonne 2026 - Inscriptions Ouvertes",
            metaDescription:
              "L'une des plus belles courses au monde ! 42km au bord de la mer et du fleuve. World Athletics Elite Label. Inscrivez-vous au EDP Marathon de Lisbonne 2026 !",
          },
          // German
          {
            language: "de",
            title: "EDP Lissabon-Marathon 2026",
            description: `Der EDP Lissabon-Marathon gilt als eines der schönsten Rennen der Welt und wird vom Forbes Magazine, Huffington Post und American Express gelobt. Das Rennen verläuft zu 100% am Meer und Fluss und bietet den Läufern während der gesamten Strecke einzigartige Ausblicke.

Das Rennen beginnt an der Estrada N6-7 in Carcavelos und endet am Praça do Comércio. Der EDP Lissabon-Marathon ist ein offizielles Rennen im Kalender der World Athletics (IAAF) mit dem "World Athletics Elite Label" und zieht Elite-Athleten und Tausende von Läufern aus der ganzen Welt an.

Die Strecke ist für ihre landschaftliche Schönheit und ihr relativ flaches und schnelles Profil bekannt, ideal sowohl für erfahrene Läufer, die persönliche Rekorde anstreben, als auch für Anfänger, die ihren ersten Marathon absolvieren möchten. Das Zeitlimit beträgt 6 Stunden.`,
            city: "Lissabon",
            metaTitle: "EDP Lissabon-Marathon 2026 - Anmeldung Offen",
            metaDescription:
              "Eines der schönsten Rennen der Welt! 42km am Meer und Fluss. World Athletics Elite Label. Jetzt für den EDP Lissabon-Marathon 2026 anmelden!",
          },
          // Italian
          {
            language: "it",
            title: "EDP Maratona di Lisbona 2026",
            description: `La EDP Maratona di Lisbona è considerata una delle gare più belle del mondo, acclamata da Forbes Magazine, Huffington Post e American Express. La gara è 100% lungo il mare e il fiume, offrendo ai corridori viste uniche durante tutto il percorso.

Partendo da Estrada N6-7 a Carcavelos e terminando a Praça do Comércio, la EDP Maratona di Lisbona è una gara ufficiale del calendario World Athletics (IAAF) con il sigillo "World Athletics Elite Label", attirando atleti d'élite e migliaia di corridori da tutto il mondo.

Il percorso è rinomato per la sua bellezza panoramica e per essere relativamente pianeggiante e veloce, ideale sia per corridori esperti in cerca di record personali che per principianti che vogliono completare la loro prima maratona. Il limite di tempo è di 6 ore.`,
            city: "Lisbona",
            metaTitle: "EDP Maratona di Lisbona 2026 - Iscrizioni Aperte",
            metaDescription:
              "Una delle gare più belle del mondo! 42km lungo il mare e il fiume. World Athletics Elite Label. Iscriviti ora alla EDP Maratona di Lisbona 2026!",
          },
        ],
      },

      // Variants
      variants: {
        create: [
          {
            name: "EDP Maratona (42km)",
            distanceKm: 42,
            elevationGainM: 145,
            elevationLossM: 145,
            startDate: new Date("2026-10-10T08:00:00Z"),
            startTime: "08:00",
            maxParticipants: 15000,
            description:
              "Percurso completo de 42,195 km 100% junto ao mar e rio. Início em Carcavelos (Estrada N6-7) e chegada à Praça do Comércio. Limite de tempo: 6 horas. Cut-off aos 30km às 12:10h. World Athletics Elite Label.",
            translations: {
              create: [
                {
                  language: "pt",
                  name: "EDP Maratona (42km)",
                  description:
                    "Percurso completo de 42,195 km 100% junto ao mar e rio. Início em Carcavelos e chegada à Praça do Comércio. Limite de tempo: 6 horas.",
                },
                {
                  language: "en",
                  name: "EDP Marathon (42km)",
                  description:
                    "Complete 42.195 km route 100% by the sea and river. Start in Carcavelos and finish at Praça do Comércio. Time limit: 6 hours.",
                },
                {
                  language: "es",
                  name: "EDP Maratón (42km)",
                  description:
                    "Recorrido completo de 42,195 km 100% junto al mar y río. Salida en Carcavelos y llegada a Praça do Comércio. Límite de tiempo: 6 horas.",
                },
                {
                  language: "fr",
                  name: "EDP Marathon (42km)",
                  description:
                    "Parcours complet de 42,195 km 100% au bord de la mer et du fleuve. Départ à Carcavelos et arrivée à Praça do Comércio. Limite de temps : 6 heures.",
                },
                {
                  language: "de",
                  name: "EDP Marathon (42km)",
                  description:
                    "Vollständige 42,195 km Strecke 100% am Meer und Fluss. Start in Carcavelos und Ziel am Praça do Comércio. Zeitlimit: 6 Stunden.",
                },
                {
                  language: "it",
                  name: "EDP Maratona (42km)",
                  description:
                    "Percorso completo di 42,195 km 100% lungo il mare e il fiume. Partenza a Carcavelos e arrivo a Praça do Comércio. Limite di tempo: 6 ore.",
                },
              ],
            },
          },
          {
            name: "Hyundai Meia Maratona (21km)",
            distanceKm: 21,
            elevationGainM: 85,
            elevationLossM: 85,
            startDate: new Date("2026-10-11T09:20:00Z"),
            startTime: "09:20",
            maxParticipants: 10000,
            description:
              "Percurso de 21,097 km com início na Ponte Vasco da Gama e chegada à Praça do Comércio. Limite de tempo: 3 horas. World Athletics Elite Label.",
            translations: {
              create: [
                {
                  language: "pt",
                  name: "Hyundai Meia Maratona (21km)",
                  description:
                    "Percurso de 21,097 km com início na Ponte Vasco da Gama e chegada à Praça do Comércio. Limite de tempo: 3 horas.",
                },
                {
                  language: "en",
                  name: "Hyundai Half Marathon (21km)",
                  description:
                    "21.097 km route starting at Vasco da Gama Bridge and finishing at Praça do Comércio. Time limit: 3 hours.",
                },
                {
                  language: "es",
                  name: "Hyundai Medio Maratón (21km)",
                  description:
                    "Recorrido de 21,097 km con salida en el Puente Vasco da Gama y llegada a Praça do Comércio. Límite de tiempo: 3 horas.",
                },
                {
                  language: "fr",
                  name: "Hyundai Semi-Marathon (21km)",
                  description:
                    "Parcours de 21,097 km avec départ au Pont Vasco da Gama et arrivée à Praça do Comércio. Limite de temps : 3 heures.",
                },
                {
                  language: "de",
                  name: "Hyundai Halbmarathon (21km)",
                  description:
                    "21,097 km Strecke mit Start an der Vasco da Gama Brücke und Ziel am Praça do Comércio. Zeitlimit: 3 Stunden.",
                },
                {
                  language: "it",
                  name: "Hyundai Mezza Maratona (21km)",
                  description:
                    "Percorso di 21,097 km con partenza al Ponte Vasco da Gama e arrivo a Praça do Comércio. Limite di tempo: 3 ore.",
                },
              ],
            },
          },
          {
            name: "EDP 8K",
            distanceKm: 8,
            elevationGainM: 30,
            elevationLossM: 30,
            startDate: new Date("2026-10-11T09:20:00Z"),
            startTime: "09:20",
            maxParticipants: 5000,
            description:
              "Corrida não competitiva de 8km com início na Ponte Vasco da Gama e chegada no Parque das Nações. Percurso idêntico à Meia Maratona até ao km 7.",
            translations: {
              create: [
                {
                  language: "pt",
                  name: "EDP 8K",
                  description:
                    "Corrida não competitiva de 8km com início na Ponte Vasco da Gama e chegada no Parque das Nações.",
                },
                {
                  language: "en",
                  name: "EDP 8K",
                  description:
                    "Non-competitive 8km fun run starting at Vasco da Gama Bridge and finishing at Parque das Nações.",
                },
                {
                  language: "es",
                  name: "EDP 8K",
                  description:
                    "Carrera no competitiva de 8km con salida en el Puente Vasco da Gama y llegada en el Parque das Nações.",
                },
                {
                  language: "fr",
                  name: "EDP 8K",
                  description:
                    "Course non compétitive de 8km avec départ au Pont Vasco da Gama et arrivée au Parque das Nações.",
                },
                {
                  language: "de",
                  name: "EDP 8K",
                  description:
                    "Nicht-wettbewerbsfähiger 8km Lauf mit Start an der Vasco da Gama Brücke und Ziel im Parque das Nações.",
                },
                {
                  language: "it",
                  name: "EDP 8K",
                  description:
                    "Corsa non competitiva di 8km con partenza al Ponte Vasco da Gama e arrivo al Parque das Nações.",
                },
              ],
            },
          },
        ],
      },

      // Pricing Phases (Based on number of registrations)
      pricingPhases: {
        create: [
          {
            name: "1ª Fase - Primeiras 2.000 inscrições",
            startDate: new Date("2026-01-15T00:00:00Z"),
            endDate: new Date("2026-12-31T23:59:59Z"), // Until 2000 registrations
            price: 70.0,
            discountPercent: null,
            note: "Primeiras 2.000 inscrições (€70 + €4 taxa de transação)",
          },
          {
            name: "2ª Fase - 2.001 a 5.000 inscrições",
            startDate: new Date("2026-01-15T00:00:00Z"),
            endDate: new Date("2026-12-31T23:59:59Z"),
            price: 95.0,
            discountPercent: null,
            note: "Da 2.001ª à 5.000ª inscrição (€95 + €4 taxa de transação)",
          },
          {
            name: "3ª Fase - A partir da 5.001ª inscrição",
            startDate: new Date("2026-01-15T00:00:00Z"),
            endDate: new Date("2026-10-09T19:59:00Z"),
            price: 130.0,
            discountPercent: null,
            note: "A partir da 5.001ª inscrição (€130 + €4 taxa de transação)",
          },
        ],
      },
    },
  });

  console.log("✅ EDP Maratona de Lisboa 2026 created with ID:", event.id);
  console.log(
    "📝 Translations created for 6 languages (pt, en, es, fr, de, it)"
  );
  console.log(
    "🏃 3 variants created: Marathon (42km), Half Marathon (21km), 8K"
  );
  console.log("💰 3 pricing phases based on registration numbers");
  console.log("📅 Main event date: October 10, 2026");
  console.log(
    "🔗 Registration URL: https://rnr.inscricoes.maratonaportugal.com"
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
