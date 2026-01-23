import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CookiesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CookiesPage({ params }: CookiesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>

        <article className="prose prose-gray dark:prose-invert max-w-none">
          <h1>Política de Cookies 🍪</h1>
          <p className="text-sm text-muted-foreground">
            Última atualização: 16 de Janeiro de 2026
          </p>

          <p>
            Utilizamos cookies para melhorar a tua experiência no Athlifyr. Esta
            página explica o que são cookies e como os usamos.
          </p>

          <h2>O que são Cookies?</h2>
          <p>
            Cookies são pequenos ficheiros de texto armazenados no teu
            dispositivo quando visitas um website. Permitem que o site te
            reconheça e se lembre das tuas preferências.
          </p>

          <h2>Tipos de Cookies que Usamos</h2>

          <h3>1. Cookies Essenciais (Obrigatórios) ✅</h3>
          <p>
            Necessários para o funcionamento básico do site. Sem estes, o site
            não funciona corretamente.
          </p>
          <ul>
            <li>
              <strong>Autenticação:</strong> Mant&#234;m a tua sessão de login
            </li>
            <li>
              <strong>Preferências:</strong> Idioma, tema, filtros
            </li>
            <li>
              <strong>Consentimento:</strong> Guarda a tua escolha de cookies
            </li>
          </ul>

          <h3>2. Cookies de Análise (Opcionais) 📊</h3>
          <p>
            Ajudam-nos a entender como os visitantes usam o site, para melhorar
            a experiência.
          </p>
          <ul>
            <li>
              <strong>Google Analytics:</strong> Páginas visitadas, tempo no
              site, origem do tráfego
            </li>
          </ul>

          <h3>3. Cookies Funcionais (Opcionais) ⚙️</h3>
          <p>Permitem funcionalidades melhoradas e personalização.</p>
          <ul>
            <li>Preferências de filtros de eventos guardadas</li>
            <li>Localização guardada (apenas com permissão)</li>
            <li>Desportos favoritos</li>
          </ul>

          <h2>Cookies de Terceiros</h2>
          <p>
            Usamos <strong>Google Analytics</strong>, que coloca cookies no teu
            dispositivo para análise. Podes saber mais na{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              política de privacidade do Google
            </a>
            .
          </p>

          <h2>Como Gerir Cookies</h2>
          <p>Tens várias opções:</p>
          <ul>
            <li>
              <strong>Banner de Cookies:</strong> Podes aceitar ou rejeitar
              cookies não essenciais
            </li>
            <li>
              <strong>Navegador:</strong> Configura o teu navegador para
              bloquear cookies (pode afetar funcionalidade)
            </li>
            <li>
              <strong>Google Analytics:</strong> Usa o{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Analytics Opt-out Browser Add-on
              </a>
            </li>
          </ul>

          <h2>Duração dos Cookies</h2>
          <ul>
            <li>
              <strong>Cookies de Sessão:</strong> Expiram quando fechas o
              navegador
            </li>
            <li>
              <strong>Cookies Persistentes:</strong> Permanecem no teu
              dispositivo por um período definido (até 365 dias)
            </li>
          </ul>

          <h2>Lista Detalhada de Cookies</h2>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Tipo</th>
                  <th>Finalidade</th>
                  <th>Duração</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>next-auth.session-token</code>
                  </td>
                  <td>Essencial</td>
                  <td>Autenticação de utilizador</td>
                  <td>30 dias</td>
                </tr>
                <tr>
                  <td>
                    <code>NEXT_LOCALE</code>
                  </td>
                  <td>Essencial</td>
                  <td>Preferência de idioma</td>
                  <td>1 ano</td>
                </tr>
                <tr>
                  <td>
                    <code>athlifyr_cookie_consent</code>
                  </td>
                  <td>Essencial</td>
                  <td>Guarda escolha de cookies</td>
                  <td>1 ano</td>
                </tr>
                <tr>
                  <td>
                    <code>_ga</code>
                  </td>
                  <td>Analítico</td>
                  <td>Google Analytics - identificação</td>
                  <td>2 anos</td>
                </tr>
                <tr>
                  <td>
                    <code>_gid</code>
                  </td>
                  <td>Analítico</td>
                  <td>Google Analytics - estatísticas</td>
                  <td>24 horas</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Atualizações</h2>
          <p>
            Podemos atualizar esta política periodicamente. Verifica esta página
            regularmente para te manteres informado.
          </p>

          <h2>Perguntas?</h2>
          <p>
            Se tiveres questões sobre cookies, contacta-nos através da{" "}
            <Link href="/contact">página de contacto</Link>.
          </p>

          <div className="mt-12 rounded-lg border bg-muted/50 p-6">
            <h3 className="mt-0">Resumo Rápido</h3>
            <ul className="mb-0">
              <li>🍪 Usamos cookies essenciais (obrigatórios)</li>
              <li>📊 Google Analytics (opcional - podes recusar)</li>
              <li>⚙️ Cookies funcionais (opcional - podes recusar)</li>
              <li>🔒 Podes gerir as tuas preferências a qualquer momento</li>
              <li>❌ Não vendemos dados de cookies</li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  );
}
