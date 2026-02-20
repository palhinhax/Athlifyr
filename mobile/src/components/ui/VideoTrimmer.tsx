/**
 * VideoTrimmer — A visual video trimmer for selecting a ≤30s sub-clip.
 *
 * Shows a thumbnail timeline with draggable start/end handles.
 * The actual trimming is done server-side via the trim_start_sec/trim_end_sec
 * parameters — this component only provides the UI for selecting the range.
 *
 * IMPORTANT: This component does NOT create its own video player to avoid
 * native crashes from multiple expo-video instances on the same file.
 * It uses a static preview thumbnail instead.
 */

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  PanResponder,
  ActivityIndicator,
} from "react-native";
import * as VideoThumbnails from "expo-video-thumbnails";
import { Scissors, Check, RotateCcw } from "lucide-react-native";
import { theme } from "@/src/constants/theme";

const SCREEN_WIDTH = Dimensions.get("window").width;
const TIMELINE_PADDING = 24;
const TIMELINE_WIDTH = SCREEN_WIDTH - TIMELINE_PADDING * 2;
const HANDLE_WIDTH = 16;
const THUMBNAIL_COUNT = 6;
const MAX_TRIM_DURATION_SEC = 30;
const MIN_TRIM_DURATION_SEC = 1;
/** Small delay (ms) between thumbnail extractions to avoid native OOM */
const THUMB_DELAY_MS = 200;

export interface TrimRange {
  startSec: number;
  endSec: number;
}

interface VideoTrimmerProps {
  videoUri: string;
  durationMs: number;
  onConfirm: (trimRange: TrimRange | null) => void;
  onCancel: () => void;
  confirmLabel: string;
  cancelLabel: string;
  trimLabel: string;
  tooLongLabel: string;
  maxDurationLabel: string;
  resetLabel: string;
}

