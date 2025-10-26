"use client"

import { useState, useEffect } from "react"
import { HeaderClient } from "@/components/header-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Search, Edit, Trash2, UserPlus, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  name: string | null
  email: string
  role: string
  phone: string | null
  cpf: string | null
  createdAt: string
  _count?: {
    registrations: number
  }
}

export default function AdminUsuariosPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.cpf?.includes(searchTerm)
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  async function fetchUsers() {
    try {
      const response = await fetch("/api/admin/users")
      const data = await response.json()

      if (data.success) {
        setUsers(data.data)
        setFilteredUsers(data.data)
      } else {
        toast({
          title: "Erro",
          description: data.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleUpdateUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!editingUser) return

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name"),
      role: formData.get("role"),
      phone: formData.get("phone"),
      cpf: formData.get("cpf"),
    }

    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Erro ao atualizar usuário")
      }

      toast({
        title: "Sucesso!",
        description: "Usuário atualizado com sucesso",
      })

      setEditingUser(null)
      fetchUsers()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  async function handleDeleteUser() {
    if (!deletingUser) return

    try {
      const response = await fetch(`/api/admin/users/${deletingUser.id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Erro ao excluir usuário")
      }

      toast({
        title: "Sucesso!",
        description: "Usuário excluído com sucesso",
      })

      setDeletingUser(null)
      fetchUsers()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "destructive"
      case "ORGANIZER":
        return "default"
      default:
        return "secondary"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Administrador"
      case "ORGANIZER":
        return "Organizador"
      default:
        return "Participante"
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <HeaderClient />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold mb-2">Gerenciamento de Usuários</h1>
            <p className="text-muted-foreground">
              Gerencie todos os usuários da plataforma
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Usuários</CardTitle>
                <CardDescription>
                  Total: {filteredUsers.length} usuário(s)
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar usuários..."
                    className="pl-8 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Carregando...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum usuário encontrado
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Inscrições</TableHead>
                      <TableHead>Cadastro</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.cpf || "-"}</TableCell>
                        <TableCell>{user.phone || "-"}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {getRoleLabel(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>{user._count?.registrations || 0}</TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingUser(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setDeletingUser(user)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <form onSubmit={handleUpdateUser}>
            <DialogHeader>
              <DialogTitle>Editar Usuário</DialogTitle>
              <DialogDescription>
                Altere as informações do usuário
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingUser?.name || ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  defaultValue={editingUser?.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email não pode ser alterado
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select name="role" defaultValue={editingUser?.role}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PARTICIPANT">Participante</SelectItem>
                    <SelectItem value="ORGANIZER">Organizador</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    defaultValue={editingUser?.phone || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    name="cpf"
                    defaultValue={editingUser?.cpf || ""}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingUser(null)}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={!!deletingUser} onOpenChange={() => setDeletingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Usuário</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o usuário <strong>{deletingUser?.name}</strong>?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingUser(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
