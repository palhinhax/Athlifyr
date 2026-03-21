/**
 * Seed: HYGOES 2026
 *
 * Event: Hyrox-style endurance race (Open Doubles only) in Góis
 * Location: Vila de Góis
 * Date: September 12, 2026
 * Organizer: Associação Raiz Gois (RAIZGOES)
 * Sport: Hyrox
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏋️ Seeding HYGOES 2026...");

  // ──────────────────────────────────────────────
  // 1. Upsert Event
  // ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: "hygoes-gois-2026" },
    update: {
      title: "HYGOES 2026",
      description: "HYGOES 2026 - Simulação Hyrox em Góis",
      sportTypes: [SportType.HYROX],
      startDate: new Date("2026-09-12T09:00:00Z"),
      endDate: new Date("2026-09-12T18:00:00Z"),
      registrationDeadline: new Date("2026-08-31T23:59:59Z"),
      externalUrl: "",
      imageUrl: "",
      city: "Góis",
      country: "Portugal",
      latitude: 40.1583,
      longitude: -8.1122,
      googleMapsUrl: "",
      isFeatured: false,
      cancelled: false,
    },
    create: {
      title: "HYGOES 2026",
      slug: "hygoes-gois-2026",
      description: "HYGOES 2026 - Simulação Hyrox em Góis",
      sportTypes: [SportType.HYROX],
      startDate: new Date("2026-09-12T09:00:00Z"),
      endDate: new Date("2026-09-12T18:00:00Z"),
      registrationDeadline: new Date("2026-08-31T23:59:59Z"),
      externalUrl: "",
      imageUrl: "",
      city: "Góis",
      country: "Portugal",
      latitude: 40.1583,
      longitude: -8.1122,
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
      title: "HYGOES 2026",
      description: `# 🏋️ HYGOES 2026

**O HYGOES realiza-se a 12 de setembro de 2026 em Góis**, organizado pela Associação Raiz Gois (RAIZGOES). É uma prova de endurance inspirada no modelo competitivo Hyrox, **exclusivamente na categoria Open Duplas**.

---

## 🏋️ Formato da Prova

A prova é composta por **8 km de corrida (8×1 km)** intercalados com **8 estações funcionais**:

1. 🎿 SkiErg – 1000 m
2. 🛷 Sled Push – 50 m
3. 🪢 Sled Pull – 50 m
4. 💪 Burpee Broad Jumps – 80 m
5. 🚣 Row – 1000 m
6. 🏋️ Farmer's Carry – 200 m
7. 🎒 Sandbag Lunges – 100 m
8. 🏐 Wall Balls – 100 repetições

### Pesos – Categoria Masculina Open

| Estação | Peso |
|---|---|
| Sled Push | 152 kg (incluindo trenó) |
| Sled Pull | 103 kg |
| Farmer's Carry | 2×24 kg |
| Sandbag Lunges | 20 kg |
| Wall Balls | 6 kg (alvo 3,0 m) |

### Pesos – Categoria Feminina Open

| Estação | Peso |
|---|---|
| Sled Push | 102 kg (incluindo trenó) |
| Sled Pull | 78 kg |
| Farmer's Carry | 2×16 kg |
| Sandbag Lunges | 10 kg |
| Wall Balls | 4 kg (alvo 2,7 m) |

### Duplas Mistas Open

Nas duplas mistas, os pesos aplicados são os da categoria masculina. As estações podem ser divididas livremente entre os dois atletas. A dupla deve cruzar a linha de chegada junta.

---

## 🏅 Categorias

Prova **exclusivamente em duplas** (categoria Open):
- **Duplas Masculinas**
- **Duplas Femininas**
- **Duplas Mistas**

---

## 📋 Regras

- Ambos os atletas devem completar os 8 km de corrida juntos
- O trabalho nas estações pode ser dividido livremente
- Apenas um atleta trabalha de cada vez nas estações
- O início de cada estação requer os dois elementos presentes
- Todas as repetições validadas por juízes

---

## 📍 Local e Logística

**Local:** Vila de Góis

**Sistema de Heats:**
- Saídas de 15 em 15 minutos
- Check-in obrigatório 1 hora antes da partida
- Atletas no local de partida 15 minutos antes da saída
- Briefing obrigatório

---

## 🎯 Destaques

✅ Seguro de participação incluído
✅ Prova cronometrada – classificação pelo tempo total
✅ Prémios: fins de semana em AL (Aldeias do Xisto)
✅ Produtos regionais
✅ Lembranças de participação`,
      city: "Góis",
      metaTitle: "HYGOES 2026 | Góis | 12 Setembro",
      metaDescription:
        "HYGOES 2026 a 12 de setembro em Góis. Simulação Hyrox exclusivamente em duplas com 8km de corrida e 8 estações funcionais. Duplas Masculinas, Femininas e Mistas. 70€ por dupla.",
    },
    en: {
      title: "HYGOES 2026",
      description: `# 🏋️ HYGOES 2026

**HYGOES takes place on September 12, 2026 in Góis**, organized by Associação Raiz Gois (RAIZGOES). It is a Hyrox-inspired endurance race, **exclusively in the Open Doubles category**.

---

## 🏋️ Race Format

The race consists of **8 km of running (8×1 km)** interspersed with **8 functional stations**:

1. 🎿 SkiErg – 1,000 m
2. 🛷 Sled Push – 50 m
3. 🪢 Sled Pull – 50 m
4. 💪 Burpee Broad Jumps – 80 m
5. 🚣 Row – 1,000 m
6. 🏋️ Farmer's Carry – 200 m
7. 🎒 Sandbag Lunges – 100 m
8. 🏐 Wall Balls – 100 reps

### Weights – Men's Open

| Station | Weight |
|---|---|
| Sled Push | 152 kg (including sled) |
| Sled Pull | 103 kg |
| Farmer's Carry | 2×24 kg |
| Sandbag Lunges | 20 kg |
| Wall Balls | 6 kg (target 3.0 m) |

### Weights – Women's Open

| Station | Weight |
|---|---|
| Sled Push | 102 kg (including sled) |
| Sled Pull | 78 kg |
| Farmer's Carry | 2×16 kg |
| Sandbag Lunges | 10 kg |
| Wall Balls | 4 kg (target 2.7 m) |

### Mixed Doubles Open

In mixed doubles, men's weights apply. Stations can be freely split between athletes. The pair must cross the finish line together.

---

## 🏅 Categories

**Exclusively doubles** race (Open category):
- **Men's Doubles**
- **Women's Doubles**
- **Mixed Doubles**

---

## 📋 Rules

- Both athletes must complete the 8 km of running together
- Station work can be freely divided
- Only one athlete works at a time at stations
- Each station starts only with both members present
- All reps validated by judges

---

## 📍 Location and Logistics

**Venue:** Vila de Góis

**Heat System:**
- Starts every 15 minutes
- Mandatory check-in 1 hour before start
- Athletes at starting area 15 minutes before departure
- Mandatory briefing

---

## 🎯 Highlights

✅ Participation insurance included
✅ Timed race – classification by total time
✅ Prizes: weekends at AL (Aldeias do Xisto)
✅ Regional products
✅ Participation mementos`,
      city: "Góis",
      metaTitle: "HYGOES 2026 | Góis | September 12",
      metaDescription:
        "HYGOES 2026 on September 12 in Góis. Hyrox-style race exclusively in doubles with 8km running and 8 functional stations. Men's, Women's and Mixed Doubles. €70 per pair.",
    },
    es: {
      title: "HYGOES 2026",
      description: `# 🏋️ HYGOES 2026

**El HYGOES se celebra el 12 de septiembre de 2026 en Góis**, organizado por la Associação Raiz Gois (RAIZGOES). Es una prueba de endurance inspirada en el modelo Hyrox, **exclusivamente en la categoría Open Parejas**.

---

## 🏋️ Formato de la Prueba

La prueba está compuesta por **8 km de carrera (8×1 km)** intercalados con **8 estaciones funcionales**:

1. 🎿 SkiErg – 1.000 m
2. 🛷 Sled Push – 50 m
3. 🪢 Sled Pull – 50 m
4. 💪 Burpee Broad Jumps – 80 m
5. 🚣 Row – 1.000 m
6. 🏋️ Farmer's Carry – 200 m
7. 🎒 Sandbag Lunges – 100 m
8. 🏐 Wall Balls – 100 repeticiones

### Pesos – Categoría Masculina Open

| Estación | Peso |
|---|---|
| Sled Push | 152 kg (incluido trineo) |
| Sled Pull | 103 kg |
| Farmer's Carry | 2×24 kg |
| Sandbag Lunges | 20 kg |
| Wall Balls | 6 kg (objetivo 3,0 m) |

### Pesos – Categoría Femenina Open

| Estación | Peso |
|---|---|
| Sled Push | 102 kg (incluido trineo) |
| Sled Pull | 78 kg |
| Farmer's Carry | 2×16 kg |
| Sandbag Lunges | 10 kg |
| Wall Balls | 4 kg (objetivo 2,7 m) |

### Parejas Mixtas Open

En parejas mixtas se aplican los pesos masculinos. Las estaciones pueden dividirse libremente. La pareja debe cruzar la meta junta.

---

## 🏅 Categorías

Prueba **exclusivamente en parejas** (categoría Open):
- **Parejas Masculinas**
- **Parejas Femeninas**
- **Parejas Mixtas**

---

## 📋 Reglas

- Ambos atletas deben completar los 8 km de carrera juntos
- El trabajo en estaciones se divide libremente
- Solo un atleta trabaja a la vez en las estaciones
- Cada estación se inicia solo con ambos miembros presentes
- Todas las repeticiones validadas por jueces

---

## 📍 Ubicación y Logística

**Lugar:** Vila de Góis

**Sistema de Heats:**
- Salidas cada 15 minutos
- Check-in obligatorio 1 hora antes de la salida
- Atletas en la zona de salida 15 minutos antes
- Briefing obligatorio

---

## 🎯 Destacados

✅ Seguro de participación incluido
✅ Prueba cronometrada – clasificación por tiempo total
✅ Premios: fines de semana en AL (Aldeias do Xisto)
✅ Productos regionales
✅ Recuerdos de participación`,
      city: "Góis",
      metaTitle: "HYGOES 2026 | Góis | 12 Septiembre",
      metaDescription:
        "HYGOES 2026 el 12 de septiembre en Góis. Prueba tipo Hyrox exclusivamente en parejas con 8km de carrera y 8 estaciones funcionales. Parejas Masculinas, Femeninas y Mixtas. 70€ por pareja.",
    },
    fr: {
      title: "HYGOES 2026",
      description: `# 🏋️ HYGOES 2026

**Le HYGOES a lieu le 12 septembre 2026 à Góis**, organisé par l'Associação Raiz Gois (RAIZGOES). C'est une épreuve d'endurance inspirée du modèle Hyrox, **exclusivement en catégorie Open Doubles**.

---

## 🏋️ Format de l'Épreuve

L'épreuve est composée de **8 km de course (8×1 km)** intercalés avec **8 stations fonctionnelles** :

1. 🎿 SkiErg – 1 000 m
2. 🛷 Sled Push – 50 m
3. 🪢 Sled Pull – 50 m
4. 💪 Burpee Broad Jumps – 80 m
5. 🚣 Row – 1 000 m
6. 🏋️ Farmer's Carry – 200 m
7. 🎒 Sandbag Lunges – 100 m
8. 🏐 Wall Balls – 100 répétitions

### Poids – Catégorie Masculine Open

| Station | Poids |
|---|---|
| Sled Push | 152 kg (traîneau inclus) |
| Sled Pull | 103 kg |
| Farmer's Carry | 2×24 kg |
| Sandbag Lunges | 20 kg |
| Wall Balls | 6 kg (cible 3,0 m) |

### Poids – Catégorie Féminine Open

| Station | Poids |
|---|---|
| Sled Push | 102 kg (traîneau inclus) |
| Sled Pull | 78 kg |
| Farmer's Carry | 2×16 kg |
| Sandbag Lunges | 10 kg |
| Wall Balls | 4 kg (cible 2,7 m) |

### Doubles Mixtes Open

En doubles mixtes, les poids masculins s'appliquent. Les stations peuvent être librement réparties. Le duo doit franchir la ligne d'arrivée ensemble.

---

## 🏅 Catégories

Épreuve **exclusivement en doubles** (catégorie Open) :
- **Doubles Masculins**
- **Doubles Féminins**
- **Doubles Mixtes**

---

## 📋 Règles

- Les deux athlètes doivent compléter les 8 km de course ensemble
- Le travail aux stations peut être librement réparti
- Un seul athlète travaille à la fois aux stations
- Chaque station commence uniquement avec les deux membres présents
- Toutes les répétitions validées par des juges

---

## 📍 Lieu et Logistique

**Lieu :** Vila de Góis

**Système de Heats :**
- Départs toutes les 15 minutes
- Check-in obligatoire 1 heure avant le départ
- Athlètes sur la zone de départ 15 minutes avant
- Briefing obligatoire

---

## 🎯 Points Forts

✅ Assurance de participation incluse
✅ Épreuve chronométrée – classement par temps total
✅ Prix : week-ends en AL (Aldeias do Xisto)
✅ Produits régionaux
✅ Souvenirs de participation`,
      city: "Góis",
      metaTitle: "HYGOES 2026 | Góis | 12 Septembre",
      metaDescription:
        "HYGOES 2026 le 12 septembre à Góis. Épreuve type Hyrox exclusivement en doubles avec 8km de course et 8 stations fonctionnelles. Doubles Masculins, Féminins et Mixtes. 70€ par duo.",
    },
    de: {
      title: "HYGOES 2026",
      description: `# 🏋️ HYGOES 2026

**Der HYGOES findet am 12. September 2026 in Góis statt**, organisiert von der Associação Raiz Gois (RAIZGOES). Es ist ein Hyrox-inspiriertes Ausdauerrennen, **ausschließlich in der Kategorie Open Doppel**.

---

## 🏋️ Rennformat

Das Rennen besteht aus **8 km Lauf (8×1 km)**, abgewechselt mit **8 funktionellen Stationen**:

1. 🎿 SkiErg – 1.000 m
2. 🛷 Sled Push – 50 m
3. 🪢 Sled Pull – 50 m
4. 💪 Burpee Broad Jumps – 80 m
5. 🚣 Row – 1.000 m
6. 🏋️ Farmer's Carry – 200 m
7. 🎒 Sandbag Lunges – 100 m
8. 🏐 Wall Balls – 100 Wiederholungen

### Gewichte – Männer Open

| Station | Gewicht |
|---|---|
| Sled Push | 152 kg (inkl. Schlitten) |
| Sled Pull | 103 kg |
| Farmer's Carry | 2×24 kg |
| Sandbag Lunges | 20 kg |
| Wall Balls | 6 kg (Ziel 3,0 m) |

### Gewichte – Frauen Open

| Station | Gewicht |
|---|---|
| Sled Push | 102 kg (inkl. Schlitten) |
| Sled Pull | 78 kg |
| Farmer's Carry | 2×16 kg |
| Sandbag Lunges | 10 kg |
| Wall Balls | 4 kg (Ziel 2,7 m) |

### Mixed Doppel Open

Bei Mixed-Doppel gelten die Männergewichte. Stationen können frei aufgeteilt werden. Das Paar muss gemeinsam die Ziellinie überqueren.

---

## 🏅 Kategorien

Rennen **ausschließlich als Doppel** (Open Kategorie):
- **Männer-Doppel**
- **Frauen-Doppel**
- **Mixed-Doppel**

---

## 📋 Regeln

- Beide Athleten müssen die 8 km gemeinsam laufen
- Die Stationsarbeit kann frei aufgeteilt werden
- Nur ein Athlet arbeitet gleichzeitig an den Stationen
- Jede Station beginnt nur mit beiden Mitgliedern
- Alle Wiederholungen werden von Richtern validiert

---

## 📍 Ort und Logistik

**Veranstaltungsort:** Vila de Góis

**Heat-System:**
- Starts alle 15 Minuten
- Pflicht-Check-in 1 Stunde vor dem Start
- Athleten 15 Minuten vor Abfahrt am Startbereich
- Pflicht-Briefing

---

## 🎯 Höhepunkte

✅ Teilnahmeversicherung inklusive
✅ Zeitrennen – Wertung nach Gesamtzeit
✅ Preise: Wochenenden in AL (Aldeias do Xisto)
✅ Regionale Produkte
✅ Teilnahmeandenken`,
      city: "Góis",
      metaTitle: "HYGOES 2026 | Góis | 12. September",
      metaDescription:
        "HYGOES 2026 am 12. September in Góis. Hyrox-ähnliches Rennen ausschließlich als Doppel mit 8km Lauf und 8 funktionellen Stationen. Männer-, Frauen- und Mixed-Doppel. 70€ pro Paar.",
    },
    it: {
      title: "HYGOES 2026",
      description: `# 🏋️ HYGOES 2026

**L'HYGOES si svolge il 12 settembre 2026 a Góis**, organizzato dall'Associação Raiz Gois (RAIZGOES). È una gara di endurance ispirata al modello Hyrox, **esclusivamente nella categoria Open Coppie**.

---

## 🏋️ Formato della Gara

La gara è composta da **8 km di corsa (8×1 km)** alternati con **8 stazioni funzionali**:

1. 🎿 SkiErg – 1.000 m
2. 🛷 Sled Push – 50 m
3. 🪢 Sled Pull – 50 m
4. 💪 Burpee Broad Jumps – 80 m
5. 🚣 Row – 1.000 m
6. 🏋️ Farmer's Carry – 200 m
7. 🎒 Sandbag Lunges – 100 m
8. 🏐 Wall Balls – 100 ripetizioni

### Pesi – Categoria Maschile Open

| Stazione | Peso |
|---|---|
| Sled Push | 152 kg (slitta inclusa) |
| Sled Pull | 103 kg |
| Farmer's Carry | 2×24 kg |
| Sandbag Lunges | 20 kg |
| Wall Balls | 6 kg (bersaglio 3,0 m) |

### Pesi – Categoria Femminile Open

| Stazione | Peso |
|---|---|
| Sled Push | 102 kg (slitta inclusa) |
| Sled Pull | 78 kg |
| Farmer's Carry | 2×16 kg |
| Sandbag Lunges | 10 kg |
| Wall Balls | 4 kg (bersaglio 2,7 m) |

### Coppie Miste Open

Nelle coppie miste si applicano i pesi maschili. Le stazioni possono essere divise liberamente. La coppia deve tagliare il traguardo insieme.

---

## 🏅 Categorie

Gara **esclusivamente in coppie** (categoria Open):
- **Coppie Maschili**
- **Coppie Femminili**
- **Coppie Miste**

---

## 📋 Regole

- Entrambi gli atleti devono completare gli 8 km di corsa insieme
- Il lavoro alle stazioni può essere diviso liberamente
- Solo un atleta lavora alla volta alle stazioni
- Ogni stazione inizia solo con entrambi i membri presenti
- Tutte le ripetizioni validate da giudici

---

## 📍 Luogo e Logistica

**Sede:** Vila de Góis

**Sistema di Heat:**
- Partenze ogni 15 minuti
- Check-in obbligatorio 1 ora prima della partenza
- Atleti nella zona di partenza 15 minuti prima
- Briefing obbligatorio

---

## 🎯 Punti di Forza

✅ Assicurazione di partecipazione inclusa
✅ Gara cronometrata – classifica per tempo totale
✅ Premi: fine settimana in AL (Aldeias do Xisto)
✅ Prodotti regionali
✅ Ricordi di partecipazione`,
      city: "Góis",
      metaTitle: "HYGOES 2026 | Góis | 12 Settembre",
      metaDescription:
        "HYGOES 2026 il 12 settembre a Góis. Gara tipo Hyrox esclusivamente in coppie con 8km di corsa e 8 stazioni funzionali. Coppie Maschili, Femminili e Miste. 70€ a coppia.",
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

  // ── Variant 1: Duplas Masculinas Open ──
  const duplasM = await findOrCreateVariant({
    name: "Duplas Masculinas Open",
    distanceKm: 8,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-09-12T09:00:00Z"),
    startTime: "09:00",
    cutoffTimeHours: null,
    price: 70.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Duplas Masculinas Open · 2 elementos · 70€/dupla · 8×1km + 8 estações funcionais",
  });
  console.log(`✅ Variant: ${duplasM.name}`);

  // ── Variant 2: Duplas Femininas Open ──
  const duplasF = await findOrCreateVariant({
    name: "Duplas Femininas Open",
    distanceKm: 8,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-09-12T09:00:00Z"),
    startTime: "09:00",
    cutoffTimeHours: null,
    price: 70.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Duplas Femininas Open · 2 elementos · 70€/dupla · 8×1km + 8 estações funcionais",
  });
  console.log(`✅ Variant: ${duplasF.name}`);

  // ── Variant 3: Duplas Mistas Open ──
  const duplasMistas = await findOrCreateVariant({
    name: "Duplas Mistas Open",
    distanceKm: 8,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-09-12T09:00:00Z"),
    startTime: "09:00",
    cutoffTimeHours: null,
    price: 70.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Duplas Mistas Open · 2 elementos · 70€/dupla · 8×1km + 8 estações funcionais · Pesos masculinos",
  });
  console.log(`✅ Variant: ${duplasMistas.name}`);

  // ──────────────────────────────────────────────
  // 4. Pricing Phases (linked to eventId AND variantId)
  // ──────────────────────────────────────────────
  for (const variant of [duplasM, duplasF, duplasMistas]) {
    await findOrCreatePricingPhase(`${variant.name} - Inscrição`, variant.id, {
      startDate: new Date("2026-01-01T00:00:00Z"),
      endDate: new Date("2026-08-31T23:59:59Z"),
      price: 70.0,
      currency: Currency.EUR,
      note: "70€ por dupla · Inclui seguro de participação · Limite: 31 agosto 2026",
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

  // FAQ 0: What is HYGOES
  const faq0 = await findOrCreateFAQ(
    event.id,
    0,
    "O que é o HYGOES?",
    "O HYGOES é uma prova de endurance inspirada no modelo competitivo Hyrox, exclusivamente na categoria Open Duplas. É composta por 8km de corrida (8×1km) intercalados com 8 estações funcionais: SkiErg, Sled Push, Sled Pull, Burpee Broad Jumps, Row, Farmer's Carry, Sandbag Lunges e Wall Balls."
  );

  const faq0Translations = {
    pt: {
      question: "O que é o HYGOES?",
      answer:
        "O HYGOES é uma prova de endurance inspirada no modelo competitivo Hyrox, exclusivamente na categoria Open Duplas. É composta por 8km de corrida (8×1km) intercalados com 8 estações funcionais: SkiErg, Sled Push, Sled Pull, Burpee Broad Jumps, Row, Farmer's Carry, Sandbag Lunges e Wall Balls.",
    },
    en: {
      question: "What is HYGOES?",
      answer:
        "HYGOES is a Hyrox-inspired endurance race, exclusively in the Open Doubles category. It consists of 8km of running (8×1km) interspersed with 8 functional stations: SkiErg, Sled Push, Sled Pull, Burpee Broad Jumps, Row, Farmer's Carry, Sandbag Lunges and Wall Balls.",
    },
    es: {
      question: "¿Qué es HYGOES?",
      answer:
        "HYGOES es una prueba de endurance inspirada en el modelo Hyrox, exclusivamente en la categoría Open Parejas. Está compuesta por 8km de carrera (8×1km) intercalados con 8 estaciones funcionales: SkiErg, Sled Push, Sled Pull, Burpee Broad Jumps, Row, Farmer's Carry, Sandbag Lunges y Wall Balls.",
    },
    fr: {
      question: "Qu'est-ce que HYGOES ?",
      answer:
        "HYGOES est une épreuve d'endurance inspirée du modèle Hyrox, exclusivement en catégorie Open Doubles. Elle est composée de 8km de course (8×1km) intercalés avec 8 stations fonctionnelles : SkiErg, Sled Push, Sled Pull, Burpee Broad Jumps, Row, Farmer's Carry, Sandbag Lunges et Wall Balls.",
    },
    de: {
      question: "Was ist HYGOES?",
      answer:
        "HYGOES ist ein Hyrox-inspiriertes Ausdauerrennen, ausschließlich in der Kategorie Open Doppel. Es besteht aus 8km Lauf (8×1km), abgewechselt mit 8 funktionellen Stationen: SkiErg, Sled Push, Sled Pull, Burpee Broad Jumps, Row, Farmer's Carry, Sandbag Lunges und Wall Balls.",
    },
    it: {
      question: "Cos'è HYGOES?",
      answer:
        "HYGOES è una gara di endurance ispirata al modello Hyrox, esclusivamente nella categoria Open Coppie. È composta da 8km di corsa (8×1km) alternati con 8 stazioni funzionali: SkiErg, Sled Push, Sled Pull, Burpee Broad Jumps, Row, Farmer's Carry, Sandbag Lunges e Wall Balls.",
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
  console.log("✅ FAQ 0: What is HYGOES");

  // FAQ 1: Categories and pricing
  const faq1 = await findOrCreateFAQ(
    event.id,
    1,
    "Quais são as categorias e o preço?",
    "A prova é exclusivamente em duplas na categoria Open: Duplas Masculinas, Duplas Femininas e Duplas Mistas. O valor da inscrição é de 70€ por dupla. Inscrições até 31 de agosto de 2026."
  );

  const faq1Translations = {
    pt: {
      question: "Quais são as categorias e o preço?",
      answer:
        "A prova é exclusivamente em duplas na categoria Open: Duplas Masculinas, Duplas Femininas e Duplas Mistas. O valor da inscrição é de 70€ por dupla. Inscrições até 31 de agosto de 2026.",
    },
    en: {
      question: "What are the categories and price?",
      answer:
        "The race is exclusively in doubles in the Open category: Men's Doubles, Women's Doubles and Mixed Doubles. Registration fee is €70 per pair. Registration until August 31, 2026.",
    },
    es: {
      question: "¿Cuáles son las categorías y el precio?",
      answer:
        "La prueba es exclusivamente en parejas en la categoría Open: Parejas Masculinas, Parejas Femeninas y Parejas Mixtas. El valor de la inscripción es de 70€ por pareja. Inscripciones hasta el 31 de agosto de 2026.",
    },
    fr: {
      question: "Quelles sont les catégories et le prix ?",
      answer:
        "L'épreuve est exclusivement en doubles dans la catégorie Open : Doubles Masculins, Doubles Féminins et Doubles Mixtes. Le prix de l'inscription est de 70€ par duo. Inscriptions jusqu'au 31 août 2026.",
    },
    de: {
      question: "Welche Kategorien und welcher Preis?",
      answer:
        "Das Rennen ist ausschließlich als Doppel in der Open Kategorie: Männer-Doppel, Frauen-Doppel und Mixed-Doppel. Die Anmeldegebühr beträgt 70€ pro Paar. Anmeldung bis 31. August 2026.",
    },
    it: {
      question: "Quali sono le categorie e il prezzo?",
      answer:
        "La gara è esclusivamente in coppie nella categoria Open: Coppie Maschili, Coppie Femminili e Coppie Miste. Il costo dell'iscrizione è di 70€ a coppia. Iscrizioni fino al 31 agosto 2026.",
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

  // FAQ 2: Rules for doubles
  const faq2 = await findOrCreateFAQ(
    event.id,
    2,
    "Como funcionam as regras para duplas?",
    "Ambos os atletas devem completar os 8km de corrida juntos, permanecendo próximos durante o percurso. Nas estações, o trabalho pode ser dividido livremente, mas apenas um atleta trabalha de cada vez. O início de cada estação requer os dois elementos presentes. A estação termina apenas quando o volume total estiver concluído. Todas as repetições são validadas por juízes."
  );

  const faq2Translations = {
    pt: {
      question: "Como funcionam as regras para duplas?",
      answer:
        "Ambos os atletas devem completar os 8km de corrida juntos, permanecendo próximos durante o percurso. Nas estações, o trabalho pode ser dividido livremente, mas apenas um atleta trabalha de cada vez. O início de cada estação requer os dois elementos presentes. A estação termina apenas quando o volume total estiver concluído. Todas as repetições são validadas por juízes.",
    },
    en: {
      question: "How do the doubles rules work?",
      answer:
        "Both athletes must complete the 8km of running together, staying close during the course. At stations, work can be freely divided, but only one athlete works at a time. Each station starts only with both members present. The station ends only when the total volume is completed. All reps are validated by judges.",
    },
    es: {
      question: "¿Cómo funcionan las reglas para parejas?",
      answer:
        "Ambos atletas deben completar los 8km de carrera juntos, permaneciendo cerca durante el recorrido. En las estaciones, el trabajo se divide libremente, pero solo un atleta trabaja a la vez. Cada estación se inicia solo con ambos miembros presentes. La estación termina solo cuando se completa el volumen total. Todas las repeticiones son validadas por jueces.",
    },
    fr: {
      question: "Comment fonctionnent les règles pour les doubles ?",
      answer:
        "Les deux athlètes doivent compléter les 8km de course ensemble, en restant proches pendant le parcours. Aux stations, le travail peut être librement réparti, mais un seul athlète travaille à la fois. Chaque station commence uniquement avec les deux membres présents. La station se termine uniquement lorsque le volume total est complété. Toutes les répétitions sont validées par des juges.",
    },
    de: {
      question: "Wie funktionieren die Doppel-Regeln?",
      answer:
        "Beide Athleten müssen die 8km gemeinsam laufen und dabei nah beieinander bleiben. An den Stationen kann die Arbeit frei aufgeteilt werden, aber nur ein Athlet arbeitet gleichzeitig. Jede Station beginnt nur mit beiden Mitgliedern. Die Station endet erst, wenn das Gesamtvolumen abgeschlossen ist. Alle Wiederholungen werden von Richtern validiert.",
    },
    it: {
      question: "Come funzionano le regole per le coppie?",
      answer:
        "Entrambi gli atleti devono completare gli 8km di corsa insieme, rimanendo vicini durante il percorso. Alle stazioni, il lavoro può essere diviso liberamente, ma solo un atleta lavora alla volta. Ogni stazione inizia solo con entrambi i membri presenti. La stazione termina solo quando il volume totale è completato. Tutte le ripetizioni sono validate da giudici.",
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
  console.log("✅ FAQ 2: Rules for doubles");

  // FAQ 3: Check-in and heats
  const faq3 = await findOrCreateFAQ(
    event.id,
    3,
    "Como funciona o check-in e o sistema de heats?",
    "O check-in é obrigatório 1 hora antes da hora prevista de partida, com entrega de dorsal e validação da inscrição no secretariado. Inscrições não são transmissíveis. As saídas são realizadas de 15 em 15 minutos. Todos os atletas devem estar no local de partida 15 minutos antes da hora prevista para briefing obrigatório. A ausência no check-in ou não comparência pode resultar em desclassificação."
  );

  const faq3Translations = {
    pt: {
      question: "Como funciona o check-in e o sistema de heats?",
      answer:
        "O check-in é obrigatório 1 hora antes da hora prevista de partida, com entrega de dorsal e validação da inscrição no secretariado. Inscrições não são transmissíveis. As saídas são realizadas de 15 em 15 minutos. Todos os atletas devem estar no local de partida 15 minutos antes da hora prevista para briefing obrigatório. A ausência no check-in ou não comparência pode resultar em desclassificação.",
    },
    en: {
      question: "How does check-in and the heat system work?",
      answer:
        "Check-in is mandatory 1 hour before the scheduled start, with bib collection and registration validation at the desk. Registrations are non-transferable. Starts are every 15 minutes. All athletes must be at the starting area 15 minutes before for mandatory briefing. Absence at check-in or no-show may result in disqualification.",
    },
    es: {
      question: "¿Cómo funciona el check-in y el sistema de heats?",
      answer:
        "El check-in es obligatorio 1 hora antes de la hora prevista de salida, con entrega de dorsal y validación de inscripción en secretariado. Las inscripciones no son transferibles. Las salidas se realizan cada 15 minutos. Todos los atletas deben estar en el lugar de salida 15 minutos antes para briefing obligatorio. La ausencia en el check-in o no comparecencia puede resultar en descalificación.",
    },
    fr: {
      question: "Comment fonctionnent le check-in et le système de heats ?",
      answer:
        "Le check-in est obligatoire 1 heure avant l'heure prévue de départ, avec remise du dossard et validation de l'inscription au secrétariat. Les inscriptions ne sont pas transférables. Les départs sont toutes les 15 minutes. Tous les athlètes doivent être sur la zone de départ 15 minutes avant pour le briefing obligatoire. L'absence au check-in ou la non-présentation peut entraîner la disqualification.",
    },
    de: {
      question: "Wie funktioniert der Check-in und das Heat-System?",
      answer:
        "Der Check-in ist 1 Stunde vor der geplanten Startzeit obligatorisch, mit Abholung der Startnummer und Validierung der Anmeldung am Sekretariat. Anmeldungen sind nicht übertragbar. Die Starts erfolgen alle 15 Minuten. Alle Athleten müssen 15 Minuten vorher am Startbereich für das Pflicht-Briefing sein. Abwesenheit beim Check-in oder Nichterscheinen kann zur Disqualifikation führen.",
    },
    it: {
      question: "Come funzionano il check-in e il sistema di heat?",
      answer:
        "Il check-in è obbligatorio 1 ora prima dell'orario previsto di partenza, con ritiro del pettorale e validazione dell'iscrizione alla segreteria. Le iscrizioni non sono trasferibili. Le partenze avvengono ogni 15 minuti. Tutti gli atleti devono essere nella zona di partenza 15 minuti prima per il briefing obbligatorio. L'assenza al check-in o la mancata presentazione può comportare la squalifica.",
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
  console.log("✅ FAQ 3: Check-in and heats");

  // FAQ 4: Prizes
  const faq4 = await findOrCreateFAQ(
    event.id,
    4,
    "Quais são os prémios?",
    "Prémios incluem fins de semana em AL (Aldeias do Xisto), produtos regionais e lembranças de participação. A classificação é determinada pelo tempo total de prova. Em caso de empate, vence a dupla que concluir primeiro a última estação. Seguro de participação incluído para todos os atletas."
  );

  const faq4Translations = {
    pt: {
      question: "Quais são os prémios?",
      answer:
        "Prémios incluem fins de semana em AL (Aldeias do Xisto), produtos regionais e lembranças de participação. A classificação é determinada pelo tempo total de prova. Em caso de empate, vence a dupla que concluir primeiro a última estação. Seguro de participação incluído para todos os atletas.",
    },
    en: {
      question: "What are the prizes?",
      answer:
        "Prizes include weekends at AL (Aldeias do Xisto), regional products and participation mementos. Classification is determined by total race time. In case of a tie, the pair that completes the last station first wins. Participation insurance included for all athletes.",
    },
    es: {
      question: "¿Cuáles son los premios?",
      answer:
        "Los premios incluyen fines de semana en AL (Aldeias do Xisto), productos regionales y recuerdos de participación. La clasificación se determina por el tiempo total de prueba. En caso de empate, gana la pareja que complete primero la última estación. Seguro de participación incluido para todos los atletas.",
    },
    fr: {
      question: "Quels sont les prix ?",
      answer:
        "Les prix incluent des week-ends en AL (Aldeias do Xisto), des produits régionaux et des souvenirs de participation. Le classement est déterminé par le temps total de l'épreuve. En cas d'égalité, le duo qui termine la dernière station en premier l'emporte. Assurance de participation incluse pour tous les athlètes.",
    },
    de: {
      question: "Welche Preise gibt es?",
      answer:
        "Preise umfassen Wochenenden in AL (Aldeias do Xisto), regionale Produkte und Teilnahmeandenken. Die Wertung erfolgt nach Gesamtzeit. Bei Gleichstand gewinnt das Paar, das die letzte Station zuerst abschließt. Teilnahmeversicherung für alle Athleten inklusive.",
    },
    it: {
      question: "Quali sono i premi?",
      answer:
        "I premi includono fine settimana in AL (Aldeias do Xisto), prodotti regionali e ricordi di partecipazione. La classifica è determinata dal tempo totale di gara. In caso di parità, vince la coppia che completa per prima l'ultima stazione. Assicurazione di partecipazione inclusa per tutti gli atleti.",
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
  console.log("✅ FAQ 4: Prizes");

  // ──────────────────────────────────────────────
  // Summary
  // ──────────────────────────────────────────────
  console.log(`
✅ Seed completed successfully!

📊 Summary:
- Event: HYGOES 2026
- Slug: hygoes-gois-2026
- Variants: 3 (Duplas Masculinas, Femininas, Mistas – Open)
- Languages: 6 (pt, en, es, fr, de, it)
- Pricing Phases: 3 (1 per variant – 70€/dupla)
- FAQs: 5 (with translations in all 6 languages)
- Date: September 12, 2026
- Location: Vila de Góis
- Coordinates: 40.1583, -8.1122
- Organization: Associação Raiz Gois (RAIZGOES)
- Sport: HYROX
- Registration Deadline: August 31, 2026
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
