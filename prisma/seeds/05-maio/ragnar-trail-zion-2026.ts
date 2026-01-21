/**
 * Seed Ragnar Trail Zion 2026
 * Complete with translations in all 6 languages
 * Idempotent pattern - safe to run multiple times
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏔️ Seeding Ragnar Trail Zion 2026...");

  const languages: Language[] = [
    Language.pt,
    Language.en,
    Language.es,
    Language.fr,
    Language.de,
    Language.it,
  ];

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: "ragnar-trail-zion-2026" },
    update: {
      title: "Ragnar Trail Zion",
      description: `# 🏔️ Ragnar Trail Zion 2026

O **Ragnar Trail Zion** é o evento de trail relay mais popular da série Ragnar — uma das corridas de estafetas em trilhos mais deslumbrantes que alguma vez vais fazer!

Com comodidades premium, paisagens de cortar a respiração e festividades vibrantes no acampamento, este evento esgotou em 2025. **Regista-te cedo para garantir o teu lugar!**

## 🏃 O Formato

Corrida em estafeta por equipas durante **2 dias e 1 noite**, com loops rotativos:

### Loops do Circuito

- **🌿 Green Loop** — 5-6.5 km (singletrack florestal)
- **🌼 Yellow Loop** — 8-10.5 km (double track + jeep trail)
- **🔴 Red Loop** — 11-13.5 km (técnico + vistas épicas de Zion)

**Cada corredor faz todos os loops**, em rotação contínua durante 24 horas.

## 📊 Estatísticas

### Equipa Standard (8 corredores)

- **Distância total:** 200.8 km (124.8 milhas)
- **Por corredor:** ~25.1 km (15.6 milhas)
- **Ganho de elevação total:** 4,574 m (15,016 pés)
- **Ganho por corredor:** ~572 m (1,877 pés)

### Equipa Ultra (4 corredores)

- **Distância total:** 200.8 km (124.8 milhas)
- **Por corredor:** ~50.2 km (31.2 milhas)
- **Ganho de elevação total:** 4,574 m (15,016 pés)
- **Ganho por corredor:** ~1,144 m (3,754 pés)

## 🏕️ Ragnar Village — A Tua Casa no Fim de Semana

Acampa no **Zion Ponderosa Resort** com comodidades premium:

- 🏊 **Piscina e jacuzzis** para relaxar
- 🚿 **Duches e casas de banho** com conforto
- 🧗‍♂️ **Parede de escalada** para diversão extra
- 🍔 **Food trucks e restaurantes** no local
- 🔥 **Fogueiras e marshmallows** ao final do dia
- 🌌 **Céu estrelado do deserto** — experiência dark-sky única

**Opções de alojamento:** camping, Rent-A-Tent, cabanas, tiny homes, wagons Conestoga, e mais!

## 🏔️ O Terreno

Corre com o famoso **"Checkerboard Mesa"** de Zion e **Cedar Breaks** como cenário de fundo:

- Trilhos de **argila vermelha** e pedra
- **Singletrack, double track, e jeep trails**
- Florestas de **pinheiros imponentes**
- **Vistas vastas do Zion National Park**

## ☀️🌙 Clima Esperado (Maio)

- **Dia:** 24-28 °C (70s-80s °F)
- **Noite:** 4-10 °C (40s °F)
- **Altitude:** ~1,950 m — amplitude térmica significativa

## 📍 Localização e Acesso

**Zion Ponderosa Ranch**
Twin Knolls Rd, Orderville, UT 84758, USA

**Aeroportos:**
- ✈️ **Las Vegas (LAS)** — ~2h20 de carro (principal)
- ✈️ **Salt Lake City (SLC)** — ~4h30 de carro
- ✈️ **St. George (SGU)** — ~1h30 de carro (regional)

## ✨ O Que Está Incluído

- 🏅 **Medalhas de equipa** (montáveis)
- 👕 **T-shirt de finisher** para toda a equipa
- 🎁 **Gifts do capitão** e amostras de parceiros
- 🎶 **Música ao vivo** e ambiente de festival
- 🚿 **Acesso a duches, piscina e comodidades premium**

## 📣 Aviso Importante

**Este evento está 90% esgotado!** Regista-te agora para garantires o teu lugar.`,
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-05-08T15:00:00Z"), // May 8, 2026, 9:00 AM MDT (UTC-6)
      endDate: new Date("2026-05-10T02:00:00Z"), // May 9, 2026, ~8:00 PM MDT
      city: "Orderville",
      country: "USA",
      latitude: 37.277685,
      longitude: -112.86124,
      googleMapsUrl: "https://maps.google.com/?q=37.277685,-112.861240",
      externalUrl: "https://runragnar.com/pages/race-trail-zion",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-05-07T23:59:59Z"),
    },
    create: {
      title: "Ragnar Trail Zion",
      slug: "ragnar-trail-zion-2026",
      description: `# 🏔️ Ragnar Trail Zion 2026

O **Ragnar Trail Zion** é o evento de trail relay mais popular da série Ragnar — uma das corridas de estafetas em trilhos mais deslumbrantes que alguma vez vais fazer!

Com comodidades premium, paisagens de cortar a respiração e festividades vibrantes no acampamento, este evento esgotou em 2025. **Regista-te cedo para garantir o teu lugar!**

## 🏃 O Formato

Corrida em estafeta por equipas durante **2 dias e 1 noite**, com loops rotativos:

### Loops do Circuito

- **🌿 Green Loop** — 5-6.5 km (singletrack florestal)
- **🌼 Yellow Loop** — 8-10.5 km (double track + jeep trail)
- **🔴 Red Loop** — 11-13.5 km (técnico + vistas épicas de Zion)

**Cada corredor faz todos os loops**, em rotação contínua durante 24 horas.

## 📊 Estatísticas

### Equipa Standard (8 corredores)

- **Distância total:** 200.8 km (124.8 milhas)
- **Por corredor:** ~25.1 km (15.6 milhas)
- **Ganho de elevação total:** 4,574 m (15,016 pés)
- **Ganho por corredor:** ~572 m (1,877 pés)

### Equipa Ultra (4 corredores)

- **Distância total:** 200.8 km (124.8 milhas)
- **Por corredor:** ~50.2 km (31.2 milhas)
- **Ganho de elevação total:** 4,574 m (15,016 pés)
- **Ganho por corredor:** ~1,144 m (3,754 pés)

## 🏕️ Ragnar Village — A Tua Casa no Fim de Semana

Acampa no **Zion Ponderosa Resort** com comodidades premium:

- 🏊 **Piscina e jacuzzis** para relaxar
- 🚿 **Duches e casas de banho** com conforto
- 🧗‍♂️ **Parede de escalada** para diversão extra
- 🍔 **Food trucks e restaurantes** no local
- 🔥 **Fogueiras e marshmallows** ao final do dia
- 🌌 **Céu estrelado do deserto** — experiência dark-sky única

**Opções de alojamento:** camping, Rent-A-Tent, cabanas, tiny homes, wagons Conestoga, e mais!

## 🏔️ O Terreno

Corre com o famoso **"Checkerboard Mesa"** de Zion e **Cedar Breaks** como cenário de fundo:

- Trilhos de **argila vermelha** e pedra
- **Singletrack, double track, e jeep trails**
- Florestas de **pinheiros imponentes**
- **Vistas vastas do Zion National Park**

## ☀️🌙 Clima Esperado (Maio)

- **Dia:** 24-28 °C (70s-80s °F)
- **Noite:** 4-10 °C (40s °F)
- **Altitude:** ~1,950 m — amplitude térmica significativa

## 📍 Localização e Acesso

**Zion Ponderosa Ranch**
Twin Knolls Rd, Orderville, UT 84758, USA

**Aeroportos:**
- ✈️ **Las Vegas (LAS)** — ~2h20 de carro (principal)
- ✈️ **Salt Lake City (SLC)** — ~4h30 de carro
- ✈️ **St. George (SGU)** — ~1h30 de carro (regional)

## ✨ O Que Está Incluído

- 🏅 **Medalhas de equipa** (montáveis)
- 👕 **T-shirt de finisher** para toda a equipa
- 🎁 **Gifts do capitão** e amostras de parceiros
- 🎶 **Música ao vivo** e ambiente de festival
- 🚿 **Acesso a duches, piscina e comodidades premium**

## 📣 Aviso Importante

**Este evento está 90% esgotado!** Regista-te agora para garantires o teu lugar.`,
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-05-08T15:00:00Z"), // May 8, 2026, 9:00 AM MDT (UTC-6)
      endDate: new Date("2026-05-10T02:00:00Z"), // May 9, 2026, ~8:00 PM MDT
      city: "Orderville",
      country: "USA",
      latitude: 37.277685,
      longitude: -112.86124,
      googleMapsUrl: "https://maps.google.com/?q=37.277685,-112.861240",
      externalUrl: "https://runragnar.com/pages/race-trail-zion",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-05-07T23:59:59Z"),
    },
  });

  console.log("✅ Event upserted:", event.title);

  // Step 2: Upsert translations for all 6 languages
  const translations = {
    pt: {
      title: "Ragnar Trail Zion",
      description: `# 🏔️ Ragnar Trail Zion 2026

O evento de trail relay mais popular da série Ragnar! Paisagens deslumbrantes de Zion National Park, comodidades premium e festividades vibrantes.

## 🏃 O Formato

Corrida em estafeta por equipas durante 2 dias e 1 noite. 3 loops rotativos: Green (5-6.5km), Yellow (8-10.5km), Red (11-13.5km). Total: 200.8 km com 4,574m D+.

## 🏕️ Ragnar Village

Acampa no Zion Ponderosa Resort: piscina, jacuzzis, duches, escalada, food trucks, música ao vivo e céu estrelado do deserto.

## 📊 Equipas

- **Standard (8 corredores):** ~25km por pessoa
- **Ultra (4 corredores):** ~50km por pessoa

## 📍 Localização

Zion Ponderosa Ranch, Orderville, Utah, USA. Aeroportos: Las Vegas (2h20), Salt Lake City (4h30), St. George (1h30).`,
      city: "Orderville",
      metaTitle: "Ragnar Trail Zion 2026 - 8-9 Maio | Orderville, Utah",
      metaDescription:
        "Ragnar Trail Zion 2026 a 8-9 de maio em Orderville, Utah. Trail relay por equipas: 200.8km, 4574m D+. Equipas Standard (8) e Ultra (4). 90% esgotado!",
    },
    en: {
      title: "Ragnar Trail Zion",
      description: `# 🏔️ Ragnar Trail Zion 2026

The most popular trail relay event in the Ragnar series! Breathtaking Zion National Park landscapes, premium amenities, and vibrant village festivities.

## 🏃 The Format

Team relay race over 2 days and 1 night. 3 rotating loops: Green (5-6.5km), Yellow (8-10.5km), Red (11-13.5km). Total: 200.8 km with 4,574m elevation gain.

## 🏕️ Ragnar Village

Camp at Zion Ponderosa Resort: pool, hot tubs, showers, rock climbing, food trucks, live music, and desert starry skies.

## 📊 Teams

- **Standard Team (8 runners):** ~25km per person
- **Ultra Team (4 runners):** ~50km per person

## 📍 Location

Zion Ponderosa Ranch, Orderville, Utah, USA. Airports: Las Vegas (2h20), Salt Lake City (4h30), St. George (1h30).`,
      city: "Orderville",
      metaTitle: "Ragnar Trail Zion 2026 - May 8-9 | Orderville, Utah",
      metaDescription:
        "Ragnar Trail Zion 2026 on May 8-9 in Orderville, Utah. Team trail relay: 200.8km, 4574m elevation gain. Standard (8) and Ultra (4) teams. 90% sold out!",
    },
    es: {
      title: "Ragnar Trail Zion",
      description: `# 🏔️ Ragnar Trail Zion 2026

¡El evento de trail relay más popular de la serie Ragnar! Paisajes impresionantes del Parque Nacional Zion, instalaciones premium y festividades vibrantes.

## 🏃 El Formato

Carrera de relevos por equipos durante 2 días y 1 noche. 3 bucles rotativos: Green (5-6.5km), Yellow (8-10.5km), Red (11-13.5km). Total: 200.8 km con 4,574m D+.

## 🏕️ Ragnar Village

Acampa en Zion Ponderosa Resort: piscina, jacuzzis, duchas, escalada, food trucks, música en vivo y cielos estrellados del desierto.

## 📊 Equipos

- **Equipo Standard (8 corredores):** ~25km por persona
- **Equipo Ultra (4 corredores):** ~50km por persona

## 📍 Ubicación

Zion Ponderosa Ranch, Orderville, Utah, USA. Aeropuertos: Las Vegas (2h20), Salt Lake City (4h30), St. George (1h30).`,
      city: "Orderville",
      metaTitle: "Ragnar Trail Zion 2026 - 8-9 Mayo | Orderville, Utah",
      metaDescription:
        "Ragnar Trail Zion 2026 el 8-9 de mayo en Orderville, Utah. Trail relay por equipos: 200.8km, 4574m D+. Equipos Standard (8) y Ultra (4). ¡90% agotado!",
    },
    fr: {
      title: "Ragnar Trail Zion",
      description: `# 🏔️ Ragnar Trail Zion 2026

L'événement de trail relay le plus populaire de la série Ragnar ! Paysages époustouflants du parc national de Zion, équipements premium et festivités animées.

## 🏃 Le Format

Course de relais par équipes pendant 2 jours et 1 nuit. 3 boucles rotatives : Green (5-6.5km), Yellow (8-10.5km), Red (11-13.5km). Total : 200.8 km avec 4,574m D+.

## 🏕️ Ragnar Village

Campez au Zion Ponderosa Resort : piscine, jacuzzis, douches, escalade, food trucks, musique live et ciel étoilé du désert.

## 📊 Équipes

- **Équipe Standard (8 coureurs) :** ~25km par personne
- **Équipe Ultra (4 coureurs) :** ~50km par personne

## 📍 Emplacement

Zion Ponderosa Ranch, Orderville, Utah, USA. Aéroports : Las Vegas (2h20), Salt Lake City (4h30), St. George (1h30).`,
      city: "Orderville",
      metaTitle: "Ragnar Trail Zion 2026 - 8-9 Mai | Orderville, Utah",
      metaDescription:
        "Ragnar Trail Zion 2026 le 8-9 mai à Orderville, Utah. Trail relay par équipes : 200.8km, 4574m D+. Équipes Standard (8) et Ultra (4). 90% épuisé !",
    },
    de: {
      title: "Ragnar Trail Zion",
      description: `# 🏔️ Ragnar Trail Zion 2026

Das beliebteste Trail-Relay-Event der Ragnar-Serie! Atemberaubende Landschaften des Zion-Nationalparks, Premium-Annehmlichkeiten und lebhafte Festivitäten.

## 🏃 Das Format

Team-Staffellauf über 2 Tage und 1 Nacht. 3 rotierende Schleifen: Green (5-6.5km), Yellow (8-10.5km), Red (11-13.5km). Gesamt: 200.8 km mit 4,574m Höhenunterschied.

## 🏕️ Ragnar Village

Zelten Sie im Zion Ponderosa Resort: Pool, Whirlpools, Duschen, Klettern, Food Trucks, Live-Musik und Wüstensternenhimmel.

## 📊 Teams

- **Standard-Team (8 Läufer):** ~25km pro Person
- **Ultra-Team (4 Läufer):** ~50km pro Person

## 📍 Standort

Zion Ponderosa Ranch, Orderville, Utah, USA. Flughäfen: Las Vegas (2h20), Salt Lake City (4h30), St. George (1h30).`,
      city: "Orderville",
      metaTitle: "Ragnar Trail Zion 2026 - 8.-9. Mai | Orderville, Utah",
      metaDescription:
        "Ragnar Trail Zion 2026 am 8.-9. Mai in Orderville, Utah. Team Trail Relay: 200.8km, 4574m Höhenunterschied. Standard (8) und Ultra (4) Teams. 90% ausverkauft!",
    },
    it: {
      title: "Ragnar Trail Zion",
      description: `# 🏔️ Ragnar Trail Zion 2026

L'evento di trail relay più popolare della serie Ragnar! Paesaggi mozzafiato del Parco Nazionale di Zion, servizi premium e festività vivaci.

## 🏃 Il Formato

Gara di staffetta a squadre per 2 giorni e 1 notte. 3 anelli rotanti: Green (5-6.5km), Yellow (8-10.5km), Red (11-13.5km). Totale: 200.8 km con 4,574m D+.

## 🏕️ Ragnar Village

Campeggia al Zion Ponderosa Resort: piscina, vasche idromassaggio, docce, arrampicata, food truck, musica dal vivo e cieli stellati del deserto.

## 📊 Squadre

- **Squadra Standard (8 corridori):** ~25km a persona
- **Squadra Ultra (4 corridori):** ~50km a persona

## 📍 Posizione

Zion Ponderosa Ranch, Orderville, Utah, USA. Aeroporti: Las Vegas (2h20), Salt Lake City (4h30), St. George (1h30).`,
      city: "Orderville",
      metaTitle: "Ragnar Trail Zion 2026 - 8-9 Maggio | Orderville, Utah",
      metaDescription:
        "Ragnar Trail Zion 2026 l'8-9 maggio a Orderville, Utah. Trail relay a squadre: 200.8km, 4574m D+. Squadre Standard (8) e Ultra (4). 90% esaurito!",
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

  // Step 3: Upsert variants
  // Helper function to find or create variants
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

  // Variant 1: Standard Team (8 runners)
  const variantStandard = await findOrCreateVariant(
    "Standard Team (8 Runners)",
    {
      description:
        "Equipa standard de 8 corredores. Cada corredor faz ~25km com ~572m D+.",
      distanceKm: 201, // 200.8 km rounded
      elevationGainM: 4574,
      maxParticipants: 8,
      startDate: new Date("2026-05-08T15:00:00Z"),
      startTime: "09:00",
    }
  );

  console.log("✅ Variant upserted: Standard Team (8 Runners)");

  // Variant 2: Ultra Team (4 runners)
  const variantUltra = await findOrCreateVariant("Ultra Team (4 Runners)", {
    description:
      "Equipa ultra de 4 corredores. Cada corredor faz ~50km com ~1,144m D+.",
    distanceKm: 201, // 200.8 km rounded
    elevationGainM: 4574,
    maxParticipants: 4,
    startDate: new Date("2026-05-08T15:00:00Z"),
    startTime: "09:00",
  });

  console.log("✅ Variant upserted: Ultra Team (4 Runners)");

  // Step 4: Upsert variant translations for all 6 languages
  const variantTranslations = {
    standard: {
      pt: {
        name: "Equipa Standard (8 Corredores)",
        description:
          "Equipa standard de 8 corredores. Cada corredor faz ~25km com ~572m D+. Total: 200.8km com 4,574m D+.",
      },
      en: {
        name: "Standard Team (8 Runners)",
        description:
          "Standard team of 8 runners. Each runner covers ~25km with ~572m elevation gain. Total: 200.8km with 4,574m elevation gain.",
      },
      es: {
        name: "Equipo Standard (8 Corredores)",
        description:
          "Equipo estándar de 8 corredores. Cada corredor hace ~25km con ~572m D+. Total: 200.8km con 4,574m D+.",
      },
      fr: {
        name: "Équipe Standard (8 Coureurs)",
        description:
          "Équipe standard de 8 coureurs. Chaque coureur parcourt ~25km avec ~572m D+. Total : 200.8km avec 4,574m D+.",
      },
      de: {
        name: "Standard-Team (8 Läufer)",
        description:
          "Standard-Team mit 8 Läufern. Jeder Läufer läuft ~25km mit ~572m Höhenunterschied. Gesamt: 200.8km mit 4,574m Höhenunterschied.",
      },
      it: {
        name: "Squadra Standard (8 Corridori)",
        description:
          "Squadra standard di 8 corridori. Ogni corridore percorre ~25km con ~572m D+. Totale: 200.8km con 4,574m D+.",
      },
    },
    ultra: {
      pt: {
        name: "Equipa Ultra (4 Corredores)",
        description:
          "Equipa ultra de 4 corredores. Cada corredor faz ~50km com ~1,144m D+. Total: 200.8km com 4,574m D+.",
      },
      en: {
        name: "Ultra Team (4 Runners)",
        description:
          "Ultra team of 4 runners. Each runner covers ~50km with ~1,144m elevation gain. Total: 200.8km with 4,574m elevation gain.",
      },
      es: {
        name: "Equipo Ultra (4 Corredores)",
        description:
          "Equipo ultra de 4 corredores. Cada corredor hace ~50km con ~1,144m D+. Total: 200.8km con 4,574m D+.",
      },
      fr: {
        name: "Équipe Ultra (4 Coureurs)",
        description:
          "Équipe ultra de 4 coureurs. Chaque coureur parcourt ~50km avec ~1,144m D+. Total : 200.8km avec 4,574m D+.",
      },
      de: {
        name: "Ultra-Team (4 Läufer)",
        description:
          "Ultra-Team mit 4 Läufern. Jeder Läufer läuft ~50km mit ~1,144m Höhenunterschied. Gesamt: 200.8km mit 4,574m Höhenunterschied.",
      },
      it: {
        name: "Squadra Ultra (4 Corridori)",
        description:
          "Squadra ultra di 4 corridori. Ogni corridore percorre ~50km con ~1,144m D+. Totale: 200.8km con 4,574m D+.",
      },
    },
  };

  // Upsert translations for Standard Team variant
  for (const lang of languages) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: variantStandard.id,
          language: lang,
        },
      },
      update: {
        name: variantTranslations.standard[lang].name,
        description: variantTranslations.standard[lang].description,
      },
      create: {
        variantId: variantStandard.id,
        language: lang,
        name: variantTranslations.standard[lang].name,
        description: variantTranslations.standard[lang].description,
      },
    });
  }

  // Upsert translations for Ultra Team variant
  for (const lang of languages) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: variantUltra.id,
          language: lang,
        },
      },
      update: {
        name: variantTranslations.ultra[lang].name,
        description: variantTranslations.ultra[lang].description,
      },
      create: {
        variantId: variantUltra.id,
        language: lang,
        name: variantTranslations.ultra[lang].name,
        description: variantTranslations.ultra[lang].description,
      },
    });
  }

  console.log("📝 Variant translations upserted for 6 languages");

  // Step 5: Upsert pricing phases (linked to eventId, NOT variantId)
  // Helper function for idempotent pricing phase creation
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
          eventId: event.id, // ALWAYS use eventId, NEVER variantId
          name,
          ...data,
        },
      });
    }
  };

  // Pricing for Standard Team (8 runners)
  await findOrCreatePricingPhase("Standard Team (8 Runners) - Registration", {
    startDate: new Date("2025-11-01T00:00:00Z"),
    endDate: new Date("2026-05-07T23:59:59Z"),
    price: 1645.0,
    currency: Currency.USD,
    discountPercent: null,
    note: "Full registration price for Standard Team of 8 runners ($205 per runner). Price inclusive of ALL fees.",
  });

  // Pricing for Ultra Team (4 runners)
  await findOrCreatePricingPhase("Ultra Team (4 Runners) - Registration", {
    startDate: new Date("2025-11-01T00:00:00Z"),
    endDate: new Date("2026-05-07T23:59:59Z"),
    price: 950.0,
    currency: Currency.USD,
    discountPercent: null,
    note: "Full registration price for Ultra Team of 4 runners ($237 per runner). Price inclusive of ALL fees.",
  });

  console.log("💰 Pricing phases upserted (linked to eventId)");

  console.log("\n✅ Ragnar Trail Zion 2026 seed completed successfully!");
  console.log("📊 Summary:");
  console.log("   - Event created/updated with full details");
  console.log("   - 6 language translations (pt, en, es, fr, de, it)");
  console.log("   - 2 variants: Standard Team (8) and Ultra Team (4)");
  console.log("   - Variant translations in 6 languages");
  console.log("   - 2 pricing phases linked to eventId");
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
