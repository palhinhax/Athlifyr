/**
 * CRITICAL: Exercise Seed for Performance Tracking
 *
 * These exercises are used in the Performance section of user profiles!
 * Exercises (Exercise) appear in the "Força" tab.
 *
 * DEFAULT LANGUAGE: English (en)
 * Translations are OPTIONAL and can be added later via ExerciseTranslation model
 *
 * Categories:
 * - CROSSFIT: CrossFit-specific movements
 * - GYM: General gym/strength training
 * - WEIGHTLIFTING: Olympic weightlifting
 * - BODYWEIGHT: Bodyweight exercises
 * - CARDIO: Cardio exercises
 * - OTHER: Miscellaneous
 */

import { PrismaClient, ExerciseCategory } from "@prisma/client";

const prisma = new PrismaClient();

interface ExerciseSeed {
  name: string; // English name (default)
  aliases: string[]; // English aliases
  category: ExerciseCategory;
  effortScore: number; // 1-10 scale for workout intensity calculation
  isGlobal: boolean; // true = available to all users
}

// ============================================================================
// EFFORT SCORE REFERENCE GUIDE
// ============================================================================
// 1-3: Low effort (mobility, stretching, light cardio)
// 4-5: Moderate effort (accessory work, technique focus)
// 6-7: High effort (compound movements, moderate skill)
// 8-9: Very high effort (Olympic lifts, advanced gymnastics)
// 10:  Maximum effort (max lifts, extremely demanding movements)
// ============================================================================

// ============================================================================
// SQUAT VARIATIONS
// ============================================================================
const squats: ExerciseSeed[] = [
  {
    name: "Back Squat",
    aliases: ["BS", "High Bar Squat", "Low Bar Squat"], // Removed "Squat" - ambiguous with Air Squat
    category: "GYM",
    effortScore: 8.0, // Heavy compound, full body
    isGlobal: true,
  },
  {
    name: "Front Squat",
    aliases: ["FS", "Front Rack Squat"],
    category: "GYM",
    effortScore: 8.5, // More demanding than back squat (core, mobility)
    isGlobal: true,
  },
  {
    name: "Overhead Squat",
    aliases: ["OHS", "Snatch Squat"],
    category: "WEIGHTLIFTING",
    effortScore: 9.0, // Highly technical, full body, balance
    isGlobal: true,
  },
  {
    name: "Goblet Squat",
    aliases: ["KB Goblet Squat", "DB Goblet Squat"],
    category: "GYM",
    effortScore: 5.0, // Moderate, good for learning
    isGlobal: true,
  },
  {
    name: "Air Squat",
    aliases: ["Bodyweight Squat"], // Removed "Squat" - ambiguous with Back Squat
    category: "BODYWEIGHT",
    effortScore: 3.0, // Basic bodyweight
    isGlobal: true,
  },
  {
    name: "Pistol Squat",
    aliases: ["Single Leg Squat", "One Leg Squat"],
    category: "BODYWEIGHT",
    effortScore: 7.0, // High skill, balance, strength
    isGlobal: true,
  },
  {
    name: "Bulgarian Split Squat",
    aliases: ["Rear Foot Elevated Split Squat", "RFESS"],
    category: "GYM",
    effortScore: 6.5, // Unilateral, balance, demanding
    isGlobal: true,
  },
  {
    name: "Zercher Squat",
    aliases: [],
    category: "GYM",
    effortScore: 7.5, // Unique position, very demanding
    isGlobal: true,
  },
];

// ============================================================================
// DEADLIFT VARIATIONS
// ============================================================================
const deadlifts: ExerciseSeed[] = [
  {
    name: "Deadlift",
    aliases: ["Conventional Deadlift", "DL"],
    category: "GYM",
    effortScore: 8.5, // King of compounds, full body, heavy
    isGlobal: true,
  },
  {
    name: "Romanian Deadlift",
    aliases: ["RDL", "Stiff Leg Deadlift"],
    category: "GYM",
    effortScore: 6.5, // Posterior chain focus, less demanding
    isGlobal: true,
  },
  {
    name: "Sumo Deadlift",
    aliases: ["Sumo DL"],
    category: "GYM",
    effortScore: 8.0, // Different mechanics, still demanding
    isGlobal: true,
  },
  {
    name: "Trap Bar Deadlift",
    aliases: ["Hex Bar Deadlift"],
    category: "GYM",
    effortScore: 7.5, // Slightly easier than conventional
    isGlobal: true,
  },
  {
    name: "Single Leg Deadlift",
    aliases: ["One Leg Deadlift", "Unilateral RDL"],
    category: "GYM",
    effortScore: 6.0, // Unilateral, balance focus
    isGlobal: true,
  },
];

// ============================================================================
// PRESSING MOVEMENTS
// ============================================================================
const pressing: ExerciseSeed[] = [
  {
    name: "Bench Press",
    aliases: ["BP", "Barbell Bench Press", "Flat Bench"],
    category: "GYM",
    effortScore: 7.5, // Major compound, upper body
    isGlobal: true,
  },
  {
    name: "Incline Bench Press",
    aliases: ["Incline BP", "Incline Press"],
    category: "GYM",
    effortScore: 7.0, // Upper chest focus, slightly less load
    isGlobal: true,
  },
  {
    name: "Decline Bench Press",
    aliases: ["Decline BP"],
    category: "GYM",
    effortScore: 6.5, // Easier angle, less demanding
    isGlobal: true,
  },
  {
    name: "Overhead Press",
    aliases: ["OHP", "Shoulder Press", "Strict Press", "Military Press"],
    category: "GYM",
    effortScore: 7.5, // Demanding, full body stability
    isGlobal: true,
  },
  {
    name: "Push Press",
    aliases: ["PP"],
    category: "CROSSFIT",
    effortScore: 7.0, // Leg drive assistance
    isGlobal: true,
  },
  {
    name: "Push Jerk",
    aliases: ["PJ"],
    category: "WEIGHTLIFTING",
    effortScore: 8.5, // Explosive, technical
    isGlobal: true,
  },
  {
    name: "Split Jerk",
    aliases: ["SJ", "Jerk"],
    category: "WEIGHTLIFTING",
    effortScore: 9.0, // Highly technical, footwork
    isGlobal: true,
  },
  {
    name: "Dumbbell Press",
    aliases: ["DB Press", "DB Shoulder Press"],
    category: "GYM",
    effortScore: 6.5, // Stability required, moderate
    isGlobal: true,
  },
  {
    name: "Dumbbell Bench Press",
    aliases: ["DB Bench", "DB BP"],
    category: "GYM",
    effortScore: 6.5, // Stability, control needed
    isGlobal: true,
  },
  {
    name: "Floor Press",
    aliases: [],
    category: "GYM",
    effortScore: 6.0, // Reduced range, easier
    isGlobal: true,
  },
  {
    name: "Handstand Push-up",
    aliases: ["HSPU", "HS Push-up"],
    category: "CROSSFIT",
    effortScore: 8.0, // Bodyweight overhead, high skill
    isGlobal: true,
  },
  {
    name: "Strict Handstand Push-up",
    aliases: ["Strict HSPU"],
    category: "BODYWEIGHT",
    effortScore: 8.5, // No momentum, very demanding
    isGlobal: true,
  },
];

