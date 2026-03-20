import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  User,
  Settings,
  Bell,
  Database,
  Mail,
  Shield,
  Trophy,
  Languages,
  Palette,
  Download,
  Trash2,
  LogOut,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react-native";
import { useAuthStore } from "@/src/lib/auth-store";
import { api, API_URL } from "@/src/lib/api";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";
import { useToast } from "@/src/hooks/useToast";
import { Toast } from "@/src/components/ui/Toast";
import { theme } from "@/src/constants/theme";
import i18n from "@/src/lib/i18n";
import { File as ExpoFile, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as SecureStore from "expo-secure-store";

// ─── Types ─────────────────────────────────────────────────────

type SettingsTab = "profile" | "preferences" | "notifications" | "account";

interface TabButtonProps {
  tab: SettingsTab;
  activeTab: SettingsTab;
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

// ─── Tab Button Component ──────────────────────────────────────

function TabButton({ tab, activeTab, icon, label, onPress }: TabButtonProps) {
  const isActive = tab === activeTab;
  return (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.tabButtonActive]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: isActive }}
    >
      {icon}
      <Text
        style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Language Option ───────────────────────────────────────────

interface LanguageOptionProps {
  code: string;
  name: string;
  isSelected: boolean;
  onPress: () => void;
}

function LanguageOption({ name, isSelected, onPress }: LanguageOptionProps) {
  return (
    <TouchableOpacity
      style={[styles.languageOption, isSelected && styles.languageOptionActive]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={name}
    >
      <Text
        style={[
          styles.languageOptionText,
          isSelected && styles.languageOptionTextActive,
        ]}
      >
        {name}
      </Text>
      {isSelected && <CheckCircle2 size={18} color={theme.colors.primary} />}
    </TouchableOpacity>
  );
}

// ─── Main Settings Screen ──────────────────────────────────────

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { toast, showToast, hideToast } = useToast();

  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] =
    useState(false);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] =
    useState(true);

  const currentLanguage = i18n.language || "en";

  const languages = [
    { code: "pt", name: "Português" },
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "it", name: "Italiano" },
  ];

  const handleLanguageChange = async (langCode: string) => {
    try {
      // Change language locally first
      await i18n.changeLanguage(langCode);

      // Try to update user locale on server (non-blocking)
      try {
        await api.patch("/user/locale", { locale: langCode });
      } catch (serverError) {
        // Log but don't show error - language change already succeeded locally
        console.warn("Could not update language on server:", serverError);
      }
    } catch (error) {
      console.error("Error changing language:", error);
      showToast(t("settings.languageUpdateError"), "error");
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    setIsLoggingOut(true);
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleDownloadData = async () => {
    setIsDownloading(true);
    try {
      const token = await SecureStore.getItemAsync("auth-token");
      const downloadUrl = `${API_URL}/api/user/data-export`;
      const destination = new ExpoFile(
        Paths.document,
        "athlifyr-data-export.json"
      );

      const downloadedFile = await ExpoFile.downloadFileAsync(
        downloadUrl,
        destination,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          idempotent: true,
        }
      );

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(downloadedFile.uri, {
          mimeType: "application/json",
          dialogTitle: t("settings.downloadData"),
        });
      }

      showToast(t("settings.downloadDataSuccess"), "success");
    } catch (error) {
      console.error("Error downloading data:", error);
      showToast(t("settings.downloadDataError"), "error");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteAccountModal(true);
  };

  const confirmDeleteAccount = async () => {
    setShowDeleteAccountModal(false);
    try {
      await api.delete("/user/delete-account");
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
      showToast(t("settings.deleteAccountError"), "error");
    }
  };

  const handleToggleEmailNotifications = async (value: boolean) => {
    try {
      await api.patch("/user/notifications", {
        emailNotifications: value,
      });
      setEmailNotificationsEnabled(value);
    } catch (error) {
      console.error("Error toggling email notifications:", error);
    }
  };

  // ─── Profile Tab Content ───────────────────────────────────

  const renderProfileTab = () => (
    <View style={styles.tabContent}>
      {/* Account Information */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t("settings.accountInfo")}</Text>

        <View style={styles.infoRow}>
          <User size={18} color={theme.colors.textSecondary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>{t("settings.name")}</Text>
            <Text style={styles.infoValue}>
              {user?.name || t("settings.notDefined")}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Mail size={18} color={theme.colors.textSecondary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>{t("settings.email")}</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
        </View>

        {user?.role === "ADMIN" && (
          <View style={styles.infoRow}>
            <Shield size={18} color={theme.colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{t("settings.role")}</Text>
              <Text style={[styles.infoValue, { color: theme.colors.primary }]}>
                {t("settings.administrator")}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Favorite Sports */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Trophy size={18} color={theme.colors.text} />
          <Text style={styles.cardTitle}>{t("settings.favoriteSports")}</Text>
        </View>
        <Text style={styles.cardDescription}>
          {t("settings.favoriteSportsDescription")}
        </Text>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Text style={styles.actionButtonText}>
            {t("settings.selectSports")}
          </Text>
          <ChevronRight size={18} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // ─── Preferences Tab Content ───────────────────────────────

  const renderPreferencesTab = () => (
    <View style={styles.tabContent}>
      {/* Language */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Languages size={18} color={theme.colors.text} />
          <Text style={styles.cardTitle}>{t("settings.language")}</Text>
        </View>
        <Text style={styles.cardDescription}>
          {t("settings.languageDescription")}
        </Text>
        <View style={styles.languageGrid}>
          {languages.map((lang) => (
            <LanguageOption
              key={lang.code}
              code={lang.code}
              name={lang.name}
              isSelected={currentLanguage === lang.code}
              onPress={() => handleLanguageChange(lang.code)}
            />
          ))}
        </View>
      </View>

      {/* Theme - placeholder */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Palette size={18} color={theme.colors.text} />
          <Text style={styles.cardTitle}>{t("settings.theme")}</Text>
        </View>
        <Text style={styles.cardDescription}>
          {t("settings.themeDescription")}
        </Text>
        <View style={styles.themeOptions}>
          <TouchableOpacity
            style={[styles.themeOption, styles.themeOptionActive]}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.themeOptionText, styles.themeOptionTextActive]}
            >
              {t("settings.themeLight")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.themeOption} activeOpacity={0.7}>
            <Text style={styles.themeOptionText}>
              {t("settings.themeDark")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.themeOption} activeOpacity={0.7}>
            <Text style={styles.themeOptionText}>
              {t("settings.themeSystem")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // ─── Notifications Tab Content ─────────────────────────────

  const renderNotificationsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Bell size={18} color={theme.colors.text} />
          <Text style={styles.cardTitle}>{t("settings.notifications")}</Text>
        </View>

        {/* Push Notifications */}
        <View style={styles.notificationRow}>
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationLabel}>
              {t("settings.pushNotifications")}
            </Text>
            <Text style={styles.notificationDescription}>
              {t("settings.pushNotificationsDesc")}
            </Text>
          </View>
          <Switch
            value={pushNotificationsEnabled}
            onValueChange={setPushNotificationsEnabled}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primaryLight,
            }}
            thumbColor={
              pushNotificationsEnabled
                ? theme.colors.primary
                : theme.colors.textSecondary
            }
            accessibilityLabel={t("settings.pushNotifications")}
            accessibilityRole="switch"
          />
        </View>

        <View style={styles.separator} />

        {/* Email Notifications */}
        <View style={styles.notificationRow}>
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationLabel}>
              {t("settings.emailNotifications")}
            </Text>
            <Text style={styles.notificationDescription}>
              {t("settings.emailNotificationsDesc")}
            </Text>
          </View>
          <Switch
            value={emailNotificationsEnabled}
            onValueChange={handleToggleEmailNotifications}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primaryLight,
            }}
            thumbColor={
              emailNotificationsEnabled
                ? theme.colors.primary
                : theme.colors.textSecondary
            }
            accessibilityLabel={t("settings.emailNotifications")}
            accessibilityRole="switch"
          />
        </View>
      </View>
    </View>
  );

  // ─── Account Tab Content ───────────────────────────────────

  const renderAccountTab = () => (
    <View style={styles.tabContent}>
      {/* Download Data */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Download size={18} color={theme.colors.text} />
          <Text style={styles.cardTitle}>{t("settings.downloadData")}</Text>
        </View>
        <Text style={styles.cardDescription}>
          {t("settings.downloadDataDescription")}
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleDownloadData}
          disabled={isDownloading}
          activeOpacity={0.7}
        >
          {isDownloading ? (
            <ActivityIndicator size="small" color={theme.colors.white} />
          ) : (
            <>
              <Download size={16} color={theme.colors.white} />
              <Text style={styles.primaryButtonText}>
                {t("settings.download")}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={isLoggingOut}
          activeOpacity={0.7}
          accessibilityRole="button"
        >
          {isLoggingOut ? (
            <ActivityIndicator size="small" color={theme.colors.error} />
          ) : (
            <>
              <LogOut size={18} color={theme.colors.error} />
              <Text style={styles.logoutButtonText}>{t("profile.logOut")}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Delete Account - Danger Zone */}
      <View style={[styles.card, styles.dangerCard]}>
        <View style={styles.cardTitleRow}>
          <AlertCircle size={18} color={theme.colors.error} />
          <Text style={[styles.cardTitle, { color: theme.colors.error }]}>
            {t("settings.deleteAccount")}
          </Text>
        </View>
        <Text style={styles.cardDescription}>
          {t("settings.deleteAccountDescription")}
        </Text>
        <TouchableOpacity
          style={styles.dangerButton}
          onPress={handleDeleteAccount}
          activeOpacity={0.7}
          accessibilityRole="button"
        >
          <Trash2 size={16} color={theme.colors.white} />
          <Text style={styles.dangerButtonText}>
            {t("settings.deleteAccount")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileTab();
      case "preferences":
        return renderPreferencesTab();
      case "notifications":
        return renderNotificationsTab();
      case "account":
        return renderAccountTab();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={t("common.close")}
        >
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("settings.title")}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Tab Selector */}
      <View style={styles.tabBar} accessibilityRole="tabbar">
        <TabButton
          tab="profile"
          activeTab={activeTab}
          icon={
            <User
              size={16}
              color={
                activeTab === "profile"
                  ? theme.colors.primary
                  : theme.colors.textSecondary
              }
            />
          }
          label={t("settings.tabProfile")}
          onPress={() => setActiveTab("profile")}
        />
        <TabButton
          tab="preferences"
          activeTab={activeTab}
          icon={
            <Settings
              size={16}
              color={
                activeTab === "preferences"
                  ? theme.colors.primary
                  : theme.colors.textSecondary
              }
            />
          }
          label={t("settings.tabPreferences")}
          onPress={() => setActiveTab("preferences")}
        />
        <TabButton
          tab="notifications"
          activeTab={activeTab}
          icon={
            <Bell
              size={16}
              color={
                activeTab === "notifications"
                  ? theme.colors.primary
                  : theme.colors.textSecondary
              }
            />
          }
          label={t("settings.tabNotifications")}
          onPress={() => setActiveTab("notifications")}
        />
        <TabButton
          tab="account"
          activeTab={activeTab}
          icon={
            <Database
              size={16}
              color={
                activeTab === "account"
                  ? theme.colors.primary
                  : theme.colors.textSecondary
              }
            />
          }
          label={t("settings.tabAccount")}
          onPress={() => setActiveTab("account")}
        />
      </View>

      {/* Tab Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderTabContent()}
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title={t("settings.logOutConfirmTitle")}
        message={t("settings.logOutConfirmMessage")}
        actions={[
          {
            label: t("common.cancel"),
            variant: "outline",
            onPress: () => setShowLogoutModal(false),
          },
          {
            label: t("settings.logOut"),
            variant: "destructive",
            onPress: confirmLogout,
          },
        ]}
      />

      {/* Delete Account Confirmation Modal */}
      <ConfirmModal
        visible={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        title={t("settings.deleteAccountConfirmTitle")}
        message={t("settings.deleteAccountWarning")}
        actions={[
          {
            label: t("common.cancel"),
            variant: "outline",
            onPress: () => setShowDeleteAccountModal(false),
          },
          {
            label: t("settings.deleteAccount"),
            variant: "destructive",
            onPress: confirmDeleteAccount,
          },
        ]}
      />

      {/* Toast notifications */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={hideToast}
      />
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
  },
  headerSpacer: {
    width: 32,
  },

  // Tab Bar
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tabButtonActive: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  tabButtonText: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  tabButtonTextActive: {
    color: theme.colors.primary,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing["2xl"],
  },

  // Tab Content
  tabContent: {
    gap: theme.spacing.md,
  },

  // Card
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dangerCard: {
    borderColor: `${theme.colors.error}30`,
    backgroundColor: `${theme.colors.error}08`,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  cardDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },

  // Info Rows (Profile tab)
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "500",
    color: theme.colors.text,
  },

  // Language Grid
  languageGrid: {
    gap: theme.spacing.xs,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  languageOptionActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  languageOptionText: {
    fontSize: 15,
    fontWeight: "500",
    color: theme.colors.text,
  },
  languageOptionTextActive: {
    color: theme.colors.primary,
  },

  // Theme Options
  themeOptions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  themeOption: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    alignItems: "center",
  },
  themeOptionActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  themeOptionText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  themeOptionTextActive: {
    color: theme.colors.primary,
  },

  // Notification Row
  notificationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.sm,
  },
  notificationInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  notificationLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 2,
  },
  notificationDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },

  // Separator
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.xs,
  },

  // Buttons
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.white,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.error,
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.error,
  },
  dangerButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.white,
  },
});
