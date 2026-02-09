import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding 5º Trail Valezim Aldeia Desporto 2026...");

  // 1. Upsert event (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: "5o-trail-valezim-aldeia-desporto-2026" },
    update: {
      title: "5º Trail Valezim Aldeia Desporto 2026",
      description: "Trail Running nas encostas da Serra da Estrela - 5ª Edição",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-02-08T09:30:00.000Z"),
      endDate: new Date("2026-02-08T14:00:00.000Z"),
      city: "Valezim",
      country: "Portugal",
      latitude: 40.359478,
      longitude: -7.72074,
      googleMapsUrl: "https://maps.google.com/?q=40.359478,-7.720740",
      externalUrl: "https://acorrer.pt",
      imageUrl: "",
      isFeatured: false,
    },
    create: {
      slug: "5o-trail-valezim-aldeia-desporto-2026",
      title: "5º Trail Valezim Aldeia Desporto 2026",
      description: "Trail Running nas encostas da Serra da Estrela - 5ª Edição",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-02-08T09:30:00.000Z"),
      endDate: new Date("2026-02-08T14:00:00.000Z"),
      city: "Valezim",
      country: "Portugal",
      latitude: 40.359478,
      longitude: -7.72074,
      googleMapsUrl: "https://maps.google.com/?q=40.359478,-7.720740",
      externalUrl: "https://acorrer.pt",
      imageUrl: "",
      isFeatured: false,
    },
  });

  console.log(`✅ Event created/updated: ${event.slug}`);

  // 2. Upsert event translations separately (ALL 6 LANGUAGES)
  const eventTranslations = {
    pt: {
      title: "5º Trail Valezim Aldeia Desporto 2026",
      description: `# 🏔️ 5º Trail Valezim Aldeia Desporto

**5ª Edição** do Trail Valezim nas encostas da **Serra da Estrela**! Vem descobrir os trilhos históricos de uma das aldeias mais autênticas da Guarda.

## 🏃 Três Percursos Disponíveis

**Trail Curto:** 18 km | 1200m D+ - Para os mais exigentes
**Mini Trail:** 10 km | 700m D+ - Ideal para começar em trail
**Caminhada Guiada:** 10 km | 700m D+ - Lazer e convívio (idade mínima 8 anos)

## ✨ Destaques

- **Serra da Estrela** - trilhos autênticos numa das encostas mais bonitas
- **Aldeia histórica** - descobre Valezim e o seu património
- **Organização familiar** - evento da Associação Vallecinus Cultura e Desporto
- **Refeição opcional** - almoço convívio após as provas (+6€)
- **Vagas limitadas** - Trail Curto + Mini Trail: 500 participantes | Caminhada: 100 participantes

## 🎯 O Que Está Incluído

- Seguro desportivo de acidentes pessoais
- Dorsal de prova
- KIT de participante
- Medalha de participação
- Abastecimentos sólidos e líquidos durante o percurso
- Acesso a balneários com banho quente (a partir das 10h00)
- Sinalização de percurso e pontos de controlo
- Cronometragem e classificação oficial

### 🏅 Premiação Completa

**Escalões premiados** (Trail Curto e Mini Trail):
- Geral Masculino e Feminino
- Sub23, Seniores, M/F30, M/F40, M/F50, M/F60

**Prémios especiais:**
- Equipa mais numerosa
- Atleta mais jovem
- Atleta mais velho

### 📋 Equipamento Obrigatório

**Trail Curto:**
- Calçado adequado
- Telemóvel + Apito
- Manta de sobrevivência
- Reservatório de água (mínimo 0,5L)
- Impermeável / Corta Vento

**Mini Trail:**
- Calçado adequado
- Telemóvel + Apito
- Reservatório de água (mínimo 0,5L)

**Caminhada:**
- Calçado adequado
- Telemóvel

### 📍 Informações Práticas

**Partida/Chegada:** Terreiro de D. Luzia, Valezim
**Secretariado:** Clube Recreativo e Educativo Valezinense
**Balneários:** Largo da Nossa Senhora da Saúde, Valezim

**Horários de Partida:**
- 09h30 - Trail Curto
- 09h45 - Mini Trail + Caminhada Guiada

**Idade mínima:** 16 anos (trail) | 8 anos (caminhada)
Menores de 18 anos: autorização obrigatória do encarregado de educação

**Organização:** Associação Vallecinus Cultura e Desporto (AVACD)

Vem correr na Serra da Estrela! ⛰️🏃‍♀️`,
      city: "Valezim",
      metaTitle: "5º Trail Valezim Aldeia Desporto 2026 | Guarda | 8 Fevereiro",
      metaDescription:
        "5º Trail Valezim nas encostas da Serra da Estrela. Trail Curto 18km (1200m D+), Mini Trail 10km (700m D+), Caminhada 10km. Vagas limitadas. Valezim, 8 Fevereiro 2026.",
    },
    en: {
      title: "5th Trail Valezim Aldeia Desporto 2026",
      description: `# 🏔️ 5th Trail Valezim Aldeia Desporto

**5th Edition** of the Valezim Trail on the slopes of **Serra da Estrela**! Come discover the historic trails of one of Guarda's most authentic villages.

## 🏃 Three Routes Available

**Short Trail:** 18 km | 1200m D+ - For the most demanding
**Mini Trail:** 10 km | 700m D+ - Ideal for trail beginners
**Guided Walk:** 10 km | 700m D+ - Leisure and fellowship (minimum age 8)

## ✨ Highlights

- **Serra da Estrela** - authentic trails on one of the most beautiful slopes
- **Historic village** - discover Valezim and its heritage
- **Family organization** - event by Vallecinus Culture and Sports Association
- **Optional meal** - fellowship lunch after races (+6€)
- **Limited spots** - Short Trail + Mini Trail: 500 participants | Walk: 100 participants

## 🎯 What's Included

- Sports accident insurance
- Race number
- Participant KIT
- Participation medal
- Solid and liquid refreshments during the course
- Access to changing rooms with hot shower (from 10am)
- Course marking and checkpoints
- Official timing and ranking

### 🏅 Complete Awards

**Awarded categories** (Short Trail and Mini Trail):
- General Men and Women
- Sub23, Seniors, M/F30, M/F40, M/F50, M/F60

**Special prizes:**
- Largest team
- Youngest athlete
- Oldest athlete

### 📋 Mandatory Equipment

**Short Trail:**
- Suitable footwear
- Mobile phone + Whistle
- Survival blanket
- Water reservoir (minimum 0.5L)
- Waterproof / Windbreaker

**Mini Trail:**
- Suitable footwear
- Mobile phone + Whistle
- Water reservoir (minimum 0.5L)

**Walk:**
- Suitable footwear
- Mobile phone

### 📍 Practical Information

**Start/Finish:** Terreiro de D. Luzia, Valezim
**Registration:** Clube Recreativo e Educativo Valezinense
**Changing rooms:** Largo da Nossa Senhora da Saúde, Valezim

**Start Times:**
- 09:30am - Short Trail
- 09:45am - Mini Trail + Guided Walk

**Minimum age:** 16 years (trail) | 8 years (walk)
Under 18: parental authorization required

**Organizer:** Vallecinus Culture and Sports Association (AVACD)

Come run in Serra da Estrela! ⛰️🏃‍♀️`,
      city: "Valezim",
      metaTitle: "5th Trail Valezim Aldeia Desporto 2026 | Guarda | Feb 8",
      metaDescription:
        "5th Trail Valezim on Serra da Estrela slopes. Short Trail 18km (1200m D+), Mini Trail 10km (700m D+), Walk 10km. Limited spots. Valezim, February 8, 2026.",
    },
    es: {
      title: "5º Trail Valezim Aldeia Desporto 2026",
      description: `# 🏔️ 5º Trail Valezim Aldeia Desporto

**5ª Edición** del Trail Valezim en las laderas de la **Serra da Estrela**! Descubre los senderos históricos de uno de los pueblos más auténticos de Guarda.

## 🏃 Tres Recorridos Disponibles

**Trail Corto:** 18 km | 1200m D+ - Para los más exigentes
**Mini Trail:** 10 km | 700m D+ - Ideal para comenzar en trail
**Caminata Guiada:** 10 km | 700m D+ - Ocio y convivencia (edad mínima 8 años)

Come run in Serra da Estrela! ⛰️🏃‍♀️`,
      city: "Valezim",
      metaTitle: "5º Trail Valezim Aldeia Desporto 2026 | Guarda | 8 Febrero",
      metaDescription:
        "5º Trail Valezim en las laderas de Serra da Estrela. Trail Corto 18km (1200m D+), Mini Trail 10km (700m D+), Caminata 10km. Plazas limitadas. Valezim, 8 Febrero 2026.",
    },
    fr: {
      title: "5ème Trail Valezim Aldeia Desporto 2026",
      description: `# 🏔️ 5ème Trail Valezim Aldeia Desporto

**5ème Édition** du Trail Valezim sur les pentes de la **Serra da Estrela**! Venez découvrir les sentiers historiques de l'un des villages les plus authentiques de Guarda.

Venez courir dans la Serra da Estrela! ⛰️🏃‍♀️`,
      city: "Valezim",
      metaTitle: "5ème Trail Valezim Aldeia Desporto 2026 | Guarda | 8 Février",
      metaDescription:
        "5ème Trail Valezim sur les pentes de Serra da Estrela. Trail Court 18km (1200m D+), Mini Trail 10km (700m D+), Marche 10km. Places limitées. Valezim, 8 Février 2026.",
    },
    de: {
      title: "5. Trail Valezim Aldeia Desporto 2026",
      description: `# 🏔️ 5. Trail Valezim Aldeia Desporto

**5. Ausgabe** des Trail Valezim an den Hängen der **Serra da Estrela**! Entdecken Sie die historischen Trails eines der authentischsten Dörfer der Guarda.

Kommen Sie und laufen Sie in der Serra da Estrela! ⛰️🏃‍♀️`,
      city: "Valezim",
      metaTitle: "5. Trail Valezim Aldeia Desporto 2026 | Guarda | 8. Februar",
      metaDescription:
        "5. Trail Valezim an den Hängen der Serra da Estrela. Kurzer Trail 18km (1200 Hm), Mini Trail 10km (700 Hm), Wanderung 10km. Begrenzte Plätze. Valezim, 8. Februar 2026.",
    },
    it: {
      title: "5º Trail Valezim Aldeia Desporto 2026",
      description: `# 🏔️ 5º Trail Valezim Aldeia Desporto

**5ª Edizione** del Trail Valezim sulle pendici della **Serra da Estrela**! Vieni a scoprire i sentieri storici di uno dei villaggi più autentici di Guarda.

Vieni a correre nella Serra da Estrela! ⛰️🏃‍♀️`,
      city: "Valezim",
      metaTitle: "5º Trail Valezim Aldeia Desporto 2026 | Guarda | 8 Febbraio",
      metaDescription:
        "5º Trail Valezim sulle pendici della Serra da Estrela. Trail Corto 18km (1200m D+), Mini Trail 10km (700m D+), Camminata 10km. Posti limitati. Valezim, 8 Febbraio 2026.",
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

  const trailCurtoVariant = await findOrCreateVariant({
    name: "Trail Curto",
    distanceKm: 18,
    elevationGainM: 1200,
    elevationLossM: 1200,
    startTime: "09:30",
    maxParticipants: 214,
    cutoffTimeHours: 4.0,
    atrpGrade: 3,
    mountainLevel: 3,
    price: 14.0,
    currency: Currency.EUR,
  });

  console.log(`✅ Variant created/updated: ${trailCurtoVariant.name}`);

  const miniTrailVariant = await findOrCreateVariant({
    name: "Mini Trail",
    distanceKm: 10,
    elevationGainM: 700,
    elevationLossM: 700,
    startTime: "09:45",
    maxParticipants: 202,
    cutoffTimeHours: 3.0,
    atrpGrade: 2,
    mountainLevel: 2,
    price: 12.0,
    currency: Currency.EUR,
  });

  console.log(`✅ Variant created/updated: ${miniTrailVariant.name}`);

  const caminhadaVariant = await findOrCreateVariant({
    name: "Caminhada Guiada",
    distanceKm: 10,
    elevationGainM: 700,
    elevationLossM: 700,
    startTime: "09:45",
    maxParticipants: 93,
    cutoffTimeHours: 4.0,
    atrpGrade: 1,
    mountainLevel: 1,
    price: 7.0,
    currency: Currency.EUR,
  });

  console.log(`✅ Variant created/updated: ${caminhadaVariant.name}`);

  // 4. Upsert variant translations (6 languages each)
  const trailCurtoTranslations = {
    pt: {
      name: "Trail Curto - 18km",
      description: `## 🏔️ Trail Curto - 18km | 1200m D+

O percurso mais exigente do evento! Para trail runners experientes que procuram desafio nas encostas da Serra da Estrela.

### 📊 Características
- **Distância:** 18 km
- **Desnível Positivo:** 1200m D+
- **Dificuldade Técnica:** Média/Alta
- **Dificuldade Física:** Alta
- **Tempo Estimado:** 2h30 - 4h00
- **Partida:** 09h30
- **Idade Mínima:** 16 anos

### ⚙️ Equipamento Obrigatório
- Calçado adequado trail running
- Telemóvel + Apito
- Manta de sobrevivência
- Reservatório de água (mínimo 0,5L)
- Impermeável / Corta Vento

### 🏅 Escalões Premiados
- Geral M/F
- Sub23 M/F (até 22 anos)
- Seniores M/F (23-29 anos)
- M/F30, M/F40, M/F50, M/F60

**Nota:** Menores de 18 anos necessitam de autorização escrita do encarregado de educação.`,
    },
    en: {
      name: "Short Trail - 18km",
      description: `## 🏔️ Short Trail - 18km | 1200m D+

The most demanding route of the event! For experienced trail runners seeking challenge on the slopes of Serra da Estrela.

### 📊 Characteristics
- **Distance:** 18 km
- **Elevation Gain:** 1200m D+
- **Technical Difficulty:** Medium/High
- **Physical Difficulty:** High
- **Estimated Time:** 2h30 - 4h00
- **Start:** 09:30am
- **Minimum Age:** 16 years

### ⚙️ Mandatory Equipment
- Suitable trail running shoes
- Mobile phone + Whistle
- Survival blanket
- Water reservoir (minimum 0.5L)
- Waterproof / Windbreaker

### 🏅 Awarded Categories
- General M/F
- Sub23 M/F (up to 22 years)
- Seniors M/F (23-29 years)
- M/F30, M/F40, M/F50, M/F60

**Note:** Under 18 requires written parental authorization.`,
    },
    es: {
      name: "Trail Corto - 18km",
      description: `## 🏔️ Trail Corto - 18km | 1200m D+

¡El recorrido más exigente del evento! Para trail runners experimentados que buscan desafío en las laderas de la Serra da Estrela.`,
    },
    fr: {
      name: "Trail Court - 18km",
      description: `## 🏔️ Trail Court - 18km | 1200m D+

Le parcours le plus exigeant de l'événement! Pour les trail runners expérimentés à la recherche de défi sur les pentes de la Serra da Estrela.`,
    },
    de: {
      name: "Kurzer Trail - 18km",
      description: `## 🏔️ Kurzer Trail - 18km | 1200m D+

Die anspruchsvollste Strecke der Veranstaltung! Für erfahrene Trail Runner, die Herausforderungen an den Hängen der Serra da Estrela suchen.`,
    },
    it: {
      name: "Trail Corto - 18km",
      description: `## 🏔️ Trail Corto - 18km | 1200m D+

Il percorso più impegnativo dell'evento! Per trail runner esperti che cercano sfida sulle pendici della Serra da Estrela.`,
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: trailCurtoVariant.id,
          language: Language[lang],
        },
      },
      update: trailCurtoTranslations[lang],
      create: {
        variantId: trailCurtoVariant.id,
        language: Language[lang],
        ...trailCurtoTranslations[lang],
      },
    });
  }

  console.log(
    "✅ Trail Curto variant translations created/updated (6 languages)"
  );

  const miniTrailTranslations = {
    pt: {
      name: "Mini Trail - 10km",
      description: `## 🏃 Mini Trail - 10km | 700m D+

Percurso ideal para quem se quer iniciar em trail running ou procura uma distância mais acessível nas encostas da Serra da Estrela.

### 📊 Características
- **Distância:** 10 km
- **Desnível Positivo:** 700m D+
- **Dificuldade Técnica:** Média
- **Dificuldade Física:** Média
- **Tempo Estimado:** 1h30 - 2h30
- **Partida:** 09h45
- **Idade Mínima:** 16 anos

### ⚙️ Equipamento Obrigatório
- Calçado adequado trail running
- Telemóvel + Apito
- Reservatório de água (mínimo 0,5L)

### 🏅 Escalões Premiados
- Geral M/F
- Sub23 M/F (até 22 anos)
- Seniores M/F (23-29 anos)
- M/F30, M/F40, M/F50, M/F60

**Nota:** Menores de 18 anos necessitam de autorização escrita do encarregado de educação.`,
    },
    en: {
      name: "Mini Trail - 10km",
      description: `## 🏃 Mini Trail - 10km | 700m D+

Ideal route for those starting in trail running or seeking a more accessible distance on the slopes of Serra da Estrela.

### 📊 Characteristics
- **Distance:** 10 km
- **Elevation Gain:** 700m D+
- **Technical Difficulty:** Medium
- **Physical Difficulty:** Medium
- **Estimated Time:** 1h30 - 2h30
- **Start:** 09:45am
- **Minimum Age:** 16 years

### ⚙️ Mandatory Equipment
- Suitable trail running shoes
- Mobile phone + Whistle
- Water reservoir (minimum 0.5L)

### 🏅 Awarded Categories
- General M/F
- Sub23 M/F (up to 22 years)
- Seniors M/F (23-29 years)
- M/F30, M/F40, M/F50, M/F60

**Note:** Under 18 requires written parental authorization.`,
    },
    es: {
      name: "Mini Trail - 10km",
      description: `## 🏃 Mini Trail - 10km | 700m D+

Recorrido ideal para quienes quieren iniciarse en trail running o buscan una distancia más accesible en las laderas de la Serra da Estrela.`,
    },
    fr: {
      name: "Mini Trail - 10km",
      description: `## 🏃 Mini Trail - 10km | 700m D+

Parcours idéal pour ceux qui veulent débuter en trail running ou cherchent une distance plus accessible sur les pentes de la Serra da Estrela.`,
    },
    de: {
      name: "Mini Trail - 10km",
      description: `## 🏃 Mini Trail - 10km | 700m D+

Ideale Strecke für diejenigen, die mit Trail Running beginnen oder eine zugänglichere Distanz an den Hängen der Serra da Estrela suchen.`,
    },
    it: {
      name: "Mini Trail - 10km",
      description: `## 🏃 Mini Trail - 10km | 700m D+

Percorso ideale per chi vuole iniziare nel trail running o cerca una distanza più accessibile sulle pendici della Serra da Estrela.`,
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: miniTrailVariant.id,
          language: Language[lang],
        },
      },
      update: miniTrailTranslations[lang],
      create: {
        variantId: miniTrailVariant.id,
        language: Language[lang],
        ...miniTrailTranslations[lang],
      },
    });
  }

  console.log(
    "✅ Mini Trail variant translations created/updated (6 languages)"
  );

  const caminhadaTranslations = {
    pt: {
      name: "Caminhada Guiada - 10km",
      description: `## 🚶 Caminhada Guiada - 10km | 700m D+

Percurso de lazer guiado pelas encostas da Serra da Estrela. Ideal para famílias e quem procura descobrir a região num ambiente descontraído.

### 📊 Características
- **Distância:** 10 km
- **Desnível Positivo:** 700m D+
- **Dificuldade:** Baixa
- **Tipo:** Caminhada guiada
- **Tempo Estimado:** 3h00 - 4h00
- **Partida:** 09h45
- **Idade Mínima:** 8 anos

### ⚙️ Equipamento Obrigatório
- Calçado adequado para caminhada
- Telemóvel

### ℹ️ Informações
- Percurso não competitivo
- Guia acompanha o grupo
- Ritmo adaptado ao grupo
- Sem classificação final
- Ideal para famílias

**Nota:** Menores de 18 anos necessitam de autorização escrita do encarregado de educação.`,
    },
    en: {
      name: "Guided Walk - 10km",
      description: `## 🚶 Guided Walk - 10km | 700m D+

Leisure guided route through the slopes of Serra da Estrela. Ideal for families and those seeking to discover the region in a relaxed atmosphere.

### 📊 Characteristics
- **Distance:** 10 km
- **Elevation Gain:** 700m D+
- **Difficulty:** Low
- **Type:** Guided walk
- **Estimated Time:** 3h00 - 4h00
- **Start:** 09:45am
- **Minimum Age:** 8 years

### ⚙️ Mandatory Equipment
- Suitable walking shoes
- Mobile phone

### ℹ️ Information
- Non-competitive route
- Guide accompanies the group
- Pace adapted to the group
- No final ranking
- Ideal for families

**Note:** Under 18 requires written parental authorization.`,
    },
    es: {
      name: "Caminata Guiada - 10km",
      description: `## 🚶 Caminata Guiada - 10km | 700m D+

Recorrido de ocio guiado por las laderas de la Serra da Estrela. Ideal para familias y quienes buscan descubrir la región en un ambiente relajado.`,
    },
    fr: {
      name: "Marche Guidée - 10km",
      description: `## 🚶 Marche Guidée - 10km | 700m D+

Parcours de loisir guidé à travers les pentes de la Serra da Estrela. Idéal pour les familles et ceux qui cherchent à découvrir la région dans une atmosphère détendue.`,
    },
    de: {
      name: "Geführte Wanderung - 10km",
      description: `## 🚶 Geführte Wanderung - 10km | 700m D+

Geführte Freizeitstrecke durch die Hänge der Serra da Estrela. Ideal für Familien und diejenigen, die die Region in entspannter Atmosphäre entdecken möchten.`,
    },
    it: {
      name: "Camminata Guidata - 10km",
      description: `## 🚶 Camminata Guidata - 10km | 700m D+

Percorso ricreativo guidato attraverso le pendici della Serra da Estrela. Ideale per famiglie e chi cerca di scoprire la regione in un'atmosfera rilassata.`,
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

  // 1ª Fase (até 15/01/2026)
  await findOrCreatePricingPhase("Trail Curto - 1ª Fase", {
    startDate: new Date("2025-12-01T00:00:00.000Z"),
    endDate: new Date("2026-01-15T23:59:00.000Z"),
    price: 13.0,
    currency: Currency.EUR,
    note: "Preço promocional até 15 de janeiro",
  });

  await findOrCreatePricingPhase("Mini Trail - 1ª Fase", {
    startDate: new Date("2025-12-01T00:00:00.000Z"),
    endDate: new Date("2026-01-15T23:59:00.000Z"),
    price: 11.0,
    currency: Currency.EUR,
    note: "Preço promocional até 15 de janeiro",
  });

  await findOrCreatePricingPhase("Caminhada Guiada - 1ª Fase", {
    startDate: new Date("2025-12-01T00:00:00.000Z"),
    endDate: new Date("2026-01-15T23:59:00.000Z"),
    price: 6.0,
    currency: Currency.EUR,
    note: "Preço promocional até 15 de janeiro",
  });

  // 2ª Fase (de 16/01/2026 a 01/02/2026)
  await findOrCreatePricingPhase("Trail Curto - 2ª Fase", {
    startDate: new Date("2026-01-16T00:00:00.000Z"),
    endDate: new Date("2026-02-01T23:59:00.000Z"),
    price: 14.0,
    currency: Currency.EUR,
    note: "De 16 janeiro a 1 fevereiro",
  });

  await findOrCreatePricingPhase("Mini Trail - 2ª Fase", {
    startDate: new Date("2026-01-16T00:00:00.000Z"),
    endDate: new Date("2026-02-01T23:59:00.000Z"),
    price: 12.0,
    currency: Currency.EUR,
    note: "De 16 janeiro a 1 fevereiro",
  });

  await findOrCreatePricingPhase("Caminhada Guiada - 2ª Fase", {
    startDate: new Date("2026-01-16T00:00:00.000Z"),
    endDate: new Date("2026-02-01T23:59:00.000Z"),
    price: 7.0,
    currency: Currency.EUR,
    note: "De 16 janeiro a 1 fevereiro",
  });

  // Opcionais
  await findOrCreatePricingPhase("Almoço (Sopa + Prato + Bebida + Sobremesa)", {
    startDate: new Date("2025-12-01T00:00:00.000Z"),
    endDate: new Date("2026-02-01T23:59:00.000Z"),
    price: 6.0,
    currency: Currency.EUR,
    note: "Almoço opcional para participantes",
  });

  await findOrCreatePricingPhase("Acompanhante (Refeição)", {
    startDate: new Date("2025-12-01T00:00:00.000Z"),
    endDate: new Date("2026-02-01T23:59:00.000Z"),
    price: 6.0,
    currency: Currency.EUR,
    note: "Refeição para acompanhantes não participantes",
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
    "Qual é a idade mínima para participar?",
    "Para o Trail Curto e Mini Trail a idade mínima é 16 anos. Para a Caminhada Guiada a idade mínima é 8 anos. Menores de 18 anos necessitam de autorização escrita do encarregado de educação."
  );

  const faq1Translations = {
    pt: {
      question: "Qual é a idade mínima para participar?",
      answer:
        "Para o Trail Curto e Mini Trail a idade mínima é 16 anos. Para a Caminhada Guiada a idade mínima é 8 anos. Menores de 18 anos necessitam de autorização escrita do encarregado de educação.",
    },
    en: {
      question: "What is the minimum age to participate?",
      answer:
        "For the Short Trail and Mini Trail the minimum age is 16 years. For the Guided Walk the minimum age is 8 years. Under 18 requires written parental authorization.",
    },
    es: {
      question: "¿Cuál es la edad mínima para participar?",
      answer:
        "Para el Trail Corto y Mini Trail la edad mínima es 16 años. Para la Caminata Guiada la edad mínima es 8 años. Los menores de 18 años necesitan autorización escrita del tutor.",
    },
    fr: {
      question: "Quel est l'âge minimum pour participer?",
      answer:
        "Pour le Trail Court et Mini Trail l'âge minimum est de 16 ans. Pour la Marche Guidée l'âge minimum est de 8 ans. Les mineurs de 18 ans nécessitent une autorisation écrite parentale.",
    },
    de: {
      question: "Was ist das Mindestalter zur Teilnahme?",
      answer:
        "Für den Kurzen Trail und Mini Trail beträgt das Mindestalter 16 Jahre. Für die Geführte Wanderung beträgt das Mindestalter 8 Jahre. Unter 18 erfordert schriftliche elterliche Genehmigung.",
    },
    it: {
      question: "Qual è l'età minima per partecipare?",
      answer:
        "Per il Trail Corto e Mini Trail l'età minima è 16 anni. Per la Camminata Guidata l'età minima è 8 anni. I minori di 18 anni necessitano di autorizzazione scritta del tutore.",
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
    "Qual é o equipamento obrigatório?",
    "Trail Curto: calçado adequado, telemóvel + apito, manta de sobrevivência, reservatório de água (mín. 0,5L), impermeável/corta-vento. Mini Trail: calçado adequado, telemóvel + apito, reservatório de água (mín. 0,5L). Caminhada: calçado adequado, telemóvel."
  );

  const faq2Translations = {
    pt: {
      question: "Qual é o equipamento obrigatório?",
      answer:
        "Trail Curto: calçado adequado, telemóvel + apito, manta de sobrevivência, reservatório de água (mín. 0,5L), impermeável/corta-vento. Mini Trail: calçado adequado, telemóvel + apito, reservatório de água (mín. 0,5L). Caminhada: calçado adequado, telemóvel.",
    },
    en: {
      question: "What is the mandatory equipment?",
      answer:
        "Short Trail: suitable footwear, mobile phone + whistle, survival blanket, water reservoir (min. 0.5L), waterproof/windbreaker. Mini Trail: suitable footwear, mobile phone + whistle, water reservoir (min. 0.5L). Walk: suitable footwear, mobile phone.",
    },
    es: {
      question: "¿Cuál es el equipamiento obligatorio?",
      answer:
        "Trail Corto: calzado adecuado, teléfono móvil + silbato, manta de supervivencia, depósito de agua (mín. 0,5L), impermeable/cortavientos. Mini Trail: calzado adecuado, teléfono móvil + silbato, depósito de agua (mín. 0,5L). Caminata: calzado adecuado, teléfono móvil.",
    },
    fr: {
      question: "Quel est l'équipement obligatoire?",
      answer:
        "Trail Court: chaussures appropriées, téléphone portable + sifflet, couverture de survie, réservoir d'eau (min. 0,5L), imperméable/coupe-vent. Mini Trail: chaussures appropriées, téléphone portable + sifflet, réservoir d'eau (min. 0,5L). Marche: chaussures appropriées, téléphone portable.",
    },
    de: {
      question: "Was ist die Pflichtausrüstung?",
      answer:
        "Kurzer Trail: geeignete Schuhe, Mobiltelefon + Pfeife, Überlebensdecke, Wasserreservoir (mind. 0,5L), Regenjacke/Windbreaker. Mini Trail: geeignete Schuhe, Mobiltelefon + Pfeife, Wasserreservoir (mind. 0,5L). Wanderung: geeignete Schuhe, Mobiltelefon.",
    },
    it: {
      question: "Qual è l'attrezzatura obbligatoria?",
      answer:
        "Trail Corto: calzature adeguate, telefono cellulare + fischietto, coperta di sopravvivenza, serbatoio d'acqua (min. 0,5L), impermeabile/antivento. Mini Trail: calzature adeguate, telefono cellulare + fischietto, serbatoio d'acqua (min. 0,5L). Camminata: calzature adeguate, telefono cellulare.",
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
    "Quantas vagas estão disponíveis?",
    "Trail Curto + Mini Trail: 500 participantes no total. Caminhada Guiada: 100 participantes. As inscrições encerram quando atingir o limite ou no dia 1 de fevereiro de 2026."
  );

  const faq3Translations = {
    pt: {
      question: "Quantas vagas estão disponíveis?",
      answer:
        "Trail Curto + Mini Trail: 500 participantes no total. Caminhada Guiada: 100 participantes. As inscrições encerram quando atingir o limite ou no dia 1 de fevereiro de 2026.",
    },
    en: {
      question: "How many spots are available?",
      answer:
        "Short Trail + Mini Trail: 500 participants total. Guided Walk: 100 participants. Registrations close when reaching the limit or on February 1, 2026.",
    },
    es: {
      question: "¿Cuántas plazas están disponibles?",
      answer:
        "Trail Corto + Mini Trail: 500 participantes en total. Caminata Guiada: 100 participantes. Las inscripciones cierran al alcanzar el límite o el 1 de febrero de 2026.",
    },
    fr: {
      question: "Combien de places sont disponibles?",
      answer:
        "Trail Court + Mini Trail: 500 participants au total. Marche Guidée: 100 participants. Les inscriptions ferment en atteignant la limite ou le 1er février 2026.",
    },
    de: {
      question: "Wie viele Plätze sind verfügbar?",
      answer:
        "Kurzer Trail + Mini Trail: 500 Teilnehmer insgesamt. Geführte Wanderung: 100 Teilnehmer. Anmeldungen schließen beim Erreichen des Limits oder am 1. Februar 2026.",
    },
    it: {
      question: "Quanti posti sono disponibili?",
      answer:
        "Trail Corto + Mini Trail: 500 partecipanti in totale. Camminata Guidata: 100 partecipanti. Le iscrizioni chiudono al raggiungimento del limite o il 1° febbraio 2026.",
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
    "\n🎉 5º Trail Valezim Aldeia Desporto 2026 seed completed successfully!"
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
