"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { Activity, Dumbbell, CalendarDays, Clock, X, Play } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
}: {
  frame: PoseFrame | null;
  width: number;
  height: number;
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
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
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
  currentMs,
}: {
  path: BarPathPoint[];
  width: number;
  height: number;
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
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
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

// ── Motion Video Modal ────────────────────────────────────────────────────────

function MotionVideoModal({
  record,
  onClose,
}: {
  record: AnalysisRecord;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const [currentMs, setCurrentMs] = useState(0);

  const json = record.analysisJson as MotionAnalysisJson;
  const poseFrames = json.poseFrames ?? [];
  const segmentStartMs = json.segment?.startMs ?? 0;

  // Observe container size for overlay positioning
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setContainerSize({
          w: entry.contentRect.width,
          h: entry.contentRect.height,
        });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const absoluteMs = segmentStartMs + currentMs * 1000;

  const frame =
    poseFrames.length > 0
      ? poseFrames.reduce((best, f) =>
          Math.abs(f.t - absoluteMs) < Math.abs(best.t - absoluteMs) ? f : best
        )
      : null;

  const title = record.label ?? "Análise de Movimento";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 bg-black/60 px-4 py-3">
          <span className="truncate text-sm font-medium text-white">
            {title}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="shrink-0 text-white hover:text-white/70"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div ref={containerRef} className="relative w-full bg-black">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            src={record.videoUrl}
            controls
            autoPlay
            playsInline
            className="max-h-[65vh] w-full object-contain"
            onTimeUpdate={(e) => setCurrentMs(e.currentTarget.currentTime)}
          />
          <SkeletonOverlay
            frame={frame}
            width={containerSize.w}
            height={containerSize.h}
          />
        </div>
      </div>
    </div>
  );
}

// ── Lift Video Modal ──────────────────────────────────────────────────────────

function LiftVideoModal({
  record,
  onClose,
}: {
  record: AnalysisRecord;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const [currentMs, setCurrentMs] = useState(0);

  const json = record.analysisJson as LiftAnalysisJson;
  const barPath = json.barPath ?? [];

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setContainerSize({
          w: entry.contentRect.width,
          h: entry.contentRect.height,
        });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const title = record.label ?? "Análise de Levantamento";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 bg-black/60 px-4 py-3">
          <span className="truncate text-sm font-medium text-white">
            {title}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="shrink-0 text-white hover:text-white/70"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div ref={containerRef} className="relative w-full bg-black">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            src={record.videoUrl}
            controls
            autoPlay
            playsInline
            className="max-h-[65vh] w-full object-contain"
            onTimeUpdate={(e) =>
              setCurrentMs(e.currentTarget.currentTime * 1000)
            }
          />
          <BarPathOverlay
            path={barPath}
            width={containerSize.w}
            height={containerSize.h}
            currentMs={currentMs}
          />
        </div>
      </div>
    </div>
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
      {openMotion && (
        <MotionVideoModal
          record={openMotion}
          onClose={() => setOpenMotion(null)}
        />
      )}
      {openLift && (
        <LiftVideoModal record={openLift} onClose={() => setOpenLift(null)} />
      )}

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
          <div className="overflow-hidden rounded-xl border bg-card">
            <Tabs defaultValue="motion">
              {/* Full-width tab bar */}
              <TabsList className="h-11 w-full rounded-none border-b bg-muted/30">
                <TabsTrigger
                  value="motion"
                  className="h-full flex-1 gap-1.5 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <Activity className="h-4 w-4" />
                  {t("analyses.motionTab")}
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
                  className="h-full flex-1 gap-1.5 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <Dumbbell className="h-4 w-4" />
                  {t("analyses.liftTab")}
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

              <TabsContent value="motion" className="mt-0 p-4">
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

              <TabsContent value="lift" className="mt-0 p-4">
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
