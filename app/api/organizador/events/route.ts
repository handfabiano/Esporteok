import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ORGANIZER") {
      return NextResponse.json(
        {
          success: false,
          error: "Não autorizado. Apenas organizadores podem criar eventos.",
        },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { categories, ...eventData } = body

    // Gerar slug a partir do título
    const slug = eventData.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Criar evento com categorias
    const event = await prisma.event.create({
      data: {
        ...eventData,
        slug,
        organizerId: session.user.id,
        startDate: new Date(eventData.startDate),
        endDate: eventData.endDate ? new Date(eventData.endDate) : null,
        registrationStartDate: new Date(eventData.registrationStartDate),
        registrationEndDate: new Date(eventData.registrationEndDate),
        categories: {
          create: categories.map((cat: any) => ({
            name: cat.name,
            description: cat.description,
            price: cat.price,
            maxSlots: cat.maxSlots,
            availableSlots: cat.maxSlots || 0,
          })),
        },
      },
      include: {
        categories: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: event,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao criar evento",
      },
      { status: 500 }
    )
  }
}
