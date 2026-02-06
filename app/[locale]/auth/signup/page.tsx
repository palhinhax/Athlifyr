import { SignUpForm } from "@/components/auth/signup-form";
import { AuthVideoBackground } from "@/components/auth/auth-video-background";

export const metadata = {
  title: "Criar Conta - Athlifyr",
  description: "Cria a tua conta Athlifyr",
};

export default function SignUpPage() {
  return (
    <AuthVideoBackground>
      <SignUpForm />
    </AuthVideoBackground>
  );
}
