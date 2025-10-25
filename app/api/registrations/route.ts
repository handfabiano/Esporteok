import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST /api/registrations - Criar nova inscrição
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // TODO: Adicionar autenticação para pegar o userId do usuário logado
    // TODO: Validar se ainda há vagas disponíveis
    // TODO: Integrar com sistema de pagamento

    const registration = await prisma.registration.create({
      data: {
        userId: body.userId, // TODO: Pegar do usuário autenticado
        eventId: body.eventId,
        categoryId: body.categoryId,
        status: "PENDING",
        emergencyContact: body.emergencyContact,
        emergencyPhone: body.emergencyPhone,
        medicalInfo: body.medicalInfo,
        shirtSize: body.shirtSize,
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
    console.error("Error creating registration:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create registration",
      },
      { status: 500 }
    )
  }
}

// GET /api/registrations - Listar inscrições do usuário
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    // TODO: Pegar userId do usuário autenticado
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "User ID is required",
        },
        { status: 400 }
      )
    }

    const registrations = await prisma.registration.findMany({
      where: {
        userId: userId,
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
      {
        success: false,
        error: "Failed to fetch registrations",
      },
      { status: 500 }
    )
  }
}
