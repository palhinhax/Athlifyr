/**
 * Seed: 44º Circuito de Atletismo "Vila de Odemira" 2026
 *
 * Event: Athletics circuit + walk in Odemira, Beja
 * Location: Jardim da Fonte Férrea, Odemira
 * Date: April 3, 2026 (Good Friday)
 * Organizer: Núcleo Desportivo e Cultural de Odemira (50th anniversary)
 * Sport: Running, Walking
 * Association: Associação de Atletismo de Beja
 * Registration: www.acorrer.pt
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log('🏃 Seeding 44º Circuito de Atletismo "Vila de Odemira" 2026...');

  // ──────────────────────────────────────────────
  // 1. Upsert Event
  // ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: "circuito-atletismo-odemira-2026" },
    update: {
      title: '44º Circuito de Atletismo "Vila de Odemira" 2026',
      description:
        '44º Circuito de Atletismo "Vila de Odemira" e 18ª Caminhada da Saúde - Odemira 2026',
      sportTypes: [SportType.RUNNING, SportType.WALKING],
      startDate: new Date("2026-04-03T09:30:00Z"),
      endDate: new Date("2026-04-03T13:00:00Z"),
      registrationDeadline: new Date("2026-03-25T23:59:00Z"),
      externalUrl: "https://www.acorrer.pt/",
      imageUrl: "",
      city: "Odemira",
      country: "Portugal",
      latitude: 37.5976,
      longitude: -8.6398,
      googleMapsUrl: "https://maps.google.com/?q=37.5976,-8.6398",
      isFeatured: false,
      cancelled: false,
    },
    create: {
      title: '44º Circuito de Atletismo "Vila de Odemira" 2026',
      slug: "circuito-atletismo-odemira-2026",
      description:
        '44º Circuito de Atletismo "Vila de Odemira" e 18ª Caminhada da Saúde - Odemira 2026',
      sportTypes: [SportType.RUNNING, SportType.WALKING],
      startDate: new Date("2026-04-03T09:30:00Z"),
      endDate: new Date("2026-04-03T13:00:00Z"),
      registrationDeadline: new Date("2026-03-25T23:59:00Z"),
      externalUrl: "https://www.acorrer.pt/",
      imageUrl: "",
      city: "Odemira",
      country: "Portugal",
      latitude: 37.5976,
      longitude: -8.6398,
      googleMapsUrl: "https://maps.google.com/?q=37.5976,-8.6398",
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
      title: '44º Circuito de Atletismo "Vila de Odemira" 2026',
      description: `# 🏃 44º Circuito de Atletismo "Vila de Odemira" 2026

**O 44.º Circuito de Atletismo "Vila de Odemira" e a 18.ª Caminhada da Saúde realizam-se a 3 de abril de 2026 (Sexta-Feira Santa) em Odemira!** Organizado pelo **Núcleo Desportivo e Cultural de Odemira** no seu **50.º aniversário**, com o apoio do **Município de Odemira** e da **Associação de Atletismo de Beja**.

Partida e chegada no **Jardim da Fonte Férrea**. Percursos pela periferia da cidade e marginal de Odemira.

---

## 🏃 Provas

- **Corrida 8 km** – 09:45 · Sub20+Seniores e Masters M/F
- **Caminhada 5 km** – 09:30 · 18.ª Caminhada da Saúde · Aberta a todos
- **Kids 3.2 km** – 11:50 · Juvenis (Sub 18) · Grátis
- **Kids 2.4 km** – 11:35 · Iniciados (Sub 16) · Grátis
- **Kids 1.6 km** – 11:20 · Infantis (Sub 14) · Grátis
- **Kids 800 m** – 11:10 · Benjamins B (Sub 12) · Grátis
- **Kids 500 m** – 11:00 · Benjamins A (Sub 10) · Grátis
- **Kids 150 m** – 10:45 · Bâmbis · Grátis

---

🏃 **Vem celebrar a Páscoa e o atletismo em Odemira!** 🐣`,
      city: "Odemira",
      metaTitle:
        'Circuito Atletismo "Vila de Odemira" 2026 | Odemira | 3 Abril',
      metaDescription:
        '44.º Circuito de Atletismo "Vila de Odemira" a 3 de abril de 2026. Corrida 8km, Caminhada 5km e provas Kids. Núcleo Desportivo e Cultural de Odemira.',
    },
    en: {
      title: '44th Athletics Circuit "Vila de Odemira" 2026',
      description: `# 🏃 44th Athletics Circuit "Vila de Odemira" 2026

**The 44th Athletics Circuit "Vila de Odemira" and the 18th Health Walk take place on April 3, 2026 (Good Friday) in Odemira!** Organized by the **Núcleo Desportivo e Cultural de Odemira** on its **50th anniversary**, with support from the **Municipality of Odemira** and the **Beja Athletics Association**.

Start and finish at **Jardim da Fonte Férrea**. Courses through the city outskirts and Odemira waterfront.

---

## 🏃 Races

- **8 km Race** – 09:45 · Sub20+Seniors and Masters M/F
- **5 km Walk** – 09:30 · 18th Health Walk · Open to all
- **Kids 3.2 km** – 11:50 · Youth (U18) · Free
- **Kids 2.4 km** – 11:35 · Under-16 · Free
- **Kids 1.6 km** – 11:20 · Under-14 · Free
- **Kids 800 m** – 11:10 · Under-12 · Free
- **Kids 500 m** – 11:00 · Under-10 · Free
- **Kids 150 m** – 10:45 · Bambis · Free

---

🏃 **Come celebrate Easter and athletics in Odemira!** 🐣`,
      city: "Odemira",
      metaTitle: 'Athletics Circuit "Vila de Odemira" 2026 | Odemira | April 3',
      metaDescription:
        '44th Athletics Circuit "Vila de Odemira" on April 3, 2026. 8km Race, 5km Walk and Kids races. Núcleo Desportivo e Cultural de Odemira.',
    },
    es: {
      title: '44º Circuito de Atletismo "Vila de Odemira" 2026',
      description: `# 🏃 44º Circuito de Atletismo "Vila de Odemira" 2026

**El 44.º Circuito de Atletismo "Vila de Odemira" y la 18.ª Caminata de la Salud se celebran el 3 de abril de 2026 (Viernes Santo) en Odemira.** Organizado por el **Núcleo Desportivo e Cultural de Odemira** en su **50.º aniversario**, con el apoyo del **Municipio de Odemira** y la **Asociación de Atletismo de Beja**.

Salida y llegada en el **Jardim da Fonte Férrea**. Recorridos por la periferia de la ciudad y el paseo marítimo de Odemira.

---

## 🏃 Pruebas

- **Carrera 8 km** – 09:45 · Sub20+Séniores y Masters M/F
- **Caminata 5 km** – 09:30 · 18.ª Caminata de la Salud · Abierta a todos
- **Kids 3.2 km** – 11:50 · Juveniles (Sub 18) · Gratis
- **Kids 2.4 km** – 11:35 · Iniciados (Sub 16) · Gratis
- **Kids 1.6 km** – 11:20 · Infantiles (Sub 14) · Gratis
- **Kids 800 m** – 11:10 · Benjamines B (Sub 12) · Gratis
- **Kids 500 m** – 11:00 · Benjamines A (Sub 10) · Gratis
- **Kids 150 m** – 10:45 · Bâmbis · Gratis

---

🏃 **¡Ven a celebrar la Pascua y el atletismo en Odemira!** 🐣`,
      city: "Odemira",
      metaTitle:
        'Circuito Atletismo "Vila de Odemira" 2026 | Odemira | 3 Abril',
      metaDescription:
        '44.º Circuito de Atletismo "Vila de Odemira" el 3 de abril de 2026. Carrera 8km, Caminata 5km y pruebas Kids. Núcleo Desportivo e Cultural de Odemira.',
    },
    fr: {
      title: '44e Circuit d\'Athlétisme "Vila de Odemira" 2026',
      description: `# 🏃 44e Circuit d'Athlétisme "Vila de Odemira" 2026

**Le 44e Circuit d'Athlétisme "Vila de Odemira" et la 18e Marche de la Santé ont lieu le 3 avril 2026 (Vendredi Saint) à Odemira !** Organisé par le **Núcleo Desportivo e Cultural de Odemira** pour son **50e anniversaire**, avec le soutien de la **Municipalité d'Odemira** et de l'**Association d'Athlétisme de Beja**.

Départ et arrivée au **Jardim da Fonte Férrea**. Parcours dans la périphérie de la ville et le front de mer d'Odemira.

---

## 🏃 Épreuves

- **Course 8 km** – 09h45 · Sub20+Seniors et Masters H/F
- **Randonnée 5 km** – 09h30 · 18e Marche de la Santé · Ouverte à tous
- **Kids 3.2 km** – 11h50 · Cadets (U18) · Gratuit
- **Kids 2.4 km** – 11h35 · Minimes (U16) · Gratuit
- **Kids 1.6 km** – 11h20 · Benjamins (U14) · Gratuit
- **Kids 800 m** – 11h10 · Poussins B (U12) · Gratuit
- **Kids 500 m** – 11h00 · Poussins A (U10) · Gratuit
- **Kids 150 m** – 10h45 · Bambis · Gratuit

---

🏃 **Venez fêter Pâques et l'athlétisme à Odemira !** 🐣`,
      city: "Odemira",
      metaTitle:
        'Circuit Athlétisme "Vila de Odemira" 2026 | Odemira | 3 Avril',
      metaDescription:
        '44e Circuit d\'Athlétisme "Vila de Odemira" le 3 avril 2026. Course 8km, Randonnée 5km et courses Kids. Núcleo Desportivo e Cultural de Odemira.',
    },
    de: {
      title: '44. Leichtathletik-Rundkurs "Vila de Odemira" 2026',
      description: `# 🏃 44. Leichtathletik-Rundkurs "Vila de Odemira" 2026

**Der 44. Leichtathletik-Rundkurs "Vila de Odemira" und die 18. Gesundheitswanderung finden am 3. April 2026 (Karfreitag) in Odemira statt!** Organisiert vom **Núcleo Desportivo e Cultural de Odemira** zu seinem **50. Jubiläum**, mit Unterstützung der **Gemeinde Odemira** und des **Leichtathletikverbands von Beja**.

Start und Ziel am **Jardim da Fonte Férrea**. Strecken durch die Stadtperipherie und die Uferpromenade von Odemira.

---

## 🏃 Rennen

- **8 km Lauf** – 09:45 · Sub20+Senioren und Masters M/W
- **5 km Wanderung** – 09:30 · 18. Gesundheitswanderung · Offen für alle
- **Kids 3.2 km** – 11:50 · Jugend (U18) · Kostenlos
- **Kids 2.4 km** – 11:35 · U16 · Kostenlos
- **Kids 1.6 km** – 11:20 · U14 · Kostenlos
- **Kids 800 m** – 11:10 · U12 · Kostenlos
- **Kids 500 m** – 11:00 · U10 · Kostenlos
- **Kids 150 m** – 10:45 · Bambis · Kostenlos

---

🏃 **Feiere Ostern und Leichtathletik in Odemira!** 🐣`,
      city: "Odemira",
      metaTitle:
        'Leichtathletik-Rundkurs "Vila de Odemira" 2026 | Odemira | 3. April',
      metaDescription:
        '44. Leichtathletik-Rundkurs "Vila de Odemira" am 3. April 2026. 8km Lauf, 5km Wanderung und Kids-Rennen. Núcleo Desportivo e Cultural de Odemira.',
    },
    it: {
      title: '44º Circuito di Atletica "Vila de Odemira" 2026',
      description: `# 🏃 44º Circuito di Atletica "Vila de Odemira" 2026

**Il 44° Circuito di Atletica "Vila de Odemira" e la 18ª Camminata della Salute si svolgono il 3 aprile 2026 (Venerdì Santo) a Odemira!** Organizzato dal **Núcleo Desportivo e Cultural de Odemira** per il suo **50° anniversario**, con il supporto del **Comune di Odemira** e dell'**Associazione di Atletica di Beja**.

Partenza e arrivo al **Jardim da Fonte Férrea**. Percorsi attraverso la periferia della città e il lungomare di Odemira.

---

## 🏃 Gare

- **Corsa 8 km** – 09:45 · Sub20+Seniores e Masters M/F
- **Camminata 5 km** – 09:30 · 18ª Camminata della Salute · Aperta a tutti
- **Kids 3.2 km** – 11:50 · Cadetti (U18) · Gratuito
- **Kids 2.4 km** – 11:35 · Under-16 · Gratuito
- **Kids 1.6 km** – 11:20 · Under-14 · Gratuito
- **Kids 800 m** – 11:10 · Under-12 · Gratuito
- **Kids 500 m** – 11:00 · Under-10 · Gratuito
- **Kids 150 m** – 10:45 · Bâmbis · Gratuito

---

🏃 **Vieni a festeggiare la Pasqua e l'atletica a Odemira!** 🐣`,
      city: "Odemira",
      metaTitle:
        'Circuito Atletica "Vila de Odemira" 2026 | Odemira | 3 Aprile',
      metaDescription:
        '44° Circuito di Atletica "Vila de Odemira" il 3 aprile 2026. Corsa 8km, Camminata 5km e gare Kids. Núcleo Desportivo e Cultural de Odemira.',
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

  // ── Variant 1: Corrida 8km ──
  const corrida8 = await findOrCreateVariant({
    name: "Corrida 8km",
    distanceKm: 8,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-03T09:45:00Z"),
    startTime: "09:45",
    cutoffTimeHours: null,
    price: 8.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Corrida 8 km · Jardim da Fonte Férrea · Sub20+Seniores e Masters M/F",
  });
  console.log(`✅ Variant: ${corrida8.name}`);

  // ── Variant 2: Caminhada 5km ──
  const caminhada = await findOrCreateVariant({
    name: "Caminhada 5km",
    distanceKm: 5,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-03T09:30:00Z"),
    startTime: "09:30",
    cutoffTimeHours: null,
    price: 8.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "18.ª Caminhada da Saúde · 5 km · Partida da Fonte Férrea · Aberta a todos",
  });
  console.log(`✅ Variant: ${caminhada.name}`);

  // ── Variant 3: Kids 3.2km (Juvenis Sub 18) ──
  const kids3200 = await findOrCreateVariant({
    name: "Kids 3.2km",
    distanceKm: 3.2,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-03T11:50:00Z"),
    startTime: "11:50",
    cutoffTimeHours: null,
    price: 0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Kids 3.2 km · Juvenis Sub 18 M/F (2009/2010) · Grátis",
  });
  console.log(`✅ Variant: ${kids3200.name}`);

  // ── Variant 4: Kids 2.4km (Iniciados Sub 16) ──
  const kids2400 = await findOrCreateVariant({
    name: "Kids 2.4km",
    distanceKm: 2.4,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-03T11:35:00Z"),
    startTime: "11:35",
    cutoffTimeHours: null,
    price: 0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Kids 2.4 km · Iniciados Sub 16 M/F (2011/2012) · Grátis",
  });
  console.log(`✅ Variant: ${kids2400.name}`);

  // ── Variant 5: Kids 1.6km (Infantis Sub 14) ──
  const kids1600 = await findOrCreateVariant({
    name: "Kids 1.6km",
    distanceKm: 1.6,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-03T11:20:00Z"),
    startTime: "11:20",
    cutoffTimeHours: null,
    price: 0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Kids 1.6 km · Infantis Sub 14 M/F (2013/2014) · Grátis",
  });
  console.log(`✅ Variant: ${kids1600.name}`);

  // ── Variant 6: Kids 800m (Benjamins B Sub 12) ──
  const kids800 = await findOrCreateVariant({
    name: "Kids 800m",
    distanceKm: 0.8,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-03T11:10:00Z"),
    startTime: "11:10",
    cutoffTimeHours: null,
    price: 0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Kids 800 m · Benjamins B Sub 12 M/F (2015/2016) · Grátis",
  });
  console.log(`✅ Variant: ${kids800.name}`);

  // ── Variant 7: Kids 500m (Benjamins A Sub 10) ──
  const kids500 = await findOrCreateVariant({
    name: "Kids 500m",
    distanceKm: 0.5,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-03T11:00:00Z"),
    startTime: "11:00",
    cutoffTimeHours: null,
    price: 0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Kids 500 m · Benjamins A Sub 10 M/F (2017-2020) · Grátis",
  });
  console.log(`✅ Variant: ${kids500.name}`);

  // ── Variant 8: Kids 150m (Bâmbis) ──
  const kids150 = await findOrCreateVariant({
    name: "Kids 150m",
    distanceKm: 0.15,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-03T10:45:00Z"),
    startTime: "10:45",
    cutoffTimeHours: null,
    price: 0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Kids 150 m · Bâmbis M/F (2021) · Reta da meta · Grátis",
  });
  console.log(`✅ Variant: ${kids150.name}`);

  // ── Variant Translations (ALL 6 languages) ──
  const variantTranslations: Record<
    string,
    Record<string, { name: string; description: string | null }>
  > = {
    corrida8: {
      pt: {
        name: "Corrida 8km",
        description:
          "Corrida 8 km · Jardim da Fonte Férrea · Sub20+Seniores e Masters M/F",
      },
      en: {
        name: "8km Race",
        description:
          "8 km Race · Jardim da Fonte Férrea · Sub20+Seniors and Masters M/F",
      },
      es: {
        name: "Carrera 8km",
        description:
          "Carrera 8 km · Jardim da Fonte Férrea · Sub20+Séniores y Masters M/F",
      },
      fr: {
        name: "Course 8km",
        description:
          "Course 8 km · Jardim da Fonte Férrea · Sub20+Seniors et Masters H/F",
      },
      de: {
        name: "8km Lauf",
        description:
          "8 km Lauf · Jardim da Fonte Férrea · Sub20+Senioren und Masters M/W",
      },
      it: {
        name: "Corsa 8km",
        description:
          "Corsa 8 km · Jardim da Fonte Férrea · Sub20+Seniores e Masters M/F",
      },
    },
    caminhada: {
      pt: {
        name: "Caminhada 5km",
        description:
          "18.ª Caminhada da Saúde · 5 km · Partida da Fonte Férrea · Aberta a todos",
      },
      en: {
        name: "5km Walk",
        description:
          "18th Health Walk · 5 km · Start at Fonte Férrea · Open to all",
      },
      es: {
        name: "Caminata 5km",
        description:
          "18.ª Caminata de la Salud · 5 km · Salida de Fonte Férrea · Abierta a todos",
      },
      fr: {
        name: "Randonnée 5km",
        description:
          "18e Marche de la Santé · 5 km · Départ de Fonte Férrea · Ouverte à tous",
      },
      de: {
        name: "5km Wanderung",
        description:
          "18. Gesundheitswanderung · 5 km · Start an der Fonte Férrea · Offen für alle",
      },
      it: {
        name: "Camminata 5km",
        description:
          "18ª Camminata della Salute · 5 km · Partenza da Fonte Férrea · Aperta a tutti",
      },
    },
    kids3200: {
      pt: {
        name: "Kids 3.2km",
        description: "Kids 3.2 km · Juvenis Sub 18 M/F (2009/2010) · Grátis",
      },
      en: {
        name: "Kids 3.2km",
        description: "Kids 3.2 km · Youth U18 M/F (2009/2010) · Free",
      },
      es: {
        name: "Kids 3.2km",
        description: "Kids 3.2 km · Juveniles Sub 18 M/F (2009/2010) · Gratis",
      },
      fr: {
        name: "Kids 3.2km",
        description: "Kids 3.2 km · Cadets U18 H/F (2009/2010) · Gratuit",
      },
      de: {
        name: "Kids 3.2km",
        description: "Kids 3.2 km · Jugend U18 M/W (2009/2010) · Kostenlos",
      },
      it: {
        name: "Kids 3.2km",
        description: "Kids 3.2 km · Cadetti U18 M/F (2009/2010) · Gratuito",
      },
    },
    kids2400: {
      pt: {
        name: "Kids 2.4km",
        description: "Kids 2.4 km · Iniciados Sub 16 M/F (2011/2012) · Grátis",
      },
      en: {
        name: "Kids 2.4km",
        description: "Kids 2.4 km · Under-16 M/F (2011/2012) · Free",
      },
      es: {
        name: "Kids 2.4km",
        description: "Kids 2.4 km · Iniciados Sub 16 M/F (2011/2012) · Gratis",
      },
      fr: {
        name: "Kids 2.4km",
        description: "Kids 2.4 km · Minimes U16 H/F (2011/2012) · Gratuit",
      },
      de: {
        name: "Kids 2.4km",
        description: "Kids 2.4 km · U16 M/W (2011/2012) · Kostenlos",
      },
      it: {
        name: "Kids 2.4km",
        description: "Kids 2.4 km · Under-16 M/F (2011/2012) · Gratuito",
      },
    },
    kids1600: {
      pt: {
        name: "Kids 1.6km",
        description: "Kids 1.6 km · Infantis Sub 14 M/F (2013/2014) · Grátis",
      },
      en: {
        name: "Kids 1.6km",
        description: "Kids 1.6 km · Under-14 M/F (2013/2014) · Free",
      },
      es: {
        name: "Kids 1.6km",
        description: "Kids 1.6 km · Infantiles Sub 14 M/F (2013/2014) · Gratis",
      },
      fr: {
        name: "Kids 1.6km",
        description: "Kids 1.6 km · Benjamins U14 H/F (2013/2014) · Gratuit",
      },
      de: {
        name: "Kids 1.6km",
        description: "Kids 1.6 km · U14 M/W (2013/2014) · Kostenlos",
      },
      it: {
        name: "Kids 1.6km",
        description: "Kids 1.6 km · Under-14 M/F (2013/2014) · Gratuito",
      },
    },
    kids800: {
      pt: {
        name: "Kids 800m",
        description: "Kids 800 m · Benjamins B Sub 12 M/F (2015/2016) · Grátis",
      },
      en: {
        name: "Kids 800m",
        description: "Kids 800 m · Under-12 M/F (2015/2016) · Free",
      },
      es: {
        name: "Kids 800m",
        description:
          "Kids 800 m · Benjamines B Sub 12 M/F (2015/2016) · Gratis",
      },
      fr: {
        name: "Kids 800m",
        description: "Kids 800 m · Poussins B U12 H/F (2015/2016) · Gratuit",
      },
      de: {
        name: "Kids 800m",
        description: "Kids 800 m · U12 M/W (2015/2016) · Kostenlos",
      },
      it: {
        name: "Kids 800m",
        description: "Kids 800 m · Under-12 M/F (2015/2016) · Gratuito",
      },
    },
    kids500: {
      pt: {
        name: "Kids 500m",
        description: "Kids 500 m · Benjamins A Sub 10 M/F (2017-2020) · Grátis",
      },
      en: {
        name: "Kids 500m",
        description: "Kids 500 m · Under-10 M/F (2017-2020) · Free",
      },
      es: {
        name: "Kids 500m",
        description:
          "Kids 500 m · Benjamines A Sub 10 M/F (2017-2020) · Gratis",
      },
      fr: {
        name: "Kids 500m",
        description: "Kids 500 m · Poussins A U10 H/F (2017-2020) · Gratuit",
      },
      de: {
        name: "Kids 500m",
        description: "Kids 500 m · U10 M/W (2017-2020) · Kostenlos",
      },
      it: {
        name: "Kids 500m",
        description: "Kids 500 m · Under-10 M/F (2017-2020) · Gratuito",
      },
    },
    kids150: {
      pt: {
        name: "Kids 150m",
        description: "Kids 150 m · Bâmbis M/F (2021) · Reta da meta · Grátis",
      },
      en: {
        name: "Kids 150m",
        description: "Kids 150 m · Bambis M/F (2021) · Finish straight · Free",
      },
      es: {
        name: "Kids 150m",
        description: "Kids 150 m · Bâmbis M/F (2021) · Recta de meta · Gratis",
      },
      fr: {
        name: "Kids 150m",
        description:
          "Kids 150 m · Bambis H/F (2021) · Ligne droite d'arrivée · Gratuit",
      },
      de: {
        name: "Kids 150m",
        description: "Kids 150 m · Bambis M/W (2021) · Zielgerade · Kostenlos",
      },
      it: {
        name: "Kids 150m",
        description:
          "Kids 150 m · Bâmbis M/F (2021) · Rettilineo d'arrivo · Gratuito",
      },
    },
  };

  const variantMap = [
    { variant: corrida8, key: "corrida8" },
    { variant: caminhada, key: "caminhada" },
    { variant: kids3200, key: "kids3200" },
    { variant: kids2400, key: "kids2400" },
    { variant: kids1600, key: "kids1600" },
    { variant: kids800, key: "kids800" },
    { variant: kids500, key: "kids500" },
    { variant: kids150, key: "kids150" },
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
  // 4. Pricing Phases (linked to eventId AND variantId)
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
  const pricingDeadline = new Date("2026-03-25T23:59:59Z");

  await findOrCreatePricingPhase("Corrida 8km - Inscrição", corrida8.id, {
    startDate: pricingStart,
    endDate: pricingDeadline,
    price: 8.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Caminhada 5km - Inscrição", caminhada.id, {
    startDate: pricingStart,
    endDate: pricingDeadline,
    price: 8.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Kids 3.2km - Inscrição", kids3200.id, {
    startDate: pricingStart,
    endDate: pricingDeadline,
    price: 0,
    currency: Currency.EUR,
    note: "Grátis",
  });
  await findOrCreatePricingPhase("Kids 2.4km - Inscrição", kids2400.id, {
    startDate: pricingStart,
    endDate: pricingDeadline,
    price: 0,
    currency: Currency.EUR,
    note: "Grátis",
  });
  await findOrCreatePricingPhase("Kids 1.6km - Inscrição", kids1600.id, {
    startDate: pricingStart,
    endDate: pricingDeadline,
    price: 0,
    currency: Currency.EUR,
    note: "Grátis",
  });
  await findOrCreatePricingPhase("Kids 800m - Inscrição", kids800.id, {
    startDate: pricingStart,
    endDate: pricingDeadline,
    price: 0,
    currency: Currency.EUR,
    note: "Grátis",
  });
  await findOrCreatePricingPhase("Kids 500m - Inscrição", kids500.id, {
    startDate: pricingStart,
    endDate: pricingDeadline,
    price: 0,
    currency: Currency.EUR,
    note: "Grátis",
  });
  await findOrCreatePricingPhase("Kids 150m - Inscrição", kids150.id, {
    startDate: pricingStart,
    endDate: pricingDeadline,
    price: 0,
    currency: Currency.EUR,
    note: "Grátis",
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
    "09:30 — 18.ª Caminhada da Saúde (5km). 09:45 — Corrida 8km (Sub20+Seniores e Masters). 10:45 — Kids 150m (Bâmbis). 11:00 — Kids 500m (Benjamins A). 11:10 — Kids 800m (Benjamins B). 11:20 — Kids 1.6km (Infantis). 11:35 — Kids 2.4km (Iniciados). 11:50 — Kids 3.2km (Juvenis). Levantamento dorsais a partir das 08:00 no Jardim da Fonte Férrea."
  );

  const faq0Translations = {
    pt: {
      question: "Qual é o horário do evento?",
      answer:
        "09:30 — 18.ª Caminhada da Saúde (5km). 09:45 — Corrida 8km (Sub20+Seniores e Masters). 10:45 — Kids 150m (Bâmbis). 11:00 — Kids 500m (Benjamins A). 11:10 — Kids 800m (Benjamins B). 11:20 — Kids 1.6km (Infantis). 11:35 — Kids 2.4km (Iniciados). 11:50 — Kids 3.2km (Juvenis). Levantamento dorsais a partir das 08:00 no Jardim da Fonte Férrea.",
    },
    en: {
      question: "What is the event schedule?",
      answer:
        "09:30 — 18th Health Walk (5km). 09:45 — 8km Race (Sub20+Seniors and Masters). 10:45 — Kids 150m (Bambis). 11:00 — Kids 500m (U10). 11:10 — Kids 800m (U12). 11:20 — Kids 1.6km (U14). 11:35 — Kids 2.4km (U16). 11:50 — Kids 3.2km (U18). Bib pickup from 08:00 at Jardim da Fonte Férrea.",
    },
    es: {
      question: "¿Cuál es el horario del evento?",
      answer:
        "09:30 — 18.ª Caminata de la Salud (5km). 09:45 — Carrera 8km (Sub20+Séniores y Masters). 10:45 — Kids 150m (Bâmbis). 11:00 — Kids 500m (Benjamines A). 11:10 — Kids 800m (Benjamines B). 11:20 — Kids 1.6km (Infantiles). 11:35 — Kids 2.4km (Iniciados). 11:50 — Kids 3.2km (Juveniles). Recogida de dorsales desde las 08:00 en el Jardim da Fonte Férrea.",
    },
    fr: {
      question: "Quel est le programme de l'événement ?",
      answer:
        "09h30 — 18e Marche de la Santé (5km). 09h45 — Course 8km (Sub20+Seniors et Masters). 10h45 — Kids 150m (Bambis). 11h00 — Kids 500m (U10). 11h10 — Kids 800m (U12). 11h20 — Kids 1.6km (U14). 11h35 — Kids 2.4km (U16). 11h50 — Kids 3.2km (U18). Retrait des dossards à partir de 08h00 au Jardim da Fonte Férrea.",
    },
    de: {
      question: "Wie ist der Zeitplan der Veranstaltung?",
      answer:
        "09:30 — 18. Gesundheitswanderung (5km). 09:45 — 8km Lauf (Sub20+Senioren und Masters). 10:45 — Kids 150m (Bambis). 11:00 — Kids 500m (U10). 11:10 — Kids 800m (U12). 11:20 — Kids 1.6km (U14). 11:35 — Kids 2.4km (U16). 11:50 — Kids 3.2km (U18). Startnummernausgabe ab 08:00 Uhr am Jardim da Fonte Férrea.",
    },
    it: {
      question: "Qual è il programma dell'evento?",
      answer:
        "09:30 — 18ª Camminata della Salute (5km). 09:45 — Corsa 8km (Sub20+Seniores e Masters). 10:45 — Kids 150m (Bâmbis). 11:00 — Kids 500m (U10). 11:10 — Kids 800m (U12). 11:20 — Kids 1.6km (U14). 11:35 — Kids 2.4km (U16). 11:50 — Kids 3.2km (U18). Ritiro pettorali dalle 08:00 al Jardim da Fonte Férrea.",
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
    "Classificação geral M/F: 1.º 200€, 2.º 120€, 3.º 70€, 4.º 50€, 5.º 30€. Sub20+Seniores M e F: 1.º 50€, 2.º 30€, 3.º 20€. Masters M e F por escalão: 1.º 50€, 2.º 30€, 3.º 20€. Equipas: 1.ª 200€, 2.ª 100€, 3.ª 50€. Troféus aos 1.º–3.º de cada escalão, medalhão ao 4.º e 5.º. Saco com t-shirt e ofertas para todos os participantes."
  );

  const faq1Translations = {
    pt: {
      question: "Quais são os prémios?",
      answer:
        "Classificação geral M/F: 1.º 200€, 2.º 120€, 3.º 70€, 4.º 50€, 5.º 30€. Sub20+Seniores M e F: 1.º 50€, 2.º 30€, 3.º 20€. Masters M e F por escalão: 1.º 50€, 2.º 30€, 3.º 20€. Equipas: 1.ª 200€, 2.ª 100€, 3.ª 50€. Troféus aos 1.º–3.º de cada escalão, medalhão ao 4.º e 5.º. Saco com t-shirt e ofertas para todos os participantes.",
    },
    en: {
      question: "What are the prizes?",
      answer:
        "Overall M/F: 1st €200, 2nd €120, 3rd €70, 4th €50, 5th €30. Sub20+Seniors M and F: 1st €50, 2nd €30, 3rd €20. Masters M and F per age group: 1st €50, 2nd €30, 3rd €20. Teams: 1st €200, 2nd €100, 3rd €50. Trophies for top 3 per age group, medallion for 4th and 5th. Bag with t-shirt and gifts for all participants.",
    },
    es: {
      question: "¿Cuáles son los premios?",
      answer:
        "Clasificación general M/F: 1.º 200€, 2.º 120€, 3.º 70€, 4.º 50€, 5.º 30€. Sub20+Séniores M y F: 1.º 50€, 2.º 30€, 3.º 20€. Masters M y F por categoría: 1.º 50€, 2.º 30€, 3.º 20€. Equipos: 1.º 200€, 2.º 100€, 3.º 50€. Trofeos a los 3 primeros de cada categoría, medallón al 4.º y 5.º. Bolsa con camiseta y regalos para todos.",
    },
    fr: {
      question: "Quels sont les prix ?",
      answer:
        "Classement général H/F : 1er 200€, 2e 120€, 3e 70€, 4e 50€, 5e 30€. Sub20+Seniors H et F : 1er 50€, 2e 30€, 3e 20€. Masters H et F par catégorie : 1er 50€, 2e 30€, 3e 20€. Équipes : 1re 200€, 2e 100€, 3e 50€. Trophées aux 3 premiers par catégorie, médaillon au 4e et 5e. Sac avec t-shirt et cadeaux pour tous.",
    },
    de: {
      question: "Welche Preise gibt es?",
      answer:
        "Gesamtwertung M/W: 1. 200€, 2. 120€, 3. 70€, 4. 50€, 5. 30€. Sub20+Senioren M und W: 1. 50€, 2. 30€, 3. 20€. Masters M und W pro Altersklasse: 1. 50€, 2. 30€, 3. 20€. Mannschaft: 1. 200€, 2. 100€, 3. 50€. Pokale für Top 3 pro Altersklasse, Medaillon für 4. und 5. Beutel mit T-Shirt und Geschenke für alle.",
    },
    it: {
      question: "Quali sono i premi?",
      answer:
        "Classifica generale M/F: 1° 200€, 2° 120€, 3° 70€, 4° 50€, 5° 30€. Sub20+Seniores M e F: 1° 50€, 2° 30€, 3° 20€. Masters M e F per fascia d'età: 1° 50€, 2° 30€, 3° 20€. Squadre: 1ª 200€, 2ª 100€, 3ª 50€. Trofei ai primi 3 per fascia d'età, medaglione al 4° e 5°. Sacchetto con t-shirt e omaggi per tutti.",
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
    "Bâmbis (2021 · 150m), Benjamins A Sub 10 (2017-2020 · 500m), Benjamins B Sub 12 (2015-2016 · 800m), Infantis Sub 14 (2013-2014 · 1600m), Iniciados Sub 16 (2011-2012 · 2400m), Juvenis Sub 18 (2009-2010 · 3200m), Sub20+Seniores (2007/2008 e ≤2006 · 8km), Masters M: M35, M40, M45, M50, M55, M60, M65+ · Masters F: F35, F40, F45, F50, F55+."
  );

  const faq2Translations = {
    pt: {
      question: "Quais são os escalões?",
      answer:
        "Bâmbis (2021 · 150m), Benjamins A Sub 10 (2017-2020 · 500m), Benjamins B Sub 12 (2015-2016 · 800m), Infantis Sub 14 (2013-2014 · 1600m), Iniciados Sub 16 (2011-2012 · 2400m), Juvenis Sub 18 (2009-2010 · 3200m), Sub20+Seniores (2007/2008 e ≤2006 · 8km), Masters M: M35, M40, M45, M50, M55, M60, M65+ · Masters F: F35, F40, F45, F50, F55+.",
    },
    en: {
      question: "What are the age groups?",
      answer:
        "Bambis (2021 · 150m), Benjamins A U10 (2017-2020 · 500m), Benjamins B U12 (2015-2016 · 800m), Under-14 (2013-2014 · 1600m), Under-16 (2011-2012 · 2400m), Youth U18 (2009-2010 · 3200m), Sub20+Seniors (2007/2008 and ≤2006 · 8km), Masters M: M35, M40, M45, M50, M55, M60, M65+ · Masters F: F35, F40, F45, F50, F55+.",
    },
    es: {
      question: "¿Cuáles son las categorías?",
      answer:
        "Bâmbis (2021 · 150m), Benjamines A Sub 10 (2017-2020 · 500m), Benjamines B Sub 12 (2015-2016 · 800m), Infantiles Sub 14 (2013-2014 · 1600m), Iniciados Sub 16 (2011-2012 · 2400m), Juveniles Sub 18 (2009-2010 · 3200m), Sub20+Séniores (2007/2008 y ≤2006 · 8km), Masters M: M35, M40, M45, M50, M55, M60, M65+ · Masters F: F35, F40, F45, F50, F55+.",
    },
    fr: {
      question: "Quelles sont les catégories ?",
      answer:
        "Bambis (2021 · 150m), Poussins A U10 (2017-2020 · 500m), Poussins B U12 (2015-2016 · 800m), Benjamins U14 (2013-2014 · 1600m), Minimes U16 (2011-2012 · 2400m), Cadets U18 (2009-2010 · 3200m), Sub20+Seniors (2007/2008 et ≤2006 · 8km), Masters H : M35, M40, M45, M50, M55, M60, M65+ · Masters F : F35, F40, F45, F50, F55+.",
    },
    de: {
      question: "Welche Altersklassen gibt es?",
      answer:
        "Bambis (2021 · 150m), Benjamins A U10 (2017-2020 · 500m), Benjamins B U12 (2015-2016 · 800m), U14 (2013-2014 · 1600m), U16 (2011-2012 · 2400m), Jugend U18 (2009-2010 · 3200m), Sub20+Senioren (2007/2008 und ≤2006 · 8km), Masters M: M35, M40, M45, M50, M55, M60, M65+ · Masters W: F35, F40, F45, F50, F55+.",
    },
    it: {
      question: "Quali sono le fasce d'età?",
      answer:
        "Bâmbis (2021 · 150m), Benjamins A U10 (2017-2020 · 500m), Benjamins B U12 (2015-2016 · 800m), Under-14 (2013-2014 · 1600m), Under-16 (2011-2012 · 2400m), Cadetti U18 (2009-2010 · 3200m), Sub20+Seniores (2007/2008 e ≤2006 · 8km), Masters M: M35, M40, M45, M50, M55, M60, M65+ · Masters F: F35, F40, F45, F50, F55+.",
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
    "Inscrições em www.acorrer.pt até 25 de março de 2026 às 23:59. Não se aceitam inscrições fora de prazo. Grátis para escalões Bâmbis, Benjamins, Infantis, Iniciados e Juvenis. 8€ para Corrida 8km e Caminhada 5km."
  );

  const faq3Translations = {
    pt: {
      question: "Como posso inscrever-me?",
      answer:
        "Inscrições em www.acorrer.pt até 25 de março de 2026 às 23:59. Não se aceitam inscrições fora de prazo. Grátis para escalões Bâmbis, Benjamins, Infantis, Iniciados e Juvenis. 8€ para Corrida 8km e Caminhada 5km.",
    },
    en: {
      question: "How can I register?",
      answer:
        "Registration at www.acorrer.pt until March 25, 2026 at 23:59. No late registrations accepted. Free for Bambis, Benjamins, Under-14, Under-16 and Youth age groups. €8 for 8km Race and 5km Walk.",
    },
    es: {
      question: "¿Cómo puedo inscribirme?",
      answer:
        "Inscripciones en www.acorrer.pt hasta el 25 de marzo de 2026 a las 23:59. No se aceptan inscripciones fuera de plazo. Gratis para Bâmbis, Benjamines, Infantiles, Iniciados y Juveniles. 8€ para Carrera 8km y Caminata 5km.",
    },
    fr: {
      question: "Comment puis-je m'inscrire ?",
      answer:
        "Inscriptions sur www.acorrer.pt jusqu'au 25 mars 2026 à 23h59. Pas d'inscriptions hors délai. Gratuit pour Bambis, Poussins, Benjamins, Minimes et Cadets. 8€ pour la Course 8km et la Randonnée 5km.",
    },
    de: {
      question: "Wie kann ich mich anmelden?",
      answer:
        "Anmeldung auf www.acorrer.pt bis 25. März 2026 um 23:59 Uhr. Keine verspäteten Anmeldungen. Kostenlos für Bambis, Benjamins, U14, U16 und Jugend. 8€ für 8km Lauf und 5km Wanderung.",
    },
    it: {
      question: "Come posso iscrivermi?",
      answer:
        "Iscrizioni su www.acorrer.pt fino al 25 marzo 2026 alle 23:59. Non si accettano iscrizioni fuori termine. Gratuito per Bâmbis, Benjamins, Under-14, Under-16 e Cadetti. 8€ per Corsa 8km e Camminata 5km.",
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

  // ── FAQ 4: Course description ──
  const faq4 = await findOrCreateFAQ(
    event.id,
    4,
    "Como são os percursos?",
    "Partida e chegada no Jardim da Fonte Férrea. Percurso A (500m): Fonte Férrea → Estrada da Circunvalação → Rotunda do Chaparro (retorno) → Meta. Percurso B (800m): Fonte Férrea → Av. Gago Coutinho → Circunvalação → Rotunda do Chaparro (retorno) → Meta. Percurso C (1600m): circuito pela Circunvalação, Rua José Maria de Andrade, Jardim Sousa Prado, Praça da República, Rua Serpa Pinto. Corrida 8km: 5 voltas ao percurso C. Caminhada 5km: percurso médio."
  );

  const faq4Translations = {
    pt: {
      question: "Como são os percursos?",
      answer:
        "Partida e chegada no Jardim da Fonte Férrea. Percurso A (500m): Fonte Férrea → Estrada da Circunvalação → Rotunda do Chaparro (retorno) → Meta. Percurso B (800m): Fonte Férrea → Av. Gago Coutinho → Circunvalação → Rotunda do Chaparro (retorno) → Meta. Percurso C (1600m): circuito pela Circunvalação, Rua José Maria de Andrade, Jardim Sousa Prado, Praça da República, Rua Serpa Pinto. Corrida 8km: 5 voltas ao percurso C. Caminhada 5km: percurso médio.",
    },
    en: {
      question: "What are the courses like?",
      answer:
        "Start and finish at Jardim da Fonte Férrea. Course A (500m): Fonte Férrea → Estrada da Circunvalação → Chaparro roundabout (turnaround) → Finish. Course B (800m): Fonte Férrea → Av. Gago Coutinho → Circunvalação → Chaparro roundabout (turnaround) → Finish. Course C (1600m): loop through Circunvalação, Rua José Maria de Andrade, Jardim Sousa Prado, Praça da República, Rua Serpa Pinto. 8km Race: 5 laps of Course C. 5km Walk: medium course.",
    },
    es: {
      question: "¿Cómo son los recorridos?",
      answer:
        "Salida y llegada en el Jardim da Fonte Férrea. Recorrido A (500m): Fonte Férrea → Estrada da Circunvalação → Rotonda do Chaparro (retorno) → Meta. Recorrido B (800m): Fonte Férrea → Av. Gago Coutinho → Circunvalação → Rotonda do Chaparro (retorno) → Meta. Recorrido C (1600m): circuito por la Circunvalação, Rua José Maria de Andrade, Jardim Sousa Prado, Praça da República, Rua Serpa Pinto. Carrera 8km: 5 vueltas al recorrido C. Caminata 5km: recorrido medio.",
    },
    fr: {
      question: "Comment sont les parcours ?",
      answer:
        "Départ et arrivée au Jardim da Fonte Férrea. Parcours A (500m) : Fonte Férrea → Estrada da Circunvalação → Rond-point du Chaparro (retour) → Arrivée. Parcours B (800m) : Fonte Férrea → Av. Gago Coutinho → Circunvalação → Rond-point du Chaparro (retour) → Arrivée. Parcours C (1600m) : boucle par Circunvalação, Rua José Maria de Andrade, Jardim Sousa Prado, Praça da República, Rua Serpa Pinto. Course 8km : 5 tours du parcours C. Randonnée 5km : parcours moyen.",
    },
    de: {
      question: "Wie sind die Strecken?",
      answer:
        "Start und Ziel am Jardim da Fonte Férrea. Strecke A (500m): Fonte Férrea → Estrada da Circunvalação → Chaparro-Kreisverkehr (Umkehr) → Ziel. Strecke B (800m): Fonte Férrea → Av. Gago Coutinho → Circunvalação → Chaparro-Kreisverkehr (Umkehr) → Ziel. Strecke C (1600m): Rundkurs über Circunvalação, Rua José Maria de Andrade, Jardim Sousa Prado, Praça da República, Rua Serpa Pinto. 8km Lauf: 5 Runden der Strecke C. 5km Wanderung: mittlere Strecke.",
    },
    it: {
      question: "Come sono i percorsi?",
      answer:
        "Partenza e arrivo al Jardim da Fonte Férrea. Percorso A (500m): Fonte Férrea → Estrada da Circunvalação → Rotonda do Chaparro (ritorno) → Traguardo. Percorso B (800m): Fonte Férrea → Av. Gago Coutinho → Circunvalação → Rotonda do Chaparro (ritorno) → Traguardo. Percorso C (1600m): circuito per Circunvalação, Rua José Maria de Andrade, Jardim Sousa Prado, Praça da República, Rua Serpa Pinto. Corsa 8km: 5 giri del percorso C. Camminata 5km: percorso medio.",
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
  console.log("✅ FAQ 4: Course description");

  // ── FAQ 5: Contacts ──
  const faq5 = await findOrCreateFAQ(
    event.id,
    5,
    "Quais são os contactos da organização?",
    "Núcleo Desportivo e Cultural de Odemira. Telefone: 283 308 033. Telemóvel: 966 975 750 / 966 817 077. E-mail: ndcodemira@hotmail.com."
  );

  const faq5Translations = {
    pt: {
      question: "Quais são os contactos da organização?",
      answer:
        "Núcleo Desportivo e Cultural de Odemira. Telefone: 283 308 033. Telemóvel: 966 975 750 / 966 817 077. E-mail: ndcodemira@hotmail.com.",
    },
    en: {
      question: "What are the organization's contacts?",
      answer:
        "Núcleo Desportivo e Cultural de Odemira. Phone: +351 283 308 033. Mobile: +351 966 975 750 / +351 966 817 077. Email: ndcodemira@hotmail.com.",
    },
    es: {
      question: "¿Cuáles son los contactos de la organización?",
      answer:
        "Núcleo Desportivo e Cultural de Odemira. Teléfono: 283 308 033. Móvil: 966 975 750 / 966 817 077. E-mail: ndcodemira@hotmail.com.",
    },
    fr: {
      question: "Quels sont les contacts de l'organisation ?",
      answer:
        "Núcleo Desportivo e Cultural de Odemira. Tél : 283 308 033. Portable : 966 975 750 / 966 817 077. E-mail : ndcodemira@hotmail.com.",
    },
    de: {
      question: "Was sind die Kontaktdaten der Organisation?",
      answer:
        "Núcleo Desportivo e Cultural de Odemira. Telefon: 283 308 033. Mobil: 966 975 750 / 966 817 077. E-Mail: ndcodemira@hotmail.com.",
    },
    it: {
      question: "Quali sono i contatti dell'organizzazione?",
      answer:
        "Núcleo Desportivo e Cultural de Odemira. Telefono: 283 308 033. Cellulare: 966 975 750 / 966 817 077. E-mail: ndcodemira@hotmail.com.",
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
🏃 44º Circuito de Atletismo "Vila de Odemira" 2026 seed completed!
──────────────────────────────────────────────
- Slug: circuito-atletismo-odemira-2026
- Date: April 3, 2026 (Good Friday)
- Location: Jardim da Fonte Férrea, Odemira
- Organizer: Núcleo Desportivo e Cultural de Odemira (50th anniversary)
- Variants: Corrida 8km (8€), Caminhada 5km (8€), Kids 3.2km, 2.4km, 1.6km, 800m, 500m, 150m (Grátis)
- Pricing: 8 pricing phases (2 paid + 6 free)
- FAQs: 6 with translations in 6 languages
- Association: Associação de Atletismo de Beja
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
