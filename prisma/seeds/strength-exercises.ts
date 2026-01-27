/**
 * Seed file for common strength exercises
 * These are global exercises available to all users
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
  // Squats
  { name: "Back Squat", aliases: ["squat", "bs"], category: "GYM" },
  { name: "Front Squat", aliases: ["fs"], category: "GYM" },
  { name: "Overhead Squat", aliases: ["ohs"], category: "WEIGHTLIFTING" },
  { name: "Goblet Squat", aliases: [], category: "GYM" },
  { name: "Air Squat", aliases: [], category: "BODYWEIGHT" },
  { name: "Pistol Squat", aliases: ["pistol"], category: "BODYWEIGHT" },

  // Deadlifts
  { name: "Deadlift", aliases: ["dl"], category: "GYM" },
  { name: "Romanian Deadlift", aliases: ["rdl"], category: "GYM" },
  { name: "Sumo Deadlift", aliases: [], category: "GYM" },
  { name: "Stiff Leg Deadlift", aliases: ["sldl"], category: "GYM" },

  // Pressing
  { name: "Bench Press", aliases: ["bp"], category: "GYM" },
  { name: "Incline Bench Press", aliases: ["incline"], category: "GYM" },
  {
    name: "Overhead Press",
    aliases: ["ohp", "shoulder press", "strict press"],
    category: "GYM",
  },
  { name: "Push Press", aliases: ["pp"], category: "CROSSFIT" },
  { name: "Push Jerk", aliases: ["pj"], category: "WEIGHTLIFTING" },
  { name: "Split Jerk", aliases: ["sj", "jerk"], category: "WEIGHTLIFTING" },
  { name: "Dumbbell Press", aliases: ["db press"], category: "GYM" },

  // Olympic Lifts
  { name: "Snatch", aliases: ["full snatch"], category: "WEIGHTLIFTING" },
  { name: "Power Snatch", aliases: ["ps"], category: "WEIGHTLIFTING" },
  { name: "Hang Snatch", aliases: [], category: "WEIGHTLIFTING" },
  { name: "Hang Power Snatch", aliases: ["hps"], category: "WEIGHTLIFTING" },
  { name: "Clean", aliases: ["full clean"], category: "WEIGHTLIFTING" },
  { name: "Power Clean", aliases: ["pc"], category: "WEIGHTLIFTING" },
  { name: "Hang Clean", aliases: [], category: "WEIGHTLIFTING" },
  { name: "Hang Power Clean", aliases: ["hpc"], category: "WEIGHTLIFTING" },
  { name: "Clean & Jerk", aliases: ["c&j", "cnj"], category: "WEIGHTLIFTING" },

  // CrossFit Specific
  { name: "Thruster", aliases: [], category: "CROSSFIT" },
  {
    name: "Wall Ball",
    aliases: ["wb", "wall ball shot"],
    category: "CROSSFIT",
  },
  {
    name: "Kettlebell Swing",
    aliases: ["kb swing", "kbs"],
    category: "CROSSFIT",
  },
  { name: "Box Jump", aliases: ["bj"], category: "CROSSFIT" },
  { name: "Box Step Up", aliases: [], category: "CROSSFIT" },
  {
    name: "Double Under",
    aliases: ["du", "double unders", "dubs"],
    category: "CROSSFIT",
  },
  { name: "Burpee", aliases: [], category: "CROSSFIT" },
  { name: "Burpee Box Jump Over", aliases: ["bbjo"], category: "CROSSFIT" },
  { name: "Cluster", aliases: [], category: "CROSSFIT" },

  // Pull movements
  { name: "Pull-up", aliases: ["pull up", "pullup"], category: "BODYWEIGHT" },
  { name: "Strict Pull-up", aliases: [], category: "BODYWEIGHT" },
  { name: "Kipping Pull-up", aliases: [], category: "CROSSFIT" },
  { name: "Butterfly Pull-up", aliases: [], category: "CROSSFIT" },
  { name: "Chest-to-Bar", aliases: ["c2b", "ctb"], category: "CROSSFIT" },
  { name: "Bar Muscle-up", aliases: ["bmu", "bar mu"], category: "CROSSFIT" },
  { name: "Ring Muscle-up", aliases: ["rmu", "ring mu"], category: "CROSSFIT" },
  { name: "Chin-up", aliases: [], category: "BODYWEIGHT" },
  { name: "Bent Over Row", aliases: ["row", "barbell row"], category: "GYM" },
  { name: "Pendlay Row", aliases: [], category: "GYM" },
  { name: "Dumbbell Row", aliases: ["db row"], category: "GYM" },
  { name: "Lat Pulldown", aliases: [], category: "GYM" },

  // Core
  { name: "Toes-to-Bar", aliases: ["t2b", "ttb"], category: "CROSSFIT" },
  { name: "Knees-to-Elbow", aliases: ["k2e"], category: "CROSSFIT" },
  { name: "GHD Sit-up", aliases: ["ghd"], category: "CROSSFIT" },
  { name: "Sit-up", aliases: [], category: "BODYWEIGHT" },
  { name: "V-up", aliases: [], category: "BODYWEIGHT" },
  { name: "Plank", aliases: [], category: "BODYWEIGHT" },

  // Gymnastics
  { name: "Handstand Push-up", aliases: ["hspu"], category: "CROSSFIT" },
  {
    name: "Strict Handstand Push-up",
    aliases: ["strict hspu"],
    category: "CROSSFIT",
  },
  {
    name: "Kipping Handstand Push-up",
    aliases: ["kipping hspu"],
    category: "CROSSFIT",
  },
  { name: "Ring Dip", aliases: [], category: "CROSSFIT" },
  { name: "Dip", aliases: ["bar dip"], category: "BODYWEIGHT" },
  { name: "Push-up", aliases: ["pushup"], category: "BODYWEIGHT" },
  { name: "Rope Climb", aliases: ["rc"], category: "CROSSFIT" },
  { name: "Legless Rope Climb", aliases: ["legless rc"], category: "CROSSFIT" },

  // Lunges
  { name: "Lunge", aliases: ["walking lunge"], category: "GYM" },
  { name: "Reverse Lunge", aliases: [], category: "GYM" },
  { name: "Bulgarian Split Squat", aliases: ["bss"], category: "GYM" },
  { name: "Step-up", aliases: [], category: "GYM" },

  // Accessories
  { name: "Bicep Curl", aliases: ["curl", "barbell curl"], category: "GYM" },
  { name: "Dumbbell Curl", aliases: ["db curl"], category: "GYM" },
  { name: "Hammer Curl", aliases: [], category: "GYM" },
  { name: "Tricep Extension", aliases: ["tricep"], category: "GYM" },
  { name: "Skull Crusher", aliases: [], category: "GYM" },
  { name: "Tricep Pushdown", aliases: [], category: "GYM" },
  { name: "Face Pull", aliases: [], category: "GYM" },
  { name: "Lateral Raise", aliases: [], category: "GYM" },
  { name: "Rear Delt Fly", aliases: [], category: "GYM" },
  { name: "Calf Raise", aliases: [], category: "GYM" },
  { name: "Leg Press", aliases: [], category: "GYM" },
  { name: "Leg Extension", aliases: [], category: "GYM" },
  { name: "Leg Curl", aliases: ["hamstring curl"], category: "GYM" },
  { name: "Hip Thrust", aliases: [], category: "GYM" },
  { name: "Glute Bridge", aliases: [], category: "GYM" },

  // Cardio Equipment (for tracking weighted exercises on these)
  {
    name: "Row (Erg)",
    aliases: ["rower", "rowing", "erg row"],
    category: "CARDIO",
  },
  {
    name: "Bike (Erg)",
    aliases: ["assault bike", "bike erg", "airbike", "echo bike"],
    category: "CARDIO",
  },
  { name: "Ski Erg", aliases: ["ski", "skierg"], category: "CARDIO" },

  // Carries
  {
    name: "Farmer Carry",
    aliases: ["farmer walk", "farmers carry"],
    category: "CROSSFIT",
  },
  { name: "Front Rack Carry", aliases: [], category: "CROSSFIT" },
  { name: "Overhead Carry", aliases: [], category: "CROSSFIT" },
  { name: "Sandbag Carry", aliases: [], category: "CROSSFIT" },
  { name: "Yoke Walk", aliases: ["yoke"], category: "CROSSFIT" },

  // Other
  { name: "Turkish Get-up", aliases: ["tgu"], category: "CROSSFIT" },
  { name: "Sled Push", aliases: [], category: "CROSSFIT" },
  { name: "Sled Pull", aliases: ["sled drag"], category: "CROSSFIT" },
  { name: "D-Ball Clean", aliases: ["atlas stone"], category: "CROSSFIT" },
  { name: "Sandbag Clean", aliases: [], category: "CROSSFIT" },
];

async function main() {
  console.log("🏋️ Seeding strength exercises...\n");

  let created = 0;
  let skipped = 0;

  for (const exercise of exercises) {
    const existing = await prisma.strengthExercise.findFirst({
      where: {
        name: exercise.name,
        isGlobal: true,
      },
    });

    if (existing) {
      console.log(`⏭️  Skipping: ${exercise.name} (already exists)`);
      skipped++;
      continue;
    }

    await prisma.strengthExercise.create({
      data: {
        name: exercise.name,
        aliases: exercise.aliases,
        category: exercise.category,
        isGlobal: true,
        createdById: null,
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
