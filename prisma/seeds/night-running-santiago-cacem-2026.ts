/**
 * Seed: 7º Night Running Cidade de Santiago do Cacém 2026
 *
 * Event: Night running event in Santiago do Cacém
 * Location: Pavilhão da Juventude Atlético Clube (J.A.C.)
 * Date: March 28, 2026
 * Organizer: Juventude Atlético Clube (J.A.C.) + CM Santiago do Cacém
 * Sport: Running, Walking
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌙 Seeding 7º Night Running Santiago do Cacém 2026...");

  // ──────────────────────────────────────────────
  // 1. Upsert Event
  // ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: "night-running-santiago-cacem-2026" },
    update: {
      title: "7º Night Running Cidade de Santiago do Cacém 2026",
      description:
        "7º Night Running Cidade de Santiago do Cacém 2026 - Corrida noturna em Santiago do Cacém",
      sportTypes: [SportType.RUNNING, SportType.WALKING],
      startDate: new Date("2026-03-28T11:00:00Z"),
      endDate: new Date("2026-03-28T22:00:00Z"),
      registrationDeadline: new Date("2026-03-23T23:59:00Z"),
      externalUrl: "https://www.acorrer.pt",
      imageUrl: "",
      city: "Santiago do Cacém",
      country: "Portugal",
      latitude: 38.0033,
      longitude: -8.6947,
      googleMapsUrl: "https://maps.google.com/?q=38.0033,-8.6947",
      isFeatured: false,
      cancelled: false,
    },
    create: {
      title: "7º Night Running Cidade de Santiago do Cacém 2026",
      slug: "night-running-santiago-cacem-2026",
      description:
        "7º Night Running Cidade de Santiago do Cacém 2026 - Corrida noturna em Santiago do Cacém",
      sportTypes: [SportType.RUNNING, SportType.WALKING],
      startDate: new Date("2026-03-28T11:00:00Z"),
      endDate: new Date("2026-03-28T22:00:00Z"),
      registrationDeadline: new Date("2026-03-23T23:59:00Z"),
      externalUrl: "https://www.acorrer.pt",
      imageUrl: "",
      city: "Santiago do Cacém",
      country: "Portugal",
      latitude: 38.0033,
      longitude: -8.6947,
      googleMapsUrl: "https://maps.google.com/?q=38.0033,-8.6947",
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
      title: "7º Night Running Cidade de Santiago do Cacém 2026",
      description: `# 🌙 7º Night Running Cidade de Santiago do Cacém 2026

**A 7ª edição do Night Running de Santiago do Cacém realiza-se a 28 de março de 2026!** Organizado pela **Juventude Atlético Clube (J.A.C.)** com o apoio da **Câmara Municipal de Santiago do Cacém** e da **União de Freguesias de Santiago do Cacém, Santa Cruz e São Bartolomeu da Serra**.

Partida e chegada no interior do **Pavilhão da J.A.C.** — percursos por vários tipos de terreno: terra batida, estradões, empedrado e alcatrão. Evento noturno com **lanterna frontal obrigatória**.

---

## 🏃 Provas

- **Corrida Kids 300m** – Benjamins (6–9 anos) · Partida 16:00
- **Corrida Kids 800m** – Infantis (10–11 anos) · Partida 16:00
- **Corrida Kids 1000m** – Iniciados/Juvenis (12–15 anos) · Partida 16:00
- **Corrida 14 km** – Idade mín. 16 anos · Partida 19:00
- **Caminhada 10 km** – Sem limite de idade · Partida 19:15

---

## ⏰ Horário

- 11:00 – 18:30 — Secretariado (Pavilhão J.A.C.)
- 16:00 — Corrida Crianças (partidas por distância)
- 17:00 — Entrega de prémios Crianças
- 18:40 — Aquecimento (Corrida 14K + Caminhada 10K)
- 18:50 — Briefing
- 19:00 — Partida Corrida 14 km
- 19:15 — Partida Caminhada 10 km
- 20:30 — Entrega de prémios

---

## 🎽 A inscrição inclui

- Dorsal (com chip na Corrida 14K)
- T-shirt técnica
- Medalha de finisher
- Seguro desportivo
- Abastecimentos durante a prova e na meta
- Duche
- Brindes adicionais

---

## 🍽️ Mini refeição

Disponível por 5 € — 1 bifana + 1 sopa + 1 bebida.

---

## 🏆 Prémios

**Corrida 14K:** Prémios simbólicos aos 3 primeiros geral M/F e por escalão M/F. 3 primeiras equipas (mín. 4 atletas, 3 melhores contam).

---

## ⚠️ Material obrigatório

- Dorsal visível
- **Lanterna frontal** (percurso noturno)

---

## 📍 Limite: 500 participantes

🌙 **Vem correr à noite por Santiago do Cacém!** 🏃`,
      city: "Santiago do Cacém",
      metaTitle: "7º Night Running Santiago do Cacém 2026 | 28 Março",
      metaDescription:
        "7º Night Running Cidade de Santiago do Cacém a 28 de março de 2026. Corrida noturna 14km, Caminhada 10km e Corrida Kids. Organização J.A.C. Lanterna frontal obrigatória.",
    },
    en: {
      title: "7th Night Running Santiago do Cacém 2026",
      description: `# 🌙 7th Night Running Santiago do Cacém 2026

**The 7th edition of Night Running Santiago do Cacém takes place on March 28, 2026!** Organized by **Juventude Atlético Clube (J.A.C.)** with support from **Santiago do Cacém Municipality** and the **local parish council**.

Start and finish inside the **J.A.C. Pavilion** — courses through various terrain: dirt tracks, cobblestone and asphalt. Night event with **mandatory headlamp**.

---

## 🏃 Races

- **Kids 300m** – Benjamins (ages 6–9) · Start 16:00
- **Kids 800m** – Infantis (ages 10–11) · Start 16:00
- **Kids 1000m** – Iniciados/Juvenis (ages 12–15) · Start 16:00
- **14 km Race** – Min. age 16 · Start 19:00
- **10 km Walk** – No age limit · Start 19:15

---

## ⏰ Schedule

- 11:00 – 18:30 — Registration (J.A.C. Pavilion)
- 16:00 — Kids races (by distance)
- 17:00 — Kids prize ceremony
- 18:40 — Warm-up (14K Race + 10K Walk)
- 18:50 — Briefing
- 19:00 — 14 km Race start
- 19:15 — 10 km Walk start
- 20:30 — Prize ceremony

---

## 🎽 Registration includes

- Bib number (with chip for 14K Race)
- Technical t-shirt
- Finisher medal
- Sports insurance
- Aid stations during the race and at finish
- Showers
- Additional gifts

---

## 🍽️ Mini meal

Available for €5 — 1 bifana (pork sandwich) + 1 soup + 1 drink.

---

## 🏆 Prizes

**14K Race:** Symbolic prizes for top 3 overall M/F and per age group M/F. Top 3 teams (min. 4 athletes, best 3 count).

---

## ⚠️ Mandatory equipment

- Visible bib
- **Headlamp** (night course)

---

## 📍 Limit: 500 participants

🌙 **Come run through Santiago do Cacém at night!** 🏃`,
      city: "Santiago do Cacém",
      metaTitle: "7th Night Running Santiago do Cacém 2026 | March 28",
      metaDescription:
        "7th Night Running Santiago do Cacém on March 28, 2026. Night race 14km, Walk 10km and Kids Race. Organized by J.A.C. Headlamp mandatory.",
    },
    es: {
      title: "7º Night Running Santiago do Cacém 2026",
      description: `# 🌙 7º Night Running Santiago do Cacém 2026

**La 7ª edición del Night Running de Santiago do Cacém se celebra el 28 de marzo de 2026.** Organizado por la **Juventude Atlético Clube (J.A.C.)** con el apoyo del **Ayuntamiento de Santiago do Cacém** y la **junta de freguesia local**.

Salida y llegada en el interior del **Pabellón J.A.C.** — recorridos por terreno variado: tierra, empedrado y asfalto. Evento nocturno con **linterna frontal obligatoria**.

---

## 🏃 Pruebas

- **Kids 300m** – Benjamines (6–9 años) · Salida 16:00
- **Kids 800m** – Infantiles (10–11 años) · Salida 16:00
- **Kids 1000m** – Iniciados/Juveniles (12–15 años) · Salida 16:00
- **Carrera 14 km** – Edad mín. 16 años · Salida 19:00
- **Caminata 10 km** – Sin límite de edad · Salida 19:15

---

## 🎽 La inscripción incluye

- Dorsal (con chip en Carrera 14K)
- Camiseta técnica
- Medalla finisher
- Seguro deportivo
- Avituallamientos y ducha

---

## 🍽️ Mini comida

Disponible por 5 € — 1 bifana + 1 sopa + 1 bebida.

---

## 🏆 Premios

**Carrera 14K:** Premios simbólicos a los 3 primeros general M/F y por categoría. 3 primeros equipos.

---

🌙 **¡Ven a correr de noche por Santiago do Cacém!** 🏃`,
      city: "Santiago do Cacém",
      metaTitle: "7º Night Running Santiago do Cacém 2026 | 28 Marzo",
      metaDescription:
        "7º Night Running Santiago do Cacém el 28 de marzo de 2026. Carrera nocturna 14km, Caminata 10km y Carrera Kids. Linterna frontal obligatoria.",
    },
    fr: {
      title: "7ème Night Running Santiago do Cacém 2026",
      description: `# 🌙 7ème Night Running Santiago do Cacém 2026

**La 7ème édition du Night Running de Santiago do Cacém a lieu le 28 mars 2026 !** Organisé par la **Juventude Atlético Clube (J.A.C.)** avec le soutien de la **Mairie de Santiago do Cacém** et de la **junta de freguesia locale**.

Départ et arrivée à l'intérieur du **Pavillon J.A.C.** — parcours sur terrains variés : piste, pavés et asphalte. Événement nocturne avec **lampe frontale obligatoire**.

---

## 🏃 Épreuves

- **Kids 300m** – Benjamins (6–9 ans) · Départ 16h00
- **Kids 800m** – Infantiles (10–11 ans) · Départ 16h00
- **Kids 1000m** – Iniciados/Juvenis (12–15 ans) · Départ 16h00
- **Course 14 km** – Âge min. 16 ans · Départ 19h00
- **Randonnée 10 km** – Sans limite d'âge · Départ 19h15

---

## 🎽 L'inscription comprend

- Dossard (avec puce pour Course 14K)
- T-shirt technique
- Médaille finisher
- Assurance sportive
- Ravitaillements et douches

---

## 🍽️ Mini repas

Disponible pour 5 € — 1 bifana + 1 soupe + 1 boisson.

---

## 🏆 Prix

**Course 14K :** Prix symboliques aux 3 premiers général H/F et par catégorie. 3 premières équipes.

---

🌙 **Venez courir de nuit à Santiago do Cacém !** 🏃`,
      city: "Santiago do Cacém",
      metaTitle: "7ème Night Running Santiago do Cacém 2026 | 28 Mars",
      metaDescription:
        "7ème Night Running Santiago do Cacém le 28 mars 2026. Course nocturne 14km, Randonnée 10km et Course Kids. Lampe frontale obligatoire.",
    },
    de: {
      title: "7. Night Running Santiago do Cacém 2026",
      description: `# 🌙 7. Night Running Santiago do Cacém 2026

**Die 7. Ausgabe des Night Running Santiago do Cacém findet am 28. März 2026 statt!** Organisiert vom **Juventude Atlético Clube (J.A.C.)** mit Unterstützung der **Gemeinde Santiago do Cacém** und der **lokalen Gemeindeversammlung**.

Start und Ziel in der **J.A.C. Sporthalle** — Strecken über verschiedene Untergründe: Feldwege, Kopfsteinpflaster und Asphalt. Nachtlauf mit **Pflicht-Stirnlampe**.

---

## 🏃 Rennen

- **Kids 300m** – Benjamins (6–9 Jahre) · Start 16:00
- **Kids 800m** – Infantis (10–11 Jahre) · Start 16:00
- **Kids 1000m** – Iniciados/Juvenis (12–15 Jahre) · Start 16:00
- **14 km Lauf** – Mindestalter 16 · Start 19:00
- **10 km Wanderung** – Kein Mindestalter · Start 19:15

---

## 🎽 Anmeldung beinhaltet

- Startnummer (mit Chip für 14K Lauf)
- Technisches T-Shirt
- Finisher-Medaille
- Sportversicherung
- Verpflegung und Duschen

---

## 🍽️ Mini-Mahlzeit

Verfügbar für 5 € — 1 Bifana + 1 Suppe + 1 Getränk.

---

## 🏆 Preise

**14K Lauf:** Symbolische Preise für Top 3 Gesamt M/W und pro Altersklasse. Top 3 Mannschaften.

---

🌙 **Komm und laufe nachts durch Santiago do Cacém!** 🏃`,
      city: "Santiago do Cacém",
      metaTitle: "7. Night Running Santiago do Cacém 2026 | 28. März",
      metaDescription:
        "7. Night Running Santiago do Cacém am 28. März 2026. Nachtlauf 14km, Wanderung 10km und Kinderlauf. Stirnlampe Pflicht.",
    },
    it: {
      title: "7° Night Running Santiago do Cacém 2026",
      description: `# 🌙 7° Night Running Santiago do Cacém 2026

**La 7ª edizione del Night Running di Santiago do Cacém si svolge il 28 marzo 2026!** Organizzato dalla **Juventude Atlético Clube (J.A.C.)** con il supporto del **Comune di Santiago do Cacém** e della **junta de freguesia locale**.

Partenza e arrivo all'interno del **Padiglione J.A.C.** — percorsi su terreni vari: sterrato, selciato e asfalto. Evento notturno con **lampada frontale obbligatoria**.

---

## 🏃 Gare

- **Kids 300m** – Benjamins (6–9 anni) · Partenza 16:00
- **Kids 800m** – Infantis (10–11 anni) · Partenza 16:00
- **Kids 1000m** – Iniciados/Juvenis (12–15 anni) · Partenza 16:00
- **Corsa 14 km** – Età min. 16 anni · Partenza 19:00
- **Camminata 10 km** – Senza limite d'età · Partenza 19:15

---

## 🎽 L'iscrizione include

- Pettorale (con chip per Corsa 14K)
- T-shirt tecnica
- Medaglia finisher
- Assicurazione sportiva
- Rifornimenti e docce

---

## 🍽️ Mini pasto

Disponibile a 5 € — 1 bifana + 1 zuppa + 1 bevanda.

---

## 🏆 Premi

**Corsa 14K:** Premi simbolici ai 3 primi generale M/F e per fascia d'età. 3 prime squadre.

---

🌙 **Vieni a correre di notte a Santiago do Cacém!** 🏃`,
      city: "Santiago do Cacém",
      metaTitle: "7° Night Running Santiago do Cacém 2026 | 28 Marzo",
      metaDescription:
        "7° Night Running Santiago do Cacém il 28 marzo 2026. Corsa notturna 14km, Camminata 10km e Corsa Kids. Lampada frontale obbligatoria.",
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

  // ── Variant 1: Kids 300m ──
  const kids300 = await findOrCreateVariant({
    name: "Kids 300m",
    distanceKm: 0.3,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-03-28T16:00:00Z"),
    startTime: "16:00",
    cutoffTimeHours: null,
    price: 5.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Kids 300m · Benjamins (6–9 anos)",
  });
  console.log(`✅ Variant: ${kids300.name}`);

  // ── Variant 2: Kids 800m ──
  const kids800 = await findOrCreateVariant({
    name: "Kids 800m",
    distanceKm: 0.8,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-03-28T16:00:00Z"),
    startTime: "16:00",
    cutoffTimeHours: null,
    price: 5.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Kids 800m · Infantis (10–11 anos)",
  });
  console.log(`✅ Variant: ${kids800.name}`);

  // ── Variant 3: Kids 1000m ──
  const kids1000 = await findOrCreateVariant({
    name: "Kids 1000m",
    distanceKm: 1.0,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-03-28T16:00:00Z"),
    startTime: "16:00",
    cutoffTimeHours: null,
    price: 5.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Kids 1000m · Iniciados/Juvenis (12–15 anos)",
  });
  console.log(`✅ Variant: ${kids1000.name}`);

  // ── Variant 4: Corrida 14km ──
  const corrida = await findOrCreateVariant({
    name: "Corrida 14km",
    distanceKm: 14,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-03-28T19:00:00Z"),
    startTime: "19:00",
    cutoffTimeHours: null,
    price: 15.0,
    currency: Currency.EUR,
    maxParticipants: 500,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Corrida 14 km · Noturna · Idade mín. 16 anos · Lanterna frontal obrigatória",
  });
  console.log(`✅ Variant: ${corrida.name}`);

  // ── Variant 5: Caminhada 10km ──
  const caminhada = await findOrCreateVariant({
    name: "Caminhada 10km",
    distanceKm: 10,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-03-28T19:15:00Z"),
    startTime: "19:15",
    cutoffTimeHours: null,
    price: 10.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Caminhada 10 km · Noturna · Sem limite de idade",
  });
  console.log(`✅ Variant: ${caminhada.name}`);

  // ── Variant Translations (ALL 6 languages) ──
  const variantTranslations: Record<
    string,
    Record<string, { name: string; description: string | null }>
  > = {
    kids300: {
      pt: {
        name: "Kids 300m",
        description: "Kids 300m · Benjamins (6–9 anos)",
      },
      en: {
        name: "Kids 300m",
        description: "Kids 300m · Benjamins (ages 6–9)",
      },
      es: {
        name: "Kids 300m",
        description: "Kids 300m · Benjamines (6–9 años)",
      },
      fr: { name: "Kids 300m", description: "Kids 300m · Benjamins (6–9 ans)" },
      de: {
        name: "Kids 300m",
        description: "Kids 300m · Benjamins (6–9 Jahre)",
      },
      it: {
        name: "Kids 300m",
        description: "Kids 300m · Benjamins (6–9 anni)",
      },
    },
    kids800: {
      pt: {
        name: "Kids 800m",
        description: "Kids 800m · Infantis (10–11 anos)",
      },
      en: {
        name: "Kids 800m",
        description: "Kids 800m · Infantis (ages 10–11)",
      },
      es: {
        name: "Kids 800m",
        description: "Kids 800m · Infantiles (10–11 años)",
      },
      fr: {
        name: "Kids 800m",
        description: "Kids 800m · Infantiles (10–11 ans)",
      },
      de: {
        name: "Kids 800m",
        description: "Kids 800m · Infantis (10–11 Jahre)",
      },
      it: {
        name: "Kids 800m",
        description: "Kids 800m · Infantis (10–11 anni)",
      },
    },
    kids1000: {
      pt: {
        name: "Kids 1000m",
        description: "Kids 1000m · Iniciados/Juvenis (12–15 anos)",
      },
      en: {
        name: "Kids 1000m",
        description: "Kids 1000m · Iniciados/Juvenis (ages 12–15)",
      },
      es: {
        name: "Kids 1000m",
        description: "Kids 1000m · Iniciados/Juveniles (12–15 años)",
      },
      fr: {
        name: "Kids 1000m",
        description: "Kids 1000m · Iniciados/Juvenis (12–15 ans)",
      },
      de: {
        name: "Kids 1000m",
        description: "Kids 1000m · Iniciados/Juvenis (12–15 Jahre)",
      },
      it: {
        name: "Kids 1000m",
        description: "Kids 1000m · Iniciados/Juvenis (12–15 anni)",
      },
    },
    corrida: {
      pt: {
        name: "Corrida 14km",
        description:
          "Corrida 14 km · Noturna · Idade mín. 16 anos · Lanterna frontal obrigatória",
      },
      en: {
        name: "14km Race",
        description: "14 km Race · Night · Min. age 16 · Headlamp mandatory",
      },
      es: {
        name: "Carrera 14km",
        description:
          "Carrera 14 km · Nocturna · Edad mín. 16 años · Linterna frontal obligatoria",
      },
      fr: {
        name: "Course 14km",
        description:
          "Course 14 km · Nocturne · Âge min. 16 ans · Lampe frontale obligatoire",
      },
      de: {
        name: "14km Lauf",
        description:
          "14 km Lauf · Nachtlauf · Mindestalter 16 · Stirnlampe Pflicht",
      },
      it: {
        name: "Corsa 14km",
        description:
          "Corsa 14 km · Notturna · Età min. 16 anni · Lampada frontale obbligatoria",
      },
    },
    caminhada: {
      pt: {
        name: "Caminhada 10km",
        description: "Caminhada 10 km · Noturna · Sem limite de idade",
      },
      en: {
        name: "10km Walk",
        description: "10 km Walk · Night · No age limit",
      },
      es: {
        name: "Caminata 10km",
        description: "Caminata 10 km · Nocturna · Sin límite de edad",
      },
      fr: {
        name: "Randonnée 10km",
        description: "Randonnée 10 km · Nocturne · Sans limite d'âge",
      },
      de: {
        name: "10km Wanderung",
        description: "10 km Wanderung · Nachtlauf · Kein Mindestalter",
      },
      it: {
        name: "Camminata 10km",
        description: "Camminata 10 km · Notturna · Senza limite d'età",
      },
    },
  };

  const variantMap = [
    { variant: kids300, key: "kids300" },
    { variant: kids800, key: "kids800" },
    { variant: kids1000, key: "kids1000" },
    { variant: corrida, key: "corrida" },
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
  // 4. Pricing Phases (single phase, linked to eventId AND variantId)
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

  const pricingDeadline = new Date("2026-03-23T23:59:59Z");
  const pricingStart = new Date("2025-12-01T00:00:00Z");

  await findOrCreatePricingPhase("Kids 300m - Inscrição", kids300.id, {
    startDate: pricingStart,
    endDate: pricingDeadline,
    price: 5.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Kids 800m - Inscrição", kids800.id, {
    startDate: pricingStart,
    endDate: pricingDeadline,
    price: 5.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Kids 1000m - Inscrição", kids1000.id, {
    startDate: pricingStart,
    endDate: pricingDeadline,
    price: 5.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Corrida 14km - Inscrição", corrida.id, {
    startDate: pricingStart,
    endDate: pricingDeadline,
    price: 15.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Caminhada 10km - Inscrição", caminhada.id, {
    startDate: pricingStart,
    endDate: pricingDeadline,
    price: 10.0,
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
    "11:00–18:30 — Secretariado (Pavilhão J.A.C.). 16:00 — Corrida Crianças (partidas por distância: Benjamins, Infantis, Iniciados, Juvenis). 17:00 — Entrega de prémios Crianças. 18:40 — Aquecimento. 18:50 — Briefing. 19:00 — Partida Corrida 14km. 19:15 — Partida Caminhada 10km. 20:30 — Entrega de prémios."
  );

  const faq0Translations = {
    pt: {
      question: "Qual é o horário do evento?",
      answer:
        "11:00–18:30 — Secretariado (Pavilhão J.A.C.). 16:00 — Corrida Crianças (partidas por distância: Benjamins, Infantis, Iniciados, Juvenis). 17:00 — Entrega de prémios Crianças. 18:40 — Aquecimento. 18:50 — Briefing. 19:00 — Partida Corrida 14km. 19:15 — Partida Caminhada 10km. 20:30 — Entrega de prémios.",
    },
    en: {
      question: "What is the event schedule?",
      answer:
        "11:00–18:30 — Registration (J.A.C. Pavilion). 16:00 — Kids races (by distance: Benjamins, Infantis, Iniciados, Juvenis). 17:00 — Kids prize ceremony. 18:40 — Warm-up. 18:50 — Briefing. 19:00 — 14km Race start. 19:15 — 10km Walk start. 20:30 — Prize ceremony.",
    },
    es: {
      question: "¿Cuál es el horario del evento?",
      answer:
        "11:00–18:30 — Secretaría (Pabellón J.A.C.). 16:00 — Carrera Niños (salidas por distancia). 17:00 — Entrega de premios Niños. 18:40 — Calentamiento. 18:50 — Briefing. 19:00 — Salida Carrera 14km. 19:15 — Salida Caminata 10km. 20:30 — Entrega de premios.",
    },
    fr: {
      question: "Quel est le programme de l'événement ?",
      answer:
        "11h00–18h30 — Secrétariat (Pavillon J.A.C.). 16h00 — Course Enfants (départs par distance). 17h00 — Remise des prix Enfants. 18h40 — Échauffement. 18h50 — Briefing. 19h00 — Départ Course 14km. 19h15 — Départ Randonnée 10km. 20h30 — Remise des prix.",
    },
    de: {
      question: "Wie ist der Zeitplan der Veranstaltung?",
      answer:
        "11:00–18:30 — Sekretariat (J.A.C. Sporthalle). 16:00 — Kinderläufe (nach Distanz). 17:00 — Kinderpreisverleihung. 18:40 — Aufwärmen. 18:50 — Briefing. 19:00 — Start 14km Lauf. 19:15 — Start 10km Wanderung. 20:30 — Preisverleihung.",
    },
    it: {
      question: "Qual è il programma dell'evento?",
      answer:
        "11:00–18:30 — Segreteria (Padiglione J.A.C.). 16:00 — Corsa Bambini (partenze per distanza). 17:00 — Premiazione Bambini. 18:40 — Riscaldamento. 18:50 — Briefing. 19:00 — Partenza Corsa 14km. 19:15 — Partenza Camminata 10km. 20:30 — Premiazione.",
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

  // ── FAQ 1: What's included ──
  const faq1 = await findOrCreateFAQ(
    event.id,
    1,
    "O que está incluído na inscrição?",
    "Dorsal (com chip na Corrida 14K), T-shirt técnica, medalha de finisher, seguro desportivo, abastecimentos durante a prova e na meta, duche e brindes adicionais."
  );

  const faq1Translations = {
    pt: {
      question: "O que está incluído na inscrição?",
      answer:
        "Dorsal (com chip na Corrida 14K), T-shirt técnica, medalha de finisher, seguro desportivo, abastecimentos durante a prova e na meta, duche e brindes adicionais.",
    },
    en: {
      question: "What is included in the registration?",
      answer:
        "Bib number (with chip for 14K Race), technical t-shirt, finisher medal, sports insurance, aid stations during the race and at finish, showers and additional gifts.",
    },
    es: {
      question: "¿Qué incluye la inscripción?",
      answer:
        "Dorsal (con chip en Carrera 14K), camiseta técnica, medalla finisher, seguro deportivo, avituallamientos durante la prueba y en meta, duchas y obsequios.",
    },
    fr: {
      question: "Que comprend l'inscription ?",
      answer:
        "Dossard (avec puce pour Course 14K), t-shirt technique, médaille finisher, assurance sportive, ravitaillements pendant la course et à l'arrivée, douches et cadeaux.",
    },
    de: {
      question: "Was ist in der Anmeldung enthalten?",
      answer:
        "Startnummer (mit Chip für 14K Lauf), technisches T-Shirt, Finisher-Medaille, Sportversicherung, Verpflegung während des Laufs und im Ziel, Duschen und Geschenke.",
    },
    it: {
      question: "Cosa è incluso nell'iscrizione?",
      answer:
        "Pettorale (con chip per Corsa 14K), t-shirt tecnica, medaglia finisher, assicurazione sportiva, rifornimenti durante la gara e al traguardo, docce e omaggi.",
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
  console.log("✅ FAQ 1: What's included");

  // ── FAQ 2: Mandatory equipment ──
  const faq2 = await findOrCreateFAQ(
    event.id,
    2,
    "Qual é o material obrigatório?",
    "Obrigatório: dorsal visível e lanterna frontal. Recomendado: telemóvel carregado, calçado e roupa adequada à prática desportiva e às condições atmosféricas."
  );

  const faq2Translations = {
    pt: {
      question: "Qual é o material obrigatório?",
      answer:
        "Obrigatório: dorsal visível e lanterna frontal. Recomendado: telemóvel carregado, calçado e roupa adequada à prática desportiva e às condições atmosféricas.",
    },
    en: {
      question: "What mandatory equipment is required?",
      answer:
        "Mandatory: visible bib and headlamp. Recommended: charged phone, footwear and clothing suitable for sports practice and weather conditions.",
    },
    es: {
      question: "¿Cuál es el material obligatorio?",
      answer:
        "Obligatorio: dorsal visible y linterna frontal. Recomendado: teléfono cargado, calzado y ropa adecuada.",
    },
    fr: {
      question: "Quel est le matériel obligatoire ?",
      answer:
        "Obligatoire : dossard visible et lampe frontale. Recommandé : téléphone chargé, chaussures et vêtements adaptés.",
    },
    de: {
      question: "Welche Pflichtausrüstung ist erforderlich?",
      answer:
        "Pflicht: sichtbare Startnummer und Stirnlampe. Empfohlen: geladenes Telefon, geeignetes Schuhwerk und Kleidung.",
    },
    it: {
      question: "Quale equipaggiamento obbligatorio è richiesto?",
      answer:
        "Obbligatorio: pettorale visibile e lampada frontale. Consigliato: telefono carico, calzature e abbigliamento adeguato.",
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
  console.log("✅ FAQ 2: Mandatory equipment");

  // ── FAQ 3: Kids races ──
  const faq3 = await findOrCreateFAQ(
    event.id,
    3,
    "Como funcionam as corridas de crianças?",
    "As corridas de crianças começam às 16:00 com 3 distâncias: 300m (Benjamins, 6–9 anos), 800m (Infantis, 10–11 anos) e 1000m (Iniciados 12–13 anos e Juvenis 14–15 anos). Inscrição: 5 €. Obrigatório termo de responsabilidade assinado pelo encarregado de educação."
  );

  const faq3Translations = {
    pt: {
      question: "Como funcionam as corridas de crianças?",
      answer:
        "As corridas de crianças começam às 16:00 com 3 distâncias: 300m (Benjamins, 6–9 anos), 800m (Infantis, 10–11 anos) e 1000m (Iniciados 12–13 anos e Juvenis 14–15 anos). Inscrição: 5 €. Obrigatório termo de responsabilidade assinado pelo encarregado de educação.",
    },
    en: {
      question: "How do the kids races work?",
      answer:
        "Kids races start at 16:00 with 3 distances: 300m (Benjamins, ages 6–9), 800m (Infantis, ages 10–11) and 1000m (Iniciados 12–13 and Juvenis 14–15). Registration: €5. Parental consent form required.",
    },
    es: {
      question: "¿Cómo funcionan las carreras de niños?",
      answer:
        "Las carreras de niños comienzan a las 16:00 con 3 distancias: 300m (Benjamines, 6–9 años), 800m (Infantiles, 10–11 años) y 1000m (Iniciados 12–13 e Juveniles 14–15). Inscripción: 5 €. Autorización parental obligatoria.",
    },
    fr: {
      question: "Comment fonctionnent les courses enfants ?",
      answer:
        "Les courses enfants débutent à 16h00 avec 3 distances : 300m (Benjamins, 6–9 ans), 800m (Infantiles, 10–11 ans) et 1000m (Iniciados 12–13 et Juvenis 14–15). Inscription : 5 €. Autorisation parentale obligatoire.",
    },
    de: {
      question: "Wie funktionieren die Kinderläufe?",
      answer:
        "Kinderläufe beginnen um 16:00 mit 3 Distanzen: 300m (Benjamins, 6–9 Jahre), 800m (Infantis, 10–11 Jahre) und 1000m (Iniciados 12–13 und Juvenis 14–15). Anmeldung: 5 €. Elterliche Einverständniserklärung erforderlich.",
    },
    it: {
      question: "Come funzionano le gare per bambini?",
      answer:
        "Le gare per bambini iniziano alle 16:00 con 3 distanze: 300m (Benjamins, 6–9 anni), 800m (Infantis, 10–11 anni) e 1000m (Iniciados 12–13 e Juvenis 14–15). Iscrizione: 5 €. Autorizzazione parentale obbligatoria.",
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
  console.log("✅ FAQ 3: Kids races");

  // ── FAQ 4: Mini meal ──
  const faq4 = await findOrCreateFAQ(
    event.id,
    4,
    "Há refeição disponível?",
    "Sim! Mini refeição disponível por 5 € — inclui 1 bifana, 1 sopa e 1 bebida. Igual para todas as distâncias."
  );

  const faq4Translations = {
    pt: {
      question: "Há refeição disponível?",
      answer:
        "Sim! Mini refeição disponível por 5 € — inclui 1 bifana, 1 sopa e 1 bebida. Igual para todas as distâncias.",
    },
    en: {
      question: "Is a meal available?",
      answer:
        "Yes! Mini meal available for €5 — includes 1 bifana (pork sandwich), 1 soup and 1 drink. Same for all distances.",
    },
    es: {
      question: "¿Hay comida disponible?",
      answer:
        "¡Sí! Mini comida disponible por 5 € — incluye 1 bifana, 1 sopa y 1 bebida. Igual para todas las distancias.",
    },
    fr: {
      question: "Y a-t-il un repas disponible ?",
      answer:
        "Oui ! Mini repas disponible pour 5 € — comprend 1 bifana, 1 soupe et 1 boisson. Identique pour toutes les distances.",
    },
    de: {
      question: "Gibt es eine Mahlzeit?",
      answer:
        "Ja! Mini-Mahlzeit für 5 € — enthält 1 Bifana, 1 Suppe und 1 Getränk. Gleich für alle Distanzen.",
    },
    it: {
      question: "È disponibile un pasto?",
      answer:
        "Sì! Mini pasto disponibile a 5 € — include 1 bifana, 1 zuppa e 1 bevanda. Uguale per tutte le distanze.",
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
  console.log("✅ FAQ 4: Mini meal");

  // ── FAQ 5: Prizes ──
  const faq5 = await findOrCreateFAQ(
    event.id,
    5,
    "Quais são os prémios?",
    "Corrida 14K: prémios simbólicos aos 3 primeiros classificados geral M/F e por escalão M/F. 3 primeiras equipas (mín. 4 atletas a finalizar, 3 melhores contam; desempate pelo 4º atleta). Os prémios das crianças são entregues às 17:00."
  );

  const faq5Translations = {
    pt: {
      question: "Quais são os prémios?",
      answer:
        "Corrida 14K: prémios simbólicos aos 3 primeiros classificados geral M/F e por escalão M/F. 3 primeiras equipas (mín. 4 atletas a finalizar, 3 melhores contam; desempate pelo 4º atleta). Os prémios das crianças são entregues às 17:00.",
    },
    en: {
      question: "What are the prizes?",
      answer:
        "14K Race: symbolic prizes for top 3 overall M/F and per age group M/F. Top 3 teams (min. 4 finishers, best 3 count; tiebreak by 4th athlete). Kids prizes awarded at 17:00.",
    },
    es: {
      question: "¿Cuáles son los premios?",
      answer:
        "Carrera 14K: premios simbólicos a los 3 primeros general M/F y por categoría M/F. 3 primeros equipos (mín. 4 atletas, 3 mejores cuentan; desempate por 4º atleta). Premios niños a las 17:00.",
    },
    fr: {
      question: "Quels sont les prix ?",
      answer:
        "Course 14K : prix symboliques aux 3 premiers général H/F et par catégorie H/F. 3 premières équipes (min. 4 finishers, 3 meilleurs comptent ; départage par le 4ème athlète). Prix enfants à 17h00.",
    },
    de: {
      question: "Welche Preise gibt es?",
      answer:
        "14K Lauf: symbolische Preise für Top 3 Gesamt M/W und pro Altersklasse M/W. Top 3 Mannschaften (min. 4 Finisher, 3 beste zählen; Tiebreak durch 4. Athlet). Kinderpreise um 17:00.",
    },
    it: {
      question: "Quali sono i premi?",
      answer:
        "Corsa 14K: premi simbolici ai 3 primi generale M/F e per fascia d'età M/F. 3 prime squadre (min. 4 finisher, 3 migliori contano; spareggio dal 4° atleta). Premi bambini alle 17:00.",
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
  console.log("✅ FAQ 5: Prizes");

  // ── FAQ 6: Contacts ──
  const faq6 = await findOrCreateFAQ(
    event.id,
    6,
    "Quais são os contactos da organização?",
    "Juventude Atlético Clube (J.A.C.). Telemóvel: 917 475 760. E-mail: jacdesporto@sapo.pt. Inscrições: www.acorrer.pt."
  );

  const faq6Translations = {
    pt: {
      question: "Quais são os contactos da organização?",
      answer:
        "Juventude Atlético Clube (J.A.C.). Telemóvel: 917 475 760. E-mail: jacdesporto@sapo.pt. Inscrições: www.acorrer.pt.",
    },
    en: {
      question: "What are the organization's contacts?",
      answer:
        "Juventude Atlético Clube (J.A.C.). Phone: +351 917 475 760. Email: jacdesporto@sapo.pt. Registrations: www.acorrer.pt.",
    },
    es: {
      question: "¿Cuáles son los contactos de la organización?",
      answer:
        "Juventude Atlético Clube (J.A.C.). Teléfono: 917 475 760. E-mail: jacdesporto@sapo.pt. Inscripciones: www.acorrer.pt.",
    },
    fr: {
      question: "Quels sont les contacts de l'organisation ?",
      answer:
        "Juventude Atlético Clube (J.A.C.). Tél : 917 475 760. E-mail : jacdesporto@sapo.pt. Inscriptions : www.acorrer.pt.",
    },
    de: {
      question: "Was sind die Kontaktdaten der Organisation?",
      answer:
        "Juventude Atlético Clube (J.A.C.). Telefon: 917 475 760. E-Mail: jacdesporto@sapo.pt. Anmeldung: www.acorrer.pt.",
    },
    it: {
      question: "Quali sono i contatti dell'organizzazione?",
      answer:
        "Juventude Atlético Clube (J.A.C.). Telefono: 917 475 760. E-mail: jacdesporto@sapo.pt. Iscrizioni: www.acorrer.pt.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq6.id, language: Language[lang] } },
      update: faq6Translations[lang],
      create: {
        faqId: faq6.id,
        language: Language[lang],
        ...faq6Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 6: Contacts");

  // ──────────────────────────────────────────────
  // Done
  // ──────────────────────────────────────────────
  console.log(`
🌙 7º Night Running Santiago do Cacém 2026 seed completed!
──────────────────────────────────────────────
- Slug: night-running-santiago-cacem-2026
- Date: March 28, 2026
- Location: Pavilhão J.A.C., Santiago do Cacém
- Variants: Kids 300m, Kids 800m, Kids 1000m, Corrida 14km, Caminhada 10km
- Pricing: 1 phase × 5 variants = 5 pricing phases
- FAQs: 7 with translations in 6 languages
- Night race — headlamp mandatory
- Limit: 500 participants
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
