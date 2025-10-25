import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const registration = await prisma.registration.findUnique({
      where: { id: params.id },
      include: {
        event: true,
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
