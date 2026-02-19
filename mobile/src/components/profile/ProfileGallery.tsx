import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import { ImagePlus, Trash2, X } from "lucide-react-native";
import { api } from "@/src/lib/api";
import { useAuthStore } from "@/src/lib/auth-store";
import { theme } from "@/src/constants/theme";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfilePhoto {
  id: string;
  imageUrl: string;
  caption: string | null;
  createdAt: string;
}

// ─── Gallery Component ────────────────────────────────────────────────────────

export function ProfileGallery() {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const [photos, setPhotos] = useState<ProfilePhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Upload modal state
  const [pendingUri, setPendingUri] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Fullscreen viewer state
  const [selectedPhoto, setSelectedPhoto] = useState<ProfilePhoto | null>(null);

  const screenWidth = Dimensions.get("window").width;
  const photoSize =
    (screenWidth - theme.spacing.md * 2 - theme.spacing.xs * 2) / 3;

  // ── Fetch photos ──────────────────────────────────────────────────────────

  const fetchPhotos = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await api.get<ProfilePhoto[]>(
        `/photos?userId=${user.id}`
      );
      setPhotos(response.data);
    } catch (err) {
      console.error("[ProfileGallery] fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  // ── Pick image from library ───────────────────────────────────────────────

  const handlePickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        t("profile.gallery.permissionTitle"),
        t("profile.gallery.permissionMessage")
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.85,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0]) {
      setPendingUri(result.assets[0].uri);
      setCaption("");
      setShowUploadModal(true);
    }
  };

  // ── Upload photo ──────────────────────────────────────────────────────────

  const handleConfirmUpload = async () => {
    if (!pendingUri) return;

    setIsUploading(true);
    try {
      // 1. Upload file to storage
      const filename = pendingUri.split("/").pop() ?? "photo.jpg";
      const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
      const mimeType = `image/${ext === "jpg" ? "jpeg" : ext}`;

      const formData = new FormData();
      formData.append("file", {
        uri: pendingUri,
        name: filename,
        type: mimeType,
      } as unknown as Blob);
      formData.append("folder", "profiles");

      const uploadResponse = await api.post<{
        file?: { url: string };
        url?: string;
      }>("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = uploadResponse.data.file?.url ?? uploadResponse.data.url;
      if (!imageUrl) throw new Error("Upload returned no URL");

      // 2. Save photo record in DB
      const photoResponse = await api.post<ProfilePhoto>("/photos", {
        imageUrl,
        caption: caption.trim() || null,
      });

      setPhotos((prev) => [photoResponse.data, ...prev]);
      setShowUploadModal(false);
      setPendingUri(null);
      setCaption("");

      Alert.alert(
        t("profile.gallery.publishedTitle"),
        t("profile.gallery.publishedMessage")
      );
    } catch (err) {
      console.error("[ProfileGallery] upload error:", err);
      Alert.alert(t("common.error"), t("profile.gallery.uploadError"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelUpload = () => {
    if (!isUploading) {
      setShowUploadModal(false);
      setPendingUri(null);
      setCaption("");
    }
  };

  // ── Delete photo ──────────────────────────────────────────────────────────

  const handleDeletePhoto = (photo: ProfilePhoto) => {
    Alert.alert(
      t("profile.gallery.deleteTitle"),
      t("profile.gallery.deleteConfirm"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/photos/${photo.id}`);
              setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
              if (selectedPhoto?.id === photo.id) setSelectedPhoto(null);
            } catch (err) {
              console.error("[ProfileGallery] delete error:", err);
              Alert.alert(t("common.error"), t("profile.gallery.deleteError"));
            }
          },
        },
      ]
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <View style={styles.section}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <ImagePlus size={20} color={theme.colors.primary} />
        <Text style={styles.sectionTitle}>
          {t("profile.galleryCount", { count: photos.length })}
        </Text>
        <TouchableOpacity
          style={styles.publishButton}
          onPress={handlePickPhoto}
          activeOpacity={0.7}
          disabled={isUploading}
        >
          <ImagePlus size={14} color={theme.colors.white} />
          <Text style={styles.publishButtonText}>
            {t("profile.publishPhoto")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      ) : photos.length === 0 ? (
        <View style={styles.emptyCard}>
          <ImagePlus size={48} color={theme.colors.textSecondary} />
          <Text style={styles.emptyCardTitle}>{t("profile.noPhotosYet")}</Text>
          <Text style={styles.emptyCardText}>
            {t("profile.shareYourMoments")}
          </Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handlePickPhoto}
            activeOpacity={0.7}
          >
            <ImagePlus size={16} color={theme.colors.text} />
            <Text style={styles.actionButtonText}>
              {t("profile.publishPhoto")}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.grid}>
          {photos.map((photo) => (
            <TouchableOpacity
              key={photo.id}
              onPress={() => setSelectedPhoto(photo)}
              activeOpacity={0.85}
              style={[styles.gridItem, { width: photoSize, height: photoSize }]}
            >
              <Image
                source={{ uri: photo.imageUrl }}
                style={styles.gridImage}
                resizeMode="cover"
                accessibilityLabel=""
                alt=""
              />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ── Upload Confirmation Modal ───────────────────────────────────── */}
      <Modal
        visible={showUploadModal}
        transparent
        animationType="slide"
        onRequestClose={handleCancelUpload}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t("profile.publishPhoto")}</Text>

            {pendingUri && (
              <Image
                source={{ uri: pendingUri }}
                style={styles.previewImage}
                resizeMode="contain"
                accessibilityLabel=""
                alt=""
              />
            )}

            <Text style={styles.captionLabel}>
              {t("profile.gallery.captionLabel")}
            </Text>
            <TextInput
              style={styles.captionInput}
              value={caption}
              onChangeText={setCaption}
              placeholder={t("profile.gallery.captionPlaceholder")}
              placeholderTextColor={theme.colors.textSecondary}
              maxLength={200}
              editable={!isUploading}
            />
            <Text style={styles.captionCounter}>{caption.length}/200</Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelUpload}
                disabled={isUploading}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>
                  {t("common.cancel")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.confirmButton,
                  isUploading && styles.disabledButton,
                ]}
                onPress={handleConfirmUpload}
                disabled={isUploading}
                activeOpacity={0.7}
              >
                {isUploading ? (
                  <ActivityIndicator size="small" color={theme.colors.white} />
                ) : (
                  <Text style={styles.confirmButtonText}>
                    {t("profile.publishPhoto")}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Fullscreen Photo Viewer ─────────────────────────────────────── */}
      <Modal
        visible={!!selectedPhoto}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPhoto(null)}
      >
        <View style={styles.viewerOverlay}>
          <TouchableOpacity
            style={styles.viewerClose}
            onPress={() => setSelectedPhoto(null)}
            activeOpacity={0.7}
          >
            <X size={24} color={theme.colors.white} />
          </TouchableOpacity>

          {selectedPhoto && (
            <>
              <Image
                source={{ uri: selectedPhoto.imageUrl }}
                style={styles.viewerImage}
                resizeMode="contain"
                accessibilityLabel=""
                alt=""
              />
              {selectedPhoto.caption && (
                <Text style={styles.viewerCaption}>
                  {selectedPhoto.caption}
                </Text>
              )}
              <TouchableOpacity
                style={styles.viewerDelete}
                onPress={() => handleDeletePhoto(selectedPhoto)}
                activeOpacity={0.7}
              >
                <Trash2 size={20} color={theme.colors.white} />
                <Text style={styles.viewerDeleteText}>
                  {t("common.delete")}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
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
    flex: 1,
  },
  publishButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  publishButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.white,
  },
  loadingContainer: {
    paddingVertical: theme.spacing.xl,
    alignItems: "center",
  },
  emptyCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing["2xl"],
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  emptyCardText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xs,
  },
  gridItem: {
    borderRadius: theme.borderRadius.sm,
    overflow: "hidden",
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  // Upload modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing["2xl"],
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  previewImage: {
    width: "100%",
    height: 240,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.border,
  },
  captionLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  captionInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    fontSize: 14,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
  },
  captionCounter: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: "right",
    marginTop: 4,
    marginBottom: theme.spacing.md,
  },
  modalActions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  modalButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: theme.colors.text,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.white,
  },
  disabledButton: {
    opacity: 0.6,
  },
  // Fullscreen viewer
  viewerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },
  viewerClose: {
    position: "absolute",
    top: 56,
    right: 20,
    padding: theme.spacing.sm,
    zIndex: 10,
  },
  viewerImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.7,
  },
  viewerCaption: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
  },
  viewerDelete: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  viewerDeleteText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.white,
  },
});
