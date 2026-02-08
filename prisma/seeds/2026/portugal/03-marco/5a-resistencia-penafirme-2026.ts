import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding 5ª Resistência BTT Penafirme 2026...");

  // 1. Upsert event (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: "5a-resistencia-penafirme-2026" },
    update: {
      title: "5ª Resistência BTT Penafirme 2026",
      description: "Prova de resistência BTT em circuito - 2h e 3h",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-22T09:00:00.000Z"),
      endDate: new Date("2026-03-22T14:00:00.000Z"),
      city: "Póvoa de Penafirme",
      country: "Portugal",
      latitude: 39.1234,
      longitude: -9.2156,
      googleMapsUrl:
        "https://maps.google.com/?q=Carmo+Silvério+Póvoa+de+Penafirme",
      externalUrl: "",
      imageUrl: "",
      isFeatured: false,
    },
    create: {
      slug: "5a-resistencia-penafirme-2026",
      title: "5ª Resistência BTT Penafirme 2026",
      description: "Prova de resistência BTT em circuito - 2h e 3h",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-22T09:00:00.000Z"),
      endDate: new Date("2026-03-22T14:00:00.000Z"),
      city: "Póvoa de Penafirme",
      country: "Portugal",
      latitude: 39.1234,
      longitude: -9.2156,
      googleMapsUrl:
        "https://maps.google.com/?q=Carmo+Silvério+Póvoa+de+Penafirme",
      externalUrl: "",
      imageUrl: "",
      isFeatured: false,
    },
  });

  console.log(`✅ Event created/updated: ${event.slug}`);

  // 2. Upsert event translations separately (ALL 6 LANGUAGES)
  const eventTranslations = {
    pt: {
      title: "5ª Resistência BTT Penafirme 2026",
      description: `# 🚴 5ª Resistência BTT Penafirme

**5ª Edição** da Resistência BTT de Penafirme! Prova de resistência em circuito fechado com dificuldade fácil, ideal para todos os níveis de praticantes.

## ⏱️ Duas Provas de Resistência

**Prova Curta:** 2 horas em circuito (~9 km/volta)
**Prova Longa:** 3 horas em circuito (~9 km/volta)
**E-bikes:** 3 horas (categoria separada)

## ✨ Características

- **Circuito fechado** - Aproximadamente 9 km por volta
- **Grau de dificuldade:** Fácil
- **Formato resistência** - O maior número de voltas no tempo determinado
- **Classificação por escalões** - Múltiplas categorias masculinas e femininas
- **Ambiente familiar** - Evento aberto a federados e não federados

## 🎯 O Que Está Incluído (13€)

- Participação na prova
- Dorsal da prova
- Brindes de participação
- Seguro de acidentes pessoais
- Segurança rodoviária
- Zona de reabastecimento
- Acesso a balneários com banho quente
- Cronometragem eletrónica com chip

### 🏅 Escalões Disponíveis

**Masculinos:**
Sub23 (16-22), Elites (23-29), M30, M35, M40, M45, M50, M55, M60+

**Femininos:**
Elites (até 35 anos), Masters (+36 anos)

**Outras:**
E-bikes (Geral Masculina e Feminina)

**Local:** Externato de Penafirme, Torres Vedras | **Organização:** Clube Académico de Penafirme

Vem dar voltas connosco! 🔄🚵‍♀️`,
      city: "Póvoa de Penafirme",
      metaTitle: "5ª Resistência BTT Penafirme 2026 | 2h e 3h | 22 Março",
      metaDescription:
        "5ª Resistência BTT Penafirme - Prova de resistência em circuito. 2h e 3h. Dificuldade fácil. Inscrições 13€. Clube Académico de Penafirme, Torres Vedras.",
    },
    en: {
      title: "5th Penafirme BTT Endurance 2026",
      description: `# 🚴 5th Penafirme BTT Endurance

**5th Edition** of the Penafirme BTT Endurance! Circuit endurance race with easy difficulty, ideal for all rider levels.

## ⏱️ Two Endurance Races

**Short Race:** 2 hours on circuit (~9 km/lap)
**Long Race:** 3 hours on circuit (~9 km/lap)
**E-bikes:** 3 hours (separate category)

## ✨ Features

- **Closed circuit** - Approximately 9 km per lap
- **Difficulty level:** Easy
- **Endurance format** - Most laps within the time limit
- **Age category classification** - Multiple male and female categories
- **Family-friendly** - Event open to federated and non-federated

## 🎯 What's Included (13€)

- Race participation
- Race number
- Participation gifts
- Personal accident insurance
- Road safety
- Refreshment zone
- Access to changing rooms with hot shower
- Electronic chip timing

### 🏅 Available Categories

**Men:**
Sub23 (16-22), Elite (23-29), M30, M35, M40, M45, M50, M55, M60+

**Women:**
Elite (up to 35 years), Masters (+36 years)

**Others:**
E-bikes (Men's and Women's General)

**Venue:** Externato de Penafirme, Torres Vedras | **Organizer:** Clube Académico de Penafirme

Come ride laps with us! 🔄🚵‍♀️`,
      city: "Póvoa de Penafirme",
      metaTitle: "5th Penafirme BTT Endurance 2026 | 2h & 3h | March 22",
      metaDescription:
        "5th Penafirme BTT Endurance - Circuit endurance race. 2h and 3h. Easy difficulty. Registration 13€. Clube Académico de Penafirme, Torres Vedras.",
    },
    es: {
      title: "5ª Resistencia BTT Penafirme 2026",
      description: `# 🚴 5ª Resistencia BTT Penafirme

**5ª Edición** de la Resistencia BTT de Penafirme! Prueba de resistencia en circuito cerrado con dificultad fácil, ideal para todos los niveles.

## ⏱️ Dos Pruebas de Resistencia

**Prueba Corta:** 2 horas en circuito (~9 km/vuelta)
**Prueba Larga:** 3 horas en circuito (~9 km/vuelta)
**E-bikes:** 3 horas (categoría separada)

## ✨ Características

- **Circuito cerrado** - Aproximadamente 9 km por vuelta
- **Nivel de dificultad:** Fácil
- **Formato resistencia** - Mayor número de vueltas en el tiempo determinado
- **Clasificación por categorías** - Múltiples categorías masculinas y femeninas
- **Ambiente familiar** - Evento abierto a federados y no federados

## 🎯 Qué Está Incluido (13€)

- Participación en la prueba
- Dorsal de la prueba
- Regalos de participación
- Seguro de accidentes personales
- Seguridad vial
- Zona de avituallamiento
- Acceso a vestuarios con ducha caliente
- Cronometraje electrónico con chip

### 🏅 Categorías Disponibles

**Masculinos:**
Sub23 (16-22), Elite (23-29), M30, M35, M40, M45, M50, M55, M60+

**Femeninos:**
Elite (hasta 35 años), Masters (+36 años)

**Otros:**
E-bikes (General Masculina y Femenina)

**Lugar:** Externato de Penafirme, Torres Vedras | **Organización:** Clube Académico de Penafirme

¡Ven a dar vueltas con nosotros! 🔄🚵‍♀️`,
      city: "Póvoa de Penafirme",
      metaTitle: "5ª Resistencia BTT Penafirme 2026 | 2h y 3h | 22 Marzo",
      metaDescription:
        "5ª Resistencia BTT Penafirme - Prueba de resistencia en circuito. 2h y 3h. Dificultad fácil. Inscripciones 13€. Clube Académico de Penafirme, Torres Vedras.",
    },
    fr: {
      title: "5ème Résistance BTT Penafirme 2026",
      description: `# 🚴 5ème Résistance BTT Penafirme

**5ème Édition** de la Résistance BTT de Penafirme! Épreuve d'endurance sur circuit fermé avec difficulté facile, idéale pour tous les niveaux.

## ⏱️ Deux Épreuves d'Endurance

**Épreuve Courte:** 2 heures sur circuit (~9 km/tour)
**Épreuve Longue:** 3 heures sur circuit (~9 km/tour)
**E-bikes:** 3 heures (catégorie séparée)

## ✨ Caractéristiques

- **Circuit fermé** - Environ 9 km par tour
- **Niveau de difficulté:** Facile
- **Format endurance** - Plus grand nombre de tours dans le temps imparti
- **Classification par catégories** - Multiples catégories masculines et féminines
- **Ambiance familiale** - Événement ouvert aux fédérés et non-fédérés

## 🎯 Ce Qui Est Inclus (13€)

- Participation à l'épreuve
- Dossard de course
- Cadeaux de participation
- Assurance accidents personnels
- Sécurité routière
- Zone de ravitaillement
- Accès aux vestiaires avec douche chaude
- Chronométrage électronique avec puce

### 🏅 Catégories Disponibles

**Hommes:**
Sub23 (16-22), Elite (23-29), M30, M35, M40, M45, M50, M55, M60+

**Femmes:**
Elite (jusqu'à 35 ans), Masters (+36 ans)

**Autres:**
E-bikes (Général Hommes et Femmes)

**Lieu:** Externato de Penafirme, Torres Vedras | **Organisation:** Clube Académico de Penafirme

Venez faire des tours avec nous! 🔄🚵‍♀️`,
      city: "Póvoa de Penafirme",
      metaTitle: "5ème Résistance BTT Penafirme 2026 | 2h et 3h | 22 Mars",
      metaDescription:
        "5ème Résistance BTT Penafirme - Épreuve d'endurance sur circuit. 2h et 3h. Difficulté facile. Inscriptions 13€. Clube Académico de Penafirme, Torres Vedras.",
    },
    de: {
      title: "5. Penafirme BTT Ausdauer 2026",
      description: `# 🚴 5. Penafirme BTT Ausdauer

**5. Ausgabe** der Penafirme BTT Ausdauer! Ausdauerrennen auf geschlossenem Rundkurs mit leichtem Schwierigkeitsgrad, ideal für alle Leistungsstufen.

## ⏱️ Zwei Ausdauerrennen

**Kurzes Rennen:** 2 Stunden auf Rundkurs (~9 km/Runde)
**Langes Rennen:** 3 Stunden auf Rundkurs (~9 km/Runde)
**E-bikes:** 3 Stunden (separate Kategorie)

## ✨ Eigenschaften

- **Geschlossener Rundkurs** - Etwa 9 km pro Runde
- **Schwierigkeitsgrad:** Leicht
- **Ausdauerformat** - Meiste Runden innerhalb der Zeitbegrenzung
- **Alterskategorie-Klassifizierung** - Mehrere männliche und weibliche Kategorien
- **Familienfreundlich** - Event offen für Verbands- und Nicht-Verbandsfahrer

## 🎯 Was Ist Enthalten (13€)

- Rennteilnahme
- Startnummer
- Teilnahmegeschenke
- Unfallversicherung
- Straßensicherheit
- Verpflegungszone
- Zugang zu Umkleideräumen mit warmer Dusche
- Elektronische Chip-Zeitmessung

### 🏅 Verfügbare Kategorien

**Männer:**
Sub23 (16-22), Elite (23-29), M30, M35, M40, M45, M50, M55, M60+

**Frauen:**
Elite (bis 35 Jahre), Masters (+36 Jahre)

**Andere:**
E-bikes (Allgemeine Männer und Frauen)

**Ort:** Externato de Penafirme, Torres Vedras | **Veranstalter:** Clube Académico de Penafirme

Komm Runden mit uns fahren! 🔄🚵‍♀️`,
      city: "Póvoa de Penafirme",
      metaTitle: "5. Penafirme BTT Ausdauer 2026 | 2h & 3h | 22. März",
      metaDescription:
        "5. Penafirme BTT Ausdauer - Ausdauerrennen auf Rundkurs. 2h und 3h. Leichte Schwierigkeit. Anmeldung 13€. Clube Académico de Penafirme, Torres Vedras.",
    },
    it: {
      title: "5ª Resistenza BTT Penafirme 2026",
      description: `# 🚴 5ª Resistenza BTT Penafirme

**5ª Edizione** della Resistenza BTT di Penafirme! Gara di resistenza su circuito chiuso con difficoltà facile, ideale per tutti i livelli.

## ⏱️ Due Gare di Resistenza

**Gara Corta:** 2 ore su circuito (~9 km/giro)
**Gara Lunga:** 3 ore su circuito (~9 km/giro)
**E-bikes:** 3 ore (categoria separata)

## ✨ Caratteristiche

- **Circuito chiuso** - Circa 9 km per giro
- **Livello di difficoltà:** Facile
- **Formato resistenza** - Maggior numero di giri nel tempo stabilito
- **Classificazione per categorie** - Multiple categorie maschili e femminili
- **Ambiente familiare** - Evento aperto a tesserati e non

## 🎯 Cosa È Incluso (13€)

- Partecipazione alla gara
- Pettorale di gara
- Regali di partecipazione
- Assicurazione infortuni personali
- Sicurezza stradale
- Zona di rifornimento
- Accesso a spogliatoi con doccia calda
- Cronometraggio elettronico con chip

### 🏅 Categorie Disponibili

**Uomini:**
Sub23 (16-22), Elite (23-29), M30, M35, M40, M45, M50, M55, M60+

**Donne:**
Elite (fino a 35 anni), Masters (+36 anni)

**Altri:**
E-bikes (Generale Uomini e Donne)

**Luogo:** Externato de Penafirme, Torres Vedras | **Organizzatore:** Clube Académico de Penafirme

Vieni a fare giri con noi! 🔄🚵‍♀️`,
      city: "Póvoa de Penafirme",
      metaTitle: "5ª Resistenza BTT Penafirme 2026 | 2h e 3h | 22 Marzo",
      metaDescription:
        "5ª Resistenza BTT Penafirme - Gara di resistenza su circuito. 2h e 3h. Difficoltà facile. Iscrizioni 13€. Clube Académico de Penafirme, Torres Vedras.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: Language[lang],
        },
      },
      update: eventTranslations[lang],
      create: {
        eventId: event.id,
        language: Language[lang],
        ...eventTranslations[lang],
      },
    });
  }

  console.log("✅ Event translations created/updated (6 languages)");

  // 3. Upsert variants (idempotent with findFirst)
  const findOrCreateVariant = async (variantData: {
    name: string;
    distanceKm: number;
    elevationGainM: number;
    elevationLossM: number;
    startTime: string;
    maxParticipants: number;
    cutoffTimeHours: number;
    atrpGrade: number;
    mountainLevel: number;
    price: number;
    currency: Currency;
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

  const prova2hVariant = await findOrCreateVariant({
    name: "Prova Curta 2 Horas",
    distanceKm: 18,
    elevationGainM: 200,
    elevationLossM: 200,
    startTime: "09:00",
    maxParticipants: 125,
    cutoffTimeHours: 2.0,
    atrpGrade: 1,
    mountainLevel: 1,
    price: 10.0,
    currency: Currency.EUR,
  });

  console.log(`✅ Variant created/updated: ${prova2hVariant.name}`);

  const prova3hVariant = await findOrCreateVariant({
    name: "Prova Longa 3 Horas",
    distanceKm: 27,
    elevationGainM: 300,
    elevationLossM: 300,
    startTime: "09:00",
    maxParticipants: 125,
    cutoffTimeHours: 3.0,
    atrpGrade: 1,
    mountainLevel: 1,
    price: 12.0,
    currency: Currency.EUR,
  });

  console.log(`✅ Variant created/updated: ${prova3hVariant.name}`);

  // 4. Upsert variant translations (6 languages each)
  const prova2hTranslations = {
    pt: {
      name: "Prova Curta - 2 Horas",
      description: `## ⏱️ Prova Curta - 2 Horas

Prova de resistência em circuito fechado com duração de 2 horas. Ideal para iniciantes e praticantes ocasionais.

### 📊 Características
- **Duração:** 2 horas
- **Circuito:** ~9 km por volta
- **Desnível:** Baixo (~200m por volta)
- **Dificuldade:** Fácil
- **Formato:** Máximo de voltas completadas em 2h

### 🏁 Classificação
Vence quem completar mais voltas dentro do tempo de 2 horas. Em caso de empate, será considerado o atleta que completar primeiro a última volta.

**Importante:** Atletas que terminem a volta após as 11:00h (2h de prova) terão essa volta cancelada.`,
    },
    en: {
      name: "Short Race - 2 Hours",
      description: `## ⏱️ Short Race - 2 Hours

Circuit endurance race lasting 2 hours. Ideal for beginners and occasional riders.

### 📊 Characteristics
- **Duration:** 2 hours
- **Circuit:** ~9 km per lap
- **Elevation:** Low (~200m per lap)
- **Difficulty:** Easy
- **Format:** Maximum laps completed in 2h

### 🏁 Classification
Winner completes the most laps within 2 hours. In case of tie, the athlete who completes the last lap first wins.

**Important:** Athletes finishing the lap after 11:00am (2h race) will have that lap cancelled.`,
    },
    es: {
      name: "Prueba Corta - 2 Horas",
      description: `## ⏱️ Prueba Corta - 2 Horas

Prueba de resistencia en circuito cerrado con duración de 2 horas. Ideal para principiantes y ciclistas ocasionales.

### 📊 Características
- **Duración:** 2 horas
- **Circuito:** ~9 km por vuelta
- **Desnivel:** Bajo (~200m por vuelta)
- **Dificultad:** Fácil
- **Formato:** Máximo de vueltas completadas en 2h

### 🏁 Clasificación
Gana quien complete más vueltas dentro de las 2 horas. En caso de empate, se considerará el atleta que complete primero la última vuelta.

**Importante:** Atletas que terminen la vuelta después de las 11:00h (2h de prueba) tendrán esa vuelta cancelada.`,
    },
    fr: {
      name: "Épreuve Courte - 2 Heures",
      description: `## ⏱️ Épreuve Courte - 2 Heures

Épreuve d'endurance sur circuit fermé d'une durée de 2 heures. Idéale pour débutants et cyclistes occasionnels.

### 📊 Caractéristiques
- **Durée:** 2 heures
- **Circuit:** ~9 km par tour
- **Dénivelé:** Faible (~200m par tour)
- **Difficulté:** Facile
- **Format:** Maximum de tours complétés en 2h

### 🏁 Classification
Gagne celui qui complète le plus de tours en 2 heures. En cas d'égalité, sera considéré l'athlète qui complète en premier le dernier tour.

**Important:** Les athlètes finissant le tour après 11h00 (2h d'épreuve) verront ce tour annulé.`,
    },
    de: {
      name: "Kurzes Rennen - 2 Stunden",
      description: `## ⏱️ Kurzes Rennen - 2 Stunden

Ausdauerrennen auf geschlossenem Rundkurs mit einer Dauer von 2 Stunden. Ideal für Anfänger und Gelegenheitsfahrer.

### 📊 Eigenschaften
- **Dauer:** 2 Stunden
- **Rundkurs:** ~9 km pro Runde
- **Höhenunterschied:** Niedrig (~200m pro Runde)
- **Schwierigkeit:** Leicht
- **Format:** Maximale Runden in 2h abgeschlossen

### 🏁 Klassifizierung
Gewinner schließt die meisten Runden innerhalb von 2 Stunden ab. Bei Gleichstand wird der Athlet berücksichtigt, der die letzte Runde zuerst abschließt.

**Wichtig:** Athleten, die die Runde nach 11:00 Uhr (2h Rennen) beenden, wird diese Runde annulliert.`,
    },
    it: {
      name: "Gara Corta - 2 Ore",
      description: `## ⏱️ Gara Corta - 2 Ore

Gara di resistenza su circuito chiuso della durata di 2 ore. Ideale per principianti e ciclisti occasionali.

### 📊 Caratteristiche
- **Durata:** 2 ore
- **Circuito:** ~9 km per giro
- **Dislivello:** Basso (~200m per giro)
- **Difficoltà:** Facile
- **Formato:** Massimo giri completati in 2h

### 🏁 Classificazione
Vince chi completa più giri entro 2 ore. In caso di parità, sarà considerato l'atleta che completa per primo l'ultimo giro.

**Importante:** Gli atleti che terminano il giro dopo le 11:00 (2h di gara) avranno quel giro annullato.`,
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: prova2hVariant.id,
          language: Language[lang],
        },
      },
      update: prova2hTranslations[lang],
      create: {
        variantId: prova2hVariant.id,
        language: Language[lang],
        ...prova2hTranslations[lang],
      },
    });
  }

  console.log("✅ Prova 2h variant translations created/updated (6 languages)");

  const prova3hTranslations = {
    pt: {
      name: "Prova Longa - 3 Horas",
      description: `## ⏱️ Prova Longa - 3 Horas

Prova de resistência em circuito fechado com duração de 3 horas. Para atletas com mais experiência e resistência.

### 📊 Características
- **Duração:** 3 horas
- **Circuito:** ~9 km por volta
- **Desnível:** Baixo (~200m por volta)
- **Dificuldade:** Fácil/Média
- **Formato:** Máximo de voltas completadas em 3h

### 🏁 Classificação
Vence quem completar mais voltas dentro do tempo de 3 horas. Em caso de empate, será considerado o atleta que completar primeiro a última volta.

**Importante:** Atletas que terminem a volta após as 12:00h (3h de prova) terão essa volta cancelada.

### 🚴 Também Disponível para E-bikes
E-bikes competem na prova de 3 horas em categoria separada (Geral Masculina e Geral Feminina).`,
    },
    en: {
      name: "Long Race - 3 Hours",
      description: `## ⏱️ Long Race - 3 Hours

Circuit endurance race lasting 3 hours. For athletes with more experience and endurance.

### 📊 Characteristics
- **Duration:** 3 hours
- **Circuit:** ~9 km per lap
- **Elevation:** Low (~200m per lap)
- **Difficulty:** Easy/Medium
- **Format:** Maximum laps completed in 3h

### 🏁 Classification
Winner completes the most laps within 3 hours. In case of tie, the athlete who completes the last lap first wins.

**Important:** Athletes finishing the lap after 12:00pm (3h race) will have that lap cancelled.

### 🚴 Also Available for E-bikes
E-bikes compete in the 3-hour race in a separate category (Men's and Women's General).`,
    },
    es: {
      name: "Prueba Larga - 3 Horas",
      description: `## ⏱️ Prueba Larga - 3 Horas

Prueba de resistencia en circuito cerrado con duración de 3 horas. Para atletas con más experiencia y resistencia.

### 📊 Características
- **Duración:** 3 horas
- **Circuito:** ~9 km por vuelta
- **Desnivel:** Bajo (~200m por vuelta)
- **Dificultad:** Fácil/Media
- **Formato:** Máximo de vueltas completadas en 3h

### 🏁 Clasificación
Gana quien complete más vueltas dentro de las 3 horas. En caso de empate, se considerará el atleta que complete primero la última vuelta.

**Importante:** Atletas que terminen la vuelta después de las 12:00h (3h de prueba) tendrán esa vuelta cancelada.

### 🚴 También Disponible para E-bikes
E-bikes compiten en la prueba de 3 horas en categoría separada (General Masculina y General Femenina).`,
    },
    fr: {
      name: "Épreuve Longue - 3 Heures",
      description: `## ⏱️ Épreuve Longue - 3 Heures

Épreuve d'endurance sur circuit fermé d'une durée de 3 heures. Pour athlètes avec plus d'expérience et d'endurance.

### 📊 Caractéristiques
- **Durée:** 3 heures
- **Circuit:** ~9 km par tour
- **Dénivelé:** Faible (~200m par tour)
- **Difficulté:** Facile/Moyen
- **Format:** Maximum de tours complétés en 3h

### 🏁 Classification
Gagne celui qui complète le plus de tours en 3 heures. En cas d'égalité, sera considéré l'athlète qui complète en premier le dernier tour.

**Important:** Les athlètes finissant le tour après 12h00 (3h d'épreuve) verront ce tour annulé.

### 🚴 Également Disponible pour E-bikes
E-bikes concourent dans l'épreuve de 3 heures en catégorie séparée (Général Hommes et Général Femmes).`,
    },
    de: {
      name: "Langes Rennen - 3 Stunden",
      description: `## ⏱️ Langes Rennen - 3 Stunden

Ausdauerrennen auf geschlossenem Rundkurs mit einer Dauer von 3 Stunden. Für Athleten mit mehr Erfahrung und Ausdauer.

### 📊 Eigenschaften
- **Dauer:** 3 Stunden
- **Rundkurs:** ~9 km pro Runde
- **Höhenunterschied:** Niedrig (~200m pro Runde)
- **Schwierigkeit:** Leicht/Mittel
- **Format:** Maximale Runden in 3h abgeschlossen

### 🏁 Klassifizierung
Gewinner schließt die meisten Runden innerhalb von 3 Stunden ab. Bei Gleichstand wird der Athlet berücksichtigt, der die letzte Runde zuerst abschließt.

**Wichtig:** Athleten, die die Runde nach 12:00 Uhr (3h Rennen) beenden, wird diese Runde annulliert.

### 🚴 Auch Verfügbar für E-bikes
E-bikes konkurrieren im 3-Stunden-Rennen in separater Kategorie (Allgemeine Männer und Allgemeine Frauen).`,
    },
    it: {
      name: "Gara Lunga - 3 Ore",
      description: `## ⏱️ Gara Lunga - 3 Ore

Gara di resistenza su circuito chiuso della durata di 3 ore. Per atleti con più esperienza e resistenza.

### 📊 Caratteristiche
- **Durata:** 3 ore
- **Circuito:** ~9 km per giro
- **Dislivello:** Basso (~200m per giro)
- **Difficoltà:** Facile/Media
- **Formato:** Massimo giri completati in 3h

### 🏁 Classificazione
Vince chi completa più giri entro 3 ore. In caso di parità, sarà considerato l'atleta che completa per primo l'ultimo giro.

**Importante:** Gli atleti che terminano il giro dopo le 12:00 (3h di gara) avranno quel giro annullato.

### 🚴 Disponibile Anche per E-bikes
E-bikes competono nella gara di 3 ore in categoria separata (Generale Uomini e Generale Donne).`,
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: prova3hVariant.id,
          language: Language[lang],
        },
      },
      update: prova3hTranslations[lang],
      create: {
        variantId: prova3hVariant.id,
        language: Language[lang],
        ...prova3hTranslations[lang],
      },
    });
  }

  console.log("✅ Prova 3h variant translations created/updated (6 languages)");

  // 5. Upsert pricing phases
  const findOrCreatePricingPhase = async (
    name: string,
    data: {
      startDate: Date;
      endDate: Date;
      price: number;
      currency: Currency;
      discountPercent: number | null;
      note: string | null;
    }
  ) => {
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
        data: { eventId: event.id, name, ...data },
      });
    }
  };

  await findOrCreatePricingPhase("Inscrição Early Bird", {
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    endDate: new Date("2026-01-23T23:59:00.000Z"),
    price: 13.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Preço promocional até 23 de janeiro",
  });

  await findOrCreatePricingPhase("Inscrição Normal", {
    startDate: new Date("2026-01-24T00:00:00.000Z"),
    endDate: new Date("2026-03-17T23:59:00.000Z"),
    price: 17.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "De 24 janeiro a 17 março",
  });

  console.log("✅ Pricing phases created/updated");

  console.log(
    "\n🎉 5ª Resistência BTT Penafirme 2026 seed completed successfully!"
  );
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
