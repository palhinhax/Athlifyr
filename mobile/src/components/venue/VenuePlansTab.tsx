import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import {
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import type { VenuePlan } from "@/src/hooks/useVenueDetail";

interface VenuePlansTabProps {
  plans: VenuePlan[];
}

function formatPrice(price: number | null, currency: string): string {
  if (!price) return "Free";
  return `${price.toFixed(2)} ${currency}`;
}

function getPolicyLabel(policy: VenuePlan["policy"]): string | null {
  if (!policy) return null;

  if (policy.maxBookingsPerWeek) {
    return `${policy.maxBookingsPerWeek}x/week`;
  }
  if (policy.maxBookingsPerMonth) {
    return `${policy.maxBookingsPerMonth}x/month`;
  }
  if (policy.maxTotalBookings) {
    return `${policy.maxTotalBookings} sessions`;
  }
  return null;
}

export function VenuePlansTab({ plans }: VenuePlansTabProps) {
  const { t } = useTranslation();

  const activePlans = plans.filter((p) => p.isActive);

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
        const hasActiveSubscription = plan.subscriptions?.some(
          (sub) => sub.status === "ACTIVE"
        );
        const hasPendingSubscription = plan.subscriptions?.some(
          (sub) => sub.status === "PENDING" || sub.paymentStatus === "PENDING"
        );
        const policyLabel = getPolicyLabel(plan.policy);

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
                      {t("venueDetail.active")}
                    </Text>
                  </View>
                )}
                {hasPendingSubscription && !hasActiveSubscription && (
                  <View style={styles.pendingBadge}>
                    <Clock size={14} color="#f59e0b" />
                    <Text style={styles.pendingBadgeText}>
                      {t("venueDetail.pending")}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.planPrice}>
                {formatPrice(plan.price, plan.currency)}
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
            {hasActiveSubscription &&
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
          </View>
        );
      })}
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
});
