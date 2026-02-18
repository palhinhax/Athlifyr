import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { LiftAnalysis } from "@/src/types/lift-analysis";

const STORAGE_KEY = "lift-analyses";

interface LiftAnalysisState {
  analyses: LiftAnalysis[];
  isLoaded: boolean;

  /** Load saved analyses from AsyncStorage */
  load: () => Promise<void>;
  /** Add (or update) a single analysis */
  save: (analysis: LiftAnalysis) => Promise<void>;
  /** Delete an analysis by id */
  remove: (id: string) => Promise<void>;
  /** Get a single analysis by id */
  getById: (id: string) => LiftAnalysis | undefined;
}

async function persistAll(analyses: LiftAnalysis[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
}

export const useLiftAnalysisStore = create<LiftAnalysisState>((set, get) => ({
  analyses: [],
  isLoaded: false,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed: LiftAnalysis[] = raw ? JSON.parse(raw) : [];
      // Sort newest first
      parsed.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      set({ analyses: parsed, isLoaded: true });
    } catch {
      set({ analyses: [], isLoaded: true });
    }
  },

  save: async (analysis) => {
    const existing = get().analyses;
    const idx = existing.findIndex((a) => a.id === analysis.id);
    let updated: LiftAnalysis[];
    if (idx >= 0) {
      updated = [...existing];
      updated[idx] = analysis;
    } else {
      updated = [analysis, ...existing];
    }
    set({ analyses: updated });
    await persistAll(updated);
  },

  remove: async (id) => {
    const updated = get().analyses.filter((a) => a.id !== id);
    set({ analyses: updated });
    await persistAll(updated);
  },

  getById: (id) => {
    return get().analyses.find((a) => a.id === id);
  },
}));
