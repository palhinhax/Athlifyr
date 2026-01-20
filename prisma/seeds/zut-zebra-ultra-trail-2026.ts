/**
 * Seed ZUT - Zebra Ultra Trail 2026
 * Complete with translations in all 6 languages
 * Event date: February 15, 2026
 * Location: Cordinhã, Cantanhede, Portugal
 */

import { PrismaClient, SportType, Language } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding ZUT - Zebra Ultra Trail 2026...");

  // Event data (used in both update and create)
  const eventData = {
    title: "ZUT - Zebra Ultra Trail",
    sportTypes: [SportType.TRAIL],
    startDate: new Date("2026-02-15T08:00:00.000Z"),
    endDate: new Date("2026-02-15T17:00:00.000Z"),
    registrationDeadline: new Date("2026-02-08T23:59:00.000Z"),
    city: "Cordinhã, Cantanhede",
    country: "Portugal",
    description: `## 🏔️ ZUT – Zebra Ultra Trail 2026

**Primeira edição do ZUT – Zebra Ultra Trail**

A primeira edição do ZUT – Zebra Ultra Trail está agendada para o dia **15 de fevereiro de 2026**, em **Cordinhã, Cantanhede**. Esta prova de trail running percorrerá trilhos maioritariamente envolventes à localidade da Cordinhã, no município de Cantanhede.

### 🏃 As Provas

**Ultra Trail ZUT - 45 km**
- 📏 Distância: 45 km
- 📈 Dificuldade: Alta
- 🏆 Natureza: Competitiva
- ⏱️ Tempo limite: 8 horas
- 🎽 Cronometragem: Chip eletrónico
- 🕐 Partida: 08:00

**Trail Longo ZUT - 25 km**
- 📏 Distância: 25 km
- 📈 Dificuldade: Média
- 🏆 Natureza: Competitiva
- ⏱️ Tempo limite: 6 horas
- 🎽 Cronometragem: Chip eletrónico
- 🕐 Partida: 09:00

**Mini Trail ZUT - 15 km (ADAC)**
- 📏 Distância: 15 km
- 📈 Dificuldade: Baixa/Média
- 🏆 Natureza: Competitiva
- ⏱️ Tempo limite: 3 horas
- 🎽 Cronometragem: Chip eletrónico
- 🕐 Partida: 09:30
- 🎯 Pontuável para o Circuito Distrital Trail Running Coimbra (CDTRC)

**Caminhada ZUT - 10 km**
- 📏 Distância: 10 km
- 📈 Dificuldade: Lúdica
- 🏆 Natureza: Não competitiva
- ⏱️ Tempo limite: 4 horas
- 🕐 Partida: 09:45

### 👥 Idade Mínima de Participação

- **Mini Trail:** ≥ 16 anos
- **Trail Longo:** ≥ 18 anos
- **Ultra Trail:** ≥ 20 anos
- **Caminhada:** Aberta a todas as idades (menores de 16 anos acompanhados por adulto)

### 📅 Programa

**Sábado, 14 de fevereiro de 2026**
- 14:00 – Abertura do Secretariado (Polidesportivo da Cordinhã – antigo campo do Botafogo)
- 21:00 – Encerramento do Secretariado

**Domingo, 15 de fevereiro de 2026**
- 07:00 – Reabertura do Secretariado
- 08:00 – Briefing e partida Ultra Trail (45 km)
- 08:30 – Controlo Zero Trail Longo (25 km)
- 09:00 – Partida Trail Longo
- 09:15 – Controlo Zero Mini Trail (15 km)
- 09:30 – Partida Mini Trail
- 09:45 – Partida Caminhada (10 km)
- 13:00 – Entrega de prémios
- 17:00 – Encerramento do Secretariado

*Programa sujeito a alterações*

### 🎒 Material Obrigatório

- 📱 Telemóvel operacional (Obrigatório)
- 🔊 Apito (Obrigatório)
- 🧊 Manta térmica (Obrigatório)

*Atletas que não cumpram com as regras de material obrigatório serão penalizados com a adição de três minutos ao seu tempo de prova total.*

### 🏆 Prémios

**Ultra Trail 45k**
- Troféus aos 5 primeiros classificados da Geral (Masculinos e Femininos)

**Trail Longo 25k**
- Troféus aos 5 primeiros classificados da Geral (Masculinos e Femininos)

**Mini Trail 15k**
- Troféus aos 3 primeiros classificados da Geral (Masculinos e Femininos)
- Troféus aos 3 primeiros de cada escalão
- Troféus às 3 primeiras equipas (Masculinos/Femininos)

### 📋 Escalões

Idade considerável: **30/09/2025** (fim de época 2024/2025)

- SUB-18: 16–17 anos
- SUB-20: 18–19 anos
- SUB-23: 20–22 anos
- SEN: 23–34 anos
- M35/F35: 35–39 anos
- M40/F40: 40–44 anos
- M45/F45: 45–49 anos
- M50+ / F50+: 50+ anos

### 👥 Organização

**Secção de Atletismo do C. F. "Os Marialvas"**

Com o apoio institucional da Câmara Municipal de Cantanhede, Junta de Freguesia da Cordinhã e outras instituições locais de relevo.

### 📞 Contactos

**Direção de Prova:**
- Bruno Pereira – 916 518 956
- Daniela Guerra – 910 871 196
- Helena Sarges – 916 828 012

**E-mail:** clubeatletismomarialvas@gmail.com

### 📝 Inscrições

**Data limite para inscrições:** 08-02-2026 às 23h59

Atletas inscritos na **ADAC** (Associação Distrital de Atletismo de Coimbra) têm desconto de €1,50 na distância de 15K (CDTRC).

---

**Registado por Run Manager** | runmanager.net`,
    externalUrl: "https://runmanager.net/Eventos/zut-zebra-ultra-trail/992",
    imageUrl: "",
    latitude: 40.3315,
    longitude: -8.5889,
    googleMapsUrl: null,
  };

  // Step 1: Upsert the event (no nested relations)
  const event = await prisma.event.upsert({
    where: { slug: "zut-zebra-ultra-trail-2026" },
    update: eventData,
    create: {
      ...eventData,
      slug: "zut-zebra-ultra-trail-2026",
    },
  });

  console.log(`✅ Event upserted: ${event.title} (${event.id})`);

  // Step 2: Upsert translations for all 6 languages
  const translations = {
    pt: {
      title: "ZUT - Zebra Ultra Trail",
      description: `Primeira edição do ZUT – Zebra Ultra Trail em Cordinhã, Cantanhede, a 15 de fevereiro de 2026. 4 distâncias: Ultra Trail 45km, Trail Longo 25km, Mini Trail 15km e Caminhada 10km.`,
      city: "Cordinhã, Cantanhede",
      metaTitle:
        "ZUT - Zebra Ultra Trail 2026 - Cordinhã, Cantanhede, Portugal",
      metaDescription:
        "Participe na primeira edição do ZUT - Zebra Ultra Trail 2026 em Cordinhã, Cantanhede. 4 distâncias disponíveis: Ultra Trail 45km, Trail Longo 25km, Mini Trail 15km e Caminhada 10km. Inscrições até 8 de fevereiro de 2026.",
    },
    en: {
      title: "ZUT - Zebra Ultra Trail",
      description: `First edition of ZUT – Zebra Ultra Trail in Cordinhã, Cantanhede, on February 15, 2026. 4 distances: Ultra Trail 45km, Long Trail 25km, Mini Trail 15km and 10km Walk.`,
      city: "Cordinhã, Cantanhede",
      metaTitle:
        "ZUT - Zebra Ultra Trail 2026 - Cordinhã, Cantanhede, Portugal",
      metaDescription:
        "Join the first edition of ZUT - Zebra Ultra Trail 2026 in Cordinhã, Cantanhede. 4 distances available: Ultra Trail 45km, Long Trail 25km, Mini Trail 15km and 10km Walk. Registration until February 8, 2026.",
    },
    es: {
      title: "ZUT - Zebra Ultra Trail",
      description: `Primera edición del ZUT – Zebra Ultra Trail en Cordinhã, Cantanhede, el 15 de febrero de 2026. 4 distancias: Ultra Trail 45km, Trail Largo 25km, Mini Trail 15km y Caminata 10km.`,
      city: "Cordinhã, Cantanhede",
      metaTitle:
        "ZUT - Zebra Ultra Trail 2026 - Cordinhã, Cantanhede, Portugal",
      metaDescription:
        "Participa en la primera edición del ZUT - Zebra Ultra Trail 2026 en Cordinhã, Cantanhede. 4 distancias disponibles: Ultra Trail 45km, Trail Largo 25km, Mini Trail 15km y Caminata 10km. Inscripciones hasta el 8 de febrero de 2026.",
    },
    fr: {
      title: "ZUT - Zebra Ultra Trail",
      description: `Première édition du ZUT – Zebra Ultra Trail à Cordinhã, Cantanhede, le 15 février 2026. 4 distances : Ultra Trail 45km, Trail Long 25km, Mini Trail 15km et Marche 10km.`,
      city: "Cordinhã, Cantanhede",
      metaTitle:
        "ZUT - Zebra Ultra Trail 2026 - Cordinhã, Cantanhede, Portugal",
      metaDescription:
        "Participez à la première édition du ZUT - Zebra Ultra Trail 2026 à Cordinhã, Cantanhede. 4 distances disponibles : Ultra Trail 45km, Trail Long 25km, Mini Trail 15km et Marche 10km. Inscriptions jusqu'au 8 février 2026.",
    },
    de: {
      title: "ZUT - Zebra Ultra Trail",
      description: `Erste Ausgabe des ZUT – Zebra Ultra Trail in Cordinhã, Cantanhede, am 15. Februar 2026. 4 Distanzen: Ultra Trail 45km, Langer Trail 25km, Mini Trail 15km und 10km Wanderung.`,
      city: "Cordinhã, Cantanhede",
      metaTitle:
        "ZUT - Zebra Ultra Trail 2026 - Cordinhã, Cantanhede, Portugal",
      metaDescription:
        "Nehmen Sie an der ersten Ausgabe des ZUT - Zebra Ultra Trail 2026 in Cordinhã, Cantanhede teil. 4 Distanzen verfügbar: Ultra Trail 45km, Langer Trail 25km, Mini Trail 15km und 10km Wanderung. Anmeldung bis 8. Februar 2026.",
    },
    it: {
      title: "ZUT - Zebra Ultra Trail",
      description: `Prima edizione dello ZUT – Zebra Ultra Trail a Cordinhã, Cantanhede, il 15 febbraio 2026. 4 distanze: Ultra Trail 45km, Trail Lungo 25km, Mini Trail 15km e Camminata 10km.`,
      city: "Cordinhã, Cantanhede",
      metaTitle:
        "ZUT - Zebra Ultra Trail 2026 - Cordinhã, Cantanhede, Portogallo",
      metaDescription:
        "Partecipa alla prima edizione dello ZUT - Zebra Ultra Trail 2026 a Cordinhã, Cantanhede. 4 distanze disponibili: Ultra Trail 45km, Trail Lungo 25km, Mini Trail 15km e Camminata 10km. Iscrizioni fino all'8 febbraio 2026.",
    },
  };

  for (const [lang, content] of Object.entries(translations)) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: lang as Language,
        },
      },
      update: content,
      create: {
        eventId: event.id,
        language: lang as Language,
        ...content,
      },
    });
    console.log(`   ✅ Translation upserted: ${lang}`);
  }

  // Step 3: Upsert variants separately (no nested creates)
  const variants = [
    {
      name: "Ultra Trail 45km",
      distanceKm: 45,
      description:
        "Ultra Trail de 45 km com dificuldade alta. Tempo limite: 8 horas. Idade mínima: 20 anos.",
      startDate: new Date("2026-02-15T08:00:00.000Z"),
      startTime: "08:00",
      cutoffTimeHours: 8.0,
      maxParticipants: null,
      elevationGainM: null,
      elevationLossM: null,
    },
    {
      name: "Trail Longo 25km",
      distanceKm: 25,
      description:
        "Trail Longo de 25 km com dificuldade média. Tempo limite: 6 horas. Idade mínima: 18 anos.",
      startDate: new Date("2026-02-15T09:00:00.000Z"),
      startTime: "09:00",
      cutoffTimeHours: 6.0,
      maxParticipants: null,
      elevationGainM: null,
      elevationLossM: null,
    },
    {
      name: "Mini Trail 15km",
      distanceKm: 15,
      description:
        "Mini Trail de 15 km com dificuldade baixa/média. Tempo limite: 3 horas. Idade mínima: 16 anos. Pontuável para o CDTRC.",
      startDate: new Date("2026-02-15T09:30:00.000Z"),
      startTime: "09:30",
      cutoffTimeHours: 3.0,
      maxParticipants: null,
      elevationGainM: null,
      elevationLossM: null,
    },
    {
      name: "Caminhada 10km",
      distanceKm: 10,
      description:
        "Caminhada não competitiva de 10 km. Tempo limite: 4 horas. Aberta a todas as idades (menores de 16 anos acompanhados).",
      startDate: new Date("2026-02-15T09:45:00.000Z"),
      startTime: "09:45",
      cutoffTimeHours: 4.0,
      maxParticipants: null,
      elevationGainM: null,
      elevationLossM: null,
    },
  ];

  const variantIds: { [key: string]: string } = {};

  for (const variantData of variants) {
    // EventVariant doesn't have a slug field and no unique constraint on [eventId, name]
    // We'll use findFirst + create or update pattern
    const existingVariant = await prisma.eventVariant.findFirst({
      where: {
        eventId: event.id,
        name: variantData.name,
      },
    });

    let variant;
    if (existingVariant) {
      variant = await prisma.eventVariant.update({
        where: { id: existingVariant.id },
        data: variantData,
      });
    } else {
      variant = await prisma.eventVariant.create({
        data: {
          ...variantData,
          eventId: event.id,
        },
      });
    }

    variantIds[variantData.name] = variant.id;
    console.log(`   ✅ Variant upserted: ${variant.name} (${variant.id})`);
  }

  // Step 4: Upsert variant translations
  const variantTranslations = {
    "Ultra Trail 45km": {
      pt: {
        name: "Ultra Trail 45km",
        description:
          "Ultra Trail de 45 km com dificuldade alta. Tempo limite: 8 horas. Idade mínima: 20 anos.",
      },
      en: {
        name: "Ultra Trail 45km",
        description:
          "Ultra Trail of 45 km with high difficulty. Time limit: 8 hours. Minimum age: 20 years.",
      },
      es: {
        name: "Ultra Trail 45km",
        description:
          "Ultra Trail de 45 km con dificultad alta. Tiempo límite: 8 horas. Edad mínima: 20 años.",
      },
      fr: {
        name: "Ultra Trail 45km",
        description:
          "Ultra Trail de 45 km avec difficulté élevée. Temps limite : 8 heures. Âge minimum : 20 ans.",
      },
      de: {
        name: "Ultra Trail 45km",
        description:
          "Ultra Trail von 45 km mit hohem Schwierigkeitsgrad. Zeitlimit: 8 Stunden. Mindestalter: 20 Jahre.",
      },
      it: {
        name: "Ultra Trail 45km",
        description:
          "Ultra Trail di 45 km con difficoltà alta. Tempo limite: 8 ore. Età minima: 20 anni.",
      },
    },
    "Trail Longo 25km": {
      pt: {
        name: "Trail Longo 25km",
        description:
          "Trail Longo de 25 km com dificuldade média. Tempo limite: 6 horas. Idade mínima: 18 anos.",
      },
      en: {
        name: "Long Trail 25km",
        description:
          "Long Trail of 25 km with medium difficulty. Time limit: 6 hours. Minimum age: 18 years.",
      },
      es: {
        name: "Trail Largo 25km",
        description:
          "Trail Largo de 25 km con dificultad media. Tiempo límite: 6 horas. Edad mínima: 18 años.",
      },
      fr: {
        name: "Trail Long 25km",
        description:
          "Trail Long de 25 km avec difficulté moyenne. Temps limite : 6 heures. Âge minimum : 18 ans.",
      },
      de: {
        name: "Langer Trail 25km",
        description:
          "Langer Trail von 25 km mit mittlerem Schwierigkeitsgrad. Zeitlimit: 6 Stunden. Mindestalter: 18 Jahre.",
      },
      it: {
        name: "Trail Lungo 25km",
        description:
          "Trail Lungo di 25 km con difficoltà media. Tempo limite: 6 ore. Età minima: 18 anni.",
      },
    },
    "Mini Trail 15km": {
      pt: {
        name: "Mini Trail 15km",
        description:
          "Mini Trail de 15 km com dificuldade baixa/média. Tempo limite: 3 horas. Idade mínima: 16 anos. Pontuável para o CDTRC.",
      },
      en: {
        name: "Mini Trail 15km",
        description:
          "Mini Trail of 15 km with low/medium difficulty. Time limit: 3 hours. Minimum age: 16 years. Scoring for CDTRC.",
      },
      es: {
        name: "Mini Trail 15km",
        description:
          "Mini Trail de 15 km con dificultad baja/media. Tiempo límite: 3 horas. Edad mínima: 16 años. Puntuable para CDTRC.",
      },
      fr: {
        name: "Mini Trail 15km",
        description:
          "Mini Trail de 15 km avec difficulté faible/moyenne. Temps limite : 3 heures. Âge minimum : 16 ans. Comptant pour le CDTRC.",
      },
      de: {
        name: "Mini Trail 15km",
        description:
          "Mini Trail von 15 km mit niedrigem/mittlerem Schwierigkeitsgrad. Zeitlimit: 3 Stunden. Mindestalter: 16 Jahre. Wertung für CDTRC.",
      },
      it: {
        name: "Mini Trail 15km",
        description:
          "Mini Trail di 15 km con difficoltà bassa/media. Tempo limite: 3 ore. Età minima: 16 anni. Valido per il CDTRC.",
      },
    },
    "Caminhada 10km": {
      pt: {
        name: "Caminhada 10km",
        description:
          "Caminhada não competitiva de 10 km. Tempo limite: 4 horas. Aberta a todas as idades (menores de 16 anos acompanhados).",
      },
      en: {
        name: "10km Walk",
        description:
          "Non-competitive walk of 10 km. Time limit: 4 hours. Open to all ages (under 16 accompanied).",
      },
      es: {
        name: "Caminata 10km",
        description:
          "Caminata no competitiva de 10 km. Tiempo límite: 4 horas. Abierta a todas las edades (menores de 16 años acompañados).",
      },
      fr: {
        name: "Marche 10km",
        description:
          "Marche non compétitive de 10 km. Temps limite : 4 heures. Ouverte à tous les âges (moins de 16 ans accompagnés).",
      },
      de: {
        name: "10km Wanderung",
        description:
          "Nicht-kompetitive Wanderung von 10 km. Zeitlimit: 4 Stunden. Offen für alle Altersgruppen (unter 16 Jahren begleitet).",
      },
      it: {
        name: "Camminata 10km",
        description:
          "Camminata non competitiva di 10 km. Tempo limite: 4 ore. Aperta a tutte le età (minori di 16 anni accompagnati).",
      },
    },
  };

  for (const [variantName, translations] of Object.entries(
    variantTranslations
  )) {
    const variantId = variantIds[variantName];
    for (const [lang, content] of Object.entries(translations)) {
      await prisma.eventVariantTranslation.upsert({
        where: {
          variantId_language: {
            variantId: variantId,
            language: lang as Language,
          },
        },
        update: content,
        create: {
          variantId: variantId,
          language: lang as Language,
          ...content,
        },
      });
    }
    console.log(`      ✅ Translations upserted for: ${variantName}`);
  }

  // Step 5: Upsert pricing phases separately
  const pricingPhases = [
    // Ultra Trail 45km phases
    {
      variantName: "Ultra Trail 45km",
      name: "1ª Fase",
      startDate: new Date("2025-11-30T00:00:00.000Z"),
      endDate: new Date("2025-12-31T23:59:59.999Z"),
      price: 25.0,
      note: "Preço 1ª Fase - Até 31/12/2025",
    },
    {
      variantName: "Ultra Trail 45km",
      name: "2ª Fase",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-02-12T23:59:59.999Z"),
      price: 28.0,
      note: "Preço 2ª Fase - De 1 a 12/02/2026",
    },
    // Trail Longo 25km phases
    {
      variantName: "Trail Longo 25km",
      name: "1ª Fase",
      startDate: new Date("2025-11-30T00:00:00.000Z"),
      endDate: new Date("2025-12-31T23:59:59.999Z"),
      price: 16.5,
      note: "Preço 1ª Fase - Até 31/12/2025",
    },
    {
      variantName: "Trail Longo 25km",
      name: "2ª Fase",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-02-12T23:59:59.999Z"),
      price: 18.5,
      note: "Preço 2ª Fase - De 1 a 12/02/2026",
    },
    // Mini Trail 15km phases
    {
      variantName: "Mini Trail 15km",
      name: "1ª Fase",
      startDate: new Date("2025-11-30T00:00:00.000Z"),
      endDate: new Date("2025-12-31T23:59:59.999Z"),
      price: 15.0,
      note: "Preço 1ª Fase - Até 31/12/2025 (Desconto ADAC: -€1,50)",
    },
    {
      variantName: "Mini Trail 15km",
      name: "2ª Fase",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-02-12T23:59:59.999Z"),
      price: 17.0,
      note: "Preço 2ª Fase - De 1 a 12/02/2026 (Desconto ADAC: -€1,50)",
    },
    // Caminhada 10km phases
    {
      variantName: "Caminhada 10km",
      name: "1ª Fase",
      startDate: new Date("2025-11-30T00:00:00.000Z"),
      endDate: new Date("2025-12-31T23:59:59.999Z"),
      price: 10.0,
      note: "Preço 1ª Fase - Até 31/12/2025",
    },
    {
      variantName: "Caminhada 10km",
      name: "2ª Fase",
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2026-02-12T23:59:59.999Z"),
      price: 12.0,
      note: "Preço 2ª Fase - De 1 a 12/02/2026",
    },
  ];

  for (const phaseData of pricingPhases) {
    const variantId = variantIds[phaseData.variantName];
    const { variantName, ...phaseFields } = phaseData;

    // PricingPhase doesn't have a unique constraint on [variantId, name], so we use findFirst + create/update
    const existingPhase = await prisma.pricingPhase.findFirst({
      where: {
        variantId: variantId,
        name: phaseData.name,
      },
    });

    if (existingPhase) {
      await prisma.pricingPhase.update({
        where: { id: existingPhase.id },
        data: phaseFields,
      });
    } else {
      await prisma.pricingPhase.create({
        data: {
          ...phaseFields,
          variantId: variantId,
        },
      });
    }
    console.log(
      `      ✅ Pricing phase upserted: ${variantName} - ${phaseData.name}`
    );
  }

  console.log("");
  console.log("🏃 ZUT - Zebra Ultra Trail 2026 seeded successfully!");
  console.log("");
  console.log("📊 Summary:");
  console.log(`   - Event: ${event.title}`);
  console.log(`   - Translations: 6 languages (pt, en, es, fr, de, it)`);
  console.log(
    `   - Variants: 4 (Ultra Trail 45km, Trail Longo 25km, Mini Trail 15km, Caminhada 10km)`
  );
  console.log(`   - Variant translations: 24 (4 variants × 6 languages)`);
  console.log(`   - Pricing phases: 8 (4 variants × 2 phases)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