// ============================================================================
// OLYMPIC WEIGHTLIFTING
// ============================================================================
const olympic: ExerciseSeed[] = [
  {
    name: "Snatch",
    aliases: ["Full Snatch", "Squat Snatch"],
    category: "WEIGHTLIFTING",
    effortScore: 10.0, // Most technical barbell lift
    isGlobal: true,
  },
  {
    name: "Power Snatch",
    aliases: ["PS"],
    category: "WEIGHTLIFTING",
    effortScore: 9.0, // Slightly less demanding, no full squat
    isGlobal: true,
  },
  {
    name: "Hang Snatch",
    aliases: ["Hang Squat Snatch"],
    category: "WEIGHTLIFTING",
    effortScore: 9.5, // Explosive from hang position
    isGlobal: true,
  },
  {
    name: "Hang Power Snatch",
    aliases: ["HPS"],
    category: "WEIGHTLIFTING",
    effortScore: 8.5, // Moderate technical demand
    isGlobal: true,
  },
  {
    name: "Clean",
    aliases: ["Full Clean", "Squat Clean"],
    category: "WEIGHTLIFTING",
    effortScore: 9.5, // Highly technical, explosive
    isGlobal: true,
  },
  {
    name: "Power Clean",
    aliases: ["PC"],
    category: "WEIGHTLIFTING",
    effortScore: 8.5, // Explosive, less squat demand
    isGlobal: true,
  },
  {
    name: "Hang Clean",
    aliases: ["Hang Squat Clean"],
    category: "WEIGHTLIFTING",
    effortScore: 9.0, // Explosive from hang
    isGlobal: true,
  },
  {
    name: "Hang Power Clean",
    aliases: ["HPC"],
    category: "WEIGHTLIFTING",
    effortScore: 8.0, // Moderate technical demand
    isGlobal: true,
  },
  {
    name: "Clean & Jerk",
    aliases: ["C&J", "CnJ", "Clean and Jerk"],
    category: "WEIGHTLIFTING",
    effortScore: 10.0, // Two movements, maximum effort
    isGlobal: true,
  },
];

// ============================================================================
// CROSSFIT SPECIFIC MOVEMENTS
// ============================================================================
const crossfit: ExerciseSeed[] = [
  {
    name: "Thruster",
    aliases: ["Front Squat to Press"],
    category: "CROSSFIT",
    effortScore: 8.0, // Combo movement, very exhausting
    isGlobal: true,
  },
  {
    name: "Wall Ball",
    aliases: ["WB", "Wall Ball Shot"],
    category: "CROSSFIT",
    effortScore: 6.0, // Metabolic, repetitive
    isGlobal: true,
  },
  {
    name: "Kettlebell Swing",
    aliases: ["KB Swing", "KBS", "Russian Swing"],
    category: "CROSSFIT",
    effortScore: 5.5, // Hip hinge, cardio element
    isGlobal: true,
  },
  {
    name: "American Kettlebell Swing",
    aliases: ["American KBS", "Overhead KB Swing"],
    category: "CROSSFIT",
    effortScore: 6.5, // Overhead adds demand
    isGlobal: true,
  },
  {
    name: "Box Jump",
    aliases: ["BJ", "Box Jumps"],
    category: "CROSSFIT",
    effortScore: 5.0, // Explosive, moderate
    isGlobal: true,
  },
  {
    name: "Box Step Up",
    aliases: ["Step Up"],
    category: "CROSSFIT",
    effortScore: 4.0, // Controlled, lower demand
    isGlobal: true,
  },
  {
    name: "Box Jump Over",
    aliases: ["BJO"],
    category: "CROSSFIT",
    effortScore: 6.0, // Continuous, metabolic
    isGlobal: true,
  },
  {
    name: "Double Under",
    aliases: ["DU", "Double Unders", "Dubs"],
    category: "CROSSFIT",
    effortScore: 5.0, // Skill plus cardio
    isGlobal: true,
  },
  {
    name: "Single Under",
    aliases: ["SU"], // Removed "Singles" - ambiguous with Jump Rope
    category: "CROSSFIT",
    effortScore: 2.0, // Basic cardio
    isGlobal: true,
  },
  {
    name: "Burpee",
    aliases: ["Burpees"],
    category: "CROSSFIT",
    effortScore: 6.5, // Full body, metabolic
    isGlobal: true,
  },
  {
    name: "Burpee Box Jump Over",
    aliases: ["BBJO", "Burpee BJO"],
    category: "CROSSFIT",
    effortScore: 7.5, // Combination, exhausting
    isGlobal: true,
  },
  {
    name: "Cluster",
    aliases: ["Squat Clean Thruster"],
    category: "CROSSFIT",
    effortScore: 8.5, // Thruster from floor, brutal
    isGlobal: true,
  },
  {
    name: "Devil Press",
    aliases: ["DB Devil Press"],
    category: "CROSSFIT",
    effortScore: 8.0, // DB snatch + burpee combo
    isGlobal: true,
  },
];

