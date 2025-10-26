import Link from "next/link"
import { Trophy, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/user-menu"
import { MobileMenu } from "@/components/mobile-menu"
import { auth } from "@/auth"

export async function Header() {
  const session = await auth()

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Ticket Sports</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/eventos" className="text-sm font-medium hover:text-primary">
              Eventos
            </Link>
            <Link href="/calendario" className="text-sm font-medium hover:text-primary">
              Calendário
            </Link>
            {session?.user?.role === "ORGANIZER" && (
              <Link href="/organizador" className="text-sm font-medium hover:text-primary">
                Painel Organizador
              </Link>
            )}
            {!session ? (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/cadastro">Cadastrar</Link>
                </Button>
              </>
            ) : (
              <UserMenu user={session.user} />
            )}
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <MobileMenu session={session} />
          </div>
        </div>
      </div>
    </header>
  )
}
