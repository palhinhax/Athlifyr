import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃‍♀️ Seeding Corrida da Mulher - I Edição 2026...");

  // 1. Upsert event (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: "corrida-da-mulher-mangualde-2026" },
    update: {
      title: "Corrida da Mulher - I Edição 2026",
      description:
        "I Edição da Corrida da Mulher em Mangualde - Corrida solidária pelo desporto feminino",
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-03-08T10:00:00.000Z"),
      endDate: new Date("2026-03-08T13:00:00.000Z"),
      city: "Mangualde",
      country: "Portugal",
      latitude: 40.608611,
      longitude: -7.761667,
      googleMapsUrl: "https://maps.google.com/?q=40.608611,-7.761667",
      externalUrl: "https://acorrer.pt/eventos/4176/info",
      imageUrl: "",
      isFeatured: false,
    },
    create: {
      slug: "corrida-da-mulher-mangualde-2026",
      title: "Corrida da Mulher - I Edição 2026",
      description:
        "I Edição da Corrida da Mulher em Mangualde - Corrida solidária pelo desporto feminino",
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-03-08T10:00:00.000Z"),
      endDate: new Date("2026-03-08T13:00:00.000Z"),
      city: "Mangualde",
      country: "Portugal",
      latitude: 40.608611,
      longitude: -7.761667,
      googleMapsUrl: "https://maps.google.com/?q=40.608611,-7.761667",
      externalUrl: "https://acorrer.pt/eventos/4176/info",
      imageUrl: "",
      isFeatured: false,
    },
  });

  console.log(`✅ Event created/updated: ${event.slug}`);

  // 2. Upsert event translations separately (ALL 6 LANGUAGES)
  const eventTranslations = {
    pt: {
      title: "Corrida da Mulher - I Edição 2026",
      description: `# 🏃‍♀️ Corrida da Mulher - I Edição

**I Edição** da Corrida da Mulher em Mangualde! Um evento desportivo solidário que celebra o desporto feminino e apoia a comunidade local.

## 🏃 Duas Provas Disponíveis

**Corrida:** 10 km - Percurso urbano pela cidade de Mangualde (2h30 limite)
**Caminhada:** 5 km - Meia volta do percurso da corrida (2h limite)

## ❤️ Vertente Solidária

**Participa e ajuda!** Cada inscrição contribui para uma causa:
- **1€ de cada inscrição** será usado para adquirir cadeira(s) de rodas para o Centro Social e Cultural da Paróquia de Mangualde
- **Traz um bem alimentar** (não perecível) no dia da corrida - será doado à mesma instituição

## ✨ Destaques

- **I Edição** - Estreia de um evento dedicado à mulher desportista
- **Vertente solidária** - Apoia a comunidade local de Mangualde
- **Organização sólida** - 1ª Companhia de Guias de Mangualde + Câmara Municipal
- **Percurso urbano** - Pelas ruas da cidade de Mangualde
- **Praia de Mangualde** - Partida e chegada junto à Live Beach
- **Medalhas finisher** - Para todos os participantes
- **T-shirt técnica** - Incluída na inscrição

## 🎯 O Que Está Incluído

**Corrida 10km:**
- Seguro desportivo opcional (+3€)
- Dorsal com chip de cronometragem eletrónica
- T-shirt técnica (modelo unisexo)
- Abastecimento durante a prova
- Kit reforço alimentar na chegada
- Medalha finisher
- Cronometragem em tempo real (acorrer.pt)

**Caminhada 5km:**
- Seguro desportivo opcional (+3€)
- Dorsal (sem chip)
- T-shirt técnica (modelo unisexo)
- Abastecimento durante a prova
- Kit reforço alimentar na chegada
- Medalha finisher

### 🏅 Premiação Completa

**Corrida - Geral Masculino e Feminino:**
- 1º, 2º e 3º: Troféu em acrílico

**Corrida - Escalões (M/F):**
- Sub23 (16-22 anos), Seniores (23-29), V30 (30-39), V40 (40-49), V50 (50-59), V60 (60+)
- Medalhas de classificação para os 3 primeiros de cada escalão

**Caminhada:**
- Sem classificação (percurso não competitivo)

### 📍 Informações Práticas

**Partida/Chegada:** Avenida Nossa Senhora do Castelo, junto à Praia de Mangualde (Live Beach)

**Secretariado:**
- **7 Março:** 15h00-18h00 (Câmara Municipal de Mangualde)
- **8 Março:** 08h00-09h00 (Praia de Mangualde - local de partida)

**Horários:**
- 09h30 - Concentração e aquecimento
- 10h00 - Partida da Corrida (10km)
- 10h15 - Partida da Caminhada (5km)
- 12h45 - Entrega de prémios (previsto)

**Percurso:**
- Início: Avenida Nossa Senhora do Castelo (cimo)
- Passa por: Rua 1º de Maio, Jardim do Rossio, Rua do Grémio, Rua Dr. Almeida, zona do Estádio, Rua Luís de Camões, Rua Tojal D'Anta
- Dificuldade: Média
- **Corrida:** 2 voltas ao circuito de 5km
- **Caminhada:** 1 volta ao circuito de 5km

**Balneários:**
- Duches disponíveis no Estádio de Mangualde após a prova

**Idade mínima:**
- Corrida: 16 anos (menores de 18: autorização obrigatória)
- Caminhada: 6 anos

**Inscrições encerram:** 2 Março 2026 às 23h59

**Organização:** 1ª Companhia de Guias de Mangualde + Câmara Municipal de Mangualde
**Contacto:** 965623098

**🎗️ Não te esqueças:** Traz um bem alimentar não perecível no dia da corrida!

Vem correr por uma causa em Mangualde! 🏃‍♀️❤️`,
      city: "Mangualde",
      metaTitle: "Corrida da Mulher 2026 - I Edição | Mangualde | 8 Março",
      metaDescription:
        "I Edição da Corrida da Mulher em Mangualde. Corrida 10km e Caminhada 5km. Evento solidário - 1€ para cadeiras de rodas. Praia de Mangualde, 8 Março 2026.",
    },
    en: {
      title: "Women's Race - 1st Edition 2026",
      description: `# 🏃‍♀️ Women's Race - 1st Edition

**1st Edition** of the Women's Race in Mangualde! A solidarity sports event celebrating women's sports and supporting the local community.

## 🏃 Two Events Available

**Race:** 10 km - Urban route through Mangualde city (2h30 limit)
**Walk:** 5 km - Half lap of the race route (2h limit)

## ❤️ Solidarity Aspect

**Participate and help!** Each registration contributes to a cause:
- **1€ from each registration** will be used to purchase wheelchair(s) for the Social and Cultural Center of Mangualde Parish
- **Bring non-perishable food** on race day - will be donated to the same institution

## ✨ Highlights

- **1st Edition** - Debut of an event dedicated to women athletes
- **Solidarity aspect** - Supports Mangualde local community
- **Solid organization** - 1st Mangualde Guide Company + City Council
- **Urban route** - Through Mangualde city streets
- **Mangualde Beach** - Start and finish at Live Beach
- **Finisher medals** - For all participants
- **Technical t-shirt** - Included in registration

## 🎯 What's Included

**10km Race:**
- Optional sports insurance (+3€)
- Race number with electronic timing chip
- Technical t-shirt (unisex model)
- Refreshments during race
- Recovery food kit at finish
- Finisher medal
- Real-time timing (acorrer.pt)

**5km Walk:**
- Optional sports insurance (+3€)
- Race number (no chip)
- Technical t-shirt (unisex model)
- Refreshments during walk
- Recovery food kit at finish
- Finisher medal

### 🏅 Complete Awards

**Race - General Men and Women:**
- 1st, 2nd and 3rd: Acrylic trophy

**Race - Categories (M/F):**
- Sub23 (16-22 years), Seniors (23-29), V30 (30-39), V40 (40-49), V50 (50-59), V60 (60+)
- Classification medals for top 3 in each category

**Walk:**
- No classification (non-competitive route)

### 📍 Practical Information

**Start/Finish:** Avenida Nossa Senhora do Castelo, near Mangualde Beach (Live Beach)

**Registration desk:**
- **March 7:** 3pm-6pm (Mangualde City Council)
- **March 8:** 8am-9am (Mangualde Beach - start location)

**Schedule:**
- 9:30am - Gathering and warm-up
- 10:00am - Race start (10km)
- 10:15am - Walk start (5km)
- 12:45pm - Awards ceremony (expected)

**Route:**
- Start: Avenida Nossa Senhora do Castelo (top)
- Through: Rua 1º de Maio, Jardim do Rossio, Rua do Grémio, Rua Dr. Almeida, Stadium area, Rua Luís de Camões, Rua Tojal D'Anta
- Difficulty: Medium
- **Race:** 2 laps of 5km circuit
- **Walk:** 1 lap of 5km circuit

**Changing rooms:**
- Showers available at Mangualde Stadium after race

**Minimum age:**
- Race: 16 years (under 18: authorization required)
- Walk: 6 years

**Registration closes:** March 2, 2026 at 11:59pm

**Organizer:** 1st Mangualde Guide Company + Mangualde City Council
**Contact:** 965623098

**🎗️ Don't forget:** Bring non-perishable food on race day!

Come run for a cause in Mangualde! 🏃‍♀️❤️`,
      city: "Mangualde",
      metaTitle: "Women's Race 2026 - 1st Edition | Mangualde | March 8",
      metaDescription:
        "1st Edition Women's Race in Mangualde. 10km Race and 5km Walk. Solidarity event - 1€ for wheelchairs. Mangualde Beach, March 8, 2026.",
    },
    es: {
      title: "Carrera de la Mujer - I Edición 2026",
      description: `# 🏃‍♀️ Carrera de la Mujer - I Edición

**I Edición** de la Carrera de la Mujer en Mangualde! Un evento deportivo solidario que celebra el deporte femenino y apoya a la comunidad local.

¡Ven a correr por una causa en Mangualde! 🏃‍♀️❤️`,
      city: "Mangualde",
      metaTitle: "Carrera de la Mujer 2026 - I Edición | Mangualde | 8 Marzo",
      metaDescription:
        "I Edición Carrera de la Mujer en Mangualde. Carrera 10km y Caminata 5km. Evento solidario - 1€ para sillas de ruedas. Playa de Mangualde, 8 Marzo 2026.",
    },
    fr: {
      title: "Course des Femmes - 1ère Édition 2026",
      description: `# 🏃‍♀️ Course des Femmes - 1ère Édition

**1ère Édition** de la Course des Femmes à Mangualde! Un événement sportif solidaire qui célèbre le sport féminin et soutient la communauté locale.

Venez courir pour une cause à Mangualde! 🏃‍♀️❤️`,
      city: "Mangualde",
      metaTitle: "Course des Femmes 2026 - 1ère Édition | Mangualde | 8 Mars",
      metaDescription:
        "1ère Édition Course des Femmes à Mangualde. Course 10km et Marche 5km. Événement solidaire - 1€ pour fauteuils roulants. Plage de Mangualde, 8 Mars 2026.",
    },
    de: {
      title: "Frauenlauf - 1. Ausgabe 2026",
      description: `# 🏃‍♀️ Frauenlauf - 1. Ausgabe

**1. Ausgabe** des Frauenlaufs in Mangualde! Eine solidarische Sportveranstaltung, die den Frauensport feiert und die lokale Gemeinschaft unterstützt.

Kommen Sie und laufen Sie für einen guten Zweck in Mangualde! 🏃‍♀️❤️`,
      city: "Mangualde",
      metaTitle: "Frauenlauf 2026 - 1. Ausgabe | Mangualde | 8. März",
      metaDescription:
        "1. Ausgabe Frauenlauf in Mangualde. Lauf 10km und Wanderung 5km. Solidaritätsveranstaltung - 1€ für Rollstühle. Mangualde Strand, 8. März 2026.",
    },
    it: {
      title: "Corsa delle Donne - I Edizione 2026",
      description: `# 🏃‍♀️ Corsa delle Donne - I Edizione

**I Edizione** della Corsa delle Donne a Mangualde! Un evento sportivo solidale che celebra lo sport femminile e sostiene la comunità locale.

Vieni a correre per una causa a Mangualde! 🏃‍♀️❤️`,
      city: "Mangualde",
      metaTitle: "Corsa delle Donne 2026 - I Edizione | Mangualde | 8 Marzo",
      metaDescription:
        "I Edizione Corsa delle Donne a Mangualde. Corsa 10km e Camminata 5km. Evento solidale - 1€ per sedie a rotelle. Spiaggia di Mangualde, 8 Marzo 2026.",
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

  const corridaVariant = await findOrCreateVariant({
    name: "Corrida",
    distanceKm: 10,
    elevationGainM: 150,
    elevationLossM: 150,
    startTime: "10:00",
    maxParticipants: 500,
    cutoffTimeHours: 2.5,
    atrpGrade: 1,
    mountainLevel: 1,
    price: 13.0,
    currency: Currency.EUR,
  });

  console.log(`✅ Variant created/updated: ${corridaVariant.name}`);

  const caminhadaVariant = await findOrCreateVariant({
    name: "Caminhada",
    distanceKm: 5,
    elevationGainM: 75,
    elevationLossM: 75,
    startTime: "10:15",
    maxParticipants: 300,
    cutoffTimeHours: 2.0,
    atrpGrade: 1,
    mountainLevel: 1,
    price: 8.0,
    currency: Currency.EUR,
  });

  console.log(`✅ Variant created/updated: ${caminhadaVariant.name}`);

  // 4. Upsert variant translations (6 languages each)
  const corridaTranslations = {
    pt: {
      name: "Corrida - 10km",
      description: `## 🏃‍♀️ Corrida - 10km

Percurso competitivo urbano pelas ruas de Mangualde. Duas voltas a um circuito de 5km.

### 📊 Características
- **Distância:** 10 km (2 voltas)
- **Desnível:** ±150m
- **Dificuldade:** Média
- **Tipo:** Corrida em estrada
- **Tempo Limite:** 2h30
- **Partida:** 10h00
- **Idade Mínima:** 16 anos

### 🏙️ Percurso Urbano
- **Início/Fim:** Avenida Nossa Senhora do Castelo (cimo)
- **Passa por:** Rua 1º de Maio, Jardim do Rossio (subida e descida), Rua do Grémio, Rua Dr. Almeida, Rua José Maria de Almeida, zona do Estádio, Rua Luís de Camões, Rua Tojal D'Anta
- **2 voltas** ao circuito de 5km
- Percurso devidamente sinalizado
- Staff e GNR a auxiliar nos cruzamentos

### 🏅 Classificação e Premiação

**Geral Masculino e Feminino:**
- 1º, 2º e 3º: Troféu em acrílico

**Escalões (Masculino e Feminino):**
- Sub23 (16-22 anos)
- Seniores (23-29 anos)
- V30 (30-39 anos)
- V40 (40-49 anos)
- V50 (50-59 anos)
- V60 (60+ anos)
- **Prémios:** Medalhas de classificação para os 3 primeiros de cada escalão

### ⏱️ Cronometragem
- Sistema eletrónico por chip (dorsal)
- Resultados em tempo real em acorrer.pt
- Tapete de leitura na meta

### 🍎 Abastecimentos
- Líquidos durante a prova
- Kit reforço alimentar na chegada

### ✔️ Inclui
- Dorsal com chip de cronometragem
- T-shirt técnica (modelo unisexo)
- Medalha finisher
- Abastecimento líquidos
- Kit reforço alimentar
- Seguro desportivo opcional (+3€)

### ❤️ Componente Solidária
- **1€ da tua inscrição** será usado para adquirir cadeira(s) de rodas
- **Traz um bem alimentar** não perecível no dia da corrida

**Nota:** Menores de 18 anos necessitam de autorização do encarregado de educação (termo de responsabilidade).`,
    },
    en: {
      name: "Race - 10km",
      description: `## 🏃‍♀️ Race - 10km

Competitive urban route through Mangualde streets. Two laps of a 5km circuit.

### 📊 Characteristics
- **Distance:** 10 km (2 laps)
- **Elevation:** ±150m
- **Difficulty:** Medium
- **Type:** Road race
- **Time Limit:** 2h30
- **Start:** 10:00am
- **Minimum Age:** 16 years

### 🏙️ Urban Route
- **Start/Finish:** Avenida Nossa Senhora do Castelo (top)
- **Through:** Rua 1º de Maio, Jardim do Rossio (up and down), Rua do Grémio, Rua Dr. Almeida, Rua José Maria de Almeida, Stadium area, Rua Luís de Camões, Rua Tojal D'Anta
- **2 laps** of 5km circuit
- Properly marked route
- Staff and police assisting at crossings

### 🏅 Classification and Awards

**General Men and Women:**
- 1st, 2nd and 3rd: Acrylic trophy

**Categories (Men and Women):**
- Sub23 (16-22 years)
- Seniors (23-29 years)
- V30 (30-39 years)
- V40 (40-49 years)
- V50 (50-59 years)
- V60 (60+ years)
- **Awards:** Classification medals for top 3 in each category

### ⏱️ Timing
- Electronic chip system (bib)
- Real-time results at acorrer.pt
- Reading mat at finish

### 🍎 Refreshments
- Liquids during race
- Recovery food kit at finish

### ✔️ Includes
- Race number with timing chip
- Technical t-shirt (unisex model)
- Finisher medal
- Liquid refreshments
- Recovery food kit
- Optional sports insurance (+3€)

### ❤️ Solidarity Component
- **1€ from your registration** will be used to purchase wheelchair(s)
- **Bring non-perishable food** on race day

**Note:** Under 18 requires parental authorization (liability form).`,
    },
    es: {
      name: "Carrera - 10km",
      description: `## 🏃‍♀️ Carrera - 10km

Recorrido competitivo urbano por las calles de Mangualde. Dos vueltas a un circuito de 5km.`,
    },
    fr: {
      name: "Course - 10km",
      description: `## 🏃‍♀️ Course - 10km

Parcours compétitif urbain à travers les rues de Mangualde. Deux tours d'un circuit de 5km.`,
    },
    de: {
      name: "Lauf - 10km",
      description: `## 🏃‍♀️ Lauf - 10km

Wettkampfstrecke durch die Straßen von Mangualde. Zwei Runden eines 5km-Rundkurses.`,
    },
    it: {
      name: "Corsa - 10km",
      description: `## 🏃‍♀️ Corsa - 10km

Percorso competitivo urbano attraverso le strade di Mangualde. Due giri di un circuito di 5km.`,
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: corridaVariant.id,
          language: Language[lang],
        },
      },
      update: corridaTranslations[lang],
      create: {
        variantId: corridaVariant.id,
        language: Language[lang],
        ...corridaTranslations[lang],
      },
    });
  }

  console.log("✅ Corrida variant translations created/updated (6 languages)");

  const caminhadaTranslations = {
    pt: {
      name: "Caminhada - 5km",
      description: `## 🚶‍♀️ Caminhada - 5km

Percurso não competitivo pelas ruas de Mangualde. Uma volta ao circuito de 5km (metade do percurso da corrida).

### 📊 Características
- **Distância:** 5 km (1 volta)
- **Desnível:** ±75m
- **Dificuldade:** Baixa
- **Tipo:** Caminhada urbana
- **Tempo Limite:** 2h00
- **Partida:** 10h15
- **Idade Mínima:** 6 anos

### 🏙️ Percurso Urbano
- **Início/Fim:** Avenida Nossa Senhora do Castelo
- **Igual à corrida** mas apenas 1 volta
- Percurso acessível e bem sinalizado
- Ideal para famílias e todas as idades

### ℹ️ Informações
- **Sem cronometragem** (percurso não competitivo)
- Sem classificações
- Ambiente descontraído e convivial
- Staff de apoio ao longo do percurso

### 🍎 Abastecimentos
- Líquidos durante a caminhada
- Kit reforço alimentar na chegada

### ✔️ Inclui
- Dorsal (sem chip)
- T-shirt técnica (modelo unisexo)
- Medalha finisher
- Abastecimento líquidos
- Kit reforço alimentar
- Seguro desportivo opcional (+3€)

### ❤️ Componente Solidária
- **1€ da tua inscrição** será usado para adquirir cadeira(s) de rodas
- **Traz um bem alimentar** não perecível no dia da corrida

### 👨‍👩‍👧‍👦 Ideal Para Famílias
- Idade mínima: 6 anos
- Menores acompanhados por adultos não necessitam autorização escrita
- Percurso seguro e acessível
- Ambiente familiar e inclusivo`,
    },
    en: {
      name: "Walk - 5km",
      description: `## 🚶‍♀️ Walk - 5km

Non-competitive route through Mangualde streets. One lap of the 5km circuit (half of the race route).

### 📊 Characteristics
- **Distance:** 5 km (1 lap)
- **Elevation:** ±75m
- **Difficulty:** Low
- **Type:** Urban walk
- **Time Limit:** 2h00
- **Start:** 10:15am
- **Minimum Age:** 6 years

### 🏙️ Urban Route
- **Start/Finish:** Avenida Nossa Senhora do Castelo
- **Same as race** but only 1 lap
- Accessible and well-marked route
- Ideal for families and all ages

### ℹ️ Information
- **No timing** (non-competitive route)
- No classifications
- Relaxed and friendly atmosphere
- Support staff along the route

### 🍎 Refreshments
- Liquids during walk
- Recovery food kit at finish

### ✔️ Includes
- Race number (no chip)
- Technical t-shirt (unisex model)
- Finisher medal
- Liquid refreshments
- Recovery food kit
- Optional sports insurance (+3€)

### ❤️ Solidarity Component
- **1€ from your registration** will be used to purchase wheelchair(s)
- **Bring non-perishable food** on race day

### 👨‍👩‍👧‍👦 Ideal For Families
- Minimum age: 6 years
- Minors accompanied by adults don't need written authorization
- Safe and accessible route
- Family-friendly and inclusive atmosphere`,
    },
    es: {
      name: "Caminata - 5km",
      description: `## 🚶‍♀️ Caminata - 5km

Recorrido no competitivo por las calles de Mangualde. Una vuelta al circuito de 5km (mitad del recorrido de la carrera).`,
    },
    fr: {
      name: "Marche - 5km",
      description: `## 🚶‍♀️ Marche - 5km

Parcours non compétitif à travers les rues de Mangualde. Un tour du circuit de 5km (moitié du parcours de la course).`,
    },
    de: {
      name: "Wanderung - 5km",
      description: `## 🚶‍♀️ Wanderung - 5km

Nicht-wettbewerbsorientierte Strecke durch die Straßen von Mangualde. Eine Runde des 5km-Rundkurses (Hälfte der Laufstrecke).`,
    },
    it: {
      name: "Camminata - 5km",
      description: `## 🚶‍♀️ Camminata - 5km

Percorso non competitivo attraverso le strade di Mangualde. Un giro del circuito di 5km (metà del percorso della corsa).`,
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: caminhadaVariant.id,
          language: Language[lang],
        },
      },
      update: caminhadaTranslations[lang],
      create: {
        variantId: caminhadaVariant.id,
        language: Language[lang],
        ...caminhadaTranslations[lang],
      },
    });
  }

  console.log(
    "✅ Caminhada variant translations created/updated (6 languages)"
  );

  // 5. Upsert pricing phases (linked to eventId, NOT variantId)
  const findOrCreatePricingPhase = async (
    name: string,
    data: {
      startDate: Date;
      endDate: Date;
      price: number;
      currency: Currency;
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

  // Preços únicos (sem fases)
  await findOrCreatePricingPhase("Corrida 10km", {
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    endDate: new Date("2026-03-02T23:59:00.000Z"),
    price: 13.0,
    currency: Currency.EUR,
    note: "Inscrições até 2 de março às 23h59",
  });

  await findOrCreatePricingPhase("Caminhada 5km", {
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    endDate: new Date("2026-03-02T23:59:00.000Z"),
    price: 8.0,
    currency: Currency.EUR,
    note: "Inscrições até 2 de março às 23h59",
  });

  // Seguro opcional
  await findOrCreatePricingPhase("Seguro Desportivo (opcional)", {
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    endDate: new Date("2026-03-02T23:59:00.000Z"),
    price: 3.0,
    currency: Currency.EUR,
    note: "Seguro de acidentes pessoais opcional (não inclui responsabilidade civil)",
  });

  console.log("✅ Pricing phases created/updated");

  // 6. FAQs (optional but good for SEO)
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
    "Qual é a componente solidária do evento?",
    "1€ de cada inscrição será usado para adquirir cadeira(s) de rodas para o Centro Social e Cultural da Paróquia de Mangualde. Além disso, cada participante deve trazer (voluntariamente) um bem alimentar não perecível no dia da corrida, que será doado à mesma instituição."
  );

  const faq1Translations = {
    pt: {
      question: "Qual é a componente solidária do evento?",
      answer:
        "1€ de cada inscrição será usado para adquirir cadeira(s) de rodas para o Centro Social e Cultural da Paróquia de Mangualde. Além disso, cada participante deve trazer (voluntariamente) um bem alimentar não perecível no dia da corrida, que será doado à mesma instituição.",
    },
    en: {
      question: "What is the solidarity component of the event?",
      answer:
        "1€ from each registration will be used to purchase wheelchair(s) for the Social and Cultural Center of Mangualde Parish. Additionally, each participant should voluntarily bring non-perishable food on race day, which will be donated to the same institution.",
    },
    es: {
      question: "¿Cuál es el componente solidario del evento?",
      answer:
        "1€ de cada inscripción se utilizará para adquirir silla(s) de ruedas para el Centro Social y Cultural de la Parroquia de Mangualde. Además, cada participante debe traer (voluntariamente) un alimento no perecedero el día de la carrera, que será donado a la misma institución.",
    },
    fr: {
      question: "Quelle est la composante solidaire de l'événement?",
      answer:
        "1€ de chaque inscription sera utilisé pour acheter fauteuil(s) roulant(s) pour le Centre Social et Culturel de la Paroisse de Mangualde. De plus, chaque participant doit apporter (volontairement) un aliment non périssable le jour de la course, qui sera donné à la même institution.",
    },
    de: {
      question: "Was ist die Solidaritätskomponente der Veranstaltung?",
      answer:
        "1€ von jeder Anmeldung wird verwendet, um Rollstuhl/Rollstühle für das Sozial- und Kulturzentrum der Pfarrei Mangualde zu kaufen. Darüber hinaus sollte jeder Teilnehmer (freiwillig) am Renntag haltbare Lebensmittel mitbringen, die der gleichen Institution gespendet werden.",
    },
    it: {
      question: "Qual è la componente solidale dell'evento?",
      answer:
        "1€ da ogni iscrizione sarà utilizzato per acquistare sedia/sedie a rotelle per il Centro Sociale e Culturale della Parrocchia di Mangualde. Inoltre, ogni partecipante dovrebbe portare (volontariamente) cibo non deperibile il giorno della gara, che sarà donato alla stessa istituzione.",
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
    "Qual é a idade mínima para participar?",
    "Corrida 10km: 16 anos (menores de 18 anos necessitam de termo de responsabilidade assinado pelo encarregado de educação). Caminhada 5km: 6 anos (menores acompanhados por adultos não necessitam autorização escrita)."
  );

  const faq2Translations = {
    pt: {
      question: "Qual é a idade mínima para participar?",
      answer:
        "Corrida 10km: 16 anos (menores de 18 anos necessitam de termo de responsabilidade assinado pelo encarregado de educação). Caminhada 5km: 6 anos (menores acompanhados por adultos não necessitam autorização escrita).",
    },
    en: {
      question: "What is the minimum age to participate?",
      answer:
        "10km Race: 16 years (under 18 requires liability form signed by legal guardian). 5km Walk: 6 years (minors accompanied by adults don't need written authorization).",
    },
    es: {
      question: "¿Cuál es la edad mínima para participar?",
      answer:
        "Carrera 10km: 16 años (menores de 18 necesitan término de responsabilidad firmado por el tutor). Caminata 5km: 6 años (menores acompañados por adultos no necesitan autorización escrita).",
    },
    fr: {
      question: "Quel est l'âge minimum pour participer?",
      answer:
        "Course 10km: 16 ans (moins de 18 nécessite formulaire de responsabilité signé par le tuteur légal). Marche 5km: 6 ans (mineurs accompagnés d'adultes n'ont pas besoin d'autorisation écrite).",
    },
    de: {
      question: "Was ist das Mindestalter zur Teilnahme?",
      answer:
        "Lauf 10km: 16 Jahre (unter 18 erfordert Haftungsformular unterzeichnet vom Erziehungsberechtigten). Wanderung 5km: 6 Jahre (Minderjährige in Begleitung von Erwachsenen benötigen keine schriftliche Genehmigung).",
    },
    it: {
      question: "Qual è l'età minima per partecipare?",
      answer:
        "Corsa 10km: 16 anni (minori di 18 necessitano modulo di responsabilità firmato dal tutore legale). Camminata 5km: 6 anni (minori accompagnati da adulti non necessitano autorizzazione scritta).",
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

  const faq3 = await findOrCreateFAQ(
    event.id,
    2,
    "O que está incluído na inscrição?",
    "Dorsal (com chip para corrida), T-shirt técnica unisexo, medalha finisher, abastecimento líquidos durante a prova, kit reforço alimentar na chegada. O seguro desportivo é opcional (+3€). Também há duches disponíveis no Estádio de Mangualde após a prova."
  );

  const faq3Translations = {
    pt: {
      question: "O que está incluído na inscrição?",
      answer:
        "Dorsal (com chip para corrida), T-shirt técnica unisexo, medalha finisher, abastecimento líquidos durante a prova, kit reforço alimentar na chegada. O seguro desportivo é opcional (+3€). Também há duches disponíveis no Estádio de Mangualde após a prova.",
    },
    en: {
      question: "What is included in the registration?",
      answer:
        "Race number (with chip for race), unisex technical t-shirt, finisher medal, liquid refreshments during race, recovery food kit at finish. Sports insurance is optional (+3€). Showers are also available at Mangualde Stadium after the race.",
    },
    es: {
      question: "¿Qué está incluido en la inscripción?",
      answer:
        "Dorsal (con chip para carrera), camiseta técnica unisex, medalla finisher, abastecimiento de líquidos durante la carrera, kit de alimentación en la llegada. El seguro deportivo es opcional (+3€). También hay duchas disponibles en el Estadio de Mangualde después de la carrera.",
    },
    fr: {
      question: "Qu'est-ce qui est inclus dans l'inscription?",
      answer:
        "Dossard (avec puce pour la course), t-shirt technique unisexe, médaille finisher, ravitaillement liquide pendant la course, kit alimentaire à l'arrivée. L'assurance sportive est optionnelle (+3€). Des douches sont également disponibles au Stade de Mangualde après la course.",
    },
    de: {
      question: "Was ist in der Anmeldung enthalten?",
      answer:
        "Startnummer (mit Chip für Lauf), Unisex-Funktionsshirt, Finisher-Medaille, Flüssigkeitsverpflegung während des Rennens, Verpflegungskit im Ziel. Sportversicherung ist optional (+3€). Duschen sind auch im Mangualde-Stadion nach dem Rennen verfügbar.",
    },
    it: {
      question: "Cosa è incluso nell'iscrizione?",
      answer:
        "Pettorale (con chip per corsa), t-shirt tecnica unisex, medaglia finisher, rifornimento liquidi durante la gara, kit alimentare all'arrivo. L'assicurazione sportiva è opzionale (+3€). Sono disponibili anche docce allo Stadio di Mangualde dopo la gara.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: {
        faqId_language: {
          faqId: faq3.id,
          language: Language[lang],
        },
      },
      update: faq3Translations[lang],
      create: {
        faqId: faq3.id,
        language: Language[lang],
        ...faq3Translations[lang],
      },
    });
  }

  console.log("✅ FAQs created/updated (3 FAQs with 6 languages each)");

  console.log(
    "\n🎉 Corrida da Mulher - I Edição 2026 seed completed successfully!"
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
