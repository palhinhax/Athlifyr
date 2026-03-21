/**
 * Seed: Trilho dos Cogumelos 2026
 *
 * Event: Trail running in Alcaria da Serra, Vidigueira, Beja
 * Location: Largo da Bica, Alcaria da Serra, Vidigueira
 * Date: March 29, 2026
 * Organizer: Câmara Municipal de Vidigueira (+ Junta de Freguesia de Selmes + Associação de Atletismo de Beja)
 * Sport: Trail, Running, Walking
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🍄 Seeding Trilho dos Cogumelos - Vidigueira 2026...");

  // ──────────────────────────────────────────────
  // 1. Upsert Event
  // ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: "trilho-dos-cogumelos-vidigueira-2026" },
    update: {
      title: "Trilho dos Cogumelos 2026",
      description:
        "Trilho dos Cogumelos 2026 - Trail em Alcaria da Serra, Vidigueira",
      sportTypes: [SportType.TRAIL, SportType.RUNNING, SportType.WALKING],
      startDate: new Date("2026-03-29T08:00:00Z"),
      endDate: new Date("2026-03-29T16:00:00Z"),
      registrationDeadline: new Date("2026-03-24T23:59:00Z"),
      externalUrl: "https://www.acorrer.pt",
      imageUrl: "",
      city: "Vidigueira",
      country: "Portugal",
      latitude: 38.1789,
      longitude: -7.7219,
      googleMapsUrl: "https://maps.google.com/?q=38.1789,-7.7219",
      isFeatured: false,
      cancelled: false,
    },
    create: {
      title: "Trilho dos Cogumelos 2026",
      slug: "trilho-dos-cogumelos-vidigueira-2026",
      description:
        "Trilho dos Cogumelos 2026 - Trail em Alcaria da Serra, Vidigueira",
      sportTypes: [SportType.TRAIL, SportType.RUNNING, SportType.WALKING],
      startDate: new Date("2026-03-29T08:00:00Z"),
      endDate: new Date("2026-03-29T16:00:00Z"),
      registrationDeadline: new Date("2026-03-24T23:59:00Z"),
      externalUrl: "https://www.acorrer.pt",
      imageUrl: "",
      city: "Vidigueira",
      country: "Portugal",
      latitude: 38.1789,
      longitude: -7.7219,
      googleMapsUrl: "https://maps.google.com/?q=38.1789,-7.7219",
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
      title: "Trilho dos Cogumelos 2026",
      description: `# 🍄 Trilho dos Cogumelos 2026

**O Trilho dos Cogumelos realiza-se a 29 de março de 2026 em Alcaria da Serra, Vidigueira, distrito de Beja!** Organizado pela **Câmara Municipal de Vidigueira** com o apoio da **Junta de Freguesia de Selmes** e da **Associação de Atletismo de Beja**.

Partida no **Largo da Bica**, em Alcaria da Serra. Percurso de dificuldade média/alta, num enquadramento ímpar junto da natureza, predominantemente em estradas de terra batida.

---

## 🏔️ Provas

- **Trail Sprint** – ±16 km · Competitivo · Partida 10:00
- **Mini Trail** – ±10 km · Não competitivo · Partida 10:00 · +18 anos
- **Futuros Campeões** – ±8 km · Gratuito · Partida 10:05 · 14–17 anos
- **Caminhada 10 km** – Partida 10:05
- **Caminhada 8 km** – Partida 10:05

---

## ⏰ Horário

- 08:00 — Abertura do secretariado (Largo da Bica, Alcaria da Serra)
- 10:00 — Partida Trail Sprint e Mini Trail
- 10:05 — Partida Futuros Campeões e Caminhadas

---

## 🎽 A inscrição inclui

- Dorsal
- Seguro de acidentes pessoal
- Abastecimentos durante o percurso (água, bolos secos e fruta)
- T-shirt oficial
- Duche no Estádio Municipal de Vidigueira

---

## 🏆 Prémios — Trail Sprint 16 km

- Troféu aos 3 primeiros de todos os escalões M/F
- Taças às 3 equipas melhor classificadas
- Prémio monetário geral M/F: 200 € · 150 € · 100 € · 50 € · 50 €
- Prémio monetário equipas: 200 € · 150 € · 100 € · 50 € · 50 €

**Mini Trail:** Troféu aos 5 primeiros geral M/F
**Futuros Campeões:** Troféu aos 5 primeiros geral M/F

---

🍄 **Vem correr no coração do Alentejo!** 🌿`,
      city: "Vidigueira",
      metaTitle:
        "Trilho dos Cogumelos 2026 | Alcaria da Serra, Vidigueira | 29 Março",
      metaDescription:
        "Trilho dos Cogumelos a 29 de março de 2026 em Alcaria da Serra, Vidigueira. Trail Sprint 16km, Mini Trail 10km, Futuros Campeões 8km e Caminhadas 10km/8km. Prémios monetários. Organização CMV.",
    },
    en: {
      title: "Mushroom Trail 2026",
      description: `# 🍄 Mushroom Trail 2026

**The Mushroom Trail (Trilho dos Cogumelos) takes place on March 29, 2026 in Alcaria da Serra, Vidigueira, Beja district!** Organized by the **Vidigueira Municipality** with support from **Junta de Freguesia de Selmes** and **Beja Athletics Association**.

Start at **Largo da Bica**, Alcaria da Serra. Medium/high difficulty course in a unique natural setting, predominantly on dirt roads.

---

## 🏔️ Races

- **Trail Sprint** – ±16 km · Competitive · Start 10:00
- **Mini Trail** – ±10 km · Non-competitive · Start 10:00 · Ages 18+
- **Future Champions** – ±8 km · Free · Start 10:05 · Ages 14–17
- **Walk 10 km** – Start 10:05
- **Walk 8 km** – Start 10:05

---

## ⏰ Schedule

- 08:00 — Registration desk opens (Largo da Bica, Alcaria da Serra)
- 10:00 — Trail Sprint and Mini Trail start
- 10:05 — Future Champions and Walks start

---

## 🎽 Registration includes

- Bib number
- Personal accident insurance
- Aid stations (water, dry cakes and fruit)
- Official t-shirt
- Showers at Vidigueira Municipal Stadium

---

## 🏆 Prizes — Trail Sprint 16 km

- Trophy for top 3 in all age groups M/F
- Cups for top 3 teams
- Prize money overall M/F: €200 · €150 · €100 · €50 · €50
- Prize money teams: €200 · €150 · €100 · €50 · €50

**Mini Trail:** Trophy for top 5 overall M/F
**Future Champions:** Trophy for top 5 overall M/F

---

🍄 **Come run in the heart of Alentejo!** 🌿`,
      city: "Vidigueira",
      metaTitle:
        "Mushroom Trail 2026 | Alcaria da Serra, Vidigueira | March 29",
      metaDescription:
        "Mushroom Trail on March 29, 2026 in Alcaria da Serra, Vidigueira. Trail Sprint 16km, Mini Trail 10km, Future Champions 8km and Walks 10km/8km. Prize money. Organized by Vidigueira Municipality.",
    },
    es: {
      title: "Trilho dos Cogumelos 2026",
      description: `# 🍄 Trilho dos Cogumelos 2026

**El Trilho dos Cogumelos se celebra el 29 de marzo de 2026 en Alcaria da Serra, Vidigueira, distrito de Beja.** Organizado por el **Ayuntamiento de Vidigueira** con el apoyo de la **Junta de Freguesia de Selmes** y la **Asociación de Atletismo de Beja**.

Salida en el **Largo da Bica**, Alcaria da Serra. Recorrido de dificultad media/alta en un entorno natural único, predominantemente por caminos de tierra.

---

## 🏔️ Pruebas

- **Trail Sprint** – ±16 km · Competitivo · Salida 10:00
- **Mini Trail** – ±10 km · No competitivo · Salida 10:00 · +18 años
- **Futuros Campeones** – ±8 km · Gratis · Salida 10:05 · 14–17 años
- **Caminata 10 km** – Salida 10:05
- **Caminata 8 km** – Salida 10:05

---

## ⏰ Horario

- 08:00 — Apertura de secretaría (Largo da Bica, Alcaria da Serra)
- 10:00 — Salida Trail Sprint y Mini Trail
- 10:05 — Salida Futuros Campeones y Caminatas

---

## 🎽 La inscripción incluye

- Dorsal
- Seguro de accidentes personal
- Avituallamientos (agua, galletas y fruta)
- Camiseta oficial
- Duchas en el Estadio Municipal de Vidigueira

---

## 🏆 Premios — Trail Sprint 16 km

- Trofeo a los 3 primeros de todos los escalones M/F
- Copas a los 3 mejores equipos
- Premio monetario general M/F: 200 € · 150 € · 100 € · 50 € · 50 €
- Premio monetario equipos: 200 € · 150 € · 100 € · 50 € · 50 €

**Mini Trail:** Trofeo a los 5 primeros general M/F
**Futuros Campeones:** Trofeo a los 5 primeros general M/F

---

🍄 **¡Ven a correr en el corazón del Alentejo!** 🌿`,
      city: "Vidigueira",
      metaTitle:
        "Trilho dos Cogumelos 2026 | Alcaria da Serra, Vidigueira | 29 Marzo",
      metaDescription:
        "Trilho dos Cogumelos el 29 de marzo de 2026 en Alcaria da Serra, Vidigueira. Trail Sprint 16km, Mini Trail 10km, Futuros Campeones 8km y Caminatas 10km/8km. Premios monetarios.",
    },
    fr: {
      title: "Trilho dos Cogumelos 2026",
      description: `# 🍄 Trilho dos Cogumelos 2026

**Le Trilho dos Cogumelos (Sentier des Champignons) a lieu le 29 mars 2026 à Alcaria da Serra, Vidigueira, district de Beja !** Organisé par la **Mairie de Vidigueira** avec le soutien de la **Junta de Freguesia de Selmes** et de l'**Association d'Athlétisme de Beja**.

Départ au **Largo da Bica**, Alcaria da Serra. Parcours de difficulté moyenne/élevée dans un cadre naturel unique, principalement sur des chemins de terre.

---

## 🏔️ Épreuves

- **Trail Sprint** – ±16 km · Compétitif · Départ 10h00
- **Mini Trail** – ±10 km · Non compétitif · Départ 10h00 · +18 ans
- **Futurs Champions** – ±8 km · Gratuit · Départ 10h05 · 14–17 ans
- **Randonnée 10 km** – Départ 10h05
- **Randonnée 8 km** – Départ 10h05

---

## ⏰ Programme

- 08h00 — Ouverture du secrétariat (Largo da Bica, Alcaria da Serra)
- 10h00 — Départ Trail Sprint et Mini Trail
- 10h05 — Départ Futurs Champions et Randonnées

---

## 🎽 L'inscription comprend

- Dossard
- Assurance accidents personnels
- Ravitaillements (eau, gâteaux secs et fruits)
- T-shirt officiel
- Douches au Stade Municipal de Vidigueira

---

## 🏆 Prix — Trail Sprint 16 km

- Trophée aux 3 premiers de toutes les catégories H/F
- Coupes aux 3 meilleures équipes
- Prix en argent général H/F : 200 € · 150 € · 100 € · 50 € · 50 €
- Prix en argent équipes : 200 € · 150 € · 100 € · 50 € · 50 €

**Mini Trail :** Trophée aux 5 premiers général H/F
**Futurs Champions :** Trophée aux 5 premiers général H/F

---

🍄 **Venez courir au cœur de l'Alentejo !** 🌿`,
      city: "Vidigueira",
      metaTitle:
        "Trilho dos Cogumelos 2026 | Alcaria da Serra, Vidigueira | 29 Mars",
      metaDescription:
        "Trilho dos Cogumelos le 29 mars 2026 à Alcaria da Serra, Vidigueira. Trail Sprint 16km, Mini Trail 10km, Futurs Champions 8km et Randonnées 10km/8km. Prix en argent.",
    },
    de: {
      title: "Trilho dos Cogumelos 2026",
      description: `# 🍄 Trilho dos Cogumelos 2026

**Der Trilho dos Cogumelos (Pilzpfad) findet am 29. März 2026 in Alcaria da Serra, Vidigueira, Bezirk Beja statt!** Organisiert von der **Gemeinde Vidigueira** mit Unterstützung der **Junta de Freguesia de Selmes** und des **Leichtathletikverbands Beja**.

Start am **Largo da Bica**, Alcaria da Serra. Strecke mit mittlerem/hohem Schwierigkeitsgrad in einzigartiger Naturkulisse, überwiegend auf Feldwegen.

---

## 🏔️ Rennen

- **Trail Sprint** – ±16 km · Wettkampf · Start 10:00
- **Mini Trail** – ±10 km · Kein Wettkampf · Start 10:00 · Ab 18 Jahren
- **Zukünftige Champions** – ±8 km · Kostenlos · Start 10:05 · 14–17 Jahre
- **Wanderung 10 km** – Start 10:05
- **Wanderung 8 km** – Start 10:05

---

## ⏰ Zeitplan

- 08:00 — Eröffnung des Sekretariats (Largo da Bica, Alcaria da Serra)
- 10:00 — Start Trail Sprint und Mini Trail
- 10:05 — Start Zukünftige Champions und Wanderungen

---

## 🎽 Die Anmeldung beinhaltet

- Startnummer
- Unfallversicherung
- Verpflegungsstationen (Wasser, Kekse und Obst)
- Offizielles T-Shirt
- Duschen im Städtischen Stadion von Vidigueira

---

## 🏆 Preise — Trail Sprint 16 km

- Pokal für die Top 3 aller Altersklassen M/W
- Pokale für die 3 besten Mannschaften
- Preisgeld Gesamtwertung M/W: 200 € · 150 € · 100 € · 50 € · 50 €
- Preisgeld Mannschaften: 200 € · 150 € · 100 € · 50 € · 50 €

**Mini Trail:** Pokal für die Top 5 Gesamtwertung M/W
**Zukünftige Champions:** Pokal für die Top 5 Gesamtwertung M/W

---

🍄 **Komm und laufe im Herzen des Alentejo!** 🌿`,
      city: "Vidigueira",
      metaTitle:
        "Trilho dos Cogumelos 2026 | Alcaria da Serra, Vidigueira | 29. März",
      metaDescription:
        "Trilho dos Cogumelos am 29. März 2026 in Alcaria da Serra, Vidigueira. Trail Sprint 16km, Mini Trail 10km, Zukünftige Champions 8km und Wanderungen 10km/8km. Preisgeld.",
    },
    it: {
      title: "Trilho dos Cogumelos 2026",
      description: `# 🍄 Trilho dos Cogumelos 2026

**Il Trilho dos Cogumelos (Sentiero dei Funghi) si svolge il 29 marzo 2026 ad Alcaria da Serra, Vidigueira, distretto di Beja!** Organizzato dal **Comune di Vidigueira** con il supporto della **Junta de Freguesia de Selmes** e dell'**Associazione di Atletica di Beja**.

Partenza al **Largo da Bica**, Alcaria da Serra. Percorso di difficoltà media/alta in un ambiente naturale unico, prevalentemente su strade sterrate.

---

## 🏔️ Gare

- **Trail Sprint** – ±16 km · Competitivo · Partenza 10:00
- **Mini Trail** – ±10 km · Non competitivo · Partenza 10:00 · +18 anni
- **Futuri Campioni** – ±8 km · Gratuito · Partenza 10:05 · 14–17 anni
- **Camminata 10 km** – Partenza 10:05
- **Camminata 8 km** – Partenza 10:05

---

## ⏰ Programma

- 08:00 — Apertura segreteria (Largo da Bica, Alcaria da Serra)
- 10:00 — Partenza Trail Sprint e Mini Trail
- 10:05 — Partenza Futuri Campioni e Camminate

---

## 🎽 L'iscrizione include

- Pettorale
- Assicurazione infortuni personali
- Rifornimenti (acqua, biscotti e frutta)
- T-shirt ufficiale
- Docce allo Stadio Municipale di Vidigueira

---

## 🏆 Premi — Trail Sprint 16 km

- Trofeo ai 3 primi di tutte le fasce d'età M/F
- Coppe alle 3 migliori squadre
- Premio in denaro classifica generale M/F: 200 € · 150 € · 100 € · 50 € · 50 €
- Premio in denaro squadre: 200 € · 150 € · 100 € · 50 € · 50 €

**Mini Trail:** Trofeo ai 5 primi generale M/F
**Futuri Campioni:** Trofeo ai 5 primi generale M/F

---

🍄 **Vieni a correre nel cuore dell'Alentejo!** 🌿`,
      city: "Vidigueira",
      metaTitle:
        "Trilho dos Cogumelos 2026 | Alcaria da Serra, Vidigueira | 29 Marzo",
      metaDescription:
        "Trilho dos Cogumelos il 29 marzo 2026 ad Alcaria da Serra, Vidigueira. Trail Sprint 16km, Mini Trail 10km, Futuri Campioni 8km e Camminate 10km/8km. Premi in denaro.",
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

  // ── Variant 1: Trail Sprint (±16 km) ──
  const trailSprint = await findOrCreateVariant({
    name: "Trail Sprint",
    distanceKm: 16,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-03-29T10:00:00Z"),
    startTime: "10:00",
    cutoffTimeHours: null,
    price: 5.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Trail Sprint · ±16 km · Competitivo · Dificuldade média/alta",
  });
  console.log(`✅ Variant: ${trailSprint.name}`);

  // ── Variant 2: Mini Trail (±10 km) ──
  const miniTrail = await findOrCreateVariant({
    name: "Mini Trail",
    distanceKm: 10,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-03-29T10:00:00Z"),
    startTime: "10:00",
    cutoffTimeHours: null,
    price: 5.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Mini Trail · ±10 km · Não competitivo · +18 anos",
  });
  console.log(`✅ Variant: ${miniTrail.name}`);

  // ── Variant 3: Futuros Campeões (±8 km) ──
  const futurosCampeoes = await findOrCreateVariant({
    name: "Futuros Campeões",
    distanceKm: 8,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-03-29T10:05:00Z"),
    startTime: "10:05",
    cutoffTimeHours: null,
    price: 0.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Futuros Campeões · ±8 km · Gratuito · 14–17 anos",
  });
  console.log(`✅ Variant: ${futurosCampeoes.name}`);

  // ── Variant 4: Caminhada 10 km ──
  const caminhada10 = await findOrCreateVariant({
    name: "Caminhada 10km",
    distanceKm: 10,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-03-29T10:05:00Z"),
    startTime: "10:05",
    cutoffTimeHours: null,
    price: 5.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Caminhada · 10 km · Participação lúdica",
  });
  console.log(`✅ Variant: ${caminhada10.name}`);

  // ── Variant 5: Caminhada 8 km ──
  const caminhada8 = await findOrCreateVariant({
    name: "Caminhada 8km",
    distanceKm: 8,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-03-29T10:05:00Z"),
    startTime: "10:05",
    cutoffTimeHours: null,
    price: 5.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Caminhada · 8 km · Participação lúdica",
  });
  console.log(`✅ Variant: ${caminhada8.name}`);

  // ── Variant Translations (ALL 6 languages) ──
  const variantTranslations: Record<
    string,
    Record<string, { name: string; description: string | null }>
  > = {
    trailSprint: {
      pt: {
        name: "Trail Sprint",
        description:
          "Trail Sprint · ±16 km · Competitivo · Dificuldade média/alta",
      },
      en: {
        name: "Trail Sprint",
        description:
          "Trail Sprint · ±16 km · Competitive · Medium/high difficulty",
      },
      es: {
        name: "Trail Sprint",
        description:
          "Trail Sprint · ±16 km · Competitivo · Dificultad media/alta",
      },
      fr: {
        name: "Trail Sprint",
        description:
          "Trail Sprint · ±16 km · Compétitif · Difficulté moyenne/élevée",
      },
      de: {
        name: "Trail Sprint",
        description:
          "Trail Sprint · ±16 km · Wettkampf · Mittlerer/hoher Schwierigkeitsgrad",
      },
      it: {
        name: "Trail Sprint",
        description:
          "Trail Sprint · ±16 km · Competitivo · Difficoltà media/alta",
      },
    },
    miniTrail: {
      pt: {
        name: "Mini Trail",
        description: "Mini Trail · ±10 km · Não competitivo · +18 anos",
      },
      en: {
        name: "Mini Trail",
        description: "Mini Trail · ±10 km · Non-competitive · Ages 18+",
      },
      es: {
        name: "Mini Trail",
        description: "Mini Trail · ±10 km · No competitivo · +18 años",
      },
      fr: {
        name: "Mini Trail",
        description: "Mini Trail · ±10 km · Non compétitif · +18 ans",
      },
      de: {
        name: "Mini Trail",
        description: "Mini Trail · ±10 km · Kein Wettkampf · Ab 18 Jahren",
      },
      it: {
        name: "Mini Trail",
        description: "Mini Trail · ±10 km · Non competitivo · +18 anni",
      },
    },
    futurosCampeoes: {
      pt: {
        name: "Futuros Campeões",
        description: "Futuros Campeões · ±8 km · Gratuito · 14–17 anos",
      },
      en: {
        name: "Future Champions",
        description: "Future Champions · ±8 km · Free · Ages 14–17",
      },
      es: {
        name: "Futuros Campeones",
        description: "Futuros Campeones · ±8 km · Gratis · 14–17 años",
      },
      fr: {
        name: "Futurs Champions",
        description: "Futurs Champions · ±8 km · Gratuit · 14–17 ans",
      },
      de: {
        name: "Zukünftige Champions",
        description: "Zukünftige Champions · ±8 km · Kostenlos · 14–17 Jahre",
      },
      it: {
        name: "Futuri Campioni",
        description: "Futuri Campioni · ±8 km · Gratuito · 14–17 anni",
      },
    },
    caminhada10: {
      pt: {
        name: "Caminhada 10km",
        description: "Caminhada · 10 km · Participação lúdica",
      },
      en: {
        name: "Walk 10km",
        description: "Walk · 10 km · Recreational participation",
      },
      es: {
        name: "Caminata 10km",
        description: "Caminata · 10 km · Participación lúdica",
      },
      fr: {
        name: "Randonnée 10km",
        description: "Randonnée · 10 km · Participation récréative",
      },
      de: {
        name: "Wanderung 10km",
        description: "Wanderung · 10 km · Freizeitteilnahme",
      },
      it: {
        name: "Camminata 10km",
        description: "Camminata · 10 km · Partecipazione ricreativa",
      },
    },
    caminhada8: {
      pt: {
        name: "Caminhada 8km",
        description: "Caminhada · 8 km · Participação lúdica",
      },
      en: {
        name: "Walk 8km",
        description: "Walk · 8 km · Recreational participation",
      },
      es: {
        name: "Caminata 8km",
        description: "Caminata · 8 km · Participación lúdica",
      },
      fr: {
        name: "Randonnée 8km",
        description: "Randonnée · 8 km · Participation récréative",
      },
      de: {
        name: "Wanderung 8km",
        description: "Wanderung · 8 km · Freizeitteilnahme",
      },
      it: {
        name: "Camminata 8km",
        description: "Camminata · 8 km · Partecipazione ricreativa",
      },
    },
  };

  const variantMap = [
    { variant: trailSprint, key: "trailSprint" },
    { variant: miniTrail, key: "miniTrail" },
    { variant: futurosCampeoes, key: "futurosCampeoes" },
    { variant: caminhada10, key: "caminhada10" },
    { variant: caminhada8, key: "caminhada8" },
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

  // Single pricing phase per variant (until March 24, 2026)
  await findOrCreatePricingPhase("Trail Sprint - Inscrição", trailSprint.id, {
    startDate: new Date("2025-12-01T00:00:00Z"),
    endDate: new Date("2026-03-24T23:59:59Z"),
    price: 5.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Mini Trail - Inscrição", miniTrail.id, {
    startDate: new Date("2025-12-01T00:00:00Z"),
    endDate: new Date("2026-03-24T23:59:59Z"),
    price: 5.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase(
    "Futuros Campeões - Inscrição",
    futurosCampeoes.id,
    {
      startDate: new Date("2025-12-01T00:00:00Z"),
      endDate: new Date("2026-03-24T23:59:59Z"),
      price: 0.0,
      currency: Currency.EUR,
      note: "Inscrição gratuita",
    }
  );
  await findOrCreatePricingPhase("Caminhada 10km - Inscrição", caminhada10.id, {
    startDate: new Date("2025-12-01T00:00:00Z"),
    endDate: new Date("2026-03-24T23:59:59Z"),
    price: 5.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Caminhada 8km - Inscrição", caminhada8.id, {
    startDate: new Date("2025-12-01T00:00:00Z"),
    endDate: new Date("2026-03-24T23:59:59Z"),
    price: 5.0,
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
    "08:00 – Abertura do secretariado (Largo da Bica, Alcaria da Serra). 10:00 – Partida Trail Sprint (16km) e Mini Trail (10km). 10:05 – Partida Futuros Campeões (8km) e Caminhadas (10km e 8km)."
  );

  const faq0Translations = {
    pt: {
      question: "Qual é o horário do evento?",
      answer:
        "08:00 – Abertura do secretariado (Largo da Bica, Alcaria da Serra). 10:00 – Partida Trail Sprint (16km) e Mini Trail (10km). 10:05 – Partida Futuros Campeões (8km) e Caminhadas (10km e 8km).",
    },
    en: {
      question: "What is the event schedule?",
      answer:
        "08:00 – Registration desk opens (Largo da Bica, Alcaria da Serra). 10:00 – Trail Sprint (16km) and Mini Trail (10km) start. 10:05 – Future Champions (8km) and Walks (10km and 8km) start.",
    },
    es: {
      question: "¿Cuál es el horario del evento?",
      answer:
        "08:00 – Apertura de secretaría (Largo da Bica, Alcaria da Serra). 10:00 – Salida Trail Sprint (16km) y Mini Trail (10km). 10:05 – Salida Futuros Campeones (8km) y Caminatas (10km y 8km).",
    },
    fr: {
      question: "Quel est le programme de l'événement ?",
      answer:
        "08h00 – Ouverture du secrétariat (Largo da Bica, Alcaria da Serra). 10h00 – Départ Trail Sprint (16km) et Mini Trail (10km). 10h05 – Départ Futurs Champions (8km) et Randonnées (10km et 8km).",
    },
    de: {
      question: "Wie ist der Zeitplan der Veranstaltung?",
      answer:
        "08:00 – Eröffnung des Sekretariats (Largo da Bica, Alcaria da Serra). 10:00 – Start Trail Sprint (16km) und Mini Trail (10km). 10:05 – Start Zukünftige Champions (8km) und Wanderungen (10km und 8km).",
    },
    it: {
      question: "Qual è il programma dell'evento?",
      answer:
        "08:00 – Apertura segreteria (Largo da Bica, Alcaria da Serra). 10:00 – Partenza Trail Sprint (16km) e Mini Trail (10km). 10:05 – Partenza Futuri Campioni (8km) e Camminate (10km e 8km).",
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
    "Dorsal, seguro de acidentes pessoal, abastecimentos durante o percurso (água, bolos secos e fruta), T-shirt oficial do evento e duche no Estádio Municipal de Vidigueira. Inscrição com almoço incluído: 10 €."
  );

  const faq1Translations = {
    pt: {
      question: "O que está incluído na inscrição?",
      answer:
        "Dorsal, seguro de acidentes pessoal, abastecimentos durante o percurso (água, bolos secos e fruta), T-shirt oficial do evento e duche no Estádio Municipal de Vidigueira. Inscrição com almoço incluído: 10 €.",
    },
    en: {
      question: "What is included in the registration?",
      answer:
        "Bib number, personal accident insurance, aid stations (water, dry cakes and fruit), official event t-shirt and showers at Vidigueira Municipal Stadium. Registration with lunch included: €10.",
    },
    es: {
      question: "¿Qué incluye la inscripción?",
      answer:
        "Dorsal, seguro de accidentes personal, avituallamientos (agua, galletas y fruta), camiseta oficial del evento y duchas en el Estadio Municipal de Vidigueira. Inscripción con almuerzo incluido: 10 €.",
    },
    fr: {
      question: "Que comprend l'inscription ?",
      answer:
        "Dossard, assurance accidents personnels, ravitaillements (eau, gâteaux secs et fruits), t-shirt officiel et douches au Stade Municipal de Vidigueira. Inscription avec déjeuner inclus : 10 €.",
    },
    de: {
      question: "Was ist in der Anmeldung enthalten?",
      answer:
        "Startnummer, Unfallversicherung, Verpflegungsstationen (Wasser, Kekse und Obst), offizielles Event-T-Shirt und Duschen im Städtischen Stadion von Vidigueira. Anmeldung mit Mittagessen: 10 €.",
    },
    it: {
      question: "Cosa è incluso nell'iscrizione?",
      answer:
        "Pettorale, assicurazione infortuni, rifornimenti (acqua, biscotti e frutta), t-shirt ufficiale e docce allo Stadio Municipale di Vidigueira. Iscrizione con pranzo incluso: 10 €.",
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
    "Trail Sprint 16km: Troféu aos 3 primeiros de todos os escalões M/F. Taças às 3 equipas melhor classificadas. Prémio monetário geral M/F: 200 € / 150 € / 100 € / 50 € / 50 €. Prémio monetário equipas: 200 € / 150 € / 100 € / 50 € / 50 €. Mini Trail e Futuros Campeões: troféus aos 5 primeiros geral M/F."
  );

  const faq2Translations = {
    pt: {
      question: "Quais são os prémios?",
      answer:
        "Trail Sprint 16km: Troféu aos 3 primeiros de todos os escalões M/F. Taças às 3 equipas melhor classificadas. Prémio monetário geral M/F: 200 € / 150 € / 100 € / 50 € / 50 €. Prémio monetário equipas: 200 € / 150 € / 100 € / 50 € / 50 €. Mini Trail e Futuros Campeões: troféus aos 5 primeiros geral M/F.",
    },
    en: {
      question: "What are the prizes?",
      answer:
        "Trail Sprint 16km: Trophy for top 3 in all age groups M/F. Cups for top 3 teams. Prize money overall M/F: €200 / €150 / €100 / €50 / €50. Prize money teams: €200 / €150 / €100 / €50 / €50. Mini Trail and Future Champions: trophies for top 5 overall M/F.",
    },
    es: {
      question: "¿Cuáles son los premios?",
      answer:
        "Trail Sprint 16km: Trofeo a los 3 primeros de todos los escalones M/F. Copas a los 3 mejores equipos. Premio monetario general M/F: 200 € / 150 € / 100 € / 50 € / 50 €. Premio monetario equipos: 200 € / 150 € / 100 € / 50 € / 50 €. Mini Trail y Futuros Campeones: trofeos a los 5 primeros general M/F.",
    },
    fr: {
      question: "Quels sont les prix ?",
      answer:
        "Trail Sprint 16km : Trophée aux 3 premiers de toutes les catégories H/F. Coupes aux 3 meilleures équipes. Prix en argent général H/F : 200 € / 150 € / 100 € / 50 € / 50 €. Prix en argent équipes : 200 € / 150 € / 100 € / 50 € / 50 €. Mini Trail et Futurs Champions : trophées aux 5 premiers général H/F.",
    },
    de: {
      question: "Welche Preise gibt es?",
      answer:
        "Trail Sprint 16km: Pokal für Top 3 aller Altersklassen M/W. Pokale für Top 3 Mannschaften. Preisgeld Gesamtwertung M/W: 200 € / 150 € / 100 € / 50 € / 50 €. Preisgeld Mannschaften: 200 € / 150 € / 100 € / 50 € / 50 €. Mini Trail und Zukünftige Champions: Pokale für Top 5 Gesamtwertung M/W.",
    },
    it: {
      question: "Quali sono i premi?",
      answer:
        "Trail Sprint 16km: Trofeo ai 3 primi di tutte le fasce d'età M/F. Coppe alle 3 migliori squadre. Premio in denaro generale M/F: 200 € / 150 € / 100 € / 50 € / 50 €. Premio in denaro squadre: 200 € / 150 € / 100 € / 50 € / 50 €. Mini Trail e Futuri Campioni: trofei ai 5 primi generale M/F.",
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

  // ── FAQ 3: Course marking & aid stations ──
  const faq3 = await findOrCreateFAQ(
    event.id,
    3,
    "Como estão sinalizados os percursos e onde são os abastecimentos?",
    "Os percursos estão sinalizados com fita plástica balizadora e setas direcionais nos troços de terra, e marcas de tinta nos troços de asfalto. Existem vários postos de abastecimento com água, bolos secos e fruta, conforme a prova. A maioria do percurso é em estradas de terra batida, com um pequeno troço de alcatrão na saída e entrada da localidade."
  );

  const faq3Translations = {
    pt: {
      question:
        "Como estão sinalizados os percursos e onde são os abastecimentos?",
      answer:
        "Os percursos estão sinalizados com fita plástica balizadora e setas direcionais nos troços de terra, e marcas de tinta nos troços de asfalto. Existem vários postos de abastecimento com água, bolos secos e fruta, conforme a prova. A maioria do percurso é em estradas de terra batida, com um pequeno troço de alcatrão na saída e entrada da localidade.",
    },
    en: {
      question: "How are the courses marked and where are the aid stations?",
      answer:
        "Courses are marked with plastic barrier tape and directional arrows on dirt sections, and paint marks on asphalt sections. There are several aid stations with water, dry cakes and fruit, depending on the race. Most of the course is on dirt roads, with a short stretch of asphalt leaving and entering the village.",
    },
    es: {
      question:
        "¿Cómo están señalizados los recorridos y dónde están los avituallamientos?",
      answer:
        "Los recorridos están señalizados con cinta plástica balizadora y flechas direccionales en los tramos de tierra, y marcas de pintura en los tramos de asfalto. Hay varios puestos de avituallamiento con agua, galletas y fruta, según la prueba. La mayor parte del recorrido es por caminos de tierra, con un pequeño tramo de asfalto a la salida y entrada de la localidad.",
    },
    fr: {
      question:
        "Comment les parcours sont-ils balisés et où sont les ravitaillements ?",
      answer:
        "Les parcours sont balisés avec du ruban plastique et des flèches directionnelles sur les sections de terre, et des marques de peinture sur les sections d'asphalte. Il y a plusieurs postes de ravitaillement avec eau, gâteaux secs et fruits, selon l'épreuve. La majeure partie du parcours est sur des chemins de terre, avec un court tronçon d'asphalte à la sortie et à l'entrée du village.",
    },
    de: {
      question:
        "Wie sind die Strecken markiert und wo sind die Verpflegungsstationen?",
      answer:
        "Die Strecken sind mit Absperrband und Richtungspfeilen auf Erdabschnitten markiert, und mit Farbmarkierungen auf Asphaltabschnitten. Es gibt mehrere Verpflegungsstationen mit Wasser, Keksen und Obst, je nach Rennen. Der Großteil der Strecke verläuft auf Feldwegen, mit einem kurzen Asphaltabschnitt am Dorfausgang und -eingang.",
    },
    it: {
      question: "Come sono segnalati i percorsi e dove sono i rifornimenti?",
      answer:
        "I percorsi sono segnalati con nastro di plastica e frecce direzionali sui tratti sterrati, e segni di vernice sui tratti asfaltati. Ci sono diversi punti di rifornimento con acqua, biscotti e frutta, a seconda della gara. La maggior parte del percorso è su strade sterrate, con un breve tratto di asfalto in uscita e in ingresso al paese.",
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
  console.log("✅ FAQ 3: Course marking & aid stations");

  // ── FAQ 4: Lunch ──
  const faq4 = await findOrCreateFAQ(
    event.id,
    4,
    "Há almoço disponível?",
    "Inscrição com almoço incluído: 10 € (inscrição 5 € + almoço 5 €). Futuros Campeões: inscrição gratuita, almoço 5 €. Acompanhantes: 5 €. Deve indicar o almoço no momento da inscrição na plataforma Acorrer."
  );

  const faq4Translations = {
    pt: {
      question: "Há almoço disponível?",
      answer:
        "Inscrição com almoço incluído: 10 € (inscrição 5 € + almoço 5 €). Futuros Campeões: inscrição gratuita, almoço 5 €. Acompanhantes: 5 €. Deve indicar o almoço no momento da inscrição na plataforma Acorrer.",
    },
    en: {
      question: "Is lunch available?",
      answer:
        "Registration with lunch: €10 (registration €5 + lunch €5). Future Champions: free registration, lunch €5. Companions: €5. Lunch must be indicated at the time of registration on the Acorrer platform.",
    },
    es: {
      question: "¿Hay almuerzo disponible?",
      answer:
        "Inscripción con almuerzo incluido: 10 € (inscripción 5 € + almuerzo 5 €). Futuros Campeones: inscripción gratuita, almuerzo 5 €. Acompañantes: 5 €. Debe indicar el almuerzo al inscribirse en la plataforma Acorrer.",
    },
    fr: {
      question: "Y a-t-il un déjeuner disponible ?",
      answer:
        "Inscription avec déjeuner : 10 € (inscription 5 € + déjeuner 5 €). Futurs Champions : inscription gratuite, déjeuner 5 €. Accompagnants : 5 €. Le déjeuner doit être indiqué lors de l'inscription sur la plateforme Acorrer.",
    },
    de: {
      question: "Gibt es Mittagessen?",
      answer:
        "Anmeldung mit Mittagessen: 10 € (Anmeldung 5 € + Mittagessen 5 €). Zukünftige Champions: kostenlose Anmeldung, Mittagessen 5 €. Begleiter: 5 €. Das Mittagessen muss bei der Anmeldung auf der Acorrer-Plattform angegeben werden.",
    },
    it: {
      question: "È disponibile il pranzo?",
      answer:
        "Iscrizione con pranzo: 10 € (iscrizione 5 € + pranzo 5 €). Futuri Campioni: iscrizione gratuita, pranzo 5 €. Accompagnatori: 5 €. Il pranzo deve essere indicato al momento dell'iscrizione sulla piattaforma Acorrer.",
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

  // ── FAQ 5: Team classification ──
  const faq5 = await findOrCreateFAQ(
    event.id,
    5,
    "Como funciona a classificação por equipas?",
    "A classificação por equipas (apenas Trail Sprint 16km) é obtida pelo somatório dos pontos dos cinco primeiros classificados de cada equipa, independentemente do escalão (M/F)."
  );

  const faq5Translations = {
    pt: {
      question: "Como funciona a classificação por equipas?",
      answer:
        "A classificação por equipas (apenas Trail Sprint 16km) é obtida pelo somatório dos pontos dos cinco primeiros classificados de cada equipa, independentemente do escalão (M/F).",
    },
    en: {
      question: "How does the team classification work?",
      answer:
        "Team classification (Trail Sprint 16km only) is calculated by the sum of points of the top five finishers from each team, regardless of age group (M/F).",
    },
    es: {
      question: "¿Cómo funciona la clasificación por equipos?",
      answer:
        "La clasificación por equipos (solo Trail Sprint 16km) se obtiene por la suma de puntos de los cinco primeros clasificados de cada equipo, independientemente de la categoría (M/F).",
    },
    fr: {
      question: "Comment fonctionne le classement par équipes ?",
      answer:
        "Le classement par équipes (Trail Sprint 16km uniquement) est obtenu par la somme des points des cinq premiers classés de chaque équipe, indépendamment de la catégorie (H/F).",
    },
    de: {
      question: "Wie funktioniert die Mannschaftswertung?",
      answer:
        "Die Mannschaftswertung (nur Trail Sprint 16km) ergibt sich aus der Summe der Punkte der fünf bestplatzierten Läufer jeder Mannschaft, unabhängig von der Altersklasse (M/W).",
    },
    it: {
      question: "Come funziona la classifica a squadre?",
      answer:
        "La classifica a squadre (solo Trail Sprint 16km) è calcolata dalla somma dei punti dei cinque migliori classificati di ogni squadra, indipendentemente dalla categoria (M/F).",
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
  console.log("✅ FAQ 5: Team classification");

  // ── FAQ 6: Contacts ──
  const faq6 = await findOrCreateFAQ(
    event.id,
    6,
    "Quais são os contactos da organização?",
    "Câmara Municipal de Vidigueira. Telefone: 284 437 400. Inscrições: www.acorrer.pt."
  );

  const faq6Translations = {
    pt: {
      question: "Quais são os contactos da organização?",
      answer:
        "Câmara Municipal de Vidigueira. Telefone: 284 437 400. Inscrições: www.acorrer.pt.",
    },
    en: {
      question: "What are the organization's contacts?",
      answer:
        "Vidigueira Municipality. Phone: 284 437 400. Registrations: www.acorrer.pt.",
    },
    es: {
      question: "¿Cuáles son los contactos de la organización?",
      answer:
        "Ayuntamiento de Vidigueira. Teléfono: 284 437 400. Inscripciones: www.acorrer.pt.",
    },
    fr: {
      question: "Quels sont les contacts de l'organisation ?",
      answer:
        "Mairie de Vidigueira. Téléphone : 284 437 400. Inscriptions : www.acorrer.pt.",
    },
    de: {
      question: "Was sind die Kontaktdaten der Organisation?",
      answer:
        "Gemeinde Vidigueira. Telefon: 284 437 400. Anmeldung: www.acorrer.pt.",
    },
    it: {
      question: "Quali sono i contatti dell'organizzazione?",
      answer:
        "Comune di Vidigueira. Telefono: 284 437 400. Iscrizioni: www.acorrer.pt.",
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
🍄 Trilho dos Cogumelos 2026 seed completed!
──────────────────────────────────────────────
- Slug: trilho-dos-cogumelos-vidigueira-2026
- Date: March 29, 2026
- Location: Largo da Bica, Alcaria da Serra, Vidigueira, Beja
- Variants: Trail Sprint (±16km), Mini Trail (±10km), Futuros Campeões (±8km, grátis), Caminhada 10km, Caminhada 8km
- Pricing: 5 €/5 €/0 €/5 €/5 € (single phase until Mar 24)
- FAQs: 7 with translations in 6 languages
- Organizer: Câmara Municipal de Vidigueira
- Prize money: Trail Sprint geral M/F 200€/150€/100€/50€/50€
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
