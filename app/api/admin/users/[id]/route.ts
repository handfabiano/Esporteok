import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  role: z.enum(["PARTICIPANT", "ORGANIZER", "ADMIN"]).optional(),
  phone: z.string().optional(),
  cpf: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Acesso negado" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = updateUserSchema.parse(body)

    // Verificar se CPF já está em uso
    if (validatedData.cpf) {
      const existingUser = await prisma.user.findFirst({
        where: {
          cpf: validatedData.cpf,
          NOT: { id: params.id },
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
      where: { id: params.id },
      data: validatedData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        cpf: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: user,
      message: "Usuário atualizado com sucesso",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Dados inválidos", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error updating user:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao atualizar usuário" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Acesso negado" },
        { status: 403 }
      )
    }

    // Não permitir excluir o próprio usuário
    if (session.user.id === params.id) {
      return NextResponse.json(
        { success: false, error: "Você não pode excluir sua própria conta" },
        { status: 400 }
      )
    }

    await prisma.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: "Usuário excluído com sucesso",
    })
  } catch (error: any) {
    if (error.code === "P2003") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Não é possível excluir este usuário pois ele possui dados relacionados (eventos, inscrições, etc)",
        },
        { status: 400 }
      )
    }

    console.error("Error deleting user:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao excluir usuário" },
      { status: 500 }
    )
  }
}
