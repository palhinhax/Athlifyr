import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ImagePlus, Send, X } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/src/lib/auth-store";
import { api } from "@/src/lib/api";
import { CachedAvatar } from "@/src/components/CachedImage";
import { colors, spacing, borderRadius } from "@/src/constants/theme";

interface CreatePostBoxProps {
  onPostCreated?: () => void;
}

export function CreatePostBox({ onPostCreated }: CreatePostBoxProps) {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  const [content, setContent] = useState("");
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  if (!user) return null;

  const handlePickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      quality: 0.8,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setMediaUri(asset.uri);
      setMediaType(asset.type === "video" ? "video" : "image");
    }
  };

  const uploadMedia = async (uri: string): Promise<string | null> => {
    setIsUploading(true);
    try {
      const filename = uri.split("/").pop() ?? "upload";
      const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
      const mimeType = mediaType === "video" ? `video/${ext}` : `image/${ext}`;

      const formData = new FormData();
      formData.append("file", {
        uri,
        name: filename,
        type: mimeType,
      } as unknown as Blob);
      formData.append("folder", "posts");

      const response = await api.post<{ file?: { url: string }; url?: string }>(
        "/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      return response.data.file?.url ?? response.data.url ?? null;
    } catch (err) {
      console.error("[CreatePost] upload error:", err);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !mediaUri) return;
    if (isSubmitting || isUploading) return;

    setIsSubmitting(true);
    try {
      let imageUrl: string | undefined;

      if (mediaUri) {
        const uploaded = await uploadMedia(mediaUri);
        if (!uploaded) {
          Alert.alert(t("common.error"), t("feed.createPost.uploadError"));
          setIsSubmitting(false);
          return;
        }
        imageUrl = uploaded;
      }

      await api.post("/posts", {
        content: content.trim(),
        imageUrl,
        mediaType: imageUrl ? mediaType : undefined,
        isPublic: true,
      });

      // Reset
      setContent("");
      setMediaUri(null);
      onPostCreated?.();
    } catch (err) {
      console.error("[CreatePost] submit error:", err);
      Alert.alert(t("common.error"), t("feed.createPost.submitError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit =
    (content.trim().length > 0 || !!mediaUri) && !isSubmitting && !isUploading;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {/* Avatar */}
        {user.image ? (
          <CachedAvatar
            uri={user.image}
            style={styles.avatar}
            alt={user.name ?? ""}
            size={36}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>
              {(user.name ?? "U")[0].toUpperCase()}
            </Text>
          </View>
        )}

        {/* Input */}
        <TextInput
          style={styles.input}
          placeholder={t("feed.createPost.placeholder")}
          placeholderTextColor={colors.textTertiary}
          value={content}
          onChangeText={setContent}
          multiline
          editable={!isSubmitting}
        />
      </View>

      {/* Media preview */}
      {mediaUri && (
        <View style={styles.previewContainer}>
          {/* eslint-disable-next-line @typescript-eslint/no-require-imports */}
          <Image
            source={{ uri: mediaUri }}
            style={styles.preview}
            resizeMode="cover"
            alt=""
            accessibilityLabel=""
          />
          <TouchableOpacity
            style={styles.removeMedia}
            onPress={() => setMediaUri(null)}
          >
            <X size={14} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}

      {/* Actions row */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.mediaBtn}
          onPress={handlePickMedia}
          disabled={isSubmitting || isUploading}
        >
          <ImagePlus size={18} color={colors.textSecondary} />
          <Text style={styles.mediaBtnText}>
            {t("feed.createPost.addMedia")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          {isSubmitting || isUploading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <Send size={14} color={colors.white} />
              <Text style={styles.submitBtnText}>
                {t("feed.createPost.publish")}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    flex: 1,
    minHeight: 60,
    maxHeight: 120,
    fontSize: 14,
    color: colors.text,
    textAlignVertical: "top",
    paddingTop: 2,
  },
  previewContainer: {
    marginTop: spacing.sm,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    position: "relative",
  },
  preview: {
    width: "100%",
    height: 180,
    borderRadius: borderRadius.md,
  },
  removeMedia: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 10,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  mediaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  mediaBtnText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: borderRadius.full,
  },
  submitBtnDisabled: {
    opacity: 0.45,
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "600",
  },
});
