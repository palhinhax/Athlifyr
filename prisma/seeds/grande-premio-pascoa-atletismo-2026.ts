/**
 * Seed: XXVIII Grande Prémio da Páscoa em Atletismo 2026
 *
 * Event: Athletics race and walk in Alcácer do Sal
 * Location: Parque Urbano 25 de Abril, Alcácer do Sal, Setúbal
 * Date: April 3, 2026 (Good Friday)
 * Organizer: Município de Alcácer do Sal
 * Sport: Running, Walking
 * Registration: www.acorrer.pt
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding XXVIII Grande Prémio da Páscoa em Atletismo 2026...");

  // ──────────────────────────────────────────────
  // 1. Upsert Event
  // ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: "grande-premio-pascoa-atletismo-2026" },
    update: {
      title: "XXVIII Grande Prémio da Páscoa em Atletismo 2026",
      description:
        "28º Grande Prémio da Páscoa em Atletismo 2026 - Corrida e caminhada em Alcácer do Sal",
      sportTypes: [SportType.RUNNING, SportType.WALKING],
      startDate: new Date("2026-04-03T09:00:00Z"),
      endDate: new Date("2026-04-03T13:00:00Z"),
      registrationDeadline: new Date("2026-03-29T23:59:00Z"),
      externalUrl: "https://www.acorrer.pt/",
      imageUrl: "",
      city: "Alcácer do Sal",
      country: "Portugal",
      latitude: 38.3726,
      longitude: -8.5122,
      googleMapsUrl: "https://maps.google.com/?q=38.3726,-8.5122",
      isFeatured: false,
      cancelled: false,
    },
    create: {
      title: "XXVIII Grande Prémio da Páscoa em Atletismo 2026",
      slug: "grande-premio-pascoa-atletismo-2026",
      description:
        "28º Grande Prémio da Páscoa em Atletismo 2026 - Corrida e caminhada em Alcácer do Sal",
      sportTypes: [SportType.RUNNING, SportType.WALKING],
      startDate: new Date("2026-04-03T09:00:00Z"),
      endDate: new Date("2026-04-03T13:00:00Z"),
      registrationDeadline: new Date("2026-03-29T23:59:00Z"),
      externalUrl: "https://www.acorrer.pt/",
      imageUrl: "",
      city: "Alcácer do Sal",
      country: "Portugal",
      latitude: 38.3726,
      longitude: -8.5122,
      googleMapsUrl: "https://maps.google.com/?q=38.3726,-8.5122",
      isFeatured: false,
      cancelled: false,
    },
  });

  console.log(`✅ Event upserted: ${event.slug}`);

  // ──────────────────────────────────────────────
  // 2. Translations (ALL 6 languages)
  // ──────────────────────────────────────────────
  const translations: Record<
    string,
    {
      title: string;
      description: string;
      city: string;
      metaTitle: string;
      metaDescription: string;
    }
  > = {
    pt: {
      title: "XXVIII Grande Prémio da Páscoa em Atletismo 2026",
      description: `# 🏃 XXVIII Grande Prémio da Páscoa em Atletismo 2026

**O 28.º Grande Prémio da Páscoa em Atletismo realiza-se a 3 de abril de 2026 (Sexta-Feira Santa) em Alcácer do Sal!** Organizado pelo **Município de Alcácer do Sal**, com o apoio da Junta de Freguesia de Santiago e Santa Maria.

Partida e chegada no **Parque Urbano 25 de Abril**. Percursos ao longo da periferia da cidade e marginal.

---

## 🏃 Provas

- **Corrida 10 km** – 10:00 · Juniores a Veteranos V
- **Corrida 5 km** – 10:00 · Juvenis M/F
- **Kids Run 1000 m** – 09:00 · Iniciados
- **Kids Run 800 m** – 09:00 · Infantis
- **Kids Run 300 m** – 09:00 · Benjamins A e B
- **Caminhada 5 km** – 10:00 · Aberta a todos

---

🏃 **Vem celebrar a Páscoa a correr em Alcácer do Sal!** 🐣`,
      city: "Alcácer do Sal",
      metaTitle:
        "Grande Prémio da Páscoa Atletismo 2026 | Alcácer do Sal | 3 Abril",
      metaDescription:
        "28.º Grande Prémio da Páscoa em Atletismo a 3 de abril de 2026 em Alcácer do Sal. Corrida 10km e 5km, Kids Run e Caminhada 5km. Município de Alcácer do Sal.",
    },
    en: {
      title: "28th Easter Athletics Grand Prix 2026",
      description: `# 🏃 28th Easter Athletics Grand Prix 2026

**The 28th Easter Athletics Grand Prix takes place on April 3, 2026 (Good Friday) in Alcácer do Sal!** Organized by the **Municipality of Alcácer do Sal**, with support from the Santiago e Santa Maria Parish Council.

Start and finish at **Parque Urbano 25 de Abril**. Courses along the city outskirts and waterfront.

---

## 🏃 Races

- **10 km Race** – 10:00 · Juniors to Veterans V
- **5 km Race** – 10:00 · Youth M/F
- **Kids Run 1000 m** – 09:00 · Under-14
- **Kids Run 800 m** – 09:00 · Under-12
- **Kids Run 300 m** – 09:00 · Under-10
- **5 km Walk** – 10:00 · Open to all

---

🏃 **Come celebrate Easter running in Alcácer do Sal!** 🐣`,
      city: "Alcácer do Sal",
      metaTitle: "Easter Athletics Grand Prix 2026 | Alcácer do Sal | April 3",
      metaDescription:
        "28th Easter Athletics Grand Prix on April 3, 2026 in Alcácer do Sal. 10km and 5km Race, Kids Run and 5km Walk. Municipality of Alcácer do Sal.",
    },
    es: {
      title: "XXVIII Gran Premio de Pascua de Atletismo 2026",
      description: `# 🏃 XXVIII Gran Premio de Pascua de Atletismo 2026

**El 28.º Gran Premio de Pascua de Atletismo se celebra el 3 de abril de 2026 (Viernes Santo) en Alcácer do Sal.** Organizado por el **Municipio de Alcácer do Sal**, con el apoyo de la Junta de Freguesia de Santiago e Santa Maria.

Salida y llegada en el **Parque Urbano 25 de Abril**. Recorridos a lo largo de la periferia de la ciudad y el paseo marítimo.

---

## 🏃 Pruebas

- **Carrera 10 km** – 10:00 · Júniors a Veteranos V
- **Carrera 5 km** – 10:00 · Juveniles M/F
- **Kids Run 1000 m** – 09:00 · Iniciados
- **Kids Run 800 m** – 09:00 · Infantiles
- **Kids Run 300 m** – 09:00 · Benjamines A y B
- **Caminata 5 km** – 10:00 · Abierta a todos

---

🏃 **¡Ven a celebrar la Pascua corriendo en Alcácer do Sal!** 🐣`,
      city: "Alcácer do Sal",
      metaTitle: "Gran Premio Pascua Atletismo 2026 | Alcácer do Sal | 3 Abril",
      metaDescription:
        "28.º Gran Premio de Pascua de Atletismo el 3 de abril de 2026 en Alcácer do Sal. Carrera 10km y 5km, Kids Run y Caminata 5km. Municipio de Alcácer do Sal.",
    },
    fr: {
      title: "XXVIIIe Grand Prix de Pâques d'Athlétisme 2026",
      description: `# 🏃 XXVIIIe Grand Prix de Pâques d'Athlétisme 2026

**Le 28e Grand Prix de Pâques d'Athlétisme a lieu le 3 avril 2026 (Vendredi Saint) à Alcácer do Sal !** Organisé par la **Municipalité d'Alcácer do Sal**, avec le soutien de la Junta de Freguesia de Santiago e Santa Maria.

Départ et arrivée au **Parque Urbano 25 de Abril**. Parcours le long de la périphérie de la ville et du front de mer.

---

## 🏃 Épreuves

- **Course 10 km** – 10h00 · Juniors à Vétérans V
- **Course 5 km** – 10h00 · Cadets H/F
- **Kids Run 1000 m** – 09h00 · Minimes
- **Kids Run 800 m** – 09h00 · Benjamins
- **Kids Run 300 m** – 09h00 · Poussins
- **Randonnée 5 km** – 10h00 · Ouverte à tous

---

🏃 **Venez fêter Pâques en courant à Alcácer do Sal !** 🐣`,
      city: "Alcácer do Sal",
      metaTitle: "Grand Prix Pâques Athlétisme 2026 | Alcácer do Sal | 3 Avril",
      metaDescription:
        "28e Grand Prix de Pâques d'Athlétisme le 3 avril 2026 à Alcácer do Sal. Course 10km et 5km, Kids Run et Randonnée 5km. Municipalité d'Alcácer do Sal.",
    },
    de: {
      title: "XXVIII. Oster-Leichtathletik-Grand-Prix 2026",
      description: `# 🏃 XXVIII. Oster-Leichtathletik-Grand-Prix 2026

**Der 28. Oster-Leichtathletik-Grand-Prix findet am 3. April 2026 (Karfreitag) in Alcácer do Sal statt!** Organisiert von der **Gemeinde Alcácer do Sal**, mit Unterstützung der Junta de Freguesia de Santiago e Santa Maria.

Start und Ziel im **Parque Urbano 25 de Abril**. Strecken entlang der Stadtperipherie und der Uferpromenade.

---

## 🏃 Rennen

- **10 km Lauf** – 10:00 · Junioren bis Veteranen V
- **5 km Lauf** – 10:00 · Jugend M/W
- **Kids Run 1000 m** – 09:00 · U14
- **Kids Run 800 m** – 09:00 · U12
- **Kids Run 300 m** – 09:00 · U10
- **5 km Wanderung** – 10:00 · Offen für alle

---

🏃 **Feiere Ostern laufend in Alcácer do Sal!** 🐣`,
      city: "Alcácer do Sal",
      metaTitle:
        "Oster-Leichtathletik-Grand-Prix 2026 | Alcácer do Sal | 3. April",
      metaDescription:
        "28. Oster-Leichtathletik-Grand-Prix am 3. April 2026 in Alcácer do Sal. 10km und 5km Lauf, Kids Run und 5km Wanderung. Gemeinde Alcácer do Sal.",
    },
    it: {
      title: "XXVIII Gran Premio di Pasqua di Atletica 2026",
      description: `# 🏃 XXVIII Gran Premio di Pasqua di Atletica 2026

**Il 28° Gran Premio di Pasqua di Atletica si svolge il 3 aprile 2026 (Venerdì Santo) ad Alcácer do Sal!** Organizzato dal **Comune di Alcácer do Sal**, con il supporto della Junta de Freguesia de Santiago e Santa Maria.

Partenza e arrivo al **Parque Urbano 25 de Abril**. Percorsi lungo la periferia della città e il lungomare.

---

## 🏃 Gare

- **Corsa 10 km** – 10:00 · Juniores a Veterani V
- **Corsa 5 km** – 10:00 · Cadetti M/F
- **Kids Run 1000 m** – 09:00 · Under-14
- **Kids Run 800 m** – 09:00 · Under-12
- **Kids Run 300 m** – 09:00 · Under-10
- **Camminata 5 km** – 10:00 · Aperta a tutti

---

🏃 **Vieni a festeggiare la Pasqua correndo ad Alcácer do Sal!** 🐣`,
      city: "Alcácer do Sal",
      metaTitle: "Gran Premio Pasqua Atletica 2026 | Alcácer do Sal | 3 Aprile",
      metaDescription:
        "28° Gran Premio di Pasqua di Atletica il 3 aprile 2026 ad Alcácer do Sal. Corsa 10km e 5km, Kids Run e Camminata 5km. Comune di Alcácer do Sal.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: { eventId: event.id, language: Language[lang] },
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
        language: Language[lang],
        title: translations[lang].title,
        description: translations[lang].description,
        city: translations[lang].city,
        metaTitle: translations[lang].metaTitle,
        metaDescription: translations[lang].metaDescription,
      },
    });
    console.log(`✅ Translation [${lang}] upserted`);
  }

  // ──────────────────────────────────────────────
  // 3. Variants (findOrCreate helper)
  // ──────────────────────────────────────────────
  const findOrCreateVariant = async (variantData: {
    name: string;
    distanceKm: number;
    elevationGainM: number | null;
    elevationLossM: number | null;
    startDate: Date;
    startTime: string;
    cutoffTimeHours: number | null;
    price: number;
    currency: Currency;
    maxParticipants: number | null;
    atrpGrade: number | null;
    itraPoints: number | null;
    description: string;
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

  // ── Variant 1: Corrida 10km ──
  const corrida10 = await findOrCreateVariant({
    name: "Corrida 10km",
    distanceKm: 10,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-03T10:00:00Z"),
    startTime: "10:00",
    cutoffTimeHours: null,
    price: 5.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Corrida 10 km · Parque Urbano 25 de Abril · Juniores a Veteranos V",
  });
  console.log(`✅ Variant: ${corrida10.name}`);

  // ── Variant 2: Corrida 5km ──
  const corrida5 = await findOrCreateVariant({
    name: "Corrida 5km",
    distanceKm: 5,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-03T10:00:00Z"),
    startTime: "10:00",
    cutoffTimeHours: null,
    price: 5.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Corrida 5 km · Parque Urbano 25 de Abril · Juvenis M/F",
  });
  console.log(`✅ Variant: ${corrida5.name}`);

  // ── Variant 3: Kids Run 1000m ──
  const kids1000 = await findOrCreateVariant({
    name: "Kids Run 1000m",
    distanceKm: 1,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-03T09:00:00Z"),
    startTime: "09:00",
    cutoffTimeHours: null,
    price: 4.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Kids Run 1000 m · Parque Urbano 25 de Abril · Iniciados M/F",
  });
  console.log(`✅ Variant: ${kids1000.name}`);

  // ── Variant 4: Kids Run 800m ──
  const kids800 = await findOrCreateVariant({
    name: "Kids Run 800m",
    distanceKm: 0.8,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-03T09:00:00Z"),
    startTime: "09:00",
    cutoffTimeHours: null,
    price: 4.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Kids Run 800 m · Parque Urbano 25 de Abril · Infantis M/F",
  });
  console.log(`✅ Variant: ${kids800.name}`);

  // ── Variant 5: Kids Run 300m ──
  const kids300 = await findOrCreateVariant({
    name: "Kids Run 300m",
    distanceKm: 0.3,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-03T09:00:00Z"),
    startTime: "09:00",
    cutoffTimeHours: null,
    price: 4.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Kids Run 300 m · Parque Urbano 25 de Abril · Benjamins A e B M/F",
  });
  console.log(`✅ Variant: ${kids300.name}`);

  // ── Variant 6: Caminhada 5km ──
  const caminhada = await findOrCreateVariant({
    name: "Caminhada 5km",
    distanceKm: 5,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-03T10:00:00Z"),
    startTime: "10:00",
    cutoffTimeHours: null,
    price: 4.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Caminhada 5 km · Parque Urbano 25 de Abril · Aberta a todos",
  });
  console.log(`✅ Variant: ${caminhada.name}`);

  // ── Variant Translations (ALL 6 languages) ──
  const variantTranslations: Record<
    string,
    Record<string, { name: string; description: string | null }>
  > = {
    corrida10: {
      pt: {
        name: "Corrida 10km",
        description:
          "Corrida 10 km · Parque Urbano 25 de Abril · Juniores a Veteranos V",
      },
      en: {
        name: "10km Race",
        description:
          "10 km Race · Parque Urbano 25 de Abril · Juniors to Veterans V",
      },
      es: {
        name: "Carrera 10km",
        description:
          "Carrera 10 km · Parque Urbano 25 de Abril · Júniors a Veteranos V",
      },
      fr: {
        name: "Course 10km",
        description:
          "Course 10 km · Parque Urbano 25 de Abril · Juniors à Vétérans V",
      },
      de: {
        name: "10km Lauf",
        description:
          "10 km Lauf · Parque Urbano 25 de Abril · Junioren bis Veteranen V",
      },
      it: {
        name: "Corsa 10km",
        description:
          "Corsa 10 km · Parque Urbano 25 de Abril · Juniores a Veterani V",
      },
    },
    corrida5: {
      pt: {
        name: "Corrida 5km",
        description: "Corrida 5 km · Parque Urbano 25 de Abril · Juvenis M/F",
      },
      en: {
        name: "5km Race",
        description: "5 km Race · Parque Urbano 25 de Abril · Youth M/F",
      },
      es: {
        name: "Carrera 5km",
        description: "Carrera 5 km · Parque Urbano 25 de Abril · Juveniles M/F",
      },
      fr: {
        name: "Course 5km",
        description: "Course 5 km · Parque Urbano 25 de Abril · Cadets H/F",
      },
      de: {
        name: "5km Lauf",
        description: "5 km Lauf · Parque Urbano 25 de Abril · Jugend M/W",
      },
      it: {
        name: "Corsa 5km",
        description: "Corsa 5 km · Parque Urbano 25 de Abril · Cadetti M/F",
      },
    },
    kids1000: {
      pt: {
        name: "Kids Run 1000m",
        description:
          "Kids Run 1000 m · Parque Urbano 25 de Abril · Iniciados M/F",
      },
      en: {
        name: "Kids Run 1000m",
        description:
          "Kids Run 1000 m · Parque Urbano 25 de Abril · Under-14 M/F",
      },
      es: {
        name: "Kids Run 1000m",
        description:
          "Kids Run 1000 m · Parque Urbano 25 de Abril · Iniciados M/F",
      },
      fr: {
        name: "Kids Run 1000m",
        description:
          "Kids Run 1000 m · Parque Urbano 25 de Abril · Minimes H/F",
      },
      de: {
        name: "Kids Run 1000m",
        description: "Kids Run 1000 m · Parque Urbano 25 de Abril · U14 M/W",
      },
      it: {
        name: "Kids Run 1000m",
        description:
          "Kids Run 1000 m · Parque Urbano 25 de Abril · Under-14 M/F",
      },
    },
    kids800: {
      pt: {
        name: "Kids Run 800m",
        description:
          "Kids Run 800 m · Parque Urbano 25 de Abril · Infantis M/F",
      },
      en: {
        name: "Kids Run 800m",
        description:
          "Kids Run 800 m · Parque Urbano 25 de Abril · Under-12 M/F",
      },
      es: {
        name: "Kids Run 800m",
        description:
          "Kids Run 800 m · Parque Urbano 25 de Abril · Infantiles M/F",
      },
      fr: {
        name: "Kids Run 800m",
        description:
          "Kids Run 800 m · Parque Urbano 25 de Abril · Benjamins H/F",
      },
      de: {
        name: "Kids Run 800m",
        description: "Kids Run 800 m · Parque Urbano 25 de Abril · U12 M/W",
      },
      it: {
        name: "Kids Run 800m",
        description:
          "Kids Run 800 m · Parque Urbano 25 de Abril · Under-12 M/F",
      },
    },
    kids300: {
      pt: {
        name: "Kids Run 300m",
        description:
          "Kids Run 300 m · Parque Urbano 25 de Abril · Benjamins A e B M/F",
      },
      en: {
        name: "Kids Run 300m",
        description:
          "Kids Run 300 m · Parque Urbano 25 de Abril · Under-10 M/F",
      },
      es: {
        name: "Kids Run 300m",
        description:
          "Kids Run 300 m · Parque Urbano 25 de Abril · Benjamines A y B M/F",
      },
      fr: {
        name: "Kids Run 300m",
        description:
          "Kids Run 300 m · Parque Urbano 25 de Abril · Poussins H/F",
      },
      de: {
        name: "Kids Run 300m",
        description: "Kids Run 300 m · Parque Urbano 25 de Abril · U10 M/W",
      },
      it: {
        name: "Kids Run 300m",
        description:
          "Kids Run 300 m · Parque Urbano 25 de Abril · Under-10 M/F",
      },
    },
    caminhada: {
      pt: {
        name: "Caminhada 5km",
        description:
          "Caminhada 5 km · Parque Urbano 25 de Abril · Aberta a todos",
      },
      en: {
        name: "5km Walk",
        description: "5 km Walk · Parque Urbano 25 de Abril · Open to all",
      },
      es: {
        name: "Caminata 5km",
        description:
          "Caminata 5 km · Parque Urbano 25 de Abril · Abierta a todos",
      },
      fr: {
        name: "Randonnée 5km",
        description:
          "Randonnée 5 km · Parque Urbano 25 de Abril · Ouverte à tous",
      },
      de: {
        name: "5km Wanderung",
        description:
          "5 km Wanderung · Parque Urbano 25 de Abril · Offen für alle",
      },
      it: {
        name: "Camminata 5km",
        description:
          "Camminata 5 km · Parque Urbano 25 de Abril · Aperta a tutti",
      },
    },
  };

  const variantMap = [
    { variant: corrida10, key: "corrida10" },
    { variant: corrida5, key: "corrida5" },
    { variant: kids1000, key: "kids1000" },
    { variant: kids800, key: "kids800" },
    { variant: kids300, key: "kids300" },
    { variant: caminhada, key: "caminhada" },
  ];

  for (const { variant, key } of variantMap) {
    for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
      await prisma.eventVariantTranslation.upsert({
        where: {
          variantId_language: {
            variantId: variant.id,
            language: Language[lang],
          },
        },
        update: {
          name: variantTranslations[key][lang].name,
          description: variantTranslations[key][lang].description,
        },
        create: {
          variantId: variant.id,
          language: Language[lang],
          name: variantTranslations[key][lang].name,
          description: variantTranslations[key][lang].description,
        },
      });
    }
    console.log(`✅ Variant translations upserted: ${variant.name}`);
  }

  // ──────────────────────────────────────────────
  // 4. Pricing Phases (single phase per variant, linked to eventId AND variantId)
  // ──────────────────────────────────────────────
  const findOrCreatePricingPhase = async (
    name: string,
    variantId: string,
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
        data: { ...data, variantId },
      });
    } else {
      return await prisma.pricingPhase.create({
        data: { eventId: event.id, variantId, name, ...data },
      });
    }
  };

  const pricingStart = new Date("2026-01-28T00:00:00Z");
  const pricingDeadline = new Date("2026-03-29T23:59:59Z");

  await findOrCreatePricingPhase("Corrida 10km - Inscrição", corrida10.id, {
    startDate: pricingStart,
    endDate: pricingDeadline,
    price: 5.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Corrida 5km - Inscrição", corrida5.id, {
    startDate: pricingStart,
    endDate: pricingDeadline,
    price: 5.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Kids Run 1000m - Inscrição", kids1000.id, {
    startDate: pricingStart,
    endDate: pricingDeadline,
    price: 4.0,
    currency: Currency.EUR,
    note: "Grátis para crianças até 6 anos (inclusive)",
  });
  await findOrCreatePricingPhase("Kids Run 800m - Inscrição", kids800.id, {
    startDate: pricingStart,
    endDate: pricingDeadline,
    price: 4.0,
    currency: Currency.EUR,
    note: "Grátis para crianças até 6 anos (inclusive)",
  });
  await findOrCreatePricingPhase("Kids Run 300m - Inscrição", kids300.id, {
    startDate: pricingStart,
    endDate: pricingDeadline,
    price: 4.0,
    currency: Currency.EUR,
    note: "Grátis para crianças até 6 anos (inclusive)",
  });
  await findOrCreatePricingPhase("Caminhada 5km - Inscrição", caminhada.id, {
    startDate: pricingStart,
    endDate: pricingDeadline,
    price: 4.0,
    currency: Currency.EUR,
    note: null,
  });
  console.log("✅ Pricing phases created for all variants");

  // ──────────────────────────────────────────────
  // 5. FAQs with translations (ALL 6 languages)
  // ──────────────────────────────────────────────
  const findOrCreateFAQ = async (
    eventId: string,
    order: number,
    question: string,
    answer: string
  ) => {
    const existing = await prisma.eventFAQ.findFirst({
      where: { eventId, order },
    });
    if (existing)
      return await prisma.eventFAQ.update({
        where: { id: existing.id },
        data: { question, answer },
      });
    return await prisma.eventFAQ.create({
      data: { eventId, order, question, answer },
    });
  };

  // ── FAQ 0: Schedule ──
  const faq0 = await findOrCreateFAQ(
    event.id,
    0,
    "Qual é o horário do evento?",
    "09:00 — Kid's Run (300m, 800m, 1000m). 10:00 — Corrida 10km, Corrida 5km e Caminhada 5km. Levantamento de dorsais: até ao dia anterior às 12h no Pavilhão Municipal de Desportos, ou no dia da prova a partir das 08:00 no Parque Urbano 25 de Abril."
  );

  const faq0Translations = {
    pt: {
      question: "Qual é o horário do evento?",
      answer:
        "09:00 — Kid's Run (300m, 800m, 1000m). 10:00 — Corrida 10km, Corrida 5km e Caminhada 5km. Levantamento de dorsais: até ao dia anterior às 12h no Pavilhão Municipal de Desportos, ou no dia da prova a partir das 08:00 no Parque Urbano 25 de Abril.",
    },
    en: {
      question: "What is the event schedule?",
      answer:
        "09:00 — Kid's Run (300m, 800m, 1000m). 10:00 — 10km Race, 5km Race and 5km Walk. Bib pickup: until the day before at 12:00 at the Municipal Sports Pavilion, or on race day from 08:00 at Parque Urbano 25 de Abril.",
    },
    es: {
      question: "¿Cuál es el horario del evento?",
      answer:
        "09:00 — Kid's Run (300m, 800m, 1000m). 10:00 — Carrera 10km, Carrera 5km y Caminata 5km. Recogida de dorsales: hasta el día anterior a las 12h en el Pabellón Municipal de Deportes, o el día de la prueba desde las 08:00 en el Parque Urbano 25 de Abril.",
    },
    fr: {
      question: "Quel est le programme de l'événement ?",
      answer:
        "09h00 — Kid's Run (300m, 800m, 1000m). 10h00 — Course 10km, Course 5km et Randonnée 5km. Retrait des dossards : jusqu'à la veille à 12h au Pavillon Municipal des Sports, ou le jour de la course à partir de 08h00 au Parque Urbano 25 de Abril.",
    },
    de: {
      question: "Wie ist der Zeitplan der Veranstaltung?",
      answer:
        "09:00 — Kid's Run (300m, 800m, 1000m). 10:00 — 10km Lauf, 5km Lauf und 5km Wanderung. Startnummernausgabe: bis zum Vortag um 12:00 Uhr in der Städtischen Sporthalle oder am Veranstaltungstag ab 08:00 Uhr im Parque Urbano 25 de Abril.",
    },
    it: {
      question: "Qual è il programma dell'evento?",
      answer:
        "09:00 — Kid's Run (300m, 800m, 1000m). 10:00 — Corsa 10km, Corsa 5km e Camminata 5km. Ritiro pettorali: fino al giorno prima alle 12:00 al Padiglione Sportivo Municipale, o il giorno della gara dalle 08:00 al Parque Urbano 25 de Abril.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq0.id, language: Language[lang] } },
      update: faq0Translations[lang],
      create: {
        faqId: faq0.id,
        language: Language[lang],
        ...faq0Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 0: Schedule");

  // ── FAQ 1: Prizes ──
  const faq1 = await findOrCreateFAQ(
    event.id,
    1,
    "Quais são os prémios?",
    "Na corrida de 10km e 5km, prémios aos 3 primeiros classificados de cada escalão (M/F). Prémio de classificação geral e classificação por equipas (5 melhores resultados). Na caminhada não existe classificação."
  );

  const faq1Translations = {
    pt: {
      question: "Quais são os prémios?",
      answer:
        "Na corrida de 10km e 5km, prémios aos 3 primeiros classificados de cada escalão (M/F). Prémio de classificação geral e classificação por equipas (5 melhores resultados). Na caminhada não existe classificação.",
    },
    en: {
      question: "What are the prizes?",
      answer:
        "In the 10km and 5km races, prizes for the top 3 in each age group (M/F). Overall classification prize and team classification (top 5 results). No classification in the walk.",
    },
    es: {
      question: "¿Cuáles son los premios?",
      answer:
        "En la carrera de 10km y 5km, premios a los 3 primeros de cada categoría (M/F). Premio de clasificación general y clasificación por equipos (5 mejores resultados). En la caminata no hay clasificación.",
    },
    fr: {
      question: "Quels sont les prix ?",
      answer:
        "Dans les courses de 10km et 5km, prix aux 3 premiers de chaque catégorie (H/F). Prix de classement général et classement par équipes (5 meilleurs résultats). Pas de classement pour la randonnée.",
    },
    de: {
      question: "Welche Preise gibt es?",
      answer:
        "Beim 10km und 5km Lauf, Preise für die Top 3 jeder Altersklasse (M/W). Gesamtklassifikation und Mannschaftswertung (5 beste Ergebnisse). Keine Klassifizierung bei der Wanderung.",
    },
    it: {
      question: "Quali sono i premi?",
      answer:
        "Nella corsa 10km e 5km, premi ai 3 primi di ogni fascia d'età (M/F). Premio di classifica generale e classifica per squadre (5 migliori risultati). Nella camminata non c'è classifica.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq1.id, language: Language[lang] } },
      update: faq1Translations[lang],
      create: {
        faqId: faq1.id,
        language: Language[lang],
        ...faq1Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 1: Prizes");

  // ── FAQ 2: Age groups ──
  const faq2 = await findOrCreateFAQ(
    event.id,
    2,
    "Quais são os escalões?",
    "Benjamins A (2017+), Benjamins B (2015-2016), Infantis (2013-2014), Iniciados (2011-2012), Juvenis (2009-2010), Juniores (2007-2008), Seniores (≤2006), Vet. I (1987-1991), Vet. II (1982-1986), Vet. III (1977-1981), Vet. IV (1972-1976), Vet. V (1967-1971)."
  );

  const faq2Translations = {
    pt: {
      question: "Quais são os escalões?",
      answer:
        "Benjamins A (2017+), Benjamins B (2015-2016), Infantis (2013-2014), Iniciados (2011-2012), Juvenis (2009-2010), Juniores (2007-2008), Seniores (≤2006), Vet. I (1987-1991), Vet. II (1982-1986), Vet. III (1977-1981), Vet. IV (1972-1976), Vet. V (1967-1971).",
    },
    en: {
      question: "What are the age groups?",
      answer:
        "Benjamins A (2017+), Benjamins B (2015-2016), Under-12 (2013-2014), Under-14 (2011-2012), Youth (2009-2010), Juniors (2007-2008), Seniors (≤2006), Vet. I (1987-1991), Vet. II (1982-1986), Vet. III (1977-1981), Vet. IV (1972-1976), Vet. V (1967-1971).",
    },
    es: {
      question: "¿Cuáles son las categorías?",
      answer:
        "Benjamines A (2017+), Benjamines B (2015-2016), Infantiles (2013-2014), Iniciados (2011-2012), Juveniles (2009-2010), Júniors (2007-2008), Séniores (≤2006), Vet. I (1987-1991), Vet. II (1982-1986), Vet. III (1977-1981), Vet. IV (1972-1976), Vet. V (1967-1971).",
    },
    fr: {
      question: "Quelles sont les catégories ?",
      answer:
        "Poussins A (2017+), Poussins B (2015-2016), Benjamins (2013-2014), Minimes (2011-2012), Cadets (2009-2010), Juniors (2007-2008), Seniors (≤2006), Vét. I (1987-1991), Vét. II (1982-1986), Vét. III (1977-1981), Vét. IV (1972-1976), Vét. V (1967-1971).",
    },
    de: {
      question: "Welche Altersklassen gibt es?",
      answer:
        "Benjamins A (2017+), Benjamins B (2015-2016), U12 (2013-2014), U14 (2011-2012), Jugend (2009-2010), Junioren (2007-2008), Senioren (≤2006), Vet. I (1987-1991), Vet. II (1982-1986), Vet. III (1977-1981), Vet. IV (1972-1976), Vet. V (1967-1971).",
    },
    it: {
      question: "Quali sono le fasce d'età?",
      answer:
        "Benjamins A (2017+), Benjamins B (2015-2016), Under-12 (2013-2014), Under-14 (2011-2012), Cadetti (2009-2010), Juniores (2007-2008), Seniores (≤2006), Vet. I (1987-1991), Vet. II (1982-1986), Vet. III (1977-1981), Vet. IV (1972-1976), Vet. V (1967-1971).",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq2.id, language: Language[lang] } },
      update: faq2Translations[lang],
      create: {
        faqId: faq2.id,
        language: Language[lang],
        ...faq2Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 2: Age groups");

  // ── FAQ 3: Registration ──
  const faq3 = await findOrCreateFAQ(
    event.id,
    3,
    "Como posso inscrever-me?",
    "As inscrições são feitas em www.acorrer.pt até 29 de março de 2026 às 23:59. Não se aceitam inscrições no dia da prova. Grátis para crianças até 6 anos (inclusive). Menores de 18 anos devem entregar Termo de Responsabilidade assinado pelos pais/encarregados de educação."
  );

  const faq3Translations = {
    pt: {
      question: "Como posso inscrever-me?",
      answer:
        "As inscrições são feitas em www.acorrer.pt até 29 de março de 2026 às 23:59. Não se aceitam inscrições no dia da prova. Grátis para crianças até 6 anos (inclusive). Menores de 18 anos devem entregar Termo de Responsabilidade assinado pelos pais/encarregados de educação.",
    },
    en: {
      question: "How can I register?",
      answer:
        "Registration via www.acorrer.pt until March 29, 2026 at 23:59. No race-day registrations accepted. Free for children up to 6 years old (inclusive). Participants under 18 must submit a consent form signed by parents/guardians.",
    },
    es: {
      question: "¿Cómo puedo inscribirme?",
      answer:
        "Las inscripciones se realizan en www.acorrer.pt hasta el 29 de marzo de 2026 a las 23:59. No se aceptan inscripciones el día de la prueba. Gratis para niños hasta 6 años (inclusive). Menores de 18 años deben entregar autorización firmada por los padres/tutores.",
    },
    fr: {
      question: "Comment puis-je m'inscrire ?",
      answer:
        "Les inscriptions se font sur www.acorrer.pt jusqu'au 29 mars 2026 à 23h59. Pas d'inscriptions le jour de la course. Gratuit pour les enfants jusqu'à 6 ans (inclus). Les mineurs de 18 ans doivent fournir une autorisation signée par les parents/tuteurs.",
    },
    de: {
      question: "Wie kann ich mich anmelden?",
      answer:
        "Anmeldung über www.acorrer.pt bis 29. März 2026 um 23:59. Keine Anmeldung am Veranstaltungstag. Kostenlos für Kinder bis 6 Jahre (einschließlich). Teilnehmer unter 18 Jahren müssen eine von den Eltern/Erziehungsberechtigten unterschriebene Einverständniserklärung vorlegen.",
    },
    it: {
      question: "Come posso iscrivermi?",
      answer:
        "Le iscrizioni si effettuano su www.acorrer.pt fino al 29 marzo 2026 alle 23:59. Non si accettano iscrizioni il giorno della gara. Gratuito per bambini fino a 6 anni (inclusi). I minori di 18 anni devono consegnare un modulo di consenso firmato dai genitori/tutori.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq3.id, language: Language[lang] } },
      update: faq3Translations[lang],
      create: {
        faqId: faq3.id,
        language: Language[lang],
        ...faq3Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 3: Registration");

  // ── FAQ 4: What's included ──
  const faq4 = await findOrCreateFAQ(
    event.id,
    4,
    "O que está incluído na inscrição?",
    "Seguro de acidentes pessoais, abastecimento de água durante a prova e lanche volante individual no final. Os atletas devem trazer BI/CC e NIF."
  );

  const faq4Translations = {
    pt: {
      question: "O que está incluído na inscrição?",
      answer:
        "Seguro de acidentes pessoais, abastecimento de água durante a prova e lanche volante individual no final. Os atletas devem trazer BI/CC e NIF.",
    },
    en: {
      question: "What is included in the registration?",
      answer:
        "Personal accident insurance, water aid stations during the race and an individual snack at the finish. Athletes must bring their ID card and tax number.",
    },
    es: {
      question: "¿Qué incluye la inscripción?",
      answer:
        "Seguro de accidentes personales, avituallamiento de agua durante la prueba y un refrigerio individual al final. Los atletas deben traer su documento de identidad y NIF.",
    },
    fr: {
      question: "Que comprend l'inscription ?",
      answer:
        "Assurance accidents personnels, ravitaillement en eau pendant la course et collation individuelle à l'arrivée. Les athlètes doivent apporter leur carte d'identité et NIF.",
    },
    de: {
      question: "Was ist in der Anmeldung enthalten?",
      answer:
        "Unfallversicherung, Wasserversorgung während des Rennens und ein individueller Snack im Ziel. Die Athleten müssen ihren Personalausweis und ihre Steuernummer mitbringen.",
    },
    it: {
      question: "Cosa è incluso nell'iscrizione?",
      answer:
        "Assicurazione infortuni, rifornimento d'acqua durante la gara e spuntino individuale al traguardo. Gli atleti devono portare documento d'identità e codice fiscale.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq4.id, language: Language[lang] } },
      update: faq4Translations[lang],
      create: {
        faqId: faq4.id,
        language: Language[lang],
        ...faq4Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 4: What's included");

  // ── FAQ 5: Contacts ──
  const faq5 = await findOrCreateFAQ(
    event.id,
    5,
    "Quais são os contactos da organização?",
    "Município de Alcácer do Sal — Setor de Desporto. Telefone: 265 613 538. Telemóvel: 913 602 387. E-mail: desporto@m-alcacerdosal.pt."
  );

  const faq5Translations = {
    pt: {
      question: "Quais são os contactos da organização?",
      answer:
        "Município de Alcácer do Sal — Setor de Desporto. Telefone: 265 613 538. Telemóvel: 913 602 387. E-mail: desporto@m-alcacerdosal.pt.",
    },
    en: {
      question: "What are the organization's contacts?",
      answer:
        "Municipality of Alcácer do Sal — Sports Department. Phone: +351 265 613 538. Mobile: +351 913 602 387. Email: desporto@m-alcacerdosal.pt.",
    },
    es: {
      question: "¿Cuáles son los contactos de la organización?",
      answer:
        "Municipio de Alcácer do Sal — Sector de Deportes. Teléfono: 265 613 538. Móvil: 913 602 387. E-mail: desporto@m-alcacerdosal.pt.",
    },
    fr: {
      question: "Quels sont les contacts de l'organisation ?",
      answer:
        "Municipalité d'Alcácer do Sal — Secteur Sports. Tél : 265 613 538. Portable : 913 602 387. E-mail : desporto@m-alcacerdosal.pt.",
    },
    de: {
      question: "Was sind die Kontaktdaten der Organisation?",
      answer:
        "Gemeinde Alcácer do Sal — Sportabteilung. Telefon: 265 613 538. Mobil: 913 602 387. E-Mail: desporto@m-alcacerdosal.pt.",
    },
    it: {
      question: "Quali sono i contatti dell'organizzazione?",
      answer:
        "Comune di Alcácer do Sal — Settore Sport. Telefono: 265 613 538. Cellulare: 913 602 387. E-mail: desporto@m-alcacerdosal.pt.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq5.id, language: Language[lang] } },
      update: faq5Translations[lang],
      create: {
        faqId: faq5.id,
        language: Language[lang],
        ...faq5Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 5: Contacts");

  // ──────────────────────────────────────────────
  // Done
  // ──────────────────────────────────────────────
  console.log(`
🏃 XXVIII Grande Prémio da Páscoa em Atletismo 2026 seed completed!
──────────────────────────────────────────────
- Slug: grande-premio-pascoa-atletismo-2026
- Date: April 3, 2026 (Good Friday)
- Location: Parque Urbano 25 de Abril, Alcácer do Sal
- Variants: Corrida 10km (5€), Corrida 5km (5€), Kids Run 1000m (4€), Kids Run 800m (4€), Kids Run 300m (4€), Caminhada 5km (4€)
- Pricing: 1 phase × 6 variants = 6 pricing phases
- FAQs: 6 with translations in 6 languages
- Organizer: Município de Alcácer do Sal
  `);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
