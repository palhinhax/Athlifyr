/**
 * Seed VII Trail do Rio Paiva 2026
 * Complete with translations in all 6 languages
 * Idempotent pattern - safe to run multiple times
 */

import { PrismaClient, SportType, Language } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding VII Trail do Rio Paiva 2026...");

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: "vii-trail-do-rio-paiva-2026" },
    update: {
      title: "VII Trail do Rio Paiva",
      description: `# VII Trail do Rio Paiva 2026

O **VII Trail do Rio Paiva** é um evento de trail running que se realiza em Souselo, Cinfães, conhecido pelos seus percursos desafiantes e paisagens deslumbrantes ao longo das margens do Rio Paiva e seus afluentes.

## 📍 Local de Partida e Chegada

**Parque de Autocaravanismo de Souselo**
Souselo, Cinfães, Portugal

## 🏃 Provas Disponíveis

### TRP35K - Trail Longo
- **Distância:** ~35 km
- **Desnível Positivo:** 1600m (D+)
- **Partida:** 08:30
- **Idade Mínima:** 18 anos
- **Tempo Limite:** 5h30

Percurso técnico e exigente pelas freguesias de Souselo, Tarouquela, Travanca e Moimenta, atravessando trilhos técnicos, declives acentuados, florestas e margens de rios.

### TRP23K - Trail Médio
- **Distância:** ~23 km
- **Desnível Positivo:** 1000m (D+)
- **Partida:** 09:00
- **Idade Mínima:** 18 anos
- **Tempo Limite:** 5h30

Percurso desafiante com paisagens típicas da região, combinando trilhos técnicos e vistas panorâmicas sobre o Vale do Paiva.

### TRP15K - Trail Curto
- **Distância:** ~15 km
- **Desnível Positivo:** 700m (D+)
- **Partida:** 09:30
- **Idade Mínima:** 16 anos
- **Tempo Limite:** 5h30

Percurso acessível mas desafiante, ideal para iniciantes no trail running, mantendo a beleza característica da região.

### Caminhada 10K
- **Distância:** ~10 km
- **Partida:** 09:35
- **Nota:** Sem carácter competitivo, aberta a todos. Menores acompanhados por adultos.

Caminhada não competitiva através das paisagens naturais do Vale do Paiva, perfeita para famílias e entusiastas da natureza.

## 📋 Inscrição Inclui

✅ Dorsal com chip digital
✅ T-shirt técnica oficial
✅ Cronometragem digital
✅ Abastecimentos sólidos e líquidos
✅ Seguro de acidentes pessoais
✅ Seguro de responsabilidade civil
✅ Assistência médica e socorro
✅ Apoio de bombeiros e polícia
✅ Medalha Finisher
✅ T-shirt Finisher
✅ Chuveiros e instalações sanitárias
✅ Lembranças regionais

## 🏆 Classificações e Prémios

- **Classificação Individual:** Geral masculina e feminina
- **Classificação por Equipas:** Melhor equipa (soma dos 3 melhores)
- **Escalões:** Desde Sub-23 até Veteranos M70/F70+
- **Prémios:** Troféus aos primeiros classificados de cada escalão

## 📅 Programa do Evento

**Sexta-feira, 31 de Janeiro:**
- 16h00 - 20h00: Levantamento de dorsais

**Sábado, 1 de Fevereiro:**
- 07h00 - 09h10: Levantamento de dorsais
- 08h30: Partida TRP35K
- 09h00: Partida TRP23K
- 09h30: Partida TRP15K
- 09h35: Partida Caminhada 10K
- 14h00 (aprox.): Cerimónia de entrega de prémios

## ⚠️ Regulamento

- Todos os percursos iniciam e terminam no Parque de Autocaravanismo de Souselo
- Percursos atravessam trilhos técnicos, declives acentuados, florestas e margens de rios
- O evento valoriza o fair play, segurança e respeito pela natureza
- A inscrição implica total aceitação do regulamento da prova
- Último posto de abastecimento encerra às 4h30
- Tempo limite máximo: 5h30

## 📞 Contactos

**Organização:**
Duelo D'Ocasião – Associação

**Apoio Institucional:**
Câmara Municipal de Cinfães

**Website:** https://stopandgo.net/events/vii-trail-do-rio-paiva

## 🚗 Estacionamento

Disponível próximo à escola local em Souselo.

## 🌄 Sobre a Região

O Trail do Rio Paiva percorre as margens do Rio Paiva, oferecendo vistas deslumbrantes sobre o vale e paisagens típicas da região de Cinfães, no coração de Portugal. Um evento obrigatório no calendário português de trail running!`,
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-02-01T08:30:00.000Z"),
      endDate: new Date("2026-02-01T14:00:00.000Z"),
      registrationDeadline: new Date("2026-01-25T23:59:59.000Z"),
      city: "Cinfães",
      country: "Portugal",
      latitude: 41.07,
      longitude: -8.2306,
      googleMapsUrl: "https://maps.app.goo.gl/dNmJjkzraiSdQQVA6",
      externalUrl: "https://stopandgo.net/events/vii-trail-do-rio-paiva",
      imageUrl: "",
      isFeatured: true,
    },
    create: {
      title: "VII Trail do Rio Paiva",
      slug: "vii-trail-do-rio-paiva-2026",
      description: `# VII Trail do Rio Paiva 2026

O **VII Trail do Rio Paiva** é um evento de trail running que se realiza em Souselo, Cinfães, conhecido pelos seus percursos desafiantes e paisagens deslumbrantes ao longo das margens do Rio Paiva e seus afluentes.

## 📍 Local de Partida e Chegada

**Parque de Autocaravanismo de Souselo**
Souselo, Cinfães, Portugal

## 🏃 Provas Disponíveis

### TRP35K - Trail Longo
- **Distância:** ~35 km
- **Desnível Positivo:** 1600m (D+)
- **Partida:** 08:30
- **Idade Mínima:** 18 anos
- **Tempo Limite:** 5h30

Percurso técnico e exigente pelas freguesias de Souselo, Tarouquela, Travanca e Moimenta, atravessando trilhos técnicos, declives acentuados, florestas e margens de rios.

### TRP23K - Trail Médio
- **Distância:** ~23 km
- **Desnível Positivo:** 1000m (D+)
- **Partida:** 09:00
- **Idade Mínima:** 18 anos
- **Tempo Limite:** 5h30

Percurso desafiante com paisagens típicas da região, combinando trilhos técnicos e vistas panorâmicas sobre o Vale do Paiva.

### TRP15K - Trail Curto
- **Distância:** ~15 km
- **Desnível Positivo:** 700m (D+)
- **Partida:** 09:30
- **Idade Mínima:** 16 anos
- **Tempo Limite:** 5h30

Percurso acessível mas desafiante, ideal para iniciantes no trail running, mantendo a beleza característica da região.

### Caminhada 10K
- **Distância:** ~10 km
- **Partida:** 09:35
- **Nota:** Sem carácter competitivo, aberta a todos. Menores acompanhados por adultos.

Caminhada não competitiva através das paisagens naturais do Vale do Paiva, perfeita para famílias e entusiastas da natureza.

## 📋 Inscrição Inclui

✅ Dorsal com chip digital
✅ T-shirt técnica oficial
✅ Cronometragem digital
✅ Abastecimentos sólidos e líquidos
✅ Seguro de acidentes pessoais
✅ Seguro de responsabilidade civil
✅ Assistência médica e socorro
✅ Apoio de bombeiros e polícia
✅ Medalha Finisher
✅ T-shirt Finisher
✅ Chuveiros e instalações sanitárias
✅ Lembranças regionais

## 🏆 Classificações e Prémios

- **Classificação Individual:** Geral masculina e feminina
- **Classificação por Equipas:** Melhor equipa (soma dos 3 melhores)
- **Escalões:** Desde Sub-23 até Veteranos M70/F70+
- **Prémios:** Troféus aos primeiros classificados de cada escalão

## 📅 Programa do Evento

**Sexta-feira, 31 de Janeiro:**
- 16h00 - 20h00: Levantamento de dorsais

**Sábado, 1 de Fevereiro:**
- 07h00 - 09h10: Levantamento de dorsais
- 08h30: Partida TRP35K
- 09h00: Partida TRP23K
- 09h30: Partida TRP15K
- 09h35: Partida Caminhada 10K
- 14h00 (aprox.): Cerimónia de entrega de prémios

## ⚠️ Regulamento

- Todos os percursos iniciam e terminam no Parque de Autocaravanismo de Souselo
- Percursos atravessam trilhos técnicos, declives acentuados, florestas e margens de rios
- O evento valoriza o fair play, segurança e respeito pela natureza
- A inscrição implica total aceitação do regulamento da prova
- Último posto de abastecimento encerra às 4h30
- Tempo limite máximo: 5h30

## 📞 Contactos

**Organização:**
Duelo D'Ocasião – Associação

**Apoio Institucional:**
Câmara Municipal de Cinfães

**Website:** https://stopandgo.net/events/vii-trail-do-rio-paiva

## 🚗 Estacionamento

Disponível próximo à escola local em Souselo.

## 🌄 Sobre a Região

O Trail do Rio Paiva percorre as margens do Rio Paiva, oferecendo vistas deslumbrantes sobre o vale e paisagens típicas da região de Cinfães, no coração de Portugal. Um evento obrigatório no calendário português de trail running!`,
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-02-01T08:30:00.000Z"),
      endDate: new Date("2026-02-01T14:00:00.000Z"),
      registrationDeadline: new Date("2026-01-25T23:59:59.000Z"),
      city: "Cinfães",
      country: "Portugal",
      latitude: 41.07,
      longitude: -8.2306,
      googleMapsUrl: "https://maps.app.goo.gl/dNmJjkzraiSdQQVA6",
      externalUrl: "https://stopandgo.net/events/vii-trail-do-rio-paiva",
      imageUrl: "",
      isFeatured: true,
    },
  });

  console.log("✅ Event upserted with ID:", event.id);

  // Step 2: Upsert translations separately (ALL 6 LANGUAGES)
  console.log("📝 Upserting translations for 6 languages...");

  const translations = {
    pt: {
      title: "VII Trail do Rio Paiva",
      description: `O VII Trail do Rio Paiva é um evento de trail running que se realiza em Souselo, Cinfães, conhecido pelos seus percursos desafiantes e paisagens deslumbrantes ao longo das margens do Rio Paiva. Oferece 4 provas: TRP35K (35km, 1600m D+), TRP23K (23km, 1000m D+), TRP15K (15km, 700m D+) e Caminhada 10K.`,
      city: "Cinfães",
      metaTitle: "VII Trail do Rio Paiva 2026 - Trail Running em Cinfães",
      metaDescription:
        "Trail running em Cinfães com percursos de 35km, 23km, 15km e caminhada de 10km. 1 de fevereiro de 2026. Paisagens deslumbrantes do Vale do Paiva!",
    },
    en: {
      title: "VII Rio Paiva Trail",
      description: `The VII Rio Paiva Trail is a trail running event held in Souselo, Cinfães, known for its challenging courses and stunning landscapes along the banks of the Paiva River. Offers 4 races: TRP35K (35km, 1600m D+), TRP23K (23km, 1000m D+), TRP15K (15km, 700m D+) and 10K Walk.`,
      city: "Cinfães",
      metaTitle: "VII Rio Paiva Trail 2026 - Trail Running in Cinfães",
      metaDescription:
        "Trail running in Cinfães with courses of 35km, 23km, 15km and 10km walk. February 1, 2026. Stunning landscapes of Paiva Valley!",
    },
    es: {
      title: "VII Trail do Rio Paiva",
      description: `El VII Trail do Rio Paiva es un evento de trail running que se celebra en Souselo, Cinfães, conocido por sus recorridos desafiantes y paisajes impresionantes a lo largo de las orillas del río Paiva. Ofrece 4 carreras: TRP35K (35km, 1600m D+), TRP23K (23km, 1000m D+), TRP15K (15km, 700m D+) y Caminata 10K.`,
      city: "Cinfães",
      metaTitle: "VII Trail do Rio Paiva 2026 - Trail Running en Cinfães",
      metaDescription:
        "Trail running en Cinfães con recorridos de 35km, 23km, 15km y caminata de 10km. 1 de febrero de 2026. ¡Paisajes impresionantes del Valle de Paiva!",
    },
    fr: {
      title: "VII Trail do Rio Paiva",
      description: `Le VII Trail do Rio Paiva est un événement de trail running qui se déroule à Souselo, Cinfães, connu pour ses parcours difficiles et ses paysages magnifiques le long des rives de la rivière Paiva. Propose 4 courses: TRP35K (35km, 1600m D+), TRP23K (23km, 1000m D+), TRP15K (15km, 700m D+) et Randonnée 10K.`,
      city: "Cinfães",
      metaTitle: "VII Trail do Rio Paiva 2026 - Trail Running à Cinfães",
      metaDescription:
        "Trail running à Cinfães avec parcours de 35km, 23km, 15km et randonnée de 10km. 1er février 2026. Paysages magnifiques de la Vallée de Paiva!",
    },
    de: {
      title: "VII Trail do Rio Paiva",
      description: `Der VII Trail do Rio Paiva ist ein Trail-Running-Event in Souselo, Cinfães, bekannt für seine anspruchsvollen Strecken und atemberaubenden Landschaften entlang der Ufer des Flusses Paiva. Bietet 4 Rennen: TRP35K (35km, 1600m D+), TRP23K (23km, 1000m D+), TRP15K (15km, 700m D+) und Wanderung 10K.`,
      city: "Cinfães",
      metaTitle: "VII Trail do Rio Paiva 2026 - Trail Running in Cinfães",
      metaDescription:
        "Trail Running in Cinfães mit Strecken von 35km, 23km, 15km und Wanderung 10km. 1. Februar 2026. Atemberaubende Landschaften des Paiva-Tals!",
    },
    it: {
      title: "VII Trail do Rio Paiva",
      description: `Il VII Trail do Rio Paiva è un evento di trail running che si svolge a Souselo, Cinfães, noto per i suoi percorsi impegnativi e paesaggi mozzafiato lungo le rive del fiume Paiva. Offre 4 gare: TRP35K (35km, 1600m D+), TRP23K (23km, 1000m D+), TRP15K (15km, 700m D+) e Camminata 10K.`,
      city: "Cinfães",
      metaTitle: "VII Trail do Rio Paiva 2026 - Trail Running a Cinfães",
      metaDescription:
        "Trail running a Cinfães con percorsi di 35km, 23km, 15km e camminata di 10km. 1 febbraio 2026. Paesaggi mozzafiato della Valle di Paiva!",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as Language[]) {
    const trans = translations[lang as keyof typeof translations];
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: lang,
        },
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
        language: lang,
        title: trans.title,
        description: trans.description,
        city: trans.city,
        metaTitle: trans.metaTitle,
        metaDescription: trans.metaDescription,
      },
    });
    console.log(`   ✅ ${lang.toUpperCase()}`);
  }

  // Step 3: Upsert variants separately
  console.log("🏃 Upserting event variants...");

  // Helper function to find or create variant
  const findOrCreateVariant = async (
    name: string,
    data: {
      description: string;
      distanceKm: number | null;
      elevationGainM: number | null;
      startDate: Date;
      startTime: string;
      cutoffTimeHours: number | null;
    }
  ) => {
    const existing = await prisma.eventVariant.findFirst({
      where: { eventId: event.id, name },
    });

    if (existing) {
      return await prisma.eventVariant.update({
        where: { id: existing.id },
        data,
      });
    } else {
      return await prisma.eventVariant.create({
        data: {
          eventId: event.id,
          name,
          ...data,
        },
      });
    }
  };

  // TRP35K
  const variant35k = await findOrCreateVariant("TRP35K", {
    description:
      "Percurso técnico e exigente de 35km com 1600m de desnível positivo pelas freguesias de Souselo, Tarouquela, Travanca e Moimenta.",
    distanceKm: 35,
    elevationGainM: 1600,
    startDate: new Date("2026-02-01T08:30:00.000Z"),
    startTime: "08:30",
    cutoffTimeHours: 5.5,
  });
  console.log("   ✅ TRP35K");

  // TRP23K
  const variant23k = await findOrCreateVariant("TRP23K", {
    description:
      "Percurso desafiante de 23km com 1000m de desnível positivo, combinando trilhos técnicos e vistas panorâmicas sobre o Vale do Paiva.",
    distanceKm: 23,
    elevationGainM: 1000,
    startDate: new Date("2026-02-01T09:00:00.000Z"),
    startTime: "09:00",
    cutoffTimeHours: 5.5,
  });
  console.log("   ✅ TRP23K");

  // TRP15K
  const variant15k = await findOrCreateVariant("TRP15K", {
    description:
      "Percurso de 15km com 700m de desnível positivo, ideal para iniciantes no trail running.",
    distanceKm: 15,
    elevationGainM: 700,
    startDate: new Date("2026-02-01T09:30:00.000Z"),
    startTime: "09:30",
    cutoffTimeHours: 5.5,
  });
  console.log("   ✅ TRP15K");

  // Caminhada 10K
  const variantWalk = await findOrCreateVariant("Caminhada 10K", {
    description:
      "Caminhada não competitiva de 10km através das paisagens naturais do Vale do Paiva.",
    distanceKm: 10,
    elevationGainM: null,
    startDate: new Date("2026-02-01T09:35:00.000Z"),
    startTime: "09:35",
    cutoffTimeHours: null,
  });
  console.log("   ✅ Caminhada 10K");

  // Step 4: Upsert variant translations separately (ALL 6 languages for each variant)
  console.log("🌍 Upserting variant translations...");

  const variantTranslations = {
    TRP35K: {
      variant: variant35k,
      translations: {
        pt: {
          name: "TRP35K",
          description:
            "Percurso técnico e exigente de 35km com 1600m de desnível positivo pelas freguesias de Souselo, Tarouquela, Travanca e Moimenta.",
        },
        en: {
          name: "TRP35K",
          description:
            "Technical and demanding 35km course with 1600m elevation gain through the parishes of Souselo, Tarouquela, Travanca and Moimenta.",
        },
        es: {
          name: "TRP35K",
          description:
            "Recorrido técnico y exigente de 35km con 1600m de desnivel positivo por las parroquias de Souselo, Tarouquela, Travanca y Moimenta.",
        },
        fr: {
          name: "TRP35K",
          description:
            "Parcours technique et exigeant de 35km avec 1600m de dénivelé positif à travers les paroisses de Souselo, Tarouquela, Travanca et Moimenta.",
        },
        de: {
          name: "TRP35K",
          description:
            "Technische und anspruchsvolle 35km-Strecke mit 1600m Höhenunterschied durch die Gemeinden Souselo, Tarouquela, Travanca und Moimenta.",
        },
        it: {
          name: "TRP35K",
          description:
            "Percorso tecnico e impegnativo di 35km con 1600m di dislivello positivo attraverso le parrocchie di Souselo, Tarouquela, Travanca e Moimenta.",
        },
      },
    },
    TRP23K: {
      variant: variant23k,
      translations: {
        pt: {
          name: "TRP23K",
          description:
            "Percurso desafiante de 23km com 1000m de desnível positivo, combinando trilhos técnicos e vistas panorâmicas.",
        },
        en: {
          name: "TRP23K",
          description:
            "Challenging 23km course with 1000m elevation gain, combining technical trails and panoramic views.",
        },
        es: {
          name: "TRP23K",
          description:
            "Recorrido desafiante de 23km con 1000m de desnivel positivo, combinando senderos técnicos y vistas panorámicas.",
        },
        fr: {
          name: "TRP23K",
          description:
            "Parcours difficile de 23km avec 1000m de dénivelé positif, combinant sentiers techniques et vues panoramiques.",
        },
        de: {
          name: "TRP23K",
          description:
            "Herausfordernde 23km-Strecke mit 1000m Höhenunterschied, mit technischen Pfaden und Panoramablicken.",
        },
        it: {
          name: "TRP23K",
          description:
            "Percorso impegnativo di 23km con 1000m di dislivello positivo, combinando sentieri tecnici e viste panoramiche.",
        },
      },
    },
    TRP15K: {
      variant: variant15k,
      translations: {
        pt: {
          name: "TRP15K",
          description:
            "Percurso de 15km com 700m de desnível positivo, ideal para iniciantes no trail running.",
        },
        en: {
          name: "TRP15K",
          description:
            "15km course with 700m elevation gain, ideal for trail running beginners.",
        },
        es: {
          name: "TRP15K",
          description:
            "Recorrido de 15km con 700m de desnivel positivo, ideal para principiantes en trail running.",
        },
        fr: {
          name: "TRP15K",
          description:
            "Parcours de 15km avec 700m de dénivelé positif, idéal pour les débutants en trail running.",
        },
        de: {
          name: "TRP15K",
          description:
            "15km-Strecke mit 700m Höhenunterschied, ideal für Trail-Running-Anfänger.",
        },
        it: {
          name: "TRP15K",
          description:
            "Percorso di 15km con 700m di dislivello positivo, ideale per principianti nel trail running.",
        },
      },
    },
    "Caminhada 10K": {
      variant: variantWalk,
      translations: {
        pt: {
          name: "Caminhada 10K",
          description:
            "Caminhada não competitiva de 10km através das paisagens naturais do Vale do Paiva.",
        },
        en: {
          name: "10K Walk",
          description:
            "Non-competitive 10km walk through the natural landscapes of Paiva Valley.",
        },
        es: {
          name: "Caminata 10K",
          description:
            "Caminata no competitiva de 10km a través de los paisajes naturales del Valle de Paiva.",
        },
        fr: {
          name: "Randonnée 10K",
          description:
            "Randonnée non compétitive de 10km à travers les paysages naturels de la Vallée de Paiva.",
        },
        de: {
          name: "Wanderung 10K",
          description:
            "Nicht-wettbewerbsfähige 10km-Wanderung durch die natürlichen Landschaften des Paiva-Tals.",
        },
        it: {
          name: "Camminata 10K",
          description:
            "Camminata non competitiva di 10km attraverso i paesaggi naturali della Valle di Paiva.",
        },
      },
    },
  };

  for (const [variantName, variantData] of Object.entries(
    variantTranslations
  )) {
    for (const lang of ["pt", "en", "es", "fr", "de", "it"] as Language[]) {
      const trans =
        variantData.translations[lang as keyof typeof variantData.translations];
      await prisma.eventVariantTranslation.upsert({
        where: {
          variantId_language: {
            variantId: variantData.variant.id,
            language: lang,
          },
        },
        update: {
          name: trans.name,
          description: trans.description,
        },
        create: {
          variantId: variantData.variant.id,
          language: lang,
          name: trans.name,
          description: trans.description,
        },
      });
    }
    console.log(`   ✅ ${variantName} (6 languages)`);
  }

  // Step 5: Upsert pricing phases separately
  console.log("💰 Upserting pricing phases...");

  // Helper function to find or create pricing phase
  const findOrCreatePricingPhase = async (
    name: string,
    data: {
      startDate: Date;
      endDate: Date;
      price: number;
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
        data: {
          eventId: event.id,
          name,
          ...data,
        },
      });
    }
  };

  // TRP35K - 3 pricing phases
  await findOrCreatePricingPhase("1ª Fase TRP35K", {
    startDate: new Date("2025-09-23T00:00:00.000Z"),
    endDate: new Date("2025-11-30T23:59:59.000Z"),
    price: 20.0,
    discountPercent: null,
    note: null,
  });

  await findOrCreatePricingPhase("2ª Fase TRP35K", {
    startDate: new Date("2025-12-01T00:00:00.000Z"),
    endDate: new Date("2025-12-31T23:59:59.000Z"),
    price: 22.0,
    discountPercent: null,
    note: null,
  });

  await findOrCreatePricingPhase("3ª Fase TRP35K", {
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    endDate: new Date("2026-01-20T23:59:59.000Z"),
    price: 23.0,
    discountPercent: null,
    note: null,
  });
  console.log("   ✅ TRP35K pricing (3 phases)");

  // TRP23K - 3 pricing phases
  await findOrCreatePricingPhase("1ª Fase TRP23K", {
    startDate: new Date("2025-09-23T00:00:00.000Z"),
    endDate: new Date("2025-11-30T23:59:59.000Z"),
    price: 18.0,
    discountPercent: null,
    note: null,
  });

  await findOrCreatePricingPhase("2ª Fase TRP23K", {
    startDate: new Date("2025-12-01T00:00:00.000Z"),
    endDate: new Date("2025-12-31T23:59:59.000Z"),
    price: 20.0,
    discountPercent: null,
    note: null,
  });

  await findOrCreatePricingPhase("3ª Fase TRP23K", {
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    endDate: new Date("2026-01-20T23:59:59.000Z"),
    price: 21.0,
    discountPercent: null,
    note: null,
  });
  console.log("   ✅ TRP23K pricing (3 phases)");

  // TRP15K - 3 pricing phases
  await findOrCreatePricingPhase("1ª Fase TRP15K", {
    startDate: new Date("2025-09-23T00:00:00.000Z"),
    endDate: new Date("2025-11-30T23:59:59.000Z"),
    price: 16.0,
    discountPercent: null,
    note: null,
  });

  await findOrCreatePricingPhase("2ª Fase TRP15K", {
    startDate: new Date("2025-12-01T00:00:00.000Z"),
    endDate: new Date("2025-12-31T23:59:59.000Z"),
    price: 18.0,
    discountPercent: null,
    note: null,
  });

  await findOrCreatePricingPhase("3ª Fase TRP15K", {
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    endDate: new Date("2026-01-20T23:59:59.000Z"),
    price: 19.0,
    discountPercent: null,
    note: null,
  });
  console.log("   ✅ TRP15K pricing (3 phases)");

  // Caminhada 10K - 3 pricing phases
  await findOrCreatePricingPhase("1ª Fase Caminhada 10K", {
    startDate: new Date("2025-09-23T00:00:00.000Z"),
    endDate: new Date("2025-11-30T23:59:59.000Z"),
    price: 13.0,
    discountPercent: null,
    note: null,
  });

  await findOrCreatePricingPhase("2ª Fase Caminhada 10K", {
    startDate: new Date("2025-12-01T00:00:00.000Z"),
    endDate: new Date("2025-12-31T23:59:59.000Z"),
    price: 14.0,
    discountPercent: null,
    note: null,
  });

  await findOrCreatePricingPhase("3ª Fase Caminhada 10K", {
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    endDate: new Date("2026-01-20T23:59:59.000Z"),
    price: 15.0,
    discountPercent: null,
    note: null,
  });
  console.log("   ✅ Caminhada 10K pricing (3 phases)");

  console.log("");
  console.log("✅ VII Trail do Rio Paiva 2026 seeded successfully!");
  console.log("📝 Event slug: vii-trail-do-rio-paiva-2026");
  console.log("🌍 Translations: 6 languages (pt, en, es, fr, de, it)");
  console.log("🏃 Variants: 4 (TRP35K, TRP23K, TRP15K, Caminhada 10K)");
  console.log("💰 Pricing phases: 12 (3 phases per variant)");
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
