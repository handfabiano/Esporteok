import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Não autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { registrationId } = body

    // Buscar inscrição com detalhes
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        event: true,
        category: true,
        user: true,
        payment: true,
      },
    })

    if (!registration) {
      return NextResponse.json(
        { success: false, error: "Inscrição não encontrada" },
        { status: 404 }
      )
    }

    if (registration.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Não autorizado" },
        { status: 403 }
      )
    }

    // Verificar se já existe pagamento
    if (registration.payment && registration.payment.status === "APPROVED") {
      return NextResponse.json(
        { success: false, error: "Esta inscrição já foi paga" },
        { status: 400 }
      )
    }

    // Criar ou buscar Stripe Customer
    let stripeCustomerId = registration.user.stripeCustomerId

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: registration.user.email,
        name: registration.user.name || undefined,
        metadata: {
          userId: registration.user.id,
        },
      })

      stripeCustomerId = customer.id

      // Atualizar usuário com Stripe Customer ID
      await prisma.user.update({
        where: { id: registration.user.id },
        data: { stripeCustomerId: customer.id },
      })
    }

    // Criar Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(registration.category.price * 100), // Centavos
      currency: "brl",
      customer: stripeCustomerId,
      metadata: {
        registrationId: registration.id,
        eventId: registration.eventId,
        categoryId: registration.categoryId,
        userId: registration.userId,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // Atualizar ou criar Payment
    if (registration.payment) {
      await prisma.payment.update({
        where: { id: registration.payment.id },
        data: {
          paymentIntentId: paymentIntent.id,
          stripeCustomerId,
          metadata: paymentIntent.metadata,
        },
      })
    } else {
      await prisma.payment.create({
        data: {
          registrationId: registration.id,
          amount: registration.category.price,
          paymentIntentId: paymentIntent.id,
          stripeCustomerId,
          status: "PENDING",
          metadata: paymentIntent.metadata,
        },
      })
    }

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao criar pagamento" },
      { status: 500 }
    )
  }
}
