import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Calendar, MapPin } from "lucide-react-native";
import { theme } from "@/src/constants/theme";

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  variant?: string;
  isPast?: boolean;
}

export function EventCard({
  title,
  date,
  location,
  variant,
  isPast,
}: EventCardProps) {
  return (
    <View style={styles.eventCard}>
      <Text style={styles.eventTitle}>{title}</Text>
      <View style={styles.eventDetails}>
        <View style={styles.eventDetail}>
          <Calendar
            size={14}
            color={isPast ? theme.colors.textSecondary : theme.colors.primary}
          />
          <Text style={styles.eventDetailText}>{date}</Text>
        </View>
        <View style={styles.eventDetail}>
          <MapPin
            size={14}
            color={isPast ? theme.colors.textSecondary : theme.colors.primary}
          />
          <Text style={styles.eventDetailText}>{location}</Text>
        </View>
        {variant && (
          <View style={styles.eventDetail}>
            <Text style={styles.eventVariantBadge}>{variant}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  eventCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  eventDetails: {
    gap: theme.spacing.xs,
  },
  eventDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  eventDetailText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  eventVariantBadge: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    overflow: "hidden",
  },
});
