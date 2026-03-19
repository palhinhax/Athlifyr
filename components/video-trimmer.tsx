"use client";

/**
 * VideoTrimmer — Web version of the mobile VideoTrimmer component.
 *
 * Shows a thumbnail timeline with draggable start/end handles to select
 * a ≤30s sub-clip. The actual trimming is done server-side via
 * trim_start_sec / trim_end_sec — this component only provides the UI.
 *
 * Visual style matches the mobile app (dark background, coloured handles,
 * dimmed areas outside the selection).
 */

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Scissors, Check, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MAX_DURATION_LIFT_SEC } from "@/lib/video-limits";

const THUMBNAIL_COUNT = 8;
const MIN_TRIM_DURATION_SEC = 1;
const MAX_TRIM_DURATION_SEC = MAX_DURATION_LIFT_SEC; // 30s

function waitForVideoLoad(video: HTMLVideoElement): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    video.onloadeddata = () => resolve();
    video.onerror = () => reject(new Error("Failed to load video"));
  });
}

function waitForVideoSeek(video: HTMLVideoElement): Promise<void> {
  return new Promise<void>((resolve) => {
    video.onseeked = () => resolve();
  });
}

export interface TrimRange {
  startSec: number;
  endSec: number;
}

interface VideoTrimmerProps {
  /** Object URL of the video file */
  videoUrl: string;
  /** Total duration in seconds */
  durationSec: number;
  /** Called when the user confirms the trim selection */
  onConfirm: (trimRange: TrimRange) => void;
  /** Called when the user cancels */
  onCancel: () => void;
}

