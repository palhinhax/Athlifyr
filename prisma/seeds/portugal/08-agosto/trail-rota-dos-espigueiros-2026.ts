/**
 * Seed: Trail Rota dos Espigueiros 2026 (10.ª Edição)
 * Complete with translations in all 6 languages
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌾 Seeding 10.º Trail Rota dos Espigueiros 2026...");

  const eventSlug = "trail-rota-dos-espigueiros-2026";

  // Step 1: Delete existing data to ensure clean state
  const existingEvent = await prisma.event.findUnique({
    where: { slug: eventSlug },
  });

  if (existingEvent) {
    console.log("   Cleaning existing event data...");
    await prisma.pricingPhase.deleteMany({
      where: { eventId: existingEvent.id },
    });
    await prisma.eventFAQ.deleteMany({
      where: { eventId: existingEvent.id },
    });
    await prisma.eventVariant.deleteMany({
      where: { eventId: existingEvent.id },
    });
    await prisma.eventTranslation.deleteMany({
      where: { eventId: existingEvent.id },
    });
  }

  // Step 2: Upsert the event
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "10.º Trail Rota dos Espigueiros",
      description:
        "10.ª edição do Trail Rota dos Espigueiros em Caparrosinha (Tondela). Trail Longo 30K, Trail 24K, Trail Curto 15K. Integra o Circuito Nacional de Trail Running, Circuito Sprint e Circuito Jovem.",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-08-02T07:00:00.000Z"),
      endDate: null,
      city: "Caparrosinha",
      country: "Portugal",
      latitude: 40.609163,
      longitude: -8.08066,
      googleMapsUrl: "https://maps.google.com/?q=40.609163,-8.08066",
      externalUrl: "https://www.rotadosespigueiros.pt/",
      imageUrl: null,
      isFeatured: false,
      registrationDeadline: new Date("2026-07-25T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "10.º Trail Rota dos Espigueiros",
      description:
        "10.ª edição do Trail Rota dos Espigueiros em Caparrosinha (Tondela). Trail Longo 30K, Trail 24K, Trail Curto 15K. Integra o Circuito Nacional de Trail Running, Circuito Sprint e Circuito Jovem.",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-08-02T07:00:00.000Z"),
      endDate: null,
      city: "Caparrosinha",
      country: "Portugal",
      latitude: 40.609163,
      longitude: -8.08066,
      googleMapsUrl: "https://maps.google.com/?q=40.609163,-8.08066",
      externalUrl: "https://www.rotadosespigueiros.pt/",
      imageUrl: null,
      isFeatured: false,
      registrationDeadline: new Date("2026-07-25T23:59:59.000Z"),
    },
  });

  console.log(`✅ Event upserted: ${event.slug} (ID: ${event.id})`);

  // Step 3: Create translations for ALL 6 LANGUAGES
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
      title: "10.º Trail Rota dos Espigueiros",
      city: "Caparrosinha",
      metaTitle: "10.º Trail Rota dos Espigueiros 2026 | Tondela | 2 Agosto",
      metaDescription:
        "10.ª edição do Trail Rota dos Espigueiros a 2 de agosto de 2026 em Caparrosinha, Tondela. Trail Longo 30K, Trail 24K, Trail Curto 15K. Circuito Nacional de Trail Running ATRP.",
      description: `# 🌾 10.º Trail Rota dos Espigueiros 2026

A **10.ª edição do Trail Rota dos Espigueiros** é um evento de Trail Running organizado pela **ARCAPA**, em **Caparrosinha (Tondela)**. A prova integra o **Circuito Nacional de Trail Running**, **Circuito Sprint** e **Circuito Jovem** da ATRP.

## 📅 Data e Local

- **Data:** 2 de agosto de 2026
- **Hora:** 07:00
- **Local:** Parque Desportivo do Vale dos Mamoirais, Caparrosinha – Silvares, Tondela
- **Distrito:** Viseu (Zona Centro)
- **Coordenadas:** 40.609163, -8.080660
- **Website:** https://www.rotadosespigueiros.pt/

## 🏃‍♀️ Provas e Distâncias

| Prova | Distância | Limite de Participantes |
|-------|-----------|-------------------------|
| **Trail Longo** | 30 km | 100 |
| **Trail** | 24 km | 100 |
| **Trail Curto** | 15 km | 150 |

## 🏆 Circuitos ATRP

Este evento integra os seguintes circuitos da Associação de Trail Running de Portugal:

- 🏅 **Circuito Nacional de Trail Running**
- 🏅 **Circuito Nacional de Trail Sprint**
- 🏅 **Circuito Jovem**

## 🧭 Percurso

Os percursos decorrem maioritariamente em caminhos, trilhos, levadas e estrada florestal, com pequenas extensões de asfalto. Há passagens técnicas e atravessamentos de vias públicas — é obrigatório cumprir o código da estrada e seguir a sinalização.

## ⛑️ Segurança e Controlo

- **Postos de controlo obrigatórios** (falha implica desclassificação)
- Material obrigatório: **telemóvel**
- Material recomendado: **reservatório de água, porta-resíduos, apito, manta térmica e alimentação**

## 🎁 Kit e Serviços

- Peitoral com chip de cronometragem
- T-shirt técnica
- Outras lembranças
- Abastecimentos em prova e na meta
- Duches
- ATL para crianças
- Massagens gratuitas

## 👥 Organização e Contactos

- **Organização:** ARCAPA
- **Email:** rotadosespigueiros@gmail.com
- **Website:** https://www.rotadosespigueiros.pt/

---

**🌾 Vem celebrar 10 anos do Trail Rota dos Espigueiros!**`,
    },
    {
      language: "en",
      title: "10th Trail Rota dos Espigueiros",
      city: "Caparrosinha",
      metaTitle: "10th Trail Rota dos Espigueiros 2026 | Tondela | August 2",
      metaDescription:
        "10th edition of Trail Rota dos Espigueiros on August 2, 2026 in Caparrosinha, Tondela. Long Trail 30K, Trail 24K, Short Trail 15K. ATRP National Trail Running Circuit.",
      description: `# 🌾 10th Trail Rota dos Espigueiros 2026

The **10th edition of Trail Rota dos Espigueiros** is a trail running event organized by **ARCAPA** in **Caparrosinha (Tondela)**. The race is part of the **National Trail Running Circuit**, **Sprint Circuit**, and **Youth Circuit** of ATRP.

## 📅 Date & Location

- **Date:** August 2, 2026
- **Time:** 07:00
- **Location:** Vale dos Mamoirais Sports Park, Caparrosinha – Silvares, Tondela
- **District:** Viseu (Central Zone)
- **Coordinates:** 40.609163, -8.080660
- **Website:** https://www.rotadosespigueiros.pt/

## 🏃‍♀️ Races & Distances

| Race | Distance | Participant Limit |
|------|----------|-------------------|
| **Long Trail** | 30 km | 100 |
| **Trail** | 24 km | 100 |
| **Short Trail** | 15 km | 150 |

## 🏆 ATRP Circuits

This event is part of the following Portuguese Trail Running Association circuits:

- 🏅 **National Trail Running Circuit**
- 🏅 **National Trail Sprint Circuit**
- 🏅 **Youth Circuit**

## 🧭 Course

Routes follow trails, irrigation channels, forest roads, and short asphalt sections. There are technical sections and road crossings — participants must follow signage and traffic rules.

## ⛑️ Safety & Controls

- **Mandatory checkpoints** (missing one leads to disqualification)
- Mandatory gear: **mobile phone**
- Recommended: **hydration, waste bag, whistle, thermal blanket, food**

## 🎁 Kit & Services

- Race bib with timing chip
- Technical T-shirt
- Gifts and finisher items
- Aid stations on course and finish
- Showers
- Kids activities (ATL)
- Free massages

## 👥 Organizer & Contacts

- **Organizer:** ARCAPA
- **Email:** rotadosespigueiros@gmail.com
- **Website:** https://www.rotadosespigueiros.pt/

---

**🌾 Come celebrate 10 years of Trail Rota dos Espigueiros!**`,
    },
    {
      language: "es",
      title: "10.º Trail Rota dos Espigueiros",
      city: "Caparrosinha",
      metaTitle: "10.º Trail Rota dos Espigueiros 2026 | Tondela | 2 Agosto",
      metaDescription:
        "10.ª edición del Trail Rota dos Espigueiros el 2 de agosto de 2026 en Caparrosinha, Tondela. Trail Largo 30K, Trail 24K, Trail Corto 15K. Circuito Nacional de Trail Running ATRP.",
      description: `# 🌾 10.º Trail Rota dos Espigueiros 2026

La **10.ª edición del Trail Rota dos Espigueiros** es un evento de trail running organizado por **ARCAPA** en **Caparrosinha (Tondela)**. La prueba forma parte del **Circuito Nacional de Trail Running**, **Circuito Sprint** y **Circuito Joven** de la ATRP.

## 📅 Fecha y Lugar

- **Fecha:** 2 de agosto de 2026
- **Hora:** 07:00
- **Lugar:** Parque Deportivo Vale dos Mamoirais, Caparrosinha – Silvares, Tondela
- **Distrito:** Viseu (Zona Centro)
- **Coordenadas:** 40.609163, -8.080660
- **Web:** https://www.rotadosespigueiros.pt/

## 🏃‍♀️ Pruebas y Distancias

| Prueba | Distancia | Límite de Participantes |
|--------|-----------|-------------------------|
| **Trail Largo** | 30 km | 100 |
| **Trail** | 24 km | 100 |
| **Trail Corto** | 15 km | 150 |

## 🏆 Circuitos ATRP

Este evento forma parte de los siguientes circuitos de la Asociación de Trail Running de Portugal:

- 🏅 **Circuito Nacional de Trail Running**
- 🏅 **Circuito Nacional de Trail Sprint**
- 🏅 **Circuito Joven**

## 🧭 Recorrido

Los recorridos discurren principalmente por senderos, levadas, pistas forestales y cortos tramos de asfalto. Hay secciones técnicas y cruces de carretera — es obligatorio respetar la señalización y las normas de tráfico.

## ⛑️ Seguridad y Control

- **Puntos de control obligatorios** (la falta implica descalificación)
- Material obligatorio: **teléfono móvil**
- Recomendado: **hidratación, bolsa de residuos, silbato, manta térmica, comida**

## 🎁 Kit y Servicios

- Dorsal con chip de cronometraje
- Camiseta técnica
- Recuerdos
- Avituallamientos en carrera y meta
- Duchas
- ATL para niños
- Masajes gratuitos

## 👥 Organización y Contactos

- **Organización:** ARCAPA
- **Email:** rotadosespigueiros@gmail.com
- **Web:** https://www.rotadosespigueiros.pt/

---

**🌾 ¡Ven a celebrar 10 años del Trail Rota dos Espigueiros!**`,
    },
    {
      language: "fr",
      title: "10e Trail Rota dos Espigueiros",
      city: "Caparrosinha",
      metaTitle: "10e Trail Rota dos Espigueiros 2026 | Tondela | 2 Août",
      metaDescription:
        "10e édition du Trail Rota dos Espigueiros le 2 août 2026 à Caparrosinha, Tondela. Trail Long 30 km, Trail 24 km, Trail Court 15 km. Circuit National de Trail Running ATRP.",
      description: `# 🌾 10e Trail Rota dos Espigueiros 2026

La **10e édition du Trail Rota dos Espigueiros** est un événement de trail running organisé par **ARCAPA** à **Caparrosinha (Tondela)**. L'épreuve fait partie du **Circuit National de Trail Running**, du **Circuit Sprint** et du **Circuit Jeunes** de l'ATRP.

## 📅 Date et Lieu

- **Date :** 2 août 2026
- **Heure :** 07h00
- **Lieu :** Parc sportif de Vale dos Mamoirais, Caparrosinha – Silvares, Tondela
- **District :** Viseu (Zone Centre)
- **Coordonnées :** 40.609163, -8.080660
- **Site :** https://www.rotadosespigueiros.pt/

## 🏃‍♀️ Courses et Distances

| Course | Distance | Limite de Participants |
|--------|----------|------------------------|
| **Trail Long** | 30 km | 100 |
| **Trail** | 24 km | 100 |
| **Trail Court** | 15 km | 150 |

## 🏆 Circuits ATRP

Cet événement fait partie des circuits suivants de l'Association Portugaise de Trail Running :

- 🏅 **Circuit National de Trail Running**
- 🏅 **Circuit National de Trail Sprint**
- 🏅 **Circuit Jeunes**

## 🧭 Parcours

Les parcours empruntent principalement des sentiers, levadas, pistes forestières et de courts passages sur route. Des sections techniques et des traversées de routes exigent le respect du balisage et du code de la route.

## ⛑️ Sécurité et Contrôles

- **Postes de contrôle obligatoires** (manquer un poste = disqualification)
- Matériel obligatoire : **téléphone portable**
- Recommandé : **hydratation, sac à déchets, sifflet, couverture thermique, nourriture**

## 🎁 Kit et Services

- Dossard avec puce de chronométrage
- T-shirt technique
- Souvenirs
- Ravitaillements en course et à l'arrivée
- Douches
- Activités enfants (ATL)
- Massages gratuits

## 👥 Organisation et Contacts

- **Organisation :** ARCAPA
- **Email :** rotadosespigueiros@gmail.com
- **Site :** https://www.rotadosespigueiros.pt/

---

**🌾 Venez célébrer les 10 ans du Trail Rota dos Espigueiros !**`,
    },
    {
      language: "de",
      title: "10. Trail Rota dos Espigueiros",
      city: "Caparrosinha",
      metaTitle: "10. Trail Rota dos Espigueiros 2026 | Tondela | 2. August",
      metaDescription:
        "10. Ausgabe des Trail Rota dos Espigueiros am 2. August 2026 in Caparrosinha, Tondela. Langstrecke 30 km, Trail 24 km, Kurzstrecke 15 km. Nationaler Trailrunning-Zirkus ATRP.",
      description: `# 🌾 10. Trail Rota dos Espigueiros 2026

Die **10. Ausgabe des Trail Rota dos Espigueiros** ist ein Trailrunning-Event der **ARCAPA** in **Caparrosinha (Tondela)**. Das Rennen ist Teil des **Nationalen Trailrunning-Zirkus**, des **Sprint-Zirkus** und des **Jugend-Zirkus** der ATRP.

## 📅 Datum & Ort

- **Datum:** 2. August 2026
- **Uhrzeit:** 07:00
- **Ort:** Sportpark Vale dos Mamoirais, Caparrosinha – Silvares, Tondela
- **Bezirk:** Viseu (Zentrale Zone)
- **Koordinaten:** 40.609163, -8.080660
- **Website:** https://www.rotadosespigueiros.pt/

## 🏃‍♀️ Rennen & Distanzen

| Rennen | Distanz | Teilnehmerlimit |
|--------|---------|-----------------|
| **Langstrecke** | 30 km | 100 |
| **Trail** | 24 km | 100 |
| **Kurzstrecke** | 15 km | 150 |

## 🏆 ATRP-Zirkusse

Diese Veranstaltung ist Teil der folgenden Zirkusse des Portugiesischen Trailrunning-Verbandes:

- 🏅 **Nationaler Trailrunning-Zirkus**
- 🏅 **Nationaler Trail-Sprint-Zirkus**
- 🏅 **Jugend-Zirkus**

## 🧭 Strecke

Die Strecken verlaufen hauptsächlich auf Trails, Bewässerungskanälen, Forstwegen und kurzen Asphaltpassagen. Es gibt technische Abschnitte und Straßenquerungen — Markierungen und Verkehrsregeln sind einzuhalten.

## ⛑️ Sicherheit & Kontrolle

- **Pflicht-Kontrollpunkte** (fehlender Punkt = Disqualifikation)
- Pflichtmaterial: **Mobiltelefon**
- Empfohlen: **Getränkebehälter, Müllbeutel, Pfeife, Rettungsdecke, Verpflegung**

## 🎁 Kit & Services

- Startnummer mit Timing-Chip
- Technisches T-Shirt
- Andenken
- Verpflegungspunkte auf der Strecke und im Ziel
- Duschen
- Kinderbetreuung (ATL)
- Kostenlose Massagen

## 👥 Organisation & Kontakte

- **Organisation:** ARCAPA
- **E-Mail:** rotadosespigueiros@gmail.com
- **Website:** https://www.rotadosespigueiros.pt/

---

**🌾 Feiern Sie 10 Jahre Trail Rota dos Espigueiros!**`,
    },
    {
      language: "it",
      title: "10º Trail Rota dos Espigueiros",
      city: "Caparrosinha",
      metaTitle: "10º Trail Rota dos Espigueiros 2026 | Tondela | 2 Agosto",
      metaDescription:
        "10ª edizione del Trail Rota dos Espigueiros il 2 agosto 2026 a Caparrosinha, Tondela. Trail Lungo 30 km, Trail 24 km, Trail Corto 15 km. Circuito Nazionale di Trail Running ATRP.",
      description: `# 🌾 10º Trail Rota dos Espigueiros 2026

La **10ª edizione del Trail Rota dos Espigueiros** è un evento di trail running organizzato da **ARCAPA** a **Caparrosinha (Tondela)**. La gara fa parte del **Circuito Nazionale di Trail Running**, del **Circuito Sprint** e del **Circuito Giovani** dell'ATRP.

## 📅 Data e Luogo

- **Data:** 2 agosto 2026
- **Ora:** 07:00
- **Luogo:** Parco sportivo Vale dos Mamoirais, Caparrosinha – Silvares, Tondela
- **Distretto:** Viseu (Zona Centrale)
- **Coordinate:** 40.609163, -8.080660
- **Sito:** https://www.rotadosespigueiros.pt/

## 🏃‍♀️ Gare e Distanze

| Gara | Distanza | Limite Partecipanti |
|------|----------|---------------------|
| **Trail Lungo** | 30 km | 100 |
| **Trail** | 24 km | 100 |
| **Trail Corto** | 15 km | 150 |

## 🏆 Circuiti ATRP

Questo evento fa parte dei seguenti circuiti dell'Associazione Portoghese di Trail Running:

- 🏅 **Circuito Nazionale di Trail Running**
- 🏅 **Circuito Nazionale di Trail Sprint**
- 🏅 **Circuito Giovani**

## 🧭 Percorso

I percorsi si sviluppano principalmente su sentieri, levadas, strade forestali e brevi tratti di asfalto. Sono presenti sezioni tecniche e attraversamenti stradali — è obbligatorio seguire la segnaletica e il codice della strada.

## ⛑️ Sicurezza e Controlli

- **Punti di controllo obbligatori** (mancanza = squalifica)
- Materiale obbligatorio: **telefono cellulare**
- Consigliato: **idratazione, sacchetto rifiuti, fischietto, coperta termica, alimentazione**

## 🎁 Kit e Servizi

- Pettorale con chip di cronometraggio
- T-shirt tecnica
- Ricordi
- Ristori in gara e all'arrivo
- Docce
- Attività per bambini (ATL)
- Massaggi gratuiti

## 👥 Organizzazione e Contatti

- **Organizzazione:** ARCAPA
- **Email:** rotadosespigueiros@gmail.com
- **Sito:** https://www.rotadosespigueiros.pt/

---

**🌾 Vieni a festeggiare 10 anni del Trail Rota dos Espigueiros!**`,
    },
  ];

  console.log("📝 Creating translations for all 6 languages...");

  for (const t of translations) {
    await prisma.eventTranslation.upsert({
      where: { eventId_language: { eventId: event.id, language: t.language } },
      update: {
        title: t.title,
        description: t.description,
        city: t.city,
        metaTitle: t.metaTitle,
        metaDescription: t.metaDescription,
      },
      create: {
        eventId: event.id,
        language: t.language,
        title: t.title,
        description: t.description,
        city: t.city,
        metaTitle: t.metaTitle,
        metaDescription: t.metaDescription,
      },
    });
    console.log(`   ✅ Translation ${t.language.toUpperCase()} created`);
  }

  // Step 4: Create event variants
  console.log("🏃‍♀️ Creating event variants...");

  const variants = [
    {
      name: "Trail Longo 30K",
      distanceKm: 30,
      startTime: "07:00",
      maxParticipants: 100,
      description: "Trail Longo de 30km com desnível positivo acumulado",
      translations: {
        pt: { name: "Trail Longo 30K", description: "Trail Longo de 30km" },
        en: { name: "Long Trail 30K", description: "30km Long Trail" },
        es: { name: "Trail Largo 30K", description: "Trail Largo de 30km" },
        fr: { name: "Trail Long 30 km", description: "Trail Long de 30 km" },
        de: { name: "Langstrecke 30 km", description: "30 km Langstrecke" },
        it: { name: "Trail Lungo 30 km", description: "Trail Lungo di 30 km" },
      },
    },
    {
      name: "Trail 24K",
      distanceKm: 24,
      startTime: "07:30",
      maxParticipants: 100,
      description: "Trail de 24km - distância intermédia",
      translations: {
        pt: { name: "Trail 24K", description: "Trail de 24km" },
        en: { name: "Trail 24K", description: "24km Trail" },
        es: { name: "Trail 24K", description: "Trail de 24km" },
        fr: { name: "Trail 24 km", description: "Trail de 24 km" },
        de: { name: "Trail 24 km", description: "24 km Trail" },
        it: { name: "Trail 24 km", description: "Trail di 24 km" },
      },
    },
    {
      name: "Trail Curto 15K",
      distanceKm: 15,
      startTime: "08:00",
      maxParticipants: 150,
      description: "Trail Curto de 15km",
      translations: {
        pt: { name: "Trail Curto 15K", description: "Trail Curto de 15km" },
        en: { name: "Short Trail 15K", description: "15km Short Trail" },
        es: { name: "Trail Corto 15K", description: "Trail Corto de 15km" },
        fr: { name: "Trail Court 15 km", description: "Trail Court de 15 km" },
        de: { name: "Kurzstrecke 15 km", description: "15 km Kurzstrecke" },
        it: { name: "Trail Corto 15 km", description: "Trail Corto di 15 km" },
      },
    },
  ];

  for (const variantData of variants) {
    const { translations: variantTranslations, ...variantInfo } = variantData;

    const variant = await prisma.eventVariant.create({
      data: {
        ...variantInfo,
        eventId: event.id,
      },
    });

    console.log(`   ✅ Created variant: ${variant.name}`);

    // Create variant translations
    for (const [lang, trans] of Object.entries(variantTranslations)) {
      await prisma.eventVariantTranslation.create({
        data: {
          variantId: variant.id,
          language: lang as "pt" | "en" | "es" | "fr" | "de" | "it",
          name: trans.name,
          description: trans.description,
        },
      });
    }
  }

  // Step 5: Create FAQs
  console.log("❓ Creating FAQs...");

  const faqs = [
    {
      order: 1,
      question: "Quais os circuitos em que este evento está integrado?",
      answer:
        "O Trail Rota dos Espigueiros integra o Circuito Nacional de Trail Running, o Circuito Nacional de Trail Sprint e o Circuito Jovem da ATRP.",
      translations: {
        pt: {
          question: "Quais os circuitos em que este evento está integrado?",
          answer:
            "O Trail Rota dos Espigueiros integra o Circuito Nacional de Trail Running, o Circuito Nacional de Trail Sprint e o Circuito Jovem da ATRP.",
        },
        en: {
          question: "Which circuits is this event part of?",
          answer:
            "Trail Rota dos Espigueiros is part of the National Trail Running Circuit, National Trail Sprint Circuit, and Youth Circuit of ATRP.",
        },
        es: {
          question: "¿En qué circuitos está integrado este evento?",
          answer:
            "El Trail Rota dos Espigueiros forma parte del Circuito Nacional de Trail Running, del Circuito Nacional de Trail Sprint y del Circuito Joven de la ATRP.",
        },
        fr: {
          question: "Dans quels circuits cet événement est-il intégré ?",
          answer:
            "Le Trail Rota dos Espigueiros fait partie du Circuit National de Trail Running, du Circuit National de Trail Sprint et du Circuit Jeunes de l'ATRP.",
        },
        de: {
          question: "An welchen Zirkussen nimmt diese Veranstaltung teil?",
          answer:
            "Der Trail Rota dos Espigueiros ist Teil des Nationalen Trailrunning-Zirkus, des Nationalen Trail-Sprint-Zirkus und des Jugend-Zirkus der ATRP.",
        },
        it: {
          question: "Di quali circuiti fa parte questo evento?",
          answer:
            "Il Trail Rota dos Espigueiros fa parte del Circuito Nazionale di Trail Running, del Circuito Nazionale di Trail Sprint e del Circuito Giovani dell'ATRP.",
        },
      },
    },
    {
      order: 2,
      question: "Qual o material obrigatório?",
      answer:
        "O material obrigatório é o telemóvel operacional. Recomenda-se também reservatório de água, porta-resíduos, apito, manta térmica e alimentação.",
      translations: {
        pt: {
          question: "Qual o material obrigatório?",
          answer:
            "O material obrigatório é o telemóvel operacional. Recomenda-se também reservatório de água, porta-resíduos, apito, manta térmica e alimentação.",
        },
        en: {
          question: "What is the mandatory equipment?",
          answer:
            "Mandatory equipment is an operational mobile phone. Also recommended: hydration container, waste bag, whistle, thermal blanket, and food.",
        },
        es: {
          question: "¿Cuál es el material obligatorio?",
          answer:
            "El material obligatorio es el teléfono móvil operativo. También se recomienda: recipiente de hidratación, bolsa de residuos, silbato, manta térmica y comida.",
        },
        fr: {
          question: "Quel est le matériel obligatoire ?",
          answer:
            "Le matériel obligatoire est un téléphone portable opérationnel. Également recommandé : récipient d'hydratation, sac à déchets, sifflet, couverture thermique et nourriture.",
        },
        de: {
          question: "Welche Ausrüstung ist Pflicht?",
          answer:
            "Pflichtausrüstung ist ein funktionsfähiges Mobiltelefon. Ebenfalls empfohlen: Getränkebehälter, Müllbeutel, Pfeife, Rettungsdecke und Verpflegung.",
        },
        it: {
          question: "Qual è il materiale obbligatorio?",
          answer:
            "Il materiale obbligatorio è un telefono cellulare funzionante. Si raccomanda anche: contenitore per idratazione, sacchetto rifiuti, fischietto, coperta termica e cibo.",
        },
      },
    },
    {
      order: 3,
      question: "Quantos participantes são permitidos em cada prova?",
      answer:
        "Trail Longo 30K: 100 participantes. Trail 24K: 100 participantes. Trail Curto 15K: 150 participantes.",
      translations: {
        pt: {
          question: "Quantos participantes são permitidos em cada prova?",
          answer:
            "Trail Longo 30K: 100 participantes. Trail 24K: 100 participantes. Trail Curto 15K: 150 participantes.",
        },
        en: {
          question: "How many participants are allowed in each race?",
          answer:
            "Long Trail 30K: 100 participants. Trail 24K: 100 participants. Short Trail 15K: 150 participants.",
        },
        es: {
          question: "¿Cuántos participantes se permiten en cada prueba?",
          answer:
            "Trail Largo 30K: 100 participantes. Trail 24K: 100 participantes. Trail Corto 15K: 150 participantes.",
        },
        fr: {
          question:
            "Combien de participants sont autorisés dans chaque course ?",
          answer:
            "Trail Long 30 km : 100 participants. Trail 24 km : 100 participants. Trail Court 15 km : 150 participants.",
        },
        de: {
          question: "Wie viele Teilnehmer sind in jedem Rennen erlaubt?",
          answer:
            "Langstrecke 30 km: 100 Teilnehmer. Trail 24 km: 100 Teilnehmer. Kurzstrecke 15 km: 150 Teilnehmer.",
        },
        it: {
          question: "Quanti partecipanti sono ammessi in ogni gara?",
          answer:
            "Trail Lungo 30 km: 100 partecipanti. Trail 24 km: 100 partecipanti. Trail Corto 15 km: 150 partecipanti.",
        },
      },
    },
    {
      order: 4,
      question: "O que está incluído no kit do participante?",
      answer:
        "O kit inclui peitoral com chip de cronometragem, t-shirt técnica e outras lembranças. Também terás acesso a abastecimentos, duches, ATL para crianças e massagens gratuitas.",
      translations: {
        pt: {
          question: "O que está incluído no kit do participante?",
          answer:
            "O kit inclui peitoral com chip de cronometragem, t-shirt técnica e outras lembranças. Também terás acesso a abastecimentos, duches, ATL para crianças e massagens gratuitas.",
        },
        en: {
          question: "What's included in the participant kit?",
          answer:
            "The kit includes race bib with timing chip, technical t-shirt, and other gifts. You also have access to aid stations, showers, kids activities (ATL), and free massages.",
        },
        es: {
          question: "¿Qué incluye el kit del participante?",
          answer:
            "El kit incluye dorsal con chip de cronometraje, camiseta técnica y otros recuerdos. También tendrás acceso a avituallamientos, duchas, ATL para niños y masajes gratuitos.",
        },
        fr: {
          question: "Que comprend le kit du participant ?",
          answer:
            "Le kit comprend le dossard avec puce de chronométrage, un t-shirt technique et d'autres souvenirs. Vous avez également accès aux ravitaillements, douches, activités pour enfants (ATL) et massages gratuits.",
        },
        de: {
          question: "Was ist im Teilnehmerpaket enthalten?",
          answer:
            "Das Paket enthält Startnummer mit Timing-Chip, technisches T-Shirt und andere Geschenke. Sie haben auch Zugang zu Verpflegungspunkten, Duschen, Kinderbetreuung (ATL) und kostenlosen Massagen.",
        },
        it: {
          question: "Cosa è incluso nel kit del partecipante?",
          answer:
            "Il kit include pettorale con chip di cronometraggio, t-shirt tecnica e altri ricordi. Avrai anche accesso ai ristori, docce, attività per bambini (ATL) e massaggi gratuiti.",
        },
      },
    },
  ];

  for (const faqData of faqs) {
    const { translations: faqTranslations, ...faqInfo } = faqData;

    const faq = await prisma.eventFAQ.create({
      data: {
        ...faqInfo,
        eventId: event.id,
      },
    });

    // Create FAQ translations
    for (const [lang, trans] of Object.entries(faqTranslations)) {
      await prisma.eventFAQTranslation.create({
        data: {
          faqId: faq.id,
          language: lang as "pt" | "en" | "es" | "fr" | "de" | "it",
          question: trans.question,
          answer: trans.answer,
        },
      });
    }
  }

  console.log(`   ✅ Created ${faqs.length} FAQs with translations`);

  console.log("\n🎉 10.º Trail Rota dos Espigueiros 2026 seeded successfully!");
  console.log(`   📍 Event: ${event.title}`);
  console.log(`   🔗 Slug: ${event.slug}`);
  console.log(`   📅 Date: ${event.startDate.toISOString().split("T")[0]}`);
  console.log(`   📍 Location: ${event.city}, ${event.country}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding Trail Rota dos Espigueiros 2026:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
