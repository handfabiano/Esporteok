import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { z } from "zod"

const createRegistrationSchema = z.object({
  eventId: z.string().cuid(),
  categoryId: z.string().cuid(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  medicalInfo: z.string().optional(),
  shirtSize: z.enum(["PP", "P", "M", "G", "GG", "XG"]).optional(),
})

// POST /api/registrations - Criar nova inscrição
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Autenticação necessária" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createRegistrationSchema.parse(body)

    // Verificar se o evento existe e está aberto para inscrições
    const event = await prisma.event.findUnique({
      where: { id: validatedData.eventId },
      include: { categories: true },
    })

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Evento não encontrado" },
        { status: 404 }
      )
    }

    if (event.status !== "PUBLISHED") {
      return NextResponse.json(
        { success: false, error: "Evento não está aberto para inscrições" },
        { status: 400 }
      )
    }

    const now = new Date()
    if (now < event.registrationStartDate || now > event.registrationEndDate) {
      return NextResponse.json(
        { success: false, error: "Período de inscrições encerrado" },
        { status: 400 }
      )
    }

    // Verificar se a categoria existe
    const category = event.categories.find((c) => c.id === validatedData.categoryId)
    if (!category) {
      return NextResponse.json(
        { success: false, error: "Categoria não encontrada" },
        { status: 404 }
      )
    }

    // Verificar se ainda há vagas disponíveis
    if (category.maxSlots && category.availableSlots <= 0) {
      return NextResponse.json(
        { success: false, error: "Não há mais vagas disponíveis para esta categoria" },
        { status: 400 }
      )
    }

    // Verificar se o usuário já está inscrito neste evento
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        userId: session.user.id,
        eventId: validatedData.eventId,
      },
    })

    if (existingRegistration) {
      return NextResponse.json(
        { success: false, error: "Você já está inscrito neste evento" },
        { status: 400 }
      )
    }

    const registration = await prisma.registration.create({
      data: {
        userId: session.user.id, // Usa o ID do usuário autenticado
        eventId: validatedData.eventId,
        categoryId: validatedData.categoryId,
        status: "PENDING",
        emergencyContact: validatedData.emergencyContact,
        emergencyPhone: validatedData.emergencyPhone,
        medicalInfo: validatedData.medicalInfo,
        shirtSize: validatedData.shirtSize,
      },
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
      },
    })

    // Criar registro de pagamento pendente
    const payment = await prisma.payment.create({
      data: {
        registrationId: registration.id,
        amount: registration.category.price,
        status: "PENDING",
      },
    })

    // Decrementar vagas disponíveis
    await prisma.category.update({
      where: { id: validatedData.categoryId },
      data: {
        availableSlots: {
          decrement: 1,
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          registration,
          payment,
        },
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

    console.error("Error creating registration:", error)
    return NextResponse.json(
      { success: false, error: "Falha ao criar inscrição" },
      { status: 500 }
    )
  }
}

// GET /api/registrations - Listar inscrições do usuário autenticado
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Autenticação necessária" },
        { status: 401 }
      )
    }

    const registrations = await prisma.registration.findMany({
      where: {
        userId: session.user.id, // Usa o ID do usuário autenticado
      },
      include: {
        event: true,
        category: true,
        payment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      success: true,
      data: registrations,
    })
  } catch (error) {
    console.error("Error fetching registrations:", error)
    return NextResponse.json(
      { success: false, error: "Falha ao buscar inscrições" },
      { status: 500 }
    )
  }
}
