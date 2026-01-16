/**
 * Seed Hybrid Day® Málaga 2026
 * Complete with translations in all 6 languages
 * Idempotent pattern - safe to run multiple times
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏋️ Seeding Hybrid Day® Málaga 2026...");

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
    where: { slug: "hybrid-day-malaga-2026" },
    update: {
      title: "Hybrid Day® Málaga",
      description: `# 🏋️ Hybrid Day® Málaga 2026

¡El **Hybrid Day** llega a Málaga, y el **Campo Municipal de Atletismo de Torremolinos** será el escenario de un desafío inolvidable!

Atletas de diferentes disciplinas y niveles de experiencia pondrán a prueba su fuerza, resistencia y determinación en un formato que combina **carrera con ejercicios funcionales** — una experiencia intensa, envolvente y llena de energía.

## 🎯 El Formato

El formato del Hybrid Day es el mismo en todas las pruebas, ¡pero garantizamos que cada una será única!

### 8 Ejercicios + 8km de Carrera

**Antes de cada ejercicio: 1km de carrera**

1. **Ski Erg (1000m)** - Ritmo y resistencia
2. **Sled Push (50m)** - Potencia y fuerza máxima
3. **Sled Pull (50m)** - Coordinación y explosión muscular
4. **Burpees Broad Jump (80m)** - Supérate en cada repetición
5. **Remo (1000m)** - Ritmo, enfoque y resistencia
6. **Farmer's Carry (200m)** - Fuerza y estabilidad
7. **Sandbag Lunges (100m)** - Equilibrio y resistencia de piernas
8. **Wall Balls (100)** - Energía y precisión en el objetivo

## 📍 Ubicación

**Campo Municipal de Atletismo**
C. de los Pinares, 3
Torremolinos, Málaga, 29620

## 🏆 Categorías

### Singles
- Singles Women / Women Pro
- Singles Men / Men Pro

### Doubles (Parejas)
- Doubles Women / Women Pro
- Doubles Men / Men Pro
- Doubles Mixed

### Relay (Relevos de 4)
- Relay Women
- Relay Men
- Relay Mixed

## ✨ Experiencia Única

- **Comunidad:** Una experiencia que une atletas de todas las disciplinas y niveles
- **Apoyo:** Desde la hidratación hasta el soporte de todo el staff
- **Energía:** Ambiente único de competición y camaradería

Cada edición del Hybrid Day es única, y Málaga no será una excepción. ¡Prepárate para sentir la adrenalina, superar tus límites y formar parte de la comunidad que está redefiniendo el concepto de competición funcional en España!`,
      sportTypes: [SportType.HYROX],
      startDate: new Date("2026-10-10T08:00:00Z"),
      endDate: new Date("2026-10-10T20:30:00Z"),
      city: "Málaga",
      country: "España",
      latitude: 36.62134,
      longitude: -4.50056,
      googleMapsUrl: "https://maps.app.goo.gl/",
      externalUrl: "https://www.tickettailor.com/events/hybridday",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-10-10T07:59:59Z"),
    },
    create: {
      title: "Hybrid Day® Málaga",
      slug: "hybrid-day-malaga-2026",
      description: `# 🏋️ Hybrid Day® Málaga 2026

¡El **Hybrid Day** llega a Málaga, y el **Campo Municipal de Atletismo de Torremolinos** será el escenario de un desafío inolvidable!

Atletas de diferentes disciplinas y niveles de experiencia pondrán a prueba su fuerza, resistencia y determinación en un formato que combina **carrera con ejercicios funcionales** — una experiencia intensa, envolvente y llena de energía.

## 🎯 El Formato

El formato del Hybrid Day es el mismo en todas las pruebas, ¡pero garantizamos que cada una será única!

### 8 Ejercicios + 8km de Carrera

**Antes de cada ejercicio: 1km de carrera**

1. **Ski Erg (1000m)** - Ritmo y resistencia
2. **Sled Push (50m)** - Potencia y fuerza máxima
3. **Sled Pull (50m)** - Coordinación y explosión muscular
4. **Burpees Broad Jump (80m)** - Supérate en cada repetición
5. **Remo (1000m)** - Ritmo, enfoque y resistencia
6. **Farmer's Carry (200m)** - Fuerza y estabilidad
7. **Sandbag Lunges (100m)** - Equilibrio y resistencia de piernas
8. **Wall Balls (100)** - Energía y precisión en el objetivo

## 📍 Ubicación

**Campo Municipal de Atletismo**
C. de los Pinares, 3
Torremolinos, Málaga, 29620

## 🏆 Categorías

### Singles
- Singles Women / Women Pro
- Singles Men / Men Pro

### Doubles (Parejas)
- Doubles Women / Women Pro
- Doubles Men / Men Pro
- Doubles Mixed

### Relay (Relevos de 4)
- Relay Women
- Relay Men
- Relay Mixed

## ✨ Experiencia Única

- **Comunidad:** Una experiencia que une atletas de todas las disciplinas y niveles
- **Apoyo:** Desde la hidratación hasta el soporte de todo el staff
- **Energía:** Ambiente único de competición y camaradería

Cada edición del Hybrid Day es única, y Málaga no será una excepción. ¡Prepárate para sentir la adrenalina, superar tus límites y formar parte de la comunidad que está redefiniendo el concepto de competición funcional en España!`,
      sportTypes: [SportType.HYROX],
      startDate: new Date("2026-10-10T08:00:00Z"),
      endDate: new Date("2026-10-10T20:30:00Z"),
      city: "Málaga",
      country: "España",
      latitude: 36.62134,
      longitude: -4.50056,
      googleMapsUrl: "https://maps.app.goo.gl/",
      externalUrl: "https://www.tickettailor.com/events/hybridday",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-10-10T07:59:59Z"),
    },
  });

  console.log("✅ Event upserted:", event.title);

  // Step 2: Upsert translations for all 6 languages
  const translations = {
    pt: {
      title: "Hybrid Day® Málaga",
      description: `# 🏋️ Hybrid Day® Málaga 2026

O **Hybrid Day** é a maior competição híbrida da Península Ibérica!

8 Exercícios + 8km de corrida em Málaga. Testa os teus limites numa competição que combina força, resistência e determinação.

## 🎯 O Formato

- **8 Estações:** Ski Erg, Sled Push/Pull, Burpees, Remo, Farmer's Carry, Lunges, Wall Balls
- **8km de Corrida:** 1km antes de cada exercício
- **Comunidade:** Atletas de todas as modalidades e níveis

## 🏆 Categorias

Singles (Women/Men/Pro), Doubles (Women/Men/Mixed/Pro), Relay (4 atletas)`,
      city: "Málaga",
      metaTitle: "Hybrid Day® Málaga 2026 - Inscrições | Athlifyr",
      metaDescription:
        "Participa no Hybrid Day® Málaga 2026. A maior competição híbrida da Península Ibérica! 8 exercícios + 8km de corrida. Inscreve-te já!",
    },
    en: {
      title: "Hybrid Day® Málaga",
      description: `# 🏋️ Hybrid Day® Málaga 2026

**Hybrid Day** is the biggest hybrid competition in the Iberian Peninsula!

8 Exercises + 8km of running through Málaga. Test your limits in a competition that combines strength, endurance and determination.

## 🎯 The Format

- **8 Stations:** Ski Erg, Sled Push/Pull, Burpees, Rowing, Farmer's Carry, Lunges, Wall Balls
- **8km Running:** 1km before each exercise
- **Community:** Athletes from all sports and levels

## 🏆 Categories

Singles (Women/Men/Pro), Doubles (Women/Men/Mixed/Pro), Relay (4 athletes)`,
      city: "Málaga",
      metaTitle: "Hybrid Day® Málaga 2026 - Registration | Athlifyr",
      metaDescription:
        "Join Hybrid Day® Málaga 2026. The biggest hybrid competition in the Iberian Peninsula! 8 exercises + 8km running. Register now!",
    },
    es: {
      title: "Hybrid Day® Málaga",
      description: `# 🏋️ Hybrid Day® Málaga 2026

**Hybrid Day** es la mayor competición híbrida de la Península Ibérica!

8 Ejercicios + 8km de carrera por Málaga. Pon a prueba tus límites en una competición que combina fuerza, resistencia y determinación.

## 🎯 El Formato

- **8 Estaciones:** Ski Erg, Sled Push/Pull, Burpees, Remo, Farmer's Carry, Lunges, Wall Balls
- **8km de Carrera:** 1km antes de cada ejercicio
- **Comunidad:** Atletas de todos los deportes y niveles

## 🏆 Categorías

Singles (Mujeres/Hombres/Pro), Doubles (Mujeres/Hombres/Mixto/Pro), Relay (4 atletas)`,
      city: "Málaga",
      metaTitle: "Hybrid Day® Málaga 2026 - Inscripciones | Athlifyr",
      metaDescription:
        "Participa en Hybrid Day® Málaga 2026. ¡La mayor competición híbrida de la Península Ibérica! 8 ejercicios + 8km de carrera. ¡Inscríbete ya!",
    },
    fr: {
      title: "Hybrid Day® Málaga",
      description: `# 🏋️ Hybrid Day® Málaga 2026

**Hybrid Day** est la plus grande compétition hybride de la péninsule ibérique !

8 Exercices + 8km de course à Málaga. Testez vos limites dans une compétition qui combine force, endurance et détermination.

## 🎯 Le Format

- **8 Stations:** Ski Erg, Sled Push/Pull, Burpees, Aviron, Farmer's Carry, Fentes, Wall Balls
- **8km de Course:** 1km avant chaque exercice
- **Communauté:** Athlètes de tous les sports et niveaux

## 🏆 Catégories

Singles (Femmes/Hommes/Pro), Doubles (Femmes/Hommes/Mixte/Pro), Relais (4 athlètes)`,
      city: "Málaga",
      metaTitle: "Hybrid Day® Málaga 2026 - Inscription | Athlifyr",
      metaDescription:
        "Participez au Hybrid Day® Málaga 2026. La plus grande compétition hybride de la péninsule ibérique ! 8 exercices + 8km de course. Inscrivez-vous !",
    },
    de: {
      title: "Hybrid Day® Málaga",
      description: `# 🏋️ Hybrid Day® Málaga 2026

**Hybrid Day** ist der größte Hybrid-Wettbewerb auf der Iberischen Halbinsel!

8 Übungen + 8km Laufen durch Málaga. Testen Sie Ihre Grenzen in einem Wettbewerb, der Kraft, Ausdauer und Entschlossenheit kombiniert.

## 🎯 Das Format

- **8 Stationen:** Ski Erg, Sled Push/Pull, Burpees, Rudern, Farmer's Carry, Lunges, Wall Balls
- **8km Laufen:** 1km vor jeder Übung
- **Gemeinschaft:** Athleten aller Sportarten und Levels

## 🏆 Kategorien

Singles (Frauen/Männer/Pro), Doubles (Frauen/Männer/Mixed/Pro), Staffel (4 Athleten)`,
      city: "Málaga",
      metaTitle: "Hybrid Day® Málaga 2026 - Anmeldung | Athlifyr",
      metaDescription:
        "Nehmen Sie am Hybrid Day® Málaga 2026 teil. Der größte Hybrid-Wettbewerb der Iberischen Halbinsel! 8 Übungen + 8km Laufen. Jetzt anmelden!",
    },
    it: {
      title: "Hybrid Day® Málaga",
      description: `# 🏋️ Hybrid Day® Málaga 2026

**Hybrid Day** è la più grande competizione ibrida della Penisola Iberica!

8 Esercizi + 8km di corsa a Málaga. Metti alla prova i tuoi limiti in una competizione che combina forza, resistenza e determinazione.

## 🎯 Il Formato

- **8 Stazioni:** Ski Erg, Sled Push/Pull, Burpees, Canottaggio, Farmer's Carry, Affondi, Wall Balls
- **8km di Corsa:** 1km prima di ogni esercizio
- **Comunità:** Atleti di tutti gli sport e livelli

## 🏆 Categorie

Singles (Donne/Uomini/Pro), Doubles (Donne/Uomini/Misto/Pro), Staffetta (4 atleti)`,
      city: "Málaga",
      metaTitle: "Hybrid Day® Málaga 2026 - Iscrizione | Athlifyr",
      metaDescription:
        "Partecipa all'Hybrid Day® Málaga 2026. La più grande competizione ibrida della Penisola Iberica! 8 esercizi + 8km di corsa. Iscriviti ora!",
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
    description: "Categoria individual femenina",
    distanceKm: 8,
    startDate: new Date("2026-10-10T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Singles Women Pro
  await findOrCreateVariant("Singles Women Pro", {
    description: "Categoria individual femenina profesional",
    distanceKm: 8,
    startDate: new Date("2026-10-10T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Singles Men
  await findOrCreateVariant("Singles Men", {
    description: "Categoria individual masculina",
    distanceKm: 8,
    startDate: new Date("2026-10-10T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Singles Men Pro
  await findOrCreateVariant("Singles Men Pro", {
    description: "Categoria individual masculina profesional",
    distanceKm: 8,
    startDate: new Date("2026-10-10T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Doubles Women
  await findOrCreateVariant("Doubles Women", {
    description: "Parejas de 2 (M|M)",
    distanceKm: 8,
    startDate: new Date("2026-10-10T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Doubles Women Pro
  await findOrCreateVariant("Doubles Women Pro", {
    description: "Parejas de 2 (M|M) profesional",
    distanceKm: 8,
    startDate: new Date("2026-10-10T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Doubles Men
  await findOrCreateVariant("Doubles Men", {
    description: "Parejas de 2 (H|H)",
    distanceKm: 8,
    startDate: new Date("2026-10-10T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Doubles Men Pro
  await findOrCreateVariant("Doubles Men Pro", {
    description: "Parejas de 2 (H|H) profesional",
    distanceKm: 8,
    startDate: new Date("2026-10-10T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Doubles Mixed
  await findOrCreateVariant("Doubles Mixed", {
    description: "Parejas de 2 (H|M)",
    distanceKm: 8,
    startDate: new Date("2026-10-10T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Relay Women
  await findOrCreateVariant("Relay Women", {
    description: "Equipos de 4 (M|M|M|M)",
    distanceKm: 8,
    startDate: new Date("2026-10-10T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Relay Men
  await findOrCreateVariant("Relay Men", {
    description: "Equipos de 4 (H|H|H|H)",
    distanceKm: 8,
    startDate: new Date("2026-10-10T08:00:00Z"),
    maxParticipants: null,
    currency: Currency.EUR,
  });

  // Relay Mixed
  await findOrCreateVariant("Relay Mixed", {
    description: "Equipos de 4 (H|H|M|M)",
    distanceKm: 8,
    startDate: new Date("2026-10-10T08:00:00Z"),
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
    startDate: new Date("2026-07-01T00:00:00Z"),
    endDate: new Date("2026-08-31T23:59:59Z"),
    price: 45.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Early bird pricing for all categories",
  });

  await findOrCreatePricingPhase("Regular", {
    startDate: new Date("2026-09-01T00:00:00Z"),
    endDate: new Date("2026-10-03T23:59:59Z"),
    price: 55.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Regular pricing for all categories",
  });

  await findOrCreatePricingPhase("Last Chance", {
    startDate: new Date("2026-10-04T00:00:00Z"),
    endDate: new Date("2026-10-10T07:59:59Z"),
    price: 65.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Last chance pricing before event",
  });

  console.log(
    "💰 Pricing phases upserted (Early Bird €45, Regular €55, Last Chance €65)"
  );
  console.log("✅ Hybrid Day® Málaga 2026 seed completed successfully!");
  console.log("📅 Event date: Saturday, October 10, 2026 (08:00 - 20:30)");
  console.log(
    "📍 Location: Campo Municipal de Atletismo, Torremolinos, Málaga, España"
  );
  console.log("🔗 Registration: https://www.tickettailor.com/events/hybridday");
  console.log(
    "🏋️ 12 categories: Singles, Doubles, Relay (Women/Men/Pro/Mixed)"
  );
  console.log("🏆 The biggest hybrid competition in the Iberian Peninsula!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding Hybrid Day® Málaga 2026:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
