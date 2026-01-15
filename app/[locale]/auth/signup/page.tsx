import { SignUpForm } from "@/components/auth/signup-form";

export const metadata = {
  title: "Criar Conta - Athlifyr",
  description: "Cria a tua conta Athlifyr",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <SignUpForm />
    </div>
  );
}
