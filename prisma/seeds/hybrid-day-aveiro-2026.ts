/**
 * Seed Hybrid Day® Aveiro 2026
 * Complete with translations in all 6 languages
 * Idempotent pattern - safe to run multiple times
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏋️ Seeding Hybrid Day® Aveiro 2026...");

  const languages: Language[] = [
    Language.pt,
    Language.en,
    Language.es,
    Language.fr,
    Language.de,
    Language.it,
  ];

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: "hybrid-day-aveiro-2026" },
    update: {
      title: "Hybrid Day® Aveiro",
      description: `# 🏋️ Hybrid Day® Aveiro 2026

O **Hybrid Day** chega a Aveiro, e o **Parque de Exposições** será o palco de mais um desafio inesquecível!

Atletas de diferentes modalidades e níveis de experiência vão pôr à prova a sua força, resistência e determinação num formato que combina **corrida com exercícios funcionais** — uma experiência intensa, envolvente e repleta de energia.

## 🎯 O Formato

O formato do Hybrid Day é o mesmo em todas as provas, mas garantimos que cada prova será única!

### 8 Exercícios + 8km de Corrida

**Antes de cada exercício: 1km de corrida**

1. **Ski Erg (1000m)** - Ritmo e resistência
2. **Sled Push (50m)** - Potência e força máxima
3. **Sled Pull (50m)** - Coordenação e explosão muscular
4. **Burpees Broad Jump (80m)** - Supera-te a cada repetição
5. **Remo (1000m)** - Ritmo, foco e resistência
6. **Farmer's Carry (200m)** - Força e estabilidade
7. **Sandbag Lunges (100m)** - Equilíbrio e resistência de pernas
8. **Wall Balls (100)** - Energia e precisão no alvo

## 📍 Local

**Aveiro Parquexpo - Parque de Feiras e Exposições**
Av. Dom Manuel de Almeida Trindade, 3810-488 Aveiro

## 🏆 Categorias

### Singles
- Singles Women / Women Pro
- Singles Men / Men Pro

### Doubles (Duplas)
- Doubles Women / Women Pro
- Doubles Men / Men Pro
- Doubles Mixed

### Relay (Estafetas de 4)
- Relay Women
- Relay Men
- Relay Mixed

## ✨ Experiência Única

- **Comunidade:** Uma experiência que une atletas de todas as modalidades e níveis
- **Suporte:** Desde a hidratação ao apoio de todo o staff
- **Energia:** Ambiente único de competição e camaradagem

Cada edição do Hybrid Day é única, e Aveiro não será exceção. Prepara-te para sentir a adrenalina, superar os teus limites e fazer parte da comunidade que está a redefinir o conceito de competição funcional em Portugal!`,
      sportTypes: [SportType.HYROX],
      startDate: new Date("2026-01-31T08:00:00Z"),
      endDate: new Date("2026-01-31T20:30:00Z"),
      city: "Aveiro",
      country: "Portugal",
      latitude: 40.634118,
      longitude: -8.631604,
      googleMapsUrl: "https://maps.app.goo.gl/s2jU5ehCay1DaPmp7",
      externalUrl: "https://www.tickettailor.com/events/hybridday",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-01-31T07:59:59Z"),
    },
    create: {
      title: "Hybrid Day® Aveiro",
      slug: "hybrid-day-aveiro-2026",
      description: `# 🏋️ Hybrid Day® Aveiro 2026

O **Hybrid Day** chega a Aveiro, e o **Parque de Exposições** será o palco de mais um desafio inesquecível!

Atletas de diferentes modalidades e níveis de experiência vão pôr à prova a sua força, resistência e determinação num formato que combina **corrida com exercícios funcionais** — uma experiência intensa, envolvente e repleta de energia.

## 🎯 O Formato

O formato do Hybrid Day é o mesmo em todas as provas, mas garantimos que cada prova será única!

### 8 Exercícios + 8km de Corrida

**Antes de cada exercício: 1km de corrida**

1. **Ski Erg (1000m)** - Ritmo e resistência
2. **Sled Push (50m)** - Potência e força máxima
3. **Sled Pull (50m)** - Coordenação e explosão muscular
4. **Burpees Broad Jump (80m)** - Supera-te a cada repetição
5. **Remo (1000m)** - Ritmo, foco e resistência
6. **Farmer's Carry (200m)** - Força e estabilidade
7. **Sandbag Lunges (100m)** - Equilíbrio e resistência de pernas
8. **Wall Balls (100)** - Energia e precisão no alvo

## 📍 Local

**Aveiro Parquexpo - Parque de Feiras e Exposições**
Av. Dom Manuel de Almeida Trindade, 3810-488 Aveiro

## 🏆 Categorias

### Singles
- Singles Women / Women Pro
- Singles Men / Men Pro

### Doubles (Duplas)
- Doubles Women / Women Pro
- Doubles Men / Men Pro
- Doubles Mixed

### Relay (Estafetas de 4)
- Relay Women
- Relay Men
- Relay Mixed

## ✨ Experiência Única

- **Comunidade:** Uma experiência que une atletas de todas as modalidades e níveis
- **Suporte:** Desde a hidratação ao apoio de todo o staff
- **Energia:** Ambiente único de competição e camaradagem

Cada edição do Hybrid Day é única, e Aveiro não será exceção. Prepara-te para sentir a adrenalina, superar os teus limites e fazer parte da comunidade que está a redefinir o conceito de competição funcional em Portugal!`,
      sportTypes: [SportType.HYROX],
      startDate: new Date("2026-01-31T08:00:00Z"),
      endDate: new Date("2026-01-31T20:30:00Z"),
      city: "Aveiro",
      country: "Portugal",
      latitude: 40.634118,
      longitude: -8.631604,
      googleMapsUrl: "https://maps.app.goo.gl/s2jU5ehCay1DaPmp7",
      externalUrl: "https://www.tickettailor.com/events/hybridday",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-01-31T07:59:59Z"),
    },
  });

  console.log("✅ Event upserted:", event.title);

  // Step 2: Upsert translations for all 6 languages
  const translations = {
    pt: {
      title: "Hybrid Day® Aveiro",
      description: `# 🏋️ Hybrid Day® Aveiro 2026

O **Hybrid Day** é a maior competição híbrida da Península Ibérica!

8 Exercícios + 8km de corrida por Aveiro. Testa os teus limites numa competição que combina força, resistência e determinação.

## 🎯 O Formato

- **8 Estações:** Ski Erg, Sled Push/Pull, Burpees, Remo, Farmer's Carry, Lunges, Wall Balls
- **8km de Corrida:** 1km antes de cada exercício
- **Comunidade:** Atletas de todas as modalidades e níveis

## 🏆 Categorias

Singles (Women/Men/Pro), Doubles (Women/Men/Mixed/Pro), Relay (4 atletas)`,
      city: "Aveiro",
      metaTitle: "Hybrid Day® Aveiro 2026 - Inscrições | Athlifyr",
      metaDescription:
        "Participa no Hybrid Day® Aveiro 2026. A maior competição híbrida da Península Ibérica! 8 exercícios + 8km de corrida. Inscreve-te já!",
    },
    en: {
      title: "Hybrid Day® Aveiro",
      description: `# 🏋️ Hybrid Day® Aveiro 2026

**Hybrid Day** is the biggest hybrid competition in the Iberian Peninsula!

8 Exercises + 8km of running through Aveiro. Test your limits in a competition that combines strength, endurance and determination.

## 🎯 The Format

- **8 Stations:** Ski Erg, Sled Push/Pull, Burpees, Rowing, Farmer's Carry, Lunges, Wall Balls
- **8km Running:** 1km before each exercise
- **Community:** Athletes from all sports and levels

## 🏆 Categories

Singles (Women/Men/Pro), Doubles (Women/Men/Mixed/Pro), Relay (4 athletes)`,
      city: "Aveiro",
      metaTitle: "Hybrid Day® Aveiro 2026 - Registration | Athlifyr",
      metaDescription:
        "Join Hybrid Day® Aveiro 2026. The biggest hybrid competition in the Iberian Peninsula! 8 exercises + 8km running. Register now!",
    },
    es: {
      title: "Hybrid Day® Aveiro",
      description: `# 🏋️ Hybrid Day® Aveiro 2026

**Hybrid Day** es la mayor competición híbrida de la Península Ibérica!

8 Ejercicios + 8km de carrera por Aveiro. Pon a prueba tus límites en una competición que combina fuerza, resistencia y determinación.

## 🎯 El Formato

- **8 Estaciones:** Ski Erg, Sled Push/Pull, Burpees, Remo, Farmer's Carry, Lunges, Wall Balls
- **8km de Carrera:** 1km antes de cada ejercicio
- **Comunidad:** Atletas de todos los deportes y niveles

## 🏆 Categorías

Singles (Mujeres/Hombres/Pro), Doubles (Mujeres/Hombres/Mixto/Pro), Relay (4 atletas)`,
      city: "Aveiro",
      metaTitle: "Hybrid Day® Aveiro 2026 - Inscripciones | Athlifyr",
      metaDescription:
        "Participa en Hybrid Day® Aveiro 2026. ¡La mayor competición híbrida de la Península Ibérica! 8 ejercicios + 8km de carrera. ¡Inscríbete ya!",
    },
    fr: {
      title: "Hybrid Day® Aveiro",
      description: `# 🏋️ Hybrid Day® Aveiro 2026

**Hybrid Day** est la plus grande compétition hybride de la péninsule ibérique !

8 Exercices + 8km de course à Aveiro. Testez vos limites dans une compétition qui combine force, endurance et détermination.

## 🎯 Le Format

- **8 Stations:** Ski Erg, Sled Push/Pull, Burpees, Aviron, Farmer's Carry, Fentes, Wall Balls
- **8km de Course:** 1km avant chaque exercice
- **Communauté:** Athlètes de tous les sports et niveaux

## 🏆 Catégories

Singles (Femmes/Hommes/Pro), Doubles (Femmes/Hommes/Mixte/Pro), Relais (4 athlètes)`,
      city: "Aveiro",
      metaTitle: "Hybrid Day® Aveiro 2026 - Inscription | Athlifyr",
      metaDescription:
        "Participez au Hybrid Day® Aveiro 2026. La plus grande compétition hybride de la péninsule ibérique ! 8 exercices + 8km de course. Inscrivez-vous !",
    },
    de: {
      title: "Hybrid Day® Aveiro",
      description: `# 🏋️ Hybrid Day® Aveiro 2026

**Hybrid Day** ist der größte Hybrid-Wettbewerb auf der Iberischen Halbinsel!

8 Übungen + 8km Laufen durch Aveiro. Testen Sie Ihre Grenzen in einem Wettbewerb, der Kraft, Ausdauer und Entschlossenheit kombiniert.

## 🎯 Das Format

- **8 Stationen:** Ski Erg, Sled Push/Pull, Burpees, Rudern, Farmer's Carry, Lunges, Wall Balls
- **8km Laufen:** 1km vor jeder Übung
- **Gemeinschaft:** Athleten aller Sportarten und Levels

## 🏆 Kategorien

Singles (Frauen/Männer/Pro), Doubles (Frauen/Männer/Mixed/Pro), Staffel (4 Athleten)`,
      city: "Aveiro",
      metaTitle: "Hybrid Day® Aveiro 2026 - Anmeldung | Athlifyr",
      metaDescription:
        "Nehmen Sie am Hybrid Day® Aveiro 2026 teil. Der größte Hybrid-Wettbewerb der Iberischen Halbinsel! 8 Übungen + 8km Laufen. Jetzt anmelden!",
    },
    it: {
      title: "Hybrid Day® Aveiro",
      description: `# 🏋️ Hybrid Day® Aveiro 2026

**Hybrid Day** è la più grande competizione ibrida della Penisola Iberica!

8 Esercizi + 8km di corsa ad Aveiro. Metti alla prova i tuoi limiti in una competizione che combina forza, resistenza e determinazione.

## 🎯 Il Formato

- **8 Stazioni:** Ski Erg, Sled Push/Pull, Burpees, Canottaggio, Farmer's Carry, Affondi, Wall Balls
- **8km di Corsa:** 1km prima di ogni esercizio
- **Comunità:** Atleti di tutti gli sport e livelli

## 🏆 Categorie

Singles (Donne/Uomini/Pro), Doubles (Donne/Uomini/Misto/Pro), Staffetta (4 atleti)`,
      city: "Aveiro",
      metaTitle: "Hybrid Day® Aveiro 2026 - Iscrizione | Athlifyr",
      metaDescription:
        "Partecipa all'Hybrid Day® Aveiro 2026. La più grande competizione ibrida della Penisola Iberica! 8 esercizi + 8km di corsa. Iscriviti ora!",
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
        metaTitle: translations[lang].metaTitle,
        metaDescription: translations[lang].metaDescription,
      },
      create: {
        eventId: event.id,
        language: lang,
        title: translations[lang].title,
        description: translations[lang].description,
        city: translations[lang].city,
        metaTitle: translations[lang].metaTitle,
        metaDescription: translations[lang].metaDescription,
      },
    });
  }

  console.log(
    "📝 Translations upserted for 6 languages (pt, en, es, fr, de, it)"
  );

  // Step 3: Upsert variants
  // Helper function to find or create variants
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const findOrCreateVariant = async (name: string, data: any) => {
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

  // Singles Women
  const singlesWomen = await findOrCreateVariant("Singles Women", {
    description: "Categoria individual feminina",
    distanceKm: 16,
    startDate: new Date("2026-01-31T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Singles Women Pro
  const singlesWomenPro = await findOrCreateVariant("Singles Women Pro", {
    description: "Categoria individual feminina profissional",
    distanceKm: 16,
    startDate: new Date("2026-01-31T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Singles Men
  const singlesMen = await findOrCreateVariant("Singles Men", {
    description: "Categoria individual masculina",
    distanceKm: 16,
    startDate: new Date("2026-01-31T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Singles Men Pro
  const singlesMenPro = await findOrCreateVariant("Singles Men Pro", {
    description: "Categoria individual masculina profissional",
    distanceKm: 16,
    startDate: new Date("2026-01-31T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Doubles Women
  const doublesWomen = await findOrCreateVariant("Doubles Women", {
    description: "Equipas de 2 (M|M)",
    distanceKm: 16,
    startDate: new Date("2026-01-31T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Doubles Women Pro
  const doublesWomenPro = await findOrCreateVariant("Doubles Women Pro", {
    description: "Equipas de 2 (M|M) profissional",
    distanceKm: 16,
    startDate: new Date("2026-01-31T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Doubles Men
  const doublesMen = await findOrCreateVariant("Doubles Men", {
    description: "Equipas de 2 (H|H)",
    distanceKm: 16,
    startDate: new Date("2026-01-31T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Doubles Men Pro
  const doublesMenPro = await findOrCreateVariant("Doubles Men Pro", {
    description: "Equipas de 2 (H|H) profissional",
    distanceKm: 16,
    startDate: new Date("2026-01-31T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Doubles Mixed
  const doublesMixed = await findOrCreateVariant("Doubles Mixed", {
    description: "Equipas de 2 (H|M)",
    distanceKm: 16,
    startDate: new Date("2026-01-31T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Relay Women
  const relayWomen = await findOrCreateVariant("Relay Women", {
    description: "Equipas de 4 (M|M|M|M)",
    distanceKm: 16,
    startDate: new Date("2026-01-31T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Relay Men
  const relayMen = await findOrCreateVariant("Relay Men", {
    description: "Equipas de 4 (H|H|H|H)",
    distanceKm: 16,
    startDate: new Date("2026-01-31T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Relay Mixed
  const relayMixed = await findOrCreateVariant("Relay Mixed", {
    description: "Equipas de 4 (H|H|M|M)",
    distanceKm: 16,
    startDate: new Date("2026-01-31T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  console.log("🏋️ All 12 variants upserted");

  // Step 4: Upsert variant translations
  const variants = [
    { id: singlesWomen.id, name: "Singles Women" },
    { id: singlesWomenPro.id, name: "Singles Women Pro" },
    { id: singlesMen.id, name: "Singles Men" },
    { id: singlesMenPro.id, name: "Singles Men Pro" },
    { id: doublesWomen.id, name: "Doubles Women" },
    { id: doublesWomenPro.id, name: "Doubles Women Pro" },
    { id: doublesMen.id, name: "Doubles Men" },
    { id: doublesMenPro.id, name: "Doubles Men Pro" },
    { id: doublesMixed.id, name: "Doubles Mixed" },
    { id: relayWomen.id, name: "Relay Women" },
    { id: relayMen.id, name: "Relay Men" },
    { id: relayMixed.id, name: "Relay Mixed" },
  ];

  const variantTranslations: Record<
    string,
    Record<Language, { name: string; description: string }>
  > = {
    "Singles Women": {
      pt: {
        name: "Singles Feminino",
        description: "Categoria individual feminina",
      },
      en: { name: "Singles Women", description: "Individual women category" },
      es: {
        name: "Singles Femenino",
        description: "Categoría individual femenina",
      },
      fr: {
        name: "Singles Femmes",
        description: "Catégorie individuelle féminine",
      },
      de: { name: "Singles Frauen", description: "Einzelkategorie Frauen" },
      it: {
        name: "Singles Donne",
        description: "Categoria individuale femminile",
      },
    },
    "Singles Women Pro": {
      pt: {
        name: "Singles Feminino Pro",
        description: "Categoria individual feminina profissional",
      },
      en: {
        name: "Singles Women Pro",
        description: "Individual women professional category",
      },
      es: {
        name: "Singles Femenino Pro",
        description: "Categoría individual femenina profesional",
      },
      fr: {
        name: "Singles Femmes Pro",
        description: "Catégorie individuelle féminine professionnelle",
      },
      de: {
        name: "Singles Frauen Pro",
        description: "Einzelkategorie Frauen Profi",
      },
      it: {
        name: "Singles Donne Pro",
        description: "Categoria individuale femminile professionale",
      },
    },
    "Singles Men": {
      pt: {
        name: "Singles Masculino",
        description: "Categoria individual masculina",
      },
      en: { name: "Singles Men", description: "Individual men category" },
      es: {
        name: "Singles Masculino",
        description: "Categoría individual masculina",
      },
      fr: {
        name: "Singles Hommes",
        description: "Catégorie individuelle masculine",
      },
      de: { name: "Singles Männer", description: "Einzelkategorie Männer" },
      it: {
        name: "Singles Uomini",
        description: "Categoria individuale maschile",
      },
    },
    "Singles Men Pro": {
      pt: {
        name: "Singles Masculino Pro",
        description: "Categoria individual masculina profissional",
      },
      en: {
        name: "Singles Men Pro",
        description: "Individual men professional category",
      },
      es: {
        name: "Singles Masculino Pro",
        description: "Categoría individual masculina profesional",
      },
      fr: {
        name: "Singles Hommes Pro",
        description: "Catégorie individuelle masculine professionnelle",
      },
      de: {
        name: "Singles Männer Pro",
        description: "Einzelkategorie Männer Profi",
      },
      it: {
        name: "Singles Uomini Pro",
        description: "Categoria individuale maschile professionale",
      },
    },
    "Doubles Women": {
      pt: { name: "Duplas Feminino", description: "Equipas de 2 (M|M)" },
      en: { name: "Doubles Women", description: "Teams of 2 (W|W)" },
      es: { name: "Dobles Femenino", description: "Equipos de 2 (M|M)" },
      fr: { name: "Doubles Femmes", description: "Équipes de 2 (F|F)" },
      de: { name: "Doppel Frauen", description: "Teams von 2 (F|F)" },
      it: { name: "Doppie Donne", description: "Squadre di 2 (D|D)" },
    },
    "Doubles Women Pro": {
      pt: {
        name: "Duplas Feminino Pro",
        description: "Equipas de 2 (M|M) profissional",
      },
      en: {
        name: "Doubles Women Pro",
        description: "Teams of 2 (W|W) professional",
      },
      es: {
        name: "Dobles Femenino Pro",
        description: "Equipos de 2 (M|M) profesional",
      },
      fr: {
        name: "Doubles Femmes Pro",
        description: "Équipes de 2 (F|F) professionnelle",
      },
      de: { name: "Doppel Frauen Pro", description: "Teams von 2 (F|F) Profi" },
      it: {
        name: "Doppie Donne Pro",
        description: "Squadre di 2 (D|D) professionale",
      },
    },
    "Doubles Men": {
      pt: { name: "Duplas Masculino", description: "Equipas de 2 (H|H)" },
      en: { name: "Doubles Men", description: "Teams of 2 (M|M)" },
      es: { name: "Dobles Masculino", description: "Equipos de 2 (H|H)" },
      fr: { name: "Doubles Hommes", description: "Équipes de 2 (H|H)" },
      de: { name: "Doppel Männer", description: "Teams von 2 (M|M)" },
      it: { name: "Doppie Uomini", description: "Squadre di 2 (U|U)" },
    },
    "Doubles Men Pro": {
      pt: {
        name: "Duplas Masculino Pro",
        description: "Equipas de 2 (H|H) profissional",
      },
      en: {
        name: "Doubles Men Pro",
        description: "Teams of 2 (M|M) professional",
      },
      es: {
        name: "Dobles Masculino Pro",
        description: "Equipos de 2 (H|H) profesional",
      },
      fr: {
        name: "Doubles Hommes Pro",
        description: "Équipes de 2 (H|H) professionnelle",
      },
      de: { name: "Doppel Männer Pro", description: "Teams von 2 (M|M) Profi" },
      it: {
        name: "Doppie Uomini Pro",
        description: "Squadre di 2 (U|U) professionale",
      },
    },
    "Doubles Mixed": {
      pt: { name: "Duplas Misto", description: "Equipas de 2 (H|M)" },
      en: { name: "Doubles Mixed", description: "Teams of 2 (M|W)" },
      es: { name: "Dobles Mixto", description: "Equipos de 2 (H|M)" },
      fr: { name: "Doubles Mixte", description: "Équipes de 2 (H|F)" },
      de: { name: "Doppel Mixed", description: "Teams von 2 (M|F)" },
      it: { name: "Doppie Misto", description: "Squadre di 2 (U|D)" },
    },
    "Relay Women": {
      pt: { name: "Estafeta Feminino", description: "Equipas de 4 (M|M|M|M)" },
      en: { name: "Relay Women", description: "Teams of 4 (W|W|W|W)" },
      es: { name: "Relevos Femenino", description: "Equipos de 4 (M|M|M|M)" },
      fr: { name: "Relais Femmes", description: "Équipes de 4 (F|F|F|F)" },
      de: { name: "Staffel Frauen", description: "Teams von 4 (F|F|F|F)" },
      it: { name: "Staffetta Donne", description: "Squadre di 4 (D|D|D|D)" },
    },
    "Relay Men": {
      pt: { name: "Estafeta Masculino", description: "Equipas de 4 (H|H|H|H)" },
      en: { name: "Relay Men", description: "Teams of 4 (M|M|M|M)" },
      es: { name: "Relevos Masculino", description: "Equipos de 4 (H|H|H|H)" },
      fr: { name: "Relais Hommes", description: "Équipes de 4 (H|H|H|H)" },
      de: { name: "Staffel Männer", description: "Teams von 4 (M|M|M|M)" },
      it: { name: "Staffetta Uomini", description: "Squadre di 4 (U|U|U|U)" },
    },
    "Relay Mixed": {
      pt: { name: "Estafeta Misto", description: "Equipas de 4 (H|H|M|M)" },
      en: { name: "Relay Mixed", description: "Teams of 4 (M|M|W|W)" },
      es: { name: "Relevos Mixto", description: "Equipos de 4 (H|H|M|M)" },
      fr: { name: "Relais Mixte", description: "Équipes de 4 (H|H|F|F)" },
      de: { name: "Staffel Mixed", description: "Teams von 4 (M|M|F|F)" },
      it: { name: "Staffetta Misto", description: "Squadre di 4 (U|U|D|D)" },
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

  console.log(
    "📝 Variant translations upserted for all 12 variants in 6 languages"
  );

  // Step 5: Upsert pricing phases
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

  await findOrCreatePricingPhase("Singles - Esgotado", {
    startDate: new Date("2025-11-01T00:00:00Z"),
    endDate: new Date("2026-01-31T07:59:59Z"),
    price: 55.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Singles Women, Singles Women Pro, Singles Men, Singles Men Pro - Todas esgotadas",
  });

  await findOrCreatePricingPhase("Doubles - Esgotado", {
    startDate: new Date("2025-11-01T00:00:00Z"),
    endDate: new Date("2026-01-31T07:59:59Z"),
    price: 95.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Doubles Women, Doubles Women Pro, Doubles Men, Doubles Men Pro, Doubles Mixed - Todas esgotadas",
  });

  await findOrCreatePricingPhase("Relay - Disponível", {
    startDate: new Date("2025-11-01T00:00:00Z"),
    endDate: new Date("2026-01-31T07:59:59Z"),
    price: 120.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Relay Women, Relay Men, Relay Mixed - Ainda disponíveis",
  });

  console.log(
    "💰 Pricing phases upserted (Singles €55, Doubles €95, Relay €120)"
  );
  console.log("✅ Hybrid Day® Aveiro 2026 seed completed successfully!");
  console.log("📅 Event date: Friday, January 31, 2026 (08:00 - 20:30)");
  console.log("📍 Location: Aveiro Parquexpo, Aveiro, Portugal");
  console.log("🔗 Registration: https://www.tickettailor.com/events/hybridday");
  console.log(
    "🏋️ 12 categories: Singles, Doubles, Relay (Women/Men/Pro/Mixed)"
  );
  console.log("🏆 The biggest hybrid competition in the Iberian Peninsula!");
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
