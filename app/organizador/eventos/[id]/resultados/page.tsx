"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText, Download, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function UploadResultadosPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleUpload() {
    if (!file) {
      toast({
        title: "Erro",
        description: "Selecione um arquivo CSV",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("eventId", params.id)

      const response = await fetch("/api/results/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao fazer upload")
      }

      toast({
        title: "Resultados importados!",
        description: `${data.data.total} resultados processados com sucesso.`,
      })

      router.push(`/organizador/eventos/${params.id}`)
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  function downloadTemplate() {
    const csv = `bibNumber,position,categoryPosition,time,pace,status
001,1,1,01:23:45,04:32,COMPLETED
002,2,2,01:25:30,04:38,COMPLETED
003,3,1,01:28:15,04:47,COMPLETED`

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "template-resultados.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast({
      title: "Template baixado!",
      description: "Use este arquivo como modelo para os resultados.",
    })
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" asChild className="mb-6">
            <Link href={`/organizador/eventos/${params.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Upload de Resultados</CardTitle>
              <CardDescription>
                Importe os resultados do evento em formato CSV
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Template */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold mb-2">Formato do CSV</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      O arquivo deve conter as seguintes colunas:
                    </p>
                    <ul className="text-sm space-y-1">
                      <li><code className="bg-muted px-2 py-0.5 rounded">bibNumber</code> - Número de peito</li>
                      <li><code className="bg-muted px-2 py-0.5 rounded">position</code> - Posição geral</li>
                      <li><code className="bg-muted px-2 py-0.5 rounded">categoryPosition</code> - Posição na categoria</li>
                      <li><code className="bg-muted px-2 py-0.5 rounded">time</code> - Tempo (HH:MM:SS)</li>
                      <li><code className="bg-muted px-2 py-0.5 rounded">pace</code> - Pace (min/km)</li>
                      <li><code className="bg-muted px-2 py-0.5 rounded">status</code> - Status (COMPLETED, DNF, DNS, DSQ)</li>
                    </ul>
                  </div>
                  <Button variant="outline" size="sm" onClick={downloadTemplate}>
                    <Download className="mr-2 h-4 w-4" />
                    Baixar Template
                  </Button>
                </div>
              </div>

              {/* Upload */}
              <div className="space-y-4">
                <Label htmlFor="file">Selecione o arquivo CSV</Label>
                <div className="flex gap-4">
                  <Input
                    id="file"
                    type="file"
                    accept=".csv"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    disabled={isLoading}
                  />
                </div>
                {file && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>{file.name}</span>
                    <span>({(file.size / 1024).toFixed(2)} KB)</span>
                  </div>
                )}
              </div>

              <Button
                onClick={handleUpload}
                disabled={!file || isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  "Processando..."
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Importar Resultados
                  </>
                )}
              </Button>

              <div className="text-xs text-muted-foreground text-center">
                Os resultados serão associados aos participantes pelo número de peito (BIB)
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
