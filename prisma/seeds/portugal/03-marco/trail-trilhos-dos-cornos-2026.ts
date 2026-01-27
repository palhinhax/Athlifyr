/**
 * Seed: IV Trail Trilhos dos Cornos 2026
 * Complete with translations in all 6 languages
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌲 Seeding IV Trail Trilhos dos Cornos 2026...");

  const eventSlug = "trail-trilhos-dos-cornos-2026";

  // Step 1: Delete existing data to ensure clean state
  const existingEvent = await prisma.event.findUnique({
    where: { slug: eventSlug },
  });

  if (existingEvent) {
    console.log("   Cleaning existing event data...");
    await prisma.pricingPhase.deleteMany({
      where: { eventId: existingEvent.id },
    });
    await prisma.eventFAQ.deleteMany({
      where: { eventId: existingEvent.id },
    });
    await prisma.eventVariant.deleteMany({
      where: { eventId: existingEvent.id },
    });
    await prisma.eventTranslation.deleteMany({
      where: { eventId: existingEvent.id },
    });
  }

  // Step 2: Upsert the event
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "IV Trail Trilhos dos Cornos",
      description:
        "4.ª edição do Trail Trilhos dos Cornos em Adões, Barcouço, Mealhada. Trail Longo K20 (Circuito Nacional Trail Sprint Série 100), Trail Curto K13 e Caminhada K10.",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-03-01T09:00:00.000Z"),
      endDate: null,
      city: "Mealhada",
      country: "Portugal",
      latitude: 40.3705,
      longitude: -8.4489,
      googleMapsUrl:
        "https://www.google.com/maps/place/Centro+Cultural+e+Recreativo+de+Ad%C3%B5es/@40.3705,-8.4489,17z",
      externalUrl: "https://stopandgo.net/events/iv-trail-trilhos-dos-cornos",
      imageUrl: null,
      isFeatured: false,
      registrationDeadline: new Date("2026-02-22T23:59:00.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "IV Trail Trilhos dos Cornos",
      description:
        "4.ª edição do Trail Trilhos dos Cornos em Adões, Barcouço, Mealhada. Trail Longo K20 (Circuito Nacional Trail Sprint Série 100), Trail Curto K13 e Caminhada K10.",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-03-01T09:00:00.000Z"),
      endDate: null,
      city: "Mealhada",
      country: "Portugal",
      latitude: 40.3705,
      longitude: -8.4489,
      googleMapsUrl:
        "https://www.google.com/maps/place/Centro+Cultural+e+Recreativo+de+Ad%C3%B5es/@40.3705,-8.4489,17z",
      externalUrl: "https://stopandgo.net/events/iv-trail-trilhos-dos-cornos",
      imageUrl: null,
      isFeatured: false,
      registrationDeadline: new Date("2026-02-22T23:59:00.000Z"),
    },
  });

  console.log(`✅ Event upserted: ${event.slug} (ID: ${event.id})`);

  // Step 3: Create translations for ALL 6 LANGUAGES
  const translations: Array<{
    language: "pt" | "en" | "es" | "fr" | "de" | "it";
    title: string;
    description: string;
    city: string;
    metaTitle: string;
    metaDescription: string;
  }> = [
    {
      language: "pt",
      title: "IV Trail Trilhos dos Cornos",
      city: "Mealhada",
      metaTitle: "IV Trail Trilhos dos Cornos 2026 | Adões, Mealhada | 1 Março",
      metaDescription:
        "IV Trail Trilhos dos Cornos - 1 de março de 2026 em Adões, Mealhada. Trail Longo 20km (Circuito Nacional Trail Sprint Série 100), Trail Curto 13km e Caminhada 10km. Inscrições até 22/02.",
      description: `# 🌲 IV Trail Trilhos dos Cornos 2026

O **IV Trail Trilhos dos Cornos** realiza-se no dia **1 de março de 2026**, na Aldeia de Adões, Freguesia de Barcouço, Município da Mealhada.

## 📅 Data e Local

- **Data:** 1 de março de 2026 (Domingo)
- **Local:** Centro Cultural e Recreativo de Adões
- **Localidade:** Adões, Barcouço, Mealhada
- **Distrito:** Aveiro

## 🏃 Provas e Distâncias

| Prova | Distância | Hora Partida | Tempo Limite |
|-------|-----------|--------------|--------------|
| **Trail Longo K20** | ~20 km | 09:00 | 4h |
| **Trail Curto K13** | ~13 km | 09:30 | 4h |
| **Caminhada K10** | ~10 km | 09:45 | 4h |

O **Trail Longo K20** pertence ao **Circuito Nacional de Trail Sprint Série 100**.

## 🎯 Objetivos do Evento

- Promover a corrida por trilhos (Trail Running)
- Promover a Aldeia de Adões como palco para este desporto
- Promover a região como destino natural a preservar e visitar
- Promover a prática de um desporto com impacto ambiental nulo

## 🎒 Material Obrigatório (Trail Longo K20)

- ✅ Telemóvel
- ✅ Depósito de água 1000ml (não são fornecidos copos)
- ✅ Apito
- ✅ Manta térmica

## 🎁 A Inscrição Inclui

- ✅ Dorsal e seguro de acidente pessoal
- ✅ Abastecimentos durante a prova
- ✅ Cronometragem (exceto caminhada)
- ✅ Prémio Finisher e medalha
- ✅ Banho quente
- ✅ Reforço final com fino/água/sumo
- ✅ 1 Bolo de Cornos 🥐
- ✅ Kit do atleta com diversos brindes
- ✅ Fotografias nas redes sociais

## 🍽️ Extras Opcionais

- Refeição: +2€ (no dia +4€)
- T-shirt personalizada: +6,50€ (no dia +10€)

## 📍 Secretariado

**Local:** Centro Cultural e Recreativo de Adões, Rua do Centro Cultural 3050-71, Barcouço

**Horários:**
- **28/02/2026:** 14h00 às 21h00
- **01/03/2026:** 07h00 às 09h30

## 📞 Contactos

- **Email:** adoestrail@gmail.com
- **Bruno Ferreira:** 912 343 525
- **Carlos Simões:** 910 139 491
- **Rui Ferreira:** 913 215 611

---

**🌲 Trilhos dos Cornos - Adões, Mealhada!**`,
    },
    {
      language: "en",
      title: "IV Trail Trilhos dos Cornos",
      city: "Mealhada",
      metaTitle: "IV Trail Trilhos dos Cornos 2026 | Adões, Mealhada | March 1",
      metaDescription:
        "IV Trail Trilhos dos Cornos - March 1, 2026 in Adões, Mealhada. Trail Longo 20km (National Trail Sprint Circuit Series 100), Trail Curto 13km and Walk 10km. Registration until Feb 22.",
      description: `# 🌲 IV Trail Trilhos dos Cornos 2026

The **IV Trail Trilhos dos Cornos** takes place on **March 1, 2026**, in the village of Adões, Parish of Barcouço, Municipality of Mealhada.

## 📅 Date and Location

- **Date:** March 1, 2026 (Sunday)
- **Location:** Centro Cultural e Recreativo de Adões
- **Village:** Adões, Barcouço, Mealhada
- **District:** Aveiro

## 🏃 Races and Distances

| Race | Distance | Start Time | Time Limit |
|------|----------|------------|------------|
| **Trail Longo K20** | ~20 km | 09:00 | 4h |
| **Trail Curto K13** | ~13 km | 09:30 | 4h |
| **Walk K10** | ~10 km | 09:45 | 4h |

**Trail Longo K20** is part of the **National Trail Sprint Circuit Series 100**.

## 🎯 Event Objectives

- Promote trail running
- Promote the village of Adões as a venue for this sport
- Promote the region as a natural destination to preserve and visit
- Promote a sport with zero environmental impact

## 🎒 Mandatory Equipment (Trail Longo K20)

- ✅ Mobile phone
- ✅ 1000ml water container (cups not provided)
- ✅ Whistle
- ✅ Thermal blanket

## 🎁 Registration Includes

- ✅ Bib number and personal accident insurance
- ✅ Aid stations during the race
- ✅ Timing (except walk)
- ✅ Finisher prize and medal
- ✅ Hot shower
- ✅ Post-race refreshments with beer/water/juice
- ✅ 1 "Bolo de Cornos" (local pastry) 🥐
- ✅ Athlete kit with various gifts
- ✅ Photos on social media

## 🍽️ Optional Extras

- Meal: +€2 (on race day +€4)
- Custom T-shirt: +€6.50 (on race day +€10)

## 📍 Secretariat

**Location:** Centro Cultural e Recreativo de Adões, Rua do Centro Cultural 3050-71, Barcouço

**Hours:**
- **Feb 28, 2026:** 2 PM to 9 PM
- **March 1, 2026:** 7 AM to 9:30 AM

## 📞 Contacts

- **Email:** adoestrail@gmail.com
- **Bruno Ferreira:** 912 343 525
- **Carlos Simões:** 910 139 491
- **Rui Ferreira:** 913 215 611

---

**🌲 Trilhos dos Cornos - Adões, Mealhada!**`,
    },
    {
      language: "es",
      title: "IV Trail Trilhos dos Cornos",
      city: "Mealhada",
      metaTitle: "IV Trail Trilhos dos Cornos 2026 | Adões, Mealhada | 1 Marzo",
      metaDescription:
        "IV Trail Trilhos dos Cornos - 1 de marzo de 2026 en Adões, Mealhada. Trail Largo 20km (Circuito Nacional Trail Sprint Serie 100), Trail Corto 13km y Caminata 10km. Inscripciones hasta 22/02.",
      description: `# 🌲 IV Trail Trilhos dos Cornos 2026

El **IV Trail Trilhos dos Cornos** se celebra el **1 de marzo de 2026**, en la aldea de Adões, Parroquia de Barcouço, Municipio de Mealhada.

## 📅 Fecha y Lugar

- **Fecha:** 1 de marzo de 2026 (Domingo)
- **Lugar:** Centro Cultural e Recreativo de Adões
- **Localidad:** Adões, Barcouço, Mealhada
- **Distrito:** Aveiro

## 🏃 Pruebas y Distancias

| Prueba | Distancia | Hora Salida | Tiempo Límite |
|--------|-----------|-------------|---------------|
| **Trail Largo K20** | ~20 km | 09:00 | 4h |
| **Trail Corto K13** | ~13 km | 09:30 | 4h |
| **Caminata K10** | ~10 km | 09:45 | 4h |

El **Trail Largo K20** pertenece al **Circuito Nacional de Trail Sprint Serie 100**.

## 🎯 Objetivos del Evento

- Promover la carrera por senderos (Trail Running)
- Promover la Aldea de Adões como escenario para este deporte
- Promover la región como destino natural a preservar y visitar
- Promover la práctica de un deporte con impacto ambiental nulo

## 🎒 Material Obligatorio (Trail Largo K20)

- ✅ Teléfono móvil
- ✅ Depósito de agua 1000ml (no se proporcionan vasos)
- ✅ Silbato
- ✅ Manta térmica

## 🎁 La Inscripción Incluye

- ✅ Dorsal y seguro de accidente personal
- ✅ Avituallamientos durante la prueba
- ✅ Cronometraje (excepto caminata)
- ✅ Premio Finisher y medalla
- ✅ Ducha caliente
- ✅ Refrigerio final con cerveza/agua/zumo
- ✅ 1 "Bolo de Cornos" (pastel local) 🥐
- ✅ Kit del atleta con diversos obsequios
- ✅ Fotografías en redes sociales

## 🍽️ Extras Opcionales

- Comida: +2€ (el día de la prueba +4€)
- Camiseta personalizada: +6,50€ (el día de la prueba +10€)

## 📍 Secretariado

**Lugar:** Centro Cultural e Recreativo de Adões, Rua do Centro Cultural 3050-71, Barcouço

**Horarios:**
- **28/02/2026:** 14h00 a 21h00
- **01/03/2026:** 07h00 a 09h30

## 📞 Contactos

- **Email:** adoestrail@gmail.com
- **Bruno Ferreira:** 912 343 525
- **Carlos Simões:** 910 139 491
- **Rui Ferreira:** 913 215 611

---

**🌲 Trilhos dos Cornos - Adões, Mealhada!**`,
    },
    {
      language: "fr",
      title: "IV Trail Trilhos dos Cornos",
      city: "Mealhada",
      metaTitle:
        "IV Trail Trilhos dos Cornos 2026 | Adões, Mealhada | 1er Mars",
      metaDescription:
        "IV Trail Trilhos dos Cornos - 1er mars 2026 à Adões, Mealhada. Trail Long 20km (Circuit National Trail Sprint Série 100), Trail Court 13km et Marche 10km. Inscriptions jusqu'au 22/02.",
      description: `# 🌲 IV Trail Trilhos dos Cornos 2026

Le **IV Trail Trilhos dos Cornos** se déroule le **1er mars 2026**, dans le village d'Adões, Paroisse de Barcouço, Municipalité de Mealhada.

## 📅 Date et Lieu

- **Date:** 1er mars 2026 (Dimanche)
- **Lieu:** Centro Cultural e Recreativo de Adões
- **Village:** Adões, Barcouço, Mealhada
- **District:** Aveiro

## 🏃 Épreuves et Distances

| Épreuve | Distance | Heure Départ | Temps Limite |
|---------|----------|--------------|--------------|
| **Trail Long K20** | ~20 km | 09:00 | 4h |
| **Trail Court K13** | ~13 km | 09:30 | 4h |
| **Marche K10** | ~10 km | 09:45 | 4h |

Le **Trail Long K20** fait partie du **Circuit National de Trail Sprint Série 100**.

## 🎯 Objectifs de l'Événement

- Promouvoir la course sur sentiers (Trail Running)
- Promouvoir le village d'Adões comme lieu pour ce sport
- Promouvoir la région comme destination naturelle à préserver et visiter
- Promouvoir la pratique d'un sport à impact environnemental nul

## 🎒 Matériel Obligatoire (Trail Long K20)

- ✅ Téléphone portable
- ✅ Réservoir d'eau 1000ml (gobelets non fournis)
- ✅ Sifflet
- ✅ Couverture de survie

## 🎁 L'Inscription Comprend

- ✅ Dossard et assurance accident personnel
- ✅ Ravitaillements pendant la course
- ✅ Chronométrage (sauf marche)
- ✅ Prix Finisher et médaille
- ✅ Douche chaude
- ✅ Rafraîchissements de fin avec bière/eau/jus
- ✅ 1 "Bolo de Cornos" (pâtisserie locale) 🥐
- ✅ Kit de l'athlète avec divers cadeaux
- ✅ Photos sur les réseaux sociaux

## 🍽️ Extras Optionnels

- Repas: +2€ (le jour de la course +4€)
- T-shirt personnalisé: +6,50€ (le jour de la course +10€)

## 📍 Secrétariat

**Lieu:** Centro Cultural e Recreativo de Adões, Rua do Centro Cultural 3050-71, Barcouço

**Horaires:**
- **28/02/2026:** 14h00 à 21h00
- **01/03/2026:** 07h00 à 09h30

## 📞 Contacts

- **Email:** adoestrail@gmail.com
- **Bruno Ferreira:** 912 343 525
- **Carlos Simões:** 910 139 491
- **Rui Ferreira:** 913 215 611

---

**🌲 Trilhos dos Cornos - Adões, Mealhada!**`,
    },
    {
      language: "de",
      title: "IV Trail Trilhos dos Cornos",
      city: "Mealhada",
      metaTitle: "IV Trail Trilhos dos Cornos 2026 | Adões, Mealhada | 1. März",
      metaDescription:
        "IV Trail Trilhos dos Cornos - 1. März 2026 in Adões, Mealhada. Trail Lang 20km (Nationaler Trail Sprint Circuit Serie 100), Trail Kurz 13km und Wanderung 10km. Anmeldung bis 22.02.",
      description: `# 🌲 IV Trail Trilhos dos Cornos 2026

Der **IV Trail Trilhos dos Cornos** findet am **1. März 2026** im Dorf Adões, Gemeinde Barcouço, Landkreis Mealhada statt.

## 📅 Datum und Ort

- **Datum:** 1. März 2026 (Sonntag)
- **Ort:** Centro Cultural e Recreativo de Adões
- **Dorf:** Adões, Barcouço, Mealhada
- **Bezirk:** Aveiro

## 🏃 Rennen und Distanzen

| Rennen | Distanz | Startzeit | Zeitlimit |
|--------|---------|-----------|-----------|
| **Trail Lang K20** | ~20 km | 09:00 | 4h |
| **Trail Kurz K13** | ~13 km | 09:30 | 4h |
| **Wanderung K10** | ~10 km | 09:45 | 4h |

Der **Trail Lang K20** ist Teil des **Nationalen Trail Sprint Circuit Serie 100**.

## 🎯 Veranstaltungsziele

- Förderung des Trail Running
- Förderung des Dorfes Adões als Austragungsort für diesen Sport
- Förderung der Region als Naturziel zum Bewahren und Besuchen
- Förderung eines Sports mit null Umweltbelastung

## 🎒 Pflichtausrüstung (Trail Lang K20)

- ✅ Mobiltelefon
- ✅ 1000ml Wasserbehälter (keine Becher bereitgestellt)
- ✅ Pfeife
- ✅ Rettungsdecke

## 🎁 Die Anmeldung Beinhaltet

- ✅ Startnummer und Unfallversicherung
- ✅ Verpflegungsstationen während des Rennens
- ✅ Zeitmessung (außer Wanderung)
- ✅ Finisher-Preis und Medaille
- ✅ Warmdusche
- ✅ Erfrischungen nach dem Rennen mit Bier/Wasser/Saft
- ✅ 1 "Bolo de Cornos" (lokales Gebäck) 🥐
- ✅ Athleten-Kit mit verschiedenen Geschenken
- ✅ Fotos in sozialen Medien

## 🍽️ Optionale Extras

- Mahlzeit: +2€ (am Renntag +4€)
- Individuelles T-Shirt: +6,50€ (am Renntag +10€)

## 📍 Sekretariat

**Ort:** Centro Cultural e Recreativo de Adões, Rua do Centro Cultural 3050-71, Barcouço

**Öffnungszeiten:**
- **28.02.2026:** 14:00 bis 21:00
- **01.03.2026:** 07:00 bis 09:30

## 📞 Kontakte

- **E-Mail:** adoestrail@gmail.com
- **Bruno Ferreira:** 912 343 525
- **Carlos Simões:** 910 139 491
- **Rui Ferreira:** 913 215 611

---

**🌲 Trilhos dos Cornos - Adões, Mealhada!**`,
    },
    {
      language: "it",
      title: "IV Trail Trilhos dos Cornos",
      city: "Mealhada",
      metaTitle: "IV Trail Trilhos dos Cornos 2026 | Adões, Mealhada | 1 Marzo",
      metaDescription:
        "IV Trail Trilhos dos Cornos - 1° marzo 2026 ad Adões, Mealhada. Trail Lungo 20km (Circuito Nazionale Trail Sprint Serie 100), Trail Corto 13km e Camminata 10km. Iscrizioni fino al 22/02.",
      description: `# 🌲 IV Trail Trilhos dos Cornos 2026

Il **IV Trail Trilhos dos Cornos** si svolge il **1° marzo 2026**, nel villaggio di Adões, Parrocchia di Barcouço, Comune di Mealhada.

## 📅 Data e Luogo

- **Data:** 1° marzo 2026 (Domenica)
- **Luogo:** Centro Cultural e Recreativo de Adões
- **Villaggio:** Adões, Barcouço, Mealhada
- **Distretto:** Aveiro

## 🏃 Gare e Distanze

| Gara | Distanza | Ora Partenza | Tempo Limite |
|------|----------|--------------|--------------|
| **Trail Lungo K20** | ~20 km | 09:00 | 4h |
| **Trail Corto K13** | ~13 km | 09:30 | 4h |
| **Camminata K10** | ~10 km | 09:45 | 4h |

Il **Trail Lungo K20** fa parte del **Circuito Nazionale di Trail Sprint Serie 100**.

## 🎯 Obiettivi dell'Evento

- Promuovere la corsa su sentieri (Trail Running)
- Promuovere il villaggio di Adões come sede per questo sport
- Promuovere la regione come destinazione naturale da preservare e visitare
- Promuovere la pratica di uno sport a impatto ambientale zero

## 🎒 Materiale Obbligatorio (Trail Lungo K20)

- ✅ Telefono cellulare
- ✅ Contenitore d'acqua 1000ml (bicchieri non forniti)
- ✅ Fischietto
- ✅ Coperta termica

## 🎁 L'Iscrizione Include

- ✅ Pettorale e assicurazione infortuni personali
- ✅ Punti di ristoro durante la gara
- ✅ Cronometraggio (esclusa camminata)
- ✅ Premio Finisher e medaglia
- ✅ Doccia calda
- ✅ Ristoro finale con birra/acqua/succo
- ✅ 1 "Bolo de Cornos" (dolce locale) 🥐
- ✅ Kit dell'atleta con vari omaggi
- ✅ Foto sui social media

## 🍽️ Extra Opzionali

- Pasto: +2€ (il giorno della gara +4€)
- T-shirt personalizzata: +6,50€ (il giorno della gara +10€)

## 📍 Segreteria

**Luogo:** Centro Cultural e Recreativo de Adões, Rua do Centro Cultural 3050-71, Barcouço

**Orari:**
- **28/02/2026:** 14:00 alle 21:00
- **01/03/2026:** 07:00 alle 09:30

## 📞 Contatti

- **Email:** adoestrail@gmail.com
- **Bruno Ferreira:** 912 343 525
- **Carlos Simões:** 910 139 491
- **Rui Ferreira:** 913 215 611

---

**🌲 Trilhos dos Cornos - Adões, Mealhada!**`,
    },
  ];

  console.log("📝 Creating translations for all 6 languages...");

  for (const t of translations) {
    await prisma.eventTranslation.upsert({
      where: { eventId_language: { eventId: event.id, language: t.language } },
      update: {
        title: t.title,
        description: t.description,
        city: t.city,
        metaTitle: t.metaTitle,
        metaDescription: t.metaDescription,
      },
      create: {
        eventId: event.id,
        language: t.language,
        title: t.title,
        description: t.description,
        city: t.city,
        metaTitle: t.metaTitle,
        metaDescription: t.metaDescription,
      },
    });
    console.log(`   ✅ Translation ${t.language.toUpperCase()} created`);
  }

  // Step 4: Create event variants
  console.log("🏃 Creating event variants...");

  const variants = [
    {
      name: "Trail Longo K20",
      distanceKm: 20,
      elevationGainM: null,
      startTime: "09:00",
      cutoffTimeHours: 4,
      description:
        "Trail Longo de 20km - Circuito Nacional de Trail Sprint Série 100",
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-11-29T00:00:00.000Z"),
          endDate: new Date("2026-01-11T23:59:59.000Z"),
          price: 18.0,
          currency: "EUR" as const,
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-12T00:00:00.000Z"),
          endDate: new Date("2026-02-22T23:59:59.000Z"),
          price: 20.0,
          currency: "EUR" as const,
        },
      ],
      translations: {
        pt: {
          name: "Trail Longo K20",
          description:
            "Trail Longo de 20km - Circuito Nacional de Trail Sprint Série 100. Tempo limite: 4 horas.",
        },
        en: {
          name: "Trail Longo K20",
          description:
            "20km Long Trail - National Trail Sprint Circuit Series 100. Time limit: 4 hours.",
        },
        es: {
          name: "Trail Largo K20",
          description:
            "Trail Largo de 20km - Circuito Nacional de Trail Sprint Serie 100. Tiempo límite: 4 horas.",
        },
        fr: {
          name: "Trail Long K20",
          description:
            "Trail Long de 20km - Circuit National de Trail Sprint Série 100. Temps limite: 4 heures.",
        },
        de: {
          name: "Trail Lang K20",
          description:
            "20km Trail Lang - Nationaler Trail Sprint Circuit Serie 100. Zeitlimit: 4 Stunden.",
        },
        it: {
          name: "Trail Lungo K20",
          description:
            "Trail Lungo di 20km - Circuito Nazionale di Trail Sprint Serie 100. Tempo limite: 4 ore.",
        },
      },
    },
    {
      name: "Trail Curto K13",
      distanceKm: 13,
      elevationGainM: null,
      startTime: "09:30",
      cutoffTimeHours: 4,
      description: "Mini Trail de 13km",
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-11-29T00:00:00.000Z"),
          endDate: new Date("2026-01-11T23:59:59.000Z"),
          price: 14.0,
          currency: "EUR" as const,
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-12T00:00:00.000Z"),
          endDate: new Date("2026-02-22T23:59:59.000Z"),
          price: 16.0,
          currency: "EUR" as const,
        },
      ],
      translations: {
        pt: {
          name: "Trail Curto K13",
          description: "Mini Trail de 13km. Tempo limite: 4 horas.",
        },
        en: {
          name: "Trail Curto K13",
          description: "13km Mini Trail. Time limit: 4 hours.",
        },
        es: {
          name: "Trail Corto K13",
          description: "Mini Trail de 13km. Tiempo límite: 4 horas.",
        },
        fr: {
          name: "Trail Court K13",
          description: "Mini Trail de 13km. Temps limite: 4 heures.",
        },
        de: {
          name: "Trail Kurz K13",
          description: "13km Mini Trail. Zeitlimit: 4 Stunden.",
        },
        it: {
          name: "Trail Corto K13",
          description: "Mini Trail di 13km. Tempo limite: 4 ore.",
        },
      },
    },
    {
      name: "Caminhada K10",
      distanceKm: 10,
      elevationGainM: null,
      startTime: "09:45",
      cutoffTimeHours: 4,
      description: "Caminhada não competitiva de 10km",
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-11-29T00:00:00.000Z"),
          endDate: new Date("2026-01-11T23:59:59.000Z"),
          price: 12.0,
          currency: "EUR" as const,
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-12T00:00:00.000Z"),
          endDate: new Date("2026-02-22T23:59:59.000Z"),
          price: 14.0,
          currency: "EUR" as const,
        },
      ],
      translations: {
        pt: {
          name: "Caminhada K10",
          description:
            "Caminhada não competitiva de 10km. Aberta a todas as idades.",
        },
        en: {
          name: "Walk K10",
          description: "Non-competitive 10km walk. Open to all ages.",
        },
        es: {
          name: "Caminata K10",
          description:
            "Caminata no competitiva de 10km. Abierta a todas las edades.",
        },
        fr: {
          name: "Marche K10",
          description:
            "Marche non compétitive de 10km. Ouverte à tous les âges.",
        },
        de: {
          name: "Wanderung K10",
          description:
            "Nicht-kompetitive 10km Wanderung. Offen für alle Altersgruppen.",
        },
        it: {
          name: "Camminata K10",
          description:
            "Camminata non competitiva di 10km. Aperta a tutte le età.",
        },
      },
    },
  ];

  for (const variantData of variants) {
    const {
      pricingPhases,
      translations: variantTranslations,
      ...variantInfo
    } = variantData;

    const variant = await prisma.eventVariant.create({
      data: {
        ...variantInfo,
        eventId: event.id,
      },
    });

    console.log(`   ✅ Created variant: ${variant.name}`);

    // Create variant translations
    for (const [lang, trans] of Object.entries(variantTranslations)) {
      await prisma.eventVariantTranslation.create({
        data: {
          variantId: variant.id,
          language: lang as "pt" | "en" | "es" | "fr" | "de" | "it",
          name: trans.name,
          description: trans.description,
        },
      });
    }

    // Create pricing phases linked to eventId (NOT variantId)
    for (const phase of pricingPhases) {
      await prisma.pricingPhase.create({
        data: {
          eventId: event.id,
          name: `${variant.name} - ${phase.name}`,
          startDate: phase.startDate,
          endDate: phase.endDate,
          price: phase.price,
          currency: phase.currency,
        },
      });
    }
    console.log(`   - Created ${pricingPhases.length} pricing phases`);
  }

  // Step 5: Create FAQs
  console.log("❓ Creating FAQs...");

  const faqs = [
    {
      order: 1,
      question: "O que está incluído na inscrição?",
      answer:
        "A inscrição inclui: dorsal, seguro de acidente pessoal, abastecimentos durante a prova, cronometragem (exceto caminhada), prémio Finisher e medalha, banho quente, reforço final com fino/água/sumo, 1 Bolo de Cornos, kit do atleta com diversos brindes e fotografias nas redes sociais.",
      translations: {
        pt: {
          question: "O que está incluído na inscrição?",
          answer:
            "A inscrição inclui: dorsal, seguro de acidente pessoal, abastecimentos durante a prova, cronometragem (exceto caminhada), prémio Finisher e medalha, banho quente, reforço final com fino/água/sumo, 1 Bolo de Cornos, kit do atleta com diversos brindes e fotografias nas redes sociais.",
        },
        en: {
          question: "What is included in the registration?",
          answer:
            "Registration includes: bib number, personal accident insurance, aid stations during the race, timing (except walk), Finisher prize and medal, hot shower, post-race refreshments with beer/water/juice, 1 'Bolo de Cornos' (local pastry), athlete kit with various gifts, and photos on social media.",
        },
        es: {
          question: "¿Qué está incluido en la inscripción?",
          answer:
            "La inscripción incluye: dorsal, seguro de accidente personal, avituallamientos durante la prueba, cronometraje (excepto caminata), premio Finisher y medalla, ducha caliente, refrigerio final con cerveza/agua/zumo, 1 'Bolo de Cornos' (pastel local), kit del atleta con diversos obsequios y fotografías en redes sociales.",
        },
        fr: {
          question: "Qu'est-ce qui est inclus dans l'inscription?",
          answer:
            "L'inscription comprend: dossard, assurance accident personnel, ravitaillements pendant la course, chronométrage (sauf marche), prix Finisher et médaille, douche chaude, rafraîchissements de fin avec bière/eau/jus, 1 'Bolo de Cornos' (pâtisserie locale), kit de l'athlète avec divers cadeaux et photos sur les réseaux sociaux.",
        },
        de: {
          question: "Was ist in der Anmeldung enthalten?",
          answer:
            "Die Anmeldung beinhaltet: Startnummer, Unfallversicherung, Verpflegungsstationen während des Rennens, Zeitmessung (außer Wanderung), Finisher-Preis und Medaille, Warmdusche, Erfrischungen nach dem Rennen mit Bier/Wasser/Saft, 1 'Bolo de Cornos' (lokales Gebäck), Athleten-Kit mit verschiedenen Geschenken und Fotos in sozialen Medien.",
        },
        it: {
          question: "Cosa è incluso nell'iscrizione?",
          answer:
            "L'iscrizione include: pettorale, assicurazione infortuni personali, punti di ristoro durante la gara, cronometraggio (esclusa camminata), premio Finisher e medaglia, doccia calda, ristoro finale con birra/acqua/succo, 1 'Bolo de Cornos' (dolce locale), kit dell'atleta con vari omaggi e foto sui social media.",
        },
      },
    },
    {
      order: 2,
      question: "Qual é o material obrigatório para o Trail Longo K20?",
      answer:
        "Para o Trail Longo K20 é obrigatório: telemóvel, depósito de água 1000ml (a organização não fornece copos), apito e manta térmica. Material recomendado: mochila/colete de hidratação, impermeável, luvas, copo e alimentação extra.",
      translations: {
        pt: {
          question: "Qual é o material obrigatório para o Trail Longo K20?",
          answer:
            "Para o Trail Longo K20 é obrigatório: telemóvel, depósito de água 1000ml (a organização não fornece copos), apito e manta térmica. Material recomendado: mochila/colete de hidratação, impermeável, luvas, copo e alimentação extra.",
        },
        en: {
          question: "What is the mandatory equipment for Trail Longo K20?",
          answer:
            "For Trail Longo K20 the mandatory equipment is: mobile phone, 1000ml water container (the organization does not provide cups), whistle, and thermal blanket. Recommended equipment: hydration backpack/vest, waterproof jacket, gloves, cup, and extra food.",
        },
        es: {
          question: "¿Cuál es el material obligatorio para el Trail Largo K20?",
          answer:
            "Para el Trail Largo K20 es obligatorio: teléfono móvil, depósito de agua 1000ml (la organización no proporciona vasos), silbato y manta térmica. Material recomendado: mochila/chaleco de hidratación, impermeable, guantes, vaso y alimentación extra.",
        },
        fr: {
          question: "Quel est le matériel obligatoire pour le Trail Long K20?",
          answer:
            "Pour le Trail Long K20, le matériel obligatoire est: téléphone portable, réservoir d'eau 1000ml (l'organisation ne fournit pas de gobelets), sifflet et couverture de survie. Matériel recommandé: sac/gilet d'hydratation, imperméable, gants, gobelet et alimentation supplémentaire.",
        },
        de: {
          question: "Was ist die Pflichtausrüstung für den Trail Lang K20?",
          answer:
            "Für den Trail Lang K20 ist Pflichtausrüstung: Mobiltelefon, 1000ml Wasserbehälter (die Organisation stellt keine Becher bereit), Pfeife und Rettungsdecke. Empfohlene Ausrüstung: Trinkrucksack/-weste, wasserdichte Jacke, Handschuhe, Becher und zusätzliche Verpflegung.",
        },
        it: {
          question: "Qual è il materiale obbligatorio per il Trail Lungo K20?",
          answer:
            "Per il Trail Lungo K20 il materiale obbligatorio è: telefono cellulare, contenitore d'acqua 1000ml (l'organizzazione non fornisce bicchieri), fischietto e coperta termica. Materiale consigliato: zaino/gilet di idratazione, giacca impermeabile, guanti, bicchiere e cibo extra.",
        },
      },
    },
    {
      order: 3,
      question: "Qual é a idade mínima para participar?",
      answer:
        "As provas de corrida (Trail Longo e Trail Curto) são abertas a maiores de 18 anos, ou 16 anos com autorização dos pais. A Caminhada não tem carácter competitivo e está aberta a todas as pessoas, sem limite de idade.",
      translations: {
        pt: {
          question: "Qual é a idade mínima para participar?",
          answer:
            "As provas de corrida (Trail Longo e Trail Curto) são abertas a maiores de 18 anos, ou 16 anos com autorização dos pais. A Caminhada não tem carácter competitivo e está aberta a todas as pessoas, sem limite de idade.",
        },
        en: {
          question: "What is the minimum age to participate?",
          answer:
            "The running races (Trail Longo and Trail Curto) are open to those over 18 years old, or 16 years old with parental authorization. The Walk is non-competitive and open to everyone, with no age limit.",
        },
        es: {
          question: "¿Cuál es la edad mínima para participar?",
          answer:
            "Las pruebas de carrera (Trail Largo y Trail Corto) están abiertas a mayores de 18 años, o 16 años con autorización de los padres. La Caminata no tiene carácter competitivo y está abierta a todas las personas, sin límite de edad.",
        },
        fr: {
          question: "Quel est l'âge minimum pour participer?",
          answer:
            "Les courses (Trail Long et Trail Court) sont ouvertes aux personnes de plus de 18 ans, ou 16 ans avec autorisation parentale. La Marche n'est pas compétitive et est ouverte à tous, sans limite d'âge.",
        },
        de: {
          question: "Was ist das Mindestalter für die Teilnahme?",
          answer:
            "Die Laufrennen (Trail Lang und Trail Kurz) sind für Personen über 18 Jahre offen, oder 16 Jahre mit elterlicher Genehmigung. Die Wanderung ist nicht kompetitiv und offen für alle, ohne Altersbegrenzung.",
        },
        it: {
          question: "Qual è l'età minima per partecipare?",
          answer:
            "Le gare di corsa (Trail Lungo e Trail Corto) sono aperte ai maggiori di 18 anni, o 16 anni con autorizzazione dei genitori. La Camminata non è competitiva ed è aperta a tutti, senza limiti di età.",
        },
      },
    },
    {
      order: 4,
      question: "Onde e quando posso levantar o dorsal?",
      answer:
        "O secretariado funciona no Centro Cultural e Recreativo de Adões, Rua do Centro Cultural 3050-71, Barcouço. Horários: 28/02/2026 das 14h às 21h e 01/03/2026 das 7h às 9h30. É necessário apresentar BI/CC para confirmação de identidade.",
      translations: {
        pt: {
          question: "Onde e quando posso levantar o dorsal?",
          answer:
            "O secretariado funciona no Centro Cultural e Recreativo de Adões, Rua do Centro Cultural 3050-71, Barcouço. Horários: 28/02/2026 das 14h às 21h e 01/03/2026 das 7h às 9h30. É necessário apresentar BI/CC para confirmação de identidade.",
        },
        en: {
          question: "Where and when can I pick up my bib?",
          answer:
            "The secretariat is located at Centro Cultural e Recreativo de Adões, Rua do Centro Cultural 3050-71, Barcouço. Hours: Feb 28, 2026 from 2 PM to 9 PM and March 1, 2026 from 7 AM to 9:30 AM. ID card is required for identity confirmation.",
        },
        es: {
          question: "¿Dónde y cuándo puedo recoger el dorsal?",
          answer:
            "El secretariado está ubicado en el Centro Cultural e Recreativo de Adões, Rua do Centro Cultural 3050-71, Barcouço. Horarios: 28/02/2026 de 14h a 21h y 01/03/2026 de 7h a 9h30. Es necesario presentar documento de identidad.",
        },
        fr: {
          question: "Où et quand puis-je récupérer mon dossard?",
          answer:
            "Le secrétariat est situé au Centro Cultural e Recreativo de Adões, Rua do Centro Cultural 3050-71, Barcouço. Horaires: 28/02/2026 de 14h à 21h et 01/03/2026 de 7h à 9h30. Une pièce d'identité est requise.",
        },
        de: {
          question: "Wo und wann kann ich meine Startnummer abholen?",
          answer:
            "Das Sekretariat befindet sich im Centro Cultural e Recreativo de Adões, Rua do Centro Cultural 3050-71, Barcouço. Öffnungszeiten: 28.02.2026 von 14 bis 21 Uhr und 01.03.2026 von 7 bis 9:30 Uhr. Ein Ausweis ist zur Identitätsbestätigung erforderlich.",
        },
        it: {
          question: "Dove e quando posso ritirare il pettorale?",
          answer:
            "La segreteria si trova presso il Centro Cultural e Recreativo de Adões, Rua do Centro Cultural 3050-71, Barcouço. Orari: 28/02/2026 dalle 14 alle 21 e 01/03/2026 dalle 7 alle 9:30. È necessario presentare un documento d'identità.",
        },
      },
    },
    {
      order: 5,
      question: "Há prémios para os participantes?",
      answer:
        "Sim! Existem prémios para o Trail Longo K20 e Trail Curto K13: os 3 primeiros classificados masculinos e femininos na geral, os 3 primeiros de cada escalão etário, e as 3 primeiras equipas. Há também prémios monetários por equipas (K20: 180€/120€/80€; K13: 120€/80€/40€).",
      translations: {
        pt: {
          question: "Há prémios para os participantes?",
          answer:
            "Sim! Existem prémios para o Trail Longo K20 e Trail Curto K13: os 3 primeiros classificados masculinos e femininos na geral, os 3 primeiros de cada escalão etário, e as 3 primeiras equipas. Há também prémios monetários por equipas (K20: 180€/120€/80€; K13: 120€/80€/40€).",
        },
        en: {
          question: "Are there prizes for participants?",
          answer:
            "Yes! There are prizes for Trail Longo K20 and Trail Curto K13: top 3 male and female overall, top 3 in each age category, and top 3 teams. There are also cash prizes for teams (K20: €180/€120/€80; K13: €120/€80/€40).",
        },
        es: {
          question: "¿Hay premios para los participantes?",
          answer:
            "¡Sí! Hay premios para Trail Largo K20 y Trail Corto K13: los 3 primeros clasificados masculinos y femeninos en general, los 3 primeros de cada categoría de edad, y los 3 primeros equipos. También hay premios en metálico por equipos (K20: 180€/120€/80€; K13: 120€/80€/40€).",
        },
        fr: {
          question: "Y a-t-il des prix pour les participants?",
          answer:
            "Oui! Il y a des prix pour le Trail Long K20 et Trail Court K13: les 3 premiers hommes et femmes au classement général, les 3 premiers de chaque catégorie d'âge, et les 3 premières équipes. Il y a aussi des prix en espèces par équipes (K20: 180€/120€/80€; K13: 120€/80€/40€).",
        },
        de: {
          question: "Gibt es Preise für die Teilnehmer?",
          answer:
            "Ja! Es gibt Preise für Trail Lang K20 und Trail Kurz K13: die ersten 3 Männer und Frauen in der Gesamtwertung, die ersten 3 in jeder Alterskategorie und die ersten 3 Teams. Es gibt auch Geldpreise für Teams (K20: 180€/120€/80€; K13: 120€/80€/40€).",
        },
        it: {
          question: "Ci sono premi per i partecipanti?",
          answer:
            "Sì! Ci sono premi per Trail Lungo K20 e Trail Corto K13: i primi 3 uomini e donne nella classifica generale, i primi 3 di ogni categoria di età e le prime 3 squadre. Ci sono anche premi in denaro per squadre (K20: €180/€120/€80; K13: €120/€80/€40).",
        },
      },
    },
  ];

  for (const faqData of faqs) {
    const faq = await prisma.eventFAQ.create({
      data: {
        eventId: event.id,
        question: faqData.question,
        answer: faqData.answer,
      },
    });

    // Create FAQ translations
    for (const [lang, trans] of Object.entries(faqData.translations)) {
      await prisma.eventFAQTranslation.create({
        data: {
          faqId: faq.id,
          language: lang as "pt" | "en" | "es" | "fr" | "de" | "it",
          question: trans.question,
          answer: trans.answer,
        },
      });
    }
  }

  console.log(`   ✅ Created ${faqs.length} FAQs with translations`);

  // Summary
  console.log("\n🎉 IV Trail Trilhos dos Cornos 2026 seeded successfully!");
  console.log(`   📍 Event: IV Trail Trilhos dos Cornos`);
  console.log(`   🔗 Slug: ${event.slug}`);
  console.log(`   📅 Date: 2026-03-01`);
  console.log(`   📍 Location: Adões, Barcouço, Mealhada, Portugal`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding event:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
