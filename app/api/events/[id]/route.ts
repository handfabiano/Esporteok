import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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

// PUT /api/events/[id] - Atualizar evento
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // TODO: Adicionar autenticação e verificar se o usuário é o organizador

    const event = await prisma.event.update({
      where: {
        id: params.id,
      },
      data: {
        title: body.title,
        description: body.description,
        type: body.type,
        status: body.status,
        city: body.city,
        state: body.state,
        address: body.address,
        venue: body.venue,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        registrationStartDate: body.registrationStartDate
          ? new Date(body.registrationStartDate)
          : undefined,
        registrationEndDate: body.registrationEndDate
          ? new Date(body.registrationEndDate)
          : undefined,
        maxParticipants: body.maxParticipants,
        coverImage: body.coverImage,
        images: body.images,
        rules: body.rules,
        termsUrl: body.termsUrl,
        website: body.website,
      },
    })

    return NextResponse.json({
      success: true,
      data: event,
    })
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update event",
      },
      { status: 500 }
    )
  }
}

// DELETE /api/events/[id] - Deletar evento
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Adicionar autenticação e verificar se o usuário é o organizador

    await prisma.event.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete event",
      },
      { status: 500 }
    )
  }
}
