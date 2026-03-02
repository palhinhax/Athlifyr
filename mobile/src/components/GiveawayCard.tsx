import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  Gift,
  Trophy,
  Users,
  Ticket,
  ShieldCheck,
  ChevronDown,
  CheckCircle2,
  XCircle,
} from "lucide-react-native";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";
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
  winningTicketAttempts: number[];
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
  const [isTransparencyOpen, setIsTransparencyOpen] = useState(false);
  const [joinModal, setJoinModal] = useState<{
    visible: boolean;
    success: boolean;
    ticketNumber?: number;
  }>({ visible: false, success: false });

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
      setJoinModal({
        visible: true,
        success: true,
        ticketNumber: data.ticketNumber,
      });
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
      setJoinModal({ visible: true, success: false });
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading || !giveaway) return null;

  const isScheduled = giveaway.status === "SCHEDULED";
  const isDrawn = giveaway.status === "DRAWN";

  if (!isScheduled && !isDrawn) return null;

  const isPendingDraw =
    isScheduled && giveaway.drawAt && new Date(giveaway.drawAt) <= new Date();

  const canJoin =
    isScheduled &&
    !isPendingDraw &&
    (!giveaway.drawAt || new Date(giveaway.drawAt) > new Date());

  const drawDate = giveaway.drawAt
    ? new Intl.DateTimeFormat(i18n.language, {
        dateStyle: "long",
        timeZone: "Europe/Lisbon",
      }).format(new Date(giveaway.drawAt))
    : null;

  const isWinner = isDrawn && giveaway.isWinner;

  const shouldShowTransparencySection =
    !!giveaway.secretHash || !!giveaway.secretRevealed;

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
        onClose={() => setJoinModal((prev) => ({ ...prev, visible: false }))}
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
            onPress: () =>
              setJoinModal((prev) => ({ ...prev, visible: false })),
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
        <View>
          <TouchableOpacity
            style={styles.transparencyTrigger}
            onPress={() => setIsTransparencyOpen(!isTransparencyOpen)}
            activeOpacity={0.7}
          >
            <ShieldCheck size={14} color="#0d9488" />
            <Text style={styles.transparencyTriggerText}>
              {t("events.giveaway.transparency.transparency")}
            </Text>
            <View style={styles.transparencyChevron}>
              <ChevronDown
                size={14}
                color={theme.colors.mutedForeground}
                style={
                  isTransparencyOpen
                    ? { transform: [{ rotate: "180deg" }] }
                    : undefined
                }
              />
            </View>
          </TouchableOpacity>

          {isTransparencyOpen && (
            <View style={styles.transparencyContent}>
              {/* Step-by-step explanation */}
              <View style={styles.stepsBox}>
                <View style={styles.stepsHeader}>
                  <ShieldCheck size={14} color="#0d9488" />
                  <Text style={styles.stepsTitle}>
                    {t("events.giveaway.transparency.howItWorks")}
                  </Text>
                </View>
                <View style={styles.stepsBody}>
                  <Text style={styles.stepText}>
                    {t("events.giveaway.transparency.step1")}
                  </Text>
                  <Text style={styles.stepText}>
                    {t("events.giveaway.transparency.step2")}
                  </Text>
                  <Text style={styles.stepText}>
                    {t("events.giveaway.transparency.step3")}
                  </Text>
                </View>
              </View>

              {/* Formula explanation */}
              <View style={styles.formulaBox}>
                <Text style={styles.formulaTitle}>
                  {t("events.giveaway.transparency.formulaTitle")}
                </Text>
                <View style={styles.formulaCode}>
                  <Text style={styles.formulaCodeText}>
                    SHA-256(&quot;secret | rank | attempt&quot;) % N + 1 =
                    winner
                  </Text>
                </View>
                <Text style={styles.formulaExplanation}>
                  {t("events.giveaway.transparency.formulaExplanation")}
                </Text>
              </View>

              {/* Commit hash */}
              {giveaway.secretHash && (
                <View style={styles.hashBox}>
                  <Text style={styles.hashTitle}>
                    {t("events.giveaway.transparency.secretHash")}
                  </Text>
                  <Text style={styles.hashExplanation}>
                    {t("events.giveaway.transparency.secretHashExplanation")}
                  </Text>
                  <View style={styles.codeBlock}>
                    <Text style={styles.codeBlockText} selectable>
                      {giveaway.secretHash}
                    </Text>
                  </View>
                </View>
              )}

              {/* Post-draw: final count */}
              {isDrawn && giveaway.finalParticipantsCount !== null && (
                <Text style={styles.finalCount}>
                  {t("events.giveaway.transparency.finalParticipantsCount", {
                    count: giveaway.finalParticipantsCount,
                  })}
                </Text>
              )}

              {/* Post-draw: winning tickets */}
              {isDrawn && giveaway.winningTicketNumbers.length > 0 && (
                <View style={styles.winningTicketsBox}>
                  <Text style={styles.winningTicketsTitle}>
                    {t("events.giveaway.transparency.winningTickets")}
                  </Text>
                  <Text style={styles.winningTicketsNumbers}>
                    {giveaway.winningTicketNumbers
                      .map((n) => `#${n}`)
                      .join(", ")}
                  </Text>
                </View>
              )}

              {/* Post-draw: revealed secret + verification */}
              {isDrawn && giveaway.secretRevealed && (
                <View style={styles.hashBox}>
                  <Text style={styles.hashTitle}>
                    {t("events.giveaway.transparency.secretRevealed")}
                  </Text>
                  <View style={styles.codeBlock}>
                    <Text style={styles.codeBlockText} selectable>
                      {giveaway.secretRevealed}
                    </Text>
                  </View>
                  {giveaway.finalParticipantsCount !== null &&
                    giveaway.winningTicketNumbers.length > 0 && (
                      <View style={styles.verifyBox}>
                        <Text style={styles.verifyTitle}>
                          {t("events.giveaway.transparency.verifyTitle")}
                        </Text>
                        {giveaway.winningTicketNumbers.map((ticket, i) => (
                          <Text
                            key={ticket}
                            style={styles.verifyFormula}
                            selectable
                          >
                            {t("events.giveaway.transparency.verifyFormula", {
                              secret: giveaway.secretRevealed!,
                              rank: i + 1,
                              attempt: giveaway.winningTicketAttempts?.[i] ?? 0,
                              total: giveaway.finalParticipantsCount!,
                              winning: ticket,
                            })}
                          </Text>
                        ))}
                      </View>
                    )}
                </View>
              )}
            </View>
          )}
        </View>
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

