"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { HeaderClient } from "@/components/header-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function ConfiguracoesPage() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      cpf: formData.get("cpf"),
    }

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Erro ao atualizar perfil")
      }

      // Atualizar sessão
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.name,
        },
      })

      toast({
        title: "Sucesso!",
        description: "Perfil atualizado com sucesso",
      })

      router.push("/minha-conta")
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

  async function onChangePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const currentPassword = formData.get("currentPassword")
    const newPassword = formData.get("newPassword")
    const confirmPassword = formData.get("confirmPassword")

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Erro ao alterar senha")
      }

      toast({
        title: "Sucesso!",
        description: "Senha alterada com sucesso",
      })

      // Limpar form
      event.currentTarget.reset()
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

  if (!session?.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <HeaderClient />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/minha-conta">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Configurações</h1>
            <p className="text-muted-foreground">
              Gerencie suas informações pessoais e preferências
            </p>
          </div>

          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Atualize seus dados cadastrais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={session.user.name || ""}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={session.user.email || ""}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    O email não pode ser alterado
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      name="cpf"
                      placeholder="000.000.000-00"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Alterar Senha */}
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>
                Mantenha sua conta segura com uma senha forte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    minLength={6}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    minLength={6}
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" variant="outline" disabled={isLoading}>
                  {isLoading ? "Alterando..." : "Alterar Senha"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
