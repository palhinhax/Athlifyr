"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Scissors, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface VideoTrimDialogProps {
  open: boolean;
  /** Object URL for the original video */
  videoUrl: string;
  /** Total duration of the video in seconds */
  duration: number;
  /** Maximum allowed duration in seconds */
  maxDurationSec: number;
  /** Original file size in MB — used to explain why trim is required */
  fileSizeMb?: number;
  /** Called when the user confirms the trim — returns [startSec, endSec] */
  onConfirm: (startSec: number, endSec: number) => void;
  onCancel: () => void;
}

function formatSec(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  const ms = Math.round((sec % 1) * 10);
  return `${m}:${String(s).padStart(2, "0")}.${ms}`;
}

export function VideoTrimDialog({
  open,
  videoUrl,
  duration,
  maxDurationSec,
  fileSizeMb,
  onConfirm,
  onCancel,
}: VideoTrimDialogProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // [startSec, endSec] — start at [0, min(maxDuration, duration)]
  const [range, setRange] = useState<[number, number]>([
    0,
    Math.min(maxDurationSec, duration),
  ]);

  const trimDuration = range[1] - range[0];

  // Reset range whenever dialog opens with a new video
  useEffect(() => {
    if (open) {
      const end = Math.min(maxDurationSec, duration);
      setRange([0, end]);
      setCurrentTime(0);
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.pause();
      }
    }
  }, [open, duration, maxDurationSec]);

  // Pause video if current time goes past end of trim range
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.currentTime >= range[1]) {
        video.pause();
        video.currentTime = range[1];
        setIsPlaying(false);
      }
    };
    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, [range]);

  const handlePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      // If at end of range, restart from start
      if (video.currentTime >= range[1]) {
        video.currentTime = range[0];
      }
      video.play();
      setIsPlaying(true);
    }
  }, [isPlaying, range]);

  // When user changes the range slider, pause and seek to start of range
  const handleRangeChange = useCallback(
    (values: number[]) => {
      const [start, end] = values as [number, number];
      // Enforce max duration
      if (end - start > maxDurationSec) return;
      setRange([start, end]);
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.currentTime = start;
        setIsPlaying(false);
        setCurrentTime(start);
      }
    },
    [maxDurationSec]
  );

  const handleConfirm = useCallback(() => {
    onConfirm(range[0], range[1]);
  }, [onConfirm, range]);

  const previewBarPercent =
    duration > 0 ? ((currentTime - range[0]) / (range[1] - range[0])) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scissors className="h-4 w-4" />
            Cortar Vídeo
          </DialogTitle>
          <DialogDescription>
            {fileSizeMb !== undefined && fileSizeMb > 100
              ? `O teu vídeo é demasiado grande (${fileSizeMb.toFixed(0)} MB). Seleciona um intervalo de no máximo `
              : `O teu vídeo tem mais de ${maxDurationSec}s. Seleciona a parte que queres analisar (máx. `}
            <strong>{maxDurationSec} segundos</strong>
            {fileSizeMb !== undefined && fileSizeMb > 100
              ? " para que o ficheiro fique abaixo de 100 MB."
              : ")."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Video preview */}
          <div className="overflow-hidden rounded-lg border bg-black">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              ref={videoRef}
              src={videoUrl}
              className="max-h-72 w-full object-contain"
              playsInline
              preload="metadata"
            />
          </div>

          {/* Playback progress bar inside selected range */}
          <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-none"
              style={{
                width: `${Math.max(0, Math.min(100, previewBarPercent))}%`,
              }}
            />
          </div>

          {/* Trim range slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Início:{" "}
                <strong className="text-foreground">
                  {formatSec(range[0])}
                </strong>
              </span>
              <span
                className={
                  trimDuration > maxDurationSec
                    ? "font-semibold text-destructive"
                    : "font-semibold text-foreground"
                }
              >
                {formatSec(trimDuration)}
              </span>
              <span>
                Fim:{" "}
                <strong className="text-foreground">
                  {formatSec(range[1])}
                </strong>
              </span>
            </div>

            <Slider
              min={0}
              max={duration}
              step={0.1}
              value={range}
              onValueChange={handleRangeChange}
              className="w-full"
            />

            <p className="text-center text-xs text-muted-foreground">
              Arrasta as alças para definir o início e o fim do excerto
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={handlePlayPause}>
              {isPlaying ? (
                <>
                  <Pause className="mr-1.5 h-3.5 w-3.5" />
                  Pausar pré-visualização
                </>
              ) : (
                <>
                  <Play className="mr-1.5 h-3.5 w-3.5" />
                  Pré-visualizar excerto
                </>
              )}
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={trimDuration <= 0 || trimDuration > maxDurationSec}
              >
                <Scissors className="mr-1.5 h-3.5 w-3.5" />
                Usar este excerto
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Returns the original file unchanged.
 *
 * Trimming is now handled server-side via ffmpeg stream copy (no re-encode,
 * no quality loss, no size bloat). The trim range [startSec, endSec] is sent
 * as `trim_start_sec` / `trim_end_sec` form fields alongside the original
 * video, and the server trims it before forwarding to Railway.
 *
 * The old canvas-based MediaRecorder approach was removed because it caused
 * severe size bloat (e.g. 1 MB WebM → 14 MB re-encoded output) which then
 * triggered 422 / 504 errors from the Railway API.
 */
export async function trimVideoInBrowser(
  file: File,
  _startSec: number,
  _endSec: number,
  onProgress?: (pct: number) => void
): Promise<File> {
  // Return original file immediately — server handles actual trimming
  onProgress?.(100);
  return file;
}
