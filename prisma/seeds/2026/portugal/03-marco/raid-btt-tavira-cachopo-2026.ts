/**
 * Seed: 5º Raid BTT Tavira - Cachopo 2026
 * Complete with translations in all 6 languages, FAQs and SEO
 */

import { PrismaClient, SportType, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding 5º Raid BTT Tavira - Cachopo 2026...");

  const eventSlug = "raid-btt-tavira-cachopo-2026";

  // ============================================================================
  // 1. UPSERT EVENT (idempotent - no deletes)
  // ============================================================================
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "5º Raid BTT Tavira - Cachopo",
      description:
        "Raid BTT de aventura entre Tavira e Cachopo no coração do Algarve. Navegação exclusivamente por GPS, sem marcações no terreno. Prova não competitiva, sem cronometragem. Percursos de 100km e 50km com elevada dificuldade técnica e física.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-08T09:00:00.000Z"),
      endDate: null,
      city: "Tavira",
      country: "Portugal",
      latitude: 37.1275,
      longitude: -7.6508,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Pra%C3%A7a+da+Rep%C3%BAblica+Tavira+Portugal",
      externalUrl: "",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-03-02T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "5º Raid BTT Tavira - Cachopo",
      description:
        "Raid BTT de aventura entre Tavira e Cachopo no coração do Algarve. Navegação exclusivamente por GPS, sem marcações no terreno. Prova não competitiva, sem cronometragem. Percursos de 100km e 50km com elevada dificuldade técnica e física.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-08T09:00:00.000Z"),
      endDate: null,
      city: "Tavira",
      country: "Portugal",
      latitude: 37.1275,
      longitude: -7.6508,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Pra%C3%A7a+da+Rep%C3%BAblica+Tavira+Portugal",
      externalUrl: "",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-03-02T23:59:59.000Z"),
    },
  });

  console.log(`✅ Event upserted: ${event.slug} (ID: ${event.id})`);

  // ============================================================================
  // 2. UPSERT TRANSLATIONS (ALL 6 LANGUAGES)
  // ============================================================================
  const translations: Array<{
    language: "pt" | "en" | "es" | "fr" | "de" | "it";
    title: string;
    description: string;
    city: string;
    metaTitle: string;
    metaDescription: string;
  }> = [
    {
      language: "pt",
      title: "5º Raid BTT Tavira - Cachopo",
      city: "Tavira",
      metaTitle: "5º Raid BTT Tavira - Cachopo 2026 | Tavira, Faro | 8 Março",
      metaDescription:
        "5º Raid BTT Tavira - Cachopo 2026 - 8 de março em Tavira. Aventura BTT de 100km e 50km pela serra algarvia. Navegação GPS obrigatória. Prova não competitiva.",
      description: `# 🚴‍♂️ 5º Raid BTT Tavira - Cachopo 2026

O **5º Raid BTT Tavira - Cachopo** é um evento de **aventura BTT** organizado pelo **Clube Bike Team Tavira** que liga a cidade de Tavira ao interior algarvio, até à aldeia de Cachopo. Uma experiência única pela **serra do Algarve**, com navegação exclusivamente por GPS!

## 📅 Data e Local

- **Data:** 8 de março de 2026 (Domingo)
- **Partida:** 09:00
- **Local de Partida/Chegada:** Praça da República, Tavira
- **Distrito:** Faro (Algarve)

## 🗺️ Percursos Disponíveis

| Percurso | Distância | Desnível | Navegação |
|----------|-----------|----------|-----------|
| **Tavira - Cachopo - Tavira** | ~100 km | ~3000 m D+ | GPS obrigatório |
| **Tavira - Cachopo** | ~50 km | ~1600 m D+ | GPS obrigatório |
| **Estafeta (2 atletas)** | ~100 km (50+50) | ~3000 m D+ | GPS obrigatório |

## ⚠️ Evento de Aventura — GPS Obrigatório!

🔴 **NÃO EXISTEM MARCAÇÕES NO TERRENO!** A navegação é feita **exclusivamente por GPS**. O track será fornecido pela organização. É obrigatório trazer GPS carregado e telemóvel ativo.

## 🏔️ Características da Prova

- 🚫 **Prova NÃO competitiva** — sem cronometragem, sem classificação
- 🔥 **Elevada dificuldade técnica e física** — prova de resistência e superação
- 🌿 **Trilhos da serra algarvia** — paisagens deslumbrantes do interior do Algarve
- 👤 **Máximo 200 participantes**
- 🔞 **Idade mínima:** 18 anos

## 📋 Programa

- **09:00** — Partida da Praça da República, Tavira (todos os atletas)
- **~11:30** — Chegada estimada dos primeiros a Cachopo (50km)
- **~14:30** — Chegada estimada dos primeiros a Tavira (100km)
- Abastecimentos em Cachopo e na chegada em Tavira

## 🎁 A Inscrição Inclui

- ✅ Participação no evento
- ✅ Track GPS fornecido pela organização
- ✅ Seguro de acidentes pessoais
- ✅ Assistência mecânica em Cachopo
- ✅ Medalha "Finisher"
- ✅ Abastecimentos sólidos e líquidos (Cachopo e Tavira)
- ✅ Apoio logístico para transporte Cachopo→Tavira (limitado)
- ✅ Banhos (campo de futebol de Cachopo + Pavilhão Municipal Eduardo Mansinho, Tavira)
- ✅ Zona de lavagem de bicicletas
- ✅ Saco de ofertas

## 🛡️ Material Obrigatório

- Capacete
- GPS (com track carregado)
- Telemóvel ativo

## 📧 Contactos

- **Organização:** Clube Bike Team Tavira
- **Email:** biketeamtavira@gmail.com
- **Henrique Lopes:** 932 651 222
- **Pedro Nascimento:** 966 319 453
- **Micael Soares:** 915 378 722`,
    },
    {
      language: "en",
      title: "5th BTT Raid Tavira - Cachopo",
      city: "Tavira",
      metaTitle: "5th BTT Raid Tavira - Cachopo 2026 | Tavira, Faro | March 8",
      metaDescription:
        "5th BTT Raid Tavira - Cachopo 2026 - March 8 in Tavira. MTB adventure of 100km and 50km through the Algarve hills. GPS navigation mandatory. Non-competitive event.",
      description: `# 🚴‍♂️ 5th BTT Raid Tavira - Cachopo 2026

The **5th BTT Raid Tavira - Cachopo** is an **MTB adventure event** organized by **Clube Bike Team Tavira** connecting the city of Tavira to the Algarve hinterland, reaching the village of Cachopo. A unique experience through the **Algarve mountains**, with GPS-only navigation!

## 📅 Date and Location

- **Date:** March 8, 2026 (Sunday)
- **Start:** 09:00
- **Start/Finish:** Praça da República, Tavira
- **District:** Faro (Algarve)

## 🗺️ Available Routes

| Route | Distance | Elevation | Navigation |
|-------|----------|-----------|------------|
| **Tavira - Cachopo - Tavira** | ~100 km | ~3000 m D+ | GPS mandatory |
| **Tavira - Cachopo** | ~50 km | ~1600 m D+ | GPS mandatory |
| **Relay (2 athletes)** | ~100 km (50+50) | ~3000 m D+ | GPS mandatory |

## ⚠️ Adventure Event — GPS Mandatory!

🔴 **THERE ARE NO TRAIL MARKS!** Navigation is done **exclusively by GPS**. The track will be provided by the organization. You must bring a charged GPS device and an active mobile phone.

## 🏔️ Event Characteristics

- 🚫 **Non-competitive event** — no timing, no classification
- 🔥 **High technical and physical difficulty** — endurance and self-challenge
- 🌿 **Algarve mountain trails** — stunning landscapes of the Algarve hinterland
- 👤 **Maximum 200 participants**
- 🔞 **Minimum age:** 18 years

## 📋 Schedule

- **09:00** — Start from Praça da República, Tavira (all athletes)
- **~11:30** — Estimated first arrival at Cachopo (50km)
- **~14:30** — Estimated first arrival back at Tavira (100km)
- Refreshments in Cachopo and at the finish in Tavira

## 🎁 Registration Includes

- ✅ Event participation
- ✅ GPS track provided by the organization
- ✅ Personal accident insurance
- ✅ Mechanical support in Cachopo
- ✅ "Finisher" medal
- ✅ Solid and liquid refreshments (Cachopo and Tavira)
- ✅ Logistical support for transport Cachopo→Tavira (limited)
- ✅ Showers (Cachopo football field + Pavilhão Municipal Eduardo Mansinho, Tavira)
- ✅ Bike washing area
- ✅ Gift bag

## 🛡️ Mandatory Equipment

- Helmet
- GPS (with loaded track)
- Active mobile phone

## 📧 Contacts

- **Organization:** Clube Bike Team Tavira
- **Email:** biketeamtavira@gmail.com
- **Henrique Lopes:** 932 651 222
- **Pedro Nascimento:** 966 319 453
- **Micael Soares:** 915 378 722`,
    },
    {
      language: "es",
      title: "5º Raid BTT Tavira - Cachopo",
      city: "Tavira",
      metaTitle: "5º Raid BTT Tavira - Cachopo 2026 | Tavira, Faro | 8 Marzo",
      metaDescription:
        "5º Raid BTT Tavira - Cachopo 2026 - 8 de marzo en Tavira. Aventura BTT de 100km y 50km por la sierra del Algarve. Navegación GPS obligatoria. Prueba no competitiva.",
      description: `# 🚴‍♂️ 5º Raid BTT Tavira - Cachopo 2026

El **5º Raid BTT Tavira - Cachopo** es un evento de **aventura BTT** organizado por el **Clube Bike Team Tavira** que conecta la ciudad de Tavira con el interior algarvío, hasta la aldea de Cachopo. ¡Una experiencia única por la **sierra del Algarve**, con navegación exclusivamente por GPS!

## 📅 Fecha y Lugar

- **Fecha:** 8 de marzo de 2026 (Domingo)
- **Salida:** 09:00
- **Lugar de Salida/Llegada:** Praça da República, Tavira
- **Distrito:** Faro (Algarve)

## 🗺️ Recorridos Disponibles

| Recorrido | Distancia | Desnivel | Navegación |
|-----------|-----------|----------|------------|
| **Tavira - Cachopo - Tavira** | ~100 km | ~3000 m D+ | GPS obligatorio |
| **Tavira - Cachopo** | ~50 km | ~1600 m D+ | GPS obligatorio |
| **Estafeta (2 atletas)** | ~100 km (50+50) | ~3000 m D+ | GPS obligatorio |

## ⚠️ Evento de Aventura — ¡GPS Obligatorio!

🔴 **¡NO EXISTEN MARCACIONES EN EL TERRENO!** La navegación se realiza **exclusivamente por GPS**. El track será proporcionado por la organización. Es obligatorio traer GPS cargado y teléfono móvil activo.

## 🏔️ Características de la Prueba

- 🚫 **Prueba NO competitiva** — sin cronometraje, sin clasificación
- 🔥 **Elevada dificultad técnica y física** — prueba de resistencia y superación
- 🌿 **Senderos de la sierra algarvia** — paisajes impresionantes del interior del Algarve
- 👤 **Máximo 200 participantes**
- 🔞 **Edad mínima:** 18 años

## 📋 Programa

- **09:00** — Salida desde la Praça da República, Tavira (todos los atletas)
- **~11:30** — Llegada estimada de los primeros a Cachopo (50km)
- **~14:30** — Llegada estimada de los primeros a Tavira (100km)
- Avituallamientos en Cachopo y en la llegada en Tavira

## 🎁 La Inscripción Incluye

- ✅ Participación en el evento
- ✅ Track GPS proporcionado por la organización
- ✅ Seguro de accidentes personales
- ✅ Asistencia mecánica en Cachopo
- ✅ Medalla "Finisher"
- ✅ Avituallamientos sólidos y líquidos (Cachopo y Tavira)
- ✅ Apoyo logístico para transporte Cachopo→Tavira (limitado)
- ✅ Duchas (campo de fútbol de Cachopo + Pavilhão Municipal Eduardo Mansinho, Tavira)
- ✅ Zona de lavado de bicicletas
- ✅ Bolsa de regalos

## 🛡️ Material Obligatorio

- Casco
- GPS (con track cargado)
- Teléfono móvil activo

## 📧 Contactos

- **Organización:** Clube Bike Team Tavira
- **Email:** biketeamtavira@gmail.com
- **Henrique Lopes:** 932 651 222
- **Pedro Nascimento:** 966 319 453
- **Micael Soares:** 915 378 722`,
    },
    {
      language: "fr",
      title: "5e Raid VTT Tavira - Cachopo",
      city: "Tavira",
      metaTitle: "5e Raid VTT Tavira - Cachopo 2026 | Tavira, Faro | 8 Mars",
      metaDescription:
        "5e Raid VTT Tavira - Cachopo 2026 - 8 mars à Tavira. Aventure VTT de 100km et 50km dans les montagnes de l'Algarve. Navigation GPS obligatoire. Épreuve non compétitive.",
      description: `# 🚴‍♂️ 5e Raid VTT Tavira - Cachopo 2026

Le **5e Raid VTT Tavira - Cachopo** est un événement d'**aventure VTT** organisé par le **Clube Bike Team Tavira** reliant la ville de Tavira à l'arrière-pays algarvien, jusqu'au village de Cachopo. Une expérience unique à travers les **montagnes de l'Algarve**, avec une navigation exclusivement par GPS !

## 📅 Date et Lieu

- **Date:** 8 mars 2026 (Dimanche)
- **Départ:** 09:00
- **Lieu de Départ/Arrivée:** Praça da República, Tavira
- **District:** Faro (Algarve)

## 🗺️ Parcours Disponibles

| Parcours | Distance | Dénivelé | Navigation |
|----------|----------|----------|------------|
| **Tavira - Cachopo - Tavira** | ~100 km | ~3000 m D+ | GPS obligatoire |
| **Tavira - Cachopo** | ~50 km | ~1600 m D+ | GPS obligatoire |
| **Relais (2 athlètes)** | ~100 km (50+50) | ~3000 m D+ | GPS obligatoire |

## ⚠️ Événement Aventure — GPS Obligatoire !

🔴 **IL N'Y A AUCUN BALISAGE SUR LE TERRAIN !** La navigation se fait **exclusivement par GPS**. Le track sera fourni par l'organisation. Il est obligatoire d'apporter un GPS chargé et un téléphone portable actif.

## 🏔️ Caractéristiques de l'Épreuve

- 🚫 **Épreuve NON compétitive** — pas de chronométrage, pas de classement
- 🔥 **Haute difficulté technique et physique** — épreuve d'endurance et de dépassement de soi
- 🌿 **Sentiers de la montagne algarvienne** — paysages magnifiques de l'arrière-pays de l'Algarve
- 👤 **Maximum 200 participants**
- 🔞 **Âge minimum:** 18 ans

## 📋 Programme

- **09:00** — Départ de la Praça da República, Tavira (tous les athlètes)
- **~11:30** — Arrivée estimée des premiers à Cachopo (50km)
- **~14:30** — Arrivée estimée des premiers à Tavira (100km)
- Ravitaillements à Cachopo et à l'arrivée à Tavira

## 🎁 L'Inscription Comprend

- ✅ Participation à l'événement
- ✅ Track GPS fourni par l'organisation
- ✅ Assurance accidents personnels
- ✅ Assistance mécanique à Cachopo
- ✅ Médaille "Finisher"
- ✅ Ravitaillements solides et liquides (Cachopo et Tavira)
- ✅ Soutien logistique pour le transport Cachopo→Tavira (limité)
- ✅ Douches (terrain de football de Cachopo + Pavilhão Municipal Eduardo Mansinho, Tavira)
- ✅ Zone de lavage de vélos
- ✅ Sac de cadeaux

## 🛡️ Équipement Obligatoire

- Casque
- GPS (avec track chargé)
- Téléphone portable actif

## 📧 Contacts

- **Organisation:** Clube Bike Team Tavira
- **Email:** biketeamtavira@gmail.com
- **Henrique Lopes:** 932 651 222
- **Pedro Nascimento:** 966 319 453
- **Micael Soares:** 915 378 722`,
    },
    {
      language: "de",
      title: "5. MTB Raid Tavira - Cachopo",
      city: "Tavira",
      metaTitle: "5. MTB Raid Tavira - Cachopo 2026 | Tavira, Faro | 8. März",
      metaDescription:
        "5. MTB Raid Tavira - Cachopo 2026 - 8. März in Tavira. MTB-Abenteuer über 100km und 50km durch die Berge der Algarve. GPS-Navigation Pflicht. Nicht-kompetitive Veranstaltung.",
      description: `# 🚴‍♂️ 5. MTB Raid Tavira - Cachopo 2026

Der **5. MTB Raid Tavira - Cachopo** ist ein **MTB-Abenteuer-Event**, organisiert vom **Clube Bike Team Tavira**, der die Stadt Tavira mit dem Hinterland der Algarve verbindet, bis zum Dorf Cachopo. Ein einzigartiges Erlebnis durch die **Berge der Algarve**, mit Navigation ausschließlich per GPS!

## 📅 Datum und Ort

- **Datum:** 8. März 2026 (Sonntag)
- **Start:** 09:00 Uhr
- **Start/Ziel:** Praça da República, Tavira
- **Bezirk:** Faro (Algarve)

## 🗺️ Verfügbare Strecken

| Strecke | Distanz | Höhenmeter | Navigation |
|---------|---------|------------|------------|
| **Tavira - Cachopo - Tavira** | ~100 km | ~3000 m D+ | GPS Pflicht |
| **Tavira - Cachopo** | ~50 km | ~1600 m D+ | GPS Pflicht |
| **Staffel (2 Athleten)** | ~100 km (50+50) | ~3000 m D+ | GPS Pflicht |

## ⚠️ Abenteuer-Event — GPS Pflicht!

🔴 **ES GIBT KEINE STRECKENMARKIERUNGEN!** Die Navigation erfolgt **ausschließlich per GPS**. Der Track wird von der Organisation bereitgestellt. Es ist Pflicht, ein aufgeladenes GPS-Gerät und ein aktives Mobiltelefon mitzubringen.

## 🏔️ Merkmale der Veranstaltung

- 🚫 **NICHT kompetitive Veranstaltung** — keine Zeitnahme, keine Wertung
- 🔥 **Hohe technische und körperliche Schwierigkeit** — Ausdauer- und Selbstüberwindungsprüfung
- 🌿 **Trails der Algarve-Berge** — atemberaubende Landschaften des Algarve-Hinterlandes
- 👤 **Maximum 200 Teilnehmer**
- 🔞 **Mindestalter:** 18 Jahre

## 📋 Programm

- **09:00** — Start am Praça da República, Tavira (alle Athleten)
- **~11:30** — Geschätzte Ankunft der Ersten in Cachopo (50km)
- **~14:30** — Geschätzte Ankunft der Ersten zurück in Tavira (100km)
- Verpflegung in Cachopo und im Ziel in Tavira

## 🎁 Die Anmeldung Beinhaltet

- ✅ Teilnahme an der Veranstaltung
- ✅ GPS-Track von der Organisation bereitgestellt
- ✅ Persönliche Unfallversicherung
- ✅ Mechanische Unterstützung in Cachopo
- ✅ "Finisher"-Medaille
- ✅ Feste und flüssige Verpflegung (Cachopo und Tavira)
- ✅ Logistische Unterstützung für Transport Cachopo→Tavira (begrenzt)
- ✅ Duschen (Fußballplatz Cachopo + Pavilhão Municipal Eduardo Mansinho, Tavira)
- ✅ Fahrradwaschplatz
- ✅ Geschenktüte

## 🛡️ Pflichtausrüstung

- Helm
- GPS (mit geladenem Track)
- Aktives Mobiltelefon

## 📧 Kontakt

- **Organisation:** Clube Bike Team Tavira
- **Email:** biketeamtavira@gmail.com
- **Henrique Lopes:** 932 651 222
- **Pedro Nascimento:** 966 319 453
- **Micael Soares:** 915 378 722`,
    },
    {
      language: "it",
      title: "5º Raid BTT Tavira - Cachopo",
      city: "Tavira",
      metaTitle: "5º Raid BTT Tavira - Cachopo 2026 | Tavira, Faro | 8 Marzo",
      metaDescription:
        "5º Raid BTT Tavira - Cachopo 2026 - 8 marzo a Tavira. Avventura BTT di 100km e 50km nella serra dell'Algarve. Navigazione GPS obbligatoria. Evento non competitivo.",
      description: `# 🚴‍♂️ 5º Raid BTT Tavira - Cachopo 2026

Il **5º Raid BTT Tavira - Cachopo** è un evento di **avventura BTT** organizzato dal **Clube Bike Team Tavira** che collega la città di Tavira all'entroterra algarviano, fino al villaggio di Cachopo. Un'esperienza unica attraverso le **montagne dell'Algarve**, con navigazione esclusivamente tramite GPS!

## 📅 Data e Luogo

- **Data:** 8 marzo 2026 (Domenica)
- **Partenza:** 09:00
- **Luogo di Partenza/Arrivo:** Praça da República, Tavira
- **Distretto:** Faro (Algarve)

## 🗺️ Percorsi Disponibili

| Percorso | Distanza | Dislivello | Navigazione |
|----------|----------|------------|-------------|
| **Tavira - Cachopo - Tavira** | ~100 km | ~3000 m D+ | GPS obbligatorio |
| **Tavira - Cachopo** | ~50 km | ~1600 m D+ | GPS obbligatorio |
| **Staffetta (2 atleti)** | ~100 km (50+50) | ~3000 m D+ | GPS obbligatorio |

## ⚠️ Evento Avventura — GPS Obbligatorio!

🔴 **NON CI SONO SEGNALAZIONI SUL TERRENO!** La navigazione avviene **esclusivamente tramite GPS**. Il track sarà fornito dall'organizzazione. È obbligatorio portare GPS caricato e telefono cellulare attivo.

## 🏔️ Caratteristiche dell'Evento

- 🚫 **Evento NON competitivo** — senza cronometraggio, senza classifica
- 🔥 **Elevata difficoltà tecnica e fisica** — prova di resistenza e superamento di sé
- 🌿 **Sentieri della serra algarvia** — paesaggi mozzafiato dell'entroterra dell'Algarve
- 👤 **Massimo 200 partecipanti**
- 🔞 **Età minima:** 18 anni

## 📋 Programma

- **09:00** — Partenza dalla Praça da República, Tavira (tutti gli atleti)
- **~11:30** — Arrivo stimato dei primi a Cachopo (50km)
- **~14:30** — Arrivo stimato dei primi a Tavira (100km)
- Ristori a Cachopo e all'arrivo a Tavira

## 🎁 L'Iscrizione Include

- ✅ Partecipazione all'evento
- ✅ Track GPS fornito dall'organizzazione
- ✅ Assicurazione infortuni personali
- ✅ Assistenza meccanica a Cachopo
- ✅ Medaglia "Finisher"
- ✅ Ristori solidi e liquidi (Cachopo e Tavira)
- ✅ Supporto logistico per trasporto Cachopo→Tavira (limitato)
- ✅ Docce (campo da calcio di Cachopo + Pavilhão Municipal Eduardo Mansinho, Tavira)
- ✅ Area lavaggio biciclette
- ✅ Sacchetto regalo

## 🛡️ Equipaggiamento Obbligatorio

- Casco
- GPS (con track caricato)
- Telefono cellulare attivo

## 📧 Contatti

- **Organizzazione:** Clube Bike Team Tavira
- **Email:** biketeamtavira@gmail.com
- **Henrique Lopes:** 932 651 222
- **Pedro Nascimento:** 966 319 453
- **Micael Soares:** 915 378 722`,
    },
  ];

  for (const translation of translations) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: translation.language,
        },
      },
      update: {
        title: translation.title,
        description: translation.description,
        city: translation.city,
        metaTitle: translation.metaTitle,
        metaDescription: translation.metaDescription,
      },
      create: {
        eventId: event.id,
        language: translation.language,
        title: translation.title,
        description: translation.description,
        city: translation.city,
        metaTitle: translation.metaTitle,
        metaDescription: translation.metaDescription,
      },
    });
  }

  console.log(
    "✅ Event translations upserted for 6 languages (pt, en, es, fr, de, it)"
  );

  // ============================================================================
  // 3. UPSERT VARIANTS (idempotent with findFirst)
  // ============================================================================
  console.log("\n🚴 Creating variants...");

  // Helper function to find or create variant
  const findOrCreateVariant = async (variantData: {
    name: string;
    distanceKm: number;
    elevationGainM?: number;
    startTime: string;
    maxParticipants?: number;
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

  // Variant 1: Tavira - Cachopo - Tavira (100km)
  const fullLoop = await findOrCreateVariant({
    name: "Tavira - Cachopo - Tavira (100km)",
    distanceKm: 100,
    elevationGainM: 3000,
    startTime: "09:00",
    maxParticipants: 200,
    price: 15.0,
    currency: Currency.EUR,
  });

  const fullLoopTranslations = [
    {
      language: "pt" as const,
      name: "Tavira - Cachopo - Tavira (100km)",
      description:
        "Percurso completo de ida e volta: Tavira → Cachopo → Tavira. ~100km com ~3000m de desnível acumulado. Navegação exclusivamente por GPS. Elevada dificuldade técnica e física. Prova de resistência e aventura pela serra algarvia.",
    },
    {
      language: "en" as const,
      name: "Tavira - Cachopo - Tavira (100km)",
      description:
        "Full loop route: Tavira → Cachopo → Tavira. ~100km with ~3000m cumulative elevation gain. GPS-only navigation. High technical and physical difficulty. Endurance and adventure ride through the Algarve mountains.",
    },
    {
      language: "es" as const,
      name: "Tavira - Cachopo - Tavira (100km)",
      description:
        "Recorrido completo de ida y vuelta: Tavira → Cachopo → Tavira. ~100km con ~3000m de desnivel acumulado. Navegación exclusivamente por GPS. Elevada dificultad técnica y física. Prueba de resistencia y aventura por la sierra algarvia.",
    },
    {
      language: "fr" as const,
      name: "Tavira - Cachopo - Tavira (100km)",
      description:
        "Parcours complet aller-retour: Tavira → Cachopo → Tavira. ~100km avec ~3000m de dénivelé cumulé. Navigation exclusivement par GPS. Haute difficulté technique et physique. Épreuve d'endurance et d'aventure dans les montagnes de l'Algarve.",
    },
    {
      language: "de" as const,
      name: "Tavira - Cachopo - Tavira (100km)",
      description:
        "Vollständige Hin- und Rückstrecke: Tavira → Cachopo → Tavira. ~100km mit ~3000m kumuliertem Höhengewinn. Navigation ausschließlich per GPS. Hohe technische und körperliche Schwierigkeit. Ausdauer- und Abenteuerfahrt durch die Algarve-Berge.",
    },
    {
      language: "it" as const,
      name: "Tavira - Cachopo - Tavira (100km)",
      description:
        "Percorso completo andata e ritorno: Tavira → Cachopo → Tavira. ~100km con ~3000m di dislivello cumulato. Navigazione esclusivamente tramite GPS. Elevata difficoltà tecnica e fisica. Prova di resistenza e avventura nella serra algarvia.",
    },
  ];

  for (const translation of fullLoopTranslations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: fullLoop.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: fullLoop.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  console.log("   ✅ Tavira - Cachopo - Tavira (100km) created/updated");

  // Variant 2: Tavira - Cachopo (50km)
  const oneWay = await findOrCreateVariant({
    name: "Tavira - Cachopo (50km)",
    distanceKm: 50,
    elevationGainM: 1600,
    startTime: "09:00",
    maxParticipants: 200,
    price: 15.0,
    currency: Currency.EUR,
  });

  const oneWayTranslations = [
    {
      language: "pt" as const,
      name: "Tavira - Cachopo (50km)",
      description:
        "Percurso de ida: Tavira → Cachopo. ~50km com ~1600m de desnível acumulado. Navegação exclusivamente por GPS. A organização disponibiliza transporte limitado de regresso Cachopo→Tavira para atletas e bicicletas.",
    },
    {
      language: "en" as const,
      name: "Tavira - Cachopo (50km)",
      description:
        "One-way route: Tavira → Cachopo. ~50km with ~1600m cumulative elevation gain. GPS-only navigation. The organization provides limited return transport Cachopo→Tavira for athletes and bikes.",
    },
    {
      language: "es" as const,
      name: "Tavira - Cachopo (50km)",
      description:
        "Recorrido de ida: Tavira → Cachopo. ~50km con ~1600m de desnivel acumulado. Navegación exclusivamente por GPS. La organización ofrece transporte limitado de regreso Cachopo→Tavira para atletas y bicicletas.",
    },
    {
      language: "fr" as const,
      name: "Tavira - Cachopo (50km)",
      description:
        "Parcours aller: Tavira → Cachopo. ~50km avec ~1600m de dénivelé cumulé. Navigation exclusivement par GPS. L'organisation fournit un transport retour limité Cachopo→Tavira pour les athlètes et les vélos.",
    },
    {
      language: "de" as const,
      name: "Tavira - Cachopo (50km)",
      description:
        "Einfache Strecke: Tavira → Cachopo. ~50km mit ~1600m kumuliertem Höhengewinn. Navigation ausschließlich per GPS. Die Organisation bietet begrenzten Rücktransport Cachopo→Tavira für Athleten und Fahrräder.",
    },
    {
      language: "it" as const,
      name: "Tavira - Cachopo (50km)",
      description:
        "Percorso di sola andata: Tavira → Cachopo. ~50km con ~1600m di dislivello cumulato. Navigazione esclusivamente tramite GPS. L'organizzazione offre trasporto limitato di ritorno Cachopo→Tavira per atleti e biciclette.",
    },
  ];

  for (const translation of oneWayTranslations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: oneWay.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: oneWay.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  console.log("   ✅ Tavira - Cachopo (50km) created/updated");

  // Variant 3: Estafeta (Relay 50km each)
  const estafeta = await findOrCreateVariant({
    name: "Estafeta (2 atletas)",
    distanceKm: 100,
    elevationGainM: 3000,
    startTime: "09:00",
    price: 30.0,
    currency: Currency.EUR,
  });

  const estafetaTranslations = [
    {
      language: "pt" as const,
      name: "Estafeta (2 atletas)",
      description:
        "Modalidade de estafeta: equipa de 2 atletas. O Atleta 1 realiza o percurso Tavira→Cachopo (~50km). Após a sua chegada, o Atleta 2 parte de Cachopo→Tavira (~50km). Navegação exclusivamente por GPS. Preço de 30€ para a equipa.",
    },
    {
      language: "en" as const,
      name: "Relay (2 athletes)",
      description:
        "Relay mode: team of 2 athletes. Athlete 1 rides Tavira→Cachopo (~50km). After their arrival, Athlete 2 departs Cachopo→Tavira (~50km). GPS-only navigation. Price of €30 for the team.",
    },
    {
      language: "es" as const,
      name: "Estafeta (2 atletas)",
      description:
        "Modalidad de estafeta: equipo de 2 atletas. El Atleta 1 realiza el recorrido Tavira→Cachopo (~50km). Tras su llegada, el Atleta 2 parte de Cachopo→Tavira (~50km). Navegación exclusivamente por GPS. Precio de 30€ para el equipo.",
    },
    {
      language: "fr" as const,
      name: "Relais (2 athlètes)",
      description:
        "Mode relais: équipe de 2 athlètes. L'Athlète 1 effectue le parcours Tavira→Cachopo (~50km). Après son arrivée, l'Athlète 2 part de Cachopo→Tavira (~50km). Navigation exclusivement par GPS. Prix de 30€ pour l'équipe.",
    },
    {
      language: "de" as const,
      name: "Staffel (2 Athleten)",
      description:
        "Staffelmodus: Team von 2 Athleten. Athlet 1 fährt Tavira→Cachopo (~50km). Nach seiner Ankunft startet Athlet 2 von Cachopo→Tavira (~50km). Navigation ausschließlich per GPS. Preis von 30€ für das Team.",
    },
    {
      language: "it" as const,
      name: "Staffetta (2 atleti)",
      description:
        "Modalità staffetta: squadra di 2 atleti. L'Atleta 1 percorre Tavira→Cachopo (~50km). Dopo il suo arrivo, l'Atleta 2 parte da Cachopo→Tavira (~50km). Navigazione esclusivamente tramite GPS. Prezzo di 30€ per la squadra.",
    },
  ];

  for (const translation of estafetaTranslations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: estafeta.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: estafeta.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  console.log("   ✅ Estafeta (2 atletas) created/updated");

  // ============================================================================
  // 4. UPSERT PRICING PHASES (linked to eventId)
  // ============================================================================
  console.log("\n💰 Creating pricing phases...");

  const findOrCreatePricingPhase = async (
    name: string,
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
        data,
      });
    } else {
      return await prisma.pricingPhase.create({
        data: { eventId: event.id, name, ...data },
      });
    }
  };

  await findOrCreatePricingPhase("Inscrição - Percurso 100km ou 50km", {
    startDate: new Date("2025-11-19T00:00:00.000Z"),
    endDate: new Date("2026-03-02T23:59:59.000Z"),
    price: 15.0,
    currency: Currency.EUR,
    note: "GPS obrigatório. Inclui seguro, medalha finisher, abastecimentos e banhos",
  });

  await findOrCreatePricingPhase("Inscrição - Estafeta (2 atletas)", {
    startDate: new Date("2025-11-19T00:00:00.000Z"),
    endDate: new Date("2026-03-02T23:59:59.000Z"),
    price: 30.0,
    currency: Currency.EUR,
    note: "Equipa de 2 atletas. GPS obrigatório.",
  });

  console.log(`   ✅ Pricing phases created/updated (2 phases)`);

  // ============================================================================
  // 5. UPSERT FAQs WITH TRANSLATIONS
  // ============================================================================
  console.log("\n❓ Creating FAQs...");

  const faqs = [
    {
      order: 1,
      question: "O GPS é mesmo obrigatório? Não há marcações no terreno?",
      answer:
        "Sim, o GPS é absolutamente obrigatório. NÃO existem quaisquer marcações no terreno (fitas, setas, placas). A navegação é feita exclusivamente por GPS. O track será disponibilizado pela organização antes do evento. Deverá ter o track carregado no seu GPS e telemóvel ativo como backup.",
      translations: {
        pt: {
          question: "O GPS é mesmo obrigatório? Não há marcações no terreno?",
          answer:
            "Sim, o GPS é absolutamente obrigatório. NÃO existem quaisquer marcações no terreno (fitas, setas, placas). A navegação é feita exclusivamente por GPS. O track será disponibilizado pela organização antes do evento. Deverá ter o track carregado no seu GPS e telemóvel ativo como backup.",
        },
        en: {
          question: "Is GPS really mandatory? Are there no trail marks?",
          answer:
            "Yes, GPS is absolutely mandatory. There are NO trail marks whatsoever (ribbons, arrows, signs). Navigation is done exclusively by GPS. The track will be provided by the organization before the event. You must have the track loaded on your GPS device and an active mobile phone as backup.",
        },
        es: {
          question:
            "¿El GPS es realmente obligatorio? ¿No hay marcaciones en el terreno?",
          answer:
            "Sí, el GPS es absolutamente obligatorio. NO existen marcaciones en el terreno (cintas, flechas, placas). La navegación se realiza exclusivamente por GPS. El track será proporcionado por la organización antes del evento. Deberá tener el track cargado en su GPS y teléfono móvil activo como respaldo.",
        },
        fr: {
          question:
            "Le GPS est-il vraiment obligatoire? Il n'y a pas de balisage?",
          answer:
            "Oui, le GPS est absolument obligatoire. Il n'y a AUCUN balisage sur le terrain (rubans, flèches, panneaux). La navigation se fait exclusivement par GPS. Le track sera fourni par l'organisation avant l'événement. Vous devez avoir le track chargé sur votre GPS et un téléphone portable actif en secours.",
        },
        de: {
          question:
            "Ist GPS wirklich Pflicht? Gibt es keine Streckenmarkierungen?",
          answer:
            "Ja, GPS ist absolut Pflicht. Es gibt KEINE Streckenmarkierungen (Bänder, Pfeile, Schilder). Die Navigation erfolgt ausschließlich per GPS. Der Track wird von der Organisation vor der Veranstaltung bereitgestellt. Sie müssen den Track auf Ihrem GPS-Gerät geladen haben und ein aktives Mobiltelefon als Backup mitführen.",
        },
        it: {
          question:
            "Il GPS è davvero obbligatorio? Non ci sono segnalazioni sul terreno?",
          answer:
            "Sì, il GPS è assolutamente obbligatorio. NON ci sono segnalazioni sul terreno (nastri, frecce, cartelli). La navigazione avviene esclusivamente tramite GPS. Il track sarà fornito dall'organizzazione prima dell'evento. Dovrete avere il track caricato sul vostro GPS e un telefono cellulare attivo come backup.",
        },
      },
    },
    {
      order: 2,
      question: "O que é a modalidade Estafeta?",
      answer:
        "A Estafeta é uma modalidade em equipa de 2 atletas. O Atleta 1 realiza o percurso Tavira→Cachopo (~50km). Após a chegada do Atleta 1 a Cachopo, o Atleta 2 parte de Cachopo→Tavira (~50km), completando os ~100km totais. O preço é de 30€ para a equipa (ambos os atletas incluídos).",
      translations: {
        pt: {
          question: "O que é a modalidade Estafeta?",
          answer:
            "A Estafeta é uma modalidade em equipa de 2 atletas. O Atleta 1 realiza o percurso Tavira→Cachopo (~50km). Após a chegada do Atleta 1 a Cachopo, o Atleta 2 parte de Cachopo→Tavira (~50km), completando os ~100km totais. O preço é de 30€ para a equipa (ambos os atletas incluídos).",
        },
        en: {
          question: "What is the Relay option?",
          answer:
            "The Relay is a team mode with 2 athletes. Athlete 1 rides Tavira→Cachopo (~50km). After Athlete 1 arrives in Cachopo, Athlete 2 departs Cachopo→Tavira (~50km), completing the ~100km total. The price is €30 for the team (both athletes included).",
        },
        es: {
          question: "¿Qué es la modalidad Estafeta?",
          answer:
            "La Estafeta es una modalidad en equipo de 2 atletas. El Atleta 1 realiza el recorrido Tavira→Cachopo (~50km). Tras la llegada del Atleta 1 a Cachopo, el Atleta 2 parte de Cachopo→Tavira (~50km), completando los ~100km totales. El precio es de 30€ para el equipo (ambos atletas incluidos).",
        },
        fr: {
          question: "Qu'est-ce que la modalité Relais?",
          answer:
            "Le Relais est une modalité en équipe de 2 athlètes. L'Athlète 1 effectue le parcours Tavira→Cachopo (~50km). Après l'arrivée de l'Athlète 1 à Cachopo, l'Athlète 2 part de Cachopo→Tavira (~50km), complétant les ~100km au total. Le prix est de 30€ pour l'équipe (les deux athlètes inclus).",
        },
        de: {
          question: "Was ist die Staffel-Variante?",
          answer:
            "Die Staffel ist ein Teammodus mit 2 Athleten. Athlet 1 fährt Tavira→Cachopo (~50km). Nach Ankunft von Athlet 1 in Cachopo startet Athlet 2 von Cachopo→Tavira (~50km) und vervollständigt die insgesamt ~100km. Der Preis beträgt 30€ für das Team (beide Athleten inklusive).",
        },
        it: {
          question: "Cos'è la modalità Staffetta?",
          answer:
            "La Staffetta è una modalità a squadre di 2 atleti. L'Atleta 1 percorre Tavira→Cachopo (~50km). Dopo l'arrivo dell'Atleta 1 a Cachopo, l'Atleta 2 parte da Cachopo→Tavira (~50km), completando i ~100km totali. Il prezzo è di 30€ per la squadra (entrambi gli atleti inclusi).",
        },
      },
    },
    {
      order: 3,
      question: "Qual é o nível de dificuldade da prova?",
      answer:
        "A prova tem elevada dificuldade técnica e física. O percurso completo (100km) acumula cerca de 3000m de desnível positivo pela serra algarvia. É uma verdadeira prova de resistência e aventura, recomendada para praticantes experientes. O percurso de 50km acumula ~1600m D+ e é igualmente exigente. Não se trata de uma prova competitiva — o objetivo é completar o desafio e desfrutar da serra.",
      translations: {
        pt: {
          question: "Qual é o nível de dificuldade da prova?",
          answer:
            "A prova tem elevada dificuldade técnica e física. O percurso completo (100km) acumula cerca de 3000m de desnível positivo pela serra algarvia. É uma verdadeira prova de resistência e aventura, recomendada para praticantes experientes. O percurso de 50km acumula ~1600m D+ e é igualmente exigente. Não se trata de uma prova competitiva — o objetivo é completar o desafio e desfrutar da serra.",
        },
        en: {
          question: "What is the difficulty level of the event?",
          answer:
            "The event has high technical and physical difficulty. The full route (100km) accumulates about 3000m of positive elevation gain through the Algarve mountains. It is a true endurance and adventure challenge, recommended for experienced riders. The 50km route accumulates ~1600m D+ and is equally demanding. This is not a competitive event — the goal is to complete the challenge and enjoy the mountains.",
        },
        es: {
          question: "¿Cuál es el nivel de dificultad de la prueba?",
          answer:
            "La prueba tiene elevada dificultad técnica y física. El recorrido completo (100km) acumula cerca de 3000m de desnivel positivo por la sierra algarvia. Es una verdadera prueba de resistencia y aventura, recomendada para practicantes experimentados. El recorrido de 50km acumula ~1600m D+ y es igualmente exigente. No es una prueba competitiva — el objetivo es completar el desafío y disfrutar de la sierra.",
        },
        fr: {
          question: "Quel est le niveau de difficulté de l'épreuve?",
          answer:
            "L'épreuve a une haute difficulté technique et physique. Le parcours complet (100km) accumule environ 3000m de dénivelé positif dans les montagnes de l'Algarve. C'est un véritable défi d'endurance et d'aventure, recommandé aux pratiquants expérimentés. Le parcours de 50km accumule ~1600m D+ et est tout aussi exigeant. Il ne s'agit pas d'une épreuve compétitive — l'objectif est de relever le défi et profiter de la montagne.",
        },
        de: {
          question: "Wie hoch ist der Schwierigkeitsgrad der Veranstaltung?",
          answer:
            "Die Veranstaltung hat einen hohen technischen und körperlichen Schwierigkeitsgrad. Die vollständige Strecke (100km) sammelt etwa 3000m Höhengewinn durch die Algarve-Berge. Es ist eine echte Ausdauer- und Abenteuer-Herausforderung, empfohlen für erfahrene Fahrer. Die 50km-Strecke sammelt ~1600m D+ und ist ebenso anspruchsvoll. Dies ist keine Wettkampfveranstaltung — das Ziel ist es, die Herausforderung zu meistern und die Berge zu genießen.",
        },
        it: {
          question: "Qual è il livello di difficoltà dell'evento?",
          answer:
            "L'evento ha un'elevata difficoltà tecnica e fisica. Il percorso completo (100km) accumula circa 3000m di dislivello positivo nella serra algarvia. È una vera prova di resistenza e avventura, consigliata a praticanti esperti. Il percorso di 50km accumula ~1600m D+ ed è altrettanto impegnativo. Non si tratta di un evento competitivo — l'obiettivo è completare la sfida e godersi la montagna.",
        },
      },
    },
    {
      order: 4,
      question: "Existe transporte de regresso de Cachopo para Tavira?",
      answer:
        "Sim, a organização disponibiliza apoio logístico limitado para transporte de atletas e bicicletas de Cachopo para Tavira, destinado aos participantes que realizem o percurso de 50km (só ida). Este transporte é limitado e sujeito à capacidade disponível. Recomendamos que confirme a disponibilidade junto da organização.",
      translations: {
        pt: {
          question: "Existe transporte de regresso de Cachopo para Tavira?",
          answer:
            "Sim, a organização disponibiliza apoio logístico limitado para transporte de atletas e bicicletas de Cachopo para Tavira, destinado aos participantes que realizem o percurso de 50km (só ida). Este transporte é limitado e sujeito à capacidade disponível. Recomendamos que confirme a disponibilidade junto da organização.",
        },
        en: {
          question: "Is there return transport from Cachopo to Tavira?",
          answer:
            "Yes, the organization provides limited logistical support for transporting athletes and bikes from Cachopo to Tavira, intended for participants doing the 50km route (one-way only). This transport is limited and subject to available capacity. We recommend confirming availability with the organization.",
        },
        es: {
          question: "¿Existe transporte de regreso de Cachopo a Tavira?",
          answer:
            "Sí, la organización ofrece apoyo logístico limitado para transporte de atletas y bicicletas de Cachopo a Tavira, destinado a los participantes que realicen el recorrido de 50km (solo ida). Este transporte es limitado y está sujeto a la capacidad disponible. Recomendamos confirmar la disponibilidad con la organización.",
        },
        fr: {
          question: "Y a-t-il un transport retour de Cachopo à Tavira?",
          answer:
            "Oui, l'organisation fournit un soutien logistique limité pour le transport des athlètes et des vélos de Cachopo à Tavira, destiné aux participants effectuant le parcours de 50km (aller simple). Ce transport est limité et soumis à la capacité disponible. Nous recommandons de confirmer la disponibilité auprès de l'organisation.",
        },
        de: {
          question: "Gibt es einen Rücktransport von Cachopo nach Tavira?",
          answer:
            "Ja, die Organisation bietet begrenzte logistische Unterstützung für den Transport von Athleten und Fahrrädern von Cachopo nach Tavira, bestimmt für Teilnehmer der 50km-Strecke (nur Hinweg). Dieser Transport ist begrenzt und von der verfügbaren Kapazität abhängig. Wir empfehlen, die Verfügbarkeit bei der Organisation zu bestätigen.",
        },
        it: {
          question: "Esiste un trasporto di ritorno da Cachopo a Tavira?",
          answer:
            "Sì, l'organizzazione offre supporto logistico limitato per il trasporto di atleti e biciclette da Cachopo a Tavira, destinato ai partecipanti che effettuano il percorso di 50km (solo andata). Questo trasporto è limitato e soggetto alla capacità disponibile. Raccomandiamo di confermare la disponibilità con l'organizzazione.",
        },
      },
    },
    {
      order: 5,
      question: "O que inclui a inscrição de 15€?",
      answer:
        "A inscrição de 15€ (percurso 100km ou 50km) inclui: participação no evento, track GPS fornecido pela organização, seguro de acidentes pessoais, assistência mecânica em Cachopo, medalha 'Finisher', abastecimentos sólidos e líquidos em Cachopo e Tavira, apoio logístico para transporte Cachopo→Tavira (limitado), banhos (campo de futebol de Cachopo + Pavilhão Municipal Eduardo Mansinho em Tavira), zona de lavagem de bicicletas e saco de ofertas.",
      translations: {
        pt: {
          question: "O que inclui a inscrição de 15€?",
          answer:
            "A inscrição de 15€ (percurso 100km ou 50km) inclui: participação no evento, track GPS fornecido pela organização, seguro de acidentes pessoais, assistência mecânica em Cachopo, medalha 'Finisher', abastecimentos sólidos e líquidos em Cachopo e Tavira, apoio logístico para transporte Cachopo→Tavira (limitado), banhos (campo de futebol de Cachopo + Pavilhão Municipal Eduardo Mansinho em Tavira), zona de lavagem de bicicletas e saco de ofertas.",
        },
        en: {
          question: "What does the €15 registration include?",
          answer:
            "The €15 registration (100km or 50km route) includes: event participation, GPS track provided by the organization, personal accident insurance, mechanical support in Cachopo, 'Finisher' medal, solid and liquid refreshments in Cachopo and Tavira, logistical support for transport Cachopo→Tavira (limited), showers (Cachopo football field + Pavilhão Municipal Eduardo Mansinho in Tavira), bike washing area and gift bag.",
        },
        es: {
          question: "¿Qué incluye la inscripción de 15€?",
          answer:
            "La inscripción de 15€ (recorrido 100km o 50km) incluye: participación en el evento, track GPS proporcionado por la organización, seguro de accidentes personales, asistencia mecánica en Cachopo, medalla 'Finisher', avituallamientos sólidos y líquidos en Cachopo y Tavira, apoyo logístico para transporte Cachopo→Tavira (limitado), duchas (campo de fútbol de Cachopo + Pavilhão Municipal Eduardo Mansinho en Tavira), zona de lavado de bicicletas y bolsa de regalos.",
        },
        fr: {
          question: "Que comprend l'inscription à 15€?",
          answer:
            "L'inscription à 15€ (parcours 100km ou 50km) comprend: participation à l'événement, track GPS fourni par l'organisation, assurance accidents personnels, assistance mécanique à Cachopo, médaille 'Finisher', ravitaillements solides et liquides à Cachopo et Tavira, soutien logistique pour le transport Cachopo→Tavira (limité), douches (terrain de football de Cachopo + Pavilhão Municipal Eduardo Mansinho à Tavira), zone de lavage de vélos et sac de cadeaux.",
        },
        de: {
          question: "Was beinhaltet die 15€ Anmeldung?",
          answer:
            "Die 15€ Anmeldung (100km oder 50km Strecke) beinhaltet: Teilnahme an der Veranstaltung, GPS-Track von der Organisation bereitgestellt, persönliche Unfallversicherung, mechanische Unterstützung in Cachopo, 'Finisher'-Medaille, feste und flüssige Verpflegung in Cachopo und Tavira, logistische Unterstützung für Transport Cachopo→Tavira (begrenzt), Duschen (Fußballplatz Cachopo + Pavilhão Municipal Eduardo Mansinho in Tavira), Fahrradwaschplatz und Geschenktüte.",
        },
        it: {
          question: "Cosa include l'iscrizione di 15€?",
          answer:
            "L'iscrizione di 15€ (percorso 100km o 50km) include: partecipazione all'evento, track GPS fornito dall'organizzazione, assicurazione infortuni personali, assistenza meccanica a Cachopo, medaglia 'Finisher', ristori solidi e liquidi a Cachopo e Tavira, supporto logistico per trasporto Cachopo→Tavira (limitato), docce (campo da calcio di Cachopo + Pavilhão Municipal Eduardo Mansinho a Tavira), area lavaggio biciclette e sacchetto regalo.",
        },
      },
    },
  ];

  for (const faq of faqs) {
    // Find or create FAQ
    const existingFAQ = await prisma.eventFAQ.findFirst({
      where: { eventId: event.id, order: faq.order },
    });

    let createdFAQ;
    if (existingFAQ) {
      createdFAQ = await prisma.eventFAQ.update({
        where: { id: existingFAQ.id },
        data: {
          question: faq.question,
          answer: faq.answer,
        },
      });
    } else {
      createdFAQ = await prisma.eventFAQ.create({
        data: {
          eventId: event.id,
          order: faq.order,
          question: faq.question,
          answer: faq.answer,
        },
      });
    }

    // Upsert FAQ translations for all 6 languages
    for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
      const translation = faq.translations[lang];
      await prisma.eventFAQTranslation.upsert({
        where: { faqId_language: { faqId: createdFAQ.id, language: lang } },
        update: {
          question: translation.question,
          answer: translation.answer,
        },
        create: {
          faqId: createdFAQ.id,
          language: lang,
          question: translation.question,
          answer: translation.answer,
        },
      });
    }
  }

  console.log(`   ✅ Created/updated ${faqs.length} FAQs with translations`);

  console.log(`
🚴 5º Raid BTT Tavira - Cachopo 2026 seeded successfully!
   📍 Event: 5º Raid BTT Tavira - Cachopo
   🔗 Slug: ${event.slug}
   📅 Date: 2026-03-08
   📍 Location: Praça da República, Tavira, Faro (Algarve)
   🚴 Variants: Tavira-Cachopo-Tavira 100km, Tavira-Cachopo 50km, Estafeta
   💰 Pricing: 2 phases
   ❓ FAQs: ${faqs.length} questions with 6 language translations
  `);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding event:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
