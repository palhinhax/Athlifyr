/**
 * Seed: Swim Grand Prix Cascais 2026
 * Complete with translations in all 6 languages
 * Praia da Ribeira, Cascais - July 18-19, 2026
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏊 Seeding Swim Grand Prix Cascais 2026...");

  const eventSlug = "swim-grand-prix-cascais-2026";

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "Swim Grand Prix Cascais 2026",
      description: `Swim Grand Prix na icónica Praia da Ribeira, em plena baía de Cascais. Vila de pescadores com mais de 650 anos, foi local de veraneio da realeza portuguesa e europeia. A localização excelente, praias de areia branca e inúmeras atividades para toda a família tornam este lugar incomparável. Várias distâncias de natação em águas abertas.`,
      sportTypes: [SportType.SWIMMING],
      startDate: new Date("2026-07-18T09:00:00.000Z"),
      endDate: new Date("2026-07-19T17:00:00.000Z"),
      city: "Cascais",
      country: "Portugal",
      latitude: 38.6954,
      longitude: -9.4203,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Praia+da+Ribeira+Cascais+Portugal",
      externalUrl: "https://www.swimgp.com",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-07-15T23:59:00.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "Swim Grand Prix Cascais 2026",
      description: `Swim Grand Prix na icónica Praia da Ribeira, em plena baía de Cascais. Vila de pescadores com mais de 650 anos, foi local de veraneio da realeza portuguesa e europeia. A localização excelente, praias de areia branca e inúmeras atividades para toda a família tornam este lugar incomparável. Várias distâncias de natação em águas abertas.`,
      sportTypes: [SportType.SWIMMING],
      startDate: new Date("2026-07-18T09:00:00.000Z"),
      endDate: new Date("2026-07-19T17:00:00.000Z"),
      city: "Cascais",
      country: "Portugal",
      latitude: 38.6954,
      longitude: -9.4203,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Praia+da+Ribeira+Cascais+Portugal",
      externalUrl: "https://www.swimgp.com",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-07-15T23:59:00.000Z"),
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
      title: "Swim Grand Prix Cascais 2026",
      description: `# 🏊‍♂️ Swim Grand Prix Cascais 2026

Bem-vindo ao **Swim Grand Prix Cascais 2026**, uma das provas de natação em águas abertas mais emblemáticas de Portugal!

## 📍 Local Icónico

As provas decorrem na **Praia da Ribeira**, em plena baía de Cascais. Vila de pescadores com mais de **650 anos de história**, Cascais foi local de veraneio da **realeza portuguesa e europeia**. 

A localização excelente, **praias de areia branca** e inúmeras atividades para toda a família tornam este lugar incomparável para um evento de natação em águas abertas.

## 📅 Datas do Evento

**18 e 19 de Julho de 2026**

Evento de 2 dias com várias provas e distâncias para todos os níveis de nadadores.

## 🏊 Características da Prova

### Local da Prova
- **Praia:** Praia da Ribeira, Cascais
- **Tipo de Água:** Águas abertas (oceano)
- **Baía:** Baía de Cascais (águas protegidas)
- **Qualidade:** Águas cristalinas e limpas

### Condições Típicas
- **Temperatura da Água:** 18-20°C (Julho)
- **Ondulação:** Moderada (baía protegida)
- **Visibilidade:** Excelente
- **Correntes:** Fracas a moderadas

## 🌊 Distâncias Disponíveis

O Swim Grand Prix tradicionalmente oferece várias distâncias para todos os níveis:

- **500m** - Iniciantes e jovens
- **1.000m** - Distância popular
- **1.500m** - Distância olímpica
- **3.000m** - Nadadores experientes
- **5.000m** - Elite e ultra-nadadores

*(Distâncias sujeitas a confirmação pelo organizador)*

## 🎯 Para Quem?

### Nadadores Iniciantes
- Provas curtas de 500m e 1000m
- Ambiente seguro e controlado
- Apoio de segurança completo

### Nadadores Experientes
- Desafio de distâncias longas (3km, 5km)
- Cronometragem eletrónica precisa
- Classificações competitivas

### Famílias
- Evento de fim de semana em Cascais
- Praias fantásticas para relaxar
- Inúmeras atividades turísticas

## 📋 Informações de Inscrição

### Prazo de Inscrição
**Até 15 de Julho de 2026 às 23:59**

### Fases de Preço
O evento oferece preços faseados - quanto mais cedo te inscreveres, melhor o preço!

### Plataforma de Inscrição
Inscrições através da plataforma **Lap2Go**: [lap2go.com](https://www.lap2go.com)

## 🏖️ Cascais - Destino Turístico

### História Rica
- Vila de pescadores com mais de 650 anos
- Local de veraneio da realeza portuguesa
- Arquitetura histórica preservada

### Praias Magníficas
- Praia da Ribeira (local da prova)
- Praia da Conceição
- Praia da Rainha
- Praia do Guincho

### Atividades para Famílias
- Passeios à beira-mar
- Marina de Cascais
- Centro histórico
- Gastronomia portuguesa
- Museus e galerias
- Surf e desportos náuticos

## 🎖️ Organização Profissional

### Organizador
**3 Iron Sports**  
Website: [swimgp.com](https://www.swimgp.com)

### Cronometragem
**Lap2Go** - Cronometragem eletrónica profissional  
- Resultados em direto
- Chip timing
- Classificações precisas

### Serviços Incluídos
- Cronometragem eletrónica
- Segurança aquática (nadadores salvadores, caiaques)
- Posto médico
- Vestiários e balneários
- Água e fruta no final
- Touca de natação oficial
- Medalha de participação

## 🏆 Categorias e Prémios

Categorias por escalão etário e género:
- Sub-18
- Seniores (várias faixas etárias)
- Veteranos

Prémios para os primeiros classificados de cada categoria.

## 🌡️ Segurança

- **Fatos de Neoprene:** Permitidos (recomendados para água abaixo de 18°C)
- **Segurança:** Equipa completa de nadadores salvadores
- **Apoio:** Caiaques e embarcações de segurança
- **Médico:** Posto médico no local

## 🚗 Como Chegar

### De Lisboa
- **Carro:** 30 minutos pela A5 ou Marginal (N6)
- **Comboio:** Linha de Cascais (35 minutos)
- **Autocarro:** Várias linhas diretas

### Estacionamento
Parques de estacionamento próximos da Praia da Ribeira

## 🏨 Alojamento

Cascais oferece inúmeras opções de alojamento:
- Hotéis 3-5 estrelas
- Alojamento local
- Apartamentos turísticos
- Hostels

Recomenda-se reserva antecipada para o fim de semana do evento.

## 📞 Contactos

**Website Oficial:** [swimgp.com](https://www.swimgp.com)  
**Organizador:** 3 Iron Sports  
**Cronometragem:** Lap2Go - [lap2go.com](https://www.lap2go.com)

---

**Junta-te a nós para uma experiência de natação inesquecível na belíssima baía de Cascais!** 🏊‍♂️🌊`,
      city: "Cascais",
      metaTitle: "Swim Grand Prix Cascais 2026 | Natação Águas Abertas",
      metaDescription:
        "Swim Grand Prix Cascais 2026: Natação em águas abertas na Praia da Ribeira. 18-19 Julho. Várias distâncias (500m-5km). Inscreve-te até 15 Julho!",
    },
    {
      language: "en",
      title: "Swim Grand Prix Cascais 2026",
      description: `# 🏊‍♂️ Swim Grand Prix Cascais 2026

Welcome to **Swim Grand Prix Cascais 2026**, one of Portugal's most iconic open water swimming events!

## 📍 Iconic Location

The races take place at **Praia da Ribeira**, in the heart of Cascais bay. A fishing village with over **650 years of history**, Cascais was a summer resort for **Portuguese and European royalty**.

The excellent location, **white sandy beaches**, and countless activities for the whole family make this place incomparable for an open water swimming event.

## 📅 Event Dates

**July 18-19, 2026**

2-day event with various races and distances for all levels of swimmers.

## 🏊 Race Features

### Race Location
- **Beach:** Praia da Ribeira, Cascais
- **Water Type:** Open water (ocean)
- **Bay:** Cascais Bay (protected waters)
- **Quality:** Crystal clear and clean waters

### Typical Conditions
- **Water Temperature:** 18-20°C (July)
- **Waves:** Moderate (protected bay)
- **Visibility:** Excellent
- **Currents:** Weak to moderate

## 🌊 Available Distances

Swim Grand Prix traditionally offers various distances for all levels:

- **500m** - Beginners and youth
- **1,000m** - Popular distance
- **1,500m** - Olympic distance
- **3,000m** - Experienced swimmers
- **5,000m** - Elite and ultra-swimmers

*(Distances subject to confirmation by organizer)*

## 📋 Registration Information

**Registration Deadline:** July 15, 2026 at 23:59

**Early Bird Pricing:** Multiple price phases available

**Platform:** Lap2Go - [lap2go.com](https://www.lap2go.com)

## 🏖️ Cascais - Tourist Destination

A 650-year-old fishing village with magnificent beaches, rich history, and countless activities for families.

## 📞 Contact

**Official Website:** [swimgp.com](https://www.swimgp.com)  
**Organizer:** 3 Iron Sports  
**Timing:** Lap2Go - [lap2go.com](https://www.lap2go.com)

Join us for an unforgettable swimming experience in the beautiful Cascais bay! 🏊‍♂️🌊`,
      city: "Cascais",
      metaTitle: "Swim Grand Prix Cascais 2026 | Open Water Swimming",
      metaDescription:
        "Swim Grand Prix Cascais 2026: Open water swimming at Praia da Ribeira. July 18-19. Multiple distances (500m-5km). Register by July 15!",
    },
    {
      language: "es",
      title: "Swim Grand Prix Cascais 2026",
      description: `# 🏊‍♂️ Swim Grand Prix Cascais 2026

Bienvenidos al **Swim Grand Prix Cascais 2026**, uno de los eventos de natación en aguas abiertas más emblemáticos de Portugal.

## 📍 Ubicación Icónica

Las pruebas se realizan en la **Praia da Ribeira**, en plena bahía de Cascais. Pueblo de pescadores con más de **650 años de historia**, Cascais fue lugar de veraneo de la **realeza portuguesa y europea**.

## 📅 Fechas del Evento

**18 y 19 de Julio de 2026**

Evento de 2 días con varias pruebas y distancias para todos los niveles.

## 🌊 Distancias Disponibles

- **500m** - Principiantes
- **1.000m** - Distancia popular
- **1.500m** - Distancia olímpica
- **3.000m** - Nadadores experimentados
- **5.000m** - Elite

## 📋 Inscripción

**Fecha límite:** 15 de Julio de 2026 a las 23:59

**Plataforma:** Lap2Go - [lap2go.com](https://www.lap2go.com)

## 📞 Contacto

**Web Oficial:** [swimgp.com](https://www.swimgp.com)  
**Organizador:** 3 Iron Sports

¡Únete a una experiencia de natación inolvidable en la hermosa bahía de Cascais! 🏊‍♂️🌊`,
      city: "Cascais",
      metaTitle: "Swim Grand Prix Cascais 2026 | Natación Aguas Abiertas",
      metaDescription:
        "Swim Grand Prix Cascais 2026: Natación en aguas abiertas en Praia da Ribeira. 18-19 julio. Múltiples distancias. ¡Inscríbete!",
    },
    {
      language: "fr",
      title: "Swim Grand Prix Cascais 2026",
      description: `# 🏊‍♂️ Swim Grand Prix Cascais 2026

Bienvenue au **Swim Grand Prix Cascais 2026**, l'un des événements de nage en eau libre les plus emblématiques du Portugal !

## 📍 Lieu Emblématique

Les épreuves se déroulent à **Praia da Ribeira**, au cœur de la baie de Cascais. Village de pêcheurs de plus de **650 ans d'histoire**, Cascais était un lieu de villégiature de la **royauté portugaise et européenne**.

## 📅 Dates de l'Événement

**18 et 19 Juillet 2026**

Événement de 2 jours avec plusieurs épreuves et distances pour tous les niveaux de nageurs.

## 🌊 Distances Disponibles

- **500m** - Débutants et jeunes
- **1 000m** - Distance populaire
- **1 500m** - Distance olympique
- **3 000m** - Nageurs expérimentés
- **5 000m** - Elite et ultra-nageurs

## 📋 Inscription

**Date limite :** 15 juillet 2026 à 23h59

**Plateforme :** Lap2Go - [lap2go.com](https://www.lap2go.com)

## 📞 Contact

**Site Officiel :** [swimgp.com](https://www.swimgp.com)  
**Organisateur :** 3 Iron Sports

Rejoignez-nous pour une expérience de natation inoubliable dans la magnifique baie de Cascais ! 🏊‍♂️🌊`,
      city: "Cascais",
      metaTitle: "Swim Grand Prix Cascais 2026 | Nage en Eau Libre",
      metaDescription:
        "Swim Grand Prix Cascais 2026 : Nage en eau libre à Praia da Ribeira. 18-19 juillet. Plusieurs distances. Inscrivez-vous !",
    },
    {
      language: "de",
      title: "Swim Grand Prix Cascais 2026",
      description: `# 🏊‍♂️ Swim Grand Prix Cascais 2026

Willkommen beim **Swim Grand Prix Cascais 2026**, einer der emblematischsten Freiwasser-Schwimmveranstaltungen Portugals!

## 📍 Ikonischer Ort

Die Rennen finden am **Praia da Ribeira** im Herzen der Bucht von Cascais statt. Ein Fischerdorf mit über **650 Jahren Geschichte**, Cascais war ein Sommerresort des **portugiesischen und europäischen Königshauses**.

## 📅 Veranstaltungsdaten

**18. und 19. Juli 2026**

2-tägige Veranstaltung mit verschiedenen Rennen und Distanzen für alle Schwimmniveaus.

## 🌊 Verfügbare Distanzen

- **500m** - Anfänger
- **1.000m** - Beliebte Distanz
- **1.500m** - Olympische Distanz
- **3.000m** - Erfahrene Schwimmer
- **5.000m** - Elite

## 📋 Anmeldung

**Anmeldeschluss:** 15. Juli 2026 um 23:59 Uhr

**Plattform:** Lap2Go - [lap2go.com](https://www.lap2go.com)

## 📞 Kontakt

**Offizielle Website:** [swimgp.com](https://www.swimgp.com)  
**Veranstalter:** 3 Iron Sports

Erleben Sie ein unvergessliches Schwimmerlebnis in der wunderschönen Bucht von Cascais! 🏊‍♂️🌊`,
      city: "Cascais",
      metaTitle: "Swim Grand Prix Cascais 2026 | Freiwasserschwimmen",
      metaDescription:
        "Swim Grand Prix Cascais 2026: Freiwasserschwimmen am Praia da Ribeira. 18-19 Juli. Mehrere Distanzen. Jetzt anmelden!",
    },
    {
      language: "it",
      title: "Swim Grand Prix Cascais 2026",
      description: `# 🏊‍♂️ Swim Grand Prix Cascais 2026

Benvenuti al **Swim Grand Prix Cascais 2026**, uno degli eventi di nuoto in acque libere più emblematici del Portogallo!

## 📍 Luogo Iconico

Le gare si svolgono a **Praia da Ribeira**, nel cuore della baia di Cascais. Villaggio di pescatori con oltre **650 anni di storia**, Cascais era un luogo di villeggiatura della **famiglia reale portoghese ed europea**.

## 📅 Date dell'Evento

**18 e 19 Luglio 2026**

Evento di 2 giorni con varie gare e distanze per tutti i livelli di nuotatori.

## 🌊 Distanze Disponibili

- **500m** - Principianti
- **1.000m** - Distanza popolare
- **1.500m** - Distanza olimpica
- **3.000m** - Nuotatori esperti
- **5.000m** - Elite

## 📋 Iscrizione

**Scadenza:** 15 luglio 2026 alle 23:59

**Piattaforma:** Lap2Go - [lap2go.com](https://www.lap2go.com)

## 📞 Contatto

**Sito Ufficiale:** [swimgp.com](https://www.swimgp.com)  
**Organizzatore:** 3 Iron Sports

Unisciti a noi per un'esperienza di nuoto indimenticabile nella splendida baia di Cascais! 🏊‍♂️🌊`,
      city: "Cascais",
      metaTitle: "Swim Grand Prix Cascais 2026 | Nuoto in Acque Libere",
      metaDescription:
        "Swim Grand Prix Cascais 2026: Nuoto in acque libere a Praia da Ribeira. 18-19 luglio. Diverse distanze. Iscriviti!",
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

  // Step 3: Create variants for different distances
  const variants = [
    {
      name: "500m - Iniciantes",
      distanceKm: 0.5,
      price: 0.0,
      startTime: "09:00",
    },
    {
      name: "1.000m - Popular",
      distanceKm: 1.0,
      price: 0.0,
      startTime: "10:00",
    },
    {
      name: "1.500m - Distância Olímpica",
      distanceKm: 1.5,
      price: 0.0,
      startTime: "11:00",
    },
    {
      name: "3.000m - Experientes",
      distanceKm: 3.0,
      price: 0.0,
      startTime: "12:00",
    },
    {
      name: "5.000m - Elite",
      distanceKm: 5.0,
      price: 0.0,
      startTime: "13:00",
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
      await prisma.eventVariant.update({
        where: { id: existing.id },
        data: {
          distanceKm: variantData.distanceKm,
          price: variantData.price,
          startTime: variantData.startTime,
        },
      });
      console.log(`✅ Variant updated: ${variantData.name}`);
    } else {
      await prisma.eventVariant.create({
        data: {
          eventId: event.id,
          name: variantData.name,
          distanceKm: variantData.distanceKm,
          price: variantData.price,
          startTime: variantData.startTime,
        },
      });
      console.log(`✅ Variant created: ${variantData.name}`);
    }
  }

  console.log("");
  console.log("🎉 Swim Grand Prix Cascais 2026 seeded successfully!");
  console.log("📍 Event location: Praia da Ribeira, Cascais, Portugal");
  console.log("📅 Dates: July 18-19, 2026");
  console.log("🏊 Distances: 500m, 1km, 1.5km, 3km, 5km");
  console.log("🏖️ Historic fishing village - Royal summer resort");
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
