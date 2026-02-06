"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/routing";
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

const DEMO_PASSWORD = "Test123!";

interface SignInFormProps {
  showDemoUsers?: boolean;
}

export function SignInForm({ showDemoUsers = false }: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

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
          title: "Erro ao fazer login",
          description: "Não foi possível entrar com esta conta de demo",
          variant: "destructive",
        });
      } else {
        // Clear cached data so it refreshes after login
        sessionStorage.removeItem("activeVenues");
        toast({
          title: `Bem-vindo, ${user.name}!`,
          description: `A entrar como ${user.role}...`,
        });
        router.push("/");
        router.refresh();
      }
    } catch {
      toast({
        title: "Erro",
        description: "Algo correu mal. Tenta novamente.",
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
          title: "Erro ao fazer login",
          description: "Email ou password incorretos",
          variant: "destructive",
        });
      } else {
        // Clear cached data so it refreshes after login
        sessionStorage.removeItem("activeVenues");
        toast({
          title: "Login efetuado",
          description: "Bem-vindo de volta!",
        });
        router.push("/");
        router.refresh();
      }
    } catch {
      toast({
        title: "Erro",
        description: "Algo correu mal. Tenta novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao fazer login com Google",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>
          Entra na tua conta para aceder a todas as funcionalidades
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Demo Users Quick Login */}
        {showDemoUsers && (
          <>
            <div className="rounded-lg border border-dashed border-primary/50 bg-primary/5 p-4">
              <p className="mb-3 text-center text-sm font-medium text-primary">
                🚀 Acesso Rápido Demo
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
                <code className="rounded bg-muted px-1">Test123!</code>
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou usa as tuas credenciais
                </span>
              </div>
            </div>
          </>
        )}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continuar com Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Ou continua com email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="o-teu-email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Esqueceste a password?
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
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />A entrar...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Entrar
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <p className="text-center text-sm text-muted-foreground">
          Não tens conta?{" "}
          <Link href="/auth/signup" className="text-primary hover:underline">
            Criar conta
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
