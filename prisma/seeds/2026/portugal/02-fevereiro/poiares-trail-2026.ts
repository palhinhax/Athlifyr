/**
 * Seed Poiares Trail 2026
 * Complete with translations in all 6 languages
 * Trail running event in Vila Nova de Poiares, Portugal
 * NEW DATE: February 22, 2026 (rescheduled)
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Poiares Trail 2026...");

  const languages: Language[] = ["pt", "en", "es", "fr", "de", "it"];

  // Step 1: Upsert the event
  const event = await prisma.event.upsert({
    where: { slug: "poiares-trail-2026" },
    update: {
      title: "Poiares Trail 2026",
      description: `## 🏔️ Poiares Trail 2026

**Desafia a tua natureza!**

O Poiares Trail 2026 é um evento organizado pela secção de Atletismo da Associação Recreativa de S. Miguel – Vila Nova de Poiares, que integra quatro provas competitivas e uma caminhada.

### 🏃 As Provas

**PT35K Maxivisão** - Trail Longo
- Distância: ±35 km
- Desnível positivo: 1400m
- Tempo limite: 8 horas
- Idade mínima: 20 anos
- Certificado ATRP

**PT22K Decathlon** - Trail Curto
- Distância: ±22 km
- Desnível positivo: 1170m
- Tempo limite: 6 horas
- Idade mínima: 18 anos (Sub20)
- Certificado ATRP

**PT13K Fresbeira** - Mini Trail
- Distância: ±13 km
- Desnível positivo: 400m
- Tempo limite: 4 horas
- Idade mínima: 16 anos
- Certificado ATRP

**Estafetas 35K Ansell Portugal**
- Distância: 35 km (dividido em 3 etapas)
- Equipas de 3 elementos
- Tempo limite: 8 horas

**Caminhada 13K Farmácia Santo André**
- Distância: ±13 km
- Percurso coincidente com o PT13K

### 🎒 Material Obrigatório

**PT35K e Estafetas:**
- Dorsal visível
- Manta térmica
- Apito
- Telemóvel operacional

**PT22K:**
- Dorsal visível
- Manta térmica
- Apito
- Telemóvel operacional

**PT13K:**
- Dorsal visível
- Telemóvel operacional

### 📍 Abastecimentos

- **PT35K/Estafetas:** 3 postos (Piscinas da Fraga 10km, Venda Nova 20km, Ribeira de Poiares 26.5km)
- **PT22K:** 2 postos (Piscinas da Fraga 6km, Venda Nova 16km)
- **PT13K/Caminhada:** 1 posto (Ervideira 9km)
- Abastecimento final na arena (Mercado Municipal)

⚠️ **Regime de semi-autossuficiência** - não serão distribuídas garrafas ou copos

### 🎁 A Inscrição Inclui

- Dorsal com chip
- Seguro de responsabilidade civil e acidentes pessoais
- Abastecimentos durante a prova
- Transfer para a partida (PT35K e Estafetas)
- Toalha de banho (brinde)
- Prémio finisher
- Banhos no final
- Refeição quente no final

### 🏆 Prémios

- Troféu para os 3 primeiros M/F geral e por escalão (PT35K e PT22K)
- Pódio alargado até 6º classificado (PT13K)
- Classificação por equipas

### ⏱️ Barreira Horária

**PT35K/Estafetas:** Abastecimento Ribeira (26.5km) - 15h45 (6h45 de prova)

### 📅 Programa

**Sábado, 21/02/2026:**
- 18h30 - Abertura do secretariado
- 20h30 - Encerramento do secretariado

**Domingo, 22/02/2026:**
- 07h30 - Abertura do secretariado
- 09h00 - Partida PT35K e Estafetas
- 09h30 - Partida PT22K
- 10h00 - Partida PT13K e Caminhada
- 12h30 - Início do almoço
- 14h00-15h00 - Entrega de prémios
- 17h30 - Encerramento do evento`,
      startDate: new Date("2026-02-22T09:00:00.000Z"),
      endDate: new Date("2026-02-22T17:30:00.000Z"),
      city: "Vila Nova de Poiares",
      country: "Portugal",
      latitude: 40.213056,
      longitude: -8.258423,
      imageUrl:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=630&fit=crop",
      externalUrl: "https://www.stopandgo.pt",
      googleMapsUrl: "https://maps.app.goo.gl/PoiaresTrail",
      isFeatured: false,
      sportTypes: [SportType.TRAIL, SportType.WALKING],
      registrationDeadline: new Date("2026-02-15T23:59:59.000Z"),
    },
    create: {
      slug: "poiares-trail-2026",
      title: "Poiares Trail 2026",
      description: `## 🏔️ Poiares Trail 2026

**Desafia a tua natureza!**

O Poiares Trail 2026 é um evento organizado pela secção de Atletismo da Associação Recreativa de S. Miguel – Vila Nova de Poiares, que integra quatro provas competitivas e uma caminhada.

### 🏃 As Provas

**PT35K Maxivisão** - Trail Longo
- Distância: ±35 km
- Desnível positivo: 1400m
- Tempo limite: 8 horas
- Idade mínima: 20 anos
- Certificado ATRP

**PT22K Decathlon** - Trail Curto
- Distância: ±22 km
- Desnível positivo: 1170m
- Tempo limite: 6 horas
- Idade mínima: 18 anos (Sub20)
- Certificado ATRP

**PT13K Fresbeira** - Mini Trail
- Distância: ±13 km
- Desnível positivo: 400m
- Tempo limite: 4 horas
- Idade mínima: 16 anos
- Certificado ATRP

**Estafetas 35K Ansell Portugal**
- Distância: 35 km (dividido em 3 etapas)
- Equipas de 3 elementos
- Tempo limite: 8 horas

**Caminhada 13K Farmácia Santo André**
- Distância: ±13 km
- Percurso coincidente com o PT13K

### 🎒 Material Obrigatório

**PT35K e Estafetas:**
- Dorsal visível
- Manta térmica
- Apito
- Telemóvel operacional

**PT22K:**
- Dorsal visível
- Manta térmica
- Apito
- Telemóvel operacional

**PT13K:**
- Dorsal visível
- Telemóvel operacional

### 📍 Abastecimentos

- **PT35K/Estafetas:** 3 postos (Piscinas da Fraga 10km, Venda Nova 20km, Ribeira de Poiares 26.5km)
- **PT22K:** 2 postos (Piscinas da Fraga 6km, Venda Nova 16km)
- **PT13K/Caminhada:** 1 posto (Ervideira 9km)
- Abastecimento final na arena (Mercado Municipal)

⚠️ **Regime de semi-autossuficiência** - não serão distribuídas garrafas ou copos

### 🎁 A Inscrição Inclui

- Dorsal com chip
- Seguro de responsabilidade civil e acidentes pessoais
- Abastecimentos durante a prova
- Transfer para a partida (PT35K e Estafetas)
- Toalha de banho (brinde)
- Prémio finisher
- Banhos no final
- Refeição quente no final

### 🏆 Prémios

- Troféu para os 3 primeiros M/F geral e por escalão (PT35K e PT22K)
- Pódio alargado até 6º classificado (PT13K)
- Classificação por equipas

### ⏱️ Barreira Horária

**PT35K/Estafetas:** Abastecimento Ribeira (26.5km) - 15h45 (6h45 de prova)

### 📅 Programa

**Sábado, 21/02/2026:**
- 18h30 - Abertura do secretariado
- 20h30 - Encerramento do secretariado

**Domingo, 22/02/2026:**
- 07h30 - Abertura do secretariado
- 09h00 - Partida PT35K e Estafetas
- 09h30 - Partida PT22K
- 10h00 - Partida PT13K e Caminhada
- 12h30 - Início do almoço
- 14h00-15h00 - Entrega de prémios
- 17h30 - Encerramento do evento`,
      startDate: new Date("2026-02-22T09:00:00.000Z"),
      endDate: new Date("2026-02-22T17:30:00.000Z"),
      city: "Vila Nova de Poiares",
      country: "Portugal",
      latitude: 40.213056,
      longitude: -8.258423,
      imageUrl:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=630&fit=crop",
      externalUrl: "https://www.stopandgo.pt",
      googleMapsUrl: "https://maps.app.goo.gl/PoiaresTrail",
      isFeatured: false,
      sportTypes: [SportType.TRAIL, SportType.WALKING],
      registrationDeadline: new Date("2026-02-15T23:59:59.000Z"),
    },
  });

  console.log(`✅ Created event: ${event.title}`);

  // Step 2: Create translations for all 6 languages
  const translations: Record<
    string,
    {
      title: string;
      description: string;
      city: string;
      metaTitle: string;
      metaDescription: string;
    }
  > = {
    pt: {
      title: "Poiares Trail 2026",
      description: `## 🏔️ Poiares Trail 2026

**Desafia a tua natureza!**

O Poiares Trail 2026 é um evento organizado pela secção de Atletismo da Associação Recreativa de S. Miguel – Vila Nova de Poiares, que integra quatro provas competitivas e uma caminhada. Todas as provas estão certificadas pela ATRP.

### 🏃 As Provas

**PT35K Maxivisão** - Trail Longo (±35km, D+1400m, 8h limite, 20+ anos)
**PT22K Decathlon** - Trail Curto (±22km, D+1170m, 6h limite, 18+ anos)
**PT13K Fresbeira** - Mini Trail (±13km, D+400m, 4h limite, 16+ anos)
**Estafetas 35K** - Equipas de 3 elementos (35km dividido em 3 etapas)
**Caminhada 13K** - Percurso coincidente com o PT13K

### 🎁 A Inscrição Inclui

Dorsal com chip, seguro, abastecimentos, transfer (PT35K/Estafetas), toalha de banho, prémio finisher, banhos e refeição quente.`,
      city: "Vila Nova de Poiares",
      metaTitle: "Poiares Trail 2026 | Vila Nova de Poiares | 22 Fevereiro",
      metaDescription:
        "Poiares Trail 2026 a 22 de fevereiro em Vila Nova de Poiares. Provas: PT35K (D+1400m), PT22K (D+1170m), PT13K (D+400m), Estafetas e Caminhada. Certificado ATRP.",
    },
    en: {
      title: "Poiares Trail 2026",
      description: `## 🏔️ Poiares Trail 2026

**Challenge your nature!**

Poiares Trail 2026 is an event organized by the Athletics section of Associação Recreativa de S. Miguel – Vila Nova de Poiares, featuring four competitive races and a hike. All races are ATRP certified.

### 🏃 The Races

**PT35K Maxivisão** - Long Trail (±35km, 1400m D+, 8h limit, 20+ years)
**PT22K Decathlon** - Short Trail (±22km, 1170m D+, 6h limit, 18+ years)
**PT13K Fresbeira** - Mini Trail (±13km, 400m D+, 4h limit, 16+ years)
**Relay 35K** - Teams of 3 (35km divided in 3 stages)
**Hike 13K** - Same course as PT13K

### 🎁 Registration Includes

Bib with chip, insurance, refreshments, transfer (PT35K/Relay), bath towel, finisher prize, showers and hot meal.`,
      city: "Vila Nova de Poiares",
      metaTitle:
        "Poiares Trail 2026 | Vila Nova de Poiares, Portugal | February 22",
      metaDescription:
        "Poiares Trail 2026 on February 22 in Vila Nova de Poiares. Races: PT35K (1400m D+), PT22K (1170m D+), PT13K (400m D+), Relay and Hike. ATRP certified.",
    },
    es: {
      title: "Poiares Trail 2026",
      description: `## 🏔️ Poiares Trail 2026

**¡Desafía tu naturaleza!**

Poiares Trail 2026 es un evento organizado por la sección de Atletismo de la Associação Recreativa de S. Miguel – Vila Nova de Poiares, con cuatro carreras competitivas y una caminata. Todas certificadas por ATRP.

### 🏃 Las Pruebas

**PT35K Maxivisão** - Trail Largo (±35km, D+1400m, 8h límite, 20+ años)
**PT22K Decathlon** - Trail Corto (±22km, D+1170m, 6h límite, 18+ años)
**PT13K Fresbeira** - Mini Trail (±13km, D+400m, 4h límite, 16+ años)
**Relevos 35K** - Equipos de 3 (35km en 3 etapas)
**Senderismo 13K** - Mismo recorrido que PT13K

### 🎁 La Inscripción Incluye

Dorsal con chip, seguro, avituallamientos, transfer (PT35K/Relevos), toalla, premio finisher, duchas y comida caliente.`,
      city: "Vila Nova de Poiares",
      metaTitle:
        "Poiares Trail 2026 | Vila Nova de Poiares, Portugal | 22 Febrero",
      metaDescription:
        "Poiares Trail 2026 el 22 de febrero en Vila Nova de Poiares. Pruebas: PT35K (D+1400m), PT22K (D+1170m), PT13K (D+400m), Relevos y Senderismo. Certificado ATRP.",
    },
    fr: {
      title: "Poiares Trail 2026",
      description: `## 🏔️ Poiares Trail 2026

**Défie ta nature !**

Poiares Trail 2026 est un événement organisé par la section Athlétisme de l'Associação Recreativa de S. Miguel – Vila Nova de Poiares, avec quatre courses compétitives et une randonnée. Toutes certifiées ATRP.

### 🏃 Les Épreuves

**PT35K Maxivisão** - Trail Long (±35km, D+1400m, 8h limite, 20+ ans)
**PT22K Decathlon** - Trail Court (±22km, D+1170m, 6h limite, 18+ ans)
**PT13K Fresbeira** - Mini Trail (±13km, D+400m, 4h limite, 16+ ans)
**Relais 35K** - Équipes de 3 (35km en 3 étapes)
**Randonnée 13K** - Même parcours que PT13K

### 🎁 L'Inscription Comprend

Dossard avec puce, assurance, ravitaillements, transfert (PT35K/Relais), serviette, prix finisher, douches et repas chaud.`,
      city: "Vila Nova de Poiares",
      metaTitle:
        "Poiares Trail 2026 | Vila Nova de Poiares, Portugal | 22 Février",
      metaDescription:
        "Poiares Trail 2026 le 22 février à Vila Nova de Poiares. Épreuves : PT35K (D+1400m), PT22K (D+1170m), PT13K (D+400m), Relais et Randonnée. Certifié ATRP.",
    },
    de: {
      title: "Poiares Trail 2026",
      description: `## 🏔️ Poiares Trail 2026

**Fordere deine Natur heraus!**

Poiares Trail 2026 ist eine Veranstaltung der Leichtathletik-Abteilung der Associação Recreativa de S. Miguel – Vila Nova de Poiares, mit vier Wettkampfrennen und einer Wanderung. Alle ATRP-zertifiziert.

### 🏃 Die Rennen

**PT35K Maxivisão** - Langer Trail (±35km, 1400m D+, 8h Limit, 20+ Jahre)
**PT22K Decathlon** - Kurzer Trail (±22km, 1170m D+, 6h Limit, 18+ Jahre)
**PT13K Fresbeira** - Mini Trail (±13km, 400m D+, 4h Limit, 16+ Jahre)
**Staffel 35K** - 3er-Teams (35km in 3 Etappen)
**Wanderung 13K** - Gleiche Strecke wie PT13K

### 🎁 Anmeldung Beinhaltet

Startnummer mit Chip, Versicherung, Verpflegung, Transfer (PT35K/Staffel), Handtuch, Finisher-Preis, Duschen und warme Mahlzeit.`,
      city: "Vila Nova de Poiares",
      metaTitle:
        "Poiares Trail 2026 | Vila Nova de Poiares, Portugal | 22. Februar",
      metaDescription:
        "Poiares Trail 2026 am 22. Februar in Vila Nova de Poiares. Rennen: PT35K (1400m D+), PT22K (1170m D+), PT13K (400m D+), Staffel und Wanderung. ATRP-zertifiziert.",
    },
    it: {
      title: "Poiares Trail 2026",
      description: `## 🏔️ Poiares Trail 2026

**Sfida la tua natura!**

Poiares Trail 2026 è un evento organizzato dalla sezione Atletica dell'Associação Recreativa de S. Miguel – Vila Nova de Poiares, con quattro gare competitive e una camminata. Tutte certificate ATRP.

### 🏃 Le Gare

**PT35K Maxivisão** - Trail Lungo (±35km, D+1400m, 8h limite, 20+ anni)
**PT22K Decathlon** - Trail Corto (±22km, D+1170m, 6h limite, 18+ anni)
**PT13K Fresbeira** - Mini Trail (±13km, D+400m, 4h limite, 16+ anni)
**Staffetta 35K** - Squadre di 3 (35km in 3 tappe)
**Camminata 13K** - Stesso percorso del PT13K

### 🎁 L'Iscrizione Include

Pettorale con chip, assicurazione, ristori, transfer (PT35K/Staffetta), asciugamano, premio finisher, docce e pasto caldo.`,
      city: "Vila Nova de Poiares",
      metaTitle:
        "Poiares Trail 2026 | Vila Nova de Poiares, Portogallo | 22 Febbraio",
      metaDescription:
        "Poiares Trail 2026 il 22 febbraio a Vila Nova de Poiares. Gare: PT35K (D+1400m), PT22K (D+1170m), PT13K (D+400m), Staffetta e Camminata. Certificato ATRP.",
    },
  };

  // Upsert translations for all languages
  for (const lang of Object.keys(translations)) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: lang as Language,
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
        language: lang as Language,
        title: translations[lang].title,
        description: translations[lang].description,
        city: translations[lang].city,
        metaTitle: translations[lang].metaTitle,
        metaDescription: translations[lang].metaDescription,
      },
    });
  }

  console.log("✅ Created translations for all 6 languages");

  // Step 3: Delete existing variants and pricing phases for this event
  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

  await prisma.eventVariantTranslation.deleteMany({
    where: { variant: { eventId: event.id } },
  });

  await prisma.eventVariant.deleteMany({
    where: { eventId: event.id },
  });

  // Step 4: Create variants
  console.log("💰 Creating variants...");

  const pt35k = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "PT35K Maxivisão",
      distanceKm: 35,
      elevationGainM: 1400,
      elevationLossM: 1400,
      startTime: "09:00",
      cutoffTimeHours: 8.0,
      maxParticipants: 240,
    },
  });

  const pt22k = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "PT22K Decathlon",
      distanceKm: 22,
      elevationGainM: 1170,
      elevationLossM: 1170,
      startTime: "09:30",
      cutoffTimeHours: 6.0,
      maxParticipants: 450,
    },
  });

  const pt13k = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "PT13K Fresbeira",
      distanceKm: 13,
      elevationGainM: 400,
      elevationLossM: 400,
      startTime: "10:00",
      cutoffTimeHours: 4.0,
      maxParticipants: 400,
    },
  });

  const estafetas = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Estafetas 35K Ansell Portugal",
      distanceKm: 35,
      elevationGainM: 1400,
      elevationLossM: 1400,
      startTime: "09:00",
      cutoffTimeHours: 8.0,
      maxParticipants: 60,
    },
  });

  const caminhada = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Caminhada 13K Farmácia Santo André",
      distanceKm: 13,
      elevationGainM: 400,
      elevationLossM: 400,
      startTime: "10:00",
      cutoffTimeHours: 4.0,
      maxParticipants: 150,
    },
  });

  const variants = [pt35k, pt22k, pt13k, estafetas, caminhada];

  console.log("🏃 Variants created (5 variants)");

  // Step 5: Upsert variant translations
  const variantTranslations: Record<
    string,
    Record<string, { name: string; description: string }>
  > = {
    "PT35K Maxivisão": {
      pt: {
        name: "PT35K Maxivisão",
        description:
          "Trail longo de 35km com D+1400m. Tempo limite 8h. Idade mínima 20 anos. Certificado ATRP.",
      },
      en: {
        name: "PT35K Maxivisão",
        description:
          "Long trail of 35km with 1400m D+. 8h time limit. Minimum age 20. ATRP certified.",
      },
      es: {
        name: "PT35K Maxivisão",
        description:
          "Trail largo de 35km con D+1400m. Límite 8h. Edad mínima 20 años. Certificado ATRP.",
      },
      fr: {
        name: "PT35K Maxivisão",
        description:
          "Trail long de 35km avec D+1400m. Limite 8h. Âge minimum 20 ans. Certifié ATRP.",
      },
      de: {
        name: "PT35K Maxivisão",
        description:
          "Langer Trail von 35km mit 1400m D+. 8h Zeitlimit. Mindestalter 20. ATRP-zertifiziert.",
      },
      it: {
        name: "PT35K Maxivisão",
        description:
          "Trail lungo di 35km con D+1400m. Limite 8h. Età minima 20 anni. Certificato ATRP.",
      },
    },
    "PT22K Decathlon": {
      pt: {
        name: "PT22K Decathlon",
        description:
          "Trail curto de 22km com D+1170m. Tempo limite 6h. Idade mínima 18 anos (Sub20). Certificado ATRP.",
      },
      en: {
        name: "PT22K Decathlon",
        description:
          "Short trail of 22km with 1170m D+. 6h time limit. Minimum age 18 (Sub20). ATRP certified.",
      },
      es: {
        name: "PT22K Decathlon",
        description:
          "Trail corto de 22km con D+1170m. Límite 6h. Edad mínima 18 años (Sub20). Certificado ATRP.",
      },
      fr: {
        name: "PT22K Decathlon",
        description:
          "Trail court de 22km avec D+1170m. Limite 6h. Âge minimum 18 ans (Sub20). Certifié ATRP.",
      },
      de: {
        name: "PT22K Decathlon",
        description:
          "Kurzer Trail von 22km mit 1170m D+. 6h Zeitlimit. Mindestalter 18 (Sub20). ATRP-zertifiziert.",
      },
      it: {
        name: "PT22K Decathlon",
        description:
          "Trail corto di 22km con D+1170m. Limite 6h. Età minima 18 anni (Sub20). Certificato ATRP.",
      },
    },
    "PT13K Fresbeira": {
      pt: {
        name: "PT13K Fresbeira",
        description:
          "Mini trail de 13km com D+400m. Tempo limite 4h. Idade mínima 16 anos. Certificado ATRP.",
      },
      en: {
        name: "PT13K Fresbeira",
        description:
          "Mini trail of 13km with 400m D+. 4h time limit. Minimum age 16. ATRP certified.",
      },
      es: {
        name: "PT13K Fresbeira",
        description:
          "Mini trail de 13km con D+400m. Límite 4h. Edad mínima 16 años. Certificado ATRP.",
      },
      fr: {
        name: "PT13K Fresbeira",
        description:
          "Mini trail de 13km avec D+400m. Limite 4h. Âge minimum 16 ans. Certifié ATRP.",
      },
      de: {
        name: "PT13K Fresbeira",
        description:
          "Mini Trail von 13km mit 400m D+. 4h Zeitlimit. Mindestalter 16. ATRP-zertifiziert.",
      },
      it: {
        name: "PT13K Fresbeira",
        description:
          "Mini trail di 13km con D+400m. Limite 4h. Età minima 16 anni. Certificato ATRP.",
      },
    },
    "Estafetas 35K Ansell Portugal": {
      pt: {
        name: "Estafetas 35K Ansell Portugal",
        description:
          "Prova de estafetas para equipas de 3 elementos. 35km divididos em 3 etapas. Tempo limite 8h.",
      },
      en: {
        name: "Relay 35K Ansell Portugal",
        description:
          "Relay race for teams of 3. 35km divided in 3 stages. 8h time limit.",
      },
      es: {
        name: "Relevos 35K Ansell Portugal",
        description:
          "Carrera de relevos para equipos de 3. 35km divididos en 3 etapas. Límite 8h.",
      },
      fr: {
        name: "Relais 35K Ansell Portugal",
        description:
          "Course de relais pour équipes de 3. 35km divisés en 3 étapes. Limite 8h.",
      },
      de: {
        name: "Staffel 35K Ansell Portugal",
        description:
          "Staffelrennen für 3er-Teams. 35km in 3 Etappen. 8h Zeitlimit.",
      },
      it: {
        name: "Staffetta 35K Ansell Portugal",
        description:
          "Gara a staffetta per squadre di 3. 35km divisi in 3 tappe. Limite 8h.",
      },
    },
    "Caminhada 13K Farmácia Santo André": {
      pt: {
        name: "Caminhada 13K Farmácia Santo André",
        description:
          "Caminhada de 13km com D+400m. Tempo limite 4h. Percurso coincidente com o PT13K.",
      },
      en: {
        name: "Hike 13K Farmácia Santo André",
        description:
          "13km hike with 400m D+. 4h time limit. Same course as PT13K.",
      },
      es: {
        name: "Senderismo 13K Farmácia Santo André",
        description:
          "Senderismo de 13km con D+400m. Límite 4h. Mismo recorrido que PT13K.",
      },
      fr: {
        name: "Randonnée 13K Farmácia Santo André",
        description:
          "Randonnée de 13km avec D+400m. Limite 4h. Même parcours que PT13K.",
      },
      de: {
        name: "Wanderung 13K Farmácia Santo André",
        description:
          "13km Wanderung mit 400m D+. 4h Zeitlimit. Gleiche Strecke wie PT13K.",
      },
      it: {
        name: "Camminata 13K Farmácia Santo André",
        description:
          "Camminata di 13km con D+400m. Limite 4h. Stesso percorso del PT13K.",
      },
    },
  };

  for (const variant of variants) {
    for (const lang of languages) {
      await prisma.eventVariantTranslation.upsert({
        where: {
          variantId_language: {
            variantId: variant.id,
            language: lang,
          },
        },
        update: {
          name: variantTranslations[variant.name][lang].name,
          description: variantTranslations[variant.name][lang].description,
        },
        create: {
          variantId: variant.id,
          language: lang,
          name: variantTranslations[variant.name][lang].name,
          description: variantTranslations[variant.name][lang].description,
        },
      });
    }
  }

  console.log("📝 Variant translations upserted for all 5 variants");

  // Step 6: Create pricing phases (using eventId pattern)
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

  // PT35K - 1ª Fase
  await findOrCreatePricingPhase("PT35K Maxivisão - 1ª Fase", {
    startDate: new Date("2025-10-11T00:00:00Z"),
    endDate: new Date("2025-12-31T23:59:59Z"),
    price: 23.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Inscrição antecipada. ADAC: 21,50€",
  });

  // PT35K - 2ª Fase
  await findOrCreatePricingPhase("PT35K Maxivisão - 2ª Fase", {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-02-15T23:59:59Z"),
    price: 26.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Inscrição normal. ADAC: 24,50€",
  });

  // PT22K - 1ª Fase
  await findOrCreatePricingPhase("PT22K Decathlon - 1ª Fase", {
    startDate: new Date("2025-10-11T00:00:00Z"),
    endDate: new Date("2025-12-31T23:59:59Z"),
    price: 18.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Inscrição antecipada.",
  });

  // PT22K - 2ª Fase
  await findOrCreatePricingPhase("PT22K Decathlon - 2ª Fase", {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-02-15T23:59:59Z"),
    price: 21.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Inscrição normal.",
  });

  // PT13K - 1ª Fase
  await findOrCreatePricingPhase("PT13K Fresbeira - 1ª Fase", {
    startDate: new Date("2025-10-11T00:00:00Z"),
    endDate: new Date("2025-12-31T23:59:59Z"),
    price: 13.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Inscrição antecipada.",
  });

  // PT13K - 2ª Fase
  await findOrCreatePricingPhase("PT13K Fresbeira - 2ª Fase", {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-02-15T23:59:59Z"),
    price: 16.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Inscrição normal.",
  });

  // Estafetas - 1ª Fase (por pessoa)
  await findOrCreatePricingPhase("Estafetas 35K - 1ª Fase", {
    startDate: new Date("2025-10-11T00:00:00Z"),
    endDate: new Date("2025-12-31T23:59:59Z"),
    price: 13.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Preço por pessoa. Equipa de 3 elementos.",
  });

  // Estafetas - 2ª Fase (por pessoa)
  await findOrCreatePricingPhase("Estafetas 35K - 2ª Fase", {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-02-15T23:59:59Z"),
    price: 16.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Preço por pessoa. Equipa de 3 elementos.",
  });

  // Caminhada - 1ª Fase
  await findOrCreatePricingPhase("Caminhada 13K - 1ª Fase", {
    startDate: new Date("2025-10-11T00:00:00Z"),
    endDate: new Date("2025-12-31T23:59:59Z"),
    price: 13.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Inscrição antecipada.",
  });

  // Caminhada - 2ª Fase
  await findOrCreatePricingPhase("Caminhada 13K - 2ª Fase", {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-02-15T23:59:59Z"),
    price: 16.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Inscrição normal.",
  });

  console.log("💰 Pricing phases created (10 phases for 5 variants)");

  // Step 7: Create FAQs
  console.log("❓ Creating FAQs...");

  // Delete existing FAQs for this event
  await prisma.eventFAQTranslation.deleteMany({
    where: { faq: { eventId: event.id } },
  });
  await prisma.eventFAQ.deleteMany({
    where: { eventId: event.id },
  });

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

  // FAQ 1: Qual a idade mínima?
  const faq1 = await findOrCreateFAQ(
    event.id,
    0,
    "Qual a idade mínima para participar?",
    "PT35K: 20 anos. PT22K: 18 anos (escalão Sub20). PT13K e Estafetas: 16 anos. Menores de 18 anos precisam de autorização dos pais. A idade é calculada a 30 de setembro de 2026."
  );

  const faq1Translations = {
    pt: {
      question: "Qual a idade mínima para participar?",
      answer:
        "PT35K: 20 anos. PT22K: 18 anos (escalão Sub20). PT13K e Estafetas: 16 anos. Menores de 18 anos precisam de autorização dos pais. A idade é calculada a 30 de setembro de 2026.",
    },
    en: {
      question: "What is the minimum age to participate?",
      answer:
        "PT35K: 20 years. PT22K: 18 years (Sub20 category). PT13K and Relay: 16 years. Under 18 need parental authorization. Age calculated as of September 30, 2026.",
    },
    es: {
      question: "¿Cuál es la edad mínima para participar?",
      answer:
        "PT35K: 20 años. PT22K: 18 años (categoría Sub20). PT13K y Relevos: 16 años. Menores de 18 necesitan autorización parental. Edad calculada a 30 de septiembre de 2026.",
    },
    fr: {
      question: "Quel est l'âge minimum pour participer ?",
      answer:
        "PT35K : 20 ans. PT22K : 18 ans (catégorie Sub20). PT13K et Relais : 16 ans. Les moins de 18 ans ont besoin d'une autorisation parentale. Âge calculé au 30 septembre 2026.",
    },
    de: {
      question: "Was ist das Mindestalter für die Teilnahme?",
      answer:
        "PT35K: 20 Jahre. PT22K: 18 Jahre (Sub20-Kategorie). PT13K und Staffel: 16 Jahre. Unter 18 benötigen Elternerlaubnis. Alter berechnet zum 30. September 2026.",
    },
    it: {
      question: "Qual è l'età minima per partecipare?",
      answer:
        "PT35K: 20 anni. PT22K: 18 anni (categoria Sub20). PT13K e Staffetta: 16 anni. Under 18 necessitano autorizzazione genitoriale. Età calcolata al 30 settembre 2026.",
    },
  };

  for (const lang of languages) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq1.id, language: lang } },
      update: faq1Translations[lang],
      create: { faqId: faq1.id, language: lang, ...faq1Translations[lang] },
    });
  }

  // FAQ 2: O que está incluído?
  const faq2 = await findOrCreateFAQ(
    event.id,
    1,
    "O que está incluído na inscrição?",
    "Dorsal com chip, seguro de responsabilidade civil e acidentes pessoais, abastecimentos, transfer para a partida (PT35K e Estafetas), toalha de banho, prémio finisher, banhos e refeição quente no final."
  );

  const faq2Translations = {
    pt: {
      question: "O que está incluído na inscrição?",
      answer:
        "Dorsal com chip, seguro de responsabilidade civil e acidentes pessoais, abastecimentos, transfer para a partida (PT35K e Estafetas), toalha de banho, prémio finisher, banhos e refeição quente no final.",
    },
    en: {
      question: "What is included in the registration?",
      answer:
        "Bib with chip, liability and accident insurance, refreshments, transfer to start (PT35K and Relay), bath towel, finisher prize, showers and hot meal at the end.",
    },
    es: {
      question: "¿Qué incluye la inscripción?",
      answer:
        "Dorsal con chip, seguro de responsabilidad civil y accidentes, avituallamientos, transfer a la salida (PT35K y Relevos), toalla de baño, premio finisher, duchas y comida caliente al final.",
    },
    fr: {
      question: "Qu'est-ce qui est inclus dans l'inscription ?",
      answer:
        "Dossard avec puce, assurance responsabilité civile et accidents, ravitaillements, transfert au départ (PT35K et Relais), serviette de bain, prix finisher, douches et repas chaud à la fin.",
    },
    de: {
      question: "Was ist in der Anmeldung enthalten?",
      answer:
        "Startnummer mit Chip, Haftpflicht- und Unfallversicherung, Verpflegung, Transfer zum Start (PT35K und Staffel), Badetuch, Finisher-Preis, Duschen und warme Mahlzeit am Ende.",
    },
    it: {
      question: "Cosa è incluso nell'iscrizione?",
      answer:
        "Pettorale con chip, assicurazione responsabilità civile e infortuni, ristori, transfer alla partenza (PT35K e Staffetta), asciugamano, premio finisher, docce e pasto caldo alla fine.",
    },
  };

  for (const lang of languages) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq2.id, language: lang } },
      update: faq2Translations[lang],
      create: { faqId: faq2.id, language: lang, ...faq2Translations[lang] },
    });
  }

  // FAQ 3: Qual o material obrigatório?
  const faq3 = await findOrCreateFAQ(
    event.id,
    2,
    "Qual o material obrigatório?",
    "PT35K/PT22K/Estafetas: Dorsal visível, manta térmica, apito e telemóvel operacional. PT13K: Dorsal visível e telemóvel operacional. Recomendado: depósito de água (mín. 0,5L para PT35K/PT22K, 0,375L para PT13K) e alimentação de reserva."
  );

  const faq3Translations = {
    pt: {
      question: "Qual o material obrigatório?",
      answer:
        "PT35K/PT22K/Estafetas: Dorsal visível, manta térmica, apito e telemóvel operacional. PT13K: Dorsal visível e telemóvel operacional. Recomendado: depósito de água (mín. 0,5L para PT35K/PT22K, 0,375L para PT13K) e alimentação de reserva.",
    },
    en: {
      question: "What is the mandatory equipment?",
      answer:
        "PT35K/PT22K/Relay: Visible bib, emergency blanket, whistle and working mobile phone. PT13K: Visible bib and working mobile phone. Recommended: water container (min. 0.5L for PT35K/PT22K, 0.375L for PT13K) and reserve food.",
    },
    es: {
      question: "¿Cuál es el material obligatorio?",
      answer:
        "PT35K/PT22K/Relevos: Dorsal visible, manta térmica, silbato y teléfono móvil operativo. PT13K: Dorsal visible y teléfono móvil operativo. Recomendado: depósito de agua (mín. 0,5L para PT35K/PT22K, 0,375L para PT13K) y alimentación de reserva.",
    },
    fr: {
      question: "Quel est le matériel obligatoire ?",
      answer:
        "PT35K/PT22K/Relais : Dossard visible, couverture de survie, sifflet et téléphone portable opérationnel. PT13K : Dossard visible et téléphone portable opérationnel. Recommandé : réservoir d'eau (min. 0,5L pour PT35K/PT22K, 0,375L pour PT13K) et nourriture de réserve.",
    },
    de: {
      question: "Was ist die Pflichtausrüstung?",
      answer:
        "PT35K/PT22K/Staffel: Sichtbare Startnummer, Rettungsdecke, Pfeife und funktionsfähiges Handy. PT13K: Sichtbare Startnummer und funktionsfähiges Handy. Empfohlen: Wasserbehälter (min. 0,5L für PT35K/PT22K, 0,375L für PT13K) und Reservenahrung.",
    },
    it: {
      question: "Qual è il materiale obbligatorio?",
      answer:
        "PT35K/PT22K/Staffetta: Pettorale visibile, coperta termica, fischietto e telefono cellulare funzionante. PT13K: Pettorale visibile e telefono cellulare funzionante. Consigliato: contenitore d'acqua (min. 0,5L per PT35K/PT22K, 0,375L per PT13K) e cibo di riserva.",
    },
  };

  for (const lang of languages) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq3.id, language: lang } },
      update: faq3Translations[lang],
      create: { faqId: faq3.id, language: lang, ...faq3Translations[lang] },
    });
  }

  // FAQ 4: Posso pedir reembolso?
  const faq4 = await findOrCreateFAQ(
    event.id,
    3,
    "Posso pedir reembolso da inscrição?",
    "Sim, em caso de acidente ou doença diagnosticada após a inscrição: 50% até 31/12/2025, 25% até 15/02/2026. Após 15/02/2026 não há reembolso. Necessário atestado médico e comprovativo de pagamento. Pedido por email para poiarestrail@gmail.com."
  );

  const faq4Translations = {
    pt: {
      question: "Posso pedir reembolso da inscrição?",
      answer:
        "Sim, em caso de acidente ou doença diagnosticada após a inscrição: 50% até 31/12/2025, 25% até 15/02/2026. Após 15/02/2026 não há reembolso. Necessário atestado médico e comprovativo de pagamento. Pedido por email para poiarestrail@gmail.com.",
    },
    en: {
      question: "Can I request a registration refund?",
      answer:
        "Yes, in case of accident or illness diagnosed after registration: 50% until 31/12/2025, 25% until 15/02/2026. After 15/02/2026 no refund. Medical certificate and payment proof required. Request by email to poiarestrail@gmail.com.",
    },
    es: {
      question: "¿Puedo pedir reembolso de la inscripción?",
      answer:
        "Sí, en caso de accidente o enfermedad diagnosticada tras la inscripción: 50% hasta 31/12/2025, 25% hasta 15/02/2026. Después del 15/02/2026 no hay reembolso. Necesario certificado médico y comprobante de pago. Solicitud por email a poiarestrail@gmail.com.",
    },
    fr: {
      question: "Puis-je demander un remboursement de l'inscription ?",
      answer:
        "Oui, en cas d'accident ou maladie diagnostiquée après l'inscription : 50% jusqu'au 31/12/2025, 25% jusqu'au 15/02/2026. Après le 15/02/2026 pas de remboursement. Certificat médical et preuve de paiement requis. Demande par email à poiarestrail@gmail.com.",
    },
    de: {
      question: "Kann ich eine Anmelderückerstattung beantragen?",
      answer:
        "Ja, bei Unfall oder nach der Anmeldung diagnostizierter Krankheit: 50% bis 31/12/2025, 25% bis 15/02/2026. Nach dem 15/02/2026 keine Rückerstattung. Ärztliches Attest und Zahlungsnachweis erforderlich. Anfrage per E-Mail an poiarestrail@gmail.com.",
    },
    it: {
      question: "Posso richiedere il rimborso dell'iscrizione?",
      answer:
        "Sì, in caso di infortunio o malattia diagnosticata dopo l'iscrizione: 50% fino al 31/12/2025, 25% fino al 15/02/2026. Dopo il 15/02/2026 nessun rimborso. Necessario certificato medico e prova di pagamento. Richiesta via email a poiarestrail@gmail.com.",
    },
  };

  for (const lang of languages) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq4.id, language: lang } },
      update: faq4Translations[lang],
      create: { faqId: faq4.id, language: lang, ...faq4Translations[lang] },
    });
  }

  // FAQ 5: Como funcionam as estafetas?
  const faq5 = await findOrCreateFAQ(
    event.id,
    4,
    "Como funcionam as Estafetas 35K?",
    "Equipas de 3 elementos percorrem o trajeto de 35km dividido em 3 etapas (10km + 10km + 15km). O dorsal (testemunho) é transmitido nas zonas de transição. A inscrição é individual mas cada elemento escolhe a mesma equipa. Transfer incluído para zonas de transição."
  );

  const faq5Translations = {
    pt: {
      question: "Como funcionam as Estafetas 35K?",
      answer:
        "Equipas de 3 elementos percorrem o trajeto de 35km dividido em 3 etapas (10km + 10km + 15km). O dorsal (testemunho) é transmitido nas zonas de transição. A inscrição é individual mas cada elemento escolhe a mesma equipa. Transfer incluído para zonas de transição.",
    },
    en: {
      question: "How does the 35K Relay work?",
      answer:
        "Teams of 3 cover the 35km course divided into 3 stages (10km + 10km + 15km). The bib (baton) is passed at transition zones. Registration is individual but each member chooses the same team. Transfer included to transition zones.",
    },
    es: {
      question: "¿Cómo funcionan los Relevos 35K?",
      answer:
        "Equipos de 3 recorren los 35km divididos en 3 etapas (10km + 10km + 15km). El dorsal (testigo) se transmite en las zonas de transición. La inscripción es individual pero cada miembro elige el mismo equipo. Transfer incluido a zonas de transición.",
    },
    fr: {
      question: "Comment fonctionne le Relais 35K ?",
      answer:
        "Équipes de 3 parcourent les 35km divisés en 3 étapes (10km + 10km + 15km). Le dossard (témoin) est transmis aux zones de transition. L'inscription est individuelle mais chaque membre choisit la même équipe. Transfert inclus vers les zones de transition.",
    },
    de: {
      question: "Wie funktioniert die 35K Staffel?",
      answer:
        "3er-Teams absolvieren die 35km in 3 Etappen (10km + 10km + 15km). Die Startnummer (Staffelstab) wird in den Wechselzonen übergeben. Anmeldung ist individuell, aber jedes Mitglied wählt dasselbe Team. Transfer zu Wechselzonen inklusive.",
    },
    it: {
      question: "Come funziona la Staffetta 35K?",
      answer:
        "Squadre di 3 percorrono i 35km divisi in 3 tappe (10km + 10km + 15km). Il pettorale (testimone) viene passato nelle zone di transizione. L'iscrizione è individuale ma ogni membro sceglie la stessa squadra. Transfer incluso per le zone di transizione.",
    },
  };

  for (const lang of languages) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq5.id, language: lang } },
      update: faq5Translations[lang],
      create: { faqId: faq5.id, language: lang, ...faq5Translations[lang] },
    });
  }

  // FAQ 6: Qual a barreira horária?
  const faq6 = await findOrCreateFAQ(
    event.id,
    5,
    "Qual a barreira horária?",
    "PT35K e Estafetas: Abastecimento da Ribeira (26.5km) às 15h45 (6h45 de prova). Atletas que não cumprirem este tempo serão retirados de prova e transportados para a chegada."
  );

  const faq6Translations = {
    pt: {
      question: "Qual a barreira horária?",
      answer:
        "PT35K e Estafetas: Abastecimento da Ribeira (26.5km) às 15h45 (6h45 de prova). Atletas que não cumprirem este tempo serão retirados de prova e transportados para a chegada.",
    },
    en: {
      question: "What is the time barrier?",
      answer:
        "PT35K and Relay: Ribeira aid station (26.5km) at 15:45 (6h45 into the race). Athletes who don't meet this time will be removed from the race and transported to the finish.",
    },
    es: {
      question: "¿Cuál es la barrera horaria?",
      answer:
        "PT35K y Relevos: Avituallamiento de Ribeira (26.5km) a las 15:45 (6h45 de carrera). Los atletas que no cumplan este tiempo serán retirados y transportados a la meta.",
    },
    fr: {
      question: "Quelle est la barrière horaire ?",
      answer:
        "PT35K et Relais : Ravitaillement de Ribeira (26.5km) à 15h45 (6h45 de course). Les athlètes qui ne respectent pas ce temps seront retirés et transportés à l'arrivée.",
    },
    de: {
      question: "Was ist die Zeitschranke?",
      answer:
        "PT35K und Staffel: Verpflegungsstation Ribeira (26.5km) um 15:45 (6h45 Rennzeit). Athleten, die diese Zeit nicht einhalten, werden aus dem Rennen genommen und zum Ziel transportiert.",
    },
    it: {
      question: "Qual è la barriera oraria?",
      answer:
        "PT35K e Staffetta: Ristoro di Ribeira (26.5km) alle 15:45 (6h45 di gara). Gli atleti che non rispettano questo tempo saranno ritirati e trasportati al traguardo.",
    },
  };

  for (const lang of languages) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq6.id, language: lang } },
      update: faq6Translations[lang],
      create: { faqId: faq6.id, language: lang, ...faq6Translations[lang] },
    });
  }

  console.log("❓ FAQs created (6 FAQs with translations)");

  console.log("\n🎉 Poiares Trail 2026 seeded successfully!");
  console.log("   📍 Location: Vila Nova de Poiares, Portugal");
  console.log("   📅 Date: February 22, 2026 (NEW DATE)");
  console.log("   🏃 Variants: 5 (PT35K, PT22K, PT13K, Estafetas, Caminhada)");
  console.log("   🌍 Translations: 6 languages (pt, en, es, fr, de, it)");
  console.log("   💰 Pricing: 2 phases per variant");
  console.log("   ❓ FAQs: 6 questions");
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
