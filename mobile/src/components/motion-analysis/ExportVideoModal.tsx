/**
 * ExportVideoModal
 *
 * Drives the backend video-composition export flow:
 *   Upload → Processing (with live progress) → Download → Share
 *
 * Shows a bottom-sheet style modal with a progress bar so the user
 * knows what's happening during the (potentially long) encoding step.
 * The user can cancel while uploading or processing (before download).
 */
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import { X, Upload, Cpu, Download, CheckCircle2 } from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import {
  exportAnalysisVideo,
  type ExportPayload,
  type ExportProgressCallback,
} from "@/src/lib/analysis-export";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExportVideoModalProps {
  visible: boolean;
  payload: ExportPayload | null;
  onDone: () => void;
  /** Called when the export fails — the parent shows the error ConfirmModal */
  onError: (message: string) => void;
}

type ExportPhase = "idle" | "uploading" | "processing" | "downloading" | "done";

// ─── Component ────────────────────────────────────────────────────────────────

export function ExportVideoModal({
  visible,
  payload,
  onDone,
  onError,
}: ExportVideoModalProps) {
  const [phase, setPhase] = useState<ExportPhase>("idle");
  const [progress, setProgress] = useState(0);

  // Animated progress bar width (0..1)
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Allow cancellation
  const cancelledRef = useRef(false);

  // ── Start export when modal becomes visible ──────────────────────────────
  useEffect(() => {
    if (!visible || !payload) {
      // Reset on close
      setPhase("idle");
      setProgress(0);
      progressAnim.setValue(0);
      cancelledRef.current = false;
      return;
    }

    cancelledRef.current = false;

    const progressCallback: ExportProgressCallback = (ph, pct) => {
      if (cancelledRef.current) return;
      setPhase(ph);
      setProgress(pct);
      Animated.timing(progressAnim, {
        toValue: pct / 100,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();
    };

    exportAnalysisVideo(payload, progressCallback)
      .then(() => {
        if (cancelledRef.current) return;
        setPhase("done");
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }).start();
        // Close modal after a short celebration delay
        setTimeout(() => {
          if (!cancelledRef.current) onDone();
        }, 800);
      })
      .catch((err: unknown) => {
        if (cancelledRef.current) return;
        const msg =
          err instanceof Error ? err.message : "Export failed unexpectedly";
        onError(msg);
        onDone();
      });
  }, [visible, payload]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Cancel ───────────────────────────────────────────────────────────────
  function handleCancel() {
    cancelledRef.current = true;
    onDone();
  }

  // ── Phase helpers ─────────────────────────────────────────────────────────
  const canCancel =
    phase === "idle" || phase === "uploading" || phase === "processing";

  const phaseLabel = {
    idle: "Preparando…",
    uploading: "A enviar vídeo…",
    processing: "A compor overlay…",
    downloading: "A transferir resultado…",
    done: "Pronto!",
  }[phase];

  const PhaseIcon = {
    idle: ActivityIndicator,
    uploading: Upload,
    processing: Cpu,
    downloading: Download,
    done: CheckCircle2,
  }[phase] as React.ElementType;

  const iconColor =
    phase === "done" ? theme.colors.success : theme.colors.primary;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={canCancel ? handleCancel : undefined}
    >
      {/* Scrim */}
      <View style={styles.scrim}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>Exportar vídeo</Text>
            {canCancel && (
              <TouchableOpacity
                onPress={handleCancel}
                activeOpacity={0.7}
                style={styles.closeBtn}
              >
                <X size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Phase icon + label */}
          <View style={styles.phaseRow}>
            {phase === "idle" ? (
              <ActivityIndicator
                size={28}
                color={theme.colors.primary}
                style={styles.phaseIcon}
              />
            ) : (
              <PhaseIcon size={28} color={iconColor} style={styles.phaseIcon} />
            )}
            <Text style={styles.phaseLabel}>{phaseLabel}</Text>
          </View>

          {/* Progress bar */}
          <View style={styles.barTrack}>
            <Animated.View
              style={[
                styles.barFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                  backgroundColor:
                    phase === "done"
                      ? theme.colors.success
                      : theme.colors.primary,
                },
              ]}
            />
          </View>

          {/* Progress percentage */}
          <Text style={styles.progressText}>
            {phase === "done"
              ? "100%"
              : phase === "idle"
                ? "—"
                : `${Math.round(progress)}%`}
          </Text>

          {/* Cancel button (only while we can still cancel) */}
          {canCancel && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing["2xl"],
    gap: theme.spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: theme.colors.muted,
  },
  phaseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  phaseIcon: {
    width: 32,
    height: 32,
  },
  phaseLabel: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.muted,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: "right",
  },
  cancelButton: {
    marginTop: theme.spacing.xs,
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  cancelButtonText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
});
