import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding Open Torres Vedras XCM BTT 2026...");

  // 1. Upsert event (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: "open-torres-vedras-xcm-btt-2026" },
    update: {
      title: "Open Torres Vedras XCM BTT 2026",
      description:
        "3ª Edição do Open Torres Vedras incluída na 1ª Etapa Taça de Portugal de XCM",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-15T09:00:00.000Z"),
      endDate: new Date("2026-03-15T15:00:00.000Z"),
      city: "Torres Vedras",
      country: "Portugal",
      latitude: 39.0915,
      longitude: -9.2592,
      googleMapsUrl:
        "https://maps.google.com/?q=Parque+Expotorres+Torres+Vedras",
      externalUrl: "",
      imageUrl: "",
      isFeatured: false,
    },
    create: {
      slug: "open-torres-vedras-xcm-btt-2026",
      title: "Open Torres Vedras XCM BTT 2026",
      description:
        "3ª Edição do Open Torres Vedras incluída na 1ª Etapa Taça de Portugal de XCM",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-15T09:00:00.000Z"),
      endDate: new Date("2026-03-15T15:00:00.000Z"),
      city: "Torres Vedras",
      country: "Portugal",
      latitude: 39.0915,
      longitude: -9.2592,
      googleMapsUrl:
        "https://maps.google.com/?q=Parque+Expotorres+Torres+Vedras",
      externalUrl: "",
      imageUrl: "",
      isFeatured: false,
    },
  });

  console.log(`✅ Event created/updated: ${event.slug}`);

  // 2. Upsert event translations separately (ALL 6 LANGUAGES)
  const eventTranslations = {
    pt: {
      title: "Open Torres Vedras XCM BTT 2026",
      description: `# 🚵 Open Torres Vedras XCM BTT 2026

**3ª Edição** do Open Torres Vedras integrada na **1ª Etapa da Taça de Portugal de XCM**! Vem fazer parte de uma maratona épica no coração de Torres Vedras.

## 🏆 Duas Distâncias em Competição

**Meia Maratona:** 45 km - dificuldade média
**Maratona Completa:** 70 km - dificuldade alta

Prova de carácter amador tipo passeio maratona, com registo e divulgação de tempos oficiais.

## ✨ Destaques

- **Taça de Portugal** - 1ª Etapa oficial da época 2026
- **Caminhos rurais e trilhos** - 90% percursos naturais
- **Classificação completa** - múltiplos escalões masculinos e femininos
- **Ambiente competitivo** - aberto a federados e não federados (idade mínima 18 anos)

## 🎯 O Que Está Incluído

- Participação no evento
- Seguro de acidentes pessoais
- Frontal e braçadeiras
- Brindes e lembranças
- Banhos quentes após a prova
- Abastecimentos líquidos e sólidos durante o percurso
- Reforço alimentar na meta
- Local para lavagem de bicicletas
- Fotos individuais disponibilizadas no Facebook oficial MR3eventus
- Cronometragem e classificação oficial

**E-bikes são permitidas** (apenas vertente passeio, sem classificação).

Junta-te a nós nesta grande prova de XCM! 🏅🚴‍♂️`,
      city: "Torres Vedras",
      metaTitle:
        "Open Torres Vedras XCM BTT 2026 | 1ª Etapa Taça de Portugal | 15 Março",
      metaDescription:
        "3ª Edição Open Torres Vedras XCM BTT - 1ª Etapa Taça de Portugal. Maratona 70km e Meia Maratona 45km. Inscrições abertas! Parque Expotorres, Torres Vedras.",
    },
    en: {
      title: "Open Torres Vedras XCM BTT 2026",
      description: `# 🚵 Open Torres Vedras XCM BTT 2026

**3rd Edition** of the Open Torres Vedras integrated in the **1st Stage of the Portugal Cup of XCM**! Join us for an epic marathon in the heart of Torres Vedras.

## 🏆 Two Competitive Distances

**Half Marathon:** 45 km - medium difficulty
**Full Marathon:** 70 km - high difficulty

Amateur marathon-style event with official time recording and publishing.

## ✨ Highlights

- **Portugal Cup** - Official 1st Stage of the 2026 season
- **Rural roads and trails** - 90% natural routes
- **Complete classification** - multiple age categories for men and women
- **Competitive atmosphere** - open to federated and non-federated athletes (minimum age 18)

## 🎯 What's Included

- Event participation
- Personal accident insurance
- Front plate and arm bands
- Gifts and souvenirs
- Hot showers after the race
- Liquid and solid refreshments during the course
- Food station at the finish
- Bike wash area
- Individual photos available on official MR3eventus Facebook
- Official timing and classification

**E-bikes are allowed** (recreational only, no classification).

Join us for this great XCM race! 🏅🚴‍♂️`,
      city: "Torres Vedras",
      metaTitle:
        "Open Torres Vedras XCM BTT 2026 | 1st Portugal Cup Stage | March 15",
      metaDescription:
        "3rd Edition Open Torres Vedras XCM BTT - 1st Portugal Cup Stage. Marathon 70km and Half Marathon 45km. Registrations open! Parque Expotorres, Torres Vedras.",
    },
    es: {
      title: "Open Torres Vedras XCM BTT 2026",
      description: `# 🚵 Open Torres Vedras XCM BTT 2026

**3ª Edición** del Open Torres Vedras integrada en la **1ª Etapa de la Copa de Portugal de XCM**! Únete a un maratón épico en el corazón de Torres Vedras.

## 🏆 Dos Distancias Competitivas

**Media Maratón:** 45 km - dificultad media
**Maratón Completo:** 70 km - dificultad alta

Prueba amateur tipo maratón paseo con registro y publicación de tiempos oficiales.

## ✨ Aspectos Destacados

- **Copa de Portugal** - 1ª Etapa oficial de la temporada 2026
- **Caminos rurales y senderos** - 90% rutas naturales
- **Clasificación completa** - múltiples categorías por edades para hombres y mujeres
- **Ambiente competitivo** - abierto a federados y no federados (edad mínima 18 años)

## 🎯 Qué Está Incluido

- Participación en el evento
- Seguro de accidentes personales
- Placa frontal y brazaletes
- Regalos y recuerdos
- Duchas calientes después de la carrera
- Avituallamientos líquidos y sólidos durante el recorrido
- Puesto de comida en la meta
- Área de lavado de bicicletas
- Fotos individuales disponibles en Facebook oficial MR3eventus
- Cronometraje y clasificación oficial

**E-bikes permitidas** (solo recreativo, sin clasificación).

¡Únete a esta gran prueba de XCM! 🏅🚴‍♂️`,
      city: "Torres Vedras",
      metaTitle:
        "Open Torres Vedras XCM BTT 2026 | 1ª Etapa Copa Portugal | 15 Marzo",
      metaDescription:
        "3ª Edición Open Torres Vedras XCM BTT - 1ª Etapa Copa de Portugal. Maratón 70km y Media Maratón 45km. ¡Inscripciones abiertas! Parque Expotorres, Torres Vedras.",
    },
    fr: {
      title: "Open Torres Vedras XCM BTT 2026",
      description: `# 🚵 Open Torres Vedras XCM BTT 2026

**3ème Édition** de l'Open Torres Vedras intégrée dans la **1ère Étape de la Coupe du Portugal de XCM**! Rejoignez-nous pour un marathon épique au cœur de Torres Vedras.

## 🏆 Deux Distances en Compétition

**Semi-Marathon:** 45 km - difficulté moyenne
**Marathon Complet:** 70 km - haute difficulté

Épreuve amateur de type marathon avec enregistrement et publication des temps officiels.

## ✨ Points Forts

- **Coupe du Portugal** - 1ère Étape officielle de la saison 2026
- **Routes rurales et sentiers** - 90% parcours naturels
- **Classification complète** - multiples catégories d'âge pour hommes et femmes
- **Ambiance compétitive** - ouvert aux athlètes fédérés et non-fédérés (âge minimum 18 ans)

## 🎯 Ce Qui Est Inclus

- Participation à l'événement
- Assurance accidents personnels
- Plaque avant et brassards
- Cadeaux et souvenirs
- Douches chaudes après la course
- Ravitaillements liquides et solides sur le parcours
- Poste alimentaire à l'arrivée
- Zone de lavage vélos
- Photos individuelles disponibles sur Facebook officiel MR3eventus
- Chronométrage et classement officiels

**E-bikes autorisés** (récréatif uniquement, pas de classement).

Rejoignez-nous pour cette grande course XCM! 🏅🚴‍♂️`,
      city: "Torres Vedras",
      metaTitle:
        "Open Torres Vedras XCM BTT 2026 | 1ère Étape Coupe Portugal | 15 Mars",
      metaDescription:
        "3ème Édition Open Torres Vedras XCM BTT - 1ère Étape Coupe du Portugal. Marathon 70km et Semi-Marathon 45km. Inscriptions ouvertes! Parque Expotorres, Torres Vedras.",
    },
    de: {
      title: "Open Torres Vedras XCM BTT 2026",
      description: `# 🚵 Open Torres Vedras XCM BTT 2026

**3. Ausgabe** des Open Torres Vedras integriert in die **1. Etappe des Portugal Cups XCM**! Nehmen Sie an einem epischen Marathon im Herzen von Torres Vedras teil.

## 🏆 Zwei Wettkampfdistanzen

**Halbmarathon:** 45 km - mittlerer Schwierigkeitsgrad
**Vollmarathon:** 70 km - hoher Schwierigkeitsgrad

Amateur-Marathon-Event mit offizieller Zeiterfassung und Veröffentlichung.

## ✨ Highlights

- **Portugal Cup** - Offizielle 1. Etappe der Saison 2026
- **Landstraßen und Trails** - 90% natürliche Strecken
- **Vollständige Klassifizierung** - mehrere Alterskategorien für Männer und Frauen
- **Wettkampfatmosphäre** - offen für Verbands- und Nicht-Verbandsathleten (Mindestalter 18 Jahre)

## 🎯 Was Ist Enthalten

- Eventeilnahme
- Unfallversicherung
- Frontplatte und Armbänder
- Geschenke und Souvenirs
- Warme Duschen nach dem Rennen
- Flüssige und feste Verpflegung während der Strecke
- Verpflegungsstation im Ziel
- Fahrradwaschbereich
- Einzelfotos verfügbar auf offiziellem MR3eventus Facebook
- Offizielle Zeitmessung und Klassifizierung

**E-bikes erlaubt** (nur Freizeit, keine Klassifizierung).

Begleiten Sie uns bei diesem großartigen XCM-Rennen! 🏅🚴‍♂️`,
      city: "Torres Vedras",
      metaTitle:
        "Open Torres Vedras XCM BTT 2026 | 1. Etappe Portugal Cup | 15. März",
      metaDescription:
        "3. Ausgabe Open Torres Vedras XCM BTT - 1. Etappe Portugal Cup. Marathon 70km und Halbmarathon 45km. Anmeldungen geöffnet! Parque Expotorres, Torres Vedras.",
    },
    it: {
      title: "Open Torres Vedras XCM BTT 2026",
      description: `# 🚵 Open Torres Vedras XCM BTT 2026

**3a Edizione** dell'Open Torres Vedras integrata nella **1a Tappa della Coppa del Portogallo XCM**! Unisciti a noi per una maratona epica nel cuore di Torres Vedras.

## 🏆 Due Distanze Competitive

**Mezza Maratona:** 45 km - difficoltà media
**Maratona Completa:** 70 km - difficoltà alta

Evento amatoriale tipo maratona con registrazione e pubblicazione dei tempi ufficiali.

## ✨ Punti Salienti

- **Coppa del Portogallo** - 1a Tappa ufficiale della stagione 2026
- **Strade rurali e sentieri** - 90% percorsi naturali
- **Classificazione completa** - multiple categorie per età maschili e femminili
- **Atmosfera competitiva** - aperto ad atleti tesserati e non (età minima 18 anni)

## 🎯 Cosa È Incluso

- Partecipazione all'evento
- Assicurazione infortuni personali
- Piastra frontale e fasce da braccio
- Regali e souvenir
- Docce calde dopo la gara
- Ristori liquidi e solidi durante il percorso
- Postazione alimentare al traguardo
- Area lavaggio biciclette
- Foto individuali disponibili su Facebook ufficiale MR3eventus
- Cronometraggio e classificazione ufficiali

**E-bikes permesse** (solo ricreativo, nessuna classifica).

Unisciti a questa grande gara XCM! 🏅🚴‍♂️`,
      city: "Torres Vedras",
      metaTitle:
        "Open Torres Vedras XCM BTT 2026 | 1a Tappa Coppa Portogallo | 15 Marzo",
      metaDescription:
        "3a Edizione Open Torres Vedras XCM BTT - 1a Tappa Coppa del Portogallo. Maratona 70km e Mezza Maratona 45km. Iscrizioni aperte! Parque Expotorres, Torres Vedras.",
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

  const meiaMaratonaVariant = await findOrCreateVariant({
    name: "Meia Maratona XCM",
    distanceKm: 45,
    elevationGainM: 800,
    elevationLossM: 800,
    startTime: "09:00",
    maxParticipants: 300,
    cutoffTimeHours: 4.5,
    atrpGrade: 2,
    mountainLevel: 2,
    price: 15.0,
    currency: Currency.EUR,
  });

  console.log(`✅ Variant created/updated: ${meiaMaratonaVariant.name}`);

  const maratonaVariant = await findOrCreateVariant({
    name: "Maratona XCM",
    distanceKm: 70,
    elevationGainM: 1400,
    elevationLossM: 1400,
    startTime: "09:00",
    maxParticipants: 300,
    cutoffTimeHours: 7.0,
    atrpGrade: 4,
    mountainLevel: 3,
    price: 18.0,
    currency: Currency.EUR,
  });

  console.log(`✅ Variant created/updated: ${maratonaVariant.name}`);

  // 4. Upsert variant translations (6 languages each)
  const meiaMaratonaTranslations = {
    pt: {
      name: "Meia Maratona XCM - 45km",
      description: `## 🚴 Meia Maratona XCM - 45km

Percurso de dificuldade média ideal para quem procura um desafio equilibrado em BTT cross-country.

### 📊 Características
- **Distância:** 45 km
- **Desnível Estimado:** 800m+
- **Dificuldade Técnica:** Média
- **Dificuldade Física:** Média
- **Tipo de Terreno:** Caminhos rurais e trilhos (90% não asfaltado)

### 🎯 Escalões Disponíveis

**Masculinos:**
- Elites (18-29 anos)
- Masters 30 (30-39 anos)
- Masters 40 (40-49 anos)
- Masters 50 (50-59 anos)
- Masters 60 (+60 anos)

**Femininos:**
- Geral Feminina

Percurso com marcação através de setas vermelhas sobre fundo branco e CAL. Tracks GPX disponibilizados antes do evento.`,
    },
    en: {
      name: "Half Marathon XCM - 45km",
      description: `## 🚴 Half Marathon XCM - 45km

Medium difficulty course ideal for those seeking a balanced MTB cross-country challenge.

### 📊 Characteristics
- **Distance:** 45 km
- **Estimated Elevation:** 800m+
- **Technical Difficulty:** Medium
- **Physical Difficulty:** Medium
- **Terrain Type:** Rural roads and trails (90% unpaved)

### 🎯 Available Categories

**Men:**
- Elite (18-29 years)
- Masters 30 (30-39 years)
- Masters 40 (40-49 years)
- Masters 50 (50-59 years)
- Masters 60 (+60 years)

**Women:**
- General Women

Route marked with red arrows on white background and lime. GPX tracks available before the event.`,
    },
    es: {
      name: "Media Maratón XCM - 45km",
      description: `## 🚴 Media Maratón XCM - 45km

Recorrido de dificultad media ideal para quienes buscan un desafío equilibrado en MTB cross-country.

### 📊 Características
- **Distancia:** 45 km
- **Desnivel Estimado:** 800m+
- **Dificultad Técnica:** Media
- **Dificultad Física:** Media
- **Tipo de Terreno:** Caminos rurales y senderos (90% sin asfaltar)

### 🎯 Categorías Disponibles

**Masculinos:**
- Elite (18-29 años)
- Masters 30 (30-39 años)
- Masters 40 (40-49 años)
- Masters 50 (50-59 años)
- Masters 60 (+60 años)

**Femeninos:**
- General Femenina

Recorrido marcado con flechas rojas sobre fondo blanco y cal. Tracks GPX disponibles antes del evento.`,
    },
    fr: {
      name: "Semi-Marathon XCM - 45km",
      description: `## 🚴 Semi-Marathon XCM - 45km

Parcours de difficulté moyenne idéal pour ceux qui recherchent un défi équilibré en VTT cross-country.

### 📊 Caractéristiques
- **Distance:** 45 km
- **Dénivelé Estimé:** 800m+
- **Difficulté Technique:** Moyenne
- **Difficulté Physique:** Moyenne
- **Type de Terrain:** Routes rurales et sentiers (90% non pavé)

### 🎯 Catégories Disponibles

**Hommes:**
- Elite (18-29 ans)
- Masters 30 (30-39 ans)
- Masters 40 (40-49 ans)
- Masters 50 (50-59 ans)
- Masters 60 (+60 ans)

**Femmes:**
- Général Femmes

Parcours balisé avec flèches rouges sur fond blanc et chaux. Traces GPX disponibles avant l'événement.`,
    },
    de: {
      name: "Halbmarathon XCM - 45km",
      description: `## 🚴 Halbmarathon XCM - 45km

Strecke mit mittlerem Schwierigkeitsgrad, ideal für diejenigen, die eine ausgewogene MTB-Cross-Country-Herausforderung suchen.

### 📊 Eigenschaften
- **Distanz:** 45 km
- **Geschätzter Höhenunterschied:** 800m+
- **Technischer Schwierigkeitsgrad:** Mittel
- **Physischer Schwierigkeitsgrad:** Mittel
- **Geländetyp:** Landstraßen und Trails (90% unbefestigt)

### 🎯 Verfügbare Kategorien

**Männer:**
- Elite (18-29 Jahre)
- Masters 30 (30-39 Jahre)
- Masters 40 (40-49 Jahre)
- Masters 50 (50-59 Jahre)
- Masters 60 (+60 Jahre)

**Frauen:**
- Allgemeine Frauen

Strecke mit roten Pfeilen auf weißem Hintergrund und Kalk markiert. GPX-Tracks vor der Veranstaltung verfügbar.`,
    },
    it: {
      name: "Mezza Maratona XCM - 45km",
      description: `## 🚴 Mezza Maratona XCM - 45km

Percorso di difficoltà media ideale per chi cerca una sfida equilibrata in MTB cross-country.

### 📊 Caratteristiche
- **Distanza:** 45 km
- **Dislivello Stimato:** 800m+
- **Difficoltà Tecnica:** Media
- **Difficoltà Fisica:** Media
- **Tipo di Terreno:** Strade rurali e sentieri (90% non asfaltato)

### 🎯 Categorie Disponibili

**Uomini:**
- Elite (18-29 anni)
- Masters 30 (30-39 anni)
- Masters 40 (40-49 anni)
- Masters 50 (50-59 anni)
- Masters 60 (+60 anni)

**Donne:**
- Generale Donne

Percorso segnato con frecce rosse su sfondo bianco e calce. Tracce GPX disponibili prima dell'evento.`,
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: meiaMaratonaVariant.id,
          language: Language[lang],
        },
      },
      update: meiaMaratonaTranslations[lang],
      create: {
        variantId: meiaMaratonaVariant.id,
        language: Language[lang],
        ...meiaMaratonaTranslations[lang],
      },
    });
  }

  console.log(
    "✅ Meia Maratona variant translations created/updated (6 languages)"
  );

  const maratonaTranslations = {
    pt: {
      name: "Maratona XCM - 70km",
      description: `## 🏔️ Maratona XCM - 70km

Percurso de alta dificuldade para atletas experientes que procuram o verdadeiro desafio de uma maratona XCM.

### 📊 Características
- **Distância:** 70 km (aprox.)
- **Desnível Estimado:** 1400m+
- **Dificuldade Técnica:** Média/Alta
- **Dificuldade Física:** Alta
- **Tipo de Terreno:** Caminhos rurais e trilhos (90% não asfaltado)

### 🎯 Escalões Disponíveis

**Masculinos:**
- Elites (18-29 anos)
- Masters 30 (30-39 anos)
- Masters 40 (40-49 anos)
- Masters 50 (50-59 anos)
- Masters 60 (+60 anos) *mínimo 5 inscritos

**Femininos:**
- Elites (até 39 anos) *mínimo 3 inscritas
- Masters (+40 anos) *mínimo 3 inscritas

### ⚡ Pontos de Destaque

- **Taça de Portugal XCM** - Pontos oficiais para ranking nacional
- **Velocidade mínima** - Controlo de tempos em pontos de divisão
- **Percurso técnico** - Exige experiência e preparação adequada
- **Ambiente competitivo** - Federados e não federados juntos

O percurso está marcado com setas vermelhas sobre fundo branco e CAL. Tracks GPX serão disponibilizados antes do evento.

**Importante:** No ponto de divisão existe hora limite de passagem. Atletas que não cumpram serão direcionados para a Meia Maratona (desclassificação).`,
    },
    en: {
      name: "Full Marathon XCM - 70km",
      description: `## 🏔️ Full Marathon XCM - 70km

High difficulty course for experienced athletes seeking the true challenge of an XCM marathon.

### 📊 Characteristics
- **Distance:** 70 km (approx.)
- **Estimated Elevation:** 1400m+
- **Technical Difficulty:** Medium/High
- **Physical Difficulty:** High
- **Terrain Type:** Rural roads and trails (90% unpaved)

### 🎯 Available Categories

**Men:**
- Elite (18-29 years)
- Masters 30 (30-39 years)
- Masters 40 (40-49 years)
- Masters 50 (50-59 years)
- Masters 60 (+60 years) *minimum 5 registered

**Women:**
- Elite (up to 39 years) *minimum 3 registered
- Masters (+40 years) *minimum 3 registered

### ⚡ Key Highlights

- **Portugal XCM Cup** - Official points for national ranking
- **Minimum speed** - Time control at division points
- **Technical course** - Requires experience and adequate preparation
- **Competitive environment** - Federated and non-federated together

The route is marked with red arrows on white background and lime. GPX tracks will be available before the event.

**Important:** There is a time limit at the division point. Athletes who fail will be directed to the Half Marathon (disqualification).`,
    },
    es: {
      name: "Maratón Completo XCM - 70km",
      description: `## 🏔️ Maratón Completo XCM - 70km

Recorrido de alta dificultad para atletas experimentados que buscan el verdadero desafío de un maratón XCM.

### 📊 Características
- **Distancia:** 70 km (aprox.)
- **Desnivel Estimado:** 1400m+
- **Dificultad Técnica:** Media/Alta
- **Dificultad Física:** Alta
- **Tipo de Terreno:** Caminos rurales y senderos (90% sin asfaltar)

### 🎯 Categorías Disponibles

**Masculinos:**
- Elite (18-29 años)
- Masters 30 (30-39 años)
- Masters 40 (40-49 años)
- Masters 50 (50-59 años)
- Masters 60 (+60 años) *mínimo 5 inscritos

**Femeninos:**
- Elite (hasta 39 años) *mínimo 3 inscritas
- Masters (+40 años) *mínimo 3 inscritas

### ⚡ Aspectos Destacados

- **Copa de Portugal XCM** - Puntos oficiales para ranking nacional
- **Velocidad mínima** - Control de tiempos en puntos de división
- **Recorrido técnico** - Requiere experiencia y preparación adecuada
- **Ambiente competitivo** - Federados y no federados juntos

El recorrido está marcado con flechas rojas sobre fondo blanco y cal. Se proporcionarán tracks GPX antes del evento.

**Importante:** Existe un límite de tiempo en el punto de división. Los atletas que no cumplan serán dirigidos a la Media Maratón (descalificación).`,
    },
    fr: {
      name: "Marathon Complet XCM - 70km",
      description: `## 🏔️ Marathon Complet XCM - 70km

Parcours de haute difficulté pour athlètes expérimentés cherchant le vrai défi d'un marathon XCM.

### 📊 Caractéristiques
- **Distance:** 70 km (env.)
- **Dénivelé Estimé:** 1400m+
- **Difficulté Technique:** Moyenne/Élevée
- **Difficulté Physique:** Élevée
- **Type de Terrain:** Routes rurales et sentiers (90% non pavé)

### 🎯 Catégories Disponibles

**Hommes:**
- Elite (18-29 ans)
- Masters 30 (30-39 ans)
- Masters 40 (40-49 ans)
- Masters 50 (50-59 ans)
- Masters 60 (+60 ans) *minimum 5 inscrits

**Femmes:**
- Elite (jusqu'à 39 ans) *minimum 3 inscrites
- Masters (+40 ans) *minimum 3 inscrites

### ⚡ Points Clés

- **Coupe du Portugal XCM** - Points officiels pour classement national
- **Vitesse minimale** - Contrôle des temps aux points de division
- **Parcours technique** - Requiert expérience et préparation adéquate
- **Environnement compétitif** - Fédérés et non-fédérés ensemble

Le parcours est balisé avec flèches rouges sur fond blanc et chaux. Traces GPX disponibles avant l'événement.

**Important:** Il y a une limite de temps au point de division. Les athlètes qui échouent seront dirigés vers le Semi-Marathon (disqualification).`,
    },
    de: {
      name: "Vollmarathon XCM - 70km",
      description: `## 🏔️ Vollmarathon XCM - 70km

Strecke mit hohem Schwierigkeitsgrad für erfahrene Athleten, die die wahre Herausforderung eines XCM-Marathons suchen.

### 📊 Eigenschaften
- **Distanz:** 70 km (ca.)
- **Geschätzter Höhenunterschied:** 1400m+
- **Technischer Schwierigkeitsgrad:** Mittel/Hoch
- **Physischer Schwierigkeitsgrad:** Hoch
- **Geländetyp:** Landstraßen und Trails (90% unbefestigt)

### 🎯 Verfügbare Kategorien

**Männer:**
- Elite (18-29 Jahre)
- Masters 30 (30-39 Jahre)
- Masters 40 (40-49 Jahre)
- Masters 50 (50-59 Jahre)
- Masters 60 (+60 Jahre) *mindestens 5 Anmeldungen

**Frauen:**
- Elite (bis 39 Jahre) *mindestens 3 Anmeldungen
- Masters (+40 Jahre) *mindestens 3 Anmeldungen

### ⚡ Wichtige Highlights

- **Portugal XCM Cup** - Offizielle Punkte für nationale Rangliste
- **Mindestgeschwindigkeit** - Zeitkontrolle an Teilungspunkten
- **Technische Strecke** - Erfordert Erfahrung und angemessene Vorbereitung
- **Wettkampfumgebung** - Verbands- und Nicht-Verbandsathleten zusammen

Die Strecke ist mit roten Pfeilen auf weißem Hintergrund und Kalk markiert. GPX-Tracks werden vor der Veranstaltung verfügbar sein.

**Wichtig:** Am Teilungspunkt gibt es ein Zeitlimit. Athleten, die es nicht schaffen, werden zum Halbmarathon geleitet (Disqualifikation).`,
    },
    it: {
      name: "Maratona Completa XCM - 70km",
      description: `## 🏔️ Maratona Completa XCM - 70km

Percorso di alta difficoltà per atleti esperti che cercano la vera sfida di una maratona XCM.

### 📊 Caratteristiche
- **Distanza:** 70 km (ca.)
- **Dislivello Stimato:** 1400m+
- **Difficoltà Tecnica:** Media/Alta
- **Difficoltà Fisica:** Alta
- **Tipo di Terreno:** Strade rurali e sentieri (90% non asfaltato)

### 🎯 Categorie Disponibili

**Uomini:**
- Elite (18-29 anni)
- Masters 30 (30-39 anni)
- Masters 40 (40-49 anni)
- Masters 50 (50-59 anni)
- Masters 60 (+60 anni) *minimo 5 iscritti

**Donne:**
- Elite (fino a 39 anni) *minimo 3 iscritte
- Masters (+40 anni) *minimo 3 iscritte

### ⚡ Punti Chiave

- **Coppa del Portogallo XCM** - Punti ufficiali per classifica nazionale
- **Velocità minima** - Controllo tempi ai punti di divisione
- **Percorso tecnico** - Richiede esperienza e preparazione adeguata
- **Ambiente competitivo** - Tesserati e non tesserati insieme

Il percorso è segnato con frecce rosse su sfondo bianco e calce. Tracce GPX saranno disponibili prima dell'evento.

**Importante:** C'è un limite di tempo al punto di divisione. Gli atleti che falliscono saranno indirizzati alla Mezza Maratona (squalifica).`,
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: maratonaVariant.id,
          language: Language[lang],
        },
      },
      update: maratonaTranslations[lang],
      create: {
        variantId: maratonaVariant.id,
        language: Language[lang],
        ...maratonaTranslations[lang],
      },
    });
  }

  console.log("✅ Maratona variant translations created/updated (6 languages)");

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

  await findOrCreatePricingPhase("Inscrição Geral", {
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    endDate: new Date("2026-03-10T23:59:00.000Z"),
    price: 15.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Inscrição para Maratona ou Meia Maratona",
  });

  console.log("✅ Pricing phases created/updated");

  console.log(
    "\n🎉 Open Torres Vedras XCM BTT 2026 seed completed successfully!"
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
