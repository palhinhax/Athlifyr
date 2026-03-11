import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import { Building2, X, ChevronRight } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { theme } from "@/src/constants/theme";
import { CachedImage } from "@/src/components/CachedImage";
import type { ActiveVenue } from "@/src/hooks/useActiveVenues";

function ListSeparator() {
  return <View style={styles.separator} />;
}

interface VenuePickerModalProps {
  visible: boolean;
  venues: ActiveVenue[];
  onSelect: (venue: ActiveVenue) => void;
  onClose: () => void;
}

export function VenuePickerModal({
  visible,
  venues,
  onSelect,
  onClose,
}: Readonly<VenuePickerModalProps>) {
  const { t } = useTranslation();

  const renderVenueItem = ({ item }: { item: ActiveVenue }) => (
    <TouchableOpacity
      style={styles.venueItem}
      onPress={() => onSelect(item)}
      activeOpacity={0.7}
    >
      {/* Venue Image/Icon */}
      {item.imageUrl ? (
        <CachedImage
          uri={item.imageUrl}
          style={styles.venueImage}
          alt={item.name}
        />
      ) : (
        <View style={styles.venueIconContainer}>
          <Building2 size={20} color={theme.colors.primary} />
        </View>
      )}

      {/* Venue Info */}
      <View style={styles.venueInfo}>
        <Text style={styles.venueName} numberOfLines={1}>
          {item.name}
        </Text>
        {item.role && (
          <Text style={styles.venueRole}>
            {t(`venues.roles.${item.role.toLowerCase()}`)}
          </Text>
        )}
      </View>

      {/* Arrow */}
      <ChevronRight size={18} color={theme.colors.textTertiary} />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Building2 size={20} color={theme.colors.primary} />
              <Text style={styles.title}>{t("venues.myVenues")}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Venue List */}
          <FlatList
            data={venues}
            renderItem={renderVenueItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={ListSeparator}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "60%",
    paddingBottom: 32,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
  },
  closeButton: {
    padding: 4,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  venueItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },
  venueImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.muted,
  },
  venueIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  venueInfo: {
    flex: 1,
  },
  venueName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  venueRole: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
});
