import { Calendar, MapPin, Users } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

// Dados mockados - depois substituiremos por dados do banco
const mockEvents = [
  {
    id: "1",
    title: "Maratona de São Paulo 2025",
    slug: "maratona-sao-paulo-2025",
    description: "A maior corrida de rua da América Latina está de volta!",
    type: "CORRIDA",
    status: "PUBLISHED",
    city: "São Paulo",
    state: "SP",
    startDate: new Date("2025-11-15"),
    registrationEndDate: new Date("2025-11-01"),
    maxParticipants: 30000,
    currentParticipants: 15420,
    coverImage: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&q=80",
  },
  {
    id: "2",
    title: "Volta da Pampulha - Ciclismo",
    slug: "volta-pampulha-ciclismo",
    description: "Tradicional prova de ciclismo ao redor da Lagoa da Pampulha",
    type: "CICLISMO",
    status: "PUBLISHED",
    city: "Belo Horizonte",
    state: "MG",
    startDate: new Date("2025-11-22"),
    registrationEndDate: new Date("2025-11-15"),
    maxParticipants: 5000,
    currentParticipants: 3250,
    coverImage: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&q=80",
  },
  {
    id: "3",
    title: "Ironman Brasil - Florianópolis",
    slug: "ironman-brasil-floripa",
    description: "O triathlon mais desafiador do Brasil",
    type: "TRIATLO",
    status: "PUBLISHED",
    city: "Florianópolis",
    state: "SC",
    startDate: new Date("2025-12-05"),
    registrationEndDate: new Date("2025-10-30"),
    maxParticipants: 2000,
    currentParticipants: 1850,
    coverImage: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80",
  },
  {
    id: "4",
    title: "Trail Run Serra da Mantiqueira",
    slug: "trail-run-mantiqueira",
    description: "Corrida de montanha com paisagens incríveis",
    type: "TRAIL_RUNNING",
    status: "PUBLISHED",
    city: "Campos do Jordão",
    state: "SP",
    startDate: new Date("2025-11-08"),
    registrationEndDate: new Date("2025-10-25"),
    maxParticipants: 1000,
    currentParticipants: 650,
    coverImage: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
  },
]

const eventTypeLabels: Record<string, string> = {
  CORRIDA: "Corrida",
  CICLISMO: "Ciclismo",
  NATACAO: "Natação",
  TRIATLO: "Triathlon",
  MTB: "MTB",
  TRAIL_RUNNING: "Trail Run",
  CAMINHADA: "Caminhada",
  OUTROS: "Outros",
}

export default function EventosPage() {
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
              <Link href="/eventos" className="text-sm font-medium text-primary">
                Eventos
              </Link>
              <Link href="/calendario" className="text-sm font-medium hover:text-primary">
                Calendário
              </Link>
              <Link href="/organizador" className="text-sm font-medium hover:text-primary">
                Sou Organizador
              </Link>
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/cadastro">Cadastrar</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Filtros */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <h2 className="text-3xl font-bold mb-4">Eventos Esportivos</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="default" size="sm">Todos</Button>
            <Button variant="outline" size="sm">Corrida</Button>
            <Button variant="outline" size="sm">Ciclismo</Button>
            <Button variant="outline" size="sm">Triathlon</Button>
            <Button variant="outline" size="sm">Trail Run</Button>
            <Button variant="outline" size="sm">MTB</Button>
          </div>
        </div>
      </section>

      {/* Grid de Eventos */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function EventCard({ event }: { event: typeof mockEvents[0] }) {
  const occupancyPercentage = event.maxParticipants
    ? Math.round((event.currentParticipants / event.maxParticipants) * 100)
    : 0

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative overflow-hidden bg-muted">
        {event.coverImage && (
          <img
            src={event.coverImage}
            alt={event.title}
            className="object-cover w-full h-full"
          />
        )}
        <div className="absolute top-2 right-2">
          <Badge>{eventTypeLabels[event.type]}</Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2">{event.title}</CardTitle>
        <CardDescription className="line-clamp-2">{event.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2" />
          {format(event.startDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2" />
          {event.city}, {event.state}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-2" />
          {event.currentParticipants.toLocaleString('pt-BR')} inscritos
          {event.maxParticipants && ` de ${event.maxParticipants.toLocaleString('pt-BR')}`}
        </div>
        {occupancyPercentage > 0 && (
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Ocupação</span>
              <span>{occupancyPercentage}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/eventos/${event.slug}`}>Ver Detalhes</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
