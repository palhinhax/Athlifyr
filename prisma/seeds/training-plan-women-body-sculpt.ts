/**
 * Seed: Plano de Treino Body Sculpt & Tone - 6 Semanas
 *
 * Plano completo focado em tonificação, força funcional e condicionamento.
 * Muito procurado por mulheres que querem resultados visíveis e saúde.
 *
 * Criador: ID específico do utilizador
 *
 * Execução:
 *   npx tsx prisma/seeds/training-plan-women-body-sculpt.ts
 */

import { PrismaClient, WorkoutBlockType, WeightUnit } from "@prisma/client";

const prisma = new PrismaClient();

// ID do criador fornecido
const CREATOR_ID = "cmlat692g0000hv0ng924c7w3";

async function main() {
  console.log("💪 Iniciando seed do Plano de Treino Body Sculpt & Tone...\n");

  // ============================================================================
  // 1. VERIFICAR UTILIZADOR
  // ============================================================================
  const user = await prisma.user.findUnique({
    where: { id: CREATOR_ID },
  });

  if (!user) {
    throw new Error(`Utilizador com ID ${CREATOR_ID} não encontrado!`);
  }

  console.log(`✅ Utilizador encontrado: ${user.name} (${user.email})`);

  // ============================================================================
  // 2. ENCONTRAR EXERCÍCIOS NECESSÁRIOS
  // ============================================================================
  console.log("\n📋 Procurando exercícios...");

  const exerciseNames = [
    // Lower Body
    "Air Squat",
    "Goblet Squat",
    "Bulgarian Split Squat",
    "Romanian Deadlift",
    "Hip Thrust",
    "Glute Bridge",
    "Lunge",
    "Reverse Lunge",
    "Walking Lunge",
    "Box Step Up",
    "Calf Raise",
    "Single Leg Deadlift",
    // Upper Body Push
    "Push-up",
    "Dumbbell Press",
    "Overhead Press",
    "Dumbbell Bench Press",
    "Lateral Raise",
    "Tricep Extension",
    // Upper Body Pull
    "Bent Over Row",
    "Dumbbell Row",
    "Lat Pulldown",
    "Face Pull",
    "Pull-up",
    "Chin-up",
    "Bicep Curl",
    // Core
    "Plank",
    "Side Plank",
    "Hollow Hold",
    "Dead Bug",
    "V-up",
    "Mountain Climber",
    "Sit-up",
    // Cardio & Conditioning
    "Kettlebell Swing",
    "Burpee",
    "Box Jump",
    "Jumping Jacks",
    "High Knees",
    "Thruster",
    // Mobility
    "Glute Bridge Hold",
    "Hip Circles",
    "Cat-Cow",
    "Downward Dog",
    "Pigeon Stretch",
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
    console.log("   Alguns exercícios serão ignorados.");
  }

  // Helper para obter exercício
  const getExercise = (name: string) => {
    const ex = exerciseMap.get(name);
    if (!ex) {
      return null;
    }
    return ex;
  };

  // ============================================================================
  // 3. CRIAR/ATUALIZAR PLANO DE TREINO
  // ============================================================================
  console.log("\n📝 Criando plano de treino...");

  const planName = "Body Sculpt & Tone - 6 Semanas";

  // Verificar se já existe
  const existingPlan = await prisma.trainingPlan.findFirst({
    where: {
      createdById: user.id,
      name: planName,
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
      name: planName,
      description: `Programa de treino completo focado em tonificação muscular, força funcional e bem-estar.

Este plano de 6 semanas foi cuidadosamente desenhado para:
- Tonificar e definir os músculos de forma equilibrada
- Fortalecer glúteos, pernas, core e parte superior do corpo
- Melhorar a postura e a confiança corporal
- Aumentar o metabolismo e energia ao longo do dia
- Criar uma rotina sustentável e progressiva

Estrutura do programa:
- 4-5 treinos por semana
- Combinação de força, HIIT e mobilidade
- Progressão gradual em carga e intensidade
- Exercícios funcionais e eficazes

Semanas 1-2: Fundamentos e Técnica
Semanas 3-4: Construção de Força
Semanas 5-6: Intensificação e Definição

O que vais precisar:
- Halteres ajustáveis (2-12kg)
- Kettlebell (8-12kg)
- Banda elástica
- Tapete de yoga
- Caixa ou step (opcional)

Dicas importantes:
- Aquece sempre antes de cada treino
- Hidrata-te bem ao longo do dia
- Dorme pelo menos 7 horas por noite
- Combina com uma alimentação equilibrada`,
      imageUrl:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200",
      createdById: user.id,
      duration: 6,
      difficulty: 2,
      tags: [
        "tonificação",
        "mulheres",
        "glúteos",
        "força",
        "condicionamento",
        "full body",
      ],
      isTemplate: true,
      isPublic: true,
      isPremium: false,
      category: "Fitness",
      targetAudience: "Mulheres",
      goals: [
        "Tonificar e definir músculos",
        "Fortalecer glúteos e pernas",
        "Melhorar postura e core",
        "Aumentar energia e metabolismo",
        "Criar rotina sustentável",
      ],
      requirements: [
        "Halteres ajustáveis (2-12kg)",
        "Kettlebell (8-12kg)",
        "Banda elástica",
        "Tapete de yoga",
        "Caixa ou step (opcional)",
      ],
    },
  });

  console.log(`   ✅ Plano criado: ${trainingPlan.name}`);

  // 🌍 Criar traduções para TODOS os 6 idiomas
  const translations = {
    pt: {
      name: "Body Sculpt & Tone - 6 Semanas",
      description: `Programa de treino completo focado em tonificação muscular, força funcional e bem-estar.

Este plano de 6 semanas foi cuidadosamente desenhado para:
- Tonificar e definir os músculos de forma equilibrada
- Fortalecer glúteos, pernas, core e parte superior do corpo
- Melhorar a postura e estabilidade
- Aumentar o metabolismo e energia diária
- Criar uma rotina de treino sustentável e agradável

O programa inclui 4 treinos por semana com foco em:
• Treinos de força com pesos moderados
• Movimentos compostos para máxima eficiência
• Trabalho específico de glúteos e pernas
• Core e estabilidade
• Mobilidade e recuperação ativa

Progressão semanal:
Semanas 1-2: Adaptação e aprendizagem dos movimentos
Semanas 3-4: Aumento de volume e intensidade
Semanas 5-6: Consolidação e progressão de carga

Ideal para quem procura resultados visíveis com treinos eficientes de 45-60 minutos.`,
      metaTitle: "Body Sculpt & Tone - Plano 6 Semanas Mulheres | Athlifyr",
      metaDescription:
        "Plano de treino feminino: 6 semanas, 4 treinos/semana. Tonifica músculos, fortalece glúteos e pernas, melhora postura. Treinos 45-60min com progressão gradual.",
    },
    en: {
      name: "Body Sculpt & Tone - 6 Weeks",
      description: `Complete training program focused on muscle toning, functional strength and wellness.

This 6-week plan was carefully designed to:
- Tone and define muscles in a balanced way
- Strengthen glutes, legs, core and upper body
- Improve posture and stability
- Increase metabolism and daily energy
- Create a sustainable and enjoyable training routine

The program includes 4 workouts per week focusing on:
• Strength training with moderate weights
• Compound movements for maximum efficiency
• Specific glute and leg work
• Core and stability
• Mobility and active recovery

Weekly progression:
Weeks 1-2: Adaptation and movement learning
Weeks 3-4: Volume and intensity increase
Weeks 5-6: Consolidation and load progression

Ideal for those seeking visible results with efficient 45-60 minute workouts.`,
      metaTitle: "Body Sculpt & Tone - 6 Week Women's Plan | Athlifyr",
      metaDescription:
        "Women's training plan: 6 weeks, 4 workouts/week. Tone muscles, strengthen glutes and legs, improve posture. 45-60min workouts with gradual progression.",
    },
    es: {
      name: "Body Sculpt & Tone - 6 Semanas",
      description: `Programa de entrenamiento completo enfocado en tonificación muscular, fuerza funcional y bienestar.

Este plan de 6 semanas fue cuidadosamente diseñado para:
- Tonificar y definir los músculos de forma equilibrada
- Fortalecer glúteos, piernas, core y parte superior del cuerpo
- Mejorar la postura y estabilidad
- Aumentar el metabolismo y energía diaria
- Crear una rutina de entrenamiento sostenible y agradable

El programa incluye 4 entrenamientos por semana enfocados en:
• Entrenamiento de fuerza con pesos moderados
• Movimientos compuestos para máxima eficiencia
• Trabajo específico de glúteos y piernas
• Core y estabilidad
• Movilidad y recuperación activa

Progresión semanal:
Semanas 1-2: Adaptación y aprendizaje de movimientos
Semanas 3-4: Aumento de volumen e intensidad
Semanas 5-6: Consolidación y progresión de carga

Ideal para quienes buscan resultados visibles con entrenamientos eficientes de 45-60 minutos.`,
      metaTitle: "Body Sculpt & Tone - Plan 6 Semanas Mujeres | Athlifyr",
      metaDescription:
        "Plan de entrenamiento femenino: 6 semanas, 4 entrenamientos/semana. Tonifica músculos, fortalece glúteos y piernas, mejora postura. Entrenamientos 45-60min con progresión gradual.",
    },
    fr: {
      name: "Body Sculpt & Tone - 6 Semaines",
      description: `Programme d'entraînement complet axé sur la tonification musculaire, la force fonctionnelle et le bien-être.

Ce plan de 6 semaines a été soigneusement conçu pour:
- Tonifier et définir les muscles de manière équilibrée
- Renforcer les fessiers, les jambes, le core et le haut du corps
- Améliorer la posture et la stabilité
- Augmenter le métabolisme et l'énergie quotidienne
- Créer une routine d'entraînement durable et agréable

Le programme comprend 4 entraînements par semaine axés sur:
• Entraînement de force avec poids modérés
• Mouvements composés pour une efficacité maximale
• Travail spécifique des fessiers et des jambes
• Core et stabilité
• Mobilité et récupération active

Progression hebdomadaire:
Semaines 1-2: Adaptation et apprentissage des mouvements
Semaines 3-4: Augmentation du volume et de l'intensité
Semaines 5-6: Consolidation et progression de charge

Idéal pour ceux qui recherchent des résultats visibles avec des entraînements efficaces de 45-60 minutes.`,
      metaTitle: "Body Sculpt & Tone - Plan 6 Semaines Femmes | Athlifyr",
      metaDescription:
        "Plan d'entraînement féminin: 6 semaines, 4 entraînements/semaine. Tonifie les muscles, renforce fessiers et jambes, améliore posture. Entraînements 45-60min avec progression graduelle.",
    },
    de: {
      name: "Body Sculpt & Tone - 6 Wochen",
      description: `Komplettes Trainingsprogramm mit Fokus auf Muskelstraffung, funktionelle Kraft und Wohlbefinden.

Dieser 6-Wochen-Plan wurde sorgfältig entwickelt für:
- Straffen und Definieren der Muskeln auf ausgewogene Weise
- Stärkung von Gesäß, Beinen, Core und Oberkörper
- Verbesserung von Haltung und Stabilität
- Steigerung von Stoffwechsel und täglicher Energie
- Schaffung einer nachhaltigen und angenehmen Trainingsroutine

Das Programm umfasst 4 Workouts pro Woche mit Fokus auf:
• Krafttraining mit moderaten Gewichten
• Zusammengesetzte Bewegungen für maximale Effizienz
• Spezifisches Gesäß- und Beintraining
• Core und Stabilität
• Mobilität und aktive Erholung

Wöchentliche Progression:
Wochen 1-2: Anpassung und Bewegungslernen
Wochen 3-4: Volumen- und Intensitätssteigerung
Wochen 5-6: Konsolidierung und Belastungsprogression

Ideal für diejenigen, die sichtbare Ergebnisse mit effizienten 45-60 Minuten Workouts suchen.`,
      metaTitle: "Body Sculpt & Tone - 6 Wochen Frauen Plan | Athlifyr",
      metaDescription:
        "Frauen-Trainingsplan: 6 Wochen, 4 Workouts/Woche. Strafft Muskeln, stärkt Gesäß und Beine, verbessert Haltung. 45-60min Workouts mit schrittweiser Progression.",
    },
    it: {
      name: "Body Sculpt & Tone - 6 Settimane",
      description: `Programma di allenamento completo incentrato su tonificazione muscolare, forza funzionale e benessere.

Questo piano di 6 settimane è stato attentamente progettato per:
- Tonificare e definire i muscoli in modo equilibrato
- Rafforzare glutei, gambe, core e parte superiore del corpo
- Migliorare postura e stabilità
- Aumentare metabolismo ed energia quotidiana
- Creare una routine di allenamento sostenibile e piacevole

Il programma include 4 allenamenti a settimana focalizzati su:
• Allenamento di forza con pesi moderati
• Movimenti composti per massima efficienza
• Lavoro specifico su glutei e gambe
• Core e stabilità
• Mobilità e recupero attivo

Progressione settimanale:
Settimane 1-2: Adattamento e apprendimento movimenti
Settimane 3-4: Aumento di volume e intensità
Settimane 5-6: Consolidamento e progressione del carico

Ideale per chi cerca risultati visibili con allenamenti efficienti di 45-60 minuti.`,
      metaTitle: "Body Sculpt & Tone - Piano 6 Settimane Donne | Athlifyr",
      metaDescription:
        "Piano allenamento femminile: 6 settimane, 4 allenamenti/settimana. Tonifica muscoli, rafforza glutei e gambe, migliora postura. Allenamenti 45-60min con progressione graduale.",
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
  // SEMANA 1 - FUNDAMENTOS
  // ============================================================================
  console.log("\n📅 Semana 1 - Fundamentos");

  // --------------------------------------------------------------------------
  // DIA 1 - Lower Body Focus
  // --------------------------------------------------------------------------
  const w1d1 = await createWorkout(
    "Glute & Legs Foundation",
    "Treino focado em glúteos e pernas. Base para construir força e tonificação.",
    45,
    2,
    ["glúteos", "pernas", "lower body", "tonificação"]
  );

  // Aquecimento
  const w1d1b1 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d1.id,
      type: WorkoutBlockType.WARMUP,
      name: "Aquecimento & Ativação de Glúteos",
      orderIndex: 0,
      notes: "Ativar glúteos e preparar as articulações",
    },
  });

  const hipCircles = getExercise("Hip Circles");
  const gluteBridgeHold = getExercise("Glute Bridge Hold");
  const gluteBridge = getExercise("Glute Bridge");
  const airSquat = getExercise("Air Squat");

  if (hipCircles) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d1b1.id,
        exerciseId: hipCircles.id,
        orderIndex: 0,
        prescribedReps: 10,
        prescribedSets: 2,
        notes: "10 para cada lado",
      },
    });
  }

  if (gluteBridge || gluteBridgeHold) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d1b1.id,
        exerciseId: (gluteBridge || gluteBridgeHold)!.id,
        orderIndex: 1,
        prescribedReps: 15,
        prescribedSets: 2,
        notes: "Aperta os glúteos no topo do movimento",
      },
    });
  }

  if (airSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d1b1.id,
        exerciseId: airSquat.id,
        orderIndex: 2,
        prescribedReps: 10,
        prescribedSets: 2,
        notes: "Movimento controlado, joelhos para fora",
      },
    });
  }

  // Strength Block
  const w1d1b2 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d1.id,
      type: WorkoutBlockType.STRENGTH,
      name: "Força - Lower Body",
      orderIndex: 1,
      rounds: 4,
      notes: "Descanso de 60-90 segundos entre séries",
    },
  });

  const gobletSquat = getExercise("Goblet Squat");
  const rdl = getExercise("Romanian Deadlift");
  const reverseLunge = getExercise("Reverse Lunge");
  const hipThrust = getExercise("Hip Thrust");

  if (gobletSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d1b2.id,
        exerciseId: gobletSquat.id,
        orderIndex: 0,
        prescribedReps: 12,
        prescribedWeight: 8,
        prescribedWeightUnit: WeightUnit.KG,
        notes: "Desce até as coxas ficarem paralelas ao chão",
      },
    });
  }

  if (rdl) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d1b2.id,
        exerciseId: rdl.id,
        orderIndex: 1,
        prescribedReps: 12,
        prescribedWeight: 10,
        prescribedWeightUnit: WeightUnit.KG,
        notes: "Halteres nas mãos, sente o alongamento nos isquiotibiais",
      },
    });
  }

  if (reverseLunge) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d1b2.id,
        exerciseId: reverseLunge.id,
        orderIndex: 2,
        prescribedReps: 10,
        notes: "10 cada perna, alternado",
      },
    });
  }

  if (hipThrust) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d1b2.id,
        exerciseId: hipThrust.id,
        orderIndex: 3,
        prescribedReps: 15,
        notes: "Pausa de 2 seg no topo, aperta glúteos",
      },
    });
  }

  // Finisher
  const w1d1b3 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d1.id,
      type: WorkoutBlockType.AMRAP,
      name: "Finisher - 6 min AMRAP",
      orderIndex: 2,
      timeCap: 360,
      notes: "Ritmo rápido mas controlado",
    },
  });

  const kbSwing = getExercise("Kettlebell Swing");
  const boxStepUp = getExercise("Box Step Up");

  if (kbSwing) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d1b3.id,
        exerciseId: kbSwing.id,
        orderIndex: 0,
        prescribedReps: 15,
        prescribedWeight: 8,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  if (airSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d1b3.id,
        exerciseId: airSquat.id,
        orderIndex: 1,
        prescribedReps: 15,
      },
    });
  }

  if (boxStepUp) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d1b3.id,
        exerciseId: boxStepUp.id,
        orderIndex: 2,
        prescribedReps: 10,
        notes: "Alternar pernas",
      },
    });
  }

  console.log(`   ✅ Dia 1: ${w1d1.name}`);

  // --------------------------------------------------------------------------
  // DIA 2 - Upper Body & Core
  // --------------------------------------------------------------------------
  const w1d2 = await createWorkout(
    "Upper Body & Core Sculpt",
    "Tonificação de braços, ombros, costas e core. Movimentos controlados para máxima definição.",
    40,
    2,
    ["upper body", "core", "braços", "tonificação"]
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

  const catCow = getExercise("Cat-Cow");
  const downwardDog = getExercise("Downward Dog");
  const plank = getExercise("Plank");

  if (catCow) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d2b1.id,
        exerciseId: catCow.id,
        orderIndex: 0,
        prescribedReps: 10,
        notes: "Movimento lento e controlado",
      },
    });
  }

  if (downwardDog) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d2b1.id,
        exerciseId: downwardDog.id,
        orderIndex: 1,
        prescribedTime: 30,
        notes: "Pedalar os pés suavemente",
      },
    });
  }

  if (plank) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d2b1.id,
        exerciseId: plank.id,
        orderIndex: 2,
        prescribedTime: 30,
        prescribedSets: 2,
      },
    });
  }

  // Strength - Push
  const w1d2b2 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d2.id,
      type: WorkoutBlockType.STRENGTH,
      name: "Força - Push",
      orderIndex: 1,
      rounds: 3,
    },
  });

  const pushup = getExercise("Push-up");
  const dbPress = getExercise("Dumbbell Press");
  const lateralRaise = getExercise("Lateral Raise");
  const tricepExt = getExercise("Tricep Extension");

  if (pushup) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d2b2.id,
        exerciseId: pushup.id,
        orderIndex: 0,
        prescribedReps: 10,
        notes: "Podes fazer de joelhos se necessário",
      },
    });
  }

  if (dbPress) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d2b2.id,
        exerciseId: dbPress.id,
        orderIndex: 1,
        prescribedReps: 12,
        prescribedWeight: 5,
        prescribedWeightUnit: WeightUnit.KG,
        notes: "Em pé ou sentada",
      },
    });
  }

  if (lateralRaise) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d2b2.id,
        exerciseId: lateralRaise.id,
        orderIndex: 2,
        prescribedReps: 15,
        prescribedWeight: 3,
        prescribedWeightUnit: WeightUnit.KG,
        notes: "Movimento controlado, sem balanço",
      },
    });
  }

  if (tricepExt) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d2b2.id,
        exerciseId: tricepExt.id,
        orderIndex: 3,
        prescribedReps: 12,
        prescribedWeight: 4,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  // Strength - Pull
  const w1d2b3 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d2.id,
      type: WorkoutBlockType.STRENGTH,
      name: "Força - Pull",
      orderIndex: 2,
      rounds: 3,
    },
  });

  const bentRow = getExercise("Bent Over Row");
  const dbRow = getExercise("Dumbbell Row");
  const bicepCurl = getExercise("Bicep Curl");

  if (bentRow) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d2b3.id,
        exerciseId: bentRow.id,
        orderIndex: 0,
        prescribedReps: 12,
        prescribedWeight: 10,
        prescribedWeightUnit: WeightUnit.KG,
        notes: "Com halteres, costas retas",
      },
    });
  }

  if (dbRow) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d2b3.id,
        exerciseId: dbRow.id,
        orderIndex: 1,
        prescribedReps: 10,
        prescribedWeight: 6,
        prescribedWeightUnit: WeightUnit.KG,
        notes: "10 cada braço",
      },
    });
  }

  if (bicepCurl) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d2b3.id,
        exerciseId: bicepCurl.id,
        orderIndex: 2,
        prescribedReps: 12,
        prescribedWeight: 4,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  // Core Finisher
  const w1d2b4 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d2.id,
      type: WorkoutBlockType.STRENGTH,
      name: "Core Sculpt",
      orderIndex: 3,
      rounds: 3,
    },
  });

  const hollowHold = getExercise("Hollow Hold");
  const deadBug = getExercise("Dead Bug");
  const sidePlank = getExercise("Side Plank");

  if (plank) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d2b4.id,
        exerciseId: plank.id,
        orderIndex: 0,
        prescribedTime: 30,
      },
    });
  }

  if (hollowHold) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d2b4.id,
        exerciseId: hollowHold.id,
        orderIndex: 1,
        prescribedTime: 20,
        notes: "Lombar bem colada ao chão",
      },
    });
  }

  if (deadBug) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d2b4.id,
        exerciseId: deadBug.id,
        orderIndex: 2,
        prescribedReps: 10,
        notes: "10 cada lado, controlado",
      },
    });
  }

  if (sidePlank) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d2b4.id,
        exerciseId: sidePlank.id,
        orderIndex: 3,
        prescribedTime: 20,
        notes: "20 seg cada lado",
      },
    });
  }

  console.log(`   ✅ Dia 2: ${w1d2.name}`);

  // --------------------------------------------------------------------------
  // DIA 3 - Full Body HIIT
  // --------------------------------------------------------------------------
  const w1d3 = await createWorkout(
    "Full Body HIIT Burn",
    "Treino de alta intensidade para queimar calorias e tonificar todo o corpo.",
    35,
    3,
    ["HIIT", "full body", "cardio", "queima calórica"]
  );

  // Aquecimento
  const w1d3b1 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d3.id,
      type: WorkoutBlockType.WARMUP,
      name: "Aquecimento Dinâmico",
      orderIndex: 0,
    },
  });

  const jumpingJacks = getExercise("Jumping Jacks");
  const highKnees = getExercise("High Knees");
  const mountainClimber = getExercise("Mountain Climber");

  if (jumpingJacks) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d3b1.id,
        exerciseId: jumpingJacks.id,
        orderIndex: 0,
        prescribedTime: 30,
        prescribedSets: 2,
      },
    });
  }

  if (highKnees) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d3b1.id,
        exerciseId: highKnees.id,
        orderIndex: 1,
        prescribedTime: 30,
        prescribedSets: 2,
      },
    });
  }

  if (airSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d3b1.id,
        exerciseId: airSquat.id,
        orderIndex: 2,
        prescribedReps: 10,
      },
    });
  }

  // HIIT Circuit 1
  const w1d3b2 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d3.id,
      type: WorkoutBlockType.EMOM,
      name: "EMOM - 12 min",
      orderIndex: 1,
      rounds: 4,
      timeCap: 720,
      notes: "3 movimentos rotativos, 1 minuto cada. 4 rondas totais.",
    },
  });

  const burpee = getExercise("Burpee");

  if (kbSwing) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d3b2.id,
        exerciseId: kbSwing.id,
        orderIndex: 0,
        prescribedReps: 12,
        prescribedWeight: 8,
        prescribedWeightUnit: WeightUnit.KG,
        notes: "Min 1: Kettlebell Swings",
      },
    });
  }

  if (pushup) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d3b2.id,
        exerciseId: pushup.id,
        orderIndex: 1,
        prescribedReps: 10,
        notes: "Min 2: Push-ups",
      },
    });
  }

  if (airSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d3b2.id,
        exerciseId: airSquat.id,
        orderIndex: 2,
        prescribedReps: 15,
        notes: "Min 3: Air Squats",
      },
    });
  }

  // HIIT Circuit 2 - Tabata Style
  const w1d3b3 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d3.id,
      type: WorkoutBlockType.TABATA,
      name: "Tabata Finisher - 4 min",
      orderIndex: 2,
      rounds: 8,
      timeCap: 240,
      notes:
        "20 seg trabalho / 10 seg descanso. Alternar entre os 2 exercícios.",
    },
  });

  if (burpee) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d3b3.id,
        exerciseId: burpee.id,
        orderIndex: 0,
        prescribedTime: 20,
        notes: "Máximo de reps em 20 seg",
      },
    });
  }

  if (mountainClimber) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d3b3.id,
        exerciseId: mountainClimber.id,
        orderIndex: 1,
        prescribedTime: 20,
        notes: "Máximo de reps em 20 seg",
      },
    });
  }

  console.log(`   ✅ Dia 3: ${w1d3.name}`);

  // --------------------------------------------------------------------------
  // DIA 4 - Glute Focused
  // --------------------------------------------------------------------------
  const w1d4 = await createWorkout(
    "Glute Builder",
    "Treino intensivo focado exclusivamente em glúteos. Exercícios específicos para levantar e definir.",
    40,
    2,
    ["glúteos", "booty", "lower body"]
  );

  // Aquecimento & Ativação
  const w1d4b1 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d4.id,
      type: WorkoutBlockType.WARMUP,
      name: "Ativação de Glúteos",
      orderIndex: 0,
      notes: "Fundamental para recrutar bem os glúteos no treino",
    },
  });

  if (hipCircles) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d4b1.id,
        exerciseId: hipCircles.id,
        orderIndex: 0,
        prescribedReps: 10,
        prescribedSets: 2,
        notes: "10 cada direção",
      },
    });
  }

  if (gluteBridge || gluteBridgeHold) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d4b1.id,
        exerciseId: (gluteBridge || gluteBridgeHold)!.id,
        orderIndex: 1,
        prescribedReps: 20,
        prescribedSets: 2,
        notes: "Pausa no topo, foco na contração",
      },
    });
  }

  // Glute Builder - Main
  const w1d4b2 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d4.id,
      type: WorkoutBlockType.STRENGTH,
      name: "Glute Builder - Série Principal",
      orderIndex: 1,
      rounds: 4,
    },
  });

  if (hipThrust) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d4b2.id,
        exerciseId: hipThrust.id,
        orderIndex: 0,
        prescribedReps: 15,
        prescribedWeight: 10,
        prescribedWeightUnit: WeightUnit.KG,
        notes: "Peso na anca, pausa de 2 seg no topo",
      },
    });
  }

  const bulgarianSS = getExercise("Bulgarian Split Squat");
  if (bulgarianSS) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d4b2.id,
        exerciseId: bulgarianSS.id,
        orderIndex: 1,
        prescribedReps: 10,
        notes: "10 cada perna, pé de trás elevado",
      },
    });
  }

  const singleLegDL = getExercise("Single Leg Deadlift");
  if (singleLegDL) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d4b2.id,
        exerciseId: singleLegDL.id,
        orderIndex: 2,
        prescribedReps: 10,
        prescribedWeight: 6,
        prescribedWeightUnit: WeightUnit.KG,
        notes: "10 cada perna, foco no equilíbrio",
      },
    });
  }

  if (kbSwing) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d4b2.id,
        exerciseId: kbSwing.id,
        orderIndex: 3,
        prescribedReps: 20,
        prescribedWeight: 10,
        prescribedWeightUnit: WeightUnit.KG,
        notes: "Extensão completa da anca",
      },
    });
  }

  // Glute Burnout
  const w1d4b3 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d4.id,
      type: WorkoutBlockType.FOR_TIME,
      name: "Glute Burnout - 100 reps",
      orderIndex: 2,
      notes: "Completar o mais rápido possível com boa forma",
    },
  });

  if (gluteBridge || gluteBridgeHold) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d4b3.id,
        exerciseId: (gluteBridge || gluteBridgeHold)!.id,
        orderIndex: 0,
        prescribedReps: 25,
      },
    });
  }

  const lunge = getExercise("Lunge");
  if (lunge) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d4b3.id,
        exerciseId: lunge.id,
        orderIndex: 1,
        prescribedReps: 25,
        notes: "Total (alternado)",
      },
    });
  }

  if (airSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d4b3.id,
        exerciseId: airSquat.id,
        orderIndex: 2,
        prescribedReps: 25,
      },
    });
  }

  if (boxStepUp) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d4b3.id,
        exerciseId: boxStepUp.id,
        orderIndex: 3,
        prescribedReps: 25,
        notes: "Total (alternado)",
      },
    });
  }

  console.log(`   ✅ Dia 4: ${w1d4.name}`);

  // --------------------------------------------------------------------------
  // DIA 5 - Active Recovery & Mobility
  // --------------------------------------------------------------------------
  const w1d5 = await createWorkout(
    "Active Recovery & Stretch",
    "Sessão de recuperação ativa com mobilidade e alongamentos. Essencial para a recuperação.",
    30,
    1,
    ["mobilidade", "recovery", "alongamentos", "yoga"]
  );

  const w1d5b1 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d5.id,
      type: WorkoutBlockType.WARMUP,
      name: "Mobilidade Suave",
      orderIndex: 0,
      notes: "Movimentos lentos e controlados",
    },
  });

  if (catCow) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d5b1.id,
        exerciseId: catCow.id,
        orderIndex: 0,
        prescribedReps: 15,
        notes: "Respiração profunda a cada movimento",
      },
    });
  }

  if (hipCircles) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d5b1.id,
        exerciseId: hipCircles.id,
        orderIndex: 1,
        prescribedReps: 10,
        prescribedSets: 2,
        notes: "10 cada direção, movimentos amplos",
      },
    });
  }

  if (downwardDog) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d5b1.id,
        exerciseId: downwardDog.id,
        orderIndex: 2,
        prescribedTime: 45,
        notes: "Pedalar os pés, alongar a coluna",
      },
    });
  }

  // Stretching
  const w1d5b2 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d5.id,
      type: WorkoutBlockType.COOLDOWN,
      name: "Alongamentos Profundos",
      orderIndex: 1,
      notes: "Manter cada posição por 45-60 segundos",
    },
  });

  const pigeonStretch = getExercise("Pigeon Stretch");
  if (pigeonStretch) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d5b2.id,
        exerciseId: pigeonStretch.id,
        orderIndex: 0,
        prescribedTime: 60,
        notes: "60 seg cada lado - alongamento profundo de glúteo",
      },
    });
  }

  if (downwardDog) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d5b2.id,
        exerciseId: downwardDog.id,
        orderIndex: 1,
        prescribedTime: 60,
        notes: "Respiração profunda, relaxar o pescoço",
      },
    });
  }

  // Light Core
  const w1d5b3 = await prisma.workoutBlock.create({
    data: {
      workoutId: w1d5.id,
      type: WorkoutBlockType.STRENGTH,
      name: "Core Suave",
      orderIndex: 2,
      rounds: 2,
    },
  });

  if (deadBug) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d5b3.id,
        exerciseId: deadBug.id,
        orderIndex: 0,
        prescribedReps: 10,
        notes: "Lento e controlado",
      },
    });
  }

  if (hollowHold) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w1d5b3.id,
        exerciseId: hollowHold.id,
        orderIndex: 1,
        prescribedTime: 20,
      },
    });
  }

  console.log(`   ✅ Dia 5: ${w1d5.name}`);

  // ============================================================================
  // SEMANA 2 - PROGRESSÃO
  // ============================================================================
  console.log("\n📅 Semana 2 - Progressão");

  // --------------------------------------------------------------------------
  // DIA 1 - Lower Body Progressive
  // --------------------------------------------------------------------------
  const w2d1 = await createWorkout(
    "Lower Body Progressive",
    "Aumento de volume e intensidade nos exercícios de lower body.",
    50,
    2,
    ["glúteos", "pernas", "progressive", "força"]
  );

  const w2d1b1 = await prisma.workoutBlock.create({
    data: {
      workoutId: w2d1.id,
      type: WorkoutBlockType.WARMUP,
      name: "Aquecimento & Ativação",
      orderIndex: 0,
    },
  });

  if (hipCircles) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d1b1.id,
        exerciseId: hipCircles.id,
        orderIndex: 0,
        prescribedReps: 10,
        prescribedSets: 2,
      },
    });
  }

  if (airSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d1b1.id,
        exerciseId: airSquat.id,
        orderIndex: 1,
        prescribedReps: 15,
        prescribedSets: 2,
      },
    });
  }

  // Main Strength
  const w2d1b2 = await prisma.workoutBlock.create({
    data: {
      workoutId: w2d1.id,
      type: WorkoutBlockType.STRENGTH,
      name: "Força - Lower Body",
      orderIndex: 1,
      rounds: 4,
    },
  });

  if (gobletSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d1b2.id,
        exerciseId: gobletSquat.id,
        orderIndex: 0,
        prescribedReps: 12,
        prescribedWeight: 10,
        prescribedWeightUnit: WeightUnit.KG,
        notes: "Aumentamos o peso! Técnica perfeita.",
      },
    });
  }

  if (rdl) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d1b2.id,
        exerciseId: rdl.id,
        orderIndex: 1,
        prescribedReps: 12,
        prescribedWeight: 12,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  if (bulgarianSS) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d1b2.id,
        exerciseId: bulgarianSS.id,
        orderIndex: 2,
        prescribedReps: 10,
        prescribedWeight: 4,
        prescribedWeightUnit: WeightUnit.KG,
        notes: "10 cada perna, com halteres",
      },
    });
  }

  if (hipThrust) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d1b2.id,
        exerciseId: hipThrust.id,
        orderIndex: 3,
        prescribedReps: 15,
        prescribedWeight: 12,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  // Conditioning
  const w2d1b3 = await prisma.workoutBlock.create({
    data: {
      workoutId: w2d1.id,
      type: WorkoutBlockType.AMRAP,
      name: "Finisher - 8 min AMRAP",
      orderIndex: 2,
      timeCap: 480,
    },
  });

  if (kbSwing) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d1b3.id,
        exerciseId: kbSwing.id,
        orderIndex: 0,
        prescribedReps: 15,
        prescribedWeight: 10,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  if (gobletSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d1b3.id,
        exerciseId: gobletSquat.id,
        orderIndex: 1,
        prescribedReps: 12,
        prescribedWeight: 8,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  const walkingLunge = getExercise("Walking Lunge");
  if (walkingLunge) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d1b3.id,
        exerciseId: walkingLunge.id,
        orderIndex: 2,
        prescribedReps: 16,
        notes: "Total (8 cada perna)",
      },
    });
  }

  console.log(`   ✅ Dia 1: ${w2d1.name}`);

  // --------------------------------------------------------------------------
  // DIA 2 - Upper Body Strength
  // --------------------------------------------------------------------------
  const w2d2 = await createWorkout(
    "Upper Body Strength & Tone",
    "Foco em construir força na parte superior do corpo com exercícios compostos.",
    45,
    2,
    ["upper body", "força", "braços", "ombros"]
  );

  const w2d2b1 = await prisma.workoutBlock.create({
    data: {
      workoutId: w2d2.id,
      type: WorkoutBlockType.WARMUP,
      name: "Aquecimento",
      orderIndex: 0,
    },
  });

  if (catCow) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d2b1.id,
        exerciseId: catCow.id,
        orderIndex: 0,
        prescribedReps: 10,
      },
    });
  }

  if (pushup) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d2b1.id,
        exerciseId: pushup.id,
        orderIndex: 1,
        prescribedReps: 5,
        prescribedSets: 2,
        notes: "Movimento lento, aquecimento",
      },
    });
  }

  // Push Block
  const w2d2b2 = await prisma.workoutBlock.create({
    data: {
      workoutId: w2d2.id,
      type: WorkoutBlockType.STRENGTH,
      name: "Push - Superset",
      orderIndex: 1,
      rounds: 4,
      notes: "Superset: 2 exercícios seguidos, depois descanso",
    },
  });

  const dbBenchPress = getExercise("Dumbbell Bench Press");
  if (dbBenchPress) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d2b2.id,
        exerciseId: dbBenchPress.id,
        orderIndex: 0,
        prescribedReps: 12,
        prescribedWeight: 6,
        prescribedWeightUnit: WeightUnit.KG,
        notes: "Deitada no chão ou banco",
      },
    });
  }

  if (pushup) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d2b2.id,
        exerciseId: pushup.id,
        orderIndex: 1,
        prescribedReps: 10,
        notes: "Logo após o bench press",
      },
    });
  }

  // Shoulders
  const w2d2b3 = await prisma.workoutBlock.create({
    data: {
      workoutId: w2d2.id,
      type: WorkoutBlockType.STRENGTH,
      name: "Ombros & Tríceps",
      orderIndex: 2,
      rounds: 3,
    },
  });

  const ohp = getExercise("Overhead Press");
  if (ohp) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d2b3.id,
        exerciseId: ohp.id,
        orderIndex: 0,
        prescribedReps: 10,
        prescribedWeight: 6,
        prescribedWeightUnit: WeightUnit.KG,
        notes: "Com halteres",
      },
    });
  }

  if (lateralRaise) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d2b3.id,
        exerciseId: lateralRaise.id,
        orderIndex: 1,
        prescribedReps: 15,
        prescribedWeight: 3,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  if (tricepExt) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d2b3.id,
        exerciseId: tricepExt.id,
        orderIndex: 2,
        prescribedReps: 12,
        prescribedWeight: 5,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  // Pull Block
  const w2d2b4 = await prisma.workoutBlock.create({
    data: {
      workoutId: w2d2.id,
      type: WorkoutBlockType.STRENGTH,
      name: "Pull - Costas & Bíceps",
      orderIndex: 3,
      rounds: 3,
    },
  });

  if (bentRow) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d2b4.id,
        exerciseId: bentRow.id,
        orderIndex: 0,
        prescribedReps: 12,
        prescribedWeight: 12,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  if (dbRow) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d2b4.id,
        exerciseId: dbRow.id,
        orderIndex: 1,
        prescribedReps: 10,
        prescribedWeight: 8,
        prescribedWeightUnit: WeightUnit.KG,
        notes: "10 cada braço",
      },
    });
  }

  if (bicepCurl) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d2b4.id,
        exerciseId: bicepCurl.id,
        orderIndex: 2,
        prescribedReps: 12,
        prescribedWeight: 5,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  console.log(`   ✅ Dia 2: ${w2d2.name}`);

  // --------------------------------------------------------------------------
  // DIA 3 - Full Body Circuit
  // --------------------------------------------------------------------------
  const w2d3 = await createWorkout(
    "Full Body Circuit Training",
    "Circuito completo para todo o corpo. Alta intensidade com pouco descanso.",
    40,
    3,
    ["full body", "circuito", "HIIT", "condicionamento"]
  );

  const w2d3b1 = await prisma.workoutBlock.create({
    data: {
      workoutId: w2d3.id,
      type: WorkoutBlockType.WARMUP,
      name: "Aquecimento Dinâmico",
      orderIndex: 0,
    },
  });

  if (jumpingJacks) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d3b1.id,
        exerciseId: jumpingJacks.id,
        orderIndex: 0,
        prescribedTime: 45,
      },
    });
  }

  if (airSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d3b1.id,
        exerciseId: airSquat.id,
        orderIndex: 1,
        prescribedReps: 10,
      },
    });
  }

  if (pushup) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d3b1.id,
        exerciseId: pushup.id,
        orderIndex: 2,
        prescribedReps: 5,
      },
    });
  }

  // Circuit
  const w2d3b2 = await prisma.workoutBlock.create({
    data: {
      workoutId: w2d3.id,
      type: WorkoutBlockType.FOR_TIME,
      name: "Circuit - 4 Rondas",
      orderIndex: 1,
      rounds: 4,
      timeCap: 1200,
      notes: "Completar 4 rondas o mais rápido possível. Max 20 min.",
    },
  });

  if (gobletSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d3b2.id,
        exerciseId: gobletSquat.id,
        orderIndex: 0,
        prescribedReps: 12,
        prescribedWeight: 8,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  if (pushup) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d3b2.id,
        exerciseId: pushup.id,
        orderIndex: 1,
        prescribedReps: 10,
      },
    });
  }

  if (kbSwing) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d3b2.id,
        exerciseId: kbSwing.id,
        orderIndex: 2,
        prescribedReps: 15,
        prescribedWeight: 8,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  if (bentRow) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d3b2.id,
        exerciseId: bentRow.id,
        orderIndex: 3,
        prescribedReps: 12,
        prescribedWeight: 8,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  if (reverseLunge) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d3b2.id,
        exerciseId: reverseLunge.id,
        orderIndex: 4,
        prescribedReps: 16,
        notes: "Total (8 cada perna)",
      },
    });
  }

  // Core Finisher
  const w2d3b3 = await prisma.workoutBlock.create({
    data: {
      workoutId: w2d3.id,
      type: WorkoutBlockType.STRENGTH,
      name: "Core Finisher",
      orderIndex: 2,
      rounds: 2,
    },
  });

  if (plank) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d3b3.id,
        exerciseId: plank.id,
        orderIndex: 0,
        prescribedTime: 45,
      },
    });
  }

  const vUp = getExercise("V-up");
  if (vUp) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d3b3.id,
        exerciseId: vUp.id,
        orderIndex: 1,
        prescribedReps: 15,
      },
    });
  }

  if (mountainClimber) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d3b3.id,
        exerciseId: mountainClimber.id,
        orderIndex: 2,
        prescribedReps: 20,
        notes: "Total (10 cada perna)",
      },
    });
  }

  console.log(`   ✅ Dia 3: ${w2d3.name}`);

  // --------------------------------------------------------------------------
  // DIA 4 - Glute & Hamstring Focus
  // --------------------------------------------------------------------------
  const w2d4 = await createWorkout(
    "Glute & Hamstring Sculptor",
    "Treino intensivo para glúteos e isquiotibiais. Foco na parte posterior.",
    45,
    2,
    ["glúteos", "isquiotibiais", "posterior chain"]
  );

  const w2d4b1 = await prisma.workoutBlock.create({
    data: {
      workoutId: w2d4.id,
      type: WorkoutBlockType.WARMUP,
      name: "Ativação",
      orderIndex: 0,
    },
  });

  if (gluteBridge || gluteBridgeHold) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d4b1.id,
        exerciseId: (gluteBridge || gluteBridgeHold)!.id,
        orderIndex: 0,
        prescribedReps: 15,
        prescribedSets: 2,
      },
    });
  }

  if (hipCircles) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d4b1.id,
        exerciseId: hipCircles.id,
        orderIndex: 1,
        prescribedReps: 10,
        prescribedSets: 2,
      },
    });
  }

  // Main Strength
  const w2d4b2 = await prisma.workoutBlock.create({
    data: {
      workoutId: w2d4.id,
      type: WorkoutBlockType.STRENGTH,
      name: "Força - Posterior Chain",
      orderIndex: 1,
      rounds: 4,
    },
  });

  if (rdl) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d4b2.id,
        exerciseId: rdl.id,
        orderIndex: 0,
        prescribedReps: 12,
        prescribedWeight: 14,
        prescribedWeightUnit: WeightUnit.KG,
        notes: "Sente o alongamento nos isquiotibiais",
      },
    });
  }

  if (hipThrust) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d4b2.id,
        exerciseId: hipThrust.id,
        orderIndex: 1,
        prescribedReps: 15,
        prescribedWeight: 15,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  if (singleLegDL) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d4b2.id,
        exerciseId: singleLegDL.id,
        orderIndex: 2,
        prescribedReps: 10,
        prescribedWeight: 6,
        prescribedWeightUnit: WeightUnit.KG,
        notes: "10 cada perna",
      },
    });
  }

  if (kbSwing) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d4b2.id,
        exerciseId: kbSwing.id,
        orderIndex: 3,
        prescribedReps: 20,
        prescribedWeight: 12,
        prescribedWeightUnit: WeightUnit.KG,
      },
    });
  }

  // Superset Finisher
  const w2d4b3 = await prisma.workoutBlock.create({
    data: {
      workoutId: w2d4.id,
      type: WorkoutBlockType.STRENGTH,
      name: "Superset Finisher",
      orderIndex: 2,
      rounds: 3,
      notes: "Sem descanso entre exercícios, 60 seg entre rondas",
    },
  });

  if (gluteBridge || gluteBridgeHold) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d4b3.id,
        exerciseId: (gluteBridge || gluteBridgeHold)!.id,
        orderIndex: 0,
        prescribedReps: 20,
        notes: "Pausa de 3 seg no topo",
      },
    });
  }

  if (reverseLunge) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: w2d4b3.id,
        exerciseId: reverseLunge.id,
        orderIndex: 1,
        prescribedReps: 12,
        notes: "12 cada perna",
      },
    });
  }

  console.log(`   ✅ Dia 4: ${w2d4.name}`);

  // ============================================================================
  // CRIAR SEMANAS DO PLANO E ASSOCIAR WORKOUTS
  // ============================================================================
  console.log("\n� Criando estrutura de semanas...");

  // Semana 1
  const week1 = await prisma.trainingPlanWeek.create({
    data: {
      planId: trainingPlan.id,
      weekNumber: 1,
      name: "Fundamentos",
      description:
        "Introdução aos movimentos base. Foco na técnica e ativação muscular.",
      orderIndex: 0,
    },
  });

  await prisma.trainingPlanWorkout.createMany({
    data: [
      { weekId: week1.id, workoutId: w1d1.id, dayOfWeek: 1, orderIndex: 0 }, // Segunda
      { weekId: week1.id, workoutId: w1d2.id, dayOfWeek: 2, orderIndex: 0 }, // Terça
      { weekId: week1.id, workoutId: w1d3.id, dayOfWeek: 3, orderIndex: 0 }, // Quarta
      { weekId: week1.id, workoutId: w1d4.id, dayOfWeek: 4, orderIndex: 0 }, // Quinta
      { weekId: week1.id, workoutId: w1d5.id, dayOfWeek: 5, orderIndex: 0 }, // Sexta
    ],
  });

  console.log(`   ✅ Semana 1: ${week1.name}`);

  // Semana 2
  const week2 = await prisma.trainingPlanWeek.create({
    data: {
      planId: trainingPlan.id,
      weekNumber: 2,
      name: "Progressão",
      description: "Aumento de volume e intensidade. Introdução a supersets.",
      orderIndex: 1,
    },
  });

  await prisma.trainingPlanWorkout.createMany({
    data: [
      { weekId: week2.id, workoutId: w2d1.id, dayOfWeek: 1, orderIndex: 0 },
      { weekId: week2.id, workoutId: w2d2.id, dayOfWeek: 2, orderIndex: 0 },
      { weekId: week2.id, workoutId: w2d3.id, dayOfWeek: 3, orderIndex: 0 },
      { weekId: week2.id, workoutId: w2d4.id, dayOfWeek: 4, orderIndex: 0 },
      { weekId: week2.id, workoutId: w1d5.id, dayOfWeek: 5, orderIndex: 0 },
    ],
  });

  console.log(`   ✅ Semana 2: ${week2.name}`);

  // Semana 3
  const week3 = await prisma.trainingPlanWeek.create({
    data: {
      planId: trainingPlan.id,
      weekNumber: 3,
      name: "Consolidação",
      description:
        "Consolidar os movimentos aprendidos. Preparar para aumento de carga.",
      orderIndex: 2,
    },
  });

  await prisma.trainingPlanWorkout.createMany({
    data: [
      { weekId: week3.id, workoutId: w1d1.id, dayOfWeek: 1, orderIndex: 0 },
      { weekId: week3.id, workoutId: w1d2.id, dayOfWeek: 2, orderIndex: 0 },
      { weekId: week3.id, workoutId: w1d3.id, dayOfWeek: 3, orderIndex: 0 },
      { weekId: week3.id, workoutId: w1d4.id, dayOfWeek: 4, orderIndex: 0 },
      { weekId: week3.id, workoutId: w1d5.id, dayOfWeek: 5, orderIndex: 0 },
    ],
  });

  console.log(`   ✅ Semana 3: ${week3.name}`);

  // Semana 4
  const week4 = await prisma.trainingPlanWeek.create({
    data: {
      planId: trainingPlan.id,
      weekNumber: 4,
      name: "Força",
      description: "Foco em construir força. Aumento progressivo de cargas.",
      orderIndex: 3,
    },
  });

  await prisma.trainingPlanWorkout.createMany({
    data: [
      { weekId: week4.id, workoutId: w2d1.id, dayOfWeek: 1, orderIndex: 0 },
      { weekId: week4.id, workoutId: w2d2.id, dayOfWeek: 2, orderIndex: 0 },
      { weekId: week4.id, workoutId: w2d3.id, dayOfWeek: 3, orderIndex: 0 },
      { weekId: week4.id, workoutId: w2d4.id, dayOfWeek: 4, orderIndex: 0 },
      { weekId: week4.id, workoutId: w1d5.id, dayOfWeek: 5, orderIndex: 0 },
    ],
  });

  console.log(`   ✅ Semana 4: ${week4.name}`);

  // Semana 5
  const week5 = await prisma.trainingPlanWeek.create({
    data: {
      planId: trainingPlan.id,
      weekNumber: 5,
      name: "Intensificação",
      description: "Semana de alta intensidade. Preparar para a semana final.",
      orderIndex: 4,
    },
  });

  await prisma.trainingPlanWorkout.createMany({
    data: [
      { weekId: week5.id, workoutId: w1d1.id, dayOfWeek: 1, orderIndex: 0 },
      { weekId: week5.id, workoutId: w1d2.id, dayOfWeek: 2, orderIndex: 0 },
      { weekId: week5.id, workoutId: w1d3.id, dayOfWeek: 3, orderIndex: 0 },
      { weekId: week5.id, workoutId: w1d4.id, dayOfWeek: 4, orderIndex: 0 },
      { weekId: week5.id, workoutId: w1d5.id, dayOfWeek: 5, orderIndex: 0 },
    ],
  });

  console.log(`   ✅ Semana 5: ${week5.name}`);

  // Semana 6
  const week6 = await prisma.trainingPlanWeek.create({
    data: {
      planId: trainingPlan.id,
      weekNumber: 6,
      name: "Definição & Teste",
      description:
        "Semana final! Máxima definição e teste de progressão. Celebra os teus resultados!",
      orderIndex: 5,
    },
  });

  await prisma.trainingPlanWorkout.createMany({
    data: [
      { weekId: week6.id, workoutId: w2d1.id, dayOfWeek: 1, orderIndex: 0 },
      { weekId: week6.id, workoutId: w2d2.id, dayOfWeek: 2, orderIndex: 0 },
      { weekId: week6.id, workoutId: w2d3.id, dayOfWeek: 3, orderIndex: 0 },
      { weekId: week6.id, workoutId: w2d4.id, dayOfWeek: 4, orderIndex: 0 },
      { weekId: week6.id, workoutId: w1d5.id, dayOfWeek: 5, orderIndex: 0 },
    ],
  });

  console.log(`   ✅ Semana 6: ${week6.name}`);

  // ============================================================================
  // RESUMO FINAL
  // ============================================================================
  console.log("\n" + "=".repeat(60));
  console.log("✅ SEED CONCLUÍDO COM SUCESSO!");
  console.log("=".repeat(60));
  console.log(`\n📋 Plano criado: ${trainingPlan.name}`);
  console.log(`   - Duração: ${trainingPlan.duration} semanas`);
  console.log(`   - Dificuldade: ${trainingPlan.difficulty}/5`);
  console.log(`   - Público-alvo: ${trainingPlan.targetAudience}`);
  console.log(`   - Categoria: ${trainingPlan.category}`);
  console.log(`\n💪 Workouts únicos criados: 9`);
  console.log(`📅 Total de sessões no plano: 30 (5 por semana x 6 semanas)`);
  console.log(`👤 Criador: ${user.name}`);
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