// ============================================================================
// PULL MOVEMENTS
// ============================================================================
const pulling: ExerciseSeed[] = [
  {
    name: "Pull-up",
    aliases: ["Pull up", "Pullup"],
    category: "BODYWEIGHT",
    effortScore: 6.0, // Bodyweight standard
    isGlobal: true,
  },
  {
    name: "Strict Pull-up",
    aliases: ["Strict Pullup", "Dead Hang Pull-up"],
    category: "BODYWEIGHT",
    effortScore: 6.5, // No momentum, harder
    isGlobal: true,
  },
  {
    name: "Kipping Pull-up",
    aliases: ["Kipping Pullup"],
    category: "CROSSFIT",
    effortScore: 4.5, // Momentum assistance, lower than strict
    isGlobal: true,
  },
  {
    name: "Butterfly Pull-up",
    aliases: ["Butterfly Pullup"],
    category: "CROSSFIT",
    effortScore: 5.5, // High volume, technique
    isGlobal: true,
  },
  {
    name: "Chest-to-Bar",
    aliases: ["C2B", "CTB", "Chest to Bar Pull-up"],
    category: "CROSSFIT",
    effortScore: 7.0, // Higher pull required
    isGlobal: true,
  },
  {
    name: "Bar Muscle-up",
    aliases: ["BMU", "Bar MU", "Bar Muscle Up"],
    category: "CROSSFIT",
    effortScore: 9.0, // Explosive, high skill
    isGlobal: true,
  },
  {
    name: "Ring Muscle-up",
    aliases: ["RMU", "Ring MU", "Ring Muscle Up"],
    category: "CROSSFIT",
    effortScore: 9.5, // Unstable, very technical
    isGlobal: true,
  },
  {
    name: "Chin-up",
    aliases: ["Chin up", "Chinup"],
    category: "BODYWEIGHT",
    effortScore: 5.5, // Bicep assistance
    isGlobal: true,
  },
  {
    name: "Bent Over Row",
    aliases: ["Barbell Row", "BB Row"], // Removed "Row" - ambiguous with Rowing
    category: "GYM",
    effortScore: 6.5, // Compound pull
    isGlobal: true,
  },
  {
    name: "Pendlay Row",
    aliases: [],
    category: "GYM",
    effortScore: 7.0, // Explosive from floor
    isGlobal: true,
  },
  {
    name: "Dumbbell Row",
    aliases: ["DB Row", "Single Arm Row"],
    category: "GYM",
    effortScore: 5.5, // Unilateral, moderate
    isGlobal: true,
  },
  {
    name: "Lat Pulldown",
    aliases: ["Lat Pull Down"],
    category: "GYM",
    effortScore: 4.5, // Machine assistance
    isGlobal: true,
  },
  {
    name: "Rope Climb",
    aliases: ["RC"],
    category: "CROSSFIT",
    effortScore: 8.0, // Grip, pulling, demanding
    isGlobal: true,
  },
];

// ============================================================================
// CORE & GYMNASTICS
// ============================================================================
const core: ExerciseSeed[] = [
  {
    name: "Toes-to-Bar",
    aliases: ["T2B", "TTB", "Toes to Bar"],
    category: "CROSSFIT",
    effortScore: 7.0, // Skill, core strength
    isGlobal: true,
  },
  {
    name: "Knees-to-Elbow",
    aliases: ["K2E", "KTE", "Knees to Elbow"],
    category: "CROSSFIT",
    effortScore: 5.0, // Moderate skill
    isGlobal: true,
  },
  {
    name: "Sit-up",
    aliases: ["Situp", "GHD Sit-up"],
    category: "CROSSFIT",
    effortScore: 3.0, // Basic core
    isGlobal: true,
  },
  {
    name: "AbMat Sit-up",
    aliases: ["AbMat Situp"],
    category: "CROSSFIT",
    effortScore: 3.5, // Slightly easier ROM
    isGlobal: true,
  },
  {
    name: "V-up",
    aliases: ["V Sit-up", "V-Sit"],
    category: "CROSSFIT",
    effortScore: 5.0, // Dynamic core
    isGlobal: true,
  },
  {
    name: "Plank",
    aliases: ["Front Plank"],
    category: "BODYWEIGHT",
    effortScore: 3.0, // Isometric hold
    isGlobal: true,
  },
  {
    name: "Side Plank",
    aliases: [],
    category: "BODYWEIGHT",
    effortScore: 3.5, // Unilateral core
    isGlobal: true,
  },
  {
    name: "Hollow Hold",
    aliases: ["Hollow Body Hold"],
    category: "BODYWEIGHT",
    effortScore: 4.0, // Gymnastic position
    isGlobal: true,
  },
  {
    name: "Arch Hold",
    aliases: ["Superman Hold"],
    category: "BODYWEIGHT",
    effortScore: 4.0, // Posterior chain
    isGlobal: true,
  },
  {
    name: "L-Sit",
    aliases: ["L Sit"],
    category: "BODYWEIGHT",
    effortScore: 6.0, // Static strength, skill
    isGlobal: true,
  },
];

// ============================================================================
// PUSH-UPS & DIPS
// ============================================================================
const pushups: ExerciseSeed[] = [
  {
    name: "Push-up",
    aliases: ["Push up", "Pushup"],
    category: "BODYWEIGHT",
    effortScore: 3.5, // Basic bodyweight
    isGlobal: true,
  },
  {
    name: "Strict Push-up",
    aliases: [],
    category: "BODYWEIGHT",
    effortScore: 4.0, // Controlled tempo
    isGlobal: true,
  },
  {
    name: "Diamond Push-up",
    aliases: ["Close Grip Push-up"],
    category: "BODYWEIGHT",
    effortScore: 5.0, // Tricep focus, harder
    isGlobal: true,
  },
  {
    name: "Wide Push-up",
    aliases: ["Wide Grip Push-up"],
    category: "BODYWEIGHT",
    effortScore: 4.5, // Chest focus
    isGlobal: true,
  },
  {
    name: "Decline Push-up",
    aliases: ["Feet Elevated Push-up"],
    category: "BODYWEIGHT",
    effortScore: 5.5, // More demanding angle
    isGlobal: true,
  },
  {
    name: "Ring Dip",
    aliases: ["RD", "Dips"],
    category: "CROSSFIT",
    effortScore: 7.0, // Unstable, difficult
    isGlobal: true,
  },
  {
    name: "Bar Dip",
    aliases: ["Parallel Bar Dip"],
    category: "BODYWEIGHT",
    effortScore: 6.0, // Bodyweight compound
    isGlobal: true,
  },
  {
    name: "Strict Dip",
    aliases: [],
    category: "BODYWEIGHT",
    effortScore: 6.5, // No momentum
    isGlobal: true,
  },
];

// ============================================================================
// LUNGES & SINGLE LEG
// ============================================================================
const lunges: ExerciseSeed[] = [
  {
    name: "Lunge",
    aliases: ["Forward Lunge", "Walking Lunge"],
    category: "BODYWEIGHT",
    effortScore: 4.0, // Basic unilateral
    isGlobal: true,
  },
  {
    name: "Reverse Lunge",
    aliases: ["Backward Lunge"],
    category: "BODYWEIGHT",
    effortScore: 4.5, // Slightly more control
    isGlobal: true,
  },
  {
    name: "Walking Lunge",
    aliases: [],
    category: "BODYWEIGHT",
    effortScore: 5.0, // Continuous movement
    isGlobal: true,
  },
  {
    name: "Overhead Lunge",
    aliases: ["OH Lunge", "OHL"],
    category: "CROSSFIT",
    effortScore: 7.0, // Stability, overhead
    isGlobal: true,
  },
  {
    name: "Dumbbell Lunge",
    aliases: ["DB Lunge"],
    category: "GYM",
    effortScore: 5.5, // Added resistance
    isGlobal: true,
  },
];

