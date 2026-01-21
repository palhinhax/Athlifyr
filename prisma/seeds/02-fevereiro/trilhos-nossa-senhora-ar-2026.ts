import { PrismaClient, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function seedTrilhosNossaSenhoraAr() {
  console.log("🌟 Seeding Trilhos Nossa Senhora do Ar 2026...");

  // Event dates
  const eventDates = {
    main: {
      startDate: new Date("2026-02-01T09:00:00Z"),
      endDate: new Date("2026-02-01T18:00:00Z"),
    },
  };

  // Translations for all 6 languages
  const translations = {
    pt: {
      title: "Trilhos Nossa Senhora do Ar",
      description: `**Trilhos Nossa Senhora do Ar - Vila Chã, Alijó**

Evento multidisciplinar dedicado a Nossa Senhora do Ar, Padroeira local, com BTT, Trail e Caminhada no Aeródromo da Chã!

## 🚴 Modalidades

### BTT - Passeio
- **Distância:** 30 km
- **Desnível Positivo:** 650 m
- **Dificuldade:** Física e técnica baixa
- **Partida:** A divulgar nas redes sociais

### Trail
- **Distância:** 12 km
- **Desnível Positivo:** 150 m
- **Partida:** A divulgar nas redes sociais

### Caminhada
- **Distância:** 12 km
- **Desnível Positivo:** 150 m
- **Partida:** A divulgar nas redes sociais

## 🏆 Prémios

**BTT:**
- Troféus para os 3 primeiros lugares (M/F)

**Trail:**
- Troféus para os 3 primeiros lugares (M/F)

**Caminhada:**
- O mais veterano
- O mais jovem
- O amigo fiel (podem levar o cão!)
- O mais estiloso (votação dos participantes)

**Equipas:**
- Prémio para a equipa com maior número de atletas (soma das 3 modalidades)

## 📦 Kit do Participante

- Dorsal
- Seguro de acidentes
- Lembranças
- Tracks GPS (GPX e KML)
- Guia do participante

## 🍽️ Alimentação

- Almoço opcional: 5€
- Abastecimentos no percurso

## 🚿 Outras Facilidades

- **Banhos gratuitos:** Piscinas Municipais de Alijó (11h00-19h00)
- **Secretariado:** Associação Cultural e Desportiva da Chã (08h00-18h00)

## ℹ️ Informações Importantes

### Idades Mínimas:
- BTT: 15 anos (com autorização)
- Trail: 16 anos
- Caminhada: 8 anos

### Segurança:
- Capacete obrigatório no BTT
- Material de reparação recomendado
- Telemóvel com bateria carregada

O evento celebra a Capela de Nossa Senhora do Ar, construída nos anos 20 do século XX, e passa por caminhos, trilhos e estradas florestais do Aeródromo da Chã!`,
      city: "Vila Chã, Alijó",
      metaTitle:
        "Trilhos Nossa Senhora do Ar 2026 | 1 Fevereiro | Vila Chã, Alijó, Vila Real",
      metaDescription:
        "Trilhos Nossa Senhora do Ar 2026 - 1 de fevereiro em Vila Chã, Alijó. BTT 30km, Trail 12km e Caminhada 12km. Inscrição 10€. Evento no Aeródromo da Chã com prémios e almoço opcional.",
    },
    en: {
      title: "Nossa Senhora do Ar Trails",
      description: `**Nossa Senhora do Ar Trails - Vila Chã, Alijó**

Multi-sport event dedicated to Nossa Senhora do Ar, local Patron Saint, with MTB, Trail Running and Hiking at Chã Aerodrome!

## 🚴 Disciplines

### MTB - Tour
- **Distance:** 30 km
- **Elevation Gain:** 650 m
- **Difficulty:** Low physical and technical
- **Start:** To be announced on social media

### Trail Running
- **Distance:** 12 km
- **Elevation Gain:** 150 m
- **Start:** To be announced on social media

### Hiking
- **Distance:** 12 km
- **Elevation Gain:** 150 m
- **Start:** To be announced on social media

## 🏆 Prizes

**MTB:**
- Trophies for top 3 (M/F)

**Trail Running:**
- Trophies for top 3 (M/F)

**Hiking:**
- Oldest participant
- Youngest participant
- Faithful friend (can bring your dog!)
- Most stylish (participants' vote)

**Teams:**
- Prize for team with most athletes (sum of all 3 disciplines)

## 📦 Participant Kit

- Race bib
- Accident insurance
- Souvenirs
- GPS tracks (GPX and KML)
- Participant guide

## 🍽️ Food

- Optional lunch: €5
- Aid stations on course

## 🚿 Other Facilities

- **Free showers:** Alijó Municipal Swimming Pools (11:00-19:00)
- **Registration desk:** Chã Cultural and Sports Association (08:00-18:00)

## ℹ️ Important Information

### Minimum Ages:
- MTB: 15 years (with authorization)
- Trail: 16 years
- Hiking: 8 years

### Safety:
- Helmet mandatory for MTB
- Repair materials recommended
- Mobile phone with charged battery

The event celebrates the Chapel of Nossa Senhora do Ar, built in the 1920s, and passes through paths, trails and forest roads of Chã Aerodrome!`,
      city: "Vila Chã, Alijó",
      metaTitle:
        "Nossa Senhora do Ar Trails 2026 | 1 February | Vila Chã, Alijó, Vila Real",
      metaDescription:
        "Nossa Senhora do Ar Trails 2026 - 1 February in Vila Chã, Alijó. MTB 30km, Trail 12km and Hiking 12km. Registration €10. Event at Chã Aerodrome with prizes and optional lunch.",
    },
    es: {
      title: "Senderos Nossa Senhora do Ar",
      description: `**Senderos Nossa Senhora do Ar - Vila Chã, Alijó**

¡Evento multideportivo dedicado a Nossa Senhora do Ar, Patrona local, con BTT, Trail y Senderismo en el Aeródromo de Chã!

## 🚴 Disciplinas

### BTT - Paseo
- **Distancia:** 30 km
- **Desnivel Positivo:** 650 m
- **Dificultad:** Física y técnica baja
- **Salida:** A publicar en redes sociales

### Trail
- **Distancia:** 12 km
- **Desnivel Positivo:** 150 m
- **Salida:** A publicar en redes sociales

### Senderismo
- **Distancia:** 12 km
- **Desnivel Positivo:** 150 m
- **Salida:** A publicar en redes sociales

## 🏆 Premios

**BTT:**
- Trofeos para los 3 primeros (M/F)

**Trail:**
- Trofeos para los 3 primeros (M/F)

**Senderismo:**
- El más veterano
- El más joven
- El amigo fiel (¡pueden llevar su perro!)
- El más elegante (votación de participantes)

**Equipos:**
- Premio para el equipo con más atletas (suma de las 3 disciplinas)

## 📦 Kit del Participante

- Dorsal
- Seguro de accidentes
- Recuerdos
- Tracks GPS (GPX y KML)
- Guía del participante

## 🍽️ Alimentación

- Almuerzo opcional: 5€
- Avituallamientos en el recorrido

## 🚿 Otras Facilidades

- **Duchas gratuitas:** Piscinas Municipales de Alijó (11:00-19:00)
- **Secretaría:** Asociación Cultural y Deportiva de Chã (08:00-18:00)

## ℹ️ Información Importante

### Edades Mínimas:
- BTT: 15 años (con autorización)
- Trail: 16 años
- Senderismo: 8 años

### Seguridad:
- Casco obligatorio en BTT
- Material de reparación recomendado
- Teléfono móvil con batería cargada

¡El evento celebra la Capilla de Nossa Senhora do Ar, construida en los años 20 del siglo XX, y pasa por caminos, senderos y carreteras forestales del Aeródromo de Chã!`,
      city: "Vila Chã, Alijó",
      metaTitle:
        "Senderos Nossa Senhora do Ar 2026 | 1 Febrero | Vila Chã, Alijó, Vila Real",
      metaDescription:
        "Senderos Nossa Senhora do Ar 2026 - 1 de febrero en Vila Chã, Alijó. BTT 30km, Trail 12km y Senderismo 12km. Inscripción 10€. Evento en Aeródromo de Chã con premios y almuerzo opcional.",
    },
    fr: {
      title: "Sentiers Nossa Senhora do Ar",
      description: `**Sentiers Nossa Senhora do Ar - Vila Chã, Alijó**

Événement multisport dédié à Nossa Senhora do Ar, Patronne locale, avec VTT, Trail et Randonnée à l'Aérodrome de Chã !

## 🚴 Disciplines

### VTT - Balade
- **Distance :** 30 km
- **Dénivelé Positif :** 650 m
- **Difficulté :** Physique et technique faible
- **Départ :** À publier sur les réseaux sociaux

### Trail
- **Distance :** 12 km
- **Dénivelé Positif :** 150 m
- **Départ :** À publier sur les réseaux sociaux

### Randonnée
- **Distance :** 12 km
- **Dénivelé Positif :** 150 m
- **Départ :** À publier sur les réseaux sociaux

## 🏆 Prix

**VTT :**
- Trophées pour les 3 premiers (H/F)

**Trail :**
- Trophées pour les 3 premiers (H/F)

**Randonnée :**
- Le plus vétéran
- Le plus jeune
- L'ami fidèle (peuvent amener leur chien !)
- Le plus stylé (vote des participants)

**Équipes :**
- Prix pour l'équipe avec le plus d'athlètes (somme des 3 disciplines)

## 📦 Kit du Participant

- Dossard
- Assurance accident
- Souvenirs
- Traces GPS (GPX et KML)
- Guide du participant

## 🍽️ Alimentation

- Déjeuner optionnel : 5€
- Ravitaillements sur le parcours

## 🚿 Autres Facilités

- **Douches gratuites :** Piscines Municipales d'Alijó (11h00-19h00)
- **Secrétariat :** Association Culturelle et Sportive de Chã (08h00-18h00)

## ℹ️ Informations Importantes

### Âges Minimums :
- VTT : 15 ans (avec autorisation)
- Trail : 16 ans
- Randonnée : 8 ans

### Sécurité :
- Casque obligatoire pour le VTT
- Matériel de réparation recommandé
- Téléphone portable avec batterie chargée

L'événement célèbre la Chapelle de Nossa Senhora do Ar, construite dans les années 20 du XXe siècle, et passe par des chemins, sentiers et routes forestières de l'Aérodrome de Chã !`,
      city: "Vila Chã, Alijó",
      metaTitle:
        "Sentiers Nossa Senhora do Ar 2026 | 1 Février | Vila Chã, Alijó, Vila Real",
      metaDescription:
        "Sentiers Nossa Senhora do Ar 2026 - 1 février à Vila Chã, Alijó. VTT 30km, Trail 12km et Randonnée 12km. Inscription 10€. Événement à l'Aérodrome de Chã avec prix et déjeuner optionnel.",
    },
    de: {
      title: "Nossa Senhora do Ar Trails",
      description: `**Nossa Senhora do Ar Trails - Vila Chã, Alijó**

Multisportveranstaltung zu Ehren von Nossa Senhora do Ar, der lokalen Schutzpatronin, mit MTB, Trail und Wandern am Flugplatz Chã!

## 🚴 Disziplinen

### MTB - Tour
- **Distanz:** 30 km
- **Höhenunterschied:** 650 m
- **Schwierigkeit:** Niedrig physisch und technisch
- **Start:** Auf Social Media zu veröffentlichen

### Trail
- **Distanz:** 12 km
- **Höhenunterschied:** 150 m
- **Start:** Auf Social Media zu veröffentlichen

### Wandern
- **Distanz:** 12 km
- **Höhenunterschied:** 150 m
- **Start:** Auf Social Media zu veröffentlichen

## 🏆 Preise

**MTB:**
- Trophäen für die Top 3 (M/W)

**Trail:**
- Trophäen für die Top 3 (M/W)

**Wandern:**
- Ältester Teilnehmer
- Jüngster Teilnehmer
- Treuer Freund (können ihren Hund mitbringen!)
- Stilvollster (Abstimmung der Teilnehmer)

**Teams:**
- Preis für das Team mit den meisten Athleten (Summe aller 3 Disziplinen)

## 📦 Teilnehmerkit

- Startnummer
- Unfallversicherung
- Souvenirs
- GPS-Tracks (GPX und KML)
- Teilnehmerhandbuch

## 🍽️ Verpflegung

- Optionales Mittagessen: 5€
- Verpflegungsstationen auf der Strecke

## 🚿 Weitere Einrichtungen

- **Kostenlose Duschen:** Städtische Schwimmbäder Alijó (11:00-19:00)
- **Sekretariat:** Kultur- und Sportverein Chã (08:00-18:00)

## ℹ️ Wichtige Informationen

### Mindestalter:
- MTB: 15 Jahre (mit Genehmigung)
- Trail: 16 Jahre
- Wandern: 8 Jahre

### Sicherheit:
- Helm obligatorisch für MTB
- Reparaturmaterial empfohlen
- Mobiltelefon mit aufgeladenem Akku

Die Veranstaltung feiert die Kapelle Nossa Senhora do Ar, die in den 1920er Jahren erbaut wurde, und führt durch Wege, Pfade und Waldstraßen des Flugplatzes Chã!`,
      city: "Vila Chã, Alijó",
      metaTitle:
        "Nossa Senhora do Ar Trails 2026 | 1. Februar | Vila Chã, Alijó, Vila Real",
      metaDescription:
        "Nossa Senhora do Ar Trails 2026 - 1. Februar in Vila Chã, Alijó. MTB 30km, Trail 12km und Wandern 12km. Anmeldung 10€. Veranstaltung am Flugplatz Chã mit Preisen und optionalem Mittagessen.",
    },
    it: {
      title: "Sentieri Nossa Senhora do Ar",
      description: `**Sentieri Nossa Senhora do Ar - Vila Chã, Alijó**

Evento multisportivo dedicato a Nossa Senhora do Ar, Patrona locale, con MTB, Trail e Trekking all'Aerodromo di Chã!

## 🚴 Discipline

### MTB - Tour
- **Distanza:** 30 km
- **Dislivello Positivo:** 650 m
- **Difficoltà:** Fisica e tecnica bassa
- **Partenza:** Da pubblicare sui social media

### Trail
- **Distanza:** 12 km
- **Dislivello Positivo:** 150 m
- **Partenza:** Da pubblicare sui social media

### Trekking
- **Distanza:** 12 km
- **Dislivello Positivo:** 150 m
- **Partenza:** Da pubblicare sui social media

## 🏆 Premi

**MTB:**
- Trofei per i primi 3 (M/F)

**Trail:**
- Trofei per i primi 3 (M/F)

**Trekking:**
- Il più veterano
- Il più giovane
- L'amico fedele (possono portare il cane!)
- Il più elegante (votazione dei partecipanti)

**Squadre:**
- Premio per la squadra con più atleti (somma di tutte e 3 le discipline)

## 📦 Kit del Partecipante

- Pettorale
- Assicurazione infortuni
- Ricordi
- Tracce GPS (GPX e KML)
- Guida del partecipante

## 🍽️ Alimentazione

- Pranzo opzionale: 5€
- Ristori sul percorso

## 🚿 Altre Strutture

- **Docce gratuite:** Piscine Municipali di Alijó (11:00-19:00)
- **Segreteria:** Associazione Culturale e Sportiva di Chã (08:00-18:00)

## ℹ️ Informazioni Importanti

### Età Minime:
- MTB: 15 anni (con autorizzazione)
- Trail: 16 anni
- Trekking: 8 anni

### Sicurezza:
- Casco obbligatorio per MTB
- Materiale di riparazione raccomandato
- Telefono cellulare con batteria carica

L'evento celebra la Cappella di Nossa Senhora do Ar, costruita negli anni '20 del XX secolo, e passa attraverso sentieri, percorsi e strade forestali dell'Aerodromo di Chã!`,
      city: "Vila Chã, Alijó",
      metaTitle:
        "Sentieri Nossa Senhora do Ar 2026 | 1 Febbraio | Vila Chã, Alijó, Vila Real",
      metaDescription:
        "Sentieri Nossa Senhora do Ar 2026 - 1 febbraio a Vila Chã, Alijó. MTB 30km, Trail 12km e Trekking 12km. Iscrizione 10€. Evento all'Aerodromo di Chã con premi e pranzo opzionale.",
    },
  };

  // Upsert the event
  const event = await prisma.event.upsert({
    where: {
      slug: "trilhos-nossa-senhora-ar-2026",
    },
    update: {
      title: translations.pt.title,
      description:
        "Evento multidisciplinar com BTT, Trail e Caminhada no Aeródromo da Chã",
      city: translations.pt.city,
      sportTypes: ["BTT", "TRAIL", "RUNNING"],
      isFeatured: false,
      startDate: eventDates.main.startDate,
      endDate: eventDates.main.endDate,
      latitude: 41.2747,
      longitude: -7.4639,
      country: "PT",
      externalUrl: "https://acorrer.pt/eventos/4128/info",
      imageUrl:
        "https://images.unsplash.com/photo-1571188654248-7a89213915f7?w=1200&h=630&fit=crop",
    },
    create: {
      slug: "trilhos-nossa-senhora-ar-2026",
      title: translations.pt.title,
      description:
        "Evento multidisciplinar com BTT, Trail e Caminhada no Aeródromo da Chã",
      city: translations.pt.city,
      sportTypes: ["BTT", "TRAIL", "RUNNING"],
      isFeatured: false,
      startDate: eventDates.main.startDate,
      endDate: eventDates.main.endDate,
      latitude: 41.2747,
      longitude: -7.4639,
      country: "PT",
      externalUrl: "https://acorrer.pt/eventos/4128/info",
      imageUrl:
        "https://images.unsplash.com/photo-1571188654248-7a89213915f7?w=1200&h=630&fit=crop",
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
      name: "BTT - Passeio",
      distanceKm: 30,
      elevationGainM: 650,
      startDate: eventDates.main.startDate,
      price: 10.0,
      currency: "EUR" as const,
      pricingPhases: [
        {
          name: "Inscrição",
          startDate: new Date("2025-12-01T00:00:00Z"),
          endDate: new Date("2026-01-27T23:59:59Z"),
          price: 10.0,
          currency: "EUR",
          note: "Inscrição no evento",
        },
      ],
    },
    {
      name: "Trail",
      distanceKm: 12,
      elevationGainM: 150,
      startDate: eventDates.main.startDate,
      price: 10.0,
      currency: "EUR" as const,
      pricingPhases: [
        {
          name: "Inscrição",
          startDate: new Date("2025-12-01T00:00:00Z"),
          endDate: new Date("2026-01-27T23:59:59Z"),
          price: 10.0,
          currency: "EUR",
          note: "Inscrição no evento",
        },
      ],
    },
    {
      name: "Caminhada",
      distanceKm: 12,
      elevationGainM: 150,
      startDate: eventDates.main.startDate,
      price: 10.0,
      currency: "EUR" as const,
      pricingPhases: [
        {
          name: "Inscrição",
          startDate: new Date("2025-12-01T00:00:00Z"),
          endDate: new Date("2026-01-27T23:59:59Z"),
          price: 10.0,
          currency: "EUR",
          note: "Inscrição no evento",
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

  console.log("✅ Trilhos Nossa Senhora do Ar 2026 seeded successfully!");
}

seedTrilhosNossaSenhoraAr()
  .catch((e) => {
    console.error("❌ Error seeding Trilhos Nossa Senhora do Ar:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
