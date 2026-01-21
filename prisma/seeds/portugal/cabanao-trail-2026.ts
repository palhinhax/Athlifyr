import { PrismaClient, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function seedCabanaoTrail() {
  console.log("🌟 Seeding Cabanão Trail 2.0 - 2026...");

  // Event dates
  const eventDates = {
    main: {
      startDate: new Date("2026-02-01T09:15:00Z"),
      endDate: new Date("2026-02-01T14:00:00Z"),
    },
  };

  // Translations for all 6 languages
  const translations = {
    pt: {
      title: "Cabanão Trail 2.0",
      description: `**Cabanão Trail 2.0 - Nova versão, novos desafios!**

Evento desportivo organizado pela secção de trail do Clube Domus Nostra, com imagem renovada e percursos que prometem surpreender!

## 🏃 As Provas

### Trail 21 km
- **Circuito:** Série 100 da ATRP (Circuito Nacional de Trail Sprint)
- **Idade mínima:** 18 anos
- **Partida:** 09:15
- **Tempo limite:** 4h30

### Trail 14 km
- **Circuito:** CDTRC (Circuito Distrital de Trail Running de Coimbra)
- **Idade mínima:** 16 anos
- **Partida:** 09:30
- **Tempo limite:** 4h00

### Caminhada 10 km
- **Caráter:** Recreativo
- **Idade:** Todas as idades (menores acompanhados)
- **Partida:** 09:45
- **Tempo limite:** 4h00

## 🏆 Prémios

**Classificação Geral:**
- Troféus para os 3 primeiros M/F em cada prova

**Por Escalão:**
- Medalhas para os 3 primeiros M/F em cada escalão

**Equipas:**
- Troféus para as 3 melhores equipas M/F (soma das posições dos 3 primeiros)

**Km Mais Rápido:**
- Troféu para M/F com último km mais rápido

## 📦 O que está incluído

**Trails 21km e 14km:**
- Dorsal personalizado com chip
- Meias
- Seguro de acidentes
- Abastecimentos
- Prémio finisher
- Banho no local
- Almoço (sopa + bifana + bebida + sobremesa)

**Caminhada 10km:**
- Dorsal personalizado
- Sweat
- Brindes
- Seguro de acidentes
- Abastecimentos
- Prémio finisher
- Banho no local
- Almoço (sopa + bifana + bebida + sobremesa)

## ⚙️ Equipamento Obrigatório (Trails)

**Obrigatório** (desclassificação): Dorsal

**Obrigatório** (penalização 15 min): Telemóvel ativo, apito, manta térmica

**Recomendado:** Corta-vento/impermeável, água, reserva alimentar

## 📍 Informações Práticas

**Levantamento de Dorsais:**
- Sábado, 31 janeiro: 15h00-19h00
- Domingo, 1 fevereiro: a partir das 07h00

**Local:** Sede do Clube Domus Nostra, Portomar

**Nota Importante:**
- A organização não disponibiliza copos ou garrafas - traga o seu recipiente!
- Menores de 18 anos nas provas competitivas precisam de termo de responsabilidade

## 🌲 Compromisso Ambiental

Respeite o meio ambiente, não deixe lixo e proteja o património natural. Desclassificação em caso de incumprimento.`,
      city: "Portomar, Soure",
      metaTitle:
        "Cabanão Trail 2.0 - 2026 | 1 Fevereiro | Portomar, Soure, Coimbra",
      metaDescription:
        "Cabanão Trail 2.0 - 1 de fevereiro de 2026 em Portomar, Soure. Trail 21km (Série 100 ATRP), Trail 14km (CDTRC) e Caminhada 10km. Organização Clube Domus Nostra. Novos percursos e desafios!",
    },
    en: {
      title: "Cabanão Trail 2.0",
      description: `**Cabanão Trail 2.0 - New version, new challenges!**

Sports event organized by the trail section of Clube Domus Nostra, with renewed image and routes that promise to surprise!

## 🏃 The Races

### Trail 21 km
- **Circuit:** ATRP Series 100 (National Trail Sprint Circuit)
- **Minimum age:** 18 years
- **Start:** 09:15
- **Time limit:** 4h30

### Trail 14 km
- **Circuit:** CDTRC (Coimbra District Trail Running Circuit)
- **Minimum age:** 16 years
- **Start:** 09:30
- **Time limit:** 4h00

### Hiking 10 km
- **Type:** Recreational
- **Age:** All ages (minors accompanied)
- **Start:** 09:45
- **Time limit:** 4h00

## 🏆 Prizes

**Overall Classification:**
- Trophies for top 3 M/F in each race

**By Age Group:**
- Medals for top 3 M/F in each category

**Teams:**
- Trophies for top 3 teams M/F (sum of top 3 positions)

**Fastest Km:**
- Trophy for M/F with fastest last km

## 📦 What's Included

**Trails 21km and 14km:**
- Personalized bib with chip
- Socks
- Accident insurance
- Aid stations
- Finisher prize
- Shower on site
- Lunch (soup + bifana + drink + dessert)

**Hiking 10km:**
- Personalized bib
- Sweatshirt
- Gifts
- Accident insurance
- Aid stations
- Finisher prize
- Shower on site
- Lunch (soup + bifana + drink + dessert)

## ⚙️ Mandatory Equipment (Trails)

**Mandatory** (disqualification): Bib

**Mandatory** (15 min penalty): Active phone, whistle, thermal blanket

**Recommended:** Windbreaker/waterproof, water, food reserve

## 📍 Practical Information

**Bib Collection:**
- Saturday, January 31: 15:00-19:00
- Sunday, February 1: from 07:00

**Location:** Clube Domus Nostra headquarters, Portomar

**Important Note:**
- Organization does not provide cups or bottles - bring your own container!
- Minors under 18 in competitive races need parental consent form

## 🌲 Environmental Commitment

Respect the environment, leave no trash and protect natural heritage. Disqualification for non-compliance.`,
      city: "Portomar, Soure",
      metaTitle:
        "Cabanão Trail 2.0 - 2026 | 1 February | Portomar, Soure, Coimbra",
      metaDescription:
        "Cabanão Trail 2.0 - February 1, 2026 in Portomar, Soure. Trail 21km (ATRP Series 100), Trail 14km (CDTRC) and Hiking 10km. Organized by Clube Domus Nostra. New routes and challenges!",
    },
    es: {
      title: "Cabanão Trail 2.0",
      description: `**Cabanão Trail 2.0 - ¡Nueva versión, nuevos desafíos!**

Evento deportivo organizado por la sección de trail del Clube Domus Nostra, con imagen renovada y recorridos que prometen sorprender!

## 🏃 Las Carreras

### Trail 21 km
- **Circuito:** Serie 100 ATRP (Circuito Nacional de Trail Sprint)
- **Edad mínima:** 18 años
- **Salida:** 09:15
- **Tiempo límite:** 4h30

### Trail 14 km
- **Circuito:** CDTRC (Circuito Distrital de Trail Running de Coimbra)
- **Edad mínima:** 16 años
- **Salida:** 09:30
- **Tiempo límite:** 4h00

### Caminata 10 km
- **Tipo:** Recreativo
- **Edad:** Todas las edades (menores acompañados)
- **Salida:** 09:45
- **Tiempo límite:** 4h00

## 🏆 Premios

**Clasificación General:**
- Trofeos para los 3 primeros M/F en cada carrera

**Por Categoría:**
- Medallas para los 3 primeros M/F en cada categoría

**Equipos:**
- Trofeos para los 3 mejores equipos M/F (suma de las 3 primeras posiciones)

**Km Más Rápido:**
- Trofeo para M/F con último km más rápido

## 📦 Qué está Incluido

**Trails 21km y 14km:**
- Dorsal personalizado con chip
- Calcetines
- Seguro de accidentes
- Avituallamientos
- Premio finisher
- Ducha en el lugar
- Almuerzo (sopa + bifana + bebida + postre)

**Caminata 10km:**
- Dorsal personalizado
- Sudadera
- Regalos
- Seguro de accidentes
- Avituallamientos
- Premio finisher
- Ducha en el lugar
- Almuerzo (sopa + bifana + bebida + postre)

## ⚙️ Equipamiento Obligatorio (Trails)

**Obligatorio** (descalificación): Dorsal

**Obligatorio** (penalización 15 min): Teléfono activo, silbato, manta térmica

**Recomendado:** Cortavientos/impermeable, agua, reserva alimentaria

## 📍 Información Práctica

**Recogida de Dorsales:**
- Sábado, 31 enero: 15:00-19:00
- Domingo, 1 febrero: desde las 07:00

**Ubicación:** Sede del Clube Domus Nostra, Portomar

**Nota Importante:**
- ¡La organización no proporciona vasos o botellas - traiga su propio recipiente!
- Menores de 18 años en carreras competitivas necesitan consentimiento parental

## 🌲 Compromiso Ambiental

Respete el medio ambiente, no deje basura y proteja el patrimonio natural. Descalificación por incumplimiento.`,
      city: "Portomar, Soure",
      metaTitle:
        "Cabanão Trail 2.0 - 2026 | 1 Febrero | Portomar, Soure, Coimbra",
      metaDescription:
        "Cabanão Trail 2.0 - 1 de febrero de 2026 en Portomar, Soure. Trail 21km (Serie 100 ATRP), Trail 14km (CDTRC) y Caminata 10km. Organización Clube Domus Nostra. ¡Nuevos recorridos y desafíos!",
    },
    fr: {
      title: "Cabanão Trail 2.0",
      description: `**Cabanão Trail 2.0 - Nouvelle version, nouveaux défis !**

Événement sportif organisé par la section trail du Clube Domus Nostra, avec une image renouvelée et des parcours qui promettent de surprendre !

## 🏃 Les Courses

### Trail 21 km
- **Circuit :** Série 100 ATRP (Circuit National de Trail Sprint)
- **Âge minimum :** 18 ans
- **Départ :** 09:15
- **Limite de temps :** 4h30

### Trail 14 km
- **Circuit :** CDTRC (Circuit District de Trail Running de Coimbra)
- **Âge minimum :** 16 ans
- **Départ :** 09:30
- **Limite de temps :** 4h00

### Randonnée 10 km
- **Type :** Récréatif
- **Âge :** Tous âges (mineurs accompagnés)
- **Départ :** 09:45
- **Limite de temps :** 4h00

## 🏆 Prix

**Classement Général :**
- Trophées pour les 3 premiers H/F dans chaque course

**Par Catégorie :**
- Médailles pour les 3 premiers H/F dans chaque catégorie

**Équipes :**
- Trophées pour les 3 meilleures équipes H/F (somme des 3 premières positions)

**Km Le Plus Rapide :**
- Trophée pour H/F avec dernier km le plus rapide

## 📦 Ce qui est Inclus

**Trails 21km et 14km :**
- Dossard personnalisé avec puce
- Chaussettes
- Assurance accident
- Ravitaillements
- Prix finisher
- Douche sur place
- Déjeuner (soupe + bifana + boisson + dessert)

**Randonnée 10km :**
- Dossard personnalisé
- Sweat
- Cadeaux
- Assurance accident
- Ravitaillements
- Prix finisher
- Douche sur place
- Déjeuner (soupe + bifana + boisson + dessert)

## ⚙️ Équipement Obligatoire (Trails)

**Obligatoire** (disqualification) : Dossard

**Obligatoire** (pénalité 15 min) : Téléphone actif, sifflet, couverture thermique

**Recommandé :** Coupe-vent/imperméable, eau, réserve alimentaire

## 📍 Informations Pratiques

**Retrait des Dossards :**
- Samedi 31 janvier : 15:00-19:00
- Dimanche 1 février : à partir de 07:00

**Lieu :** Siège du Clube Domus Nostra, Portomar

**Note Importante :**
- L'organisation ne fournit pas de gobelets ou bouteilles - apportez votre propre récipient !
- Mineurs de moins de 18 ans dans les courses compétitives ont besoin d'un consentement parental

## 🌲 Engagement Environnemental

Respectez l'environnement, ne laissez pas de déchets et protégez le patrimoine naturel. Disqualification en cas de non-respect.`,
      city: "Portomar, Soure",
      metaTitle:
        "Cabanão Trail 2.0 - 2026 | 1 Février | Portomar, Soure, Coimbra",
      metaDescription:
        "Cabanão Trail 2.0 - 1 février 2026 à Portomar, Soure. Trail 21km (Série 100 ATRP), Trail 14km (CDTRC) et Randonnée 10km. Organisation Clube Domus Nostra. Nouveaux parcours et défis !",
    },
    de: {
      title: "Cabanão Trail 2.0",
      description: `**Cabanão Trail 2.0 - Neue Version, neue Herausforderungen!**

Sportveranstaltung organisiert von der Trail-Sektion des Clube Domus Nostra, mit neuem Image und Strecken, die versprechen zu überraschen!

## 🏃 Die Rennen

### Trail 21 km
- **Circuit:** ATRP Serie 100 (Nationale Trail Sprint Circuit)
- **Mindestalter:** 18 Jahre
- **Start:** 09:15
- **Zeitlimit:** 4h30

### Trail 14 km
- **Circuit:** CDTRC (Coimbra Distrikt Trail Running Circuit)
- **Mindestalter:** 16 Jahre
- **Start:** 09:30
- **Zeitlimit:** 4h00

### Wandern 10 km
- **Art:** Erholsam
- **Alter:** Alle Altersgruppen (Minderjährige begleitet)
- **Start:** 09:45
- **Zeitlimit:** 4h00

## 🏆 Preise

**Gesamtwertung:**
- Trophäen für Top 3 M/W in jedem Rennen

**Nach Altersklasse:**
- Medaillen für Top 3 M/W in jeder Kategorie

**Teams:**
- Trophäen für Top 3 Teams M/W (Summe der Top 3 Positionen)

**Schnellster Km:**
- Trophäe für M/W mit schnellstem letzten km

## 📦 Was ist Enthalten

**Trails 21km und 14km:**
- Personalisierte Startnummer mit Chip
- Socken
- Unfallversicherung
- Verpflegungsstationen
- Finisher-Preis
- Dusche vor Ort
- Mittagessen (Suppe + Bifana + Getränk + Dessert)

**Wandern 10km:**
- Personalisierte Startnummer
- Sweatshirt
- Geschenke
- Unfallversicherung
- Verpflegungsstationen
- Finisher-Preis
- Dusche vor Ort
- Mittagessen (Suppe + Bifana + Getränk + Dessert)

## ⚙️ Pflichtausrüstung (Trails)

**Pflicht** (Disqualifikation): Startnummer

**Pflicht** (15 Min. Strafe): Aktives Telefon, Pfeife, Thermodecke

**Empfohlen:** Windjacke/wasserdicht, Wasser, Lebensmittelreserve

## 📍 Praktische Informationen

**Startnummernausgabe:**
- Samstag, 31. Januar: 15:00-19:00
- Sonntag, 1. Februar: ab 07:00

**Ort:** Clube Domus Nostra Hauptsitz, Portomar

**Wichtiger Hinweis:**
- Die Organisation stellt keine Becher oder Flaschen zur Verfügung - bringen Sie Ihren eigenen Behälter mit!
- Minderjährige unter 18 Jahren bei Wettkampfrennen benötigen elterliche Einwilligung

## 🌲 Umweltverpflichtung

Respektieren Sie die Umwelt, hinterlassen Sie keinen Müll und schützen Sie das Naturerbe. Disqualifikation bei Nichteinhaltung.`,
      city: "Portomar, Soure",
      metaTitle:
        "Cabanão Trail 2.0 - 2026 | 1. Februar | Portomar, Soure, Coimbra",
      metaDescription:
        "Cabanão Trail 2.0 - 1. Februar 2026 in Portomar, Soure. Trail 21km (ATRP Serie 100), Trail 14km (CDTRC) und Wandern 10km. Organisation Clube Domus Nostra. Neue Strecken und Herausforderungen!",
    },
    it: {
      title: "Cabanão Trail 2.0",
      description: `**Cabanão Trail 2.0 - Nuova versione, nuove sfide!**

Evento sportivo organizzato dalla sezione trail del Clube Domus Nostra, con immagine rinnovata e percorsi che promettono di sorprendere!

## 🏃 Le Gare

### Trail 21 km
- **Circuito:** Serie 100 ATRP (Circuito Nazionale Trail Sprint)
- **Età minima:** 18 anni
- **Partenza:** 09:15
- **Tempo limite:** 4h30

### Trail 14 km
- **Circuito:** CDTRC (Circuito Distrettuale Trail Running di Coimbra)
- **Età minima:** 16 anni
- **Partenza:** 09:30
- **Tempo limite:** 4h00

### Trekking 10 km
- **Tipo:** Ricreativo
- **Età:** Tutte le età (minori accompagnati)
- **Partenza:** 09:45
- **Tempo limite:** 4h00

## 🏆 Premi

**Classifica Generale:**
- Trofei per i primi 3 M/F in ogni gara

**Per Categoria:**
- Medaglie per i primi 3 M/F in ogni categoria

**Squadre:**
- Trofei per le prime 3 squadre M/F (somma delle prime 3 posizioni)

**Km Più Veloce:**
- Trofeo per M/F con ultimo km più veloce

## 📦 Cosa è Incluso

**Trails 21km e 14km:**
- Pettorale personalizzato con chip
- Calzini
- Assicurazione infortuni
- Ristori
- Premio finisher
- Doccia sul posto
- Pranzo (zuppa + bifana + bevanda + dessert)

**Trekking 10km:**
- Pettorale personalizzato
- Felpa
- Omaggi
- Assicurazione infortuni
- Ristori
- Premio finisher
- Doccia sul posto
- Pranzo (zuppa + bifana + bevanda + dessert)

## ⚙️ Attrezzatura Obbligatoria (Trails)

**Obbligatoria** (squalifica): Pettorale

**Obbligatoria** (penalità 15 min): Telefono attivo, fischietto, coperta termica

**Raccomandata:** Giacca a vento/impermeabile, acqua, riserva alimentare

## 📍 Informazioni Pratiche

**Ritiro Pettorali:**
- Sabato, 31 gennaio: 15:00-19:00
- Domenica, 1 febbraio: dalle 07:00

**Luogo:** Sede del Clube Domus Nostra, Portomar

**Nota Importante:**
- L'organizzazione non fornisce bicchieri o bottiglie - portare il proprio contenitore!
- I minori di 18 anni nelle gare competitive necessitano del consenso dei genitori

## 🌲 Impegno Ambientale

Rispettare l'ambiente, non lasciare rifiuti e proteggere il patrimonio naturale. Squalifica in caso di inadempienza.`,
      city: "Portomar, Soure",
      metaTitle:
        "Cabanão Trail 2.0 - 2026 | 1 Febbraio | Portomar, Soure, Coimbra",
      metaDescription:
        "Cabanão Trail 2.0 - 1 febbraio 2026 a Portomar, Soure. Trail 21km (Serie 100 ATRP), Trail 14km (CDTRC) e Trekking 10km. Organizzazione Clube Domus Nostra. Nuovi percorsi e sfide!",
    },
  };

  // Upsert the event
  const event = await prisma.event.upsert({
    where: {
      slug: "cabanao-trail-2026",
    },
    update: {
      title: translations.pt.title,
      description:
        "Trail 21km (Série 100 ATRP), Trail 14km (CDTRC) e Caminhada 10km",
      city: translations.pt.city,
      sportTypes: ["TRAIL", "WALKING"],
      isFeatured: false,
      startDate: eventDates.main.startDate,
      endDate: eventDates.main.endDate,
      latitude: 40.0514,
      longitude: -8.6264,
      country: "PT",
      externalUrl: "https://meutempo.pt/prova?cabanaotrail2",
      imageUrl:
        "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&h=630&fit=crop",
    },
    create: {
      slug: "cabanao-trail-2026",
      title: translations.pt.title,
      description:
        "Trail 21km (Série 100 ATRP), Trail 14km (CDTRC) e Caminhada 10km",
      city: translations.pt.city,
      sportTypes: ["TRAIL", "WALKING"],
      isFeatured: false,
      startDate: eventDates.main.startDate,
      endDate: eventDates.main.endDate,
      latitude: 40.0514,
      longitude: -8.6264,
      country: "PT",
      externalUrl: "https://meutempo.pt/prova?cabanaotrail2",
      imageUrl:
        "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&h=630&fit=crop",
    },
  });

  console.log(`✅ Event created/updated: ${event.slug}`);

  // Create translations for all 6 languages
  console.log("🌍 Creating translations for all languages...");

  for (const [lang, content] of Object.entries(translations)) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: lang as Language,
        },
      },
      update: {
        title: content.title,
        description: content.description,
        city: content.city,
        metaTitle: content.metaTitle,
        metaDescription: content.metaDescription,
      },
      create: {
        eventId: event.id,
        language: lang as Language,
        title: content.title,
        description: content.description,
        city: content.city,
        metaTitle: content.metaTitle,
        metaDescription: content.metaDescription,
      },
    });
    console.log(`   ✅ Translation created: ${lang}`);
  }

  // Delete existing variants and pricing phases to ensure clean state
  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

  await prisma.eventVariant.deleteMany({
    where: { eventId: event.id },
  });

  console.log("💰 Creating variants and pricing phases...");

  // Define variants
  const variants = [
    {
      name: "Trail 21 km",
      distanceKm: 21,
      startDate: new Date("2026-02-01T09:15:00Z"),
      price: 20.0,
      currency: "EUR" as const,
      description: "Circuito Nacional de Trail Sprint – Série 100 da ATRP",
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-11-01T00:00:00Z"),
          endDate: new Date("2025-12-25T23:59:59Z"),
          price: 17.0,
          currency: "EUR",
          note: "Inscrição antecipada",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2025-12-26T00:00:00Z"),
          endDate: new Date("2026-01-25T23:59:59Z"),
          price: 20.0,
          currency: "EUR",
          note: "Inscrição normal",
        },
      ],
    },
    {
      name: "Trail 14 km",
      distanceKm: 14,
      startDate: new Date("2026-02-01T09:30:00Z"),
      price: 17.0,
      currency: "EUR" as const,
      description: "CDTRC – Circuito Distrital de Trail Running de Coimbra",
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-11-01T00:00:00Z"),
          endDate: new Date("2025-12-25T23:59:59Z"),
          price: 14.0,
          currency: "EUR",
          note: "Inscrição antecipada",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2025-12-26T00:00:00Z"),
          endDate: new Date("2026-01-25T23:59:59Z"),
          price: 17.0,
          currency: "EUR",
          note: "Inscrição normal",
        },
      ],
    },
    {
      name: "Trail 14 km (ADAC)",
      distanceKm: 14,
      startDate: new Date("2026-02-01T09:30:00Z"),
      price: 15.5,
      currency: "EUR" as const,
      description: "Tarifa especial para membros ADAC",
      pricingPhases: [
        {
          name: "1ª Fase ADAC",
          startDate: new Date("2025-11-01T00:00:00Z"),
          endDate: new Date("2025-12-25T23:59:59Z"),
          price: 12.5,
          currency: "EUR",
          note: "Inscrição antecipada ADAC",
        },
        {
          name: "2ª Fase ADAC",
          startDate: new Date("2025-12-26T00:00:00Z"),
          endDate: new Date("2026-01-25T23:59:59Z"),
          price: 15.5,
          currency: "EUR",
          note: "Inscrição normal ADAC",
        },
      ],
    },
    {
      name: "Caminhada 10 km",
      distanceKm: 10,
      startDate: new Date("2026-02-01T09:45:00Z"),
      price: 14.0,
      currency: "EUR" as const,
      description: "Caminhada recreativa para todas as idades",
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-11-01T00:00:00Z"),
          endDate: new Date("2025-12-25T23:59:59Z"),
          price: 12.0,
          currency: "EUR",
          note: "Inscrição antecipada",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2025-12-26T00:00:00Z"),
          endDate: new Date("2026-01-25T23:59:59Z"),
          price: 14.0,
          currency: "EUR",
          note: "Inscrição normal",
        },
      ],
    },
  ];

  for (const variantData of variants) {
    const { pricingPhases, ...variantInfo } = variantData;

    const variant = await prisma.eventVariant.create({
      data: {
        ...variantInfo,
        eventId: event.id,
      },
    });

    console.log(`✅ Created variant: ${variant.name}`);

    // Create pricing phases linked to eventId (not variantId)
    for (const phase of pricingPhases) {
      await prisma.pricingPhase.create({
        data: {
          eventId: event.id, // ✅ CORRECT: linked to eventId
          name: `${variant.name} - ${phase.name}`,
          startDate: phase.startDate,
          endDate: phase.endDate,
          price: phase.price,
          currency: phase.currency as Currency,
          note: phase.note,
        },
      });
    }

    console.log(`   - Created ${pricingPhases.length} pricing phase(s)`);
  }

  console.log("✅ Cabanão Trail 2.0 - 2026 seeded successfully!");
}

seedCabanaoTrail()
  .catch((e) => {
    console.error("❌ Error seeding Cabanão Trail:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
