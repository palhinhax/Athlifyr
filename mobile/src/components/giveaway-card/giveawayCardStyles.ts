import { StyleSheet } from "react-native";
import { theme } from "@/src/constants/theme";

export const TEAL_500 = "#14b8a6";
export const TEAL_600 = "#0d9488";
export const EMERALD_50 = "#ecfdf5";
export const EMERALD_100 = "#d1fae5";
export const EMERALD_300 = "#6ee7b7";
export const EMERALD_700 = "#047857";
export const EMERALD_800 = "#065f46";

export const styles = StyleSheet.create({
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
