import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import {
  usePerformance,
  formatTime,
  formatPace,
  type PerformanceEntry,
} from "@/src/hooks/usePerformance";

interface PerformanceEntriesListProps {
  entries: PerformanceEntry[];
  type: "RUN" | "TRAIL" | "STRENGTH" | "HYROX";
}

const INITIAL_DISPLAY = 3;

export function PerformanceEntriesList({
  entries,
  type,
}: PerformanceEntriesListProps) {
  const { t } = useTranslation();
  const { deleteEntry, isDeleting } = usePerformance();
  const [expanded, setExpanded] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredEntries = entries
    .filter((e) => e.type === type)
    .sort(
      (a, b) =>
        new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime()
    );

  if (filteredEntries.length === 0) return null;

  const displayEntries = expanded
    ? filteredEntries
    : filteredEntries.slice(0, INITIAL_DISPLAY);

  const handleDelete = (id: string) => {
    Alert.alert(
      t("performance.entries.deleteTitle"),
      t("performance.entries.deleteDescription"),
      [
        { text: t("performance.cancel"), style: "cancel" },
        {
          text: t("performance.entries.delete"),
          style: "destructive",
          onPress: async () => {
            setDeletingId(id);
            try {
              await deleteEntry(id);
            } catch {
              Alert.alert(
                t("performance.error"),
                t("performance.entries.deleteError")
              );
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderRunEntry = (entry: PerformanceEntry) => (
    <View style={styles.entryDetails}>
      {entry.distanceKm != null && (
        <Text style={styles.entryDetail}>
          📏 {entry.distanceKm.toFixed(1)} km
        </Text>
      )}
      {entry.timeSeconds != null && (
        <Text style={styles.entryDetail}>
          ⏱️ {formatTime(entry.timeSeconds)}
        </Text>
      )}
      {entry.timeSeconds != null &&
        entry.distanceKm != null &&
        entry.distanceKm > 0 && (
          <Text style={styles.entryDetail}>
            🏃 {formatPace(entry.timeSeconds / entry.distanceKm)}/km
          </Text>
        )}
      {entry.elevationGainM != null && entry.elevationGainM > 0 && (
        <Text style={styles.entryDetail}>⛰️ {entry.elevationGainM}m</Text>
      )}
    </View>
  );

  const renderStrengthEntry = (entry: PerformanceEntry) => (
    <View style={styles.entryDetails}>
      {entry.exerciseName && (
        <Text style={styles.entryDetail}>🏋️ {entry.exerciseName}</Text>
      )}
      {entry.reps != null && (
        <Text style={styles.entryDetail}>🔄 {entry.reps} reps</Text>
      )}
      {entry.weightKg != null && (
        <Text style={styles.entryDetail}>⚖️ {entry.weightKg} kg</Text>
      )}
    </View>
  );

  const renderHyroxEntry = (entry: PerformanceEntry) => (
    <View style={styles.entryDetails}>
      {entry.timeSeconds != null && (
        <Text style={styles.entryDetail}>
          ⏱️ {formatTime(entry.timeSeconds)}
        </Text>
      )}
      {entry.hyroxCategory && (
        <Text style={styles.entryDetail}>🏆 {entry.hyroxCategory}</Text>
      )}
    </View>
  );

  const renderEntryContent = (entry: PerformanceEntry) => {
    switch (type) {
      case "RUN":
      case "TRAIL":
        return renderRunEntry(entry);
      case "STRENGTH":
        return renderStrengthEntry(entry);
      case "HYROX":
        return renderHyroxEntry(entry);
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t("performance.entries.title")} ({filteredEntries.length})
      </Text>

      {displayEntries.map((entry) => (
        <View key={entry.id} style={styles.entryCard}>
          <View style={styles.entryContent}>
            <Text style={styles.entryDate}>
              {formatDate(entry.performedAt)}
            </Text>
            {renderEntryContent(entry)}
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(entry.id)}
            disabled={isDeleting && deletingId === entry.id}
          >
            {isDeleting && deletingId === entry.id ? (
              <ActivityIndicator size="small" color={theme.colors.error} />
            ) : (
              <Trash2 size={18} color={theme.colors.error} />
            )}
          </TouchableOpacity>
        </View>
      ))}

      {filteredEntries.length > INITIAL_DISPLAY && (
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <ChevronUp size={18} color={theme.colors.primary} />
          ) : (
            <ChevronDown size={18} color={theme.colors.primary} />
          )}
          <Text style={styles.toggleText}>
            {expanded
              ? t("performance.entries.showLess")
              : t("performance.entries.showMore")}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  entryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
  },
  entryContent: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  entryDate: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textTertiary,
  },
  entryDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  entryDetail: {
    fontSize: 14,
    color: theme.colors.text,
  },
  deleteButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
  },
});
