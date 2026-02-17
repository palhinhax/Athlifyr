import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Phone, Mail, Globe, Instagram, MapPin } from "lucide-react-native";
import Markdown from "react-native-markdown-display";
import { theme } from "@/src/constants/theme";
import { EventLocationMap } from "@/src/components/EventLocationMap";
import type { VenueDetail } from "@/src/hooks/useVenueDetail";

interface VenueAboutTabProps {
  venue: VenueDetail;
}

export function VenueAboutTab({ venue }: VenueAboutTabProps) {
  const { t } = useTranslation();

  const handlePhonePress = () => {
    if (venue.phone) Linking.openURL(`tel:${venue.phone}`);
  };

  const handleEmailPress = () => {
    if (venue.email) Linking.openURL(`mailto:${venue.email}`);
  };

  const handleWebsitePress = () => {
    if (venue.website) Linking.openURL(venue.website);
  };

  const handleInstagramPress = () => {
    if (venue.instagram) {
      const username = venue.instagram.replace(/^@/, "");
      Linking.openURL(`https://instagram.com/${username}`);
    }
  };

  const handleWhatsAppPress = () => {
    if (venue.whatsapp) {
      const number = venue.whatsapp.replace(/[^0-9+]/g, "");
      Linking.openURL(`https://wa.me/${number}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Services */}
      {venue.services && venue.services.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t("venueDetail.services")}</Text>
          <View style={styles.serviceChips}>
            {venue.services.map((service) => (
              <View key={service} style={styles.serviceChip}>
                <Text style={styles.serviceChipText}>
                  {t(`venueDetail.serviceTypes.${service}`, {
                    defaultValue: service.replace(/_/g, " "),
                  })}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Description */}
      {venue.description && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t("venueDetail.description")}</Text>
          <Markdown
            style={{
              body: {
                color: theme.colors.text,
                fontSize: 15,
                lineHeight: 22,
              },
              heading1: {
                fontSize: 22,
                fontWeight: "700",
                color: theme.colors.text,
                marginTop: 16,
                marginBottom: 8,
              },
              heading2: {
                fontSize: 20,
                fontWeight: "700",
                color: theme.colors.text,
                marginTop: 12,
                marginBottom: 6,
              },
              heading3: {
                fontSize: 18,
                fontWeight: "600",
                color: theme.colors.text,
                marginTop: 10,
                marginBottom: 4,
              },
              strong: { fontWeight: "700" },
              link: { color: theme.colors.primary },
            }}
          >
            {venue.description}
          </Markdown>
        </View>
      )}

      {/* Contact Information */}
      {(venue.phone ||
        venue.email ||
        venue.website ||
        venue.instagram ||
        venue.whatsapp) && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {t("venueDetail.contactInformation")}
          </Text>
          <View style={styles.contactGrid}>
            {venue.phone && (
              <TouchableOpacity
                style={styles.contactItem}
                onPress={handlePhonePress}
                activeOpacity={0.7}
              >
                <View style={styles.contactIcon}>
                  <Phone size={18} color={theme.colors.primary} />
                </View>
                <View style={styles.contactTextContainer}>
                  <Text style={styles.contactLabel}>
                    {t("venueDetail.phone")}
                  </Text>
                  <Text style={styles.contactValue} numberOfLines={1}>
                    {venue.phone}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {venue.email && (
              <TouchableOpacity
                style={styles.contactItem}
                onPress={handleEmailPress}
                activeOpacity={0.7}
              >
                <View style={styles.contactIcon}>
                  <Mail size={18} color={theme.colors.primary} />
                </View>
                <View style={styles.contactTextContainer}>
                  <Text style={styles.contactLabel}>
                    {t("venueDetail.email")}
                  </Text>
                  <Text style={styles.contactValue} numberOfLines={1}>
                    {venue.email}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {venue.website && (
              <TouchableOpacity
                style={styles.contactItem}
                onPress={handleWebsitePress}
                activeOpacity={0.7}
              >
                <View style={styles.contactIcon}>
                  <Globe size={18} color={theme.colors.primary} />
                </View>
                <View style={styles.contactTextContainer}>
                  <Text style={styles.contactLabel}>
                    {t("venueDetail.website")}
                  </Text>
                  <Text style={styles.contactValue} numberOfLines={1}>
                    {venue.website.replace(/^https?:\/\//, "")}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {venue.instagram && (
              <TouchableOpacity
                style={styles.contactItem}
                onPress={handleInstagramPress}
                activeOpacity={0.7}
              >
                <View style={styles.contactIcon}>
                  <Instagram size={18} color={theme.colors.primary} />
                </View>
                <View style={styles.contactTextContainer}>
                  <Text style={styles.contactLabel}>
                    {t("venueDetail.instagram")}
                  </Text>
                  <Text style={styles.contactValue} numberOfLines={1}>
                    {venue.instagram.startsWith("@")
                      ? venue.instagram
                      : `@${venue.instagram}`}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {venue.whatsapp && (
              <TouchableOpacity
                style={styles.contactItem}
                onPress={handleWhatsAppPress}
                activeOpacity={0.7}
              >
                <View style={styles.contactIcon}>
                  <Phone size={18} color="#25D366" />
                </View>
                <View style={styles.contactTextContainer}>
                  <Text style={styles.contactLabel}>
                    {t("venueDetail.whatsapp")}
                  </Text>
                  <Text style={styles.contactValue} numberOfLines={1}>
                    {venue.whatsapp}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Location Map */}
      {venue.latitude && venue.longitude && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t("venueDetail.location")}</Text>
          {venue.address && (
            <View style={styles.addressRow}>
              <MapPin size={14} color={theme.colors.mutedForeground} />
              <Text style={styles.addressText}>{venue.address}</Text>
            </View>
          )}
          <EventLocationMap
            latitude={venue.latitude}
            longitude={venue.longitude}
            title={venue.name}
            city={venue.city || ""}
            country={venue.country}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  serviceChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  serviceChip: {
    backgroundColor: theme.colors.primary + "20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
  },
  serviceChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: theme.colors.primaryDark,
    textTransform: "capitalize",
  },
  contactGrid: {
    gap: theme.spacing.sm,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  contactIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: theme.colors.mutedForeground,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: theme.spacing.sm,
  },
  addressText: {
    fontSize: 14,
    color: theme.colors.mutedForeground,
    flex: 1,
  },
});
