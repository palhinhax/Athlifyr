/**
 * Seed EDP Maratona do Porto 2026
 * Complete with translations in all 6 languages
 * Official data from maratonadoporto.com
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding EDP Maratona do Porto 2026...");

  // Delete existing event if it exists
  const existingEvent = await prisma.event.findUnique({
    where: { slug: "edp-maratona-porto-2026" },
  });

  if (existingEvent) {
    console.log("🗑️  Deleting existing event...");
    await prisma.event.delete({
      where: { slug: "edp-maratona-porto-2026" },
    });
  }

  const event = await prisma.event.create({
    data: {
      title: "EDP Maratona do Porto 2026",
      slug: "edp-maratona-porto-2026",
      description: `A EDP Maratona do Porto é um dos eventos desportivos mais emblemáticos de Portugal, reunindo milhares de corredores no coração da cidade do Porto. Com partida junto ao SEALIFE Porto e chegada no Queimódromo (Parque da Cidade do Porto), este evento oferece uma experiência única que combina desporto, cultura e a beleza da cidade Invicta.

O evento realiza-se no dia 8 de novembro de 2026, com partida às 08:00 e limite máximo de 6 horas para completar a maratona. O percurso é reconhecido pela sua beleza cénica e traçado técnico, ideal tanto para corredores experientes que procuram recordes pessoais como para iniciantes.

Além da maratona completa de 42,195 km, o evento inclui a EDP 10K (10 km) e a Mimosa APO 6K (6 km), proporcionando opções para diferentes níveis de preparação física. Os participantes terão ao dispor pacemakers para diferentes marcas (3:00 a 4:45), abastecimentos a cada 5 km, assistência médica completa, e uma EXPO Maratona nos dias 6 e 7 de novembro no Centro de Congressos da Alfândega do Porto.`,
      sportTypes: ["RUNNING"],
      startDate: new Date("2026-11-08T08:00:00Z"),
      endDate: new Date("2026-11-08T14:00:00Z"),
      city: "Porto",
      country: "Portugal",
      latitude: 41.1579,
      longitude: -8.6291,
      googleMapsUrl: "https://maps.app.goo.gl/Porto",
      externalUrl: "https://www.maratonadoporto.com",
      imageUrl: "/events/maratona-porto.jpg",
      isFeatured: true,

      // Translations
      translations: {
        create: [
          // Portuguese (original)
          {
            language: "pt",
            title: "EDP Maratona do Porto 2026",
            description: `A EDP Maratona do Porto é um dos eventos desportivos mais emblemáticos de Portugal, reunindo milhares de corredores no coração da cidade do Porto. Com partida junto ao SEALIFE Porto e chegada no Queimódromo (Parque da Cidade do Porto), este evento oferece uma experiência única que combina desporto, cultura e a beleza da cidade Invicta.

O evento realiza-se no dia 8 de novembro de 2026, com partida às 08:00 e limite máximo de 6 horas para completar a maratona. O percurso é reconhecido pela sua beleza cénica e traçado técnico, ideal tanto para corredores experientes que procuram recordes pessoais como para iniciantes.

Além da maratona completa de 42,195 km, o evento inclui a EDP 10K (10 km) e a Mimosa APO 6K (6 km), proporcionando opções para diferentes níveis de preparação física. Os participantes terão ao dispor pacemakers para diferentes marcas (3:00 a 4:45), abastecimentos a cada 5 km, assistência médica completa, e uma EXPO Maratona nos dias 6 e 7 de novembro no Centro de Congressos da Alfândega do Porto.`,
            city: "Porto",
            metaTitle: "EDP Maratona do Porto 2026 - Inscrições Abertas",
            metaDescription:
              "Corre a maratona mais icónica do Norte! 42km pelo coração do Porto. Inscreve-te já na EDP Maratona do Porto 2026!",
          },
          // English
          {
            language: "en",
            title: "EDP Porto Marathon 2026",
            description: `The EDP Porto Marathon is one of Portugal's most iconic sporting events, bringing together thousands of runners in the heart of Porto city. Starting at SEALIFE Porto and finishing at Queimódromo (Porto City Park), this event offers a unique experience combining sport, culture, and the beauty of the Invicta city.

The event takes place on November 8, 2026, starting at 08:00 with a maximum time limit of 6 hours to complete the marathon. The course is renowned for its scenic beauty and technical layout, ideal for both experienced runners seeking personal records and beginners.

In addition to the full 42.195 km marathon, the event includes the EDP 10K (10 km) and Mimosa APO 6K (6 km), providing options for different fitness levels. Participants will have access to pacemakers for different target times (3:00 to 4:45), aid stations every 5 km, complete medical assistance, and a Marathon EXPO on November 6-7 at Centro de Congressos da Alfândega do Porto.`,
            city: "Porto",
            metaTitle: "EDP Porto Marathon 2026 - Registration Open",
            metaDescription:
              "Run the most iconic marathon of the North! 42km through the heart of Porto. Register now for the EDP Porto Marathon 2026!",
          },
          // Spanish
          {
            language: "es",
            title: "EDP Maratón de Oporto 2026",
            description: `El EDP Maratón de Oporto es uno de los eventos deportivos más emblemáticos de Portugal, reuniendo miles de corredores en el corazón de la ciudad de Oporto. Con salida junto al SEALIFE Porto y llegada en el Queimódromo (Parque de la Ciudad de Oporto), este evento ofrece una experiencia única que combina deporte, cultura y la belleza de la ciudad Invicta.

El evento se realiza el 8 de noviembre de 2026, con salida a las 08:00 y un límite máximo de 6 horas para completar el maratón. El recorrido es reconocido por su belleza escénica y trazado técnico, ideal tanto para corredores experimentados que buscan récords personales como para principiantes.

Además del maratón completo de 42.195 km, el evento incluye el EDP 10K (10 km) y el Mimosa APO 6K (6 km), proporcionando opciones para diferentes niveles de preparación física. Los participantes tendrán a su disposición pacemakers para diferentes marcas (3:00 a 4:45), avituallamientos cada 5 km, asistencia médica completa, y una EXPO Maratón los días 6 y 7 de noviembre en el Centro de Congressos da Alfândega do Porto.`,
            city: "Oporto",
            metaTitle: "EDP Maratón de Oporto 2026 - Inscripciones Abiertas",
            metaDescription:
              "¡Corre el maratón más icónico del Norte! 42km por el corazón de Oporto. ¡Inscríbete ya en el EDP Maratón de Oporto 2026!",
          },
          // French
          {
            language: "fr",
            title: "EDP Marathon de Porto 2026",
            description: `Le Marathon EDP de Porto est l'un des événements sportifs les plus emblématiques du Portugal, rassemblant des milliers de coureurs au cœur de la ville de Porto. Avec un départ près du SEALIFE Porto et une arrivée au Queimódromo (Parc de la Ville de Porto), cet événement offre une expérience unique combinant sport, culture et beauté de la ville Invicta.

L'événement a lieu le 8 novembre 2026, avec un départ à 08h00 et une limite maximale de 6 heures pour terminer le marathon. Le parcours est reconnu pour sa beauté scénique et son tracé technique, idéal aussi bien pour les coureurs expérimentés cherchant des records personnels que pour les débutants.

En plus du marathon complet de 42,195 km, l'événement comprend le EDP 10K (10 km) et le Mimosa APO 6K (6 km), offrant des options pour différents niveaux de préparation physique. Les participants auront accès à des pacemakers pour différents objectifs de temps (3:00 à 4:45), des ravitaillements tous les 5 km, une assistance médicale complète, et une EXPO Marathon les 6 et 7 novembre au Centro de Congressos da Alfândega do Porto.`,
            city: "Porto",
            metaTitle: "EDP Marathon de Porto 2026 - Inscriptions Ouvertes",
            metaDescription:
              "Courez le marathon le plus emblématique du Nord! 42km au cœur de Porto. Inscrivez-vous maintenant au Marathon EDP de Porto 2026!",
          },
          // German
          {
            language: "de",
            title: "EDP Marathon von Porto 2026",
            description: `Der EDP Marathon von Porto ist eine der bedeutendsten Sportveranstaltungen Portugals und vereint Tausende von Läufern im Herzen der Stadt Porto. Mit Start beim SEALIFE Porto und Ziel am Queimódromo (Stadtpark Porto) bietet diese Veranstaltung ein einzigartiges Erlebnis, das Sport, Kultur und die Schönheit der Invicta-Stadt verbindet.

Die Veranstaltung findet am 8. November 2026 statt, mit Start um 08:00 Uhr und einer maximalen Zeitbegrenzung von 6 Stunden für den Marathon. Die Strecke ist bekannt für ihre landschaftliche Schönheit und technische Beschaffenheit, ideal sowohl für erfahrene Läufer, die persönliche Rekorde anstreben, als auch für Anfänger.

Neben dem vollständigen 42,195 km Marathon umfasst die Veranstaltung den EDP 10K (10 km) und den Mimosa APO 6K (6 km), die Optionen für verschiedene Fitnessniveaus bieten. Die Teilnehmer haben Zugang zu Pacemakers für verschiedene Zielzeiten (3:00 bis 4:45), Verpflegungsstationen alle 5 km, vollständige medizinische Betreuung und eine Marathon EXPO am 6. und 7. November im Centro de Congressos da Alfândega do Porto.`,
            city: "Porto",
            metaTitle: "EDP Marathon von Porto 2026 - Anmeldung Offen",
            metaDescription:
              "Laufen Sie den legendärsten Marathon des Nordens! 42km durch das Herz von Porto. Jetzt für den EDP Marathon von Porto 2026 anmelden!",
          },
          // Italian
          {
            language: "it",
            title: "EDP Maratona di Porto 2026",
            description: `La Maratona EDP di Porto è uno degli eventi sportivi più emblematici del Portogallo, riunendo migliaia di corridori nel cuore della città di Porto. Con partenza presso il SEALIFE Porto e arrivo al Queimódromo (Parco della Città di Porto), questo evento offre un'esperienza unica che combina sport, cultura e la bellezza della città Invicta.

L'evento si svolge l'8 novembre 2026, con partenza alle 08:00 e un limite massimo di 6 ore per completare la maratona. Il percorso è riconosciuto per la sua bellezza scenica e tracciato tecnico, ideale sia per corridori esperti che cercano record personali che per principianti.

Oltre alla maratona completa di 42,195 km, l'evento include la EDP 10K (10 km) e la Mimosa APO 6K (6 km), offrendo opzioni per diversi livelli di preparazione fisica. I partecipanti avranno a disposizione pacemaker per diversi tempi obiettivo (3:00 a 4:45), ristori ogni 5 km, assistenza medica completa, e un'EXPO Maratona nei giorni 6 e 7 novembre presso il Centro de Congressos da Alfândega do Porto.`,
            city: "Porto",
            metaTitle: "EDP Maratona di Porto 2026 - Iscrizioni Aperte",
            metaDescription:
              "Corri la maratona più iconica del Nord! 42km nel cuore di Porto. Iscriviti ora alla EDP Maratona di Porto 2026!",
          },
        ],
      },

      // Event Variants
      variants: {
        create: [
          // Marathon 42K
          {
            name: "EDP Maratona 42K",
            distanceKm: 42,
            elevationGainM: 150,
            startDate: new Date("2026-11-08T08:00:00Z"),
            startTime: "08:00",
            cutoffTimeHours: 6.0,
            maxParticipants: 15000,
            description: `Percurso completo de 42,195 km pela cidade do Porto. Partida junto ao SEALIFE Porto, chegada no Queimódromo (Parque da Cidade do Porto).

**Idade Mínima**: Nascidos em 2006 ou anteriores

**Pacemakers**: 3:00, 3:15, 3:30, 3:45, 4:00, 4:15, 4:30, 4:45

**Abastecimentos**: Cada 5km com Água Vitalis, Powerade, e sólidos

**Classificações**: Seniores masculinos/femininos, veteranos M35-M60, veteranas F35-F60

**Grupos de Partida**:
- Elite
- Sub-Elite (Sub 3h00 homens / Sub 3h15 mulheres)
- Grupo A: Sub 3h15
- Grupo B: 3h15-3h45
- Grupo C: Mais de 3h45`,

            translations: {
              create: [
                {
                  language: "pt",
                  name: "EDP Maratona 42K",
                  description:
                    "Maratona completa de 42.195 km pela cidade do Porto, com limite de 6 horas e pacemakers disponíveis.",
                },
                {
                  language: "en",
                  name: "EDP Marathon 42K",
                  description:
                    "Full 42.195 km marathon through Porto city, with 6-hour time limit and pacemakers available.",
                },
                {
                  language: "es",
                  name: "EDP Maratón 42K",
                  description:
                    "Maratón completo de 42.195 km por la ciudad de Oporto, con límite de 6 horas y pacemakers disponibles.",
                },
                {
                  language: "fr",
                  name: "EDP Marathon 42K",
                  description:
                    "Marathon complet de 42,195 km à travers Porto, avec limite de 6 heures et pacemakers disponibles.",
                },
                {
                  language: "de",
                  name: "EDP Marathon 42K",
                  description:
                    "Vollständiger 42,195 km Marathon durch Porto, mit 6-Stunden-Limit und Pacemakers.",
                },
                {
                  language: "it",
                  name: "EDP Maratona 42K",
                  description:
                    "Maratona completa di 42,195 km attraverso Porto, con limite di 6 ore e pacemaker disponibili.",
                },
              ],
            },

            // Pricing Phases for Marathon
            pricingPhases: {
              create: [
                {
                  name: "Promoção de Natal",
                  price: 42.5,
                  startDate: new Date("2025-12-01"),
                  endDate: new Date("2025-12-31"),
                  note: "Promoção especial de Natal - não acumulável com outras promoções. Custos administrativos adicionais.",
                },
                {
                  name: "1º Preço",
                  price: 65.0,
                  startDate: new Date("2026-01-01"),
                  endDate: new Date("2026-03-31"),
                  note: "Primeiro preço - inscrições limitadas. Custos administrativos adicionais.",
                },
                {
                  name: "2º Preço",
                  price: 70.0,
                  startDate: new Date("2026-04-01"),
                  endDate: new Date("2026-08-31"),
                  note: "Segundo preço - inscrições limitadas. Custos administrativos adicionais.",
                },
                {
                  name: "3º Preço",
                  price: 80.0,
                  startDate: new Date("2026-09-01"),
                  endDate: new Date("2026-10-30"),
                  note: "Terceiro preço - inscrições limitadas. Custos administrativos adicionais.",
                },
                {
                  name: "Última Hora",
                  price: 100.0,
                  startDate: new Date("2026-11-06"),
                  endDate: new Date("2026-11-07"),
                  note: "Inscrição na EXPO Maratona (6-7 novembro, 10h-19h). Custos administrativos adicionais.",
                },
              ],
            },
          },

          // EDP 10K
          {
            name: "EDP 10K",
            distanceKm: 10,
            elevationGainM: 50,
            startDate: new Date("2026-11-08T08:00:00Z"),
            startTime: "08:00",
            cutoffTimeHours: 2.0,
            maxParticipants: 5000,
            description: `Corrida de 10 km pela cidade do Porto, ideal para todos os níveis.

**Idade Mínima**: Nascidos em 2008 ou anteriores

**Abastecimentos**: Pontos estratégicos ao longo do percurso

**Classificações**: Individuais masculinos e femininos

**Grupos de Partida**:
- Elite
- Sub-Elite (Sub 40min homens / Sub 45min mulheres)
- Grupo A: Sub 50min
- Grupo B: 50-60min
- Grupo C: Mais de 60min`,

            translations: {
              create: [
                {
                  language: "pt",
                  name: "EDP 10K",
                  description:
                    "Corrida de 10 km pela cidade do Porto, ideal para todos os níveis.",
                },
                {
                  language: "en",
                  name: "EDP 10K",
                  description:
                    "10 km race through Porto city, suitable for all levels.",
                },
                {
                  language: "es",
                  name: "EDP 10K",
                  description:
                    "Carrera de 10 km por Oporto, ideal para todos los niveles.",
                },
                {
                  language: "fr",
                  name: "EDP 10K",
                  description:
                    "Course de 10 km à travers Porto, pour tous les niveaux.",
                },
                {
                  language: "de",
                  name: "EDP 10K",
                  description:
                    "10 km Lauf durch Porto, für alle Levels geeignet.",
                },
                {
                  language: "it",
                  name: "EDP 10K",
                  description:
                    "Corsa di 10 km attraverso Porto, per tutti i livelli.",
                },
              ],
            },

            // Pricing Phases for 10K
            pricingPhases: {
              create: [
                {
                  name: "1º Preço",
                  price: 18.0,
                  startDate: new Date("2026-01-01"),
                  endDate: new Date("2026-08-31"),
                  note: "Primeiro preço - inscrições limitadas. Custos administrativos adicionais.",
                },
                {
                  name: "2º Preço",
                  price: 20.0,
                  startDate: new Date("2026-09-01"),
                  endDate: new Date("2026-10-30"),
                  note: "Segundo preço - inscrições limitadas. Custos administrativos adicionais.",
                },
                {
                  name: "Última Hora",
                  price: 25.0,
                  startDate: new Date("2026-11-06"),
                  endDate: new Date("2026-11-07"),
                  note: "Inscrição na EXPO Maratona (6-7 novembro). Custos administrativos adicionais.",
                },
              ],
            },
          },

          // Mimosa APO 6K
          {
            name: "Mimosa APO 6K",
            distanceKm: 6,
            elevationGainM: 30,
            startDate: new Date("2026-11-08T08:00:00Z"),
            startTime: "08:00",
            cutoffTimeHours: 2.0,
            maxParticipants: 3000,
            description: `Mini Maratona / Caminhada de 6 km para todas as idades.

**Característica**: Corrida/caminhada de puro convívio, sem classificações competitivas

**Idade**: Todas as classes etárias

**Público-Alvo**: Ideal para famílias e iniciantes

**Abastecimentos**: Pontos ao longo do percurso e na meta`,

            translations: {
              create: [
                {
                  language: "pt",
                  name: "Mimosa APO 6K",
                  description:
                    "Mini maratona / Caminhada de 6 km para todas as idades, sem fins competitivos.",
                },
                {
                  language: "en",
                  name: "Mimosa APO 6K",
                  description:
                    "6 km mini marathon / Walk for all ages, non-competitive.",
                },
                {
                  language: "es",
                  name: "Mimosa APO 6K",
                  description:
                    "Mini maratón / Caminata de 6 km para todas las edades, sin fines competitivos.",
                },
                {
                  language: "fr",
                  name: "Mimosa APO 6K",
                  description:
                    "Mini marathon / Marche de 6 km pour tous les âges, non compétitif.",
                },
                {
                  language: "de",
                  name: "Mimosa APO 6K",
                  description:
                    "6 km Mini-Marathon / Spaziergang für alle Altersgruppen, nicht wettbewerbsorientiert.",
                },
                {
                  language: "it",
                  name: "Mimosa APO 6K",
                  description:
                    "Mini maratona / Camminata di 6 km per tutte le età, non competitiva.",
                },
              ],
            },

            // Pricing Phases for 6K
            pricingPhases: {
              create: [
                {
                  name: "1º Preço",
                  price: 10.0,
                  startDate: new Date("2026-01-01"),
                  endDate: new Date("2026-08-31"),
                  note: "Primeiro preço - inscrições limitadas. Custos administrativos adicionais.",
                },
                {
                  name: "2º Preço",
                  price: 13.0,
                  startDate: new Date("2026-09-01"),
                  endDate: new Date("2026-10-30"),
                  note: "Segundo preço - inscrições limitadas. Custos administrativos adicionais.",
                },
                {
                  name: "Última Hora",
                  price: 15.0,
                  startDate: new Date("2026-11-06"),
                  endDate: new Date("2026-11-07"),
                  note: "Inscrição na EXPO Maratona (6-7 novembro). Custos administrativos adicionais.",
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`✅ EDP Maratona do Porto 2026 created with ID: ${event.id}`);
  console.log(
    "📝 Translations created for 6 languages (pt, en, es, fr, de, it)"
  );
  console.log("🏃 3 variants created: Marathon (42K), 10K, 6K");
  console.log("💰 Multiple pricing phases for each variant");
  console.log("📅 Main event date: November 8, 2026");
  console.log("📍 Location: SEALIFE Porto → Queimódromo");
  console.log("🔗 Registration: https://www.maratonadoporto.com");
  console.log("");
  console.log("ℹ️  Additional info from official website:");
  console.log(
    "   - EXPO Maratona: 6-7 nov, 10h-19h, Centro Congressos Alfândega"
  );
  console.log("   - Pasta Party: 7 nov, 12h-16h (€6 atletas / €9 público)");
  console.log(
    "   - Pacemakers: 3:00, 3:15, 3:30, 3:45, 4:00, 4:15, 4:30, 4:45"
  );
  console.log("   - VIP Option available: €250 (with multiple benefits)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
