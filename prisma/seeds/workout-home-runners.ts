/**
 * Seed: Treino em Casa para Corredores (25-30 min)
 *
 * Treino completo de corpo inteiro focado em corredores.
 * Inclui aquecimento, bloco principal de força, finisher AMRAP e core/mobilidade.
 * Ideal para dias de descanso ativo ou complemento ao running.
 *
 * Criador: hello@athlifyr.com
 *
 * Execução:
 *   npx tsx prisma/seeds/workout-home-runners.ts
 */

import { PrismaClient, WorkoutBlockType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(
    "🏃 Iniciando seed do Treino em Casa para Corredores (25-30 min)...\n"
  );

  // ============================================================================
  // 1. ENCONTRAR OU CRIAR UTILIZADOR
  // ============================================================================
  const user = await prisma.user.findUnique({
    where: { email: "hello@athlifyr.com" },
  });

  if (!user) {
    console.log("👤 Utilizador hello@athlifyr.com não encontrado.");
    console.log(
      "   Executa primeiro: npx tsx prisma/seeds/training-plan-crossfit-beginners.ts"
    );
    throw new Error("Utilizador hello@athlifyr.com não encontrado!");
  }

  console.log(`✅ Utilizador encontrado: ${user.name} (${user.email})`);

  // ============================================================================
  // 2. ENCONTRAR EXERCÍCIOS NECESSÁRIOS
  // ============================================================================
  console.log("\n📋 Procurando exercícios...");

  const exerciseNames = [
    // Aquecimento
    "Jumping Jacks",
    "Skipping",
    "Hip Circles",
    "Leg Swings",
    "Ankle Mobility",
    // Bloco principal
    "Air Squat",
    "Lunge",
    "Standing Calf Raise",
    "Glute Bridge",
    "Plank",
    // Finisher
    "Mountain Climber",
    "Burpee",
    // Core & Mobilidade
    "Dead Bug",
    "Bird Dog",
    "Alongamento dos Flexores da Anca",
    "Alongamento dos Isquiotibiais",
    "Alongamento dos Gémeos",
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
    console.log("   Executa primeiro: npx tsx prisma/seeds/exercises-seed.ts");
    console.log("   E depois: npx tsx prisma/seeds/mobility-exercises.ts");
    console.log("   E depois: npx tsx prisma/seeds/strength-exercises.ts");
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
  // 3. CRIAR/ATUALIZAR TREINO
  // ============================================================================
  console.log("\n📝 Criando treino...");

  const workoutName = "Treino em Casa para Corredores (25-30 min)";

  // Verificar se já existe
  const existingWorkout = await prisma.workout.findFirst({
    where: {
      createdById: user.id,
      name: workoutName,
    },
  });

  if (existingWorkout) {
    console.log("   ⚠️ Treino já existe, eliminando para recriar...");
    await prisma.workout.delete({
      where: { id: existingWorkout.id },
    });
  }

  const workout = await prisma.workout.create({
    data: {
      name: workoutName,
      description: `Treino completo em casa para corredores (25-30 min).

Programa desenhado para complementar o treino de corrida, focando em força funcional, estabilidade e mobilidade — tudo sem equipamento.

Estrutura:
🔥 Aquecimento (5 min) — Ativar articulações e músculos
💪 Bloco Principal (3 rounds) — Força funcional para corredores
⚡ Finisher AMRAP 5' (opcional) — Condicionamento extra
🧘 Core & Mobilidade (5-10 min) — Estabilidade e recuperação

Benefícios para corredores:
• Fortalece quadríceps, glúteos e gémeos
• Melhora a estabilidade do core e da anca
• Previne lesões comuns em corredores
• Melhora a cadência e a economia de corrida
• Aumenta a mobilidade dos flexores da anca e tornozelos

Ideal para:
• Dias de descanso ativo
• Complemento ao treino de corrida
• Treino em casa sem equipamento
• Corredores de todos os níveis`,
      createdById: user.id,
      estimatedTime: 30,
      difficulty: 2,
      tags: [
        "corrida",
        "runners",
        "casa",
        "bodyweight",
        "mobilidade",
        "força funcional",
      ],
      isTemplate: true,
      isPublic: true,
    },
  });

  console.log(`   ✅ Treino criado: ${workout.name} (ID: ${workout.id})`);

  // ============================================================================
  // 4. BLOCO 1 — 🔥 AQUECIMENTO (5 min)
  // ============================================================================
  console.log("\n🔥 Criando Bloco 1: Aquecimento...");

  const block1 = await prisma.workoutBlock.create({
    data: {
      workoutId: workout.id,
      type: WorkoutBlockType.WARMUP,
      name: "🔥 Aquecimento",
      orderIndex: 0,
      timeCap: 300, // 5 min
      notes: "Ativar articulações e músculos antes do treino principal.",
    },
  });

  // 30s Jumping Jacks
  const jumpingJacks = getExercise("Jumping Jacks");
  if (jumpingJacks) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: block1.id,
        exerciseId: jumpingJacks.id,
        orderIndex: 0,
        prescribedTime: 30,
        notes: "30 segundos de jumping jacks para ativar o corpo.",
      },
    });
  }

  // 30s Skipping no lugar
  const skipping = getExercise("Skipping");
  if (skipping) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: block1.id,
        exerciseId: skipping.id,
        orderIndex: 1,
        prescribedTime: 30,
        notes: "Skipping no lugar. Joelhos altos, braços coordenados.",
      },
    });
  }

  // 10 Círculos de ancas
  const hipCircles = getExercise("Hip Circles");
  if (hipCircles) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: block1.id,
        exerciseId: hipCircles.id,
        orderIndex: 2,
        prescribedReps: 10,
        notes: "10 círculos para cada lado. Movimentos amplos e controlados.",
      },
    });
  }

  // 10 Leg Swings por perna
  const legSwings = getExercise("Leg Swings");
  if (legSwings) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: block1.id,
        exerciseId: legSwings.id,
        orderIndex: 3,
        prescribedReps: 10,
        notes:
          "10 balanços por perna (frente/trás). Segura-te a uma parede se necessário.",
      },
    });
  }

  // 20s Mobilidade de tornozelos
  const ankleMobility = getExercise("Ankle Mobility");
  if (ankleMobility) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: block1.id,
        exerciseId: ankleMobility.id,
        orderIndex: 4,
        prescribedTime: 20,
        notes:
          "20 segundos por tornozelo. Joelho à frente dos dedos do pé, calcanhar no chão.",
      },
    });
  }

  console.log("   ✅ Bloco Aquecimento criado com 5 exercícios");

  // ============================================================================
  // 5. BLOCO 2 — 💪 BLOCO PRINCIPAL (3 rounds)
  // ============================================================================
  console.log("\n💪 Criando Bloco 2: Bloco Principal...");

  const block2 = await prisma.workoutBlock.create({
    data: {
      workoutId: workout.id,
      type: WorkoutBlockType.STRENGTH,
      name: "💪 Bloco Principal",
      orderIndex: 1,
      rounds: 3,
      notes:
        "3 rounds. Descansa 1 min entre rounds. Foco em controlo e boa forma — isto é ouro para corredores!",
    },
  });

  // 1️⃣ Agachamentos – 20
  const airSquat = getExercise("Air Squat");
  if (airSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: block2.id,
        exerciseId: airSquat.id,
        orderIndex: 0,
        prescribedReps: 20,
        notes:
          "Agachamento completo. Anca abaixo dos joelhos, peito aberto, peso nos calcanhares.",
      },
    });
  }

  // 2️⃣ Lunges alternados – 16 (8/8)
  const lunge = getExercise("Lunge");
  if (lunge) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: block2.id,
        exerciseId: lunge.id,
        orderIndex: 1,
        prescribedReps: 16,
        notes:
          "16 total (8 por perna). Joelho de trás quase toca o chão, tronco vertical.",
      },
    });
  }

  // 3️⃣ Elevação de gémeos – 25
  const calfRaise = getExercise("Standing Calf Raise");
  if (calfRaise) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: block2.id,
        exerciseId: calfRaise.id,
        orderIndex: 2,
        prescribedReps: 25,
        notes:
          "Elevação lenta e controlada. Pausa no topo de 1 segundo. Essencial para corredores!",
      },
    });
  }

  // 4️⃣ Ponte de glúteos – 20
  const gluteBridge = getExercise("Glute Bridge");
  if (gluteBridge) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: block2.id,
        exerciseId: gluteBridge.id,
        orderIndex: 3,
        prescribedReps: 20,
        notes:
          "Aperta os glúteos no topo. Pausa de 1 segundo. Core ativado ao longo de todo o movimento.",
      },
    });
  }

  // 5️⃣ Prancha – 40s
  const plank = getExercise("Plank");
  if (plank) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: block2.id,
        exerciseId: plank.id,
        orderIndex: 4,
        prescribedTime: 40,
        notes:
          "40 segundos. Corpo em linha reta dos ombros aos calcanhares. Não deixes a anca subir nem descer.",
      },
    });
  }

  console.log("   ✅ Bloco Principal criado com 5 exercícios (3 rounds)");

  // ============================================================================
  // 6. BLOCO 3 — ⚡ FINISHER AMRAP 5' (opcional)
  // ============================================================================
  console.log("\n⚡ Criando Bloco 3: Finisher AMRAP...");

  const block3 = await prisma.workoutBlock.create({
    data: {
      workoutId: workout.id,
      type: WorkoutBlockType.AMRAP,
      name: "⚡ Finisher (opcional)",
      orderIndex: 2,
      timeCap: 300, // 5 min
      notes:
        "AMRAP 5 minutos. Máximo de rounds possíveis. Bloco opcional para condicionamento extra.",
    },
  });

  // 10 Squats
  if (airSquat) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: block3.id,
        exerciseId: airSquat.id,
        orderIndex: 0,
        prescribedReps: 10,
        notes: "10 agachamentos rápidos mas com boa forma.",
      },
    });
  }

  // 10 Mountain Climbers (cada perna)
  const mountainClimber = getExercise("Mountain Climber");
  if (mountainClimber) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: block3.id,
        exerciseId: mountainClimber.id,
        orderIndex: 1,
        prescribedReps: 10,
        notes:
          "10 por perna (20 total). Ritmo rápido, mãos firmes no chão, core ativado.",
      },
    });
  }

  // 5 Burpees
  const burpee = getExercise("Burpee");
  if (burpee) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: block3.id,
        exerciseId: burpee.id,
        orderIndex: 2,
        prescribedReps: 5,
        notes:
          "Peito ao chão, salto completo. Se necessário, faz sem o salto ou step back.",
      },
    });
  }

  console.log("   ✅ Bloco Finisher criado com 3 exercícios (AMRAP 5')");

  // ============================================================================
  // 7. BLOCO 4 — 🧘 CORE & MOBILIDADE (5-10 min)
  // ============================================================================
  console.log("\n🧘 Criando Bloco 4: Core & Mobilidade...");

  const block4 = await prisma.workoutBlock.create({
    data: {
      workoutId: workout.id,
      type: WorkoutBlockType.COOLDOWN,
      name: "🧘 Core & Mobilidade",
      orderIndex: 3,
      notes:
        "5-10 minutos de estabilização do core e alongamentos. Essencial para prevenir lesões e melhorar a recuperação.",
    },
  });

  // Dead Bug – 10/10
  const deadBug = getExercise("Dead Bug");
  if (deadBug) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: block4.id,
        exerciseId: deadBug.id,
        orderIndex: 0,
        prescribedReps: 10,
        notes:
          "10 por lado. Lombar colada ao chão. Movimento lento e controlado.",
      },
    });
  }

  // Bird Dog – 10/10
  const birdDog = getExercise("Bird Dog");
  if (birdDog) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: block4.id,
        exerciseId: birdDog.id,
        orderIndex: 1,
        prescribedReps: 10,
        notes:
          "10 por lado. Braço e perna opostos em linha reta. Pausa de 2 segundos no topo.",
      },
    });
  }

  // Alongamento dos Flexores da Anca
  const hipFlexorStretch = getExercise("Alongamento dos Flexores da Anca");
  if (hipFlexorStretch) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: block4.id,
        exerciseId: hipFlexorStretch.id,
        orderIndex: 2,
        prescribedTime: 30,
        notes:
          "30 segundos por lado. Posição de lunge baixo, anca empurrada para a frente. Fundamental para corredores!",
      },
    });
  }

  // Alongamento dos Isquiotibiais
  const hamstringStretch = getExercise("Alongamento dos Isquiotibiais");
  if (hamstringStretch) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: block4.id,
        exerciseId: hamstringStretch.id,
        orderIndex: 3,
        prescribedTime: 30,
        notes:
          "30 segundos por perna. Perna estendida, dobra a partir da anca. Sem forçar — respira e relaxa.",
      },
    });
  }

  // Alongamento dos Gémeos
  const calfStretch = getExercise("Alongamento dos Gémeos");
  if (calfStretch) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId: block4.id,
        exerciseId: calfStretch.id,
        orderIndex: 4,
        prescribedTime: 30,
        notes:
          "30 segundos por perna. Contra uma parede, calcanhar no chão, perna de trás esticada.",
      },
    });
  }

  console.log("   ✅ Bloco Core & Mobilidade criado com 5 exercícios");

  // ============================================================================
  // RESUMO FINAL
  // ============================================================================
  console.log("\n" + "=".repeat(60));
  console.log("🎉 Treino criado com sucesso!");
  console.log("=".repeat(60));
  console.log(`\n📋 ${workout.name}`);
  console.log(`   ID: ${workout.id}`);
  console.log(`   Tempo estimado: ${workout.estimatedTime} min`);
  console.log(`   Dificuldade: ${workout.difficulty}/5`);
  console.log(`   Template: ${workout.isTemplate}`);
  console.log(`   Público: ${workout.isPublic}`);
  console.log("\n📦 Blocos:");
  console.log("   1. 🔥 Aquecimento (WARMUP) — 5 exercícios — 5 min");
  console.log("   2. 💪 Bloco Principal (STRENGTH) — 5 exercícios — 3 rounds");
  console.log("   3. ⚡ Finisher (AMRAP) — 3 exercícios — 5 min");
  console.log("   4. 🧘 Core & Mobilidade (COOLDOWN) — 5 exercícios");
  console.log(`\n   Total: 18 exercícios em 4 blocos`);
  console.log("=".repeat(60) + "\n");
}

// Run seed
main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
