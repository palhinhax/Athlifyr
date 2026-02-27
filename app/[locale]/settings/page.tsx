import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SettingsTabs } from "@/components/settings-tabs";
import { getTranslations } from "next-intl/server";

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
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "settings" });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">{t("title")}</h1>
        <SettingsTabs user={user} locale={locale} />
      </div>
    </div>
  );
}
