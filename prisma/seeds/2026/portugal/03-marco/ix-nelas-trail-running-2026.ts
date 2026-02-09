import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding IX Nelas Trail Running 2026...");

  // 1. Upsert event (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: "ix-nelas-trail-running-2026" },
    update: {
      title: "IX Nelas Trail Running 2026",
      description:
        "IX Edição do Nelas Trail Running - Descobre os trilhos de Nelas",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-03-01T09:00:00.000Z"),
      endDate: new Date("2026-03-01T15:00:00.000Z"),
      city: "Nelas",
      country: "Portugal",
      latitude: 40.535952,
      longitude: -7.847611,
      googleMapsUrl: "https://maps.google.com/?q=40.535952,-7.847611",
      externalUrl: "https://acorrer.pt/eventos/4118/info",
      imageUrl: "",
      isFeatured: false,
    },
    create: {
      slug: "ix-nelas-trail-running-2026",
      title: "IX Nelas Trail Running 2026",
      description:
        "IX Edição do Nelas Trail Running - Descobre os trilhos de Nelas",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-03-01T09:00:00.000Z"),
      endDate: new Date("2026-03-01T15:00:00.000Z"),
      city: "Nelas",
      country: "Portugal",
      latitude: 40.535952,
      longitude: -7.847611,
      googleMapsUrl: "https://maps.google.com/?q=40.535952,-7.847611",
      externalUrl: "https://acorrer.pt/eventos/4118/info",
      imageUrl: "",
      isFeatured: false,
    },
  });

  console.log(`✅ Event created/updated: ${event.slug}`);

  // 2. Upsert event translations separately (ALL 6 LANGUAGES)
  const eventTranslations = {
    pt: {
      title: "IX Nelas Trail Running 2026",
      description: `# 🏃 IX Nelas Trail Running

**IX Edição** do Nelas Trail Running! Descobre os trilhos do concelho de Nelas numa prova que atravessa várias freguesias do município.

## 🏃 Quatro Percursos Disponíveis

**Trail Longo:** ±25 km - Para os mais exigentes (6h limite)
**Trail Curto:** ±15 km - Distância intermédia (5h limite)
**Mini Trail:** ±10 km - Ideal para começar em trail (4h limite)
**Caminhada:** ±10 km - Lazer e convívio (sem cronometragem)

## ✨ Destaques

- **Região de Nelas** - trilhos pelo concelho de Nelas e suas freguesias
- **4 distâncias** - desde caminhada até trail longo de 25km
- **Almoço convívio** - almoço opcional por +5€
- **T-shirt técnica opcional** - disponível por +5€
- **Limite 1000 participantes** - vagas limitadas
- **Organização experiente** - IX Edição pelo Núcleo Dão Nelas / Dão Nelas Runners

## 🎯 O Que Está Incluído

**Trail Longo, Trail Curto e Mini Trail:**
- Seguro de acidentes pessoal
- Dorsal com chip de cronometragem eletrónica
- Brinde
- Abastecimentos sólidos e líquidos durante o percurso
- Abastecimento de recuperação no fim da prova
- Todas as ofertas conseguidas pela organização

**Caminhada:**
- 1 peça de fruta
- 1 água
- Sem cronometragem (percurso não competitivo)

**Opcionais:**
- T-shirt técnica do evento: +5€
- Almoço: +5€

### 🏅 Premiação Completa

**Geral Masculino e Feminino** (Trail Longo, Trail Curto, Mini Trail):
- 1º, 2º e 3º classificados

**Escalões premiados:**
- Junior (18-19 anos), Sub23 (20-22), Seniores (23-34)
- M/F35, M/F40, M/F45, M/F50, M/F55, M/F60, M/F65, M/F70+
- 3 primeiros de cada escalão

**Equipas:**
- 1ª, 2ª e 3ª classificadas (geral)
- Classificação pelos 3 melhores atletas de cada equipa
- **Promoção:** Por cada 10 atletas inscritos da mesma equipa, a organização oferece a inscrição do 11º atleta!

### 📋 Equipamento Obrigatório

**Material obrigatório** (todas as provas de trail):
- Vestuário e calçado apropriado para corrida
- Telemóvel
- Manta térmica
- Apito

**Material recomendado:**
- GPS
- Protetor solar
- Boné
- Água e alimentos energéticos
- Corta-vento / impermeável

### 🍎 Abastecimentos

**Trail Longo (±25km):**
- 3 postos com sólidos e líquidos

**Trail Curto (±15km):**
- 2 postos com sólidos e líquidos

**Mini Trail (±10km):**
- 1 posto com sólidos e líquidos

**Caminhada (±10km):**
- 1 posto com água e peça de fruta

### 📍 Informações Práticas

**Partida/Chegada:** Escola E.B. 2,3 Dr. Fortunato de Almeida, Nelas
**Coordenadas:** 40°32'25.4"N 7°50'51.4"W

**Secretariado:**
- **28 Fevereiro:** 14h00-17h00 (Sede do Núcleo Dão Nelas)
- **1 Março:** 07h00-08h30 (junto ao local de partida)

**Horários de Partida:**
- 09h00 - Trail Longo + Trail Curto
- 09h15 - Mini Trail + Caminhada

**Idade mínima:**
- Trail Longo: 18 anos
- Trail Curto: 16 anos (16-17 anos: autorização obrigatória)
- Mini Trail: 14 anos (menores de 18: autorização obrigatória)
- Caminhada: sem idade mínima

**Inscrições encerram:** 23 Fevereiro 2026 às 23h59 (ou até 1000 participantes)

**Organização:** Núcleo Dão Nelas / Dão Nelas Runners
**Contacto:** 916839071 | daonelasrunners@gmail.com

Vem descobrir os trilhos de Nelas! 🏃‍♀️⛰️`,
      city: "Nelas",
      metaTitle: "IX Nelas Trail Running 2026 | Viseu | 1 Março",
      metaDescription:
        "IX Nelas Trail Running. Trail Longo 25km, Trail Curto 15km, Mini Trail 10km, Caminhada 10km. Promoção equipas. Limite 1000 participantes. Nelas, 1 Março 2026.",
    },
    en: {
      title: "IX Nelas Trail Running 2026",
      description: `# 🏃 IX Nelas Trail Running

**9th Edition** of Nelas Trail Running! Discover the trails of Nelas municipality in a race that crosses several parishes.

## 🏃 Four Routes Available

**Long Trail:** ±25 km - For the most demanding (6h limit)
**Short Trail:** ±15 km - Intermediate distance (5h limit)
**Mini Trail:** ±10 km - Ideal for trail beginners (4h limit)
**Walk:** ±10 km - Leisure and fellowship (no timing)

## ✨ Highlights

- **Nelas Region** - trails through Nelas municipality and its parishes
- **4 distances** - from walk to 25km long trail
- **Fellowship lunch** - optional lunch for +5€
- **Optional technical t-shirt** - available for +5€
- **Limited to 1000 participants**
- **Experienced organization** - 9th Edition by Núcleo Dão Nelas / Dão Nelas Runners

## 🎯 What's Included

**Long Trail, Short Trail and Mini Trail:**
- Personal accident insurance
- Race number with electronic timing chip
- Gift
- Solid and liquid refreshments during the course
- Recovery refreshments at finish line
- All gifts secured by organization

**Walk:**
- 1 piece of fruit
- 1 water
- No timing (non-competitive route)

**Optional:**
- Event technical t-shirt: +5€
- Lunch: +5€

### 🏅 Complete Awards

**General Men and Women** (Long Trail, Short Trail, Mini Trail):
- 1st, 2nd and 3rd place

**Awarded categories:**
- Junior (18-19 years), Sub23 (20-22), Seniors (23-34)
- M/F35, M/F40, M/F45, M/F50, M/F55, M/F60, M/F65, M/F70+
- Top 3 in each category

**Teams:**
- 1st, 2nd and 3rd place (general)
- Ranking by top 3 athletes from each team
- **Promotion:** For every 10 registered athletes from the same team, organization offers the 11th registration free!

### 📋 Mandatory Equipment

**Mandatory equipment** (all trail races):
- Suitable running clothing and footwear
- Mobile phone
- Thermal blanket
- Whistle

**Recommended equipment:**
- GPS
- Sunscreen
- Cap
- Water and energy food
- Windbreaker / waterproof

### 🍎 Aid Stations

**Long Trail (±25km):**
- 3 stations with solid and liquid food

**Short Trail (±15km):**
- 2 stations with solid and liquid food

**Mini Trail (±10km):**
- 1 station with solid and liquid food

**Walk (±10km):**
- 1 station with water and fruit

### 📍 Practical Information

**Start/Finish:** E.B. 2,3 Dr. Fortunato de Almeida School, Nelas
**Coordinates:** 40°32'25.4"N 7°50'51.4"W

**Registration desk:**
- **February 28:** 2pm-5pm (Núcleo Dão Nelas headquarters)
- **March 1:** 7am-8:30am (at start location)

**Start Times:**
- 9:00am - Long Trail + Short Trail
- 9:15am - Mini Trail + Walk

**Minimum age:**
- Long Trail: 18 years
- Short Trail: 16 years (16-17: authorization required)
- Mini Trail: 14 years (under 18: authorization required)
- Walk: no minimum age

**Registration closes:** February 23, 2026 at 11:59pm (or 1000 participants)

**Organizer:** Núcleo Dão Nelas / Dão Nelas Runners
**Contact:** 916839071 | daonelasrunners@gmail.com

Come discover the trails of Nelas! 🏃‍♀️⛰️`,
      city: "Nelas",
      metaTitle: "IX Nelas Trail Running 2026 | Viseu | March 1",
      metaDescription:
        "IX Nelas Trail Running. Long Trail 25km, Short Trail 15km, Mini Trail 10km, Walk 10km. Team promotion. Limited to 1000 participants. Nelas, March 1, 2026.",
    },
    es: {
      title: "IX Nelas Trail Running 2026",
      description: `# 🏃 IX Nelas Trail Running

**IX Edición** del Nelas Trail Running! Descubre los senderos del municipio de Nelas en una carrera que atraviesa varias parroquias.

¡Ven a descubrir los senderos de Nelas! 🏃‍♀️⛰️`,
      city: "Nelas",
      metaTitle: "IX Nelas Trail Running 2026 | Viseu | 1 Marzo",
      metaDescription:
        "IX Nelas Trail Running. Trail Largo 25km, Trail Corto 15km, Mini Trail 10km, Caminata 10km. Promoción equipos. Límite 1000 participantes. Nelas, 1 Marzo 2026.",
    },
    fr: {
      title: "IX Nelas Trail Running 2026",
      description: `# 🏃 IX Nelas Trail Running

**IXème Édition** du Nelas Trail Running! Découvrez les sentiers de la municipalité de Nelas dans une course qui traverse plusieurs paroisses.

Venez découvrir les sentiers de Nelas! 🏃‍♀️⛰️`,
      city: "Nelas",
      metaTitle: "IX Nelas Trail Running 2026 | Viseu | 1er Mars",
      metaDescription:
        "IX Nelas Trail Running. Trail Long 25km, Trail Court 15km, Mini Trail 10km, Marche 10km. Promotion équipes. Limité à 1000 participants. Nelas, 1er Mars 2026.",
    },
    de: {
      title: "IX Nelas Trail Running 2026",
      description: `# 🏃 IX Nelas Trail Running

**9. Ausgabe** des Nelas Trail Running! Entdecken Sie die Trails der Gemeinde Nelas bei einem Rennen, das mehrere Pfarreien durchquert.

Kommen Sie und entdecken Sie die Trails von Nelas! 🏃‍♀️⛰️`,
      city: "Nelas",
      metaTitle: "IX Nelas Trail Running 2026 | Viseu | 1. März",
      metaDescription:
        "IX Nelas Trail Running. Langer Trail 25km, Kurzer Trail 15km, Mini Trail 10km, Wanderung 10km. Team-Aktion. Begrenzt auf 1000 Teilnehmer. Nelas, 1. März 2026.",
    },
    it: {
      title: "IX Nelas Trail Running 2026",
      description: `# 🏃 IX Nelas Trail Running

**IX Edizione** del Nelas Trail Running! Scopri i sentieri del comune di Nelas in una gara che attraversa diverse parrocchie.

Vieni a scoprire i sentieri di Nelas! 🏃‍♀️⛰️`,
      city: "Nelas",
      metaTitle: "IX Nelas Trail Running 2026 | Viseu | 1 Marzo",
      metaDescription:
        "IX Nelas Trail Running. Trail Lungo 25km, Trail Corto 15km, Mini Trail 10km, Camminata 10km. Promozione squadre. Limitato a 1000 partecipanti. Nelas, 1 Marzo 2026.",
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

  const trailLongoVariant = await findOrCreateVariant({
    name: "Trail Longo",
    distanceKm: 25,
    elevationGainM: 1100,
    elevationLossM: 1100,
    startTime: "09:00",
    maxParticipants: 350,
    cutoffTimeHours: 6.0,
    atrpGrade: 4,
    mountainLevel: 3,
    price: 20.0,
    currency: Currency.EUR,
  });

  console.log(`✅ Variant created/updated: ${trailLongoVariant.name}`);

  const trailCurtoVariant = await findOrCreateVariant({
    name: "Trail Curto",
    distanceKm: 15,
    elevationGainM: 700,
    elevationLossM: 700,
    startTime: "09:00",
    maxParticipants: 300,
    cutoffTimeHours: 5.0,
    atrpGrade: 3,
    mountainLevel: 2,
    price: 17.0,
    currency: Currency.EUR,
  });

  console.log(`✅ Variant created/updated: ${trailCurtoVariant.name}`);

  const miniTrailVariant = await findOrCreateVariant({
    name: "Mini Trail",
    distanceKm: 10,
    elevationGainM: 450,
    elevationLossM: 450,
    startTime: "09:15",
    maxParticipants: 250,
    cutoffTimeHours: 4.0,
    atrpGrade: 2,
    mountainLevel: 2,
    price: 14.0,
    currency: Currency.EUR,
  });

  console.log(`✅ Variant created/updated: ${miniTrailVariant.name}`);

  const caminhadaVariant = await findOrCreateVariant({
    name: "Caminhada",
    distanceKm: 10,
    elevationGainM: 350,
    elevationLossM: 350,
    startTime: "09:15",
    maxParticipants: 100,
    cutoffTimeHours: 5.0,
    atrpGrade: 1,
    mountainLevel: 1,
    price: 10.0,
    currency: Currency.EUR,
  });

  console.log(`✅ Variant created/updated: ${caminhadaVariant.name}`);

  // 4. Upsert variant translations (6 languages each)
  const trailLongoTranslations = {
    pt: {
      name: "Trail Longo - ±25km",
      description: `## 🏔️ Trail Longo - ±25km

O percurso mais desafiante do IX Nelas Trail Running! Para trail runners experientes que procuram um desafio completo pelos trilhos do concelho de Nelas.

### 📊 Características
- **Distância:** ±25 km (quilometragem exata será anunciada no guia do atleta)
- **Desnível Positivo:** ±1100m D+
- **Dificuldade Técnica:** Alta
- **Dificuldade Física:** Muito Alta
- **Tempo Limite:** 6 horas
- **Partida:** 09h00
- **Idade Mínima:** 18 anos

### 🍎 Abastecimentos
- 3 postos de abastecimento com sólidos e líquidos
- Abastecimento de recuperação na chegada
- Possibilidade de pontos de água adicionais conforme condições climatéricas

### ⚙️ Equipamento Obrigatório
- Vestuário e calçado apropriado para corrida
- Telemóvel
- Manta térmica
- Apito

### ⚙️ Equipamento Recomendado
- GPS
- Protetor solar
- Boné
- Água e alimentos energéticos
- Corta-vento / impermeável

### 🏅 Premiação
**Geral Masculino e Feminino:**
- 1º, 2º e 3º classificados

**Escalões (M/F):**
- 3 primeiros de cada escalão: Junior, Sub23, Seniores, M/F35, M/F40, M/F45, M/F50, M/F55, M/F60, M/F65, M/F70+

**Equipas:**
- Classificação pelos 3 melhores atletas de cada equipa
- **Promoção:** Por cada 10 atletas inscritos da mesma equipa, a organização oferece a inscrição do 11º!

### ✔️ Inclui
- Seguro de acidentes pessoal
- Dorsal com chip de cronometragem
- Brinde
- Todas as ofertas da organização

### ⚠️ Informações Importantes
- Inscrições até 23 Fevereiro 2026 (ou até 1000 participantes)
- Marcação do percurso por fitas, setas, placas e cal
- Postos de controlo ao longo do percurso
- Cronometragem eletrónica por chip
- Resultados em tempo real em acorrer.pt

**Nota:** Ultrapassar o tempo limite obriga à chegada o mais rápido possível. Os "corredores vassoura" podem levantar as fitas após o tempo limite.`,
    },
    en: {
      name: "Long Trail - ±25km",
      description: `## 🏔️ Long Trail - ±25km

The most challenging route of IX Nelas Trail Running! For experienced trail runners seeking a complete challenge through Nelas municipality trails.

### 📊 Characteristics
- **Distance:** ±25 km (exact distance announced in athlete guide)
- **Elevation Gain:** ±1100m D+
- **Technical Difficulty:** High
- **Physical Difficulty:** Very High
- **Time Limit:** 6 hours
- **Start:** 9:00am
- **Minimum Age:** 18 years

### 🍎 Aid Stations
- 3 aid stations with solid and liquid food
- Recovery refreshments at finish line
- Possible additional water points depending on weather

### ⚙️ Mandatory Equipment
- Suitable running clothing and footwear
- Mobile phone
- Thermal blanket
- Whistle

### ⚙️ Recommended Equipment
- GPS
- Sunscreen
- Cap
- Water and energy food
- Windbreaker / waterproof

### 🏅 Awards
**General Men and Women:**
- 1st, 2nd and 3rd place

**Categories (M/F):**
- Top 3 in each category: Junior, Sub23, Seniors, M/F35, M/F40, M/F45, M/F50, M/F55, M/F60, M/F65, M/F70+

**Teams:**
- Ranking by top 3 athletes from each team
- **Promotion:** For every 10 registered athletes from same team, organization offers 11th registration free!

### ✔️ Includes
- Personal accident insurance
- Race number with timing chip
- Gift
- All organization gifts

### ⚠️ Important Information
- Registration until February 23, 2026 (or 1000 participants)
- Course marking with ribbons, arrows, signs and chalk
- Control points along the course
- Electronic chip timing
- Real-time results at acorrer.pt

**Note:** Exceeding time limit requires reaching finish as fast as possible. "Sweepers" may remove marking ribbons after time limit.`,
    },
    es: {
      name: "Trail Largo - ±25km",
      description: `## 🏔️ Trail Largo - ±25km

¡La ruta más desafiante del IX Nelas Trail Running! Para trail runners experimentados que buscan un desafío completo por los senderos del municipio de Nelas.`,
    },
    fr: {
      name: "Trail Long - ±25km",
      description: `## 🏔️ Trail Long - ±25km

Le parcours le plus difficile du IX Nelas Trail Running! Pour les trail runners expérimentés à la recherche d'un défi complet sur les sentiers de la municipalité de Nelas.`,
    },
    de: {
      name: "Langer Trail - ±25km",
      description: `## 🏔️ Langer Trail - ±25km

Die anspruchsvollste Strecke des IX Nelas Trail Running! Für erfahrene Trail Runner, die eine vollständige Herausforderung auf den Trails der Gemeinde Nelas suchen.`,
    },
    it: {
      name: "Trail Lungo - ±25km",
      description: `## 🏔️ Trail Lungo - ±25km

Il percorso più impegnativo del IX Nelas Trail Running! Per trail runner esperti che cercano una sfida completa sui sentieri del comune di Nelas.`,
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: trailLongoVariant.id,
          language: Language[lang],
        },
      },
      update: trailLongoTranslations[lang],
      create: {
        variantId: trailLongoVariant.id,
        language: Language[lang],
        ...trailLongoTranslations[lang],
      },
    });
  }

  console.log(
    "✅ Trail Longo variant translations created/updated (6 languages)"
  );

  const trailCurtoTranslations = {
    pt: {
      name: "Trail Curto - ±15km",
      description: `## 🏃 Trail Curto - ±15km

Percurso intermédio do IX Nelas Trail Running. Ideal para quem procura um desafio equilibrado pelos trilhos de Nelas.

### 📊 Características
- **Distância:** ±15 km (quilometragem exata será anunciada no guia do atleta)
- **Desnível Positivo:** ±700m D+
- **Dificuldade Técnica:** Média
- **Dificuldade Física:** Alta
- **Tempo Limite:** 5 horas
- **Partida:** 09h00
- **Idade Mínima:** 16 anos (16-17 anos: autorização obrigatória)

### 🍎 Abastecimentos
- 2 postos de abastecimento com sólidos e líquidos
- Abastecimento de recuperação na chegada

### ⚙️ Equipamento Obrigatório
- Vestuário e calçado apropriado
- Telemóvel + Manta térmica + Apito

### 🏅 Premiação
- Geral M/F: 1º, 2º e 3º
- Escalões: 3 primeiros de cada categoria
- Equipas: classificação pelos 3 melhores

**Nota:** Atletas entre 16-17 anos necessitam de autorização do encarregado de educação.`,
    },
    en: {
      name: "Short Trail - ±15km",
      description: `## 🏃 Short Trail - ±15km

Intermediate route of IX Nelas Trail Running. Ideal for those seeking a balanced challenge through Nelas trails.

### 📊 Characteristics
- **Distance:** ±15 km (exact distance announced in athlete guide)
- **Elevation Gain:** ±700m D+
- **Technical Difficulty:** Medium
- **Physical Difficulty:** High
- **Time Limit:** 5 hours
- **Start:** 9:00am
- **Minimum Age:** 16 years (16-17: authorization required)

### 🍎 Aid Stations
- 2 aid stations with solid and liquid food
- Recovery refreshments at finish line

### ⚙️ Mandatory Equipment
- Suitable clothing and footwear
- Mobile phone + Thermal blanket + Whistle

### 🏅 Awards
- General M/F: 1st, 2nd and 3rd
- Categories: Top 3 in each
- Teams: ranking by top 3

**Note:** Athletes aged 16-17 require parental authorization.`,
    },
    es: {
      name: "Trail Corto - ±15km",
      description: `## 🏃 Trail Corto - ±15km

Recorrido intermedio del IX Nelas Trail Running. Ideal para quienes buscan un desafío equilibrado por los senderos de Nelas.`,
    },
    fr: {
      name: "Trail Court - ±15km",
      description: `## 🏃 Trail Court - ±15km

Parcours intermédiaire du IX Nelas Trail Running. Idéal pour ceux qui recherchent un défi équilibré sur les sentiers de Nelas.`,
    },
    de: {
      name: "Kurzer Trail - ±15km",
      description: `## 🏃 Kurzer Trail - ±15km

Mittlere Strecke des IX Nelas Trail Running. Ideal für diejenigen, die eine ausgewogene Herausforderung auf den Trails von Nelas suchen.`,
    },
    it: {
      name: "Trail Corto - ±15km",
      description: `## 🏃 Trail Corto - ±15km

Percorso intermedio del IX Nelas Trail Running. Ideale per chi cerca una sfida equilibrata sui sentieri di Nelas.`,
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
      name: "Mini Trail - ±10km",
      description: `## 🏃 Mini Trail - ±10km

Percurso ideal para quem se quer iniciar em trail running ou procura uma distância mais acessível no IX Nelas Trail Running.

### 📊 Características
- **Distância:** ±10 km (quilometragem exata será anunciada no guia do atleta)
- **Desnível Positivo:** ±450m D+
- **Dificuldade Técnica:** Média
- **Dificuldade Física:** Média
- **Tempo Limite:** 4 horas
- **Partida:** 09h15
- **Idade Mínima:** 14 anos (menores de 18: autorização obrigatória)

### 🍎 Abastecimentos
- 1 posto de abastecimento com sólidos e líquidos
- Abastecimento de recuperação na chegada

### ⚙️ Equipamento Obrigatório
- Vestuário e calçado apropriado
- Telemóvel + Manta térmica + Apito

### 🏅 Premiação
- Geral M/F: 1º, 2º e 3º
- Escalões: 3 primeiros de cada categoria
- Equipas: classificação pelos 3 melhores

**Nota:** Menores de 18 anos necessitam de autorização do encarregado de educação.`,
    },
    en: {
      name: "Mini Trail - ±10km",
      description: `## 🏃 Mini Trail - ±10km

Ideal route for those starting in trail running or seeking a more accessible distance at IX Nelas Trail Running.

### 📊 Characteristics
- **Distance:** ±10 km (exact distance announced in athlete guide)
- **Elevation Gain:** ±450m D+
- **Technical Difficulty:** Medium
- **Physical Difficulty:** Medium
- **Time Limit:** 4 hours
- **Start:** 9:15am
- **Minimum Age:** 14 years (under 18: authorization required)

### 🍎 Aid Stations
- 1 aid station with solid and liquid food
- Recovery refreshments at finish line

### ⚙️ Mandatory Equipment
- Suitable clothing and footwear
- Mobile phone + Thermal blanket + Whistle

### 🏅 Awards
- General M/F: 1st, 2nd and 3rd
- Categories: Top 3 in each
- Teams: ranking by top 3

**Note:** Under 18 requires parental authorization.`,
    },
    es: {
      name: "Mini Trail - ±10km",
      description: `## 🏃 Mini Trail - ±10km

Recorrido ideal para quienes quieren iniciarse en trail running o buscan una distancia más accesible en el IX Nelas Trail Running.`,
    },
    fr: {
      name: "Mini Trail - ±10km",
      description: `## 🏃 Mini Trail - ±10km

Parcours idéal pour ceux qui veulent débuter en trail running ou cherchent une distance plus accessible au IX Nelas Trail Running.`,
    },
    de: {
      name: "Mini Trail - ±10km",
      description: `## 🏃 Mini Trail - ±10km

Ideale Strecke für diejenigen, die mit Trail Running beginnen oder eine zugänglichere Distanz beim IX Nelas Trail Running suchen.`,
    },
    it: {
      name: "Mini Trail - ±10km",
      description: `## 🏃 Mini Trail - ±10km

Percorso ideale per chi vuole iniziare nel trail running o cerca una distanza più accessibile nel IX Nelas Trail Running.`,
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
      name: "Caminhada - ±10km",
      description: `## 🚶 Caminhada - ±10km

Percurso de lazer não competitivo pelos trilhos de Nelas. Ideal para famílias e quem procura descobrir a região num ambiente descontraído.

### 📊 Características
- **Distância:** ±10 km
- **Desnível Positivo:** ±350m D+
- **Dificuldade:** Baixa
- **Tipo:** Caminhada não competitiva
- **Tempo Estimado:** 3h00 - 5h00
- **Partida:** 09h15
- **Idade Mínima:** Sem idade mínima

### 🍎 Abastecimentos
- 1 posto com água e peça de fruta

### ℹ️ Informações
- Percurso não competitivo
- Sem cronometragem ou classificações
- Ideal para famílias e todas as idades
- Percurso marcado e com apoio da organização

### ✔️ Inclui
- 1 água
- 1 peça de fruta

**Nota:** Menores de 18 anos acompanhados por adultos não necessitam de autorização escrita.`,
    },
    en: {
      name: "Walk - ±10km",
      description: `## 🚶 Walk - ±10km

Non-competitive leisure route through Nelas trails. Ideal for families and those seeking to discover the region in a relaxed atmosphere.

### 📊 Characteristics
- **Distance:** ±10 km
- **Elevation Gain:** ±350m D+
- **Difficulty:** Low
- **Type:** Non-competitive walk
- **Estimated Time:** 3h00 - 5h00
- **Start:** 9:15am
- **Minimum Age:** No minimum age

### 🍎 Aid Stations
- 1 station with water and fruit

### ℹ️ Information
- Non-competitive route
- No timing or rankings
- Ideal for families and all ages
- Marked route with organization support

### ✔️ Includes
- 1 water
- 1 piece of fruit

**Note:** Under 18 accompanied by adults do not require written authorization.`,
    },
    es: {
      name: "Caminata - ±10km",
      description: `## 🚶 Caminata - ±10km

Recorrido de ocio no competitivo por los senderos de Nelas. Ideal para familias y quienes buscan descubrir la región en un ambiente relajado.`,
    },
    fr: {
      name: "Marche - ±10km",
      description: `## 🚶 Marche - ±10km

Parcours de loisir non compétitif à travers les sentiers de Nelas. Idéal pour les familles et ceux qui cherchent à découvrir la région dans une atmosphère détendue.`,
    },
    de: {
      name: "Wanderung - ±10km",
      description: `## 🚶 Wanderung - ±10km

Nicht-kompetitive Freizeitstrecke durch die Trails von Nelas. Ideal für Familien und diejenigen, die die Region in entspannter Atmosphäre entdecken möchten.`,
    },
    it: {
      name: "Camminata - ±10km",
      description: `## 🚶 Camminata - ±10km

Percorso ricreativo non competitivo attraverso i sentieri di Nelas. Ideale per famiglie e chi cerca di scoprire la regione in un'atmosfera rilassata.`,
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

  // 1ª Fase (até 13 de fevereiro)
  await findOrCreatePricingPhase("Trail Longo - 1ª Fase", {
    startDate: new Date("2025-12-01T00:00:00.000Z"),
    endDate: new Date("2026-02-13T23:59:00.000Z"),
    price: 18.0,
    currency: Currency.EUR,
    note: "Preço promocional até 13 de fevereiro",
  });

  await findOrCreatePricingPhase("Trail Curto - 1ª Fase", {
    startDate: new Date("2025-12-01T00:00:00.000Z"),
    endDate: new Date("2026-02-13T23:59:00.000Z"),
    price: 15.0,
    currency: Currency.EUR,
    note: "Preço promocional até 13 de fevereiro",
  });

  await findOrCreatePricingPhase("Mini Trail - 1ª Fase", {
    startDate: new Date("2025-12-01T00:00:00.000Z"),
    endDate: new Date("2026-02-13T23:59:00.000Z"),
    price: 12.0,
    currency: Currency.EUR,
    note: "Preço promocional até 13 de fevereiro",
  });

  await findOrCreatePricingPhase("Caminhada - 1ª Fase", {
    startDate: new Date("2025-12-01T00:00:00.000Z"),
    endDate: new Date("2026-02-13T23:59:00.000Z"),
    price: 9.0,
    currency: Currency.EUR,
    note: "Preço promocional até 13 de fevereiro",
  });

  // 2ª Fase (de 14 fevereiro a 23 fevereiro)
  await findOrCreatePricingPhase("Trail Longo - 2ª Fase", {
    startDate: new Date("2026-02-14T00:00:00.000Z"),
    endDate: new Date("2026-02-23T23:59:00.000Z"),
    price: 20.0,
    currency: Currency.EUR,
    note: "De 14 a 23 de fevereiro",
  });

  await findOrCreatePricingPhase("Trail Curto - 2ª Fase", {
    startDate: new Date("2026-02-14T00:00:00.000Z"),
    endDate: new Date("2026-02-23T23:59:00.000Z"),
    price: 17.0,
    currency: Currency.EUR,
    note: "De 14 a 23 de fevereiro",
  });

  await findOrCreatePricingPhase("Mini Trail - 2ª Fase", {
    startDate: new Date("2026-02-14T00:00:00.000Z"),
    endDate: new Date("2026-02-23T23:59:00.000Z"),
    price: 14.0,
    currency: Currency.EUR,
    note: "De 14 a 23 de fevereiro",
  });

  await findOrCreatePricingPhase("Caminhada - 2ª Fase", {
    startDate: new Date("2026-02-14T00:00:00.000Z"),
    endDate: new Date("2026-02-23T23:59:00.000Z"),
    price: 10.0,
    currency: Currency.EUR,
    note: "De 14 a 23 de fevereiro",
  });

  // Opcionais
  await findOrCreatePricingPhase("Almoço (Sopa + Prato + Bebida + Sobremesa)", {
    startDate: new Date("2025-12-01T00:00:00.000Z"),
    endDate: new Date("2026-02-23T23:59:00.000Z"),
    price: 5.0,
    currency: Currency.EUR,
    note: "Almoço opcional para participantes e acompanhantes",
  });

  await findOrCreatePricingPhase("T-Shirt Técnica do Evento", {
    startDate: new Date("2025-12-01T00:00:00.000Z"),
    endDate: new Date("2026-02-23T23:59:00.000Z"),
    price: 5.0,
    currency: Currency.EUR,
    note: "T-shirt técnica opcional",
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
    "Trail Longo: 18 anos. Trail Curto: 16 anos (16-17 necessitam autorização). Mini Trail: 14 anos (menores de 18 necessitam autorização). Caminhada: sem idade mínima."
  );

  const faq1Translations = {
    pt: {
      question: "Qual é a idade mínima para participar?",
      answer:
        "Trail Longo: 18 anos. Trail Curto: 16 anos (16-17 necessitam autorização). Mini Trail: 14 anos (menores de 18 necessitam autorização). Caminhada: sem idade mínima.",
    },
    en: {
      question: "What is the minimum age to participate?",
      answer:
        "Long Trail: 18 years. Short Trail: 16 years (16-17 require authorization). Mini Trail: 14 years (under 18 require authorization). Walk: no minimum age.",
    },
    es: {
      question: "¿Cuál es la edad mínima para participar?",
      answer:
        "Trail Largo: 18 años. Trail Corto: 16 años (16-17 necesitan autorización). Mini Trail: 14 años (menores de 18 necesitan autorización). Caminata: sin edad mínima.",
    },
    fr: {
      question: "Quel est l'âge minimum pour participer?",
      answer:
        "Trail Long: 18 ans. Trail Court: 16 ans (16-17 nécessitent autorisation). Mini Trail: 14 ans (moins de 18 nécessitent autorisation). Marche: pas d'âge minimum.",
    },
    de: {
      question: "Was ist das Mindestalter zur Teilnahme?",
      answer:
        "Langer Trail: 18 Jahre. Kurzer Trail: 16 Jahre (16-17 benötigen Genehmigung). Mini Trail: 14 Jahre (unter 18 benötigen Genehmigung). Wanderung: kein Mindestalter.",
    },
    it: {
      question: "Qual è l'età minima per partecipare?",
      answer:
        "Trail Lungo: 18 anni. Trail Corto: 16 anni (16-17 necessitano autorizzazione). Mini Trail: 14 anni (minori di 18 necessitano autorizzazione). Camminata: nessuna età minima.",
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
    "Para todas as provas de trail: vestuário e calçado apropriado, telemóvel, manta térmica e apito. Recomendado: GPS, protetor solar, boné, água, alimentos energéticos, corta-vento/impermeável."
  );

  const faq2Translations = {
    pt: {
      question: "Qual é o equipamento obrigatório?",
      answer:
        "Para todas as provas de trail: vestuário e calçado apropriado, telemóvel, manta térmica e apito. Recomendado: GPS, protetor solar, boné, água, alimentos energéticos, corta-vento/impermeável.",
    },
    en: {
      question: "What is the mandatory equipment?",
      answer:
        "For all trail races: suitable clothing and footwear, mobile phone, thermal blanket and whistle. Recommended: GPS, sunscreen, cap, water, energy food, windbreaker/waterproof.",
    },
    es: {
      question: "¿Cuál es el equipamiento obligatorio?",
      answer:
        "Para todas las carreras de trail: ropa y calzado adecuado, teléfono móvil, manta térmica y silbato. Recomendado: GPS, protector solar, gorra, agua, alimentos energéticos, cortavientos/impermeable.",
    },
    fr: {
      question: "Quel est l'équipement obligatoire?",
      answer:
        "Pour toutes les courses de trail: vêtements et chaussures appropriés, téléphone portable, couverture thermique et sifflet. Recommandé: GPS, crème solaire, casquette, eau, aliments énergétiques, coupe-vent/imperméable.",
    },
    de: {
      question: "Was ist die Pflichtausrüstung?",
      answer:
        "Für alle Trail-Rennen: geeignete Kleidung und Schuhe, Mobiltelefon, Thermodecke und Pfeife. Empfohlen: GPS, Sonnenschutz, Kappe, Wasser, Energienahrung, Windbreaker/Regenjacke.",
    },
    it: {
      question: "Qual è l'attrezzatura obbligatoria?",
      answer:
        "Per tutte le gare di trail: abbigliamento e calzature adeguate, telefono cellulare, coperta termica e fischietto. Raccomandato: GPS, crema solare, cappello, acqua, cibo energetico, antivento/impermeabile.",
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
    "Há promoção para equipas?",
    "Sim! Por cada 10 atletas inscritos no Trail Longo, Trail Curto ou Mini Trail da mesma equipa, a organização oferece a inscrição do 11º atleta. As inscrições encerram a 23 de fevereiro de 2026 às 23h59 ou ao atingir o limite de 1000 participantes."
  );

  const faq3Translations = {
    pt: {
      question: "Há promoção para equipas?",
      answer:
        "Sim! Por cada 10 atletas inscritos no Trail Longo, Trail Curto ou Mini Trail da mesma equipa, a organização oferece a inscrição do 11º atleta. As inscrições encerram a 23 de fevereiro de 2026 às 23h59 ou ao atingir o limite de 1000 participantes.",
    },
    en: {
      question: "Is there a team promotion?",
      answer:
        "Yes! For every 10 registered athletes in the Long Trail, Short Trail or Mini Trail from the same team, the organization offers the 11th registration free. Registration closes on February 23, 2026 at 11:59pm or upon reaching 1000 participants.",
    },
    es: {
      question: "¿Hay promoción para equipos?",
      answer:
        "¡Sí! Por cada 10 atletas inscritos en el Trail Largo, Trail Corto o Mini Trail del mismo equipo, la organización ofrece la inscripción del 11º atleta. Las inscripciones cierran el 23 de febrero de 2026 a las 23:59 o al alcanzar el límite de 1000 participantes.",
    },
    fr: {
      question: "Y a-t-il une promotion pour les équipes?",
      answer:
        "Oui! Pour chaque 10 athlètes inscrits au Trail Long, Trail Court ou Mini Trail de la même équipe, l'organisation offre l'inscription du 11ème athlète. Les inscriptions ferment le 23 février 2026 à 23h59 ou en atteignant 1000 participants.",
    },
    de: {
      question: "Gibt es eine Team-Aktion?",
      answer:
        "Ja! Für je 10 angemeldete Athleten im Langen Trail, Kurzen Trail oder Mini Trail aus demselben Team bietet die Organisation die 11. Anmeldung kostenlos an. Anmeldeschluss ist der 23. Februar 2026 um 23:59 Uhr oder bei Erreichen von 1000 Teilnehmern.",
    },
    it: {
      question: "C'è una promozione per le squadre?",
      answer:
        "Sì! Per ogni 10 atleti iscritti al Trail Lungo, Trail Corto o Mini Trail della stessa squadra, l'organizzazione offre l'iscrizione dell'11º atleta. Le iscrizioni chiudono il 23 febbraio 2026 alle 23:59 o al raggiungimento di 1000 partecipanti.",
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

  console.log("\n🎉 IX Nelas Trail Running 2026 seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
