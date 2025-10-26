import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, DollarSign, TrendingUp } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function AdminDashboard() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  // Buscar estatísticas
  const [
    totalUsers,
    totalEvents,
    totalRegistrations,
    totalRevenue,
    recentUsers,
    recentEvents,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.registration.count(),
    prisma.payment.aggregate({
      where: { status: "APPROVED" },
      _sum: { amount: true },
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.event.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        startDate: true,
        currentParticipants: true,
      },
    }),
  ])

  const stats = [
    {
      title: "Total de Usuários",
      value: totalUsers.toLocaleString(),
      icon: Users,
      href: "/admin/usuarios",
      description: "Usuários cadastrados",
    },
    {
      title: "Total de Eventos",
      value: totalEvents.toLocaleString(),
      icon: Calendar,
      href: "/admin/eventos",
      description: "Eventos criados",
    },
    {
      title: "Inscrições",
      value: totalRegistrations.toLocaleString(),
      icon: TrendingUp,
      href: "/admin/inscricoes",
      description: "Total de inscrições",
    },
    {
      title: "Receita Total",
      value: `R$ ${(totalRevenue._sum.amount || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      href: "/admin/financeiro",
      description: "Pagamentos aprovados",
    },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
          <p className="text-muted-foreground">
            Visão geral e gerenciamento da plataforma
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Usuários Recentes */}
          <Card>
            <CardHeader>
              <CardTitle>Usuários Recentes</CardTitle>
              <CardDescription>Últimos 5 usuários cadastrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                        {user.role}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/admin/usuarios"
                className="block text-center text-sm text-primary mt-4 hover:underline"
              >
                Ver todos os usuários →
              </Link>
            </CardContent>
          </Card>

          {/* Eventos Recentes */}
          <Card>
            <CardHeader>
              <CardTitle>Eventos Recentes</CardTitle>
              <CardDescription>Últimos 5 eventos criados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.startDate).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs px-2 py-1 rounded bg-muted">
                        {event.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        {event.currentParticipants} inscritos
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/admin/eventos"
                className="block text-center text-sm text-primary mt-4 hover:underline"
              >
                Ver todos os eventos →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
