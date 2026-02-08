import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding III BTT de Ferreira de Aves 2026...");

  const event = await prisma.event.upsert({
    where: { slug: "iii-btt-ferreira-aves-2026" },
    update: {
      title: "III BTT de Ferreira de Aves 2026",
      description: "BTT por trilhos e aldeias de Ferreira de Aves",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-29T09:00:00.000Z"),
      endDate: new Date("2026-03-29T15:00:00.000Z"),
      city: "Ferreira de Aves",
      country: "Portugal",
      latitude: 40.7931,
      longitude: -7.691,
      googleMapsUrl: "https://maps.google.com/?q=Lamas+Ferreira+de+Aves+Sátão",
      externalUrl: "",
      imageUrl: "",
      isFeatured: false,
    },
    create: {
      slug: "iii-btt-ferreira-aves-2026",
      title: "III BTT de Ferreira de Aves 2026",
      description: "BTT por trilhos e aldeias de Ferreira de Aves",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-29T09:00:00.000Z"),
      endDate: new Date("2026-03-29T15:00:00.000Z"),
      city: "Ferreira de Aves",
      country: "Portugal",
      latitude: 40.7931,
      longitude: -7.691,
      googleMapsUrl: "https://maps.google.com/?q=Lamas+Ferreira+de+Aves+Sátão",
      externalUrl: "",
      imageUrl: "",
      isFeatured: false,
    },
  });

  console.log(`✅ Event created/updated: ${event.slug}`);

  const eventTranslations = {
    pt: {
      title: "III BTT de Ferreira de Aves 2026",
      description: `# 🚵 III BTT de Ferreira de Aves 2026

**3ª Edição** do BTT de Ferreira de Aves! Descobre as paisagens e trilhos da freguesia de Ferreira de Aves, concelho de Sátão, numa manhã de BTT inesquecível.

## 🏞️ Dois Percursos Disponíveis

**Passeio 15 km:** Ideal para famílias e iniciantes
**Passeio 25 km:** Para praticantes regulares
**Competição 50 km:** Para atletas experientes

Todos os percursos começam e terminam no Largo da Feira de Lamas.

## ✨ Destaques

- **Trilhos naturais** - estradas, caminhos, trilhos e zonas rurais
- **Ambiente familiar** - idade mínima 15 anos (máxima 75 anos)
- **Classificação completa** - múltiplos escalões competitivos
- **Prémios monetários** - Top 3 geral masculino e feminino
- **Organização premium** - apoio dos Bombeiros de Sátão e GNR

## 🎯 O Que Está Incluído (15€)

- Participação no evento
- Almoço convívio opcional (+8€ para atleta)
- Classificação geral e por escalões (competição)
- Lembranças de participação
- Seguro de acidentes pessoais e responsabilidade civil
- Abastecimentos sólidos e líquidos
- Apoio logístico completo
- Banhos no pavilhão gimnodesportivo
- Zona de lavagem de bicicletas

### 🏅 Escalões Competição (50 km)

**Masculinos:** Sub-18, Sub-19, Sub-23/Elites, Veteranos A/B/C/D
**Femininos:** Sub-18, Sub-19, Sub-23/Elites, Veteranas A/B/C

**Organização:** Junta de Freguesia de Ferreira de Aves

Vem conhecer os trilhos de Ferreira de Aves! 🌲🚴‍♀️`,
      city: "Ferreira de Aves",
      metaTitle:
        "III BTT Ferreira de Aves 2026 | Sátão | 15km 25km 50km | 29 Março",
      metaDescription:
        "3ª Edição BTT Ferreira de Aves. Três percursos: Passeio 15km, 25km e Competição 50km. Prémios monetários. Sátão, 29 Março 2026.",
    },
    en: {
      title: "3rd Ferreira de Aves MTB 2026",
      description: `# 🚵 3rd Ferreira de Aves MTB 2026

**3rd Edition** of Ferreira de Aves MTB! Discover the landscapes and trails of Ferreira de Aves parish, Sátão municipality, in an unforgettable morning of MTB.

## 🏞️ Three Routes Available

**15 km Ride:** Ideal for families and beginners
**25 km Ride:** For regular riders
**50 km Competition:** For experienced athletes

All routes start and finish at Largo da Feira de Lamas.

## ✨ Highlights

- **Natural trails** - roads, paths, trails and rural areas
- **Family-friendly** - minimum age 15 (maximum 75)
- **Complete classification** - multiple competitive categories
- **Cash prizes** - Top 3 overall men and women
- **Premium organization** - support from Sátão Firefighters and GNR

## 🎯 What's Included (15€)

- Event participation
- Optional lunch (+8€ for athlete)
- Overall and age category classification (competition)
- Participation souvenirs
- Personal accident and liability insurance
- Solid and liquid refreshments
- Complete logistical support
- Showers at sports pavilion
- Bike wash area

### 🏅 Competition Categories (50 km)

**Men:** Under-18, Under-19, Under-23/Elite, Veterans A/B/C/D
**Women:** Under-18, Under-19, Under-23/Elite, Veterans A/B/C

**Organizer:** Parish Council of Ferreira de Aves

Come explore Ferreira de Aves trails! 🌲🚴‍♀️`,
      city: "Ferreira de Aves",
      metaTitle:
        "3rd Ferreira de Aves MTB 2026 | Sátão | 15km 25km 50km | March 29",
      metaDescription:
        "3rd Edition Ferreira de Aves MTB. Three routes: 15km, 25km Ride and 50km Competition. Cash prizes. Sátão, March 29, 2026.",
    },
    es: {
      title: "III BTT de Ferreira de Aves 2026",
      description: `# 🚵 III BTT de Ferreira de Aves 2026

**3ª Edición** del BTT de Ferreira de Aves! Descubre los paisajes y senderos de la freguesia de Ferreira de Aves, municipio de Sátão.

## 🏞️ Tres Recorridos Disponibles

**Paseo 15 km:** Ideal para familias y principiantes
**Paseo 25 km:** Para ciclistas regulares
**Competición 50 km:** Para atletas experimentados

## 🎯 Qué Está Incluido (15€)

- Participación
- Almuerzo opcional (+8€)
- Clasificación completa
- Recuerdos
- Seguro
- Avituallamientos
- Apoyo logístico
- Duchas y lavado de bicicletas

**Organización:** Junta de Freguesia de Ferreira de Aves`,
      city: "Ferreira de Aves",
      metaTitle:
        "III BTT Ferreira de Aves 2026 | Sátão | 15km 25km 50km | 29 Marzo",
      metaDescription:
        "3ª Edición BTT Ferreira de Aves. Tres recorridos: 15km, 25km y Competición 50km. Sátão, 29 Marzo 2026.",
    },
    fr: {
      title: "III BTT de Ferreira de Aves 2026",
      description: `# 🚵 III BTT de Ferreira de Aves 2026

**3ème Édition** du BTT de Ferreira de Aves! Découvrez les paysages et sentiers de Ferreira de Aves, municipalité de Sátão.

## 🏞️ Trois Parcours Disponibles

**Balade 15 km:** Idéal familles et débutants
**Balade 25 km:** Pour cyclistes réguliers
**Compétition 50 km:** Pour athlètes expérimentés

## 🎯 Ce Qui Est Inclus (15€)

- Participation
- Déjeuner optionnel (+8€)
- Classification
- Souvenirs
- Assurance
- Ravitaillements
- Support logistique
- Douches et lavage vélos

**Organisation:** Conseil Paroissial Ferreira de Aves`,
      city: "Ferreira de Aves",
      metaTitle:
        "III BTT Ferreira de Aves 2026 | Sátão | 15km 25km 50km | 29 Mars",
      metaDescription:
        "3ème Édition BTT Ferreira de Aves. Trois parcours: 15km, 25km et Compétition 50km. Sátão, 29 Mars 2026.",
    },
    de: {
      title: "III BTT Ferreira de Aves 2026",
      description: `# 🚵 III BTT Ferreira de Aves 2026

**3. Ausgabe** des BTT Ferreira de Aves! Entdecken Sie die Landschaften und Trails von Ferreira de Aves, Gemeinde Sátão.

## 🏞️ Drei Strecken Verfügbar

**15 km Fahrt:** Ideal für Familien und Anfänger
**25 km Fahrt:** Für regelmäßige Fahrer
**50 km Wettkampf:** Für erfahrene Athleten

## 🎯 Was Ist Enthalten (15€)

- Teilnahme
- Optionales Mittagessen (+8€)
- Klassifizierung
- Souvenirs
- Versicherung
- Verpflegung
- Logistische Unterstützung
- Duschen und Fahrradwäsche

**Veranstalter:** Gemeinderat Ferreira de Aves`,
      city: "Ferreira de Aves",
      metaTitle:
        "III BTT Ferreira de Aves 2026 | Sátão | 15km 25km 50km | 29. März",
      metaDescription:
        "3. Ausgabe BTT Ferreira de Aves. Drei Strecken: 15km, 25km und Wettkampf 50km. Sátão, 29. März 2026.",
    },
    it: {
      title: "III BTT de Ferreira de Aves 2026",
      description: `# 🚵 III BTT de Ferreira de Aves 2026

**3a Edizione** del BTT di Ferreira de Aves! Scopri i paesaggi e i sentieri di Ferreira de Aves, comune di Sátão.

## 🏞️ Tre Percorsi Disponibili

**Giro 15 km:** Ideale per famiglie e principianti
**Giro 25 km:** Per ciclisti regolari
**Competizione 50 km:** Per atleti esperti

## 🎯 Cosa È Incluso (15€)

- Partecipazione
- Pranzo opzionale (+8€)
- Classificazione
- Souvenir
- Assicurazione
- Ristori
- Supporto logistico
- Docce e lavaggio bici

**Organizzatore:** Consiglio Parrocchiale Ferreira de Aves`,
      city: "Ferreira de Aves",
      metaTitle:
        "III BTT Ferreira de Aves 2026 | Sátão | 15km 25km 50km | 29 Marzo",
      metaDescription:
        "3a Edizione BTT Ferreira de Aves. Tre percorsi: 15km, 25km e Competizione 50km. Sátão, 29 Marzo 2026.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: { eventId: event.id, language: Language[lang] },
      },
      update: eventTranslations[lang],
      create: {
        eventId: event.id,
        language: Language[lang],
        ...eventTranslations[lang],
      },
    });
  }

  console.log("\n🚵 Creating variants...");

  // Helper function to find or create variant
  const findOrCreateVariant = async (variantData: {
    name: string;
    distanceKm: number;
    elevationGainM?: number;
    elevationLossM?: number;
    startTime: string;
    startDate: Date;
    maxParticipants?: number;
    cutoffTimeHours?: number;
    itraPoints?: number | null;
    atrpGrade?: number | null;
    mountainLevel?: number | null;
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

  const passeio15Variant = await findOrCreateVariant({
    name: "Passeio 15 km",
    distanceKm: 15,
    elevationGainM: 200,
    elevationLossM: 200,
    startDate: new Date("2026-03-29T09:00:00.000Z"),
    startTime: "09:00",
    maxParticipants: 200,
    cutoffTimeHours: 2.0,
    itraPoints: null,
    atrpGrade: 1,
    mountainLevel: 1,
  });

  const passeio25Variant = await findOrCreateVariant({
    name: "Passeio 25 km",
    distanceKm: 25,
    elevationGainM: 400,
    elevationLossM: 400,
    startDate: new Date("2026-03-29T09:00:00.000Z"),
    startTime: "09:00",
    maxParticipants: 200,
    cutoffTimeHours: 3.0,
    itraPoints: null,
    atrpGrade: 2,
    mountainLevel: 2,
  });

  const competicao50Variant = await findOrCreateVariant({
    name: "Competição 50 km",
    distanceKm: 50,
    elevationGainM: 900,
    elevationLossM: 900,
    startDate: new Date("2026-03-29T09:00:00.000Z"),
    startTime: "09:00",
    maxParticipants: 200,
    cutoffTimeHours: 5.0,
    itraPoints: null,
    atrpGrade: 3,
    mountainLevel: 2,
  });

  console.log("   ✅ Passeio 15 km created/updated");
  console.log("   ✅ Passeio 25 km created/updated");
  console.log("   ✅ Competição 50 km created/updated");

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: passeio15Variant.id,
          language: Language[lang],
        },
      },
      update: {
        name: "Passeio 15 km",
        description:
          "Percurso recreativo de 15 km ideal para famílias e iniciantes.",
      },
      create: {
        variantId: passeio15Variant.id,
        language: Language[lang],
        name: "Passeio 15 km",
        description:
          "Percurso recreativo de 15 km ideal para famílias e iniciantes.",
      },
    });
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: passeio25Variant.id,
          language: Language[lang],
        },
      },
      update: {
        name: "Passeio 25 km",
        description: "Percurso recreativo de 25 km para praticantes regulares.",
      },
      create: {
        variantId: passeio25Variant.id,
        language: Language[lang],
        name: "Passeio 25 km",
        description: "Percurso recreativo de 25 km para praticantes regulares.",
      },
    });
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: competicao50Variant.id,
          language: Language[lang],
        },
      },
      update: {
        name: "Competição 50 km",
        description:
          "Prova competitiva de 50 km com classificação oficial e prémios.",
      },
      create: {
        variantId: competicao50Variant.id,
        language: Language[lang],
        name: "Competição 50 km",
        description:
          "Prova competitiva de 50 km com classificação oficial e prémios.",
      },
    });
  }

  const findOrCreatePricingPhase = async (
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
    return existing
      ? await prisma.pricingPhase.update({ where: { id: existing.id }, data })
      : await prisma.pricingPhase.create({
          data: { eventId: event.id, name, ...data },
        });
  };

  await findOrCreatePricingPhase("Inscrição sem Almoço", {
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    endDate: new Date("2026-03-23T23:59:00.000Z"),
    price: 15.0,
    currency: Currency.EUR,
    note: "Participação sem almoço",
  });

  await findOrCreatePricingPhase("Acompanhante com Almoço", {
    startDate: new Date("2026-01-01T00:00:00.000Z"),
    endDate: new Date("2026-03-23T23:59:00.000Z"),
    price: 8.0,
    currency: Currency.EUR,
    note: "Apenas almoço para acompanhantes",
  });

  console.log(
    "\n🎉 III BTT de Ferreira de Aves 2026 seed completed successfully!"
  );
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
