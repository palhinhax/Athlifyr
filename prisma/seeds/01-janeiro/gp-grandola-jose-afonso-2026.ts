import { PrismaClient, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function seedGPGrandola() {
  console.log("🌟 Seeding GP de Grândola - Circuito José Afonso 2026...");

  // Event dates
  const eventDates = {
    main: {
      startDate: new Date("2026-01-25T10:30:00Z"),
      endDate: new Date("2026-01-25T12:30:00Z"),
    },
  };

  // Translations for all 6 languages
  const translations = {
    pt: {
      title: "GP de Grândola - Circuito José Afonso",
      description: `**22ª edição do GP de Grândola - Circuito José Afonso**

Uma das provas mais emblemáticas do atletismo nacional regressa a 25 de janeiro de 2026!

## 🏃 A Prova

Corrida de **10 km** pelas ruas históricas de Grândola, numa prova que faz história no atletismo português.

## 🎯 Percurso

Partida e chegada no **Complexo Desportivo Municipal José Afonso**, com um percurso técnico que passa pelos principais pontos da cidade, incluindo:
- Avenida António Inácio da Cruz
- Largo Catarina Eufémia
- Rotunda da Arreigota
- Estrada das Murteiras

## 🏆 Prémios

**Prémios Individuais Seniores:**
- 1º lugar: 200€ + Troféu
- 2º lugar: 120€ + Troféu
- 3º lugar: 100€ + Troféu

**Prémios Individuais Veteranos:**
- 1º lugar: 70€ + Troféu
- 2º lugar: 50€ + Troféu
- 3º lugar: 30€ + Troféu

**Prémios Coletivos:**
- Troféus às 5 primeiras equipas

**Prémios Especiais:**
- 10 primeiros classificados residentes no concelho de Grândola
- Atleta mais velho residente na Freguesia de Grândola

## 📦 Kit do Participante

- Dorsal com chip cronométrico
- T-shirt técnica
- Lembrança para todos os finishers

## 🚰 Abastecimentos

- Posto de abastecimento aos 5 km (Água Vimeiro)
- Posto final (Água Vimeiro)

## ℹ️ Informações Importantes

- Idade mínima: 18 anos
- Levantamento de dorsais: dia 25, das 8h30 às 10h00
- Bengaleiro disponível
- Seguro de acidentes incluído

Junta-te a nós e vive o ambiente único que só Grândola sabe oferecer!`,
      city: "Grândola",
      metaTitle:
        "GP de Grândola - Circuito José Afonso 2026 | 25 Janeiro | Grândola, Setúbal",
      metaDescription:
        "GP de Grândola - Circuito José Afonso 2026 - 22ª edição a 25 de janeiro em Grândola, Setúbal. Corrida de 10km com prémios monetários até 200€. Prova emblemática do atletismo nacional.",
    },
    en: {
      title: "Grândola GP - José Afonso Circuit",
      description: `**22nd edition of Grândola GP - José Afonso Circuit**

One of the most emblematic races in Portuguese athletics returns on January 25, 2026!

## 🏃 The Race

**10 km** race through the historic streets of Grândola, a race that makes history in Portuguese athletics.

## 🎯 Course

Start and finish at **José Afonso Municipal Sports Complex**, with a technical course passing through the main points of the city, including:
- António Inácio da Cruz Avenue
- Catarina Eufémia Square
- Arreigota Roundabout
- Murteiras Road

## 🏆 Prizes

**Senior Individual Prizes:**
- 1st place: €200 + Trophy
- 2nd place: €120 + Trophy
- 3rd place: €100 + Trophy

**Veterans Individual Prizes:**
- 1st place: €70 + Trophy
- 2nd place: €50 + Trophy
- 3rd place: €30 + Trophy

**Team Prizes:**
- Trophies for the top 5 teams

**Special Prizes:**
- Top 10 residents of Grândola municipality
- Oldest athlete resident in Grândola Parish

## 📦 Participant Kit

- Race bib with timing chip
- Technical t-shirt
- Souvenir for all finishers

## 🚰 Aid Stations

- Aid station at 5 km (Vimeiro Water)
- Finish line aid station (Vimeiro Water)

## ℹ️ Important Information

- Minimum age: 18 years
- Bib collection: January 25, 8:30 AM to 10:00 AM
- Coat check available
- Accident insurance included

Join us and experience the unique atmosphere that only Grândola can offer!`,
      city: "Grândola",
      metaTitle:
        "Grândola GP - José Afonso Circuit 2026 | 25 January | Grândola, Setúbal",
      metaDescription:
        "Grândola GP - José Afonso Circuit 2026 - 22nd edition on 25 January in Grândola, Setúbal. 10km race with cash prizes up to €200. Emblematic race of Portuguese athletics.",
    },
    es: {
      title: "GP de Grândola - Circuito José Afonso",
      description: `**22ª edición del GP de Grândola - Circuito José Afonso**

¡Una de las carreras más emblemáticas del atletismo portugués regresa el 25 de enero de 2026!

## 🏃 La Carrera

Carrera de **10 km** por las calles históricas de Grândola, una carrera que hace historia en el atletismo portugués.

## 🎯 Recorrido

Salida y llegada en el **Complejo Deportivo Municipal José Afonso**, con un recorrido técnico que pasa por los principales puntos de la ciudad, incluyendo:
- Avenida António Inácio da Cruz
- Plaza Catarina Eufémia
- Rotonda de Arreigota
- Carretera de Murteiras

## 🏆 Premios

**Premios Individuales Senior:**
- 1º puesto: 200€ + Trofeo
- 2º puesto: 120€ + Trofeo
- 3º puesto: 100€ + Trofeo

**Premios Individuales Veteranos:**
- 1º puesto: 70€ + Trofeo
- 2º puesto: 50€ + Trofeo
- 3º puesto: 30€ + Trofeo

**Premios Colectivos:**
- Trofeos para los 5 primeros equipos

**Premios Especiales:**
- Top 10 residentes del municipio de Grândola
- Atleta más veterano residente en la Parroquia de Grândola

## 📦 Kit del Participante

- Dorsal con chip cronométrico
- Camiseta técnica
- Recuerdo para todos los finishers

## 🚰 Avituallamientos

- Puesto de avituallamiento a los 5 km (Agua Vimeiro)
- Puesto final (Agua Vimeiro)

## ℹ️ Información Importante

- Edad mínima: 18 años
- Recogida de dorsales: día 25, de 8:30 a 10:00
- Guardarropa disponible
- Seguro de accidentes incluido

¡Únete a nosotros y vive el ambiente único que solo Grândola puede ofrecer!`,
      city: "Grândola",
      metaTitle:
        "GP de Grândola - Circuito José Afonso 2026 | 25 Enero | Grândola, Setúbal",
      metaDescription:
        "GP de Grândola - Circuito José Afonso 2026 - 22ª edición el 25 de enero en Grândola, Setúbal. Carrera de 10km con premios monetarios hasta 200€. Carrera emblemática del atletismo portugués.",
    },
    fr: {
      title: "GP de Grândola - Circuit José Afonso",
      description: `**22ème édition du GP de Grândola - Circuit José Afonso**

L'une des courses les plus emblématiques de l'athlétisme portugais revient le 25 janvier 2026 !

## 🏃 La Course

Course de **10 km** dans les rues historiques de Grândola, une course qui fait l'histoire de l'athlétisme portugais.

## 🎯 Parcours

Départ et arrivée au **Complexe Sportif Municipal José Afonso**, avec un parcours technique passant par les principaux points de la ville, notamment :
- Avenue António Inácio da Cruz
- Place Catarina Eufémia
- Rond-point d'Arreigota
- Route de Murteiras

## 🏆 Prix

**Prix Individuels Senior :**
- 1ère place : 200€ + Trophée
- 2ème place : 120€ + Trophée
- 3ème place : 100€ + Trophée

**Prix Individuels Vétérans :**
- 1ère place : 70€ + Trophée
- 2ème place : 50€ + Trophée
- 3ème place : 30€ + Trophée

**Prix Collectifs :**
- Trophées pour les 5 premières équipes

**Prix Spéciaux :**
- Top 10 des résidents de la municipalité de Grândola
- Athlète le plus âgé résidant dans la paroisse de Grândola

## 📦 Kit du Participant

- Dossard avec puce de chronométrage
- T-shirt technique
- Souvenir pour tous les finishers

## 🚰 Ravitaillements

- Poste de ravitaillement à 5 km (Eau Vimeiro)
- Poste final (Eau Vimeiro)

## ℹ️ Informations Importantes

- Âge minimum : 18 ans
- Retrait des dossards : le 25, de 8h30 à 10h00
- Vestiaire disponible
- Assurance accident incluse

Rejoignez-nous et vivez l'atmosphère unique que seul Grândola peut offrir !`,
      city: "Grândola",
      metaTitle:
        "GP de Grândola - Circuit José Afonso 2026 | 25 Janvier | Grândola, Setúbal",
      metaDescription:
        "GP de Grândola - Circuit José Afonso 2026 - 22ème édition le 25 janvier à Grândola, Setúbal. Course de 10km avec prix en espèces jusqu'à 200€. Course emblématique de l'athlétisme portugais.",
    },
    de: {
      title: "GP von Grândola - José Afonso Circuit",
      description: `**22. Ausgabe des GP von Grândola - José Afonso Circuit**

Eines der emblematischsten Rennen der portugiesischen Leichtathletik kehrt am 25. Januar 2026 zurück!

## 🏃 Das Rennen

**10 km** Lauf durch die historischen Straßen von Grândola, ein Rennen, das Geschichte in der portugiesischen Leichtathletik schreibt.

## 🎯 Strecke

Start und Ziel am **José Afonso Sportkomplex**, mit einer technischen Strecke, die durch die Hauptpunkte der Stadt führt, einschließlich:
- António Inácio da Cruz Allee
- Catarina Eufémia Platz
- Arreigota Kreisverkehr
- Murteiras Straße

## 🏆 Preise

**Individuelle Seniorenpreise:**
- 1. Platz: 200€ + Trophäe
- 2. Platz: 120€ + Trophäe
- 3. Platz: 100€ + Trophäe

**Individuelle Veteranenpreise:**
- 1. Platz: 70€ + Trophäe
- 2. Platz: 50€ + Trophäe
- 3. Platz: 30€ + Trophäe

**Mannschaftspreise:**
- Trophäen für die Top 5 Teams

**Sonderpreise:**
- Top 10 Einwohner der Gemeinde Grândola
- Ältester Athlet aus der Pfarrei Grândola

## 📦 Teilnehmerkit

- Startnummer mit Zeitnahme-Chip
- Technisches T-Shirt
- Souvenir für alle Finisher

## 🚰 Verpflegungsstationen

- Verpflegungsstation bei 5 km (Vimeiro Wasser)
- Ziel-Verpflegungsstation (Vimeiro Wasser)

## ℹ️ Wichtige Informationen

- Mindestalter: 18 Jahre
- Startnummernausgabe: 25. Januar, 8:30 bis 10:00 Uhr
- Garderobe verfügbar
- Unfallversicherung enthalten

Schließen Sie sich uns an und erleben Sie die einzigartige Atmosphäre, die nur Grândola bieten kann!`,
      city: "Grândola",
      metaTitle:
        "GP von Grândola - José Afonso Circuit 2026 | 25. Januar | Grândola, Setúbal",
      metaDescription:
        "GP von Grândola - José Afonso Circuit 2026 - 22. Ausgabe am 25. Januar in Grândola, Setúbal. 10km Lauf mit Geldpreisen bis zu 200€. Emblematisches Rennen der portugiesischen Leichtathletik.",
    },
    it: {
      title: "GP di Grândola - Circuito José Afonso",
      description: `**22ª edizione del GP di Grândola - Circuito José Afonso**

Una delle gare più emblematiche dell'atletica portoghese torna il 25 gennaio 2026!

## 🏃 La Gara

Corsa di **10 km** per le strade storiche di Grândola, una gara che fa storia nell'atletica portoghese.

## 🎯 Percorso

Partenza e arrivo al **Complesso Sportivo Municipale José Afonso**, con un percorso tecnico che passa per i principali punti della città, tra cui:
- Viale António Inácio da Cruz
- Piazza Catarina Eufémia
- Rotonda di Arreigota
- Strada di Murteiras

## 🏆 Premi

**Premi Individuali Senior:**
- 1º posto: 200€ + Trofeo
- 2º posto: 120€ + Trofeo
- 3º posto: 100€ + Trofeo

**Premi Individuali Veterani:**
- 1º posto: 70€ + Trofeo
- 2º posto: 50€ + Trofeo
- 3º posto: 30€ + Trofeo

**Premi Collettivi:**
- Trofei per le prime 5 squadre

**Premi Speciali:**
- Top 10 residenti nel comune di Grândola
- Atleta più anziano residente nella parrocchia di Grândola

## 📦 Kit del Partecipante

- Pettorale con chip cronometrico
- Maglietta tecnica
- Ricordo per tutti i finisher

## 🚰 Ristori

- Punto di ristoro a 5 km (Acqua Vimeiro)
- Punto finale (Acqua Vimeiro)

## ℹ️ Informazioni Importanti

- Età minima: 18 anni
- Ritiro pettorali: giorno 25, dalle 8:30 alle 10:00
- Guardaroba disponibile
- Assicurazione infortuni inclusa

Unisciti a noi e vivi l'atmosfera unica che solo Grândola può offrire!`,
      city: "Grândola",
      metaTitle:
        "GP di Grândola - Circuito José Afonso 2026 | 25 Gennaio | Grândola, Setúbal",
      metaDescription:
        "GP di Grândola - Circuito José Afonso 2026 - 22ª edizione il 25 gennaio a Grândola, Setúbal. Corsa di 10km con premi in denaro fino a 200€. Gara emblematica dell'atletica portoghese.",
    },
  };

  // Upsert the event
  const event = await prisma.event.upsert({
    where: {
      slug: "gp-grandola-jose-afonso-2026",
    },
    update: {
      title: translations.pt.title,
      description: "22ª edição do GP de Grândola - Circuito José Afonso",
      city: translations.pt.city,
      sportTypes: ["RUNNING"],
      isFeatured: false,
      startDate: eventDates.main.startDate,
      endDate: eventDates.main.endDate,
      latitude: 38.1747,
      longitude: -8.5729,
      country: "PT",
      externalUrl:
        "https://xistarca.pt/eventos/gpa-de-grandola-circuito-jose-afonso-2026",
      imageUrl:
        "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&h=630&fit=crop",
    },
    create: {
      slug: "gp-grandola-jose-afonso-2026",
      title: translations.pt.title,
      description: "22ª edição do GP de Grândola - Circuito José Afonso",
      city: translations.pt.city,
      sportTypes: ["RUNNING"],
      isFeatured: false,
      startDate: eventDates.main.startDate,
      endDate: eventDates.main.endDate,
      latitude: 38.1747,
      longitude: -8.5729,
      country: "PT",
      externalUrl:
        "https://xistarca.pt/eventos/gpa-de-grandola-circuito-jose-afonso-2026",
      imageUrl:
        "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&h=630&fit=crop",
    },
  });

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

  console.log("💰 Creating variant and pricing phases...");

  // Define variant
  const variantData = {
    name: "Corrida 10km",
    distanceKm: 10,
    startDate: eventDates.main.startDate,
    price: null,
    currency: "EUR" as const,
    pricingPhases: [
      {
        name: "1ª Fase",
        startDate: new Date("2025-11-01T00:00:00Z"),
        endDate: new Date("2025-12-31T23:59:59Z"),
        price: 8.0,
        currency: "EUR",
        note: "Inscrição antecipada",
      },
      {
        name: "2ª Fase",
        startDate: new Date("2026-01-01T00:00:00Z"),
        endDate: new Date("2026-01-20T23:59:59Z"),
        price: 10.0,
        currency: "EUR",
        note: "Inscrição normal",
      },
      {
        name: "3ª Fase",
        startDate: new Date("2026-01-21T00:00:00Z"),
        endDate: new Date("2026-01-24T23:59:59Z"),
        price: 12.0,
        currency: "EUR",
        note: "Inscrição tardia",
      },
    ],
  };

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

  console.log(`   - Created ${pricingPhases.length} pricing phases`);

  console.log(
    "✅ GP de Grândola - Circuito José Afonso 2026 seeded successfully!"
  );
}

seedGPGrandola()
  .catch((e) => {
    console.error("❌ Error seeding GP Grândola:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
