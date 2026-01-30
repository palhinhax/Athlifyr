"use client";

/**
 * Wall Timer Modal
 *
 * Full-screen modal for workout timing with large display
 * Inspired by CrossFit box wall timers
 */

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { WallTimerDisplay } from "./wall-timer-display";
import { TimerControls } from "./timer-controls";
import { TimerConfigPanel } from "./timer-config-panel";
import { useWallTimer } from "@/hooks/use-wall-timer";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  TimerConfig,
  BrightnessLevel,
  SoundSettings,
} from "@/types/timer";

interface WallTimerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialConfig?: TimerConfig;
  onComplete?: () => void;
}

export function WallTimerModal({
  open,
  onOpenChange,
  initialConfig,
  onComplete,
}: WallTimerModalProps) {
  // Settings state
  const [brightness, setBrightness] = useState<BrightnessLevel>(3);
  const [highContrast, setHighContrast] = useState(false);
  const [soundSettings, setSoundSettings] = useState<SoundSettings>({
    volume: 3,
    enableCountdown: true,
    enableTransitions: true,
    enableCompletion: true,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(!initialConfig);

  // Timer hook
  const { displayState, timerState, start, pause, resume, reset, configure } =
    useWallTimer({
      config: initialConfig,
      soundSettings,
      onComplete,
    });

  // Fullscreen handling
  useEffect(() => {
    if (!open) {
      setIsFullscreen(false);
      return;
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [open]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent default for timer controls
      if (["Space", "KeyR", "KeyS"].includes(e.code)) {
        e.preventDefault();
      }

      switch (e.code) {
        case "Space":
          if (timerState === "READY" || timerState === "FINISHED") {
            start();
          } else if (timerState === "RUNNING") {
            pause();
          } else if (timerState === "PAUSED") {
            resume();
          }
          break;
        case "KeyR":
          reset();
          break;
        case "KeyS":
          setShowSettings((prev) => !prev);
          break;
        case "Escape":
          if (timerState === "READY" || timerState === "FINISHED") {
            onOpenChange(false);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [open, timerState, start, pause, resume, reset, onOpenChange]);

  const handleConfigChange = (config: TimerConfig) => {
    configure(config);
    setShowSettings(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "m-0 h-screen w-screen max-w-none p-0",
          "border-none bg-black",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        )}
        // Remove close button (we have custom controls)
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Top Bar */}
        <div className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              disabled={timerState === "RUNNING"}
              className="text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/10"
            >
              {isFullscreen ? (
                <Minimize2 className="h-5 w-5" />
              ) : (
                <Maximize2 className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle Fullscreen</span>
            </Button>
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="hidden items-center gap-4 text-xs text-gray-400 sm:flex">
            <span>
              <kbd className="rounded bg-gray-800 px-2 py-1">Space</kbd>{" "}
              Start/Pause
            </span>
            <span>
              <kbd className="rounded bg-gray-800 px-2 py-1">R</kbd> Reset
            </span>
            <span>
              <kbd className="rounded bg-gray-800 px-2 py-1">S</kbd> Settings
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative flex h-full w-full flex-col items-center justify-center">
          {showSettings ? (
            <TimerConfigPanel
              onConfigChange={handleConfigChange}
              brightness={brightness}
              onBrightnessChange={setBrightness}
              highContrast={highContrast}
              onHighContrastChange={setHighContrast}
              soundSettings={soundSettings}
              onSoundSettingsChange={setSoundSettings}
            />
          ) : (
            <>
              {/* Timer Display */}
              <div className="flex w-full flex-1 items-center justify-center">
                <WallTimerDisplay
                  displayState={displayState}
                  brightness={brightness}
                  highContrast={highContrast}
                />
              </div>

              {/* Controls */}
              <div className="pb-8">
                <TimerControls
                  timerState={timerState}
                  onStart={start}
                  onPause={pause}
                  onResume={resume}
                  onReset={reset}
                  onSettings={() => setShowSettings(true)}
                />
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
