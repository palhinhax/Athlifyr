/**
 * Seed: MOVE Massagem - Chaves, Portugal
 *
 * Venue de massagem desportiva e terapêutica
 * Terapeuta: Tiago Santos
 *
 * Website: https://movemassagem.my.canva.site/
 * Instagram: @move.massagem
 *
 * Coordenadas: Chaves, Portugal (41.7393, -7.4706)
 *
 * Serviços:
 * - Massagem Desportiva (meio corpo 30€, corpo completo 55€, pack recuperação 33€)
 * - Massagem Terapêutica (meio corpo 30€, corpo completo 55€, pack relaxamento 33€)
 *
 * Run: npx ts-node prisma/seeds/venues/move-massagem-chaves.ts
 */

import { PrismaClient, Language } from "@prisma/client";

const prisma = new PrismaClient();

// ==============================================================================
// CONFIGURATION
// ==============================================================================

const VENUE_SLUG = "move-massagem-chaves";

// Coordenadas de Chaves, Portugal
const COORDINATES = {
  latitude: 41.7393,
  longitude: -7.4706,
};

// ==============================================================================
// TRANSLATIONS (ALL 6 LANGUAGES)
// ==============================================================================

interface VenueTranslations {
  description: string;
  metaTitle: string;
  metaDescription: string;
}

