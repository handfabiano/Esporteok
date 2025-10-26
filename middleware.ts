import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  // Temporariamente simplificado - permite acesso a todas as rotas
  // TODO: Reimplementar autenticação quando NextAuth estiver estável
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