// ============================================================================
// CARRIES & LOADED MOVEMENTS
// ============================================================================
const carries: ExerciseSeed[] = [
  {
    name: "Farmers Carry",
    aliases: ["Farmer's Walk", "Farmers Walk"],
    category: "GYM",
    effortScore: 6.0, // Grip, core, posture
    isGlobal: true,
  },
  {
    name: "Overhead Carry",
    aliases: ["OH Carry", "Waiter Carry"],
    category: "GYM",
    effortScore: 7.0, // Shoulder stability
    isGlobal: true,
  },
  {
    name: "Yoke Carry",
    aliases: ["Yoke Walk"],
    category: "GYM",
    effortScore: 7.5, // Heavy, very demanding
    isGlobal: true,
  },
  {
    name: "Sandbag Carry",
    aliases: [],
    category: "CROSSFIT",
    effortScore: 5.5, // Awkward load
    isGlobal: true,
  },
];

// ============================================================================
// CARDIO MOVEMENTS
// ============================================================================
const cardio: ExerciseSeed[] = [
  {
    name: "Rowing",
    aliases: ["Erg", "C2 Row", "Rower"], // Removed "Row" - ambiguous with Bent Over Row
    category: "CARDIO",
    effortScore: 6.0, // Full body cardio
    isGlobal: true,
  },
  {
    name: "Assault Bike",
    aliases: ["Air Bike", "AB", "Bike"],
    category: "CARDIO",
    effortScore: 7.0, // Brutal cardio
    isGlobal: true,
  },
  {
    name: "Ski Erg",
    aliases: ["SkiErg", "Ski"],
    category: "CARDIO",
    effortScore: 6.5, // Upper body cardio
    isGlobal: true,
  },
  {
    name: "Running",
    aliases: ["Run"],
    category: "CARDIO",
    effortScore: 4.5, // Standard cardio
    isGlobal: true,
  },
  {
    name: "Jump Rope",
    aliases: ["Skipping", "Skip Rope"], // Removed "Singles" - ambiguous with Single Under
    category: "CARDIO",
    effortScore: 4.0, // Basic cardio
    isGlobal: true,
  },
];

// ============================================================================
// OLYMPIC WEIGHTLIFTING - ACCESSORIES & TECHNIQUE
// ============================================================================
const olympicAccessories: ExerciseSeed[] = [
  {
    name: "Snatch Balance",
    aliases: ["Heaving Snatch Balance"],
    category: "WEIGHTLIFTING",
    effortScore: 8.0,
    isGlobal: true,
  },
  {
    name: "Muscle Snatch",
    aliases: [],
    category: "WEIGHTLIFTING",
    effortScore: 7.5,
    isGlobal: true,
  },
  {
    name: "Snatch Pull",
    aliases: ["High Pull", "Snatch High Pull"],
    category: "WEIGHTLIFTING",
    effortScore: 7.0,
    isGlobal: true,
  },
  {
    name: "Snatch Deadlift",
    aliases: ["Snatch Grip Deadlift"],
    category: "WEIGHTLIFTING",
    effortScore: 7.5,
    isGlobal: true,
  },
  {
    name: "Clean Pull",
    aliases: ["Clean High Pull"],
    category: "WEIGHTLIFTING",
    effortScore: 7.0,
    isGlobal: true,
  },
  {
    name: "Clean Deadlift",
    aliases: ["Clean Grip Deadlift"],
    category: "WEIGHTLIFTING",
    effortScore: 7.5,
    isGlobal: true,
  },
  {
    name: "Muscle Clean",
    aliases: [],
    category: "WEIGHTLIFTING",
    effortScore: 7.5,
    isGlobal: true,
  },
  {
    name: "Jerk Balance",
    aliases: [],
    category: "WEIGHTLIFTING",
    effortScore: 6.5,
    isGlobal: true,
  },
  {
    name: "Behind-the-Neck Jerk",
    aliases: ["BTN Jerk"],
    category: "WEIGHTLIFTING",
    effortScore: 8.0,
    isGlobal: true,
  },
  {
    name: "Tall Snatch",
    aliases: [],
    category: "WEIGHTLIFTING",
    effortScore: 7.0,
    isGlobal: true,
  },
  {
    name: "Tall Clean",
    aliases: [],
    category: "WEIGHTLIFTING",
    effortScore: 7.0,
    isGlobal: true,
  },
  {
    name: "Drop Snatch",
    aliases: [],
    category: "WEIGHTLIFTING",
    effortScore: 7.5,
    isGlobal: true,
  },
  {
    name: "Snatch Push Press",
    aliases: [],
    category: "WEIGHTLIFTING",
    effortScore: 7.0,
    isGlobal: true,
  },
  {
    name: "Clean Push Press",
    aliases: [],
    category: "WEIGHTLIFTING",
    effortScore: 7.0,
    isGlobal: true,
  },
  {
    name: "Squat Clean",
    aliases: [],
    category: "WEIGHTLIFTING",
    effortScore: 9.5,
    isGlobal: true,
  },
];

// ============================================================================
// GYM - POSTERIOR CHAIN & HINGE
// ============================================================================
const posteriorChain: ExerciseSeed[] = [
  {
    name: "Hip Thrust",
    aliases: ["Barbell Hip Thrust"],
    category: "GYM",
    effortScore: 6.5,
    isGlobal: true,
  },
  {
    name: "Good Morning",
    aliases: [],
    category: "GYM",
    effortScore: 6.0,
    isGlobal: true,
  },
  {
    name: "Glute Ham Raise",
    aliases: ["GHR"],
    category: "GYM",
    effortScore: 7.0,
    isGlobal: true,
  },
  {
    name: "Back Extension",
    aliases: ["Hyperextension", "GHD Back Extension"],
    category: "GYM",
    effortScore: 4.5,
    isGlobal: true,
  },
  {
    name: "GHD Hip Extension",
    aliases: [],
    category: "GYM",
    effortScore: 5.0,
    isGlobal: true,
  },
  {
    name: "Kettlebell Deadlift",
    aliases: [],
    category: "GYM",
    effortScore: 6.0,
    isGlobal: true,
  },
  {
    name: "Deficit Deadlift",
    aliases: [],
    category: "GYM",
    effortScore: 8.5,
    isGlobal: true,
  },
  {
    name: "Paused Deadlift",
    aliases: [],
    category: "GYM",
    effortScore: 8.5,
    isGlobal: true,
  },
];

// ============================================================================
// GYM - SQUAT VARIATIONS
// ============================================================================
const squatVariations: ExerciseSeed[] = [
  {
    name: "Box Squat",
    aliases: [],
    category: "GYM",
    effortScore: 7.5,
    isGlobal: true,
  },
  {
    name: "Pause Squat",
    aliases: ["Paused Back Squat"],
    category: "GYM",
    effortScore: 8.5,
    isGlobal: true,
  },
  {
    name: "Tempo Squat",
    aliases: [],
    category: "GYM",
    effortScore: 8.0,
    isGlobal: true,
  },
  {
    name: "Paused Front Squat",
    aliases: [],
    category: "GYM",
    effortScore: 9.0,
    isGlobal: true,
  },
  {
    name: "Tempo Front Squat",
    aliases: [],
    category: "GYM",
    effortScore: 8.5,
    isGlobal: true,
  },
];

