import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/src/lib/api";
import * as SecureStore from "expo-secure-store";

// ============================================================================
// Types
// ============================================================================

export interface WorkoutCreator {
  id: string;
  name: string | null;
  image: string | null;
}

export interface WorkoutVenue {
  id: string;
  name: string;
  slug: string;
}

export interface WorkoutExerciseDetail {
  id: string;
  name: string;
  category: string;
  hasReps: boolean;
  hasWeight: boolean;
  hasDistance: boolean;
  hasTime: boolean;
  hasCalories: boolean;
  hasHeight: boolean;
}

export interface WorkoutBlockExercise {
  id: string;
  orderIndex: number;
  prescribedReps: number | null;
  prescribedWeight: number | null;
  prescribedSets: number | null;
  prescribedTime: number | null;
  prescribedDistance: number | null;
  prescribedCalories: number | null;
  notes: string | null;
  exercise: WorkoutExerciseDetail;
}

export interface WorkoutBlock {
  id: string;
  type: string;
  name: string | null;
  orderIndex: number;
  timeCap: number | null;
  rounds: number | null;
  notes: string | null;
  exercises: WorkoutBlockExercise[];
}

export interface WorkoutItem {
  id: string;
  name: string;
  description: string | null;
  estimatedTime: number | null;
  difficulty: number | null;
  tags: string[];
  isPublic: boolean;
  isTemplate: boolean;
  isSaved: boolean;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  createdBy: WorkoutCreator;
  venue: WorkoutVenue | null;
  blocks: WorkoutBlock[];
  _count: {
    logs: number;
  };
}

export interface AssignedPlan {
  id: string;
  startDate: string | null;
  status: string;
  plan: {
    id: string;
    name: string;
    description: string | null;
    weeks: Array<{ id: string }>;
    createdBy: {
      id: string;
      name: string | null;
      image: string | null;
    };
  };
  assignedBy: {
    name: string | null;
  } | null;
}

export interface WorkoutLog {
  id: string;
  startedAt: string;
  completedAt: string | null;
  feeling: number | null;
  perceivedEffort: number | null;
  notes: string | null;
  workout: {
    id: string;
    name: string;
  };
  session: {
    id: string;
    title: string;
  } | null;
}

// ============================================================================
// API Fetch Functions
// ============================================================================

async function fetchWorkouts(): Promise<WorkoutItem[]> {
  const token = await SecureStore.getItemAsync("auth-token");
  if (!token) return [];

  const allWorkouts: WorkoutItem[] = [];
  let cursor: string | null = null;
  let hasMore = true;

  while (hasMore) {
    const params = new URLSearchParams({ limit: "50" });
    if (cursor) params.set("cursor", cursor);

    const response = await fetch(`${API_URL}/api/workouts?${params}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) break;

    const data = await response.json();
    const items: WorkoutItem[] = data.items || [];
    allWorkouts.push(...items);
    hasMore = data.hasMore ?? false;
    cursor = data.nextCursor ?? null;
  }

  return allWorkouts;
}

async function fetchAssignedPlans(): Promise<AssignedPlan[]> {
  const token = await SecureStore.getItemAsync("auth-token");
  if (!token) return [];

  const response = await fetch(
    `${API_URL}/api/training-plans?assignedToMe=true`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) return [];

  const data = await response.json();
  return data.userPlans || [];
}

async function fetchWorkoutHistory(): Promise<WorkoutLog[]> {
  const token = await SecureStore.getItemAsync("auth-token");
  if (!token) return [];

  const response = await fetch(`${API_URL}/api/workouts/logs?limit=20`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return [];

  const data = await response.json();
  return data.logs || data.items || [];
}

async function toggleSaveWorkout(workoutId: string): Promise<boolean> {
  const token = await SecureStore.getItemAsync("auth-token");
  if (!token) throw new Error("Not authenticated");

  // First check if it's saved by checking current state
  const response = await fetch(`${API_URL}/api/workouts/${workoutId}/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    // If POST fails (already saved), try DELETE
    const deleteResponse = await fetch(
      `${API_URL}/api/workouts/${workoutId}/save`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!deleteResponse.ok) throw new Error("Failed to toggle save");
    return false; // unsaved
  }

  return true; // saved
}

// ============================================================================
// Hooks
// ============================================================================

export function useWorkouts(userId: string | null) {
  const {
    data: workouts = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["workouts"],
    queryFn: fetchWorkouts,
    enabled: !!userId,
    staleTime: 30000,
  });

  const myWorkouts = workouts.filter((w) => w.createdById === userId);
  const savedWorkouts = workouts.filter((w) => w.isSaved);
  const publicWorkouts = workouts.filter((w) => w.isPublic && !w.isSaved);

  return {
    allWorkouts: workouts,
    myWorkouts,
    savedWorkouts,
    publicWorkouts,
    isLoading,
    refetch,
  };
}

export function useAssignedPlans(enabled: boolean) {
  const {
    data: plans = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["assigned-plans"],
    queryFn: fetchAssignedPlans,
    enabled,
    staleTime: 60000,
  });

  return { plans, isLoading, refetch };
}

export function useWorkoutHistory(enabled: boolean) {
  const {
    data: logs = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["workout-history"],
    queryFn: fetchWorkoutHistory,
    enabled,
    staleTime: 30000,
  });

  return { logs, isLoading, refetch };
}

export function useToggleSaveWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workoutId,
    }: {
      workoutId: string;
      currentlySaved: boolean;
    }) => toggleSaveWorkout(workoutId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });
}
