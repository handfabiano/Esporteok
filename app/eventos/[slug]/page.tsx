import { Calendar, MapPin, Clock, Users, Share2, Heart, Info } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

// Mock de dados - depois virá do banco
const mockEventData: Record<string, any> = {
  "maratona-sao-paulo-2025": {
    id: "1",
    title: "Maratona de São Paulo 2025",
    slug: "maratona-sao-paulo-2025",
    description: "A maior corrida de rua da América Latina está de volta! Participe da Maratona de São Paulo 2025 e faça parte desta experiência única.",
    type: "CORRIDA",
    status: "PUBLISHED",
    city: "São Paulo",
    state: "SP",
    address: "Parque do Ibirapuera",
    venue: "Parque do Ibirapuera",
    startDate: new Date("2025-11-15T07:00:00"),
    endDate: new Date("2025-11-15T14:00:00"),
    registrationStartDate: new Date("2025-08-01"),
    registrationEndDate: new Date("2025-11-01"),
    maxParticipants: 30000,
    currentParticipants: 15420,
    coverImage: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&q=80",
    categories: [
      {
        id: "1",
        name: "42K - Maratona",
        description: "Percurso completo de 42,195 km",
        price: 180.00,
        maxSlots: 10000,
        availableSlots: 4580,
      },
      {
        id: "2",
        name: "21K - Meia Maratona",
        description: "Percurso de 21 km",
        price: 120.00,
        maxSlots: 15000,
        availableSlots: 8420,
      },
      {
        id: "3",
        name: "5K - Corrida Popular",
        description: "Percurso de 5 km para todos os níveis",
        price: 60.00,
        maxSlots: 5000,
        availableSlots: 2420,
      },
    ],
    rules: `
## Regulamento

### Categorias e Idades
- 42K: Idade mínima 18 anos
- 21K: Idade mínima 16 anos
- 5K: Idade mínima 12 anos

### Kit do Atleta
O kit do atleta contém:
- Camiseta oficial do evento
- Número de peito (BIB)
- Chip de cronometragem
- Sacola do atleta

### Percurso
- Largada e chegada no Parque do Ibirapuera
- Percursos certificados e homologados
- Pontos de hidratação a cada 2,5km

### Premiação
- Troféus para os 3 primeiros colocados de cada categoria
- Medalhas para todos os participantes que completarem a prova
`,
  },
}

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

export default function EventoDetalhe({ params }: { params: { slug: string } }) {
  const event = mockEventData[params.slug]

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Evento não encontrado</h1>
          <Button asChild>
            <Link href="/eventos">Voltar para eventos</Link>
          </Button>
        </div>
      </div>
    )
  }

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

      {/* Cover Image */}
      <div className="relative h-[300px] md:h-[400px] overflow-hidden bg-muted">
        {event.coverImage && (
          <img
            src={event.coverImage}
            alt={event.title}
            className="object-cover w-full h-full"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container mx-auto">
            <Badge className="mb-3">{eventTypeLabels[event.type]}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{event.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {format(event.startDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {event.city}, {event.state}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Sobre o Evento */}
            <Card>
              <CardHeader>
                <CardTitle>Sobre o Evento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">{event.description}</p>
              </CardContent>
            </Card>

            {/* Categorias */}
            <Card>
              <CardHeader>
                <CardTitle>Categorias Disponíveis</CardTitle>
                <CardDescription>Escolha a categoria ideal para você</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.categories.map((category: any) => (
                  <div
                    key={category.id}
                    className="border rounded-lg p-4 hover:border-primary transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">{category.name}</h4>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          R$ {category.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-muted-foreground">
                        {category.availableSlots} vagas disponíveis
                      </span>
                      <Button size="sm">Inscrever-se</Button>
                    </div>
                    <div className="mt-2">
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${
                              ((category.maxSlots - category.availableSlots) / category.maxSlots) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Regulamento */}
            {event.rules && (
              <Card>
                <CardHeader>
                  <CardTitle>Regulamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: event.rules.replace(/\n/g, '<br />') }} />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informações Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Data do Evento</div>
                    <div className="text-sm text-muted-foreground">
                      {format(event.startDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Inscrições até</div>
                    <div className="text-sm text-muted-foreground">
                      {format(event.registrationEndDate, "dd/MM/yyyy", { locale: ptBR })}
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Local</div>
                    <div className="text-sm text-muted-foreground">
                      {event.venue}
                      <br />
                      {event.city}, {event.state}
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Participantes</div>
                    <div className="text-sm text-muted-foreground">
                      {event.currentParticipants.toLocaleString('pt-BR')} inscritos
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ações */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button className="w-full" size="lg">
                  Inscrever-se Agora
                </Button>
                <Button variant="outline" className="w-full">
                  <Heart className="h-4 w-4 mr-2" />
                  Salvar Evento
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
              </CardContent>
            </Card>

            {/* Organizador */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Organizador</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Maratona SP Eventos</div>
                    <div className="text-sm text-muted-foreground">Organizador Verificado</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" size="sm">
                  Ver Perfil
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
