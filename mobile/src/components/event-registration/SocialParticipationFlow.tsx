import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Check, X, Target } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { theme } from "@/src/constants/theme";
import type { EventVariant } from "@/src/types";
import type { Participation } from "./eventRegistrationUtils";
import { styles } from "./eventRegistrationStyles";

interface SocialParticipationFlowProps {
  readonly variants: EventVariant[];
  readonly userParticipation: Participation | null;
  readonly selectedVariantId: string;
  readonly setSelectedVariantId: (id: string) => void;
  readonly isLoading: boolean;
  readonly onRegister: () => void;
  readonly onUnregister: () => void;
  readonly onMarkInterested: () => void;
}

export function SocialParticipationFlow({
  variants,
  userParticipation,
  selectedVariantId,
  setSelectedVariantId,
  isLoading,
  onRegister,
  onUnregister,
  onMarkInterested,
}: SocialParticipationFlowProps) {
  const { t } = useTranslation();

  const renderActionButtons = () => {
    if (!userParticipation) {
      return (
        <>
          <TouchableOpacity
            style={styles.goingButton}
            onPress={onRegister}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
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
            onPress={onMarkInterested}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={theme.colors.warning} />
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
      );
    }

    if (userParticipation.status === "interested") {
      return (
        <>
          <TouchableOpacity
            style={styles.goingButton}
            onPress={onRegister}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
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
            onPress={onUnregister}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={theme.colors.warning} />
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
      );
    }

    return (
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={onUnregister}
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
    );
  };

  return (
    <>
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
      <View style={styles.actionsRow}>{renderActionButtons()}</View>
    </>
  );
}