// ============================================================================
// GYM - PRESSING & UPPER BODY
// ============================================================================
const upperBodyAccessories: ExerciseSeed[] = [
  {
    name: "Close Grip Bench Press",
    aliases: ["CGBP"],
    category: "GYM",
    effortScore: 7.0,
    isGlobal: true,
  },
  {
    name: "Seated Dumbbell Press",
    aliases: [],
    category: "GYM",
    effortScore: 6.0,
    isGlobal: true,
  },
  {
    name: "Arnold Press",
    aliases: [],
    category: "GYM",
    effortScore: 6.5,
    isGlobal: true,
  },
  {
    name: "Dumbbell Fly",
    aliases: ["DB Fly"],
    category: "GYM",
    effortScore: 5.0,
    isGlobal: true,
  },
  {
    name: "Triceps Extension",
    aliases: ["Skull Crusher"],
    category: "GYM",
    effortScore: 4.5,
    isGlobal: true,
  },
  {
    name: "Bicep Curl",
    aliases: ["DB Curl", "Hammer Curl", "Barbell Curl"],
    category: "GYM",
    effortScore: 3.5,
    isGlobal: true,
  },
  {
    name: "Lateral Raise",
    aliases: [],
    category: "GYM",
    effortScore: 3.5,
    isGlobal: true,
  },
  {
    name: "Face Pull",
    aliases: [],
    category: "GYM",
    effortScore: 3.5,
    isGlobal: true,
  },
  {
    name: "Pull-over",
    aliases: ["DB Pullover"],
    category: "GYM",
    effortScore: 4.5,
    isGlobal: true,
  },
  {
    name: "Behind-the-Neck Press",
    aliases: ["BTN Press"],
    category: "GYM",
    effortScore: 7.0,
    isGlobal: true,
  },
];

// ============================================================================
// GYM - MACHINE-BASED EXERCISES (PT staples)
// ============================================================================
const machineExercises: ExerciseSeed[] = [
  {
    name: "Leg Press",
    aliases: [],
    category: "GYM",
    effortScore: 6.0,
    isGlobal: true,
  },
  {
    name: "Hack Squat",
    aliases: [],
    category: "GYM",
    effortScore: 6.5,
    isGlobal: true,
  },
  {
    name: "Leg Extension",
    aliases: [],
    category: "GYM",
    effortScore: 4.0,
    isGlobal: true,
  },
  {
    name: "Lying Leg Curl",
    aliases: [],
    category: "GYM",
    effortScore: 4.0,
    isGlobal: true,
  },
  {
    name: "Seated Leg Curl",
    aliases: [],
    category: "GYM",
    effortScore: 4.0,
    isGlobal: true,
  },
  {
    name: "Standing Calf Raise",
    aliases: [],
    category: "GYM",
    effortScore: 3.5,
    isGlobal: true,
  },
  {
    name: "Seated Calf Raise",
    aliases: [],
    category: "GYM",
    effortScore: 3.0,
    isGlobal: true,
  },
  {
    name: "Hip Abduction",
    aliases: [],
    category: "GYM",
    effortScore: 3.0,
    isGlobal: true,
  },
  {
    name: "Hip Adduction",
    aliases: [],
    category: "GYM",
    effortScore: 3.0,
    isGlobal: true,
  },
  {
    name: "Seated Cable Row",
    aliases: [],
    category: "GYM",
    effortScore: 5.0,
    isGlobal: true,
  },
  {
    name: "Chest Supported Row",
    aliases: [],
    category: "GYM",
    effortScore: 5.5,
    isGlobal: true,
  },
  {
    name: "T-Bar Row",
    aliases: [],
    category: "GYM",
    effortScore: 6.0,
    isGlobal: true,
  },
  {
    name: "Machine Row",
    aliases: [],
    category: "GYM",
    effortScore: 5.0,
    isGlobal: true,
  },
  {
    name: "Assisted Pull-up",
    aliases: [],
    category: "GYM",
    effortScore: 4.0,
    isGlobal: true,
  },
  {
    name: "Chest Press Machine",
    aliases: [],
    category: "GYM",
    effortScore: 5.0,
    isGlobal: true,
  },
  {
    name: "Pec Deck",
    aliases: [],
    category: "GYM",
    effortScore: 4.0,
    isGlobal: true,
  },
  {
    name: "Cable Fly",
    aliases: [],
    category: "GYM",
    effortScore: 4.5,
    isGlobal: true,
  },
];

// ============================================================================
// GYMNASTICS - ADVANCED & SKILLS
// ============================================================================
const gymnasticsAdvanced: ExerciseSeed[] = [
  {
    name: "Ring Row",
    aliases: ["TRX Row"],
    category: "BODYWEIGHT",
    effortScore: 5.0,
    isGlobal: true,
  },
  {
    name: "Ring Support Hold",
    aliases: [],
    category: "BODYWEIGHT",
    effortScore: 6.0,
    isGlobal: true,
  },
  {
    name: "Ring Turned Out Support",
    aliases: ["RTO"],
    category: "BODYWEIGHT",
    effortScore: 7.5,
    isGlobal: true,
  },
  {
    name: "Ring Push-up",
    aliases: [],
    category: "BODYWEIGHT",
    effortScore: 6.0,
    isGlobal: true,
  },
  {
    name: "Strict Muscle-up",
    aliases: ["Ring Strict MU"],
    category: "BODYWEIGHT",
    effortScore: 10.0,
    isGlobal: true,
  },
  {
    name: "Handstand Hold",
    aliases: [],
    category: "BODYWEIGHT",
    effortScore: 5.0,
    isGlobal: true,
  },
  {
    name: "Handstand Walk",
    aliases: ["HS Walk"],
    category: "CROSSFIT",
    effortScore: 7.5,
    isGlobal: true,
  },
  {
    name: "Wall Walk",
    aliases: [],
    category: "CROSSFIT",
    effortScore: 6.5,
    isGlobal: true,
  },
  {
    name: "Pike Handstand Push-up",
    aliases: ["Pike HSPU"],
    category: "BODYWEIGHT",
    effortScore: 7.0,
    isGlobal: true,
  },
  {
    name: "Deficit Handstand Push-up",
    aliases: [],
    category: "CROSSFIT",
    effortScore: 9.0,
    isGlobal: true,
  },
  {
    name: "Legless Rope Climb",
    aliases: ["LRC"],
    category: "CROSSFIT",
    effortScore: 9.5,
    isGlobal: true,
  },
  {
    name: "Kipping Swing",
    aliases: ["Beat Swing"],
    category: "CROSSFIT",
    effortScore: 3.0,
    isGlobal: true,
  },
  {
    name: "GHD Sit-up",
    aliases: [],
    category: "CROSSFIT",
    effortScore: 5.0,
    isGlobal: true,
  },
  {
    name: "Strict Toes-to-Bar",
    aliases: [],
    category: "CROSSFIT",
    effortScore: 8.0,
    isGlobal: true,
  },
  {
    name: "Kipping Toes-to-Bar",
    aliases: [],
    category: "CROSSFIT",
    effortScore: 6.5,
    isGlobal: true,
  },
  {
    name: "Kipping Knees-to-Elbow",
    aliases: [],
    category: "CROSSFIT",
    effortScore: 4.5,
    isGlobal: true,
  },
  {
    name: "Strict Chest-to-Bar",
    aliases: [],
    category: "CROSSFIT",
    effortScore: 7.5,
    isGlobal: true,
  },
  {
    name: "Kipping Chest-to-Bar",
    aliases: [],
    category: "CROSSFIT",
    effortScore: 6.5,
    isGlobal: true,
  },
  {
    name: "L-Sit Pull-up",
    aliases: [],
    category: "BODYWEIGHT",
    effortScore: 8.5,
    isGlobal: true,
  },
  {
    name: "Ring Row Feet Elevated",
    aliases: [],
    category: "BODYWEIGHT",
    effortScore: 6.0,
    isGlobal: true,
  },
];

