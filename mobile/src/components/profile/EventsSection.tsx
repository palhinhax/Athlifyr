import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Calendar, Trophy } from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import { EventCard } from "./EventCard";
import { EmptyState } from "./EmptyState";

interface Participation {
  id: string;
  status: string;
  event: {
    id: string;
    title: string;
    slug: string;
    startDate: string;
    city: string | null;
    country: string | null;
    sportTypes: string[];
  };
  variant: {
    name: string;
    distanceKm: number | null;
  } | null;
}

interface EventsSectionProps {
  upcomingEvents: Participation[];
  pastEvents: Participation[];
}

export function EventsSection({
  upcomingEvents,
  pastEvents,
}: EventsSectionProps) {
  const { t } = useTranslation();

  return (
    <>
      {/* Upcoming Events */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Calendar size={20} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>
            {t("profile.upcomingEventsCount", {
              count: upcomingEvents.length,
            })}
          </Text>
        </View>
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((participation) => (
            <EventCard
              key={participation.id}
              title={participation.event.title}
              date={new Date(
                participation.event.startDate
              ).toLocaleDateString()}
              location={
                [participation.event.city, participation.event.country]
                  .filter(Boolean)
                  .join(", ") || ""
              }
              variant={participation.variant?.name}
            />
          ))
        ) : (
          <EmptyState
            icon={<Calendar size={48} color={theme.colors.textSecondary} />}
            title={t("profile.noUpcomingEvents")}
            description={t("profile.noUpcomingEventsDescription")}
          />
        )}
      </View>

      {/* Past Events */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Trophy size={20} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>
            {t("profile.pastEventsCount", { count: pastEvents.length })}
          </Text>
        </View>
        {pastEvents.length > 0 ? (
          pastEvents.map((participation) => (
            <EventCard
              key={participation.id}
              title={participation.event.title}
              date={new Date(
                participation.event.startDate
              ).toLocaleDateString()}
              location={
                participation.variant?.name ??
                [participation.event.city, participation.event.country]
                  .filter(Boolean)
                  .join(", ") ??
                ""
              }
              isPast
            />
          ))
        ) : (
          <EmptyState
            icon={<Trophy size={48} color={theme.colors.textSecondary} />}
            title={t("profile.noPastEvents")}
            description={t("profile.noPastEventsDescription")}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
});
