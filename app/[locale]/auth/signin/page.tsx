import { SignInForm } from "@/components/auth/signin-form";
import { AuthVideoBackground } from "@/components/auth/auth-video-background";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "signIn.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function SignInPage() {
  // Check if demo mode is enabled via environment variable
  const showDemoUsers = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  return (
    <AuthVideoBackground>
      <SignInForm showDemoUsers={showDemoUsers} />
    </AuthVideoBackground>
  );
}
