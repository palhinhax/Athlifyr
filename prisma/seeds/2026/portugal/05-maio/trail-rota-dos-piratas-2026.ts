/**
 * Seed Trail Rota dos Piratas 2026 – Ribamar, Lourinhã
 * 2ª edição | 17 de maio de 2026
 * Organização: Centro Social e Cultural de Ribamar / Trilho Perdido
 * Source: https://www.trilhoperdido.com/evento/Trail-Rota-dos-Piratas
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏴‍☠️ Seeding Trail Rota dos Piratas 2026 – Ribamar...");

  const languages: Language[] = [
    Language.pt,
    Language.en,
    Language.es,
    Language.fr,
    Language.de,
    Language.it,
  ];

  // ── Description PT ──
  const descriptionPT = `# 🏴‍☠️ Trail Rota dos Piratas 2026 – 2ª Edição

A **2ª edição do Trail Rota dos Piratas** realiza-se no dia **17 de maio de 2026** em **Ribamar, Lourinhã**, com partida e chegada na **Praça de Santa Maria**. Evento organizado pelo **Centro Social e Cultural de Ribamar**, com o apoio da Câmara Municipal de Lourinhã e da Junta de Freguesia de Ribamar, cronometrado pela **Trilho Perdido**.

Um evento que percorre os trilhos costeiros e florestais da zona de Ribamar, com passagens especiais nas zonas costeiras e no Vale D'Arrocha.

---

## 🗓️ Programa

**Sábado, 16 de maio**
- 14h00 – Abertura do secretariado
- 20h00 – Fecho do secretariado

**Domingo, 17 de maio**
- 06h30 – Abertura do secretariado
- 08h15 – Briefing
- 08h30 – Partida do Trail Longo 30K
- 09h15 – Partida do Trail Curto 17K
- 09h30 – Partida do Mini Trail 13K
- 09h45 – Partida da Caminhada 10K
- 12h00 – Almoço e entrega de prémios

---

## 🏅 Provas disponíveis

### 🔴 Trail Longo – 30KM | D+ 1500m
Prova competitiva com 30 km e 1500m de desnível positivo. Tempo limite: **7 horas**. Mínimo 16 anos. Medalha de finisher incluída.

### 🟠 Trail Curto – 17KM | D+ 900m
Prova competitiva com 17 km e 900m de desnível positivo. Sem tempo limite. Mínimo 16 anos. Medalha de finisher incluída.

### 🟡 Mini Trail – 13KM | D+ 600m
Prova competitiva com 13 km e 600m de desnível positivo. Sem tempo limite. Mínimo 16 anos. Medalha de finisher incluída.

### 🟢 Caminhada – 10KM | D+ 400m
Percurso não competitivo de 10 km com 400m de desnível. Sem tempo limite. Mínimo 10 anos (crianças dos 10-14 anos acompanhadas por adulto).

---

## 💰 Fases de Inscrição

| Prova | Fase Promo (20-22 dez) | 1ª Fase (até 31 jan) | 2ª Fase (até 28 fev) | 3ª Fase (até 31 mar) |
|---|---|---|---|---|
| Trail Longo 30K | 19€ | 20€ | 22€ | 24€ |
| Trail Curto 17K | 17€ | 18€ | 20€ | 22€ |
| Mini Trail 13K | 15€ | 16€ | 18€ | 20€ |
| Caminhada 10K | 11€ | 12€ | 12€ | 12€ |

> Inscrições encerram a **31 de março de 2026** ou ao atingir **750 inscrições pagas**. Almoço de participante disponível por +5,50€ (opcional).

---

## 🎒 Kit do Atleta

**Trail (30K, 17K, 13K):** T-shirt técnica + Buff + Dorsal com chip + Brindes
**Caminhada:** T-shirt técnica + Buff + Brindes

Kit incluído para inscrições até 31 de março de 2026.

---

## 🧗 Material Obrigatório

- Dorsal visível durante todo o percurso
- Reservatório de hidratação (mínimo 0,5L)
- Telemóvel operacional

---

## 🏆 Prémios

- Troféu para os 3 primeiros de cada escalão (M/F) nas provas de Mini Trail, Trail Curto e Trail Longo
- Prémio para os 3 primeiros classificados gerais (M/F) de cada prova
- Prémio para as 3 melhores equipas
- Medalha de finisher para todos os participantes das provas de trail e caminhada

---

## 🔄 Política de Reembolso

- Até 1 de março de 2026: devolução de **50%**
- A partir de 1 de março: **sem reembolso**
- Não são transitadas inscrições para edições futuras

---

## 📍 Local

**Praça de Santa Maria, Ribamar**
Ribamar, Lourinhã, Portugal

---

## 📞 Contacto

- **Email:** info@trailrotadospiratas.pt
- **Inscrições:** infotrilhoperdido@gmail.com
- **Tel:** 965 265 347`;

  // ── Event upsert ──
  const event = await prisma.event.upsert({
    where: { slug: "trail-rota-dos-piratas-2026" },
    update: {
      title: "Trail Rota dos Piratas 2026",
      description: descriptionPT,
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-05-17T07:30:00Z"),
      endDate: new Date("2026-05-17T17:00:00Z"),
      city: "Ribamar",
      country: "Portugal",
      latitude: 39.2747,
      longitude: -9.3257,
      googleMapsUrl: "https://maps.app.goo.gl/PracaSantaMariaRibamar",
      externalUrl:
        "https://www.trilhoperdido.com/evento/Trail-Rota-dos-Piratas",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-03-31T23:59:59Z"),
    },
    create: {
      title: "Trail Rota dos Piratas 2026",
      slug: "trail-rota-dos-piratas-2026",
      description: descriptionPT,
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-05-17T07:30:00Z"),
      endDate: new Date("2026-05-17T17:00:00Z"),
      city: "Ribamar",
      country: "Portugal",
      latitude: 39.2747,
      longitude: -9.3257,
      googleMapsUrl: "https://maps.app.goo.gl/PracaSantaMariaRibamar",
      externalUrl:
        "https://www.trilhoperdido.com/evento/Trail-Rota-dos-Piratas",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-03-31T23:59:59Z"),
    },
  });

  console.log("✅ Event upserted:", event.title);

  // ── Translations ──
  const translations: Record<
    Language,
    {
      title: string;
      description: string;
      city: string;
      metaTitle: string;
      metaDescription: string;
    }
  > = {
    [Language.pt]: {
      title: "Trail Rota dos Piratas 2026",
      description: descriptionPT,
      city: "Ribamar",
      metaTitle:
        "Trail Rota dos Piratas 2026 – 2ª Edição | Ribamar, Lourinhã | 17 Maio",
      metaDescription:
        "Trail Rota dos Piratas 2026 em Ribamar, 17 de maio. Trail Longo 30K, Trail Curto 17K, Mini Trail 13K e Caminhada 10K. Inscrições a partir de 15€. Limite: 750 vagas.",
    },
    [Language.en]: {
      title: "Trail Rota dos Piratas 2026",
      description: `# 🏴‍☠️ Trail Rota dos Piratas 2026 – 2nd Edition

The **2nd edition of Trail Rota dos Piratas** takes place on **May 17, 2026** in **Ribamar, Lourinhã**, starting and finishing at **Praça de Santa Maria**. Organized by the **Centro Social e Cultural de Ribamar**, with support from the Municipality of Lourinhã and the Parish of Ribamar, timed by **Trilho Perdido**.

An event that explores the coastal and forest trails of the Ribamar area, with special passages along the coastline and through the Vale D'Arrocha.

---

## 🗓️ Schedule

**Saturday, May 16**
- 14:00 – Registration opens
- 20:00 – Registration closes

**Sunday, May 17**
- 06:30 – Registration opens
- 08:15 – Briefing
- 08:30 – Long Trail 30K start
- 09:15 – Short Trail 17K start
- 09:30 – Mini Trail 13K start
- 09:45 – Walking 10K start
- 12:00 – Lunch and prize giving

---

## 🏅 Available Races

### 🔴 Long Trail – 30KM | D+ 1500m
Competitive race with 30 km and 1500m elevation gain. Time limit: **7 hours**. Minimum age 16. Finisher medal included.

### 🟠 Short Trail – 17KM | D+ 900m
Competitive race with 17 km and 900m elevation gain. No time limit. Minimum age 16. Finisher medal included.

### 🟡 Mini Trail – 13KM | D+ 600m
Competitive race with 13 km and 600m elevation gain. No time limit. Minimum age 16. Finisher medal included.

### 🟢 Walking – 10KM | D+ 400m
Non-competitive route with 10 km and 400m elevation. No time limit. Minimum age 10 (children 10-14 must be accompanied by an adult).

---

## 💰 Registration Phases

| Race | Promo Phase (Dec 20-22) | Phase 1 (until Jan 31) | Phase 2 (until Feb 28) | Phase 3 (until Mar 31) |
|---|---|---|---|---|
| Long Trail 30K | €19 | €20 | €22 | €24 |
| Short Trail 17K | €17 | €18 | €20 | €22 |
| Mini Trail 13K | €15 | €16 | €18 | €20 |
| Walking 10K | €11 | €12 | €12 | €12 |

> Registrations close on **March 31, 2026** or when **750 paid registrations** are reached. Participant lunch available for +€5.50 (optional).

---

## 🏆 Prizes

- Trophy for the top 3 in each age group (M/F) in Mini Trail, Short Trail and Long Trail
- Prize for the top 3 overall (M/F) in each race
- Prize for the top 3 teams
- Finisher medal for all trail and walking participants

---

## 🔄 Refund Policy

- Until March 1, 2026: **50% refund**
- From March 1: **no refund**

---

## 📍 Location

**Praça de Santa Maria, Ribamar**
Ribamar, Lourinhã, Portugal`,
      city: "Ribamar",
      metaTitle:
        "Trail Rota dos Piratas 2026 – 2nd Edition | Ribamar, Lourinhã | May 17",
      metaDescription:
        "Trail Rota dos Piratas 2026 in Ribamar, May 17. Long Trail 30K, Short Trail 17K, Mini Trail 13K and Walking 10K. Registration from €15. Limit: 750 spots.",
    },
    [Language.es]: {
      title: "Trail Rota dos Piratas 2026",
      description: `# 🏴‍☠️ Trail Rota dos Piratas 2026 – 2ª Edición

La **2ª edición del Trail Rota dos Piratas** se celebra el **17 de mayo de 2026** en **Ribamar, Lourinhã**, con salida y llegada en la **Praça de Santa Maria**. Organizado por el **Centro Social y Cultural de Ribamar**, con el apoyo del Ayuntamiento de Lourinhã y la Junta de Ribamar, cronometrado por **Trilho Perdido**.

Un evento que recorre los senderos costeros y forestales de la zona de Ribamar, con pasos especiales por la costa y el Valle D'Arrocha.

---

## 🗓️ Programa

**Sábado, 16 de mayo**
- 14:00 – Apertura del secretariado
- 20:00 – Cierre del secretariado

**Domingo, 17 de mayo**
- 06:30 – Apertura del secretariado
- 08:15 – Briefing
- 08:30 – Salida del Trail Largo 30K
- 09:15 – Salida del Trail Corto 17K
- 09:30 – Salida del Mini Trail 13K
- 09:45 – Salida de la Caminata 10K
- 12:00 – Almuerzo y entrega de premios

---

## 🏅 Pruebas disponibles

### 🔴 Trail Largo – 30KM | D+ 1500m
Prueba competitiva de 30 km y 1500m de desnivel positivo. Tiempo límite: **7 horas**. Mínimo 16 años.

### 🟠 Trail Corto – 17KM | D+ 900m
Prueba competitiva de 17 km y 900m de desnivel positivo. Sin tiempo límite. Mínimo 16 años.

### 🟡 Mini Trail – 13KM | D+ 600m
Prueba competitiva de 13 km y 600m de desnivel positivo. Sin tiempo límite. Mínimo 16 años.

### 🟢 Caminata – 10KM | D+ 400m
Recorrido no competitivo de 10 km y 400m de desnivel. Sin tiempo límite. Mínimo 10 años.

---

## 💰 Fases de Inscripción

| Prueba | Fase Promo (20-22 dic) | 1ª Fase (hasta 31 ene) | 2ª Fase (hasta 28 feb) | 3ª Fase (hasta 31 mar) |
|---|---|---|---|---|
| Trail Largo 30K | 19€ | 20€ | 22€ | 24€ |
| Trail Corto 17K | 17€ | 18€ | 20€ | 22€ |
| Mini Trail 13K | 15€ | 16€ | 18€ | 20€ |
| Caminata 10K | 11€ | 12€ | 12€ | 12€ |

---

## 📍 Ubicación

**Praça de Santa Maria, Ribamar**
Ribamar, Lourinhã, Portugal`,
      city: "Ribamar",
      metaTitle:
        "Trail Rota dos Piratas 2026 – 2ª Edición | Ribamar, Lourinhã | 17 Mayo",
      metaDescription:
        "Trail Rota dos Piratas 2026 en Ribamar, 17 de mayo. Trail Largo 30K, Trail Corto 17K, Mini Trail 13K y Caminata 10K. Inscripciones desde 15€. Límite: 750 plazas.",
    },
    [Language.fr]: {
      title: "Trail Rota dos Piratas 2026",
      description: `# 🏴‍☠️ Trail Rota dos Piratas 2026 – 2e Édition

La **2e édition du Trail Rota dos Piratas** se déroule le **17 mai 2026** à **Ribamar, Lourinhã**, avec départ et arrivée sur la **Praça de Santa Maria**. Organisé par le **Centro Social e Cultural de Ribamar**, avec le soutien de la Mairie de Lourinhã et de la Paroisse de Ribamar, chronométré par **Trilho Perdido**.

Un événement qui parcourt les sentiers côtiers et forestiers de la zone de Ribamar, avec des passages spéciaux le long de la côte et dans la Vallée D'Arrocha.

---

## 🗓️ Programme

**Samedi 16 mai**
- 14h00 – Ouverture du secrétariat
- 20h00 – Fermeture du secrétariat

**Dimanche 17 mai**
- 06h30 – Ouverture du secrétariat
- 08h15 – Briefing
- 08h30 – Départ Trail Long 30K
- 09h15 – Départ Trail Court 17K
- 09h30 – Départ Mini Trail 13K
- 09h45 – Départ Marche 10K
- 12h00 – Déjeuner et remise des prix

---

## 🏅 Épreuves disponibles

### 🔴 Trail Long – 30KM | D+ 1500m
Épreuve compétitive de 30 km et 1500m de dénivelé positif. Temps limite : **7 heures**. Âge minimum 16 ans.

### 🟠 Trail Court – 17KM | D+ 900m
Épreuve compétitive de 17 km et 900m de dénivelé positif. Sans limite de temps. Âge minimum 16 ans.

### 🟡 Mini Trail – 13KM | D+ 600m
Épreuve compétitive de 13 km et 600m de dénivelé positif. Sans limite de temps. Âge minimum 16 ans.

### 🟢 Marche – 10KM | D+ 400m
Parcours non compétitif de 10 km et 400m de dénivelé. Sans limite de temps. Âge minimum 10 ans.

---

## 💰 Phases d'Inscription

| Épreuve | Phase Promo (20-22 déc) | 1re Phase (jusqu'au 31 jan) | 2e Phase (jusqu'au 28 fév) | 3e Phase (jusqu'au 31 mar) |
|---|---|---|---|---|
| Trail Long 30K | 19€ | 20€ | 22€ | 24€ |
| Trail Court 17K | 17€ | 18€ | 20€ | 22€ |
| Mini Trail 13K | 15€ | 16€ | 18€ | 20€ |
| Marche 10K | 11€ | 12€ | 12€ | 12€ |

---

## 📍 Lieu

**Praça de Santa Maria, Ribamar**
Ribamar, Lourinhã, Portugal`,
      city: "Ribamar",
      metaTitle:
        "Trail Rota dos Piratas 2026 – 2e Édition | Ribamar, Lourinhã | 17 Mai",
      metaDescription:
        "Trail Rota dos Piratas 2026 à Ribamar, 17 mai. Trail Long 30K, Trail Court 17K, Mini Trail 13K et Marche 10K. Inscriptions à partir de 15€. Limite : 750 places.",
    },
    [Language.de]: {
      title: "Trail Rota dos Piratas 2026",
      description: `# 🏴‍☠️ Trail Rota dos Piratas 2026 – 2. Ausgabe

Die **2. Ausgabe des Trail Rota dos Piratas** findet am **17. Mai 2026** in **Ribamar, Lourinhã** statt, mit Start und Ziel auf dem **Praça de Santa Maria**. Veranstaltet vom **Centro Social e Cultural de Ribamar**, unterstützt von der Gemeinde Lourinhã und der Pfarrgemeinde Ribamar, zeitgenommen von **Trilho Perdido**.

Eine Veranstaltung, die die Küsten- und Waldwege der Region Ribamar erkundet, mit besonderen Passagen entlang der Küste und durch das Vale D'Arrocha.

---

## 🗓️ Programm

**Samstag, 16. Mai**
- 14:00 Uhr – Anmeldung öffnet
- 20:00 Uhr – Anmeldung schließt

**Sonntag, 17. Mai**
- 06:30 Uhr – Anmeldung öffnet
- 08:15 Uhr – Briefing
- 08:30 Uhr – Start Langer Trail 30K
- 09:15 Uhr – Start Kurzer Trail 17K
- 09:30 Uhr – Start Mini Trail 13K
- 09:45 Uhr – Start Wanderung 10K
- 12:00 Uhr – Mittagessen und Siegerehrung

---

## 🏅 Verfügbare Rennen

### 🔴 Langer Trail – 30KM | D+ 1500m
Wettkampfrennen mit 30 km und 1500m Höhengewinn. Zeitlimit: **7 Stunden**. Mindestalter 16 Jahre.

### 🟠 Kurzer Trail – 17KM | D+ 900m
Wettkampfrennen mit 17 km und 900m Höhengewinn. Kein Zeitlimit. Mindestalter 16 Jahre.

### 🟡 Mini Trail – 13KM | D+ 600m
Wettkampfrennen mit 13 km und 600m Höhengewinn. Kein Zeitlimit. Mindestalter 16 Jahre.

### 🟢 Wanderung – 10KM | D+ 400m
Nicht kompetitive Route mit 10 km und 400m Höhengewinn. Kein Zeitlimit. Mindestalter 10 Jahre.

---

## 💰 Anmeldephasen

| Rennen | Promo-Phase (20.-22. Dez.) | 1. Phase (bis 31. Jan.) | 2. Phase (bis 28. Feb.) | 3. Phase (bis 31. März) |
|---|---|---|---|---|
| Langer Trail 30K | 19€ | 20€ | 22€ | 24€ |
| Kurzer Trail 17K | 17€ | 18€ | 20€ | 22€ |
| Mini Trail 13K | 15€ | 16€ | 18€ | 20€ |
| Wanderung 10K | 11€ | 12€ | 12€ | 12€ |

---

## 📍 Ort

**Praça de Santa Maria, Ribamar**
Ribamar, Lourinhã, Portugal`,
      city: "Ribamar",
      metaTitle:
        "Trail Rota dos Piratas 2026 – 2. Ausgabe | Ribamar, Lourinhã | 17. Mai",
      metaDescription:
        "Trail Rota dos Piratas 2026 in Ribamar, 17. Mai. Langer Trail 30K, Kurzer Trail 17K, Mini Trail 13K und Wanderung 10K. Anmeldung ab 15€. Limit: 750 Plätze.",
    },
    [Language.it]: {
      title: "Trail Rota dos Piratas 2026",
      description: `# 🏴‍☠️ Trail Rota dos Piratas 2026 – 2ª Edizione

La **2ª edizione del Trail Rota dos Piratas** si svolge il **17 maggio 2026** a **Ribamar, Lourinhã**, con partenza e arrivo in **Praça de Santa Maria**. Organizzato dal **Centro Social e Cultural de Ribamar**, con il supporto del Comune di Lourinhã e della Parrocchia di Ribamar, cronometrato da **Trilho Perdido**.

Un evento che percorre i sentieri costieri e forestali della zona di Ribamar, con passaggi speciali lungo la costa e nella Valle D'Arrocha.

---

## 🗓️ Programma

**Sabato 16 maggio**
- 14:00 – Apertura della segreteria
- 20:00 – Chiusura della segreteria

**Domenica 17 maggio**
- 06:30 – Apertura della segreteria
- 08:15 – Briefing
- 08:30 – Partenza Trail Lungo 30K
- 09:15 – Partenza Trail Corto 17K
- 09:30 – Partenza Mini Trail 13K
- 09:45 – Partenza Camminata 10K
- 12:00 – Pranzo e premiazione

---

## 🏅 Gare disponibili

### 🔴 Trail Lungo – 30KM | D+ 1500m
Gara competitiva di 30 km e 1500m di dislivello positivo. Limite di tempo: **7 ore**. Età minima 16 anni.

### 🟠 Trail Corto – 17KM | D+ 900m
Gara competitiva di 17 km e 900m di dislivello positivo. Senza limite di tempo. Età minima 16 anni.

### 🟡 Mini Trail – 13KM | D+ 600m
Gara competitiva di 13 km e 600m di dislivello positivo. Senza limite di tempo. Età minima 16 anni.

### 🟢 Camminata – 10KM | D+ 400m
Percorso non competitivo di 10 km e 400m di dislivello. Senza limite di tempo. Età minima 10 anni.

---

## 💰 Fasi di Iscrizione

| Gara | Fase Promo (20-22 dic) | 1ª Fase (fino al 31 gen) | 2ª Fase (fino al 28 feb) | 3ª Fase (fino al 31 mar) |
|---|---|---|---|---|
| Trail Lungo 30K | 19€ | 20€ | 22€ | 24€ |
| Trail Corto 17K | 17€ | 18€ | 20€ | 22€ |
| Mini Trail 13K | 15€ | 16€ | 18€ | 20€ |
| Camminata 10K | 11€ | 12€ | 12€ | 12€ |

---

## 📍 Luogo

**Praça de Santa Maria, Ribamar**
Ribamar, Lourinhã, Portogallo`,
      city: "Ribamar",
      metaTitle:
        "Trail Rota dos Piratas 2026 – 2ª Edizione | Ribamar, Lourinhã | 17 Maggio",
      metaDescription:
        "Trail Rota dos Piratas 2026 a Ribamar, 17 maggio. Trail Lungo 30K, Trail Corto 17K, Mini Trail 13K e Camminata 10K. Iscrizioni da 15€. Limite: 750 posti.",
    },
  };

  console.log("🌍 Creating event translations...");
  for (const lang of languages) {
    await prisma.eventTranslation.upsert({
      where: { eventId_language: { eventId: event.id, language: lang } },
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
    console.log(`   ✅ Translation upserted: ${lang}`);
  }

  // ── Pricing phases + Variants ──
  console.log("💰 Deleting existing pricing phases...");
  await prisma.pricingPhase.deleteMany({ where: { eventId: event.id } });

  type VariantTranslations = Record<
    Language,
    { name: string; description: string }
  >;

  const variants: Array<{
    name: string;
    distanceKm: number;
    elevationGainM: number;
    maxParticipants: number;
    cutoffTimeHours: number | null;
    startTime: string;
    description: string;
    translations: VariantTranslations;
    pricingPhases: Array<{
      name: string;
      startDate: Date;
      endDate: Date;
      price: number;
      currency: Currency;
      note: string;
    }>;
  }> = [
    // ── Trail Longo 30K ──
    {
      name: "Trail Longo 30K",
      distanceKm: 30,
      elevationGainM: 1500,
      maxParticipants: 150,
      cutoffTimeHours: 7,
      startTime: "08:30",
      description:
        "Prova competitiva de trail running com 30 km e 1500m D+. Tempo limite 7 horas. Mínimo 16 anos.",
      translations: {
        [Language.pt]: {
          name: "Trail Longo 30K",
          description:
            "Prova competitiva de trail running com ~30 km e D+ 1500m. Tempo limite: 7 horas. Inclui chip de cronometragem, medalha de finisher, kit (t-shirt + buff). Mínimo 16 anos.",
        },
        [Language.en]: {
          name: "Long Trail 30K",
          description:
            "Competitive trail running race with ~30 km and D+ 1500m. Time limit: 7 hours. Includes timing chip, finisher medal, kit (t-shirt + buff). Minimum age 16.",
        },
        [Language.es]: {
          name: "Trail Largo 30K",
          description:
            "Prueba competitiva de trail running con ~30 km y D+ 1500m. Tiempo límite: 7 horas. Incluye chip de cronometraje, medalla de finisher, kit (camiseta + buff). Mínimo 16 años.",
        },
        [Language.fr]: {
          name: "Trail Long 30K",
          description:
            "Épreuve compétitive de trail running avec ~30 km et D+ 1500m. Temps limite : 7 heures. Inclut puce de chronométrage, médaille finisher, kit (t-shirt + buff). Âge minimum 16 ans.",
        },
        [Language.de]: {
          name: "Langer Trail 30K",
          description:
            "Wettkampf-Trailrunning-Rennen mit ~30 km und D+ 1500m. Zeitlimit: 7 Stunden. Enthält Zeitmess-Chip, Finisher-Medaille, Kit (T-Shirt + Buff). Mindestalter 16 Jahre.",
        },
        [Language.it]: {
          name: "Trail Lungo 30K",
          description:
            "Gara competitiva di trail running con ~30 km e D+ 1500m. Limite di tempo: 7 ore. Include chip di cronometraggio, medaglia finisher, kit (t-shirt + buff). Età minima 16 anni.",
        },
      },
      pricingPhases: [
        {
          name: "Trail Longo 30K - Fase Promocional",
          startDate: new Date("2025-12-20T00:00:00Z"),
          endDate: new Date("2025-12-22T23:59:59Z"),
          price: 19,
          currency: Currency.EUR,
          note: "Fase Promocional (20-22 dezembro 2025)",
        },
        {
          name: "Trail Longo 30K - 1ª Fase",
          startDate: new Date("2025-12-23T00:00:00Z"),
          endDate: new Date("2026-01-31T23:59:59Z"),
          price: 20,
          currency: Currency.EUR,
          note: "1ª Fase (23 dezembro 2025 – 31 janeiro 2026)",
        },
        {
          name: "Trail Longo 30K - 2ª Fase",
          startDate: new Date("2026-02-01T00:00:00Z"),
          endDate: new Date("2026-02-28T23:59:59Z"),
          price: 22,
          currency: Currency.EUR,
          note: "2ª Fase (1–28 fevereiro 2026)",
        },
        {
          name: "Trail Longo 30K - 3ª Fase",
          startDate: new Date("2026-03-01T00:00:00Z"),
          endDate: new Date("2026-03-31T23:59:59Z"),
          price: 24,
          currency: Currency.EUR,
          note: "3ª Fase (1–31 março 2026)",
        },
      ],
    },
    // ── Trail Curto 17K ──
    {
      name: "Trail Curto 17K",
      distanceKm: 17,
      elevationGainM: 900,
      maxParticipants: 200,
      cutoffTimeHours: null,
      startTime: "09:15",
      description:
        "Prova competitiva de trail running com 17 km e 900m D+. Sem tempo limite. Mínimo 16 anos.",
      translations: {
        [Language.pt]: {
          name: "Trail Curto 17K",
          description:
            "Prova competitiva de trail running com ~17 km e D+ 900m. Sem tempo limite. Inclui chip de cronometragem, medalha de finisher, kit (t-shirt + buff). Mínimo 16 anos.",
        },
        [Language.en]: {
          name: "Short Trail 17K",
          description:
            "Competitive trail running race with ~17 km and D+ 900m. No time limit. Includes timing chip, finisher medal, kit (t-shirt + buff). Minimum age 16.",
        },
        [Language.es]: {
          name: "Trail Corto 17K",
          description:
            "Prueba competitiva de trail running con ~17 km y D+ 900m. Sin tiempo límite. Incluye chip de cronometraje, medalla de finisher, kit (camiseta + buff). Mínimo 16 años.",
        },
        [Language.fr]: {
          name: "Trail Court 17K",
          description:
            "Épreuve compétitive de trail running avec ~17 km et D+ 900m. Sans limite de temps. Inclut puce de chronométrage, médaille finisher, kit (t-shirt + buff). Âge minimum 16 ans.",
        },
        [Language.de]: {
          name: "Kurzer Trail 17K",
          description:
            "Wettkampf-Trailrunning-Rennen mit ~17 km und D+ 900m. Kein Zeitlimit. Enthält Zeitmess-Chip, Finisher-Medaille, Kit (T-Shirt + Buff). Mindestalter 16 Jahre.",
        },
        [Language.it]: {
          name: "Trail Corto 17K",
          description:
            "Gara competitiva di trail running con ~17 km e D+ 900m. Senza limite di tempo. Include chip di cronometraggio, medaglia finisher, kit (t-shirt + buff). Età minima 16 anni.",
        },
      },
      pricingPhases: [
        {
          name: "Trail Curto 17K - Fase Promocional",
          startDate: new Date("2025-12-20T00:00:00Z"),
          endDate: new Date("2025-12-22T23:59:59Z"),
          price: 17,
          currency: Currency.EUR,
          note: "Fase Promocional (20-22 dezembro 2025)",
        },
        {
          name: "Trail Curto 17K - 1ª Fase",
          startDate: new Date("2025-12-23T00:00:00Z"),
          endDate: new Date("2026-01-31T23:59:59Z"),
          price: 18,
          currency: Currency.EUR,
          note: "1ª Fase (23 dezembro 2025 – 31 janeiro 2026)",
        },
        {
          name: "Trail Curto 17K - 2ª Fase",
          startDate: new Date("2026-02-01T00:00:00Z"),
          endDate: new Date("2026-02-28T23:59:59Z"),
          price: 20,
          currency: Currency.EUR,
          note: "2ª Fase (1–28 fevereiro 2026)",
        },
        {
          name: "Trail Curto 17K - 3ª Fase",
          startDate: new Date("2026-03-01T00:00:00Z"),
          endDate: new Date("2026-03-31T23:59:59Z"),
          price: 22,
          currency: Currency.EUR,
          note: "3ª Fase (1–31 março 2026)",
        },
      ],
    },
    // ── Mini Trail 13K ──
    {
      name: "Mini Trail 13K",
      distanceKm: 13,
      elevationGainM: 600,
      maxParticipants: 150,
      cutoffTimeHours: null,
      startTime: "09:30",
      description:
        "Prova competitiva de trail running com 13 km e 600m D+. Sem tempo limite. Mínimo 16 anos.",
      translations: {
        [Language.pt]: {
          name: "Mini Trail 13K",
          description:
            "Prova competitiva de trail running com ~13 km e D+ 600m. Sem tempo limite. Inclui chip de cronometragem, medalha de finisher, kit (t-shirt + buff). Mínimo 16 anos.",
        },
        [Language.en]: {
          name: "Mini Trail 13K",
          description:
            "Competitive trail running race with ~13 km and D+ 600m. No time limit. Includes timing chip, finisher medal, kit (t-shirt + buff). Minimum age 16.",
        },
        [Language.es]: {
          name: "Mini Trail 13K",
          description:
            "Prueba competitiva de trail running con ~13 km y D+ 600m. Sin tiempo límite. Incluye chip de cronometraje, medalla de finisher, kit (camiseta + buff). Mínimo 16 años.",
        },
        [Language.fr]: {
          name: "Mini Trail 13K",
          description:
            "Épreuve compétitive de trail running avec ~13 km et D+ 600m. Sans limite de temps. Inclut puce de chronométrage, médaille finisher, kit (t-shirt + buff). Âge minimum 16 ans.",
        },
        [Language.de]: {
          name: "Mini Trail 13K",
          description:
            "Wettkampf-Trailrunning-Rennen mit ~13 km und D+ 600m. Kein Zeitlimit. Enthält Zeitmess-Chip, Finisher-Medaille, Kit (T-Shirt + Buff). Mindestalter 16 Jahre.",
        },
        [Language.it]: {
          name: "Mini Trail 13K",
          description:
            "Gara competitiva di trail running con ~13 km e D+ 600m. Senza limite di tempo. Include chip di cronometraggio, medaglia finisher, kit (t-shirt + buff). Età minima 16 anni.",
        },
      },
      pricingPhases: [
        {
          name: "Mini Trail 13K - Fase Promocional",
          startDate: new Date("2025-12-20T00:00:00Z"),
          endDate: new Date("2025-12-22T23:59:59Z"),
          price: 15,
          currency: Currency.EUR,
          note: "Fase Promocional (20-22 dezembro 2025)",
        },
        {
          name: "Mini Trail 13K - 1ª Fase",
          startDate: new Date("2025-12-23T00:00:00Z"),
          endDate: new Date("2026-01-31T23:59:59Z"),
          price: 16,
          currency: Currency.EUR,
          note: "1ª Fase (23 dezembro 2025 – 31 janeiro 2026)",
        },
        {
          name: "Mini Trail 13K - 2ª Fase",
          startDate: new Date("2026-02-01T00:00:00Z"),
          endDate: new Date("2026-02-28T23:59:59Z"),
          price: 18,
          currency: Currency.EUR,
          note: "2ª Fase (1–28 fevereiro 2026)",
        },
        {
          name: "Mini Trail 13K - 3ª Fase",
          startDate: new Date("2026-03-01T00:00:00Z"),
          endDate: new Date("2026-03-31T23:59:59Z"),
          price: 20,
          currency: Currency.EUR,
          note: "3ª Fase (1–31 março 2026)",
        },
      ],
    },
    // ── Caminhada 10K ──
    {
      name: "Caminhada 10K",
      distanceKm: 10,
      elevationGainM: 400,
      maxParticipants: 250,
      cutoffTimeHours: null,
      startTime: "09:45",
      description:
        "Percurso não competitivo de caminhada com 10 km e 400m D+. Sem tempo limite. Mínimo 10 anos.",
      translations: {
        [Language.pt]: {
          name: "Caminhada 10K",
          description:
            "Percurso não competitivo de caminhada com ~10 km e D+ 400m. Sem tempo limite. Inclui kit (t-shirt + buff). Mínimo 10 anos (crianças dos 10-14 anos acompanhadas por adulto).",
        },
        [Language.en]: {
          name: "Walking 10K",
          description:
            "Non-competitive walking route with ~10 km and D+ 400m. No time limit. Includes kit (t-shirt + buff). Minimum age 10 (children 10-14 must be accompanied by an adult).",
        },
        [Language.es]: {
          name: "Caminata 10K",
          description:
            "Recorrido no competitivo de senderismo con ~10 km y D+ 400m. Sin tiempo límite. Incluye kit (camiseta + buff). Mínimo 10 años (niños de 10-14 años deben ir acompañados por un adulto).",
        },
        [Language.fr]: {
          name: "Marche 10K",
          description:
            "Parcours de marche non compétitif avec ~10 km et D+ 400m. Sans limite de temps. Inclut kit (t-shirt + buff). Âge minimum 10 ans (enfants de 10-14 ans accompagnés par un adulte).",
        },
        [Language.de]: {
          name: "Wanderung 10K",
          description:
            "Nicht kompetitive Wanderroute mit ~10 km und D+ 400m. Kein Zeitlimit. Enthält Kit (T-Shirt + Buff). Mindestalter 10 Jahre (Kinder 10-14 Jahre müssen von einem Erwachsenen begleitet werden).",
        },
        [Language.it]: {
          name: "Camminata 10K",
          description:
            "Percorso non competitivo di camminata con ~10 km e D+ 400m. Senza limite di tempo. Include kit (t-shirt + buff). Età minima 10 anni (bambini 10-14 anni devono essere accompagnati da un adulto).",
        },
      },
      pricingPhases: [
        {
          name: "Caminhada 10K - Fase Promocional",
          startDate: new Date("2025-12-20T00:00:00Z"),
          endDate: new Date("2025-12-22T23:59:59Z"),
          price: 11,
          currency: Currency.EUR,
          note: "Fase Promocional (20-22 dezembro 2025)",
        },
        {
          name: "Caminhada 10K - 1ª/2ª/3ª Fase",
          startDate: new Date("2025-12-23T00:00:00Z"),
          endDate: new Date("2026-03-31T23:59:59Z"),
          price: 12,
          currency: Currency.EUR,
          note: "1ª, 2ª e 3ª Fases – preço fixo (23 dezembro 2025 – 31 março 2026)",
        },
      ],
    },
  ];

  console.log("🏃 Creating variants and pricing phases...");
  for (const variantData of variants) {
    const {
      pricingPhases,
      translations: variantTranslations,
      ...variantInfo
    } = variantData;

    const variant = await prisma.eventVariant.create({
      data: {
        ...variantInfo,
        eventId: event.id,
      },
    });

    console.log(`   ✅ Created variant: ${variant.name}`);

    // Variant translations
    for (const lang of languages) {
      const vt = variantTranslations[lang];
      await prisma.eventVariantTranslation.upsert({
        where: {
          variantId_language: { variantId: variant.id, language: lang },
        },
        update: { name: vt.name, description: vt.description },
        create: {
          variantId: variant.id,
          language: lang,
          name: vt.name,
          description: vt.description,
        },
      });
    }

    // Pricing phases — linked to eventId
    for (const phase of pricingPhases) {
      await prisma.pricingPhase.create({
        data: {
          eventId: event.id,
          name: phase.name,
          startDate: phase.startDate,
          endDate: phase.endDate,
          price: phase.price,
          currency: phase.currency,
          note: phase.note,
        },
      });
    }

    console.log(
      `   - Created ${pricingPhases.length} pricing phase(s) for ${variant.name}`
    );
  }

  // ── FAQs ──
  console.log("❓ Creating FAQs...");

  const faqs: Array<{
    order: number;
    translations: Record<Language, { question: string; answer: string }>;
  }> = [
    {
      order: 1,
      translations: {
        [Language.pt]: {
          question: "O que é o Trail Rota dos Piratas?",
          answer:
            "O Trail Rota dos Piratas é a 2ª edição de um evento de trail running e caminhada, organizado pelo Centro Social e Cultural de Ribamar, com apoio da Câmara Municipal de Lourinhã. Realiza-se a 17 de maio de 2026 em Ribamar, Lourinhã, com percursos costeiros e florestais até 30 km.",
        },
        [Language.en]: {
          question: "What is the Trail Rota dos Piratas?",
          answer:
            "The Trail Rota dos Piratas is the 2nd edition of a trail running and walking event, organized by the Centro Social e Cultural de Ribamar, with support from the Municipality of Lourinhã. It takes place on May 17, 2026 in Ribamar, Lourinhã, with coastal and forest routes up to 30 km.",
        },
        [Language.es]: {
          question: "¿Qué es el Trail Rota dos Piratas?",
          answer:
            "El Trail Rota dos Piratas es la 2ª edición de un evento de trail running y senderismo, organizado por el Centro Social y Cultural de Ribamar, con el apoyo del Ayuntamiento de Lourinhã. Se celebra el 17 de mayo de 2026 en Ribamar, Lourinhã, con recorridos costeros y forestales de hasta 30 km.",
        },
        [Language.fr]: {
          question: "Qu'est-ce que le Trail Rota dos Piratas ?",
          answer:
            "Le Trail Rota dos Piratas est la 2e édition d'un événement de trail running et de marche, organisé par le Centro Social e Cultural de Ribamar, avec le soutien de la Mairie de Lourinhã. Il se déroule le 17 mai 2026 à Ribamar, Lourinhã, avec des parcours côtiers et forestiers jusqu'à 30 km.",
        },
        [Language.de]: {
          question: "Was ist der Trail Rota dos Piratas?",
          answer:
            "Der Trail Rota dos Piratas ist die 2. Ausgabe eines Trailrunning- und Wanderveranstaltung, organisiert vom Centro Social e Cultural de Ribamar, unterstützt von der Gemeinde Lourinhã. Er findet am 17. Mai 2026 in Ribamar, Lourinhã statt, mit Küsten- und Waldwegen bis zu 30 km.",
        },
        [Language.it]: {
          question: "Cos'è il Trail Rota dos Piratas?",
          answer:
            "Il Trail Rota dos Piratas è la 2ª edizione di un evento di trail running e camminata, organizzato dal Centro Social e Cultural de Ribamar, con il supporto del Comune di Lourinhã. Si svolge il 17 maggio 2026 a Ribamar, Lourinhã, con percorsi costieri e forestali fino a 30 km.",
        },
      },
    },
    {
      order: 2,
      translations: {
        [Language.pt]: {
          question: "Quais as provas disponíveis e distâncias?",
          answer:
            "Existem 4 provas: Trail Longo 30K (D+ 1500m, 7h limite), Trail Curto 17K (D+ 900m), Mini Trail 13K (D+ 600m) e Caminhada 10K (D+ 400m). Todas partem e chegam à Praça de Santa Maria, em Ribamar.",
        },
        [Language.en]: {
          question: "What races are available and what are the distances?",
          answer:
            "There are 4 races: Long Trail 30K (D+ 1500m, 7h limit), Short Trail 17K (D+ 900m), Mini Trail 13K (D+ 600m) and Walking 10K (D+ 400m). All start and finish at Praça de Santa Maria, in Ribamar.",
        },
        [Language.es]: {
          question: "¿Qué pruebas hay disponibles y cuáles son las distancias?",
          answer:
            "Hay 4 pruebas: Trail Largo 30K (D+ 1500m, límite 7h), Trail Corto 17K (D+ 900m), Mini Trail 13K (D+ 600m) y Caminata 10K (D+ 400m). Todas salen y llegan a la Praça de Santa Maria, en Ribamar.",
        },
        [Language.fr]: {
          question:
            "Quelles épreuves sont disponibles et quelles sont les distances ?",
          answer:
            "Il y a 4 épreuves : Trail Long 30K (D+ 1500m, limite 7h), Trail Court 17K (D+ 900m), Mini Trail 13K (D+ 600m) et Marche 10K (D+ 400m). Toutes partent et arrivent à la Praça de Santa Maria, à Ribamar.",
        },
        [Language.de]: {
          question:
            "Welche Rennen sind verfügbar und welche Distanzen gibt es?",
          answer:
            "Es gibt 4 Rennen: Langer Trail 30K (D+ 1500m, 7h Limit), Kurzer Trail 17K (D+ 900m), Mini Trail 13K (D+ 600m) und Wanderung 10K (D+ 400m). Alle starten und enden am Praça de Santa Maria in Ribamar.",
        },
        [Language.it]: {
          question: "Quali gare sono disponibili e quali sono le distanze?",
          answer:
            "Ci sono 4 gare: Trail Lungo 30K (D+ 1500m, limite 7h), Trail Corto 17K (D+ 900m), Mini Trail 13K (D+ 600m) e Camminata 10K (D+ 400m). Tutte partono e arrivano alla Praça de Santa Maria, a Ribamar.",
        },
      },
    },
    {
      order: 3,
      translations: {
        [Language.pt]: {
          question: "Quando encerram as inscrições?",
          answer:
            "As inscrições encerram a 31 de março de 2026 ou quando forem atingidas as 750 inscrições pagas. As inscrições são feitas no site do Trilho Perdido (trilhoperdido.com).",
        },
        [Language.en]: {
          question: "When do registrations close?",
          answer:
            "Registrations close on March 31, 2026 or when 750 paid registrations are reached. Registrations are made on the Trilho Perdido website (trilhoperdido.com).",
        },
        [Language.es]: {
          question: "¿Cuándo cierran las inscripciones?",
          answer:
            "Las inscripciones cierran el 31 de marzo de 2026 o cuando se alcancen las 750 inscripciones pagadas. Las inscripciones se realizan en el sitio web de Trilho Perdido (trilhoperdido.com).",
        },
        [Language.fr]: {
          question: "Quand les inscriptions ferment-elles ?",
          answer:
            "Les inscriptions ferment le 31 mars 2026 ou lorsque 750 inscriptions payées sont atteintes. Les inscriptions se font sur le site de Trilho Perdido (trilhoperdido.com).",
        },
        [Language.de]: {
          question: "Wann schließen die Anmeldungen?",
          answer:
            "Anmeldungen schließen am 31. März 2026 oder wenn 750 bezahlte Anmeldungen erreicht sind. Anmeldungen erfolgen auf der Trilho Perdido Website (trilhoperdido.com).",
        },
        [Language.it]: {
          question: "Quando chiudono le iscrizioni?",
          answer:
            "Le iscrizioni chiudono il 31 marzo 2026 o quando vengono raggiunte le 750 iscrizioni pagate. Le iscrizioni si effettuano sul sito di Trilho Perdido (trilhoperdido.com).",
        },
      },
    },
    {
      order: 4,
      translations: {
        [Language.pt]: {
          question: "O que está incluído na inscrição?",
          answer:
            "Estão incluídos: abastecimentos durante a prova, reforço alimentar no final, seguro desportivo, kit do atleta (t-shirt técnica + buff + dorsal com chip para trail), acesso aos duches e medalha de finisher para trail. O kit é garantido para inscrições até 31 de março de 2026.",
        },
        [Language.en]: {
          question: "What is included in the registration?",
          answer:
            "Included: food and water stations during the race, post-race refreshments, sports insurance, athlete kit (technical t-shirt + buff + race bib with chip for trail), shower access, and finisher medal for trail. The kit is guaranteed for registrations until March 31, 2026.",
        },
        [Language.es]: {
          question: "¿Qué está incluido en la inscripción?",
          answer:
            "Incluye: avituallamientos durante la prueba, reposición al final, seguro deportivo, kit del atleta (camiseta técnica + buff + dorsal con chip para trail), acceso a duchas y medalla de finisher para trail. El kit está garantizado para inscripciones hasta el 31 de marzo de 2026.",
        },
        [Language.fr]: {
          question: "Qu'est-ce qui est inclus dans l'inscription ?",
          answer:
            "Inclus : ravitaillements pendant la course, collation finale, assurance sportive, kit athlète (t-shirt technique + buff + dossard avec puce pour trail), accès aux douches et médaille finisher pour trail. Le kit est garanti pour les inscriptions jusqu'au 31 mars 2026.",
        },
        [Language.de]: {
          question: "Was ist in der Anmeldung enthalten?",
          answer:
            "Enthalten: Verpflegungsstationen während des Rennens, Erfrischungen nach dem Rennen, Sportversicherung, Athletenpaket (technisches T-Shirt + Buff + Startnummer mit Chip für Trail), Duschzugang und Finisher-Medaille für Trail. Das Kit ist für Anmeldungen bis 31. März 2026 garantiert.",
        },
        [Language.it]: {
          question: "Cosa è incluso nell'iscrizione?",
          answer:
            "Incluso: ristori durante la gara, rinfresco finale, assicurazione sportiva, kit atleta (t-shirt tecnica + buff + pettorale con chip per trail), accesso alle docce e medaglia finisher per trail. Il kit è garantito per le iscrizioni fino al 31 marzo 2026.",
        },
      },
    },
    {
      order: 5,
      translations: {
        [Language.pt]: {
          question: "Qual é o material obrigatório?",
          answer:
            "Material obrigatório para todas as provas de trail: dorsal visível durante todo o percurso, reservatório de hidratação (mínimo 0,5L) e telemóvel operacional. A organização pode verificar o material à partida, chegada e durante o percurso. A não apresentação pode implicar desclassificação.",
        },
        [Language.en]: {
          question: "What is the mandatory equipment?",
          answer:
            "Mandatory equipment for all trail races: visible race bib throughout the course, hydration reservoir (minimum 0.5L) and operational mobile phone. The organization may check equipment at start, finish and during the race. Failure to present it may result in disqualification.",
        },
        [Language.es]: {
          question: "¿Cuál es el material obligatorio?",
          answer:
            "Material obligatorio para todas las pruebas de trail: dorsal visible durante todo el recorrido, depósito de hidratación (mínimo 0,5L) y teléfono móvil operativo. La organización puede verificar el material en la salida, llegada y durante el recorrido. La no presentación puede implicar descalificación.",
        },
        [Language.fr]: {
          question: "Quel est le matériel obligatoire ?",
          answer:
            "Matériel obligatoire pour toutes les épreuves de trail : dossard visible tout au long du parcours, réservoir d'hydratation (minimum 0,5L) et téléphone portable opérationnel. L'organisation peut vérifier le matériel au départ, à l'arrivée et pendant le parcours. La non-présentation peut entraîner une disqualification.",
        },
        [Language.de]: {
          question: "Was ist die Pflichtausrüstung?",
          answer:
            "Pflichtausrüstung für alle Trailrennen: sichtbare Startnummer während der gesamten Strecke, Hydrationsbehälter (mindestens 0,5L) und betriebsfähiges Mobiltelefon. Die Organisation kann die Ausrüstung am Start, Ziel und während des Rennens prüfen. Nichtvorlage kann zur Disqualifikation führen.",
        },
        [Language.it]: {
          question: "Qual è il materiale obbligatorio?",
          answer:
            "Materiale obbligatorio per tutte le gare di trail: pettorale visibile durante tutto il percorso, serbatoio di idratazione (minimo 0,5L) e cellulare funzionante. L'organizzazione può verificare il materiale alla partenza, all'arrivo e durante il percorso. La mancata presentazione può comportare la squalifica.",
        },
      },
    },
    {
      order: 6,
      translations: {
        [Language.pt]: {
          question: "Qual é a política de reembolso?",
          answer:
            "Para pedidos de cancelamento efetuados até 1 de março de 2026, é devolvido 50% do valor da inscrição. A partir de 1 de março de 2026, não haverá qualquer reembolso. As inscrições não são transitadas para edições futuras, e não há devolução de diferença em caso de troca para distância mais curta.",
        },
        [Language.en]: {
          question: "What is the refund policy?",
          answer:
            "For cancellation requests made until March 1, 2026, 50% of the registration fee is refunded. From March 1, 2026, there are no refunds. Registrations are not carried over to future editions, and there is no refund for switching to a shorter distance.",
        },
        [Language.es]: {
          question: "¿Cuál es la política de reembolso?",
          answer:
            "Para solicitudes de cancelación hasta el 1 de marzo de 2026, se devuelve el 50% del importe de inscripción. A partir del 1 de marzo de 2026, no habrá reembolsos. Las inscripciones no se trasladan a futuras ediciones, y no hay devolución de diferencia en caso de cambio a distancia más corta.",
        },
        [Language.fr]: {
          question: "Quelle est la politique de remboursement ?",
          answer:
            "Pour les demandes d'annulation effectuées jusqu'au 1er mars 2026, 50% du montant d'inscription est remboursé. À partir du 1er mars 2026, aucun remboursement n'est accordé. Les inscriptions ne sont pas reportées aux éditions futures, et il n'y a pas de remboursement de la différence en cas de changement vers une distance plus courte.",
        },
        [Language.de]: {
          question: "Was ist die Erstattungsrichtlinie?",
          answer:
            "Bei Stornierungsanfragen bis zum 1. März 2026 werden 50% der Anmeldegebühr erstattet. Ab dem 1. März 2026 gibt es keine Erstattungen. Anmeldungen werden nicht auf zukünftige Ausgaben übertragen, und es gibt keine Differenzerstattung beim Wechsel zu einer kürzeren Distanz.",
        },
        [Language.it]: {
          question: "Qual è la politica di rimborso?",
          answer:
            "Per richieste di cancellazione effettuate fino al 1° marzo 2026, viene rimborsato il 50% dell'importo di iscrizione. Dal 1° marzo 2026 non ci sono rimborsi. Le iscrizioni non vengono trasferite alle edizioni future, e non c'è rimborso della differenza in caso di cambio a distanza più corta.",
        },
      },
    },
    {
      order: 7,
      translations: {
        [Language.pt]: {
          question: "Onde e quando é o secretariado?",
          answer:
            "O secretariado funciona no dia 16 de maio (sábado) das 14h00 às 20h00, e no dia 17 de maio (domingo) das 06h30 às 09h30, em local próximo da partida da prova em Ribamar. Todos os atletas devem ter documento de identificação. Outro atleta pode levantar o kit mediante apresentação do comprovativo de inscrição.",
        },
        [Language.en]: {
          question: "Where and when is the registration desk?",
          answer:
            "The registration desk is open on May 16 (Saturday) from 14:00 to 20:00, and on May 17 (Sunday) from 06:30 to 09:30, near the race start in Ribamar. All athletes must carry identification. Another athlete can collect the kit by presenting proof of registration.",
        },
        [Language.es]: {
          question: "¿Dónde y cuándo es el secretariado?",
          answer:
            "El secretariado funciona el 16 de mayo (sábado) de 14:00 a 20:00, y el 17 de mayo (domingo) de 06:30 a 09:30, cerca de la salida de la prueba en Ribamar. Todos los atletas deben llevar documento de identificación. Otro atleta puede recoger el kit presentando el comprobante de inscripción.",
        },
        [Language.fr]: {
          question: "Où et quand est le secrétariat ?",
          answer:
            "Le secrétariat est ouvert le 16 mai (samedi) de 14h00 à 20h00, et le 17 mai (dimanche) de 06h30 à 09h30, près du départ de la course à Ribamar. Tous les athlètes doivent avoir une pièce d'identité. Un autre athlète peut récupérer le kit en présentant la preuve d'inscription.",
        },
        [Language.de]: {
          question: "Wo und wann ist die Anmeldung?",
          answer:
            "Die Anmeldung ist am 16. Mai (Samstag) von 14:00 bis 20:00 Uhr und am 17. Mai (Sonntag) von 06:30 bis 09:30 Uhr, in der Nähe des Rennstarts in Ribamar, geöffnet. Alle Athleten müssen einen Ausweis dabei haben. Ein anderer Athlet kann das Kit durch Vorlage des Anmeldenachweises abholen.",
        },
        [Language.it]: {
          question: "Dove e quando è la segreteria?",
          answer:
            "La segreteria è aperta il 16 maggio (sabato) dalle 14:00 alle 20:00, e il 17 maggio (domenica) dalle 06:30 alle 09:30, vicino alla partenza della gara a Ribamar. Tutti gli atleti devono avere un documento di identità. Un altro atleta può ritirare il kit presentando la ricevuta di iscrizione.",
        },
      },
    },
    {
      order: 8,
      translations: {
        [Language.pt]: {
          question: "Existem prémios e troféus?",
          answer:
            "Sim. Há troféu para os 3 primeiros classificados de cada escalão (M/F) nas provas de Mini Trail, Trail Curto e Trail Longo. Há prémio para os 3 primeiros classificados gerais (M/F) de cada prova. Prémio para as 3 melhores equipas. Todos os participantes das provas de trail e caminhada recebem medalha de finisher.",
        },
        [Language.en]: {
          question: "Are there prizes and trophies?",
          answer:
            "Yes. There are trophies for the top 3 in each age group (M/F) in Mini Trail, Short Trail, and Long Trail. There are prizes for the top 3 overall (M/F) in each race. Prize for the top 3 teams. All trail and walking participants receive a finisher medal.",
        },
        [Language.es]: {
          question: "¿Hay premios y trofeos?",
          answer:
            "Sí. Hay trofeo para los 3 primeros de cada escalón (M/F) en Mini Trail, Trail Corto y Trail Largo. Hay premio para los 3 primeros clasificados generales (M/F) de cada prueba. Premio para los 3 mejores equipos. Todos los participantes de trail y caminata reciben medalla de finisher.",
        },
        [Language.fr]: {
          question: "Y a-t-il des prix et des trophées ?",
          answer:
            "Oui. Il y a des trophées pour les 3 premiers de chaque catégorie d'âge (M/F) dans le Mini Trail, le Trail Court et le Trail Long. Il y a des prix pour les 3 premiers au classement général (M/F) de chaque épreuve. Prix pour les 3 meilleures équipes. Tous les participants du trail et de la marche reçoivent une médaille finisher.",
        },
        [Language.de]: {
          question: "Gibt es Preise und Trophäen?",
          answer:
            "Ja. Es gibt Trophäen für die Top 3 in jeder Altersklasse (M/F) im Mini Trail, Kurzen Trail und Langen Trail. Es gibt Preise für die Top 3 der Gesamtwertung (M/F) jedes Rennens. Preis für die Top 3 Teams. Alle Trail- und Wanderteilnehmer erhalten eine Finisher-Medaille.",
        },
        [Language.it]: {
          question: "Ci sono premi e trofei?",
          answer:
            "Sì. Ci sono trofei per i primi 3 di ogni categoria d'età (M/F) nel Mini Trail, Trail Corto e Trail Lungo. Ci sono premi per i primi 3 classificati assoluti (M/F) di ogni gara. Premio per i 3 migliori team. Tutti i partecipanti di trail e camminata ricevono una medaglia finisher.",
        },
      },
    },
    {
      order: 9,
      translations: {
        [Language.pt]: {
          question: "Há almoço disponível no evento?",
          answer:
            "Sim. Há almoço de participante disponível por 5,50€ (opcional) e almoço de acompanhante por 10,00€ (opcional). O almoço e entrega de prémios está previsto para as 12h00 do dia 17 de maio. A opção de almoço deve ser selecionada no momento da inscrição.",
        },
        [Language.en]: {
          question: "Is lunch available at the event?",
          answer:
            "Yes. Participant lunch is available for €5.50 (optional) and companion lunch for €10.00 (optional). Lunch and prize giving is scheduled for 12:00 on May 17. The lunch option must be selected during registration.",
        },
        [Language.es]: {
          question: "¿Hay almuerzo disponible en el evento?",
          answer:
            "Sí. Almuerzo de participante disponible por 5,50€ (opcional) y almuerzo de acompañante por 10,00€ (opcional). El almuerzo y entrega de premios está previsto para las 12:00 del 17 de mayo. La opción de almuerzo debe seleccionarse en el momento de la inscripción.",
        },
        [Language.fr]: {
          question: "Y a-t-il un déjeuner disponible à l'événement ?",
          answer:
            "Oui. Déjeuner participant disponible pour 5,50€ (optionnel) et déjeuner accompagnateur pour 10,00€ (optionnel). Le déjeuner et la remise des prix est prévu à 12h00 le 17 mai. L'option déjeuner doit être sélectionnée lors de l'inscription.",
        },
        [Language.de]: {
          question: "Gibt es ein Mittagessen bei der Veranstaltung?",
          answer:
            "Ja. Teilnehmermittagessen für 5,50€ (optional) und Begleitmittagessen für 10,00€ (optional). Mittagessen und Siegerehrung ist für 12:00 Uhr am 17. Mai geplant. Die Mittagessen-Option muss bei der Anmeldung ausgewählt werden.",
        },
        [Language.it]: {
          question: "C'è un pranzo disponibile all'evento?",
          answer:
            "Sì. Pranzo partecipante disponibile per 5,50€ (opzionale) e pranzo accompagnatore per 10,00€ (opzionale). Pranzo e premiazione previsti per le 12:00 del 17 maggio. L'opzione pranzo deve essere selezionata al momento dell'iscrizione.",
        },
      },
    },
    {
      order: 10,
      translations: {
        [Language.pt]: {
          question: "Como contactar a organização?",
          answer:
            "Para questões relacionadas com a prova: info@trailrotadospiratas.pt. Para questões relacionadas com inscrições: info@trailrotadospiratas.pt ou infotrilhoperdido@gmail.com. A organização não se responsabiliza por respostas a outras formas de contacto (redes sociais, emails pessoais).",
        },
        [Language.en]: {
          question: "How to contact the organization?",
          answer:
            "For race-related questions: info@trailrotadospiratas.pt. For registration-related questions: info@trailrotadospiratas.pt or infotrilhoperdido@gmail.com. The organization is not responsible for responding to other forms of contact (social media, personal emails).",
        },
        [Language.es]: {
          question: "¿Cómo contactar con la organización?",
          answer:
            "Para cuestiones relacionadas con la prueba: info@trailrotadospiratas.pt. Para cuestiones relacionadas con inscripciones: info@trailrotadospiratas.pt o infotrilhoperdido@gmail.com. La organización no se responsabiliza de responder a otras formas de contacto (redes sociales, emails personales).",
        },
        [Language.fr]: {
          question: "Comment contacter l'organisation ?",
          answer:
            "Pour les questions liées à la course : info@trailrotadospiratas.pt. Pour les questions liées aux inscriptions : info@trailrotadospiratas.pt ou infotrilhoperdido@gmail.com. L'organisation n'est pas responsable de répondre à d'autres formes de contact (réseaux sociaux, emails personnels).",
        },
        [Language.de]: {
          question: "Wie kann man die Organisation kontaktieren?",
          answer:
            "Für rennbezogene Fragen: info@trailrotadospiratas.pt. Für anmeldebezogene Fragen: info@trailrotadospiratas.pt oder infotrilhoperdido@gmail.com. Die Organisation ist nicht für Antworten auf andere Kontaktformen (soziale Medien, persönliche E-Mails) verantwortlich.",
        },
        [Language.it]: {
          question: "Come contattare l'organizzazione?",
          answer:
            "Per domande relative alla gara: info@trailrotadospiratas.pt. Per domande relative alle iscrizioni: info@trailrotadospiratas.pt o infotrilhoperdido@gmail.com. L'organizzazione non è responsabile per le risposte ad altre forme di contatto (social media, email personali).",
        },
      },
    },
  ];

  for (const faq of faqs) {
    const createdFaq = await prisma.eventFAQ.create({
      data: {
        eventId: event.id,
        order: faq.order,
        question: faq.translations[Language.pt].question,
        answer: faq.translations[Language.pt].answer,
      },
    });

    for (const lang of languages) {
      await prisma.eventFAQTranslation.create({
        data: {
          faqId: createdFaq.id,
          language: lang,
          question: faq.translations[lang].question,
          answer: faq.translations[lang].answer,
        },
      });
    }
  }

  console.log(`   ✅ Created ${faqs.length} FAQs with 6 language translations`);

  console.log("\n✅ Seed completed successfully!");
  console.log(`
📊 Summary:
- Event: Trail Rota dos Piratas 2026 – 2ª Edição
- Slug: trail-rota-dos-piratas-2026
- Date: 17 de maio de 2026
- Location: Praça de Santa Maria, Ribamar, Lourinhã
- Races: Trail Longo 30K, Trail Curto 17K, Mini Trail 13K, Caminhada 10K
- Limit: 750 inscriptions total
- Registration deadline: 31 março 2026
- Languages: 6 (pt, en, es, fr, de, it)
- Variants: 4
- FAQs: ${faqs.length}
- Organizer: Centro Social e Cultural de Ribamar / Trilho Perdido
- Website: https://www.trilhoperdido.com/evento/Trail-Rota-dos-Piratas
  `);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
