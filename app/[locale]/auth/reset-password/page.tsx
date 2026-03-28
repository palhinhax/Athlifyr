import { Suspense } from "react";
import { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { AuthVideoBackground } from "@/components/auth/auth-video-background";

export const metadata: Metadata = {
  title: "Alterar Password - Athlifyr",
  description: "Altera a tua password da conta Athlifyr",
  robots: { index: false, follow: false },
};

function ResetPasswordContent() {
  return <ResetPasswordForm />;
}

export default function ResetPasswordPage() {
  return (
    <AuthVideoBackground>
      <Suspense fallback={<div>A carregar...</div>}>
        <ResetPasswordContent />
      </Suspense>
    </AuthVideoBackground>
  );
}
