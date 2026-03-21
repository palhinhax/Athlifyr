/**
 * Seed: Hyundai 7K Lisboa 2026
 *
 * Event: 7.000m timed road race — part of EDP Meia Maratona de Lisboa 2026
 * Location: Lisboa, Portugal
 * Date: 7 de Março de 2026 (Saturday)
 * Start: Estádio Nacional, Algés
 * Finish: Praça do Império, Mosteiro dos Jerónimos, Belém
 * Organizer: Maratona Clube de Portugal
 * Website: https://www.meiamaratonadelisboa.com
 */

import { PrismaClient, SportType, Currency, Language } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Hyundai 7K Lisboa 2026...");

  // Delete existing event if it exists (idempotency)
  await prisma.event.deleteMany({
    where: { slug: "hyundai-7k-lisboa-2026" },
  });

  // Create the main event
  const event = await prisma.event.create({
    data: {
      title: "Hyundai 7K Lisboa 2026",
      slug: "hyundai-7k-lisboa-2026",
      description:
        "Hyundai 7K Lisboa 2026 – Prova cronometrada inserida na EDP Meia Maratona de Lisboa. Partida no Estádio Nacional (Algés), meta na Praça do Império.",
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-03-07T09:30:00Z"),
      endDate: new Date("2026-03-07T11:00:00Z"),
      registrationDeadline: new Date("2026-03-01T23:59:59Z"),
      externalUrl: "https://www.meiamaratonadelisboa.com",
      imageUrl: "",
      city: "Lisboa",
      country: "Portugal",
      latitude: 38.6972,
      longitude: -9.2064,
      googleMapsUrl: "https://maps.app.goo.gl/PracaImperioLisboa",
      isFeatured: false,
      cancelled: false,
    },
  });

  console.log(`✅ Created event: ${event.slug}`);

  // ============================================================
  // TRANSLATIONS — ALL 6 LANGUAGES
  // ============================================================

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
    pt: {
      title: "Hyundai 7K Lisboa 2026",
      description: `# 🏃 Hyundai 7K Lisboa 2026

**Prova cronometrada integrada na EDP Meia Maratona de Lisboa | Partida no Estádio Nacional, meta na Praça do Império.**

---

## 📅 Data e Horário

- **Data**: Sábado, 7 de Março de 2026
- **Hora de Partida**: 9h30
- **Local de Partida**: Estádio Nacional, Algés
- **Meta**: Praça do Império, junto ao Mosteiro dos Jerónimos, Belém
- **Tempo Limite**: 1h30m (até às 11h00)

## 📏 Percurso

A Hyundai 7K é uma prova cronometrada de **7.000 metros**, com percurso publicado no site oficial em www.meiamaratonadelisboa.com.

- **Sem caixas de partida** — todos os atletas partem juntos.
- 1 posto de abastecimento ao km 5.
- Cronometragem com sistema **MyLaps** (chip no dorsal).

⚠️ Após o tempo limite, as autoridades competentes restabelecem a circulação rodoviária. A Organização disponibiliza autocarro para recolha dos atletas que ainda estejam em prova.

## 🎽 Levantamento do Kit de Participação

O levantamento dos dorsais e kit de participação realiza-se na **Sala Rio do Centro de Congressos de Lisboa**:

| Dia | Horário |
|---|---|
| Quinta, 5 de Março | 10h00 – 20h00 |
| Sexta, 6 de Março | 10h00 – 20h00 |

⚠️ **Não haverá entrega de kits no dia da prova.**

Para levantamento do dorsal, o atleta deve apresentar o comprovativo de inscrição (PDF enviado por email, impresso ou no telemóvel).

### O Kit de Participação inclui:
- ✅ 1 T-shirt oficial (5 tamanhos, sujeito a disponibilidade)
- ✅ 1 Dorsal com chip eletrónico
- ✅ 1 Saco de equipamento individual
- ✅ Ofertas e informações dos patrocinadores

## 🏆 Categorias e Prémios

- **Sem escalões de idade** na Hyundai 7K.
- Classificação independente por género, premiando os **3 primeiros classificados** (masculino e feminino) com **troféus**.
- **Sem prémios monetários**.
- Todos os atletas classificados recebem uma **medalha oficial**.
- **Sem recolha de equipamentos** para os participantes.

## ♿ Participantes com Mobilidade Condicionada

- Permitida a participação em cadeira de rodas, **desde que assistida por terceiros** (equipa de 2 pessoas indicadas pelo participante).
- Sem limite de vagas para participantes em cadeira de rodas (exceto com handbikes).
- Participantes em cadeira de rodas partem **no final da prova**.
- Inscrições exclusivamente via email: **inscricoes.pdvmc@maratonaportugal.com**
- Isenção de taxa de inscrição para participantes com deficiência e respetivos acompanhantes.

## 📋 Informações Gerais

- **Limite de participantes**: 1.000 atletas
- **Idade mínima**: 8 anos
- **Cronometragem**: Sistema MyLaps (chip no dorsal)
- **Seguro desportivo**: incluído para todos os participantes
- **Sem controlo de dopagem**
- **Resultados definitivos**: 15 dias após a prova

## 🚫 Objetos Proibidos

Não é permitida a participação com bicicletas, animais, carrinhos de bebé, skates, patins, trotinetes ou qualquer outro dispositivo motorizado.

## 🏥 Assistência Médica

A organização disponibiliza assistência médica ao longo de todo o percurso e na zona da meta, onde é instalada uma tenda hospitalar.

Em caso de acidente: geral@maratonaportugal.com

## 📍 Organização

**Maratona Clube de Portugal (MCP)**
Av. João de Freitas Branco, 10 Laveiras
2760-073 Oeiras, Portugal
info@maratonaportugal.com`,
      city: "Lisboa",
      metaTitle: "Hyundai 7K Lisboa 2026 | EDP Meia Maratona | 7 Março, Algés",
      metaDescription:
        "Hyundai 7K Lisboa 2026 – 7 de Março. 7 km cronometrados, partida no Estádio Nacional (Algés), meta na Praça do Império. Inserida na EDP Meia Maratona de Lisboa. Máx. 1.000 atletas.",
    },
    en: {
      title: "Hyundai 7K Lisbon 2026",
      description: `# 🏃 Hyundai 7K Lisbon 2026

**Timed road race integrated in the EDP Lisbon Half Marathon | Start at Estádio Nacional, finish at Praça do Império.**

---

## 📅 Date & Time

- **Date**: Saturday, 7 March 2026
- **Start Time**: 9:30 AM
- **Start Location**: Estádio Nacional, Algés
- **Finish**: Praça do Império, by Mosteiro dos Jerónimos, Belém
- **Time Limit**: 1h30m (until 11:00 AM)

## 📏 Course

The Hyundai 7K is a timed race covering **7,000 metres**, with the course published on the official website at www.meiamaratonadelisboa.com.

- **No starting boxes** — all athletes start together.
- 1 aid station at km 5.
- Timing with the **MyLaps** system (chip on bib).

⚠️ After the time limit, road traffic will be restored. The organiser provides a bus to collect athletes still on course.

## 🎽 Participation Kit Collection

Kit collection takes place at **Sala Rio, Centro de Congressos de Lisboa**:

| Day | Hours |
|---|---|
| Thursday, 5 March | 10:00 AM – 8:00 PM |
| Friday, 6 March | 10:00 AM – 8:00 PM |

⚠️ **No kits will be distributed on race day.**

Athletes must present their registration confirmation (PDF by email, printed or on mobile).

### The Participation Kit includes:
- ✅ 1 Official t-shirt (5 sizes, subject to availability)
- ✅ 1 Bib with electronic chip
- ✅ 1 Individual equipment bag
- ✅ Sponsor gifts and information

## 🏆 Categories & Prizes

- **No age categories** in the Hyundai 7K.
- Independent classification by gender, awarding **trophies to the top 3** (male and female).
- **No prize money**.
- All classified athletes receive an **official medal**.
- **No bag drop** for participants.

## ♿ Participants with Reduced Mobility

- Wheelchair participants are allowed, **provided they are assisted by others** (a team of 2 people designated by the participant).
- No limit on wheelchair participants (except handbikes).
- Wheelchair participants start **at the end of the race**.
- Registration exclusively via email: **inscricoes.pdvmc@maratonaportugal.com**
- No registration fee for disabled participants and their assistants.

## 📋 General Info

- **Participant limit**: 1,000 athletes
- **Minimum age**: 8 years
- **Timing**: MyLaps system (chip on bib)
- **Sports insurance**: included for all participants
- **No doping control**
- **Official results**: 15 days after the race

## 🚫 Prohibited Items

No bicycles, animals, prams, skateboards, rollerblades, scooters or motorised devices.

## 🏥 Medical Assistance

Medical assistance is provided throughout the course and at the finish area, where a medical tent will be set up.

In case of accident: geral@maratonaportugal.com

## 📍 Organiser

**Maratona Clube de Portugal (MCP)**
Av. João de Freitas Branco, 10 Laveiras
2760-073 Oeiras, Portugal
info@maratonaportugal.com`,
      city: "Lisbon",
      metaTitle: "Hyundai 7K Lisbon 2026 | EDP Half Marathon | 7 March, Algés",
      metaDescription:
        "Hyundai 7K Lisbon 2026 – 7 March. 7 km timed race, start at Estádio Nacional (Algés), finish at Praça do Império. Part of EDP Lisbon Half Marathon. Max. 1,000 athletes.",
    },
    es: {
      title: "Hyundai 7K Lisboa 2026",
      description: `# 🏃 Hyundai 7K Lisboa 2026

**Carrera cronometrada integrada en el EDP Medio Maratón de Lisboa | Salida en el Estádio Nacional, meta en la Praça do Império.**

---

## 📅 Fecha y Horario

- **Fecha**: Sábado, 7 de marzo de 2026
- **Hora de Salida**: 9:30
- **Lugar de Salida**: Estádio Nacional, Algés
- **Meta**: Praça do Império, junto al Mosteiro dos Jerónimos, Belém
- **Tiempo Límite**: 1h30m (hasta las 11:00)

## 📏 Recorrido

La Hyundai 7K es una carrera cronometrada de **7.000 metros**, con el recorrido publicado en www.meiamaratonadelisboa.com.

- **Sin cajones de salida** — todos los atletas salen juntos.
- 1 avituallamiento en el km 5.
- Cronometraje con sistema **MyLaps** (chip en el dorsal).

## 🎽 Recogida del Kit de Participación

La recogida tiene lugar en la **Sala Rio del Centro de Congressos de Lisboa**:

| Día | Horario |
|---|---|
| Jueves, 5 de marzo | 10:00 – 20:00 |
| Viernes, 6 de marzo | 10:00 – 20:00 |

⚠️ **No se distribuirán kits el día de la carrera.**

### El Kit de Participación incluye:
- ✅ 1 Camiseta técnica oficial
- ✅ 1 Dorsal con chip electrónico
- ✅ 1 Bolsa de equipamiento
- ✅ Regalos de patrocinadores

## 🏆 Categorías y Premios

- **Sin grupos de edad**.
- Clasificación por género, premiando los **3 primeros** (M/F) con trofeos.
- **Sin premios en metálico**.
- Todos los atletas clasificados reciben una **medalla oficial**.

## 📋 Información General

- **Límite de participantes**: 1.000 atletas
- **Edad mínima**: 8 años
- **Cronometraje**: Sistema MyLaps
- **Seguro deportivo**: incluido
- **Sin control de dopaje**

## 📍 Organizador

**Maratona Clube de Portugal (MCP)**
Av. João de Freitas Branco, 10 Laveiras
2760-073 Oeiras, Portugal
info@maratonaportugal.com`,
      city: "Lisboa",
      metaTitle: "Hyundai 7K Lisboa 2026 | EDP Medio Maratón | 7 Marzo, Algés",
      metaDescription:
        "Hyundai 7K Lisboa 2026 – 7 de marzo. 7 km cronometrados, salida en Estádio Nacional (Algés), meta en Praça do Império. Parte del EDP Medio Maratón de Lisboa. Máx. 1.000 atletas.",
    },
    fr: {
      title: "Hyundai 7K Lisbonne 2026",
      description: `# 🏃 Hyundai 7K Lisbonne 2026

**Course chronométrée intégrée dans le EDP Semi-Marathon de Lisbonne | Départ au Stade National, arrivée à la Praça do Império.**

---

## 📅 Date et Horaire

- **Date** : Samedi 7 mars 2026
- **Heure de Départ** : 9h30
- **Lieu de Départ** : Estádio Nacional, Algés
- **Arrivée** : Praça do Império, près du Mosteiro dos Jerónimos, Belém
- **Temps Limite** : 1h30 (jusqu'à 11h00)

## 📏 Parcours

La Hyundai 7K est une course chronométrée de **7 000 mètres**, avec le parcours publié sur www.meiamaratonadelisboa.com.

- **Pas de sas de départ** — tous les athlètes partent ensemble.
- 1 ravitaillement au km 5.
- Chronométrage avec le système **MyLaps** (puce sur le dossard).

## 🎽 Retrait du Kit de Participation

Le retrait a lieu à la **Sala Rio, Centro de Congressos de Lisboa** :

| Jour | Horaires |
|---|---|
| Jeudi 5 mars | 10h00 – 20h00 |
| Vendredi 6 mars | 10h00 – 20h00 |

⚠️ **Aucun kit ne sera distribué le jour de la course.**

### Le Kit de Participation comprend :
- ✅ 1 T-shirt technique officiel
- ✅ 1 Dossard avec puce électronique
- ✅ 1 Sac d'équipement
- ✅ Cadeaux des sponsors

## 🏆 Catégories et Prix

- **Pas de groupes d'âge**.
- Classement par genre, récompensant les **3 premiers** (H/F) avec des trophées.
- **Pas de prix en argent**.
- Tous les athlètes classifiés reçoivent une **médaille officielle**.

## 📋 Informations Générales

- **Limite de participants** : 1 000 athlètes
- **Âge minimum** : 8 ans
- **Chronométrage** : Système MyLaps
- **Assurance sportive** : incluse
- **Pas de contrôle antidopage**

## 📍 Organisateur

**Maratona Clube de Portugal (MCP)**
Av. João de Freitas Branco, 10 Laveiras
2760-073 Oeiras, Portugal
info@maratonaportugal.com`,
      city: "Lisbonne",
      metaTitle: "Hyundai 7K Lisbonne 2026 | EDP Semi-Marathon | 7 Mars, Algés",
      metaDescription:
        "Hyundai 7K Lisbonne 2026 – 7 mars. 7 km chronométrés, départ Stade National (Algés), arrivée Praça do Império. Partie du EDP Semi-Marathon de Lisbonne. Max. 1 000 athlètes.",
    },
    de: {
      title: "Hyundai 7K Lissabon 2026",
      description: `# 🏃 Hyundai 7K Lissabon 2026

**Zeitgenommener Straßenlauf im Rahmen des EDP Lissabon Halbmarathons | Start im Nationalstadion, Ziel am Praça do Império.**

---

## 📅 Datum und Uhrzeit

- **Datum**: Samstag, 7. März 2026
- **Startzeit**: 9:30 Uhr
- **Startort**: Estádio Nacional, Algés
- **Ziel**: Praça do Império, beim Mosteiro dos Jerónimos, Belém
- **Zeitlimit**: 1h30 (bis 11:00 Uhr)

## 📏 Strecke

Der Hyundai 7K ist ein zeitgenommener Lauf über **7.000 Meter**, mit der Strecke auf www.meiamaratonadelisboa.com.

- **Keine Startblöcke** — alle Athleten starten gemeinsam.
- 1 Verpflegungsstation bei km 5.
- Zeitmessung mit **MyLaps**-System (Chip auf der Startnummer).

## 🎽 Abholung des Teilnahme-Kits

Die Abholung findet in der **Sala Rio, Centro de Congressos de Lisboa** statt:

| Tag | Uhrzeiten |
|---|---|
| Donnerstag, 5. März | 10:00 – 20:00 Uhr |
| Freitag, 6. März | 10:00 – 20:00 Uhr |

⚠️ **Am Renntag werden keine Kits ausgegeben.**

### Das Teilnahme-Kit enthält:
- ✅ 1 Offizielles technisches T-Shirt
- ✅ 1 Startnummer mit elektronischem Chip
- ✅ 1 Ausrüstungstasche
- ✅ Sponsor-Geschenke

## 🏆 Kategorien und Preise

- **Keine Altersgruppen**.
- Klassifikation nach Geschlecht, Trophäen für die **Top 3** (M/F).
- **Kein Preisgeld**.
- Alle klassifizierten Athleten erhalten eine **offizielle Medaille**.

## 📋 Allgemeine Informationen

- **Teilnehmerlimit**: 1.000 Athleten
- **Mindestalter**: 8 Jahre
- **Zeitmessung**: MyLaps-System
- **Sportversicherung**: inklusive
- **Keine Dopingkontrolle**

## 📍 Veranstalter

**Maratona Clube de Portugal (MCP)**
Av. João de Freitas Branco, 10 Laveiras
2760-073 Oeiras, Portugal
info@maratonaportugal.com`,
      city: "Lissabon",
      metaTitle: "Hyundai 7K Lissabon 2026 | EDP Halbmarathon | 7. März, Algés",
      metaDescription:
        "Hyundai 7K Lissabon 2026 – 7. März. 7 km zeitgenommen, Start Nationalstadion (Algés), Ziel Praça do Império. Teil des EDP Lissabon Halbmarathons. Max. 1.000 Athleten.",
    },
    it: {
      title: "Hyundai 7K Lisbona 2026",
      description: `# 🏃 Hyundai 7K Lisbona 2026

**Gara cronometrata integrata nella EDP Mezza Maratona di Lisbona | Partenza allo Stadio Nazionale, arrivo alla Praça do Império.**

---

## 📅 Data e Orario

- **Data**: Sabato 7 marzo 2026
- **Ora di Partenza**: 9:30
- **Luogo di Partenza**: Estádio Nacional, Algés
- **Arrivo**: Praça do Império, presso il Mosteiro dos Jerónimos, Belém
- **Tempo Limite**: 1h30 (fino alle 11:00)

## 📏 Percorso

La Hyundai 7K è una gara cronometrata di **7.000 metri**, con il percorso pubblicato su www.meiamaratonadelisboa.com.

- **Nessun box di partenza** — tutti gli atleti partono insieme.
- 1 ristoro al km 5.
- Cronometraggio con sistema **MyLaps** (chip sul pettorale).

## 🎽 Ritiro del Kit di Partecipazione

Il ritiro avviene alla **Sala Rio, Centro de Congressos de Lisboa**:

| Giorno | Orario |
|---|---|
| Giovedì 5 marzo | 10:00 – 20:00 |
| Venerdì 6 marzo | 10:00 – 20:00 |

⚠️ **Nessun kit sarà distribuito il giorno della gara.**

### Il Kit di Partecipazione include:
- ✅ 1 T-shirt tecnica ufficiale
- ✅ 1 Pettorale con chip elettronico
- ✅ 1 Sacca per l'attrezzatura
- ✅ Omaggi degli sponsor

## 🏆 Categorie e Premi

- **Nessun gruppo d'età**.
- Classifica per genere, trofei per i **primi 3** (M/F).
- **Nessun premio in denaro**.
- Tutti gli atleti classificati ricevono una **medaglia ufficiale**.

## 📋 Informazioni Generali

- **Limite partecipanti**: 1.000 atleti
- **Età minima**: 8 anni
- **Cronometraggio**: Sistema MyLaps
- **Assicurazione sportiva**: inclusa
- **Nessun controllo antidoping**

## 📍 Organizzatore

**Maratona Clube de Portugal (MCP)**
Av. João de Freitas Branco, 10 Laveiras
2760-073 Oeiras, Portugal
info@maratonaportugal.com`,
      city: "Lisbona",
      metaTitle:
        "Hyundai 7K Lisbona 2026 | EDP Mezza Maratona | 7 Marzo, Algés",
      metaDescription:
        "Hyundai 7K Lisbona 2026 – 7 marzo. 7 km cronometrati, partenza Stadio Nazionale (Algés), arrivo Praça do Império. Parte della EDP Mezza Maratona di Lisbona. Max. 1.000 atleti.",
    },
  };

  for (const lang of Object.keys(translations) as Language[]) {
    await prisma.eventTranslation.upsert({
      where: { eventId_language: { eventId: event.id, language: lang } },
      update: {
        title: translations[lang].title,
        description: translations[lang].description,
        city: translations[lang].city,
        metaTitle: translations[lang].metaTitle,
        metaDescription: translations[lang].metaDescription,
      },
      create: {
        eventId: event.id,
        language: lang,
        title: translations[lang].title,
        description: translations[lang].description,
        city: translations[lang].city,
        metaTitle: translations[lang].metaTitle,
        metaDescription: translations[lang].metaDescription,
      },
    });
  }

  console.log("✅ Translations upserted for all 6 languages");

  // ============================================================
  // VARIANTS + PRICING PHASES
  // ============================================================

  // Delete existing pricing phases for this event to avoid duplicates
  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

  const variants = [
    {
      name: "Hyundai 7K",
      distanceKm: 7,
      elevationGainM: null,
      elevationLossM: null,
      startDate: new Date("2026-03-07T09:30:00Z"),
      startTime: "09:30",
      cutoffTimeHours: 1.5,
      price: 12,
      currency: Currency.EUR,
      maxParticipants: 1000,
      atrpGrade: null,
      itraPoints: null,
      description:
        "7 km timed road race. Start: Estádio Nacional, Algés. Finish: Praça do Império, Belém. Time limit: 1h30. No starting boxes. Minimum age: 8 years.",
      pricingPhases: [
        {
          name: "Inscrição Antecipada",
          startDate: new Date("2025-10-01T00:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 8,
          currency: Currency.EUR,
          note: "1ª Fase – Inscrição antecipada",
        },
        {
          name: "Inscrição Normal",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-02-15T23:59:59Z"),
          price: 10,
          currency: Currency.EUR,
          note: "2ª Fase – Inscrição normal",
        },
        {
          name: "Inscrição Tardia",
          startDate: new Date("2026-02-16T00:00:00Z"),
          endDate: new Date("2026-03-01T23:59:59Z"),
          price: 12,
          currency: Currency.EUR,
          note: "3ª Fase – Inscrição tardia",
        },
      ],
    },
  ];

  console.log("💰 Creating variants and pricing phases...");

  for (const variantData of variants) {
    const { pricingPhases, ...variantInfo } = variantData;

    const variant = await prisma.eventVariant.create({
      data: {
        ...variantInfo,
        eventId: event.id,
      },
    });

    console.log(`✅ Created variant: ${variant.name}`);

    for (const phase of pricingPhases) {
      await prisma.pricingPhase.create({
        data: {
          eventId: event.id,
          variantId: variant.id,
          name: `${variant.name} - ${phase.name}`,
          startDate: phase.startDate,
          endDate: phase.endDate,
          price: phase.price,
          currency: phase.currency,
          note: phase.note,
        },
      });
    }

    console.log(`   - Created ${pricingPhases.length} pricing phases`);
  }

  console.log("\n✅ Seed completed successfully!");
  console.log("\n📊 Summary:");
  console.log("- Event: Hyundai 7K Lisboa 2026");
  console.log("- Slug: hyundai-7k-lisboa-2026");
  console.log("- Variant: Hyundai 7K (7 km)");
  console.log("- Participant limit: 1.000");
  console.log("- Languages: 6 (pt, en, es, fr, de, it)");
  console.log("- Pricing Phases: 3 (Antecipada / Normal / Tardia)");
  console.log("- Date: 7 March 2026 — Start 9:30, Finish ~11:00");
  console.log("- Start: Estádio Nacional, Algés");
  console.log("- Finish: Praça do Império, Belém");
  console.log("- Organiser: Maratona Clube de Portugal");
  console.log("- Minimum age: 8 years");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
