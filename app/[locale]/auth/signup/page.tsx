import { SignUpForm } from "@/components/auth/signup-form";
import { AuthVideoBackground } from "@/components/auth/auth-video-background";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "signUp.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function SignUpPage() {
  return (
    <AuthVideoBackground>
      <SignUpForm />
    </AuthVideoBackground>
  );
}
