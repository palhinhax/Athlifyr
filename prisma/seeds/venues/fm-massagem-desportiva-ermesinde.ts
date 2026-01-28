/**
 * Seed: FM Massagem Desportiva - Ermesinde, Portugal
 *
 * Venue de massagem desportiva e terapêutica
 * Terapeuta: Filipe Monteiro
 *
 * Instagram: @fmmassagemdesportiva
 * Telefone: 939 805 348
 *
 * Coordenadas: Ermesinde, Portugal (41.2167, -8.5500)
 *
 * Serviços:
 * - Massagem Desportiva (preparação pré-treino e recuperação pós-treino)
 * - Massagem Terapêutica (alívio de contracturas e tensões musculares)
 * - Acompanhamento de Atletas (apoio individualizado)
 * - Pressoterapia (recuperação e regeneração)
 *
 * Run: npx ts-node prisma/seeds/venues/fm-massagem-desportiva-ermesinde.ts
 */

import { PrismaClient, Language } from "@prisma/client";

const prisma = new PrismaClient();

// ==============================================================================
// CONFIGURATION
// ==============================================================================

const VENUE_SLUG = "fm-massagem-desportiva-ermesinde";

// Coordenadas de Ermesinde, Portugal
const COORDINATES = {
  latitude: 41.2167,
  longitude: -8.55,
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
    description: `## Quem Sou Eu?

Sou o **Filipe Monteiro**, profissional especializado em massagem desportiva e terapêutica, com sede no gabinete localizado em Rua Joaquim Lagoa nº 30, Gabinete 3, 4445-480 Ermesinde.

Com uma abordagem focada em **performance e recuperação muscular**, trabalho com atletas, clubes e praticantes regulares que procuram subir de nível ou acelerar a recuperação.

🏊‍♂️ **Triatleta amador de longa distância**
📚 **Curso de massagista de recuperação e reabilitação**
🚴 **Massagista na equipa ciclismo Radio Popular Paredes Boavista**

---

## 💆 O Que Faço?

### Massagem Desportiva
Ideal para **preparação pré-treino** e **recuperação pós-treino** ou competição. Melhora a performance e acelera a regeneração muscular.

### Massagem Terapêutica
Destinada a **aliviar contracturas**, tensões musculares e conseguir **relaxamento profundo**. Indicada para quem sofre de dores crónicas ou stress acumulado.

### Acompanhamento de Atletas
Apoio **individualizado** (treinos, competição, recuperação) para **maximizar rendimento** e **minimizar risco de lesão**. Serviço personalizado para as tuas necessidades específicas.

### Pressoterapia
Técnica de **recuperação e regeneração**, que favorece drenagem, circulação e recuperação mais rápida de musculatura exigida. Complemento ideal à massagem.

---

## 🎯 O Meu Compromisso

Acredito que cada corpo precisa de **atenção personalizada**. Por isso, o meu trabalho centra-se em entender as necessidades específicas de cada atleta ou cliente — incluindo histórico, objetivos, nível de treino — para oferecer um serviço ajustado.

Se és um **clube, ginásio ou atleta** que procura um parceiro de confiança para apoiar o rendimento, recuperação e bem-estar, estou inteiramente disponível para estabelecer colaboração.

---

📍 **Rua Joaquim Lagoa nº 30, Gabinete 3, 4445-480 Ermesinde**
📞 **939 805 348**
📸 **@fmmassagemdesportiva**`,
    metaTitle:
      "FM Massagem Desportiva | Filipe Monteiro - Ermesinde, Porto, Portugal",
    metaDescription:
      "FM Massagem Desportiva em Ermesinde - Massagem desportiva e terapêutica com Filipe Monteiro. Recuperação muscular, pressoterapia e acompanhamento de atletas. Triatleta e massagista da equipa Radio Popular.",
  },
  en: {
    description: `## Who Am I?

I'm **Filipe Monteiro**, a professional specialized in sports and therapeutic massage, based at the office located at Rua Joaquim Lagoa nº 30, Office 3, 4445-480 Ermesinde.

With an approach focused on **performance and muscle recovery**, I work with athletes, clubs, and regular practitioners who seek to level up or speed up recovery.

🏊‍♂️ **Amateur long-distance triathlete**
📚 **Recovery and rehabilitation massage course**
🚴 **Massage therapist for Radio Popular Paredes Boavista cycling team**

---

## 💆 What I Do?

### Sports Massage
Ideal for **pre-workout preparation** and **post-workout recovery** or competition. Improves performance and accelerates muscle regeneration.

### Therapeutic Massage
Designed to **relieve contractures**, muscle tension and achieve **deep relaxation**. Recommended for those suffering from chronic pain or accumulated stress.

### Athlete Support
**Individualized** support (training, competition, recovery) to **maximize performance** and **minimize injury risk**. Personalized service for your specific needs.

### Pressotherapy
**Recovery and regeneration** technique that promotes drainage, circulation and faster recovery of stressed muscles. Ideal complement to massage.

---

## 🎯 My Commitment

I believe that each body needs **personalized attention**. Therefore, my work focuses on understanding the specific needs of each athlete or client — including history, goals, training level — to offer a tailored service.

If you're a **club, gym or athlete** looking for a trusted partner to support performance, recovery and well-being, I'm fully available to establish a collaboration.

---

📍 **Rua Joaquim Lagoa nº 30, Office 3, 4445-480 Ermesinde**
📞 **939 805 348**
📸 **@fmmassagemdesportiva**`,
    metaTitle:
      "FM Sports Massage | Filipe Monteiro - Ermesinde, Porto, Portugal",
    metaDescription:
      "FM Sports Massage in Ermesinde - Sports and therapeutic massage with Filipe Monteiro. Muscle recovery, pressotherapy and athlete support. Triathlete and massage therapist for Radio Popular team.",
  },
  es: {
    description: `## ¿Quién Soy?

Soy **Filipe Monteiro**, profesional especializado en masaje deportivo y terapéutico, con sede en el gabinete ubicado en Rua Joaquim Lagoa nº 30, Gabinete 3, 4445-480 Ermesinde.

Con un enfoque centrado en **rendimiento y recuperación muscular**, trabajo con atletas, clubes y practicantes regulares que buscan subir de nivel o acelerar la recuperación.

🏊‍♂️ **Triatleta amateur de larga distancia**
📚 **Curso de masajista de recuperación y rehabilitación**
🚴 **Masajista en el equipo ciclismo Radio Popular Paredes Boavista**

---

## 💆 ¿Qué Hago?

### Masaje Deportivo
Ideal para **preparación pre-entrenamiento** y **recuperación post-entrenamiento** o competición. Mejora el rendimiento y acelera la regeneración muscular.

### Masaje Terapéutico
Destinado a **aliviar contracturas**, tensiones musculares y conseguir **relajación profunda**. Indicado para quienes sufren de dolores crónicos o estrés acumulado.

### Acompañamiento de Atletas
Apoyo **individualizado** (entrenamientos, competición, recuperación) para **maximizar rendimiento** y **minimizar riesgo de lesión**. Servicio personalizado para tus necesidades específicas.

### Presoterapia
Técnica de **recuperación y regeneración**, que favorece el drenaje, circulación y recuperación más rápida de la musculatura exigida. Complemento ideal al masaje.

---

## 🎯 Mi Compromiso

Creo que cada cuerpo necesita **atención personalizada**. Por eso, mi trabajo se centra en entender las necesidades específicas de cada atleta o cliente — incluyendo historial, objetivos, nivel de entrenamiento — para ofrecer un servicio ajustado.

Si eres un **club, gimnasio o atleta** que busca un socio de confianza para apoyar el rendimiento, recuperación y bienestar, estoy totalmente disponible para establecer colaboración.

---

📍 **Rua Joaquim Lagoa nº 30, Gabinete 3, 4445-480 Ermesinde**
📞 **939 805 348**
📸 **@fmmassagemdesportiva**`,
    metaTitle:
      "FM Masaje Deportivo | Filipe Monteiro - Ermesinde, Oporto, Portugal",
    metaDescription:
      "FM Masaje Deportivo en Ermesinde - Masaje deportivo y terapéutico con Filipe Monteiro. Recuperación muscular, presoterapia y acompañamiento de atletas. Triatleta y masajista del equipo Radio Popular.",
  },
  fr: {
    description: `## Qui Suis-Je ?

Je suis **Filipe Monteiro**, professionnel spécialisé en massage sportif et thérapeutique, basé au cabinet situé Rua Joaquim Lagoa nº 30, Cabinet 3, 4445-480 Ermesinde.

Avec une approche axée sur la **performance et la récupération musculaire**, je travaille avec des athlètes, des clubs et des pratiquants réguliers qui cherchent à passer au niveau supérieur ou à accélérer leur récupération.

🏊‍♂️ **Triathlète amateur longue distance**
📚 **Formation de masseur en récupération et réhabilitation**
🚴 **Masseur de l'équipe cycliste Radio Popular Paredes Boavista**

---

## 💆 Ce Que Je Fais ?

### Massage Sportif
Idéal pour la **préparation pré-entraînement** et la **récupération post-entraînement** ou compétition. Améliore la performance et accélère la régénération musculaire.

### Massage Thérapeutique
Destiné à **soulager les contractures**, les tensions musculaires et obtenir une **relaxation profonde**. Recommandé pour ceux qui souffrent de douleurs chroniques ou de stress accumulé.

### Suivi d'Athlètes
Soutien **individualisé** (entraînements, compétition, récupération) pour **maximiser les performances** et **minimiser le risque de blessure**. Service personnalisé selon vos besoins spécifiques.

### Pressothérapie
Technique de **récupération et régénération**, qui favorise le drainage, la circulation et une récupération plus rapide des muscles sollicités. Complément idéal au massage.

---

## 🎯 Mon Engagement

Je crois que chaque corps a besoin d'une **attention personnalisée**. C'est pourquoi mon travail se concentre sur la compréhension des besoins spécifiques de chaque athlète ou client — y compris l'historique, les objectifs, le niveau d'entraînement — pour offrir un service adapté.

Si vous êtes un **club, une salle de sport ou un athlète** à la recherche d'un partenaire de confiance pour soutenir la performance, la récupération et le bien-être, je suis entièrement disponible pour établir une collaboration.

---

📍 **Rua Joaquim Lagoa nº 30, Cabinet 3, 4445-480 Ermesinde**
📞 **939 805 348**
📸 **@fmmassagemdesportiva**`,
    metaTitle:
      "FM Massage Sportif | Filipe Monteiro - Ermesinde, Porto, Portugal",
    metaDescription:
      "FM Massage Sportif à Ermesinde - Massage sportif et thérapeutique avec Filipe Monteiro. Récupération musculaire, pressothérapie et suivi d'athlètes. Triathlète et masseur de l'équipe Radio Popular.",
  },
  de: {
    description: `## Wer Bin Ich?

Ich bin **Filipe Monteiro**, ein auf Sport- und therapeutische Massage spezialisierter Fachmann, mit Sitz in der Praxis in Rua Joaquim Lagoa Nr. 30, Kabinett 3, 4445-480 Ermesinde.

Mit einem Fokus auf **Leistung und Muskelregeneration** arbeite ich mit Athleten, Vereinen und regelmäßigen Sportlern, die ihr Niveau steigern oder die Erholung beschleunigen möchten.

🏊‍♂️ **Amateur-Langstrecken-Triathlet**
📚 **Ausbildung zum Masseur für Erholung und Rehabilitation**
🚴 **Masseur des Radsportteams Radio Popular Paredes Boavista**

---

## 💆 Was Ich Mache?

### Sportmassage
Ideal für die **Vorbereitung vor dem Training** und die **Erholung nach dem Training** oder Wettkampf. Verbessert die Leistung und beschleunigt die Muskelregeneration.

### Therapeutische Massage
Entwickelt, um **Kontrakturen zu lösen**, Muskelverspannungen zu lindern und **tiefe Entspannung** zu erreichen. Empfohlen für Menschen mit chronischen Schmerzen oder angesammeltem Stress.

### Athletenbetreuung
**Individualisierte** Unterstützung (Training, Wettkampf, Erholung) zur **Maximierung der Leistung** und **Minimierung des Verletzungsrisikos**. Personalisierter Service für Ihre spezifischen Bedürfnisse.

### Pressotherapie
**Erholungs- und Regenerationstechnik**, die Drainage, Durchblutung und schnellere Erholung beanspruchter Muskeln fördert. Ideale Ergänzung zur Massage.

---

## 🎯 Mein Engagement

Ich glaube, dass jeder Körper **persönliche Aufmerksamkeit** braucht. Deshalb konzentriert sich meine Arbeit darauf, die spezifischen Bedürfnisse jedes Athleten oder Kunden zu verstehen — einschließlich Vorgeschichte, Ziele, Trainingsniveau — um einen maßgeschneiderten Service anzubieten.

Wenn Sie ein **Verein, Fitnessstudio oder Athlet** sind, der einen vertrauenswürdigen Partner zur Unterstützung von Leistung, Erholung und Wohlbefinden sucht, stehe ich Ihnen gerne für eine Zusammenarbeit zur Verfügung.

---

📍 **Rua Joaquim Lagoa Nr. 30, Kabinett 3, 4445-480 Ermesinde**
📞 **939 805 348**
📸 **@fmmassagemdesportiva**`,
    metaTitle: "FM Sportmassage | Filipe Monteiro - Ermesinde, Porto, Portugal",
    metaDescription:
      "FM Sportmassage in Ermesinde - Sport- und therapeutische Massage mit Filipe Monteiro. Muskelregeneration, Pressotherapie und Athletenbetreuung. Triathlet und Masseur des Radio Popular Teams.",
  },
  it: {
    description: `## Chi Sono?

Sono **Filipe Monteiro**, professionista specializzato in massaggio sportivo e terapeutico, con sede nello studio situato in Rua Joaquim Lagoa nº 30, Studio 3, 4445-480 Ermesinde.

Con un approccio focalizzato su **performance e recupero muscolare**, lavoro con atleti, club e praticanti regolari che cercano di salire di livello o accelerare il recupero.

🏊‍♂️ **Triatleta amatoriale di lunga distanza**
📚 **Corso di massaggiatore per recupero e riabilitazione**
🚴 **Massaggiatore della squadra ciclismo Radio Popular Paredes Boavista**

---

## 💆 Cosa Faccio?

### Massaggio Sportivo
Ideale per la **preparazione pre-allenamento** e il **recupero post-allenamento** o competizione. Migliora le prestazioni e accelera la rigenerazione muscolare.

### Massaggio Terapeutico
Destinato ad **alleviare contratture**, tensioni muscolari e ottenere un **rilassamento profondo**. Indicato per chi soffre di dolori cronici o stress accumulato.

### Supporto Atleti
Supporto **individualizzato** (allenamenti, competizione, recupero) per **massimizzare le prestazioni** e **minimizzare il rischio di infortuni**. Servizio personalizzato per le tue esigenze specifiche.

### Pressoterapia
Tecnica di **recupero e rigenerazione**, che favorisce il drenaggio, la circolazione e un recupero più rapido della muscolatura sollecitata. Complemento ideale al massaggio.

---

## 🎯 Il Mio Impegno

Credo che ogni corpo abbia bisogno di **attenzione personalizzata**. Per questo, il mio lavoro si concentra sulla comprensione delle esigenze specifiche di ogni atleta o cliente — inclusi storia, obiettivi, livello di allenamento — per offrire un servizio su misura.

Se sei un **club, palestra o atleta** alla ricerca di un partner affidabile per supportare prestazioni, recupero e benessere, sono completamente disponibile a stabilire una collaborazione.

---

📍 **Rua Joaquim Lagoa nº 30, Studio 3, 4445-480 Ermesinde**
📞 **939 805 348**
📸 **@fmmassagemdesportiva**`,
    metaTitle:
      "FM Massaggio Sportivo | Filipe Monteiro - Ermesinde, Porto, Portogallo",
    metaDescription:
      "FM Massaggio Sportivo a Ermesinde - Massaggio sportivo e terapeutico con Filipe Monteiro. Recupero muscolare, pressoterapia e supporto atleti. Triatleta e massaggiatore della squadra Radio Popular.",
  },
};

