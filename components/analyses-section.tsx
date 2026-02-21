"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import {
  Activity,
  Dumbbell,
  CalendarDays,
  Clock,
  Play,
  Pause,
  Download,
  Loader2,
  Plus,
  Video,
  Box,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Target,
  Timer,
  Repeat,
  TrendingUp,
  ShieldAlert,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";
import type {
  SkeletonFrame,
  PoseAngles,
  AIAnalysis,
} from "@/types/lift-analysis";

// Dynamic import for Three.js component to prevent SSR issues
const Skeleton3DViewer = dynamic(
  () =>
    import("@/components/skeleton-3d-viewer").then(
      (mod) => mod.Skeleton3DViewer
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[300px] items-center justify-center rounded-lg border bg-muted/10">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    ),
  }
);
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { VideoAnalysisUpload } from "@/components/video-analysis-upload";

// ── Types ─────────────────────────────────────────────────────────────────────

interface BarPathPoint {
  t: number;
  x: number;
  y: number;
}

interface PoseKeypoint {
  name: string;
  x: number;
  y: number;
  score: number;
}

interface PoseFrame {
  t: number;
  keypoints: PoseKeypoint[];
}

interface MotionAnalysisJson {
  // Legacy format (mobile)
  sampleFps?: number;
  poseFrames?: PoseFrame[];
  metrics?: {
    kneeFlexionDeg?: number;
    torsoRangeDeg?: number;
  };
  segment?: { startMs: number; endMs: number };
  videoMeta?: { videoWidth: number; videoHeight: number };
  // New format (web) - full MotionAnalysisProcessResponse
  pose?: {
    framesProcessed: number;
    framesWithPose: number;
    detectionRate: number;
    durationSec: number;
    averageAngles: {
      leftKnee: number | null;
      rightKnee: number | null;
      leftHip: number | null;
      rightHip: number | null;
      leftElbow: number | null;
      rightElbow: number | null;
      leftShoulder: number | null;
      rightShoulder: number | null;
      leftAnkle: number | null;
      rightAnkle: number | null;
      torsoInclination: number | null;
    } | null;
  };
  skeletonFrames?: SkeletonFrame[];
  aiAnalysis?: AIAnalysis | null;
}

interface LiftAnalysisJson {
  durationMs?: number;
  fpsSample?: number;
  seedPoint?: { x: number; y: number };
  barPath?: BarPathPoint[];
  metrics?: {
    maxHorizontalDrift?: number;
    totalVerticalTravel?: number;
    averageSpeed?: number;
  };
  skeletonFrames?: SkeletonFrame[];
  pose?: {
    framesProcessed: number;
    framesWithPose: number;
    detectionRate: number;
    durationSec: number;
    averageAngles: PoseAngles | null;
  };
  aiAnalysis?: AIAnalysis | null;
}

interface AnalysisRecord {
  id: string;
  localId: string;
  label: string | null;
  videoUrl: string;
  createdAt: string;
  analysisJson: Record<string, unknown>;
}

interface AnalysesResponse {
  analyses: AnalysisRecord[];
}

// ── Skeleton edges (MoveNet topology) ────────────────────────────────────────

const SKELETON_EDGES: [string, string][] = [
  ["left_shoulder", "right_shoulder"],
  ["left_shoulder", "left_elbow"],
  ["left_elbow", "left_wrist"],
  ["right_shoulder", "right_elbow"],
  ["right_elbow", "right_wrist"],
  ["left_shoulder", "left_hip"],
  ["right_shoulder", "right_hip"],
  ["left_hip", "right_hip"],
  ["left_hip", "left_knee"],
  ["left_knee", "left_ankle"],
  ["right_hip", "right_knee"],
  ["right_knee", "right_ankle"],
];
const MIN_KP_SCORE = 0.2;

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDuration(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ── SVG Skeleton overlay ──────────────────────────────────────────────────────

function SkeletonOverlay({
  frame,
  width,
  height,
  left,
  top,
}: {
  frame: PoseFrame | null;
  width: number;
  height: number;
  left: number;
  top: number;
}) {
  if (!frame || width === 0 || height === 0) return null;

  const kpMap = new Map(frame.keypoints.map((kp) => [kp.name, kp]));

  const bones = SKELETON_EDGES.flatMap(([a, b], i) => {
    const ka = kpMap.get(a);
    const kb = kpMap.get(b);
    if (!ka || !kb || ka.score < MIN_KP_SCORE || kb.score < MIN_KP_SCORE)
      return [];
    return (
      <line
        key={i}
        x1={ka.x * width}
        y1={ka.y * height}
        x2={kb.x * width}
        y2={kb.y * height}
        stroke="#00FF88"
        strokeWidth={3}
        strokeLinecap="round"
        opacity={0.85}
      />
    );
  });

  const joints = frame.keypoints
    .filter((kp) => kp.score >= MIN_KP_SCORE)
    .map((kp, i) => (
      <circle
        key={i}
        cx={kp.x * width}
        cy={kp.y * height}
        r={4}
        fill="#FFFFFF"
        stroke="#00FF88"
        strokeWidth={1.5}
        opacity={0.9}
      />
    ));

  return (
    <svg
      width={width}
      height={height}
      style={{ position: "absolute", left, top, pointerEvents: "none" }}
    >
      {bones}
      {joints}
    </svg>
  );
}

// ── SVG Bar path overlay ──────────────────────────────────────────────────────

function BarPathOverlay({
  path,
  width,
  height,
  left,
  top,
  currentMs,
}: {
  path: BarPathPoint[];
  width: number;
  height: number;
  left: number;
  top: number;
  currentMs: number;
}) {
  if (path.length < 2 || width === 0 || height === 0) return null;

  const visible = path.filter((p) => p.t <= currentMs);
  if (visible.length < 2) return null;

  const points = visible.map((p) => `${p.x * width},${p.y * height}`).join(" ");
  const seed = path[0];
  const tip = visible[visible.length - 1];

  return (
    <svg
      width={width}
      height={height}
      style={{ position: "absolute", left, top, pointerEvents: "none" }}
    >
      <polyline
        points={points}
        fill="none"
        stroke="#00FF88"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.9}
      />
      <circle
        cx={seed.x * width}
        cy={seed.y * height}
        r={6}
        fill="#FFFFFF"
        stroke="#00FF88"
        strokeWidth={2}
      />
      <circle cx={tip.x * width} cy={tip.y * height} r={5} fill="#00FF88" />
    </svg>
  );
}

// ── Export button ─────────────────────────────────────────────────────────────

