/**
 * Seed: 3ª Edição Trail dos Moinhos 2026
 *
 * Event: Trail running in Moita dos Ferreiros, Lourinhã, Portugal
 * Location: Moinhos da Pinhôa, Moita dos Ferreiros, Lourinhã
 * Date: April 19, 2026
 * Organizer: Sporting Clube Moitense
 * Sport: Trail, Running
 * Circuits: Trail Jovem Nacional 14km, Trail Sprint ATRP 24km, Trail Curto AAL 24km, ITRA certified
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏔️ Seeding Trail dos Moinhos - Lourinhã 2026...");

  // ──────────────────────────────────────────────
  // 1. Upsert Event (NO nested creates)
  // ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: "trail-dos-moinhos-lourinha-2026" },
    update: {
      title: "3ª Edição Trail dos Moinhos 2026",
      description:
        "3ª Edição Trail dos Moinhos 2026 - Trail em Moita dos Ferreiros, Lourinhã",
      sportTypes: [SportType.TRAIL, SportType.RUNNING],
      startDate: new Date("2026-04-19T07:00:00Z"),
      endDate: new Date("2026-04-19T17:00:00Z"),
      registrationDeadline: new Date("2026-04-05T23:59:00Z"),
      externalUrl: "https://www.trilhoperdido.com/evento/Trail-dos-Moinhos",
      imageUrl: "",
      city: "Moita dos Ferreiros",
      country: "Portugal",
      latitude: 39.2436,
      longitude: -9.2869,
      googleMapsUrl: "https://maps.google.com/?q=39.2436,-9.2869",
      isFeatured: false,
      cancelled: false,
    },
    create: {
      title: "3ª Edição Trail dos Moinhos 2026",
      slug: "trail-dos-moinhos-lourinha-2026",
      description:
        "3ª Edição Trail dos Moinhos 2026 - Trail em Moita dos Ferreiros, Lourinhã",
      sportTypes: [SportType.TRAIL, SportType.RUNNING],
      startDate: new Date("2026-04-19T07:00:00Z"),
      endDate: new Date("2026-04-19T17:00:00Z"),
      registrationDeadline: new Date("2026-04-05T23:59:00Z"),
      externalUrl: "https://www.trilhoperdido.com/evento/Trail-dos-Moinhos",
      imageUrl: "",
      city: "Moita dos Ferreiros",
      country: "Portugal",
      latitude: 39.2436,
      longitude: -9.2869,
      googleMapsUrl: "https://maps.google.com/?q=39.2436,-9.2869",
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
      title: "3ª Edição Trail dos Moinhos 2026",
      description: `# 🏔️ 3ª Edição Trail dos Moinhos 2026

**A 3ª Edição do Trail dos Moinhos realiza-se a 19 de abril de 2026 nos Moinhos da Pinhôa, Moita dos Ferreiros, Lourinhã!** Organizado pelo **Sporting Clube Moitense** em parceria com a **Junta de Freguesia de Moita dos Ferreiros** e com apoio da **Câmara Municipal da Lourinhã**, o evento celebra o Dia Nacional dos Moinhos, percorrendo trilhos outrora feitos pelos moleiros.

Integra o **Circuito Nacional de Trail Jovem 14km**, **Trail Sprint ATRP 24km**, **Circuito de Trail Curto da Associação de Atletismo de Lisboa 24km** e é certificado pela **ITRA** (International Trail Running Association).

---

## 🏃 Provas

- **Trail Sprint** – 24 km · Partida 09:00
- **Trail Jovem** – 14 km · Partida 09:30
- **Caminhada** – 11 km · Partida 09:40 · Não competitiva
- **Trail Kids** – Partida 08:30 · Gratuito

---

## ⏰ Horário

- 07:00 – Abertura do Secretariado
- 08:30 – Início do Kids Trail
- 08:50 – Briefing Trail Sprint
- 09:00 – Início do Trail Sprint (24 km)
- 09:20 – Briefing Trail Jovem
- 09:30 – Início do Trail Jovem (14 km)
- 09:35 – Briefing Caminhada
- 09:40 – Início da Caminhada (11 km)
- 11:30 – Entrega de Prémios Trail Jovem
- 12:00 – Entrega de Prémios Trail Sprint

---

## 🎽 A inscrição inclui

- Seguro desportivo
- Medalha de participação
- Abastecimentos ao longo do percurso
- Brindes (dependente dos parceiros)

---

## 📦 Extras opcionais

- T-shirt técnica 42K Running – 3,50 €
- Gola 42K Running – 2 €
- Meias SocksBy – 2 €

---

## 🏅 Circuitos

- Trail Sprint 24km: Circuito Nacional de Trail Sprint ATRP + Circuito de Trail Curto AAL
- Trail Jovem 14km: Circuito Nacional de Trail Jovem
- Certificação ITRA

---

🏔️ **Vem trilhar pelos caminhos dos moleiros!** 🌾`,
      city: "Moita dos Ferreiros",
      metaTitle: "3º Trail dos Moinhos 2026 | Lourinhã | 19 Abril",
      metaDescription:
        "3ª Edição Trail dos Moinhos a 19 de abril de 2026 em Moita dos Ferreiros, Lourinhã. Trail Sprint 24km, Trail Jovem 14km, Caminhada 11km e Trail Kids. Circuitos ATRP, AAL e ITRA.",
    },
    en: {
      title: "3rd Edition Trail dos Moinhos 2026",
      description: `# 🏔️ 3rd Edition Trail dos Moinhos 2026

**The 3rd Edition of Trail dos Moinhos takes place on April 19, 2026 at Moinhos da Pinhôa, Moita dos Ferreiros, Lourinhã!** Organized by **Sporting Clube Moitense** in partnership with the **Parish Council of Moita dos Ferreiros** and supported by **Lourinhã Municipality**, the event celebrates National Windmill Day, running along trails once used by millers.

Part of the **National Youth Trail Circuit 14km**, **ATRP Sprint Trail 24km**, **Lisbon Athletics Association Short Trail Circuit 24km** and certified by **ITRA** (International Trail Running Association).

---

## 🏃 Races

- **Trail Sprint** – 24 km · Start 09:00
- **Youth Trail** – 14 km · Start 09:30
- **Walk** – 11 km · Start 09:40 · Non-competitive
- **Trail Kids** – Start 08:30 · Free

---

## ⏰ Schedule

- 07:00 – Registration desk opens
- 08:30 – Kids Trail start
- 08:50 – Trail Sprint briefing
- 09:00 – Trail Sprint start (24 km)
- 09:20 – Youth Trail briefing
- 09:30 – Youth Trail start (14 km)
- 09:35 – Walk briefing
- 09:40 – Walk start (11 km)
- 11:30 – Youth Trail prize ceremony
- 12:00 – Trail Sprint prize ceremony

---

## 🎽 Registration includes

- Sports insurance
- Participation medal
- Aid stations along the course
- Sponsor gifts (subject to availability)

---

## 📦 Optional extras

- 42K Running technical T-shirt – €3.50
- 42K Running neck gaiter – €2
- SocksBy socks – €2

---

## 🏅 Circuits

- Trail Sprint 24km: ATRP National Sprint Trail Circuit + AAL Short Trail Circuit
- Youth Trail 14km: National Youth Trail Circuit
- ITRA Certification

---

🏔️ **Come trail along the millers' paths!** 🌾`,
      city: "Moita dos Ferreiros",
      metaTitle: "3rd Trail dos Moinhos 2026 | Lourinhã | April 19",
      metaDescription:
        "3rd Edition Trail dos Moinhos on April 19, 2026 in Moita dos Ferreiros, Lourinhã. Trail Sprint 24km, Youth Trail 14km, Walk 11km and Trail Kids. ATRP, AAL and ITRA circuits.",
    },
    es: {
      title: "3ª Edición Trail dos Moinhos 2026",
      description: `# 🏔️ 3ª Edición Trail dos Moinhos 2026

**La 3ª Edición del Trail dos Moinhos se celebra el 19 de abril de 2026 en Moinhos da Pinhôa, Moita dos Ferreiros, Lourinhã.** Organizado por el **Sporting Clube Moitense** en colaboración con la **Junta de Freguesia de Moita dos Ferreiros** y con el apoyo del **Ayuntamiento de Lourinhã**, el evento celebra el Día Nacional de los Molinos, recorriendo senderos antiguamente usados por los molineros.

Integra el **Circuito Nacional de Trail Joven 14km**, **Trail Sprint ATRP 24km**, **Circuito de Trail Corto de la Asociación de Atletismo de Lisboa 24km** y está certificado por la **ITRA** (International Trail Running Association).

---

## 🏃 Pruebas

- **Trail Sprint** – 24 km · Salida 09:00
- **Trail Joven** – 14 km · Salida 09:30
- **Caminata** – 11 km · Salida 09:40 · No competitiva
- **Trail Kids** – Salida 08:30 · Gratis

---

## ⏰ Horario

- 07:00 – Apertura de secretaría
- 08:30 – Inicio del Kids Trail
- 08:50 – Briefing Trail Sprint
- 09:00 – Inicio del Trail Sprint (24 km)
- 09:20 – Briefing Trail Joven
- 09:30 – Inicio del Trail Joven (14 km)
- 09:35 – Briefing Caminata
- 09:40 – Inicio de la Caminata (11 km)
- 11:30 – Entrega de premios Trail Joven
- 12:00 – Entrega de premios Trail Sprint

---

## 🎽 La inscripción incluye

- Seguro deportivo
- Medalla de participación
- Avituallamientos a lo largo del recorrido
- Obsequios (sujeto a disponibilidad)

---

## 📦 Extras opcionales

- Camiseta técnica 42K Running – 3,50 €
- Braga 42K Running – 2 €
- Calcetines SocksBy – 2 €

---

## 🏅 Circuitos

- Trail Sprint 24km: Circuito Nacional de Trail Sprint ATRP + Circuito de Trail Corto AAL
- Trail Joven 14km: Circuito Nacional de Trail Joven
- Certificación ITRA

---

🏔️ **¡Ven a correr por los caminos de los molineros!** 🌾`,
      city: "Moita dos Ferreiros",
      metaTitle: "3º Trail dos Moinhos 2026 | Lourinhã | 19 Abril",
      metaDescription:
        "3ª Edición Trail dos Moinhos el 19 de abril de 2026 en Moita dos Ferreiros, Lourinhã. Trail Sprint 24km, Trail Joven 14km, Caminata 11km y Trail Kids. Circuitos ATRP, AAL e ITRA.",
    },
    fr: {
      title: "3ème Édition Trail dos Moinhos 2026",
      description: `# 🏔️ 3ème Édition Trail dos Moinhos 2026

**La 3ème Édition du Trail dos Moinhos a lieu le 19 avril 2026 aux Moinhos da Pinhôa, Moita dos Ferreiros, Lourinhã !** Organisé par le **Sporting Clube Moitense** en partenariat avec la **Junta de Freguesia de Moita dos Ferreiros** et avec le soutien de la **Mairie de Lourinhã**, l'événement célèbre la Journée Nationale des Moulins, parcourant des sentiers autrefois empruntés par les meuniers.

Intègre le **Circuit National de Trail Jeune 14km**, **Trail Sprint ATRP 24km**, **Circuit de Trail Court de l'Association d'Athlétisme de Lisbonne 24km** et est certifié par l'**ITRA** (International Trail Running Association).

---

## 🏃 Épreuves

- **Trail Sprint** – 24 km · Départ 09h00
- **Trail Jeune** – 14 km · Départ 09h30
- **Randonnée** – 11 km · Départ 09h40 · Non compétitive
- **Trail Kids** – Départ 08h30 · Gratuit

---

## ⏰ Programme

- 07h00 – Ouverture du secrétariat
- 08h30 – Départ du Kids Trail
- 08h50 – Briefing Trail Sprint
- 09h00 – Départ du Trail Sprint (24 km)
- 09h20 – Briefing Trail Jeune
- 09h30 – Départ du Trail Jeune (14 km)
- 09h35 – Briefing Randonnée
- 09h40 – Départ de la Randonnée (11 km)
- 11h30 – Remise des prix Trail Jeune
- 12h00 – Remise des prix Trail Sprint

---

## 🎽 L'inscription comprend

- Assurance sportive
- Médaille de participation
- Ravitaillements le long du parcours
- Cadeaux sponsors (sous réserve)

---

## 📦 Extras optionnels

- T-shirt technique 42K Running – 3,50 €
- Tour de cou 42K Running – 2 €
- Chaussettes SocksBy – 2 €

---

## 🏅 Circuits

- Trail Sprint 24km : Circuit National de Trail Sprint ATRP + Circuit de Trail Court AAL
- Trail Jeune 14km : Circuit National de Trail Jeune
- Certification ITRA

---

🏔️ **Venez courir sur les sentiers des meuniers !** 🌾`,
      city: "Moita dos Ferreiros",
      metaTitle: "3ème Trail dos Moinhos 2026 | Lourinhã | 19 Avril",
      metaDescription:
        "3ème Édition Trail dos Moinhos le 19 avril 2026 à Moita dos Ferreiros, Lourinhã. Trail Sprint 24km, Trail Jeune 14km, Randonnée 11km et Trail Kids. Circuits ATRP, AAL et ITRA.",
    },
    de: {
      title: "3. Ausgabe Trail dos Moinhos 2026",
      description: `# 🏔️ 3. Ausgabe Trail dos Moinhos 2026

**Die 3. Ausgabe des Trail dos Moinhos findet am 19. April 2026 an den Moinhos da Pinhôa, Moita dos Ferreiros, Lourinhã statt!** Organisiert vom **Sporting Clube Moitense** in Partnerschaft mit der **Gemeindeverwaltung Moita dos Ferreiros** und mit Unterstützung der **Stadtverwaltung Lourinhã** feiert die Veranstaltung den Nationalen Mühlentag und führt über Wege, die einst von Müllern genutzt wurden.

Teil des **Nationalen Jugend-Trail-Zirkuits 14km**, **ATRP Sprint-Trail 24km**, **Lissaboner Leichtathletikverband Kurz-Trail-Zirkuit 24km** und zertifiziert von der **ITRA** (International Trail Running Association).

---

## 🏃 Rennen

- **Trail Sprint** – 24 km · Start 09:00
- **Jugend Trail** – 14 km · Start 09:30
- **Wanderung** – 11 km · Start 09:40 · Nicht kompetitiv
- **Trail Kids** – Start 08:30 · Kostenlos

---

## ⏰ Zeitplan

- 07:00 – Eröffnung des Sekretariats
- 08:30 – Start des Kids Trail
- 08:50 – Briefing Trail Sprint
- 09:00 – Start des Trail Sprint (24 km)
- 09:20 – Briefing Jugend Trail
- 09:30 – Start des Jugend Trail (14 km)
- 09:35 – Briefing Wanderung
- 09:40 – Start der Wanderung (11 km)
- 11:30 – Preisverleihung Jugend Trail
- 12:00 – Preisverleihung Trail Sprint

---

## 🎽 Die Anmeldung beinhaltet

- Sportversicherung
- Teilnahmemedaille
- Verpflegungsstationen entlang der Strecke
- Sponsorengeschenke (je nach Verfügbarkeit)

---

## 📦 Optionale Extras

- 42K Running Funktionsshirt – 3,50 €
- 42K Running Schlauchtuch – 2 €
- SocksBy Socken – 2 €

---

## 🏅 Serien

- Trail Sprint 24km: ATRP Nationale Sprint-Trail-Serie + AAL Kurz-Trail-Serie
- Jugend Trail 14km: Nationale Jugend-Trail-Serie
- ITRA-Zertifizierung

---

🏔️ **Komm und laufe auf den Wegen der Müller!** 🌾`,
      city: "Moita dos Ferreiros",
      metaTitle: "3. Trail dos Moinhos 2026 | Lourinhã | 19. April",
      metaDescription:
        "3. Ausgabe Trail dos Moinhos am 19. April 2026 in Moita dos Ferreiros, Lourinhã. Trail Sprint 24km, Jugend Trail 14km, Wanderung 11km und Trail Kids. ATRP-, AAL- und ITRA-Serien.",
    },
    it: {
      title: "3ª Edizione Trail dos Moinhos 2026",
      description: `# 🏔️ 3ª Edizione Trail dos Moinhos 2026

**La 3ª Edizione del Trail dos Moinhos si svolge il 19 aprile 2026 ai Moinhos da Pinhôa, Moita dos Ferreiros, Lourinhã!** Organizzato dallo **Sporting Clube Moitense** in collaborazione con la **Giunta della Parrocchia di Moita dos Ferreiros** e con il supporto del **Comune di Lourinhã**, l'evento celebra la Giornata Nazionale dei Mulini, percorrendo sentieri un tempo utilizzati dai mugnai.

Fa parte del **Circuito Nazionale di Trail Giovani 14km**, **Trail Sprint ATRP 24km**, **Circuito di Trail Corto dell'Associazione di Atletica di Lisbona 24km** ed è certificato dall'**ITRA** (International Trail Running Association).

---

## 🏃 Gare

- **Trail Sprint** – 24 km · Partenza 09:00
- **Trail Giovani** – 14 km · Partenza 09:30
- **Camminata** – 11 km · Partenza 09:40 · Non competitiva
- **Trail Kids** – Partenza 08:30 · Gratuito

---

## ⏰ Programma

- 07:00 – Apertura segreteria
- 08:30 – Partenza Kids Trail
- 08:50 – Briefing Trail Sprint
- 09:00 – Partenza Trail Sprint (24 km)
- 09:20 – Briefing Trail Giovani
- 09:30 – Partenza Trail Giovani (14 km)
- 09:35 – Briefing Camminata
- 09:40 – Partenza Camminata (11 km)
- 11:30 – Premiazione Trail Giovani
- 12:00 – Premiazione Trail Sprint

---

## 🎽 L'iscrizione include

- Assicurazione sportiva
- Medaglia di partecipazione
- Rifornimenti lungo il percorso
- Omaggi sponsor (soggetto a disponibilità)

---

## 📦 Extra opzionali

- T-shirt tecnica 42K Running – 3,50 €
- Scaldacollo 42K Running – 2 €
- Calze SocksBy – 2 €

---

## 🏅 Circuiti

- Trail Sprint 24km: Circuito Nazionale di Trail Sprint ATRP + Circuito di Trail Corto AAL
- Trail Giovani 14km: Circuito Nazionale di Trail Giovani
- Certificazione ITRA

---

🏔️ **Vieni a correre sui sentieri dei mugnai!** 🌾`,
      city: "Moita dos Ferreiros",
      metaTitle: "3ª Trail dos Moinhos 2026 | Lourinhã | 19 Aprile",
      metaDescription:
        "3ª Edizione Trail dos Moinhos il 19 aprile 2026 a Moita dos Ferreiros, Lourinhã. Trail Sprint 24km, Trail Giovani 14km, Camminata 11km e Trail Kids. Circuiti ATRP, AAL e ITRA.",
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

  // ── Variant 1: Trail Sprint (24 km) ──
  const trailSprint = await findOrCreateVariant({
    name: "Trail Sprint",
    distanceKm: 24,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-19T09:00:00Z"),
    startTime: "09:00",
    cutoffTimeHours: null,
    price: 15.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Trail Sprint · 24 km · Circuito ATRP Sprint + AAL Curto",
  });
  console.log(`✅ Variant: ${trailSprint.name}`);

  // ── Variant 2: Trail Jovem (14 km) ──
  const trailJovem = await findOrCreateVariant({
    name: "Trail Jovem",
    distanceKm: 14,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-19T09:30:00Z"),
    startTime: "09:30",
    cutoffTimeHours: null,
    price: 10.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Trail Jovem · 14 km · Circuito Nacional de Trail Jovem",
  });
  console.log(`✅ Variant: ${trailJovem.name}`);

  // ── Variant 3: Caminhada (11 km) ──
  const caminhada = await findOrCreateVariant({
    name: "Caminhada",
    distanceKm: 11,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-19T09:40:00Z"),
    startTime: "09:40",
    cutoffTimeHours: null,
    price: 6.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Caminhada · 11 km · Não competitiva",
  });
  console.log(`✅ Variant: ${caminhada.name}`);

  // ── Variant 4: Trail Kids ──
  const trailKids = await findOrCreateVariant({
    name: "Trail Kids",
    distanceKm: 0,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-19T08:30:00Z"),
    startTime: "08:30",
    cutoffTimeHours: null,
    price: 0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Trail Kids · Gratuito",
  });
  console.log(`✅ Variant: ${trailKids.name}`);

  // ── Variant Translations (ALL 6 languages) ──
  const variantTranslations: Record<
    string,
    Record<string, { name: string; description: string | null }>
  > = {
    trailSprint: {
      pt: {
        name: "Trail Sprint",
        description: "Trail Sprint · 24 km · Circuito ATRP Sprint + AAL Curto",
      },
      en: {
        name: "Trail Sprint",
        description: "Trail Sprint · 24 km · ATRP Sprint + AAL Short Circuit",
      },
      es: {
        name: "Trail Sprint",
        description: "Trail Sprint · 24 km · Circuito ATRP Sprint + AAL Corto",
      },
      fr: {
        name: "Trail Sprint",
        description: "Trail Sprint · 24 km · Circuit ATRP Sprint + AAL Court",
      },
      de: {
        name: "Trail Sprint",
        description: "Trail Sprint · 24 km · ATRP Sprint + AAL Kurz-Serie",
      },
      it: {
        name: "Trail Sprint",
        description: "Trail Sprint · 24 km · Circuito ATRP Sprint + AAL Corto",
      },
    },
    trailJovem: {
      pt: {
        name: "Trail Jovem",
        description: "Trail Jovem · 14 km · Circuito Nacional de Trail Jovem",
      },
      en: {
        name: "Youth Trail",
        description: "Youth Trail · 14 km · National Youth Trail Circuit",
      },
      es: {
        name: "Trail Joven",
        description: "Trail Joven · 14 km · Circuito Nacional de Trail Joven",
      },
      fr: {
        name: "Trail Jeune",
        description: "Trail Jeune · 14 km · Circuit National de Trail Jeune",
      },
      de: {
        name: "Jugend Trail",
        description: "Jugend Trail · 14 km · Nationale Jugend-Trail-Serie",
      },
      it: {
        name: "Trail Giovani",
        description:
          "Trail Giovani · 14 km · Circuito Nazionale di Trail Giovani",
      },
    },
    caminhada: {
      pt: {
        name: "Caminhada",
        description: "Caminhada · 11 km · Não competitiva",
      },
      en: { name: "Walk", description: "Walk · 11 km · Non-competitive" },
      es: {
        name: "Caminata",
        description: "Caminata · 11 km · No competitiva",
      },
      fr: {
        name: "Randonnée",
        description: "Randonnée · 11 km · Non compétitive",
      },
      de: {
        name: "Wanderung",
        description: "Wanderung · 11 km · Nicht kompetitiv",
      },
      it: {
        name: "Camminata",
        description: "Camminata · 11 km · Non competitiva",
      },
    },
    trailKids: {
      pt: { name: "Trail Kids", description: "Trail Kids · Gratuito" },
      en: { name: "Trail Kids", description: "Trail Kids · Free" },
      es: { name: "Trail Kids", description: "Trail Kids · Gratis" },
      fr: { name: "Trail Kids", description: "Trail Kids · Gratuit" },
      de: { name: "Trail Kids", description: "Trail Kids · Kostenlos" },
      it: { name: "Trail Kids", description: "Trail Kids · Gratuito" },
    },
  };

  const variantMap = [
    { variant: trailSprint, key: "trailSprint" },
    { variant: trailJovem, key: "trailJovem" },
    { variant: caminhada, key: "caminhada" },
    { variant: trailKids, key: "trailKids" },
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

  // Phase Promocional: Jan 10, 2026 (24h only)
  await findOrCreatePricingPhase(
    "Trail Sprint - Fase Promocional",
    trailSprint.id,
    {
      startDate: new Date("2026-01-10T00:00:00Z"),
      endDate: new Date("2026-01-10T23:59:59Z"),
      price: 8.0,
      currency: Currency.EUR,
      note: "Fase promocional 24h",
    }
  );
  await findOrCreatePricingPhase(
    "Trail Jovem - Fase Promocional",
    trailJovem.id,
    {
      startDate: new Date("2026-01-10T00:00:00Z"),
      endDate: new Date("2026-01-10T23:59:59Z"),
      price: 6.0,
      currency: Currency.EUR,
      note: "Fase promocional 24h",
    }
  );
  await findOrCreatePricingPhase("Caminhada - Fase Promocional", caminhada.id, {
    startDate: new Date("2026-01-10T00:00:00Z"),
    endDate: new Date("2026-01-10T23:59:59Z"),
    price: 5.0,
    currency: Currency.EUR,
    note: "Fase promocional 24h",
  });
  await findOrCreatePricingPhase(
    "Trail Kids - Fase Promocional",
    trailKids.id,
    {
      startDate: new Date("2026-01-10T00:00:00Z"),
      endDate: new Date("2026-01-10T23:59:59Z"),
      price: 0,
      currency: Currency.EUR,
      note: "Gratuito",
    }
  );
  console.log("✅ Pricing Phase: Promocional created for all variants");

  // Phase 1: Jan 11, 2026 → Feb 23, 2026
  await findOrCreatePricingPhase("Trail Sprint - 1ª Fase", trailSprint.id, {
    startDate: new Date("2026-01-11T00:00:00Z"),
    endDate: new Date("2026-02-23T23:59:59Z"),
    price: 12.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Trail Jovem - 1ª Fase", trailJovem.id, {
    startDate: new Date("2026-01-11T00:00:00Z"),
    endDate: new Date("2026-02-23T23:59:59Z"),
    price: 8.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Caminhada - 1ª Fase", caminhada.id, {
    startDate: new Date("2026-01-11T00:00:00Z"),
    endDate: new Date("2026-02-23T23:59:59Z"),
    price: 6.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Trail Kids - 1ª Fase", trailKids.id, {
    startDate: new Date("2026-01-11T00:00:00Z"),
    endDate: new Date("2026-02-23T23:59:59Z"),
    price: 0,
    currency: Currency.EUR,
    note: "Gratuito",
  });
  console.log("✅ Pricing Phase 1 created for all variants");

  // Phase 2: Feb 24, 2026 → Mar 15, 2026
  await findOrCreatePricingPhase("Trail Sprint - 2ª Fase", trailSprint.id, {
    startDate: new Date("2026-02-24T00:00:00Z"),
    endDate: new Date("2026-03-15T23:59:59Z"),
    price: 14.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Trail Jovem - 2ª Fase", trailJovem.id, {
    startDate: new Date("2026-02-24T00:00:00Z"),
    endDate: new Date("2026-03-15T23:59:59Z"),
    price: 9.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Caminhada - 2ª Fase", caminhada.id, {
    startDate: new Date("2026-02-24T00:00:00Z"),
    endDate: new Date("2026-03-15T23:59:59Z"),
    price: 6.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Trail Kids - 2ª Fase", trailKids.id, {
    startDate: new Date("2026-02-24T00:00:00Z"),
    endDate: new Date("2026-03-15T23:59:59Z"),
    price: 0,
    currency: Currency.EUR,
    note: "Gratuito",
  });
  console.log("✅ Pricing Phase 2 created for all variants");

  // Phase 3: Mar 16, 2026 → Apr 5, 2026
  await findOrCreatePricingPhase("Trail Sprint - 3ª Fase", trailSprint.id, {
    startDate: new Date("2026-03-16T00:00:00Z"),
    endDate: new Date("2026-04-05T23:59:59Z"),
    price: 15.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Trail Jovem - 3ª Fase", trailJovem.id, {
    startDate: new Date("2026-03-16T00:00:00Z"),
    endDate: new Date("2026-04-05T23:59:59Z"),
    price: 10.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Caminhada - 3ª Fase", caminhada.id, {
    startDate: new Date("2026-03-16T00:00:00Z"),
    endDate: new Date("2026-04-05T23:59:59Z"),
    price: 6.0,
    currency: Currency.EUR,
    note: null,
  });
  await findOrCreatePricingPhase("Trail Kids - 3ª Fase", trailKids.id, {
    startDate: new Date("2026-03-16T00:00:00Z"),
    endDate: new Date("2026-04-05T23:59:59Z"),
    price: 0,
    currency: Currency.EUR,
    note: "Gratuito",
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
    "07:00 – Abertura do Secretariado. 08:30 – Início do Kids Trail. 08:50 – Briefing Trail Sprint. 09:00 – Início do Trail Sprint (24 km). 09:20 – Briefing Trail Jovem. 09:30 – Início Trail Jovem (14 km). 09:35 – Briefing Caminhada. 09:40 – Início da Caminhada (11 km). 11:30 – Entrega de Prémios Trail Jovem. 12:00 – Entrega de Prémios Trail Sprint."
  );

  const faq0Translations = {
    pt: {
      question: "Qual é o horário do evento?",
      answer:
        "07:00 – Abertura do Secretariado. 08:30 – Início do Kids Trail. 08:50 – Briefing Trail Sprint. 09:00 – Início do Trail Sprint (24 km). 09:20 – Briefing Trail Jovem. 09:30 – Início Trail Jovem (14 km). 09:35 – Briefing Caminhada. 09:40 – Início da Caminhada (11 km). 11:30 – Entrega de Prémios Trail Jovem. 12:00 – Entrega de Prémios Trail Sprint.",
    },
    en: {
      question: "What is the event schedule?",
      answer:
        "07:00 – Registration desk opens. 08:30 – Kids Trail start. 08:50 – Trail Sprint briefing. 09:00 – Trail Sprint start (24 km). 09:20 – Youth Trail briefing. 09:30 – Youth Trail start (14 km). 09:35 – Walk briefing. 09:40 – Walk start (11 km). 11:30 – Youth Trail prize ceremony. 12:00 – Trail Sprint prize ceremony.",
    },
    es: {
      question: "¿Cuál es el horario del evento?",
      answer:
        "07:00 – Apertura de secretaría. 08:30 – Inicio del Kids Trail. 08:50 – Briefing Trail Sprint. 09:00 – Inicio del Trail Sprint (24 km). 09:20 – Briefing Trail Joven. 09:30 – Inicio Trail Joven (14 km). 09:35 – Briefing Caminata. 09:40 – Inicio de la Caminata (11 km). 11:30 – Entrega de premios Trail Joven. 12:00 – Entrega de premios Trail Sprint.",
    },
    fr: {
      question: "Quel est le programme de l'événement ?",
      answer:
        "07h00 – Ouverture du secrétariat. 08h30 – Départ du Kids Trail. 08h50 – Briefing Trail Sprint. 09h00 – Départ du Trail Sprint (24 km). 09h20 – Briefing Trail Jeune. 09h30 – Départ Trail Jeune (14 km). 09h35 – Briefing Randonnée. 09h40 – Départ de la Randonnée (11 km). 11h30 – Remise des prix Trail Jeune. 12h00 – Remise des prix Trail Sprint.",
    },
    de: {
      question: "Wie ist der Zeitplan der Veranstaltung?",
      answer:
        "07:00 – Eröffnung des Sekretariats. 08:30 – Start des Kids Trail. 08:50 – Briefing Trail Sprint. 09:00 – Start des Trail Sprint (24 km). 09:20 – Briefing Jugend Trail. 09:30 – Start Jugend Trail (14 km). 09:35 – Briefing Wanderung. 09:40 – Start der Wanderung (11 km). 11:30 – Preisverleihung Jugend Trail. 12:00 – Preisverleihung Trail Sprint.",
    },
    it: {
      question: "Qual è il programma dell'evento?",
      answer:
        "07:00 – Apertura segreteria. 08:30 – Partenza Kids Trail. 08:50 – Briefing Trail Sprint. 09:00 – Partenza Trail Sprint (24 km). 09:20 – Briefing Trail Giovani. 09:30 – Partenza Trail Giovani (14 km). 09:35 – Briefing Camminata. 09:40 – Partenza Camminata (11 km). 11:30 – Premiazione Trail Giovani. 12:00 – Premiazione Trail Sprint.",
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
    "Seguro desportivo, medalha de participação, abastecimentos ao longo do percurso e brindes (dependente do que a organização conseguir angariar). Trail Sprint: 4 abastecimentos (1 só líquidos e 3 sólidos e líquidos). Trail Jovem e Caminhada: 3 abastecimentos (1 só líquidos e 2 sólidos e líquidos)."
  );

  const faq1Translations = {
    pt: {
      question: "O que está incluído na inscrição?",
      answer:
        "Seguro desportivo, medalha de participação, abastecimentos ao longo do percurso e brindes (dependente do que a organização conseguir angariar). Trail Sprint: 4 abastecimentos (1 só líquidos e 3 sólidos e líquidos). Trail Jovem e Caminhada: 3 abastecimentos (1 só líquidos e 2 sólidos e líquidos).",
    },
    en: {
      question: "What is included in the registration?",
      answer:
        "Sports insurance, participation medal, aid stations along the course and sponsor gifts (subject to availability). Trail Sprint: 4 aid stations (1 liquids only, 3 with food and liquids). Youth Trail and Walk: 3 aid stations (1 liquids only, 2 with food and liquids).",
    },
    es: {
      question: "¿Qué incluye la inscripción?",
      answer:
        "Seguro deportivo, medalla de participación, avituallamientos a lo largo del recorrido y obsequios (sujeto a disponibilidad). Trail Sprint: 4 avituallamientos (1 solo líquidos, 3 con sólidos y líquidos). Trail Joven y Caminata: 3 avituallamientos (1 solo líquidos, 2 con sólidos y líquidos).",
    },
    fr: {
      question: "Que comprend l'inscription ?",
      answer:
        "Assurance sportive, médaille de participation, ravitaillements le long du parcours et cadeaux sponsors (sous réserve). Trail Sprint : 4 ravitaillements (1 liquides uniquement, 3 solides et liquides). Trail Jeune et Randonnée : 3 ravitaillements (1 liquides uniquement, 2 solides et liquides).",
    },
    de: {
      question: "Was ist in der Anmeldung enthalten?",
      answer:
        "Sportversicherung, Teilnahmemedaille, Verpflegungsstationen entlang der Strecke und Sponsorengeschenke (je nach Verfügbarkeit). Trail Sprint: 4 Verpflegungsstationen (1 nur Getränke, 3 mit Essen und Getränken). Jugend Trail und Wanderung: 3 Verpflegungsstationen (1 nur Getränke, 2 mit Essen und Getränken).",
    },
    it: {
      question: "Cosa è incluso nell'iscrizione?",
      answer:
        "Assicurazione sportiva, medaglia di partecipazione, rifornimenti lungo il percorso e omaggi sponsor (soggetto a disponibilità). Trail Sprint: 4 rifornimenti (1 solo liquidi, 3 solidi e liquidi). Trail Giovani e Camminata: 3 rifornimenti (1 solo liquidi, 2 solidi e liquidi).",
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

  // ── FAQ 2: Mandatory equipment ──
  const faq2 = await findOrCreateFAQ(
    event.id,
    2,
    "Qual é o material obrigatório?",
    "Trail Sprint 24km: recipiente de líquidos (mín. 0,5L), copo, apito, telemóvel, manta térmica e impermeável. Trail Jovem 14km: copo, apito, telemóvel, manta térmica e impermeável (consoante condições). Caminhada: copo, apito, manta térmica e impermeável (consoante condições)."
  );

  const faq2Translations = {
    pt: {
      question: "Qual é o material obrigatório?",
      answer:
        "Trail Sprint 24km: recipiente de líquidos (mín. 0,5L), copo, apito, telemóvel, manta térmica e impermeável. Trail Jovem 14km: copo, apito, telemóvel, manta térmica e impermeável (consoante condições). Caminhada: copo, apito, manta térmica e impermeável (consoante condições).",
    },
    en: {
      question: "What mandatory equipment is required?",
      answer:
        "Trail Sprint 24km: liquid container (min. 0.5L), cup, whistle, mobile phone, thermal blanket and waterproof jacket. Youth Trail 14km: cup, whistle, mobile phone, thermal blanket and waterproof jacket (weather dependent). Walk: cup, whistle, thermal blanket and waterproof jacket (weather dependent).",
    },
    es: {
      question: "¿Cuál es el equipamiento obligatorio?",
      answer:
        "Trail Sprint 24km: recipiente de líquidos (mín. 0,5L), vaso, silbato, teléfono móvil, manta térmica e impermeable. Trail Joven 14km: vaso, silbato, teléfono móvil, manta térmica e impermeable (según condiciones). Caminata: vaso, silbato, manta térmica e impermeable (según condiciones).",
    },
    fr: {
      question: "Quel est l'équipement obligatoire ?",
      answer:
        "Trail Sprint 24km : récipient à liquides (min. 0,5L), gobelet, sifflet, téléphone portable, couverture de survie et imperméable. Trail Jeune 14km : gobelet, sifflet, téléphone portable, couverture de survie et imperméable (selon conditions). Randonnée : gobelet, sifflet, couverture de survie et imperméable (selon conditions).",
    },
    de: {
      question: "Welche Pflichtausrüstung wird benötigt?",
      answer:
        "Trail Sprint 24km: Flüssigkeitsbehälter (min. 0,5L), Becher, Pfeife, Mobiltelefon, Rettungsdecke und Regenjacke. Jugend Trail 14km: Becher, Pfeife, Mobiltelefon, Rettungsdecke und Regenjacke (wetterabhängig). Wanderung: Becher, Pfeife, Rettungsdecke und Regenjacke (wetterabhängig).",
    },
    it: {
      question: "Qual è l'equipaggiamento obbligatorio?",
      answer:
        "Trail Sprint 24km: contenitore per liquidi (min. 0,5L), bicchiere, fischietto, telefono cellulare, coperta termica e impermeabile. Trail Giovani 14km: bicchiere, fischietto, telefono cellulare, coperta termica e impermeabile (secondo le condizioni). Camminata: bicchiere, fischietto, coperta termica e impermeabile (secondo le condizioni).",
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
  console.log("✅ FAQ 2: Mandatory equipment");

  // ── FAQ 3: Prizes ──
  const faq3 = await findOrCreateFAQ(
    event.id,
    3,
    "Quais são os prémios?",
    "Trail Jovem e Trail Sprint: troféus para os 3 primeiros classificados gerais M/F, por escalão etário (Sub 23, Seniores, Veteranos 35/40/45/50/55/60+). Prémio por equipas: equipa com mais participantes e 3 melhores equipas. Trail Kids: prémios por categorias (Benjamins A/B, Infantis, Iniciados M/F). Medalha de participação para todos."
  );

  const faq3Translations = {
    pt: {
      question: "Quais são os prémios?",
      answer:
        "Trail Jovem e Trail Sprint: troféus para os 3 primeiros classificados gerais M/F, por escalão etário (Sub 23, Seniores, Veteranos 35/40/45/50/55/60+). Prémio por equipas: equipa com mais participantes e 3 melhores equipas. Trail Kids: prémios por categorias (Benjamins A/B, Infantis, Iniciados M/F). Medalha de participação para todos.",
    },
    en: {
      question: "What are the prizes?",
      answer:
        "Youth Trail and Trail Sprint: trophies for top 3 overall M/F, by age category (U23, Seniors, Veterans 35/40/45/50/55/60+). Team prizes: team with most participants and top 3 teams. Trail Kids: prizes by category (Benjamins A/B, Infantiles, Initiates M/F). Participation medal for all.",
    },
    es: {
      question: "¿Cuáles son los premios?",
      answer:
        "Trail Joven y Trail Sprint: trofeos para los 3 primeros clasificados generales M/F, por categoría de edad (Sub 23, Seniores, Veteranos 35/40/45/50/55/60+). Premio por equipos: equipo con más participantes y 3 mejores equipos. Trail Kids: premios por categoría (Benjamines A/B, Infantiles, Iniciados M/F). Medalla de participación para todos.",
    },
    fr: {
      question: "Quels sont les prix ?",
      answer:
        "Trail Jeune et Trail Sprint : trophées pour les 3 premiers au classement général H/F, par catégorie d'âge (U23, Seniors, Vétérans 35/40/45/50/55/60+). Prix par équipes : équipe avec le plus de participants et 3 meilleures équipes. Trail Kids : prix par catégorie (Benjamins A/B, Infantiles, Initiés H/F). Médaille de participation pour tous.",
    },
    de: {
      question: "Welche Preise gibt es?",
      answer:
        "Jugend Trail und Trail Sprint: Pokale für die Top 3 der Gesamtwertung M/W, nach Altersklasse (U23, Senioren, Veteranen 35/40/45/50/55/60+). Teampreise: Team mit den meisten Teilnehmern und Top 3 Teams. Trail Kids: Preise nach Kategorie (Benjamins A/B, Infantiles, Initiaten M/W). Teilnahmemedaille für alle.",
    },
    it: {
      question: "Quali sono i premi?",
      answer:
        "Trail Giovani e Trail Sprint: trofei per i primi 3 classificati generali M/F, per fascia d'età (U23, Seniores, Veterani 35/40/45/50/55/60+). Premio per squadre: squadra con più partecipanti e 3 migliori squadre. Trail Kids: premi per categoria (Benjamins A/B, Infantili, Iniziati M/F). Medaglia di partecipazione per tutti.",
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

  // ── FAQ 4: Optional extras ──
  const faq4 = await findOrCreateFAQ(
    event.id,
    4,
    "Existem extras opcionais?",
    "Sim! T-shirt técnica 42K Running por 3,50 €, Gola 42K Running por 2 € e Meias SocksBy por 2 €. Podem ser adquiridos no momento da inscrição."
  );

  const faq4Translations = {
    pt: {
      question: "Existem extras opcionais?",
      answer:
        "Sim! T-shirt técnica 42K Running por 3,50 €, Gola 42K Running por 2 € e Meias SocksBy por 2 €. Podem ser adquiridos no momento da inscrição.",
    },
    en: {
      question: "Are there optional extras?",
      answer:
        "Yes! 42K Running technical T-shirt for €3.50, 42K Running neck gaiter for €2 and SocksBy socks for €2. Can be purchased at registration.",
    },
    es: {
      question: "¿Hay extras opcionales?",
      answer:
        "¡Sí! Camiseta técnica 42K Running por 3,50 €, Braga 42K Running por 2 € y Calcetines SocksBy por 2 €. Se pueden adquirir en el momento de la inscripción.",
    },
    fr: {
      question: "Y a-t-il des extras optionnels ?",
      answer:
        "Oui ! T-shirt technique 42K Running à 3,50 €, Tour de cou 42K Running à 2 € et Chaussettes SocksBy à 2 €. Peuvent être achetés lors de l'inscription.",
    },
    de: {
      question: "Gibt es optionale Extras?",
      answer:
        "Ja! 42K Running Funktionsshirt für 3,50 €, 42K Running Schlauchtuch für 2 € und SocksBy Socken für 2 €. Können bei der Anmeldung erworben werden.",
    },
    it: {
      question: "Ci sono extra opzionali?",
      answer:
        "Sì! T-shirt tecnica 42K Running a 3,50 €, Scaldacollo 42K Running a 2 € e Calze SocksBy a 2 €. Possono essere acquistati al momento dell'iscrizione.",
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
  console.log("✅ FAQ 4: Optional extras");

  // ── FAQ 5: Registration & payment ──
  const faq5 = await findOrCreateFAQ(
    event.id,
    5,
    "Como me inscrevo e como pago?",
    "As inscrições são feitas na plataforma trilhoperdido.com. Pode pagar por MB Way ou Referência Multibanco. Atenção: as referências de pagamento têm validade máxima de 3 dias — findo este prazo a inscrição é apagada. Trail Kids: gratuito, basta preencher o formulário (não é necessário efetuar pagamento). Limite de inscrições: 600."
  );

  const faq5Translations = {
    pt: {
      question: "Como me inscrevo e como pago?",
      answer:
        "As inscrições são feitas na plataforma trilhoperdido.com. Pode pagar por MB Way ou Referência Multibanco. Atenção: as referências de pagamento têm validade máxima de 3 dias — findo este prazo a inscrição é apagada. Trail Kids: gratuito, basta preencher o formulário (não é necessário efetuar pagamento). Limite de inscrições: 600.",
    },
    en: {
      question: "How do I register and pay?",
      answer:
        "Registrations are made on the trilhoperdido.com platform. Payment via MB Way or Multibanco reference. Note: payment references expire after 3 days — your registration will be deleted. Trail Kids: free, just fill in the form (no payment needed). Registration limit: 600.",
    },
    es: {
      question: "¿Cómo me inscribo y cómo pago?",
      answer:
        "Las inscripciones se realizan en la plataforma trilhoperdido.com. Pago por MB Way o referencia Multibanco. Atención: las referencias de pago caducan en 3 días — pasado este plazo la inscripción se elimina. Trail Kids: gratis, basta rellenar el formulario (no es necesario pagar). Límite de inscripciones: 600.",
    },
    fr: {
      question: "Comment s'inscrire et payer ?",
      answer:
        "Les inscriptions se font sur la plateforme trilhoperdido.com. Paiement par MB Way ou référence Multibanco. Attention : les références de paiement expirent après 3 jours — votre inscription sera supprimée. Trail Kids : gratuit, il suffit de remplir le formulaire (pas de paiement nécessaire). Limite d'inscriptions : 600.",
    },
    de: {
      question: "Wie melde ich mich an und wie bezahle ich?",
      answer:
        "Anmeldungen erfolgen auf der Plattform trilhoperdido.com. Zahlung per MB Way oder Multibanco-Referenz. Achtung: Zahlungsreferenzen verfallen nach 3 Tagen — Ihre Anmeldung wird gelöscht. Trail Kids: kostenlos, einfach das Formular ausfüllen (keine Zahlung nötig). Anmeldelimit: 600.",
    },
    it: {
      question: "Come mi iscrivo e come pago?",
      answer:
        "Le iscrizioni si effettuano sulla piattaforma trilhoperdido.com. Pagamento tramite MB Way o riferimento Multibanco. Attenzione: i riferimenti di pagamento scadono dopo 3 giorni — l'iscrizione verrà cancellata. Trail Kids: gratuito, basta compilare il modulo (nessun pagamento necessario). Limite iscrizioni: 600.",
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
  console.log("✅ FAQ 5: Registration & payment");

  // ── FAQ 6: Contacts ──
  const faq6 = await findOrCreateFAQ(
    event.id,
    6,
    "Quais são os contactos da organização?",
    "E-mail: trailmoinhos@gmail.com (organização) / infotrilhoperdido@gmail.com (inscrições). Telemóvel: Ricardo Silva Rêgo 918 126 481, Ricardo Rosa 916 182 513, Daniela Silva Rêgo 914 601 261."
  );

  const faq6Translations = {
    pt: {
      question: "Quais são os contactos da organização?",
      answer:
        "E-mail: trailmoinhos@gmail.com (organização) / infotrilhoperdido@gmail.com (inscrições). Telemóvel: Ricardo Silva Rêgo 918 126 481, Ricardo Rosa 916 182 513, Daniela Silva Rêgo 914 601 261.",
    },
    en: {
      question: "What are the organization's contacts?",
      answer:
        "Email: trailmoinhos@gmail.com (organization) / infotrilhoperdido@gmail.com (registrations). Phone: Ricardo Silva Rêgo 918 126 481, Ricardo Rosa 916 182 513, Daniela Silva Rêgo 914 601 261.",
    },
    es: {
      question: "¿Cuáles son los contactos de la organización?",
      answer:
        "E-mail: trailmoinhos@gmail.com (organización) / infotrilhoperdido@gmail.com (inscripciones). Teléfono: Ricardo Silva Rêgo 918 126 481, Ricardo Rosa 916 182 513, Daniela Silva Rêgo 914 601 261.",
    },
    fr: {
      question: "Quels sont les contacts de l'organisation ?",
      answer:
        "E-mail : trailmoinhos@gmail.com (organisation) / infotrilhoperdido@gmail.com (inscriptions). Téléphone : Ricardo Silva Rêgo 918 126 481, Ricardo Rosa 916 182 513, Daniela Silva Rêgo 914 601 261.",
    },
    de: {
      question: "Was sind die Kontaktdaten der Organisation?",
      answer:
        "E-Mail: trailmoinhos@gmail.com (Organisation) / infotrilhoperdido@gmail.com (Anmeldung). Telefon: Ricardo Silva Rêgo 918 126 481, Ricardo Rosa 916 182 513, Daniela Silva Rêgo 914 601 261.",
    },
    it: {
      question: "Quali sono i contatti dell'organizzazione?",
      answer:
        "E-mail: trailmoinhos@gmail.com (organizzazione) / infotrilhoperdido@gmail.com (iscrizioni). Telefono: Ricardo Silva Rêgo 918 126 481, Ricardo Rosa 916 182 513, Daniela Silva Rêgo 914 601 261.",
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
🏔️ Trail dos Moinhos - Lourinhã 2026 seed completed!
──────────────────────────────────────────────
- Slug: trail-dos-moinhos-lourinha-2026
- Date: April 19, 2026
- Location: Moinhos da Pinhôa, Moita dos Ferreiros, Lourinhã
- Variants: Trail Sprint (24km), Trail Jovem (14km), Caminhada (11km), Trail Kids (gratuito)
- Pricing Phases: Promocional + 3 phases × 4 variants = 16 pricing phases
- FAQs: 7 with translations in 6 languages
- Circuits: ATRP Sprint, AAL Curto, Trail Jovem Nacional, ITRA
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