// ==============================================================================
// VENUE DATA
// ==============================================================================

const venueData = {
  slug: VENUE_SLUG,
  name: "FM Massagem Desportiva",
  // Default description in Portuguese (main language)
  description: translations.pt.description,
  city: "Ermesinde",
  country: "Portugal",
  address: "Rua Joaquim Lagoa nº 30, Gabinete 3, 4445-480 Ermesinde",
  phone: "939805348",
  email: null,
  website: null,
  instagram: "fmmassagemdesportiva",
  latitude: COORDINATES.latitude,
  longitude: COORDINATES.longitude,
  isVerified: true,
  isActive: true,
  paymentMode: "EXTERNAL" as const,
  externalPaymentInstructions:
    "Marcações por telefone (939 805 348) ou mensagem no Instagram @fmmassagemdesportiva",
};

// ==============================================================================
// PLANS (Services with pricing - prices TBD, using placeholder)
// ==============================================================================

const plans = [
  {
    name: "Massagem Desportiva",
    description:
      "Massagem desportiva ideal para preparação pré-treino e recuperação pós-treino ou competição. Melhora a performance e acelera a regeneração muscular.",
    price: null, // Preço a definir
    isActive: true,
  },
  {
    name: "Massagem Terapêutica",
    description:
      "Massagem terapêutica destinada a aliviar contracturas, tensões musculares e conseguir relaxamento profundo. Indicada para dores crónicas ou stress acumulado.",
    price: null, // Preço a definir
    isActive: true,
  },
  {
    name: "Acompanhamento de Atletas",
    description:
      "Apoio individualizado para atletas incluindo treinos, competição e recuperação. Serviço personalizado para maximizar rendimento e minimizar risco de lesão.",
    price: null, // Preço a definir
    isActive: true,
  },
  {
    name: "Pressoterapia",
    description:
      "Técnica de recuperação e regeneração que favorece drenagem, circulação e recuperação mais rápida de musculatura exigida. Complemento ideal à massagem.",
    price: null, // Preço a definir
    isActive: true,
  },
];

// ==============================================================================
// SEED FUNCTION
// ==============================================================================

async function seedFMMassagemDesportiva() {
  console.log("🌱 Seeding FM Massagem Desportiva venue...");
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
    console.log(`   📍 Address: ${venue.address}`);
    console.log(`   📞 Phone: ${venue.phone}`);
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

      const priceDisplay = createdPlan.price
        ? `€${createdPlan.price.toFixed(2)}`
        : "A consultar";
      console.log(`   ✅ ${createdPlan.name}: ${priceDisplay}`);
    }

    console.log("\n=====================================");
    console.log("🎉 FM Massagem Desportiva seed completed successfully!");
    console.log(`\n📱 View at: /venues/${venue.slug}`);
    console.log("=====================================\n");

    return venue;
  } catch (error) {
    console.error("❌ Error seeding FM Massagem Desportiva:", error);
    throw error;
  }
}

// ==============================================================================
// MAIN EXECUTION
// ==============================================================================

async function main() {
  try {
    await seedFMMassagemDesportiva();
  } catch (error) {
    console.error("Failed to seed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
