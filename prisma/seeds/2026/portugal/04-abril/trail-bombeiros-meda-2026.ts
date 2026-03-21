/**
 * Seed: VII Trail Bombeiros de Mêda 2026
 *
 * Event: Trail running in Mêda, Guarda, Portugal
 * Location: Quartel Bombeiros Voluntários de Mêda
 * Date: April 12, 2026
 * Organizer: Associação Humanitária dos Bombeiros Voluntários de Mêda
 * Sport: Trail, Running, Walking
 * Circuit: Circuito de Trail da Beira Alta 2026 (3ª Etapa)
 * 100% Solidário
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚒 Seeding VII Trail Bombeiros de Mêda 2026...");

  // ──────────────────────────────────────────────
  // 1. Upsert Event
  // ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: "trail-bombeiros-meda-2026" },
    update: {
      title: "VII Trail Bombeiros de Mêda 2026",
      description:
        "VII Trail Bombeiros de Mêda 2026 - Trail solidário em Mêda, Guarda",
      sportTypes: [SportType.TRAIL, SportType.RUNNING, SportType.WALKING],
      startDate: new Date("2026-04-12T07:30:00Z"),
      endDate: new Date("2026-04-12T15:00:00Z"),
      registrationDeadline: new Date("2026-04-07T23:59:00Z"),
      externalUrl: "https://www.acorrer.pt",
      imageUrl: "",
      city: "Mêda",
      country: "Portugal",
      latitude: 40.9603,
      longitude: -7.2632,
      googleMapsUrl: "https://maps.google.com/?q=40.9603,-7.2632",
      isFeatured: false,
      cancelled: false,
    },
    create: {
      title: "VII Trail Bombeiros de Mêda 2026",
      slug: "trail-bombeiros-meda-2026",
      description:
        "VII Trail Bombeiros de Mêda 2026 - Trail solidário em Mêda, Guarda",
      sportTypes: [SportType.TRAIL, SportType.RUNNING, SportType.WALKING],
      startDate: new Date("2026-04-12T07:30:00Z"),
      endDate: new Date("2026-04-12T15:00:00Z"),
      registrationDeadline: new Date("2026-04-07T23:59:00Z"),
      externalUrl: "https://www.acorrer.pt",
      imageUrl: "",
      city: "Mêda",
      country: "Portugal",
      latitude: 40.9603,
      longitude: -7.2632,
      googleMapsUrl: "https://maps.google.com/?q=40.9603,-7.2632",
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
      title: "VII Trail Bombeiros de Mêda 2026",
      description: `# 🚒 VII Trail Bombeiros de Mêda 2026

**A 7ª edição do Trail Bombeiros de Mêda realiza-se a 12 de abril de 2026 em Mêda, distrito da Guarda!** Organizado pela **Associação Humanitária dos Bombeiros Voluntários de Mêda**, este é um **evento 100% solidário** que integra o **Circuito de Trail da Beira Alta 2026** como **3ª etapa**.

Partida e chegada no **Quartel dos Bombeiros Voluntários de Mêda**. Percursos por trilhos, caminhos rurais, vias de terra batida e ribeiras circundantes às aldeias adjacentes do concelho de Mêda.

Prova em regime de **semi-autossuficiência** — não existem copos nos postos de abastecimento. Cada atleta deve trazer o seu recipiente para água.

---

## 🏔️ Provas

- **Trail Longo** – ±24 km · Partida 09:00 · Cutoff 4h
- **Trail Curto** – ±17 km · Partida 09:15 · Cutoff 4h
- **Mini Trail** – ±12 km · Partida 09:20 · A partir dos 11 anos (Circuito Jovem)
- **Caminhada** – ±12 km · Partida 09:20 · Participação lúdica

---

## ⏰ Horário

**Sábado, 11 de Abril:**
- 19:30 – 21:00 — Funcionamento do secretariado (Quartel dos Bombeiros)

**Domingo, 12 de Abril:**
- 07:30 — Abertura do secretariado
- 08:50 — Encerramento do secretariado / Briefing
- 09:00 — Partida Trail Longo
- 09:15 — Partida Trail Curto
- 09:20 — Partida Mini Trail e Caminhada
- 12:30 — Início do almoço
- 13:00 — Encerramento dos percursos
- 13:30 — Entrega de prémios

---

## 🎽 A inscrição inclui

- Seguro desportivo
- Dorsal (provas Trail Longo, Curto e Mini Trail)
- Abastecimentos sólidos e líquidos
- Troféus e medalhas aos classificados
- Brinde finisher a todos os participantes
- Brinde alusivo ao evento

---

## 🏆 Prémios

- Troféu aos 3 primeiros classificados geral M/F (Trail Longo, Curto e Mini Trail)
- Diploma aos 4ºs e 5ºs classificados geral M/F (Trail Longo e Curto)
- Medalha aos 3 primeiros por escalão M/F (Mini Trail — Circuito Jovem)

---

## 🏅 Circuito

- **Circuito de Trail da Beira Alta 2026** — VI(r)VER BEIRA ALTA — 3ª Etapa

---

🚒 **Os Bombeiros de Mêda esperam por ti!** 🏔️`,
      city: "Mêda",
      metaTitle: "VII Trail Bombeiros de Mêda 2026 | Mêda, Guarda | 12 Abril",
      metaDescription:
        "VII Trail Bombeiros de Mêda a 12 de abril de 2026. Trail Longo ±24km, Trail Curto ±17km, Mini Trail ±12km e Caminhada ±12km. 3ª etapa Circuito Trail da Beira Alta. Evento 100% solidário.",
    },
    en: {
      title: "7th Trail Bombeiros de Mêda 2026",
      description: `# 🚒 7th Trail Bombeiros de Mêda 2026

**The 7th edition of Trail Bombeiros de Mêda takes place on April 12, 2026 in Mêda, Guarda district!** Organized by the **Associação Humanitária dos Bombeiros Voluntários de Mêda**, this is a **100% charity event** and part of the **Circuito de Trail da Beira Alta 2026** as the **3rd stage**.

Start and finish at the **Quartel dos Bombeiros Voluntários de Mêda** (Volunteer Fire Station). Courses through trails, rural paths, dirt tracks and streams around the villages of Mêda.

Semi self-sufficiency race — no cups at aid stations. Each athlete must bring their own water container.

---

## 🏔️ Races

- **Long Trail** – ±24 km · Start 09:00 · Cutoff 4h
- **Short Trail** – ±17 km · Start 09:15 · Cutoff 4h
- **Mini Trail** – ±12 km · Start 09:20 · Ages 11+ (Youth Circuit)
- **Walk** – ±12 km · Start 09:20 · Recreational participation

---

## ⏰ Schedule

**Saturday, April 11:**
- 19:30 – 21:00 — Registration desk (Fire Station HQ)

**Sunday, April 12:**
- 07:30 — Registration desk opens
- 08:50 — Registration closes / Briefing
- 09:00 — Long Trail start
- 09:15 — Short Trail start
- 09:20 — Mini Trail and Walk start
- 12:30 — Lunch
- 13:00 — Course closure
- 13:30 — Prize ceremony

---

## 🎽 Registration includes

- Sports insurance
- Bib number (Long Trail, Short Trail and Mini Trail)
- Solid and liquid aid stations
- Trophies and medals for placed athletes
- Finisher gift for all participants
- Event souvenir

---

## 🏆 Prizes

- Trophy for top 3 overall M/F (Long Trail, Short Trail, Mini Trail)
- Diploma for 4th and 5th overall M/F (Long Trail, Short Trail)
- Medal for top 3 per age group M/F (Mini Trail — Youth Circuit)

---

## 🏅 Circuit

- **Circuito de Trail da Beira Alta 2026** — 3rd Stage

---

🚒 **The Firefighters of Mêda are waiting for you!** 🏔️`,
      city: "Mêda",
      metaTitle: "7th Trail Bombeiros de Mêda 2026 | Mêda, Guarda | April 12",
      metaDescription:
        "7th Trail Bombeiros de Mêda on April 12, 2026. Long Trail ±24km, Short Trail ±17km, Mini Trail ±12km and Walk ±12km. 3rd stage Circuito Trail da Beira Alta. 100% charity event.",
    },
    es: {
      title: "VII Trail Bombeiros de Mêda 2026",
      description: `# 🚒 VII Trail Bombeiros de Mêda 2026

**La 7ª edición del Trail Bombeiros de Mêda se celebra el 12 de abril de 2026 en Mêda, distrito de Guarda.** Organizado por la **Associação Humanitária dos Bombeiros Voluntários de Mêda**, es un **evento 100% solidario** que forma parte del **Circuito de Trail da Beira Alta 2026** como **3ª etapa**.

Salida y llegada en el **Quartel dos Bombeiros Voluntários de Mêda** (Parque de Bomberos). Recorridos por senderos, caminos rurales, pistas de tierra y arroyos de los alrededores de Mêda.

Prueba en semi-autosuficiencia — no hay vasos en los avituallamientos. Cada atleta debe traer su recipiente para agua.

---

## 🏔️ Pruebas

- **Trail Largo** – ±24 km · Salida 09:00 · Límite 4h
- **Trail Corto** – ±17 km · Salida 09:15 · Límite 4h
- **Mini Trail** – ±12 km · Salida 09:20 · Desde 11 años (Circuito Joven)
- **Caminata** – ±12 km · Salida 09:20 · Participación lúdica

---

## ⏰ Horario

**Sábado, 11 de Abril:**
- 19:30 – 21:00 — Secretaría (Parque de Bomberos)

**Domingo, 12 de Abril:**
- 07:30 — Apertura de secretaría
- 08:50 — Cierre de secretaría / Briefing
- 09:00 — Salida Trail Largo
- 09:15 — Salida Trail Corto
- 09:20 — Salida Mini Trail y Caminata
- 12:30 — Almuerzo
- 13:00 — Cierre de recorridos
- 13:30 — Entrega de premios

---

## 🎽 La inscripción incluye

- Seguro deportivo
- Dorsal (Trail Largo, Corto y Mini Trail)
- Avituallamientos sólidos y líquidos
- Trofeos y medallas a los clasificados
- Obsequio finisher para todos
- Recuerdo del evento

---

## 🏆 Premios

- Trofeo a los 3 primeros clasificados general M/F (Trail Largo, Corto y Mini Trail)
- Diploma a los 4ºs y 5ºs clasificados general M/F (Trail Largo y Corto)
- Medalla a los 3 primeros por categoría M/F (Mini Trail — Circuito Joven)

---

## 🏅 Circuito

- **Circuito de Trail da Beira Alta 2026** — 3ª Etapa

---

🚒 **¡Los Bomberos de Mêda te esperan!** 🏔️`,
      city: "Mêda",
      metaTitle: "VII Trail Bombeiros de Mêda 2026 | Mêda, Guarda | 12 Abril",
      metaDescription:
        "VII Trail Bombeiros de Mêda el 12 de abril de 2026. Trail Largo ±24km, Trail Corto ±17km, Mini Trail ±12km y Caminata ±12km. 3ª etapa Circuito Trail da Beira Alta. Evento 100% solidario.",
    },
    fr: {
      title: "7ème Trail Bombeiros de Mêda 2026",
      description: `# 🚒 7ème Trail Bombeiros de Mêda 2026

**La 7ème édition du Trail Bombeiros de Mêda a lieu le 12 avril 2026 à Mêda, district de Guarda !** Organisé par l'**Associação Humanitária dos Bombeiros Voluntários de Mêda**, c'est un **événement 100% caritatif** qui fait partie du **Circuito de Trail da Beira Alta 2026** comme **3ème étape**.

Départ et arrivée au **Quartel dos Bombeiros Voluntários de Mêda** (Caserne des Pompiers). Parcours à travers sentiers, chemins ruraux, pistes de terre et ruisseaux des environs de Mêda.

Course en semi-autosuffisance — pas de gobelets aux ravitaillements. Chaque athlète doit apporter son récipient pour l'eau.

---

## 🏔️ Épreuves

- **Trail Long** – ±24 km · Départ 09h00 · Limite 4h
- **Trail Court** – ±17 km · Départ 09h15 · Limite 4h
- **Mini Trail** – ±12 km · Départ 09h20 · Dès 11 ans (Circuit Jeunes)
- **Randonnée** – ±12 km · Départ 09h20 · Participation récréative

---

## ⏰ Programme

**Samedi 11 Avril :**
- 19h30 – 21h00 — Secrétariat (Caserne des Pompiers)

**Dimanche 12 Avril :**
- 07h30 — Ouverture du secrétariat
- 08h50 — Fermeture du secrétariat / Briefing
- 09h00 — Départ Trail Long
- 09h15 — Départ Trail Court
- 09h20 — Départ Mini Trail et Randonnée
- 12h30 — Déjeuner
- 13h00 — Fermeture des parcours
- 13h30 — Remise des prix

---

## 🎽 L'inscription comprend

- Assurance sportive
- Dossard (Trail Long, Court et Mini Trail)
- Ravitaillements solides et liquides
- Trophées et médailles aux classés
- Cadeau finisher pour tous
- Souvenir de l'événement

---

## 🏆 Prix

- Trophée aux 3 premiers classés général H/F (Trail Long, Court et Mini Trail)
- Diplôme aux 4èmes et 5èmes classés général H/F (Trail Long et Court)
- Médaille aux 3 premiers par catégorie H/F (Mini Trail — Circuit Jeunes)

---

## 🏅 Circuit

- **Circuito de Trail da Beira Alta 2026** — 3ème Étape

---

🚒 **Les Pompiers de Mêda vous attendent !** 🏔️`,
      city: "Mêda",
      metaTitle: "7ème Trail Bombeiros de Mêda 2026 | Mêda, Guarda | 12 Avril",
      metaDescription:
        "7ème Trail Bombeiros de Mêda le 12 avril 2026. Trail Long ±24km, Trail Court ±17km, Mini Trail ±12km et Randonnée ±12km. 3ème étape Circuito Trail da Beira Alta. Événement 100% caritatif.",
    },
    de: {
      title: "7. Trail Bombeiros de Mêda 2026",
      description: `# 🚒 7. Trail Bombeiros de Mêda 2026

**Die 7. Ausgabe des Trail Bombeiros de Mêda findet am 12. April 2026 in Mêda, Bezirk Guarda statt!** Organisiert von der **Associação Humanitária dos Bombeiros Voluntários de Mêda**, ist dies ein **100% gemeinnütziges Event** und Teil des **Circuito de Trail da Beira Alta 2026** als **3. Etappe**.

Start und Ziel am **Quartel dos Bombeiros Voluntários de Mêda** (Feuerwache). Strecken durch Pfade, ländliche Wege, Feldwege und Bäche rund um Mêda.

Halbautarkes Rennen — keine Becher an Verpflegungsstationen. Jeder Athlet muss seinen eigenen Wasserbehälter mitbringen.

---

## 🏔️ Rennen

- **Langer Trail** – ±24 km · Start 09:00 · Limit 4h
- **Kurzer Trail** – ±17 km · Start 09:15 · Limit 4h
- **Mini Trail** – ±12 km · Start 09:20 · Ab 11 Jahren (Jugendkreis)
- **Wanderung** – ±12 km · Start 09:20 · Freizeitteilnahme

---

## ⏰ Zeitplan

**Samstag, 11. April:**
- 19:30 – 21:00 — Sekretariat (Feuerwache)

**Sonntag, 12. April:**
- 07:30 — Eröffnung des Sekretariats
- 08:50 — Sekretariat schließt / Briefing
- 09:00 — Start Langer Trail
- 09:15 — Start Kurzer Trail
- 09:20 — Start Mini Trail und Wanderung
- 12:30 — Mittagessen
- 13:00 — Streckenschluss
- 13:30 — Preisverleihung

---

## 🎽 Die Anmeldung beinhaltet

- Sportversicherung
- Startnummer (Langer Trail, Kurzer Trail und Mini Trail)
- Feste und flüssige Verpflegung
- Pokale und Medaillen für Platzierte
- Finisher-Geschenk für alle
- Veranstaltungsandenken

---

## 🏆 Preise

- Pokal für die Top 3 Gesamtwertung M/W (Langer Trail, Kurzer Trail, Mini Trail)
- Diplom für 4. und 5. Gesamtwertung M/W (Langer Trail, Kurzer Trail)
- Medaille für Top 3 pro Altersklasse M/W (Mini Trail — Jugendkreis)

---

## 🏅 Serie

- **Circuito de Trail da Beira Alta 2026** — 3. Etappe

---

🚒 **Die Feuerwehr von Mêda wartet auf dich!** 🏔️`,
      city: "Mêda",
      metaTitle: "7. Trail Bombeiros de Mêda 2026 | Mêda, Guarda | 12. April",
      metaDescription:
        "7. Trail Bombeiros de Mêda am 12. April 2026. Langer Trail ±24km, Kurzer Trail ±17km, Mini Trail ±12km und Wanderung ±12km. 3. Etappe Circuito Trail da Beira Alta. 100% gemeinnützig.",
    },
    it: {
      title: "7° Trail Bombeiros de Mêda 2026",
      description: `# 🚒 7° Trail Bombeiros de Mêda 2026

**La 7ª edizione del Trail Bombeiros de Mêda si svolge il 12 aprile 2026 a Mêda, distretto di Guarda!** Organizzato dall'**Associação Humanitária dos Bombeiros Voluntários de Mêda**, è un **evento 100% benefico** che fa parte del **Circuito de Trail da Beira Alta 2026** come **3ª tappa**.

Partenza e arrivo al **Quartel dos Bombeiros Voluntários de Mêda** (Caserma dei Vigili del Fuoco). Percorsi attraverso sentieri, percorsi rurali, strade sterrate e ruscelli nei dintorni di Mêda.

Gara in semi-autosufficienza — niente bicchieri ai punti di rifornimento. Ogni atleta deve portare il proprio contenitore per l'acqua.

---

## 🏔️ Gare

- **Trail Lungo** – ±24 km · Partenza 09:00 · Limite 4h
- **Trail Corto** – ±17 km · Partenza 09:15 · Limite 4h
- **Mini Trail** – ±12 km · Partenza 09:20 · Dai 11 anni (Circuito Giovani)
- **Camminata** – ±12 km · Partenza 09:20 · Partecipazione ricreativa

---

## ⏰ Programma

**Sabato 11 Aprile:**
- 19:30 – 21:00 — Segreteria (Caserma dei Vigili del Fuoco)

**Domenica 12 Aprile:**
- 07:30 — Apertura segreteria
- 08:50 — Chiusura segreteria / Briefing
- 09:00 — Partenza Trail Lungo
- 09:15 — Partenza Trail Corto
- 09:20 — Partenza Mini Trail e Camminata
- 12:30 — Pranzo
- 13:00 — Chiusura percorsi
- 13:30 — Premiazione

---

## 🎽 L'iscrizione include

- Assicurazione sportiva
- Pettorale (Trail Lungo, Corto e Mini Trail)
- Rifornimenti solidi e liquidi
- Trofei e medaglie ai classificati
- Regalo finisher per tutti
- Ricordo dell'evento

---

## 🏆 Premi

- Trofeo ai primi 3 classificati generale M/F (Trail Lungo, Corto e Mini Trail)
- Diploma ai 4° e 5° classificati generale M/F (Trail Lungo e Corto)
- Medaglia ai primi 3 per fascia d'età M/F (Mini Trail — Circuito Giovani)

---

## 🏅 Circuito

- **Circuito de Trail da Beira Alta 2026** — 3ª Tappa

---

🚒 **I Pompieri di Mêda ti aspettano!** 🏔️`,
      city: "Mêda",
      metaTitle: "7° Trail Bombeiros de Mêda 2026 | Mêda, Guarda | 12 Aprile",
      metaDescription:
        "7° Trail Bombeiros de Mêda il 12 aprile 2026. Trail Lungo ±24km, Trail Corto ±17km, Mini Trail ±12km e Camminata ±12km. 3ª tappa Circuito Trail da Beira Alta. Evento 100% benefico.",
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

  // ── Variant 1: Trail Longo (±24 km) ──
  const trailLongo = await findOrCreateVariant({
    name: "Trail Longo",
    distanceKm: 24,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-12T09:00:00Z"),
    startTime: "09:00",
    cutoffTimeHours: 4,
    price: 18.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Trail Longo · ±24 km · Cutoff 4h · Idade mínima 18 anos",
  });
  console.log(`✅ Variant: ${trailLongo.name}`);

  // ── Variant 2: Trail Curto (±17 km) ──
  const trailCurto = await findOrCreateVariant({
    name: "Trail Curto",
    distanceKm: 17,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-12T09:15:00Z"),
    startTime: "09:15",
    cutoffTimeHours: 4,
    price: 15.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Trail Curto · ±17 km · Cutoff 4h · Idade mínima 18 anos",
  });
  console.log(`✅ Variant: ${trailCurto.name}`);

  // ── Variant 3: Mini Trail (±12 km) ──
  const miniTrail = await findOrCreateVariant({
    name: "Mini Trail",
    distanceKm: 12,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-12T09:20:00Z"),
    startTime: "09:20",
    cutoffTimeHours: 4,
    price: 13.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Mini Trail · ±12 km · A partir dos 11 anos · Circuito Trail Jovem",
  });
  console.log(`✅ Variant: ${miniTrail.name}`);

  // ── Variant 4: Caminhada (±12 km) ──
  const caminhada = await findOrCreateVariant({
    name: "Caminhada",
    distanceKm: 12,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-12T09:20:00Z"),
    startTime: "09:20",
    cutoffTimeHours: null,
    price: 10.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Caminhada · ±12 km · Participação lúdica",
  });
  console.log(`✅ Variant: ${caminhada.name}`);

  // ── Variant Translations (ALL 6 languages) ──
  const variantTranslations: Record<
    string,
    Record<string, { name: string; description: string | null }>
  > = {
    trailLongo: {
      pt: {
        name: "Trail Longo",
        description: "Trail Longo · ±24 km · Cutoff 4h · Idade mínima 18 anos",
      },
      en: {
        name: "Long Trail",
        description: "Long Trail · ±24 km · Cutoff 4h · Minimum age 18",
      },
      es: {
        name: "Trail Largo",
        description: "Trail Largo · ±24 km · Límite 4h · Edad mínima 18 años",
      },
      fr: {
        name: "Trail Long",
        description: "Trail Long · ±24 km · Limite 4h · Âge minimum 18 ans",
      },
      de: {
        name: "Langer Trail",
        description: "Langer Trail · ±24 km · Limit 4h · Mindestalter 18 Jahre",
      },
      it: {
        name: "Trail Lungo",
        description: "Trail Lungo · ±24 km · Limite 4h · Età minima 18 anni",
      },
    },
    trailCurto: {
      pt: {
        name: "Trail Curto",
        description: "Trail Curto · ±17 km · Cutoff 4h · Idade mínima 18 anos",
      },
      en: {
        name: "Short Trail",
        description: "Short Trail · ±17 km · Cutoff 4h · Minimum age 18",
      },
      es: {
        name: "Trail Corto",
        description: "Trail Corto · ±17 km · Límite 4h · Edad mínima 18 años",
      },
      fr: {
        name: "Trail Court",
        description: "Trail Court · ±17 km · Limite 4h · Âge minimum 18 ans",
      },
      de: {
        name: "Kurzer Trail",
        description: "Kurzer Trail · ±17 km · Limit 4h · Mindestalter 18 Jahre",
      },
      it: {
        name: "Trail Corto",
        description: "Trail Corto · ±17 km · Limite 4h · Età minima 18 anni",
      },
    },
    miniTrail: {
      pt: {
        name: "Mini Trail",
        description:
          "Mini Trail · ±12 km · A partir dos 11 anos · Circuito Trail Jovem",
      },
      en: {
        name: "Mini Trail",
        description: "Mini Trail · ±12 km · Ages 11+ · Youth Trail Circuit",
      },
      es: {
        name: "Mini Trail",
        description:
          "Mini Trail · ±12 km · Desde 11 años · Circuito Trail Joven",
      },
      fr: {
        name: "Mini Trail",
        description: "Mini Trail · ±12 km · Dès 11 ans · Circuit Trail Jeunes",
      },
      de: {
        name: "Mini Trail",
        description: "Mini Trail · ±12 km · Ab 11 Jahren · Jugend-Trail-Serie",
      },
      it: {
        name: "Mini Trail",
        description:
          "Mini Trail · ±12 km · Dai 11 anni · Circuito Trail Giovani",
      },
    },
    caminhada: {
      pt: {
        name: "Caminhada",
        description: "Caminhada · ±12 km · Participação lúdica",
      },
      en: {
        name: "Walk",
        description: "Walk · ±12 km · Recreational participation",
      },
      es: {
        name: "Caminata",
        description: "Caminata · ±12 km · Participación lúdica",
      },
      fr: {
        name: "Randonnée",
        description: "Randonnée · ±12 km · Participation récréative",
      },
      de: {
        name: "Wanderung",
        description: "Wanderung · ±12 km · Freizeitteilnahme",
      },
      it: {
        name: "Camminata",
        description: "Camminata · ±12 km · Partecipazione ricreativa",
      },
    },
  };

  const variantMap = [
    { variant: trailLongo, key: "trailLongo" },
    { variant: trailCurto, key: "trailCurto" },
    { variant: miniTrail, key: "miniTrail" },
    { variant: caminhada, key: "caminhada" },
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

  // Single pricing phase per variant (registration until April 7, 2026)
  await findOrCreatePricingPhase("Trail Longo - Inscrição", trailLongo.id, {
    startDate: new Date("2025-12-01T00:00:00Z"),
    endDate: new Date("2026-04-07T23:59:59Z"),
    price: 18.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Trail Curto - Inscrição", trailCurto.id, {
    startDate: new Date("2025-12-01T00:00:00Z"),
    endDate: new Date("2026-04-07T23:59:59Z"),
    price: 15.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Mini Trail - Inscrição", miniTrail.id, {
    startDate: new Date("2025-12-01T00:00:00Z"),
    endDate: new Date("2026-04-07T23:59:59Z"),
    price: 13.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Caminhada - Inscrição", caminhada.id, {
    startDate: new Date("2025-12-01T00:00:00Z"),
    endDate: new Date("2026-04-07T23:59:59Z"),
    price: 10.0,
    currency: Currency.EUR,
    note: null,
  });
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
    "Sábado 11 de abril: Secretariado das 19:30 às 21:00 (Quartel dos Bombeiros Voluntários de Mêda). Domingo 12 de abril: Secretariado 07:30–08:50. 08:50 – Briefing. 09:00 – Partida Trail Longo. 09:15 – Partida Trail Curto. 09:20 – Partida Mini Trail e Caminhada. 12:30 – Início do almoço. 13:00 – Encerramento dos percursos. 13:30 – Entrega de prémios."
  );

  const faq0Translations = {
    pt: {
      question: "Qual é o horário do evento?",
      answer:
        "Sábado 11 de abril: Secretariado das 19:30 às 21:00 (Quartel dos Bombeiros Voluntários de Mêda). Domingo 12 de abril: Secretariado 07:30–08:50. 08:50 – Briefing. 09:00 – Partida Trail Longo. 09:15 – Partida Trail Curto. 09:20 – Partida Mini Trail e Caminhada. 12:30 – Início do almoço. 13:00 – Encerramento dos percursos. 13:30 – Entrega de prémios.",
    },
    en: {
      question: "What is the event schedule?",
      answer:
        "Saturday April 11: Registration 19:30–21:00 (Mêda Volunteer Fire Station). Sunday April 12: Registration 07:30–08:50. 08:50 – Briefing. 09:00 – Long Trail start. 09:15 – Short Trail start. 09:20 – Mini Trail and Walk start. 12:30 – Lunch. 13:00 – Course closure. 13:30 – Prize ceremony.",
    },
    es: {
      question: "¿Cuál es el horario del evento?",
      answer:
        "Sábado 11 de abril: Secretaría de 19:30 a 21:00 (Parque de Bomberos Voluntarios de Mêda). Domingo 12 de abril: Secretaría 07:30–08:50. 08:50 – Briefing. 09:00 – Salida Trail Largo. 09:15 – Salida Trail Corto. 09:20 – Salida Mini Trail y Caminata. 12:30 – Almuerzo. 13:00 – Cierre de recorridos. 13:30 – Entrega de premios.",
    },
    fr: {
      question: "Quel est le programme de l'événement ?",
      answer:
        "Samedi 11 avril : Secrétariat de 19h30 à 21h00 (Caserne des Pompiers Volontaires de Mêda). Dimanche 12 avril : Secrétariat 07h30–08h50. 08h50 – Briefing. 09h00 – Départ Trail Long. 09h15 – Départ Trail Court. 09h20 – Départ Mini Trail et Randonnée. 12h30 – Déjeuner. 13h00 – Fermeture des parcours. 13h30 – Remise des prix.",
    },
    de: {
      question: "Wie ist der Zeitplan der Veranstaltung?",
      answer:
        "Samstag 11. April: Sekretariat 19:30–21:00 (Feuerwache Mêda). Sonntag 12. April: Sekretariat 07:30–08:50. 08:50 – Briefing. 09:00 – Start Langer Trail. 09:15 – Start Kurzer Trail. 09:20 – Start Mini Trail und Wanderung. 12:30 – Mittagessen. 13:00 – Streckenschluss. 13:30 – Preisverleihung.",
    },
    it: {
      question: "Qual è il programma dell'evento?",
      answer:
        "Sabato 11 aprile: Segreteria dalle 19:30 alle 21:00 (Caserma dei Vigili del Fuoco di Mêda). Domenica 12 aprile: Segreteria 07:30–08:50. 08:50 – Briefing. 09:00 – Partenza Trail Lungo. 09:15 – Partenza Trail Corto. 09:20 – Partenza Mini Trail e Camminata. 12:30 – Pranzo. 13:00 – Chiusura percorsi. 13:30 – Premiazione.",
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
    "Seguro desportivo, dorsal (provas Trail Longo, Curto e Mini Trail), abastecimentos sólidos e líquidos, troféus e medalhas aos atletas classificados, brinde finisher a todos os participantes e brinde alusivo ao evento. Cronometragem eletrónica com live timing na plataforma Acorrer."
  );

  const faq1Translations = {
    pt: {
      question: "O que está incluído na inscrição?",
      answer:
        "Seguro desportivo, dorsal (provas Trail Longo, Curto e Mini Trail), abastecimentos sólidos e líquidos, troféus e medalhas aos atletas classificados, brinde finisher a todos os participantes e brinde alusivo ao evento. Cronometragem eletrónica com live timing na plataforma Acorrer.",
    },
    en: {
      question: "What is included in the registration?",
      answer:
        "Sports insurance, bib number (Long Trail, Short Trail, Mini Trail), solid and liquid aid stations, trophies and medals for placed athletes, finisher gift for all participants and event souvenir. Electronic timing with live timing on the Acorrer platform.",
    },
    es: {
      question: "¿Qué incluye la inscripción?",
      answer:
        "Seguro deportivo, dorsal (Trail Largo, Corto y Mini Trail), avituallamientos sólidos y líquidos, trofeos y medallas a los clasificados, obsequio finisher para todos y recuerdo del evento. Cronometraje electrónico con live timing en la plataforma Acorrer.",
    },
    fr: {
      question: "Que comprend l'inscription ?",
      answer:
        "Assurance sportive, dossard (Trail Long, Court et Mini Trail), ravitaillements solides et liquides, trophées et médailles aux classés, cadeau finisher pour tous et souvenir de l'événement. Chronométrage électronique avec live timing sur la plateforme Acorrer.",
    },
    de: {
      question: "Was ist in der Anmeldung enthalten?",
      answer:
        "Sportversicherung, Startnummer (Langer Trail, Kurzer Trail, Mini Trail), feste und flüssige Verpflegung, Pokale und Medaillen für Platzierte, Finisher-Geschenk für alle und Veranstaltungsandenken. Elektronische Zeitmessung mit Live-Timing auf der Acorrer-Plattform.",
    },
    it: {
      question: "Cosa è incluso nell'iscrizione?",
      answer:
        "Assicurazione sportiva, pettorale (Trail Lungo, Corto e Mini Trail), rifornimenti solidi e liquidi, trofei e medaglie ai classificati, regalo finisher per tutti e ricordo dell'evento. Cronometraggio elettronico con live timing sulla piattaforma Acorrer.",
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

  // ── FAQ 2: Mandatory material ──
  const faq2 = await findOrCreateFAQ(
    event.id,
    2,
    "Qual é o material obrigatório?",
    "Material obrigatório: telemóvel e recipiente para água. Material sugerido: calçado e vestuário adequados para trail, boné, corta-vento, mochila, apito, manta térmica. Não existem copos nos postos de abastecimento — cada atleta deve transportar o seu recipiente. O dorsal deve ser usado visível na parte da frente do corpo durante toda a prova."
  );

  const faq2Translations = {
    pt: {
      question: "Qual é o material obrigatório?",
      answer:
        "Material obrigatório: telemóvel e recipiente para água. Material sugerido: calçado e vestuário adequados para trail, boné, corta-vento, mochila, apito, manta térmica. Não existem copos nos postos de abastecimento — cada atleta deve transportar o seu recipiente. O dorsal deve ser usado visível na parte da frente do corpo durante toda a prova.",
    },
    en: {
      question: "What mandatory equipment is required?",
      answer:
        "Mandatory: mobile phone and water container. Recommended: appropriate trail footwear and clothing, cap, windbreaker, backpack, whistle, thermal blanket. No cups at aid stations — each athlete must carry their own container. Bib must be worn visibly on the front of the body throughout the race.",
    },
    es: {
      question: "¿Cuál es el material obligatorio?",
      answer:
        "Material obligatorio: teléfono móvil y recipiente para agua. Material recomendado: calzado y ropa adecuados para trail, gorra, cortavientos, mochila, silbato, manta térmica. No hay vasos en los avituallamientos — cada atleta debe llevar su recipiente. El dorsal debe llevarse visible en la parte frontal del cuerpo durante toda la prueba.",
    },
    fr: {
      question: "Quel est le matériel obligatoire ?",
      answer:
        "Obligatoire : téléphone portable et récipient pour l'eau. Recommandé : chaussures et vêtements de trail adaptés, casquette, coupe-vent, sac à dos, sifflet, couverture de survie. Pas de gobelets aux ravitaillements — chaque athlète doit transporter son récipient. Le dossard doit être porté visible sur le devant du corps pendant toute la course.",
    },
    de: {
      question: "Welche Pflichtausrüstung ist erforderlich?",
      answer:
        "Pflicht: Mobiltelefon und Wasserbehälter. Empfohlen: geeignete Trail-Schuhe und -Kleidung, Mütze, Windjacke, Rucksack, Trillerpfeife, Rettungsdecke. Keine Becher an Verpflegungsstationen — jeder Athlet muss seinen eigenen Behälter mitführen. Die Startnummer muss sichtbar vorne am Körper getragen werden.",
    },
    it: {
      question: "Quale equipaggiamento obbligatorio è richiesto?",
      answer:
        "Obbligatorio: telefono cellulare e contenitore per l'acqua. Consigliato: calzature e abbigliamento da trail adeguati, cappellino, giacca antivento, zaino, fischietto, coperta termica. Niente bicchieri ai rifornimenti — ogni atleta deve portare il proprio contenitore. Il pettorale deve essere indossato visibile sul petto durante tutta la gara.",
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
  console.log("✅ FAQ 2: Mandatory material");

  // ── FAQ 3: Prizes ──
  const faq3 = await findOrCreateFAQ(
    event.id,
    3,
    "Quais são os prémios?",
    "Troféu aos 3 primeiros classificados da geral M/F das provas Trail Longo, Trail Curto e Mini Trail. Diploma aos 4ºs e 5ºs classificados da geral M/F do Trail Longo e Trail Curto. Medalha aos 3 primeiros classificados de cada escalão M/F das provas Trail Longo, Curto e Mini Trail (Circuito Jovem para Mini Trail). Entrega de prémios: 13:30 junto à meta."
  );

  const faq3Translations = {
    pt: {
      question: "Quais são os prémios?",
      answer:
        "Troféu aos 3 primeiros classificados da geral M/F das provas Trail Longo, Trail Curto e Mini Trail. Diploma aos 4ºs e 5ºs classificados da geral M/F do Trail Longo e Trail Curto. Medalha aos 3 primeiros classificados de cada escalão M/F das provas Trail Longo, Curto e Mini Trail (Circuito Jovem para Mini Trail). Entrega de prémios: 13:30 junto à meta.",
    },
    en: {
      question: "What are the prizes?",
      answer:
        "Trophy for top 3 overall M/F in Long Trail, Short Trail and Mini Trail. Diploma for 4th and 5th overall M/F in Long Trail and Short Trail. Medal for top 3 per age group M/F in Long Trail, Short Trail and Mini Trail (Youth Circuit for Mini Trail). Prize ceremony: 13:30 at the finish line.",
    },
    es: {
      question: "¿Cuáles son los premios?",
      answer:
        "Trofeo a los 3 primeros clasificados general M/F del Trail Largo, Trail Corto y Mini Trail. Diploma a los 4ºs y 5ºs clasificados general M/F del Trail Largo y Trail Corto. Medalla a los 3 primeros por categoría M/F del Trail Largo, Corto y Mini Trail (Circuito Joven para Mini Trail). Entrega de premios: 13:30 en la meta.",
    },
    fr: {
      question: "Quels sont les prix ?",
      answer:
        "Trophée aux 3 premiers classés général H/F du Trail Long, Trail Court et Mini Trail. Diplôme aux 4èmes et 5èmes classés général H/F du Trail Long et Trail Court. Médaille aux 3 premiers par catégorie H/F du Trail Long, Court et Mini Trail (Circuit Jeunes pour Mini Trail). Remise des prix : 13h30 à l'arrivée.",
    },
    de: {
      question: "Welche Preise gibt es?",
      answer:
        "Pokal für die Top 3 Gesamtwertung M/W im Langen Trail, Kurzen Trail und Mini Trail. Diplom für den 4. und 5. Platz Gesamtwertung M/W im Langen Trail und Kurzen Trail. Medaille für die Top 3 pro Altersklasse M/W in Langem Trail, Kurzem Trail und Mini Trail (Jugendkreis für Mini Trail). Preisverleihung: 13:30 am Ziel.",
    },
    it: {
      question: "Quali sono i premi?",
      answer:
        "Trofeo ai 3 primi classificati generale M/F del Trail Lungo, Trail Corto e Mini Trail. Diploma ai 4° e 5° classificati generale M/F del Trail Lungo e Trail Corto. Medaglia ai 3 primi per fascia d'età M/F del Trail Lungo, Corto e Mini Trail (Circuito Giovani per Mini Trail). Premiazione: 13:30 all'arrivo.",
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

  // ── FAQ 4: Lunch ──
  const faq4 = await findOrCreateFAQ(
    event.id,
    4,
    "Há almoço disponível?",
    "Almoço disponível mediante reserva no ato de inscrição. Participantes: 6 €. Acompanhantes: 8 €. O almoço será servido a partir das 12:30 no local do evento."
  );

  const faq4Translations = {
    pt: {
      question: "Há almoço disponível?",
      answer:
        "Almoço disponível mediante reserva no ato de inscrição. Participantes: 6 €. Acompanhantes: 8 €. O almoço será servido a partir das 12:30 no local do evento.",
    },
    en: {
      question: "Is lunch available?",
      answer:
        "Lunch available upon reservation at registration. Participants: €6. Companions: €8. Lunch will be served from 12:30 at the event venue.",
    },
    es: {
      question: "¿Hay almuerzo disponible?",
      answer:
        "Almuerzo disponible mediante reserva en el momento de la inscripción. Participantes: 6 €. Acompañantes: 8 €. El almuerzo se servirá a partir de las 12:30 en el lugar del evento.",
    },
    fr: {
      question: "Y a-t-il un déjeuner disponible ?",
      answer:
        "Déjeuner disponible sur réservation à l'inscription. Participants : 6 €. Accompagnants : 8 €. Le déjeuner sera servi à partir de 12h30 sur le lieu de l'événement.",
    },
    de: {
      question: "Gibt es Mittagessen?",
      answer:
        "Mittagessen verfügbar nach Reservierung bei der Anmeldung. Teilnehmer: 6 €. Begleiter: 8 €. Das Mittagessen wird ab 12:30 am Veranstaltungsort serviert.",
    },
    it: {
      question: "È disponibile il pranzo?",
      answer:
        "Pranzo disponibile su prenotazione al momento dell'iscrizione. Partecipanti: 6 €. Accompagnatori: 8 €. Il pranzo sarà servito dalle 12:30 nel luogo dell'evento.",
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
  console.log("✅ FAQ 4: Lunch");

  // ── FAQ 5: Age requirements ──
  const faq5 = await findOrCreateFAQ(
    event.id,
    5,
    "Quais são os requisitos de idade para participar?",
    "Trail Longo e Curto: 18 anos ou mais (ou nascidos até 31/12/2011 para o Trail Curto, com termo de responsabilidade assinado por representante legal). Mini Trail: 11 a 14 anos, com termo de responsabilidade assinado por representante legal (classifica para o Circuito de Trail Jovem). Caminhada: participação lúdica, aberta a todos."
  );

  const faq5Translations = {
    pt: {
      question: "Quais são os requisitos de idade para participar?",
      answer:
        "Trail Longo e Curto: 18 anos ou mais (ou nascidos até 31/12/2011 para o Trail Curto, com termo de responsabilidade assinado por representante legal). Mini Trail: 11 a 14 anos, com termo de responsabilidade assinado por representante legal (classifica para o Circuito de Trail Jovem). Caminhada: participação lúdica, aberta a todos.",
    },
    en: {
      question: "What are the age requirements to participate?",
      answer:
        "Long and Short Trail: 18 years or older (or born before 31/12/2011 for Short Trail, with parental consent form). Mini Trail: ages 11 to 14, with parental consent form (qualifies for Youth Trail Circuit). Walk: recreational participation, open to all.",
    },
    es: {
      question: "¿Cuáles son los requisitos de edad para participar?",
      answer:
        "Trail Largo y Corto: 18 años o más (o nacidos hasta 31/12/2011 para el Trail Corto, con autorización del representante legal). Mini Trail: 11 a 14 años, con autorización del representante legal (clasifica para el Circuito Trail Joven). Caminata: participación lúdica, abierta a todos.",
    },
    fr: {
      question: "Quelles sont les conditions d'âge pour participer ?",
      answer:
        "Trail Long et Court : 18 ans ou plus (ou nés avant le 31/12/2011 pour le Trail Court, avec autorisation du représentant légal). Mini Trail : 11 à 14 ans, avec autorisation du représentant légal (qualifie pour le Circuit Trail Jeunes). Randonnée : participation récréative, ouverte à tous.",
    },
    de: {
      question: "Welche Altersanforderungen gelten für die Teilnahme?",
      answer:
        "Langer und Kurzer Trail: ab 18 Jahre (oder geboren vor 31.12.2011 für den Kurzen Trail, mit Einverständniserklärung des Erziehungsberechtigten). Mini Trail: 11 bis 14 Jahre, mit Einverständniserklärung (qualifiziert für den Jugend-Trail-Kreis). Wanderung: Freizeitteilnahme, für alle offen.",
    },
    it: {
      question: "Quali sono i requisiti di età per partecipare?",
      answer:
        "Trail Lungo e Corto: 18 anni o più (o nati prima del 31/12/2011 per il Trail Corto, con autorizzazione del rappresentante legale). Mini Trail: 11-14 anni, con autorizzazione del rappresentante legale (classifica per il Circuito Trail Giovani). Camminata: partecipazione ricreativa, aperta a tutti.",
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
  console.log("✅ FAQ 5: Age requirements");

  // ── FAQ 6: Aid stations ──
  const faq6 = await findOrCreateFAQ(
    event.id,
    6,
    "Como funcionam os abastecimentos?",
    "Trail Longo: 2 postos de abastecimento e controlo. Trail Curto, Mini Trail e Caminhada: 1 posto de abastecimento e controlo. A passagem pelos postos é obrigatória — não passar implica desclassificação. Não existem copos nos abastecimentos — cada atleta deve transportar o seu recipiente. Ao deixar cada posto, o atleta é responsável por levar líquido suficiente até ao próximo."
  );

  const faq6Translations = {
    pt: {
      question: "Como funcionam os abastecimentos?",
      answer:
        "Trail Longo: 2 postos de abastecimento e controlo. Trail Curto, Mini Trail e Caminhada: 1 posto de abastecimento e controlo. A passagem pelos postos é obrigatória — não passar implica desclassificação. Não existem copos nos abastecimentos — cada atleta deve transportar o seu recipiente. Ao deixar cada posto, o atleta é responsável por levar líquido suficiente até ao próximo.",
    },
    en: {
      question: "How do the aid stations work?",
      answer:
        "Long Trail: 2 aid and control stations. Short Trail, Mini Trail and Walk: 1 aid and control station. Passing through stations is mandatory — failure to do so results in disqualification. No cups at aid stations — each athlete must carry their own container. When leaving each station, the athlete is responsible for carrying enough liquid to reach the next one.",
    },
    es: {
      question: "¿Cómo funcionan los avituallamientos?",
      answer:
        "Trail Largo: 2 puestos de avituallamiento y control. Trail Corto, Mini Trail y Caminata: 1 puesto de avituallamiento y control. El paso por los puestos es obligatorio — no pasar implica descalificación. No hay vasos en los avituallamientos — cada atleta debe llevar su recipiente. Al dejar cada puesto, el atleta es responsable de llevar líquido suficiente hasta el siguiente.",
    },
    fr: {
      question: "Comment fonctionnent les ravitaillements ?",
      answer:
        "Trail Long : 2 postes de ravitaillement et contrôle. Trail Court, Mini Trail et Randonnée : 1 poste de ravitaillement et contrôle. Le passage aux postes est obligatoire — ne pas passer entraîne la disqualification. Pas de gobelets aux ravitaillements — chaque athlète doit transporter son récipient. En quittant chaque poste, l'athlète est responsable de transporter suffisamment de liquide jusqu'au prochain.",
    },
    de: {
      question: "Wie funktionieren die Verpflegungsstationen?",
      answer:
        "Langer Trail: 2 Verpflegungs- und Kontrollstationen. Kurzer Trail, Mini Trail und Wanderung: 1 Verpflegungs- und Kontrollstation. Die Passage durch die Stationen ist Pflicht — Nichtpassieren führt zur Disqualifikation. Keine Becher an Verpflegungsstationen — jeder Athlet muss seinen eigenen Behälter mitführen. Beim Verlassen jeder Station ist der Athlet verantwortlich, genügend Flüssigkeit bis zur nächsten Station mitzuführen.",
    },
    it: {
      question: "Come funzionano i rifornimenti?",
      answer:
        "Trail Lungo: 2 punti di rifornimento e controllo. Trail Corto, Mini Trail e Camminata: 1 punto di rifornimento e controllo. Il passaggio ai punti è obbligatorio — non passare comporta la squalifica. Niente bicchieri ai rifornimenti — ogni atleta deve portare il proprio contenitore. Lasciando ogni punto, l'atleta è responsabile di portare liquido sufficiente fino al successivo.",
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
  console.log("✅ FAQ 6: Aid stations");

  // ── FAQ 7: Contacts ──
  const faq7 = await findOrCreateFAQ(
    event.id,
    7,
    "Quais são os contactos da organização?",
    "Associação Humanitária dos Bombeiros Voluntários de Mêda. Telefone: 279 882 115. E-mail: bvmedaeventos@gmail.com. Inscrições: www.acorrer.pt."
  );

  const faq7Translations = {
    pt: {
      question: "Quais são os contactos da organização?",
      answer:
        "Associação Humanitária dos Bombeiros Voluntários de Mêda. Telefone: 279 882 115. E-mail: bvmedaeventos@gmail.com. Inscrições: www.acorrer.pt.",
    },
    en: {
      question: "What are the organization's contacts?",
      answer:
        "Associação Humanitária dos Bombeiros Voluntários de Mêda. Phone: 279 882 115. Email: bvmedaeventos@gmail.com. Registrations: www.acorrer.pt.",
    },
    es: {
      question: "¿Cuáles son los contactos de la organización?",
      answer:
        "Associação Humanitária dos Bombeiros Voluntários de Mêda. Teléfono: 279 882 115. E-mail: bvmedaeventos@gmail.com. Inscripciones: www.acorrer.pt.",
    },
    fr: {
      question: "Quels sont les contacts de l'organisation ?",
      answer:
        "Associação Humanitária dos Bombeiros Voluntários de Mêda. Téléphone : 279 882 115. E-mail : bvmedaeventos@gmail.com. Inscriptions : www.acorrer.pt.",
    },
    de: {
      question: "Was sind die Kontaktdaten der Organisation?",
      answer:
        "Associação Humanitária dos Bombeiros Voluntários de Mêda. Telefon: 279 882 115. E-Mail: bvmedaeventos@gmail.com. Anmeldung: www.acorrer.pt.",
    },
    it: {
      question: "Quali sono i contatti dell'organizzazione?",
      answer:
        "Associação Humanitária dos Bombeiros Voluntários de Mêda. Telefono: 279 882 115. E-mail: bvmedaeventos@gmail.com. Iscrizioni: www.acorrer.pt.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq7.id, language: Language[lang] } },
      update: faq7Translations[lang],
      create: {
        faqId: faq7.id,
        language: Language[lang],
        ...faq7Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 7: Contacts");

  // ──────────────────────────────────────────────
  // Done
  // ──────────────────────────────────────────────
  console.log(`
🚒 VII Trail Bombeiros de Mêda 2026 seed completed!
──────────────────────────────────────────────
- Slug: trail-bombeiros-meda-2026
- Date: April 12, 2026
- Location: Quartel Bombeiros Voluntários de Mêda, Guarda
- Variants: Trail Longo (±24km), Trail Curto (±17km), Mini Trail (±12km), Caminhada (±12km)
- Pricing: €18 / €15 / €13 / €10 (single phase until Apr 7)
- FAQs: 8 with translations in 6 languages
- Circuit: Circuito de Trail da Beira Alta 2026 (3ª Etapa)
- 100% Solidário event
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
