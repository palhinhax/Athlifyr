"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  Activity,
  Dumbbell,
  CalendarDays,
  Clock,
  Play,
  Download,
  Loader2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
  sampleFps?: number;
  poseFrames?: PoseFrame[];
  metrics?: {
    kneeFlexionDeg?: number;
    torsoRangeDeg?: number;
  };
  segment?: { startMs: number; endMs: number };
  videoMeta?: { videoWidth: number; videoHeight: number };
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

// ── Export hook ───────────────────────────────────────────────────────────────

type ExportState =
  | { status: "idle" }
  | { status: "processing" } // server rendering — no progress, just waiting
  | { status: "done"; downloadUrl: string }
  | { status: "error"; message: string };

function useExportVideo(record: AnalysisRecord | null) {
  const [exportState, setExportState] = useState<ExportState>({
    status: "idle",
  });

  // Reset when the modal closes
  useEffect(() => {
    if (!record) setExportState({ status: "idle" });
  }, [record]);

  const startExport = useCallback(async () => {
    if (!record) return;
    const json = record.analysisJson;
    const isMotion = "poseFrames" in json;

    try {
      // ── Build FormData — pass videoUrl so the server fetches it ──
      // (avoids browser CORS restrictions on cross-origin B2 URLs)
      setExportState({ status: "processing" });

      const fd = new FormData();
      fd.append("videoUrl", record.videoUrl);

      if (isMotion) {
        const mJson = json as MotionAnalysisJson;
        fd.append("type", "motion");
        fd.append(
          "segment",
          JSON.stringify(mJson.segment ?? { startMs: 0, endMs: 0 })
        );
        fd.append(
          "videoMeta",
          JSON.stringify(mJson.videoMeta ?? { videoWidth: 0, videoHeight: 0 })
        );
        fd.append("poseFrames", JSON.stringify(mJson.poseFrames ?? []));
        fd.append("metrics", JSON.stringify(mJson.metrics ?? {}));
      } else {
        const lJson = json as LiftAnalysisJson;
        fd.append("type", "lift");
        fd.append("barPath", JSON.stringify(lJson.barPath ?? []));
        fd.append("durationMs", String(lJson.durationMs ?? 0));
      }

      // ── Step 2: submit to API and await result ───────────────────
      // The server processes synchronously and returns { downloadUrl } when done.
      const submitRes = await fetch("/api/export/video", {
        method: "POST",
        body: fd,
      });
      if (!submitRes.ok) {
        const err = await submitRes.json().catch(() => ({}));
        throw new Error(
          (err as { error?: string }).error ?? "Erro ao iniciar exportação"
        );
      }
      const { downloadUrl } = (await submitRes.json()) as {
        downloadUrl: string;
      };
      if (!downloadUrl) throw new Error("URL de download em falta na resposta");
      setExportState({ status: "done", downloadUrl });
    } catch (e) {
      setExportState({
        status: "error",
        message: e instanceof Error ? e.message : "Erro desconhecido",
      });
    }
  }, [record]);

  return { exportState, startExport };
}

// ── Export button ─────────────────────────────────────────────────────────────

function ExportButton({
  exportState,
  onStart,
}: {
  exportState: ExportState;
  onStart: () => void;
}) {
  if (exportState.status === "done") {
    return (
      <a
        href={exportState.downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"
      >
        <Download className="h-3.5 w-3.5" />
        Descarregar
      </a>
    );
  }

  const busy = exportState.status === "processing";

  return (
    <button
      onClick={onStart}
      disabled={busy}
      className="inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-medium text-white/80 hover:bg-white/10 disabled:opacity-50"
    >
      {busy ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />A exportar…
        </>
      ) : (
        <>
          <Download className="h-3.5 w-3.5" />
          Exportar vídeo
        </>
      )}
    </button>
  );
}

