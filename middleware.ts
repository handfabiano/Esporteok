import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  // Rotas públicas
  const publicRoutes = ["/", "/eventos", "/calendario", "/login", "/cadastro"]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Rotas de organizador
  const isOrganizerRoute = pathname.startsWith("/organizador")

  // Rotas de participante
  const isParticipantRoute = pathname.startsWith("/minha-conta")

  // Se não está logado e tenta acessar rota protegida
  if (!isLoggedIn && (isOrganizerRoute || isParticipantRoute)) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Se está logado e tenta acessar login/cadastro
  if (isLoggedIn && (pathname === "/login" || pathname === "/cadastro")) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
