/**
 * Seed: 4ª Edição do SPT Serra Galega 2026
 * Location: Vila Chã, Serra Galega, Alenquer, Portugal
 * Date: April 19, 2026
 * Sport: Trail Running
 * Source: https://www.recordepessoal.pt/evento/4edicaodosptserragalega
 */

import { PrismaClient, SportType, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function seedSPTSerraGalega2026() {
  console.log("🌲 Seeding: 4ª Edição do SPT Serra Galega 2026...");

  const slug = "spt-serra-galega-2026";

  // Check if event already exists
  const existingEvent = await prisma.event.findUnique({
    where: { slug },
  });

  if (existingEvent) {
    console.log(`⚠️  Event "${slug}" already exists. Deleting...`);
    await prisma.event.delete({ where: { slug } });
    console.log(`✅ Event deleted. Creating new one...`);
  }

  // Translations for all 6 supported languages
  const translations = {
    pt: {
      title: "4ª Edição do SPT Serra Galega",
      description: `A Equipa SPT (Sabores do Paço Trail Zatopeques), com o apoio do Município de Alenquer, Junta de Freguesia da Ventosa, Junta de Freguesia Vila Verde dos Francos, e restantes patrocinadores propõem-se a realizar este evento para promover e divulgar a Região da Serra Galega, bem como a fomentação de hábitos saudáveis junto das populações locais.

**Objetivo**

Temos como objetivo a satisfação de todos os envolvidos, dando-lhes a conhecer os melhores trilhos desta Serra.

**Percursos**

Todos os percursos serão circulares, terão início e fim junto ao Centro Social Recreativo de Vila Chã. Os percursos são compostos na sua maioria por caminhos, estradões e trilhos técnicos com as devidas subidas e descidas que a Serra Galega proporciona. Grau de dificuldade média para as provas de trail e dificuldade baixa para a caminhada.

**Abastecimentos**

- Trail 21km: dois abastecimentos sólidos
- Mini Trail e Caminhada: um abastecimento intermédio
- Abastecimento final de sólidos e líquidos comum a todos

**Material Obrigatório**

- Documento de identificação
- Telemóvel operacional
- Copo ou recipiente similar (não serão disponibilizados copos)

**Material Aconselhado**

- Manta térmica
- Recipiente com pelo menos 500ml de líquido
- Calçado apropriado
- Corta-vento ou impermeável

**O que está incluído**

Trail e Mini Trail:
- Seguro desportivo obrigatório
- Dorsal personalizado
- Direito a banho nos balneários da Escola Primária de Vila Chã
- Abastecimentos sólidos e líquidos
- Cronometragem eletrónica
- Prémio finisher

Caminhada:
- Seguro desportivo obrigatório
- Direito a banho
- Abastecimentos sólidos e líquidos

**Trail Kids SPT** (18 de Abril)

Prova para crianças e jovens dos 6 aos 14 anos, dividida em escalões:
- SUB10 (6-8 anos): 500m
- SUB12 (9-11 anos): 1km
- SUB16 (12-14 anos): 2km

Sem classificação competitiva - objetivo é promover diversão, participação e espírito desportivo. Todos recebem medalha de finisher.

**Limite de Inscrições**: 400 participantes no total

**Informações**

Para mais informações, consultar o regulamento completo em: [Recorde Pessoal](https://www.recordepessoal.pt/evento/4edicaodosptserragalega)`,
      city: "Alenquer",
      metaTitle:
        "4ª Edição do SPT Serra Galega 2026 | Vila Chã, Alenquer | 19 Abril",
      metaDescription:
        "4ª Edição do SPT Serra Galega a 19 de abril de 2026 em Vila Chã, Alenquer. Provas: Trail 21km, Mini Trail 13km, Caminhada 13km e Trail Kids. Limite de 400 inscrições. Organização Sabores do Paço Trail Zatopeques.",
    },
    en: {
      title: "4th Edition of SPT Serra Galega",
      description: `The SPT Team (Sabores do Paço Trail Zatopeques), with the support of Alenquer Municipality, Ventosa Parish Council, Vila Verde dos Francos Parish Council, and other sponsors, propose to hold this event to promote and publicize the Serra Galega Region, as well as encourage healthy habits among local populations.

**Objective**

Our goal is the satisfaction of all involved, introducing them to the best trails of this mountain range.

**Routes**

All routes are circular, starting and finishing at the Vila Chã Social Recreation Center. The routes consist mostly of paths, dirt roads and technical trails with the climbs and descents that Serra Galega provides. Medium difficulty level for trail races and low difficulty for the walk.

**Aid Stations**

- Trail 21km: two solid aid stations
- Mini Trail and Walk: one intermediate station
- Final aid station with food and drinks for everyone

**Mandatory Equipment**

- Identification document
- Operational mobile phone
- Cup or similar container (cups will not be provided)

**Recommended Equipment**

- Thermal blanket
- Container with at least 500ml of liquid
- Appropriate footwear
- Windbreaker or waterproof jacket

**What's Included**

Trail and Mini Trail:
- Mandatory sports insurance
- Personalized bib
- Access to showers at Vila Chã Primary School
- Food and drink aid stations
- Electronic timing
- Finisher prize

Walk:
- Mandatory sports insurance
- Access to showers
- Food and drink aid stations

**SPT Trail Kids** (April 18)

Race for children and young people aged 6 to 14, divided into categories:
- U10 (6-8 years): 500m
- U12 (9-11 years): 1km
- U16 (12-14 years): 2km

Non-competitive - aim is to promote fun, participation and sportsmanship. Everyone receives a finisher medal.

**Registration Limit**: 400 total participants

**Information**

For more information, check the complete regulations at: [Recorde Pessoal](https://www.recordepessoal.pt/evento/4edicaodosptserragalega)`,
      city: "Alenquer",
      metaTitle:
        "4th Edition of SPT Serra Galega 2026 | Vila Chã, Alenquer | April 19",
      metaDescription:
        "4th Edition of SPT Serra Galega on April 19, 2026 in Vila Chã, Alenquer. Races: Trail 21km, Mini Trail 13km, Walk 13km and Trail Kids. 400 registration limit. Organized by Sabores do Paço Trail Zatopeques.",
    },
    es: {
      title: "4ª Edición del SPT Serra Galega",
      description: `El Equipo SPT (Sabores do Paço Trail Zatopeques), con el apoyo del Municipio de Alenquer, Junta de Freguesia de Ventosa, Junta de Freguesia Vila Verde dos Francos, y demás patrocinadores se proponen realizar este evento para promover y divulgar la Región de Serra Galega, así como fomentar hábitos saludables entre las poblaciones locales.

**Objetivo**

Tenemos como objetivo la satisfacción de todos los involucrados, dándoles a conocer los mejores senderos de esta Sierra.

**Recorridos**

Todos los recorridos serán circulares, tendrán inicio y fin junto al Centro Social Recreativo de Vila Chã. Los recorridos se componen mayoritariamente de caminos, pistas y senderos técnicos con las subidas y bajadas que proporciona Serra Galega. Grado de dificultad media para las pruebas de trail y dificultad baja para la caminata.

**Avituallamientos**

- Trail 21km: dos avituallamientos sólidos
- Mini Trail y Caminata: un avituallamiento intermedio
- Avituallamiento final de sólidos y líquidos común a todos

**Material Obligatorio**

- Documento de identificación
- Teléfono móvil operativo
- Vaso o recipiente similar (no se proporcionarán vasos)

**Material Recomendado**

- Manta térmica
- Recipiente con al menos 500ml de líquido
- Calzado apropiado
- Cortavientos o impermeable

**Qué está incluido**

Trail y Mini Trail:
- Seguro deportivo obligatorio
- Dorsal personalizado
- Derecho a ducha en los vestuarios de la Escuela Primaria de Vila Chã
- Avituallamientos sólidos y líquidos
- Cronometraje electrónico
- Premio finisher

Caminata:
- Seguro deportivo obligatorio
- Derecho a ducha
- Avituallamientos sólidos y líquidos

**Trail Kids SPT** (18 de Abril)

Prueba para niños y jóvenes de 6 a 14 años, dividida en categorías:
- SUB10 (6-8 años): 500m
- SUB12 (9-11 años): 1km
- SUB16 (12-14 años): 2km

Sin clasificación competitiva - objetivo es promover diversión, participación y espíritu deportivo. Todos reciben medalla finisher.

**Límite de Inscripciones**: 400 participantes en total

**Información**

Para más información, consultar el reglamento completo en: [Recorde Pessoal](https://www.recordepessoal.pt/evento/4edicaodosptserragalega)`,
      city: "Alenquer",
      metaTitle:
        "4ª Edición del SPT Serra Galega 2026 | Vila Chã, Alenquer | 19 Abril",
      metaDescription:
        "4ª Edición del SPT Serra Galega el 19 de abril de 2026 en Vila Chã, Alenquer. Pruebas: Trail 21km, Mini Trail 13km, Caminata 13km y Trail Kids. Límite de 400 inscripciones. Organización Sabores do Paço Trail Zatopeques.",
    },
    fr: {
      title: "4ème Édition du SPT Serra Galega",
      description: `L'Équipe SPT (Sabores do Paço Trail Zatopeques), avec le soutien de la Municipalité d'Alenquer, du Conseil de Paroisse de Ventosa, du Conseil de Paroisse Vila Verde dos Francos, et d'autres sponsors se proposent d'organiser cet événement pour promouvoir et faire connaître la Région de Serra Galega, ainsi que pour encourager des habitudes saines auprès des populations locales.

**Objectif**

Notre objectif est la satisfaction de tous les participants, en leur faisant découvrir les meilleurs sentiers de cette montagne.

**Parcours**

Tous les parcours sont circulaires, avec départ et arrivée au Centre Social Récréatif de Vila Chã. Les parcours se composent principalement de chemins, pistes et sentiers techniques avec les montées et descentes que propose Serra Galega. Niveau de difficulté moyen pour les trails et difficulté faible pour la randonnée.

**Ravitaillements**

- Trail 21km : deux ravitaillements solides
- Mini Trail et Randonnée : un ravitaillement intermédiaire
- Ravitaillement final solide et liquide commun à tous

**Équipement Obligatoire**

- Document d'identité
- Téléphone portable opérationnel
- Gobelet ou récipient similaire (les gobelets ne seront pas fournis)

**Équipement Recommandé**

- Couverture thermique
- Récipient avec au moins 500ml de liquide
- Chaussures appropriées
- Coupe-vent ou imperméable

**Ce qui est inclus**

Trail et Mini Trail :
- Assurance sportive obligatoire
- Dossard personnalisé
- Accès aux douches de l'École Primaire de Vila Chã
- Ravitaillements solides et liquides
- Chronométrage électronique
- Prix finisher

Randonnée :
- Assurance sportive obligatoire
- Accès aux douches
- Ravitaillements solides et liquides

**Trail Kids SPT** (18 Avril)

Course pour enfants et jeunes de 6 à 14 ans, divisée en catégories :
- U10 (6-8 ans) : 500m
- U12 (9-11 ans) : 1km
- U16 (12-14 ans) : 2km

Sans classement compétitif - objectif de promouvoir plaisir, participation et esprit sportif. Tous reçoivent une médaille finisher.

**Limite d'Inscriptions** : 400 participants au total

**Informations**

Pour plus d'informations, consulter le règlement complet sur : [Recorde Pessoal](https://www.recordepessoal.pt/evento/4edicaodosptserragalega)`,
      city: "Alenquer",
      metaTitle:
        "4ème Édition du SPT Serra Galega 2026 | Vila Chã, Alenquer | 19 Avril",
      metaDescription:
        "4ème Édition du SPT Serra Galega le 19 avril 2026 à Vila Chã, Alenquer. Courses : Trail 21km, Mini Trail 13km, Randonnée 13km et Trail Kids. Limite de 400 inscriptions. Organisation Sabores do Paço Trail Zatopeques.",
    },
    de: {
      title: "4. Ausgabe des SPT Serra Galega",
      description: `Das SPT-Team (Sabores do Paço Trail Zatopeques) schlägt mit Unterstützung der Gemeinde Alenquer, des Gemeinderats Ventosa, des Gemeinderats Vila Verde dos Francos und anderer Sponsoren vor, diese Veranstaltung durchzuführen, um die Region Serra Galega zu fördern und bekannt zu machen sowie gesunde Gewohnheiten bei der lokalen Bevölkerung zu fördern.

**Ziel**

Unser Ziel ist die Zufriedenheit aller Beteiligten und ihnen die besten Wanderwege dieser Bergkette vorzustellen.

**Strecken**

Alle Strecken sind Rundstrecken mit Start und Ziel am Sozial- und Freizeitzentrum Vila Chã. Die Strecken bestehen hauptsächlich aus Wegen, Schotterstraßen und technischen Pfaden mit den Auf- und Abstiegen, die Serra Galega bietet. Mittlerer Schwierigkeitsgrad für Trail-Rennen und geringer Schwierigkeitsgrad für die Wanderung.

**Verpflegungsstationen**

- Trail 21km: zwei feste Verpflegungsstationen
- Mini Trail und Wanderung: eine Zwischenstation
- Finale Verpflegungsstation mit Essen und Getränken für alle

**Pflichtausrüstung**

- Ausweisdokument
- Funktionsfähiges Mobiltelefon
- Becher oder ähnlicher Behälter (Becher werden nicht bereitgestellt)

**Empfohlene Ausrüstung**

- Thermodecke
- Behälter mit mindestens 500ml Flüssigkeit
- Geeignetes Schuhwerk
- Windjacke oder wasserdichte Jacke

**Was ist inbegriffen**

Trail und Mini Trail:
- Obligatorische Sportversicherung
- Personalisierte Startnummer
- Zugang zu Duschen in der Grundschule Vila Chã
- Verpflegungsstationen mit Essen und Getränken
- Elektronische Zeitmessung
- Finisher-Preis

Wanderung:
- Obligatorische Sportversicherung
- Zugang zu Duschen
- Verpflegungsstationen mit Essen und Getränken

**SPT Trail Kids** (18. April)

Rennen für Kinder und Jugendliche im Alter von 6 bis 14 Jahren, aufgeteilt in Kategorien:
- U10 (6-8 Jahre): 500m
- U12 (9-11 Jahre): 1km
- U16 (12-14 Jahre): 2km

Nicht wettbewerbsorientiert - Ziel ist Spaß, Teilnahme und Sportgeist zu fördern. Jeder erhält eine Finisher-Medaille.

**Registrierungslimit**: 400 Teilnehmer insgesamt

**Informationen**

Für weitere Informationen siehe vollständige Regeln unter: [Recorde Pessoal](https://www.recordepessoal.pt/evento/4edicaodosptserragalega)`,
      city: "Alenquer",
      metaTitle:
        "4. Ausgabe des SPT Serra Galega 2026 | Vila Chã, Alenquer | 19. April",
      metaDescription:
        "4. Ausgabe des SPT Serra Galega am 19. April 2026 in Vila Chã, Alenquer. Rennen: Trail 21km, Mini Trail 13km, Wanderung 13km und Trail Kids. Limit von 400 Anmeldungen. Organisiert von Sabores do Paço Trail Zatopeques.",
    },
    it: {
      title: "4ª Edizione del SPT Serra Galega",
      description: `Il Team SPT (Sabores do Paço Trail Zatopeques), con il supporto del Comune di Alenquer, del Consiglio Parrocchiale di Ventosa, del Consiglio Parrocchiale Vila Verde dos Francos e altri sponsor, si propongono di realizzare questo evento per promuovere e divulgare la Regione di Serra Galega, oltre a incoraggiare abitudini sane tra le popolazioni locali.

**Obiettivo**

Il nostro obiettivo è la soddisfazione di tutti i partecipanti, facendo loro conoscere i migliori sentieri di questa montagna.

**Percorsi**

Tutti i percorsi sono circolari, con partenza e arrivo al Centro Sociale Ricreativo di Vila Chã. I percorsi sono composti principalmente da sentieri, strade sterrate e percorsi tecnici con le salite e discese che Serra Galega offre. Livello di difficoltà medio per i trail e difficoltà bassa per la camminata.

**Ristori**

- Trail 21km: due ristori solidi
- Mini Trail e Camminata: un ristoro intermedio
- Ristoro finale con cibo e bevande per tutti

**Equipaggiamento Obbligatorio**

- Documento di identità
- Telefono cellulare funzionante
- Bicchiere o contenitore simile (i bicchieri non saranno forniti)

**Equipaggiamento Consigliato**

- Coperta termica
- Contenitore con almeno 500ml di liquido
- Calzature appropriate
- Giacca antivento o impermeabile

**Cosa è incluso**

Trail e Mini Trail:
- Assicurazione sportiva obbligatoria
- Pettorale personalizzato
- Accesso alle docce della Scuola Primaria di Vila Chã
- Ristori solidi e liquidi
- Cronometraggio elettronico
- Premio finisher

Camminata:
- Assicurazione sportiva obbligatoria
- Accesso alle docce
- Ristori solidi e liquidi

**Trail Kids SPT** (18 Aprile)

Gara per bambini e ragazzi dai 6 ai 14 anni, divisa in categorie:
- U10 (6-8 anni): 500m
- U12 (9-11 anni): 1km
- U16 (12-14 anni): 2km

Non competitivo - l'obiettivo è promuovere divertimento, partecipazione e spirito sportivo. Tutti ricevono una medaglia finisher.

**Limite di Iscrizioni**: 400 partecipanti totali

**Informazioni**

Per ulteriori informazioni, consultare il regolamento completo su: [Recorde Pessoal](https://www.recordepessoal.pt/evento/4edicaodosptserragalega)`,
      city: "Alenquer",
      metaTitle:
        "4ª Edizione del SPT Serra Galega 2026 | Vila Chã, Alenquer | 19 Aprile",
      metaDescription:
        "4ª Edizione del SPT Serra Galega il 19 aprile 2026 a Vila Chã, Alenquer. Gare: Trail 21km, Mini Trail 13km, Camminata 13km e Trail Kids. Limite di 400 iscrizioni. Organizzato da Sabores do Paço Trail Zatopeques.",
    },
  };

  // Event variants with pricing phases
  const variants = [
    {
      name: "Trail 21km",
      distanceKm: 21,
      elevationGainM: null, // Not specified in source
      maxParticipants: null,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-02-28T23:59:59Z"),
          price: 18.0,
          currency: Currency.EUR,
          note: null,
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-03-01T00:00:00Z"),
          endDate: new Date("2026-04-08T23:59:59Z"),
          price: 21.0,
          currency: Currency.EUR,
          note: null,
        },
      ],
    },
    {
      name: "Mini Trail 13km",
      distanceKm: 13,
      elevationGainM: null,
      maxParticipants: null,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-02-28T23:59:59Z"),
          price: 14.0,
          currency: Currency.EUR,
          note: null,
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-03-01T00:00:00Z"),
          endDate: new Date("2026-04-08T23:59:59Z"),
          price: 16.0,
          currency: Currency.EUR,
          note: null,
        },
      ],
    },
    {
      name: "Caminhada 13km",
      distanceKm: 13,
      elevationGainM: null,
      maxParticipants: null,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-02-28T23:59:59Z"),
          price: 10.0,
          currency: Currency.EUR,
          note: null,
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-03-01T00:00:00Z"),
          endDate: new Date("2026-04-08T23:59:59Z"),
          price: 12.0,
          currency: Currency.EUR,
          note: null,
        },
      ],
    },
    {
      name: "Trail Kids SPT",
      distanceKm: null, // Variable: 0.5km, 1km, 2km depending on age category
      elevationGainM: null,
      maxParticipants: null,
      pricingPhases: [
        {
          name: "Inscrição",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-04-08T23:59:59Z"),
          price: 0.0, // Price not specified - using 0 as placeholder
          currency: Currency.EUR,
          note: "Prova realizada no dia 18 de abril (dia anterior ao evento principal)",
        },
      ],
    },
  ];

  console.log("📅 Creating event...");

  // Create the event
  const event = await prisma.event.create({
    data: {
      slug,
      title: "4ª Edição do SPT Serra Galega", // Fallback PT title
      description: "Trail running event na Serra Galega, Alenquer", // Fallback PT description
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-04-19T09:00:00Z"), // 9:00 AM start time
      endDate: null,
      city: "Alenquer",
      country: "PT",
      latitude: 39.12052778941647,
      longitude: -9.121053168231999,
      externalUrl:
        "https://www.recordepessoal.pt/evento/4edicaodosptserragalega",
      imageUrl: null, // No image as requested
      registrationDeadline: new Date("2026-04-08T23:59:59Z"),
    },
  });

  console.log(`✅ Created event: ${event.slug}`);

  console.log("🌍 Creating translations...");

  // Create translations for all 6 languages
  for (const lang of Object.keys(translations) as Array<
    keyof typeof translations
  >) {
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
    "✅ Translations created for all 6 languages (pt, en, es, fr, de, it)"
  );

  // Delete existing pricing phases for this event to avoid duplicates
  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

  console.log("💰 Creating variants and pricing phases...");

  for (const variantData of variants) {
    const { pricingPhases, ...variantInfo } = variantData;

    const variant = await prisma.eventVariant.create({
      data: {
        ...variantInfo,
        eventId: event.id,
      },
    });

    console.log(`✅ Created variant: ${variant.name}`);

    // Create pricing phases for this variant
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

  console.log("✅ All variants and pricing phases created!");
  console.log("🎉 Seed completed: 4ª Edição do SPT Serra Galega 2026");
}

// Make this seed executable
if (require.main === module) {
  seedSPTSerraGalega2026()
    .catch((e) => {
      console.error("❌ Error seeding SPT Serra Galega 2026:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export default seedSPTSerraGalega2026;
