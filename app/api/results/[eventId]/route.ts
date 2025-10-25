import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const categoryId = searchParams.get("categoryId")

    const where: any = {
      registration: {
        eventId: params.eventId,
      },
    }

    if (categoryId) {
      where.registration.categoryId = categoryId
    }

    const results = await prisma.result.findMany({
      where,
      include: {
        registration: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                gender: true,
                birthDate: true,
              },
            },
            category: true,
          },
        },
      },
      orderBy: [
        {
          position: "asc",
        },
      ],
    })

    return NextResponse.json({
      success: true,
      data: results,
    })
  } catch (error) {
    console.error("Error fetching results:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao buscar resultados" },
      { status: 500 }
    )
  }
}
