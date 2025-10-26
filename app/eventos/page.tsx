import { Calendar, MapPin, Users } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
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

export default async function EventosPage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Eventos Esportivos</h1>
          <p className="text-xl text-muted-foreground">
            Encontre e participe dos melhores eventos de corrida, ciclismo, triatlo e muito mais.
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    className="object-cover w-full h-full"
                  />
                  <Badge className="absolute top-4 right-4">
                    {eventTypeLabels[event.type]}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                    {event.currentParticipants.toLocaleString()} / {event.maxParticipants.toLocaleString()} inscritos
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/eventos/${event.slug}`}>
                      Ver Detalhes
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
