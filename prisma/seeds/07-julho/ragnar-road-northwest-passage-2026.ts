/**
 * Seed Ragnar Road Northwest Passage 2026
 * Complete with translations in all 6 languages
 * 
 * An iconic 193.5-mile road relay from the Canadian border to Whidbey Island
 * Teams of 3-12 runners racing through the Pacific Northwest
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Ragnar Road Northwest Passage 2026...");

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: "ragnar-road-northwest-passage-2026" },
    update: {
      title: "Ragnar Road Northwest Passage 2026",
      description: `## 🏃 Ragnar Road Northwest Passage 2026

**Uma aventura épica de revezamento de 311 km pela Costa Noroeste do Pacífico!**

### 🌟 A Experiência

Este é um dos eventos Ragnar mais icónicos - um revezamento de estrada de 193,5 milhas (311 km) que começa na fronteira canadiana no Peace Arch State Park e termina na pitoresca Whidbey Island. As equipas de corredores revezam-se durante 2 dias e 1 noite, atravessando alguns dos locais mais emblemáticos do Noroeste do Pacífico.

### 🗺️ Percurso Espetacular

- **Início:** Peace Arch State Park, Blaine, WA (fronteira com o Canadá)
- **Fim:** Whidbey Island Fairgrounds, Langley, WA
- **Distância Total:** 193,5 milhas / 311 km

Atravessa:
- 🏔️ Bellingham com vistas para as Montanhas Olympic
- 🌉 A icónica Deception Pass Bridge
- 🌊 Anacortes e a costa de Puget Sound
- 🌲 Florestas e paisagens costeiras deslumbrantes

### 👥 Tipos de Equipas

**Equipa Standard (12 corredores)**
- Cada corredor corre 3 etapas
- 11-22 milhas por corredor (média ~16 milhas / 26 km)

**Equipa Ultra (6 corredores)**
- Cada corredor corre 6 etapas
- ~32 milhas / 51 km por corredor

**Equipa Sprint (6 corredores)**
- Distância mais curta (~100 milhas / 160 km)
- ~17 milhas / 27 km por corredor
- 1 dia

**Sprint Ultra (3 corredores)**
- Distância mais curta (~100 milhas / 160 km)
- ~33 milhas / 53 km por corredor
- 1 dia

### 🎁 Comodidades e Benefícios

- 🍕 **Pizza gratuita** nos pontos de troca
- 💆 **Massagens gratuitas**
- 🚿 **Duches quentes** nas trocas Ex 12, Ex 24 e Ex 30
- 🛏️ Zonas de descanso nocturno em trocas designadas
- 🍺 Beer garden na linha de chegada
- 🏅 Medalhas de equipa e t-shirts de finisher
- 🎁 Presente do capitão
- 🎉 Festival na linha de chegada
- 📦 Amostras de produtos parceiros

### 🌡️ Clima em Julho

- Temperaturas: 23°C (máx) / 11°C (mín)
- Clima geralmente ameno
- Possível nevoeiro costeiro nas manhãs

### 🚐 Logística

- Revezamento baseado em carrinhas
- 36 pontos de troca ao longo do percurso
- Navegação entre trocas pela equipa
- Experiência de acampamento nocturno

**Uma aventura inesquecível através do melhor do Noroeste do Pacífico!**`,
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-07-10T09:00:00Z"),
      endDate: new Date("2026-07-11T18:00:00Z"),
      city: "Blaine",
      country: "United States",
      latitude: 49.002532,
      longitude: -122.757075,
      googleMapsUrl: "https://maps.app.goo.gl/Peace-Arch-State-Park",
      externalUrl: "https://runragnar.com/pages/race-road-northwest-passage",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-07-09T23:59:59Z"),
    },
    create: {
      title: "Ragnar Road Northwest Passage 2026",
      slug: "ragnar-road-northwest-passage-2026",
      description: `## 🏃 Ragnar Road Northwest Passage 2026

**Uma aventura épica de revezamento de 311 km pela Costa Noroeste do Pacífico!**

### 🌟 A Experiência

Este é um dos eventos Ragnar mais icónicos - um revezamento de estrada de 193,5 milhas (311 km) que começa na fronteira canadiana no Peace Arch State Park e termina na pitoresca Whidbey Island. As equipas de corredores revezam-se durante 2 dias e 1 noite, atravessando alguns dos locais mais emblemáticos do Noroeste do Pacífico.

### 🗺️ Percurso Espetacular

- **Início:** Peace Arch State Park, Blaine, WA (fronteira com o Canadá)
- **Fim:** Whidbey Island Fairgrounds, Langley, WA
- **Distância Total:** 193,5 milhas / 311 km

Atravessa:
- 🏔️ Bellingham com vistas para as Montanhas Olympic
- 🌉 A icónica Deception Pass Bridge
- 🌊 Anacortes e a costa de Puget Sound
- 🌲 Florestas e paisagens costeiras deslumbrantes

### 👥 Tipos de Equipas

**Equipa Standard (12 corredores)**
- Cada corredor corre 3 etapas
- 11-22 milhas por corredor (média ~16 milhas / 26 km)

**Equipa Ultra (6 corredores)**
- Cada corredor corre 6 etapas
- ~32 milhas / 51 km por corredor

**Equipa Sprint (6 corredores)**
- Distância mais curta (~100 milhas / 160 km)
- ~17 milhas / 27 km por corredor
- 1 dia

**Sprint Ultra (3 corredores)**
- Distância mais curta (~100 milhas / 160 km)
- ~33 milhas / 53 km por corredor
- 1 dia

### 🎁 Comodidades e Benefícios

- 🍕 **Pizza gratuita** nos pontos de troca
- 💆 **Massagens gratuitas**
- 🚿 **Duches quentes** nas trocas Ex 12, Ex 24 e Ex 30
- 🛏️ Zonas de descanso nocturno em trocas designadas
- 🍺 Beer garden na linha de chegada
- 🏅 Medalhas de equipa e t-shirts de finisher
- 🎁 Presente do capitão
- 🎉 Festival na linha de chegada
- 📦 Amostras de produtos parceiros

### 🌡️ Clima em Julho

- Temperaturas: 23°C (máx) / 11°C (mín)
- Clima geralmente ameno
- Possível nevoeiro costeiro nas manhãs

### 🚐 Logística

- Revezamento baseado em carrinhas
- 36 pontos de troca ao longo do percurso
- Navegação entre trocas pela equipa
- Experiência de acampamento nocturno

**Uma aventura inesquecível através do melhor do Noroeste do Pacífico!**`,
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-07-10T09:00:00Z"),
      endDate: new Date("2026-07-11T18:00:00Z"),
      city: "Blaine",
      country: "United States",
      latitude: 49.002532,
      longitude: -122.757075,
      googleMapsUrl: "https://maps.app.goo.gl/Peace-Arch-State-Park",
      externalUrl: "https://runragnar.com/pages/race-road-northwest-passage",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-07-09T23:59:59Z"),
    },
  });

  console.log("✅ Event upserted with ID:", event.id);

  // Step 2: Upsert translations separately (ALL 6 LANGUAGES)
  const translations = [
    {
      language: Language.pt,
      title: "Ragnar Road Northwest Passage 2026",
      description: `## 🏃 Ragnar Road Northwest Passage 2026

**Uma aventura épica de revezamento de 311 km pela Costa Noroeste do Pacífico!**

### 🌟 A Experiência

Este é um dos eventos Ragnar mais icónicos - um revezamento de estrada de 193,5 milhas (311 km) que começa na fronteira canadiana no Peace Arch State Park e termina na pitoresca Whidbey Island. As equipas de corredores revezam-se durante 2 dias e 1 noite, atravessando alguns dos locais mais emblemáticos do Noroeste do Pacífico.

### 🗺️ Percurso Espetacular

- **Início:** Peace Arch State Park, Blaine, WA (fronteira com o Canadá)
- **Fim:** Whidbey Island Fairgrounds, Langley, WA
- **Distância Total:** 193,5 milhas / 311 km

Atravessa:
- 🏔️ Bellingham com vistas para as Montanhas Olympic
- 🌉 A icónica Deception Pass Bridge
- 🌊 Anacortes e a costa de Puget Sound
- 🌲 Florestas e paisagens costeiras deslumbrantes

### 👥 Tipos de Equipas

**Equipa Standard (12 corredores)**
- Cada corredor corre 3 etapas
- 11-22 milhas por corredor (média ~16 milhas / 26 km)

**Equipa Ultra (6 corredores)**
- Cada corredor corre 6 etapas
- ~32 milhas / 51 km por corredor

**Equipa Sprint (6 corredores)**
- Distância mais curta (~100 milhas / 160 km)
- ~17 milhas / 27 km por corredor
- 1 dia

**Sprint Ultra (3 corredores)**
- Distância mais curta (~100 milhas / 160 km)
- ~33 milhas / 53 km por corredor
- 1 dia

### 🎁 Comodidades e Benefícios

- 🍕 **Pizza gratuita** nos pontos de troca
- 💆 **Massagens gratuitas**
- 🚿 **Duches quentes** nas trocas Ex 12, Ex 24 e Ex 30
- 🛏️ Zonas de descanso nocturno em trocas designadas
- 🍺 Beer garden na linha de chegada
- 🏅 Medalhas de equipa e t-shirts de finisher
- 🎁 Presente do capitão
- 🎉 Festival na linha de chegada
- 📦 Amostras de produtos parceiros

### 🌡️ Clima em Julho

- Temperaturas: 23°C (máx) / 11°C (mín)
- Clima geralmente ameno
- Possível nevoeiro costeiro nas manhãs

### 🚐 Logística

- Revezamento baseado em carrinhas
- 36 pontos de troca ao longo do percurso
- Navegação entre trocas pela equipa
- Experiência de acampamento nocturno

**Uma aventura inesquecível através do melhor do Noroeste do Pacífico!**`,
      city: "Blaine",
      metaTitle: "Ragnar Road Northwest Passage 2026 | Revezamento Épico de 311 km",
      metaDescription: "Revezamento de estrada de 193,5 milhas da fronteira canadiana até Whidbey Island. Equipas de 3-12 corredores atravessam o Noroeste do Pacífico com pizza gratuita, massagens e festival de chegada.",
    },
    {
      language: Language.en,
      title: "Ragnar Road Northwest Passage 2026",
      description: `## 🏃 Ragnar Road Northwest Passage 2026

**An epic 193.5-mile relay adventure through the Pacific Northwest!**

### 🌟 The Experience

This is one of the most iconic Ragnar events - a 193.5-mile (311 km) road relay starting at the Canadian border at Peace Arch State Park and finishing on picturesque Whidbey Island. Teams of runners take turns over 2 days and 1 night, passing through some of the Pacific Northwest's most iconic landmarks.

### 🗺️ Spectacular Course

- **Start:** Peace Arch State Park, Blaine, WA (Canadian border)
- **Finish:** Whidbey Island Fairgrounds, Langley, WA
- **Total Distance:** 193.5 miles / 311 km

Through:
- 🏔️ Bellingham with Olympic Mountains views
- 🌉 The iconic Deception Pass Bridge
- 🌊 Anacortes and the Puget Sound coast
- 🌲 Stunning forests and coastal landscapes

### 👥 Team Types

**Standard Team (12 runners)**
- Each runner runs 3 legs
- 11-22 miles per runner (average ~16 miles / 26 km)

**Ultra Team (6 runners)**
- Each runner runs 6 legs
- ~32 miles / 51 km per runner

**Sprint Team (6 runners)**
- Shorter distance (~100 miles / 160 km)
- ~17 miles / 27 km per runner
- 1 day

**Sprint Ultra (3 runners)**
- Shorter distance (~100 miles / 160 km)
- ~33 miles / 53 km per runner
- 1 day

### 🎁 Amenities and Benefits

- 🍕 **Free pizza** at exchange points
- 💆 **Free massages**
- 🚿 **Hot showers** at exchanges Ex 12, Ex 24, and Ex 30
- 🛏️ Overnight sleeping zones at designated exchanges
- 🍺 Beer garden at finish line
- 🏅 Team medals and finisher shirts
- 🎁 Captain's gift
- 🎉 Finish line festival
- 📦 Partner product samples

### 🌡️ July Weather

- Temperatures: 74°F high / 51°F low (23°C / 11°C)
- Generally mild weather
- Possible coastal fog in mornings

### 🚐 Logistics

- Van-based relay
- 36 exchange points along the course
- Team navigation between exchanges
- Overnight camping experience

**An unforgettable adventure through the best of the Pacific Northwest!**`,
      city: "Blaine",
      metaTitle: "Ragnar Road Northwest Passage 2026 | Epic 193.5-Mile Relay",
      metaDescription: "193.5-mile road relay from Canadian border to Whidbey Island. Teams of 3-12 runners traverse the Pacific Northwest with free pizza, massages, and finish festival.",
    },
    {
      language: Language.es,
      title: "Ragnar Road Northwest Passage 2026",
      description: `## 🏃 Ragnar Road Northwest Passage 2026

**¡Una aventura épica de relevos de 311 km por el Noroeste del Pacífico!**

### 🌟 La Experiencia

Este es uno de los eventos Ragnar más icónicos: un relevo de carretera de 193,5 millas (311 km) que comienza en la frontera canadiense en Peace Arch State Park y termina en la pintoresca Whidbey Island. Los equipos de corredores se turnan durante 2 días y 1 noche, atravesando algunos de los lugares más emblemáticos del Noroeste del Pacífico.

### 🗺️ Recorrido Espectacular

- **Inicio:** Peace Arch State Park, Blaine, WA (frontera con Canadá)
- **Final:** Whidbey Island Fairgrounds, Langley, WA
- **Distancia Total:** 193,5 millas / 311 km

Atraviesa:
- 🏔️ Bellingham con vistas a las Montañas Olympic
- 🌉 El icónico Deception Pass Bridge
- 🌊 Anacortes y la costa de Puget Sound
- 🌲 Impresionantes bosques y paisajes costeros

### 👥 Tipos de Equipos

**Equipo Standard (12 corredores)**
- Cada corredor corre 3 tramos
- 11-22 millas por corredor (promedio ~16 millas / 26 km)

**Equipo Ultra (6 corredores)**
- Cada corredor corre 6 tramos
- ~32 millas / 51 km por corredor

**Equipo Sprint (6 corredores)**
- Distancia más corta (~100 millas / 160 km)
- ~17 millas / 27 km por corredor
- 1 día

**Sprint Ultra (3 corredores)**
- Distancia más corta (~100 millas / 160 km)
- ~33 millas / 53 km por corredor
- 1 día

### 🎁 Comodidades y Beneficios

- 🍕 **Pizza gratuita** en puntos de intercambio
- 💆 **Masajes gratuitos**
- 🚿 **Duchas calientes** en intercambios Ex 12, Ex 24 y Ex 30
- 🛏️ Zonas de descanso nocturno en intercambios designados
- 🍺 Jardín de cerveza en la línea de meta
- 🏅 Medallas de equipo y camisetas de finisher
- 🎁 Regalo del capitán
- 🎉 Festival en la línea de meta
- 📦 Muestras de productos asociados

### 🌡️ Clima en Julio

- Temperaturas: 23°C (máx) / 11°C (mín)
- Clima generalmente templado
- Posible niebla costera por las mañanas

### 🚐 Logística

- Relevo basado en furgonetas
- 36 puntos de intercambio a lo largo del recorrido
- Navegación del equipo entre intercambios
- Experiencia de campamento nocturno

**¡Una aventura inolvidable a través de lo mejor del Noroeste del Pacífico!**`,
      city: "Blaine",
      metaTitle: "Ragnar Road Northwest Passage 2026 | Relevo Épico de 311 km",
      metaDescription: "Relevo de carretera de 193,5 millas desde la frontera canadiense hasta Whidbey Island. Equipos de 3-12 corredores atraviesan el Noroeste del Pacífico con pizza gratis, masajes y festival de llegada.",
    },
    {
      language: Language.fr,
      title: "Ragnar Road Northwest Passage 2026",
      description: `## 🏃 Ragnar Road Northwest Passage 2026

**Une aventure épique de relais de 311 km à travers le Pacifique Nord-Ouest !**

### 🌟 L'Expérience

C'est l'un des événements Ragnar les plus emblématiques - un relais sur route de 193,5 miles (311 km) commençant à la frontière canadienne au Peace Arch State Park et se terminant sur la pittoresque Whidbey Island. Les équipes de coureurs se relaient pendant 2 jours et 1 nuit, traversant certains des sites les plus emblématiques du Pacifique Nord-Ouest.

### 🗺️ Parcours Spectaculaire

- **Départ :** Peace Arch State Park, Blaine, WA (frontière canadienne)
- **Arrivée :** Whidbey Island Fairgrounds, Langley, WA
- **Distance Totale :** 193,5 miles / 311 km

À travers :
- 🏔️ Bellingham avec vue sur les Montagnes Olympic
- 🌉 L'emblématique Deception Pass Bridge
- 🌊 Anacortes et la côte de Puget Sound
- 🌲 Forêts magnifiques et paysages côtiers

### 👥 Types d'Équipes

**Équipe Standard (12 coureurs)**
- Chaque coureur court 3 segments
- 11-22 miles par coureur (moyenne ~16 miles / 26 km)

**Équipe Ultra (6 coureurs)**
- Chaque coureur court 6 segments
- ~32 miles / 51 km par coureur

**Équipe Sprint (6 coureurs)**
- Distance plus courte (~100 miles / 160 km)
- ~17 miles / 27 km par coureur
- 1 jour

**Sprint Ultra (3 coureurs)**
- Distance plus courte (~100 miles / 160 km)
- ~33 miles / 53 km par coureur
- 1 jour

### 🎁 Commodités et Avantages

- 🍕 **Pizza gratuite** aux points d'échange
- 💆 **Massages gratuits**
- 🚿 **Douches chaudes** aux échanges Ex 12, Ex 24 et Ex 30
- 🛏️ Zones de repos nocturne aux échanges désignés
- 🍺 Jardin de bière à la ligne d'arrivée
- 🏅 Médailles d'équipe et t-shirts de finisher
- 🎁 Cadeau du capitaine
- 🎉 Festival à la ligne d'arrivée
- 📦 Échantillons de produits partenaires

### 🌡️ Météo en Juillet

- Températures : 23°C (max) / 11°C (min)
- Temps généralement doux
- Brouillard côtier possible le matin

### 🚐 Logistique

- Relais en fourgonnettes
- 36 points d'échange le long du parcours
- Navigation de l'équipe entre les échanges
- Expérience de camping nocturne

**Une aventure inoubliable à travers le meilleur du Pacifique Nord-Ouest !**`,
      city: "Blaine",
      metaTitle: "Ragnar Road Northwest Passage 2026 | Relais Épique de 311 km",
      metaDescription: "Relais sur route de 193,5 miles de la frontière canadienne à Whidbey Island. Équipes de 3-12 coureurs traversant le Pacifique Nord-Ouest avec pizza gratuite, massages et festival d'arrivée.",
    },
    {
      language: Language.de,
      title: "Ragnar Road Northwest Passage 2026",
      description: `## 🏃 Ragnar Road Northwest Passage 2026

**Ein episches 311-km-Staffellauf-Abenteuer durch den pazifischen Nordwesten!**

### 🌟 Das Erlebnis

Dies ist eines der ikonischsten Ragnar-Events - ein 193,5-Meilen (311 km) Straßenstaffellauf, der an der kanadischen Grenze im Peace Arch State Park beginnt und auf der malerischen Whidbey Island endet. Teams von Läufern wechseln sich über 2 Tage und 1 Nacht ab und passieren einige der bekanntesten Wahrzeichen des pazifischen Nordwestens.

### 🗺️ Spektakuläre Strecke

- **Start:** Peace Arch State Park, Blaine, WA (kanadische Grenze)
- **Ziel:** Whidbey Island Fairgrounds, Langley, WA
- **Gesamtdistanz:** 193,5 Meilen / 311 km

Durch:
- 🏔️ Bellingham mit Blick auf die Olympic Mountains
- 🌉 Die ikonische Deception Pass Bridge
- 🌊 Anacortes und die Küste des Puget Sound
- 🌲 Atemberaubende Wälder und Küstenlandschaften

### 👥 Team-Typen

**Standard-Team (12 Läufer)**
- Jeder Läufer läuft 3 Etappen
- 11-22 Meilen pro Läufer (Durchschnitt ~16 Meilen / 26 km)

**Ultra-Team (6 Läufer)**
- Jeder Läufer läuft 6 Etappen
- ~32 Meilen / 51 km pro Läufer

**Sprint-Team (6 Läufer)**
- Kürzere Distanz (~100 Meilen / 160 km)
- ~17 Meilen / 27 km pro Läufer
- 1 Tag

**Sprint Ultra (3 Läufer)**
- Kürzere Distanz (~100 Meilen / 160 km)
- ~33 Meilen / 53 km pro Läufer
- 1 Tag

### 🎁 Annehmlichkeiten und Vorteile

- 🍕 **Kostenlose Pizza** an Wechselpunkten
- 💆 **Kostenlose Massagen**
- 🚿 **Heiße Duschen** bei Wechseln Ex 12, Ex 24 und Ex 30
- 🛏️ Übernachtungsbereiche an ausgewiesenen Wechseln
- 🍺 Biergarten an der Ziellinie
- 🏅 Team-Medaillen und Finisher-Shirts
- 🎁 Kapitänsgeschenk
- 🎉 Ziellinienfestival
- 📦 Partnerproduktproben

### 🌡️ Juli-Wetter

- Temperaturen: 23°C (max) / 11°C (min)
- Generell mildes Wetter
- Möglicher Küstennebel am Morgen

### 🚐 Logistik

- Van-basierter Staffellauf
- 36 Wechselpunkte entlang der Strecke
- Team-Navigation zwischen Wechseln
- Übernachtungs-Camping-Erlebnis

**Ein unvergessliches Abenteuer durch das Beste des pazifischen Nordwestens!**`,
      city: "Blaine",
      metaTitle: "Ragnar Road Northwest Passage 2026 | Epischer 311-km-Staffellauf",
      metaDescription: "193,5-Meilen-Straßenstaffellauf von der kanadischen Grenze nach Whidbey Island. Teams von 3-12 Läufern durchqueren den pazifischen Nordwesten mit kostenloser Pizza, Massagen und Zielfestival.",
    },
    {
      language: Language.it,
      title: "Ragnar Road Northwest Passage 2026",
      description: `## 🏃 Ragnar Road Northwest Passage 2026

**Un'avventura epica di staffetta di 311 km attraverso il Pacifico Nord-Occidentale!**

### 🌟 L'Esperienza

Questo è uno degli eventi Ragnar più iconici - una staffetta su strada di 193,5 miglia (311 km) che inizia al confine canadese al Peace Arch State Park e termina sulla pittoresca Whidbey Island. Le squadre di corridori si alternano per 2 giorni e 1 notte, attraversando alcuni dei luoghi più emblematici del Pacifico Nord-Occidentale.

### 🗺️ Percorso Spettacolare

- **Partenza:** Peace Arch State Park, Blaine, WA (confine canadese)
- **Arrivo:** Whidbey Island Fairgrounds, Langley, WA
- **Distanza Totale:** 193,5 miglia / 311 km

Attraverso:
- 🏔️ Bellingham con vista sulle Montagne Olympic
- 🌉 L'iconico Deception Pass Bridge
- 🌊 Anacortes e la costa di Puget Sound
- 🌲 Foreste spettacolari e paesaggi costieri

### 👥 Tipi di Squadre

**Squadra Standard (12 corridori)**
- Ogni corridore corre 3 frazioni
- 11-22 miglia per corridore (media ~16 miglia / 26 km)

**Squadra Ultra (6 corridori)**
- Ogni corridore corre 6 frazioni
- ~32 miglia / 51 km per corridore

**Squadra Sprint (6 corridori)**
- Distanza più breve (~100 miglia / 160 km)
- ~17 miglia / 27 km per corridore
- 1 giorno

**Sprint Ultra (3 corridori)**
- Distanza più breve (~100 miglia / 160 km)
- ~33 miglia / 53 km per corridore
- 1 giorno

### 🎁 Servizi e Vantaggi

- 🍕 **Pizza gratuita** ai punti di scambio
- 💆 **Massaggi gratuiti**
- 🚿 **Docce calde** agli scambi Ex 12, Ex 24 ed Ex 30
- 🛏️ Zone di riposo notturno agli scambi designati
- 🍺 Giardino della birra al traguardo
- 🏅 Medaglie di squadra e magliette finisher
- 🎁 Regalo del capitano
- 🎉 Festival al traguardo
- 📦 Campioni di prodotti partner

### 🌡️ Meteo di Luglio

- Temperature: 23°C (max) / 11°C (min)
- Tempo generalmente mite
- Possibile nebbia costiera al mattino

### 🚐 Logistica

- Staffetta basata su furgoni
- 36 punti di scambio lungo il percorso
- Navigazione della squadra tra gli scambi
- Esperienza di campeggio notturno

**Un'avventura indimenticabile attraverso il meglio del Pacifico Nord-Occidentale!**`,
      city: "Blaine",
      metaTitle: "Ragnar Road Northwest Passage 2026 | Staffetta Epica di 311 km",
      metaDescription: "Staffetta su strada di 193,5 miglia dal confine canadese a Whidbey Island. Squadre di 3-12 corridori attraversano il Pacifico Nord-Occidentale con pizza gratuita, massaggi e festival d'arrivo.",
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
  const variantsData = [
    {
      slug: "standard-team-12-runners",
      name: "Equipa Standard (12 corredores)",
      description: "Equipa de 12 corredores, cada um corre 3 etapas. 11-22 milhas por corredor (média ~16 milhas / 26 km). 2 dias e 1 noite.",
      distanceKm: 311,
      startDate: new Date("2026-07-10T09:00:00Z"),
      startTime: "09:00",
      maxParticipants: 12,
      translations: [
        {
          language: Language.pt,
          name: "Equipa Standard (12 corredores)",
          description: "Equipa de 12 corredores, cada um corre 3 etapas. 11-22 milhas por corredor (média ~16 milhas / 26 km). 2 dias e 1 noite.",
        },
        {
          language: Language.en,
          name: "Standard Team (12 runners)",
          description: "Team of 12 runners, each runs 3 legs. 11-22 miles per runner (average ~16 miles / 26 km). 2 days and 1 night.",
        },
        {
          language: Language.es,
          name: "Equipo Standard (12 corredores)",
          description: "Equipo de 12 corredores, cada uno corre 3 tramos. 11-22 millas por corredor (promedio ~16 millas / 26 km). 2 días y 1 noche.",
        },
        {
          language: Language.fr,
          name: "Équipe Standard (12 coureurs)",
          description: "Équipe de 12 coureurs, chacun court 3 segments. 11-22 miles par coureur (moyenne ~16 miles / 26 km). 2 jours et 1 nuit.",
        },
        {
          language: Language.de,
          name: "Standard-Team (12 Läufer)",
          description: "Team von 12 Läufern, jeder läuft 3 Etappen. 11-22 Meilen pro Läufer (Durchschnitt ~16 Meilen / 26 km). 2 Tage und 1 Nacht.",
        },
        {
          language: Language.it,
          name: "Squadra Standard (12 corridori)",
          description: "Squadra di 12 corridori, ciascuno corre 3 frazioni. 11-22 miglia per corridore (media ~16 miglia / 26 km). 2 giorni e 1 notte.",
        },
      ],
      pricing: [
        { name: "Fase 1 (Early Bird)", startDate: new Date("2025-11-01T00:00:00Z"), endDate: new Date("2026-01-22T23:59:59Z"), price: 1950.0, currency: Currency.USD, note: "Inscrição antecipada - $162/corredor" },
        { name: "Fase 2 (Regular)", startDate: new Date("2026-01-23T00:00:00Z"), endDate: new Date("2026-07-09T23:59:59Z"), price: 2095.0, currency: Currency.USD, note: "Inscrição regular - $175/corredor" },
      ],
    },
    {
      slug: "ultra-team-6-runners",
      name: "Equipa Ultra (6 corredores)",
      description: "Equipa de 6 corredores, cada um corre 6 etapas. Aproximadamente 32 milhas / 51 km por corredor. 2 dias e 1 noite.",
      distanceKm: 311,
      startDate: new Date("2026-07-10T09:00:00Z"),
      startTime: "09:00",
      maxParticipants: 6,
      translations: [
        {
          language: Language.pt,
          name: "Equipa Ultra (6 corredores)",
          description: "Equipa de 6 corredores, cada um corre 6 etapas. Aproximadamente 32 milhas / 51 km por corredor. 2 dias e 1 noite.",
        },
        {
          language: Language.en,
          name: "Ultra Team (6 runners)",
          description: "Team of 6 runners, each runs 6 legs. Approximately 32 miles / 51 km per runner. 2 days and 1 night.",
        },
        {
          language: Language.es,
          name: "Equipo Ultra (6 corredores)",
          description: "Equipo de 6 corredores, cada uno corre 6 tramos. Aproximadamente 32 millas / 51 km por corredor. 2 días y 1 noche.",
        },
        {
          language: Language.fr,
          name: "Équipe Ultra (6 coureurs)",
          description: "Équipe de 6 coureurs, chacun court 6 segments. Environ 32 miles / 51 km par coureur. 2 jours et 1 nuit.",
        },
        {
          language: Language.de,
          name: "Ultra-Team (6 Läufer)",
          description: "Team von 6 Läufern, jeder läuft 6 Etappen. Ungefähr 32 Meilen / 51 km pro Läufer. 2 Tage und 1 Nacht.",
        },
        {
          language: Language.it,
          name: "Squadra Ultra (6 corridori)",
          description: "Squadra di 6 corridori, ciascuno corre 6 frazioni. Circa 32 miglia / 51 km per corridore. 2 giorni e 1 notte.",
        },
      ],
      pricing: [
        { name: "Fase 1 (Early Bird)", startDate: new Date("2025-11-01T00:00:00Z"), endDate: new Date("2026-01-22T23:59:59Z"), price: 1150.0, currency: Currency.USD, note: "Inscrição antecipada - $191/corredor" },
        { name: "Fase 2 (Regular)", startDate: new Date("2026-01-23T00:00:00Z"), endDate: new Date("2026-07-09T23:59:59Z"), price: 1323.0, currency: Currency.USD, note: "Inscrição regular - $220/corredor" },
      ],
    },
    {
      slug: "sprint-team-6-runners",
      name: "Equipa Sprint (6 corredores)",
      description: "Equipa de 6 corredores para distância mais curta (~100 milhas / 160 km). Aproximadamente 17 milhas / 27 km por corredor. 1 dia.",
      distanceKm: 160,
      startDate: new Date("2026-07-10T09:00:00Z"),
      startTime: "09:00",
      maxParticipants: 6,
      translations: [
        {
          language: Language.pt,
          name: "Equipa Sprint (6 corredores)",
          description: "Equipa de 6 corredores para distância mais curta (~100 milhas / 160 km). Aproximadamente 17 milhas / 27 km por corredor. 1 dia.",
        },
        {
          language: Language.en,
          name: "Sprint Team (6 runners)",
          description: "Team of 6 runners for shorter distance (~100 miles / 160 km). Approximately 17 miles / 27 km per runner. 1 day.",
        },
        {
          language: Language.es,
          name: "Equipo Sprint (6 corredores)",
          description: "Equipo de 6 corredores para distancia más corta (~100 millas / 160 km). Aproximadamente 17 millas / 27 km por corredor. 1 día.",
        },
        {
          language: Language.fr,
          name: "Équipe Sprint (6 coureurs)",
          description: "Équipe de 6 coureurs pour distance plus courte (~100 miles / 160 km). Environ 17 miles / 27 km par coureur. 1 jour.",
        },
        {
          language: Language.de,
          name: "Sprint-Team (6 Läufer)",
          description: "Team von 6 Läufern für kürzere Distanz (~100 Meilen / 160 km). Ungefähr 17 Meilen / 27 km pro Läufer. 1 Tag.",
        },
        {
          language: Language.it,
          name: "Squadra Sprint (6 corridori)",
          description: "Squadra di 6 corridori per distanza più breve (~100 miglia / 160 km). Circa 17 miglia / 27 km per corridore. 1 giorno.",
        },
      ],
      pricing: [
        { name: "Fase 1 (Early Bird)", startDate: new Date("2025-11-01T00:00:00Z"), endDate: new Date("2026-01-22T23:59:59Z"), price: 675.0, currency: Currency.USD, note: "Inscrição antecipada - $112/corredor" },
        { name: "Fase 2 (Regular)", startDate: new Date("2026-01-23T00:00:00Z"), endDate: new Date("2026-07-09T23:59:59Z"), price: 776.0, currency: Currency.USD, note: "Inscrição regular - $129/corredor" },
      ],
    },
    {
      slug: "sprint-ultra-3-runners",
      name: "Sprint Ultra (3 corredores)",
      description: "Equipa de 3 corredores para distância mais curta (~100 milhas / 160 km). Aproximadamente 33 milhas / 53 km por corredor. 1 dia.",
      distanceKm: 160,
      startDate: new Date("2026-07-10T09:00:00Z"),
      startTime: "09:00",
      maxParticipants: 3,
      translations: [
        {
          language: Language.pt,
          name: "Sprint Ultra (3 corredores)",
          description: "Equipa de 3 corredores para distância mais curta (~100 milhas / 160 km). Aproximadamente 33 milhas / 53 km por corredor. 1 dia.",
        },
        {
          language: Language.en,
          name: "Sprint Ultra (3 runners)",
          description: "Team of 3 runners for shorter distance (~100 miles / 160 km). Approximately 33 miles / 53 km per runner. 1 day.",
        },
        {
          language: Language.es,
          name: "Sprint Ultra (3 corredores)",
          description: "Equipo de 3 corredores para distancia más corta (~100 millas / 160 km). Aproximadamente 33 millas / 53 km por corredor. 1 día.",
        },
        {
          language: Language.fr,
          name: "Sprint Ultra (3 coureurs)",
          description: "Équipe de 3 coureurs pour distance plus courte (~100 miles / 160 km). Environ 33 miles / 53 km par coureur. 1 jour.",
        },
        {
          language: Language.de,
          name: "Sprint Ultra (3 Läufer)",
          description: "Team von 3 Läufern für kürzere Distanz (~100 Meilen / 160 km). Ungefähr 33 Meilen / 53 km pro Läufer. 1 Tag.",
        },
        {
          language: Language.it,
          name: "Sprint Ultra (3 corridori)",
          description: "Squadra di 3 corridori per distanza più breve (~100 miglia / 160 km). Circa 33 miglia / 53 km per corridore. 1 giorno.",
        },
      ],
      pricing: [
        { name: "Fase 1 (Early Bird)", startDate: new Date("2025-11-01T00:00:00Z"), endDate: new Date("2026-01-22T23:59:59Z"), price: 375.0, currency: Currency.USD, note: "Inscrição antecipada - $125/corredor" },
        { name: "Fase 2 (Regular)", startDate: new Date("2026-01-23T00:00:00Z"), endDate: new Date("2026-07-09T23:59:59Z"), price: 431.0, currency: Currency.USD, note: "Inscrição regular - $144/corredor" },
      ],
    },
  ];

  console.log("🏃 Creating variants and pricing phases...");

  for (const variantData of variantsData) {
    const { translations: variantTranslations, pricing, ...variantInfo } = variantData;

    // Upsert variant
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
        startDate: variantInfo.startDate,
        startTime: variantInfo.startTime,
        maxParticipants: variantInfo.maxParticipants,
      },
      create: {
        eventId: event.id,
        slug: variantInfo.slug,
        name: variantInfo.name,
        description: variantInfo.description,
        distanceKm: variantInfo.distanceKm,
        startDate: variantInfo.startDate,
        startTime: variantInfo.startTime,
        maxParticipants: variantInfo.maxParticipants,
      },
    });

    console.log(`✅ Variant upserted: ${variant.name}`);

    // Upsert variant translations
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

    // Upsert pricing phases (linked to eventId, NOT variantId)
    for (const phase of pricing) {
      const phaseName = `${variant.name} - ${phase.name}`;
      
      // Use findFirst to check if phase exists
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
            note: phase.note,
          },
        });
      } else {
        await prisma.pricingPhase.create({
          data: {
            eventId: event.id, // ✅ CORRECT: linked to eventId
            name: phaseName,
            startDate: phase.startDate,
            endDate: phase.endDate,
            price: phase.price,
            currency: phase.currency,
            note: phase.note,
          },
        });
      }
    }

    console.log(`   - ${pricing.length} pricing phases upserted for ${variant.name}`);
  }

  console.log("💰 All pricing phases upserted (linked to eventId)");
  console.log("\n🎉 Ragnar Road Northwest Passage 2026 seed completed successfully!");
  console.log("\n📋 Summary:");
  console.log("   - Event: Ragnar Road Northwest Passage 2026");
  console.log("   - Translations: 6 languages (pt, en, es, fr, de, it)");
  console.log("   - Variants: 4 team types");
  console.log("   - Pricing phases: 2 phases per variant (8 total)");
  console.log("   - All data is idempotent and can be re-run safely");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding Ragnar Road Northwest Passage 2026:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
