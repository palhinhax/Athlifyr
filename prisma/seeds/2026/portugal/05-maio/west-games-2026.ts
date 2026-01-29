/**
 * Seed West Games 2026 - COMPLETE WITH SEO AND FAQ
 * Complete with translations in all 6 languages
 * 7th edition CrossTraining/CrossFit team competition in Mafra, Portugal
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function seedWestGames2026() {
  console.log("🏋️ Seeding West Games 2026...");

  // Delete existing pricing phases to avoid duplicates
  await prisma.pricingPhase.deleteMany({
    where: {
      event: {
        slug: "west-games-2026",
      },
    },
  });

  // Upsert the event
  const event = await prisma.event.upsert({
    where: { slug: "west-games-2026" },
    update: {
      title: "West Games 2026",
      description: `## 🏋️ West Games 2026 – 7ª Edição

**A COMPETIÇÃO DE FITNESS MAIS SELVAGEM DO OESTE**

A 7ª edição dos West Games regressa a Mafra para três dias de competição intensa de CrossTraining/CrossFit! Uma experiência única que combina fitness funcional, trabalho em equipa e o melhor ambiente competitivo.

### 🏆 As Categorias

**SCALED** - 4 a 6 atletas (2 Masc + 2 Fem)
**RX** - 4 a 6 atletas (2 Masc + 2 Fem)
**ELITE** - 4 a 6 atletas (2 Masc + 2 Fem)
**MASTER +35** - 4 a 6 atletas (2 Masc + 2 Fem)

### 📊 2025 em Números
- **112 equipas**
- **+500 atletas**
- **+10.000€ em prémios**`,
      city: "Mafra",
      country: "Portugal",
      startDate: new Date("2026-05-22T19:00:00Z"),
      endDate: new Date("2026-05-24T17:00:00Z"),
      registrationDeadline: new Date("2026-04-12T23:59:59Z"),
      sportTypes: [SportType.CROSSFIT],
      latitude: 38.936944,
      longitude: -9.340278,
      externalUrl: "https://www.westgamesmafra.com",
      imageUrl: "",
    },
    create: {
      slug: "west-games-2026",
      title: "West Games 2026",
      description: `## 🏋️ West Games 2026 – 7ª Edição

**A COMPETIÇÃO DE FITNESS MAIS SELVAGEM DO OESTE**

A 7ª edição dos West Games regressa a Mafra para três dias de competição intensa de CrossTraining/CrossFit! Uma experiência única que combina fitness funcional, trabalho em equipa e o melhor ambiente competitivo.

### 🏆 As Categorias

**SCALED** - 4 a 6 atletas (2 Masc + 2 Fem)
**RX** - 4 a 6 atletas (2 Masc + 2 Fem)
**ELITE** - 4 a 6 atletas (2 Masc + 2 Fem)
**MASTER +35** - 4 a 6 atletas (2 Masc + 2 Fem)

### 📊 2025 em Números
- **112 equipas**
- **+500 atletas**
- **+10.000€ em prémios**`,
      city: "Mafra",
      country: "Portugal",
      startDate: new Date("2026-05-22T19:00:00Z"),
      endDate: new Date("2026-05-24T17:00:00Z"),
      registrationDeadline: new Date("2026-04-12T23:59:59Z"),
      sportTypes: [SportType.CROSSFIT],
      latitude: 38.936944,
      longitude: -9.340278,
      externalUrl: "https://www.westgamesmafra.com",
      imageUrl: "",
    },
  });

  console.log(`✅ Event created/updated: ${event.slug}`);

  // Translations with SEO metadata
  const translations = {
    pt: {
      title: "West Games 2026",
      description: `# A COMPETIÇÃO DE FITNESS MAIS SELVAGEM DO OESTE

## 🏆 7ª EDIÇÃO

Junta-te a nós para a maior competição de CrossTraining do Oeste! 3 dias intensos de competição em equipa no Parque Desportivo de Mafra.

### 📊 NÚMEROS DA EDIÇÃO 2025
- 112 equipas participantes
- +500 atletas
- +10.000€ em prémios

### 🎯 CATEGORIAS

**SCALED** (4 a 6 atletas)
Para atletas iniciantes que querem experimentar a emoção da competição.

**RX** (4 a 6 atletas)
Para atletas mais experientes com domínio dos movimentos fundamentais.

**ELITE** (4 a 6 atletas)
Para atletas avançados prontos para o desafio máximo.

**MASTER +35** (4 a 6 atletas)
Categoria dedicada aos atletas com mais de 35 anos.

### 📋 FORMATO
- Equipas mistas de 4 elementos (2 Masc. + 2 Fem.)
- Possibilidade de inscrever até 2 suplentes
- Sem qualificação nem cortes - todas as equipas alcançam a final
- Prize Money para as 3 melhores equipas de cada escalão

### 📅 PROGRAMA
**22 Maio (Quinta-feira) - 19h às 22:30h**
WOD Noturno (localização a divulgar)

**23 Maio (Sexta-feira) - 08:00 às 19h**
Parque Desportivo de Mafra

**24 Maio (Sábado) - 08:00 às 17h**
Parque Desportivo de Mafra

### 🎪 NO EVENTO
- Street Market com expositores de material desportivo
- Street Food com food trucks
- Espaços verdes para descanso
- Balneários e WC's
- Zona de aquecimento dedicada

### 🚨 INSCRIÇÕES LIMITADAS
As vagas são limitadas! Inscreve a tua equipa o quanto antes.

**Organização:** CrossFit Boarland

Vem fazer parte da maior festa do CrossTraining no Oeste! 💪`,
      city: "Mafra",
      metaTitle:
        "West Games 2026 - 7ª Edição | Mafra | 22-24 Maio - CrossTraining",
      metaDescription:
        "West Games 2026 - 7ª edição a 22, 23 e 24 de maio em Mafra. A maior competição de CrossTraining do Oeste com 4 categorias: Scaled, RX, Elite e Master +35. Inscrições limitadas!",
    },
    en: {
      title: "West Games 2026",
      description: `# THE WILDEST FITNESS COMPETITION IN THE WEST

## 🏆 7TH EDITION

Join us for the biggest CrossTraining competition in the West! 3 intense days of team competition at Mafra Sports Park.

### 📊 2025 EDITION NUMBERS
- 112 participating teams
- +500 athletes
- +10,000€ in prizes

### 🎯 CATEGORIES

**SCALED** (4 to 6 athletes)
For beginner athletes who want to experience the thrill of competition.

**RX** (4 to 6 athletes)
For more experienced athletes with mastery of fundamental movements.

**ELITE** (4 to 6 athletes)
For advanced athletes ready for the ultimate challenge.

**MASTER +35** (4 to 6 athletes)
Category dedicated to athletes over 35 years old.

### 📋 FORMAT
- Mixed teams of 4 elements (2 Male + 2 Female)
- Possibility to register up to 2 substitutes
- No qualification or cuts - all teams reach the final
- Prize Money for the top 3 teams in each division

### 📅 SCHEDULE
**May 22 (Thursday) - 7pm to 10:30pm**
Night WOD (location to be announced)

**May 23 (Friday) - 8am to 7pm**
Mafra Sports Park

**May 24 (Saturday) - 8am to 5pm**
Mafra Sports Park

### 🎪 AT THE EVENT
- Street Market with sports equipment exhibitors
- Street Food with food trucks
- Green spaces for rest
- Changing rooms and toilets
- Dedicated warm-up area

### 🚨 LIMITED REGISTRATIONS
Spots are limited! Register your team as soon as possible.

**Organization:** CrossFit Boarland

Come be part of the biggest CrossTraining party in the West! 💪`,
      city: "Mafra",
      metaTitle:
        "West Games 2026 - 7th Edition | Mafra | May 22-24 - CrossTraining",
      metaDescription:
        "West Games 2026 - 7th edition on May 22, 23 and 24 in Mafra. The biggest CrossTraining competition in the West with 4 categories: Scaled, RX, Elite and Master +35. Limited registrations!",
    },
    es: {
      title: "West Games 2026",
      description: `# LA COMPETICIÓN DE FITNESS MÁS SALVAJE DEL OESTE

## 🏆 7ª EDICIÓN

¡Únete a nosotros para la mayor competición de CrossTraining del Oeste! 3 días intensos de competición en equipo en el Parque Deportivo de Mafra.

### 📊 NÚMEROS DE LA EDICIÓN 2025
- 112 equipos participantes
- +500 atletas
- +10.000€ en premios

### 🎯 CATEGORÍAS

**SCALED** (4 a 6 atletas)
Para atletas principiantes que quieren experimentar la emoción de la competición.

**RX** (4 a 6 atletas)
Para atletas más experimentados con dominio de movimientos fundamentales.

**ELITE** (4 a 6 atletas)
Para atletas avanzados listos para el desafío máximo.

**MASTER +35** (4 a 6 atletas)
Categoría dedicada a atletas mayores de 35 años.

### 📋 FORMATO
- Equipos mixtos de 4 elementos (2 Masc. + 2 Fem.)
- Posibilidad de inscribir hasta 2 suplentes
- Sin calificación ni cortes - todos los equipos alcanzan la final
- Prize Money para los 3 mejores equipos de cada categoría

### 📅 PROGRAMA
**22 Mayo (Jueves) - 19h a 22:30h**
WOD Nocturno (ubicación por anunciar)

**23 Mayo (Viernes) - 08:00 a 19h**
Parque Deportivo de Mafra

**24 Mayo (Sábado) - 08:00 a 17h**
Parque Deportivo de Mafra

### 🎪 EN EL EVENTO
- Street Market con expositores de material deportivo
- Street Food con food trucks
- Espacios verdes para descanso
- Vestuarios y WC's
- Zona de calentamiento dedicada

### 🚨 INSCRIPCIONES LIMITADAS
¡Las plazas son limitadas! Inscribe tu equipo lo antes posible.

**Organización:** CrossFit Boarland

¡Ven a ser parte de la mayor fiesta de CrossTraining del Oeste! 💪`,
      city: "Mafra",
      metaTitle:
        "West Games 2026 - 7ª Edición | Mafra | 22-24 Mayo - CrossTraining",
      metaDescription:
        "West Games 2026 - 7ª edición el 22, 23 y 24 de mayo en Mafra. La mayor competición de CrossTraining del Oeste con 4 categorías: Scaled, RX, Elite y Master +35. ¡Inscripciones limitadas!",
    },
    fr: {
      title: "West Games 2026",
      description: `# LA COMPÉTITION DE FITNESS LA PLUS SAUVAGE DE L'OUEST

## 🏆 7ÈME ÉDITION

Rejoignez-nous pour la plus grande compétition de CrossTraining de l'Ouest ! 3 jours intenses de compétition par équipe au Parc Sportif de Mafra.

### 📊 CHIFFRES DE L'ÉDITION 2025
- 112 équipes participantes
- +500 athlètes
- +10 000€ de prix

### 🎯 CATÉGORIES

**SCALED** (4 à 6 athlètes)
Pour les athlètes débutants qui veulent vivre l'émotion de la compétition.

**RX** (4 à 6 athlètes)
Pour les athlètes plus expérimentés maîtrisant les mouvements fondamentaux.

**ELITE** (4 à 6 athlètes)
Pour les athlètes avancés prêts pour le défi ultime.

**MASTER +35** (4 à 6 athlètes)
Catégorie dédiée aux athlètes de plus de 35 ans.

### 📋 FORMAT
- Équipes mixtes de 4 éléments (2 Hommes + 2 Femmes)
- Possibilité d'inscrire jusqu'à 2 remplaçants
- Pas de qualification ni d'élimination - toutes les équipes atteignent la finale
- Prize Money pour les 3 meilleures équipes de chaque division

### 📅 PROGRAMME
**22 Mai (Jeudi) - 19h à 22h30**
WOD Nocturne (lieu à annoncer)

**23 Mai (Vendredi) - 8h à 19h**
Parc Sportif de Mafra

**24 Mai (Samedi) - 8h à 17h**
Parc Sportif de Mafra

### 🎪 À L'ÉVÉNEMENT
- Street Market avec exposants de matériel sportif
- Street Food avec food trucks
- Espaces verts pour repos
- Vestiaires et WC
- Zone d'échauffement dédiée

### 🚨 INSCRIPTIONS LIMITÉES
Les places sont limitées ! Inscrivez votre équipe dès que possible.

**Organisation:** CrossFit Boarland

Venez faire partie de la plus grande fête du CrossTraining de l'Ouest ! 💪`,
      city: "Mafra",
      metaTitle:
        "West Games 2026 - 7ème Édition | Mafra | 22-24 Mai - CrossTraining",
      metaDescription:
        "West Games 2026 - 7ème édition les 22, 23 et 24 mai à Mafra. La plus grande compétition de CrossTraining de l'Ouest avec 4 catégories : Scaled, RX, Elite et Master +35. Inscriptions limitées !",
    },
    de: {
      title: "West Games 2026",
      description: `# DER WILDESTE FITNESS-WETTBEWERB IM WESTEN

## 🏆 7. AUSGABE

Nimm an der größten CrossTraining-Competition im Westen teil! 3 intensive Tage Teamwettbewerb im Sportpark Mafra.

### 📊 ZAHLEN DER AUSGABE 2025
- 112 teilnehmende Teams
- +500 Athleten
- +10.000€ Preisgelder

### 🎯 KATEGORIEN

**SCALED** (4 bis 6 Athleten)
Für Anfänger-Athleten, die den Nervenkitzel des Wettbewerbs erleben wollen.

**RX** (4 bis 6 Athleten)
Für erfahrenere Athleten mit Beherrschung grundlegender Bewegungen.

**ELITE** (4 bis 6 Athleten)
Für fortgeschrittene Athleten, die bereit für die ultimative Herausforderung sind.

**MASTER +35** (4 bis 6 Athleten)
Kategorie für Athleten über 35 Jahre.

### 📋 FORMAT
- Gemischte Teams aus 4 Elementen (2 Männer + 2 Frauen)
- Möglichkeit, bis zu 2 Ersatzspieler anzumelden
- Keine Qualifikation oder Kürzungen - alle Teams erreichen das Finale
- Prize Money für die Top 3 Teams in jeder Division

### 📅 ZEITPLAN
**22. Mai (Donnerstag) - 19 bis 22:30 Uhr**
Nacht-WOD (Ort wird noch bekannt gegeben)

**23. Mai (Freitag) - 8 bis 19 Uhr**
Sportpark Mafra

**24. Mai (Samstag) - 8 bis 17 Uhr**
Sportpark Mafra

### 🎪 BEI DER VERANSTALTUNG
- Street Market mit Sportausrüstungsausstellern
- Street Food mit Food Trucks
- Grünflächen zum Ausruhen
- Umkleideräume und Toiletten
- Dedizierter Aufwärmbereich

### 🚨 BEGRENZTE ANMELDUNGEN
Die Plätze sind begrenzt! Melde dein Team so schnell wie möglich an.

**Organisation:** CrossFit Boarland

Sei Teil der größten CrossTraining-Party im Westen! 💪`,
      city: "Mafra",
      metaTitle:
        "West Games 2026 - 7. Ausgabe | Mafra | 22-24 Mai - CrossTraining",
      metaDescription:
        "West Games 2026 - 7. Ausgabe am 22., 23. und 24. Mai in Mafra. Der größte CrossTraining-Wettbewerb im Westen mit 4 Kategorien: Scaled, RX, Elite und Master +35. Begrenzte Anmeldungen!",
    },
    it: {
      title: "West Games 2026",
      description: `# LA COMPETIZIONE DI FITNESS PIÙ SELVAGGIA DELL'OVEST

## 🏆 7ª EDIZIONE

Unisciti a noi per la più grande competizione di CrossTraining dell'Ovest! 3 giorni intensi di competizione a squadre nel Parco Sportivo di Mafra.

### 📊 NUMERI DELL'EDIZIONE 2025
- 112 squadre partecipanti
- +500 atleti
- +10.000€ in premi

### 🎯 CATEGORIE

**SCALED** (4-6 atleti)
Per atleti principianti che vogliono provare l'emozione della competizione.

**RX** (4-6 atleti)
Per atleti più esperti con padronanza dei movimenti fondamentali.

**ELITE** (4-6 atleti)
Per atleti avanzati pronti per la sfida definitiva.

**MASTER +35** (4-6 atleti)
Categoria dedicata agli atleti sopra i 35 anni.

### 📋 FORMATO
- Squadre miste di 4 elementi (2 Uomini + 2 Donne)
- Possibilità di iscrivere fino a 2 sostituti
- Nessuna qualificazione o eliminazione - tutte le squadre raggiungono la finale
- Prize Money per le prime 3 squadre di ogni divisione

### 📅 PROGRAMMA
**22 Maggio (Giovedì) - 19:00 alle 22:30**
WOD Notturno (località da annunciare)

**23 Maggio (Venerdì) - 08:00 alle 19:00**
Parco Sportivo di Mafra

**24 Maggio (Sabato) - 08:00 alle 17:00**
Parco Sportivo di Mafra

### 🎪 ALL'EVENTO
- Street Market con espositori di attrezzature sportive
- Street Food con food truck
- Spazi verdi per il riposo
- Spogliatoi e servizi igienici
- Area riscaldamento dedicata

### 🚨 ISCRIZIONI LIMITATE
I posti sono limitati! Iscrivete la vostra squadra il prima possibile.

**Organizzazione:** CrossFit Boarland

Vieni a far parte della più grande festa del CrossTraining dell'Ovest! 💪`,
      city: "Mafra",
      metaTitle:
        "West Games 2026 - 7ª Edizione | Mafra | 22-24 Maggio - CrossTraining",
      metaDescription:
        "West Games 2026 - 7ª edizione il 22, 23 e 24 maggio a Mafra. La più grande competizione di CrossTraining dell'Ovest con 4 categorie: Scaled, RX, Elite e Master +35. Iscrizioni limitate!",
    },
  };

  // Create translations with SEO metadata
  console.log("🌍 Creating translations with SEO metadata...");
  const languages: Language[] = [
    Language.pt,
    Language.en,
    Language.es,
    Language.fr,
    Language.de,
    Language.it,
  ];

  for (const lang of languages) {
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
    console.log(`  ✅ Created translation with SEO for ${lang}`);
  }

  // Create variants and pricing phases
  console.log("💰 Creating variants and pricing phases...");

  const variants = [
    {
      name: "SCALED - Equipas 4 a 6 atletas",
      description: "Categoria iniciante (2 Masc + 2 Fem + até 2 suplentes)",
      distanceKm: null,
      elevationGainM: null,
      pricingPhases: [
        {
          name: "Early Bird",
          startDate: new Date("2026-01-15T00:00:00Z"),
          endDate: new Date("2026-02-08T23:59:59Z"),
          price: 260, // €65 x 4 athletes
          currency: Currency.EUR,
          note: "€65 per athlete - Team of 4",
        },
        {
          name: "Regular",
          startDate: new Date("2026-02-09T00:00:00Z"),
          endDate: new Date("2026-04-12T23:59:59Z"),
          price: 280, // €70 x 4 athletes
          currency: Currency.EUR,
          note: "€70 per athlete - Team of 4",
        },
      ],
    },
    {
      name: "RX - Equipas 4 a 6 atletas",
      description: "Categoria experiente (2 Masc + 2 Fem + até 2 suplentes)",
      distanceKm: null,
      elevationGainM: null,
      pricingPhases: [
        {
          name: "Early Bird",
          startDate: new Date("2026-01-15T00:00:00Z"),
          endDate: new Date("2026-02-08T23:59:59Z"),
          price: 260,
          currency: Currency.EUR,
          note: "€65 per athlete - Team of 4",
        },
        {
          name: "Regular",
          startDate: new Date("2026-02-09T00:00:00Z"),
          endDate: new Date("2026-04-12T23:59:59Z"),
          price: 280,
          currency: Currency.EUR,
          note: "€70 per athlete - Team of 4",
        },
      ],
    },
    {
      name: "ELITE - Equipas 4 a 6 atletas",
      description: "Categoria avançada (2 Masc + 2 Fem + até 2 suplentes)",
      distanceKm: null,
      elevationGainM: null,
      pricingPhases: [
        {
          name: "Early Bird",
          startDate: new Date("2026-01-15T00:00:00Z"),
          endDate: new Date("2026-02-08T23:59:59Z"),
          price: 260,
          currency: Currency.EUR,
          note: "€65 per athlete - Team of 4",
        },
        {
          name: "Regular",
          startDate: new Date("2026-02-09T00:00:00Z"),
          endDate: new Date("2026-04-12T23:59:59Z"),
          price: 280,
          currency: Currency.EUR,
          note: "€70 per athlete - Team of 4",
        },
      ],
    },
    {
      name: "MASTER +35 - Equipas 4 a 6 atletas",
      description: "Categoria +35 anos (2 Masc + 2 Fem + até 2 suplentes)",
      distanceKm: null,
      elevationGainM: null,
      pricingPhases: [
        {
          name: "Early Bird",
          startDate: new Date("2026-01-15T00:00:00Z"),
          endDate: new Date("2026-02-08T23:59:59Z"),
          price: 260,
          currency: Currency.EUR,
          note: "€65 per athlete - Team of 4",
        },
        {
          name: "Regular",
          startDate: new Date("2026-02-09T00:00:00Z"),
          endDate: new Date("2026-04-12T23:59:59Z"),
          price: 280,
          currency: Currency.EUR,
          note: "€70 per athlete - Team of 4",
        },
      ],
    },
  ];

  for (const variantData of variants) {
    const { pricingPhases, ...variantInfo } = variantData;

    const variant = await prisma.eventVariant.create({
      data: {
        ...variantInfo,
        eventId: event.id,
      },
    });

    console.log(`✅ Created variant: ${variant.name}`);

    // Create pricing phases linked to eventId (NOT variantId)
    for (const phase of pricingPhases) {
      await prisma.pricingPhase.create({
        data: {
          eventId: event.id, // ✅ CORRECT: linked to eventId
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

  // Create FAQ entries
  console.log("❓ Creating FAQ entries...");

  //Delete existing FAQs
  await prisma.eventFAQ.deleteMany({
    where: { eventId: event.id },
  });

  const faqsData = [
    {
      questionPt: "Quantos elementos deve ter a equipa?",
      answerPt:
        "As equipas devem ter 4 elementos obrigatórios (2 masculinos + 2 femininos). É permitido inscrever até 6 elementos, sendo os 2 extra considerados suplentes opcionais.",
      questionEn: "How many members should the team have?",
      answerEn:
        "Teams must have 4 mandatory members (2 males + 2 females). You can register up to 6 members, with the 2 extra considered optional substitutes.",
      questionEs: "¿Cuántos miembros debe tener el equipo?",
      answerEs:
        "Los equipos deben tener 4 miembros obligatorios (2 masculinos + 2 femeninos). Se puede inscribir hasta 6 miembros, siendo los 2 extra considerados suplentes opcionales.",
      questionFr: "Combien de membres doit avoir l'équipe ?",
      answerFr:
        "Les équipes doivent avoir 4 membres obligatoires (2 hommes + 2 femmes). Vous pouvez inscrire jusqu'à 6 membres, les 2 supplémentaires étant considérés comme remplaçants optionnels.",
      questionDe: "Wie viele Mitglieder sollte das Team haben?",
      answerDe:
        "Teams müssen 4 obligatorische Mitglieder haben (2 Männer + 2 Frauen). Sie können bis zu 6 Mitglieder registrieren, wobei die 2 zusätzlichen als optionale Ersatzspieler gelten.",
      questionIt: "Quanti membri deve avere la squadra?",
      answerIt:
        "Le squadre devono avere 4 membri obbligatori (2 maschi + 2 femmine). È possibile iscrivere fino a 6 membri, con i 2 extra considerati riserve opzionali.",
    },
    {
      questionPt: "Posso substituir atletas durante a competição?",
      answerPt:
        "Sim, as substituições de elementos podem ser feitas no final de cada WOD. Não há limite de trocas durante a competição.",
      questionEn: "Can I substitute athletes during competition?",
      answerEn:
        "Yes, member substitutions can be made at the end of each WOD. There is no limit on changes during competition.",
      questionEs: "¿Puedo sustituir atletas durante la competición?",
      answerEs:
        "Sí, las sustituciones de miembros se pueden hacer al final de cada WOD. No hay límite de cambios durante la competición.",
      questionFr: "Puis-je remplacer des athlètes pendant la compétition ?",
      answerFr:
        "Oui, les remplacements de membres peuvent être effectués à la fin de chaque WOD. Il n'y a pas de limite de changements pendant la compétition.",
      questionDe: "Kann ich Athleten während des Wettbewerbs ersetzen?",
      answerDe:
        "Ja, Mitgliederwechsel können am Ende jedes WOD vorgenommen werden. Es gibt keine Begrenzung für Wechsel während des Wettbewerbs.",
      questionIt: "Posso sostituire gli atleti durante la competizione?",
      answerIt:
        "Sì, le sostituzioni dei membri possono essere effettuate alla fine di ogni WOD. Non c'è limite di cambi durante la competizione.",
    },
    {
      questionPt: "Como funciona a categoria MASTERS?",
      answerPt:
        "A categoria Masters é para atletas com +35 anos. Apenas abre se houver um mínimo de 10 equipas inscritas. Caso contrário, as equipas são automaticamente transferidas para o escalão RX com os mesmos standards.",
      questionEn: "How does the MASTERS category work?",
      answerEn:
        "The Masters category is for athletes aged 35+. It only opens if there are a minimum of 10 teams registered. Otherwise, teams are automatically transferred to the RX division with the same standards.",
      questionEs: "¿Cómo funciona la categoría MASTERS?",
      answerEs:
        "La categoría Masters es para atletas de +35 años. Solo abre si hay un mínimo de 10 equipos inscritos. De lo contrario, los equipos se transfieren automáticamente a la categoría RX con los mismos estándares.",
      questionFr: "Comment fonctionne la catégorie MASTERS ?",
      answerFr:
        "La catégorie Masters est pour les athlètes de 35 ans et plus. Elle ouvre uniquement s'il y a un minimum de 10 équipes inscrites. Sinon, les équipes sont automatiquement transférées dans la division RX avec les mêmes standards.",
      questionDe: "Wie funktioniert die MASTERS-Kategorie?",
      answerDe:
        "Die Masters-Kategorie ist für Athleten ab 35 Jahren. Sie öffnet nur, wenn mindestens 10 Teams registriert sind. Andernfalls werden Teams automatisch in die RX-Division mit denselben Standards verlegt.",
      questionIt: "Come funziona la categoria MASTERS?",
      answerIt:
        "La categoria Masters è per atleti sopra i 35 anni. Si apre solo se ci sono un minimo di 10 squadre iscritte. Altrimenti, le squadre vengono automaticamente trasferite nella divisione RX con gli stessi standard.",
    },
    {
      questionPt: "O que está incluído na inscrição?",
      answerPt:
        "A inscrição inclui seguro de acidentes pessoais e kit de atleta. O preço é de 65€ por elemento na primeira fase (até 8 de fevereiro) e 70€ na segunda fase (9 de fevereiro a 12 de abril).",
      questionEn: "What is included in the registration?",
      answerEn:
        "Registration includes personal accident insurance and athlete kit. The price is €65 per member in the first phase (until February 8) and €70 in the second phase (February 9 to April 12).",
      questionEs: "¿Qué incluye la inscripción?",
      answerEs:
        "La inscripción incluye seguro de accidentes personales y kit de atleta. El precio es de 65€ por miembro en la primera fase (hasta el 8 de febrero) y 70€ en la segunda fase (9 de febrero al 12 de abril).",
      questionFr: "Qu'est-ce qui est inclus dans l'inscription ?",
      answerFr:
        "L'inscription comprend une assurance accidents personnels et un kit athlète. Le prix est de 65€ par membre dans la première phase (jusqu'au 8 février) et 70€ dans la deuxième phase (9 février au 12 avril).",
      questionDe: "Was ist in der Anmeldung enthalten?",
      answerDe:
        "Die Anmeldung beinhaltet Unfallversicherung und Athleten-Kit. Der Preis beträgt 65€ pro Mitglied in der ersten Phase (bis 8. Februar) und 70€ in der zweiten Phase (9. Februar bis 12. April).",
      questionIt: "Cosa è incluso nell'iscrizione?",
      answerIt:
        "L'iscrizione include assicurazione infortuni personali e kit atleta. Il prezzo è di 65€ per membro nella prima fase (fino all'8 febbraio) e 70€ nella seconda fase (9 febbraio al 12 aprile).",
    },
    {
      questionPt: "Há prémios monetários?",
      answerPt:
        "Sim, há Prize Money para as 3 melhores equipas de cada escalão. O valor total dos prémios será anunciado antes do início do evento. Para além dos prémios monetários, serão entregues outros prémios.",
      questionEn: "Are there cash prizes?",
      answerEn:
        "Yes, there is Prize Money for the top 3 teams in each division. The total prize amount will be announced before the event starts. In addition to monetary prizes, other awards will be given.",
      questionEs: "¿Hay premios monetarios?",
      answerEs:
        "Sí, hay Prize Money para los 3 mejores equipos de cada categoría. El valor total de premios se anunciará antes del inicio del evento. Además de los premios monetarios, se entregarán otros premios.",
      questionFr: "Y a-t-il des prix en espèces ?",
      answerFr:
        "Oui, il y a du Prize Money pour les 3 meilleures équipes de chaque division. Le montant total des prix sera annoncé avant le début de l'événement. En plus des prix monétaires, d'autres récompenses seront remises.",
      questionDe: "Gibt es Geldpreise?",
      answerDe:
        "Ja, es gibt Preisgeld für die Top 3 Teams jeder Division. Der Gesamtpreis wird vor Beginn der Veranstaltung bekannt gegeben. Neben Geldpreisen werden auch andere Auszeichnungen vergeben.",
      questionIt: "Ci sono premi in denaro?",
      answerIt:
        "Sì, c'è Prize Money per le prime 3 squadre di ogni divisione. L'importo totale dei premi sarà annunciato prima dell'inizio dell'evento. Oltre ai premi monetari, saranno consegnati altri premi.",
    },
  ];

  for (const faqData of faqsData) {
    const faq = await prisma.eventFAQ.create({
      data: {
        eventId: event.id,
        question: faqData.questionPt,
        answer: faqData.answerPt,
      },
    });

    const faqTranslations = [
      {
        lang: Language.pt,
        question: faqData.questionPt,
        answer: faqData.answerPt,
      },
      {
        lang: Language.en,
        question: faqData.questionEn,
        answer: faqData.answerEn,
      },
      {
        lang: Language.es,
        question: faqData.questionEs,
        answer: faqData.answerEs,
      },
      {
        lang: Language.fr,
        question: faqData.questionFr,
        answer: faqData.answerFr,
      },
      {
        lang: Language.de,
        question: faqData.questionDe,
        answer: faqData.answerDe,
      },
      {
        lang: Language.it,
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

  console.log("\n✅ West Games 2026 seed completed successfully!");
  console.log(`   Event ID: ${event.id}`);
  console.log(`   Event slug: ${event.slug}`);
  console.log(`   Translations: 6 languages`);
  console.log(`   Variants: 4 categories`);
  console.log(`   Pricing phases: 8 total (2 per variant)`);
  console.log(`   FAQs: ${faqsData.length} with 6 translations each`);
}

seedWestGames2026()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
