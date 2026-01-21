import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function findOrCreatePricingPhase(data: {
  eventId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  price: number;
  currency: Currency;
}) {
  const existing = await prisma.pricingPhase.findFirst({
    where: {
      eventId: data.eventId,
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
    },
  });

  if (existing) {
    return prisma.pricingPhase.update({
      where: { id: existing.id },
      data: {
        price: data.price,
        currency: data.currency,
      },
    });
  }

  return prisma.pricingPhase.create({ data });
}

async function main() {
  console.log("🏃 Seeding Trail do Capitão 2026...");

  const slug = "trail-capitao-2026";

  // Upsert Event
  const event = await prisma.event.upsert({
    where: { slug },
    update: {
      title: "Trail do Capitão 2026",
      description:
        "A VII edição do Trail do Capitão é uma prova que percorre trilhos e caminhos das freguesias de Rebordosa, Vandoma e Baltar do concelho de Paredes. Organizado pelo Grupo Desportivo da Portela.",
      startDate: new Date("2026-01-31T16:00:00Z"),
      endDate: new Date("2026-01-31T21:00:00Z"),
      registrationDeadline: new Date("2026-01-27T23:59:59Z"),
      city: "Rebordosa",
      country: "Portugal",
      latitude: 41.2071263,
      longitude: -8.4246348,
      sportTypes: [SportType.TRAIL],
      externalUrl: "https://www.portimer.pt/eventos/trail_capitao_2026",
      imageUrl:
        "https://scontent.fopo3-1.fna.fbcdn.net/v/t39.30808-6/470857606_989886906538850_6086502881086976685_n.jpg",
    },
    create: {
      slug,
      title: "Trail do Capitão 2026",
      description:
        "A VII edição do Trail do Capitão é uma prova que percorre trilhos e caminhos das freguesias de Rebordosa, Vandoma e Baltar do concelho de Paredes. Organizado pelo Grupo Desportivo da Portela.",
      startDate: new Date("2026-01-31T16:00:00Z"),
      endDate: new Date("2026-01-31T21:00:00Z"),
      registrationDeadline: new Date("2026-01-27T23:59:59Z"),
      city: "Rebordosa",
      country: "Portugal",
      latitude: 41.2071263,
      longitude: -8.4246348,
      sportTypes: [SportType.TRAIL],
      externalUrl: "https://www.portimer.pt/eventos/trail_capitao_2026",
      imageUrl:
        "https://scontent.fopo3-1.fna.fbcdn.net/v/t39.30808-6/470857606_989886906538850_6086502881086976685_n.jpg",
    },
  });

  console.log(`✅ Event upserted with ID: ${event.id}`);

  // Upsert Translations for all 6 languages
  const translations = [
    {
      language: Language.pt,
      title: "Trail do Capitão 2026",
      description: `A VII edição do Trail do Capitão é uma prova que percorre trilhos e caminhos das freguesias de Rebordosa, Vandoma e Baltar do concelho de Paredes. Organizado pelo Grupo Desportivo da Portela, este evento realiza-se no dia 31 de janeiro de 2026, em Rebordosa, independentemente das condições climatéricas do dia.

**Provas Competitivas:**

**Trail do Capitão 20km** - Distância de 20km com desnível positivo de aproximadamente 900m D+. Prova competitiva aberta a maiores de idade (18 anos).

**Mini-Trail do Capitão 10km** - Distância de 10km com desnível positivo de aproximadamente 350m D+. Pode ser feito a correr ou a caminhar, aberto a maiores de idade (18 anos).

**Capitão Kids** - Prova para os mais novos, com partida às 11h00.

**Programa:**
- 10h00 - Abertura do secretariado (Pavilhão Gimnodesportivo Manuel Moreira Neto)
- 11h00 - Capitão Kids
- 15h30 - Encerramento do secretariado
- 16h00 - Partida das provas competitivas (20km e 10km)
- 17h00 - Chegada prevista dos primeiros atletas dos 10km
- 18h00 - Chegada prevista dos primeiros atletas dos 20km
- 19h00 - Cerimónia de entrega de prémios

**Tempo Limite:** 5 horas para ambas as provas competitivas.

**Material Obrigatório:** Luz frontal ou lanterna. Aconselhável levar copo ou semelhante para abastecimento de água (não haverá garrafas nem copos nos abastecimentos).

**O que está incluído:**
- Dorsal
- T-Shirt Técnica
- Seguro de acidentes pessoal
- Reforço alimentar e líquido nos abastecimentos
- Banhos de água quente no final da prova
- 1 Bifana + 1 Sopa + 1 Bebida
- Lembrança finisher para todos os participantes que terminarem a prova
- Prémios por escalões e por equipas

A VII edição do Trail do Capitão tem como parceiros estratégicos a Câmara Municipal de Paredes, a Junta de Freguesia de Rebordosa e a ATAD - Amigos do Trail Associação Desportiva, e conta com o apoio dos Bombeiros Voluntários de Rebordosa.`,
      city: "Rebordosa",
      metaTitle:
        "Trail do Capitão 2026 - VII Edição | Rebordosa, Paredes | 31 Janeiro",
      metaDescription:
        "A VII edição do Trail do Capitão realiza-se a 31 de janeiro de 2026 em Rebordosa, Paredes. Provas de 20km (900m D+) e 10km (350m D+), mais Capitão Kids. Organização: Grupo Desportivo da Portela.",
    },
    {
      language: Language.en,
      title: "Trail do Capitão 2026",
      description: `The 7th edition of Trail do Capitão is a race that runs through trails and paths in the parishes of Rebordosa, Vandoma and Baltar in the municipality of Paredes. Organized by Grupo Desportivo da Portela, this event takes place on January 31, 2026, in Rebordosa, regardless of weather conditions.

**Competitive Races:**

**Trail do Capitão 20km** - Distance of 20km with positive elevation gain of approximately 900m D+. Competitive race open to adults (18 years and over).

**Mini-Trail do Capitão 10km** - Distance of 10km with positive elevation gain of approximately 350m D+. Can be done running or walking, open to adults (18 years and over).

**Capitão Kids** - Race for children, starting at 11:00 AM.

**Schedule:**
- 10:00 AM - Registration desk opening (Pavilhão Gimnodesportivo Manuel Moreira Neto)
- 11:00 AM - Capitão Kids
- 3:30 PM - Registration desk closing
- 4:00 PM - Start of competitive races (20km and 10km)
- 5:00 PM - Expected arrival of first 10km athletes
- 6:00 PM - Expected arrival of first 20km athletes
- 7:00 PM - Awards ceremony

**Time Limit:** 5 hours for both competitive races.

**Mandatory Equipment:** Headlamp or flashlight. Recommended to bring a cup or similar for water supply (there will be no bottles or cups at aid stations).

**What's included:**
- Race bib
- Technical T-Shirt
- Personal accident insurance
- Food and liquid refreshments at aid stations
- Hot showers at the finish
- 1 Pork sandwich + 1 Soup + 1 Drink
- Finisher memento for all participants who complete the race
- Prizes by age categories and teams

The 7th edition of Trail do Capitão has strategic partners including Câmara Municipal de Paredes, Junta de Freguesia de Rebordosa, and ATAD - Amigos do Trail Associação Desportiva, with support from Bombeiros Voluntários de Rebordosa.`,
      city: "Rebordosa",
      metaTitle:
        "Trail do Capitão 2026 - 7th Edition | Rebordosa, Paredes | January 31",
      metaDescription:
        "The 7th edition of Trail do Capitão takes place on January 31, 2026 in Rebordosa, Paredes. Races of 20km (900m D+) and 10km (350m D+), plus Capitão Kids. Organization: Grupo Desportivo da Portela.",
    },
    {
      language: Language.es,
      title: "Trail do Capitão 2026",
      description: `La VII edición del Trail do Capitão es una carrera que recorre senderos y caminos de las parroquias de Rebordosa, Vandoma y Baltar en el municipio de Paredes. Organizado por Grupo Desportivo da Portela, este evento se celebra el 31 de enero de 2026, en Rebordosa, independientemente de las condiciones climáticas.

**Carreras Competitivas:**

**Trail do Capitão 20km** - Distancia de 20km con desnivel positivo de aproximadamente 900m D+. Carrera competitiva abierta a adultos (18 años o más).

**Mini-Trail do Capitão 10km** - Distancia de 10km con desnivel positivo de aproximadamente 350m D+. Se puede hacer corriendo o caminando, abierto a adultos (18 años o más).

**Capitão Kids** - Carrera para niños, con salida a las 11:00 horas.

**Programa:**
- 10:00 - Apertura de la secretaría (Pavilhão Gimnodesportivo Manuel Moreira Neto)
- 11:00 - Capitão Kids
- 15:30 - Cierre de la secretaría
- 16:00 - Salida de las carreras competitivas (20km y 10km)
- 17:00 - Llegada prevista de los primeros atletas de 10km
- 18:00 - Llegada prevista de los primeros atletas de 20km
- 19:00 - Ceremonia de entrega de premios

**Tiempo Límite:** 5 horas para ambas carreras competitivas.

**Equipamiento Obligatorio:** Linterna frontal o linterna. Recomendable llevar vaso o similar para el suministro de agua (no habrá botellas ni vasos en los avituallamientos).

**Qué está incluido:**
- Dorsal
- Camiseta técnica
- Seguro de accidentes personales
- Avituallamiento sólido y líquido en los puntos de abastecimiento
- Duchas de agua caliente al final de la carrera
- 1 Bocadillo de cerdo + 1 Sopa + 1 Bebida
- Recuerdo finisher para todos los participantes que terminen la carrera
- Premios por categorías de edad y equipos

La VII edición del Trail do Capitão cuenta con socios estratégicos como la Câmara Municipal de Paredes, la Junta de Freguesia de Rebordosa y ATAD - Amigos do Trail Associação Desportiva, con el apoyo de Bombeiros Voluntários de Rebordosa.`,
      city: "Rebordosa",
      metaTitle:
        "Trail do Capitão 2026 - VII Edición | Rebordosa, Paredes | 31 Enero",
      metaDescription:
        "La VII edición del Trail do Capitão se celebra el 31 de enero de 2026 en Rebordosa, Paredes. Carreras de 20km (900m D+) y 10km (350m D+), más Capitão Kids. Organización: Grupo Desportivo da Portela.",
    },
    {
      language: Language.fr,
      title: "Trail do Capitão 2026",
      description: `La 7ème édition du Trail do Capitão est une course qui parcourt les sentiers et chemins des paroisses de Rebordosa, Vandoma et Baltar dans la municipalité de Paredes. Organisé par Grupo Desportivo da Portela, cet événement aura lieu le 31 janvier 2026, à Rebordosa, quelles que soient les conditions météorologiques.

**Courses Compétitives:**

**Trail do Capitão 20km** - Distance de 20km avec un dénivelé positif d'environ 900m D+. Course compétitive ouverte aux adultes (18 ans et plus).

**Mini-Trail do Capitão 10km** - Distance de 10km avec un dénivelé positif d'environ 350m D+. Peut être fait en courant ou en marchant, ouvert aux adultes (18 ans et plus).

**Capitão Kids** - Course pour enfants, départ à 11h00.

**Programme:**
- 10h00 - Ouverture du secrétariat (Pavilhão Gimnodesportivo Manuel Moreira Neto)
- 11h00 - Capitão Kids
- 15h30 - Fermeture du secrétariat
- 16h00 - Départ des courses compétitives (20km et 10km)
- 17h00 - Arrivée prévue des premiers athlètes de 10km
- 18h00 - Arrivée prévue des premiers athlètes de 20km
- 19h00 - Cérémonie de remise des prix

**Temps Limite:** 5 heures pour les deux courses compétitives.

**Équipement Obligatoire:** Lampe frontale ou lampe torche. Il est conseillé d'apporter un gobelet ou similaire pour l'approvisionnement en eau (il n'y aura pas de bouteilles ni de gobelets aux ravitaillements).

**Ce qui est inclus:**
- Dossard
- T-shirt technique
- Assurance accidents personnels
- Ravitaillement solide et liquide aux points de ravitaillement
- Douches d'eau chaude à l'arrivée
- 1 Sandwich au porc + 1 Soupe + 1 Boisson
- Souvenir finisher pour tous les participants qui terminent la course
- Prix par catégories d'âge et équipes

La 7ème édition du Trail do Capitão compte parmi ses partenaires stratégiques la Câmara Municipal de Paredes, la Junta de Freguesia de Rebordosa et ATAD - Amigos do Trail Associação Desportiva, avec le soutien des Bombeiros Voluntários de Rebordosa.`,
      city: "Rebordosa",
      metaTitle:
        "Trail do Capitão 2026 - 7ème Édition | Rebordosa, Paredes | 31 Janvier",
      metaDescription:
        "La 7ème édition du Trail do Capitão aura lieu le 31 janvier 2026 à Rebordosa, Paredes. Courses de 20km (900m D+) et 10km (350m D+), plus Capitão Kids. Organisation: Grupo Desportivo da Portela.",
    },
    {
      language: Language.de,
      title: "Trail do Capitão 2026",
      description: `Die 7. Ausgabe des Trail do Capitão ist ein Rennen, das durch Pfade und Wege der Gemeinden Rebordosa, Vandoma und Baltar in der Gemeinde Paredes führt. Organisiert von Grupo Desportivo da Portela, findet diese Veranstaltung am 31. Januar 2026 in Rebordosa statt, unabhängig von den Wetterbedingungen.

**Wettkampfrennen:**

**Trail do Capitão 20km** - Distanz von 20km mit einem positiven Höhenunterschied von etwa 900m D+. Wettkampfrennen offen für Erwachsene (18 Jahre und älter).

**Mini-Trail do Capitão 10km** - Distanz von 10km mit einem positiven Höhenunterschied von etwa 350m D+. Kann laufend oder gehend absolviert werden, offen für Erwachsene (18 Jahre und älter).

**Capitão Kids** - Rennen für Kinder, Start um 11:00 Uhr.

**Programm:**
- 10:00 Uhr - Öffnung des Sekretariats (Pavilhão Gimnodesportivo Manuel Moreira Neto)
- 11:00 Uhr - Capitão Kids
- 15:30 Uhr - Schließung des Sekretariats
- 16:00 Uhr - Start der Wettkampfrennen (20km und 10km)
- 17:00 Uhr - Voraussichtliche Ankunft der ersten 10km-Athleten
- 18:00 Uhr - Voraussichtliche Ankunft der ersten 20km-Athleten
- 19:00 Uhr - Siegerehrung

**Zeitlimit:** 5 Stunden für beide Wettkampfrennen.

**Pflichtausrüstung:** Stirnlampe oder Taschenlampe. Es wird empfohlen, eine Tasse oder ähnliches für die Wasserversorgung mitzubringen (es wird keine Flaschen oder Becher an den Verpflegungsstellen geben).

**Was ist enthalten:**
- Startnummer
- Technisches T-Shirt
- Persönliche Unfallversicherung
- Feste und flüssige Verpflegung an den Verpflegungsstellen
- Warme Duschen im Ziel
- 1 Schweinefleisch-Sandwich + 1 Suppe + 1 Getränk
- Finisher-Andenken für alle Teilnehmer, die das Rennen beenden
- Preise nach Altersklassen und Teams

Die 7. Ausgabe des Trail do Capitão hat strategische Partner wie die Câmara Municipal de Paredes, die Junta de Freguesia de Rebordosa und ATAD - Amigos do Trail Associação Desportiva, mit Unterstützung der Bombeiros Voluntários de Rebordosa.`,
      city: "Rebordosa",
      metaTitle:
        "Trail do Capitão 2026 - 7. Ausgabe | Rebordosa, Paredes | 31. Januar",
      metaDescription:
        "Die 7. Ausgabe des Trail do Capitão findet am 31. Januar 2026 in Rebordosa, Paredes statt. Rennen von 20km (900m D+) und 10km (350m D+), plus Capitão Kids. Organisation: Grupo Desportivo da Portela.",
    },
    {
      language: Language.it,
      title: "Trail do Capitão 2026",
      description: `La VII edizione del Trail do Capitão è una gara che attraversa sentieri e percorsi delle parrocchie di Rebordosa, Vandoma e Baltar nel comune di Paredes. Organizzato da Grupo Desportivo da Portela, questo evento si svolge il 31 gennaio 2026, a Rebordosa, indipendentemente dalle condizioni meteorologiche.

**Gare Competitive:**

**Trail do Capitão 20km** - Distanza di 20km con dislivello positivo di circa 900m D+. Gara competitiva aperta agli adulti (18 anni e oltre).

**Mini-Trail do Capitão 10km** - Distanza di 10km con dislivello positivo di circa 350m D+. Può essere fatto correndo o camminando, aperto agli adulti (18 anni e oltre).

**Capitão Kids** - Gara per bambini, partenza alle 11:00.

**Programma:**
- 10:00 - Apertura della segreteria (Pavilhão Gimnodesportivo Manuel Moreira Neto)
- 11:00 - Capitão Kids
- 15:30 - Chiusura della segreteria
- 16:00 - Partenza delle gare competitive (20km e 10km)
- 17:00 - Arrivo previsto dei primi atleti di 10km
- 18:00 - Arrivo previsto dei primi atleti di 20km
- 19:00 - Cerimonia di premiazione

**Tempo Limite:** 5 ore per entrambe le gare competitive.

**Attrezzatura Obbligatoria:** Lampada frontale o torcia. Si consiglia di portare una tazza o simile per il rifornimento d'acqua (non ci saranno bottiglie né bicchieri ai rifornimenti).

**Cosa è incluso:**
- Pettorale
- T-shirt tecnica
- Assicurazione infortuni personali
- Rifornimento solido e liquido ai punti di rifornimento
- Docce di acqua calda al traguardo
- 1 Panino al maiale + 1 Zuppa + 1 Bevanda
- Ricordo finisher per tutti i partecipanti che completano la gara
- Premi per categorie di età e squadre

La VII edizione del Trail do Capitão ha come partner strategici la Câmara Municipal de Paredes, la Junta de Freguesia de Rebordosa e ATAD - Amigos do Trail Associação Desportiva, con il supporto di Bombeiros Voluntários de Rebordosa.`,
      city: "Rebordosa",
      metaTitle:
        "Trail do Capitão 2026 - VII Edizione | Rebordosa, Paredes | 31 Gennaio",
      metaDescription:
        "La VII edizione del Trail do Capitão si svolge il 31 gennaio 2026 a Rebordosa, Paredes. Gare di 20km (900m D+) e 10km (350m D+), più Capitão Kids. Organizzazione: Grupo Desportivo da Portela.",
    },
  ];

  for (const translation of translations) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: translation.language,
        },
      },
      update: {
        title: translation.title,
        description: translation.description,
        city: translation.city,
        metaTitle: translation.metaTitle,
        metaDescription: translation.metaDescription,
      },
      create: {
        eventId: event.id,
        language: translation.language,
        title: translation.title,
        description: translation.description,
        city: translation.city,
        metaTitle: translation.metaTitle,
        metaDescription: translation.metaDescription,
      },
    });
  }

  console.log(
    "📝 Translations upserted for 6 languages (pt, en, es, fr, de, it)"
  );

  // Delete existing variants for this event to avoid duplicates
  await prisma.eventVariant.deleteMany({
    where: { eventId: event.id },
  });

  console.log("🏃 Creating variants...");

  // Variant 1: Trail 20km
  const variant20km = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Trail 20km",
      distanceKm: 20,
      elevationGainM: 900,
      elevationLossM: 900,
      cutoffTimeHours: 5.0,
      startTime: "16:00",
      price: 15.0,
      currency: Currency.EUR,
    },
  });

  const variant20kmTranslations = [
    {
      language: Language.pt,
      name: "Trail 20km",
      description:
        "Prova competitiva de 20km com desnível positivo de aproximadamente 900m D+. Tempo limite: 5 horas. Material obrigatório: luz frontal ou lanterna. Aberta a maiores de idade (18 anos).",
    },
    {
      language: Language.en,
      name: "Trail 20km",
      description:
        "Competitive 20km race with positive elevation gain of approximately 900m D+. Time limit: 5 hours. Mandatory equipment: headlamp or flashlight. Open to adults (18 years and over).",
    },
    {
      language: Language.es,
      name: "Trail 20km",
      description:
        "Carrera competitiva de 20km con desnivel positivo de aproximadamente 900m D+. Tiempo límite: 5 horas. Equipamiento obligatorio: linterna frontal o linterna. Abierto a adultos (18 años o más).",
    },
    {
      language: Language.fr,
      name: "Trail 20km",
      description:
        "Course compétitive de 20km avec un dénivelé positif d'environ 900m D+. Temps limite: 5 heures. Équipement obligatoire: lampe frontale ou lampe torche. Ouvert aux adultes (18 ans et plus).",
    },
    {
      language: Language.de,
      name: "Trail 20km",
      description:
        "Wettkampfrennen von 20km mit einem positiven Höhenunterschied von etwa 900m D+. Zeitlimit: 5 Stunden. Pflichtausrüstung: Stirnlampe oder Taschenlampe. Offen für Erwachsene (18 Jahre und älter).",
    },
    {
      language: Language.it,
      name: "Trail 20km",
      description:
        "Gara competitiva di 20km con dislivello positivo di circa 900m D+. Tempo limite: 5 ore. Attrezzatura obbligatoria: lampada frontale o torcia. Aperto agli adulti (18 anni e oltre).",
    },
  ];

  for (const translation of variant20kmTranslations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: variant20km.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: variant20km.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  // Variant 2: Mini-Trail 10km
  const variant10km = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Mini-Trail 10km",
      distanceKm: 10,
      elevationGainM: 350,
      elevationLossM: 350,
      cutoffTimeHours: 5.0,
      startTime: "16:00",
      price: 13.0,
      currency: Currency.EUR,
    },
  });

  const variant10kmTranslations = [
    {
      language: Language.pt,
      name: "Mini-Trail 10km",
      description:
        "Prova competitiva de 10km com desnível positivo de aproximadamente 350m D+. Pode ser feito a correr ou a caminhar. Tempo limite: 5 horas. Material obrigatório: luz frontal ou lanterna. Aberta a maiores de idade (18 anos).",
    },
    {
      language: Language.en,
      name: "Mini-Trail 10km",
      description:
        "Competitive 10km race with positive elevation gain of approximately 350m D+. Can be done running or walking. Time limit: 5 hours. Mandatory equipment: headlamp or flashlight. Open to adults (18 years and over).",
    },
    {
      language: Language.es,
      name: "Mini-Trail 10km",
      description:
        "Carrera competitiva de 10km con desnivel positivo de aproximadamente 350m D+. Se puede hacer corriendo o caminando. Tiempo límite: 5 horas. Equipamiento obligatorio: linterna frontal o linterna. Abierto a adultos (18 años o más).",
    },
    {
      language: Language.fr,
      name: "Mini-Trail 10km",
      description:
        "Course compétitive de 10km avec un dénivelé positif d'environ 350m D+. Peut être fait en courant ou en marchant. Temps limite: 5 heures. Équipement obligatoire: lampe frontale ou lampe torche. Ouvert aux adultes (18 ans et plus).",
    },
    {
      language: Language.de,
      name: "Mini-Trail 10km",
      description:
        "Wettkampfrennen von 10km mit einem positiven Höhenunterschied von etwa 350m D+. Kann laufend oder gehend absolviert werden. Zeitlimit: 5 Stunden. Pflichtausrüstung: Stirnlampe oder Taschenlampe. Offen für Erwachsene (18 Jahre und älter).",
    },
    {
      language: Language.it,
      name: "Mini-Trail 10km",
      description:
        "Gara competitiva di 10km con dislivello positivo di circa 350m D+. Può essere fatto correndo o camminando. Tempo limite: 5 ore. Attrezzatura obbligatoria: lampada frontale o torcia. Aperto agli adulti (18 anni e oltre).",
    },
  ];

  for (const translation of variant10kmTranslations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: variant10km.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: variant10km.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  // Variant 3: Caminhada 10km
  const variantCaminhada = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Caminhada 10km",
      distanceKm: 10,
      elevationGainM: 350,
      elevationLossM: 350,
      cutoffTimeHours: 5.0,
      startTime: "16:00",
      price: 12.0,
      currency: Currency.EUR,
    },
  });

  const variantCaminhadaTranslations = [
    {
      language: Language.pt,
      name: "Caminhada 10km",
      description:
        "Caminhada de 10km com desnível positivo de aproximadamente 350m D+. Tempo limite: 5 horas. Material obrigatório: luz frontal ou lanterna. Aberta a todos os participantes.",
    },
    {
      language: Language.en,
      name: "Walk 10km",
      description:
        "10km walk with positive elevation gain of approximately 350m D+. Time limit: 5 hours. Mandatory equipment: headlamp or flashlight. Open to all participants.",
    },
    {
      language: Language.es,
      name: "Caminata 10km",
      description:
        "Caminata de 10km con desnivel positivo de aproximadamente 350m D+. Tiempo límite: 5 horas. Equipamiento obligatorio: linterna frontal o linterna. Abierto a todos los participantes.",
    },
    {
      language: Language.fr,
      name: "Randonnée 10km",
      description:
        "Randonnée de 10km avec un dénivelé positif d'environ 350m D+. Temps limite: 5 heures. Équipement obligatoire: lampe frontale ou lampe torche. Ouvert à tous les participants.",
    },
    {
      language: Language.de,
      name: "Wanderung 10km",
      description:
        "10km Wanderung mit einem positiven Höhenunterschied von etwa 350m D+. Zeitlimit: 5 Stunden. Pflichtausrüstung: Stirnlampe oder Taschenlampe. Offen für alle Teilnehmer.",
    },
    {
      language: Language.it,
      name: "Camminata 10km",
      description:
        "Camminata di 10km con dislivello positivo di circa 350m D+. Tempo limite: 5 ore. Attrezzatura obbligatoria: lampada frontale o torcia. Aperto a tutti i partecipanti.",
    },
  ];

  for (const translation of variantCaminhadaTranslations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: variantCaminhada.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: variantCaminhada.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  // Variant 4: Capitão Kids
  const variantKids = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Capitão Kids",
      distanceKm: 2,
      elevationGainM: 50,
      elevationLossM: 50,
      cutoffTimeHours: 1.0,
      startTime: "11:00",
      price: 5.0,
      currency: Currency.EUR,
    },
  });

  const variantKidsTranslations = [
    {
      language: Language.pt,
      name: "Capitão Kids",
      description:
        "Prova para os mais novos, com partida às 11h00. Uma experiência divertida e segura para as crianças participarem no mundo do trail running.",
    },
    {
      language: Language.en,
      name: "Capitão Kids",
      description:
        "Race for children, starting at 11:00 AM. A fun and safe experience for kids to participate in the world of trail running.",
    },
    {
      language: Language.es,
      name: "Capitão Kids",
      description:
        "Carrera para niños, con salida a las 11:00 horas. Una experiencia divertida y segura para que los niños participen en el mundo del trail running.",
    },
    {
      language: Language.fr,
      name: "Capitão Kids",
      description:
        "Course pour enfants, départ à 11h00. Une expérience amusante et sûre pour que les enfants participent au monde du trail running.",
    },
    {
      language: Language.de,
      name: "Capitão Kids",
      description:
        "Rennen für Kinder, Start um 11:00 Uhr. Ein unterhaltsames und sicheres Erlebnis für Kinder, um an der Welt des Trail-Runnings teilzunehmen.",
    },
    {
      language: Language.it,
      name: "Capitão Kids",
      description:
        "Gara per bambini, partenza alle 11:00. Un'esperienza divertente e sicura per i bambini per partecipare al mondo del trail running.",
    },
  ];

  for (const translation of variantKidsTranslations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: variantKids.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: variantKids.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  console.log("📝 Variant translations upserted for all 4 variants");

  // Delete existing pricing phases for this event to avoid duplicates
  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

  console.log("💰 Creating pricing phases...");

  // Phase 1a: Trail 20km - Early Bird (23 Oct 2025 - 31 Dec 2025)
  await findOrCreatePricingPhase({
    eventId: event.id,
    name: "Trail 20km - 1ª Fase",
    startDate: new Date("2025-10-23T00:00:00Z"),
    endDate: new Date("2025-12-31T23:59:59Z"),
    price: 15.0,
    currency: Currency.EUR,
  });

  // Phase 1b: Trail 20km - Standard (1 Jan 2026 - 27 Jan 2026)
  await findOrCreatePricingPhase({
    eventId: event.id,
    name: "Trail 20km - 2ª Fase",
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-01-27T23:59:59Z"),
    price: 17.0,
    currency: Currency.EUR,
  });

  // Phase 2a: Mini-Trail 10km - Early Bird (23 Oct 2025 - 31 Dec 2025)
  await findOrCreatePricingPhase({
    eventId: event.id,
    name: "Mini-Trail 10km - 1ª Fase",
    startDate: new Date("2025-10-23T00:00:00Z"),
    endDate: new Date("2025-12-31T23:59:59Z"),
    price: 13.0,
    currency: Currency.EUR,
  });

  // Phase 2b: Mini-Trail 10km - Standard (1 Jan 2026 - 27 Jan 2026)
  await findOrCreatePricingPhase({
    eventId: event.id,
    name: "Mini-Trail 10km - 2ª Fase",
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-01-27T23:59:59Z"),
    price: 15.0,
    currency: Currency.EUR,
  });

  // Phase 3a: Caminhada 10km - Early Bird (23 Oct 2025 - 31 Dec 2025)
  await findOrCreatePricingPhase({
    eventId: event.id,
    name: "Caminhada 10km - 1ª Fase",
    startDate: new Date("2025-10-23T00:00:00Z"),
    endDate: new Date("2025-12-31T23:59:59Z"),
    price: 12.0,
    currency: Currency.EUR,
  });

  // Phase 3b: Caminhada 10km - Standard (1 Jan 2026 - 27 Jan 2026)
  await findOrCreatePricingPhase({
    eventId: event.id,
    name: "Caminhada 10km - 2ª Fase",
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-01-27T23:59:59Z"),
    price: 14.0,
    currency: Currency.EUR,
  });

  // Phase 4: Capitão Kids - Single Phase (23 Oct 2025 - 27 Jan 2026)
  await findOrCreatePricingPhase({
    eventId: event.id,
    name: "Capitão Kids",
    startDate: new Date("2025-10-23T00:00:00Z"),
    endDate: new Date("2026-01-27T23:59:59Z"),
    price: 5.0,
    currency: Currency.EUR,
  });

  console.log("💰 Pricing phases created (7 phases for 4 variants)");

  console.log("\n🎉 Trail do Capitão 2026 seed completed successfully!");
  console.log("📍 Location: Rebordosa, Paredes, Portugal");
  console.log("📅 Date: January 31, 2026");
  console.log(
    "🏃 4 variants: Trail 20km, Mini-Trail 10km, Caminhada 10km, Capitão Kids"
  );
}

main()
  .catch((e) => {
    console.error("❌ Error seeding Trail do Capitão 2026:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
