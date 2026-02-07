/**
 * Seed V Rota do Olho do Tordo 2026
 * Complete with translations in all 6 languages
 * 5th edition trail running and hiking event in Alvaiázere, Portugal
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding V Rota do Olho do Tordo 2026...");

  const languages: Language[] = ["pt", "en", "es", "fr", "de", "it"];

  // Step 1: Upsert the event
  const event = await prisma.event.upsert({
    where: { slug: "rota-olho-tordo-2026" },
    update: {
      title: "V Rota do Olho do Tordo 2026",
      description: `## 🏔️ V Rota do Olho do Tordo 2026

**Uma prova de desporto e lazer na envolvente da Nascente do Olho do Tordo!**

A 5ª edição da Rota do Olho do Tordo, organizada pela Câmara Municipal de Alvaiázere, é uma prova não competitiva de Trail Running e Caminhada que percorre trilhos envolventes à nascente do Olho do Tordo.

### 🎯 Conceito

Esta prova promove o **convívio, saúde e bem-estar** dos participantes em associação à prática do desporto de natureza. Não existe cronometragem oficial - apenas relógio de meta!

### 🏃 As Provas

**Trail 14km** - Percurso de trail não cronometrado
- Distância: 14 km
- Desnível positivo: 500m
- Tempo limite: 3h30
- Idade mínima: 16 anos
- Prémios para os 5 primeiros classificados masculinos e femininos

**Caminhada 10km** - Para todos os níveis
- Distância: ~10 km
- Desnível positivo: 170m
- Tempo limite: 3h00
- Menores de 16 anos admitidos com acompanhante adulto
- Não aconselhada a menores de 8 anos

### 📍 Abastecimentos

- 1 posto de abastecimento de sólidos e líquidos
- 2 postos de líquidos
- Abastecimento na META com bifana e sopa incluídos

### ⚠️ Informações Importantes

- **Sem cronometragem oficial** - apenas relógio de meta
- **Dorsal obrigatório** sempre visível na frente
- **Não há corte de trânsito** - respeitar regras de circulação
- **Não há banhos disponíveis**

### 📦 A Inscrição Inclui

- Dorsal
- Abastecimentos durante a prova
- Bifana e sopa no abastecimento de meta`,
      startDate: new Date("2026-02-08T09:30:00.000Z"),
      endDate: new Date("2026-02-08T15:00:00.000Z"),
      city: "Alvaiázere",
      country: "Portugal",
      latitude: 39.8258,
      longitude: -8.3806,
      imageUrl:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=630&fit=crop",
      externalUrl: "https://www.totalcrono.pt/eventos/rotadoolhodotordo2026",
      googleMapsUrl: "https://maps.app.goo.gl/Alvaiazere",
      isFeatured: false,
      sportTypes: [SportType.TRAIL, SportType.WALKING],
      registrationDeadline: new Date("2026-02-01T23:59:59.000Z"),
    },
    create: {
      slug: "rota-olho-tordo-2026",
      title: "V Rota do Olho do Tordo 2026",
      description: `## 🏔️ V Rota do Olho do Tordo 2026

**Uma prova de desporto e lazer na envolvente da Nascente do Olho do Tordo!**

A 5ª edição da Rota do Olho do Tordo, organizada pela Câmara Municipal de Alvaiázere, é uma prova não competitiva de Trail Running e Caminhada que percorre trilhos envolventes à nascente do Olho do Tordo.

### 🎯 Conceito

Esta prova promove o **convívio, saúde e bem-estar** dos participantes em associação à prática do desporto de natureza. Não existe cronometragem oficial - apenas relógio de meta!

### 🏃 As Provas

**Trail 14km** - Percurso de trail não cronometrado
- Distância: 14 km
- Desnível positivo: 500m
- Tempo limite: 3h30
- Idade mínima: 16 anos
- Prémios para os 5 primeiros classificados masculinos e femininos

**Caminhada 10km** - Para todos os níveis
- Distância: ~10 km
- Desnível positivo: 170m
- Tempo limite: 3h00
- Menores de 16 anos admitidos com acompanhante adulto
- Não aconselhada a menores de 8 anos

### 📍 Abastecimentos

- 1 posto de abastecimento de sólidos e líquidos
- 2 postos de líquidos
- Abastecimento na META com bifana e sopa incluídos

### ⚠️ Informações Importantes

- **Sem cronometragem oficial** - apenas relógio de meta
- **Dorsal obrigatório** sempre visível na frente
- **Não há corte de trânsito** - respeitar regras de circulação
- **Não há banhos disponíveis**

### 📦 A Inscrição Inclui

- Dorsal
- Abastecimentos durante a prova
- Bifana e sopa no abastecimento de meta`,
      startDate: new Date("2026-02-08T09:30:00.000Z"),
      endDate: new Date("2026-02-08T15:00:00.000Z"),
      city: "Alvaiázere",
      country: "Portugal",
      latitude: 39.8258,
      longitude: -8.3806,
      imageUrl:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=630&fit=crop",
      externalUrl: "https://www.totalcrono.pt/eventos/rotadoolhodotordo2026",
      googleMapsUrl: "https://maps.app.goo.gl/Alvaiazere",
      isFeatured: false,
      sportTypes: [SportType.TRAIL, SportType.WALKING],
      registrationDeadline: new Date("2026-02-01T23:59:59.000Z"),
    },
  });

  console.log(`✅ Created event: ${event.title}`);

  // Step 2: Create translations for all 6 languages
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
      title: "V Rota do Olho do Tordo 2026",
      description: `## 🏔️ V Rota do Olho do Tordo 2026

**Uma prova de desporto e lazer na envolvente da Nascente do Olho do Tordo!**

A 5ª edição da Rota do Olho do Tordo, organizada pela Câmara Municipal de Alvaiázere, é uma prova não competitiva de Trail Running e Caminhada que percorre trilhos envolventes à nascente do Olho do Tordo.

### 🎯 Conceito

Esta prova promove o **convívio, saúde e bem-estar** dos participantes em associação à prática do desporto de natureza. Não existe cronometragem oficial - apenas relógio de meta!

### 🏃 As Provas

**Trail 14km** - Percurso de trail não cronometrado
- Distância: 14 km
- Desnível positivo: 500m
- Tempo limite: 3h30
- Idade mínima: 16 anos
- Prémios para os 5 primeiros classificados masculinos e femininos

**Caminhada 10km** - Para todos os níveis
- Distância: ~10 km
- Desnível positivo: 170m
- Tempo limite: 3h00
- Menores de 16 anos admitidos com acompanhante adulto
- Não aconselhada a menores de 8 anos

### 📍 Abastecimentos

- 1 posto de abastecimento de sólidos e líquidos
- 2 postos de líquidos
- Abastecimento na META com bifana e sopa incluídos

### ⚠️ Informações Importantes

- **Sem cronometragem oficial** - apenas relógio de meta
- **Dorsal obrigatório** sempre visível na frente
- **Não há corte de trânsito** - respeitar regras de circulação
- **Não há banhos disponíveis**

### 📦 A Inscrição Inclui

- Dorsal
- Abastecimentos durante a prova
- Bifana e sopa no abastecimento de meta`,
      city: "Alvaiázere",
      metaTitle:
        "V Rota do Olho do Tordo 2026 - 5ª Edição | Alvaiázere | 8 Fevereiro",
      metaDescription:
        "V Rota do Olho do Tordo 2026 - 5ª edição a 8 de fevereiro em Alvaiázere. Provas não competitivas: Trail 14km (D+500m) e Caminhada 10km (D+170m). Inscrição 8€ inclui dorsal, abastecimentos e bifana.",
    },
    en: {
      title: "5th Rota do Olho do Tordo 2026",
      description: `## 🏔️ 5th Rota do Olho do Tordo 2026

**A leisure and sports event in the surroundings of Olho do Tordo Spring!**

The 5th edition of Rota do Olho do Tordo, organized by Alvaiázere Municipality, is a non-competitive Trail Running and Hiking event through trails surrounding the Olho do Tordo spring.

### 🎯 Concept

This event promotes **socializing, health and well-being** of participants through nature sports. There is no official timing - only a finish line clock!

### 🏃 The Races

**Trail 14km** - Non-timed trail course
- Distance: 14 km
- Elevation gain: 500m
- Time limit: 3h30
- Minimum age: 16 years
- Prizes for top 5 male and female finishers

**Hiking 10km** - For all levels
- Distance: ~10 km
- Elevation gain: 170m
- Time limit: 3h00
- Under 16 admitted with adult companion
- Not recommended for children under 8

### 📍 Aid Stations

- 1 food and drink station
- 2 drink-only stations
- Finish line refreshments with pork sandwich and soup included

### ⚠️ Important Information

- **No official timing** - finish line clock only
- **Bib mandatory** always visible on front
- **No road closures** - respect traffic rules
- **No showers available**

### 📦 Registration Includes

- Race bib
- Aid station refreshments
- Pork sandwich and soup at finish`,
      city: "Alvaiázere",
      metaTitle:
        "5th Rota do Olho do Tordo 2026 | Alvaiázere, Portugal | February 8",
      metaDescription:
        "5th Rota do Olho do Tordo 2026 on February 8 in Alvaiázere. Non-competitive events: Trail 14km (500m D+) and Hiking 10km (170m D+). €8 registration includes bib, refreshments and food.",
    },
    es: {
      title: "V Rota do Olho do Tordo 2026",
      description: `## 🏔️ V Rota do Olho do Tordo 2026

**¡Un evento de deporte y ocio en el entorno del Manantial Olho do Tordo!**

La 5ª edición de la Rota do Olho do Tordo, organizada por el Ayuntamiento de Alvaiázere, es una prueba no competitiva de Trail Running y Senderismo por senderos que rodean el manantial de Olho do Tordo.

### 🎯 Concepto

Este evento promueve la **convivencia, salud y bienestar** de los participantes en asociación con el deporte de naturaleza. ¡No hay cronometraje oficial - solo reloj de meta!

### 🏃 Las Pruebas

**Trail 14km** - Recorrido de trail sin cronometrar
- Distancia: 14 km
- Desnivel positivo: 500m
- Tiempo límite: 3h30
- Edad mínima: 16 años
- Premios para los 5 primeros clasificados masculinos y femeninos

**Senderismo 10km** - Para todos los niveles
- Distancia: ~10 km
- Desnivel positivo: 170m
- Tiempo límite: 3h00
- Menores de 16 años admitidos con acompañante adulto
- No recomendado para menores de 8 años

### 📍 Avituallamientos

- 1 puesto de sólidos y líquidos
- 2 puestos de líquidos
- Avituallamiento en META con bocadillo de cerdo y sopa incluidos

### ⚠️ Información Importante

- **Sin cronometraje oficial** - solo reloj de meta
- **Dorsal obligatorio** siempre visible en el pecho
- **Sin cortes de tráfico** - respetar normas de circulación
- **No hay duchas disponibles**

### 📦 La Inscripción Incluye

- Dorsal
- Avituallamientos durante la prueba
- Bocadillo de cerdo y sopa en meta`,
      city: "Alvaiázere",
      metaTitle:
        "V Rota do Olho do Tordo 2026 - 5ª Edición | Alvaiázere | 8 Febrero",
      metaDescription:
        "V Rota do Olho do Tordo 2026 - 5ª edición el 8 de febrero en Alvaiázere. Pruebas no competitivas: Trail 14km (D+500m) y Senderismo 10km (D+170m). Inscripción 8€ incluye dorsal y avituallamientos.",
    },
    fr: {
      title: "5ème Rota do Olho do Tordo 2026",
      description: `## 🏔️ 5ème Rota do Olho do Tordo 2026

**Un événement de sport et loisir aux abords de la Source Olho do Tordo !**

La 5ème édition de la Rota do Olho do Tordo, organisée par la Municipalité d'Alvaiázere, est une épreuve non compétitive de Trail Running et Randonnée sur les sentiers entourant la source d'Olho do Tordo.

### 🎯 Concept

Cet événement promeut la **convivialité, la santé et le bien-être** des participants en association avec les sports de nature. Pas de chronométrage officiel - seulement une horloge à l'arrivée !

### 🏃 Les Épreuves

**Trail 14km** - Parcours trail non chronométré
- Distance : 14 km
- Dénivelé positif : 500m
- Temps limite : 3h30
- Âge minimum : 16 ans
- Prix pour les 5 premiers hommes et femmes

**Randonnée 10km** - Pour tous les niveaux
- Distance : ~10 km
- Dénivelé positif : 170m
- Temps limite : 3h00
- Moins de 16 ans admis avec accompagnateur adulte
- Non recommandé aux enfants de moins de 8 ans

### 📍 Ravitaillements

- 1 poste de solides et liquides
- 2 postes de liquides
- Ravitaillement à l'arrivée avec sandwich au porc et soupe inclus

### ⚠️ Informations Importantes

- **Pas de chronométrage officiel** - horloge d'arrivée uniquement
- **Dossard obligatoire** toujours visible sur le devant
- **Pas de fermeture de routes** - respecter le code de la route
- **Pas de douches disponibles**

### 📦 L'Inscription Comprend

- Dossard
- Ravitaillements pendant l'épreuve
- Sandwich au porc et soupe à l'arrivée`,
      city: "Alvaiázere",
      metaTitle:
        "5ème Rota do Olho do Tordo 2026 | Alvaiázere, Portugal | 8 Février",
      metaDescription:
        "5ème Rota do Olho do Tordo 2026 le 8 février à Alvaiázere. Épreuves non compétitives : Trail 14km (D+500m) et Randonnée 10km (D+170m). Inscription 8€ inclut dossard et ravitaillements.",
    },
    de: {
      title: "5. Rota do Olho do Tordo 2026",
      description: `## 🏔️ 5. Rota do Olho do Tordo 2026

**Eine Sport- und Freizeitveranstaltung in der Umgebung der Olho do Tordo Quelle!**

Die 5. Ausgabe der Rota do Olho do Tordo, organisiert von der Gemeinde Alvaiázere, ist ein nicht-kompetitives Trail Running und Wanderevent auf Wegen rund um die Olho do Tordo Quelle.

### 🎯 Konzept

Diese Veranstaltung fördert **Geselligkeit, Gesundheit und Wohlbefinden** der Teilnehmer in Verbindung mit Natursport. Es gibt keine offizielle Zeitmessung - nur eine Zieluhr!

### 🏃 Die Rennen

**Trail 14km** - Nicht zeitgemessene Trailstrecke
- Distanz: 14 km
- Höhenmeter: 500m
- Zeitlimit: 3h30
- Mindestalter: 16 Jahre
- Preise für die ersten 5 Männer und Frauen

**Wanderung 10km** - Für alle Niveaus
- Distanz: ~10 km
- Höhenmeter: 170m
- Zeitlimit: 3h00
- Unter 16 Jahren mit erwachsener Begleitung zugelassen
- Nicht empfohlen für Kinder unter 8 Jahren

### 📍 Verpflegungsstationen

- 1 Station mit Essen und Getränken
- 2 Getränkestationen
- Zielverpflegung mit Schweinefleisch-Sandwich und Suppe inklusive

### ⚠️ Wichtige Informationen

- **Keine offizielle Zeitmessung** - nur Zieluhr
- **Startnummer obligatorisch** immer vorne sichtbar
- **Keine Straßensperrungen** - Verkehrsregeln beachten
- **Keine Duschen verfügbar**

### 📦 Die Anmeldung Beinhaltet

- Startnummer
- Verpflegung während des Rennens
- Schweinefleisch-Sandwich und Suppe im Ziel`,
      city: "Alvaiázere",
      metaTitle:
        "5. Rota do Olho do Tordo 2026 | Alvaiázere, Portugal | 8. Februar",
      metaDescription:
        "5. Rota do Olho do Tordo 2026 am 8. Februar in Alvaiázere. Nicht-kompetitive Events: Trail 14km (500m D+) und Wanderung 10km (170m D+). 8€ Anmeldung inkl. Startnummer und Verpflegung.",
    },
    it: {
      title: "5ª Rota do Olho do Tordo 2026",
      description: `## 🏔️ 5ª Rota do Olho do Tordo 2026

**Un evento sportivo e ricreativo nei dintorni della Sorgente Olho do Tordo!**

La 5ª edizione della Rota do Olho do Tordo, organizzata dal Comune di Alvaiázere, è una gara non competitiva di Trail Running e Camminata sui sentieri che circondano la sorgente di Olho do Tordo.

### 🎯 Concetto

Questo evento promuove la **convivialità, salute e benessere** dei partecipanti in associazione con gli sport nella natura. Non c'è cronometraggio ufficiale - solo orologio al traguardo!

### 🏃 Le Gare

**Trail 14km** - Percorso trail non cronometrato
- Distanza: 14 km
- Dislivello positivo: 500m
- Tempo limite: 3h30
- Età minima: 16 anni
- Premi per i primi 5 classificati maschili e femminili

**Camminata 10km** - Per tutti i livelli
- Distanza: ~10 km
- Dislivello positivo: 170m
- Tempo limite: 3h00
- Minori di 16 anni ammessi con accompagnatore adulto
- Non consigliata ai minori di 8 anni

### 📍 Ristori

- 1 punto ristoro con solidi e liquidi
- 2 punti solo liquidi
- Ristoro al traguardo con panino di maiale e zuppa inclusi

### ⚠️ Informazioni Importanti

- **Nessun cronometraggio ufficiale** - solo orologio al traguardo
- **Pettorale obbligatorio** sempre visibile sul petto
- **Nessuna chiusura stradale** - rispettare il codice della strada
- **Docce non disponibili**

### 📦 L'Iscrizione Include

- Pettorale
- Ristori durante la gara
- Panino di maiale e zuppa al traguardo`,
      city: "Alvaiázere",
      metaTitle:
        "5ª Rota do Olho do Tordo 2026 | Alvaiázere, Portogallo | 8 Febbraio",
      metaDescription:
        "5ª Rota do Olho do Tordo 2026 l'8 febbraio ad Alvaiázere. Gare non competitive: Trail 14km (D+500m) e Camminata 10km (D+170m). Iscrizione 8€ include pettorale, ristori e panino.",
    },
  };

  // Upsert translations for all languages
  for (const lang of Object.keys(translations)) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: lang as Language,
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
        language: lang as Language,
        title: translations[lang].title,
        description: translations[lang].description,
        city: translations[lang].city,
        metaTitle: translations[lang].metaTitle,
        metaDescription: translations[lang].metaDescription,
      },
    });
  }

  console.log("✅ Created translations for all 6 languages");

  // Step 3: Delete existing variants and pricing phases for this event
  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

  await prisma.eventVariantTranslation.deleteMany({
    where: { variant: { eventId: event.id } },
  });

  await prisma.eventVariant.deleteMany({
    where: { eventId: event.id },
  });

  // Step 4: Create variants
  console.log("💰 Creating variants...");

  const trail14km = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Trail 14km",
      distanceKm: 14,
      elevationGainM: 500,
      elevationLossM: 500,
      startTime: "09:30",
      cutoffTimeHours: 3.5,
    },
  });

  const caminhada10km = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Caminhada 10km",
      distanceKm: 10,
      elevationGainM: 170,
      elevationLossM: 170,
      startTime: "09:45",
      cutoffTimeHours: 3.0,
    },
  });

  const variants = [trail14km, caminhada10km];

  console.log("🏃 Variants created (2 variants)");

  // Step 5: Upsert variant translations
  const variantTranslations: Record<
    string,
    Record<string, { name: string; description: string }>
  > = {
    "Trail 14km": {
      pt: {
        name: "Trail 14km",
        description:
          "Percurso de trail não cronometrado de 14km com D+500m. Tempo limite de 3h30. Idade mínima 16 anos. Prémios para os 5 primeiros M/F.",
      },
      en: {
        name: "Trail 14km",
        description:
          "Non-timed 14km trail course with 500m elevation gain. 3h30 time limit. Minimum age 16. Prizes for top 5 male and female.",
      },
      es: {
        name: "Trail 14km",
        description:
          "Recorrido de trail sin cronometrar de 14km con D+500m. Límite 3h30. Edad mínima 16 años. Premios para los 5 primeros M/F.",
      },
      fr: {
        name: "Trail 14km",
        description:
          "Parcours trail non chronométré de 14km avec D+500m. Limite 3h30. Âge minimum 16 ans. Prix pour les 5 premiers H/F.",
      },
      de: {
        name: "Trail 14km",
        description:
          "Nicht-zeitgemessene 14km Trailstrecke mit 500m Höhenmeter. 3h30 Zeitlimit. Mindestalter 16. Preise für die Top 5 M/F.",
      },
      it: {
        name: "Trail 14km",
        description:
          "Percorso trail non cronometrato di 14km con D+500m. Limite 3h30. Età minima 16 anni. Premi per i primi 5 M/F.",
      },
    },
    "Caminhada 10km": {
      pt: {
        name: "Caminhada 10km",
        description:
          "Caminhada de 10km com D+170m para todos os níveis. Tempo limite 3h00. Menores de 16 anos com acompanhante adulto.",
      },
      en: {
        name: "Hiking 10km",
        description:
          "10km hike with 170m elevation gain for all levels. 3h time limit. Under 16 with adult companion.",
      },
      es: {
        name: "Senderismo 10km",
        description:
          "Senderismo de 10km con D+170m para todos los niveles. Límite 3h. Menores de 16 con acompañante adulto.",
      },
      fr: {
        name: "Randonnée 10km",
        description:
          "Randonnée de 10km avec D+170m pour tous niveaux. Limite 3h. Moins de 16 ans avec accompagnateur adulte.",
      },
      de: {
        name: "Wanderung 10km",
        description:
          "10km Wanderung mit 170m Höhenmeter für alle Niveaus. 3h Zeitlimit. Unter 16 mit Erwachsenenbegleitung.",
      },
      it: {
        name: "Camminata 10km",
        description:
          "Camminata di 10km con D+170m per tutti i livelli. Limite 3h. Minori di 16 con accompagnatore adulto.",
      },
    },
  };

  for (const variant of variants) {
    for (const lang of languages) {
      await prisma.eventVariantTranslation.upsert({
        where: {
          variantId_language: {
            variantId: variant.id,
            language: lang,
          },
        },
        update: {
          name: variantTranslations[variant.name][lang].name,
          description: variantTranslations[variant.name][lang].description,
        },
        create: {
          variantId: variant.id,
          language: lang,
          name: variantTranslations[variant.name][lang].name,
          description: variantTranslations[variant.name][lang].description,
        },
      });
    }
  }

  console.log("📝 Variant translations upserted for all 2 variants");

  // Step 6: Create pricing phases (using eventId pattern)
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

  // Trail 14km - Fase Única
  await findOrCreatePricingPhase("Trail 14km - Fase Única", {
    startDate: new Date("2025-12-31T00:00:00Z"),
    endDate: new Date("2026-02-01T23:59:59Z"),
    price: 8.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Inclui dorsal, abastecimentos, bifana e sopa na meta.",
  });

  // Caminhada 10km - Fase Única
  await findOrCreatePricingPhase("Caminhada 10km - Fase Única", {
    startDate: new Date("2025-12-31T00:00:00Z"),
    endDate: new Date("2026-02-01T23:59:59Z"),
    price: 8.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Menores de 16 anos com acompanhante adulto. Inclui dorsal, abastecimentos, bifana e sopa na meta.",
  });

  console.log("💰 Pricing phases created (2 phases for 2 variants)");

  // Step 7: Create FAQs
  console.log("❓ Creating FAQs...");

  // Delete existing FAQs for this event
  await prisma.eventFAQTranslation.deleteMany({
    where: { faq: { eventId: event.id } },
  });
  await prisma.eventFAQ.deleteMany({
    where: { eventId: event.id },
  });

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

  // FAQ 1: Há cronometragem oficial?
  const faq1 = await findOrCreateFAQ(
    event.id,
    0,
    "Há cronometragem oficial?",
    "Não existe cronometragem oficial para os participantes do Trail. Existirá apenas relógio de meta, e prémios para os 5 primeiros classificados da geral masculina e feminina. Na Caminhada não há cronometragem nem classificações."
  );

  const faq1Translations = {
    pt: {
      question: "Há cronometragem oficial?",
      answer:
        "Não existe cronometragem oficial para os participantes do Trail. Existirá apenas relógio de meta, e prémios para os 5 primeiros classificados da geral masculina e feminina. Na Caminhada não há cronometragem nem classificações.",
    },
    en: {
      question: "Is there official timing?",
      answer:
        "There is no official timing for Trail participants. There will only be a finish line clock, with prizes for the top 5 male and female finishers. The Hiking event has no timing or classifications.",
    },
    es: {
      question: "¿Hay cronometraje oficial?",
      answer:
        "No hay cronometraje oficial para los participantes del Trail. Solo habrá reloj de meta, con premios para los 5 primeros clasificados masculinos y femeninos. En el Senderismo no hay cronometraje ni clasificaciones.",
    },
    fr: {
      question: "Y a-t-il un chronométrage officiel ?",
      answer:
        "Il n'y a pas de chronométrage officiel pour les participants au Trail. Il y aura seulement une horloge à l'arrivée, avec des prix pour les 5 premiers hommes et femmes. La Randonnée n'a pas de chronométrage ni de classements.",
    },
    de: {
      question: "Gibt es eine offizielle Zeitmessung?",
      answer:
        "Es gibt keine offizielle Zeitmessung für Trail-Teilnehmer. Es wird nur eine Zieluhr geben, mit Preisen für die ersten 5 Männer und Frauen. Die Wanderung hat keine Zeitmessung oder Wertungen.",
    },
    it: {
      question: "C'è cronometraggio ufficiale?",
      answer:
        "Non c'è cronometraggio ufficiale per i partecipanti al Trail. Ci sarà solo un orologio al traguardo, con premi per i primi 5 classificati maschili e femminili. La Camminata non ha cronometraggio né classifiche.",
    },
  };

  for (const lang of languages) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq1.id, language: lang } },
      update: faq1Translations[lang],
      create: { faqId: faq1.id, language: lang, ...faq1Translations[lang] },
    });
  }

  // FAQ 2: Qual a idade mínima?
  const faq2 = await findOrCreateFAQ(
    event.id,
    1,
    "Qual a idade mínima para participar?",
    "No Trail 14km, a idade mínima é 16 anos. Na Caminhada, menores de 16 anos são admitidos desde que acompanhados por um adulto responsável. Não é aconselhada a participação de crianças menores de 8 anos na Caminhada."
  );

  const faq2Translations = {
    pt: {
      question: "Qual a idade mínima para participar?",
      answer:
        "No Trail 14km, a idade mínima é 16 anos. Na Caminhada, menores de 16 anos são admitidos desde que acompanhados por um adulto responsável. Não é aconselhada a participação de crianças menores de 8 anos na Caminhada.",
    },
    en: {
      question: "What is the minimum age to participate?",
      answer:
        "For Trail 14km, the minimum age is 16 years. For Hiking, under 16s are admitted when accompanied by a responsible adult. Participation of children under 8 is not recommended for the Hike.",
    },
    es: {
      question: "¿Cuál es la edad mínima para participar?",
      answer:
        "En el Trail 14km, la edad mínima es 16 años. En el Senderismo, menores de 16 años son admitidos si van acompañados por un adulto responsable. No se aconseja la participación de menores de 8 años en el Senderismo.",
    },
    fr: {
      question: "Quel est l'âge minimum pour participer ?",
      answer:
        "Pour le Trail 14km, l'âge minimum est de 16 ans. Pour la Randonnée, les moins de 16 ans sont admis s'ils sont accompagnés d'un adulte responsable. La participation des enfants de moins de 8 ans n'est pas conseillée pour la Randonnée.",
    },
    de: {
      question: "Was ist das Mindestalter für die Teilnahme?",
      answer:
        "Für Trail 14km beträgt das Mindestalter 16 Jahre. Bei der Wanderung sind unter 16-Jährige zugelassen, wenn sie von einem verantwortlichen Erwachsenen begleitet werden. Die Teilnahme von Kindern unter 8 Jahren wird für die Wanderung nicht empfohlen.",
    },
    it: {
      question: "Qual è l'età minima per partecipare?",
      answer:
        "Per il Trail 14km, l'età minima è 16 anni. Per la Camminata, i minori di 16 anni sono ammessi se accompagnati da un adulto responsabile. La partecipazione di bambini sotto gli 8 anni non è consigliata per la Camminata.",
    },
  };

  for (const lang of languages) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq2.id, language: lang } },
      update: faq2Translations[lang],
      create: { faqId: faq2.id, language: lang, ...faq2Translations[lang] },
    });
  }

  // FAQ 3: O que está incluído na inscrição?
  const faq3 = await findOrCreateFAQ(
    event.id,
    2,
    "O que está incluído na inscrição?",
    "A inscrição inclui: dorsal, abastecimentos ao longo do percurso, e bifana e sopa no abastecimento de meta. Nota: não possuímos banhos disponíveis."
  );

  const faq3Translations = {
    pt: {
      question: "O que está incluído na inscrição?",
      answer:
        "A inscrição inclui: dorsal, abastecimentos ao longo do percurso, e bifana e sopa no abastecimento de meta. Nota: não possuímos banhos disponíveis.",
    },
    en: {
      question: "What is included in the registration?",
      answer:
        "Registration includes: race bib, refreshments along the course, and pork sandwich and soup at the finish line. Note: showers are not available.",
    },
    es: {
      question: "¿Qué incluye la inscripción?",
      answer:
        "La inscripción incluye: dorsal, avituallamientos durante el recorrido, y bocadillo de cerdo y sopa en la meta. Nota: no disponemos de duchas.",
    },
    fr: {
      question: "Qu'est-ce qui est inclus dans l'inscription ?",
      answer:
        "L'inscription comprend : dossard, ravitaillements le long du parcours, et sandwich au porc et soupe à l'arrivée. Note : les douches ne sont pas disponibles.",
    },
    de: {
      question: "Was ist in der Anmeldung enthalten?",
      answer:
        "Die Anmeldung beinhaltet: Startnummer, Verpflegung entlang der Strecke sowie Schweinefleisch-Sandwich und Suppe im Ziel. Hinweis: Duschen sind nicht verfügbar.",
    },
    it: {
      question: "Cosa è incluso nell'iscrizione?",
      answer:
        "L'iscrizione include: pettorale, ristori lungo il percorso, e panino di maiale e zuppa al traguardo. Nota: le docce non sono disponibili.",
    },
  };

  for (const lang of languages) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq3.id, language: lang } },
      update: faq3Translations[lang],
      create: { faqId: faq3.id, language: lang, ...faq3Translations[lang] },
    });
  }

  // FAQ 4: Há corte de trânsito?
  const faq4 = await findOrCreateFAQ(
    event.id,
    3,
    "Há corte de trânsito durante a prova?",
    "Não haverá corte de trânsito rodoviário durante o decorrer da prova. Os participantes deverão obedecer às regras de trânsito e tomar as devidas precauções nos locais de circulação rodoviária. A organização garante presença de membros nos pontos com maior afluência de trânsito."
  );

  const faq4Translations = {
    pt: {
      question: "Há corte de trânsito durante a prova?",
      answer:
        "Não haverá corte de trânsito rodoviário durante o decorrer da prova. Os participantes deverão obedecer às regras de trânsito e tomar as devidas precauções nos locais de circulação rodoviária. A organização garante presença de membros nos pontos com maior afluência de trânsito.",
    },
    en: {
      question: "Are there road closures during the event?",
      answer:
        "There will be no road closures during the event. Participants must obey traffic rules and take appropriate precautions at road crossing points. The organization ensures staff presence at high-traffic points.",
    },
    es: {
      question: "¿Hay cortes de tráfico durante la prueba?",
      answer:
        "No habrá cortes de tráfico durante la prueba. Los participantes deberán obedecer las normas de tráfico y tomar las precauciones necesarias en los puntos de circulación. La organización garantiza presencia en los puntos de mayor tráfico.",
    },
    fr: {
      question: "Y a-t-il des fermetures de routes pendant l'épreuve ?",
      answer:
        "Il n'y aura pas de fermeture de routes pendant l'épreuve. Les participants doivent respecter le code de la route et prendre les précautions appropriées aux points de passage. L'organisation assure une présence aux points à forte circulation.",
    },
    de: {
      question: "Gibt es während der Veranstaltung Straßensperrungen?",
      answer:
        "Während der Veranstaltung gibt es keine Straßensperrungen. Die Teilnehmer müssen die Verkehrsregeln beachten und an Straßenüberquerungen entsprechende Vorsichtsmaßnahmen treffen. Die Organisation stellt Personal an stark befahrenen Punkten bereit.",
    },
    it: {
      question: "Ci sono chiusure stradali durante l'evento?",
      answer:
        "Non ci saranno chiusure stradali durante l'evento. I partecipanti devono rispettare il codice della strada e prendere le dovute precauzioni ai punti di attraversamento. L'organizzazione garantisce presenza nei punti a maggior traffico.",
    },
  };

  for (const lang of languages) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq4.id, language: lang } },
      update: faq4Translations[lang],
      create: { faqId: faq4.id, language: lang, ...faq4Translations[lang] },
    });
  }

  // FAQ 5: Posso ter ajuda externa?
  const faq5 = await findOrCreateFAQ(
    event.id,
    4,
    "Posso ter ajuda externa durante a prova?",
    "Apenas é permitida ajuda externa ou assistência pessoal nos postos de controlo/abastecimento da prova, sendo proibido qualquer apoio fora desses locais, exceto assistência da organização, equipa médica ou bombeiros."
  );

  const faq5Translations = {
    pt: {
      question: "Posso ter ajuda externa durante a prova?",
      answer:
        "Apenas é permitida ajuda externa ou assistência pessoal nos postos de controlo/abastecimento da prova, sendo proibido qualquer apoio fora desses locais, exceto assistência da organização, equipa médica ou bombeiros.",
    },
    en: {
      question: "Can I receive external assistance during the race?",
      answer:
        "External assistance is only allowed at aid stations/checkpoints. Any support outside these locations is prohibited, except for assistance from the organization, medical team, or firefighters.",
    },
    es: {
      question: "¿Puedo recibir ayuda externa durante la carrera?",
      answer:
        "Solo se permite ayuda externa en los puestos de control/avituallamiento. Está prohibido cualquier apoyo fuera de estos lugares, excepto asistencia de la organización, equipo médico o bomberos.",
    },
    fr: {
      question: "Puis-je recevoir de l'aide externe pendant la course ?",
      answer:
        "L'aide externe n'est autorisée qu'aux postes de contrôle/ravitaillement. Toute assistance en dehors de ces lieux est interdite, sauf de la part de l'organisation, de l'équipe médicale ou des pompiers.",
    },
    de: {
      question: "Kann ich während des Rennens externe Hilfe erhalten?",
      answer:
        "Externe Hilfe ist nur an den Verpflegungsstationen/Kontrollpunkten erlaubt. Jegliche Unterstützung außerhalb dieser Orte ist verboten, außer durch die Organisation, das medizinische Team oder die Feuerwehr.",
    },
    it: {
      question: "Posso ricevere assistenza esterna durante la gara?",
      answer:
        "L'assistenza esterna è consentita solo ai punti di controllo/ristoro. Qualsiasi supporto al di fuori di questi luoghi è proibito, eccetto l'assistenza dell'organizzazione, team medico o vigili del fuoco.",
    },
  };

  for (const lang of languages) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq5.id, language: lang } },
      update: faq5Translations[lang],
      create: { faqId: faq5.id, language: lang, ...faq5Translations[lang] },
    });
  }

  // FAQ 6: Há devolução de inscrição?
  const faq6 = await findOrCreateFAQ(
    event.id,
    5,
    "Há devolução do valor de inscrição?",
    "Não serão devolvidas as taxas de inscrição, seja qual for o motivo ou data do pedido de devolução. Para outros casos, contacte a organização."
  );

  const faq6Translations = {
    pt: {
      question: "Há devolução do valor de inscrição?",
      answer:
        "Não serão devolvidas as taxas de inscrição, seja qual for o motivo ou data do pedido de devolução. Para outros casos, contacte a organização.",
    },
    en: {
      question: "Are registration fees refundable?",
      answer:
        "Registration fees are non-refundable, regardless of the reason or date of the refund request. For other cases, contact the organization.",
    },
    es: {
      question: "¿Se devuelve el valor de inscripción?",
      answer:
        "No se devolverán las tasas de inscripción, sea cual sea el motivo o fecha de solicitud. Para otros casos, contacte con la organización.",
    },
    fr: {
      question: "Les frais d'inscription sont-ils remboursables ?",
      answer:
        "Les frais d'inscription ne sont pas remboursables, quelle que soit la raison ou la date de la demande. Pour d'autres cas, contactez l'organisation.",
    },
    de: {
      question: "Werden Anmeldegebühren erstattet?",
      answer:
        "Anmeldegebühren werden nicht erstattet, unabhängig vom Grund oder Datum der Anfrage. Für andere Fälle kontaktieren Sie die Organisation.",
    },
    it: {
      question: "Le quote di iscrizione sono rimborsabili?",
      answer:
        "Le quote di iscrizione non sono rimborsabili, indipendentemente dal motivo o dalla data della richiesta. Per altri casi, contattare l'organizzazione.",
    },
  };

  for (const lang of languages) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq6.id, language: lang } },
      update: faq6Translations[lang],
      create: { faqId: faq6.id, language: lang, ...faq6Translations[lang] },
    });
  }

  console.log("❓ FAQs created (6 FAQs with translations)");

  console.log("\n🎉 V Rota do Olho do Tordo 2026 seeded successfully!");
  console.log("   📍 Location: Alvaiázere, Leiria, Portugal");
  console.log("   📅 Date: February 8, 2026");
  console.log("   🏃 Variants: 2 (Trail 14km, Caminhada 10km)");
  console.log("   🌍 Translations: 6 languages (pt, en, es, fr, de, it)");
  console.log("   💰 Price: 8€ (fase única)");
  console.log("   ❓ FAQs: 6 questions");
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