const translations: Record<Language, VenueTranslations> = {
  pt: {
    description: `**Move-te. Recupera. Evolui.**

Eu sou o **Tiago Santos** e sou massagista especializado em massagem desportiva e terapêutica.

A MOVE nasce para cuidar de todos os corpos em movimento — dos atletas profissionais a quem treina no dia a dia, e também de quem apenas precisa aliviar a tensão acumulada da rotina.

Trabalho adaptando cada sessão às necessidades de cada corpo. Seja para preparar, recuperar ou simplesmente parar e cuidar, o objetivo é sempre o mesmo: promover bem-estar, aliviar dores, libertar tensões e devolver equilíbrio ao corpo.

Aqui, o corpo é ouvido, respeitado e tratado com atenção. Porque cuidar de ti faz a diferença no teu movimento.

---

## 🎯 Missão

Cuidar do corpo é permitir que ele continue.

A MOVE existe para apoiar a recuperação, aliviar o stress e devolver equilíbrio, ajudando cada pessoa a manter-se em movimento com mais conforto e confiança.

---

## 💆 Serviços

### Massagem Desportiva
Indicada para quem pratica exercício físico, amadores e atletas. Previne lesões, acelera a recuperação muscular e melhora o desempenho físico.

| Serviço | Duração | Preço |
|---------|---------|-------|
| Meio Corpo (Superior ou inferior) | 30min | 30,00€ |
| Corpo Completo (Superior e inferior) | 60min | 55,00€ |
| Pack Recuperação (Massagem + Eletroestimulação) | 30min | 33,00€ |

### Massagem Terapêutica
Foca em pontos de dor e desconforto muscular, ajudando a restaurar a mobilidade, a relaxar e a melhorar a circulação.

| Serviço | Duração | Preço |
|---------|---------|-------|
| Meio Corpo (Superior ou inferior) | 30min | 30,00€ |
| Corpo Completo (Superior e inferior) | 60min | 55,00€ |
| Pack Relaxamento (Massagem + Eletroestimulação) | 30min | 33,00€ |

---

*Cuida do teu corpo para chegares mais longe.*

**Atletas** | **Amadores** | **Movimento**`,
    metaTitle:
      "MOVE Massagem | Massagem Desportiva e Terapêutica em Chaves, Portugal",
    metaDescription:
      "MOVE Massagem em Chaves - Massagem desportiva e terapêutica com Tiago Santos. Recuperação muscular, alívio de dores e bem-estar para atletas e amadores. Move-te. Recupera. Evolui.",
  },
  en: {
    description: `**Move. Recover. Evolve.**

I'm **Tiago Santos** and I'm a massage therapist specialized in sports and therapeutic massage.

MOVE was born to take care of all bodies in motion — from professional athletes to those who train daily, and also those who just need to relieve the accumulated tension from their routine.

I work by adapting each session to the needs of each body. Whether it's to prepare, recover, or simply stop and care, the goal is always the same: promote well-being, relieve pain, release tension, and restore balance to the body.

Here, the body is heard, respected, and treated with attention. Because taking care of yourself makes a difference in your movement.

---

## 🎯 Mission

Taking care of the body is allowing it to continue.

MOVE exists to support recovery, relieve stress, and restore balance, helping each person stay in motion with more comfort and confidence.

---

## 💆 Services

### Sports Massage
Recommended for those who practice physical exercise, amateurs, and athletes. Prevents injuries, accelerates muscle recovery, and improves physical performance.

| Service | Duration | Price |
|---------|----------|-------|
| Half Body (Upper or lower) | 30min | €30.00 |
| Full Body (Upper and lower) | 60min | €55.00 |
| Recovery Pack (Massage + Electrostimulation) | 30min | €33.00 |

### Therapeutic Massage
Focuses on pain points and muscle discomfort, helping to restore mobility, relax, and improve circulation.

| Service | Duration | Price |
|---------|----------|-------|
| Half Body (Upper or lower) | 30min | €30.00 |
| Full Body (Upper and lower) | 60min | €55.00 |
| Relaxation Pack (Massage + Electrostimulation) | 30min | €33.00 |

---

*Take care of your body to go further.*

**Athletes** | **Amateurs** | **Movement**`,
    metaTitle:
      "MOVE Massage | Sports & Therapeutic Massage in Chaves, Portugal",
    metaDescription:
      "MOVE Massage in Chaves - Sports and therapeutic massage with Tiago Santos. Muscle recovery, pain relief and wellness for athletes and amateurs. Move. Recover. Evolve.",
  },
  es: {
    description: `**Muévete. Recupérate. Evoluciona.**

Soy **Tiago Santos** y soy masajista especializado en masaje deportivo y terapéutico.

MOVE nace para cuidar de todos los cuerpos en movimiento — desde atletas profesionales hasta quienes entrenan en el día a día, y también de quienes solo necesitan aliviar la tensión acumulada de la rutina.

Trabajo adaptando cada sesión a las necesidades de cada cuerpo. Ya sea para preparar, recuperar o simplemente parar y cuidar, el objetivo es siempre el mismo: promover el bienestar, aliviar dolores, liberar tensiones y devolver el equilibrio al cuerpo.

Aquí, el cuerpo es escuchado, respetado y tratado con atención. Porque cuidarte marca la diferencia en tu movimiento.

---

## 🎯 Misión

Cuidar del cuerpo es permitir que continúe.

MOVE existe para apoyar la recuperación, aliviar el estrés y devolver el equilibrio, ayudando a cada persona a mantenerse en movimiento con más comodidad y confianza.

---

## 💆 Servicios

### Masaje Deportivo
Indicado para quienes practican ejercicio físico, aficionados y atletas. Previene lesiones, acelera la recuperación muscular y mejora el rendimiento físico.

| Servicio | Duración | Precio |
|----------|----------|--------|
| Medio Cuerpo (Superior o inferior) | 30min | 30,00€ |
| Cuerpo Completo (Superior e inferior) | 60min | 55,00€ |
| Pack Recuperación (Masaje + Electroestimulación) | 30min | 33,00€ |

### Masaje Terapéutico
Se centra en puntos de dolor y malestar muscular, ayudando a restaurar la movilidad, relajar y mejorar la circulación.

| Servicio | Duración | Precio |
|----------|----------|--------|
| Medio Cuerpo (Superior o inferior) | 30min | 30,00€ |
| Cuerpo Completo (Superior e inferior) | 60min | 55,00€ |
| Pack Relajación (Masaje + Electroestimulación) | 30min | 33,00€ |

---

*Cuida tu cuerpo para llegar más lejos.*

**Atletas** | **Aficionados** | **Movimiento**`,
    metaTitle:
      "MOVE Masaje | Masaje Deportivo y Terapéutico en Chaves, Portugal",
    metaDescription:
      "MOVE Masaje en Chaves - Masaje deportivo y terapéutico con Tiago Santos. Recuperación muscular, alivio del dolor y bienestar para atletas y aficionados. Muévete. Recupérate. Evoluciona.",
  },
  fr: {
    description: `**Bouge. Récupère. Évolue.**

Je suis **Tiago Santos** et je suis massothérapeute spécialisé en massage sportif et thérapeutique.

MOVE est né pour prendre soin de tous les corps en mouvement — des athlètes professionnels à ceux qui s'entraînent au quotidien, et aussi de ceux qui ont simplement besoin de soulager la tension accumulée de leur routine.

Je travaille en adaptant chaque séance aux besoins de chaque corps. Que ce soit pour préparer, récupérer ou simplement s'arrêter et prendre soin, l'objectif est toujours le même : promouvoir le bien-être, soulager les douleurs, libérer les tensions et rétablir l'équilibre du corps.

Ici, le corps est écouté, respecté et traité avec attention. Parce que prendre soin de toi fait la différence dans ton mouvement.

---

## 🎯 Mission

Prendre soin du corps, c'est lui permettre de continuer.

MOVE existe pour soutenir la récupération, soulager le stress et rétablir l'équilibre, aidant chaque personne à rester en mouvement avec plus de confort et de confiance.

---

## 💆 Services

### Massage Sportif
Recommandé pour ceux qui pratiquent l'exercice physique, amateurs et athlètes. Prévient les blessures, accélère la récupération musculaire et améliore les performances physiques.

| Service | Durée | Prix |
|---------|-------|------|
| Demi-Corps (Haut ou bas) | 30min | 30,00€ |
| Corps Complet (Haut et bas) | 60min | 55,00€ |
| Pack Récupération (Massage + Électrostimulation) | 30min | 33,00€ |

### Massage Thérapeutique
Se concentre sur les points de douleur et d'inconfort musculaire, aidant à restaurer la mobilité, à relaxer et à améliorer la circulation.

| Service | Durée | Prix |
|---------|-------|------|
| Demi-Corps (Haut ou bas) | 30min | 30,00€ |
| Corps Complet (Haut et bas) | 60min | 55,00€ |
| Pack Relaxation (Massage + Électrostimulation) | 30min | 33,00€ |

---

*Prends soin de ton corps pour aller plus loin.*

**Athlètes** | **Amateurs** | **Mouvement**`,
    metaTitle:
      "MOVE Massage | Massage Sportif et Thérapeutique à Chaves, Portugal",
    metaDescription:
      "MOVE Massage à Chaves - Massage sportif et thérapeutique avec Tiago Santos. Récupération musculaire, soulagement des douleurs et bien-être pour athlètes et amateurs. Bouge. Récupère. Évolue.",
  },
  de: {
    description: `**Bewege dich. Erhole dich. Entwickle dich.**

Ich bin **Tiago Santos** und bin Masseur, spezialisiert auf Sport- und therapeutische Massage.

MOVE wurde geboren, um alle Körper in Bewegung zu pflegen — von Profisportlern bis zu denen, die täglich trainieren, und auch von denen, die einfach nur die angesammelte Spannung aus ihrer Routine lösen müssen.

Ich arbeite, indem ich jede Sitzung an die Bedürfnisse jedes Körpers anpasse. Ob zur Vorbereitung, Erholung oder einfach zum Innehalten und Pflegen, das Ziel ist immer dasselbe: Wohlbefinden fördern, Schmerzen lindern, Spannungen lösen und das Gleichgewicht des Körpers wiederherstellen.

Hier wird der Körper gehört, respektiert und mit Aufmerksamkeit behandelt. Denn sich um dich zu kümmern macht den Unterschied in deiner Bewegung.

---

## 🎯 Mission

Für den Körper zu sorgen bedeutet, ihm zu erlauben, weiterzumachen.

MOVE existiert, um die Erholung zu unterstützen, Stress abzubauen und das Gleichgewicht wiederherzustellen, und hilft jeder Person, mit mehr Komfort und Vertrauen in Bewegung zu bleiben.

---

## 💆 Dienstleistungen

### Sportmassage
Empfohlen für Personen, die körperliche Übungen praktizieren, Amateure und Sportler. Verhindert Verletzungen, beschleunigt die Muskelregeneration und verbessert die körperliche Leistung.

| Service | Dauer | Preis |
|---------|-------|-------|
| Halbkörper (Ober- oder Unterkörper) | 30min | 30,00€ |
| Ganzkörper (Ober- und Unterkörper) | 60min | 55,00€ |
| Erholungspaket (Massage + Elektrostimulation) | 30min | 33,00€ |

### Therapeutische Massage
Konzentriert sich auf Schmerz- und Muskelbeschwerden, hilft bei der Wiederherstellung der Mobilität, entspannt und verbessert die Durchblutung.

| Service | Dauer | Preis |
|---------|-------|-------|
| Halbkörper (Ober- oder Unterkörper) | 30min | 30,00€ |
| Ganzkörper (Ober- und Unterkörper) | 60min | 55,00€ |
| Entspannungspaket (Massage + Elektrostimulation) | 30min | 33,00€ |

---

*Kümmere dich um deinen Körper, um weiter zu kommen.*

**Sportler** | **Amateure** | **Bewegung**`,
    metaTitle:
      "MOVE Massage | Sport- und Therapeutische Massage in Chaves, Portugal",
    metaDescription:
      "MOVE Massage in Chaves - Sport- und therapeutische Massage mit Tiago Santos. Muskelregeneration, Schmerzlinderung und Wohlbefinden für Sportler und Amateure. Bewege dich. Erhole dich. Entwickle dich.",
  },
  it: {
    description: `**Muoviti. Recupera. Evolvi.**

Sono **Tiago Santos** e sono un massaggiatore specializzato in massaggio sportivo e terapeutico.

MOVE nasce per prendersi cura di tutti i corpi in movimento — dagli atleti professionisti a chi si allena quotidianamente, e anche di chi ha semplicemente bisogno di alleviare la tensione accumulata dalla routine.

Lavoro adattando ogni sessione alle esigenze di ogni corpo. Che sia per preparare, recuperare o semplicemente fermarsi e prendersi cura, l'obiettivo è sempre lo stesso: promuovere il benessere, alleviare i dolori, liberare le tensioni e ripristinare l'equilibrio del corpo.

Qui, il corpo viene ascoltato, rispettato e trattato con attenzione. Perché prenderti cura di te fa la differenza nel tuo movimento.

---

## 🎯 Missione

Prendersi cura del corpo significa permettergli di continuare.

MOVE esiste per supportare il recupero, alleviare lo stress e ripristinare l'equilibrio, aiutando ogni persona a rimanere in movimento con più comfort e fiducia.

---

## 💆 Servizi

### Massaggio Sportivo
Indicato per chi pratica esercizio fisico, amatori e atleti. Previene infortuni, accelera il recupero muscolare e migliora le prestazioni fisiche.

| Servizio | Durata | Prezzo |
|----------|--------|--------|
| Mezzo Corpo (Superiore o inferiore) | 30min | 30,00€ |
| Corpo Completo (Superiore e inferiore) | 60min | 55,00€ |
| Pack Recupero (Massaggio + Elettrostimolazione) | 30min | 33,00€ |

### Massaggio Terapeutico
Si concentra sui punti di dolore e disagio muscolare, aiutando a ripristinare la mobilità, rilassare e migliorare la circolazione.

| Servizio | Durata | Prezzo |
|----------|--------|--------|
| Mezzo Corpo (Superiore o inferiore) | 30min | 30,00€ |
| Corpo Completo (Superiore e inferiore) | 60min | 55,00€ |
| Pack Relax (Massaggio + Elettrostimolazione) | 30min | 33,00€ |

---

*Prenditi cura del tuo corpo per andare più lontano.*

**Atleti** | **Amatori** | **Movimento**`,
    metaTitle:
      "MOVE Massaggio | Massaggio Sportivo e Terapeutico a Chaves, Portogallo",
    metaDescription:
      "MOVE Massaggio a Chaves - Massaggio sportivo e terapeutico con Tiago Santos. Recupero muscolare, sollievo dal dolore e benessere per atleti e amatori. Muoviti. Recupera. Evolvi.",
  },
};

