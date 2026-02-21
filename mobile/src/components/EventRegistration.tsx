import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Check, X, Users, Target } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { api } from "@/src/lib/api";
import { useAuthStore } from "@/src/lib/auth-store";
import { theme } from "@/src/constants/theme";
import type { EventVariant } from "@/src/types";

interface Participation {
  id: string;
  status: string;
  variantId?: string | null;
  variant?: {
    id: string;
    name: string;
    distanceKm?: number | null;
  } | null;
}

interface EventRegistrationProps {
  eventId: string;
  variants?: EventVariant[];
}

export function EventRegistration({
  eventId,
  variants = [],
}: EventRegistrationProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const [userParticipation, setUserParticipation] =
    useState<Participation | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [interestedCount, setInterestedCount] = useState(0);

  // Fetch user participation
  const fetchParticipation = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return;

    try {
      const response = await api.get(
        `/participations?eventId=${eventId}&userId=${user.id}`
      );
      const data = response.data;
      const myParticipation = data.participations?.[0];
      if (myParticipation) {
        setUserParticipation(myParticipation);
        // Find matching variant index
        if (myParticipation.variantId && variants.length > 0) {
          const idx = variants.findIndex(
            (v) => v.id === myParticipation.variantId
          );
          if (idx >= 0) setSelectedVariantIndex(idx);
        }
      }
    } catch (error) {
      console.error("Error fetching participation:", error);
    }
  }, [eventId, isAuthenticated, user?.id, variants]);

  // Fetch participants count
  const fetchCounts = useCallback(async () => {
    try {
      const response = await api.get(`/participations?eventId=${eventId}`);
      const data = response.data;
      setParticipantsCount(data.counts?.going || 0);
      setInterestedCount(data.counts?.interested || 0);
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  }, [eventId]);

  useEffect(() => {
    fetchParticipation();
    fetchCounts();
  }, [fetchParticipation, fetchCounts]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        t("events.registration.authRequired"),
        t("events.registration.authRequiredDesc"),
        [
          { text: t("common.cancel"), style: "cancel" },
          {
            text: t("common.signInButton"),
            onPress: () => router.push("/auth/login"),
          },
        ]
      );
      return;
    }

    if (variants.length > 0 && selectedVariantIndex < 0) {
      Alert.alert(
        t("events.registration.selectVariantRequired"),
        t("events.registration.selectVariantRequiredDesc")
      );
      return;
    }

    setIsLoading(true);

    try {
      const variantId =
        selectedVariantIndex >= 0
          ? variants[selectedVariantIndex]?.id
          : undefined;

      const response = await api.post("/participations", {
        eventId,
        variantId,
        status: "going",
      });

      const wasInterested = userParticipation?.status === "interested";
      setUserParticipation(response.data);
      setParticipantsCount((prev) => prev + 1);
      if (wasInterested) {
        setInterestedCount((prev) => Math.max(0, prev - 1));
      }

      Alert.alert(
        t("events.registration.markedAsParticipant"),
        t("events.registration.participationRegistered")
      );
    } catch (error) {
      console.error("Error registering:", error);
      Alert.alert(
        t("common.error"),
        t("events.registration.registrationError")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!isAuthenticated) return;

    const isInterested = userParticipation?.status === "interested";

    Alert.alert(
      isInterested
        ? t("events.registration.removeInterest")
        : t("events.registration.cancelParticipation"),
      isInterested
        ? t("events.registration.interestRemovedDesc")
        : t("events.registration.cancelParticipationDesc"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              await api.delete(`/participations?eventId=${eventId}`);
              const prevStatus = userParticipation?.status;
              setUserParticipation(null);
              setSelectedVariantIndex(-1);
              if (prevStatus === "interested") {
                setInterestedCount((prev) => Math.max(0, prev - 1));
              } else {
                setParticipantsCount((prev) => Math.max(0, prev - 1));
              }
            } catch (error) {
              console.error("Error unregistering:", error);
              Alert.alert(
                t("common.error"),
                t("events.registration.cancellationError")
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleMarkInterested = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        t("events.registration.authRequired"),
        t("events.registration.authRequiredDesc"),
        [
          { text: t("common.cancel"), style: "cancel" },
          {
            text: t("common.signInButton"),
            onPress: () => router.push("/auth/login"),
          },
        ]
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/participations", {
        eventId,
        status: "interested",
      });

      setUserParticipation(response.data);
      setInterestedCount((prev) => prev + 1);

      Alert.alert(
        t("events.registration.markedAsInterested"),
        t("events.registration.markedAsInterestedDesc")
      );
    } catch (error) {
      console.error("Error marking interested:", error);
      Alert.alert(
        t("common.error"),
        t("events.registration.registrationError")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t("events.registration.willYouGo")}</Text>
        <View style={styles.countsContainer}>
          <View style={styles.countContainer}>
            <Users size={16} color={theme.colors.textSecondary} />
            <Text style={styles.countText}>
              {participantsCount} {t("events.registration.participants")}
            </Text>
          </View>
          {interestedCount > 0 && (
            <View style={styles.countContainer}>
              <Target size={16} color={theme.colors.textSecondary} />
              <Text style={styles.countText}>
                {interestedCount} {t("events.registration.interestedCount")}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Not authenticated */}
      {!isAuthenticated ? (
        <View style={styles.authContainer}>
          <Text style={styles.authText}>
            {t("events.registration.loginToParticipate")}
          </Text>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => router.push("/auth/login")}
            activeOpacity={0.8}
          >
            <Text style={styles.signInButtonText}>
              {t("common.signInButton")}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.content}>
          {/* Variant Selection */}
          {variants.length > 0 && !userParticipation && (
            <View style={styles.variantsSection}>
              <Text style={styles.variantsLabel}>
                {t("events.registration.selectVariant")}
              </Text>
              <View style={styles.variantsList}>
                {variants.map((variant, index) => (
                  <TouchableOpacity
                    key={variant.id}
                    style={[
                      styles.variantOption,
                      selectedVariantIndex === index &&
                        styles.variantOptionSelected,
                    ]}
                    onPress={() => setSelectedVariantIndex(index)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.variantOptionText,
                        selectedVariantIndex === index &&
                          styles.variantOptionTextSelected,
                      ]}
                    >
                      {variant.name}
                      {variant.distanceKm ? ` - ${variant.distanceKm}km` : ""}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Current Participation Status */}
          {userParticipation && userParticipation.status === "going" && (
            <View style={styles.registeredBanner}>
              <View style={styles.registeredIcon}>
                <Check size={16} color={theme.colors.white} />
              </View>
              <View style={styles.registeredContent}>
                <Text style={styles.registeredText}>
                  {t("events.registration.registered")}
                </Text>
                {userParticipation.variant && (
                  <Text style={styles.registeredVariant}>
                    {userParticipation.variant.name}
                    {userParticipation.variant.distanceKm
                      ? ` - ${userParticipation.variant.distanceKm}km`
                      : ""}
                  </Text>
                )}
              </View>
            </View>
          )}

          {userParticipation && userParticipation.status === "interested" && (
            <View style={styles.interestedBanner}>
              <View style={styles.interestedIcon}>
                <Target size={16} color={theme.colors.white} />
              </View>
              <View style={styles.registeredContent}>
                <Text style={styles.interestedText}>
                  {t("events.registration.markedAsInterested")}
                </Text>
                <Text style={styles.registeredVariant}>
                  {t("events.registration.interestedDesc")}
                </Text>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            {!userParticipation ? (
              <>
                <TouchableOpacity
                  style={styles.goingButton}
                  onPress={handleRegister}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.white}
                    />
                  ) : (
                    <>
                      <Check size={18} color={theme.colors.white} />
                      <Text style={styles.goingButtonText}>
                        {t("events.registration.markAsGoing")}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.interestedButton}
                  onPress={handleMarkInterested}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.warning}
                    />
                  ) : (
                    <>
                      <Target size={18} color={theme.colors.warning} />
                      <Text style={styles.interestedButtonText}>
                        {t("events.registration.markAsInterested")}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </>
            ) : userParticipation.status === "interested" ? (
              <>
                <TouchableOpacity
                  style={styles.goingButton}
                  onPress={handleRegister}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.white}
                    />
                  ) : (
                    <>
                      <Check size={18} color={theme.colors.white} />
                      <Text style={styles.goingButtonText}>
                        {t("events.registration.markAsGoing")}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.interestedButton}
                  onPress={handleUnregister}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.warning}
                    />
                  ) : (
                    <>
                      <X size={18} color={theme.colors.warning} />
                      <Text style={styles.interestedButtonText}>
                        {t("events.registration.removeInterest")}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleUnregister}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={theme.colors.error} />
                ) : (
                  <>
                    <X size={18} color={theme.colors.error} />
                    <Text style={styles.cancelButtonText}>
                      {t("events.registration.cancelParticipation")}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
