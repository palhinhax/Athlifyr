import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 🗽 TCS NEW YORK CITY MARATHON 2026 SEED
 *
 * 📅 Event Date: November 1, 2026
 * 📍 Location: New York City, NY, USA
 * 🏆 Category: Abbott World Marathon Majors
 * 🌍 One of the largest marathons in the world (50,000+ finishers)
 *
 * 🎯 Key Features:
 * - 50th Anniversary Edition
 * - Iconic 5-borough course: Staten Island → Brooklyn → Queens → Bronx → Manhattan
 * - Finish in Central Park
 * - Lottery entry system (200,000+ applications annually)
 * - World Marathon Majors certification
 *
 * 🌐 Official: https://www.nyrr.org/tcsnycmarathon
 */

async function seedTCSNYCMarathon() {
  console.log("🗽 Seeding TCS New York City Marathon 2026...");

  // ============================================================================
  // 🌍 TRANSLATIONS (ALL 6 LANGUAGES - MANDATORY)
  // ============================================================================

  const translations = {
    pt: {
      title: "TCS New York City Marathon",
      description: `# 🗽 TCS New York City Marathon 2026 – 50ª Edição

A **TCS New York City Marathon** é uma das **seis maratonas Abbott World Marathon Majors** e a maior maratona do mundo, com mais de 50.000 finishers anuais. A edição de 2026 marca o **50º aniversário** deste evento icónico.

## 🏃 Percurso Lendário

O percurso atravessa os **cinco boroughs de Nova York**:

- 🚀 **Largada**: Staten Island (Ponte Verrazzano-Narrows)
- 🏘️ **Brooklyn**: Longa secção urbana através de bairros vibrantes
- 🌉 **Queens**: Pontes icónicas e diversidade cultural
- 🏙️ **The Bronx**: Passagem breve mas entusiasta
- 🏁 **Manhattan**: Chegada épica em **Central Park**

## 📋 Como Entrar

### 🎲 Lottery (Sorteio)
- Abertura: **4–25 de fevereiro 2026**
- Mais de **200.000 candidaturas** anuais
- Taxa de sucesso: **2–3%**
- NYRR Members: $255 USD | Non-Members: $315 USD

### ✅ Entrada Garantida
- **Tempos de qualificação** em provas certificadas
- **Programa NYRR 9+1** (completar 9 provas + voluntariado)
- **Pacotes internacionais** com operadoras credenciadas (~$660 USD+)
- **Charity Entry** (angariação mínima $3,000 USD+)

## 🏆 Estatísticas

- **50.000+ finishers** anuais
- **Corredores de elite mundial** + amadores de todos os níveis
- **Cadeiras de rodas e handcycles** bem-vindos
- **Limite de tempo**: 8,5 horas

## 🎯 Detalhes Técnicos

- **Distância**: 42.195 km (26.2 mi)
- **Desnível acumulado**: ~120m
- **Superfície**: Asfalto urbano
- **Abastecimentos**: A cada milha
- **Clima em novembro**: Fresco (8–15°C típico)

## 🌟 Porque é Especial

- **Abbott World Marathon Majors** – uma das seis maratonas mais prestigiadas do mundo
- **Apoio do público incomparável** – milhões de espetadores ao longo do percurso
- **Experiência única** – atravessar os cinco boroughs de Nova York
- **50º aniversário** – edição histórica comemorativa

## 📅 Datas Importantes

- **4–25 fevereiro 2026**: Período de candidatura lottery
- **Março 2026**: Resultados do sorteio
- **1 novembro 2026**: Dia da prova

## 🔗 Informação Oficial

Visita [www.nyrr.org/tcsnycmarathon](https://www.nyrr.org/tcsnycmarathon) para informações completas sobre inscrições, treino e dia da prova.`,
      city: "Nova York, NY",
      metaTitle:
        "TCS New York City Marathon 2026 - 50ª Edição | Nova York | 1 Novembro",
      metaDescription:
        "TCS New York City Marathon 2026 - 50ª edição a 1 de novembro em Nova York. World Marathon Majors. 42.195km através dos cinco boroughs. Lottery: 4-25 fevereiro. +50.000 corredores.",
    },
    en: {
      title: "TCS New York City Marathon",
      description: `# 🗽 TCS New York City Marathon 2026 – 50th Anniversary Edition

The **TCS New York City Marathon** is one of the **six Abbott World Marathon Majors** and the world's largest marathon, with over 50,000 annual finishers. The 2026 edition marks the **50th anniversary** of this iconic event.

## 🏃 Legendary Course

The course crosses all **five boroughs of New York City**:

- 🚀 **Start**: Staten Island (Verrazzano-Narrows Bridge)
- 🏘️ **Brooklyn**: Long urban section through vibrant neighborhoods
- 🌉 **Queens**: Iconic bridges and cultural diversity
- 🏙️ **The Bronx**: Brief but enthusiastic passage
- 🏁 **Manhattan**: Epic finish in **Central Park**

## 📋 How to Enter

### 🎲 Lottery (Non-Guaranteed Entry)
- Application period: **February 4–25, 2026**
- Over **200,000 applications** annually
- Success rate: **2–3%**
- NYRR Members: $255 USD | Non-Members: $315 USD

### ✅ Guaranteed Entry
- **Qualifying times** in certified races
- **NYRR 9+1 Program** (complete 9 races + volunteer)
- **International packages** with certified operators (~$660 USD+)
- **Charity Entry** (minimum fundraising $3,000 USD+)

## 🏆 Statistics

- **50,000+ finishers** annually
- **World-class elite runners** + amateurs of all levels
- **Wheelchairs and handcycles** welcome
- **Time limit**: 8.5 hours

## 🎯 Technical Details

- **Distance**: 42.195 km (26.2 mi)
- **Elevation gain**: ~120m
- **Surface**: Urban asphalt
- **Aid stations**: Every mile
- **November weather**: Cool (8–15°C typical)

## 🌟 Why It's Special

- **Abbott World Marathon Majors** – one of the six most prestigious marathons worldwide
- **Unmatched crowd support** – millions of spectators along the course
- **Unique experience** – crossing all five boroughs of New York City
- **50th anniversary** – historic commemorative edition

## 📅 Important Dates

- **February 4–25, 2026**: Lottery application period
- **March 2026**: Lottery results
- **November 1, 2026**: Race day

## 🔗 Official Information

Visit [www.nyrr.org/tcsnycmarathon](https://www.nyrr.org/tcsnycmarathon) for complete information on registration, training, and race day.`,
      city: "New York, NY",
      metaTitle:
        "TCS New York City Marathon 2026 - 50th Edition | New York | November 1",
      metaDescription:
        "TCS New York City Marathon 2026 - 50th edition on November 1 in New York City. World Marathon Majors. 42.195km through five boroughs. Lottery: Feb 4-25. 50,000+ runners.",
    },
    es: {
      title: "TCS New York City Marathon",
      description: `# 🗽 TCS New York City Marathon 2026 – 50ª Edición Aniversario

La **TCS New York City Marathon** es una de las **seis Abbott World Marathon Majors** y el maratón más grande del mundo, con más de 50.000 finishers anuales. La edición 2026 marca el **50º aniversario** de este evento icónico.

## 🏃 Recorrido Legendario

El recorrido atraviesa los **cinco distritos de Nueva York**:

- 🚀 **Salida**: Staten Island (Puente Verrazzano-Narrows)
- 🏘️ **Brooklyn**: Larga sección urbana a través de barrios vibrantes
- 🌉 **Queens**: Puentes icónicos y diversidad cultural
- 🏙️ **The Bronx**: Paso breve pero entusiasta
- 🏁 **Manhattan**: Final épico en **Central Park**

## 📋 Cómo Inscribirse

### 🎲 Sorteo (Lottery)
- Periodo de solicitud: **4–25 de febrero 2026**
- Más de **200.000 solicitudes** anuales
- Tasa de éxito: **2–3%**
- Miembros NYRR: $255 USD | No miembros: $315 USD

### ✅ Entrada Garantizada
- **Tiempos de clasificación** en carreras certificadas
- **Programa NYRR 9+1** (completar 9 carreras + voluntariado)
- **Paquetes internacionales** con operadores certificados (~$660 USD+)
- **Entrada benéfica** (recaudación mínima $3,000 USD+)

## 🏆 Estadísticas

- **50.000+ finishers** anuales
- **Corredores de élite mundial** + amateurs de todos los niveles
- **Sillas de ruedas y handcycles** bienvenidos
- **Límite de tiempo**: 8,5 horas

## 🎯 Detalles Técnicos

- **Distancia**: 42.195 km (26.2 mi)
- **Desnivel acumulado**: ~120m
- **Superficie**: Asfalto urbano
- **Avituallamientos**: Cada milla
- **Clima en noviembre**: Fresco (8–15°C típico)

## 🌟 Por Qué es Especial

- **Abbott World Marathon Majors** – uno de los seis maratones más prestigiosos del mundo
- **Apoyo del público incomparable** – millones de espectadores a lo largo del recorrido
- **Experiencia única** – cruzar los cinco distritos de Nueva York
- **50º aniversario** – edición histórica conmemorativa

## 📅 Fechas Importantes

- **4–25 febrero 2026**: Periodo de solicitud sorteo
- **Marzo 2026**: Resultados del sorteo
- **1 noviembre 2026**: Día de la carrera

## 🔗 Información Oficial

Visita [www.nyrr.org/tcsnycmarathon](https://www.nyrr.org/tcsnycmarathon) para información completa sobre inscripciones, entrenamiento y día de carrera.`,
      city: "Nueva York, NY",
      metaTitle:
        "TCS New York City Marathon 2026 - 50ª Edición | Nueva York | 1 Noviembre",
      metaDescription:
        "TCS New York City Marathon 2026 - 50ª edición el 1 de noviembre en Nueva York. World Marathon Majors. 42.195km por cinco distritos. Sorteo: 4-25 febrero. +50.000 corredores.",
    },
    fr: {
      title: "TCS New York City Marathon",
      description: `# 🗽 TCS New York City Marathon 2026 – 50e Édition Anniversaire

Le **TCS New York City Marathon** est l'un des **six Abbott World Marathon Majors** et le plus grand marathon au monde, avec plus de 50 000 finishers annuels. L'édition 2026 marque le **50e anniversaire** de cet événement emblématique.

## 🏃 Parcours Légendaire

Le parcours traverse les **cinq arrondissements de New York** :

- 🚀 **Départ** : Staten Island (Pont Verrazzano-Narrows)
- 🏘️ **Brooklyn** : Longue section urbaine à travers des quartiers vibrants
- 🌉 **Queens** : Ponts iconiques et diversité culturelle
- 🏙️ **The Bronx** : Passage bref mais enthousiaste
- 🏁 **Manhattan** : Arrivée épique à **Central Park**

## 📋 Comment S'inscrire

### 🎲 Tirage au Sort (Lottery)
- Période de candidature : **4–25 février 2026**
- Plus de **200 000 candidatures** annuelles
- Taux de succès : **2–3%**
- Membres NYRR : 255 $ USD | Non-membres : 315 $ USD

### ✅ Entrée Garantie
- **Temps de qualification** dans des courses certifiées
- **Programme NYRR 9+1** (compléter 9 courses + bénévolat)
- **Forfaits internationaux** avec opérateurs certifiés (~660 $ USD+)
- **Entrée caritative** (collecte minimum 3 000 $ USD+)

## 🏆 Statistiques

- **50 000+ finishers** annuels
- **Coureurs d'élite mondiaux** + amateurs de tous niveaux
- **Fauteuils roulants et handcycles** bienvenus
- **Limite de temps** : 8,5 heures

## 🎯 Détails Techniques

- **Distance** : 42,195 km (26,2 mi)
- **Dénivelé positif** : ~120m
- **Surface** : Asphalte urbain
- **Ravitaillements** : Chaque mile
- **Météo en novembre** : Frais (8–15°C typique)

## 🌟 Pourquoi C'est Spécial

- **Abbott World Marathon Majors** – l'un des six marathons les plus prestigieux au monde
- **Soutien du public incomparable** – des millions de spectateurs le long du parcours
- **Expérience unique** – traverser les cinq arrondissements de New York
- **50e anniversaire** – édition historique commémorative

## 📅 Dates Importantes

- **4–25 février 2026** : Période de candidature tirage au sort
- **Mars 2026** : Résultats du tirage au sort
- **1er novembre 2026** : Jour de course

## 🔗 Informations Officielles

Visitez [www.nyrr.org/tcsnycmarathon](https://www.nyrr.org/tcsnycmarathon) pour des informations complètes sur l'inscription, l'entraînement et le jour de course.`,
      city: "New York, NY",
      metaTitle:
        "TCS New York City Marathon 2026 - 50e Édition | New York | 1er Novembre",
      metaDescription:
        "TCS New York City Marathon 2026 - 50e édition le 1er novembre à New York. World Marathon Majors. 42,195km à travers cinq arrondissements. Tirage : 4-25 février. +50 000 coureurs.",
    },
    de: {
      title: "TCS New York City Marathon",
      description: `# 🗽 TCS New York City Marathon 2026 – 50. Jubiläumsausgabe

Der **TCS New York City Marathon** ist einer der **sechs Abbott World Marathon Majors** und der größte Marathon der Welt mit über 50.000 jährlichen Finishern. Die Ausgabe 2026 markiert das **50. Jubiläum** dieses ikonischen Events.

## 🏃 Legendäre Strecke

Die Strecke durchquert alle **fünf Stadtbezirke von New York City**:

- 🚀 **Start**: Staten Island (Verrazzano-Narrows-Brücke)
- 🏘️ **Brooklyn**: Langer urbaner Abschnitt durch lebendige Viertel
- 🌉 **Queens**: Ikonische Brücken und kulturelle Vielfalt
- 🏙️ **The Bronx**: Kurzer aber enthusiastischer Durchgang
- 🏁 **Manhattan**: Episches Finish im **Central Park**

## 📋 Wie man sich anmeldet

### 🎲 Verlosung (Lottery)
- Bewerbungszeitraum: **4.–25. Februar 2026**
- Über **200.000 Bewerbungen** jährlich
- Erfolgsquote: **2–3%**
- NYRR-Mitglieder: 255 $ USD | Nicht-Mitglieder: 315 $ USD

### ✅ Garantierter Startplatz
- **Qualifikationszeiten** in zertifizierten Rennen
- **NYRR 9+1 Programm** (9 Rennen + Freiwilligenarbeit absolvieren)
- **Internationale Pakete** mit zertifizierten Anbietern (~660 $ USD+)
- **Charity-Eintritt** (Mindestspendenziel 3.000 $ USD+)

## 🏆 Statistiken

- **50.000+ Finisher** jährlich
- **Weltklasse-Elite-Läufer** + Amateure aller Leistungsstufen
- **Rollstühle und Handcycles** willkommen
- **Zeitlimit**: 8,5 Stunden

## 🎯 Technische Details

- **Distanz**: 42,195 km (26,2 mi)
- **Höhenunterschied**: ~120m
- **Untergrund**: Städtischer Asphalt
- **Verpflegungsstationen**: Jede Meile
- **November-Wetter**: Kühl (8–15°C typisch)

## 🌟 Warum es Besonders ist

- **Abbott World Marathon Majors** – einer der sechs prestigeträchtigsten Marathons weltweit
- **Unvergleichliche Zuschauerunterstützung** – Millionen von Zuschauern entlang der Strecke
- **Einzigartiges Erlebnis** – alle fünf Stadtbezirke von New York durchqueren
- **50. Jubiläum** – historische Gedenkausgabe

## 📅 Wichtige Termine

- **4.–25. Februar 2026**: Bewerbungszeitraum Verlosung
- **März 2026**: Verlosungsergebnisse
- **1. November 2026**: Renntag

## 🔗 Offizielle Informationen

Besuchen Sie [www.nyrr.org/tcsnycmarathon](https://www.nyrr.org/tcsnycmarathon) für vollständige Informationen zu Anmeldung, Training und Renntag.`,
      city: "New York, NY",
      metaTitle:
        "TCS New York City Marathon 2026 - 50. Ausgabe | New York | 1. November",
      metaDescription:
        "TCS New York City Marathon 2026 - 50. Ausgabe am 1. November in New York City. World Marathon Majors. 42,195km durch fünf Stadtbezirke. Verlosung: 4.-25. Feb. +50.000 Läufer.",
    },
    it: {
      title: "TCS New York City Marathon",
      description: `# 🗽 TCS New York City Marathon 2026 – 50ª Edizione Anniversario

La **TCS New York City Marathon** è una delle **sei Abbott World Marathon Majors** e la maratona più grande al mondo, con oltre 50.000 finisher annuali. L'edizione 2026 segna il **50º anniversario** di questo evento iconico.

## 🏃 Percorso Leggendario

Il percorso attraversa tutti i **cinque distretti di New York City**:

- 🚀 **Partenza**: Staten Island (Ponte Verrazzano-Narrows)
- 🏘️ **Brooklyn**: Lunga sezione urbana attraverso quartieri vivaci
- 🌉 **Queens**: Ponti iconici e diversità culturale
- 🏙️ **The Bronx**: Passaggio breve ma entusiasta
- 🏁 **Manhattan**: Arrivo epico a **Central Park**

## 📋 Come Iscriversi

### 🎲 Sorteggio (Lottery)
- Periodo di candidatura: **4–25 febbraio 2026**
- Oltre **200.000 candidature** annuali
- Tasso di successo: **2–3%**
- Membri NYRR: 255 $ USD | Non membri: 315 $ USD

### ✅ Iscrizione Garantita
- **Tempi di qualificazione** in gare certificate
- **Programma NYRR 9+1** (completare 9 gare + volontariato)
- **Pacchetti internazionali** con operatori certificati (~660 $ USD+)
- **Iscrizione benefica** (raccolta fondi minima 3.000 $ USD+)

## 🏆 Statistiche

- **50.000+ finisher** annuali
- **Corridori d'élite mondiali** + amatori di tutti i livelli
- **Sedie a rotelle e handcycle** benvenuti
- **Limite di tempo**: 8,5 ore

## 🎯 Dettagli Tecnici

- **Distanza**: 42,195 km (26,2 mi)
- **Dislivello positivo**: ~120m
- **Superficie**: Asfalto urbano
- **Ristori**: Ogni miglio
- **Meteo di novembre**: Fresco (8–15°C tipico)

## 🌟 Perché è Speciale

- **Abbott World Marathon Majors** – una delle sei maratone più prestigiose al mondo
- **Supporto del pubblico incomparabile** – milioni di spettatori lungo il percorso
- **Esperienza unica** – attraversare tutti i cinque distretti di New York City
- **50º anniversario** – edizione storica commemorativa

## 📅 Date Importanti

- **4–25 febbraio 2026**: Periodo di candidatura sorteggio
- **Marzo 2026**: Risultati del sorteggio
- **1º novembre 2026**: Giorno della gara

## 🔗 Informazioni Ufficiali

Visita [www.nyrr.org/tcsnycmarathon](https://www.nyrr.org/tcsnycmarathon) per informazioni complete su iscrizione, allenamento e giorno della gara.`,
      city: "New York, NY",
      metaTitle:
        "TCS New York City Marathon 2026 - 50ª Edizione | New York | 1º Novembre",
      metaDescription:
        "TCS New York City Marathon 2026 - 50ª edizione il 1º novembre a New York City. World Marathon Majors. 42,195km attraverso cinque distretti. Sorteggio: 4-25 feb. +50.000 corridori.",
    },
  };

  // ============================================================================
  // 📦 CREATE EVENT
  // ============================================================================

  const event = await prisma.event.upsert({
    where: { slug: "tcs-nyc-marathon-2026" },
    update: {},
    create: {
      slug: "tcs-nyc-marathon-2026",
      title: "TCS New York City Marathon 2026", // Fallback title
      description: "The world's largest marathon - 50th Anniversary Edition", // Fallback description
      sportTypes: ["RUNNING"],
      startDate: new Date("2026-11-01T14:00:00Z"), // 10:00 AM EST (14:00 UTC)
      city: "New York",
      country: "United States",
      registrationDeadline: new Date("2026-10-15T23:59:59Z"),
      latitude: 40.785091,
      longitude: -73.968285,
      googleMapsUrl:
        "https://www.google.com/maps/place/Central+Park,+New+York,+NY,+USA",
      externalUrl: "https://www.nyrr.org/tcsnycmarathon",
      imageUrl:
        "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=1200&h=600&fit=crop", // NYC skyline
      isFeatured: true,
    },
  });

  console.log(`✅ Event created: ${event.slug}`);

  // ============================================================================
  // 🌍 CREATE TRANSLATIONS (ALL 6 LANGUAGES - MANDATORY)
  // ============================================================================

  console.log("🌍 Creating translations for all 6 languages...");

  const languages = ["pt", "en", "es", "fr", "de", "it"] as const;

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
        metaTitle: translations[lang].metaDescription,
        metaDescription: translations[lang].metaDescription,
      },
    });

    console.log(`   ✅ Translation created: ${lang.toUpperCase()}`);
  }

  // ============================================================================
  // 💰 CREATE VARIANT & PRICING PHASES
  // ============================================================================

  console.log("🏃 Creating event variant...");

  // Helper function to find or create variant
  const findOrCreateVariant = async (
    name: string,
    data: {
      description: string | null;
      distanceKm: number | null;
      elevationGainM: number | null;
      startDate: Date;
      startTime: string | null;
      cutoffTimeHours: number | null;
      price: number | null;
      currency: "USD";
      maxParticipants: number | null;
    }
  ) => {
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

  const marathonVariant = await findOrCreateVariant(
    "Full Marathon (42.195 km)",
    {
      description:
        "Full 42.195km marathon through all five boroughs of New York City. Entry via lottery, guaranteed entry, or charity. Minimum age: 18 years. Time limit: 8.5 hours.",
      distanceKm: 42,
      elevationGainM: 120,
      startDate: new Date("2026-11-01T14:00:00Z"), // 10:00 AM EST
      startTime: "10:00 AM",
      cutoffTimeHours: 8.5,
      price: 255.0, // Base NYRR member price
      currency: "USD",
      maxParticipants: 55000,
    }
  );

  console.log(`✅ Created variant: ${marathonVariant.name}`);

  // Create variant translations for all 6 languages
  console.log("🌍 Creating variant translations...");

  const variantTranslations = {
    pt: {
      name: "Maratona Completa (42,195 km)",
      description:
        "Maratona completa de 42,195km através dos cinco boroughs de Nova York. Entrada via sorteio, entrada garantida ou caridade. Idade mínima: 18 anos. Tempo limite: 8,5 horas.",
    },
    en: {
      name: "Full Marathon (42.195 km)",
      description:
        "Full 42.195km marathon through all five boroughs of New York City. Entry via lottery, guaranteed entry, or charity. Minimum age: 18 years. Time limit: 8.5 hours.",
    },
    es: {
      name: "Maratón Completo (42,195 km)",
      description:
        "Maratón completo de 42,195km a través de los cinco distritos de Nueva York. Entrada vía sorteo, entrada garantizada o benéfica. Edad mínima: 18 años. Tiempo límite: 8,5 horas.",
    },
    fr: {
      name: "Marathon Complet (42,195 km)",
      description:
        "Marathon complet de 42,195km à travers les cinq arrondissements de New York. Entrée par tirage au sort, entrée garantie ou caritative. Âge minimum : 18 ans. Limite de temps : 8,5 heures.",
    },
    de: {
      name: "Vollständiger Marathon (42,195 km)",
      description:
        "Vollständiger Marathon von 42,195km durch alle fünf Stadtbezirke von New York City. Eintritt per Verlosung, garantierter Eintritt oder Wohltätigkeit. Mindestalter: 18 Jahre. Zeitlimit: 8,5 Stunden.",
    },
    it: {
      name: "Maratona Completa (42,195 km)",
      description:
        "Maratona completa di 42,195km attraverso tutti i cinque distretti di New York City. Iscrizione tramite sorteggio, iscrizione garantita o beneficenza. Età minima: 18 anni. Tempo limite: 8,5 ore.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"]) {
    const trans = variantTranslations[lang as keyof typeof variantTranslations];
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: marathonVariant.id,
          language: lang as "pt" | "en" | "es" | "fr" | "de" | "it",
        },
      },
      update: {
        name: trans.name,
        description: trans.description,
      },
      create: {
        variantId: marathonVariant.id,
        language: lang as "pt" | "en" | "es" | "fr" | "de" | "it",
        name: trans.name,
        description: trans.description,
      },
    });

    console.log(`   ✅ Created ${lang.toUpperCase()} variant translation`);
  }

  // Create pricing phases
  console.log("💰 Creating pricing phases...");

  // Delete existing pricing phases to avoid duplicates
  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

  const pricingPhases = [
    {
      name: "NYRR Member - Lottery Entry",
      startDate: new Date("2026-02-04T00:00:00Z"),
      endDate: new Date("2026-02-25T23:59:59Z"),
      price: 255.0,
      currency: "USD" as const,
      note: "NYRR members only. Lottery application period. Entry fee charged only if selected.",
    },
    {
      name: "Non-Member - Lottery Entry",
      startDate: new Date("2026-02-04T00:00:00Z"),
      endDate: new Date("2026-02-25T23:59:59Z"),
      price: 315.0,
      currency: "USD" as const,
      note: "Non-members. Lottery application period. Entry fee charged only if selected.",
    },
    {
      name: "Guaranteed Entry Package",
      startDate: new Date("2026-01-15T00:00:00Z"),
      endDate: new Date("2026-09-30T23:59:59Z"),
      price: 660.0,
      currency: "USD" as const,
      note: "Guaranteed entry through International Travel Partners. Includes race entry + package services.",
    },
    {
      name: "Charity Entry",
      startDate: new Date("2026-01-15T00:00:00Z"),
      endDate: new Date("2026-10-15T23:59:59Z"),
      price: 3000.0,
      currency: "USD" as const,
      note: "Fundraising minimum for charity partners. Guaranteed entry with fundraising commitment.",
    },
  ];

  for (const phase of pricingPhases) {
    await prisma.pricingPhase.create({
      data: {
        eventId: event.id, // ✅ CORRECT: linked to eventId
        name: phase.name,
        startDate: phase.startDate,
        endDate: phase.endDate,
        price: phase.price,
        currency: phase.currency,
        note: phase.note,
      },
    });

    console.log(`   💵 Created pricing phase: ${phase.name}`);
  }

  // ============================================================================
  // ✅ SUMMARY
  // ============================================================================

  console.log(
    "\n🎉 TCS New York City Marathon 2026 seed completed successfully!"
  );
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`📅 Event Date: November 1, 2026`);
  console.log(`📍 Location: New York City, NY, USA`);
  console.log(`🏆 Category: Abbott World Marathon Majors`);
  console.log(
    `🌍 Translations: ${languages.length} languages (pt, en, es, fr, de, it)`
  );
  console.log(`🏃 Variants: 1 (Full Marathon)`);
  console.log(
    `💰 Pricing Phases: 4 (NYRR Member, Non-Member, Guaranteed Entry, Charity)`
  );
  console.log(`🔗 URL: https://athlifyr.com/events/${event.slug}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

// ============================================================================
// 🚀 EXECUTE SEED
// ============================================================================

seedTCSNYCMarathon()
  .catch((error) => {
    console.error("❌ Error seeding TCS NYC Marathon 2026:", error);
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
