import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function ResultadosPage({ params }: { params: { slug: string } }) {
  const event = await prisma.event.findUnique({
    where: { slug: params.slug },
    include: {
      categories: {
        include: {
          registrations: {
            include: {
              result: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  gender: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!event) {
    notFound()
  }

  // Resultados gerais (todas as categorias)
  const allResults = event.categories.flatMap((cat) =>
    cat.registrations
      .filter((reg) => reg.result)
      .map((reg) => ({
        ...reg.result,
        user: reg.user,
        category: cat,
        registration: reg,
      }))
  )

  const sortedResults = allResults.sort((a, b) => {
    if (!a.position) return 1
    if (!b.position) return -1
    return a.position - b.position
  })

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
          <p className="text-muted-foreground">Resultados Oficiais</p>
        </div>

        {/* Pódio */}
        {sortedResults.length >= 3 && (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* 2º Lugar */}
            <div className="md:order-1 md:mt-8">
              <Card className="border-2 border-gray-400">
                <CardHeader className="text-center pb-4">
                  <Medal className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <CardTitle className="text-xl">2º Lugar</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-2">
                    <p className="font-semibold">{sortedResults[1].user?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {sortedResults[1].category?.name}
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {sortedResults[1].time}
                  </div>
                  {sortedResults[1].pace && (
                    <div className="text-sm text-muted-foreground">
                      Pace: {sortedResults[1].pace}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* 1º Lugar */}
            <div className="md:order-2">
              <Card className="border-2 border-yellow-400 shadow-lg">
                <CardHeader className="text-center pb-4">
                  <Trophy className="h-16 w-16 mx-auto mb-2 text-yellow-500" />
                  <CardTitle className="text-2xl">1º Lugar</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-2">
                    <p className="font-semibold text-lg">{sortedResults[0].user?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {sortedResults[0].category?.name}
                    </p>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {sortedResults[0].time}
                  </div>
                  {sortedResults[0].pace && (
                    <div className="text-sm text-muted-foreground">
                      Pace: {sortedResults[0].pace}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* 3º Lugar */}
            <div className="md:order-3 md:mt-8">
              <Card className="border-2 border-amber-600">
                <CardHeader className="text-center pb-4">
                  <Award className="h-12 w-12 mx-auto mb-2 text-amber-600" />
                  <CardTitle className="text-xl">3º Lugar</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-2">
                    <p className="font-semibold">{sortedResults[2].user?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {sortedResults[2].category?.name}
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {sortedResults[2].time}
                  </div>
                  {sortedResults[2].pace && (
                    <div className="text-sm text-muted-foreground">
                      Pace: {sortedResults[2].pace}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Tabela de Resultados por Categoria */}
        <div className="space-y-8">
          {event.categories.map((category) => {
            const categoryResults = category.registrations
              .filter((reg) => reg.result)
              .sort((a, b) => {
                if (!a.result?.categoryPosition) return 1
                if (!b.result?.categoryPosition) return -1
                return a.result.categoryPosition - b.result.categoryPosition
              })

            if (categoryResults.length === 0) return null

            return (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>
                    {categoryResults.length} participantes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 font-medium">Pos</th>
                          <th className="text-left p-2 font-medium">Atleta</th>
                          <th className="text-left p-2 font-medium">Tempo</th>
                          <th className="text-left p-2 font-medium">Pace</th>
                          <th className="text-left p-2 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoryResults.map((reg, index) => (
                          <tr key={reg.id} className="border-b hover:bg-muted/50">
                            <td className="p-2">
                              {reg.result?.categoryPosition || index + 1}
                            </td>
                            <td className="p-2 font-medium">{reg.user.name}</td>
                            <td className="p-2">{reg.result?.time || "-"}</td>
                            <td className="p-2 text-muted-foreground">
                              {reg.result?.pace || "-"}
                            </td>
                            <td className="p-2">
                              <Badge variant={reg.result?.status === "COMPLETED" ? "default" : "secondary"}>
                                {reg.result?.status || "COMPLETED"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {sortedResults.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Os resultados ainda não foram publicados
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
