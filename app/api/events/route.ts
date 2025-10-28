import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { z } from "zod"

const createEventSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  slug: z.string().optional(),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  type: z.enum(["CORRIDA", "CICLISMO", "NATACAO", "TRIATLO", "MTB", "TRAIL_RUNNING", "CAMINHADA", "OUTROS"]),
  status: z.enum(["DRAFT", "PUBLISHED", "ONGOING", "COMPLETED", "CANCELLED"]).default("DRAFT"),
  city: z.string().min(2),
  state: z.string().length(2),
  address: z.string().optional(),
  venue: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  registrationStartDate: z.string().datetime(),
  registrationEndDate: z.string().datetime(),
  maxParticipants: z.number().int().positive().optional(),
  coverImage: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  rules: z.string().optional(),
  termsUrl: z.string().url().optional(),
  website: z.string().url().optional(),
})

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

// POST /api/events - Criar novo evento (DEPRECIADO - usar /api/organizador/events)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Autenticação necessária" },
        { status: 401 }
      )
    }

    if (session.user.role !== "ORGANIZER" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Apenas organizadores podem criar eventos" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = createEventSchema.parse(body)

    const event = await prisma.event.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug || validatedData.title.toLowerCase().replace(/\s+/g, "-"),
        description: validatedData.description,
        type: validatedData.type,
        status: validatedData.status,
        city: validatedData.city,
        state: validatedData.state,
        address: validatedData.address,
        venue: validatedData.venue,
        startDate: new Date(validatedData.startDate),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        registrationStartDate: new Date(validatedData.registrationStartDate),
        registrationEndDate: new Date(validatedData.registrationEndDate),
        maxParticipants: validatedData.maxParticipants,
        coverImage: validatedData.coverImage,
        images: validatedData.images || [],
        rules: validatedData.rules,
        termsUrl: validatedData.termsUrl,
        website: validatedData.website,
        organizerId: session.user.id, // Usa o ID do usuário autenticado
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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Dados inválidos", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating event:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Falha ao criar evento",
      },
      { status: 500 }
    )
  }
}
