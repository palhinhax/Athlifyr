/**
 * Seed file for mobility, stretching, and warm-up exercises
 * These are global exercises available to all users
 * Common in CrossFit classes and general fitness
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ExerciseSeed {
  name: string;
  aliases: string[];
  category:
    | "CROSSFIT"
    | "GYM"
    | "WEIGHTLIFTING"
    | "BODYWEIGHT"
    | "CARDIO"
    | "OTHER";
}

const exercises: ExerciseSeed[] = [
  // ============================================
  // WARM-UP / AQUECIMENTO
  // ============================================
  {
    name: "Aquecimento",
    aliases: ["warm-up", "warmup", "warm up"],
    category: "OTHER",
  },
  {
    name: "Aquecimento Geral",
    aliases: ["general warm-up"],
    category: "OTHER",
  },
  {
    name: "Aquecimento Específico",
    aliases: ["specific warm-up"],
    category: "OTHER",
  },

  // ============================================
  // RUNNING / CORRIDA
  // ============================================
  { name: "Corrida", aliases: ["run", "running"], category: "CARDIO" },
  { name: "Corrida 100m", aliases: ["100m run"], category: "CARDIO" },
  { name: "Corrida 200m", aliases: ["200m run"], category: "CARDIO" },
  { name: "Corrida 400m", aliases: ["400m run"], category: "CARDIO" },
  { name: "Corrida 800m", aliases: ["800m run"], category: "CARDIO" },
  { name: "Corrida 1km", aliases: ["1k run", "1000m run"], category: "CARDIO" },
  { name: "Corrida 1.5km", aliases: ["1.5k run"], category: "CARDIO" },
  { name: "Corrida 2km", aliases: ["2k run"], category: "CARDIO" },
  { name: "Corrida 5km", aliases: ["5k run"], category: "CARDIO" },
  { name: "Sprint", aliases: ["sprint run"], category: "CARDIO" },
  { name: "Jog", aliases: ["jogging", "light run"], category: "CARDIO" },
  { name: "Shuttle Run", aliases: ["shuttle"], category: "CARDIO" },

  // ============================================
  // QUADRUPED POSITIONS / POSIÇÕES EM 4 APOIOS
  // ============================================
  {
    name: "Em 4 Apoios",
    aliases: ["quadruped", "all fours", "4 apoios"],
    category: "BODYWEIGHT",
  },
  {
    name: "Cat-Cow",
    aliases: ["cat cow", "gato-vaca", "cat camel"],
    category: "BODYWEIGHT",
  },
  {
    name: "Quadruped Position",
    aliases: ["posição quadrúpede"],
    category: "BODYWEIGHT",
  },
  {
    name: "Tabletop Position",
    aliases: ["posição mesa", "mesa"],
    category: "BODYWEIGHT",
  },
  {
    name: "Bird Dog",
    aliases: ["bird-dog", "pássaro-cão"],
    category: "BODYWEIGHT",
  },
  {
    name: "Bear Crawl",
    aliases: ["bear walk", "rastejamento urso"],
    category: "BODYWEIGHT",
  },
  {
    name: "Crab Walk",
    aliases: ["crab crawl", "caranguejo"],
    category: "BODYWEIGHT",
  },

  // ============================================
  // YOGA POSES - COMMON IN CROSSFIT
  // ============================================
  {
    name: "Downward Dog",
    aliases: [
      "down dog",
      "cão olhando para baixo",
      "adho mukha svanasana",
      "costas para cima",
    ],
    category: "BODYWEIGHT",
  },
  {
    name: "Upward Dog",
    aliases: [
      "up dog",
      "cão olhando para cima",
      "urdhva mukha svanasana",
      "costas para baixo",
    ],
    category: "BODYWEIGHT",
  },
  {
    name: "Cobra Stretch",
    aliases: ["cobra pose", "cobra", "bhujangasana"],
    category: "BODYWEIGHT",
  },
  {
    name: "Child's Pose",
    aliases: ["childs pose", "posição da criança", "balasana"],
    category: "BODYWEIGHT",
  },
  {
    name: "Pigeon Stretch",
    aliases: ["pigeon pose", "pomba", "hip pigeon", "eka pada rajakapotasana"],
    category: "BODYWEIGHT",
  },

  // ============================================
  // MOBILITY STRETCHES
  // ============================================
  {
    name: "World's Greatest Stretch",
    aliases: ["wgs", "greatest stretch", "spiderman stretch"],
    category: "BODYWEIGHT",
  },
  {
    name: "Frog Stretch",
    aliases: ["frog pose", "rã", "mandukasana"],
    category: "BODYWEIGHT",
  },
  {
    name: "90/90 Stretch",
    aliases: ["90-90", "ninety ninety", "90/90 hip stretch"],
    category: "BODYWEIGHT",
  },
  {
    name: "Seated Forward Fold",
    aliases: ["forward fold", "paschimottanasana", "pike stretch"],
    category: "BODYWEIGHT",
  },
  {
    name: "Standing Forward Fold",
    aliases: ["uttanasana", "standing pike"],
    category: "BODYWEIGHT",
  },
  {
    name: "Butterfly Stretch",
    aliases: ["butterfly", "borboleta", "baddha konasana"],
    category: "BODYWEIGHT",
  },
  {
    name: "Straddle Stretch",
    aliases: ["middle split stretch", "upavistha konasana"],
    category: "BODYWEIGHT",
  },
  {
    name: "Couch Stretch",
    aliases: ["couch quad stretch"],
    category: "BODYWEIGHT",
  },

  // ============================================
  // ARM STRETCHES / ALONGAMENTOS DE BRAÇOS
  // ============================================
  {
    name: "Alongamento dos Bíceps",
    aliases: ["bicep stretch", "biceps stretch"],
    category: "BODYWEIGHT",
  },
  {
    name: "Alongamento dos Tríceps",
    aliases: ["tricep stretch", "triceps stretch", "overhead tricep stretch"],
    category: "BODYWEIGHT",
  },
  {
    name: "Alongamento dos Ombros",
    aliases: ["shoulder stretch", "cross-body shoulder stretch"],
    category: "BODYWEIGHT",
  },
  {
    name: "Alongamento dos Antebraços",
    aliases: ["forearm stretch", "wrist stretch"],
    category: "BODYWEIGHT",
  },
  {
    name: "Alongamento dos Pulsos",
    aliases: ["wrist stretch", "wrist mobility"],
    category: "BODYWEIGHT",
  },
  {
    name: "Arm Circles",
    aliases: ["círculos de braços", "arm rotations"],
    category: "BODYWEIGHT",
  },

  // ============================================
  // LEG STRETCHES / ALONGAMENTOS DE PERNAS
  // ============================================
  {
    name: "Alongamento dos Quadríceps",
    aliases: ["quad stretch", "quadriceps stretch"],
    category: "BODYWEIGHT",
  },
  {
    name: "Alongamento dos Isquiotibiais",
    aliases: ["hamstring stretch", "hamstrings stretch"],
    category: "BODYWEIGHT",
  },
  {
    name: "Alongamento dos Gémeos",
    aliases: ["calf stretch", "calves stretch", "alongamento das panturrilhas"],
    category: "BODYWEIGHT",
  },
  {
    name: "Alongamento dos Adutores",
    aliases: ["adductor stretch", "inner thigh stretch", "groin stretch"],
    category: "BODYWEIGHT",
  },
  {
    name: "Alongamento dos Glúteos",
    aliases: ["glute stretch", "figure 4 stretch", "piriformis stretch"],
    category: "BODYWEIGHT",
  },
  {
    name: "Alongamento dos Flexores da Anca",
    aliases: ["hip flexor stretch", "psoas stretch", "lunge stretch"],
    category: "BODYWEIGHT",
  },
  {
    name: "Leg Swings",
    aliases: ["balanços de pernas", "leg pendulum"],
    category: "BODYWEIGHT",
  },

  // ============================================
  // BACK/SPINE STRETCHES / ALONGAMENTOS COSTAS
  // ============================================
  {
    name: "Alongamento das Costas",
    aliases: ["back stretch", "spine stretch"],
    category: "BODYWEIGHT",
  },
  {
    name: "Alongamento Lombar",
    aliases: ["lower back stretch", "lumbar stretch"],
    category: "BODYWEIGHT",
  },
  {
    name: "Spinal Twist",
    aliases: ["supine twist", "lying twist", "torção da coluna"],
    category: "BODYWEIGHT",
  },
  {
    name: "Scorpion Stretch",
    aliases: ["scorpion", "escorpião"],
    category: "BODYWEIGHT",
  },
  {
    name: "Thread the Needle",
    aliases: ["thoracic rotation"],
    category: "BODYWEIGHT",
  },

  // ============================================
  // NECK STRETCHES / ALONGAMENTOS PESCOÇO
  // ============================================
  {
    name: "Alongamento do Pescoço",
    aliases: ["neck stretch", "neck mobility"],
    category: "BODYWEIGHT",
  },
  {
    name: "Neck Circles",
    aliases: ["círculos de pescoço", "neck rotations"],
    category: "BODYWEIGHT",
  },

  // ============================================
  // HIP MOBILITY / MOBILIDADE DA ANCA
  // ============================================
  {
    name: "Hip Circles",
    aliases: ["círculos de anca", "hip rotations"],
    category: "BODYWEIGHT",
  },
  {
    name: "Hip Opener",
    aliases: ["hip opening", "abertura de anca"],
    category: "BODYWEIGHT",
  },
  {
    name: "Hip CARs",
    aliases: [
      "controlled articular rotations",
      "hip controlled articular rotations",
    ],
    category: "BODYWEIGHT",
  },
  {
    name: "Fire Hydrant",
    aliases: ["hydrant", "hidrante"],
    category: "BODYWEIGHT",
  },
  {
    name: "Clamshell",
    aliases: ["clam", "concha"],
    category: "BODYWEIGHT",
  },
  {
    name: "Glute Bridge Hold",
    aliases: ["bridge hold", "ponte"],
    category: "BODYWEIGHT",
  },

  // ============================================
  // ANKLE MOBILITY / MOBILIDADE DO TORNOZELO
  // ============================================
  {
    name: "Ankle Circles",
    aliases: ["círculos de tornozelo", "ankle rotations"],
    category: "BODYWEIGHT",
  },
  {
    name: "Ankle Mobility",
    aliases: ["mobilidade do tornozelo"],
    category: "BODYWEIGHT",
  },
  {
    name: "Calf Raises (Warm-up)",
    aliases: ["heel raises", "elevação de calcanhares"],
    category: "BODYWEIGHT",
  },

  // ============================================
  // SHOULDER MOBILITY / MOBILIDADE DO OMBRO
  // ============================================
  {
    name: "Shoulder CARs",
    aliases: ["shoulder controlled articular rotations"],
    category: "BODYWEIGHT",
  },
  {
    name: "Shoulder Pass-Through",
    aliases: [
      "pass-through",
      "pvc pass-through",
      "dislocates",
      "shoulder dislocate",
    ],
    category: "BODYWEIGHT",
  },
  {
    name: "Wall Slides",
    aliases: ["wall angels", "anjos na parede"],
    category: "BODYWEIGHT",
  },
  {
    name: "Band Pull-Apart",
    aliases: ["band pull apart", "elástico"],
    category: "BODYWEIGHT",
  },

  // ============================================
  // THORACIC MOBILITY / MOBILIDADE TORÁCICA
  // ============================================
  {
    name: "Thoracic Extension",
    aliases: ["t-spine extension", "extensão torácica"],
    category: "BODYWEIGHT",
  },
  {
    name: "Thoracic Rotation",
    aliases: ["t-spine rotation", "rotação torácica"],
    category: "BODYWEIGHT",
  },
  {
    name: "Foam Rolling",
    aliases: ["foam roller", "rolo de espuma", "smr"],
    category: "OTHER",
  },
  {
    name: "Lacrosse Ball",
    aliases: ["bola de lacrosse", "trigger point", "ponto gatilho"],
    category: "OTHER",
  },

  // ============================================
  // CORE ACTIVATION / ATIVAÇÃO DO CORE
  // ============================================
  {
    name: "Dead Bug",
    aliases: ["inseto morto"],
    category: "BODYWEIGHT",
  },
  {
    name: "Hollow Hold",
    aliases: ["hollow body hold"],
    category: "BODYWEIGHT",
  },
  {
    name: "Hollow Rock",
    aliases: ["hollow body rock"],
    category: "BODYWEIGHT",
  },
  { name: "Superman Hold", aliases: ["super-homem"], category: "BODYWEIGHT" },
  { name: "Arch Hold", aliases: ["arch body hold"], category: "BODYWEIGHT" },

  // ============================================
  // PLYOMETRICS / PLIOMETRIA (WARM-UP)
  // ============================================
  {
    name: "Jumping Jacks",
    aliases: ["star jumps", "polichinelos"],
    category: "CARDIO",
  },
  {
    name: "High Knees",
    aliases: ["joelhos altos", "running in place"],
    category: "CARDIO",
  },
  {
    name: "Butt Kicks",
    aliases: ["calcanhares ao glúteo", "heel kicks"],
    category: "CARDIO",
  },
  { name: "Skipping", aliases: ["skip", "skips"], category: "CARDIO" },
  { name: "A-Skip", aliases: ["a skip"], category: "CARDIO" },
  { name: "B-Skip", aliases: ["b skip"], category: "CARDIO" },
  { name: "Karaoke", aliases: ["carioca", "grapevine"], category: "CARDIO" },
  { name: "Side Shuffle", aliases: ["lateral shuffle"], category: "CARDIO" },
  {
    name: "Broad Jump",
    aliases: ["standing long jump", "salto em comprimento"],
    category: "BODYWEIGHT",
  },
  {
    name: "Squat Jump",
    aliases: ["jump squat", "salto agachamento"],
    category: "BODYWEIGHT",
  },

  // ============================================
  // BREATHING / RESPIRAÇÃO
  // ============================================
  {
    name: "Breathing Exercise",
    aliases: ["exercício de respiração", "breath work"],
    category: "OTHER",
  },
  {
    name: "Box Breathing",
    aliases: ["respiração quadrada", "4-4-4-4"],
    category: "OTHER",
  },
  {
    name: "Diaphragmatic Breathing",
    aliases: ["respiração diafragmática", "belly breathing"],
    category: "OTHER",
  },

  // ============================================
  // OTHER COMMON MOVEMENTS
  // ============================================
  { name: "Inchworm", aliases: ["minhoca", "walkout"], category: "BODYWEIGHT" },
  {
    name: "Mountain Climber",
    aliases: ["mountain climbers", "escalador"],
    category: "BODYWEIGHT",
  },
  { name: "Spiderman Lunge", aliases: ["spiderman"], category: "BODYWEIGHT" },
  { name: "Samson Stretch", aliases: ["samson lunge"], category: "BODYWEIGHT" },
  {
    name: "PVC Overhead Squat",
    aliases: ["pvc ohs", "empty bar ohs"],
    category: "BODYWEIGHT",
  },
  {
    name: "Empty Bar Complex",
    aliases: ["barbell complex", "warm-up complex"],
    category: "OTHER",
  },
  {
    name: "Burgener Warm-up",
    aliases: ["burgener"],
    category: "WEIGHTLIFTING",
  },
];

async function main() {
  console.log("🧘 Seeding mobility and warm-up exercises...\n");

  let created = 0;
  let skipped = 0;

  for (const exercise of exercises) {
    // Check if exercise already exists (by name)
    const existing = await prisma.strengthExercise.findFirst({
      where: {
        name: {
          equals: exercise.name,
          mode: "insensitive",
        },
        isGlobal: true,
      },
    });

    if (existing) {
      console.log(`⏭️  Skipped: ${exercise.name} (already exists)`);
      skipped++;
      continue;
    }

    await prisma.strengthExercise.create({
      data: {
        name: exercise.name,
        aliases: exercise.aliases,
        category: exercise.category,
        isGlobal: true,
        createdById: null, // Global exercise, no specific creator
      },
    });

    console.log(`✅ Created: ${exercise.name} (${exercise.category})`);
    created++;
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Created: ${created}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Total:   ${exercises.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding exercises:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
