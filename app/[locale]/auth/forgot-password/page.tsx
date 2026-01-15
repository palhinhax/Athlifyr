import { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Recuperar Password - Athlifyr",
  description: "Recupera a tua password da conta Athlifyr",
};

export default function ForgotPasswordPage() {
  return (
    <div className="container flex min-h-screen items-center justify-center py-10">
      <ForgotPasswordForm />
    </div>
  );
}
