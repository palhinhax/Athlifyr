import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { MotionAnalysis } from "@/src/types/motion-analysis";

const STORAGE_KEY = "motion-analyses";

interface MotionAnalysisState {
  analyses: MotionAnalysis[];
  isLoaded: boolean;

  load: () => Promise<void>;
  save: (analysis: MotionAnalysis) => Promise<void>;
  remove: (id: string) => Promise<void>;
  getById: (id: string) => MotionAnalysis | undefined;
}

async function persistAll(analyses: MotionAnalysis[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
}

export const useMotionAnalysisStore = create<MotionAnalysisState>(
  (set, get) => ({
    analyses: [],
    isLoaded: false,

    load: async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed: MotionAnalysis[] = raw ? JSON.parse(raw) : [];
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
      let updated: MotionAnalysis[];
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

    getById: (id) => get().analyses.find((a) => a.id === id),
  })
);
