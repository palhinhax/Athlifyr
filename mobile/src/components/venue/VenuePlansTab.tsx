import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import {
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";
import { api } from "@/src/lib/api";
import axios from "axios";
import type { VenuePlan } from "@/src/hooks/useVenueDetail";
import type { ToastType } from "@/src/hooks/useToast";

interface VenuePlansTabProps {
  plans: VenuePlan[];
  venueId: string;
  userId: string | null;
  paymentMode: "IN_APP" | "EXTERNAL" | "MIXED";
  onSubscriptionChange: () => void;
  showToast: (message: string, type?: ToastType) => void;
}

function formatPrice(
  price: number | null,
  currency: string,
  t: (key: string) => string
): string {
  if (!price) return t("venueDetail.free");
  return `${price.toFixed(2)} ${currency}`;
}

function getPolicyLabel(
  policy: VenuePlan["policy"],
  t: (key: string, options?: Record<string, unknown>) => string
): string | null {
  if (!policy) return null;

  if (policy.maxBookingsPerWeek) {
    return t("venueDetail.perWeek", { count: policy.maxBookingsPerWeek });
  }
  if (policy.maxBookingsPerMonth) {
    return t("venueDetail.perMonth", { count: policy.maxBookingsPerMonth });
  }
  if (policy.maxTotalBookings) {
    return t("venueDetail.sessionCount", {
      count: policy.maxTotalBookings,
    });
  }
  return null;
}

export function VenuePlansTab({
  plans,
  venueId,
  userId,
  paymentMode,
  onSubscriptionChange,
  showToast,
}: VenuePlansTabProps) {
  const { t } = useTranslation();
  const [subscribingPlanId, setSubscribingPlanId] = useState<string | null>(
    null
  );
  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    planId: string;
    planName: string;
    planPrice: string;
  }>({ visible: false, planId: "", planName: "", planPrice: "" });

  const activePlans = plans.filter((p) => p.isActive);

  const executeSubscribe = useCallback(
    async (planId: string) => {
      setSubscribingPlanId(planId);
      try {
        await api.post(`/venues/${venueId}/subscriptions`, { planId });
        showToast(t("venueDetail.subscribeSuccess"), "success");
        onSubscriptionChange();
      } catch (error) {
        let message = t("venueDetail.subscribeError");
        if (axios.isAxiosError(error) && error.response?.data?.error) {
          message = error.response.data.error;
        }
        showToast(message, "error");
      } finally {
        setSubscribingPlanId(null);
      }
    },
    [venueId, onSubscriptionChange, showToast, t]
  );

  const handleSubscribe = useCallback(
    (planId: string, planName: string, planPrice: string) => {
      if (!userId) {
        showToast(t("venueDetail.signInToSubscribe"), "warning");
        return;
      }

      if (paymentMode === "EXTERNAL") {
        setConfirmModal({ visible: true, planId, planName, planPrice });
        return;
      }

      executeSubscribe(planId);
    },
    [userId, paymentMode, showToast, t, executeSubscribe]
  );

  const closeConfirmModal = useCallback(() => {
    setConfirmModal((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleConfirmSubscribe = useCallback(() => {
    closeConfirmModal();
    executeSubscribe(confirmModal.planId);
  }, [closeConfirmModal, executeSubscribe, confirmModal.planId]);

  if (activePlans.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <CreditCard size={48} color={theme.colors.textSecondary} />
        <Text style={styles.emptyTitle}>{t("venueDetail.noPlans")}</Text>
        <Text style={styles.emptyDescription}>
          {t("venueDetail.noPlansDescription")}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {activePlans.map((plan) => {
        const activeSubscription = plan.subscriptions?.find(
          (sub) => sub.status === "ACTIVE"
        );
        const hasPendingSubscription = plan.subscriptions?.some(
          (sub) => sub.status === "PENDING" || sub.paymentStatus === "PENDING"
        );
        const policyLabel = getPolicyLabel(plan.policy, t);

        // Check if pack is exhausted
        const maxTotal = plan.policy?.maxTotalBookings;
        const used = activeSubscription?.totalBookingsUsed ?? 0;
        const isPackExhausted =
          !!activeSubscription &&
          !!maxTotal &&
          maxTotal > 0 &&
          used >= maxTotal;

        const hasActiveSubscription = !!activeSubscription && !isPackExhausted;

        return (
          <View
            key={plan.id}
            style={[
              styles.planCard,
              hasActiveSubscription && styles.planCardActive,
            ]}
          >
            {/* Header */}
            <View style={styles.planHeader}>
              <View style={styles.planNameRow}>
                <Text style={styles.planName}>{plan.name}</Text>
                {hasActiveSubscription && (
                  <View style={styles.activeBadge}>
                    <CheckCircle size={14} color="#16a34a" />
                    <Text style={styles.activeBadgeText}>
                      {t("venueDetail.subscribed")}
                    </Text>
                  </View>
                )}
                {hasPendingSubscription && !activeSubscription && (
                  <View style={styles.pendingBadge}>
                    <Clock size={14} color="#f59e0b" />
                    <Text style={styles.pendingBadgeText}>
                      {t("venueDetail.pending")}
                    </Text>
                  </View>
                )}
                {isPackExhausted && (
                  <View style={styles.exhaustedBadge}>
                    <AlertCircle size={14} color="#f59e0b" />
                    <Text style={styles.exhaustedBadgeText}>
                      {t("venueDetail.packExhausted")}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.planPrice}>
                {formatPrice(plan.price, plan.currency, t)}
              </Text>
            </View>

            {/* Description */}
            {plan.description && (
              <Text style={styles.planDescription}>{plan.description}</Text>
            )}

            {/* Policy details */}
            {policyLabel && (
              <View style={styles.policyRow}>
                <AlertCircle size={14} color={theme.colors.textSecondary} />
                <Text style={styles.policyText}>{policyLabel}</Text>
              </View>
            )}

            {/* Duration */}
            {plan.policy?.durationDays && (
              <View style={styles.policyRow}>
                <Clock size={14} color={theme.colors.textSecondary} />
                <Text style={styles.policyText}>
                  {plan.policy.durationDays} {t("venueDetail.days")}
                </Text>
              </View>
            )}

            {/* Multi-venue info */}
            {plan.includedVenues && plan.includedVenues.length > 0 && (
              <View style={styles.multiVenueRow}>
                <Text style={styles.multiVenueLabel}>
                  {t("venueDetail.includesVenues")}:
                </Text>
                <View style={styles.venueNameChips}>
                  {plan.includedVenues.map((iv) => (
                    <View key={iv.venue.id} style={styles.venueNameChip}>
                      <Text style={styles.venueNameChipText}>
                        {iv.venue.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Subscription progress (if pack/drop-in) */}
            {activeSubscription &&
              plan.policy?.maxTotalBookings &&
              plan.subscriptions
                ?.filter((s) => s.status === "ACTIVE")
                .map((sub) => (
                  <View key={sub.id} style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${Math.min(
                              ((sub.totalBookingsUsed || 0) /
                                (plan.policy?.maxTotalBookings || 1)) *
                                100,
                              100
                            )}%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {sub.totalBookingsUsed || 0} /{" "}
                      {plan.policy?.maxTotalBookings}{" "}
                      {t("venueDetail.sessionsUsed")}
                    </Text>
                  </View>
                ))}

            {/* Valid until */}
            {hasActiveSubscription && activeSubscription.endsAt && (
              <View style={styles.policyRow}>
                <Clock size={14} color={theme.colors.textSecondary} />
                <Text style={styles.policyText}>
                  {t("venueDetail.validUntil")}{" "}
                  {new Date(activeSubscription.endsAt).toLocaleDateString()}
                </Text>
              </View>
            )}

            {/* Subscribe / Resubscribe button */}
            {!hasActiveSubscription && !hasPendingSubscription && (
              <TouchableOpacity
                style={[
                  styles.subscribeButton,
                  (!userId || !plan.price) && styles.subscribeButtonDisabled,
                ]}
                onPress={() =>
                  handleSubscribe(
                    plan.id,
                    plan.name,
                    formatPrice(plan.price, plan.currency, t)
                  )
                }
                disabled={
                  !userId || !plan.price || subscribingPlanId === plan.id
                }
                activeOpacity={0.7}
              >
                {subscribingPlanId === plan.id ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.subscribeButtonText}>
                    {isPackExhausted
                      ? t("venueDetail.resubscribe")
                      : t("venueDetail.subscribe")}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        );
      })}

      {/* On-site payment confirmation modal */}
      <ConfirmModal
        visible={confirmModal.visible}
        onClose={closeConfirmModal}
        title={t("venueDetail.onSitePaymentTitle")}
        message={t("venueDetail.onSitePaymentMessage", {
          plan: confirmModal.planName,
          price: confirmModal.planPrice,
        })}
        actions={[
          {
            label: t("common.cancel"),
            variant: "outline",
            onPress: closeConfirmModal,
          },
          {
            label: t("venueDetail.onSitePaymentConfirm"),
            variant: "primary",
            onPress: handleConfirmSubscribe,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl * 2,
    gap: theme.spacing.sm,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  planCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  planCardActive: {
    borderColor: "#16a34a",
    borderWidth: 2,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  planNameRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    flexWrap: "wrap",
  },
  planName: {
    fontSize: 17,
    fontWeight: "700",
    color: theme.colors.text,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  planDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#dcfce7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#16a34a",
  },
  pendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fef9c3",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  pendingBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#f59e0b",
  },
  policyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  policyText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  multiVenueRow: {
    gap: 4,
  },
  multiVenueLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  venueNameChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  venueNameChip: {
    backgroundColor: theme.colors.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.md,
  },
  venueNameChipText: {
    fontSize: 12,
    color: theme.colors.text,
  },
  progressContainer: {
    gap: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  exhaustedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fef9c3",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  exhaustedBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#f59e0b",
  },
  subscribeButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing.xs,
  },
  subscribeButtonDisabled: {
    opacity: 0.5,
  },
  subscribeButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
