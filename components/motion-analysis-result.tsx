"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import {
  Play,
  Pause,
  RotateCcw,
  Video,
  Box,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import type { MotionAnalysisProcessResponse } from "@/types/lift-analysis";

// Dynamic import for Three.js component to prevent SSR issues
const Skeleton3DViewer = dynamic(
  () =>
    import("@/components/skeleton-3d-viewer").then(
      (mod) => mod.Skeleton3DViewer
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] items-center justify-center rounded-lg border bg-muted/10">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    ),
  }
);

// ── Error Boundary for 3D Viewer ─────────────────────────────────────────

import { Component, type ReactNode, type ErrorInfo } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

class Skeleton3DErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[Skeleton3DViewer] Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// ── Types ────────────────────────────────────────────────────────────────

interface MotionAnalysisResultProps {
  /** The full analysis response from the proxy */
  result: MotionAnalysisProcessResponse;
  /** Called when user wants to go back / close */
  onClose?: () => void;
}

type ViewMode = "split" | "video" | "skeleton";

// ── Angle Display ────────────────────────────────────────────────────────

function AnglesBadges({
  angles,
}: {
  angles: MotionAnalysisProcessResponse["pose"]["averageAngles"];
}) {
  if (!angles) return null;

  const items: { label: string; value: number | null }[] = [
    { label: "Joelho E", value: angles.leftKnee },
    { label: "Joelho D", value: angles.rightKnee },
    { label: "Anca E", value: angles.leftHip },
    { label: "Anca D", value: angles.rightHip },
    { label: "Cotovelo E", value: angles.leftElbow },
    { label: "Cotovelo D", value: angles.rightElbow },
    { label: "Ombro E", value: angles.leftShoulder },
    { label: "Ombro D", value: angles.rightShoulder },
    { label: "Tornozelo E", value: angles.leftAnkle },
    { label: "Tornozelo D", value: angles.rightAnkle },
    { label: "Tronco", value: angles.torsoInclination },
  ];

  const validItems = items.filter((a) => a.value !== null);
  if (validItems.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {validItems.map((item) => (
        <Badge
          key={item.label}
          variant="secondary"
          className="text-xs font-normal"
        >
          {item.label}: {item.value!.toFixed(1)}°
        </Badge>
      ))}
    </div>
  );
}

// ── Stats Bar ────────────────────────────────────────────────────────────

