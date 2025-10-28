import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
  role: z.enum(["PARTICIPANT", "ORGANIZER"]).default("PARTICIPANT"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validatedData = registerSchema.parse(body)

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Não foi possível completar o cadastro. Verifique os dados e tente novamente.",
        },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await hash(validatedData.password, 10)

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: user,
        message: "Usuário criado com sucesso",
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Dados inválidos",
          details: error.errors,
        },
        { status: 400 }
      )
    }

    console.error("Error creating user:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao criar usuário",
      },
      { status: 500 }
    )
  }
}
