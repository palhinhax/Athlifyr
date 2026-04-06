import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface ContactLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ContactLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return {
    title: t("contact"),
    robots: { index: false, follow: false },
  };
}

export default function ContactLayout({ children }: ContactLayoutProps) {
  return <>{children}</>;
}
