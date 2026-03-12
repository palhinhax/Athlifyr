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
  Switch,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  ImagePlus,
  ChevronDown,
  Globe,
  Lock,
  X,
  Route,
  Clock,
  Gauge,
  TrendingUp,
} from "lucide-react-native";
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

// ─── Effort Emoji Config ────────────────────────────────────────────────────

const EFFORT_OPTIONS: { value: PerceivedEffort; emoji: string; key: string }[] =
  [
    { value: 1, emoji: "😌", key: "effortEasy" },
    { value: 2, emoji: "🙂", key: "effortModerate" },
    { value: 3, emoji: "😤", key: "effortHard" },
    { value: 4, emoji: "😰", key: "effortVeryHard" },
    { value: 5, emoji: "🥵", key: "effortMaximal" },
  ];

// ─── Auto-generated title based on time of day ─────────────────────────────

function generateDefaultTitle(
  t: (key: string) => string,
  startedAt: number
): string {
  const hour = new Date(startedAt).getHours();
  if (hour < 6) return t("saveActivity.nightRun");
  if (hour < 12) return t("saveActivity.morningRun");
  if (hour < 17) return t("saveActivity.afternoonRun");
  if (hour < 21) return t("saveActivity.eveningRun");
  return t("saveActivity.nightRun");
}

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
    Alert.alert(t("saveActivity.discardTitle"), t("saveActivity.discardMessage"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("saveActivity.discardConfirm"),
        style: "destructive",
        onPress: () => {
          if (activityId) {
            deleteActivity(activityId).then(() => {
              router.replace("/(tabs)");
            }).catch(() => {});
          }
        },
      },
    ]);
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <ArrowLeft size={22} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {t("saveActivity.title")}
          </Text>
          <View style={{ width: 30 }} />
        </View>

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
              <ChevronDown
                size={18}
                color={theme.colors.textTertiary}
              />
            </View>
          </View>

          {/* Photos */}
          {photos.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.photoStrip}
              contentContainerStyle={styles.photoStripContent}
            >
              {photos.map((uri, index) => (
                <View key={uri} style={styles.photoThumb}>
                  <Image
                    source={{ uri }}
                    style={styles.photoImage}
                    alt="Activity photo"
                    accessible
                    accessibilityLabel="Activity photo"
                  />
                  <TouchableOpacity
                    style={styles.photoRemove}
                    onPress={() => handleRemovePhoto(index)}
                  >
                    <X size={14} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Add Photos Button */}
          <TouchableOpacity
            style={styles.addPhotoBox}
            onPress={handleAddPhotos}
          >
            <ImagePlus size={28} color={theme.colors.primary} />
            <Text style={styles.addPhotoText}>
              {t("saveActivity.addPhotos")}
            </Text>
          </TouchableOpacity>

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

          {/* Quick Stats Summary */}
          <View style={styles.quickStats}>
            <QuickStat
              icon={<Route size={14} color={theme.colors.primary} />}
              value={formatDistance(activity.distanceM)}
            />
            <QuickStat
              icon={<Clock size={14} color={theme.colors.primary} />}
              value={formatDuration(activity.durationMs)}
            />
            <QuickStat
              icon={<Gauge size={14} color={theme.colors.primary} />}
              value={
                activity.avgPaceMinKm
                  ? `${formatPace(activity.avgPaceMinKm)}/km`
                  : "--"
              }
            />
            <QuickStat
              icon={<TrendingUp size={14} color={theme.colors.success} />}
              value={`+${activity.elevationGainM}m`}
            />
          </View>

          {/* ─── Details Section ──────────────────────────────── */}
          <Text style={styles.sectionTitle}>
            {t("saveActivity.detailsSection")}
          </Text>

          {/* Perceived Effort */}
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>
              {t("saveActivity.howDidItFeel")}
            </Text>
            <View style={styles.effortRow}>
              {EFFORT_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.effortButton,
                    perceivedEffort === opt.value &&
                      styles.effortButtonSelected,
                  ]}
                  onPress={() =>
                    setPerceivedEffort(
                      perceivedEffort === opt.value ? undefined : opt.value
                    )
                  }
                >
                  <Text style={styles.effortEmoji}>{opt.emoji}</Text>
                  <Text
                    style={[
                      styles.effortLabel,
                      perceivedEffort === opt.value &&
                        styles.effortLabelSelected,
                    ]}
                  >
                    {t(`saveActivity.${opt.key}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ─── Visibility Section ──────────────────────────── */}
          <Text style={styles.sectionTitle}>
            {t("saveActivity.visibilitySection")}
          </Text>

          {/* Who can see */}
          <TouchableOpacity
            style={styles.detailCard}
            onPress={toggleVisibility}
          >
            <View style={styles.visibilityRow}>
              <View style={styles.visibilityLeft}>
                {visibility === "everyone" ? (
                  <Globe size={18} color={theme.colors.primary} />
                ) : (
                  <Lock size={18} color={theme.colors.textSecondary} />
                )}
                <View>
                  <Text style={styles.detailLabel}>
                    {t("saveActivity.whoCanSee")}
                  </Text>
                  <Text style={styles.visibilityValue}>
                    {visibility === "everyone"
                      ? t("saveActivity.everyone")
                      : t("saveActivity.onlyMe")}
                  </Text>
                </View>
              </View>
              <ChevronDown size={18} color={theme.colors.textTertiary} />
            </View>
          </TouchableOpacity>

          {/* Mute Activity */}
          <View style={styles.muteCard}>
            <View style={styles.muteLeft}>
              <Text style={styles.muteTitle}>
                {t("saveActivity.muteActivity")}
              </Text>
              <Text style={styles.muteDescription}>
                {t("saveActivity.muteDescription")}
              </Text>
            </View>
            <Switch
              value={muted}
              onValueChange={setMuted}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary + "80",
              }}
              thumbColor={muted ? theme.colors.primary : "#f4f3f4"}
            />
          </View>

          {/* Discard Button */}
          <TouchableOpacity
            style={styles.discardBtn}
            onPress={handleDiscard}
          >
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

// ─── Sub-components ─────────────────────────────────────────────────────────

function QuickStat({
  icon,
  value,
}: Readonly<{
  icon: React.ReactNode;
  value: string;
}>) {
  return (
    <View style={styles.quickStatItem}>
      {icon}
      <Text style={styles.quickStatValue}>{value}</Text>
    </View>
  );
}

// ─── Formatters ─────────────────────────────────────────────────────────────

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(2)} km`;
}

function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function formatPace(paceMinKm: number): string {
  const mins = Math.floor(paceMinKm);
  const secs = Math.round((paceMinKm - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
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

  // ── Photos ──────────────────────────────────────────────────────
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

  // ── Map Preview ─────────────────────────────────────────────────
  mapPreview: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    overflow: "hidden",
  },

  // ── Quick Stats ─────────────────────────────────────────────────
  quickStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  quickStatItem: {
    alignItems: "center",
    gap: 4,
  },
  quickStatValue: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.text,
    fontVariant: ["tabular-nums"],
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

  // ── Detail Cards ────────────────────────────────────────────────
  detailCard: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },

  // ── Effort ──────────────────────────────────────────────────────
  effortRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  effortButton: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 10,
    flex: 1,
  },
  effortButtonSelected: {
    backgroundColor: theme.colors.primary + "18",
  },
  effortEmoji: {
    fontSize: 24,
  },
  effortLabel: {
    fontSize: 10,
    color: theme.colors.textTertiary,
    marginTop: 2,
    textAlign: "center",
  },
  effortLabelSelected: {
    color: theme.colors.primary,
    fontWeight: "600",
  },

  // ── Visibility ──────────────────────────────────────────────────
  visibilityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  visibilityLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  visibilityValue: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },

  // ── Mute ────────────────────────────────────────────────────────
  muteCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  muteLeft: {
    flex: 1,
    marginRight: 12,
  },
  muteTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  muteDescription: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    marginTop: 2,
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
