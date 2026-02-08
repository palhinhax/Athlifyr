import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding RAID Templários BTT 2026...");

  // 1. Upsert event (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: "raid-templarios-btt-2026" },
    update: {
      title: "RAID Templários BTT 2026",
      description: "Evento de BTT no coração histórico de Tomar",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-08T09:00:00.000Z"),
      endDate: new Date("2026-03-08T15:00:00.000Z"),
      city: "Tomar",
      country: "Portugal",
      latitude: 39.6003,
      longitude: -8.4097,
      googleMapsUrl:
        "https://maps.google.com/?q=Pavilhão+Municipal+Patrícia+Sampaio+Tomar",
      externalUrl: "https://templariosbtt.pt/",
      imageUrl: "",
      isFeatured: false,
    },
    create: {
      slug: "raid-templarios-btt-2026",
      title: "RAID Templários BTT 2026",
      description: "Evento de BTT no coração histórico de Tomar",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-08T09:00:00.000Z"),
      endDate: new Date("2026-03-08T15:00:00.000Z"),
      city: "Tomar",
      country: "Portugal",
      latitude: 39.6003,
      longitude: -8.4097,
      googleMapsUrl:
        "https://maps.google.com/?q=Pavilhão+Municipal+Patrícia+Sampaio+Tomar",
      externalUrl: "https://templariosbtt.pt/",
      imageUrl: "",
      isFeatured: false,
    },
  });

  console.log(`✅ Event created/updated: ${event.slug}`);

  // 2. Upsert event translations separately (ALL 6 LANGUAGES)
  const eventTranslations = {
    pt: {
      title: "RAID Templários BTT 2026",
      description: `# 🚵‍♂️ RAID Templários BTT 2026

Descobre os melhores trilhos do concelho de Tomar neste épico evento de BTT! O RAID Templários BTT oferece dois percursos desafiantes que atravessam as paisagens históricas da região dos Templários.

## 🏔️ Dois Desafios à Tua Escolha

**Mini Raid:** 35 km com 750m D+ - perfeito para iniciantes e praticantes ocasionais
**Raid Completo:** 55 km com 1300m D+ - para os mais experientes e aventureiros

## ✨ Destaques

- **90% trilhos naturais** - caminhos florestais, estradas rurais e singletracks técnicos
- **Paisagens históricas** - pedala pela terra dos Cavaleiros Templários
- **Organização premium** - abastecimentos, assistência técnica e almoço convívio
- **Ambiente familiar** - evento acessível a todos os níveis (mínimo 12 anos para Mini Raid)

## 🎯 Inclui

- Marcação completa do percurso com placas de sinalização
- Seguro desportivo de acidentes pessoais
- Reforços sólidos e líquidos nos postos de abastecimento
- Zona de banho quente e lavagem de bicicletas
- Classificação por escalões e cronometragem oficial
- Opção de almoço convívio no pavilhão

Junta-te a nós para uma manhã inesquecível de BTT na histórica Tomar! 🏰🚴‍♀️`,
      city: "Tomar",
      metaTitle: "RAID Templários BTT 2026 - Tomar | 35km e 55km | 8 Março",
      metaDescription:
        "Participa no RAID Templários BTT 2026 em Tomar. Dois percursos: Mini Raid 35km (750m D+) e Raid 55km (1300m D+). Inscrições abertas! 90% trilhos naturais pela terra dos Templários.",
    },
    en: {
      title: "RAID Templários BTT 2026",
      description: `# 🚵‍♂️ RAID Templários BTT 2026

Discover the best trails in Tomar municipality at this epic MTB event! RAID Templários BTT offers two challenging routes through the historic landscapes of the Templar Knights region.

## 🏔️ Two Challenges to Choose From

**Mini Raid:** 35 km with 750m D+ - perfect for beginners and occasional riders
**Full Raid:** 55 km with 1300m D+ - for experienced and adventurous cyclists

## ✨ Highlights

- **90% natural trails** - forest paths, rural roads and technical singletracks
- **Historic landscapes** - ride through the land of the Templar Knights
- **Premium organization** - feed stations, technical support and lunch
- **Family-friendly** - accessible to all levels (minimum 12 years for Mini Raid)

## 🎯 Includes

- Complete route marking with directional signs
- Sports accident insurance
- Solid and liquid refreshments at feed stations
- Hot shower and bike wash area
- Age category rankings and official timing
- Optional lunch at the pavilion

Join us for an unforgettable morning of MTB in historic Tomar! 🏰🚴‍♀️`,
      city: "Tomar",
      metaTitle: "RAID Templários BTT 2026 - Tomar | 35km & 55km | March 8",
      metaDescription:
        "Join RAID Templários BTT 2026 in Tomar. Two routes: Mini Raid 35km (750m D+) and Full Raid 55km (1300m D+). Registrations open! 90% natural trails through Templar Knights territory.",
    },
    es: {
      title: "RAID Templários BTT 2026",
      description: `# 🚵‍♂️ RAID Templários BTT 2026

¡Descubre las mejores rutas del municipio de Tomar en este épico evento de MTB! El RAID Templários BTT ofrece dos recorridos desafiantes a través de los paisajes históricos de la región de los Caballeros Templarios.

## 🏔️ Dos Desafíos a Elegir

**Mini Raid:** 35 km con 750m D+ - perfecto para principiantes y ciclistas ocasionales
**Raid Completo:** 55 km con 1300m D+ - para ciclistas experimentados y aventureros

## ✨ Puntos Destacados

- **90% senderos naturales** - caminos forestales, carreteras rurales y singletracks técnicos
- **Paisajes históricos** - pedalea por la tierra de los Caballeros Templarios
- **Organización premium** - avituallamientos, asistencia técnica y almuerzo
- **Ambiente familiar** - accesible para todos los niveles (mínimo 12 años para Mini Raid)

## 🎯 Incluye

- Señalización completa del recorrido con placas direccionales
- Seguro deportivo de accidentes personales
- Avituallamientos sólidos y líquidos en los puntos de control
- Zona de duchas calientes y lavado de bicicletas
- Clasificación por categorías y cronometraje oficial
- Almuerzo opcional en el pabellón

¡Únete a nosotros para una mañana inolvidable de MTB en la histórica Tomar! 🏰🚴‍♀️`,
      city: "Tomar",
      metaTitle: "RAID Templários BTT 2026 - Tomar | 35km y 55km | 8 Marzo",
      metaDescription:
        "Participa en el RAID Templários BTT 2026 en Tomar. Dos rutas: Mini Raid 35km (750m D+) y Raid 55km (1300m D+). ¡Inscripciones abiertas! 90% senderos naturales por territorio templario.",
    },
    fr: {
      title: "RAID Templários BTT 2026",
      description: `# 🚵‍♂️ RAID Templários BTT 2026

Découvrez les meilleurs sentiers de la municipalité de Tomar lors de cet événement VTT épique ! Le RAID Templários BTT propose deux parcours stimulants à travers les paysages historiques de la région des Chevaliers Templiers.

## 🏔️ Deux Défis au Choix

**Mini Raid:** 35 km avec 750m D+ - parfait pour les débutants et cyclistes occasionnels
**Raid Complet:** 55 km avec 1300m D+ - pour les cyclistes expérimentés et aventureux

## ✨ Points Forts

- **90% sentiers naturels** - chemins forestiers, routes rurales et singletracks techniques
- **Paysages historiques** - pédalez sur la terre des Chevaliers Templiers
- **Organisation premium** - ravitaillements, assistance technique et déjeuner
- **Ambiance familiale** - accessible à tous les niveaux (minimum 12 ans pour le Mini Raid)

## 🎯 Inclus

- Balisage complet du parcours avec panneaux directionnels
- Assurance accidents sportifs
- Ravitaillements solides et liquides aux postes de contrôle
- Zone de douche chaude et lavage de vélos
- Classement par catégories et chronométrage officiel
- Déjeuner optionnel au pavillon

Rejoignez-nous pour une matinée inoubliable de VTT dans la ville historique de Tomar ! 🏰🚴‍♀️`,
      city: "Tomar",
      metaTitle: "RAID Templários BTT 2026 - Tomar | 35km et 55km | 8 Mars",
      metaDescription:
        "Participez au RAID Templários BTT 2026 à Tomar. Deux parcours : Mini Raid 35km (750m D+) et Raid 55km (1300m D+). Inscriptions ouvertes ! 90% sentiers naturels en territoire templier.",
    },
    de: {
      title: "RAID Templários BTT 2026",
      description: `# 🚵‍♂️ RAID Templários BTT 2026

Entdecke die besten Trails der Gemeinde Tomar bei diesem epischen MTB-Event! Das RAID Templários BTT bietet zwei herausfordernde Strecken durch die historischen Landschaften der Tempelritter-Region.

## 🏔️ Zwei Herausforderungen zur Auswahl

**Mini Raid:** 35 km mit 750 Hm - perfekt für Anfänger und Gelegenheitsfahrer
**Vollständiger Raid:** 55 km mit 1300 Hm - für erfahrene und abenteuerlustige Radfahrer

## ✨ Highlights

- **90% natürliche Trails** - Waldwege, Landstraßen und technische Singletracks
- **Historische Landschaften** - fahre durch das Land der Tempelritter
- **Premium-Organisation** - Verpflegungsstationen, technische Unterstützung und Mittagessen
- **Familienfreundlich** - für alle Niveaus zugänglich (Mindestalter 12 Jahre für Mini Raid)

## 🎯 Inklusive

- Vollständige Streckenmarkierung mit Richtungsschildern
- Sportunfallversicherung
- Feste und flüssige Verpflegung an den Kontrollpunkten
- Warmduschbereich und Fahrradwaschstation
- Alterskategorie-Rankings und offizielle Zeitmessung
- Optionales Mittagessen im Pavillon

Begleite uns zu einem unvergesslichen MTB-Morgen im historischen Tomar! 🏰🚴‍♀️`,
      city: "Tomar",
      metaTitle: "RAID Templários BTT 2026 - Tomar | 35km & 55km | 8. März",
      metaDescription:
        "Nehmen Sie am RAID Templários BTT 2026 in Tomar teil. Zwei Strecken: Mini Raid 35km (750 Hm) und Raid 55km (1300 Hm). Anmeldungen geöffnet! 90% natürliche Trails durch Tempelrittergebiet.",
    },
    it: {
      title: "RAID Templários BTT 2026",
      description: `# 🚵‍♂️ RAID Templários BTT 2026

Scopri i migliori sentieri del comune di Tomar in questo epico evento MTB! Il RAID Templários BTT offre due percorsi impegnativi attraverso i paesaggi storici della regione dei Cavalieri Templari.

## 🏔️ Due Sfide a Scelta

**Mini Raid:** 35 km con 750m D+ - perfetto per principianti e ciclisti occasionali
**Raid Completo:** 55 km con 1300m D+ - per ciclisti esperti e avventurosi

## ✨ Punti Salienti

- **90% sentieri naturali** - percorsi forestali, strade rurali e singletrack tecnici
- **Paesaggi storici** - pedala nella terra dei Cavalieri Templari
- **Organizzazione premium** - ristori, assistenza tecnica e pranzo
- **Ambiente familiare** - accessibile a tutti i livelli (minimo 12 anni per Mini Raid)

## 🎯 Include

- Segnaletica completa del percorso con cartelli direzionali
- Assicurazione infortuni sportivi
- Ristori solidi e liquidi ai punti di controllo
- Area docce calde e lavaggio biciclette
- Classifiche per categorie e cronometraggio ufficiale
- Pranzo facoltativo al padiglione

Unisciti a noi per una mattinata indimenticabile di MTB nella storica Tomar! 🏰🚴‍♀️`,
      city: "Tomar",
      metaTitle: "RAID Templários BTT 2026 - Tomar | 35km e 55km | 8 Marzo",
      metaDescription:
        "Partecipa al RAID Templários BTT 2026 a Tomar. Due percorsi: Mini Raid 35km (750m D+) e Raid 55km (1300m D+). Iscrizioni aperte! 90% sentieri naturali nel territorio templare.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: Language[lang],
        },
      },
      update: eventTranslations[lang],
      create: {
        eventId: event.id,
        language: Language[lang],
        ...eventTranslations[lang],
      },
    });
  }

  console.log("✅ Event translations created/updated (6 languages)");

  // 3. Upsert variants (idempotent with findFirst)
  const findOrCreateVariant = async (variantData: {
    name: string;
    distanceKm: number;
    elevationGainM: number;
    elevationLossM: number;
    startTime: string;
    maxParticipants: number;
    cutoffTimeHours: number;
    atrpGrade: number;
    mountainLevel: number;
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

  const miniRaidVariant = await findOrCreateVariant({
    name: "Mini Raid Templários BTT",
    distanceKm: 35,
    elevationGainM: 750,
    elevationLossM: 750,
    startTime: "09:00",
    maxParticipants: 250,
    cutoffTimeHours: 3.0,
    atrpGrade: 2,
    mountainLevel: 2,
    price: 15.0,
    currency: Currency.EUR,
  });

  console.log(`✅ Variant created/updated: ${miniRaidVariant.name}`);

  const raidVariant = await findOrCreateVariant({
    name: "Raid Templários BTT",
    distanceKm: 55,
    elevationGainM: 1300,
    elevationLossM: 1300,
    startTime: "09:00",
    maxParticipants: 250,
    cutoffTimeHours: 6.0,
    atrpGrade: 3,
    mountainLevel: 3,
    price: 18.0,
    currency: Currency.EUR,
  });

  console.log(`✅ Variant created/updated: ${raidVariant.name}`);

  // 4. Upsert variant translations (6 languages each)
  const miniRaidTranslations = {
    pt: {
      name: "Mini Raid Templários BTT",
      description: `## 🚵‍♂️ Mini Raid - 35km | 750m D+

Percurso ideal para iniciantes e praticantes ocasionais de BTT. Com dificuldade física e técnica média, o Mini Raid oferece uma experiência completa pelos trilhos históricos de Tomar.

### 📊 Características
- **Distância:** 35 km
- **Desnível Positivo:** 750m
- **Dificuldade Técnica:** Média
- **Dificuldade Física:** Média
- **Tempo Limite:** 3 horas
- **Velocidade Mínima:** 10 km/h

### 🎯 Ideal Para
- Iniciantes em BTT de média distância
- Praticantes ocasionais
- Quem procura um desafio equilibrado
- Idade mínima: 12 anos

O percurso atravessa 90% de trilhos naturais, caminhos florestais e estradas rurais não asfaltadas, proporcionando uma autêntica experiência de BTT no coração da região templária.`,
    },
    en: {
      name: "Mini Raid Templários BTT",
      description: `## 🚵‍♂️ Mini Raid - 35km | 750m D+

Ideal route for beginners and occasional MTB riders. With medium physical and technical difficulty, the Mini Raid offers a complete experience through the historic trails of Tomar.

### 📊 Characteristics
- **Distance:** 35 km
- **Elevation Gain:** 750m
- **Technical Difficulty:** Medium
- **Physical Difficulty:** Medium
- **Time Limit:** 3 hours
- **Minimum Speed:** 10 km/h

### 🎯 Ideal For
- Beginners in medium-distance MTB
- Occasional riders
- Those seeking a balanced challenge
- Minimum age: 12 years

The route crosses 90% natural trails, forest paths and unpaved rural roads, providing an authentic MTB experience in the heart of the Templar region.`,
    },
    es: {
      name: "Mini Raid Templários BTT",
      description: `## 🚵‍♂️ Mini Raid - 35km | 750m D+

Recorrido ideal para principiantes y ciclistas ocasionales de MTB. Con dificultad física y técnica media, el Mini Raid ofrece una experiencia completa por los senderos históricos de Tomar.

### 📊 Características
- **Distancia:** 35 km
- **Desnivel Positivo:** 750m
- **Dificultad Técnica:** Media
- **Dificultad Física:** Media
- **Tiempo Límite:** 3 horas
- **Velocidad Mínima:** 10 km/h

### 🎯 Ideal Para
- Principiantes en MTB de media distancia
- Ciclistas ocasionales
- Quienes buscan un desafío equilibrado
- Edad mínima: 12 años

El recorrido atraviesa 90% de senderos naturales, caminos forestales y carreteras rurales sin asfaltar, proporcionando una auténtica experiencia de MTB en el corazón de la región templaria.`,
    },
    fr: {
      name: "Mini Raid Templários BTT",
      description: `## 🚵‍♂️ Mini Raid - 35km | 750m D+

Parcours idéal pour les débutants et cyclistes occasionnels de VTT. Avec une difficulté physique et technique moyenne, le Mini Raid offre une expérience complète à travers les sentiers historiques de Tomar.

### 📊 Caractéristiques
- **Distance:** 35 km
- **Dénivelé Positif:** 750m
- **Difficulté Technique:** Moyenne
- **Difficulté Physique:** Moyenne
- **Temps Limite:** 3 heures
- **Vitesse Minimale:** 10 km/h

### 🎯 Idéal Pour
- Débutants en VTT moyenne distance
- Cyclistes occasionnels
- Ceux qui recherchent un défi équilibré
- Âge minimum: 12 ans

Le parcours traverse 90% de sentiers naturels, chemins forestiers et routes rurales non pavées, offrant une authentique expérience VTT au cœur de la région templière.`,
    },
    de: {
      name: "Mini Raid Templários BTT",
      description: `## 🚵‍♂️ Mini Raid - 35km | 750m D+

Ideale Strecke für Anfänger und Gelegenheits-MTB-Fahrer. Mit mittlerem physischen und technischen Schwierigkeitsgrad bietet der Mini Raid ein vollständiges Erlebnis durch die historischen Trails von Tomar.

### 📊 Eigenschaften
- **Distanz:** 35 km
- **Höhengewinn:** 750m
- **Technischer Schwierigkeitsgrad:** Mittel
- **Physischer Schwierigkeitsgrad:** Mittel
- **Zeitlimit:** 3 Stunden
- **Mindestgeschwindigkeit:** 10 km/h

### 🎯 Ideal Für
- Anfänger im Mittelstrecken-MTB
- Gelegenheitsfahrer
- Wer eine ausgewogene Herausforderung sucht
- Mindestalter: 12 Jahre

Die Strecke führt zu 90% über natürliche Trails, Waldwege und unbefestigte Landstraßen und bietet ein authentisches MTB-Erlebnis im Herzen der Tempelritter-Region.`,
    },
    it: {
      name: "Mini Raid Templários BTT",
      description: `## 🚵‍♂️ Mini Raid - 35km | 750m D+

Percorso ideale per principianti e ciclisti occasionali di MTB. Con difficoltà fisica e tecnica media, il Mini Raid offre un'esperienza completa attraverso i sentieri storici di Tomar.

### 📊 Caratteristiche
- **Distanza:** 35 km
- **Dislivello Positivo:** 750m
- **Difficoltà Tecnica:** Media
- **Difficoltà Fisica:** Media
- **Tempo Limite:** 3 ore
- **Velocità Minima:** 10 km/h

### 🎯 Ideale Per
- Principianti in MTB di media distanza
- Ciclisti occasionali
- Chi cerca una sfida equilibrata
- Età minima: 12 anni

Il percorso attraversa 90% di sentieri naturali, percorsi forestali e strade rurali non asfaltate, offrendo un'autentica esperienza MTB nel cuore della regione templare.`,
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: miniRaidVariant.id,
          language: Language[lang],
        },
      },
      update: miniRaidTranslations[lang],
      create: {
        variantId: miniRaidVariant.id,
        language: Language[lang],
        ...miniRaidTranslations[lang],
      },
    });
  }

  console.log(
    "✅ Mini Raid variant translations created/updated (6 languages)"
  );

  const raidTranslations = {
    pt: {
      name: "Raid Templários BTT",
      description: `## 🏔️ Raid Completo - 55km | 1300m D+

Percurso para ciclistas experientes que procuram um verdadeiro desafio. Com dificuldade física média/alta e técnica média, o Raid Completo é a prova máxima pelos trilhos históricos de Tomar.

### 📊 Características
- **Distância:** 55 km
- **Desnível Positivo:** 1300m
- **Dificuldade Técnica:** Média
- **Dificuldade Física:** Média/Alta
- **Tempo Limite:** 6 horas
- **Velocidade Mínima:** 10 km/h

### 🎯 Ideal Para
- Ciclistas experientes
- Aventureiros em busca de desafio
- Praticantes regulares de BTT
- Idade mínima: 18 anos

### ⚡ Requisitos
- Boa condição física
- Experiência em trilhos técnicos
- Equipamento adequado para longas distâncias
- Capacidade de navegação (GPS recomendado)

O percurso atravessa 90% de trilhos naturais, proporcionando uma experiência completa e exigente no coração da região templária, com paisagens deslumbrantes e secções técnicas memoráveis.`,
    },
    en: {
      name: "Full Raid Templários BTT",
      description: `## 🏔️ Full Raid - 55km | 1300m D+

Route for experienced cyclists seeking a true challenge. With medium/high physical difficulty and medium technical difficulty, the Full Raid is the ultimate test through Tomar's historic trails.

### 📊 Characteristics
- **Distance:** 55 km
- **Elevation Gain:** 1300m
- **Technical Difficulty:** Medium
- **Physical Difficulty:** Medium/High
- **Time Limit:** 6 hours
- **Minimum Speed:** 10 km/h

### 🎯 Ideal For
- Experienced cyclists
- Adventurers seeking a challenge
- Regular MTB riders
- Minimum age: 18 years

### ⚡ Requirements
- Good physical condition
- Experience on technical trails
- Suitable equipment for long distances
- Navigation skills (GPS recommended)

The route crosses 90% natural trails, providing a complete and demanding experience in the heart of the Templar region, with stunning landscapes and memorable technical sections.`,
    },
    es: {
      name: "Raid Completo Templários BTT",
      description: `## 🏔️ Raid Completo - 55km | 1300m D+

Recorrido para ciclistas experimentados que buscan un verdadero desafío. Con dificultad física media/alta y técnica media, el Raid Completo es la prueba definitiva por los senderos históricos de Tomar.

### 📊 Características
- **Distancia:** 55 km
- **Desnivel Positivo:** 1300m
- **Dificultad Técnica:** Media
- **Dificultad Física:** Media/Alta
- **Tiempo Límite:** 6 horas
- **Velocidad Mínima:** 10 km/h

### 🎯 Ideal Para
- Ciclistas experimentados
- Aventureros en busca de desafío
- Practicantes regulares de MTB
- Edad mínima: 18 años

### ⚡ Requisitos
- Buena condición física
- Experiencia en senderos técnicos
- Equipamiento adecuado para largas distancias
- Capacidad de navegación (GPS recomendado)

El recorrido atraviesa 90% de senderos naturales, proporcionando una experiencia completa y exigente en el corazón de la región templaria, con paisajes impresionantes y secciones técnicas memorables.`,
    },
    fr: {
      name: "Raid Complet Templários BTT",
      description: `## 🏔️ Raid Complet - 55km | 1300m D+

Parcours pour cyclistes expérimentés à la recherche d'un vrai défi. Avec une difficulté physique moyenne/élevée et technique moyenne, le Raid Complet est l'épreuve ultime à travers les sentiers historiques de Tomar.

### 📊 Caractéristiques
- **Distance:** 55 km
- **Dénivelé Positif:** 1300m
- **Difficulté Technique:** Moyenne
- **Difficulté Physique:** Moyenne/Élevée
- **Temps Limite:** 6 heures
- **Vitesse Minimale:** 10 km/h

### 🎯 Idéal Pour
- Cyclistes expérimentés
- Aventuriers cherchant un défi
- Pratiquants réguliers de VTT
- Âge minimum: 18 ans

### ⚡ Exigences
- Bonne condition physique
- Expérience sur sentiers techniques
- Équipement adapté pour longues distances
- Compétences en navigation (GPS recommandé)

Le parcours traverse 90% de sentiers naturels, offrant une expérience complète et exigeante au cœur de la région templière, avec des paysages époustouflants et des sections techniques mémorables.`,
    },
    de: {
      name: "Vollständiger Raid Templários BTT",
      description: `## 🏔️ Vollständiger Raid - 55km | 1300m D+

Strecke für erfahrene Radfahrer, die eine echte Herausforderung suchen. Mit mittlerem/hohem physischen Schwierigkeitsgrad und mittlerem technischen Schwierigkeitsgrad ist der vollständige Raid die ultimative Prüfung durch die historischen Trails von Tomar.

### 📊 Eigenschaften
- **Distanz:** 55 km
- **Höhengewinn:** 1300m
- **Technischer Schwierigkeitsgrad:** Mittel
- **Physischer Schwierigkeitsgrad:** Mittel/Hoch
- **Zeitlimit:** 6 Stunden
- **Mindestgeschwindigkeit:** 10 km/h

### 🎯 Ideal Für
- Erfahrene Radfahrer
- Abenteurer, die eine Herausforderung suchen
- Regelmäßige MTB-Fahrer
- Mindestalter: 18 Jahre

### ⚡ Anforderungen
- Gute körperliche Verfassung
- Erfahrung auf technischen Trails
- Geeignete Ausrüstung für lange Strecken
- Navigationsfähigkeiten (GPS empfohlen)

Die Strecke führt zu 90% über natürliche Trails und bietet ein vollständiges und anspruchsvolles Erlebnis im Herzen der Tempelritter-Region mit atemberaubenden Landschaften und unvergesslichen technischen Abschnitten.`,
    },
    it: {
      name: "Raid Completo Templários BTT",
      description: `## 🏔️ Raid Completo - 55km | 1300m D+

Percorso per ciclisti esperti che cercano una vera sfida. Con difficoltà fisica media/alta e tecnica media, il Raid Completo è la prova definitiva attraverso i sentieri storici di Tomar.

### 📊 Caratteristiche
- **Distanza:** 55 km
- **Dislivello Positivo:** 1300m
- **Difficoltà Tecnica:** Media
- **Difficoltà Fisica:** Media/Alta
- **Tempo Limite:** 6 ore
- **Velocità Minima:** 10 km/h

### 🎯 Ideale Per
- Ciclisti esperti
- Avventurieri in cerca di sfida
- Praticanti regolari di MTB
- Età minima: 18 anni

### ⚡ Requisiti
- Buona condizione fisica
- Esperienza su sentieri tecnici
- Attrezzatura adeguata per lunghe distanze
- Capacità di navigazione (GPS consigliato)

Il percorso attraversa 90% di sentieri naturali, offrendo un'esperienza completa ed esigente nel cuore della regione templare, con paesaggi mozzafiato e sezioni tecniche memorabili.`,
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: raidVariant.id,
          language: Language[lang],
        },
      },
      update: raidTranslations[lang],
      create: {
        variantId: raidVariant.id,
        language: Language[lang],
        ...raidTranslations[lang],
      },
    });
  }

  console.log("✅ Raid variant translations created/updated (6 languages)");

  // 5. Upsert pricing phases (using eventId, NOT variantId)
  const findOrCreatePricingPhase = async (
    name: string,
    data: {
      startDate: Date;
      endDate: Date;
      price: number;
      currency: Currency;
      discountPercent: number | null;
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

  // Mini Raid pricing phases
  await findOrCreatePricingPhase("Mini Raid 35km - Sem Almoço", {
    startDate: new Date("2026-01-03T20:00:00.000Z"),
    endDate: new Date("2026-03-01T23:59:00.000Z"),
    price: 18.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Inscrição sem almoço",
  });

  await findOrCreatePricingPhase("Mini Raid 35km - Com Almoço", {
    startDate: new Date("2026-01-03T20:00:00.000Z"),
    endDate: new Date("2026-03-01T23:59:00.000Z"),
    price: 26.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Inscrição com almoço convívio incluído",
  });

  // Raid pricing phases
  await findOrCreatePricingPhase("Raid 55km - Sem Almoço", {
    startDate: new Date("2026-01-03T20:00:00.000Z"),
    endDate: new Date("2026-03-01T23:59:00.000Z"),
    price: 18.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Inscrição sem almoço",
  });

  await findOrCreatePricingPhase("Raid 55km - Com Almoço", {
    startDate: new Date("2026-01-03T20:00:00.000Z"),
    endDate: new Date("2026-03-01T23:59:00.000Z"),
    price: 26.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Inscrição com almoço convívio incluído",
  });

  console.log("✅ Pricing phases created/updated");

  // 6. Optional FAQs for SEO
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

  const faq1 = await findOrCreateFAQ(
    event.id,
    0,
    "Qual a idade mínima para participar?",
    "Para o Mini Raid a idade mínima é 12 anos (com autorização dos pais/tutores). Para o Raid completo a idade mínima é 18 anos."
  );

  const faq1Translations = {
    pt: {
      question: "Qual a idade mínima para participar?",
      answer:
        "Para o Mini Raid a idade mínima é 12 anos (com autorização dos pais/tutores). Para o Raid completo a idade mínima é 18 anos.",
    },
    en: {
      question: "What is the minimum age to participate?",
      answer:
        "For the Mini Raid the minimum age is 12 years (with parental/guardian authorization). For the Full Raid the minimum age is 18 years.",
    },
    es: {
      question: "¿Cuál es la edad mínima para participar?",
      answer:
        "Para el Mini Raid la edad mínima es 12 años (con autorización de los padres/tutores). Para el Raid completo la edad mínima es 18 años.",
    },
    fr: {
      question: "Quel est l'âge minimum pour participer?",
      answer:
        "Pour le Mini Raid l'âge minimum est de 12 ans (avec autorisation des parents/tuteurs). Pour le Raid complet l'âge minimum est de 18 ans.",
    },
    de: {
      question: "Was ist das Mindestalter zur Teilnahme?",
      answer:
        "Für den Mini Raid beträgt das Mindestalter 12 Jahre (mit Genehmigung der Eltern/Erziehungsberechtigten). Für den vollständigen Raid beträgt das Mindestalter 18 Jahre.",
    },
    it: {
      question: "Qual è l'età minima per partecipare?",
      answer:
        "Per il Mini Raid l'età minima è 12 anni (con autorizzazione dei genitori/tutori). Per il Raid completo l'età minima è 18 anni.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: {
        faqId_language: {
          faqId: faq1.id,
          language: Language[lang],
        },
      },
      update: faq1Translations[lang],
      create: {
        faqId: faq1.id,
        language: Language[lang],
        ...faq1Translations[lang],
      },
    });
  }

  const faq2 = await findOrCreateFAQ(
    event.id,
    1,
    "O que está incluído na inscrição?",
    "A inscrição inclui: marcação do percurso, seguro desportivo, reforços alimentares nos postos, banho quente, lavagem de bicicletas, cronometragem e classificação. O almoço é opcional (+8€)."
  );

  const faq2Translations = {
    pt: {
      question: "O que está incluído na inscrição?",
      answer:
        "A inscrição inclui: marcação do percurso, seguro desportivo, reforços alimentares nos postos, banho quente, lavagem de bicicletas, cronometragem e classificação. O almoço é opcional (+8€).",
    },
    en: {
      question: "What is included in the registration?",
      answer:
        "Registration includes: route marking, sports insurance, refreshments at feed stations, hot shower, bike wash, timing and ranking. Lunch is optional (+8€).",
    },
    es: {
      question: "¿Qué está incluido en la inscripción?",
      answer:
        "La inscripción incluye: señalización del recorrido, seguro deportivo, avituallamientos en los puntos de control, ducha caliente, lavado de bicicletas, cronometraje y clasificación. El almuerzo es opcional (+8€).",
    },
    fr: {
      question: "Qu'est-ce qui est inclus dans l'inscription?",
      answer:
        "L'inscription comprend: balisage du parcours, assurance sportive, ravitaillements aux postes, douche chaude, lavage de vélos, chronométrage et classement. Le déjeuner est en option (+8€).",
    },
    de: {
      question: "Was ist in der Anmeldung enthalten?",
      answer:
        "Die Anmeldung umfasst: Streckenmarkierung, Sportversicherung, Verpflegung an den Stationen, Warmdusche, Fahrradwäsche, Zeitmessung und Ranking. Mittagessen ist optional (+8€).",
    },
    it: {
      question: "Cosa è incluso nell'iscrizione?",
      answer:
        "L'iscrizione include: segnaletica del percorso, assicurazione sportiva, ristori ai punti di controllo, doccia calda, lavaggio biciclette, cronometraggio e classifica. Il pranzo è facoltativo (+8€).",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: {
        faqId_language: {
          faqId: faq2.id,
          language: Language[lang],
        },
      },
      update: faq2Translations[lang],
      create: {
        faqId: faq2.id,
        language: Language[lang],
        ...faq2Translations[lang],
      },
    });
  }

  const faq3 = await findOrCreateFAQ(
    event.id,
    2,
    "Quando abrem as inscrições?",
    "As inscrições abrem no dia 3 de janeiro de 2026 às 20:00 e decorrem até 1 de março de 2026 às 23:59, ou até atingir o limite de 500 participantes."
  );

  const faq3Translations = {
    pt: {
      question: "Quando abrem as inscrições?",
      answer:
        "As inscrições abrem no dia 3 de janeiro de 2026 às 20:00 e decorrem até 1 de março de 2026 às 23:59, ou até atingir o limite de 500 participantes.",
    },
    en: {
      question: "When do registrations open?",
      answer:
        "Registrations open on January 3, 2026 at 20:00 and run until March 1, 2026 at 23:59, or until reaching the limit of 500 participants.",
    },
    es: {
      question: "¿Cuándo se abren las inscripciones?",
      answer:
        "Las inscripciones se abren el 3 de enero de 2026 a las 20:00 y se prolongan hasta el 1 de marzo de 2026 a las 23:59, o hasta alcanzar el límite de 500 participantes.",
    },
    fr: {
      question: "Quand les inscriptions ouvrent-elles?",
      answer:
        "Les inscriptions ouvrent le 3 janvier 2026 à 20h00 et se poursuivent jusqu'au 1er mars 2026 à 23h59, ou jusqu'à atteindre la limite de 500 participants.",
    },
    de: {
      question: "Wann öffnen die Anmeldungen?",
      answer:
        "Die Anmeldungen öffnen am 3. Januar 2026 um 20:00 Uhr und laufen bis zum 1. März 2026 um 23:59 Uhr oder bis zur Erreichung der Grenze von 500 Teilnehmern.",
    },
    it: {
      question: "Quando aprono le iscrizioni?",
      answer:
        "Le iscrizioni aprono il 3 gennaio 2026 alle 20:00 e durano fino al 1° marzo 2026 alle 23:59, o fino al raggiungimento del limite di 500 partecipanti.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: {
        faqId_language: {
          faqId: faq3.id,
          language: Language[lang],
        },
      },
      update: faq3Translations[lang],
      create: {
        faqId: faq3.id,
        language: Language[lang],
        ...faq3Translations[lang],
      },
    });
  }

  console.log("✅ FAQs created/updated (3 FAQs with 6 languages each)");

  console.log("\n🎉 RAID Templários BTT 2026 seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