function ExportButton({ videoUrl }: { videoUrl: string }) {
  return (
    <a
      href={videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      download
      className="inline-flex h-8 items-center gap-1.5 rounded-md border px-2 text-xs font-medium text-white/80 hover:bg-white/10 sm:px-3"
    >
      <Download className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Exportar vídeo</span>
    </a>
  );
}

// ── Skeleton Playback Hook ────────────────────────────────────────────────────

/**
 * Manages play/pause/seek state for skeleton playback.
 *
 * Key insight: the Skeleton3DViewer reads videoRef.current.currentTime
 * directly in its Three.js useFrame loop at 60fps. So we simply
 * play/pause the (hidden) video element — no requestAnimationFrame
 * or React state frame advancement needed.
 */
function useSkeletonPlayback({
  videoRef,
  totalFrames,
  durationSec,
  setCurrentFrameIndex,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  totalFrames: number;
  durationSec: number;
  setCurrentFrameIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Sync isPlaying state from video element events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentFrameIndex(0);
    };
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
    };
  }, [setCurrentFrameIndex, videoRef]);

  // Keep slider position in sync while playing (low-frequency update)
  useEffect(() => {
    if (!isPlaying) return;
    const video = videoRef.current;
    if (!video) return;
    const interval = setInterval(() => {
      const dur = video.duration || durationSec;
      if (dur > 0 && totalFrames > 0) {
        const idx = Math.min(
          Math.floor((video.currentTime / dur) * totalFrames),
          totalFrames - 1
        );
        setCurrentFrameIndex(idx);
      }
    }, 250); // 4 updates/sec is plenty for the slider
    return () => clearInterval(interval);
  }, [isPlaying, totalFrames, durationSec, setCurrentFrameIndex, videoRef]);

  const handlePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }, [videoRef]);

  const handleReset = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.pause();
    }
    setIsPlaying(false);
    setCurrentFrameIndex(0);
  }, [setCurrentFrameIndex, videoRef]);

  const handleFrameSlider = useCallback(
    (value: number[]) => {
      const frameIndex = value[0];
      setCurrentFrameIndex(frameIndex);
      const video = videoRef.current;
      if (video && totalFrames > 0) {
        const dur = video.duration || durationSec;
        video.currentTime = (frameIndex / totalFrames) * dur;
      }
    },
    [totalFrames, durationSec, setCurrentFrameIndex, videoRef]
  );

  const handleStepFrame = useCallback(
    (value: -1 | 1) => {
      const video = videoRef.current;
      if (video) video.pause();
      setIsPlaying(false);
      setCurrentFrameIndex((prev) => {
        const next = Math.max(0, Math.min(prev + value, totalFrames - 1));
        if (video && totalFrames > 0) {
          const dur = video.duration || durationSec;
          video.currentTime = (next / totalFrames) * dur;
        }
        return next;
      });
    },
    [totalFrames, durationSec, setCurrentFrameIndex, videoRef]
  );

  return {
    isPlaying,
    handlePlayPause,
    handleReset,
    handleFrameSlider,
    handleStepFrame,
  };
}

// ── Skeleton Playback Controls UI ─────────────────────────────────────────────

