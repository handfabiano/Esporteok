"use client"

import Link from "next/link"
import { Menu, User, LogOut, Calendar, Trophy, Settings } from "lucide-react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface MobileMenuProps {
  session: any
}

export function MobileMenu({ session }: MobileMenuProps) {
  const initials = session?.user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U"

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col space-y-4">
          {/* User Info */}
          {session?.user && (
            <>
              <div className="flex items-center space-x-3 px-2 py-3 rounded-lg bg-muted">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={session.user.image || undefined} alt={session.user.name || ""} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Navigation Links */}
          <div className="flex flex-col space-y-2">
            <Link
              href="/eventos"
              className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
            >
              <Trophy className="h-4 w-4 mr-3" />
              Eventos
            </Link>
            <Link
              href="/calendario"
              className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
            >
              <Calendar className="h-4 w-4 mr-3" />
              Calendário
            </Link>

            {session?.user ? (
              <>
                <Link
                  href="/minha-conta"
                  className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                >
                  <User className="h-4 w-4 mr-3" />
                  Minha Conta
                </Link>
                <Link
                  href="/minha-conta/inscricoes"
                  className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                >
                  <Calendar className="h-4 w-4 mr-3" />
                  Minhas Inscrições
                </Link>

                {session.user.role === "ORGANIZER" && (
                  <Link
                    href="/organizador"
                    className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                  >
                    <Trophy className="h-4 w-4 mr-3" />
                    Painel Organizador
                  </Link>
                )}

                <Link
                  href="/minha-conta/configuracoes"
                  className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Configurações
                </Link>

                <Separator className="my-2" />

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors text-destructive w-full"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sair
                </button>
              </>
            ) : (
              <>
                <Separator className="my-2" />
                <Link href="/login">
                  <Button variant="outline" className="w-full justify-start">
                    Entrar
                  </Button>
                </Link>
                <Link href="/cadastro">
                  <Button className="w-full justify-start">
                    Cadastrar
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