function StatsBar({ pose }: { pose: MotionAnalysisProcessResponse["pose"] }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
      <span>
        <strong className="text-foreground">{pose.framesProcessed}</strong>{" "}
        frames
      </span>
      <span>
        <strong className="text-foreground">
          {pose.detectionRate.toFixed(0)}%
        </strong>{" "}
        deteção
      </span>
      <span>
        <strong className="text-foreground">
          {pose.durationSec.toFixed(1)}s
        </strong>{" "}
        duração
      </span>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────

export function MotionAnalysisResult({
  result,
  onClose,
}: MotionAnalysisResultProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationRef = useRef<number | null>(null);

  const totalFrames = result.skeletonFrames.length;
  const fps = totalFrames > 0 ? totalFrames / result.pose.durationSec : 30;

  // Count frames with actual skeleton data
  const framesWithData = useMemo(
    () => result.skeletonFrames.filter((f) => f.landmarks.length > 0).length,
    [result.skeletonFrames]
  );

  // ── Video ↔ skeleton sync ──────────────────────────────────────────────

  const syncSkeletonToVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video || totalFrames === 0) return;

    const currentTime = video.currentTime;
    const duration = video.duration || result.pose.durationSec;
    const progress = currentTime / duration;
    const frameIndex = Math.min(
      Math.floor(progress * totalFrames),
      totalFrames - 1
    );
    setCurrentFrameIndex(frameIndex);
  }, [totalFrames, result.pose.durationSec]);

  // Listen to video timeupdate
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handler = () => syncSkeletonToVideo();
    video.addEventListener("timeupdate", handler);
    return () => video.removeEventListener("timeupdate", handler);
  }, [syncSkeletonToVideo]);

  // Playback animation loop (for skeleton-only mode or finer sync)
  useEffect(() => {
    if (!isPlaying || viewMode === "video") return;

    let lastTimestamp = 0;
    const step = (timestamp: number) => {
      if (lastTimestamp === 0) lastTimestamp = timestamp;
      const deltaMs = timestamp - lastTimestamp;

      // If we have video, sync from it
      if (videoRef.current && viewMode === "split") {
        syncSkeletonToVideo();
      } else {
        // Skeleton-only: advance by fps
        const framesToAdvance = Math.floor((deltaMs / 1000) * fps);
        if (framesToAdvance > 0) {
          setCurrentFrameIndex((prev) => {
            const next = prev + framesToAdvance;
            if (next >= totalFrames) {
              setIsPlaying(false);
              return 0;
            }
            return next;
          });
          lastTimestamp = timestamp;
        }
      }

      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, viewMode, fps, totalFrames, syncSkeletonToVideo]);

  // ── Controls ───────────────────────────────────────────────────────────

  const handlePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (video && viewMode !== "skeleton") {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, viewMode]);

  const handleReset = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.pause();
    }
    setIsPlaying(false);
    setCurrentFrameIndex(0);
  }, []);

  const handleFrameSlider = useCallback(
    (value: number[]) => {
      const frameIndex = value[0];
      setCurrentFrameIndex(frameIndex);

      // Sync video to frame
      const video = videoRef.current;
      if (video && totalFrames > 0) {
        const duration = video.duration || result.pose.durationSec;
        video.currentTime = (frameIndex / totalFrames) * duration;
      }
    },
    [totalFrames, result.pose.durationSec]
  );

  const handleStepFrame = useCallback(
    (direction: -1 | 1) => {
      setCurrentFrameIndex((prev) => {
        const next = prev + direction;
        return Math.max(0, Math.min(next, totalFrames - 1));
      });

      const video = videoRef.current;
      if (video && totalFrames > 0) {
        const duration = video.duration || result.pose.durationSec;
        const newFrame = Math.max(
          0,
          Math.min(currentFrameIndex + direction, totalFrames - 1)
        );
        video.currentTime = (newFrame / totalFrames) * duration;
      }

      setIsPlaying(false);
      if (videoRef.current) videoRef.current.pause();
    },
    [totalFrames, currentFrameIndex, result.pose.durationSec]
  );

  // Video play/pause sync
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
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Header with mode toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Voltar
            </Button>
          )}
          <h3 className="text-sm font-semibold">Resultado da Análise</h3>
        </div>

        <div className="flex items-center gap-1 rounded-lg border bg-muted/30 p-0.5">
          <Button
            variant={viewMode === "split" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => setViewMode("split")}
          >
            <Video className="mr-1 h-3 w-3" />
            +
            <Box className="ml-1 h-3 w-3" />
          </Button>
          <Button
            variant={viewMode === "video" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => setViewMode("video")}
          >
            <Video className="h-3 w-3" />
          </Button>
          <Button
            variant={viewMode === "skeleton" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => setViewMode("skeleton")}
          >
            <Box className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <div
        className={`grid gap-3 ${
          viewMode === "split" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {/* Video panel */}
        {viewMode !== "skeleton" && (
          <div className="overflow-hidden rounded-lg border bg-black">
            {result.videoUrl ? (
              /* eslint-disable-next-line jsx-a11y/media-has-caption */
              <video
                ref={videoRef}
                src={result.videoUrl}
                className="h-full w-full object-contain"
                style={{
                  maxHeight: viewMode === "video" ? 500 : 400,
                }}
                playsInline
                preload="auto"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
                Vídeo processado não disponível
              </div>
            )}
          </div>
        )}

        {/* 3D Skeleton panel */}
        {viewMode !== "video" && framesWithData > 0 && (
          <Skeleton3DViewer
            frames={result.skeletonFrames}
            currentFrameIndex={currentFrameIndex}
            height={viewMode === "skeleton" ? 500 : 400}
            className="overflow-hidden rounded-lg border"
          />
        )}

        {/* No skeleton data fallback */}
        {viewMode !== "video" && framesWithData === 0 && (
          <div className="flex h-[300px] items-center justify-center rounded-lg border bg-muted/10 text-sm text-muted-foreground">
            Sem dados de esqueleto 3D disponíveis
          </div>
        )}
      </div>

      {/* Playback controls */}
      <div className="space-y-2">
        {/* Frame slider */}
        {totalFrames > 1 && (
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleStepFrame(-1)}
              disabled={currentFrameIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Slider
              value={[currentFrameIndex]}
              min={0}
              max={totalFrames - 1}
              step={1}
              onValueChange={handleFrameSlider}
              className="flex-1"
            />

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleStepFrame(1)}
              disabled={currentFrameIndex >= totalFrames - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <span className="min-w-[80px] text-right text-xs text-muted-foreground">
              {currentFrameIndex + 1} / {totalFrames}
            </span>
          </div>
        )}

        {/* Play controls row */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePlayPause}
            className="gap-1.5"
          >
            {isPlaying ? (
              <Pause className="h-3.5 w-3.5" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
            {isPlaying ? "Pausar" : "Reproduzir"}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Stats & angles */}
      <div className="space-y-2 border-t pt-3">
        <StatsBar pose={result.pose} />
        <AnglesBadges angles={result.pose.averageAngles} />
      </div>
    </div>
  );
}
