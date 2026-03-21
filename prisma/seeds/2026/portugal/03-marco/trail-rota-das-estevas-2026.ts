/**
 * Seed: III Trail Rota das Estevas 2026
 *
 * Event: Trail running in Alte, Loulé, Algarve
 * Location: Sede do Grupo Desportivo Serrano, Monte Ruivo, Alte
 * Date: March 29, 2026
 * Organizer: Grupo Desportivo Serrano (+ CM Loulé + JF Alte)
 * Sport: Trail, Running, Walking
 * Association: Associação de Atletismo do Algarve
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌿 Seeding III Trail Rota das Estevas 2026...");

  // ──────────────────────────────────────────────
  // 1. Upsert Event
  // ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: "trail-rota-das-estevas-2026" },
    update: {
      title: "III Trail Rota das Estevas 2026",
      description:
        "III Trail Rota das Estevas 2026 - Trail em Alte, Loulé, Algarve",
      sportTypes: [SportType.TRAIL, SportType.RUNNING, SportType.WALKING],
      startDate: new Date("2026-03-29T06:45:00Z"),
      endDate: new Date("2026-03-29T16:00:00Z"),
      registrationDeadline: new Date("2026-03-23T23:59:00Z"),
      externalUrl: "https://www.acorrer.pt",
      imageUrl: "",
      city: "Loulé",
      country: "Portugal",
      latitude: 37.2366,
      longitude: -8.1728,
      googleMapsUrl: "https://maps.google.com/?q=37.2366,-8.1728",
      isFeatured: false,
      cancelled: false,
    },
    create: {
      title: "III Trail Rota das Estevas 2026",
      slug: "trail-rota-das-estevas-2026",
      description:
        "III Trail Rota das Estevas 2026 - Trail em Alte, Loulé, Algarve",
      sportTypes: [SportType.TRAIL, SportType.RUNNING, SportType.WALKING],
      startDate: new Date("2026-03-29T06:45:00Z"),
      endDate: new Date("2026-03-29T16:00:00Z"),
      registrationDeadline: new Date("2026-03-23T23:59:00Z"),
      externalUrl: "https://www.acorrer.pt",
      imageUrl: "",
      city: "Loulé",
      country: "Portugal",
      latitude: 37.2366,
      longitude: -8.1728,
      googleMapsUrl: "https://maps.google.com/?q=37.2366,-8.1728",
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
      title: "III Trail Rota das Estevas 2026",
      description: `# 🌿 III Trail Rota das Estevas 2026

**A 3ª edição do Trail Rota das Estevas realiza-se a 29 de março de 2026 em Alte, Loulé, Algarve!** Organizado pelo **Grupo Desportivo Serrano** em colaboração com a **Câmara Municipal de Loulé** e a **Junta de Freguesia de Alte**. Parecer da **Associação de Atletismo do Algarve**.

Partida e chegada na **sede do Grupo Desportivo Serrano** (Monte Ruivo, Alte). Percursos por trilhos e caminhos do concelho de Loulé, com dificuldade média/alta.

Prova em regime de **semi-autossuficiência** — não há copos nos abastecimentos. Cada atleta deve trazer o seu recipiente (mínimo 0,5L).

---

## 🏔️ Provas

- **Trail** – ±36 km · D+1900m · Partida 08:00 · Cutoff 8h · Idade mín. 18 anos
- **Trail Sprint** – ±20 km · D+960m · Partida 08:30 · Cutoff 4h · Idade mín. 18 anos
- **Mini Trail** – ±11 km · D+460m · Partida 09:00 · Sem limite de tempo · Idade mín. 16 anos
- **Caminhada** – ±7 km · D+130m · Partida 09:10 · Idade mín. 14 anos

---

## ⏰ Horário

**27–28 de Março:**
- 10:00 – 22:00 — Levantamento de dorsais na Decathlon Albufeira

**29 de Março:**
- 06:45 — Abertura do secretariado (Sede GD Serrano)
- 07:50 — Briefing Trail
- 08:00 — Partida Trail (36km)
- 08:20 — Briefing Trail Sprint
- 08:30 — Partida Trail Sprint (20km)
- 08:45 — Encerramento do secretariado
- 08:50 — Briefing Mini Trail
- 09:00 — Partida Mini Trail (11km)
- 09:05 — Briefing Caminhada
- 09:10 — Partida Caminhada (7km)
- 12:30 — Entrega de prémios

---

## 🎽 A inscrição inclui

- Dorsal e T-shirt do evento
- Gola
- Seguro de acidentes pessoais
- Abastecimentos sólidos e líquidos
- 1 bebida + 1 bifana
- Brinde finisher
- Banhos

---

## 🏆 Prémios

**Trail e Trail Sprint:** Prémios aos 3 primeiros geral e por escalão M/F. 3 primeiras equipas.
**Mini Trail:** Prémios aos 3 primeiros M/F.
**Strava:** Prémios para 1º M/F em segmentos cronometrados.

---

## ⚠️ Material obrigatório (todas as provas)

Dorsal visível, telemóvel carregado, apito, manta térmica, reservatório de líquidos (mín. 0,5L), recipiente para bebidas.

---

🌿 **Vem descobrir a Rota das Estevas no coração do Algarve!** 🏔️`,
      city: "Loulé",
      metaTitle: "III Trail Rota das Estevas 2026 | Alte, Loulé | 29 Março",
      metaDescription:
        "III Trail Rota das Estevas a 29 de março de 2026 em Alte, Loulé. Trail 36km D+1900m, Trail Sprint 20km D+960m, Mini Trail 11km e Caminhada 7km. Associação de Atletismo do Algarve.",
    },
    en: {
      title: "3rd Trail Rota das Estevas 2026",
      description: `# 🌿 3rd Trail Rota das Estevas 2026

**The 3rd edition of Trail Rota das Estevas takes place on March 29, 2026 in Alte, Loulé, Algarve!** Organized by **Grupo Desportivo Serrano** in collaboration with **Loulé Municipality** and **Alte Parish Council**. Approved by the **Algarve Athletics Association**.

Start and finish at the **GD Serrano headquarters** (Monte Ruivo, Alte). Courses through trails and paths in the Loulé municipality, with medium/high difficulty.

Semi self-sufficiency race — no cups at aid stations. Each athlete must bring their own container (minimum 0.5L).

---

## 🏔️ Races

- **Trail** – ±36 km · D+1900m · Start 08:00 · Cutoff 8h · Min. age 18
- **Trail Sprint** – ±20 km · D+960m · Start 08:30 · Cutoff 4h · Min. age 18
- **Mini Trail** – ±11 km · D+460m · Start 09:00 · No time limit · Min. age 16
- **Walk** – ±7 km · D+130m · Start 09:10 · Min. age 14

---

## ⏰ Schedule

**March 27–28:**
- 10:00 – 22:00 — Bib pickup at Decathlon Albufeira

**March 29:**
- 06:45 — Registration opens (GD Serrano HQ)
- 07:50 — Trail briefing
- 08:00 — Trail start (36km)
- 08:20 — Trail Sprint briefing
- 08:30 — Trail Sprint start (20km)
- 08:45 — Registration closes
- 08:50 — Mini Trail briefing
- 09:00 — Mini Trail start (11km)
- 09:05 — Walk briefing
- 09:10 — Walk start (7km)
- 12:30 — Prize ceremony

---

## 🎽 Registration includes

- Bib number and event t-shirt
- Neck gaiter
- Personal accident insurance
- Solid and liquid aid stations
- 1 drink + 1 bifana (pork sandwich)
- Finisher gift
- Showers

---

## 🏆 Prizes

**Trail & Trail Sprint:** Top 3 overall and per age group M/F. Top 3 teams.
**Mini Trail:** Top 3 M/F.
**Strava:** Prizes for 1st M/F in timed segments.

---

## ⚠️ Mandatory equipment (all races)

Visible bib, charged mobile phone, whistle, thermal blanket, liquid reservoir (min. 0.5L), drinking container.

---

🌿 **Come discover the Estevas Route in the heart of the Algarve!** 🏔️`,
      city: "Loulé",
      metaTitle: "3rd Trail Rota das Estevas 2026 | Alte, Loulé | March 29",
      metaDescription:
        "3rd Trail Rota das Estevas on March 29, 2026 in Alte, Loulé. Trail 36km D+1900m, Trail Sprint 20km D+960m, Mini Trail 11km and Walk 7km. Algarve Athletics Association.",
    },
    es: {
      title: "III Trail Rota das Estevas 2026",
      description: `# 🌿 III Trail Rota das Estevas 2026

**La 3ª edición del Trail Rota das Estevas se celebra el 29 de marzo de 2026 en Alte, Loulé, Algarve.** Organizado por el **Grupo Desportivo Serrano** en colaboración con el **Ayuntamiento de Loulé** y la **Junta de Freguesia de Alte**. Aprobado por la **Asociación de Atletismo del Algarve**.

Salida y llegada en la **sede del GD Serrano** (Monte Ruivo, Alte). Recorridos por senderos y caminos del municipio de Loulé, con dificultad media/alta.

Prueba en semi-autosuficiencia — no hay vasos en los avituallamientos. Cada atleta debe traer su recipiente (mín. 0,5L).

---

## 🏔️ Pruebas

- **Trail** – ±36 km · D+1900m · Salida 08:00 · Límite 8h · Edad mín. 18 años
- **Trail Sprint** – ±20 km · D+960m · Salida 08:30 · Límite 4h · Edad mín. 18 años
- **Mini Trail** – ±11 km · D+460m · Salida 09:00 · Sin límite · Edad mín. 16 años
- **Caminata** – ±7 km · D+130m · Salida 09:10 · Edad mín. 14 años

---

## 🎽 La inscripción incluye

- Dorsal y camiseta del evento
- Braga de cuello
- Seguro de accidentes personal
- Avituallamientos sólidos y líquidos
- 1 bebida + 1 bifana
- Obsequio finisher
- Duchas

---

## 🏆 Premios

**Trail y Trail Sprint:** Premios a los 3 primeros general y por categoría M/F. 3 primeros equipos.
**Mini Trail:** Premios a los 3 primeros M/F.
**Strava:** Premios para 1º M/F en segmentos cronometrados.

---

🌿 **¡Ven a descubrir la Ruta de las Jaras en el corazón del Algarve!** 🏔️`,
      city: "Loulé",
      metaTitle: "III Trail Rota das Estevas 2026 | Alte, Loulé | 29 Marzo",
      metaDescription:
        "III Trail Rota das Estevas el 29 de marzo de 2026 en Alte, Loulé. Trail 36km D+1900m, Trail Sprint 20km D+960m, Mini Trail 11km y Caminata 7km. Asociación de Atletismo del Algarve.",
    },
    fr: {
      title: "3ème Trail Rota das Estevas 2026",
      description: `# 🌿 3ème Trail Rota das Estevas 2026

**La 3ème édition du Trail Rota das Estevas a lieu le 29 mars 2026 à Alte, Loulé, Algarve !** Organisé par le **Grupo Desportivo Serrano** en collaboration avec la **Mairie de Loulé** et la **Junta de Freguesia de Alte**. Approuvé par l'**Association d'Athlétisme de l'Algarve**.

Départ et arrivée au **siège du GD Serrano** (Monte Ruivo, Alte). Parcours à travers sentiers et chemins de la commune de Loulé, avec difficulté moyenne/élevée.

Course en semi-autosuffisance — pas de gobelets aux ravitaillements. Chaque athlète doit apporter son récipient (min. 0,5L).

---

## 🏔️ Épreuves

- **Trail** – ±36 km · D+1900m · Départ 08h00 · Limite 8h · Âge min. 18 ans
- **Trail Sprint** – ±20 km · D+960m · Départ 08h30 · Limite 4h · Âge min. 18 ans
- **Mini Trail** – ±11 km · D+460m · Départ 09h00 · Sans limite · Âge min. 16 ans
- **Randonnée** – ±7 km · D+130m · Départ 09h10 · Âge min. 14 ans

---

## 🎽 L'inscription comprend

- Dossard et t-shirt de l'événement
- Tour de cou
- Assurance accidents personnels
- Ravitaillements solides et liquides
- 1 boisson + 1 bifana
- Cadeau finisher
- Douches

---

## 🏆 Prix

**Trail et Trail Sprint :** Prix aux 3 premiers général et par catégorie H/F. 3 premières équipes.
**Mini Trail :** Prix aux 3 premiers H/F.
**Strava :** Prix pour 1er H/F sur segments chronométrés.

---

🌿 **Venez découvrir la Route des Cistes au cœur de l'Algarve !** 🏔️`,
      city: "Loulé",
      metaTitle: "3ème Trail Rota das Estevas 2026 | Alte, Loulé | 29 Mars",
      metaDescription:
        "3ème Trail Rota das Estevas le 29 mars 2026 à Alte, Loulé. Trail 36km D+1900m, Trail Sprint 20km D+960m, Mini Trail 11km et Randonnée 7km. Association d'Athlétisme de l'Algarve.",
    },
    de: {
      title: "3. Trail Rota das Estevas 2026",
      description: `# 🌿 3. Trail Rota das Estevas 2026

**Die 3. Ausgabe des Trail Rota das Estevas findet am 29. März 2026 in Alte, Loulé, Algarve statt!** Organisiert vom **Grupo Desportivo Serrano** in Zusammenarbeit mit der **Gemeinde Loulé** und der **Junta de Freguesia de Alte**. Genehmigt vom **Leichtathletikverband der Algarve**.

Start und Ziel am **Sitz des GD Serrano** (Monte Ruivo, Alte). Strecken über Pfade und Wege der Gemeinde Loulé, mit mittlerem/hohem Schwierigkeitsgrad.

Halbautarkes Rennen — keine Becher an Verpflegungsstationen. Jeder Athlet muss seinen eigenen Behälter mitbringen (min. 0,5L).

---

## 🏔️ Rennen

- **Trail** – ±36 km · D+1900m · Start 08:00 · Limit 8h · Mindestalter 18
- **Trail Sprint** – ±20 km · D+960m · Start 08:30 · Limit 4h · Mindestalter 18
- **Mini Trail** – ±11 km · D+460m · Start 09:00 · Kein Zeitlimit · Mindestalter 16
- **Wanderung** – ±7 km · D+130m · Start 09:10 · Mindestalter 14

---

## 🎽 Die Anmeldung beinhaltet

- Startnummer und Event-T-Shirt
- Halstuch
- Unfallversicherung
- Feste und flüssige Verpflegung
- 1 Getränk + 1 Bifana
- Finisher-Geschenk
- Duschen

---

## 🏆 Preise

**Trail und Trail Sprint:** Preise für Top 3 Gesamtwertung und pro Altersklasse M/W. Top 3 Mannschaften.
**Mini Trail:** Preise für Top 3 M/W.
**Strava:** Preise für 1. M/W in Zeitsegmenten.

---

🌿 **Komm und entdecke die Estevas-Route im Herzen der Algarve!** 🏔️`,
      city: "Loulé",
      metaTitle: "3. Trail Rota das Estevas 2026 | Alte, Loulé | 29. März",
      metaDescription:
        "3. Trail Rota das Estevas am 29. März 2026 in Alte, Loulé. Trail 36km D+1900m, Trail Sprint 20km D+960m, Mini Trail 11km und Wanderung 7km. Leichtathletikverband der Algarve.",
    },
    it: {
      title: "3° Trail Rota das Estevas 2026",
      description: `# 🌿 3° Trail Rota das Estevas 2026

**La 3ª edizione del Trail Rota das Estevas si svolge il 29 marzo 2026 ad Alte, Loulé, Algarve!** Organizzato dal **Grupo Desportivo Serrano** in collaborazione con il **Comune di Loulé** e la **Junta de Freguesia de Alte**. Approvato dall'**Associazione di Atletica dell'Algarve**.

Partenza e arrivo alla **sede del GD Serrano** (Monte Ruivo, Alte). Percorsi attraverso sentieri e strade del comune di Loulé, con difficoltà media/alta.

Gara in semi-autosufficienza — niente bicchieri ai rifornimenti. Ogni atleta deve portare il proprio contenitore (min. 0,5L).

---

## 🏔️ Gare

- **Trail** – ±36 km · D+1900m · Partenza 08:00 · Limite 8h · Età min. 18 anni
- **Trail Sprint** – ±20 km · D+960m · Partenza 08:30 · Limite 4h · Età min. 18 anni
- **Mini Trail** – ±11 km · D+460m · Partenza 09:00 · Senza limite · Età min. 16 anni
- **Camminata** – ±7 km · D+130m · Partenza 09:10 · Età min. 14 anni

---

## 🎽 L'iscrizione include

- Pettorale e t-shirt dell'evento
- Scaldacollo
- Assicurazione infortuni
- Rifornimenti solidi e liquidi
- 1 bevanda + 1 bifana
- Regalo finisher
- Docce

---

## 🏆 Premi

**Trail e Trail Sprint:** Premi ai 3 primi generale e per fascia d'età M/F. 3 prime squadre.
**Mini Trail:** Premi ai 3 primi M/F.
**Strava:** Premi per 1° M/F in segmenti cronometrati.

---

🌿 **Vieni a scoprire la Rotta delle Estevas nel cuore dell'Algarve!** 🏔️`,
      city: "Loulé",
      metaTitle: "3° Trail Rota das Estevas 2026 | Alte, Loulé | 29 Marzo",
      metaDescription:
        "3° Trail Rota das Estevas il 29 marzo 2026 ad Alte, Loulé. Trail 36km D+1900m, Trail Sprint 20km D+960m, Mini Trail 11km e Camminata 7km. Associazione di Atletica dell'Algarve.",
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

  // ── Variant 1: Trail (±36 km) ──
  const trail = await findOrCreateVariant({
    name: "Trail",
    distanceKm: 36,
    elevationGainM: 1900,
    elevationLossM: 1900,
    startDate: new Date("2026-03-29T08:00:00Z"),
    startTime: "08:00",
    cutoffTimeHours: 8,
    price: 28.0,
    currency: Currency.EUR,
    maxParticipants: 150,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Trail · ±36 km · D+1900m · Cutoff 8h · Barreira horária km19 às 3h30",
  });
  console.log(`✅ Variant: ${trail.name}`);

  // ── Variant 2: Trail Sprint (±20 km) ──
  const trailSprint = await findOrCreateVariant({
    name: "Trail Sprint",
    distanceKm: 20,
    elevationGainM: 960,
    elevationLossM: 960,
    startDate: new Date("2026-03-29T08:30:00Z"),
    startTime: "08:30",
    cutoffTimeHours: 4,
    price: 23.0,
    currency: Currency.EUR,
    maxParticipants: 250,
    atrpGrade: null,
    itraPoints: null,
    description: "Trail Sprint · ±20 km · D+960m · Cutoff 4h",
  });
  console.log(`✅ Variant: ${trailSprint.name}`);

  // ── Variant 3: Mini Trail (±11 km) ──
  const miniTrail = await findOrCreateVariant({
    name: "Mini Trail",
    distanceKm: 11,
    elevationGainM: 460,
    elevationLossM: 460,
    startDate: new Date("2026-03-29T09:00:00Z"),
    startTime: "09:00",
    cutoffTimeHours: null,
    price: 20.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Mini Trail · ±11 km · D+460m · Sem limite de tempo · Idade mín. 16 anos",
  });
  console.log(`✅ Variant: ${miniTrail.name}`);

  // ── Variant 4: Caminhada (±7 km) ──
  const caminhada = await findOrCreateVariant({
    name: "Caminhada",
    distanceKm: 7,
    elevationGainM: 130,
    elevationLossM: 130,
    startDate: new Date("2026-03-29T09:10:00Z"),
    startTime: "09:10",
    cutoffTimeHours: null,
    price: 12.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Caminhada · ±7 km · D+130m · Idade mín. 14 anos",
  });
  console.log(`✅ Variant: ${caminhada.name}`);

  // ── Variant Translations (ALL 6 languages) ──
  const variantTranslations: Record<
    string,
    Record<string, { name: string; description: string | null }>
  > = {
    trail: {
      pt: {
        name: "Trail",
        description:
          "Trail · ±36 km · D+1900m · Cutoff 8h · Barreira horária km19 às 3h30",
      },
      en: {
        name: "Trail",
        description:
          "Trail · ±36 km · D+1900m · Cutoff 8h · Time barrier km19 at 3h30",
      },
      es: {
        name: "Trail",
        description:
          "Trail · ±36 km · D+1900m · Límite 8h · Barrera horaria km19 a 3h30",
      },
      fr: {
        name: "Trail",
        description:
          "Trail · ±36 km · D+1900m · Limite 8h · Barrière horaire km19 à 3h30",
      },
      de: {
        name: "Trail",
        description:
          "Trail · ±36 km · D+1900m · Limit 8h · Zeitbarriere km19 bei 3h30",
      },
      it: {
        name: "Trail",
        description:
          "Trail · ±36 km · D+1900m · Limite 8h · Barriera oraria km19 a 3h30",
      },
    },
    trailSprint: {
      pt: {
        name: "Trail Sprint",
        description: "Trail Sprint · ±20 km · D+960m · Cutoff 4h",
      },
      en: {
        name: "Trail Sprint",
        description: "Trail Sprint · ±20 km · D+960m · Cutoff 4h",
      },
      es: {
        name: "Trail Sprint",
        description: "Trail Sprint · ±20 km · D+960m · Límite 4h",
      },
      fr: {
        name: "Trail Sprint",
        description: "Trail Sprint · ±20 km · D+960m · Limite 4h",
      },
      de: {
        name: "Trail Sprint",
        description: "Trail Sprint · ±20 km · D+960m · Limit 4h",
      },
      it: {
        name: "Trail Sprint",
        description: "Trail Sprint · ±20 km · D+960m · Limite 4h",
      },
    },
    miniTrail: {
      pt: {
        name: "Mini Trail",
        description:
          "Mini Trail · ±11 km · D+460m · Sem limite de tempo · Idade mín. 16 anos",
      },
      en: {
        name: "Mini Trail",
        description:
          "Mini Trail · ±11 km · D+460m · No time limit · Min. age 16",
      },
      es: {
        name: "Mini Trail",
        description:
          "Mini Trail · ±11 km · D+460m · Sin límite · Edad mín. 16 años",
      },
      fr: {
        name: "Mini Trail",
        description:
          "Mini Trail · ±11 km · D+460m · Sans limite · Âge min. 16 ans",
      },
      de: {
        name: "Mini Trail",
        description:
          "Mini Trail · ±11 km · D+460m · Kein Zeitlimit · Mindestalter 16",
      },
      it: {
        name: "Mini Trail",
        description:
          "Mini Trail · ±11 km · D+460m · Senza limite · Età min. 16 anni",
      },
    },
    caminhada: {
      pt: {
        name: "Caminhada",
        description: "Caminhada · ±7 km · D+130m · Idade mín. 14 anos",
      },
      en: { name: "Walk", description: "Walk · ±7 km · D+130m · Min. age 14" },
      es: {
        name: "Caminata",
        description: "Caminata · ±7 km · D+130m · Edad mín. 14 años",
      },
      fr: {
        name: "Randonnée",
        description: "Randonnée · ±7 km · D+130m · Âge min. 14 ans",
      },
      de: {
        name: "Wanderung",
        description: "Wanderung · ±7 km · D+130m · Mindestalter 14",
      },
      it: {
        name: "Camminata",
        description: "Camminata · ±7 km · D+130m · Età min. 14 anni",
      },
    },
  };

  const variantMap = [
    { variant: trail, key: "trail" },
    { variant: trailSprint, key: "trailSprint" },
    { variant: miniTrail, key: "miniTrail" },
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

  // Phase 1: until March 8
  await findOrCreatePricingPhase("Trail - 1ª Fase", trail.id, {
    startDate: new Date("2025-12-01T00:00:00Z"),
    endDate: new Date("2026-03-08T23:59:59Z"),
    price: 25.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Trail Sprint - 1ª Fase", trailSprint.id, {
    startDate: new Date("2025-12-01T00:00:00Z"),
    endDate: new Date("2026-03-08T23:59:59Z"),
    price: 19.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Mini Trail - 1ª Fase", miniTrail.id, {
    startDate: new Date("2025-12-01T00:00:00Z"),
    endDate: new Date("2026-03-08T23:59:59Z"),
    price: 17.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Caminhada - 1ª Fase", caminhada.id, {
    startDate: new Date("2025-12-01T00:00:00Z"),
    endDate: new Date("2026-03-08T23:59:59Z"),
    price: 11.0,
    currency: Currency.EUR,
    note: null,
  });
  console.log("✅ Pricing Phase 1 created for all variants");

  // Phase 2: March 9 → March 23
  await findOrCreatePricingPhase("Trail - 2ª Fase", trail.id, {
    startDate: new Date("2026-03-09T00:00:00Z"),
    endDate: new Date("2026-03-23T23:59:59Z"),
    price: 28.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Trail Sprint - 2ª Fase", trailSprint.id, {
    startDate: new Date("2026-03-09T00:00:00Z"),
    endDate: new Date("2026-03-23T23:59:59Z"),
    price: 23.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Mini Trail - 2ª Fase", miniTrail.id, {
    startDate: new Date("2026-03-09T00:00:00Z"),
    endDate: new Date("2026-03-23T23:59:59Z"),
    price: 20.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Caminhada - 2ª Fase", caminhada.id, {
    startDate: new Date("2026-03-09T00:00:00Z"),
    endDate: new Date("2026-03-23T23:59:59Z"),
    price: 12.0,
    currency: Currency.EUR,
    note: null,
  });
  console.log("✅ Pricing Phase 2 created for all variants");

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
    "27–28 março: Levantamento de dorsais na Decathlon Albufeira (10:00–22:00). 29 março: 06:45 – Abertura secretariado (Sede GD Serrano). 07:50 – Briefing Trail. 08:00 – Partida Trail (36km). 08:20 – Briefing Trail Sprint. 08:30 – Partida Trail Sprint (20km). 08:45 – Fecho secretariado. 08:50 – Briefing Mini Trail. 09:00 – Partida Mini Trail (11km). 09:05 – Briefing Caminhada. 09:10 – Partida Caminhada (7km). 12:30 – Entrega de prémios."
  );

  const faq0Translations = {
    pt: {
      question: "Qual é o horário do evento?",
      answer:
        "27–28 março: Levantamento de dorsais na Decathlon Albufeira (10:00–22:00). 29 março: 06:45 – Abertura secretariado (Sede GD Serrano). 07:50 – Briefing Trail. 08:00 – Partida Trail (36km). 08:20 – Briefing Trail Sprint. 08:30 – Partida Trail Sprint (20km). 08:45 – Fecho secretariado. 08:50 – Briefing Mini Trail. 09:00 – Partida Mini Trail (11km). 09:05 – Briefing Caminhada. 09:10 – Partida Caminhada (7km). 12:30 – Entrega de prémios.",
    },
    en: {
      question: "What is the event schedule?",
      answer:
        "Mar 27–28: Bib pickup at Decathlon Albufeira (10:00–22:00). Mar 29: 06:45 – Registration opens (GD Serrano HQ). 07:50 – Trail briefing. 08:00 – Trail start (36km). 08:20 – Trail Sprint briefing. 08:30 – Trail Sprint start (20km). 08:45 – Registration closes. 08:50 – Mini Trail briefing. 09:00 – Mini Trail start (11km). 09:05 – Walk briefing. 09:10 – Walk start (7km). 12:30 – Prize ceremony.",
    },
    es: {
      question: "¿Cuál es el horario del evento?",
      answer:
        "27–28 marzo: Recogida de dorsales en Decathlon Albufeira (10:00–22:00). 29 marzo: 06:45 – Apertura secretaría (Sede GD Serrano). 07:50 – Briefing Trail. 08:00 – Salida Trail (36km). 08:20 – Briefing Trail Sprint. 08:30 – Salida Trail Sprint (20km). 08:45 – Cierre secretaría. 08:50 – Briefing Mini Trail. 09:00 – Salida Mini Trail (11km). 09:05 – Briefing Caminata. 09:10 – Salida Caminata (7km). 12:30 – Entrega de premios.",
    },
    fr: {
      question: "Quel est le programme de l'événement ?",
      answer:
        "27–28 mars : Retrait des dossards au Decathlon Albufeira (10h00–22h00). 29 mars : 06h45 – Ouverture secrétariat (Siège GD Serrano). 07h50 – Briefing Trail. 08h00 – Départ Trail (36km). 08h20 – Briefing Trail Sprint. 08h30 – Départ Trail Sprint (20km). 08h45 – Fermeture secrétariat. 08h50 – Briefing Mini Trail. 09h00 – Départ Mini Trail (11km). 09h05 – Briefing Randonnée. 09h10 – Départ Randonnée (7km). 12h30 – Remise des prix.",
    },
    de: {
      question: "Wie ist der Zeitplan der Veranstaltung?",
      answer:
        "27.–28. März: Startnummernausgabe bei Decathlon Albufeira (10:00–22:00). 29. März: 06:45 – Sekretariat öffnet (GD Serrano Sitz). 07:50 – Trail Briefing. 08:00 – Trail Start (36km). 08:20 – Trail Sprint Briefing. 08:30 – Trail Sprint Start (20km). 08:45 – Sekretariat schließt. 08:50 – Mini Trail Briefing. 09:00 – Mini Trail Start (11km). 09:05 – Wanderung Briefing. 09:10 – Wanderung Start (7km). 12:30 – Preisverleihung.",
    },
    it: {
      question: "Qual è il programma dell'evento?",
      answer:
        "27–28 marzo: Ritiro pettorali al Decathlon Albufeira (10:00–22:00). 29 marzo: 06:45 – Apertura segreteria (Sede GD Serrano). 07:50 – Briefing Trail. 08:00 – Partenza Trail (36km). 08:20 – Briefing Trail Sprint. 08:30 – Partenza Trail Sprint (20km). 08:45 – Chiusura segreteria. 08:50 – Briefing Mini Trail. 09:00 – Partenza Mini Trail (11km). 09:05 – Briefing Camminata. 09:10 – Partenza Camminata (7km). 12:30 – Premiazione.",
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
    "Dorsal, T-shirt do evento, gola, seguro de acidentes pessoais, abastecimentos sólidos e líquidos, 1 bebida, 1 bifana, brinde finisher e banhos."
  );

  const faq1Translations = {
    pt: {
      question: "O que está incluído na inscrição?",
      answer:
        "Dorsal, T-shirt do evento, gola, seguro de acidentes pessoais, abastecimentos sólidos e líquidos, 1 bebida, 1 bifana, brinde finisher e banhos.",
    },
    en: {
      question: "What is included in the registration?",
      answer:
        "Bib number, event t-shirt, neck gaiter, personal accident insurance, solid and liquid aid stations, 1 drink, 1 bifana (pork sandwich), finisher gift and showers.",
    },
    es: {
      question: "¿Qué incluye la inscripción?",
      answer:
        "Dorsal, camiseta del evento, braga de cuello, seguro de accidentes, avituallamientos sólidos y líquidos, 1 bebida, 1 bifana, obsequio finisher y duchas.",
    },
    fr: {
      question: "Que comprend l'inscription ?",
      answer:
        "Dossard, t-shirt de l'événement, tour de cou, assurance accidents, ravitaillements solides et liquides, 1 boisson, 1 bifana, cadeau finisher et douches.",
    },
    de: {
      question: "Was ist in der Anmeldung enthalten?",
      answer:
        "Startnummer, Event-T-Shirt, Halstuch, Unfallversicherung, feste und flüssige Verpflegung, 1 Getränk, 1 Bifana, Finisher-Geschenk und Duschen.",
    },
    it: {
      question: "Cosa è incluso nell'iscrizione?",
      answer:
        "Pettorale, t-shirt dell'evento, scaldacollo, assicurazione infortuni, rifornimenti solidi e liquidi, 1 bevanda, 1 bifana, regalo finisher e docce.",
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
    "Todas as provas (Trail, Trail Sprint, Mini Trail, Caminhada): dorsal visível, telemóvel carregado, apito, manta térmica, reservatório de líquidos (mín. 0,5L) e recipiente para consumo de bebidas (não há copos nos abastecimentos). A organização pode solicitar verificação do material durante a prova."
  );

  const faq2Translations = {
    pt: {
      question: "Qual é o material obrigatório?",
      answer:
        "Todas as provas (Trail, Trail Sprint, Mini Trail, Caminhada): dorsal visível, telemóvel carregado, apito, manta térmica, reservatório de líquidos (mín. 0,5L) e recipiente para consumo de bebidas (não há copos nos abastecimentos). A organização pode solicitar verificação do material durante a prova.",
    },
    en: {
      question: "What mandatory equipment is required?",
      answer:
        "All races (Trail, Trail Sprint, Mini Trail, Walk): visible bib, charged phone, whistle, thermal blanket, liquid reservoir (min. 0.5L) and drinking container (no cups at aid stations). Organization may check equipment during the race.",
    },
    es: {
      question: "¿Cuál es el material obligatorio?",
      answer:
        "Todas las pruebas (Trail, Trail Sprint, Mini Trail, Caminata): dorsal visible, teléfono cargado, silbato, manta térmica, depósito de líquidos (mín. 0,5L) y recipiente para bebidas (no hay vasos en los avituallamientos). La organización puede verificar el material durante la prueba.",
    },
    fr: {
      question: "Quel est le matériel obligatoire ?",
      answer:
        "Toutes les épreuves (Trail, Trail Sprint, Mini Trail, Randonnée) : dossard visible, téléphone chargé, sifflet, couverture de survie, réservoir de liquides (min. 0,5L) et récipient pour boissons (pas de gobelets aux ravitaillements). L'organisation peut vérifier le matériel pendant la course.",
    },
    de: {
      question: "Welche Pflichtausrüstung ist erforderlich?",
      answer:
        "Alle Rennen (Trail, Trail Sprint, Mini Trail, Wanderung): sichtbare Startnummer, geladenes Telefon, Trillerpfeife, Rettungsdecke, Flüssigkeitsbehälter (min. 0,5L) und Trinkbehälter (keine Becher an Verpflegungsstationen). Die Organisation kann die Ausrüstung während des Rennens überprüfen.",
    },
    it: {
      question: "Quale equipaggiamento obbligatorio è richiesto?",
      answer:
        "Tutte le gare (Trail, Trail Sprint, Mini Trail, Camminata): pettorale visibile, telefono carico, fischietto, coperta termica, serbatoio liquidi (min. 0,5L) e contenitore per bevande (niente bicchieri ai rifornimenti). L'organizzazione può verificare l'equipaggiamento durante la gara.",
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

  // ── FAQ 3: Aid stations ──
  const faq3 = await findOrCreateFAQ(
    event.id,
    3,
    "Onde são os postos de abastecimento?",
    "Trail 36km: 5 abastecimentos (km8, km19, km22, km28, meta). Trail Sprint 20km: 3 abastecimentos (km8, km16, meta). Mini Trail 11km: 2 abastecimentos (km7, meta). Caminhada 7km: 2 abastecimentos (km4, meta). Não há copos — cada atleta deve trazer o seu recipiente."
  );

  const faq3Translations = {
    pt: {
      question: "Onde são os postos de abastecimento?",
      answer:
        "Trail 36km: 5 abastecimentos (km8, km19, km22, km28, meta). Trail Sprint 20km: 3 abastecimentos (km8, km16, meta). Mini Trail 11km: 2 abastecimentos (km7, meta). Caminhada 7km: 2 abastecimentos (km4, meta). Não há copos — cada atleta deve trazer o seu recipiente.",
    },
    en: {
      question: "Where are the aid stations?",
      answer:
        "Trail 36km: 5 aid stations (km8, km19, km22, km28, finish). Trail Sprint 20km: 3 aid stations (km8, km16, finish). Mini Trail 11km: 2 aid stations (km7, finish). Walk 7km: 2 aid stations (km4, finish). No cups — each athlete must bring their own container.",
    },
    es: {
      question: "¿Dónde están los avituallamientos?",
      answer:
        "Trail 36km: 5 avituallamientos (km8, km19, km22, km28, meta). Trail Sprint 20km: 3 avituallamientos (km8, km16, meta). Mini Trail 11km: 2 avituallamientos (km7, meta). Caminata 7km: 2 avituallamientos (km4, meta). No hay vasos — cada atleta debe traer su recipiente.",
    },
    fr: {
      question: "Où sont les ravitaillements ?",
      answer:
        "Trail 36km : 5 ravitaillements (km8, km19, km22, km28, arrivée). Trail Sprint 20km : 3 ravitaillements (km8, km16, arrivée). Mini Trail 11km : 2 ravitaillements (km7, arrivée). Randonnée 7km : 2 ravitaillements (km4, arrivée). Pas de gobelets — chaque athlète doit apporter son récipient.",
    },
    de: {
      question: "Wo sind die Verpflegungsstationen?",
      answer:
        "Trail 36km: 5 Stationen (km8, km19, km22, km28, Ziel). Trail Sprint 20km: 3 Stationen (km8, km16, Ziel). Mini Trail 11km: 2 Stationen (km7, Ziel). Wanderung 7km: 2 Stationen (km4, Ziel). Keine Becher — jeder Athlet muss seinen eigenen Behälter mitbringen.",
    },
    it: {
      question: "Dove sono i rifornimenti?",
      answer:
        "Trail 36km: 5 rifornimenti (km8, km19, km22, km28, arrivo). Trail Sprint 20km: 3 rifornimenti (km8, km16, arrivo). Mini Trail 11km: 2 rifornimenti (km7, arrivo). Camminata 7km: 2 rifornimenti (km4, arrivo). Niente bicchieri — ogni atleta deve portare il proprio contenitore.",
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
  console.log("✅ FAQ 3: Aid stations");

  // ── FAQ 4: Prizes ──
  const faq4 = await findOrCreateFAQ(
    event.id,
    4,
    "Quais são os prémios?",
    "Trail e Trail Sprint: prémios aos 3 primeiros classificados geral e por escalão M/F, e às 3 primeiras equipas. Mini Trail: prémios aos 3 primeiros M/F. Segmentos Strava cronometrados com prémios para 1º M/F de cada segmento. Classificação equipas: soma de pontos dos 3 primeiros de cada equipa (menos pontos vence)."
  );

  const faq4Translations = {
    pt: {
      question: "Quais são os prémios?",
      answer:
        "Trail e Trail Sprint: prémios aos 3 primeiros classificados geral e por escalão M/F, e às 3 primeiras equipas. Mini Trail: prémios aos 3 primeiros M/F. Segmentos Strava cronometrados com prémios para 1º M/F de cada segmento. Classificação equipas: soma de pontos dos 3 primeiros de cada equipa (menos pontos vence).",
    },
    en: {
      question: "What are the prizes?",
      answer:
        "Trail and Trail Sprint: prizes for top 3 overall and per age group M/F, and top 3 teams. Mini Trail: prizes for top 3 M/F. Timed Strava segments with prizes for 1st M/F each segment. Team classification: sum of points from top 3 finishers per team (fewest points wins).",
    },
    es: {
      question: "¿Cuáles son los premios?",
      answer:
        "Trail y Trail Sprint: premios a los 3 primeros general y por categoría M/F, y a los 3 primeros equipos. Mini Trail: premios a los 3 primeros M/F. Segmentos Strava cronometrados con premios para 1º M/F de cada segmento. Clasificación equipos: suma de puntos de los 3 primeros de cada equipo (menos puntos gana).",
    },
    fr: {
      question: "Quels sont les prix ?",
      answer:
        "Trail et Trail Sprint : prix aux 3 premiers général et par catégorie H/F, et aux 3 premières équipes. Mini Trail : prix aux 3 premiers H/F. Segments Strava chronométrés avec prix pour 1er H/F de chaque segment. Classement équipes : somme des points des 3 premiers de chaque équipe (moins de points gagne).",
    },
    de: {
      question: "Welche Preise gibt es?",
      answer:
        "Trail und Trail Sprint: Preise für Top 3 Gesamtwertung und pro Altersklasse M/W, und Top 3 Mannschaften. Mini Trail: Preise für Top 3 M/W. Strava-Zeitsegmente mit Preisen für 1. M/W pro Segment. Mannschaftswertung: Punktesumme der 3 besten Läufer pro Team (wenigste Punkte gewinnt).",
    },
    it: {
      question: "Quali sono i premi?",
      answer:
        "Trail e Trail Sprint: premi ai 3 primi generale e per fascia d'età M/F, e alle 3 prime squadre. Mini Trail: premi ai 3 primi M/F. Segmenti Strava cronometrati con premi per 1° M/F di ogni segmento. Classifica squadre: somma punti dei 3 migliori di ogni squadra (meno punti vince).",
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
  console.log("✅ FAQ 4: Prizes");

  // ── FAQ 5: Lunch ──
  const faq5 = await findOrCreateFAQ(
    event.id,
    5,
    "Há almoço disponível?",
    "Almoço disponível por 5 € (reservar no momento da inscrição). Acompanhantes: 5 €."
  );

  const faq5Translations = {
    pt: {
      question: "Há almoço disponível?",
      answer:
        "Almoço disponível por 5 € (reservar no momento da inscrição). Acompanhantes: 5 €.",
    },
    en: {
      question: "Is lunch available?",
      answer: "Lunch available for €5 (book at registration). Companions: €5.",
    },
    es: {
      question: "¿Hay almuerzo disponible?",
      answer:
        "Almuerzo disponible por 5 € (reservar al inscribirse). Acompañantes: 5 €.",
    },
    fr: {
      question: "Y a-t-il un déjeuner disponible ?",
      answer:
        "Déjeuner disponible pour 5 € (réserver à l'inscription). Accompagnants : 5 €.",
    },
    de: {
      question: "Gibt es Mittagessen?",
      answer:
        "Mittagessen für 5 € verfügbar (bei Anmeldung reservieren). Begleiter: 5 €.",
    },
    it: {
      question: "È disponibile il pranzo?",
      answer:
        "Pranzo disponibile a 5 € (prenotare all'iscrizione). Accompagnatori: 5 €.",
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
  console.log("✅ FAQ 5: Lunch");

  // ── FAQ 6: Contacts ──
  const faq6 = await findOrCreateFAQ(
    event.id,
    6,
    "Quais são os contactos da organização?",
    "Grupo Desportivo Serrano. E-mail: trailrotadasestevas@gmail.com. Site: gdserrano.pt. Inscrições: www.acorrer.pt."
  );

  const faq6Translations = {
    pt: {
      question: "Quais são os contactos da organização?",
      answer:
        "Grupo Desportivo Serrano. E-mail: trailrotadasestevas@gmail.com. Site: gdserrano.pt. Inscrições: www.acorrer.pt.",
    },
    en: {
      question: "What are the organization's contacts?",
      answer:
        "Grupo Desportivo Serrano. Email: trailrotadasestevas@gmail.com. Website: gdserrano.pt. Registrations: www.acorrer.pt.",
    },
    es: {
      question: "¿Cuáles son los contactos de la organización?",
      answer:
        "Grupo Desportivo Serrano. E-mail: trailrotadasestevas@gmail.com. Web: gdserrano.pt. Inscripciones: www.acorrer.pt.",
    },
    fr: {
      question: "Quels sont les contacts de l'organisation ?",
      answer:
        "Grupo Desportivo Serrano. E-mail : trailrotadasestevas@gmail.com. Site : gdserrano.pt. Inscriptions : www.acorrer.pt.",
    },
    de: {
      question: "Was sind die Kontaktdaten der Organisation?",
      answer:
        "Grupo Desportivo Serrano. E-Mail: trailrotadasestevas@gmail.com. Website: gdserrano.pt. Anmeldung: www.acorrer.pt.",
    },
    it: {
      question: "Quali sono i contatti dell'organizzazione?",
      answer:
        "Grupo Desportivo Serrano. E-mail: trailrotadasestevas@gmail.com. Sito: gdserrano.pt. Iscrizioni: www.acorrer.pt.",
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
🌿 III Trail Rota das Estevas 2026 seed completed!
──────────────────────────────────────────────
- Slug: trail-rota-das-estevas-2026
- Date: March 29, 2026
- Location: Sede GD Serrano, Monte Ruivo, Alte, Loulé
- Variants: Trail (±36km D+1900m), Trail Sprint (±20km D+960m), Mini Trail (±11km D+460m), Caminhada (±7km D+130m)
- Pricing: 2 phases × 4 variants = 8 pricing phases
- FAQs: 7 with translations in 6 languages
- Association: Associação de Atletismo do Algarve
- Strava segments with prizes
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
