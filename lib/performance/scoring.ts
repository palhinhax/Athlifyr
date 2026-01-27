/**
 * Performance scoring and prediction algorithms
 */

export interface RunEntry {
  distanceKm: number;
  timeSeconds: number;
  elevationGainM?: number | null;
  performedAt: Date;
  qualityScore: number | null;
  predictionWeight: number | null;
}

export interface StrengthEntry {
  exerciseId: string;
  weightKg: number;
  reps: number;
  performedAt: Date;
  qualityScore: number | null;
  predictionWeight: number | null;
}

interface ScoringResult {
  qualityScore: number;
  predictionWeight: number;
}

type ConfidenceLevel = "LOW" | "MEDIUM" | "HIGH";

export interface HalfMarathonPrediction {
  predictedTimeSeconds: number;
  rangeLowSeconds: number;
  rangeHighSeconds: number;
  confidence: ConfidenceLevel;
  inputsUsedCount: number;
  averagePace: number; // sec/km
}

export interface E1rmPrediction {
  exerciseId: string;
  exerciseName: string;
  currentE1rmKg: number;
  confidence: ConfidenceLevel;
  inputsUsedCount: number;
}

// ============ QUALITY SCORING ============

/**
 * Compute quality score for a running entry
 * Quality score indicates plausibility (0-1)
 */
export function computeRunQualityScore(
  distanceKm: number,
  timeSeconds: number,
  elevationGainM?: number | null
): number {
  const pace = timeSeconds / distanceKm; // sec/km

  // Impossibly fast pace (< 2 min/km)
  if (pace < 120) return 0.2;

  // Impossibly slow pace (> 15 min/km)
  if (pace > 900) return 0.3;

  // Ultra fast for long distance
  if (distanceKm >= 30 && pace < 180) return 0.2;

  // Very fast for long distance without significant elevation
  if (
    distanceKm >= 20 &&
    pace < 200 &&
    (!elevationGainM || elevationGainM < 500)
  ) {
    return 0.4;
  }

  // Normal ranges - good quality
  // 3:00-8:00 min/km is typical for trained runners
  if (pace >= 180 && pace <= 480) return 1.0;

  // Slightly outside normal but still valid
  if (pace > 480 && pace <= 600) return 0.9;
  if (pace > 600 && pace <= 720) return 0.7;

  // Slow but valid (hiking pace)
  return 0.5;
}

/**
 * Compute quality score for a strength entry
 */
export function computeStrengthQualityScore(
  weightKg: number,
  reps: number
): number {
  // Zero weight is suspicious (unless bodyweight exercise - handled separately)
  if (weightKg === 0) return 0.5;

  // Invalid reps
  if (reps < 1) return 0;

  // Very high reps are less useful for strength prediction
  if (reps > 20) return 0.6;
  if (reps > 15) return 0.7;
  if (reps > 12) return 0.8;

  // Good rep range for e1RM calculation (1-12)
  return 1.0;
}

// ============ PREDICTION WEIGHT ============

/**
 * Compute prediction weight based on quality, recency, and outlier status
 */
