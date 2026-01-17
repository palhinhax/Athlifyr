/**
 * Seed: Light On Tri Woippy 2026
 * Complete with translations in all 6 languages
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏊 Seeding Light On Tri Woippy 2026...");

  const eventSlug = "light-on-tri-woippy-2026";

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "Light On Tri Woippy 2026",
      description: `Triatlo Light On em Woippy, França. Localizado perto de Metz e a 45 minutos de Nancy, o evento oferece duas distâncias: Sprint (S) e Olímpico (M). Um dia perfeito para testar os teus limites ou desfrutar com a família graças às diversas atividades desenvolvidas ao lado da competição desportiva.`,
      sportTypes: [SportType.TRIATHLON],
      startDate: new Date("2026-05-17T09:00:00.000Z"),
      endDate: new Date("2026-05-17T13:30:00.000Z"),
      city: "Woippy",
      country: "France",
      latitude: 49.1507,
      longitude: 6.1497,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Woippy+Plage+Woippy+France",
      externalUrl: "https://www.lightontri.com",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-05-16T19:00:00.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "Light On Tri Woippy 2026",
      description: `Triatlo Light On em Woippy, França. Localizado perto de Metz e a 45 minutos de Nancy, o evento oferece duas distâncias: Sprint (S) e Olímpico (M). Um dia perfeito para testar os teus limites ou desfrutar com a família graças às diversas atividades desenvolvidas ao lado da competição desportiva.`,
      sportTypes: [SportType.TRIATHLON],
      startDate: new Date("2026-05-17T09:00:00.000Z"),
      endDate: new Date("2026-05-17T13:30:00.000Z"),
      city: "Woippy",
      country: "France",
      latitude: 49.1507,
      longitude: 6.1497,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Woippy+Plage+Woippy+France",
      externalUrl: "https://www.lightontri.com",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-05-16T19:00:00.000Z"),
    },
  });

  console.log(`✅ Event upserted: ${event.slug} (ID: ${event.id})`);

  // Step 2: Upsert translations separately (ALL 6 LANGUAGES)
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
      title: "Light On Tri Woippy 2026",
      description: `# 🏊‍♂️🚴‍♂️🏃‍♂️ Light On Tri Woippy 2026

Bem-vindo ao **Light On Tri Woippy**, um evento de triatlo em França localizado perto de Metz e a 45 minutos de Nancy. O local da **Woippy Plage** é ideal para os atletas da região de Lorraine virem superar os seus limites ou simplesmente desfrutar de um belo dia com as suas famílias.

## 📅 Data e Programa

**17 de Maio de 2026 (Domingo)**

### Sábado, 16 de Maio:
- **17h00 - 19h00:** Levantamento de dorsais para categorias S* e M**

### Domingo, 17 de Maio:
- **07h00 - 08h30:** Levantamento de dorsais para Sprint Triathlon*
- **09h00:** Partida do Sprint Triathlon* (Mulheres e Homens)
- **11h30:** Partida da Corrida 6 KM
- **11h30 - 13h00:** Levantamento de dorsais para M Triathlon**
- **13h30:** Partida do M** Triathlon (Mulheres e Homens)

## 🏊 Triatlo Sprint (S)*

### Natação - 500m
- Partida na água
- Uma volta de 500 metros
- Apenas uma partida às 09h00
- Fato de neoprene recomendado (temperatura média: 17°C)

### Ciclismo - 16 km
- Parque de bicicletas no local Woippy Plage
- Uma volta de 16 km
- **D+ = 230m** / Subida de 2 km a 7,5%

### Corrida - 5,6 km
- Duas voltas de 2,8 km
- Um posto de abastecimento a meio da prova
- Percurso plano

**Distância Total:** 500m natação + 16 km ciclismo + 5,6 km corrida

## 🏊 Triatlo Olímpico (M)**

### Natação - 1,5 km
- Partida na água
- Duas voltas de 750 metros com saída australiana de 150m
- Apenas uma partida às 13h30
- Fato de neoprene recomendado (temperatura média: 17°C)

### Ciclismo - 40 km
- Parque de bicicletas no local Woippy Plage
- Três voltas
- **D+ = 680m** / Três subidas de 2 km a 7,5%

### Corrida - 10 km
- Três voltas de 3,3 km: 100% estrada
- 2 postos de abastecimento

**Distância Total:** 1,5 km natação + 40 km ciclismo + 10 km corrida

## 🏃 Corrida 6 KM

Uma corrida independente de 6 km com duas voltas de 2,8 km, percurso plano e um posto de abastecimento.

**Horário:** 11h30

## 📋 Regulamento

- **Documento de Identidade:** Obrigatório para levantamento de dorsais
- **Número de Participantes:** Limitado para cada formato de prova
- **Inscrição Antecipada:** Recomendada

## 📍 Localização

**Local:** Woippy Plage  
**Cidade:** Woippy, Moselle (57)  
**Região:** Grand Est, França  
**Proximidade:** Perto de Metz, 45 min de Nancy

## 👥 Organização

**Organizador:** Woippy Triathlon / Light On Tri  
**Contacto:** hello@lightontri.com  
**Telefone:** +33 6 37 08 97 57  
**Website:** [lightontri.com](https://www.lightontri.com)

## 🎯 Para Quem?

- **Triatletas Sprint:** Iniciantes e experientes
- **Triatletas Olímpicos:** Atletas que procuram desafio
- **Corredores:** Corrida independente de 6 km
- **Famílias:** Atividades paralelas para toda a família

## 🏆 Categorias

- **Sprint Triathlon (S):** Mulheres e Homens
- **Olympic Triathlon (M):** Mulheres e Homens
- **Corrida 6 km:** Todas as idades

---

**Não percas a oportunidade de participar num dos melhores triatlos da região de Lorraine!** 🏊‍♂️🚴‍♂️🏃‍♂️`,
      city: "Woippy",
      metaTitle: "Light On Tri Woippy 2026 | Triatlo Sprint e Olímpico França",
      metaDescription:
        "Light On Tri Woippy 2026: Triatlo Sprint (500m-16km-5.6km) e Olímpico (1.5km-40km-10km) + Corrida 6km. 17 Maio em Woippy, França. Inscreve-te!",
    },
    {
      language: "en",
      title: "Light On Tri Woippy 2026",
      description: `# 🏊‍♂️🚴‍♂️🏃‍♂️ Light On Tri Woippy 2026

Welcome to **Light On Tri Woippy**, a triathlon event in France located near Metz and 45 minutes from Nancy. The **Woippy Plage** venue is ideal for athletes from the Lorraine region to come and push their limits or simply enjoy a beautiful day with their families.

## 📅 Date and Schedule

**May 17, 2026 (Sunday)**

### Saturday, May 16:
- **5:00 PM - 7:00 PM:** Bib collection for S* and M** categories

### Sunday, May 17:
- **7:00 AM - 8:30 AM:** Bib collection for Sprint Triathlon*
- **9:00 AM:** Start of Sprint Triathlon* (Women and Men)
- **11:30 AM:** Start of 6 KM Run
- **11:30 AM - 1:00 PM:** Bib collection for M Triathlon**
- **1:30 PM:** Start of M** Triathlon (Women and Men)

## 🏊 Sprint Triathlon (S)*

### Swim - 500m
- Water start
- One 500-meter loop
- Single start at 9:00 AM
- Wetsuit recommended (average temperature: 17°C)

### Bike - 16 km
- Bike park at Woippy Plage site
- One 16 km loop
- **D+ = 230m** / 2 km climb at 7.5%

### Run - 5.6 km
- Two loops of 2.8 km
- One aid station midway
- Flat course

**Total Distance:** 500m swim + 16 km bike + 5.6 km run

## 🏊 Olympic Triathlon (M)**

### Swim - 1.5 km
- Water start
- Two loops of 750 meters with 150m Australian exit
- Single start at 1:30 PM
- Wetsuit recommended (average temperature: 17°C)

### Bike - 40 km
- Bike park at Woippy Plage site
- Three loops
- **D+ = 680m** / Three 2 km climbs at 7.5%

### Run - 10 km
- Three loops of 3.3 km: 100% road
- 2 aid stations

**Total Distance:** 1.5 km swim + 40 km bike + 10 km run

## 🏃 6 KM Run

An independent 6 km run with two loops of 2.8 km, flat course and one aid station.

**Time:** 11:30 AM

## 📋 Rules

- **ID Required:** Mandatory for bib collection
- **Limited Spots:** For each race format
- **Early Registration:** Recommended

## 📍 Location

**Venue:** Woippy Plage  
**City:** Woippy, Moselle (57)  
**Region:** Grand Est, France  
**Proximity:** Near Metz, 45 min from Nancy

## 👥 Organization

**Organizer:** Woippy Triathlon / Light On Tri  
**Contact:** hello@lightontri.com  
**Phone:** +33 6 37 08 97 57  
**Website:** [lightontri.com](https://www.lightontri.com)

Register now for one of the best triathlons in the Lorraine region! 🏊‍♂️🚴‍♂️🏃‍♂️`,
      city: "Woippy",
      metaTitle: "Light On Tri Woippy 2026 | Sprint & Olympic Triathlon France",
      metaDescription:
        "Light On Tri Woippy 2026: Sprint Triathlon (500m-16km-5.6km) and Olympic (1.5km-40km-10km) + 6km Run. May 17 in Woippy, France. Register now!",
    },
    {
      language: "es",
      title: "Light On Tri Woippy 2026",
      description: `# 🏊‍♂️🚴‍♂️🏃‍♂️ Light On Tri Woippy 2026

Bienvenidos al **Light On Tri Woippy**, un evento de triatlón en Francia ubicado cerca de Metz y a 45 minutos de Nancy.

## 📅 Fecha y Horario

**17 de Mayo de 2026**

- **09:00:** Triatlón Sprint (500m natación, 16km ciclismo, 5,6km carrera)
- **13:30:** Triatlón Olímpico (1,5km natación, 40km ciclismo, 10km carrera)
- **11:30:** Carrera 6 KM

## 🏊 Triatlón Sprint (S)
- **Natación:** 500m (temperatura media 17°C)
- **Ciclismo:** 16 km con D+ = 230m
- **Carrera:** 5,6 km (recorrido plano)

## 🏊 Triatlón Olímpico (M)
- **Natación:** 1,5 km (temperatura media 17°C)
- **Ciclismo:** 40 km con D+ = 680m
- **Carrera:** 10 km (100% asfalto)

## 📍 Ubicación

**Lugar:** Woippy Plage, Woippy  
**Región:** Grand Est, Francia  
**Cerca de:** Metz (cerca), Nancy (45 min)

## 📧 Contacto

**Email:** hello@lightontri.com  
**Tel:** +33 6 37 08 97 57  
**Web:** [lightontri.com](https://www.lightontri.com)

¡Regístrate para uno de los mejores triatlones de la región de Lorena! 🏊‍♂️🚴‍♂️🏃‍♂️`,
      city: "Woippy",
      metaTitle: "Light On Tri Woippy 2026 | Triatlón Sprint y Olímpico",
      metaDescription:
        "Light On Tri Woippy 2026: Triatlón Sprint (500m-16km-5.6km) y Olímpico (1.5km-40km-10km). 17 mayo en Woippy, Francia.",
    },
    {
      language: "fr",
      title: "Light On Tri Woippy 2026",
      description: `# 🏊‍♂️🚴‍♂️🏃‍♂️ Light On Tri Woippy 2026

Bienvenue au **Light On Tri Woippy**, un événement de triathlon en France situé à deux pas de Metz et à 45 minutes de Nancy. L'emplacement de **Woippy Plage** est idéal pour les lorrains qui souhaitent repousser leurs limites ou simplement profiter d'une belle journée en famille.

## 📅 Date et Programme

**17 Mai 2026 (Dimanche)**

### Samedi 16 Mai :
- **17h00 - 19h00 :** Retrait des dossards pour les catégories S* et M**

### Dimanche 17 Mai :
- **07h00 - 08h30 :** Retrait des dossards pour le Triathlon Sprint*
- **09h00 :** Départ du Triathlon Sprint* (Femmes et Hommes)
- **11h30 :** Départ de la Course 6 KM
- **11h30 - 13h00 :** Retrait des dossards pour le Triathlon M**
- **13h30 :** Départ du Triathlon M** (Femmes et Hommes)

## 🏊 Triathlon Sprint (S)*

### Natation - 500m
- Départ dans l'eau
- Une boucle de 500 mètres
- Un seul départ à 09h00
- Combinaison néoprène recommandée (température moyenne : 17°C)

### Vélo - 16 km
- Parc à vélos sur le site de Woippy Plage
- Une boucle de 16 km
- **D+ = 230m** / Montée de 2 km à 7,5%

### Course à pied - 5,6 km
- Deux boucles de 2,8 km
- Un ravitaillement à mi-parcours
- Parcours plat

**Distance totale :** 500m natation + 16 km vélo + 5,6 km course

## 🏊 Triathlon Olympique (M)**

### Natation - 1,5 km
- Départ dans l'eau
- Deux boucles de 750 mètres avec sortie australienne de 150m
- Un seul départ à 13h30
- Combinaison néoprène recommandée (température moyenne : 17°C)

### Vélo - 40 km
- Parc à vélos sur le site de Woippy Plage
- Trois boucles
- **D+ = 680m** / Trois montées de 2 km à 7,5%

### Course à pied - 10 km
- Trois boucles de 3,3 km : 100% route
- 2 ravitaillements

**Distance totale :** 1,5 km natation + 40 km vélo + 10 km course

## 🏃 Course 6 KM

Une course indépendante de 6 km avec deux boucles de 2,8 km, parcours plat et un ravitaillement.

**Horaire :** 11h30

## 📋 Règlement

- **Pièce d'identité :** Obligatoire pour le retrait des dossards
- **Nombre de participants :** Limité pour chaque format de course
- **Inscription anticipée :** Recommandée

## 📍 Localisation

**Lieu :** Woippy Plage  
**Ville :** Woippy, Moselle (57)  
**Région :** Grand Est, France  
**Proximité :** Près de Metz, 45 min de Nancy

## 👥 Organisation

**Organisateur :** Woippy Triathlon / Light On Tri  
**Contact :** hello@lightontri.com  
**Téléphone :** 06 37 08 97 57  
**Site web :** [lightontri.com](https://www.lightontri.com)

Inscrivez-vous pour l'un des meilleurs triathlons de la région Lorraine ! 🏊‍♂️🚴‍♂️🏃‍♂️`,
      city: "Woippy",
      metaTitle: "Light On Tri Woippy 2026 | Triathlon Sprint et Olympique",
      metaDescription:
        "Light On Tri Woippy 2026 : Triathlon Sprint (500m-16km-5.6km) et Olympique (1.5km-40km-10km) + Course 6km. 17 mai à Woippy, France.",
    },
    {
      language: "de",
      title: "Light On Tri Woippy 2026",
      description: `# 🏊‍♂️🚴‍♂️🏃‍♂️ Light On Tri Woippy 2026

Willkommen beim **Light On Tri Woippy**, einer Triathlon-Veranstaltung in Frankreich in der Nähe von Metz und 45 Minuten von Nancy entfernt.

## 📅 Datum und Zeitplan

**17. Mai 2026**

- **09:00 Uhr:** Sprint-Triathlon (500m Schwimmen, 16km Radfahren, 5,6km Laufen)
- **13:30 Uhr:** Olympischer Triathlon (1,5km Schwimmen, 40km Radfahren, 10km Laufen)
- **11:30 Uhr:** 6 KM Lauf

## 🏊 Sprint-Triathlon (S)
- **Schwimmen:** 500m (Durchschnittstemperatur 17°C)
- **Radfahren:** 16 km mit D+ = 230m
- **Laufen:** 5,6 km (flache Strecke)

## 🏊 Olympischer Triathlon (M)
- **Schwimmen:** 1,5 km (Durchschnittstemperatur 17°C)
- **Radfahren:** 40 km mit D+ = 680m
- **Laufen:** 10 km (100% Straße)

## 📍 Standort

**Ort:** Woippy Plage, Woippy  
**Region:** Grand Est, Frankreich  
**In der Nähe von:** Metz (nahe), Nancy (45 Min.)

## 📧 Kontakt

**E-Mail:** hello@lightontri.com  
**Tel:** +33 6 37 08 97 57  
**Web:** [lightontri.com](https://www.lightontri.com)

Melden Sie sich für einen der besten Triathlons in der Region Lothringen an! 🏊‍♂️🚴‍♂️🏃‍♂️`,
      city: "Woippy",
      metaTitle: "Light On Tri Woippy 2026 | Sprint & Olympischer Triathlon",
      metaDescription:
        "Light On Tri Woippy 2026: Sprint-Triathlon (500m-16km-5.6km) und Olympisch (1.5km-40km-10km). 17. Mai in Woippy, Frankreich.",
    },
    {
      language: "it",
      title: "Light On Tri Woippy 2026",
      description: `# 🏊‍♂️🚴‍♂️🏃‍♂️ Light On Tri Woippy 2026

Benvenuti al **Light On Tri Woippy**, un evento di triathlon in Francia situato vicino a Metz e a 45 minuti da Nancy.

## 📅 Data e Orario

**17 Maggio 2026**

- **09:00:** Triathlon Sprint (500m nuoto, 16km ciclismo, 5,6km corsa)
- **13:30:** Triathlon Olimpico (1,5km nuoto, 40km ciclismo, 10km corsa)
- **11:30:** Corsa 6 KM

## 🏊 Triathlon Sprint (S)
- **Nuoto:** 500m (temperatura media 17°C)
- **Ciclismo:** 16 km con D+ = 230m
- **Corsa:** 5,6 km (percorso pianeggiante)

## 🏊 Triathlon Olimpico (M)
- **Nuoto:** 1,5 km (temperatura media 17°C)
- **Ciclismo:** 40 km con D+ = 680m
- **Corsa:** 10 km (100% strada)

## 📍 Posizione

**Luogo:** Woippy Plage, Woippy  
**Regione:** Grand Est, Francia  
**Vicino a:** Metz (vicino), Nancy (45 min)

## 📧 Contatto

**Email:** hello@lightontri.com  
**Tel:** +33 6 37 08 97 57  
**Web:** [lightontri.com](https://www.lightontri.com)

Iscriviti a uno dei migliori triathlon della regione della Lorena! 🏊‍♂️🚴‍♂️🏃‍♂️`,
      city: "Woippy",
      metaTitle: "Light On Tri Woippy 2026 | Triathlon Sprint e Olimpico",
      metaDescription:
        "Light On Tri Woippy 2026: Triathlon Sprint (500m-16km-5.6km) e Olimpico (1.5km-40km-10km). 17 maggio a Woippy, Francia.",
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

  // Step 3: Create variants (Sprint Triathlon, Olympic Triathlon, 6km Run)
  const variants = [
    {
      name: "Triathlon Sprint (S) - Individual",
      distanceKm: null,
      price: 0.0,
      startTime: "09:00",
      triathlonSegments: [
        {
          segmentType: "SWIM" as const,
          distanceKm: 0.5,
          terrainType: "OPEN_WATER" as const,
          order: 1,
        },
        {
          segmentType: "BIKE" as const,
          distanceKm: 16,
          terrainType: "ROAD" as const,
          order: 2,
        },
        {
          segmentType: "RUN" as const,
          distanceKm: 5.6,
          terrainType: "ROAD" as const,
          order: 3,
        },
      ],
    },
    {
      name: "Triathlon Olímpico (M) - Individual",
      distanceKm: null,
      price: 0.0,
      startTime: "13:30",
      triathlonSegments: [
        {
          segmentType: "SWIM" as const,
          distanceKm: 1.5,
          terrainType: "OPEN_WATER" as const,
          order: 1,
        },
        {
          segmentType: "BIKE" as const,
          distanceKm: 40,
          terrainType: "ROAD" as const,
          order: 2,
        },
        {
          segmentType: "RUN" as const,
          distanceKm: 10,
          terrainType: "ROAD" as const,
          order: 3,
        },
      ],
    },
    {
      name: "Corrida 6 KM",
      distanceKm: 6,
      price: 0.0,
      startTime: "11:30",
    },
  ];

  for (const variantData of variants) {
    const existing = await prisma.eventVariant.findFirst({
      where: {
        eventId: event.id,
        name: variantData.name,
      },
    });

    if (existing) {
      // Delete existing segments before update
      await prisma.triathlonSegment.deleteMany({
        where: { variantId: existing.id },
      });

      // Update variant
      const variant = await prisma.eventVariant.update({
        where: { id: existing.id },
        data: {
          distanceKm: variantData.distanceKm,
          price: variantData.price,
          startTime: variantData.startTime,
        },
      });

      // Create new segments if they exist
      if (variantData.triathlonSegments) {
        for (const segment of variantData.triathlonSegments) {
          await prisma.triathlonSegment.create({
            data: {
              variantId: variant.id,
              segmentType: segment.segmentType,
              distanceKm: segment.distanceKm,
              terrainType: segment.terrainType,
              order: segment.order,
            },
          });
        }
      }

      console.log(`✅ Variant updated: ${variant.name}`);
    } else {
      // Create new variant
      const variant = await prisma.eventVariant.create({
        data: {
          eventId: event.id,
          name: variantData.name,
          distanceKm: variantData.distanceKm,
          price: variantData.price,
          startTime: variantData.startTime,
        },
      });

      // Create segments if they exist
      if (variantData.triathlonSegments) {
        for (const segment of variantData.triathlonSegments) {
          await prisma.triathlonSegment.create({
            data: {
              variantId: variant.id,
              segmentType: segment.segmentType,
              distanceKm: segment.distanceKm,
              terrainType: segment.terrainType,
              order: segment.order,
            },
          });
        }
      }

      console.log(`✅ Variant created: ${variant.name}`);
    }
  }

  console.log("");
  console.log("🎉 Light On Tri Woippy 2026 seeded successfully!");
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
