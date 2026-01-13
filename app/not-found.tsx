import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="mb-4 text-6xl font-bold">404</h1>
      <h2 className="mb-4 text-2xl font-semibold">Página não encontrada</h2>
      <p className="mb-8 max-w-md text-center text-muted-foreground">
        Desculpe, a página que procura não existe ou foi removida.
      </p>
      <Link href="/">
        <Button>Voltar à Home</Button>
      </Link>
    </div>
  );
}
