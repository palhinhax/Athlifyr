import { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import {
  Gift,
  Trophy,
  Users,
  Ticket,
  CheckCircle2,
  XCircle,
} from "lucide-react-native";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { theme } from "@/src/constants/theme";
import { useGiveaway } from "./useGiveaway";
import { TransparencySection } from "./TransparencySection";
import { styles } from "./giveawayCardStyles";

interface GiveawayCardProps {
  readonly eventId: string;
}

export function GiveawayCard({ eventId }: GiveawayCardProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const [isTransparencyOpen, setIsTransparencyOpen] = useState(false);

  const {
    giveaway,
    isLoading,
    isJoining,
    isAuthenticated,
    joinModal,
    closeJoinModal,
    handleJoin,
    isScheduled,
    isDrawn,
    isPendingDraw,
    canJoin,
    drawDate,
    isWinner,
    shouldShowTransparencySection,
  } = useGiveaway({ eventId });

  if (isLoading || !giveaway) return null;
  if (!isScheduled && !isDrawn) return null;

  return (
    <View
      style={[
        styles.container,
        isWinner ? styles.containerWinner : styles.containerDefault,
      ]}
    >
      {/* Join result modal */}
      <ConfirmModal
        visible={joinModal.visible}
        onClose={closeJoinModal}
        title={
          joinModal.success
            ? t("events.giveaway.joinSuccess")
            : t("events.giveaway.joinError")
        }
        message={
          joinModal.success && joinModal.ticketNumber != null
            ? t("events.giveaway.transparency.yourTicketNumber", {
                number: joinModal.ticketNumber,
              })
            : undefined
        }
        icon={
          joinModal.success ? (
            <CheckCircle2 size={28} color={theme.colors.success} />
          ) : (
            <XCircle size={28} color={theme.colors.error} />
          )
        }
        actions={[
          {
            label: t("common.close"),
            variant: "primary",
            onPress: closeJoinModal,
          },
        ]}
      />

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
            <Gift size={18} color="#ffffff" />
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
                <View style={styles.statusBadgePending}>
                  <Text style={styles.statusBadgePendingText}>
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
              {giveaway.participantsCount >= 10 && (
                <View style={styles.metaItem}>
                  <Users size={12} color={theme.colors.mutedForeground} />
                  <Text style={styles.metaText}>
                    {giveaway.participantsCount}
                  </Text>
                </View>
              )}
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
                <ActivityIndicator size="small" color="#ffffff" />
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

      {/* Transparency section (collapsible) */}
      {shouldShowTransparencySection && (
        <TransparencySection
          giveaway={giveaway}
          isDrawn={isDrawn}
          isOpen={isTransparencyOpen}
          onToggle={() => setIsTransparencyOpen((prev) => !prev)}
        />
      )}

      {/* Winning tickets section (drawn state, outside transparency) */}
      {isDrawn &&
        giveaway.winningTicketNumbers.length > 0 &&
        !shouldShowTransparencySection && (
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
