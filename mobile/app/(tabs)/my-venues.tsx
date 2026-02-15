import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Building2 } from "lucide-react-native";
import { theme } from "@/src/constants/theme";

/**
 * My Venues Screen
 * This screen is shown when user taps "Meus Locais" but has no venues.
 * The tab button itself handles navigation when user has venues.
 */
export default function MyVenuesScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Building2 size={48} color={theme.colors.textTertiary} />
      </View>
      <Text style={styles.title}>{t("venues.noVenuesTitle")}</Text>
      <Text style={styles.subtitle}>{t("venues.noVenuesDescription2")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    padding: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.muted,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});
