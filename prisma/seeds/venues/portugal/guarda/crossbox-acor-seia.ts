/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Seed: CrossBox Açor - Seia
 * Box de CrossFit e HYROX Official Training Center em Seia
 * Instagram: @crossboxacor
 * Website: http://crossboxacor.pt/
 */

import {
  PrismaClient,
  VenueType,
  SportType,
  VenueService,
  Language,
} from "@prisma/client";

const prisma = new PrismaClient();

const CROSSBOX_ACOR_COVER =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=600&fit=crop&q=80";

// Translations for all 6 languages
const translations: Record<
  Language,
  { description: string; metaTitle: string; metaDescription: string }
> = {
  pt: {
    description: `# CrossBox Açor - Seia

Bem-vindo à CrossBox Açor! Aqui vais encontrar muito mais que um lugar para treinar.

## 💥 Começa hoje mesmo a tua nova vida!

Com **+12 aulas por dia** e **+600 sócios ativos**, a CrossBox Açor é a maior comunidade fitness da Serra da Estrela.

## Modalidades

### Cross
Um treino de força e condicionamento ("cardio"), com movimentos funcionais do nosso dia-a-dia realizados a intensidades relativamente altas (adaptadas a todo o tipo de condição física). Trabalha o corpo todo, todos os dias.

### HYROX
**Official Training Center** - Opção de treino para quem não gosta de barras e quer uma boa aula de treino de força e MUITO condicionamento (Cardio).

### Gains
Para quem procura um treino de força, mais estética e melhorar a qualidade de vida.

### Açor Remote
A tua Box em casa, aqui ou no estrangeiro.

### Teens
Aulas dedicadas aos mais novos. Dos 11 aos 16 anos.

### Legends
Aulas dedicadas a alunos com +60 anos focadas no equilíbrio, força, coordenação.

## A Equipa
- Tiago Amaro
- Duarte Covas
- Diego Cardoso
- Pedro Gouveia

**We built this box.**`,
    metaTitle: "CrossBox Açor Seia | HYROX Official Training Center | CrossFit",
    metaDescription:
      "CrossBox Açor em Seia - HYROX Official Training Center. +12 aulas por dia, +600 sócios ativos. CrossFit, HYROX, Gains, Teens e Legends. Agenda o teu treino gratuito!",
  },
  en: {
    description: `# CrossBox Açor - Seia

Welcome to CrossBox Açor! Here you'll find much more than a place to train.

## 💥 Start your new life today!

With **+12 classes per day** and **+600 active members**, CrossBox Açor is the largest fitness community in Serra da Estrela.

## Modalities

### Cross
A strength and conditioning ("cardio") workout, with functional movements from our daily lives performed at relatively high intensities (adapted to all fitness levels). Works the whole body, every day.

### HYROX
**Official Training Center** - Training option for those who don't like bars and want a good strength training class with LOTS of conditioning (Cardio).

### Gains
For those looking for strength training, more aesthetics and improved quality of life.

### Açor Remote
Your Box at home, here or abroad.

### Teens
Classes dedicated to youngsters. From 11 to 16 years old.

### Legends
Classes dedicated to students aged 60+ focused on balance, strength, coordination.

## The Team
- Tiago Amaro
- Duarte Covas
- Diego Cardoso
- Pedro Gouveia

**We built this box.**`,
    metaTitle: "CrossBox Açor Seia | HYROX Official Training Center | CrossFit",
    metaDescription:
      "CrossBox Açor in Seia - HYROX Official Training Center. +12 classes per day, +600 active members. CrossFit, HYROX, Gains, Teens and Legends. Book your free trial!",
  },
  es: {
    description: `# CrossBox Açor - Seia

¡Bienvenido a CrossBox Açor! Aquí encontrarás mucho más que un lugar para entrenar.

## 💥 ¡Comienza hoy mismo tu nueva vida!

Con **+12 clases por día** y **+600 socios activos**, CrossBox Açor es la mayor comunidad fitness de Serra da Estrela.

## Modalidades

### Cross
Un entrenamiento de fuerza y acondicionamiento ("cardio"), con movimientos funcionales de nuestro día a día realizados a intensidades relativamente altas (adaptadas a todo tipo de condición física). Trabaja todo el cuerpo, todos los días.

### HYROX
**Official Training Center** - Opción de entrenamiento para quienes no les gustan las barras y quieren una buena clase de entrenamiento de fuerza y MUCHO acondicionamiento (Cardio).

### Gains
Para quienes buscan entrenamiento de fuerza, más estética y mejorar la calidad de vida.

### Açor Remote
Tu Box en casa, aquí o en el extranjero.

### Teens
Clases dedicadas a los más jóvenes. De 11 a 16 años.

### Legends
Clases dedicadas a alumnos de +60 años enfocadas en equilibrio, fuerza, coordinación.

## El Equipo
- Tiago Amaro
- Duarte Covas
- Diego Cardoso
- Pedro Gouveia

**We built this box.**`,
    metaTitle: "CrossBox Açor Seia | HYROX Official Training Center | CrossFit",
    metaDescription:
      "CrossBox Açor en Seia - HYROX Official Training Center. +12 clases por día, +600 socios activos. CrossFit, HYROX, Gains, Teens y Legends. ¡Reserva tu entrenamiento gratis!",
  },
  fr: {
    description: `# CrossBox Açor - Seia

Bienvenue à CrossBox Açor ! Ici, tu trouveras bien plus qu'un endroit pour t'entraîner.

## 💥 Commence ta nouvelle vie dès aujourd'hui !

Avec **+12 cours par jour** et **+600 membres actifs**, CrossBox Açor est la plus grande communauté fitness de Serra da Estrela.

## Modalités

### Cross
Un entraînement de force et de conditionnement ("cardio"), avec des mouvements fonctionnels de notre quotidien réalisés à des intensités relativement élevées (adaptées à tous les niveaux de forme physique). Travaille tout le corps, tous les jours.

### HYROX
**Official Training Center** - Option d'entraînement pour ceux qui n'aiment pas les barres et veulent un bon cours de musculation avec BEAUCOUP de conditionnement (Cardio).

### Gains
Pour ceux qui recherchent un entraînement de force, plus d'esthétique et améliorer leur qualité de vie.

### Açor Remote
Ta Box à la maison, ici ou à l'étranger.

### Teens
Cours dédiés aux plus jeunes. De 11 à 16 ans.

### Legends
Cours dédiés aux élèves de +60 ans axés sur l'équilibre, la force, la coordination.

## L'Équipe
- Tiago Amaro
- Duarte Covas
- Diego Cardoso
- Pedro Gouveia

**We built this box.**`,
    metaTitle: "CrossBox Açor Seia | HYROX Official Training Center | CrossFit",
    metaDescription:
      "CrossBox Açor à Seia - HYROX Official Training Center. +12 cours par jour, +600 membres actifs. CrossFit, HYROX, Gains, Teens et Legends. Réserve ton essai gratuit !",
  },
  de: {
    description: `# CrossBox Açor - Seia

Willkommen bei CrossBox Açor! Hier findest du viel mehr als nur einen Ort zum Trainieren.

## 💥 Starte heute dein neues Leben!

Mit **+12 Kursen pro Tag** und **+600 aktiven Mitgliedern** ist CrossBox Açor die größte Fitness-Community in Serra da Estrela.

## Modalitäten

### Cross
Ein Kraft- und Konditionstraining ("Cardio"), mit funktionellen Bewegungen aus unserem Alltag, die bei relativ hohen Intensitäten durchgeführt werden (angepasst an alle Fitnesslevel). Trainiert den ganzen Körper, jeden Tag.

### HYROX
**Official Training Center** - Trainingsmöglichkeit für alle, die keine Stangen mögen und ein gutes Krafttraining mit VIEL Konditionierung (Cardio) wollen.

### Gains
Für alle, die Krafttraining suchen, mehr Ästhetik und eine verbesserte Lebensqualität.

### Açor Remote
Deine Box zu Hause, hier oder im Ausland.

### Teens
Kurse für Jugendliche. Von 11 bis 16 Jahren.

### Legends
Kurse für Schüler ab 60 Jahren mit Fokus auf Gleichgewicht, Kraft, Koordination.

## Das Team
- Tiago Amaro
- Duarte Covas
- Diego Cardoso
- Pedro Gouveia

**We built this box.**`,
    metaTitle: "CrossBox Açor Seia | HYROX Official Training Center | CrossFit",
    metaDescription:
      "CrossBox Açor in Seia - HYROX Official Training Center. +12 Kurse pro Tag, +600 aktive Mitglieder. CrossFit, HYROX, Gains, Teens und Legends. Buche dein kostenloses Training!",
  },
  it: {
    description: `# CrossBox Açor - Seia

Benvenuto alla CrossBox Açor! Qui troverai molto più di un posto per allenarti.

## 💥 Inizia oggi la tua nuova vita!

Con **+12 lezioni al giorno** e **+600 soci attivi**, CrossBox Açor è la più grande comunità fitness di Serra da Estrela.

## Modalità

### Cross
Un allenamento di forza e condizionamento ("cardio"), con movimenti funzionali della nostra vita quotidiana eseguiti a intensità relativamente alte (adattate a tutti i livelli di forma fisica). Allena tutto il corpo, ogni giorno.

### HYROX
**Official Training Center** - Opzione di allenamento per chi non ama le sbarre e vuole una buona lezione di allenamento della forza con MOLTO condizionamento (Cardio).

### Gains
Per chi cerca allenamento della forza, più estetica e miglioramento della qualità della vita.

### Açor Remote
La tua Box a casa, qui o all'estero.

### Teens
Lezioni dedicate ai più giovani. Dagli 11 ai 16 anni.

### Legends
Lezioni dedicate agli alunni over 60 focalizzate su equilibrio, forza, coordinazione.

## Il Team
- Tiago Amaro
- Duarte Covas
- Diego Cardoso
- Pedro Gouveia

**We built this box.**`,
    metaTitle: "CrossBox Açor Seia | HYROX Official Training Center | CrossFit",
    metaDescription:
      "CrossBox Açor a Seia - HYROX Official Training Center. +12 lezioni al giorno, +600 soci attivi. CrossFit, HYROX, Gains, Teens e Legends. Prenota il tuo allenamento gratuito!",
  },
};

