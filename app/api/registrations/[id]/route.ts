import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Autenticação necessária" },
        { status: 401 }
      )
    }

    const registration = await prisma.registration.findUnique({
      where: { id: params.id },
      include: {
        event: {
          include: {
            organizer: {
              select: {
                id: true,
              },
            },
          },
        },
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payment: true,
      },
    })

    if (!registration) {
      return NextResponse.json(
        { success: false, error: "Inscrição não encontrada" },
        { status: 404 }
      )
    }

    // Verificar se o usuário tem permissão para ver esta inscrição
    // Pode ver: o próprio usuário, o organizador do evento ou admin
    const isOwner = registration.userId === session.user.id
    const isOrganizer = registration.event.organizer.id === session.user.id
    const isAdmin = session.user.role === "ADMIN"

    if (!isOwner && !isOrganizer && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Você não tem permissão para acessar esta inscrição" },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: registration,
    })
  } catch (error) {
    console.error("Error fetching registration:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao buscar inscrição" },
      { status: 500 }
    )
  }
}
