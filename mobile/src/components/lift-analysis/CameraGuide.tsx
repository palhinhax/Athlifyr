import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { theme } from "@/src/constants/theme";

/**
 * CameraGuide – Overlay displayed on the camera screen to help
 * the user position themselves correctly for a lateral lift recording.
 *
 * Shows a silhouette guide, framing hints, and distance indicators.
 */
export function CameraGuide() {
  const { t } = useTranslation();

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Top hint text */}
      <View style={styles.topHint}>
        <Text style={styles.hintText}>
          {t("liftAnalysis.camera.framingHint")}
        </Text>
      </View>

      {/* Grid lines for framing */}
      <View style={styles.gridContainer}>
        {/* Vertical thirds */}
        <View style={[styles.gridLine, styles.verticalLine, { left: "33%" }]} />
        <View style={[styles.gridLine, styles.verticalLine, { left: "66%" }]} />
        {/* Horizontal thirds */}
        <View
          style={[styles.gridLine, styles.horizontalLine, { top: "33%" }]}
        />
        <View
          style={[styles.gridLine, styles.horizontalLine, { top: "66%" }]}
        />
      </View>

      {/* Silhouette region indicator (center zone) */}
      <View style={styles.silhouetteZone}>
        <View style={styles.silhouetteBorder} />
      </View>

      {/* Bottom distance hint */}
      <View style={styles.bottomHint}>
        <Text style={styles.distanceHintText}>
          {t("liftAnalysis.camera.distanceHint")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  topHint: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: theme.spacing.lg,
  },
  hintText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
  },
  gridContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLine: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  verticalLine: {
    width: 1,
    top: 0,
    bottom: 0,
  },
  horizontalLine: {
    height: 1,
    left: 0,
    right: 0,
  },
  silhouetteZone: {
    position: "absolute",
    top: "15%",
    bottom: "20%",
    left: "20%",
    right: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  silhouetteBorder: {
    width: "100%",
    height: "100%",
    borderWidth: 1.5,
    borderColor: `${theme.colors.primary}66`,
    borderRadius: theme.borderRadius.lg,
    borderStyle: "dashed",
  },
  bottomHint: {
    alignItems: "center",
    paddingBottom: 120,
    paddingHorizontal: theme.spacing.lg,
  },
  distanceHintText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.sm,
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    overflow: "hidden",
  },
});
