import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { z } from "zod"

const updateEventSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  type: z.enum(["CORRIDA", "CICLISMO", "NATACAO", "TRIATLO", "MTB", "TRAIL_RUNNING", "CAMINHADA", "OUTROS"]).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ONGOING", "COMPLETED", "CANCELLED"]).optional(),
  city: z.string().min(2).optional(),
  state: z.string().length(2).optional(),
  address: z.string().optional(),
  venue: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  registrationStartDate: z.string().datetime().optional(),
  registrationEndDate: z.string().datetime().optional(),
  maxParticipants: z.number().int().positive().optional(),
  coverImage: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  rules: z.string().optional(),
  termsUrl: z.string().url().optional(),
  website: z.string().url().optional(),
})

// GET /api/events/[id] - Buscar evento por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: params.id,
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        categories: {
          orderBy: {
            price: "asc",
          },
        },
        registrations: {
          where: {
            status: "CONFIRMED",
          },
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    })

    if (!event) {
      return NextResponse.json(
        {
          success: false,
          error: "Event not found",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: event,
    })
  } catch (error) {
    console.error("Error fetching event:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch event",
      },
      { status: 500 }
    )
  }
}

// PUT /api/events/[id] - Atualizar evento (sem autenticação para testes)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Buscar evento
    const existingEvent = await prisma.event.findUnique({
      where: { id: params.id },
      select: { id: true, organizerId: true },
    })

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, error: "Evento não encontrado" },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = updateEventSchema.parse(body)

    const event = await prisma.event.update({
      where: { id: params.id },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        type: validatedData.type,
        status: validatedData.status,
        city: validatedData.city,
        state: validatedData.state,
        address: validatedData.address,
        venue: validatedData.venue,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : undefined,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined,
        registrationStartDate: validatedData.registrationStartDate
          ? new Date(validatedData.registrationStartDate)
          : undefined,
        registrationEndDate: validatedData.registrationEndDate
          ? new Date(validatedData.registrationEndDate)
          : undefined,
        maxParticipants: validatedData.maxParticipants,
        coverImage: validatedData.coverImage,
        images: validatedData.images,
        rules: validatedData.rules,
        termsUrl: validatedData.termsUrl,
        website: validatedData.website,
      },
    })

    return NextResponse.json({
      success: true,
      data: event,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Dados inválidos", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error updating event:", error)
    return NextResponse.json(
      { success: false, error: "Falha ao atualizar evento" },
      { status: 500 }
    )
  }
}

// DELETE /api/events/[id] - Deletar evento (sem autenticação para testes)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Buscar evento
    const existingEvent = await prisma.event.findUnique({
      where: { id: params.id },
      select: { id: true, organizerId: true, title: true },
    })

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, error: "Evento não encontrado" },
        { status: 404 }
      )
    }

    await prisma.event.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: "Evento excluído com sucesso",
    })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json(
      { success: false, error: "Falha ao excluir evento" },
      { status: 500 }
    )
  }
}
