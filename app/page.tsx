import { Calendar, Trophy, Users, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Ticket Sports</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/eventos" className="text-sm font-medium hover:text-primary">
                Eventos
              </Link>
              <Link href="/calendario" className="text-sm font-medium hover:text-primary">
                Calendário
              </Link>
              <Link href="/organizador" className="text-sm font-medium hover:text-primary">
                Sou Organizador
              </Link>
              <Link href="/login" className="text-sm font-medium hover:text-primary">
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
              >
                Cadastrar
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            O Maior Marketplace de<br />Eventos Esportivos do Brasil
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Encontre e participe dos melhores eventos de corrida, ciclismo, triatlo e muito mais.
            Organize seus eventos com as melhores ferramentas do mercado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/eventos"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-medium hover:bg-primary/90 text-lg"
            >
              Explorar Eventos
            </Link>
            <Link
              href="/organizador/eventos/novo"
              className="border-2 border-primary text-primary px-8 py-3 rounded-md font-medium hover:bg-primary/10 text-lg"
            >
              Criar Evento
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Por que escolher o Ticket Sports?</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Calendar className="h-10 w-10 text-primary" />}
              title="Calendário Completo"
              description="Acesse milhares de eventos em todo o Brasil, filtrados por modalidade, data e localização."
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-primary" />}
              title="Inscrição Rápida"
              description="Inscreva-se em segundos com nosso processo simplificado e seguro de pagamento."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-primary" />}
              title="Gestão Completa"
              description="Organizadores têm acesso a ferramentas profissionais de gestão e analytics."
            />
            <FeatureCard
              icon={<Trophy className="h-10 w-10 text-primary" />}
              title="Resultados Online"
              description="Acompanhe seus resultados e performance em todos os eventos participados."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para começar?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de atletas e organizadores que confiam no Ticket Sports
          </p>
          <Link
            href="/cadastro"
            className="bg-white text-primary px-8 py-3 rounded-md font-medium hover:bg-gray-100 text-lg inline-block"
          >
            Criar Conta Gratuita
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Trophy className="h-6 w-6 text-primary" />
                <span className="font-bold">Ticket Sports</span>
              </div>
              <p className="text-sm text-muted-foreground">
                A plataforma completa para eventos esportivos no Brasil.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Participantes</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/eventos">Eventos</Link></li>
                <li><Link href="/calendario">Calendário</Link></li>
                <li><Link href="/resultados">Resultados</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Organizadores</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/organizador">Criar Evento</Link></li>
                <li><Link href="/funcionalidades">Funcionalidades</Link></li>
                <li><Link href="/precos">Preços</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/ajuda">Central de Ajuda</Link></li>
                <li><Link href="/contato">Contato</Link></li>
                <li><Link href="/sobre">Sobre</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Ticket Sports. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