async function main() {
  console.log("🏋️ Seeding CrossBox Açor - Seia...\n");

  // Get owner user (tiago@acor.pt) or admin as fallback
  let creatorUser = await prisma.user.findUnique({
    where: { email: "tiago@acor.pt" },
  });

  if (!creatorUser) {
    creatorUser = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });
  }

  if (!creatorUser) {
    console.error("❌ No owner (tiago@acor.pt) or admin user found.");
    console.error("   Please run the users seed first:");
    console.error(
      "   npx ts-node prisma/seeds/venues/portugal/crossbox-acor-users.ts"
    );
    return;
  }

  console.log(`👤 Using creator user: ${creatorUser.email}\n`);

  // Check if venue already exists
  const existing = await prisma.venue.findUnique({
    where: { slug: "crossbox-acor-seia" },
  });

  if (existing) {
    console.log(`⏭️  Skipped (exists): CrossBox Açor - Seia`);
    return;
  }

  // Create venue
  const venue = await prisma.venue.create({
    data: {
      slug: "crossbox-acor-seia",
      name: "CrossBox Açor - Seia",
      type: VenueType.CROSSFIT_BOX,
      sportTypes: [SportType.CROSSFIT, SportType.HYROX],
      services: [
        VenueService.CROSSFIT,
        VenueService.HYROX,
        VenueService.FUNCTIONAL_FITNESS,
        VenueService.PERSONAL_TRAINING,
        VenueService.GROUP_CLASSES,
      ],
      description: translations.pt.description,
      address: "R. Dr. Gaspar Rebelo, 6270-436 Seia",
      city: "Seia",
      country: "Portugal",
      latitude: 40.4128,
      longitude: -7.7112,
      website: "http://crossboxacor.pt/",
      instagram: "crossboxacor",
      createdByUserId: creatorUser.id,
      isVerified: false,
      isActive: true,
      coverImage: CROSSBOX_ACOR_COVER,
      logo: null,
      visibleTabs: ["feed", "about", "plans", "sessions", "team"],
    },
  });

  console.log(`✅ Created: CrossBox Açor - Seia`);
  console.log(`   📍 R. Dr. Gaspar Rebelo, 6270-436 Seia`);
  console.log(`   🌐 http://crossboxacor.pt/`);
  console.log(`   📸 @crossboxacor`);
  console.log(`   🏷️  Services: CrossFit, HYROX, Functional Fitness`);
  console.log(`   🎯 HYROX Official Training Center`);

  // Create translations for all 6 languages
  console.log("\n📝 Creating translations...");

  const languages: Language[] = ["pt", "en", "es", "fr", "de", "it"];

  for (const lang of languages) {
    await prisma.venueTranslation.upsert({
      where: {
        venueId_language: {
          venueId: venue.id,
          language: lang,
        },
      },
      update: {
        description: translations[lang].description,
        metaTitle: translations[lang].metaTitle,
        metaDescription: translations[lang].metaDescription,
      },
      create: {
        venueId: venue.id,
        language: lang,
        description: translations[lang].description,
        metaTitle: translations[lang].metaTitle,
        metaDescription: translations[lang].metaDescription,
      },
    });
    console.log(`   ✅ ${lang.toUpperCase()} translation created`);
  }

  // Create recurring sessions for Monday (2ª Feira)
  console.log("\n📅 Creating recurring sessions for Monday...");

  const mondaySessions = [
    {
      startTime: "07:00",
      endTime: "08:00",
      title: "WOD",
      type: "CLASS" as const,
    },
    {
      startTime: "09:00",
      endTime: "10:00",
      title: "WOD",
      type: "CLASS" as const,
    },
    {
      startTime: "10:00",
      endTime: "11:00",
      title: "Open Box",
      type: "CLASS" as const,
    },
    {
      startTime: "16:00",
      endTime: "17:30",
      title: "Open Box",
      type: "CLASS" as const,
    },
    {
      startTime: "17:30",
      endTime: "18:30",
      title: "WOD",
      type: "CLASS" as const,
    },
    {
      startTime: "17:30",
      endTime: "18:30",
      title: "Gainz",
      type: "CLASS" as const,
    },
    {
      startTime: "18:30",
      endTime: "19:30",
      title: "WOD",
      type: "CLASS" as const,
    },
    {
      startTime: "19:30",
      endTime: "20:30",
      title: "WOD",
      type: "CLASS" as const,
    },
    {
      startTime: "20:30",
      endTime: "21:30",
      title: "WOD",
      type: "CLASS" as const,
    },
  ];

  for (const session of mondaySessions) {
    await prisma.venueRecurringSession.create({
      data: {
        venueId: venue.id,
        type: session.type,
        title: session.title,
        dayOfWeek: 1, // Monday (0 = Sunday, 1 = Monday, etc.)
        startTime: session.startTime,
        endTime: session.endTime,
        isActive: true,
        bookingAdvanceDays: 7,
        cancellationDeadlineMinutes: 60,
      },
    });
  }

  console.log(
    `   ✅ Created ${mondaySessions.length} recurring sessions for Monday`
  );

  console.log("\n🎉 CrossBox Açor - Seia seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding venue:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
