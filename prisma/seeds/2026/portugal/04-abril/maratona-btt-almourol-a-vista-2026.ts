/**
 * Seed: 17º Maratona BTT Almourol à Vista 2026
 *
 * Event: Mountain bike marathon in Vila Nova da Barquinha, Portugal
 * Location: Avenida dos Plátanos, Parque Ribeirinho, Vila Nova da Barquinha
 * Date: April 26, 2026
 * Organizer: Grupo Cicloturismo Barquinhense
 * Sport: BTT, Cycling
 * Circuit: Troféu BTT Ribatejo Norte
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding 17º Maratona BTT Almourol à Vista 2026...");

  // ──────────────────────────────────────────────
  // 1. Upsert Event
  // ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: "maratona-btt-almourol-a-vista-2026" },
    update: {
      title: "17º Maratona BTT Almourol à Vista 2026",
      description:
        "17º Maratona BTT Almourol à Vista 2026 - BTT em Vila Nova da Barquinha",
      sportTypes: [SportType.BTT, SportType.CYCLING],
      startDate: new Date("2026-04-26T07:30:00Z"),
      endDate: new Date("2026-04-26T17:00:00Z"),
      registrationDeadline: new Date("2026-04-15T23:59:00Z"),
      externalUrl:
        "https://www.trilhoperdido.com/evento/Maratona-BTT-Almourol-a-Vista",
      imageUrl: "",
      city: "Vila Nova da Barquinha",
      country: "Portugal",
      latitude: 39.4536,
      longitude: -8.4347,
      googleMapsUrl: "https://maps.google.com/?q=39.4536,-8.4347",
      isFeatured: false,
      cancelled: false,
    },
    create: {
      title: "17º Maratona BTT Almourol à Vista 2026",
      slug: "maratona-btt-almourol-a-vista-2026",
      description:
        "17º Maratona BTT Almourol à Vista 2026 - BTT em Vila Nova da Barquinha",
      sportTypes: [SportType.BTT, SportType.CYCLING],
      startDate: new Date("2026-04-26T07:30:00Z"),
      endDate: new Date("2026-04-26T17:00:00Z"),
      registrationDeadline: new Date("2026-04-15T23:59:00Z"),
      externalUrl:
        "https://www.trilhoperdido.com/evento/Maratona-BTT-Almourol-a-Vista",
      imageUrl: "",
      city: "Vila Nova da Barquinha",
      country: "Portugal",
      latitude: 39.4536,
      longitude: -8.4347,
      googleMapsUrl: "https://maps.google.com/?q=39.4536,-8.4347",
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
      title: "17º Maratona BTT Almourol à Vista 2026",
      description: `# 🚴 17º Maratona BTT Almourol à Vista 2026

**A 17ª edição da Maratona BTT Almourol à Vista realiza-se a 26 de abril de 2026 em Vila Nova da Barquinha!** Organizada pelo **Grupo Cicloturismo Barquinhense**, a prova integra o **Troféu BTT Ribatejo Norte**.

Partida e chegada na **Avenida dos Plátanos**, junto ao **Parque Ribeirinho**. Dois percursos circulares por trilhos e caminhos da região, com vista para o icónico **Castelo de Almourol**.

Prova em regime de **semi-autossuficiência** — não são distribuídos copos nem garrafas. Cada atleta deve trazer o seu recipiente. Uso de capacete obrigatório durante toda a prova.

---

## 🚴 Percursos

- **Maratona** – 60 km · D+1200m · Dificuldade 3/5 · Cutoff 6h
- **Passeio** – 40 km · D+750m · Dificuldade 3/5 · Cutoff 4h30

Admitidas bicicletas BTT, Gravel e E-Bike (norma EN 15194). Categorias de Duplas Mistas disponíveis.

---

## ⏰ Horário

**Sábado, 25 de Abril:**
- 16:00 – Abertura do secretariado
- 20:00 – Fecho do secretariado

**Domingo, 26 de Abril:**
- 07:30 – Abertura do secretariado
- 08:45 – Abertura do controlo de partida
- 09:15 – Fecho do secretariado
- 09:20 – Briefing
- 09:30 – Partida (ambos os percursos)
- 11:30 – Previsão 1º chegada Passeio 40km
- 12:30 – Início do almoço convívio
- 13:00 – Previsão 1º chegada Maratona 60km
- 13:30 – Entrega de prémios

---

## 🎽 A inscrição inclui

- Lembrança do evento
- Seguro de acidentes pessoal e responsabilidade civil
- Abastecimentos sólidos e líquidos (3 na Maratona, 2 no Passeio)
- Apoio logístico
- Banhos quentes
- Local para lavagem de bicicletas

---

## 🍽️ Extras opcionais

- Almoço participantes: 12,50 € (sopa, rojões com massa, pão, fruta e bebida)
- Almoço acompanhantes: 14,50 €
- Jersey manga curta: 22 €
- Jersey manga comprida: 26 €

---

## 🏆 Circuitos

- Troféu BTT Ribatejo Norte (Maratona + Sprint)
- Classificação Gravel (geral M/F)
- Classificação Duplas Mistas

---

🚴 **Vem pedalar com vista para o Castelo de Almourol!** 🏰`,
      city: "Vila Nova da Barquinha",
      metaTitle:
        "17º BTT Almourol à Vista 2026 | Vila Nova da Barquinha | 26 Abril",
      metaDescription:
        "17ª Maratona BTT Almourol à Vista a 26 de abril de 2026 em Vila Nova da Barquinha. Maratona 60km e Passeio 40km. Troféu BTT Ribatejo Norte. Categorias Gravel e E-Bike.",
    },
    en: {
      title: "17th BTT Marathon Almourol à Vista 2026",
      description: `# 🚴 17th BTT Marathon Almourol à Vista 2026

**The 17th edition of the BTT Marathon Almourol à Vista takes place on April 26, 2026 in Vila Nova da Barquinha!** Organized by **Grupo Cicloturismo Barquinhense**, the race is part of the **Troféu BTT Ribatejo Norte**.

Start and finish at **Avenida dos Plátanos**, next to **Parque Ribeirinho**. Two circular courses through trails and paths of the region, with views of the iconic **Almourol Castle**.

Semi self-sufficiency race — no cups or bottles distributed. Each athlete must bring their own container. Helmet mandatory throughout the race.

---

## 🚴 Courses

- **Marathon** – 60 km · D+1200m · Difficulty 3/5 · Cutoff 6h
- **Half Marathon** – 40 km · D+750m · Difficulty 3/5 · Cutoff 4h30

BTT, Gravel and E-Bike (EN 15194 standard) bicycles accepted. Mixed Pairs categories available.

---

## ⏰ Schedule

**Saturday, April 25:**
- 16:00 – Registration desk opens
- 20:00 – Registration desk closes

**Sunday, April 26:**
- 07:30 – Registration desk opens
- 08:45 – Start control opens
- 09:15 – Registration desk closes
- 09:20 – Briefing
- 09:30 – Start (both courses)
- 11:30 – Expected first finisher Half Marathon 40km
- 12:30 – Lunch starts
- 13:00 – Expected first finisher Marathon 60km
- 13:30 – Prize ceremony

---

## 🎽 Registration includes

- Event souvenir
- Personal accident and civil liability insurance
- Solid and liquid aid stations (3 for Marathon, 2 for Half Marathon)
- Logistic support
- Hot showers
- Bike wash station

---

## 🍽️ Optional extras

- Participant lunch: €12.50 (soup, rojões with pasta, bread, fruit and drink)
- Companion lunch: €14.50
- Short sleeve jersey: €22
- Long sleeve jersey: €26

---

## 🏆 Circuits

- Troféu BTT Ribatejo Norte (Marathon + Sprint)
- Gravel classification (overall M/F)
- Mixed Pairs classification

---

🚴 **Come ride with views of Almourol Castle!** 🏰`,
      city: "Vila Nova da Barquinha",
      metaTitle:
        "17th BTT Almourol à Vista 2026 | Vila Nova da Barquinha | April 26",
      metaDescription:
        "17th BTT Marathon Almourol à Vista on April 26, 2026 in Vila Nova da Barquinha. Marathon 60km and Half Marathon 40km. Troféu BTT Ribatejo Norte. Gravel and E-Bike categories.",
    },
    es: {
      title: "17ª Maratón BTT Almourol à Vista 2026",
      description: `# 🚴 17ª Maratón BTT Almourol à Vista 2026

**La 17ª edición de la Maratón BTT Almourol à Vista se celebra el 26 de abril de 2026 en Vila Nova da Barquinha.** Organizada por el **Grupo Cicloturismo Barquinhense**, la prueba forma parte del **Troféu BTT Ribatejo Norte**.

Salida y llegada en la **Avenida dos Plátanos**, junto al **Parque Ribeirinho**. Dos recorridos circulares por senderos y caminos de la región, con vistas al icónico **Castillo de Almourol**.

Prueba en régimen de **semi-autosuficiencia** — no se distribuyen vasos ni botellas. Cada atleta debe traer su recipiente. Uso de casco obligatorio durante toda la prueba.

---

## 🚴 Recorridos

- **Maratón** – 60 km · D+1200m · Dificultad 3/5 · Límite 6h
- **Media Maratón** – 40 km · D+750m · Dificultad 3/5 · Límite 4h30

Se admiten bicicletas BTT, Gravel y E-Bike (norma EN 15194). Categorías de Parejas Mixtas disponibles.

---

## ⏰ Horario

**Sábado, 25 de Abril:**
- 16:00 – Apertura de secretaría
- 20:00 – Cierre de secretaría

**Domingo, 26 de Abril:**
- 07:30 – Apertura de secretaría
- 08:45 – Apertura del control de salida
- 09:15 – Cierre de secretaría
- 09:20 – Briefing
- 09:30 – Salida (ambos recorridos)
- 11:30 – Previsión 1ª llegada Media Maratón 40km
- 12:30 – Inicio del almuerzo
- 13:00 – Previsión 1ª llegada Maratón 60km
- 13:30 – Entrega de premios

---

## 🎽 La inscripción incluye

- Recuerdo del evento
- Seguro de accidentes personal y responsabilidad civil
- Avituallamientos sólidos y líquidos (3 en Maratón, 2 en Media Maratón)
- Apoyo logístico
- Duchas calientes
- Zona de lavado de bicicletas

---

## 🍽️ Extras opcionales

- Almuerzo participantes: 12,50 €
- Almuerzo acompañantes: 14,50 €
- Jersey manga corta: 22 €
- Jersey manga larga: 26 €

---

🚴 **¡Ven a pedalear con vistas al Castillo de Almourol!** 🏰`,
      city: "Vila Nova da Barquinha",
      metaTitle:
        "17ª BTT Almourol à Vista 2026 | Vila Nova da Barquinha | 26 Abril",
      metaDescription:
        "17ª Maratón BTT Almourol à Vista el 26 de abril de 2026 en Vila Nova da Barquinha. Maratón 60km y Media Maratón 40km. Troféu BTT Ribatejo Norte. Categorías Gravel y E-Bike.",
    },
    fr: {
      title: "17ème Marathon VTT Almourol à Vista 2026",
      description: `# 🚴 17ème Marathon VTT Almourol à Vista 2026

**La 17ème édition du Marathon VTT Almourol à Vista a lieu le 26 avril 2026 à Vila Nova da Barquinha !** Organisée par le **Grupo Cicloturismo Barquinhense**, l'épreuve fait partie du **Troféu BTT Ribatejo Norte**.

Départ et arrivée à l'**Avenida dos Plátanos**, près du **Parque Ribeirinho**. Deux parcours circulaires à travers sentiers et chemins de la région, avec vue sur l'emblématique **Château d'Almourol**.

Course en **semi-autosuffisance** — ni gobelets ni bouteilles distribués. Chaque athlète doit apporter son récipient. Port du casque obligatoire pendant toute la course.

---

## 🚴 Parcours

- **Marathon** – 60 km · D+1200m · Difficulté 3/5 · Limite 6h
- **Semi-Marathon** – 40 km · D+750m · Difficulté 3/5 · Limite 4h30

Vélos VTT, Gravel et E-Bike (norme EN 15194) acceptés. Catégories Paires Mixtes disponibles.

---

## ⏰ Programme

**Samedi 25 Avril :**
- 16h00 – Ouverture du secrétariat
- 20h00 – Fermeture du secrétariat

**Dimanche 26 Avril :**
- 07h30 – Ouverture du secrétariat
- 08h45 – Ouverture du contrôle de départ
- 09h15 – Fermeture du secrétariat
- 09h20 – Briefing
- 09h30 – Départ (les deux parcours)
- 11h30 – Prévision 1ère arrivée Semi-Marathon 40km
- 12h30 – Début du déjeuner
- 13h00 – Prévision 1ère arrivée Marathon 60km
- 13h30 – Remise des prix

---

## 🎽 L'inscription comprend

- Souvenir de l'événement
- Assurance accidents personnels et responsabilité civile
- Ravitaillements solides et liquides (3 pour Marathon, 2 pour Semi-Marathon)
- Support logistique
- Douches chaudes
- Station de lavage vélos

---

## 🍽️ Extras optionnels

- Déjeuner participants : 12,50 €
- Déjeuner accompagnants : 14,50 €
- Maillot manches courtes : 22 €
- Maillot manches longues : 26 €

---

🚴 **Venez pédaler avec vue sur le Château d'Almourol !** 🏰`,
      city: "Vila Nova da Barquinha",
      metaTitle:
        "17ème VTT Almourol à Vista 2026 | Vila Nova da Barquinha | 26 Avril",
      metaDescription:
        "17ème Marathon VTT Almourol à Vista le 26 avril 2026 à Vila Nova da Barquinha. Marathon 60km et Semi-Marathon 40km. Troféu BTT Ribatejo Norte. Catégories Gravel et E-Bike.",
    },
    de: {
      title: "17. MTB-Marathon Almourol à Vista 2026",
      description: `# 🚴 17. MTB-Marathon Almourol à Vista 2026

**Die 17. Ausgabe des MTB-Marathons Almourol à Vista findet am 26. April 2026 in Vila Nova da Barquinha statt!** Organisiert vom **Grupo Cicloturismo Barquinhense**, ist das Rennen Teil des **Troféu BTT Ribatejo Norte**.

Start und Ziel an der **Avenida dos Plátanos**, neben dem **Parque Ribeirinho**. Zwei Rundstrecken über Wege und Pfade der Region, mit Blick auf die ikonische **Burg Almourol**.

Halbautarkes Rennen — keine Becher oder Flaschen verteilt. Jeder Athlet muss seinen eigenen Behälter mitbringen. Helmpflicht während des gesamten Rennens.

---

## 🚴 Strecken

- **Marathon** – 60 km · D+1200m · Schwierigkeit 3/5 · Limit 6h
- **Halbmarathon** – 40 km · D+750m · Schwierigkeit 3/5 · Limit 4h30

MTB-, Gravel- und E-Bike-Räder (Norm EN 15194) zugelassen. Mixed-Pairs-Kategorien verfügbar.

---

## ⏰ Zeitplan

**Samstag, 25. April:**
- 16:00 – Eröffnung des Sekretariats
- 20:00 – Schließung des Sekretariats

**Sonntag, 26. April:**
- 07:30 – Eröffnung des Sekretariats
- 08:45 – Öffnung der Startkontrolle
- 09:15 – Schließung des Sekretariats
- 09:20 – Briefing
- 09:30 – Start (beide Strecken)
- 11:30 – Voraussichtlich 1. Zieleinlauf Halbmarathon 40km
- 12:30 – Mittagessen beginnt
- 13:00 – Voraussichtlich 1. Zieleinlauf Marathon 60km
- 13:30 – Preisverleihung

---

## 🎽 Die Anmeldung beinhaltet

- Veranstaltungsandenken
- Unfall- und Haftpflichtversicherung
- Feste und flüssige Verpflegung (3 beim Marathon, 2 beim Halbmarathon)
- Logistische Unterstützung
- Warme Duschen
- Fahrradwaschstation

---

## 🍽️ Optionale Extras

- Mittagessen Teilnehmer: 12,50 €
- Mittagessen Begleiter: 14,50 €
- Trikot Kurzarm: 22 €
- Trikot Langarm: 26 €

---

🚴 **Komm und radle mit Blick auf die Burg Almourol!** 🏰`,
      city: "Vila Nova da Barquinha",
      metaTitle:
        "17. MTB Almourol à Vista 2026 | Vila Nova da Barquinha | 26. April",
      metaDescription:
        "17. MTB-Marathon Almourol à Vista am 26. April 2026 in Vila Nova da Barquinha. Marathon 60km und Halbmarathon 40km. Troféu BTT Ribatejo Norte. Gravel- und E-Bike-Kategorien.",
    },
    it: {
      title: "17ª Maratona MTB Almourol à Vista 2026",
      description: `# 🚴 17ª Maratona MTB Almourol à Vista 2026

**La 17ª edizione della Maratona MTB Almourol à Vista si svolge il 26 aprile 2026 a Vila Nova da Barquinha!** Organizzata dal **Grupo Cicloturismo Barquinhense**, la gara fa parte del **Troféu BTT Ribatejo Norte**.

Partenza e arrivo all'**Avenida dos Plátanos**, accanto al **Parque Ribeirinho**. Due percorsi circolari attraverso sentieri e strade della regione, con vista sull'iconico **Castello di Almourol**.

Gara in **semi-autosufficienza** — niente bicchieri né bottiglie distribuiti. Ogni atleta deve portare il proprio contenitore. Casco obbligatorio durante tutta la gara.

---

## 🚴 Percorsi

- **Maratona** – 60 km · D+1200m · Difficoltà 3/5 · Limite 6h
- **Mezza Maratona** – 40 km · D+750m · Difficoltà 3/5 · Limite 4h30

Ammesse biciclette MTB, Gravel e E-Bike (norma EN 15194). Categorie Coppie Miste disponibili.

---

## ⏰ Programma

**Sabato 25 Aprile:**
- 16:00 – Apertura segreteria
- 20:00 – Chiusura segreteria

**Domenica 26 Aprile:**
- 07:30 – Apertura segreteria
- 08:45 – Apertura controllo partenza
- 09:15 – Chiusura segreteria
- 09:20 – Briefing
- 09:30 – Partenza (entrambi i percorsi)
- 11:30 – Previsione 1° arrivo Mezza Maratona 40km
- 12:30 – Inizio pranzo
- 13:00 – Previsione 1° arrivo Maratona 60km
- 13:30 – Premiazione

---

## 🎽 L'iscrizione include

- Ricordo dell'evento
- Assicurazione infortuni personali e responsabilità civile
- Rifornimenti solidi e liquidi (3 per Maratona, 2 per Mezza Maratona)
- Supporto logistico
- Docce calde
- Stazione lavaggio biciclette

---

## 🍽️ Extra opzionali

- Pranzo partecipanti: 12,50 €
- Pranzo accompagnatori: 14,50 €
- Maglia maniche corte: 22 €
- Maglia maniche lunghe: 26 €

---

🚴 **Vieni a pedalare con vista sul Castello di Almourol!** 🏰`,
      city: "Vila Nova da Barquinha",
      metaTitle:
        "17ª MTB Almourol à Vista 2026 | Vila Nova da Barquinha | 26 Aprile",
      metaDescription:
        "17ª Maratona MTB Almourol à Vista il 26 aprile 2026 a Vila Nova da Barquinha. Maratona 60km e Mezza Maratona 40km. Troféu BTT Ribatejo Norte. Categorie Gravel ed E-Bike.",
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
  // 3. Variants
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

  // ── Variant 1: Maratona (60 km) ──
  const maratona = await findOrCreateVariant({
    name: "Maratona",
    distanceKm: 60,
    elevationGainM: 1200,
    elevationLossM: 1200,
    startDate: new Date("2026-04-26T09:30:00Z"),
    startTime: "09:30",
    cutoffTimeHours: 6,
    price: 22.0,
    currency: Currency.EUR,
    maxParticipants: 1000,
    atrpGrade: null,
    itraPoints: null,
    description: "Maratona BTT · 60 km · D+1200m · Cutoff 6h · Dificuldade 3/5",
  });
  console.log(`✅ Variant: ${maratona.name}`);

  // ── Variant 2: Meia-Maratona / Passeio (40 km) ──
  const meiaMaratona = await findOrCreateVariant({
    name: "Meia-Maratona",
    distanceKm: 40,
    elevationGainM: 750,
    elevationLossM: 750,
    startDate: new Date("2026-04-26T09:30:00Z"),
    startTime: "09:30",
    cutoffTimeHours: 4.5,
    price: 22.0,
    currency: Currency.EUR,
    maxParticipants: 1000,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Meia-Maratona BTT · 40 km · D+750m · Cutoff 4h30 · Dificuldade 3/5",
  });
  console.log(`✅ Variant: ${meiaMaratona.name}`);

  // ── Variant Translations (ALL 6 languages) ──
  const variantTranslations: Record<
    string,
    Record<string, { name: string; description: string | null }>
  > = {
    maratona: {
      pt: {
        name: "Maratona",
        description:
          "Maratona BTT · 60 km · D+1200m · Cutoff 6h · Dificuldade 3/5",
      },
      en: {
        name: "Marathon",
        description:
          "MTB Marathon · 60 km · D+1200m · Cutoff 6h · Difficulty 3/5",
      },
      es: {
        name: "Maratón",
        description:
          "Maratón BTT · 60 km · D+1200m · Límite 6h · Dificultad 3/5",
      },
      fr: {
        name: "Marathon",
        description:
          "Marathon VTT · 60 km · D+1200m · Limite 6h · Difficulté 3/5",
      },
      de: {
        name: "Marathon",
        description:
          "MTB-Marathon · 60 km · D+1200m · Limit 6h · Schwierigkeit 3/5",
      },
      it: {
        name: "Maratona",
        description:
          "Maratona MTB · 60 km · D+1200m · Limite 6h · Difficoltà 3/5",
      },
    },
    meiaMaratona: {
      pt: {
        name: "Meia-Maratona",
        description:
          "Meia-Maratona BTT · 40 km · D+750m · Cutoff 4h30 · Dificuldade 3/5",
      },
      en: {
        name: "Half Marathon",
        description:
          "MTB Half Marathon · 40 km · D+750m · Cutoff 4h30 · Difficulty 3/5",
      },
      es: {
        name: "Media Maratón",
        description:
          "Media Maratón BTT · 40 km · D+750m · Límite 4h30 · Dificultad 3/5",
      },
      fr: {
        name: "Semi-Marathon",
        description:
          "Semi-Marathon VTT · 40 km · D+750m · Limite 4h30 · Difficulté 3/5",
      },
      de: {
        name: "Halbmarathon",
        description:
          "MTB-Halbmarathon · 40 km · D+750m · Limit 4h30 · Schwierigkeit 3/5",
      },
      it: {
        name: "Mezza Maratona",
        description:
          "Mezza Maratona MTB · 40 km · D+750m · Limite 4h30 · Difficoltà 3/5",
      },
    },
  };

  const variantMap = [
    { variant: maratona, key: "maratona" },
    { variant: meiaMaratona, key: "meiaMaratona" },
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
  // 4. Pricing Phases (linked to eventId AND variantId)
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

  // Phase 1: Dec 20, 2025 → Mar 1, 2026 (or first 750)
  await findOrCreatePricingPhase("Maratona - 1ª Fase", maratona.id, {
    startDate: new Date("2025-12-20T00:00:00Z"),
    endDate: new Date("2026-03-01T23:59:59Z"),
    price: 20.0,
    currency: Currency.EUR,
    note: "Ou primeiras 750 inscrições",
  });
  await findOrCreatePricingPhase("Meia-Maratona - 1ª Fase", meiaMaratona.id, {
    startDate: new Date("2025-12-20T00:00:00Z"),
    endDate: new Date("2026-03-01T23:59:59Z"),
    price: 20.0,
    currency: Currency.EUR,
    note: "Ou primeiras 750 inscrições",
  });
  console.log("✅ Pricing Phase 1 created for all variants");

  // Phase 2: Mar 2, 2026 → Apr 15, 2026
  await findOrCreatePricingPhase("Maratona - 2ª Fase", maratona.id, {
    startDate: new Date("2026-03-02T00:00:00Z"),
    endDate: new Date("2026-04-15T23:59:59Z"),
    price: 22.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Meia-Maratona - 2ª Fase", meiaMaratona.id, {
    startDate: new Date("2026-03-02T00:00:00Z"),
    endDate: new Date("2026-04-15T23:59:59Z"),
    price: 22.0,
    currency: Currency.EUR,
    note: null,
  });
  console.log("✅ Pricing Phase 2 created for all variants");

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
    "Sábado 25 de abril: Secretariado das 16:00 às 20:00 (Avenida dos Plátanos, junto ao Parque Ribeirinho). Domingo 26 de abril: Secretariado das 07:30 às 09:15. 08:45 – Abertura do controlo de partida. 09:20 – Briefing. 09:30 – Partida (ambos os percursos). 11:30 – Previsão 1º chegada Passeio 40km. 12:30 – Início do almoço convívio. 13:00 – Previsão 1º chegada Maratona 60km. 13:30 – Entrega de prémios."
  );

  const faq0Translations = {
    pt: {
      question: "Qual é o horário do evento?",
      answer:
        "Sábado 25 de abril: Secretariado das 16:00 às 20:00 (Avenida dos Plátanos, junto ao Parque Ribeirinho). Domingo 26 de abril: Secretariado das 07:30 às 09:15. 08:45 – Abertura do controlo de partida. 09:20 – Briefing. 09:30 – Partida (ambos os percursos). 11:30 – Previsão 1º chegada Passeio 40km. 12:30 – Início do almoço convívio. 13:00 – Previsão 1º chegada Maratona 60km. 13:30 – Entrega de prémios.",
    },
    en: {
      question: "What is the event schedule?",
      answer:
        "Saturday April 25: Registration 16:00–20:00 (Avenida dos Plátanos, next to Parque Ribeirinho). Sunday April 26: Registration 07:30–09:15. 08:45 – Start control opens. 09:20 – Briefing. 09:30 – Start (both courses). 11:30 – Expected first finisher Half Marathon 40km. 12:30 – Lunch. 13:00 – Expected first finisher Marathon 60km. 13:30 – Prize ceremony.",
    },
    es: {
      question: "¿Cuál es el horario del evento?",
      answer:
        "Sábado 25 de abril: Secretaría de 16:00 a 20:00 (Avenida dos Plátanos, junto al Parque Ribeirinho). Domingo 26 de abril: Secretaría de 07:30 a 09:15. 08:45 – Apertura del control de salida. 09:20 – Briefing. 09:30 – Salida (ambos recorridos). 11:30 – Previsión 1ª llegada Media Maratón 40km. 12:30 – Almuerzo. 13:00 – Previsión 1ª llegada Maratón 60km. 13:30 – Entrega de premios.",
    },
    fr: {
      question: "Quel est le programme de l'événement ?",
      answer:
        "Samedi 25 avril : Secrétariat de 16h00 à 20h00 (Avenida dos Plátanos, près du Parque Ribeirinho). Dimanche 26 avril : Secrétariat de 07h30 à 09h15. 08h45 – Ouverture du contrôle de départ. 09h20 – Briefing. 09h30 – Départ (les deux parcours). 11h30 – Prévision 1ère arrivée Semi-Marathon 40km. 12h30 – Déjeuner. 13h00 – Prévision 1ère arrivée Marathon 60km. 13h30 – Remise des prix.",
    },
    de: {
      question: "Wie ist der Zeitplan der Veranstaltung?",
      answer:
        "Samstag 25. April: Sekretariat von 16:00 bis 20:00 (Avenida dos Plátanos, neben dem Parque Ribeirinho). Sonntag 26. April: Sekretariat von 07:30 bis 09:15. 08:45 – Öffnung der Startkontrolle. 09:20 – Briefing. 09:30 – Start (beide Strecken). 11:30 – Voraussichtlich 1. Zieleinlauf Halbmarathon 40km. 12:30 – Mittagessen. 13:00 – Voraussichtlich 1. Zieleinlauf Marathon 60km. 13:30 – Preisverleihung.",
    },
    it: {
      question: "Qual è il programma dell'evento?",
      answer:
        "Sabato 25 aprile: Segreteria dalle 16:00 alle 20:00 (Avenida dos Plátanos, accanto al Parque Ribeirinho). Domenica 26 aprile: Segreteria dalle 07:30 alle 09:15. 08:45 – Apertura controllo partenza. 09:20 – Briefing. 09:30 – Partenza (entrambi i percorsi). 11:30 – Previsione 1° arrivo Mezza Maratona 40km. 12:30 – Pranzo. 13:00 – Previsione 1° arrivo Maratona 60km. 13:30 – Premiazione.",
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
    "Lembrança do evento, seguro de acidentes pessoal e responsabilidade civil, abastecimentos sólidos e líquidos (Maratona: 3, Meia-Maratona: 2), apoio logístico, banhos quentes e local para lavagem de bicicletas. Cronometragem por chip eletrónico."
  );

  const faq1Translations = {
    pt: {
      question: "O que está incluído na inscrição?",
      answer:
        "Lembrança do evento, seguro de acidentes pessoal e responsabilidade civil, abastecimentos sólidos e líquidos (Maratona: 3, Meia-Maratona: 2), apoio logístico, banhos quentes e local para lavagem de bicicletas. Cronometragem por chip eletrónico.",
    },
    en: {
      question: "What is included in the registration?",
      answer:
        "Event souvenir, personal accident and civil liability insurance, solid and liquid aid stations (Marathon: 3, Half Marathon: 2), logistic support, hot showers and bike wash station. Electronic chip timing.",
    },
    es: {
      question: "¿Qué incluye la inscripción?",
      answer:
        "Recuerdo del evento, seguro de accidentes personal y responsabilidad civil, avituallamientos sólidos y líquidos (Maratón: 3, Media Maratón: 2), apoyo logístico, duchas calientes y zona de lavado de bicicletas. Cronometraje por chip electrónico.",
    },
    fr: {
      question: "Que comprend l'inscription ?",
      answer:
        "Souvenir de l'événement, assurance accidents personnels et responsabilité civile, ravitaillements solides et liquides (Marathon : 3, Semi-Marathon : 2), support logistique, douches chaudes et station de lavage vélos. Chronométrage par puce électronique.",
    },
    de: {
      question: "Was ist in der Anmeldung enthalten?",
      answer:
        "Veranstaltungsandenken, Unfall- und Haftpflichtversicherung, feste und flüssige Verpflegung (Marathon: 3, Halbmarathon: 2), logistische Unterstützung, warme Duschen und Fahrradwaschstation. Elektronische Chipzeitmessung.",
    },
    it: {
      question: "Cosa è incluso nell'iscrizione?",
      answer:
        "Ricordo dell'evento, assicurazione infortuni personali e responsabilità civile, rifornimenti solidi e liquidi (Maratona: 3, Mezza Maratona: 2), supporto logistico, docce calde e stazione lavaggio biciclette. Cronometraggio con chip elettronico.",
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

  // ── FAQ 2: Bicycles & equipment ──
  const faq2 = await findOrCreateFAQ(
    event.id,
    2,
    "Que bicicletas são permitidas e qual o material obrigatório?",
    "São permitidas bicicletas BTT, Gravel e E-Bike (norma EN 15194 — motor até 250W, desliga a 25 km/h). E-Bikes partem na última box do pelotão. O uso de capacete é OBRIGATÓRIO durante toda a prova — atletas sem capacete serão desclassificados. Recomenda-se GPS/conta-quilómetros e reservatório de água."
  );

  const faq2Translations = {
    pt: {
      question: "Que bicicletas são permitidas e qual o material obrigatório?",
      answer:
        "São permitidas bicicletas BTT, Gravel e E-Bike (norma EN 15194 — motor até 250W, desliga a 25 km/h). E-Bikes partem na última box do pelotão. O uso de capacete é OBRIGATÓRIO durante toda a prova — atletas sem capacete serão desclassificados. Recomenda-se GPS/conta-quilómetros e reservatório de água.",
    },
    en: {
      question: "What bicycles are allowed and what equipment is mandatory?",
      answer:
        "MTB, Gravel and E-Bike (EN 15194 standard — motor up to 250W, cut-off at 25 km/h) are allowed. E-Bikes start from the last box in the peloton. Helmet is MANDATORY throughout the race — athletes without helmet will be disqualified. GPS/odometer and water reservoir are recommended.",
    },
    es: {
      question:
        "¿Qué bicicletas están permitidas y cuál es el equipamiento obligatorio?",
      answer:
        "Se permiten bicicletas BTT, Gravel y E-Bike (norma EN 15194 — motor hasta 250W, se desconecta a 25 km/h). Las E-Bikes salen en la última box del pelotón. El uso de casco es OBLIGATORIO durante toda la prueba — atletas sin casco serán descalificados. Se recomienda GPS/cuentakilómetros y depósito de agua.",
    },
    fr: {
      question:
        "Quels vélos sont autorisés et quel équipement est obligatoire ?",
      answer:
        "Les vélos VTT, Gravel et E-Bike (norme EN 15194 — moteur jusqu'à 250W, coupure à 25 km/h) sont autorisés. Les E-Bikes partent de la dernière box du peloton. Le port du casque est OBLIGATOIRE pendant toute la course — les athlètes sans casque seront disqualifiés. GPS/compteur et réservoir d'eau recommandés.",
    },
    de: {
      question:
        "Welche Fahrräder sind zugelassen und welche Ausrüstung ist Pflicht?",
      answer:
        "MTB-, Gravel- und E-Bike-Räder (Norm EN 15194 — Motor bis 250W, Abschaltung bei 25 km/h) sind zugelassen. E-Bikes starten aus der letzten Box des Pelotons. Helmpflicht während des GESAMTEN Rennens — Athleten ohne Helm werden disqualifiziert. GPS/Tacho und Wasserbehälter werden empfohlen.",
    },
    it: {
      question:
        "Quali biciclette sono ammesse e quale equipaggiamento è obbligatorio?",
      answer:
        "Ammesse biciclette MTB, Gravel e E-Bike (norma EN 15194 — motore fino a 250W, spegnimento a 25 km/h). Le E-Bike partono dall'ultima box del gruppo. Il casco è OBBLIGATORIO durante tutta la gara — atleti senza casco saranno squalificati. Consigliati GPS/contachilometri e serbatoio d'acqua.",
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
  console.log("✅ FAQ 2: Bicycles & equipment");

  // ── FAQ 3: Prizes ──
  const faq3 = await findOrCreateFAQ(
    event.id,
    3,
    "Quais são os prémios?",
    "Maratona 60km e Meia-Maratona 40km: classificação geral M/F, classificação geral Gravel M/F, classificação por escalões (Sub-23/Elites, M30, M35, M40, M45, M50, M55, M60, Sub-23/Elites F, F30, F35/40, F45+), classificação Duplas Mistas. Entrega de prémios: 26 de abril às 13:30 no local de partida/chegada."
  );

  const faq3Translations = {
    pt: {
      question: "Quais são os prémios?",
      answer:
        "Maratona 60km e Meia-Maratona 40km: classificação geral M/F, classificação geral Gravel M/F, classificação por escalões (Sub-23/Elites, M30, M35, M40, M45, M50, M55, M60, Sub-23/Elites F, F30, F35/40, F45+), classificação Duplas Mistas. Entrega de prémios: 26 de abril às 13:30 no local de partida/chegada.",
    },
    en: {
      question: "What are the prizes?",
      answer:
        "Marathon 60km and Half Marathon 40km: overall classification M/F, Gravel overall M/F, age category classification (U23/Elite, M30, M35, M40, M45, M50, M55, M60, U23/Elite F, F30, F35/40, F45+), Mixed Pairs classification. Prize ceremony: April 26 at 13:30 at start/finish.",
    },
    es: {
      question: "¿Cuáles son los premios?",
      answer:
        "Maratón 60km y Media Maratón 40km: clasificación general M/F, clasificación general Gravel M/F, clasificación por categorías de edad (Sub-23/Élites, M30, M35, M40, M45, M50, M55, M60, Sub-23/Élites F, F30, F35/40, F45+), clasificación Parejas Mixtas. Entrega de premios: 26 de abril a las 13:30 en la salida/meta.",
    },
    fr: {
      question: "Quels sont les prix ?",
      answer:
        "Marathon 60km et Semi-Marathon 40km : classement général H/F, classement général Gravel H/F, classement par catégories d'âge (U23/Élites, M30, M35, M40, M45, M50, M55, M60, U23/Élites F, F30, F35/40, F45+), classement Paires Mixtes. Remise des prix : 26 avril à 13h30 au départ/arrivée.",
    },
    de: {
      question: "Welche Preise gibt es?",
      answer:
        "Marathon 60km und Halbmarathon 40km: Gesamtwertung M/W, Gesamtwertung Gravel M/W, Altersklassenwertung (U23/Elite, M30, M35, M40, M45, M50, M55, M60, U23/Elite W, W30, W35/40, W45+), Mixed-Pairs-Wertung. Preisverleihung: 26. April um 13:30 am Start/Ziel.",
    },
    it: {
      question: "Quali sono i premi?",
      answer:
        "Maratona 60km e Mezza Maratona 40km: classifica generale M/F, classifica generale Gravel M/F, classifica per fasce d'età (U23/Elite, M30, M35, M40, M45, M50, M55, M60, U23/Elite F, F30, F35/40, F45+), classifica Coppie Miste. Premiazione: 26 aprile alle 13:30 alla partenza/arrivo.",
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
  console.log("✅ FAQ 3: Prizes");

  // ── FAQ 4: Optional lunch & jersey ──
  const faq4 = await findOrCreateFAQ(
    event.id,
    4,
    "Há almoço e jersey disponíveis?",
    "Almoço opcional servido no event center (junto da partida/chegada). Participantes: 12,50 € (sopa, rojões com massa, pão, fruta e bebida). Acompanhantes: 14,50 €. Limite de 250 almoços — reserva no ato de inscrição. Jersey alusivo ao evento (até 15 de abril): manga curta 22 €, manga comprida 26 €."
  );

  const faq4Translations = {
    pt: {
      question: "Há almoço e jersey disponíveis?",
      answer:
        "Almoço opcional servido no event center (junto da partida/chegada). Participantes: 12,50 € (sopa, rojões com massa, pão, fruta e bebida). Acompanhantes: 14,50 €. Limite de 250 almoços — reserva no ato de inscrição. Jersey alusivo ao evento (até 15 de abril): manga curta 22 €, manga comprida 26 €.",
    },
    en: {
      question: "Is lunch and a jersey available?",
      answer:
        "Optional lunch served at the event center (at start/finish). Participants: €12.50 (soup, rojões with pasta, bread, fruit and drink). Companions: €14.50. Limit of 250 lunches — reserve at registration. Event jersey (until April 15): short sleeve €22, long sleeve €26.",
    },
    es: {
      question: "¿Hay almuerzo y jersey disponibles?",
      answer:
        "Almuerzo opcional servido en el event center (junto a la salida/meta). Participantes: 12,50 € (sopa, rojões con pasta, pan, fruta y bebida). Acompañantes: 14,50 €. Límite de 250 almuerzos — reserva en el momento de la inscripción. Jersey del evento (hasta 15 de abril): manga corta 22 €, manga larga 26 €.",
    },
    fr: {
      question: "Y a-t-il un déjeuner et un maillot disponibles ?",
      answer:
        "Déjeuner optionnel servi à l'event center (au départ/arrivée). Participants : 12,50 € (soupe, rojões aux pâtes, pain, fruit et boisson). Accompagnants : 14,50 €. Limite de 250 déjeuners — réservation à l'inscription. Maillot de l'événement (jusqu'au 15 avril) : manches courtes 22 €, manches longues 26 €.",
    },
    de: {
      question: "Gibt es Mittagessen und ein Trikot?",
      answer:
        "Optionales Mittagessen im Event Center (am Start/Ziel). Teilnehmer: 12,50 € (Suppe, Rojões mit Pasta, Brot, Obst und Getränk). Begleiter: 14,50 €. Limit von 250 Mittagessen — Reservierung bei der Anmeldung. Event-Trikot (bis 15. April): Kurzarm 22 €, Langarm 26 €.",
    },
    it: {
      question: "Sono disponibili pranzo e maglia?",
      answer:
        "Pranzo opzionale servito nell'event center (alla partenza/arrivo). Partecipanti: 12,50 € (zuppa, rojões con pasta, pane, frutta e bevanda). Accompagnatori: 14,50 €. Limite di 250 pranzi — prenotazione al momento dell'iscrizione. Maglia dell'evento (fino al 15 aprile): maniche corte 22 €, maniche lunghe 26 €.",
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
  console.log("✅ FAQ 4: Lunch & jersey");

  // ── FAQ 5: Self-sufficiency & aid stations ──
  const faq5 = await findOrCreateFAQ(
    event.id,
    5,
    "Como funcionam os abastecimentos?",
    "Prova em semi-autossuficiência — não são distribuídos copos nem garrafas plásticas. Cada atleta deve trazer o seu recipiente para hidratação. Maratona 60km: 3 abastecimentos sólidos e líquidos. Meia-Maratona 40km: 2 abastecimentos sólidos e líquidos. Apoio técnico apenas permitido nos postos de abastecimento."
  );

  const faq5Translations = {
    pt: {
      question: "Como funcionam os abastecimentos?",
      answer:
        "Prova em semi-autossuficiência — não são distribuídos copos nem garrafas plásticas. Cada atleta deve trazer o seu recipiente para hidratação. Maratona 60km: 3 abastecimentos sólidos e líquidos. Meia-Maratona 40km: 2 abastecimentos sólidos e líquidos. Apoio técnico apenas permitido nos postos de abastecimento.",
    },
    en: {
      question: "How do the aid stations work?",
      answer:
        "Semi self-sufficiency race — no cups or plastic bottles distributed. Each athlete must bring their own container for hydration. Marathon 60km: 3 aid stations with food and liquids. Half Marathon 40km: 2 aid stations with food and liquids. External support only allowed at aid stations.",
    },
    es: {
      question: "¿Cómo funcionan los avituallamientos?",
      answer:
        "Prueba en semi-autosuficiencia — no se distribuyen vasos ni botellas plásticas. Cada atleta debe traer su recipiente para hidratación. Maratón 60km: 3 avituallamientos sólidos y líquidos. Media Maratón 40km: 2 avituallamientos sólidos y líquidos. Apoyo técnico solo permitido en los avituallamientos.",
    },
    fr: {
      question: "Comment fonctionnent les ravitaillements ?",
      answer:
        "Course en semi-autosuffisance — ni gobelets ni bouteilles plastiques distribués. Chaque athlète doit apporter son récipient pour l'hydratation. Marathon 60km : 3 ravitaillements solides et liquides. Semi-Marathon 40km : 2 ravitaillements solides et liquides. Assistance technique uniquement aux postes de ravitaillement.",
    },
    de: {
      question: "Wie funktionieren die Verpflegungsstationen?",
      answer:
        "Halbautarkes Rennen — keine Becher oder Plastikflaschen verteilt. Jeder Athlet muss seinen eigenen Behälter für die Hydratation mitbringen. Marathon 60km: 3 Verpflegungsstationen mit Essen und Getränken. Halbmarathon 40km: 2 Verpflegungsstationen mit Essen und Getränken. Technische Unterstützung nur an Verpflegungsstationen erlaubt.",
    },
    it: {
      question: "Come funzionano i rifornimenti?",
      answer:
        "Gara in semi-autosufficienza — niente bicchieri né bottiglie di plastica distribuiti. Ogni atleta deve portare il proprio contenitore per l'idratazione. Maratona 60km: 3 rifornimenti solidi e liquidi. Mezza Maratona 40km: 2 rifornimenti solidi e liquidi. Assistenza tecnica consentita solo ai punti di rifornimento.",
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
  console.log("✅ FAQ 5: Aid stations");

  // ── FAQ 6: Contacts ──
  const faq6 = await findOrCreateFAQ(
    event.id,
    6,
    "Quais são os contactos da organização?",
    "E-mail: almourolavista@gcbarquinhense.pt (organização e recibos) / infotrilhoperdido@gmail.com (inscrições). Telefones: 915 768 307 (Calado) / 917 501 189 (Vítor). Site: gcbarquinhense.pt. Facebook: facebook.com/groups/166410186734054."
  );

  const faq6Translations = {
    pt: {
      question: "Quais são os contactos da organização?",
      answer:
        "E-mail: almourolavista@gcbarquinhense.pt (organização e recibos) / infotrilhoperdido@gmail.com (inscrições). Telefones: 915 768 307 (Calado) / 917 501 189 (Vítor). Site: gcbarquinhense.pt. Facebook: facebook.com/groups/166410186734054.",
    },
    en: {
      question: "What are the organization's contacts?",
      answer:
        "Email: almourolavista@gcbarquinhense.pt (organization and receipts) / infotrilhoperdido@gmail.com (registrations). Phone: 915 768 307 (Calado) / 917 501 189 (Vítor). Website: gcbarquinhense.pt. Facebook: facebook.com/groups/166410186734054.",
    },
    es: {
      question: "¿Cuáles son los contactos de la organización?",
      answer:
        "E-mail: almourolavista@gcbarquinhense.pt (organización y recibos) / infotrilhoperdido@gmail.com (inscripciones). Teléfonos: 915 768 307 (Calado) / 917 501 189 (Vítor). Web: gcbarquinhense.pt. Facebook: facebook.com/groups/166410186734054.",
    },
    fr: {
      question: "Quels sont les contacts de l'organisation ?",
      answer:
        "E-mail : almourolavista@gcbarquinhense.pt (organisation et reçus) / infotrilhoperdido@gmail.com (inscriptions). Téléphone : 915 768 307 (Calado) / 917 501 189 (Vítor). Site : gcbarquinhense.pt. Facebook : facebook.com/groups/166410186734054.",
    },
    de: {
      question: "Was sind die Kontaktdaten der Organisation?",
      answer:
        "E-Mail: almourolavista@gcbarquinhense.pt (Organisation und Belege) / infotrilhoperdido@gmail.com (Anmeldung). Telefon: 915 768 307 (Calado) / 917 501 189 (Vítor). Website: gcbarquinhense.pt. Facebook: facebook.com/groups/166410186734054.",
    },
    it: {
      question: "Quali sono i contatti dell'organizzazione?",
      answer:
        "E-mail: almourolavista@gcbarquinhense.pt (organizzazione e ricevute) / infotrilhoperdido@gmail.com (iscrizioni). Telefono: 915 768 307 (Calado) / 917 501 189 (Vítor). Sito: gcbarquinhense.pt. Facebook: facebook.com/groups/166410186734054.",
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
  console.log("✅ FAQ 6: Contacts");

  // ──────────────────────────────────────────────
  // Done
  // ──────────────────────────────────────────────
  console.log(`
🚴 17º Maratona BTT Almourol à Vista 2026 seed completed!
──────────────────────────────────────────────
- Slug: maratona-btt-almourol-a-vista-2026
- Date: April 26, 2026
- Location: Avenida dos Plátanos, Vila Nova da Barquinha
- Variants: Maratona (60km, D+1200m), Meia-Maratona (40km, D+750m)
- Pricing Phases: 2 phases × 2 variants = 4 pricing phases
- FAQs: 7 with translations in 6 languages
- Circuit: Troféu BTT Ribatejo Norte
- Categories: BTT, Gravel, E-Bike, Duplas Mistas
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
