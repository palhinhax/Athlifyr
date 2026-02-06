import { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { AuthVideoBackground } from "@/components/auth/auth-video-background";

export const metadata: Metadata = {
  title: "Recuperar Password - Athlifyr",
  description: "Recupera a tua password da conta Athlifyr",
};

export default function ForgotPasswordPage() {
  return (
    <AuthVideoBackground>
      <ForgotPasswordForm />
    </AuthVideoBackground>
  );
}
