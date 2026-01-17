/**
 * Seed: 5ª Edição Grande Descida 2026 - Castelo de Bode
 * Complete with translations in all 6 languages
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏊 Seeding 5ª Edição Grande Descida 2026...");

  const eventSlug = "grande-descida-castelo-bode-2026";

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "5ª Edição Grande Descida - Castelo de Bode",
      description: `Competição de natação em águas abertas na Barragem de Castelo de Bode, com 6 etapas ao longo de 3 dias. Percurso total de aproximadamente 50 km através das praias fluviais das regiões de Figueiró dos Vinhos, Vila de Rei, Ferreira do Zêzere e Abrantes. Evento aberto a nadadores licenciados a partir dos 14 anos.`,
      sportTypes: [SportType.SWIMMING],
      startDate: new Date("2026-06-05T09:00:00.000Z"),
      endDate: new Date("2026-06-07T15:30:00.000Z"),
      city: "Aldeia do Mato",
      country: "Portugal",
      latitude: 39.543363,
      longitude: -8.272496,
      googleMapsUrl: "https://maps.app.goo.gl/5aPjtEfrPJZkGSop6",
      externalUrl: "https://lxtriathlon.com/grande-descida",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-05-31T23:59:00.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "5ª Edição Grande Descida - Castelo de Bode",
      description: `Competição de natação em águas abertas na Barragem de Castelo de Bode, com 6 etapas ao longo de 3 dias. Percurso total de aproximadamente 50 km através das praias fluviais das regiões de Figueiró dos Vinhos, Vila de Rei, Ferreira do Zêzere e Abrantes. Evento aberto a nadadores licenciados a partir dos 14 anos.`,
      sportTypes: [SportType.SWIMMING],
      startDate: new Date("2026-06-05T09:00:00.000Z"),
      endDate: new Date("2026-06-07T15:30:00.000Z"),
      city: "Aldeia do Mato",
      country: "Portugal",
      latitude: 39.543363,
      longitude: -8.272496,
      googleMapsUrl: "https://maps.app.goo.gl/5aPjtEfrPJZkGSop6",
      externalUrl: "https://lxtriathlon.com/grande-descida",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-05-31T23:59:00.000Z"),
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
      title: "5ª Edição Grande Descida - Castelo de Bode",
      description: `# 🏊‍♂️ 5ª Edição Grande Descida - Castelo de Bode 2026

A **Grande Descida de Castelo de Bode** é uma competição épica de natação em águas abertas, dividida em **6 etapas ao longo de 3 dias** na deslumbrante Barragem de Castelo de Bode.

## 📅 Datas e Horários

**5 de Junho de 2026 (Quinta-feira)**
- **1ª Etapa (8,5 km):** 09:00 - Foz de Alge (Figueiró dos Vinhos) → Praia Fluvial de Dornes (Ferreira do Zêzere)
- **2ª Etapa (9,5 km):** 15:30 - Praia Fluvial de Dornes → Isna Velha (Vila de Rei)

**6 de Junho de 2026 (Sexta-feira)**
- **3ª Etapa (4,5 km):** 08:30 - Isna Velha → Praia Fluvial Zaboeira (Vila de Rei)
- **4ª Etapa (7,0 km):** 11:00 - Praia Fluvial Zaboeira → Praia Fluvial Bairrada (Ferreira do Zêzere)
- **5ª Etapa (6,5 km):** 16:10 - Praia Fluvial Bairrada → Praia Fluvial de Fontes (Abrantes)

**7 de Junho de 2026 (Sábado)**
- **6ª Etapa (11,0 km):** 10:00 - Praia Fluvial de Fontes → Aldeia do Mato

**Distância Total:** ~50 km

## 🏊 Modalidades de Inscrição

### Circuito Completo (6 etapas)
**Preços com Fases:**
- **1ª Fase:** 100€ (01 Jan - 31 Mar 2026)
- **2ª Fase:** 130€ (01 Abr - 30 Abr 2026)
- **3ª Fase:** 190€ (01 Mai - 31 Mai 2026)

### Estafetas (2 nadadores)
Equipas de 2 nadadores podem inscrever-se no circuito completo pelos mesmos preços.

### Etapas Individuais
- **1ª Etapa (8,5 km):** 60€
- **2ª Etapa (9,5 km):** 60€
- **3ª Etapa (4,5 km):** 40€
- **4ª Etapa (7,0 km):** 60€
- **5ª Etapa (6,5 km):** 60€
- **6ª Etapa (11,0 km):** 60€

## 📋 Requisitos

- **Idade Mínima:** 14 anos
- **Licença Obrigatória:** Federação Portuguesa de Natação ou equivalente reconhecida pela FINA
- **Acompanhamento:** Cada nadador deve ser acompanhado por caiaque ou embarcação (preferencialmente com acompanhante)

## 🎯 Categorias e Classificações

### Categorias
- **Absolutos:** Todos os nadadores a partir dos 14 anos

### Classificações
- **Individual por Etapa**
- **Classificação Geral (soma das 6 etapas)**
- **Estafetas (2 nadadores)**

## 🏆 Prémios

### Prémios Monetários
- **Top 3 por Etapa:** Prémios monetários
- **Top 3 Classificação Geral:** Prémios monetários

### Troféus e Medalhas
- **Top 6 Geral:** Troféus
- **Top 5 por Etapa:** Medalhas
- **Top 3 Estafetas:** Troféus

### Para Todos
- 🎁 **Lembrança de Participação** para todos os atletas

## 🛟 Segurança e Apoio

- **Embarcações de Apoio:** Acompanhamento obrigatório por caiaque ou barco
- **Postos de Socorro:** Presentes em todas as etapas
- **Marcação do Percurso:** Boias de sinalização
- **Seguro de Acidentes Pessoais:** Incluído para todos os participantes

## 🚌 Logística

- **Transporte:** Disponível entre os pontos de partida e chegada
- **Apoio aos Acompanhantes:** Transporte para caiaques e embarcações

## 🏞️ Sobre o Percurso

A Barragem de Castelo de Bode oferece paisagens naturais deslumbrantes e águas tranquilas, proporcionando uma experiência única de natação em águas abertas. O percurso atravessa várias praias fluviais icónicas da região centro de Portugal.

### Municípios Abrangidos
- Figueiró dos Vinhos
- Vila de Rei
- Ferreira do Zêzere
- Abrantes

## 📝 Inscrições

**Prazo:** Até 31 de Maio de 2026  
**Inscrições tardias:** Possíveis até ao dia do evento (sujeitas a disponibilidade)

Inscreve-te em: [lxtriathlon.com/grande-descida](https://lxtriathlon.com/grande-descida)

## 📧 Contactos

**Organizador:** LXTRIATHLON - Clube de Triatlo de Lisboa  
**Email:** grandedescida@lxtriathlon.pt  
**Website:** [lxtriathlon.com](https://lxtriathlon.com)

---

**Nota:** As distâncias são aproximadas e podem variar consoante a opção de nado/orientação/trajeto de cada atleta.

🏊‍♂️ Prepara-te para a aventura de 50 km pelas águas de Castelo de Bode! 💙`,
      city: "Aldeia do Mato",
      metaTitle:
        "5ª Grande Descida Castelo Bode 2026 | 6 Etapas Natação Águas Abertas",
      metaDescription:
        "Grande Descida Castelo Bode 2026: 6 etapas, ~50 km de natação em águas abertas. 5-7 Junho. Circuito completo, etapas individuais ou estafetas. Inscreve-te já!",
    },
    {
      language: "en",
      title: "5th Edition Great Descent - Castelo de Bode",
      description: `# 🏊‍♂️ 5th Edition Great Descent - Castelo de Bode 2026

The **Great Descent of Castelo de Bode** is an epic open water swimming competition, divided into **6 stages over 3 days** in the stunning Castelo de Bode reservoir.

## 📅 Dates and Times

**June 5, 2026 (Thursday)**
- **Stage 1 (8.5 km):** 09:00 - Foz de Alge (Figueiró dos Vinhos) → Dornes River Beach
- **Stage 2 (9.5 km):** 15:30 - Dornes River Beach → Isna Velha (Vila de Rei)

**June 6, 2026 (Friday)**
- **Stage 3 (4.5 km):** 08:30 - Isna Velha → Zaboeira River Beach (Vila de Rei)
- **Stage 4 (7.0 km):** 11:00 - Zaboeira River Beach → Bairrada River Beach
- **Stage 5 (6.5 km):** 16:10 - Bairrada River Beach → Fontes River Beach (Abrantes)

**June 7, 2026 (Saturday)**
- **Stage 6 (11.0 km):** 10:00 - Fontes River Beach → Aldeia do Mato

**Total Distance:** ~50 km

## 🏊 Registration Options

### Full Circuit (6 stages)
**Phased Pricing:**
- **Phase 1:** €100 (Jan 1 - Mar 31, 2026)
- **Phase 2:** €130 (Apr 1 - Apr 30, 2026)
- **Phase 3:** €190 (May 1 - May 31, 2026)

### Relay Teams (2 swimmers)
Teams of 2 swimmers can register for the full circuit at the same prices.

### Individual Stages
- **Stage 1 (8.5 km):** €60
- **Stage 2 (9.5 km):** €60
- **Stage 3 (4.5 km):** €40
- **Stage 4 (7.0 km):** €60
- **Stage 5 (6.5 km):** €60
- **Stage 6 (11.0 km):** €60

## 📋 Requirements

- **Minimum Age:** 14 years
- **License Required:** Portuguese Swimming Federation or equivalent recognized by FINA
- **Escort:** Each swimmer must be accompanied by kayak or boat (preferably with escort)

## 🏆 Prizes

### Cash Prizes
- **Top 3 per Stage:** Monetary prizes
- **Top 3 Overall:** Monetary prizes

### Trophies and Medals
- **Top 6 Overall:** Trophies
- **Top 5 per Stage:** Medals
- **Top 3 Relay Teams:** Trophies
- 🎁 **Participation Souvenir** for all athletes

## 🛟 Safety and Support

- **Support Boats:** Mandatory kayak or boat escort
- **Medical Posts:** Present at all stages
- **Course Marking:** Signaling buoys
- **Personal Accident Insurance:** Included for all participants

## 📝 Registration

**Deadline:** May 31, 2026  
**Late registrations:** Possible until event day (subject to availability)

Register at: [lxtriathlon.com/grande-descida](https://lxtriathlon.com/grande-descida)

🏊‍♂️ Get ready for the 50 km adventure through Castelo de Bode waters! 💙`,
      city: "Aldeia do Mato",
      metaTitle:
        "5th Great Descent Castelo Bode 2026 | 6-Stage Open Water Swimming",
      metaDescription:
        "Great Descent Castelo Bode 2026: 6 stages, ~50 km open water swimming. June 5-7. Full circuit, individual stages or relay teams. Register now!",
    },
    {
      language: "es",
      title: "5ª Edición Gran Descenso - Castelo de Bode",
      description: `# 🏊‍♂️ 5ª Edición Gran Descenso - Castelo de Bode 2026

El **Gran Descenso de Castelo de Bode** es una competición épica de natación en aguas abiertas, dividida en **6 etapas durante 3 días** en el impresionante embalse de Castelo de Bode.

## 📅 Fechas y Horarios

**5 de junio de 2026**
- **Etapa 1 (8,5 km):** 09:00 - Foz de Alge → Playa Fluvial de Dornes
- **Etapa 2 (9,5 km):** 15:30 - Playa Fluvial de Dornes → Isna Velha

**6 de junio de 2026**
- **Etapa 3 (4,5 km):** 08:30 - Isna Velha → Playa Fluvial Zaboeira
- **Etapa 4 (7,0 km):** 11:00 - Playa Zaboeira → Playa Bairrada
- **Etapa 5 (6,5 km):** 16:10 - Playa Bairrada → Playa de Fontes

**7 de junio de 2026**
- **Etapa 6 (11,0 km):** 10:00 - Playa de Fontes → Aldeia do Mato

**Distancia Total:** ~50 km

## 🏊 Opciones de Inscripción

### Circuito Completo (6 etapas)
- **Fase 1:** 100€ (1 Ene - 31 Mar)
- **Fase 2:** 130€ (1 Abr - 30 Abr)
- **Fase 3:** 190€ (1 May - 31 May)

### Etapas Individuales
- **Etapas de 40€ a 60€**

## 🏆 Premios

- 💰 Premios en efectivo para los 3 primeros por etapa
- 🏆 Trofeos para los 6 primeros en general
- 🏅 Medallas para los 5 primeros por etapa
- 🎁 Recuerdo de participación para todos

## 📝 Inscripciones

**Plazo:** Hasta el 31 de mayo de 2026

Regístrate en: [lxtriathlon.com/grande-descida](https://lxtriathlon.com/grande-descida)`,
      city: "Aldeia do Mato",
      metaTitle:
        "5º Gran Descenso Castelo Bode 2026 | 6 Etapas Natación Aguas Abiertas",
      metaDescription:
        "Gran Descenso Castelo Bode 2026: 6 etapas, ~50 km natación aguas abiertas. 5-7 junio. Circuito completo, etapas individuales o relevos.",
    },
    {
      language: "fr",
      title: "5ème Édition Grande Descente - Castelo de Bode",
      description: `# 🏊‍♂️ 5ème Édition Grande Descente - Castelo de Bode 2026

La **Grande Descente de Castelo de Bode** est une compétition épique de nage en eau libre, divisée en **6 étapes sur 3 jours** dans le magnifique réservoir de Castelo de Bode.

## 📅 Dates et Horaires

**5 juin 2026**
- **Étape 1 (8,5 km):** 09:00 - Foz de Alge → Plage Fluviale de Dornes
- **Étape 2 (9,5 km):** 15:30 - Plage de Dornes → Isna Velha

**6 juin 2026**
- **Étape 3 (4,5 km):** 08:30 - Isna Velha → Plage Zaboeira
- **Étape 4 (7,0 km):** 11:00 - Plage Zaboeira → Plage Bairrada
- **Étape 5 (6,5 km):** 16:10 - Plage Bairrada → Plage de Fontes

**7 juin 2026**
- **Étape 6 (11,0 km):** 10:00 - Plage de Fontes → Aldeia do Mato

**Distance Totale:** ~50 km

## 🏊 Options d'Inscription

### Circuit Complet (6 étapes)
- **Phase 1:** 100€ (1 Jan - 31 Mar)
- **Phase 2:** 130€ (1 Avr - 30 Avr)
- **Phase 3:** 190€ (1 Mai - 31 Mai)

### Étapes Individuelles
- **Étapes de 40€ à 60€**

## 🏆 Prix

- 💰 Prix en espèces pour les 3 premiers par étape
- 🏆 Trophées pour les 6 premiers au général
- 🏅 Médailles pour les 5 premiers par étape
- 🎁 Souvenir de participation pour tous

## 📝 Inscriptions

**Date limite:** 31 mai 2026

Inscrivez-vous sur: [lxtriathlon.com/grande-descida](https://lxtriathlon.com/grande-descida)`,
      city: "Aldeia do Mato",
      metaTitle:
        "5ème Grande Descente Castelo Bode 2026 | 6 Étapes Nage Eau Libre",
      metaDescription:
        "Grande Descente Castelo Bode 2026: 6 étapes, ~50 km nage en eau libre. 5-7 juin. Circuit complet, étapes individuelles ou relais.",
    },
    {
      language: "de",
      title: "5. Ausgabe Großer Abstieg - Castelo de Bode",
      description: `# 🏊‍♂️ 5. Ausgabe Großer Abstieg - Castelo de Bode 2026

Der **Große Abstieg von Castelo de Bode** ist ein epischer Freiwasserschwimmwettbewerb, aufgeteilt in **6 Etappen über 3 Tage** im atemberaubenden Stausee Castelo de Bode.

## 📅 Termine und Zeiten

**5. Juni 2026**
- **Etappe 1 (8,5 km):** 09:00 - Foz de Alge → Flussstrand Dornes
- **Etappe 2 (9,5 km):** 15:30 - Flussstrand Dornes → Isna Velha

**6. Juni 2026**
- **Etappe 3 (4,5 km):** 08:30 - Isna Velha → Flussstrand Zaboeira
- **Etappe 4 (7,0 km):** 11:00 - Strand Zaboeira → Strand Bairrada
- **Etappe 5 (6,5 km):** 16:10 - Strand Bairrada → Strand Fontes

**7. Juni 2026**
- **Etappe 6 (11,0 km):** 10:00 - Strand Fontes → Aldeia do Mato

**Gesamtdistanz:** ~50 km

## 🏊 Anmeldeoptionen

### Vollständiger Rundkurs (6 Etappen)
- **Phase 1:** 100€ (1. Jan - 31. Mär)
- **Phase 2:** 130€ (1. Apr - 30. Apr)
- **Phase 3:** 190€ (1. Mai - 31. Mai)

### Einzelne Etappen
- **Etappen von 40€ bis 60€**

## 🏆 Preise

- 💰 Geldpreise für die Top 3 pro Etappe
- 🏆 Pokale für die Top 6 insgesamt
- 🏅 Medaillen für die Top 5 pro Etappe
- 🎁 Teilnahmeandenken für alle

## 📝 Anmeldung

**Frist:** 31. Mai 2026

Anmeldung unter: [lxtriathlon.com/grande-descida](https://lxtriathlon.com/grande-descida)`,
      city: "Aldeia do Mato",
      metaTitle:
        "5. Großer Abstieg Castelo Bode 2026 | 6-Etappen Freiwasserschwimmen",
      metaDescription:
        "Großer Abstieg Castelo Bode 2026: 6 Etappen, ~50 km Freiwasserschwimmen. 5-7 Juni. Vollständiger Rundkurs, Einzeletappen oder Staffeln.",
    },
    {
      language: "it",
      title: "5ª Edizione Grande Discesa - Castelo de Bode",
      description: `# 🏊‍♂️ 5ª Edizione Grande Discesa - Castelo de Bode 2026

La **Grande Discesa di Castelo de Bode** è una competizione epica di nuoto in acque libere, divisa in **6 tappe in 3 giorni** nello splendido bacino di Castelo de Bode.

## 📅 Date e Orari

**5 giugno 2026**
- **Tappa 1 (8,5 km):** 09:00 - Foz de Alge → Spiaggia Fluviale di Dornes
- **Tappa 2 (9,5 km):** 15:30 - Spiaggia di Dornes → Isna Velha

**6 giugno 2026**
- **Tappa 3 (4,5 km):** 08:30 - Isna Velha → Spiaggia Zaboeira
- **Tappa 4 (7,0 km):** 11:00 - Spiaggia Zaboeira → Spiaggia Bairrada
- **Tappa 5 (6,5 km):** 16:10 - Spiaggia Bairrada → Spiaggia Fontes

**7 giugno 2026**
- **Tappa 6 (11,0 km):** 10:00 - Spiaggia Fontes → Aldeia do Mato

**Distanza Totale:** ~50 km

## 🏊 Opzioni di Iscrizione

### Circuito Completo (6 tappe)
- **Fase 1:** 100€ (1 Gen - 31 Mar)
- **Fase 2:** 130€ (1 Apr - 30 Apr)
- **Fase 3:** 190€ (1 Mag - 31 Mag)

### Tappe Individuali
- **Tappe da 40€ a 60€**

## 🏆 Premi

- 💰 Premi in denaro per i primi 3 per tappa
- 🏆 Trofei per i primi 6 in generale
- 🏅 Medaglie per i primi 5 per tappa
- 🎁 Ricordo di partecipazione per tutti

## 📝 Iscrizioni

**Scadenza:** 31 maggio 2026

Iscriviti su: [lxtriathlon.com/grande-descida](https://lxtriathlon.com/grande-descida)`,
      city: "Aldeia do Mato",
      metaTitle:
        "5ª Grande Discesa Castelo Bode 2026 | 6 Tappe Nuoto Acque Libere",
      metaDescription:
        "Grande Discesa Castelo Bode 2026: 6 tappe, ~50 km nuoto in acque libere. 5-7 giugno. Circuito completo, tappe individuali o staffette.",
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

  // Step 3: Create variants (6 stages + full circuit + relay)
  const variants = [
    {
      name: "Circuito Completo - Grande Descida (6 etapas)",
      distanceKm: 50,
      price: 100.0,
      startTime: "09:00",
    },
    {
      name: "Estafetas | Circuito Completo (2 nadadores)",
      distanceKm: 50,
      price: 100.0,
      startTime: "09:00",
    },
    {
      name: "1ª Etapa: Foz de Alge - Dornes (8,5 km)",
      distanceKm: 8.5,
      price: 60.0,
      startTime: "09:00",
    },
    {
      name: "2ª Etapa: Dornes - Isna Velha (9,5 km)",
      distanceKm: 9.5,
      price: 60.0,
      startTime: "15:30",
    },
    {
      name: "3ª Etapa: Isna Velha - Zaboeira (4,5 km)",
      distanceKm: 4.5,
      price: 40.0,
      startTime: "08:30",
    },
    {
      name: "4ª Etapa: Zaboeira - Bairrada (7,0 km)",
      distanceKm: 7.0,
      price: 60.0,
      startTime: "11:00",
    },
    {
      name: "5ª Etapa: Bairrada - Fontes (6,5 km)",
      distanceKm: 6.5,
      price: 60.0,
      startTime: "16:10",
    },
    {
      name: "6ª Etapa: Fontes - Aldeia do Mato (11,0 km)",
      distanceKm: 11.0,
      price: 60.0,
      startTime: "10:00",
    },
  ];

  for (const variantData of variants) {
    const existing = await prisma.eventVariant.findFirst({
      where: {
        eventId: event.id,
        name: variantData.name,
      },
    });

    let variant;
    if (existing) {
      variant = await prisma.eventVariant.update({
        where: { id: existing.id },
        data: {
          distanceKm: variantData.distanceKm,
          price: variantData.price,
          startTime: variantData.startTime,
        },
      });
    } else {
      variant = await prisma.eventVariant.create({
        data: {
          eventId: event.id,
          name: variantData.name,
          distanceKm: variantData.distanceKm,
          price: variantData.price,
          startTime: variantData.startTime,
        },
      });
    }

    console.log(
      `✅ Variant ${existing ? "updated" : "created"}: ${variant.name}`
    );
  }

  console.log("");
  console.log("🎉 5ª Grande Descida 2026 seeded successfully!");
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