// ============================================================================
// DUMBBELL MOVEMENTS (WOD staples)
// ============================================================================
const dumbbellMovements: ExerciseSeed[] = [
  {
    name: "Dumbbell Snatch",
    aliases: ["DB Snatch"],
    category: "CROSSFIT",
    effortScore: 7.5,
    isGlobal: true,
  },
  {
    name: "Dumbbell Clean",
    aliases: ["DB Clean"],
    category: "CROSSFIT",
    effortScore: 7.0,
    isGlobal: true,
  },
  {
    name: "Dumbbell Power Clean",
    aliases: ["DB Power Clean"],
    category: "CROSSFIT",
    effortScore: 7.0,
    isGlobal: true,
  },
  {
    name: "Dumbbell Squat Clean",
    aliases: ["DB Squat Clean"],
    category: "CROSSFIT",
    effortScore: 7.5,
    isGlobal: true,
  },
  {
    name: "Dumbbell Hang Clean",
    aliases: ["DB Hang Clean"],
    category: "CROSSFIT",
    effortScore: 6.5,
    isGlobal: true,
  },
  {
    name: "Dumbbell Thruster",
    aliases: ["DB Thruster"],
    category: "CROSSFIT",
    effortScore: 7.5,
    isGlobal: true,
  },
  {
    name: "Dumbbell Push Press",
    aliases: ["DB Push Press"],
    category: "CROSSFIT",
    effortScore: 6.5,
    isGlobal: true,
  },
  {
    name: "Dumbbell Push Jerk",
    aliases: ["DB Push Jerk"],
    category: "CROSSFIT",
    effortScore: 7.5,
    isGlobal: true,
  },
  {
    name: "Dumbbell Split Jerk",
    aliases: ["DB Split Jerk"],
    category: "CROSSFIT",
    effortScore: 8.0,
    isGlobal: true,
  },
  {
    name: "Dumbbell Front Squat",
    aliases: ["DB Front Squat"],
    category: "GYM",
    effortScore: 6.5,
    isGlobal: true,
  },
  {
    name: "Dumbbell Overhead Lunge",
    aliases: ["DB OH Lunge"],
    category: "CROSSFIT",
    effortScore: 7.0,
    isGlobal: true,
  },
  {
    name: "Dumbbell Box Step Over",
    aliases: ["DB Step Over"],
    category: "CROSSFIT",
    effortScore: 5.5,
    isGlobal: true,
  },
  {
    name: "Man Maker",
    aliases: ["DB Man Maker"],
    category: "CROSSFIT",
    effortScore: 8.5,
    isGlobal: true,
  },
  {
    name: "Renegade Row",
    aliases: [],
    category: "CROSSFIT",
    effortScore: 6.5,
    isGlobal: true,
  },
];

// ============================================================================
// KETTLEBELL MOVEMENTS
// ============================================================================
const kettlebellMovements: ExerciseSeed[] = [
  {
    name: "Kettlebell Snatch",
    aliases: ["KB Snatch"],
    category: "CROSSFIT",
    effortScore: 7.0,
    isGlobal: true,
  },
  {
    name: "Kettlebell Clean",
    aliases: ["KB Clean"],
    category: "CROSSFIT",
    effortScore: 6.5,
    isGlobal: true,
  },
  {
    name: "Kettlebell Clean & Jerk",
    aliases: ["KB C&J"],
    category: "CROSSFIT",
    effortScore: 7.5,
    isGlobal: true,
  },
];

// ============================================================================
// CROSSFIT - ADDITIONAL WOD MOVEMENTS
// ============================================================================
const crossfitAdditional: ExerciseSeed[] = [
  {
    name: "Ground-to-Overhead",
    aliases: ["G2OH"],
    category: "CROSSFIT",
    effortScore: 8.0,
    isGlobal: true,
  },
  {
    name: "Shoulder-to-Overhead",
    aliases: ["S2OH"],
    category: "CROSSFIT",
    effortScore: 7.0,
    isGlobal: true,
  },
  {
    name: "Open Burpee",
    aliases: [],
    category: "CROSSFIT",
    effortScore: 6.5,
    isGlobal: true,
  },
  {
    name: "Bar Facing Burpee",
    aliases: [],
    category: "CROSSFIT",
    effortScore: 7.0,
    isGlobal: true,
  },
  {
    name: "Lateral Burpee Over Bar",
    aliases: [],
    category: "CROSSFIT",
    effortScore: 7.0,
    isGlobal: true,
  },
  {
    name: "Burpee Broad Jump",
    aliases: [],
    category: "CROSSFIT",
    effortScore: 7.5,
    isGlobal: true,
  },
];

