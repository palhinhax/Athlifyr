/**
 * 🧪 Live Race Demo — Caminhada Penedo do Lexim
 *
 * Seed de teste/POC para a funcionalidade Live Race.
 * Evento: Caminhada ao Penedo do Lexim com partida na Igreja Paroquial de Cheleiros.
 * Data: 28/03/2026 às 10:30
 * Gratuito · 1 variante (Caminhada ~10.7 km)
 *
 * Execute: pnpm tsx prisma/seeds/live-race-demo-cheleiros-2026.ts
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("🧪 Seeding Live Race Demo — Caminhada Penedo do Lexim...\n");

  // ── 1. Upsert Event ─────────────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: "live-race-demo-cheleiros-2026" },
    update: {
      title: "🧪 Live Race Demo — Caminhada Penedo do Lexim",
      description:
        "Evento de teste para a funcionalidade Live Race da Athlifyr.",
      startDate: new Date("2026-03-28T10:30:00.000Z"),
      endDate: new Date("2026-03-28T16:00:00.000Z"),
      city: "Cheleiros, Mafra",
      country: "Portugal",
      imageUrl: "",
      externalUrl: null,
      isFeatured: false,
      cancelled: false,
      sportTypes: [SportType.WALKING],
      latitude: 38.8884,
      longitude: -9.3259,
      googleMapsUrl:
        "https://www.google.com/maps/place/Igreja+Paroquial+de+Cheleiros",
      hasLiveRace: true,
      liveStatus: "SCHEDULED",
    },
    create: {
      slug: "live-race-demo-cheleiros-2026",
      title: "🧪 Live Race Demo — Caminhada Penedo do Lexim",
      description:
        "Evento de teste para a funcionalidade Live Race da Athlifyr.",
      startDate: new Date("2026-03-28T10:30:00.000Z"),
      endDate: new Date("2026-03-28T16:00:00.000Z"),
      city: "Cheleiros, Mafra",
      country: "Portugal",
      imageUrl: "",
      externalUrl: null,
      isFeatured: false,
      cancelled: false,
      sportTypes: [SportType.WALKING],
      latitude: 38.8884,
      longitude: -9.3259,
      googleMapsUrl:
        "https://www.google.com/maps/place/Igreja+Paroquial+de+Cheleiros",
      hasLiveRace: true,
      liveStatus: "SCHEDULED",
    },
  });

  console.log(`✅ Event upserted: ${event.title} (${event.id})`);

  // ── 2. Translations (6 languages) ───────────────────────────────────────
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
      title: "🧪 Live Race Demo — Caminhada Penedo do Lexim",
      description: `# 🧪 Live Race Demo — Penedo do Lexim

**Projeto piloto da funcionalidade Live Race da Athlifyr!** Caminhada ao Penedo do Lexim com partida na Igreja Paroquial de Cheleiros, Mafra.

---

## 🚶 Prova

- **Caminhada** – ~10.7 km · D+ 471 m · Gratuita 🎉

---

## 📡 Live Race

Este é um evento de **teste/demonstração** do sistema de acompanhamento em tempo real. Os participantes serão acompanhados via GPS ao longo do percurso.

---

🧪 **Evento de teste — participação gratuita!**`,
      city: "Cheleiros, Mafra",
      metaTitle:
        "Live Race Demo — Caminhada Penedo do Lexim | Cheleiros, Mafra | 28 Março 2026",
      metaDescription:
        "Evento de teste Live Race da Athlifyr. Caminhada gratuita ao Penedo do Lexim com partida em Cheleiros, Mafra. 10.7 km, D+ 471 m. 28 de março de 2026.",
    },
    en: {
      title: "🧪 Live Race Demo — Penedo do Lexim Walk",
      description: `# 🧪 Live Race Demo — Penedo do Lexim

**Athlifyr Live Race feature pilot project!** Walk to Penedo do Lexim starting from Igreja Paroquial de Cheleiros, Mafra.

---

## 🚶 Race

- **Walk** – ~10.7 km · D+ 471 m · Free 🎉

---

## 📡 Live Race

This is a **test/demo** event for the real-time tracking system. Participants will be tracked via GPS along the route.

---

🧪 **Test event — free participation!**`,
      city: "Cheleiros, Mafra",
      metaTitle:
        "Live Race Demo — Penedo do Lexim Walk | Cheleiros, Mafra | 28 March 2026",
      metaDescription:
        "Athlifyr Live Race test event. Free walk to Penedo do Lexim from Cheleiros, Mafra. 10.7 km, D+ 471 m. March 28, 2026.",
    },
    es: {
      title: "🧪 Live Race Demo — Caminata Penedo do Lexim",
      description: `# 🧪 Live Race Demo — Penedo do Lexim

**¡Proyecto piloto de la funcionalidad Live Race de Athlifyr!** Caminata al Penedo do Lexim con salida en la Iglesia Parroquial de Cheleiros, Mafra.

---

## 🚶 Prueba

- **Caminata** – ~10.7 km · D+ 471 m · Gratis 🎉

---

## 📡 Live Race

Este es un evento de **prueba/demostración** del sistema de seguimiento en tiempo real. Los participantes serán seguidos por GPS a lo largo del recorrido.

---

🧪 **Evento de prueba — ¡participación gratuita!**`,
      city: "Cheleiros, Mafra",
      metaTitle:
        "Live Race Demo — Caminata Penedo do Lexim | Cheleiros, Mafra | 28 Marzo 2026",
      metaDescription:
        "Evento de prueba Live Race de Athlifyr. Caminata gratuita al Penedo do Lexim desde Cheleiros, Mafra. 10.7 km, D+ 471 m. 28 de marzo de 2026.",
    },
    fr: {
      title: "🧪 Live Race Demo — Randonnée Penedo do Lexim",
      description: `# 🧪 Live Race Demo — Penedo do Lexim

**Projet pilote de la fonctionnalité Live Race d'Athlifyr !** Randonnée au Penedo do Lexim au départ de l'Igreja Paroquial de Cheleiros, Mafra.

---

## 🚶 Épreuve

- **Randonnée** – ~10.7 km · D+ 471 m · Gratuite 🎉

---

## 📡 Live Race

Ceci est un événement de **test/démonstration** du système de suivi en temps réel. Les participants seront suivis par GPS tout au long du parcours.

---

🧪 **Événement de test — participation gratuite !**`,
      city: "Cheleiros, Mafra",
      metaTitle:
        "Live Race Demo — Randonnée Penedo do Lexim | Cheleiros, Mafra | 28 Mars 2026",
      metaDescription:
        "Événement test Live Race d'Athlifyr. Randonnée gratuite au Penedo do Lexim depuis Cheleiros, Mafra. 10.7 km, D+ 471 m. 28 mars 2026.",
    },
    de: {
      title: "🧪 Live Race Demo — Wanderung Penedo do Lexim",
      description: `# 🧪 Live Race Demo — Penedo do Lexim

**Pilotprojekt der Live Race Funktion von Athlifyr!** Wanderung zum Penedo do Lexim mit Start an der Igreja Paroquial de Cheleiros, Mafra.

---

## 🚶 Strecke

- **Wanderung** – ~10.7 km · D+ 471 m · Kostenlos 🎉

---

## 📡 Live Race

Dies ist ein **Test-/Demoevent** des Echtzeit-Trackingsystems. Die Teilnehmer werden per GPS entlang der Strecke verfolgt.

---

🧪 **Testevent — kostenlose Teilnahme!**`,
      city: "Cheleiros, Mafra",
      metaTitle:
        "Live Race Demo — Wanderung Penedo do Lexim | Cheleiros, Mafra | 28. März 2026",
      metaDescription:
        "Athlifyr Live Race Testevent. Kostenlose Wanderung zum Penedo do Lexim ab Cheleiros, Mafra. 10.7 km, D+ 471 m. 28. März 2026.",
    },
    it: {
      title: "🧪 Live Race Demo — Camminata Penedo do Lexim",
      description: `# 🧪 Live Race Demo — Penedo do Lexim

**Progetto pilota della funzionalità Live Race di Athlifyr!** Camminata al Penedo do Lexim con partenza dalla Igreja Paroquial de Cheleiros, Mafra.

---

## 🚶 Prova

- **Camminata** – ~10.7 km · D+ 471 m · Gratuita 🎉

---

## 📡 Live Race

Questo è un evento di **test/dimostrazione** del sistema di tracciamento in tempo reale. I partecipanti saranno seguiti via GPS lungo il percorso.

---

🧪 **Evento di test — partecipazione gratuita!**`,
      city: "Cheleiros, Mafra",
      metaTitle:
        "Live Race Demo — Camminata Penedo do Lexim | Cheleiros, Mafra | 28 Marzo 2026",
      metaDescription:
        "Evento test Live Race di Athlifyr. Camminata gratuita al Penedo do Lexim da Cheleiros, Mafra. 10.7 km, D+ 471 m. 28 marzo 2026.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: { eventId: event.id, language: Language[lang] },
      },
      update: translations[lang],
      create: {
        eventId: event.id,
        language: Language[lang],
        ...translations[lang],
      },
    });
  }

  console.log("✅ Event translations upserted (6 languages)");

  // ── 3. Variant: Caminhada ───────────────────────────────────────────────
  const findOrCreateVariant = async (variantData: {
    name: string;
    distanceKm: number;
    elevationGainM?: number;
    elevationLossM?: number;
    startDate?: Date;
    startTime?: string;
    maxParticipants?: number;
    price?: number;
    currency?: typeof Currency.EUR;
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

  const caminhada = await findOrCreateVariant({
    name: "Caminhada",
    distanceKm: 10.7,
    elevationGainM: 471,
    elevationLossM: 465,
    startDate: new Date("2026-03-28T10:30:00.000Z"),
    startTime: "10:30",
    maxParticipants: 50,
    price: 0,
    currency: Currency.EUR,
  });

  console.log(`✅ Variant created: ${caminhada.name} (${caminhada.id})`);

  // ── 4. Variant Translations ─────────────────────────────────────────────
  const variantTranslations: Record<
    string,
    { name: string; description: string }
  > = {
    pt: {
      name: "Caminhada",
      description:
        "Caminhada ao Penedo do Lexim (~10.7 km, D+ 471 m). Percurso circular com partida e chegada na Igreja Paroquial de Cheleiros.",
    },
    en: {
      name: "Walk",
      description:
        "Walk to Penedo do Lexim (~10.7 km, D+ 471 m). Circular route starting and finishing at Igreja Paroquial de Cheleiros.",
    },
    es: {
      name: "Caminata",
      description:
        "Caminata al Penedo do Lexim (~10.7 km, D+ 471 m). Recorrido circular con salida y llegada en la Iglesia Parroquial de Cheleiros.",
    },
    fr: {
      name: "Randonnée",
      description:
        "Randonnée au Penedo do Lexim (~10.7 km, D+ 471 m). Parcours circulaire au départ et arrivée à l'Igreja Paroquial de Cheleiros.",
    },
    de: {
      name: "Wanderung",
      description:
        "Wanderung zum Penedo do Lexim (~10.7 km, D+ 471 m). Rundstrecke mit Start und Ziel an der Igreja Paroquial de Cheleiros.",
    },
    it: {
      name: "Camminata",
      description:
        "Camminata al Penedo do Lexim (~10.7 km, D+ 471 m). Percorso circolare con partenza e arrivo alla Igreja Paroquial de Cheleiros.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: caminhada.id,
          language: Language[lang],
        },
      },
      update: variantTranslations[lang],
      create: {
        variantId: caminhada.id,
        language: Language[lang],
        ...variantTranslations[lang],
      },
    });
  }

  console.log("✅ Variant translations upserted (6 languages)");

  // ── 5. Pricing Phase (Free) ─────────────────────────────────────────────
  const findOrCreatePricingPhase = async (
    name: string,
    data: {
      startDate: Date;
      endDate: Date;
      price: number;
      currency: typeof Currency.EUR;
      note: string | null;
    }
  ) => {
    const existing = await prisma.pricingPhase.findFirst({
      where: { eventId: event.id, name },
    });

    if (existing) {
      return await prisma.pricingPhase.update({
        where: { id: existing.id },
        data,
      });
    } else {
      return await prisma.pricingPhase.create({
        data: {
          eventId: event.id,
          variantId: caminhada.id,
          name,
          ...data,
        },
      });
    }
  };

  await findOrCreatePricingPhase("Caminhada - Inscrição Gratuita", {
    startDate: new Date("2026-03-01T00:00:00.000Z"),
    endDate: new Date("2026-03-28T09:00:00.000Z"),
    price: 0,
    currency: Currency.EUR,
    note: "Evento de teste — participação gratuita",
  });

  console.log("✅ Pricing phase created (free)");

  // ── 6. Event Route (GPX) ────────────────────────────────────────────────
  const gpxPath = path.join(
    __dirname,
    "..",
    "..",
    "docs",
    "Penedo do Lexim, com partida em Igreja Paroquial de Cheleiros.gpx"
  );

  let gpxData: string | null = null;
  let routePoints: number[][] = [];

  if (fs.existsSync(gpxPath)) {
    gpxData = fs.readFileSync(gpxPath, "utf-8");

    // Extract simplified route points (every 10th point for map rendering)
    const trkptRegex =
      /lat="([^"]+)"\s+lon="([^"]+)">[\s\S]*?<ele>([^<]+)<\/ele>/g;
    const allPoints: number[][] = [];
    let m: RegExpExecArray | null;
    while ((m = trkptRegex.exec(gpxData)) !== null) {
      allPoints.push([parseFloat(m[1]), parseFloat(m[2])]);
    }

    // Simplify: keep every 10th point + always keep first and last
    routePoints = allPoints.filter(
      (_, i) => i === 0 || i === allPoints.length - 1 || i % 10 === 0
    );

    console.log(
      `📍 GPX loaded: ${allPoints.length} points → ${routePoints.length} simplified`
    );
  } else {
    console.log("⚠️  GPX file not found, skipping route data");
  }

  // Upsert EventRoute
  const existingRoute = await prisma.eventRoute.findUnique({
    where: { variantId: caminhada.id },
  });

  if (existingRoute) {
    await prisma.eventRoute.update({
      where: { id: existingRoute.id },
      data: {
        gpxData,
        routePoints,
        distanceKm: 10.74,
        elevationGainM: 471,
        elevationLossM: 465,
      },
    });
  } else {
    await prisma.eventRoute.create({
      data: {
        variantId: caminhada.id,
        gpxData,
        routePoints,
        distanceKm: 10.74,
        elevationGainM: 471,
        elevationLossM: 465,
      },
    });
  }

  console.log("✅ Event route upserted");

  // ── 7. Route Checkpoints ────────────────────────────────────────────────
  // Start: Igreja Paroquial de Cheleiros
  // Finish: Same location (circular route)
  const checkpoints = [
    {
      name: "Partida — Igreja Paroquial de Cheleiros",
      type: "START" as const,
      order: 0,
      latitude: 38.8884,
      longitude: -9.3259,
      radiusM: 80,
    },
    {
      name: "Chegada — Igreja Paroquial de Cheleiros",
      type: "FINISH" as const,
      order: 1,
      latitude: 38.8896,
      longitude: -9.3274,
      radiusM: 80,
    },
  ];

  const route = await prisma.eventRoute.findUnique({
    where: { variantId: caminhada.id },
  });

  if (route) {
    for (const cp of checkpoints) {
      const existingCp = await prisma.routeCheckpoint.findFirst({
        where: { routeId: route.id, order: cp.order },
      });

      if (existingCp) {
        await prisma.routeCheckpoint.update({
          where: { id: existingCp.id },
          data: cp,
        });
      } else {
        await prisma.routeCheckpoint.create({
          data: { routeId: route.id, ...cp },
        });
      }
    }

    console.log("✅ Route checkpoints upserted (start + finish)");
  }

  console.log("\n🎉 Live Race Demo seed complete!");
  console.log(`   Event: ${event.title}`);
  console.log(`   Slug:  ${event.slug}`);
  console.log(`   Date:  28/03/2026 10:30`);
  console.log(`   Price: Gratuito`);
  console.log(`   Live:  hasLiveRace = true`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
