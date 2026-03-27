import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@athlifyr/location-filter";

interface LocationFilterState {
  enabled: boolean;
  radiusKm: number;
  lat: number | null;
  lng: number | null;
}

const DEFAULTS: LocationFilterState = {
  enabled: false,
  radiusKm: 100,
  lat: null,
  lng: null,
};

export function useLocationFilter() {
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [radiusKm, setRadiusKm] = useState(100);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: LocationFilterState = JSON.parse(raw);
          setLocationEnabled(parsed.enabled ?? DEFAULTS.enabled);
          setRadiusKm(parsed.radiusKm ?? DEFAULTS.radiusKm);
          setUserLat(parsed.lat ?? DEFAULTS.lat);
          setUserLng(parsed.lng ?? DEFAULTS.lng);
        }
      } catch {
        // ignore read errors
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persist = useCallback((state: Partial<LocationFilterState>) => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        const current: LocationFilterState = raw
          ? JSON.parse(raw)
          : { ...DEFAULTS };
        const updated = { ...current, ...state };
        return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      })
      .catch(() => {});
  }, []);

  const handleToggle = useCallback(() => {
    setLocationEnabled((prev) => {
      const next = !prev;
      persist({ enabled: next });
      return next;
    });
  }, [persist]);

  const handleRadiusChange = useCallback(
    (radius: number) => {
      setRadiusKm(radius);
      persist({ radiusKm: radius });
    },
    [persist]
  );

  const handleLocationObtained = useCallback(
    (lat: number, lng: number) => {
      setUserLat(lat);
      setUserLng(lng);
      persist({ lat, lng });
    },
    [persist]
  );

  return {
    locationEnabled,
    radiusKm,
    userLat,
    userLng,
    loaded,
    onLocationToggle: handleToggle,
    onRadiusChange: handleRadiusChange,
    onLocationObtained: handleLocationObtained,
  };
}
