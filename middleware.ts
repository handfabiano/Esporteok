import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Middleware desabilitado para facilitar testes
// Todas as rotas são públicas e acessíveis sem autenticação
export function middleware(req: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
