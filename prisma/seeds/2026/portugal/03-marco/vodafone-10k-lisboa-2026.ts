/**
 * Seed: Vodafone 10K Lisboa 2026 (EDP Meia Maratona de Lisboa)
 *
 * Event: 10K road race integrated in the EDP Lisbon Half Marathon,
 *        crossing the iconic 25 de Abril Bridge.
 * Location: Lisboa, Portugal
 * Date: 8 de Março de 2026 (Sunday)
 * Start: Praça da Portagem, Ponte 25 de Abril
 * Finish: Praça do Império, Centro Cultural de Belém
 * Organizer: Maratona Clube de Portugal
 * Website: https://www.maratonaclubedoportugal.com
 */

import { PrismaClient, SportType, Currency, Language } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Vodafone 10K Lisboa 2026...");

  // Delete existing event if it exists (idempotency)
  await prisma.event.deleteMany({
    where: {
      slug: "vodafone-10k-lisboa-2026",
    },
  });

  // Create the main event
  const event = await prisma.event.create({
    data: {
      title: "Vodafone 10K Lisboa 2026",
      slug: "vodafone-10k-lisboa-2026",
      description:
        "Vodafone 10K Lisboa 2026 – Parte integrante da EDP Meia Maratona de Lisboa. Atravessa a Ponte 25 de Abril e chega ao coração de Belém.",
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-03-08T10:15:00Z"),
      endDate: new Date("2026-03-08T12:35:00Z"),
      registrationDeadline: new Date("2026-03-01T23:59:59Z"),
      externalUrl: "https://www.maratonaclubedoportugal.com",
      imageUrl: "", // To be uploaded via admin
      city: "Lisboa",
      country: "Portugal",
      latitude: 38.6916,
      longitude: -9.1776,
      googleMapsUrl: "https://maps.app.goo.gl/BelémPraçaImperio",
      isFeatured: true,
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
      title: "Vodafone 10K Lisboa 2026",
      description: `# 🏃 Vodafone 10K Lisboa 2026

**Parte integrante da EDP Meia Maratona de Lisboa. Atravessa a Ponte 25 de Abril a pé numa atmosfera de festa com milhares de atletas de todo o mundo.**

---

## 📅 Data e Horário

- **Data**: 8 de Março de 2026 (Domingo)
- **Hora de Partida**: 10h15
- **Local de Partida**: Praça da Portagem – Ponte 25 de Abril
- **Meta**: Praça do Império, Centro Cultural de Belém
- **Tempo Limite**: 2h20m (até às 12h35)

## 📏 Percurso

A Vodafone 10K partilha a partida com a EDP Meia Maratona de Lisboa, na Ponte 25 de Abril. Ao longo dos 10 km, os atletas atravessam a ponte mais emblemática de Portugal e chegam à Praça do Império, em frente ao Centro Cultural de Belém.

É uma prova de grande popularidade e já foi percorrida pelas mais altas figuras do país, incluindo primeiros-ministros, presidentes de câmara e personalidades ilustres.

## 🎽 Levantamento do Kit de Participação

O levantamento dos dorsais e kit de participação realiza-se na **Sport Expo**, no **Centro de Congressos de Lisboa**:

| Dia | Horário |
|---|---|
| Quinta, 5 de Março | 10h00 – 20h00 |
| Sexta, 6 de Março | 10h00 – 20h00 |
| Sábado, 7 de Março | 10h00 – 20h00 |

⚠️ **Não haverá entrega de kits no dia da prova.**

O atleta deve apresentar o comprovativo de inscrição (PDF enviado por email). Pode nomear outra pessoa para levantar o kit, desde que apresente o documento de inscrição.

### O Kit de Participação inclui:
- ✅ 1 T-shirt técnica oficial
- ✅ 1 Dorsal com chip eletrónico
- ✅ 1 Saco de equipamento
- ✅ Ofertas dos patrocinadores

## 🚂 Como Chegar à Partida

A partida encontra-se na **Ponte 25 de Abril**. O único meio de acesso é de **comboio Fertagus**, saindo na estação do **Pragal**.

- Os comboios Fertagus são **gratuitos** para os participantes mediante apresentação do dorsal.
- O transporte público (metro, autocarros e comboios) também é gratuito para quem se dirija às estações Fertagus.
- A caminhada da estação até à zona de partida demora entre **10 a 15 minutos**.
- A organização recomenda chegar cedo — milhares de atletas utilizam os últimos comboios e podem não chegar a tempo.

⚠️ **Apenas atletas com dorsal têm acesso à zona de partida. Espectadores não são permitidos na ponte.**

## 🏆 Categorias e Prémios

- Não existem categorias/escalões na Vodafone 10K.
- Todos os classificados recebem **medalha oficial**.
- Classificação independente por género — prémio para os 3 primeiros (masculino e feminino).
- **Não há prémios monetários.**

## 📋 Informações Gerais

- **Limite de participantes**: 9.000 atletas
- **Idade mínima**: 18 anos
- **Cronometragem**: Sistema MyLaps (chip no dorsal)
- **Seguro desportivo**: incluído para todos os participantes
- **Não há vestiário/recolha de equipamentos**
- **Desqualificação**: dorsal mal colocado, utilização do dorsal de outro atleta ou comportamento antidesportivo

## 🏥 Assistência Médica

A organização disponibiliza assistência médica ao longo de todo o percurso e na zona da meta, onde é instalada uma tenda hospitalar.

## 📍 Organização

**Maratona Clube de Portugal (MCP)**
Av. João de Freitas Branco, 10 Laveiras
2760-073 Oeiras, Portugal
info@maratonaportugal.com`,
      city: "Lisboa",
      metaTitle: "Vodafone 10K Lisboa 2026 | Ponte 25 de Abril | 8 Março",
      metaDescription:
        "Vodafone 10K Lisboa 2026 – 8 de Março. 10 km a atravessar a Ponte 25 de Abril. Parte da EDP Meia Maratona de Lisboa. Limite de 9.000 atletas. Partida às 10h15, tempo limite 2h20m.",
    },
    en: {
      title: "Vodafone 10K Lisbon 2026",
      description: `# 🏃 Vodafone 10K Lisbon 2026

**Part of the EDP Lisbon Half Marathon. Cross the iconic 25 de Abril Bridge on foot in a festive atmosphere with thousands of athletes from around the world.**

---

## 📅 Date & Time

- **Date**: Sunday, 8 March 2026
- **Start Time**: 10:15 AM
- **Start Location**: Praça da Portagem – 25 de Abril Bridge
- **Finish**: Praça do Império, Centro Cultural de Belém
- **Time Limit**: 2h20m (until 12:35 PM)

## 📏 Course

The Vodafone 10K shares its start with the EDP Lisbon Half Marathon, on the 25 de Abril Bridge. Over 10 km, athletes cross Portugal's most iconic bridge and arrive at Praça do Império, in front of the Centro Cultural de Belém.

This race is proud of its popularity and has been run by the highest authorities in the country, including prime ministers, mayors and other illustrious personalities.

## 🎽 Participation Kit Collection

Kit collection takes place at **Sport Expo**, **Centro de Congressos de Lisboa**:

| Day | Hours |
|---|---|
| Thursday, 5 March | 10:00 AM – 8:00 PM |
| Friday, 6 March | 10:00 AM – 8:00 PM |
| Saturday, 7 March | 10:00 AM – 8:00 PM |

⚠️ **No kits will be distributed on race day.**

Athletes must present their registration confirmation (PDF sent by email). You may nominate someone to collect your kit, provided they present your registration document.

### The Participation Kit includes:
- ✅ 1 Official technical t-shirt
- ✅ 1 Bib with electronic chip
- ✅ 1 Equipment bag
- ✅ Sponsor gifts

## 🚂 Getting to the Start

The start is on the **25 de Abril Bridge**. The only way to access the start area is by **Fertagus train**, exiting at **Pragal station**.

- Fertagus trains are **free** for participants upon showing their bib.
- Public transport (metro, buses, trains) is also free for those travelling to Fertagus stations.
- The walk from the station to the start area takes **10–15 minutes**.
- Arrive early — thousands of athletes use the last trains and may not arrive on time.

⚠️ **Only athletes with a bib will be allowed access to the start area. Spectators are not permitted on the bridge.**

## 🏆 Categories & Prizes

- No age categories in the Vodafone 10K.
- All finishers receive an **official medal**.
- Independent classification by gender — prize for the top 3 (men and women).
- **No monetary prizes.**

## 📋 General Info

- **Participant limit**: 9,000 athletes
- **Minimum age**: 18 years
- **Timing**: MyLaps system (chip on bib)
- **Sports insurance**: included for all participants
- **No bag drop service**
- **Disqualification**: misplaced bib, using another athlete's bib, or unsporting behaviour

## 🏥 Medical Assistance

The organisation provides medical assistance throughout the course and at the finish area, where a medical tent will be set up.

## 📍 Organiser

**Maratona Clube de Portugal (MCP)**
Av. João de Freitas Branco, 10 Laveiras
2760-073 Oeiras, Portugal
info@maratonaportugal.com`,
      city: "Lisbon",
      metaTitle: "Vodafone 10K Lisbon 2026 | 25 de Abril Bridge | 8 March",
      metaDescription:
        "Vodafone 10K Lisbon 2026 – 8 March. 10km crossing the iconic 25 de Abril Bridge. Part of EDP Lisbon Half Marathon. 9,000 athlete limit. Start 10:15 AM, time limit 2h20m.",
    },
    es: {
      title: "Vodafone 10K Lisboa 2026",
      description: `# 🏃 Vodafone 10K Lisboa 2026

**Parte del EDP Medio Maratón de Lisboa. Cruza el icónico Puente 25 de Abril a pie en un ambiente festivo con miles de atletas de todo el mundo.**

---

## 📅 Fecha y Horario

- **Fecha**: Domingo, 8 de marzo de 2026
- **Hora de Salida**: 10:15
- **Lugar de Salida**: Praça da Portagem – Puente 25 de Abril
- **Meta**: Praça do Império, Centro Cultural de Belém
- **Tiempo Límite**: 2h20m (hasta las 12:35)

## 📏 Recorrido

La Vodafone 10K comparte la salida con el EDP Medio Maratón de Lisboa, en el Puente 25 de Abril. A lo largo de los 10 km, los atletas cruzan el puente más emblemático de Portugal y llegan a la Praça do Império, frente al Centro Cultural de Belém.

## 🎽 Recogida del Kit de Participación

La recogida de dorsales y kits tiene lugar en la **Sport Expo**, **Centro de Congressos de Lisboa**:

| Día | Horario |
|---|---|
| Jueves, 5 de marzo | 10:00 – 20:00 |
| Viernes, 6 de marzo | 10:00 – 20:00 |
| Sábado, 7 de marzo | 10:00 – 20:00 |

⚠️ **No se distribuirán kits el día de la carrera.**

### El Kit de Participación incluye:
- ✅ 1 Camiseta técnica oficial
- ✅ 1 Dorsal con chip electrónico
- ✅ 1 Bolsa de equipamiento
- ✅ Regalos de patrocinadores

## 🚂 Cómo Llegar a la Salida

La salida está en el **Puente 25 de Abril**. El único acceso es en **tren Fertagus**, bajando en la estación de **Pragal**.

- Los trenes Fertagus son **gratuitos** para los participantes con el dorsal.
- El transporte público también es gratuito para quienes se dirijan a las estaciones Fertagus.
- El trayecto desde la estación hasta la zona de salida dura entre **10 y 15 minutos**.

⚠️ **Solo los atletas con dorsal pueden acceder a la zona de salida. Los espectadores no están permitidos en el puente.**

## 🏆 Categorías y Premios

- No hay categorías en la Vodafone 10K.
- Todos los clasificados reciben **medalla oficial**.
- Clasificación independiente por género — premio para los 3 primeros.
- **Sin premios en metálico.**

## 📋 Información General

- **Límite de participantes**: 9.000 atletas
- **Edad mínima**: 18 años
- **Cronometraje**: Sistema MyLaps
- **Seguro deportivo**: incluido
- **Sin guardarropa**`,
      city: "Lisboa",
      metaTitle: "Vodafone 10K Lisboa 2026 | Puente 25 de Abril | 8 Marzo",
      metaDescription:
        "Vodafone 10K Lisboa 2026 – 8 de marzo. 10km cruzando el Puente 25 de Abril. Parte del EDP Medio Maratón de Lisboa. Límite de 9.000 atletas. Salida a las 10:15, límite de tiempo 2h20m.",
    },
    fr: {
      title: "Vodafone 10K Lisbonne 2026",
      description: `# 🏃 Vodafone 10K Lisbonne 2026

**Partie intégrante du Semi-Marathon EDP de Lisbonne. Traversez l'emblématique Pont 25 Avril à pied dans une atmosphère festive avec des milliers d'athlètes du monde entier.**

---

## 📅 Date et Horaire

- **Date** : Dimanche 8 mars 2026
- **Heure de départ** : 10h15
- **Lieu de départ** : Praça da Portagem – Pont 25 Avril
- **Arrivée** : Praça do Império, Centro Cultural de Belém
- **Temps limite** : 2h20 (jusqu'à 12h35)

## 🎽 Retrait du Kit de Participation

Le retrait des dossards et kits a lieu à la **Sport Expo**, **Centro de Congressos de Lisboa** :

| Jour | Horaires |
|---|---|
| Jeudi 5 mars | 10h00 – 20h00 |
| Vendredi 6 mars | 10h00 – 20h00 |
| Samedi 7 mars | 10h00 – 20h00 |

⚠️ **Aucun kit ne sera distribué le jour de la course.**

### Le Kit de Participation comprend :
- ✅ 1 T-shirt technique officiel
- ✅ 1 Dossard avec puce électronique
- ✅ 1 Sac d'équipement
- ✅ Cadeaux des sponsors

## 🚂 Comment Accéder au Départ

Le départ se situe sur le **Pont 25 Avril**. Le seul accès est par **train Fertagus**, en sortant à la gare de **Pragal**.

- Les trains Fertagus sont **gratuits** pour les participants sur présentation du dossard.
- Le trajet de la gare à la zone de départ prend **10 à 15 minutes**.

⚠️ **Seuls les athlètes munis d'un dossard peuvent accéder à la zone de départ. Les spectateurs ne sont pas autorisés sur le pont.**

## 🏆 Catégories et Prix

- Pas de catégories dans le Vodafone 10K.
- Tous les finishers reçoivent une **médaille officielle**.
- Classement indépendant par genre — prix pour les 3 premiers.
- **Pas de prix en argent.**

## 📋 Informations Générales

- **Limite de participants** : 9 000 athlètes
- **Âge minimum** : 18 ans
- **Chronométrage** : Système MyLaps
- **Assurance sportive** : incluse
- **Pas de vestiaire**`,
      city: "Lisbonne",
      metaTitle: "Vodafone 10K Lisbonne 2026 | Pont 25 Avril | 8 Mars",
      metaDescription:
        "Vodafone 10K Lisbonne 2026 – 8 mars. 10km traversant le Pont 25 Avril. Partie du Semi-Marathon EDP de Lisbonne. Limite de 9 000 athlètes. Départ à 10h15, temps limite 2h20.",
    },
    de: {
      title: "Vodafone 10K Lissabon 2026",
      description: `# 🏃 Vodafone 10K Lissabon 2026

**Teil des EDP Halbmarathons Lissabon. Überquere die ikonische Brücke 25 de Abril zu Fuß in festlicher Atmosphäre mit Tausenden von Athleten aus aller Welt.**

---

## 📅 Datum und Uhrzeit

- **Datum**: Sonntag, 8. März 2026
- **Startzeit**: 10:15 Uhr
- **Startort**: Praça da Portagem – Brücke 25 de Abril
- **Ziel**: Praça do Império, Centro Cultural de Belém
- **Zeitlimit**: 2h20m (bis 12:35 Uhr)

## 🎽 Abholung des Teilnehmerkits

Die Abholung der Startnummern und Kits findet in der **Sport Expo**, **Centro de Congressos de Lisboa** statt:

| Tag | Uhrzeiten |
|---|---|
| Donnerstag, 5. März | 10:00 – 20:00 Uhr |
| Freitag, 6. März | 10:00 – 20:00 Uhr |
| Samstag, 7. März | 10:00 – 20:00 Uhr |

⚠️ **Am Wettkampftag werden keine Kits ausgegeben.**

### Das Teilnehmerkit enthält:
- ✅ 1 Offizielles Technik-T-Shirt
- ✅ 1 Startnummer mit elektronischem Chip
- ✅ 1 Ausrüstungstasche
- ✅ Sponsorengeschenke

## 🚂 Anreise zum Start

Der Start befindet sich auf der **Brücke 25 de Abril**. Der einzige Zugang ist per **Fertagus-Zug**, Ausstieg am Bahnhof **Pragal**.

- Fertagus-Züge sind für Teilnehmer mit Startnummer **kostenlos**.
- Der Weg vom Bahnhof zum Startbereich dauert **10–15 Minuten**.

⚠️ **Nur Athleten mit Startnummer haben Zugang zum Startbereich. Zuschauer sind auf der Brücke nicht erlaubt.**

## 🏆 Kategorien und Preise

- Keine Altersklassen beim Vodafone 10K.
- Alle Finisher erhalten eine **offizielle Medaille**.
- Unabhängige Wertung nach Geschlecht — Preis für die Top 3.
- **Keine Geldpreise.**

## 📋 Allgemeine Informationen

- **Teilnehmerlimit**: 9.000 Athleten
- **Mindestalter**: 18 Jahre
- **Zeitmessung**: MyLaps-System
- **Sportversicherung**: inklusive
- **Kein Gepäckservice**`,
      city: "Lissabon",
      metaTitle: "Vodafone 10K Lissabon 2026 | Brücke 25 de Abril | 8. März",
      metaDescription:
        "Vodafone 10K Lissabon 2026 – 8. März. 10 km über die Brücke 25 de Abril. Teil des EDP Halbmarathons Lissabon. Limit von 9.000 Athleten. Start 10:15 Uhr, Zeitlimit 2h20m.",
    },
    it: {
      title: "Vodafone 10K Lisbona 2026",
      description: `# 🏃 Vodafone 10K Lisbona 2026

**Parte integrante della EDP Mezza Maratona di Lisbona. Attraversa l'iconico Ponte 25 de Abril a piedi in un'atmosfera di festa con migliaia di atleti da tutto il mondo.**

---

## 📅 Data e Orario

- **Data**: Domenica 8 marzo 2026
- **Ora di Partenza**: 10:15
- **Luogo di Partenza**: Praça da Portagem – Ponte 25 de Abril
- **Arrivo**: Praça do Império, Centro Cultural de Belém
- **Tempo Limite**: 2h20m (fino alle 12:35)

## 🎽 Ritiro del Kit di Partecipazione

Il ritiro dei pettorali e kit avviene alla **Sport Expo**, **Centro de Congressos de Lisboa**:

| Giorno | Orario |
|---|---|
| Giovedì 5 marzo | 10:00 – 20:00 |
| Venerdì 6 marzo | 10:00 – 20:00 |
| Sabato 7 marzo | 10:00 – 20:00 |

⚠️ **Nessun kit verrà distribuito il giorno della gara.**

### Il Kit di Partecipazione include:
- ✅ 1 T-shirt tecnica ufficiale
- ✅ 1 Pettorale con chip elettronico
- ✅ 1 Borsa attrezzatura
- ✅ Gadget degli sponsor

## 🚂 Come Raggiungere la Partenza

La partenza si trova sul **Ponte 25 de Abril**. L'unico accesso è tramite **treno Fertagus**, scendendo alla stazione di **Pragal**.

- I treni Fertagus sono **gratuiti** per i partecipanti con il pettorale.
- Il percorso dalla stazione all'area di partenza richiede **10–15 minuti**.

⚠️ **Solo gli atleti con pettorale possono accedere all'area di partenza. Gli spettatori non sono ammessi sul ponte.**

## 🏆 Categorie e Premi

- Nessuna categoria nel Vodafone 10K.
- Tutti i finisher ricevono una **medaglia ufficiale**.
- Classifica indipendente per genere — premio per i primi 3.
- **Nessun premio in denaro.**

## 📋 Informazioni Generali

- **Limite partecipanti**: 9.000 atleti
- **Età minima**: 18 anni
- **Cronometraggio**: Sistema MyLaps
- **Assicurazione sportiva**: inclusa
- **Nessun servizio bagagli**`,
      city: "Lisbona",
      metaTitle: "Vodafone 10K Lisbona 2026 | Ponte 25 de Abril | 8 Marzo",
      metaDescription:
        "Vodafone 10K Lisbona 2026 – 8 marzo. 10km attraversando il Ponte 25 de Abril. Parte della EDP Mezza Maratona di Lisbona. Limite di 9.000 atleti. Partenza alle 10:15, limite di tempo 2h20m.",
    },
  };

  // Upsert translations for all 6 languages
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

  const variants = [
    {
      name: "Vodafone 10K",
      distanceKm: 10,
      elevationGainM: null,
      elevationLossM: null,
      startDate: new Date("2026-03-08T10:15:00Z"),
      startTime: "10:15",
      cutoffTimeHours: 2.33, // 2h20m
      price: 20,
      currency: Currency.EUR,
      maxParticipants: 9000,
      atrpGrade: null,
      itraPoints: null,
      description:
        "10K timed race crossing the iconic 25 de Abril Bridge. Start: Praça da Portagem. Finish: Praça do Império, Belém. Time limit: 2h20m.",
      pricingPhases: [
        {
          name: "Inscrição Antecipada",
          startDate: new Date("2025-10-01T00:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 15,
          currency: Currency.EUR,
          note: "1ª Fase – Inscrição antecipada",
        },
        {
          name: "Inscrição Normal",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-02-15T23:59:59Z"),
          price: 18,
          currency: Currency.EUR,
          note: "2ª Fase – Inscrição normal",
        },
        {
          name: "Inscrição Tardia",
          startDate: new Date("2026-02-16T00:00:00Z"),
          endDate: new Date("2026-03-01T23:59:59Z"),
          price: 20,
          currency: Currency.EUR,
          note: "3ª Fase – Inscrição tardia",
        },
      ],
    },
  ];

  // Delete existing pricing phases for this event to avoid duplicates
  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

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

  console.log("✅ Seed completed successfully!");
  console.log(`
📊 Summary:
- Event: Vodafone 10K Lisboa 2026
- Slug: vodafone-10k-lisboa-2026
- Variant: Vodafone 10K (10 km)
- Participant limit: 9.000
- Languages: 6 (pt, en, es, fr, de, it)
- Pricing Phases: 3 (Antecipada / Normal / Tardia)
- Date: 8 March 2026 — Start 10:15, Finish ~12:35
- Location: Ponte 25 de Abril → Praça do Império, Lisboa
- Organiser: Maratona Clube de Portugal
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
