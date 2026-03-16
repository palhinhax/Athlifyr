import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { WalletPageClient } from "@/components/credits/wallet-page-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "credits" });

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export const dynamic = "force-dynamic";

export default async function WalletPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();
  const { locale } = await params;

  if (!session?.user?.id) {
    redirect(`/${locale}/auth/login`);
  }

  return <WalletPageClient />;
}
