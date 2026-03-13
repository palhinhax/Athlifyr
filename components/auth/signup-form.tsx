"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useGoogleAuth } from "@/hooks/use-google-auth";
import { useAppleAuth } from "@/hooks/use-apple-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { analyticsEvent, ANALYTICS_EVENTS } from "@/lib/analytics";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";

// Password strength calculator
const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (password.length >= 12) strength += 25;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20;
  if (/\d/.test(password)) strength += 15;
  if (/[^a-zA-Z0-9]/.test(password)) strength += 15;
  return Math.min(strength, 100);
};

export function SignUpForm() {
  const locale = useLocale();
  const t = useTranslations("signUp");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { toast } = useToast();
  const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleAuth();
  const { signInWithApple, isLoading: isAppleLoading } = useAppleAuth();

  const passwordStrength = calculatePasswordStrength(password);

  const getStrengthColor = () => {
    if (passwordStrength < 40) return "bg-red-500";
    if (passwordStrength < 70) return "bg-orange-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength < 40) return t("passwordStrength.weak");
    if (passwordStrength < 70) return t("passwordStrength.medium");
    return t("passwordStrength.strong");
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Track signup start
    analyticsEvent(ANALYTICS_EVENTS.SIGNUP_START, {
      method: "email",
    });

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Track signup failure
        analyticsEvent(ANALYTICS_EVENTS.SIGNUP_FAILED, {
          method: "email",
          error: data.error || "unknown",
        });
        throw new Error(data.error || t("errors.createAccount"));
      }

      // Track successful signup
      analyticsEvent(ANALYTICS_EVENTS.SIGNUP_COMPLETED, {
        method: "email",
      });

      toast({
        title: t("toast.accountCreated"),
        description: t("toast.canNowLogin"),
      });

      router.push(
        `/${locale}/auth/signin${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`
      );
    } catch (error) {
      toast({
        title: t("errors.createAccount"),
        description:
          error instanceof Error
            ? error.message
            : t("errors.somethingWentWrong"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // Track Google signup start
    analyticsEvent(ANALYTICS_EVENTS.SIGNUP_START, {
      method: "google",
    });

    try {
      await signInWithGoogle(callbackUrl);
    } catch {
      // Track Google signup failure
      analyticsEvent(ANALYTICS_EVENTS.SIGNUP_FAILED, {
        method: "google",
        error: "google_signin_error",
      });

      toast({
        title: t("errors.error"),
        description: t("errors.googleSignIn"),
        variant: "destructive",
      });
    }
  };

  const handleAppleSignIn = async () => {
    analyticsEvent(ANALYTICS_EVENTS.SIGNUP_START, {
      method: "apple",
    });

    try {
      await signInWithApple(callbackUrl);
    } catch {
      analyticsEvent(ANALYTICS_EVENTS.SIGNUP_FAILED, {
        method: "apple",
        error: "apple_signin_error",
      });

      toast({
        title: t("errors.error"),
        description: t("errors.appleSignIn"),
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SocialAuthButtons
          onGoogleClick={handleGoogleSignIn}
          onAppleClick={handleAppleSignIn}
          disabled={isLoading}
          isGoogleLoading={isGoogleLoading}
          isAppleLoading={isAppleLoading}
          googleLabel={t("continueWithGoogle")}
          appleLabel={t("continueWithApple")}
        />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {t("orCreateWithEmail")}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("name")}</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder={t("namePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                minLength={6}
                disabled={isLoading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>

            {/* Password strength indicator */}
            {password && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all ${getStrengthColor()}`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">
                    {getStrengthText()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {passwordStrength < 70
                    ? t("passwordStrength.hint")
                    : t("passwordStrength.strongMessage")}
                </p>
              </div>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t("creating") : t("title")}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <p className="text-center text-sm text-muted-foreground">
          {t("alreadyHaveAccount")}{" "}
          <Link
            href={`/auth/signin${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
            className="text-primary hover:underline"
          >
            {t("signIn")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
