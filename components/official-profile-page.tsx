"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Heart,
  Dumbbell,
  CheckCircle2,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";

interface OfficialProfilePageProps {
  locale: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export function OfficialProfilePage({ user }: OfficialProfilePageProps) {
  const t = useTranslations("officialProfile");
  const router = useRouter();
  const locale = useLocale();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const startChat = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otherUserId: user.id }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/${locale}/chat?conversation=${data.conversation.id}`);
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível iniciar a conversa.",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Algo correu mal. Tenta novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background pb-8 pt-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* Logo and Title */}
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="relative mb-6 h-32 w-32 overflow-hidden rounded-full border-4 border-primary/20 bg-background shadow-xl">
                <Image
                  src={user.image || "/logo.png"}
                  alt="Athlifyr"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <h1 className="mb-2 text-4xl font-bold tracking-tight md:text-5xl">
                {t("title")}
              </h1>
              <p className="text-xl text-muted-foreground">{t("tagline")}</p>

              {/* Verified Badge */}
              <div className="mt-4 flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <CheckCircle2 className="h-4 w-4" />
                <span>Conta Oficial</span>
              </div>

              {/* Message Button */}
              <Button
                onClick={startChat}
                disabled={isLoading}
                className="mt-6"
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MessageCircle className="mr-2 h-4 w-4" />
                )}
                {t("sendMessage")}
              </Button>
            </div>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-center text-lg text-muted-foreground">
              {t("description")}
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold">
            {t("features.title")}
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Events Feature */}
            <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Calendar className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">
                  {t("features.events.title")}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("features.events.description")}
                </p>
              </CardContent>
            </Card>

            {/* Community Feature */}
            <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Heart className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">
                  {t("features.community.title")}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("features.community.description")}
                </p>
              </CardContent>
            </Card>

            {/* Venues Feature */}
            <Card className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Dumbbell className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">
                  {t("features.venues.title")}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("features.venues.description")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Sports Section */}
      <div className="border-y bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-8 text-2xl font-bold">Desportos Disponíveis</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { icon: "🏃", name: "Trail Running" },
                { icon: "🚴", name: "Ciclismo" },
                { icon: "🏊", name: "Triatlo" },
                { icon: "🚶", name: "Caminhada" },
                { icon: "🏃‍♂️", name: "Corrida" },
                { icon: "🎾", name: "Padel" },
                { icon: "⛰️", name: "Escalada" },
                { icon: "🧘", name: "Yoga" },
              ].map((sport) => (
                <div
                  key={sport.name}
                  className="flex items-center gap-2 rounded-full bg-background px-4 py-2 shadow-sm"
                >
                  <span className="text-xl">{sport.icon}</span>
                  <span className="font-medium">{sport.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
