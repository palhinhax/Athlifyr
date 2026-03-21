/**
 * Seed: Hyberic Run 2026
 *
 * Event: Hyrox-style endurance race in Chaves
 * Location: Estádio Municipal Engenheiro Manuel Branco Teixeira, Chaves
 * Date: May 30, 2026
 * Organizer: Associação Pódios e Bancadas
 * Sport: Hyrox
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏋️ Seeding Hyberic Run 2026...");

  // ──────────────────────────────────────────────
  // 1. Upsert Event (no nested creates)
  // ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: "hyberic-run-chaves-2026" },
    update: {
      title: "Hyberic Run 2026",
      description: "Hyberic Run 2026 - Simulação Hyrox em Chaves",
      sportTypes: [SportType.HYROX],
      startDate: new Date("2026-05-30T09:00:00Z"),
      endDate: new Date("2026-05-30T18:00:00Z"),
      registrationDeadline: new Date("2026-05-20T23:59:59Z"),
      externalUrl: "https://www.portimer.pt/hyberic_run_2026",
      imageUrl: "",
      city: "Chaves",
      country: "Portugal",
      latitude: 41.7401,
      longitude: -7.4706,
      googleMapsUrl: "",
      isFeatured: false,
      cancelled: false,
    },
    create: {
      title: "Hyberic Run 2026",
      slug: "hyberic-run-chaves-2026",
      description: "Hyberic Run 2026 - Simulação Hyrox em Chaves",
      sportTypes: [SportType.HYROX],
      startDate: new Date("2026-05-30T09:00:00Z"),
      endDate: new Date("2026-05-30T18:00:00Z"),
      registrationDeadline: new Date("2026-05-20T23:59:59Z"),
      externalUrl: "https://www.portimer.pt/hyberic_run_2026",
      imageUrl: "",
      city: "Chaves",
      country: "Portugal",
      latitude: 41.7401,
      longitude: -7.4706,
      googleMapsUrl: "",
      isFeatured: false,
      cancelled: false,
    },
  });

  console.log(`✅ Created/updated event: ${event.slug}`);

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
      title: "Hyberic Run 2026",
      description: `# 🏋️ Hyberic Run 2026

**A Hyberic Run realiza-se a 30 de maio de 2026 em Chaves**, no Estádio Municipal Engenheiro Manuel Branco Teixeira. Organizada pela Associação Pódios e Bancadas, é uma prova de endurance no formato simulação Hyrox, onde a corrida é intercalada com estações técnicas.

---

## 🏋️ Estrutura da Prova

A prova é composta por **8 blocos de corrida de 1 km** intercalados com **8 estações de exercícios**:

1. 🎿 Ski Erg
2. 🛷 Sled Push
3. 🪢 Sled Pull
4. 💪 Burpees Broad Jump
5. 🚣 Row Erg
6. 🏋️ KB Farmer's Carry
7. 🎒 Sandbag Lunges
8. 🏐 Wall Balls

O relógio nunca para e os atletas só podem avançar quando cada estação estiver totalmente concluída.

---

## 🏅 Categorias

### Individual
- Individual Masculino / Feminino
- Individual Masculino Pro / Feminino Pro

### Duplas
- Duplas Masculinas / Femininas / Mistas
- Duplas Masculinas Pro / Femininas Pro

### Equipas Estafeta (4 elementos)
- Estafeta Masculina / Feminina / Mista

---

## 📍 Local e Logística

**Local:** Estádio Municipal Engenheiro Manuel Branco Teixeira, Chaves

**Sistema de Heats:**
- 6 atletas ou duplas por heat
- Saídas de 10 em 10 minutos
- Check-in obrigatório até 90 minutos antes do heat

---

## 🎯 Destaques

✅ Seguro desportivo incluído
✅ Prova cronometrada contra o tempo
✅ Balneários disponíveis
✅ Briefing obrigatório antes de cada heat
✅ Grupos etários: 16–29, 30–34, 35–39, 40–44, 45–49, 50–54, 55+`,
      city: "Chaves",
      metaTitle: "Hyberic Run 2026 | Chaves | 30 Maio",
      metaDescription:
        "Hyberic Run 2026 a 30 de maio em Chaves. Simulação Hyrox com 8km de corrida e 8 estações técnicas. Individual, duplas e equipas estafeta. Inscrições em portimer.pt.",
    },
    en: {
      title: "Hyberic Run 2026",
      description: `# 🏋️ Hyberic Run 2026

**The Hyberic Run takes place on May 30, 2026 in Chaves**, at the Estádio Municipal Engenheiro Manuel Branco Teixeira. Organized by Associação Pódios e Bancadas, it is a Hyrox-style endurance race where running is interspersed with technical exercise stations.

---

## 🏋️ Race Structure

The race consists of **8 blocks of 1 km running** interspersed with **8 exercise stations**:

1. 🎿 Ski Erg
2. 🛷 Sled Push
3. 🪢 Sled Pull
4. 💪 Burpees Broad Jump
5. 🚣 Row Erg
6. 🏋️ KB Farmer's Carry
7. 🎒 Sandbag Lunges
8. 🏐 Wall Balls

The clock never stops and athletes can only advance when each station is fully completed.

---

## 🏅 Categories

### Individual
- Individual Male / Female
- Individual Male Pro / Female Pro

### Doubles
- Male / Female / Mixed Doubles
- Male Pro / Female Pro Doubles

### Relay Teams (4 members)
- Male / Female / Mixed Relay

---

## 📍 Location and Logistics

**Venue:** Estádio Municipal Engenheiro Manuel Branco Teixeira, Chaves

**Heat System:**
- 6 athletes or doubles per heat
- Starts every 10 minutes
- Mandatory check-in up to 90 minutes before the heat

---

## 🎯 Highlights

✅ Sports insurance included
✅ Timed race against the clock
✅ Changing rooms available
✅ Mandatory briefing before each heat
✅ Age groups: 16–29, 30–34, 35–39, 40–44, 45–49, 50–54, 55+`,
      city: "Chaves",
      metaTitle: "Hyberic Run 2026 | Chaves | May 30",
      metaDescription:
        "Hyberic Run 2026 on May 30 in Chaves. Hyrox-style race with 8km running and 8 technical stations. Individual, doubles and relay teams. Registration at portimer.pt.",
    },
    es: {
      title: "Hyberic Run 2026",
      description: `# 🏋️ Hyberic Run 2026

**La Hyberic Run se celebra el 30 de mayo de 2026 en Chaves**, en el Estadio Municipal Engenheiro Manuel Branco Teixeira. Organizada por la Associação Pódios e Bancadas, es una prueba de endurance tipo Hyrox donde la carrera se intercala con estaciones técnicas de ejercicios.

---

## 🏋️ Estructura de la Prueba

La prueba está compuesta por **8 bloques de carrera de 1 km** intercalados con **8 estaciones de ejercicios**:

1. 🎿 Ski Erg
2. 🛷 Sled Push
3. 🪢 Sled Pull
4. 💪 Burpees Broad Jump
5. 🚣 Row Erg
6. 🏋️ KB Farmer's Carry
7. 🎒 Sandbag Lunges
8. 🏐 Wall Balls

El reloj nunca se detiene y los atletas solo pueden avanzar cuando cada estación esté completamente completada.

---

## 🏅 Categorías

### Individual
- Individual Masculino / Femenino
- Individual Masculino Pro / Femenino Pro

### Parejas
- Parejas Masculinas / Femeninas / Mixtas
- Parejas Masculinas Pro / Femeninas Pro

### Equipos Relevos (4 miembros)
- Relevos Masculinos / Femeninos / Mixtos

---

## 📍 Ubicación y Logística

**Lugar:** Estadio Municipal Engenheiro Manuel Branco Teixeira, Chaves

**Sistema de Heats:**
- 6 atletas o parejas por heat
- Salidas cada 10 minutos
- Check-in obligatorio hasta 90 minutos antes del heat

---

## 🎯 Destacados

✅ Seguro deportivo incluido
✅ Prueba cronometrada contra el tiempo
✅ Vestuarios disponibles
✅ Briefing obligatorio antes de cada heat
✅ Grupos etarios: 16–29, 30–34, 35–39, 40–44, 45–49, 50–54, 55+`,
      city: "Chaves",
      metaTitle: "Hyberic Run 2026 | Chaves | 30 Mayo",
      metaDescription:
        "Hyberic Run 2026 el 30 de mayo en Chaves. Prueba tipo Hyrox con 8km de carrera y 8 estaciones técnicas. Individual, parejas y equipos relevos. Inscripciones en portimer.pt.",
    },
    fr: {
      title: "Hyberic Run 2026",
      description: `# 🏋️ Hyberic Run 2026

**La Hyberic Run a lieu le 30 mai 2026 à Chaves**, au Stade Municipal Engenheiro Manuel Branco Teixeira. Organisée par l'Associação Pódios e Bancadas, c'est une épreuve d'endurance de type Hyrox où la course est intercalée avec des stations techniques d'exercices.

---

## 🏋️ Structure de l'Épreuve

L'épreuve est composée de **8 blocs de course de 1 km** intercalés avec **8 stations d'exercices** :

1. 🎿 Ski Erg
2. 🛷 Sled Push
3. 🪢 Sled Pull
4. 💪 Burpees Broad Jump
5. 🚣 Row Erg
6. 🏋️ KB Farmer's Carry
7. 🎒 Sandbag Lunges
8. 🏐 Wall Balls

Le chronomètre ne s'arrête jamais et les athlètes ne peuvent avancer que lorsque chaque station est entièrement terminée.

---

## 🏅 Catégories

### Individuel
- Individuel Masculin / Féminin
- Individuel Masculin Pro / Féminin Pro

### Doubles
- Doubles Masculins / Féminins / Mixtes
- Doubles Masculins Pro / Féminins Pro

### Équipes Relais (4 membres)
- Relais Masculin / Féminin / Mixte

---

## 📍 Lieu et Logistique

**Lieu :** Stade Municipal Engenheiro Manuel Branco Teixeira, Chaves

**Système de Heats :**
- 6 athlètes ou doubles par heat
- Départs toutes les 10 minutes
- Check-in obligatoire jusqu'à 90 minutes avant le heat

---

## 🎯 Points Forts

✅ Assurance sportive incluse
✅ Épreuve chronométrée contre la montre
✅ Vestiaires disponibles
✅ Briefing obligatoire avant chaque heat
✅ Groupes d'âge : 16–29, 30–34, 35–39, 40–44, 45–49, 50–54, 55+`,
      city: "Chaves",
      metaTitle: "Hyberic Run 2026 | Chaves | 30 Mai",
      metaDescription:
        "Hyberic Run 2026 le 30 mai à Chaves. Épreuve type Hyrox avec 8km de course et 8 stations techniques. Individuel, doubles et équipes relais. Inscriptions sur portimer.pt.",
    },
    de: {
      title: "Hyberic Run 2026",
      description: `# 🏋️ Hyberic Run 2026

**Der Hyberic Run findet am 30. Mai 2026 in Chaves statt**, im Estádio Municipal Engenheiro Manuel Branco Teixeira. Organisiert von der Associação Pódios e Bancadas, ist es ein Hyrox-ähnliches Ausdauerrennen, bei dem Laufen mit technischen Übungsstationen abgewechselt wird.

---

## 🏋️ Rennstruktur

Das Rennen besteht aus **8 Laufblöcken à 1 km**, abgewechselt mit **8 Übungsstationen**:

1. 🎿 Ski Erg
2. 🛷 Sled Push
3. 🪢 Sled Pull
4. 💪 Burpees Broad Jump
5. 🚣 Row Erg
6. 🏋️ KB Farmer's Carry
7. 🎒 Sandbag Lunges
8. 🏐 Wall Balls

Die Uhr stoppt nie und Athleten können erst weitermachen, wenn jede Station vollständig abgeschlossen ist.

---

## 🏅 Kategorien

### Einzel
- Einzel Männer / Frauen
- Einzel Männer Pro / Frauen Pro

### Doppel
- Doppel Männer / Frauen / Mixed
- Doppel Männer Pro / Frauen Pro

### Staffelteams (4 Mitglieder)
- Staffel Männer / Frauen / Mixed

---

## 📍 Ort und Logistik

**Veranstaltungsort:** Estádio Municipal Engenheiro Manuel Branco Teixeira, Chaves

**Heat-System:**
- 6 Athleten oder Doppel pro Heat
- Starts alle 10 Minuten
- Pflicht-Check-in bis 90 Minuten vor dem Heat

---

## 🎯 Höhepunkte

✅ Sportversicherung inklusive
✅ Zeitrennen gegen die Uhr
✅ Umkleiden verfügbar
✅ Pflicht-Briefing vor jedem Heat
✅ Altersgruppen: 16–29, 30–34, 35–39, 40–44, 45–49, 50–54, 55+`,
      city: "Chaves",
      metaTitle: "Hyberic Run 2026 | Chaves | 30. Mai",
      metaDescription:
        "Hyberic Run 2026 am 30. Mai in Chaves. Hyrox-ähnliches Rennen mit 8km Lauf und 8 technischen Stationen. Einzel, Doppel und Staffelteams. Anmeldung auf portimer.pt.",
    },
    it: {
      title: "Hyberic Run 2026",
      description: `# 🏋️ Hyberic Run 2026

**La Hyberic Run si svolge il 30 maggio 2026 a Chaves**, presso lo Stadio Municipale Engenheiro Manuel Branco Teixeira. Organizzata dall'Associação Pódios e Bancadas, è una gara di endurance in stile Hyrox dove la corsa si alterna con stazioni tecniche di esercizi.

---

## 🏋️ Struttura della Gara

La gara è composta da **8 blocchi di corsa da 1 km** alternati con **8 stazioni di esercizi**:

1. 🎿 Ski Erg
2. 🛷 Sled Push
3. 🪢 Sled Pull
4. 💪 Burpees Broad Jump
5. 🚣 Row Erg
6. 🏋️ KB Farmer's Carry
7. 🎒 Sandbag Lunges
8. 🏐 Wall Balls

Il cronometro non si ferma mai e gli atleti possono avanzare solo quando ogni stazione è completamente completata.

---

## 🏅 Categorie

### Individuale
- Individuale Maschile / Femminile
- Individuale Maschile Pro / Femminile Pro

### Coppie
- Coppie Maschili / Femminili / Miste
- Coppie Maschili Pro / Femminili Pro

### Squadre Staffetta (4 membri)
- Staffetta Maschile / Femminile / Mista

---

## 📍 Luogo e Logistica

**Sede:** Stadio Municipale Engenheiro Manuel Branco Teixeira, Chaves

**Sistema di Heat:**
- 6 atleti o coppie per heat
- Partenze ogni 10 minuti
- Check-in obbligatorio fino a 90 minuti prima dell'heat

---

## 🎯 Punti di Forza

✅ Assicurazione sportiva inclusa
✅ Gara cronometrata contro il tempo
✅ Spogliatoi disponibili
✅ Briefing obbligatorio prima di ogni heat
✅ Fasce d'età: 16–29, 30–34, 35–39, 40–44, 45–49, 50–54, 55+`,
      city: "Chaves",
      metaTitle: "Hyberic Run 2026 | Chaves | 30 Maggio",
      metaDescription:
        "Hyberic Run 2026 il 30 maggio a Chaves. Gara tipo Hyrox con 8km di corsa e 8 stazioni tecniche. Individuale, coppie e squadre staffetta. Iscrizioni su portimer.pt.",
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

  // ── Individual variants (45€) ──
  const individualM = await findOrCreateVariant({
    name: "Individual Masculino",
    distanceKm: 8,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-05-30T09:00:00Z"),
    startTime: "09:00",
    cutoffTimeHours: null,
    price: 45.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Individual Masculino · 8×1km corrida + 8 estações · Cronometrado",
  });
  console.log(`✅ Variant: ${individualM.name}`);

  const individualF = await findOrCreateVariant({
    name: "Individual Feminino",
    distanceKm: 8,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-05-30T09:00:00Z"),
    startTime: "09:00",
    cutoffTimeHours: null,
    price: 45.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Individual Feminino · 8×1km corrida + 8 estações · Cronometrado",
  });
  console.log(`✅ Variant: ${individualF.name}`);

  const individualMPro = await findOrCreateVariant({
    name: "Individual Masculino Pro",
    distanceKm: 8,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-05-30T09:00:00Z"),
    startTime: "09:00",
    cutoffTimeHours: null,
    price: 45.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Individual Masculino Pro · 8×1km corrida + 8 estações · Cronometrado",
  });
  console.log(`✅ Variant: ${individualMPro.name}`);

  const individualFPro = await findOrCreateVariant({
    name: "Individual Feminino Pro",
    distanceKm: 8,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-05-30T09:00:00Z"),
    startTime: "09:00",
    cutoffTimeHours: null,
    price: 45.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Individual Feminino Pro · 8×1km corrida + 8 estações · Cronometrado",
  });
  console.log(`✅ Variant: ${individualFPro.name}`);

  // ── Doubles variants (40€/atleta) ──
  const duplasM = await findOrCreateVariant({
    name: "Duplas Masculinas",
    distanceKm: 8,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-05-30T09:00:00Z"),
    startTime: "09:00",
    cutoffTimeHours: null,
    price: 40.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Duplas Masculinas · 2 elementos · 40€/atleta · 8×1km + 8 estações",
  });
  console.log(`✅ Variant: ${duplasM.name}`);

  const duplasF = await findOrCreateVariant({
    name: "Duplas Femininas",
    distanceKm: 8,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-05-30T09:00:00Z"),
    startTime: "09:00",
    cutoffTimeHours: null,
    price: 40.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Duplas Femininas · 2 elementos · 40€/atleta · 8×1km + 8 estações",
  });
  console.log(`✅ Variant: ${duplasF.name}`);

  const duplasMistas = await findOrCreateVariant({
    name: "Duplas Mistas",
    distanceKm: 8,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-05-30T09:00:00Z"),
    startTime: "09:00",
    cutoffTimeHours: null,
    price: 40.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Duplas Mistas · 2 elementos · 40€/atleta · 8×1km + 8 estações",
  });
  console.log(`✅ Variant: ${duplasMistas.name}`);

  const duplasMPro = await findOrCreateVariant({
    name: "Duplas Masculinas Pro",
    distanceKm: 8,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-05-30T09:00:00Z"),
    startTime: "09:00",
    cutoffTimeHours: null,
    price: 40.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Duplas Masculinas Pro · 2 elementos · 40€/atleta · 8×1km + 8 estações",
  });
  console.log(`✅ Variant: ${duplasMPro.name}`);

  const duplasFPro = await findOrCreateVariant({
    name: "Duplas Femininas Pro",
    distanceKm: 8,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-05-30T09:00:00Z"),
    startTime: "09:00",
    cutoffTimeHours: null,
    price: 40.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Duplas Femininas Pro · 2 elementos · 40€/atleta · 8×1km + 8 estações",
  });
  console.log(`✅ Variant: ${duplasFPro.name}`);

  // ── Relay team variants (30€/atleta) ──
  const estafetaM = await findOrCreateVariant({
    name: "Equipas Estafeta Masculinas",
    distanceKm: 8,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-05-30T09:00:00Z"),
    startTime: "09:00",
    cutoffTimeHours: null,
    price: 30.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Equipas Estafeta Masculinas · 4 elementos · 30€/atleta · 8×1km + 8 estações",
  });
  console.log(`✅ Variant: ${estafetaM.name}`);

  const estafetaF = await findOrCreateVariant({
    name: "Equipas Estafeta Femininas",
    distanceKm: 8,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-05-30T09:00:00Z"),
    startTime: "09:00",
    cutoffTimeHours: null,
    price: 30.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Equipas Estafeta Femininas · 4 elementos · 30€/atleta · 8×1km + 8 estações",
  });
  console.log(`✅ Variant: ${estafetaF.name}`);

  const estafetaMista = await findOrCreateVariant({
    name: "Equipas Estafeta Mistas",
    distanceKm: 8,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-05-30T09:00:00Z"),
    startTime: "09:00",
    cutoffTimeHours: null,
    price: 30.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Equipas Estafeta Mistas · 4 elementos · 30€/atleta · 8×1km + 8 estações",
  });
  console.log(`✅ Variant: ${estafetaMista.name}`);

  // ──────────────────────────────────────────────
  // 4. Pricing Phases (linked to eventId AND variantId)
  // ──────────────────────────────────────────────

  // Individual variants — 45€ single phase
  for (const variant of [
    individualM,
    individualF,
    individualMPro,
    individualFPro,
  ]) {
    await findOrCreatePricingPhase(`${variant.name} - Inscrição`, variant.id, {
      startDate: new Date("2026-01-01T00:00:00Z"),
      endDate: new Date("2026-05-20T23:59:59Z"),
      price: 45.0,
      currency: Currency.EUR,
      note: "Inclui seguro desportivo · Limite inscrições: 20 maio 2026",
    });
    console.log(`   - 1 pricing phase for ${variant.name}`);
  }

  // Doubles variants — 40€/atleta single phase
  for (const variant of [
    duplasM,
    duplasF,
    duplasMistas,
    duplasMPro,
    duplasFPro,
  ]) {
    await findOrCreatePricingPhase(`${variant.name} - Inscrição`, variant.id, {
      startDate: new Date("2026-01-01T00:00:00Z"),
      endDate: new Date("2026-05-20T23:59:59Z"),
      price: 40.0,
      currency: Currency.EUR,
      note: "Preço por atleta · 2 elementos · Inclui seguro desportivo",
    });
    console.log(`   - 1 pricing phase for ${variant.name}`);
  }

  // Relay team variants — 30€/atleta single phase
  for (const variant of [estafetaM, estafetaF, estafetaMista]) {
    await findOrCreatePricingPhase(`${variant.name} - Inscrição`, variant.id, {
      startDate: new Date("2026-01-01T00:00:00Z"),
      endDate: new Date("2026-05-20T23:59:59Z"),
      price: 30.0,
      currency: Currency.EUR,
      note: "Preço por atleta · 4 elementos · Inclui seguro desportivo",
    });
    console.log(`   - 1 pricing phase for ${variant.name}`);
  }

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

  // FAQ 0: What is Hyberic Run
  const faq0 = await findOrCreateFAQ(
    event.id,
    0,
    "O que é o Hyberic Run?",
    "O Hyberic Run é uma prova de endurance no formato simulação Hyrox. A prova é composta por 8 blocos de corrida de 1km intercalados com 8 estações de exercícios: Ski Erg, Sled Push, Sled Pull, Burpees Broad Jump, Row Erg, KB Farmer's Carry, Sandbag Lunges e Wall Balls. O relógio nunca para."
  );

  const faq0Translations = {
    pt: {
      question: "O que é o Hyberic Run?",
      answer:
        "O Hyberic Run é uma prova de endurance no formato simulação Hyrox. A prova é composta por 8 blocos de corrida de 1km intercalados com 8 estações de exercícios: Ski Erg, Sled Push, Sled Pull, Burpees Broad Jump, Row Erg, KB Farmer's Carry, Sandbag Lunges e Wall Balls. O relógio nunca para.",
    },
    en: {
      question: "What is Hyberic Run?",
      answer:
        "Hyberic Run is a Hyrox-style endurance race. The race consists of 8 blocks of 1km running interspersed with 8 exercise stations: Ski Erg, Sled Push, Sled Pull, Burpees Broad Jump, Row Erg, KB Farmer's Carry, Sandbag Lunges and Wall Balls. The clock never stops.",
    },
    es: {
      question: "¿Qué es Hyberic Run?",
      answer:
        "El Hyberic Run es una prueba de endurance tipo Hyrox. La prueba está compuesta por 8 bloques de carrera de 1km intercalados con 8 estaciones de ejercicios: Ski Erg, Sled Push, Sled Pull, Burpees Broad Jump, Row Erg, KB Farmer's Carry, Sandbag Lunges y Wall Balls. El reloj nunca se detiene.",
    },
    fr: {
      question: "Qu'est-ce que Hyberic Run ?",
      answer:
        "Le Hyberic Run est une épreuve d'endurance de type Hyrox. L'épreuve est composée de 8 blocs de course de 1km intercalés avec 8 stations d'exercices : Ski Erg, Sled Push, Sled Pull, Burpees Broad Jump, Row Erg, KB Farmer's Carry, Sandbag Lunges et Wall Balls. Le chronomètre ne s'arrête jamais.",
    },
    de: {
      question: "Was ist Hyberic Run?",
      answer:
        "Der Hyberic Run ist ein Hyrox-ähnliches Ausdauerrennen. Das Rennen besteht aus 8 Laufblöcken à 1km, abgewechselt mit 8 Übungsstationen: Ski Erg, Sled Push, Sled Pull, Burpees Broad Jump, Row Erg, KB Farmer's Carry, Sandbag Lunges und Wall Balls. Die Uhr stoppt nie.",
    },
    it: {
      question: "Cos'è la Hyberic Run?",
      answer:
        "La Hyberic Run è una gara di endurance in stile Hyrox. La gara è composta da 8 blocchi di corsa da 1km alternati con 8 stazioni di esercizi: Ski Erg, Sled Push, Sled Pull, Burpees Broad Jump, Row Erg, KB Farmer's Carry, Sandbag Lunges e Wall Balls. Il cronometro non si ferma mai.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: {
        faqId_language: { faqId: faq0.id, language: Language[lang] },
      },
      update: faq0Translations[lang],
      create: {
        faqId: faq0.id,
        language: Language[lang],
        ...faq0Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 0: What is Hyberic Run");

  // FAQ 1: Categories and pricing
  const faq1 = await findOrCreateFAQ(
    event.id,
    1,
    "Quais são as categorias e preços?",
    "Individual (M/F e M/F Pro): 45€. Duplas (M/F/Mistas e M/F Pro): 40€ por atleta (2 elementos). Equipas Estafeta (M/F/Mistas): 30€ por atleta (4 elementos). Inscrições em portimer.pt até 20 de maio de 2026. Troca de nomes permitida até 23 de maio."
  );

  const faq1Translations = {
    pt: {
      question: "Quais são as categorias e preços?",
      answer:
        "Individual (M/F e M/F Pro): 45€. Duplas (M/F/Mistas e M/F Pro): 40€ por atleta (2 elementos). Equipas Estafeta (M/F/Mistas): 30€ por atleta (4 elementos). Inscrições em portimer.pt até 20 de maio de 2026. Troca de nomes permitida até 23 de maio.",
    },
    en: {
      question: "What are the categories and prices?",
      answer:
        "Individual (M/F and M/F Pro): €45. Doubles (M/F/Mixed and M/F Pro): €40 per athlete (2 members). Relay Teams (M/F/Mixed): €30 per athlete (4 members). Registration at portimer.pt until May 20, 2026. Name changes permitted until May 23.",
    },
    es: {
      question: "¿Cuáles son las categorías y precios?",
      answer:
        "Individual (M/F y M/F Pro): 45€. Parejas (M/F/Mixtas y M/F Pro): 40€ por atleta (2 elementos). Equipos Relevos (M/F/Mixtos): 30€ por atleta (4 elementos). Inscripciones en portimer.pt hasta el 20 de mayo de 2026. Cambio de nombres permitido hasta el 23 de mayo.",
    },
    fr: {
      question: "Quelles sont les catégories et les prix ?",
      answer:
        "Individuel (M/F et M/F Pro) : 45€. Doubles (M/F/Mixtes et M/F Pro) : 40€ par athlète (2 membres). Équipes Relais (M/F/Mixtes) : 30€ par athlète (4 membres). Inscriptions sur portimer.pt jusqu'au 20 mai 2026. Changement de noms autorisé jusqu'au 23 mai.",
    },
    de: {
      question: "Welche Kategorien und Preise gibt es?",
      answer:
        "Einzel (M/W und M/W Pro): 45€. Doppel (M/W/Mixed und M/W Pro): 40€ pro Athlet (2 Mitglieder). Staffelteams (M/W/Mixed): 30€ pro Athlet (4 Mitglieder). Anmeldung auf portimer.pt bis 20. Mai 2026. Namensänderungen bis 23. Mai möglich.",
    },
    it: {
      question: "Quali sono le categorie e i prezzi?",
      answer:
        "Individuale (M/F e M/F Pro): 45€. Coppie (M/F/Miste e M/F Pro): 40€ per atleta (2 membri). Squadre Staffetta (M/F/Miste): 30€ per atleta (4 membri). Iscrizioni su portimer.pt fino al 20 maggio 2026. Cambio nomi consentito fino al 23 maggio.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: {
        faqId_language: { faqId: faq1.id, language: Language[lang] },
      },
      update: faq1Translations[lang],
      create: {
        faqId: faq1.id,
        language: Language[lang],
        ...faq1Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 1: Categories and pricing");

  // FAQ 2: Heat system
  const faq2 = await findOrCreateFAQ(
    event.id,
    2,
    "Como funciona o sistema de heats?",
    "Cada heat tem 6 atletas ou duplas. As saídas são de 10 em 10 minutos. O check-in é obrigatório até 90 minutos antes do heat atribuído. Sem check-in, não será permitida a participação. Os atletas devem estar na zona de prova 20 minutos antes do heat para briefing obrigatório."
  );

  const faq2Translations = {
    pt: {
      question: "Como funciona o sistema de heats?",
      answer:
        "Cada heat tem 6 atletas ou duplas. As saídas são de 10 em 10 minutos. O check-in é obrigatório até 90 minutos antes do heat atribuído. Sem check-in, não será permitida a participação. Os atletas devem estar na zona de prova 20 minutos antes do heat para briefing obrigatório.",
    },
    en: {
      question: "How does the heat system work?",
      answer:
        "Each heat has 6 athletes or doubles. Starts are every 10 minutes. Check-in is mandatory up to 90 minutes before the assigned heat. Without check-in, participation will not be allowed. Athletes must be in the race area 20 minutes before the heat for a mandatory briefing.",
    },
    es: {
      question: "¿Cómo funciona el sistema de heats?",
      answer:
        "Cada heat tiene 6 atletas o parejas. Las salidas son cada 10 minutos. El check-in es obligatorio hasta 90 minutos antes del heat asignado. Sin check-in, no se permitirá la participación. Los atletas deben estar en la zona de prueba 20 minutos antes del heat para briefing obligatorio.",
    },
    fr: {
      question: "Comment fonctionne le système de heats ?",
      answer:
        "Chaque heat comporte 6 athlètes ou doubles. Les départs sont toutes les 10 minutes. Le check-in est obligatoire jusqu'à 90 minutes avant le heat assigné. Sans check-in, la participation ne sera pas autorisée. Les athlètes doivent être dans la zone de course 20 minutes avant le heat pour un briefing obligatoire.",
    },
    de: {
      question: "Wie funktioniert das Heat-System?",
      answer:
        "Jeder Heat hat 6 Athleten oder Doppel. Die Starts erfolgen alle 10 Minuten. Der Check-in ist bis 90 Minuten vor dem zugewiesenen Heat obligatorisch. Ohne Check-in ist die Teilnahme nicht gestattet. Athleten müssen 20 Minuten vor dem Heat in der Rennzone für ein obligatorisches Briefing sein.",
    },
    it: {
      question: "Come funziona il sistema di heat?",
      answer:
        "Ogni heat ha 6 atleti o coppie. Le partenze sono ogni 10 minuti. Il check-in è obbligatorio fino a 90 minuti prima dell'heat assegnato. Senza check-in, la partecipazione non sarà consentita. Gli atleti devono essere nella zona gara 20 minuti prima dell'heat per un briefing obbligatorio.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: {
        faqId_language: { faqId: faq2.id, language: Language[lang] },
      },
      update: faq2Translations[lang],
      create: {
        faqId: faq2.id,
        language: Language[lang],
        ...faq2Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 2: Heat system");

  // FAQ 3: Rules and penalties
  const faq3 = await findOrCreateFAQ(
    event.id,
    3,
    "Quais são as regras e penalizações?",
    "É obrigatório respeitar os juízes e padrões de movimento, utilizar apenas os percursos definidos e participar no briefing. Penalizações por: não cumprimento de padrões de movimento, saída fora de percurso, trocas ilegais, distâncias não cumpridas e desrespeito das zonas de transição. Balneários disponíveis no local."
  );

  const faq3Translations = {
    pt: {
      question: "Quais são as regras e penalizações?",
      answer:
        "É obrigatório respeitar os juízes e padrões de movimento, utilizar apenas os percursos definidos e participar no briefing. Penalizações por: não cumprimento de padrões de movimento, saída fora de percurso, trocas ilegais, distâncias não cumpridas e desrespeito das zonas de transição. Balneários disponíveis no local.",
    },
    en: {
      question: "What are the rules and penalties?",
      answer:
        "Athletes must respect judges and movement standards, use only defined courses and attend the briefing. Penalties for: non-compliance with movement standards, going off-course, illegal swaps, incomplete distances and disrespecting transition zones. Changing rooms available on-site.",
    },
    es: {
      question: "¿Cuáles son las reglas y penalizaciones?",
      answer:
        "Es obligatorio respetar a los jueces y estándares de movimiento, utilizar solo los recorridos definidos y participar en el briefing. Penalizaciones por: incumplimiento de estándares de movimiento, salida fuera de recorrido, cambios ilegales, distancias no cumplidas e irrespeto de las zonas de transición. Vestuarios disponibles en el lugar.",
    },
    fr: {
      question: "Quelles sont les règles et pénalités ?",
      answer:
        "Il est obligatoire de respecter les juges et les standards de mouvement, d'utiliser uniquement les parcours définis et de participer au briefing. Pénalités pour : non-respect des standards de mouvement, sortie hors parcours, échanges illégaux, distances non complétées et non-respect des zones de transition. Vestiaires disponibles sur place.",
    },
    de: {
      question: "Welche Regeln und Strafen gibt es?",
      answer:
        "Athleten müssen Richter und Bewegungsstandards respektieren, nur definierte Strecken nutzen und am Briefing teilnehmen. Strafen für: Nichteinhaltung von Bewegungsstandards, Verlassen der Strecke, illegale Wechsel, nicht absolvierte Distanzen und Missachtung der Übergangszonen. Umkleiden vor Ort verfügbar.",
    },
    it: {
      question: "Quali sono le regole e le penalità?",
      answer:
        "È obbligatorio rispettare i giudici e gli standard di movimento, utilizzare solo i percorsi definiti e partecipare al briefing. Penalità per: mancato rispetto degli standard di movimento, uscita dal percorso, scambi illegali, distanze non completate e mancato rispetto delle zone di transizione. Spogliatoi disponibili in loco.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: {
        faqId_language: { faqId: faq3.id, language: Language[lang] },
      },
      update: faq3Translations[lang],
      create: {
        faqId: faq3.id,
        language: Language[lang],
        ...faq3Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 3: Rules and penalties");

  // FAQ 4: Age groups
  const faq4 = await findOrCreateFAQ(
    event.id,
    4,
    "Quais são os grupos etários?",
    "Grupos etários: 16–29, 30–34, 35–39, 40–44, 45–49, 50–54, 55+. Idade mínima de participação: 16 anos. A inscrição autoriza a utilização de fotografias e vídeos para promoção do evento. Seguro desportivo incluído para todos os atletas."
  );

  const faq4Translations = {
    pt: {
      question: "Quais são os grupos etários?",
      answer:
        "Grupos etários: 16–29, 30–34, 35–39, 40–44, 45–49, 50–54, 55+. Idade mínima de participação: 16 anos. A inscrição autoriza a utilização de fotografias e vídeos para promoção do evento. Seguro desportivo incluído para todos os atletas.",
    },
    en: {
      question: "What are the age groups?",
      answer:
        "Age groups: 16–29, 30–34, 35–39, 40–44, 45–49, 50–54, 55+. Minimum participation age: 16 years. Registration authorizes the use of photos and videos for event promotion. Sports insurance included for all athletes.",
    },
    es: {
      question: "¿Cuáles son los grupos etarios?",
      answer:
        "Grupos etarios: 16–29, 30–34, 35–39, 40–44, 45–49, 50–54, 55+. Edad mínima de participación: 16 años. La inscripción autoriza el uso de fotografías y vídeos para promoción del evento. Seguro deportivo incluido para todos los atletas.",
    },
    fr: {
      question: "Quels sont les groupes d'âge ?",
      answer:
        "Groupes d'âge : 16–29, 30–34, 35–39, 40–44, 45–49, 50–54, 55+. Âge minimum de participation : 16 ans. L'inscription autorise l'utilisation de photos et vidéos pour la promotion de l'événement. Assurance sportive incluse pour tous les athlètes.",
    },
    de: {
      question: "Welche Altersgruppen gibt es?",
      answer:
        "Altersgruppen: 16–29, 30–34, 35–39, 40–44, 45–49, 50–54, 55+. Mindestalter: 16 Jahre. Die Anmeldung berechtigt zur Nutzung von Fotos und Videos zur Bewerbung der Veranstaltung. Sportversicherung für alle Athleten inklusive.",
    },
    it: {
      question: "Quali sono le fasce d'età?",
      answer:
        "Fasce d'età: 16–29, 30–34, 35–39, 40–44, 45–49, 50–54, 55+. Età minima di partecipazione: 16 anni. L'iscrizione autorizza l'uso di foto e video per la promozione dell'evento. Assicurazione sportiva inclusa per tutti gli atleti.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: {
        faqId_language: { faqId: faq4.id, language: Language[lang] },
      },
      update: faq4Translations[lang],
      create: {
        faqId: faq4.id,
        language: Language[lang],
        ...faq4Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 4: Age groups");

  // ──────────────────────────────────────────────
  // Summary
  // ──────────────────────────────────────────────
  console.log(`
✅ Seed completed successfully!

📊 Summary:
- Event: Hyberic Run 2026
- Slug: hyberic-run-chaves-2026
- Variants: 12 (4 Individual, 5 Duplas, 3 Estafeta)
- Languages: 6 (pt, en, es, fr, de, it)
- Pricing Phases: 12 (1 per variant)
- FAQs: 5 (with translations in all 6 languages)
- Date: May 30, 2026
- Location: Estádio Municipal Eng. Manuel Branco Teixeira, Chaves
- Coordinates: 41.7401, -7.4706
- Organization: Associação Pódios e Bancadas
- Sport: HYROX
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
