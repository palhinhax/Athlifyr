"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <AlertTriangle className="mb-4 h-16 w-16 text-red-500" />
          <h1 className="mb-4 text-4xl font-bold">Erro Crítico</h1>
          <h2 className="mb-4 text-xl font-semibold text-gray-600">
            Ocorreu um erro grave na aplicação
          </h2>
          <p className="mb-8 max-w-md text-center text-gray-500">
            Pedimos desculpa pelo inconveniente. Por favor, recarrega a página
            ou volta à página inicial.
          </p>
          <div className="flex gap-4">
            <Button onClick={reset}>Tentar novamente</Button>
            <Button
              onClick={() => (window.location.href = "/")}
              variant="outline"
            >
              Voltar à Home
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
