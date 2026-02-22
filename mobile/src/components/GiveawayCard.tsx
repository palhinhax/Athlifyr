import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Gift, Trophy, Users, Ticket } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { api } from "@/src/lib/api";
import { useAuthStore } from "@/src/lib/auth-store";
import { theme } from "@/src/constants/theme";

interface GiveawayTranslation {
  lang: string;
  title: string;
  details: string;
}

interface GiveawayData {
  id: string;
  status: "DRAFT" | "SCHEDULED" | "DRAWING" | "DRAWN" | "CANCELLED";
  drawAt: string | null;
  drawnAt: string | null;
  prizeCount: number;
  participantsCount: number;
  secretHash: string | null;
  secretRevealed: string | null;
  finalParticipantsCount: number | null;
  winningTicketNumbers: number[];
  isWinner: boolean;
  translation: GiveawayTranslation | null;
  hasJoined: boolean;
  ticketNumber: number | null;
}

interface GiveawayCardProps {
  eventId: string;
}

export function GiveawayCard({ eventId }: GiveawayCardProps) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [giveaway, setGiveaway] = useState<GiveawayData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  const fetchGiveaway = useCallback(async () => {
    try {
      const res = await api.get(
        `/events/${eventId}/giveaway?lang=${i18n.language}`
      );
      setGiveaway(res.data.giveaway);
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }, [eventId, i18n.language]);

  useEffect(() => {
    fetchGiveaway();
  }, [fetchGiveaway]);

  const handleJoin = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    try {
      setIsJoining(true);
      const res = await api.post(`/giveaways/${giveaway!.id}/join`);
      const data = res.data;
      Alert.alert(
        t("events.giveaway.joinSuccess"),
        t("events.giveaway.transparency.yourTicketNumber", {
          number: data.ticketNumber,
        })
      );
      setGiveaway((prev) =>
        prev
          ? {
              ...prev,
              hasJoined: true,
              ticketNumber: data.ticketNumber,
              participantsCount: data.currentParticipantsCount,
            }
          : prev
      );
    } catch {
      Alert.alert(t("events.giveaway.joinError"));
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading || !giveaway) return null;

  const isScheduled = giveaway.status === "SCHEDULED";
  const isDrawn = giveaway.status === "DRAWN";

  if (!isScheduled && !isDrawn) return null;

  const canJoin =
    isScheduled && (!giveaway.drawAt || new Date(giveaway.drawAt) > new Date());

  const isPendingDraw =
    isScheduled && giveaway.drawAt && new Date(giveaway.drawAt) <= new Date();

  const drawDate = giveaway.drawAt
    ? new Intl.DateTimeFormat(i18n.language, {
        dateStyle: "long",
        timeZone: "Europe/Lisbon",
      }).format(new Date(giveaway.drawAt))
    : null;

  const isWinner = isDrawn && giveaway.isWinner;

  return (
    <View
      style={[
        styles.container,
        isWinner ? styles.containerWinner : styles.containerDefault,
      ]}
    >
      {/* Winner banner */}
      {isWinner && (
        <View style={styles.winnerBanner}>
          <Trophy size={16} color="#047857" />
          <Text style={styles.winnerBannerText}>
            {t("events.giveaway.youWon")}
          </Text>
        </View>
      )}

      {/* Main content */}
      <View style={styles.mainContent}>
        {/* Top: icon + info */}
        <View style={styles.topSection}>
          <View style={styles.iconCircle}>
            <Gift size={18} color={theme.colors.primary} />
          </View>
          <View style={styles.infoSection}>
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={1}>
                {giveaway.translation?.title || t("events.giveaway.title")}
              </Text>
              {isDrawn && !isWinner && (
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>
                    {t("events.giveaway.drawEnded")}
                  </Text>
                </View>
              )}
              {isPendingDraw && (
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>
                    {t("events.giveaway.drawPending")}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Trophy size={12} color={theme.colors.mutedForeground} />
                <Text style={styles.metaText}>
                  {giveaway.prizeCount === 1
                    ? t("events.giveaway.prizeCount", {
                        count: giveaway.prizeCount,
                      })
                    : t("events.giveaway.prizeCountPlural", {
                        count: giveaway.prizeCount,
                      })}
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Users size={12} color={theme.colors.mutedForeground} />
                <Text style={styles.metaText}>
                  {giveaway.participantsCount}
                </Text>
              </View>
              {drawDate && <Text style={styles.metaText}>{drawDate}</Text>}
            </View>
          </View>
        </View>

        {/* Bottom: ticket + action */}
        <View style={styles.bottomSection}>
          {/* Ticket badge */}
          {giveaway.hasJoined && giveaway.ticketNumber !== null && (
            <View
              style={[styles.ticketBadge, isWinner && styles.ticketBadgeWinner]}
            >
              <Ticket
                size={12}
                color={isWinner ? "#047857" : theme.colors.text}
              />
              <Text
                style={[
                  styles.ticketBadgeText,
                  isWinner && styles.ticketBadgeTextWinner,
                ]}
              >
                #{giveaway.ticketNumber}
              </Text>
            </View>
          )}

          {/* Action button */}
          {canJoin && !isAuthenticated && (
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => router.push("/login")}
              activeOpacity={0.7}
            >
              <Text style={styles.joinButtonText}>
                {t("events.giveaway.loginToParticipate")}
              </Text>
            </TouchableOpacity>
          )}
          {canJoin && isAuthenticated && !giveaway.hasJoined && (
            <TouchableOpacity
              style={styles.joinButton}
              onPress={handleJoin}
              disabled={isJoining}
              activeOpacity={0.7}
            >
              {isJoining ? (
                <ActivityIndicator size="small" color={theme.colors.white} />
              ) : (
                <Text style={styles.joinButtonText}>
                  {t("events.giveaway.participate")}
                </Text>
              )}
            </TouchableOpacity>
          )}
          {giveaway.hasJoined && canJoin && (
            <View style={styles.joinedBadge}>
              <Text style={styles.joinedBadgeText}>
                {t("events.giveaway.alreadyParticipating")}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Winning tickets section (drawn state) */}
      {isDrawn && giveaway.winningTicketNumbers.length > 0 && (
        <View style={styles.winnersSection}>
          <Text style={styles.winnersSectionTitle}>
            {t("events.giveaway.transparency.winningTickets")}
          </Text>
          <Text style={styles.winnersSectionText}>
            {giveaway.winningTicketNumbers.map((n) => `#${n}`).join(", ")}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: theme.spacing.md,
  },
  containerDefault: {
    borderColor: theme.colors.primary + "30",
    backgroundColor: theme.colors.primary + "08",
  },
  containerWinner: {
    borderColor: "#6ee7b7",
    backgroundColor: "#ecfdf5",
  },
  winnerBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#d1fae5",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  winnerBannerText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#065f46",
  },
  mainContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  infoSection: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
  },
  statusBadge: {
    backgroundColor: theme.colors.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "500",
    color: theme.colors.mutedForeground,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
    flexWrap: "wrap",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: theme.colors.mutedForeground,
  },
  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  ticketBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  ticketBadgeWinner: {
    borderColor: "#6ee7b7",
    backgroundColor: "#d1fae5",
  },
  ticketBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.text,
  },
  ticketBadgeTextWinner: {
    color: "#065f46",
  },
  joinButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.full,
    alignItems: "center",
    flex: 1,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.white,
  },
  joinedBadge: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
    alignItems: "center",
    flex: 1,
  },
  joinedBadgeText: {
    fontSize: 13,
    fontWeight: "500",
    color: theme.colors.mutedForeground,
  },
  winnersSection: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  winnersSectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  winnersSectionText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.mutedForeground,
    fontFamily: "monospace",
  },
});
