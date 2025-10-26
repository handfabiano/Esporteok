"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { HeaderClient } from "@/components/header-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

const eventTypes = [
  { value: "CORRIDA", label: "Corrida" },
  { value: "CICLISMO", label: "Ciclismo" },
  { value: "NATACAO", label: "Natação" },
  { value: "TRIATLO", label: "Triathlon" },
  { value: "MTB", label: "MTB" },
  { value: "TRAIL_RUNNING", label: "Trail Running" },
  { value: "CAMINHADA", label: "Caminhada" },
  { value: "OUTROS", label: "Outros" },
]

const brazilianStates = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
]

interface Category {
  name: string
  description: string
  price: string
  maxSlots: string
}

export default function NovoEventoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([
    { name: "", description: "", price: "", maxSlots: "" }
  ])

  function addCategory() {
    setCategories([...categories, { name: "", description: "", price: "", maxSlots: "" }])
  }

  function removeCategory(index: number) {
    setCategories(categories.filter((_, i) => i !== index))
  }

  function updateCategory(index: number, field: keyof Category, value: string) {
    const updated = [...categories]
    updated[index][field] = value
    setCategories(updated)
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)

    // Validar categorias
    const validCategories = categories.filter(
      (cat) => cat.name && cat.price
    )

    if (validCategories.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos uma categoria ao evento",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const eventData = {
        title: formData.get("title"),
        description: formData.get("description"),
        type: formData.get("type"),
        city: formData.get("city"),
        state: formData.get("state"),
        address: formData.get("address"),
        venue: formData.get("venue"),
        startDate: formData.get("startDate"),
        endDate: formData.get("endDate"),
        registrationStartDate: formData.get("registrationStartDate"),
        registrationEndDate: formData.get("registrationEndDate"),
        maxParticipants: formData.get("maxParticipants")
          ? parseInt(formData.get("maxParticipants") as string)
          : null,
        coverImage: formData.get("coverImage"),
        rules: formData.get("rules"),
        website: formData.get("website"),
        status: "DRAFT",
      }

      // Criar evento (implementar API)
      const response = await fetch("/api/organizador/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...eventData,
          categories: validCategories.map((cat) => ({
            name: cat.name,
            description: cat.description,
            price: parseFloat(cat.price),
            maxSlots: cat.maxSlots ? parseInt(cat.maxSlots) : null,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao criar evento")
      }

      toast({
        title: "Sucesso!",
        description: "Evento criado com sucesso",
      })

      router.push("/organizador")
      router.refresh()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o evento. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <HeaderClient />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/organizador">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Criar Novo Evento</h1>
            <p className="text-muted-foreground">
              Preencha as informações do seu evento esportivo
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>
                  Dados principais do evento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Evento *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Ex: Maratona de São Paulo 2025"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Descreva seu evento..."
                    rows={4}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Modalidade *</Label>
                    <Select name="type" required disabled={isLoading}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coverImage">URL da Imagem de Capa</Label>
                    <Input
                      id="coverImage"
                      name="coverImage"
                      type="url"
                      placeholder="https://..."
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Localização */}
            <Card>
              <CardHeader>
                <CardTitle>Localização</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Ex: São Paulo"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado *</Label>
                    <Select name="state" required disabled={isLoading}>
                      <SelectTrigger>
                        <SelectValue placeholder="UF" />
                      </SelectTrigger>
                      <SelectContent>
                        {brazilianStates.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue">Local do Evento</Label>
                  <Input
                    id="venue"
                    name="venue"
                    placeholder="Ex: Parque do Ibirapuera"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço Completo</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Rua, número, bairro"
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Datas */}
            <Card>
              <CardHeader>
                <CardTitle>Datas e Prazos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Data do Evento *</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="datetime-local"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Data de Término</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="datetime-local"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="registrationStartDate">Início das Inscrições *</Label>
                    <Input
                      id="registrationStartDate"
                      name="registrationStartDate"
                      type="datetime-local"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registrationEndDate">Fim das Inscrições *</Label>
                    <Input
                      id="registrationEndDate"
                      name="registrationEndDate"
                      type="datetime-local"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Número Máximo de Participantes</Label>
                  <Input
                    id="maxParticipants"
                    name="maxParticipants"
                    type="number"
                    min="1"
                    placeholder="Deixe em branco para ilimitado"
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Categorias */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Categorias *</CardTitle>
                    <CardDescription>
                      Configure as categorias e preços
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCategory}
                    disabled={isLoading}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {categories.map((category, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Categoria {index + 1}</span>
                      {categories.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCategory(index)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nome da Categoria *</Label>
                        <Input
                          value={category.name}
                          onChange={(e) => updateCategory(index, "name", e.target.value)}
                          placeholder="Ex: 42K - Maratona"
                          required
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Preço (R$) *</Label>
                        <Input
                          value={category.price}
                          onChange={(e) => updateCategory(index, "price", e.target.value)}
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Descrição</Label>
                        <Input
                          value={category.description}
                          onChange={(e) => updateCategory(index, "description", e.target.value)}
                          placeholder="Ex: Percurso de 42,195 km"
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Vagas Disponíveis</Label>
                        <Input
                          value={category.maxSlots}
                          onChange={(e) => updateCategory(index, "maxSlots", e.target.value)}
                          type="number"
                          min="1"
                          placeholder="Ilimitado"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Informações Adicionais */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Adicionais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rules">Regulamento</Label>
                  <Textarea
                    id="rules"
                    name="rules"
                    placeholder="Regras e regulamento do evento..."
                    rows={6}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Site do Evento</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    placeholder="https://..."
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Ações */}
            <div className="flex gap-4">
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? "Criando..." : "Criar Evento"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                asChild
                disabled={isLoading}
              >
                <Link href="/organizador">Cancelar</Link>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
