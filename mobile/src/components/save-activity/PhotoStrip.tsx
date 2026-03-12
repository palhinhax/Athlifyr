import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { ImagePlus, X } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { theme } from "@/src/constants/theme";

interface PhotoStripProps {
  photos: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function PhotoStrip({
  photos,
  onAdd,
  onRemove,
}: Readonly<PhotoStripProps>) {
  const { t } = useTranslation();

  return (
    <>
      {photos.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.photoStrip}
          contentContainerStyle={styles.photoStripContent}
        >
          {photos.map((uri, index) => (
            <View key={`${uri}-${index}`} style={styles.photoThumb}>
              <Image
                source={{ uri }}
                style={styles.photoImage}
                accessible
                accessibilityLabel="Activity photo"
              />
              <TouchableOpacity
                style={styles.photoRemove}
                onPress={() => onRemove(index)}
              >
                <X size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.addPhotoBox} onPress={onAdd}>
        <ImagePlus size={28} color={theme.colors.primary} />
        <Text style={styles.addPhotoText}>{t("saveActivity.addPhotos")}</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  photoStrip: {
    marginTop: 12,
    marginHorizontal: 16,
  },
  photoStripContent: {
    gap: 8,
  },
  photoThumb: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  photoImage: {
    width: "100%",
    height: "100%",
  },
  photoRemove: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 10,
    padding: 2,
  },
  addPhotoBox: {
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 2,
    borderColor: theme.colors.primary + "40",
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  addPhotoText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
  },
});
