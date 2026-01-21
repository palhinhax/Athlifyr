/**
 * Seed Trail Manuelino 2026
 * Complete with translations in all 6 languages
 * 5th edition trail running event in Abiul, Pombal, Portugal
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Trail Manuelino 2026...");

  // Step 1: Upsert the event
  const event = await prisma.event.upsert({
    where: { slug: "trail-manuelino-2026" },
    update: {
      title: "Trail Manuelino 2026",
      description: `## 🏔️ Trail Manuelino 2026 – 5ª Edição

**Uma experiência única de trail running na Serra do Sicó!**

A 5ª edição do Trail Manuelino realiza-se em Abiul, Pombal, uma freguesia de montes e vales com uma beleza paisagística única, onde o verde da serra se une com a história de cada canto das suas ruas.

### 🏃 As Provas

**Trail 32km** - Percurso competitivo que integra o Circuito de Trail ADAL e Trail Series 100
- Distância: 32 km
- Tempo limite: 5 horas
- Desnível positivo acumulado
- Percurso técnico por trilhos, carreiros e estradões

**Trail Sprint 18km** - Prova rápida e técnica
- Distância: 18 km
- Tempo limite: 4 horas
- Parte do Circuito Trail Sprint Series 100

**Mini Trail 12km** - Desafio acessível
- Distância: 12 km
- Tempo limite: 3 horas
- Ideal para iniciantes em trail

**Caminhada 12km** - Para todos os níveis
- Distância: 12 km
- Tempo limite: 5 horas
- Ambiente familiar e descontraído

**Trail Kids 1.5km** - Para os mais jovens
- Distância: 1.5 km
- Partida no sábado às 16h30
- Acompanhados por adulto

### 🎒 Material Obrigatório

**Trail 32km e Trail Sprint 18km:**
- 🔔 Apito
- 🧊 Manta térmica
- 📱 Telemóvel operacional
- 💧 Recipiente para água
- 🪪 Documento de identificação

**Mini Trail 12km:**
- 📱 Telemóvel operacional
- 💧 Recipiente para água
- 🪪 Documento de identificação

⚠️ **Penalização de 15 minutos** para quem não apresentar o material obrigatório.

### 🎁 Kit de Participante

- Dorsal personalizado
- T-shirt
- Abastecimentos de sólidos e líquidos
- Seguro
- Prémio finisher
- Brindes
- Massagens e banhos

### 🏆 Prémios

**Trail 32km e Trail Sprint 18km:**
- Troféus para os 3 primeiros M/F absolutos
- Troféus para os 3 primeiros M/F por escalão

**Mini Trail 12km:**
- Troféus para os 3 primeiros M/F absolutos

**Prémio Especial:**
- Equipa mais numerosa

### 📅 Programa

**Sábado, 31 Janeiro 2026:**
- 16h00 - Abertura do secretariado
- 16h30 - Partida Trail Kids

**Domingo, 1 Fevereiro 2026:**
- 07h00 - Abertura do secretariado
- 07h15 - Transfers para o trail
- 09h00 - Partida Trail 32km
- 09h10 - Partida Trail Sprint 18km
- 09h20 - Partida Mini Trail 12km
- 09h25 - Partida Caminhada 12km
- 12h30 - Almoço
- 13h00 - Cerimónia de entrega de prémios

### 🍽️ Opções Extras

- Almoço: €5.00 (reserva obrigatória)
- Almoço vegetariano: €5.00
- Almoço acompanhante: €5.00
- Almoço no dia: €8.00

💚 Evento sustentável com foco na redução de desperdícios alimentares!

### ℹ️ Informações Importantes

- Parte do **Circuito de Trail ADAL – Derovo – Fullprotein**
- Integra **Trail e Trail Sprint Series 100** da Associação Trail Running de Portugal
- Desconto de €1 para atletas filiados na ADAL
- Limite de 600 participantes
- Inscrições até 18/01/2026 às 23:59h
- Idade mínima: 14 anos (Trail), 6 anos (Caminhada e Trail Kids)

📍 **Local:** Junta de Freguesia de Abiul (39.874900, -8.539243)`,
      startDate: new Date("2026-02-01T09:00:00Z"),
      endDate: new Date("2026-02-01T17:00:00Z"),
      registrationDeadline: new Date("2026-01-18T23:59:59Z"),
      sportTypes: [SportType.TRAIL, SportType.RUNNING],
      city: "Pombal",
      country: "Portugal",
      latitude: 39.874835,
      longitude: -8.53978,
      externalUrl: "https://www.recordepessoal.pt",
      imageUrl: "",
    },
    create: {
      title: "Trail Manuelino 2026",
      slug: "trail-manuelino-2026",
      description: `## 🏔️ Trail Manuelino 2026 – 5ª Edição

**Uma experiência única de trail running na Serra do Sicó!**

A 5ª edição do Trail Manuelino realiza-se em Abiul, Pombal, uma freguesia de montes e vales com uma beleza paisagística única, onde o verde da serra se une com a história de cada canto das suas ruas.

### 🏃 As Provas

**Trail 32km** - Percurso competitivo que integra o Circuito de Trail ADAL e Trail Series 100
- Distância: 32 km
- Tempo limite: 5 horas
- Desnível positivo acumulado
- Percurso técnico por trilhos, carreiros e estradões

**Trail Sprint 18km** - Prova rápida e técnica
- Distância: 18 km
- Tempo limite: 4 horas
- Parte do Circuito Trail Sprint Series 100

**Mini Trail 12km** - Desafio acessível
- Distância: 12 km
- Tempo limite: 3 horas
- Ideal para iniciantes em trail

**Caminhada 12km** - Para todos os níveis
- Distância: 12 km
- Tempo limite: 5 horas
- Ambiente familiar e descontraído

**Trail Kids 1.5km** - Para os mais jovens
- Distância: 1.5 km
- Partida no sábado às 16h30
- Acompanhados por adulto

### 🎒 Material Obrigatório

**Trail 32km e Trail Sprint 18km:**
- 🔔 Apito
- 🧊 Manta térmica
- 📱 Telemóvel operacional
- 💧 Recipiente para água
- 🪪 Documento de identificação

**Mini Trail 12km:**
- 📱 Telemóvel operacional
- 💧 Recipiente para água
- 🪪 Documento de identificação

⚠️ **Penalização de 15 minutos** para quem não apresentar o material obrigatório.

### 🎁 Kit de Participante

- Dorsal personalizado
- T-shirt
- Abastecimentos de sólidos e líquidos
- Seguro
- Prémio finisher
- Brindes
- Massagens e banhos

### 🏆 Prémios

**Trail 32km e Trail Sprint 18km:**
- Troféus para os 3 primeiros M/F absolutos
- Troféus para os 3 primeiros M/F por escalão

**Mini Trail 12km:**
- Troféus para os 3 primeiros M/F absolutos

**Prémio Especial:**
- Equipa mais numerosa

### 📅 Programa

**Sábado, 31 Janeiro 2026:**
- 16h00 - Abertura do secretariado
- 16h30 - Partida Trail Kids

**Domingo, 1 Fevereiro 2026:**
- 07h00 - Abertura do secretariado
- 07h15 - Transfers para o trail
- 09h00 - Partida Trail 32km
- 09h10 - Partida Trail Sprint 18km
- 09h20 - Partida Mini Trail 12km
- 09h25 - Partida Caminhada 12km
- 12h30 - Almoço
- 13h00 - Cerimónia de entrega de prémios

### 🍽️ Opções Extras

- Almoço: €5.00 (reserva obrigatória)
- Almoço vegetariano: €5.00
- Almoço acompanhante: €5.00
- Almoço no dia: €8.00

💚 Evento sustentável com foco na redução de desperdícios alimentares!

### ℹ️ Informações Importantes

- Parte do **Circuito de Trail ADAL – Derovo – Fullprotein**
- Integra **Trail e Trail Sprint Series 100** da Associação Trail Running de Portugal
- Desconto de €1 para atletas filiados na ADAL
- Limite de 600 participantes
- Inscrições até 18/01/2026 às 23:59h
- Idade mínima: 14 anos (Trail), 6 anos (Caminhada e Trail Kids)

📍 **Local:** Junta de Freguesia de Abiul (39.874900, -8.539243)`,
      startDate: new Date("2026-02-01T09:00:00Z"),
      endDate: new Date("2026-02-01T17:00:00Z"),
      registrationDeadline: new Date("2026-01-18T23:59:59Z"),
      sportTypes: [SportType.TRAIL, SportType.RUNNING],
      city: "Pombal",
      country: "Portugal",
      latitude: 39.874835,
      longitude: -8.53978,
      externalUrl: "https://www.recordepessoal.pt",
      imageUrl: "",
    },
  });

  console.log(`✅ Event upserted with ID: ${event.id}`);

  // Step 2: Upsert translations for all 6 languages
  const languages = [
    Language.pt,
    Language.en,
    Language.es,
    Language.fr,
    Language.de,
    Language.it,
  ];

  const translations = {
    pt: {
      title: "Trail Manuelino 2026",
      description: `## 🏔️ Trail Manuelino 2026 – 5ª Edição

**Uma experiência única de trail running na Serra do Sicó!**

A 5ª edição do Trail Manuelino realiza-se em Abiul, Pombal, uma freguesia de montes e vales com uma beleza paisagística única, onde o verde da serra se une com a história de cada canto das suas ruas.

### 🏃 As Provas

**Trail 32km** - Percurso competitivo que integra o Circuito de Trail ADAL e Trail Series 100
- Distância: 32 km
- Tempo limite: 5 horas
- Desnível positivo acumulado
- Percurso técnico por trilhos, carreiros e estradões

**Trail Sprint 18km** - Prova rápida e técnica
- Distância: 18 km
- Tempo limite: 4 horas
- Parte do Circuito Trail Sprint Series 100

**Mini Trail 12km** - Desafio acessível
- Distância: 12 km
- Tempo limite: 3 horas
- Ideal para iniciantes em trail

**Caminhada 12km** - Para todos os níveis
- Distância: 12 km
- Tempo limite: 5 horas
- Ambiente familiar e descontraído

**Trail Kids 1.5km** - Para os mais jovens
- Distância: 1.5 km
- Partida no sábado às 16h30
- Acompanhados por adulto

### 🎒 Material Obrigatório

**Trail 32km e Trail Sprint 18km:**
- 🔔 Apito
- 🧊 Manta térmica
- 📱 Telemóvel operacional
- 💧 Recipiente para água
- 🪪 Documento de identificação

**Mini Trail 12km:**
- 📱 Telemóvel operacional
- 💧 Recipiente para água
- 🪪 Documento de identificação

⚠️ **Penalização de 15 minutos** para quem não apresentar o material obrigatório.`,
      city: "Pombal",
    },
    en: {
      title: "Trail Manuelino 2026",
      description: `## 🏔️ Trail Manuelino 2026 – 5th Edition

**A unique trail running experience in Serra do Sicó!**

The 5th edition of Trail Manuelino takes place in Abiul, Pombal, a parish of hills and valleys with unique scenic beauty, where the green of the mountains meets the history of every corner of its streets.

### 🏃 The Races

**Trail 32km** - Competitive route part of ADAL Trail Circuit and Trail Series 100
- Distance: 32 km
- Time limit: 5 hours
- Accumulated positive elevation
- Technical course through trails and dirt roads

**Trail Sprint 18km** - Fast and technical race
- Distance: 18 km
- Time limit: 4 hours
- Part of Trail Sprint Series 100 Circuit

**Mini Trail 12km** - Accessible challenge
- Distance: 12 km
- Time limit: 3 hours
- Ideal for trail beginners

**Walk 12km** - For all levels
- Distance: 12 km
- Time limit: 5 hours
- Family-friendly atmosphere

**Trail Kids 1.5km** - For the youngest
- Distance: 1.5 km
- Start on Saturday at 4:30 PM
- Accompanied by adult

### 🎒 Mandatory Equipment

**Trail 32km and Trail Sprint 18km:**
- 🔔 Whistle
- 🧊 Thermal blanket
- 📱 Operational mobile phone
- 💧 Water container
- 🪪 Identification document

**Mini Trail 12km:**
- 📱 Operational mobile phone
- 💧 Water container
- 🪪 Identification document

⚠️ **15-minute penalty** for those without mandatory equipment.`,
      city: "Pombal",
    },
    es: {
      title: "Trail Manuelino 2026",
      description: `## 🏔️ Trail Manuelino 2026 – 5ª Edición

**¡Una experiencia única de trail running en Serra do Sicó!**

La 5ª edición del Trail Manuelino se celebra en Abiul, Pombal, una parroquia de montes y valles con una belleza paisajística única, donde el verde de la sierra se une con la historia de cada rincón de sus calles.

### 🏃 Las Carreras

**Trail 32km** - Recorrido competitivo parte del Circuito Trail ADAL y Trail Series 100
- Distancia: 32 km
- Límite de tiempo: 5 horas
- Desnivel positivo acumulado
- Recorrido técnico por senderos y caminos

**Trail Sprint 18km** - Carrera rápida y técnica
- Distancia: 18 km
- Límite de tiempo: 4 horas
- Parte del Circuito Trail Sprint Series 100

**Mini Trail 12km** - Desafío accesible
- Distancia: 12 km
- Límite de tiempo: 3 horas
- Ideal para principiantes en trail

**Caminata 12km** - Para todos los niveles
- Distancia: 12 km
- Límite de tiempo: 5 horas
- Ambiente familiar y relajado

**Trail Kids 1.5km** - Para los más jóvenes
- Distancia: 1.5 km
- Salida el sábado a las 16h30
- Acompañados por adulto

### 🎒 Material Obligatorio

**Trail 32km y Trail Sprint 18km:**
- 🔔 Silbato
- 🧊 Manta térmica
- 📱 Teléfono móvil operativo
- 💧 Recipiente para agua
- 🪪 Documento de identificación

**Mini Trail 12km:**
- 📱 Teléfono móvil operativo
- 💧 Recipiente para agua
- 🪪 Documento de identificación

⚠️ **Penalización de 15 minutos** para quien no presente el material obligatorio.`,
      city: "Pombal",
    },
    fr: {
      title: "Trail Manuelino 2026",
      description: `## 🏔️ Trail Manuelino 2026 – 5ème Édition

**Une expérience unique de trail running dans la Serra do Sicó !**

La 5ème édition du Trail Manuelino a lieu à Abiul, Pombal, une paroisse de collines et vallées à la beauté paysagère unique, où le vert de la montagne s'unit à l'histoire de chaque coin de ses rues.

### 🏃 Les Courses

**Trail 32km** - Parcours compétitif intégrant le Circuit Trail ADAL et Trail Series 100
- Distance : 32 km
- Limite de temps : 5 heures
- Dénivelé positif cumulé
- Parcours technique sur sentiers et chemins

**Trail Sprint 18km** - Course rapide et technique
- Distance : 18 km
- Limite de temps : 4 heures
- Partie du Circuit Trail Sprint Series 100

**Mini Trail 12km** - Défi accessible
- Distance : 12 km
- Limite de temps : 3 heures
- Idéal pour les débutants en trail

**Randonnée 12km** - Pour tous les niveaux
- Distance : 12 km
- Limite de temps : 5 heures
- Ambiance familiale et décontractée

**Trail Kids 1.5km** - Pour les plus jeunes
- Distance : 1.5 km
- Départ le samedi à 16h30
- Accompagnés d'un adulte

### 🎒 Matériel Obligatoire

**Trail 32km et Trail Sprint 18km :**
- 🔔 Sifflet
- 🧊 Couverture de survie
- 📱 Téléphone portable opérationnel
- 💧 Récipient pour l'eau
- 🪪 Document d'identité

**Mini Trail 12km :**
- 📱 Téléphone portable opérationnel
- 💧 Récipient pour l'eau
- 🪪 Document d'identité

⚠️ **Pénalité de 15 minutes** pour ceux sans matériel obligatoire.`,
      city: "Pombal",
    },
    de: {
      title: "Trail Manuelino 2026",
      description: `## 🏔️ Trail Manuelino 2026 – 5. Ausgabe

**Ein einzigartiges Trailrunning-Erlebnis in der Serra do Sicó!**

Die 5. Ausgabe des Trail Manuelino findet in Abiul, Pombal statt, einer Gemeinde mit Bergen und Tälern von einzigartiger landschaftlicher Schönheit, wo das Grün der Berge auf die Geschichte jeder Ecke seiner Straßen trifft.

### 🏃 Die Rennen

**Trail 32km** - Wettkampfstrecke Teil der ADAL Trail Circuit und Trail Series 100
- Entfernung: 32 km
- Zeitlimit: 5 Stunden
- Kumulierter positiver Höhenunterschied
- Technischer Kurs über Pfade und Feldwege

**Trail Sprint 18km** - Schnelles und technisches Rennen
- Entfernung: 18 km
- Zeitlimit: 4 Stunden
- Teil der Trail Sprint Series 100

**Mini Trail 12km** - Zugängliche Herausforderung
- Entfernung: 12 km
- Zeitlimit: 3 Stunden
- Ideal für Trail-Anfänger

**Wanderung 12km** - Für alle Niveaus
- Entfernung: 12 km
- Zeitlimit: 5 Stunden
- Familienfreundliche Atmosphäre

**Trail Kids 1.5km** - Für die Jüngsten
- Entfernung: 1.5 km
- Start am Samstag um 16:30 Uhr
- Begleitet von Erwachsenen

### 🎒 Pflichtausrüstung

**Trail 32km und Trail Sprint 18km:**
- 🔔 Pfeife
- 🧊 Rettungsdecke
- 📱 Funktionierendes Mobiltelefon
- 💧 Wasserbehälter
- 🪪 Ausweisdokument

**Mini Trail 12km:**
- 📱 Funktionierendes Mobiltelefon
- 💧 Wasserbehälter
- 🪪 Ausweisdokument

⚠️ **15 Minuten Strafe** für Teilnehmer ohne Pflichtausrüstung.`,
      city: "Pombal",
    },
    it: {
      title: "Trail Manuelino 2026",
      description: `## 🏔️ Trail Manuelino 2026 – 5ª Edizione

**Un'esperienza unica di trail running nella Serra do Sicó!**

La 5ª edizione del Trail Manuelino si svolge ad Abiul, Pombal, una parrocchia di monti e valli con una bellezza paesaggistica unica, dove il verde della montagna si unisce alla storia di ogni angolo delle sue strade.

### 🏃 Le Gare

**Trail 32km** - Percorso competitivo parte del Circuito Trail ADAL e Trail Series 100
- Distanza: 32 km
- Limite di tempo: 5 ore
- Dislivello positivo accumulato
- Percorso tecnico su sentieri e strade sterrate

**Trail Sprint 18km** - Gara veloce e tecnica
- Distanza: 18 km
- Limite di tempo: 4 ore
- Parte del Circuito Trail Sprint Series 100

**Mini Trail 12km** - Sfida accessibile
- Distanza: 12 km
- Limite di tempo: 3 ore
- Ideale per principianti del trail

**Camminata 12km** - Per tutti i livelli
- Distanza: 12 km
- Limite di tempo: 5 ore
- Atmosfera familiare e rilassata

**Trail Kids 1.5km** - Per i più giovani
- Distanza: 1.5 km
- Partenza sabato alle 16:30
- Accompagnati da adulto

### 🎒 Attrezzatura Obbligatoria

**Trail 32km e Trail Sprint 18km:**
- 🔔 Fischietto
- 🧊 Coperta termica
- 📱 Telefono cellulare operativo
- 💧 Contenitore per acqua
- 🪪 Documento d'identità

**Mini Trail 12km:**
- 📱 Telefono cellulare operativo
- 💧 Contenitore per acqua
- 🪪 Documento d'identità

⚠️ **Penalità di 15 minuti** per chi non presenta l'attrezzatura obbligatoria.`,
      city: "Pombal",
    },
  };

  for (const lang of languages) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: lang,
        },
      },
      update: {
        title: translations[lang].title,
        description: translations[lang].description,
        city: translations[lang].city,
      },
      create: {
        eventId: event.id,
        language: lang,
        title: translations[lang].title,
        description: translations[lang].description,
        city: translations[lang].city,
      },
    });
  }

  console.log(
    "📝 Translations upserted for 6 languages (pt, en, es, fr, de, it)"
  );

  // Step 3: Delete existing variants and create new ones
  await prisma.eventVariant.deleteMany({
    where: { eventId: event.id },
  });

  // Create variants
  const trail32km = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Trail 32km",
      distanceKm: 32,
      elevationGainM: null,
      startTime: "09:00",
      cutoffTimeHours: 5.0,
    },
  });

  const trailSprint18km = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Trail Sprint 18km",
      distanceKm: 18,
      elevationGainM: null,
      startTime: "09:10",
      cutoffTimeHours: 4.0,
    },
  });

  const miniTrail12km = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Mini Trail 12km",
      distanceKm: 12,
      elevationGainM: null,
      startTime: "09:20",
      cutoffTimeHours: 3.0,
    },
  });

  const caminhada12km = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Caminhada 12km",
      distanceKm: 12,
      elevationGainM: null,
      startTime: "09:25",
      cutoffTimeHours: 5.0,
    },
  });

  const trailKids = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Trail Kids",
      distanceKm: 2, // 1.5km rounded to 2km for display purposes
      elevationGainM: null,
      startTime: "16:30",
      cutoffTimeHours: null,
      startDate: new Date("2026-01-31T16:30:00Z"), // Saturday start
    },
  });

  const variants = [
    trail32km,
    trailSprint18km,
    miniTrail12km,
    caminhada12km,
    trailKids,
  ];

  console.log("🏃 Variants created (5 variants)");

  // Step 4: Upsert variant translations
  const variantTranslations: Record<
    string,
    Record<string, { name: string; description: string }>
  > = {
    "Trail 32km": {
      pt: {
        name: "Trail 32km",
        description:
          "Percurso competitivo de 32km com tempo limite de 5 horas. Parte do Circuito ADAL e Trail Series 100.",
      },
      en: {
        name: "Trail 32km",
        description:
          "Competitive 32km course with 5-hour time limit. Part of ADAL Circuit and Trail Series 100.",
      },
      es: {
        name: "Trail 32km",
        description:
          "Recorrido competitivo de 32km con límite de 5 horas. Parte del Circuito ADAL y Trail Series 100.",
      },
      fr: {
        name: "Trail 32km",
        description:
          "Parcours compétitif de 32km avec limite de 5 heures. Partie du Circuit ADAL et Trail Series 100.",
      },
      de: {
        name: "Trail 32km",
        description:
          "Wettkampfstrecke von 32km mit 5-Stunden-Limit. Teil des ADAL-Circuits und Trail Series 100.",
      },
      it: {
        name: "Trail 32km",
        description:
          "Percorso competitivo di 32km con limite di 5 ore. Parte del Circuito ADAL e Trail Series 100.",
      },
    },
    "Trail Sprint 18km": {
      pt: {
        name: "Trail Sprint 18km",
        description:
          "Prova rápida de 18km com tempo limite de 4 horas. Parte do Trail Sprint Series 100.",
      },
      en: {
        name: "Trail Sprint 18km",
        description:
          "Fast 18km race with 4-hour time limit. Part of Trail Sprint Series 100.",
      },
      es: {
        name: "Trail Sprint 18km",
        description:
          "Carrera rápida de 18km con límite de 4 horas. Parte del Trail Sprint Series 100.",
      },
      fr: {
        name: "Trail Sprint 18km",
        description:
          "Course rapide de 18km avec limite de 4 heures. Partie du Trail Sprint Series 100.",
      },
      de: {
        name: "Trail Sprint 18km",
        description:
          "Schnelles 18km-Rennen mit 4-Stunden-Limit. Teil der Trail Sprint Series 100.",
      },
      it: {
        name: "Trail Sprint 18km",
        description:
          "Gara veloce di 18km con limite di 4 ore. Parte del Trail Sprint Series 100.",
      },
    },
    "Mini Trail 12km": {
      pt: {
        name: "Mini Trail 12km",
        description:
          "Percurso acessível de 12km com tempo limite de 3 horas. Ideal para iniciantes.",
      },
      en: {
        name: "Mini Trail 12km",
        description:
          "Accessible 12km course with 3-hour time limit. Ideal for beginners.",
      },
      es: {
        name: "Mini Trail 12km",
        description:
          "Recorrido accesible de 12km con límite de 3 horas. Ideal para principiantes.",
      },
      fr: {
        name: "Mini Trail 12km",
        description:
          "Parcours accessible de 12km avec limite de 3 heures. Idéal pour débutants.",
      },
      de: {
        name: "Mini Trail 12km",
        description:
          "Zugängliche 12km-Strecke mit 3-Stunden-Limit. Ideal für Anfänger.",
      },
      it: {
        name: "Mini Trail 12km",
        description:
          "Percorso accessibile di 12km con limite di 3 ore. Ideale per principianti.",
      },
    },
    "Caminhada 12km": {
      pt: {
        name: "Caminhada 12km",
        description:
          "Caminhada de 12km para todos os níveis com tempo limite de 5 horas. Ambiente familiar.",
      },
      en: {
        name: "Walk 12km",
        description:
          "12km walk for all levels with 5-hour time limit. Family-friendly atmosphere.",
      },
      es: {
        name: "Caminata 12km",
        description:
          "Caminata de 12km para todos los niveles con límite de 5 horas. Ambiente familiar.",
      },
      fr: {
        name: "Randonnée 12km",
        description:
          "Randonnée de 12km pour tous niveaux avec limite de 5 heures. Ambiance familiale.",
      },
      de: {
        name: "Wanderung 12km",
        description:
          "12km-Wanderung für alle Niveaus mit 5-Stunden-Limit. Familienfreundlich.",
      },
      it: {
        name: "Camminata 12km",
        description:
          "Camminata di 12km per tutti i livelli con limite di 5 ore. Atmosfera familiare.",
      },
    },
    "Trail Kids": {
      pt: {
        name: "Trail Kids",
        description:
          "Percurso de 1.5km para os mais jovens. Partida no sábado às 16h30. Acompanhados por adulto.",
      },
      en: {
        name: "Trail Kids",
        description:
          "1.5km course for the youngest. Start on Saturday at 4:30 PM. Accompanied by adult.",
      },
      es: {
        name: "Trail Kids",
        description:
          "Recorrido de 1.5km para los más jóvenes. Salida el sábado a las 16h30. Acompañados por adulto.",
      },
      fr: {
        name: "Trail Kids",
        description:
          "Parcours de 1.5km pour les plus jeunes. Départ le samedi à 16h30. Accompagnés d'un adulte.",
      },
      de: {
        name: "Trail Kids",
        description:
          "1.5km-Strecke für die Jüngsten. Start am Samstag um 16:30 Uhr. Begleitet von Erwachsenen.",
      },
      it: {
        name: "Trail Kids",
        description:
          "Percorso di 1.5km per i più giovani. Partenza sabato alle 16:30. Accompagnati da adulto.",
      },
    },
  };

  for (const variant of variants) {
    for (const lang of languages) {
      await prisma.eventVariantTranslation.upsert({
        where: {
          variantId_language: {
            variantId: variant.id,
            language: lang,
          },
        },
        update: {
          name: variantTranslations[variant.name][lang].name,
          description: variantTranslations[variant.name][lang].description,
        },
        create: {
          variantId: variant.id,
          language: lang,
          name: variantTranslations[variant.name][lang].name,
          description: variantTranslations[variant.name][lang].description,
        },
      });
    }
  }

  console.log("📝 Variant translations upserted for all 5 variants");

  // Step 5: Create pricing phases (using eventId pattern)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const findOrCreatePricingPhase = async (name: string, data: any) => {
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
        data: {
          eventId: event.id,
          name,
          ...data,
        },
      });
    }
  };

  // Trail 32km - 1ª Fase
  await findOrCreatePricingPhase("Trail 32km - 1ª Fase", {
    startDate: new Date("2025-11-01T00:00:00Z"),
    endDate: new Date("2025-12-31T23:59:59Z"),
    price: 16.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Inscrição antecipada para Trail 32km. Desconto de €1 para atletas filiados na ADAL.",
  });

  // Trail 32km - 2ª Fase
  await findOrCreatePricingPhase("Trail 32km - 2ª Fase", {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-01-18T23:59:59Z"),
    price: 18.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Inscrição normal para Trail 32km. Desconto de €1 para atletas filiados na ADAL.",
  });

  // Trail Sprint 18km - 1ª Fase
  await findOrCreatePricingPhase("Trail Sprint 18km - 1ª Fase", {
    startDate: new Date("2025-11-01T00:00:00Z"),
    endDate: new Date("2025-12-31T23:59:59Z"),
    price: 15.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Inscrição antecipada para Trail Sprint 18km. Desconto de €1 para atletas filiados na ADAL.",
  });

  // Trail Sprint 18km - 2ª Fase
  await findOrCreatePricingPhase("Trail Sprint 18km - 2ª Fase", {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-01-18T23:59:59Z"),
    price: 17.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Inscrição normal para Trail Sprint 18km. Desconto de €1 para atletas filiados na ADAL.",
  });

  // Mini Trail 12km - 1ª Fase
  await findOrCreatePricingPhase("Mini Trail 12km - 1ª Fase", {
    startDate: new Date("2025-11-01T00:00:00Z"),
    endDate: new Date("2025-12-31T23:59:59Z"),
    price: 14.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Inscrição antecipada para Mini Trail 12km. Desconto de €1 para atletas filiados na ADAL.",
  });

  // Mini Trail 12km - 2ª Fase
  await findOrCreatePricingPhase("Mini Trail 12km - 2ª Fase", {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-01-18T23:59:59Z"),
    price: 16.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Inscrição normal para Mini Trail 12km. Desconto de €1 para atletas filiados na ADAL.",
  });

  // Caminhada 12km - 1ª Fase
  await findOrCreatePricingPhase("Caminhada 12km - 1ª Fase", {
    startDate: new Date("2025-11-01T00:00:00Z"),
    endDate: new Date("2025-12-31T23:59:59Z"),
    price: 11.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Inscrição antecipada para Caminhada 12km.",
  });

  // Caminhada 12km - 2ª Fase
  await findOrCreatePricingPhase("Caminhada 12km - 2ª Fase", {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-01-18T23:59:59Z"),
    price: 13.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Inscrição normal para Caminhada 12km.",
  });

  // Trail Kids - Preço único
  await findOrCreatePricingPhase("Trail Kids - Inscrição", {
    startDate: new Date("2025-11-01T00:00:00Z"),
    endDate: new Date("2026-01-18T23:59:59Z"),
    price: 5.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Inscrição para Trail Kids (preço único durante todo o período de inscrições).",
  });

  console.log("💰 Pricing phases created (9 phases for 5 variants)");
  console.log("\n🎉 Trail Manuelino 2026 seed completed successfully!");
  console.log("📍 Location: Abiul, Pombal, Portugal");
  console.log("📅 Date: February 1, 2026");
  console.log(
    "🏃 5 variants: Trail 32km, Trail Sprint 18km, Mini Trail 12km, Caminhada 12km, Trail Kids"
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