export function computePredictionWeight(
  qualityScore: number,
  performedAt: Date,
  medianValue?: number,
  currentValue?: number
): number {
  let weight = qualityScore;

  // Recency decay: exp(-daysAgo / 45)
  // This means after 45 days, weight is reduced to ~37%
  // After 90 days, weight is reduced to ~13%
  const daysAgo = Math.floor(
    (Date.now() - performedAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  const recencyFactor = Math.max(0.1, Math.min(1.0, Math.exp(-daysAgo / 45)));
  weight *= recencyFactor;

  // Outlier detection: if value is >50% different from median, down-weight
  if (
    medianValue !== undefined &&
    currentValue !== undefined &&
    medianValue > 0
  ) {
    const deviation = Math.abs(currentValue - medianValue) / medianValue;
    if (deviation > 0.5) {
      weight *= 0.3; // Severe down-weight for outliers
    } else if (deviation > 0.3) {
      weight *= 0.6;
    }
  }

  return Math.max(0.01, Math.min(1.0, weight));
}

/**
 * Compute scores for a running entry with historical context
 */
export function computeRunScores(
  entry: {
    distanceKm: number;
    timeSeconds: number;
    elevationGainM?: number | null;
    performedAt: Date;
  },
  history: { timeSeconds: number; distanceKm: number; performedAt: Date }[]
): ScoringResult {
  const qualityScore = computeRunQualityScore(
    entry.distanceKm,
    entry.timeSeconds,
    entry.elevationGainM
  );

  // Calculate median pace from recent history (last 90 days)
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const recentHistory = history.filter(
    (h) => h.performedAt >= ninetyDaysAgo && h.distanceKm > 0
  );

  let medianPace: number | undefined;
  const currentPace = entry.timeSeconds / entry.distanceKm;

  if (recentHistory.length >= 3) {
    const paces = recentHistory
      .map((h) => h.timeSeconds / h.distanceKm)
      .sort((a, b) => a - b);
    medianPace = paces[Math.floor(paces.length / 2)];
  }

  const predictionWeight = computePredictionWeight(
    qualityScore,
    entry.performedAt,
    medianPace,
    currentPace
  );

  return { qualityScore, predictionWeight };
}

/**
 * Compute scores for a strength entry with historical context
 */
export function computeStrengthScores(
  entry: { weightKg: number; reps: number; performedAt: Date },
  history: { weightKg: number; reps: number; performedAt: Date }[]
): ScoringResult {
  const qualityScore = computeStrengthQualityScore(entry.weightKg, entry.reps);

  // Calculate median e1RM from recent history (last 90 days)
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const recentHistory = history.filter(
    (h) => h.performedAt >= ninetyDaysAgo && h.reps <= 12 && h.weightKg > 0
  );

  let medianE1rm: number | undefined;
  const currentE1rm = calculateE1rm(entry.weightKg, entry.reps);

  if (recentHistory.length >= 3) {
    const e1rms = recentHistory
      .map((h) => calculateE1rm(h.weightKg, h.reps))
      .sort((a, b) => a - b);
    medianE1rm = e1rms[Math.floor(e1rms.length / 2)];
  }

  const predictionWeight = computePredictionWeight(
    qualityScore,
    entry.performedAt,
    medianE1rm,
    currentE1rm
  );

  return { qualityScore, predictionWeight };
}

// ============ PREDICTIONS ============

/**
 * Calculate e1RM using Epley formula: e1rm = weight * (1 + reps/30)
 */
export function calculateE1rm(weightKg: number, reps: number): number {
  if (reps === 1) return weightKg;
  return weightKg * (1 + reps / 30);
}

/**
 * Predict half marathon time using Riegel formula
 * T2 = T1 * (D2/D1)^1.06
 */
export function predictTimeWithRiegel(
  knownDistanceKm: number,
  knownTimeSeconds: number,
  targetDistanceKm: number
): number {
  return knownTimeSeconds * Math.pow(targetDistanceKm / knownDistanceKm, 1.06);
}

/**
 * Predict half marathon (21.0975 km) time from running history
 */
export function predictHalfMarathon(
  entries: RunEntry[]
): HalfMarathonPrediction | null {
  const HALF_MARATHON_KM = 21.0975;
  const MIN_QUALITY = 0.5;

  // Filter entries with sufficient quality (null safety)
  const validEntries = entries.filter(
    (e) =>
      e.qualityScore !== null &&
      e.predictionWeight !== null &&
      e.qualityScore >= MIN_QUALITY &&
      e.distanceKm > 0 &&
      e.timeSeconds > 0
  );

  if (validEntries.length === 0) return null;

  // Predict time for each entry
  const predictions = validEntries.map((e) => ({
    predictedTime: predictTimeWithRiegel(
      e.distanceKm,
      e.timeSeconds,
      HALF_MARATHON_KM
    ),
    weight: e.predictionWeight as number,
  }));

  // Weighted average
  const totalWeight = predictions.reduce((sum, p) => sum + p.weight, 0);
  const weightedSum = predictions.reduce(
    (sum, p) => sum + p.predictedTime * p.weight,
    0
  );
  const predictedTimeSeconds = Math.round(weightedSum / totalWeight);

  // Calculate confidence and range
  let confidence: ConfidenceLevel;
  let rangePercent: number;

  if (validEntries.length >= 6) {
    confidence = "HIGH";
    // Calculate weighted standard deviation
    const variance =
      predictions.reduce(
        (sum, p) =>
          sum + p.weight * Math.pow(p.predictedTime - predictedTimeSeconds, 2),
        0
      ) / totalWeight;
    const stdDev = Math.sqrt(variance);
    rangePercent = Math.min(
      0.15,
      Math.max(0.03, stdDev / predictedTimeSeconds)
    );
  } else if (validEntries.length >= 3) {
    confidence = "MEDIUM";
    rangePercent = 0.06;
  } else {
    confidence = "LOW";
    rangePercent = 0.1;
  }

  const rangeLowSeconds = Math.round(predictedTimeSeconds * (1 - rangePercent));
  const rangeHighSeconds = Math.round(
    predictedTimeSeconds * (1 + rangePercent)
  );

  return {
    predictedTimeSeconds,
    rangeLowSeconds,
    rangeHighSeconds,
    confidence,
    inputsUsedCount: validEntries.length,
    averagePace: predictedTimeSeconds / HALF_MARATHON_KM,
  };
}

/**
 * Predict e1RM for a specific exercise from strength history
 *
 * Scientific approach:
 * - Lower reps (1-3) give more accurate e1RM estimates (less formula error)
 * - Recency matters: strength changes over time (14-day half-life for decay)
 * - Actual 1RM tests are the gold standard
 * - Epley formula accuracy degrades significantly above 10 reps
 */
export function predictE1rm(
  entries: StrengthEntry[],
  exerciseId: string,
  exerciseName: string
): E1rmPrediction | null {
  const MIN_QUALITY = 0.5;
  const MAX_REPS_FOR_E1RM = 12;
  const HALF_LIFE_DAYS = 14; // More aggressive decay for strength (was 45)

  // Filter entries for this exercise with sufficient quality (null safety)
  const validEntries = entries.filter(
    (e) =>
      e.exerciseId === exerciseId &&
      e.qualityScore !== null &&
      e.predictionWeight !== null &&
      e.qualityScore >= MIN_QUALITY &&
      e.reps <= MAX_REPS_FOR_E1RM &&
      e.weightKg > 0
  );

  if (validEntries.length === 0) return null;

  // Calculate e1RM for each entry with scientific weighting
  const e1rmData = validEntries.map((e) => {
    const e1rm = calculateE1rm(e.weightKg, e.reps);

    // Base weight from quality score
    let weight = e.qualityScore as number;

    // Recency decay with 14-day half-life (more aggressive than running)
    // After 14 days: ~50%, after 28 days: ~25%, after 42 days: ~12.5%
    const daysAgo = Math.floor(
      (Date.now() - e.performedAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    const recencyFactor = Math.max(
      0.05,
      Math.exp((-daysAgo * Math.LN2) / HALF_LIFE_DAYS)
    );
    weight *= recencyFactor;

    // Rep accuracy bonus: lower reps = more accurate e1RM estimate
    // Scientific basis: Epley formula error increases with rep count
    // 1 rep = actual 1RM (no formula needed) = highest accuracy
    // 2-3 reps = very accurate estimate
    // 4-6 reps = good estimate
    // 7-10 reps = acceptable estimate
    // 11-12 reps = less reliable
    let repAccuracyMultiplier: number;
    if (e.reps === 1) {
      repAccuracyMultiplier = 2.0; // Actual 1RM - gold standard
    } else if (e.reps <= 3) {
      repAccuracyMultiplier = 1.5; // Very accurate
    } else if (e.reps <= 6) {
      repAccuracyMultiplier = 1.2; // Good
    } else if (e.reps <= 10) {
      repAccuracyMultiplier = 1.0; // Acceptable
    } else {
      repAccuracyMultiplier = 0.7; // Less reliable (11-12 reps)
    }
    weight *= repAccuracyMultiplier;

    return { e1rm, weight, reps: e.reps, daysAgo };
  });

  // Weighted average
  const totalWeight = e1rmData.reduce((sum, d) => sum + d.weight, 0);
  const weightedSum = e1rmData.reduce((sum, d) => sum + d.e1rm * d.weight, 0);
  const currentE1rmKg = Math.round((weightedSum / totalWeight) * 10) / 10;

  // Calculate confidence based on data quality
  // Consider: number of entries, recency of best data, presence of actual 1RM tests
  const hasRecent1RM = e1rmData.some((d) => d.reps === 1 && d.daysAgo <= 14);
  const hasRecentLowRep = e1rmData.some((d) => d.reps <= 3 && d.daysAgo <= 21);
  const recentEntries = e1rmData.filter((d) => d.daysAgo <= 30).length;

  let confidence: ConfidenceLevel;
  if (hasRecent1RM || (hasRecentLowRep && recentEntries >= 3)) {
    confidence = "HIGH";
  } else if (hasRecentLowRep || recentEntries >= 2) {
    confidence = "MEDIUM";
  } else {
    confidence = "LOW";
  }

  return {
    exerciseId,
    exerciseName,
    currentE1rmKg,
    confidence,
    inputsUsedCount: validEntries.length,
  };
}

// ============ FORMATTING UTILITIES ============

/**
 * Format seconds to mm:ss or hh:mm:ss
 */
export function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.round(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Parse time string to seconds
 * Supports mm:ss and hh:mm:ss formats
 */
export function parseTimeToSeconds(timeStr: string): number | null {
  const parts = timeStr.split(":").map((p) => parseInt(p, 10));

  if (parts.some(isNaN)) return null;

  if (parts.length === 2) {
    // mm:ss
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    // hh:mm:ss
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  return null;
}

/**
 * Format pace in sec/km to min:ss/km
 */
export function formatPace(paceSecondsPerKm: number): string {
  const minutes = Math.floor(paceSecondsPerKm / 60);
  const seconds = Math.round(paceSecondsPerKm % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
