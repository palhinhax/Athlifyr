import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href={`/${locale}`}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>

        <article className="prose prose-gray dark:prose-invert max-w-none">
          <h1>Política de Privacidade</h1>
          <p className="text-sm text-muted-foreground">
            Última atualização: 16 de Janeiro de 2026
          </p>

          <p>
            A tua privacidade é importante para nós. Esta política explica como
            recolhemos, usamos e protegemos os teus dados pessoais quando usas o
            Athlifyr.
          </p>

          <h2>1. Dados que Recolhemos</h2>
          <p>Quando usas o Athlifyr, podemos recolher:</p>
          <ul>
            <li>
              <strong>Dados de Conta:</strong> Nome, email, fotografia de perfil
              (via Google OAuth)
            </li>
            <li>
              <strong>Dados de Localização:</strong> Coordenadas GPS (apenas com
              a tua autorização explícita)
            </li>
            <li>
              <strong>Conteúdo:</strong> Fotos, comentários e outros conteúdos
              que publiques
            </li>
            <li>
              <strong>Dados de Utilização:</strong> Páginas visitadas, eventos
              marcados, preferências
            </li>
            <li>
              <strong>Dados Técnicos:</strong> Endereço IP, tipo de navegador,
              sistema operativo
            </li>
          </ul>

          <h2>2. Como Usamos os Teus Dados</h2>
          <p>Utilizamos os teus dados pessoais para:</p>
          <ul>
            <li>Fornecer e melhorar os nossos serviços</li>
            <li>Personalizar a tua experiência</li>
            <li>Mostrar eventos próximos de ti (se autorizares localização)</li>
            <li>Permitir que partilhes conteúdo e interajas com outros</li>
            <li>Enviar notificações sobre eventos (com o teu consentimento)</li>
            <li>Analisar o uso do site para melhorias (Google Analytics)</li>
            <li>Cumprir obrigações legais</li>
          </ul>

          <h2>3. Partilha de Dados</h2>
          <p>
            <strong>Não vendemos os teus dados pessoais.</strong>
          </p>
          <p>Partilhamos informações apenas com:</p>
          <ul>
            <li>
              <strong>Google:</strong> Para autenticação (OAuth) e análise
              (Google Analytics)
            </li>
            <li>
              <strong>Backblaze B2:</strong> Para armazenamento seguro de
              imagens
            </li>
            <li>
              <strong>Autoridades:</strong> Quando exigido por lei ou para
              proteger direitos
            </li>
          </ul>

          <h2>4. Retenção de Dados</h2>
          <p>
            Mantemos os teus dados enquanto a tua conta estiver ativa ou
            conforme necessário para fornecer serviços. Podes solicitar a
            eliminação da tua conta a qualquer momento através da página de
            contacto.
          </p>

          <h2>5. Os Teus Direitos (RGPD)</h2>
          <p>Tens direito a:</p>
          <ul>
            <li>
              <strong>Acesso:</strong> Solicitar uma cópia dos teus dados
            </li>
            <li>
              <strong>Retificação:</strong> Corrigir informações incorretas
            </li>
            <li>
              <strong>Eliminação:</strong> Pedir a remoção dos teus dados
            </li>
            <li>
              <strong>Portabilidade:</strong> Exportar os teus dados
            </li>
            <li>
              <strong>Oposição:</strong> Opor-te ao processamento dos teus dados
            </li>
            <li>
              <strong>Retirar Consentimento:</strong> Retirar consentimentos
              dados anteriormente
            </li>
          </ul>
          <p>
            Para exercer estes direitos, contacta-nos através da{" "}
            <Link href={`/${locale}/contact`}>página de contacto</Link>.
          </p>

          <h2>6. Cookies</h2>
          <p>
            Utilizamos cookies essenciais para o funcionamento do site
            (autenticação, preferências de idioma) e cookies analíticos (Google
            Analytics) para melhorar a tua experiência.
          </p>
          <p>
            Podes gerir as tuas preferências de cookies a qualquer momento. Vê
            mais na nossa{" "}
            <Link href={`/${locale}/cookies`}>Política de Cookies</Link>.
          </p>

          <h2>7. Segurança</h2>
          <p>
            Implementamos medidas técnicas e organizacionais para proteger os
            teus dados contra acesso não autorizado, perda ou destruição,
            incluindo:
          </p>
          <ul>
            <li>Encriptação de dados em trânsito (HTTPS)</li>
            <li>Autenticação segura via Google OAuth</li>
            <li>Armazenamento seguro de imagens</li>
            <li>Acesso restrito a dados pessoais</li>
          </ul>

          <h2>8. Menores de Idade</h2>
          <p>
            Os nossos serviços não se destinam a menores de 16 anos. Se
            descobrirmos que recolhemos dados de um menor sem consentimento
            parental, eliminaremos essas informações imediatamente.
          </p>

          <h2>9. Transferências Internacionais</h2>
          <p>
            Os teus dados podem ser transferidos e armazenados em servidores
            localizados fora da União Europeia. Quando isso acontece, garantimos
            que existem salvaguardas adequadas para proteger os teus dados.
          </p>

          <h2>10. Alterações à Política</h2>
          <p>
            Podemos atualizar esta Política de Privacidade ocasionalmente.
            Notificar-te-emos de alterações significativas através do site ou
            por email. A data da última atualização está indicada no topo desta
            página.
          </p>

          <h2>11. Contacto</h2>
          <p>
            Para questões sobre privacidade ou para exercer os teus direitos,
            contacta-nos através da{" "}
            <Link href={`/${locale}/contact`}>página de contacto</Link>.
          </p>

          <div className="mt-12 rounded-lg border bg-muted/50 p-6">
            <h3 className="mt-0">Resumo</h3>
            <ul className="mb-0">
              <li>✅ Recolhemos apenas dados necessários</li>
              <li>✅ Não vendemos os teus dados</li>
              <li>✅ Podes aceder, corrigir e eliminar os teus dados</li>
              <li>✅ Usamos cookies (podes gerir nas definições)</li>
              <li>✅ Os teus dados estão protegidos</li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  );
}