// ============================================================================
// CARDIO & MONOSTRUCTURAL (expanded)
// ============================================================================
const cardioExpanded: ExerciseSeed[] = [
  {
    name: "Echo Bike",
    aliases: [],
    category: "CARDIO",
    effortScore: 7.0,
    isGlobal: true,
  },
  {
    name: "Bike Erg",
    aliases: ["Concept2 BikeErg"],
    category: "CARDIO",
    effortScore: 6.5,
    isGlobal: true,
  },
  {
    name: "Treadmill Run",
    aliases: ["Treadmill", "Assault Runner"],
    category: "CARDIO",
    effortScore: 5.0,
    isGlobal: true,
  },
  {
    name: "Sprint 100m",
    aliases: [],
    category: "CARDIO",
    effortScore: 7.0,
    isGlobal: true,
  },
  {
    name: "Sprint 200m",
    aliases: [],
    category: "CARDIO",
    effortScore: 7.5,
    isGlobal: true,
  },
  {
    name: "Sprint 400m",
    aliases: [],
    category: "CARDIO",
    effortScore: 8.0,
    isGlobal: true,
  },
  {
    name: "Shuttle Run",
    aliases: ["Suicides"],
    category: "CARDIO",
    effortScore: 6.5,
    isGlobal: true,
  },
  {
    name: "Hill Sprint",
    aliases: [],
    category: "CARDIO",
    effortScore: 8.0,
    isGlobal: true,
  },
];

// ============================================================================
// CORE - EXPANDED (serious core work)
// ============================================================================
const coreExpanded: ExerciseSeed[] = [
  {
    name: "Hanging Knee Raise",
    aliases: [],
    category: "BODYWEIGHT",
    effortScore: 5.0,
    isGlobal: true,
  },
  {
    name: "Hanging Leg Raise",
    aliases: [],
    category: "BODYWEIGHT",
    effortScore: 6.0,
    isGlobal: true,
  },
  {
    name: "Hanging Straight Leg Raise",
    aliases: [],
    category: "BODYWEIGHT",
    effortScore: 6.5,
    isGlobal: true,
  },
  {
    name: "Russian Twist",
    aliases: [],
    category: "BODYWEIGHT",
    effortScore: 4.0,
    isGlobal: true,
  },
  {
    name: "Weighted Sit-up",
    aliases: [],
    category: "CROSSFIT",
    effortScore: 5.0,
    isGlobal: true,
  },
  {
    name: "Weighted Plank",
    aliases: [],
    category: "BODYWEIGHT",
    effortScore: 5.0,
    isGlobal: true,
  },
  {
    name: "Dead Bug",
    aliases: [],
    category: "BODYWEIGHT",
    effortScore: 3.0,
    isGlobal: true,
  },
  {
    name: "Bird Dog",
    aliases: [],
    category: "BODYWEIGHT",
    effortScore: 3.0,
    isGlobal: true,
  },
  {
    name: "Pallof Press",
    aliases: [],
    category: "GYM",
    effortScore: 4.0,
    isGlobal: true,
  },
  {
    name: "Cable Crunch",
    aliases: [],
    category: "GYM",
    effortScore: 4.5,
    isGlobal: true,
  },
  {
    name: "Ab Wheel Rollout",
    aliases: ["Barbell Rollout"],
    category: "BODYWEIGHT",
    effortScore: 6.5,
    isGlobal: true,
  },
  {
    name: "Windshield Wipers",
    aliases: [],
    category: "BODYWEIGHT",
    effortScore: 7.5,
    isGlobal: true,
  },
];

// ============================================================================
// CARRIES & STRONGMAN (expanded)
// ============================================================================
const carriesExpanded: ExerciseSeed[] = [
  {
    name: "Suitcase Carry",
    aliases: [],
    category: "GYM",
    effortScore: 5.5,
    isGlobal: true,
  },
  {
    name: "Zercher Carry",
    aliases: [],
    category: "GYM",
    effortScore: 7.0,
    isGlobal: true,
  },
  {
    name: "Front Rack Carry",
    aliases: [],
    category: "GYM",
    effortScore: 6.5,
    isGlobal: true,
  },
  {
    name: "Sandbag Bear Hug Carry",
    aliases: [],
    category: "CROSSFIT",
    effortScore: 6.5,
    isGlobal: true,
  },
  {
    name: "Double Kettlebell Front Rack Carry",
    aliases: [],
    category: "CROSSFIT",
    effortScore: 7.0,
    isGlobal: true,
  },
  {
    name: "Stone to Shoulder",
    aliases: [],
    category: "OTHER",
    effortScore: 8.5,
    isGlobal: true,
  },
  {
    name: "Sandbag to Shoulder",
    aliases: [],
    category: "CROSSFIT",
    effortScore: 7.5,
    isGlobal: true,
  },
  {
    name: "Sandbag Lunges",
    aliases: [],
    category: "CROSSFIT",
    effortScore: 7.0,
    isGlobal: true,
  },
];

// ============================================================================
// SLED & PROWLER (variations)
// ============================================================================
const sledVariations: ExerciseSeed[] = [
  {
    name: "Heavy Sled Push",
    aliases: [],
    category: "OTHER",
    effortScore: 8.0,
    isGlobal: true,
  },
  {
    name: "Light Sled Push",
    aliases: [],
    category: "OTHER",
    effortScore: 5.5,
    isGlobal: true,
  },
  {
    name: "Sled Sprint",
    aliases: [],
    category: "OTHER",
    effortScore: 7.5,
    isGlobal: true,
  },
  {
    name: "Backward Sled Drag",
    aliases: [],
    category: "OTHER",
    effortScore: 6.5,
    isGlobal: true,
  },
];

// ============================================================================
// MED BALL / SLAM MOVEMENTS
// ============================================================================
const medBallMovements: ExerciseSeed[] = [
  {
    name: "Med Ball Clean",
    aliases: [],
    category: "CROSSFIT",
    effortScore: 5.5,
    isGlobal: true,
  },
  {
    name: "Med Ball Slam",
    aliases: [],
    category: "CROSSFIT",
    effortScore: 5.5,
    isGlobal: true,
  },
  {
    name: "Med Ball Squat",
    aliases: [],
    category: "CROSSFIT",
    effortScore: 5.0,
    isGlobal: true,
  },
  {
    name: "Med Ball Chest Pass",
    aliases: [],
    category: "CROSSFIT",
    effortScore: 4.0,
    isGlobal: true,
  },
  {
    name: "Med Ball Overhead Throw",
    aliases: [],
    category: "CROSSFIT",
    effortScore: 5.0,
    isGlobal: true,
  },
];

// ============================================================================
// PLYOMETRICS
// ============================================================================
const plyometrics: ExerciseSeed[] = [
  {
    name: "Broad Jump",
    aliases: [],
    category: "BODYWEIGHT",
    effortScore: 5.5,
    isGlobal: true,
  },
  {
    name: "Tuck Jump",
    aliases: [],
    category: "BODYWEIGHT",
    effortScore: 6.0,
    isGlobal: true,
  },
  {
    name: "Depth Jump",
    aliases: [],
    category: "BODYWEIGHT",
    effortScore: 6.5,
    isGlobal: true,
  },
  {
    name: "Lateral Box Jump",
    aliases: [],
    category: "CROSSFIT",
    effortScore: 6.0,
    isGlobal: true,
  },
  {
    name: "Single Leg Box Jump",
    aliases: [],
    category: "CROSSFIT",
    effortScore: 7.0,
    isGlobal: true,
  },
  {
    name: "Box Jump Step Down",
    aliases: [],
    category: "CROSSFIT",
    effortScore: 5.5,
    isGlobal: true,
  },
];

