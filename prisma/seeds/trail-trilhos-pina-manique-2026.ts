/**
 * Seed: VIII Edição Trail Trilhos Pina Manique 2026
 *
 * Event: Trail running in Manique do Intendente, Azambuja, Portugal
 * Location: Manique do Intendente, Azambuja
 * Date: April 26, 2026
 * Organizer: Associação dos Amigos de Trilhos Pina Manique + Câmara Municipal de Azambuja
 * Sport: Trail, Running
 * Integrated into Festa das Tasquinhas de Manique do Intendente 2026
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏔️ Seeding Trail Trilhos Pina Manique - Azambuja 2026...");

  // ──────────────────────────────────────────────
  // 1. Upsert Event (NO nested creates)
  // ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: "trail-trilhos-pina-manique-2026" },
    update: {
      title: "VIII Edição Trail Trilhos Pina Manique 2026",
      description:
        "VIII Edição Trail Trilhos Pina Manique 2026 - Trail em Manique do Intendente, Azambuja",
      sportTypes: [SportType.TRAIL, SportType.RUNNING],
      startDate: new Date("2026-04-26T07:00:00Z"),
      endDate: new Date("2026-04-26T17:00:00Z"),
      registrationDeadline: new Date("2026-04-12T23:59:00Z"),
      externalUrl:
        "https://www.trilhoperdido.com/evento/Trail-Trilhos-Pina-Manique",
      imageUrl: "",
      city: "Manique do Intendente",
      country: "Portugal",
      latitude: 39.1233,
      longitude: -8.9764,
      googleMapsUrl: "https://maps.google.com/?q=39.1233,-8.9764",
      isFeatured: false,
      cancelled: false,
    },
    create: {
      title: "VIII Edição Trail Trilhos Pina Manique 2026",
      slug: "trail-trilhos-pina-manique-2026",
      description:
        "VIII Edição Trail Trilhos Pina Manique 2026 - Trail em Manique do Intendente, Azambuja",
      sportTypes: [SportType.TRAIL, SportType.RUNNING],
      startDate: new Date("2026-04-26T07:00:00Z"),
      endDate: new Date("2026-04-26T17:00:00Z"),
      registrationDeadline: new Date("2026-04-12T23:59:00Z"),
      externalUrl:
        "https://www.trilhoperdido.com/evento/Trail-Trilhos-Pina-Manique",
      imageUrl: "",
      city: "Manique do Intendente",
      country: "Portugal",
      latitude: 39.1233,
      longitude: -8.9764,
      googleMapsUrl: "https://maps.google.com/?q=39.1233,-8.9764",
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
      title: "VIII Edição Trail Trilhos Pina Manique 2026",
      description: `# 🏔️ VIII Edição Trail Trilhos Pina Manique 2026

**A VIII Edição do Trail Trilhos Pina Manique realiza-se a 26 de abril de 2026 em Manique do Intendente, Azambuja!** Organizado pela **Associação dos Amigos de Trilhos Pina Manique** e pela **Câmara Municipal de Azambuja**, com o apoio da **União das Freguesias de Manique do Intendente, Vila Nova de S. Pedro e Maçussa**.

A prova está integrada na **Festa das Tasquinhas de Manique do Intendente 2026** (24, 25 e 26 de abril). Os percursos iniciam-se no Largo Pina Manique e terminam no Largo dos Imperadores, percorrendo trilhos de grande beleza natural.

Prova em regime de **semi-autossuficiência** — não são distribuídas garrafas de água. Traz o teu recipiente!

---

## 🏃 Provas

- **Trail** – 23 km · Competitivo · Idade mínima 18 anos
- **Mini Trail** – 13 km · Competitivo · Idade mínima 16 anos
- **Caminhada** – 10 km · Não competitiva

---

## ⏰ Horário

**Sábado, 25 de Abril:**
- 10:00 – Início do Secretariado
- 23:00 – Fecho do Secretariado

**Domingo, 26 de Abril:**
- 07:00 – Início do Secretariado
- 09:00 – Fecho do Secretariado
- 14:00 – Hora limite de chegada

---

## 🎽 A inscrição inclui

- T-shirt técnica (inscrições até 12 de abril)
- Dorsal personalizado (inscrições até 12 de abril)
- Chip de cronometragem
- Abastecimentos na prova
- Seguro individual
- Saco oferta com produtos regionais
- Banho quente
- Prémio finisher

---

## 🍽️ Almoço opcional

- Participantes: 6 € (feijoada, pão, bebidas, doces e fruta)
- Acompanhantes: 7 €

---

🏔️ **Vem trilhar por Manique do Intendente!** 🌾`,
      city: "Manique do Intendente",
      metaTitle: "VIII Trail Trilhos Pina Manique 2026 | Azambuja | 26 Abril",
      metaDescription:
        "VIII Edição Trail Trilhos Pina Manique a 26 de abril de 2026 em Manique do Intendente, Azambuja. Trail 23km, Mini Trail 13km e Caminhada 10km. Integrado na Festa das Tasquinhas.",
    },
    en: {
      title: "8th Edition Trail Trilhos Pina Manique 2026",
      description: `# 🏔️ 8th Edition Trail Trilhos Pina Manique 2026

**The 8th Edition of Trail Trilhos Pina Manique takes place on April 26, 2026 in Manique do Intendente, Azambuja!** Organized by the **Associação dos Amigos de Trilhos Pina Manique** and the **Azambuja Municipality**, with support from the **Parish Union of Manique do Intendente, Vila Nova de S. Pedro and Maçussa**.

The race is part of the **Festa das Tasquinhas de Manique do Intendente 2026** (April 24, 25 and 26). The courses start at Largo Pina Manique and finish at Largo dos Imperadores, running through trails of great natural beauty.

Semi self-sufficiency race — no water bottles distributed. Bring your own container!

---

## 🏃 Races

- **Trail** – 23 km · Competitive · Minimum age 18
- **Mini Trail** – 13 km · Competitive · Minimum age 16
- **Walk** – 10 km · Non-competitive

---

## ⏰ Schedule

**Saturday, April 25:**
- 10:00 – Registration desk opens
- 23:00 – Registration desk closes

**Sunday, April 26:**
- 07:00 – Registration desk opens
- 09:00 – Registration desk closes
- 14:00 – Cutoff time

---

## 🎽 Registration includes

- Technical T-shirt (registrations until April 12)
- Personalized bib (registrations until April 12)
- Timing chip
- Aid stations on course
- Individual insurance
- Gift bag with regional products
- Hot shower
- Finisher prize

---

## 🍽️ Optional lunch

- Participants: €6 (feijoada, bread, drinks, desserts and fruit)
- Companions: €7

---

🏔️ **Come trail through Manique do Intendente!** 🌾`,
      city: "Manique do Intendente",
      metaTitle: "8th Trail Trilhos Pina Manique 2026 | Azambuja | April 26",
      metaDescription:
        "8th Edition Trail Trilhos Pina Manique on April 26, 2026 in Manique do Intendente, Azambuja. Trail 23km, Mini Trail 13km and Walk 10km. Part of Festa das Tasquinhas.",
    },
    es: {
      title: "VIII Edición Trail Trilhos Pina Manique 2026",
      description: `# 🏔️ VIII Edición Trail Trilhos Pina Manique 2026

**La VIII Edición del Trail Trilhos Pina Manique se celebra el 26 de abril de 2026 en Manique do Intendente, Azambuja.** Organizado por la **Associação dos Amigos de Trilhos Pina Manique** y el **Ayuntamiento de Azambuja**, con el apoyo de la **Unión de Parroquias de Manique do Intendente, Vila Nova de S. Pedro y Maçussa**.

La prueba forma parte de la **Festa das Tasquinhas de Manique do Intendente 2026** (24, 25 y 26 de abril). Los recorridos parten del Largo Pina Manique y terminan en el Largo dos Imperadores, recorriendo senderos de gran belleza natural.

Prueba en régimen de **semi-autosuficiencia** — no se distribuyen botellas de agua. ¡Trae tu recipiente!

---

## 🏃 Pruebas

- **Trail** – 23 km · Competitivo · Edad mínima 18 años
- **Mini Trail** – 13 km · Competitivo · Edad mínima 16 años
- **Caminata** – 10 km · No competitiva

---

## ⏰ Horario

**Sábado, 25 de Abril:**
- 10:00 – Apertura de secretaría
- 23:00 – Cierre de secretaría

**Domingo, 26 de Abril:**
- 07:00 – Apertura de secretaría
- 09:00 – Cierre de secretaría
- 14:00 – Hora límite de llegada

---

## 🎽 La inscripción incluye

- Camiseta técnica (inscripciones hasta el 12 de abril)
- Dorsal personalizado (inscripciones hasta el 12 de abril)
- Chip de cronometraje
- Avituallamientos en la prueba
- Seguro individual
- Bolsa regalo con productos regionales
- Ducha caliente
- Premio finisher

---

## 🍽️ Almuerzo opcional

- Participantes: 6 € (feijoada, pan, bebidas, dulces y fruta)
- Acompañantes: 7 €

---

🏔️ **¡Ven a correr por Manique do Intendente!** 🌾`,
      city: "Manique do Intendente",
      metaTitle: "VIII Trail Trilhos Pina Manique 2026 | Azambuja | 26 Abril",
      metaDescription:
        "VIII Edición Trail Trilhos Pina Manique el 26 de abril de 2026 en Manique do Intendente, Azambuja. Trail 23km, Mini Trail 13km y Caminata 10km. Integrado en la Festa das Tasquinhas.",
    },
    fr: {
      title: "VIIIème Édition Trail Trilhos Pina Manique 2026",
      description: `# 🏔️ VIIIème Édition Trail Trilhos Pina Manique 2026

**La VIIIème Édition du Trail Trilhos Pina Manique a lieu le 26 avril 2026 à Manique do Intendente, Azambuja !** Organisé par l'**Associação dos Amigos de Trilhos Pina Manique** et la **Mairie d'Azambuja**, avec le soutien de l'**Union des Paroisses de Manique do Intendente, Vila Nova de S. Pedro et Maçussa**.

La course fait partie de la **Festa das Tasquinhas de Manique do Intendente 2026** (24, 25 et 26 avril). Les parcours partent du Largo Pina Manique et se terminent au Largo dos Imperadores, parcourant des sentiers d'une grande beauté naturelle.

Course en **semi-autosuffisance** — pas de bouteilles d'eau distribuées. Apportez votre récipient !

---

## 🏃 Épreuves

- **Trail** – 23 km · Compétitif · Âge minimum 18 ans
- **Mini Trail** – 13 km · Compétitif · Âge minimum 16 ans
- **Randonnée** – 10 km · Non compétitive

---

## ⏰ Programme

**Samedi 25 Avril :**
- 10h00 – Ouverture du secrétariat
- 23h00 – Fermeture du secrétariat

**Dimanche 26 Avril :**
- 07h00 – Ouverture du secrétariat
- 09h00 – Fermeture du secrétariat
- 14h00 – Heure limite d'arrivée

---

## 🎽 L'inscription comprend

- T-shirt technique (inscriptions jusqu'au 12 avril)
- Dossard personnalisé (inscriptions jusqu'au 12 avril)
- Puce de chronométrage
- Ravitaillements sur le parcours
- Assurance individuelle
- Sac cadeau avec produits régionaux
- Douche chaude
- Prix finisher

---

## 🍽️ Déjeuner optionnel

- Participants : 6 € (feijoada, pain, boissons, desserts et fruits)
- Accompagnants : 7 €

---

🏔️ **Venez courir à Manique do Intendente !** 🌾`,
      city: "Manique do Intendente",
      metaTitle:
        "VIIIème Trail Trilhos Pina Manique 2026 | Azambuja | 26 Avril",
      metaDescription:
        "VIIIème Édition Trail Trilhos Pina Manique le 26 avril 2026 à Manique do Intendente, Azambuja. Trail 23km, Mini Trail 13km et Randonnée 10km. Intégré à la Festa das Tasquinhas.",
    },
    de: {
      title: "8. Ausgabe Trail Trilhos Pina Manique 2026",
      description: `# 🏔️ 8. Ausgabe Trail Trilhos Pina Manique 2026

**Die 8. Ausgabe des Trail Trilhos Pina Manique findet am 26. April 2026 in Manique do Intendente, Azambuja statt!** Organisiert von der **Associação dos Amigos de Trilhos Pina Manique** und der **Stadtverwaltung Azambuja**, mit Unterstützung der **Gemeindeunion Manique do Intendente, Vila Nova de S. Pedro und Maçussa**.

Das Rennen ist Teil des **Festa das Tasquinhas de Manique do Intendente 2026** (24., 25. und 26. April). Die Strecken starten am Largo Pina Manique und enden am Largo dos Imperadores, über Wege von großer natürlicher Schönheit.

Halbautarkes Rennen — keine Wasserflaschen verteilt. Bring deinen eigenen Behälter!

---

## 🏃 Rennen

- **Trail** – 23 km · Wettkampf · Mindestalter 18 Jahre
- **Mini Trail** – 13 km · Wettkampf · Mindestalter 16 Jahre
- **Wanderung** – 10 km · Nicht kompetitiv

---

## ⏰ Zeitplan

**Samstag, 25. April:**
- 10:00 – Eröffnung des Sekretariats
- 23:00 – Schließung des Sekretariats

**Sonntag, 26. April:**
- 07:00 – Eröffnung des Sekretariats
- 09:00 – Schließung des Sekretariats
- 14:00 – Zielschluss

---

## 🎽 Die Anmeldung beinhaltet

- Funktionsshirt (Anmeldungen bis 12. April)
- Personalisierte Startnummer (Anmeldungen bis 12. April)
- Zeitmess-Chip
- Verpflegungsstationen auf der Strecke
- Einzelversicherung
- Geschenktasche mit regionalen Produkten
- Warme Dusche
- Finisher-Auszeichnung

---

## 🍽️ Optionales Mittagessen

- Teilnehmer: 6 € (Feijoada, Brot, Getränke, Süßigkeiten und Obst)
- Begleiter: 7 €

---

🏔️ **Komm und laufe durch Manique do Intendente!** 🌾`,
      city: "Manique do Intendente",
      metaTitle: "8. Trail Trilhos Pina Manique 2026 | Azambuja | 26. April",
      metaDescription:
        "8. Ausgabe Trail Trilhos Pina Manique am 26. April 2026 in Manique do Intendente, Azambuja. Trail 23km, Mini Trail 13km und Wanderung 10km. Teil des Festa das Tasquinhas.",
    },
    it: {
      title: "VIII Edizione Trail Trilhos Pina Manique 2026",
      description: `# 🏔️ VIII Edizione Trail Trilhos Pina Manique 2026

**L'VIII Edizione del Trail Trilhos Pina Manique si svolge il 26 aprile 2026 a Manique do Intendente, Azambuja!** Organizzato dall'**Associação dos Amigos de Trilhos Pina Manique** e dal **Comune di Azambuja**, con il supporto dell'**Unione delle Parrocchie di Manique do Intendente, Vila Nova de S. Pedro e Maçussa**.

La gara fa parte della **Festa das Tasquinhas de Manique do Intendente 2026** (24, 25 e 26 aprile). I percorsi partono dal Largo Pina Manique e terminano al Largo dos Imperadores, percorrendo sentieri di grande bellezza naturale.

Gara in **semi-autosufficienza** — niente bottiglie d'acqua distribuite. Porta il tuo contenitore!

---

## 🏃 Gare

- **Trail** – 23 km · Competitivo · Età minima 18 anni
- **Mini Trail** – 13 km · Competitivo · Età minima 16 anni
- **Camminata** – 10 km · Non competitiva

---

## ⏰ Programma

**Sabato 25 Aprile:**
- 10:00 – Apertura segreteria
- 23:00 – Chiusura segreteria

**Domenica 26 Aprile:**
- 07:00 – Apertura segreteria
- 09:00 – Chiusura segreteria
- 14:00 – Ora limite di arrivo

---

## 🎽 L'iscrizione include

- T-shirt tecnica (iscrizioni fino al 12 aprile)
- Pettorale personalizzato (iscrizioni fino al 12 aprile)
- Chip di cronometraggio
- Rifornimenti in gara
- Assicurazione individuale
- Sacchetto regalo con prodotti regionali
- Doccia calda
- Premio finisher

---

## 🍽️ Pranzo opzionale

- Partecipanti: 6 € (feijoada, pane, bevande, dolci e frutta)
- Accompagnatori: 7 €

---

🏔️ **Vieni a correre a Manique do Intendente!** 🌾`,
      city: "Manique do Intendente",
      metaTitle: "VIII Trail Trilhos Pina Manique 2026 | Azambuja | 26 Aprile",
      metaDescription:
        "VIII Edizione Trail Trilhos Pina Manique il 26 aprile 2026 a Manique do Intendente, Azambuja. Trail 23km, Mini Trail 13km e Camminata 10km. Parte della Festa das Tasquinhas.",
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

  // ── Variant 1: Trail (23 km) ──
  const trail23k = await findOrCreateVariant({
    name: "Trail",
    distanceKm: 23,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-26T09:30:00Z"),
    startTime: "09:30",
    cutoffTimeHours: null,
    price: 17.0,
    currency: Currency.EUR,
    maxParticipants: 800,
    atrpGrade: null,
    itraPoints: null,
    description: "Trail · 23 km · Competitivo · Idade mínima 18 anos",
  });
  console.log(`✅ Variant: ${trail23k.name}`);

  // ── Variant 2: Mini Trail (13 km) ──
  const miniTrail = await findOrCreateVariant({
    name: "Mini Trail",
    distanceKm: 13,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-26T09:30:00Z"),
    startTime: "09:30",
    cutoffTimeHours: null,
    price: 17.0,
    currency: Currency.EUR,
    maxParticipants: 800,
    atrpGrade: null,
    itraPoints: null,
    description: "Mini Trail · 13 km · Competitivo · Idade mínima 16 anos",
  });
  console.log(`✅ Variant: ${miniTrail.name}`);

  // ── Variant 3: Caminhada (10 km) ──
  const caminhada = await findOrCreateVariant({
    name: "Caminhada",
    distanceKm: 10,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-26T09:45:00Z"),
    startTime: "09:45",
    cutoffTimeHours: null,
    price: 10.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Caminhada · 10 km · Não competitiva",
  });
  console.log(`✅ Variant: ${caminhada.name}`);

  // ── Variant Translations (ALL 6 languages) ──
  const variantTranslations: Record<
    string,
    Record<string, { name: string; description: string | null }>
  > = {
    trail23k: {
      pt: {
        name: "Trail",
        description: "Trail · 23 km · Competitivo · Idade mínima 18 anos",
      },
      en: {
        name: "Trail",
        description: "Trail · 23 km · Competitive · Minimum age 18",
      },
      es: {
        name: "Trail",
        description: "Trail · 23 km · Competitivo · Edad mínima 18 años",
      },
      fr: {
        name: "Trail",
        description: "Trail · 23 km · Compétitif · Âge minimum 18 ans",
      },
      de: {
        name: "Trail",
        description: "Trail · 23 km · Wettkampf · Mindestalter 18 Jahre",
      },
      it: {
        name: "Trail",
        description: "Trail · 23 km · Competitivo · Età minima 18 anni",
      },
    },
    miniTrail: {
      pt: {
        name: "Mini Trail",
        description: "Mini Trail · 13 km · Competitivo · Idade mínima 16 anos",
      },
      en: {
        name: "Mini Trail",
        description: "Mini Trail · 13 km · Competitive · Minimum age 16",
      },
      es: {
        name: "Mini Trail",
        description: "Mini Trail · 13 km · Competitivo · Edad mínima 16 años",
      },
      fr: {
        name: "Mini Trail",
        description: "Mini Trail · 13 km · Compétitif · Âge minimum 16 ans",
      },
      de: {
        name: "Mini Trail",
        description: "Mini Trail · 13 km · Wettkampf · Mindestalter 16 Jahre",
      },
      it: {
        name: "Mini Trail",
        description: "Mini Trail · 13 km · Competitivo · Età minima 16 anni",
      },
    },
    caminhada: {
      pt: {
        name: "Caminhada",
        description: "Caminhada · 10 km · Não competitiva",
      },
      en: { name: "Walk", description: "Walk · 10 km · Non-competitive" },
      es: {
        name: "Caminata",
        description: "Caminata · 10 km · No competitiva",
      },
      fr: {
        name: "Randonnée",
        description: "Randonnée · 10 km · Non compétitive",
      },
      de: {
        name: "Wanderung",
        description: "Wanderung · 10 km · Nicht kompetitiv",
      },
      it: {
        name: "Camminata",
        description: "Camminata · 10 km · Non competitiva",
      },
    },
  };

  const variantMap = [
    { variant: trail23k, key: "trail23k" },
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

  // Phase 1: Until Dec 31, 2025
  await findOrCreatePricingPhase("Trail - 1ª Fase", trail23k.id, {
    startDate: new Date("2025-10-01T00:00:00Z"),
    endDate: new Date("2025-12-31T23:59:59Z"),
    price: 13.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Mini Trail - 1ª Fase", miniTrail.id, {
    startDate: new Date("2025-10-01T00:00:00Z"),
    endDate: new Date("2025-12-31T23:59:59Z"),
    price: 13.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Caminhada - 1ª Fase", caminhada.id, {
    startDate: new Date("2025-10-01T00:00:00Z"),
    endDate: new Date("2025-12-31T23:59:59Z"),
    price: 8.0,
    currency: Currency.EUR,
    note: null,
  });
  console.log("✅ Pricing Phase 1 created for all variants");

  // Phase 2: Jan 1, 2026 → Feb 28, 2026
  await findOrCreatePricingPhase("Trail - 2ª Fase", trail23k.id, {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-02-28T23:59:59Z"),
    price: 15.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Mini Trail - 2ª Fase", miniTrail.id, {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-02-28T23:59:59Z"),
    price: 15.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Caminhada - 2ª Fase", caminhada.id, {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-02-28T23:59:59Z"),
    price: 9.0,
    currency: Currency.EUR,
    note: null,
  });
  console.log("✅ Pricing Phase 2 created for all variants");

  // Phase 3: Mar 1, 2026 → Apr 12, 2026
  await findOrCreatePricingPhase("Trail - 3ª Fase", trail23k.id, {
    startDate: new Date("2026-03-01T00:00:00Z"),
    endDate: new Date("2026-04-12T23:59:59Z"),
    price: 17.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Mini Trail - 3ª Fase", miniTrail.id, {
    startDate: new Date("2026-03-01T00:00:00Z"),
    endDate: new Date("2026-04-12T23:59:59Z"),
    price: 17.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Caminhada - 3ª Fase", caminhada.id, {
    startDate: new Date("2026-03-01T00:00:00Z"),
    endDate: new Date("2026-04-12T23:59:59Z"),
    price: 10.0,
    currency: Currency.EUR,
    note: null,
  });
  console.log("✅ Pricing Phase 3 created for all variants");

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
    "Sábado 25 de abril: Secretariado das 10:00 às 23:00 (junto à sede da União das freguesias de Manique do Intendente). Domingo 26 de abril: Secretariado das 07:00 às 09:00. Hora limite de chegada para todas as provas: 14:00. Partida e chegada: Largo Pina Manique → Largo dos Imperadores."
  );

  const faq0Translations = {
    pt: {
      question: "Qual é o horário do evento?",
      answer:
        "Sábado 25 de abril: Secretariado das 10:00 às 23:00 (junto à sede da União das freguesias de Manique do Intendente). Domingo 26 de abril: Secretariado das 07:00 às 09:00. Hora limite de chegada para todas as provas: 14:00. Partida e chegada: Largo Pina Manique → Largo dos Imperadores.",
    },
    en: {
      question: "What is the event schedule?",
      answer:
        "Saturday April 25: Registration from 10:00 to 23:00 (at the Parish Union headquarters in Manique do Intendente). Sunday April 26: Registration from 07:00 to 09:00. Cutoff time for all races: 14:00. Start: Largo Pina Manique. Finish: Largo dos Imperadores.",
    },
    es: {
      question: "¿Cuál es el horario del evento?",
      answer:
        "Sábado 25 de abril: Secretaría de 10:00 a 23:00 (en la sede de la Unión de Parroquias de Manique do Intendente). Domingo 26 de abril: Secretaría de 07:00 a 09:00. Hora límite de llegada: 14:00. Salida: Largo Pina Manique. Meta: Largo dos Imperadores.",
    },
    fr: {
      question: "Quel est le programme de l'événement ?",
      answer:
        "Samedi 25 avril : Secrétariat de 10h00 à 23h00 (au siège de l'Union des Paroisses de Manique do Intendente). Dimanche 26 avril : Secrétariat de 07h00 à 09h00. Heure limite d'arrivée : 14h00. Départ : Largo Pina Manique. Arrivée : Largo dos Imperadores.",
    },
    de: {
      question: "Wie ist der Zeitplan der Veranstaltung?",
      answer:
        "Samstag 25. April: Sekretariat von 10:00 bis 23:00 (am Sitz der Gemeindeunion Manique do Intendente). Sonntag 26. April: Sekretariat von 07:00 bis 09:00. Zielschluss für alle Rennen: 14:00. Start: Largo Pina Manique. Ziel: Largo dos Imperadores.",
    },
    it: {
      question: "Qual è il programma dell'evento?",
      answer:
        "Sabato 25 aprile: Segreteria dalle 10:00 alle 23:00 (presso la sede dell'Unione delle Parrocchie di Manique do Intendente). Domenica 26 aprile: Segreteria dalle 07:00 alle 09:00. Ora limite di arrivo: 14:00. Partenza: Largo Pina Manique. Arrivo: Largo dos Imperadores.",
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
    "T-shirt técnica (inscrições até 12 de abril), dorsal personalizado (inscrições até 12 de abril), chip de cronometragem, abastecimentos na prova, seguro individual, saco oferta com produtos regionais, banho quente e prémio finisher. Trail 23K: 3 abastecimentos de sólidos e líquidos. Mini Trail 13K e Caminhada 10K: 2 abastecimentos de sólidos e líquidos."
  );

  const faq1Translations = {
    pt: {
      question: "O que está incluído na inscrição?",
      answer:
        "T-shirt técnica (inscrições até 12 de abril), dorsal personalizado (inscrições até 12 de abril), chip de cronometragem, abastecimentos na prova, seguro individual, saco oferta com produtos regionais, banho quente e prémio finisher. Trail 23K: 3 abastecimentos de sólidos e líquidos. Mini Trail 13K e Caminhada 10K: 2 abastecimentos de sólidos e líquidos.",
    },
    en: {
      question: "What is included in the registration?",
      answer:
        "Technical T-shirt (registrations until April 12), personalized bib (registrations until April 12), timing chip, aid stations on course, individual insurance, gift bag with regional products, hot shower and finisher prize. Trail 23K: 3 aid stations with food and liquids. Mini Trail 13K and Walk 10K: 2 aid stations with food and liquids.",
    },
    es: {
      question: "¿Qué incluye la inscripción?",
      answer:
        "Camiseta técnica (inscripciones hasta el 12 de abril), dorsal personalizado (inscripciones hasta el 12 de abril), chip de cronometraje, avituallamientos en la prueba, seguro individual, bolsa regalo con productos regionales, ducha caliente y premio finisher. Trail 23K: 3 avituallamientos de sólidos y líquidos. Mini Trail 13K y Caminata 10K: 2 avituallamientos de sólidos y líquidos.",
    },
    fr: {
      question: "Que comprend l'inscription ?",
      answer:
        "T-shirt technique (inscriptions jusqu'au 12 avril), dossard personnalisé (inscriptions jusqu'au 12 avril), puce de chronométrage, ravitaillements sur le parcours, assurance individuelle, sac cadeau avec produits régionaux, douche chaude et prix finisher. Trail 23K : 3 ravitaillements solides et liquides. Mini Trail 13K et Randonnée 10K : 2 ravitaillements solides et liquides.",
    },
    de: {
      question: "Was ist in der Anmeldung enthalten?",
      answer:
        "Funktionsshirt (Anmeldungen bis 12. April), personalisierte Startnummer (Anmeldungen bis 12. April), Zeitmess-Chip, Verpflegungsstationen auf der Strecke, Einzelversicherung, Geschenktasche mit regionalen Produkten, warme Dusche und Finisher-Auszeichnung. Trail 23K: 3 Verpflegungsstationen mit Essen und Getränken. Mini Trail 13K und Wanderung 10K: 2 Verpflegungsstationen mit Essen und Getränken.",
    },
    it: {
      question: "Cosa è incluso nell'iscrizione?",
      answer:
        "T-shirt tecnica (iscrizioni fino al 12 aprile), pettorale personalizzato (iscrizioni fino al 12 aprile), chip di cronometraggio, rifornimenti in gara, assicurazione individuale, sacchetto regalo con prodotti regionali, doccia calda e premio finisher. Trail 23K: 3 rifornimenti solidi e liquidi. Mini Trail 13K e Camminata 10K: 2 rifornimenti solidi e liquidi.",
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

  // ── FAQ 2: Aid stations / self-sufficiency ──
  const faq2 = await findOrCreateFAQ(
    event.id,
    2,
    "Como funcionam os abastecimentos?",
    "A prova decorre em regime de semi-autossuficiência, com enchimento de recipientes. Não são distribuídas garrafas de água — cada atleta deve trazer o seu recipiente e enchê-lo nas zonas de abastecimento. Trail 23K: 3 abastecimentos de sólidos e líquidos. Mini Trail 13K e Caminhada 10K: 2 abastecimentos de sólidos e líquidos."
  );

  const faq2Translations = {
    pt: {
      question: "Como funcionam os abastecimentos?",
      answer:
        "A prova decorre em regime de semi-autossuficiência, com enchimento de recipientes. Não são distribuídas garrafas de água — cada atleta deve trazer o seu recipiente e enchê-lo nas zonas de abastecimento. Trail 23K: 3 abastecimentos de sólidos e líquidos. Mini Trail 13K e Caminhada 10K: 2 abastecimentos de sólidos e líquidos.",
    },
    en: {
      question: "How do the aid stations work?",
      answer:
        "The race follows a semi self-sufficiency model with container refills. No water bottles are distributed — each athlete must bring their own container and fill it at the aid stations. Trail 23K: 3 aid stations with food and liquids. Mini Trail 13K and Walk 10K: 2 aid stations with food and liquids.",
    },
    es: {
      question: "¿Cómo funcionan los avituallamientos?",
      answer:
        "La prueba se realiza en régimen de semi-autosuficiencia, con relleno de recipientes. No se distribuyen botellas de agua — cada atleta debe traer su recipiente y rellenarlo en las zonas de avituallamiento. Trail 23K: 3 avituallamientos de sólidos y líquidos. Mini Trail 13K y Caminata 10K: 2 avituallamientos de sólidos y líquidos.",
    },
    fr: {
      question: "Comment fonctionnent les ravitaillements ?",
      answer:
        "La course se déroule en semi-autosuffisance, avec remplissage de récipients. Aucune bouteille d'eau n'est distribuée — chaque athlète doit apporter son récipient et le remplir aux points de ravitaillement. Trail 23K : 3 ravitaillements solides et liquides. Mini Trail 13K et Randonnée 10K : 2 ravitaillements solides et liquides.",
    },
    de: {
      question: "Wie funktionieren die Verpflegungsstationen?",
      answer:
        "Das Rennen folgt einem halbautarken Modell mit Behälter-Nachfüllung. Es werden keine Wasserflaschen verteilt — jeder Athlet muss seinen eigenen Behälter mitbringen und an den Verpflegungsstationen auffüllen. Trail 23K: 3 Verpflegungsstationen mit Essen und Getränken. Mini Trail 13K und Wanderung 10K: 2 Verpflegungsstationen mit Essen und Getränken.",
    },
    it: {
      question: "Come funzionano i rifornimenti?",
      answer:
        "La gara si svolge in regime di semi-autosufficienza, con riempimento dei contenitori. Non vengono distribuite bottiglie d'acqua — ogni atleta deve portare il proprio contenitore e riempirlo ai punti di rifornimento. Trail 23K: 3 rifornimenti solidi e liquidi. Mini Trail 13K e Camminata 10K: 2 rifornimenti solidi e liquidi.",
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
  console.log("✅ FAQ 2: Aid stations");

  // ── FAQ 3: Prizes ──
  const faq3 = await findOrCreateFAQ(
    event.id,
    3,
    "Quais são os prémios?",
    "Trail 23K e Mini Trail 13K: troféus para os 3 primeiros da geral M/F, troféus/medalhas para os 3 primeiros de cada escalão (Juvenil, Júnior, Sub 23, Seniores, M/F40, M/F45, M/F50, M/F55, M/F60), troféus para as 3 primeiras equipas e troféus para os 3 primeiros residentes no concelho de Azambuja M/F. Prémio ao atleta mais velho M/F que termine Trail ou Mini Trail. Prémio às 3 equipas mais numerosas (Trail + Mini Trail + Caminhada). Recordação para todos."
  );

  const faq3Translations = {
    pt: {
      question: "Quais são os prémios?",
      answer:
        "Trail 23K e Mini Trail 13K: troféus para os 3 primeiros da geral M/F, troféus/medalhas para os 3 primeiros de cada escalão (Juvenil, Júnior, Sub 23, Seniores, M/F40, M/F45, M/F50, M/F55, M/F60), troféus para as 3 primeiras equipas e troféus para os 3 primeiros residentes no concelho de Azambuja M/F. Prémio ao atleta mais velho M/F que termine Trail ou Mini Trail. Prémio às 3 equipas mais numerosas (Trail + Mini Trail + Caminhada). Recordação para todos.",
    },
    en: {
      question: "What are the prizes?",
      answer:
        "Trail 23K and Mini Trail 13K: trophies for top 3 overall M/F, trophies/medals for top 3 per age category (Youth, Junior, U23, Seniors, M/F40, M/F45, M/F50, M/F55, M/F60), trophies for top 3 teams and trophies for top 3 Azambuja municipality residents M/F. Prize for oldest athlete M/F finishing Trail or Mini Trail. Prize for 3 largest teams (Trail + Mini Trail + Walk). Souvenir for all.",
    },
    es: {
      question: "¿Cuáles son los premios?",
      answer:
        "Trail 23K y Mini Trail 13K: trofeos para los 3 primeros de la general M/F, trofeos/medallas para los 3 primeros de cada categoría (Juvenil, Júnior, Sub 23, Seniores, M/F40, M/F45, M/F50, M/F55, M/F60), trofeos para los 3 primeros equipos y trofeos para los 3 primeros residentes del municipio de Azambuja M/F. Premio al atleta más veterano M/F que termine Trail o Mini Trail. Premio a los 3 equipos más numerosos. Recuerdo para todos.",
    },
    fr: {
      question: "Quels sont les prix ?",
      answer:
        "Trail 23K et Mini Trail 13K : trophées pour les 3 premiers au général H/F, trophées/médailles pour les 3 premiers de chaque catégorie (Juvénile, Junior, U23, Seniors, H/F40, H/F45, H/F50, H/F55, H/F60), trophées pour les 3 premières équipes et trophées pour les 3 premiers résidents de la commune d'Azambuja H/F. Prix pour l'athlète le plus âgé H/F terminant Trail ou Mini Trail. Prix pour les 3 équipes les plus nombreuses. Souvenir pour tous.",
    },
    de: {
      question: "Welche Preise gibt es?",
      answer:
        "Trail 23K und Mini Trail 13K: Pokale für die Top 3 der Gesamtwertung M/W, Pokale/Medaillen für die Top 3 jeder Altersklasse (Jugend, Junior, U23, Senioren, M/W40, M/W45, M/W50, M/W55, M/W60), Pokale für die Top 3 Teams und Pokale für die Top 3 Einwohner der Gemeinde Azambuja M/W. Preis für den ältesten Athleten M/W im Trail oder Mini Trail. Preis für die 3 größten Teams. Andenken für alle.",
    },
    it: {
      question: "Quali sono i premi?",
      answer:
        "Trail 23K e Mini Trail 13K: trofei per i primi 3 della classifica generale M/F, trofei/medaglie per i primi 3 per fascia d'età (Giovani, Junior, U23, Seniores, M/F40, M/F45, M/F50, M/F55, M/F60), trofei per i primi 3 team e trofei per i primi 3 residenti del comune di Azambuja M/F. Premio per l'atleta più anziano M/F che termina Trail o Mini Trail. Premio per i 3 team più numerosi. Ricordo per tutti.",
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

  // ── FAQ 4: Optional lunch ──
  const faq4 = await findOrCreateFAQ(
    event.id,
    4,
    "Há almoço disponível?",
    "Sim! Almoço opcional servido junto ao Largo dos Imperadores. Participantes: 6 € (feijoada, pão, bebidas, doces e fruta). Acompanhantes: 7 €. Deve ser mencionado no formulário de inscrição e pago no ato da mesma."
  );

  const faq4Translations = {
    pt: {
      question: "Há almoço disponível?",
      answer:
        "Sim! Almoço opcional servido junto ao Largo dos Imperadores. Participantes: 6 € (feijoada, pão, bebidas, doces e fruta). Acompanhantes: 7 €. Deve ser mencionado no formulário de inscrição e pago no ato da mesma.",
    },
    en: {
      question: "Is lunch available?",
      answer:
        "Yes! Optional lunch served at Largo dos Imperadores. Participants: €6 (feijoada, bread, drinks, desserts and fruit). Companions: €7. Must be mentioned in the registration form and paid at the time of registration.",
    },
    es: {
      question: "¿Hay almuerzo disponible?",
      answer:
        "¡Sí! Almuerzo opcional servido en el Largo dos Imperadores. Participantes: 6 € (feijoada, pan, bebidas, dulces y fruta). Acompañantes: 7 €. Debe indicarse en el formulario de inscripción y pagarse en el momento de la inscripción.",
    },
    fr: {
      question: "Y a-t-il un déjeuner disponible ?",
      answer:
        "Oui ! Déjeuner optionnel servi au Largo dos Imperadores. Participants : 6 € (feijoada, pain, boissons, desserts et fruits). Accompagnants : 7 €. Doit être mentionné dans le formulaire d'inscription et payé lors de l'inscription.",
    },
    de: {
      question: "Gibt es ein Mittagessen?",
      answer:
        "Ja! Optionales Mittagessen am Largo dos Imperadores. Teilnehmer: 6 € (Feijoada, Brot, Getränke, Süßigkeiten und Obst). Begleiter: 7 €. Muss im Anmeldeformular angegeben und bei der Anmeldung bezahlt werden.",
    },
    it: {
      question: "È disponibile il pranzo?",
      answer:
        "Sì! Pranzo opzionale servito al Largo dos Imperadores. Partecipanti: 6 € (feijoada, pane, bevande, dolci e frutta). Accompagnatori: 7 €. Deve essere indicato nel modulo di iscrizione e pagato al momento dell'iscrizione.",
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
  console.log("✅ FAQ 4: Optional lunch");

  // ── FAQ 5: Team registration ──
  const faq5 = await findOrCreateFAQ(
    event.id,
    5,
    "Como funcionam as inscrições de equipas?",
    "Equipas com 10 ou mais elementos no Trail 23K e Mini Trail 13K devem inscrever-se através de ficheiro específico, solicitado por e-mail: trilhospinamanique@gmail.com. É oferecida uma inscrição por cada 10 elementos inscritos. A classificação por equipas conta os 5 primeiros atletas classificados na geral, independentemente do escalão ou género."
  );

  const faq5Translations = {
    pt: {
      question: "Como funcionam as inscrições de equipas?",
      answer:
        "Equipas com 10 ou mais elementos no Trail 23K e Mini Trail 13K devem inscrever-se através de ficheiro específico, solicitado por e-mail: trilhospinamanique@gmail.com. É oferecida uma inscrição por cada 10 elementos inscritos. A classificação por equipas conta os 5 primeiros atletas classificados na geral, independentemente do escalão ou género.",
    },
    en: {
      question: "How does team registration work?",
      answer:
        "Teams with 10 or more members in Trail 23K and Mini Trail 13K must register via a specific file, requested by email: trilhospinamanique@gmail.com. One free registration is offered per 10 members enrolled. Team classification counts the top 5 athletes in the overall standings, regardless of age category or gender.",
    },
    es: {
      question: "¿Cómo funcionan las inscripciones de equipos?",
      answer:
        "Equipos con 10 o más miembros en Trail 23K y Mini Trail 13K deben inscribirse mediante un fichero específico, solicitado por email: trilhospinamanique@gmail.com. Se ofrece una inscripción gratuita por cada 10 miembros inscritos. La clasificación por equipos cuenta los 5 primeros atletas en la general, independientemente de la categoría o género.",
    },
    fr: {
      question: "Comment fonctionnent les inscriptions par équipes ?",
      answer:
        "Les équipes de 10 membres ou plus sur Trail 23K et Mini Trail 13K doivent s'inscrire via un fichier spécifique, à demander par email : trilhospinamanique@gmail.com. Une inscription gratuite est offerte par tranche de 10 membres inscrits. Le classement par équipes compte les 5 premiers athlètes au classement général, indépendamment de la catégorie ou du genre.",
    },
    de: {
      question: "Wie funktioniert die Teamanmeldung?",
      answer:
        "Teams mit 10 oder mehr Mitgliedern im Trail 23K und Mini Trail 13K müssen sich über eine spezielle Datei anmelden, die per E-Mail angefordert wird: trilhospinamanique@gmail.com. Pro 10 angemeldete Mitglieder wird eine kostenlose Anmeldung angeboten. Die Teamwertung zählt die Top 5 Athleten der Gesamtwertung, unabhängig von Altersklasse oder Geschlecht.",
    },
    it: {
      question: "Come funzionano le iscrizioni per squadre?",
      answer:
        "Le squadre con 10 o più membri nel Trail 23K e Mini Trail 13K devono iscriversi tramite un file specifico, richiesto via email: trilhospinamanique@gmail.com. Viene offerta un'iscrizione gratuita ogni 10 membri iscritti. La classifica per squadre conta i primi 5 atleti in classifica generale, indipendentemente dalla fascia d'età o dal genere.",
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
  console.log("✅ FAQ 5: Team registration");

  // ── FAQ 6: Contacts ──
  const faq6 = await findOrCreateFAQ(
    event.id,
    6,
    "Quais são os contactos da organização?",
    "E-mail: trilhospinamanique@gmail.com (organização e recibos de pagamento) / infotrilhoperdido@gmail.com (classificações). Site oficial: trilhospinamanique.pt. Facebook: facebook.com/trilhospinamanique."
  );

  const faq6Translations = {
    pt: {
      question: "Quais são os contactos da organização?",
      answer:
        "E-mail: trilhospinamanique@gmail.com (organização e recibos de pagamento) / infotrilhoperdido@gmail.com (classificações). Site oficial: trilhospinamanique.pt. Facebook: facebook.com/trilhospinamanique.",
    },
    en: {
      question: "What are the organization's contacts?",
      answer:
        "Email: trilhospinamanique@gmail.com (organization and payment receipts) / infotrilhoperdido@gmail.com (classifications). Official website: trilhospinamanique.pt. Facebook: facebook.com/trilhospinamanique.",
    },
    es: {
      question: "¿Cuáles son los contactos de la organización?",
      answer:
        "E-mail: trilhospinamanique@gmail.com (organización y recibos de pago) / infotrilhoperdido@gmail.com (clasificaciones). Sitio oficial: trilhospinamanique.pt. Facebook: facebook.com/trilhospinamanique.",
    },
    fr: {
      question: "Quels sont les contacts de l'organisation ?",
      answer:
        "E-mail : trilhospinamanique@gmail.com (organisation et reçus de paiement) / infotrilhoperdido@gmail.com (classements). Site officiel : trilhospinamanique.pt. Facebook : facebook.com/trilhospinamanique.",
    },
    de: {
      question: "Was sind die Kontaktdaten der Organisation?",
      answer:
        "E-Mail: trilhospinamanique@gmail.com (Organisation und Zahlungsbelege) / infotrilhoperdido@gmail.com (Ergebnisse). Offizielle Website: trilhospinamanique.pt. Facebook: facebook.com/trilhospinamanique.",
    },
    it: {
      question: "Quali sono i contatti dell'organizzazione?",
      answer:
        "E-mail: trilhospinamanique@gmail.com (organizzazione e ricevute di pagamento) / infotrilhoperdido@gmail.com (classifiche). Sito ufficiale: trilhospinamanique.pt. Facebook: facebook.com/trilhospinamanique.",
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
🏔️ Trail Trilhos Pina Manique - Azambuja 2026 seed completed!
──────────────────────────────────────────────
- Slug: trail-trilhos-pina-manique-2026
- Date: April 26, 2026
- Location: Manique do Intendente, Azambuja, Portugal
- Variants: Trail (23km), Mini Trail (13km), Caminhada (10km)
- Pricing Phases: 3 phases × 3 variants = 9 pricing phases
- FAQs: 7 with translations in 6 languages
- Integrated: Festa das Tasquinhas de Manique do Intendente 2026
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
