import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SettingsTabs } from "@/components/settings-tabs";
import { getTranslations } from "next-intl/server";
import { PageContainer } from "@/components/page-container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      locale: true,
      createdAt: true,
      favoriteSports: true,
      emailVerified: true,
      emailNotifications: true,
      dateOfBirth: true,
      citizenId: true,
      nationality: true,
      emergencyContactName: true,
      emergencyContactPhone: true,
      liveRaceVisibility: true,
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "settings" });

  return (
    <PageContainer size="lg" maxWidth="max-w-4xl">
      <h1 className="mb-8 text-4xl font-bold">{t("title")}</h1>
      <SettingsTabs user={user} locale={locale} />
    </PageContainer>
  );
}
