// ============================================================================
// Athlifyr Mobile — RaceLeaderboard Component (compact, for athlete view)
//
// Shows a compact leaderboard card highlighting the athlete's rank.
// Scrollable list showing top 5 + the athlete ± 2 neighbours.
// ============================================================================

import React, { useMemo } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { Trophy, Medal } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { theme } from "@/src/constants/theme";
import type { LeaderboardEntry, AthleteStatus } from "@/src/hooks/useLiveRace";

interface RaceLeaderboardProps {
  entries: LeaderboardEntry[];
  /** Current user ID to highlight */
  currentUserId?: string;
  /** Max rows to display (default: 10) */
  maxDisplay?: number;
}

function formatTime(ms: number | null): string {
  if (ms == null || ms <= 0) return "--:--:--";
  const secs = Math.floor(ms / 1000);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function statusBadge(status: AthleteStatus): {
  label: string;
  bg: string;
  fg: string;
} {
  switch (status) {
    case "FINISHED":
      return { label: "FIN", bg: theme.colors.success, fg: "#fff" };
    case "OFF_ROUTE":
      return { label: "OFF", bg: theme.colors.warning, fg: "#fff" };
    case "DNF":
      return { label: "DNF", bg: theme.colors.error, fg: "#fff" };
    case "DSQ":
      return { label: "DSQ", bg: theme.colors.error, fg: "#fff" };
    case "INACTIVE":
      return { label: "---", bg: theme.colors.muted, fg: "#fff" };
    default:
      return { label: "", bg: "transparent", fg: "transparent" };
  }
}

export function RaceLeaderboard({
  entries,
  currentUserId,
  maxDisplay = 10,
}: RaceLeaderboardProps) {
  const { t } = useTranslation();

  // Build visible entries: top N plus neighbours around the current user
  const visibleEntries = useMemo(() => {
    if (entries.length <= maxDisplay) return entries;

    const ownIdx = entries.findIndex((e) => e.userId === currentUserId);
    const top = entries.slice(0, Math.min(5, maxDisplay));

    if (ownIdx < 0 || ownIdx < top.length) return top;

    // Add ±2 around the athlete
    const start = Math.max(top.length, ownIdx - 2);
    const end = Math.min(entries.length, ownIdx + 3);
    const neighbourhood = entries.slice(start, end);

    // Deduplicate and mark gap
    const result = [...top];
    if (start > top.length) {
      // There's a gap
      result.push({
        ...entries[start],
        _gap: true,
      } as LeaderboardEntry & { _gap?: boolean });
    }
    for (const e of neighbourhood) {
      if (!result.find((r) => r.userId === e.userId)) {
        result.push(e);
      }
    }
    return result;
  }, [entries, currentUserId, maxDisplay]);

  const renderItem = ({
    item,
  }: {
    item: LeaderboardEntry & { _gap?: boolean };
  }) => {
    const isMe = item.userId === currentUserId;
    const badge = statusBadge(item.status);

    return (
      <View style={[styles.row, isMe && styles.rowHighlighted]}>
        {/* Rank */}
        <View style={styles.rankCol}>
          {item.rank === 1 ? (
            <Trophy size={16} color="#FFD700" />
          ) : item.rank === 2 ? (
            <Medal size={16} color="#C0C0C0" />
          ) : item.rank === 3 ? (
            <Medal size={16} color="#CD7F32" />
          ) : (
            <Text style={styles.rankText}>{item.rank || "--"}</Text>
          )}
        </View>

        {/* Avatar + Name */}
        <View style={styles.nameCol}>
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={styles.avatar}
              alt={item.name || "Athlete"}
              accessibilityLabel={item.name || "Athlete"}
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitial}>
                {(item.name || "?")[0]?.toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.nameInfo}>
            <Text
              style={[styles.name, isMe && styles.nameMe]}
              numberOfLines={1}
            >
              {item.name || t("liveRace.unknownAthlete")}
              {isMe ? ` (${t("liveRace.you")})` : ""}
            </Text>
            {item.bibNumber && (
              <Text style={styles.bib}>#{item.bibNumber}</Text>
            )}
          </View>
        </View>

        {/* Distance / Time */}
        <View style={styles.distCol}>
          {item.status === "FINISHED" ? (
            <Text style={styles.finishTime}>
              {formatTime(item.finishTimeMs)}
            </Text>
          ) : (
            <Text style={styles.distance}>
              {(item.distanceAlongRouteM / 1000).toFixed(1)}km
            </Text>
          )}
        </View>

        {/* Status badge */}
        {badge.label !== "" && (
          <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.statusBadgeText, { color: badge.fg }]}>
              {badge.label}
            </Text>
          </View>
        )}

        {/* Gap */}
        {item.gap && <Text style={styles.gap}>{item.gap}</Text>}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Trophy size={14} color={theme.colors.primary} />
        <Text style={styles.title}>{t("liveRace.leaderboardTitle")}</Text>
        <Text style={styles.count}>{entries.length}</Text>
      </View>
      <FlatList
        data={visibleEntries}
        keyExtractor={(item) => item.userId}
        renderItem={renderItem}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
  },
  count: {
    fontSize: 12,
    color: theme.colors.muted,
    marginLeft: "auto",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 8,
    gap: 8,
  },
  rowHighlighted: {
    backgroundColor: theme.colors.primary + "15",
    borderWidth: 1,
    borderColor: theme.colors.primary + "30",
  },
  rankCol: {
    width: 28,
    alignItems: "center",
  },
  rankText: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.muted,
    fontVariant: ["tabular-nums"],
  },
  nameCol: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  avatarPlaceholder: {
    backgroundColor: theme.colors.primary + "30",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  nameInfo: {
    flex: 1,
  },
  name: {
    fontSize: 13,
    fontWeight: "500",
    color: theme.colors.text,
  },
  nameMe: {
    fontWeight: "700",
    color: theme.colors.primary,
  },
  bib: {
    fontSize: 10,
    color: theme.colors.muted,
  },
  distCol: {
    alignItems: "flex-end",
  },
  distance: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.text,
    fontVariant: ["tabular-nums"],
  },
  finishTime: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.success,
    fontVariant: ["tabular-nums"],
  },
  statusBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: "700",
  },
  gap: {
    fontSize: 10,
    color: theme.colors.muted,
    fontVariant: ["tabular-nums"],
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 2,
  },
});
