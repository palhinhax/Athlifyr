import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding 2H Resistência Duraiza 2026...");

  // 1. Upsert event (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: "2h-resistencia-duraiza-2026" },
    update: {
      title: "2H Resistência Duraiza 2026",
      description: "Prova de resistência BTT Cross-Country de 2 horas",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-22T09:30:00.000Z"),
      endDate: new Date("2026-03-22T14:00:00.000Z"),
      city: "Almograve",
      country: "Portugal",
      latitude: 37.6569,
      longitude: -8.7973,
      googleMapsUrl: "https://maps.google.com/?q=Almograve+Beja",
      externalUrl: "https://www.facebook.com/Duraizos",
      imageUrl: "",
      isFeatured: false,
    },
    create: {
      slug: "2h-resistencia-duraiza-2026",
      title: "2H Resistência Duraiza 2026",
      description: "Prova de resistência BTT Cross-Country de 2 horas",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-22T09:30:00.000Z"),
      endDate: new Date("2026-03-22T14:00:00.000Z"),
      city: "Almograve",
      country: "Portugal",
      latitude: 37.6569,
      longitude: -8.7973,
      googleMapsUrl: "https://maps.google.com/?q=Almograve+Beja",
      externalUrl: "https://www.facebook.com/Duraizos",
      imageUrl: "",
      isFeatured: false,
    },
  });

  console.log(`✅ Event created/updated: ${event.slug}`);

  // 2. Upsert event translations separately (ALL 6 LANGUAGES)
  const eventTranslations = {
    pt: {
      title: "2H Resistência Duraiza 2026",
      description: `# 🚵 2H Resistência Duraiza 2026

Prova de **BTT Cross-Country Resistência (XCR)** organizada pela Secção de BTT "Os Duraizos" da ACRD Longueira, em Almograve.

## ⏱️ Duas Modalidades

**Prova Individual:** 2 horas consecutivas
**Prova por Duplas:** 2 horas consecutivas (trocas livres)

Circuito fechado e devidamente sinalizado com duração de 2 horas. Ganha quem completar mais voltas!

## ✨ Destaques

- **Circuito fechado** - percurso seguro e controlado
- **Trilhos e caminhos florestais** - maioritariamente fora de estrada
- **Classificação completa** - múltiplos escalões etários
- **Formato resistência** - maior número de voltas em 2 horas
- **Ambiente competitivo** - aberto a federados e não federados

## 🎯 O Que Está Incluído

- Abastecimentos durante a prova
- Dorsal de identificação
- Pequena refeição (bifana + bebida)
- Seguro desportivo de acidentes
- Cronometragem oficial
- Classificação por escalões

### 📋 Categorias Disponíveis

**Individual:**
Júniores (16-17), Elite M/F (18-29), Master 30 M/F, Master 40 M, Master 50 M, Master 60 M

**Duplas:**
Masculinas, Femininas, Mistas

### ⚙️ Bicicletas Permitidas
BTT e Gravel

**Organização:** Secção de BTT "Os Duraizos" - ACRD Longueira

Vem testar a tua resistência em Almograve! 🏖️🚴‍♂️`,
      city: "Almograve",
      metaTitle: "2H Resistência Duraiza 2026 | XCR | Almograve | 22 Março",
      metaDescription:
        "2H Resistência Duraiza - Prova XCR em circuito fechado. Individual e Duplas. BTT e Gravel permitidas. Almograve, 22 Março 2026. Os Duraizos.",
    },
    en: {
      title: "2H Duraiza Endurance 2026",
      description: `# 🚵 2H Duraiza Endurance 2026

**BTT Cross-Country Endurance (XCR)** race organized by BTT Section "Os Duraizos" from ACRD Longueira, in Almograve.

## ⏱️ Two Formats

**Individual Race:** 2 consecutive hours
**Pairs Race:** 2 consecutive hours (free exchanges)

Closed and properly marked circuit lasting 2 hours. Winner completes the most laps!

## ✨ Highlights

- **Closed circuit** - safe and controlled route
- **Trails and forest paths** - mostly off-road
- **Complete classification** - multiple age categories
- **Endurance format** - most laps in 2 hours
- **Competitive atmosphere** - open to federated and non-federated

## 🎯 What's Included

- Refreshments during the race
- Race number
- Light meal (pork sandwich + drink)
- Sports accident insurance
- Official timing
- Age category classification

### 📋 Available Categories

**Individual:**
Juniors (16-17), Elite M/F (18-29), Master 30 M/F, Master 40 M, Master 50 M, Master 60 M

**Pairs:**
Men's, Women's, Mixed

### ⚙️ Allowed Bikes
MTB and Gravel

**Organizer:** BTT Section "Os Duraizos" - ACRD Longueira

Come test your endurance in Almograve! 🏖️🚴‍♂️`,
      city: "Almograve",
      metaTitle: "2H Duraiza Endurance 2026 | XCR | Almograve | March 22",
      metaDescription:
        "2H Duraiza Endurance - XCR race on closed circuit. Individual and Pairs. MTB and Gravel allowed. Almograve, March 22, 2026. Os Duraizos.",
    },
    es: {
      title: "2H Resistencia Duraiza 2026",
      description: `# 🚵 2H Resistencia Duraiza 2026

Prueba de **BTT Cross-Country Resistencia (XCR)** organizada por la Sección BTT "Os Duraizos" de ACRD Longueira, en Almograve.

## ⏱️ Dos Formatos

**Prueba Individual:** 2 horas consecutivas
**Prueba por Parejas:** 2 horas consecutivas (cambios libres)

Circuito cerrado y debidamente señalizado con duración de 2 horas. ¡Gana quien complete más vueltas!

## ✨ Aspectos Destacados

- **Circuito cerrado** - ruta segura y controlada
- **Senderos y caminos forestales** - mayormente fuera de carretera
- **Clasificación completa** - múltiples categorías por edad
- **Formato resistencia** - mayor número de vueltas en 2 horas
- **Ambiente competitivo** - abierto a federados y no federados

## 🎯 Qué Está Incluido

- Avituallamientos durante la prueba
- Dorsal de identificación
- Pequeña comida (bocadillo de cerdo + bebida)
- Seguro de accidentes deportivos
- Cronometraje oficial
- Clasificación por categorías

### 📋 Categorías Disponibles

**Individual:**
Júniores (16-17), Elite M/F (18-29), Master 30 M/F, Master 40 M, Master 50 M, Master 60 M

**Parejas:**
Masculinas, Femeninas, Mixtas

### ⚙️ Bicicletas Permitidas
BTT y Gravel

**Organización:** Sección BTT "Os Duraizos" - ACRD Longueira

¡Ven a probar tu resistencia en Almograve! 🏖️🚴‍♂️`,
      city: "Almograve",
      metaTitle: "2H Resistencia Duraiza 2026 | XCR | Almograve | 22 Marzo",
      metaDescription:
        "2H Resistencia Duraiza - Prueba XCR en circuito cerrado. Individual y Parejas. BTT y Gravel permitidas. Almograve, 22 Marzo 2026. Os Duraizos.",
    },
    fr: {
      title: "2H Résistance Duraiza 2026",
      description: `# 🚵 2H Résistance Duraiza 2026

Épreuve de **VTT Cross-Country Résistance (XCR)** organisée par la Section VTT "Os Duraizos" de l'ACRD Longueira, à Almograve.

## ⏱️ Deux Formats

**Épreuve Individuelle:** 2 heures consécutives
**Épreuve par Équipes:** 2 heures consécutives (échanges libres)

Circuit fermé et correctement balisé d'une durée de 2 heures. Gagne celui qui complète le plus de tours!

## ✨ Points Forts

- **Circuit fermé** - parcours sûr et contrôlé
- **Sentiers et chemins forestiers** - majoritairement hors route
- **Classification complète** - multiples catégories d'âge
- **Format résistance** - plus grand nombre de tours en 2 heures
- **Ambiance compétitive** - ouvert aux fédérés et non-fédérés

## 🎯 Ce Qui Est Inclus

- Ravitaillements pendant l'épreuve
- Dossard d'identification
- Petit repas (sandwich au porc + boisson)
- Assurance accidents sportifs
- Chronométrage officiel
- Classification par catégories

### 📋 Catégories Disponibles

**Individuel:**
Juniors (16-17), Elite H/F (18-29), Master 30 H/F, Master 40 H, Master 50 H, Master 60 H

**Équipes:**
Masculines, Féminines, Mixtes

### ⚙️ Vélos Autorisés
VTT et Gravel

**Organisation:** Section VTT "Os Duraizos" - ACRD Longueira

Venez tester votre endurance à Almograve! 🏖️🚴‍♂️`,
      city: "Almograve",
      metaTitle: "2H Résistance Duraiza 2026 | XCR | Almograve | 22 Mars",
      metaDescription:
        "2H Résistance Duraiza - Épreuve XCR sur circuit fermé. Individuel et Équipes. VTT et Gravel autorisés. Almograve, 22 Mars 2026. Os Duraizos.",
    },
    de: {
      title: "2H Duraiza Ausdauer 2026",
      description: `# 🚵 2H Duraiza Ausdauer 2026

**MTB Cross-Country Ausdauer (XCR)** Rennen organisiert von der MTB Sektion "Os Duraizos" des ACRD Longueira, in Almograve.

## ⏱️ Zwei Formate

**Einzelrennen:** 2 aufeinanderfolgende Stunden
**Paar-Rennen:** 2 aufeinanderfolgende Stunden (freie Wechsel)

Geschlossener und ordnungsgemäß markierter Rundkurs von 2 Stunden Dauer. Gewinner schließt die meisten Runden ab!

## ✨ Highlights

- **Geschlossener Rundkurs** - sichere und kontrollierte Strecke
- **Trails und Waldwege** - überwiegend Off-Road
- **Vollständige Klassifizierung** - mehrere Alterskategorien
- **Ausdauerformat** - meiste Runden in 2 Stunden
- **Wettkampfatmosphäre** - offen für Verbands- und Nicht-Verbandsfahrer

## 🎯 Was Ist Enthalten

- Verpflegung während des Rennens
- Startnummer
- Leichte Mahlzeit (Schweinefleisch-Sandwich + Getränk)
- Sportunfallversicherung
- Offizielle Zeitmessung
- Alterskategorie-Klassifizierung

### 📋 Verfügbare Kategorien

**Einzel:**
Junioren (16-17), Elite M/W (18-29), Master 30 M/W, Master 40 M, Master 50 M, Master 60 M

**Paare:**
Männer, Frauen, Gemischt

### ⚙️ Erlaubte Fahrräder
MTB und Gravel

**Veranstalter:** MTB Sektion "Os Duraizos" - ACRD Longueira

Komm und teste deine Ausdauer in Almograve! 🏖️🚴‍♂️`,
      city: "Almograve",
      metaTitle: "2H Duraiza Ausdauer 2026 | XCR | Almograve | 22. März",
      metaDescription:
        "2H Duraiza Ausdauer - XCR Rennen auf geschlossenem Rundkurs. Einzel und Paare. MTB und Gravel erlaubt. Almograve, 22. März 2026. Os Duraizos.",
    },
    it: {
      title: "2H Resistenza Duraiza 2026",
      description: `# 🚵 2H Resistenza Duraiza 2026

Gara di **MTB Cross-Country Resistenza (XCR)** organizzata dalla Sezione MTB "Os Duraizos" dell'ACRD Longueira, ad Almograve.

## ⏱️ Due Formati

**Gara Individuale:** 2 ore consecutive
**Gara a Coppie:** 2 ore consecutive (cambi liberi)

Circuito chiuso e debitamente segnalato della durata di 2 ore. Vince chi completa più giri!

## ✨ Punti Salienti

- **Circuito chiuso** - percorso sicuro e controllato
- **Sentieri e percorsi forestali** - principalmente fuori strada
- **Classificazione completa** - multiple categorie per età
- **Formato resistenza** - maggior numero di giri in 2 ore
- **Atmosfera competitiva** - aperto a tesserati e non

## 🎯 Cosa È Incluso

- Ristori durante la gara
- Pettorale identificativo
- Piccolo pasto (panino di maiale + bevanda)
- Assicurazione infortuni sportivi
- Cronometraggio ufficiale
- Classificazione per categorie

### 📋 Categorie Disponibili

**Individuale:**
Juniores (16-17), Elite M/F (18-29), Master 30 M/F, Master 40 M, Master 50 M, Master 60 M

**Coppie:**
Maschili, Femminili, Miste

### ⚙️ Biciclette Permesse
MTB e Gravel

**Organizzatore:** Sezione MTB "Os Duraizos" - ACRD Longueira

Vieni a testare la tua resistenza ad Almograve! 🏖️🚴‍♂️`,
      city: "Almograve",
      metaTitle: "2H Resistenza Duraiza 2026 | XCR | Almograve | 22 Marzo",
      metaDescription:
        "2H Resistenza Duraiza - Gara XCR su circuito chiuso. Individuale e Coppie. MTB e Gravel permesse. Almograve, 22 Marzo 2026. Os Duraizos.",
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

  const individualVariant = await findOrCreateVariant({
    name: "Circuito Individual - 2 Horas",
    distanceKm: 20,
    elevationGainM: 300,
    elevationLossM: 300,
    startTime: "09:30",
    maxParticipants: 200,
    cutoffTimeHours: 2.0,
    atrpGrade: 2,
    mountainLevel: 2,
    price: 12.0,
    currency: Currency.EUR,
  });

  console.log(`✅ Variant created/updated: ${individualVariant.name}`);

  // 4. Upsert variant translations (6 languages each)
  const individualTranslations = {
    pt: {
      name: "Circuito Individual - 2 Horas",
      description: `## 👤 Circuito Individual - 2 Horas

Prova individual de resistência em circuito fechado. O atleta compete sozinho durante 2 horas consecutivas.

### 📊 Características
- **Duração:** 2 horas consecutivas
- **Formato:** Circuito fechado
- **Terreno:** Maioritariamente trilhos e caminhos florestais
- **Classificação:** Maior número de voltas completadas

### 🏁 Regras
- Vence quem completar mais voltas dentro de 2 horas
- Em caso de empate, vence quem completar a última volta primeiro
- Zona de assistência técnica disponível

### 📋 Escalões
**Masculinos:** Júniores (16-17), Elite (18-29), Master 30, Master 40, Master 50, Master 60
**Femininos:** Elite (18-29), Master 30

Idade mínima: 16 anos completos à data da prova.`,
    },
    en: {
      name: "Individual Circuit - 2 Hours",
      description: `## 👤 Individual Circuit - 2 Hours

Individual endurance race on closed circuit. Athlete competes alone for 2 consecutive hours.

### 📊 Characteristics
- **Duration:** 2 consecutive hours
- **Format:** Closed circuit
- **Terrain:** Mostly trails and forest paths
- **Classification:** Most laps completed

### 🏁 Rules
- Winner completes the most laps within 2 hours
- In case of tie, winner completes the last lap first
- Technical assistance zone available

### 📋 Categories
**Men:** Juniors (16-17), Elite (18-29), Master 30, Master 40, Master 50, Master 60
**Women:** Elite (18-29), Master 30

Minimum age: 16 years completed at race date.`,
    },
    es: {
      name: "Circuito Individual - 2 Horas",
      description: `## 👤 Circuito Individual - 2 Horas

Prueba individual de resistencia en circuito cerrado. El atleta compite solo durante 2 horas consecutivas.

### 📊 Características
- **Duración:** 2 horas consecutivas
- **Formato:** Circuito cerrado
- **Terreno:** Mayormente senderos y caminos forestales
- **Clasificación:** Mayor número de vueltas completadas

### 🏁 Reglas
- Gana quien complete más vueltas en 2 horas
- En caso de empate, gana quien complete la última vuelta primero
- Zona de asistencia técnica disponible

### 📋 Categorías
**Masculinos:** Júniores (16-17), Elite (18-29), Master 30, Master 40, Master 50, Master 60
**Femeninos:** Elite (18-29), Master 30

Edad mínima: 16 años cumplidos en la fecha de la prueba.`,
    },
    fr: {
      name: "Circuit Individuel - 2 Heures",
      description: `## 👤 Circuit Individuel - 2 Heures

Épreuve individuelle d'endurance sur circuit fermé. L'athlète concourt seul pendant 2 heures consécutives.

### 📊 Caractéristiques
- **Durée:** 2 heures consécutives
- **Format:** Circuit fermé
- **Terrain:** Principalement sentiers et chemins forestiers
- **Classification:** Plus grand nombre de tours complétés

### 🏁 Règles
- Gagne celui qui complète le plus de tours en 2 heures
- En cas d'égalité, gagne celui qui complète le dernier tour en premier
- Zone d'assistance technique disponible

### 📋 Catégories
**Hommes:** Juniors (16-17), Elite (18-29), Master 30, Master 40, Master 50, Master 60
**Femmes:** Elite (18-29), Master 30

Âge minimum: 16 ans révolus à la date de l'épreuve.`,
    },
    de: {
      name: "Einzelrundkurs - 2 Stunden",
      description: `## 👤 Einzelrundkurs - 2 Stunden

Einzelnes Ausdauerrennen auf geschlossenem Rundkurs. Der Athlet fährt allein für 2 aufeinanderfolgende Stunden.

### 📊 Eigenschaften
- **Dauer:** 2 aufeinanderfolgende Stunden
- **Format:** Geschlossener Rundkurs
- **Gelände:** Überwiegend Trails und Waldwege
- **Klassifizierung:** Meiste abgeschlossene Runden

### 🏁 Regeln
- Gewinner schließt die meisten Runden in 2 Stunden ab
- Bei Gleichstand gewinnt, wer die letzte Runde zuerst abschließt
- Technische Assistenzzone verfügbar

### 📋 Kategorien
**Männer:** Junioren (16-17), Elite (18-29), Master 30, Master 40, Master 50, Master 60
**Frauen:** Elite (18-29), Master 30

Mindestalter: 16 Jahre vollendet am Renntag.`,
    },
    it: {
      name: "Circuito Individuale - 2 Ore",
      description: `## 👤 Circuito Individuale - 2 Ore

Gara individuale di resistenza su circuito chiuso. L'atleta gareggia da solo per 2 ore consecutive.

### 📊 Caratteristiche
- **Durata:** 2 ore consecutive
- **Formato:** Circuito chiuso
- **Terreno:** Principalmente sentieri e percorsi forestali
- **Classificazione:** Maggior numero di giri completati

### 🏁 Regole
- Vince chi completa più giri in 2 ore
- In caso di parità, vince chi completa l'ultimo giro per primo
- Zona di assistenza tecnica disponibile

### 📋 Categorie
**Uomini:** Juniores (16-17), Elite (18-29), Master 30, Master 40, Master 50, Master 60
**Donne:** Elite (18-29), Master 30

Età minima: 16 anni compiuti alla data della gara.`,
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: individualVariant.id,
          language: Language[lang],
        },
      },
      update: individualTranslations[lang],
      create: {
        variantId: individualVariant.id,
        language: Language[lang],
        ...individualTranslations[lang],
      },
    });
  }

  console.log(
    "✅ Individual variant translations created/updated (6 languages)"
  );

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

  await findOrCreatePricingPhase("Circuito Individual", {
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    endDate: new Date("2026-03-17T23:59:00.000Z"),
    price: 17.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Inclui abastecimentos, dorsal e pequena refeição (bifana + bebida)",
  });

  await findOrCreatePricingPhase("Duplas Masculinas", {
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    endDate: new Date("2026-03-17T23:59:00.000Z"),
    price: 30.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Dupla masculina - 2 atletas",
  });

  await findOrCreatePricingPhase("Duplas Femininas", {
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    endDate: new Date("2026-03-17T23:59:00.000Z"),
    price: 30.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Dupla feminina - 2 atletas",
  });

  await findOrCreatePricingPhase("Duplas Mistas", {
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    endDate: new Date("2026-03-17T23:59:00.000Z"),
    price: 30.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Dupla mista - 1 homem + 1 mulher",
  });

  console.log("✅ Pricing phases created/updated");

  console.log("\n🎉 2H Resistência Duraiza 2026 seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
