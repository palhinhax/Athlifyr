import { Suspense } from "react";
import { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Alterar Password - Athlifyr",
  description: "Altera a tua password da conta Athlifyr",
};

function ResetPasswordContent() {
  return <ResetPasswordForm />;
}

export default function ResetPasswordPage() {
  return (
    <div className="container flex min-h-screen items-center justify-center py-10">
      <Suspense fallback={<div>A carregar...</div>}>
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
