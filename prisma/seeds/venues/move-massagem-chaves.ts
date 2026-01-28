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
  metaTitle: string;
  metaDescription: string;
}

const translations: Record<Language, VenueTranslations> = {
  pt: {
    metaTitle:
      "MOVE Massagem | Massagem Desportiva e Terapêutica em Chaves, Portugal",
    metaDescription:
      "MOVE Massagem em Chaves - Massagem desportiva e terapêutica com Tiago Santos. Recuperação muscular, alívio de dores e bem-estar para atletas e amadores. Move-te. Recupera. Evolui.",
  },
  en: {
    metaTitle:
      "MOVE Massage | Sports & Therapeutic Massage in Chaves, Portugal",
    metaDescription:
      "MOVE Massage in Chaves - Sports and therapeutic massage with Tiago Santos. Muscle recovery, pain relief and wellness for athletes and amateurs. Move. Recover. Evolve.",
  },
  es: {
    metaTitle:
      "MOVE Masaje | Masaje Deportivo y Terapéutico en Chaves, Portugal",
    metaDescription:
      "MOVE Masaje en Chaves - Masaje deportivo y terapéutico con Tiago Santos. Recuperación muscular, alivio del dolor y bienestar para atletas y aficionados. Muévete. Recupérate. Evoluciona.",
  },
  fr: {
    metaTitle:
      "MOVE Massage | Massage Sportif et Thérapeutique à Chaves, Portugal",
    metaDescription:
      "MOVE Massage à Chaves - Massage sportif et thérapeutique avec Tiago Santos. Récupération musculaire, soulagement des douleurs et bien-être pour athlètes et amateurs. Bouge. Récupère. Évolue.",
  },
  de: {
    metaTitle:
      "MOVE Massage | Sport- und Therapeutische Massage in Chaves, Portugal",
    metaDescription:
      "MOVE Massage in Chaves - Sport- und therapeutische Massage mit Tiago Santos. Muskelregeneration, Schmerzlinderung und Wohlbefinden für Sportler und Amateure. Bewege dich. Erhole dich. Entwickle dich.",
  },
  it: {
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
  description: `Move-te. Recupera. Evolui.

Eu sou o Tiago Santos e sou massagista especializado em massagem desportiva e terapêutica.

A MOVE nasce para cuidar de todos os corpos em movimento — dos atletas profissionais a quem treina no dia a dia, e também de quem apenas precisa aliviar a tensão acumulada da rotina.

Trabalho adaptando cada sessão às necessidades de cada corpo. Seja para preparar, recuperar ou simplesmente parar e cuidar, o objetivo é sempre o mesmo: promover bem-estar, aliviar dores, libertar tensões e devolver equilíbrio ao corpo.

Aqui, o corpo é ouvido, respeitado e tratado com atenção. Porque cuidar de ti faz a diferença no teu movimento.

## Missão

Cuidar do corpo é permitir que ele continue.

A MOVE existe para apoiar a recuperação, aliviar o stress e devolver equilíbrio, ajudando cada pessoa a manter-se em movimento com mais conforto e confiança.

## Serviços

### Massagem Desportiva
Indicada para quem pratica exercício físico, amadores e atletas. Previne lesões, acelera a recuperação muscular e melhora o desempenho físico.

- **Meio Corpo** (Superior ou inferior - 30min): 30,00€
- **Corpo Completo** (Superior e inferior - 60min): 55,00€
- **Pack Recuperação** (Superior ou inferior 20min + Eletroestimulação 10min): 33,00€

### Massagem Terapêutica
Foca em pontos de dor e desconforto muscular, ajudando a restaurar a mobilidade, a relaxar e a melhorar a circulação.

- **Meio Corpo** (Superior ou inferior - 30min): 30,00€
- **Corpo Completo** (Superior e inferior - 60min): 55,00€
- **Pack Relaxamento** (Superior ou inferior 20min + Eletroestimulação 10min): 33,00€

---

*Cuida do teu corpo para chegares mais longe.*
Atletas | Amadores | Movimento`,
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
    console.log("\n🌍 Creating translations (SEO metadata)...");

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
          metaTitle: translation.metaTitle,
          metaDescription: translation.metaDescription,
        },
        create: {
          venueId: venue.id,
          language: lang,
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
