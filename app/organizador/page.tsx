import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, Users, DollarSign, TrendingUp, Eye } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function OrganizadorPage() {
  const session = await auth()

  if (!session || session.user.role !== "ORGANIZER") {
    redirect("/")
  }

  // Buscar estatísticas do organizador
  const events = await prisma.event.findMany({
    where: {
      organizerId: session.user.id,
    },
    include: {
      _count: {
        select: {
          registrations: true,
        },
      },
      categories: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const totalEvents = events.length
  const publishedEvents = events.filter((e) => e.status === "PUBLISHED").length
  const totalRegistrations = events.reduce((sum, event) => sum + event._count.registrations, 0)

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Painel do Organizador</h1>
            <p className="text-muted-foreground">
              Gerencie seus eventos e acompanhe as inscrições
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/organizador/eventos/novo">
              <Plus className="mr-2 h-4 w-4" />
              Criar Evento
            </Link>
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                {publishedEvents} publicados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Inscrições</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRegistrations}</div>
              <p className="text-xs text-muted-foreground">
                Em todos os eventos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 0,00</div>
              <p className="text-xs text-muted-foreground">
                Em desenvolvimento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--%</div>
              <p className="text-xs text-muted-foreground">
                Em desenvolvimento
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Eventos */}
        <Card>
          <CardHeader>
            <CardTitle>Meus Eventos</CardTitle>
            <CardDescription>
              Gerencie e acompanhe seus eventos cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum evento criado ainda</h3>
                <p className="text-muted-foreground mb-4">
                  Comece criando seu primeiro evento esportivo
                </p>
                <Button asChild>
                  <Link href="/organizador/eventos/novo">
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeiro Evento
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="border rounded-lg p-4 hover:border-primary transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              event.status === "PUBLISHED"
                                ? "bg-green-100 text-green-700"
                                : event.status === "DRAFT"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {event.status === "PUBLISHED"
                              ? "Publicado"
                              : event.status === "DRAFT"
                              ? "Rascunho"
                              : event.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {event.city}, {event.state} • {new Date(event.startDate).toLocaleDateString("pt-BR")}
                        </p>
                        <div className="flex gap-4 text-sm">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{event._count.registrations} inscritos</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{event.categories.length} categorias</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/eventos/${event.slug}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Link>
                        </Button>
                        <Button variant="default" size="sm" asChild>
                          <Link href={`/organizador/eventos/${event.id}`}>
                            Gerenciar
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
