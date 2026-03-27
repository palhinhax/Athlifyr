"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useGoogleAuth } from "@/hooks/use-google-auth";
import { useAppleAuth } from "@/hooks/use-apple-auth";
import { useFacebookAuth } from "@/hooks/use-facebook-auth";
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
import {
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  Crown,
  Dumbbell,
  Users,
} from "lucide-react";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";

// Demo users for quick login
const DEMO_USERS = {
  owner: {
    email: "tiago@acor.pt",
    name: "Tiago Amaro",
    role: "Owner",
    icon: Crown,
  },
  coach: {
    email: "duarte@acor.pt",
    name: "Duarte Covas",
    role: "Coach",
    icon: Dumbbell,
  },
  athlete: {
    email: "bruno@acor.pt",
    name: "Bruno Costa",
    role: "Atleta",
    icon: Users,
  },
};

const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "";

interface SignInFormProps {
  showDemoUsers?: boolean;
}

export function SignInForm({
  showDemoUsers = false,
}: Readonly<SignInFormProps>) {
  const t = useTranslations("signIn");
  const tCommon = useTranslations("common");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { toast } = useToast();
  const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleAuth();
  const { signInWithApple, isLoading: isAppleLoading } = useAppleAuth();
  const { signInWithFacebook, isLoading: isFacebookLoading } =
    useFacebookAuth();

  const handleDemoLogin = async (userKey: keyof typeof DEMO_USERS) => {
    setDemoLoading(userKey);
    const user = DEMO_USERS[userKey];

    try {
      const result = await signIn("credentials", {
        email: user.email,
        password: DEMO_PASSWORD,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: t("errors.loginError"),
          description: t("errors.demoLoginFailed"),
          variant: "destructive",
        });
      } else {
        // Clear cached data so it refreshes after login
        sessionStorage.removeItem("activeVenues");
        toast({
          title: t("toast.welcome", { name: user.name }),
          description: t("toast.enteringAs", { role: user.role }),
        });
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      toast({
        title: t("errors.error"),
        description: t("errors.somethingWentWrong"),
        variant: "destructive",
      });
    } finally {
      setDemoLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: t("errors.loginError"),
          description: t("errors.wrongCredentials"),
          variant: "destructive",
        });
      } else {
        // Clear cached data so it refreshes after login
        sessionStorage.removeItem("activeVenues");
        toast({
          title: t("toast.loginSuccess"),
          description: t("toast.welcomeBack"),
        });
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      toast({
        title: t("errors.error"),
        description: t("errors.somethingWentWrong"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (
    authFn: (url: string) => Promise<void>,
    errorKey: string
  ) => {
    try {
      await authFn(callbackUrl);
    } catch {
      toast({
        title: t("errors.error"),
        description: t(`errors.${errorKey}`),
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignIn = () =>
    handleSocialSignIn(signInWithGoogle, "googleSignIn");

  const handleAppleSignIn = () =>
    handleSocialSignIn(signInWithApple, "appleSignIn");

  const handleFacebookSignIn = () =>
    handleSocialSignIn(signInWithFacebook, "facebookSignIn");

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Demo Users Quick Login */}
        {showDemoUsers && (
          <>
            <div className="rounded-lg border border-dashed border-primary/50 bg-primary/5 p-4">
              <p className="mb-3 text-center text-sm font-medium text-primary">
                🚀 {t("demo.quickAccess")}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(
                  Object.entries(DEMO_USERS) as [
                    keyof typeof DEMO_USERS,
                    (typeof DEMO_USERS)[keyof typeof DEMO_USERS],
                  ][]
                ).map(([key, user]) => {
                  const Icon = user.icon;
                  return (
                    <Button
                      key={key}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDemoLogin(key)}
                      disabled={isLoading || demoLoading !== null}
                      className="flex h-auto flex-col gap-1 py-3"
                    >
                      {demoLoading === key ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                      <span className="text-xs font-medium">{user.role}</span>
                    </Button>
                  );
                })}
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Password:{" "}
                <code className="rounded bg-muted px-1">{DEMO_PASSWORD}</code>
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t("demo.orUseCredentials")}
                </span>
              </div>
            </div>
          </>
        )}

        <SocialAuthButtons
          onGoogleClick={handleGoogleSignIn}
          onAppleClick={handleAppleSignIn}
          onFacebookClick={handleFacebookSignIn}
          disabled={isLoading}
          isGoogleLoading={isGoogleLoading}
          isAppleLoading={isAppleLoading}
          isFacebookLoading={isFacebookLoading}
          googleLabel={t("continueWithGoogle")}
          appleLabel={t("continueWithApple")}
          facebookLabel={t("continueWithFacebook")}
        />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {t("orContinueWithEmail")}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">
              {t("email")} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              aria-required="true"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">
                {t("password")} <span className="text-destructive">*</span>
              </Label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                {t("forgotPassword")}
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                aria-required="true"
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
                aria-label={
                  showPassword
                    ? tCommon("hidePassword")
                    : tCommon("showPassword")
                }
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("signingIn")}
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                {t("title")}
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <p className="text-center text-sm text-muted-foreground">
          {t("noAccount")}{" "}
          <Link
            href={`/auth/signup${callbackUrl === "/" ? "" : `?callbackUrl=${encodeURIComponent(callbackUrl)}`}`}
            className="text-primary hover:underline"
          >
            {t("createAccount")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
