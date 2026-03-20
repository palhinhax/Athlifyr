/**
 * Athli AI — User motion and lift analyses
 */

import { prisma } from "@/lib/prisma";

interface MotionAnalysisJsonSummary {
  sampleFps?: number;
  metrics?: { kneeFlexionDeg?: number; torsoRangeDeg?: number };
  pose?: {
    framesProcessed: number;
    framesWithPose: number;
    detectionRate: number;
    durationSec: number;
    averageAngles: Record<string, number | null> | null;
  };
  aiAnalysis?: {
    exercise: string | null;
    exerciseEn: string | null;
    confidence: number | null;
    totalReps: number | null;
    durationSec: number | null;
    tempoAvgSec: number | null;
    overallScore: number | null;
    overallNotes: string | null;
    strengths: string[];
    improvements: string[];
    safetyFlags: string[];
  } | null;
}

interface LiftAnalysisJsonSummary {
  durationMs?: number;
  metrics?: {
    maxHorizontalDrift?: number;
    totalVerticalTravel?: number;
    averageSpeed?: number;
  };
  pose?: {
    framesProcessed: number;
    framesWithPose: number;
    detectionRate: number;
    durationSec: number;
    averageAngles: Record<string, number | null> | null;
  };
  aiAnalysis?: {
    exercise: string | null;
    exerciseEn: string | null;
    confidence: number | null;
    totalReps: number | null;
    durationSec: number | null;
    tempoAvgSec: number | null;
    overallScore: number | null;
    overallNotes: string | null;
    strengths: string[];
    improvements: string[];
    safetyFlags: string[];
  } | null;
}

export interface UserAnalysesParams {
  type?: "motion" | "lift";
  limit?: number;
}

function buildMotionAverageAngles(json: MotionAnalysisJsonSummary) {
  if (!json.pose?.averageAngles && !json.metrics) return null;
  return {
    kneeFlexion: json.metrics?.kneeFlexionDeg ?? null,
    torsoRange: json.metrics?.torsoRangeDeg ?? null,
  };
}

export async function getUserAnalyses(
  userId: string,
  params: UserAnalysesParams
): Promise<string> {
  const limit = params.limit || 10;
  const type = params.type;

  const results: {
    type: string;
    id: string;
    label: string | null;
    date: string;
    exercise: string | null;
    overallScore: number | null;
    totalReps: number | null;
    durationSec: number | null;
    strengths: string[];
    improvements: string[];
    safetyFlags: string[];
    overallNotes: string | null;
    averageAngles: Record<string, number | null> | null;
    liftMetrics?: {
      maxHorizontalDrift: number | null;
      totalVerticalTravel: number | null;
      averageSpeed: number | null;
    };
  }[] = [];

  // Fetch motion analyses
  if (!type || type === "motion") {
    const motionRecords = await prisma.motionAnalysisRecord.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        label: true,
        createdAt: true,
        analysisJson: true,
      },
    });

    for (const record of motionRecords) {
      const json = record.analysisJson as unknown as MotionAnalysisJsonSummary;
      const ai = json.aiAnalysis;
      results.push({
        type: "motion",
        id: record.id,
        label: record.label,
        date: record.createdAt.toISOString().split("T")[0],
        exercise: ai?.exercise || ai?.exerciseEn || null,
        overallScore: ai?.overallScore ?? null,
        totalReps: ai?.totalReps ?? null,
        durationSec: ai?.durationSec ?? json.pose?.durationSec ?? null,
        strengths: ai?.strengths ?? [],
        improvements: ai?.improvements ?? [],
        safetyFlags: ai?.safetyFlags ?? [],
        overallNotes: ai?.overallNotes ?? null,
        averageAngles: buildMotionAverageAngles(json),
      });
    }
  }

  // Fetch lift analyses
  if (!type || type === "lift") {
    const liftRecords = await prisma.liftAnalysisRecord.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        label: true,
        createdAt: true,
        analysisJson: true,
      },
    });

    for (const record of liftRecords) {
      const json = record.analysisJson as unknown as LiftAnalysisJsonSummary;
      const ai = json.aiAnalysis;
      results.push({
        type: "lift",
        id: record.id,
        label: record.label,
        date: record.createdAt.toISOString().split("T")[0],
        exercise: ai?.exercise || ai?.exerciseEn || null,
        overallScore: ai?.overallScore ?? null,
        totalReps: ai?.totalReps ?? null,
        durationSec:
          ai?.durationSec ?? (json.durationMs ? json.durationMs / 1000 : null),
        strengths: ai?.strengths ?? [],
        improvements: ai?.improvements ?? [],
        safetyFlags: ai?.safetyFlags ?? [],
        overallNotes: ai?.overallNotes ?? null,
        averageAngles: json.pose?.averageAngles ?? null,
        liftMetrics: json.metrics
          ? {
              maxHorizontalDrift: json.metrics.maxHorizontalDrift ?? null,
              totalVerticalTravel: json.metrics.totalVerticalTravel ?? null,
              averageSpeed: json.metrics.averageSpeed ?? null,
            }
          : undefined,
      });
    }
  }

  // Sort all results by date descending
  results.sort((a, b) => b.date.localeCompare(a.date));

  if (results.length === 0) {
    return "No analyses found. The user hasn't saved any video analyses yet.";
  }

  return JSON.stringify({
    total: results.length,
    analyses: results.slice(0, limit),
  });
}
