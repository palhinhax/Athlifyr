import { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import {
  Bookmark,
  Search,
  Globe,
  History,
  UserCheck,
  Dumbbell,
  Calendar as CalendarIcon,
} from "lucide-react-native";
import { theme } from "@/src/constants/theme";
import { useAuthStore } from "@/src/lib/auth-store";
import { AuthRequiredView } from "@/src/components/AuthRequiredView";
import { WorkoutCard } from "@/src/components/WorkoutCard";
import {
  useWorkouts,
  useAssignedPlans,
  useWorkoutHistory,
} from "@/src/hooks/useWorkouts";
import type { AssignedPlan, WorkoutLog } from "@/src/hooks/useWorkouts";

// ============================================================================
// Tab Types
// ============================================================================

type TabKey = "saved" | "assigned" | "public" | "history";

interface TabItem {
  key: TabKey;
  labelKey: string;
  icon: React.ReactNode;
}

// ============================================================================
// Main Screen
// ============================================================================

export default function WorkoutsScreen() {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const userId = useAuthStore((s) => s.user?.id) ?? null;

  const [activeTab, setActiveTab] = useState<TabKey>("saved");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const { savedWorkouts, publicWorkouts, isLoading, refetch } =
    useWorkouts(userId);
  const {
    plans: assignedPlans,
    isLoading: plansLoading,
    refetch: refetchPlans,
  } = useAssignedPlans(isAuthenticated);
  const {
    logs: historyLogs,
    isLoading: historyLoading,
    refetch: refetchHistory,
  } = useWorkoutHistory(isAuthenticated);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetch(), refetchPlans(), refetchHistory()]);
    setRefreshing(false);
  }, [refetch, refetchPlans, refetchHistory]);

  const tabs: TabItem[] = useMemo(
    () => [
      {
        key: "saved",
        labelKey: "workouts.savedWorkouts",
        icon: <Bookmark size={16} color="currentColor" />,
      },
      {
        key: "assigned",
        labelKey: "workouts.assignedPlans",
        icon: <UserCheck size={16} color="currentColor" />,
      },
      {
        key: "public",
        labelKey: "workouts.publicTab",
        icon: <Globe size={16} color="currentColor" />,
      },
      {
        key: "history",
        labelKey: "workouts.history",
        icon: <History size={16} color="currentColor" />,
      },
    ],
    []
  );

  // Show auth required for non-authenticated users
  if (!isAuthenticated) {
    return (
      <AuthRequiredView
        icon={Dumbbell}
        titleKey="workouts.authTitle"
        descriptionKey="workouts.authDescription"
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Page Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>{t("workouts.title")}</Text>
          <Text style={styles.pageSubtitle}>{t("workouts.subtitleBasic")}</Text>
        </View>

        {/* Tab Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
          style={styles.tabsScrollView}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            let badgeCount = 0;
            if (tab.key === "saved") badgeCount = savedWorkouts.length;
            if (tab.key === "assigned") badgeCount = assignedPlans.length;

            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.7}
              >
                {tab.key === "saved" && (
                  <Bookmark
                    size={16}
                    color={
                      isActive ? theme.colors.white : theme.colors.textSecondary
                    }
                  />
                )}
                {tab.key === "assigned" && (
                  <UserCheck
                    size={16}
                    color={
                      isActive ? theme.colors.white : theme.colors.textSecondary
                    }
                  />
                )}
                {tab.key === "public" && (
                  <Globe
                    size={16}
                    color={
                      isActive ? theme.colors.white : theme.colors.textSecondary
                    }
                  />
                )}
                {tab.key === "history" && (
                  <History
                    size={16}
                    color={
                      isActive ? theme.colors.white : theme.colors.textSecondary
                    }
                  />
                )}
                <Text
                  style={[styles.tabText, isActive && styles.tabTextActive]}
                >
                  {t(tab.labelKey)}
                </Text>
                {badgeCount > 0 && (
                  <View
                    style={[styles.tabBadge, isActive && styles.tabBadgeActive]}
                  >
                    <Text
                      style={[
                        styles.tabBadgeText,
                        isActive && styles.tabBadgeTextActive,
                      ]}
                    >
                      {badgeCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Search (for public tab) */}
        {activeTab === "public" && (
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder={t("workouts.searchPlaceholder")}
                placeholderTextColor={theme.colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        )}

        {/* Tab Content */}
        {activeTab === "saved" && (
          <SavedWorkoutsTab workouts={savedWorkouts} isLoading={isLoading} />
        )}
        {activeTab === "assigned" && (
          <AssignedPlansTab plans={assignedPlans} isLoading={plansLoading} />
        )}
        {activeTab === "public" && (
          <PublicWorkoutsTab
            workouts={publicWorkouts}
            isLoading={isLoading}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery("")}
          />
        )}
        {activeTab === "history" && (
          <HistoryTab logs={historyLogs} isLoading={historyLoading} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================================
// Saved Workouts Tab
// ============================================================================

function SavedWorkoutsTab({
  workouts,
  isLoading,
}: {
  workouts: Array<import("@/src/hooks/useWorkouts").WorkoutItem>;
  isLoading: boolean;
}) {
  const { t } = useTranslation();

  if (isLoading) {
    return <LoadingState />;
  }

  if (workouts.length === 0) {
    return (
      <EmptyState
        icon={<Bookmark size={48} color={theme.colors.textSecondary} />}
        title={t("workouts.noSavedWorkouts")}
        description={t("workouts.noSavedWorkoutsDescription")}
      />
    );
  }

  return (
    <View style={styles.cardsContainer}>
      {workouts.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout} canSave />
      ))}
    </View>
  );
}

// ============================================================================
// Assigned Plans Tab
// ============================================================================

function AssignedPlansTab({
  plans,
  isLoading,
}: {
  plans: AssignedPlan[];
  isLoading: boolean;
}) {
  const { t } = useTranslation();

  if (isLoading) {
    return <LoadingState />;
  }

  if (plans.length === 0) {
    return (
      <EmptyState
        icon={<UserCheck size={48} color={theme.colors.textSecondary} />}
        title={t("workouts.noAssignedPlans")}
        description={t("workouts.noAssignedPlansDescription")}
      />
    );
  }

  return (
    <View style={styles.cardsContainer}>
      {plans.map((userPlan) => (
        <TouchableOpacity
          key={userPlan.id}
          style={styles.planCard}
          activeOpacity={0.7}
        >
          <View style={styles.planBadge}>
            <UserCheck size={14} color={theme.colors.info} />
            <Text style={styles.planBadgeText}>
              {t("workouts.assignedToYou")}
            </Text>
          </View>
          <Text style={styles.planTitle} numberOfLines={1}>
            {userPlan.plan.name}
          </Text>
          {userPlan.plan.description && (
            <Text style={styles.planDescription} numberOfLines={2}>
              {userPlan.plan.description}
            </Text>
          )}
          <View style={styles.planFooter}>
            <View style={styles.stat}>
              <CalendarIcon size={14} color={theme.colors.info} />
              <Text style={styles.statText}>
                {userPlan.plan.weeks?.length || 0} {t("workouts.weeksCount")}
              </Text>
            </View>
            {userPlan.assignedBy?.name && (
              <Text style={styles.planAssignedBy}>
                {t("workouts.assignedByLabel")} {userPlan.assignedBy.name}
              </Text>
            )}
            {userPlan.startDate && (
              <Text style={styles.planStartDate}>
                {t("workouts.startDateLabel")}{" "}
                {new Date(userPlan.startDate).toLocaleDateString()}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ============================================================================
// Public Workouts Tab
// ============================================================================

function PublicWorkoutsTab({
  workouts,
  isLoading,
  searchQuery,
  onClearSearch,
}: {
  workouts: Array<import("@/src/hooks/useWorkouts").WorkoutItem>;
  isLoading: boolean;
  searchQuery: string;
  onClearSearch: () => void;
}) {
  const { t } = useTranslation();

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return workouts;
    const q = searchQuery.toLowerCase();
    return workouts.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.description?.toLowerCase().includes(q) ||
        w.tags?.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [workouts, searchQuery]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (filtered.length === 0) {
    return (
      <EmptyState
        icon={<Globe size={48} color={theme.colors.textSecondary} />}
        title={
          searchQuery
            ? t("workouts.noSearchResults")
            : t("workouts.noPublicContent")
        }
        description={
          searchQuery
            ? t("workouts.noSearchResultsDescription")
            : t("workouts.noPublicContentDescription")
        }
        actionLabel={searchQuery ? t("workouts.clearSearch") : undefined}
        onAction={searchQuery ? onClearSearch : undefined}
      />
    );
  }

  return (
    <View style={styles.cardsContainer}>
      {filtered.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout} canSave />
      ))}
    </View>
  );
}

// ============================================================================
// History Tab
// ============================================================================

function HistoryTab({
  logs,
  isLoading,
}: {
  logs: WorkoutLog[];
  isLoading: boolean;
}) {
  const { t } = useTranslation();

  if (isLoading) {
    return <LoadingState />;
  }

  if (logs.length === 0) {
    return (
      <EmptyState
        icon={<History size={48} color={theme.colors.textSecondary} />}
        title={t("workouts.noHistory")}
        description={t("workouts.noHistoryDescription")}
      />
    );
  }

  return (
    <View style={styles.cardsContainer}>
      {logs.map((log) => (
        <TouchableOpacity
          key={log.id}
          style={styles.historyCard}
          activeOpacity={0.7}
        >
          <View style={styles.historyHeader}>
            <Dumbbell size={16} color={theme.colors.primary} />
            <Text style={styles.historyTitle} numberOfLines={1}>
              {log.workout.name}
            </Text>
          </View>
          <Text style={styles.historyDate}>
            {new Date(log.startedAt).toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          {log.completedAt && (
            <View style={styles.stat}>
              <History size={12} color={theme.colors.textSecondary} />
              <Text style={styles.statText}>
                {Math.round(
                  (new Date(log.completedAt).getTime() -
                    new Date(log.startedAt).getTime()) /
                    60000
                )}{" "}
                min
              </Text>
            </View>
          )}
          {log.feeling != null && log.feeling > 0 && (
            <Text style={styles.historyFeeling}>
              {t(`workouts.feelingLevels.${log.feeling}`)}
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ============================================================================
// Shared Sub-Components
// ============================================================================

function LoadingState() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}

function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>{icon}</View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyDescription}>{description}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity
          style={styles.emptyAction}
          onPress={onAction}
          activeOpacity={0.7}
        >
          <Text style={styles.emptyActionText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing["2xl"],
  },

  // Page Header
  pageHeader: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.text,
  },
  pageSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },

  // Tabs
  tabsScrollView: {
    marginBottom: theme.spacing.md,
  },
  tabsContainer: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.muted,
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  tabTextActive: {
    color: theme.colors.white,
  },
  tabBadge: {
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 20,
    alignItems: "center",
  },
  tabBadgeActive: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.textSecondary,
  },
  tabBadgeTextActive: {
    color: theme.colors.white,
  },

  // Search
  searchContainer: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },

  // Cards Container
  cardsContainer: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.md,
  },

  // Plan Card
  planCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  planBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  planBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.info,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  planDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  planFooter: {
    gap: 4,
    marginTop: theme.spacing.xs,
  },
  planAssignedBy: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  planStartDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },

  // History Card
  historyCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: 6,
    ...theme.shadows.sm,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
    flex: 1,
  },
  historyDate: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  historyFeeling: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontStyle: "italic",
  },

  // Loading
  loadingContainer: {
    paddingVertical: theme.spacing["3xl"],
    alignItems: "center",
  },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing["2xl"],
    paddingHorizontal: theme.spacing.lg,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.muted,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  emptyDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 21,
  },
  emptyAction: {
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.muted,
    borderRadius: theme.borderRadius.md,
  },
  emptyActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },

  // Stats (shared)
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
});
