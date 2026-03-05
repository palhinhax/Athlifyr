import { View, Text, TouchableOpacity } from "react-native";
import { Users, Target } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { theme } from "@/src/constants/theme";
import type { EventVariant } from "@/src/types";
import { useEventRegistration } from "./useEventRegistration";
import { PaidRegistrationFlow } from "./PaidRegistrationFlow";
import { SocialParticipationFlow } from "./SocialParticipationFlow";
import { styles } from "./eventRegistrationStyles";

interface EventRegistrationProps {
  readonly eventId: string;
  readonly variants?: EventVariant[];
  readonly hasRegistrations?: boolean;
}

export function EventRegistration({
  eventId,
  variants = [],
  hasRegistrations = false,
}: EventRegistrationProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const {
    isAuthenticated,
    userParticipation,
    paidRegistration,
    registrationChecked,
    selectedVariantId,
    setSelectedVariantId,
    isLoading,
    isCheckingOut,
    participantsCount,
    interestedCount,
    selectedVariant,
    activePrice,
    selectedSoldOut,
    soldOut,
    noPrice,
    handleCheckout,
    handleRegister,
    handleUnregister,
    handleMarkInterested,
  } = useEventRegistration({ eventId, variants, hasRegistrations });

  function renderRegistrationContent() {
    if (hasRegistrations) {
      return (
        <View style={styles.content}>
          <PaidRegistrationFlow
            variants={variants}
            registrationChecked={registrationChecked}
            paidRegistration={paidRegistration}
            selectedVariantId={selectedVariantId}
            setSelectedVariantId={setSelectedVariantId}
            isCheckingOut={isCheckingOut}
            soldOut={soldOut}
            noPrice={noPrice}
            selectedSoldOut={selectedSoldOut}
            selectedVariant={selectedVariant}
            activePrice={activePrice}
            onCheckout={handleCheckout}
          />
        </View>
      );
    }

    return (
      <View style={styles.content}>
        <SocialParticipationFlow
          variants={variants}
          userParticipation={userParticipation}
          selectedVariantId={selectedVariantId}
          setSelectedVariantId={setSelectedVariantId}
          isLoading={isLoading}
          onRegister={handleRegister}
          onUnregister={handleUnregister}
          onMarkInterested={handleMarkInterested}
        />
      </View>
    );
  }

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
      {isAuthenticated ? (
        renderRegistrationContent()
      ) : (
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
      )}
    </View>
  );
}
