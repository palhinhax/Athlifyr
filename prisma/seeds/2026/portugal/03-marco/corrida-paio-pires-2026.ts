/**
 * Seed: Corrida de Paio Pires 2026
 *
 * Event: Test race in Paio Pires (LiveRace testing)
 * Location: Paio Pires, Seixal
 * Date: Today (dynamic for testing)
 * Sport: Running
 * hasLiveRace: true
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Corrida de Paio Pires 2026...");

  // Use today's date for testing — start in 5 minutes from now
  const now = new Date();
  const startDate = new Date(now.getTime() + 5 * 60 * 1000); // 5 min from now
  const endDate = new Date(now.getTime() + 3 * 60 * 60 * 1000); // 3 hours from now
  const registrationDeadline = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago

  console.log(`📅 Start date: ${startDate.toISOString()}`);
  console.log(`📅 End date: ${endDate.toISOString()}`);

  // ──────────────────────────────────────────────
  // 1. Upsert Event (no nested creates)
  // ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: "corrida-paio-pires-2026" },
    update: {
      title: "Corrida de Paio Pires 2026",
      description:
        "Corrida de Paio Pires 2026 - Corrida de teste em Paio Pires, Seixal",
      sportTypes: [SportType.RUNNING],
      startDate: startDate,
      endDate: endDate,
      registrationDeadline: registrationDeadline,
      externalUrl: "",
      imageUrl: "",
      city: "Paio Pires",
      country: "Portugal",
      latitude: 38.6164,
      longitude: -9.0822,
      googleMapsUrl: "https://maps.app.goo.gl/PaioPires",
      isFeatured: false,
      cancelled: false,
      hasLiveRace: true,
    },
    create: {
      title: "Corrida de Paio Pires 2026",
      slug: "corrida-paio-pires-2026",
      description:
        "Corrida de Paio Pires 2026 - Corrida de teste em Paio Pires, Seixal",
      sportTypes: [SportType.RUNNING],
      startDate: startDate,
      endDate: endDate,
      registrationDeadline: registrationDeadline,
      externalUrl: "",
      imageUrl: "",
      city: "Paio Pires",
      country: "Portugal",
      latitude: 38.6164,
      longitude: -9.0822,
      googleMapsUrl: "https://maps.app.goo.gl/PaioPires",
      isFeatured: false,
      cancelled: false,
      hasLiveRace: true,
    },
  });

  console.log(`✅ Created/updated event: ${event.slug}`);

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
      title: "Corrida de Paio Pires 2026",
      description: `# 🏃 Corrida de Paio Pires 2026

**Corre pelas ruas de Paio Pires numa manhã de desporto e convívio! Uma corrida aberta a todos os níveis, com percursos de 10 km e 5 km.**

---

## 📅 Data e Horário

- **Data**: 15 de Março de 2026 (Domingo)
- **Hora de Partida**: 09h30
- **Local de Partida/Chegada**: Jardim de Paio Pires, Seixal
- **Tempo Limite**: 2h30

## 🏃 Provas Disponíveis

### Corrida 10 km
- **Distância**: 10 km
- **Hora de Partida**: 09h30
- **Desnível**: Plano
- **Participantes máximos**: 500

### Caminhada / Fun Run 5 km
- **Distância**: 5 km
- **Hora de Partida**: 09h45
- **Desnível**: Plano
- **Participantes máximos**: 300

## 🎯 Destaques

✅ **LiveRace** — acompanhamento em tempo real 📡  
✅ **Percurso plano** ideal para iniciantes e recordes pessoais  
✅ **Medalha finisher** para todos os participantes  
✅ **Abastecimento** nos km 3 e km 7  
✅ **Animação musical** na partida e na meta 🎶  

## 📋 Levantamento do Kit

**Local**: Jardim de Paio Pires

**Horários**:
- **Sábado, 14 de Março**: 10h00 às 18h00
- **Domingo, 15 de Março**: 07h30 às 09h00

## 📍 Localização

Paio Pires, concelho do Seixal, margem sul do Tejo. Fácil acesso pela A2 e transportes públicos (Fertagus).`,
      city: "Paio Pires",
      metaTitle: "Corrida de Paio Pires 2026 | Seixal | 15 Março",
      metaDescription:
        "Corrida de Paio Pires 2026 - 15 de março em Paio Pires, Seixal. Corrida 10km e Caminhada 5km com LiveRace em tempo real. Inscrições a partir de 8€.",
    },
    en: {
      title: "Paio Pires Race 2026",
      description: `# 🏃 Paio Pires Race 2026

**Run through the streets of Paio Pires on a morning of sport and fun! A race open to all levels, with 10 km and 5 km courses.**

---

## 📅 Date and Schedule

- **Date**: March 15, 2026 (Sunday)
- **Start Time**: 9:30 AM
- **Start/Finish**: Jardim de Paio Pires, Seixal
- **Time Limit**: 2h30

## 🏃 Available Races

### 10 km Race
- **Distance**: 10 km
- **Start Time**: 9:30 AM
- **Elevation**: Flat
- **Max Participants**: 500

### Walk / Fun Run 5 km
- **Distance**: 5 km
- **Start Time**: 9:45 AM
- **Elevation**: Flat
- **Max Participants**: 300

## 🎯 Highlights

✅ **LiveRace** — real-time tracking 📡  
✅ **Flat course** ideal for beginners and personal bests  
✅ **Finisher medal** for all participants  
✅ **Refreshment stations** at km 3 and km 7  
✅ **Live music** at start and finish 🎶  

## 📋 Kit Collection

**Location**: Jardim de Paio Pires

**Schedule**:
- **Saturday, March 14**: 10:00 AM to 6:00 PM
- **Sunday, March 15**: 7:30 AM to 9:00 AM

## 📍 Location

Paio Pires, municipality of Seixal, south bank of the Tagus river. Easy access via A2 motorway and public transport (Fertagus).`,
      city: "Paio Pires",
      metaTitle: "Paio Pires Race 2026 | Seixal | March 15",
      metaDescription:
        "Paio Pires Race 2026 - March 15 in Paio Pires, Seixal. 10km Race and 5km Walk with real-time LiveRace tracking. Registration from €8.",
    },
    es: {
      title: "Carrera de Paio Pires 2026",
      description: `# 🏃 Carrera de Paio Pires 2026

**¡Corre por las calles de Paio Pires en una mañana de deporte y diversión! Una carrera abierta a todos los niveles, con recorridos de 10 km y 5 km.**

---

## 📅 Fecha y Horario

- **Fecha**: 15 de marzo de 2026 (Domingo)
- **Hora de Salida**: 09:30
- **Salida/Llegada**: Jardim de Paio Pires, Seixal
- **Tiempo Límite**: 2h30

## 🏃 Pruebas Disponibles

### Carrera 10 km
- **Distancia**: 10 km
- **Hora de Salida**: 09:30
- **Desnivel**: Llano
- **Participantes máximos**: 500

### Caminata / Fun Run 5 km
- **Distancia**: 5 km
- **Hora de Salida**: 09:45
- **Desnivel**: Llano
- **Participantes máximos**: 300

## 🎯 Destacados

✅ **LiveRace** — seguimiento en tiempo real 📡  
✅ **Recorrido llano** ideal para principiantes y marcas personales  
✅ **Medalla finisher** para todos los participantes  
✅ **Avituallamiento** en los km 3 y km 7  
✅ **Música en vivo** en la salida y meta 🎶  

## 📍 Ubicación

Paio Pires, municipio de Seixal, margen sur del Tajo. Fácil acceso por la A2 y transporte público (Fertagus).`,
      city: "Paio Pires",
      metaTitle: "Carrera de Paio Pires 2026 | Seixal | 15 Marzo",
      metaDescription:
        "Carrera de Paio Pires 2026 - 15 de marzo en Paio Pires, Seixal. Carrera 10km y Caminata 5km con seguimiento LiveRace en tiempo real. Inscripciones desde 8€.",
    },
    fr: {
      title: "Course de Paio Pires 2026",
      description: `# 🏃 Course de Paio Pires 2026

**Courez dans les rues de Paio Pires lors d'une matinée de sport et de convivialité ! Une course ouverte à tous les niveaux, avec des parcours de 10 km et 5 km.**

---

## 📅 Date et Horaire

- **Date** : 15 mars 2026 (Dimanche)
- **Heure de Départ** : 09h30
- **Départ/Arrivée** : Jardim de Paio Pires, Seixal
- **Temps Limite** : 2h30

## 🏃 Épreuves Disponibles

### Course 10 km
- **Distance** : 10 km
- **Heure de Départ** : 09h30
- **Dénivelé** : Plat
- **Participants maximum** : 500

### Marche / Fun Run 5 km
- **Distance** : 5 km
- **Heure de Départ** : 09h45
- **Dénivelé** : Plat
- **Participants maximum** : 300

## 🎯 Points Forts

✅ **LiveRace** — suivi en temps réel 📡  
✅ **Parcours plat** idéal pour les débutants et les records personnels  
✅ **Médaille finisher** pour tous les participants  
✅ **Ravitaillement** aux km 3 et km 7  
✅ **Musique live** au départ et à l'arrivée 🎶  

## 📍 Localisation

Paio Pires, commune de Seixal, rive sud du Tage. Accès facile par l'A2 et les transports en commun (Fertagus).`,
      city: "Paio Pires",
      metaTitle: "Course de Paio Pires 2026 | Seixal | 15 Mars",
      metaDescription:
        "Course de Paio Pires 2026 - 15 mars à Paio Pires, Seixal. Course 10km et Marche 5km avec suivi LiveRace en temps réel. Inscriptions à partir de 8€.",
    },
    de: {
      title: "Lauf von Paio Pires 2026",
      description: `# 🏃 Lauf von Paio Pires 2026

**Laufe durch die Straßen von Paio Pires an einem Morgen voller Sport und Spaß! Ein Lauf für alle Leistungsstufen mit Strecken über 10 km und 5 km.**

---

## 📅 Datum und Zeitplan

- **Datum**: 15. März 2026 (Sonntag)
- **Startzeit**: 09:30 Uhr
- **Start/Ziel**: Jardim de Paio Pires, Seixal
- **Zeitlimit**: 2:30 Std.

## 🏃 Verfügbare Läufe

### 10-km-Lauf
- **Distanz**: 10 km
- **Startzeit**: 09:30 Uhr
- **Höhenprofil**: Flach
- **Max. Teilnehmer**: 500

### Walking / Fun Run 5 km
- **Distanz**: 5 km
- **Startzeit**: 09:45 Uhr
- **Höhenprofil**: Flach
- **Max. Teilnehmer**: 300

## 🎯 Highlights

✅ **LiveRace** — Echtzeit-Tracking 📡  
✅ **Flache Strecke** ideal für Einsteiger und persönliche Bestzeiten  
✅ **Finisher-Medaille** für alle Teilnehmer  
✅ **Verpflegungsstationen** bei km 3 und km 7  
✅ **Live-Musik** am Start und Ziel 🎶  

## 📍 Standort

Paio Pires, Gemeinde Seixal, Südufer des Tejo. Leicht erreichbar über die A2 und öffentliche Verkehrsmittel (Fertagus).`,
      city: "Paio Pires",
      metaTitle: "Lauf von Paio Pires 2026 | Seixal | 15. März",
      metaDescription:
        "Lauf von Paio Pires 2026 - 15. März in Paio Pires, Seixal. 10-km-Lauf und 5-km-Walking mit LiveRace-Echtzeit-Tracking. Anmeldung ab 8€.",
    },
    it: {
      title: "Corsa di Paio Pires 2026",
      description: `# 🏃 Corsa di Paio Pires 2026

**Corri per le strade di Paio Pires in una mattinata di sport e divertimento! Una corsa aperta a tutti i livelli, con percorsi di 10 km e 5 km.**

---

## 📅 Data e Orario

- **Data**: 15 marzo 2026 (Domenica)
- **Ora di Partenza**: 09:30
- **Partenza/Arrivo**: Jardim de Paio Pires, Seixal
- **Tempo Limite**: 2h30

## 🏃 Gare Disponibili

### Corsa 10 km
- **Distanza**: 10 km
- **Ora di Partenza**: 09:30
- **Dislivello**: Pianeggiante
- **Partecipanti massimi**: 500

### Camminata / Fun Run 5 km
- **Distanza**: 5 km
- **Ora di Partenza**: 09:45
- **Dislivello**: Pianeggiante
- **Partecipanti massimi**: 300

## 🎯 Punti di Forza

✅ **LiveRace** — tracciamento in tempo reale 📡  
✅ **Percorso pianeggiante** ideale per principianti e record personali  
✅ **Medaglia finisher** per tutti i partecipanti  
✅ **Ristoro** al km 3 e km 7  
✅ **Musica dal vivo** alla partenza e all'arrivo 🎶  

## 📍 Posizione

Paio Pires, comune di Seixal, sponda sud del Tago. Facile accesso tramite l'A2 e i trasporti pubblici (Fertagus).`,
      city: "Paio Pires",
      metaTitle: "Corsa di Paio Pires 2026 | Seixal | 15 Marzo",
      metaDescription:
        "Corsa di Paio Pires 2026 - 15 marzo a Paio Pires, Seixal. Corsa 10km e Camminata 5km con tracciamento LiveRace in tempo reale. Iscrizioni da 8€.",
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

  const findOrCreatePricingPhase = async (
    variantId: string,
    name: string,
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

  // ── Variant 1: Corrida 10 km ──
  const corrida10k = await findOrCreateVariant({
    name: "Corrida 10 km",
    distanceKm: 10,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-03-15T09:30:00Z"),
    startTime: "09:30",
    cutoffTimeHours: 1.5,
    price: 10,
    currency: Currency.EUR,
    maxParticipants: 500,
    atrpGrade: null,
    itraPoints: null,
    description: "Corrida 10 km · Percurso plano · Ideal para todos os níveis",
  });
  console.log(`✅ Variant: ${corrida10k.name}`);

  await findOrCreatePricingPhase(corrida10k.id, "Corrida 10 km - 1ª Fase", {
    startDate: new Date("2025-12-01T00:00:00Z"),
    endDate: new Date("2026-01-31T23:59:59Z"),
    price: 8,
    currency: Currency.EUR,
    note: "1ª Fase (até 31 de Janeiro)",
  });

  await findOrCreatePricingPhase(corrida10k.id, "Corrida 10 km - 2ª Fase", {
    startDate: new Date("2026-02-01T00:00:00Z"),
    endDate: new Date("2026-03-01T23:59:59Z"),
    price: 10,
    currency: Currency.EUR,
    note: "2ª Fase (até 1 de Março)",
  });

  await findOrCreatePricingPhase(corrida10k.id, "Corrida 10 km - Última Fase", {
    startDate: new Date("2026-03-02T00:00:00Z"),
    endDate: new Date("2026-03-12T23:59:59Z"),
    price: 12,
    currency: Currency.EUR,
    note: "Última fase (até 12 de Março)",
  });
  console.log("   - 3 pricing phases for Corrida 10 km");

  // ── Variant 2: Caminhada / Fun Run 5 km ──
  const funRun5k = await findOrCreateVariant({
    name: "Caminhada / Fun Run 5 km",
    distanceKm: 5,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-03-15T09:45:00Z"),
    startTime: "09:45",
    cutoffTimeHours: 1.5,
    price: 5,
    currency: Currency.EUR,
    maxParticipants: 300,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Caminhada / Fun Run 5 km · Percurso plano · Aberto a toda a família",
  });
  console.log(`✅ Variant: ${funRun5k.name}`);

  await findOrCreatePricingPhase(funRun5k.id, "Caminhada 5 km - Preço Único", {
    startDate: new Date("2025-12-01T00:00:00Z"),
    endDate: new Date("2026-03-12T23:59:59Z"),
    price: 5,
    currency: Currency.EUR,
    note: "Preço único (até 12 de Março)",
  });
  console.log("   - 1 pricing phase for Caminhada 5 km");

  // ──────────────────────────────────────────────
  // Summary
  // ──────────────────────────────────────────────
  console.log(`
✅ Seed completed successfully!

📊 Summary:
- Event: Corrida de Paio Pires 2026
- Slug: corrida-paio-pires-2026
- Variants: 2 (Corrida 10 km + Caminhada 5 km)
- Languages: 6 (pt, en, es, fr, de, it)
- Pricing Phases: 4 total (3 × 10 km + 1 × 5 km)
- Date: March 15, 2026
- Location: Paio Pires, Seixal, Portugal
- Coordinates: 38.6164, -9.0822
- hasLiveRace: true ✅
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
