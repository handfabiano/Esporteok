import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/events - Listar todos os eventos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type")
    const city = searchParams.get("city")
    const status = searchParams.get("status") || "PUBLISHED"

    const where: any = {
      status: status,
    }

    if (type) {
      where.type = type
    }

    if (city) {
      where.city = {
        contains: city,
        mode: "insensitive",
      }
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        categories: true,
        _count: {
          select: {
            registrations: true,
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    })

    return NextResponse.json({
      success: true,
      data: events,
    })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch events",
      },
      { status: 500 }
    )
  }
}

// POST /api/events - Criar novo evento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // TODO: Adicionar autenticação e validação com Zod
    // Por enquanto, vamos usar um organizerId fixo para teste

    const event = await prisma.event.create({
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/\s+/g, "-"),
        description: body.description,
        type: body.type,
        status: body.status || "DRAFT",
        city: body.city,
        state: body.state,
        address: body.address,
        venue: body.venue,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        registrationStartDate: new Date(body.registrationStartDate),
        registrationEndDate: new Date(body.registrationEndDate),
        maxParticipants: body.maxParticipants,
        coverImage: body.coverImage,
        images: body.images || [],
        rules: body.rules,
        termsUrl: body.termsUrl,
        website: body.website,
        organizerId: body.organizerId, // TODO: Pegar do usuário autenticado
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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
        error: "Failed to create event",
      },
      { status: 500 }
    )
  }
}
