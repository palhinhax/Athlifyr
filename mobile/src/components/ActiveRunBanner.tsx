// ============================================================================
// Athlifyr Mobile — ActiveRunBanner
//
// Floating banner shown at the top of every screen while a free-run is active.
// Tapping it navigates back to the free-run screen.
// Shows elapsed time and distance in a compact pill.
// ============================================================================

import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Play } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFreeRunSession } from "@/src/lib/free-run-session-store";
import { theme } from "@/src/constants/theme";

function formatElapsed(ms: number): string {
  if (ms <= 0) return "00:00";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(2)}km`;
}

export function ActiveRunBanner() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const isActive = useFreeRunSession((s) => s.isActive);
  const stats = useFreeRunSession((s) => s.stats);

  // Blinking dot animation
  const [dotVisible, setDotVisible] = useState(true);
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => setDotVisible((v) => !v), 500);
    return () => clearInterval(interval);
  }, [isActive]);

  // Don't show on the free-run screen itself
  if (!isActive || pathname === "/free-run") return null;

  return (
    <TouchableOpacity
      style={[styles.container, { top: insets.top }]}
      onPress={() => router.push("/free-run")}
      activeOpacity={0.8}
    >
      <View style={styles.dot}>
        {dotVisible && <View style={styles.dotInner} />}
      </View>
      <Play size={14} color="#fff" fill="#fff" />
      <Text style={styles.time}>{formatElapsed(stats.elapsedTimeMs)}</Text>
      <View style={styles.separator} />
      <Text style={styles.distance}>{formatDistance(stats.distanceM)}</Text>
      <Text style={styles.tapHint}>Toque para voltar</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 12,
    right: 12,
    zIndex: 9999,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  dotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ff3b30",
  },
  time: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 6,
  },
  separator: {
    width: 1,
    height: 16,
    backgroundColor: "rgba(255,255,255,0.4)",
    marginHorizontal: 10,
  },
  distance: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  tapHint: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    marginLeft: "auto",
  },
});
