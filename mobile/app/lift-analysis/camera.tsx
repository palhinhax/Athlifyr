import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { CameraView, useCameraPermissions, type CameraType } from "expo-camera";
import {
  ArrowLeft,
  Zap,
  ZapOff,
  Video,
  Square,
  RotateCcw,
} from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import { CameraGuide } from "@/src/components/lift-analysis/CameraGuide";

/**
 * LiftCamera – Guided lateral recording screen.
 *
 * Provides a camera view with:
 * - Framing guide overlay (silhouette, grid, distance hint)
 * - Record button with recording indicator
 * - Torch toggle
 * - Camera flip (front/back)
 *
 * After recording, navigates to the LiftEditor with the video URI.
 */
export default function LiftCameraScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [facing, setFacing] = useState<CameraType>("back");

  const handleStartRecording = useCallback(async () => {
    if (!cameraRef.current || isRecording) return;

    setIsRecording(true);
    try {
      const video = await cameraRef.current.recordAsync({
        maxDuration: 120,
      });
      if (video?.uri) {
        router.push({
          pathname: "/lift-analysis/editor",
          params: { videoUri: video.uri },
        });
      }
    } catch (error) {
      console.error("Recording failed:", error);
      Alert.alert(t("common.error"), t("liftAnalysis.camera.recordingFailed"));
    } finally {
      setIsRecording(false);
    }
  }, [isRecording, router, t]);

  const handleStopRecording = useCallback(() => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  }, [isRecording]);

  const handleFlipCamera = useCallback(() => {
    setFacing((prev: CameraType) => (prev === "back" ? "front" : "back"));
  }, []);

  // ─── Permission handling ────────────────────────────────────

  if (!permission) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            {t("liftAnalysis.camera.loadingPermissions")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>
            {t("liftAnalysis.camera.permissionTitle")}
          </Text>
          <Text style={styles.permissionText}>
            {t("liftAnalysis.camera.permissionDescription")}
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
            activeOpacity={0.7}
          >
            <Text style={styles.permissionButtonText}>
              {t("liftAnalysis.camera.grantPermission")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backLink}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.backLinkText}>{t("common.cancel")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Camera View ────────────────────────────────────────────

  return (
    <View style={styles.fullScreen}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        mode="video"
        enableTorch={torchEnabled}
      >
        {/* Framing guide overlay */}
        <CameraGuide />

        {/* Top bar */}
        <SafeAreaView style={styles.topBar} edges={["top"]}>
          <TouchableOpacity
            style={styles.topButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={theme.colors.white} />
          </TouchableOpacity>

          <Text style={styles.topTitle}>{t("liftAnalysis.camera.title")}</Text>

          <TouchableOpacity
            style={styles.topButton}
            onPress={() => setTorchEnabled((prev) => !prev)}
            activeOpacity={0.7}
          >
            {torchEnabled ? (
              <Zap size={22} color={theme.colors.accent} />
            ) : (
              <ZapOff size={22} color={theme.colors.white} />
            )}
          </TouchableOpacity>
        </SafeAreaView>

        {/* Bottom controls */}
        <SafeAreaView style={styles.bottomBar} edges={["bottom"]}>
          {/* Flip camera */}
          <TouchableOpacity
            style={styles.sideButton}
            onPress={handleFlipCamera}
            activeOpacity={0.7}
            disabled={isRecording}
          >
            <RotateCcw
              size={24}
              color={isRecording ? "rgba(255,255,255,0.3)" : theme.colors.white}
            />
          </TouchableOpacity>

          {/* Record button */}
          <TouchableOpacity
            style={[
              styles.recordButton,
              isRecording && styles.recordButtonActive,
            ]}
            onPress={isRecording ? handleStopRecording : handleStartRecording}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.recordButtonInner,
                isRecording && styles.recordButtonInnerActive,
              ]}
            >
              {isRecording ? (
                <Square size={20} color={theme.colors.white} />
              ) : (
                <Video size={20} color={theme.colors.white} />
              )}
            </View>
          </TouchableOpacity>

          {/* Spacer for centering */}
          <View style={styles.sideButton} />
        </SafeAreaView>

        {/* Recording indicator */}
        {isRecording && (
          <View style={styles.recordingIndicator}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingText}>
              {t("liftAnalysis.camera.recording")}
            </Text>
          </View>
        )}
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },

  // Permission
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  permissionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    textAlign: "center",
  },
  permissionText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
  },
  permissionButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  backLink: {
    marginTop: theme.spacing.sm,
  },
  backLinkText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.sm,
  },

  // Top bar
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  topButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  topTitle: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },

  // Bottom bar
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: Platform.OS === "android" ? theme.spacing.lg : 0,
  },
  sideButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },

  // Record button
  recordButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: theme.colors.white,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  recordButtonActive: {
    borderColor: theme.colors.error,
  },
  recordButtonInner: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    backgroundColor: theme.colors.error,
    justifyContent: "center",
    alignItems: "center",
  },
  recordButtonInnerActive: {
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.error,
  },

  // Recording indicator
  recordingIndicator: {
    position: "absolute",
    top: 100,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.error,
  },
  recordingText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
