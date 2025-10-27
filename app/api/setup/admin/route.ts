import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

/**
 * API Route para criar o usuário admin inicial
 *
 * Esta rota só deve ser usada para setup inicial e deve ser protegida em produção
 *
 * Exemplo de uso:
 * POST /api/setup/admin
 * Body: { "setupKey": "sua-chave-secreta" }
 *
 * Configure a variável ADMIN_SETUP_KEY no .env para proteger esta rota
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { setupKey } = body

    // Verificar chave de setup (se configurada)
    const ADMIN_SETUP_KEY = process.env.ADMIN_SETUP_KEY
    if (ADMIN_SETUP_KEY && setupKey !== ADMIN_SETUP_KEY) {
      return NextResponse.json(
        { success: false, error: "Chave de setup inválida" },
        { status: 401 }
      )
    }

    // Verificar se já existe um admin
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    })

    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: "Usuário admin já existe",
        admin: {
          email: existingAdmin.email,
          name: existingAdmin.name,
        },
      })
    }

    // Verificar se o email específico já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: "admin@ticketsports.com" },
    })

    if (existingUser) {
      // Atualizar role para ADMIN se o usuário já existe
      const updatedUser = await prisma.user.update({
        where: { email: "admin@ticketsports.com" },
        data: { role: "ADMIN" },
      })

      return NextResponse.json({
        success: true,
        message: "Usuário existente promovido para admin",
        admin: {
          email: updatedUser.email,
          name: updatedUser.name,
        },
      })
    }

    // Criar novo usuário admin
    const hashedPassword = await hash("admin123", 10)

    const admin = await prisma.user.create({
      data: {
        name: "Administrador",
        email: "admin@ticketsports.com",
        password: hashedPassword,
        role: "ADMIN",
      },
    })

    return NextResponse.json({
      success: true,
      message: "Usuário admin criado com sucesso",
      admin: {
        email: admin.email,
        name: admin.name,
      },
      credentials: {
        email: "admin@ticketsports.com",
        password: "admin123",
        warning: "IMPORTANTE: Altere a senha após o primeiro login!",
      },
    })
  } catch (error) {
    console.error("Error creating admin:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao criar usuário admin",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

// Endpoint GET para verificar se já existe admin
export async function GET() {
  try {
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" },
    })

    const hasAdmin = adminCount > 0

    return NextResponse.json({
      success: true,
      hasAdmin,
      adminCount,
      message: hasAdmin
        ? "Sistema já possui usuário(s) admin"
        : "Nenhum admin encontrado. Use POST /api/setup/admin para criar.",
    })
  } catch (error) {
    console.error("Error checking admin:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao verificar admin",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
