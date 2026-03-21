/**
 * Seed: Aleluias Trail 2026
 *
 * Event: Trail running and walking in Terrugem, Elvas, Portalegre
 * Location: Parque de Festas da Terrugem, Elvas
 * Date: April 4, 2026
 * Organizer: JDT – Juventude Desportiva da Terrugem & CDCPT – Clube Desportivo de Caça e Pesca da Terrugem
 * Sport: Trail, Walking
 * Association: Associação de Atletismo do Distrito de Portalegre (AADP)
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🐣 Seeding Aleluias Trail 2026...");

  // ──────────────────────────────────────────────
  // 1. Upsert Event
  // ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: "aleluias-trail-2026" },
    update: {
      title: "Aleluias Trail 2026",
      description:
        "Aleluias Trail 2026 - Trail e caminhada na Terrugem, Elvas, em dia de Aleluias",
      sportTypes: [SportType.TRAIL, SportType.WALKING],
      startDate: new Date("2026-04-04T09:00:00Z"),
      endDate: new Date("2026-04-04T14:00:00Z"),
      registrationDeadline: new Date("2026-03-30T23:59:00Z"),
      externalUrl: "https://www.acorrer.pt",
      imageUrl: "",
      city: "Elvas",
      country: "Portugal",
      latitude: 38.885,
      longitude: -7.153,
      googleMapsUrl: "https://maps.google.com/?q=38.885,-7.153",
      isFeatured: false,
      cancelled: false,
    },
    create: {
      title: "Aleluias Trail 2026",
      slug: "aleluias-trail-2026",
      description:
        "Aleluias Trail 2026 - Trail e caminhada na Terrugem, Elvas, em dia de Aleluias",
      sportTypes: [SportType.TRAIL, SportType.WALKING],
      startDate: new Date("2026-04-04T09:00:00Z"),
      endDate: new Date("2026-04-04T14:00:00Z"),
      registrationDeadline: new Date("2026-03-30T23:59:00Z"),
      externalUrl: "https://www.acorrer.pt",
      imageUrl: "",
      city: "Elvas",
      country: "Portugal",
      latitude: 38.885,
      longitude: -7.153,
      googleMapsUrl: "https://maps.google.com/?q=38.885,-7.153",
      isFeatured: false,
      cancelled: false,
    },
  });

  console.log(`✅ Event upserted: ${event.slug}`);

  // ──────────────────────────────────────────────
  // 2. Translations (ALL 6 languages)
  // ──────────────────────────────────────────────
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
      title: "Aleluias Trail 2026",
      description: `# 🐣 Aleluias Trail 2026

**O Aleluias Trail realiza-se a 4 de abril de 2026, no Parque de Festas da Terrugem, Elvas!** Organização da **JDT – Juventude Desportiva da Terrugem** e do **CDCPT – Clube Desportivo de Caça e Pesca da Terrugem**. Parecer técnico da **Associação de Atletismo do Distrito de Portalegre (AADP)**.

No dia de Aleluias — uma das tradições mais marcantes da Terrugem — os trilhos substituem as ruas, mas o espírito é o mesmo: convívio, superação, partilha e orgulho na terra. Correr ou caminhar no Aleluias Trail é fazer parte de um dia que une tradição, natureza e comunidade.

---

## 🏃 Provas

- **Trail 21 km** – Partida 09:00 · ~800m D+ · Competitivo · Idade mín. 18 anos · Cutoff 4h · Máx. 60 vagas
- **Mini Trail 12 km** – Partida 09:15 · ~300m D+ · Competitivo · Idade mín. 16 anos · Máx. 120 vagas
- **Caminhada 10 km** – Partida 09:20 · ~150m D+ · Não competitiva · Máx. 120 vagas

---

## ⏰ Horário

**3 de Abril:**
- 18:00 – 20:00 — Levantamento de dorsais (Pavilhão Multiusos da Terrugem)

**4 de Abril:**
- 07:00 – 08:30 — Levantamento de dorsais (Pavilhão Multiusos da Terrugem)
- 08:45 — Controlo zero no Parque de Festas da Terrugem
- 09:00 — Partida Trail 21km
- 09:15 — Partida Mini Trail 12km
- 09:20 — Início Caminhada 10km
- 13:30 — Entrega de prémios
- 14:00 — Encerramento

---

## 🎽 A inscrição inclui

- Dorsal (exceto caminhada)
- Seguro de acidentes pessoais
- Abastecimentos (Trail 21km: 2 · Mini Trail/Caminhada: 1)
- Medalha Finisher
- T-shirt técnica alusiva ao evento
- 1× Senha de bebida (cerveja ou sumo)
- 1× Senha para bifana
- 1× Senha para sopa (caldo verde)
- Duches (Piscinas Municipais, Campo de Jogos e Polidesportivo da Terrugem)
- Outros brindes diversos

---

## 🧰 Material obrigatório

| Material | Caminhada 10K | Mini Trail 12K | Trail 21K |
|---|---|---|---|
| Telemóvel operacional | ✔ | ✔ | ✔ |
| Copo / reservatório líquidos | ✔ | ✔ | ✔ |
| Apito | – | ✔ | ✔ |
| Manta térmica | – | ✔ | ✔ |

---

## 🏆 Prémios

**Trail 21km e Mini Trail 12km:** Troféu para os 3 primeiros classificados geral M/F. Medalha de classificação para os 3 primeiros M/F de cada escalão: SUB23 (16–22), SEM (23–34), M/F35, M/F40, M/F45, M/F50, M/F55, M/F60, M/F65, M/F70+. Troféu para a equipa mais numerosa. Medalha Finisher para todos.

---

## 📋 Inscrições

Inscrições na plataforma **acorrer.pt**, limitadas a **300 participantes** no total. Encerram a 30 de março de 2026. Não há inscrições no dia da prova. Não há devolução do valor de inscrição.

---

## 📞 Contactos

Organização: JDT – Juventude Desportiva da Terrugem & CDCPT – Clube Desportivo de Caça e Pesca da Terrugem
Telemóveis: 964 472 877 | 969 119 115
Email: aleluiastrail@gmail.com

🐣 **Vem celebrar as Aleluias nos trilhos da Terrugem!** 🏃`,
      city: "Terrugem, Elvas",
      metaTitle: "Aleluias Trail 2026 | Terrugem, Elvas | 4 Abril",
      metaDescription:
        "Aleluias Trail a 4 de abril de 2026 na Terrugem, Elvas. Trail 21km, Mini Trail 12km e Caminhada 10km. Organização JDT e CDCPT. Parecer AADP.",
    },
    en: {
      title: "Aleluias Trail 2026",
      description: `# 🐣 Aleluias Trail 2026

**The Aleluias Trail takes place on April 4, 2026 at Parque de Festas da Terrugem, Elvas!** Organized by **JDT – Juventude Desportiva da Terrugem** and **CDCPT – Clube Desportivo de Caça e Pesca da Terrugem**. Technical approval by the **Portalegre District Athletics Association (AADP)**.

On Aleluias day — one of Terrugem's most distinctive traditions — the trails replace the streets, but the spirit remains the same: togetherness, resilience, sharing and pride in the land. Running or walking in the Aleluias Trail means being part of a day that unites tradition, nature and community.

---

## 🏃 Races

- **Trail 21 km** – Start 09:00 · ~800m D+ · Competitive · Min. age 18 · Cutoff 4h · Max. 60 spots
- **Mini Trail 12 km** – Start 09:15 · ~300m D+ · Competitive · Min. age 16 · Max. 120 spots
- **Walk 10 km** – Start 09:20 · ~150m D+ · Non-competitive · Max. 120 spots

---

## ⏰ Schedule

**April 3:**
- 18:00 – 20:00 — Bib pickup (Pavilhão Multiusos da Terrugem)

**April 4:**
- 07:00 – 08:30 — Bib pickup (Pavilhão Multiusos da Terrugem)
- 08:45 — Zero control at Parque de Festas da Terrugem
- 09:00 — Trail 21km start
- 09:15 — Mini Trail 12km start
- 09:20 — Walk 10km start
- 13:30 — Prize ceremony
- 14:00 — Closing

---

## 🎽 Registration includes

- Bib number (except walk)
- Personal accident insurance
- Aid stations (Trail 21km: 2 · Mini Trail/Walk: 1)
- Finisher medal
- Technical t-shirt
- 1× Drink ticket (beer or juice)
- 1× Bifana (pork sandwich) ticket
- 1× Soup (caldo verde) ticket
- Showers available
- Other gifts

---

## 🏆 Prizes

**Trail 21km and Mini Trail 12km:** Trophy for top 3 overall M/F. Classification medal for top 3 M/F per age group: SUB23 (16–22), SEM (23–34), M/F35, M/F40, M/F45, M/F50, M/F55, M/F60, M/F65, M/F70+. Trophy for largest team. Finisher medal for all.

---

## 📍 Limited to 300 participants · No race-day registrations

🐣 **Come celebrate Aleluias on the trails of Terrugem!** 🏃`,
      city: "Terrugem, Elvas",
      metaTitle: "Aleluias Trail 2026 | Terrugem, Elvas | April 4",
      metaDescription:
        "Aleluias Trail on April 4, 2026 in Terrugem, Elvas. Trail 21km, Mini Trail 12km and Walk 10km. Organized by JDT and CDCPT. AADP approved.",
    },
    es: {
      title: "Aleluias Trail 2026",
      description: `# 🐣 Aleluias Trail 2026

**El Aleluias Trail se celebra el 4 de abril de 2026 en el Parque de Festas da Terrugem, Elvas.** Organizado por **JDT – Juventude Desportiva da Terrugem** y **CDCPT – Clube Desportivo de Caça e Pesca da Terrugem**. Con el visto bueno de la **Asociación de Atletismo del Distrito de Portalegre (AADP)**.

En el día de Aleluias — una de las tradiciones más emblemáticas de Terrugem — los senderos sustituyen a las calles, pero el espíritu es el mismo: convivencia, superación, tradición y orgullo por la tierra.

---

## 🏃 Pruebas

- **Trail 21 km** – Salida 09:00 · ~800m D+ · Competitivo · Edad mín. 18 años · Límite 4h · Máx. 60 plazas
- **Mini Trail 12 km** – Salida 09:15 · ~300m D+ · Competitivo · Edad mín. 16 años · Máx. 120 plazas
- **Caminata 10 km** – Salida 09:20 · ~150m D+ · No competitiva · Máx. 120 plazas

---

## ⏰ Horario

**3 de Abril:**
- 18:00 – 20:00 — Recogida de dorsales (Pavilhão Multiusos da Terrugem)

**4 de Abril:**
- 07:00 – 08:30 — Recogida de dorsales
- 08:45 — Control cero en el Parque de Festas da Terrugem
- 09:00 — Salida Trail 21km
- 09:15 — Salida Mini Trail 12km
- 09:20 — Inicio Caminata 10km
- 13:30 — Entrega de premios
- 14:00 — Cierre

---

## 🎽 La inscripción incluye

- Dorsal (excepto caminata), seguro de accidentes, avituallamientos
- Medalla Finisher, camiseta técnica
- 1× bebida, 1× bifana, 1× sopa (caldo verde)
- Duchas y otros obsequios

---

## 🏆 Premios

**Trail 21km y Mini Trail 12km:** Trofeo para los 3 primeros general M/F. Medalla por categoría. Trofeo equipo más numeroso. Medalla Finisher para todos.

---

## 📍 Limitada a 300 participantes · Sin inscripciones el día de la prueba

🐣 **¡Ven a celebrar las Aleluias en los senderos de Terrugem!** 🏃`,
      city: "Terrugem, Elvas",
      metaTitle: "Aleluias Trail 2026 | Terrugem, Elvas | 4 Abril",
      metaDescription:
        "Aleluias Trail el 4 de abril de 2026 en Terrugem, Elvas. Trail 21km, Mini Trail 12km y Caminata 10km. Organización JDT y CDCPT. AADP.",
    },
    fr: {
      title: "Aleluias Trail 2026",
      description: `# 🐣 Aleluias Trail 2026

**L'Aleluias Trail a lieu le 4 avril 2026 au Parque de Festas da Terrugem, Elvas !** Organisé par la **JDT – Juventude Desportiva da Terrugem** et le **CDCPT – Clube Desportivo de Caça e Pesca da Terrugem**. Avis technique de l'**Association d'Athlétisme du District de Portalegre (AADP)**.

Le jour des Aleluias — l'une des traditions les plus emblématiques de Terrugem — les sentiers remplacent les rues, mais l'esprit reste le même : convivialité, dépassement, partage et fierté du territoire.

---

## 🏃 Épreuves

- **Trail 21 km** – Départ 09h00 · ~800m D+ · Compétitif · Âge min. 18 ans · Limite 4h · Max. 60 places
- **Mini Trail 12 km** – Départ 09h15 · ~300m D+ · Compétitif · Âge min. 16 ans · Max. 120 places
- **Randonnée 10 km** – Départ 09h20 · ~150m D+ · Non compétitive · Max. 120 places

---

## ⏰ Programme

**3 Avril :**
- 18h00 – 20h00 — Retrait des dossards (Pavilhão Multiusos da Terrugem)

**4 Avril :**
- 07h00 – 08h30 — Retrait des dossards
- 08h45 — Contrôle zéro au Parque de Festas da Terrugem
- 09h00 — Départ Trail 21km
- 09h15 — Départ Mini Trail 12km
- 09h20 — Départ Randonnée 10km
- 13h30 — Remise des prix
- 14h00 — Clôture

---

## 🎽 L'inscription comprend

- Dossard (sauf randonnée), assurance accidents, ravitaillements
- Médaille Finisher, t-shirt technique
- 1× boisson, 1× bifana, 1× soupe (caldo verde)
- Douches et autres cadeaux

---

## 🏆 Prix

**Trail 21km et Mini Trail 12km :** Trophée aux 3 premiers général H/F. Médaille par catégorie. Trophée équipe la plus nombreuse. Médaille Finisher pour tous.

---

## 📍 Limitée à 300 participants · Pas d'inscriptions le jour de la course

🐣 **Venez célébrer les Aleluias sur les sentiers de Terrugem !** 🏃`,
      city: "Terrugem, Elvas",
      metaTitle: "Aleluias Trail 2026 | Terrugem, Elvas | 4 Avril",
      metaDescription:
        "Aleluias Trail le 4 avril 2026 à Terrugem, Elvas. Trail 21km, Mini Trail 12km et Randonnée 10km. Organisation JDT et CDCPT. AADP.",
    },
    de: {
      title: "Aleluias Trail 2026",
      description: `# 🐣 Aleluias Trail 2026

**Der Aleluias Trail findet am 4. April 2026 im Parque de Festas da Terrugem, Elvas statt!** Organisiert von **JDT – Juventude Desportiva da Terrugem** und **CDCPT – Clube Desportivo de Caça e Pesca da Terrugem**. Technische Genehmigung des **Leichtathletikverbands des Bezirks Portalegre (AADP)**.

Am Tag der Aleluias — einer der markantesten Traditionen von Terrugem — ersetzen die Trails die Straßen, aber der Geist bleibt derselbe: Gemeinschaft, Überwindung, Teilen und Stolz auf die Heimat.

---

## 🏃 Rennen

- **Trail 21 km** – Start 09:00 · ~800m D+ · Wettkampf · Mindestalter 18 · Limit 4h · Max. 60 Plätze
- **Mini Trail 12 km** – Start 09:15 · ~300m D+ · Wettkampf · Mindestalter 16 · Max. 120 Plätze
- **Wanderung 10 km** – Start 09:20 · ~150m D+ · Nicht-kompetitiv · Max. 120 Plätze

---

## ⏰ Zeitplan

**3. April:**
- 18:00 – 20:00 — Startnummernausgabe (Pavilhão Multiusos da Terrugem)

**4. April:**
- 07:00 – 08:30 — Startnummernausgabe
- 08:45 — Nullkontrolle am Parque de Festas da Terrugem
- 09:00 — Start Trail 21km
- 09:15 — Start Mini Trail 12km
- 09:20 — Start Wanderung 10km
- 13:30 — Siegerehrung
- 14:00 — Abschluss

---

## 🎽 Anmeldung beinhaltet

- Startnummer (außer Wanderung), Unfallversicherung, Verpflegungsstationen
- Finisher-Medaille, technisches T-Shirt
- 1× Getränk, 1× Bifana, 1× Suppe (Caldo Verde)
- Duschen und weitere Geschenke

---

## 🏆 Preise

**Trail 21km und Mini Trail 12km:** Pokal für Top 3 Gesamt M/W. Medaille pro Altersklasse. Pokal für das größte Team. Finisher-Medaille für alle.

---

## 📍 Begrenzt auf 300 Teilnehmer · Keine Anmeldung am Veranstaltungstag

🐣 **Komm und feiere die Aleluias auf den Trails von Terrugem!** 🏃`,
      city: "Terrugem, Elvas",
      metaTitle: "Aleluias Trail 2026 | Terrugem, Elvas | 4. April",
      metaDescription:
        "Aleluias Trail am 4. April 2026 in Terrugem, Elvas. Trail 21km, Mini Trail 12km und Wanderung 10km. Organisation JDT und CDCPT. AADP.",
    },
    it: {
      title: "Aleluias Trail 2026",
      description: `# 🐣 Aleluias Trail 2026

**L'Aleluias Trail si svolge il 4 aprile 2026 al Parque de Festas da Terrugem, Elvas!** Organizzato da **JDT – Juventude Desportiva da Terrugem** e **CDCPT – Clube Desportivo de Caça e Pesca da Terrugem**. Parere tecnico dell'**Associazione di Atletica del Distretto di Portalegre (AADP)**.

Nel giorno delle Aleluias — una delle tradizioni più emblematiche di Terrugem — i sentieri sostituiscono le strade, ma lo spirito resta lo stesso: convivialità, superamento, condivisione e orgoglio per la terra.

---

## 🏃 Gare

- **Trail 21 km** – Partenza 09:00 · ~800m D+ · Competitivo · Età min. 18 anni · Limite 4h · Max. 60 posti
- **Mini Trail 12 km** – Partenza 09:15 · ~300m D+ · Competitivo · Età min. 16 anni · Max. 120 posti
- **Camminata 10 km** – Partenza 09:20 · ~150m D+ · Non competitiva · Max. 120 posti

---

## ⏰ Programma

**3 Aprile:**
- 18:00 – 20:00 — Ritiro pettorali (Pavilhão Multiusos da Terrugem)

**4 Aprile:**
- 07:00 – 08:30 — Ritiro pettorali
- 08:45 — Controllo zero al Parque de Festas da Terrugem
- 09:00 — Partenza Trail 21km
- 09:15 — Partenza Mini Trail 12km
- 09:20 — Inizio Camminata 10km
- 13:30 — Premiazione
- 14:00 — Chiusura

---

## 🎽 L'iscrizione include

- Pettorale (eccetto camminata), assicurazione infortuni, rifornimenti
- Medaglia Finisher, t-shirt tecnica
- 1× bevanda, 1× bifana, 1× zuppa (caldo verde)
- Docce e altri omaggi

---

## 🏆 Premi

**Trail 21km e Mini Trail 12km:** Trofeo ai 3 primi generale M/F. Medaglia per fascia d'età. Trofeo squadra più numerosa. Medaglia Finisher per tutti.

---

## 📍 Limitata a 300 partecipanti · Nessuna iscrizione il giorno della gara

🐣 **Vieni a celebrare le Aleluias sui sentieri di Terrugem!** 🏃`,
      city: "Terrugem, Elvas",
      metaTitle: "Aleluias Trail 2026 | Terrugem, Elvas | 4 Aprile",
      metaDescription:
        "Aleluias Trail il 4 aprile 2026 a Terrugem, Elvas. Trail 21km, Mini Trail 12km e Camminata 10km. Organizzazione JDT e CDCPT. AADP.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: { eventId: event.id, language: Language[lang] },
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
        language: Language[lang],
        title: translations[lang].title,
        description: translations[lang].description,
        city: translations[lang].city,
        metaTitle: translations[lang].metaTitle,
        metaDescription: translations[lang].metaDescription,
      },
    });
    console.log(`✅ Translation [${lang}] upserted`);
  }

  // ──────────────────────────────────────────────
  // 3. Variants (findOrCreate helper)
  // ──────────────────────────────────────────────
  const findOrCreateVariant = async (variantData: {
    name: string;
    distanceKm: number;
    elevationGainM: number | null;
    elevationLossM: number | null;
    startDate: Date;
    startTime: string;
    cutoffTimeHours: number | null;
    price: number;
    currency: Currency;
    maxParticipants: number | null;
    atrpGrade: number | null;
    itraPoints: number | null;
    description: string;
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

  // ── Variant 1: Trail 21km ──
  const trail21 = await findOrCreateVariant({
    name: "Trail 21km",
    distanceKm: 21,
    elevationGainM: 800,
    elevationLossM: 800,
    startDate: new Date("2026-04-04T09:00:00Z"),
    startTime: "09:00",
    cutoffTimeHours: 4,
    price: 18,
    currency: Currency.EUR,
    maxParticipants: 60,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Trail 21 km · ~800m D+ · Competitivo · Cutoff 4h · Idade mín. 18 anos",
  });
  console.log(`✅ Variant: ${trail21.name}`);

  // ── Variant 2: Mini Trail 12km ──
  const miniTrail = await findOrCreateVariant({
    name: "Mini Trail 12km",
    distanceKm: 12,
    elevationGainM: 300,
    elevationLossM: 300,
    startDate: new Date("2026-04-04T09:15:00Z"),
    startTime: "09:15",
    cutoffTimeHours: 4,
    price: 14,
    currency: Currency.EUR,
    maxParticipants: 120,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Mini Trail 12 km · ~300m D+ · Competitivo · Cutoff 4h · Idade mín. 16 anos",
  });
  console.log(`✅ Variant: ${miniTrail.name}`);

  // ── Variant 3: Caminhada 10km ──
  const caminhada = await findOrCreateVariant({
    name: "Caminhada 10km",
    distanceKm: 10,
    elevationGainM: 150,
    elevationLossM: 150,
    startDate: new Date("2026-04-04T09:20:00Z"),
    startTime: "09:20",
    cutoffTimeHours: 4,
    price: 10,
    currency: Currency.EUR,
    maxParticipants: 120,
    atrpGrade: null,
    itraPoints: null,
    description: "Caminhada 10 km · ~150m D+ · Não competitiva",
  });
  console.log(`✅ Variant: ${caminhada.name}`);

  // ── Variant 4: Acompanhantes ──
  const acompanhantes = await findOrCreateVariant({
    name: "Acompanhantes",
    distanceKm: 0,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-04T09:00:00Z"),
    startTime: "09:00",
    cutoffTimeHours: null,
    price: 5,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Acompanhantes · Inclui almoço e acesso ao evento",
  });
  console.log(`✅ Variant: ${acompanhantes.name}`);

  // ── Variant Translations (ALL 6 languages) ──
  const variantTranslations: Record<
    string,
    Record<string, { name: string; description: string | null }>
  > = {
    trail21: {
      pt: {
        name: "Trail 21km",
        description:
          "Trail 21 km · ~800m D+ · Competitivo · Cutoff 4h · Idade mín. 18 anos",
      },
      en: {
        name: "Trail 21km",
        description:
          "Trail 21 km · ~800m D+ · Competitive · Cutoff 4h · Min. age 18",
      },
      es: {
        name: "Trail 21km",
        description:
          "Trail 21 km · ~800m D+ · Competitivo · Límite 4h · Edad mín. 18 años",
      },
      fr: {
        name: "Trail 21km",
        description:
          "Trail 21 km · ~800m D+ · Compétitif · Limite 4h · Âge min. 18 ans",
      },
      de: {
        name: "Trail 21km",
        description:
          "Trail 21 km · ~800m D+ · Wettkampf · Limit 4h · Mindestalter 18",
      },
      it: {
        name: "Trail 21km",
        description:
          "Trail 21 km · ~800m D+ · Competitivo · Limite 4h · Età min. 18 anni",
      },
    },
    miniTrail: {
      pt: {
        name: "Mini Trail 12km",
        description:
          "Mini Trail 12 km · ~300m D+ · Competitivo · Cutoff 4h · Idade mín. 16 anos",
      },
      en: {
        name: "Mini Trail 12km",
        description:
          "Mini Trail 12 km · ~300m D+ · Competitive · Cutoff 4h · Min. age 16",
      },
      es: {
        name: "Mini Trail 12km",
        description:
          "Mini Trail 12 km · ~300m D+ · Competitivo · Límite 4h · Edad mín. 16 años",
      },
      fr: {
        name: "Mini Trail 12km",
        description:
          "Mini Trail 12 km · ~300m D+ · Compétitif · Limite 4h · Âge min. 16 ans",
      },
      de: {
        name: "Mini Trail 12km",
        description:
          "Mini Trail 12 km · ~300m D+ · Wettkampf · Limit 4h · Mindestalter 16",
      },
      it: {
        name: "Mini Trail 12km",
        description:
          "Mini Trail 12 km · ~300m D+ · Competitivo · Limite 4h · Età min. 16 anni",
      },
    },
    caminhada: {
      pt: {
        name: "Caminhada 10km",
        description: "Caminhada 10 km · ~150m D+ · Não competitiva",
      },
      en: {
        name: "Walk 10km",
        description: "Walk 10 km · ~150m D+ · Non-competitive",
      },
      es: {
        name: "Caminata 10km",
        description: "Caminata 10 km · ~150m D+ · No competitiva",
      },
      fr: {
        name: "Randonnée 10km",
        description: "Randonnée 10 km · ~150m D+ · Non compétitive",
      },
      de: {
        name: "Wanderung 10km",
        description: "Wanderung 10 km · ~150m D+ · Nicht-kompetitiv",
      },
      it: {
        name: "Camminata 10km",
        description: "Camminata 10 km · ~150m D+ · Non competitiva",
      },
    },
    acompanhantes: {
      pt: {
        name: "Acompanhantes",
        description: "Acompanhantes · Inclui almoço e acesso ao evento",
      },
      en: {
        name: "Companions",
        description: "Companions · Includes lunch and event access",
      },
      es: {
        name: "Acompañantes",
        description: "Acompañantes · Incluye almuerzo y acceso al evento",
      },
      fr: {
        name: "Accompagnants",
        description: "Accompagnants · Comprend déjeuner et accès à l'événement",
      },
      de: {
        name: "Begleiter",
        description:
          "Begleiter · Inklusive Mittagessen und Veranstaltungszugang",
      },
      it: {
        name: "Accompagnatori",
        description: "Accompagnatori · Include pranzo e accesso all'evento",
      },
    },
  };

  const variantMap = [
    { variant: trail21, key: "trail21" },
    { variant: miniTrail, key: "miniTrail" },
    { variant: caminhada, key: "caminhada" },
    { variant: acompanhantes, key: "acompanhantes" },
  ];

  for (const { variant, key } of variantMap) {
    for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
      await prisma.eventVariantTranslation.upsert({
        where: {
          variantId_language: {
            variantId: variant.id,
            language: Language[lang],
          },
        },
        update: {
          name: variantTranslations[key][lang].name,
          description: variantTranslations[key][lang].description,
        },
        create: {
          variantId: variant.id,
          language: Language[lang],
          name: variantTranslations[key][lang].name,
          description: variantTranslations[key][lang].description,
        },
      });
    }
    console.log(`✅ Variant translations upserted: ${variant.name}`);
  }

  // ──────────────────────────────────────────────
  // 4. Pricing Phases (single phase per variant, linked to eventId AND variantId)
  // ──────────────────────────────────────────────
  const findOrCreatePricingPhase = async (
    name: string,
    variantId: string,
    data: {
      startDate: Date;
      endDate: Date;
      price: number;
      currency: Currency;
      note: string | null;
    }
  ) => {
    const existing = await prisma.pricingPhase.findFirst({
      where: { eventId: event.id, name },
    });

    if (existing) {
      return await prisma.pricingPhase.update({
        where: { id: existing.id },
        data: { ...data, variantId },
      });
    } else {
      return await prisma.pricingPhase.create({
        data: { eventId: event.id, variantId, name, ...data },
      });
    }
  };

  const pricingStart = new Date("2026-01-31T00:00:00Z");
  const pricingDeadline = new Date("2026-03-30T23:59:59Z");

  await findOrCreatePricingPhase("Trail 21km - Inscrição", trail21.id, {
    startDate: pricingStart,
    endDate: pricingDeadline,
    price: 18,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Mini Trail 12km - Inscrição", miniTrail.id, {
    startDate: pricingStart,
    endDate: pricingDeadline,
    price: 14,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Caminhada 10km - Inscrição", caminhada.id, {
    startDate: pricingStart,
    endDate: pricingDeadline,
    price: 10,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase(
    "Acompanhantes - Inscrição",
    acompanhantes.id,
    {
      startDate: pricingStart,
      endDate: pricingDeadline,
      price: 5,
      currency: Currency.EUR,
      note: null,
    }
  );
  console.log("✅ Pricing phases created for all variants");

  // ──────────────────────────────────────────────
  // 5. FAQs with translations (ALL 6 languages)
  // ──────────────────────────────────────────────
  const findOrCreateFAQ = async (
    eventId: string,
    order: number,
    question: string,
    answer: string
  ) => {
    const existing = await prisma.eventFAQ.findFirst({
      where: { eventId, order },
    });
    if (existing)
      return await prisma.eventFAQ.update({
        where: { id: existing.id },
        data: { question, answer },
      });
    return await prisma.eventFAQ.create({
      data: { eventId, order, question, answer },
    });
  };

  // ── FAQ 0: Schedule ──
  const faq0 = await findOrCreateFAQ(
    event.id,
    0,
    "Qual é o horário do evento?",
    "3 abril: 18:00–20:00 — Levantamento de dorsais (Pavilhão Multiusos da Terrugem). 4 abril: 07:00–08:30 — Levantamento de dorsais. 08:45 — Controlo zero. 09:00 — Trail 21km. 09:15 — Mini Trail 12km. 09:20 — Caminhada 10km. 13:30 — Entrega de prémios. 14:00 — Encerramento."
  );

  const faq0Translations = {
    pt: {
      question: "Qual é o horário do evento?",
      answer:
        "3 abril: 18:00–20:00 — Levantamento de dorsais (Pavilhão Multiusos da Terrugem). 4 abril: 07:00–08:30 — Levantamento de dorsais. 08:45 — Controlo zero. 09:00 — Trail 21km. 09:15 — Mini Trail 12km. 09:20 — Caminhada 10km. 13:30 — Entrega de prémios. 14:00 — Encerramento.",
    },
    en: {
      question: "What is the event schedule?",
      answer:
        "April 3: 18:00–20:00 — Bib pickup (Pavilhão Multiusos da Terrugem). April 4: 07:00–08:30 — Bib pickup. 08:45 — Zero control. 09:00 — Trail 21km. 09:15 — Mini Trail 12km. 09:20 — Walk 10km. 13:30 — Prize ceremony. 14:00 — Closing.",
    },
    es: {
      question: "¿Cuál es el horario del evento?",
      answer:
        "3 abril: 18:00–20:00 — Recogida de dorsales (Pavilhão Multiusos da Terrugem). 4 abril: 07:00–08:30 — Recogida de dorsales. 08:45 — Control cero. 09:00 — Trail 21km. 09:15 — Mini Trail 12km. 09:20 — Caminata 10km. 13:30 — Entrega de premios. 14:00 — Cierre.",
    },
    fr: {
      question: "Quel est le programme de l'événement ?",
      answer:
        "3 avril : 18h00–20h00 — Retrait des dossards (Pavilhão Multiusos da Terrugem). 4 avril : 07h00–08h30 — Retrait des dossards. 08h45 — Contrôle zéro. 09h00 — Trail 21km. 09h15 — Mini Trail 12km. 09h20 — Randonnée 10km. 13h30 — Remise des prix. 14h00 — Clôture.",
    },
    de: {
      question: "Wie ist der Zeitplan der Veranstaltung?",
      answer:
        "3. April: 18:00–20:00 — Startnummernausgabe (Pavilhão Multiusos da Terrugem). 4. April: 07:00–08:30 — Startnummernausgabe. 08:45 — Nullkontrolle. 09:00 — Trail 21km. 09:15 — Mini Trail 12km. 09:20 — Wanderung 10km. 13:30 — Siegerehrung. 14:00 — Abschluss.",
    },
    it: {
      question: "Qual è il programma dell'evento?",
      answer:
        "3 aprile: 18:00–20:00 — Ritiro pettorali (Pavilhão Multiusos da Terrugem). 4 aprile: 07:00–08:30 — Ritiro pettorali. 08:45 — Controllo zero. 09:00 — Trail 21km. 09:15 — Mini Trail 12km. 09:20 — Camminata 10km. 13:30 — Premiazione. 14:00 — Chiusura.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq0.id, language: Language[lang] } },
      update: faq0Translations[lang],
      create: {
        faqId: faq0.id,
        language: Language[lang],
        ...faq0Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 0: Schedule");

  // ── FAQ 1: What's included ──
  const faq1 = await findOrCreateFAQ(
    event.id,
    1,
    "O que está incluído na inscrição?",
    "Dorsal (exceto caminhada), seguro de acidentes pessoais, abastecimentos (Trail 21km: 2, Mini Trail/Caminhada: 1), medalha Finisher, T-shirt técnica, 1× senha de bebida, 1× bifana, 1× sopa (caldo verde), duches e outros brindes."
  );

  const faq1Translations = {
    pt: {
      question: "O que está incluído na inscrição?",
      answer:
        "Dorsal (exceto caminhada), seguro de acidentes pessoais, abastecimentos (Trail 21km: 2, Mini Trail/Caminhada: 1), medalha Finisher, T-shirt técnica, 1× senha de bebida, 1× bifana, 1× sopa (caldo verde), duches e outros brindes.",
    },
    en: {
      question: "What is included in the registration?",
      answer:
        "Bib number (except walk), personal accident insurance, aid stations (Trail 21km: 2, Mini Trail/Walk: 1), finisher medal, technical t-shirt, 1× drink ticket, 1× bifana (pork sandwich), 1× soup (caldo verde), showers and other gifts.",
    },
    es: {
      question: "¿Qué incluye la inscripción?",
      answer:
        "Dorsal (excepto caminata), seguro de accidentes, avituallamientos (Trail 21km: 2, Mini Trail/Caminata: 1), medalla Finisher, camiseta técnica, 1× bebida, 1× bifana, 1× sopa (caldo verde), duchas y otros obsequios.",
    },
    fr: {
      question: "Que comprend l'inscription ?",
      answer:
        "Dossard (sauf randonnée), assurance accidents, ravitaillements (Trail 21km : 2, Mini Trail/Randonnée : 1), médaille Finisher, t-shirt technique, 1× boisson, 1× bifana, 1× soupe (caldo verde), douches et autres cadeaux.",
    },
    de: {
      question: "Was ist in der Anmeldung enthalten?",
      answer:
        "Startnummer (außer Wanderung), Unfallversicherung, Verpflegungsstationen (Trail 21km: 2, Mini Trail/Wanderung: 1), Finisher-Medaille, technisches T-Shirt, 1× Getränk, 1× Bifana, 1× Suppe (Caldo Verde), Duschen und weitere Geschenke.",
    },
    it: {
      question: "Cosa è incluso nell'iscrizione?",
      answer:
        "Pettorale (eccetto camminata), assicurazione infortuni, rifornimenti (Trail 21km: 2, Mini Trail/Camminata: 1), medaglia Finisher, t-shirt tecnica, 1× bevanda, 1× bifana, 1× zuppa (caldo verde), docce e altri omaggi.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq1.id, language: Language[lang] } },
      update: faq1Translations[lang],
      create: {
        faqId: faq1.id,
        language: Language[lang],
        ...faq1Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 1: What's included");

  // ── FAQ 2: Prizes ──
  const faq2 = await findOrCreateFAQ(
    event.id,
    2,
    "Quais são os prémios?",
    "Trail 21km e Mini Trail 12km: troféu para os 3 primeiros geral M/F. Medalha de classificação para os 3 primeiros M/F de cada escalão: SUB23 (16–22), SEM (23–34), M/F35, M/F40, M/F45, M/F50, M/F55, M/F60, M/F65, M/F70+. Troféu para a equipa mais numerosa. Medalha Finisher para todos."
  );

  const faq2Translations = {
    pt: {
      question: "Quais são os prémios?",
      answer:
        "Trail 21km e Mini Trail 12km: troféu para os 3 primeiros geral M/F. Medalha de classificação para os 3 primeiros M/F de cada escalão: SUB23 (16–22), SEM (23–34), M/F35, M/F40, M/F45, M/F50, M/F55, M/F60, M/F65, M/F70+. Troféu para a equipa mais numerosa. Medalha Finisher para todos.",
    },
    en: {
      question: "What are the prizes?",
      answer:
        "Trail 21km and Mini Trail 12km: trophy for top 3 overall M/F. Classification medal for top 3 M/F per age group: SUB23 (16–22), SEM (23–34), M/F35, M/F40, M/F45, M/F50, M/F55, M/F60, M/F65, M/F70+. Trophy for largest team. Finisher medal for all.",
    },
    es: {
      question: "¿Cuáles son los premios?",
      answer:
        "Trail 21km y Mini Trail 12km: trofeo para los 3 primeros general M/F. Medalla por categoría: SUB23 (16–22), SEM (23–34), M/F35, M/F40, M/F45, M/F50, M/F55, M/F60, M/F65, M/F70+. Trofeo equipo más numeroso. Medalla Finisher para todos.",
    },
    fr: {
      question: "Quels sont les prix ?",
      answer:
        "Trail 21km et Mini Trail 12km : trophée aux 3 premiers général H/F. Médaille par catégorie : SUB23 (16–22), SEM (23–34), H/F35, H/F40, H/F45, H/F50, H/F55, H/F60, H/F65, H/F70+. Trophée équipe la plus nombreuse. Médaille Finisher pour tous.",
    },
    de: {
      question: "Welche Preise gibt es?",
      answer:
        "Trail 21km und Mini Trail 12km: Pokal für Top 3 Gesamt M/W. Medaille pro Altersklasse: SUB23 (16–22), SEM (23–34), M/W35, M/W40, M/W45, M/W50, M/W55, M/W60, M/W65, M/W70+. Pokal für das größte Team. Finisher-Medaille für alle.",
    },
    it: {
      question: "Quali sono i premi?",
      answer:
        "Trail 21km e Mini Trail 12km: trofeo ai 3 primi generale M/F. Medaglia per fascia d'età: SUB23 (16–22), SEM (23–34), M/F35, M/F40, M/F45, M/F50, M/F55, M/F60, M/F65, M/F70+. Trofeo squadra più numerosa. Medaglia Finisher per tutti.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq2.id, language: Language[lang] } },
      update: faq2Translations[lang],
      create: {
        faqId: faq2.id,
        language: Language[lang],
        ...faq2Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 2: Prizes");

  // ── FAQ 3: Mandatory equipment ──
  const faq3 = await findOrCreateFAQ(
    event.id,
    3,
    "Qual é o material obrigatório?",
    "Todas as provas: telemóvel operacional e copo/reservatório de líquidos. Mini Trail 12km e Trail 21km: também apito e manta térmica. Não são permitidos animais de companhia."
  );

  const faq3Translations = {
    pt: {
      question: "Qual é o material obrigatório?",
      answer:
        "Todas as provas: telemóvel operacional e copo/reservatório de líquidos. Mini Trail 12km e Trail 21km: também apito e manta térmica. Não são permitidos animais de companhia.",
    },
    en: {
      question: "What is the mandatory equipment?",
      answer:
        "All races: working mobile phone and cup/liquid reservoir. Mini Trail 12km and Trail 21km: also whistle and emergency blanket. Pets are not allowed.",
    },
    es: {
      question: "¿Cuál es el material obligatorio?",
      answer:
        "Todas las pruebas: teléfono operativo y vaso/depósito de líquidos. Mini Trail 12km y Trail 21km: también silbato y manta térmica. No se permiten mascotas.",
    },
    fr: {
      question: "Quel est le matériel obligatoire ?",
      answer:
        "Toutes les épreuves : téléphone en état de marche et gobelet/réservoir de liquides. Mini Trail 12km et Trail 21km : aussi sifflet et couverture de survie. Les animaux ne sont pas autorisés.",
    },
    de: {
      question: "Welche Pflichtausrüstung gibt es?",
      answer:
        "Alle Rennen: funktionierendes Mobiltelefon und Becher/Flüssigkeitsbehälter. Mini Trail 12km und Trail 21km: auch Pfeife und Rettungsdecke. Haustiere sind nicht erlaubt.",
    },
    it: {
      question: "Qual è il materiale obbligatorio?",
      answer:
        "Tutte le gare: cellulare funzionante e bicchiere/serbatoio liquidi. Mini Trail 12km e Trail 21km: anche fischietto e coperta termica. Non sono ammessi animali domestici.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq3.id, language: Language[lang] } },
      update: faq3Translations[lang],
      create: {
        faqId: faq3.id,
        language: Language[lang],
        ...faq3Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 3: Mandatory equipment");

  // ── FAQ 4: Registration limits ──
  const faq4 = await findOrCreateFAQ(
    event.id,
    4,
    "Há limite de inscrições?",
    "Sim. Total máximo de 300 participantes: Trail 21km (60 vagas), Mini Trail 12km (120 vagas), Caminhada 10km (120 vagas). Inscrições em acorrer.pt até 30 de março de 2026. Não há inscrições no dia da prova nem devoluções."
  );

  const faq4Translations = {
    pt: {
      question: "Há limite de inscrições?",
      answer:
        "Sim. Total máximo de 300 participantes: Trail 21km (60 vagas), Mini Trail 12km (120 vagas), Caminhada 10km (120 vagas). Inscrições em acorrer.pt até 30 de março de 2026. Não há inscrições no dia da prova nem devoluções.",
    },
    en: {
      question: "Is there a registration limit?",
      answer:
        "Yes. Maximum 300 participants total: Trail 21km (60 spots), Mini Trail 12km (120 spots), Walk 10km (120 spots). Register at acorrer.pt by March 30, 2026. No race-day registrations or refunds.",
    },
    es: {
      question: "¿Hay límite de inscripciones?",
      answer:
        "Sí. Máximo 300 participantes en total: Trail 21km (60 plazas), Mini Trail 12km (120 plazas), Caminata 10km (120 plazas). Inscripciones en acorrer.pt hasta el 30 de marzo de 2026. Sin inscripciones el día de la prueba ni devoluciones.",
    },
    fr: {
      question: "Y a-t-il une limite d'inscriptions ?",
      answer:
        "Oui. Maximum 300 participants au total : Trail 21km (60 places), Mini Trail 12km (120 places), Randonnée 10km (120 places). Inscriptions sur acorrer.pt jusqu'au 30 mars 2026. Pas d'inscriptions le jour de la course ni de remboursements.",
    },
    de: {
      question: "Gibt es ein Anmeldelimit?",
      answer:
        "Ja. Maximal 300 Teilnehmer insgesamt: Trail 21km (60 Plätze), Mini Trail 12km (120 Plätze), Wanderung 10km (120 Plätze). Anmeldung auf acorrer.pt bis 30. März 2026. Keine Anmeldung am Veranstaltungstag, keine Rückerstattung.",
    },
    it: {
      question: "C'è un limite di iscrizioni?",
      answer:
        "Sì. Massimo 300 partecipanti totali: Trail 21km (60 posti), Mini Trail 12km (120 posti), Camminata 10km (120 posti). Iscrizioni su acorrer.pt fino al 30 marzo 2026. Nessuna iscrizione il giorno della gara né rimborsi.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq4.id, language: Language[lang] } },
      update: faq4Translations[lang],
      create: {
        faqId: faq4.id,
        language: Language[lang],
        ...faq4Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 4: Registration limits");

  // ── FAQ 5: Contacts ──
  const faq5 = await findOrCreateFAQ(
    event.id,
    5,
    "Quais são os contactos da organização?",
    "Organização: JDT – Juventude Desportiva da Terrugem & CDCPT – Clube Desportivo de Caça e Pesca da Terrugem. Telemóveis: 964 472 877 | 969 119 115. Email: aleluiastrail@gmail.com."
  );

  const faq5Translations = {
    pt: {
      question: "Quais são os contactos da organização?",
      answer:
        "Organização: JDT – Juventude Desportiva da Terrugem & CDCPT – Clube Desportivo de Caça e Pesca da Terrugem. Telemóveis: 964 472 877 | 969 119 115. Email: aleluiastrail@gmail.com.",
    },
    en: {
      question: "What are the organization's contacts?",
      answer:
        "Organization: JDT – Juventude Desportiva da Terrugem & CDCPT – Clube Desportivo de Caça e Pesca da Terrugem. Phone: +351 964 472 877 | +351 969 119 115. Email: aleluiastrail@gmail.com.",
    },
    es: {
      question: "¿Cuáles son los contactos de la organización?",
      answer:
        "Organización: JDT – Juventude Desportiva da Terrugem & CDCPT – Clube Desportivo de Caça e Pesca da Terrugem. Teléfonos: 964 472 877 | 969 119 115. Email: aleluiastrail@gmail.com.",
    },
    fr: {
      question: "Quels sont les contacts de l'organisation ?",
      answer:
        "Organisation : JDT – Juventude Desportiva da Terrugem & CDCPT – Clube Desportivo de Caça e Pesca da Terrugem. Tél : 964 472 877 | 969 119 115. Email : aleluiastrail@gmail.com.",
    },
    de: {
      question: "Was sind die Kontaktdaten der Organisation?",
      answer:
        "Organisation: JDT – Juventude Desportiva da Terrugem & CDCPT – Clube Desportivo de Caça e Pesca da Terrugem. Telefon: 964 472 877 | 969 119 115. E-Mail: aleluiastrail@gmail.com.",
    },
    it: {
      question: "Quali sono i contatti dell'organizzazione?",
      answer:
        "Organizzazione: JDT – Juventude Desportiva da Terrugem & CDCPT – Clube Desportivo de Caça e Pesca da Terrugem. Telefono: 964 472 877 | 969 119 115. Email: aleluiastrail@gmail.com.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq5.id, language: Language[lang] } },
      update: faq5Translations[lang],
      create: {
        faqId: faq5.id,
        language: Language[lang],
        ...faq5Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 5: Contacts");

  // ── FAQ 6: Cultural context ──
  const faq6 = await findOrCreateFAQ(
    event.id,
    6,
    "O que são as Aleluias da Terrugem?",
    "As Aleluias são uma das tradições mais marcantes da Terrugem. À meia-noite do Sábado de Aleluia, os sinos anunciam a Ressurreição, as ruas enchem-se de vida com o som dos chocalhos, alegria nas varandas e reencontros entre gerações. O Aleluias Trail celebra esta identidade através do desporto, unindo tradição, natureza e comunidade."
  );

  const faq6Translations = {
    pt: {
      question: "O que são as Aleluias da Terrugem?",
      answer:
        "As Aleluias são uma das tradições mais marcantes da Terrugem. À meia-noite do Sábado de Aleluia, os sinos anunciam a Ressurreição, as ruas enchem-se de vida com o som dos chocalhos, alegria nas varandas e reencontros entre gerações. O Aleluias Trail celebra esta identidade através do desporto, unindo tradição, natureza e comunidade.",
    },
    en: {
      question: "What are the Aleluias of Terrugem?",
      answer:
        "The Aleluias are one of Terrugem's most distinctive traditions. At midnight on Easter Saturday, bells announce the Resurrection and the streets fill with life — cowbells echo, joy fills the balconies, and generations reunite. The Aleluias Trail celebrates this identity through sport, uniting tradition, nature and community.",
    },
    es: {
      question: "¿Qué son las Aleluias de Terrugem?",
      answer:
        "Las Aleluias son una de las tradiciones más emblemáticas de Terrugem. A medianoche del Sábado de Aleluia, las campanas anuncian la Resurrección y las calles se llenan de vida con cencerros, alegría y reencuentros. El Aleluias Trail celebra esta identidad a través del deporte, uniendo tradición, naturaleza y comunidad.",
    },
    fr: {
      question: "Que sont les Aleluias de Terrugem ?",
      answer:
        "Les Aleluias sont l'une des traditions les plus emblématiques de Terrugem. À minuit le Samedi de l'Alleluia, les cloches annoncent la Résurrection et les rues s'animent de sonnailles, de joie et de retrouvailles. L'Aleluias Trail célèbre cette identité par le sport, unissant tradition, nature et communauté.",
    },
    de: {
      question: "Was sind die Aleluias von Terrugem?",
      answer:
        "Die Aleluias sind eine der markantesten Traditionen von Terrugem. Um Mitternacht am Karsamstag verkünden die Glocken die Auferstehung und die Straßen füllen sich mit Leben — Kuhglocken, Freude und Wiedersehen. Der Aleluias Trail feiert diese Identität durch Sport und vereint Tradition, Natur und Gemeinschaft.",
    },
    it: {
      question: "Cosa sono le Aleluias di Terrugem?",
      answer:
        "Le Aleluias sono una delle tradizioni più emblematiche di Terrugem. A mezzanotte del Sabato di Alleluia, le campane annunciano la Risurrezione e le strade si riempiono di vita con campanacci, gioia e ricongiungimenti. L'Aleluias Trail celebra questa identità attraverso lo sport, unendo tradizione, natura e comunità.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq6.id, language: Language[lang] } },
      update: faq6Translations[lang],
      create: {
        faqId: faq6.id,
        language: Language[lang],
        ...faq6Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 6: Cultural context");

  // ──────────────────────────────────────────────
  // Done
  // ──────────────────────────────────────────────
  console.log(`
🐣 Aleluias Trail 2026 seed completed!
──────────────────────────────────────────────
- Slug: aleluias-trail-2026
- Date: April 4, 2026
- Location: Parque de Festas da Terrugem, Elvas
- Variants: Trail 21km (18€), Mini Trail 12km (14€), Caminhada 10km (10€), Acompanhantes (5€)
- Pricing: 1 phase × 4 variants = 4 pricing phases
- FAQs: 7 with translations in 6 languages
- Limit: 300 participants (60 + 120 + 120)
- Cutoff: 4h (until 13:00)
- Association: AADP
- Organizers: JDT & CDCPT
  `);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
