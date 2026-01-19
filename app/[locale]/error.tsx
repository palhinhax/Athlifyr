"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <AlertTriangle className="mb-4 h-16 w-16 text-destructive" />
      <h1 className="mb-4 text-4xl font-bold">Algo correu mal</h1>
      <h2 className="mb-4 text-xl font-semibold text-muted-foreground">
        Ocorreu um erro inesperado
      </h2>
      <p className="mb-8 max-w-md text-center text-muted-foreground">
        Pedimos desculpa pelo inconveniente. Por favor, tenta novamente ou volta
        à página inicial.
      </p>
      <div className="flex gap-4">
        <Button onClick={reset} variant="default">
          Tentar novamente
        </Button>
        <Button onClick={() => (window.location.href = "/")} variant="outline">
          Voltar à Home
        </Button>
      </div>
      {process.env.NODE_ENV === "development" && error.message && (
        <div className="mt-8 max-w-2xl rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="mb-2 font-mono text-sm font-semibold">
            Erro (apenas em dev):
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            {error.message}
          </p>
        </div>
      )}
    </div>
  );
}
