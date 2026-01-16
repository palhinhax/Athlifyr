/**
 * Seed TCS London Marathon 2026
 * Complete with translations in all 6 languages
 * Idempotent pattern - safe to run multiple times
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding TCS London Marathon 2026...");

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: "tcs-london-marathon-2026" },
    update: {
      title: "TCS London Marathon 2026",
      description: `# 🏃 TCS London Marathon 2026

A **TCS London Marathon** é uma das maratonas mais icónicas do mundo e faz parte das prestigiadas **Abbott World Marathon Majors**. Esta será a **46ª edição** deste evento lendário, que atrai milhares de corredores de todo o mundo para as ruas de Londres.

## 📍 Percurso

**Partida:** Greenwich / Blackheath
**Chegada:** The Mall (Palácio de Buckingham)

O percurso é reconhecido pela sua beleza cénica, passando por locais emblemáticos de Londres:

- 🏛️ Greenwich e Cutty Sark
- 🌉 Tower Bridge (um dos momentos mais fotografados)
- 🏢 Canary Wharf
- 🕰️ Big Ben
- 👑 Buckingham Palace (chegada na The Mall)

### 🎯 Características do Percurso

- **Tipo:** Muito plano e rápido
- **Altitude total:** ~30m
- **Distância:** 42,195 km (Maratona oficial)
- **Limite de tempo:** 8 horas
- **Recorde do percurso (M):** Eliud Kipchoge - 2:02:37

## 🎟️ Inscrições

O acesso à TCS London Marathon funciona através de vários sistemas:

### 🎲 Ballot (Loteria)
- Abertura: Normalmente abril-maio de 2025
- Resultados: Outubro 2025
- Preços:
  - UK Standard: £69.99
  - Internacional: £120

### 🎗️ Charity Places
- Angariação mínima: £2.000 - £2.500
- Forma garantida de participação

### 🏅 Good For Age / Elite
- Qualificação por tempo
- Para atletas de elite e corredores com tempos qualificativos

### 🌍 Tour Operators Oficiais
- Pacotes disponíveis através de operadores credenciados

## 📅 Programa do Evento

**23-25 de Abril de 2026:**
- Sport Expo e levantamento de kits no ExCeL London

**26 de Abril de 2026 (Domingo):**
- Início da Maratona

## 🎽 O Que Está Incluído

✅ Medalha icónica de finisher
✅ T-shirt oficial
✅ Pacers disponíveis (com bandeira indicando tempo de chegada)
✅ Assistência médica completa
✅ Pontos de hidratação e alimentação

### 💧 Hidratação e Alimentação

- **BUXTON® Natural Mineral Water:** A cada 3 milhas (Milha 3 até 15), depois Milhas 17, 19, 21, 24
- **Lucozade Sport:** Milhas 7, 15, 21, 23
- **Lucozade Sport Gels:** Milhas 14 e 19
- **Pontos de recarga de água:** Milha 15

### 🚻 Instalações

- Casas de banho a cada milha (Milha 1 até 24)
- Casas de banho acessíveis nas milhas pares
- Absorventes e tampões nos Pontos de Informação
- Espaços especiais: Sensory Calm Space, Parent & Child Space, Multi Faith Prayer Space

## 🏆 Destaques

- 🌍 **Parte das Abbott World Marathon Majors**
- 🥇 **World Athletics Elite Label**
- 👥 **~50.000 participantes** (uma das maiores do mundo)
- ⏱️ **Tempo médio de conclusão:** ~4h30
- 🎪 **Uma das corridas mais populares e atmosféricas do mundo**

## 📲 App de Treino Oficial

**Coopah** - Coaching personalizado e adaptativo 24/7 no teu bolso. Sem planos rígidos, apenas treino que se adapta à tua vida.`,
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-04-26T08:00:00Z"),
      endDate: null,
      city: "Londres",
      country: "Reino Unido",
      latitude: 51.5014,
      longitude: -0.1419,
      googleMapsUrl: "https://www.google.com/maps?q=The+Mall,+London",
      externalUrl: "https://www.tcslondonmarathon.com",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-04-20T23:59:59Z"),
    },
    create: {
      title: "TCS London Marathon 2026",
      slug: "tcs-london-marathon-2026",
      description: `# 🏃 TCS London Marathon 2026

A **TCS London Marathon** é uma das maratonas mais icónicas do mundo e faz parte das prestigiadas **Abbott World Marathon Majors**. Esta será a **46ª edição** deste evento lendário, que atrai milhares de corredores de todo o mundo para as ruas de Londres.

## 📍 Percurso

**Partida:** Greenwich / Blackheath
**Chegada:** The Mall (Palácio de Buckingham)

O percurso é reconhecido pela sua beleza cénica, passando por locais emblemáticos de Londres:

- 🏛️ Greenwich e Cutty Sark
- 🌉 Tower Bridge (um dos momentos mais fotografados)
- 🏢 Canary Wharf
- 🕰️ Big Ben
- 👑 Buckingham Palace (chegada na The Mall)

### 🎯 Características do Percurso

- **Tipo:** Muito plano e rápido
- **Altitude total:** ~30m
- **Distância:** 42,195 km (Maratona oficial)
- **Limite de tempo:** 8 horas
- **Recorde do percurso (M):** Eliud Kipchoge - 2:02:37

## 🎟️ Inscrições

O acesso à TCS London Marathon funciona através de vários sistemas:

### 🎲 Ballot (Loteria)
- Abertura: Normalmente abril-maio de 2025
- Resultados: Outubro 2025
- Preços:
  - UK Standard: £69.99
  - Internacional: £120

### 🎗️ Charity Places
- Angariação mínima: £2.000 - £2.500
- Forma garantida de participação

### 🏅 Good For Age / Elite
- Qualificação por tempo
- Para atletas de elite e corredores com tempos qualificativos

### 🌍 Tour Operators Oficiais
- Pacotes disponíveis através de operadores credenciados

## 📅 Programa do Evento

**23-25 de Abril de 2026:**
- Sport Expo e levantamento de kits no ExCeL London

**26 de Abril de 2026 (Domingo):**
- Início da Maratona

## 🎽 O Que Está Incluído

✅ Medalha icónica de finisher
✅ T-shirt oficial
✅ Pacers disponíveis (com bandeira indicando tempo de chegada)
✅ Assistência médica completa
✅ Pontos de hidratação e alimentação

### 💧 Hidratação e Alimentação

- **BUXTON® Natural Mineral Water:** A cada 3 milhas (Milha 3 até 15), depois Milhas 17, 19, 21, 24
- **Lucozade Sport:** Milhas 7, 15, 21, 23
- **Lucozade Sport Gels:** Milhas 14 e 19
- **Pontos de recarga de água:** Milha 15

### 🚻 Instalações

- Casas de banho a cada milha (Milha 1 até 24)
- Casas de banho acessíveis nas milhas pares
- Absorventes e tampões nos Pontos de Informação
- Espaços especiais: Sensory Calm Space, Parent & Child Space, Multi Faith Prayer Space

## 🏆 Destaques

- 🌍 **Parte das Abbott World Marathon Majors**
- 🥇 **World Athletics Elite Label**
- 👥 **~50.000 participantes** (uma das maiores do mundo)
- ⏱️ **Tempo médio de conclusão:** ~4h30
- 🎪 **Uma das corridas mais populares e atmosféricas do mundo**

## 📲 App de Treino Oficial

**Coopah** - Coaching personalizado e adaptativo 24/7 no teu bolso. Sem planos rígidos, apenas treino que se adapta à tua vida.`,
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-04-26T08:00:00Z"),
      endDate: null,
      city: "Londres",
      country: "Reino Unido",
      latitude: 51.5014,
      longitude: -0.1419,
      googleMapsUrl: "https://www.google.com/maps?q=The+Mall,+London",
      externalUrl: "https://www.tcslondonmarathon.com",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-04-20T23:59:59Z"),
    },
  });

  console.log("✅ Event upserted with ID:", event.id);

  // Step 2: Upsert translations separately (ALL 6 LANGUAGES)
  const languages: Language[] = [
    Language.pt,
    Language.en,
    Language.es,
    Language.fr,
    Language.de,
    Language.it,
  ];

  const translations = {
    pt: {
      title: "TCS London Marathon 2026",
      description: `# 🏃 TCS London Marathon 2026

A **TCS London Marathon** é uma das maratonas mais icónicas do mundo e faz parte das prestigiadas **Abbott World Marathon Majors**. Esta será a **46ª edição** deste evento lendário, que atrai milhares de corredores de todo o mundo para as ruas de Londres.

## 📍 Percurso

**Partida:** Greenwich / Blackheath
**Chegada:** The Mall (Palácio de Buckingham)

O percurso é reconhecido pela sua beleza cénica, passando por locais emblemáticos de Londres como Greenwich, Tower Bridge, Canary Wharf, Big Ben e Buckingham Palace.

**Características:** Muito plano e rápido, com apenas ~30m de altitude total. Ideal para recordes pessoais.

## 🎟️ Inscrições

- **Ballot (Loteria):** £69.99 (UK) / £120 (Internacional)
- **Charity Places:** £2.000-£2.500 (angariação mínima)
- **Good For Age:** Qualificação por tempo
- **Elite:** Para atletas de elite

## 🏆 Destaques

- 🌍 Abbott World Marathon Majors
- 🥇 World Athletics Elite Label
- 👥 ~50.000 participantes
- ⏱️ Limite: 8 horas
- 🏅 Medalha icónica de finisher`,
      city: "Londres",
      metaTitle: "TCS London Marathon 2026 - Inscrições | Athlifyr",
      metaDescription:
        "Participa na TCS London Marathon 2026, uma das corridas mais icónicas do mundo. Parte das Abbott World Marathon Majors. 42km por Londres. Inscreve-te!",
    },
    en: {
      title: "TCS London Marathon 2026",
      description: `# 🏃 TCS London Marathon 2026

The **TCS London Marathon** is one of the world's most iconic marathons and part of the prestigious **Abbott World Marathon Majors**. This will be the **46th edition** of this legendary event, attracting thousands of runners from around the world to the streets of London.

## 📍 Course

**Start:** Greenwich / Blackheath
**Finish:** The Mall (Buckingham Palace)

The course is renowned for its scenic beauty, passing iconic London landmarks including Greenwich, Tower Bridge, Canary Wharf, Big Ben, and Buckingham Palace.

**Characteristics:** Very flat and fast, with only ~30m total elevation. Ideal for personal records.

## 🎟️ Registration

- **Ballot:** £69.99 (UK) / £120 (International)
- **Charity Places:** £2,000-£2,500 (minimum fundraising)
- **Good For Age:** Qualification by time
- **Elite:** For elite athletes

## 🏆 Highlights

- 🌍 Abbott World Marathon Majors
- 🥇 World Athletics Elite Label
- 👥 ~50,000 participants
- ⏱️ Time limit: 8 hours
- 🏅 Iconic finisher medal`,
      city: "London",
      metaTitle: "TCS London Marathon 2026 - Register | Athlifyr",
      metaDescription:
        "Take part in the TCS London Marathon 2026, one of the world's most iconic races. Part of Abbott World Marathon Majors. 42km through London. Register now!",
    },
    es: {
      title: "TCS London Marathon 2026",
      description: `# 🏃 TCS London Marathon 2026

El **TCS London Marathon** es uno de los maratones más icónicos del mundo y forma parte de las prestigiosas **Abbott World Marathon Majors**. Esta será la **46ª edición** de este evento legendario, que atrae a miles de corredores de todo el mundo a las calles de Londres.

## 📍 Recorrido

**Salida:** Greenwich / Blackheath
**Meta:** The Mall (Palacio de Buckingham)

El recorrido es reconocido por su belleza escénica, pasando por lugares emblemáticos de Londres como Greenwich, Tower Bridge, Canary Wharf, Big Ben y el Palacio de Buckingham.

**Características:** Muy llano y rápido, con sólo ~30m de altitud total. Ideal para récords personales.

## 🎟️ Inscripción

- **Ballot (Lotería):** £69.99 (UK) / £120 (Internacional)
- **Charity Places:** £2.000-£2.500 (recaudación mínima)
- **Good For Age:** Clasificación por tiempo
- **Elite:** Para atletas de élite

## 🏆 Destacados

- 🌍 Abbott World Marathon Majors
- 🥇 World Athletics Elite Label
- 👥 ~50.000 participantes
- ⏱️ Límite: 8 horas
- 🏅 Medalla icónica de finisher`,
      city: "Londres",
      metaTitle: "TCS London Marathon 2026 - Inscripción | Athlifyr",
      metaDescription:
        "Participa en el TCS London Marathon 2026, una de las carreras más icónicas del mundo. Parte de Abbott World Marathon Majors. 42km por Londres. ¡Inscríbete!",
    },
    fr: {
      title: "TCS London Marathon 2026",
      description: `# 🏃 TCS London Marathon 2026

Le **TCS London Marathon** est l'un des marathons les plus emblématiques au monde et fait partie des prestigieux **Abbott World Marathon Majors**. Ce sera la **46ème édition** de cet événement légendaire, attirant des milliers de coureurs du monde entier dans les rues de Londres.

## 📍 Parcours

**Départ:** Greenwich / Blackheath
**Arrivée:** The Mall (Palais de Buckingham)

Le parcours est réputé pour sa beauté panoramique, passant par des sites emblématiques de Londres comme Greenwich, Tower Bridge, Canary Wharf, Big Ben et le Palais de Buckingham.

**Caractéristiques:** Très plat et rapide, avec seulement ~30m d'altitude totale. Idéal pour les records personnels.

## 🎟️ Inscription

- **Ballot (Loterie):** £69.99 (UK) / £120 (International)
- **Charity Places:** £2.000-£2.500 (collecte minimum)
- **Good For Age:** Qualification par temps
- **Elite:** Pour les athlètes d'élite

## 🏆 Points Forts

- 🌍 Abbott World Marathon Majors
- 🥇 World Athletics Elite Label
- 👥 ~50.000 participants
- ⏱️ Limite de temps: 8 heures
- 🏅 Médaille emblématique de finisher`,
      city: "Londres",
      metaTitle: "TCS London Marathon 2026 - Inscription | Athlifyr",
      metaDescription:
        "Participez au TCS London Marathon 2026, l'une des courses les plus emblématiques au monde. Partie des Abbott World Marathon Majors. 42km à Londres. Inscrivez-vous!",
    },
    de: {
      title: "TCS London Marathon 2026",
      description: `# 🏃 TCS London Marathon 2026

Der **TCS London Marathon** ist einer der berühmtesten Marathons der Welt und Teil der prestigeträchtigen **Abbott World Marathon Majors**. Dies wird die **46. Ausgabe** dieses legendären Events sein, das Tausende von Läufern aus der ganzen Welt auf die Straßen Londons zieht.

## 📍 Strecke

**Start:** Greenwich / Blackheath
**Ziel:** The Mall (Buckingham Palace)

Die Strecke ist bekannt für ihre landschaftliche Schönheit und führt an Londoner Wahrzeichen wie Greenwich, Tower Bridge, Canary Wharf, Big Ben und Buckingham Palace vorbei.

**Eigenschaften:** Sehr flach und schnell, mit nur ~30m Gesamthöhe. Ideal für persönliche Bestzeiten.

## 🎟️ Anmeldung

- **Ballot (Lotterie):** £69.99 (UK) / £120 (International)
- **Charity Places:** £2.000-£2.500 (Mindestspendensammlung)
- **Good For Age:** Qualifikation nach Zeit
- **Elite:** Für Elite-Athleten

## 🏆 Highlights

- 🌍 Abbott World Marathon Majors
- 🥇 World Athletics Elite Label
- 👥 ~50.000 Teilnehmer
- ⏱️ Zeitlimit: 8 Stunden
- 🏅 Ikonische Finisher-Medaille`,
      city: "London",
      metaTitle: "TCS London Marathon 2026 - Anmeldung | Athlifyr",
      metaDescription:
        "Nimm am TCS London Marathon 2026 teil, einem der berühmtesten Rennen der Welt. Teil der Abbott World Marathon Majors. 42km durch London. Jetzt anmelden!",
    },
    it: {
      title: "TCS London Marathon 2026",
      description: `# 🏃 TCS London Marathon 2026

La **TCS London Marathon** è una delle maratone più iconiche al mondo e fa parte delle prestigiose **Abbott World Marathon Majors**. Questa sarà la **46ª edizione** di questo evento leggendario, che attira migliaia di corridori da tutto il mondo nelle strade di Londra.

## 📍 Percorso

**Partenza:** Greenwich / Blackheath
**Arrivo:** The Mall (Buckingham Palace)

Il percorso è rinomato per la sua bellezza panoramica, passando per luoghi emblematici di Londra come Greenwich, Tower Bridge, Canary Wharf, Big Ben e Buckingham Palace.

**Caratteristiche:** Molto pianeggiante e veloce, con solo ~30m di altitudine totale. Ideale per record personali.

## 🎟️ Iscrizione

- **Ballot (Lotteria):** £69.99 (UK) / £120 (Internazionale)
- **Charity Places:** £2.000-£2.500 (raccolta fondi minima)
- **Good For Age:** Qualificazione per tempo
- **Elite:** Per atleti d'élite

## 🏆 Punti Salienti

- 🌍 Abbott World Marathon Majors
- 🥇 World Athletics Elite Label
- 👥 ~50.000 partecipanti
- ⏱️ Limite di tempo: 8 ore
- 🏅 Medaglia iconica di finisher`,
      city: "Londra",
      metaTitle: "TCS London Marathon 2026 - Iscrizione | Athlifyr",
      metaDescription:
        "Partecipa alla TCS London Marathon 2026, una delle gare più iconiche al mondo. Parte delle Abbott World Marathon Majors. 42km per Londra. Iscriviti ora!",
    },
  };

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
        metaTitle: translations[lang].metaTitle,
        metaDescription: translations[lang].metaDescription,
      },
    });
  }

  console.log(
    "📝 Translations upserted for 6 languages (pt, en, es, fr, de, it)"
  );

  // Step 3: Upsert the marathon variant
  // Note: EventVariant does not have a unique constraint on eventId_name
  // So we use findFirst + update/create pattern for idempotency
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const findOrCreateVariant = async (name: string, data: any) => {
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

  const marathonVariant = await findOrCreateVariant("Maratona (42km)", {
    description:
      "Percurso completo de 42,195 km pelas ruas de Londres. Início em Greenwich/Blackheath e chegada na The Mall junto ao Palácio de Buckingham. Limite de tempo: 8 horas.",
    distanceKm: 42,
    elevationGainM: 30,
    elevationLossM: 30,
    startDate: new Date("2026-04-26T08:00:00Z"),
    startTime: "08:00",
    maxParticipants: 50000,
    cutoffTimeHours: 8.0,
    currency: Currency.GBP,
    itraPoints: null,
    atrpGrade: null,
    mountainLevel: null,
  });

  console.log("🏃 Marathon variant upserted with ID:", marathonVariant.id);

  // Step 4: Upsert variant translations
  const variantTranslations = {
    pt: {
      name: "Maratona (42km)",
      description:
        "Percurso completo de 42,195 km pelas ruas de Londres. Início em Greenwich/Blackheath e chegada na The Mall junto ao Palácio de Buckingham. Limite de tempo: 8 horas.",
    },
    en: {
      name: "Marathon (42km)",
      description:
        "Complete 42.195 km course through the streets of London. Start at Greenwich/Blackheath and finish at The Mall by Buckingham Palace. Time limit: 8 hours.",
    },
    es: {
      name: "Maratón (42km)",
      description:
        "Recorrido completo de 42,195 km por las calles de Londres. Salida en Greenwich/Blackheath y llegada en The Mall junto al Palacio de Buckingham. Límite de tiempo: 8 horas.",
    },
    fr: {
      name: "Marathon (42km)",
      description:
        "Parcours complet de 42,195 km dans les rues de Londres. Départ à Greenwich/Blackheath et arrivée à The Mall près du Palais de Buckingham. Limite de temps: 8 heures.",
    },
    de: {
      name: "Marathon (42km)",
      description:
        "Vollständige 42,195 km Strecke durch die Straßen Londons. Start in Greenwich/Blackheath und Ziel bei The Mall am Buckingham Palace. Zeitlimit: 8 Stunden.",
    },
    it: {
      name: "Maratona (42km)",
      description:
        "Percorso completo di 42,195 km per le strade di Londra. Partenza a Greenwich/Blackheath e arrivo a The Mall vicino a Buckingham Palace. Limite di tempo: 8 ore.",
    },
  };

  for (const lang of languages) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: marathonVariant.id,
          language: lang,
        },
      },
      update: {
        name: variantTranslations[lang].name,
        description: variantTranslations[lang].description,
      },
      create: {
        variantId: marathonVariant.id,
        language: lang,
        name: variantTranslations[lang].name,
        description: variantTranslations[lang].description,
      },
    });
  }

  console.log("📝 Variant translations upserted for 6 languages");

  // Step 5: Upsert pricing phases
  // Note: PricingPhase does not have a unique constraint on eventId_name
  // So we use findFirst + update/create pattern for idempotency
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

  // Pricing is complex with multiple systems (Ballot, Charity, International)
  // We'll create the main pricing phases based on the information provided

  await findOrCreatePricingPhase("UK Standard (Ballot)", {
    startDate: new Date("2025-04-01T00:00:00Z"),
    endDate: new Date("2026-04-20T23:59:59Z"),
    price: 69.99,
    currency: Currency.GBP,
    discountPercent: null,
    note: "Standard UK entry via ballot system. Results announced in October 2025.",
  });

  await findOrCreatePricingPhase("International Entry", {
    startDate: new Date("2025-04-01T00:00:00Z"),
    endDate: new Date("2026-04-20T23:59:59Z"),
    price: 120.0,
    currency: Currency.GBP,
    discountPercent: null,
    note: "International entry fee for non-UK participants.",
  });

  await findOrCreatePricingPhase("Charity Place (Min)", {
    startDate: new Date("2025-04-01T00:00:00Z"),
    endDate: new Date("2026-04-20T23:59:59Z"),
    price: 2000.0,
    currency: Currency.GBP,
    discountPercent: null,
    note: "Minimum fundraising commitment for guaranteed charity place. Guaranteed entry.",
  });

  console.log("💰 Pricing phases upserted (Ballot, International, Charity)");
  console.log("✅ TCS London Marathon 2026 seed completed successfully!");
  console.log("📅 Event date: Sunday, April 26, 2026");
  console.log("📍 Location: Greenwich/Blackheath → The Mall, London");
  console.log("🔗 Official website: https://www.tcslondonmarathon.com");
  console.log("🌍 Part of Abbott World Marathon Majors");
  console.log("🥇 World Athletics Elite Label");
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
