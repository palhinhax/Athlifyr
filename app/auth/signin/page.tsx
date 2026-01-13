import { SignInForm } from "@/components/auth/signin-form";

export const metadata = {
  title: "Entrar - Athlifyr",
  description: "Entra na tua conta Athlifyr",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <SignInForm />
    </div>
  );
}
