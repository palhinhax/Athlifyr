import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import {
  CameraView,
  CameraType,
  CameraMode,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { Image as ExpoImage } from "expo-image";
import { useVideoPlayer, VideoView } from "expo-video";
import {
  X,
  SwitchCamera,
  Circle,
  Zap,
  ZapOff,
  Image as ImageIcon,
  Video,
  Square,
  Activity,
  ImagePlus,
  Sparkles,
} from "lucide-react-native";
import { theme } from "@/src/constants/theme";

type FlashMode = "on" | "off" | "auto";
/** Unified mode that keeps all options on the same screen */
type AppCameraMode = "photo" | "video" | "lift" | "motion";

export default function CameraScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();

  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [appMode, setAppMode] = useState<AppCameraMode>("photo");
  const [isRecording, setIsRecording] = useState(false);
  const [isTakingPicture, setIsTakingPicture] = useState(false);

  /** Last captured media (thumbnail + type) shown to the left of the shutter */
  const [lastMedia, setLastMedia] = useState<{
    uri: string;
    type: "photo" | "video";
  } | null>(null);

  /** Full-screen preview of the last capture */
  const [previewVisible, setPreviewVisible] = useState(false);

  /** The CameraView mode — lift uses "video" under the hood */
  const cameraMode: CameraMode = appMode === "photo" ? "picture" : "video";

  // ─── Permission handling ─────────────────────────────────────

  const ensurePermissions = useCallback(async () => {
    if (!cameraPermission?.granted) {
      const camResult = await requestCameraPermission();
      if (!camResult.granted) return false;
    }
    if (!micPermission?.granted) {
      const micResult = await requestMicPermission();
      if (!micResult.granted && cameraMode === "video") return false;
    }
    return true;
  }, [
    cameraPermission,
    micPermission,
    requestCameraPermission,
    requestMicPermission,
    cameraMode,
  ]);

  // ─── Camera actions ──────────────────────────────────────────

  const handleTakePicture = useCallback(async () => {
    if (!cameraRef.current || isTakingPicture) return;
    const hasPerms = await ensurePermissions();
    if (!hasPerms) {
      Alert.alert(
        t("camera.permissionRequired"),
        t("camera.permissionMessage")
      );
      return;
    }

    setIsTakingPicture(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.9,
        exif: true,
      });
      if (photo?.uri) {
        await MediaLibrary.saveToLibraryAsync(photo.uri);
        setLastMedia({ uri: photo.uri, type: "photo" });
      }
    } catch (error) {
      console.error("Error taking picture:", error);
      Alert.alert(t("camera.error"), t("camera.photoError"));
    } finally {
      setIsTakingPicture(false);
    }
  }, [isTakingPicture, ensurePermissions, t]);

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
      const maxDuration = appMode === "lift" || appMode === "motion" ? 30 : 60;
      const video = await cameraRef.current.recordAsync({ maxDuration });
      if (video?.uri) {
        if (appMode === "lift") {
          // Save to library, then navigate to lift analysis
          await MediaLibrary.saveToLibraryAsync(video.uri);
          router.push({
            pathname: "/lift-analysis",
            params: { videoUri: video.uri },
          });
        } else if (appMode === "motion") {
          // Save to library, then navigate to motion analysis
          await MediaLibrary.saveToLibraryAsync(video.uri);
          router.push({
            pathname: "/motion-analysis",
            params: { videoUri: video.uri },
          });
        } else {
          await MediaLibrary.saveToLibraryAsync(video.uri);
          setLastMedia({ uri: video.uri, type: "video" });
        }
      }
    } catch (error) {
      console.error("Error recording video:", error);
      Alert.alert(t("camera.error"), t("camera.videoError"));
    } finally {
      setIsRecording(false);
    }
  }, [isRecording, ensurePermissions, t, appMode, router]);

  const handleStopRecording = useCallback(() => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  }, [isRecording]);

  const handleCapture = useCallback(() => {
    if (appMode === "photo") {
      handleTakePicture();
    } else {
      if (isRecording) {
        handleStopRecording();
      } else {
        handleStartRecording();
      }
    }
  }, [
    appMode,
    isRecording,
    handleTakePicture,
    handleStartRecording,
    handleStopRecording,
  ]);

  /** Import a video from the gallery for lift or motion analysis */
  const handleImportVideo = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["videos"],
        quality: 1,
        videoMaxDuration: 30,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        const targetPath =
          appMode === "motion" ? "/motion-analysis" : "/lift-analysis";
        router.push({
          pathname: targetPath,
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
  }, [router, t, appMode]);

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

  const handleSetMode = useCallback(
    (newMode: AppCameraMode) => {
      if (!isRecording) setAppMode(newMode);
    },
    [isRecording]
  );

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

  /** Whether the current mode records video (video or lift) */
  const isVideoMode = appMode !== "photo";

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
        mode={cameraMode}
      />

      {/* Top Controls — positioned absolutely over the camera */}
      <SafeAreaView style={styles.topControls} edges={["top"]}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <X size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={toggleFlash}
          activeOpacity={0.7}
        >
          {flash === "off" ? (
            <ZapOff size={24} color="#fff" />
          ) : (
            <View style={styles.flashIndicator}>
              <Zap size={24} color={flash === "auto" ? "#FFD700" : "#fff"} />
              {flash === "auto" && <Text style={styles.flashAutoText}>A</Text>}
            </View>
          )}
        </TouchableOpacity>
      </SafeAreaView>

      {/* Bottom Controls — positioned absolutely over the camera */}
      <SafeAreaView style={styles.bottomControls} edges={["bottom"]}>
        {/* Hint text for lift or motion mode */}
        {(appMode === "lift" || appMode === "motion") && (
          <Text style={styles.hint}>
            {isRecording
              ? t("liftAnalysis.recording")
              : appMode === "motion"
                ? t("motionAnalysis.recordHint")
                : t("liftAnalysis.recordHint")}
          </Text>
        )}

        {/* Mode Toggle — always visible with 3 options */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              appMode === "photo" && styles.modeButtonActive,
            ]}
            onPress={() => handleSetMode("photo")}
            activeOpacity={0.7}
          >
            <ImageIcon
              size={16}
              color={appMode === "photo" ? "#fff" : "rgba(255,255,255,0.6)"}
            />
            <Text
              style={[
                styles.modeText,
                appMode === "photo" && styles.modeTextActive,
              ]}
            >
              {t("camera.photo")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              appMode === "video" && styles.modeButtonActive,
            ]}
            onPress={() => handleSetMode("video")}
            activeOpacity={0.7}
          >
            <Video
              size={16}
              color={appMode === "video" ? "#fff" : "rgba(255,255,255,0.6)"}
            />
            <Text
              style={[
                styles.modeText,
                appMode === "video" && styles.modeTextActive,
              ]}
            >
              {t("camera.video")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              appMode === "lift" && styles.modeButtonActive,
            ]}
            onPress={() => handleSetMode("lift")}
            activeOpacity={0.7}
          >
            <Activity
              size={16}
              color={appMode === "lift" ? "#fff" : "rgba(255,255,255,0.6)"}
            />
            <Text
              style={[
                styles.modeText,
                appMode === "lift" && styles.modeTextActive,
              ]}
            >
              {t("camera.liftAnalysis")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              appMode === "motion" && styles.modeButtonActive,
            ]}
            onPress={() => handleSetMode("motion")}
            activeOpacity={0.7}
          >
            <Sparkles
              size={16}
              color={appMode === "motion" ? "#fff" : "rgba(255,255,255,0.6)"}
            />
            <Text
              style={[
                styles.modeText,
                appMode === "motion" && styles.modeTextActive,
              ]}
            >
              {t("camera.motionAnalysis")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Capture Row */}
        <View style={styles.captureRow}>
          {/* Left side button: import (lift/motion mode) or spacer */}
          {appMode === "lift" || appMode === "motion" ? (
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
          ) : lastMedia ? (
            <TouchableOpacity
              style={styles.thumbnailButton}
              onPress={() => setPreviewVisible(true)}
              activeOpacity={0.7}
            >
              <ExpoImage
                source={{ uri: lastMedia.uri }}
                style={styles.thumbnailImage}
                contentFit="cover"
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.sideButton} />
          )}

          {/* Capture Button */}
          <TouchableOpacity
            style={[
              styles.captureButton,
              isVideoMode && styles.captureButtonVideo,
              isRecording && styles.captureButtonRecording,
            ]}
            onPress={handleCapture}
            activeOpacity={0.7}
            disabled={isTakingPicture}
          >
            {isRecording ? (
              <Square size={28} color="#fff" fill="#fff" />
            ) : (
              <Circle
                size={appMode === "photo" ? 60 : 56}
                color={appMode === "photo" ? "#fff" : "#FF4444"}
                fill={appMode === "photo" ? "#fff" : "#FF4444"}
              />
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

      {/* Full-screen preview of last capture */}
      <Modal
        visible={previewVisible}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setPreviewVisible(false)}
      >
        <View style={styles.previewContainer}>
          {lastMedia?.type === "photo" ? (
            <ExpoImage
              source={{ uri: lastMedia.uri }}
              style={StyleSheet.absoluteFill}
              contentFit="contain"
            />
          ) : lastMedia?.type === "video" ? (
            <PreviewVideo uri={lastMedia.uri} />
          ) : null}

          <SafeAreaView style={styles.previewTopBar} edges={["top"]}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setPreviewVisible(false)}
              activeOpacity={0.7}
            >
              <X size={28} color="#fff" />
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

