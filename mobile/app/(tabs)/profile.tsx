import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  User,
  Calendar,
  MapPin,
  Camera,
  Trash2,
  Trophy,
  ImagePlus,
  Users,
} from "lucide-react-native";
import { useAuthStore } from "@/src/lib/auth-store";
import { AuthRequiredView } from "@/src/components/AuthRequiredView";
import { theme } from "@/src/constants/theme";

// ─── Main Profile Screen ───────────────────────────────────────

type SportType = "RUNNING" | "TRAIL" | "STRENGTH" | "HYROX";

export default function ProfileScreen() {
  const { user, isAuthenticated, isLoading, loadStoredAuth } = useAuthStore();
  const { t } = useTranslation();
  const [selectedSport, setSelectedSport] = useState<SportType>("RUNNING");

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  // Loading
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // Not logged in
  if (!isAuthenticated || !user) {
    return (
      <View style={styles.safeArea}>
        <AuthRequiredView
          icon={User}
          titleKey="common.authTitle"
          descriptionKey="common.authDescription"
        />
      </View>
    );
  }

  // Logged in - Full Profile
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          {/* Large Avatar */}
          <View style={styles.avatarContainer}>
            {user.image ? (
              <Image
                source={{ uri: user.image }}
                style={styles.avatarLarge}
                alt="User avatar"
              />
            ) : (
              <View style={styles.avatarLargePlaceholder}>
                <User size={48} color={theme.colors.white} />
              </View>
            )}
          </View>

          {/* Change/Remove Photo Buttons */}
          <View style={styles.photoButtons}>
            <TouchableOpacity
              style={styles.changePhotoButton}
              activeOpacity={0.7}
            >
              <Camera size={16} color={theme.colors.text} />
              <Text style={styles.changePhotoText}>Alterar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removePhotoButton}
              activeOpacity={0.7}
            >
              <Trash2 size={16} color={theme.colors.error} />
              <Text style={styles.removePhotoText}>Remover</Text>
            </TouchableOpacity>
          </View>

          {/* Name, Email, Calendar Button */}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <TouchableOpacity style={styles.calendarButton} activeOpacity={0.7}>
              <Calendar size={16} color={theme.colors.text} />
              <Text style={styles.calendarButtonText}>Calendário</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: theme.colors.accent }]}>
              2
            </Text>
            <Text style={styles.statLabel}>Próximos Eventos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#3b82f6" }]}>1</Text>
            <Text style={styles.statLabel}>Eventos Passados</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#f59e0b" }]}>2</Text>
            <Text style={styles.statLabel}>Amigos</Text>
          </View>
        </View>

        {/* Upcoming Events Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Próximos Eventos (2)</Text>
          </View>
          <EventCard
            title="HYROX Lisboa"
            date="1 de maio de 2026"
            location="Lisboa, Portugal"
          />
          <EventCard
            title="EDP Porto Marathon 2026"
            date="8 de novembro de 2026"
            location="Porto, Portugal"
          />
        </View>

        {/* Past Events Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Trophy size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Eventos Passados (1)</Text>
          </View>
          <EventCard
            title="Montepio Cascais Half Marathon"
            date="31 de janeiro de 2026"
            location="10 Km Cascais - 10 km"
            isPast
          />
        </View>

        {/* Performance Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Trophy size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>{t("profile.performance")}</Text>
          </View>

          {/* Sport Tabs */}
          <View style={styles.sportTabs}>
            <TouchableOpacity
              style={[
                styles.sportTab,
                selectedSport === "RUNNING" && styles.sportTabActive,
              ]}
              onPress={() => setSelectedSport("RUNNING")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.sportTabText,
                  selectedSport === "RUNNING" && styles.sportTabTextActive,
                ]}
              >
                {t("sports.RUNNING")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sportTab,
                selectedSport === "TRAIL" && styles.sportTabActive,
              ]}
              onPress={() => setSelectedSport("TRAIL")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.sportTabText,
                  selectedSport === "TRAIL" && styles.sportTabTextActive,
                ]}
              >
                {t("sports.TRAIL")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sportTab,
                selectedSport === "STRENGTH" && styles.sportTabActive,
              ]}
              onPress={() => setSelectedSport("STRENGTH")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.sportTabText,
                  selectedSport === "STRENGTH" && styles.sportTabTextActive,
                ]}
              >
                {t("profile.strength")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sportTab,
                selectedSport === "HYROX" && styles.sportTabActive,
              ]}
              onPress={() => setSelectedSport("HYROX")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.sportTabText,
                  selectedSport === "HYROX" && styles.sportTabTextActive,
                ]}
              >
                {t("sports.HYROX")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Performance Content based on selected sport */}
          {selectedSport === "RUNNING" && (
            <>
              <View style={styles.performanceCard}>
                <Text style={styles.performanceTitle}>
                  {t("profile.halfMarathonPrediction")}
                </Text>
                <Text style={styles.performanceTime}>2:12:23</Text>
                <Text style={styles.performanceRange}>1:59:09 - 2:25:37</Text>
                <Text style={styles.performanceNote}>
                  {t("profile.basedOnRecords", { count: 1 })} • 6:16/km
                </Text>
              </View>
              <View style={styles.performanceStats}>
                <View style={styles.performanceStat}>
                  <Text style={styles.performanceStatValue}>1</Text>
                  <Text style={styles.performanceStatLabel}>
                    {t("profile.runs")}
                  </Text>
                </View>
                <View style={styles.performanceStat}>
                  <Text style={styles.performanceStatValue}>6:00</Text>
                  <Text style={styles.performanceStatLabel}>
                    {t("profile.lastPace")}
                  </Text>
                </View>
                <View style={styles.performanceStat}>
                  <Text style={styles.performanceStatValue}>10.0 km</Text>
                  <Text style={styles.performanceStatLabel}>
                    {t("profile.distance")}
                  </Text>
                </View>
              </View>
            </>
          )}

          {selectedSport === "TRAIL" && (
            <View style={styles.emptyPerformance}>
              <Trophy size={48} color={theme.colors.textSecondary} />
              <Text style={styles.emptyPerformanceText}>
                {t("profile.noPerformanceData")}
              </Text>
            </View>
          )}

          {selectedSport === "STRENGTH" && (
            <View style={styles.emptyPerformance}>
              <Trophy size={48} color={theme.colors.textSecondary} />
              <Text style={styles.emptyPerformanceText}>
                {t("profile.noPerformanceData")}
              </Text>
            </View>
          )}

          {selectedSport === "HYROX" && (
            <View style={styles.emptyPerformance}>
              <Trophy size={48} color={theme.colors.textSecondary} />
              <Text style={styles.emptyPerformanceText}>
                {t("profile.noPerformanceData")}
              </Text>
            </View>
          )}
        </View>

        {/* Gallery Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ImagePlus size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Galeria (0)</Text>
          </View>
          <View style={styles.galleryEmpty}>
            <ImagePlus size={48} color={theme.colors.textSecondary} />
            <Text style={styles.galleryEmptyTitle}>Ainda não há fotos</Text>
            <Text style={styles.galleryEmptyText}>
              Partilha momentos dos teus treinos!
            </Text>
            <TouchableOpacity style={styles.galleryButton} activeOpacity={0.7}>
              <ImagePlus size={16} color={theme.colors.text} />
              <Text style={styles.galleryButtonText}>Publicar Foto</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Friends Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Amigos (2)</Text>
          </View>
          <FriendCard name="Bruno Costa" role="Atleta" />
          <FriendCard name="Tiago Amaro" role="Owner" />
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: theme.spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Event Card Component ──────────────────────────────────────

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  isPast?: boolean;
}

function EventCard({ title, date, location, isPast }: EventCardProps) {
  return (
    <View style={styles.eventCard}>
      <Text style={styles.eventTitle}>{title}</Text>
      <View style={styles.eventDetails}>
        <View style={styles.eventDetail}>
          <Calendar size={14} color={theme.colors.textSecondary} />
          <Text style={styles.eventDetailText}>{date}</Text>
        </View>
        <View style={styles.eventDetail}>
          {isPast ? (
            <Trophy size={14} color={theme.colors.textSecondary} />
          ) : (
            <MapPin size={14} color={theme.colors.textSecondary} />
          )}
          <Text style={styles.eventDetailText}>{location}</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Friend Card Component ─────────────────────────────────────

interface FriendCardProps {
  name: string;
  role: string;
}

function FriendCard({ name, role }: FriendCardProps) {
  return (
    <View style={styles.friendCard}>
      <View style={styles.friendAvatar}>
        <User size={20} color={theme.colors.white} />
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{name}</Text>
        <Text style={styles.friendRole}>{role}</Text>
      </View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Guest View
  guestContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing["2xl"],
  },
  guestIconContainer: {
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  guestDescription: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: theme.spacing["2xl"],
  },
  signInButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing["2xl"],
    minWidth: 200,
    alignItems: "center",
    ...theme.shadows.md,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.white,
  },

  // Logged In
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },

  // Header Section
  headerSection: {
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  avatarContainer: {
    marginBottom: theme.spacing.sm,
  },
  avatarLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  avatarLargePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  photoButtons: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  changePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text,
  },
  removePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  removePhotoText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.error,
  },
  userInfo: {
    alignItems: "center",
    width: "100%",
  },
  userName: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  calendarButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  calendarButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text,
  },

  // Stats Cards
  statsContainer: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: "center",
    ...theme.shadows.sm,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },

  // Section
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },

  // Event Card
  eventCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  eventDetails: {
    gap: theme.spacing.xs,
  },
  eventDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  eventDetailText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },

  // Performance
  sportTabs: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  sportTab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
  },
  sportTabActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  sportTabText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  sportTabTextActive: {
    color: theme.colors.white,
  },
  performanceCard: {
    backgroundColor: "#fb923c15",
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: "#fb923c30",
  },
  performanceTitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  performanceTime: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  performanceRange: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  performanceNote: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  performanceStats: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  performanceStat: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  performanceStatValue: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  performanceStatLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  emptyPerformance: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing["2xl"],
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyPerformanceText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    textAlign: "center",
  },

  // Gallery
  galleryEmpty: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing["2xl"],
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  galleryEmptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  galleryEmptyText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  galleryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  galleryButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text,
  },

  // Friend Card
  friendCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.sm,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 2,
  },
  friendRole: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});
