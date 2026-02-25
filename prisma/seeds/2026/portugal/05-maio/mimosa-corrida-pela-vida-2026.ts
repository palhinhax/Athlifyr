/**
 * Seed Mimosa Corrida Pela Vida 2026
 * Corrida não competitiva de 5 km em Lisboa, a favor da Liga Portuguesa Contra o Cancro
 * Official data from maratonaclubedeportugal.com
 */

import { PrismaClient, Currency, Language } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🎗️  Seeding Mimosa Corrida Pela Vida 2026...");

  // ============================================================================
  // Step 1: Upsert Event
  // ============================================================================
  const existingEvent = await prisma.event.findUnique({
    where: { slug: "mimosa-corrida-pela-vida-2026" },
  });

  if (existingEvent) {
    console.log("🗑️  Deleting existing event...");
    await prisma.event.delete({
      where: { slug: "mimosa-corrida-pela-vida-2026" },
    });
  }

  const event = await prisma.event.create({
    data: {
      title: "Mimosa Corrida Pela Vida 2026",
      slug: "mimosa-corrida-pela-vida-2026",
      description: `A Mimosa Corrida Pela Vida é um evento de atletismo não competitivo organizado pelo Maratona Clube de Portugal, com o apoio da Câmara Municipal de Lisboa e outros organismos oficiais. Realiza-se a 17 de maio de 2026, em Lisboa, com partida em Santos (junto ao restaurante "Kais") e chegada na Torre de Belém.

O percurso de 5 km é totalmente urbano, em asfalto, ao longo da margem do Tejo, passando pela Av. Brasília até à Torre de Belém. O evento conta com apoio médico da Femédica e do Hospital da Luz, abastecimentos com água Vitalis e entrega de medalha de finisher a todos os participantes.

Cada participante contribui diretamente para a compra de equipamentos de rastreio do cancro da mama, com todas as receitas a reverter para a Liga Portuguesa Contra o Cancro.

O levantamento do kit de participação (dorsal + t-shirt oficial + brindes dos patrocinadores) realiza-se na Sport Expo, no Centro de Congressos de Lisboa (Junqueira), no dia 16 de maio, das 10h às 20h. Não serão entregues dorsais no dia da prova.`,
      sportTypes: ["RUNNING"],
      startDate: new Date("2026-05-17T09:30:00Z"),
      endDate: new Date("2026-05-17T11:30:00Z"),
      city: "Lisboa",
      country: "Portugal",
      latitude: 38.6969,
      longitude: -9.2063,
      googleMapsUrl: "https://maps.app.goo.gl/SantosLisboa",
      externalUrl: "https://www.maratonaclubedeportugal.com",
      imageUrl: "",
      isFeatured: false,
    },
  });

  console.log(`✅ Event created with ID: ${event.id}`);

  // ============================================================================
  // Step 2: Event Translations (all 6 languages)
  // ============================================================================
  console.log("🌍 Creating event translations...");

  const translations: Record<
    string,
    {
      title: string;
      description: string;
      city: string;
      metaTitle: string;
      metaDescription: string;
    }
  > = {
    pt: {
      title: "Mimosa Corrida Pela Vida 2026",
      description: `A Mimosa Corrida Pela Vida é um evento de atletismo não competitivo organizado pelo Maratona Clube de Portugal, com o apoio da Câmara Municipal de Lisboa e outros organismos oficiais. Realiza-se a 17 de maio de 2026, em Lisboa, com partida em Santos (junto ao restaurante "Kais") e chegada na Torre de Belém.

O percurso de 5 km é totalmente urbano, em asfalto, ao longo da margem do Tejo, passando pela Av. Brasília até à Torre de Belém. O evento conta com apoio médico da Femédica e do Hospital da Luz, abastecimentos com água Vitalis e entrega de medalha de finisher a todos os participantes.

Cada participante contribui diretamente para a compra de equipamentos de rastreio do cancro da mama, com todas as receitas a reverter para a Liga Portuguesa Contra o Cancro.

O levantamento do kit de participação (dorsal + t-shirt oficial + brindes dos patrocinadores) realiza-se na Sport Expo, no Centro de Congressos de Lisboa (Junqueira), no dia 16 de maio, das 10h às 20h. Não serão entregues dorsais no dia da prova.`,
      city: "Lisboa",
      metaTitle: "Mimosa Corrida Pela Vida 2026 | 5 km Lisboa | 17 Maio",
      metaDescription:
        "Corre 5 km em Lisboa a favor da Liga Portuguesa Contra o Cancro. Santos → Torre de Belém. Levantamento de kit: 16 maio, Sport Expo Lisboa. Inscreve-te já!",
    },
    en: {
      title: "Mimosa Run For Life 2026",
      description: `The Mimosa Corrida Pela Vida (Run For Life) is a non-competitive athletics event organized by Maratona Clube de Portugal, supported by Lisbon City Council and other official bodies. It takes place on May 17, 2026 in Lisbon, starting at Santos (near the "Kais" restaurant) and finishing at the Belém Tower.

The 5 km route is fully urban, on asphalt, running along the Tagus riverfront along Av. Brasília towards the Belém Tower. Medical support is provided by Femédica and Hospital da Luz, with Vitalis water at refreshment points and a finisher medal awarded to all participants.

Every participant directly contributes to the purchase of breast cancer screening equipment, with all revenues going to the Portuguese League Against Cancer.

Participation kits (bib number + official race t-shirt + sponsor gifts) can be collected at Sport Expo, Centro de Congressos de Lisboa (Junqueira), on May 16 from 10 am to 8 pm. No bibs will be handed out on race day.`,
      city: "Lisbon",
      metaTitle: "Mimosa Run For Life 2026 | 5 km Lisbon | 17 May",
      metaDescription:
        "Run 5 km in Lisbon to support breast cancer research. Santos → Belém Tower. Kit collection: May 16, Sport Expo Lisbon. Register now!",
    },
    es: {
      title: "Mimosa Carrera Por la Vida 2026",
      description: `La Mimosa Corrida Pela Vida (Carrera Por la Vida) es un evento de atletismo no competitivo organizado por el Maratona Clube de Portugal, con el apoyo del Ayuntamiento de Lisboa y otros organismos oficiales. Se celebra el 17 de mayo de 2026 en Lisboa, con salida en Santos (junto al restaurante "Kais") y llegada en la Torre de Belém.

El recorrido de 5 km es totalmente urbano, en asfalto, a lo largo del margen del Tajo por la Av. Brasília hasta la Torre de Belém. El evento cuenta con apoyo médico de Femédica y del Hospital da Luz, avituallamientos con agua Vitalis y entrega de medalla de finisher a todos los participantes.

Cada participante contribuye directamente a la compra de equipos de cribado de cáncer de mama, con todos los ingresos destinados a la Liga Portuguesa Contra el Cáncer.

La recogida del kit de participación (dorsal + camiseta oficial + regalos de los patrocinadores) se realiza en Sport Expo, en el Centro de Congresos de Lisboa (Junqueira), el 16 de mayo, de 10:00 a 20:00 h. No se entregarán dorsales el día de la carrera.`,
      city: "Lisboa",
      metaTitle: "Mimosa Carrera Por la Vida 2026 | 5 km Lisboa | 17 Mayo",
      metaDescription:
        "Corre 5 km en Lisboa a favor de la Liga Portuguesa Contra el Cáncer. Santos → Torre de Belém. Recogida de kit: 16 mayo, Sport Expo Lisboa. ¡Inscríbete ya!",
    },
    fr: {
      title: "Mimosa Course Pour la Vie 2026",
      description: `La Mimosa Corrida Pela Vida (Course Pour la Vie) est un événement d'athlétisme non compétitif organisé par le Maratona Clube de Portugal, avec le soutien de la Mairie de Lisbonne et d'autres organismes officiels. Il se déroule le 17 mai 2026 à Lisbonne, avec un départ à Santos (près du restaurant "Kais") et une arrivée à la Tour de Belém.

Le parcours de 5 km est entièrement urbain, sur asphalte, longeant les rives du Tage par l'Av. Brasília jusqu'à la Tour de Belém. L'événement bénéficie du soutien médical de Femédica et de l'Hospital da Luz, avec des ravitaillements en eau Vitalis et une médaille de finisher remise à tous les participants.

Chaque participant contribue directement à l'achat d'équipements de dépistage du cancer du sein, avec tous les revenus reversés à la Ligue Portugaise Contre le Cancer.

Les kits de participation (dossard + t-shirt officiel + cadeaux des sponsors) sont à retirer au Sport Expo, au Centro de Congressos de Lisboa (Junqueira), le 16 mai de 10h à 20h. Aucun dossard ne sera distribué le jour de la course.`,
      city: "Lisbonne",
      metaTitle: "Mimosa Course Pour la Vie 2026 | 5 km Lisbonne | 17 Mai",
      metaDescription:
        "Courez 5 km à Lisbonne pour soutenir la Ligue Portugaise Contre le Cancer. Santos → Tour de Belém. Retrait du kit: 16 mai, Sport Expo Lisbonne. Inscrivez-vous!",
    },
    de: {
      title: "Mimosa Lauf Fürs Leben 2026",
      description: `Der Mimosa Corrida Pela Vida (Lauf Fürs Leben) ist ein nicht wettbewerbsorientiertes Leichtathletik-Event, das vom Maratona Clube de Portugal organisiert und von der Stadtgemeinde Lissabon und anderen offiziellen Stellen unterstützt wird. Er findet am 17. Mai 2026 in Lissabon statt, mit Start in Santos (neben dem Restaurant "Kais") und Ziel am Turm von Belém.

Die 5 km lange Strecke ist vollständig urban, auf Asphalt, entlang des Tejo-Ufers über die Av. Brasília bis zum Turm von Belém. Die Veranstaltung wird medizinisch von Femédica und dem Hospital da Luz betreut, mit Vitalis-Wasser an Verpflegungsstationen und einer Finisher-Medaille für alle Teilnehmer.

Jeder Teilnehmer trägt direkt zur Anschaffung von Geräten zur Brustkrebsvorsorge bei, wobei alle Einnahmen an die Portugiesische Liga gegen Krebs gehen.

Die Teilnahme-Kits (Startnummer + offizielles Renn-T-Shirt + Sponsor-Geschenke) können auf der Sport Expo im Centro de Congressos de Lisboa (Junqueira) am 16. Mai von 10 bis 20 Uhr abgeholt werden. Am Renntag werden keine Startnummern ausgegeben.`,
      city: "Lissabon",
      metaTitle: "Mimosa Lauf Fürs Leben 2026 | 5 km Lissabon | 17. Mai",
      metaDescription:
        "Laufen Sie 5 km in Lissabon für die Portugiesische Liga gegen Krebs. Santos → Turm von Belém. Kit-Abholung: 16. Mai, Sport Expo Lissabon. Jetzt anmelden!",
    },
    it: {
      title: "Mimosa Corsa Per la Vita 2026",
      description: `La Mimosa Corrida Pela Vida (Corsa Per la Vita) è un evento di atletica non competitivo organizzato dal Maratona Clube de Portugal, con il supporto della Municipalità di Lisbona e di altri enti ufficiali. Si svolge il 17 maggio 2026 a Lisbona, con partenza a Santos (vicino al ristorante "Kais") e arrivo alla Torre di Belém.

Il percorso di 5 km è interamente urbano, su asfalto, lungo le rive del Tago lungo la Av. Brasília fino alla Torre di Belém. L'evento si avvale del supporto medico di Femédica e dell'Hospital da Luz, con ristori di acqua Vitalis e una medaglia finisher consegnata a tutti i partecipanti.

Ogni partecipante contribuisce direttamente all'acquisto di attrezzature per lo screening del cancro al seno, con tutti i proventi destinati alla Liga Portuguesa Contra o Cancro (Lega Portoghese Contro il Cancro).

I kit di partecipazione (pettorale + t-shirt ufficiale + gadget degli sponsor) vengono ritirati all'Sport Expo, al Centro de Congressos de Lisboa (Junqueira), il 16 maggio dalle 10:00 alle 20:00. Nessun pettorale sarà distribuito il giorno della gara.`,
      city: "Lisbona",
      metaTitle: "Mimosa Corsa Per la Vita 2026 | 5 km Lisbona | 17 Maggio",
      metaDescription:
        "Corri 5 km a Lisbona per la Liga Portuguesa Contra o Cancro. Santos → Torre di Belém. Ritiro kit: 16 maggio, Sport Expo Lisbona. Iscriviti ora!",
    },
  };

  for (const [lang, trans] of Object.entries(translations)) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: { eventId: event.id, language: lang as Language },
      },
      update: {
        title: trans.title,
        description: trans.description,
        city: trans.city,
        metaTitle: trans.metaTitle,
        metaDescription: trans.metaDescription,
      },
      create: {
        eventId: event.id,
        language: lang as Language,
        title: trans.title,
        description: trans.description,
        city: trans.city,
        metaTitle: trans.metaTitle,
        metaDescription: trans.metaDescription,
      },
    });
    console.log(`   ✅ Translation created: ${lang}`);
  }

  // ============================================================================
  // Step 3: Variants with translations and pricing phases
  // ============================================================================
  const variants = [
    {
      name: "Mimosa Corrida Pela Vida 5K",
      distanceKm: 5,
      elevationGainM: 20,
      startDate: new Date("2026-05-17T09:30:00Z"),
      startTime: "09:30",
      cutoffTimeHours: 2.0,
      maxParticipants: 14000,
      description: `Corrida/caminhada não competitiva de 5 km pela margem do Tejo em Lisboa.

**Percurso**: Santos (Kais) → Av. Cintura do Porto de Lisboa → viaduto Av. Infante Santo → Av. Brasília → Restaurante Vela Latina → Torre de Belém

**Características**:
- Evento não competitivo sem classificações
- Todas as idades bem-vindas
- Chip de cronometragem disponível mediante pedido (contactar info@maratonaportugal.com)
- Transporte público gratuito com apresentação do dorsal (a partir das 07:00)
- Shuttles gratuitos da meta para a partida das 07:00 às 09:00

**Apoio**:
- Abastecimentos: Água Vitalis ao longo do percurso
- Apoio médico: Femédica + Hospital da Luz
- Medalha de finisher na meta`,
      translations: {
        pt: {
          name: "Mimosa Corrida Pela Vida 5K",
          description:
            "Corrida/caminhada não competitiva de 5 km de Santos até à Torre de Belém, a favor da Liga Portuguesa Contra o Cancro. Aberta a todas as idades.",
        },
        en: {
          name: "Mimosa Run For Life 5K",
          description:
            "Non-competitive 5 km run/walk from Santos to the Belém Tower, supporting the Portuguese League Against Cancer. Open to all ages.",
        },
        es: {
          name: "Mimosa Carrera Por la Vida 5K",
          description:
            "Carrera/caminata no competitiva de 5 km desde Santos hasta la Torre de Belém, en favor de la Liga Portuguesa Contra el Cáncer. Abierta a todas las edades.",
        },
        fr: {
          name: "Mimosa Course Pour la Vie 5K",
          description:
            "Course/marche non compétitive de 5 km de Santos jusqu'à la Tour de Belém, au profit de la Ligue Portugaise Contre le Cancer. Ouverte à tous les âges.",
        },
        de: {
          name: "Mimosa Lauf Fürs Leben 5K",
          description:
            "Nicht wettbewerbsorientierter 5 km Lauf/Spaziergang von Santos bis zum Turm von Belém, zugunsten der Portugiesischen Liga gegen Krebs. Für alle Altersgruppen.",
        },
        it: {
          name: "Mimosa Corsa Per la Vita 5K",
          description:
            "Corsa/camminata non competitiva di 5 km da Santos alla Torre di Belém, a favore della Liga Portuguesa Contra o Cancro. Aperta a tutte le età.",
        },
      },
      pricingPhases: [
        {
          name: "Inscrição",
          startDate: new Date("2026-02-01T00:00:00Z"),
          endDate: new Date("2026-05-16T19:59:59Z"),
          price: 15,
          currency: Currency.EUR,
          note: "Inscrições encerram a 16 de maio às 19:59 ou quando atingir o limite de 14.000 participantes.",
        },
      ],
    },
  ];

  // ============================================================================
  // Step 4: Delete existing pricing phases and create variants
  // ============================================================================
  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

  console.log("💰 Creating variants and pricing phases...");

  for (const variantData of variants) {
    const {
      pricingPhases,
      translations: variantTranslations,
      ...variantInfo
    } = variantData;

    const variant = await prisma.eventVariant.create({
      data: {
        ...variantInfo,
        eventId: event.id,
      },
    });

    console.log(`   ✅ Created variant: ${variant.name}`);

    // Create variant translations
    for (const [lang, trans] of Object.entries(variantTranslations)) {
      await prisma.eventVariantTranslation.upsert({
        where: {
          variantId_language: {
            variantId: variant.id,
            language: lang as Language,
          },
        },
        update: {
          name: trans.name,
          description: trans.description,
        },
        create: {
          variantId: variant.id,
          language: lang as Language,
          name: trans.name,
          description: trans.description,
        },
      });
    }

    // Create pricing phases linked to eventId (NOT variantId)
    for (const phase of pricingPhases) {
      await prisma.pricingPhase.create({
        data: {
          eventId: event.id, // ✅ CORRECT: linked to eventId
          name: `${variant.name} - ${phase.name}`,
          startDate: phase.startDate,
          endDate: phase.endDate,
          price: phase.price,
          currency: phase.currency,
          note: phase.note,
        },
      });
    }

    console.log(`   - Created ${pricingPhases.length} pricing phase(s)`);
  }

  // ============================================================================
  // Step 5: FAQs with translations
  // ============================================================================
  console.log("❓ Creating FAQs...");

  const faqs = [
    {
      order: 1,
      translations: {
        pt: {
          question: "O que é a Corrida MIMOSA – Pela Vida?",
          answer:
            "A Corrida MIMOSA – Pela Vida é um evento de atletismo não competitivo que se realiza a 17 de maio, organizado pelo Maratona Clube de Portugal e com o apoio da Câmara Municipal de Lisboa e outros organismos oficiais.",
        },
        en: {
          question: "What is the MIMOSA Race – For Life?",
          answer:
            "The MIMOSA Corrida – Pela Vida is a non-competitive athletics event taking place on May 17, organized by the Maratona Clube de Portugal and supported by Lisbon City Council and other official bodies.",
        },
        es: {
          question: "¿Qué es la Carrera MIMOSA – Por la Vida?",
          answer:
            "La Carrera MIMOSA – Pela Vida es un evento de atletismo no competitivo que tiene lugar el 17 de mayo, organizado por el Maratona Clube de Portugal y con el apoyo del Ayuntamiento de Lisboa y otros organismos oficiales.",
        },
        fr: {
          question: "Qu'est-ce que la Course MIMOSA – Pour la Vie?",
          answer:
            "La Course MIMOSA – Pela Vida est un événement d'athlétisme non compétitif qui se déroule le 17 mai, organisé par le Maratona Clube de Portugal et soutenu par la Mairie de Lisbonne et d'autres organismes officiels.",
        },
        de: {
          question: "Was ist der MIMOSA-Lauf – Fürs Leben?",
          answer:
            "Der MIMOSA Corrida – Pela Vida ist ein nicht wettbewerbsorientiertes Leichtathletik-Event am 17. Mai, organisiert vom Maratona Clube de Portugal mit Unterstützung der Stadtgemeinde Lissabon und anderer offizieller Stellen.",
        },
        it: {
          question: "Cos'è la Corsa MIMOSA – Per la Vita?",
          answer:
            "La Mimosa Corrida – Pela Vida è un evento di atletica non competitivo che si svolge il 17 maggio, organizzato dal Maratona Clube de Portugal e supportato dalla Municipalità di Lisbona e da altri enti ufficiali.",
        },
      },
    },
    {
      order: 2,
      translations: {
        pt: {
          question: "Qual é o percurso?",
          answer:
            'A partida é em Santos (nas traseiras do restaurante "Kais"), seguindo em direção a Belém pela Rua Cintura do Porto de Lisboa, passando por baixo do viaduto da Av. Infante Santo. Continua pela Av. Brasília até ao Restaurante Vela Latina e daqui no sentido normal do trânsito até à Torre de Belém, onde se encontra a linha de chegada.',
        },
        en: {
          question: "What is the route?",
          answer:
            'The start is in Santos (at the back of the "Kais" restaurant), heading towards Belém along Rua Cintura do Porto de Lisboa, passing under the viaduct on Av. Infante Santo. Continuing along Av. Brasília to the "Vela Latina" Restaurant and from there in the normal direction of traffic to the Belém Tower, where the finish line is located.',
        },
        es: {
          question: "¿Cuál es el recorrido?",
          answer:
            'La salida es en Santos (detrás del restaurante "Kais"), en dirección a Belém por la Rua Cintura do Porto de Lisboa, pasando por debajo del viaducto de la Av. Infante Santo. Continúa por la Av. Brasília hasta el Restaurante "Vela Latina" y desde aquí en el sentido normal del tráfico hasta la Torre de Belém, donde se encuentra la línea de llegada.',
        },
        fr: {
          question: "Quel est le parcours?",
          answer:
            "Le départ est à Santos (derrière le restaurant \"Kais\"), en direction de Belém par la Rua Cintura do Porto de Lisboa, en passant sous le viaduc de l'Av. Infante Santo. On continue par l'Av. Brasília jusqu'au Restaurant \"Vela Latina\" et de là dans le sens normal de la circulation jusqu'à la Tour de Belém, où se trouve la ligne d'arrivée.",
        },
        de: {
          question: "Was ist die Strecke?",
          answer:
            'Start in Santos (hinter dem Restaurant "Kais"), Richtung Belém entlang der Rua Cintura do Porto de Lisboa, unter dem Viadukt der Av. Infante Santo. Weiter die Av. Brasília entlang bis zum Restaurant "Vela Latina" und von dort in normaler Fahrtrichtung bis zum Turm von Belém, wo sich das Ziel befindet.',
        },
        it: {
          question: "Qual è il percorso?",
          answer:
            'La partenza è a Santos (sul retro del ristorante "Kais"), in direzione Belém lungo la Rua Cintura do Porto de Lisboa, passando sotto il viadotto dell\'Av. Infante Santo. Si continua lungo l\'Av. Brasília fino al Ristorante "Vela Latina" e da lì nel senso normale del traffico fino alla Torre di Belém, dove si trova il traguardo.',
        },
      },
    },
    {
      order: 3,
      translations: {
        pt: {
          question: "Que distância tem a prova?",
          answer:
            "A prova percorre uma distância de 5 km, totalmente urbana, em asfalto.",
        },
        en: {
          question: "How far is the race?",
          answer:
            "The race covers a distance of 5 km, entirely urban, on asphalt.",
        },
        es: {
          question: "¿Cuánta distancia tiene la carrera?",
          answer:
            "La carrera recorre una distancia de 5 km, totalmente urbana, en asfalto.",
        },
        fr: {
          question: "Quelle est la distance de la course?",
          answer:
            "La course couvre une distance de 5 km, entièrement urbaine, sur asphalte.",
        },
        de: {
          question: "Wie lang ist die Strecke?",
          answer: "Die Strecke beträgt 5 km, vollständig urban, auf Asphalt.",
        },
        it: {
          question: "Quanto è lunga la gara?",
          answer:
            "La gara copre una distanza di 5 km, interamente urbana, su asfalto.",
        },
      },
    },
    {
      order: 4,
      translations: {
        pt: {
          question: "A que horas começa a prova?",
          answer: "A prova começa às 9h30.",
        },
        en: {
          question: "What time does the race start?",
          answer: "The race starts at 9:30 a.m.",
        },
        es: {
          question: "¿A qué hora empieza la carrera?",
          answer: "La carrera empieza a las 9:30 h.",
        },
        fr: {
          question: "À quelle heure commence la course?",
          answer: "La course commence à 9h30.",
        },
        de: {
          question: "Um wie viel Uhr beginnt das Rennen?",
          answer: "Das Rennen beginnt um 9:30 Uhr.",
        },
        it: {
          question: "A che ora inizia la gara?",
          answer: "La gara inizia alle 9:30.",
        },
      },
    },
    {
      order: 5,
      translations: {
        pt: {
          question: "Quando abre e fecha as inscrições?",
          answer:
            "As inscrições abrem e fecham a 16 de maio às 19h59, salvo se atingirem o limite máximo antes desta hora.",
        },
        en: {
          question: "When does registration open and close?",
          answer:
            "Entries open and close on May 16 at 7:59 p.m., unless they reach the maximum limit before this time.",
        },
        es: {
          question: "¿Cuándo abren y cierran las inscripciones?",
          answer:
            "Las inscripciones abren y cierran el 16 de mayo a las 19:59, a menos que alcancen el límite máximo antes de ese momento.",
        },
        fr: {
          question: "Quand les inscriptions ouvrent-elles et ferment-elles?",
          answer:
            "Les inscriptions ouvrent et ferment le 16 mai à 19h59, sauf si elles atteignent la limite maximale avant cette heure.",
        },
        de: {
          question: "Wann öffnen und schließen die Anmeldungen?",
          answer:
            "Die Anmeldungen öffnen und schließen am 16. Mai um 19:59 Uhr, sofern das Maximum nicht vorher erreicht wird.",
        },
        it: {
          question: "Quando aprono e chiudono le iscrizioni?",
          answer:
            "Le iscrizioni aprono e chiudono il 16 maggio alle 19:59, a meno che non raggiungano il limite massimo prima di tale orario.",
        },
      },
    },
    {
      order: 6,
      translations: {
        pt: {
          question: "Como levantar o kit de participação?",
          answer:
            "Após a inscrição e até uma semana antes da prova, receberás um recibo no email para levantamento da inscrição. Com este recibo, deves dirigir-te à feira Sport Expo no CCL (Centro de Congressos de Lisboa, Junqueira) no dia 16 de maio (entre as 10h e as 20h) e levantar o dorsal e o kit de participação, que inclui a t-shirt oficial da prova e outros brindes dos patrocinadores. Não serão entregues dorsais no dia da prova.",
        },
        en: {
          question: "How do I collect my participation kit?",
          answer:
            "After registering and up to a week before the race, you will receive a receipt by email to collect your registration. With this receipt, go to Sport Expo at the CCL (Centro de Congressos de Lisboa, Junqueira) on May 16 (between 10 am and 8 pm) to collect your bib and participation kit, which includes the official race t-shirt and sponsor gifts. No bibs will be distributed on race day.",
        },
        es: {
          question: "¿Cómo recoger el kit de participación?",
          answer:
            "Tras la inscripción y hasta una semana antes de la carrera, recibirás un recibo por email para la recogida de la inscripción. Con este recibo, debes ir a la feria Sport Expo en el CCL (Centro de Congressos de Lisboa, Junqueira) el día 16 de mayo (entre las 10:00 y las 20:00 h) y recoger el dorsal y el kit de participación, que incluye la camiseta oficial de la carrera y otros regalos de los patrocinadores. No se entregarán dorsales el día de la carrera.",
        },
        fr: {
          question: "Comment récupérer mon kit de participation?",
          answer:
            "Après l'inscription et jusqu'à une semaine avant la course, vous recevrez un reçu par email pour récupérer votre inscription. Avec ce reçu, rendez-vous au Sport Expo au CCL (Centro de Congressos de Lisboa, Junqueira) le 16 mai (entre 10h et 20h) pour récupérer votre dossard et votre kit de participation, qui comprend le t-shirt officiel de la course et des cadeaux des sponsors. Aucun dossard ne sera distribué le jour de la course.",
        },
        de: {
          question: "Wie erhalte ich mein Teilnahmepaket?",
          answer:
            "Nach der Anmeldung und bis zu einer Woche vor dem Rennen erhalten Sie eine Quittung per E-Mail zur Abholung Ihrer Anmeldung. Mit dieser Quittung gehen Sie zur Sport Expo im CCL (Centro de Congressos de Lisboa, Junqueira) am 16. Mai (zwischen 10 und 20 Uhr) und holen Ihre Startnummer und Ihr Teilnahmepaket ab, das das offizielle Renn-T-Shirt und Sponsor-Geschenke enthält. Am Renntag werden keine Startnummern ausgegeben.",
        },
        it: {
          question: "Come ritirare il kit di partecipazione?",
          answer:
            "Dopo la registrazione e fino a una settimana prima della gara, riceverai una ricevuta via email per il ritiro dell'iscrizione. Con questa ricevuta, recati allo Sport Expo al CCL (Centro de Congressos de Lisboa, Junqueira) il 16 maggio (tra le 10:00 e le 20:00) per ritirare il pettorale e il kit di partecipazione, che include la t-shirt ufficiale della gara e gadget degli sponsor. Nessun pettorale sarà distribuito il giorno della gara.",
        },
      },
    },
    {
      order: 7,
      translations: {
        pt: {
          question: "Posso usar os transportes públicos gratuitamente?",
          answer:
            "Sim, mediante apresentação do dorsal, o atleta terá transporte gratuito pelos parceiros da organização. Os transportes públicos de Lisboa (metro, autocarros e comboios) estão disponíveis a partir das 07:00. Existem também shuttles gratuitos da meta para a partida entre as 07:00 e as 09:00.",
        },
        en: {
          question: "Can I use public transport for free on race day?",
          answer:
            "Yes, on presentation of the bib, athletes will have free transport provided by the organization's partners. Lisbon public transportation (subway, buses and trains) is available from 07:00. Free shuttles from the finish line to the starting line are also available from 07:00 to 09:00.",
        },
        es: {
          question:
            "¿Puedo usar el transporte público gratuitamente el día de la carrera?",
          answer:
            "Sí, con la presentación del dorsal, el atleta tendrá transporte gratuito por parte de los socios de la organización. El transporte público de Lisboa (metro, autobuses y trenes) está disponible a partir de las 07:00. También hay lanzaderas gratuitas desde la meta hasta la salida entre las 07:00 y las 09:00.",
        },
        fr: {
          question:
            "Puis-je utiliser les transports en commun gratuitement le jour de la course?",
          answer:
            "Oui, sur présentation du dossard, l'athlète bénéficiera du transport gratuit fourni par les partenaires de l'organisation. Les transports en commun de Lisbonne (métro, bus et trains) sont disponibles à partir de 07:00. Des navettes gratuites de l'arrivée au départ sont également disponibles de 07:00 à 09:00.",
        },
        de: {
          question:
            "Kann ich am Renntag kostenlos öffentliche Verkehrsmittel nutzen?",
          answer:
            "Ja, gegen Vorlage der Startnummer erhalten Athleten kostenlosen Transport von den Partnern der Organisation. Der öffentliche Nahverkehr von Lissabon (U-Bahn, Busse und Züge) ist ab 07:00 Uhr verfügbar. Kostenlose Shuttles vom Ziel zum Start sind ebenfalls von 07:00 bis 09:00 Uhr verfügbar.",
        },
        it: {
          question:
            "Posso usare i trasporti pubblici gratuitamente il giorno della gara?",
          answer:
            "Sì, su presentazione del pettorale, l'atleta avrà trasporto gratuito fornito dai partner dell'organizzazione. I trasporti pubblici di Lisbona (metro, autobus e treni) sono disponibili dalle 07:00. Sono disponibili anche navette gratuite dall'arrivo alla partenza dalle 07:00 alle 09:00.",
        },
      },
    },
    {
      order: 8,
      translations: {
        pt: {
          question: "Existe apoio médico durante a prova?",
          answer:
            "Sim. A Femédica e o Hospital da Luz trabalham em estreita colaboração para garantir apoio médico durante a prova e na meta.",
        },
        en: {
          question: "Is there medical support during the race?",
          answer:
            "Yes. Femédica and Hospital da Luz work closely together to provide medical support during the race and at the finish line.",
        },
        es: {
          question: "¿Hay apoio médico durante la carrera?",
          answer:
            "Sí. Femédica y el Hospital da Luz trabajan en estrecha colaboración para garantizar el apoyo médico durante la carrera y en la meta.",
        },
        fr: {
          question: "Y a-t-il un soutien médical pendant la course?",
          answer:
            "Oui. Femédica et l'Hospital da Luz travaillent en étroite collaboration pour fournir un soutien médical pendant la course et à l'arrivée.",
        },
        de: {
          question: "Gibt es medizinische Unterstützung während des Rennens?",
          answer:
            "Ja. Femédica und das Hospital da Luz arbeiten eng zusammen, um medizinische Unterstützung während des Rennens und am Ziel zu gewährleisten.",
        },
        it: {
          question: "C'è supporto medico durante la gara?",
          answer:
            "Sì. Femédica e l'Hospital da Luz collaborano strettamente per fornire supporto medico durante la gara e al traguardo.",
        },
      },
    },
    {
      order: 9,
      translations: {
        pt: {
          question: "Recebo medalha se participar?",
          answer:
            "Sim. Se participares e concluíres a prova, receberás uma medalha de 'Finisher' na zona de chegada.",
        },
        en: {
          question: "Do I get a medal if I take part?",
          answer:
            'Yes. If you take part and finish the race, you will receive a "Finisher" medal in the finish line area.',
        },
        es: {
          question: "¿Recibo una medalla si participo?",
          answer:
            'Sí. Si participas y terminas la carrera, recibirás una medalla de "Finisher" en la zona de llegada.',
        },
        fr: {
          question: "Est-ce que je reçois une médaille si je participe?",
          answer:
            'Oui. Si vous participez et terminez la course, vous recevrez une médaille de "Finisher" dans la zone d\'arrivée.',
        },
        de: {
          question: "Bekomme ich eine Medaille, wenn ich teilnehme?",
          answer:
            'Ja. Wenn Sie teilnehmen und das Rennen beenden, erhalten Sie im Zielbereich eine "Finisher"-Medaille.',
        },
        it: {
          question: "Ricevo una medaglia se partecipo?",
          answer:
            'Sì. Se partecipi e concludi la gara, riceverai una medaglia "Finisher" nell\'area del traguardo.',
        },
      },
    },
    {
      order: 10,
      translations: {
        pt: {
          question: "Posso transferir a minha inscrição?",
          answer:
            "Sim. Podes transferir a inscrição para outro participante indicado por ti, gratuitamente, por email para info@maratonaportugal.com.",
        },
        en: {
          question: "Can I transfer my registration?",
          answer:
            "Yes. You can transfer your registration to another participant nominated by you, free of charge, by email to info@maratonaportugal.com.",
        },
        es: {
          question: "¿Puedo transferir mi inscripción?",
          answer:
            "Sí. Puedes transferir tu inscripción a otro participante designado por ti, de forma gratuita, por email a info@maratonaportugal.com.",
        },
        fr: {
          question: "Puis-je transférer mon inscription?",
          answer:
            "Oui. Vous pouvez transférer votre inscription à un autre participant désigné par vous, gratuitement, par email à info@maratonaportugal.com.",
        },
        de: {
          question: "Kann ich meine Anmeldung übertragen?",
          answer:
            "Ja. Sie können Ihre Anmeldung kostenlos per E-Mail an info@maratonaportugal.com auf einen anderen von Ihnen benannten Teilnehmer übertragen.",
        },
        it: {
          question: "Posso trasferire la mia iscrizione?",
          answer:
            "Sì. Puoi trasferire la tua iscrizione a un altro partecipante da te nominato, gratuitamente, via email a info@maratonaportugal.com.",
        },
      },
    },
  ];

  for (const faq of faqs) {
    const createdFaq = await prisma.eventFAQ.create({
      data: {
        eventId: event.id,
        order: faq.order,
        question: faq.translations.pt.question,
        answer: faq.translations.pt.answer,
      },
    });

    for (const [lang, trans] of Object.entries(faq.translations)) {
      await prisma.eventFAQTranslation.create({
        data: {
          faqId: createdFaq.id,
          language: lang as Language,
          question: trans.question,
          answer: trans.answer,
        },
      });
    }
  }

  console.log(`   ✅ Created ${faqs.length} FAQs with 6 language translations`);

  // ============================================================================
  // Summary
  // ============================================================================
  console.log("\n✅ Seed completed successfully!");
  console.log(`
📊 Summary:
- Event: Mimosa Corrida Pela Vida 2026
- Slug: mimosa-corrida-pela-vida-2026
- Date: 17 de maio de 2026, 09:30
- Location: Santos → Torre de Belém, Lisboa
- Distance: 5 km (non-competitive)
- Max participants: 14.000
- Time limit: 2 hours
- Languages: 6 (pt, en, es, fr, de, it)
- Variants: 1 (Mimosa Corrida Pela Vida 5K)
- Pricing phases: 1 (inscrição geral)
- FAQs: ${faqs.length} (with 6 language translations)
- Cause: Liga Portuguesa Contra o Cancro (cancro da mama)
- Kit collection: 16 maio, Sport Expo, CCL Junqueira, 10h-20h
- Website: https://www.maratonaclubedeportugal.com
  `);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
