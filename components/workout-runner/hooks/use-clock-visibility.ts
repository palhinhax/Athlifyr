"use client";

/**
 * useClockVisibility Hook
 *
 * Manages the visibility state of the workout timer clock.
 * Persists the preference in localStorage.
 */

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "workout-clock-visible";

interface UseClockVisibilityReturn {
  isClockVisible: boolean;
  toggleClockVisibility: () => void;
  showClock: () => void;
  hideClock: () => void;
}

export function useClockVisibility(): UseClockVisibilityReturn {
  // Default to visible
  const [isClockVisible, setIsClockVisible] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem(STORAGE_KEY);
    // Default to true if not set
    return stored !== "false";
  });

  // Persist visibility state to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, String(isClockVisible));
    }
  }, [isClockVisible]);

  // Toggle visibility
  const toggleClockVisibility = useCallback(() => {
    setIsClockVisible((prev) => !prev);
  }, []);

  // Show clock
  const showClock = useCallback(() => {
    setIsClockVisible(true);
  }, []);

  // Hide clock
  const hideClock = useCallback(() => {
    setIsClockVisible(false);
  }, []);

  return {
    isClockVisible,
    toggleClockVisibility,
    showClock,
    hideClock,
  };
}