// ==============================================================================
// VENUE DATA
// ==============================================================================

const venueData = {
  slug: VENUE_SLUG,
  name: "MOVE Massagem",
  // Default description in Portuguese (main language)
  description: translations.pt.description,
  city: "Chaves",
  country: "Portugal",
  address: "Chaves, Portugal",
  phone: null,
  email: null,
  website: "https://movemassagem.my.canva.site/",
  instagram: "move.massagem",
  latitude: COORDINATES.latitude,
  longitude: COORDINATES.longitude,
  isVerified: true,
  isActive: true,
  paymentMode: "EXTERNAL" as const,
  externalPaymentInstructions:
    "Marcações por mensagem no Instagram @move.massagem",
};

// ==============================================================================
// PLANS (Services with pricing)
// ==============================================================================

const plans = [
  {
    name: "Massagem Desportiva - Meio Corpo",
    description:
      "Massagem desportiva para parte superior ou inferior do corpo. Duração: 30 minutos. Ideal para quem pratica exercício físico, previne lesões e acelera a recuperação muscular.",
    price: 30.0,
    isActive: true,
  },
  {
    name: "Massagem Desportiva - Corpo Completo",
    description:
      "Massagem desportiva completa para parte superior e inferior do corpo. Duração: 60 minutos. Tratamento completo para atletas e praticantes de exercício físico.",
    price: 55.0,
    isActive: true,
  },
  {
    name: "Pack Recuperação",
    description:
      "Massagem desportiva (20min) + Eletroestimulação (10min). Parte superior ou inferior. Pack ideal para recuperação muscular intensiva.",
    price: 33.0,
    isActive: true,
  },
  {
    name: "Massagem Terapêutica - Meio Corpo",
    description:
      "Massagem terapêutica para parte superior ou inferior do corpo. Duração: 30 minutos. Foca em pontos de dor e desconforto, restaurando mobilidade.",
    price: 30.0,
    isActive: true,
  },
  {
    name: "Massagem Terapêutica - Corpo Completo",
    description:
      "Massagem terapêutica completa para parte superior e inferior do corpo. Duração: 60 minutos. Alívio de tensões e melhoria da circulação.",
    price: 55.0,
    isActive: true,
  },
  {
    name: "Pack Relaxamento",
    description:
      "Massagem terapêutica (20min) + Eletroestimulação (10min). Parte superior ou inferior. Pack ideal para relaxamento e alívio do stress.",
    price: 33.0,
    isActive: true,
  },
];

