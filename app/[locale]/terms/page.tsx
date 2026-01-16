import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TermsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function TermsPage({ params }: TermsPageProps) {
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
          <h1>Termos de Serviço</h1>
          <p className="text-sm text-muted-foreground">
            Última atualização: 16 de Janeiro de 2026
          </p>

          <p>
            Ao usar o Athlifyr, concordas com estes termos. Lê-os atentamente.
          </p>

          <h2>1. Aceitação dos Termos</h2>
          <p>
            Ao aceder e usar o Athlifyr, aceitas estar vinculado a estes Termos
            de Serviço e à nossa{" "}
            <Link href={`/${locale}/privacy`}>Política de Privacidade</Link>.
          </p>

          <h2>2. Descrição do Serviço</h2>
          <p>
            O Athlifyr é uma plataforma que agrega informações sobre eventos
            desportivos em Portugal e outros países. Fornecemos links para
            páginas oficiais de eventos, mas <strong>não organizamos</strong>{" "}
            nem somos responsáveis pelos eventos listados.
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
            <li>
              Garantes que tens os direitos necessários sobre esse conteúdo
            </li>
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
            <strong>Não somos responsáveis</strong> por cancelamentos,
            alterações ou problemas com eventos listados. Verifica sempre a
            informação oficial do evento.
          </p>

          <h2>8. Limitação de Responsabilidade</h2>
          <p>
            Na medida máxima permitida por lei, não seremos responsáveis por
            danos indiretos, incidentais ou consequenciais resultantes do uso do
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

          <h2>12. Contacto</h2>
          <p>
            Para questões sobre estes termos, contacta-nos através da{" "}
            <Link href={`/${locale}/contact`}>página de contacto</Link>.
          </p>

          <div className="mt-12 rounded-lg border bg-muted/50 p-6">
            <h3 className="mt-0">Em Resumo</h3>
            <ul className="mb-0">
              <li>✅ Deves ter 16+ anos</li>
              <li>✅ És responsável pelo conteúdo que publicas</li>
              <li>✅ Não somos responsáveis pelos eventos listados</li>
              <li>✅ Respeita os outros utilizadores</li>
              <li>✅ Podemos suspender contas que violem os termos</li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  );
}