export function VideoTrimmer({
  videoUrl,
  durationSec,
  onConfirm,
  onCancel,
}: VideoTrimmerProps) {
  // ── Trim state ───────────────────────────────────────────────
  const [startSec, setStartSec] = useState(0);
  const [endSec, setEndSec] = useState(
    Math.min(durationSec, MAX_TRIM_DURATION_SEC)
  );
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [loadingThumbnails, setLoadingThumbnails] = useState(true);

  // Refs for drag handling
  const timelineRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<"start" | "end" | null>(null);
  const startSecRef = useRef(startSec);
  const endSecRef = useRef(endSec);

  // Keep refs in sync
  useEffect(() => {
    startSecRef.current = startSec;
  }, [startSec]);
  useEffect(() => {
    endSecRef.current = endSec;
  }, [endSec]);

  // ── Preview video ref ────────────────────────────────────────
  const previewVideoRef = useRef<HTMLVideoElement>(null);

  // Seek preview video when startSec changes
  useEffect(() => {
    if (previewVideoRef.current) {
      previewVideoRef.current.currentTime = startSec;
    }
  }, [startSec]);

  // ── Generate thumbnails ──────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function generateThumbnails() {
      setLoadingThumbnails(true);
      const thumbs: string[] = [];
      const video = document.createElement("video");
      video.src = videoUrl;
      video.crossOrigin = "anonymous";
      video.preload = "auto";
      video.muted = true;

      await waitForVideoLoad(video);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setLoadingThumbnails(false);
        return;
      }

      // Use a small canvas for thumbnails
      canvas.width = 160;
      canvas.height = 90;

      for (let i = 0; i < THUMBNAIL_COUNT; i++) {
        if (cancelled) return;
        const time = (durationSec / THUMBNAIL_COUNT) * i + 0.1;
        const clampedTime = Math.min(time, durationSec - 0.1);

        video.currentTime = clampedTime;
        await waitForVideoSeek(video);

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        thumbs.push(canvas.toDataURL("image/jpeg", 0.5));
      }

      if (!cancelled) {
        setThumbnails(thumbs);
        setLoadingThumbnails(false);
      }

      // Cleanup
      video.src = "";
      video.load();
    }

    generateThumbnails().catch(() => {
      setLoadingThumbnails(false);
    });

    return () => {
      cancelled = true;
    };
  }, [videoUrl, durationSec]);

  // ── Position helpers ─────────────────────────────────────────
  const secToPercent = useCallback(
    (sec: number) => (sec / durationSec) * 100,
    [durationSec]
  );

  const xToSec = useCallback(
    (clientX: number) => {
      if (!timelineRef.current) return 0;
      const rect = timelineRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = Math.max(0, Math.min(1, x / rect.width));
      return pct * durationSec;
    },
    [durationSec]
  );

  // ── Mouse/touch drag handling ────────────────────────────────
  const handlePointerDown = useCallback(
    (handle: "start" | "end") => (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      draggingRef.current = handle;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current) return;
      const newSec = xToSec(e.clientX);

      if (draggingRef.current === "start") {
        let s = Math.round(newSec * 10) / 10;
        s = Math.max(0, Math.min(endSecRef.current - MIN_TRIM_DURATION_SEC, s));
        // Enforce max duration
        if (endSecRef.current - s > MAX_TRIM_DURATION_SEC) {
          s = endSecRef.current - MAX_TRIM_DURATION_SEC;
        }
        setStartSec(s);
      } else {
        let e2 = Math.round(newSec * 10) / 10;
        e2 = Math.max(
          startSecRef.current + MIN_TRIM_DURATION_SEC,
          Math.min(durationSec, e2)
        );
        // Enforce max duration
        if (e2 - startSecRef.current > MAX_TRIM_DURATION_SEC) {
          e2 = startSecRef.current + MAX_TRIM_DURATION_SEC;
        }
        setEndSec(e2);
      }
    },
    [xToSec, durationSec]
  );

  const handlePointerUp = useCallback(() => {
    draggingRef.current = null;
  }, []);

  // ── Computed values ──────────────────────────────────────────
  const trimDuration = endSec - startSec;
  const isValidTrim =
    trimDuration >= MIN_TRIM_DURATION_SEC &&
    trimDuration <= MAX_TRIM_DURATION_SEC;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleReset = useCallback(() => {
    setStartSec(0);
    setEndSec(Math.min(durationSec, MAX_TRIM_DURATION_SEC));
  }, [durationSec]);

  const handleConfirm = useCallback(() => {
    onConfirm({ startSec, endSec });
  }, [startSec, endSec, onConfirm]);

  const startPct = secToPercent(startSec);
  const endPct = secToPercent(endSec);

  return (
    <div className="space-y-4">
      {/* Preview */}
      <div className="relative overflow-hidden rounded-lg border bg-black">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={previewVideoRef}
          src={videoUrl}
          className="max-h-[50vh] min-h-[30vh] w-full object-contain"
          muted
        />
        {/* Time badge */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-md bg-black/70 px-3 py-1 font-mono text-sm font-semibold text-white">
          {formatTime(startSec)} – {formatTime(endSec)}
        </div>
      </div>

      {/* Warning banner */}
      <div className="flex items-center gap-2 rounded-md bg-amber-500/15 px-3 py-2 text-sm">
        <Scissors className="h-4 w-4 shrink-0 text-amber-500" />
        <span className="text-amber-600 dark:text-amber-400">
          O vídeo tem {formatTime(durationSec)} — seleciona um trecho de até{" "}
          {MAX_TRIM_DURATION_SEC}s.
        </span>
      </div>

      {/* Timeline */}
      <div className="rounded-lg bg-black/90 p-3">
        <div
          ref={timelineRef}
          className="relative h-14 cursor-col-resize select-none overflow-hidden rounded-lg"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Thumbnails */}
          {loadingThumbnails ? (
            <div className="flex h-full items-center justify-center bg-white/5">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="flex h-full">
              {thumbnails.map((thumb, i) => (
                <div
                  key={i}
                  className="h-full overflow-hidden"
                  style={{ width: `${100 / THUMBNAIL_COUNT}%` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumb}
                    alt=""
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Dimmed overlay — left of start */}
          <div
            className="absolute inset-y-0 left-0 z-[1] bg-black/70"
            style={{ width: `${startPct}%` }}
          />

          {/* Dimmed overlay — right of end */}
          <div
            className="absolute inset-y-0 right-0 z-[1] bg-black/70"
            style={{ width: `${100 - endPct}%` }}
          />

          {/* Selected range border */}
          <div
            className="absolute inset-y-0 z-[2] border-y-[3px] border-primary"
            style={{
              left: `${startPct}%`,
              width: `${endPct - startPct}%`,
            }}
          />

          {/* Start handle */}
          <div
            className="absolute inset-y-[-4px] z-[3] flex w-4 cursor-ew-resize touch-none items-center justify-center rounded-l-md bg-primary"
            style={{ left: `calc(${startPct}% - 8px)` }}
            onPointerDown={handlePointerDown("start")}
          >
            <div className="h-5 w-[3px] rounded-full bg-white/80" />
          </div>

          {/* End handle */}
          <div
            className="absolute inset-y-[-4px] z-[3] flex w-4 cursor-ew-resize touch-none items-center justify-center rounded-r-md bg-primary"
            style={{ left: `calc(${endPct}% - 8px)` }}
            onPointerDown={handlePointerDown("end")}
          >
            <div className="h-5 w-[3px] rounded-full bg-white/80" />
          </div>
        </div>

        {/* Time labels */}
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="font-mono text-white/70">
            {formatTime(startSec)}
          </span>
          <span className="font-semibold text-primary">
            Duração: {formatTime(trimDuration)}
          </span>
          <span className="font-mono text-white/70">{formatTime(endSec)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" onClick={onCancel}>
          <X className="mr-1.5 h-3.5 w-3.5" />
          Cancelar
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-muted-foreground"
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          Reset
        </Button>

        <Button onClick={handleConfirm} disabled={!isValidTrim}>
          <Check className="mr-1.5 h-3.5 w-3.5" />
          Confirmar Corte
        </Button>
      </div>
    </div>
  );
}
