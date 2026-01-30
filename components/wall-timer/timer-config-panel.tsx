"use client";

/**
 * Timer Configuration Panel
 *
 * UI for configuring timer modes, brightness, and sound settings
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Timer,
  Clock,
  Zap,
  Activity,
  Target,
  StopCircle,
  Volume2,
  Sun,
  Contrast,
} from "lucide-react";
import type {
  TimerConfig,
  TimerMode,
  BrightnessLevel,
  SoundSettings,
  SoundVolume,
} from "@/types/timer";

interface TimerConfigPanelProps {
  onConfigChange: (config: TimerConfig) => void;
  brightness: BrightnessLevel;
  onBrightnessChange: (brightness: BrightnessLevel) => void;
  highContrast: boolean;
  onHighContrastChange: (highContrast: boolean) => void;
  soundSettings: SoundSettings;
  onSoundSettingsChange: (settings: SoundSettings) => void;
}

export function TimerConfigPanel({
  onConfigChange,
  brightness,
  onBrightnessChange,
  highContrast,
  onHighContrastChange,
  soundSettings,
  onSoundSettingsChange,
}: TimerConfigPanelProps) {
  const [selectedMode, setSelectedMode] = useState<TimerMode>("INTERVAL");

  // INTERVAL settings
  const [intervalWork, setIntervalWork] = useState(45);
  const [intervalRest, setIntervalRest] = useState(15);
  const [intervalRounds, setIntervalRounds] = useState(8);

  // EMOM settings
  const [emomDuration, setEmomDuration] = useState(10);
  const [emomWorkTime, setEmomWorkTime] = useState(60);

  // TABATA settings
  const [tabataWork, setTabataWork] = useState(20);
  const [tabataRest, setTabataRest] = useState(10);
  const [tabataRounds, setTabataRounds] = useState(8);

  // AMRAP settings
  const [amrapDuration, setAmrapDuration] = useState(12);

  // FOR TIME settings
  const [forTimeCountdown, setForTimeCountdown] = useState(true);
  const [forTimeDuration, setForTimeDuration] = useState(20);

  const timerModes = [
    { value: "INTERVAL", label: "Interval", icon: Timer },
    { value: "EMOM", label: "EMOM", icon: Activity },
    { value: "TABATA", label: "Tabata", icon: Zap },
    { value: "AMRAP", label: "AMRAP", icon: Target },
    { value: "FOR_TIME", label: "For Time", icon: StopCircle },
    { value: "STOPWATCH", label: "Stopwatch", icon: Timer },
    { value: "CLOCK", label: "Clock", icon: Clock },
  ] as const;

  const handleStart = () => {
    let config: TimerConfig;

    switch (selectedMode) {
      case "INTERVAL":
        config = {
          mode: "INTERVAL",
          config: {
            workTime: intervalWork,
            restTime: intervalRest,
            rounds: intervalRounds,
          },
        };
        break;

      case "EMOM":
        config = {
          mode: "EMOM",
          config: {
            duration: emomDuration,
            workTime: emomWorkTime,
          },
        };
        break;

      case "TABATA":
        config = {
          mode: "TABATA",
          config: {
            workTime: tabataWork,
            restTime: tabataRest,
            rounds: tabataRounds,
          },
        };
        break;

      case "AMRAP":
        config = {
          mode: "AMRAP",
          config: {
            duration: amrapDuration * 60, // convert to seconds
          },
        };
        break;

      case "FOR_TIME":
        config = {
          mode: "FOR_TIME",
          config: {
            countDown: forTimeCountdown,
            duration: forTimeCountdown ? forTimeDuration * 60 : undefined,
          },
        };
        break;

      case "STOPWATCH":
        config = {
          mode: "STOPWATCH",
          config: null,
        };
        break;

      case "CLOCK":
        config = {
          mode: "CLOCK",
          config: null,
        };
        break;

      default:
        return;
    }

    onConfigChange(config);
  };

  return (
    <div className="mx-auto max-h-screen w-full max-w-4xl overflow-y-auto p-6">
      <div className="space-y-6">
        {/* Timer Mode Selection */}
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader>
            <CardTitle className="text-white">Select Timer Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {timerModes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <Button
                    key={mode.value}
                    variant={
                      selectedMode === mode.value ? "default" : "outline"
                    }
                    className="flex h-24 flex-col items-center justify-center gap-2"
                    onClick={() => setSelectedMode(mode.value)}
                  >
                    <Icon className="h-6 w-6" />
                    <span>{mode.label}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Mode-specific Settings */}
        {selectedMode === "INTERVAL" && (
          <Card className="border-gray-800 bg-gray-900">
            <CardHeader>
              <CardTitle className="text-white">Interval Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Work Time (seconds)</Label>
                <Input
                  type="number"
                  value={intervalWork}
                  onChange={(e) => setIntervalWork(Number(e.target.value))}
                  min={1}
                  max={600}
                  className="border-gray-700 bg-gray-800 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Rest Time (seconds)</Label>
                <Input
                  type="number"
                  value={intervalRest}
                  onChange={(e) => setIntervalRest(Number(e.target.value))}
                  min={1}
                  max={600}
                  className="border-gray-700 bg-gray-800 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Rounds</Label>
                <Input
                  type="number"
                  value={intervalRounds}
                  onChange={(e) => setIntervalRounds(Number(e.target.value))}
                  min={1}
                  max={50}
                  className="border-gray-700 bg-gray-800 text-white"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {selectedMode === "EMOM" && (
          <Card className="border-gray-800 bg-gray-900">
            <CardHeader>
              <CardTitle className="text-white">EMOM Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Duration (minutes)</Label>
                <Input
                  type="number"
                  value={emomDuration}
                  onChange={(e) => setEmomDuration(Number(e.target.value))}
                  min={1}
                  max={60}
                  className="border-gray-700 bg-gray-800 text-white"
                />
              </div>
              <div>
                <Label className="text-white">
                  Work Time Per Minute (seconds)
                </Label>
                <Input
                  type="number"
                  value={emomWorkTime}
                  onChange={(e) => setEmomWorkTime(Number(e.target.value))}
                  min={1}
                  max={60}
                  className="border-gray-700 bg-gray-800 text-white"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {selectedMode === "TABATA" && (
          <Card className="border-gray-800 bg-gray-900">
            <CardHeader>
              <CardTitle className="text-white">Tabata Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Work Time (seconds)</Label>
                <Input
                  type="number"
                  value={tabataWork}
                  onChange={(e) => setTabataWork(Number(e.target.value))}
                  min={1}
                  max={60}
                  className="border-gray-700 bg-gray-800 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Rest Time (seconds)</Label>
                <Input
                  type="number"
                  value={tabataRest}
                  onChange={(e) => setTabataRest(Number(e.target.value))}
                  min={1}
                  max={60}
                  className="border-gray-700 bg-gray-800 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Rounds</Label>
                <Input
                  type="number"
                  value={tabataRounds}
                  onChange={(e) => setTabataRounds(Number(e.target.value))}
                  min={1}
                  max={20}
                  className="border-gray-700 bg-gray-800 text-white"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {selectedMode === "AMRAP" && (
          <Card className="border-gray-800 bg-gray-900">
            <CardHeader>
              <CardTitle className="text-white">AMRAP Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label className="text-white">Duration (minutes)</Label>
                <Input
                  type="number"
                  value={amrapDuration}
                  onChange={(e) => setAmrapDuration(Number(e.target.value))}
                  min={1}
                  max={60}
                  className="border-gray-700 bg-gray-800 text-white"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {selectedMode === "FOR_TIME" && (
          <Card className="border-gray-800 bg-gray-900">
            <CardHeader>
              <CardTitle className="text-white">For Time Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-white">Count Down</Label>
                <Switch
                  checked={forTimeCountdown}
                  onCheckedChange={setForTimeCountdown}
                />
              </div>
              {forTimeCountdown && (
                <div>
                  <Label className="text-white">Duration (minutes)</Label>
                  <Input
                    type="number"
                    value={forTimeDuration}
                    onChange={(e) => setForTimeDuration(Number(e.target.value))}
                    min={1}
                    max={120}
                    className="border-gray-700 bg-gray-800 text-white"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Display Settings */}
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Sun className="h-5 w-5" />
              Display Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-white">Brightness</Label>
                <span className="text-sm text-white">{brightness}</span>
              </div>
              <Slider
                value={[brightness]}
                onValueChange={([value]) =>
                  onBrightnessChange(value as BrightnessLevel)
                }
                min={1}
                max={5}
                step={1}
                className="w-full"
              />
            </div>

            <Separator className="bg-gray-700" />

            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-white">
                <Contrast className="h-4 w-4" />
                High Contrast
              </Label>
              <Switch
                checked={highContrast}
                onCheckedChange={onHighContrastChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Sound Settings */}
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Volume2 className="h-5 w-5" />
              Sound Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-white">Volume</Label>
                <span className="text-sm text-white">
                  {soundSettings.volume}
                </span>
              </div>
              <Slider
                value={[soundSettings.volume]}
                onValueChange={([value]) =>
                  onSoundSettingsChange({
                    ...soundSettings,
                    volume: value as SoundVolume,
                  })
                }
                min={0}
                max={5}
                step={1}
                className="w-full"
              />
            </div>

            <Separator className="bg-gray-700" />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-white">Countdown Beeps</Label>
                <Switch
                  checked={soundSettings.enableCountdown}
                  onCheckedChange={(checked) =>
                    onSoundSettingsChange({
                      ...soundSettings,
                      enableCountdown: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-white">Transition Beeps</Label>
                <Switch
                  checked={soundSettings.enableTransitions}
                  onCheckedChange={(checked) =>
                    onSoundSettingsChange({
                      ...soundSettings,
                      enableTransitions: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-white">Completion Sound</Label>
                <Switch
                  checked={soundSettings.enableCompletion}
                  onCheckedChange={(checked) =>
                    onSoundSettingsChange({
                      ...soundSettings,
                      enableCompletion: checked,
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Start Button */}
        <Button
          size="lg"
          className="h-14 w-full text-lg font-bold"
          onClick={handleStart}
        >
          Start Timer
        </Button>
      </div>
    </div>
  );
}
