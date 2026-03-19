import { prisma } from "@/lib/prisma";
import type {
  WorkoutBlockType,
  WeightUnit,
  DistanceUnit,
} from "@prisma/client";

// ── Types ───────────────────────────────────────────────────────────────────

interface SetPrescriptionInput {
  setNumber: number;
  reps?: number;
  weight?: number;
  weightUnit?: WeightUnit;
  weightPercent?: number;
  time?: number;
  distance?: number;
  distanceUnit?: DistanceUnit;
  calories?: number;
  repsFemale?: number;
  weightFemale?: number;
  weightUnitFemale?: WeightUnit;
  weightPercentFemale?: number;
  timeFemale?: number;
  distanceFemale?: number;
  distanceUnitFemale?: DistanceUnit;
  caloriesFemale?: number;
  notes?: string;
}

interface ExercisePrescription {
  prescribedReps?: number | null;
  prescribedWeight?: number | null;
  prescribedWeightUnit?: WeightUnit | null;
  prescribedWeightPercent?: number | null;
  prescribedDistance?: number | null;
  prescribedDistanceUnit?: DistanceUnit | null;
  prescribedTime?: number | null;
  prescribedCalories?: number | null;
  prescribedSets?: number | null;
  prescribedRepsFemale?: number | null;
  prescribedWeightFemale?: number | null;
  prescribedWeightUnitFemale?: WeightUnit | null;
  prescribedWeightPercentFemale?: number | null;
  prescribedDistanceFemale?: number | null;
  prescribedDistanceUnitFemale?: DistanceUnit | null;
  prescribedTimeFemale?: number | null;
  prescribedCaloriesFemale?: number | null;
  prescribedSetsFemale?: number | null;
  notes?: string | null;
}

interface BlockExerciseInput extends ExercisePrescription {
  id?: string;
  exerciseId: string;
  orderIndex: number;
  setPrescriptions?: SetPrescriptionInput[];
}

interface GroupExerciseInput extends ExercisePrescription {
  id?: string;
  exerciseId: string;
  orderIndex?: number;
}

interface ExerciseGroupInput {
  id?: string;
  name?: string | null;
  orderIndex: number;
  rounds: number;
  restBetweenRounds?: number | null;
  notes?: string | null;
  exercises: GroupExerciseInput[];
}

export interface BlockInput {
  id?: string;
  type: WorkoutBlockType;
  name?: string | null;
  orderIndex: number;
  timeCap?: number | null;
  workTime?: number | null;
  rounds?: number | null;
  notes?: string | null;
  exercises: BlockExerciseInput[];
  exerciseGroups?: ExerciseGroupInput[];
}

// ── Validation ──────────────────────────────────────────────────────────────

export async function validateExercisesExist(
  blocks: BlockInput[]
): Promise<string[]> {
  const exerciseIds = blocks.flatMap((b) =>
    b.exercises.map((e) => e.exerciseId)
  );
  const uniqueIds = [...new Set(exerciseIds)];

  if (uniqueIds.length === 0) return [];

  const found = await prisma.exercise.findMany({
    where: { id: { in: uniqueIds } },
    select: { id: true },
  });

  const foundSet = new Set(found.map((e) => e.id));
  return uniqueIds.filter((id) => !foundSet.has(id));
}

// ── Cleanup ─────────────────────────────────────────────────────────────────

export async function deleteExistingBlocksAndResults(
  workoutId: string
): Promise<void> {
  const blocks = await prisma.workoutBlock.findMany({
    where: { workoutId },
    select: {
      id: true,
      exercises: { select: { id: true } },
    },
  });

  const blockIds = blocks.map((b) => b.id);
  const exerciseIds = blocks.flatMap((b) => b.exercises.map((e) => e.id));

  if (exerciseIds.length > 0) {
    await prisma.workoutExerciseResult.deleteMany({
      where: { blockExerciseId: { in: exerciseIds } },
    });
  }

  if (blockIds.length > 0) {
    await prisma.workoutBlockResult.deleteMany({
      where: { blockId: { in: blockIds } },
    });
  }

  await prisma.workoutBlock.deleteMany({ where: { workoutId } });
}

// ── Block creation ──────────────────────────────────────────────────────────

export async function createWorkoutBlocks(
  workoutId: string,
  blocks: BlockInput[]
): Promise<void> {
  for (const blockData of blocks) {
    const createdBlock = await prisma.workoutBlock.create({
      data: {
        workoutId,
        type: blockData.type,
        name: blockData.name,
        orderIndex: blockData.orderIndex,
        timeCap: blockData.timeCap,
        workTime: blockData.workTime,
        rounds: blockData.rounds,
        notes: blockData.notes,
      },
    });

    await createBlockExercises(createdBlock.id, blockData.exercises);
    await createExerciseGroups(createdBlock.id, blockData.exerciseGroups);
  }
}