const TEAL_500 = "#14b8a6";
const TEAL_600 = "#0d9488";
const EMERALD_50 = "#ecfdf5";
const EMERALD_100 = "#d1fae5";
const EMERALD_300 = "#6ee7b7";
const EMERALD_700 = "#047857";
const EMERALD_800 = "#065f46";

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  containerDefault: {
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  containerWinner: {
    borderColor: EMERALD_300,
    backgroundColor: EMERALD_50,
  },
  winnerBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: EMERALD_100,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  winnerBannerText: {
    fontSize: 13,
    fontWeight: "700",
    color: EMERALD_800,
  },
  mainContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: TEAL_500,
    ...theme.shadows.sm,
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
  statusBadgePending: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  statusBadgePendingText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#b45309",
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
    backgroundColor: theme.colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  ticketBadgeWinner: {
    borderColor: EMERALD_300,
    backgroundColor: EMERALD_100,
  },
  ticketBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.text,
  },
  ticketBadgeTextWinner: {
    color: EMERALD_800,
  },
  joinButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.full,
    alignItems: "center",
    flex: 1,
    backgroundColor: TEAL_600,
    ...theme.shadows.sm,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
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

  // Transparency section
  transparencyTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border + "80",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  transparencyTriggerText: {
    fontSize: 12,
    color: theme.colors.mutedForeground,
    flex: 1,
  },
  transparencyChevron: {
    marginLeft: "auto",
  },
  transparencyContent: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border + "80",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },

  // Steps box
  stepsBox: {
    backgroundColor: theme.colors.backgroundSecondary + "60",
    borderRadius: theme.borderRadius.lg,
    padding: 12,
  },
  stepsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  stepsTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.text,
  },
  stepsBody: {
    gap: 6,
  },
  stepText: {
    fontSize: 12,
    lineHeight: 18,
    color: theme.colors.mutedForeground,
  },

  // Formula box
  formulaBox: {
    borderWidth: 1,
    borderColor: theme.colors.border + "80",
    borderStyle: "dashed",
    borderRadius: theme.borderRadius.lg,
    padding: 12,
    backgroundColor: theme.colors.background + "80",
  },
  formulaTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.text,
  },
  formulaCode: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 6,
  },
  formulaCodeText: {
    fontSize: 11,
    fontFamily: "monospace",
    color: theme.colors.text,
    lineHeight: 18,
  },
  formulaExplanation: {
    fontSize: 11,
    color: theme.colors.mutedForeground,
    marginTop: 6,
    lineHeight: 16,
  },

  // Hash / secret box
  hashBox: {
    borderWidth: 1,
    borderColor: theme.colors.border + "60",
    borderRadius: theme.borderRadius.lg,
    padding: 12,
  },
  hashTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.text,
  },
  hashExplanation: {
    fontSize: 11,
    color: theme.colors.mutedForeground,
    marginTop: 2,
    lineHeight: 16,
  },
  codeBlock: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 6,
  },
  codeBlockText: {
    fontSize: 11,
    fontFamily: "monospace",
    color: theme.colors.text,
  },

  // Final count
  finalCount: {
    fontSize: 12,
    color: theme.colors.mutedForeground,
  },

  // Winning tickets box
  winningTicketsBox: {
    backgroundColor: EMERALD_50 + "80",
    borderWidth: 1,
    borderColor: EMERALD_300 + "60",
    borderRadius: theme.borderRadius.lg,
    padding: 12,
  },
  winningTicketsTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: EMERALD_800,
  },
  winningTicketsNumbers: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "monospace",
    color: EMERALD_700,
    marginTop: 4,
  },

  // Verify box
  verifyBox: {
    backgroundColor: theme.colors.backgroundSecondary + "80",
    borderRadius: theme.borderRadius.md,
    padding: 10,
    marginTop: 10,
  },
  verifyTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 6,
  },
  verifyFormula: {
    fontSize: 10,
    fontFamily: "monospace",
    color: theme.colors.mutedForeground,
    lineHeight: 16,
  },

  // Fallback winners section (when no transparency)
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
