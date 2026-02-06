import { SignInForm } from "@/components/auth/signin-form";
import { AuthVideoBackground } from "@/components/auth/auth-video-background";

export const metadata = {
  title: "Entrar - Athlifyr",
  description: "Entra na tua conta Athlifyr",
};

export default function SignInPage() {
  // Check if demo mode is enabled via environment variable
  const showDemoUsers = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  return (
    <AuthVideoBackground>
      <SignInForm showDemoUsers={showDemoUsers} />
    </AuthVideoBackground>
  );
}
