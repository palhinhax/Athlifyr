import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as AppleAuthentication from "expo-apple-authentication";
import { useAuthStore } from "@/src/lib/auth-store";
import { useGoogleAuth } from "@/src/hooks/useGoogleAuth";
import { useAppleAuth } from "@/src/hooks/useAppleAuth";
import { useToast } from "@/src/hooks/useToast";
import { Toast } from "@/src/components/ui/Toast";
import { isAxiosError } from "axios";
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
  const {
    promptAsync: googleSignIn,
    isReady: isGoogleReady,
    isLoading: isGoogleLoading,
    error: googleError,
  } = useGoogleAuth();
  const {
    signIn: appleSignIn,
    isLoading: isAppleLoading,
    isAvailable: isAppleAvailable,
    error: appleError,
  } = useAppleAuth();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { toast, showToast, hideToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/");
      }
    } catch (error) {
      const code = isAxiosError(error)
        ? (error.response?.data as { code?: string })?.code
        : undefined;

      const codeToKey: Record<string, string> = {
        INVALID_CREDENTIALS: "login.invalidCredentials",
        MISSING_CREDENTIALS: "login.invalidCredentials",
      };

      const key = (code && codeToKey[code]) ?? "login.invalidCredentials";
      showToast(t(key), "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate away when authentication succeeds.
  // useFocusEffect ensures this only fires when the login screen is actually
  // visible — prevents it from interfering with navigation when the screen
  // is buried under oauth2redirect/(tabs) in the stack.
  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        router.replace("/");
      }
    }, [isAuthenticated, router])
  );

  // Show toast on Google auth error
  useEffect(() => {
    if (googleError) {
      showToast(t("login.googleError"), "error");
    }
  }, [googleError, showToast, t]);

  // Show toast on Apple auth error
  useEffect(() => {
    if (appleError) {
      showToast(t("login.appleError"), "error");
    }
  }, [appleError, showToast, t]);

  const handleGoogleSignIn = async () => {
    if (!isGoogleReady || isGoogleLoading) return;
    try {
      await googleSignIn();
      // Auth result is handled asynchronously in useGoogleAuth hook.
      // Navigation happens via the isAuthenticated useEffect above.
    } catch {
      showToast(t("login.googleError"), "error");
    }
  };

  const handleAppleSignIn = async () => {
    if (isAppleLoading) return;
    try {
      await appleSignIn();
      // Navigation happens via the isAuthenticated useFocusEffect above.
    } catch {
      showToast(t("login.appleError"), "error");
    }
  };

  const anyLoading = isLoading || isGoogleLoading || isAppleLoading;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/");
              }
            }}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel={t("common.close")}
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
            accessibilityRole="button"
            accessibilityLabel={t("login.continueWithGoogle")}
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

          {/* Apple Sign In — iOS only, using official Apple button */}
          {isAppleAvailable && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={
                AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
              }
              buttonStyle={
                AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
              }
              cornerRadius={borderRadius.md}
              style={styles.appleButton}
              onPress={handleAppleSignIn}
            />
          )}

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
                accessibilityLabel={t("login.email")}
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
                accessibilityRole="link"
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
                accessibilityLabel={t("login.password")}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? t("a11y.hidePassword") : t("a11y.showPassword")
                }
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
            accessibilityRole="button"
            accessibilityState={{ disabled: anyLoading, busy: isLoading }}
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

      {/* Toast notifications */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={hideToast}
      />
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
  appleButton: {
    width: "100%" as const,
    height: 52,
    marginTop: spacing.sm,
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
