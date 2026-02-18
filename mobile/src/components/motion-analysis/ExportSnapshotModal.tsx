/**
 * ExportSnapshotModal — captures a static frame of the motion analysis
 * (video thumbnail + stickman overlay + watermark) and shares it as PNG.
 *
 * Uses expo-video-thumbnails to extract the video frame (avoids the
 * VideoView capture limitation), renders everything in an off-screen
 * view, then captures with captureRef.
 */
import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Text,
  Dimensions,
} from "react-native";
import * as VideoThumbnails from "expo-video-thumbnails";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";
import { theme } from "@/src/constants/theme";
import { StickmanRenderer } from "./StickmanRenderer";
import { WatermarkLogo } from "@/src/components/WatermarkLogo";
import type { PoseFrame, PoseVideoMeta } from "@/src/types/motion-analysis";

const SNAP_WIDTH = Dimensions.get("window").width;
const SNAP_HEIGHT = Math.round(SNAP_WIDTH * (16 / 9));

interface ExportSnapshotModalProps {
  videoUri: string;
  /** Absolute timestamp in the video (ms) to capture */
  timestampMs: number;
  poseFrame: PoseFrame | null;
  videoMeta?: PoseVideoMeta;
  visible: boolean;
  onDone: () => void;
  onError: (msg: string) => void;
}

export function ExportSnapshotModal({
  videoUri,
  timestampMs,
  poseFrame,
  videoMeta,
  visible,
  onDone,
  onError,
}: ExportSnapshotModalProps) {
  const captureViewRef = useRef<View>(null);
  const [thumbUri, setThumbUri] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "capturing" | "done">(
    "loading"
  );

  // When modal opens: extract thumbnail, then capture, then share
  useEffect(() => {
    if (!visible) {
      setThumbUri(null);
      setStatus("loading");
      return;
    }

    let cancelled = false;

    async function run() {
      try {
        // 1. Get the video frame as a static image
        setStatus("loading");
        const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
          time: timestampMs,
          quality: 1,
        });
        if (cancelled) return;
        setThumbUri(uri);

        // 2. Wait one frame for the Image to render
        setStatus("capturing");
        await new Promise<void>((r) => setTimeout(r, 300));
        if (cancelled) return;

        // 3. Capture the composed view
        const snapUri = await captureRef(captureViewRef, {
          format: "png",
          quality: 1,
          width: SNAP_WIDTH,
          height: SNAP_HEIGHT,
        });
        if (cancelled) return;

        // 4. Share
        const available = await Sharing.isAvailableAsync();
        if (!available) {
          onError("Sharing not available on this device.");
          onDone();
          return;
        }
        await Sharing.shareAsync(snapUri, {
          mimeType: "image/png",
          dialogTitle: "Athlifyr Motion Analysis",
          UTI: "public.png",
        });

        setStatus("done");
        onDone();
      } catch (err) {
        if (cancelled) return;
        console.error("[ExportSnapshot] Failed:", err);
        onError("Failed to export snapshot.");
        onDone();
      }
    }

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, videoUri, timestampMs]);

  const videoAspectRatio =
    videoMeta && videoMeta.videoWidth > 0 && videoMeta.videoHeight > 0
      ? videoMeta.videoWidth / videoMeta.videoHeight
      : undefined;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      {/* Loading overlay shown to user */}
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>
          {status === "loading" ? "A extrair frame…" : "A exportar…"}
        </Text>
      </View>

      {/* Off-screen compositing view — positioned off-screen so it renders */}
      <View
        ref={captureViewRef}
        collapsable={false}
        style={styles.snapContainer}
      >
        {thumbUri && (
          <Image
            source={{ uri: thumbUri }}
            style={styles.snapImage}
            resizeMode="cover"
            accessible={false}
          />
        )}
        {thumbUri && poseFrame && (
          <StickmanRenderer
            frame={poseFrame}
            width={SNAP_WIDTH}
            height={SNAP_HEIGHT}
            mode="overlay"
            videoAspectRatio={videoAspectRatio}
          />
        )}
        <WatermarkLogo opacity={0.85} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
  snapContainer: {
    position: "absolute",
    // Render off-screen (below screen) so it's in the layout tree but not visible
    top: 9999,
    left: 0,
    width: SNAP_WIDTH,
    height: SNAP_HEIGHT,
    backgroundColor: "#000",
    overflow: "hidden",
  },
  snapImage: {
    width: SNAP_WIDTH,
    height: SNAP_HEIGHT,
  },
});
