import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@athlifyr/event-sport-filter";

/**
 * Shared sport filter state persisted to AsyncStorage.
 * Used by both events list and map views.
 */
export function useEventSportFilter() {
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load saved filter on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setSelectedSports(parsed);
          }
        }
      } catch {
        // ignore read errors
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const handleSportsChange = useCallback((sports: string[]) => {
    setSelectedSports(sports);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sports)).catch(() => {});
  }, []);

  return { selectedSports, onSportsChange: handleSportsChange, loaded };
}