function SkeletonPlaybackControls({
  isPlaying,
  currentFrameIndex,
  totalFrames,
  onPlayPause,
  onReset,
  onFrameSlider,
  onStepFrame,
}: {
  isPlaying: boolean;
  currentFrameIndex: number;
  totalFrames: number;
  onPlayPause: () => void;
  onReset: () => void;
  onFrameSlider: (value: number[]) => void;
  onStepFrame: (direction: -1 | 1) => void;
}) {
  return (
    <div className="flex flex-col gap-2 border-t bg-muted/30 px-4 py-3">
      {/* Frame slider */}
      {totalFrames > 1 && (
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onStepFrame(-1)}
            disabled={currentFrameIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Slider
            value={[currentFrameIndex]}
            min={0}
            max={totalFrames - 1}
            step={1}
            onValueChange={onFrameSlider}
            className="flex-1"
          />

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onStepFrame(1)}
            disabled={currentFrameIndex >= totalFrames - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <span className="min-w-[80px] text-right text-xs text-muted-foreground">
            {currentFrameIndex + 1} / {totalFrames}
          </span>
        </div>
      )}

      {/* Play controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPlayPause}
          className="gap-1.5"
        >
          {isPlaying ? (
            <Pause className="h-3.5 w-3.5" />
          ) : (
            <Play className="h-3.5 w-3.5" />
          )}
          {isPlaying ? "Pausar" : "Reproduzir"}
        </Button>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ── AI Analysis Panel (shared by both modals) ────────────────────────────────

/** Circular score gauge */
function ScoreRing({
  score,
  size = 64,
  stroke = 5,
}: {
  score: number;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;
  const color =
    score >= 8
      ? "text-emerald-500"
      : score >= 6
        ? "text-amber-500"
        : "text-red-500";
  const bgColor =
    score >= 8
      ? "stroke-emerald-500/15"
      : score >= 6
        ? "stroke-amber-500/15"
        : "stroke-red-500/15";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className={bgColor}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className={`${color} transition-all duration-700`}
          style={{ stroke: "currentColor" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-lg font-bold tabular-nums ${color}`}>
          {score}
        </span>
        <span className="text-[8px] font-medium uppercase tracking-wider text-muted-foreground">
          /10
        </span>
      </div>
    </div>
  );
}

function AIAnalysisPanel({ ai }: { ai: AIAnalysis }) {
  const t = useTranslations("profile");

  return (
    <div className="border-t">
      {/* ── Header with gradient ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-violet-500/10 via-purple-500/5 to-transparent px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 sm:h-9 sm:w-9">
          <Sparkles className="sm:h-4.5 sm:w-4.5 h-4 w-4 text-violet-500" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-xs font-semibold tracking-tight sm:text-sm">
            {t("analyses.ai.title")}
          </h3>
          {ai.exercise && (
            <p className="truncate text-[10px] text-muted-foreground sm:text-xs">
              {ai.exercise}
            </p>
          )}
        </div>
        {ai.overallScore !== null && ai.overallScore !== undefined && (
          <ScoreRing score={ai.overallScore} />
        )}
      </div>

      <div className="space-y-3 px-4 pb-4 pt-3 sm:space-y-4 sm:px-6 sm:pb-6 sm:pt-4">
        {/* ── Quick stats row ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
          {ai.totalReps !== null && ai.totalReps !== undefined && (
            <div className="flex items-center gap-2.5 rounded-lg border bg-card/50 px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5">
              <Repeat className="h-3.5 w-3.5 shrink-0 text-muted-foreground sm:h-4 sm:w-4" />
              <div>
                <p className="text-xs font-semibold tabular-nums">
                  {ai.totalReps}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {t("analyses.ai.reps")}
                </p>
              </div>
            </div>
          )}
          {ai.durationSec !== null && ai.durationSec !== undefined && (
            <div className="flex items-center gap-2.5 rounded-lg border bg-card/50 px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5">
              <Timer className="h-3.5 w-3.5 shrink-0 text-muted-foreground sm:h-4 sm:w-4" />
              <div>
                <p className="text-xs font-semibold tabular-nums">
                  {ai.durationSec.toFixed(1)}s
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {t("analyses.ai.duration")}
                </p>
              </div>
            </div>
          )}
          {ai.tempoAvgSec !== null && ai.tempoAvgSec !== undefined && (
            <div className="flex items-center gap-2.5 rounded-lg border bg-card/50 px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5">
              <Target className="h-3.5 w-3.5 shrink-0 text-muted-foreground sm:h-4 sm:w-4" />
              <div>
                <p className="text-xs font-semibold tabular-nums">
                  {ai.tempoAvgSec.toFixed(1)}s
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {t("analyses.ai.tempo")}
                </p>
              </div>
            </div>
          )}
          {ai.confidence !== null && ai.confidence !== undefined && (
            <div className="flex items-center gap-2.5 rounded-lg border bg-card/50 px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5">
              <TrendingUp className="h-3.5 w-3.5 shrink-0 text-muted-foreground sm:h-4 sm:w-4" />
              <div>
                <p className="text-xs font-semibold tabular-nums">
                  {(ai.confidence * 100).toFixed(0)}%
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {t("analyses.ai.confidence")}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Overall notes ────────────────────────────────────────────── */}
        {ai.overallNotes && (
          <p className="rounded-lg bg-muted/30 px-3 py-2.5 text-xs leading-relaxed text-foreground/80 sm:px-4 sm:py-3 sm:text-[13px]">
            {ai.overallNotes}
          </p>
        )}

        {/* ── Strengths / Improvements — side-by-side cards ──────────── */}
        <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
          {ai.strengths && ai.strengths.length > 0 && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 sm:p-4">
              <div className="mb-2.5 flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <h4 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {t("analyses.ai.strengths")}
                </h4>
              </div>
              <ul className="space-y-2">
                {ai.strengths.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs leading-relaxed text-foreground/70"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {ai.improvements && ai.improvements.length > 0 && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 sm:p-4">
              <div className="mb-2.5 flex items-center gap-2">
                <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                <h4 className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                  {t("analyses.ai.improvements")}
                </h4>
              </div>
              <ul className="space-y-2">
                {ai.improvements.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs leading-relaxed text-foreground/70"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Safety flags — full width */}
        {ai.safetyFlags && ai.safetyFlags.length > 0 && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 sm:p-4">
            <div className="mb-2.5 flex items-center gap-2">
              <ShieldAlert className="h-3.5 w-3.5 text-red-500" />
              <h4 className="text-xs font-semibold text-red-600 dark:text-red-400">
                {t("analyses.ai.safetyFlags")}
              </h4>
            </div>
            <ul className="space-y-2">
              {ai.safetyFlags.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-xs leading-relaxed text-foreground/70"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-500" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Per-rep breakdown ─────────────────────────────────────────── */}
        {ai.reps && ai.reps.length > 0 && (
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold">
              <Activity className="h-3.5 w-3.5 text-muted-foreground" />
              {t("analyses.ai.repBreakdown")}
            </h4>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-2.5 lg:grid-cols-3">
              {ai.reps.map((rep) => {
                const scoreColor =
                  rep.formScore !== null && rep.formScore !== undefined
                    ? rep.formScore >= 8
                      ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                      : rep.formScore >= 6
                        ? "text-amber-500 bg-amber-500/10 border-amber-500/20"
                        : "text-red-500 bg-red-500/10 border-red-500/20"
                    : "";

                return (
                  <div
                    key={rep.repNumber}
                    className="rounded-lg border bg-card/50 p-2.5 sm:p-3.5"
                  >
                    <div className="mb-1.5 flex items-center justify-between sm:mb-2">
                      <span className="text-[11px] font-semibold sm:text-xs">
                        {t("analyses.ai.rep")} {rep.repNumber}
                      </span>
                      {rep.formScore !== null &&
                        rep.formScore !== undefined && (
                          <span
                            className={`rounded-md border px-2 py-0.5 text-[10px] font-bold tabular-nums ${scoreColor}`}
                          >
                            {rep.formScore}/10
                          </span>
                        )}
                    </div>
                    {rep.romDegrees !== null &&
                      rep.romDegrees !== undefined && (
                        <div className="mb-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <span className="font-medium">ROM</span>
                          <span className="tabular-nums">
                            {rep.romDegrees.toFixed(0)}°
                          </span>
                        </div>
                      )}
                    {rep.notes && rep.notes.length > 0 && (
                      <ul className="space-y-1">
                        {rep.notes.map((note, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-[11px] leading-snug text-muted-foreground"
                          >
                            <span className="mt-[5px] h-0.5 w-0.5 shrink-0 rounded-full bg-muted-foreground/50" />
                            {note}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Motion Video Modal ────────────────────────────────────────────────────────

type ViewMode = "video" | "skeleton" | "split";

function MotionVideoModal({
  record,
  onClose,
}: {
  record: AnalysisRecord | null;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSize, setVideoSize] = useState({ w: 0, h: 0, left: 0, top: 0 });
  const [currentMs, setCurrentMs] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("video");
  const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);

  const json = record?.analysisJson as MotionAnalysisJson | undefined;

  // Support both old (poseFrames) and new (skeletonFrames) formats
  const poseFrames = json?.poseFrames ?? [];
  const skeletonFrames = useMemo(
    () => json?.skeletonFrames ?? [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [record?.id]
  );
  const hasSkeletonData = skeletonFrames.length > 0;

  // Get metrics from either new or old format
  const legacyMetrics = json?.metrics ?? {};
  const newPose = json?.pose;
  const averageAngles = newPose?.averageAngles;

  const segmentStartMs = json?.segment?.startMs ?? 0;
  const frameCount = hasSkeletonData
    ? skeletonFrames.length
    : poseFrames.length;
  const durationMs = json?.segment
    ? json.segment.endMs - json.segment.startMs
    : newPose?.durationSec
      ? newPose.durationSec * 1000
      : null;

  // Count frames with actual skeleton data
  const framesWithData = useMemo(
    () => skeletonFrames.filter((f) => f.landmarks.length > 0).length,
    [skeletonFrames]
  );

  // Use the server-side video proxy to avoid CORS/range-request issues with B2
  useEffect(() => {
    if (!record?.videoUrl) {
      setVideoBlobUrl(null);
      setVideoLoading(false);
      return;
    }

    const proxyUrl = `/api/video-proxy?url=${encodeURIComponent(record.videoUrl)}`;
    setVideoBlobUrl(proxyUrl);
    setVideoLoading(false);
  }, [record?.videoUrl]);

  // Cleanup blob URL on unmount or record change
  useEffect(() => {
    return () => {
      if (videoBlobUrl && videoBlobUrl.startsWith("blob:")) {
        URL.revokeObjectURL(videoBlobUrl);
      }
    };
  }, [videoBlobUrl]);

  // Reset on open
  useEffect(() => {
    if (record) {
      setCurrentMs(0);
      setCurrentFrameIndex(0);
      // Auto-select view mode based on data
      setViewMode(hasSkeletonData ? "split" : "video");
    }
  }, [record, hasSkeletonData]);

  // Compute the actual rendered video frame rect inside the letterboxed element.
  const updateVideoSize = useCallback(() => {
    const el = videoRef.current;
    if (!el || !el.videoWidth || !el.videoHeight) return;
    const elW = el.clientWidth;
    const elH = el.clientHeight;
    const intrinsicRatio = el.videoWidth / el.videoHeight;
    const elRatio = elW / elH;
    let rendW: number, rendH: number;
    if (intrinsicRatio > elRatio) {
      rendW = elW;
      rendH = elW / intrinsicRatio;
    } else {
      rendH = elH;
      rendW = elH * intrinsicRatio;
    }
    const left = (elW - rendW) / 2;
    const top = (elH - rendH) / 2;
    setVideoSize({ w: rendW, h: rendH, left, top });
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateVideoSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateVideoSize, record]);

  // Sync skeleton frame to video time
  const handleTimeUpdate = useCallback(
    (currentTime: number) => {
      setCurrentMs(currentTime);
      if (hasSkeletonData && durationMs) {
        const fps = frameCount / (durationMs / 1000);
        const frameIdx = Math.min(
          Math.floor(currentTime * fps),
          frameCount - 1
        );
        setCurrentFrameIndex(Math.max(0, frameIdx));
      }
    },
    [hasSkeletonData, durationMs, frameCount]
  );

  // Debug: log video errors
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onError = () => {
      const err = video.error;
      console.error(
        "[MotionVideoModal] Video error:",
        err?.code,
        err?.message,
        "src:",
        video.src
      );
    };
    const onLoadedData = () => {
      console.log(
        "[MotionVideoModal] Video loaded — duration:",
        video.duration,
        "readyState:",
        video.readyState
      );
    };
    const onStalled = () => {
      console.warn("[MotionVideoModal] Video stalled");
    };

    video.addEventListener("error", onError);
    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("stalled", onStalled);
    return () => {
      video.removeEventListener("error", onError);
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("stalled", onStalled);
    };
  }, [record]);

  const absoluteMs = segmentStartMs + currentMs * 1000;

  // For legacy overlay (old format)
  const frame =
    poseFrames.length > 0
      ? poseFrames.reduce((best, f) =>
          Math.abs(f.t - absoluteMs) < Math.abs(best.t - absoluteMs) ? f : best
        )
      : null;

  const title = record?.label ?? "Análise de Movimento";
  const createdAt = record ? formatDate(record.createdAt) : "";

  const {
    isPlaying: skeletonIsPlaying,
    handlePlayPause: skeletonPlayPause,
    handleReset: skeletonReset,
    handleFrameSlider: skeletonFrameSlider,
    handleStepFrame: skeletonStepFrame,
  } = useSkeletonPlayback({
    videoRef,
    totalFrames: skeletonFrames.length,
    durationSec: durationMs ? durationMs / 1000 : 0,
    setCurrentFrameIndex,
  });

  return (
    <Dialog open={!!record} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={`max-h-[100dvh] gap-0 overflow-y-auto rounded-none border-0 p-0 sm:max-h-[90vh] sm:rounded-lg sm:border [&>button]:z-10 [&>button]:text-white [&>button]:hover:text-white/80 ${
          viewMode === "split" ? "max-w-5xl" : "max-w-2xl"
        }`}
      >
        {/* Dark header */}
        <div className="sticky top-0 z-10 flex items-start gap-2 bg-black px-3 py-3 sm:gap-3 sm:px-5 sm:py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 sm:h-9 sm:w-9">
            <Activity className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
          </div>
          <DialogHeader className="min-w-0 flex-1 space-y-0.5 text-left">
            <DialogTitle className="truncate text-sm text-white sm:text-base">
              {title}
            </DialogTitle>
            <DialogDescription className="flex flex-wrap items-center gap-1 text-[10px] text-white/50 sm:gap-1.5 sm:text-xs">
              <CalendarDays className="h-3 w-3" />
              {createdAt}
              {durationMs !== null && (
                <>
                  <span className="text-white/30">·</span>
                  <Clock className="h-3 w-3" />
                  {formatDuration(durationMs)}
                </>
              )}
              {frameCount > 0 && (
                <>
                  <span className="text-white/30">·</span>
                  {frameCount} frames
                </>
              )}
              {newPose && (
                <>
                  <span className="text-white/30">·</span>
                  {newPose.detectionRate.toFixed(0)}% deteção
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* View mode toggle - only show if 3D data available */}
          {hasSkeletonData && (
            <div className="flex gap-0.5 rounded-lg border border-white/20 bg-white/5 p-0.5 sm:gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={`h-7 w-7 p-0 ${viewMode === "video" ? "bg-white/20" : "hover:bg-white/10"}`}
                onClick={() => setViewMode("video")}
                title="Vídeo"
              >
                <Video className="h-3.5 w-3.5 text-white" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-7 w-7 p-0 ${viewMode === "split" ? "bg-white/20" : "hover:bg-white/10"}`}
                onClick={() => setViewMode("split")}
                title="Vídeo + 3D"
              >
                <Activity className="h-3.5 w-3.5 text-white" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-7 w-7 p-0 ${viewMode === "skeleton" ? "bg-white/20" : "hover:bg-white/10"}`}
                onClick={() => setViewMode("skeleton")}
                title="Esqueleto 3D"
              >
                <Box className="h-3.5 w-3.5 text-white" />
              </Button>
            </div>
          )}

          <div className="shrink-0 pr-6">
            {record && <ExportButton videoUrl={record.videoUrl} />}
          </div>
        </div>

        {/* Main content area */}
        <div
          className={`grid gap-0 bg-black ${
            viewMode === "split" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {/* Video panel - always mounted to avoid reload on mode switch */}
          <div
            className={`relative flex w-full items-center justify-center bg-black ${
              viewMode === "skeleton"
                ? "hidden"
                : "min-h-[150px] sm:min-h-[200px]"
            }`}
          >
            {record && videoLoading && (
              <div className="flex flex-col items-center gap-2 py-12">
                <Loader2 className="h-8 w-8 animate-spin text-white/50" />
                <p className="text-xs text-white/40">A carregar vídeo…</p>
              </div>
            )}
            {record && videoBlobUrl && !videoLoading && (
              <>
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  ref={videoRef}
                  key={record.id}
                  src={videoBlobUrl}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[70vh] min-h-[150px] w-full object-contain sm:max-h-[50vh] sm:min-h-[200px]"
                  onLoadedMetadata={updateVideoSize}
                  onTimeUpdate={(e) =>
                    handleTimeUpdate(e.currentTarget.currentTime)
                  }
                />
                {/* Legacy skeleton overlay for old format */}
                {!hasSkeletonData && viewMode !== "skeleton" && (
                  <SkeletonOverlay
                    frame={frame}
                    width={videoSize.w}
                    height={videoSize.h}
                    left={videoSize.left}
                    top={videoSize.top}
                  />
                )}
              </>
            )}
          </div>

          {/* 3D Skeleton panel */}
          {viewMode !== "video" && framesWithData > 0 && (
            <div className="flex items-center justify-center bg-muted/5 p-2">
              <Skeleton3DViewer
                frames={skeletonFrames}
                currentFrameIndex={currentFrameIndex}
                videoRef={videoRef}
                fps={
                  durationMs && durationMs > 0
                    ? frameCount / (durationMs / 1000)
                    : 25
                }
                height={viewMode === "skeleton" ? 500 : 400}
                className="w-full overflow-hidden rounded-lg border"
              />
            </div>
          )}

          {/* No skeleton data fallback */}
          {viewMode !== "video" && framesWithData === 0 && (
            <div className="flex h-[300px] items-center justify-center bg-muted/10 text-sm text-muted-foreground">
              Sem dados de esqueleto 3D disponíveis
            </div>
          )}
        </div>

        {/* Skeleton playback controls — shown when video is hidden */}
        {viewMode === "skeleton" && framesWithData > 0 && (
          <SkeletonPlaybackControls
            isPlaying={skeletonIsPlaying}
            currentFrameIndex={currentFrameIndex}
            totalFrames={skeletonFrames.length}
            onPlayPause={skeletonPlayPause}
            onReset={skeletonReset}
            onFrameSlider={skeletonFrameSlider}
            onStepFrame={skeletonStepFrame}
          />
        )}

        {/* Metrics footer - support both old and new formats */}
        {(legacyMetrics.kneeFlexionDeg !== undefined ||
          legacyMetrics.torsoRangeDeg !== undefined ||
          averageAngles) && (
          <div className="grid grid-cols-2 divide-x border-t bg-muted/30 sm:grid-cols-4">
            {/* Legacy format metrics */}
            {legacyMetrics.kneeFlexionDeg !== undefined && (
              <div className="flex flex-col items-center gap-0.5 px-2 py-2.5 sm:px-4 sm:py-3">
                <p className="text-center text-[9px] uppercase tracking-wide text-muted-foreground sm:text-[10px]">
                  Flexão do Joelho
                </p>
                <p className="text-lg font-bold tabular-nums sm:text-xl">
                  {legacyMetrics.kneeFlexionDeg.toFixed(1)}°
                </p>
              </div>
            )}
            {legacyMetrics.torsoRangeDeg !== undefined && (
              <div className="flex flex-col items-center gap-0.5 px-2 py-2.5 sm:px-4 sm:py-3">
                <p className="text-center text-[9px] uppercase tracking-wide text-muted-foreground sm:text-[10px]">
                  Amplitude do Tronco
                </p>
                <p className="text-lg font-bold tabular-nums sm:text-xl">
                  {legacyMetrics.torsoRangeDeg.toFixed(1)}°
                </p>
              </div>
            )}
            {/* New format metrics */}
            {averageAngles && (
              <>
                {averageAngles.leftKnee !== null && (
                  <div className="flex flex-col items-center gap-0.5 px-2 py-2.5 sm:px-4 sm:py-3">
                    <p className="text-center text-[9px] uppercase tracking-wide text-muted-foreground sm:text-[10px]">
                      Joelho E
                    </p>
                    <p className="text-lg font-bold tabular-nums sm:text-xl">
                      {averageAngles.leftKnee.toFixed(1)}°
                    </p>
                  </div>
                )}
                {averageAngles.rightKnee !== null && (
                  <div className="flex flex-col items-center gap-0.5 px-2 py-2.5 sm:px-4 sm:py-3">
                    <p className="text-center text-[9px] uppercase tracking-wide text-muted-foreground sm:text-[10px]">
                      Joelho D
                    </p>
                    <p className="text-lg font-bold tabular-nums sm:text-xl">
                      {averageAngles.rightKnee.toFixed(1)}°
                    </p>
                  </div>
                )}
                {averageAngles.torsoInclination !== null && (
                  <div className="flex flex-col items-center gap-0.5 px-2 py-2.5 sm:px-4 sm:py-3">
                    <p className="text-center text-[9px] uppercase tracking-wide text-muted-foreground sm:text-[10px]">
                      Tronco
                    </p>
                    <p className="text-lg font-bold tabular-nums sm:text-xl">
                      {averageAngles.torsoInclination.toFixed(1)}°
                    </p>
                  </div>
                )}
                {averageAngles.leftHip !== null && (
                  <div className="flex flex-col items-center gap-0.5 px-2 py-2.5 sm:px-4 sm:py-3">
                    <p className="text-center text-[9px] uppercase tracking-wide text-muted-foreground sm:text-[10px]">
                      Anca E
                    </p>
                    <p className="text-lg font-bold tabular-nums sm:text-xl">
                      {averageAngles.leftHip.toFixed(1)}°
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* AI Analysis section */}
        {json?.aiAnalysis && <AIAnalysisPanel ai={json.aiAnalysis} />}
      </DialogContent>
    </Dialog>
  );
}

// ── Lift Video Modal ──────────────────────────────────────────────────────────

function LiftVideoModal({
  record,
  onClose,
}: {
  record: AnalysisRecord | null;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSize, setVideoSize] = useState({ w: 0, h: 0, left: 0, top: 0 });
  const [currentMs, setCurrentMs] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("video");
  const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);

  const json = record?.analysisJson as LiftAnalysisJson | undefined;
  const barPath = json?.barPath ?? [];
  const durationMs = json?.durationMs;
  const metrics = json?.metrics ?? {};

  // Skeleton 3D data
  const skeletonFrames = useMemo(
    () => json?.skeletonFrames ?? [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [record?.id]
  );
  const hasSkeletonData = skeletonFrames.length > 0;
  const poseData = json?.pose;

  const framesWithData = useMemo(
    () => skeletonFrames.filter((f) => f.landmarks.length > 0).length,
    [skeletonFrames]
  );

  // Fetch video as blob to avoid B2 range-request/moov-atom issues
  useEffect(() => {
    if (!record?.videoUrl) {
      setVideoBlobUrl(null);
      setVideoLoading(false);
      return;
    }

    const proxyUrl = `/api/video-proxy?url=${encodeURIComponent(record.videoUrl)}`;
    setVideoBlobUrl(proxyUrl);
    setVideoLoading(false);
  }, [record?.videoUrl]);

  // Cleanup blob URL on unmount or record change
  useEffect(() => {
    return () => {
      if (videoBlobUrl && videoBlobUrl.startsWith("blob:")) {
        URL.revokeObjectURL(videoBlobUrl);
      }
    };
  }, [videoBlobUrl]);

  // Reset on open
  useEffect(() => {
    if (record) {
      setCurrentMs(0);
      setCurrentFrameIndex(0);
      setViewMode(hasSkeletonData ? "split" : "video");
    }
  }, [record, hasSkeletonData]);

  // Compute the actual rendered video frame rect inside the letterboxed element.
  const updateVideoSize = useCallback(() => {
    const el = videoRef.current;
    if (!el || !el.videoWidth || !el.videoHeight) return;
    const elW = el.clientWidth;
    const elH = el.clientHeight;
    const intrinsicRatio = el.videoWidth / el.videoHeight;
    const elRatio = elW / elH;
    let rendW: number, rendH: number;
    if (intrinsicRatio > elRatio) {
      rendW = elW;
      rendH = elW / intrinsicRatio;
    } else {
      rendH = elH;
      rendW = elH * intrinsicRatio;
    }
    const left = (elW - rendW) / 2;
    const top = (elH - rendH) / 2;
    setVideoSize({ w: rendW, h: rendH, left, top });
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateVideoSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateVideoSize, record]);

  const handleTimeUpdate = useCallback(
    (time: number) => {
      setCurrentMs(time * 1000);
      if (skeletonFrames.length > 0) {
        const totalDuration =
          poseData?.durationSec ?? (durationMs ? durationMs / 1000 : 0);
        if (totalDuration > 0) {
          const progress = time / totalDuration;
          const idx = Math.min(
            Math.floor(progress * skeletonFrames.length),
            skeletonFrames.length - 1
          );
          setCurrentFrameIndex(idx);
        }
      }
    },
    [skeletonFrames.length, poseData?.durationSec, durationMs]
  );

  const title = record?.label ?? "Análise de Levantamento";
  const createdAt = record ? formatDate(record.createdAt) : "";

  const hasMetrics = Object.values(metrics).some((v) => v !== undefined);

  const liftDurationSec =
    poseData?.durationSec ?? (durationMs ? durationMs / 1000 : 0);
  const {
    isPlaying: liftIsPlaying,
    handlePlayPause: liftPlayPause,
    handleReset: liftReset,
    handleFrameSlider: liftFrameSlider,
    handleStepFrame: liftStepFrame,
  } = useSkeletonPlayback({
    videoRef,
    totalFrames: skeletonFrames.length,
    durationSec: liftDurationSec,
    setCurrentFrameIndex,
  });

  return (
    <Dialog open={!!record} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={`max-h-[100dvh] gap-0 overflow-y-auto rounded-none border-0 p-0 sm:max-h-[90vh] sm:rounded-lg sm:border [&>button]:z-10 [&>button]:text-white [&>button]:hover:text-white/80 ${
          viewMode === "split" ? "max-w-5xl" : "max-w-2xl"
        }`}
      >
        {/* Dark header */}
        <div className="sticky top-0 z-10 flex items-start gap-2 bg-black px-3 py-3 sm:gap-3 sm:px-5 sm:py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 sm:h-9 sm:w-9">
            <Dumbbell className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
          </div>
          <DialogHeader className="min-w-0 flex-1 space-y-0.5 text-left">
            <DialogTitle className="truncate text-sm text-white sm:text-base">
              {title}
            </DialogTitle>
            <DialogDescription className="flex flex-wrap items-center gap-1 text-[10px] text-white/50 sm:gap-1.5 sm:text-xs">
              <CalendarDays className="h-3 w-3" />
              {createdAt}
              {durationMs !== undefined && (
                <>
                  <span className="text-white/30">·</span>
                  <Clock className="h-3 w-3" />
                  {formatDuration(durationMs)}
                </>
              )}
              {poseData && (
                <>
                  <span className="text-white/30">·</span>
                  {poseData.framesProcessed} frames
                  <span className="text-white/30">·</span>
                  {poseData.detectionRate.toFixed(0)}% deteção
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* View mode toggle - only show if 3D data available */}
          {hasSkeletonData && (
            <div className="flex gap-0.5 rounded-lg border border-white/20 bg-white/5 p-0.5 sm:gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={`h-7 w-7 p-0 ${viewMode === "video" ? "bg-white/20" : "hover:bg-white/10"}`}
                onClick={() => setViewMode("video")}
                title="Vídeo"
              >
                <Video className="h-3.5 w-3.5 text-white" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-7 w-7 p-0 ${viewMode === "split" ? "bg-white/20" : "hover:bg-white/10"}`}
                onClick={() => setViewMode("split")}
                title="Vídeo + 3D"
              >
                <Dumbbell className="h-3.5 w-3.5 text-white" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-7 w-7 p-0 ${viewMode === "skeleton" ? "bg-white/20" : "hover:bg-white/10"}`}
                onClick={() => setViewMode("skeleton")}
                title="Esqueleto 3D"
              >
                <Box className="h-3.5 w-3.5 text-white" />
              </Button>
            </div>
          )}

          <div className="shrink-0 pr-6">
            {record && <ExportButton videoUrl={record.videoUrl} />}
          </div>
        </div>

        {/* Main content area */}
        <div
          className={`grid gap-0 bg-black ${
            viewMode === "split" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {/* Video panel - always mounted to avoid reload on mode switch */}
          <div
            className={`relative flex w-full items-center justify-center bg-black ${
              viewMode === "skeleton"
                ? "hidden"
                : "min-h-[150px] sm:min-h-[200px]"
            }`}
          >
            {record && videoLoading && (
              <div className="flex flex-col items-center gap-2 py-12">
                <Loader2 className="h-8 w-8 animate-spin text-white/50" />
                <p className="text-xs text-white/40">A carregar vídeo…</p>
              </div>
            )}
            {record && videoBlobUrl && !videoLoading && (
              <>
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  ref={videoRef}
                  key={record.id}
                  src={videoBlobUrl}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[70vh] min-h-[150px] w-full object-contain sm:max-h-[50vh] sm:min-h-[200px]"
                  onLoadedMetadata={updateVideoSize}
                  onTimeUpdate={(e) =>
                    handleTimeUpdate(e.currentTarget.currentTime)
                  }
                />
                <BarPathOverlay
                  path={barPath}
                  width={videoSize.w}
                  height={videoSize.h}
                  left={videoSize.left}
                  top={videoSize.top}
                  currentMs={currentMs}
                />
              </>
            )}
          </div>

          {/* 3D Skeleton panel */}
          {viewMode !== "video" && framesWithData > 0 && (
            <div className="flex items-center justify-center bg-muted/5 p-2">
              <Skeleton3DViewer
                frames={skeletonFrames}
                currentFrameIndex={currentFrameIndex}
                videoRef={videoRef}
                fps={
                  poseData?.durationSec && poseData.durationSec > 0
                    ? skeletonFrames.length / poseData.durationSec
                    : 25
                }
                height={viewMode === "skeleton" ? 500 : 400}
                className="w-full overflow-hidden rounded-lg border"
              />
            </div>
          )}

          {/* No skeleton data fallback */}
          {viewMode !== "video" && framesWithData === 0 && (
            <div className="flex h-[300px] items-center justify-center bg-muted/10 text-sm text-muted-foreground">
              Sem dados de esqueleto 3D disponíveis
            </div>
          )}
        </div>

        {/* Skeleton playback controls — shown when video is hidden */}
        {viewMode === "skeleton" && framesWithData > 0 && (
          <SkeletonPlaybackControls
            isPlaying={liftIsPlaying}
            currentFrameIndex={currentFrameIndex}
            totalFrames={skeletonFrames.length}
            onPlayPause={liftPlayPause}
            onReset={liftReset}
            onFrameSlider={liftFrameSlider}
            onStepFrame={liftStepFrame}
          />
        )}

        {/* Metrics footer */}
        {hasMetrics && (
          <div
            className="grid divide-x border-t bg-muted/30"
            style={{
              gridTemplateColumns: `repeat(${Object.values(metrics).filter((v) => v !== undefined).length}, minmax(0, 1fr))`,
            }}
          >
            {metrics.maxHorizontalDrift !== undefined && (
              <div className="flex flex-col items-center gap-0.5 px-2 py-2.5 sm:px-4 sm:py-4">
                <p className="text-center text-[9px] uppercase tracking-wide text-muted-foreground sm:text-[11px]">
                  Desvio Horizontal
                </p>
                <p className="text-lg font-bold tabular-nums sm:text-2xl">
                  {(metrics.maxHorizontalDrift * 100).toFixed(1)}
                  <span className="text-sm font-normal sm:text-base">%</span>
                </p>
              </div>
            )}
            {metrics.totalVerticalTravel !== undefined && (
              <div className="flex flex-col items-center gap-0.5 px-2 py-2.5 sm:px-4 sm:py-4">
                <p className="text-center text-[9px] uppercase tracking-wide text-muted-foreground sm:text-[11px]">
                  Viagem Vertical
                </p>
                <p className="text-lg font-bold tabular-nums sm:text-2xl">
                  {(metrics.totalVerticalTravel * 100).toFixed(1)}
                  <span className="text-sm font-normal sm:text-base">%</span>
                </p>
              </div>
            )}
            {metrics.averageSpeed !== undefined && (
              <div className="flex flex-col items-center gap-0.5 px-2 py-2.5 sm:px-4 sm:py-4">
                <p className="text-center text-[9px] uppercase tracking-wide text-muted-foreground sm:text-[11px]">
                  Velocidade Média
                </p>
                <p className="text-lg font-bold tabular-nums sm:text-2xl">
                  {metrics.averageSpeed.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* AI Analysis section */}
        {json?.aiAnalysis && <AIAnalysisPanel ai={json.aiAnalysis} />}
      </DialogContent>
    </Dialog>
  );
}

// ── Motion Card ───────────────────────────────────────────────────────────────

function MotionCard({
  record,
  onOpen,
  onDelete,
  t,
}: {
  record: AnalysisRecord;
  onOpen: () => void;
  onDelete: (id: string) => void;
  t: ReturnType<typeof useTranslations<"profile">>;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const json = record.analysisJson as MotionAnalysisJson;
  const durationMs = json.segment
    ? json.segment.endMs - json.segment.startMs
    : null;
  const frameCount = json.poseFrames?.length ?? 0;
  const metrics = json.metrics ?? {};
  const ai = json.aiAnalysis ?? null;

  console.log(`[MotionCard] id=${record.id}`, {
    hasAiAnalysis: !!ai,
    aiExercise: ai?.exercise ?? null,
    aiScore: ai?.overallScore ?? null,
  });

  const title = record.label ?? ai?.exercise ?? t("analyses.unlabeledMotion");

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/analyses/motion", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: record.id }),
      });
      if (res.ok) {
        onDelete(record.id);
      }
    } catch {
      // silently fail
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-3 rounded-xl border bg-card p-4">
      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{title}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3" />
              {formatDate(record.createdAt)}
            </p>
          </div>
          <div className="flex shrink-0 gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={onOpen}
              className="gap-1.5"
            >
              <Play className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {t("analyses.viewVideo")}
              </span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("analyses.deleteTitle")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("analyses.deleteConfirm")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {t("analyses.deleteCancel")}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {t("analyses.deleteAction")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        {durationMs !== null && (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            {formatDuration(durationMs)}
          </Badge>
        )}
        {frameCount > 0 && (
          <Badge variant="secondary">
            {frameCount} {t("analyses.frames")}
          </Badge>
        )}
      </div>

      {(metrics.kneeFlexionDeg !== undefined ||
        metrics.torsoRangeDeg !== undefined) && (
        <div className="grid grid-cols-2 gap-2">
          {metrics.kneeFlexionDeg !== undefined && (
            <div className="rounded-lg bg-muted/40 px-3 py-2 text-center">
              <p className="text-xs text-muted-foreground">
                {t("analyses.kneeFlexion")}
              </p>
              <p className="text-sm font-semibold">
                {metrics.kneeFlexionDeg.toFixed(1)}°
              </p>
            </div>
          )}
          {metrics.torsoRangeDeg !== undefined && (
            <div className="rounded-lg bg-muted/40 px-3 py-2 text-center">
              <p className="text-xs text-muted-foreground">
                {t("analyses.torsoRange")}
              </p>
              <p className="text-sm font-semibold">
                {metrics.torsoRangeDeg.toFixed(1)}°
              </p>
            </div>
          )}
        </div>
      )}

      {ai && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 text-xs">
            {ai.overallScore !== null && ai.overallScore !== undefined && (
              <Badge
                variant={ai.overallScore >= 7 ? "default" : "secondary"}
                className="gap-1"
              >
                ⭐ {t("analyses.ai.score")}: {ai.overallScore}/10
              </Badge>
            )}
            {ai.totalReps !== null && ai.totalReps !== undefined && (
              <Badge variant="outline" className="gap-1">
                🔁 {ai.totalReps} {t("analyses.ai.reps")}
              </Badge>
            )}
            {ai.confidence !== null && ai.confidence !== undefined && (
              <Badge variant="outline" className="gap-1 text-muted-foreground">
                {(ai.confidence * 100).toFixed(0)}%{" "}
                {t("analyses.ai.confidence")}
              </Badge>
            )}
          </div>
          {ai.overallNotes && (
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {ai.overallNotes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Lift Card ─────────────────────────────────────────────────────────────────

function LiftCard({
  record,
  onOpen,
  onDelete,
  t,
}: {
  record: AnalysisRecord;
  onOpen: () => void;
  onDelete: (id: string) => void;
  t: ReturnType<typeof useTranslations<"profile">>;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const json = record.analysisJson as LiftAnalysisJson;
  const durationMs = json.durationMs;
  const metrics = json.metrics ?? {};
  const ai = json.aiAnalysis ?? null;

  console.log(`[LiftCard] id=${record.id}`, {
    hasAiAnalysis: !!ai,
    aiExercise: ai?.exercise ?? null,
    aiScore: ai?.overallScore ?? null,
  });

  const title = record.label ?? ai?.exercise ?? t("analyses.unlabeledLift");

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/analyses/lift", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: record.id }),
      });
      if (res.ok) {
        onDelete(record.id);
      }
    } catch {
      // silently fail
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-3 rounded-xl border bg-card p-4">
      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{title}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3" />
              {formatDate(record.createdAt)}
            </p>
          </div>
          <div className="flex shrink-0 gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={onOpen}
              className="gap-1.5"
            >
              <Play className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {t("analyses.viewVideo")}
              </span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("analyses.deleteTitle")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("analyses.deleteConfirm")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {t("analyses.deleteCancel")}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {t("analyses.deleteAction")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {durationMs !== undefined && (
        <div>
          <Badge variant="secondary" className="gap-1 text-xs">
            <Clock className="h-3 w-3" />
            {formatDuration(durationMs)}
          </Badge>
        </div>
      )}

      {Object.values(metrics).some((v) => v !== undefined) && (
        <div className="grid grid-cols-3 gap-2">
          {metrics.maxHorizontalDrift !== undefined && (
            <div className="rounded-lg bg-muted/40 px-2 py-2 text-center">
              <p className="text-[10px] leading-tight text-muted-foreground">
                {t("analyses.maxDrift")}
              </p>
              <p className="mt-0.5 text-sm font-semibold">
                {(metrics.maxHorizontalDrift * 100).toFixed(1)}%
              </p>
            </div>
          )}
          {metrics.totalVerticalTravel !== undefined && (
            <div className="rounded-lg bg-muted/40 px-2 py-2 text-center">
              <p className="text-[10px] leading-tight text-muted-foreground">
                {t("analyses.verticalTravel")}
              </p>
              <p className="mt-0.5 text-sm font-semibold">
                {(metrics.totalVerticalTravel * 100).toFixed(1)}%
              </p>
            </div>
          )}
          {metrics.averageSpeed !== undefined && (
            <div className="rounded-lg bg-muted/40 px-2 py-2 text-center">
              <p className="text-[10px] leading-tight text-muted-foreground">
                {t("analyses.avgSpeed")}
              </p>
              <p className="mt-0.5 text-sm font-semibold">
                {metrics.averageSpeed.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      )}

      {ai && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 text-xs">
            {ai.overallScore !== null && ai.overallScore !== undefined && (
              <Badge
                variant={ai.overallScore >= 7 ? "default" : "secondary"}
                className="gap-1"
              >
                ⭐ {t("analyses.ai.score")}: {ai.overallScore}/10
              </Badge>
            )}
            {ai.totalReps !== null && ai.totalReps !== undefined && (
              <Badge variant="outline" className="gap-1">
                🔁 {ai.totalReps} {t("analyses.ai.reps")}
              </Badge>
            )}
            {ai.confidence !== null && ai.confidence !== undefined && (
              <Badge variant="outline" className="gap-1 text-muted-foreground">
                {(ai.confidence * 100).toFixed(0)}%{" "}
                {t("analyses.ai.confidence")}
              </Badge>
            )}
          </div>
          {ai.overallNotes && (
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {ai.overallNotes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function AnalysesSection() {
  const t = useTranslations("profile");

  const [motionAnalyses, setMotionAnalyses] = useState<AnalysisRecord[]>([]);
  const [liftAnalyses, setLiftAnalyses] = useState<AnalysisRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openMotion, setOpenMotion] = useState<AnalysisRecord | null>(null);
  const [openLift, setOpenLift] = useState<AnalysisRecord | null>(null);
  const [uploadType, setUploadType] = useState<"lift" | "motion" | null>(null);

  const fetchAnalyses = useCallback(async () => {
    setIsLoading(true);
    try {
      const [motionRes, liftRes] = await Promise.all([
        fetch("/api/analyses/motion"),
        fetch("/api/analyses/lift"),
      ]);
      if (motionRes.ok) {
        const data = (await motionRes.json()) as AnalysesResponse;
        setMotionAnalyses(data.analyses ?? []);
      }
      if (liftRes.ok) {
        const data = (await liftRes.json()) as AnalysesResponse;
        setLiftAnalyses(data.analyses ?? []);
      }
    } catch {
      // silently fail — user not logged in or network error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAnalyses();
  }, [fetchAnalyses]);

  const handleDeleteMotion = useCallback((id: string) => {
    setMotionAnalyses((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const handleDeleteLift = useCallback((id: string) => {
    setLiftAnalyses((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const totalCount = motionAnalyses.length + liftAnalyses.length;

  // Don't hide section completely even when empty - show empty state with call to action
  if (!isLoading && totalCount === 0) {
    return (
      <>
        <VideoAnalysisUpload
          type={uploadType ?? "motion"}
          open={uploadType !== null}
          onOpenChange={(open) => !open && setUploadType(null)}
          onSuccess={fetchAnalyses}
        />

        <div className="mt-12">
          <h2 className="mb-6 flex items-center justify-between gap-2 text-2xl font-bold">
            <span className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              {t("analyses.title")}
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setUploadType("motion")}
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Nova Análise Movimento
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setUploadType("lift")}
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Nova Análise Levantamento
              </Button>
            </div>
          </h2>

          <div className="rounded-lg border bg-card p-12 text-center text-card-foreground shadow-sm">
            <Activity className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="font-medium text-muted-foreground">
              {t("analyses.noAnalyses")}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("analyses.noAnalysesDesc")}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button onClick={() => setUploadType("motion")}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Análise Movimento
              </Button>
              <Button variant="outline" onClick={() => setUploadType("lift")}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Análise Levantamento
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <VideoAnalysisUpload
        type={uploadType ?? "motion"}
        open={uploadType !== null}
        onOpenChange={(open) => !open && setUploadType(null)}
        onSuccess={fetchAnalyses}
      />
      <MotionVideoModal
        record={openMotion}
        onClose={() => setOpenMotion(null)}
      />
      <LiftVideoModal record={openLift} onClose={() => setOpenLift(null)} />

      <div className="mt-12">
        <h2 className="mb-6 flex flex-col gap-3 text-2xl font-bold sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <span className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            {t("analyses.title")}
            {totalCount > 0 && (
              <span className="ml-1 text-base font-normal text-muted-foreground">
                ({totalCount})
              </span>
            )}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setUploadType("motion")}
              className="flex-1 sm:flex-initial"
            >
              <Activity className="mr-1.5 h-4 w-4 sm:mr-1.5" />
              <span className="sm:hidden">Movimento</span>
              <span className="hidden sm:inline">Nova Análise Movimento</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setUploadType("lift")}
              className="flex-1 sm:flex-initial"
            >
              <Dumbbell className="mr-1.5 h-4 w-4 sm:mr-1.5" />
              <span className="sm:hidden">Levantamento</span>
              <span className="hidden sm:inline">
                Nova Análise Levantamento
              </span>
            </Button>
          </div>
        </h2>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-xl border bg-muted/20"
              />
            ))}
          </div>
        ) : (
          /* Single card containing tabs + content */
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <Tabs defaultValue="motion">
              <TabsList className="mb-4 grid w-full grid-cols-2">
                <TabsTrigger
                  value="motion"
                  className="gap-1 px-1 text-xs sm:gap-2 sm:px-3 sm:text-sm"
                >
                  <Activity className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">
                    {t("analyses.motionTab")}
                  </span>
                  {motionAnalyses.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 px-1.5 text-xs"
                    >
                      {motionAnalyses.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="lift"
                  className="gap-1 px-1 text-xs sm:gap-2 sm:px-3 sm:text-sm"
                >
                  <Dumbbell className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">
                    {t("analyses.liftTab")}
                  </span>
                  {liftAnalyses.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 px-1.5 text-xs"
                    >
                      {liftAnalyses.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="motion" className="mt-0">
                {motionAnalyses.length === 0 ? (
                  <div className="py-10 text-center text-muted-foreground">
                    <Activity className="mx-auto mb-3 h-10 w-10 opacity-30" />
                    <p className="font-medium">{t("analyses.noAnalyses")}</p>
                    <p className="mt-1 text-sm">
                      {t("analyses.noAnalysesDesc")}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {motionAnalyses.map((record) => (
                      <MotionCard
                        key={record.id}
                        record={record}
                        onOpen={() => setOpenMotion(record)}
                        onDelete={handleDeleteMotion}
                        t={t}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="lift" className="mt-0">
                {liftAnalyses.length === 0 ? (
                  <div className="py-10 text-center text-muted-foreground">
                    <Dumbbell className="mx-auto mb-3 h-10 w-10 opacity-30" />
                    <p className="font-medium">{t("analyses.noAnalyses")}</p>
                    <p className="mt-1 text-sm">
                      {t("analyses.noAnalysesDesc")}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {liftAnalyses.map((record) => (
                      <LiftCard
                        key={record.id}
                        record={record}
                        onOpen={() => setOpenLift(record)}
                        onDelete={handleDeleteLift}
                        t={t}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </>
  );
}
