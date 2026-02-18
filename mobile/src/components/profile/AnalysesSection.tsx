import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  useWindowDimensions,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { useTranslation } from "react-i18next";
import {
  Activity,
  Dumbbell,
  Play,
  X,
  Clock,
  Calendar,
} from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import { useAuthStore } from "@/src/lib/auth-store";
import { API_URL } from "@/src/lib/api";
import { StickmanRenderer } from "@/src/components/motion-analysis/StickmanRenderer";
import { BarPathOverlay } from "@/src/components/lift-analysis/BarPathOverlay";
import type { PoseFrame } from "@/src/types/motion-analysis";
import type { BarPathPoint } from "@/src/types/lift-analysis";

// ── Types ─────────────────────────────────────────────────────────────────────

interface MotionAnalysisJson {
  sampleFps?: number;
  poseFrames?: PoseFrame[];
  metrics?: { kneeFlexionDeg?: number; torsoRangeDeg?: number };
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

type TabKey = "motion" | "lift";

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

// ── Motion Video Modal ────────────────────────────────────────────────────────

function MotionVideoModalContent({ record }: { record: AnalysisRecord }) {
  const { width: screenWidth } = useWindowDimensions();
  const containerWidth = Math.min(screenWidth - 32, 500);
  // Portrait video aspect ratio
  const containerHeight = containerWidth * (16 / 9);

  const json = record.analysisJson as MotionAnalysisJson;
  const poseFrames = json.poseFrames ?? [];
  const segmentStartMs = json.segment?.startMs ?? 0;
  const videoAspectRatio = json.videoMeta
    ? json.videoMeta.videoWidth / json.videoMeta.videoHeight
    : undefined;

  const [currentMs, setCurrentMs] = useState(0);

  const player = useVideoPlayer(record.videoUrl, (p) => {
    p.loop = false;
    p.play();
  });

  // Subscribe to playback time
  useEffect(() => {
    const sub = player.addListener("timeUpdate", ({ currentTime }) => {
      setCurrentMs(currentTime * 1000);
    });
    return () => sub.remove();
  }, [player]);

  // Find the pose frame closest to current video time
  const absoluteMs = segmentStartMs + currentMs;
  const frame: PoseFrame | null =
    poseFrames.length > 0
      ? poseFrames.reduce((best, f) =>
          Math.abs(f.t - absoluteMs) < Math.abs(best.t - absoluteMs) ? f : best
        )
      : null;

  return (
    <View
      style={{
        width: containerWidth,
        height: containerHeight,
        backgroundColor: "#000",
        position: "relative",
      }}
    >
      <VideoView
        player={player}
        style={{ width: containerWidth, height: containerHeight }}
        nativeControls
        contentFit="contain"
      />
      {frame && (
        <View
          style={[
            StyleSheet.absoluteFill,
            { width: containerWidth, height: containerHeight },
          ]}
          pointerEvents="none"
        >
          <StickmanRenderer
            frame={frame}
            width={containerWidth}
            height={containerHeight}
            mode="overlay"
            videoAspectRatio={videoAspectRatio}
          />
        </View>
      )}
    </View>
  );
}

function MotionVideoModal({
  record,
  onClose,
}: {
  record: AnalysisRecord;
  onClose: () => void;
}) {
  const title = record.label ?? "Análise de Movimento";

  return (
    <Modal visible animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} numberOfLines={1}>
              {title}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.modalClose}>
              <X size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <MotionVideoModalContent record={record} />
        </View>
      </View>
    </Modal>
  );
}

// ── Lift Video Modal ──────────────────────────────────────────────────────────

function LiftVideoModalContent({ record }: { record: AnalysisRecord }) {
  const { width: screenWidth } = useWindowDimensions();
  const containerWidth = Math.min(screenWidth - 32, 500);
  const containerHeight = containerWidth * (16 / 9);

  const json = record.analysisJson as LiftAnalysisJson;
  const barPath = json.barPath ?? [];

  const [currentMs, setCurrentMs] = useState(0);

  const player = useVideoPlayer(record.videoUrl, (p) => {
    p.loop = false;
    p.play();
  });

  useEffect(() => {
    const sub = player.addListener("timeUpdate", ({ currentTime }) => {
      setCurrentMs(currentTime * 1000);
    });
    return () => sub.remove();
  }, [player]);

  return (
    <View
      style={{
        width: containerWidth,
        height: containerHeight,
        backgroundColor: "#000",
        position: "relative",
      }}
    >
      <VideoView
        player={player}
        style={{ width: containerWidth, height: containerHeight }}
        nativeControls
        contentFit="contain"
      />
      {barPath.length > 0 && (
        <View
          style={[
            StyleSheet.absoluteFill,
            { width: containerWidth, height: containerHeight },
          ]}
          pointerEvents="none"
        >
          <BarPathOverlay
            path={barPath}
            width={containerWidth}
            height={containerHeight}
            currentTimeMs={currentMs}
          />
        </View>
      )}
    </View>
  );
}