export function VideoTrimmer({
  videoUri,
  durationMs,
  onConfirm,
  onCancel,
  confirmLabel,
  cancelLabel,
  trimLabel,
  tooLongLabel,
  maxDurationLabel,
  resetLabel,
}: VideoTrimmerProps) {
  console.log("[VideoTrimmer] ── MOUNT ──", {
    videoUri: videoUri ? videoUri.substring(0, 120) : "(empty)",
    uriScheme: videoUri ? videoUri.split("://")[0] : "(none)",
    durationMs,
    durationMsType: typeof durationMs,
    isFinite: Number.isFinite(durationMs),
  });

  // Guard: if durationMs is invalid, fall back to a safe default
  const safeDurationMs =
    Number.isFinite(durationMs) && durationMs > 0 ? durationMs : 10000;

  if (safeDurationMs !== durationMs) {
    console.warn("[VideoTrimmer] ⚠️ durationMs was invalid, using fallback:", {
      original: durationMs,
      fallback: safeDurationMs,
    });
  }

  const durationSec = safeDurationMs / 1000;
  const needsTrim = durationSec > MAX_TRIM_DURATION_SEC;

  // Trim state (in seconds)
  const [startSec, setStartSec] = useState(0);
  const [endSec, setEndSec] = useState(
    Math.min(durationSec, MAX_TRIM_DURATION_SEC)
  );

  // Thumbnails
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [loadingThumbnails, setLoadingThumbnails] = useState(true);
  // Static preview thumbnail (shown instead of a live video player)
  const [previewThumb, setPreviewThumb] = useState<string | null>(null);

  // Log component lifecycle
  useEffect(() => {
    console.log("[VideoTrimmer] ✅ Component mounted");
    return () => {
      console.log("[VideoTrimmer] 🔴 Component UNMOUNTING");
    };
  }, []);

  // Track which handle is being dragged
  const draggingRef = useRef<"start" | "end" | null>(null);

  // ─── Generate thumbnails ─────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function generateThumbnails() {
      console.log("[VideoTrimmer] Starting thumbnail generation", {
        videoUri: videoUri ? videoUri.substring(0, 60) : "(empty)",
        durationMs: safeDurationMs,
        thumbnailCount: THUMBNAIL_COUNT,
      });
      setLoadingThumbnails(true);
      const thumbs: string[] = [];

      for (let i = 0; i < THUMBNAIL_COUNT; i++) {
        if (cancelled) return;
        const time = (safeDurationMs / THUMBNAIL_COUNT) * i + 100; // offset 100ms
        const clampedTime = Math.min(time, safeDurationMs - 100);
        try {
          console.log(
            `[VideoTrimmer] Generating thumbnail ${i + 1}/${THUMBNAIL_COUNT} at ${clampedTime.toFixed(0)}ms`
          );
          const thumb = await VideoThumbnails.getThumbnailAsync(videoUri, {
            time: clampedTime,
            quality: 0.2,
          });
          thumbs.push(thumb.uri);

          // Set the first thumbnail as the initial preview
          if (i === 0 && thumb.uri) {
            setPreviewThumb(thumb.uri);
          }
        } catch (err) {
          console.warn(`[VideoTrimmer] ⚠️ Thumbnail ${i + 1} failed:`, err);
          thumbs.push("");
        }

        // Small delay between extractions to avoid overwhelming the native layer
        if (i < THUMBNAIL_COUNT - 1 && !cancelled) {
          await new Promise((r) => setTimeout(r, THUMB_DELAY_MS));
        }
      }

      if (!cancelled) {
        console.log(
          `[VideoTrimmer] ✅ Thumbnails done: ${thumbs.filter(Boolean).length}/${THUMBNAIL_COUNT} succeeded`
        );
        setThumbnails(thumbs);
        setLoadingThumbnails(false);
      }
    }

    generateThumbnails().catch((err) => {
      console.error("[VideoTrimmer] ❌ generateThumbnails threw:", err);
      setLoadingThumbnails(false);
    });
    return () => {
      cancelled = true;
    };
  }, [videoUri, safeDurationMs]);

  // ─── Update preview thumb when start handle moves ────────────
  useEffect(() => {
    let cancelled = false;
    const timeMs = Math.max(0, startSec * 1000);

    async function updatePreview() {
      try {
        const thumb = await VideoThumbnails.getThumbnailAsync(videoUri, {
          time: timeMs,
          quality: 0.5,
        });
        if (!cancelled) setPreviewThumb(thumb.uri);
      } catch {
        // silently ignore — keeps the previous preview
      }
    }

    // Debounce: only update preview after user stops dragging for 300ms
    const timer = setTimeout(updatePreview, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [startSec, videoUri]);

  // ─── Position helpers ────────────────────────────────────────
  const secToX = useCallback(
    (sec: number) => {
      return (sec / durationSec) * TIMELINE_WIDTH;
    },
    [durationSec]
  );

  const xToSec = useCallback(
    (x: number) => {
      return Math.max(
        0,
        Math.min(durationSec, (x / TIMELINE_WIDTH) * durationSec)
      );
    },
    [durationSec]
  );

  // ─── Pan responders for handles ──────────────────────────────
  // We keep refs that are updated in sync with state so that PanResponder
  // callbacks (which are memoised once) always read the latest values.
  const startHandleRef = useRef(startSec);
  const endHandleRef = useRef(endSec);

  // Keep refs in sync
  useEffect(() => {
    startHandleRef.current = startSec;
    endHandleRef.current = endSec;
  }, [startSec, endSec]);

  // Capture the handle's X position at the moment the finger lands.
  // All subsequent `dx` values are relative to this anchor, which avoids
  // the compounding drift that caused handles to snap to the extremes.
  const dragAnchorXRef = useRef(0);

  const startPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          draggingRef.current = "start";
          dragAnchorXRef.current = secToX(startHandleRef.current);
        },
        onPanResponderMove: (_, gestureState) => {
          const newX = dragAnchorXRef.current + gestureState.dx;
          let newStartSec = xToSec(newX);

          // Enforce min/max constraints
          const maxStart = endHandleRef.current - MIN_TRIM_DURATION_SEC;
          newStartSec = Math.max(0, Math.min(maxStart, newStartSec));

          // Enforce max duration
          if (endHandleRef.current - newStartSec > MAX_TRIM_DURATION_SEC) {
            newStartSec = endHandleRef.current - MAX_TRIM_DURATION_SEC;
          }

          setStartSec(Math.round(newStartSec * 10) / 10);
        },
        onPanResponderRelease: () => {
          draggingRef.current = null;
        },
      }),
    [secToX, xToSec]
  );

  const endPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          draggingRef.current = "end";
          dragAnchorXRef.current = secToX(endHandleRef.current);
        },
        onPanResponderMove: (_, gestureState) => {
          const newX = dragAnchorXRef.current + gestureState.dx;
          let newEndSec = xToSec(newX);

          // Enforce min/max constraints
          const minEnd = startHandleRef.current + MIN_TRIM_DURATION_SEC;
          newEndSec = Math.max(minEnd, Math.min(durationSec, newEndSec));

          // Enforce max duration
          if (newEndSec - startHandleRef.current > MAX_TRIM_DURATION_SEC) {
            newEndSec = startHandleRef.current + MAX_TRIM_DURATION_SEC;
          }

          setEndSec(Math.round(newEndSec * 10) / 10);
        },
        onPanResponderRelease: () => {
          draggingRef.current = null;
        },
      }),
    [secToX, xToSec, durationSec]
  );

  // ─── Computed values ─────────────────────────────────────────
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
    // If the video doesn't need trimming and user didn't change defaults, pass null
    if (!needsTrim && startSec === 0 && endSec >= durationSec - 0.5) {
      onConfirm(null);
    } else {
      onConfirm({ startSec, endSec });
    }
  }, [startSec, endSec, durationSec, needsTrim, onConfirm]);

  // ─── Render ──────────────────────────────────────────────────
  const startX = secToX(startSec);
  const endX = secToX(endSec);
  const thumbWidth = TIMELINE_WIDTH / THUMBNAIL_COUNT;

  console.log("[VideoTrimmer] ── RENDER ──", {
    startSec,
    endSec,
    trimDuration,
    isValidTrim,
    startX,
    endX,
    thumbWidth,
    thumbnailsLoaded: thumbnails.length,
    loadingThumbnails,
    hasPreview: !!previewThumb,
  });

  return (
    <View style={styles.container}>
      {/* Static Preview — uses a thumbnail instead of a live video player */}
      <View style={styles.videoContainer}>
        {previewThumb ? (
          <Image
            source={{ uri: previewThumb }}
            style={styles.video}
            resizeMode="contain"
            alt=""
          />
        ) : (
          <View style={styles.videoPlaceholder}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.videoPlaceholderText}>Loading preview…</Text>
          </View>
        )}
        {/* Time badge on the preview */}
        <View style={styles.previewTimeBadge}>
          <Text style={styles.previewTimeBadgeText}>
            {formatTime(startSec)} – {formatTime(endSec)}
          </Text>
        </View>
      </View>

      {/* Trim info banner */}
      {needsTrim && (
        <View style={styles.infoBanner}>
          <Scissors size={16} color={theme.colors.warning} />
          <Text style={styles.infoBannerText}>
            {tooLongLabel} {maxDurationLabel}
          </Text>
        </View>
      )}

      {/* Timeline with thumbnails */}
      <View style={styles.timelineContainer}>
        <View style={styles.timeline}>
          {/* Thumbnails */}
          {loadingThumbnails ? (
            <View style={styles.thumbnailsLoading}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          ) : (
            <View style={styles.thumbnailsRow}>
              {thumbnails.map((uri, i) => (
                <View
                  key={i}
                  style={[styles.thumbnailWrapper, { width: thumbWidth }]}
                >
                  {uri ? (
                    <Image
                      source={{ uri }}
                      style={styles.thumbnail}
                      resizeMode="cover"
                      alt=""
                    />
                  ) : (
                    <View
                      style={[styles.thumbnail, styles.thumbnailPlaceholder]}
                    />
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Dimmed overlay — left of start */}
          <View style={[styles.dimOverlay, { left: 0, width: startX }]} />

          {/* Dimmed overlay — right of end */}
          <View
            style={[
              styles.dimOverlay,
              { left: endX, width: TIMELINE_WIDTH - endX },
            ]}
          />

          {/* Selected range border */}
          <View
            style={[
              styles.selectedRange,
              {
                left: startX,
                width: endX - startX,
              },
            ]}
          />

          {/* Start handle */}
          <View
            {...startPanResponder.panHandlers}
            style={[
              styles.handle,
              styles.handleStart,
              { left: startX - HANDLE_WIDTH / 2 },
            ]}
          >
            <View style={styles.handleBar} />
          </View>

          {/* End handle */}
          <View
            {...endPanResponder.panHandlers}
            style={[
              styles.handle,
              styles.handleEnd,
              { left: endX - HANDLE_WIDTH / 2 },
            ]}
          >
            <View style={styles.handleBar} />
          </View>
        </View>

        {/* Time labels */}
        <View style={styles.timeLabels}>
          <Text style={styles.timeLabel}>{formatTime(startSec)}</Text>
          <Text style={styles.timeDuration}>
            {trimLabel}: {formatTime(trimDuration)}
          </Text>
          <Text style={styles.timeLabel}>{formatTime(endSec)}</Text>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onCancel}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>{cancelLabel}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
          activeOpacity={0.7}
        >
          <RotateCcw size={18} color={theme.colors.textSecondary} />
          <Text style={styles.resetButtonText}>{resetLabel}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            !isValidTrim && styles.primaryButtonDisabled,
          ]}
          onPress={handleConfirm}
          activeOpacity={0.7}
          disabled={!isValidTrim}
        >
          <Check size={18} color="#fff" />
          <Text style={styles.primaryButtonText}>{confirmLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  videoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  videoPlaceholderText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
  },
  previewTimeBadge: {
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  previewTimeBadgeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: TIMELINE_PADDING,
    paddingVertical: 8,
    backgroundColor: "rgba(245, 158, 11, 0.15)",
  },
  infoBannerText: {
    color: theme.colors.warning,
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  timelineContainer: {
    paddingHorizontal: TIMELINE_PADDING,
    paddingVertical: 12,
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  timeline: {
    height: 56,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  thumbnailsRow: {
    flexDirection: "row",
    height: "100%",
  },
  thumbnailsLoading: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  thumbnailWrapper: {
    height: "100%",
    overflow: "hidden",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  thumbnailPlaceholder: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  dimOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    zIndex: 1,
  },
  selectedRange: {
    position: "absolute",
    top: 0,
    bottom: 0,
    borderTopWidth: 3,
    borderBottomWidth: 3,
    borderColor: theme.colors.primary,
    zIndex: 2,
  },
  handle: {
    position: "absolute",
    top: -4,
    bottom: -4,
    width: HANDLE_WIDTH,
    zIndex: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  handleStart: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  handleEnd: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  handleBar: {
    width: 3,
    height: 20,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  timeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  timeLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontFamily: "monospace",
  },
  timeDuration: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: TIMELINE_PADDING,
    paddingVertical: 12,
    paddingBottom: 24,
    backgroundColor: "rgba(0,0,0,0.9)",
    gap: 10,
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  secondaryButtonText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "500",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  resetButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
