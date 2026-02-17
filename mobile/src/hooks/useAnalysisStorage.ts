/**
 * useAnalysisStorage – Hook for persisting and retrieving lift analysis results.
 *
 * Uses AsyncStorage for local persistence of analysis data.
 * Each analysis is stored as a JSON blob keyed by its unique ID.
 */

import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { LiftAnalysisResult } from "@/src/types/lift-analysis";

const STORAGE_KEY = "lift-analysis-results";

interface AnalysisStorageIndex {
  ids: string[];
}

async function getIndex(): Promise<AnalysisStorageIndex> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return { ids: [] };
  return JSON.parse(raw) as AnalysisStorageIndex;
}

async function setIndex(index: AnalysisStorageIndex): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(index));
}

function analysisKey(id: string): string {
  return `${STORAGE_KEY}:${id}`;
}

export function useAnalysisStorage() {
  const [loading, setLoading] = useState(false);

  /** Save an analysis result to local storage. */
  const saveAnalysis = useCallback(
    async (result: LiftAnalysisResult): Promise<void> => {
      setLoading(true);
      try {
        await AsyncStorage.setItem(
          analysisKey(result.id),
          JSON.stringify(result)
        );
        const index = await getIndex();
        if (!index.ids.includes(result.id)) {
          index.ids.unshift(result.id);
          await setIndex(index);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /** Load all analysis results (metadata only – id + createdAt). */
  const listAnalyses = useCallback(async (): Promise<
    Pick<LiftAnalysisResult, "id" | "createdAt" | "videoUriTrimmed">[]
  > => {
    setLoading(true);
    try {
      const index = await getIndex();
      const results: Pick<
        LiftAnalysisResult,
        "id" | "createdAt" | "videoUriTrimmed"
      >[] = [];

      for (const id of index.ids) {
        const raw = await AsyncStorage.getItem(analysisKey(id));
        if (raw) {
          const parsed = JSON.parse(raw) as LiftAnalysisResult;
          results.push({
            id: parsed.id,
            createdAt: parsed.createdAt,
            videoUriTrimmed: parsed.videoUriTrimmed,
          });
        }
      }

      return results;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Load a single analysis result by ID. */
  const getAnalysis = useCallback(
    async (id: string): Promise<LiftAnalysisResult | null> => {
      setLoading(true);
      try {
        const raw = await AsyncStorage.getItem(analysisKey(id));
        if (!raw) return null;
        return JSON.parse(raw) as LiftAnalysisResult;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /** Delete an analysis result by ID. */
  const deleteAnalysis = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem(analysisKey(id));
      const index = await getIndex();
      index.ids = index.ids.filter((storedId) => storedId !== id);
      await setIndex(index);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    saveAnalysis,
    listAnalyses,
    getAnalysis,
    deleteAnalysis,
  };
}
