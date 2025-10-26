import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateProfileSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").optional(),
  phone: z.string().optional(),
  cpf: z.string().optional(),
})

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Não autenticado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = updateProfileSchema.parse(body)

    // Verificar se CPF já está em uso por outro usuário
    if (validatedData.cpf) {
      const existingUser = await prisma.user.findFirst({
        where: {
          cpf: validatedData.cpf,
          NOT: { id: session.user.id },
        },
      })

      if (existingUser) {
        return NextResponse.json(
          { success: false, error: "CPF já cadastrado" },
          { status: 400 }
        )
      }
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: validatedData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        cpf: true,
        role: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: user,
      message: "Perfil atualizado com sucesso",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Dados inválidos", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error updating profile:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao atualizar perfil" },
      { status: 500 }
    )
  }
}