// ── Motion Video Modal ────────────────────────────────────────────────────────

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

  const json = record?.analysisJson as MotionAnalysisJson | undefined;
  const poseFrames = json?.poseFrames ?? [];
  const segmentStartMs = json?.segment?.startMs ?? 0;
  const metrics = json?.metrics ?? {};
  const frameCount = poseFrames.length;
  const durationMs = json?.segment
    ? json.segment.endMs - json.segment.startMs
    : null;

  // Reset on open
  useEffect(() => {
    if (record) setCurrentMs(0);
  }, [record]);

  // Compute the actual rendered video frame rect inside the letterboxed element.
  // object-contain preserves aspect ratio and may add horizontal or vertical bars.
  const updateVideoSize = useCallback(() => {
    const el = videoRef.current;
    if (!el || !el.videoWidth || !el.videoHeight) return;
    const elW = el.clientWidth;
    const elH = el.clientHeight;
    const intrinsicRatio = el.videoWidth / el.videoHeight;
    const elRatio = elW / elH;
    let rendW: number, rendH: number;
    if (intrinsicRatio > elRatio) {
      // pillarboxed (bars on top/bottom)
      rendW = elW;
      rendH = elW / intrinsicRatio;
    } else {
      // letterboxed (bars on left/right)
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

  const absoluteMs = segmentStartMs + currentMs * 1000;

  const frame =
    poseFrames.length > 0
      ? poseFrames.reduce((best, f) =>
          Math.abs(f.t - absoluteMs) < Math.abs(best.t - absoluteMs) ? f : best
        )
      : null;

  const title = record?.label ?? "Análise de Movimento";
  const createdAt = record ? formatDate(record.createdAt) : "";

  const { exportState, startExport } = useExportVideo(record);

  return (
    <Dialog open={!!record} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0 [&>button]:z-10 [&>button]:text-white [&>button]:hover:text-white/80">
        {/* Dark header */}
        <div className="flex items-start gap-3 bg-black px-5 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/20">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <DialogHeader className="flex-1 space-y-0.5 text-left">
            <DialogTitle className="text-base text-white">{title}</DialogTitle>
            <DialogDescription className="flex items-center gap-1.5 text-xs text-white/50">
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
            </DialogDescription>
          </DialogHeader>
          <div className="shrink-0 pr-6">
            <ExportButton exportState={exportState} onStart={startExport} />
          </div>
        </div>

        {/* Export error strip */}
        {exportState.status === "error" && (
          <div className="bg-destructive/10 px-5 py-2 text-xs text-destructive">
            {exportState.message}
          </div>
        )}

        {/* Video area — overlay is positioned relative to the video element itself */}
        <div className="relative flex w-full justify-center bg-black">
          {record && (
            <>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                ref={videoRef}
                key={record.id}
                src={record.videoUrl}
                controls
                autoPlay
                playsInline
                className="max-h-[60vh] w-full object-contain"
                onLoadedMetadata={updateVideoSize}
                onTimeUpdate={(e) => setCurrentMs(e.currentTarget.currentTime)}
              />
              <SkeletonOverlay
                frame={frame}
                width={videoSize.w}
                height={videoSize.h}
                left={videoSize.left}
                top={videoSize.top}
              />
            </>
          )}
        </div>

        {/* Metrics footer */}
        {(metrics.kneeFlexionDeg !== undefined ||
          metrics.torsoRangeDeg !== undefined) && (
          <div className="grid grid-cols-2 divide-x border-t bg-muted/30">
            {metrics.kneeFlexionDeg !== undefined && (
              <div className="flex flex-col items-center gap-0.5 px-6 py-4">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Flexão do Joelho
                </p>
                <p className="text-2xl font-bold tabular-nums">
                  {metrics.kneeFlexionDeg.toFixed(1)}°
                </p>
              </div>
            )}
            {metrics.torsoRangeDeg !== undefined && (
              <div className="flex flex-col items-center gap-0.5 px-6 py-4">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Amplitude do Tronco
                </p>
                <p className="text-2xl font-bold tabular-nums">
                  {metrics.torsoRangeDeg.toFixed(1)}°
                </p>
              </div>
            )}
          </div>
        )}
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

  const json = record?.analysisJson as LiftAnalysisJson | undefined;
  const barPath = json?.barPath ?? [];
  const durationMs = json?.durationMs;
  const metrics = json?.metrics ?? {};

  // Reset on open
  useEffect(() => {
    if (record) setCurrentMs(0);
  }, [record]);

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

  const title = record?.label ?? "Análise de Levantamento";
  const createdAt = record ? formatDate(record.createdAt) : "";

  const hasMetrics = Object.values(metrics).some((v) => v !== undefined);

  const { exportState, startExport } = useExportVideo(record);

  return (
    <Dialog open={!!record} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0 [&>button]:z-10 [&>button]:text-white [&>button]:hover:text-white/80">
        {/* Dark header */}
        <div className="flex items-start gap-3 bg-black px-5 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/20">
            <Dumbbell className="h-5 w-5 text-primary" />
          </div>
          <DialogHeader className="flex-1 space-y-0.5 text-left">
            <DialogTitle className="text-base text-white">{title}</DialogTitle>
            <DialogDescription className="flex items-center gap-1.5 text-xs text-white/50">
              <CalendarDays className="h-3 w-3" />
              {createdAt}
              {durationMs !== undefined && (
                <>
                  <span className="text-white/30">·</span>
                  <Clock className="h-3 w-3" />
                  {formatDuration(durationMs)}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="shrink-0 pr-6">
            <ExportButton exportState={exportState} onStart={startExport} />
          </div>
        </div>

        {/* Export error strip */}
        {exportState.status === "error" && (
          <div className="bg-destructive/10 px-5 py-2 text-xs text-destructive">
            {exportState.message}
          </div>
        )}

        {/* Video area — overlay anchored to the video element */}
        <div className="relative flex w-full justify-center bg-black">
          {record && (
            <>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                ref={videoRef}
                key={record.id}
                src={record.videoUrl}
                controls
                autoPlay
                playsInline
                className="max-h-[60vh] w-full object-contain"
                onLoadedMetadata={updateVideoSize}
                onTimeUpdate={(e) =>
                  setCurrentMs(e.currentTarget.currentTime * 1000)
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

        {/* Metrics footer */}
        {hasMetrics && (
          <div
            className="grid divide-x border-t bg-muted/30"
            style={{
              gridTemplateColumns: `repeat(${Object.values(metrics).filter((v) => v !== undefined).length}, minmax(0, 1fr))`,
            }}
          >
            {metrics.maxHorizontalDrift !== undefined && (
              <div className="flex flex-col items-center gap-0.5 px-4 py-4">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Desvio Horizontal
                </p>
                <p className="text-2xl font-bold tabular-nums">
                  {(metrics.maxHorizontalDrift * 100).toFixed(1)}
                  <span className="text-base font-normal">%</span>
                </p>
              </div>
            )}
            {metrics.totalVerticalTravel !== undefined && (
              <div className="flex flex-col items-center gap-0.5 px-4 py-4">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Viagem Vertical
                </p>
                <p className="text-2xl font-bold tabular-nums">
                  {(metrics.totalVerticalTravel * 100).toFixed(1)}
                  <span className="text-base font-normal">%</span>
                </p>
              </div>
            )}
            {metrics.averageSpeed !== undefined && (
              <div className="flex flex-col items-center gap-0.5 px-4 py-4">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Velocidade Média
                </p>
                <p className="text-2xl font-bold tabular-nums">
                  {metrics.averageSpeed.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Motion Card ───────────────────────────────────────────────────────────────

function MotionCard({
  record,
  onOpen,
  t,
}: {
  record: AnalysisRecord;
  onOpen: () => void;
  t: ReturnType<typeof useTranslations<"profile">>;
}) {
  const json = record.analysisJson as MotionAnalysisJson;
  const durationMs = json.segment
    ? json.segment.endMs - json.segment.startMs
    : null;
  const frameCount = json.poseFrames?.length ?? 0;
  const metrics = json.metrics ?? {};
  const title = record.label ?? t("analyses.unlabeledMotion");

  return (
    <div className="space-y-3 rounded-xl border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold">{title}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            {formatDate(record.createdAt)}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="shrink-0"
          onClick={onOpen}
        >
          <Play className="mr-1.5 h-3.5 w-3.5" />
          {t("analyses.viewVideo")}
        </Button>
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
    </div>
  );
}

// ── Lift Card ─────────────────────────────────────────────────────────────────

function LiftCard({
  record,
  onOpen,
  t,
}: {
  record: AnalysisRecord;
  onOpen: () => void;
  t: ReturnType<typeof useTranslations<"profile">>;
}) {
  const json = record.analysisJson as LiftAnalysisJson;
  const durationMs = json.durationMs;
  const metrics = json.metrics ?? {};
  const title = record.label ?? t("analyses.unlabeledLift");

  return (
    <div className="space-y-3 rounded-xl border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold">{title}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            {formatDate(record.createdAt)}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="shrink-0"
          onClick={onOpen}
        >
          <Play className="mr-1.5 h-3.5 w-3.5" />
          {t("analyses.viewVideo")}
        </Button>
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

  const totalCount = motionAnalyses.length + liftAnalyses.length;

  if (!isLoading && totalCount === 0) return null;

  return (
    <>
      <MotionVideoModal
        record={openMotion}
        onClose={() => setOpenMotion(null)}
      />
      <LiftVideoModal record={openLift} onClose={() => setOpenLift(null)} />

      <div className="mt-12">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
          <Activity className="h-6 w-6 text-primary" />
          {t("analyses.title")}
          {totalCount > 0 && (
            <span className="ml-1 text-base font-normal text-muted-foreground">
              ({totalCount})
            </span>
          )}
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
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {motionAnalyses.map((record) => (
                      <MotionCard
                        key={record.id}
                        record={record}
                        onOpen={() => setOpenMotion(record)}
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
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {liftAnalyses.map((record) => (
                      <LiftCard
                        key={record.id}
                        record={record}
                        onOpen={() => setOpenLift(record)}
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
