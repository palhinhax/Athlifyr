import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏖️ Seeding Tribal Clash Portugal 2026...");

  // Step 1: Delete existing event if it exists (for idempotency)
  const existingEvent = await prisma.event.findFirst({
    where: { slug: "tribal-clash-portugal-2026" },
  });

  if (existingEvent) {
    console.log("   Deleting existing event and all related data...");
    // Cascade delete will handle translations, variants, pricing phases, and FAQs
    await prisma.event.delete({
      where: { id: existingEvent.id },
    });
  }

  // Step 2: Create the event with base Portuguese description
  const event = await prisma.event.create({
    data: {
      title: "Tribal Clash Portugal",
      slug: "tribal-clash-portugal-2026",
      sportTypes: [SportType.CROSSFIT, SportType.OCR],
      startDate: new Date("2026-05-02T08:30:00.000Z"),
      registrationDeadline: new Date("2026-03-31T23:59:59.000Z"),
      city: "Vilamoura",
      country: "Portugal",
      latitude: 37.08389,
      longitude: -8.12206,
      googleMapsUrl: "https://maps.google.com/?q=37.08389,-8.12206",
      externalUrl: "https://www.tribalclash.com",
      isFeatured: true,
      description: "Base description - will be overridden by translations",
    },
  });

  console.log("✅ Event created successfully!");
  console.log(`   Event ID: ${event.id}`);
  console.log(`   Event slug: ${event.slug}`);

  // Step 3: Create translations for all 6 languages
  const languages = ["pt", "en", "es", "fr", "de", "it"] as const;

  const translations = {
    pt: {
      title: "Tribal Clash Portugal 2026",
      description: `# Tribal Clash Portugal 2026

**2ª Edição - Beach Fitness Competition**

O **Tribal Clash Portugal** regressa a Vilamoura para dois dias de competição intensa na praia! Uma experiência única que combina fitness funcional, trabalho em equipa e o melhor ambiente de praia. Traga a sua tribo e prepare-se para um desafio inesquecível no Algarve!

**Data:** 2-3 de maio de 2026  
**Local:** Praia de Vilamoura, Algarve  
**Organizador:** Tribal Clash by Brand Culture  
**Limite:** 100 equipas

![Tribal Clash Beach](https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&q=80)

## 🏋️ O Que é o Tribal Clash?

O Tribal Clash é uma competição de fitness de dois dias que decorre numa arena de praia construída especialmente para o evento. Equipas de 6 atletas (3 homens + 3 mulheres) enfrentam provas cronometradas cheias de surpresas, num ambiente inclusivo e desafiante.

**Não há barbells nem ginástica avançada** - apenas movimentos funcionais e desafios únicos que testam força física, resistência cardiovascular, trabalho em equipa, adaptabilidade e determinação mental.

As provas já incluíram: **empurrar, trepar, levantar, correr, nadar, arrastar, puxar, transportar e lançar**.

## 🏆 Formato da Competição

**EQUIPAS MISTAS - 6 membros (3M / 3F)**  
**Sem divisões** - apenas UMA TRIBO!

### 📅 Horário

**Sexta-feira, 1 de maio:** 19:00 - Registo e Briefing  
**Sábado, 2 de maio:** 08:30 - 17:30 - Competição Dia 1  
**Domingo, 3 de maio:** 08:30 - 17:30 - Competição Dia 2 + 18:00 Afterparty

## 🎟️ Inscrição

**Preço:** €830 por equipa (€138.33 por pessoa)  
**Vendas abrem:** 01.02.2026 às 19:00  
**Deadline:** 31 de março de 2026  
**Pré-venda:** Disponível para capitães 2020

## 🏖️ Localização

**Praia de Vilamoura, Algarve**  
Passeio Das Dunas, Posto 5, 8125-507 Quarteira

## 🎁 Incluído

- Participação em todas as provas (2 dias)
- Arena de praia exclusiva
- T-shirt oficial + Medalha finisher
- Acesso à Afterparty
- Ambiente de festival com DJs e Taiko drummers

## 🔄 Política de Reembolso

❌ Sem reembolsos, exceto se o evento for cancelado ou a data alterada.

---

💪 Beach fitness like no other | 🌊 One tribe, one beach, one unforgettable weekend`,
      city: "Vilamoura",
      metaTitle: "Tribal Clash Portugal 2026 - Vilamoura | 2-3 Maio | €830",
      metaDescription:
        "Tribal Clash Portugal 2026 na Praia de Vilamoura, Algarve. Beach fitness competition de 2 dias para equipas de 6 (3M+3F). 100 equipas. Inscrições abrem 01.02.2026.",
    },
    en: {
      title: "Tribal Clash Portugal 2026",
      description: `# Tribal Clash Portugal 2026

**2nd Edition - Beach Fitness Competition**

**Tribal Clash Portugal** returns to Vilamoura for two days of intense beach competition! A unique experience combining functional fitness, teamwork, and the best beach atmosphere. Bring your tribe and get ready for an unforgettable challenge in the Algarve!

**Date:** 2-3 May 2026  
**Location:** Vilamoura Beach, Algarve  
**Organizer:** Tribal Clash by Brand Culture  
**Limit:** 100 teams

![Tribal Clash Beach](https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&q=80)

## 🏋️ What is Tribal Clash?

Tribal Clash is a two-day fitness competition held in a purpose-built beach arena. Teams of 6 athletes (3 men + 3 women) face timed surprise challenges in an inclusive and demanding environment.

**No barbells or advanced gymnastics** - just functional movements and unique challenges testing physical strength, cardiovascular endurance, teamwork, adaptability, and mental determination.

Past events included: **pushing, climbing, lifting, running, swimming, dragging, pulling, carrying, and throwing**.

## 🏆 Competition Format

**MIXED TEAMS - 6 members (3M / 3F)**  
**No divisions** - just ONE TRIBE!

### 📅 Schedule

**Friday, 1 May:** 19:00 - Registration & Briefing  
**Saturday, 2 May:** 08:30 - 17:30 - Competition Day 1  
**Sunday, 3 May:** 08:30 - 17:30 - Competition Day 2 + 18:00 Afterparty

## 🎟️ Registration

**Price:** €830 per team (€138.33 per person)  
**Sales open:** 01.02.2026 at 19:00  
**Deadline:** 31 March 2026  
**Presale:** Available for 2020 captains

## 🏖️ Location

**Vilamoura Beach, Algarve**  
Passeio Das Dunas, Posto 5, 8125-507 Quarteira

## 🎁 Included

- Participation in all events (2 days)
- Exclusive beach arena access
- Official T-shirt + Finisher medal
- Afterparty access
- Festival atmosphere with DJs and Taiko drummers

## 🔄 Refund Policy

❌ No refunds, except if event is cancelled or date changed.

---

💪 Beach fitness like no other | 🌊 One tribe, one beach, one unforgettable weekend`,
      city: "Vilamoura",
      metaTitle: "Tribal Clash Portugal 2026 - Vilamoura | 2-3 May | €830",
      metaDescription:
        "Tribal Clash Portugal 2026 at Vilamoura Beach, Algarve. 2-day beach fitness competition for teams of 6 (3M+3F). 100 teams. Registration opens 01.02.2026.",
    },
    es: {
      title: "Tribal Clash Portugal 2026",
      description: `# Tribal Clash Portugal 2026

**2ª Edición - Beach Fitness Competition**

¡**Tribal Clash Portugal** regresa a Vilamoura para dos días de intensa competición en la playa! Una experiencia única que combina fitness funcional, trabajo en equipo y el mejor ambiente playero. ¡Trae tu tribu y prepárate para un desafío inolvidable en el Algarve!

**Fecha:** 2-3 de mayo de 2026  
**Lugar:** Playa de Vilamoura, Algarve  
**Organizador:** Tribal Clash by Brand Culture  
**Límite:** 100 equipos

![Tribal Clash Beach](https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&q=80)

## 🏋️ ¿Qué es Tribal Clash?

Tribal Clash es una competición de fitness de dos días en una arena de playa construida especialmente. Equipos de 6 atletas (3 hombres + 3 mujeres) enfrentan pruebas cronometradas sorpresa en un ambiente inclusivo y exigente.

**Sin barbells ni gimnasia avanzada** - solo movimientos funcionales y desafíos únicos que prueban fuerza física, resistencia cardiovascular, trabajo en equipo, adaptabilidad y determinación mental.

Eventos pasados incluyeron: **empujar, trepar, levantar, correr, nadar, arrastrar, tirar, transportar y lanzar**.

## 🏆 Formato de Competición

**EQUIPOS MIXTOS - 6 miembros (3M / 3F)**  
**Sin divisiones** - ¡solo UNA TRIBU!

### 📅 Horario

**Viernes, 1 de mayo:** 19:00 - Registro y Briefing  
**Sábado, 2 de mayo:** 08:30 - 17:30 - Competición Día 1  
**Domingo, 3 de mayo:** 08:30 - 17:30 - Competición Día 2 + 18:00 Afterparty

## 🎟️ Inscripción

**Precio:** €830 por equipo (€138.33 por persona)  
**Ventas abren:** 01.02.2026 a las 19:00  
**Fecha límite:** 31 de marzo de 2026  
**Preventa:** Disponible para capitanes 2020

## 🏖️ Ubicación

**Playa de Vilamoura, Algarve**  
Passeio Das Dunas, Posto 5, 8125-507 Quarteira

## 🎁 Incluido

- Participación en todos los eventos (2 días)
- Acceso exclusivo a arena de playa
- Camiseta oficial + Medalla finisher
- Acceso a Afterparty
- Ambiente de festival con DJs y Taiko drummers

## 🔄 Política de Reembolso

❌ Sin reembolsos, excepto si el evento se cancela o cambia la fecha.

---

💪 Beach fitness como ningún otro | 🌊 Una tribu, una playa, un fin de semana inolvidable`,
      city: "Vilamoura",
      metaTitle: "Tribal Clash Portugal 2026 - Vilamoura | 2-3 Mayo | €830",
      metaDescription:
        "Tribal Clash Portugal 2026 en Playa de Vilamoura, Algarve. Competición de beach fitness de 2 días para equipos de 6 (3M+3F). 100 equipos. Inscripción abre 01.02.2026.",
    },
    fr: {
      title: "Tribal Clash Portugal 2026",
      description: `# Tribal Clash Portugal 2026

**2ème Édition - Beach Fitness Competition**

Le **Tribal Clash Portugal** revient à Vilamoura pour deux jours de compétition intense sur la plage ! Une expérience unique combinant fitness fonctionnel, travail d'équipe et la meilleure ambiance de plage. Amenez votre tribu et préparez-vous pour un défi inoubliable en Algarve !

**Date:** 2-3 mai 2026  
**Lieu:** Plage de Vilamoura, Algarve  
**Organisateur:** Tribal Clash by Brand Culture  
**Limite:** 100 équipes

![Tribal Clash Beach](https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&q=80)

## 🏋️ Qu'est-ce que Tribal Clash ?

Tribal Clash est une compétition de fitness de deux jours dans une arène de plage spécialement construite. Des équipes de 6 athlètes (3 hommes + 3 femmes) affrontent des épreuves chronométrées surprises dans un environnement inclusif et exigeant.

**Pas de barbells ni de gymnastique avancée** - juste des mouvements fonctionnels et des défis uniques testant la force physique, l'endurance cardiovasculaire, le travail d'équipe, l'adaptabilité et la détermination mentale.

Les événements passés comprenaient : **pousser, grimper, soulever, courir, nager, traîner, tirer, porter et lancer**.

## 🏆 Format de Compétition

**ÉQUIPES MIXTES - 6 membres (3M / 3F)**  
**Pas de divisions** - juste UNE TRIBU !

### 📅 Horaire

**Vendredi 1er mai:** 19:00 - Inscription & Briefing  
**Samedi 2 mai:** 08:30 - 17:30 - Compétition Jour 1  
**Dimanche 3 mai:** 08:30 - 17:30 - Compétition Jour 2 + 18:00 Afterparty

## 🎟️ Inscription

**Prix:** €830 par équipe (€138.33 par personne)  
**Ventes ouvertes:** 01.02.2026 à 19:00  
**Date limite:** 31 mars 2026  
**Prévente:** Disponible pour les capitaines 2020

## 🏖️ Localisation

**Plage de Vilamoura, Algarve**  
Passeio Das Dunas, Posto 5, 8125-507 Quarteira

## 🎁 Inclus

- Participation à tous les événements (2 jours)
- Accès exclusif à l'arène de plage
- T-shirt officiel + Médaille finisher
- Accès à l'Afterparty
- Ambiance festival avec DJs et Taiko drummers

## 🔄 Politique de Remboursement

❌ Pas de remboursements, sauf si l'événement est annulé ou la date modifiée.

---

💪 Beach fitness incomparable | 🌊 Une tribu, une plage, un week-end inoubliable`,
      city: "Vilamoura",
      metaTitle: "Tribal Clash Portugal 2026 - Vilamoura | 2-3 Mai | €830",
      metaDescription:
        "Tribal Clash Portugal 2026 à Plage de Vilamoura, Algarve. Compétition beach fitness de 2 jours pour équipes de 6 (3M+3F). 100 équipes. Inscription ouvre 01.02.2026.",
    },
    de: {
      title: "Tribal Clash Portugal 2026",
      description: `# Tribal Clash Portugal 2026

**2. Ausgabe - Beach Fitness Competition**

Der **Tribal Clash Portugal** kehrt nach Vilamoura zurück für zwei Tage intensiven Strandwettbewerbs! Eine einzigartige Erfahrung, die funktionales Fitness, Teamarbeit und die beste Strandatmosphäre kombiniert. Bring deinen Stamm mit und mach dich bereit für eine unvergessliche Herausforderung an der Algarve!

**Datum:** 2-3. Mai 2026  
**Ort:** Vilamoura Strand, Algarve  
**Veranstalter:** Tribal Clash by Brand Culture  
**Limit:** 100 Teams

![Tribal Clash Beach](https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&q=80)

## 🏋️ Was ist Tribal Clash?

Tribal Clash ist ein zweitägiger Fitnesswettbewerb in einer speziell gebauten Strandarena. Teams von 6 Athleten (3 Männer + 3 Frauen) stellen sich zeitgesteuerten Überraschungs-Herausforderungen in einer inklusiven und anspruchsvollen Umgebung.

**Keine Barbells oder fortgeschrittene Gymnastik** - nur funktionale Bewegungen und einzigartige Herausforderungen, die körperliche Kraft, kardiovaskuläre Ausdauer, Teamarbeit, Anpassungsfähigkeit und mentale Entschlossenheit testen.

Frühere Events umfassten: **schieben, klettern, heben, laufen, schwimmen, ziehen, tragen und werfen**.

## 🏆 Wettbewerbsformat

**GEMISCHTE TEAMS - 6 Mitglieder (3M / 3F)**  
**Keine Divisionen** - nur EIN STAMM!

### 📅 Zeitplan

**Freitag, 1. Mai:** 19:00 - Registrierung & Briefing  
**Samstag, 2. Mai:** 08:30 - 17:30 - Wettbewerb Tag 1  
**Sonntag, 3. Mai:** 08:30 - 17:30 - Wettbewerb Tag 2 + 18:00 Afterparty

## 🎟️ Anmeldung

**Preis:** €830 pro Team (€138.33 pro Person)  
**Verkauf beginnt:** 01.02.2026 um 19:00  
**Deadline:** 31. März 2026  
**Vorverkauf:** Verfügbar für 2020 Kapitäne

## 🏖️ Standort

**Vilamoura Strand, Algarve**  
Passeio Das Dunas, Posto 5, 8125-507 Quarteira

## 🎁 Inbegriffen

- Teilnahme an allen Events (2 Tage)
- Exklusiver Strandarena-Zugang
- Offizielles T-Shirt + Finisher-Medaille
- Afterparty-Zugang
- Festival-Atmosphäre mit DJs und Taiko Drummers

## 🔄 Rückerstattungsrichtlinie

❌ Keine Rückerstattungen, außer wenn das Event abgesagt oder verschoben wird.

---

💪 Beach Fitness wie kein anderes | 🌊 Ein Stamm, ein Strand, ein unvergessliches Wochenende`,
      city: "Vilamoura",
      metaTitle: "Tribal Clash Portugal 2026 - Vilamoura | 2-3 Mai | €830",
      metaDescription:
        "Tribal Clash Portugal 2026 am Vilamoura Strand, Algarve. 2-tägiger Beach-Fitness-Wettbewerb für Teams von 6 (3M+3F). 100 Teams. Anmeldung öffnet 01.02.2026.",
    },
    it: {
      title: "Tribal Clash Portugal 2026",
      description: `# Tribal Clash Portugal 2026

**2ª Edizione - Beach Fitness Competition**

Il **Tribal Clash Portugal** torna a Vilamoura per due giorni di intensa competizione sulla spiaggia! Un'esperienza unica che combina fitness funzionale, lavoro di squadra e la migliore atmosfera da spiaggia. Porta la tua tribù e preparati per una sfida indimenticabile in Algarve!

**Data:** 2-3 maggio 2026  
**Luogo:** Spiaggia di Vilamoura, Algarve  
**Organizzatore:** Tribal Clash by Brand Culture  
**Limite:** 100 squadre

![Tribal Clash Beach](https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&q=80)

## 🏋️ Cos'è Tribal Clash?

Tribal Clash è una competizione di fitness di due giorni in un'arena da spiaggia appositamente costruita. Squadre di 6 atleti (3 uomini + 3 donne) affrontano prove cronometrate a sorpresa in un ambiente inclusivo ed esigente.

**Nessun bilanciere o ginnastica avanzata** - solo movimenti funzionali e sfide uniche che testano forza fisica, resistenza cardiovascolare, lavoro di squadra, adattabilità e determinazione mentale.

Gli eventi passati includevano: **spingere, arrampicarsi, sollevare, correre, nuotare, trascinare, tirare, trasportare e lanciare**.

## 🏆 Formato della Competizione

**SQUADRE MISTE - 6 membri (3M / 3F)**  
**Nessuna divisione** - solo UNA TRIBÙ!

### 📅 Orario

**Venerdì 1° maggio:** 19:00 - Registrazione & Briefing  
**Sabato 2 maggio:** 08:30 - 17:30 - Competizione Giorno 1  
**Domenica 3 maggio:** 08:30 - 17:30 - Competizione Giorno 2 + 18:00 Afterparty

## 🎟️ Iscrizione

**Prezzo:** €830 per squadra (€138.33 a persona)  
**Vendite aperte:** 01.02.2026 alle 19:00  
**Scadenza:** 31 marzo 2026  
**Prevendita:** Disponibile per i capitani 2020

## 🏖️ Posizione

**Spiaggia di Vilamoura, Algarve**  
Passeio Das Dunas, Posto 5, 8125-507 Quarteira

## 🎁 Incluso

- Partecipazione a tutti gli eventi (2 giorni)
- Accesso esclusivo all'arena da spiaggia
- T-shirt ufficiale + Medaglia finisher
- Accesso all'Afterparty
- Atmosfera da festival con DJ e Taiko Drummers

## 🔄 Politica di Rimborso

❌ Nessun rimborso, tranne se l'evento è annullato o la data cambiata.

---

💪 Beach fitness come nessun altro | 🌊 Una tribù, una spiaggia, un weekend indimenticabile`,
      city: "Vilamoura",
      metaTitle: "Tribal Clash Portugal 2026 - Vilamoura | 2-3 Maggio | €830",
      metaDescription:
        "Tribal Clash Portugal 2026 a Spiaggia di Vilamoura, Algarve. Competizione beach fitness di 2 giorni per squadre di 6 (3M+3F). 100 squadre. Iscrizioni aprono 01.02.2026.",
    },
  };

  for (const lang of languages) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: lang,
        },
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
        language: lang,
        title: translations[lang].title,
        description: translations[lang].description,
        city: translations[lang].city,
        metaTitle: translations[lang].metaTitle,
        metaDescription: translations[lang].metaDescription,
      },
    });
  }

  console.log(
    "📝 Translations upserted for 6 languages (pt, en, es, fr, de, it)"
  );

  // Step 4: Delete existing pricing phases to avoid duplicates
  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

  console.log("💰 Creating variant and pricing phase...");

  // Step 5: Create the variant with pricing phase
  const variant = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Mixed Team of 6 (3M + 3F)",
      distanceKm: null,
      elevationGainM: null,
      cutoffTimeHours: null,
      startDate: new Date("2026-05-02T08:30:00.000Z"),
      startTime: "08:30",
      description:
        "2-day mixed team competition for 6 athletes (3 men + 3 women). Surprise timed events in a beach arena. Includes functional movements: running, swimming, lifting, dragging, pulling, carrying, climbing and throwing. No barbells or advanced gymnastics. Accessible to all levels but challenging. Adaptability is essential. Festival atmosphere with DJs, Taiko drummers and Afterparty. Official T-shirt and finisher medal included. Registration and briefing: Friday 7pm. Competition: Saturday and Sunday 08:30-17:30. Afterparty: Sunday 6pm.",
    },
  });

  console.log(`✅ Created variant: ${variant.name}`);

  // Create pricing phase linked to eventId
  await prisma.pricingPhase.create({
    data: {
      eventId: event.id,
      name: `${variant.name} - Team Entry`,
      startDate: new Date("2026-02-01T19:00:00.000Z"),
      endDate: new Date("2026-03-31T23:59:59.000Z"),
      price: 830.0,
      currency: "EUR",
      note: "€138.33 per person (6 athletes). Presale for 2020 captains available. Non-refundable unless event date changed or cancelled.",
    },
  });

  console.log(`   - Created 1 pricing phase`);

  // Step 6: Create FAQs for all languages
  console.log("❓ Creating FAQs...");

  const faqsData = [
    {
      questionPt:
        "Preciso de ter os 6 atletas confirmados quando compro a equipa?",
      answerPt:
        "Não! Quando compra a entrada da equipa, só precisa de dar um nome à equipa. Pode adicionar e confirmar os 6 atletas (3 homens + 3 mulheres) mais tarde, até à data limite de 31 de março de 2026. O nome da equipa pode ser alterado até 6 semanas antes do evento.",
      questionEn: "Do I need all 6 athletes confirmed when I buy the team?",
      answerEn:
        "No! When you purchase the team entry, you only need to give the team a name. You can add and confirm the 6 athletes (3 men + 3 women) later, until the deadline of March 31, 2026. The team name can be changed up to 6 weeks before the event.",
      questionEs:
        "¿Necesito tener los 6 atletas confirmados cuando compro el equipo?",
      answerEs:
        "¡No! Cuando compras la entrada del equipo, solo necesitas dar un nombre al equipo. Puedes añadir y confirmar los 6 atletas (3 hombres + 3 mujeres) más tarde, hasta la fecha límite del 31 de marzo de 2026. El nombre del equipo se puede cambiar hasta 6 semanas antes del evento.",
      questionFr:
        "Dois-je avoir les 6 athlètes confirmés quand j'achète l'équipe ?",
      answerFr:
        "Non ! Lorsque vous achetez l'entrée de l'équipe, vous devez seulement donner un nom à l'équipe. Vous pouvez ajouter et confirmer les 6 athlètes (3 hommes + 3 femmes) plus tard, jusqu'à la date limite du 31 mars 2026. Le nom de l'équipe peut être modifié jusqu'à 6 semaines avant l'événement.",
      questionDe:
        "Brauche ich alle 6 Athleten bestätigt, wenn ich das Team kaufe?",
      answerDe:
        "Nein! Wenn Sie den Team-Eintritt kaufen, müssen Sie nur einen Teamnamen angeben. Sie können die 6 Athleten (3 Männer + 3 Frauen) später hinzufügen und bestätigen, bis zur Frist am 31. März 2026. Der Teamname kann bis 6 Wochen vor dem Event geändert werden.",
      questionIt:
        "Devo avere tutti i 6 atleti confermati quando acquisto la squadra?",
      answerIt:
        "No! Quando acquisti l'iscrizione della squadra, devi solo dare un nome alla squadra. Puoi aggiungere e confermare i 6 atleti (3 uomini + 3 donne) più tardi, fino alla scadenza del 31 marzo 2026. Il nome della squadra può essere modificato fino a 6 settimane prima dell'evento.",
    },
    {
      questionPt: "Posso comprar múltiplas equipas?",
      answerPt:
        "Sim! Contudo, só pode comprar uma equipa por conta no Team Aretas. Se quiser comprar várias equipas, terá de criar várias contas no Team Aretas (com emails diferentes) ou pedir a amigos/membros do seu ginásio que comprem as outras equipas.",
      questionEn: "Can I buy multiple teams?",
      answerEn:
        "Yes! However, you can only buy one team per account on Team Aretas. If you want to buy multiple teams, you either need multiple accounts on Team Aretas (different email addresses), or have some friends/gym members purchase the other teams.",
      questionEs: "¿Puedo comprar varios equipos?",
      answerEs:
        "¡Sí! Sin embargo, solo puedes comprar un equipo por cuenta en Team Aretas. Si quieres comprar varios equipos, necesitas varias cuentas en Team Aretas (con direcciones de correo diferentes), o pide a amigos/miembros del gimnasio que compren los otros equipos.",
      questionFr: "Puis-je acheter plusieurs équipes ?",
      answerFr:
        "Oui ! Cependant, vous ne pouvez acheter qu'une équipe par compte sur Team Aretas. Si vous voulez acheter plusieurs équipes, vous devez avoir plusieurs comptes sur Team Aretas (adresses e-mail différentes), ou demander à des amis/membres de votre salle de sport d'acheter les autres équipes.",
      questionDe: "Kann ich mehrere Teams kaufen?",
      answerDe:
        "Ja! Sie können jedoch nur ein Team pro Konto auf Team Aretas kaufen. Wenn Sie mehrere Teams kaufen möchten, benötigen Sie entweder mehrere Konten auf Team Aretas (verschiedene E-Mail-Adressen) oder bitten Sie Freunde/Gym-Mitglieder, die anderen Teams zu kaufen.",
      questionIt: "Posso acquistare più squadre?",
      answerIt:
        "Sì! Tuttavia, puoi acquistare solo una squadra per account su Team Aretas. Se vuoi acquistare più squadre, hai bisogno di più account su Team Aretas (indirizzi email diversi), o chiedi ad amici/membri della palestra di acquistare le altre squadre.",
    },
    {
      questionPt: "Que tipo de provas vou enfrentar?",
      answerPt:
        "As provas são SURPRESA - não são anunciadas com antecedência! Isto mantém todos os atletas atentos e motivados a preparar-se para o inesperado. Baseado em edições anteriores, as provas incluem movimentos funcionais como: correr na areia, nadar, levantar atlas stones, trepar, arrastar, puxar, transportar e lançar. NÃO há barbells nem ginástica avançada. A adaptabilidade é a chave para o sucesso!",
      questionEn: "What kind of events will I face?",
      answerEn:
        "The events are SURPRISE - not announced in advance! This keeps all athletes on their toes and motivated to prepare for the unexpected. Based on previous editions, events include functional movements such as: running on sand, swimming, lifting atlas stones, climbing, dragging, pulling, carrying and throwing. There are NO barbells or advanced gymnastics. Adaptability is key to success!",
      questionEs: "¿Qué tipo de pruebas voy a enfrentar?",
      answerEs:
        "¡Las pruebas son SORPRESA - no se anuncian con anticipación! Esto mantiene a todos los atletas alerta y motivados para prepararse para lo inesperado. Basado en ediciones anteriores, las pruebas incluyen movimientos funcionales como: correr en la arena, nadar, levantar atlas stones, trepar, arrastrar, tirar, transportar y lanzar. NO hay barbells ni gimnasia avanzada. ¡La adaptabilidad es la clave del éxito!",
      questionFr: "Quel type d'épreuves vais-je affronter ?",
      answerFr:
        "Les épreuves sont SURPRISE - non annoncées à l'avance ! Cela garde tous les athlètes sur leurs gardes et motivés à se préparer à l'inattendu. Basé sur les éditions précédentes, les épreuves incluent des mouvements fonctionnels tels que : courir sur le sable, nager, soulever des atlas stones, grimper, traîner, tirer, porter et lancer. Il n'y a PAS de barbells ni de gymnastique avancée. L'adaptabilité est la clé du succès !",
      questionDe: "Welche Art von Events werde ich bewältigen?",
      answerDe:
        "Die Events sind ÜBERRASCHUNG - nicht im Voraus angekündigt! Das hält alle Athleten auf Trab und motiviert, sich auf das Unerwartete vorzubereiten. Basierend auf früheren Ausgaben umfassen die Events funktionale Bewegungen wie: Laufen im Sand, Schwimmen, Heben von Atlas Stones, Klettern, Ziehen, Tragen und Werfen. Es gibt KEINE Barbells oder fortgeschrittene Gymnastik. Anpassungsfähigkeit ist der Schlüssel zum Erfolg!",
      questionIt: "Che tipo di prove affronterò?",
      answerIt:
        "Le prove sono SORPRESA - non annunciate in anticipo! Questo tiene tutti gli atleti all'erta e motivati a prepararsi per l'inaspettato. Basato sulle edizioni precedenti, le prove includono movimenti funzionali come: correre sulla sabbia, nuotare, sollevare atlas stones, arrampicarsi, trascinare, tirare, portare e lanciare. NON ci sono barbells o ginnastica avanzata. L'adattabilità è la chiave del successo!",
    },
    {
      questionPt: "Qual é a política de reembolso?",
      answerPt:
        "A entrada de equipa é NÃO REEMBOLSÁVEL por qualquer razão, EXCETO se a data do evento for alterada ou se o evento for cancelado pela organização. Recomendamos que considere um seguro de viagem/desporto se estiver preocupado com lesões ou circunstâncias imprevistas.",
      questionEn: "What is the refund policy?",
      answerEn:
        "Team entry is NON-REFUNDABLE for any reason, EXCEPT if the event date is moved or if the event is cancelled by the organization. We recommend considering travel/sport insurance if you're concerned about injuries or unforeseen circumstances.",
      questionEs: "¿Cuál es la política de reembolso?",
      answerEs:
        "La entrada del equipo es NO REEMBOLSABLE por cualquier razón, EXCEPTO si la fecha del evento se cambia o si el evento es cancelado por la organización. Recomendamos considerar un seguro de viaje/deporte si te preocupan lesiones o circunstancias imprevistas.",
      questionFr: "Quelle est la politique de remboursement ?",
      answerFr:
        "L'entrée de l'équipe est NON REMBOURSABLE pour quelque raison que ce soit, SAUF si la date de l'événement est modifiée ou si l'événement est annulé par l'organisation. Nous recommandons de considérer une assurance voyage/sport si vous êtes préoccupé par les blessures ou les circonstances imprévues.",
      questionDe: "Was ist die Rückerstattungsrichtlinie?",
      answerDe:
        "Der Team-Eintritt ist NICHT ERSTATTUNGSFÄHIG aus irgendeinem Grund, AUSSER wenn das Event-Datum verschoben wird oder wenn das Event von der Organisation abgesagt wird. Wir empfehlen, eine Reise-/Sport-Versicherung in Betracht zu ziehen, wenn Sie sich um Verletzungen oder unvorhergesehene Umstände sorgen.",
      questionIt: "Qual è la politica di rimborso?",
      answerIt:
        "L'iscrizione della squadra è NON RIMBORSABILE per qualsiasi motivo, TRANNE se la data dell'evento viene spostata o se l'evento viene cancellato dall'organizzazione. Raccomandiamo di considerare un'assicurazione viaggio/sport se siete preoccupati per infortuni o circostanze impreviste.",
    },
    {
      questionPt: "Que nível de fitness preciso para participar?",
      answerPt:
        "O Tribal Clash é desenhado para ser ACESSÍVEL A TODOS OS NÍVEIS mas ainda assim desafiante! Não há barbells ou ginástica avançada (muscle-ups, handstand push-ups, etc.). As provas focam-se em movimentos funcionais e trabalho em equipa. Se treina regularmente (CrossFit, functional fitness, corrida, natação) e trabalha bem em equipa, está pronto! A chave é a adaptabilidade e determinação, não ser um atleta de elite.",
      questionEn: "What fitness level do I need to participate?",
      answerEn:
        "Tribal Clash is designed to be ACCESSIBLE TO ALL LEVELS yet still challenging! There are no barbells or advanced gymnastics (muscle-ups, handstand push-ups, etc.). The events focus on functional movements and teamwork. If you train regularly (CrossFit, functional fitness, running, swimming) and work well in a team, you're ready! The key is adaptability and determination, not being an elite athlete.",
      questionEs: "¿Qué nivel de fitness necesito para participar?",
      answerEs:
        "¡Tribal Clash está diseñado para ser ACCESIBLE A TODOS LOS NIVELES pero aún así desafiante! No hay barbells ni gimnasia avanzada (muscle-ups, handstand push-ups, etc.). Las pruebas se centran en movimientos funcionales y trabajo en equipo. Si entrenas regularmente (CrossFit, functional fitness, carrera, natación) y trabajas bien en equipo, ¡estás listo! La clave es la adaptabilidad y determinación, no ser un atleta de élite.",
      questionFr: "Quel niveau de fitness ai-je besoin pour participer ?",
      answerFr:
        "Tribal Clash est conçu pour être ACCESSIBLE À TOUS LES NIVEAUX tout en étant challengeant ! Il n'y a pas de barbells ou de gymnastique avancée (muscle-ups, handstand push-ups, etc.). Les épreuves se concentrent sur des mouvements fonctionnels et le travail d'équipe. Si vous vous entraînez régulièrement (CrossFit, functional fitness, course, natation) et travaillez bien en équipe, vous êtes prêt ! La clé est l'adaptabilité et la détermination, pas être un athlète d'élite.",
      questionDe: "Welches Fitness-Level brauche ich zur Teilnahme?",
      answerDe:
        "Tribal Clash ist so konzipiert, dass es FÜR ALLE LEVELS ZUGÄNGLICH ist und dennoch herausfordernd! Es gibt keine Barbells oder fortgeschrittene Gymnastik (Muscle-ups, Handstand Push-ups, etc.). Die Events konzentrieren sich auf funktionale Bewegungen und Teamarbeit. Wenn Sie regelmäßig trainieren (CrossFit, funktionales Fitness, Laufen, Schwimmen) und gut im Team arbeiten, sind Sie bereit! Der Schlüssel ist Anpassungsfähigkeit und Entschlossenheit, nicht ein Elite-Athlet zu sein.",
      questionIt: "Che livello di fitness mi serve per partecipare?",
      answerIt:
        "Tribal Clash è progettato per essere ACCESSIBILE A TUTTI I LIVELLI ma comunque sfidante! Non ci sono barbells o ginnastica avanzata (muscle-ups, handstand push-ups, ecc.). Le prove si concentrano su movimenti funzionali e lavoro di squadra. Se ti alleni regolarmente (CrossFit, functional fitness, corsa, nuoto) e lavori bene in squadra, sei pronto! La chiave è l'adattabilità e la determinazione, non essere un atleta d'élite.",
    },
  ];

  for (const faqData of faqsData) {
    const faq = await prisma.eventFAQ.create({
      data: {
        eventId: event.id,
        question: faqData.questionPt, // Base question in Portuguese
        answer: faqData.answerPt, // Base answer in Portuguese
      },
    });

    // Create translations for all languages
    const faqTranslations = [
      {
        lang: "pt" as const,
        question: faqData.questionPt,
        answer: faqData.answerPt,
      },
      {
        lang: "en" as const,
        question: faqData.questionEn,
        answer: faqData.answerEn,
      },
      {
        lang: "es" as const,
        question: faqData.questionEs,
        answer: faqData.answerEs,
      },
      {
        lang: "fr" as const,
        question: faqData.questionFr,
        answer: faqData.answerFr,
      },
      {
        lang: "de" as const,
        question: faqData.questionDe,
        answer: faqData.answerDe,
      },
      {
        lang: "it" as const,
        question: faqData.questionIt,
        answer: faqData.answerIt,
      },
    ];

    for (const trans of faqTranslations) {
      await prisma.eventFAQTranslation.upsert({
        where: {
          faqId_language: {
            faqId: faq.id,
            language: trans.lang,
          },
        },
        update: {
          question: trans.question,
          answer: trans.answer,
        },
        create: {
          faqId: faq.id,
          language: trans.lang,
          question: trans.question,
          answer: trans.answer,
        },
      });
    }
  }

  console.log(`✅ Created ${faqsData.length} FAQs with translations`);

  console.log("\n🎉 Seeding completed successfully!");
  console.log(
    `   Location: ${event.city}, Algarve at ${event.latitude}, ${event.longitude}`
  );
  console.log(`   Date: ${event.startDate.toLocaleDateString("pt-PT")}`);
  console.log(`   Sports: CROSSFIT, OCR (Beach Fitness Competition)`);
  console.log(`   Format: Mixed Teams of 6 (3M + 3F)`);
  console.log(`   Limit: 100 teams`);
  console.log(`   Price: €830 per team (€138.33 per person)`);
  console.log(`   Ticket Sales Open: 01.02.2026 at 19:00`);
  console.log(`   Website: ${event.externalUrl}`);
  console.log(`   ✅ SEO metadata for all 6 languages`);
  console.log(`   ✅ ${faqsData.length} FAQs in all 6 languages`);
  console.log(`   ✅ GPS coordinates: ${event.latitude}, ${event.longitude}`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