// ============================================================================
// GROUND MOVEMENT / CONDITIONING
// ============================================================================
const groundMovement: ExerciseSeed[] = [
  {
    name: "Bear Crawl",
    aliases: ["Bear Crawl Forward"],
    category: "BODYWEIGHT",
    effortScore: 5.0,
    isGlobal: true,
  },
  {
    name: "Crab Walk",
    aliases: [],
    category: "BODYWEIGHT",
    effortScore: 4.5,
    isGlobal: true,
  },
  {
    name: "Mountain Climber",
    aliases: [],
    category: "BODYWEIGHT",
    effortScore: 5.5,
    isGlobal: true,
  },
  {
    name: "Inchworm",
    aliases: [],
    category: "BODYWEIGHT",
    effortScore: 4.0,
    isGlobal: true,
  },
  {
    name: "High Knees",
    aliases: [],
    category: "CARDIO",
    effortScore: 5.0,
    isGlobal: true,
  },
];

// ============================================================================
// PUSH-UP VARIATIONS (expanded)
// ============================================================================
const pushupVariations: ExerciseSeed[] = [
  {
    name: "Push-up on Knees",
    aliases: [],
    category: "BODYWEIGHT",
    effortScore: 2.5,
    isGlobal: true,
  },
  {
    name: "Incline Push-up",
    aliases: [],
    category: "BODYWEIGHT",
    effortScore: 3.0,
    isGlobal: true,
  },
];

// ============================================================================
// MOBILITY & ACCESSORIES
// ============================================================================
const mobilityWork: ExerciseSeed[] = [
  {
    name: "Scap Pull-up",
    aliases: [],
    category: "BODYWEIGHT",
    effortScore: 2.0,
    isGlobal: true,
  },
  {
    name: "Step Down",
    aliases: [],
    category: "BODYWEIGHT",
    effortScore: 3.5,
    isGlobal: true,
  },
];

// ============================================================================
// OTHER MOVEMENTS (expanded)
// ============================================================================
const other: ExerciseSeed[] = [
  {
    name: "Turkish Get-up",
    aliases: ["TGU", "Get-up"],
    category: "OTHER",
    effortScore: 7.0,
    isGlobal: true,
  },
  {
    name: "Sled Push",
    aliases: ["Prowler Push"],
    category: "OTHER",
    effortScore: 6.5,
    isGlobal: true,
  },
  {
    name: "Sled Pull",
    aliases: ["Prowler Pull"],
    category: "OTHER",
    effortScore: 6.0,
    isGlobal: true,
  },
  {
    name: "Tire Flip",
    aliases: [],
    category: "OTHER",
    effortScore: 7.5,
    isGlobal: true,
  },
  {
    name: "Battle Rope",
    aliases: ["Battle Ropes"],
    category: "OTHER",
    effortScore: 5.0,
    isGlobal: true,
  },
  // ============================================================================
  // REST / RECOVERY (special exercise type for workout blocks)
  // Used to prescribe rest periods between exercises in a block
  // Example: Back Squat 5x5 → Rest 2:00 → RDL 4x8 → Rest 1:30
  // ============================================================================
  {
    name: "Rest",
    aliases: ["Descanso", "Pause", "Recovery", "Break"],
    category: "OTHER",
    effortScore: 0.0, // Zero effort - it's rest!
    isGlobal: true,
  },
];

// ============================================================================
// SEED FUNCTION
// ============================================================================
async function seedExercises() {
  console.log("🏋️ Starting exercise seed...\n");

  const allExercises = [
    // ORIGINAL CATEGORIES (97 exercises)
    ...squats,
    ...deadlifts,
    ...pressing,
    ...olympic,
    ...crossfit,
    ...pulling,
    ...core,
    ...pushups,
    ...lunges,
    ...carries,
    ...cardio,
    ...other,
    // NEW CATEGORIES (~200+ exercises)
    ...olympicAccessories,
    ...posteriorChain,
    ...squatVariations,
    ...upperBodyAccessories,
    ...machineExercises,
    ...gymnasticsAdvanced,
    ...dumbbellMovements,
    ...kettlebellMovements,
    ...crossfitAdditional,
    ...cardioExpanded,
    ...coreExpanded,
    ...carriesExpanded,
    ...sledVariations,
    ...medBallMovements,
    ...plyometrics,
    ...groundMovement,
    ...pushupVariations,
    ...mobilityWork,
  ];

  console.log(`📊 Total exercises to seed: ${allExercises.length}\n`);
  console.log(`📈 Coverage: CrossFit WODs ✅ | PT Sessions ✅ | HYROX ✅\n`);

  let created = 0;
  let skipped = 0;

  for (const exercise of allExercises) {
    try {
      // Check if exercise already exists (by name)
      const existing = await prisma.exercise.findFirst({
        where: { name: exercise.name },
      });

      if (existing) {
        console.log(`⏭️  Skipped (exists): ${exercise.name}`);
        skipped++;
        continue;
      }

      // Create new exercise
      await prisma.exercise.create({
        data: {
          name: exercise.name,
          aliases: exercise.aliases,
          category: exercise.category,
          effortScore: exercise.effortScore,
          isGlobal: exercise.isGlobal,
        },
      });

      console.log(
        `✅ Created: ${exercise.name} (${exercise.category}, effort: ${exercise.effortScore})`
      );
      created++;
    } catch (error) {
      console.error(`❌ Error creating ${exercise.name}:`, error);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(`✅ Created: ${created} exercises`);
  console.log(`⏭️  Skipped: ${skipped} exercises (already exist)`);
  console.log(`📊 Total: ${allExercises.length} exercises`);
  console.log("=".repeat(60) + "\n");

  console.log("💡 Coverage includes:");
  console.log("   • Olympic Weightlifting (accessories, technique work)");
  console.log("   • Gymnastics (advanced skills, strict variations)");
  console.log("   • Dumbbell WOD movements");
  console.log("   • Kettlebell movements");
  console.log("   • Machine exercises (PT staples)");
  console.log("   • Core work (advanced)");
  console.log("   • Carries & Strongman");
  console.log("   • Plyometrics");
  console.log("   • Cardio variations (sprints, bike, row, ski)");
  console.log("   • Med ball & slam movements");
  console.log("   • Ground movement patterns");
  console.log("\n🎯 Ready for CrossFit, PT, and HYROX tracking!");
}

// Run seed
seedExercises()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
