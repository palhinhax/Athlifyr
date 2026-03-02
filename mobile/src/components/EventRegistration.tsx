import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import {
  Check,
  X,
  Users,
  Target,
  Clock,
  ShoppingCart,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { api } from "@/src/lib/api";
import { useAuthStore } from "@/src/lib/auth-store";
import { theme } from "@/src/constants/theme";
import type { EventVariant, PricingPhase } from "@/src/types";

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

interface PaidRegistration {
  id: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "REFUNDED";
  variantId: string;
  variant?: {
    id: string;
    name: string;
    distanceKm?: number | null;
  } | null;
  amountCents: number;
  currency: string;
}

interface EventRegistrationProps {
  eventId: string;
  variants?: EventVariant[];
  hasRegistrations?: boolean;
}

function getActivePrice(variant: EventVariant): PricingPhase | null {
  const now = new Date();
  const phases = variant.pricingPhases ?? [];
  return (
    phases.find(
      (p) =>
        (!p.startDate || new Date(p.startDate) <= now) &&
        (!p.endDate || new Date(p.endDate) >= now)
    ) ?? null
  );
}

function isVariantSoldOut(variant: EventVariant): boolean {
  if (!variant.maxParticipants) return false;
  return (variant._count?.registrations ?? 0) >= variant.maxParticipants;
}

function allVariantsSoldOut(variants: EventVariant[]): boolean {
  return variants.length > 0 && variants.every(isVariantSoldOut);
}

function allVariantsNoPrice(variants: EventVariant[]): boolean {
  return (
    variants.length > 0 &&
    !allVariantsSoldOut(variants) &&
    variants.every((v) => !getActivePrice(v))
  );
}

export function EventRegistration({
  eventId,
  variants = [],
  hasRegistrations = false,
}: EventRegistrationProps) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  // Social participation state (free events)
  const [userParticipation, setUserParticipation] =
    useState<Participation | null>(null);

  // Paid registration state
  const [paidRegistration, setPaidRegistration] =
    useState<PaidRegistration | null>(null);
  const [registrationChecked, setRegistrationChecked] = useState(false);

  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [interestedCount, setInterestedCount] = useState(0);

  useEffect(() => {
    if (variants.length === 1 && !selectedVariantId) {
      setSelectedVariantId(variants[0].id);
    }
  }, [variants, selectedVariantId]);

  const fetchParticipation = useCallback(async () => {
    if (!isAuthenticated || !user?.id || hasRegistrations) return;
    try {
      const response = await api.get(
        `/participations?eventId=${eventId}&userId=${user.id}`
      );
      const data = response.data;
      const myParticipation = data.participations?.[0];
      if (myParticipation) {
        setUserParticipation(myParticipation);
        if (myParticipation.variantId && variants.length > 0) {
          setSelectedVariantId(myParticipation.variantId);
        }
      }
    } catch {
      // ignore
    }
  }, [eventId, isAuthenticated, user?.id, variants, hasRegistrations]);

  const fetchPaidRegistration = useCallback(async () => {
    if (!isAuthenticated || !user?.id || !hasRegistrations) {
      setRegistrationChecked(true);
      return;
    }
    try {
      const response = await api.get(`/events/${eventId}/registration/status`);
      if (response.data?.registration) {
        setPaidRegistration(response.data.registration);
      }
    } catch {
      // 404 = no registration yet, that's fine
    } finally {
      setRegistrationChecked(true);
    }
  }, [eventId, isAuthenticated, user?.id, hasRegistrations]);

  const fetchCounts = useCallback(async () => {
    try {
      const response = await api.get(`/participations?eventId=${eventId}`);
      const data = response.data;
      setParticipantsCount(data.counts?.going || 0);
      setInterestedCount(data.counts?.interested || 0);
    } catch {
      // ignore
    }
  }, [eventId]);

  useEffect(() => {
    fetchParticipation();
    fetchPaidRegistration();
    fetchCounts();
  }, [fetchParticipation, fetchPaidRegistration, fetchCounts]);

  const handleCheckout = async () => {
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

    if (variants.length > 1 && !selectedVariantId) {
      Alert.alert(
        t("events.registration.selectVariantRequired"),
        t("events.registration.selectVariantRequiredDesc")
      );
      return;
    }

    setIsCheckingOut(true);
    try {
      const res = await api.post(`/events/${eventId}/checkout`, {
        variantId: selectedVariantId || undefined,
      });
      const checkoutUrl: string = res.data.url;
      if (checkoutUrl) {
        await Linking.openURL(checkoutUrl);
        // After returning from browser, re-check registration status
        await fetchPaidRegistration();
      }
    } catch (error) {
      const message =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { error?: string } } }).response
              ?.data?.error
          : undefined;
      Alert.alert(
        t("events.registration.checkoutError"),
        message ?? t("events.registration.checkoutErrorDesc")
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

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

    if (variants.length > 0 && !selectedVariantId) {
      Alert.alert(
        t("events.registration.selectVariantRequired"),
        t("events.registration.selectVariantRequiredDesc")
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/participations", {
        eventId,
        variantId: selectedVariantId || undefined,
        status: "going",
      });
      const wasInterested = userParticipation?.status === "interested";
      setUserParticipation(response.data);
      setParticipantsCount((prev) => prev + 1);
      if (wasInterested) setInterestedCount((prev) => Math.max(0, prev - 1));
      Alert.alert(
        t("events.registration.markedAsParticipant"),
        t("events.registration.participationRegistered")
      );
    } catch {
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
              setSelectedVariantId("");
              if (prevStatus === "interested") {
                setInterestedCount((prev) => Math.max(0, prev - 1));
              } else {
                setParticipantsCount((prev) => Math.max(0, prev - 1));
              }
            } catch {
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
    } catch {
      Alert.alert(
        t("common.error"),
        t("events.registration.registrationError")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const selectedVariant = variants.find((v) => v.id === selectedVariantId);
  const activePrice = selectedVariant ? getActivePrice(selectedVariant) : null;
  const selectedSoldOut = selectedVariant
    ? isVariantSoldOut(selectedVariant)
    : false;
  const soldOut = allVariantsSoldOut(variants);
  const noPrice = allVariantsNoPrice(variants);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {hasRegistrations
            ? t("events.registration.registration")
            : t("events.registration.willYouGo")}
        </Text>
        <View style={styles.countsContainer}>
          {hasRegistrations ? (
            <View style={styles.countContainer}>
              <Users size={16} color={theme.colors.textSecondary} />
              <Text style={styles.countText}>
                {t("events.registration.registeredCount", {
                  count: variants.reduce(
                    (sum, v) => sum + (v._count?.registrations ?? 0),
                    0
                  ),
                })}
              </Text>
            </View>
          ) : (
            <>
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
            </>
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
      ) : hasRegistrations ? (
        /* â”€â”€ PAID REGISTRATION FLOW â”€â”€ */
        <View style={styles.content}>
          {/* Loading registration status */}
          {!registrationChecked ? (
            <ActivityIndicator
              size="small"
              color={theme.colors.mutedForeground}
            />
          ) : paidRegistration?.status === "CONFIRMED" ? (
            /* Confirmed */
            <View style={styles.confirmedBanner}>
              <View style={styles.confirmedIcon}>
                <Check size={16} color={theme.colors.white} />
              </View>
              <View style={styles.registeredContent}>
                <Text style={styles.confirmedText}>
                  {t("events.registration.registrationConfirmed")}
                </Text>
                {paidRegistration.variant && (
                  <Text style={styles.registeredVariant}>
                    {paidRegistration.variant.name}
                    {paidRegistration.variant.distanceKm
                      ? ` · ${paidRegistration.variant.distanceKm}km`
                      : ""}
                  </Text>
                )}
                <Text style={styles.amountText}>
                  {(paidRegistration.amountCents / 100).toLocaleString(
                    i18n.language,
                    {
                      style: "currency",
                      currency: paidRegistration.currency,
                    }
                  )}
                </Text>
              </View>
            </View>
          ) : paidRegistration?.status === "PENDING" ? (
            /* Pending payment */
            <View style={styles.pendingBanner}>
              <View style={styles.pendingIcon}>
                <Clock size={16} color={theme.colors.white} />
              </View>
              <View style={styles.registeredContent}>
                <Text style={styles.pendingText}>
                  {t("events.registration.registrationPending")}
                </Text>
                <Text style={styles.registeredVariant}>
                  {t("events.registration.registrationPendingDesc")}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleCheckout}
                disabled={isCheckingOut}
                activeOpacity={0.8}
              >
                {isCheckingOut ? (
                  <ActivityIndicator size="small" color={theme.colors.white} />
                ) : (
                  <Text style={styles.retryButtonText}>
                    {t("events.registration.retryPayment")}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ) : soldOut ? (
            /* All sold out */
            <View style={styles.soldOutBanner}>
              <X size={18} color={theme.colors.error} />
              <View style={styles.registeredContent}>
                <Text style={styles.soldOutText}>
                  {t("events.registration.allSoldOut")}
                </Text>
                <Text style={styles.registeredVariant}>
                  {t("events.registration.allSoldOutDesc")}
                </Text>
              </View>
            </View>
          ) : noPrice ? (
            /* No active pricing phase */
            <View style={styles.noPriceBanner}>
              <Clock size={18} color={theme.colors.mutedForeground} />
              <View style={styles.registeredContent}>
                <Text style={styles.noPriceText}>
                  {t("events.registration.registrationsClosed")}
                </Text>
                <Text style={styles.registeredVariant}>
                  {t("events.registration.registrationsClosedDesc")}
                </Text>
              </View>
            </View>
          ) : (
            /* New registration */
            <>
              {/* Variant selection */}
              {variants.length > 1 && (
                <View style={styles.variantsSection}>
                  <Text style={styles.variantsLabel}>
                    {t("events.registration.selectVariant")}
                  </Text>
                  <View style={styles.variantsList}>
                    {variants.map((variant) => {
                      const price = getActivePrice(variant);
                      const soldOutVariant = isVariantSoldOut(variant);
                      const selected = selectedVariantId === variant.id;
                      return (
                        <TouchableOpacity
                          key={variant.id}
                          style={[
                            styles.variantOption,
                            selected && styles.variantOptionSelected,
                            soldOutVariant && styles.variantOptionSoldOut,
                          ]}
                          onPress={() =>
                            !soldOutVariant && setSelectedVariantId(variant.id)
                          }
                          disabled={soldOutVariant}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.variantOptionText,
                              selected && styles.variantOptionTextSelected,
                              soldOutVariant && styles.variantOptionTextSoldOut,
                            ]}
                          >
                            {variant.name}
                            {variant.distanceKm
                              ? ` · ${variant.distanceKm}km`
                              : ""}
                          </Text>
                          {soldOutVariant ? (
                            <Text style={styles.variantSoldOutBadge}>
                              {t("events.registration.soldOut")}
                            </Text>
                          ) : price ? (
                            <Text
                              style={[
                                styles.variantPriceText,
                                selected && styles.variantPriceTextSelected,
                              ]}
                            >
                              {(price.price / 100).toLocaleString(
                                i18n.language,
                                {
                                  style: "currency",
                                  currency: price.currency,
                                }
                              )}
                            </Text>
                          ) : null}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Single variant price display */}
              {variants.length === 1 && activePrice && (
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>
                    {t("events.registration.price")}
                  </Text>
                  <Text style={styles.priceValue}>
                    {(activePrice.price / 100).toLocaleString(i18n.language, {
                      style: "currency",
                      currency: activePrice.currency,
                    })}
                  </Text>
                </View>
              )}

              {/* Selected variant sold out */}
              {selectedSoldOut && selectedVariant && (
                <View style={styles.soldOutBanner}>
                  <X size={16} color={theme.colors.error} />
                  <Text style={styles.soldOutText}>
                    {t("events.registration.soldOut")}
                  </Text>
                </View>
              )}

              {/* Selected variant no price */}
              {!selectedSoldOut && selectedVariant && !activePrice && (
                <View style={styles.noPriceBanner}>
                  <Clock size={16} color={theme.colors.mutedForeground} />
                  <Text style={styles.noPriceText}>
                    {t("events.registration.registrationClosed")}
                  </Text>
                </View>
              )}

              {/* Checkout button */}
              {!selectedSoldOut && activePrice && (
                <TouchableOpacity
                  style={[
                    styles.checkoutButton,
                    (isCheckingOut ||
                      (variants.length > 1 && !selectedVariantId)) &&
                      styles.checkoutButtonDisabled,
                  ]}
                  onPress={handleCheckout}
                  disabled={
                    isCheckingOut || (variants.length > 1 && !selectedVariantId)
                  }
                  activeOpacity={0.8}
                >
                  {isCheckingOut ? (
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.white}
                    />
                  ) : (
                    <>
                      <ShoppingCart size={18} color={theme.colors.white} />
                      <Text style={styles.checkoutButtonText}>
                        {t("events.registration.registerNow")}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      ) : (
        /* â”€â”€ SOCIAL (FREE) PARTICIPATION FLOW â”€â”€ */
        <View style={styles.content}>
          {/* Variant Selection */}
          {variants.length > 0 && !userParticipation && (
            <View style={styles.variantsSection}>
              <Text style={styles.variantsLabel}>
                {t("events.registration.selectVariant")}
              </Text>
              <View style={styles.variantsList}>
                {variants.map((variant) => (
                  <TouchableOpacity
                    key={variant.id}
                    style={[
                      styles.variantOption,
                      selectedVariantId === variant.id &&
                        styles.variantOptionSelected,
                    ]}
                    onPress={() => setSelectedVariantId(variant.id)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.variantOptionText,
                        selectedVariantId === variant.id &&
                          styles.variantOptionTextSelected,
                      ]}
                    >
                      {variant.name}
                      {variant.distanceKm ? ` · ${variant.distanceKm}km` : ""}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Current Participation Status */}
          {userParticipation?.status === "going" && (
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
                      ? ` · ${userParticipation.variant.distanceKm}km`
                      : ""}
                  </Text>
                )}
              </View>
            </View>
          )}

          {userParticipation?.status === "interested" && (
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