// ==============================================================================
// SEED FUNCTION
// ==============================================================================

async function seedMOVEMassagem() {
  console.log("🌱 Seeding MOVE Massagem venue...");
  console.log("=====================================\n");

  try {
    // Find or create a system user to be the creator
    // In production, you would link this to the actual owner's user account
    let creatorUser = await prisma.user.findFirst({
      where: { email: "admin@athlifyr.com" },
    });

    if (!creatorUser) {
      console.log("⚠️  Admin user not found, creating system user...");
      creatorUser = await prisma.user.upsert({
        where: { email: "system@athlifyr.com" },
        update: {},
        create: {
          email: "system@athlifyr.com",
          name: "System",
          role: "ADMIN",
          locale: "pt",
        },
      });
    }

    console.log(`👤 Using creator: ${creatorUser.email}`);

    // Check if venue already exists
    const existingVenue = await prisma.venue.findUnique({
      where: { slug: VENUE_SLUG },
    });

    if (existingVenue) {
      console.log(`\n📍 Venue "${VENUE_SLUG}" already exists, updating...`);
    }

    // Upsert venue
    const venue = await prisma.venue.upsert({
      where: { slug: VENUE_SLUG },
      update: {
        name: venueData.name,
        type: "MASSAGE",
        sportTypes: [],
        services: ["MASSAGE", "RECOVERY"],
        description: venueData.description,
        city: venueData.city,
        country: venueData.country,
        address: venueData.address,
        phone: venueData.phone,
        email: venueData.email,
        website: venueData.website,
        instagram: venueData.instagram,
        latitude: venueData.latitude,
        longitude: venueData.longitude,
        isVerified: venueData.isVerified,
        isActive: venueData.isActive,
        paymentMode: venueData.paymentMode,
        externalPaymentInstructions: venueData.externalPaymentInstructions,
      },
      create: {
        slug: venueData.slug,
        name: venueData.name,
        type: "MASSAGE",
        sportTypes: [],
        services: ["MASSAGE", "RECOVERY"],
        description: venueData.description,
        city: venueData.city,
        country: venueData.country,
        address: venueData.address,
        phone: venueData.phone,
        email: venueData.email,
        website: venueData.website,
        instagram: venueData.instagram,
        latitude: venueData.latitude,
        longitude: venueData.longitude,
        isVerified: venueData.isVerified,
        isActive: venueData.isActive,
        paymentMode: venueData.paymentMode,
        externalPaymentInstructions: venueData.externalPaymentInstructions,
        createdByUserId: creatorUser.id,
      },
    });

    console.log(`\n✅ Venue created/updated: ${venue.name}`);
    console.log(`   📍 Location: ${venue.city}, ${venue.country}`);
    console.log(`   🌐 Website: ${venue.website}`);
    console.log(`   📸 Instagram: @${venue.instagram}`);

    // Upsert translations for all 6 languages
    console.log("\n🌍 Creating translations (descriptions + SEO metadata)...");

    const languages: Language[] = ["pt", "en", "es", "fr", "de", "it"];

    for (const lang of languages) {
      const translation = translations[lang];

      await prisma.venueTranslation.upsert({
        where: {
          venueId_language: {
            venueId: venue.id,
            language: lang,
          },
        },
        update: {
          description: translation.description,
          metaTitle: translation.metaTitle,
          metaDescription: translation.metaDescription,
        },
        create: {
          venueId: venue.id,
          language: lang,
          description: translation.description,
          metaTitle: translation.metaTitle,
          metaDescription: translation.metaDescription,
        },
      });

      console.log(`   ✅ ${lang.toUpperCase()}: ${translation.metaTitle}`);
    }

    // Delete existing plans to avoid duplicates
    await prisma.venuePlan.deleteMany({
      where: { venueId: venue.id },
    });

    // Create plans (services with pricing)
    console.log("\n💰 Creating service plans...");

    for (const plan of plans) {
      const createdPlan = await prisma.venuePlan.create({
        data: {
          venueId: venue.id,
          name: plan.name,
          description: plan.description,
          price: plan.price,
          currency: "EUR",
          isActive: plan.isActive,
        },
      });

      console.log(
        `   ✅ ${createdPlan.name}: €${createdPlan.price?.toFixed(2)}`
      );
    }

    console.log("\n=====================================");
    console.log("🎉 MOVE Massagem seed completed successfully!");
    console.log(`\n📱 View at: /venues/${venue.slug}`);
    console.log("=====================================\n");

    return venue;
  } catch (error) {
    console.error("❌ Error seeding MOVE Massagem:", error);
    throw error;
  }
}

// ==============================================================================
// MAIN EXECUTION
// ==============================================================================

async function main() {
  try {
    await seedMOVEMassagem();
  } catch (error) {
    console.error("Failed to seed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
