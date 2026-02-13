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
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/src/lib/auth-store";
import { useGoogleAuth } from "@/src/hooks/useGoogleAuth";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "@/src/constants/theme";
import { GoogleIcon } from "@/src/components/GoogleIcon";

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const { signIn: googleSignIn, isReady: isGoogleReady } = useGoogleAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = t("login.fieldRequired");
    }
    if (!password.trim()) {
      newErrors.password = t("login.fieldRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await login(email.trim(), password);
      router.back();
    } catch {
      Alert.alert(t("common.error"), t("login.invalidCredentials"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isGoogleReady) return;
    setIsGoogleLoading(true);
    try {
      await googleSignIn();
      // Navigate back after successful Google sign-in (same as email login)
      router.back();
    } catch {
      Alert.alert(t("common.error"), t("login.googleError"));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const anyLoading = isLoading || isGoogleLoading;

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

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>{t("login.title")}</Text>

          {/* Google Sign In */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            disabled={anyLoading}
            activeOpacity={0.7}
          >
            {isGoogleLoading ? (
              <ActivityIndicator color={colors.text} size="small" />
            ) : (
              <>
                <GoogleIcon size={20} />
                <Text style={styles.googleButtonText}>
                  {t("login.continueWithGoogle")}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t("login.orContinueWith")}</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t("login.email")}</Text>
            <View
              style={[
                styles.inputContainer,
                errors.email ? styles.inputError : null,
              ]}
            >
              <Mail size={20} color={colors.mutedForeground} />
              <TextInput
                style={styles.input}
                placeholder={t("login.emailPlaceholder")}
                placeholderTextColor={colors.textTertiary}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email)
                    setErrors((e) => ({ ...e, email: undefined }));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!anyLoading}
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          {/* Password Field */}
          <View style={styles.fieldContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>{t("login.password")}</Text>
              <TouchableOpacity
                onPress={() => router.push("/forgot-password")}
                disabled={anyLoading}
              >
                <Text style={styles.forgotPasswordLink}>
                  {t("login.forgotPassword")}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.inputContainer,
                errors.password ? styles.inputError : null,
              ]}
            >
              <Lock size={20} color={colors.mutedForeground} />
              <TextInput
                style={styles.input}
                placeholder={t("login.passwordPlaceholder")}
                placeholderTextColor={colors.textTertiary}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password)
                    setErrors((e) => ({ ...e, password: undefined }));
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!anyLoading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                {showPassword ? (
                  <EyeOff size={20} color={colors.mutedForeground} />
                ) : (
                  <Eye size={20} color={colors.mutedForeground} />
                )}
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[
              styles.signInButton,
              anyLoading && styles.signInButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={anyLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.signInButtonText}>
                {t("login.signInButton")}
              </Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.footerLinkContainer}>
            <Text style={styles.footerText}>{t("login.noAccount")} </Text>
            <TouchableOpacity
              onPress={() => {
                router.back();
                setTimeout(() => router.push("/register"), 100);
              }}
              disabled={anyLoading}
            >
              <Text style={styles.footerLink}>{t("login.signUp")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    height: 52,
    gap: spacing.sm,
    backgroundColor: colors.background,
  },
  googleButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.lg,
    gap: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
    textTransform: "uppercase",
  },
  fieldContainer: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  forgotPasswordLink: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    marginBottom: spacing.xs,
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
  signInButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.md,
    ...shadows.md,
  },
  signInButtonDisabled: {
    opacity: 0.6,
  },
  signInButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.white,
  },
  footerLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.lg,
  },
  footerText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  footerLink: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
  },
});
