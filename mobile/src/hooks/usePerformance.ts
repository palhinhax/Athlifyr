import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/src/lib/api";
import * as SecureStore from "expo-secure-store";

// ============================================================================
// Types
// ============================================================================

export interface RunChartPoint {
  date: string;
  pace: number;
  distanceKm: number;
}

export interface HalfPrediction {
  predictedTimeSeconds: number;
  rangeLowSeconds: number;
  rangeHighSeconds: number;
  confidence: "LOW" | "MEDIUM" | "HIGH";
  inputsUsedCount: number;
  averagePace: number;
}

export interface StrengthChartPoint {
  date: string;
  e1rm: number;
}

export interface E1rmPrediction {
  exerciseId: string;
  exerciseName: string;
  currentE1rmKg: number;
  confidence: "LOW" | "MEDIUM" | "HIGH";
  inputsUsedCount: number;
}

export interface ExerciseSummary {
  exerciseId: string;
  exerciseName: string;
  chartPoints: StrengthChartPoint[];
  e1rmPrediction: E1rmPrediction | null;
  totalEntries: number;
}

export interface EventResultInfo {
  eventId: string;
  eventSlug: string;
  eventTitle: string | null;
  eventCity: string | null;
  eventDate: string;
  variantName: string | null;
  variantDistanceKm: number | null;
  position: number | null;
  categoryPosition: number | null;
}

export interface PerformanceEntry {
  id: string;
  type: "RUN" | "TRAIL" | "STRENGTH" | "HYROX";
  performedAt: string;
  distanceKm?: number | null;
  timeSeconds?: number | null;
  elevationGainM?: number | null;
  exerciseId?: string | null;
  exerciseName?: string | null;
  weightKg?: number | null;
  reps?: number | null;
  hyroxCategory?: string | null;
  eventResult?: EventResultInfo | null;
}

export interface HyroxEntry {
  id: string;
  type: "HYROX";
  performedAt: string;
  timeSeconds: number;
  hyroxCategory: string;
  eventName?: string | null;
  location?: string | null;
}

export interface PerformanceSummary {
  run: {
    chartPoints: RunChartPoint[];
    halfPrediction: HalfPrediction | null;
    totalEntries: number;
  };
  trail: {
    chartPoints: RunChartPoint[];
    totalEntries: number;
  };
  strength: {
    exercises: ExerciseSummary[];
    totalEntries: number;
  };
  hyrox: {
    entries: HyroxEntry[];
    totalEntries: number;
    bestTimeByCategory: Record<
      string,
      { timeSeconds: number; performedAt: string }
    >;
  };
  entries: PerformanceEntry[];
}

// ============================================================================
// Helpers
// ============================================================================

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = await SecureStore.getItemAsync("auth-token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.round(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function formatPace(paceSecondsPerKm: number): string {
  const minutes = Math.floor(paceSecondsPerKm / 60);
  const seconds = Math.round(paceSecondsPerKm % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function parseTimeToSeconds(timeStr: string): number | null {
  const parts = timeStr.split(":").map(Number);
  if (parts.some(isNaN)) return null;

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return null;
}

// ============================================================================
// Fetch Function
// ============================================================================

async function fetchPerformanceSummary(): Promise<PerformanceSummary> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/profile/performance/summary`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch performance summary");
  }

  return response.json() as Promise<PerformanceSummary>;
}

// ============================================================================
// Create Entry Types
// ============================================================================

export interface CreateRunEntry {
  type: "RUN";
  distanceKm: number;
  timeSeconds: number;
  performedAt: string;
  elevationGainM?: number;
}

export interface CreateStrengthEntry {
  type: "STRENGTH";
  exerciseId: string;
  reps: number;
  weightKg: number;
  performedAt: string;
}

export interface CreateHyroxEntry {
  type: "HYROX";
  hyroxCategory: string;
  timeSeconds: number;
  performedAt: string;
  eventName?: string;
  location?: string;
}

type CreateEntryData = CreateRunEntry | CreateStrengthEntry | CreateHyroxEntry;

async function createEntry(data: CreateEntryData): Promise<PerformanceEntry> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/profile/performance`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create entry");
  }

  return response.json() as Promise<PerformanceEntry>;
}

async function deleteEntry(id: string): Promise<void> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/api/profile/performance?id=${id}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to delete entry");
  }
}

// ============================================================================
// Hook
// ============================================================================

export function usePerformance() {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["performance-summary"],
    queryFn: fetchPerformanceSummary,
    staleTime: 60000,
  });

  const createMutation = useMutation({
    mutationFn: createEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["performance-summary"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["performance-summary"] });
    },
  });

  return {
    summary: data ?? null,
    isLoading,
    error,
    refetch,
    createEntry: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteEntry: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
