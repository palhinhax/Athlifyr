/**
 * Seed: VIII Trail Iberlince de Barrancos 2026
 * Complete with translations in all 6 languages, FAQs and SEO
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🐆 Seeding VIII Trail Iberlince de Barrancos 2026...");

  const eventSlug = "trail-iberlince-barrancos-2026";

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
      title: "VIII Trail Iberlince de Barrancos",
      description:
        "Evento de preservação do lince-ibérico em Portugal com Trail Sprint 17km, Mini Trail 10km e Caminhada 10km pelos trilhos de Barrancos.",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-02-07T17:00:00.000Z"),
      endDate: null,
      city: "Barrancos",
      country: "Portugal",
      latitude: 38.1349,
      longitude: -6.9756,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Pra%C3%A7a+da+Liberdade+Barrancos+Portugal",
      externalUrl: "https://acorrer.pt/eventos/3904/info",
      imageUrl:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=800&fit=crop",
      isFeatured: false,
      registrationDeadline: new Date("2026-01-31T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "VIII Trail Iberlince de Barrancos",
      description:
        "Evento de preservação do lince-ibérico em Portugal com Trail Sprint 17km, Mini Trail 10km e Caminhada 10km pelos trilhos de Barrancos.",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-02-07T17:00:00.000Z"),
      endDate: null,
      city: "Barrancos",
      country: "Portugal",
      latitude: 38.1349,
      longitude: -6.9756,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Pra%C3%A7a+da+Liberdade+Barrancos+Portugal",
      externalUrl: "https://acorrer.pt/eventos/3904/info",
      imageUrl:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=800&fit=crop",
      isFeatured: false,
      registrationDeadline: new Date("2026-01-31T23:59:59.000Z"),
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
      title: "VIII Trail Iberlince de Barrancos",
      city: "Barrancos",
      metaTitle:
        "VIII Trail Iberlince de Barrancos 2026 | Barrancos, Beja | 7 Fevereiro",
      metaDescription:
        "VIII Trail Iberlince de Barrancos 2026 - 7 de fevereiro em Barrancos. Trail Sprint 17km (15€), Mini Trail 10km (12€) e Caminhada 10km (10€). Evento de preservação do lince-ibérico.",
      description: `# 🐆 VIII Trail Iberlince de Barrancos 2026

O **VIII Trail Iberlince de Barrancos** é um evento desportivo e de sensibilização ambiental dedicado à preservação do **lince-ibérico** em Portugal. Organizado pelo **Clube Linces de Noudar - Barrancos**, realiza-se no concelho de Barrancos, na fronteira com Espanha.

O Sítio Moura/Barrancos é uma das áreas de ocorrência histórica de lince-ibérico, onde se pode encontrar o habitat adequado à sua presença, o bosque mediterrânico. Este evento procura sensibilizar a população para a necessidade da preservação do lince-ibérico em Portugal.

## 📅 Data e Local

- **Data:** 7 de fevereiro de 2026 (Sábado)
- **Hora de Partida:** 17:00
- **Local de Partida/Chegada:** Praça da Liberdade, Barrancos
- **Distrito:** Beja

## 🏃 Provas Disponíveis

### Trail Sprint 17km - 15€
- **Distância:** 17km
- **Tempo Limite:** 4 horas
- **Idade Mínima:** 18 anos (excecionalmente 16-17 anos com termo de responsabilidade)

### Mini Trail 10km - 12€
- **Distância:** 10km
- **Tempo Limite:** 3 horas
- **Idade Mínima:** 18 anos (excecionalmente 16-17 anos com termo de responsabilidade)

### Caminhada 10km - 10€
- **Distância:** 10km
- **Tempo Limite:** 3 horas
- Aberta a todas as idades (menores de 16 anos acompanhados por adulto)

## 🎒 Material Obrigatório

**Para Trail:**
- Reservatório de água (não há copos nos abastecimentos)
- Manta térmica
- Frontal (prova decorre parcialmente à noite)
- Corta-vento

**Para Caminhada:**
- Reservatório de água
- Frontal

**Material Aconselhável:** Telemóvel, apito

## 🎁 A Inscrição Inclui

- ✅ Dorsal
- ✅ Seguro de acidentes pessoais
- ✅ Abastecimentos líquidos e sólidos
- ✅ Prémio "Finalista" para quem concluir a prova
- ✅ Brindes da organização
- ✅ Duches após a prova
- ✅ Possibilidade de pernoita em solo duro
- ✅ "A Caminhada Mais Divertida do Mundo" (domingo)

## 📍 Secretariado

**Sexta-feira, 6 de fevereiro:**
- 17:00 - 23:00 (Casa das Associações)

**Sábado, 7 de fevereiro:**
- A partir das 09:00 (Praça da Liberdade)

## 🎖️ Prémios

- Prémios simbólicos para os 5 primeiros classificados da geral (Masculino/Feminino)
- Prémio para a equipa mais numerosa
- Prémio finalista para todos os participantes

## 📧 Contacto

- **Telemóvel:** 961 855 610
- **Organização:** Clube Linces de Noudar - Barrancos`,
    },
    {
      language: "en",
      title: "VIII Trail Iberlince de Barrancos",
      city: "Barrancos",
      metaTitle:
        "VIII Trail Iberlince de Barrancos 2026 | Barrancos, Alentejo | February 7",
      metaDescription:
        "VIII Trail Iberlince de Barrancos 2026 - February 7 in Barrancos. Trail Sprint 17km (€15), Mini Trail 10km (€12) and Walk 10km (€10). Iberian lynx conservation event.",
      description: `# 🐆 VIII Trail Iberlince de Barrancos 2026

The **VIII Trail Iberlince de Barrancos** is a sporting and environmental awareness event dedicated to the preservation of the **Iberian lynx** in Portugal. Organized by **Clube Linces de Noudar - Barrancos**, it takes place in the municipality of Barrancos, on the border with Spain.

The Moura/Barrancos Site is one of the historic occurrence areas of the Iberian lynx, where the suitable habitat for its presence can be found, the Mediterranean forest. This event seeks to raise awareness of the need to preserve the Iberian lynx in Portugal.

## 📅 Date and Location

- **Date:** February 7, 2026 (Saturday)
- **Start Time:** 5:00 PM
- **Start/Finish Location:** Praça da Liberdade, Barrancos
- **District:** Beja

## 🏃 Available Races

### Trail Sprint 17km - €15
- **Distance:** 17km
- **Time Limit:** 4 hours
- **Minimum Age:** 18 years (exceptionally 16-17 years with responsibility waiver)

### Mini Trail 10km - €12
- **Distance:** 10km
- **Time Limit:** 3 hours
- **Minimum Age:** 18 years (exceptionally 16-17 years with responsibility waiver)

### Walk 10km - €10
- **Distance:** 10km
- **Time Limit:** 3 hours
- Open to all ages (under 16s must be accompanied by an adult)

## 🎒 Mandatory Equipment

**For Trail:**
- Water reservoir (no cups at aid stations)
- Thermal blanket
- Headlamp (race runs partially at night)
- Windbreaker

**For Walk:**
- Water reservoir
- Headlamp

**Recommended Equipment:** Mobile phone, whistle

## 🎁 Registration Includes

- ✅ Race bib
- ✅ Personal accident insurance
- ✅ Liquid and solid aid stations
- ✅ "Finisher" prize for those who complete the race
- ✅ Organization gifts
- ✅ Showers after the race
- ✅ Possibility of overnight stay on hard floor
- ✅ "The World's Most Fun Walk" (Sunday)

## 📍 Race Office

**Friday, February 6:**
- 5:00 PM - 11:00 PM (Casa das Associações)

**Saturday, February 7:**
- From 9:00 AM (Praça da Liberdade)

## 🎖️ Awards

- Symbolic prizes for the top 5 overall finishers (Male/Female)
- Prize for the largest team
- Finisher prize for all participants

## 📧 Contact

- **Phone:** 961 855 610
- **Organization:** Clube Linces de Noudar - Barrancos`,
    },
    {
      language: "es",
      title: "VIII Trail Iberlince de Barrancos",
      city: "Barrancos",
      metaTitle:
        "VIII Trail Iberlince de Barrancos 2026 | Barrancos, Beja | 7 Febrero",
      metaDescription:
        "VIII Trail Iberlince de Barrancos 2026 - 7 de febrero en Barrancos. Trail Sprint 17km (15€), Mini Trail 10km (12€) y Caminata 10km (10€). Evento de conservación del lince ibérico.",
      description: `# 🐆 VIII Trail Iberlince de Barrancos 2026

El **VIII Trail Iberlince de Barrancos** es un evento deportivo y de concienciación ambiental dedicado a la preservación del **lince ibérico** en Portugal. Organizado por el **Clube Linces de Noudar - Barrancos**, se celebra en el municipio de Barrancos, en la frontera con España.

El Sitio Moura/Barrancos es una de las áreas de ocurrencia histórica del lince ibérico, donde se puede encontrar el hábitat adecuado para su presencia, el bosque mediterráneo. Este evento busca sensibilizar a la población sobre la necesidad de preservar el lince ibérico en Portugal.

## 📅 Fecha y Lugar

- **Fecha:** 7 de febrero de 2026 (Sábado)
- **Hora de Salida:** 17:00
- **Lugar de Salida/Llegada:** Praça da Liberdade, Barrancos
- **Distrito:** Beja

## 🏃 Carreras Disponibles

### Trail Sprint 17km - 15€
- **Distancia:** 17km
- **Tiempo Límite:** 4 horas
- **Edad Mínima:** 18 años (excepcionalmente 16-17 años con declaración de responsabilidad)

### Mini Trail 10km - 12€
- **Distancia:** 10km
- **Tiempo Límite:** 3 horas
- **Edad Mínima:** 18 años (excepcionalmente 16-17 años con declaración de responsabilidad)

### Caminata 10km - 10€
- **Distancia:** 10km
- **Tiempo Límite:** 3 horas
- Abierta a todas las edades (menores de 16 años acompañados por un adulto)

## 🎒 Equipamiento Obligatorio

**Para Trail:**
- Depósito de agua (no hay vasos en los avituallamientos)
- Manta térmica
- Frontal (la carrera transcurre parcialmente de noche)
- Cortavientos

**Para Caminata:**
- Depósito de agua
- Frontal

**Equipamiento Recomendado:** Teléfono móvil, silbato

## 🎁 La Inscripción Incluye

- ✅ Dorsal
- ✅ Seguro de accidentes personales
- ✅ Avituallamientos líquidos y sólidos
- ✅ Premio "Finalista" para quienes completen la carrera
- ✅ Regalos de la organización
- ✅ Duchas después de la carrera
- ✅ Posibilidad de pernocta en suelo duro
- ✅ "La Caminata Más Divertida del Mundo" (domingo)

## 📍 Secretaría

**Viernes, 6 de febrero:**
- 17:00 - 23:00 (Casa das Associações)

**Sábado, 7 de febrero:**
- A partir de las 09:00 (Praça da Liberdade)

## 🎖️ Premios

- Premios simbólicos para los 5 primeros clasificados de la general (Masculino/Femenino)
- Premio para el equipo más numeroso
- Premio finalista para todos los participantes

## 📧 Contacto

- **Teléfono:** 961 855 610
- **Organización:** Clube Linces de Noudar - Barrancos`,
    },
    {
      language: "fr",
      title: "VIII Trail Iberlince de Barrancos",
      city: "Barrancos",
      metaTitle:
        "VIII Trail Iberlince de Barrancos 2026 | Barrancos, Beja | 7 Février",
      metaDescription:
        "VIII Trail Iberlince de Barrancos 2026 - 7 février à Barrancos. Trail Sprint 17km (15€), Mini Trail 10km (12€) et Randonnée 10km (10€). Événement de conservation du lynx ibérique.",
      description: `# 🐆 VIII Trail Iberlince de Barrancos 2026

Le **VIII Trail Iberlince de Barrancos** est un événement sportif et de sensibilisation environnementale dédié à la préservation du **lynx ibérique** au Portugal. Organisé par le **Clube Linces de Noudar - Barrancos**, il se déroule dans la municipalité de Barrancos, à la frontière avec l'Espagne.

Le Site Moura/Barrancos est l'une des zones d'occurrence historique du lynx ibérique, où l'on peut trouver l'habitat adapté à sa présence, la forêt méditerranéenne. Cet événement vise à sensibiliser la population à la nécessité de préserver le lynx ibérique au Portugal.

## 📅 Date et Lieu

- **Date:** 7 février 2026 (Samedi)
- **Heure de Départ:** 17h00
- **Lieu de Départ/Arrivée:** Praça da Liberdade, Barrancos
- **District:** Beja

## 🏃 Courses Disponibles

### Trail Sprint 17km - 15€
- **Distance:** 17km
- **Temps Limite:** 4 heures
- **Âge Minimum:** 18 ans (exceptionnellement 16-17 ans avec déclaration de responsabilité)

### Mini Trail 10km - 12€
- **Distance:** 10km
- **Temps Limite:** 3 heures
- **Âge Minimum:** 18 ans (exceptionnellement 16-17 ans avec déclaration de responsabilité)

### Randonnée 10km - 10€
- **Distance:** 10km
- **Temps Limite:** 3 heures
- Ouverte à tous les âges (moins de 16 ans accompagnés d'un adulte)

## 🎒 Équipement Obligatoire

**Pour Trail:**
- Réservoir d'eau (pas de gobelets aux ravitaillements)
- Couverture de survie
- Frontale (la course se déroule partiellement de nuit)
- Coupe-vent

**Pour Randonnée:**
- Réservoir d'eau
- Frontale

**Équipement Recommandé:** Téléphone portable, sifflet

## 🎁 L'Inscription Comprend

- ✅ Dossard
- ✅ Assurance accidents personnels
- ✅ Ravitaillements liquides et solides
- ✅ Prix "Finisher" pour ceux qui terminent la course
- ✅ Cadeaux de l'organisation
- ✅ Douches après la course
- ✅ Possibilité de nuit sur sol dur
- ✅ "La Randonnée la Plus Amusante du Monde" (dimanche)

## 📍 Secrétariat

**Vendredi 6 février:**
- 17h00 - 23h00 (Casa das Associações)

**Samedi 7 février:**
- À partir de 09h00 (Praça da Liberdade)

## 🎖️ Prix

- Prix symboliques pour les 5 premiers du classement général (Hommes/Femmes)
- Prix pour l'équipe la plus nombreuse
- Prix finisher pour tous les participants

## 📧 Contact

- **Téléphone:** 961 855 610
- **Organisation:** Clube Linces de Noudar - Barrancos`,
    },
    {
      language: "de",
      title: "VIII Trail Iberlince de Barrancos",
      city: "Barrancos",
      metaTitle:
        "VIII Trail Iberlince de Barrancos 2026 | Barrancos, Beja | 7. Februar",
      metaDescription:
        "VIII Trail Iberlince de Barrancos 2026 - 7. Februar in Barrancos. Trail Sprint 17km (15€), Mini Trail 10km (12€) und Wanderung 10km (10€). Naturschutzveranstaltung für den Iberischen Luchs.",
      description: `# 🐆 VIII Trail Iberlince de Barrancos 2026

Der **VIII Trail Iberlince de Barrancos** ist eine Sport- und Umweltveranstaltung, die dem Schutz des **Iberischen Luchses** in Portugal gewidmet ist. Organisiert vom **Clube Linces de Noudar - Barrancos**, findet er in der Gemeinde Barrancos an der Grenze zu Spanien statt.

Das Moura/Barrancos-Gebiet ist eines der historischen Vorkommensgebiete des Iberischen Luchses, wo der für seine Präsenz geeignete Lebensraum, der mediterrane Wald, zu finden ist. Diese Veranstaltung möchte die Bevölkerung für die Notwendigkeit der Erhaltung des Iberischen Luchses in Portugal sensibilisieren.

## 📅 Datum und Ort

- **Datum:** 7. Februar 2026 (Samstag)
- **Startzeit:** 17:00 Uhr
- **Start-/Zielort:** Praça da Liberdade, Barrancos
- **Bezirk:** Beja

## 🏃 Verfügbare Rennen

### Trail Sprint 17km - 15€
- **Distanz:** 17km
- **Zeitlimit:** 4 Stunden
- **Mindestalter:** 18 Jahre (ausnahmsweise 16-17 Jahre mit Haftungserklärung)

### Mini Trail 10km - 12€
- **Distanz:** 10km
- **Zeitlimit:** 3 Stunden
- **Mindestalter:** 18 Jahre (ausnahmsweise 16-17 Jahre mit Haftungserklärung)

### Wanderung 10km - 10€
- **Distanz:** 10km
- **Zeitlimit:** 3 Stunden
- Offen für alle Altersgruppen (unter 16 Jahren in Begleitung eines Erwachsenen)

## 🎒 Pflichtausrüstung

**Für Trail:**
- Wasserbehälter (keine Becher an den Verpflegungsstationen)
- Rettungsdecke
- Stirnlampe (Rennen findet teilweise nachts statt)
- Windjacke

**Für Wanderung:**
- Wasserbehälter
- Stirnlampe

**Empfohlene Ausrüstung:** Mobiltelefon, Pfeife

## 🎁 Die Anmeldung beinhaltet

- ✅ Startnummer
- ✅ Persönliche Unfallversicherung
- ✅ Flüssige und feste Verpflegung
- ✅ "Finisher"-Preis für alle, die das Rennen beenden
- ✅ Geschenke der Organisation
- ✅ Duschen nach dem Rennen
- ✅ Möglichkeit zur Übernachtung auf hartem Boden
- ✅ "Die Lustigste Wanderung der Welt" (Sonntag)

## 📍 Wettkampfbüro

**Freitag, 6. Februar:**
- 17:00 - 23:00 Uhr (Casa das Associações)

**Samstag, 7. Februar:**
- Ab 09:00 Uhr (Praça da Liberdade)

## 🎖️ Auszeichnungen

- Symbolische Preise für die Top 5 der Gesamtwertung (Männer/Frauen)
- Preis für das größte Team
- Finisher-Preis für alle Teilnehmer

## 📧 Kontakt

- **Telefon:** 961 855 610
- **Organisation:** Clube Linces de Noudar - Barrancos`,
    },
    {
      language: "it",
      title: "VIII Trail Iberlince de Barrancos",
      city: "Barrancos",
      metaTitle:
        "VIII Trail Iberlince de Barrancos 2026 | Barrancos, Beja | 7 Febbraio",
      metaDescription:
        "VIII Trail Iberlince de Barrancos 2026 - 7 febbraio a Barrancos. Trail Sprint 17km (15€), Mini Trail 10km (12€) e Camminata 10km (10€). Evento di conservazione della lince iberica.",
      description: `# 🐆 VIII Trail Iberlince de Barrancos 2026

Il **VIII Trail Iberlince de Barrancos** è un evento sportivo e di sensibilizzazione ambientale dedicato alla conservazione della **lince iberica** in Portogallo. Organizzato dal **Clube Linces de Noudar - Barrancos**, si svolge nel comune di Barrancos al confine con la Spagna.

L'area Moura/Barrancos è una delle aree storiche di presenza della lince iberica, dove si trova l'habitat adatto alla sua esistenza, il bosco mediterraneo. Questo evento intende sensibilizzare la popolazione sulla necessità di conservare la lince iberica in Portogallo.

## 📅 Data e Luogo

- **Data:** 7 febbraio 2026 (Sabato)
- **Orario di Partenza:** 17:00
- **Partenza/Arrivo:** Praça da Liberdade, Barrancos
- **Distretto:** Beja

## 🏃 Gare Disponibili

### Trail Sprint 17km - 15€
- **Distanza:** 17km
- **Tempo Limite:** 4 ore
- **Età Minima:** 18 anni (eccezionalmente 16-17 anni con liberatoria)

### Mini Trail 10km - 12€
- **Distanza:** 10km
- **Tempo Limite:** 3 ore
- **Età Minima:** 18 anni (eccezionalmente 16-17 anni con liberatoria)

### Camminata 10km - 10€
- **Distanza:** 10km
- **Tempo Limite:** 3 ore
- Aperta a tutte le età (minori di 16 anni accompagnati da un adulto)

## 🎒 Materiale Obbligatorio

**Per Trail:**
- Contenitore per acqua (niente bicchieri ai ristori)
- Coperta termica
- Lampada frontale (la gara si svolge parzialmente di notte)
- Giacca antivento

**Per Camminata:**
- Contenitore per acqua
- Lampada frontale

**Materiale Consigliato:** Telefono cellulare, fischietto

## 🎁 L'Iscrizione Include

- ✅ Pettorale
- ✅ Assicurazione infortuni personale
- ✅ Ristoro liquido e solido
- ✅ Premio "Finisher" per tutti coloro che completano la gara
- ✅ Omaggi dell'organizzazione
- ✅ Docce post-gara
- ✅ Possibilità di pernottamento su superficie rigida
- ✅ "La Camminata più Divertente del Mondo" (Domenica)

## 📍 Segreteria

**Venerdì 6 febbraio:**
- 17:00 - 23:00 (Casa das Associações)

**Sabato 7 febbraio:**
- Dalle 09:00 (Praça da Liberdade)

## 🎖️ Premi

- Premi simbolici per i primi 5 della classifica generale (maschile/femminile)
- Premio per la squadra più numerosa
- Premio finisher per tutti i partecipanti

## 📧 Contatto

- **Telefono:** 961 855 610
- **Organizzazione:** Clube Linces de Noudar - Barrancos`,
    },
  ];

  for (const translation of translations) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: translation.language,
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
        language: translation.language,
        title: translation.title,
        description: translation.description,
        city: translation.city,
        metaTitle: translation.metaTitle,
        metaDescription: translation.metaDescription,
      },
    });
  }

  console.log(
    "📝 Translations upserted for 6 languages (pt, en, es, fr, de, it)"
  );

  // Step 4: Create variants
  console.log("🏃 Creating variants...");

  // Variant 1: Trail Sprint 17km
  const trailSprint = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Trail Sprint 17km",
      distanceKm: 17,
      elevationGainM: 500,
      elevationLossM: 500,
      cutoffTimeHours: 4.0,
      startTime: "17:00",
      price: 15.0,
      currency: "EUR",
    },
  });

  const trailSprintTranslations = [
    {
      language: "pt" as const,
      name: "Trail Sprint 17km",
      description:
        "Prova competitiva de 17km com desnível positivo de aproximadamente 500m D+. Percurso técnico por trilhos e caminhos do montado alentejano. Tempo limite: 4 horas. Aberta a maiores de 18 anos.",
    },
    {
      language: "en" as const,
      name: "Trail Sprint 17km",
      description:
        "Competitive 17km race with positive elevation gain of approximately 500m D+. Technical course through trails and paths of the Alentejo cork oak forest. Time limit: 4 hours. Open to participants 18 and over.",
    },
    {
      language: "es" as const,
      name: "Trail Sprint 17km",
      description:
        "Carrera competitiva de 17km con desnivel positivo de aproximadamente 500m D+. Recorrido técnico por senderos y caminos del alcornocal alentejano. Tiempo límite: 4 horas. Abierta a mayores de 18 años.",
    },
    {
      language: "fr" as const,
      name: "Trail Sprint 17km",
      description:
        "Course compétitive de 17km avec un dénivelé positif d'environ 500m D+. Parcours technique à travers les sentiers de la forêt de chênes-lièges de l'Alentejo. Temps limite: 4 heures. Ouverte aux participants de 18 ans et plus.",
    },
    {
      language: "de" as const,
      name: "Trail Sprint 17km",
      description:
        "Wettkampfrennen über 17km mit einem positiven Höhenunterschied von etwa 500m D+. Technischer Parcours durch Pfade des Alentejo-Korkeichenwaldes. Zeitlimit: 4 Stunden. Offen für Teilnehmer ab 18 Jahren.",
    },
    {
      language: "it" as const,
      name: "Trail Sprint 17km",
      description:
        "Gara competitiva di 17km con dislivello positivo di circa 500m D+. Percorso tecnico attraverso sentieri della foresta di querce da sughero dell'Alentejo. Tempo limite: 4 ore. Aperta a partecipanti dai 18 anni.",
    },
  ];

  for (const translation of trailSprintTranslations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: trailSprint.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: trailSprint.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  console.log("   ✅ Trail Sprint 17km created");

  // Variant 2: Mini Trail 10km
  const miniTrail = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Mini Trail 10km",
      distanceKm: 10,
      elevationGainM: 300,
      elevationLossM: 300,
      cutoffTimeHours: 3.0,
      startTime: "17:00",
      price: 12.0,
      currency: "EUR",
    },
  });

  const miniTrailTranslations = [
    {
      language: "pt" as const,
      name: "Mini Trail 10km",
      description:
        "Prova de 10km com desnível positivo de aproximadamente 300m D+. Pode ser feita de forma competitiva ou participativa. Ideal para quem está a começar no trail running. Tempo limite: 3 horas.",
    },
    {
      language: "en" as const,
      name: "Mini Trail 10km",
      description:
        "10km race with positive elevation gain of approximately 300m D+. Can be done competitively or as participation. Ideal for those starting in trail running. Time limit: 3 hours.",
    },
    {
      language: "es" as const,
      name: "Mini Trail 10km",
      description:
        "Carrera de 10km con desnivel positivo de aproximadamente 300m D+. Se puede hacer de forma competitiva o participativa. Ideal para quienes empiezan en el trail running. Tiempo límite: 3 horas.",
    },
    {
      language: "fr" as const,
      name: "Mini Trail 10km",
      description:
        "Course de 10km avec un dénivelé positif d'environ 300m D+. Peut être fait de manière compétitive ou participative. Idéal pour ceux qui débutent dans le trail running. Temps limite: 3 heures.",
    },
    {
      language: "de" as const,
      name: "Mini Trail 10km",
      description:
        "10km Rennen mit einem positiven Höhenunterschied von etwa 300m D+. Kann als Wettkampf oder als Teilnahme absolviert werden. Ideal für Trail-Running-Einsteiger. Zeitlimit: 3 Stunden.",
    },
    {
      language: "it" as const,
      name: "Mini Trail 10km",
      description:
        "Gara di 10km con dislivello positivo di circa 300m D+. Può essere fatta in modo competitivo o partecipativo. Ideale per chi inizia nel trail running. Tempo limite: 3 ore.",
    },
  ];

  for (const translation of miniTrailTranslations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: miniTrail.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: miniTrail.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  console.log("   ✅ Mini Trail 10km created");

  // Variant 3: Caminhada 10km
  const caminhada = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Caminhada 10km",
      distanceKm: 10,
      elevationGainM: 300,
      elevationLossM: 300,
      cutoffTimeHours: 3.0,
      startTime: "17:00",
      price: 10.0,
      currency: "EUR",
    },
  });

  const caminhadaTranslations = [
    {
      language: "pt" as const,
      name: "Caminhada 10km",
      description:
        "Caminhada não competitiva de 10km com desnível positivo de aproximadamente 300m D+. Aberta a todos os participantes, ideal para desfrutar da natureza e paisagens do Alentejo. Tempo limite: 3 horas.",
    },
    {
      language: "en" as const,
      name: "Walk 10km",
      description:
        "Non-competitive 10km walk with positive elevation gain of approximately 300m D+. Open to all participants, ideal for enjoying nature and the landscapes of the Alentejo. Time limit: 3 hours.",
    },
    {
      language: "es" as const,
      name: "Caminata 10km",
      description:
        "Caminata no competitiva de 10km con desnivel positivo de aproximadamente 300m D+. Abierta a todos los participantes, ideal para disfrutar de la naturaleza y paisajes del Alentejo. Tiempo límite: 3 horas.",
    },
    {
      language: "fr" as const,
      name: "Randonnée 10km",
      description:
        "Randonnée non compétitive de 10km avec un dénivelé positif d'environ 300m D+. Ouverte à tous les participants, idéale pour profiter de la nature et des paysages de l'Alentejo. Temps limite: 3 heures.",
    },
    {
      language: "de" as const,
      name: "Wanderung 10km",
      description:
        "Nicht-wettkampfmäßige 10km Wanderung mit einem positiven Höhenunterschied von etwa 300m D+. Offen für alle Teilnehmer, ideal um die Natur und Landschaften des Alentejo zu genießen. Zeitlimit: 3 Stunden.",
    },
    {
      language: "it" as const,
      name: "Camminata 10km",
      description:
        "Camminata non competitiva di 10km con dislivello positivo di circa 300m D+. Aperta a tutti i partecipanti, ideale per godersi la natura e i paesaggi dell'Alentejo. Tempo limite: 3 ore.",
    },
  ];

  for (const translation of caminhadaTranslations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: caminhada.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: caminhada.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  console.log("   ✅ Caminhada 10km created");

  // Step 5: Create pricing phases (linked to eventId, NOT variantId)
  // Nota: Segundo o regulamento, os preços são únicos (não há fases)
  console.log("💰 Creating pricing phases...");

  await prisma.pricingPhase.create({
    data: {
      eventId: event.id,
      name: "Trail Sprint 17km",
      startDate: new Date("2025-12-10T00:00:00.000Z"),
      endDate: new Date("2026-01-31T23:59:59.000Z"),
      price: 15.0,
      currency: "EUR",
    },
  });

  await prisma.pricingPhase.create({
    data: {
      eventId: event.id,
      name: "Mini Trail 10km",
      startDate: new Date("2025-12-10T00:00:00.000Z"),
      endDate: new Date("2026-01-31T23:59:59.000Z"),
      price: 12.0,
      currency: "EUR",
    },
  });

  await prisma.pricingPhase.create({
    data: {
      eventId: event.id,
      name: "Caminhada 10km",
      startDate: new Date("2025-12-10T00:00:00.000Z"),
      endDate: new Date("2026-01-31T23:59:59.000Z"),
      price: 10.0,
      currency: "EUR",
    },
  });

  console.log("   ✅ Pricing phases created (3 phases for 3 variants)");

  // Step 6: Create FAQs with translations
  console.log("❓ Creating FAQs...");

  const faqs = [
    {
      order: 1,
      question: "O que está incluído na inscrição?",
      answer:
        "A inscrição inclui: dorsal personalizado, seguro desportivo, t-shirt técnica alusiva ao evento, abastecimentos durante a prova, refeição pós-prova e medalha finisher.",
      translations: {
        pt: {
          question: "O que está incluído na inscrição?",
          answer:
            "A inscrição inclui: dorsal personalizado, seguro desportivo, t-shirt técnica alusiva ao evento, abastecimentos durante a prova, refeição pós-prova e medalha finisher.",
        },
        en: {
          question: "What is included in the registration?",
          answer:
            "Registration includes: personalized race bib, sports insurance, technical event t-shirt, aid stations during the race, post-race meal and finisher medal.",
        },
        es: {
          question: "¿Qué está incluido en la inscripción?",
          answer:
            "La inscripción incluye: dorsal personalizado, seguro deportivo, camiseta técnica del evento, avituallamientos durante la carrera, comida post-carrera y medalla finisher.",
        },
        fr: {
          question: "Qu'est-ce qui est inclus dans l'inscription?",
          answer:
            "L'inscription comprend: dossard personnalisé, assurance sportive, t-shirt technique de l'événement, ravitaillements pendant la course, repas après la course et médaille finisher.",
        },
        de: {
          question: "Was ist in der Anmeldung enthalten?",
          answer:
            "Die Anmeldung beinhaltet: personalisierte Startnummer, Sportversicherung, technisches Event-T-Shirt, Verpflegungsstationen während des Rennens, Mahlzeit nach dem Rennen und Finisher-Medaille.",
        },
        it: {
          question: "Cosa è incluso nell'iscrizione?",
          answer:
            "L'iscrizione include: pettorale personalizzato, assicurazione sportiva, maglietta tecnica dell'evento, ristori durante la gara, pasto post-gara e medaglia finisher.",
        },
      },
    },
    {
      order: 2,
      question: "Qual é o tempo limite para as provas?",
      answer:
        "O tempo limite é de 4 horas para o Trail Sprint 17km e 3 horas para o Mini Trail 10km e Caminhada 10km. Os participantes que ultrapassarem este limite não serão classificados oficialmente.",
      translations: {
        pt: {
          question: "Qual é o tempo limite para as provas?",
          answer:
            "O tempo limite é de 4 horas para o Trail Sprint 17km e 3 horas para o Mini Trail 10km e Caminhada 10km. Os participantes que ultrapassarem este limite não serão classificados oficialmente.",
        },
        en: {
          question: "What is the time limit for the races?",
          answer:
            "The time limit is 4 hours for the Trail Sprint 17km and 3 hours for the Mini Trail 10km and Walk 10km. Participants who exceed this limit will not be officially ranked.",
        },
        es: {
          question: "¿Cuál es el tiempo límite para las carreras?",
          answer:
            "El tiempo límite es de 4 horas para el Trail Sprint 17km y 3 horas para el Mini Trail 10km y Caminata 10km. Los participantes que superen este límite no serán clasificados oficialmente.",
        },
        fr: {
          question: "Quelle est la limite de temps pour les courses?",
          answer:
            "La limite de temps est de 4 heures pour le Trail Sprint 17km et 3 heures pour le Mini Trail 10km et Randonnée 10km. Les participants qui dépassent cette limite ne seront pas classés officiellement.",
        },
        de: {
          question: "Was ist das Zeitlimit für die Rennen?",
          answer:
            "Das Zeitlimit beträgt 4 Stunden für den Trail Sprint 17km und 3 Stunden für den Mini Trail 10km und die Wanderung 10km. Teilnehmer, die dieses Limit überschreiten, werden nicht offiziell gewertet.",
        },
        it: {
          question: "Qual è il tempo limite per le gare?",
          answer:
            "Il tempo limite è di 4 ore per il Trail Sprint 17km e 3 ore per il Mini Trail 10km e Camminata 10km. I partecipanti che superano questo limite non saranno classificati ufficialmente.",
        },
      },
    },
    {
      order: 3,
      question: "O que é o lince-ibérico e qual a ligação com o evento?",
      answer:
        "O lince-ibérico é o felino mais ameaçado da Europa. A região de Barrancos é uma das áreas de reintrodução desta espécie emblemática. O Trail Iberlince sensibiliza para a sua preservação e parte das receitas das inscrições reverte para projetos de conservação.",
      translations: {
        pt: {
          question: "O que é o lince-ibérico e qual a ligação com o evento?",
          answer:
            "O lince-ibérico é o felino mais ameaçado da Europa. A região de Barrancos é uma das áreas de reintrodução desta espécie emblemática. O Trail Iberlince sensibiliza para a sua preservação e parte das receitas das inscrições reverte para projetos de conservação.",
        },
        en: {
          question:
            "What is the Iberian lynx and what is its connection to the event?",
          answer:
            "The Iberian lynx is Europe's most endangered feline. The Barrancos region is one of the reintroduction areas for this iconic species. Trail Iberlince raises awareness for its preservation and part of the registration fees goes to conservation projects.",
        },
        es: {
          question:
            "¿Qué es el lince ibérico y cuál es su relación con el evento?",
          answer:
            "El lince ibérico es el felino más amenazado de Europa. La región de Barrancos es una de las áreas de reintroducción de esta especie emblemática. Trail Iberlince sensibiliza sobre su preservación y parte de los ingresos de las inscripciones se destina a proyectos de conservación.",
        },
        fr: {
          question:
            "Qu'est-ce que le lynx ibérique et quel est son lien avec l'événement?",
          answer:
            "Le lynx ibérique est le félin le plus menacé d'Europe. La région de Barrancos est l'une des zones de réintroduction de cette espèce emblématique. Trail Iberlince sensibilise à sa préservation et une partie des frais d'inscription est reversée aux projets de conservation.",
        },
        de: {
          question:
            "Was ist der Iberische Luchs und welche Verbindung hat er zur Veranstaltung?",
          answer:
            "Der Iberische Luchs ist Europas am stärksten bedrohte Katze. Die Region Barrancos ist eines der Wiederansiedlungsgebiete dieser emblematischen Art. Trail Iberlince sensibilisiert für seinen Schutz und ein Teil der Anmeldegebühren fließt in Schutzprojekte.",
        },
        it: {
          question:
            "Cos'è la lince iberica e qual è il suo legame con l'evento?",
          answer:
            "La lince iberica è il felino più minacciato d'Europa. La regione di Barrancos è una delle aree di reintroduzione di questa specie emblematica. Trail Iberlince sensibilizza sulla sua conservazione e parte delle quote di iscrizione viene destinata a progetti di conservazione.",
        },
      },
    },
    {
      order: 4,
      question: "Onde posso levantar o meu dorsal?",
      answer:
        "O levantamento de dorsais decorrerá no dia do evento em Barrancos, a partir das 14:00. Recomendamos chegar com antecedência para evitar filas e ter tempo de se preparar.",
      translations: {
        pt: {
          question: "Onde posso levantar o meu dorsal?",
          answer:
            "O levantamento de dorsais decorrerá no dia do evento em Barrancos, a partir das 14:00. Recomendamos chegar com antecedência para evitar filas e ter tempo de se preparar.",
        },
        en: {
          question: "Where can I pick up my race bib?",
          answer:
            "Bib pickup will take place on the event day in Barrancos, starting at 2:00 PM. We recommend arriving early to avoid queues and have time to prepare.",
        },
        es: {
          question: "¿Dónde puedo recoger mi dorsal?",
          answer:
            "La recogida de dorsales se realizará el día del evento en Barrancos, a partir de las 14:00. Recomendamos llegar con antelación para evitar colas y tener tiempo de prepararse.",
        },
        fr: {
          question: "Où puis-je récupérer mon dossard?",
          answer:
            "Le retrait des dossards aura lieu le jour de l'événement à Barrancos, à partir de 14h00. Nous recommandons d'arriver en avance pour éviter les files d'attente et avoir le temps de se préparer.",
        },
        de: {
          question: "Wo kann ich meine Startnummer abholen?",
          answer:
            "Die Startnummernausgabe findet am Veranstaltungstag in Barrancos ab 14:00 Uhr statt. Wir empfehlen, frühzeitig anzureisen, um Warteschlangen zu vermeiden und Zeit zur Vorbereitung zu haben.",
        },
        it: {
          question: "Dove posso ritirare il mio pettorale?",
          answer:
            "Il ritiro dei pettorali avverrà il giorno dell'evento a Barrancos, a partire dalle 14:00. Consigliamo di arrivare in anticipo per evitare code e avere tempo per prepararsi.",
        },
      },
    },
    {
      order: 5,
      question: "Posso participar na caminhada com crianças?",
      answer:
        "Sim, a caminhada de 10km é aberta a todos os participantes, incluindo famílias com crianças. No entanto, menores de 18 anos devem estar acompanhados por um adulto responsável.",
      translations: {
        pt: {
          question: "Posso participar na caminhada com crianças?",
          answer:
            "Sim, a caminhada de 10km é aberta a todos os participantes, incluindo famílias com crianças. No entanto, menores de 18 anos devem estar acompanhados por um adulto responsável.",
        },
        en: {
          question: "Can I participate in the walk with children?",
          answer:
            "Yes, the 10km walk is open to all participants, including families with children. However, minors under 18 must be accompanied by a responsible adult.",
        },
        es: {
          question: "¿Puedo participar en la caminata con niños?",
          answer:
            "Sí, la caminata de 10km está abierta a todos los participantes, incluidas las familias con niños. Sin embargo, los menores de 18 años deben estar acompañados por un adulto responsable.",
        },
        fr: {
          question: "Puis-je participer à la randonnée avec des enfants?",
          answer:
            "Oui, la randonnée de 10km est ouverte à tous les participants, y compris les familles avec enfants. Cependant, les mineurs de moins de 18 ans doivent être accompagnés d'un adulte responsable.",
        },
        de: {
          question: "Kann ich an der Wanderung mit Kindern teilnehmen?",
          answer:
            "Ja, die 10km Wanderung ist für alle Teilnehmer offen, einschließlich Familien mit Kindern. Minderjährige unter 18 Jahren müssen jedoch von einem verantwortlichen Erwachsenen begleitet werden.",
        },
        it: {
          question: "Posso partecipare alla camminata con i bambini?",
          answer:
            "Sì, la camminata di 10km è aperta a tutti i partecipanti, comprese le famiglie con bambini. Tuttavia, i minori di 18 anni devono essere accompagnati da un adulto responsabile.",
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
  console.log(
    "\n🎉 VIII Trail Iberlince de Barrancos 2026 seeded successfully!"
  );
  console.log(`   📍 Event: VIII Trail Iberlince de Barrancos`);
  console.log(`   🔗 Slug: ${event.slug}`);
  console.log(`   📅 Date: 2026-02-07`);
  console.log(`   📍 Location: Barrancos, Alentejo, Portugal`);
  console.log(
    `   🏃 Variants: Trail Sprint 17km, Mini Trail 10km, Caminhada 10km`
  );
  console.log(
    `   ❓ FAQs: ${faqs.length} questions with 6 language translations`
  );
}

main()
  .catch((e) => {
    console.error("❌ Error seeding event:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