/** Small helper component so the video player is only created when the modal is visible */
function PreviewVideo({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.play();
  });

  return (
    <VideoView player={player} style={StyleSheet.absoluteFill} nativeControls />
  );
}

// ─── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },

  // Permission screen
  permissionContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionContent: {
    padding: theme.spacing["2xl"],
    alignItems: "center",
  },
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
  permissionButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  permissionBackButton: {
    paddingVertical: theme.spacing.sm,
  },
  permissionBackText: {
    color: theme.colors.textSecondary,
    fontSize: 15,
  },

  // Top controls
  topControls: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
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
  flashIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  flashAutoText: {
    color: "#FFD700",
    fontSize: 10,
    fontWeight: "700",
    marginLeft: -4,
    marginTop: -8,
  },

  // Bottom controls
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
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },

  // Mode toggle
  modeToggle: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 4,
    marginBottom: theme.spacing.lg,
  },
  modeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 16,
  },
  modeButtonActive: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  modeText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    fontWeight: "600",
  },
  modeTextActive: {
    color: "#fff",
  },

  // Capture row
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
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  captureButtonVideo: {
    borderColor: "#FF4444",
  },
  captureButtonRecording: {
    borderColor: "#FF4444",
    backgroundColor: "rgba(255,68,68,0.3)",
  },

  // Thumbnail preview (left of shutter)
  thumbnailButton: {
    width: 50,
    height: 50,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
    marginHorizontal: 20,
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },

  // Full-screen preview modal
  previewContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  previewTopBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    zIndex: 10,
  },
});
