/**
 * Seed: Plano de Treino CrossFit Iniciantes - 8 Semanas
 *
 * Plano completo e estruturado para iniciantes em CrossFit.
 * Muito procurado por quem quer começar no CrossFit de forma segura.
 *
 * Criador: hello@athlifyr.com
 *
 * Execução:
 *   npx tsx prisma/seeds/training-plan-crossfit-beginners.ts
 */

import {
  PrismaClient,
  WorkoutBlockType,
  WeightUnit,
  SportType,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏋️ Iniciando seed do Plano de Treino CrossFit Iniciantes...\n");

  // ============================================================================
  // 1. ENCONTRAR OU CRIAR UTILIZADOR
  // ============================================================================
  let user = await prisma.user.findUnique({
    where: { email: "hello@athlifyr.com" },
  });

  if (!user) {
    console.log("👤 Utilizador hello@athlifyr.com não encontrado, criando...");
    user = await prisma.user.create({
      data: {
        email: "hello@athlifyr.com",
        name: "Athlifyr Official",
        emailVerified: new Date(),
        emailNotifications: true,
        favoriteSports: [SportType.CROSSFIT, SportType.TRAIL, SportType.HYROX],
      },
    });
    console.log(`   ✅ Utilizador criado: ${user.email}`);
  } else {
    console.log(`✅ Utilizador encontrado: ${user.name} (${user.email})`);
  }

  // ============================================================================
  // 2. ENCONTRAR EXERCÍCIOS NECESSÁRIOS
  // ============================================================================
  console.log("\n📋 Procurando exercícios...");

  const exerciseNames = [
    // Squats
    "Air Squat",
    "Goblet Squat",
    "Back Squat",
    "Front Squat",
    // Deadlifts
    "Deadlift",
    "Romanian Deadlift",
    // Pressing
    "Push-up",
    "Overhead Press",
    "Push Press",
    "Dumbbell Press",
    // Pulling
    "Pull-up",
    "Ring Row",
    "Bent Over Row",
    // CrossFit
    "Thruster",
    "Wall Ball",
    "Kettlebell Swing",
    "Box Jump",
    "Box Step Up",
    "Burpee",
    "Double Under",
    "Single Under",
    // Core
    "Sit-up",
    "Plank",
    "Hollow Hold",
    "V-up",
    // Cardio
    "Rowing",
    "Running",
    "Assault Bike",
    // Olympic (basics)
    "Power Clean",
    "Hang Power Clean",
  ];

  const exercises = await prisma.exercise.findMany({
    where: {
      name: { in: exerciseNames },
    },
  });

  const exerciseMap = new Map(exercises.map((e) => [e.name, e]));

  console.log(
    `   Encontrados ${exercises.length}/${exerciseNames.length} exercícios`
  );

  // Verificar exercícios em falta
  const missing = exerciseNames.filter((name) => !exerciseMap.has(name));
  if (missing.length > 0) {
    console.log(`   ⚠️ Exercícios em falta: ${missing.join(", ")}`);
    console.log("   Execute primeiro: npx tsx prisma/seeds/exercises-seed.ts");
  }

  // Helper para obter exercício
  const getExercise = (name: string) => {
    const ex = exerciseMap.get(name);
    if (!ex) {
      console.log(`   ⚠️ Exercício não encontrado: ${name}`);
      return null;
    }
    return ex;
  };

  // ============================================================================
  // 3. CRIAR/ATUALIZAR PLANO DE TREINO
  // ============================================================================
  console.log("\n📝 Criando plano de treino...");

  // Verificar se já existe
  const existingPlan = await prisma.trainingPlan.findFirst({
    where: {
      createdById: user.id,
      name: "CrossFit Iniciantes - 8 Semanas",
    },
  });

  if (existingPlan) {
    console.log("   ⚠️ Plano já existe, eliminando para recriar...");
    await prisma.trainingPlan.delete({
      where: { id: existingPlan.id },
    });
  }

  const trainingPlan = await prisma.trainingPlan.create({
    data: {
      name: "CrossFit Iniciantes - 8 Semanas",
      description: `Plano de treino completo para quem está a começar no CrossFit. 
      
Este programa de 8 semanas foi desenhado para:
- Aprender os movimentos fundamentais com técnica correta
- Construir uma base de força e condicionamento
- Preparar o corpo para treinos mais intensos
- Desenvolver mobilidade e flexibilidade

O plano inclui 4 treinos por semana, com progressão gradual de intensidade e complexidade.

Semanas 1-2: Fundamentos e técnica básica
Semanas 3-4: Introdução aos movimentos compostos
Semanas 5-6: Aumento de volume e intensidade
Semanas 7-8: Consolidação e benchmark workouts

Recomendações:
- Respeite os dias de descanso
- Priorize sempre a técnica sobre a carga
- Hidrate-se bem e durma pelo menos 7 horas
- Faça alongamentos após cada treino`,
      imageUrl:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200",
      createdById: user.id,
      duration: 8,
      difficulty: 2,
      tags: [
        "crossfit",
        "iniciantes",
        "fundamentos",
        "força",
        "condicionamento",
      ],
      isTemplate: true,
      isPublic: true,
      isPremium: false,
      category: "CrossFit",
      targetAudience: "Iniciantes",
      goals: [
        "Aprender técnica correta dos movimentos",
        "Construir força base",
        "Melhorar condicionamento cardiovascular",
        "Desenvolver mobilidade",
      ],
      requirements: [
        "Barra de pull-ups ou alternativa",
        "Kettlebell (12-16kg)",
        "Caixa para saltos (50-60cm)",
        "Wall ball (6-9kg)",
        "Corda de saltar",
      ],
    },
  });

  console.log(`   ✅ Plano criado: ${trainingPlan.name}`);

  // 🌍 Criar traduções para TODOS os 6 idiomas
  const translations = {
    pt: {
      name: "CrossFit Iniciantes - 8 Semanas",
      description: `Plano de treino completo para quem está a começar no CrossFit. 
      
Este programa de 8 semanas foi desenhado para:
- Aprender os movimentos fundamentais com técnica correta
- Construir uma base de força e condicionamento
- Preparar o corpo para treinos mais intensos
- Desenvolver mobilidade e flexibilidade

O plano inclui 4 treinos por semana, com progressão gradual de intensidade e complexidade.

Semanas 1-2: Fundamentos e técnica básica
Semanas 3-4: Introdução aos movimentos compostos
Semanas 5-6: Aumento de volume e intensidade
Semanas 7-8: Consolidação e benchmark workouts

Recomendações:
- Respeita os dias de descanso
- Prioriza sempre a técnica sobre a carga
- Hidrata-te bem e dorme pelo menos 7 horas
- Faz alongamentos após cada treino`,
      metaTitle: "CrossFit Iniciantes - Plano 8 Semanas | Athlifyr",
      metaDescription:
        "Plano CrossFit para iniciantes: 8 semanas, 4 treinos/semana. Aprende técnica, constrói força base e melhora condicionamento. Progressão gradual com workouts benchmark.",
    },
    en: {
      name: "CrossFit Beginners - 8 Weeks",
      description: `Complete training plan for those starting CrossFit.

This 8-week program is designed to:
- Learn fundamental movements with correct technique
- Build a strength and conditioning base
- Prepare the body for more intense workouts
- Develop mobility and flexibility

The plan includes 4 workouts per week, with gradual progression in intensity and complexity.

Weeks 1-2: Fundamentals and basic technique
Weeks 3-4: Introduction to compound movements
Weeks 5-6: Increase in volume and intensity
Weeks 7-8: Consolidation and benchmark workouts

Recommendations:
- Respect rest days
- Always prioritize technique over load
- Stay well hydrated and sleep at least 7 hours
- Stretch after each workout`,
      metaTitle: "CrossFit Beginners - 8 Week Plan | Athlifyr",
      metaDescription:
        "CrossFit plan for beginners: 8 weeks, 4 workouts/week. Learn technique, build strength base and improve conditioning. Gradual progression with benchmark workouts.",
    },
    es: {
      name: "CrossFit Principiantes - 8 Semanas",
      description: `Plan de entrenamiento completo para quienes comienzan en CrossFit.

Este programa de 8 semanas está diseñado para:
- Aprender movimientos fundamentales con técnica correcta
- Construir una base de fuerza y acondicionamiento
- Preparar el cuerpo para entrenamientos más intensos
- Desarrollar movilidad y flexibilidad

El plan incluye 4 entrenamientos por semana, con progresión gradual en intensidad y complejidad.

Semanas 1-2: Fundamentos y técnica básica
Semanas 3-4: Introducción a movimientos compuestos
Semanas 5-6: Aumento de volumen e intensidad
Semanas 7-8: Consolidación y benchmark workouts

Recomendaciones:
- Respeta los días de descanso
- Prioriza siempre la técnica sobre la carga
- Hidrátate bien y duerme al menos 7 horas
- Estira después de cada entrenamiento`,
      metaTitle: "CrossFit Principiantes - Plan 8 Semanas | Athlifyr",
      metaDescription:
        "Plan CrossFit para principiantes: 8 semanas, 4 entrenamientos/semana. Aprende técnica, construye base de fuerza y mejora acondicionamiento. Progresión gradual con benchmark workouts.",
    },
    fr: {
      name: "CrossFit Débutants - 8 Semaines",
      description: `Plan d'entraînement complet pour ceux qui commencent le CrossFit.

Ce programme de 8 semaines est conçu pour:
- Apprendre les mouvements fondamentaux avec une technique correcte
- Construire une base de force et de conditionnement
- Préparer le corps à des entraînements plus intenses
- Développer la mobilité et la flexibilité

Le plan comprend 4 entraînements par semaine, avec une progression graduelle en intensité et complexité.

Semaines 1-2: Fondamentaux et technique de base
Semaines 3-4: Introduction aux mouvements composés
Semaines 5-6: Augmentation du volume et de l'intensité
Semaines 7-8: Consolidation et benchmark workouts

Recommandations:
- Respectez les jours de repos
- Priorisez toujours la technique sur la charge
- Hydratez-vous bien et dormez au moins 7 heures
- Étirez-vous après chaque entraînement`,
      metaTitle: "CrossFit Débutants - Plan 8 Semaines | Athlifyr",
      metaDescription:
        "Plan CrossFit pour débutants: 8 semaines, 4 entraînements/semaine. Apprenez la technique, construisez une base de force et améliorez le conditionnement. Progression graduelle avec benchmark workouts.",
    },
    de: {
      name: "CrossFit Anfänger - 8 Wochen",
      description: `Kompletter Trainingsplan für CrossFit-Einsteiger.

Dieses 8-Wochen-Programm ist konzipiert für:
- Erlernen grundlegender Bewegungen mit korrekter Technik
- Aufbau einer Kraft- und Konditionsbasis
- Vorbereitung des Körpers auf intensivere Workouts
- Entwicklung von Mobilität und Flexibilität

Der Plan umfasst 4 Workouts pro Woche mit schrittweiser Steigerung von Intensität und Komplexität.

Wochen 1-2: Grundlagen und Basistechnik
Wochen 3-4: Einführung in zusammengesetzte Bewegungen
Wochen 5-6: Erhöhung von Volumen und Intensität
Wochen 7-8: Konsolidierung und Benchmark-Workouts

Empfehlungen:
- Respektieren Sie Ruhetage
- Priorisieren Sie immer Technik vor Last
- Trinken Sie ausreichend und schlafen Sie mindestens 7 Stunden
- Dehnen Sie sich nach jedem Training`,
      metaTitle: "CrossFit Anfänger - 8 Wochen Plan | Athlifyr",
      metaDescription:
        "CrossFit-Plan für Anfänger: 8 Wochen, 4 Workouts/Woche. Lernen Sie Technik, bauen Sie Kraftbasis auf und verbessern Sie Kondition. Schrittweise Progression mit Benchmark-Workouts.",
    },
    it: {
      name: "CrossFit Principianti - 8 Settimane",
      description: `Piano di allenamento completo per chi inizia con CrossFit.

Questo programma di 8 settimane è progettato per:
- Imparare i movimenti fondamentali con tecnica corretta
- Costruire una base di forza e condizionamento
- Preparare il corpo per allenamenti più intensi
- Sviluppare mobilità e flessibilità

Il piano include 4 allenamenti a settimana, con progressione graduale in intensità e complessità.

Settimane 1-2: Fondamentali e tecnica di base
Settimane 3-4: Introduzione ai movimenti composti
Settimane 5-6: Aumento di volume e intensità
Settimane 7-8: Consolidamento e benchmark workout

Raccomandazioni:
- Rispetta i giorni di riposo
- Dai sempre priorità alla tecnica rispetto al carico
- Idratati bene e dormi almeno 7 ore
- Fai stretching dopo ogni allenamento`,
      metaTitle: "CrossFit Principianti - Piano 8 Settimane | Athlifyr",
      metaDescription:
        "Piano CrossFit per principianti: 8 settimane, 4 allenamenti/settimana. Impara la tecnica, costruisci base di forza e migliora il condizionamento. Progressione graduale con benchmark workout.",
    },
  };

  console.log("   🌍 Criando traduções para todos os 6 idiomas...");

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.trainingPlanTranslation.upsert({
      where: {
        planId_language: {
          planId: trainingPlan.id,
          language: lang,
        },
      },
      update: {
        name: translations[lang].name,
        description: translations[lang].description,
        metaTitle: translations[lang].metaTitle,
        metaDescription: translations[lang].metaDescription,
      },
      create: {
        planId: trainingPlan.id,
        language: lang,
        name: translations[lang].name,
        description: translations[lang].description,
        metaTitle: translations[lang].metaTitle,
        metaDescription: translations[lang].metaDescription,
      },
    });
    console.log(`      ✅ ${lang.toUpperCase()}`);
  }

  // ============================================================================
  // 4. CRIAR WORKOUTS PARA O PLANO
  // ============================================================================
  console.log("\n💪 Criando workouts...");

  // Helper para criar workout
  const createWorkout = async (
    name: string,
    description: string,
    estimatedTime: number,
    difficulty: number,
    tags: string[]
  ) => {
    return prisma.workout.create({
      data: {
        name,
        description,
        createdById: user.id,
        estimatedTime,
        difficulty,
        tags,
        isTemplate: true,
        isPublic: true,
      },
    });
  };

  // ============================================================================
  // SEMANA 1 - FUNDAMENTOS BÁSICOS
  // ============================================================================
  console.log("\n📅 Semana 1 - Fundamentos Básicos");

  // Dia 1 - Squats e Core
  const w1d1 = await createWorkout(
    "Fundamentos: Squat & Core",
    "Aprender a mecânica do squat e fortalecer o core.",
    45,
    1,
    ["fundamentos", "squat", "core"]
  );

  // Bloco 1: Aquecimento
  const w1d1b1 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d1.id,
      type: WorkoutBlockType.WARMUP,
      name: "Aquecimento Geral",
      orderIndex: 0,
      notes: "Foco em mobilidade de anca e tornozelos",
    },
  });

  const airSquat = getExercise("Air Squat");
  const plank = getExercise("Plank");
  const hollowHold = getExercise("Hollow Hold");

  if (airSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d1b1.id,
        exerciseId: airSquat.id,
        orderIndex: 0,
        prescribedReps: 10,
        prescribedSets: 3,
        notes: "Foco na técnica - joelhos para fora, peito erguido",
      },
    });
  }

  // Bloco 2: Skill - Técnica de Squat
  const w1d1b2 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d1.id,
      type: WorkoutBlockType.SKILL,
      name: "Técnica: Air Squat",
      orderIndex: 1,
      notes: "Praticar posição e profundidade",
    },
  });

  if (airSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d1b2.id,
        exerciseId: airSquat.id,
        orderIndex: 0,
        prescribedReps: 5,
        prescribedSets: 5,
        notes: "Pausa de 2 segundos no fundo de cada rep",
      },
    });
  }

  const gobletSquat = getExercise("Goblet Squat");
  if (gobletSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d1b2.id,
        exerciseId: gobletSquat.id,
        orderIndex: 1,
        prescribedReps: 8,
        prescribedSets: 3,
        prescribedWeight: 8,
        prescribedWeightUnit: WeightUnit.KG,
        notes: "Kettlebell ou dumbbell ao peito",
      },
    });
  }

  // Bloco 3: Core
  const w1d1b3 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d1.id,
      type: WorkoutBlockType.STRENGTH,
      name: "Core Foundation",
      orderIndex: 2,
      rounds: 3,
    },
  });

  if (plank) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d1b3.id,
        exerciseId: plank.id,
        orderIndex: 0,
        prescribedTime: 30,
        notes: "Manter posição neutra da coluna",
      },
    });
  }

  if (hollowHold) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d1b3.id,
        exerciseId: hollowHold.id,
        orderIndex: 1,
        prescribedTime: 20,
        notes: "Lombar colada ao chão",
      },
    });
  }

  const situp = getExercise("Sit-up");
  if (situp) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d1b3.id,
        exerciseId: situp.id,
        orderIndex: 2,
        prescribedReps: 15,
      },
    });
  }

  // Bloco 4: WOD simples
  const w1d1b4 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d1.id,
      type: WorkoutBlockType.AMRAP,
      name: "WOD - 8 min AMRAP",
      orderIndex: 3,
      timeCap: 480, // 8 minutos
      notes: "Ritmo constante, foco na técnica",
    },
  });

  if (airSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d1b4.id,
        exerciseId: airSquat.id,
        orderIndex: 0,
        prescribedReps: 10,
      },
    });
  }

  if (situp) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d1b4.id,
        exerciseId: situp.id,
        orderIndex: 1,
        prescribedReps: 8,
      },
    });
  }

  if (plank) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d1b4.id,
        exerciseId: plank.id,
        orderIndex: 2,
        prescribedTime: 20,
      },
    });
  }

  console.log(`   ✅ Dia 1: ${w1d1.name}`);

  // Dia 2 - Push & Pull
  const w1d2 = await createWorkout(
    "Fundamentos: Push & Pull",
    "Introdução aos movimentos de empurrar e puxar.",
    45,
    1,
    ["fundamentos", "push", "pull", "upper body"]
  );

  // Aquecimento
  const w1d2b1 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d2.id,
      type: WorkoutBlockType.WARMUP,
      name: "Aquecimento Upper Body",
      orderIndex: 0,
    },
  });

  const pushup = getExercise("Push-up");
  const rowing = getExercise("Rowing");

  if (rowing) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d2b1.id,
        exerciseId: rowing.id,
        orderIndex: 0,
        prescribedCalories: 500,
        notes: "Ritmo leve para aquecer",
      },
    });
  }

  // Skill: Push-up
  const w1d2b2 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d2.id,
      type: WorkoutBlockType.SKILL,
      name: "Técnica: Push-up",
      orderIndex: 1,
    },
  });

  if (pushup) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d2b2.id,
        exerciseId: pushup.id,
        orderIndex: 0,
        prescribedReps: 5,
        prescribedSets: 5,
        notes: "Escalar para joelhos se necessário. Cotovelos a 45 graus.",
      },
    });
  }

  // Strength: Row variations
  const w1d2b3 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d2.id,
      type: WorkoutBlockType.STRENGTH,
      name: "Pull Strength",
      orderIndex: 2,
      rounds: 4,
    },
  });

  const ringRow = getExercise("Ring Row");
  const dbRow = getExercise("Dumbbell Row");

  if (ringRow) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d2b3.id,
        exerciseId: ringRow.id,
        orderIndex: 0,
        prescribedReps: 10,
        notes: "Ajustar ângulo conforme dificuldade",
      },
    });
  }

  if (dbRow) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d2b3.id,
        exerciseId: dbRow.id,
        orderIndex: 1,
        prescribedReps: 8,
        prescribedWeight: 10,
        prescribedWeightUnit: WeightUnit.KG,
        notes: "Cada braço",
      },
    });
  }

  // WOD: For Time
  const w1d2b4 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d2.id,
      type: WorkoutBlockType.FOR_TIME,
      name: "WOD - 3 Rounds",
      orderIndex: 3,
      rounds: 3,
      timeCap: 600, // 10 min cap
    },
  });

  if (pushup) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d2b4.id,
        exerciseId: pushup.id,
        orderIndex: 0,
        prescribedReps: 8,
      },
    });
  }

  if (ringRow) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d2b4.id,
        exerciseId: ringRow.id,
        orderIndex: 1,
        prescribedReps: 10,
      },
    });
  }

  if (situp) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d2b4.id,
        exerciseId: situp.id,
        orderIndex: 2,
        prescribedReps: 12,
      },
    });
  }

  console.log(`   ✅ Dia 2: ${w1d2.name}`);

  // Dia 3 - Hinge & Cardio
  const w1d3 = await createWorkout(
    "Fundamentos: Hinge & Cardio",
    "Aprender o movimento de hinge (deadlift) e introdução ao cardio.",
    50,
    1,
    ["fundamentos", "hinge", "deadlift", "cardio"]
  );

  const w1d3b1 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d3.id,
      type: WorkoutBlockType.WARMUP,
      name: "Aquecimento",
      orderIndex: 0,
    },
  });

  const running = getExercise("Running");
  if (running) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d3b1.id,
        exerciseId: running.id,
        orderIndex: 0,
        prescribedDistance: 400,
        prescribedDistanceUnit: "M",
        notes: "Ritmo leve",
      },
    });
  }

  // Skill: Deadlift
  const w1d3b2 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d3.id,
      type: WorkoutBlockType.SKILL,
      name: "Técnica: Deadlift",
      orderIndex: 1,
    },
  });

  const deadlift = getExercise("Deadlift");
  const rdl = getExercise("Romanian Deadlift");

  if (deadlift) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d3b2.id,
        exerciseId: deadlift.id,
        orderIndex: 0,
        prescribedReps: 5,
        prescribedSets: 5,
        notes:
          "Começar apenas com barra. Foco: costas neutras, empurrar o chão.",
      },
    });
  }

  // Strength
  const w1d3b3 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d3.id,
      type: WorkoutBlockType.STRENGTH,
      name: "Hinge Strength",
      orderIndex: 2,
      rounds: 3,
    },
  });

  if (rdl) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d3b3.id,
        exerciseId: rdl.id,
        orderIndex: 0,
        prescribedReps: 10,
        prescribedWeight: 20,
        prescribedWeightUnit: WeightUnit.KG,
        notes: "Sentir alongamento nos isquiotibiais",
      },
    });
  }

  const kbSwing = getExercise("Kettlebell Swing");
  if (kbSwing) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d3b3.id,
        exerciseId: kbSwing.id,
        orderIndex: 1,
        prescribedReps: 15,
        prescribedWeight: 12,
        prescribedWeightUnit: WeightUnit.KG,
        notes: "Explosão de anca, braços relaxados",
      },
    });
  }

  // WOD
  const w1d3b4 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d3.id,
      type: WorkoutBlockType.AMRAP,
      name: "WOD - 10 min AMRAP",
      orderIndex: 3,
      timeCap: 600,
    },
  });

  if (kbSwing) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d3b4.id,
        exerciseId: kbSwing.id,
        orderIndex: 0,
        prescribedReps: 12,
        prescribedWeight: 12,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  const boxStepUp = getExercise("Box Step Up");
  if (boxStepUp) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d3b4.id,
        exerciseId: boxStepUp.id,
        orderIndex: 1,
        prescribedReps: 10,
        notes: "Alternar pernas",
      },
    });
  }

  if (plank) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d3b4.id,
        exerciseId: plank.id,
        orderIndex: 2,
        prescribedTime: 20,
      },
    });
  }

  console.log(`   ✅ Dia 3: ${w1d3.name}`);

  // Dia 4 - Full Body Intro
  const w1d4 = await createWorkout(
    "Fundamentos: Full Body",
    "Combinar todos os movimentos aprendidos num treino completo.",
    45,
    2,
    ["fundamentos", "full body"]
  );

  const w1d4b1 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d4.id,
      type: WorkoutBlockType.WARMUP,
      name: "Aquecimento Completo",
      orderIndex: 0,
    },
  });

  if (rowing) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d4b1.id,
        exerciseId: rowing.id,
        orderIndex: 0,
        prescribedCalories: 500,
      },
    });
  }

  if (airSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d4b1.id,
        exerciseId: airSquat.id,
        orderIndex: 1,
        prescribedReps: 10,
      },
    });
  }

  if (pushup) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d4b1.id,
        exerciseId: pushup.id,
        orderIndex: 2,
        prescribedReps: 5,
      },
    });
  }

  // Strength Circuit
  const w1d4b2 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d4.id,
      type: WorkoutBlockType.STRENGTH,
      name: "Strength Circuit",
      orderIndex: 1,
      rounds: 3,
    },
  });

  if (gobletSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d4b2.id,
        exerciseId: gobletSquat.id,
        orderIndex: 0,
        prescribedReps: 10,
        prescribedWeight: 12,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  if (pushup) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d4b2.id,
        exerciseId: pushup.id,
        orderIndex: 1,
        prescribedReps: 8,
      },
    });
  }

  if (ringRow) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d4b2.id,
        exerciseId: ringRow.id,
        orderIndex: 2,
        prescribedReps: 10,
      },
    });
  }

  // WOD Final
  const w1d4b3 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d4.id,
      type: WorkoutBlockType.FOR_TIME,
      name: "WOD - Cindy Scale",
      orderIndex: 2,
      timeCap: 600, // 10 min
      notes: "Versão escalada do benchmark Cindy",
    },
  });

  if (airSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d4b3.id,
        exerciseId: airSquat.id,
        orderIndex: 0,
        prescribedReps: 15,
      },
    });
  }

  if (pushup) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d4b3.id,
        exerciseId: pushup.id,
        orderIndex: 1,
        prescribedReps: 10,
        notes: "Escalar para joelhos se necessário",
      },
    });
  }

  if (ringRow) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d4b3.id,
        exerciseId: ringRow.id,
        orderIndex: 2,
        prescribedReps: 5,
        notes: "Substituição de pull-ups",
      },
    });
  }

  console.log(`   ✅ Dia 4: ${w1d4.name}`);

  // ============================================================================
  // SEMANA 2 - PROGRESSÃO DE VOLUME
  // ============================================================================
  console.log("\n📅 Semana 2 - Progressão de Volume");

  // Dia 1 - Squat Progression
  const w2d1 = await createWorkout(
    "Progressão: Back Squat",
    "Introdução ao Back Squat com barra.",
    50,
    2,
    ["squat", "back squat", "força"]
  );

  const w2d1b1 = await prisma.workoutBlock.create({
    data: {
      workoutId: w2d1.id,
      type: WorkoutBlockType.WARMUP,
      name: "Aquecimento Squat",
      orderIndex: 0,
    },
  });

  if (airSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d1b1.id,
        exerciseId: airSquat.id,
        orderIndex: 0,
        prescribedReps: 15,
        prescribedSets: 2,
      },
    });
  }

  if (gobletSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d1b1.id,
        exerciseId: gobletSquat.id,
        orderIndex: 1,
        prescribedReps: 10,
        prescribedWeight: 8,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  // Back Squat Skill
  const w2d1b2 = await prisma.workoutBlock.create({
    data: {
      workoutId: w2d1.id,
      type: WorkoutBlockType.SKILL,
      name: "Técnica: Back Squat",
      orderIndex: 1,
    },
  });

  const backSquat = getExercise("Back Squat");
  if (backSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d1b2.id,
        exerciseId: backSquat.id,
        orderIndex: 0,
        prescribedReps: 5,
        prescribedSets: 5,
        notes:
          "Começar apenas com barra (20kg). Foco na posição do rack e descida controlada.",
      },
    });
  }

  // WOD com mais volume
  const w2d1b3 = await prisma.workoutBlock.create({
    data: {
      workoutId: w2d1.id,
      type: WorkoutBlockType.AMRAP,
      name: "WOD - 12 min AMRAP",
      orderIndex: 2,
      timeCap: 720,
    },
  });

  if (airSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d1b3.id,
        exerciseId: airSquat.id,
        orderIndex: 0,
        prescribedReps: 15,
      },
    });
  }

  if (kbSwing) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d1b3.id,
        exerciseId: kbSwing.id,
        orderIndex: 1,
        prescribedReps: 12,
        prescribedWeight: 12,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  const burpee = getExercise("Burpee");
  if (burpee) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d1b3.id,
        exerciseId: burpee.id,
        orderIndex: 2,
        prescribedReps: 5,
        notes: "Podem ser burpees sem push-up para escalar",
      },
    });
  }

  console.log(`   ✅ Dia 1: ${w2d1.name}`);

  // Dia 2 - Press Progression
  const w2d2 = await createWorkout(
    "Progressão: Overhead Press",
    "Aprender o Overhead Press com barra.",
    50,
    2,
    ["press", "overhead", "shoulders"]
  );

  const w2d2b1 = await prisma.workoutBlock.create({
    data: {
      workoutId: w2d2.id,
      type: WorkoutBlockType.WARMUP,
      name: "Aquecimento Shoulders",
      orderIndex: 0,
    },
  });

  if (rowing) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d2b1.id,
        exerciseId: rowing.id,
        orderIndex: 0,
        prescribedCalories: 500,
      },
    });
  }

  const dbPress = getExercise("Dumbbell Press");
  if (dbPress) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d2b1.id,
        exerciseId: dbPress.id,
        orderIndex: 1,
        prescribedReps: 10,
        prescribedSets: 2,
        prescribedWeight: 5,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  // OHP Skill
  const w2d2b2 = await prisma.workoutBlock.create({
    data: {
      workoutId: w2d2.id,
      type: WorkoutBlockType.SKILL,
      name: "Técnica: Strict Press",
      orderIndex: 1,
    },
  });

  const ohp = getExercise("Overhead Press");
  if (ohp) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d2b2.id,
        exerciseId: ohp.id,
        orderIndex: 0,
        prescribedReps: 5,
        prescribedSets: 5,
        notes: "Barra vazia. Core contraído, sem lean back.",
      },
    });
  }

  // Superset Push/Pull
  const w2d2b3 = await prisma.workoutBlock.create({
    data: {
      workoutId: w2d2.id,
      type: WorkoutBlockType.STRENGTH,
      name: "Push/Pull Superset",
      orderIndex: 2,
      rounds: 4,
    },
  });

  if (ohp) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d2b3.id,
        exerciseId: ohp.id,
        orderIndex: 0,
        prescribedReps: 8,
        prescribedWeight: 20,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  if (ringRow) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d2b3.id,
        exerciseId: ringRow.id,
        orderIndex: 1,
        prescribedReps: 10,
      },
    });
  }

  // WOD
  const w2d2b4 = await prisma.workoutBlock.create({
    data: {
      workoutId: w2d2.id,
      type: WorkoutBlockType.EMOM,
      name: "WOD - 10 min EMOM",
      orderIndex: 3,
      timeCap: 600,
      workTime: 40, // 40s trabalho, 20s descanso
    },
  });

  if (pushup) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d2b4.id,
        exerciseId: pushup.id,
        orderIndex: 0,
        prescribedReps: 8,
        notes: "Minutos ímpares (1, 3, 5, 7, 9)",
      },
    });
  }

  if (ringRow) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d2b4.id,
        exerciseId: ringRow.id,
        orderIndex: 1,
        prescribedReps: 10,
        notes: "Minutos pares (2, 4, 6, 8, 10)",
      },
    });
  }

  console.log(`   ✅ Dia 2: ${w2d2.name}`);

  // Dia 3 - Deadlift Progression
  const w2d3 = await createWorkout(
    "Progressão: Deadlift Volume",
    "Aumentar volume no deadlift e introduzir Power Clean.",
    55,
    2,
    ["deadlift", "hinge", "power clean"]
  );

  const w2d3b1 = await prisma.workoutBlock.create({
    data: {
      workoutId: w2d3.id,
      type: WorkoutBlockType.WARMUP,
      name: "Aquecimento",
      orderIndex: 0,
    },
  });

  if (kbSwing) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d3b1.id,
        exerciseId: kbSwing.id,
        orderIndex: 0,
        prescribedReps: 15,
        prescribedSets: 2,
        prescribedWeight: 12,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  // Deadlift Strength
  const w2d3b2 = await prisma.workoutBlock.create({
    data: {
      workoutId: w2d3.id,
      type: WorkoutBlockType.STRENGTH,
      name: "Deadlift 5x5",
      orderIndex: 1,
    },
  });

  if (deadlift) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d3b2.id,
        exerciseId: deadlift.id,
        orderIndex: 0,
        prescribedReps: 5,
        prescribedSets: 5,
        prescribedWeight: 40,
        prescribedWeightUnit: WeightUnit.KG,
        notes: "Adicionar peso progressivamente. Máximo técnico.",
      },
    });
  }

  // Intro Power Clean
  const w2d3b3 = await prisma.workoutBlock.create({
    data: {
      workoutId: w2d3.id,
      type: WorkoutBlockType.SKILL,
      name: "Introdução: Hang Power Clean",
      orderIndex: 2,
    },
  });

  const hpc = getExercise("Hang Power Clean");
  if (hpc) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d3b3.id,
        exerciseId: hpc.id,
        orderIndex: 0,
        prescribedReps: 3,
        prescribedSets: 8,
        notes: "Apenas barra ou PVC. Foco na extensão de anca e receção.",
      },
    });
  }

  // WOD
  const w2d3b4 = await prisma.workoutBlock.create({
    data: {
      workoutId: w2d3.id,
      type: WorkoutBlockType.FOR_TIME,
      name: "WOD - DT Scale",
      orderIndex: 3,
      rounds: 3,
      timeCap: 720, // 12 min cap
      notes: "Versão muito escalada do benchmark DT",
    },
  });

  if (deadlift) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d3b4.id,
        exerciseId: deadlift.id,
        orderIndex: 0,
        prescribedReps: 8,
        prescribedWeight: 35,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  if (hpc) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d3b4.id,
        exerciseId: hpc.id,
        orderIndex: 1,
        prescribedReps: 6,
        prescribedWeight: 35,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  const pushPress = getExercise("Push Press");
  if (pushPress) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d3b4.id,
        exerciseId: pushPress.id,
        orderIndex: 2,
        prescribedReps: 4,
        prescribedWeight: 35,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  console.log(`   ✅ Dia 3: ${w2d3.name}`);

  // Dia 4 - Full Body + Cardio
  const w2d4 = await createWorkout(
    "Progressão: Full Body + Metcon",
    "Treino completo com metcon mais longo.",
    55,
    2,
    ["full body", "metcon", "cardio"]
  );

  const w2d4b1 = await prisma.workoutBlock.create({
    data: {
      workoutId: w2d4.id,
      type: WorkoutBlockType.WARMUP,
      name: "Aquecimento",
      orderIndex: 0,
    },
  });

  if (running) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d4b1.id,
        exerciseId: running.id,
        orderIndex: 0,
        prescribedDistance: 400,
        prescribedDistanceUnit: "M",
      },
    });
  }

  if (airSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d4b1.id,
        exerciseId: airSquat.id,
        orderIndex: 1,
        prescribedReps: 10,
      },
    });
  }

  // WOD - Longer Metcon
  const w2d4b2 = await prisma.workoutBlock.create({
    data: {
      workoutId: w2d4.id,
      type: WorkoutBlockType.AMRAP,
      name: "WOD - 15 min AMRAP",
      orderIndex: 1,
      timeCap: 900, // 15 min
    },
  });

  if (running) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d4b2.id,
        exerciseId: running.id,
        orderIndex: 0,
        prescribedDistance: 200,
        prescribedDistanceUnit: "M",
      },
    });
  }

  if (airSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d4b2.id,
        exerciseId: airSquat.id,
        orderIndex: 1,
        prescribedReps: 15,
      },
    });
  }

  if (pushup) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d4b2.id,
        exerciseId: pushup.id,
        orderIndex: 2,
        prescribedReps: 10,
      },
    });
  }

  if (situp) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d4b2.id,
        exerciseId: situp.id,
        orderIndex: 3,
        prescribedReps: 15,
      },
    });
  }

  // Cooldown
  const w2d4b3 = await prisma.workoutBlock.create({
    data: {
      workoutId: w2d4.id,
      type: WorkoutBlockType.COOLDOWN,
      name: "Cooldown",
      orderIndex: 2,
    },
  });

  if (rowing) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d4b3.id,
        exerciseId: rowing.id,
        orderIndex: 0,
        prescribedTime: 180, // 3 min
        notes: "Ritmo muito leve, recuperação ativa",
      },
    });
  }

  console.log(`   ✅ Dia 4: ${w2d4.name}`);

  // ============================================================================
  // SEMANA 3 - INTRODUÇÃO AO WALL BALL E BOX JUMP
  // ============================================================================
  console.log("\n📅 Semana 3 - Movimentos CrossFit");

  // Dia 1 - Wall Ball Introduction
  const w3d1 = await createWorkout(
    "CrossFit: Wall Ball & Thruster",
    "Introdução ao Wall Ball e Thruster.",
    50,
    2,
    ["wall ball", "thruster", "crossfit"]
  );

  const w3d1b1 = await prisma.workoutBlock.create({
    data: {
      workoutId: w3d1.id,
      type: WorkoutBlockType.WARMUP,
      name: "Aquecimento",
      orderIndex: 0,
    },
  });

  if (gobletSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w3d1b1.id,
        exerciseId: gobletSquat.id,
        orderIndex: 0,
        prescribedReps: 10,
        prescribedSets: 2,
        prescribedWeight: 12,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  // Skill: Wall Ball
  const w3d1b2 = await prisma.workoutBlock.create({
    data: {
      workoutId: w3d1.id,
      type: WorkoutBlockType.SKILL,
      name: "Técnica: Wall Ball",
      orderIndex: 1,
    },
  });

  const wallBall = getExercise("Wall Ball");
  if (wallBall) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w3d1b2.id,
        exerciseId: wallBall.id,
        orderIndex: 0,
        prescribedReps: 10,
        prescribedSets: 5,
        prescribedWeight: 6,
        prescribedWeightUnit: WeightUnit.KG,
        prescribedWeightFemale: 4,
        prescribedWeightUnitFemale: WeightUnit.KG,
        notes: "Alvo a 3m (homens) ou 2.7m (mulheres). Squat completo.",
      },
    });
  }

  // Skill: Thruster
  const w3d1b3 = await prisma.workoutBlock.create({
    data: {
      workoutId: w3d1.id,
      type: WorkoutBlockType.SKILL,
      name: "Técnica: Thruster",
      orderIndex: 2,
    },
  });

  const thruster = getExercise("Thruster");
  if (thruster) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w3d1b3.id,
        exerciseId: thruster.id,
        orderIndex: 0,
        prescribedReps: 5,
        prescribedSets: 5,
        prescribedWeight: 20,
        prescribedWeightUnit: WeightUnit.KG,
        notes: "Front squat + push press num movimento fluído",
      },
    });
  }

  // WOD
  const w3d1b4 = await prisma.workoutBlock.create({
    data: {
      workoutId: w3d1.id,
      type: WorkoutBlockType.FOR_TIME,
      name: "WOD - Karen Scale",
      orderIndex: 3,
      timeCap: 600,
      notes: "Versão escalada do benchmark Karen",
    },
  });

  if (wallBall) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w3d1b4.id,
        exerciseId: wallBall.id,
        orderIndex: 0,
        prescribedReps: 75,
        prescribedWeight: 6,
        prescribedWeightUnit: WeightUnit.KG,
        prescribedRepsFemale: 75,
        prescribedWeightFemale: 4,
        prescribedWeightUnitFemale: WeightUnit.KG,
        notes: "Dividir em sets gerenciáveis: 15-15-15-15-15",
      },
    });
  }

  console.log(`   ✅ Dia 1: ${w3d1.name}`);

  // Dia 2 - Box Jump Introduction
  const w3d2 = await createWorkout(
    "CrossFit: Box Jump & Burpee",
    "Introdução ao Box Jump e treino de Burpees.",
    50,
    2,
    ["box jump", "burpee", "plyometric"]
  );

  const w3d2b1 = await prisma.workoutBlock.create({
    data: {
      workoutId: w3d2.id,
      type: WorkoutBlockType.WARMUP,
      name: "Aquecimento Pliométrico",
      orderIndex: 0,
    },
  });

  if (airSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w3d2b1.id,
        exerciseId: airSquat.id,
        orderIndex: 0,
        prescribedReps: 15,
      },
    });
  }

  if (boxStepUp) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w3d2b1.id,
        exerciseId: boxStepUp.id,
        orderIndex: 1,
        prescribedReps: 10,
        notes: "Box baixa, alternar pernas",
      },
    });
  }

  // Skill: Box Jump
  const w3d2b2 = await prisma.workoutBlock.create({
    data: {
      workoutId: w3d2.id,
      type: WorkoutBlockType.SKILL,
      name: "Técnica: Box Jump",
      orderIndex: 1,
    },
  });

  const boxJump = getExercise("Box Jump");
  if (boxJump) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w3d2b2.id,
        exerciseId: boxJump.id,
        orderIndex: 0,
        prescribedReps: 5,
        prescribedSets: 5,
        notes:
          "Começar com box baixa (50cm). Abrir anca no topo. Step down para descer.",
      },
    });
  }

  // Burpee Practice
  const w3d2b3 = await prisma.workoutBlock.create({
    data: {
      workoutId: w3d2.id,
      type: WorkoutBlockType.SKILL,
      name: "Técnica: Burpee",
      orderIndex: 2,
    },
  });

  if (burpee) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w3d2b3.id,
        exerciseId: burpee.id,
        orderIndex: 0,
        prescribedReps: 5,
        prescribedSets: 4,
        notes: "Foco na técnica: peito ao chão, salto completo.",
      },
    });
  }

  // WOD
  const w3d2b4 = await prisma.workoutBlock.create({
    data: {
      workoutId: w3d2.id,
      type: WorkoutBlockType.FOR_TIME,
      name: "WOD - 21-15-9",
      orderIndex: 3,
      timeCap: 720,
    },
  });

  if (boxJump) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w3d2b4.id,
        exerciseId: boxJump.id,
        orderIndex: 0,
        prescribedReps: 21,
        notes: "21 Box Jumps, depois 15, depois 9",
      },
    });
  }

  if (burpee) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w3d2b4.id,
        exerciseId: burpee.id,
        orderIndex: 1,
        prescribedReps: 21,
        notes: "21 Burpees, depois 15, depois 9",
      },
    });
  }

  console.log(`   ✅ Dia 2: ${w3d2.name}`);

  // Dia 3 - Power Clean Progression
  const w3d3 = await createWorkout(
    "Olympic Lifting: Power Clean",
    "Progressão no Power Clean e deadlift.",
    55,
    3,
    ["power clean", "olympic lifting", "deadlift"]
  );

  const w3d3b1 = await prisma.workoutBlock.create({
    data: {
      workoutId: w3d3.id,
      type: WorkoutBlockType.WARMUP,
      name: "Barbell Warmup",
      orderIndex: 0,
    },
  });

  if (deadlift) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w3d3b1.id,
        exerciseId: deadlift.id,
        orderIndex: 0,
        prescribedReps: 5,
        prescribedSets: 3,
        notes: "Barra vazia, foco na posição",
      },
    });
  }

  // Power Clean Skill
  const w3d3b2 = await prisma.workoutBlock.create({
    data: {
      workoutId: w3d3.id,
      type: WorkoutBlockType.SKILL,
      name: "Progressão: Power Clean",
      orderIndex: 1,
    },
  });

  if (hpc) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w3d3b2.id,
        exerciseId: hpc.id,
        orderIndex: 0,
        prescribedReps: 3,
        prescribedSets: 5,
        prescribedWeight: 25,
        prescribedWeightUnit: WeightUnit.KG,
        notes: "Revisão técnica",
      },
    });
  }

  const powerClean = getExercise("Power Clean");
  if (powerClean) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w3d3b2.id,
        exerciseId: powerClean.id,
        orderIndex: 1,
        prescribedReps: 3,
        prescribedSets: 5,
        prescribedWeight: 30,
        prescribedWeightUnit: WeightUnit.KG,
        notes: "Do chão. Primeira puxada lenta, segunda explosiva.",
      },
    });
  }

  // Strength: Deadlift
  const w3d3b3 = await prisma.workoutBlock.create({
    data: {
      workoutId: w3d3.id,
      type: WorkoutBlockType.STRENGTH,
      name: "Deadlift 5x3",
      orderIndex: 2,
    },
  });

  if (deadlift) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w3d3b3.id,
        exerciseId: deadlift.id,
        orderIndex: 0,
        prescribedReps: 3,
        prescribedSets: 5,
        prescribedWeight: 50,
        prescribedWeightUnit: WeightUnit.KG,
        notes: "Peso moderado. Técnica perfeita.",
      },
    });
  }

  // WOD
  const w3d3b4 = await prisma.workoutBlock.create({
    data: {
      workoutId: w3d3.id,
      type: WorkoutBlockType.AMRAP,
      name: "WOD - 8 min AMRAP",
      orderIndex: 3,
      timeCap: 480,
    },
  });

  if (powerClean) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w3d3b4.id,
        exerciseId: powerClean.id,
        orderIndex: 0,
        prescribedReps: 5,
        prescribedWeight: 30,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  if (burpee) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w3d3b4.id,
        exerciseId: burpee.id,
        orderIndex: 1,
        prescribedReps: 7,
      },
    });
  }

  console.log(`   ✅ Dia 3: ${w3d3.name}`);

  // Dia 4 - Hero WOD Scale
  const w3d4 = await createWorkout(
    "CrossFit: Murph Scale",
    "Versão muito escalada do Hero WOD Murph.",
    40,
    3,
    ["hero wod", "murph", "endurance"]
  );

  const w3d4b1 = await prisma.workoutBlock.create({
    data: {
      workoutId: w3d4.id,
      type: WorkoutBlockType.FOR_TIME,
      name: "Half Murph - No Vest",
      orderIndex: 0,
      timeCap: 2400, // 40 min cap
      notes: "Versão escalada: metade do Murph, sem colete",
    },
  });

  if (running) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w3d4b1.id,
        exerciseId: running.id,
        orderIndex: 0,
        prescribedDistance: 800,
        prescribedDistanceUnit: "M",
      },
    });
  }

  // Pull-up substituído por Ring Row para iniciantes
  if (ringRow) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w3d4b1.id,
        exerciseId: ringRow.id,
        orderIndex: 1,
        prescribedReps: 50,
        notes: "Substituição de Pull-ups",
      },
    });
  }

  if (pushup) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w3d4b1.id,
        exerciseId: pushup.id,
        orderIndex: 2,
        prescribedReps: 100,
        notes: "Podem ser em joelhos",
      },
    });
  }

  if (airSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w3d4b1.id,
        exerciseId: airSquat.id,
        orderIndex: 3,
        prescribedReps: 150,
      },
    });
  }

  if (running) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w3d4b1.id,
        exerciseId: running.id,
        orderIndex: 4,
        prescribedDistance: 800,
        prescribedDistanceUnit: "M",
      },
    });
  }

  console.log(`   ✅ Dia 4: ${w3d4.name}`);

  // ============================================================================
  // SEMANA 4 - CONSOLIDAÇÃO E TESTE
  // ============================================================================
  console.log("\n📅 Semana 4 - Consolidação");

  // Dia 1 - Test: Squat
  const w4d1 = await createWorkout(
    "Teste: Back Squat 5RM",
    "Encontrar o máximo de 5 repetições no Back Squat.",
    50,
    3,
    ["teste", "back squat", "força máxima"]
  );

  const w4d1b1 = await prisma.workoutBlock.create({
    data: {
      workoutId: w4d1.id,
      type: WorkoutBlockType.WARMUP,
      name: "Aquecimento Progressivo",
      orderIndex: 0,
    },
  });

  if (airSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w4d1b1.id,
        exerciseId: airSquat.id,
        orderIndex: 0,
        prescribedReps: 20,
      },
    });
  }

  if (gobletSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w4d1b1.id,
        exerciseId: gobletSquat.id,
        orderIndex: 1,
        prescribedReps: 10,
        prescribedWeight: 16,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  // 5RM Test
  const w4d1b2 = await prisma.workoutBlock.create({
    data: {
      workoutId: w4d1.id,
      type: WorkoutBlockType.STRENGTH,
      name: "Back Squat 5RM",
      orderIndex: 1,
      notes: "Trabalhar até ao máximo de 5 reps com boa técnica",
    },
  });

  if (backSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w4d1b2.id,
        exerciseId: backSquat.id,
        orderIndex: 0,
        prescribedReps: 5,
        prescribedSets: 1,
        notes: `Sets de aquecimento:
5 reps @ barra vazia
5 reps @ 50%
3 reps @ 70%
2 reps @ 80%
Depois: tentar 5RM (100%)`,
      },
    });
  }

  // Light WOD
  const w4d1b3 = await prisma.workoutBlock.create({
    data: {
      workoutId: w4d1.id,
      type: WorkoutBlockType.AMRAP,
      name: "WOD - 6 min AMRAP (light)",
      orderIndex: 2,
      timeCap: 360,
    },
  });

  if (airSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w4d1b3.id,
        exerciseId: airSquat.id,
        orderIndex: 0,
        prescribedReps: 10,
      },
    });
  }

  if (pushup) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w4d1b3.id,
        exerciseId: pushup.id,
        orderIndex: 1,
        prescribedReps: 5,
      },
    });
  }

  console.log(`   ✅ Dia 1: ${w4d1.name}`);

  // Dia 2 - Test: Deadlift
  const w4d2 = await createWorkout(
    "Teste: Deadlift 5RM",
    "Encontrar o máximo de 5 repetições no Deadlift.",
    50,
    3,
    ["teste", "deadlift", "força máxima"]
  );

  const w4d2b1 = await prisma.workoutBlock.create({
    data: {
      workoutId: w4d2.id,
      type: WorkoutBlockType.WARMUP,
      name: "Aquecimento",
      orderIndex: 0,
    },
  });

  if (kbSwing) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w4d2b1.id,
        exerciseId: kbSwing.id,
        orderIndex: 0,
        prescribedReps: 15,
        prescribedSets: 2,
        prescribedWeight: 16,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  // 5RM Test
  const w4d2b2 = await prisma.workoutBlock.create({
    data: {
      workoutId: w4d2.id,
      type: WorkoutBlockType.STRENGTH,
      name: "Deadlift 5RM",
      orderIndex: 1,
    },
  });

  if (deadlift) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w4d2b2.id,
        exerciseId: deadlift.id,
        orderIndex: 0,
        prescribedReps: 5,
        prescribedSets: 1,
        notes: `Sets de aquecimento progressivos até 5RM.
Manter costas neutras SEMPRE.`,
      },
    });
  }

  // WOD
  const w4d2b3 = await prisma.workoutBlock.create({
    data: {
      workoutId: w4d2.id,
      type: WorkoutBlockType.FOR_TIME,
      name: "WOD - 3 Rounds",
      orderIndex: 2,
      rounds: 3,
      timeCap: 600,
    },
  });

  if (deadlift) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w4d2b3.id,
        exerciseId: deadlift.id,
        orderIndex: 0,
        prescribedReps: 10,
        prescribedWeight: 40,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  if (burpee) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w4d2b3.id,
        exerciseId: burpee.id,
        orderIndex: 1,
        prescribedReps: 8,
      },
    });
  }

  console.log(`   ✅ Dia 2: ${w4d2.name}`);

  // Dia 3 - Benchmark: Fran Scale
  const w4d3 = await createWorkout(
    "Benchmark: Fran (Escalado)",
    "Versão escalada do famoso benchmark Fran.",
    40,
    3,
    ["benchmark", "fran", "thruster"]
  );

  const w4d3b1 = await prisma.workoutBlock.create({
    data: {
      workoutId: w4d3.id,
      type: WorkoutBlockType.WARMUP,
      name: "Aquecimento Específico",
      orderIndex: 0,
    },
  });

  if (thruster) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w4d3b1.id,
        exerciseId: thruster.id,
        orderIndex: 0,
        prescribedReps: 5,
        prescribedSets: 3,
        notes: "Barra vazia",
      },
    });
  }

  if (ringRow) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w4d3b1.id,
        exerciseId: ringRow.id,
        orderIndex: 1,
        prescribedReps: 8,
        prescribedSets: 2,
      },
    });
  }

  // Fran Scale
  const w4d3b2 = await prisma.workoutBlock.create({
    data: {
      workoutId: w4d3.id,
      type: WorkoutBlockType.FOR_TIME,
      name: "Fran (Escalado)",
      orderIndex: 1,
      timeCap: 600,
      notes: "21-15-9 reps de cada exercício",
    },
  });

  if (thruster) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w4d3b2.id,
        exerciseId: thruster.id,
        orderIndex: 0,
        prescribedReps: 21,
        prescribedWeight: 25,
        prescribedWeightUnit: WeightUnit.KG,
        prescribedWeightFemale: 15,
        prescribedWeightUnitFemale: WeightUnit.KG,
        notes: "21-15-9",
      },
    });
  }

  if (ringRow) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w4d3b2.id,
        exerciseId: ringRow.id,
        orderIndex: 1,
        prescribedReps: 21,
        notes: "21-15-9 (substituição de pull-ups)",
      },
    });
  }

  console.log(`   ✅ Dia 3: ${w4d3.name}`);

  // Dia 4 - Full Week Review
  const w4d4 = await createWorkout(
    "Revisão: Full Body Challenge",
    "Treino completo testando todos os movimentos aprendidos.",
    55,
    3,
    ["revisão", "full body", "challenge"]
  );

  const w4d4b1 = await prisma.workoutBlock.create({
    data: {
      workoutId: w4d4.id,
      type: WorkoutBlockType.CHIPPER,
      name: "Full Body Chipper",
      orderIndex: 0,
      timeCap: 1800, // 30 min cap
      notes: "Completar todos os exercícios em ordem",
    },
  });

  if (running) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w4d4b1.id,
        exerciseId: running.id,
        orderIndex: 0,
        prescribedDistance: 400,
        prescribedDistanceUnit: "M",
      },
    });
  }

  if (airSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w4d4b1.id,
        exerciseId: airSquat.id,
        orderIndex: 1,
        prescribedReps: 50,
      },
    });
  }

  if (pushup) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w4d4b1.id,
        exerciseId: pushup.id,
        orderIndex: 2,
        prescribedReps: 30,
      },
    });
  }

  if (kbSwing) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w4d4b1.id,
        exerciseId: kbSwing.id,
        orderIndex: 3,
        prescribedReps: 40,
        prescribedWeight: 16,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  if (situp) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w4d4b1.id,
        exerciseId: situp.id,
        orderIndex: 4,
        prescribedReps: 30,
      },
    });
  }

  if (wallBall) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w4d4b1.id,
        exerciseId: wallBall.id,
        orderIndex: 5,
        prescribedReps: 30,
        prescribedWeight: 6,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  if (burpee) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w4d4b1.id,
        exerciseId: burpee.id,
        orderIndex: 6,
        prescribedReps: 20,
      },
    });
  }

  if (running) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w4d4b1.id,
        exerciseId: running.id,
        orderIndex: 7,
        prescribedDistance: 400,
        prescribedDistanceUnit: "M",
      },
    });
  }

  console.log(`   ✅ Dia 4: ${w4d4.name}`);

  // ============================================================================
  // 5. CRIAR SEMANAS DO PLANO
  // ============================================================================
  console.log("\n📆 Criando estrutura de semanas...");

  // Semana 1
  const week1 = await prisma.trainingPlanWeek.create({
    data: {
      planId: trainingPlan.id,
      weekNumber: 1,
      name: "Fundamentos Básicos",
      description:
        "Aprender os movimentos fundamentais: squat, push, pull e hinge.",
      orderIndex: 0,
    },
  });

  await prisma.trainingPlanWorkout.createMany({
    data: [
      { weekId: week1.id, workoutId: w1d1.id, dayOfWeek: 1, orderIndex: 0 }, // Segunda
      { weekId: week1.id, workoutId: w1d2.id, dayOfWeek: 3, orderIndex: 0 }, // Quarta
      { weekId: week1.id, workoutId: w1d3.id, dayOfWeek: 5, orderIndex: 0 }, // Sexta
      { weekId: week1.id, workoutId: w1d4.id, dayOfWeek: 6, orderIndex: 0 }, // Sábado
    ],
  });

  console.log(`   ✅ Semana 1: ${week1.name}`);

  // Semana 2
  const week2 = await prisma.trainingPlanWeek.create({
    data: {
      planId: trainingPlan.id,
      weekNumber: 2,
      name: "Progressão de Volume",
      description: "Introdução à barra: Back Squat, Overhead Press, Deadlift.",
      orderIndex: 1,
    },
  });

  await prisma.trainingPlanWorkout.createMany({
    data: [
      { weekId: week2.id, workoutId: w2d1.id, dayOfWeek: 1, orderIndex: 0 },
      { weekId: week2.id, workoutId: w2d2.id, dayOfWeek: 3, orderIndex: 0 },
      { weekId: week2.id, workoutId: w2d3.id, dayOfWeek: 5, orderIndex: 0 },
      { weekId: week2.id, workoutId: w2d4.id, dayOfWeek: 6, orderIndex: 0 },
    ],
  });

  console.log(`   ✅ Semana 2: ${week2.name}`);

  // Semana 3
  const week3 = await prisma.trainingPlanWeek.create({
    data: {
      planId: trainingPlan.id,
      weekNumber: 3,
      name: "Movimentos CrossFit",
      description: "Wall Ball, Box Jump, Power Clean e introdução a Hero WODs.",
      orderIndex: 2,
    },
  });

  await prisma.trainingPlanWorkout.createMany({
    data: [
      { weekId: week3.id, workoutId: w3d1.id, dayOfWeek: 1, orderIndex: 0 },
      { weekId: week3.id, workoutId: w3d2.id, dayOfWeek: 3, orderIndex: 0 },
      { weekId: week3.id, workoutId: w3d3.id, dayOfWeek: 5, orderIndex: 0 },
      { weekId: week3.id, workoutId: w3d4.id, dayOfWeek: 6, orderIndex: 0 },
    ],
  });

  console.log(`   ✅ Semana 3: ${week3.name}`);

  // Semana 4
  const week4 = await prisma.trainingPlanWeek.create({
    data: {
      planId: trainingPlan.id,
      weekNumber: 4,
      name: "Consolidação e Teste",
      description: "Testes de força (5RM) e benchmark Fran escalado.",
      orderIndex: 3,
    },
  });

  await prisma.trainingPlanWorkout.createMany({
    data: [
      { weekId: week4.id, workoutId: w4d1.id, dayOfWeek: 1, orderIndex: 0 },
      { weekId: week4.id, workoutId: w4d2.id, dayOfWeek: 3, orderIndex: 0 },
      { weekId: week4.id, workoutId: w4d3.id, dayOfWeek: 5, orderIndex: 0 },
      { weekId: week4.id, workoutId: w4d4.id, dayOfWeek: 6, orderIndex: 0 },
    ],
  });

  console.log(`   ✅ Semana 4: ${week4.name}`);

  // Semanas 5-8 reutilizam workouts com notas de progressão
  // Semana 5
  const week5 = await prisma.trainingPlanWeek.create({
    data: {
      planId: trainingPlan.id,
      weekNumber: 5,
      name: "Aumento de Intensidade",
      description:
        "Repetir Semana 1 com cargas ligeiramente superiores (+5-10%).",
      orderIndex: 4,
    },
  });

  await prisma.trainingPlanWorkout.createMany({
    data: [
      {
        weekId: week5.id,
        workoutId: w1d1.id,
        dayOfWeek: 1,
        orderIndex: 0,
        notes: "Aumentar peso no Goblet Squat",
      },
      {
        weekId: week5.id,
        workoutId: w1d2.id,
        dayOfWeek: 3,
        orderIndex: 0,
        notes: "Push-ups completos (não em joelhos)",
      },
      {
        weekId: week5.id,
        workoutId: w1d3.id,
        dayOfWeek: 5,
        orderIndex: 0,
        notes: "KB Swing com peso superior",
      },
      {
        weekId: week5.id,
        workoutId: w1d4.id,
        dayOfWeek: 6,
        orderIndex: 0,
        notes: "Tentar mais rounds no AMRAP",
      },
    ],
  });

  console.log(`   ✅ Semana 5: ${week5.name}`);

  // Semana 6
  const week6 = await prisma.trainingPlanWeek.create({
    data: {
      planId: trainingPlan.id,
      weekNumber: 6,
      name: "Volume Aumentado",
      description: "Repetir Semana 2 com mais volume ou carga.",
      orderIndex: 5,
    },
  });

  await prisma.trainingPlanWorkout.createMany({
    data: [
      {
        weekId: week6.id,
        workoutId: w2d1.id,
        dayOfWeek: 1,
        orderIndex: 0,
        notes: "Back Squat: adicionar 5kg ao peso da semana 2",
      },
      {
        weekId: week6.id,
        workoutId: w2d2.id,
        dayOfWeek: 3,
        orderIndex: 0,
        notes: "OHP: adicionar 2.5-5kg",
      },
      {
        weekId: week6.id,
        workoutId: w2d3.id,
        dayOfWeek: 5,
        orderIndex: 0,
        notes: "Deadlift: adicionar 5-10kg",
      },
      {
        weekId: week6.id,
        workoutId: w2d4.id,
        dayOfWeek: 6,
        orderIndex: 0,
        notes: "Manter ritmo mais elevado",
      },
    ],
  });

  console.log(`   ✅ Semana 6: ${week6.name}`);

  // Semana 7
  const week7 = await prisma.trainingPlanWeek.create({
    data: {
      planId: trainingPlan.id,
      weekNumber: 7,
      name: "Preparação Final",
      description: "Repetir Semana 3 com melhor técnica e ritmo.",
      orderIndex: 6,
    },
  });

  await prisma.trainingPlanWorkout.createMany({
    data: [
      {
        weekId: week7.id,
        workoutId: w3d1.id,
        dayOfWeek: 1,
        orderIndex: 0,
        notes: "Wall Ball: 9kg (homens) / 6kg (mulheres)",
      },
      {
        weekId: week7.id,
        workoutId: w3d2.id,
        dayOfWeek: 3,
        orderIndex: 0,
        notes: "Box Jump: aumentar altura se confortável",
      },
      {
        weekId: week7.id,
        workoutId: w3d3.id,
        dayOfWeek: 5,
        orderIndex: 0,
        notes: "Power Clean: aumentar peso 5kg",
      },
      {
        weekId: week7.id,
        workoutId: w3d4.id,
        dayOfWeek: 6,
        orderIndex: 0,
        notes: "Half Murph: tentar melhorar tempo da semana 3",
      },
    ],
  });

  console.log(`   ✅ Semana 7: ${week7.name}`);

  // Semana 8
  const week8 = await prisma.trainingPlanWeek.create({
    data: {
      planId: trainingPlan.id,
      weekNumber: 8,
      name: "Teste Final",
      description: "Repetir Semana 4 para comparar progressão.",
      orderIndex: 7,
    },
  });

  await prisma.trainingPlanWorkout.createMany({
    data: [
      {
        weekId: week8.id,
        workoutId: w4d1.id,
        dayOfWeek: 1,
        orderIndex: 0,
        notes: "TESTE: Bater o 5RM de Back Squat da semana 4",
      },
      {
        weekId: week8.id,
        workoutId: w4d2.id,
        dayOfWeek: 3,
        orderIndex: 0,
        notes: "TESTE: Bater o 5RM de Deadlift da semana 4",
      },
      {
        weekId: week8.id,
        workoutId: w4d3.id,
        dayOfWeek: 5,
        orderIndex: 0,
        notes: "TESTE: Melhorar tempo do Fran escalado",
      },
      {
        weekId: week8.id,
        workoutId: w4d4.id,
        dayOfWeek: 6,
        orderIndex: 0,
        notes: "TESTE FINAL: Melhorar tempo do Chipper",
      },
    ],
  });

  console.log(`   ✅ Semana 8: ${week8.name}`);

  // ============================================================================
  // RESUMO FINAL
  // ============================================================================
  console.log("\n" + "=".repeat(60));
  console.log("✅ SEED CONCLUÍDO COM SUCESSO!");
  console.log("=".repeat(60));
  console.log(`\n📋 Resumo:`);
  console.log(`   • Plano: ${trainingPlan.name}`);
  console.log(`   • Duração: ${trainingPlan.duration} semanas`);
  console.log(`   • Dificuldade: ${trainingPlan.difficulty}/5`);
  console.log(`   • Público: ${trainingPlan.isPublic ? "Sim" : "Não"}`);
  console.log(`   • Criador: ${user.email}`);
  console.log(`\n📅 Semanas criadas: 8`);
  console.log(`💪 Workouts criados: 16`);
  console.log(`\n🎯 O plano está disponível para todos os utilizadores!`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Erro:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
