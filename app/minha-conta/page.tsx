import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Mail, Phone, MapPin, Trophy } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function MinhaContaPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  // Buscar dados completos do usuário
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      registrations: {
        include: {
          event: true,
          category: true,
          payment: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })

  if (!user) {
    redirect("/login")
  }

  const upcomingEvents = user.registrations.filter(
    (reg) => new Date(reg.event.startDate) > new Date() && reg.status === "CONFIRMED"
  )

  const pastEvents = user.registrations.filter(
    (reg) => new Date(reg.event.startDate) <= new Date()
  )

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar - Perfil */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col items-center text-center">
                  <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                  <CardTitle>{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                  <Badge className="mt-2">
                    {user.role === "ORGANIZER" ? "Organizador" : "Participante"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.phone && (
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.cpf && (
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>CPF: {user.cpf}</span>
                  </div>
                )}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/minha-conta/configuracoes">Editar Perfil</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Estatísticas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Minhas Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Eventos futuros</span>
                    <span className="font-bold text-lg">{upcomingEvents.length}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Eventos concluídos</span>
                    <span className="font-bold text-lg">{pastEvents.length}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Total de inscrições</span>
                    <span className="font-bold text-lg">{user.registrations.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Próximos Eventos */}
            <Card>
              <CardHeader>
                <CardTitle>Próximos Eventos</CardTitle>
                <CardDescription>
                  Eventos que você está inscrito
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-4">
                      Você não está inscrito em nenhum evento futuro
                    </p>
                    <Button asChild>
                      <Link href="/eventos">Explorar Eventos</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingEvents.map((registration) => (
                      <div
                        key={registration.id}
                        className="border rounded-lg p-4 hover:border-primary transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{registration.event.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {registration.category.name}
                            </p>
                            <div className="flex flex-wrap gap-3 text-sm">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                {new Date(registration.event.startDate).toLocaleDateString("pt-BR")}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                                {registration.event.city}, {registration.event.state}
                              </div>
                            </div>
                            {registration.bibNumber && (
                              <div className="mt-2">
                                <Badge variant="secondary">
                                  Número: {registration.bibNumber}
                                </Badge>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <Badge
                              variant={
                                registration.payment?.status === "APPROVED"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {registration.payment?.status === "APPROVED"
                                ? "Pago"
                                : "Pendente"}
                            </Badge>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/eventos/${registration.event.slug}`}>
                                Ver Evento
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

            {/* Eventos Passados */}
            {pastEvents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Eventos Concluídos</CardTitle>
                  <CardDescription>
                    Seu histórico de participações
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pastEvents.slice(0, 5).map((registration) => (
                      <div
                        key={registration.id}
                        className="border rounded-lg p-3 opacity-75"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-sm">{registration.event.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {new Date(registration.event.startDate).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                          <Trophy className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                  {pastEvents.length > 5 && (
                    <Button variant="ghost" className="w-full mt-4" asChild>
                      <Link href="/minha-conta/inscricoes">
                        Ver todos ({pastEvents.length})
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
