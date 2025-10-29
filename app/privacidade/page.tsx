import { Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacidadePage() {
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
        <h1 className="text-4xl font-bold mb-8">Política de Privacidade</h1>

        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-muted-foreground mb-6">
            Última atualização: 29 de outubro de 2024
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Informações que Coletamos</h2>
            <p className="mb-4">
              A Ticket Sports coleta informações que você nos fornece diretamente ao criar uma conta,
              registrar-se em eventos ou usar nossos serviços:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Informações de cadastro (nome, email, telefone)</li>
              <li>Informações de perfil (data de nascimento, gênero, CPF)</li>
              <li>Informações de pagamento (processadas com segurança pela Stripe)</li>
              <li>Histórico de inscrições e participação em eventos</li>
              <li>Resultados e desempenho em eventos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Como Usamos Suas Informações</h2>
            <p className="mb-4">
              Usamos as informações coletadas para:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Processar suas inscrições em eventos</li>
              <li>Gerenciar pagamentos e emitir comprovantes</li>
              <li>Enviar notificações sobre seus eventos</li>
              <li>Melhorar nossos serviços e experiência do usuário</li>
              <li>Comunicar atualizações importantes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Compartilhamento de Informações</h2>
            <p className="mb-4">
              Podemos compartilhar suas informações apenas com:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Organizadores dos eventos em que você se inscreveu</li>
              <li>Processadores de pagamento (Stripe) para transações financeiras</li>
              <li>Autoridades legais quando exigido por lei</li>
            </ul>
            <p className="mb-4">
              <strong>Nunca vendemos suas informações pessoais a terceiros.</strong>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Segurança dos Dados</h2>
            <p className="mb-4">
              Implementamos medidas de segurança para proteger suas informações:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Criptografia SSL/TLS para transmissão de dados</li>
              <li>Senhas armazenadas com hash bcrypt</li>
              <li>Acesso restrito aos dados pessoais</li>
              <li>Monitoramento constante de segurança</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Seus Direitos</h2>
            <p className="mb-4">
              De acordo com a LGPD (Lei Geral de Proteção de Dados), você tem direito a:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incorretos ou desatualizados</li>
              <li>Solicitar a exclusão de seus dados</li>
              <li>Revogar consentimento para uso de dados</li>
              <li>Portabilidade de dados</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
            <p className="mb-4">
              Utilizamos cookies essenciais para:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Manter sua sessão de login ativa</li>
              <li>Lembrar suas preferências</li>
              <li>Melhorar a performance do site</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Menores de Idade</h2>
            <p className="mb-4">
              Nossos serviços são destinados a pessoas com 12 anos ou mais. Inscrições de menores
              devem ser feitas por responsáveis legais.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Alterações nesta Política</h2>
            <p className="mb-4">
              Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças
              significativas através do email cadastrado.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Contato</h2>
            <p className="mb-4">
              Para questões sobre privacidade ou exercer seus direitos, entre em contato:
            </p>
            <ul className="list-none mb-4 space-y-2">
              <li><strong>Email:</strong> privacidade@ticketsports.com</li>
              <li><strong>DPO:</strong> dpo@ticketsports.com</li>
            </ul>
          </section>

          <div className="bg-muted p-6 rounded-lg mt-8">
            <p className="text-sm text-muted-foreground">
              Esta política está em conformidade com a Lei nº 13.709/2018 (LGPD) e
              regulamentações aplicáveis de proteção de dados.
            </p>
          </div>
        </div>

        <div className="mt-12 flex gap-4">
          <Button asChild>
            <Link href="/">Voltar para o Início</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/cadastro">Criar Conta</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
