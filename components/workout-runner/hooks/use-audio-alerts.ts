"use client";

/**
 * useAudioAlerts Hook
 *
 * Generates audio alerts/beeps for timer events using Web Audio API.
 * - Short beep: countdown ticks (3, 2, 1)
 * - Long beep: GO! / phase transitions
 * - Double beep: timer finished
 * - Mute state persisted in localStorage
 */

import { useCallback, useRef, useEffect, useState } from "react";

const STORAGE_KEY = "workout-audio-muted";

interface UseAudioAlertsReturn {
  playCountdownBeep: () => void; // Short high beep for 3, 2, 1
  playGoBeep: () => void; // Long lower beep for GO!
  playTransitionBeep: () => void; // Medium beep for work/rest transition
  playFinishBeep: () => void; // Double beep for finish
  isMuted: boolean; // Current mute state
  toggleMute: () => void; // Toggle mute on/off
}

export function useAudioAlerts(): UseAudioAlertsReturn {
  const audioContextRef = useRef<AudioContext | null>(null);

  // Mute state with localStorage persistence
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "true";
  });

  // Persist mute state to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, String(isMuted));
    }
  }, [isMuted]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // Initialize AudioContext on first interaction (required by browsers)
  const getAudioContext = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;

    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext
        )();
      } catch {
        console.warn("Web Audio API not supported");
        return null;
      }
    }

    // Resume if suspended (required after user interaction)
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }

    return audioContextRef.current;
  }, []);

  // Generate a beep with given parameters
  const playBeep = useCallback(
    (
      frequency: number,
      duration: number,
      type: OscillatorType = "sine",
      volume: number = 0.5
    ) => {
      // Skip if muted
      if (isMuted) return;

      const ctx = getAudioContext();
      if (!ctx) return;

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      // Envelope for smooth sound
      const now = ctx.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);
      gainNode.gain.linearRampToValueAtTime(volume, now + duration - 0.05);
      gainNode.gain.linearRampToValueAtTime(0, now + duration);

      oscillator.start(now);
      oscillator.stop(now + duration);
    },
    [isMuted, getAudioContext]
  );

  // Short high beep for countdown (3, 2, 1)
  const playCountdownBeep = useCallback(() => {
    playBeep(880, 0.1, "sine", 0.4); // A5, 100ms
  }, [playBeep]);

  // Two quick beeps at different pitches for GO!
  const playGoBeep = useCallback(() => {
    if (isMuted) return;
    // First beep - lower pitch
    playBeep(440, 0.1, "sine", 0.5); // A4, 100ms
    // Second beep - higher pitch after short delay
    setTimeout(() => {
      playBeep(880, 0.15, "sine", 0.6); // A5, 150ms
    }, 120);
  }, [isMuted, playBeep]);

  // Quick beep for work/rest transitions
  const playTransitionBeep = useCallback(() => {
    playBeep(660, 0.1, "sine", 0.5); // E5, 100ms
  }, [playBeep]);

  // Double beep for finish
  const playFinishBeep = useCallback(() => {
    if (isMuted) return;

    // First beep
    playBeep(880, 0.15, "sine", 0.5);

    // Second beep after short delay
    setTimeout(() => {
      playBeep(1100, 0.3, "sine", 0.6); // Higher pitch, longer
    }, 200);
  }, [isMuted, playBeep]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    playCountdownBeep,
    playGoBeep,
    playTransitionBeep,
    playFinishBeep,
    isMuted,
    toggleMute,
  };
}
