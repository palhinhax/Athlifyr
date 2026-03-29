import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/page-container";

interface TermsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageContainer size="lg" maxWidth="max-w-4xl">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
      </Button>

      <article className="prose prose-gray max-w-none dark:prose-invert">
        <h1>Termos de Serviço</h1>
        <p className="text-sm text-muted-foreground">
          Última atualização: 16 de Janeiro de 2026
        </p>

        <p>
          Ao usar o Athlifyr, concordas com estes termos. Lê-os atentamente.
        </p>

        <h2>1. Aceitação dos Termos</h2>
        <p>
          Ao aceder e usar o Athlifyr, aceitas estar vinculado a estes Termos de
          Serviço e à nossa <Link href="/privacy">Política de Privacidade</Link>
          .
        </p>

        <h2>2. Descrição do Serviço</h2>
        <p>
          O Athlifyr é uma plataforma que agrega informações sobre eventos
          desportivos em Portugal e outros países. Fornecemos links para páginas
          oficiais de eventos, mas <strong>não organizamos</strong> nem somos
          responsáveis pelos eventos listados.
        </p>

        <h2>3. Conta de Utilizador</h2>
        <ul>
          <li>
            Deves ter pelo menos <strong>16 anos</strong> para criar uma conta
          </li>
          <li>És responsável por manter a segurança da tua conta</li>
          <li>
            És responsável por todas as atividades realizadas com a tua conta
          </li>
          <li>Deves fornecer informações precisas e atualizadas</li>
        </ul>

        <h2>4. Conteúdo do Utilizador</h2>
        <p>Ao publicar conteúdo (fotos, comentários):</p>
        <ul>
          <li>Garantes que tens os direitos necessários sobre esse conteúdo</li>
          <li>
            Concedes-nos uma licença para usar, exibir e distribuir esse
            conteúdo na plataforma
          </li>
          <li>Concordas que o conteúdo não viola direitos de terceiros</li>
        </ul>

        <h2>5. Uso Proibido</h2>
        <p>É estritamente proibido:</p>
        <ul>
          <li>
            Publicar conteúdo ofensivo, ilegal ou que viole direitos de
            terceiros
          </li>
          <li>Usar o serviço para spam ou atividades maliciosas</li>
          <li>Tentar aceder a áreas restritas do sistema</li>
          <li>Copiar ou reproduzir o conteúdo do Athlifyr sem autorização</li>
          <li>Usar bots ou ferramentas automatizadas sem permissão</li>
        </ul>

        <h2>6. Propriedade Intelectual</h2>
        <p>
          Todo o conteúdo do Athlifyr (design, código, marca, logo) é
          propriedade nossa ou dos nossos licenciadores. Não podes copiar,
          modificar ou reproduzir sem autorização expressa.
        </p>

        <h2>7. Isenção de Responsabilidade</h2>
        <p>
          O serviço é fornecido <strong>&ldquo;como está&rdquo;</strong>. Não
          garantimos:
        </p>
        <ul>
          <li>A precisão das informações sobre eventos</li>
          <li>Que o serviço estará sempre disponível</li>
          <li>Que o serviço está livre de erros</li>
        </ul>
        <p>
          <strong>Não somos responsáveis</strong> por cancelamentos, alterações
          ou problemas com eventos listados. Verifica sempre a informação
          oficial do evento.
        </p>

        <h2>8. Limitação de Responsabilidade</h2>
        <p>
          Na medida máxima permitida por lei, não seremos responsáveis por danos
          indiretos, incidentais ou consequenciais resultantes do uso do
          serviço.
        </p>

        <h2>9. Suspensão e Eliminação de Contas</h2>
        <p>
          Reservamo-nos o direito de suspender ou eliminar contas que violem
          estes termos, sem aviso prévio. Motivos incluem:
        </p>
        <ul>
          <li>Violação dos termos de serviço</li>
          <li>Comportamento abusivo ou ofensivo</li>
          <li>Atividades ilegais ou fraudulentas</li>
        </ul>

        <h2>10. Alterações aos Termos</h2>
        <p>
          Podemos modificar estes termos a qualquer momento. Notificar-te-emos
          de alterações significativas. O uso continuado após alterações
          constitui aceitação dos novos termos.
        </p>

        <h2>11. Lei Aplicável</h2>
        <p>
          Estes termos são regidos pelas leis de <strong>Portugal</strong>.
          Qualquer disputa será resolvida nos tribunais portugueses.
        </p>

        <h2 id="credits">12. Créditos Athlifyr</h2>
        <p>
          Os Créditos Athlifyr são créditos da plataforma para utilização dentro
          do ecossistema Athlifyr. <strong>Não são dinheiro eletrónico</strong>,
          conta bancária ou produto financeiro. Os créditos não podem ser
          transferidos, levantados ou usados fora da plataforma.
        </p>

        <h3>12.1. Natureza dos Créditos</h3>
        <ul>
          <li>
            Os créditos são uma unidade de valor interna da plataforma, sem
            valor monetário fora do Athlifyr
          </li>
          <li>1 crédito equivale a 1€ de valor dentro da plataforma</li>
          <li>
            Os créditos são adquiridos através de carregamentos (top-ups) via
            métodos de pagamento aceites
          </li>
        </ul>

        <h3>12.2. Utilização</h3>
        <ul>
          <li>
            Os créditos podem ser usados para compras de produtos e serviços
            dentro da plataforma Athlifyr
          </li>
          <li>
            Compras de valor inferior a 5€ devem ser pagas exclusivamente com
            créditos
          </li>
          <li>O saldo de créditos é pessoal e intransmissível</li>
        </ul>

        <h3>12.3. Restrições</h3>
        <ul>
          <li>
            Os créditos <strong>não são reembolsáveis</strong> nem transferíveis
          </li>
          <li>
            Os créditos <strong>não podem ser convertidos</strong> em dinheiro
            nem levantados
          </li>
          <li>Os créditos só podem ser usados dentro da plataforma Athlifyr</li>
          <li>
            O Athlifyr reserva-se o direito de ajustar ou revogar créditos em
            caso de fraude ou violação dos termos
          </li>
        </ul>

        <h3>12.4. Taxa de Processamento</h3>
        <p>
          Sobre cada carregamento de créditos é aplicada uma taxa de
          processamento de <strong>4%</strong>. Por exemplo, ao carregar 10€,
          recebes 9.60 créditos.
        </p>

        <h3>12.5. Liquidação a Espaços Parceiros</h3>
        <p>
          Os valores de compras efetuadas com créditos são liquidados
          semanalmente aos espaços parceiros (venues), após dedução da comissão
          da plataforma.
        </p>

        <h2>13. Contacto</h2>
        <p>
          Para questões sobre estes termos, contacta-nos através da{" "}
          <Link href="/contact">página de contacto</Link>.
        </p>

        <div className="mt-12 rounded-lg border bg-muted/50 p-6">
          <h3 className="mt-0">Em Resumo</h3>
          <ul className="mb-0">
            <li>✅ Deves ter 16+ anos</li>
            <li>✅ És responsável pelo conteúdo que publicas</li>
            <li>✅ Não somos responsáveis pelos eventos listados</li>
            <li>✅ Respeita os outros utilizadores</li>
            <li>✅ Podemos suspender contas que violem os termos</li>
            <li>✅ Créditos não são reembolsáveis nem transferíveis</li>
          </ul>
        </div>
      </article>
    </PageContainer>
  );
}
