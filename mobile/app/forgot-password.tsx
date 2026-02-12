import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "@/src/lib/api";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "@/src/constants/theme";

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError(t("forgotPassword.emailRequired"));
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      await api.post("/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      setIsSubmitted(true);
    } catch {
      Alert.alert(t("common.error"), t("forgotPassword.sendError"));
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (isSubmitted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <CheckCircle size={48} color={colors.success} />
          </View>
          <Text style={styles.successTitle}>
            {t("forgotPassword.successTitle")}
          </Text>
          <Text style={styles.successDescription}>
            {t("forgotPassword.successDescription")}{" "}
            <Text style={styles.successEmail}>{email}</Text>
          </Text>
          <Text style={styles.checkSpamText}>
            {t("forgotPassword.checkSpam")}
          </Text>

          <TouchableOpacity
            style={styles.backToSignInButton}
            onPress={() => {
              router.back();
              setTimeout(() => router.push("/login"), 100);
            }}
            activeOpacity={0.7}
          >
            <ArrowLeft size={18} color={colors.primary} />
            <Text style={styles.backToSignInText}>
              {t("forgotPassword.backToSignIn")}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Form state
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{t("forgotPassword.title")}</Text>
          <Text style={styles.description}>
            {t("forgotPassword.description")}
          </Text>

          {/* Email Field */}
          <View style={styles.fieldContainer}>
            <View
              style={[styles.inputContainer, error ? styles.inputError : null]}
            >
              <Mail size={20} color={colors.mutedForeground} />
              <TextInput
                style={styles.input}
                placeholder={t("forgotPassword.emailPlaceholder")}
                placeholderTextColor={colors.textTertiary}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) setError(undefined);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          {/* Send Button */}
          <TouchableOpacity
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.sendButtonText}>
                {t("forgotPassword.sendButton")}
              </Text>
            )}
          </TouchableOpacity>

          {/* Back to Sign In */}
          <TouchableOpacity
            style={styles.backToSignInButton}
            onPress={() => router.back()}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <ArrowLeft size={18} color={colors.primary} />
            <Text style={styles.backToSignInText}>
              {t("forgotPassword.backToSignIn")}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.muted,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
    marginBottom: spacing.lg,
  },
  fieldContainer: {
    marginBottom: spacing.md,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 52,
    backgroundColor: colors.background,
    gap: spacing.sm,
  },
  inputError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text,
    height: "100%",
  },
  errorText: {
    fontSize: typography.fontSize.xs,
    color: colors.error,
    marginTop: spacing.xs,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.md,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.white,
  },
  backToSignInButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  backToSignInText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary,
  },

  // Success state
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing["2xl"],
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: `${colors.success}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  successTitle: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  successDescription: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
    marginBottom: spacing.sm,
  },
  successEmail: {
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  checkSpamText: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
    textAlign: "center",
    lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
});
