/**
 * Seed Ragnar Trail Ohio Individual Races 2026
 * Complete with translations in all 6 languages
 * Location: Dillon State Park, Nashport, Ohio, USA
 */

import { PrismaClient, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Ragnar Trail Ohio Individual Races 2026...");

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: "ragnar-trail-ohio-2026" },
    update: {
      title: "Ragnar Trail Ohio Individual Races",
      description: `## 🏔️ Ragnar Trail Ohio Individual Races 2026

**Uma combinação perfeita de aventura e relaxamento em Dillon State Park!**

### 🌲 O Percurso

O percurso está situado numa **densa floresta** com a maioria dos trilhos totalmente sombreados. Os corredores podem esperar uma variedade de tipos de trilhos, desde trilhos de observação de aves planos e ladeados de relva até trilhos técnicos de BTT de pista única.

**Características do percurso:**
- 🌳 Floresta densa com árvores imponentes
- 🏖️ Praia de areia branca deslumbrante
- 💧 Vistas do Reservatório de Dillon
- ⛰️ Ganho de elevação navegando declives até ao reservatório

### 🏃 As Corridas

**Yellow Loop (Volta Única)** - 8.5km
- Percurso deslumbrante através da floresta densa
- Vistas do Lago Dillon através da copa das árvores
- Subidas emocionantes e descidas técnicas

**Ultra 6 Horas**
- Corre tantas voltas quanto conseguires em 6 horas
- Mesmos circuitos das equipas de estafetas
- Variedade de trilhos de planos a técnicos

**Ultra 24 Horas**
- Corre tantas voltas quanto conseguires em 24 horas
- Inclui campismo e atividades na aldeia
- Experiência completa de festival

### ⭐ O Festival

**Melhor Festival de Corrida de Ohio!**
- 🏕️ Campismo sob um dossel de estrelas
- 🌅 Corrida de trilho junto ao lago
- 🎉 Ambiente festivo na aldeia
- 🏖️ Acesso à praia de areia branca`,
      sportTypes: ["TRAIL"],
      startDate: new Date("2026-05-29T16:00:00Z"), // Friday 12:00 PM EDT
      endDate: new Date("2026-05-30T23:59:59Z"), // Saturday end of day
      city: "Nashport",
      country: "United States",
      latitude: 40.1547,
      longitude: -81.9847,
      googleMapsUrl: "https://maps.app.goo.gl/dillon-state-park",
      externalUrl: "https://runragnar.com/pages/ragnar-trail-individual-ohio",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-05-22T23:59:59Z"),
    },
    create: {
      title: "Ragnar Trail Ohio Individual Races",
      slug: "ragnar-trail-ohio-2026",
      description: `## 🏔️ Ragnar Trail Ohio Individual Races 2026

**Uma combinação perfeita de aventura e relaxamento em Dillon State Park!**

### 🌲 O Percurso

O percurso está situado numa **densa floresta** com a maioria dos trilhos totalmente sombreados. Os corredores podem esperar uma variedade de tipos de trilhos, desde trilhos de observação de aves planos e ladeados de relva até trilhos técnicos de BTT de pista única.

**Características do percurso:**
- 🌳 Floresta densa com árvores imponentes
- 🏖️ Praia de areia branca deslumbrante
- 💧 Vistas do Reservatório de Dillon
- ⛰️ Ganho de elevação navegando declives até ao reservatório

### 🏃 As Corridas

**Yellow Loop (Volta Única)** - 8.5km
- Percurso deslumbrante através da floresta densa
- Vistas do Lago Dillon através da copa das árvores
- Subidas emocionantes e descidas técnicas

**Ultra 6 Horas**
- Corre tantas voltas quanto conseguires em 6 horas
- Mesmos circuitos das equipas de estafetas
- Variedade de trilhos de planos a técnicos

**Ultra 24 Horas**
- Corre tantas voltas quanto conseguires em 24 horas
- Inclui campismo e atividades na aldeia
- Experiência completa de festival

### ⭐ O Festival

**Melhor Festival de Corrida de Ohio!**
- 🏕️ Campismo sob um dossel de estrelas
- 🌅 Corrida de trilho junto ao lago
- 🎉 Ambiente festivo na aldeia
- 🏖️ Acesso à praia de areia branca`,
      sportTypes: ["TRAIL"],
      startDate: new Date("2026-05-29T16:00:00Z"),
      endDate: new Date("2026-05-30T23:59:59Z"),
      city: "Nashport",
      country: "United States",
      latitude: 40.1547,
      longitude: -81.9847,
      googleMapsUrl: "https://maps.app.goo.gl/dillon-state-park",
      externalUrl: "https://runragnar.com/pages/ragnar-trail-individual-ohio",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-05-22T23:59:59Z"),
    },
  });

  console.log("✅ Event upserted with ID:", event.id);

  // Step 2: Upsert translations separately (ALL 6 LANGUAGES)
  console.log("📝 Upserting translations for 6 languages...");

  // Portuguese (European)
  await prisma.eventTranslation.upsert({
    where: {
      eventId_language: {
        eventId: event.id,
        language: Language.pt,
      },
    },
    update: {
      title: "Ragnar Trail Ohio Individual Races",
      description: `## 🏔️ Ragnar Trail Ohio Individual Races 2026

**Uma combinação perfeita de aventura e relaxamento em Dillon State Park!**

### 🌲 O Percurso

O percurso está situado numa **densa floresta** com a maioria dos trilhos totalmente sombreados. Os corredores podem esperar uma variedade de tipos de trilhos, desde trilhos de observação de aves planos e ladeados de relva até trilhos técnicos de BTT de pista única.

**Características do percurso:**
- 🌳 Floresta densa com árvores imponentes
- 🏖️ Praia de areia branca deslumbrante
- 💧 Vistas do Reservatório de Dillon
- ⛰️ Ganho de elevação navegando declives até ao reservatório

### 🏃 As Corridas

**Yellow Loop (Volta Única)** - 8.5km
- Percurso deslumbrante através da floresta densa
- Vistas do Lago Dillon através da copa das árvores
- Subidas emocionantes e descidas técnicas

**Ultra 6 Horas**
- Corre tantas voltas quanto conseguires em 6 horas
- Mesmos circuitos das equipas de estafetas
- Variedade de trilhos de planos a técnicos

**Ultra 24 Horas**
- Corre tantas voltas quanto conseguires em 24 horas
- Inclui campismo e atividades na aldeia
- Experiência completa de festival

### ⭐ O Festival

**Melhor Festival de Corrida de Ohio!**
- 🏕️ Campismo sob um dossel de estrelas
- 🌅 Corrida de trilho junto ao lago
- 🎉 Ambiente festivo na aldeia
- 🏖️ Acesso à praia de areia branca`,
      city: "Nashport",
      metaTitle: "Ragnar Trail Ohio 2026 - Festival de Trail Running | 29-30 Maio",
      metaDescription: "Festival de trail running no Dillon State Park, Ohio. Corridas individuais: Yellow Loop 8.5km, Ultra 6H e Ultra 24H. Floresta densa, praia e campismo. 29-30 maio 2026.",
    },
    create: {
      eventId: event.id,
      language: Language.pt,
      title: "Ragnar Trail Ohio Individual Races",
      description: `## 🏔️ Ragnar Trail Ohio Individual Races 2026

**Uma combinação perfeita de aventura e relaxamento em Dillon State Park!**

### 🌲 O Percurso

O percurso está situado numa **densa floresta** com a maioria dos trilhos totalmente sombreados. Os corredores podem esperar uma variedade de tipos de trilhos, desde trilhos de observação de aves planos e ladeados de relva até trilhos técnicos de BTT de pista única.

**Características do percurso:**
- 🌳 Floresta densa com árvores imponentes
- 🏖️ Praia de areia branca deslumbrante
- 💧 Vistas do Reservatório de Dillon
- ⛰️ Ganho de elevação navegando declives até ao reservatório

### 🏃 As Corridas

**Yellow Loop (Volta Única)** - 8.5km
- Percurso deslumbrante através da floresta densa
- Vistas do Lago Dillon através da copa das árvores
- Subidas emocionantes e descidas técnicas

**Ultra 6 Horas**
- Corre tantas voltas quanto conseguires em 6 horas
- Mesmos circuitos das equipas de estafetas
- Variedade de trilhos de planos a técnicos

**Ultra 24 Horas**
- Corre tantas voltas quanto conseguires em 24 horas
- Inclui campismo e atividades na aldeia
- Experiência completa de festival

### ⭐ O Festival

**Melhor Festival de Corrida de Ohio!**
- 🏕️ Campismo sob um dossel de estrelas
- 🌅 Corrida de trilho junto ao lago
- 🎉 Ambiente festivo na aldeia
- 🏖️ Acesso à praia de areia branca`,
      city: "Nashport",
      metaTitle: "Ragnar Trail Ohio 2026 - Festival de Trail Running | 29-30 Maio",
      metaDescription: "Festival de trail running no Dillon State Park, Ohio. Corridas individuais: Yellow Loop 8.5km, Ultra 6H e Ultra 24H. Floresta densa, praia e campismo. 29-30 maio 2026.",
    },
  });

  // English
  await prisma.eventTranslation.upsert({
    where: {
      eventId_language: {
        eventId: event.id,
        language: Language.en,
      },
    },
    update: {
      title: "Ragnar Trail Ohio Individual Races",
      description: `## 🏔️ Ragnar Trail Ohio Individual Races 2026

**A perfect blend of adventure and relaxation at Dillon State Park!**

### 🌲 The Course

The course is situated in a **dense forest** with the majority of trails fully shaded. Runners can expect a variety of trail types from flat, grass-lined birding trails to technical, single-track mountain bike trails.

**Course features:**
- 🌳 Dense forest with towering trees
- 🏖️ Stunning white sand beach
- 💧 Views of Dillon Reservoir
- ⛰️ Elevation gain navigating slopes into the reservoir

### 🏃 The Races

**Yellow Loop (Single Loop)** - 5.3 miles (8.5km)
- Stunning course through dense forest
- Glimpses of Dillon Lake through the canopy
- Thrilling climbs and technical descents

**6-Hour Ultra**
- Run as many loops as you can in 6 hours
- Same loops as relay teams
- Variety of trails from flat to technical

**24-Hour Ultra**
- Run as many loops as you can in 24 hours
- Includes camping and village activities
- Complete festival experience

### ⭐ The Festival

**Ohio's Best Running Festival!**
- 🏕️ Camping under a canopy of stars
- 🌅 Lakeside trail running
- 🎉 Festive village atmosphere
- 🏖️ White sand beach access`,
      city: "Nashport",
      metaTitle: "Ragnar Trail Ohio 2026 - Trail Running Festival | May 29-30",
      metaDescription: "Trail running festival at Dillon State Park, Ohio. Individual races: Yellow Loop 5.3mi, 6H Ultra, and 24H Ultra. Dense forest, beach, and camping. May 29-30, 2026.",
    },
    create: {
      eventId: event.id,
      language: Language.en,
      title: "Ragnar Trail Ohio Individual Races",
      description: `## 🏔️ Ragnar Trail Ohio Individual Races 2026

**A perfect blend of adventure and relaxation at Dillon State Park!**

### 🌲 The Course

The course is situated in a **dense forest** with the majority of trails fully shaded. Runners can expect a variety of trail types from flat, grass-lined birding trails to technical, single-track mountain bike trails.

**Course features:**
- 🌳 Dense forest with towering trees
- 🏖️ Stunning white sand beach
- 💧 Views of Dillon Reservoir
- ⛰️ Elevation gain navigating slopes into the reservoir

### 🏃 The Races

**Yellow Loop (Single Loop)** - 5.3 miles (8.5km)
- Stunning course through dense forest
- Glimpses of Dillon Lake through the canopy
- Thrilling climbs and technical descents

**6-Hour Ultra**
- Run as many loops as you can in 6 hours
- Same loops as relay teams
- Variety of trails from flat to technical

**24-Hour Ultra**
- Run as many loops as you can in 24 hours
- Includes camping and village activities
- Complete festival experience

### ⭐ The Festival

**Ohio's Best Running Festival!**
- 🏕️ Camping under a canopy of stars
- 🌅 Lakeside trail running
- 🎉 Festive village atmosphere
- 🏖️ White sand beach access`,
      city: "Nashport",
      metaTitle: "Ragnar Trail Ohio 2026 - Trail Running Festival | May 29-30",
      metaDescription: "Trail running festival at Dillon State Park, Ohio. Individual races: Yellow Loop 5.3mi, 6H Ultra, and 24H Ultra. Dense forest, beach, and camping. May 29-30, 2026.",
    },
  });

  // Spanish
  await prisma.eventTranslation.upsert({
    where: {
      eventId_language: {
        eventId: event.id,
        language: Language.es,
      },
    },
    update: {
      title: "Ragnar Trail Ohio Individual Races",
      description: `## 🏔️ Ragnar Trail Ohio Individual Races 2026

**¡Una combinación perfecta de aventura y relajación en Dillon State Park!**

### 🌲 El Recorrido

El recorrido está situado en un **denso bosque** con la mayoría de los senderos completamente sombreados. Los corredores pueden esperar una variedad de tipos de senderos, desde senderos planos bordeados de hierba para observación de aves hasta senderos técnicos de bicicleta de montaña de pista única.

**Características del recorrido:**
- 🌳 Bosque denso con árboles imponentes
- 🏖️ Impresionante playa de arena blanca
- 💧 Vistas del embalse de Dillon
- ⛰️ Ganancia de elevación navegando pendientes hacia el embalse

### 🏃 Las Carreras

**Yellow Loop (Bucle Único)** - 8.5km
- Recorrido impresionante a través del bosque denso
- Vistas del lago Dillon a través del dosel
- Subidas emocionantes y descensos técnicos

**Ultra 6 Horas**
- Corre tantas vueltas como puedas en 6 horas
- Mismos circuitos que los equipos de relevos
- Variedad de senderos de planos a técnicos

**Ultra 24 Horas**
- Corre tantas vueltas como puedas en 24 horas
- Incluye camping y actividades en el pueblo
- Experiencia completa de festival

### ⭐ El Festival

**¡El Mejor Festival de Running de Ohio!**
- 🏕️ Camping bajo un dosel de estrellas
- 🌅 Trail running junto al lago
- 🎉 Ambiente festivo en el pueblo
- 🏖️ Acceso a playa de arena blanca`,
      city: "Nashport",
      metaTitle: "Ragnar Trail Ohio 2026 - Festival de Trail Running | 29-30 Mayo",
      metaDescription: "Festival de trail running en Dillon State Park, Ohio. Carreras individuales: Yellow Loop 8.5km, Ultra 6H y Ultra 24H. Bosque denso, playa y camping. 29-30 mayo 2026.",
    },
    create: {
      eventId: event.id,
      language: Language.es,
      title: "Ragnar Trail Ohio Individual Races",
      description: `## 🏔️ Ragnar Trail Ohio Individual Races 2026

**¡Una combinación perfecta de aventura y relajación en Dillon State Park!**

### 🌲 El Recorrido

El recorrido está situado en un **denso bosque** con la mayoría de los senderos completamente sombreados. Los corredores pueden esperar una variedad de tipos de senderos, desde senderos planos bordeados de hierba para observación de aves hasta senderos técnicos de bicicleta de montaña de pista única.

**Características del recorrido:**
- 🌳 Bosque denso con árboles imponentes
- 🏖️ Impresionante playa de arena blanca
- 💧 Vistas del embalse de Dillon
- ⛰️ Ganancia de elevación navegando pendientes hacia el embalse

### 🏃 Las Carreras

**Yellow Loop (Bucle Único)** - 8.5km
- Recorrido impresionante a través del bosque denso
- Vistas del lago Dillon a través del dosel
- Subidas emocionantes y descensos técnicos

**Ultra 6 Horas**
- Corre tantas vueltas como puedas en 6 horas
- Mismos circuitos que los equipos de relevos
- Variedad de senderos de planos a técnicos

**Ultra 24 Horas**
- Corre tantas vueltas como puedas en 24 horas
- Incluye camping y actividades en el pueblo
- Experiencia completa de festival

### ⭐ El Festival

**¡El Mejor Festival de Running de Ohio!**
- 🏕️ Camping bajo un dosel de estrellas
- 🌅 Trail running junto al lago
- 🎉 Ambiente festivo en el pueblo
- 🏖️ Acceso a playa de arena blanca`,
      city: "Nashport",
      metaTitle: "Ragnar Trail Ohio 2026 - Festival de Trail Running | 29-30 Mayo",
      metaDescription: "Festival de trail running en Dillon State Park, Ohio. Carreras individuales: Yellow Loop 8.5km, Ultra 6H y Ultra 24H. Bosque denso, playa y camping. 29-30 mayo 2026.",
    },
  });

  // French
  await prisma.eventTranslation.upsert({
    where: {
      eventId_language: {
        eventId: event.id,
        language: Language.fr,
      },
    },
    update: {
      title: "Ragnar Trail Ohio Individual Races",
      description: `## 🏔️ Ragnar Trail Ohio Individual Races 2026

**Un mélange parfait d'aventure et de détente à Dillon State Park !**

### 🌲 Le Parcours

Le parcours est situé dans une **forêt dense** avec la majorité des sentiers entièrement ombragés. Les coureurs peuvent s'attendre à une variété de types de sentiers, des sentiers plats bordés d'herbe pour l'observation des oiseaux aux sentiers techniques de VTT à piste unique.

**Caractéristiques du parcours :**
- 🌳 Forêt dense avec des arbres imposants
- 🏖️ Magnifique plage de sable blanc
- 💧 Vues sur le réservoir de Dillon
- ⛰️ Gain d'altitude en naviguant sur les pentes vers le réservoir

### 🏃 Les Courses

**Yellow Loop (Boucle Unique)** - 8.5km
- Parcours magnifique à travers la forêt dense
- Aperçus du lac Dillon à travers la canopée
- Montées palpitantes et descentes techniques

**Ultra 6 Heures**
- Courez autant de boucles que possible en 6 heures
- Mêmes boucles que les équipes de relais
- Variété de sentiers de plats à techniques

**Ultra 24 Heures**
- Courez autant de boucles que possible en 24 heures
- Comprend camping et activités au village
- Expérience complète de festival

### ⭐ Le Festival

**Meilleur Festival de Course de l'Ohio !**
- 🏕️ Camping sous une canopée d'étoiles
- 🌅 Trail running au bord du lac
- 🎉 Ambiance festive au village
- 🏖️ Accès à la plage de sable blanc`,
      city: "Nashport",
      metaTitle: "Ragnar Trail Ohio 2026 - Festival de Trail Running | 29-30 Mai",
      metaDescription: "Festival de trail running à Dillon State Park, Ohio. Courses individuelles : Yellow Loop 8.5km, Ultra 6H et Ultra 24H. Forêt dense, plage et camping. 29-30 mai 2026.",
    },
    create: {
      eventId: event.id,
      language: Language.fr,
      title: "Ragnar Trail Ohio Individual Races",
      description: `## 🏔️ Ragnar Trail Ohio Individual Races 2026

**Un mélange parfait d'aventure et de détente à Dillon State Park !**

### 🌲 Le Parcours

Le parcours est situé dans une **forêt dense** avec la majorité des sentiers entièrement ombragés. Les coureurs peuvent s'attendre à une variété de types de sentiers, des sentiers plats bordés d'herbe pour l'observation des oiseaux aux sentiers techniques de VTT à piste unique.

**Caractéristiques du parcours :**
- 🌳 Forêt dense avec des arbres imposants
- 🏖️ Magnifique plage de sable blanc
- 💧 Vues sur le réservoir de Dillon
- ⛰️ Gain d'altitude en naviguant sur les pentes vers le réservoir

### 🏃 Les Courses

**Yellow Loop (Boucle Unique)** - 8.5km
- Parcours magnifique à travers la forêt dense
- Aperçus du lac Dillon à travers la canopée
- Montées palpitantes et descentes techniques

**Ultra 6 Heures**
- Courez autant de boucles que possible en 6 heures
- Mêmes boucles que les équipes de relais
- Variété de sentiers de plats à techniques

**Ultra 24 Heures**
- Courez autant de boucles que possible en 24 heures
- Comprend camping et activités au village
- Expérience complète de festival

### ⭐ Le Festival

**Meilleur Festival de Course de l'Ohio !**
- 🏕️ Camping sous une canopée d'étoiles
- 🌅 Trail running au bord du lac
- 🎉 Ambiance festive au village
- 🏖️ Accès à la plage de sable blanc`,
      city: "Nashport",
      metaTitle: "Ragnar Trail Ohio 2026 - Festival de Trail Running | 29-30 Mai",
      metaDescription: "Festival de trail running à Dillon State Park, Ohio. Courses individuelles : Yellow Loop 8.5km, Ultra 6H et Ultra 24H. Forêt dense, plage et camping. 29-30 mai 2026.",
    },
  });

  // German
  await prisma.eventTranslation.upsert({
    where: {
      eventId_language: {
        eventId: event.id,
        language: Language.de,
      },
    },
    update: {
      title: "Ragnar Trail Ohio Individual Races",
      description: `## 🏔️ Ragnar Trail Ohio Individual Races 2026

**Eine perfekte Mischung aus Abenteuer und Entspannung im Dillon State Park!**

### 🌲 Die Strecke

Die Strecke befindet sich in einem **dichten Wald** mit der Mehrheit der Wege vollständig beschattet. Läufer können eine Vielzahl von Wegtypen erwarten, von flachen, grasbewachsenen Vogelbeobachtungswegen bis zu technischen Einzelspur-Mountainbike-Wegen.

**Streckeneigenschaften:**
- 🌳 Dichter Wald mit hoch aufragenden Bäumen
- 🏖️ Atemberaubender weißer Sandstrand
- 💧 Ausblicke auf das Dillon-Reservoir
- ⛰️ Höhengewinn beim Navigieren von Hängen zum Reservoir

### 🏃 Die Rennen

**Yellow Loop (Einzelschleife)** - 8.5km
- Atemberaubende Strecke durch dichten Wald
- Blicke auf den Dillon-See durch das Blätterdach
- Aufregende Anstiege und technische Abstiege

**6-Stunden-Ultra**
- Laufen Sie so viele Schleifen wie möglich in 6 Stunden
- Gleiche Schleifen wie Staffelteams
- Vielfalt von flachen bis technischen Wegen

**24-Stunden-Ultra**
- Laufen Sie so viele Schleifen wie möglich in 24 Stunden
- Inklusive Camping und Dorfaktivitäten
- Komplettes Festival-Erlebnis

### ⭐ Das Festival

**Ohios bestes Lauf-Festival!**
- 🏕️ Camping unter einem Sternendach
- 🌅 Trailrunning am Seeufer
- 🎉 Festliche Dorfatmosphäre
- 🏖️ Zugang zum weißen Sandstrand`,
      city: "Nashport",
      metaTitle: "Ragnar Trail Ohio 2026 - Trail Running Festival | 29.-30. Mai",
      metaDescription: "Trail Running Festival im Dillon State Park, Ohio. Einzelrennen: Yellow Loop 8.5km, 6H Ultra und 24H Ultra. Dichter Wald, Strand und Camping. 29.-30. Mai 2026.",
    },
    create: {
      eventId: event.id,
      language: Language.de,
      title: "Ragnar Trail Ohio Individual Races",
      description: `## 🏔️ Ragnar Trail Ohio Individual Races 2026

**Eine perfekte Mischung aus Abenteuer und Entspannung im Dillon State Park!**

### 🌲 Die Strecke

Die Strecke befindet sich in einem **dichten Wald** mit der Mehrheit der Wege vollständig beschattet. Läufer können eine Vielzahl von Wegtypen erwarten, von flachen, grasbewachsenen Vogelbeobachtungswegen bis zu technischen Einzelspur-Mountainbike-Wegen.

**Streckeneigenschaften:**
- 🌳 Dichter Wald mit hoch aufragenden Bäumen
- 🏖️ Atemberaubender weißer Sandstrand
- 💧 Ausblicke auf das Dillon-Reservoir
- ⛰️ Höhengewinn beim Navigieren von Hängen zum Reservoir

### 🏃 Die Rennen

**Yellow Loop (Einzelschleife)** - 8.5km
- Atemberaubende Strecke durch dichten Wald
- Blicke auf den Dillon-See durch das Blätterdach
- Aufregende Anstiege und technische Abstiege

**6-Stunden-Ultra**
- Laufen Sie so viele Schleifen wie möglich in 6 Stunden
- Gleiche Schleifen wie Staffelteams
- Vielfalt von flachen bis technischen Wegen

**24-Stunden-Ultra**
- Laufen Sie so viele Schleifen wie möglich in 24 Stunden
- Inklusive Camping und Dorfaktivitäten
- Komplettes Festival-Erlebnis

### ⭐ Das Festival

**Ohios bestes Lauf-Festival!**
- 🏕️ Camping unter einem Sternendach
- 🌅 Trailrunning am Seeufer
- 🎉 Festliche Dorfatmosphäre
- 🏖️ Zugang zum weißen Sandstrand`,
      city: "Nashport",
      metaTitle: "Ragnar Trail Ohio 2026 - Trail Running Festival | 29.-30. Mai",
      metaDescription: "Trail Running Festival im Dillon State Park, Ohio. Einzelrennen: Yellow Loop 8.5km, 6H Ultra und 24H Ultra. Dichter Wald, Strand und Camping. 29.-30. Mai 2026.",
    },
  });

  // Italian
  await prisma.eventTranslation.upsert({
    where: {
      eventId_language: {
        eventId: event.id,
        language: Language.it,
      },
    },
    update: {
      title: "Ragnar Trail Ohio Individual Races",
      description: `## 🏔️ Ragnar Trail Ohio Individual Races 2026

**Una perfetta combinazione di avventura e relax al Dillon State Park!**

### 🌲 Il Percorso

Il percorso è situato in una **foresta fitta** con la maggior parte dei sentieri completamente ombreggiati. I corridori possono aspettarsi una varietà di tipi di sentieri, da sentieri pianeggianti bordati d'erba per l'osservazione degli uccelli a sentieri tecnici per mountain bike a traccia singola.

**Caratteristiche del percorso:**
- 🌳 Foresta fitta con alberi imponenti
- 🏖️ Splendida spiaggia di sabbia bianca
- 💧 Viste sul bacino di Dillon
- ⛰️ Guadagno di elevazione navigando i pendii verso il bacino

### 🏃 Le Gare

**Yellow Loop (Anello Singolo)** - 8.5km
- Percorso splendido attraverso la foresta fitta
- Scorci del lago Dillon attraverso la chioma
- Salite emozionanti e discese tecniche

**Ultra 6 Ore**
- Corri quanti più anelli possibile in 6 ore
- Stessi anelli delle squadre a staffetta
- Varietà di sentieri da pianeggianti a tecnici

**Ultra 24 Ore**
- Corri quanti più anelli possibile in 24 ore
- Include campeggio e attività al villaggio
- Esperienza completa del festival

### ⭐ Il Festival

**Il Miglior Festival di Corsa dell'Ohio!**
- 🏕️ Campeggio sotto una volta di stelle
- 🌅 Trail running in riva al lago
- 🎉 Atmosfera festosa al villaggio
- 🏖️ Accesso alla spiaggia di sabbia bianca`,
      city: "Nashport",
      metaTitle: "Ragnar Trail Ohio 2026 - Festival di Trail Running | 29-30 Maggio",
      metaDescription: "Festival di trail running al Dillon State Park, Ohio. Gare individuali: Yellow Loop 8.5km, Ultra 6H e Ultra 24H. Foresta fitta, spiaggia e campeggio. 29-30 maggio 2026.",
    },
    create: {
      eventId: event.id,
      language: Language.it,
      title: "Ragnar Trail Ohio Individual Races",
      description: `## 🏔️ Ragnar Trail Ohio Individual Races 2026

**Una perfetta combinazione di avventura e relax al Dillon State Park!**

### 🌲 Il Percorso

Il percorso è situato in una **foresta fitta** con la maggior parte dei sentieri completamente ombreggiati. I corridori possono aspettarsi una varietà di tipi di sentieri, da sentieri pianeggianti bordati d'erba per l'osservazione degli uccelli a sentieri tecnici per mountain bike a traccia singola.

**Caratteristiche del percorso:**
- 🌳 Foresta fitta con alberi imponenti
- 🏖️ Splendida spiaggia di sabbia bianca
- 💧 Viste sul bacino di Dillon
- ⛰️ Guadagno di elevazione navigando i pendii verso il bacino

### 🏃 Le Gare

**Yellow Loop (Anello Singolo)** - 8.5km
- Percorso splendido attraverso la foresta fitta
- Scorci del lago Dillon attraverso la chioma
- Salite emozionanti e discese tecniche

**Ultra 6 Ore**
- Corri quanti più anelli possibile in 6 ore
- Stessi anelli delle squadre a staffetta
- Varietà di sentieri da pianeggianti a tecnici

**Ultra 24 Ore**
- Corri quanti più anelli possibile in 24 ore
- Include campeggio e attività al villaggio
- Esperienza completa del festival

### ⭐ Il Festival

**Il Miglior Festival di Corsa dell'Ohio!**
- 🏕️ Campeggio sotto una volta di stelle
- 🌅 Trail running in riva al lago
- 🎉 Atmosfera festosa al villaggio
- 🏖️ Accesso alla spiaggia di sabbia bianca`,
      city: "Nashport",
      metaTitle: "Ragnar Trail Ohio 2026 - Festival di Trail Running | 29-30 Maggio",
      metaDescription: "Festival di trail running al Dillon State Park, Ohio. Gare individuali: Yellow Loop 8.5km, Ultra 6H e Ultra 24H. Foresta fitta, spiaggia e campeggio. 29-30 maggio 2026.",
    },
  });

  console.log("✅ Translations upserted for 6 languages");

  // Step 3: Upsert variants separately
  console.log("🏃 Upserting variants...");

  // Variant 1: Single Loop - Yellow Course
  const variant1 = await prisma.eventVariant.upsert({
    where: {
      eventId_slug: {
        eventId: event.id,
        slug: "single-loop-yellow",
      },
    },
    update: {
      name: "Single Loop - Yellow Course",
      description: "Situated in a beautiful dense forest, run the stunning Yellow Loop. Wind through dense forest with towering trees as the trail climbs and dips. Catch glimpses of Dillon Lake and Licking River through the canopy. After thrilling climbs, emerge from trees and arrive back at the village.",
      distanceKm: 8.5,
      elevationGainM: 264,
      elevationLossM: 264,
      startDate: new Date("2026-05-30T12:00:00Z"), // 8:00 AM EDT
      startTime: "08:00",
      maxParticipants: 500,
      cutoffTimeHours: 3,
      itraPoints: null,
      atrpGrade: null,
      mountainLevel: null,
    },
    create: {
      eventId: event.id,
      slug: "single-loop-yellow",
      name: "Single Loop - Yellow Course",
      description: "Situated in a beautiful dense forest, run the stunning Yellow Loop. Wind through dense forest with towering trees as the trail climbs and dips. Catch glimpses of Dillon Lake and Licking River through the canopy. After thrilling climbs, emerge from trees and arrive back at the village.",
      distanceKm: 8.5,
      elevationGainM: 264,
      elevationLossM: 264,
      startDate: new Date("2026-05-30T12:00:00Z"),
      startTime: "08:00",
      maxParticipants: 500,
      cutoffTimeHours: 3,
      itraPoints: null,
      atrpGrade: null,
      mountainLevel: null,
    },
  });

  // Variant 2: 6-Hour Ultra
  const variant2 = await prisma.eventVariant.upsert({
    where: {
      eventId_slug: {
        eventId: event.id,
        slug: "6h-ultra",
      },
    },
    update: {
      name: "6-Hour Ultra",
      description: "Run all the same loops as relay teams, as many times as you can in 6 hours! Majority of trails fully shaded in dense forest. Variety of trail types from flat grass-lined birding trails to technical single-track mountain bike trails. Routes include significant elevation gain navigating slopes into Dillon Reservoir.",
      distanceKm: 24.6,
      elevationGainM: 682,
      elevationLossM: 682,
      startDate: new Date("2026-05-30T12:00:00Z"), // 8:00 AM EDT
      startTime: "08:00",
      maxParticipants: 300,
      cutoffTimeHours: 6,
      itraPoints: null,
      atrpGrade: null,
      mountainLevel: null,
    },
    create: {
      eventId: event.id,
      slug: "6h-ultra",
      name: "6-Hour Ultra",
      description: "Run all the same loops as relay teams, as many times as you can in 6 hours! Majority of trails fully shaded in dense forest. Variety of trail types from flat grass-lined birding trails to technical single-track mountain bike trails. Routes include significant elevation gain navigating slopes into Dillon Reservoir.",
      distanceKm: 24.6,
      elevationGainM: 682,
      elevationLossM: 682,
      startDate: new Date("2026-05-30T12:00:00Z"),
      startTime: "08:00",
      maxParticipants: 300,
      cutoffTimeHours: 6,
      itraPoints: null,
      atrpGrade: null,
      mountainLevel: null,
    },
  });

  // Variant 3: 24-Hour Ultra
  const variant3 = await prisma.eventVariant.upsert({
    where: {
      eventId_slug: {
        eventId: event.id,
        slug: "24h-ultra",
      },
    },
    update: {
      name: "24-Hour Ultra",
      description: "Run all the same loops as relay teams, as many times as you can in 24 hours! Majority of trails fully shaded in dense forest. Variety of trail types from flat grass-lined birding trails to technical single-track mountain bike trails. Routes include significant elevation gain navigating slopes into Dillon Reservoir. Includes camping and village activities.",
      distanceKm: 24.6,
      elevationGainM: 682,
      elevationLossM: 682,
      startDate: new Date("2026-05-29T16:00:00Z"), // Friday 12:00 PM EDT
      startTime: "12:00",
      maxParticipants: 200,
      cutoffTimeHours: 24,
      itraPoints: null,
      atrpGrade: null,
      mountainLevel: null,
    },
    create: {
      eventId: event.id,
      slug: "24h-ultra",
      name: "24-Hour Ultra",
      description: "Run all the same loops as relay teams, as many times as you can in 24 hours! Majority of trails fully shaded in dense forest. Variety of trail types from flat grass-lined birding trails to technical single-track mountain bike trails. Routes include significant elevation gain navigating slopes into Dillon Reservoir. Includes camping and village activities.",
      distanceKm: 24.6,
      elevationGainM: 682,
      elevationLossM: 682,
      startDate: new Date("2026-05-29T16:00:00Z"),
      startTime: "12:00",
      maxParticipants: 200,
      cutoffTimeHours: 24,
      itraPoints: null,
      atrpGrade: null,
      mountainLevel: null,
    },
  });

  console.log("✅ Variants upserted");

  // Step 4: Upsert variant translations separately (ALL 6 languages for each variant)
  console.log("📝 Upserting variant translations...");

  // Variant 1 translations
  const variant1Translations = [
    {
      lang: Language.pt,
      name: "Volta Única - Yellow Course",
      description:
        "Situado numa bela floresta densa, corre a deslumbrante Yellow Loop. Serpenteia através da floresta densa com árvores imponentes enquanto o trilho sobe e desce. Apanha vislumbres do Lago Dillon e do Rio Licking através da copa. Após subidas emocionantes, emerge das árvores e chega de volta à aldeia.",
    },
    {
      lang: Language.en,
      name: "Single Loop - Yellow Course",
      description:
        "Situated in a beautiful dense forest, run the stunning Yellow Loop. Wind through dense forest with towering trees as the trail climbs and dips. Catch glimpses of Dillon Lake and Licking River through the canopy. After thrilling climbs, emerge from trees and arrive back at the village.",
    },
    {
      lang: Language.es,
      name: "Bucle Único - Yellow Course",
      description:
        "Situado en un hermoso bosque denso, corre el impresionante Yellow Loop. Serpentea a través del bosque denso con árboles imponentes mientras el sendero sube y baja. Captura vistas del lago Dillon y del río Licking a través del dosel. Después de emocionantes subidas, emerge de los árboles y regresa al pueblo.",
    },
    {
      lang: Language.fr,
      name: "Boucle Unique - Yellow Course",
      description:
        "Situé dans une belle forêt dense, courez la magnifique Yellow Loop. Serpentez à travers la forêt dense avec des arbres imposants pendant que le sentier monte et descend. Apercevez le lac Dillon et la rivière Licking à travers la canopée. Après des montées palpitantes, émergez des arbres et revenez au village.",
    },
    {
      lang: Language.de,
      name: "Einzelschleife - Yellow Course",
      description:
        "In einem schönen dichten Wald gelegen, laufen Sie die atemberaubende Yellow Loop. Schlängeln Sie sich durch dichten Wald mit hoch aufragenden Bäumen, während der Weg auf und ab geht. Erhaschen Sie Blicke auf den Dillon-See und den Licking River durch das Blätterdach. Nach aufregenden Anstiegen tauchen Sie aus den Bäumen auf und kehren zum Dorf zurück.",
    },
    {
      lang: Language.it,
      name: "Anello Singolo - Yellow Course",
      description:
        "Situato in una bella foresta fitta, corri lo splendido Yellow Loop. Serpeggia attraverso la foresta fitta con alberi imponenti mentre il sentiero sale e scende. Scorgi il lago Dillon e il fiume Licking attraverso la chioma. Dopo salite emozionanti, emergi dagli alberi e torna al villaggio.",
    },
  ];

  for (const trans of variant1Translations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: variant1.id,
          language: trans.lang,
        },
      },
      update: {
        name: trans.name,
        description: trans.description,
      },
      create: {
        variantId: variant1.id,
        language: trans.lang,
        name: trans.name,
        description: trans.description,
      },
    });
  }

  // Variant 2 translations
  const variant2Translations = [
    {
      lang: Language.pt,
      name: "Ultra 6 Horas",
      description:
        "Corre todos os mesmos circuitos das equipas de estafetas, tantas vezes quanto conseguires em 6 horas! Maioria dos trilhos totalmente sombreados em floresta densa. Variedade de tipos de trilhos desde trilhos de observação de aves planos ladeados de relva até trilhos técnicos de BTT de pista única. Percursos incluem ganho de elevação significativo navegando declives até ao Reservatório de Dillon.",
    },
    {
      lang: Language.en,
      name: "6-Hour Ultra",
      description:
        "Run all the same loops as relay teams, as many times as you can in 6 hours! Majority of trails fully shaded in dense forest. Variety of trail types from flat grass-lined birding trails to technical single-track mountain bike trails. Routes include significant elevation gain navigating slopes into Dillon Reservoir.",
    },
    {
      lang: Language.es,
      name: "Ultra 6 Horas",
      description:
        "¡Corre todos los mismos circuitos que los equipos de relevos, tantas veces como puedas en 6 horas! La mayoría de los senderos están completamente sombreados en bosque denso. Variedad de tipos de senderos desde senderos planos bordeados de hierba para observación de aves hasta senderos técnicos de bicicleta de montaña de pista única. Las rutas incluyen ganancia de elevación significativa navegando pendientes hacia el embalse de Dillon.",
    },
    {
      lang: Language.fr,
      name: "Ultra 6 Heures",
      description:
        "Courez toutes les mêmes boucles que les équipes de relais, autant de fois que possible en 6 heures ! La majorité des sentiers sont entièrement ombragés dans une forêt dense. Variété de types de sentiers, des sentiers plats bordés d'herbe pour l'observation des oiseaux aux sentiers techniques de VTT à piste unique. Les parcours incluent un gain d'altitude significatif en naviguant sur les pentes vers le réservoir de Dillon.",
    },
    {
      lang: Language.de,
      name: "6-Stunden-Ultra",
      description:
        "Laufen Sie alle gleichen Schleifen wie Staffelteams, so oft Sie können in 6 Stunden! Die Mehrheit der Wege ist vollständig beschattet im dichten Wald. Vielfalt von Wegtypen von flachen, grasbewachsenen Vogelbeobachtungswegen bis zu technischen Einzelspur-Mountainbike-Wegen. Die Routen beinhalten bedeutenden Höhengewinn beim Navigieren von Hängen zum Dillon-Reservoir.",
    },
    {
      lang: Language.it,
      name: "Ultra 6 Ore",
      description:
        "Corri tutti gli stessi anelli delle squadre a staffetta, quante più volte possibile in 6 ore! La maggior parte dei sentieri è completamente ombreggiata nella foresta fitta. Varietà di tipi di sentieri dai sentieri pianeggianti bordati d'erba per l'osservazione degli uccelli ai sentieri tecnici per mountain bike a traccia singola. I percorsi includono un significativo guadagno di elevazione navigando i pendii verso il bacino di Dillon.",
    },
  ];

  for (const trans of variant2Translations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: variant2.id,
          language: trans.lang,
        },
      },
      update: {
        name: trans.name,
        description: trans.description,
      },
      create: {
        variantId: variant2.id,
        language: trans.lang,
        name: trans.name,
        description: trans.description,
      },
    });
  }

  // Variant 3 translations
  const variant3Translations = [
    {
      lang: Language.pt,
      name: "Ultra 24 Horas",
      description:
        "Corre todos os mesmos circuitos das equipas de estafetas, tantas vezes quanto conseguires em 24 horas! Maioria dos trilhos totalmente sombreados em floresta densa. Variedade de tipos de trilhos desde trilhos de observação de aves planos ladeados de relva até trilhos técnicos de BTT de pista única. Percursos incluem ganho de elevação significativo navegando declives até ao Reservatório de Dillon. Inclui campismo e atividades na aldeia.",
    },
    {
      lang: Language.en,
      name: "24-Hour Ultra",
      description:
        "Run all the same loops as relay teams, as many times as you can in 24 hours! Majority of trails fully shaded in dense forest. Variety of trail types from flat grass-lined birding trails to technical single-track mountain bike trails. Routes include significant elevation gain navigating slopes into Dillon Reservoir. Includes camping and village activities.",
    },
    {
      lang: Language.es,
      name: "Ultra 24 Horas",
      description:
        "¡Corre todos los mismos circuitos que los equipos de relevos, tantas veces como puedas en 24 horas! La mayoría de los senderos están completamente sombreados en bosque denso. Variedad de tipos de senderos desde senderos planos bordeados de hierba para observación de aves hasta senderos técnicos de bicicleta de montaña de pista única. Las rutas incluyen ganancia de elevación significativa navegando pendientes hacia el embalse de Dillon. Incluye camping y actividades en el pueblo.",
    },
    {
      lang: Language.fr,
      name: "Ultra 24 Heures",
      description:
        "Courez toutes les mêmes boucles que les équipes de relais, autant de fois que possible en 24 heures ! La majorité des sentiers sont entièrement ombragés dans une forêt dense. Variété de types de sentiers, des sentiers plats bordés d'herbe pour l'observation des oiseaux aux sentiers techniques de VTT à piste unique. Les parcours incluent un gain d'altitude significatif en naviguant sur les pentes vers le réservoir de Dillon. Comprend camping et activités au village.",
    },
    {
      lang: Language.de,
      name: "24-Stunden-Ultra",
      description:
        "Laufen Sie alle gleichen Schleifen wie Staffelteams, so oft Sie können in 24 Stunden! Die Mehrheit der Wege ist vollständig beschattet im dichten Wald. Vielfalt von Wegtypen von flachen, grasbewachsenen Vogelbeobachtungswegen bis zu technischen Einzelspur-Mountainbike-Wegen. Die Routen beinhalten bedeutenden Höhengewinn beim Navigieren von Hängen zum Dillon-Reservoir. Inklusive Camping und Dorfaktivitäten.",
    },
    {
      lang: Language.it,
      name: "Ultra 24 Ore",
      description:
        "Corri tutti gli stessi anelli delle squadre a staffetta, quante più volte possibile in 24 ore! La maggior parte dei sentieri è completamente ombreggiata nella foresta fitta. Varietà di tipi di sentieri dai sentieri pianeggianti bordati d'erba per l'osservazione degli uccelli ai sentieri tecnici per mountain bike a traccia singola. I percorsi includono un significativo guadagno di elevazione navigando i pendii verso il bacino di Dillon. Include campeggio e attività al villaggio.",
    },
  ];

  for (const trans of variant3Translations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: variant3.id,
          language: trans.lang,
        },
      },
      update: {
        name: trans.name,
        description: trans.description,
      },
      create: {
        variantId: variant3.id,
        language: trans.lang,
        name: trans.name,
        description: trans.description,
      },
    });
  }

  console.log("✅ Variant translations upserted");

  // Step 5: Upsert pricing phases separately (LINKED TO eventId, NOT variantId)
  console.log("💰 Upserting pricing phases...");

  // Helper function for idempotent pricing phase creation
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
          eventId: event.id, // ALWAYS use eventId, NEVER variantId
          name,
          ...data,
        },
      });
    }
  };

  // Pricing Phase 1: Single Loop - Regular Price
  await findOrCreatePricingPhase("Single Loop - Regular Price", {
    startDate: new Date("2026-01-15T00:00:00Z"),
    endDate: new Date("2026-05-22T23:59:59Z"),
    price: 40.0,
    currency: Currency.USD,
    discountPercent: null,
    note: "Includes finisher medal, finisher shirt, festival entry, and camping access. Saturday only.",
  });

  // Pricing Phase 2: 6H Ultra - Regular Price
  await findOrCreatePricingPhase("6H Ultra - Regular Price", {
    startDate: new Date("2026-01-15T00:00:00Z"),
    endDate: new Date("2026-05-22T23:59:59Z"),
    price: 175.0,
    currency: Currency.USD,
    discountPercent: null,
    note: "Includes finisher medal, finisher shirt, festival entry, camping access, and unlimited loops. Saturday only.",
  });

  // Pricing Phase 3: 24H Ultra - Regular Price
  await findOrCreatePricingPhase("24H Ultra - Regular Price", {
    startDate: new Date("2026-01-15T00:00:00Z"),
    endDate: new Date("2026-05-22T23:59:59Z"),
    price: 250.0,
    currency: Currency.USD,
    discountPercent: null,
    note: "Includes finisher medal, finisher shirt, festival entry, camping access, and unlimited loops. Friday-Saturday.",
  });

  console.log("✅ Pricing phases upserted (linked to eventId)");

  console.log("\n🎉 Ragnar Trail Ohio Individual Races 2026 seeded successfully!");
  console.log("📍 Event ID:", event.id);
  console.log("📝 6 language translations created");
  console.log("🏃 3 variants created with translations");
  console.log("💰 3 pricing phases created");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
