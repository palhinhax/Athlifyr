/**
 * Seed Ragnar Trail Appalachians Team Races 2026
 * Complete with translations in all 6 languages
 * 
 * Event: Ragnar Trail Appalachians Team Races
 * Date: August 7-8, 2026
 * Location: Big Bear Camplands, Bruceton Mills, WV, USA
 * Sport: Trail Running
 * 
 * Description: One of the best running festivals on the East Coast featuring
 * 117 miles of tree-lined trails through dense Appalachian forests. Three team
 * variants available: Standard Team (8 runners), Ultra Team (4 runners), and
 * Black Loop (2 runners). Includes Ragnar Village celebration, camping under
 * the stars, live music, and more.
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Ragnar Trail Appalachians Team Races 2026...");

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: "ragnar-trail-appalachians-2026" },
    update: {
      title: "Ragnar Trail Appalachians Team Races",
      description: `## 🏔️ Ragnar Trail Appalachians 2026

**Fuja da cidade para uma experiência única de trail running nos Apalaches!**

### 🌲 O Evento

Escape das luzes da cidade e acampe sob um céu estrelado enquanto navega por trilhos rodeados de fetos colossais e pinheiros imponentes. Uma experiência que captura a essência do Parque Jurássico — mas sem os dinossauros!

**Um dos melhores festivais de corrida da Costa Leste dos EUA.**

### 📏 O Percurso

- **Distância Total:** 117 milhas (188 km)
- **Desnível Positivo:** 427 pés (130 metros)
- **Terreno:** Três trilhos emocionantes ladeados por árvores através de densas florestas, fetos luxuriantes e pinheiros dos Apalaches

### 👥 Modalidades de Equipa

**Standard Team (8 corredores)**
- ~14.6 milhas por corredor
- 2 dias, 1 noite

**Ultra Team (4 corredores)**
- ~29.25 milhas por corredor
- 2 dias, 1 noite

**Black Loop (2 corredores)**
- ~58.5 milhas por corredor
- 2 dias, 1 noite

### 🎉 Ragnar Village

**Celebração e Atividades:**
- 🔥 Fogueiras e marshmallows
- 🎵 Música ao vivo na quinta-feira à noite
- 🏕️ Glamping disponível
- 🚿 Balneários no local
- 🍔 Food trucks
- 🌲 Amplo espaço para acampar (incluindo na floresta)

### 🎁 O Que Está Incluído

- Amostras de parceiros
- Presente do capitão
- Medalhas de equipa
- T-shirts de finalista da equipa

### ☀️ Clima

- **Dia:** Temperaturas quentes (24-28°C)
- **Noite:** Temperaturas frescas (7-12°C)
- Condições perfeitas para aventuras ao ar livre com muito sol

**Uma experiência inesquecível nas belíssimas florestas dos Apalaches!** 🌲✨`,
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-08-07T08:00:00Z"),
      endDate: new Date("2026-08-08T20:00:00Z"),
      city: "Bruceton Mills",
      country: "Estados Unidos",
      latitude: 39.67,
      longitude: -79.63,
      googleMapsUrl: "https://www.google.com/maps?q=39.6700,-79.6300",
      externalUrl: "https://www.runragnar.com/event-detail/trail/trail_appalachians",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-08-06T23:59:59Z"),
    },
    create: {
      title: "Ragnar Trail Appalachians Team Races",
      slug: "ragnar-trail-appalachians-2026",
      description: `## 🏔️ Ragnar Trail Appalachians 2026

**Fuja da cidade para uma experiência única de trail running nos Apalaches!**

### 🌲 O Evento

Escape das luzes da cidade e acampe sob um céu estrelado enquanto navega por trilhos rodeados de fetos colossais e pinheiros imponentes. Uma experiência que captura a essência do Parque Jurássico — mas sem os dinossauros!

**Um dos melhores festivais de corrida da Costa Leste dos EUA.**

### 📏 O Percurso

- **Distância Total:** 117 milhas (188 km)
- **Desnível Positivo:** 427 pés (130 metros)
- **Terreno:** Três trilhos emocionantes ladeados por árvores através de densas florestas, fetos luxuriantes e pinheiros dos Apalaches

### 👥 Modalidades de Equipa

**Standard Team (8 corredores)**
- ~14.6 milhas por corredor
- 2 dias, 1 noite

**Ultra Team (4 corredores)**
- ~29.25 milhas por corredor
- 2 dias, 1 noite

**Black Loop (2 corredores)**
- ~58.5 milhas por corredor
- 2 dias, 1 noite

### 🎉 Ragnar Village

**Celebração e Atividades:**
- 🔥 Fogueiras e marshmallows
- 🎵 Música ao vivo na quinta-feira à noite
- 🏕️ Glamping disponível
- 🚿 Balneários no local
- 🍔 Food trucks
- 🌲 Amplo espaço para acampar (incluindo na floresta)

### 🎁 O Que Está Incluído

- Amostras de parceiros
- Presente do capitão
- Medalhas de equipa
- T-shirts de finalista da equipa

### ☀️ Clima

- **Dia:** Temperaturas quentes (24-28°C)
- **Noite:** Temperaturas frescas (7-12°C)
- Condições perfeitas para aventuras ao ar livre com muito sol

**Uma experiência inesquecível nas belíssimas florestas dos Apalaches!** 🌲✨`,
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-08-07T08:00:00Z"),
      endDate: new Date("2026-08-08T20:00:00Z"),
      city: "Bruceton Mills",
      country: "Estados Unidos",
      latitude: 39.67,
      longitude: -79.63,
      googleMapsUrl: "https://www.google.com/maps?q=39.6700,-79.6300",
      externalUrl: "https://www.runragnar.com/event-detail/trail/trail_appalachians",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-08-06T23:59:59Z"),
    },
  });

  console.log("✅ Event upserted with ID:", event.id);

  // Step 2: Upsert translations separately (ALL 6 LANGUAGES)
  const translations = [
    {
      language: Language.pt,
      title: "Ragnar Trail Appalachians Team Races",
      description: `## 🏔️ Ragnar Trail Appalachians 2026

**Fuja da cidade para uma experiência única de trail running nos Apalaches!**

### 🌲 O Evento

Escape das luzes da cidade e acampe sob um céu estrelado enquanto navega por trilhos rodeados de fetos colossais e pinheiros imponentes. Uma experiência que captura a essência do Parque Jurássico — mas sem os dinossauros!

**Um dos melhores festivais de corrida da Costa Leste dos EUA.**

### 📏 O Percurso

- **Distância Total:** 117 milhas (188 km)
- **Desnível Positivo:** 427 pés (130 metros)
- **Terreno:** Três trilhos emocionantes ladeados por árvores através de densas florestas, fetos luxuriantes e pinheiros dos Apalaches

### 👥 Modalidades de Equipa

**Standard Team (8 corredores)**
- ~14.6 milhas por corredor
- 2 dias, 1 noite

**Ultra Team (4 corredores)**
- ~29.25 milhas por corredor
- 2 dias, 1 noite

**Black Loop (2 corredores)**
- ~58.5 milhas por corredor
- 2 dias, 1 noite

### 🎉 Ragnar Village

**Celebração e Atividades:**
- 🔥 Fogueiras e marshmallows
- 🎵 Música ao vivo na quinta-feira à noite
- 🏕️ Glamping disponível
- 🚿 Balneários no local
- 🍔 Food trucks
- 🌲 Amplo espaço para acampar (incluindo na floresta)

### 🎁 O Que Está Incluído

- Amostras de parceiros
- Presente do capitão
- Medalhas de equipa
- T-shirts de finalista da equipa

### ☀️ Clima

- **Dia:** Temperaturas quentes (24-28°C)
- **Noite:** Temperaturas frescas (7-12°C)
- Condições perfeitas para aventuras ao ar livre com muito sol

**Uma experiência inesquecível nas belíssimas florestas dos Apalaches!** 🌲✨`,
      city: "Bruceton Mills",
      metaTitle: "Ragnar Trail Appalachians 2026 - Festival de Trail Running nos Apalaches | Athlifyr",
      metaDescription: "Participa no Ragnar Trail Appalachians 2026, um dos melhores festivais de trail running da Costa Leste. 117 milhas através de florestas densas dos Apalaches. 3 modalidades de equipa disponíveis.",
    },
    {
      language: Language.en,
      title: "Ragnar Trail Appalachians Team Races",
      description: `## 🏔️ Ragnar Trail Appalachians 2026

**Escape the city for a one-of-a-kind Appalachian trail running experience!**

### 🌲 The Event

Trade in city lights for camping under a canopy of stars while navigating trails surrounded by colossal ferns and towering pines. An experience that captures the essence of Jurassic Park — minus the dinosaurs!

**One of the best running festivals on the East Coast.**

### 📏 The Course

- **Total Distance:** 117 miles (188 km)
- **Elevation Gain:** 427 feet (130 meters)
- **Terrain:** Three exhilarating tree-lined trails through dense forests, lush ferns, and Appalachian pines

### 👥 Team Types

**Standard Team (8 runners)**
- ~14.6 miles per runner
- 2 days, 1 night

**Ultra Team (4 runners)**
- ~29.25 miles per runner
- 2 days, 1 night

**Black Loop (2 runners)**
- ~58.5 miles per runner
- 2 days, 1 night

### 🎉 Ragnar Village

**Celebration & Activities:**
- 🔥 Bonfires and s'mores
- 🎵 Live music on Thursday night
- 🏕️ Glamping available
- 🚿 Onsite showers
- 🍔 Food trucks
- 🌲 Ample camping space (including in the woods)

### 🎁 What's Included

- Partner samples
- Captain's gift
- Team medals
- Team finisher shirts

### ☀️ Weather

- **Day:** Warm temperatures (mid-70s to low 80s°F / 24-28°C)
- **Night:** Cool temperatures (mid-40s to low 50s°F / 7-12°C)
- Perfect conditions for outdoor adventures with plenty of sunshine

**An unforgettable experience in the beautiful Appalachian forests!** 🌲✨`,
      city: "Bruceton Mills",
      metaTitle: "Ragnar Trail Appalachians 2026 - Appalachian Trail Running Festival | Athlifyr",
      metaDescription: "Join Ragnar Trail Appalachians 2026, one of the best running festivals on the East Coast. 117 miles through dense Appalachian forests. 3 team types available.",
    },
    {
      language: Language.es,
      title: "Ragnar Trail Appalachians Team Races",
      description: `## 🏔️ Ragnar Trail Appalachians 2026

**¡Escapa de la ciudad para una experiencia única de trail running en los Apalaches!**

### 🌲 El Evento

Cambia las luces de la ciudad por acampar bajo un cielo estrellado mientras navegas senderos rodeados de helechos colosales y pinos imponentes. ¡Una experiencia que captura la esencia de Parque Jurásico — pero sin los dinosaurios!

**Uno de los mejores festivales de running de la Costa Este de EE.UU.**

### 📏 El Recorrido

- **Distancia Total:** 117 millas (188 km)
- **Desnivel Positivo:** 427 pies (130 metros)
- **Terreno:** Tres emocionantes senderos arbolados a través de densos bosques, helechos exuberantes y pinos de los Apalaches

### 👥 Tipos de Equipos

**Standard Team (8 corredores)**
- ~14.6 millas por corredor
- 2 días, 1 noche

**Ultra Team (4 corredores)**
- ~29.25 millas por corredor
- 2 días, 1 noche

**Black Loop (2 corredores)**
- ~58.5 millas por corredor
- 2 días, 1 noche

### 🎉 Ragnar Village

**Celebración y Actividades:**
- 🔥 Fogatas y malvaviscos
- 🎵 Música en vivo el jueves por la noche
- 🏕️ Glamping disponible
- 🚿 Duchas en el lugar
- 🍔 Food trucks
- 🌲 Amplio espacio para acampar (incluyendo en el bosque)

### 🎁 Qué Está Incluido

- Muestras de socios
- Regalo del capitán
- Medallas de equipo
- Camisetas de finalista del equipo

### ☀️ Clima

- **Día:** Temperaturas cálidas (24-28°C)
- **Noche:** Temperaturas frescas (7-12°C)
- Condiciones perfectas para aventuras al aire libre con mucho sol

**¡Una experiencia inolvidable en los hermosos bosques de los Apalaches!** 🌲✨`,
      city: "Bruceton Mills",
      metaTitle: "Ragnar Trail Appalachians 2026 - Festival de Trail Running en los Apalaches | Athlifyr",
      metaDescription: "Únete al Ragnar Trail Appalachians 2026, uno de los mejores festivales de running de la Costa Este. 117 millas a través de densos bosques de los Apalaches. 3 tipos de equipos disponibles.",
    },
    {
      language: Language.fr,
      title: "Ragnar Trail Appalachians Team Races",
      description: `## 🏔️ Ragnar Trail Appalachians 2026

**Échappez-vous de la ville pour une expérience unique de trail running dans les Appalaches !**

### 🌲 L'Événement

Échangez les lumières de la ville pour camper sous un ciel étoilé tout en naviguant sur des sentiers entourés de fougères colossales et de pins imposants. Une expérience qui capture l'essence de Jurassic Park — sans les dinosaures !

**L'un des meilleurs festivals de course de la côte Est des États-Unis.**

### 📏 Le Parcours

- **Distance Totale :** 117 miles (188 km)
- **Dénivelé Positif :** 427 pieds (130 mètres)
- **Terrain :** Trois sentiers palpitants bordés d'arbres à travers des forêts denses, des fougères luxuriantes et des pins des Appalaches

### 👥 Types d'Équipes

**Standard Team (8 coureurs)**
- ~14.6 miles par coureur
- 2 jours, 1 nuit

**Ultra Team (4 coureurs)**
- ~29.25 miles par coureur
- 2 jours, 1 nuit

**Black Loop (2 coureurs)**
- ~58.5 miles par coureur
- 2 jours, 1 nuit

### 🎉 Ragnar Village

**Célébration et Activités :**
- 🔥 Feux de camp et guimauves
- 🎵 Musique live le jeudi soir
- 🏕️ Glamping disponible
- 🚿 Douches sur place
- 🍔 Food trucks
- 🌲 Grand espace de camping (y compris dans les bois)

### 🎁 Ce Qui Est Inclus

- Échantillons de partenaires
- Cadeau du capitaine
- Médailles d'équipe
- T-shirts finisher d'équipe

### ☀️ Météo

- **Jour :** Températures chaudes (24-28°C)
- **Nuit :** Températures fraîches (7-12°C)
- Conditions parfaites pour les aventures en plein air avec beaucoup de soleil

**Une expérience inoubliable dans les magnifiques forêts des Appalaches !** 🌲✨`,
      city: "Bruceton Mills",
      metaTitle: "Ragnar Trail Appalachians 2026 - Festival de Trail Running dans les Appalaches | Athlifyr",
      metaDescription: "Rejoignez le Ragnar Trail Appalachians 2026, l'un des meilleurs festivals de course de la côte Est. 117 miles à travers les forêts denses des Appalaches. 3 types d'équipes disponibles.",
    },
    {
      language: Language.de,
      title: "Ragnar Trail Appalachians Team Races",
      description: `## 🏔️ Ragnar Trail Appalachians 2026

**Entfliehen Sie der Stadt für ein einzigartiges Trail-Running-Erlebnis in den Appalachen!**

### 🌲 Das Event

Tauschen Sie die Stadtlichter gegen Camping unter einem Sternenhimmel, während Sie Wege erkunden, die von kolossalen Farnen und majestätischen Kiefern umgeben sind. Ein Erlebnis, das die Essenz von Jurassic Park einfängt — ohne die Dinosaurier!

**Eines der besten Lauf-Festivals an der Ostküste der USA.**

### 📏 Die Strecke

- **Gesamtdistanz:** 117 Meilen (188 km)
- **Höhengewinn:** 427 Fuß (130 Meter)
- **Gelände:** Drei aufregende von Bäumen gesäumte Pfade durch dichte Wälder, üppige Farne und Appalachen-Kiefern

### 👥 Team-Typen

**Standard Team (8 Läufer)**
- ~14,6 Meilen pro Läufer
- 2 Tage, 1 Nacht

**Ultra Team (4 Läufer)**
- ~29,25 Meilen pro Läufer
- 2 Tage, 1 Nacht

**Black Loop (2 Läufer)**
- ~58,5 Meilen pro Läufer
- 2 Tage, 1 Nacht

### 🎉 Ragnar Village

**Feier und Aktivitäten:**
- 🔥 Lagerfeuer und Marshmallows
- 🎵 Live-Musik am Donnerstagabend
- 🏕️ Glamping verfügbar
- 🚿 Duschen vor Ort
- 🍔 Food Trucks
- 🌲 Großzügiger Campingplatz (auch im Wald)

### 🎁 Was Enthalten Ist

- Partnerproben
- Kapitänsgeschenk
- Team-Medaillen
- Team-Finisher-Shirts

### ☀️ Wetter

- **Tag:** Warme Temperaturen (24-28°C)
- **Nacht:** Kühle Temperaturen (7-12°C)
- Perfekte Bedingungen für Outdoor-Abenteuer mit viel Sonnenschein

**Ein unvergessliches Erlebnis in den wunderschönen Appalachen-Wäldern!** 🌲✨`,
      city: "Bruceton Mills",
      metaTitle: "Ragnar Trail Appalachians 2026 - Trail-Running-Festival in den Appalachen | Athlifyr",
      metaDescription: "Nehmen Sie am Ragnar Trail Appalachians 2026 teil, einem der besten Lauf-Festivals an der Ostküste. 117 Meilen durch dichte Appalachen-Wälder. 3 Team-Typen verfügbar.",
    },
    {
      language: Language.it,
      title: "Ragnar Trail Appalachians Team Races",
      description: `## 🏔️ Ragnar Trail Appalachians 2026

**Fuggi dalla città per un'esperienza unica di trail running negli Appalachi!**

### 🌲 L'Evento

Scambia le luci della città per campeggiare sotto un cielo stellato mentre percorri sentieri circondati da felci colossali e pini maestosi. Un'esperienza che cattura l'essenza di Jurassic Park — senza i dinosauri!

**Uno dei migliori festival di corsa della costa orientale degli Stati Uniti.**

### 📏 Il Percorso

- **Distanza Totale:** 117 miglia (188 km)
- **Dislivello Positivo:** 427 piedi (130 metri)
- **Terreno:** Tre emozionanti sentieri alberati attraverso foreste dense, felci lussureggianti e pini degli Appalachi

### 👥 Tipi di Squadre

**Standard Team (8 corridori)**
- ~14,6 miglia per corridore
- 2 giorni, 1 notte

**Ultra Team (4 corridori)**
- ~29,25 miglia per corridore
- 2 giorni, 1 notte

**Black Loop (2 corridori)**
- ~58,5 miglia per corridore
- 2 giorni, 1 notte

### 🎉 Ragnar Village

**Celebrazione e Attività:**
- 🔥 Falò e marshmallow
- 🎵 Musica dal vivo giovedì sera
- 🏕️ Glamping disponibile
- 🚿 Docce in loco
- 🍔 Food truck
- 🌲 Ampio spazio per campeggio (anche nel bosco)

### 🎁 Cosa È Incluso

- Campioni dei partner
- Regalo del capitano
- Medaglie di squadra
- Magliette finisher di squadra

### ☀️ Clima

- **Giorno:** Temperature calde (24-28°C)
- **Notte:** Temperature fresche (7-12°C)
- Condizioni perfette per avventure all'aperto con tanto sole

**Un'esperienza indimenticabile nelle splendide foreste degli Appalachi!** 🌲✨`,
      city: "Bruceton Mills",
      metaTitle: "Ragnar Trail Appalachians 2026 - Festival di Trail Running negli Appalachi | Athlifyr",
      metaDescription: "Unisciti al Ragnar Trail Appalachians 2026, uno dei migliori festival di corsa della costa orientale. 117 miglia attraverso dense foreste degli Appalachi. 3 tipi di squadre disponibili.",
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

  console.log("📝 Translations upserted for 6 languages (pt, en, es, fr, de, it)");

  // Step 3: Upsert variants separately
  console.log("🏃 Creating variants...");

  const variantsData = [
    {
      slug: "standard-team",
      name: "Standard Team",
      description: "Equipa padrão de 8 corredores. Cada corredor completa aproximadamente 14.6 milhas ao longo de 2 dias e 1 noite.",
      distanceKm: 188,
      elevationGainM: 130,
      startDate: new Date("2026-08-07T08:00:00Z"),
      startTime: "08:00",
      maxParticipants: null,
      cutoffTimeHours: 48,
      itraPoints: null,
      atrpGrade: null,
      mountainLevel: null,
      translations: [
        {
          language: Language.pt,
          name: "Standard Team",
          description: "Equipa padrão de 8 corredores. Cada corredor completa aproximadamente 14.6 milhas ao longo de 2 dias e 1 noite.",
        },
        {
          language: Language.en,
          name: "Standard Team",
          description: "Standard team of 8 runners. Each runner completes approximately 14.6 miles over 2 days and 1 night.",
        },
        {
          language: Language.es,
          name: "Standard Team",
          description: "Equipo estándar de 8 corredores. Cada corredor completa aproximadamente 14.6 millas durante 2 días y 1 noche.",
        },
        {
          language: Language.fr,
          name: "Standard Team",
          description: "Équipe standard de 8 coureurs. Chaque coureur complète environ 14,6 miles sur 2 jours et 1 nuit.",
        },
        {
          language: Language.de,
          name: "Standard Team",
          description: "Standard-Team mit 8 Läufern. Jeder Läufer absolviert etwa 14,6 Meilen über 2 Tage und 1 Nacht.",
        },
        {
          language: Language.it,
          name: "Standard Team",
          description: "Squadra standard di 8 corridori. Ogni corridore completa circa 14,6 miglia in 2 giorni e 1 notte.",
        },
      ],
      pricingPhases: [
        {
          name: "Early Bird",
          startDate: new Date("2025-09-01T00:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 1345.0,
          currency: Currency.USD,
          discountPercent: 10,
          note: "Inscrição antecipada para Standard Team (8 corredores) - $168 por corredor",
        },
        {
          name: "Regular",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-06-30T23:59:59Z"),
          price: 1495.0,
          currency: Currency.USD,
          discountPercent: null,
          note: "Inscrição regular para Standard Team (8 corredores) - $186 por corredor",
        },
        {
          name: "Late Registration",
          startDate: new Date("2026-07-01T00:00:00Z"),
          endDate: new Date("2026-08-06T23:59:59Z"),
          price: 1645.0,
          currency: Currency.USD,
          discountPercent: null,
          note: "Inscrição tardia para Standard Team (8 corredores) - $205 por corredor",
        },
      ],
    },
    {
      slug: "ultra-team",
      name: "Ultra Team",
      description: "Equipa ultra de 4 corredores. Cada corredor completa aproximadamente 29.25 milhas ao longo de 2 dias e 1 noite.",
      distanceKm: 188,
      elevationGainM: 130,
      startDate: new Date("2026-08-07T08:00:00Z"),
      startTime: "08:00",
      maxParticipants: null,
      cutoffTimeHours: 48,
      itraPoints: null,
      atrpGrade: null,
      mountainLevel: null,
      translations: [
        {
          language: Language.pt,
          name: "Ultra Team",
          description: "Equipa ultra de 4 corredores. Cada corredor completa aproximadamente 29.25 milhas ao longo de 2 dias e 1 noite.",
        },
        {
          language: Language.en,
          name: "Ultra Team",
          description: "Ultra team of 4 runners. Each runner completes approximately 29.25 miles over 2 days and 1 night.",
        },
        {
          language: Language.es,
          name: "Ultra Team",
          description: "Equipo ultra de 4 corredores. Cada corredor completa aproximadamente 29.25 millas durante 2 días y 1 noche.",
        },
        {
          language: Language.fr,
          name: "Ultra Team",
          description: "Équipe ultra de 4 coureurs. Chaque coureur complète environ 29,25 miles sur 2 jours et 1 nuit.",
        },
        {
          language: Language.de,
          name: "Ultra Team",
          description: "Ultra-Team mit 4 Läufern. Jeder Läufer absolviert etwa 29,25 Meilen über 2 Tage und 1 Nacht.",
        },
        {
          language: Language.it,
          name: "Ultra Team",
          description: "Squadra ultra di 4 corridori. Ogni corridore completa circa 29,25 miglia in 2 giorni e 1 notte.",
        },
      ],
      pricingPhases: [
        {
          name: "Early Bird",
          startDate: new Date("2025-09-01T00:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 765.0,
          currency: Currency.USD,
          discountPercent: 10,
          note: "Inscrição antecipada para Ultra Team (4 corredores) - $191 por corredor",
        },
        {
          name: "Regular",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-06-30T23:59:59Z"),
          price: 850.0,
          currency: Currency.USD,
          discountPercent: null,
          note: "Inscrição regular para Ultra Team (4 corredores) - $212 por corredor",
        },
        {
          name: "Late Registration",
          startDate: new Date("2026-07-01T00:00:00Z"),
          endDate: new Date("2026-08-06T23:59:59Z"),
          price: 935.0,
          currency: Currency.USD,
          discountPercent: null,
          note: "Inscrição tardia para Ultra Team (4 corredores) - $233 por corredor",
        },
      ],
    },
    {
      slug: "black-loop",
      name: "Black Loop",
      description: "Desafio extremo para 2 corredores. Cada corredor completa aproximadamente 58.5 milhas ao longo de 2 dias e 1 noite.",
      distanceKm: 188,
      elevationGainM: 130,
      startDate: new Date("2026-08-07T08:00:00Z"),
      startTime: "08:00",
      maxParticipants: null,
      cutoffTimeHours: 48,
      itraPoints: null,
      atrpGrade: null,
      mountainLevel: null,
      translations: [
        {
          language: Language.pt,
          name: "Black Loop",
          description: "Desafio extremo para 2 corredores. Cada corredor completa aproximadamente 58.5 milhas ao longo de 2 dias e 1 noite.",
        },
        {
          language: Language.en,
          name: "Black Loop",
          description: "Extreme challenge for 2 runners. Each runner completes approximately 58.5 miles over 2 days and 1 night.",
        },
        {
          language: Language.es,
          name: "Black Loop",
          description: "Desafío extremo para 2 corredores. Cada corredor completa aproximadamente 58.5 millas durante 2 días y 1 noche.",
        },
        {
          language: Language.fr,
          name: "Black Loop",
          description: "Défi extrême pour 2 coureurs. Chaque coureur complète environ 58,5 miles sur 2 jours et 1 nuit.",
        },
        {
          language: Language.de,
          name: "Black Loop",
          description: "Extreme Herausforderung für 2 Läufer. Jeder Läufer absolviert etwa 58,5 Meilen über 2 Tage und 1 Nacht.",
        },
        {
          language: Language.it,
          name: "Black Loop",
          description: "Sfida estrema per 2 corridori. Ogni corridore completa circa 58,5 miglia in 2 giorni e 1 notte.",
        },
      ],
      pricingPhases: [
        {
          name: "Early Bird",
          startDate: new Date("2025-09-01T00:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 382.5,
          currency: Currency.USD,
          discountPercent: 10,
          note: "Inscrição antecipada para Black Loop (2 corredores) - $191 por corredor",
        },
        {
          name: "Regular",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-06-30T23:59:59Z"),
          price: 425.0,
          currency: Currency.USD,
          discountPercent: null,
          note: "Inscrição regular para Black Loop (2 corredores) - $212 por corredor",
        },
        {
          name: "Late Registration",
          startDate: new Date("2026-07-01T00:00:00Z"),
          endDate: new Date("2026-08-06T23:59:59Z"),
          price: 467.5,
          currency: Currency.USD,
          discountPercent: null,
          note: "Inscrição tardia para Black Loop (2 corredores) - $233 por corredor",
        },
      ],
    },
  ];

  for (const variantData of variantsData) {
    const { pricingPhases, translations: variantTranslations, ...variantInfo } = variantData;

    const variant = await prisma.eventVariant.upsert({
      where: {
        eventId_slug: {
          eventId: event.id,
          slug: variantInfo.slug,
        },
      },
      update: {
        name: variantInfo.name,
        description: variantInfo.description,
        distanceKm: variantInfo.distanceKm,
        elevationGainM: variantInfo.elevationGainM,
        startDate: variantInfo.startDate,
        startTime: variantInfo.startTime,
        maxParticipants: variantInfo.maxParticipants,
        cutoffTimeHours: variantInfo.cutoffTimeHours,
        itraPoints: variantInfo.itraPoints,
        atrpGrade: variantInfo.atrpGrade,
        mountainLevel: variantInfo.mountainLevel,
      },
      create: {
        eventId: event.id,
        slug: variantInfo.slug,
        name: variantInfo.name,
        description: variantInfo.description,
        distanceKm: variantInfo.distanceKm,
        elevationGainM: variantInfo.elevationGainM,
        startDate: variantInfo.startDate,
        startTime: variantInfo.startTime,
        maxParticipants: variantInfo.maxParticipants,
        cutoffTimeHours: variantInfo.cutoffTimeHours,
        itraPoints: variantInfo.itraPoints,
        atrpGrade: variantInfo.atrpGrade,
        mountainLevel: variantInfo.mountainLevel,
      },
    });

    console.log(`   ✅ Variant upserted: ${variant.name}`);

    // Step 4: Upsert variant translations separately
    for (const translation of variantTranslations) {
      await prisma.eventVariantTranslation.upsert({
        where: {
          variantId_language: {
            variantId: variant.id,
            language: translation.language,
          },
        },
        update: {
          name: translation.name,
          description: translation.description,
        },
        create: {
          variantId: variant.id,
          language: translation.language,
          name: translation.name,
          description: translation.description,
        },
      });
    }

    console.log(`      📝 Translations upserted for variant: ${variant.name}`);

    // Step 5: Upsert pricing phases separately (linked to eventId, NOT variantId)
    for (const phase of pricingPhases) {
      const phaseName = `${variant.name} - ${phase.name}`;
      
      // Find existing pricing phase
      const existingPhase = await prisma.pricingPhase.findFirst({
        where: {
          eventId: event.id,
          name: phaseName,
        },
      });

      if (existingPhase) {
        await prisma.pricingPhase.update({
          where: { id: existingPhase.id },
          data: {
            startDate: phase.startDate,
            endDate: phase.endDate,
            price: phase.price,
            currency: phase.currency,
            discountPercent: phase.discountPercent,
            note: phase.note,
          },
        });
      } else {
        await prisma.pricingPhase.create({
          data: {
            eventId: event.id, // ✅ CRITICAL: Linked to eventId, NOT variantId
            name: phaseName,
            startDate: phase.startDate,
            endDate: phase.endDate,
            price: phase.price,
            currency: phase.currency,
            discountPercent: phase.discountPercent,
            note: phase.note,
          },
        });
      }
    }

    console.log(`      💰 Pricing phases upserted for variant: ${variant.name} (${pricingPhases.length} phases)`);
  }

  console.log("\n🎉 Seed completed successfully!");
  console.log("✅ Event: Ragnar Trail Appalachians Team Races 2026");
  console.log("📝 Translations: 6 languages (pt, en, es, fr, de, it)");
  console.log("🏃 Variants: 3 team types (Standard, Ultra, Black Loop)");
  console.log("💰 Pricing phases: 9 total (3 phases per variant)");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding database:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