async function createBlockExercises(
  blockId: string,
  exercises: BlockExerciseInput[]
): Promise<void> {
  for (const exercise of exercises) {
    await prisma.workoutBlockExercise.create({
      data: {
        blockId,
        exerciseId: exercise.exerciseId,
        orderIndex: exercise.orderIndex,
        ...extractPrescriptionFields(exercise),
        ...(exercise.setPrescriptions && exercise.setPrescriptions.length > 0
          ? {
              setPrescriptions: {
                create: exercise.setPrescriptions.map((sp) => ({
                  setNumber: sp.setNumber,
                  reps: sp.reps,
                  weight: sp.weight,
                  weightUnit: sp.weightUnit,
                  weightPercent: sp.weightPercent,
                  time: sp.time,
                  distance: sp.distance,
                  distanceUnit: sp.distanceUnit,
                  calories: sp.calories,
                  repsFemale: sp.repsFemale,
                  weightFemale: sp.weightFemale,
                  weightUnitFemale: sp.weightUnitFemale,
                  weightPercentFemale: sp.weightPercentFemale,
                  timeFemale: sp.timeFemale,
                  distanceFemale: sp.distanceFemale,
                  distanceUnitFemale: sp.distanceUnitFemale,
                  caloriesFemale: sp.caloriesFemale,
                  notes: sp.notes,
                })),
              },
            }
          : {}),
      },
    });
  }
}

async function createExerciseGroups(
  blockId: string,
  groups?: ExerciseGroupInput[]
): Promise<void> {
  if (!groups || groups.length === 0) return;

  for (const groupData of groups) {
    const createdGroup = await prisma.exerciseGroup.create({
      data: {
        blockId,
        name: groupData.name,
        orderIndex: groupData.orderIndex,
        rounds: groupData.rounds,
        restBetweenRounds: groupData.restBetweenRounds,
        notes: groupData.notes,
      },
    });

    for (let idx = 0; idx < groupData.exercises.length; idx++) {
      const ex = groupData.exercises[idx];
      await prisma.workoutBlockExercise.create({
        data: {
          blockId,
          groupId: createdGroup.id,
          exerciseId: ex.exerciseId,
          orderIndex: ex.orderIndex ?? idx,
          ...extractPrescriptionFields(ex),
        },
      });
    }
  }
}

function extractPrescriptionFields(ex: ExercisePrescription) {
  return {
    prescribedReps: ex.prescribedReps,
    prescribedWeight: ex.prescribedWeight,
    prescribedWeightUnit: ex.prescribedWeightUnit,
    prescribedWeightPercent: ex.prescribedWeightPercent,
    prescribedDistance: ex.prescribedDistance,
    prescribedDistanceUnit: ex.prescribedDistanceUnit,
    prescribedTime: ex.prescribedTime,
    prescribedCalories: ex.prescribedCalories,
    prescribedSets: ex.prescribedSets,
    prescribedRepsFemale: ex.prescribedRepsFemale,
    prescribedWeightFemale: ex.prescribedWeightFemale,
    prescribedWeightUnitFemale: ex.prescribedWeightUnitFemale,
    prescribedWeightPercentFemale: ex.prescribedWeightPercentFemale,
    prescribedDistanceFemale: ex.prescribedDistanceFemale,
    prescribedDistanceUnitFemale: ex.prescribedDistanceUnitFemale,
    prescribedTimeFemale: ex.prescribedTimeFemale,
    prescribedCaloriesFemale: ex.prescribedCaloriesFemale,
    prescribedSetsFemale: ex.prescribedSetsFemale,
    notes: ex.notes,
  };
}

// ── Full workout query ──────────────────────────────────────────────────────

export const workoutFullInclude = {
  createdBy: {
    select: { id: true, name: true, image: true },
  },
  venue: {
    select: { id: true, name: true, slug: true },
  },
  blocks: {
    orderBy: { orderIndex: "asc" as const },
    include: {
      exerciseGroups: {
        orderBy: { orderIndex: "asc" as const },
        include: {
          exercises: {
            orderBy: { orderIndex: "asc" as const },
            include: {
              exercise: {
                select: { id: true, name: true, category: true },
              },
            },
          },
        },
      },
      exercises: {
        orderBy: { orderIndex: "asc" as const },
        include: {
          exercise: {
            select: { id: true, name: true, category: true },
          },
          setPrescriptions: {
            orderBy: { setNumber: "asc" as const },
          },
        },
      },
    },
  },
} as const;
