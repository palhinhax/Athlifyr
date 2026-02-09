import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding 8ª Rota do Vascão em BTT Ameixial 2026...");

  // 1. Upsert event (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: "8a-rota-vascao-ameixial-2026" },
    update: {
      title: "8ª Rota do Vascão em BTT Ameixial 2026",
      description: "8ª Edição da Rota do Vascão no coração do Algarve",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-04-19T09:00:00.000Z"),
      endDate: new Date("2026-04-19T15:00:00.000Z"),
      city: "Ameixial",
      country: "Portugal",
      latitude: 37.2667,
      longitude: -8.1333,
      googleMapsUrl:
        "https://maps.google.com/?q=Parque+Grupo+Desportivo+Ameixialense+Ameixial",
      externalUrl: "",
      imageUrl: "",
      isFeatured: false,
    },
    create: {
      slug: "8a-rota-vascao-ameixial-2026",
      title: "8ª Rota do Vascão em BTT Ameixial 2026",
      description: "8ª Edição da Rota do Vascão no coração do Algarve",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-04-19T09:00:00.000Z"),
      endDate: new Date("2026-04-19T15:00:00.000Z"),
      city: "Ameixial",
      country: "Portugal",
      latitude: 37.2667,
      longitude: -8.1333,
      googleMapsUrl:
        "https://maps.google.com/?q=Parque+Grupo+Desportivo+Ameixialense+Ameixial",
      externalUrl: "",
      imageUrl: "",
      isFeatured: false,
    },
  });

  console.log(`✅ Event created/updated: ${event.slug}`);

  // 2. Upsert event translations separately (ALL 6 LANGUAGES)
  const eventTranslations = {
    pt: {
      title: "8ª Rota do Vascão em BTT Ameixial 2026",
      description: `# 🚵‍♂️ 8ª Rota do Vascão em BTT

**8ª Edição** da tradicional Rota do Vascão em BTT! Vem pedalar pelas margens da **Ribeira do Vascão**, num evento de lazer que percorre caminhos rurais e trilhos de terra batida entre Ameixial (Loulé) e Santa Cruz (Almodôvar).

## 🌄 Dois Percursos de Lazer

**Percurso 30 km** - Ideal para iniciantes e praticantes ocasionais
**Percurso 50 km** - Para ciclistas mais experientes

Ambos percorrem as margens da Ribeira do Vascão em caminhos rurais autênticos do interior algarvio. Evento de cariz **não competitivo**, focado no lazer e convívio!

## ✨ Destaques

- **Trilhos autênticos** - percurso pelos caminhos históricos do Ameixial
- **Paisagens algarvias** - vistas únicas sobre o interior do Algarve
- **Organização familiar** - ambiente acolhedor e festivo
- **Tradição e história** - 8ª edição de um evento icónico
- **Limite de vagas** - máximo de 300 participantes

## 🎯 O Que Está Incluído (20€)

- Participação no evento
- Almoço convívio opcional (+10€)
- **Brindes:** Pão Caseiro, Chouriça e T-shirt do evento
- Abastecimentos sólidos e líquidos durante todo o percurso
- Seguro desportivo de acidentes pessoais
- Apoio logístico completo
- Assistência técnica no percurso
- Primeiros socorros
- Acesso a balneários para banho quente
- Zona de lavagem de bicicletas

### 📍 Local de Partida/Chegada
**Parque do Grupo Desportivo Ameixialense**
Ameixial, concelho de Tavira

### 🏆 Prémios (Evento Não Competitivo)

Apesar do cariz não competitivo, haverá **prémios para os 3 primeiros de cada escalão** em ambos os percursos:

**Masculinos:** Elites (0-29), Masters A (30-39), Masters B (40-49), Masters C (50+), Masters D (60+)
**Femininos:** Elites (0-29), Masters 30 (30-39), Masters 40 (40+)
**E-bikes:** Geral 30km e Geral 50km

### ⚠️ Importante
- **Vagas limitadas:** apenas 300 inscrições validadas
- **Idade mínima:** 15 anos (menores de 18 com autorização do encarregado de educação)
- **Inscrições até:** 14 de abril de 2026
- **Secretariado:** abre às 07:30h no dia do evento
- **Almoço acompanhantes:** 10€

**Organização:** Grupo Desportivo Ameixialense

Junta-te à festa do BTT no Algarve! ☀️🚴‍♀️`,
      city: "Ameixial",
      metaTitle: "8ª Rota do Vascão BTT Ameixial 2026 | Tavira | 19 Abril",
      metaDescription:
        "8ª Edição Rota do Vascão em BTT - Ameixial, Algarve. Trilhos históricos e paisagens únicas. 300 vagas. Inscrições 20€. 19 Abril 2026.",
    },
    en: {
      title: "8th Vascão Route MTB Ameixial 2026",
      description: `# 🚵‍♂️ 8th Vascão Route MTB

**8th Edition** of the traditional Vascão Route MTB! Come ride through the historic trails and stunning landscapes of Ameixial, in the heart of the Algarve.

## 🌄 An Unforgettable Route

Discover the best Algarve trails in a morning of MTB full of good energy, natural landscapes and fellowship among cyclists. The Vascão Route is already a reference in the Algarve MTB calendar!

## ✨ Highlights

- **Authentic trails** - route through Ameixial's historic paths
- **Algarve landscapes** - unique views over the Algarve interior
- **Family organization** - welcoming and festive atmosphere
- **Tradition and history** - 8th edition of an iconic event
- **Limited spots** - maximum 300 participants

## 🎯 What's Included (20€)

- Event participation
- Optional lunch (+10€)
- Solid and liquid refreshments during the route
- Sports accident insurance
- Complete logistical support
- Technical assistance on route
- First aid
- Participation souvenirs
- Shower and bike wash area

### 📍 Start/Finish Location
**Grupo Desportivo Ameixialense Park**
Ameixial, Tavira municipality

### ⚠️ Important
- **Limited spots:** only 300 validated registrations
- **Registrations until:** April 14, 2026
- **Companion lunch:** 10€

**Organizer:** Grupo Desportivo Ameixialense

Join the MTB party in the Algarve! ☀️🚴‍♀️`,
      city: "Ameixial",
      metaTitle: "8th Vascão Route MTB Ameixial 2026 | Tavira | April 19",
      metaDescription:
        "8th Edition Vascão Route MTB - Ameixial, Algarve. Historic trails and unique landscapes. 300 spots. Registration 20€. April 19, 2026.",
    },
    es: {
      title: "8ª Ruta del Vascão en BTT Ameixial 2026",
      description: `# 🚵‍♂️ 8ª Ruta del Vascão en BTT

**8ª Edición** de la tradicional Ruta del Vascão en BTT! Ven a pedalear por los senderos históricos y paisajes impresionantes de Ameixial, en el corazón del Algarve.

## 🌄 Una Ruta Inolvidable

Descubre los mejores senderos del Algarve en una mañana de BTT llena de buena energía, paisajes naturales y compañerismo entre ciclistas. ¡La Ruta del Vascão ya es una referencia en el calendario de BTT del Algarve!

## ✨ Aspectos Destacados

- **Senderos auténticos** - ruta por los caminos históricos de Ameixial
- **Paisajes del Algarve** - vistas únicas sobre el interior del Algarve
- **Organización familiar** - ambiente acogedor y festivo
- **Tradición e historia** - 8ª edición de un evento icónico
- **Plazas limitadas** - máximo 300 participantes

## 🎯 Qué Está Incluido (20€)

- Participación en el evento
- Almuerzo opcional (+10€)
- Avituallamientos sólidos y líquidos durante el recorrido
- Seguro de accidentes deportivos
- Apoyo logístico completo
- Asistencia técnica en el recorrido
- Primeros auxilios
- Recuerdos de participación
- Zona de duchas y lavado de bicicletas

### 📍 Lugar de Salida/Llegada
**Parque del Grupo Desportivo Ameixialense**
Ameixial, municipio de Tavira

### ⚠️ Importante
- **Plazas limitadas:** solo 300 inscripciones validadas
- **Inscripciones hasta:** 14 de abril de 2026
- **Almuerzo acompañantes:** 10€

**Organización:** Grupo Desportivo Ameixialense

¡Únete a la fiesta del BTT en el Algarve! ☀️🚴‍♀️`,
      city: "Ameixial",
      metaTitle: "8ª Ruta Vascão BTT Ameixial 2026 | Tavira | 19 Abril",
      metaDescription:
        "8ª Edición Ruta del Vascão BTT - Ameixial, Algarve. Senderos históricos y paisajes únicos. 300 plazas. Inscripciones 20€. 19 Abril 2026.",
    },
    fr: {
      title: "8ème Route du Vascão VTT Ameixial 2026",
      description: `# 🚵‍♂️ 8ème Route du Vascão VTT

**8ème Édition** de la traditionnelle Route du Vascão VTT! Venez rouler sur les sentiers historiques et les paysages magnifiques d'Ameixial, au cœur de l'Algarve.

## 🌄 Une Route Inoubliable

Découvrez les meilleurs sentiers de l'Algarve lors d'une matinée VTT pleine de bonne énergie, de paysages naturels et de camaraderie entre cyclistes. La Route du Vascão est déjà une référence dans le calendrier VTT de l'Algarve!

## ✨ Points Forts

- **Sentiers authentiques** - parcours à travers les chemins historiques d'Ameixial
- **Paysages de l'Algarve** - vues uniques sur l'intérieur de l'Algarve
- **Organisation familiale** - ambiance accueillante et festive
- **Tradition et histoire** - 8ème édition d'un événement iconique
- **Places limitées** - maximum 300 participants

## 🎯 Ce Qui Est Inclus (20€)

- Participation à l'événement
- Déjeuner optionnel (+10€)
- Ravitaillements solides et liquides pendant le parcours
- Assurance accidents sportifs
- Support logistique complet
- Assistance technique sur le parcours
- Premiers secours
- Souvenirs de participation
- Zone de douches et lavage vélos

### 📍 Lieu de Départ/Arrivée
**Parc du Grupo Desportivo Ameixialense**
Ameixial, municipalité de Tavira

### ⚠️ Important
- **Places limitées:** seulement 300 inscriptions validées
- **Inscriptions jusqu'au:** 14 avril 2026
- **Déjeuner accompagnants:** 10€

**Organisation:** Grupo Desportivo Ameixialense

Rejoignez la fête du VTT en Algarve! ☀️🚴‍♀️`,
      city: "Ameixial",
      metaTitle: "8ème Route Vascão VTT Ameixial 2026 | Tavira | 19 Avril",
      metaDescription:
        "8ème Édition Route du Vascão VTT - Ameixial, Algarve. Sentiers historiques et paysages uniques. 300 places. Inscriptions 20€. 19 Avril 2026.",
    },
    de: {
      title: "8. Vascão Route MTB Ameixial 2026",
      description: `# 🚵‍♂️ 8. Vascão Route MTB

**8. Ausgabe** der traditionellen Vascão Route MTB! Kommen Sie und fahren Sie durch die historischen Trails und atemberaubenden Landschaften von Ameixial, im Herzen der Algarve.

## 🌄 Eine Unvergessliche Route

Entdecken Sie die besten Algarve-Trails an einem MTB-Morgen voller guter Energie, natürlicher Landschaften und Kameradschaft unter Radfahrern. Die Vascão Route ist bereits eine Referenz im MTB-Kalender der Algarve!

## ✨ Highlights

- **Authentische Trails** - Route durch die historischen Wege von Ameixial
- **Algarve-Landschaften** - einzigartige Ausblicke über das Algarve-Hinterland
- **Familienorganisation** - einladende und festliche Atmosphäre
- **Tradition und Geschichte** - 8. Ausgabe eines ikonischen Events
- **Begrenzte Plätze** - maximal 300 Teilnehmer

## 🎯 Was Ist Enthalten (20€)

- Eventeilnahme
- Optionales Mittagessen (+10€)
- Feste und flüssige Verpflegung während der Strecke
- Sportunfallversicherung
- Vollständige logistische Unterstützung
- Technische Hilfe auf der Strecke
- Erste Hilfe
- Teilnahme-Souvenirs
- Dusch- und Fahrradwaschbereich

### 📍 Start-/Zielort
**Grupo Desportivo Ameixialense Park**
Ameixial, Gemeinde Tavira

### ⚠️ Wichtig
- **Begrenzte Plätze:** nur 300 validierte Anmeldungen
- **Anmeldungen bis:** 14. April 2026
- **Begleiter-Mittagessen:** 10€

**Veranstalter:** Grupo Desportivo Ameixialense

Schließen Sie sich der MTB-Party in der Algarve an! ☀️🚴‍♀️`,
      city: "Ameixial",
      metaTitle: "8. Vascão Route MTB Ameixial 2026 | Tavira | 19. April",
      metaDescription:
        "8. Ausgabe Vascão Route MTB - Ameixial, Algarve. Historische Trails und einzigartige Landschaften. 300 Plätze. Anmeldung 20€. 19. April 2026.",
    },
    it: {
      title: "8ª Rotta del Vascão MTB Ameixial 2026",
      description: `# 🚵‍♂️ 8ª Rotta del Vascão MTB

**8ª Edizione** della tradizionale Rotta del Vascão MTB! Vieni a pedalare attraverso i sentieri storici e i paesaggi mozzafiato di Ameixial, nel cuore dell'Algarve.

## 🌄 Una Rotta Indimenticabile

Scopri i migliori sentieri dell'Algarve in una mattinata MTB piena di buona energia, paesaggi naturali e cameratismo tra ciclisti. La Rotta del Vascão è già un riferimento nel calendario MTB dell'Algarve!

## ✨ Punti Salienti

- **Sentieri autentici** - percorso attraverso i cammini storici di Ameixial
- **Paesaggi dell'Algarve** - viste uniche sull'interno dell'Algarve
- **Organizzazione familiare** - atmosfera accogliente e festosa
- **Tradizione e storia** - 8ª edizione di un evento iconico
- **Posti limitati** - massimo 300 partecipanti

## 🎯 Cosa È Incluso (20€)

- Partecipazione all'evento
- Pranzo facoltativo (+10€)
- Ristori solidi e liquidi durante il percorso
- Assicurazione infortuni sportivi
- Supporto logistico completo
- Assistenza tecnica sul percorso
- Pronto soccorso
- Souvenir di partecipazione
- Zona docce e lavaggio bici

### 📍 Luogo di Partenza/Arrivo
**Parco Grupo Desportivo Ameixialense**
Ameixial, comune di Tavira

### ⚠️ Importante
- **Posti limitati:** solo 300 iscrizioni validate
- **Iscrizioni fino al:** 14 aprile 2026
- **Pranzo accompagnatori:** 10€

**Organizzatore:** Grupo Desportivo Ameixialense

Unisciti alla festa MTB in Algarve! ☀️🚴‍♀️`,
      city: "Ameixial",
      metaTitle: "8ª Rotta Vascão MTB Ameixial 2026 | Tavira | 19 Aprile",
      metaDescription:
        "8ª Edizione Rotta del Vascão MTB - Ameixial, Algarve. Sentieri storici e paesaggi unici. 300 posti. Iscrizioni 20€. 19 Aprile 2026.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: Language[lang],
        },
      },
      update: eventTranslations[lang],
      create: {
        eventId: event.id,
        language: Language[lang],
        ...eventTranslations[lang],
      },
    });
  }

  console.log("✅ Event translations created/updated (6 languages)");

  // 3. Upsert variants (idempotent with findFirst)
  const findOrCreateVariant = async (variantData: {
    name: string;
    distanceKm: number;
    elevationGainM: number;
    elevationLossM: number;
    startTime: string;
    maxParticipants: number;
    cutoffTimeHours: number;
    atrpGrade: number;
    mountainLevel: number;
    price: number;
    currency: Currency;
  }) => {
    const existing = await prisma.eventVariant.findFirst({
      where: { eventId: event.id, name: variantData.name },
    });

    if (existing) {
      return await prisma.eventVariant.update({
        where: { id: existing.id },
        data: variantData,
      });
    } else {
      return await prisma.eventVariant.create({
        data: { eventId: event.id, ...variantData },
      });
    }
  };

  const rota30kmVariant = await findOrCreateVariant({
    name: "Rota do Vascão 30 km",
    distanceKm: 30,
    elevationGainM: 500,
    elevationLossM: 500,
    startTime: "09:00",
    maxParticipants: 150,
    cutoffTimeHours: 4.0,
    atrpGrade: 2,
    mountainLevel: 2,
    price: 10.0,
    currency: Currency.EUR,
  });

  console.log(`✅ Variant created/updated: ${rota30kmVariant.name}`);

  const rota50kmVariant = await findOrCreateVariant({
    name: "Rota do Vascão 50 km",
    distanceKm: 50,
    elevationGainM: 900,
    elevationLossM: 900,
    startTime: "09:00",
    maxParticipants: 150,
    cutoffTimeHours: 5.5,
    atrpGrade: 3,
    mountainLevel: 2,
    price: 12.0,
    currency: Currency.EUR,
  });

  console.log(`✅ Variant created/updated: ${rota50kmVariant.name}`);

  // 4. Upsert variant translations (6 languages each)
  const rota30kmTranslations = {
    pt: {
      name: "Rota do Vascão 30 km",
      description: `## 🌄 Percurso 30 km - Lazer

Percurso de lazer ideal para iniciantes e praticantes ocasionais. Explora as margens da Ribeira do Vascão em caminhos rurais e trilhos de terra batida.

### 📊 Características
- **Distância:** 30 km
- **Desnível Estimado:** 500m+
- **Dificuldade:** Média
- **Tipo de Terreno:** Caminhos rurais e trilhos de terra batida
- **Tempo Estimado:** 3-4 horas

### 🎯 Percurso Histórico
Percurso pelas margens da Ribeira do Vascão, atravessando as freguesias de Ameixial (Loulé) e Santa Cruz (Almodôvar). Paisagens típicas do interior algarvio com campos de sequeiro e montados.

### 🏆 Prémios
Apesar do cariz não competitivo, há prémios para os 3 primeiros de cada escalão: Elites M/F, Masters A/B/C/D M, Masters 30/40 F, E-bikes.`,
    },
    en: {
      name: "Vascão Route 30 km",
      description: `## 🌄 30 km Route - Leisure

Leisure route ideal for beginners and occasional riders. Explores the banks of Ribeira do Vascão on rural paths and dirt trails.

### 📊 Characteristics
- **Distance:** 30 km
- **Estimated Elevation:** 500m+
- **Difficulty:** Medium
- **Terrain Type:** Rural paths and dirt trails
- **Estimated Time:** 3-4 hours

Come discover the real Algarve on two wheels!`,
    },
    es: {
      name: "Ruta del Vascão 30 km",
      description: `## 🌄 Ruta 30 km - Ocio

Ruta de ocio ideal para principiantes y ciclistas ocasionales. Explora las orillas de la Ribeira do Vascão por caminos rurales y senderos de tierra.`,
    },
    fr: {
      name: "Route du Vascão 30 km",
      description: `## 🌄 Parcours 30 km - Loisir

Parcours de loisir idéal pour débutants et cyclistes occasionnels.`,
    },
    de: {
      name: "Vascão Route 30 km",
      description: `## 🌄 30 km Route - Freizeit

Freizeitstrecke ideal für Anfänger und Gelegenheitsfahrer.`,
    },
    it: {
      name: "Rotta del Vascão 30 km",
      description: `## 🌄 Percorso 30 km - Tempo libero

Percorso ricreativo ideale per principianti e ciclisti occasionali.`,
    },
  };

  const rota50kmTranslations = {
    pt: {
      name: "Rota do Vascão 50 km",
      description: `## 🌄 Percurso 50 km - Competição

Percurso tradicional pelos trilhos históricos de Ameixial e arredores. Uma rota que combina a beleza natural do interior algarvio com a tradição e história local.

### 📊 Características
- **Distância:** 50 km
- **Desnível Estimado:** 900m+
- **Dificuldade:** Média-Alta
- **Tipo de Terreno:** Trilhos, caminhos rurais e caminhos florestais
- **Paisagens:** Interior algarvio com vistas panorâmicas

### 🎯 Percurso Histórico
A Rota do Vascão leva os participantes por caminhos centenários, atravessando paisagens típicas algarvias com campos de sequeiro, montados de sobro e vistas sobre as serras.`,
    },
    en: {
      name: "Vascão Route 50 km",
      description: `## 🌄 50 km Route - Competition

Traditional route through the historic trails of Ameixial and surroundings. Combines the natural beauty of the Algarve interior with local tradition and history.`,
    },
    es: {
      name: "Ruta del Vascão 50 km",
      description: `## 🌄 Ruta 50 km - Competición

Ruta tradicional por los senderos históricos de Ameixial y alrededores.`,
    },
    fr: {
      name: "Route du Vascão 50 km",
      description: `## 🌄 Parcours 50 km - Compétition

Parcours traditionnel à travers les sentiers historiques d'Ameixial.`,
    },
    de: {
      name: "Vascão Route 50 km",
      description: `## 🌄 50 km Route - Wettkampf

Traditionelle Route durch die historischen Trails von Ameixial.`,
    },
    it: {
      name: "Rotta del Vascão 50 km",
      description: `## 🌄 Percorso 50 km - Competizione

Percorso tradizionale attraverso i sentieri storici di Ameixial.`,
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: rota30kmVariant.id,
          language: Language[lang],
        },
      },
      update: rota30kmTranslations[lang],
      create: {
        variantId: rota30kmVariant.id,
        language: Language[lang],
        ...rota30kmTranslations[lang],
      },
    });
  }

  console.log(
    "✅ Rota 30km variant translations created/updated (6 languages)"
  );

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: rota50kmVariant.id,
          language: Language[lang],
        },
      },
      update: rota50kmTranslations[lang],
      create: {
        variantId: rota50kmVariant.id,
        language: Language[lang],
        ...rota50kmTranslations[lang],
      },
    });
  }

  console.log(
    "✅ Rota 50km variant translations created/updated (6 languages)"
  );

  // 5. Upsert pricing phases
  const findOrCreatePricingPhase = async (
    name: string,
    data: {
      startDate: Date;
      endDate: Date;
      price: number;
      currency: Currency;
      discountPercent: number | null;
      note: string | null;
    }
  ) => {
    const existing = await prisma.pricingPhase.findFirst({
      where: { eventId: event.id, name },
    });

    if (existing) {
      return await prisma.pricingPhase.update({
        where: { id: existing.id },
        data,
      });
    } else {
      return await prisma.pricingPhase.create({
        data: { eventId: event.id, name, ...data },
      });
    }
  };

  await findOrCreatePricingPhase("Inscrição Sem Almoço", {
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    endDate: new Date("2026-04-14T23:59:00.000Z"),
    price: 20.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Inscrição sem almoço - Limitado a 300 participantes",
  });

  await findOrCreatePricingPhase("Inscrição Com Almoço", {
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    endDate: new Date("2026-04-14T23:59:00.000Z"),
    price: 30.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Inscrição com almoço convívio incluído (+10€)",
  });

  console.log("✅ Pricing phases created/updated");

  // 6. Optional FAQs for SEO
  const findOrCreateFAQ = async (
    eventId: string,
    order: number,
    question: string,
    answer: string
  ) => {
    const existing = await prisma.eventFAQ.findFirst({
      where: { eventId, order },
    });

    if (existing) {
      return await prisma.eventFAQ.update({
        where: { id: existing.id },
        data: { question, answer },
      });
    }

    return await prisma.eventFAQ.create({
      data: { eventId, order, question, answer },
    });
  };

  const faq1 = await findOrCreateFAQ(
    event.id,
    0,
    "Quantas vagas estão disponíveis?",
    "O evento está limitado a 300 inscrições validadas. Recomendamos inscrição antecipada para garantir a tua vaga."
  );

  const faq1Translations = {
    pt: {
      question: "Quantas vagas estão disponíveis?",
      answer:
        "O evento está limitado a 300 inscrições validadas. Recomendamos inscrição antecipada para garantir a tua vaga.",
    },
    en: {
      question: "How many spots are available?",
      answer:
        "The event is limited to 300 validated registrations. We recommend early registration to secure your spot.",
    },
    es: {
      question: "¿Cuántas plazas están disponibles?",
      answer:
        "El evento está limitado a 300 inscripciones validadas. Recomendamos inscripción anticipada para garantizar tu plaza.",
    },
    fr: {
      question: "Combien de places sont disponibles?",
      answer:
        "L'événement est limité à 300 inscriptions validées. Nous recommandons une inscription anticipée pour sécuriser votre place.",
    },
    de: {
      question: "Wie viele Plätze sind verfügbar?",
      answer:
        "Das Event ist auf 300 validierte Anmeldungen begrenzt. Wir empfehlen eine frühzeitige Anmeldung, um Ihren Platz zu sichern.",
    },
    it: {
      question: "Quanti posti sono disponibili?",
      answer:
        "L'evento è limitato a 300 iscrizioni validate. Raccomandiamo l'iscrizione anticipata per garantire il tuo posto.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: {
        faqId_language: {
          faqId: faq1.id,
          language: Language[lang],
        },
      },
      update: faq1Translations[lang],
      create: {
        faqId: faq1.id,
        language: Language[lang],
        ...faq1Translations[lang],
      },
    });
  }

  const faq2 = await findOrCreateFAQ(
    event.id,
    1,
    "O almoço está incluído no preço?",
    "O almoço é opcional. A inscrição base custa 20€ sem almoço. Com almoço o total é 30€ (20€ inscrição + 10€ almoço)."
  );

  const faq2Translations = {
    pt: {
      question: "O almoço está incluído no preço?",
      answer:
        "O almoço é opcional. A inscrição base custa 20€ sem almoço. Com almoço o total é 30€ (20€ inscrição + 10€ almoço).",
    },
    en: {
      question: "Is lunch included in the price?",
      answer:
        "Lunch is optional. Base registration costs 20€ without lunch. With lunch the total is 30€ (20€ registration + 10€ lunch).",
    },
    es: {
      question: "¿El almuerzo está incluido en el precio?",
      answer:
        "El almuerzo es opcional. La inscripción base cuesta 20€ sin almuerzo. Con almuerzo el total es 30€ (20€ inscripción + 10€ almuerzo).",
    },
    fr: {
      question: "Le déjeuner est-il inclus dans le prix?",
      answer:
        "Le déjeuner est optionnel. L'inscription de base coûte 20€ sans déjeuner. Avec déjeuner le total est 30€ (20€ inscription + 10€ déjeuner).",
    },
    de: {
      question: "Ist das Mittagessen im Preis inbegriffen?",
      answer:
        "Das Mittagessen ist optional. Die Basisanmeldung kostet 20€ ohne Mittagessen. Mit Mittagessen beträgt der Gesamtpreis 30€ (20€ Anmeldung + 10€ Mittagessen).",
    },
    it: {
      question: "Il pranzo è incluso nel prezzo?",
      answer:
        "Il pranzo è facoltativo. L'iscrizione base costa 20€ senza pranzo. Con pranzo il totale è 30€ (20€ iscrizione + 10€ pranzo).",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: {
        faqId_language: {
          faqId: faq2.id,
          language: Language[lang],
        },
      },
      update: faq2Translations[lang],
      create: {
        faqId: faq2.id,
        language: Language[lang],
        ...faq2Translations[lang],
      },
    });
  }

  console.log("✅ FAQs created/updated (2 FAQs with 6 languages each)");

  console.log(
    "\n🎉 8ª Rota do Vascão em BTT Ameixial 2026 seed completed successfully!"
  );
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
