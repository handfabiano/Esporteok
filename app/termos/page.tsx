import { Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermosPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Ticket Sports</h1>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/eventos" className="text-sm font-medium hover:text-primary">
                Eventos
              </Link>
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Entrar</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Termos de Uso</h1>

        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-muted-foreground mb-6">
            Última atualização: 29 de outubro de 2024
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
            <p className="mb-4">
              Ao acessar e usar a plataforma Ticket Sports, você concorda em cumprir e estar
              vinculado aos seguintes termos e condições de uso. Se você não concordar com
              qualquer parte destes termos, não deve usar nossos serviços.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Descrição do Serviço</h2>
            <p className="mb-4">
              A Ticket Sports é uma plataforma digital que conecta organizadores de eventos
              esportivos com participantes, oferecendo:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Sistema de inscrições online para eventos esportivos</li>
              <li>Processamento seguro de pagamentos</li>
              <li>Gerenciamento de resultados e classificações</li>
              <li>Emissão de certificados e comprovantes</li>
              <li>Comunicação entre organizadores e participantes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Cadastro e Conta de Usuário</h2>

            <h3 className="text-xl font-semibold mb-3 mt-4">3.1 Elegibilidade</h3>
            <p className="mb-4">
              Para criar uma conta, você deve:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Ter pelo menos 12 anos de idade</li>
              <li>Fornecer informações verdadeiras e atualizadas</li>
              <li>Menores de 18 anos devem ter autorização dos responsáveis legais</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">3.2 Responsabilidades do Usuário</h3>
            <p className="mb-4">Você é responsável por:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Manter a confidencialidade de sua senha</li>
              <li>Todas as atividades realizadas em sua conta</li>
              <li>Notificar-nos imediatamente sobre uso não autorizado</li>
              <li>Atualizar suas informações quando necessário</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Inscrições em Eventos</h2>

            <h3 className="text-xl font-semibold mb-3 mt-4">4.1 Processo de Inscrição</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>As inscrições são efetivadas mediante pagamento aprovado</li>
              <li>Vagas são limitadas e preenchidas por ordem de pagamento</li>
              <li>Cada evento possui regulamento específico que deve ser aceito</li>
              <li>Informações médicas e emergenciais devem ser verdadeiras</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">4.2 Pagamentos</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Valores pagos não são reembolsáveis, salvo cancelamento do evento</li>
              <li>Taxas de processamento podem ser aplicadas</li>
              <li>Pagamentos são processados via Stripe com segurança PCI-DSS</li>
              <li>Comprovantes são enviados por email automaticamente</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">4.3 Cancelamentos</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Cancelamento pelo participante: sem reembolso (política padrão)</li>
              <li>Cancelamento pelo organizador: reembolso integral</li>
              <li>Eventos adiados: inscrição transferida para nova data</li>
              <li>Casos excepcionais serão analisados individualmente</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Responsabilidades dos Organizadores</h2>
            <p className="mb-4">
              Organizadores de eventos devem:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Fornecer informações completas e precisas sobre o evento</li>
              <li>Possuir alvará e autorizações necessárias</li>
              <li>Garantir segurança e estrutura adequada</li>
              <li>Cumprir com regulamentações esportivas aplicáveis</li>
              <li>Processar reembolsos quando aplicável</li>
              <li>Publicar resultados em tempo hábil</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Uso Aceitável</h2>
            <p className="mb-4">
              É proibido:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Usar a plataforma para fins ilegais ou fraudulentos</li>
              <li>Criar múltiplas contas para burlar limitações</li>
              <li>Revender inscrições sem autorização</li>
              <li>Interferir no funcionamento da plataforma</li>
              <li>Copiar, modificar ou distribuir nosso conteúdo sem permissão</li>
              <li>Usar bots, scripts ou automações não autorizadas</li>
              <li>Assediar, ameaçar ou difamar outros usuários</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Propriedade Intelectual</h2>
            <p className="mb-4">
              Todo o conteúdo da plataforma (textos, gráficos, logos, ícones, imagens, software)
              é propriedade da Ticket Sports ou de seus licenciadores e está protegido por
              leis de propriedade intelectual.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Limitação de Responsabilidade</h2>

            <h3 className="text-xl font-semibold mb-3 mt-4">8.1 Eventos</h3>
            <p className="mb-4">
              A Ticket Sports atua apenas como intermediária entre organizadores e participantes.
              Não somos responsáveis por:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Qualidade, segurança ou execução dos eventos</li>
              <li>Lesões ou danos ocorridos durante eventos</li>
              <li>Disputas entre organizadores e participantes</li>
              <li>Condições climáticas ou casos fortuitos</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">8.2 Plataforma</h3>
            <p className="mb-4">
              Fornecemos a plataforma &quot;no estado em que se encontra&quot;. Não garantimos:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Disponibilidade ininterrupta ou livre de erros</li>
              <li>Precisão absoluta de resultados e cronometragens</li>
              <li>Compatibilidade com todos os dispositivos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Privacidade e Dados</h2>
            <p className="mb-4">
              O uso de seus dados pessoais é regido por nossa{" "}
              <Link href="/privacidade" className="text-primary hover:underline">
                Política de Privacidade
              </Link>
              , que faz parte integrante destes Termos de Uso.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Modificações nos Termos</h2>
            <p className="mb-4">
              Reservamo-nos o direito de modificar estes termos a qualquer momento.
              Alterações significativas serão notificadas via email com 30 dias de antecedência.
              O uso continuado da plataforma após modificações constitui aceitação dos novos termos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Encerramento de Conta</h2>
            <p className="mb-4">
              Podemos suspender ou encerrar sua conta se:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Você violar estes termos</li>
              <li>Houver suspeita de fraude ou uso indevido</li>
              <li>Seja solicitado por autoridades legais</li>
              <li>Você solicitar o encerramento</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Lei Aplicável e Foro</h2>
            <p className="mb-4">
              Estes termos são regidos pelas leis brasileiras. Qualquer disputa será submetida
              ao foro da comarca de [Sua Cidade], com exclusão de qualquer outro, por mais
              privilegiado que seja.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Disposições Gerais</h2>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Se qualquer disposição for considerada inválida, as demais permanecerão em vigor</li>
              <li>Nossa falha em exercer direitos não constitui renúncia</li>
              <li>Estes termos constituem o acordo completo entre as partes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14. Contato</h2>
            <p className="mb-4">
              Para questões sobre estes termos:
            </p>
            <ul className="list-none mb-4 space-y-2">
              <li><strong>Email:</strong> contato@ticketsports.com</li>
              <li><strong>Suporte:</strong> suporte@ticketsports.com</li>
              <li><strong>Telefone:</strong> (11) 1234-5678</li>
            </ul>
          </section>

          <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg mt-8">
            <h3 className="text-lg font-semibold mb-2">⚠️ Importante</h3>
            <p className="text-sm">
              Ao clicar em &quot;Aceito os Termos de Uso&quot; durante o cadastro, você declara ter lido,
              compreendido e concordado com todos os termos e condições aqui estabelecidos.
            </p>
          </div>
        </div>

        <div className="mt-12 flex gap-4">
          <Button asChild>
            <Link href="/">Voltar para o Início</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/privacidade">Ver Política de Privacidade</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/cadastro">Criar Conta</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
