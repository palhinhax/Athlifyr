import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User, Mail, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">Definições da Conta</h1>

        <div className="space-y-6">
          {/* Account Information */}
          <Card className="p-6">
            <h2 className="mb-4 text-2xl font-semibold">Informação da Conta</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{user.name || "Não definido"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              {user.role === "ADMIN" && (
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Função</p>
                    <p className="font-medium text-primary">Administrador</p>
                  </div>
                </div>
              )}

              <div className="pt-4 text-sm text-muted-foreground">
                Conta criada em{" "}
                {new Date(user.createdAt).toLocaleDateString("pt-PT", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          </Card>

          {/* Privacy & Security */}
          <Card className="p-6">
            <h2 className="mb-4 text-2xl font-semibold">
              Privacidade e Segurança
            </h2>
            <p className="text-muted-foreground">
              As definições de privacidade e segurança estarão disponíveis em
              breve.
            </p>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <h2 className="mb-4 text-2xl font-semibold">Notificações</h2>
            <p className="text-muted-foreground">
              As preferências de notificações estarão disponíveis em breve.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
