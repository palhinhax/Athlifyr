// ============================================================================
// Athlifyr Mobile — Save Activity Screen (Strava-style)
//
// Shown after finishing a free run. Lets the user add a title, description,
// photos, perceived effort, and visibility before saving.
// ============================================================================

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronDown } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import { theme } from "@/src/constants/theme";
import {
  getActivity,
  updateActivity,
  deleteActivity,
  syncActivityToServer,
  type FreeRunActivity,
  type PerceivedEffort,
  type ActivityVisibility,
} from "@/src/lib/free-run-store";
import { RaceMap } from "@/src/components/live-race/RaceMap";
import {
  SaveActivityHeader,
  PhotoStrip,
  EffortPicker,
  VisibilitySection,
  MuteToggle,
  ActivityQuickStats,
  generateDefaultTitle,
} from "@/src/components/save-activity";

// ─── Screen ─────────────────────────────────────────────────────────────────

export default function SaveActivityScreen() {
  const { activityId } = useLocalSearchParams<{ activityId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  // Activity data
  const [activity, setActivity] = useState<FreeRunActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [perceivedEffort, setPerceivedEffort] = useState<
    PerceivedEffort | undefined
  >(undefined);
  const [photos, setPhotos] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<ActivityVisibility>("everyone");
  const [muted, setMuted] = useState(false);

  // Load activity
  useEffect(() => {
    if (!activityId) return;
    getActivity(activityId)
      .then((a) => {
        if (a) {
          setActivity(a);
          setTitle(a.title ?? generateDefaultTitle(t, a.startedAt));
          setDescription(a.description ?? "");
          setPerceivedEffort(a.perceivedEffort);
          setPhotos(a.photos ?? []);
          setVisibility(a.visibility ?? "everyone");
          setMuted(a.muted ?? false);
        }
      })
      .finally(() => setLoading(false));
  }, [activityId, t]);

  const trackPoints = useMemo<[number, number][]>(
    () => (activity?.track ?? []).map((pt) => [pt.lat, pt.lng]),
    [activity]
  );

  // ─── Handlers ───────────────────────────────────────────────────────

  const handleAddPhotos = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        t("saveActivity.photoPermissionTitle"),
        t("saveActivity.photoPermissionMessage")
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: 10 - photos.length,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhotos((prev) => [
        ...prev,
        ...result.assets.map((a) => a.uri).slice(0, 10 - prev.length),
      ]);
    }
  }, [photos.length, t]);

  const handleRemovePhoto = useCallback((index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSave = useCallback(async () => {
    if (!activityId || !activity) return;
    setSaving(true);
    try {
      const updated = await updateActivity(activityId, {
        title: title.trim() || generateDefaultTitle(t, activity.startedAt),
        description: description.trim() || undefined,
        perceivedEffort,
        photos: photos.length > 0 ? photos : undefined,
        visibility,
        muted,
      });
      // Sync to server with metadata included
      if (updated) {
        syncActivityToServer(updated).catch(() => {});
      }
      router.replace({
        pathname: "/activity-detail",
        params: { activityId },
      });
    } catch {
      Alert.alert(t("common.error"), t("saveActivity.saveError"));
    } finally {
      setSaving(false);
    }
  }, [
    activityId,
    activity,
    title,
    description,
    perceivedEffort,
    photos,
    visibility,
    muted,
    router,
    t,
  ]);

  const handleDiscard = useCallback(() => {
    Alert.alert(
      t("saveActivity.discardTitle"),
      t("saveActivity.discardMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("saveActivity.discardConfirm"),
          style: "destructive",
          onPress: () => {
            if (activityId) {
              deleteActivity(activityId)
                .then(() => {
                  router.replace("/(tabs)");
                })
                .catch(() => {});
            }
          },
        },
      ]
    );
  }, [activityId, router, t]);

  const toggleVisibility = useCallback(() => {
    setVisibility((prev) => (prev === "everyone" ? "only_me" : "everyone"));
  }, []);

  // ─── Render ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.container, styles.centered]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </>
    );
  }

  if (!activity) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.container, styles.centered]}>
          <Text style={styles.errorText}>{t("freeRun.activityNotFound")}</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.linkText}>{t("common.goBack")}</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.container, { paddingTop: insets.top }]}>
        <SaveActivityHeader onBack={() => router.back()} />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title Input */}
          <View style={styles.inputCard}>
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholder={t("saveActivity.titlePlaceholder")}
              placeholderTextColor={theme.colors.textTertiary}
              maxLength={100}
            />
          </View>

          {/* Description Input */}
          <View style={styles.inputCard}>
            <TextInput
              style={styles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              placeholder={t("saveActivity.descriptionPlaceholder")}
              placeholderTextColor={theme.colors.textTertiary}
              multiline
              maxLength={500}
              textAlignVertical="top"
            />
          </View>

          {/* Activity Type (read-only) */}
          <View style={styles.inputCard}>
            <View style={styles.activityTypeRow}>
              <Text style={styles.activityTypeIcon}>🏃</Text>
              <Text style={styles.activityTypeLabel}>
                {t("saveActivity.activityTypeRun")}
              </Text>
              <ChevronDown size={18} color={theme.colors.textTertiary} />
            </View>
          </View>

          <PhotoStrip
            photos={photos}
            onAdd={handleAddPhotos}
            onRemove={handleRemovePhoto}
          />

          {/* Mini Map Preview */}
          <View style={styles.mapPreview}>
            <RaceMap
              routePoints={trackPoints}
              checkpoints={[]}
              currentPosition={null}
              otherAthletes={[]}
              isOffRoute={false}
              height={160}
              followUser={false}
            />
          </View>

          <ActivityQuickStats
            distanceM={activity.distanceM}
            durationMs={activity.durationMs}
            avgPaceMinKm={activity.avgPaceMinKm}
            elevationGainM={activity.elevationGainM}
          />

          {/* ─── Details Section ──────────────────────────────── */}
          <Text style={styles.sectionTitle}>
            {t("saveActivity.detailsSection")}
          </Text>

          <EffortPicker
            perceivedEffort={perceivedEffort}
            onChange={setPerceivedEffort}
          />

          {/* ─── Visibility Section ──────────────────────────── */}
          <Text style={styles.sectionTitle}>
            {t("saveActivity.visibilitySection")}
          </Text>

          <VisibilitySection
            visibility={visibility}
            onToggle={toggleVisibility}
          />

          <MuteToggle muted={muted} onChange={setMuted} />

          {/* Discard Button */}
          <TouchableOpacity style={styles.discardBtn} onPress={handleDiscard}>
            <Text style={styles.discardBtnText}>
              {t("saveActivity.discardActivity")}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 32 }} />
        </ScrollView>

        {/* Save Button (fixed at bottom) */}
        <View
          style={[styles.saveContainer, { paddingBottom: insets.bottom + 12 }]}
        >
          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveBtnText}>
                {t("saveActivity.saveActivity")}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },

  // ── Input Cards ─────────────────────────────────────────────────
  inputCard: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  titleInput: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    padding: 0,
  },
  descriptionInput: {
    fontSize: 14,
    color: theme.colors.text,
    minHeight: 60,
    padding: 0,
  },
  activityTypeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  activityTypeIcon: {
    fontSize: 20,
  },
  activityTypeLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
  },

  // ── Map Preview ─────────────────────────────────────────────────
  mapPreview: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    overflow: "hidden",
  },

  // ── Section Titles ──────────────────────────────────────────────
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 4,
  },

  // ── Discard ─────────────────────────────────────────────────────
  discardBtn: {
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.error,
    alignItems: "center",
  },
  discardBtnText: {
    color: theme.colors.error,
    fontSize: 15,
    fontWeight: "700",
  },

  // ── Save Button ─────────────────────────────────────────────────
  saveContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  saveBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  // ── Error / Link ────────────────────────────────────────────────
  errorText: {
    fontSize: 16,
    color: theme.colors.error,
    marginBottom: 12,
  },
  linkText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "600",
  },
});
