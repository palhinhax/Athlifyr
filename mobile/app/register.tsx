import { useState, useEffect } from "react";
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
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as AppleAuthentication from "expo-apple-authentication";
import { api } from "@/src/lib/api";
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

const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (password.length >= 12) strength += 25;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20;
  if (/\d/.test(password)) strength += 15;
  if (/[^a-zA-Z0-9]/.test(password)) strength += 15;
  return Math.min(strength, 100);
};

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export default function RegisterScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    promptAsync: googleSignIn,
    isReady: isGoogleReady,
    isLoading: isGoogleLoading,
  } = useGoogleAuth();
  const {
    signIn: appleSignIn,
    isLoading: isAppleLoading,
    isAvailable: isAppleAvailable,
  } = useAppleAuth();
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { toast, showToast, hideToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const passwordStrength = calculatePasswordStrength(password);

  const getStrengthColor = () => {
    if (passwordStrength < 40) return colors.error;
    if (passwordStrength < 70) return colors.warning;
    return colors.success;
  };

  const getStrengthText = () => {
    if (passwordStrength < 40) return t("register.passwordWeak");
    if (passwordStrength < 70) return t("register.passwordMedium");
    return t("register.passwordStrong");
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = t("register.nameRequired");
    }
    if (!email.trim()) {
      newErrors.email = t("register.emailRequired");
    }
    if (!password.trim()) {
      newErrors.password = t("register.passwordRequired");
    } else if (password.length < 6) {
      newErrors.password = t("register.passwordMinLength");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      // Clear any existing session before registering a new account
      await logout();

      await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      showToast(t("register.nowYouCanSignIn"), "success");
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/");
      }
      setTimeout(() => router.push("/login"), 100);
    } catch (error) {
      const code = isAxiosError(error)
        ? (error.response?.data as { code?: string })?.code
        : undefined;

      const codeToKey: Record<string, string> = {
        EMAIL_ALREADY_IN_USE: "register.emailAlreadyInUse",
        NAME_TOO_SHORT: "register.nameMinLength",
        EMAIL_INVALID: "register.emailInvalid",
        PASSWORD_TOO_SHORT: "register.passwordMinLengthServer", // NOSONAR - error code, not a password
      };

      const key = (code && codeToKey[code]) ?? "register.registrationFailed";
      showToast(t(key), "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate when Google auth succeeds (async flow handled in useGoogleAuth hook)
  useEffect(() => {
    if (isAuthenticated) {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/");
      }
    }
  }, [isAuthenticated, router]);

  const handleGoogleSignIn = async () => {
    if (!isGoogleReady || isGoogleLoading) return;
    try {
      await googleSignIn();
      // Navigation happens via the isAuthenticated useEffect above
    } catch {
      showToast(t("login.googleError"), "error");
    }
  };

  const handleAppleSignIn = async () => {
    if (isAppleLoading) return;
    try {
      await appleSignIn();
      // Navigation happens via the isAuthenticated useEffect above
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
          <Text style={styles.title}>{t("register.title")}</Text>

          {/* Google Sign In */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            disabled={anyLoading}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={t("register.continueWithGoogle")}
          >
            {isGoogleLoading ? (
              <ActivityIndicator color={colors.text} size="small" />
            ) : (
              <>
                <GoogleIcon size={20} />
                <Text style={styles.googleButtonText}>
                  {t("register.continueWithGoogle")}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Apple Sign In — iOS only, using official Apple button */}
          {isAppleAvailable && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={
                AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP
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
            <Text style={styles.dividerText}>
              {t("register.orContinueWith")}
            </Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Name Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t("register.name")}</Text>
            <View
              style={[
                styles.inputContainer,
                errors.name ? styles.inputError : null,
              ]}
            >
              <User size={20} color={colors.mutedForeground} />
              <TextInput
                style={styles.input}
                placeholder={t("register.namePlaceholder")}
                placeholderTextColor={colors.textTertiary}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name)
                    setErrors((e) => ({ ...e, name: undefined }));
                }}
                autoCapitalize="words"
                autoCorrect={false}
                editable={!anyLoading}
                accessibilityLabel={t("register.name")}
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Email Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t("register.email")}</Text>
            <View
              style={[
                styles.inputContainer,
                errors.email ? styles.inputError : null,
              ]}
            >
              <Mail size={20} color={colors.mutedForeground} />
              <TextInput
                style={styles.input}
                placeholder={t("register.emailPlaceholder")}
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
                accessibilityLabel={t("register.email")}
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          {/* Password Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t("register.password")}</Text>
            <View
              style={[
                styles.inputContainer,
                errors.password ? styles.inputError : null,
              ]}
            >
              <Lock size={20} color={colors.mutedForeground} />
              <TextInput
                style={styles.input}
                placeholder={t("register.passwordPlaceholder")}
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
                accessibilityLabel={t("register.password")}
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

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBarBackground}>
                  <View
                    style={[
                      styles.strengthBarFill,
                      {
                        width: `${passwordStrength}%`,
                        backgroundColor: getStrengthColor(),
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[styles.strengthText, { color: getStrengthColor() }]}
                >
                  {getStrengthText()}
                </Text>
              </View>
            )}
            {password.length > 0 && (
              <Text style={styles.passwordHint}>
                {passwordStrength < 70
                  ? t("register.passwordHint")
                  : t("register.passwordStrengthOk")}
              </Text>
            )}
          </View>

          {/* Create Account Button */}
          <TouchableOpacity
            style={[
              styles.createButton,
              anyLoading && styles.createButtonDisabled,
            ]}
            onPress={handleRegister}
            disabled={anyLoading}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityState={{ disabled: anyLoading, busy: isLoading }}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.createButtonText}>
                {t("register.createAccountButton")}
              </Text>
            )}
          </TouchableOpacity>

          {/* Sign In Link */}
          <View style={styles.footerLinkContainer}>
            <Text style={styles.footerText}>
              {t("register.alreadyHaveAccount")}{" "}
            </Text>
            <TouchableOpacity
              onPress={() => {
                router.back();
                setTimeout(() => router.push("/login"), 100);
              }}
              disabled={anyLoading}
            >
              <Text style={styles.footerLink}>{t("register.signIn")}</Text>
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
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
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
  strengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  strengthBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: colors.muted,
    borderRadius: borderRadius.full,
    overflow: "hidden",
  },
  strengthBarFill: {
    height: "100%",
    borderRadius: borderRadius.full,
  },
  strengthText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  passwordHint: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.md,
    ...shadows.md,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
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
