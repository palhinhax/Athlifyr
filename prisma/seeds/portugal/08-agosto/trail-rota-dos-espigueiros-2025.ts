/**
 * Seed: Trail Rota dos Espigueiros 2025
 * Complete with translations in all 6 languages
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌾 Seeding Trail Rota dos Espigueiros 2025...");

  const eventSlug = "trail-rota-dos-espigueiros-2025";

  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "9.ª Edição – Trail Rota dos Espigueiros",
      description:
        "Evento de trail running organizado pela ARCAPA em Caparrosinha (Tondela), com Trail Longo 31K, Trail Curto 15K, Kids Trail e Caminhada 8K. Integra o Circuito Nacional de Trail Running (Trail, Sprint e Jovem).",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2025-08-03T07:30:00.000Z"),
      endDate: null,
      city: "Caparrosinha",
      country: "Portugal",
      latitude: 40.609163,
      longitude: -8.08066,
      googleMapsUrl: "https://maps.google.com/?q=40.609163,-8.08066",
      externalUrl: "https://www.rotadosespigueiros.pt/",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2025-07-26T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "9.ª Edição – Trail Rota dos Espigueiros",
      description:
        "Evento de trail running organizado pela ARCAPA em Caparrosinha (Tondela), com Trail Longo 31K, Trail Curto 15K, Kids Trail e Caminhada 8K. Integra o Circuito Nacional de Trail Running (Trail, Sprint e Jovem).",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2025-08-03T07:30:00.000Z"),
      endDate: null,
      city: "Caparrosinha",
      country: "Portugal",
      latitude: 40.609163,
      longitude: -8.08066,
      googleMapsUrl: "https://maps.google.com/?q=40.609163,-8.08066",
      externalUrl: "https://www.rotadosespigueiros.pt/",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2025-07-26T23:59:59.000Z"),
    },
  });

  console.log(`✅ Event upserted: ${event.slug} (ID: ${event.id})`);

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
      title: "9.ª Edição – Trail Rota dos Espigueiros",
      description: `# 🌾 Trail Rota dos Espigueiros 2025 (9.ª edição)

A **9.ª edição do Trail Rota dos Espigueiros** é um evento de Trail Running organizado pela **ARCAPA**, em **Caparrosinha (Tondela)**. A prova integra o Circuito Nacional de Trail Running (Circuito Trail, Circuito Sprint e Circuito Jovem) e inclui 3 provas competitivas e uma caminhada.

## 📅 Data e local

- **Data:** 03 de agosto de 2025
- **Local:** Parque Desportivo do Vale dos Mamoirais, Caparrosinha – Silvares, Tondela
- **Coordenadas:** 40.609163, -8.080660
- **Website:** https://www.rotadosespigueiros.pt/

## 🏃‍♀️ Provas e distâncias

- **Trail Longo (Trilho Palopina – 31K, 1100D+)**
- **Trail Curto (Trilho Coplusa – 15K, 550D+)**
- **Kids Trail (Trilho Casa de Saúde S. Mateus)**
- **Caminhada (Ibero-Segur – 8K)**

### Idades mínimas
- Trail Longo 31K: **18 anos**
- Trail Curto 15K: **16 anos**
- Kids Trail: **5 anos**

**Nota:** idade máxima de participação: **75 anos**.

## ⏱️ Horários principais (domingo, 03 de agosto)

- **07:30** – Trail Longo 31K
- **08:45** – Trail Curto 15K
- **09:00** – Kids Trail
- **09:30** – Caminhada 8K
- **12:00** – Previsão de cerimónia de prémios

## 🧭 Percurso

Percursos maioritariamente em caminhos, trilhos, levadas e estrada florestal, com pequenas extensões de asfalto. Há passagens técnicas e atravessamentos de vias públicas — é obrigatório cumprir o código da estrada e seguir a sinalização.

## ⛑️ Segurança e controlo

- **Postos de controlo obrigatórios** (falha implica desclassificação).
- **Barreiras temporais:**
  - Trail Longo: **5h15**
  - Trail Curto: **3h30**
- Material obrigatório: **telemóvel**.
- Material recomendado: **reservatório de água, porta-resíduos, apito, manta térmica e alimentação**.

## 📝 Inscrições

- **Abertura:** 03 de maio de 2025
- **Limite:** 26 de julho de 2025

### Valores (fase II – 01 a 27 de julho)
- Kids Trail: **gratuito**
- Caminhada 8K: **8€**
- Trail Curto 15K: **16€**
- Trail Longo 31K: **19€**
- Almoço (opcional): **7€**

## 🎁 Kit e serviços

- Peitoral
- T-shirt técnica
- Outras lembranças
- Abastecimentos em prova e na meta
- Duches
- ATL para crianças
- Massagens gratuitas

## 👥 Organização e contactos

- **Organização:** ARCAPA
- **Email:** rotadosespigueiros@gmail.com
- **Website:** https://www.rotadosespigueiros.pt/`,
      city: "Caparrosinha",
      metaTitle: "Trail Rota dos Espigueiros 2025 | Trail Running em Tondela",
      metaDescription:
        "9.ª edição do Trail Rota dos Espigueiros em Caparrosinha (Tondela) a 3 de agosto de 2025. Trail Longo 31K, Trail Curto 15K, Kids Trail e Caminhada 8K. Circuito Nacional de Trail Running.",
    },
    {
      language: "en",
      title: "9th Edition – Trail Rota dos Espigueiros",
      description: `# 🌾 Trail Rota dos Espigueiros 2025 (9th edition)

The **Trail Rota dos Espigueiros** is a trail running event organized by **ARCAPA** in **Caparrosinha (Tondela)**. It is part of Portugal's National Trail Running Circuit (Trail, Sprint, and Youth) and features three races plus a walk.

## 📅 Date & location

- **Date:** August 3, 2025
- **Location:** Vale dos Mamoirais Sports Park, Caparrosinha – Silvares, Tondela
- **Coordinates:** 40.609163, -8.080660
- **Website:** https://www.rotadosespigueiros.pt/

## 🏃‍♀️ Races & distances

- **Long Trail (Trilho Palopina – 31K, 1100D+)**
- **Short Trail (Trilho Coplusa – 15K, 550D+)**
- **Kids Trail (Trilho Casa de Saúde S. Mateus)**
- **Walk (Ibero-Segur – 8K)**

### Minimum ages
- Long Trail 31K: **18 years**
- Short Trail 15K: **16 years**
- Kids Trail: **5 years**

**Note:** maximum age is **75 years**.

## ⏱️ Key schedule (Sunday, August 3)

- **07:30** – Long Trail 31K
- **08:45** – Short Trail 15K
- **09:00** – Kids Trail
- **09:30** – Walk 8K
- **12:00** – Awards ceremony (expected)

## 🧭 Course overview

Routes follow trails, irrigation channels, forest roads, and short asphalt sections. There are technical sections and road crossings — participants must follow signage and traffic rules.

## ⛑️ Safety & controls

- **Mandatory checkpoints** (missing one leads to disqualification).
- **Time limits:**
  - Long Trail: **5h15**
  - Short Trail: **3h30**
- Mandatory gear: **mobile phone**.
- Recommended: **hydration, waste bag, whistle, thermal blanket, food**.

## 📝 Registration

- **Opening:** May 3, 2025
- **Deadline:** July 26, 2025

### Prices (Phase II – July 1 to July 27)
- Kids Trail: **free**
- Walk 8K: **€8**
- Short Trail 15K: **€16**
- Long Trail 31K: **€19**
- Optional lunch: **€7**

## 🎁 Kit & services

- Race bib
- Technical T-shirt
- Gifts and finisher items
- Aid stations on course and finish
- Showers
- Kids activities (ATL)
- Free massages

## 👥 Organizer & contacts

- **Organizer:** ARCAPA
- **Email:** rotadosespigueiros@gmail.com
- **Website:** https://www.rotadosespigueiros.pt/`,
      city: "Caparrosinha",
      metaTitle: "Trail Rota dos Espigueiros 2025 | Trail Running in Tondela",
      metaDescription:
        "Trail Rota dos Espigueiros 2025 in Caparrosinha (Tondela) on August 3. Long Trail 31K, Short Trail 15K, Kids Trail, and 8K walk. Part of the National Trail Running Circuit.",
    },
    {
      language: "es",
      title: "9.ª Edición – Trail Rota dos Espigueiros",
      description: `# 🌾 Trail Rota dos Espigueiros 2025 (9.ª edición)

El **Trail Rota dos Espigueiros** es un evento de trail running organizado por **ARCAPA** en **Caparrosinha (Tondela)**. Forma parte del Circuito Nacional de Trail Running de Portugal (Trail, Sprint y Jovem) e incluye tres pruebas y una caminata.

## 📅 Fecha y lugar

- **Fecha:** 3 de agosto de 2025
- **Lugar:** Parque Deportivo Vale dos Mamoirais, Caparrosinha – Silvares, Tondela
- **Coordenadas:** 40.609163, -8.080660
- **Web:** https://www.rotadosespigueiros.pt/

## 🏃‍♀️ Pruebas y distancias

- **Trail Largo (Trilho Palopina – 31K, 1100D+)**
- **Trail Corto (Trilho Coplusa – 15K, 550D+)**
- **Kids Trail (Trilho Casa de Saúde S. Mateus)**
- **Caminata (Ibero-Segur – 8K)**

### Edades mínimas
- Trail Largo 31K: **18 años**
- Trail Corto 15K: **16 años**
- Kids Trail: **5 años**

**Nota:** edad máxima de participación **75 años**.

## ⏱️ Horario principal (domingo, 3 de agosto)

- **07:30** – Trail Largo 31K
- **08:45** – Trail Corto 15K
- **09:00** – Kids Trail
- **09:30** – Caminata 8K
- **12:00** – Ceremonia de premios (prevista)

## 🧭 Recorrido

Predominan senderos, levadas, pistas forestales y tramos cortos de asfalto. Hay pasos técnicos y cruces de carretera — se debe respetar la señalización y las normas de tráfico.

## ⛑️ Seguridad y control

- **Puntos de control obligatorios** (la falta implica descalificación).
- **Límites de tiempo:**
  - Trail Largo: **5h15**
  - Trail Corto: **3h30**
- Material obligatorio: **teléfono móvil**.
- Recomendado: **hidratación, bolsa de residuos, silbato, manta térmica, comida**.

## 📝 Inscripciones

- **Apertura:** 3 de mayo de 2025
- **Límite:** 26 de julio de 2025

### Tarifas (Fase II – del 1 al 27 de julio)
- Kids Trail: **gratuito**
- Caminata 8K: **8€**
- Trail Corto 15K: **16€**
- Trail Largo 31K: **19€**
- Almuerzo opcional: **7€**

## 🎁 Kit y servicios

- Dorsal
- Camiseta técnica
- Recuerdos
- Avituallamientos en carrera y meta
- Duchas
- ATL para niños
- Masajes gratuitos

## 👥 Organización y contactos

- **Organización:** ARCAPA
- **Email:** rotadosespigueiros@gmail.com
- **Web:** https://www.rotadosespigueiros.pt/`,
      city: "Caparrosinha",
      metaTitle: "Trail Rota dos Espigueiros 2025 | Trail Running en Tondela",
      metaDescription:
        "Trail Rota dos Espigueiros 2025 en Caparrosinha (Tondela) el 3 de agosto. Trail Largo 31K, Trail Corto 15K, Kids Trail y caminata 8K. Circuito Nacional de Trail Running.",
    },
    {
      language: "fr",
      title: "9e Édition – Trail Rota dos Espigueiros",
      description: `# 🌾 Trail Rota dos Espigueiros 2025 (9e édition)

Le **Trail Rota dos Espigueiros** est un événement de trail running organisé par **ARCAPA** à **Caparrosinha (Tondela)**. Il fait partie du Circuit National de Trail Running (Trail, Sprint et Jeunes) et propose trois courses et une marche.

## 📅 Date et lieu

- **Date :** 3 août 2025
- **Lieu :** Parc sportif de Vale dos Mamoirais, Caparrosinha – Silvares, Tondela
- **Coordonnées :** 40.609163, -8.080660
- **Site :** https://www.rotadosespigueiros.pt/

## 🏃‍♀️ Courses et distances

- **Trail Long (Trilho Palopina – 31 km, 1100D+)**
- **Trail Court (Trilho Coplusa – 15 km, 550D+)**
- **Kids Trail (Trilho Casa de Saúde S. Mateus)**
- **Marche (Ibero-Segur – 8 km)**

### Âges minimum
- Trail Long 31 km : **18 ans**
- Trail Court 15 km : **16 ans**
- Kids Trail : **5 ans**

**Note :** âge maximum **75 ans**.

## ⏱️ Horaires principaux (dimanche 3 août)

- **07:30** – Trail Long 31 km
- **08:45** – Trail Court 15 km
- **09:00** – Kids Trail
- **09:30** – Marche 8 km
- **12:00** – Cérémonie des prix (prévue)

## 🧭 Parcours

Les parcours empruntent des sentiers, levadas, pistes forestières et de courts passages sur route. Des sections techniques et des traversées de routes exigent le respect du balisage et du code de la route.

## ⛑️ Sécurité et contrôles

- **Postes de contrôle obligatoires** (manquer un poste = disqualification).
- **Barrières horaires :**
  - Trail Long : **5h15**
  - Trail Court : **3h30**
- Matériel obligatoire : **téléphone portable**.
- Recommandé : **hydratation, sac à déchets, sifflet, couverture thermique, nourriture**.

## 📝 Inscriptions

- **Ouverture :** 3 mai 2025
- **Clôture :** 26 juillet 2025

### Tarifs (Phase II – du 1 au 27 juillet)
- Kids Trail : **gratuit**
- Marche 8 km : **8€**
- Trail Court 15 km : **16€**
- Trail Long 31 km : **19€**
- Déjeuner optionnel : **7€**

## 🎁 Kit et services

- Dossard
- T-shirt technique
- Souvenirs
- Ravitaillements en course et à l'arrivée
- Douches
- Activités enfants (ATL)
- Massages gratuits

## 👥 Organisation et contacts

- **Organisation :** ARCAPA
- **Email :** rotadosespigueiros@gmail.com
- **Site :** https://www.rotadosespigueiros.pt/`,
      city: "Caparrosinha",
      metaTitle: "Trail Rota dos Espigueiros 2025 | Trail Running à Tondela",
      metaDescription:
        "Trail Rota dos Espigueiros 2025 à Caparrosinha (Tondela) le 3 août. Trail Long 31 km, Trail Court 15 km, Kids Trail et marche 8 km. Circuit National de Trail Running.",
    },
    {
      language: "de",
      title: "9. Ausgabe – Trail Rota dos Espigueiros",
      description: `# 🌾 Trail Rota dos Espigueiros 2025 (9. Ausgabe)

Der **Trail Rota dos Espigueiros** ist ein Trailrunning-Event der **ARCAPA** in **Caparrosinha (Tondela)**. Er gehört zum portugiesischen Nationalen Trailrunning-Zirkus (Trail, Sprint und Jugend) und bietet drei Rennen sowie einen Walk.

## 📅 Datum & Ort

- **Datum:** 3. August 2025
- **Ort:** Sportpark Vale dos Mamoirais, Caparrosinha – Silvares, Tondela
- **Koordinaten:** 40.609163, -8.080660
- **Website:** https://www.rotadosespigueiros.pt/

## 🏃‍♀️ Rennen & Distanzen

- **Langstrecke (Trilho Palopina – 31 km, 1100D+)**
- **Kurzstrecke (Trilho Coplusa – 15 km, 550D+)**
- **Kids Trail (Trilho Casa de Saúde S. Mateus)**
- **Wanderung (Ibero-Segur – 8 km)**

### Mindestalter
- Langstrecke 31 km: **18 Jahre**
- Kurzstrecke 15 km: **16 Jahre**
- Kids Trail: **5 Jahre**

**Hinweis:** Maximalalter **75 Jahre**.

## ⏱️ Zeitplan (Sonntag, 3. August)

- **07:30** – Langstrecke 31 km
- **08:45** – Kurzstrecke 15 km
- **09:00** – Kids Trail
- **09:30** – Wanderung 8 km
- **12:00** – Siegerehrung (geplant)

## 🧭 Strecke

Die Strecke verläuft überwiegend auf Trails, Bewässerungskanälen, Forstwegen und kurzen Asphaltpassagen. Es gibt technische Abschnitte und Straßenquerungen — Markierungen und Verkehrsregeln sind einzuhalten.

## ⛑️ Sicherheit & Kontrolle

- **Pflicht-Kontrollpunkte** (fehlender Punkt = Disqualifikation).
- **Zeitlimits:**
  - Langstrecke: **5h15**
  - Kurzstrecke: **3h30**
- Pflichtmaterial: **Mobiltelefon**.
- Empfohlen: **Getränkebehälter, Müllbeutel, Pfeife, Rettungsdecke, Verpflegung**.

## 📝 Anmeldung

- **Start:** 3. Mai 2025
- **Ende:** 26. Juli 2025

### Preise (Phase II – 1. bis 27. Juli)
- Kids Trail: **kostenlos**
- Wanderung 8 km: **8€**
- Kurzstrecke 15 km: **16€**
- Langstrecke 31 km: **19€**
- Optionales Mittagessen: **7€**

## 🎁 Kit & Services

- Startnummer
- Technisches T-Shirt
- Andenken
- Verpflegungspunkte
- Duschen
- Kinderbetreuung (ATL)
- Kostenlose Massagen

## 👥 Organisation & Kontakte

- **Organisation:** ARCAPA
- **E-Mail:** rotadosespigueiros@gmail.com
- **Website:** https://www.rotadosespigueiros.pt/`,
      city: "Caparrosinha",
      metaTitle: "Trail Rota dos Espigueiros 2025 | Trailrunning in Tondela",
      metaDescription:
        "Trail Rota dos Espigueiros 2025 in Caparrosinha (Tondela) am 3. August. Langstrecke 31 km, Kurzstrecke 15 km, Kids Trail und 8-km-Walk. Teil des Nationalen Trailrunning-Zirkus.",
    },
    {
      language: "it",
      title: "9ª Edizione – Trail Rota dos Espigueiros",
      description: `# 🌾 Trail Rota dos Espigueiros 2025 (9ª edizione)

Il **Trail Rota dos Espigueiros** è un evento di trail running organizzato da **ARCAPA** a **Caparrosinha (Tondela)**. Fa parte del Circuito Nazionale di Trail Running (Trail, Sprint e Giovani) e comprende tre gare e una camminata.

## 📅 Data e luogo

- **Data:** 3 agosto 2025
- **Luogo:** Parco sportivo Vale dos Mamoirais, Caparrosinha – Silvares, Tondela
- **Coordinate:** 40.609163, -8.080660
- **Sito:** https://www.rotadosespigueiros.pt/

## 🏃‍♀️ Gare e distanze

- **Trail Lungo (Trilho Palopina – 31 km, 1100D+)**
- **Trail Corto (Trilho Coplusa – 15 km, 550D+)**
- **Kids Trail (Trilho Casa de Saúde S. Mateus)**
- **Camminata (Ibero-Segur – 8 km)**

### Età minima
- Trail Lungo 31 km: **18 anni**
- Trail Corto 15 km: **16 anni**
- Kids Trail: **5 anni**

**Nota:** età massima **75 anni**.

## ⏱️ Programma (domenica 3 agosto)

- **07:30** – Trail Lungo 31 km
- **08:45** – Trail Corto 15 km
- **09:00** – Kids Trail
- **09:30** – Camminata 8 km
- **12:00** – Cerimonia di premiazione (prevista)

## 🧭 Percorso

Percorsi su sentieri, levadas, strade forestali e brevi tratti di asfalto. Sono presenti sezioni tecniche e attraversamenti stradali — è obbligatorio seguire la segnaletica e il codice della strada.

## ⛑️ Sicurezza e controlli

- **Punti di controllo obbligatori** (mancanza = squalifica).
- **Limiti di tempo:**
  - Trail Lungo: **5h15**
  - Trail Corto: **3h30**
- Materiale obbligatorio: **telefono cellulare**.
- Consigliato: **idratazione, sacchetto rifiuti, fischietto, coperta termica, alimentazione**.

## 📝 Iscrizioni

- **Apertura:** 3 maggio 2025
- **Scadenza:** 26 luglio 2025

### Prezzi (Fase II – 1-27 luglio)
- Kids Trail: **gratuito**
- Camminata 8 km: **8€**
- Trail Corto 15 km: **16€**
- Trail Lungo 31 km: **19€**
- Pranzo opzionale: **7€**

## 🎁 Kit e servizi

- Pettorale
- T-shirt tecnica
- Ricordi
- Ristori in gara e all'arrivo
- Docce
- Attività per bambini (ATL)
- Massaggi gratuiti

## 👥 Organizzazione e contatti

- **Organizzazione:** ARCAPA
- **Email:** rotadosespigueiros@gmail.com
- **Sito:** https://www.rotadosespigueiros.pt/`,
      city: "Caparrosinha",
      metaTitle: "Trail Rota dos Espigueiros 2025 | Trail Running a Tondela",
      metaDescription:
        "Trail Rota dos Espigueiros 2025 a Caparrosinha (Tondela) il 3 agosto. Trail Lungo 31 km, Trail Corto 15 km, Kids Trail e camminata 8 km. Circuito Nazionale di Trail Running.",
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

  const variants = [
    {
      name: "Trail Longo 31K",
      distanceKm: 31,
      price: 19.0,
      startTime: "07:30",
    },
    {
      name: "Trail Curto 15K",
      distanceKm: 15,
      price: 16.0,
      startTime: "08:45",
    },
    {
      name: "Kids Trail",
      distanceKm: 1,
      price: 0.0,
      startTime: "09:00",
    },
    {
      name: "Caminhada 8K",
      distanceKm: 8,
      price: 8.0,
      startTime: "09:30",
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
    }

    console.log(`✅ Variant upserted: ${variantData.name}`);
  }

  console.log("\n🎉 Trail Rota dos Espigueiros 2025 seeded successfully!");
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
