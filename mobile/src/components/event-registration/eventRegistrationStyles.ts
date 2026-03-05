import { StyleSheet } from "react-native";
import { theme } from "@/src/constants/theme";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
  },
  countsContainer: {
    alignItems: "flex-end",
    gap: 4,
  },
  countContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  countText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  // Auth
  authContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.md,
  },
  authText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  signInButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  signInButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.white,
  },
  // Content
  content: {
    gap: theme.spacing.md,
  },
  // Variants
  variantsSection: {
    gap: theme.spacing.sm,
  },
  variantsLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  variantsList: {
    gap: theme.spacing.xs,
  },
  variantOption: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  variantOptionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  variantOptionText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  variantOptionTextSelected: {
    color: theme.colors.primaryDark,
    fontWeight: "600",
  },
  // Registered banner
  registeredBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    backgroundColor: `${theme.colors.success}15`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  registeredIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.success,
    justifyContent: "center",
    alignItems: "center",
  },
  registeredContent: {
    flex: 1,
  },
  registeredText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.success,
  },
  interestedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    backgroundColor: `${theme.colors.warning}15`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  interestedIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.warning,
    justifyContent: "center",
    alignItems: "center",
  },
  interestedText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.warning,
  },
  registeredVariant: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  // Actions
  actionsRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  goingButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm + 2,
  },
  goingButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.white,
  },
  interestedButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: theme.colors.warning,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm + 2,
  },
  interestedButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.warning,
  },
  cancelButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: theme.colors.error,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm + 2,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.error,
  },
  // Paid flow — confirmed
  confirmedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    backgroundColor: `${theme.colors.success}15`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  confirmedIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.success,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmedText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.success,
  },
  amountText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  // Paid flow — pending
  pendingBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    backgroundColor: `${theme.colors.warning}15`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  pendingIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.warning,
    justifyContent: "center",
    alignItems: "center",
  },
  pendingText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.warning,
  },
  retryButton: {
    backgroundColor: theme.colors.warning,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 6,
    paddingHorizontal: theme.spacing.md,
    marginLeft: "auto",
  },
  retryButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.white,
  },
  // Paid flow — sold out
  soldOutBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    backgroundColor: `${theme.colors.error}12`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  soldOutText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.error,
  },
  // Paid flow — no price
  noPriceBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.muted,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  noPriceText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.mutedForeground,
  },
  // Paid flow — variant options with price
  variantOptionSoldOut: {
    opacity: 0.5,
    borderColor: theme.colors.border,
  },
  variantOptionTextSoldOut: {
    color: theme.colors.mutedForeground,
  },
  variantSoldOutBadge: {
    fontSize: 12,
    color: theme.colors.error,
    fontWeight: "500",
    marginLeft: "auto",
  },
  variantPriceText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginLeft: "auto",
  },
  variantPriceTextSelected: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  // Paid flow — single variant price row
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.xs,
  },
  priceLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  // Paid flow — checkout button
  checkoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm + 4,
  },
  checkoutButtonDisabled: {
    opacity: 0.5,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.white,
  },
});
