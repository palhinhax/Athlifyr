import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ChatLayoutClient } from "./chat-layout-client";

interface ChatLayoutProps {
  readonly children: React.ReactNode;
  readonly params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ChatLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "chat" });
  return {
    title: t("title"),
    robots: { index: false, follow: false },
  };
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return <ChatLayoutClient>{children}</ChatLayoutClient>;
}
