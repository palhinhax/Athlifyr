import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Check, X, Clock, ShoppingCart } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { theme } from "@/src/constants/theme";
import type { EventVariant, PricingPhase } from "@/src/types";
import type { PaidRegistration } from "./eventRegistrationUtils";
import { getActivePrice, isVariantSoldOut } from "./eventRegistrationUtils";
import { styles } from "./eventRegistrationStyles";

interface PaidRegistrationFlowProps {
  readonly variants: EventVariant[];
  readonly registrationChecked: boolean;
  readonly paidRegistration: PaidRegistration | null;
  readonly selectedVariantId: string;
  readonly setSelectedVariantId: (id: string) => void;
  readonly isCheckingOut: boolean;
  readonly soldOut: boolean;
  readonly noPrice: boolean;
  readonly selectedSoldOut: boolean;
  readonly selectedVariant: EventVariant | undefined;
  readonly activePrice: PricingPhase | null;
  readonly onCheckout: () => void;
}

export function PaidRegistrationFlow({
  variants,
  registrationChecked,
  paidRegistration,
  selectedVariantId,
  setSelectedVariantId,
  isCheckingOut,
  soldOut,
  noPrice,
  selectedSoldOut,
  selectedVariant,
  activePrice,
  onCheckout,
}: PaidRegistrationFlowProps) {
  const { t, i18n } = useTranslation();

  if (!registrationChecked) {
    return (
      <ActivityIndicator size="small" color={theme.colors.mutedForeground} />
    );
  }

  if (paidRegistration?.status === "CONFIRMED") {
    return (
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
    );
  }

  if (paidRegistration?.status === "PENDING") {
    return (
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
          onPress={onCheckout}
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
    );
  }

  if (soldOut) {
    return (
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
    );
  }

  if (noPrice) {
    return (
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
    );
  }

  // New registration flow
  return (
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

              function renderVariantStatus() {
                if (soldOutVariant) {
                  return (
                    <Text style={styles.variantSoldOutBadge}>
                      {t("events.registration.soldOut")}
                    </Text>
                  );
                }
                if (price) {
                  return (
                    <Text
                      style={[
                        styles.variantPriceText,
                        selected && styles.variantPriceTextSelected,
                      ]}
                    >
                      {(price.price / 100).toLocaleString(i18n.language, {
                        style: "currency",
                        currency: price.currency,
                      })}
                    </Text>
                  );
                }
                return null;
              }

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
                    {variant.distanceKm ? ` · ${variant.distanceKm}km` : ""}
                  </Text>
                  {renderVariantStatus()}
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
            (isCheckingOut || (variants.length > 1 && !selectedVariantId)) &&
              styles.checkoutButtonDisabled,
          ]}
          onPress={onCheckout}
          disabled={
            isCheckingOut || (variants.length > 1 && !selectedVariantId)
          }
          activeOpacity={0.8}
        >
          {isCheckingOut ? (
            <ActivityIndicator size="small" color={theme.colors.white} />
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
  );
}
