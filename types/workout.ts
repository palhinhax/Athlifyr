/**
 * Workout Builder Types
 *
 * Tipos TypeScript para o sistema de Workout Builder
 * 100% tipados sem JSON - tudo relacional
 */

import {
  Workout,
  WorkoutBlock,
  WorkoutBlockExercise,
  WorkoutLog,
  WorkoutBlockResult,
  WorkoutExerciseResult,
  WorkoutExerciseSet,
  WorkoutBlockType,
  WeightUnit,
  DistanceUnit,
  StrengthExercise,
  User,
  Venue,
  VenueSession,
  WorkoutSetPrescription,
} from "@prisma/client";

// ============================================================================
// Set Prescription Input (defined first to be used in other types)
// ============================================================================

// Prescrição variável por set (ex: 5 reps @ 65%, 5 reps @ 70%, 3 reps @ 75%)
export interface CreateSetPrescriptionInput {
  setNumber: number;
  // Male/Rx
  reps?: number; // null = max reps
  weight?: number;
  weightUnit?: WeightUnit;
  weightPercent?: number; // % do 1RM/PR
  time?: number;
  distance?: number;
  distanceUnit?: DistanceUnit;
  calories?: number;
  // Female (optional - when different from Male)
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

// ============================================================================
// Workout com relações
// ============================================================================

export type WorkoutWithBlocks = Workout & {
  blocks: WorkoutBlockWithExercises[];
  createdBy: Pick<User, "id" | "name" | "image">;
  venue?: Pick<Venue, "id" | "name" | "slug"> | null;
};

export type WorkoutBlockWithExercises = WorkoutBlock & {
  exercises: WorkoutBlockExerciseWithDetails[];
};

export type WorkoutBlockExerciseWithDetails = WorkoutBlockExercise & {
  exercise: Pick<StrengthExercise, "id" | "name" | "category">;
  setPrescriptions?: WorkoutSetPrescription[] | CreateSetPrescriptionInput[];
};

// ============================================================================
// Workout Log com relações
// ============================================================================

export type WorkoutLogWithDetails = WorkoutLog & {
  workout: Pick<Workout, "id" | "name">;
  session?: Pick<VenueSession, "id" | "title"> | null;
  blockResults: WorkoutBlockResultWithExercises[];
};

export type WorkoutBlockResultWithExercises = WorkoutBlockResult & {
  block: Pick<WorkoutBlock, "id" | "type" | "name">;
  exerciseResults: WorkoutExerciseResultWithSets[];
};

export type WorkoutExerciseResultWithSets = WorkoutExerciseResult & {
  exercise: Pick<StrengthExercise, "id" | "name">;
  blockExercise: Pick<
    WorkoutBlockExercise,
    "id" | "prescribedReps" | "prescribedWeight" | "prescribedWeightUnit"
  >;
  sets: WorkoutExerciseSet[];
};

// ============================================================================
// Input types para criação
// ============================================================================

export interface CreateWorkoutInput {
  name: string;
  description?: string;
  venueId?: string;
  estimatedTime?: number;
  difficulty?: number;
  tags?: string[];
  isTemplate?: boolean;
  isPublic?: boolean;
  blocks: CreateWorkoutBlockInput[];
}

export interface CreateWorkoutBlockInput {
  type: WorkoutBlockType;
  name?: string;
  orderIndex: number;
  timeCap?: number;
  workTime?: number;
  restTime?: number;
  rounds?: number;
  notes?: string;
  exercises: CreateWorkoutBlockExerciseInput[];
}

export interface CreateWorkoutBlockExerciseInput {
  exerciseId: string;
  orderIndex: number;
  // Male/Rx
  prescribedReps?: number;
  prescribedWeight?: number;
  prescribedWeightUnit?: WeightUnit;
  prescribedWeightPercent?: number;
  prescribedDistance?: number;
  prescribedDistanceUnit?: DistanceUnit;
  prescribedTime?: number;
  prescribedCalories?: number;
  prescribedSets?: number;
  // Female (optional - when different from Male)
  prescribedRepsFemale?: number;
  prescribedWeightFemale?: number;
  prescribedWeightUnitFemale?: WeightUnit;
  prescribedWeightPercentFemale?: number;
  prescribedDistanceFemale?: number;
  prescribedDistanceUnitFemale?: DistanceUnit;
  prescribedTimeFemale?: number;
  prescribedCaloriesFemale?: number;
  prescribedSetsFemale?: number;
  notes?: string;
  setPrescriptions?: CreateSetPrescriptionInput[];
}

// ============================================================================
// Input types para log
// ============================================================================

export interface CreateWorkoutLogInput {
  workoutId: string;
  sessionId?: string;
  performedAt?: Date;
  notes?: string;
  feeling?: number;
  perceivedEffort?: number;
  blockResults: CreateBlockResultInput[];
}

export interface CreateBlockResultInput {
  blockId: string;
  completedRounds?: number;
  extraReps?: number;
  completedTime?: number;
  completedInTime?: boolean;
  notes?: string;
  exerciseResults: CreateExerciseResultInput[];
}

export interface CreateExerciseResultInput {
  blockExerciseId: string;
  exerciseId: string;
  actualReps?: number;
  actualWeight?: number;
  actualWeightUnit?: WeightUnit;
  actualDistance?: number;
  actualDistanceUnit?: DistanceUnit;
  actualTime?: number;
  actualCalories?: number;
  notes?: string;
  sets?: CreateExerciseSetInput[];
}

export interface CreateExerciseSetInput {
  setNumber: number;
  reps: number;
  weight: number;
  weightUnit: WeightUnit;
  notes?: string;
}

// ============================================================================
// UI State types
// ============================================================================

export interface WorkoutBuilderState {
  name: string;
  description: string;
  estimatedTime: number | null;
  difficulty: number | null;
  tags: string[];
  isTemplate: boolean;
  isPublic: boolean;
  blocks: WorkoutBlockState[];
}

export interface WorkoutBlockState {
  id: string; // ID temporário para UI
  type: WorkoutBlockType;
  name: string;
  timeCap: number | null;
  workTime: number | null;
  restTime: number | null;
  rounds: number | null;
  notes: string;
  exercises: WorkoutExerciseState[];
}

export interface WorkoutExerciseState {
  id: string; // ID temporário para UI
  exerciseId: string;
  exerciseName: string;
  prescribedReps: number | null;
  prescribedWeight: number | null;
  prescribedWeightUnit: WeightUnit;
  prescribedWeightPercent: number | null;
  prescribedDistance: number | null;
  prescribedDistanceUnit: DistanceUnit;
  prescribedTime: number | null;
  prescribedCalories: number | null;
  prescribedSets: number | null;
  notes: string;
}

// ============================================================================
// Block type display info
// ============================================================================

export const BLOCK_TYPE_INFO: Record<
  WorkoutBlockType,
  {
    label: string;
    description: string;
    icon: string;
    color: string;
    hasTimeCap: boolean;
    hasRounds: boolean;
    hasWorkTime: boolean;
    hasRestTime: boolean;
  }
> = {
  WARMUP: {
    label: "Aquecimento",
    description: "Preparação para o treino",
    icon: "🔥",
    color: "bg-orange-100 text-orange-800",
    hasTimeCap: false,
    hasRounds: false,
    hasWorkTime: false,
    hasRestTime: false,
  },
  STRENGTH: {
    label: "Força",
    description: "Trabalho de força com sets e reps",
    icon: "💪",
    color: "bg-red-100 text-red-800",
    hasTimeCap: false,
    hasRounds: false,
    hasWorkTime: false,
    hasRestTime: true,
  },
  AMRAP: {
    label: "AMRAP",
    description: "As Many Rounds As Possible",
    icon: "🔄",
    color: "bg-blue-100 text-blue-800",
    hasTimeCap: true,
    hasRounds: false,
    hasWorkTime: false,
    hasRestTime: false,
  },
  EMOM: {
    label: "EMOM",
    description: "Every Minute On the Minute",
    icon: "⏱️",
    color: "bg-purple-100 text-purple-800",
    hasTimeCap: true,
    hasRounds: true,
    hasWorkTime: true,
    hasRestTime: false,
  },
  FOR_TIME: {
    label: "For Time",
    description: "Completar o mais rápido possível",
    icon: "⚡",
    color: "bg-yellow-100 text-yellow-800",
    hasTimeCap: true,
    hasRounds: true,
    hasWorkTime: false,
    hasRestTime: false,
  },
  TABATA: {
    label: "Tabata",
    description: "20s trabalho / 10s descanso",
    icon: "🎯",
    color: "bg-green-100 text-green-800",
    hasTimeCap: false,
    hasRounds: true,
    hasWorkTime: true,
    hasRestTime: true,
  },
  CHIPPER: {
    label: "Chipper",
    description: "Lista sequencial de exercícios",
    icon: "📋",
    color: "bg-indigo-100 text-indigo-800",
    hasTimeCap: true,
    hasRounds: false,
    hasWorkTime: false,
    hasRestTime: false,
  },
  REST: {
    label: "Descanso",
    description: "Período de recuperação",
    icon: "😮‍💨",
    color: "bg-gray-100 text-gray-800",
    hasTimeCap: false,
    hasRounds: false,
    hasWorkTime: false,
    hasRestTime: true,
  },
  COOLDOWN: {
    label: "Retorno à Calma",
    description: "Alongamentos e recuperação",
    icon: "🧘",
    color: "bg-teal-100 text-teal-800",
    hasTimeCap: false,
    hasRounds: false,
    hasWorkTime: false,
    hasRestTime: false,
  },
  SKILL: {
    label: "Skill",
    description: "Trabalho técnico",
    icon: "🎓",
    color: "bg-pink-100 text-pink-800",
    hasTimeCap: true,
    hasRounds: false,
    hasWorkTime: false,
    hasRestTime: false,
  },
};

// ============================================================================
// Helper functions
// ============================================================================

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function parseTime(timeString: string): number {
  const [mins, secs] = timeString.split(":").map(Number);
  return mins * 60 + (secs || 0);
}

export function convertWeight(
  weight: number,
  from: WeightUnit,
  to: WeightUnit
): number {
  if (from === to) return weight;
  if (from === "KG" && to === "LB") return weight * 2.20462;
  if (from === "LB" && to === "KG") return weight / 2.20462;
  return weight;
}

export function convertDistance(
  distance: number,
  from: DistanceUnit,
  to: DistanceUnit
): number {
  if (from === to) return distance;

  // Convert to meters first
  let meters = distance;
  switch (from) {
    case "KM":
      meters = distance * 1000;
      break;
    case "MI":
      meters = distance * 1609.344;
      break;
    case "FT":
      meters = distance * 0.3048;
      break;
  }

  // Convert from meters to target
  switch (to) {
    case "M":
      return meters;
    case "KM":
      return meters / 1000;
    case "MI":
      return meters / 1609.344;
    case "FT":
      return meters / 0.3048;
  }

  return distance;
}
