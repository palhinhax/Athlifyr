/**
 * Seed West Fitness Race – Torres Vedras 2026
 * Complete with translations in all 6 languages
 * Idempotent pattern - safe to run multiple times
 *
 * 10 variants | €50 individual | €90 duplas | 19 April 2026
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏋️ Seeding West Fitness Race – Torres Vedras 2026...");

  const languages: Language[] = [
    Language.pt,
    Language.en,
    Language.es,
    Language.fr,
    Language.de,
    Language.it,
  ];

  // ── Description (PT - main) ──
  const descriptionPT = `# 🏋️ West Fitness Race – Torres Vedras 2026

A **West Fitness Race** regressa a Torres Vedras nos dias **18 e 19 de abril de 2026**, no **Pavilhão Multiusos de Torres Vedras**!

Uma competição de **endurance e fitness funcional** que combina corrida com estações de exercício, desafiando os participantes a completar o percurso no menor tempo possível.

---

## 🎯 Formatos de Prova

### 🔥 RACE (Full)
- **8 km de corrida total** intercalada com **8 estações de exercícios**
- O formato completo para atletas que procuram o desafio máximo

### ⚡ SPRINT
- **4 km de corrida total** intercalada com **8 estações de exercícios**
- Formato mais curto e acessível, ideal para quem quer experimentar

---

## 👥 Categorias (10 Provas)

### Full Race
- Individual Masculino
- Individual Feminino
- Duplas Masculinas
- Duplas Femininas
- Duplas Mistas

### Sprint
- Individual Masculino
- Individual Feminino
- Duplas Masculinas
- Duplas Femininas
- Duplas Mistas

---

## 💳 Inscrições

### 🔥 Fase Promocional (até 26 de fevereiro, inclusive)
- Individual: **50 €**
- Duplas: **90 €** (por equipa)

### ⏳ Preço Regular (a partir de 27 de fevereiro)
- Individual: **55 €**
- Duplas: **100 €** (por equipa)

---

## 📋 Secretariado / Check-in

- Abertura às **08h00** no dia da prova
- Check-in obrigatório até **60 minutos** antes da hora de partida

---

## 🏆 Classificação e Prémios

- Classificação por **tempo total** (corrida + estações + penalizações)
- **Pódio** para todas as categorias e formatos
- Prémios para os vencedores da geral (a comunicar antes do evento)
- Arbitragem oficial e sistema de penalizações

---

## 🔄 Política de Devoluções

- Até **22 de março**: devolução de **80%**
- **22 de março a 5 de abril**: devolução de **50%**
- Após **5 de abril**: sem devolução

---

## 📍 Local

**Pavilhão Multiusos de Torres Vedras**
Torres Vedras, Lisboa, Portugal

---

## 💡 O Conceito

A West Fitness Race é uma competição focada em **resistência e força**, onde cada participante é desafiado a superar as estações de exercício intercaladas com segmentos de corrida. O objetivo é simples: completar todo o percurso no menor tempo possível!

Prepara-te para testar os teus limites e viver uma experiência intensa de fitness funcional! 💪`;

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: "west-fitness-race-torres-vedras-2026" },
    update: {
      title: "West Fitness Race – Torres Vedras 2026",
      description: descriptionPT,
      sportTypes: [SportType.HYROX],
      startDate: new Date("2026-04-18T08:00:00Z"),
      endDate: new Date("2026-04-19T20:00:00Z"),
      city: "Torres Vedras",
      country: "Portugal",
      latitude: 39.0912,
      longitude: -9.2584,
      googleMapsUrl: "https://maps.app.goo.gl/PavilhaoMultiusosTorresVedras",
      googleMapsUrl: "https://maps.app.goo.gl/PavilhaoMultiusosTorresVedras",
      externalUrl: "",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-04-17T23:59:59Z"),
    },
    create: {
      title: "West Fitness Race – Torres Vedras 2026",
      slug: "west-fitness-race-torres-vedras-2026",
      description: descriptionPT,
      sportTypes: [SportType.HYROX],
      startDate: new Date("2026-04-18T08:00:00Z"),
      endDate: new Date("2026-04-19T20:00:00Z"),
      city: "Torres Vedras",
      country: "Portugal",
      latitude: 39.0912,
      longitude: -9.2584,
      googleMapsUrl: "https://maps.app.goo.gl/PavilhaoMultiusosTorresVedras",
      externalUrl: "",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-04-17T23:59:59Z"),
    },
  });

  console.log("✅ Event upserted:", event.title);

  // Step 2: Upsert translations for all 6 languages
  const translations = {
    [Language.pt]: {
      title: "West Fitness Race – Torres Vedras 2026",
      description: descriptionPT,
      city: "Torres Vedras",
      metaTitle:
        "West Fitness Race – Torres Vedras 2026 | 18-19 Abril | Athlifyr",
      metaDescription:
        "West Fitness Race 2026 em Torres Vedras, 18 e 19 de abril. Endurance e fitness funcional. Individual (50-55€) ou duplas (90-100€). 5 categorias.",
    },
    [Language.en]: {
      title: "West Fitness Race – Torres Vedras 2026",
      description: `# 🏋️ West Fitness Race – Torres Vedras 2026

The **West Fitness Race** returns to Torres Vedras on **April 18-19, 2026**, at the **Pavilhão Multiusos de Torres Vedras**!

An **endurance and functional fitness** competition that combines running with exercise stations, challenging participants to complete the course in the shortest time possible.

---

## 🎯 Race Formats

### 🔥 RACE (Full)
- **8 km total running** interspersed with **8 exercise stations**
- The complete format for athletes seeking the ultimate challenge

### ⚡ SPRINT
- **4 km total running** interspersed with **8 exercise stations**
- Shorter and more accessible format, ideal for newcomers

---

## 👥 Categories (10 Races)

### Full Race
- Individual Men
- Individual Women
- Men's Doubles
- Women's Doubles
- Mixed Doubles

### Sprint
- Individual Men
- Individual Women
- Men's Doubles
- Women's Doubles
- Mixed Doubles

---

## 💳 Registration

### 🔥 Promotional Phase (until February 26, inclusive)
- Individual: **€50**
- Doubles: **€90** (per team)

### ⏳ Regular Price (from February 27)
- Individual: **€55**
- Doubles: **€100** (per team)

---

## 📋 Registration / Check-in

- Opens at **08:00** on race day
- Mandatory check-in up to **60 minutes** before start time

---

## 🏆 Classification & Prizes

- Classification by **total time** (running + stations + penalties)
- **Podium** for all categories and formats
- Prizes for overall winners (to be announced before the event)
- Official refereeing and penalty system

---

## 🔄 Refund Policy

- Until **March 22**: **80%** refund
- **March 22 to April 5**: **50%** refund
- After **April 5**: no refund

---

## 📍 Location

**Pavilhão Multiusos de Torres Vedras**
Torres Vedras, Lisbon, Portugal

---

## 💡 The Concept

The West Fitness Race is a competition focused on **endurance and strength**, where each participant is challenged to overcome exercise stations interspersed with running segments. The goal is simple: complete the entire course in the shortest time possible! 💪`,
      city: "Torres Vedras",
      metaTitle:
        "West Fitness Race – Torres Vedras 2026 | April 18-19 | Athlifyr",
      metaDescription:
        "West Fitness Race 2026 in Torres Vedras, April 18-19. Endurance and functional fitness. Individual (€50-55) or doubles (€90-100). 5 categories.",
    },
    [Language.es]: {
      title: "West Fitness Race – Torres Vedras 2026",
      description: `# 🏋️ West Fitness Race – Torres Vedras 2026

La **West Fitness Race** regresa a Torres Vedras los días **18 y 19 de abril de 2026**, en el **Pavilhão Multiusos de Torres Vedras**!

Una competición de **endurance y fitness funcional** que combina carrera con estaciones de ejercicio, desafiando a los participantes a completar el recorrido en el menor tiempo posible.

---

## 🎯 Formatos de Carrera

### 🔥 RACE (Completa)
- **8 km de carrera total** intercalada con **8 estaciones de ejercicios**
- El formato completo para atletas que buscan el desafío máximo

### ⚡ SPRINT
- **4 km de carrera total** intercalada con **8 estaciones de ejercicios**
- Formato más corto y accesible, ideal para principiantes

---

## 👥 Categorías (10 Pruebas)

### Full Race
- Individual Masculino
- Individual Femenino
- Duplas Masculinas
- Duplas Femeninas
- Duplas Mixtas

### Sprint
- Individual Masculino
- Individual Femenino
- Duplas Masculinas
- Duplas Femeninas
- Duplas Mixtas

---

## 💳 Inscripciones

### 🔥 Fase Promocional (hasta el 26 de febrero, inclusive)
- Individual: **50 €**
- Duplas: **90 €** (por equipo)

### ⏳ Precio Regular (a partir del 27 de febrero)
- Individual: **55 €**
- Duplas: **100 €** (por equipo)

---

## 📋 Secretaría / Check-in

- Apertura a las **08:00** el día de la prueba
- Check-in obligatorio hasta **60 minutos** antes de la hora de salida

---

## 🏆 Clasificación y Premios

- Clasificación por **tiempo total** (carrera + estaciones + penalizaciones)
- **Podio** para todas las categorías y formatos
- Premios para los ganadores de la general (a comunicar antes del evento)
- Arbitraje oficial y sistema de penalizaciones

---

## 🔄 Política de Devoluciones

- Hasta el **22 de marzo**: devolución del **80%**
- **22 de marzo al 5 de abril**: devolución del **50%**
- Después del **5 de abril**: sin devolución

---

## 📍 Ubicación

**Pavilhão Multiusos de Torres Vedras**
Torres Vedras, Lisboa, Portugal

---

## 💡 El Concepto

La West Fitness Race es una competición enfocada en **resistencia y fuerza**, donde cada participante es desafiado a superar las estaciones de ejercicio intercaladas con segmentos de carrera. ¡El objetivo es simple: completar todo el recorrido en el menor tiempo posible! 💪`,
      city: "Torres Vedras",
      metaTitle:
        "West Fitness Race – Torres Vedras 2026 | 18-19 Abril | Athlifyr",
      metaDescription:
        "West Fitness Race 2026 en Torres Vedras, 18 y 19 de abril. Endurance y fitness funcional. Individual (50-55€) o duplas (90-100€). 5 categorías.",
    },
    [Language.fr]: {
      title: "West Fitness Race – Torres Vedras 2026",
      description: `# 🏋️ West Fitness Race – Torres Vedras 2026

La **West Fitness Race** revient à Torres Vedras les **18 et 19 avril 2026**, au **Pavilhão Multiusos de Torres Vedras** !

Une compétition d'**endurance et de fitness fonctionnel** qui combine course et stations d'exercices, défiant les participants de terminer le parcours le plus rapidement possible.

---

## 🎯 Formats de Course

### 🔥 RACE (Complète)
- **8 km de course au total** entrecoupée de **8 stations d'exercices**
- Le format complet pour les athlètes à la recherche du défi ultime

### ⚡ SPRINT
- **4 km de course au total** entrecoupée de **8 stations d'exercices**
- Format plus court et accessible, idéal pour débuter

---

## 👥 Catégories (10 Épreuves)

### Full Race
- Individuel Hommes
- Individuel Femmes
- Duo Hommes
- Duo Femmes
- Duo Mixte

### Sprint
- Individuel Hommes
- Individuel Femmes
- Duo Hommes
- Duo Femmes
- Duo Mixte

---

## 💳 Inscriptions

### 🔥 Phase Promotionnelle (jusqu'au 26 février, inclus)
- Individuel : **50 €**
- Duo : **90 €** (par équipe)

### ⏳ Prix Régulier (à partir du 27 février)
- Individuel : **55 €**
- Duo : **100 €** (par équipe)

---

## 📋 Secrétariat / Check-in

- Ouverture à **08h00** le jour de l'épreuve
- Check-in obligatoire jusqu'à **60 minutes** avant le départ

---

## 🏆 Classement et Prix

- Classement par **temps total** (course + stations + pénalités)
- **Podium** pour toutes les catégories et formats
- Prix pour les vainqueurs du général (à communiquer avant l'événement)
- Arbitrage officiel et système de pénalités

---

## 🔄 Politique de Remboursement

- Jusqu'au **22 mars** : remboursement de **80%**
- **22 mars au 5 avril** : remboursement de **50%**
- Après le **5 avril** : aucun remboursement

---

## 📍 Lieu

**Pavilhão Multiusos de Torres Vedras**
Torres Vedras, Lisbonne, Portugal

---

## 💡 Le Concept

La West Fitness Race est une compétition axée sur l'**endurance et la force**, où chaque participant est défié de surmonter les stations d'exercices entrecoupées de segments de course. L'objectif est simple : terminer tout le parcours le plus rapidement possible ! 💪`,
      city: "Torres Vedras",
      metaTitle:
        "West Fitness Race – Torres Vedras 2026 | 18-19 Avril | Athlifyr",
      metaDescription:
        "West Fitness Race 2026 à Torres Vedras, 18 et 19 avril. Endurance et fitness fonctionnel. Individuel (50-55€) ou duo (90-100€). 5 catégories.",
    },
    [Language.de]: {
      title: "West Fitness Race – Torres Vedras 2026",
      description: `# 🏋️ West Fitness Race – Torres Vedras 2026

Die **West Fitness Race** kehrt am **18. und 19. April 2026** nach Torres Vedras zurück, in der **Pavilhão Multiusos de Torres Vedras**!

Ein **Ausdauer- und Functional-Fitness-Wettbewerb**, der Laufen mit Übungsstationen kombiniert und die Teilnehmer herausfordert, die Strecke in kürzester Zeit zu absolvieren.

---

## 🎯 Rennformate

### 🔥 RACE (Voll)
- **8 km Gesamtlauf** durchsetzt mit **8 Übungsstationen**
- Das komplette Format für Athleten, die die ultimative Herausforderung suchen

### ⚡ SPRINT
- **4 km Gesamtlauf** durchsetzt mit **8 Übungsstationen**
- Kürzeres und zugänglicheres Format, ideal für Einsteiger

---

## 👥 Kategorien (10 Rennen)

### Full Race
- Einzel Männer
- Einzel Frauen
- Doppel Männer
- Doppel Frauen
- Doppel Mixed

### Sprint
- Einzel Männer
- Einzel Frauen
- Doppel Männer
- Doppel Frauen
- Doppel Mixed

---

## 💳 Anmeldung

### 🔥 Aktionsphase (bis 26. Februar, einschließlich)
- Einzel: **50 €**
- Doppel: **90 €** (pro Team)

### ⏳ Regulärer Preis (ab 27. Februar)
- Einzel: **55 €**
- Doppel: **100 €** (pro Team)

---

## 📋 Anmeldung / Check-in

- Öffnung um **08:00 Uhr** am Wettkampftag
- Obligatorischer Check-in bis **60 Minuten** vor der Startzeit

---

## 🏆 Klassifizierung und Preise

- Klassifizierung nach **Gesamtzeit** (Laufen + Stationen + Strafen)
- **Podium** für alle Kategorien und Formate
- Preise für die Gesamtsieger (wird vor dem Event bekannt gegeben)
- Offizielle Schiedsrichter und Strafensystem

---

## 🔄 Rückerstattungsrichtlinie

- Bis **22. März**: **80%** Rückerstattung
- **22. März bis 5. April**: **50%** Rückerstattung
- Nach dem **5. April**: keine Rückerstattung

---

## 📍 Veranstaltungsort

**Pavilhão Multiusos de Torres Vedras**
Torres Vedras, Lissabon, Portugal

---

## 💡 Das Konzept

Die West Fitness Race ist ein Wettbewerb mit Fokus auf **Ausdauer und Kraft**, bei dem jeder Teilnehmer herausgefordert wird, Übungsstationen zwischen Laufabschnitten zu bewältigen. Das Ziel ist einfach: die gesamte Strecke in kürzester Zeit absolvieren! 💪`,
      city: "Torres Vedras",
      metaTitle:
        "West Fitness Race – Torres Vedras 2026 | 18.-19. April | Athlifyr",
      metaDescription:
        "West Fitness Race 2026 in Torres Vedras, 18.-19. April. Ausdauer- und Functional-Fitness. Einzel (50-55€) oder Doppel (90-100€). 5 Kategorien.",
    },
    [Language.it]: {
      title: "West Fitness Race – Torres Vedras 2026",
      description: `# 🏋️ West Fitness Race – Torres Vedras 2026

La **West Fitness Race** torna a Torres Vedras il **18 e 19 aprile 2026**, al **Pavilhão Multiusos de Torres Vedras**!

Una competizione di **endurance e fitness funzionale** che combina corsa con stazioni di esercizi, sfidando i partecipanti a completare il percorso nel minor tempo possibile.

---

## 🎯 Formati di Gara

### 🔥 RACE (Completa)
- **8 km di corsa totale** intervallata da **8 stazioni di esercizi**
- Il formato completo per atleti che cercano la sfida massima

### ⚡ SPRINT
- **4 km di corsa totale** intervallata da **8 stazioni di esercizi**
- Formato più breve e accessibile, ideale per chi vuole provare

---

## 👥 Categorie (10 Gare)

### Full Race
- Individuale Uomini
- Individuale Donne
- Coppia Uomini
- Coppia Donne
- Coppia Mista

### Sprint
- Individuale Uomini
- Individuale Donne
- Coppia Uomini
- Coppia Donne
- Coppia Mista

---

## 💳 Iscrizioni

### 🔥 Fase Promozionale (fino al 26 febbraio, incluso)
- Individuale: **50 €**
- Coppia: **90 €** (per squadra)

### ⏳ Prezzo Regolare (dal 27 febbraio)
- Individuale: **55 €**
- Coppia: **100 €** (per squadra)

---

## 📋 Segreteria / Check-in

- Apertura alle **08:00** il giorno della gara
- Check-in obbligatorio fino a **60 minuti** prima dell'orario di partenza

---

## 🏆 Classifica e Premi

- Classifica per **tempo totale** (corsa + stazioni + penalità)
- **Podio** per tutte le categorie e formati
- Premi per i vincitori della classifica generale (da comunicare prima dell'evento)
- Arbitraggio ufficiale e sistema di penalità

---

## 🔄 Politica di Rimborso

- Fino al **22 marzo**: rimborso del **80%**
- **22 marzo - 5 aprile**: rimborso del **50%**
- Dopo il **5 aprile**: nessun rimborso

---

## 📍 Luogo

**Pavilhão Multiusos de Torres Vedras**
Torres Vedras, Lisbona, Portogallo

---

## 💡 Il Concetto

La West Fitness Race è una competizione incentrata su **resistenza e forza**, dove ogni partecipante è sfidato a superare le stazioni di esercizi intervallate da segmenti di corsa. L'obiettivo è semplice: completare l'intero percorso nel minor tempo possibile! 💪`,
      city: "Torres Vedras",
      metaTitle:
        "West Fitness Race – Torres Vedras 2026 | 18-19 Aprile | Athlifyr",
      metaDescription:
        "West Fitness Race 2026 a Torres Vedras, 18 e 19 aprile. Endurance e fitness funzionale. Individuale (50-55€) o coppie (90-100€). 5 categorie.",
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

  // Step 3: Delete old variants and create 5 correct categories
  await prisma.eventVariant.deleteMany({
    where: { eventId: event.id },
  });

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

  // ── 5 Categories ──

  await findOrCreateVariant("Individual Masculino", {
    description: "Individual Masculino",
    startDate: new Date("2026-04-19T09:00:00Z"),
    maxParticipants: null,
    price: 55.0,
    currency: Currency.EUR,
  });

  await findOrCreateVariant("Individual Feminino", {
    description: "Individual Feminino",
    startDate: new Date("2026-04-19T09:00:00Z"),
    maxParticipants: null,
    price: 55.0,
    currency: Currency.EUR,
  });

  await findOrCreateVariant("Duplas Masculinas", {
    description: "Duplas Masculinas",
    startDate: new Date("2026-04-19T09:00:00Z"),
    maxParticipants: null,
    price: 100.0,
    currency: Currency.EUR,
  });

  await findOrCreateVariant("Duplas Femininas", {
    description: "Duplas Femininas",
    startDate: new Date("2026-04-19T09:00:00Z"),
    maxParticipants: null,
    price: 100.0,
    currency: Currency.EUR,
  });

  await findOrCreateVariant("Duplas Mistas", {
    description: "Duplas Mistas",
    startDate: new Date("2026-04-19T09:00:00Z"),
    maxParticipants: null,
    price: 100.0,
    currency: Currency.EUR,
  });

  console.log("🏋️ All 5 variants upserted");

  // Step 4: Upsert pricing phases using helper function
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

  // Delete old pricing phases before creating new ones
  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

  // Individual pricing — Fase Promocional (até 26 fev)
  await findOrCreatePricingPhase("Individual - Preço Promocional", {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-02-26T23:59:59Z"),
    price: 50.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Preço promocional para provas individuais — até 26 de fevereiro",
  });

  // Individual pricing — Preço Regular (a partir de 27 fev)
  await findOrCreatePricingPhase("Individual - Preço Regular", {
    startDate: new Date("2026-02-27T00:00:00Z"),
    endDate: new Date("2026-04-17T23:59:59Z"),
    price: 55.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Preço regular para provas individuais — a partir de 27 de fevereiro",
  });

  // Duplas pricing — Fase Promocional (até 26 fev)
  await findOrCreatePricingPhase("Duplas - Preço Promocional", {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-02-26T23:59:59Z"),
    price: 90.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Preço promocional para provas de duplas — até 26 de fevereiro — por equipa",
  });

  // Duplas pricing — Preço Regular (a partir de 27 fev)
  await findOrCreatePricingPhase("Duplas - Preço Regular", {
    startDate: new Date("2026-02-27T00:00:00Z"),
    endDate: new Date("2026-04-17T23:59:59Z"),
    price: 100.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Preço regular para provas de duplas — a partir de 27 de fevereiro — por equipa",
  });

  console.log(
    "💰 Pricing phases upserted (Individual €50→€55 / Duplas €90→€100)"
  );

  // Step 5: FAQs
  const findOrCreateFAQ = async (
    eventId: string,
    order: number,
    question: string,
    answer: string
  ) => {
    const existing = await prisma.eventFAQ.findFirst({
      where: { eventId, order },
    });
    if (existing) {
      return await prisma.eventFAQ.update({
        where: { id: existing.id },
        data: { question, answer },
      });
    }
    return await prisma.eventFAQ.create({
      data: { eventId, order, question, answer },
    });
  };

  // FAQ 1 - Categories
  const faq1 = await findOrCreateFAQ(
    event.id,
    0,
    "Quais são as categorias disponíveis na West Fitness Race?",
    "Existem 5 categorias: Individual Masculino, Individual Feminino, Duplas Masculinas, Duplas Femininas e Duplas Mistas."
  );

  const faq1Translations = {
    [Language.pt]: {
      question: "Quais são as categorias disponíveis na West Fitness Race?",
      answer:
        "Existem 5 categorias: Individual Masculino, Individual Feminino, Duplas Masculinas, Duplas Femininas e Duplas Mistas.",
    },
    [Language.en]: {
      question: "What categories are available at the West Fitness Race?",
      answer:
        "There are 5 categories: Individual Men, Individual Women, Men's Doubles, Women's Doubles and Mixed Doubles.",
    },
    [Language.es]: {
      question: "¿Qué categorías están disponibles en la West Fitness Race?",
      answer:
        "Hay 5 categorías: Individual Masculino, Individual Femenino, Duplas Masculinas, Duplas Femeninas y Duplas Mixtas.",
    },
    [Language.fr]: {
      question: "Quelles catégories sont disponibles à la West Fitness Race ?",
      answer:
        "Il existe 5 catégories : Individuel Hommes, Individuel Femmes, Duo Hommes, Duo Femmes et Duo Mixte.",
    },
    [Language.de]: {
      question: "Welche Kategorien sind beim West Fitness Race verfügbar?",
      answer:
        "Es gibt 5 Kategorien: Einzel Männer, Einzel Frauen, Doppel Männer, Doppel Frauen und Doppel Mixed.",
    },
    [Language.it]: {
      question: "Quali categorie sono disponibili alla West Fitness Race?",
      answer:
        "Ci sono 5 categorie: Individuale Uomini, Individuale Donne, Coppia Uomini, Coppia Donne e Coppia Mista.",
    },
  };

  for (const lang of languages) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq1.id, language: lang } },
      update: faq1Translations[lang],
      create: { faqId: faq1.id, language: lang, ...faq1Translations[lang] },
    });
  }

  // FAQ 2 - Prices
  const faq2 = await findOrCreateFAQ(
    event.id,
    1,
    "Quais são os preços de inscrição?",
    "Até 26 de fevereiro (inclusive): Individual 50€ / Duplas 90€. A partir de 27 de fevereiro: Individual 55€ / Duplas 100€."
  );

  const faq2Translations = {
    [Language.pt]: {
      question: "Quais são os preços de inscrição?",
      answer:
        "Até 26 de fevereiro (inclusive): Individual 50€ / Duplas 90€. A partir de 27 de fevereiro: Individual 55€ / Duplas 100€.",
    },
    [Language.en]: {
      question: "What are the registration prices?",
      answer:
        "Until February 26 (inclusive): Individual €50 / Doubles €90. From February 27: Individual €55 / Doubles €100.",
    },
    [Language.es]: {
      question: "¿Cuáles son los precios de inscripción?",
      answer:
        "Hasta el 26 de febrero (inclusive): Individual 50€ / Duplas 90€. A partir del 27 de febrero: Individual 55€ / Duplas 100€.",
    },
    [Language.fr]: {
      question: "Quels sont les prix d'inscription ?",
      answer:
        "Jusqu'au 26 février (inclus) : Individuel 50€ / Duo 90€. À partir du 27 février : Individuel 55€ / Duo 100€.",
    },
    [Language.de]: {
      question: "Wie hoch sind die Anmeldepreise?",
      answer:
        "Bis 26. Februar (inklusive): Einzel 50€ / Doppel 90€. Ab 27. Februar: Einzel 55€ / Doppel 100€.",
    },
    [Language.it]: {
      question: "Quali sono i prezzi di iscrizione?",
      answer:
        "Fino al 26 febbraio (incluso): Individuale 50€ / Coppia 90€. Dal 27 febbraio: Individuale 55€ / Coppia 100€.",
    },
  };

  for (const lang of languages) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq2.id, language: lang } },
      update: faq2Translations[lang],
      create: { faqId: faq2.id, language: lang, ...faq2Translations[lang] },
    });
  }

  // FAQ 3 - Check-in
  const faq3 = await findOrCreateFAQ(
    event.id,
    2,
    "Como funciona o check-in?",
    "O secretariado abre às 08h00 no dia da prova. O check-in é obrigatório e deve ser feito até 60 minutos antes da hora de partida."
  );

  const faq3Translations = {
    [Language.pt]: {
      question: "Como funciona o check-in?",
      answer:
        "O secretariado abre às 08h00 no dia da prova. O check-in é obrigatório e deve ser feito até 60 minutos antes da hora de partida.",
    },
    [Language.en]: {
      question: "How does check-in work?",
      answer:
        "Registration opens at 08:00 on race day. Check-in is mandatory and must be completed up to 60 minutes before start time.",
    },
    [Language.es]: {
      question: "¿Cómo funciona el check-in?",
      answer:
        "La secretaría abre a las 08:00 el día de la prueba. El check-in es obligatorio y debe realizarse hasta 60 minutos antes de la hora de salida.",
    },
    [Language.fr]: {
      question: "Comment fonctionne le check-in ?",
      answer:
        "Le secrétariat ouvre à 08h00 le jour de l'épreuve. Le check-in est obligatoire et doit être effectué jusqu'à 60 minutes avant le départ.",
    },
    [Language.de]: {
      question: "Wie funktioniert der Check-in?",
      answer:
        "Die Anmeldung öffnet um 08:00 Uhr am Wettkampftag. Der Check-in ist obligatorisch und muss bis 60 Minuten vor der Startzeit abgeschlossen sein.",
    },
    [Language.it]: {
      question: "Come funziona il check-in?",
      answer:
        "La segreteria apre alle 08:00 il giorno della gara. Il check-in è obbligatorio e deve essere completato fino a 60 minuti prima dell'orario di partenza.",
    },
  };

  for (const lang of languages) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq3.id, language: lang } },
      update: faq3Translations[lang],
      create: { faqId: faq3.id, language: lang, ...faq3Translations[lang] },
    });
  }

  // FAQ 4 - Refund policy
  const faq4 = await findOrCreateFAQ(
    event.id,
    3,
    "Qual é a política de devoluções?",
    "Até 22 de março: devolução de 80%. De 22 de março a 5 de abril: devolução de 50%. Após 5 de abril: sem devolução."
  );

  const faq4Translations = {
    [Language.pt]: {
      question: "Qual é a política de devoluções?",
      answer:
        "Até 22 de março: devolução de 80%. De 22 de março a 5 de abril: devolução de 50%. Após 5 de abril: sem devolução.",
    },
    [Language.en]: {
      question: "What is the refund policy?",
      answer:
        "Until March 22: 80% refund. From March 22 to April 5: 50% refund. After April 5: no refund.",
    },
    [Language.es]: {
      question: "¿Cuál es la política de devoluciones?",
      answer:
        "Hasta el 22 de marzo: devolución del 80%. Del 22 de marzo al 5 de abril: devolución del 50%. Después del 5 de abril: sin devolución.",
    },
    [Language.fr]: {
      question: "Quelle est la politique de remboursement ?",
      answer:
        "Jusqu'au 22 mars : remboursement de 80%. Du 22 mars au 5 avril : remboursement de 50%. Après le 5 avril : aucun remboursement.",
    },
    [Language.de]: {
      question: "Wie lautet die Rückerstattungsrichtlinie?",
      answer:
        "Bis 22. März: 80% Rückerstattung. Vom 22. März bis 5. April: 50% Rückerstattung. Nach dem 5. April: keine Rückerstattung.",
    },
    [Language.it]: {
      question: "Qual è la politica di rimborso?",
      answer:
        "Fino al 22 marzo: rimborso dell'80%. Dal 22 marzo al 5 aprile: rimborso del 50%. Dopo il 5 aprile: nessun rimborso.",
    },
  };

  for (const lang of languages) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq4.id, language: lang } },
      update: faq4Translations[lang],
      create: { faqId: faq4.id, language: lang, ...faq4Translations[lang] },
    });
  }

  // FAQ 5 - Classification
  const faq5 = await findOrCreateFAQ(
    event.id,
    4,
    "Como é feita a classificação?",
    "A classificação é feita pelo tempo total, que inclui o tempo de corrida, o tempo nas estações de exercício e eventuais penalizações. Há pódio para todas as categorias e formatos."
  );

  const faq5Translations = {
    [Language.pt]: {
      question: "Como é feita a classificação?",
      answer:
        "A classificação é feita pelo tempo total, que inclui o tempo de corrida, o tempo nas estações de exercício e eventuais penalizações. Há pódio para todas as categorias e formatos.",
    },
    [Language.en]: {
      question: "How is the classification determined?",
      answer:
        "Classification is based on total time, which includes running time, time at exercise stations, and any penalties. There is a podium for all categories and formats.",
    },
    [Language.es]: {
      question: "¿Cómo se determina la clasificación?",
      answer:
        "La clasificación se basa en el tiempo total, que incluye el tiempo de carrera, el tiempo en las estaciones de ejercicio y posibles penalizaciones. Hay podio para todas las categorías y formatos.",
    },
    [Language.fr]: {
      question: "Comment est établi le classement ?",
      answer:
        "Le classement est basé sur le temps total, qui comprend le temps de course, le temps aux stations d'exercices et les éventuelles pénalités. Il y a un podium pour toutes les catégories et formats.",
    },
    [Language.de]: {
      question: "Wie wird die Klassifizierung bestimmt?",
      answer:
        "Die Klassifizierung basiert auf der Gesamtzeit, die Laufzeit, Zeit an den Übungsstationen und eventuelle Strafen umfasst. Es gibt ein Podium für alle Kategorien und Formate.",
    },
    [Language.it]: {
      question: "Come viene determinata la classifica?",
      answer:
        "La classifica si basa sul tempo totale, che include il tempo di corsa, il tempo alle stazioni di esercizi e eventuali penalità. C'è un podio per tutte le categorie e formati.",
    },
  };

  for (const lang of languages) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq5.id, language: lang } },
      update: faq5Translations[lang],
      create: { faqId: faq5.id, language: lang, ...faq5Translations[lang] },
    });
  }

  console.log("❓ 5 FAQs upserted with translations in 6 languages");

  console.log(
    "✅ West Fitness Race – Torres Vedras 2026 seed completed successfully!"
  );
  console.log("📅 Event dates: Saturday-Sunday, April 18-19, 2026");
  console.log("📍 Location: Pavilhão Multiusos de Torres Vedras, Portugal");
  console.log("🏋️ 5 variants (Individual Masc/Fem + Duplas Masc/Fem/Mistas)");
  console.log("💰 4 pricing phases (Promo + Regular × Individual + Duplas)");
  console.log("❓ 5 FAQs in 6 languages");
}

main()
  .catch((e) => {
    console.error(
      "❌ Error seeding West Fitness Race – Torres Vedras 2026:",
      e
    );
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
