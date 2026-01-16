/**
 * Seed Hybrid Day® Madrid 2026
 * Complete with translations in all 6 languages
 * Idempotent pattern - safe to run multiple times
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏋️ Seeding Hybrid Day® Madrid 2026...");

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
    where: { slug: "hybrid-day-madrid-2026" },
    update: {
      title: "Hybrid Day® Madrid",
      description: `# 🏋️ Hybrid Day® Madrid 2026

O **Hybrid Day** chega a Madrid, e o **IFEMA** será o palco de mais um desafio inesquecível!

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

**IFEMA**
Av. del Partenón, 5, Madrid, España, 28042

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

Cada edição do Hybrid Day é única, e Madrid não será exceção. Prepara-te para sentir a adrenalina, superar os teus limites e fazer parte da comunidade que está a redefinir o conceito de competição funcional na Península Ibérica!`,
      sportTypes: [SportType.HYROX],
      startDate: new Date("2026-02-14T08:00:00Z"),
      endDate: new Date("2026-02-15T20:30:00Z"),
      city: "Madrid",
      country: "España",
      latitude: 40.46798545270473,
      longitude: -3.616780789197938,
      googleMapsUrl: "https://maps.app.goo.gl/Y3LMqx7Vr65yJdPj8",
      externalUrl: "https://www.tickettailor.com/events/hybridday",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-02-14T07:59:59Z"),
    },
    create: {
      title: "Hybrid Day® Madrid",
      slug: "hybrid-day-madrid-2026",
      description: `# 🏋️ Hybrid Day® Madrid 2026

O **Hybrid Day** chega a Madrid, e o **IFEMA** será o palco de mais um desafio inesquecível!

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

**IFEMA**
Av. del Partenón, 5, Madrid, España, 28042

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

Cada edição do Hybrid Day é única, e Madrid não será exceção. Prepara-te para sentir a adrenalina, superar os teus limites e fazer parte da comunidade que está a redefinir o conceito de competição funcional na Península Ibérica!`,
      sportTypes: [SportType.HYROX],
      startDate: new Date("2026-02-14T08:00:00Z"),
      endDate: new Date("2026-02-15T20:30:00Z"),
      city: "Madrid",
      country: "España",
      latitude: 40.46798545270473,
      longitude: -3.616780789197938,
      googleMapsUrl: "https://maps.app.goo.gl/Y3LMqx7Vr65yJdPj8",
      externalUrl: "https://www.tickettailor.com/events/hybridday",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-02-14T07:59:59Z"),
    },
  });

  console.log("✅ Event upserted:", event.title);

  // Step 2: Upsert translations for all 6 languages
  const translations = {
    pt: {
      title: "Hybrid Day® Madrid",
      description: `# 🏋️ Hybrid Day® Madrid 2026

O **Hybrid Day** é a maior competição híbrida da Península Ibérica!

8 Exercícios + 8km de corrida em Madrid. Testa os teus limites numa competição que combina força, resistência e determinação.

## 🎯 O Formato

- **8 Estações:** Ski Erg, Sled Push/Pull, Burpees, Remo, Farmer's Carry, Lunges, Wall Balls
- **8km de Corrida:** 1km antes de cada exercício
- **Comunidade:** Atletas de todas as modalidades e níveis

## 🏆 Categorias

Singles (Women/Men/Pro), Doubles (Women/Men/Mixed/Pro), Relay (4 atletas)`,
      city: "Madrid",
      metaTitle: "Hybrid Day® Madrid 2026 - Inscrições | Athlifyr",
      metaDescription:
        "Participa no Hybrid Day® Madrid 2026. A maior competição híbrida da Península Ibérica! 8 exercícios + 8km de corrida. Inscreve-te já!",
    },
    en: {
      title: "Hybrid Day® Madrid",
      description: `# 🏋️ Hybrid Day® Madrid 2026

**Hybrid Day** is the biggest hybrid competition in the Iberian Peninsula!

8 Exercises + 8km of running through Madrid. Test your limits in a competition that combines strength, endurance and determination.

## 🎯 The Format

- **8 Stations:** Ski Erg, Sled Push/Pull, Burpees, Rowing, Farmer's Carry, Lunges, Wall Balls
- **8km Running:** 1km before each exercise
- **Community:** Athletes from all sports and levels

## 🏆 Categories

Singles (Women/Men/Pro), Doubles (Women/Men/Mixed/Pro), Relay (4 athletes)`,
      city: "Madrid",
      metaTitle: "Hybrid Day® Madrid 2026 - Registration | Athlifyr",
      metaDescription:
        "Join Hybrid Day® Madrid 2026. The biggest hybrid competition in the Iberian Peninsula! 8 exercises + 8km running. Register now!",
    },
    es: {
      title: "Hybrid Day® Madrid",
      description: `# 🏋️ Hybrid Day® Madrid 2026

**Hybrid Day** es la mayor competición híbrida de la Península Ibérica!

8 Ejercicios + 8km de carrera por Madrid. Pon a prueba tus límites en una competición que combina fuerza, resistencia y determinación.

## 🎯 El Formato

- **8 Estaciones:** Ski Erg, Sled Push/Pull, Burpees, Remo, Farmer's Carry, Lunges, Wall Balls
- **8km de Carrera:** 1km antes de cada ejercicio
- **Comunidad:** Atletas de todos los deportes y niveles

## 🏆 Categorías

Singles (Mujeres/Hombres/Pro), Doubles (Mujeres/Hombres/Mixto/Pro), Relay (4 atletas)`,
      city: "Madrid",
      metaTitle: "Hybrid Day® Madrid 2026 - Inscripciones | Athlifyr",
      metaDescription:
        "Participa en Hybrid Day® Madrid 2026. ¡La mayor competición híbrida de la Península Ibérica! 8 ejercicios + 8km de carrera. ¡Inscríbete ya!",
    },
    fr: {
      title: "Hybrid Day® Madrid",
      description: `# 🏋️ Hybrid Day® Madrid 2026

**Hybrid Day** est la plus grande compétition hybride de la péninsule ibérique !

8 Exercices + 8km de course à Madrid. Testez vos limites dans une compétition qui combine force, endurance et détermination.

## 🎯 Le Format

- **8 Stations:** Ski Erg, Sled Push/Pull, Burpees, Aviron, Farmer's Carry, Fentes, Wall Balls
- **8km de Course:** 1km avant chaque exercice
- **Communauté:** Athlètes de tous les sports et niveaux

## 🏆 Catégories

Singles (Femmes/Hommes/Pro), Doubles (Femmes/Hommes/Mixte/Pro), Relais (4 athlètes)`,
      city: "Madrid",
      metaTitle: "Hybrid Day® Madrid 2026 - Inscription | Athlifyr",
      metaDescription:
        "Participez au Hybrid Day® Madrid 2026. La plus grande compétition hybride de la péninsule ibérique ! 8 exercices + 8km de course. Inscrivez-vous !",
    },
    de: {
      title: "Hybrid Day® Madrid",
      description: `# 🏋️ Hybrid Day® Madrid 2026

**Hybrid Day** ist der größte Hybrid-Wettbewerb auf der Iberischen Halbinsel!

8 Übungen + 8km Laufen durch Madrid. Testen Sie Ihre Grenzen in einem Wettbewerb, der Kraft, Ausdauer und Entschlossenheit kombiniert.

## 🎯 Das Format

- **8 Stationen:** Ski Erg, Sled Push/Pull, Burpees, Rudern, Farmer's Carry, Lunges, Wall Balls
- **8km Laufen:** 1km vor jeder Übung
- **Gemeinschaft:** Athleten aller Sportarten und Levels

## 🏆 Kategorien

Singles (Frauen/Männer/Pro), Doubles (Frauen/Männer/Mixed/Pro), Staffel (4 Athleten)`,
      city: "Madrid",
      metaTitle: "Hybrid Day® Madrid 2026 - Anmeldung | Athlifyr",
      metaDescription:
        "Nehmen Sie am Hybrid Day® Madrid 2026 teil. Der größte Hybrid-Wettbewerb der Iberischen Halbinsel! 8 Übungen + 8km Laufen. Jetzt anmelden!",
    },
    it: {
      title: "Hybrid Day® Madrid",
      description: `# 🏋️ Hybrid Day® Madrid 2026

**Hybrid Day** è la più grande competizione ibrida della Penisola Iberica!

8 Esercizi + 8km di corsa a Madrid. Metti alla prova i tuoi limiti in una competizione che combina forza, resistenza e determinazione.

## 🎯 Il Formato

- **8 Stazioni:** Ski Erg, Sled Push/Pull, Burpees, Canottaggio, Farmer's Carry, Affondi, Wall Balls
- **8km di Corsa:** 1km prima di ogni esercizio
- **Comunità:** Atleti di tutti gli sport e livelli

## 🏆 Categorie

Singles (Donne/Uomini/Pro), Doubles (Donne/Uomini/Misto/Pro), Staffetta (4 atleti)`,
      city: "Madrid",
      metaTitle: "Hybrid Day® Madrid 2026 - Iscrizione | Athlifyr",
      metaDescription:
        "Partecipa all'Hybrid Day® Madrid 2026. La più grande competizione ibrida della Penisola Iberica! 8 esercizi + 8km di corsa. Iscriviti ora!",
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
  await findOrCreateVariant("Singles Women", {
    description: "Categoria individual feminina",
    distanceKm: 8,
    startDate: new Date("2026-02-14T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Singles Women Pro
  await findOrCreateVariant("Singles Women Pro", {
    description: "Categoria individual feminina profissional",
    distanceKm: 8,
    startDate: new Date("2026-02-14T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Singles Men
  await findOrCreateVariant("Singles Men", {
    description: "Categoria individual masculina",
    distanceKm: 8,
    startDate: new Date("2026-02-14T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Singles Men Pro
  await findOrCreateVariant("Singles Men Pro", {
    description: "Categoria individual masculina profissional",
    distanceKm: 8,
    startDate: new Date("2026-02-14T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Doubles Women
  await findOrCreateVariant("Doubles Women", {
    description: "Equipas de 2 (M|M)",
    distanceKm: 8,
    startDate: new Date("2026-02-14T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Doubles Women Pro
  await findOrCreateVariant("Doubles Women Pro", {
    description: "Equipas de 2 (M|M) profissional",
    distanceKm: 8,
    startDate: new Date("2026-02-14T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Doubles Men
  await findOrCreateVariant("Doubles Men", {
    description: "Equipas de 2 (H|H)",
    distanceKm: 8,
    startDate: new Date("2026-02-14T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Doubles Men Pro
  await findOrCreateVariant("Doubles Men Pro", {
    description: "Equipas de 2 (H|H) profissional",
    distanceKm: 8,
    startDate: new Date("2026-02-14T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Doubles Mixed
  await findOrCreateVariant("Doubles Mixed", {
    description: "Equipas de 2 (H|M)",
    distanceKm: 8,
    startDate: new Date("2026-02-14T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Relay Women
  await findOrCreateVariant("Relay Women", {
    description: "Equipas de 4 (M|M|M|M)",
    distanceKm: 8,
    startDate: new Date("2026-02-14T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Relay Men
  await findOrCreateVariant("Relay Men", {
    description: "Equipas de 4 (H|H|H|H)",
    distanceKm: 8,
    startDate: new Date("2026-02-14T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Relay Mixed
  await findOrCreateVariant("Relay Mixed", {
    description: "Equipas de 4 (H|H|M|M)",
    distanceKm: 8,
    startDate: new Date("2026-02-14T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  console.log("🏋️ All 12 variants upserted");

  // Step 4: Upsert pricing phases
  // Helper function to find or create pricing phases
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

  await findOrCreatePricingPhase("Early Bird", {
    startDate: new Date("2025-10-01T00:00:00Z"),
    endDate: new Date("2025-12-31T23:59:59Z"),
    price: 45.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Early bird pricing for all categories",
  });

  await findOrCreatePricingPhase("Regular", {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-02-10T23:59:59Z"),
    price: 55.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Regular pricing for all categories",
  });

  await findOrCreatePricingPhase("Last Chance", {
    startDate: new Date("2026-02-11T00:00:00Z"),
    endDate: new Date("2026-02-14T07:59:59Z"),
    price: 65.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Last chance pricing before event",
  });

  console.log(
    "💰 Pricing phases upserted (Early Bird €45, Regular €55, Last Chance €65)"
  );
  console.log("✅ Hybrid Day® Madrid 2026 seed completed successfully!");
  console.log(
    "📅 Event date: Saturday-Sunday, February 14-15, 2026 (08:00 - 20:30)"
  );
  console.log("📍 Location: IFEMA, Madrid, España");
  console.log("🔗 Registration: https://www.tickettailor.com/events/hybridday");
  console.log(
    "🏋️ 12 categories: Singles, Doubles, Relay (Women/Men/Pro/Mixed)"
  );
  console.log("� The biggest hybrid competition in the Iberian Peninsula!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding Hybrid Day® Madrid 2026:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
