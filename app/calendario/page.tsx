import { Calendar as CalendarIcon, MapPin, Filter } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"

// Mock de eventos - depois virá do banco
const mockEvents = [
  {
    id: "1",
    title: "Maratona de São Paulo 2025",
    slug: "maratona-sao-paulo-2025",
    type: "CORRIDA",
    city: "São Paulo",
    state: "SP",
    startDate: new Date("2025-11-15"),
  },
  {
    id: "2",
    title: "Volta da Pampulha",
    slug: "volta-pampulha-ciclismo",
    type: "CICLISMO",
    city: "Belo Horizonte",
    state: "MG",
    startDate: new Date("2025-11-22"),
  },
  {
    id: "3",
    title: "Ironman Brasil",
    slug: "ironman-brasil-floripa",
    type: "TRIATLO",
    city: "Florianópolis",
    state: "SC",
    startDate: new Date("2025-12-05"),
  },
  {
    id: "4",
    title: "Trail Run Mantiqueira",
    slug: "trail-run-mantiqueira",
    type: "TRAIL_RUNNING",
    city: "Campos do Jordão",
    state: "SP",
    startDate: new Date("2025-11-08"),
  },
  {
    id: "5",
    title: "Circuito de Natação",
    slug: "circuito-natacao-rio",
    type: "NATACAO",
    city: "Rio de Janeiro",
    state: "RJ",
    startDate: new Date("2025-11-20"),
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

const eventTypeColors: Record<string, string> = {
  CORRIDA: "bg-blue-500",
  CICLISMO: "bg-green-500",
  NATACAO: "bg-cyan-500",
  TRIATLO: "bg-purple-500",
  MTB: "bg-orange-500",
  TRAIL_RUNNING: "bg-yellow-600",
  CAMINHADA: "bg-pink-500",
  OUTROS: "bg-gray-500",
}

export default async function CalendarioPage() {
  const currentDate = new Date()
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Agrupar eventos por dia
  const eventsByDate = new Map<string, typeof mockEvents>()
  mockEvents.forEach((event) => {
    const dateKey = format(event.startDate, "yyyy-MM-dd")
    if (!eventsByDate.has(dateKey)) {
      eventsByDate.set(dateKey, [])
    }
    eventsByDate.get(dateKey)?.push(event)
  })

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendário */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Anterior</Button>
                    <Button variant="outline" size="sm">Próximo</Button>
                  </div>
                </div>
                <CardDescription>
                  Clique em um dia para ver os eventos agendados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Grid do Calendário */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Cabeçalho dos dias da semana */}
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-semibold text-muted-foreground py-2"
                    >
                      {day}
                    </div>
                  ))}

                  {/* Dias vazios no início */}
                  {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}

                  {/* Dias do mês */}
                  {days.map((day) => {
                    const dateKey = format(day, "yyyy-MM-dd")
                    const dayEvents = eventsByDate.get(dateKey) || []
                    const isToday = isSameDay(day, new Date())

                    return (
                      <div
                        key={day.toString()}
                        className={`
                          aspect-square border rounded-lg p-1 hover:bg-muted/50 transition-colors cursor-pointer
                          ${isToday ? "border-primary border-2" : ""}
                        `}
                      >
                        <div className="text-sm font-medium mb-1">
                          {format(day, "d")}
                        </div>
                        <div className="space-y-0.5">
                          {dayEvents.slice(0, 2).map((event) => (
                            <Link
                              key={event.id}
                              href={`/eventos/${event.slug}`}
                              className={`
                                block text-[10px] text-white px-1 py-0.5 rounded truncate
                                ${eventTypeColors[event.type]}
                              `}
                            >
                              {event.title}
                            </Link>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-[10px] text-muted-foreground px-1">
                              +{dayEvents.length - 2} mais
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Lista de Eventos do Mês */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Todos os Eventos do Mês</CardTitle>
                <CardDescription>{mockEvents.length} eventos encontrados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockEvents.map((event) => (
                    <Link
                      key={event.id}
                      href={`/eventos/${event.slug}`}
                      className="block border rounded-lg p-4 hover:border-primary transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">
                              {eventTypeLabels[event.type]}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {format(event.startDate, "dd/MM/yyyy")}
                            </span>
                          </div>
                          <h4 className="font-semibold mb-1">{event.title}</h4>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            {event.city}, {event.state}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Ver Detalhes
                        </Button>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Filtros e Legenda */}
          <div className="space-y-6">
            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Modalidade</label>
                  <div className="space-y-2">
                    {Object.entries(eventTypeLabels).map(([key, label]) => (
                      <label key={key} className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span className="text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legenda */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Legenda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(eventTypeLabels).map(([key, label]) => (
                  <div key={key} className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded mr-2 ${eventTypeColors[key]}`}
                    />
                    <span className="text-sm">{label}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Estatísticas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Este Mês</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-3xl font-bold text-primary">{mockEvents.length}</div>
                  <div className="text-sm text-muted-foreground">Eventos no total</div>
                </div>
                <div className="border-t pt-3">
                  <div className="text-2xl font-bold">5</div>
                  <div className="text-sm text-muted-foreground">Estados diferentes</div>
                </div>
                <div className="border-t pt-3">
                  <div className="text-2xl font-bold">52K+</div>
                  <div className="text-sm text-muted-foreground">Vagas disponíveis</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
