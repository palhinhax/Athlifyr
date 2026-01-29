import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

const languages = [
  Language.pt,
  Language.en,
  Language.es,
  Language.fr,
  Language.de,
  Language.it,
] as const;

async function main() {
  console.log("🏃 Seeding Famalicão Joane 2026...");

  const eventSlug = "famalicao-joane-2026";

  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "Famalicão Joane 2026",
      description:
        "XXVI Famalicão Joane (11,2 km), I Corrida da Família Joane (4 km) e XXIII Vermoim Joane (caminhada 4 km) com partida em Vermoim e Famalicão e meta no Parque da Ribeira, Joane.",
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-05-17T08:30:00Z"),
      endDate: new Date("2026-05-17T12:30:00Z"),
      city: "Joane",
      country: "Portugal",
      latitude: 41.455,
      longitude: -8.365,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Joane+Vila+Nova+de+Famalic%C3%A3o+Portugal",
      externalUrl: "https://www.famalicaojoane.pt",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-05-10T23:59:59Z"),
    },
    create: {
      slug: eventSlug,
      title: "Famalicão Joane 2026",
      description:
        "XXVI Famalicão Joane (11,2 km), I Corrida da Família Joane (4 km) e XXIII Vermoim Joane (caminhada 4 km) com partida em Vermoim e Famalicão e meta no Parque da Ribeira, Joane.",
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-05-17T08:30:00Z"),
      endDate: new Date("2026-05-17T12:30:00Z"),
      city: "Joane",
      country: "Portugal",
      latitude: 41.455,
      longitude: -8.365,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Joane+Vila+Nova+de+Famalic%C3%A3o+Portugal",
      externalUrl: "https://www.famalicaojoane.pt",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-05-10T23:59:59Z"),
    },
  });

  console.log(`✅ Event upserted: ${event.slug} (ID: ${event.id})`);

  const translations: Record<
    Language,
    {
      title: string;
      description: string;
      city: string;
      metaTitle: string;
      metaDescription: string;
    }
  > = {
    [Language.pt]: {
      title: "Famalicão Joane 2026",
      description: `# 🏃‍♂️ Famalicão Joane 2026

No **domingo, 17 de maio de 2026**, Joane recebe três provas num só evento:

- **XXVI Famalicão Joane** – corrida de **11,2 km**
- **I Corrida da Família Joane** – corrida de **4 km**
- **XXIII Vermoim Joane** – caminhada de **4 km**

## 📍 Local

**Cidade:** Joane, Vila Nova de Famalicão

**Meta:** Parque da Ribeira (Joane)

## ⏰ Horários

- **Corrida da Família (4 km):** 09H30
- **Caminhada Vermoim Joane (4 km):** 09H35
- **Corrida Famalicão Joane (11,2 km):** 10H30

## 🛣️ Percursos

- **4 km (corrida/caminhada):** partida junto à Igreja de Vermoim, seguindo até Joane e meta no Parque da Ribeira.
- **11,2 km:** partida junto ao LIDL (Av. Marechal Humberto Delgado) em Famalicão e meta no Parque da Ribeira.

## 🎟️ Inscrições e prazos

- **Data-limite:** 10/05/2026
- **Inscrições online:** [fpacompeticoes.pt](https://beta.fpacompeticoes.pt/inscriptions/5524)

## 💶 Preços (Corrida da Família + Caminhada)

**Até 1 de fevereiro**
- Grupos/Famílias (5+): **5€**
- Individual: **6€**

**2 de fevereiro a 31 de março**
- Grupos/Famílias (5+): **6€**
- Individual: **7€**

**1 de abril a 10 de maio**
- Individual: **8€**

## 💶 Preços (Corrida Famalicão Joane 11,2 km)

**1 de janeiro a 1 de fevereiro**
- Grupos/Famílias (5+): **7€**
- Individual: **8€**

**2 de fevereiro a 31 de março**
- Grupos/Famílias (5+): **8€**
- Individual: **10€**

**1 de abril a 10 de maio**
- Individual: **12€**

## 🚌 Transporte

A organização disponibiliza autocarros para as partidas e regresso a Joane. O acesso é permitido com dorsal.

## ✅ Participação

Evento aberto a atletas federados e populares. **Inscreve-te cedo** e garante o melhor preço! 🏅`,
      city: "Joane",
      metaTitle: "Famalicão Joane 2026 | Corrida 11,2 km + 4 km | Joane",
      metaDescription:
        "Famalicão Joane 2026 em Joane (17 maio). Corrida 11,2 km, Corrida da Família 4 km e Caminhada 4 km. Inscrições até 10/05/2026.",
    },
    [Language.en]: {
      title: "Famalicão Joane 2026",
      description: `# 🏃‍♂️ Famalicão Joane 2026

On **Sunday, May 17, 2026**, Joane hosts three races in one event:

- **XXVI Famalicão Joane** – **11.2 km** road race
- **I Corrida da Família Joane** – **4 km** family run
- **XXIII Vermoim Joane** – **4 km** walk

## 📍 Location

**City:** Joane, Vila Nova de Famalicão

**Finish:** Parque da Ribeira (Joane)

## ⏰ Schedule

- **Family Run (4 km):** 09:30
- **Vermoim Joane Walk (4 km):** 09:35
- **Famalicão Joane Race (11.2 km):** 10:30

## 🛣️ Courses

- **4 km (run/walk):** start near Vermoim Church, finishing in Joane.
- **11.2 km:** start near LIDL (Av. Marechal Humberto Delgado) in Famalicão, finish in Joane.

## 🎟️ Registration

- **Deadline:** 10/05/2026
- **Online registration:** [fpacompeticoes.pt](https://beta.fpacompeticoes.pt/inscriptions/5524)

## 💶 Pricing (Family Run + Walk)

**Until February 1**
- Groups/Families (5+): **€5**
- Individual: **€6**

**Feb 2 to Mar 31**
- Groups/Families (5+): **€6**
- Individual: **€7**

**Apr 1 to May 10**
- Individual: **€8**

## 💶 Pricing (Famalicão Joane 11.2 km)

**Jan 1 to Feb 1**
- Groups/Families (5+): **€7**
- Individual: **€8**

**Feb 2 to Mar 31**
- Groups/Families (5+): **€8**
- Individual: **€10**

**Apr 1 to May 10**
- Individual: **€12**

## 🚌 Transport

Buses are provided to the starts and back to Joane. Bib required for access.

## ✅ Take part

Open to federated and recreational athletes. **Register early** to secure the best price! 🏅`,
      city: "Joane",
      metaTitle: "Famalicão Joane 2026 | 11.2 km + 4 km | Joane",
      metaDescription:
        "Famalicão Joane 2026 in Joane (May 17). 11.2 km race, 4 km family run and 4 km walk. Registration deadline 10/05/2026.",
    },
    [Language.es]: {
      title: "Famalicão Joane 2026",
      description: `# 🏃‍♂️ Famalicão Joane 2026

El **domingo 17 de mayo de 2026**, Joane acoge tres pruebas en un mismo evento:

- **XXVI Famalicão Joane** – carrera de **11,2 km**
- **I Corrida da Família Joane** – carrera familiar de **4 km**
- **XXIII Vermoim Joane** – caminata de **4 km**

## 📍 Ubicación

**Ciudad:** Joane, Vila Nova de Famalicão

**Meta:** Parque da Ribeira (Joane)

## ⏰ Horarios

- **Carrera familiar (4 km):** 09:30
- **Caminata Vermoim Joane (4 km):** 09:35
- **Carrera Famalicão Joane (11,2 km):** 10:30

## 🛣️ Recorridos

- **4 km (carrera/caminata):** salida junto a la Iglesia de Vermoim y meta en Joane.
- **11,2 km:** salida junto a LIDL (Av. Marechal Humberto Delgado) en Famalicão y meta en Joane.

## 🎟️ Inscripciones

- **Fecha límite:** 10/05/2026
- **Inscripción online:** [fpacompeticoes.pt](https://beta.fpacompeticoes.pt/inscriptions/5524)

## 💶 Precios (Carrera Familiar + Caminata)

**Hasta el 1 de febrero**
- Grupos/Familias (5+): **5€**
- Individual: **6€**

**Del 2 de febrero al 31 de marzo**
- Grupos/Familias (5+): **6€**
- Individual: **7€**

**Del 1 de abril al 10 de mayo**
- Individual: **8€**

## 💶 Precios (Famalicão Joane 11,2 km)

**Del 1 de enero al 1 de febrero**
- Grupos/Familias (5+): **7€**
- Individual: **8€**

**Del 2 de febrero al 31 de marzo**
- Grupos/Familias (5+): **8€**
- Individual: **10€**

**Del 1 de abril al 10 de mayo**
- Individual: **12€**

## 🚌 Transporte

La organización ofrece autobuses para las salidas y regreso a Joane. Se requiere dorsal.

## ✅ Participación

Evento abierto a atletas federados y populares. **Inscríbete pronto** para asegurar el mejor precio. 🏅`,
      city: "Joane",
      metaTitle: "Famalicão Joane 2026 | 11,2 km + 4 km | Joane",
      metaDescription:
        "Famalicão Joane 2026 en Joane (17 de mayo). Carrera 11,2 km, carrera familiar 4 km y caminata 4 km. Inscripciones hasta 10/05/2026.",
    },
    [Language.fr]: {
      title: "Famalicão Joane 2026",
      description: `# 🏃‍♂️ Famalicão Joane 2026

Le **dimanche 17 mai 2026**, Joane accueille trois épreuves dans un seul événement :

- **XXVI Famalicão Joane** – course de **11,2 km**
- **I Corrida da Família Joane** – course familiale de **4 km**
- **XXIII Vermoim Joane** – marche de **4 km**

## 📍 Lieu

**Ville :** Joane, Vila Nova de Famalicão

**Arrivée :** Parque da Ribeira (Joane)

## ⏰ Horaires

- **Course familiale (4 km) :** 09H30
- **Marche Vermoim Joane (4 km) :** 09H35
- **Course Famalicão Joane (11,2 km) :** 10H30

## 🛣️ Parcours

- **4 km (course/marche) :** départ près de l'église de Vermoim, arrivée à Joane.
- **11,2 km :** départ près du LIDL (Av. Marechal Humberto Delgado) à Famalicão, arrivée à Joane.

## 🎟️ Inscriptions

- **Date limite :** 10/05/2026
- **Inscription en ligne :** [fpacompeticoes.pt](https://beta.fpacompeticoes.pt/inscriptions/5524)

## 💶 Tarifs (Course familiale + Marche)

**Jusqu'au 1er février**
- Groupes/Familles (5+) : **5€**
- Individuel : **6€**

**Du 2 février au 31 mars**
- Groupes/Familles (5+) : **6€**
- Individuel : **7€**

**Du 1er avril au 10 mai**
- Individuel : **8€**

## 💶 Tarifs (Famalicão Joane 11,2 km)

**Du 1er janvier au 1er février**
- Groupes/Familles (5+) : **7€**
- Individuel : **8€**

**Du 2 février au 31 mars**
- Groupes/Familles (5+) : **8€**
- Individuel : **10€**

**Du 1er avril au 10 mai**
- Individuel : **12€**

## 🚌 Transport

Des bus sont mis à disposition pour les départs et le retour à Joane. Dossard obligatoire.

## ✅ Participation

Ouvert aux athlètes fédérés et populaires. **Inscris-toi tôt** pour profiter du meilleur prix ! 🏅`,
      city: "Joane",
      metaTitle: "Famalicão Joane 2026 | 11,2 km + 4 km | Joane",
      metaDescription:
        "Famalicão Joane 2026 à Joane (17 mai). Course 11,2 km, course familiale 4 km et marche 4 km. Inscriptions jusqu'au 10/05/2026.",
    },
    [Language.de]: {
      title: "Famalicão Joane 2026",
      description: `# 🏃‍♂️ Famalicão Joane 2026

Am **Sonntag, 17. Mai 2026**, findet in Joane ein Event mit drei Läufen statt:

- **XXVI Famalicão Joane** – **11,2 km** Lauf
- **I Corrida da Família Joane** – **4 km** Familienlauf
- **XXIII Vermoim Joane** – **4 km** Walking

## 📍 Ort

**Stadt:** Joane, Vila Nova de Famalicão

**Ziel:** Parque da Ribeira (Joane)

## ⏰ Zeitplan

- **Familienlauf (4 km):** 09:30
- **Vermoim Joane Walking (4 km):** 09:35
- **Famalicão Joane Lauf (11,2 km):** 10:30

## 🛣️ Strecken

- **4 km (Lauf/Walking):** Start nahe der Kirche von Vermoim, Ziel in Joane.
- **11,2 km:** Start nahe LIDL (Av. Marechal Humberto Delgado) in Famalicão, Ziel in Joane.

## 🎟️ Anmeldung

- **Anmeldeschluss:** 10/05/2026
- **Online-Anmeldung:** [fpacompeticoes.pt](https://beta.fpacompeticoes.pt/inscriptions/5524)

## 💶 Preise (Familienlauf + Walking)

**Bis 1. Februar**
- Gruppen/Familien (5+): **5€**
- Einzel: **6€**

**2. Februar bis 31. März**
- Gruppen/Familien (5+): **6€**
- Einzel: **7€**

**1. April bis 10. Mai**
- Einzel: **8€**

## 💶 Preise (Famalicão Joane 11,2 km)

**1. Januar bis 1. Februar**
- Gruppen/Familien (5+): **7€**
- Einzel: **8€**

**2. Februar bis 31. März**
- Gruppen/Familien (5+): **8€**
- Einzel: **10€**

**1. April bis 10. Mai**
- Einzel: **12€**

## 🚌 Transport

Busse bringen die Teilnehmenden zu den Starts und zurück nach Joane. Startnummer erforderlich.

## ✅ Teilnahme

Offen für lizenzierte und Freizeitläufer. **Melde dich früh an** und sichere dir den besten Preis! 🏅`,
      city: "Joane",
      metaTitle: "Famalicão Joane 2026 | 11,2 km + 4 km | Joane",
      metaDescription:
        "Famalicão Joane 2026 in Joane (17. Mai). 11,2-km-Lauf, 4-km-Familienlauf und 4-km-Walking. Anmeldung bis 10/05/2026.",
    },
    [Language.it]: {
      title: "Famalicão Joane 2026",
      description: `# 🏃‍♂️ Famalicão Joane 2026

Domenica **17 maggio 2026**, a Joane si svolgono tre prove nello stesso evento:

- **XXVI Famalicão Joane** – corsa di **11,2 km**
- **I Corrida da Família Joane** – corsa familiare di **4 km**
- **XXIII Vermoim Joane** – camminata di **4 km**

## 📍 Luogo

**Città:** Joane, Vila Nova de Famalicão

**Arrivo:** Parque da Ribeira (Joane)

## ⏰ Orari

- **Corsa familiare (4 km):** 09:30
- **Camminata Vermoim Joane (4 km):** 09:35
- **Corsa Famalicão Joane (11,2 km):** 10:30

## 🛣️ Percorsi

- **4 km (corsa/camminata):** partenza vicino alla Chiesa di Vermoim, arrivo a Joane.
- **11,2 km:** partenza vicino al LIDL (Av. Marechal Humberto Delgado) a Famalicão, arrivo a Joane.

## 🎟️ Iscrizioni

- **Scadenza:** 10/05/2026
- **Iscrizione online:** [fpacompeticoes.pt](https://beta.fpacompeticoes.pt/inscriptions/5524)

## 💶 Quote (Corsa familiare + Camminata)

**Fino al 1º febbraio**
- Gruppi/Famiglie (5+): **5€**
- Individuale: **6€**

**Dal 2 febbraio al 31 marzo**
- Gruppi/Famiglie (5+): **6€**
- Individuale: **7€**

**Dal 1º aprile al 10 maggio**
- Individuale: **8€**

## 💶 Quote (Famalicão Joane 11,2 km)

**Dal 1º gennaio al 1º febbraio**
- Gruppi/Famiglie (5+): **7€**
- Individuale: **8€**

**Dal 2 febbraio al 31 marzo**
- Gruppi/Famiglie (5+): **8€**
- Individuale: **10€**

**Dal 1º aprile al 10 maggio**
- Individuale: **12€**

## 🚌 Trasporto

Autobus disponibili per le partenze e il ritorno a Joane. Pettorale obbligatorio.

## ✅ Partecipazione

Evento aperto a atleti federati e amatori. **Iscriviti presto** per il miglior prezzo! 🏅`,
      city: "Joane",
      metaTitle: "Famalicão Joane 2026 | 11,2 km + 4 km | Joane",
      metaDescription:
        "Famalicão Joane 2026 a Joane (17 maggio). Corsa 11,2 km, corsa familiare 4 km e camminata 4 km. Iscrizioni fino al 10/05/2026.",
    },
  };

  for (const lang of languages) {
    const translation = translations[lang];
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: lang,
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
        language: lang,
        title: translation.title,
        description: translation.description,
        city: translation.city,
        metaTitle: translation.metaTitle,
        metaDescription: translation.metaDescription,
      },
    });
  }

  const upsertVariant = async (
    name: string,
    data: {
      description?: string | null;
      distanceKm?: number | null;
      startDate?: Date | null;
      startTime?: string | null;
      cutoffTimeHours?: number | null;
      maxParticipants?: number | null;
      elevationGainM?: number | null;
      elevationLossM?: number | null;
      itraPoints?: number | null;
      atrpGrade?: number | null;
      mountainLevel?: number | null;
    }
  ) => {
    const existing = await prisma.eventVariant.findFirst({
      where: { eventId: event.id, name },
    });

    if (existing) {
      return prisma.eventVariant.update({
        where: { id: existing.id },
        data,
      });
    }

    return prisma.eventVariant.create({
      data: {
        eventId: event.id,
        name,
        ...data,
      },
    });
  };

  const corridaFamalicao = await upsertVariant("Corrida Famalicão Joane", {
    description: "Corrida principal de 11,2 km com partida em Famalicão.",
    distanceKm: 11,
    startDate: new Date("2026-05-17T09:30:00Z"),
    startTime: "10:30",
    cutoffTimeHours: 1.5,
  });

  const corridaFamilia = await upsertVariant("Corrida da Família Joane", {
    description: "Prova aberta de 4 km, sem classificação.",
    distanceKm: 4,
    startDate: new Date("2026-05-17T08:30:00Z"),
    startTime: "09:30",
    cutoffTimeHours: 1,
  });

  const caminhadaVermoim = await upsertVariant("Caminhada Vermoim Joane", {
    description: "Caminhada de 4 km, aberta a todos e sem classificação.",
    distanceKm: 4,
    startDate: new Date("2026-05-17T08:35:00Z"),
    startTime: "09:35",
    cutoffTimeHours: 1,
  });

  const variantTranslations: Record<
    string,
    Record<
      Language,
      {
        name: string;
        description: string;
      }
    >
  > = {
    [corridaFamalicao.id]: {
      [Language.pt]: {
        name: "Corrida Famalicão Joane 11,2 km",
        description: "Prova principal de 11,2 km entre Famalicão e Joane.",
      },
      [Language.en]: {
        name: "Famalicão Joane 11.2 km Race",
        description: "Main 11.2 km race from Famalicão to Joane.",
      },
      [Language.es]: {
        name: "Carrera Famalicão Joane 11,2 km",
        description: "Carrera principal de 11,2 km entre Famalicão y Joane.",
      },
      [Language.fr]: {
        name: "Course Famalicão Joane 11,2 km",
        description: "Course principale de 11,2 km entre Famalicão et Joane.",
      },
      [Language.de]: {
        name: "Famalicão Joane Lauf 11,2 km",
        description: "Hauptlauf über 11,2 km von Famalicão nach Joane.",
      },
      [Language.it]: {
        name: "Corsa Famalicão Joane 11,2 km",
        description: "Gara principale di 11,2 km da Famalicão a Joane.",
      },
    },
    [corridaFamilia.id]: {
      [Language.pt]: {
        name: "Corrida da Família Joane 4 km",
        description: "Corrida de 4 km aberta a todas as idades.",
      },
      [Language.en]: {
        name: "Joane Family Run 4 km",
        description: "4 km family-friendly race open to all ages.",
      },
      [Language.es]: {
        name: "Carrera Familiar Joane 4 km",
        description: "Carrera de 4 km abierta a todas las edades.",
      },
      [Language.fr]: {
        name: "Course familiale Joane 4 km",
        description: "Course de 4 km ouverte à tous les âges.",
      },
      [Language.de]: {
        name: "Joane Familienlauf 4 km",
        description: "Familienfreundlicher 4-km-Lauf für alle Altersgruppen.",
      },
      [Language.it]: {
        name: "Corsa familiare Joane 4 km",
        description: "Corsa di 4 km aperta a tutte le età.",
      },
    },
    [caminhadaVermoim.id]: {
      [Language.pt]: {
        name: "Caminhada Vermoim Joane 4 km",
        description: "Caminhada de 4 km sem classificação.",
      },
      [Language.en]: {
        name: "Vermoim Joane Walk 4 km",
        description: "4 km non-competitive walk.",
      },
      [Language.es]: {
        name: "Caminata Vermoim Joane 4 km",
        description: "Caminata de 4 km sin clasificación.",
      },
      [Language.fr]: {
        name: "Marche Vermoim Joane 4 km",
        description: "Marche de 4 km sans classement.",
      },
      [Language.de]: {
        name: "Vermoim Joane Walking 4 km",
        description: "4-km-Walking ohne Klassifizierung.",
      },
      [Language.it]: {
        name: "Camminata Vermoim Joane 4 km",
        description: "Camminata di 4 km non competitiva.",
      },
    },
  };

  for (const variant of [corridaFamalicao, corridaFamilia, caminhadaVermoim]) {
    const translationsForVariant = variantTranslations[variant.id];
    for (const lang of languages) {
      const translation = translationsForVariant[lang];
      await prisma.eventVariantTranslation.upsert({
        where: {
          variantId_language: {
            variantId: variant.id,
            language: lang,
          },
        },
        update: {
          name: translation.name,
          description: translation.description,
        },
        create: {
          variantId: variant.id,
          language: lang,
          name: translation.name,
          description: translation.description,
        },
      });
    }
  }

  const findOrCreatePricingPhase = async (
    name: string,
    data: {
      startDate: Date;
      endDate: Date;
      price: number;
      currency: Currency;
      discountPercent?: number | null;
      note?: string | null;
    }
  ) => {
    const existing = await prisma.pricingPhase.findFirst({
      where: { eventId: event.id, name },
    });

    if (existing) {
      return prisma.pricingPhase.update({
        where: { id: existing.id },
        data,
      });
    }

    return prisma.pricingPhase.create({
      data: {
        eventId: event.id,
        name,
        ...data,
      },
    });
  };

  const pricingPhases = [
    {
      name: "Corrida da Família/Caminhada 4 km - Grupos/Famílias (5+) - Fase 1",
      startDate: new Date("2025-12-15T00:00:00Z"),
      endDate: new Date("2026-02-01T23:59:59Z"),
      price: 5,
      currency: Currency.EUR,
      note: "Clubes, grupos ou famílias (mínimo 5 inscrições).",
    },
    {
      name: "Corrida da Família/Caminhada 4 km - Individual - Fase 1",
      startDate: new Date("2025-12-15T00:00:00Z"),
      endDate: new Date("2026-02-01T23:59:59Z"),
      price: 6,
      currency: Currency.EUR,
      note: "Inscrição individual.",
    },
    {
      name: "Corrida da Família/Caminhada 4 km - Grupos/Famílias (5+) - Fase 2",
      startDate: new Date("2026-02-02T00:00:00Z"),
      endDate: new Date("2026-03-31T23:59:59Z"),
      price: 6,
      currency: Currency.EUR,
      note: "Clubes, grupos ou famílias (mínimo 5 inscrições).",
    },
    {
      name: "Corrida da Família/Caminhada 4 km - Individual - Fase 2",
      startDate: new Date("2026-02-02T00:00:00Z"),
      endDate: new Date("2026-03-31T23:59:59Z"),
      price: 7,
      currency: Currency.EUR,
      note: "Inscrição individual.",
    },
    {
      name: "Corrida da Família/Caminhada 4 km - Individual - Fase 3",
      startDate: new Date("2026-04-01T00:00:00Z"),
      endDate: new Date("2026-05-10T23:59:59Z"),
      price: 8,
      currency: Currency.EUR,
      note: "Última fase de inscrições individuais.",
    },
    {
      name: "Corrida Famalicão Joane 11,2 km - Grupos/Famílias (5+) - Fase 1",
      startDate: new Date("2025-12-15T00:00:00Z"),
      endDate: new Date("2026-02-01T23:59:59Z"),
      price: 7,
      currency: Currency.EUR,
      note: "Clubes, grupos ou famílias (mínimo 5 inscrições).",
    },
    {
      name: "Corrida Famalicão Joane 11,2 km - Individual - Fase 1",
      startDate: new Date("2025-12-15T00:00:00Z"),
      endDate: new Date("2026-02-01T23:59:59Z"),
      price: 8,
      currency: Currency.EUR,
      note: "Inscrição individual.",
    },
    {
      name: "Corrida Famalicão Joane 11,2 km - Grupos/Famílias (5+) - Fase 2",
      startDate: new Date("2026-02-02T00:00:00Z"),
      endDate: new Date("2026-03-31T23:59:59Z"),
      price: 8,
      currency: Currency.EUR,
      note: "Clubes, grupos ou famílias (mínimo 5 inscrições).",
    },
    {
      name: "Corrida Famalicão Joane 11,2 km - Individual - Fase 2",
      startDate: new Date("2026-02-02T00:00:00Z"),
      endDate: new Date("2026-03-31T23:59:59Z"),
      price: 10,
      currency: Currency.EUR,
      note: "Inscrição individual.",
    },
    {
      name: "Corrida Famalicão Joane 11,2 km - Individual - Fase 3",
      startDate: new Date("2026-04-01T00:00:00Z"),
      endDate: new Date("2026-05-10T23:59:59Z"),
      price: 12,
      currency: Currency.EUR,
      note: "Última fase de inscrições individuais.",
    },
  ];

  for (const phase of pricingPhases) {
    await findOrCreatePricingPhase(phase.name, {
      startDate: phase.startDate,
      endDate: phase.endDate,
      price: phase.price,
      currency: phase.currency,
      note: phase.note,
    });
  }

  console.log("✅ Pricing phases created or updated.");
}

main()
  .catch((error) => {
    console.error("❌ Error seeding Famalicão Joane 2026:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
