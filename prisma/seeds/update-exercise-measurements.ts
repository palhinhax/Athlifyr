/**
 * Script to update existing exercises with measurement fields
 * Run with: npx ts-node prisma/seeds/update-exercise-measurements.ts
 */

import { PrismaClient, ExerciseCategory } from "@prisma/client";

const prisma = new PrismaClient();

// Define measurement fields for each category as defaults
// These can be overridden per exercise name
interface MeasurementFields {
  hasReps: boolean;
  hasWeight: boolean;
  hasDistance: boolean;
  hasTime: boolean;
  hasCalories: boolean;
  hasHeight: boolean;
}

function getDefaultMeasurementsForCategory(
  category: ExerciseCategory
): MeasurementFields {
  switch (category) {
    case "CARDIO":
      return {
        hasReps: false,
        hasWeight: false,
        hasDistance: true,
        hasTime: true,
        hasCalories: true,
        hasHeight: false,
      };
    case "BODYWEIGHT":
      return {
        hasReps: true,
        hasWeight: false,
        hasDistance: false,
        hasTime: true,
        hasCalories: false,
        hasHeight: false,
      };
    case "WEIGHTLIFTING":
    case "GYM":
      return {
        hasReps: true,
        hasWeight: true,
        hasDistance: false,
        hasTime: false,
        hasCalories: false,
        hasHeight: false,
      };
    case "CROSSFIT":
      return {
        hasReps: true,
        hasWeight: true,
        hasDistance: false,
        hasTime: true,
        hasCalories: false,
        hasHeight: false,
      };
    case "OTHER":
    default:
      return {
        hasReps: true,
        hasWeight: false,
        hasDistance: false,
        hasTime: false,
        hasCalories: false,
        hasHeight: false,
      };
  }
}

// Special overrides for specific exercises
const exerciseOverrides: Record<string, Partial<MeasurementFields>> = {
  // Rowing machines - have distance, time, and calories
  Remo: { hasDistance: true, hasTime: true, hasCalories: true },
  "Row Machine": { hasDistance: true, hasTime: true, hasCalories: true },
  "Remo Concept2": { hasDistance: true, hasTime: true, hasCalories: true },
  "Rowing Machine": { hasDistance: true, hasTime: true, hasCalories: true },

  // Assault bike / Air bike - has calories
  "Assault Bike": { hasDistance: false, hasTime: true, hasCalories: true },
  "Air Bike": { hasDistance: false, hasTime: true, hasCalories: true },
  "Echo Bike": { hasDistance: false, hasTime: true, hasCalories: true },
  Bicicleta: { hasDistance: true, hasTime: true, hasCalories: true },

  // Ski erg - has calories
  "Ski Erg": { hasDistance: true, hasTime: true, hasCalories: true },

  // Box jumps - have height
  "Box Jump": { hasReps: true, hasHeight: true },
  "Box Step-Up": { hasReps: true, hasHeight: true },
  "Box Jump Over": { hasReps: true, hasHeight: true },

  // Planks - time based
  Prancha: { hasReps: false, hasTime: true },
  Plank: { hasReps: false, hasTime: true },
  "Side Plank": { hasReps: false, hasTime: true },
  "Prancha Lateral": { hasReps: false, hasTime: true },

  // Wall sits - time based
  "Wall Sit": { hasReps: false, hasTime: true },
  "Agachamento Isométrico": { hasReps: false, hasTime: true },

  // Deadhang - time based
  "Dead Hang": { hasReps: false, hasTime: true },
  Deadhang: { hasReps: false, hasTime: true },

  // Jumps - have height option
  "Vertical Jump": { hasReps: true, hasHeight: true },
  "Salto Vertical": { hasReps: true, hasHeight: true },

  // Double unders / Jump rope - reps and time
  "Double Unders": { hasReps: true, hasTime: true },
  "Single Unders": { hasReps: true, hasTime: true },
  "Saltar à Corda": { hasReps: true, hasTime: true },
};

async function main() {
  console.log("🔄 Starting exercise measurement fields update...\n");

  // Get all exercises
  const exercises = await prisma.exercise.findMany();
  console.log(`📊 Found ${exercises.length} exercises to update\n`);

  let updated = 0;
  let errors = 0;

  for (const exercise of exercises) {
    try {
      // Get default measurements based on category
      const defaults = getDefaultMeasurementsForCategory(exercise.category);

      // Check for specific overrides
      const overrides = exerciseOverrides[exercise.name] || {};

      // Merge defaults with overrides
      const measurements = { ...defaults, ...overrides };

      await prisma.exercise.update({
        where: { id: exercise.id },
        data: measurements,
      });

      console.log(
        `✅ ${exercise.name} (${exercise.category}): ` +
          `reps=${measurements.hasReps}, weight=${measurements.hasWeight}, ` +
          `distance=${measurements.hasDistance}, time=${measurements.hasTime}, ` +
          `calories=${measurements.hasCalories}, height=${measurements.hasHeight}`
      );
      updated++;
    } catch (error) {
      console.error(`❌ Error updating ${exercise.name}:`, error);
      errors++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Updated: ${updated}`);
  console.log(`   ❌ Errors: ${errors}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