function LiftVideoModal({
  record,
  onClose,
}: {
  record: AnalysisRecord;
  onClose: () => void;
}) {
  const title = record.label ?? "Análise de Levantamento";

  return (
    <Modal visible animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} numberOfLines={1}>
              {title}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.modalClose}>
              <X size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <LiftVideoModalContent record={record} />
        </View>
      </View>
    </Modal>
  );
}

// ── Motion Card ───────────────────────────────────────────────────────────────

function MotionCard({
  record,
  onPlay,
  t,
}: {
  record: AnalysisRecord;
  onPlay: () => void;
  t: (key: string) => string;
}) {
  const json = record.analysisJson as MotionAnalysisJson;
  const durationMs = json.segment
    ? json.segment.endMs - json.segment.startMs
    : null;
  const frameCount = json.poseFrames?.length ?? 0;
  const metrics = json.metrics ?? {};

  return (
    <View style={styles.analysisCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {record.label ?? t("motionAnalysis.analysisLabel")}
          </Text>
          <TouchableOpacity style={styles.playBtn} onPress={onPlay}>
            <Play size={14} color={theme.colors.primary} />
            <Text style={styles.playBtnText}>
              {t("motionAnalysis.myAnalyses")}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardMeta}>
          <Calendar size={11} color={theme.colors.textSecondary} />
          <Text style={styles.cardMetaText}>
            {formatDate(record.createdAt)}
          </Text>
        </View>
      </View>

      <View style={styles.badges}>
        {durationMs !== null && (
          <View style={styles.badge}>
            <Clock size={11} color={theme.colors.textSecondary} />
            <Text style={styles.badgeText}>{formatDuration(durationMs)}</Text>
          </View>
        )}
        {frameCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {frameCount} {t("motionAnalysis.frames")}
            </Text>
          </View>
        )}
      </View>

      {(metrics.kneeFlexionDeg !== undefined ||
        metrics.torsoRangeDeg !== undefined) && (
        <View style={styles.metricsRow}>
          {metrics.kneeFlexionDeg !== undefined && (
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>
                {t("motionAnalysis.kneeFlexion")}
              </Text>
              <Text style={styles.metricValue}>
                {metrics.kneeFlexionDeg.toFixed(1)}°
              </Text>
            </View>
          )}
          {metrics.torsoRangeDeg !== undefined && (
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>
                {t("motionAnalysis.torsoRange")}
              </Text>
              <Text style={styles.metricValue}>
                {metrics.torsoRangeDeg.toFixed(1)}°
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

// ── Lift Card ─────────────────────────────────────────────────────────────────

function LiftCard({
  record,
  onPlay,
  t,
}: {
  record: AnalysisRecord;
  onPlay: () => void;
  t: (key: string) => string;
}) {
  const json = record.analysisJson as LiftAnalysisJson;
  const durationMs = json.durationMs;
  const metrics = json.metrics ?? {};

  return (
    <View style={styles.analysisCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {record.label ?? t("liftAnalysis.analysisLabel")}
          </Text>
          <TouchableOpacity style={styles.playBtn} onPress={onPlay}>
            <Play size={14} color={theme.colors.primary} />
            <Text style={styles.playBtnText}>
              {t("liftAnalysis.myAnalyses")}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardMeta}>
          <Calendar size={11} color={theme.colors.textSecondary} />
          <Text style={styles.cardMetaText}>
            {formatDate(record.createdAt)}
          </Text>
        </View>
      </View>

      {durationMs !== undefined && (
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Clock size={11} color={theme.colors.textSecondary} />
            <Text style={styles.badgeText}>{formatDuration(durationMs)}</Text>
          </View>
        </View>
      )}

      {Object.values(metrics).some((v) => v !== undefined) && (
        <View style={styles.metricsRow}>
          {metrics.maxHorizontalDrift !== undefined && (
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>
                {t("liftAnalysis.metrics.horizontalDrift")}
              </Text>
              <Text style={styles.metricValue}>
                {(metrics.maxHorizontalDrift * 100).toFixed(1)}%
              </Text>
            </View>
          )}
          {metrics.totalVerticalTravel !== undefined && (
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>
                {t("liftAnalysis.metrics.verticalTravel")}
              </Text>
              <Text style={styles.metricValue}>
                {(metrics.totalVerticalTravel * 100).toFixed(1)}%
              </Text>
            </View>
          )}
          {metrics.averageSpeed !== undefined && (
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>
                {t("liftAnalysis.metrics.avgSpeed")}
              </Text>
              <Text style={styles.metricValue}>
                {metrics.averageSpeed.toFixed(2)}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function AnalysesSection() {
  const { t } = useTranslation();
  const { token } = useAuthStore();

  const [activeTab, setActiveTab] = useState<TabKey>("motion");
  const [motionAnalyses, setMotionAnalyses] = useState<AnalysisRecord[]>([]);
  const [liftAnalyses, setLiftAnalyses] = useState<AnalysisRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openMotion, setOpenMotion] = useState<AnalysisRecord | null>(null);
  const [openLift, setOpenLift] = useState<AnalysisRecord | null>(null);

  const fetchAnalyses = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [motionRes, liftRes] = await Promise.all([
        fetch(`${API_URL}/api/analyses/motion`, { headers }),
        fetch(`${API_URL}/api/analyses/lift`, { headers }),
      ]);
      if (motionRes.ok) {
        const data = (await motionRes.json()) as { analyses: AnalysisRecord[] };
        setMotionAnalyses(data.analyses ?? []);
      }
      if (liftRes.ok) {
        const data = (await liftRes.json()) as { analyses: AnalysisRecord[] };
        setLiftAnalyses(data.analyses ?? []);
      }
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void fetchAnalyses();
  }, [fetchAnalyses]);

  const totalCount = motionAnalyses.length + liftAnalyses.length;
  if (!isLoading && totalCount === 0) return null;

  const tabs: {
    key: TabKey;
    label: string;
    icon: React.ReactNode;
    count: number;
  }[] = [
    {
      key: "motion",
      label: t("camera.motionAnalysis"),
      icon: (
        <Activity
          size={14}
          color={
            activeTab === "motion"
              ? theme.colors.primary
              : theme.colors.textSecondary
          }
        />
      ),
      count: motionAnalyses.length,
    },
    {
      key: "lift",
      label: t("camera.liftAnalysis"),
      icon: (
        <Dumbbell
          size={14}
          color={
            activeTab === "lift"
              ? theme.colors.primary
              : theme.colors.textSecondary
          }
        />
      ),
      count: liftAnalyses.length,
    },
  ];

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

      <View style={styles.container}>
        {/* Section header */}
        <View style={styles.header}>
          <Activity size={20} color={theme.colors.primary} />
          <Text style={styles.headerTitle}>
            {t("motionAnalysis.myAnalyses")}
            {totalCount > 0 ? ` (${totalCount})` : ""}
          </Text>
        </View>

        {/* Card with full-width tabs + content */}
        <View style={styles.card}>
          {/* Full-width tab bar */}
          <View style={styles.tabBar}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tab, isActive && styles.tabActive]}
                  onPress={() => setActiveTab(tab.key)}
                  activeOpacity={0.7}
                >
                  {tab.icon}
                  <Text
                    style={[styles.tabLabel, isActive && styles.tabLabelActive]}
                  >
                    {tab.label}
                  </Text>
                  {tab.count > 0 && (
                    <View style={styles.tabBadge}>
                      <Text style={styles.tabBadgeText}>{tab.count}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Tab content */}
          <View style={styles.tabContent}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={theme.colors.primary} />
              </View>
            ) : activeTab === "motion" ? (
              motionAnalyses.length === 0 ? (
                <View style={styles.emptyState}>
                  <Activity
                    size={36}
                    color={theme.colors.textSecondary}
                    style={{ opacity: 0.4 }}
                  />
                  <Text style={styles.emptyTitle}>
                    {t("motionAnalysis.noAnalyses")}
                  </Text>
                  <Text style={styles.emptyDesc}>
                    {t("motionAnalysis.noAnalysesDescription")}
                  </Text>
                </View>
              ) : (
                <View style={styles.cardList}>
                  {motionAnalyses.map((record) => (
                    <MotionCard
                      key={record.id}
                      record={record}
                      onPlay={() => setOpenMotion(record)}
                      t={t}
                    />
                  ))}
                </View>
              )
            ) : liftAnalyses.length === 0 ? (
              <View style={styles.emptyState}>
                <Dumbbell
                  size={36}
                  color={theme.colors.textSecondary}
                  style={{ opacity: 0.4 }}
                />
                <Text style={styles.emptyTitle}>
                  {t("liftAnalysis.noAnalyses")}
                </Text>
                <Text style={styles.emptyDesc}>
                  {t("liftAnalysis.noAnalysesDescription")}
                </Text>
              </View>
            ) : (
              <View style={styles.cardList}>
                {liftAnalyses.map((record) => (
                  <LiftCard
                    key={record.id}
                    record={record}
                    onPlay={() => setOpenLift(record)}
                    t={t}
                  />
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  // Outer card wrapping tabs + content
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  // Individual analysis cards inside tabs
  analysisCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  // Full-width tab bar
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: theme.colors.primary,
  },
  tabLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  tabLabelActive: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  tabBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 17,
    alignItems: "center",
  },
  tabBadgeText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "700",
  },
  tabContent: {
    padding: theme.spacing.md,
  },
  loadingContainer: {
    paddingVertical: theme.spacing.xl,
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
  },
  emptyDesc: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  cardList: {
    gap: theme.spacing.md,
  },
  // Analysis card (inside the tab content)
  cardHeader: {
    gap: 4,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    flex: 1,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardMetaText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  playBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  playBtnText: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  badgeText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  metricsRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  metricBox: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: theme.spacing.sm,
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 14,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
    marginTop: 2,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.md,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#000",
    borderRadius: 16,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    flex: 1,
  },
  modalClose: {
    padding: 4,
  },
});
