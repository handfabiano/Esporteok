import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { z } from "zod"

const setupAdminSchema = z.object({
  setupKey: z.string().optional(),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
})

/**
 * API Route para criar o usuário admin inicial
 *
 * Esta rota só deve ser usada para setup inicial e deve ser protegida em produção
 *
 * Exemplo de uso:
 * POST /api/setup/admin
 * Body: {
 *   "setupKey": "sua-chave-secreta",
 *   "email": "admin@ticketsports.com",
 *   "password": "SuaSenhaForte123",
 *   "name": "Administrador"
 * }
 *
 * Configure a variável ADMIN_SETUP_KEY no .env para proteger esta rota
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar dados de entrada
    const validatedData = setupAdminSchema.parse(body)

    // Verificar chave de setup (obrigatória em produção)
    const ADMIN_SETUP_KEY = process.env.ADMIN_SETUP_KEY
    if (ADMIN_SETUP_KEY && validatedData.setupKey !== ADMIN_SETUP_KEY) {
      return NextResponse.json(
        { success: false, error: "Chave de setup inválida" },
        { status: 401 }
      )
    }

    // Em produção, exigir chave de setup
    if (process.env.NODE_ENV === "production" && !ADMIN_SETUP_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "ADMIN_SETUP_KEY não configurada. Configure esta variável de ambiente para proteger este endpoint."
        },
        { status: 500 }
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
      where: { email: validatedData.email },
    })

    if (existingUser) {
      // Atualizar role para ADMIN se o usuário já existe
      const updatedUser = await prisma.user.update({
        where: { email: validatedData.email },
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

    // Criar novo usuário admin com senha fornecida
    const hashedPassword = await hash(validatedData.password, 10)

    const admin = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
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
      warning: "IMPORTANTE: Guarde suas credenciais em local seguro!",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Dados inválidos", details: error.errors },
        { status: 400 }
      )
    }

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
