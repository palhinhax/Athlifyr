/**
 * Seed: EPIC SANA Beach Run 2026
 *
 * Event: Beach run in Praia da Falésia, Albufeira, Algarve
 * Location: Praia da Falésia → EPIC SANA Algarve
 * Date: March 22, 2026
 * Organizer: Free Challenge + EPIC SANA Algarve
 * Sport: Running, Walking
 * Association: Associação de Atletismo do Algarve
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏖️ Seeding EPIC SANA Beach Run 2026...");

  // ──────────────────────────────────────────────
  // 1. Upsert Event
  // ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: "epic-sana-beach-run-2026" },
    update: {
      title: "EPIC SANA Beach Run 2026",
      description:
        "EPIC SANA Beach Run 2026 - Corrida e caminhada na Praia da Falésia, Albufeira",
      sportTypes: [SportType.RUNNING, SportType.WALKING],
      startDate: new Date("2026-03-22T10:00:00Z"),
      endDate: new Date("2026-03-22T12:00:00Z"),
      registrationDeadline: new Date("2026-03-16T23:59:00Z"),
      externalUrl: "https://www.freechallenge.pt/",
      imageUrl: "",
      city: "Albufeira",
      country: "Portugal",
      latitude: 37.0894,
      longitude: -8.1534,
      googleMapsUrl: "https://maps.google.com/?q=37.0894,-8.1534",
      isFeatured: false,
      cancelled: false,
    },
    create: {
      title: "EPIC SANA Beach Run 2026",
      slug: "epic-sana-beach-run-2026",
      description:
        "EPIC SANA Beach Run 2026 - Corrida e caminhada na Praia da Falésia, Albufeira",
      sportTypes: [SportType.RUNNING, SportType.WALKING],
      startDate: new Date("2026-03-22T10:00:00Z"),
      endDate: new Date("2026-03-22T12:00:00Z"),
      registrationDeadline: new Date("2026-03-16T23:59:00Z"),
      externalUrl: "https://www.freechallenge.pt/",
      imageUrl: "",
      city: "Albufeira",
      country: "Portugal",
      latitude: 37.0894,
      longitude: -8.1534,
      googleMapsUrl: "https://maps.google.com/?q=37.0894,-8.1534",
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
      title: "EPIC SANA Beach Run 2026",
      description: `# 🏖️ EPIC SANA Beach Run 2026

**A EPIC SANA Beach Run realiza-se a 22 de março de 2026 na Praia da Falésia, Albufeira!** Co-organização da **Free Challenge** e **EPIC SANA Algarve**. Parecer da **Associação de Atletismo do Algarve**.

Partida na **Praia da Falésia** e chegada no **EPIC SANA Algarve**. Percursos circulares junto à costa algarvia — uma experiência única de corrida na praia!

---

## 🏃 Provas

- **Corrida 10 km** – Partida 10:00 · Idade mín. 18 anos · Cutoff 2h
- **Caminhada 5 km** – Partida 10:00 · Menores acompanhados com termo de responsabilidade

---

## ⏰ Horário

**21 de Março:**
- 11:00 – 19:00 — Levantamento de dorsais (Centro de Congressos EPIC SANA Algarve)

**22 de Março:**
- 08:00 – 09:00 — Levantamento de dorsais
- 10:00 — Partida Corrida 10km + Caminhada 5km

---

## 🎽 A inscrição inclui

- Dorsal
- T-shirt técnica
- Brindes
- Seguro de acidentes pessoais
- Abastecimento no percurso (corrida)

---

## 🏆 Prémios

**Corrida 10km:** Medalhas e vales aos 3 primeiros classificados geral M/F. Medalhas aos 3 primeiros de cada escalão M/F.

---

## 📋 Escalões (Corrida 10km)

- Sénior (nascidos em 2006 e anteriores)
- Veterano I (35–39 anos) / Veterano II (40–44)
- Veterano III (45–49) / Veterano IV (50–54)
- Veterano V (55–59) / Veterano VI (60+)

---

## 📍 Inscrições limitadas a 300 participantes · Sem inscrições no dia da prova

🏖️ **Vem correr na Praia da Falésia!** 🏃`,
      city: "Albufeira",
      metaTitle:
        "EPIC SANA Beach Run 2026 | Praia da Falésia, Albufeira | 22 Março",
      metaDescription:
        "EPIC SANA Beach Run a 22 de março de 2026 na Praia da Falésia, Albufeira. Corrida 10km e Caminhada 5km. Co-organização Free Challenge e EPIC SANA Algarve.",
    },
    en: {
      title: "EPIC SANA Beach Run 2026",
      description: `# 🏖️ EPIC SANA Beach Run 2026

**The EPIC SANA Beach Run takes place on March 22, 2026 at Falésia Beach, Albufeira!** Co-organized by **Free Challenge** and **EPIC SANA Algarve**. Approved by the **Algarve Athletics Association**.

Start at **Falésia Beach** and finish at **EPIC SANA Algarve**. Circular courses along the Algarve coast — a unique beach running experience!

---

## 🏃 Races

- **10 km Race** – Start 10:00 · Min. age 18 · Cutoff 2h
- **5 km Walk** – Start 10:00 · Minors with parental consent

---

## ⏰ Schedule

**March 21:**
- 11:00 – 19:00 — Bib pickup (EPIC SANA Algarve Congress Centre)

**March 22:**
- 08:00 – 09:00 — Bib pickup
- 10:00 — Start 10km Race + 5km Walk

---

## 🎽 Registration includes

- Bib number
- Technical t-shirt
- Gifts
- Personal accident insurance
- Aid station on course (race)

---

## 🏆 Prizes

**10km Race:** Medals and vouchers for top 3 overall M/F. Medals for top 3 per age group M/F.

---

## 📍 Limited to 300 participants · No race-day registrations

🏖️ **Come run on Falésia Beach!** 🏃`,
      city: "Albufeira",
      metaTitle:
        "EPIC SANA Beach Run 2026 | Falésia Beach, Albufeira | March 22",
      metaDescription:
        "EPIC SANA Beach Run on March 22, 2026 at Falésia Beach, Albufeira. 10km Race and 5km Walk. Co-organized by Free Challenge and EPIC SANA Algarve.",
    },
    es: {
      title: "EPIC SANA Beach Run 2026",
      description: `# 🏖️ EPIC SANA Beach Run 2026

**La EPIC SANA Beach Run se celebra el 22 de marzo de 2026 en Praia da Falésia, Albufeira.** Co-organizada por **Free Challenge** y **EPIC SANA Algarve**. Aprobada por la **Asociación de Atletismo del Algarve**.

Salida en la **Praia da Falésia** y llegada al **EPIC SANA Algarve**. Recorridos circulares junto a la costa algarvia — ¡una experiencia única de carrera en la playa!

---

## 🏃 Pruebas

- **Carrera 10 km** – Salida 10:00 · Edad mín. 18 años · Límite 2h
- **Caminata 5 km** – Salida 10:00 · Menores con autorización parental

---

## 🎽 La inscripción incluye

- Dorsal, camiseta técnica, obsequios
- Seguro de accidentes
- Avituallamiento en el recorrido (carrera)

---

## 🏆 Premios

**Carrera 10km:** Medallas y vales a los 3 primeros general M/F. Medallas a los 3 primeros por categoría.

---

## 📍 Limitada a 300 participantes · Sin inscripciones el día de la prueba

🏖️ **¡Ven a correr en Praia da Falésia!** 🏃`,
      city: "Albufeira",
      metaTitle:
        "EPIC SANA Beach Run 2026 | Praia da Falésia, Albufeira | 22 Marzo",
      metaDescription:
        "EPIC SANA Beach Run el 22 de marzo de 2026 en Praia da Falésia, Albufeira. Carrera 10km y Caminata 5km. Co-organización Free Challenge y EPIC SANA Algarve.",
    },
    fr: {
      title: "EPIC SANA Beach Run 2026",
      description: `# 🏖️ EPIC SANA Beach Run 2026

**L'EPIC SANA Beach Run a lieu le 22 mars 2026 à Praia da Falésia, Albufeira !** Co-organisé par **Free Challenge** et **EPIC SANA Algarve**. Approuvé par l'**Association d'Athlétisme de l'Algarve**.

Départ à la **Praia da Falésia** et arrivée à l'**EPIC SANA Algarve**. Parcours circulaires le long de la côte — une expérience unique de course sur la plage !

---

## 🏃 Épreuves

- **Course 10 km** – Départ 10h00 · Âge min. 18 ans · Limite 2h
- **Randonnée 5 km** – Départ 10h00 · Mineurs avec autorisation parentale

---

## 🎽 L'inscription comprend

- Dossard, t-shirt technique, cadeaux
- Assurance accidents
- Ravitaillement sur le parcours (course)

---

## 🏆 Prix

**Course 10km :** Médailles et bons aux 3 premiers général H/F. Médailles aux 3 premiers par catégorie.

---

## 📍 Limitée à 300 participants · Pas d'inscriptions le jour de la course

🏖️ **Venez courir sur la Praia da Falésia !** 🏃`,
      city: "Albufeira",
      metaTitle:
        "EPIC SANA Beach Run 2026 | Praia da Falésia, Albufeira | 22 Mars",
      metaDescription:
        "EPIC SANA Beach Run le 22 mars 2026 à Praia da Falésia, Albufeira. Course 10km et Randonnée 5km. Co-organisation Free Challenge et EPIC SANA Algarve.",
    },
    de: {
      title: "EPIC SANA Beach Run 2026",
      description: `# 🏖️ EPIC SANA Beach Run 2026

**Der EPIC SANA Beach Run findet am 22. März 2026 am Praia da Falésia, Albufeira statt!** Gemeinsam organisiert von **Free Challenge** und **EPIC SANA Algarve**. Genehmigt vom **Leichtathletikverband der Algarve**.

Start am **Praia da Falésia** und Ziel am **EPIC SANA Algarve**. Rundkurse entlang der Algarve-Küste — ein einzigartiges Stranderlebnis!

---

## 🏃 Rennen

- **10 km Lauf** – Start 10:00 · Mindestalter 18 · Limit 2h
- **5 km Wanderung** – Start 10:00 · Minderjährige mit Einverständniserklärung

---

## 🎽 Anmeldung beinhaltet

- Startnummer, technisches T-Shirt, Geschenke
- Unfallversicherung
- Verpflegung auf der Strecke (Lauf)

---

## 🏆 Preise

**10km Lauf:** Medaillen und Gutscheine für Top 3 Gesamt M/W. Medaillen für Top 3 pro Altersklasse.

---

## 📍 Begrenzt auf 300 Teilnehmer · Keine Anmeldung am Veranstaltungstag

🏖️ **Komm und laufe am Praia da Falésia!** 🏃`,
      city: "Albufeira",
      metaTitle:
        "EPIC SANA Beach Run 2026 | Praia da Falésia, Albufeira | 22. März",
      metaDescription:
        "EPIC SANA Beach Run am 22. März 2026 am Praia da Falésia, Albufeira. 10km Lauf und 5km Wanderung. Free Challenge und EPIC SANA Algarve.",
    },
    it: {
      title: "EPIC SANA Beach Run 2026",
      description: `# 🏖️ EPIC SANA Beach Run 2026

**L'EPIC SANA Beach Run si svolge il 22 marzo 2026 a Praia da Falésia, Albufeira!** Co-organizzato da **Free Challenge** e **EPIC SANA Algarve**. Approvato dall'**Associazione di Atletica dell'Algarve**.

Partenza a **Praia da Falésia** e arrivo all'**EPIC SANA Algarve**. Percorsi circolari lungo la costa — un'esperienza unica di corsa sulla spiaggia!

---

## 🏃 Gare

- **Corsa 10 km** – Partenza 10:00 · Età min. 18 anni · Limite 2h
- **Camminata 5 km** – Partenza 10:00 · Minori con autorizzazione parentale

---

## 🎽 L'iscrizione include

- Pettorale, t-shirt tecnica, omaggi
- Assicurazione infortuni
- Rifornimento sul percorso (corsa)

---

## 🏆 Premi

**Corsa 10km:** Medaglie e buoni ai 3 primi generale M/F. Medaglie ai 3 primi per fascia d'età.

---

## 📍 Limitata a 300 partecipanti · Nessuna iscrizione il giorno della gara

🏖️ **Vieni a correre al Praia da Falésia!** 🏃`,
      city: "Albufeira",
      metaTitle:
        "EPIC SANA Beach Run 2026 | Praia da Falésia, Albufeira | 22 Marzo",
      metaDescription:
        "EPIC SANA Beach Run il 22 marzo 2026 a Praia da Falésia, Albufeira. Corsa 10km e Camminata 5km. Co-organizzazione Free Challenge e EPIC SANA Algarve.",
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
  const corrida = await findOrCreateVariant({
    name: "Corrida 10km",
    distanceKm: 10,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-03-22T10:00:00Z"),
    startTime: "10:00",
    cutoffTimeHours: 2,
    price: 9.5,
    currency: Currency.EUR,
    maxParticipants: 300,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Corrida 10 km · Praia da Falésia → EPIC SANA Algarve · Cutoff 2h · Idade mín. 18 anos",
  });
  console.log(`✅ Variant: ${corrida.name}`);

  // ── Variant 2: Caminhada 5km ──
  const caminhada = await findOrCreateVariant({
    name: "Caminhada 5km",
    distanceKm: 5,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-03-22T10:00:00Z"),
    startTime: "10:00",
    cutoffTimeHours: null,
    price: 7.5,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Caminhada 5 km · Praia da Falésia → EPIC SANA Algarve",
  });
  console.log(`✅ Variant: ${caminhada.name}`);

  // ── Variant Translations (ALL 6 languages) ──
  const variantTranslations: Record<
    string,
    Record<string, { name: string; description: string | null }>
  > = {
    corrida: {
      pt: {
        name: "Corrida 10km",
        description:
          "Corrida 10 km · Praia da Falésia → EPIC SANA Algarve · Cutoff 2h · Idade mín. 18 anos",
      },
      en: {
        name: "10km Race",
        description:
          "10 km Race · Falésia Beach → EPIC SANA Algarve · Cutoff 2h · Min. age 18",
      },
      es: {
        name: "Carrera 10km",
        description:
          "Carrera 10 km · Praia da Falésia → EPIC SANA Algarve · Límite 2h · Edad mín. 18 años",
      },
      fr: {
        name: "Course 10km",
        description:
          "Course 10 km · Praia da Falésia → EPIC SANA Algarve · Limite 2h · Âge min. 18 ans",
      },
      de: {
        name: "10km Lauf",
        description:
          "10 km Lauf · Praia da Falésia → EPIC SANA Algarve · Limit 2h · Mindestalter 18",
      },
      it: {
        name: "Corsa 10km",
        description:
          "Corsa 10 km · Praia da Falésia → EPIC SANA Algarve · Limite 2h · Età min. 18 anni",
      },
    },
    caminhada: {
      pt: {
        name: "Caminhada 5km",
        description: "Caminhada 5 km · Praia da Falésia → EPIC SANA Algarve",
      },
      en: {
        name: "5km Walk",
        description: "5 km Walk · Falésia Beach → EPIC SANA Algarve",
      },
      es: {
        name: "Caminata 5km",
        description: "Caminata 5 km · Praia da Falésia → EPIC SANA Algarve",
      },
      fr: {
        name: "Randonnée 5km",
        description: "Randonnée 5 km · Praia da Falésia → EPIC SANA Algarve",
      },
      de: {
        name: "5km Wanderung",
        description: "5 km Wanderung · Praia da Falésia → EPIC SANA Algarve",
      },
      it: {
        name: "Camminata 5km",
        description: "Camminata 5 km · Praia da Falésia → EPIC SANA Algarve",
      },
    },
  };

  const variantMap = [
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

  const pricingStart = new Date("2025-12-01T00:00:00Z");
  const pricingDeadline = new Date("2026-03-16T23:59:59Z");

  await findOrCreatePricingPhase("Corrida 10km - Inscrição", corrida.id, {
    startDate: pricingStart,
    endDate: pricingDeadline,
    price: 9.5,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Caminhada 5km - Inscrição", caminhada.id, {
    startDate: pricingStart,
    endDate: pricingDeadline,
    price: 7.5,
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
    "21 março: 11:00–19:00 — Levantamento de dorsais (Centro de Congressos EPIC SANA Algarve). 22 março: 08:00–09:00 — Levantamento de dorsais. 10:00 — Partida Corrida 10km + Caminhada 5km."
  );

  const faq0Translations = {
    pt: {
      question: "Qual é o horário do evento?",
      answer:
        "21 março: 11:00–19:00 — Levantamento de dorsais (Centro de Congressos EPIC SANA Algarve). 22 março: 08:00–09:00 — Levantamento de dorsais. 10:00 — Partida Corrida 10km + Caminhada 5km.",
    },
    en: {
      question: "What is the event schedule?",
      answer:
        "March 21: 11:00–19:00 — Bib pickup (EPIC SANA Algarve Congress Centre). March 22: 08:00–09:00 — Bib pickup. 10:00 — Start 10km Race + 5km Walk.",
    },
    es: {
      question: "¿Cuál es el horario del evento?",
      answer:
        "21 marzo: 11:00–19:00 — Recogida de dorsales (Centro de Congresos EPIC SANA Algarve). 22 marzo: 08:00–09:00 — Recogida de dorsales. 10:00 — Salida Carrera 10km + Caminata 5km.",
    },
    fr: {
      question: "Quel est le programme de l'événement ?",
      answer:
        "21 mars : 11h00–19h00 — Retrait des dossards (Centre de Congrès EPIC SANA Algarve). 22 mars : 08h00–09h00 — Retrait des dossards. 10h00 — Départ Course 10km + Randonnée 5km.",
    },
    de: {
      question: "Wie ist der Zeitplan der Veranstaltung?",
      answer:
        "21. März: 11:00–19:00 — Startnummernausgabe (EPIC SANA Algarve Kongresszentrum). 22. März: 08:00–09:00 — Startnummernausgabe. 10:00 — Start 10km Lauf + 5km Wanderung.",
    },
    it: {
      question: "Qual è il programma dell'evento?",
      answer:
        "21 marzo: 11:00–19:00 — Ritiro pettorali (Centro Congressi EPIC SANA Algarve). 22 marzo: 08:00–09:00 — Ritiro pettorali. 10:00 — Partenza Corsa 10km + Camminata 5km.",
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
    "Dorsal, T-shirt técnica, brindes, seguro de acidentes pessoais e abastecimento no percurso (corrida). Os atletas devem trazer os seus alfinetes ou porta-dorsais."
  );

  const faq1Translations = {
    pt: {
      question: "O que está incluído na inscrição?",
      answer:
        "Dorsal, T-shirt técnica, brindes, seguro de acidentes pessoais e abastecimento no percurso (corrida). Os atletas devem trazer os seus alfinetes ou porta-dorsais.",
    },
    en: {
      question: "What is included in the registration?",
      answer:
        "Bib number, technical t-shirt, gifts, personal accident insurance and aid station on course (race). Athletes must bring their own pins or bib holders.",
    },
    es: {
      question: "¿Qué incluye la inscripción?",
      answer:
        "Dorsal, camiseta técnica, obsequios, seguro de accidentes y avituallamiento en el recorrido (carrera). Los atletas deben traer sus imperdibles o portadorsales.",
    },
    fr: {
      question: "Que comprend l'inscription ?",
      answer:
        "Dossard, t-shirt technique, cadeaux, assurance accidents et ravitaillement sur le parcours (course). Les athlètes doivent apporter leurs épingles ou porte-dossards.",
    },
    de: {
      question: "Was ist in der Anmeldung enthalten?",
      answer:
        "Startnummer, technisches T-Shirt, Geschenke, Unfallversicherung und Verpflegung auf der Strecke (Lauf). Athleten müssen eigene Nadeln oder Startnummernhalter mitbringen.",
    },
    it: {
      question: "Cosa è incluso nell'iscrizione?",
      answer:
        "Pettorale, t-shirt tecnica, omaggi, assicurazione infortuni e rifornimento sul percorso (corsa). Gli atleti devono portare le proprie spille o porta-pettorali.",
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

  // ── FAQ 2: Prizes ──
  const faq2 = await findOrCreateFAQ(
    event.id,
    2,
    "Quais são os prémios?",
    "Corrida 10km: medalhas e vales aos 3 primeiros classificados geral M/F. Medalhas aos 3 primeiros de cada escalão M/F. Escalões: Sénior (nascidos 2006 e anteriores), Vet. I (35–39), Vet. II (40–44), Vet. III (45–49), Vet. IV (50–54), Vet. V (55–59), Vet. VI (60+)."
  );

  const faq2Translations = {
    pt: {
      question: "Quais são os prémios?",
      answer:
        "Corrida 10km: medalhas e vales aos 3 primeiros classificados geral M/F. Medalhas aos 3 primeiros de cada escalão M/F. Escalões: Sénior (nascidos 2006 e anteriores), Vet. I (35–39), Vet. II (40–44), Vet. III (45–49), Vet. IV (50–54), Vet. V (55–59), Vet. VI (60+).",
    },
    en: {
      question: "What are the prizes?",
      answer:
        "10km Race: medals and vouchers for top 3 overall M/F. Medals for top 3 per age group M/F. Age groups: Senior (born 2006 and earlier), Vet. I (35–39), Vet. II (40–44), Vet. III (45–49), Vet. IV (50–54), Vet. V (55–59), Vet. VI (60+).",
    },
    es: {
      question: "¿Cuáles son los premios?",
      answer:
        "Carrera 10km: medallas y vales a los 3 primeros general M/F. Medallas a los 3 primeros por categoría M/F. Categorías: Sénior (nacidos 2006 y anteriores), Vet. I (35–39), Vet. II (40–44), Vet. III (45–49), Vet. IV (50–54), Vet. V (55–59), Vet. VI (60+).",
    },
    fr: {
      question: "Quels sont les prix ?",
      answer:
        "Course 10km : médailles et bons aux 3 premiers général H/F. Médailles aux 3 premiers par catégorie H/F. Catégories : Sénior (nés 2006 et avant), Vét. I (35–39), Vét. II (40–44), Vét. III (45–49), Vét. IV (50–54), Vét. V (55–59), Vét. VI (60+).",
    },
    de: {
      question: "Welche Preise gibt es?",
      answer:
        "10km Lauf: Medaillen und Gutscheine für Top 3 Gesamt M/W. Medaillen für Top 3 pro Altersklasse M/W. Altersklassen: Senior (geb. 2006 und früher), Vet. I (35–39), Vet. II (40–44), Vet. III (45–49), Vet. IV (50–54), Vet. V (55–59), Vet. VI (60+).",
    },
    it: {
      question: "Quali sono i premi?",
      answer:
        "Corsa 10km: medaglie e buoni ai 3 primi generale M/F. Medaglie ai 3 primi per fascia d'età M/F. Fasce d'età: Senior (nati 2006 e precedenti), Vet. I (35–39), Vet. II (40–44), Vet. III (45–49), Vet. IV (50–54), Vet. V (55–59), Vet. VI (60+).",
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
  console.log("✅ FAQ 2: Prizes");

  // ── FAQ 3: Course ──
  const faq3 = await findOrCreateFAQ(
    event.id,
    3,
    "Como é o percurso?",
    "Partida na Praia da Falésia e chegada no EPIC SANA Algarve. Percursos circulares: 1 volta de 5 km (caminhada) e 10 km (corrida). O controlo de chegada encerra 2h após a partida."
  );

  const faq3Translations = {
    pt: {
      question: "Como é o percurso?",
      answer:
        "Partida na Praia da Falésia e chegada no EPIC SANA Algarve. Percursos circulares: 1 volta de 5 km (caminhada) e 10 km (corrida). O controlo de chegada encerra 2h após a partida.",
    },
    en: {
      question: "What is the course like?",
      answer:
        "Start at Falésia Beach and finish at EPIC SANA Algarve. Circular courses: 1 loop of 5 km (walk) and 10 km (race). Finish control closes 2h after start.",
    },
    es: {
      question: "¿Cómo es el recorrido?",
      answer:
        "Salida en Praia da Falésia y llegada al EPIC SANA Algarve. Recorridos circulares: 1 vuelta de 5 km (caminata) y 10 km (carrera). El control de llegada cierra 2h después de la salida.",
    },
    fr: {
      question: "Comment est le parcours ?",
      answer:
        "Départ à Praia da Falésia et arrivée à l'EPIC SANA Algarve. Parcours circulaires : 1 boucle de 5 km (randonnée) et 10 km (course). Le contrôle d'arrivée ferme 2h après le départ.",
    },
    de: {
      question: "Wie ist die Strecke?",
      answer:
        "Start am Praia da Falésia und Ziel am EPIC SANA Algarve. Rundkurse: 1 Runde von 5 km (Wanderung) und 10 km (Lauf). Zielkontrolle schließt 2h nach Start.",
    },
    it: {
      question: "Com'è il percorso?",
      answer:
        "Partenza a Praia da Falésia e arrivo all'EPIC SANA Algarve. Percorsi circolari: 1 giro di 5 km (camminata) e 10 km (corsa). Il controllo d'arrivo chiude 2h dopo la partenza.",
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
  console.log("✅ FAQ 3: Course");

  // ── FAQ 4: Registration limits ──
  const faq4 = await findOrCreateFAQ(
    event.id,
    4,
    "Há limite de inscrições?",
    "Sim, inscrições limitadas a 300 participantes. Não haverá inscrições no dia da prova. Inscrições até 16 de março de 2026 em www.freechallenge.pt."
  );

  const faq4Translations = {
    pt: {
      question: "Há limite de inscrições?",
      answer:
        "Sim, inscrições limitadas a 300 participantes. Não haverá inscrições no dia da prova. Inscrições até 16 de março de 2026 em www.freechallenge.pt.",
    },
    en: {
      question: "Is there a registration limit?",
      answer:
        "Yes, limited to 300 participants. No race-day registrations. Sign up by March 16, 2026 at www.freechallenge.pt.",
    },
    es: {
      question: "¿Hay límite de inscripciones?",
      answer:
        "Sí, limitada a 300 participantes. No habrá inscripciones el día de la prueba. Inscripciones hasta el 16 de marzo de 2026 en www.freechallenge.pt.",
    },
    fr: {
      question: "Y a-t-il une limite d'inscriptions ?",
      answer:
        "Oui, limitées à 300 participants. Pas d'inscriptions le jour de la course. Inscriptions jusqu'au 16 mars 2026 sur www.freechallenge.pt.",
    },
    de: {
      question: "Gibt es ein Anmeldelimit?",
      answer:
        "Ja, begrenzt auf 300 Teilnehmer. Keine Anmeldung am Veranstaltungstag. Anmeldung bis 16. März 2026 unter www.freechallenge.pt.",
    },
    it: {
      question: "C'è un limite di iscrizioni?",
      answer:
        "Sì, limitate a 300 partecipanti. Nessuna iscrizione il giorno della gara. Iscrizioni fino al 16 marzo 2026 su www.freechallenge.pt.",
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
  console.log("✅ FAQ 4: Registration limits");

  // ── FAQ 5: Contacts ──
  const faq5 = await findOrCreateFAQ(
    event.id,
    5,
    "Quais são os contactos da organização?",
    "Co-organização: Free Challenge e EPIC SANA Algarve. Telemóvel: 928 390 206. Site: www.freechallenge.pt."
  );

  const faq5Translations = {
    pt: {
      question: "Quais são os contactos da organização?",
      answer:
        "Co-organização: Free Challenge e EPIC SANA Algarve. Telemóvel: 928 390 206. Site: www.freechallenge.pt.",
    },
    en: {
      question: "What are the organization's contacts?",
      answer:
        "Co-organized by: Free Challenge and EPIC SANA Algarve. Phone: +351 928 390 206. Website: www.freechallenge.pt.",
    },
    es: {
      question: "¿Cuáles son los contactos de la organización?",
      answer:
        "Co-organización: Free Challenge y EPIC SANA Algarve. Teléfono: 928 390 206. Web: www.freechallenge.pt.",
    },
    fr: {
      question: "Quels sont les contacts de l'organisation ?",
      answer:
        "Co-organisation : Free Challenge et EPIC SANA Algarve. Tél : 928 390 206. Site : www.freechallenge.pt.",
    },
    de: {
      question: "Was sind die Kontaktdaten der Organisation?",
      answer:
        "Gemeinsam organisiert von: Free Challenge und EPIC SANA Algarve. Telefon: 928 390 206. Website: www.freechallenge.pt.",
    },
    it: {
      question: "Quali sono i contatti dell'organizzazione?",
      answer:
        "Co-organizzazione: Free Challenge e EPIC SANA Algarve. Telefono: 928 390 206. Sito: www.freechallenge.pt.",
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
🏖️ EPIC SANA Beach Run 2026 seed completed!
──────────────────────────────────────────────
- Slug: epic-sana-beach-run-2026
- Date: March 22, 2026
- Location: Praia da Falésia → EPIC SANA Algarve, Albufeira
- Variants: Corrida 10km (9,50€), Caminhada 5km (7,50€)
- Pricing: 1 phase × 2 variants = 2 pricing phases
- FAQs: 6 with translations in 6 languages
- Limit: 300 participants
- Cutoff: 2h (corrida)
- Association: Associação de Atletismo do Algarve
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
