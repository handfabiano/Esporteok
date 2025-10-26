import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  // Rotas públicas
  const publicRoutes = ["/", "/eventos", "/calendario", "/login", "/cadastro", "/health"]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Rotas de admin - requer role ADMIN
  const isAdminRoute = pathname.startsWith("/admin")

  // Rotas de organizador
  const isOrganizerRoute = pathname.startsWith("/organizador")

  // Rotas de participante
  const isParticipantRoute = pathname.startsWith("/minha-conta")

  // Proteção de rotas admin
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login?callbackUrl=" + pathname, req.url))
    }
    if (req.auth?.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  // Proteção de rotas organizador
  if (isOrganizerRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login?callbackUrl=" + pathname, req.url))
  }

  // Proteção de rotas participante
  if (isParticipantRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login?callbackUrl=" + pathname, req.url))
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
