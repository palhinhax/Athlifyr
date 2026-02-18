import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import {
  X,
  SwitchCamera,
  Zap,
  ZapOff,
  Square,
  Circle,
  ImagePlus,
} from "lucide-react-native";
import { theme } from "@/src/constants/theme";

type FlashMode = "on" | "off" | "auto";

export default function RecordLiftScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();

  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [isRecording, setIsRecording] = useState(false);

  // ─── Permission handling ─────────────────────────────────────

  const ensurePermissions = useCallback(async () => {
    if (!cameraPermission?.granted) {
      const camResult = await requestCameraPermission();
      if (!camResult.granted) return false;
    }
    if (!micPermission?.granted) {
      const micResult = await requestMicPermission();
      if (!micResult.granted) return false;
    }
    return true;
  }, [
    cameraPermission,
    micPermission,
    requestCameraPermission,
    requestMicPermission,
  ]);

  // ─── Record video ────────────────────────────────────────────

  const handleStartRecording = useCallback(async () => {
    if (!cameraRef.current || isRecording) return;
    const hasPerms = await ensurePermissions();
    if (!hasPerms) {
      Alert.alert(
        t("camera.permissionRequired"),
        t("camera.permissionMessage")
      );
      return;
    }

    setIsRecording(true);
    try {
      const video = await cameraRef.current.recordAsync({ maxDuration: 30 });
      if (video?.uri) {
        // Save to library, then navigate to analysis
        await MediaLibrary.saveToLibraryAsync(video.uri);
        router.push({
          pathname: "/lift-analysis",
          params: { videoUri: video.uri },
        });
      }
    } catch (error) {
      console.error("Error recording lift video:", error);
      Alert.alert(t("camera.error"), t("camera.videoError"));
    } finally {
      setIsRecording(false);
    }
  }, [isRecording, ensurePermissions, t, router]);

  const handleStopRecording = useCallback(() => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  }, [isRecording]);

  const handleCapture = useCallback(() => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  }, [isRecording, handleStartRecording, handleStopRecording]);

  // ─── Import from gallery ─────────────────────────────────────

  const handleImportVideo = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["videos"],
        quality: 1,
        videoMaxDuration: 30,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        router.push({
          pathname: "/lift-analysis",
          params: {
            videoUri: result.assets[0].uri,
            durationMs: result.assets[0].duration
              ? String(result.assets[0].duration)
              : undefined,
          },
        });
      }
    } catch (error) {
      console.error("Error importing video:", error);
      Alert.alert(t("camera.error"), t("liftAnalysis.importError"));
    }
  }, [router, t]);

  const toggleFacing = useCallback(() => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  }, []);

  const toggleFlash = useCallback(() => {
    setFlash((prev) => {
      if (prev === "off") return "on";
      if (prev === "on") return "auto";
      return "off";
    });
  }, []);

  // ─── Permission screen ──────────────────────────────────────

  if (!cameraPermission?.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <View style={styles.permissionContent}>
          <Text style={styles.permissionTitle}>
            {t("camera.permissionRequired")}
          </Text>
          <Text style={styles.permissionDescription}>
            {t("camera.permissionMessage")}
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestCameraPermission}
            activeOpacity={0.7}
          >
            <Text style={styles.permissionButtonText}>
              {t("camera.grantPermission")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.permissionBackButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.permissionBackText}>{t("common.cancel")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Camera UI ───────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
        mode="video"
      />

      {/* Top Controls — absolute over camera */}
      <SafeAreaView style={styles.topControls} edges={["top"]}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <X size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.screenTitle}>{t("liftAnalysis.recordLift")}</Text>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={toggleFlash}
          activeOpacity={0.7}
        >
          {flash === "off" ? (
            <ZapOff size={24} color="#fff" />
          ) : (
            <Zap size={24} color={flash === "auto" ? "#FFD700" : "#fff"} />
          )}
        </TouchableOpacity>
      </SafeAreaView>

      {/* Bottom Controls — absolute over camera */}
      <SafeAreaView style={styles.bottomControls} edges={["bottom"]}>
        {/* Hint */}
        <Text style={styles.hint}>
          {isRecording
            ? t("liftAnalysis.recording")
            : t("liftAnalysis.recordHint")}
        </Text>

        {/* Capture Row */}
        <View style={styles.captureRow}>
          {/* Import button */}
          <TouchableOpacity
            style={styles.sideButton}
            onPress={handleImportVideo}
            activeOpacity={0.7}
            disabled={isRecording}
          >
            <ImagePlus
              size={28}
              color={isRecording ? "rgba(255,255,255,0.3)" : "#fff"}
            />
          </TouchableOpacity>

          {/* Record button */}
          <TouchableOpacity
            style={[
              styles.captureButton,
              isRecording && styles.captureButtonRecording,
            ]}
            onPress={handleCapture}
            activeOpacity={0.7}
          >
            {isRecording ? (
              <Square size={28} color="#fff" fill="#fff" />
            ) : (
              <Circle size={56} color="#FF4444" fill="#FF4444" />
            )}
          </TouchableOpacity>

          {/* Switch Camera */}
          <TouchableOpacity
            style={styles.sideButton}
            onPress={toggleFacing}
            activeOpacity={0.7}
            disabled={isRecording}
          >
            <SwitchCamera
              size={28}
              color={isRecording ? "rgba(255,255,255,0.3)" : "#fff"}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },

  // Permission
  permissionContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionContent: { padding: theme.spacing["2xl"], alignItems: "center" },
  permissionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  permissionDescription: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing["2xl"],
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  permissionButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  permissionBackButton: { paddingVertical: theme.spacing.sm },
  permissionBackText: { color: theme.colors.textSecondary, fontSize: 15 },

  // Top
  topControls: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    zIndex: 10,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  screenTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  // Bottom
  bottomControls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === "ios" ? 20 : 30,
    paddingHorizontal: theme.spacing.lg,
    alignItems: "center",
    zIndex: 10,
  },
  hint: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  captureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  sideButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: "#FF4444",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  captureButtonRecording: {
    borderColor: "#FF4444",
    backgroundColor: "rgba(255,68,68,0.3)",
  },
});
